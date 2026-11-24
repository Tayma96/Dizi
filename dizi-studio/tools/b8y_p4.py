"""7/24 B8 (yeni) Parça 4 (v3, kullanıcı geri bildirimiyle baştan):
Ece ve Mert TEZGÂHIN ARKASINDA yan yana. Ece (dingin): "Merak etme ben yanındayım" → depo kapısı PAT (sert ses, toz, sarsıntı,
kapı duvara çarpıp geri seker) → sarışın kadın depo ışığından fırlar (öne eğik, kollar pompalar, saç savrulur, omzunun üstünden
arkaya bakar) · aynı anda Ece çığlıkla Mert'in KOLUNA GİRER → kasa yakın: Ece Mert'in koluna yapışık, çığlık →
koridor (göz hizası): kadın kameraya koşar, ayağı takılır → KESME (aksiyonda) → TEPEDEN: yere kapaklanır, ürünler saçılır →
tepeden yakın: başını kaldırıp ağlayarak "Peşimdeee!", depoyu gösterir → YAN: Ece Mert'in kolunu bırakır, tezgâhın arkasından
kapıya (kapı solunda kalacak şekilde) yürür, eşikte durur → FPS (depo): başını sola çevirir: yaratık twerk → fark eder → öksürür → koşar.
Kullanım: python3 tools/b8y_p4.py  -> public/episodes/724-08y-p4.json
"""
import json, os, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KARE = 30
VFROM = 2 / KARE
sys.argv = [sys.argv[0]]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import b8y_p1 as P1  # noqa: E402  (yan açı izdüşümü)

VD = f"{K}/public/voice/724-08y-p4"
M = json.load(open(f"{VD}/manifest.json"))
TAKE = {"M1": "N1a_01", "E1": "E1a_01", "K1": "K1b_01"}
if os.path.exists(f"{VD}/secim.json"):
    TAKE.update(json.load(open(f"{VD}/secim.json")))
METIN = {"M1": ("ece_sivil", "Merak etme ben yanındayım"), "E1": ("ece_sivil", "Aaaaa!"), "K1": ("kacan724", "Peşimdeee!")}
FPS_KAYDIR = 1.6           # FPS koridor yürüyüşü kısaldı (Ece kapının yanından başlar)
FPS_SURE = 13.0 - FPS_KAYDIR

SIRA = [("GIRIS", None, 0.3), ("M1", "M1", 0.0), ("PAT", None, 0.3), ("E1", "E1", 0.35), ("DUS", None, 1.45),
        ("K1", "K1", 0.35), ("YAKLAS", None, 3.4), ("FPS", None, FPS_SURE)]
T, DUR, fr = {}, {}, 0
for ad, r, d in SIRA:
    T[ad] = fr / KARE
    n = round(((M[TAKE[r]]["duration"] + d) if r else d) * KARE)
    DUR[ad] = n / KARE
    fr += n
SON_T = fr / KARE
V = lambda r: (T[r] + VFROM, T[r] + VFROM + M[TAKE[r]]["duration"])
konus = lambda r: {"t": round(T[r] + VFROM, 3), "cues": M[TAKE[r]]["mouth"]}
sirala = lambda k: sorted(k, key=lambda q: q[0])

g0 = T["GIRIS"]; m1a, m1b = V("M1"); p0 = T["PAT"]; e1a, e1b = V("E1"); d0 = T["DUS"]; k1a, k1b = V("K1")
ya0 = T["YAKLAS"]; fp0 = T["FPS"]
t_pat = p0 + 0.04                 # kapı PAT (cümle biter bitmez)
t_kol = e1a + 0.25                # Ece Mert'in koluna girer
t_tak = d0 + 0.95                 # kadının ayağı takılır
t_yer = d0 + 1.15                 # (tepeden) yere çarpar

# ------------------------------------------------------------------ kamera
SINIR = {"kasa": (0, 1080, 0, 1920), "yan": (0, 1080, 0, 1920), "reyon": (-200, 1280, -200, 2120), "tepe": (-300, 1380, -300, 2220)}
CAM = {v: [] for v in SINIR}
KURGU = []


def kirp(view, cx, cy, z, pay=10):
    x0, x1, y0, y1 = SINIR[view]
    hw, hh = 540 / z + pay, 960 / z + pay
    return [round(min(max(cx, x0 + hw), x1 - hw), 1), round(min(max(cy, y0 + hh), y1 - hh), 1), round(z, 3)]


