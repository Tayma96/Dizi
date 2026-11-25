"""7/24 Bölüm 9, Parça 3-6 (kullanıcının metni AYNEN: docs/diziler/724/b9-senaryo-p3-p6.md). Görüntü yönetmeni sürümü (kaba sürümün yerine).
P3 Rüşvet · P4 Kıskançlık krizi · P5 Para yiyen kadın · P6 Bekçi. Sesler: public/voice/724-09-p3b C_01..C_21 (4. replik B_04).
Tek sahne zaman çizelgesi; görünümler: yan (market, kapı), para (kapı altı yakın), sise, golge, saat + FPS (Ece'nin gözü).
Kullanım: python3 tools/b9_p36.py  -> public/episodes/724-09-p3b.json      (--kare t1 t2 ... -> out/b9t/kare.json: B8Kare kontrol kareleri)
"""
import json
import math
import os
import sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KARE = 30
VF = 2 / KARE
_ARGV = sys.argv[1:]
sys.argv = [sys.argv[0]]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import b9_p2 as P2  # noqa: E402
P1 = P2.P1
yI, yP = P1.yI, P1.yP

EP = "724-09-p3b"
VD = f"{K}/public/voice/{EP}"
M = json.load(open(f"{VD}/manifest.json"))
TAKE = {r: ("B_04" if r == 4 else f"C_{r:02d}") for r in range(1, 22)}
WHO = {1: "yaratik724b", 2: "mert724", 3: "ece_sivil", 4: "ece_sivil", 5: "yaratik724b", 6: "ece_sivil", 7: "kacan724", 8: "mert724",
       9: "ece_sivil", 10: "kacan724", 11: "ece_sivil", 12: "kacan724", 13: "mert724", 14: "ece_sivil", 15: "ece_sivil", 16: "kacan724",
       17: "kacan724", 18: "ece_sivil", 19: "yaratik724b", 20: "ece_sivil", 21: "kacan724"}
D = {r: M[TAKE[r]]["duration"] for r in TAKE}
R3 = lambda v: round(v, 3)
fr = lambda v: round(round(v * KARE) / KARE, 4)

# ------------------------------------------------------------------ replik başlangıçları (sahne sn; ses +VF)
L = {1: 0.6, 2: 6.9, 3: 9.2, 4: 13.3, 5: 15.2, 6: 21.0, 7: 34.6, 8: 38.8, 9: 45.2, 10: 47.4, 11: 51.4, 12: 55.2, 13: 60.2,
     14: 73.6, 15: 83.4, 16: 89.4, 17: 99.8, 18: 111.6, 19: 116.9, 20: 121.3, 21: 127.8}
L = {r: fr(v) for r, v in L.items()}
SON = 136.0                       # 02:59'dan sert kesme


def ws(r, i):
    """r. repliğin i. sözcüğünün sahne zamanı"""
    return R3(L[r] + VF + M[TAKE[r]]["words"][i]["start"])


def we(r, i):
    return R3(L[r] + VF + M[TAKE[r]]["words"][i]["end"])


def ve(r):
    return R3(L[r] + VF + D[r])


for r in range(1, 21):
    assert ve(r) + 0.1 <= L[r + 1], (r, ve(r), L[r + 1])

# FPS aralıkları (Ece'nin gözü)
F1 = (5.9, 8.9)       # P3: Mert "sakın"; kız paraya döner
F2 = (88.8, 93.5)     # P5: Elif dört ayak Mert'e
F3 = (99.5, 103.9)    # P5 kanca: Elif burnunun dibinde
FPS_ARA = [F1, F2, F3]

# ------------------------------------------------------------------ yerleşim (yan)
EK = P2.EK                                   # Ece: kapıya yaslı
SE = EK[2] / 1000
FK = [EK[0], EK[1] - 765 * SE]
EA = yI(1.47, 1.56, 1.6)                     # bir adım öne
FA = [EA[0], EA[1] - 765 * EA[2] / 1000]
MP = yI(0.55, 1.28, 1.78)                    # Mert (tezgâhın arka ucunda)
SM = MP[2] / 1000
MF = [MP[0], MP[1] - 765 * SM]
ELK = yI(1.78, 1.46, 1.66)                   # Elif: kapının sağında (paraların başında)
ELM = yI(0.98, 1.18, 1.66)                    # Elif: Mert'in yanında
ELE = yI(1.6, 1.36, 1.66)                    # Elif: Ece'nin dibinde (P6 başı)
ELA = yI(0.68, 1.46, 1.66)                   # Elif: Mert'in arkasında (P6 son)
SL = ELK[2] / 1000
fy = lambda q, k=0.765: q[1] - k * q[2]
YAN_KOL = yP(1.15, 1.0, 1.9)
# Elif tepede: sigara dolabının üstünde oturur (bacaklar sarkık); işaret oturma testine göre
UST_X, UST_Z = -0.42, 1.84
_u = yP(UST_X, 2.0, UST_Z)
_d = (UST_X - 1.9) * math.sin(math.atan2(1.0 - 1.9, 1.0 + 3.4)) + (UST_Z + 3.4) * math.cos(math.atan2(1.0 - 1.9, 1.0 + 3.4))
ELU = [round(_u[0], 1), round(_u[1] + 0.33 * 1600 * 1.66 * 0.93 / _d / 765 * 1000, 1), round(1600 * 1.66 * 0.93 / _d / 765 * 1000, 1)]


class KF(list):
    def a(self, t, *v):
        self.append([R3(t), *v])
        return self

    def s(self):
        self.sort(key=lambda k: k[0])
        return list(self)


def el(q, dx, dy):
    """karakter işaretine göre ekran el noktası (dx, dy rig birimi)"""
    s = q[2] / 1000
    return [round(q[0] + dx * s, 1), round(q[1] + dy * s, 1)]


def don(k, t, a, b, sure=0.5):
    """önce gözler, sonra baş (yay)"""
    k.a(t, *a).a(t + 0.12, b[0], b[1], a[2]).a(t + 0.12 + sure, *b)


# ================================================================== ECE
E_YER = KF().a(0, *EK)
E_EL_L, E_EL_R = KF(), KF()
KSL, KSR = P2.KAPI_SL, P2.KAPI_SR
YL, YR = el(EK, -118, -430), el(EK, 112, -420)
E_EL_L.a(0, *KSL).a(3.6, *KSL).a(4.2, *YL)
E_EL_R.a(0, *KSR).a(3.8, *KSR).a(4.4, *YR)
# "Bir dakika Mert": sol el işaret parmağı yukarı (Mert'e), göz paradan ayrılmaz; "Ben asgari ücretliyim": sağ el göğse
E_EL_L.a(L[3] - 0.05, *YL).a(L[3] + 0.4, *el(EK, -190, -700)).a(ws(3, 2) + 0.2, *el(EK, -200, -720)).a(ws(3, 3), *el(EK, -150, -560)).a(ws(3, 3) + 0.5, *YL)
E_EL_R.a(ws(3, 3) - 0.1, *YR).a(ws(3, 4), *el(EK, 18, -585)).a(ve(3) + 0.1, *el(EK, 18, -585)).a(ve(3) + 0.5, *YR)
# "Kaç para?": eğilir, eller dizlere doğru
E_EL_L.a(L[4] - 0.3, *YL).a(L[4] + 0.1, *el(EK, -110, -330)).a(17.9, *el(EK, -110, -330)).a(18.4, *YL)
E_EL_R.a(L[4] - 0.3, *YR).a(L[4] + 0.1, *el(EK, 120, -330)).a(17.9, *el(EK, 120, -330)).a(18.4, *YR)
# "Bu kız ... iki yüz eder": açık avuçla Elif'i gösterir (ürün tanıtır gibi)
E_EL_R.a(ws(6, 2) - 0.25, *YR).a(ws(6, 2) + 0.1, *el(EK, 135, -520)).a(we(6, 8), *el(EK, 145, -540)).a(ve(6) + 0.6, *el(EK, 135, -520))
# eller belde (P3 sonu) → P4 başı kollar kavuşur
BEL_L, BEL_R = el(EK, -98, -470), el(EK, 96, -470)
E_EL_R.a(25.6, *el(EK, 135, -520)).a(26.2, *BEL_R)
E_EL_L.a(26.1, *YL).a(26.7, *BEL_L)
CRL, CRR = BEL_L, BEL_R          # kollar kavuşmaz (çapraz kol yok): eller belde
E_EL_L.a(42.9, *BEL_L).a(43.4, *CRL)
E_EL_R.a(42.95, *BEL_R).a(43.45, *CRR)
# kıskançlık: kavuşuk kolda parmaklar tıkırdar (el hafif titrer)
for i in range(5):
    t = 43.9 + i * 0.28
    E_EL_R.a(t, *CRR).a(t + 0.1, CRR[0] + 3, CRR[1] - 8)
