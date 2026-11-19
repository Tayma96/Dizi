#!/usr/bin/env python3
"""
ElevenLabs seslendirme aracı — KREDİ BÜTÇESİ KORUMALI, ÇOK HESAPLI.

Altın kural: Hiçbir istek, hesabın kalan kredisini aşamaz (aşım/overage asla). Varsayılan "kuru çalıştırma":
önce maliyeti gösterir, gerçekten harcamak için --onayla gerekir.

Komutlar
  durum                                  Hesapların kalan kredisi, aşım (overage) ayarı
  oyuncu-sec [--cinsiyet f|m] [--sayfa N]  Ücretsiz önizlemelerle Türkçe ses kataloğu (docs/ses-kadrosu.html)
  ata <karakter> <voice_id> [--sahip <public_owner_id>] [--ad <isim>]   Karaktere ses ata
  seslendir <bolum.json> [--model eleven_v4] [--onayla] [--butce N] [--yeniden ID,ID]
  efekt "<İngilizce tarif>" <isim> [--sure 5] [--onayla]               Ses efekti üret (ElevenLabs SFX)
  replikler <bolum.json>                 Replik listesi (id, karakter, ses id, model metni) — MCP bağlayıcısıyla elle üretim için
  ice-aktar <bolum.json>                 public/voice/<bolum>/gelen/<id>.(mp3|wav) dosyalarını (ör. ElevenLabs MCP bağlayıcısıyla
                                         üretilmiş) içeri alır: seviye, kelime zamanları, dudak senkronu, manifest

Hesaplar (anahtarlar ASLA repoya girmez):
  1) Yerel dosya dizi-studio/.elevenlabs.json  (git'e girmez):
       {"hesaplar": [{"ad": "hesap1", "anahtar": "sk_...", "yedek": 100},
                     {"ad": "hesap2", "anahtar": "sk_...", "yedek": 300}]}
     Sıra önemlidir: önce hesap1 harcanır; kalan kredisi işe yetmezse hesap2'ye geçilir.
  2) Ya da ortam değişkeni ELEVENLABS_API_KEY (tek hesap).
  3) Claude Code bulut oturumunda anahtar ağ geçidine (api.elevenlabs.io, xi-api-key başlığı) kayıtlıysa
     anahtar gerekmez; araç "proxy" adlı tek hesapla çalışır.

Çıktı: public/voice/<bolum>/<id>.mp3 + manifest.json (Chatterbox hattıyla aynı biçim → motor değişmeden çalışır).
Replik id'leri: <sahne_id>_<vuruş no> (engine/types.ts lineId).
Bağımlılık: yalnızca Python standart kütüphanesi + ffmpeg. --sahte bayrağı API'ye gitmeden tüm hattı test eder.
"""
import argparse
import base64
import hashlib
import html
import json
import os
import re
import ssl
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(ROOT)
API = "https://api.elevenlabs.io"
CONF = os.path.join(ROOT, ".elevenlabs.json")
STATE = os.path.join(ROOT, ".elevenlabs-durum.json")  # hesap başına eklenmiş ses id'leri, harcama kaydı (git'e girmez)
VOICES = os.path.join(ROOT, "src", "studio", "sesler_elevenlabs.json")  # karakter → ses (repoda; anahtar içermez)
CAST = os.path.join(ROOT, "src", "studio", "cast.json")

# Model başına tahmini kredi/karakter (gerçek maliyet ilk istekten sonra abonelik farkıyla kalibre edilir)
COST = {"eleven_v4": 1.0, "eleven_v4_turbo": 0.5, "eleven_v3": 1.0, "eleven_v3_conversational": 1.0, "eleven_multilingual_v2": 1.0, "eleven_flash_v2_5": 0.5}
TAG_MODELS = {"eleven_v4", "eleven_v4_turbo", "eleven_v3", "eleven_v3_conversational"}
LANG_MODELS = {"eleven_v4", "eleven_v4_turbo", "eleven_v3", "eleven_v3_conversational", "eleven_flash_v2_5"}