def kes(t, view, cx, cy, z):
    k = CAM[view]
    if k:
        k.append([round(t - 0.004, 3)] + k[-1][1:])
    k.append([round(t, 3)] + kirp(view, cx, cy, z))
    KURGU.append([round(t, 3), view])


def it(t, view, cx, cy, z):
    CAM[view].append([round(t, 3)] + kirp(view, cx, cy, z))


# ------------------------------------------------------------------ yerleşimler
MX, MY, MS = 730, 1960, 1300                 # kasa: Mert tezgâhın arkasında
EKX, EKY, EKS = 455, 1960, 1180              # kasa: Ece tezgâhın arkasında, Mert'in solunda
EKYUZ = EKY - 765 * EKS / 1000
YSB = P1.yI(0.95, 0.95, 1.72)                # yan: Mert
YEC = P1.yI(0.45, 0.95, 1.6)                 # yan: Ece (Mert'in solunda, tezgâhın arkasında)
YEC2 = P1.yI(0.66, 0.95, 1.6)                # yan: Ece Mert'in koluna yapışık
YEC3 = P1.yI(1.12, 1.55, 1.6)                # yan: Ece kapının eşiğinde (kapı solunda)
YK_IC = P1.yI(1.48, 2.2)                     # kadın kapı boşluğunda
YK_1 = P1.yI(1.6, 1.25)                      # kadın tezgâhın arkasından geçer
YK_2 = [1320, 1880, 1350]                    # kadraj sağından çıkar
S_ = lambda q: q[2] / 1000

