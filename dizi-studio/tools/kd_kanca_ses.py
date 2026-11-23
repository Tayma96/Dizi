#!/usr/bin/env python3
"""Kırmızı Düğme · B1 kancası ses tasarımı (kodla sentez + imza klik A). Telifsiz.

Zamanlama KDKanca ile aynı (30 fps): 13 DUUUR (ses ayrı, ElevenLabs) · 23 klik · 30 kilit · 31-40 kanatlar
· 39-62 mızrak · 62 sert kesme (SESSİZLİK) · 65 logo · 74 logodaki klik (aynı ses) · 128 son.
Çıktı: public/ses/kd/kanca-mix.wav (stereo). İsteğe bağlı: --duur <wav> ile bağırış eklenir (soldan).
"""
import argparse
import os

import numpy as np
import scipy.signal as sg
import soundfile as sf

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KD = os.path.join(ROOT, "public", "ses", "kd")
FPS = 30
F = lambda n: n / FPS  # kare → saniye
DUR = F(128)
rng = np.random.default_rng(23)

L = np.zeros(int(SR * DUR))
R = np.zeros(int(SR * DUR))


def t_(d):
    return np.arange(int(SR * d)) / SR


def koy(x, t0, g=1.0, pan=0.0):
    """pan: -1 sol, +1 sağ (eşit güç)."""
    i = int(t0 * SR)
    n = min(len(x), len(L) - i)
    if n <= 0:
        return
    a = (pan + 1) * np.pi / 4
    L[i:i + n] += x[:n] * g * np.cos(a)
    R[i:i + n] += x[:n] * g * np.sin(a)


def bant(x, lo, hi, o=2):
    b, a = sg.butter(o, [lo / (SR / 2), min(hi, SR / 2 - 100) / (SR / 2)], "band")
    return sg.lfilter(b, a, x)


def alcak(x, f, o=2):
    b, a = sg.butter(o, f / (SR / 2), "low")
    return sg.lfilter(b, a, x)


def yuksek(x, f, o=2):
    b, a = sg.butter(o, f / (SR / 2), "high")
    return sg.lfilter(b, a, x)


def mod(f, tau, d):
    t = t_(d)
    return np.sin(2 * np.pi * f * t) * np.exp(-t / tau)


def zarf(n, atak, birak):
    e = np.ones(n)
    a = max(1, int(atak * SR))
    b = max(1, int(birak * SR))
    e[:a] = np.linspace(0, 1, a)
    e[-b:] *= np.linspace(1, 0, b)
    return e


# 1) oda uğultusu: düşük hum + kısık pembe gürültü; mızrakla şişer, kesmede SIFIR
d = F(62)
t = t_(d)
hum = 0.5 * np.sin(2 * np.pi * 55 * t) + 0.25 * np.sin(2 * np.pi * 110 * t) + 0.12 * np.sin(2 * np.pi * 165.4 * t)
gur = alcak(rng.standard_normal(len(t)), 900) * 0.5
oda = (hum * 0.5 + gur * 0.35) * zarf(len(t), 0.03, 0.002)
oda *= 0.5 + 0.5 * np.clip((t - F(39)) / F(23), 0, 1) ** 2 * 1.6 + 0.0
koy(oda, 0, 0.16)

# 2) kalp atışı (iki kez, düğmeye uzanırken)
for t0 in (0.04, 0.42):
    for dt, g in ((0, 1.0), (0.16, 0.7)):
        k = mod(52, 0.05, 0.25) + 0.4 * mod(90, 0.03, 0.25)
        koy(k, t0 + dt, 0.55 * g)

# 3) imza klik A (kanca + logo: aynı ses)
klik, ksr = sf.read(os.path.join(KD, "klik-A-tok.wav"))
if klik.ndim > 1:
    klik = klik.mean(axis=1)
if ksr != SR:
    klik = sg.resample(klik, int(len(klik) * SR / ksr))
koy(klik, F(23), 1.4)

