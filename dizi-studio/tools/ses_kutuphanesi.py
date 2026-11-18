#!/usr/bin/env python3
"""Telifsiz ses kütüphanesi üretici (tamamen kodla sentez).
Çıktı: public/ses/{ortam,efekt,muzik}/*.mp3 + public/ses/katalog.json
Kullanım: /opt/tts/venv/bin/python tools/ses_kutuphanesi.py [isim ...]
"""
import json
import os
import subprocess
import sys

import numpy as np
import scipy.signal as sg
import soundfile as sf

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "ses")
rng = np.random.default_rng(7)
CATALOG = {}


def t_(d):
    return np.arange(int(SR * d)) / SR


def noise(d, color="white"):
    n = rng.standard_normal(int(SR * d))
    if color == "pink":
        b, a = [0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400]
        n = sg.lfilter(b, a, n) * 4
    elif color == "brown":
        n = np.cumsum(n)
        n = sg.lfilter([1, -1], [1, -0.995], n) / 30
    return n


def bp(x, lo, hi, order=2):
    sos = sg.butter(order, [lo / (SR / 2), hi / (SR / 2)], "bandpass", output="sos")
    return sg.sosfilt(sos, x)


def lp(x, f, order=2):
    return sg.sosfilt(sg.butter(order, f / (SR / 2), "lowpass", output="sos"), x)


def hp(x, f, order=2):
    return sg.sosfilt(sg.butter(order, f / (SR / 2), "highpass", output="sos"), x)


def env(n, a=0.01, r=0.2, total=None):
    total = total or n / SR
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / max(r, 1e-4))
    return e


def reverb(x, seconds=2.0, mix=0.3, damp=4000):
    n = int(SR * seconds)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * (6.9 / seconds))
    ir = lp(ir, damp)
    ir /= np.sqrt(np.sum(ir**2))
    wet = sg.fftconvolve(x, ir)[: len(x)]
    return (1 - mix) * x + mix * wet * 0.9


def fade(x, fi=0.05, fo=0.3):
    n = len(x)
    a, b = int(fi * SR), int(fo * SR)
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)
    return x


def loopable(x, xf=1.5):
    """Crossfade tail into head so the file loops seamlessly."""
    n = int(xf * SR)
    head, tail = x[:n].copy(), x[-n:].copy()
    w = np.linspace(0, 1, n)
    x = x[:-n].copy()
    x[:n] = head * w + tail * (1 - w)
    return x


def norm(x, peak=0.89):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def save(cat, name, x, desc, loop=False, stereo_width=0.0):
    if "gerçek kayıt" in CATALOG.get(f"{cat}/{name}", {}).get("desc", ""):
        print("= atlandı (gerçek kayıt var):", cat, name)
        return
    os.makedirs(os.path.join(OUT, cat), exist_ok=True)
    x = norm(np.nan_to_num(x))
    if stereo_width:
        d = int(0.012 * SR)
        r = np.concatenate([np.zeros(d), x[:-d]])
        st = np.stack([x, x * (1 - stereo_width) + r * stereo_width], 1)
    else:
        st = np.stack([x, x], 1)
    wav = os.path.join(OUT, cat, name + ".wav")
    mp3 = os.path.join(OUT, cat, name + ".mp3")
    sf.write(wav, st.astype(np.float32), SR)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-c:a", "libmp3lame", "-q:a", "3", mp3], check=True)
    os.remove(wav)
    CATALOG[f"{cat}/{name}"] = {"file": f"ses/{cat}/{name}.mp3", "category": cat, "duration": round(len(x) / SR, 2), "loop": loop, "desc": desc}
    print("+", cat, name, round(len(x) / SR, 1), "s")


# ---------------------------------------------------------------- instruments
def piano_note(freq, d=3.0, vel=0.8, bright=1.0):
    t = t_(d)
    x = np.zeros_like(t)
    for k in range(1, 9):
        f = freq * k * (1 + 0.0004 * k * k)
        if f > SR / 2.2:
            break
        amp = vel * (0.7 ** (k - 1)) * (1 if k == 1 else bright)
        x += amp * np.sin(2 * np.pi * f * t) * np.exp(-t * (1.2 + k * 0.7))
    x *= np.minimum(1, t / 0.004)
    return x