# ------------------------------------------------------------------ KARAKTERLER
ECE_KS = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": sirala([[0, EKX, EKY, EKS], [e1a, EKX, EKY, EKS], [t_kol, EKX + 105, EKY - 10, EKS], [SON_T, EKX + 105, EKY - 10, EKS]]),
    "elL": sirala([[0, EKX + 70, 1436], [e1a, EKX + 70, 1436], [t_kol, 650, 1270], [SON_T, 652, 1274]]),
    "elR": sirala([[0, EKX - 60, 1436], [e1a, EKX - 60, 1436], [t_kol, 620, 1330], [SON_T, 622, 1334]]),
    "duygu": [[0, "korkmus"], [m1a - 0.1, "mutlu"], [e1a, "dehset"], [e1b, "korkmus"]],
    "bak": sirala([[0, 0.5, -0.05, 0.35], [e1a, -0.55, 0, -0.35], [e1b, -0.5, 0.05, -0.3]]),
    "tilt": sirala([[0, -2], [m1a + 0.4, 5], [e1a, -4], [t_kol, 9]]),
    "egil": [[0, 0], [t_kol - 0.05, 0], [t_kol + 0.1, 6]],
    "gozSok": [[0, 0], [e1a, 0], [e1a + 0.08, 0.9], [e1b, 0.6]],
    "parilti": [[0, 0, 0], [m1a, 0, 0], [m1a + 0.4, 0.5, 0.5], [e1a, 0, 0]],
    "nefes": [[0, 1.4], [e1a, 2.6]], "kulak": [[0, 0.3]],
    "konus": [konus("M1"), konus("E1")],
}
MERT_KS = {
    "onKol": True, "dogalKol": True, "yer": [[0, MX, MY, MS]],
    "duygu": [[0, "notr"], [m1a + 0.6, "mutlu"], [t_pat, "saskin"]],
    "bak": sirala([[0, -0.35, 0.1, -0.25], [t_pat, 0.5, -0.1, 0.4], [t_kol, -0.55, 0.05, -0.4]]),
    "tilt": [[0, -2], [t_pat, 4]], "egil": [[0, 0]], "gozSok": [[0, 0], [t_pat, 0], [t_pat + 0.1, 0.6], [t_pat + 0.6, 0.2]],
}
yS, eS = S_(YSB), S_(YEC2)
MERT_YAN = {
    "onKol": True, "dogalKol": True, "yer": [[0, *YSB]],
    "elL": sirala([[0, YSB[0] - 75 * yS, YSB[1] - 330 * yS], [ya0 + 0.4, YSB[0] - 75 * yS, YSB[1] - 330 * yS], [ya0 + 0.9, YSB[0] + 80 * yS, YSB[1] - 520 * yS],
                   [ya0 + 1.6, YSB[0] + 60 * yS, YSB[1] - 480 * yS], [ya0 + 2.2, YSB[0] - 40 * yS, YSB[1] - 340 * yS]]),
    "duygu": [[0, "notr"], [t_pat, "saskin"], [ya0, "korkmus"]],
    "bak": sirala([[0, -0.3, 0, -0.2], [t_pat, 0.65, -0.1, 0.5], [e1a + 0.5, 0.55, 0, 0.4], [ya0, 0.6, 0, 0.45]]),
    "gozSok": [[0, 0], [t_pat, 0], [t_pat + 0.08, 0.7], [t_pat + 0.7, 0.2]], "tilt": [[0, 0], [t_pat, 5], [ya0, -4]], "egil": [[0, 0], [t_pat, 0], [t_pat + 0.1, -4]],
}
ECE_YAN = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": sirala([[0, *YEC], [t_pat + 0.02, *YEC], [t_pat + 0.12, YEC[0], YEC[1] - 25, YEC[2]], [t_kol, *YEC2], [ya0 + 0.3, *YEC2], [ya0 + 3.0, *YEC3], [SON_T, *YEC3]]),
    "yuru": [[ya0 + 0.35, ya0 + 3.0]],
    "elL": sirala([[0, YEC[0] + 60 * eS, YEC[1] - 330 * eS], [t_pat, YEC[0] + 60 * eS, YEC[1] - 330 * eS], [t_kol, YSB[0] - 70 * yS, YSB[1] - 560 * yS],
                   [ya0 + 0.3, YSB[0] - 70 * yS, YSB[1] - 560 * yS], [ya0 + 0.8, YEC2[0] + 80 * eS, YEC2[1] - 520 * eS], [SON_T, YEC3[0] + 40 * S_(YEC3), YEC3[1] - 520 * S_(YEC3)]]),
    "elR": sirala([[0, YEC[0] - 60 * eS, YEC[1] - 330 * eS], [t_pat, YEC[0] - 60 * eS, YEC[1] - 330 * eS], [t_kol, YSB[0] - 85 * yS, YSB[1] - 470 * yS],
                   [ya0 + 0.3, YSB[0] - 85 * yS, YSB[1] - 470 * yS], [ya0 + 0.8, YEC2[0] + 30 * eS, YEC2[1] - 600 * eS], [SON_T, YEC3[0] - 20 * S_(YEC3), YEC3[1] - 600 * S_(YEC3)]]),
    "duygu": [[0, "mutlu"], [t_pat, "dehset"], [e1b, "korkmus"]],
    "bak": sirala([[0, 0.5, 0, 0.35], [t_pat, 0.75, -0.15, 0.55], [ya0, 0.7, -0.05, 0.55], [ya0 + 2.8, 0.85, -0.05, 0.7]]),
    "gozSok": [[0, 0], [t_pat, 0], [t_pat + 0.08, 0.9], [e1b, 0.5], [ya0 + 0.5, 0.3]],
    "tilt": [[0, 0], [t_pat, -5], [t_kol, 8], [ya0, 0], [ya0 + 1.5, -3]], "egil": [[0, 0], [ya0 + 0.4, 6]],
    "nefes": [[0, 1.2], [t_pat, 2.6], [ya0, 2.0]], "kulak": [[0, 0.3]],
    "konus": [konus("E1")],
}
t_k0, t_k1, t_k2 = t_pat + 0.05, t_pat + 0.55, t_pat + 1.05
KADIN_YAN = {
    "onKol": True, "dogalKol": True,
    "yer": sirala([[0, YK_IC[0], YK_IC[1], 1], [t_k0 - 0.01, YK_IC[0], YK_IC[1], 1], [t_k0, *YK_IC], [t_k1, *YK_1], [t_k2, *YK_2], [t_k2 + 0.01, YK_2[0], YK_2[1], 1]]),
    "yuru": [[t_k0, t_k2]], "egil": [[0, 14]],
    "duygu": [[0, "dehset"]], "bak": [[0, -0.6, -0.15, -0.5]], "tilt": [[0, 6]],
    "sacDagin": 1, "tears": 0.4,
}


def _kol(side):
    # koşarken kollar pompalar (dirsek bükük, öne-arkaya); kadının o anki yerine ve ölçeğine göre
    out = []
    for i in range(9):
        tt = t_k0 + i * 0.12
        ileri = (1 if i % 2 else -1) * side
        u = min(1.0, max(0.0, (tt - t_k0) / (t_k2 - t_k0)))
        bx = YK_IC[0] + (YK_2[0] - YK_IC[0]) * u
        by = YK_IC[1] + (YK_2[1] - YK_IC[1]) * u
        sc = (YK_IC[2] + (YK_2[2] - YK_IC[2]) * u) / 1000
        out.append([round(tt, 3), round(bx + side * 60 * sc + ileri * 70 * sc, 1), round(by - (560 + 90 * ileri) * sc, 1)])
    return out


