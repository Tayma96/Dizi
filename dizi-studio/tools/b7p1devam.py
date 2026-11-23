"""7/24 B7 Parça 1, DEVAM (açılış: ornekler/b7p1-v2-ornek.mp4, 14,55 sn; bu sahne onun bittiği yerden sürer).
Kullanım: python3 tools/b7p1devam.py [json | kare sn ...]

Başlangıç durumu (açılışın sonu): anne (610,1880) sağ elinde deste, sol eli belde; sepet makinenin üstünde; gün batımı ışığı.
MANTIK / KOMEDİ notları:
 - Ece koridordan (sağdaki kapı) sürünerek gelir: göz yarı kapalı, kafa kaşır, esner; anneyi görünce donar, yutkunur.
 - "dev gibi böcek": parmaklarıyla başında anten yapar, dehşetle anlatır.
 - "terliği vur geç": anne havada terlik vuruşu yapar (şap!).
 - "para diyorum": anne bir adım yaklaşıp desteyi Ece'nin yüzüne sallar.
 - "ver bi bakıyım": Ece desteyi annenin elinden kapar (anne şaşkın).
 - "Oha lan": Ece desteyi yanağına bastırır, gözler parlar.
 - kulak: anne sağ eliyle Ece'nin kulağını tutup kaldırır; Ece parmak ucunda; iç ses bu arada (gözler kaçamak).
 - "ama çok para lan": Ece kulağı tutulurken bile paraya sırıtır; anne gözlerini kısar.
 - "git elini yüzünü yıka": anne kulağı bırakır, desteyi geri kapar, sol eliyle lavaboyu gösterir; Ece suratı asık lavaboya.
"""
import json, os, subprocess, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAN = json.load(open(f"{K}/public/voice/724-07/cekim/manifest.json"))
TAR = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"
ACILIS = 14.549
sure = lambda tk: MAN[tk]["duration"]

SIRA = [  # (ad, kim, metin, çekim, boşluk) — replikler kullanıcının metninden AYNEN
    ("G", None, None, None, 3.0),
    ("A04", "anne724", "nerden geldi bu paralar nasıl bi marketmiş lan o", "A04b_01", 0.2),
    ("E01", "ece_ev", "anneee dev gibi böcek vardı markette ölüyodummm", "E01a_01", 0.2),
    ("A05", "anne724", "Böcek evde de var terliği vur geç", "A05a_01", 0.25),
    ("A06", "anne724", "para diyorum Ece para bu para ne alakaaaa?", "A06b_01", 0.15),
    ("E02", "ece_ev", "çok mu ya o kadar ver bi bakıyım", "E02b_01", 0.45),
    ("E03", "ece_ev", "yüz, iki yüz, yüz, iki yüz", "E03a_01", 0.15),
    ("E04", "ece_ev", "Oha lan ne çok para", "E04b_01", 0.25),
    ("E05", "ece_ev", "aauuv ah ah acıyo", "E05a_01", 0.1),
    ("A07", "anne724", "nerden geldi bu para?", "A07a_01", 0.2),
    ("E06", "ece_ev", "şimdi olanları anlatırsam hem bana inanmaz hem de tekrar gitmeme izin vermez", "E06a_01", 0.2),
    ("E07", "ece_ev", "ama çok para lan", "E07b_01", 0.35),
    ("A08", "anne724", "git elini yüzünü yıka bu paranın hesabını vereceksin bana!", "A08a_01", 0.2),
    ("CIK", None, None, None, 1.6),
]
T, t = {}, 0.0
for ad, kim, metin, tk, gap in SIRA:
    T[ad] = t
    t += (sure(tk) + gap) if tk else gap
SON = t
g, a4, e1, a5, a6, e2, e3, e4, e5, a7, e6, e7, a8, ck = (T[x] for x in ("G", "A04", "E01", "A05", "A06", "E02", "E03", "E04", "E05", "A07", "E06", "E07", "A08", "CIK"))
konus = lambda ad, tk: {"t": T[ad] + 0.08, "cues": MAN[tk]["mouth"]}