def pad_note(freq, d, detune=0.004):
    t = t_(d)
    x = sum(np.sin(2 * np.pi * freq * (1 + dd) * t + rng.random() * 6) for dd in (-detune, 0, detune))
    x += 0.4 * sum(np.sin(2 * np.pi * freq * 2 * (1 + dd) * t) for dd in (-detune, detune))
    x = lp(x, 1800)
    a = min(1.5, d / 3)
    e = np.minimum(1, t / a) * np.minimum(1, (d - t) / a)
    return x * e * 0.25


def bell(freq, d=4.0):
    t = t_(d)
    ratios = [1, 2.0, 2.76, 5.4, 8.93]
    return sum((0.6 ** i) * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * (1.5 + i)) for i, r in enumerate(ratios))


def mix(*xs):
    n = max(len(x) for x in xs)
    out = np.zeros(n)
    for x in xs:
        out[: len(x)] += x
    return out


def place(buf, x, at):
    i = int(at * SR)
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i]


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


CHORDS = {  # midi notes
    "Am": [57, 60, 64], "F": [53, 57, 60], "C": [48, 52, 55], "G": [55, 59, 62], "Dm": [50, 53, 57], "E": [52, 56, 59],
    "Em": [52, 55, 59], "D": [50, 54, 57], "Bb": [46, 50, 53], "Fmaj7": [53, 57, 60, 64], "Cmaj7": [48, 52, 55, 59],
}


# ---------------------------------------------------------------- music
def m_huzunlu_piyano():
    bpm = 66
    beat = 60 / bpm
    prog = ["Am", "F", "C", "G"] * 4
    d = len(prog) * 4 * beat + 4
    buf = np.zeros(int(d * SR))
    for i, ch in enumerate(prog):
        t0 = i * 4 * beat
        notes = CHORDS[ch]
        place(buf, piano_note(midi(notes[0] - 12), 4 * beat + 1, 0.6), t0)
        arp = [notes[0], notes[1], notes[2], notes[1] + 12 if len(notes) > 1 else notes[0] + 12]
        for j in range(8):
            n = arp[j % 4] + 12
            place(buf, piano_note(midi(n), 2.5, 0.32 + 0.08 * (j == 0)), t0 + j * beat / 2)
        if i % 2 == 1:
            mel = notes[2] + 24 if i % 4 == 1 else notes[1] + 24
            place(buf, piano_note(midi(mel), 3.5, 0.45, 0.8), t0 + 2 * beat)
    buf = reverb(buf, 2.8, 0.35)
    save("muzik", "huzunlu_piyano", loopable(buf, 3), "Hüzünlü piyano (La minör, 66 bpm). Ayrılık, kayıp, iç ses.", loop=True, stereo_width=0.6)


def m_gerilim():
    d = 64
    t = t_(d)
    drone = 0.35 * np.sin(2 * np.pi * 55 * t) + 0.2 * np.sin(2 * np.pi * 58.27 * t)  # A + Bb (minor 2nd)
    drone = lp(drone + 0.2 * noise(d, "brown"), 400) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * t))
    buf = drone.copy()
    beat = 60 / 90
    for i in range(int(d / beat)):
        if i % 4 in (0, 3) or (i // 16) % 2 == 1:
            k = piano_note(midi(33), 0.6, 0.9, 0.3) * 0.8
            place(buf, k, i * beat)
    hi = 0.05 * np.sin(2 * np.pi * 1244.5 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t)) ** 3
    buf += hi
    buf = reverb(buf, 2.2, 0.3)
    save("muzik", "gerilim", loopable(buf, 3), "Gerilim yatağı: düşük drone + nabız gibi bas + tiz disonans. Sırlar, tehdit.", loop=True, stereo_width=0.5)


def m_gizem():
    bpm = 72
    beat = 60 / bpm
    mel = [69, 72, 76, 75, 72, 69, 68, 71, 74, 72, 71, 68, 69, 72, 76, 81, 80, 76, 74, 71]
    d = len(mel) * beat * 2 + 6
    buf = np.zeros(int(d * SR))
    for r in range(2):
        for i, n in enumerate(mel):
            place(buf, bell(midi(n + 12), 3) * 0.35, (r * len(mel) + i) * beat)
    for i in range(int(d / (beat * 8))):
        place(buf, pad_note(midi(45 if i % 2 == 0 else 44), beat * 8 + 2), i * beat * 8)
    buf = reverb(buf, 3.5, 0.45, 6000)
    save("muzik", "gizem", loopable(buf, 3), "Gizem: müzik kutusu/çelesta melodisi + karanlık pad. Geçmiş, sır, flashback.", loop=True, stereo_width=0.7)


