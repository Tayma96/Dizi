#!/usr/bin/env python3
"""Bölüm sesinin çevrimdışı önizlemesi (video render etmeden; ücretsiz). Motorun (engine/Episode.tsx + timeline.ts)
ses kurallarını taklit eder: replik vuruş başından 0,08 sn sonra başlar; sfx `at` ile ve vuruş sonu + 6 sn'ye kadar çalar;
ortam döngüsü diyalogda %60, müzik %55 kısılır; ortam adı değişen kesmelerde 10 kare, müzik başı/sonunda 30 kare sönüm;
bitiş kartında jenerik_tema 0,6. Son master: loudnorm -14 LUFS / -1,5 dBTP (render.sh ile aynı).

Kullanım: python3 tools/ses_onizleme.py <bolum-id> <cikti.mp3> [--cizelge cizelge.txt]"""
import json, os, subprocess, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
FPS = 30
_cache = {}


def load(rel):
    if rel not in _cache:
        p = os.path.join(ROOT, "public", rel)
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
        _cache[rel] = np.frombuffer(raw, np.float32).reshape(-1, 2)
    return _cache[rel]


def ducked(n_frames, speaking, ramp):
    d = np.zeros(n_frames)
    f = np.arange(n_frames)
    for a, b in speaking:
        k = np.where(f < a, (f - (a - ramp)) / ramp, np.where(f > b, 1 - (f - b) / ramp, 1.0))
        k = np.where((f >= a - ramp) & (f <= b + ramp), k, 0.0)
        d = np.maximum(d, k)
    return d


def env_from_frames(vals, start_f, n):
    """kare başına değerleri örnek başına doğrusal ara değerle (start_f'den n örnek)."""
    t = start_f + np.arange(n) / SR * FPS
    return np.interp(t, np.arange(len(vals)), vals)


