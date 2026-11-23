#!/usr/bin/env python3
"""7/24 Bölüm 5, 2. parça: bütün ses (kredi yalnız `uret` ve `efekt-uret` komutlarında harcanır). dizi-studio/ içinden çalıştırılır.

  python3 tools/ses_724_05_p2.py uret [--onayla] [--butce N]   # fısıltı varyantları + Ece'nin sözsüz sesleri (ElevenLabs, kuru çalıştırma varsayılan)
  python3 tools/ses_724_05_p2.py efekt-uret [--onayla]          # parçaya özel ElevenLabs SFX'leri (el_b5p2_*)
  /opt/tts/venv/bin/python tools/ses_724_05_p2.py hrir          # SADIE II (KU100) 3. derece SH-HRIR'larını public/ses/b5p2_hrir/'e yazar (bir kez)
  /opt/tts/venv/bin/python tools/ses_724_05_p2.py kur           # bütün parçayı kurar: binaural kaynaklar + efektler + miks + kökler + önizleme
  /opt/tts/venv/bin/python tools/ses_724_05_p2.py sec           # eleven_v4 varyantlarından W1-W6 + Ece nefesleri seçimi (Whisper + tını benzerliği)
  /opt/tts/venv/bin/python tools/ses_724_05_p2.py olc           # doğrulama ölçümleri (LUFS, L/R, ITD, mono uyumluluk, Whisper)
  Whisper modeli: B5P2_WHISPER=<faster-whisper model klasörü> (varsayılan 'small', HF'den iner)

Binaural yöntem: kaynak (mono) zamanla değişen yönde 3. derece Ambisonik'e (ACN/SN3D) kodlanır, SADIE II KU100
kafa modelinin SH alanındaki HRIR'larıyla (Google Omnitone/Resonance, Apache-2.0) iki kulağa çözülür. Üstüne:
yakın alan (1/r kulak mesafesi farkı + alçak frekans ILD artışı), omuz/gövde yansıması, kısa erken yansımalar ve
binaural (kulaklar arası ilintisiz) oda kuyruğu eklenir. Ayrıntı: docs/diziler/724/raporlar/b5p2-ses.md"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(ROOT)
PLAN = os.path.join(ROOT, "public", "episodes", "724-05-p2-ses.json")
VDIR = os.path.join(ROOT, "public", "voice", "724-05-p2-ses")
EDIR = os.path.join(ROOT, "public", "ses", "efekt")
HDIR = os.path.join(ROOT, "public", "ses", "b5p2_hrir")
TMP = os.environ.get("B5P2_TMP", "/tmp/b5p2")
SR = 48000


def plan_load():
    return json.load(open(PLAN, encoding="utf-8"))


def plan_save(p):
    json.dump(p, open(PLAN, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


# ------------------------------------------------------------------ ElevenLabs üretimi (bütçe korumalı araç üzerinden)
def cmd_uret(argv):
    """uretim satırlarını modele göre geçici bölüm JSON'larına böler ve elevenlabs.py seslendir'e verir.
    Satır kimliği <id>_01 olur (ör. f1_01). Harcama korumaları (kalan kredi, yedek pay, --butce) aracın kendisindedir."""
    os.makedirs(TMP, exist_ok=True)
    p = plan_load()
    models = sorted({u["model"] for u in p["uretim"]})
    for m in models:
        ep = {"series": "724", "episode": p["episode"], "scenes": []}
        for u in p["uretim"]:
            if u["model"] != m:
                continue
            b = {"type": "line", "who": u["who"], "text": u["text"], "okunus": u["okunus"], "tags": u["tags"], "emotion": "notr"}
            if u.get("stab") is not None:
                b["stab"] = u["stab"]
            ep["scenes"].append({"id": u["id"], "cast": {}, "beats": [b]})
        path = os.path.join(TMP, f"uretim_{m}.json")
        json.dump(ep, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        cmd = [sys.executable if "venv" not in sys.executable else "python3", os.path.join(ROOT, "tools", "elevenlabs.py"), "seslendir", path, "--model", m] + argv
        print("$", " ".join(cmd), flush=True)
        r = subprocess.run(cmd, cwd=ROOT)
        if r.returncode:
            sys.exit(r.returncode)



# ================================================================== DSP çekirdeği (numpy/scipy; /opt/tts/venv/bin/python)
def _np():
    import numpy as np
    return np


def load(path, mono=True, sr=SR):
    np = _np()
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1" if mono else "2", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.float32).astype(np.float64)
    return a if mono else a.reshape(-1, 2)


def rel(p):
    return os.path.join(ROOT, "public", p)


def write_wav(path, x, sr=SR):
    import wave
    np = _np()
    x = np.asarray(x)
    if x.ndim == 1:
        x = x[:, None]
    with wave.open(path, "wb") as w:
        w.setnchannels(x.shape[1]); w.setsampwidth(3); w.setframerate(sr)
        q = (np.clip(x, -1, 1) * 8388607).astype("<i4")
        b = q.astype("<i4").tobytes()
        w.writeframes(b"".join(b[i:i + 3] for i in range(0, len(b), 4)))


def write_mp3(path, x, sr=SR, kbps=256):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp.wav"
    write_wav(tmp, x, sr)
    # tam stereo (joint stereo kapalı): kulaklar arası faz/zaman farkı kodlayıcıda korunur
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-c:a", "libmp3lame", "-b:a", f"{kbps}k", "-joint_stereo", "0", "-ar", str(sr), path], check=True)
    os.remove(tmp)


def db2a(d):
    return 10 ** (d / 20.0)


def butter_sos(kind, f, order=2):
    from scipy.signal import butter
    return butter(order, f, kind, fs=SR, output="sos")


def filt(x, kind, f, order=2, zero_phase=True):
    from scipy.signal import sosfiltfilt, sosfilt
    sos = butter_sos(kind, f, order)
    return sosfiltfilt(sos, x, axis=0) if zero_phase else sosfilt(sos, x, axis=0)


def shelf(x, f, gain_db, kind="high"):
    """birinci derece raf (low/high): x + (g-1) * (yüksek/alçak geçirgen x)"""
    g = db2a(gain_db) - 1.0
    return x + g * filt(x, "high" if kind == "high" else "low", f, 1)


def peak_eq(x, f, gain_db, q=1.0):
    from scipy.signal import iirpeak, filtfilt
    b, a = iirpeak(f / (SR / 2), q)
    return x + (db2a(gain_db) - 1.0) * filtfilt(b, a, x, axis=0)


def fade(x, fi=0.005, fo=0.005):
    np = _np()
    x = x.copy()
    n1, n2 = int(fi * SR), int(fo * SR)
    if n1:
        x[:n1] *= (np.sin(np.linspace(0, np.pi / 2, n1)) ** 2)[:, None] if x.ndim == 2 else np.sin(np.linspace(0, np.pi / 2, n1)) ** 2
    if n2:
        x[-n2:] *= (np.cos(np.linspace(0, np.pi / 2, n2)) ** 2)[:, None] if x.ndim == 2 else np.cos(np.linspace(0, np.pi / 2, n2)) ** 2
    return x


def seg(x, a, b):
    return x[int(a * SR):int(b * SR)].copy()


def resample(x, ratio):
    """perde/hız: ratio>1 -> tiz ve kısa"""
    from scipy.signal import resample_poly
    from fractions import Fraction
    fr = Fraction(1 / ratio).limit_denominator(200)
    return resample_poly(x, fr.numerator, fr.denominator, axis=0)


def rms_db(x):
    np = _np()
    return 20 * np.log10(np.sqrt(np.mean(np.asarray(x) ** 2)) + 1e-12)


# ------------------------------------------------------------------ HRIR (SADIE II KU100, SH alanı, 3. derece, ACN/SN3D)
_H = None


def hrir_sh():
    global _H
    if _H is None:
        np = _np()
        import wave
        w = wave.open(os.path.join(HDIR, "sadie_ku100_toa_sh_hrir_48k.wav"))
        a = np.frombuffer(w.readframes(w.getnframes()), "<i2").reshape(-1, w.getnchannels()).astype(np.float64) / 32768.0
        _H = a.T  # (16, 256)
    return _H


def sh_gains(az, el):
    """az, el (derece, dizi): ACN/SN3D (AmbiX) gerçek küresel harmonikler, derece 3 -> (16, N). az + = sol, 180 = arka."""
    np = _np()
    f = np.radians(az); t = np.radians(el)
    s, c = np.sin, np.cos
    st, ct = s(t), c(t)
    r3 = np.sqrt(3) / 2
    return np.array([np.ones_like(f), s(f) * ct, st, c(f) * ct,
                     r3 * s(2 * f) * ct ** 2, r3 * s(f) * s(2 * t), (3 * st ** 2 - 1) / 2, r3 * c(f) * s(2 * t), r3 * c(2 * f) * ct ** 2,
                     np.sqrt(5 / 8) * s(3 * f) * ct ** 3, np.sqrt(15) / 2 * s(2 * f) * st * ct ** 2, np.sqrt(3 / 8) * s(f) * ct * (5 * st ** 2 - 1),
                     st * (5 * st ** 2 - 3) / 2, np.sqrt(3 / 8) * c(f) * ct * (5 * st ** 2 - 1), np.sqrt(15) / 2 * c(2 * f) * st * ct ** 2,
                     np.sqrt(5 / 8) * c(3 * f) * ct ** 3])


def sh_sign():
    np = _np()
    return np.array([1.0 if m >= 0 else -1.0 for l in range(4) for m in range(-l, l + 1)])


def traj(keys, n):
    """keys: [(t, az, el, dist), ...] (t: kaynak başından sn). Örnek başına ara değer; az sarılmadan (unwrap) enterpole edilir."""
    np = _np()
    k = np.array(keys, dtype=float)
    t = np.arange(n) / SR
    az = np.interp(t, k[:, 0], np.degrees(np.unwrap(np.radians(k[:, 1]))))
    el = np.interp(t, k[:, 0], k[:, 2])
    d = np.interp(t, k[:, 0], k[:, 3])
    return az, el, d


def encode_decode(x, az, el):
    """mono x, örnek başına yön -> binaural (N+255, 2)"""
    np = _np()
    from scipy.signal import fftconvolve
    H = hrir_sh()
    sg = sh_sign()
    if np.ptp(az) < 1e-9 and np.ptp(el) < 1e-9:
        g = sh_gains(np.array([az[0]]), np.array([el[0]]))[:, 0]
        hl, hr = (g[:, None] * H).sum(0), (g[:, None] * sg[:, None] * H).sum(0)
        return np.stack([fftconvolve(x, hl), fftconvolve(x, hr)], 1)
    G = sh_gains(az, el) * x[None, :]
    Y = fftconvolve(G, H[:, :], axes=1)  # (16, N+255)
    L = Y.sum(0)
    R = (Y * sg[:, None]).sum(0)
    return np.stack([L, R], 1)


A_HEAD = 0.0875
_TAIL = {}


def _tail_ir(seed, rt60=0.75, n_sec=1.4):
    np = _np()
    key = (seed, rt60)
    if key not in _TAIL:
        rng = np.random.default_rng(seed)
        n = int(n_sec * SR)
        t = np.arange(n) / SR
        envl = np.exp(-6.91 * t / rt60)
        ir = np.zeros((n, 2))
        for ch in range(2):
            w = rng.standard_normal(n) * envl
            w = filt(w, "low", 5200, 2) + 0.0 * w
            ir[:, ch] = w
        pre = int(0.012 * SR)
        ir = np.vstack([np.zeros((pre, 2)), ir])
        ir /= np.sqrt((ir ** 2).sum() / 2)
        _TAIL[key] = ir
    return _TAIL[key]


def render(x, keys, ref=1.0, nf=True, torso=True, refl=True, tail=True, tail_gain=1.0, rt60=0.75, seed=0, gmax=30.0):
    """Mono kaynağı (x) zamanla değişen yönde/uzaklıkta binaural çizer. Uzaklık yasası (ref/d)^0.9 doğrudan seste;
    yakın alanda kulak başına 1/r farkı (ILD) + alçak frekansta karşı kulağa ek gölge; omuz/gövde yansıması (0,7 ms);
    4 erken yansıma (zemin, iki raf, tavan); ilintisiz stereo oda kuyruğu (doğrudan/yansıyan oranı uzaklıkla düşer)."""
    np = _np()
    n = len(x)
    az, el, d = traj(keys, n)
    d = np.maximum(d, 0.06)
    g_dir = np.minimum((ref / d) ** 0.9, gmax)
    xd = x * g_dir
    out = np.zeros((n + 256 + int(1.6 * SR), 2))
    B = encode_decode(xd, az, el)
    if nf:
        lat = np.sin(np.radians(az)) * np.cos(np.radians(el))  # + sol
        dl = np.sqrt(d ** 2 + A_HEAD ** 2 - 2 * A_HEAD * d * lat)
        dr = np.sqrt(d ** 2 + A_HEAD ** 2 + 2 * A_HEAD * d * lat)
        dl = np.maximum(dl, 0.035); dr = np.maximum(dr, 0.035)
        ild = np.clip(20 * np.log10(dr / dl), -12, 12)  # yakın alan 1/r farkı (dB, + sol)
        # uzak alanda (d>1,5 m) bu fark zaten ~0; ölçek tam uygulanır
        gl = db2a(ild / 2); gr = db2a(-ild / 2)
        pad = np.ones(len(B) - n)
        gl = np.concatenate([gl, pad * gl[-1]]); gr = np.concatenate([gr, pad * gr[-1]])
        lo = filt(B, "low", 900, 2)
        hi = B - lo
        # alçak frekansta karşı kulağa ek gölge (yakın kaynakta düşük frekans ILD'si büyür)
        ildp = np.concatenate([ild, pad * ild[-1]])
        extra_l = db2a(np.minimum(ildp, 0) * 0.5); extra_r = db2a(-np.maximum(ildp, 0) * 0.5)
        B = np.stack([hi[:, 0] * gl + lo[:, 0] * gl * extra_l, hi[:, 1] * gr + lo[:, 1] * gr * extra_r], 1)
    out[:len(B)] += B
    if torso:
        # omuz/gövde yansıması: kaynağın altından, 0,7 ms gecikmeli, alçak geçirgen, -12 dB
        dl_ = int(0.0007 * SR)
        xt = np.concatenate([np.zeros(dl_), filt(xd, "low", 3000, 2)])[:n] * db2a(-12)
        out[:n + 255] += encode_decode(xt, az, np.clip(el - 50, -85, 0))
    if refl:
        # yansımalar: gecikme uzaklıkla, kazanç doğrudan sese göre uzaklıkla artar (yakın fısıltıda çok küçük)
        g_ref = np.minimum((ref / np.maximum(d, 0.3)) ** 0.9, 30.0)
        for (dly, a_, e_, gdb, lpf) in [(0.0045, 0.0, -60, -10, 4000), (0.0072, 75, 0, -13, 5000), (0.0094, -80, 0, -14, 5000), (0.0125, 180, 55, -16, 3500)]:
            k = int(dly * SR)
            xr = np.concatenate([np.zeros(k), filt(x * g_ref, "low", lpf, 1)])[:n] * db2a(gdb)
            out[:n + 255] += encode_decode(xr, np.full(n, a_ + 0.0), np.full(n, e_ + 0.0)) * 0.9
    if tail:
        from scipy.signal import fftconvolve
        ir = _tail_ir(seed, rt60)
        g_t = np.minimum((ref / np.maximum(d, 0.3)) ** 0.9, 30.0) * db2a(-21) * tail_gain
        xt = x * g_t
        T = np.stack([fftconvolve(xt, ir[:, 0]), fftconvolve(xt, ir[:, 1])], 1)
        m = min(len(T), len(out))
        out[:m] += T[:m]
    # sondaki sessizliği kırp
    nz = np.nonzero(np.abs(out).max(1) > 1e-7)[0]
    return out[: (nz[-1] + 1) if len(nz) else 0]


def mono_center(x, gain=1.0):
    """kafa içi (POV) ses: iki kulağa eşit, faz farkı yok (Ece'nin kendi nefesi)"""
    np = _np()
    return np.stack([x, x], 1) * gain


# ------------------------------------------------------------------ fısıltı: LPC ile sesli konuşmayı fısıltıya çevirme (perde kaybolur, gırtlak/ağız rezonansları -> ses kimliği kalır)
def lpc_frames(y, order=44, n=1024, hop=256):
    np = _np()
    import librosa
    w = np.hanning(n)
    yp = np.append(y[0], y[1:] - 0.97 * y[:-1])
    yp = np.concatenate([np.zeros(n), yp, np.zeros(n)])
    F = []
    for i in range(0, len(yp) - n, hop):
        fr = yp[i:i + n] * w
        if np.abs(fr).max() < 1e-6:
            F.append((None, 0.0)); continue
        a = librosa.lpc(fr + 1e-9 * np.random.default_rng(i).standard_normal(n), order=order)
        from scipy.signal import lfilter
        e = lfilter(a, [1.0], fr)
        F.append((a, float(np.sqrt(np.mean(e ** 2)))))
    return F, n, hop


def lpc_synth(F, n, hop, length, seed=0, bw=0.985, gains=None, frames_a=None):
    """gürültü uyarımlı LPC sentezi (OLA). bw: bant genişliği genişletme (nefeslilik)."""
    np = _np()
    from scipy.signal import lfilter
    rng = np.random.default_rng(seed)
    w = np.hanning(n)
    out = np.zeros(len(F) * hop + n + n)
    norm = np.zeros_like(out)
    for k, (a, g) in enumerate(F):
        i = k * hop
        norm[i:i + n] += w ** 2
        if a is None or g <= 0:
            continue
        ab = a * (bw ** np.arange(len(a)))
        ex = rng.standard_normal(n) * g * (gains[k] if gains is not None else 1.0)
        fr = lfilter([1.0], ab, ex)
        # pencere enerjisi düzeltmesi: sentez çerçevesi analizdeki pencereli çerçevenin seviyesine
        out[i:i + n] += fr * w
    out = out / np.maximum(norm, 1e-3)
    # de-emphasis
    out = lfilter([1.0], [1.0, -0.97], out)
    out = out[n:n + length]
    return out


def whisperize(y, seed=0, residue_db=-60.0, bw=0.985, rasp=0.0, rasp_hz=38.0, tilt_db=4.0, sustain=None, residue_env=None):
    """y: mono 48 kHz konuşma. residue_db: sesli kaynağın altta bırakılan payı (sahne fısıltısı; ses kimliğini güçlendirir).
    residue_env: [(t_bas, t_son, dB), ...] kaynak zamanında; o aralıkta sesli pay residue_db yerine bu değer olur
    (ötümlü ünsüzler 'z', 'm' fısıltıda 's' ve sessizliğe kaymasın diye).
    rasp: 0-1, düzensiz ~30-45 Hz genlik titremesi (hırıltılı, gırtlaksı doku).
    sustain: (t_a, t_b, sure) -> [t_a,t_b] aralığındaki ünlünün LPC zarfını 'sure' sn boyunca tutarak uzatır (Eceeee…)."""
    np = _np()
    F, n, hop = lpc_frames(y)
    if sustain:
        ta, tb, dur = sustain
        ka, kb = int((ta * SR + n) / hop), int((tb * SR + n) / hop)
        held = [f for f in F[ka:kb] if f[0] is not None]
        m = int(dur * SR / hop)
        rng = np.random.default_rng(seed + 7)
        new = []
        for j in range(m):
            a, g = held[int((j / max(1, m - 1)) * (len(held) - 1) * 0.999)] if len(held) > 1 else held[0]
            # yavaş dalgalanma (canlı nefes), sona doğru hafif açılma
            g2 = g * (1.0 + 0.18 * np.sin(2 * np.pi * 0.9 * j * hop / SR + rng.uniform(0, 6)) + 0.08 * rng.standard_normal())
            new.append((a, max(0.0, g2)))
        F = F[:kb] + new + F[kb:]
        length = len(y) + m * hop
        y_res = np.concatenate([y[:int(tb * SR)], np.zeros(m * hop), y[int(tb * SR):]])[:length]
        ins = (int(tb * SR), m * hop)
    else:
        ins = None
        length = len(y)
        y_res = y
    out = lpc_synth(F, n, hop, length, seed=seed, bw=bw)
    out = filt(out, "high", 170, 2)
    out = shelf(out, 2200, tilt_db, "high")
    if rasp > 0:
        rng = np.random.default_rng(seed + 3)
        t = np.arange(length) / SR
        fm = rasp_hz * (1 + 0.15 * np.cumsum(rng.standard_normal(length)) / np.sqrt(SR) )
        ph = 2 * np.pi * np.cumsum(fm) / SR
        pulse = (0.5 + 0.5 * np.cos(ph)) ** 3
        out = out * (1 - rasp + rasp * 1.6 * pulse)
    if residue_db > -59:
        # sesli kaynak, fısıltının seviyesine göre residue_db altta (isteğe bağlı ünsüz zarfı)
        env = np.full(len(y), residue_db)
        for (a_, b_, d_) in (residue_env or []):
            i0, i1 = int(a_ * SR), int(b_ * SR)
            env[i0:i1] = d_
        k = int(0.015 * SR)
        env = np.convolve(np.pad(env, (k, k), mode="edge"), np.ones(k) / k, mode="same")[k:-k]
        if ins:
            env = np.concatenate([env[:ins[0]], np.full(ins[1], env[ins[0] - 1]), env[ins[0]:]])[:length]
        out = out + y_res * db2a(rms_db(out) - rms_db(y_res)) * db2a(env[:length])
    return out



def cmd_hrir():
    """npm'deki omnitone@1.3.0 paketinin (Apache-2.0) test kaynaklarındaki 3. derece SH-HRIR'larını (SADIE, Neumann KU100
    kafa modeli; Google'ın Resonance Audio/Omnitone için ürettiği 8 stereo WAV = 16 ACN kanalı, 48 kHz, 256 örnek) çıkarır.
    JavaScript çalıştırılmaz; dosya yalnız metin olarak ayrıştırılır."""
    import base64, io, re, tarfile, tempfile, wave
    np = _np()
    os.makedirs(HDIR, exist_ok=True)
    d = tempfile.mkdtemp(prefix="omnitone_")
    subprocess.run(["npm", "pack", "omnitone@1.3.0", "--silent"], cwd=d, check=True, capture_output=True)
    tgz = os.path.join(d, "omnitone-1.3.0.tgz")
    with tarfile.open(tgz) as t:
        js = t.extractfile("package/test/resources/omnitone-toa-hrir-base64.js").read().decode()
        lic = t.extractfile("package/LICENSE").read().decode()
    chans = []
    for b in re.findall(r'"([A-Za-z0-9+/=]+)"', js):
        w = wave.open(io.BytesIO(base64.b64decode(b)))
        assert w.getframerate() == 48000 and w.getnchannels() == 2 and w.getsampwidth() == 2
        a = np.frombuffer(w.readframes(w.getnframes()), "<i2").reshape(-1, 2)
        chans += [a[:, 0], a[:, 1]]
    H = np.stack(chans[:16], 1).astype("<i2")
    with wave.open(os.path.join(HDIR, "sadie_ku100_toa_sh_hrir_48k.wav"), "wb") as w:
        w.setnchannels(16); w.setsampwidth(2); w.setframerate(48000); w.writeframes(H.tobytes())
    open(os.path.join(HDIR, "LICENSE-Apache-2.0.txt"), "w").write(lic)
    open(os.path.join(HDIR, "README.md"), "w", encoding="utf-8").write(
        "# SADIE KU100 3. derece SH-HRIR (B5 2. parça binaural)\n\n"
        "- Dosya: `sadie_ku100_toa_sh_hrir_48k.wav`: 16 kanal (ACN sırası, SN3D/AmbiX), 48 kHz, 256 örnek, yalnız SOL kulak; sağ kulak m<0 kanallarının işareti çevrilerek bulunur (kafa simetrisi).\n"
        "- Kaynak: npm `omnitone@1.3.0` paketi, `test/resources/omnitone-toa-hrir-base64.js` (Google, Omnitone/Resonance Audio). Filtreler York Üniversitesi SADIE projesinin Neumann KU100 ölçümlerinden türetilmiştir.\n"
        "- Lisans: Apache License 2.0 (paketle gelen metin: `LICENSE-Apache-2.0.txt`). Ticari kullanım serbest; lisans metni ve kaynak bildirimi korunmalı.\n"
        "- Üretim: `/opt/tts/venv/bin/python tools/ses_724_05_p2.py hrir`. Kullanım: `tools/ses_724_05_p2.py` (render).\n")
    print("HRIR:", H.shape, "->", HDIR)



# ================================================================== sentezler (kendi sentezimiz)
def rng_(seed):
    return _np().random.default_rng(seed)


def env_ar(n, a, r):
    np = _np()
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return e


def damped(f, dec, dur, phase=0.0):
    np = _np()
    t = np.arange(int(dur * SR)) / SR
    return np.sin(2 * np.pi * f * t + phase) * np.exp(-t / dec)


def floresan_hum(dur, seed):
    """manyetik balast: 100 Hz ve harmonikleri + 100 Hz darbeli ark vızıltısı (2-7 kHz)"""
    np = _np()
    r = rng_(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for k in range(1, 15):
        a = (1.0 / k ** 1.15) * (1.3 if k % 2 else 1.0)
        x += a * np.sin(2 * np.pi * 100 * k * t + r.uniform(0, 6.28))
    pulse = (0.5 + 0.5 * np.cos(2 * np.pi * 100 * t)) ** 10
    buzz = filt(r.standard_normal(n), "band", [1800, 4500], 2) * pulse  # revizyon: 7 kHz'e kadar uzanan tiz cızırtı kulağı tırmalıyordu
    jit = 1 + 0.08 * filt(r.standard_normal(n), "low", 6, 1) * 20
    x = (x / np.abs(x).max() * 0.6 + buzz / (np.abs(buzz).max() + 1e-9) * 0.22) * jit
    return x


def starter_tik(seed, g=1.0):
    np = _np()
    r = rng_(seed)
    burst = filt(r.standard_normal(int(0.0025 * SR)), "high", 2500, 2) * np.hanning(int(0.0025 * SR))
    ring = damped(4300 + r.uniform(-200, 200), 0.018, 0.08) * 0.35 + damped(1900, 0.012, 0.08) * 0.25
    x = np.zeros(int(0.08 * SR))
    x[:len(burst)] += burst
    x += ring
    return x * g / np.abs(x).max()


def tup_ping(seed):
    """tüp ateşlenirken cam/elektrot 'ting'i"""
    return damped(2900, 0.05, 0.22) * 0.5 + damped(5750, 0.03, 0.22) * 0.3


def kepenk_vurus(seed, guc=1.0, src_hits=None):
    """kepenge dışarıdan vurulan darbe: gerçek darbe tanesi (el_kapi_yumruk) + modal metal çınlaması + lamel tıkırtısı (24-32 Hz)"""
    np = _np()
    r = rng_(seed)
    dur = 0.9
    n = int(dur * SR)
    x = np.zeros(n)
    if src_hits:
        h = src_hits[r.integers(len(src_hits))]
        h = resample(h, r.uniform(0.78, 0.92))[:n]
        x[:len(h)] += h / (np.abs(h).max() + 1e-9) * 0.8
    for _ in range(8):
        f = r.uniform(140, 1150)
        x += damped(f, r.uniform(0.06, 0.35), dur, r.uniform(0, 6)) * r.uniform(0.05, 0.22)
    t = np.arange(n) / SR
    am = (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * r.uniform(24, 32) * t + r.uniform(0, 6)))) * np.exp(-t / r.uniform(0.18, 0.3))
    x += filt(r.standard_normal(n), "band", [900, 4500], 2) * am * 0.35
    x += filt(r.standard_normal(n), "low", 400, 2) * np.exp(-t / 0.05) * 0.6
    x *= env_ar(n, 0.0008, 0.15)
    return x * guc / np.abs(x).max()