# Duygu → (v3/v4 ses etiketi, v2 ayarları)
EMO = {
    "notr": ("", dict(stability=0.5, style=0.0)),
    "ic_ses": ("[softly]", dict(stability=0.55, style=0.15)),
    "sakin": ("[calmly]", dict(stability=0.6, style=0.05)),
    "mutlu": ("[happy]", dict(stability=0.45, style=0.35)),
    "heyecanli": ("[excited]", dict(stability=0.35, style=0.5)),
    "uzgun": ("[sad]", dict(stability=0.4, style=0.45)),
    "agliyor": ("[crying]", dict(stability=0.3, style=0.6)),
    "korkmus": ("[nervous]", dict(stability=0.35, style=0.5)),
    "ofkeli": ("[angry]", dict(stability=0.3, style=0.6)),
    "bagiriyor": ("[shouting]", dict(stability=0.25, style=0.7)),
    "alayci": ("[sarcastic]", dict(stability=0.45, style=0.45)),
    "soguk": ("[coldly]", dict(stability=0.7, style=0.1)),
    "fisilti": ("[whispers]", dict(stability=0.5, style=0.2)),
    # film açılışı anlatımı (başrolün kendi dış sesi): sakin, içten, ağır
    "anlatim": ("[calm, reflective narration]", dict(stability=0.6, style=0.2)),
    # baş ağrısı, sersem uyanış
    "aci": ("[groggy, in pain]", dict(stability=0.35, style=0.5)),
}
EMO_FALLBACK = {"saskin": "korkmus", "sok": "korkmus", "gulen": "mutlu", "kararli": "soguk", "supheli": "soguk", "yorgun": "sakin", "dusunceli": "sakin", "utangac": "sakin", "igrenmis": "ofkeli"}

# Türkçe harf → ağız şekli (seslendir.py ile aynı)
VIS = {}
for ch in "aâ": VIS[ch] = "A"
for ch in "e": VIS[ch] = "E"
for ch in "iıîy": VIS[ch] = "I"
for ch in "oö": VIS[ch] = "O"
for ch in "uüû": VIS[ch] = "U"
for ch in "mbp": VIS[ch] = "M"
for ch in "fv": VIS[ch] = "F"
for ch in "lnrtdszşcçjkgğh": VIS[ch] = "L"


def say(*a):
    print(*a, flush=True)


def lower_tr(s):
    return s.replace("I", "ı").replace("İ", "i").lower()


# ------------------------------------------------------------------ hesaplar & HTTP
def ssl_ctx():
    ca = os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE")
    return ssl.create_default_context(cafile=ca) if ca and os.path.exists(ca) else ssl.create_default_context()


def accounts():
    if os.path.exists(CONF):
        c = json.load(open(CONF, encoding="utf-8"))
        return [{"ad": h["ad"], "anahtar": h["anahtar"], "yedek": int(h.get("yedek", 100))} for h in c["hesaplar"]]
    if os.environ.get("ELEVENLABS_API_KEY"):
        return [{"ad": "env", "anahtar": os.environ["ELEVENLABS_API_KEY"], "yedek": 100}]
    # bulut oturumu: ağ geçidi gerçek anahtarı ekler
    return [{"ad": "proxy", "anahtar": "proxy-tarafindan-eklenir", "yedek": 100}]


def http(acct, method, path, body=None, query=None, raw=False, fake=False):
    if fake:
        return fake_api(method, path, body, query)
    url = API + path + ("?" + urllib.parse.urlencode(query) if query else "")
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={"xi-api-key": acct["anahtar"], "Content-Type": "application/json", "Accept": "*/*"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180, context=ssl_ctx()) as r:
                payload = r.read()
                hdr = dict(r.headers)
                return (payload, hdr) if raw else (json.loads(payload.decode() or "{}"), hdr)
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="ignore")[:500]
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(5 * (attempt + 1))
                continue
            raise SystemExit(f"HATA {e.code} {path}: {msg}")
    raise SystemExit("HATA: istek tekrarları tükendi")


def subscription(acct, fake=False):
    s, _ = http(acct, "GET", "/v1/user/subscription", fake=fake)
    remaining = int(s.get("character_limit", 0)) - int(s.get("character_count", 0))
    return {
        "kalan": remaining,
        "limit": s.get("character_limit"),
        "kullanilan": s.get("character_count"),
        "asim_acik": bool(s.get("can_extend_character_limit")) and s.get("max_credit_limit_extension") not in (0, "0", None),
        "tier": s.get("tier"),
        "sifirlanma": s.get("next_character_count_reset_unix"),
    }


def load_state():
    return json.load(open(STATE, encoding="utf-8")) if os.path.exists(STATE) else {"sesler": {}, "harcama": []}