E_EL_R.a(45.4, *CRR)
# "Sen kime tatlım": adım + işaret parmağı Elif'e (sol)
E_YER.a(51.5, *EK).a(52.15, *EA)
E_EL_L.a(51.45, *CRL).a(51.9, *el(EA, -130, -520)).a(ws(11, 1), *el(EA, -175, -640)).a(we(11, 7), *el(EA, -185, -650)).a(ve(11) + 0.2, *el(EA, -175, -640)).a(59.6, *el(EA, -150, -470)).a(60.0, *el(EA, -110, -440))
E_EL_R.a(51.45, *CRR).a(52.0, *el(EA, 112, -430))
# "Kızlar lütfen" sırasında yine kollar kavuşur; "Mert?" adım geri, el yarım uzanır
E_YER.a(60.4, *EA).a(61.2, *EK)
E_EL_L.a(60.6, *el(EK, -110, -440)).a(61.2, *CRL)
E_EL_R.a(60.6, *el(EK, 112, -430)).a(61.25, *CRR)
E_EL_L.a(74.6, *CRL).a(75.2, *el(EK, -170, -520)).a(75.6, *el(EK, -205, -560)).a(79.0, *el(EK, -205, -560)).a(79.6, *YL)
E_EL_R.a(74.7, *CRR).a(75.3, *YR)
# "Bu kız parayı yiyor lan!": eli ağzına, sonra aşağıyı (Elif'i) gösterir
E_EL_R.a(83.45, *YR).a(83.85, *el(EK, 30, -690)).a(ws(15, 2) - 0.1, *el(EK, 30, -690)).a(ws(15, 2) + 0.25, *el(EK, 230, -470)).a(ve(15) + 0.4, *el(EK, 230, -470)).a(87.0, *YR)
# ışık titrer: kapıya yapışır (avuçlar kapıda)
E_EL_L.a(96.9, *YL).a(97.3, *KSL)
E_EL_R.a(96.9, *YR).a(97.3, *KSR)
E_YER.a(97.0, *EK).a(97.35, EK[0] + 6, EK[1], EK[2])
# P6: kapı koluna giden el (2. kural ikilemi): sol el kola
E_EL_L.a(124.4, *KSL).a(125.6, YAN_KOL[0] + 4, YAN_KOL[1] - 6)
for i in range(16):
    t = 125.7 + i * 0.5
    E_EL_L.a(t, YAN_KOL[0] + 4 + (1.5 if i % 2 else -1.5), YAN_KOL[1] - 6 + (1 if i % 2 else 0))
E_EL_R.a(111.0, *KSR).a(111.6, *YR).a(ve(18) + 0.3, *YR).a(121.0, *KSR)
E_YER.a(SON, EK[0] + 6, EK[1], EK[2])

E_BAK = KF()
DOOR_FLOOR = [0.35, 0.85, 0.35]                 # yerdeki paralar (kapı dibi, sağ-aşağı)
SOL = [-0.7, 0.05, -0.55]                       # Mert (ekran solu)
ELIF_K = [0.6, 0.25, 0.4]                       # Elif kapının sağında
ELIF_M = [-0.55, 0.05, -0.4]                    # Elif Mert'in yanında
KAPI = [0.75, 0.15, 0.7]                        # kapı (arkası)
E_BAK.a(0, 0.15, -0.55, 0.12)
don(E_BAK, 2.9, [0.15, -0.55, 0.12], DOOR_FLOOR, 0.45)
# her yeni banknotla gözler ve baş azıcık seğirir (paraya kilitli)
for i, t in enumerate([3.95, 4.5, 5.1]):
    E_BAK.a(t, *DOOR_FLOOR).a(t + 0.08, DOOR_FLOOR[0] + 0.08 * (1 if i % 2 else -1), DOOR_FLOOR[1] + 0.05, DOOR_FLOOR[2] + 0.04)
E_BAK.a(9.0, *DOOR_FLOOR).a(ws(3, 3) - 0.15, *DOOR_FLOOR)
don(E_BAK, ws(3, 3) - 0.1, DOOR_FLOOR, SOL, 0.35)
E_BAK.a(ve(3) - 0.2, *SOL)
don(E_BAK, ve(3) - 0.1, SOL, DOOR_FLOOR, 0.35)
E_BAK.a(L[4], 0.45, 0.9, 0.45).a(17.7, 0.45, 0.9, 0.45)
# süzme: Elif'i tepeden tırnağa (baştan ayağa, sonra yukarı)
E_BAK.a(18.1, 0.55, -0.1, 0.42).a(18.6, 0.6, -0.15, 0.42).a(19.5, 0.62, 0.85, 0.45).a(19.9, 0.62, 0.9, 0.45).a(20.6, 0.6, -0.1, 0.42)
don(E_BAK, ws(6, 0) - 0.1, [0.6, -0.1, 0.42], KAPI, 0.35)
don(E_BAK, ws(6, 2) - 0.3, KAPI, ELIF_K, 0.3)
E_BAK.a(25.4, *ELIF_K)
don(E_BAK, 31.9, ELIF_K, ELIF_M, 1.2)                # Elif'i Mert'e yürürken izler
E_BAK.a(42.2, -0.7, 0.1, -0.45)
don(E_BAK, 43.85, [-0.7, 0.1, -0.45], [0.45, -0.15, 0.35], 0.35)     # başını öbür yana çevirir
E_BAK.a(44.6, 0.45, -0.15, 0.35).a(44.75, -0.75, 0.05, 0.35).a(45.05, -0.75, 0.05, 0.35)   # yan göz
E_BAK.a(45.2, 0.1, -0.45, 0.12).a(ve(9), 0.1, -0.45, 0.12)                                   # "Şıllık": tavana, Elif'e bakmadan
don(E_BAK, ve(9) + 0.1, [0.1, -0.45, 0.12], ELIF_M, 0.4)
E_BAK.a(L[14], *ELIF_M).a(ws(14, 0) - 0.3, -0.75, 0.0, -0.5)
E_BAK.a(77.2, -0.75, 0.0, -0.5)
don(E_BAK, 77.6, [-0.75, 0.0, -0.5], ELIF_K, 0.7)          # Elif kapıya döner
E_BAK.a(83.4, 0.5, 0.6, 0.4).a(87.0, 0.5, 0.6, 0.4)
don(E_BAK, 87.2, [0.5, 0.6, 0.4], SOL, 0.6)
E_BAK.a(96.8, *SOL).a(97.2, 0.1, 0.05, 0.05).a(98.4, -0.3, -0.1, -0.2).a(98.9, 0.35, -0.05, 0.25)    # karanlıkta arar
E_BAK.a(103.9, 0.4, -0.1, 0.3)
E_BAK.a(107.7, 0.45, -0.1, 0.3).a(108.2, -0.4, -0.35, -0.3).a(109.6, -0.7, -0.75, -0.55)          # tırmanışı izler (sol-yukarı)
E_BAK.a(ws(18, 0) + 0.8, -0.7, -0.7, -0.55)
don(E_BAK, L[19] + 0.3, [-0.7, -0.7, -0.55], [0.7, 0.55, 0.65], 0.6)      # yalvarış: kapı aralığına
E_BAK.a(ws(20, 2), 0.75, 0.3, 0.75)
don(E_BAK, 124.6, [0.75, 0.3, 0.75], [-0.35, 0.5, -0.12], 0.6)            # gözler kola iner
E_BAK.a(127.6, -0.35, 0.5, -0.12)
don(E_BAK, 127.7, [-0.35, 0.5, -0.12], SOL, 0.5)
E_BAK.a(131.8, *SOL).a(132.3, -0.35, 0.5, -0.12).a(132.9, -0.35, 0.5, -0.12).a(133.2, -0.65, 0.05, -0.5)
E_BAK.a(SON, -0.65, 0.05, -0.5)

E_DUY = KF()
for t, d in [(0, "dehset"), (2.9, "saskin"), (4.6, "mutlu"), (L[3], "alayci"), (ws(3, 3), "alayci"), (ve(3) + 0.1, "mutlu"),
             (L[4] - 0.1, "dusunceli"), (17.9, "supheli"), (19.4, "dusunceli"), (ws(6, 0) - 0.15, "saskin"), (ws(6, 2), "alayci"),
             (ws(6, 6), "kararli"), (25.5, "alayci"), (31.9, "supheli"), (34.9, "soguk"), (42.2, "zorGulumse"), (42.9, "soguk"),
             (43.9, "alayci"), (44.7, "soguk"), (L[9], "soguk"), (ve(9) + 0.2, "supheli"), (L[11], "ofkeli"), (58.9, "saskin"), (59.5, "ofkeli"),
             (60.5, "soguk"), (L[14], "supheli"), (ws(14, 0) - 0.25, "korkmus"), (77.6, "saskin"), (80.3, "igrenmis"), (ws(15, 0) - 0.1, "korkmus"),
             (ws(15, 2), "igrenmis"), (87.3, "korkmus"), (96.9, "dehset"), (98.6, "korkmus"), (103.9, "korkmus"), (107.7, "dehset"),
             (L[18], "ofkeli"), (L[19], "saskin"), (L[20], "ofkeli"), (ws(20, 2), "saskin"), (124.4, "korkmus"), (127.8, "dehset"), (131.6, "korkmus")]:
    E_DUY.a(t, d)
E_TILT = KF().a(0, 0).a(2.9, -5).a(4.6, -3).a(ws(3, 3), 6).a(ve(3), -2).a(L[4], 9).a(17.9, 2).a(19.5, -4).a(20.6, 3).a(ws(6, 0), -6).a(ws(6, 6), -9) \
    .a(25.5, 5).a(31.9, 0).a(42.2, 3).a(42.9, -3).a(43.95, 4).a(44.1, -2).a(44.25, 3).a(44.4, -1).a(45.2, -7).a(ve(9), -7).a(L[11], 2).a(ws(11, 6), -6) \
    .a(58.9, 4).a(60.5, 0).a(ws(14, 0), -4).a(77.6, 0).a(83.4, -6).a(87.0, 2).a(97.0, 0).a(104.0, 5).a(108.2, -3).a(109.6, -9).a(L[19] + 0.4, 4) \
    .a(L[20], -5).a(ws(20, 2), 7).a(124.5, 3).a(127.8, -2).a(SON, -2)
E_EGIL = KF().a(0, -3).a(2.9, 2).a(5.0, 4).a(L[4] - 0.3, 3).a(L[4] + 0.15, 6).a(17.7, 6).a(18.1, 0).a(ws(6, 6), -2).a(25.0, 0) \
    .a(L[11] + 0.3, -5).a(ws(11, 7), -8).a(59.0, -3).a(60.5, 0).a(ws(14, 0), -3).a(77.0, 0).a(83.5, 3).a(87.0, 0).a(97.0, 3).a(SON, 2)
E_GOZKIS = KF().a(0, 0, 0).a(17.9, 0, 0).a(18.4, 0.45, 0.4).a(20.6, 0.2, 0.2).a(ws(6, 0), 0, 0).a(31.9, 0.15, 0.15).a(34.9, 0.4, 0.35) \
    .a(42.2, 0.1, 0.1).a(42.9, 0.55, 0.5).a(44.0, 0.3, 0.3).a(45.2, 0.6, 0.55).a(ve(9), 0.6, 0.55).a(L[11], 0.2, 0.2).a(58.9, 0, 0) \
    .a(59.5, 0.3, 0.3).a(L[14], 0.2, 0.2).a(ws(14, 0) - 0.3, 0, 0).a(80.3, 0.3, 0.25).a(83.6, 0, 0)