def sub_vurus(f=48.0, dur=0.32, guc=1.0):
    """gövdeye oturan alt frekans (+ telefon hoparlöründe duyulsun diye 2. ve 3. harmonik)"""
    np = _np()
    t = np.arange(int(dur * SR)) / SR
    ff = f * (1 + 0.25 * np.exp(-t / 0.03))
    ph = 2 * np.pi * np.cumsum(ff) / SR
    x = (np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)) * np.exp(-t / (dur / 3.2))
    x *= env_ar(len(x), 0.002, 0.05)
    return x * guc / np.abs(x).max()


def tik(seed, f_lo=1500, f_hi=6000, wet=True):
    """ağız/dudak/kitin tıkı"""
    np = _np()
    r = rng_(seed)
    m = int(r.uniform(0.0006, 0.0016) * SR)
    x = np.zeros(int(0.05 * SR))
    for j in range(3 if wet else 1):
        o = int(j * r.uniform(0.006, 0.014) * SR)
        b = filt(r.standard_normal(m), "band", [f_lo, f_hi], 2) * np.hanning(m) * (1.0 if j == 0 else r.uniform(0.25, 0.6))
        x[o:o + m] += b
    x += damped(r.uniform(900, 1500), 0.006, 0.05) * 0.15
    return x / (np.abs(x).max() + 1e-9)