def m_umut():
    bpm = 76
    beat = 60 / bpm
    prog = ["C", "G", "Am", "F"] * 4
    d = len(prog) * 4 * beat + 4
    buf = np.zeros(int(d * SR))
    for i, ch in enumerate(prog):
        t0 = i * 4 * beat
        for n in CHORDS[ch]:
            place(buf, pad_note(midi(n), 4 * beat + 1.5), t0)
        place(buf, piano_note(midi(CHORDS[ch][0] - 12), 4 * beat, 0.5), t0)
        for j, n in enumerate([CHORDS[ch][2] + 12, CHORDS[ch][1] + 24, CHORDS[ch][2] + 24]):
            place(buf, piano_note(midi(n), 2, 0.3), t0 + (j + 1) * beat)
    buf = reverb(buf, 2.5, 0.35)
    save("muzik", "umut", loopable(buf, 3), "Umut / sıcaklık: majör akorlar, yumuşak pad ve piyano. Barışma, kavuşma.", loop=True, stereo_width=0.6)


def m_romantik():
    bpm = 60
    beat = 60 / bpm
    prog = ["Fmaj7", "Cmaj7", "Fmaj7", "Cmaj7", "Dm", "G", "Em", "Am"] * 2
    d = len(prog) * 4 * beat + 4
    buf = np.zeros(int(d * SR))
    for i, ch in enumerate(prog):
        t0 = i * 4 * beat
        notes = CHORDS[ch]
        place(buf, piano_note(midi(notes[0] - 12), 5, 0.45), t0)
        for j, n in enumerate(notes):
            place(buf, piano_note(midi(n + 12), 4, 0.25), t0 + j * 0.12)
        place(buf, piano_note(midi(notes[-1] + 24), 3, 0.35), t0 + 2 * beat)
    buf = reverb(buf, 3, 0.4)
    save("muzik", "romantik", loopable(buf, 3), "Romantik: yavaş maj7 piyano. Bakışmalar, itiraf.", loop=True, stereo_width=0.6)


def m_aksiyon():
    bpm = 120
    beat = 60 / bpm
    d = 48
    buf = np.zeros(int(d * SR))
    for i in range(int(d / beat * 2)):
        tt = i * beat / 2
        if i % 4 == 0 or i % 8 == 6:
            k = np.sin(2 * np.pi * 60 * t_(0.5) * np.exp(-t_(0.5) * 8)) * np.exp(-t_(0.5) * 9)
            place(buf, k * 1.0, tt)
        if i % 4 == 2:
            s = hp(noise(0.25), 1500) * np.exp(-t_(0.25) * 22) * 0.4
            place(buf, s, tt)
        place(buf, hp(noise(0.05), 6000) * np.exp(-t_(0.05) * 80) * 0.15, tt)
    for i in range(int(d / (beat * 16))):
        for n in (45, 48, 52):
            place(buf, pad_note(midi(n), beat * 16 + 1) * 0.6, i * beat * 16)
    ost = [57, 57, 60, 57, 62, 57, 60, 59]
    for i in range(int(d / (beat / 2))):
        place(buf, piano_note(midi(ost[i % 8] - 12), 0.4, 0.35, 0.5), i * beat / 2)
    buf = reverb(buf, 1.2, 0.18)
    save("muzik", "aksiyon", loopable(buf, 2), "Aksiyon/kovalamaca: 120 bpm davul + ostinato. Kaçış, yüzleşme, zaman baskısı.", loop=True, stereo_width=0.4)