# ---------------------------------------------------------------- ANNE
# omuzlar: L (517,1070) R (703,1070); sağ el destede; sol el belde (rig 38,-105)
ANNE = {
    "yer": [[0, 610, 1880, 1290], [a6, 610, 1880, 1290], [a6 + 0.5, 660, 1885, 1300], [e3, 660, 1885, 1300], [e3 + 0.3, 590, 1880, 1290]],
    "kolL": [[0, 38, -105]], "yuru": [[a6, a6 + 0.5]],
    "elR": [[0, 772, 1055], [1.2, 690, 1215], [g + 2.6, 690, 1215],
            [a4, 690, 1215], [a4 + 0.4, 790, 1040], [a4 + 0.7, 760, 1090], [a4 + 1.0, 790, 1040], [a4 + 1.3, 760, 1090], [a4 + 2.9, 760, 1090], [a4 + 3.4, 690, 1215], [a6, 690, 1215],
            [a6 + 0.6, 830, 1060], [a6 + 0.9, 855, 1035], [a6 + 1.2, 830, 1060], [a6 + 1.5, 855, 1035], [a6 + 1.8, 830, 1060], [a6 + 2.1, 855, 1035], [e2, 830, 1060],
            [e2 + 2.3, 830, 1060], [e2 + 2.55, 790, 1060],                         # Ece kapınca el boşta kalır (şaşkın)
            [e5, 760, 1090], [e5 + 0.15, 769, 962], [e5 + 0.6, 769, 912],          # kulağı tutar ve kaldırır
            [e7 + 2.9, 769, 912], [a8, 769, 912], [a8 + 0.2, 790, 1000], [a8 + 0.45, 812, 1138], [a8 + 0.75, 780, 1080]],  # bırakır, desteyi geri kapar
    "elRara": [[-99, 99]], "bukumR": 1,
    "elL": [[0, 520, 1290], [a5 + 0.9, 520, 1290], [a5 + 1.15, 470, 980], [a5 + 1.3, 610, 1180], [a5 + 1.45, 520, 1290],  # terlik vuruşu
            [a8 + 1.0, 520, 1290], [a8 + 1.4, 330, 1000], [a8 + 3.5, 330, 1000]],   # lavaboyu gösterir
    "elLara": [[a5 + 0.85, a5 + 1.55], [a8 + 0.95, 99]], "bukumL": -1,
    "tutR": [[0, "deste"], [e2 + 2.4, None], [a8 + 0.5, "deste"]],
    "duygu": [[0, "ofkeli"], [a5, "alayci"], [a6, "ofkeli"], [e2 + 2.4, "saskin"], [e3, "ofkeli"], [e7 + 0.9, "supheli"], [a8, "ofkeli"]],
    "bak": [[0, 0.8, -0.05, 0.5], [a5, 0.4, -0.05, 0.25], [a5 + 0.8, 0.6, 0.0, 0.35], [a8 + 1.0, -0.8, 0.0, -0.4], [a8 + 2.0, 0.8, 0, 0.45]],
    "goz": [[0, 0], [e7 + 0.9, 0], [e7 + 1.1, 0.45], [a8, 0.45], [a8 + 0.15, 0]],
    "egil": [[0, 0], [a6, 0], [a6 + 0.3, 4], [e2, 4], [e2 + 0.3, 0], [e5, 0], [e5 + 0.3, 3], [a8, 3], [a8 + 0.3, 0]],
    "konus": [konus("A04", "A04b_01"), konus("A05", "A05a_01"), konus("A06", "A06b_01"), konus("A07", "A07a_01"), konus("A08", "A08a_01")],
}
# ---------------------------------------------------------------- ECE (ece_ev, ince yapı): son yeri (880,1875,1230)
EX, EY, ES = 880, 1875, 1230
S = ES / 1000
KULAK = (EX - 90 * S, EY - 742 * S)  # sol kulak (annenin tarafı)
ECE = {
    "yer": [[0, 800, 1580, 980], [0.15, 800, 1580, 980], [2.0, EX, EY, ES], [ck, EX, EY, ES], [ck + 1.5, 280, 1905, 1290]],
    "yuru": [[0.15, 2.0], [ck, ck + 1.5]],
    "parmakUcu": [[0, 0], [e5, 0], [e5 + 0.2, 40], [e5 + 0.5, 50], [a8, 50], [a8 + 0.2, 0]],
    "duygu": [[0, "yorgun"], [2.1, "korkmus"], [e1, "dehset"], [a5 + 0.5, "saskin"], [e2, "supheli"], [e2 + 2.4, "mutlu"], [e5, "aci"],
              [e6, "dusunceli"], [e7, "mutlu"], [a8 + 0.4, "uzgun"]],
    "goz": [[0, 0.6], [1.0, 0.6], [1.2, 0.85], [1.6, 0.55], [2.05, 0.55], [2.15, 0], [e5, 0], [e5 + 0.2, 0.6], [e6, 0.6], [e6 + 0.2, 0], [e7, 0], [e7 + 0.1, 0.25]],
    "gozSok": [[0, 0], [2.1, 0], [2.18, 0.7], [2.9, 0.7], [3.1, 0], [e1, 0], [e1 + 0.1, 1], [a5, 1], [a5 + 0.2, 0], [e4, 0], [e4 + 0.1, 1], [e5, 1], [e5 + 0.1, 0]],
    "tilt": [[0, 6], [2.0, 6], [2.2, 0], [e5, 0], [e5 + 0.2, -14], [a8, -14], [a8 + 0.25, 0], [ck, 0], [ck + 0.3, 5]],
    "bak": [[0, 0, 0.3, 0], [2.0, -0.4, 0.1, -0.25], [e1, -0.5, 0.0, -0.3], [e2, -0.4, 0.35, -0.2], [e3, 0, 0.5, 0], [e4, 0.0, 0.1, 0],
            [e5, -0.5, -0.1, -0.3], [e6, -0.8, -0.2, -0.15], [e6 + 1.6, 0.7, -0.25, 0.1], [e6 + 3.2, -0.8, -0.2, -0.15], [e7, 0.2, 0.45, 0.05],
            [a8, -0.5, 0, -0.3], [ck, -0.9, 0.1, -0.5]],
    # kollar: girişte kafa kaşır (sağ el), sonra anten (iki el), kapma (sol el), destesini yanağa basar, kulak çekilirken desteyi göğsünde tutar
    "elR": [[0, 905, 1150], [0.3, 905, 1150], [0.6, 920, 760], [0.75, 935, 775], [0.9, 920, 760], [1.05, 935, 775], [1.4, 920, 1180], [2.0, 955, 1370],
            [e1, 955, 1370], [e1 + 0.3, 1000, 815], [e1 + 0.5, 1010, 800], [e1 + 0.7, 1000, 815], [e1 + 0.9, 1010, 800], [e1 + 1.1, 1000, 815],
            [e1 + 1.3, 1010, 800], [e1 + 2.4, 1030, 1000], [e1 + 3.0, 1010, 1060], [a5, 955, 1370]],
    "elRara": [[0, a5 + 0.3]], "bukumR": [[0, -1], [e1, 1]],
    "elL": [[e1, 805, 1370], [e1 + 0.3, 760, 815], [e1 + 0.5, 750, 800], [e1 + 0.7, 760, 815], [e1 + 0.9, 750, 800], [e1 + 1.1, 760, 815],
            [e1 + 1.3, 750, 800], [e1 + 2.4, 840, 1160], [e1 + 3.0, 830, 1180], [a5, 805, 1370],
            [e2 + 2.1, 805, 1370], [e2 + 2.4, 832, 1062], [e2 + 2.7, 815, 1140], [e4, 815, 1140], [e4 + 0.3, 840, 965], [e5, 840, 965],
            [e5 + 0.3, 815, 1100], [a8 + 0.45, 815, 1100], [a8 + 0.55, 805, 1150], [a8 + 0.85, 795, 1395]],
    "elLara": [[e1, a5 + 0.3], [e2 + 2.05, a8 + 0.9]], "bukumL": [[0, 1], [e1, -1], [a5 + 0.3, 1]],
    "tutL": [[0, None], [e1 + 0.25, "parmak"], [e1 + 1.6, None], [e2 + 2.4, "deste"], [a8 + 0.5, None]],
    "tutR": [[0, None], [e1 + 0.25, "parmak"], [e1 + 1.6, None]],
    "sacDagin": True,
    "konus": [konus("E01", "E01a_01"), konus("E02", "E02b_01"), konus("E04", "E04b_01"), konus("E05", "E05a_01"), konus("E07", "E07b_01")],
}
ORT = {"titre": 3, "isik": 1, "makineSepet": True, "anne": ANNE, "ece": ECE}
iki = lambda t0, t1, z0=1.18, z1=1.24: [[t0, 745, 1060, z0], [t1, 745, 1050, z1]]


