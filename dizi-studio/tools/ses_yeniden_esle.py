#!/usr/bin/env python3
"""Bölüm JSON'unda vuruş eklenip silinince replik kimlikleri (<sahne>_<sıra>) kayar.
Bu araç, manifestteki kayıtları metin+konuşmacıya göre yeni kimliklere taşır (dosya kopyalanır, kredi harcanmaz).
Kullanım: python3 tools/ses_yeniden_esle.py <bolum-id>"""
import json, os, shutil, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ep = sys.argv[1]
e = json.load(open(os.path.join(ROOT, "public", "episodes", ep + ".json")))
vdir = os.path.join(ROOT, "public", "voice", ep)
mp = os.path.join(vdir, "manifest.json")
man = json.load(open(mp))
eski = {k: dict(v) for k, v in man.items()}
yeni = {}
for sc in e["scenes"]:
    for i, b in enumerate(sc["beats"]):
        if b.get("type") != "line":
            continue
        lid = f"{sc['id']}_{i + 1:02d}"
        aday = [k for k, v in eski.items() if v.get("text") == b["text"]]
        if lid in eski and eski[lid].get("text") == b["text"]:
            yeni[lid] = eski[lid]; continue
        if not aday:
            print(f"  {lid}: kayıt yok (üretilmeli) — {b['text'][:50]}"); continue
        src = aday[0]
        v = dict(eski[src])
        hedef = f"voice/{ep}/{lid}.mp3"
        shutil.copyfile(os.path.join(ROOT, "public", eski[src]["file"]), os.path.join(ROOT, "public", hedef) + ".tmp")
        v["file"] = hedef
        yeni[lid] = v
        print(f"  {src} -> {lid}: {b['text'][:50]}")
for lid in yeni:
    t = os.path.join(ROOT, "public", f"voice/{ep}/{lid}.mp3.tmp")
    if os.path.exists(t):
        os.replace(t, t[:-4])
man_out = {**{k: v for k, v in man.items() if k not in yeni and k not in [x for x in man if x in yeni]}, **yeni}
# eşleşmeyen eski kimlikleri sakla (zararsız) ama yeni kimlikler önceliklidir
json.dump(man_out, open(mp, "w"), ensure_ascii=False, indent=1)
