#!/usr/bin/env python3
"""
Seslendirme hattı (ücretsiz, yerel):
  replik listesi (JSON) -> Chatterbox Multilingual (MIT) ile Türkçe ses
  -> Whisper ile kalite kontrol (yanlış okunduysa yeniden üretir)
  -> kelime zamanları (altyazı senkronu)
  -> Türkçe fonetik dudak senkronu (viseme listesi)
  -> -14 LUFS'a uygun seviye, public/voice/<bolum>/ altına yazar.

Kullanım:
  /opt/tts/venv/bin/python tools/seslendir.py data/bolum1.lines.json
Girdi formatı:
  {"episode": "b1", "lines": [{"id": "s1_01", "voice": "genc_kadin", "emotion": "uzgun", "text": "..."}]}
Çıktı: public/voice/b1/<id>.wav ve public/voice/b1/manifest.json
Aynı metin/ses/duygu için tekrar üretmez (önbellek).
"""
import hashlib
import json
import os
import re
import sys
from difflib import SequenceMatcher

import librosa
import numpy as np
import pyloudnorm as pyln
import soundfile as sf
import torch

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICES = os.path.join(ROOT, "voices")

# Duygu -> Chatterbox parametreleri (+ isteğe bağlı son işlem)
EMOTIONS = {
    "notr": dict(exaggeration=0.5, cfg_weight=0.5, temperature=0.8),
    "ic_ses": dict(exaggeration=0.4, cfg_weight=0.4, temperature=0.7),
    "sakin": dict(exaggeration=0.35, cfg_weight=0.45, temperature=0.7),
    "mutlu": dict(exaggeration=0.8, cfg_weight=0.5, temperature=0.85),
    "heyecanli": dict(exaggeration=1.0, cfg_weight=0.55, temperature=0.85),
    "uzgun": dict(exaggeration=0.65, cfg_weight=0.3, temperature=0.75),
    "agliyor": dict(exaggeration=0.95, cfg_weight=0.25, temperature=0.8),
    "korkmus": dict(exaggeration=0.9, cfg_weight=0.35, temperature=0.8),
    "ofkeli": dict(exaggeration=1.15, cfg_weight=0.5, temperature=0.85),
    "bagiriyor": dict(exaggeration=1.5, cfg_weight=0.6, temperature=0.85),
    "alayci": dict(exaggeration=0.75, cfg_weight=0.45, temperature=0.85),
    "soguk": dict(exaggeration=0.3, cfg_weight=0.5, temperature=0.6),
    "fisilti": dict(exaggeration=0.3, cfg_weight=0.3, temperature=0.7),
}

# Türkçe harf -> ağız şekli. Türkçe yazıldığı gibi okunduğu için harf bazlı eşleme güvenilir.
#   X kapalı/dinlenme, A geniş açık, E yayvan, I dar yayvan, O yuvarlak, U küçük yuvarlak,
#   M dudaklar bitişik (m,b,p), F alt dudak dişte (f,v), L hafif açık diş görünür (diğer ünsüzler)
VISEME = {}
for ch in "aâ":
    VISEME[ch] = "A"
for ch in "e":
    VISEME[ch] = "E"
for ch in "iıîy":
    VISEME[ch] = "I"
for ch in "oö":
    VISEME[ch] = "O"
for ch in "uüû":
    VISEME[ch] = "U"
for ch in "mbp":
    VISEME[ch] = "M"
for ch in "fv":
    VISEME[ch] = "F"
for ch in "lnrtdszşcçjkgğh":
    VISEME[ch] = "L"

FPS_HINT = 30


def _num(m):
    from num2words import num2words

    return num2words(int(m.group(0)), lang="tr")