def nefes(dur, tur, F_vowel, seed, rasp=0.0, parlak=0.0):
    """nefes: gürültü, konuşmacının kendi ünlüsünün LPC zarfından (gırtlak/ağız rezonansları) geçirilir.
    tur 'al' (içe çekiş: yükselen, tiz) / 'ver' (veriş: sönen, koyu)."""
    np = _np()
    from scipy.signal import lfilter
    r = rng_(seed)
    n = int(dur * SR)
    a = F_vowel[r.integers(len(F_vowel))]
    ab = a * (0.955 ** np.arange(len(a)))
    x = lfilter([1.0], ab, r.standard_normal(n))
    x = filt(x, "high", 350 if tur == "al" else 200, 2)
    t = np.linspace(0, 1, n)
    e = (np.sin(np.pi * t ** (0.7 if tur == "al" else 0.45)) ** 1.5)
    if tur == "al":
        e *= (0.6 + 0.4 * t)
        x = shelf(x, 2500, 4 + parlak, "high")
    else:
        e *= (1 - 0.5 * t)
    e *= 1 + 0.12 * filt(r.standard_normal(n), "low", 8, 1) * 30
    x = x * e
    if rasp > 0:
        tt = np.arange(n) / SR
        pulse = (0.5 + 0.5 * np.cos(2 * np.pi * r.uniform(30, 42) * tt + np.cumsum(r.standard_normal(n)) * 0.002)) ** 3
        x = x * (1 - rasp + rasp * 1.6 * pulse)
    x = fade(x, 0.02, 0.03)
    return x / (np.abs(x).max() + 1e-9)


def titrek_nefes(dur, seed):
    """Ece: ağzı kapalı, burundan titrek veriş (7 Hz titreme), sözsüz"""
    np = _np()
    r = rng_(seed)
    n = int(dur * SR)
    x = r.standard_normal(n)
    x = filt(x, "band", [250, 3200], 2)
    x = peak_eq(x, 260, 9, 2.0)
    x = peak_eq(x, 2300, 5, 2.5)
    t = np.arange(n) / SR
    e = np.sin(np.pi * np.linspace(0, 1, n) ** 0.5) ** 1.3 * (1 - 0.6 * np.linspace(0, 1, n))
    trem = 1 - 0.45 * (0.5 + 0.5 * np.sin(2 * np.pi * 7.2 * t + np.cumsum(r.standard_normal(n)) * 0.004))
    x = x * e * trem
    x = filt(x, "low", 4000, 2)
    return fade(x / np.abs(x).max(), 0.02, 0.05)


def drone(dur, seed):
    """çok derin uğultu (34 Hz vuruşlu + 51/68 Hz, 40-110 Hz gürültü), yavaş kabaran"""
    np = _np()
    r = rng_(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 34 * t) + np.sin(2 * np.pi * 34.37 * t) + 0.5 * np.sin(2 * np.pi * 51.1 * t) + 0.3 * np.sin(2 * np.pi * 68.2 * t + 1)
    x += 0.9 * filt(r.standard_normal(n), "band", [40, 110], 2) * 12
    x = x / np.abs(x).max()
    return x * (np.linspace(0, 1, n) ** 1.6)


def bocek_tanesi_havuzu():
    """gerçek kitin/bacak tanelerinin havuzu (B5'in ElevenLabs SFX'leri, kullanıcının hesabı)"""
    np = _np()
    pool = []
    for f in ["efekt/b5_bocek_bacak", "efekt/el_bocek_bacak", "efekt/b5_kitin_catirti", "efekt/b5_anten_hisirti", "efekt/b5_mandibula"]:
        y = load(rel(f"ses/{f}.mp3"))
        thr = np.abs(y).max() * 0.12
        on = np.nonzero(np.abs(y) > thr)[0]
        last = -10 ** 9
        for i in on:
            if i - last > int(0.03 * SR):
                g = y[max(0, i - 48): i + int(0.05 * SR)]
                if len(g) > 600:
                    pool.append(g * np.hanning(len(g)))
                last = i
    return pool


