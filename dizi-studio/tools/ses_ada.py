#!/usr/bin/env python3
"""Ada sesleri (kodla sentez, telifsiz): sahil dalgaları, ateş çıtırtısı, kulübe ortamı, sopa dürtmesi, kumda sürükleme,
kelimesiz yerli mırıltısı. Kullanım: /opt/tts/venv/bin/python tools/ses_ada.py"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import ses_kutuphanesi as K
from ses_kutuphanesi import t_, noise, bp, lp, hp, loopable, place, reverb, fade, save, SR

rng = np.random.default_rng(57)

def waves(d):
    t = t_(d)
    x = np.zeros(int(d * SR))
    at = 0.0
    while at < d - 1:
        L = rng.uniform(5, 8)
        n = int(L * SR)
        tt = np.arange(n) / SR
        e = np.sin(np.pi * np.clip(tt / L, 0, 1)) ** 2 * (0.7 + 0.3 * rng.random())
        w = bp(noise(L, "pink"), 120, 2600) * e + hp(noise(L), 3000) * 0.12 * e ** 3
        place(x, w, at)
        at += L * rng.uniform(0.55, 0.75)
    return x + lp(noise(d, "brown"), 120) * 0.5

def crackle(d, dens=40, amp=0.5):
    x = lp(noise(d, "brown"), 300) * 0.2
    for i in range(int(d * dens)):
        at = rng.uniform(0, d - 0.05)
        place(x, hp(noise(0.012), 1500) * np.exp(-t_(0.012) * 400) * rng.uniform(0.2, 1) * amp, at)
    return x

d = 40
save("ortam", "sahil", loopable(waves(d) + crackle(d, 6, 0.25) * 0.4), "Sahil: dalgalar, uzakta yanan enkazın çıtırtısı.", loop=True, stereo_width=0.8)
save("efekt", "ates", fade(crackle(6, 50, 0.6), 0.3, 0.6), "Ateş çıtırtısı (6 sn).")
kul = lp(noise(d, "pink"), 500) * 0.15 + crackle(d, 18, 0.35) + bp(waves(d), 100, 900) * 0.18
save("ortam", "kulube", loopable(kul), "Kulübe içi: küçük ateş, hafif rüzgâr, uzakta dalgalar.", loop=True, stereo_width=0.6)

def thud(f=120, dd=0.25, dec=20):
    tt = t_(dd)
    return np.sin(2 * np.pi * f * tt) * np.exp(-tt * dec) + bp(noise(dd), 300, 1500) * np.exp(-tt * 40) * 0.4
p = np.zeros(int(1.6 * SR))
for at in [0.1, 0.65, 1.15]:
    place(p, thud(140, 0.25, 24) * 0.8, at)
save("efekt", "sopa_durtme", p, "Sopa ile dürtme (3 kez, yumuşak tok ses).")

d = 3.5; t = t_(d)
drag = bp(noise(d), 1200, 6000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 0.9 * t))) * 0.6 + lp(noise(d, "brown"), 200) * 0.6
save("efekt", "surukleme", fade(drag, 0.2, 0.5), "Kumda sürükleme + ayak sesleri (3,5 sn).")

d = 6; t = t_(d)
mur = np.zeros(int(d * SR))
for v in range(5):
    f0 = rng.uniform(100, 220)
    syl = (np.clip(np.sin(2 * np.pi * rng.uniform(2.5, 4.5) * t + rng.random() * 6), 0, 1) ** 2) * (np.sin(2 * np.pi * rng.uniform(0.15, 0.4) * t + rng.random() * 6) > -0.2)
    mur += bp(noise(d, "pink"), f0 * 2, f0 * 8) * syl * rng.uniform(0.4, 1)
save("efekt", "yerli_mirilti", fade(reverb(mur, 0.8, 0.2), 0.4, 0.8), "Kelimesiz, tedirgin alçak sesle konuşma (yerliler, 6 sn).")

cat = os.path.join(K.OUT, "katalog.json")
c = json.load(open(cat, encoding="utf-8")) if os.path.exists(cat) else {}
c.update(K.CATALOG)
json.dump(dict(sorted(c.items())), open(cat, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
