#!/usr/bin/env python3
"""7/24 ev sesleri (kodla sentez, telifsiz): sabah banyo ortamı (fan uğultusu, damlayan musluk, uzak şehir).
Kullanım: /opt/tts/venv/bin/python tools/ses_banyo.py"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import ses_kutuphanesi as K
from ses_kutuphanesi import t_, noise, bp, lp, hp, loopable, place, reverb, save

rng = np.random.default_rng(1919)
d = 30; t = t_(d)
fan = lp(noise(d, "brown"), 220) * 0.5 + bp(noise(d, "pink"), 300, 900) * 0.05 + np.sin(2 * np.pi * 118 * t) * 0.012
sehir = lp(noise(d, "brown"), 400) * 0.25
amb = fan + sehir
for at in np.arange(1.3, d - 1, 2.6) + rng.uniform(-0.5, 0.5, len(np.arange(1.3, d - 1, 2.6))):
    tt = t_(0.25)
    f0 = rng.uniform(1300, 1900)
    drip = np.sin(2 * np.pi * (f0 + 900 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 26) * 0.22
    place(amb, reverb(drip, 0.35, 0.25), at)
for at in (6.5, 19.0):  # uzakta kuş
    tt = t_(0.5)
    ch = np.sin(2 * np.pi * (3600 + 600 * np.sin(2 * np.pi * 14 * tt)) * tt) * np.exp(-((tt - 0.2) ** 2) / 0.01) * 0.025
    place(amb, ch, at)
save("ortam", "banyo_sabah", loopable(amb), "Sabah banyo: fan uğultusu, musluk damlası, uzak şehir, kuş.", loop=True, stereo_width=0.4)

cat = os.path.join(K.OUT, "katalog.json")
c = json.load(open(cat, encoding="utf-8")) if os.path.exists(cat) else {}
c.update(K.CATALOG)
json.dump(dict(sorted(c.items())), open(cat, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