def m_hafif():
    bpm = 104
    beat = 60 / bpm
    mel = [72, 76, 79, 76, 77, 74, 71, 74, 72, 76, 79, 84, 83, 79, 77, 74]
    prog = ["C", "F", "G", "C"]
    d = 4 * len(prog) * 4 * beat
    buf = np.zeros(int(d * SR))
    for r in range(4):
        for i, ch in enumerate(prog):
            t0 = (r * 4 + i) * 4 * beat
            for j in range(4):
                n = CHORDS[ch][0] - 12 if j % 2 == 0 else CHORDS[ch][2] - 12
                x = piano_note(midi(n), 0.3, 0.6, 0.4) * np.exp(-t_(0.3) * 10)
                place(buf, x, t0 + j * beat)
        for i, n in enumerate(mel):
            place(buf, piano_note(midi(n), 0.5, 0.35, 0.6) * np.exp(-t_(0.5) * 6), r * 16 * beat + i * beat)
    buf = reverb(buf, 1.0, 0.15)
    save("muzik", "hafif_komik", loopable(buf, 1), "Hafif/komik: pizzicato hissi, 104 bpm. Çocuklar, günlük hayat, mizah.", loop=True)


def m_jenerik():
    beat = 60 / 70
    motif = [69, 72, 71, 69, 76, 74, 72, 71, 69]
    durs = [1, 1, 1, 1, 2, 1, 1, 1, 3]
    d = sum(durs) * beat + 5
    buf = np.zeros(int(d * SR))
    t0 = 0.0
    for n, du in zip(motif, durs):
        place(buf, piano_note(midi(n), du * beat + 2, 0.6, 0.9), t0)
        place(buf, piano_note(midi(n - 12), du * beat + 2, 0.25), t0)
        t0 += du * beat
    for n in (45, 52, 57):
        place(buf, pad_note(midi(n), d), 0)
    place(buf, np.sin(2 * np.pi * 45 * t_(4)) * np.exp(-t_(4) * 1.2) * 0.9, t0 - 3 * beat)
    buf = fade(reverb(buf, 3.5, 0.4), 0.01, 1.5)
    save("muzik", "jenerik_tema", buf, "Dizinin ana teması (leitmotif). Açılış/kapanış jeneriği, 9 notalık motif.")


def m_cliffhanger():
    d = 7
    t = t_(d)
    rise = np.sin(2 * np.pi * (110 + 400 * (t / 5) ** 2) * t) * np.minimum(1, t / 5) * (t < 5)
    nz = hp(noise(d), 800) * np.minimum(1, t / 5) ** 2 * (t < 5) * 0.4
    buf = (rise * 0.4 + nz)
    hit = (np.sin(2 * np.pi * 50 * t) * np.exp(-(t - 5) * 1.5) + lp(noise(d, "brown"), 200) * np.exp(-(t - 5) * 3)) * (t >= 5)
    buf = reverb(buf + hit, 2.5, 0.35)
    save("muzik", "cliffhanger", fade(buf, 0.01, 0.5), "Bölüm sonu: 5 sn yükselen gerilim + darbe. Sır açığa çıkmadan kesme.")