def b7(t0, cam, **ek):
    p = {"t0": t0, "cam": cam, **ORT}
    p.update(ek)
    return {"kind": "b7_banyo", "text": [json.dumps(p, ensure_ascii=False)]}


def vuruslar():
    V = []
    V.append({"type": "insert", "dur": round(a4 - g, 3), **b7(g, [[0, 560, 1050, 1.12], [a4, 575, 1045, 1.15]]),
              "sfx": [{"name": "efekt/ayak_sesleri", "at": 0.2, "volume": 0.25}, {"name": "efekt/yutkunma", "at": 2.4, "volume": 0.8}]})
    cam = {
        "A04": [[a4, 690, 1080, 1.42], [e1, 700, 1060, 1.48]],
        "E01": [[e1, 740, 960, 1.6], [a5, 762, 955, 1.7]],
        "A05": [[a5, 620, 950, 1.7], [a6, 625, 945, 1.8]],
        "A06": [[a6, 700, 1080, 1.42], [e2, 715, 1040, 1.5]],
        "E02": [[e2, 715, 1010, 1.5], [e3, 740, 1000, 1.6]],
        "E04": [[e4, 788, 940, 1.85], [e5, 810, 930, 2.0]],
        "E05": [[e5, 690, 1040, 1.42], [a7, 705, 1020, 1.5]],
        "A07": [[a7, 650, 950, 1.7], [e6, 655, 945, 1.75]],
        "E06": [[e6, 810, 900, 2.0], [e7, 830, 890, 2.25]],
        "E07": [[e7, 834, 890, 2.2], [e7 + 1.2, 834, 890, 2.2], [e7 + 1.204, 640, 940, 1.85], [a8, 640, 940, 1.9]],  # anne tepkisi (göz kısar)
        "A08": [[a8, 690, 1080, 1.42], [ck, 700, 1080, 1.42]],
    }
    sfx = {
        "A05": [{"name": "efekt/tokat", "at": 1.12, "volume": 0.55}],
        "E02": [{"name": "efekt/whoosh", "at": 2.3, "volume": 0.3}, {"name": "efekt/el_kagit", "at": 2.4, "volume": 0.6}],
        "E04": [{"name": "efekt/el_kaching", "at": 0.15, "volume": 0.35}],
        "E05": [{"name": "efekt/el_sok_vurgu", "at": 0.05, "volume": 0.35}],
        "A08": [{"name": "efekt/el_kagit", "at": 0.45, "volume": 0.6}, {"name": "efekt/whoosh", "at": 0.4, "volume": 0.25}],
    }
    for ad, kim, metin, tk, gap in SIRA[1:-1]:
        if ad == "E03":
            ek = {"kind": "para_say", "text": ["ece"]}
        elif ad == "E05":  # kulak çekme: Ece'nin yakın planı (kullanıcı tercihi)
            ek = {"kind": "kulak_cek", "text": ["sol"]}
        else:
            ek = b7(T[ad], cam[ad])
        b = {"type": "line", "who": kim, "text": metin, "emotion": "notr", "gapAfter": gap, "_take": tk, "ekle": ek}
        if ad == "E06":
            b["voiceover"] = True
        if ad in sfx:
            b["sfx"] = sfx[ad]
        V.append(b)
    V.append({"type": "insert", "dur": round(SON - ck, 3), **b7(ck, [[ck, 700, 1080, 1.42], [SON, 560, 1060, 1.14]], eceOnde=True),
              "sfx": [{"name": "efekt/ayak_sesleri", "at": 0.1, "volume": 0.3}]})
    return V