def save_state(st):
    json.dump(st, open(STATE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


# ------------------------------------------------------------------ sahte API (test)
def fake_api(method, path, body, query):
    if path == "/v1/user/subscription":
        st = load_state()
        used = sum(h["kredi"] for h in st.get("harcama", []) if h.get("sahte"))
        return {"character_limit": 6000, "character_count": used, "can_extend_character_limit": True, "max_credit_limit_extension": "unlimited", "tier": "sahte"}, {}
    if path.startswith("/v1/shared-voices"):
        return {"voices": [{"voice_id": f"sahte{i}", "public_owner_id": "sahip", "name": f"Sahte Ses {i}", "gender": "female" if i % 2 else "male", "age": ["young", "middle_aged", "old"][i % 3], "accent": "turkish", "language": "tr", "descriptive": "warm", "use_case": "narrative_story", "preview_url": ""} for i in range(6)], "has_more": False}, {}
    if path.startswith("/v1/voices/add/"):
        return {"voice_id": path.split("/")[-1]}, {}
    if "/with-timestamps" in path:
        text = body["text"]
        clean = re.sub(r"\[[^\]]*\]\s*", "", text)
        dur = max(1.0, len(clean) * 0.07)
        tmp = "/tmp/elevenlabs-sahte.mp3"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"sine=f=220:d={dur}", "-ar", "44100", tmp], check=True)
        audio = base64.b64encode(open(tmp, "rb").read()).decode()
        chars = list(text)
        step = dur / max(1, len(chars))
        return {"audio_base64": audio, "alignment": {"characters": chars, "character_start_times_seconds": [i * step for i in range(len(chars))], "character_end_times_seconds": [(i + 1) * step for i in range(len(chars))]}}, {"character-cost": str(len(text))}
    if path.startswith("/v1/sound-generation"):
        tmp = "/tmp/elevenlabs-sahte-sfx.mp3"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anoisesrc=d=2:c=pink", tmp], check=True)
        return open(tmp, "rb").read(), {}
    raise SystemExit(f"sahte API: bilinmeyen yol {path}")


# ------------------------------------------------------------------ bütçe
def pick_account(need, fake=False):
    """Kalan kredisi (yedek payı düşülerek) işe yeten İLK hesabı seçer. Hiçbiri yetmezse durur."""
    rows = []
    for a in accounts():
        sub = subscription(a, fake)
        usable = sub["kalan"] - a["yedek"]
        rows.append((a, sub, usable))
        if usable >= need:
            return a, sub, rows
    return None, None, rows


def cmd_durum(args):
    for a in accounts():
        s = subscription(a, args.sahte)
        warn = "  ⚠️ AŞIM (usage-based billing) AÇIK — ElevenLabs ayarlarından kapatın!" if s["asim_acik"] else "  ✓ aşım kapalı"
        say(f"{a['ad']}: kalan {s['kalan']} / {s['limit']} kredi (yedek pay {a['yedek']}), plan {s['tier']}{warn}")
        if s["sifirlanma"]:
            say(f"   sıfırlanma: {time.strftime('%Y-%m-%d', time.localtime(int(s['sifirlanma'])))}")
    st = load_state()
    if st["harcama"]:
        tot = sum(h["kredi"] for h in st["harcama"] if not h.get("sahte"))
        say(f"Bu araçla toplam harcanan (kayıt): {tot} kredi")


# ------------------------------------------------------------------ oyuncu seçimi (ücretsiz önizleme)
def cmd_oyuncu_sec(args):
    acct = accounts()[0]
    q = {"page_size": 100, "language": "tr", "page": args.sayfa}
    if args.cinsiyet:
        q["gender"] = {"f": "female", "m": "male"}[args.cinsiyet]
    res, _ = http(acct, "GET", "/v1/shared-voices", query=q, fake=args.sahte)
    voices = res.get("voices", [])
    cast = json.load(open(CAST, encoding="utf-8"))
    assigned = json.load(open(VOICES, encoding="utf-8")) if os.path.exists(VOICES) else {}
    age_map = {"child": "young", "teen": "young", "adult": "middle_aged", "old": "old"}

    def score(c, v):
        s = 0
        if (v.get("gender") or "").startswith("f") == (c["gender"] == "f"):
            s += 5
        if v.get("age") == age_map[c["age"]] or (c["age"] == "adult" and v.get("age") == "young"):
            s += 3
        if "narrat" in (v.get("use_case") or "") or "character" in (v.get("use_case") or ""):
            s += 1
        return s

    out = ["<!doctype html><meta charset=utf-8><title>Ses Kadrosu</title><style>body{font-family:sans-serif;max-width:1000px;margin:auto;padding:16px;background:#faf7f2}"
           "h2{margin-top:28px}td{padding:6px 10px;border-bottom:1px solid #ddd;vertical-align:middle}code{background:#eee;padding:2px 5px}</style>",
           "<h1>Türkçe ses kataloğu — ücretsiz önizlemeler</h1><p>Önizlemeyi dinlemek kredi harcamaz. Beğendiğiniz sesi atamak için: "
           "<code>python3 tools/elevenlabs.py ata &lt;karakter&gt; &lt;voice_id&gt; --sahip &lt;public_owner_id&gt;</code></p>"]
    md = ["# Ses kadrosu önerileri (ElevenLabs, Türkçe)", "", "Önizlemeler ücretsizdir. Seçim sonrası: `python3 tools/elevenlabs.py ata <karakter> <voice_id> --sahip <public_owner_id>`", ""]
    for c in cast:
        # uygunluk puanı + popülerlik (Türk kullanıcıların en çok kullandığı/klonladığı sesler önce)
        pop = lambda v: (v.get("cloned_by_count") or 0) + (v.get("usage_character_count_1y") or 0) / 10000
        ranked = sorted(voices, key=lambda v: (-score(c, v), -pop(v)))[:5]
        cur = assigned.get(c["id"])
        out.append(f"<h2>{html.escape(c['name'])} <small>({html.escape(c['role'])})</small>{' — atanmış: ' + html.escape(cur['ad']) if cur else ''}</h2><table>")
        md.append(f"## {c['name']} — {c['role']}" + (f" (atanmış: {cur['ad']})" if cur else ""))
        for v in ranked:
            prev = v.get("preview_url") or ""
            out.append(f"<tr><td><b>{html.escape(v.get('name',''))}</b><br><small>{html.escape(str(v.get('gender')))}, {html.escape(str(v.get('age')))}, {html.escape(str(v.get('descriptive') or ''))} · kullanım: {int(pop(v))}</small></td>"
                       f"<td>{'<audio controls preload=none src=' + html.escape(prev, quote=True) + '></audio>' if prev else '—'}</td>"
                       f"<td><code>ata {c['id']} {html.escape(v['voice_id'])} --sahip {html.escape(v.get('public_owner_id',''))} --ad \"{html.escape(v.get('name',''))}\"</code></td></tr>")
            md.append(f"- **{v.get('name')}** ({v.get('gender')}, {v.get('age')}, {v.get('descriptive') or ''}) — [önizleme]({prev}) — `ata {c['id']} {v['voice_id']} --sahip {v.get('public_owner_id','')}`")
        out.append("</table>")
        md.append("")
    os.makedirs(os.path.join(REPO, "docs"), exist_ok=True)
    open(os.path.join(REPO, "docs", "ses-kadrosu.html"), "w", encoding="utf-8").write("\n".join(out))
    open(os.path.join(REPO, "docs", "ses-kadrosu.md"), "w", encoding="utf-8").write("\n".join(md))
    say(f"{len(voices)} Türkçe ses bulundu → docs/ses-kadrosu.html ve docs/ses-kadrosu.md (önizlemeler ücretsiz). has_more={res.get('has_more')}")