def main():
    ep_id, out = sys.argv[1], sys.argv[2]
    ep = json.load(open(os.path.join(ROOT, "public", "episodes", ep_id + ".json"), encoding="utf-8"))
    mp = os.path.join(ROOT, "public", "voice", ep_id, "manifest.json")
    man = json.load(open(mp, encoding="utf-8")) if os.path.exists(mp) else {}
    # zaman çizelgesi
    scenes, t, speaking, log = [], 0, [], []
    for sc in ep["scenes"]:
        local, beats = 0, []
        for i, b in enumerate(sc["beats"]):
            voice = None
            if b["type"] == "line":
                lid = f"{sc['id']}_{i + 1:02d}"
                v = man.get(lid)
                sec = v["duration"] if v else b.get("sure", max(1.2, len(b["text"].split()) * 0.42))
                dur = round((sec + b.get("gapAfter", 0.3)) * FPS)
                vfrom = round(0.08 * FPS)
                if v:
                    voice = (v["file"], vfrom)
                speaking.append((t + local + vfrom, t + local + vfrom + round(sec * FPS)))
                log.append(f"{(t + local) / FPS:6.2f}  {lid:6s} {sc['beats'][i]['who']:12s} ses {sec:5.2f} sn  {b['text']}")
            else:
                dur = round(b["dur"] * FPS)
                log.append(f"{(t + local) / FPS:6.2f}  {b['type']:6s} {b.get('kind', '')}")
            for s in b.get("sfx", []):
                log.append(f"{(t + local) / FPS + s.get('at', 0):6.2f}      sfx {s['name']} ({s.get('volume', 0.7)})")
            beats.append((local, dur, b, voice))
            local += dur
        scenes.append({"sc": sc, "from": t, "dur": local, "beats": beats})
        t += local
    end_card = 0 if ep.get("endCard") is False else 4 * FPS
    total = t + end_card
    N = int(total / FPS * SR) + SR
    mix = np.zeros((N, 2), np.float32)
    d_amb = ducked(total + 1, speaking, 10)
    d_mus = ducked(total + 1, speaking, 8)

    def add(rel, start_f, vol, max_f=None, loop=False, env=None):
        a = load(rel)
        s0 = int(start_f / FPS * SR)
        n = int((max_f / FPS) * SR) if max_f is not None else len(a)
        if loop:
            reps = int(np.ceil(n / len(a)))
            a = np.tile(a, (reps, 1))
        a = a[:n]
        n = min(len(a), N - s0)
        if n <= 0:
            return
        g = vol if env is None else vol * env[:n, None]
        mix[s0:s0 + n] += a[:n] * g

    for si, S in enumerate(scenes):
        sc = S["sc"]
        for key, base_def in (("ambience", 0.25), ("ambience2", 0.1)):
            amb = sc.get(key)
            if not amb:
                continue
            n = int(S["dur"] / FPS * SR)
            fr = np.arange(S["dur"] + 1, dtype=float)
            if key == "ambience":
                prev = scenes[si - 1]["sc"].get("ambience", {}).get("name") if si > 0 else None
                nxt = scenes[si + 1]["sc"].get("ambience", {}).get("name") if si + 1 < len(scenes) else None
                fi, fo = prev != amb["name"], nxt != amb["name"]
            else:
                fi = fo = True
            a = np.clip(fr / 10, 0, 1) if fi else np.ones_like(fr)
            b = np.clip((S["dur"] - fr) / 10, 0, 1) if fo else np.ones_like(fr)
            vals = a * b * (1 - 0.6 * d_amb[S["from"]:S["from"] + S["dur"] + 1])
            add(f"ses/{amb['name']}.mp3", S["from"], amb.get("volume", base_def), max_f=S["dur"], loop=True, env=env_from_frames(vals, 0, n))
        for local, dur, b, voice in S["beats"]:
            win = dur + 6 * FPS
            if voice:
                add(voice[0], S["from"] + local + voice[1], b.get("vol", 1.0), max_f=win - voice[1])
            for s in b.get("sfx", []):
                off = round(s.get("at", 0) * FPS)
                add(f"ses/{s['name']}.mp3", S["from"] + local + off, s.get("volume", 0.7), max_f=max(1, win - off))
    # müzik bölütleri
    segs = []
    for S in scenes:
        m = S["sc"].get("music")
        last = segs[-1] if segs else None
        if m and m["name"] != "yok" and not (last and last["name"] == m["name"] and last["to"] == S["from"]):
            segs.append({"name": m["name"], "from": S["from"], "to": S["from"] + S["dur"], "vol": m.get("volume", 0.35), "ss": m.get("from", 0)})
        elif m and m["name"] == "yok":
            continue
        elif last and last["to"] == S["from"]:
            last["to"] = S["from"] + S["dur"]
    for sg in segs:
        dur = sg["to"] - sg["from"]
        fr = np.arange(dur + 1, dtype=float)
        vals = np.clip(fr / 30, 0, 1) * np.clip((dur - fr) / 30, 0, 1) * (1 - 0.55 * d_mus[sg["from"]:sg["from"] + dur + 1])
        n = int(dur / FPS * SR)
        add(f"ses/{sg['name']}.mp3", sg["from"], sg["vol"], max_f=dur, loop=True, env=env_from_frames(vals, 0, n))
        log.append(f"{sg['from'] / FPS:6.2f}  müzik {sg['name']} ({sg['vol']}) -> {sg['to'] / FPS:.2f}")
    if end_card:
        add("ses/muzik/jenerik_tema.mp3", total - end_card, 0.6, max_f=end_card)
    mix = mix[: int(total / FPS * SR)]
    tmp = out + ".tmp.wav"
    import wave
    with wave.open(tmp, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype("<i2").tobytes())
    pk = float(np.abs(mix).max())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), "-c:a", "libmp3lame", "-b:a", "192k", out], check=True)
    os.remove(tmp)
    print(f"{out}: {total / FPS:.2f} sn (ham tepe {20 * np.log10(pk + 1e-9):.1f} dBFS)")
    if "--cizelge" in sys.argv:
        open(sys.argv[sys.argv.index("--cizelge") + 1], "w", encoding="utf-8").write("\n".join(sorted(log, key=lambda x: float(x.split()[0]))) + "\n")


if __name__ == "__main__":
    main()