def json_yaz():
    beats = vuruslar()
    man = {}
    for i, b in enumerate(beats):
        if b["type"] == "line":
            man[f"a_{i + 1:02d}"] = MAN[b.pop("_take")]
    ayna = {"id": "b", "set": "banyo_ayna", "time": "gunduz", "title": "Ayna", "look": "sicak", "transition": "kesme",
            "cast": {"ece_ev": {"mark": "ece", "emotion": "dusunceli", "sacDagin": True, "bak": {"x": 0, "y": 0}}},
            "beats": [{"type": "action", "dur": 3.4, "shot": {"type": "orta", "on": "ece_ev", "move": "yaklas"},
                       "cast": {"ece_ev": {"bakSira": [{"at": 0, "x": 0, "y": 0}, {"at": 1.0, "x": -0.45, "y": -0.25, "yaw": -0.12},
                                                       {"at": 2.0, "x": 0.4, "y": -0.25, "yaw": 0.1}, {"at": 2.8, "x": 0, "y": 0}]}}}]}
    os.makedirs(f"{K}/public/voice/724-07-devam", exist_ok=True)
    json.dump(man, open(f"{K}/public/voice/724-07-devam/manifest.json", "w"), ensure_ascii=False, indent=1)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": "724-07-devam", "episodeNo": 7, "title": "Bölüm 7 · Parça 1", "endCard": False,
          "scenes": [{"id": "a", "set": "banyo_kapi", "time": "gunduz", "title": "Para", "transition": "kesme", "cast": {},
                      "music": {"name": "muzik/banyo_komik", "volume": 0.18, "from": ACILIS}, "ambience": {"name": "ortam/banyo_sabah", "volume": 0.22},
                      "beats": beats}, ayna]}
    json.dump(ep, open(f"{K}/public/episodes/724-07-devam.json", "w"), ensure_ascii=False, indent=1)
    print(f"devam {SON:.1f} sn + ayna 3,4 sn", {k: round(v, 2) for k, v in T.items()})


def kare(adlar):
    os.makedirs(f"{K}/out/b7kare", exist_ok=True)
    for a in adlar:
        tt = float(a)
        p = {"t0": tt, "cam": [[0, 690, 1080, 1.42]], **ORT}
        json.dump({"text": [json.dumps(p)]}, open(f"{K}/out/b7kare/p.json", "w"))
        subprocess.run(["npx", "remotion", "still", "src/index.ts", "B7Kare", f"out/b7kare/d{a}.png", "--frame=0", "--props=out/b7kare/p.json",
                        f"--browser-executable={TAR}", "--log=error", "--scale=0.35"], cwd=K)


if __name__ == "__main__":
    if sys.argv[1] == "json":
        json_yaz()
    else:
        kare(sys.argv[2:])
