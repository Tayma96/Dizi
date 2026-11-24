"""7/24 B7 Parça 1 v3 (banyo, kasım 18:00, gece). Senarist planı: docs/diziler/724/raporlar/b7-senarist.md
Kullanım: python3 tools/b7v3p1.py json
 - Açılış (0-14,55 sn): beğenilen v2 açılışı (tools/b7p1v2.py) aynen; YALNIZ ışık gece (pencere karanlık, tavan lambası) ve
   "Eceeee"de annenin beldeki U kolu doğal sarkan kola çevrildi, deste eli önden dikey (onKol).
 - Devam: gölge → pervazda parmaklar → yarım yüz → güvenli mesafe; replik başına eylem + dinleyen tepkisi;
   böcek ezme, sessiz vuruş, "anne vallahi büyük hayranınım.", kedi-lazer deste, boş el, tükürüklü sayma, iki "lan" = iki kulak,
   iç seste hayal eki (sepya, anne kapıya zincir takar), deste annenin hırka cebine.
Kullanıcının replikleri AYNEN (docs/diziler/724/bolumler.md "Bölüm 7, Parça 1").
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import b7p1v2 as V2  # noqa: E402
from b7v3_ortak import Kamera, b7, man_yukle, yaz, sirala  # noqa: E402

M = man_yukle("724-07/cekim", "724-07-yeni")
sure = lambda tk: M[tk]["duration"]
AC = 14.549  # açılış süresi (v2)

# ------------------------------------------------------------------ açılış: v2 aynen, gece ışığı + kol düzeltmesi
V2.ANNE_SON["kolL"] = [[0, 9, 4]]                       # beldeki U kol yerine doğal sarkan kol
V2.ANNE_SON["onKol"] = True                             # deste eli önden, dikey önkol
V2.ANNE_SON["dogalKol"] = True
V2.ANNE_SON.pop("bukumR", None)
V2.ANNE_SON["elR"] = [[0, 735, 1180], [V2.T["A03"], 735, 1170], [V2.T["A03"] + 0.1, 760, 1060], [V2.T["A03"] + 0.25, 745, 1100],
                      [V2.T["A03"] + 0.4, 765, 1050], [V2.T["A03"] + 0.55, 748, 1095]]
_b7_eski = V2.b7


def _b7_gece(t0, dur, cam, anne, **ek):
    r = _b7_eski(t0, dur, cam, anne, **ek)
    p = json.loads(r["text"][0])
    p.update({"gece": True, "isik": 0})
    r["text"] = [json.dumps(p, ensure_ascii=False)]
    return r


V2.b7 = _b7_gece

# ------------------------------------------------------------------ devam zaman çizelgesi (mutlak sahne zamanı)
Y1 = "Y1b_01" if "Y1b_01" in M else None
Y2 = next((k for k in ("Y2a_01", "Y2b_01") if k in M), None)
SIRA = [  # (ad, kim, metin, çekim, boşluk)
    ("G1", None, None, None, 1.1),
    ("G2", None, None, None, 1.15),
    ("G3", None, None, None, 1.55),
    ("A04", "anne724", "nerden geldi bu paralar nasıl bi marketmiş lan o", "A04b_01", 0.2),
    ("E01", "ece_ev", "anneee dev gibi böcek vardı markette ölüyodummm", "E01a_01", 0.15),
    ("A05", "anne724", "Böcek evde de var terliği vur geç", "A05a_01", 0.3),
    ("SES", None, None, None, 0.75),
    ("Y1", "ece_ev", "anne vallahi büyük hayranınım.", Y1, 0.2),
    ("A06", "anne724", "para diyorum Ece para bu para ne alakaaaa?", "A06b_01", 0.15),
    ("E02", "ece_ev", "çok mu ya o kadar ver bi bakıyım", "E02b_01", 0.1),
    ("BOS", None, None, None, 0.65),
    ("TUK", None, None, None, 0.6),
    ("E03", "ece_ev", "yüz, iki yüz, yüz, iki yüz", "E03a_01", 0.15),
    ("E04", "ece_ev", "Oha lan ne çok para", "E04b_01", 0.2),
    ("E05", "ece_ev", "aauuv ah ah acıyo", "E05a_01", 0.1),
    ("A07", "anne724", "nerden geldi bu para?", "A07a_01", 0.2),
    ("E06", "ece_ev", "şimdi olanları anlatırsam hem bana inanmaz hem de tekrar gitmeme izin vermez", "E06a_01", 0.2),
    ("E07", "ece_ev", "ama çok para lan", "E07b_01", 0.05),
    ("Y2", "ece_ev", "Iıh!", Y2, 0.1),
    ("A08", "anne724", "git elini yüzünü yıka bu paranın hesabını vereceksin bana!", "A08a_01", 0.2),
    ("CIK", None, None, None, 2.3),
]
SIRA = [s for s in SIRA if not (s[1] and s[3] is None)]
T, t = {}, AC
for ad, kim, metin, tk, gap in SIRA:
    T[ad] = t
    t += (sure(tk) + gap) if tk else gap
SON = t
g1, g2, g3, a4, e1, a5, ses, a6, e2, bos, tuk, e3, e4, e5, a7, e6, e7, a8, ck = (T[x] for x in
    ("G1", "G2", "G3", "A04", "E01", "A05", "SES", "A06", "E02", "BOS", "TUK", "E03", "E04", "E05", "A07", "E06", "E07", "A08", "CIK"))
y1 = T.get("Y1", ses + 0.75)
y2 = T.get("Y2")
sonE07 = y2 if y2 else a8
W = lambda ad, w: T[ad] + 0.08 + w  # repliğin içindeki kelime anı (manifest kelime zamanı)
konus = lambda ad, tk: {"t": T[ad] + 0.08, "cues": M[tk]["mouth"]}

# ------------------------------------------------------------------ yerleşim (180°: anne solda sağa bakar, Ece sağda sola bakar)
AX0, AX1, AX2 = 610, 640, 730   # anne: başlangıç, böceği ezdikten sonra, A06'da yaklaştıktan sonra
AY, AS = 1880, 1290
EX0, EX1, EY, ES = 1000, 1030, 1880, 1300   # Ece: güvenli mesafe, Y1'de bir adım geri
S = ES / 1000
YUZ_Y = EY - 765 * S             # Ece yüz merkezi y (≈886)
KULAK = lambda ex, pu=0: (ex - 90 * S, EY - 742 * S - pu)
AOMR = lambda ax: (ax + 72 * AS / 1000, AY - 628 * AS / 1000)   # annenin sağ omzu
CEP = lambda ax: (ax + 58 * AS / 1000, AY - 340 * AS / 1000)      # annenin hırka sağ cebi (rig 258,640)
PU = 42   # parmak ucu (kulak çekilince)

# ---------------------------------------------------------------- ANNE
anne_elR = [
    [g1, 718, 1330], [g1 + 0.45, 765, 1030], [g2, 762, 1035], [g3 + 0.9, 762, 1040], [g3 + 1.05, 790, 1015], [g3 + 1.2, 770, 1050], [g3 + 1.35, 790, 1015], [g3 + 1.5, 768, 1045],
    # A04: her vurguda desteyi Ece'ye doğru sallar
    [W("A04", 0.1), 800, 1010], [W("A04", 0.3), 770, 1060], [W("A04", 0.9), 820, 1000], [W("A04", 1.15), 775, 1055], [W("A04", 1.7), 825, 995],
    [W("A04", 1.95), 778, 1050], [W("A04", 2.3), 830, 990], [W("A04", 2.55), 780, 1045], [W("A04", 2.75), 835, 985], [W("A04", 3.05), 790, 1040],
    # E01: dinler; "dev gibi böcek"te donar, deste eli 2 cm düşer
    [e1 + 0.5, 760, 1080], [W("E01", 0.95), 760, 1080], [W("E01", 1.05), 758, 1108], [W("E01", 1.5), 758, 1110], [W("E01", 2.0), 760, 1090],
    # A05: el aşağıda sabit (öfkeli, kımıldamadan)
    [a5 + 0.3, 745, 1150], [y1, 775, 1150],
    # A06: yaklaşır, desteyi Ece'nin burnunun önünde sağa sola sallar
    [a6 + 0.6, 850, 975], [W("A06", 0.4), 892, 955], [W("A06", 0.85), 848, 972], [W("A06", 1.25), 895, 952], [W("A06", 1.7), 850, 970],
    [W("A06", 2.05), 896, 952], [W("A06", 2.25), 852, 970], [W("A06", 2.55), 894, 955], [W("A06", 2.72), 880, 960], [e2 + 1.5, 880, 962],
    [W("E02", 1.76), 882, 965], [W("E02", 1.95), 885, 975], [bos, 885, 975],                  # Ece kapar → el havada boş kalır
    [bos + 0.5, 925, 955], [tuk, 840, 1120], [e3, 820, 1200], [e4 + 1.0, 820, 1200],
    # E04 sonu: el soldan, omuz hizasından kalkar, kulağa
    [W("E04", 1.55), 870, 1030], [e5, *KULAK(EX1 - 8, 0)], [a7, *KULAK(EX1 - 8, PU)], [W("E07", 2.0), *KULAK(EX1 - 8, PU)],
    [W("E07", 2.15), *KULAK(EX1 - 8, PU + 30)], [a8, *KULAK(EX1 - 8, PU + 30)],
    # A08: bırakır; "paranın"da desteyi geri kapar; sonunda cebe
    [W("A08", 0.25), 880, 1120], [W("A08", 1.45), 930, 1140], [W("A08", 1.62), 985, 1150], [W("A08", 1.75), 985, 1150], [W("A08", 2.05), 840, 1080],
    [W("A08", 2.9), 840, 1080], [W("A08", 3.25), *CEP(AX2)], [SON, *CEP(AX2)],
]
ANNE = {
    "yer": [[g1, AX0, AY, AS], [W("A05", 1.72), AX0, AY, AS], [W("A05", 1.84), AX1, AY, AS], [a6 + 0.05, AX1, AY, AS], [a6 + 0.6, AX2, AY, AS]],
    "yuru": [[a6 + 0.05, a6 + 0.6]],
    "kolL": [[0, 9, 4]], "onKol": True, "dogalKol": True,
    "elR": sirala(anne_elR), "elRara": [[-99, 99]],
    "elL": [[a8, 520, 1300], [W("A08", 2.0), 520, 1300], [W("A08", 2.2), 420, 1040], [W("A08", 2.9), 420, 1040], [W("A08", 3.2), 545, 1320]],
    "elLara": [[W("A08", 1.95), W("A08", 3.25)]],
    "tutR": [[0, "deste"], [W("E02", 1.85), None], [W("A08", 1.72), "deste"], [W("A08", 3.3), None]],
    "cepDeste": [[0, 0], [W("A08", 3.3), 1]],
    "duygu": [[0, "supheli"], [g3 + 0.9, "ofkeli"], [W("E01", 0.95), "saskin"], [W("E01", 1.45), "ofkeli"], [y1, "alayci"], [y1 + 1.6, "ofkeli"],
              [W("E02", 1.85), "saskin"], [bos + 0.35, "ofkeli"], [tuk + 0.15, "igrenmis"], [e3 + 1.9, "saskin"], [e3 + 2.75, "ofkeli"]],
    "gozSok": [[0, 0], [W("E01", 0.95), 0], [W("E01", 1.0), 0.55], [W("E01", 1.4), 0.55], [W("E01", 1.5), 0], [e3 + 1.9, 0], [e3 + 2.0, 0.45], [e3 + 2.6, 0.45], [e3 + 2.75, 0]],
    "goz": [[0, 0], [g2, 0], [g2 + 0.2, 0.35], [g3 + 0.4, 0.35], [g3 + 0.6, 0], [W("E01", 2.55), 0], [W("E01", 2.65), 0.75], [W("E01", 2.85), 0],   # göz devirme kırpışı
            [y1, 0], [y1 + 0.2, 0.4], [a6, 0.4], [a6 + 0.2, 0], [W("E04", 0.6), 0], [W("E04", 0.65), 0.6], [W("E04", 0.72), 0.1], [W("E04", 0.8), 0.6], [W("E04", 0.9), 0],
            [e6 + 0.5, 0], [e6 + 2.0, 0.4], [e7, 0.4], [e7 + 0.2, 0]],
    "bak": [[g1, 0.9, -0.25, 0.65], [g3 + 0.6, 1.0, -0.05, 0.7],
            [W("E01", 2.55), 1.0, -0.05, 0.7], [W("E01", 2.65), 0.3, -0.9, 0.5], [W("E01", 2.95), 0.3, -0.9, 0.5], [W("E01", 3.15), 1.0, -0.05, 0.7],   # göz devirir
            [W("E02", 1.85), 1.0, -0.05, 0.7], [W("E02", 2.05), 0.55, 0.45, 0.45], [bos + 0.3, 0.55, 0.45, 0.45], [bos + 0.45, 1.0, -0.05, 0.7],   # boş eline bakar
            [e3 + 1.85, 1.0, -0.05, 0.7], [e3 + 2.0, 0.8, 0.5, 0.6], [e3 + 2.7, 0.8, 0.5, 0.6], [e3 + 2.85, 1.0, -0.05, 0.7],              # omzunun üstünden desteye
            [W("A08", 2.1), 1.0, -0.05, 0.7], [ck + 0.3, 1.0, -0.05, 0.7], [ck + 0.9, -0.3, 0.1, -0.2], [SON, -0.5, 0.1, -0.3]],
    "tilt": [[0, 0], [g1, 4], [g3, 0], [a5, 0], [a5 + 0.2, -4], [ses, -4], [ses + 0.3, 0], [a6 + 2.7, 0], [a6 + 2.9, 6], [e2, 0]],
    "egil": [[0, 0], [a4 + 0.2, 0], [a4 + 0.5, 3], [e1, 0], [W("A06", 2.6), 0], [W("A06", 2.85), 5], [e2 + 0.4, 0], [e3 + 1.85, 0], [e3 + 2.05, 6], [e3 + 2.7, 6], [e3 + 2.9, 0],
             [a7, 0], [a7 + 0.25, 2], [e6 + 1.0, 2], [e6 + 4.5, 3], [a8, 3], [a8 + 0.3, 0]],
    "konus": [konus("A04", "A04b_01"), konus("A05", "A05a_01"), konus("A06", "A06b_01"), konus("A07", "A07a_01"), konus("A08", "A08a_01")],
}

# ---------------------------------------------------------------- ECE
EOL = lambda ex: (ex - 72 * 0.9 * S, EY - 628 * S)     # sol omuz
EOR = lambda ex: (ex + 72 * 0.9 * S, EY - 628 * S)     # sağ omuz
GOGUS_L = lambda ex: (ex - 38, 1185)                  # eller göğüste (önden)
GOGUS_R = lambda ex: (ex + 38, 1185)
ECE_KAPI = [620, 430, 960, 1560]
ece_yer = [[g1, 1180, 1480, 960], [g2 + 0.2, 1180, 1480, 960], [g2 + 0.25, 948, 1480, 960], [g2 + 0.95, 942, 1480, 960],   # pervazın arkasında (yarım yüz)
           [g3, 942, 1480, 960], [g3 + 0.35, 872, 1500, 975], [g3 + 0.6, 850, 1600, 1060], [g3 + 1.25, EX0, EY, ES],
           [y1 + 0.3, EX0, EY, ES], [y1 + 0.7, EX1, EY, ES], [e4 + 1.8, EX1, EY, ES], [e5, EX1 - 30, EY, ES],
           [ck, EX1 - 30, EY, ES], [ck + 0.15, EX1 - 50, EY + 15, ES + 10], [SON, 330, EY + 30, ES + 30]]
ece_elL = [  # (kadrajın solundaki el = annenin tarafı)
    [g2, 940, 1150], [g2 + 0.2, 958, 985], [g3 - 0.05, 958, 985], [g3 + 0.3, 930, 1250], [e1 - 0.3, 930, 1250],
    [e1, *GOGUS_L(EX0)], [W("E01", 1.35), 888, 790], [W("E01", 1.55), 880, 778], [W("E01", 1.75), 888, 792], [W("E01", 1.95), 880, 778], [W("E01", 2.3), 886, 790],
    [W("E01", 2.6), *GOGUS_L(EX0)], [a5 + 0.5, *GOGUS_L(EX0)], [a5 + 0.8, 975, 1110], [y1, 980, 1110], [y1 + 0.6, *GOGUS_L(EX1)],
    [W("E02", 1.6), *GOGUS_L(EX1)], [W("E02", 1.8), 905, 985], [W("E02", 2.05), 990, 1120], [e4, 990, 1120],
    [W("E04", 0.1), *GOGUS_L(EX1)], [e5, 990, 1120 - PU],
    [e7, 985, 1120 - PU], [W("E07", 1.0), 975, 1080 - PU], [a8, 975, 1080 - PU - 30],
    [W("A08", 0.3), 985, 1130], [W("A08", 0.6), 955, 930], [W("A08", 0.8), 948, 920], [W("A08", 1.0), 955, 930], [W("A08", 1.2), 948, 920], [W("A08", 1.5), 955, 930], [W("A08", 2.2), 960, 1120],
]
ece_elR = [
    [e1, *GOGUS_R(EX0)], [W("E01", 1.35), 1112, 790], [W("E01", 1.55), 1120, 778], [W("E01", 1.75), 1112, 792], [W("E01", 1.95), 1120, 778], [W("E01", 2.3), 1114, 790],
    [W("E01", 2.6), *GOGUS_R(EX0)], [a5 + 0.5, *GOGUS_R(EX0)], [a5 + 0.8, 1025, 1110], [y1, 1020, 1110], [y1 + 0.6, *GOGUS_R(EX1)],
    [W("E02", 1.6), *GOGUS_R(EX1)], [W("E02", 1.8), 930, 995], [W("E02", 2.05), 1040, 1130], [tuk, 1040, 1130],
    [tuk + 0.2, 1040, 900], [tuk + 0.4, 1040, 900], [e3, 1060, 1130], [e4, 1060, 1130],
    [W("E04", 0.1), 1150, 935], [W("E04", 1.1), 1150, 940], [W("E04", 1.3), 1075, 985], [e4 + 2.3, 1075, 985], [e5, 1040, 1125 - PU],
    [e7, 1035, 1125 - PU], [W("E07", 1.0), 1025, 1085 - PU], [a8, 1025, 1085 - PU - 30], [W("A08", 0.3), 1020, 1135], [W("A08", 1.75), 1015, 1145],
    [W("A08", 1.85), 1015, 1145], [W("A08", 2.7), 1015, 1145], [W("A08", 3.0), 1030, 1150],
]
ECE = {
    "yer": ece_yer, "yuru": [[g3, g3 + 1.25], [y1 + 0.3, y1 + 0.7], [ck + 0.1, SON]],
    "dogalKol": True, "onKol": True,
    "elL": sirala(ece_elL), "elR": sirala(ece_elR),
    "elLara": [[g2, g3 + 0.35], [e1, W("A08", 2.4)]], "elRara": [[e1, W("A08", 3.2)]],
    "tutL": [[0, None], [W("E01", 1.3), "parmak"], [W("E01", 2.45), None], [W("E02", 1.85), "deste"], [e4, None], [e5, "deste"], [W("A08", 0.35), None]],
    "tutR": [[0, None], [W("E01", 1.3), "parmak"], [W("E01", 2.45), None], [e4, "deste"], [e5, None], [W("A08", 0.35), "deste"], [W("A08", 1.72), None]],
    "parmakUcu": [[0, 0], [W("E01", 0.85), 0], [W("E01", 1.1), 26], [W("E01", 2.55), 26], [W("E01", 2.8), 0], [a5 + 0.75, 0], [a5 + 0.95, 22], [ses + 0.3, 22], [ses + 0.6, 0],
                  [e5, 0], [e5 + 0.2, PU], [W("E07", 2.1), PU], [W("E07", 2.25), PU + 30], [a8, PU + 30], [W("A08", 0.1), PU + 30], [W("A08", 0.3), 0]],
    "duygu": [[0, "yorgun"], [g2 + 0.3, "korkmus"], [g3 + 0.9, "utangac"], [a4, "korkmus"], [W("A04", 2.7), "sok"], [e1, "korkmus"], [W("E01", 0.9), "korkmus"],
              [W("E01", 2.6), "uzgun"], [a5 + 0.7, "korkmus"], [ses + 0.15, "saskin"], [y1, "utangac"], [a6, "korkmus"], [W("A06", 1.3), "saskin"], [W("A06", 2.4), "mutlu"],
              [e2, "supheli"], [W("E02", 1.85), "mutlu"], [tuk, "kararli"], [e4, "gulen"], [W("E04", 1.2), "mutlu"],
              [a7, "korkmus"], [e6, "dusunceli"], [e6 + 3.0, "korkmus"], [e7, "mutlu"], [W("E07", 2.15), "aci"], [a8 + 0.4, "saskin"], [W("A08", 2.4), "uzgun"]],
    "goz": [[0, 0.55], [g2 + 0.3, 0.55], [g2 + 0.5, 0.2], [g3, 0], [a4, 0],
            [W("A04", 0.12), 0.8], [W("A04", 0.25), 0], [W("A04", 0.95), 0.8], [W("A04", 1.08), 0], [W("A04", 1.75), 0.8], [W("A04", 1.88), 0],   # her bağırışta göz kırpar
            [W("E04", 1.15), 0], [W("E04", 1.3), 1], [e4 + 2.3, 1], [e5, 0], [e6, 0], [W("E07", 2.1), 0], [W("E07", 2.2), 0.8], [a8, 0.8], [a8 + 0.15, 0]],
    "gozSok": [[0, 0], [W("A04", 2.7), 0], [W("A04", 2.8), 1], [e1, 1], [e1 + 0.5, 0], [W("E01", 0.95), 0], [W("E01", 1.05), 0.8], [W("E01", 2.5), 0.8], [W("E01", 2.65), 0],
               [a5 + 0.7, 0], [a5 + 0.8, 1], [ses + 0.5, 1], [ses + 0.75, 0.4], [y1 + 0.3, 0], [W("A06", 1.2), 0], [W("A06", 1.4), 0.5], [W("A06", 2.4), 0.5], [W("A06", 2.6), 0.9], [e2, 0]],
    "tilt": [[0, 8], [g2 + 0.2, -10], [g2 + 0.9, -10], [g3 + 0.3, 3], [a4, 0],
             [W("A04", 0.12), 6], [W("A04", 0.4), 2], [W("A04", 0.95), 7], [W("A04", 1.25), 2], [W("A04", 1.75), 8], [W("A04", 2.1), 2],
             [e1, 0], [e1 + 1.0, -4], [e1 + 2.6, 4], [a5, 0], [y1, 0], [y1 + 0.4, 6], [a6, 0], [e2, -6], [e2 + 1.6, 0],
             [e5, 0], [a7, -10], [e6, -12], [e7, -12], [W("E07", 2.1), -16], [a8, -16], [a8 + 0.3, 0], [ck, 0], [ck + 0.3, 6]],
    "egil": [[0, 0], [y1 + 0.3, 0], [y1 + 0.6, 3], [a6, 0], [e2, 0], [e2 + 0.5, -6], [W("E02", 1.75), -7], [W("E02", 2.0), 0]],
    "bak": [[0, -0.2, 0.3, -0.1], [g2 + 0.2, -0.75, 0.05, -0.45], [g3 + 0.5, -0.6, 0.35, -0.35], [g3 + 0.85, -0.6, 0.35, -0.35],      # desteye
            [g3 + 1.05, -0.9, -0.4, -0.5], [g3 + 1.3, -0.9, -0.4, -0.5], [g3 + 1.45, -0.7, 0.0, -0.4],                                       # sepetteki kota → anneye
            [W("A04", 2.7), -0.7, 0.0, -0.4], [e1, -0.7, 0.0, -0.4],
            [a5 + 0.55, -0.7, 0.0, -0.4], [a5 + 0.7, -0.5, 0.8, -0.3], [ses, -0.5, 0.8, -0.3], [ses + 0.55, -0.7, 0.0, -0.4],                 # böceğe, sonra yavaşça anneye
            [a6 + 0.6, -0.7, 0.0, -0.4], [W("A06", 0.4), -0.6, 0.3, -0.35], [W("A06", 0.85), -0.95, 0.35, -0.55], [W("A06", 1.25), -0.6, 0.3, -0.35],  # deste peşinde (kedi)
            [W("A06", 1.7), -0.95, 0.35, -0.55], [W("A06", 2.05), -0.6, 0.3, -0.35], [W("A06", 2.25), -0.95, 0.35, -0.55], [W("A06", 2.55), -0.6, 0.3, -0.35],
            [e2, -0.75, 0.35, -0.45], [W("E02", 2.05), -0.1, 0.7, 0], [e3, -0.1, 0.7, 0], [e4, -0.1, 0.4, 0],
            [a7, -0.6, 0.0, -0.35], [a7 + 0.35, 0.75, 0.25, 0.15], [e6, 0.75, 0.25, 0.15],                                                  # gözler kaçar
            [W("E06", 0.6), -0.85, -0.2, -0.2], [W("E06", 1.5), 0.85, -0.2, 0.1], [W("E06", 2.3), -0.6, 0.35, -0.1], [W("E06", 3.0), 0.85, 0.1, 0.1],
            [W("E06", 4.3), -0.85, -0.2, -0.2], [e7, -0.1, 0.6, 0], [W("E07", 1.4), -0.1, 0.6, 0], [W("E07", 1.6), -0.6, 0.0, -0.35],
            [a8, -0.6, 0.0, -0.35], [W("A08", 2.1), 0.0, 0.7, 0.0], [W("A08", 2.6), -0.6, 0.0, -0.35], [ck, -0.85, 0.0, -0.5], [ck + 0.6, 0.7, 0.35, 0.3], [SON, 0.7, 0.35, 0.3]],
    "ter": [[e6 + 1.0, a8]],
    "kulak": [[0, 0], [e5 + 2.0, 0], [e5 + 2.8, 0.7], [W("E07", 2.2), 0.8], [a8, 1.0], [SON, 1.0]],
    "sacDagin": True,
    "konus": [konus("E01", "E01a_01"), konus("E02", "E02b_01"), konus("E04", "E04b_01"), konus("E05", "E05a_01"), konus("E07", "E07b_01")]
             + ([konus("Y1", Y1)] if Y1 else []) + ([konus("Y2", Y2)] if Y2 else []),
}

# böcek: makinenin altından çıkar, Ece'ye doğru koşar, annenin ayağının altında ezilir
EZ = W("A05", 1.82)
BOCEK = {"t0": W("E01", 2.9), "ez": EZ, "s": 1.35, "durAci": 30,
         "yol": [[W("E01", 2.9), 470, 1566], [W("E01", 3.3), 470, 1574], [a5 + 0.4, 560, 1680], [a5 + 0.75, 600, 1740], [a5 + 1.0, 610, 1745],   # durup anten oynatır
                 [a5 + 1.25, 650, 1800], [EZ - 0.05, 700, 1866], [EZ, 702, 1868]]}

# hayal eki (sepya): antrede anne kapıya zinciri takmış, kollar bağlı, başını sallıyor
HAYAL = {"t0": 0, "view": "antre", "gece": True, "zincir": True, "kanatOnde": False, "kapi": [[0, 0]], "titre": 2, "cam": [[0, 550, 1060, 1.3]],
         "anne": {"yer": [[0, 470, 1760, 1180]], "jest": [[0, "kollarBagli"]], "duygu": [[0, "ofkeli"]],
                  "bak": [[0, 0, 0, -0.4], [0.2, 0, 0, 0.4], [0.4, 0, 0, -0.4], [0.6, 0, 0, 0.4], [0.8, 0, 0, -0.3], [1.0, 0, 0, 0.3]], "tilt": [[0, 0], [0.3, 4]]}}
EK = [
    {"k": "bocek_yakin", "tx": ["1.7"], "a": W("A04", 2.42), "b": W("A04", 2.7)},
    {"k": "b7_ez", "tx": [json.dumps({"ez": EZ - W("A05", 1.2)})], "a": W("A05", 1.2), "b": W("A05", 2.0)},
    {"k": "para_say", "tx": ["ece"], "a": e3, "b": e3 + 1.85},
    {"k": "kulak_cek", "tx": ["sol"], "a": e5, "b": a7},
    {"k": "b7_banyo", "tx": [json.dumps(HAYAL)], "a": W("E06", 3.3), "b": W("E06", 4.4), "f": "sepia(0.85) saturate(0.75) brightness(1.06) contrast(0.92) blur(0.6px)"},
]
ORT = {"titre": 3, "gece": True, "isik": 0, "makineSepet": True, "kapi": [[0, 1]], "anne": ANNE, "ece": ECE, "bocek": BOCEK, "ek": EK,
       "eceKirp": [[0, g3 + 0.5, *ECE_KAPI]], "eceOnde": ck + 0.05,
       "golge": [[g1, 1150, 0], [g1 + 0.2, 1120, 0.9], [g1 + 0.55, 940, 1], [g1 + 0.7, 940, 1], [g1 + 0.85, 1040, 1], [g2, 930, 1], [g2 + 0.3, 930, 0.6], [g2 + 0.6, 930, 0]],
       "pervazEl": [[g2, 955, 0], [g2 + 0.2, 955, 1], [g3 - 0.05, 955, 1], [g3 + 0.1, 955, 0]],
       "flas": [[W("A04", 2.38), W("A04", 2.42)], [W("A04", 2.7), W("A04", 2.73)]]}

# ---------------------------------------------------------------- kamera (kesmeli)
IKI = (805, 1100, 1.22)
cam = Kamera("kapi")
cam.kes(g1, 760, 1060, 1.2).it(g2, 770, 1050, 1.24)                       # anne + kapı: gölge
cam.kes(g2, 905, 1000, 1.85).it(g3, 915, 990, 1.92)                       # kapı yakın: parmaklar, yarım yüz (önde destenin eli)
cam.kes(g3, *IKI).it(a4, 815, 1095, 1.26)                                 # genel: Ece içeri, güvenli mesafe
cam.kes(a4, 640, 1050, 1.72).it(W("A04", 2.38), 650, 1045, 1.85)          # anne (Ece omzu kadraj kenarında)
cam.kes(W("A04", 2.42), 1000, 1000, 2.1).it(e1, 1000, 995, 2.15)          # Ece tepki (flaştan sonra dehşet)
cam.kes(e1, 990, 1020, 1.85).it(W("E01", 0.9), 990, 1010, 1.9)            # Ece anlatır
cam.kes(W("E01", 0.95), 640, 1040, 1.95).it(W("E01", 1.4), 640, 1035, 2.0)  # anne donar
cam.kes(W("E01", 1.4), 1000, 980, 1.95).it(a5, 1000, 970, 2.05)          # anten, "ölüyodummm"
cam.kes(a5, 800, 1240, 1.18).it(W("A05", 1.2), 805, 1230, 1.22)           # genel, zemin kadrajda (böcek)
cam.kes(W("A05", 2.0), 805, 1150, 1.26).it(ses, 805, 1140, 1.28)          # ezildi; anne hâlâ Ece'ye bakıyor
cam.kes(ses, 1000, 950, 2.35).it(y1, 1000, 945, 2.45)                     # Ece yakın: yerden anneye
cam.kes(y1, 830, 1080, 1.3).it(a6, 840, 1070, 1.34)                       # "hayranınım" iki kişi
cam.kes(a6, 870, 1020, 1.5).it(e2, 880, 1000, 1.62)                       # deste ortada, kedi gözler
cam.kes(e2, 980, 1010, 1.8).it(bos, 970, 1005, 1.85)                      # Ece desteye uzanır, kapar
cam.kes(bos, 760, 1040, 1.9).it(tuk, 765, 1035, 1.95)                     # annenin boş eli
cam.kes(tuk, 1010, 990, 2.1).it(e3, 1015, 985, 2.15)                      # tükürüklü başparmak
cam.kes(e3 + 1.85, 860, 1060, 1.45).it(e4, 865, 1050, 1.5)                # anne omzunun üstünden bakar
cam.kes(e4, 990, 1010, 1.85).it(e5, 980, 1005, 1.9)                       # koklar; annenin eli soldan girer
cam.kes(a7, 815, 975, 1.9).it(e6, 820, 970, 1.95)                         # iki yüz yakın
cam.kes(e6, 960, 960, 2.0).it(e7, 985, 945, 2.4)                         # iç ses: yavaş itme
cam.kes(e7, 990, 990, 1.85).it(W("E07", 1.95), 990, 985, 1.9)             # paraya sırıtır
cam.kes(W("E07", 1.95), 815, 975, 1.9).it(a8, 815, 970, 1.95)             # ikinci "lan": kulak daha yukarı
cam.kes(a8, 830, 1100, 1.25).it(ck, 820, 1100, 1.28)                      # git elini yüzünü yıka (genel)
cam.it(SON, 520, 1100, 1.25)                                              # Ece lavaboya, kamera izler

SFX = {
    "G1": [{"name": "efekt/ayak_sesleri", "at": 0.0, "volume": 0.3}],
    "G2": [{"name": "efekt/kapi_gicirti", "at": 0.05, "volume": 0.35}],
    "G3": [{"name": "efekt/ayak_sesleri", "at": 0.3, "volume": 0.3}, {"name": "efekt/yutkunma", "at": 1.25, "volume": 0.8}],
    "A04": [{"name": "efekt/el_kagit", "at": 0.25, "volume": 0.35}, {"name": "efekt/el_kagit", "at": 1.85, "volume": 0.35}, {"name": "efekt/el_bocek_tislama", "at": 2.45, "volume": 0.5}],
    "E01": [{"name": "efekt/el_bocek_bacak", "at": 3.0, "volume": 0.35}],
    "A05": [{"name": "efekt/el_bocek_bacak", "at": 0.2, "volume": 0.45}, {"name": "efekt/el_nefes_tutma", "at": 0.85, "volume": 0.6},
            {"name": "efekt/darbe", "at": EZ - a5, "volume": 0.8}, {"name": "efekt/tokat", "at": EZ - a5, "volume": 0.5}],
    "A06": [{"name": "efekt/el_kagit", "at": 0.5, "volume": 0.3}, {"name": "efekt/el_kagit", "at": 1.35, "volume": 0.3}, {"name": "efekt/el_kagit", "at": 2.3, "volume": 0.3}],
    "E02": [{"name": "efekt/whoosh", "at": 1.82, "volume": 0.3}, {"name": "efekt/el_kagit", "at": 1.9, "volume": 0.55}],
    "TUK": [{"name": "efekt/el_tukurme", "at": 0.25, "volume": 0.35}],
    "E04": [{"name": "efekt/el_koklama", "at": 1.25, "volume": 0.7}],
    "E05": [{"name": "efekt/el_sok_vurgu", "at": 0.05, "volume": 0.3}],
    "E06": [{"name": "efekt/kilit", "at": 3.45, "volume": 0.4}],
    "A08": [{"name": "efekt/whoosh", "at": 1.65, "volume": 0.25}, {"name": "efekt/el_kagit", "at": 1.72, "volume": 0.6}, {"name": "efekt/el_kumas_burus", "at": 3.2, "volume": 0.4}],
    "CIK": [{"name": "efekt/ayak_sesleri", "at": 0.1, "volume": 0.3}],
}


def vuruslar():
    V = V2.vuruslar()
    for b in V:
        b.pop("_take", None) if b["type"] != "line" else None
    camk = cam.k
    for ad, kim, metin, tk, gap in SIRA:
        ek = b7(T[ad], camk, ORT)
        if kim:
            b = {"type": "line", "who": kim, "text": metin, "emotion": "notr", "gapAfter": gap, "_take": tk, "ekle": ek}
            if ad == "E06":
                b["voiceover"] = True
        else:
            b = {"type": "insert", "dur": round(gap, 3), **ek}
        if ad in SFX:
            b["sfx"] = SFX[ad]
        V.append(b)
    return V


def json_yaz():
    beats = vuruslar()
    # açılışın satırları v2 manifestinden (_take anahtarları)
    sc = {"id": "a", "set": "banyo_kapi", "time": "gece", "title": "Deste", "transition": "kesme", "cast": {},
          "music": {"name": "muzik/banyo_komik", "volume": 0.12}, "ambience": {"name": "ortam/oda_tonu", "volume": 0.3},
          "ambience2": {"name": "ortam/sehir_gece", "volume": 0.06}, "beats": beats}
    yaz("724-07-p1", "Bölüm 7 · Parça 1", [sc], M)
    print(f"P1 toplam {SON:.2f} sn; açılış {AC}; {len(beats)} vuruş", {k: round(v, 2) for k, v in T.items()})


if __name__ == "__main__":
    json_yaz()