E_GOZ = KF().a(0, 0)
for t in (6.0, 12.75, 21.6, 30.0, 33.2, 47.8, 58.6, 62.0, 76.8, 87.1, 104.4, 120.9):
    E_GOZ.a(t, 0).a(t + 0.06, 1).a(t + 0.14, 0)
E_GOZ.a(44.55, 0).a(44.6, 0.7).a(44.72, 0)
E_SOK = KF().a(0, 1).a(2.9, 0.35).a(4.6, 0.1).a(5.5, 0).a(ws(6, 0), 0.25).a(ws(6, 2), 0).a(ws(14, 0) - 0.3, 0).a(ws(14, 0) + 0.2, 0.35) \
    .a(77.5, 0.1).a(80.3, 0.35).a(87.0, 0.2).a(97.0, 0.6).a(104.0, 0.55).a(107.7, 0.8).a(L[18], 0.2).a(L[19], 0.3).a(L[20], 0).a(124.4, 0.35) \
    .a(127.8, 0.6).a(SON, 0.7)
E_NEFES = KF().a(0, 3.0).a(3.0, 1.6).a(5.0, 1.1).a(L[11], 1.8).a(59.0, 2.2).a(61.0, 1.2).a(ws(14, 0), 2.0).a(83.4, 2.4).a(97.0, 3.4).a(104.0, 3.6) \
    .a(110.0, 2.4).a(124.4, 3.0).a(127.8, 3.6).a(SON, 3.8)
E_YUTKUN = KF().a(0, 0).a(ws(1, 4), 0).a(ws(1, 4) + 0.55, 1).a(ws(1, 4) + 0.56, 0).a(98.5, 0).a(99.0, 1).a(99.01, 0).a(125.9, 0).a(126.5, 1).a(126.51, 0)
E_TUTL = [[0, None], [L[3] + 0.3, "isaret"], [ws(3, 3) + 0.1, None], [51.8, "isaret"], [59.8, None]]
E_TUTR = [[0, None], [ws(15, 2), "isaret"], [86.9, None]]
ECE = {"id": "ece_sivil", "onKol": True, "dogalKol": True, "yay": 1, "yer": E_YER.s(), "elL": E_EL_L.s(), "elR": E_EL_R.s(),
       "bak": E_BAK.s(), "duygu": E_DUY.s(), "tilt": E_TILT.s(), "egil": E_EGIL.s(), "gozKis": E_GOZKIS.s(), "goz": E_GOZ.s(), "gozSok": E_SOK.s(),
       "nefes": E_NEFES.s(), "yutkun": E_YUTKUN.s(), "sacDagin": 0.6, "tutL": E_TUTL, "tutR": E_TUTR,
       "isaretAci": [[0, 0], [50.0, 0], [51.7, -75], [60.0, -75], [80.0, 125]],
       "tears": 0, "konus": [{"t": R3(L[r] + VF), "cues": M[TAKE[r]]["mouth"]} for r in (3, 4, 6, 9, 11, 14, 15, 18, 20)]}

# ================================================================== MERT
M_YER = KF().a(0, 0, 0, 0).a(17.55, 0, 0, 0).a(17.6, *MP)
MYL, MYR = el(MP, -118, -420), el(MP, 115, -415)
SAAT = el(MP, 60, -575)                      # sağ bileği göğüs önünde (Elif kaldırır)
M_EL_L, M_EL_R = KF().a(0, *MYL), KF().a(0, *MYR)
# P3: "sakın" anı FPS'te; yanda eli yarı kalkık, sonra şok
M_EL_L.a(9.0, *el(MP, -150, -520)).a(12.0, *el(MP, -150, -520)).a(12.6, *MYL)
M_EL_R.a(34.9, *MYR).a(35.4, *SAAT).a(ve(8) + 0.2, *SAAT).a(42.6, *el(MP, 95, -470))
# "Kızlar, lütfen...": iki avuç arayı açar
M_EL_L.a(L[13] - 0.1, *MYL).a(L[13] + 0.3, *el(MP, -190, -600)).a(ve(13), *el(MP, -200, -610)).a(ve(13) + 0.5, *MYL)
M_EL_R.a(L[13] - 0.1, *el(MP, 95, -470)).a(L[13] + 0.35, *el(MP, 200, -600)).a(ve(13), *el(MP, 210, -610)).a(ve(13) + 0.5, *MYR)
# cüzdan: sağ el arka cebe → öne uzatır (boş, mekanik)
CEP = el(MP, 105, -380)
UZAT = el(MP, 175, -560)
M_EL_R.a(93.9, *MYR).a(94.5, *CEP).a(94.8, *CEP).a(95.8, *UZAT).a(96.6, *UZAT).a(97.0, *el(MP, 150, -520))
M_EL_R.a(SON, *el(MP, 100, -430))
M_BAK = KF().a(0, 0.5, 0.2, 0.35).a(9.2, 0.55, 0.3, 0.4).a(18.0, 0.6, 0.1, 0.45).a(ws(6, 2), 0.55, 0.05, 0.4)
don(M_BAK, 27.9, [0.55, 0.05, 0.4], [0.75, 0.15, 0.5], 0.3)
M_BAK.a(32.0, 0.75, 0.15, 0.5)
don(M_BAK, 33.4, [0.75, 0.15, 0.5], [0.45, 0.0, 0.3], 0.4)                  # Elif yaklaşınca ona
M_BAK.a(ws(8, 0) - 0.4, 0.45, 0.0, 0.3).a(ws(8, 0), 0.3, 0.7, 0.2).a(ve(8), 0.35, 0.6, 0.25)      # saate bakar (mahcup)
M_BAK.a(L[13], 0.6, 0.1, 0.45).a(ve(13), 0.35, 0.0, 0.2)
M_BAK.a(68.6, 0.35, 0.0, 0.2).a(70.5, 0.0, 0.1, 0.0)                         # fısıltı: gözler boşalır, baş öne döner
M_BAK.a(SON, 0.0, 0.1, 0.0)
M_DUY = KF()
for t, d in [(0, "korkmus"), (9.0, "korkmus"), (ws(6, 6), "sok"), (30.0, "saskin"), (33.5, "mahcup"), (L[8], "mahcup"), (42.2, "utangac"),
             (L[13], "korkmus"), (ve(13) + 0.4, "saskin"), (68.7, "notr")]:
    M_DUY.a(t, d)
M_BOS = KF().a(0, 0).a(69.0, 0).a(70.4, 1).a(SON, 1)
M_SOK = KF().a(0, 0.2).a(ws(6, 6), 0.2).a(ws(6, 6) + 0.25, 0.5).a(31.0, 0.1).a(34.0, 0)
M_GOZ = KF().a(0, 0)
for t in (10.4, 19.6, 31.3, 41.0, 49.5, 63.0):
    M_GOZ.a(t, 0).a(t + 0.06, 1).a(t + 0.14, 0)
M_GOZ.a(69.6, 0).a(69.8, 0.55).a(70.6, 0.18)                                  # kapaklar ağırlaşır, bir daha kırpmaz
M_TILT = KF().a(0, -2).a(ws(6, 6), 3).a(30.0, 0).a(L[8], -6).a(ve(8), -3).a(L[13], 3).a(68.6, 4).a(69.2, 9).a(70.5, 2).a(SON, 2)
M_YUTKUN = KF().a(0, 0).a(L[8] + 0.2, 0).a(L[8] + 0.8, 1).a(L[8] + 0.81, 0).a(33.6, 0).a(34.1, 1).a(34.11, 0)
MERT = {"id": "mert724", "onKol": True, "dogalKol": True, "yay": 1, "yer": M_YER.s(), "elL": M_EL_L.s(), "elR": M_EL_R.s(), "bak": M_BAK.s(),
        "duygu": M_DUY.s(), "bosGoz": M_BOS.s(), "gozSok": M_SOK.s(), "goz": M_GOZ.s(), "tilt": M_TILT.s(), "yutkun": M_YUTKUN.s(),
        "solgun": [[0, 0], [69.5, 0], [71.0, 0.55]], "kirpmaz": [[70.6, 999]],
        "tutR": [[0, None], [35.3, "kolSaati"], [42.6, None], [95.0, "cuzdan"], [96.5, None]],
        "konus": [{"t": R3(L[r] + VF), "cues": M[TAKE[r]]["mouth"]} for r in (8, 13)]}

# ================================================================== ELİF
EL_YER = KF().a(0, 0, 0, 0).a(17.55, 0, 0, 0).a(17.6, *ELK)      # P3: kapı dibine geldi (FPS'ten sonra)
# P4 başı: paraları bırakır, kalçaları salınarak Mert'e yürür (Ece'nin önünden)
EL_YER.a(32.6, *ELK)
yuru0, yuru1 = 32.6, 34.6
for i in range(1, 9):
    u = i / 8
    q = [ELK[j] + (ELM[j] - ELK[j]) * u for j in range(3)]
    EL_YER.a(yuru0 + (yuru1 - yuru0) * u, round(q[0], 1), round(q[1] - 10 * abs(math.sin(u * math.pi * 4)), 1), round(q[2], 1))
EL_YER.a(68.4, *ELM).a(68.9, ELM[0] - 22, ELM[1] - 6, ELM[2])          # kulağa (parmak ucunda)
EL_YER.a(71.6, ELM[0] - 22, ELM[1] - 6, ELM[2]).a(72.2, *ELM)
# P5: kapıya, paraların başına döner
for i in range(1, 7):
    u = i / 6
    q = [ELM[j] + (ELK[j] - ELM[j]) * u for j in range(3)]
    EL_YER.a(77.2 + 2.0 * u, round(q[0], 1), round(q[1] - 8 * abs(math.sin(u * math.pi * 3)), 1), round(q[2], 1))