def norm(s: str) -> str:
    s = re.sub(r"\d+", _num, s)
    s = s.replace("I", "ı").replace("İ", "i").lower()
    s = re.sub(r"[^a-zçğıöşüâîû0-9 ]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def visemes_for_words(words, wav, sr):
    """words: [{w, start, end}] -> [{t, v}] (saniye). Harfleri kelime süresine yayar,
    sessiz bölgelerde ağzı kapatır."""
    cues = []
    hop = int(sr / FPS_HINT)
    rms = librosa.feature.rms(y=wav, frame_length=hop * 2, hop_length=hop)[0]
    thr = max(1e-4, np.percentile(rms, 25) * 1.2)

    def loud(t):
        i = min(len(rms) - 1, max(0, int(t * FPS_HINT)))
        return rms[i] > thr

    for w in words:
        letters = [c for c in norm(w["w"]) if c in VISEME]
        if not letters:
            continue
        dur = max(0.05, w["end"] - w["start"])
        step = dur / len(letters)
        for i, c in enumerate(letters):
            t = w["start"] + i * step
            v = VISEME[c]
            if not loud(t + step / 2) and v in ("A", "E", "O"):
                v = "L"  # sesli harf kısık söyleniyorsa ağzı az aç
            cues.append({"t": round(t, 3), "v": v})
        cues.append({"t": round(w["end"], 3), "v": "X"})
    # ardışık aynı şekilleri birleştir
    cues = sorted(cues, key=lambda c: c["t"])
    # kelimeler arası çok kısa duraklarda ağzı kapatma
    cues = [c for i, c in enumerate(cues) if not (c["v"] == "X" and i + 1 < len(cues) and cues[i + 1]["t"] - c["t"] < 0.08)]
    out = []
    for c in cues:
        if out and out[-1]["v"] == c["v"]:
            continue
        out.append(c)
    return out


def align_words(text, asr_words):
    """Orijinal yazımı koruyarak Whisper kelime zamanlarını metne eşle."""
    orig = text.split()
    if not asr_words:
        return []
    if len(asr_words) == len(orig):
        return [{"w": o, "start": a["start"], "end": a["end"]} for o, a in zip(orig, asr_words)]
    # Kelime sayısı farklıysa: toplam süreyi harf uzunluğuna göre paylaştır
    t0, t1 = asr_words[0]["start"], asr_words[-1]["end"]
    lens = [max(1, len(norm(o))) for o in orig]
    tot = sum(lens)
    out, t = [], t0
    for o, l in zip(orig, lens):
        d = (t1 - t0) * l / tot
        out.append({"w": o, "start": round(t, 3), "end": round(t + d, 3)})
        t += d
    return out


def from_episode(script):
    """Bölüm senaryosundan (public/episodes/<id>.json) replik listesi çıkarır.
    Replik id'si: <sahne_id>_<vuruş no 2 hane> (engine/types.ts lineId ile aynı)."""
    cast = {c["id"]: c for c in json.load(open(os.path.join(ROOT, "src", "studio", "cast.json"), encoding="utf-8"))}
    lines = []
    for sc in script["scenes"]:
        state = {k: dict(v) for k, v in sc.get("cast", {}).items()}
        for i, b in enumerate(sc["beats"]):
            for k, v in (b.get("cast") or {}).items():
                state.setdefault(k, {}).update(v)
            if b.get("type") != "line":
                continue
            who = b["who"]
            emo = b.get("emotion") or ("ic_ses" if b.get("voiceover") else None) or state.get(who, {}).get("emotion") or "notr"
            if emo not in EMOTIONS:
                emo = {"saskin": "korkmus", "sok": "korkmus", "gulen": "mutlu", "kararli": "soguk", "supheli": "soguk", "yorgun": "sakin", "dusunceli": "sakin", "utangac": "sakin", "igrenmis": "ofkeli"}.get(emo, "notr")
            lines.append({"id": f"{sc['id']}_{i + 1:02d}", "voice": cast[who]["voice"], "emotion": emo, "text": b["text"]})
    return {"episode": script["episode"], "lines": lines}


def main():
    spec = json.load(open(sys.argv[1], encoding="utf-8"))
    if "scenes" in spec:
        spec = from_episode(spec)
    ep = spec["episode"]
    outdir = os.path.join(ROOT, "public", "voice", ep)
    os.makedirs(outdir, exist_ok=True)
    man_path = os.path.join(outdir, "manifest.json")
    manifest = json.load(open(man_path, encoding="utf-8")) if os.path.exists(man_path) else {}

    tts = None
    asr = None
    meter = None

    for line in spec["lines"]:
        lid, voice, emo, text = line["id"], line["voice"], line.get("emotion", "notr"), line["text"]
        key = hashlib.sha1(f"{voice}|{emo}|{text}|v2".encode()).hexdigest()[:12]
        wav_path = os.path.join(outdir, f"{lid}.wav")
        if manifest.get(lid, {}).get("key") == key and os.path.exists(wav_path):
            print(f"= {lid} (önbellek)")
            continue
        if tts is None:
            from chatterbox.mtl_tts import ChatterboxMultilingualTTS
            from faster_whisper import WhisperModel

            tts = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
            asr = WhisperModel("small", device="cpu", compute_type="int8")
        ref = os.path.join(VOICES, f"ref_{voice}.wav")
        params = EMOTIONS.get(emo, EMOTIONS["notr"])
        best = None
        for attempt in range(3):
            torch.manual_seed(1000 + attempt * 77 + int(key[:4], 16))
            wav = tts.generate(text, language_id="tr", audio_prompt_path=ref, **params)
            y = wav.squeeze().numpy().astype(np.float32)
            sr = tts.sr
            y16 = librosa.resample(y, orig_sr=sr, target_sr=16000)
            segs, _ = asr.transcribe(y16, language="tr", word_timestamps=True)
            segs = list(segs)
            heard = " ".join(s.text.strip() for s in segs)
            score = SequenceMatcher(None, norm(text).replace(" ", ""), norm(heard).replace(" ", "")).ratio()
            words = [{"start": w.start, "end": w.end} for s in segs for w in (s.words or [])]
            if best is None or score > best[0]:
                best = (score, y, sr, heard, words)
            print(f"  {lid} deneme {attempt + 1}: benzerlik {score:.2f} | duyulan: {heard}")
            if score >= 0.9:
                break
        score, y, sr, heard, words = best
        # sessiz baş/son kırp, küçük nefes payı bırak
        yt, idx = librosa.effects.trim(y, top_db=40)
        pad0 = min(idx[0], int(0.08 * sr))
        y = y[idx[0] - pad0 : idx[1] + int(0.12 * sr)]
        shift = (idx[0] - pad0) / sr
        words = [{"start": max(0, w["start"] - shift), "end": max(0, w["end"] - shift)} for w in words]
        if emo == "fisilti":
            import scipy.signal as sg

            b, a = sg.butter(2, 900 / (sr / 2), "highpass")
            y = sg.lfilter(b, a, y).astype(np.float32) * 0.8
        # diyalog seviyesi: -16 LUFS (son mikste -14 LUFS hedefi için pay)
        if meter is None:
            meter = pyln.Meter(sr)
        loud = meter.integrated_loudness(y) if len(y) > sr * 0.5 else -20
        if np.isfinite(loud):
            y = pyln.normalize.loudness(y, loud, -16.0)
        y = np.clip(y, -0.95, 0.95)
        sf.write(wav_path, y, sr)
        aligned = align_words(text, words)
        manifest[lid] = {
            "key": key,
            "file": f"voice/{ep}/{lid}.wav",
            "voice": voice,
            "emotion": emo,
            "text": text,
            "duration": round(len(y) / sr, 3),
            "asrScore": round(score, 3),
            "heard": heard,
            "words": aligned,
            "mouth": visemes_for_words(aligned, y, sr),
        }
        json.dump(manifest, open(man_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        flag = "" if score >= 0.85 else "  <-- KONTROL ET"
        print(f"+ {lid} {manifest[lid]['duration']}s skor {score:.2f}{flag}")

    json.dump(manifest, open(man_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    low = [k for k, v in manifest.items() if v["asrScore"] < 0.85]
    print("Bitti.", len(manifest), "replik.", ("Kontrol edilmesi gerekenler: " + ", ".join(low)) if low else "Hepsi temiz.")


if __name__ == "__main__":
    main()