# ---------------------------------------------------------------- ambiences (loops)
def a_all():
    d = 62
    t = t_(d)
    rain = hp(noise(d, "pink"), 400) * 0.6 + bp(noise(d), 3000, 9000) * 0.15 * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 11 * t)))
    save("ortam", "yagmur", loopable(lp(rain, 7000)), "Yağmur (pencere arkası). Gece sahneleri.", loop=True, stereo_width=0.8)

    hum = lp(noise(d, "brown"), 180) * 1.5 + bp(noise(d, "pink"), 200, 1200) * 0.3
    for i in range(10):
        at = rng.uniform(2, d - 6)
        car = bp(noise(4, "pink"), 150, 1500) * np.hanning(int(4 * SR)) * rng.uniform(0.4, 1)
        place(hum, car, at)
    for i in range(3):
        at = rng.uniform(5, d - 3)
        place(hum, (np.sign(np.sin(2 * np.pi * 420 * t_(0.4))) * 0.08 * np.hanning(int(0.4 * SR))), at)
    save("ortam", "sehir", loopable(hum), "Şehir uğultusu: uzaktan trafik, korna. Sokak, ofis penceresi.", loop=True, stereo_width=0.7)

    murmur = np.zeros(int(d * SR))
    for v in range(14):
        f0 = rng.uniform(110, 240)
        syll = (np.clip(np.sin(2 * np.pi * rng.uniform(3, 5) * t + rng.random() * 6), 0, 1) ** 2) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(0.05, 0.2) * t + rng.random() * 6) > 0.3)
        voice = bp(noise(d, "pink"), f0 * 2, f0 * 9) * syll
        murmur += voice * rng.uniform(0.3, 1)
    for i in range(12):
        place(murmur, bell(rng.uniform(2200, 3500), 0.6) * 0.15, rng.uniform(1, d - 2))
    save("ortam", "kafe_kalabalik", loopable(reverb(murmur, 1.2, 0.3)), "Kafe/restoran: kalabalık uğultusu + fincan şıngırtısı.", loop=True, stereo_width=0.8)

    room = lp(noise(d, "brown"), 120) * 0.6 + bp(noise(d, "pink"), 300, 900) * 0.05
    save("ortam", "oda_tonu", loopable(room), "Sessiz oda tonu. Diyalog altına 'boşluk' hissi.", loop=True)

    beep = np.zeros(int(d * SR))
    for i in range(int(d / 1.0)):
        place(beep, np.sin(2 * np.pi * 980 * t_(0.12)) * np.hanning(int(0.12 * SR)) * 0.25, i * 1.0)
    hosp = room * 0.8 + beep + bp(noise(d, "pink"), 100, 400) * 0.1
    save("ortam", "hastane", loopable(hosp), "Hastane odası: monitör bip + havalandırma.", loop=True)

    wind = bp(noise(d, "pink"), 200, 1200) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.08 * t) ** 2) + bp(noise(d), 1500, 3000) * 0.05 * (np.sin(2 * np.pi * 0.13 * t) > 0.6)
    save("ortam", "ruzgar", loopable(wind), "Rüzgâr: mezarlık, gece dışarı, yalnızlık.", loop=True, stereo_width=0.8)

    birds = 0.15 * lp(noise(d, "pink"), 800)
    for i in range(60):
        at = rng.uniform(0, d - 1)
        dd = rng.uniform(0.06, 0.18)
        tt = t_(dd)
        f = rng.uniform(2500, 4500)
        ch = np.sin(2 * np.pi * (f + 900 * np.sin(2 * np.pi * rng.uniform(15, 40) * tt)) * tt) * np.hanning(len(tt))
        for k in range(rng.integers(1, 4)):
            place(birds, ch * rng.uniform(0.2, 0.6), at + k * dd * 1.3)
    save("ortam", "kus_sesleri", loopable(birds), "Kuş cıvıltısı: park, sabah, gündüz dış mekân.", loop=True, stereo_width=0.8)

    cr = np.zeros(int(d * SR))
    for c in range(4):
        f = rng.uniform(4000, 5200)
        pulse = (np.sin(2 * np.pi * rng.uniform(2.5, 4) * t + rng.random() * 6) > 0.4) * (np.sin(2 * np.pi * 30 * t) > 0)
        cr += np.sin(2 * np.pi * f * t) * pulse * rng.uniform(0.1, 0.3)
    cr += lp(noise(d, "brown"), 150) * 0.4
    save("ortam", "gece_cekirge", loopable(cr), "Gece cırcır böceği: yaz gecesi, bahçe, köy.", loop=True, stereo_width=0.6)

    tick = np.zeros(int(d * SR))
    for i in range(int(d)):
        place(tick, hp(noise(0.02), 2000) * np.exp(-t_(0.02) * 300) * (0.5 if i % 2 else 0.35), i + 0.0)
    save("ortam", "saat_tiklama", loopable(tick + room * 0.3), "Duvar saati tik-tak: bekleyiş, gerilim, sessiz ev.", loop=True)


