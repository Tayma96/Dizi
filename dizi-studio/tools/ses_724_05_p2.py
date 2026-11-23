#!/usr/bin/env python3
"""7/24 Bölüm 5, 2. parça: bütün ses (kredi yalnız `uret` ve `efekt-uret` komutlarında harcanır). dizi-studio/ içinden çalıştırılır.

  python3 tools/ses_724_05_p2.py uret [--onayla] [--butce N]   # fısıltı varyantları + Ece'nin sözsüz sesleri (ElevenLabs, kuru çalıştırma varsayılan)
  python3 tools/ses_724_05_p2.py efekt-uret [--onayla]          # parçaya özel ElevenLabs SFX'leri (el_b5p2_*)
  /opt/tts/venv/bin/python tools/ses_724_05_p2.py hrir          # SADIE II (KU100) 3. derece SH-HRIR'larını public/ses/b5p2_hrir/'e yazar (bir kez)
  /opt/tts/venv/bin/python tools/ses_724_05_p2.py kur           # bütün parçayı kurar: binaural kaynaklar + efektler + miks + kökler + önizleme
  /opt/tts/venv/bin/python tools/ses_724_05_p2.py olc           # doğrulama ölçümleri (LUFS, L/R, ITD, mono uyumluluk, Whisper)

Binaural yöntem: kaynak (mono) zamanla değişen yönde 3. derece Ambisonik'e (ACN/SN3D) kodlanır, SADIE II KU100
kafa modelinin SH alanındaki HRIR'larıyla (Google Omnitone/Resonance, Apache-2.0) iki kulağa çözülür. Üstüne:
yakın alan (1/r kulak mesafesi farkı + alçak frekans ILD artışı), omuz/gövde yansıması, kısa erken yansımalar ve
binaural (kulaklar arası ilintisiz) oda kuyruğu eklenir. Ayrıntı: docs/diziler/724/raporlar/b5p2-ses.md"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(ROOT)
PLAN = os.path.join(ROOT, "public", "episodes", "724-05-p2-ses.json")
VDIR = os.path.join(ROOT, "public", "voice", "724-05-p2-ses")
EDIR = os.path.join(ROOT, "public", "ses", "efekt")
HDIR = os.path.join(ROOT, "public", "ses", "b5p2_hrir")
TMP = os.environ.get("B5P2_TMP", "/tmp/b5p2")
SR = 48000


def plan_load():
    return json.load(open(PLAN, encoding="utf-8"))


def plan_save(p):
    json.dump(p, open(PLAN, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


# ------------------------------------------------------------------ ElevenLabs üretimi (bütçe korumalı araç üzerinden)
def cmd_uret(argv):
    """uretim satırlarını modele göre geçici bölüm JSON'larına böler ve elevenlabs.py seslendir'e verir.
    Satır kimliği <id>_01 olur (ör. f1_01). Harcama korumaları (kalan kredi, yedek pay, --butce) aracın kendisindedir."""
    os.makedirs(TMP, exist_ok=True)
    p = plan_load()
    models = sorted({u["model"] for u in p["uretim"]})
    for m in models:
        ep = {"series": "724", "episode": p["episode"], "scenes": []}
        for u in p["uretim"]:
            if u["model"] != m:
                continue
            b = {"type": "line", "who": u["who"], "text": u["text"], "okunus": u["okunus"], "tags": u["tags"], "emotion": "notr"}
            if u.get("stab") is not None:
                b["stab"] = u["stab"]
            ep["scenes"].append({"id": u["id"], "cast": {}, "beats": [b]})
        path = os.path.join(TMP, f"uretim_{m}.json")
        json.dump(ep, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        cmd = [sys.executable if "venv" not in sys.executable else "python3", os.path.join(ROOT, "tools", "elevenlabs.py"), "seslendir", path, "--model", m] + argv
        print("$", " ".join(cmd), flush=True)
        r = subprocess.run(cmd, cwd=ROOT)
        if r.returncode:
            sys.exit(r.returncode)


if __name__ == "__main__":
    c = sys.argv[1] if len(sys.argv) > 1 else ""
    if c == "uret":
        cmd_uret(sys.argv[2:])
    else:
        print(__doc__)