EL_YER.a(88.7, *ELK).a(88.75, 0, 0, 0).a(93.4, 0, 0, 0).a(93.45, *ELM)    # FPS'te sürünür; Mert'in yanında doğrulmuş
EL_YER.a(98.75, *ELM).a(98.8, 0, 0, 0).a(104.75, 0, 0, 0).a(104.8, *ELE)  # karanlıkta kaybolur; P6: Ece'nin dibinde
EL_YER.a(107.75, *ELE).a(107.8, 0, 0, 0).a(110.35, 0, 0, 0).a(110.4, *ELU).a(124.3, *ELU).a(124.35, 0, 0, 0).a(127.35, 0, 0, 0).a(127.4, *ELA).a(SON, *ELA)
EL_EL_L, EL_EL_R = KF(), KF()
EYL, EYR = el(ELK, -112, -430), el(ELK, 108, -420)
YELP = el(ELK, -40, -600)                      # yelpaze: göğüs önünde
EL_EL_L.a(0, *EYL).a(17.6, *el(ELK, -70, -420)).a(18.4, *YELP).a(25.2, *YELP).a(26.0, *el(ELK, -60, -500))
EL_EL_R.a(0, *EYR).a(17.6, *el(ELK, 40, -520))
# para sayma: sağ el başparmağı yelpazeye dokunur (ritim)
for i in range(11):
    t = 18.6 + i * 0.6
    EL_EL_R.a(t, *el(ELK, -10, -610)).a(t + 0.3, *el(ELK, 10, -640))
EL_EL_R.a(25.0, *el(ELK, 10, -640)).a(25.6, *el(ELK, 80, -480))
# P4: paraları bırakır (el açılır, aşağı), yürür; Mert'in bileğini tutar
EL_EL_L.a(31.9, *el(ELK, -60, -500)).a(32.2, *el(ELK, -130, -520)).a(32.6, *el(ELK, -112, -440))
EL_EL_R.a(32.6, *el(ELK, 108, -440))
WR = [SAAT[0] + 14, SAAT[1] + 10]
EL_EL_L.a(34.6, *el(ELM, -112, -440)).a(35.3, *WR).a(ve(8), *WR).a(42.6, *el(ELM, -100, -470)).a(43.0, *el(ELM, -105, -440))
EL_EL_R.a(34.6, *el(ELM, 108, -440)).a(35.1, *el(ELM, 60, -600))           # öbür el saat camına dokunur
for i in range(4):
    t = 35.6 + i * 0.6
    EL_EL_R.a(t, *el(ELM, 10, -590)).a(t + 0.3, *el(ELM, 25, -580))
EL_EL_R.a(ve(7), *el(ELM, 30, -590)).a(ve(7) + 0.5, *el(ELM, 95, -470))
# "Asgari ücretli...": saçını omzundan atar (sağ el başına)
EL_EL_R.a(ws(10, 4) - 0.2, *el(ELM, 95, -470)).a(ws(10, 4) + 0.2, *el(ELM, 95, -840)).a(ws(10, 4) + 0.55, *el(ELM, 130, -760)).a(ve(10) + 0.2, *el(ELM, 95, -470))
# fısıltı: sol el Mert'in omzunda
EL_EL_L.a(68.3, *el(ELM, -105, -440)).a(68.9, *el(MP, 70, -650)).a(72.0, *el(MP, 70, -650)).a(72.5, *el(ELM, -105, -440))
# P5: kapı dibinde: avuç avuç para → ağız
AGIZ = el(ELK, 0, -700)
EL_EL_L.a(79.2, *el(ELK, -112, -430)).a(79.7, *el(ELK, -60, -300)).a(80.0, *el(ELK, -60, -300)).a(80.5, *el(ELK, -20, -690))
EL_EL_R.a(79.2, *el(ELK, 108, -420)).a(79.8, *el(ELK, 60, -300)).a(80.1, *el(ELK, 60, -300)).a(80.6, *el(ELK, 30, -660))
for i in range(4):
    t = 80.8 + i * 0.7
    EL_EL_L.a(t, *el(ELK, -20, -690)).a(t + 0.35, *el(ELK, -12, -705))
EL_EL_L.a(83.6, *el(ELK, -20, -690)).a(84.4, *el(ELK, -70, -560))
EL_EL_R.a(83.6, *el(ELK, 30, -660)).a(84.4, *el(ELK, 70, -540))
EL_EL_L.a(87.2, *el(ELK, -70, -560)).a(87.8, *el(ELK, -112, -430))
EL_EL_R.a(87.0, *el(ELK, 70, -540)).a(87.5, *el(ELK, 20, -705)).a(88.0, *el(ELK, 108, -420))   # parmak ucunu yalar
# cüzdan: Mert uzatır, Elif sağ eliyle alır
EL_EL_R.a(93.45, *el(ELM, 108, -420)).a(96.0, *el(ELM, 108, -420)).a(96.4, UZAT[0] + 8, UZAT[1] + 4).a(96.6, UZAT[0] + 8, UZAT[1] + 4).a(97.1, *el(ELM, 60, -620))
EL_EL_L.a(93.45, *el(ELM, -105, -440))
# P6: kartı ısırır (sağ el ağzında), sol el (altın tırnaklar) kalkar
EL_EL_R.a(104.8, *el(ELE, 20, -690)).a(106.2, *el(ELE, 20, -690)).a(106.5, *el(ELE, 40, -660))
EL_EL_L.a(104.8, *el(ELE, -112, -430)).a(106.2, *el(ELE, -112, -430)).a(106.9, *el(ELE, -90, -720)).a(107.7, *el(ELE, -95, -735))
# tepede: eller dolabın kenarını tutar (pençe)
EL_EL_L.a(110.4, *el(ELU, -130, -420)).a(124.3, *el(ELU, -130, -420))
EL_EL_R.a(110.4, *el(ELU, 20, -690))
for i in range(6):
    t = 112.0 + i * 1.6
    EL_EL_R.a(t, *el(ELU, 20, -690)).a(t + 0.4, *el(ELU, 40, -660))
EL_EL_R.a(124.3, *el(ELU, 120, -420))
# son: Mert'in arkasında; sağ el (altın tırnak) göğsünde, sol el omzunda
EL_EL_R.a(127.4, *el(MP, -10, -560)).a(SON, *el(MP, 10, -555))
EL_EL_L.a(127.4, *el(MP, -95, -680)).a(SON, *el(MP, -95, -680))
EL_BAK = KF().a(0, 0.0, 0.6, 0.0).a(17.6, -0.15, 0.8, -0.1).a(ws(6, 2), -0.15, 0.8, -0.1)
don(EL_BAK, ws(6, 7), [-0.15, 0.8, -0.1], [-0.55, -0.25, -0.35], 0.9)          # "iki yüz": yavaşça Ece'ye (yukarı)
EL_BAK.a(29.6, -0.55, -0.25, -0.35)
don(EL_BAK, 30.0, [-0.55, -0.25, -0.35], [-0.75, -0.05, -0.55], 0.9)           # gözleri Mert'e kayar
EL_BAK.a(34.8, -0.55, 0.05, -0.4).a(35.4, -0.25, 0.7, -0.3).a(ws(7, 4) - 0.2, -0.25, 0.7, -0.3).a(ws(7, 4), -0.6, -0.15, -0.45)    # saate, sonra gözlerine
EL_BAK.a(L[10], -0.25, 0.6, -0.3).a(ws(10, 4) - 0.3, -0.25, 0.6, -0.3)
don(EL_BAK, ws(10, 4) - 0.2, [-0.25, 0.6, -0.3], [0.7, -0.05, 0.4], 0.45)      # "tatlım": omzunun üstünden Ece'ye
EL_BAK.a(L[12], 0.7, -0.05, 0.4).a(ve(12) + 0.6, 0.7, -0.05, 0.4)
don(EL_BAK, 61.0, [0.7, -0.05, 0.4], [-0.6, -0.1, -0.5], 0.6)
EL_BAK.a(77.0, -0.6, -0.1, -0.5)
don(EL_BAK, 77.2, [-0.6, -0.1, -0.5], [0.1, 0.85, 0.05], 0.4)                  # paralara
EL_BAK.a(80.4, 0.0, 0.1, 0.0).a(86.6, 0.0, 0.1, 0.0)
don(EL_BAK, 87.6, [0.0, 0.1, 0.0], [-0.75, -0.1, -0.55], 0.9)                 # yutar, gözleri Mert'e (kırpmadan)
EL_BAK.a(93.45, -0.5, -0.15, -0.35).a(96.0, 0.3, 0.6, 0.2).a(97.2, -0.5, -0.15, -0.35)
EL_BAK.a(104.8, -0.4, -0.05, -0.3).a(107.0, -0.35, -0.1, -0.3)
EL_BAK.a(110.4, 0.6, 0.5, 0.45).a(124.3, 0.6, 0.5, 0.45).a(127.4, 0.55, 0.05, 0.4).a(SON, 0.55, 0.05, 0.4)
EL_DUY = KF()
for t, d in [(0, "mutlu"), (18.4, "mutlu"), (ws(6, 2), "saskin"), (ws(6, 7), "soguk"), (27.0, "ofkeli"), (30.2, "alayci"), (34.6, "mutlu"),
             (ws(7, 4), "alayci"), (L[10], "soguk"), (ws(10, 4), "alayci"), (L[12], "gulen"), (ws(12, 0), "alayci"), (61.0, "alayci"),
             (68.4, "mutlu"), (77.2, "mutlu"), (80.4, "gulen"), (83.6, "mutlu"), (87.6, "alayci"), (93.45, "sahteGulus"), (97.2, "alayci"),
             (104.8, "gulen"), (107.0, "sahteGulus"), (110.4, "gulen"), (127.4, "sahteGulus")]:
    EL_DUY.a(t, d)
