#!/usr/bin/env python3
"""Kırmızı Düğme: imza "klik" sesi denemeleri (tamamen kodla sentez, telifsiz).

İlke: rahatlatıcı, tatmin edici klik = çok kısa temiz geçiş (tık) + gövde rezonansı (tok)
+ birkaç on milisaniye sonra daha yumuşak bırakma sesi.
Telefon hoparlörü 300 Hz altını vermez: gövde rezonansları 300-2000 Hz'de, alt uç yalnız kulaklık için destek. Sert gürültü, çınlama, yay vızıltısı yok.

Çıktı: public/ses/kd/klik-<ad>.wav (tek basış) ve ornekler/ses/kd-klik-<ad>.mp3 (dinleme dosyası:
tek basış, kısa ara, iki basış, ara, yavaş üç basış).
Kullanım: python3 tools/kd_klik.py
"""
import os
import subprocess

import numpy as np
import scipy.signal as sg
import soundfile as sf

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "ses", "kd")
DINLE = os.path.join(os.path.dirname(ROOT), "ornekler", "ses")
rng = np.random.default_rng(11)


def mod(f, tau, d, faz=0.0):
    """Sönümlü sinüs (modal rezonans)."""
    t = np.arange(int(SR * d)) / SR
    return np.sin(2 * np.pi * f * t + faz) * np.exp(-t / tau)


def tik(d=0.004, lo=1500, hi=9000):
    """Çok kısa, yumuşak zarflı bant geçiren gürültü patlaması (tıklamanın 'çıt' kısmı)."""
    n = rng.standard_normal(int(SR * d))
    b, a = sg.butter(2, [lo / (SR / 2), hi / (SR / 2)], "band")
    n = sg.lfilter(b, a, n)
    return n * np.hanning(len(n)) ** 0.7


def yerlestir(buf, x, t0, kazanc=1.0):
    i = int(t0 * SR)
    buf[i : i + len(x)] += x[: max(0, len(buf) - i)] * kazanc


def basis(ozellik, uzun=0.45):
    """Tek bir basış (aşağı + bırakma)."""
    buf = np.zeros(int(SR * uzun))
    p = ozellik
    # aşağı: tık + gövde
    yerlestir(buf, tik(p["tik_d"], p["tik_lo"], p["tik_hi"]), 0.0, p["tik_g"])
    for f, tau, g in p["govde"]:
        yerlestir(buf, mod(f, tau, tau * 7), 0.0006, g)
    # bırakma: daha yumuşak, biraz daha tiz
    t1 = p["birak_t"]
    yerlestir(buf, tik(p["tik_d"] * 0.8, p["tik_lo"] * 1.2, p["tik_hi"]), t1, p["tik_g"] * p["birak_g"])
    for f, tau, g in p["govde"]:
        yerlestir(buf, mod(f * p["birak_f"], tau * 0.7, tau * 5), t1 + 0.0004, g * p["birak_g"])
    # yumuşatma: çok tiz ucu kıs (rahatsız etmesin), DC temizle
    b, a = sg.butter(2, p.get("lp", 11000) / (SR / 2), "low")
    buf = sg.lfilter(b, a, buf)
    b, a = sg.butter(1, 60 / (SR / 2), "high")
    buf = sg.lfilter(b, a, buf)
    # oda: çok kısa, sıcak bir erken yansıma (kuru ama "havada" duyulsun)
    for gec, g in ((0.011, 0.16), (0.019, 0.09), (0.031, 0.05)):
        k = int(gec * SR)
        buf[k:] += buf[:-k] * g
    return buf / (np.max(np.abs(buf)) + 1e-9) * 0.89


VARYANTLAR = {
    # A: "Tok" — mekanik klavye / kalın plastik; derin ve yuvarlak, en rahatlatıcı aday
    "A-tok": dict(tik_d=0.0035, tik_lo=1200, tik_hi=6500, tik_g=0.55,
                  govde=[(340, 0.016, 0.8), (720, 0.011, 0.9), (1650, 0.005, 0.45), (170, 0.02, 0.35)],
                  birak_t=0.085, birak_g=0.45, birak_f=1.18, lp=8000),
    # B: "Kristal" — tükenmez kalem / kaliteli anahtar; net, parlak, kısa
    "B-kristal": dict(tik_d=0.0025, tik_lo=2500, tik_hi=11000, tik_g=0.9,
                      govde=[(2150, 0.006, 0.7), (3900, 0.003, 0.4), (620, 0.008, 0.45)],
                      birak_t=0.07, birak_g=0.55, birak_f=1.1, lp=12000),
    # C: "Kapsül" — büyük oyun salonu düğmesi; dolgun tık + kubbe içinde kısa boşluk tınısı
    "C-kapsul": dict(tik_d=0.004, tik_lo=1500, tik_hi=8000, tik_g=0.7,
                     govde=[(420, 0.02, 0.8), (980, 0.012, 0.85), (2100, 0.006, 0.45), (180, 0.025, 0.3)],
                     birak_t=0.11, birak_g=0.4, birak_f=1.25, lp=9500),
    # D: "Kadife" — ASMR yumuşaklığında, kısık; en sakin
    "D-kadife": dict(tik_d=0.005, tik_lo=1100, tik_hi=5500, tik_g=0.55,
                     govde=[(300, 0.014, 0.7), (640, 0.009, 0.8), (1350, 0.004, 0.35), (150, 0.016, 0.3)],
                     birak_t=0.095, birak_g=0.35, birak_f=1.15, lp=5000),
}


def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(DINLE, exist_ok=True)
    for ad, p in VARYANTLAR.items():
        tek = basis(p)
        sf.write(os.path.join(OUT, f"klik-{ad}.wav"), tek, SR, subtype="PCM_24")
        gecici = os.path.join(OUT, "_gecici.wav")
        # dinleme dosyası: 1 basış · ara · 2 basış · ara · yavaş 3 basış
        zaman = [0.3, 1.5, 1.85, 3.1, 3.75, 4.4]
        dinle = np.zeros(int(SR * 5.2))
        for i, t0 in enumerate(zaman):
            g = 1.0 - 0.06 * (i % 2)  # elle basış gibi küçük farklar
            yerlestir(dinle, basis(p) * g, t0)
        sf.write(gecici, dinle * 0.7, SR)
        hedef = os.path.join(DINLE, f"kd-klik-{ad}.mp3")
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", gecici,
                        "-af", "loudnorm=I=-16:TP=-1.5:LRA=7", "-ar", "48000", "-b:a", "192k", hedef], check=True)
        os.remove(gecici)
        print("yazıldı:", hedef)


if __name__ == "__main__":
    main()
