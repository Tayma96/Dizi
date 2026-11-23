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


# ---------------------------------------------------------------- Sahne a: market, sabah (b6_kapi; P1'in son durumundan)
MARKET = {
    "ac": [[0, 1]], "gunes": [[0, 1]], "tanA": [[0, 0.75]], "gun": [[0, 1]], "gunesY": [[0, 1]], "floresan": [[0, 1]],
    "sel": False, "eceBocek": False, "red": 0, "tozIzi": 0.6, "saat": [[0, "07:31"]], "kapi": [[0, 1]],
    # Ece yerde; para görünce şok, alır, göğsüne bastırır; söver gibi bakış; cebine koyar, kalkar, kameranın solundan çıkar
    "eceYer": [[0, 0.25, 3.3], [13.6, 0.25, 3.3], [15.6, -1.25, 5.6]], "eceYuru": [[13.6, 15.6]],
    "eceOtur": [[0, 1], [12.7, 1], [13.6, 0]],
    "eceDuygu": [[0, "agliyor"], [2.1, "sok"], [5.4, "agliyor"], [9.95, "ofkeli"], [11.9, "agliyor"]],
    "eceHickir": [[0, 0.7], [2.0, 0.7], [2.1, 0], [5.4, 0], [5.8, 0.6], [9.9, 0.6], [10.0, 0], [11.9, 0], [12.2, 0.8]],
    "eceAgla": [[0, 0.45]], "gozyasi": [[0, 1]],
    "eceBak": [[0, -0.3, 0.2, -0.2], [2.0, -0.3, 0.2, -0.2], [2.2, -0.45, 0.45, -0.3], [5.3, -0.45, 0.45, -0.3], [5.5, -0.5, 0.0, -0.35],
               [11.9, -0.5, 0.0, -0.35], [12.2, 0, 0.35, 0], [13.6, -0.3, 0.1, -0.3]],
    "eceKol": [[0, 10, -60, 0.9, 10, -60, 0.9], [3.9, 10, -60, 0.9, 10, -60, 0.9], [4.35, 70, -50, 1.0, 10, -60, 0.9],
               [4.8, 25, -125, 0.9, 10, -60, 0.9], [11.9, 25, -125, 0.9, 10, -60, 0.9], [12.6, 6, -10, 1, 6, 0, 1], [13.6, 6, 0, 1, 6, 0, 1]],
    "eceDeste": [[0, False], [4.45, True], [12.5, False]],
    "eceTilt": [[0, 0], [9.9, 0], [10.2, 4], [11.8, 4], [12.2, 0]],
    "sabri": {"yol": [[0, -0.12, 3.1]], "diz": [[0, 1]], "saril": [[0, 0]], "okşa": False,
              "uzat": [[0, 0], [1.0, 0], [2.0, 1], [4.5, 1], [5.2, 0]], "deste": [[0, False], [0.95, True], [4.45, False]],
              "duygu": [[0, "uzgun"]], "konus": [[5.3, 9.75]], "bak": [[0, 0.45, 0.4, 0.3], [13.6, 0.45, 0.4, 0.3], [15.0, -0.4, 0.2, -0.3]],
              "egil": [[0, 6], [13.0, 6], [14.0, 0]]},
}
A_CEK = [  # (süre, kamera, açıklama)
    (2.0, [[0, 560, 1330, 1.45], [2.0, 570, 1330, 1.55]], "Sabri cebinden desteyi çıkarır"),
    (1.6, [[2.0, 610, 1350, 2.5], [3.6, 615, 1350, 2.65]], "deste Ece'ye uzanır (yakın)"),
    (1.7, [[3.6, 650, 1290, 1.9], [5.3, 655, 1285, 1.95]], "Ece şok, alır, göğsüne bastırır"),
    (2.4, [[5.3, 470, 1230, 1.9], [7.7, 475, 1220, 2.0]], "Sabri: bu gece…"),
    (1.0, [[7.7, 677, 1250, 2.3], [8.7, 677, 1250, 2.35]], "Ece tepki (maaş)"),
    (1.25, [[8.7, 475, 1220, 2.0], [9.95, 478, 1215, 2.05]], "Sabri bitirir"),
    (1.95, [[9.95, 677, 1250, 2.1], [11.9, 677, 1245, 2.6]], "söver gibi bakış (yavaş yaklaşma)"),
    (1.7, [[11.9, 620, 1320, 1.6], [13.6, 610, 1250, 1.5]], "cebine koyar, kalkar"),
    (2.0, [[13.6, 560, 1150, 1.15], [15.6, 540, 1120, 1.1]], "kameranın solundan çıkar; Sabri arkasından bakar"),
]
DIS = {"ac": [[0, 1]], "gun": [[0, 1]], "gunesY": [[0, 1]], "saat": [[0, "07:31"]],
       "ece": {"yol": [[0, 2.3, 7.2], [0.45, 2.05, 6.3], [3.0, -0.35, 1.1]], "kos": [[0, 3.0]]},
       "cam": [[0, 560, 1000, 1.05], [3.0, 520, 1060, 1.15]]}


def kapi_cekimleri():
    """b6_kapi çekimleri; Sabri'nin repliği (4,47 sn) tek line vuruşunda, içinde 3 çekim (kamera anahtarlarında sert kesme)"""
    t, out, i = 0.0, [], 0
    while i < len(A_CEK):
        d, cam, _ = A_CEK[i]
        p = dict(MARKET); p["t0"] = t
        if i == 3:
            c = []
            for dd, cc, _ in A_CEK[3:6]:
                c.append([cc[0][0] + (0.004 if c else 0)] + cc[0][1:])
                c.append(cc[1])
            p["cam"] = c
            dur = sum(x[0] for x in A_CEK[3:6])
            out.append({"type": "line", "who": SABRI, "text": "bu gece yine çalışmak ister misin kızım? Yüksek maaş vericem",
                        "_take": "S1_01", "gapAfter": round(dur - 4.467, 3), "ekle": {"kind": "b6_kapi", "text": [json.dumps(p, ensure_ascii=False)]}})
            t += dur; i += 3; continue
        p["cam"] = cam
        out.append({"type": "insert", "kind": "b6_kapi", "dur": d, "text": [json.dumps(p, ensure_ascii=False)]})
        t += d; i += 1
    return out