def tane_akisi(dur, rate_fn, seed, pool, synth_oran=0.5, amp_fn=None):
    """Poisson tanecik akışı: sentez tık + gerçek tane (perde 0.8-1.25)"""
    np = _np()
    r = rng_(seed)
    n = int(dur * SR)
    x = np.zeros(n + SR)
    t = 0.0
    while t < dur:
        lam = max(1e-3, rate_fn(t))
        t += r.exponential(1.0 / lam)
        if t >= dur:
            break
        i = int(t * SR)
        a = r.lognormal(0, 0.3) * (amp_fn(t) if amp_fn else 1.0)
        if r.random() < synth_oran:
            m = int(r.uniform(0.0003, 0.0012) * SR)
            fc = r.uniform(2500, 9000)
            g = filt(r.standard_normal(m + 64), "band", [fc * 0.6, min(fc * 1.4, 20000)], 1)[32:32 + m] * np.hanning(m) * 1.6
        else:
            g = pool[r.integers(len(pool))]
            g = resample(g, r.uniform(0.8, 1.25)) * 0.55
        x[i:i + len(g)] += g[: len(x) - i] * a
    x = x[:n]
    # yumuşak kırpma (tanh, ~3x RMS): seyrek tıkların tepe/gürlük oranını düşürür, bus sınırlayıcısının pompalamasını önler
    from scipy.ndimage import uniform_filter1d
    rr = np.sqrt(uniform_filter1d(x ** 2, size=int(0.25 * SR)) + 1e-10)
    c = 3.0 * rr
    return c * np.tanh(x / c)


def hisirti(dur, seed):
    """binlerce gövdenin sürtünmesi: 2,5-11 kHz gürültü, hızlı rastgele genlik (30-80 Hz)"""
    np = _np()
    r = rng_(seed)
    n = int(dur * SR)
    x = filt(r.standard_normal(n), "band", [2500, 11000], 2)
    am = np.abs(filt(r.standard_normal(n), "band", [30, 80], 1)) * 4
    return x * (0.4 + am)



# ================================================================== zaman çizelgesi (parça başından sn)
T_TOPLAM = 56.0
BOLUMLER = {
    "A": (0.0, 5.0, "Mutlak sessizlik (dijital sıfır). Ekranda '🎧 Kulaklıkla izle'."),
    "B": (5.0, 14.0, "Floresan titremesi: balast tıkı, vızıltı; her sönüşte sessizlik; her yanışta böcek daha yakında."),
    "C": (14.0, 22.0, "Kepenkler bir anda iner (14,00); dışarıdan hızlanan vuruşlar + alt frekans (ekran sarsıntısı)."),
    "D": (22.0, 33.0, "Böcek seli: binlerce bacak, raflardan düşen paketler, kitin; dalga önden yayılıp etrafı sarar, Ece'ye yaklaşır."),
    "E": (33.0, 39.0, "Her şey 33,00'te bir anda durur. Karanlık, kısık hışırtı, Ece'nin bastırılmış sesleri; 37,60-37,95 son floresan çakması: Sabri'nin yeri BOŞ."),
    "F": (39.0, 54.0, "Binaural fısıltı: Sabri'nin sesiyle 3 kez 'Ece…', annenin sesiyle 3 kez 'Kızım…'; başın arkasında dolaşır, her tekrar daha yakın, sonda üst üste biner."),
    "G": (54.0, 56.0, "54,00'te sert kararma, mutlak sessizlik (dijital sıfır)."),
}
# ışık pencereleri (açık): görüntü yönetmeni floresanı bunlara bağlar. Epilepsi güvenliği: herhangi 1 sn içinde en çok 2 yanma.
ISIK_B = [(5.06, 5.45), (6.30, 6.48), (7.40, 8.60), (9.10, 9.30), (9.90, 10.25), (11.00, 12.20), (12.55, 12.75)]
ISIK_SUREKLI = (13.40, 33.00)      # 13,40'tan 33,00'e kadar yanık (C ve D)
ISIK_DIP = [(14.00, 14.12), (15.40, 15.47), (16.55, 16.62), (17.50, 17.57), (18.25, 18.32)]  # kısa sönmeler (yalnız aralığı >=0,75 sn olan darbelerde)
ISIK_E = (37.60, 37.95)            # son çakma: boş yer
KEPENK_INIS = 14.00
KEPENK_VURUS = [15.40, 16.55, 17.50, 18.25, 18.90, 19.45, 19.92, 20.33, 20.68, 20.98, 21.24, 21.46, 21.65, 21.82]
BOCEK_YAKIN_B = [(2, 5.0), (5, 3.0)]  # (ışık penceresi no, uzaklık m): yanışlarda böcek sesi önden, giderek yakın
DUR = 33.00
KESME = 54.00

# F: fısıltılar. kaynak = (bölüm, replik, baş, son); konum anahtarları (t göreli, az, el, uzaklık)
FISILTI = [
    {"id": "W1", "kim": "Sabri", "soz": "Ece…", "t": 43.60, "kaynak": ("724-01", "c_15", 0.04, 0.86),
     "ayar": dict(residue_db=-14, rasp=0.25, seed=11, residue_env=[(0.12, 0.22, 0.0)]), "kazanc": -11.5,
     "yol": [(0, -130, -5, 0.80), (0.9, -124, -5, 0.76)], "not": "sağ arka, 80 cm: alçak, sakin (B1'deki depo çağrısının sesi)"},
    {"id": "W2", "kim": "Anne", "soz": "Kızım…", "t": 45.00, "kaynak": ("724-03", "a_02", 0.03, 0.66),
     "ayar": dict(residue_db=-5, bw=0.99, seed=33, residue_env=[(0.15, 0.25, 3.0), (0.35, 0.47, 3.0)]), "kazanc": -11.0,
     "yol": [(0, 140, 25, 0.60), (0.7, 132, 22, 0.56)], "not": "sol üst arka, 60 cm: sevecen, tatlı (B3'te depodaki şeyin taklit ettiği ses)"},
    {"id": "W3", "kim": "Sabri", "soz": "Ece…", "t": 46.60, "kaynak": ("724-01", "c_08", 0.05, 0.62),
     "ayar": dict(residue_db=-16, rasp=0.35, seed=13, residue_env=[(0.11, 0.21, 0.0)]), "kazanc": -11.0,
     "yol": [(0, -160, -20, 0.42), (0.6, 168, -20, 0.38)], "not": "ensenin arkasından geçer (sağdan sola), 40 cm"},
    {"id": "W4", "kim": "Anne", "soz": "Kızım…", "t": 47.55, "kaynak": ("724-b1", "a_07", 0.595, 1.02),
     "ayar": dict(residue_db=-4, bw=0.99, rasp=0.05, seed=14), "kazanc": -11.5,
     "yol": [(0, -115, 20, 0.34), (0.45, -108, 18, 0.31)], "not": "sağ üst arka, 32 cm"},
    {"id": "W5", "kim": "Anne", "soz": "Kızım…", "t": 50.00, "kaynak": ("724-03", "a_02", 0.03, 0.66),
     "ayar": dict(residue_db=-4, bw=0.99, seed=15, sustain=(0.27, 0.34, 0.95)), "kazanc": -12.5,
     "yol": [(0, 150, 35, 0.27), (0.8, 128, 24, 0.18), (1.63, 104, 12, 0.11)], "not": "sol üst arkadan sol kulağa iner: 'Kızııım…' (uzatılmış)"},
    {"id": "W6", "kim": "Sabri", "soz": "Ece…", "t": 51.30, "kaynak": ("724-01", "c_15", 0.04, 0.86),
     "ayar": dict(residue_db=-15, rasp=0.3, seed=16, sustain=(0.22, 0.29, 1.9), residue_env=[(0.12, 0.22, 0.0)]), "kazanc": -16.5,
     "yol": [(0, -120, -10, 0.24), (1.2, 180, -25, 0.12), (2.62, 95, -5, 0.05)], "not": "SON: sağ arka kulak dibinden enseyi dolanıp sol kulağın dibine (5 cm), 'Eceee…' sürerken 54,00'te kesilir"},
]
NEFESLER = [  # (t, süre, tür, kim, rasp, yol)
    (40.90, 1.10, "al", "Sabri", 0.15, [(0, -142, -10, 1.20), (1.1, -138, -10, 1.05)]),
    (42.15, 1.25, "ver", "Sabri", 0.35, [(0, -136, -10, 1.00), (1.25, -133, -10, 0.88)]),
    (44.45, 0.45, "al", "Anne", 0.0, [(0, 142, 25, 0.62), (0.45, 140, 25, 0.60)]),
    (46.00, 0.50, "al", "Sabri", 0.10, [(0, 176, -20, 0.46), (0.5, -172, -20, 0.43)]),
    (49.40, 0.50, "al", "Anne", 0.0, [(0, 152, 36, 0.29), (0.5, 150, 35, 0.27)]),
    (49.45, 0.75, "ver", "Sabri", 0.40, [(0, -142, -15, 0.32), (0.75, -132, -12, 0.27)]),
    (50.85, 0.40, "al", "Sabri", 0.10, [(0, -122, -10, 0.25), (0.4, -120, -10, 0.24)]),
]
TIKLAR = [  # (t, tür, yol, kazanç dB)
    (40.20, "mandibula", [(0, -150, -10, 1.6)], -14),
    (47.30, "agiz", [(0, -110, 25, 0.36)], -20),
    (48.20, "agiz", [(0, 95, 0, 0.30)], -20),
    (49.95, "agiz", [(0, 152, 35, 0.26)], -22),
    (52.10, "mandibula", [(0, 120, -30, 0.35)], -24),
]
ECE = [  # Ece'nin sözsüz sesleri (kafa içi, POV): (t, tür, kazanç dB)
    (33.35, "nefes_tutma", -21),
    (35.00, "titrek_nefes", -24),
    (36.35, "yutkunma", -22),
    (38.05, "bastirilmis_hickirik", -22),
    (48.50, "titrek_nefes_kisa", -28),
]


class Miks:
    GRUPLAR = ["isik", "kepenk", "bocek", "sub", "ece", "fisilti", "drone"]

    def __init__(self):
        np = _np()
        self.n = int((T_TOPLAM + 2) * SR)
        self.g = {k: np.zeros((self.n, 2)) for k in self.GRUPLAR}
        self.olaylar = []

    def ekle(self, grup, t, x, kazanc_db=0.0, olay="", dosya="", kadar=None, yon=None, gecikme=0.0):
        np = _np()
        if x.ndim == 1:
            x = np.stack([x, x], 1)
        x = x * db2a(kazanc_db)
        i = int(round((t + gecikme) * SR))
        if kadar is not None:
            m = int(round(kadar * SR)) - i
            if m <= 0:
                return
            if len(x) > m:
                x = fade(x[:m], 0, min(0.006, m / SR / 2))
        j = min(self.n, i + len(x))
        self.g[grup][i:j] += x[: j - i]
        self.olaylar.append({"t": round(t, 3), "son": round(t + len(x) / SR, 3), "grup": grup, "olay": olay, "kaynak": dosya,
                             "kazanc_db": round(kazanc_db, 1), **({"yon": yon} if yon else {})})


