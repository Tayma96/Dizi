#!/usr/bin/env python3
"""7/24 sesleri (kodla sentez, telifsiz): gece marketi ortamı, kapı ding-dong'u, otomatik kapı, ıslak ayak sesi,
kasa çekmecesi, düşen ekmek. Kullanım: /opt/tts/venv/bin/python tools/ses_724.py"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import ses_kutuphanesi as K
from ses_kutuphanesi import t_, noise, bp, lp, hp, loopable, place, reverb, fade, save, SR

rng = np.random.default_rng(724)
d = 40; t = t_(d)
fridge = lp(noise(d, "brown"), 140) * 0.9 + np.sin(2 * np.pi * 50 * t) * 0.03 + np.sin(2 * np.pi * 150 * t) * 0.012
fluo = np.sin(2 * np.pi * 100 * t) * 0.02 + bp(noise(d), 6000, 9000) * 0.01
rain = hp(noise(d, "pink"), 1200) * 0.05
for i in range(6):
    at = rng.uniform(3, d - 4)
    place(fridge, lp(noise(0.3), 300) * np.exp(-t_(0.3) * 12) * 0.5, at)  # kompresör tıkırtısı
save("ortam", "market_gece", loopable(fridge + fluo + rain), "Gece marketi: buzdolabı uğultusu, floresan, dışarıda yağmur.", loop=True, stereo_width=0.5)


def chime(f, d=1.6, dec=0.5):
    tt = t_(d)
    e = np.minimum(1, tt / 0.004) * np.exp(-tt / dec)
    return (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)) * e


dd = np.zeros(int(1.9 * SR))
place(dd, chime(988) * 0.6, 0.0)
place(dd, chime(784) * 0.6, 0.32)
save("efekt", "kapi_dingdong", reverb(dd, 0.5, 0.2), "Market kapısı ding-dong.")

d = 1.6; t = t_(d)
sl = lp(noise(d, "brown"), 250) * 0.8 + bp(noise(d), 500, 1500) * 0.1
sl *= np.clip(t / 0.15, 0, 1) * np.clip((d - t) / 0.4, 0, 1)
save("efekt", "otomatik_kapi", sl, "Otomatik sürgülü kapı açılma/kapanma.")

st = np.zeros(int(3.2 * SR))
for at in np.arange(0.1, 3.0, 0.55):
    tt = t_(0.18)
    step = lp(noise(0.18), 500) * np.exp(-tt / 0.05) * 0.9 + bp(noise(0.18), 1500, 5000) * np.exp(-tt / 0.08) * 0.35
    place(st, step, at)
save("efekt", "islak_adim", reverb(st, 0.6, 0.2), "Islak ayak sesleri (görünmeyen biri yürüyor).")

d = 1.0
k = np.zeros(int(d * SR))
place(k, sum(np.sin(2 * np.pi * f * t_(0.6)) for f in (2100, 3400, 5200)) / 3 * np.exp(-t_(0.6) / 0.15) * 0.6, 0.0)
place(k, lp(noise(0.25), 800) * np.exp(-t_(0.25) / 0.06) * 0.9, 0.12)
save("efekt", "kasa_cekmece", k, "Yazar kasa çekmecesi açılır (çın + tok).")

d = 0.8; t = t_(d)
e = lp(noise(d), 600) * np.exp(-t / 0.05) * 1.0 + bp(noise(d), 1500, 4000) * np.exp(-t / 0.1) * 0.4
save("efekt", "ekmek_dusme", e, "Raftan poşetli ekmek düşer.")

cat = os.path.join(K.OUT, "katalog.json")
c = json.load(open(cat, encoding="utf-8")) if os.path.exists(cat) else {}
c.update(K.CATALOG)
json.dump(dict(sorted(c.items())), open(cat, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