EL_TILT = KF().a(0, 4).a(18.4, 6).a(ws(6, 7), -3).a(30.2, 8).a(34.6, 10).a(35.3, 6)
for i in range(5):                                         # C_07 kıkırtı: omuz/baş kıpırtısı
    t = L[7] + 0.15 + i * 0.13
    EL_TILT.a(t, 10).a(t + 0.065, 6)
EL_TILT.a(ws(7, 4), 12).a(L[10], 3).a(ws(10, 4), 14).a(ve(10), 8).a(L[12], 6)
for i in range(6):                                         # C_12 alaycı gülüş
    t = L[12] + 0.05 + i * 0.12
    EL_TILT.a(t, 9).a(t + 0.06, 5)
EL_TILT.a(ws(12, 0), 6).a(68.4, 4).a(68.9, -12).a(71.6, -12).a(72.2, 4).a(80.4, 2).a(86.6, -6).a(87.6, 10).a(93.45, 6).a(104.8, -4).a(106.0, 8) \
    .a(110.4, 16).a(124.3, 16).a(127.4, -10).a(SON, -12)
EL_EZIL = KF().a(0, 0)
for i in range(5):
    t = L[7] + 0.15 + i * 0.13
    EL_EZIL.a(t, 0).a(t + 0.065, 0.025)
for i in range(6):
    t = L[12] + 0.05 + i * 0.12
    EL_EZIL.a(t, 0).a(t + 0.06, 0.02)
EL_EZIL.a(L[12] + 0.85, 0)
EL_EGIL = KF().a(0, 0).a(17.6, 6).a(25.0, 2).a(26.0, 0).a(34.6, -3).a(68.4, -3).a(68.9, -9).a(71.6, -9).a(72.2, -2).a(79.2, 0).a(79.7, 8).a(80.2, 3).a(SON, 0)
EL_GOZ = KF().a(0, 0)
for t in (19.2, 24.2, 37.3, 50.4):
    EL_GOZ.a(t, 0).a(t + 0.06, 1).a(t + 0.14, 0)
EL_GOZ.a(L[7] + 0.2, 0).a(L[7] + 0.3, 0.5).a(L[7] + 0.8, 0.5).a(L[7] + 0.9, 0)       # kıkırdarken gözler kısılır
EL_GOZ.a(80.6, 0).a(80.8, 0.85).a(83.2, 0.85).a(83.5, 0)                                 # zevkle çiğner: gözler kapalı
EL_GOZKIS = KF().a(0, 0, 0).a(ws(6, 7), 0.45, 0.45).a(29.6, 0.2, 0.2).a(30.4, 0.35, 0.3).a(L[10], 0.5, 0.5).a(ws(10, 4), 0.35, 0.35).a(L[12], 0.4, 0.4) \
    .a(77.2, 0.1, 0.1).a(93.45, 0, 0).a(SON, 0, 0)
# ipucu 1: "maaşın"dan sonra gülümseme iki kare kulaklarına uzar
t_sirit = R3(we(12, 3) + 0.25)
EL_SIRIT = [[0, 0], [R3(t_sirit - 0.001), 0], [t_sirit, 1], [R3(t_sirit + 2 / KARE), 1], [R3(t_sirit + 2 / KARE + 0.001), 0],
            [106.4, 0], [106.401, 0.8], [106.5, 0.8], [106.501, 0]]
EL_CIGNE = [[80.6, 83.6], [86.6, 87.4], [105.5, 107.7], [110.4, 111.6], [113.0, 115.2], [119.5, 121.0]]
EL_YANAK = KF().a(0, 0).a(80.6, 0).a(80.9, 0.9).a(83.3, 0.85).a(83.6, 0.4).a(86.6, 0.4).a(87.3, 0).a(105.5, 0).a(105.8, 0.5).a(107.7, 0.4) \
    .a(110.4, 0.35).a(111.6, 0.2).a(113.0, 0.3).a(115.2, 0.2).a(119.5, 0.3).a(121.0, 0)
EL_AGIZP = KF().a(0, 0).a(80.5, 0).a(80.7, 1).a(82.0, 0.6).a(83.1, 0.2).a(83.3, 0)
EL_YUTKUN = KF().a(0, 0).a(86.9, 0).a(87.45, 1).a(87.46, 0).a(83.25, 0).a(83.6, 1).a(83.61, 0)
EL_TUTL = [[0, None], [18.2, "paraYelpaze"], [32.15, None], [79.9, "para200"], [83.0, None], [106.8, "pence"], [107.8, None], [110.4, "pence"],
           [124.35, None], [127.4, "pence"]]
EL_TUTR = [[0, None], [79.9, "para200"], [82.6, None], [97.0, "cuzdan"], [98.8, None], [104.8, "kart"], [105.6, "kartKirik"],
           [107.8, None], [110.4, "kartKirik"], [124.35, None], [127.4, "pence"]]
ELIF = {"id": "kacan724", "onKol": True, "dogalKol": True, "yay": 1, "sacDagin": 0.35, "yer": EL_YER.s(), "elL": EL_EL_L.s(), "elR": EL_EL_R.s(),
        "bak": EL_BAK.s(), "duygu": EL_DUY.s(), "tilt": EL_TILT.s(), "ezil": EL_EZIL.s(), "egil": EL_EGIL.s(), "goz": EL_GOZ.s(), "gozKis": EL_GOZKIS.s(),
        "sirit": EL_SIRIT, "cigneAra": EL_CIGNE, "yanak": EL_YANAK.s(), "agizPara": EL_AGIZP.s(), "yutkun": sorted(EL_YUTKUN, key=lambda k: k[0]),
        "tutL": EL_TUTL, "tutR": EL_TUTR, "kirpmaz": [[86.6, 999]], "parmakUcu": [[0, 0], [68.4, 0], [68.9, 22], [71.6, 22], [72.2, 0]],
        "yerOtur": [[0, 0], [110.39, 0], [110.4, 1], [124.3, 1], [124.31, 0]],
        "konus": [{"t": R3(L[r] + VF), "cues": M[TAKE[r]]["mouth"]} for r in (7, 10, 12, 16, 21)],
        "agzi": [[68.95, 71.4]]}

# ================================================================== banknotlar
# yan: kapı altından kayan notlar [tÇıkış, X, Z, açı, tAlınma]
NOT_T = [-0.35, 0.15, 0.62, 1.1, 1.6, 2.15, 2.7, 3.3, 3.95, 4.5, 5.1, ws(5, 2) - 0.1]
YAN_NOT = []
for i, t in enumerate(NOT_T):
    X = 1.15 + ((i * 0.37) % 0.75)
    Z = 1.58 - 0.07 * (i % 3) - 0.03 * (i % 4)
    al = 17.45 + 0.05 * i if i % 3 != 2 else 79.75 + 0.06 * (i % 5)       # üçte ikisini P3'te Elif toplar; kalanları P5'te yer
    YAN_NOT.append([R3(t), round(X, 3), round(Z, 3), (i * 47) % 70 - 35, R3(al)])
# kapı altı yakın: aynı notlar, yakın plan koordinatında (x m, z m)
PARA_NOT = []
for i, t in enumerate(NOT_T):
    x = -0.34 + ((i * 0.29) % 0.7)
    z = 0.42 + 0.1 * ((i * 3) % 5) / 4
    al = 17.4 + 0.04 * i if i % 3 != 2 else 79.75
    PARA_NOT.append([R3(t), round(x, 3), round(z, 3), (i * 53) % 80 - 40, R3(al)])
# Elif'in eli (para görünümü): soldan girer, süpürür
PARA_EL = [[16.6, -1.2, 0.5, 0], [16.65, -1.2, 0.5, 1], [17.15, -0.3, 0.48, 1], [17.4, 0.25, 0.52, 1], [17.6, -0.9, 0.5, 1], [17.65, -1.4, 0.5, 0]]
# P4 başı: Elif yelpazeyi bırakır: süzülerek düşen notlar (ekran), yerde kalır, P5'te yenir
EYP = el(ELK, -60, -560)
DUSEN = [[R3(32.15 + 0.07 * i), round(EYP[0] - 30 + 22 * i, 1), round(EYP[1] + 10 * (i % 3), 1), round(ELK[1] - 6 - 12 * (i % 3), 1), 0.42, 79.9]
         for i in range(6)]

# ================================================================== kapı altı: ışık + yaratığın ayak gölgeleri (konuşma ritmiyle)
GX, GW = P2.GX, P2.GW
KA = [[0, 0.9, GX, GW, -1, 0, 1]]


def ayak_ritim(r, gx=GX, gw=GW, op=1.0, gen=0.012):
    v0 = L[r] + VF
    cues = M[TAKE[r]]["mouth"]
    for i in range(int((D[r] + 0.2) * 15)):
        t = v0 + i / 15
        v = "X"
        for c in cues:
            if v0 + c["t"] <= t:
                v = c["v"]
        a = 0 if v == "X" else 1
        KA.append([R3(t), 0.9, round(gx + gen * a * math.sin(i * 1.7), 4), round(gw + 0.018 * a, 4), -1, 0, op])


ayak_ritim(1)
KA += [[R3(ve(1) + 0.3), 0.9, GX, GW, -1, 0, 1], [R3(L[4] + 0.3), 0.9, GX, GW, -1, 0, 1], [R3(L[4] + 0.9), 0.9, 0.62, 0.26, -1, 0, 1]]   # "Kaç para?" yaratık eğilir
ayak_ritim(5, 0.62, 0.26)
KA += [[R3(ve(5) + 0.5), 0.9, 0.66, 0.22, -1, 0, 1], [97.0, 0.9, 0.66, 0.22, -1, 0, 1]]
for i in range(10):                                         # ışık titrerken kapı altı da titrer
    KA.append([R3(97.0 + i * 0.16), 0.3 if i % 2 else 0.95, 0.66, 0.22, -1, 0, 1])
