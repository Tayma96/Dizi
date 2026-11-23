"""7/24 B6 Parça 2 ("Zincir") çekim senaryosu + replik manifesti + alt ses (ağlama/efekt/ortam/müzik).

Kullanım: python3 tools/b6p2.py      -> public/episodes/724-06-p2.json, public/voice/724-06-p2/manifest.json,
                                        public/ses/efekt/b6p2_alt.mp3
Replikler standart motorla (manifest) çalınır; alt ses tek parça (sahne a'nın müziği, duck kapalı).
"""
import json, os, subprocess

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
S = f"{K}/public/ses"
CK = f"{K}/public/voice/724-06-p2/cekim"
ECE, SABRI, ANNE = "ece_sivil", "sabri", "anne724"
AGLA = {"emotion": "agliyor", "tears": 1, "sacDagin": True, "onluk": False, "pale": 0.25}


def act(dur, shot, cast=None, **kw):
    b = {"type": "action", "dur": dur, "shot": shot}
    if cast:
        b["cast"] = cast
    b.update(kw)
    return b


def line(who, text, take, shot, cast=None, **kw):
    b = {"type": "line", "who": who, "text": text, "emotion": "notr", "gapAfter": 0.3, "shot": shot, "_take": take}
    if cast:
        b["cast"] = cast
    b.update(kw)
    return b


sahneler = [
    {"id": "a", "set": "market_kapi", "time": "gunduz", "saat": "07:31", "title": "Bir aylık maaş", "look": "normal", "transition": "kesme", "sabah": True,
     "isaretler": {"ece_m": {"x": 800, "y": 1880, "size": 1260}, "sabri_m": {"x": 290, "y": 1860, "size": 1300}, "cikis": {"x": 550, "y": 1262, "size": 640}},
     "music": {"name": "efekt/b6p2_alt", "volume": 1.0, "duck": False},
     "cast": {ECE: {"mark": "ece_m", **AGLA, "lookAt": SABRI}, SABRI: {"mark": "sabri_m", "emotion": "uzgun", "lookAt": ECE}},
     "beats": [
         act(2.6, {"type": "iki", "on": SABRI, "with": ECE, "move": "yaklas"}, {SABRI: {"gesture": "uzat", "prop": "para"}}),
         act(1.8, {"type": "yakin", "on": ECE, "move": "sabit"}, {ECE: {"emotion": "sok", "bak": {"x": -0.5, "y": 0.35}}}),
         act(1.2, {"type": "orta", "on": ECE, "move": "sabit"}, {ECE: {"emotion": "saskin", "gesture": "tutuyor", "prop": "para"}, SABRI: {"gesture": "rest", "prop": None}}),
         line(SABRI, "bu gece yine çalışmak ister misin kızım? Yüksek maaş vericem", "S1_01", {"type": "orta", "on": SABRI, "move": "yaklas"}),
         act(1.8, {"type": "yakin", "on": ECE, "move": "yaklas"}, {ECE: {"emotion": "ofkeli", "tears": 1, "lookAt": SABRI}}),
         act(1.4, {"type": "orta", "on": ECE, "move": "sabit"}, {ECE: {"emotion": "agliyor", "gesture": "rest", "prop": None, "hickir": 0.8}}),
         act(2.0, {"type": "genis", "move": "sabit"}, {ECE: {"mark": "cikis", "yuruSure": 1.6, "hickir": 0.8}, SABRI: {"lookAt": ECE}}),
     ]},
    {"id": "b", "set": "sokak", "time": "gunduz", "title": "Koşa koşa eve", "transition": "kesme",
     "cast": {ECE: {"mark": "orta", **AGLA, "body": "kos", "enter": "sol"}},
     "beats": [
         act(1.6, {"type": "genis", "move": "sabit"}),
         act(1.3, {"type": "genis", "move": "sabit"}, {ECE: {"body": "kos", "exit": "sag"}}),
     ]},
    {"id": "c", "set": "ev_antre", "time": "gunduz", "title": "Kapı", "transition": "kesme",
     "isaretler": {"ece_esik": {"x": 560, "y": 1560, "size": 950}},
     "cast": {ECE: {"mark": "ece_esik", **AGLA, "hickir": 0.8}},
     "beats": [
         act(1.1, {"type": "genis", "move": "sabit"}, door="ac"),
         act(1.5, {"type": "genis", "move": "yaklas"}, {ECE: {"mark": "ece_giris", "yuruSure": 0.8}}, door="kapat"),
         {"type": "insert", "kind": "ev_anahtar", "dur": 1.4},
         {"type": "insert", "kind": "ev_zincir", "dur": 1.3},
     ]},
    {"id": "d", "set": "ev_antre_z", "time": "gunduz", "title": "Yoksa öğrendi mi?", "transition": "kesme",
     "cast": {ECE: {"mark": "ece_kapi", **AGLA, "yerOtur": 1, "hickir": 1, "aglaAgiz": 0.8}},
     "beats": [
         act(3.4, {"type": "orta", "on": ECE, "move": "yaklas"}),
         act(1.8, {"type": "genis", "move": "sabit"}, {ANNE: {"mark": "anne", "enter": "sag", "emotion": "saskin", "lookAt": ECE}}),
         line(ANNE, "yoksa öğrendi mi?", "I2_01", {"type": "yakin", "on": ANNE, "move": "yaklas"}, {ANNE: {"emotion": "korkmus", "lookAt": ECE}},
              voiceover=True, label="Anne (içinden)", gapAfter=0.5),
         line(ANNE, "noldu kızım neyin var?", "A2_01", {"type": "iki", "on": ANNE, "with": ECE, "move": "sabit"},
              {ANNE: {"mark": "anne_yan", "diz": True, "emotion": "uzgun", "gesture": "okşa", "lookAt": ECE}}),
         line(ANNE, "Biri bir şey mi yaptı", "B1_01", {"type": "yakin", "on": ANNE, "move": "sarsinti"}, {ANNE: {"emotion": "ofkeli", "gesture": "rest"}}),
         act(2.4, {"type": "yakin", "on": ECE, "move": "sabit"},
             {ECE: {"bakSira": [{"at": 0, "x": 0, "y": 0.3, "yaw": 0}, {"at": 0.3, "x": -0.3, "y": 0.3, "yaw": -0.45}, {"at": 0.65, "x": 0.3, "y": 0.3, "yaw": 0.45},
                                {"at": 1.0, "x": -0.3, "y": 0.3, "yaw": -0.45}, {"at": 1.35, "x": 0, "y": 0.35, "yaw": 0}]}}),
     ]},
]