KADIN_YAN["elL"], KADIN_YAN["elR"] = _kol(-1), _kol(1)
KADIN_RY = {
    "onKol": True, "dogalKol": True,
    "yer": sirala([[0, 560, 1380, 520], [d0, 560, 1380, 520], [t_tak, 545, 1640, 900], [t_yer, 520, 1760, 1060]]),
    "yuru": [[d0, t_tak]], "egil": sirala([[0, -8], [t_tak - 0.05, -8], [t_tak + 0.18, -32]]),
    "elL": sirala([[0, 440, 1100], [t_tak, 470, 1000], [t_tak + 0.18, 300, 1150]]), "elR": sirala([[0, 680, 1100], [t_tak, 650, 1000], [t_tak + 0.18, 820, 1120]]),
    "duygu": [[0, "dehset"], [t_tak, "sok"]], "bak": [[0, 0, 0, 0]], "gozSok": [[0, 0.5], [t_tak, 1]], "sacDagin": 1, "tears": 0.4,
}
TX, TY = 900, 1450                            # ayaklar (sağ alt); baş sol üstte (depoya doğru), çapraz yüzükoyun
HX, HY = 175, 940                             # başın yaklaşık yeri
KADIN_TP = {
    "onKol": True, "dogalKol": True,
    "yer": sirala([[0, TX, TY, 900], [t_yer - 0.01, TX + 30, TY + 40, 1000], [t_yer + 0.1, TX, TY, 900], [SON_T, TX, TY, 900]]),
    "egil": [[0, -55]],
    "elL": sirala([[0, HX + 330, HY + 250], [k1a - 0.3, HX + 330, HY + 250], [k1a + 0.1, HX + 300, HY + 200]]),
    "elR": sirala([[0, HX + 120, HY - 60], [k1a - 0.3, HX + 120, HY - 60], [k1a + 0.15, HX + 160, HY - 330]]),
    "tutR": [[0, None], [k1a + 0.1, "isaret"]], "isaretAci": -40,
    "duygu": [[0, "aci"], [k1a - 0.35, "dehset"]], "bak": [[0, 0, 0, 0], [k1a - 0.3, -0.2, -0.3, -0.1]], "tilt": [[0, 0], [k1a - 0.3, -10]],
    "gozSok": [[0, 0], [k1a - 0.3, 0.8]], "sacDagin": 1, "tears": 0.6, "konus": [konus("K1")],
}

# ------------------------------------------------------------------ KURGU
kes(g0, "kasa", EKX + 40, EKYUZ + 300 / 2.0, 2.0)               # 1 KASA: Ece tek (Mert'in yanında): "Merak etme ben yanındayım" (dingin)
it(p0, "kasa", EKX + 45, EKYUZ + 290 / 2.15, 2.15)
kes(p0, "yan", 640, 1020, 1.3)                                 # 2 YAN: kapı PAT · kadın fırlar · Ece çığlıkla Mert'in koluna girer
it(e1a + 0.75, "yan", 690, 1030, 1.42)
kes(e1a + 0.75, "kasa", 600, 1120, 1.55)                        # 3 KASA yakın: Ece Mert'in koluna yapışık, çığlık
it(d0, "kasa", 605, 1112, 1.62)
kes(d0, "reyon", 560, 1100, 1.0)                               # 4 KORİDOR: kadın kameraya koşar, ayağı takılır
it(t_tak + 0.1, "reyon", 555, 1250, 1.15)
kes(t_tak + 0.1, "tepe", 560, 1150, 1.05)                        # 5 TEPEDEN (aksiyonda kesme): yere kapaklanır, ürünler saçılır
it(k1a - 0.35, "tepe", 540, 1120, 1.12)
kes(k1a - 0.35, "tepe", HX + 230, HY + 80, 1.9)                # 6 TEPEDEN yakın: başını kaldırır, ağlayarak "Peşimdeee!", depoyu gösterir
it(ya0, "tepe", HX + 235, HY + 70, 2.05)
kes(ya0, "yan", 620, 1030, 1.3)                                # 7 YAN: Ece kolu bırakır, tezgâhın arkasından kapıya yürür, eşikte durur
it(fp0, "yan", 700, 1010, 1.5)