KA += [[99.0, 0.85, 0.66, 0.22, -1, 0, 1], [L[19] - 0.4, 0.85, 0.66, 0.22, -1, 0, 1], [L[19] + 0.2, 0.75, 0.55, 0.14, -1, 0, 0.9]]  # diz çöker gibi alçalır
ayak_ritim(19, 0.55, 0.14, 0.9, 0.006)
KA += [[R3(ve(19) + 0.4), 0.7, 0.55, 0.14, -1, 0, 0.9], [SON, 0.7, 0.55, 0.14, -1, 0, 0.9]]
KA.sort(key=lambda k: k[0])

# ================================================================== ışık
FLOR = KF().a(0, 0.85).a(62.6, 0.85).a(63.0, 0.7).a(72.0, 0.7).a(73.0, 0.85).a(96.9, 0.85)
for i, (dt, v) in enumerate([(0.0, 0.85), (0.12, 0.25), (0.22, 0.9), (0.5, 0.3), (0.58, 0.8), (1.1, 0.15), (1.2, 0.85), (1.62, 0.05), (1.75, 0.6), (1.9, 0.02), (2.4, 0.02), (2.55, 0.8)]):
    FLOR.a(97.0 + dt, v)
FLOR.a(103.9, 0.62).a(104.8, 0.7).a(107.6, 0.7).a(108.0, 0.6).a(124.3, 0.6).a(127.4, 0.55).a(SON, 0.5)
KARART = KF().a(0, 0).a(98.55, 0).a(98.6, 0.85).a(98.75, 0.2).a(98.85, 0.95).a(99.45, 0.95).a(99.5, 0).a(SON - 0.01, 0).a(SON, 1)
CIZIR = [[96.9, 99.5], [103.9, 104.8], [119.0, 119.6]]
SARS = KF().a(0, 0).a(105.55, 0).a(105.6, 0.35).a(105.8, 0)
ORUMCEK = KF().a(0, 1.5, 0.9, 0, 1).a(107.75, 1.5, 0.9, 0, 1).a(107.8, 1.45, 0.95, 0.9, 1.4).a(108.5, 0.9, 1.25, 0.9, 1.4).a(109.3, 0.15, 1.7, 0.9, 1.6) \
    .a(110.0, -0.3, 2.0, 0.85, 0.6).a(110.35, -0.4, 2.1, 0, 0.1)

# ================================================================== kamera (yan + yakınlar) ve kurgu
VIEWS = ("yan", "para", "sise", "golge", "saat")
for v in VIEWS:
    P1.SINIR[v] = (0, 1080, 0, 1920)
CAM = {v: [] for v in VIEWS}
KURGU = []


def kes(t, v, cx, cy, z):
    k = CAM[v]
    if k:
        k.append([R3(t - 0.004)] + k[-1][1:])
    k.append([R3(t)] + P1.kirp(v, cx, cy, z))
    KURGU.append([R3(t), v])


def it(t, v, cx, cy, z):
    CAM[v].append([R3(t)] + P1.kirp(v, cx, cy, z))


EMCU = lambda q=EK, z=2.55: (q[0] + 15, fy(q) + 165, z)
ECU = lambda q=EK, z=3.35: (q[0] + 5, fy(q) + 95, z)
fM, fL = fy(MP), fy(ELK)
# --- P3
kes(0, "para", 540, 1010, 1.0); it(3.0, "para", 540, 1030, 1.12)
kes(3.0, "yan", EK[0] + 40, fy(EK) + 330, 1.95); it(5.9, "yan", EK[0] + 45, fy(EK) + 300, 2.15)           # Ece + yerdeki paralar
kes(8.9, "yan", *EMCU()); it(13.2, "yan", EK[0] + 18, fy(EK) + 150, 2.75)
kes(13.2, "yan", EK[0] + 40, fy(EK) + 120, 3.1); it(15.2, "yan", EK[0] + 45, fy(EK) + 110, 3.3)           # eğilir: "Kaç para?"
kes(15.2, "para", 540, 1030, 1.15); it(17.6, "para", 540, 1040, 1.3)
kes(17.6, "yan", 690, 1090, 1.45); it(18.6, "yan", 695, 1085, 1.5)
kes(18.6, "yan", (EK[0] + ELK[0]) / 2, fy(EK) + 250, 2.2); it(21.0, "yan", (EK[0] + ELK[0]) / 2, fy(EK) + 235, 2.35)                                       # 3'lü: Elif paralarla
kes(21.0, "yan", EK[0] + 50, fy(EK) + 200, 2.2); it(24.9, "yan", EK[0] + 60, fy(EK) + 190, 2.4)
kes(24.9, "yan", ELK[0] - 5, fL + 140, 3.0); it(27.6, "yan", ELK[0] - 5, fL + 110, 3.4)                   # Elif bozulur
kes(27.6, "yan", MP[0] + 10, fM + 120, 3.0); it(29.6, "yan", MP[0] + 10, fM + 110, 3.25)                   # Mert şok
kes(29.6, "yan", 690, 1085, 1.6); it(31.8, "yan", 680, 1080, 1.7)
# --- P4
kes(31.8, "yan", ELK[0] - 60, fL + 330, 1.9); it(34.6, "yan", (ELM[0] + MP[0]) / 2 + 20, fM + 300, 2.0)    # kaydır: Elif'le Mert'e
kes(34.6, "yan", (ELM[0] + MP[0]) / 2 + 10, fM + 190, 2.6); it(38.7, "yan", (ELM[0] + MP[0]) / 2 + 5, fM + 180, 2.8)
kes(38.7, "yan", MP[0] + 20, fM + 115, 3.2); it(42.1, "yan", MP[0] + 20, fM + 110, 3.35)
kes(42.1, "yan", *EMCU(EK, 2.6)); it(45.1, "yan", EK[0] + 10, fy(EK) + 120, 3.1)                          # kıskançlık: yavaş itiş
kes(45.1, "yan", *ECU(EK, 3.5)); it(47.3, "yan", EK[0] + 5, fy(EK) + 95, 3.65)
kes(47.3, "yan", ELM[0] + 30, fy(ELM) + 150, 2.9); it(51.3, "yan", ELM[0] + 30, fy(ELM) + 140, 3.05)
kes(51.3, "yan", EA[0] - 40, fy(EA) + 200, 2.4); it(55.1, "yan", EA[0] - 40, fy(EA) + 190, 2.55)
kes(55.1, "yan", ELM[0] + 10, fy(ELM) + 100, 3.35); it(58.8, "yan", ELM[0] + 10, fy(ELM) + 95, 3.55)
kes(58.8, "yan", *ECU(EA, 3.4)); it(60.2, "yan", EA[0] + 5, fy(EA) + 95, 3.5)
kes(60.2, "yan", 640, 1080, 1.55); it(62.6, "yan", 640, 1080, 1.62)
kes(62.6, "sise", 540, 960, 1.0); it(65.5, "sise", 520, 1000, 1.08)
kes(65.5, "golge", 560, 900, 1.0); it(68.4, "golge", 560, 980, 1.12)
kes(68.4, "yan", (ELM[0] + MP[0]) / 2, fM + 160, 2.9); it(71.5, "yan", (ELM[0] + MP[0]) / 2 - 5, fM + 120, 3.3)
kes(71.5, "yan", MP[0] + 5, fM + 75, 4.0); it(73.5, "yan", MP[0] + 5, fM + 70, 4.6)                        # Mert'in boş gözleri
kes(73.5, "yan", *ECU(EK, 3.2)); it(77.0, "yan", EK[0] + 5, fy(EK) + 90, 3.6)
# --- P5
kes(77.0, "yan", 690, 1120, 1.5); it(80.0, "yan", ELK[0] - 30, fL + 220, 2.1)
kes(80.0, "yan", ELK[0] + 5, fL + 70, 3.7); it(83.4, "yan", ELK[0] + 5, fL + 65, 4.1)                      # yiyor (yakın)
kes(83.4, "yan", *EMCU(EK, 2.7)); it(86.6, "yan", EK[0] + 15, fy(EK) + 150, 2.95)
kes(86.6, "yan", ELK[0] + 5, fL + 75, 3.9); it(88.8, "yan", ELK[0] + 5, fL + 70, 4.2)
kes(93.5, "yan", (ELM[0] + MP[0]) / 2, fM + 260, 2.2); it(96.95, "yan", (ELM[0] + MP[0]) / 2 + 10, fM + 250, 2.35)
kes(96.95, "yan", *ECU(EK, 3.2)); it(98.55, "yan", EK[0] + 5, fy(EK) + 95, 3.4)
kes(98.55, "yan", 650, 1080, 1.4); it(99.5, "yan", 650, 1080, 1.42)
kes(103.9, "yan", *ECU(EK, 3.6)); it(104.8, "yan", EK[0] + 5, fy(EK) + 90, 3.8)
# --- P6
kes(104.8, "yan", ELE[0] + 5, fy(ELE) + 70, 3.8); it(107.6, "yan", ELE[0] + 5, fy(ELE) + 65, 4.0)          # kart ısırığı
kes(107.6, "yan", 560, 1060, 1.2); it(110.35, "yan", 470, 900, 1.25)                                         # tırmanış: yukarı-sola kaydır
kes(110.4, "yan", ELU[0] + 40, fy(ELU) + 260, 2.0); it(112.0, "yan", ELU[0] + 40, fy(ELU) + 250, 2.1)      # tepede (alt açı)
kes(112.0, "yan", *EMCU(EK, 2.6)); it(116.8, "yan", EK[0] + 15, fy(EK) + 150, 2.9)
kes(116.8, "para", 540, 1040, 1.2); it(121.2, "para", 540, 1060, 1.45)                                       # yalvaran ses: kapı altı
kes(121.2, "yan", *EMCU(EK, 2.7)); it(124.3, "yan", EK[0] + 10, fy(EK) + 160, 2.85)
kes(124.3, "yan", YAN_KOL[0] + 60, YAN_KOL[1] - 120, 3.2); it(127.4, "yan", YAN_KOL[0] + 50, YAN_KOL[1] - 110, 3.7)   # el kolda
kes(127.4, "yan", (MP[0] + EK[0]) / 2, fM + 260, 1.9); it(131.6, "yan", (MP[0] + EK[0]) / 2 - 20, fM + 210, 2.2)
kes(131.6, "yan", EK[0] + 5, fy(EK) + 70, 4.2); it(133.6, "yan", EK[0] + 5, fy(EK) + 65, 4.6)
kes(133.6, "saat", 540, 900, 1.0); it(SON, "saat", 540, 900, 1.12)