def cmd_ata(args):
    v = json.load(open(VOICES, encoding="utf-8")) if os.path.exists(VOICES) else {}
    ids = {c["id"] for c in json.load(open(CAST, encoding="utf-8"))}
    if args.karakter not in ids:
        raise SystemExit(f"Bilinmeyen karakter: {args.karakter}")
    v[args.karakter] = {"voice_id": args.voice_id, "sahip": args.sahip, "ad": args.ad or args.voice_id, "ayar": {"similarity_boost": 0.8, "speed": 1.0}}
    json.dump(dict(sorted(v.items())), open(VOICES, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    say(f"✓ {args.karakter} → {v[args.karakter]['ad']} ({args.voice_id})")


def voice_for_account(acct, char, fake=False):
    """Paylaşılan kütüphane sesi o hesapta yoksa ekler (kredi harcamaz, ses yuvası kullanır); hesaba özel id döner."""
    vmap = json.load(open(VOICES, encoding="utf-8"))
    if char not in vmap:
        raise SystemExit(f"'{char}' karakterine ses atanmamış. Önce: python3 tools/elevenlabs.py oyuncu-sec && ... ata {char} <voice_id>")
    entry = vmap[char]
    st = load_state()
    key = f"{acct['ad']}:{entry['voice_id']}"
    if key in st["sesler"]:
        return st["sesler"][key], entry
    vid = entry["voice_id"]
    if entry.get("sahip"):
        try:
            res, _ = http(acct, "POST", f"/v1/voices/add/{entry['sahip']}/{entry['voice_id']}", body={"new_name": f"Dizi-{char}"}, fake=fake)
            vid = res.get("voice_id", vid)
            say(f"  + '{entry['ad']}' sesi {acct['ad']} hesabına eklendi")
        except SystemExit as e:
            if "already" not in str(e).lower():
                say(f"  ! ses eklenemedi ({e}); doğrudan id ile denenecek")
    st["sesler"][key] = vid
    save_state(st)
    return vid, entry


# ------------------------------------------------------------------ seslendirme
def lines_from_episode(script):
    cast = {c["id"]: c for c in json.load(open(CAST, encoding="utf-8"))}
    out = []
    for sc in script["scenes"]:
        state = {k: dict(v) for k, v in sc.get("cast", {}).items()}
        for i, b in enumerate(sc["beats"]):
            for k, v in (b.get("cast") or {}).items():
                state.setdefault(k, {}).update(v)
            if b.get("type") != "line":
                continue
            who = b["who"]
            emo = b.get("emotion") or ("ic_ses" if b.get("voiceover") else None) or state.get(who, {}).get("emotion") or "notr"
            emo = EMO_FALLBACK.get(emo, emo)
            if emo not in EMO:
                emo = "notr"
            if who not in cast:
                raise SystemExit(f"Bilinmeyen karakter: {who}")
            out.append({"id": f"{sc['id']}_{i + 1:02d}", "who": who, "emotion": emo, "text": b["text"], "tags": b.get("tags", ""), "hiz": b.get("hiz"), "fx": b.get("fx")})
    return out


def build_text(line, model):
    tag = EMO[line["emotion"]][0] if model in TAG_MODELS else ""
    extra = line.get("tags", "") if model in TAG_MODELS else ""
    pre = " ".join(t for t in (tag, extra) if t)
    return (pre + " " + line["text"]).strip() if pre else line["text"]


def words_from_alignment(al, text_original):
    """Karakter zamanlarından kelime zamanları; [etiket]ler atlanır. Yazım orijinal metinden korunur."""
    chars = al["characters"]
    st = al["character_start_times_seconds"]
    en = al["character_end_times_seconds"]
    words, cur, t0, t1, inside = [], "", None, None, False
    for c, a, b in zip(chars, st, en):
        if c == "[":
            inside = True
            continue
        if c == "]":
            inside = False
            continue
        if inside:
            continue
        if c.isspace():
            if cur:
                words.append({"w": cur, "start": t0, "end": t1})
            cur, t0 = "", None
            continue
        if t0 is None:
            t0 = a
        cur += c
        t1 = b
    if cur:
        words.append({"w": cur, "start": t0, "end": t1})
    orig = text_original.split()
    if len(orig) == len(words):
        for w, o in zip(words, orig):
            w["w"] = o
    return [{"w": w["w"], "start": round(w["start"], 3), "end": round(w["end"], 3)} for w in words]


def visemes_from_alignment(al):
    cues, inside = [], False
    for c, a, b in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if c == "[":
            inside = True
            continue
        if c == "]":
            inside = False
            continue
        if inside:
            continue
        lc = lower_tr(c)
        if lc in VIS:
            cues.append({"t": round(a, 3), "v": VIS[lc]})
        elif c.isspace() or c in ".,!?…;:":
            cues.append({"t": round(a, 3), "v": "X"})
    cues = sorted(cues, key=lambda x: x["t"])
    cues = [c for i, c in enumerate(cues) if not (c["v"] == "X" and i + 1 < len(cues) and cues[i + 1]["t"] - c["t"] < 0.08)]
    outc = []
    for c in cues:
        if outc and outc[-1]["v"] == c["v"]:
            continue
        outc.append(c)
    if outc:
        outc.append({"t": round(al["character_end_times_seconds"][-1], 3), "v": "X"})
    return outc


# Ses filtreleri (replik alanı "fx"): kapı arkası = boğuk, yankılı (ses yönetmeni ayarı)
FX = {
    "kapi_arkasi": "highpass=f=180,lowpass=f=2000,equalizer=f=350:t=q:w=1.0:g=2,aecho=0.8:0.5:14|31:0.18|0.1,apad=pad_dur=0.3",
    "telefon": "highpass=f=300,lowpass=f=3400,acompressor=threshold=-20dB:ratio=4",
    # kapı arkasından ama yakın (koğuş kapısı): daha az boğuk
    "kapi_arkasi_hafif": "highpass=f=150,lowpass=f=3200,aecho=0.8:0.4:12|25:0.15|0.08,apad=pad_dur=0.3",
    # hafıza flaşı: geniş yankı
    "yanki": "aecho=0.8:0.7:70|140:0.35|0.2,apad=pad_dur=0.5",
    # havalandırma kanalı: metalik, dar bant, kısa tarak yankısı
    "kanal": "highpass=f=350,lowpass=f=3200,aecho=0.8:0.6:7|15|23:0.5|0.35|0.2,apad=pad_dur=0.4",
}


def loudnorm_2pass(src, dst, target=-16.0, extra_af="", ss=0.0):
    """Ölç → doğrusal kazanç → tepe sınırlayıcı (-1.5 dBTP). Kısa kliplerde de hedefe ulaşır
    (tek geçişli loudnorm 3 sn altı kliplerde 3-4 dB kısık bırakıyordu)."""
    pre = (extra_af + ",") if extra_af else ""
    meas = subprocess.run(["ffmpeg", "-hide_banner", "-ss", f"{ss:.3f}", "-i", src, "-af", f"{pre}ebur128=framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", meas)
    cur = float(m[-1]) if m else target
    gain = max(-30.0, min(20.0, target - cur))
    af = f"{pre}volume={gain:.2f}dB,alimiter=limit=0.84:level=false"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{ss:.3f}", "-i", src, "-af", af, "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-q:a", "2", dst], check=True)


def postprocess(raw_path, out_path, fx=None):
    """Baştaki sessizliği kırp, -16 LUFS diyalog seviyesi (kapı arkası gibi filtreliyse -25). Kırpılan süreyi döndürür."""
    det = subprocess.run(["ffmpeg", "-i", raw_path, "-af", "silencedetect=n=-45dB:d=0.05", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.search(r"silence_start: 0(?:\.0+)?\s.*?silence_end: ([\d.]+)", det, re.S)
    lead = max(0.0, float(m.group(1)) - 0.06) if m else 0.0
    loudnorm_2pass(raw_path, out_path, target={"kapi_arkasi": -25.0, "kapi_arkasi_hafif": -19.0, "kanal": -22.0}.get(fx or "", -16.0), extra_af=FX.get(fx or "", ""), ss=lead)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out_path]).strip())
    return lead, dur


def shift(al_words, cues, lead):
    w = [{"w": x["w"], "start": round(max(0, x["start"] - lead), 3), "end": round(max(0, x["end"] - lead), 3)} for x in al_words]
    c = [{"t": round(max(0, x["t"] - lead), 3), "v": x["v"]} for x in cues]
    return w, c


def cmd_seslendir(args):
    script = json.load(open(args.bolum, encoding="utf-8"))
    ep = script["episode"]
    model = args.model
    rate = COST.get(model, 1.0)
    outdir = os.path.join(ROOT, "public", "voice", ep)
    os.makedirs(outdir, exist_ok=True)
    man_path = os.path.join(outdir, "manifest.json")
    manifest = json.load(open(man_path, encoding="utf-8")) if os.path.exists(man_path) else {}
    vmap = json.load(open(VOICES, encoding="utf-8")) if os.path.exists(VOICES) else {}
    redo = set(filter(None, (args.yeniden or "").split(",")))
    lines = lines_from_episode(script)
    missing = sorted({l["who"] for l in lines if l["who"] not in vmap})
    if missing:
        raise SystemExit(f"Ses atanmamış karakterler: {', '.join(missing)}. Önce oyuncu-sec / ata.")

    todo = []
    for l in lines:
        text = build_text(l, model)
        v = vmap[l["who"]]
        extra = "".join(f"|{k}={l[k]}" for k in ("hiz", "fx") if l.get(k))
        key = hashlib.sha1(f"el|{model}|{v['voice_id']}|{json.dumps(v.get('ayar', {}), sort_keys=True)}|{l['emotion']}|{text}{extra}".encode()).hexdigest()[:12]
        cached = manifest.get(l["id"], {}).get("key") == key and os.path.exists(os.path.join(ROOT, "public", manifest[l["id"]]["file"]))
        if cached and l["id"] not in redo:
            continue
        todo.append((l, text, key, int(len(text) * rate + 0.999)))
    need = sum(t[3] for t in todo)
    say(f"Bölüm {ep}: {len(lines)} replik, {len(todo)} tanesi üretilecek (diğerleri önbellekte). Model {model}, tahmini maliyet ≈ {need} kredi.")
    for l, text, _, c in todo:
        say(f"  {l['id']:>8} [{l['who']}/{l['emotion']}] {c:>4} kr  {text[:70]}")
    if args.butce is not None and need > args.butce:
        raise SystemExit(f"DUR: tahmini maliyet {need} > bütçe {args.butce}. Daha az replik seçin ya da bütçeyi artırın.")
    if not todo:
        say("Yapılacak bir şey yok.")
        return
    if not args.onayla:
        say("\nKURU ÇALIŞTIRMA — hiçbir kredi harcanmadı. Gerçekten üretmek için aynı komutu --onayla ile çalıştırın.")
        return

    st = load_state()
    spent = 0
    for l, text, key, est in todo:
        acct, sub, rows = pick_account(est, args.sahte)
        if not acct:
            say("DUR: hiçbir hesapta bu replik için yeterli kredi yok (yedek pay korunuyor). Durum:")
            for a, s, u in rows:
                say(f"  {a['ad']}: kalan {s['kalan']}, kullanılabilir {u}")
            break
        if sub["asim_acik"]:
            say(f"  ⚠️ {acct['ad']}: aşım (usage-based billing) açık. Araç kalan krediyi asla aşmaz; yine de ElevenLabs ayarlarından kapatmanız önerilir.")
        vid, entry = voice_for_account(acct, l["who"], args.sahte)
        emo_settings = dict(EMO[l["emotion"]][1])
        vs = {"stability": emo_settings["stability"], "similarity_boost": 0.8, "style": emo_settings["style"], "use_speaker_boost": True, "speed": 1.0}
        if model in TAG_MODELS:
            vs = {"stability": 0.5, "similarity_boost": 0.8, "use_speaker_boost": True, "speed": 1.0}
        vs.update(entry.get("ayar", {}))
        if l.get("hiz"):
            vs["speed"] = float(l["hiz"])
        body = {"text": text, "model_id": model, "voice_settings": vs, "seed": int(key[:8], 16) % 4294967295}
        if model in LANG_MODELS:
            body["language_code"] = "tr"
        before = sub["kalan"]
        res, hdr = http(acct, "POST", f"/v1/text-to-speech/{vid}/with-timestamps", body=body, query={"output_format": "mp3_44100_128"}, fake=args.sahte)
        raw = os.path.join("/tmp", f"el-{l['id']}.mp3")
        open(raw, "wb").write(base64.b64decode(res["audio_base64"]))
        al = res.get("alignment") or res.get("normalized_alignment")
        out_rel = f"voice/{ep}/{l['id']}.mp3"
        lead, dur = postprocess(raw, os.path.join(ROOT, "public", out_rel), l.get("fx"))
        words = words_from_alignment(al, l["text"]) if al else []
        cues = visemes_from_alignment(al) if al else []
        words, cues = shift(words, cues, lead)
        cost = hdr.get("character-cost") or hdr.get("Character-Cost")
        try:
            cost = int(cost)
        except (TypeError, ValueError):
            cost = None
        if cost is None:
            after = subscription(acct, args.sahte)["kalan"]
            cost = max(0, before - after)
        spent += cost
        st["harcama"].append({"zaman": int(time.time()), "hesap": acct["ad"], "replik": f"{ep}/{l['id']}", "kredi": cost, "model": model, "sahte": bool(args.sahte)})
        save_state(st)
        manifest[l["id"]] = {"key": key, "file": out_rel, "voice": f"elevenlabs:{entry['ad']}", "emotion": l["emotion"], "text": l["text"], "duration": round(dur, 3), "asrScore": None, "heard": None, "words": words, "mouth": cues, "kaynak": "elevenlabs", "model": model, "hesap": acct["ad"], "kredi": cost}
        json.dump(manifest, open(man_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        say(f"+ {l['id']} {dur:.2f}s  {cost} kredi  ({acct['ad']})")
    say(f"\nBitti. Bu çalıştırmada harcanan: {spent} kredi.")
    for a in accounts():
        s = subscription(a, args.sahte)
        say(f"  {a['ad']}: kalan {s['kalan']} kredi")
    if not args.sahte:
        say("İpucu: Whisper kontrolü için (ücretsiz, yerel): /opt/tts/venv/bin/python tools/ses_kontrol.py " + ep)


def cmd_efekt(args):
    est = int(max(1.0, args.sure) * 40)  # kaba tahmin; gerçek maliyet abonelik farkından okunur
    say(f"Ses efekti '{args.isim}': \"{args.tarif}\" ({args.sure} sn). Tahmini maliyet ≈ {est} kredi (kaba tahmin).")
    if not args.onayla:
        say("KURU ÇALIŞTIRMA — kredi harcanmadı. --onayla ile üretin.")
        return
    acct, sub, rows = pick_account(est, args.sahte)
    if not acct:
        raise SystemExit("DUR: yeterli kredi yok.")
    before = sub["kalan"]
    audio, _ = http(acct, "POST", "/v1/sound-generation", body={"text": args.tarif, "duration_seconds": args.sure, "prompt_influence": 0.5}, raw=True, fake=args.sahte)
    out = os.path.join(ROOT, "public", "ses", "efekt", f"{args.isim}.mp3")
    raw = "/tmp/el-sfx.mp3"
    open(raw, "wb").write(audio)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "44100", "-c:a", "libmp3lame", "-q:a", "2", out], check=True)
    cost = max(0, before - subscription(acct, args.sahte)["kalan"])
    cat_path = os.path.join(ROOT, "public", "ses", "katalog.json")
    cat = json.load(open(cat_path, encoding="utf-8"))
    cat[f"efekt/{args.isim}"] = {"file": f"ses/efekt/{args.isim}.mp3", "category": "efekt", "duration": args.sure, "loop": False, "desc": f"ElevenLabs SFX: {args.tarif}"}
    json.dump(dict(sorted(cat.items())), open(cat_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    st = load_state()
    st["harcama"].append({"zaman": int(time.time()), "hesap": acct["ad"], "replik": f"sfx/{args.isim}", "kredi": cost, "model": "sfx", "sahte": bool(args.sahte)})
    save_state(st)
    say(f"+ efekt/{args.isim}  {cost} kredi ({acct['ad']})")


def cmd_replikler(args):
    script = json.load(open(args.bolum, encoding="utf-8"))
    vmap = json.load(open(VOICES, encoding="utf-8")) if os.path.exists(VOICES) else {}
    ep = script["episode"]
    say(f"Bölüm {ep} — her repliği bağlayıcıyla üretip public/voice/{ep}/gelen/<id>.mp3 olarak kaydedin, sonra: ice-aktar")
    tot = 0
    for l in lines_from_episode(script):
        text = build_text(l, args.model)
        tot += len(text)
        v = vmap.get(l["who"], {})
        say(json.dumps({"id": l["id"], "karakter": l["who"], "voice_id": v.get("voice_id", "ATANMAMIS"), "model_id": args.model, "language_code": "tr", "text": text}, ensure_ascii=False))
    say(f"Toplam ≈ {int(tot * COST.get(args.model, 1.0))} kredi (model {args.model}).")


def cmd_ice_aktar(args):
    script = json.load(open(args.bolum, encoding="utf-8"))
    ep = script["episode"]
    indir = os.path.join(ROOT, "public", "voice", ep, "gelen")
    outdir = os.path.join(ROOT, "public", "voice", ep)
    man_path = os.path.join(outdir, "manifest.json")
    manifest = json.load(open(man_path, encoding="utf-8")) if os.path.exists(man_path) else {}
    n = 0
    for l in lines_from_episode(script):
        src = next((os.path.join(indir, f"{l['id']}.{e}") for e in ("mp3", "wav", "ogg", "m4a") if os.path.exists(os.path.join(indir, f"{l['id']}.{e}"))), None)
        if not src:
            continue
        out_rel = f"voice/{ep}/{l['id']}.mp3"
        lead, dur = postprocess(src, os.path.join(ROOT, "public", out_rel))
        # konuşma aralığına harf uzunluğuyla orantılı kelime zamanları (Whisper ile kontrol: tools/ses_kontrol.py)
        det = subprocess.run(["ffmpeg", "-i", os.path.join(ROOT, "public", out_rel), "-af", "silencedetect=n=-40dB:d=0.25", "-f", "null", "-"], capture_output=True, text=True).stderr
        ends = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", det)]
        speech_end = ends[-1] if ends and ends[-1] > dur * 0.5 else dur
        words_txt = l["text"].split()
        lens = [max(1, len(re.sub(r"[^\w]", "", w))) for w in words_txt]
        t, words = 0.06, []
        for w, ln in zip(words_txt, lens):
            d = (speech_end - 0.06) * ln / sum(lens)
            words.append({"w": w, "start": round(t, 3), "end": round(t + d, 3)})
            t += d
        cues = []
        for w in words:
            letters = [c for c in lower_tr(w["w"]) if c in VIS]
            step = (w["end"] - w["start"]) / max(1, len(letters))
            for i, c in enumerate(letters):
                if not cues or cues[-1]["v"] != VIS[c]:
                    cues.append({"t": round(w["start"] + i * step, 3), "v": VIS[c]})
            cues.append({"t": w["end"], "v": "X"})
        manifest[l["id"]] = {"key": "ice-aktarim", "file": out_rel, "voice": "elevenlabs:mcp", "emotion": l["emotion"], "text": l["text"], "duration": round(dur, 3), "asrScore": None, "heard": None, "words": words, "mouth": cues, "kaynak": "elevenlabs-mcp"}
        n += 1
        say(f"+ {l['id']} {dur:.2f}s")
    json.dump(manifest, open(man_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    say(f"{n} replik içeri alındı. Kontrol: /opt/tts/venv/bin/python tools/ses_kontrol.py {ep}")


def main():
    p = argparse.ArgumentParser(description="ElevenLabs seslendirme (bütçe korumalı)")
    p.add_argument("--sahte", action="store_true", help="API'ye gitmeden test (kredi harcamaz)")
    sp = p.add_subparsers(dest="cmd", required=True)
    sp.add_parser("durum")
    o = sp.add_parser("oyuncu-sec")
    o.add_argument("--cinsiyet", choices=["f", "m"])
    o.add_argument("--sayfa", type=int, default=0)
    a = sp.add_parser("ata")
    a.add_argument("karakter")
    a.add_argument("voice_id")
    a.add_argument("--sahip", default="")
    a.add_argument("--ad", default="")
    s = sp.add_parser("seslendir")
    s.add_argument("bolum")
    s.add_argument("--model", default="eleven_v4", choices=sorted(COST))
    s.add_argument("--onayla", action="store_true")
    s.add_argument("--butce", type=int)
    s.add_argument("--yeniden", help="önbelleğe rağmen yeniden üretilecek replik id'leri (virgülle)")
    e = sp.add_parser("efekt")
    e.add_argument("tarif")
    e.add_argument("isim")
    e.add_argument("--sure", type=float, default=4.0)
    e.add_argument("--onayla", action="store_true")
    r = sp.add_parser("replikler")
    r.add_argument("bolum")
    r.add_argument("--model", default="eleven_v4", choices=sorted(COST))
    ia = sp.add_parser("ice-aktar")
    ia.add_argument("bolum")
    args = p.parse_args()
    {"replikler": cmd_replikler, "ice-aktar": cmd_ice_aktar, "durum": cmd_durum, "oyuncu-sec": cmd_oyuncu_sec, "ata": cmd_ata, "seslendir": cmd_seslendir, "efekt": cmd_efekt}[args.cmd](args)


if __name__ == "__main__":
    main()
