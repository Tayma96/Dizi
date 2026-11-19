#!/usr/bin/env python3
"""Uçak sesleri (tamamen kodla sentez, telifsiz): kabin uğultusu, türbülans, motor arızası, iç çekme, kemer ikazı, dış rüzgâr.
Kullanım: /opt/tts/venv/bin/python tools/ses_ucak.py"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import ses_kutuphanesi as K
from ses_kutuphanesi import t_, noise, bp, lp, hp, loopable, place, reverb, fade, save, bell, SR

rng = np.random.default_rng(31)

# kabin: jet uğultusu (alçak geniş gürültü + hafif motor tonu)
d = 40; t = t_(d)
cab = lp(noise(d, "brown"), 260) * 1.6 + bp(noise(d, "pink"), 300, 1800) * 0.35 + np.sin(2 * np.pi * 118 * t) * 0.02 + np.sin(2 * np.pi * 236 * t) * 0.01
save("ortam", "ucak_kabin", loopable(cab), "Uçak kabini: jet uğultusu (business sınıfı, seyir).", loop=True, stereo_width=0.6)

# türbülans: yavaş başlayan alçak gümbürtü + gövde tıkırtıları
d = 6; t = t_(d)
ramp = np.clip(t / 4.0, 0, 1) ** 1.5
rum = lp(noise(d, "brown"), 90) * 3 * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 1.7 * t))) * ramp
for i in range(14):
    at = rng.uniform(1.0, d - 0.3)
    place(rum, bp(noise(0.08), 1500, 5000) * np.exp(-t_(0.08) * 60) * 0.25 * min(1, at / 3), at)
save("efekt", "turbulans", fade(rum, 0.3, 0.6), "Türbülans: yavaş başlayan gövde titreşimi ve tıkırtılar (6 sn).")

# motor arızası: türbin tonunun düşüp bozulması + öksürük patlamaları
d = 5; t = t_(d)
f = 420 * np.exp(-t / 3.5) + 140
ph = 2 * np.pi * np.cumsum(f) / SR
whine = np.sin(ph) * 0.18 + np.sin(ph * 2.01) * 0.07
whine *= 0.7 + 0.3 * np.sin(2 * np.pi * (3 + 4 * t / d) * t)
eng = whine + bp(noise(d, "pink"), 200, 2500) * 0.25 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.6 * t))
for at in [1.2, 1.9, 2.4, 3.3, 3.7, 4.3]:
    place(eng, lp(noise(0.18), 400) * np.exp(-t_(0.18) * 18) * 1.4, at)
save("efekt", "motor_arizasi", fade(reverb(eng, 0.8, 0.15), 0.4, 0.6), "Jet motoru arızası: düşen türbin sesi, öksürük patlamaları (5 sn).")

# iç çekme (nefes): burundan alıp ağızdan bırakma
d = 1.6; t = t_(d)
inh = bp(noise(d, "pink"), 600, 3000) * np.where(t < 0.55, np.sin(np.pi * t / 0.55) ** 2, 0) * 0.35
exh = bp(noise(d, "pink"), 250, 1800) * np.where(t > 0.6, np.sin(np.pi * np.clip((t - 0.6) / 1.0, 0, 1)) ** 2, 0)
save("efekt", "ic_cekme", fade(inh + exh, 0.02, 0.1), "İç çekme: derin nefes alıp bırakma (erkek).")

# kemer ikazı: iki tonlu kabin "ding"
d = 1.6
ding = np.zeros(int(d * SR))
place(ding, bell(1046, 1.4) * 0.6, 0.0)
place(ding, bell(784, 1.4) * 0.6, 0.35)
save("efekt", "kabin_ding", reverb(ding, 0.6, 0.2), "Uçak kabini ikaz sesi (iki ton).")

# dış: rüzgâr uğultusu + boğulan motor
d = 6; t = t_(d)
out = bp(noise(d, "pink"), 150, 1400) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.3 * t)) + lp(noise(d, "brown"), 120) * 1.2
f = 260 * np.exp(-t / 5) + 90
out += np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.08 * (0.6 + 0.4 * np.sin(2 * np.pi * 5 * t))
for at in [0.8, 1.6, 2.9, 4.1]:
    place(out, lp(noise(0.25), 300) * np.exp(-t_(0.25) * 12) * 1.2, at)
save("efekt", "ucak_dis", fade(out, 0.3, 0.8), "Uçak dışı: rüzgâr, boğulan motor, patlamalar (6 sn).")

cat = os.path.join(K.OUT, "katalog.json")
c = json.load(open(cat, encoding="utf-8")) if os.path.exists(cat) else {}
c.update(K.CATALOG)
json.dump(dict(sorted(c.items())), open(cat, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