def _sahte_doku(x, ikinci_db=-20.0, golge_db=-32.0):
    """B5 1. parçadaki sahte Sabri dokusu (aynı ses, 14 ms gecikmeli -0,18 yt ikinci ağız + oktav altı gölge), daha hafif."""
    np = _np()
    os.makedirs(TMP, exist_ok=True)
    a, b = os.path.join(TMP, "sd_in.wav"), os.path.join(TMP, "sd_out.wav")
    write_wav(a, x / (np.abs(x).max() + 1e-9) * 0.5)
    fc = (f"[0:a]asplit=3[k][c][o];[c]rubberband=pitch=0.9897:formant=preserved,adelay=14,volume={db2a(ikinci_db):.4f}[c2];"
          f"[o]rubberband=pitch=0.5:formant=shifted,lowpass=f=900,volume={db2a(golge_db):.4f}[o2];[k][c2][o2]amix=inputs=3:normalize=0:duration=first")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a, "-filter_complex", fc, "-ar", str(SR), b], check=True)
    y = load(b)
    return y[: len(x)] * (np.abs(x).max() + 1e-9) / 0.5


def _kirp_sessizlik(y, esik_db=-45.0):
    np = _np()
    e = np.abs(y)
    thr = e.max() * db2a(esik_db)
    nz = np.nonzero(e > thr)[0]
    return y[max(0, nz[0] - int(0.02 * SR)): nz[-1] + int(0.05 * SR)] if len(nz) else y


def secim():
    try:
        return plan_load().get("secim", {})
    except Exception:
        return {}


def fisilti_uret(w):
    np = _np()
    sc = secim().get(w["id"])
    if sc and os.path.exists(rel(sc["dosya"])):
        # eleven_v4 gerçek fısıltı (kullanıcı kararı): LPC yok; yalnız sahte doku + seviye
        y = _kirp_sessizlik(load(rel(sc["dosya"])))
        out = fade(_sahte_doku(fade(y, 0.004, 0.03)), 0.004, 0.03)
        return out / (np.sqrt(np.mean(out ** 2)) + 1e-12) * db2a(-20)
    ep, lid, a, b = w["kaynak"]
    y = seg(load(rel(f"voice/{ep}/{lid}.mp3")), a, b)
    y = fade(y, 0.004, 0.02)
    out = whisperize(y, **w["ayar"])
    out = _sahte_doku(out)
    out = fade(out, 0.004, 0.03)
    return out / (np.sqrt(np.mean(out ** 2)) + 1e-12) * db2a(-20)


def unlu_lpc(ep, lid, a, b):
    y = seg(load(rel(f"voice/{ep}/{lid}.mp3")), a, b)
    F, _, _ = lpc_frames(y)
    return [f[0] for f in F if f[0] is not None and f[1] > 0]


def yanik_zarf(n, seed, zemin_c_db, zemin_d_db):
    """sürekli yanık ışığın (13,40-33,00) vızıltı seviyesi (dB zarf, doğrusal çarpan döner).
    14,00-14,12 sönme (ışık zarfında) -> 14,12-14,75 çırpınarak düşüş -> C zemini (yavaş ±3 dB dalgalanma) -> 21,9-23,0 D zeminine iniş."""
    np = _np()
    r = rng_(seed)
    t = np.arange(n) / SR
    z = np.zeros(n)
    m1 = (t >= 14.12) & (t < 14.75)
    u = (t[m1] - 14.12) / 0.63
    fl = filt(r.standard_normal(m1.sum()), "band", [7, 18], 1)
    flutter = -np.clip(np.abs(fl) / (np.std(fl) + 1e-12) * 5.0, 0, 15)  # yalnız aşağı yönlü kopmalar (dB)
    z[m1] = zemin_c_db * u ** 0.7 + flutter * (1 - u)
    z[(t >= 14.75) & (t < 21.9)] = zemin_c_db
    m3 = (t >= 21.9) & (t < 23.0)
    z[m3] = zemin_c_db + (zemin_d_db - zemin_c_db) * (t[m3] - 21.9) / 1.1
    z[(t >= 23.0) & (t < DUR + 0.01)] = zemin_d_db
    yavas = filt(r.standard_normal(n), "low", 0.35, 1)
    yavas = yavas / (np.std(yavas[int(14 * SR):int(DUR * SR)]) + 1e-12)
    z = np.where((t >= 14.75) & (t < DUR), z + 3.0 * np.clip(yavas, -2, 2), z)
    return db2a(z)


def cizirti_zamanlari(seed, ilk=14.9):
    """C/D'de ara sıra kısa cızırtı/tık (tüp kontağı); D'de sele gömülür"""
    np = _np()
    r = rng_(seed)
    out, t = [], ilk
    while t < DUR - 0.3:
        out.append((round(t, 3), -14.0 if t < 22.0 else -20.0))
        t += r.uniform(1.8, 4.5)
    return out


def cizirti(seed):
    """tüp kontağında kısa cızırtı: 100 Hz darbeli dar bant gürültü + tık, 40-160 ms"""
    np = _np()
    r = rng_(seed)
    d = r.uniform(0.04, 0.16)
    m = int(d * SR)
    tt = np.arange(m) / SR
    x = filt(r.standard_normal(m), "band", [1500, 4200], 2) * (0.5 + 0.5 * np.cos(2 * np.pi * 100 * tt)) ** 6
    x = x * env_ar(m, 0.002, d * 0.6) * (1 + 0.8 * (r.random(m) > 0.97))
    k = starter_tik(seed, 0.6)[: m]
    x[:len(k)] += k * 0.5
    return x / (np.abs(x).max() + 1e-9)


def isik_zarfi():
    """kare yerine örnek başına 0/1 ışık zarfı (4 ms açılış, 3 ms kapanış) + açılışta kekeleme"""
    np = _np()
    n = int(T_TOPLAM * SR)
    e = np.zeros(n)
    r = rng_(77)
    pencereler = ISIK_B + [ISIK_SUREKLI, ISIK_E]
    for (a, b) in pencereler:
        i, j = int(a * SR), int(b * SR)
        e[i:j] = 1.0
        # açılış kekelemesi: ilk 120 ms'de 2-3 kısa kopma
        for _ in range(r.integers(2, 4)):
            o = i + int(r.uniform(0.01, 0.11) * SR)
            e[o:o + int(r.uniform(0.008, 0.025) * SR)] = 0.0
    for (a, b) in ISIK_DIP:
        e[int(a * SR):int(b * SR)] = 0.0
    k = int(0.003 * SR)
    e = np.convolve(e, np.ones(k) / k, mode="same")
    return e, pencereler