ORTAK = {"saat": [[0, "02:51"], [40, "02:53"], [80, "02:56"], [120, "02:58"], [130, "02:59"]], "duvarSaat": [[0, "02:59"]],
         "kapi": [[0, 0]], "flor": FLOR.s(), "cizir": CIZIR, "lamba": [[0, 0]], "titre": {"yan": 1.0, "para": 0.6, "sise": 0.5, "golge": 0.4, "saat": 0.3},
         "eceArkada": True, "depo": [[0, 0]], "depoKol": [[0, 0], [125.5, 0], [126.4, 0.12], [132.6, 0.12], [133.3, 0.22]], "toz": [[0, 0]],
         "sars": SARS.s(), "anime": {}, "animeMerkez": {}, "levha": [[0, 0]], "levhaDy": [[0, 2.2]], "kanatTit": [[0, 0]],
         "kapiAltBas": 0.6, "kapiAlt": KA, "ayakkabi": [[0, 1.63, 1.69, 79, 0]], "ayakkabiIz": [1.68, 1.9],
         "tvYayin": {"jen": -300, "sp": -200, "kapat": -100}, "karart": KARART.s(),
         "yanPara": YAN_NOT, "paraYakin": PARA_NOT, "paraEl": PARA_EL, "dusen": DUSEN, "orumcek": ORUMCEK.s(),
         "siseOdak": [[62.6, 0], [63.6, 0], [64.5, 1]], "golgeTuhaf": [[65.5, 0.15], [66.2, 0.2], [68.4, 1.0]],
         "kadinOnde": [[31.9, 34.7]], "kadinArka": [[127.0, 999]],
         "kurgu": KURGU, "cam": CAM, "kar": {"yan": {"ece": ECE, "mert": MERT, "kadin": ELIF}}}

# ================================================================== FPS (Ece'nin gözünden)
MZ, KZ = P2.MZ, P2.KZ


def ayna(q):
    for a, b in (("elL3", "elR3"), ("tutL", "tutR")):
        q[a], q[b] = q.get(b), q.get(a)
        if q[a] is None:
            q.pop(a)
        if q[b] is None:
            q.pop(b)
    q["bak"] = [[k[0], -k[1], k[2], -k[3]] for k in q["bak"]]
    return q


cL = [0.02, 1.6, -1.28]
# F1: Mert ayakta, kız yerde (P2'den): Mert "sakın" der, eli Ece'ye uzanır; kız paraya döner, gömleği bırakır
f1a, f1b = F1
mert1 = {"id": "mert724", "w": [-0.42, -0.55, MZ], "boy": 1.75,
         "q": ayna({"onKol": True, "dogalKol": True, "yay": 1, "duygu": [[0, "korkmus"], [L[2], "korkmus"]],
                    "bak": [[0, 0.2, -0.55, 0.15], [f1a + 0.4, 0.05, -0.35, 0.05], [ve(2), 0.0, -0.3, 0.02]],
                    "tilt": [[0, -3], [L[2], 4]], "elR3": [[0, -0.05, 0.62, MZ + 0.3], [f1a + 0.2, -0.05, 0.62, MZ + 0.3], [f1a + 0.7, 0.05, 0.75, MZ + 0.15],
                                                            [L[2] + 0.2, 0.0, 1.05, MZ + 0.6], [ve(2) + 0.2, 0.0, 1.08, MZ + 0.62]],
                    "elL3": [[0, -0.55, 0.5, MZ + 0.15]], "gozSok": [[0, 0.4], [L[2], 0.15]], "nefes": [[0, 2.6]],
                    "konus": [{"t": R3(L[2] + VF), "cues": M[TAKE[2]]["mouth"]}]})}
kiz1 = {"id": "kacan724", "w": [-0.04, -0.74, KZ], "boy": 1.65, "bacak3": P2.kizB["bacak3"],
        "q": ayna({"onKol": True, "dogalKol": True, "yay": 1, "sacDagin": 0.5, "duygu": [[0, "korkmus"], [f1a + 0.9, "saskin"], [f1a + 1.6, "mutlu"]],
                   "bak": [[0, -0.1, -0.6, -0.08], [f1a + 0.7, -0.1, -0.6, -0.08], [f1a + 0.85, 0.15, 0.55, 0.1], [f1a + 1.3, 0.2, 0.8, 0.2]],
                   "tilt": [[0, 6], [f1a + 1.2, -6]], "egil": [[0, -8], [f1a + 1.2, 6], [f1b, 9]],
                   "elL3": [[0, -0.27, 0.66, MZ + 0.25], [f1a + 1.0, -0.27, 0.66, MZ + 0.25], [f1a + 1.5, -0.05, 0.25, KZ + 0.35]],
                   "elR3": [[0, 0.3, 0.42, KZ + 0.25], [f1a + 1.6, 0.25, 0.2, KZ + 0.45]], "gozSok": [[0, 0.8], [f1a + 0.9, 0.3], [f1a + 1.6, 0]],
                   "nefes": [[0, 3.0], [f1a + 1.5, 1.4]], "parilti": [[0, 0, 0]]})}
FPS1 = {"mekan": "depo", "kacis": {"kar": [mert1, kiz1]}, "sallan": [[0, 0, 2.8]], "titreme": [[0, 0.25]], "sac": [[0, 9]],
        "kam": [[f1a, *cL, -180, 7, 0], [f1a + 0.4, *cL, -180, 6.5, 0], [L[2] - 0.2, cL[0], cL[1], cL[2] - 0.04, -180.5, 6, 0], [f1b, cL[0], cL[1], cL[2] - 0.1, -180.5, 6.5, 0]],
        "fov": [[f1a, 1.45], [f1b, 1.6]]}

# F2: Elif dört ayak süzülür (ekranın solundan Mert'e), sonra onun gövdesine tırmanırcasına doğrulur
f2a, f2b = F2
MZ2 = -3.45
mert2 = {"id": "mert724", "w": [-0.4, -0.55, MZ2], "boy": 1.75,
         "q": ayna({"onKol": True, "dogalKol": True, "yay": 1, "duygu": [[0, "notr"]], "bosGoz": [[0, 1]], "kirpmaz": [[0, 999]], "solgun": [[0, 0.55]],
                    "bak": [[0, 0.0, 0.1, 0.0], [L[16] + 2.4, 0.15, 0.6, 0.1]], "tilt": [[0, 2]],
                    "elR3": [[0, -0.12, 0.45, MZ2 + 0.05]], "elL3": [[0, -0.68, 0.45, MZ2 + 0.05]], "nefes": [[0, 0.6]]})}
EL2_W = KF()
EL2_L, EL2_R = KF(), KF()
EL2_EGIL = KF()
x0, z0, x1, z1 = 0.55, -2.15, -0.12, -3.2
n = 12
t_kalk = R3(f2a + 3.0)
for i in range(n + 1):
    u = i / n
    t = f2a + 0.2 + (t_kalk - f2a - 0.2) * u
    x, z = x0 + (x1 - x0) * u, z0 + (z1 - z0) * u
    EL2_W.a(t, round(x, 3), -0.55, round(z, 3))
    adim = 0.12 * math.sin(u * math.pi * 6)
    EL2_L.a(t, round(x - 0.55 + adim, 3), -0.5, round(z - 0.1, 3))
    EL2_R.a(t, round(x - 0.5 - adim, 3), -0.5, round(z + 0.12, 3))
EL2_W.a(f2b, x1, -0.55, z1 - 0.05)
EL2_L.a(t_kalk + 0.9, -0.3, 0.75, MZ2 + 0.3).a(f2b, -0.28, 0.85, MZ2 + 0.32)          # elleri Mert'in göğsüne
EL2_R.a(t_kalk + 0.9, -0.5, 1.0, MZ2 + 0.3).a(f2b, -0.5, 1.05, MZ2 + 0.32)
EL2_EGIL.a(0, 68).a(t_kalk, 66).a(t_kalk + 1.0, 8).a(f2b, 4)
kiz2 = {"id": "kacan724", "w": [x0, -0.55, z0], "wk": EL2_W.s(), "boy": 1.66,
        "q": ayna({"onKol": True, "dogalKol": True, "yay": 1, "sacDagin": 0.7, "duygu": [[0, "alayci"], [L[16], "mutlu"]], "kirpmaz": [[0, 999]],
                   "bak": [[0, -0.6, -0.4, -0.5], [t_kalk, -0.5, -0.5, -0.4], [t_kalk + 1.0, -0.2, -0.3, -0.2]], "tilt": [[0, -14], [t_kalk + 1.0, 8]],
                   "egil": EL2_EGIL.s(), "elL3": EL2_L.s(), "elR3": EL2_R.s(), "konus": [{"t": R3(L[16] + VF), "cues": M[TAKE[16]]["mouth"]}]})}
FPS2 = {"mekan": "depo", "kacis": {"kar": [mert2, kiz2]}, "sallan": [[0, 0, 2.8]], "titreme": [[0, 0.3]], "sac": [[0, 9]],
        "kam": [[f2a, *cL, -180, 14, 0], [t_kalk, cL[0] - 0.03, cL[1], cL[2], -181, 11, 0], [f2b, cL[0] - 0.05, cL[1], cL[2] - 0.06, -182, 6, 0]],
        "fov": [[f2a, 1.25], [t_kalk, 1.35], [f2b, 1.6]]}

