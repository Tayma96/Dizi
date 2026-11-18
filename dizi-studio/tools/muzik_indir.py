#!/usr/bin/env python3
"""Kamu malı (Public Domain) Musopen kayıtlarını Wikimedia Commons'tan indirir ve kütüphaneye ekler.
Kaynak listesi: docs/arastirma-2.md (her biri Commons API'de LicenseShortName = Public domain).
Commons hız sınırı (HTTP 429) verirse bekleyip yeniden dener.
Çıktı: public/ses/muzik/pd_*.mp3 (ilk 3 dk, -18 LUFS, sona 3 sn sönümleme) + katalog + LISANSLAR.csv
Kullanım: python3 tools/muzik_indir.py
"""
import json
import os
import re
import subprocess
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOC = os.path.join(os.path.dirname(ROOT), "docs", "arastirma-2.md")
SES = os.path.join(ROOT, "public", "ses")
TMP = "/tmp/pd-muzik"
UA = "DiziStudio/1.0 (public-domain music fetch; low volume)"

NAMES = {
    "Nocturne_No._20": ("pd_chopin_nokturn20", "Chopin — Nokturn No.20 (hüzün, ana acı teması)"),
    "Nocturne_No._1_": ("pd_chopin_nokturn1", "Chopin — Nokturn No.1 Op.9/1 (melankoli)"),
    "Nocturne_No._7": ("pd_chopin_nokturn7", "Chopin — Nokturn No.7 (tedirginlik → patlama)"),
    "Nocturne_No._13": ("pd_chopin_nokturn13", "Chopin — Nokturn No.13 (ağır dram)"),
    "Nocturne_No._19": ("pd_chopin_nokturn19", "Chopin — Nokturn No.19 (hüzün)"),
    "Nocturne_No._21": ("pd_chopin_nokturn21", "Chopin — Nokturn No.21 (kısa hüzün)"),
    "Marche_Funebre": ("pd_chopin_cenaze", "Chopin — Marche Funèbre Op.72/2 (yas)"),
    "Ballade_No._1": ("pd_chopin_ballad1", "Chopin — Ballad No.1 (gerilim, doruk)"),
    "Cello_Sonata": ("pd_chopin_cello_largo", "Chopin — Çello Sonatı Largo (hüzün, çello+piyano)"),
    "Symphony_No._6": ("pd_tchaikovsky_pathetique", "Tchaikovsky — Pathétique IV (trajedi)"),
    "Eroica": ("pd_beethoven_cenaze_marsi", "Beethoven — Eroica II. Marcia funebre (yas)"),
    "Op._18_No._6": ("pd_beethoven_adagio", "Beethoven — Op.18/6 Adagio (içe dönük)"),
    "Op._80": ("pd_mendelssohn_adagio", "Mendelssohn — Op.80 Adagio (yas)"),
    "D958": ("pd_schubert_d958", "Schubert — D958 Adagio (gece hüznü)"),
    "D784": ("pd_schubert_d784", "Schubert — D784 Andante (sakin hüzün)"),
}


def fetch(url, path):
    for attempt in range(12):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=120) as r, open(path, "wb") as f:
                f.write(r.read())
            return True
        except urllib.error.HTTPError as e:
            wait = int(e.headers.get("retry-after", "120")) if e.code == 429 else 30
            print(f"  {e.code}, {wait} sn bekleniyor…", flush=True)
            time.sleep(min(wait, 660))
    return False


def main():
    os.makedirs(TMP, exist_ok=True)
    urls = sorted(set(re.findall(r"https://upload\.wikimedia\.org/wikipedia/commons/[^ |]+\.flac", open(DOC, encoding="utf-8").read())))
    cat_path = os.path.join(SES, "katalog.json")
    cat = json.load(open(cat_path, encoding="utf-8"))
    lic_path = os.path.join(SES, "LISANSLAR.csv")
    lic = open(lic_path, encoding="utf-8").read().splitlines()
    for url in urls:
        key = next((k for k in NAMES if k in urllib.request.unquote(url)), None)
        if not key:
            continue
        name, desc = NAMES[key]
        out = os.path.join(SES, "muzik", f"{name}.mp3")
        if os.path.exists(out):
            print("=", name)
            continue
        src = os.path.join(TMP, f"{name}.flac")
        print("indiriliyor:", name, flush=True)
        if not fetch(url, src):
            print("! indirilemedi:", name)
            continue
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-t", "180", "-af", "afade=t=out:st=177:d=3,loudnorm=I=-18:TP=-2", "-ac", "2", "-ar", "44100", "-c:a", "libmp3lame", "-q:a", "2", out], check=True)
        cat[f"muzik/{name}"] = {"file": f"ses/muzik/{name}.mp3", "category": "muzik", "duration": 180, "loop": False, "desc": desc + " — kamu malı kayıt (Musopen/Wikimedia Commons)"}
        lic.append(f"Wikimedia Commons ({urllib.request.unquote(url).split('/')[-1]}),ses/muzik/{name}.mp3,Public domain,gerekmez")
        json.dump(dict(sorted(cat.items())), open(cat_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        open(lic_path, "w", encoding="utf-8").write("\n".join(lic) + "\n")
        print("+", name, flush=True)
        time.sleep(5)


if __name__ == "__main__":
    main()
