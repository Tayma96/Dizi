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
    """Dalga: yavaş kabarma, ani kırılma, uzun köpüklü geri çekilme."""
    x = np.zeros(int(d * SR))
    at = 0.0
    while at < d - 1:
        L = rng.uniform(6, 9)
        n = int(L * SR)
        tt = np.arange(n) / SR
        rise = np.clip(tt / (L * 0.45), 0, 1) ** 2.5
        brk = np.exp(-np.maximum(0, tt - L * 0.45) / (L * 0.25))
        e = np.where(tt < L * 0.45, rise, brk)
        crash = bp(noise(L, "pink"), 200, 3000) * e
        foam = hp(noise(L), 2500) * np.where(tt > L * 0.45, np.exp(-(tt - L * 0.45) / (L * 0.35)), 0) * 0.35 * (0.6 + 0.4 * rng.random(n))
        place(x, (crash + foam) * (0.7 + 0.3 * rng.random()), at)
        at += L * rng.uniform(0.6, 0.8)
    return x + lp(noise(d, "brown"), 120) * 0.5

def crackle(d, dens=40, amp=0.5):
    x = lp(noise(d, "brown"), 300) * 0.2
    for i in range(int(d * dens)):
        at = rng.uniform(0, d - 0.05)
        place(x, hp(noise(0.012), 1500) * np.exp(-t_(0.012) * 400) * rng.uniform(0.2, 1) * amp, at)
    return x

d = 40
save("ortam", "sahil", loopable(waves(d)), "Sahil: dalgalar, uzakta yanan enkazın çıtırtısı.", loop=True, stereo_width=0.8)
save("efekt", "ates", fade(crackle(6, 50, 0.6), 0.3, 0.6), "Ateş çıtırtısı (6 sn).")
kul = lp(noise(d, "pink"), 400) * 0.12 + bp(waves(d), 100, 900) * 0.25
save("ortam", "kulube", loopable(kul), "Kulübe içi: küçük ateş, hafif rüzgâr, uzakta dalgalar.", loop=True, stereo_width=0.6)

# sopa dürtmesi: kumaş hışırtısı + boğuk ten tokluğu + hafif odun tıkı (telefonda duyulur)
p = np.zeros(int(1.6 * SR))
for at in [0.1, 0.65, 1.15]:
    tt = t_(0.08)
    cloth = bp(noise(0.08), 1500, 5000) * np.exp(-tt / 0.02) * 0.5
    flesh = lp(noise(0.08), 600) * np.exp(-tt / 0.03) * 1.2
    wood = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.025) for f in (900, 2300, 3800)) / 3 * 0.25
    place(p, cloth + flesh + wood, at)
save("efekt", "sopa_durtme", p, "Sopa ile dürtme (3 kez): kumaş, ten, odun.")

# kumda sürükleme: mikro dürtüler (kum) + çekiş vuruşları + ayak tokluğu + kumaş hışırtısı
d = 3.6; t = t_(d)
dr = np.zeros(int(d * SR))
pull = (np.sin(2 * np.pi * 0.9 * t) * 0.5 + 0.5) ** 3
for i in range(int(d * 4000)):
    at = rng.uniform(0, d - 0.004)
    k = int(at * SR)
    dr[k:k + 40] += rng.standard_normal(40) * np.exp(-np.arange(40) / 12) * pull[k] * 0.4
dr = hp(dr, 1500)
for at in np.arange(0.1, d - 0.2, 0.6):
    place(dr, lp(noise(0.08), 400) * np.exp(-t_(0.08) / 0.03) * 1.2, at)
dr += bp(noise(d, "pink"), 800, 3000) * pull * 0.08
save("efekt", "surukleme", fade(dr, 0.2, 0.5), "Kumda sürükleme: kum, çekiş, ayak sesleri, kumaş.")

# kelimesiz yerli mırıltısı: perdeli sesler, rastgele ünlü formantları (sözcük çıkmaz), dış mekân yankısı
def resonate(x, f, q=5):
    b0, a0 = __import__("scipy.signal", fromlist=["iirpeak"]).iirpeak(f / (SR / 2), q)
    return __import__("scipy.signal", fromlist=["lfilter"]).lfilter(b0, a0, x)
d = 6
mur = np.zeros(int(d * SR))
VOW = [(700, 1200), (500, 1800), (450, 850), (350, 700), (300, 2200)]
for v, f0 in enumerate([110, 135, 150, 205, 230]):
    at = rng.uniform(0, 0.8)
    while at < d - 0.4:
        L = rng.uniform(0.12, 0.25)
        tt = t_(L)
        ff = f0 * (1 + 0.08 * np.sin(2 * np.pi * rng.uniform(0.5, 1.5) * tt + rng.random() * 6)) * (1 + 0.01 * rng.standard_normal(len(tt)))
        saw = 2 * ((np.cumsum(ff) / SR) % 1) - 1
        f1, f2 = VOW[rng.integers(len(VOW))]
        syl = (resonate(saw, f1) + 0.6 * resonate(saw, f2)) * np.sin(np.pi * tt / L) ** 1.5
        if rng.random() < 0.6:
            syl[: int(0.02 * SR)] += hp(noise(0.02), 2000)[: int(0.02 * SR)] * 0.4
        place(mur, syl * rng.uniform(0.3, 0.8), at)
        at += L + rng.uniform(0.02, 0.25) + (rng.uniform(0.4, 1.0) if rng.random() < 0.15 else 0)
mur = lp(mur, 1600)
save("efekt", "yerli_mirilti", fade(reverb(mur, 0.4, 0.25), 0.3, 0.6), "Kelimesiz, alçak sesle konuşan birkaç kişi (sözcükler seçilmez).", stereo_width=0.6)

cat = os.path.join(K.OUT, "katalog.json")
c = json.load(open(cat, encoding="utf-8")) if os.path.exists(cat) else {}
c.update(K.CATALOG)
json.dump(dict(sorted(c.items())), open(cat, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