ORTAK = {"saat": [[0, "00:03"]], "kapi": [[0, 0]], "flor": [[0, 0.85]], "cizir": [[t_pat, t_pat + 0.35]], "lamba": [[0, 0]],
         "titre": {"kasa": 1.2, "yan": 1.0, "reyon": 1.6, "tepe": 1.0},
         "blok": [[0, 560]], "gazete": [[0, 1300]], "gazeteTz": [[0, -700]], "kagitTz": [[0, 1]], "elAra": [],
         "kalemMasa": [[0, 640, 1]], "eceKasaAra": [[0, 99]], "eceArkada": True, "odak": [[0, 0]],
         "depo": [[0, 0], [t_pat - 0.02, 0], [t_pat + 0.06, 1.08], [t_pat + 0.2, 0.86], [t_pat + 0.36, 0.98], [SON_T, 0.98]],
         "depoKol": [[0, 0]], "toz": [[0, 0], [t_pat - 0.01, 0], [t_pat, 0.02], [t_pat + 0.9, 1]],
         "sars": [[0, 0], [t_pat - 0.01, 0], [t_pat, 1.2], [t_pat + 0.35, 0], [t_tak - 0.01, 0], [t_tak + 0.1, 0.5], [t_yer, 1.3], [t_yer + 0.4, 0]],
         "reyonUfuk": 980,
         "dusenTepe": [[t_yer + 0.02, 330, 620, 80, 50], [t_yer + 0.06, 760, 900, -90, -70], [t_yer + 0.1, 250, 1500, 60, 120],
                       [t_yer + 0.14, 700, 1650, -70, -30], [t_yer + 0.2, 520, 520, -40, 160]],
         "tepeGolge": [(TX + HX) / 2 + 20, (TY + HY) / 2 + 40, 170, 520, -55],
         "anime": {}, "animeMerkez": {}}
KAR = {"kasa": {"mert": MERT_KS, "ece": ECE_KS}, "yan": {"mert": MERT_YAN, "kadin": KADIN_YAN, "ece": ECE_YAN},
       "reyon": {"kadin": KADIN_RY}, "tepe": {"kadin": KADIN_TP}}


def blob(t0, t1):
    vs = set()
    for i, (t, v) in enumerate(KURGU):
        tn = KURGU[i + 1][0] if i + 1 < len(KURGU) else 1e9
        if t < t1 and tn > t0:
            vs.add(v)
    p = {"t0": round(t0, 3), "kurgu": KURGU, **ORTAK, "cam": {v: CAM[v] for v in vs}, "kar": {v: KAR[v] for v in vs if KAR[v]}}
    return {"kind": "b8_market", "text": [json.dumps(p, ensure_ascii=False, separators=(",", ":"))]}


def E(ad, isim, t, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t - T[ad], 3), "volume": vol, **kw}


SFX = {"PAT": [E("PAT", "b8y4_kapi_pat", t_pat - 0.02, 1.0), E("PAT", "b8y_kapi_hiz", t_pat, 0.45)],
       "E1": [E("E1", "b8y4_kadin_kos", t_k0, 0.7)],
       "DUS": [E("DUS", "b8y3_adim", d0, 0.55, sure=0.95), E("DUS", "b8y4_raf_dusus", t_yer - 0.08, 0.9)],
       "YAKLAS": [E("YAKLAS", "b8y4_adim_yavas", ya0 + 0.35, 0.55), E("YAKLAS", "b8y4_ece_nefes", ya0 + 0.2, 0.55)]}

# ------------------------------------------------------------------ FPS (Ece'nin gözünden, depo); yerel zaman
_K = FPS_KAYDIR


def _kay(liste):
    return [[0 if i == 0 else round(max(0.05, r[0] - _K), 3), *r[1:]] for i, r in enumerate(liste)]


G = lambda t: fp0 + t - _K
FPS_SFX = [E("FPS", "b8y4_adim_yavas", fp0, 0.6, sure=1.6), E("FPS", "b8y4_ece_nefes", fp0 + 0.1, 0.55),
           E("FPS", "muzik/b8y4_twerk", fp0, 0.08, sure=3.9 - _K), E("FPS", "muzik/b8y4_twerk", G(3.9), 0.75, kirp=3.9, sure=4.85),
           E("FPS", "b8y4_radyo_kapan", G(8.72), 0.6), E("FPS", "b8y4_oksuruk", G(10.4), 0.85),
           E("FPS", "b8y3_ciglik", G(11.55), 0.75), E("FPS", "b8y3_kalk_kos", G(11.7), 0.6), E("FPS", "b8y4_ece_ciglik", G(11.85), 0.8)]
