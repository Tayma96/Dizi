#!/usr/bin/env python3
"""Üretilmiş replikleri yerel Whisper ile dinleyip senaryo metniyle karşılaştırır (ücretsiz, kredi harcamaz).
Kullanım: /opt/tts/venv/bin/python tools/ses_kontrol.py <bolum-id>
Benzerliği 0.85'in altındaki replikleri listeler; yeniden üretmek için:
  python3 tools/elevenlabs.py seslendir public/episodes/<id>.json --yeniden s1_02,s3_01 --onayla"""
import json, os, re, sys
from difflib import SequenceMatcher
import librosa
from faster_whisper import WhisperModel
from num2words import num2words

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def norm(s):
    s = re.sub(r"\d+", lambda m: num2words(int(m.group(0)), lang="tr"), s)
    s = s.replace("I", "ı").replace("İ", "i").lower()
    return re.sub(r"[^a-zçğıöşüâîû]", "", s)

ep = sys.argv[1]
man_path = os.path.join(ROOT, "public", "voice", ep, "manifest.json")
man = json.load(open(man_path, encoding="utf-8"))
asr = WhisperModel("small", device="cpu", compute_type="int8")
bad = []
for lid, v in sorted(man.items()):
    y, _ = librosa.load(os.path.join(ROOT, "public", v["file"]), sr=16000)
    segs, _ = asr.transcribe(y, language="tr")
    heard = " ".join(s.text.strip() for s in segs)
    score = SequenceMatcher(None, norm(v["text"]), norm(heard)).ratio()
    v["asrScore"], v["heard"] = round(score, 3), heard
    flag = "" if score >= 0.85 else "  <-- KONTROL ET"
    print(f"{lid}: {score:.2f} | {heard}{flag}")
    if score < 0.85:
        bad.append(lid)
json.dump(man, open(man_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("Sorunlu:", ",".join(bad) if bad else "yok")