def cmd_kur():
    np = _np()
    M = Miks()
    print("kaynaklar…", flush=True)
    # ---------------- B (+C/D yanık ışık, E çakması): floresan
    e_isik, pencereler = isik_zarfi()
    n = len(e_isik)
    hum_a = floresan_hum(T_TOPLAM, 1)
    hum_b = floresan_hum(T_TOPLAM, 2)
    elf = load(rel("ses/efekt/el_floresan.mp3"))
    elf = filt(np.tile(elf, int(np.ceil(n / len(elf))))[:n], "low", 6500, 2)
    src_a = (hum_a[:n] * 0.8 + elf * 0.3) * e_isik
    src_b = hum_b[:n] * e_isik
    # FLORESAN REVİZYONU (kullanıcı: "kesintisiz floresan sesi çok rahatsız edici"): ışık 13,40-33,00 yanık kalır ama
    # vızıltı 14,00 kepenk inişinde çırpınıp çok kısık, canlı bir zemine iner (yavaş dalgalanma, ara sıra cızırtı/tık,
    # iki tüp farklı); D'de (sel) daha da iner. Işık pencerelerinin zamanları değişmedi.
    src_a *= yanik_zarf(n, 401, -22.0, -30.0)
    src_b *= yanik_zarf(n, 402, -25.0, -33.0)
    for (tt, gdb) in cizirti_zamanlari(403):
        x = cizirti(int(tt * 1000))
        i = int(tt * SR); src_a[i:i + len(x)] += x[: n - i] * db2a(gdb)
    for (tt, gdb) in cizirti_zamanlari(404, ilk=15.1):
        x = cizirti(int(tt * 1000) + 7)
        i = int(tt * SR); src_b[i:i + len(x)] += x[: n - i] * db2a(gdb - 3)
    for (a, b) in pencereler:
        for (x, tt, g) in [(starter_tik(int(a * 100)), a - 0.045, 0.9), (tup_ping(int(a * 10)), a + 0.005, 0.25), (starter_tik(int(b * 100) + 1, 0.5), b, 0.4)]:
            i = int(tt * SR); src_a[i:i + len(x)] += x[: n - i] * g
    B_a = render(src_a, [(0, 20, 55, 2.2)], seed=1)
    B_b = render(src_b, [(0, -40, 50, 3.4)], seed=2)
    M.ekle("isik", 0.0, B_a, -12, "floresan tüp A (balast vızıltısı + el_floresan + marş tıkları), tavan sol-ön", "sentez + efekt/el_floresan", kadar=T_TOPLAM, yon="az+20 el+55 2,2 m")
    M.ekle("isik", 0.0, B_b, -19, "floresan tüp B, tavan sağ", "sentez", kadar=T_TOPLAM, yon="az-40 el+50 3,4 m")
    for (a, b) in pencereler:
        M.olaylar.append({"t": a, "son": b, "grup": "isik", "olay": "IŞIK AÇIK", "kaynak": ""})
    # böcek, ışık yandıkça daha yakın (yalnız ışık açıkken duyulur)
    mand = load(rel("ses/efekt/b5_mandibula.mp3")); ant = load(rel("ses/efekt/b5_anten_hisirti.mp3"))
    for k, (wi, d) in enumerate(BOCEK_YAKIN_B + [(None, 1.8)]):
        a, b = ISIK_B[wi] if wi is not None else (13.40, 14.0)
        x = np.zeros(int((b - a) * SR))
        mm = mand[: len(x)]; x[:len(mm)] += mm * 0.8
        aa = ant[: len(x)]; x[:len(aa)] += aa * 0.5
        x = fade(x, 0.004, 0.004)
        Bx = render(x, [(0, 4, -18, d)], seed=3 + k)
        M.ekle("isik", a + 0.01, Bx, -14, f"böcek (mandibula + anten), önde {d} m", "efekt/b5_mandibula + b5_anten_hisirti", kadar=b, yon=f"az+4 el-18 {d} m")
    # ---------------- C: kepenkler
    kep = load(rel("ses/efekt/el_kepenk.mp3"))
    yum = load(rel("ses/efekt/el_kapi_yumruk.mp3"))
    hits = []
    thr = np.abs(yum).max() * 0.3
    on = np.nonzero(np.abs(yum) > thr)[0]
    last = -10 ** 9
    for i in on:
        if i - last > int(0.25 * SR):
            hits.append(yum[max(0, i - 96): i + int(0.45 * SR)] * env_ar(len(yum[max(0, i - 96): i + int(0.45 * SR)]), 0.001, 0.15))
        last = i
    for k, (az, d, dt) in enumerate([(70, 4.0, 0.0), (15, 5.5, 0.06), (-50, 4.5, 0.13)]):
        x = kep * (1.0 if k == 0 else 0.8)
        x = np.concatenate([x, np.zeros(int(0.2 * SR))])
        x[:int(0.9 * SR)] += kepenk_vurus(100 + k, 0.5, hits)
        Bx = render(x, [(0, az, 5, d)], tail_gain=1.5, rt60=0.9, seed=10 + k)
        M.ekle("kepenk", KEPENK_INIS + dt, Bx, -5, f"kepenk iner (çarpma) #{k + 1}", "efekt/el_kepenk + sentez lamel", kadar=DUR, yon=f"az{az:+d} {d} m")
    M.ekle("sub", KEPENK_INIS, sub_vurus(40, 1.1, 1.0), 0, "alt frekans gümbürtüsü (kepenk inişi), merkez", "sentez", kadar=DUR)
    poz = [(70, 4.5), (20, 5.0), (-45, 4.5), (105, 4.0), (-85, 4.2), (45, 5.0), (-20, 4.8)]
    for k, t in enumerate(KEPENK_VURUS):
        guc = 0.55 + 0.45 * k / (len(KEPENK_VURUS) - 1)
        az, d = poz[k % len(poz)]
        Bx = render(kepenk_vurus(200 + k, 1.0, hits), [(0, az, 0, d)], tail_gain=1.4, rt60=0.9, seed=20 + k)
        M.ekle("kepenk", t, Bx, -4 + 20 * np.log10(guc), f"kepenge dışarıdan vuruş {k + 1}", "efekt/el_kapi_yumruk tanesi + sentez metal/lamel", kadar=DUR, yon=f"az{az:+d} {d} m")
        M.ekle("sub", t, sub_vurus(46 + (k % 3) * 3, 0.3, 1.0), -3 + 20 * np.log10(guc), f"alt frekans darbesi {k + 1} (ekran sarsıntısı)", "sentez", kadar=DUR)
    # ---------------- D: böcek seli
    pool = bocek_tanesi_havuzu()
    D0, D1 = 22.0, DUR
    dd = D1 - D0
    r = rng_(500)
    for i in range(16):
        az0 = r.uniform(-55, 55); el0 = r.uniform(5, 30); d0 = r.uniform(5, 7)
        side = 1 if i % 2 else -1
        az1 = side * r.uniform(40, 178); el1 = r.uniform(-50, -25); d1 = r.uniform(0.6, 1.2)
        keys = [(0, az0, el0, d0), (dd * 0.55, (az0 + az1) / 2, (el0 + el1) / 2, (d0 + d1) / 2.4), (dd, az1, el1, d1)]
        x = tane_akisi(dd, lambda t: 12 * np.exp(np.log(380 / 12) * t / dd), 600 + i, pool)
        Bx = render(x, keys, tail_gain=1.0, seed=40 + i)
        M.ekle("bocek", D0, Bx, -24, f"böcek seli kaynağı {i + 1} (bacak/kitin tanecikleri)", "sentez + B5 ElevenLabs taneleri", kadar=D1)
    for i in range(4):
        az0 = [-35, 35, -100, 100][i]
        x = hisirti(dd, 700 + i) * (np.linspace(0, 1, int(dd * SR)) ** 1.5)
        Bx = render(x, [(0, az0, 10, 5.5), (dd, az0 * 1.6, -35, 0.9)], seed=60 + i)
        M.ekle("bocek", D0, Bx, -25, f"hışırtı yatağı {i + 1}", "sentez", kadar=D1)
    dus = [(22.15, "el_depo_yikim", 0.0, 40, 10, 4.5), (22.90, "el_ekmek", 0.0, -60, 0, 3.0), (23.60, "esya_dusme", 0.0, 20, -10, 3.5),
           (24.30, "el_depo_devrilme", 0.0, -35, 5, 4.0), (25.10, "ekmek_dusme", 0.0, 70, 0, 2.6), (25.80, "el_ambalaj", 0.0, -80, -20, 2.0),
           (26.40, "el_depo_yikim", 1.5, -20, 10, 3.5), (27.00, "esya_dusme", 0.0, 110, -10, 2.5), (27.60, "el_ekmek", 0.0, -120, 0, 2.5),
           (28.30, "el_depo_devrilme", 0.0, 150, 5, 3.0), (29.00, "ekmek_dusme", 0.0, -30, 0, 2.0), (29.60, "el_ambalaj", 0.0, 60, -30, 1.5),
           (30.20, "esya_dusme", 0.0, -100, -10, 2.0), (30.80, "el_depo_yikim", 0.8, 90, 10, 3.0), (31.40, "el_ekmek", 0.0, -150, 0, 2.0),
           (32.00, "ekmek_dusme", 0.0, 30, -10, 1.8)]
    for k, (t, f, ss, az, el, d) in enumerate(dus):
        x = load(rel(f"ses/efekt/{f}.mp3"))[int(ss * SR):]
        if f.startswith("el_depo"):
            x = shelf(x, 1800, 7, "high")  # kapı arkası boğukluğunu aç
        x = fade(x / (np.abs(x).max() + 1e-9), 0.003, 0.1)
        Bx = render(x, [(0, az, el, d)], tail_gain=1.2, seed=80 + k)
        M.ekle("bocek", t, Bx, -16, f"raftan düşme: {f}", f"efekt/{f}", kadar=D1, yon=f"az{az:+d} el{el:+d} {d} m")
    kan = load(rel("ses/efekt/b5_kanat_vizilti.mp3"))
    M.ekle("bocek", 30.5, render(kan, [(0, -75, 20, 1.3), (0.7, 0, 35, 0.7), (1.4, 75, 20, 1.3)], seed=95), -14, "uçan böcek başın üstünden geçer", "efekt/b5_kanat_vizilti", kadar=D1, yon="sağdan sola, üstten")
    kit = load(rel("ses/efekt/b5_kitin_catirti.mp3"))
    M.ekle("bocek", 31.3, render(kit, [(0, 100, -30, 0.6)], seed=96), -17, "kitin çatırtısı sol, yerde, yakın", "efekt/b5_kitin_catirti", kadar=D1, yon="az+100 el-30 0,6 m")
    M.ekle("bocek", 32.2, render(kit, [(0, -85, -35, 0.45)], seed=97), -16, "kitin çatırtısı sağ, ayağın dibinde", "efekt/b5_kitin_catirti", kadar=D1, yon="az-85 el-35 0,45 m")
    rum = np.stack([filt(rng_(901).standard_normal(int(dd * SR)), "low", 160, 2), filt(rng_(902).standard_normal(int(dd * SR)), "low", 160, 2)], 1)
    rum *= (np.linspace(0, 1, len(rum)) ** 2)[:, None]
    M.ekle("sub", D0, rum / np.abs(rum).max(), -6, "zeminde yayılan dalga (alçak gürültü)", "sentez", kadar=D1)
    # ---------------- E: duruş
    for i in range(4):
        x = tane_akisi(4.0, lambda t: 7 * max(0.0, 1 - t / 3.5), 950 + i, pool)
        az = [-60, 60, -150, 150][i]
        M.ekle("ece", DUR + 0.25, render(x, [(0, az, -40, 2.5)], seed=110 + i), -36, f"son kıpırtılar (çok kısık) {i + 1}", "sentez + B5 taneleri", kadar=37.5)
    ece_src = {
        "nefes_tutma": filt(load(rel("ses/efekt/el_nefes_tutma.mp3")), "low", 6000, 2),
        "titrek_nefes": titrek_nefes(1.3, 31),
        "yutkunma": load(rel("ses/efekt/yutkunma.mp3")),
        "bastirilmis_hickirik": fade(filt(seg(load(rel("voice/724-05-ece4/j_02.mp3")), 0.60, 1.00), "low", 1100, 4), 0.01, 0.12),
        "titrek_nefes_kisa": titrek_nefes(0.7, 32),
    }
    for anahtar, tur_ in (("n1", "titrek_nefes"), ("n2", "bastirilmis_hickirik")):
        sc_ = secim().get(anahtar)
        if sc_ and os.path.exists(rel(sc_["dosya"])):
            yv = _kirp_sessizlik(load(rel(sc_["dosya"])))
            ece_src[tur_] = fade(filt(yv, "low", 1500, 4) if tur_ == "bastirilmis_hickirik" else yv, 0.01, 0.08)
            if tur_ == "titrek_nefes":
                ece_src["titrek_nefes_kisa"] = fade(ece_src[tur_][: int(0.7 * SR)], 0.01, 0.15)
    ece_aciklama = {"nefes_tutma": "Ece nefesini tutar (bastırılmış içe çekiş)", "titrek_nefes": "Ece: ağzı kapalı, burundan titrek veriş",
                    "yutkunma": "Ece yutkunur", "bastirilmis_hickirik": "Ece: eliyle ağzını kapatmış, bastırılmış hıçkırık (çakmadan hemen sonra)",
                    "titrek_nefes_kisa": "Ece'nin kaçırdığı küçücük titrek nefes (şey onu duyar)"}
    ece_kaynak = {"nefes_tutma": "efekt/el_nefes_tutma", "titrek_nefes": "sentez", "yutkunma": "efekt/yutkunma",
                  "bastirilmis_hickirik": "voice/724-05-ece4/j_02 (kullanılmamış çekim, 0,60-1,00, alçak geçirgen)", "titrek_nefes_kisa": "sentez"}
    for (t, tur, g) in ECE:
        x = ece_src[tur]
        x = x / (np.sqrt(np.mean(x[np.abs(x) > np.abs(x).max() * 0.05] ** 2)) + 1e-12) * db2a(-20)
        x = limiter(np.stack([x, x], 1), -20 + 16)[0][:, 0]  # tıklar sivrilmesin: tepe/RMS en çok 16 dB
        M.ekle("ece", t, mono_center(x), g, ece_aciklama[tur], ece_kaynak[tur], yon="kafa içi (POV), merkez")
    dr = drone(KESME - 38.2, 5)
    drs = np.stack([dr, np.roll(dr, 37)], 1)
    M.ekle("drone", 38.2, drs, -21, "çok derin uğultu (34 Hz vuruşlu), yavaş kabarır; müzik yok", "sentez", kadar=KESME)
    # ---------------- F: binaural fısıltılar
    print("fısıltılar…", flush=True)
    lpc_sabri = unlu_lpc("724-01", "c_15", 0.24, 0.34)
    lpc_anne = unlu_lpc("724-03", "a_02", 0.28, 0.38)
    for k, (t, d, tur, kim, rasp, yol) in enumerate(NEFESLER):
        x = nefes(d, tur, lpc_sabri if kim == "Sabri" else lpc_anne, 300 + k, rasp=rasp, parlak=2 if kim == "Anne" else 0)
        x = x / (np.sqrt(np.mean(x ** 2)) + 1e-12) * db2a(-20)
        B = render(x, yol, ref=1.0, tail_gain=0.6, seed=130 + k, gmax=10.0)
        M.ekle("fisilti", t, B, -21 if tur == "al" else -19, f"{kim} {'nefes alır' if tur == 'al' else 'ıslak, ağır nefes verir'}", f"sentez ({kim}'nin ünlü rezonansları)", kadar=KESME,
               yon=f"az{yol[0][1]:+d}→{yol[-1][1]:+d} el{yol[0][2]:+d} {yol[0][3]}→{yol[-1][3]} m")
    for k, (t, tur, yol, g) in enumerate(TIKLAR):
        x = seg(mand, 0.0, 0.35) if tur == "mandibula" else tik(400 + k)
        x = x / np.abs(x).max() * 0.3
        M.ekle("fisilti", t, render(x, yol, tail_gain=0.6, seed=150 + k, gmax=10.0), g, "kitin tıkırtısı" if tur == "mandibula" else "ıslak ağız/dudak sesi", "efekt/b5_mandibula" if tur == "mandibula" else "sentez",
               kadar=KESME, yon=f"az{yol[0][1]:+d} el{yol[0][2]:+d} {yol[0][3]} m")
    fis = []
    for k, w in enumerate(FISILTI):
        x = fisilti_uret(w)
        dur = len(x) / SR
        w = dict(w)
        son_key = w["yol"][-1][0]
        if secim().get(w["id"]) and son_key > 0:
            olc_ = (dur if w["id"] != "W6" else min(dur, KESME - w["t"])) / son_key
            w["yol"] = [(round(q[0] * olc_, 3), *q[1:]) for q in w["yol"]]
            if w["id"] == "W6" and w["t"] + dur < KESME:
                w["t"] = round(KESME - dur + 0.03, 3)  # en yakın an kesmeye denk gelsin
            w["kaynak_model"] = "eleven_v4 (" + secim()[w["id"]]["dosya"] + ")"
        # dudak aralanma tıkı: fısıltıdan 70 ms önce, aynı yerde
        tk = tik(500 + k) * 0.04
        x2 = np.concatenate([tk, np.zeros(max(0, int(0.07 * SR) - len(tk))), x])
        yol = [(p[0] + 0.07, p[1], p[2], p[3]) for p in w["yol"]]
        yol = [(0.0, *yol[0][1:])] + yol
        B = render(x2, yol, ref=1.0, tail_gain=0.5, seed=170 + k, gmax=10.0)
        np.save(os.path.join(TMP, f"yalniz_{w['id']}.npy"), B * db2a(w["kazanc"]))
        M.ekle("fisilti", w["t"] - 0.07, B, w["kazanc"], f"{w['id']} {w['kim']}: \"{w['soz']}\" ({w['not']})",
               f"voice/{w['kaynak'][0]}/{w['kaynak'][1]} [{w['kaynak'][2]}-{w['kaynak'][3]}] -> LPC fısıltı", kadar=KESME,
               yon=" → ".join(f"az{p[1]:+d} el{p[2]:+d} {p[3]} m" for p in w["yol"]))
        fis.append({"id": w["id"], "kim": w["kim"], "soz": w["soz"], "bas": w["t"], "kaynak": w.get("kaynak_model", "LPC fısıltı: voice/%s/%s" % w["kaynak"][:2]), "son": round(min(KESME, w["t"] + dur), 3), "sure": round(dur, 3),
                    "yol": w["yol"], "not": w["not"]})
    # ---------------- toplam, kesmeler, mastering
    print("miks…", flush=True)
    N = int(T_TOPLAM * SR)
    G = {k: v[:N].copy() for k, v in M.g.items()}
    # D'nin her şeyi 33,00'te bir anda durur (yansıma kuyrukları dahil)
    k0 = int(DUR * SR); kf = int(0.006 * SR)
    # D olayları ekle(kadar=DUR) ile zaten 33,00'te kesildi (kuyruk dahil). Floresan sürekli izde: 33,00-37,50 arası kuyruğu sil.
    g = G["isik"]
    g[k0:k0 + kf] *= np.linspace(1, 0, kf)[:, None]
    g[k0 + kf:int(37.50 * SR)] = 0.0
    # A ve G: dijital sıfır; 54,00 kesmesi 10 ms
    for g in G.values():
        g[:int(5.0 * SR)] = 0.0
        kk = int(KESME * SR); f10 = int(0.010 * SR)
        g[kk - f10:kk] *= np.linspace(1, 0, f10)[:, None]
        g[kk:] = 0.0
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)

    def lufs(x, a_, b_):
        try:
            v = meter.integrated_loudness(x[int(a_ * SR):int(b_ * SR)])
            return v if np.isfinite(v) else -99.0
        except Exception:
            return -99.0

    # grup bus'ları: hedef gürlük (bölümünde) + tepe tavanı -3 dBFS (4x örneklenmiş). Böylece son sınırlayıcı yalnız birkaç dB çalışır.
    BUS = {"kepenk": (14.0, 22.0, -14.0), "bocek": (22.0, 33.0, -14.5), "isik": (5.0, 14.0, -20.5),
           "ece": (33.0, 39.0, -30.0), "fisilti": (49.3, 54.0, -19.0)}
    TEPE_BUS = {"sub": -10.0, "drone": -21.0}  # alt frekans: LUFS (K-ağırlık) neredeyse saymaz; tepeye göre seviyelenir
    bus_kazanc = {}
    for gname, (a_, b_, hedef) in BUS.items():
        x = G[gname]
        gk = 0.0
        for _ in range(5):
            yb, _g = limiter(x * db2a(gk), -3.0)
            gk += hedef - lufs(yb, a_, b_)
        G[gname], _g = limiter(x * db2a(gk), -3.0)
        bus_kazanc[gname] = (round(gk, 2), round(20 * np.log10(_g.min()), 1))
        print(f"  bus {gname:8s} kazanç {gk:+6.2f} dB, bus sınırlayıcı en çok {20 * np.log10(_g.min()):5.1f} dB, >3 dB baskı {100 * np.mean(_g < db2a(-3)):.2f}% süre, hedef {hedef} LUFS ({a_}-{b_} sn)", flush=True)
    for gname, tepe in TEPE_BUS.items():
        pk = np.abs(G[gname]).max()
        gk = tepe - 20 * np.log10(pk + 1e-12)
        G[gname] = G[gname] * db2a(gk)
        bus_kazanc[gname] = (round(gk, 2), 0.0)
        print(f"  bus {gname:8s} kazanç {gk:+6.2f} dB (tepe {tepe} dBFS)", flush=True)
    mix = sum(G.values())
    gain = 0.0
    for it in range(4):
        y_l, _ = limiter(mix * db2a(gain), -2.0)
        gain += (-14.0 - meter.integrated_loudness(y_l))
    gain = min(gain, 4.0)
    y, lim_g = limiter(mix * db2a(gain), -2.0)
    L = meter.integrated_loudness(y)
    print(f"master: kazanç {gain:+.2f} dB, {L:.2f} LUFS, son sınırlayıcı en çok {20 * np.log10(lim_g.min()):.1f} dB (en derin an {np.argmin(lim_g) / SR:.2f} sn), >1 dB baskı {100 * np.mean(lim_g < db2a(-1)):.2f}% süre", flush=True)
    # kökler (aynı kazanç + aynı sınırlayıcı kazancı): tam = efekt + fısıltı
    fis_kok = G["fisilti"] * db2a(gain) * lim_g[:, None]
    efekt_kok = y - fis_kok
    E_OUT = EDIR
    write_mp3(os.path.join(E_OUT, "b5p2_tam.mp3"), y)
    write_mp3(os.path.join(E_OUT, "b5p2_kok_efekt.mp3"), efekt_kok)
    write_mp3(os.path.join(E_OUT, "b5p2_kok_fisilti.mp3"), fis_kok)
    F0 = int(39.0 * SR)
    write_mp3(os.path.join(E_OUT, "b5p2_fisilti_binaural.mp3"), y[F0:int(KESME * SR) + int(0.3 * SR)])
    os.makedirs(os.path.join(REPO, "ornekler"), exist_ok=True)
    write_mp3(os.path.join(REPO, "ornekler", "b5p2-ses-onizleme.mp3"), y, kbps=256)
    write_mp3(os.path.join(REPO, "ornekler", "b5p2-binaural-ornek.mp3"), y[int(44.0 * SR):int(KESME * SR) + int(0.5 * SR)], kbps=256)
    np.save(os.path.join(TMP, "mix.npy"), y)
    np.save(os.path.join(TMP, "fis.npy"), fis_kok)
    # plan
    p = plan_load()
    p["plan"] = {
        "toplam_sure": T_TOPLAM, "orneklem": SR, "kanal": "stereo (binaural; kulaklıkla)",
        "bolumler": {k: {"bas": v[0], "son": v[1], "aciklama": v[2]} for k, v in BOLUMLER.items()},
        "isik": {"B_pencereler": ISIK_B, "surekli": ISIK_SUREKLI, "kisa_sonmeler": ISIK_DIP, "E_cakma": ISIK_E,
                 "kural": "Ses bu pencerelere bağlıdır: ışık açıkken vızıltı, kapalıyken sessizlik. Herhangi 1 sn'de en çok 2 yanma (ışığa duyarlı epilepsi güvenliği). Hızlanan vuruşlarda (18,90 sonrası) ışık sönmez; istenirse en çok %20 kısılma."},
        "kepenk": {"inis": KEPENK_INIS, "vuruslar": KEPENK_VURUS, "not": "Her vuruş = ekran sarsıntısı karesi (alt frekans darbesi aynı anda)."},
        "dur": DUR, "kesme": KESME,
        "fisiltilar": fis,
        "olaylar": sorted(M.olaylar, key=lambda o: o["t"]),
        "dosyalar": {
            "tam": "ses/efekt/b5p2_tam.mp3",
            "kok_efekt": "ses/efekt/b5p2_kok_efekt.mp3",
            "kok_fisilti": "ses/efekt/b5p2_kok_fisilti.mp3",
            "fisilti_binaural_F": "ses/efekt/b5p2_fisilti_binaural.mp3 (F başından, 39,00'dan 54,30'a)",
            "onizleme": "ornekler/b5p2-ses-onizleme.mp3", "kulaklik_ornegi": "ornekler/b5p2-binaural-ornek.mp3 (44,00-54,50)",
        },
        "motor": "Önerilen: parçanın ilk sahnesine \"music\": {\"name\": \"efekt/b5p2_tam\", \"volume\": 1.0}; başka music/ambience/sfx/line yok. Ayrıntı: docs/diziler/724/raporlar/b5p2-ses.md §6",
        "fisilti_toplam_kazanc_db": round(bus_kazanc["fisilti"][0] + gain, 2),
        "master": {"hedef_lufs": -14.0, "tepe_dbtp": -1.5, "son_kazanc_db": round(gain, 2), "bus": {k: {"kazanc_db": v[0], "sinirlayici_en_cok_db": v[1], "hedef": BUS.get(k, ("tepe", TEPE_BUS.get(k)))} for k, v in bus_kazanc.items()}},
    }
    plan_save(p)
    print("tamam:", T_TOPLAM, "sn", flush=True)


