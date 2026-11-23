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

# ---------------------------------------------------------------- ANNE (610,1880,1290): omuzlar L (517,1070) R (703,1070)
# ECE (ince yapı) annesiyle AYNI BOYDA (1300), arada mesafe: (940,1880). Ölçüler rig'den: S = 1,3
EX, EY, ES = 940, 1880, 1300
S = ES / 1000
E_OL, E_OR = (EX - 72 * 0.9 * S, EY - 628 * S), (EX + 72 * 0.9 * S, EY - 628 * S)   # (856,1064) (1024,1064)
KULAK = (EX - 90 * S, EY - 742 * S)          # sol kulak, annenin tarafı (823,915)
YANAK = (EX - 50 * S, EY - 750 * S)          # sol yanak (875,905)
BOS_R = (706, 1392)                          # annenin boştaki para eli: kalçasında (kol neredeyse düz)
ANNE = {
    "yer": [[0, 610, 1880, 1290]],
    "kolL": [[0, 38, -105]],
    "elR": [[0, 772, 1055], [1.4, *BOS_R], [a4, *BOS_R],
            # A04: desteyi Ece'ye doğru sallar
            [a4 + 0.35, 800, 1050], [a4 + 0.65, 770, 1100], [a4 + 0.95, 800, 1050], [a4 + 1.25, 770, 1100], [a4 + 2.9, 785, 1080], [a4 + 3.4, *BOS_R],
            # A06: desteyi Ece'nin yüzünün önünde sağa sola sallar (Ece'nin gözleri takip eder)
            [a6, *BOS_R], [a6 + 0.5, 850, 1065], [a6 + 0.85, 815, 1085], [a6 + 1.2, 850, 1065], [a6 + 1.55, 815, 1085], [a6 + 1.9, 850, 1065],
            [a6 + 2.25, 815, 1085], [e2, 830, 1070], [e2 + 2.3, 830, 1070], [e2 + 2.6, 800, 1080], [e3, *BOS_R],      # Ece kapar → el boşta
            [e5 - 0.05, 790, 1000], [e5, KULAK[0], KULAK[1]], [e7 + 2.9, KULAK[0], KULAK[1] - 40],                    # kulak (yakın plan sonrası)
            [a8, KULAK[0], KULAK[1] - 40], [a8 + 0.2, 840, 1100], [a8 + 0.45, 920, 1170], [a8 + 0.8, *BOS_R]],         # bırakır, desteyi geri kapar
    "elRara": [[-99, 99]], "dogalKol": True,
    "elL": [[0, 520, 1290], [a5 + 0.9, 520, 1290], [a5 + 1.15, 470, 980], [a5 + 1.3, 610, 1180], [a5 + 1.45, 520, 1290],  # terlik vuruşu
            [a8 + 1.0, 520, 1290], [a8 + 1.4, 330, 1000], [a8 + 3.5, 330, 1000]],                                  # lavaboyu gösterir
    "elLara": [[a5 + 0.85, a5 + 1.55], [a8 + 0.95, 99]],
    "tutR": [[0, "deste"], [e2 + 2.4, None], [a8 + 0.5, "deste"]],
    "duygu": [[0, "ofkeli"], [e2 + 2.4, "saskin"], [e2 + 2.9, "ofkeli"]],
    # Ece böceği anlatırken anne göz devirir; para kapılınca şaşkın; "Oha"da gözlerini kısar
    "bak": [[0, 0.8, -0.05, 0.5], [e2 + 2.4, 0.5, 0.35, 0.3], [e2 + 2.9, 0.8, 0.0, 0.5],
            [a8 + 1.0, -0.8, 0.0, -0.4], [a8 + 2.0, 0.8, 0, 0.45]],
    "goz": [[0, 0], [e7 + 0.9, 0], [e7 + 1.1, 0.4], [a8, 0.4], [a8 + 0.15, 0]],
    "tilt": [[0, 0], [a5 + 0.3, 0], [a5 + 0.5, 5], [a5 + 2.5, 5], [a5 + 2.8, 0]],
    "egil": [[0, 0], [a6, 0], [a6 + 0.3, 4], [e2, 4], [e2 + 0.3, 0], [e2 + 2.4, -4], [e2 + 2.8, 0], [a8, 0], [a8 + 0.25, 3], [a8 + 0.5, 0]],
    "konus": [konus("A04", "A04b_01"), konus("A05", "A05a_01"), konus("A06", "A06b_01"), konus("A07", "A07a_01"), konus("A08", "A08a_01")],
}
ECE = {
    "yer": [[0, 800, 1585, 1040], [0.15, 800, 1585, 1040], [2.0, EX, EY, ES], [ck, EX, EY, ES], [ck + 1.5, 250, 1905, 1340]],
    "yuru": [[0.15, 2.0], [ck, ck + 1.5]], "parmakUcu": [[0, 0], [e5, 0], [e5 + 0.2, 40], [a8, 40], [a8 + 0.2, 0]],
    "duygu": [[0, "yorgun"], [2.1, "korkmus"], [a4 + 0.2, "korkmus"], [e1, "dehset"], [a5 + 0.3, "saskin"], [a6, "korkmus"], [e2, "supheli"],
              [e2 + 2.4, "mutlu"], [e5, "aci"], [e6, "dusunceli"], [e7, "mutlu"], [a8 + 0.4, "uzgun"]],
    "goz": [[0, 0.6], [1.0, 0.6], [1.2, 0.85], [1.6, 0.55], [2.05, 0.55], [2.15, 0],
            [a4, 0], [a4 + 0.1, 0.8], [a4 + 0.25, 0], [a4 + 1.4, 0], [a4 + 1.5, 0.8], [a4 + 1.65, 0],      # anne bağırdıkça irkilip göz kırpar
            [e6, 0], [e7, 0], [e7 + 0.1, 0.25]],
    "gozSok": [[0, 0], [2.1, 0], [2.18, 0.7], [2.9, 0.7], [3.1, 0], [e1, 0], [e1 + 0.1, 1], [a5, 1], [a5 + 0.2, 0], [e4, 0], [e4 + 0.1, 1], [e5, 1], [e5 + 0.1, 0]],
    "tilt": [[0, 6], [2.0, 6], [2.2, 0], [a4, 0], [a4 + 0.15, 7], [a4 + 0.6, 4], [a4 + 3.2, 0], [a5 + 0.3, 0], [a5 + 0.5, -5], [a6, 0],
             [e6, -12], [a8, -12], [a8 + 0.25, 0], [ck, 0], [ck + 0.3, 5]],
    # A06: gözler sallanan destenin peşinde (sağ-sol), yüz hafif takip
    "bak": [[0, 0, 0.3, 0], [2.0, -0.5, 0.1, -0.3], [e1, -0.5, 0.0, -0.3], [a5, -0.5, 0.0, -0.3],
            [a6, -0.6, 0.0, -0.35], [a6 + 2.4, -0.6, 0.0, -0.35], [a6 + 2.6, -0.4, 0.4, -0.25], [e2, -0.4, 0.4, -0.25], [e3, 0, 0.5, 0], [e4, 0.0, 0.1, 0],
            [e6, -0.8, -0.2, -0.15], [e6 + 1.6, 0.7, -0.25, 0.1], [e6 + 3.2, -0.8, -0.2, -0.15], [e7, 0.2, 0.45, 0.05],
            [a8, -0.5, 0, -0.3], [a8 + 0.5, -0.6, 0.35, -0.3], [ck, -0.9, 0.1, -0.5]],
    # kollar (IK): girişte kafa kaşır; anten; savrulma; kapma; yanağa basma; desteyi göğüste tutma
    "elR": [[0, 905, 1150], [0.3, 905, 1150], [0.6, 1000, 720], [0.75, 1012, 735], [0.9, 1000, 720], [1.05, 1012, 735], [1.4, 1030, 1150],
            [2.0, E_OR[0] + 25, E_OR[1] + 320], [e1, E_OR[0] + 25, E_OR[1] + 320],
            [e1 + 0.3, 1062, 800], [e1 + 0.5, 1072, 785], [e1 + 0.7, 1062, 800], [e1 + 0.9, 1072, 785], [e1 + 1.1, 1062, 800], [e1 + 1.3, 1072, 785],
            [e1 + 2.4, 1070, 1020], [e1 + 3.0, 1060, 1080], [a5, E_OR[0] + 25, E_OR[1] + 320],
            [e2 + 2.5, E_OR[0] + 25, E_OR[1] + 320], [e2 + 2.8, 968, 1178], [e4, 968, 1178], [e4 + 0.3, 968, 1108], [e5, 968, 1108],
            [e5 + 0.3, 968, 1178], [a8 + 0.4, 968, 1178], [a8 + 0.7, E_OR[0] + 25, E_OR[1] + 320]],
    "elRara": [[0, a5 + 0.3], [e2 + 2.45, a8 + 0.75]], "dogalKol": True,
    "elL": [[e1, E_OL[0] - 20, E_OL[1] + 320], [e1 + 0.3, 812, 800], [e1 + 0.5, 802, 785], [e1 + 0.7, 812, 800], [e1 + 0.9, 802, 785],
            [e1 + 1.1, 812, 800], [e1 + 1.3, 802, 785], [e1 + 2.0, 800, 1060], [e1 + 2.4, 900, 1160], [e1 + 3.0, 890, 1180], [a5, E_OL[0] - 20, E_OL[1] + 320],
            [e2 + 2.1, E_OL[0] - 20, E_OL[1] + 320], [e2 + 2.4, 838, 1078], [e2 + 2.75, 915, 1175], [e4, 915, 1175], [e4 + 0.3, 915, 1105],
            [e5, 915, 1105], [e5 + 0.3, 915, 1175], [a8 + 0.45, 915, 1175], [a8 + 0.55, 900, 1210], [a8 + 0.85, E_OL[0] - 20, E_OL[1] + 320]],
    "elLara": [[e1, a5 + 0.3], [e2 + 2.05, a8 + 0.9]],
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
    V.append({"type": "insert", "dur": round(a4 - g, 3), **b7(g, [[0, 540, 960, 1.0], [a4, 560, 1000, 1.06]]),
              "sfx": [{"name": "efekt/ayak_sesleri", "at": 0.2, "volume": 0.25}, {"name": "efekt/yutkunma", "at": 2.4, "volume": 0.8}]})
    cam = {
        "A04": [[a4, 712, 1080, 1.42], [e1, 718, 1060, 1.46]],
        "E01": [[e1, 742, 940, 1.6], [a5, 762, 935, 1.7]],
        "A05": [[a5, 620, 950, 1.7], [a6, 625, 945, 1.8]],
        "A06": [[a6, 712, 1080, 1.42], [e2, 722, 1040, 1.48]],
        "E02": [[e2, 722, 1010, 1.48], [e3, 742, 990, 1.6]],
        "E04": [[e4, 788, 920, 1.85], [e5, 810, 910, 2.0]],
        "E05": [[e5, 690, 1040, 1.42], [a7, 705, 1020, 1.5]],
        "A07": [[a7, 650, 950, 1.7], [e6, 655, 945, 1.75]],
        "E06": [[e6, 810, 900, 2.0], [e7, 830, 880, 2.25]],
        "E07": [[e7, 834, 880, 2.2], [e7 + 1.2, 834, 880, 2.2], [e7 + 1.204, 640, 940, 1.85], [a8, 640, 940, 1.9]],  # anne tepkisi (göz kısar)
        "A08": [[a8, 712, 1080, 1.42], [ck, 712, 1080, 1.42]],
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
    V.append({"type": "insert", "dur": round(SON - ck, 3), **b7(ck, [[ck, 712, 1080, 1.42], [SON, 540, 960, 1.0]], eceOnde=True),
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
        p = {"t0": tt, "cam": [[0, 712, 1080, 1.42]], **ORT}
        json.dump({"text": [json.dumps(p)]}, open(f"{K}/out/b7kare/p.json", "w"))
        subprocess.run(["npx", "remotion", "still", "src/index.ts", "B7Kare", f"out/b7kare/d{a}.png", "--frame=0", "--props=out/b7kare/p.json",
                        f"--browser-executable={TAR}", "--log=error", "--scale=0.35"], cwd=K)


if __name__ == "__main__":
    if sys.argv[1] == "json":
        json_yaz()
    else:
        kare(sys.argv[2:])