# 4) bölme kilidi: metal "klak" + alçak gövde
kl = bant(rng.standard_normal(int(SR * 0.012)), 1800, 6000) * np.hanning(int(SR * 0.012))
kl = np.concatenate([kl, np.zeros(SR // 5)])
kl[: int(SR * 0.2)] += 0.6 * mod(880, 0.02, 0.2) + 0.4 * mod(1760, 0.012, 0.2) + 0.7 * mod(70, 0.05, 0.2)
koy(kl, F(30), 0.42)

# 5) kanatlar: hidrolik tıslama + kayma gürültüsü
d = F(10)
hs = yuksek(rng.standard_normal(int(SR * d)), 3000) * zarf(int(SR * d), 0.01, 0.12)
sl = bant(rng.standard_normal(int(SR * d)), 120, 500) * zarf(int(SR * d), 0.02, 0.05)
hs2 = yuksek(rng.standard_normal(int(SR * d)), 3000) * zarf(int(SR * d), 0.01, 0.12)
koy(hs, F(31), 0.22, -0.4)
koy(hs2, F(31), 0.22, 0.4)
koy(sl, F(31), 0.3)
koy(mod(60, 0.06, 0.3) + mod(120, 0.04, 0.3) * 0.5, F(40), 0.6)  # kanatlar yuvaya oturur

# 6) alarm darbesi: alçak "vom" (kanatlar açılınca, kesmeye kadar)
d = F(62) - F(31)
t = t_(d)
alarm = np.sin(2 * np.pi * 196 * t + 0.6 * np.sin(2 * np.pi * 3 * t)) * (0.5 + 0.5 * np.sin(2 * np.pi * 3 * t - np.pi / 2)) ** 2
alarm = alcak(alarm, 1200) * zarf(len(t), 0.05, 0.002)
koy(alarm, F(31), 0.12)

# 7) mızrak: fırlama "şing" + yükselen hava uğultusu (kesmede kesilir)
d = F(62) - F(39)
t = t_(d)
u = t / d
gur = rng.standard_normal(len(t))
# bant geçiren gürültüyü süpür (400 → 3200 Hz): dört bandın yumuşak geçişi (blok sınırında tık olmaz)
merkezler = [400, 800, 1600, 3200]
bantlar = [bant(gur, fc * 0.65, fc * 1.5) for fc in merkezler]
konum = (u ** 1.5) * (len(merkezler) - 1)
whoosh = np.zeros(len(t))
for j, b in enumerate(bantlar):
    w = np.clip(1 - np.abs(konum - j), 0, 1)
    whoosh += b * w
whoosh *= (0.15 + u ** 2.2) * zarf(len(t), 0.02, 0.001)
ton = np.sin(2 * np.pi * np.cumsum(300 + 900 * u ** 2) / SR) * u ** 3 * 0.25
koy(whoosh + ton, F(39), 1.7)
sing = bant(rng.standard_normal(int(SR * 0.4)), 3000, 9000) * np.exp(-t_(0.4) / 0.08) + 0.4 * mod(2600, 0.15, 0.4) + 0.3 * mod(3900, 0.1, 0.4)
koy(sing, F(39), 0.35, 0.1)

# kesme: 62. kareden 65. kareye kadar mutlak sessizlik (yukarıdaki her şey zaten orada bitiyor)
i0, i1 = int(F(62) * SR), int(F(65) * SR)
L[i0:i1] = 0
R[i0:i1] = 0

# 8) logo: düğme düşer (kısa düşüş uğultusu) → aynı klik + alt vuruş + ışıltı → harf "pop"ları
d = F(74) - F(65)
t = t_(d)
dus = bant(rng.standard_normal(len(t)), 300, 2400) * (t / d) ** 2 * 0.6
koy(dus, F(65), 0.35)
koy(klik, F(74), 0.95)
koy(mod(48, 0.18, 0.9) + 0.5 * mod(96, 0.1, 0.9), F(74), 0.7)
isilti = sum(mod(f, 0.5, 1.6) * g for f, g in ((2093, 0.3), (2637, 0.25), (3136, 0.2), (4186, 0.12)))
koy(isilti, F(75), 0.18)
for i in range(12):  # KIRMIZI + DÜĞME harfleri sırayla
    f0 = 520 + i * 45
    tt = t_(0.09)
    blip = np.sin(2 * np.pi * (f0 + 600 * tt / 0.09) * tt) * np.exp(-tt / 0.025)
    koy(blip, F(65) + 0.35 + i * 0.05, 0.12, -0.5 + i / 11)
# kuyruk: yumuşak ped (logo ekranda kalırken)
d = DUR - F(76)
t = t_(d)
ped = sum(np.sin(2 * np.pi * f * t) for f in (261.6, 329.6, 392.0)) / 3
ped = alcak(ped, 1500) * zarf(len(t), 0.4, 0.8)
koy(ped, F(76), 0.07)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--duur", help="DUUUR bağırışı wav/mp3 (13. karede, soldan)")
    ap.add_argument("--cikis", default=os.path.join(KD, "kanca-mix.wav"))
    a = ap.parse_args()
    if a.duur:
        import subprocess
        tmp = a.cikis + ".duur.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.duur, "-ac", "1", "-ar", str(SR), tmp], check=True)
        v, _ = sf.read(tmp)
        os.remove(tmp)
        v = v / (np.max(np.abs(v)) + 1e-9)
        koy(v, F(13), 0.8, -0.75)
        i0, i1 = int(F(62) * SR), int(F(65) * SR)
        L[i0:i1] = 0
        R[i0:i1] = 0
    st = np.stack([L, R], axis=1)
    st = st / (np.max(np.abs(st)) + 1e-9) * 0.9
    sf.write(a.cikis, st, SR, subtype="PCM_24")
    print("yazıldı:", a.cikis)


if __name__ == "__main__":
    main()