def limiter(x, thr_db=-1.6, look=0.002, rel_s=0.08):
    """4x örneklenmiş tepe (gerçek tepe yaklaşığı) üzerinden ileri bakışlı sınırlayıcı"""
    np = _np()
    from scipy.signal import resample_poly
    thr = db2a(thr_db)
    up = np.abs(resample_poly(x, 4, 1, axis=0)).max(1)
    pk = up.reshape(-1, 4).max(1)[: len(x)]
    if len(pk) < len(x):
        pk = np.concatenate([pk, np.zeros(len(x) - len(pk))])
    g = np.minimum(1.0, thr / np.maximum(pk, 1e-9))
    la = int(look * SR)
    # ileri bakış: kazancı la örnek önden uygula (kayan minimum)
    from scipy.ndimage import minimum_filter1d
    g = minimum_filter1d(g, size=2 * la + 1, origin=0)
    # bırakma: tek kutuplu yumuşatma (yalnız yükselirken)
    a = np.exp(-1.0 / (rel_s * SR))
    out = g.copy()
    for i in range(1, len(out)):
        if out[i] > out[i - 1]:
            out[i] = a * out[i - 1] + (1 - a) * out[i]
    # atak yumuşatma
    k = max(1, la)
    out = np.convolve(np.pad(out, (k, k), mode="edge"), np.ones(k) / k, mode="same")[k:-k]
    out = np.minimum(out, g)
    return x * out[:, None], out



