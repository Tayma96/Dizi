#!/usr/bin/env python3
"""KAT 7 sesleri (kodla sentez, telifsiz): gece lobisi, asansör ding/kapı/bip, CCTV paraziti, floresan çıtırtısı,
yükselen korku drone'u, final vuruşu. Kullanım: /opt/tts/venv/bin/python tools/ses_kat7.py"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import ses_kutuphanesi as K
from ses_kutuphanesi import t_, noise, bp, lp, hp, loopable, place, reverb, fade, save, SR

rng = np.random.default_rng(77)

# gece lobisi: hafif floresan uğultusu (100 Hz + harmonikler, alçak), klima, dışarıda yağmur
d = 40; t = t_(d)
hum = sum(np.sin(2 * np.pi * f * t) * a for f, a in ((100, 0.05), (200, 0.025), (300, 0.012)))
hvac = lp(noise(d, "pink"), 350) * 0.5
rain = hp(noise(d, "pink"), 1500) * 0.06 * (0.8 + 0.2 * np.sin(2 * np.pi * 0.07 * t))
save("ortam", "lobi_gece", loopable(hum + hvac + rain), "Gece lobisi: floresan uğultusu, klima, dışarıda yağmur.", loop=True, stereo_width=0.5)

def chime(f, d=2.4, dec=0.7):
    tt = t_(d)
    e = np.minimum(1, tt / 0.004) * np.exp(-tt / dec)
    return (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * tt) + 0.08 * np.sin(2 * np.pi * 3.01 * f * tt)) * e

save("efekt", "asansor_ding", reverb(chime(880), 1.6, 0.35), "Asansör ding (tek ton, lobide yankılı).")
save("efekt", "asansor_ding_uzak", lp(reverb(chime(880), 2.2, 0.5), 2500), "Asansör ding, CCTV hoparlöründen uzak ve boğuk.")

d = 2.6; t = t_(d)
motor = lp(noise(d, "brown"), 200) * 1.2 + np.sin(2 * np.pi * 118 * t) * 0.08 + bp(noise(d), 600, 1800) * 0.08
motor *= np.clip(t / 0.3, 0, 1) * np.clip((d - 0.4 - t) / 0.3, 0, 1)
place(motor, lp(noise(0.15), 300) * np.exp(-t_(0.15) * 25) * 1.5, d - 0.4)
save("efekt", "asansor_kapi", reverb(motor, 0.8, 0.25), "Asansör kapısı: motor ve sürgü, sonda tok duruş.")

tt = t_(0.09)
save("efekt", "kat_bip", np.sin(2 * np.pi * 1400 * tt) * np.minimum(1, tt / 0.003) * np.exp(-tt / 0.05), "Kat göstergesi bipi.")

d = 0.5; t = t_(d)
st = hp(noise(d), 800) * (rng.random(int(d * SR)) > 0.3) * np.exp(-t / 0.25)
save("efekt", "parazit", st, "CCTV paraziti (kısa patlama).")

d = 1.2
cl = np.zeros(int(d * SR))
for at in [0.05, 0.18, 0.22, 0.6, 0.66]:
    place(cl, hp(noise(0.03), 2000) * np.exp(-t_(0.03) * 120) * 0.6 + np.sin(2 * np.pi * 100 * t_(0.03)) * 0.3, at)
save("efekt", "floresan_cit", cl, "Floresan lambanın titrerken çıtırtısı.")

# yükselen korku drone'u: sub bas + uyumsuz küme (küçük ikili), yavaş kabarma (10 sn)
d = 10; t = t_(d)
sw = np.clip(t / d, 0, 1) ** 2
sub = np.sin(2 * np.pi * (42 + 6 * sw) * t) * 0.6
cl2 = sum(np.sin(2 * np.pi * f * t + rng.random() * 6) for f in (220, 233.1, 311.1)) / 3 * 0.25
air = bp(noise(d, "pink"), 2000, 6000) * 0.05
dr = (sub + cl2 * (0.3 + 0.7 * sw) + air) * (0.15 + 0.85 * sw)
save("efekt", "korku_drone", fade(dr, 1.0, 0.05), "Yükselen korku drone'u (10 sn), sonu kesik.")

# final vuruşu: sub patlama + gürültü + uyumsuz akor, uzun sönüm
d = 3.0; t = t_(d)
boom = np.sin(2 * np.pi * 48 * t * np.exp(-t * 0.5)) * np.exp(-t * 1.6)
burst = bp(noise(d), 300, 5000) * np.exp(-t * 6) * 0.6
chord = sum(np.sin(2 * np.pi * f * t) for f in (146.8, 155.6, 207.7)) / 3 * np.exp(-t * 1.2) * 0.4
save("efekt", "korku_vurus", reverb(boom + burst + chord, 2.0, 0.3), "Korku vuruşu (stinger).")

cat = os.path.join(K.OUT, "katalog.json")
c = json.load(open(cat, encoding="utf-8")) if os.path.exists(cat) else {}
c.update(K.CATALOG)
json.dump(dict(sorted(c.items())), open(cat, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