FPSP = {"t0": 0, "mekan": "depo",
        "kam": [[0, -0.2, 1.53, 2.0, -2, 3, 0]] + _kay([[0, 0, 0, 0, 0, 0, 0], [3.2, -0.25, 1.52, 3.3, -4, 3, -1], [3.5, -0.35, 1.5, 3.42, -8, 3, 0],
                [4.4, -0.45, 1.5, 3.45, -70, 2, 1], [4.75, -0.48, 1.5, 3.45, -90, 1, 0], [8.7, -0.5, 1.5, 3.45, -91, 0, 0],
                [11.4, -0.5, 1.5, 3.45, -90, -6, 0], [11.7, -0.5, 1.5, 3.45, -90, -13, 0], [12.9, -0.42, 1.42, 3.5, -88, -26, 4]])[1:],
        "sallan": [[0, 0.35, 1.4], [1.6, 0.35, 1.4], [1.8, 0, 1.4]],
        "titreme": _kay([[0, 0.5], [4.4, 0.6], [4.8, 0.1], [11.5, 0.1], [11.7, 1.0]]),
        "sars": _kay([[0, 0], [11.55, 0], [11.6, 0.5], [12.0, 0.2], [12.9, 0.8]]),
        "fov": _kay([[0, 1], [4.75, 1], [8.7, 1.18], [9.2, 1.25], [11.0, 1.25], [11.45, 1.0], [12.9, 0.9]]),
        "twerk": _kay([[0, 0], [3.9, 0], [4.1, 1], [8.6, 1], [8.8, 0]]), "radyo": _kay([[0, 0], [3.9, 0], [4.0, 1], [8.72, 1], [8.75, 0]]),
        "kalp": _kay([[0, 0.5], [3.9, 0.7], [4.4, 0], [9.2, 0], [9.4, 0.6], [12.9, 1]]),
        "kirmizi": _kay([[0, 0], [11.5, 0], [11.8, 0.9]]), "karart": _kay([[0, 0], [12.75, 0], [12.95, 1]]),
        "depoYaratik": {"yer": _kay([[0, -3.3, 3.15, 0], [11.7, -3.3, 3.15, 0], [12.9, -1.95, 3.35, 12]]),
                        "bak": _kay([[0, 0], [8.8, 0], [9.2, 1], [10.2, 0.6]]), "dogrul": _kay([[0, 0], [9.7, 0], [10.2, 1]]),
                        "oksur": _kay([[0, 0], [10.3, 0], [10.45, 1], [11.2, 1], [11.35, 0]]),
                        "on": _kay([[0, 0], [11.45, 0], [11.5, 1]]), "boy": _kay([[0, 1], [11.65, 1], [12.0, 0.58]]),
                        "agiz": _kay([[0, 0], [11.5, 0], [11.8, 1]]), "seg": _kay([[0, 0], [11.5, 0], [11.55, 1], [11.9, 0.3]])}}


if __name__ == "__main__":
    ep_id = "724-08y-p4"
    man, beats = {}, []
    for i, (ad, r, d) in enumerate(SIRA):
        if ad == "FPS":
            beats.append({"type": "insert", "dur": round(DUR[ad], 4), "kind": "b8_fps", "text": [json.dumps(FPSP, separators=(",", ":"))], "sfx": FPS_SFX})
            continue
        ek = blob(T[ad], T[ad] + DUR[ad])
        if r:
            who, metin = METIN[r]
            b = {"type": "line", "who": who, "text": metin, "emotion": "notr", "gapAfter": d, "ekle": ek}
            man[f"i_{i + 1:02d}"] = M[TAKE[r]]
        else:
            b = {"type": "insert", "dur": round(DUR[ad], 4), **ek}
        if SFX.get(ad):
            b["sfx"] = SFX[ad]
        beats.append(b)
    tum = {k: v for k, v in M.items() if not k.startswith("i_")}
    tum.update(man)
    json.dump(tum, open(f"{VD}/manifest.json", "w"), ensure_ascii=False, indent=1)
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Market · depo kapısı", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.5}, "music": {"name": "yok"}, "beats": beats}
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 8, "title": "Bölüm 8 · Parça 4", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON_T:.2f} sn")