def _itd_ild(L, R):
    np = _np()
    Ll, Rl = filt(L, "low", 1500, 4), filt(R, "low", 1500, 4)
    m = 48
    c = [np.dot(Ll[m:-m], np.roll(Rl, k)[m:-m]) for k in range(-m, m + 1)]
    lag = int(np.argmax(c)) - m  # + : sağ kulak önde (kaynak sağda)
    return round(rms_db(L) - rms_db(R), 1), round(-lag / SR * 1e6)


def _mono_kayip(L, R):
    """(L+R)/2'nin enerjisi, L ve R enerjilerinin ortalamasına göre (dB; 0 = kayıp yok, ilintisiz -3) + 1/3 oktav bantlarda en kötü çukur"""
    np = _np()
    M = (L + R) / 2
    tot = 10 * np.log10(np.mean(M ** 2) / (0.5 * (np.mean(L ** 2) + np.mean(R ** 2))) + 1e-12)
    f = np.fft.rfftfreq(len(L), 1 / SR)
    SL, SRr, SM = np.abs(np.fft.rfft(L)) ** 2, np.abs(np.fft.rfft(R)) ** 2, np.abs(np.fft.rfft(M)) ** 2
    worst, wf = 0.0, 0
    fc = 200.0
    while fc < 8000:
        b = (f >= fc / 2 ** (1 / 6)) & (f < fc * 2 ** (1 / 6))
        v = 10 * np.log10(SM[b].sum() / (0.5 * (SL[b].sum() + SRr[b].sum())) + 1e-12)
        if v < worst:
            worst, wf = v, fc
        fc *= 2 ** (1 / 3)
    return round(tot, 1), round(worst, 1), int(wf)


def cmd_olc():
    np = _np()
    import re, librosa
    from faster_whisper import WhisperModel
    p = plan_load()
    rapor = {}
    on = os.path.join(REPO, "ornekler", "b5p2-ses-onizleme.mp3")
    st = subprocess.run(["ffmpeg", "-hide_banner", "-i", on, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", st)[-1]); LRA = float(re.findall(r"LRA:\s+(-?[\d.]+) LU", st)[-1])
    TP = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", st)[-1])
    y = load(on, mono=False)
    sus = {"A_0-5_tepe_dBFS": round(20 * np.log10(np.abs(y[:int(4.98 * SR)]).max() + 1e-12), 1),
           "G_54,02-56_tepe_dBFS": round(20 * np.log10(np.abs(y[int(54.02 * SR):int(55.9 * SR)]).max() + 1e-12), 1),
           "E_33,01-33,24_tepe_dBFS": round(20 * np.log10(np.abs(y[int(33.01 * SR):int(33.24 * SR)]).max() + 1e-12), 1)}
    Mm = (y[:, 0] + y[:, 1]) / 2
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)
    rapor["master"] = {"I_LUFS": I, "LRA_LU": LRA, "gercek_tepe_dBTP": TP, "sessizlik": sus,
                       "mono_toplam_LUFS": round(meter.integrated_loudness(np.stack([Mm, Mm], 1)), 2),
                       "LR_ilinti_F": round(float(np.corrcoef(y[int(39 * SR):int(54 * SR), 0], y[int(39 * SR):int(54 * SR), 1])[0, 1]), 3)}
    print(json.dumps(rapor["master"], ensure_ascii=False), flush=True)
    fis = np.load(os.path.join(TMP, "fis.npy"))
    wm = os.environ.get("B5P2_WHISPER", "small")
    asr = WhisperModel(wm, device="cpu", compute_type="int8")

    def yaz(x):
        x = np.asarray(x, dtype=np.float32)
        x = x / (np.abs(x).max() + 1e-9) * 0.5
        segs, _ = asr.transcribe(librosa.resample(x, orig_sr=SR, target_sr=16000), language="tr", beam_size=5, vad_filter=len(x) > 5 * SR)
        return " ".join(s_.text.strip() for s_ in segs)

    rows = []
    gk = db2a(p["plan"]["fisilti_toplam_kazanc_db"])
    onceki_son = 0.0
    for w in p["plan"]["fisiltilar"]:
        a, b = w["bas"] - 0.05, min(w["son"] + 0.05, KESME)
        # yalnız çizilmiş fısıltı (üst üste binen öteki fısıltı olmadan); 70 ms dudak tıkı payı atlanır
        X = np.load(os.path.join(TMP, f"yalniz_{w['id']}.npy"))[int(0.02 * SR):int((0.07 + w["sure"] + 0.05) * SR)] * gk
        # tam miks: öteki fısıltıyla çakışan baş kısım atlanır (W6: W5 bitince)
        a2 = a  # kendi başlangıcı; öteki fısıltıyla çakışma "cakisma_sn" olarak raporlanır
        Y = y[int(a2 * SR):int(b * SR)]
        cakisma = round(max(0.0, onceki_son - w["bas"]), 2)
        onceki_son = max(onceki_son, w["son"])
        # ILD/ITD: başta ve sonda (hareket)
        n3 = len(X) // 3
        ild0, itd0 = _itd_ild(X[:n3, 0], X[:n3, 1])
        ild1, itd1 = _itd_ild(X[-n3:, 0], X[-n3:, 1])
        mk, mw, mf = _mono_kayip(X[:, 0], X[:, 1])
        r = {"id": w["id"], "kim": w["kim"], "soz": w["soz"], "bas": w["bas"], "miks_penceresi": [round(a2, 2), round(b, 2)], "cakisma_sn": cakisma,
             "ILD_bas_dB": ild0, "ITD_bas_us": itd0, "ILD_son_dB": ild1, "ITD_son_us": itd1,
             "mono_kayip_dB": mk, "mono_en_kotu_bant_dB": mw, "mono_en_kotu_bant_Hz": mf,
             "kisa_sureli_LUFS_miks": round(meter.integrated_loudness(Y) if len(Y) > 0.4 * SR else float("nan"), 1),
             "whisper_L": yaz(X[:, 0]), "whisper_R": yaz(X[:, 1]), "whisper_mono": yaz(X.sum(1)), "whisper_tam_miks": yaz(Y.sum(1))}
        rows.append(r)
        print(json.dumps(r, ensure_ascii=False), flush=True)
    # F'nin tamamını tek seferde yazıya dökmek, sessize yakın bölümlerde bilinen Whisper uydurmalarına yol açıyor
    # ("Abone olmayı unutmayın" vb.). Bunun yerine fısıltı aralıkları (43,5-54,0) art arda, tam miksten:
    F = y[int(43.5 * SR):int(KESME * SR)]
    rapor["F_tam_miks_whisper"] = yaz(F.sum(1))
    rapor["fisiltilar"] = rows
    print("F tam miks:", rapor["F_tam_miks_whisper"], flush=True)
    p["plan"]["dogrulama"] = rapor
    plan_save(p)



def _mfcc_ort(y):
    np = _np()
    import librosa
    y16 = librosa.resample(np.asarray(y, dtype=np.float32), orig_sr=SR, target_sr=16000)
    M = librosa.feature.mfcc(y=y16, sr=16000, n_mfcc=20)
    e = librosa.feature.rms(y=y16)[0][: M.shape[1]]
    act = e > e.max() * 0.1
    return M[1:, act].mean(1)


def cmd_sec():
    '''eleven_v4 varyantlarından (public/voice/724-05-p2-ses) W1-W6 ve Ece nefesleri için seçim: Whisper anlaşılırlığı +
    önceki bölümlerdeki aynı sesin kayıtlarına MFCC (tını zarfı) kosinüs benzerliği. Sonuç plan JSON 'secim'.'''
    np = _np()
    import re, librosa
    from faster_whisper import WhisperModel
    asr = WhisperModel(os.environ.get("B5P2_WHISPER", "small"), device="cpu", compute_type="int8")
    p = plan_load()
    man_p = os.path.join(VDIR, "manifest.json")
    if not os.path.exists(man_p):
        raise SystemExit("v4 varyantı yok: önce 'uret --onayla'.")
    man = json.load(open(man_p, encoding="utf-8"))
    ref = {"sabri": [("724-01", "c_15"), ("724-01", "c_08"), ("724-05", "f_01")], "anne724": [("724-03", "a_02"), ("724-b1", "a_07")]}
    refv = {k: np.mean([_mfcc_ort(load(rel(f"voice/{e}/{l}.mp3"))) for e, l in v], 0) for k, v in ref.items()}
    beklenen = {"sabri": "ece", "anne724": "kızım"}
    sonuc = []
    for u in p["uretim"]:
        lid = f"{u['id']}_01"
        if lid not in man:
            continue
        y = _kirp_sessizlik(load(rel(man[lid]["file"])))
        segs, _ = asr.transcribe(librosa.resample((y / (np.abs(y).max() + 1e-9) * 0.5).astype(np.float32), orig_sr=SR, target_sr=16000), language="tr", beam_size=5)
        duy = " ".join(x.text.strip() for x in segs)
        norm = re.sub(r"[^a-zçğıöşü]", "", duy.replace("I", "ı").replace("İ", "i").lower())
        r_ = {"id": u["id"], "who": u["who"], "hedef": u.get("hedef"), "dosya": man[lid]["file"], "sure": round(len(y) / SR, 2), "whisper": duy}
        if u["who"] in refv:
            v = _mfcc_ort(y)
            r_["benzerlik"] = round(float(np.dot(v, refv[u["who"]]) / (np.linalg.norm(v) * np.linalg.norm(refv[u["who"]]))), 3)
            r_["anlasilir"] = beklenen[u["who"]] in norm
        sonuc.append(r_)
        print(json.dumps(r_, ensure_ascii=False), flush=True)
    sec = {}
    kullanilan = set()
    for W, kim in [("W1", "sabri"), ("W3", "sabri"), ("W6", "sabri"), ("W2", "anne724"), ("W4", "anne724"), ("W5", "anne724")]:
        aday = [r_ for r_ in sonuc if r_["who"] == kim and r_.get("anlasilir") and r_["id"] not in kullanilan]
        aday.sort(key=lambda r_: (r_["hedef"] != W, -r_.get("benzerlik", 0)))
        if aday:
            sec[W] = {k: aday[0][k] for k in ("id", "dosya", "whisper", "benzerlik", "sure")}
            kullanilan.add(aday[0]["id"])
    for r_ in sonuc:
        if r_["who"] == "ece_sivil" and r_["id"] in ("n1", "n2"):
            sec[r_["id"]] = {k: r_[k] for k in ("id", "dosya", "whisper", "sure")}  # sözsüz: Whisper boş/anlamsız olmalı; dinlenerek onaylanır
    p["secim"] = sec
    p["secim_olcum"] = sonuc
    plan_save(p)
    print("seçim:", json.dumps(sec, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    c = sys.argv[1] if len(sys.argv) > 1 else ""
    if c == "uret":
        cmd_uret(sys.argv[2:])
    elif c == "hrir":
        cmd_hrir()
    elif c == "kur":
        cmd_kur()
    elif c == "olc":
        cmd_olc()
    elif c == "sec":
        cmd_sec()
    else:
        print(__doc__)