# ---------------------------------------------------------------- foley / sfx
def e_all():
    def thump(f=80, d=0.35, dec=14):
        tt = t_(d)
        return (np.sin(2 * np.pi * f * tt * np.exp(-tt * 3)) * np.exp(-tt * dec) + lp(noise(d), 600) * np.exp(-tt * 30) * 0.6)

    knock = np.zeros(int(1.6 * SR))
    for i, at in enumerate([0.0, 0.28, 0.56]):
        place(knock, mix(thump(140, 0.3, 25), bp(noise(0.3), 800, 2500) * np.exp(-t_(0.3) * 60) * 0.5), at)
    save("efekt", "kapi_vurma", reverb(knock, 0.6, 0.2), "Kapıya 3 kez vurma.")

    hard = np.zeros(int(1.6 * SR))
    for i, at in enumerate([0.0, 0.2, 0.4, 0.6, 0.8]):
        place(hard, thump(110, 0.3, 18) * 1.2, at)
    save("efekt", "kapi_yumruk", reverb(hard, 0.6, 0.2), "Kapıya sert/telaşlı yumruk.")

    tt = t_(2.4)
    dong = (np.where(tt < 0.7, 1, 0) * (0.45 * np.sin(2 * np.pi * 659 * tt) + 0.15 * np.sin(2 * np.pi * 1318 * tt)) * np.exp(-tt * 3.2)
            + np.where(tt >= 0.6, 1, 0) * (0.45 * np.sin(2 * np.pi * 523 * tt) + 0.15 * np.sin(2 * np.pi * 1046 * tt)) * np.exp(-np.maximum(0, tt - 0.6) * 2.2))
    save("efekt", "kapi_zili", reverb(dong, 1.0, 0.2), "Kapı zili (ding-dong).")

    slam = thump(70, 1.2, 6) * 1.2 + lp(noise(1.2, "brown"), 300) * np.exp(-t_(1.2) * 5)
    save("efekt", "kapi_carpma", reverb(slam, 1.5, 0.35), "Kapı çarpma / sert kapanma.")

    tt = t_(1.6)
    creak = np.sin(2 * np.pi * np.cumsum(180 + 60 * np.sin(2 * np.pi * 3 * tt) + 40 * tt) / SR) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * tt)) * np.minimum(1, tt * 4) * np.maximum(0, 1 - tt / 1.6)
    save("efekt", "kapi_gicirti", bp(creak, 300, 2500), "Kapı gıcırtısı (yavaş açılış).")

    steps = np.zeros(int(4 * SR))
    for i in range(8):
        place(steps, mix(thump(rng.uniform(90, 120), 0.25, 30) * 0.8, bp(noise(0.12), 1500, 5000) * np.exp(-t_(0.12) * 50) * 0.3), i * 0.5)
    save("efekt", "ayak_sesleri", reverb(steps, 0.8, 0.25), "Ayak sesleri (yürüme, 8 adım).")

    steps2 = np.zeros(int(3 * SR))
    for i in range(10):
        place(steps2, thump(110, 0.2, 35) * 0.9, i * 0.27)
    save("efekt", "kosma", reverb(steps2, 0.6, 0.2), "Koşan ayak sesleri.")

    tt = t_(2.5)
    vib = np.sin(2 * np.pi * 170 * tt) * (np.sin(2 * np.pi * 2 * tt) > 0) * 0.8
    vib = lp(vib + 0.3 * np.sign(np.sin(2 * np.pi * 85 * tt)) * (np.sin(2 * np.pi * 2 * tt) > 0), 500)
    save("efekt", "telefon_titresim", vib, "Telefon titreşimi (masa üstünde).")

    ring = np.zeros(int(4 * SR))
    for r in range(2):
        for i, n in enumerate([76, 79, 84, 79, 76, 72]):
            place(ring, bell(midi(n), 0.6) * 0.5, r * 1.8 + i * 0.15)
    save("efekt", "telefon_zil", reverb(ring, 0.6, 0.15), "Telefon zil melodisi.")

    notif = bell(midi(84), 1.2) * 0.6
    place(notif, bell(midi(91), 1.0) * 0.5, 0.12)
    save("efekt", "bildirim", notif, "Mesaj bildirimi (ding).")

    glass = np.zeros(int(2.5 * SR))
    for i in range(40):
        place(glass, bell(rng.uniform(2500, 7000), 0.4) * rng.uniform(0.05, 0.3), rng.exponential(0.25))
    place(glass, hp(noise(0.3), 2000) * np.exp(-t_(0.3) * 15), 0)
    save("efekt", "cam_kirilma", reverb(glass, 1.0, 0.25), "Cam/bardak kırılması.")

    slap = hp(noise(0.25), 800) * np.exp(-t_(0.25) * 35) + thump(200, 0.25, 40) * 0.4
    save("efekt", "tokat", reverb(slap, 0.4, 0.15), "Tokat sesi.")

    tt = t_(0.9)
    gasp = bp(noise(0.9, "pink"), 600, 3000) * np.sin(np.pi * np.minimum(1, tt / 0.5)) ** 2 * (tt < 0.5)
    save("efekt", "nefes_kesilme", gasp, "Şaşkınlıkla nefes çekme (gasp).")

    tt = t_(1.2)
    wh = bp(noise(1.2), 300, 4000) * np.sin(np.pi * tt / 1.2) ** 3
    wh = sg.sosfilt(sg.butter(2, [400 / (SR / 2), 2400 / (SR / 2)], "bandpass", output="sos"), wh)
    save("efekt", "whoosh", wh, "Geçiş whoosh'u (sahne/kamera geçişi).")

    tt = t_(4)
    riser = np.sin(2 * np.pi * np.cumsum(200 + 900 * (tt / 4) ** 2) / SR) * (tt / 4) ** 2 * 0.5 + hp(noise(4), 1500) * (tt / 4) ** 3 * 0.5
    save("efekt", "riser", fade(riser, 0.01, 0.05), "Yükselen gerilim (4 sn), darbe öncesi.")

    tt = t_(4)
    boom = np.sin(2 * np.pi * (70 - 30 * tt / 4) * tt) * np.exp(-tt * 1.4) + lp(noise(4, "brown"), 200) * np.exp(-tt * 2)
    save("efekt", "darbe", reverb(boom, 2.5, 0.35), "Dramatik darbe/sting (gerçek ortaya çıkınca).")

    tt = t_(5)
    th = lp(noise(5, "brown"), 300) * np.where(tt < 0.08, tt / 0.08, np.exp(-(tt - 0.08) * 0.9))
    save("efekt", "gok_gurultusu", th, "Gök gürültüsü.")

    hb = np.zeros(int(6 * SR))
    for i in range(7):
        place(hb, thump(52, 0.3, 26), i * 0.857)
        place(hb, thump(48, 0.3, 30) * 0.65, i * 0.857 + 0.22)
    save("efekt", "kalp_atisi", lp(hb, 160), "Kalp atışı (70 bpm). Korku/heyecan.")

    drop = mix(thump(160, 0.5, 18), bell(900, 0.4) * 0.15)
    save("efekt", "esya_dusme", reverb(drop, 0.5, 0.2), "Bir eşyanın yere düşmesi.")

    tt = t_(3)
    carpass = bp(noise(3, "pink"), 120, 1800) * np.exp(-((tt - 1.5) ** 2) * 2.5)
    save("efekt", "araba_gecis", carpass, "Yanından geçen araba.", stereo_width=0.9)

    tt = t_(1.5)
    brake = np.sin(2 * np.pi * np.cumsum(2400 - 300 * tt) / SR) * np.sin(np.pi * tt / 1.5) * 0.4 + bp(noise(1.5), 1500, 5000) * 0.2
    save("efekt", "fren", brake, "Araba freni / lastik sürtünmesi.")

    tt = t_(0.5)
    click = hp(noise(0.03), 2000) * np.exp(-t_(0.03) * 200)
    save("efekt", "tik", click, "Küçük tık (anahtar, ışık düğmesi).")

    pour = bp(noise(2.5), 800, 3500) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t_(2.5))) * np.hanning(int(2.5 * SR))
    save("efekt", "cay_dokme", pour, "Çay/su dökme (bardağa).")

    tt = t_(2.5)
    cry = np.zeros(int(2.5 * SR))
    for i in range(4):
        tt2 = t_(0.35)
        place(cry, bp(noise(0.35, "pink"), 500, 2500) * np.sin(np.pi * tt2 / 0.35) ** 2 * 0.6, i * 0.45)
    save("efekt", "hickirik", cry, "Hıçkırarak ağlama nefesleri.")


if __name__ == "__main__":
    want = set(sys.argv[1:])
    jobs = {
        "muzik": [m_huzunlu_piyano, m_gerilim, m_gizem, m_umut, m_romantik, m_aksiyon, m_hafif, m_jenerik, m_cliffhanger],
        "ortam": [a_all],
        "efekt": [e_all],
    }
    cat_path = os.path.join(OUT, "katalog.json")
    if os.path.exists(cat_path):
        CATALOG.update(json.load(open(cat_path, encoding="utf-8")))
    for group, fns in jobs.items():
        for fn in fns:
            if want and fn.__name__ not in want and group not in want:
                continue
            fn()
    json.dump(dict(sorted(CATALOG.items())), open(cat_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("Katalog:", len(CATALOG), "ses")