# F3: ışık gelince Elif burnunun dibinde (kırpmaz), arkada Mert boş gözlerle
f3a, f3b = F3
kiz3 = {"id": "kacan724", "w": [0.0, -0.55, -1.86], "boy": 1.66,
        "q": ayna({"onKol": True, "dogalKol": True, "yay": 1, "sacDagin": 0.6, "duygu": [[0, "sahteGulus"], [L[17], "alayci"], [ve(17) - 0.3, "sahteGulus"]],
                   "kirpmaz": [[0, 999]], "bak": [[0, 0.0, -0.35, 0.0], [ws(17, 4), 0.02, -0.38, 0.03]], "tilt": [[0, 0], [L[17] + 0.4, 9], [ws(17, 4), 14]],
                   "elL3": [[0, -0.25, 0.3, -1.95]], "elR3": [[0, 0.25, 0.3, -1.95]], "konus": [{"t": R3(L[17] + VF), "cues": M[TAKE[17]]["mouth"]}],
                   "nefes": [[0, 0.4]]})}
mert3 = {"id": "mert724", "w": [-0.55, -0.55, MZ2], "boy": 1.75,
         "q": ayna({"onKol": True, "dogalKol": True, "yay": 1, "duygu": [[0, "notr"]], "bosGoz": [[0, 1]], "kirpmaz": [[0, 999]], "solgun": [[0, 0.55]],
                    "bak": [[0, 0.0, 0.1, 0.0]], "elR3": [[0, -0.27, 0.45, MZ2 + 0.05]], "elL3": [[0, -0.83, 0.45, MZ2 + 0.05]]})}
KAR3 = KF().a(f3a, 0.95).a(f3a + 0.12, 0).a(f3a + 0.9, 0).a(f3a + 0.95, 0.7).a(f3a + 1.05, 0).a(ws(17, 4) + 0.3, 0).a(ws(17, 4) + 0.36, 0.6).a(ws(17, 4) + 0.46, 0).a(f3b, 0)
FPS3 = {"mekan": "depo", "kacis": {"kar": [mert3, kiz3]}, "sallan": [[0, 0, 2.8]], "titreme": [[0, 0.5], [f3a + 0.5, 0.25]], "sac": [[0, 9]],
        "kam": [[f3a, *cL, -180, 4, 0], [f3b, cL[0], cL[1] - 0.02, cL[2] + 0.04, -180, 3.5, 0]], "fov": [[f3a, 1.0], [f3b, 1.08]],
        "karart": KAR3.s()}
FPS = {F1: FPS1, F2: FPS2, F3: FPS3}


def E(t, isim, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": R3(t), "volume": vol, **kw}


# ================================================================== ses (mutlak zamanlı; vuruşlara dağıtılır)
SFX = []
for i, t in enumerate(NOT_T[1:11]):
    SFX.append(E(t, "b9_kagit_kay", 0.32 if i % 2 else 0.26))
SFX.append(E(ws(5, 2) - 0.1, "b9_kagit_kay", 0.35))
SFX += [E(0.0, "muzik/market_gerilim", 0.17, sure=31.8, zarf=[[0, 0.4], [3, 1], [29.5, 1], [31.8, 0]]),
        E(16.7, "el_kagit", 0.35, kirp=0.2, sure=0.9), E(18.5, "el_para_sayma", 0.3, sure=2.5), E(21.0, "el_para_sayma", 0.22, sure=2.5, kirp=0.3),
        E(31.95, "el_kagit", 0.3, kirp=0.1, sure=1.0), E(32.6, "b8y4_adim_yavas", 0.25, sure=2.2),
        E(32.3, "muzik/b9_kiskanc", 0.28, sure=9.0, zarf=[[0, 0], [0.6, 1], [8.4, 1], [9.0, 0.6]]),
        E(41.0, "muzik/b9_kiskanc", 0.28, sure=9.0, zarf=[[0, 0.6], [0.4, 1], [8.4, 1], [9.0, 0.6]]),
        E(49.8, "muzik/b9_kiskanc", 0.3, sure=9.0, zarf=[[0, 0.6], [0.4, 1], [8.4, 1], [9.0, 0.6]]),
        E(58.6, "muzik/b9_kiskanc", 0.28, sure=4.0, zarf=[[0, 0.6], [0.4, 1], [3.4, 0.6], [4.0, 0]]),
        E(62.6, "korku_drone", 0.28, sure=10.9, zarf=[[0, 0], [1.0, 0.6], [7.5, 1], [10.9, 0]]),
        E(68.6, "b9_fisilti", 0.55), E(69.6, "b8y3_sting", 0.18, kirp=0.5), E(71.5, "el_kalp_yavas", 0.35),
        E(77.0, "muzik/b9_dehset", 0.3, sure=14.0, zarf=[[0, 0], [1.5, 0.7], [11, 1], [14, 0.6]]),
        E(79.3, "el_kagit", 0.35, kirp=0.1, sure=0.9), E(80.6, "el_cigneme", 0.5), E(81.9, "el_cigneme", 0.45), E(80.7, "b8_kagit_tezgah", 0.25, kirp=0.1, sure=0.8),
        E(83.45, "yutkunma", 0.45), E(86.7, "el_cigneme", 0.35, sure=0.8), E(87.3, "yutkunma", 0.5),
        E(89.0, "b8y3_surunme", 0.35, sure=3.4), E(91.0, "muzik/market_gerilim", 0.18, sure=13.8, kirp=40, zarf=[[0, 0], [1.5, 1], [13.8, 0.8]]),
        E(94.6, "tik", 0.4), E(96.5, "el_kagit", 0.2, kirp=0.1, sure=0.5),
        E(96.9, "b9_floresan", 0.45), E(97.6, "el_floresan_kivilcim", 0.4), E(98.6, "b5_floresan_kivilcim", 0.35, sure=1.0),
        E(99.5, "el_kalp_yavas", 0.4), E(103.9, "b9_floresan", 0.25, sure=0.9),
        E(105.55, "b5_kitin_catirti", 0.6, sure=0.55), E(105.7, "el_cigneme", 0.4), E(104.8, "muzik/b9_dehset", 0.32, sure=14.0, zarf=[[0, 0.6], [1, 1], [13, 1], [14, 0.4]]),
        E(107.8, "el_kitin_catirti", 0.35, kirp=0.3, sure=1.4), E(107.8, "b8y3_surunme", 0.3, sure=2.4), E(110.4, "el_cigneme", 0.3), E(113.0, "el_cigneme", 0.22, sure=1.2),
        E(L[19] - 0.5, "b9_kapi_arkasi", 0.25, kirp=0.3, sure=0.6), E(118.6, "muzik/gerilim", 0.22, sure=round(SON - 118.6, 3), zarf=[[0, 0], [2, 0.6], [14, 1]]),
        E(119.0, "b9_floresan", 0.2, sure=0.7), E(125.5, "b8y_kol_gicirti", 0.12, sure=0.8), E(124.4, "el_kalp_yavas", 0.35), E(128.4, "el_kalp_yavas", 0.4),
        E(132.4, "el_kalp_yavas", 0.45), E(133.1, "b8y_kol_gicirti", 0.15, kirp=0.8, sure=0.5)]
AMB = [[0, 1], [62.6, 1], [63.0, 0.5], [68.4, 0.5], [70.0, 0.25], [77.0, 0.7], [97.0, 0.7], [97.1, 1.2], [99.5, 1.2], [99.6, 0.5], [104.8, 0.6],
       [131.6, 0.5], [SON - 0.01, 0.5], [SON, 0]]


def bolumler():
    """vuruş sınırları: replik başları + FPS giriş/çıkışları; her aralık line ya da insert"""
    sin = sorted(set([0.0, SON] + list(L.values()) + [a for a, b in FPS_ARA] + [b for a, b in FPS_ARA]))
    rl = {v: r for r, v in L.items()}
    out = []
    for a, b in zip(sin[:-1], sin[1:]):
        fps = next((F for F in FPS_ARA if F[0] <= a < F[1]), None)
        out.append((a, b, rl.get(a), fps))
    return out


def yan(t0):
    return {"kind": "b8_market", "text": [json.dumps({**ORTAK, "t0": R3(t0)}, ensure_ascii=False, separators=(",", ":"))]}


def fps(F, t0):
    return {"kind": "b8_fps", "text": [json.dumps({**FPS[F], "t0": R3(t0)}, separators=(",", ":"))]}


if __name__ == "__main__":
    if _ARGV and _ARGV[0] == "--kare":
        os.makedirs(f"{K}/out/b9t", exist_ok=True)
        json.dump([{"etiket": t, "prm": {**ORTAK, "t0": float(t)}} for t in _ARGV[1:]], open(f"{K}/out/b9t/kare.json", "w"))
        print("out/b9t/kare.json", len(_ARGV) - 1)
        sys.exit()
    beats = []
    for a, b, r, F in bolumler():
        ek = fps(F, a) if F else yan(a)
        sfx = [{**s, "at": R3(s["at"] - a)} for s in SFX if a <= s["at"] < b]
        if r:
            assert b - a - D[r] >= 0.1, (r, a, b)
            bb = {"type": "line", "who": WHO[r], "text": M[TAKE[r]]["text"], "emotion": "notr", "gapAfter": round((b - a) - D[r], 4), "ekle": ek, "_r": r}
            if WHO[r] == "yaratik724b":
                bb["label"] = ""
            elif WHO[r] == "kacan724":
                bb["label"] = "ELİF"
        else:
            bb = {"type": "insert", "dur": R3(b - a), **ek}
        if sfx:
            bb["sfx"] = sfx
        beats.append(bb)
    man = {k: v for k, v in M.items() if not k.startswith("i_")}
    for j, bb in enumerate(beats):
        if bb["type"] == "line":
            man[f"i_{j + 1:02d}"] = M[TAKE[bb.pop("_r")]]
    json.dump(man, open(f"{VD}/manifest.json", "w"), ensure_ascii=False, indent=1)
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Market · rüşvet", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.24, "zarf": AMB}, "music": {"name": "yok"}, "beats": beats}
    ep = {"series": "724", "seriesTitle": "7/24", "episode": EP, "episodeNo": 9, "title": "Bölüm 9 · Parça 3-6",
          "endCard": {"text": "Bölüm 10 yakında", "sub": "Ece kapıyı açacak mı?", "sure": 4}, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{EP}.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON} sn + bitiş kartı; vuruş {len(beats)}; ELU {ELU}")