sahneler = [
    {"id": "a", "set": "market_kapi", "time": "gunduz", "saat": "07:31", "title": "Bir aylık maaş", "transition": "kesme", "cast": {},
     "music": {"name": "efekt/b6p2_alt", "volume": 1.0, "duck": False}, "beats": []},
    {"id": "b", "set": "market_kapi", "time": "gunduz", "title": "Kaçış", "transition": "kesme", "cast": {},
     "beats": [{"type": "insert", "kind": "b6_dis", "dur": 3.0, "text": [json.dumps(dict(DIS, t0=0), ensure_ascii=False)]}]},
    {"id": "c", "set": "ev_antre", "time": "gunduz", "title": "Kapı", "transition": "kesme",
     "isaretler": {"ece_esik": {"x": 560, "y": 1560, "size": 950}},
     "cast": {ECE: {"mark": "ece_esik", **AGLA, "hickir": 0.9, "aglaAgiz": 0.5}},
     "beats": [
         act(1.2, {"type": "genis", "move": "yaklas", "kadraj": {"cx": 560, "cy": 1060, "z": 1.05}}, door="ac"),
         act(1.4, {"type": "orta", "on": ECE, "move": "yaklas"}, {ECE: {"mark": "ece_kapi", "yuruSure": 0.7, "bak": {"x": 0.6, "y": 0}}}, door="kapat"),
         {"type": "insert", "kind": "ev_anahtar", "dur": 1.4},
         {"type": "insert", "kind": "ev_zincir", "dur": 1.3},
     ]},
    {"id": "d", "set": "ev_antre_z", "time": "gunduz", "title": "Yoksa öğrendi mi?", "transition": "kesme",
     "cast": {ECE: {"mark": "ece_kapi", **AGLA, "hickir": 1, "aglaAgiz": 0.8, "yerOtur": 0}},
     "beats": [
         act(3.2, {"type": "orta", "on": ECE, "move": "yaklas", "kadraj": {"cx": 560, "cy": 1300, "z": 1.35}}, {ECE: {"yerOtur": 1, "bak": {"x": 0, "y": 0.4}}}),
         act(1.9, {"type": "genis", "move": "sabit", "kadraj": {"cx": 640, "cy": 1180, "z": 1.1}}, {ANNE: {"mark": "anne", "enter": "sag", "emotion": "saskin", "lookAt": ECE}}),
         line(ANNE, "yoksa öğrendi mi?", "I2_01", {"type": "yakin", "on": ANNE, "move": "yaklas"}, {ANNE: {"emotion": "korkmus", "lookAt": ECE, "pale": 0.35}},
              voiceover=True, label="Anne (içinden)", gapAfter=0.7),
         act(1.2, {"type": "iki", "on": ANNE, "with": ECE, "move": "sabit"}, {ANNE: {"mark": "anne_yan", "yuruSure": 0.7, "emotion": "uzgun", "lookAt": ECE}}),
         line(ANNE, "noldu kızım neyin var?", "A2_01", {"type": "iki", "on": ANNE, "with": ECE, "move": "yaklas"},
              {ANNE: {"diz": True, "emotion": "uzgun", "gesture": "okşa", "lookAt": ECE}}),
         line(ANNE, "Biri bir şey mi yaptı", "B1_01", {"type": "yakin", "on": ANNE, "move": "sarsinti", "kadraj": {"cx": 750, "cy": 1110, "z": 1.9}}, {ANNE: {"diz": True, "emotion": "ofkeli", "gesture": "yumruk", "lookAt": ECE}}),
         act(2.6, {"type": "yakin", "on": ECE, "move": "yaklas", "kadraj": {"cx": 545, "cy": 1250, "z": 2.2}},
             {ECE: {"bakSira": [{"at": 0, "x": 0, "y": 0.3, "yaw": 0}, {"at": 0.35, "x": -0.3, "y": 0.3, "yaw": -0.45}, {"at": 0.75, "x": 0.3, "y": 0.3, "yaw": 0.45},
                                {"at": 1.15, "x": -0.3, "y": 0.3, "yaw": -0.45}, {"at": 1.55, "x": 0, "y": 0.35, "yaw": 0}]}}),
     ]},
]
sahneler[0]["beats"] = kapi_cekimleri()


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
        (f"{S}/efekt/el_kumas_burus.mp3", 0.95, -10, None, 0, 0.2),          # deste cepten çıkar
        (f"{S}/efekt/el_kumas_burus.mp3", 4.4, -9, None, 0, 0.2),           # para elden ele
        (f"{CK}/../../724-06/cekim/C3_01.mp3", T("a", 4, 0.2), -6, None, 0.1, 0.6),  # söver gibi bakış: boğuk ağlama
        (f"{S}/efekt/ayak_sesleri.mp3", a_son, -14, (0, 2.0), 0.05, 0.3),
        (f"{S}/efekt/el_otomatik_kapi.mp3", a_son + 1.6, -12, (0, 1.6), 0, 0.4),
        (f"{S}/efekt/el_dingdong.mp3", a_son + 1.7, -9, None, 0, 0),
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
        (f"{CK}/../../724-06/cekim/C4_01.mp3", T("d", 6), -3, None, 0.05, 0.5),
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