def zamanla(man):
    """motorun timeline.ts mantığı: vuruş başlangıçları (sn) ve toplam"""
    out, t = {}, 0.0
    for s in sahneler:
        loc = 0
        for i, b in enumerate(s["beats"]):
            if b["type"] == "line":
                v = man.get(f"{s['id']}_{i + 1:02d}")
                d = round((v["duration"] + b.get("gapAfter", 0.3)) * FPS)
            else:
                d = round(b["dur"] * FPS)
            out[(s["id"], i)] = (t + loc / FPS, d / FPS)
            loc += d
        t += loc / FPS
    return out, t


def main():
    kay = json.load(open(f"{CK}/manifest.json"))
    man = {}
    for s in sahneler:
        for i, b in enumerate(s["beats"]):
            if b["type"] == "line":
                man[f"{s['id']}_{i + 1:02d}"] = kay[b.pop("_take")]
    json.dump(man, open(f"{K}/public/voice/724-06-p2/manifest.json", "w"), ensure_ascii=False, indent=1)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": "724-06-p2", "episodeNo": 6, "title": "Bölüm 6 · Parça 2", "endCard": False, "scenes": sahneler}
    json.dump(ep, open(f"{K}/public/episodes/724-06-p2.json", "w"), ensure_ascii=False, indent=1)
    z, top = zamanla(man)
    T = lambda s, i, d=0.0: z[(s, i)][0] + d
    print(f"toplam {top:.1f} sn;", " ".join(f"{s}{i}:{a:.1f}" for (s, i), (a, _) in z.items()))
    a_son, b0, c0, d0 = T("a", 6), T("b", 0), T("c", 0), T("d", 0)
    P = [  # (dosya, zaman, dB, kırp, fade_in, fade_out)
        (f"{S}/efekt/el_buzdolabi.mp3", 0, -24, None, 0.3, 0.5), (f"{S}/efekt/el_buzdolabi.mp3", 6, -24, None, 0.5, 0.5),
        (f"{S}/efekt/el_buzdolabi.mp3", 12, -24, (0, b0 - 12), 0.5, 0.4),
        (f"{S}/ortam/kus_sesleri.mp3", 0, -27, (0, b0), 0.3, 0.4),
        (f"{CK}/../../724-06/cekim/C4_01.mp3", 0, -9, None, 0.2, 0.8),             # hıçkırık (zarfı alırken)
        (f"{S}/efekt/el_kumas_burus.mp3", T("a", 2, 0.1), -10, None, 0, 0.2),    # para elden ele
        (f"{CK}/../../724-06/cekim/C3_01.mp3", T("a", 4, 0.2), -6, None, 0.1, 0.6),  # söver gibi bakış: boğuk ağlama
        (f"{S}/efekt/ayak_sesleri.mp3", a_son, -14, (0, 2.0), 0.05, 0.3),
        (f"{S}/efekt/el_otomatik_kapi.mp3", a_son + 0.9, -12, (0, 1.6), 0, 0.4),
        (f"{S}/efekt/el_dingdong.mp3", a_son + 1.0, -9, None, 0, 0),
        # sokak: koşu + nefes nefese ağlama
        (f"{S}/ortam/sehir.mp3", b0, -18, (0, c0 - b0 + 0.3), 0.1, 0.3),
        (f"{S}/efekt/kosma.mp3", b0, -10, (0, c0 - b0), 0.05, 0.3),
        (f"{CK}/K1_01.mp3", b0, -2, (0, c0 - b0 + 0.2), 0.05, 0.3),
        # ev: kapı, kilit, zincir
        (f"{S}/efekt/kapi_kapanma.mp3", T("c", 1, 0.9), -4, None, 0, 0.3),
        (f"{S}/efekt/kilit.mp3", T("c", 2, 0.25), -2, None, 0, 0),
        (f"{S}/efekt/kilit.mp3", T("c", 2, 0.8), -2, None, 0, 0),
        (f"{S}/efekt/kilit_yarim.mp3", T("c", 3, 0.2), -3, None, 0, 0),
        (f"{S}/efekt/el_tablet_kilit.mp3", T("c", 3, 1.05), -6, None, 0, 0.2),
        (f"{CK}/../../724-06/cekim/C2_01.mp3", T("c", 0, 0.2), -10, (0, 2.6), 0.1, 0.4),  # merdivenden hıçkırık
        # yerde ağlama (anne konuşurken de sürer, kısık)
        (f"{CK}/../../724-06/cekim/C1_01.mp3", d0, 0, None, 0.05, 0.6),
        (f"{CK}/../../724-06/cekim/C2_01.mp3", T("d", 2), -9, None, 0.3, 0.6),
        (f"{CK}/../../724-06/cekim/C4_01.mp3", T("d", 5), -3, None, 0.05, 0.5),
        # müzik: eve girince hüzünlü; "yoksa öğrendi mi?"de keser, sonra alçak gerilim
        (f"{S}/muzik/b6_safak.mp3", c0, -16, (24, 24 + T("d", 2) - c0), 1.0, 0.25),
        (f"{S}/efekt/korku_vurus.mp3", T("d", 2, 0.05), -14, None, 0, 1.0),
        (f"{S}/muzik/b6_safak.mp3", T("d", 3), -20, (2, 2 + top - T("d", 3)), 1.5, 1.0),
    ]
    ins, flt = [], []
    for i, (f, t, g, kirp, fi, fo) in enumerate(P):
        f = os.path.normpath(f)
        ins += ["-i", f]
        c = []
        if kirp:
            c.append(f"atrim={kirp[0]:.3f}:{kirp[1]:.3f},asetpts=PTS-STARTPTS")
        c.append("aformat=sample_rates=44100:channel_layouts=stereo")
        d = (kirp[1] - kirp[0]) if kirp else float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode())
        if fi:
            c.append(f"afade=t=in:d={fi}")
        if fo:
            c.append(f"afade=t=out:st={max(0, d - fo):.3f}:d={fo}")
        c += [f"volume={g}dB", f"adelay={int(t * 1000)}|{int(t * 1000)}"]
        flt.append(f"[{i}:a]{','.join(c)}[a{i}]")
    flt.append("".join(f"[a{i}]" for i in range(len(P))) + f"amix=inputs={len(P)}:normalize=0:dropout_transition=0,atrim=0:{top:.3f}[m]")
    cik = f"{S}/efekt/b6p2_alt.mp3"
    subprocess.run(["ffmpeg", "-y", "-v", "error", *ins, "-filter_complex", ";".join(flt), "-map", "[m]", "-b:a", "256k", cik], check=True)
    print(cik)


if __name__ == "__main__":
    main()
