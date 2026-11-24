"""7/24 Bölüm 8 (yeni) Parça 2: "Bu gece daha rahat geçer" → "kurallar önceden hazırlanmıyor" (rüzgâr/cırcır) → "kaybol abi"
→ saat 00:00 → alarm → "başladık yine" → "Mert! Kurallar!" → Mert kurallara bakar.
Kullanım: python3 tools/b8y_p2_ses.py && python3 tools/b8y_p2.py  -> public/episodes/724-08y-p2.json
Kullanıcının metni AYNEN (bolumler.md "Bölüm 8 (YENİ), Parça 2"); ses seçimleri public/voice/724-08y-p2/secim.json.
Kamera kuralı (kullanıcı, 24 Kasım): Ece konuşurken / âşıkken TEK çekim (tezgah); Sabri/Mert konuşurken önde Ece'nin sırtı (kasa, eceSirt).
"""
import json, os, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
VFROM = 2 / FPS
VD = f"{K}/public/voice/724-08y-p2"
M = json.load(open(f"{VD}/manifest.json"))
TAKE = json.load(open(f"{VD}/secim.json"))
METIN = {"S1": ("sabri", "Bu gece daha rahat geçer, hem 2 kişisiniz. Mert'e de yardımcı olursun."),
         "E1": ("ece_sivil", "tabi tabii"),
         "S2": ("sabri", "Kural defterine ara sıra bakın Ece"),
         "E2": ("ece_sivil", "ezberledim zaten abi?"),
         "S3": ("sabri", "kurallar önceden hazırlanmıyor Ece"),
         "S4": ("sabri", "O zaman ben gidiyorum, nasılsa siz buradasınız."),
         "E3": ("ece_sivil", "kaybol abi."),
         "E4": ("ece_sivil", "başladık yine"),
         "E5": ("ece_sivil", "Mert kurallar, hemen kuralları ezberle")}

SIRA = [
    ("GIRIS", None, 0.25),
    ("S1", "S1", 0.25),
    ("E1", "E1", 0.3),
    ("S2", "S2", 0.2),
    ("E2", "E2", 0.25),
    ("S3", "S3", 0.1),
    ("SOK", None, 2.7),      # Ece'nin bakışı Sabri'ye kilitlenir: rüzgâr + cırcır
    ("S4", "S4", 0.2),
    ("E3", "E3", 0.45),
    ("CIKIS", None, 1.4),    # Sabri çıkar
    ("SAAT", None, 2.8),     # saate zoom: 19:13 → 00:00
    ("KASA", None, 2.4),     # Ece tezgâha dayanmış Mert'i izler, Mert kasayı toplar
    ("ALARM", None, 1.5),    # alarm: Ece irkilir
    ("TEL", None, 1.6),      # telefon: 00:00
    ("E4", "E4", 0.25),
    ("E5", "E5", 0.3),
    ("KURAL", None, 1.3),    # Mert kurallara döner
    ("KAGIT", None, 3.0),    # kural kâğıdı
]
T, DUR, fr = {}, {}, 0
for ad, r, d in SIRA:
    T[ad] = fr / FPS
    n = round(((M[TAKE[r]]["duration"] + d) if r else d) * FPS)
    DUR[ad] = n / FPS
    fr += n
SON_T = fr / FPS


def W(r, kelime, uc="start", n=0):
    ws = [w for w in M[TAKE[r]]["words"] if w["w"].lower().strip(",.?!").startswith(kelime.lower())]
    return round(T[r] + VFROM + ws[n][uc], 3)


def V(r):
    return T[r] + VFROM, T[r] + VFROM + M[TAKE[r]]["duration"]


konus = lambda r: {"t": round(T[r] + VFROM, 3), "cues": M[TAKE[r]]["mouth"]}
sirala = lambda k: sorted(k, key=lambda q: q[0])

# ------------------------------------------------------------------ kamera
SINIR = {"kasa": (0, 1080, 0, 1920), "tezgah": (0, 1080, 0, 1920)}
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


# ------------------------------------------------------------------ yerleşimler (P1 ile aynı)
EX, EY, ES = 450, 1700, 1250
EYUZ = EY - 765 * ES / 1000
SX, SY, SS = 540, 1960, 1180
SYUZ = SY - 765 * SS / 1000
KX, KS = 150, 1650
KY = 990 + 765 * KS / 1000
MX, MY, MS = 800, 1960, 1300
MYUZ = MY - 765 * MS / 1000
MX2 = 730                          # 00:00: Sabri gitti, Mert kasanın ortasında
EL_L, EL_R = (EX - 64, 1194), (EX + 80, 1194)
A_ = {"sabri": (0.22, -0.05, 0.1), "mert": (0.55, -0.12, 0.32)}

# ------------------------------------------------------------------ zamanlar
g0 = T["GIRIS"]
s1a, s1b = V("S1"); t_mert = W("S1", "mert'e")
e1a, e1b = V("E1")
s2a, s2b = V("S2"); t_kural = W("S2", "kural")
e2a, e2b = V("E2"); t_abi = W("E2", "abi")
s3a, s3b = V("S3"); t_once = W("S3", "önceden")
k0 = T["SOK"]
s4a, s4b = V("S4"); t_gid = W("S4", "gidiyorum")
e3a, e3b = V("E3"); t_kay = W("E3", "kaybol")
c0 = T["CIKIS"]; sa0 = T["SAAT"]; ka0 = T["KASA"]; al0 = T["ALARM"]; te0 = T["TEL"]
e4a, e4b = V("E4"); t_bas = W("E4", "başladık")
e5a, e5b = V("E5"); t_kur5 = W("E5", "kurallar")
ku0 = T["KURAL"]; kg0 = T["KAGIT"]
t_alarm = al0 + 0.1

# ------------------------------------------------------------------ TEZGAH: Ece tek çekim
ECE_TZ = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": [[0, EX, EY, ES]],
    "elL": sirala([[0, *EL_L], [SON_T, *EL_L]]),
    # E3 "kaybol abi": eliyle Sabri'yi kovar (iki kez savuşturma); E5: Mert'e uzanır
    "elR": sirala([[0, *EL_R], [e3a, *EL_R], [t_kay, EX + 150, 1090], [t_kay + 0.2, EX + 185, 1110], [t_kay + 0.4, EX + 150, 1085],
                   [t_kay + 0.6, EX + 185, 1110], [e3b + 0.3, *EL_R], [e5a, *EL_R], [t_kur5, EX + 160, 1100], [e5b + 0.2, EX + 175, 1095], [SON_T, EX + 175, 1095]]),
    "duygu": [[0, "mutlu"], [e2a, "alayci"], [e2b + 0.1, "alayci"], [k0, "sok"], [k0 + 0.3, "saskin"], [e3a, "mutlu"],
              [e4a, "korkmus"], [t_bas, "uzgun"], [e5a, "korkmus"]],
    "bak": sirala([[0, *A_["mert"]], [e1b + 0.2, *A_["mert"]], [e2a, *A_["sabri"]], [e2b, *A_["sabri"]],
                   [k0, *A_["sabri"]], [e3a, *A_["mert"]], [e3b, *A_["mert"]],
                   [e4a, 0.05, 0.5, 0], [t_bas + 0.2, 0.0, 0.0, 0], [e5a, *A_["mert"]], [SON_T, *A_["mert"]]]),
    "tilt": sirala([[0, 7], [e1a, 7], [e1b, -5], [e2a, 0], [t_abi, 5], [k0, 0], [k0 + 0.3, 2], [e3a, 8], [t_kay, -4], [e3b, 6],
                    [e4a, 0], [t_bas, -5], [e5a, 3], [SON_T, 0]]),
    "egil": [[0, 0]],
    "gozSok": [[0, 0], [k0, 0], [k0 + 0.25, 0.75], [k0 + DUR["SOK"], 0.6], [s4a, 0], [e4a, 0], [e4a + 0.1, 0.5], [e5a, 0.4], [e5b, 0.2]],
    "goz": [[0, 0], [e1b, 0], [e1b + 0.08, 0.9], [e1b + 0.16, 0], [e3b + 0.1, 0], [e3b + 0.18, 0.9], [e3b + 0.26, 0]],
    "parilti": [[0, 1, 1], [e2a - 0.1, 1, 1], [e2a, 0, 0], [e3a - 0.05, 0, 0], [e3a + 0.15, 1, 1], [e4a - 0.05, 1, 1], [e4a, 0, 0]],
    "nefes": [[0, 1.2], [k0, 0.4], [s4a, 1], [e4a, 2.4], [SON_T, 2.2]],
    "kulak": [[0, 0.3]],
    "konus": [konus(r) for r in ("E1", "E2", "E3", "E4", "E5")],
}

# ------------------------------------------------------------------ KASA: Sabri, Mert, Ece (önde, 00:00 sahnesi)
SB_L, SB_R = (480, 1434), (590, 1432)
SAB = {
    "onKol": True, "dogalKol": True,
    "yer": sirala([[0, SX, SY, SS], [c0 + 0.2, SX, SY, SS], [c0 + 1.3, SX - 620, SY, SS], [c0 + 1.31, SX - 620, SY, 1]]),
    "yuru": [[c0 + 0.2, c0 + 1.3]],
    "elL": sirala([[0, *SB_L], [s4a, *SB_L], [t_gid - 0.1, 470, 1180], [t_gid + 0.2, 455, 1150], [t_gid + 0.4, 470, 1175], [t_gid + 0.6, 455, 1150], [s4b + 0.2, *SB_L], [SON_T, *SB_L]]),
    "elR": sirala([[0, *SB_R], [s2a, *SB_R], [t_kural - 0.1, 615, 1300], [t_kural + 0.2, 622, 1290], [s2b + 0.1, *SB_R], [SON_T, *SB_R]]),
    "tutR": [[0, None], [s2a, "isaret"], [s2b + 0.1, None]],
    "duygu": [[0, "mutlu"], [s3a, "dusunceli"], [s3b, "soguk"], [s4a, "mutlu"]],
    "bak": sirala([[0, -0.18, -0.05, -0.08], [t_mert - 0.1, 0.42, -0.05, 0.3], [t_mert + 0.5, -0.18, -0.05, -0.08],
                   [SON_T, -0.18, -0.05, -0.08]]),
    "tilt": sirala([[0, 0], [s1a, 3], [t_mert, -2], [s3a, 0], [t_once, -4], [s4a, 3], [SON_T, 0]]),
    "goz": [[0, 0], [s3b + 0.2, 0], [s3b + 0.28, 0.9], [s3b + 0.36, 0]],
    "egil": [[0, 0]],
    "konus": [konus(r) for r in ("S1", "S2", "S3", "S4")],
}
MB_L, MB_R = (MX2 - 70, 1434), (MX2 + 80, 1432)
MERT = {
    "onKol": True, "dogalKol": True,
    "yer": sirala([[0, MX, MY, MS], [sa0, MX, MY, MS], [sa0 + 0.01, MX2, MY, MS], [SON_T, MX2, MY, MS]]),
    # 00:00: kasayı toplar (eller tezgâhta bir şeyleri dizer)
    "elL": sirala([[0, MX - 70, 1436], [ka0, *MB_L], [ka0 + 0.5, MX2 - 120, 1426], [ka0 + 1.0, MX2 - 60, 1434], [ka0 + 1.5, MX2 - 130, 1428],
                   [ka0 + 2.0, MX2 - 70, 1434], [SON_T, *MB_L]]),
    "elR": sirala([[0, MX + 80, 1434], [ka0, *MB_R], [ka0 + 0.4, MX2 + 140, 1428], [ka0 + 0.9, MX2 + 70, 1436], [ka0 + 1.4, MX2 + 150, 1426],
                   [ka0 + 1.9, MX2 + 80, 1434], [SON_T, *MB_R]]),
    "duygu": [[0, "notr"], [al0 + 0.3, "saskin"], [ku0, "dusunceli"]],
    "bak": sirala([[0, -0.4, 0, -0.25], [t_mert, -0.3, 0.05, -0.2], [ka0, 0.05, 0.6, 0], [al0 + 0.2, -0.35, 0.1, -0.25],
                   [ku0, -0.35, 0.1, -0.25], [ku0 + 0.4, 0.75, -0.35, 0.6], [SON_T, 0.75, -0.35, 0.6]]),
    "tilt": sirala([[0, -2], [ka0, 4], [ka0 + 2.0, -3], [ku0 + 0.4, 5], [SON_T, 5]]),
    "egil": [[0, 0]],
}
ECE_KS = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": sirala([[0, KX + 60, KY, KS], [al0, KX + 60, KY, KS], [t_alarm + 0.05, KX + 20, KY + 40, KS], [t_alarm + 0.3, KX + 40, KY + 15, KS], [SON_T, KX + 40, KY + 15, KS]]),
    "egil": sirala([[0, 7], [t_alarm, 7], [t_alarm + 0.15, -2], [SON_T, -2]]),     # tezgâha dayanmış, öne eğik
    # sağ dirseği tezgâhta, eli çenesinin altında (âşık âşık izler)
    "elR": sirala([[0, KX + 250, 1120], [t_alarm, KX + 250, 1120], [t_alarm + 0.15, KX + 300, 1350], [SON_T, KX + 300, 1350]]),
    "elRara": [[0, 99]],
    "duygu": [[0, "mutlu"], [t_alarm, "dehset"], [t_alarm + 0.5, "korkmus"]],
    "bak": sirala([[0, 0.7, -0.1, 0.55], [t_alarm, 0.7, -0.1, 0.55], [t_alarm + 0.1, 0.3, 0.6, 0.2], [SON_T, 0.3, 0.6, 0.2]]),
    "tilt": sirala([[0, 9], [t_alarm, 9], [t_alarm + 0.12, -4], [SON_T, -4]]),
    "parilti": [[0, 1, 1], [t_alarm, 1, 1], [t_alarm + 0.05, 0, 0]],
    "gozSok": [[0, 0], [t_alarm, 0], [t_alarm + 0.1, 0.8], [SON_T, 0.6]],
    "kulak": [[0, 0.3]],
}

# ------------------------------------------------------------------ KURGU + KAMERA
OTS_ECE = (EX + 110, EYUZ + 260 / 1.75, 1.75)
ECE_Y = (EX, EYUZ + 300 / 2.1, 2.1)
IKI = (670, 1150, 1.35)                       # Sabri + Mert (önde Ece'nin ensesi)
SAB_Y = (SX - 15, SYUZ + 320 / 2.1, 2.1)
kes(g0, "kasa", *IKI)                                          # 1 Sabri + Mert, Ece'nin omzu üstünden: "Bu gece daha rahat geçer…"
it(e1a, "kasa", IKI[0], IKI[1] - 6, IKI[2] + 0.05)
kes(e1a, "tezgah", *ECE_Y)                                     # 2 Ece tek (âşık, gözü Mert'te): "tabi tabii"
it(s2a, "tezgah", ECE_Y[0], ECE_Y[1] - 4, ECE_Y[2] + 0.08)
kes(s2a, "kasa", *SAB_Y)                                       # 3 Sabri OTS: "Kural defterine ara sıra bakın Ece"
it(e2a, "kasa", SAB_Y[0], SAB_Y[1] - 3, SAB_Y[2] + 0.06)
kes(e2a, "tezgah", *OTS_ECE)                                   # 4 Ece OTS (Sabri'nin ensesi): "ezberledim zaten abi?"
it(s3a, "tezgah", OTS_ECE[0], OTS_ECE[1] - 4, OTS_ECE[2] + 0.06)
kes(s3a, "kasa", SX - 10, SYUZ + 220 / 2.7, 2.7)               # 5 Sabri yakın (yavaş itme): "kurallar önceden hazırlanmıyor Ece"
it(k0, "kasa", SX - 10, SYUZ + 200 / 3.0, 3.0)
kes(k0, "tezgah", EX, EYUZ + 180 / 2.7, 2.7)                   # 6 Ece çok yakın: bakış Sabri'ye kilitlenir (rüzgâr + cırcır)
it(s4a, "tezgah", EX, EYUZ + 170 / 3.0, 3.0)
kes(s4a, "kasa", *IKI)                                         # 7 Sabri + Mert: "O zaman ben gidiyorum…"
it(e3a, "kasa", IKI[0], IKI[1] - 5, IKI[2] + 0.04)
kes(e3a, "tezgah", *ECE_Y)                                     # 8 Ece tek, âşık: "kaybol abi." (eliyle kovar)
it(c0, "tezgah", ECE_Y[0], ECE_Y[1] - 4, ECE_Y[2] + 0.1)
kes(c0, "kasa", 600, 1060, 1.15)                               # 9 geniş: Sabri tezgâhın arkasından çıkıp gider
it(sa0, "kasa", 600, 1060, 1.18)
kes(sa0, "tezgah", 540, 560, 2.2)                              # 10 saat: yaklaşma, zaman akar → 00:00
it(sa0 + 1.4, "tezgah", 540, 380, 3.6)
it(ka0, "tezgah", 540, 362, 4.2)
kes(ka0, "kasa", 450, 1120, 1.25)                              # 11 kasa: Ece dayanmış Mert'i izler; Mert kasayı toplar
it(al0, "kasa", 455, 1115, 1.3)
it(te0, "kasa", 450, 1120, 1.36)                               # 12 alarm: Ece irkilir (aynı plan, sarsıntı)
# 13 TEL: telefon_ekran insert (ayrı vuruş)
kes(e4a, "tezgah", *ECE_Y)                                     # 14 Ece tek: "başladık yine"
it(e5a, "tezgah", ECE_Y[0], ECE_Y[1] - 4, ECE_Y[2] + 0.1)
kes(e5a, "tezgah", *OTS_ECE)                                   # 15 Ece: "Mert! Kurallar!…" (Mert'e döner)
it(ku0, "tezgah", OTS_ECE[0], OTS_ECE[1], OTS_ECE[2] + 0.08)
kes(ku0, "kasa", MX2 + 20, MYUZ + 150 / 2.3, 2.3)              # 16 Mert yakın: kural kâğıdına döner
it(kg0, "kasa", MX2 + 30, MYUZ + 140 / 2.45, 2.45)
# 17 KAGIT: kurallar insert (ayrı vuruş)

ECE_KASA_ARA = [[ka0 - 0.01, te0]]
EKRAN = {"TEL", "KAGIT"}   # b8_market yerine kendi insert'i olan vuruşlar

# ------------------------------------------------------------------ ORTAK
SAAT = [[0, "19:13"], [sa0 + 0.9, "20:41"], [sa0 + 1.2, "21:37"], [sa0 + 1.45, "22:26"], [sa0 + 1.7, "23:18"], [sa0 + 1.95, "23:51"],
        [sa0 + 2.2, "23:59"], [sa0 + 2.5, "00:00"]]
ORTAK = {"saat": SAAT, "kapi": [[0, 0]], "flor": [[0, 1], [s3a, 1], [k0, 0.82], [s4a, 1], [t_alarm, 1], [t_alarm + 0.3, 0.75], [SON_T, 0.8]],
         "cizir": [[t_alarm + 0.05, t_alarm + 0.6]], "lamba": [[0, 0]],
         "titre": {"tezgah": 1.3, "kasa": 1.2},
         "blok": [[0, 560]], "gazete": [[0, 1300]], "gazeteTz": [[0, -700]], "kagitTz": [[0, 1]], "elAra": [],
         "kalemMasa": [[0, 640, 1]], "eceKasaAra": ECE_KASA_ARA, "odak": [[0, 0]],
         "depo": [[0, 0.96]], "depoKol": [[0, 0]],
         "sars": [[0, 0], [t_alarm - 0.01, 0], [t_alarm, 0.7], [t_alarm + 0.35, 0]],
         "mertGolge": [-175, -40, 0.42],
         "eceSirt": [[0, 290, 1440, 1.3]], "eceSirtAra": [[g0 - 0.01, e1a], [s2a - 0.01, e2a], [s3a - 0.01, k0], [s4a - 0.01, e3a], [c0 - 0.01, sa0]],
         "sabriSirt": [[0, EX + 410, EYUZ + 70, 0.95]], "sabriSirtAra": [[e2a - 0.01, s3a]],
         "anime": {"tezgah": [[0, 0.45], [e2a - 0.01, 0.45], [e2a, 0], [e3a - 0.01, 0], [e3a, 0.8], [c0, 0.8], [c0 + 0.01, 0]],
                   "kasa": [[0, 0], [ka0 - 0.01, 0], [ka0, 0.3], [t_alarm - 0.01, 0.3], [t_alarm, 0]]},
         "animeMerkez": {"tezgah": [[0, EX, EYUZ - 20]], "kasa": [[0, MX2, MYUZ - 40]]}}
KAR = {"tezgah": {"ece": ECE_TZ}, "kasa": {"sabri": SAB, "mert": MERT, "ece": ECE_KS}}

_argv = sys.argv
sys.argv = [sys.argv[0]]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import b8p1 as P1  # noqa: E402
sys.argv = _argv
CIZIM = [{"w": c["w"], "p": [[-5, x, y] for _, x, y in c["p"]]} for c in P1.CIZIM]
BAS = [{**b, "t0": -5, "t1": -4.9} for b in P1.BAS]


def blob(t0, t1):
    vs = set()
    for i, (t, v) in enumerate(KURGU):
        tn = KURGU[i + 1][0] if i + 1 < len(KURGU) else 1e9
        if t < t1 and tn > t0:
            vs.add(v)
    p = {"t0": round(t0, 3), "kurgu": KURGU, **ORTAK, "cam": {v: CAM[v] for v in vs}, "kar": {v: KAR[v] for v in vs if KAR[v]}}
    if "tezgah" in vs:
        p.update({"cizim": CIZIM, "bas": BAS})
    return {"kind": "b8_market", "text": [json.dumps(p, ensure_ascii=False, separators=(",", ":"))]}


def E(ad, isim, t, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t - T[ad], 3), "volume": vol, **kw}


SFX = {
    "SOK": [E("SOK", "b8y_ruzgar_circir", k0 + 0.1, 0.55)],
    "E1": [E("E1", "muzik/b8y_ask_c", e1a, 0.35)],
    "E3": [E("E3", "b8y_parilti", e3a, 0.35), E("E3", "muzik/b8y_ask_d", e3a, 0.35)],
    "KASA": [E("KASA", "muzik/b8y_ask_e", ka0, 0.35)],
    "CIKIS": [E("CIKIS", "kapi_dingdong", c0 + 1.1, 0.3)],
    "SAAT": [E("SAAT", "b8y_saat_hizli", sa0 + 0.6, 0.45), E("SAAT", "b8y_saat_bip", sa0 + 2.5, 0.5)],
    "ALARM": [E("ALARM", "b8y_alarm", t_alarm, 0.6), E("ALARM", "floresan_cit", t_alarm + 0.08, 0.35)],
    "TEL": [E("TEL", "b8y_alarm", te0, 0.45, sure=1.5)],
    "KAGIT": [E("KAGIT", "darbe", kg0 + 0.2, 0.35)],
}


def vuruslar():
    out = []
    for ad, r, d in SIRA:
        t0, t1 = T[ad], T[ad] + DUR[ad]
        if ad == "TEL":
            ek = {"kind": "telefon_ekran", "text": ["alarm", "00:00"]}
        elif ad == "KAGIT":
            ek = {"kind": "kurallar", "text": ["0"]}
        else:
            ek = blob(t0, t1)
        if r:
            who, metin = METIN[r]
            b = {"type": "line", "who": who, "text": metin, "emotion": "notr", "gapAfter": d, "ekle": ek}
        else:
            b = {"type": "insert", "dur": round(DUR[ad], 4), **ek}
        if SFX.get(ad):
            b["sfx"] = SFX[ad]
        out.append((ad, r, b))
    return out


if __name__ == "__main__":
    ep_id = "724-08y-p2"
    man, beats = {}, []
    for i, (ad, r, b) in enumerate(vuruslar()):
        if r:
            man[f"i_{i + 1:02d}"] = M[TAKE[r]]
        beats.append(b)
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Market · 00:00", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.5}, "music": {"name": "yok"}, "beats": beats}
    tum = {k: v for k, v in M.items() if not k.startswith("i_")}
    tum.update(man)
    json.dump(tum, open(f"{VD}/manifest.json", "w"), ensure_ascii=False, indent=1)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 8, "title": "Bölüm 8 · Parça 2", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON_T:.2f} sn")
    for ad, r, d in SIRA:
        print(f"  {ad:6s} {T[ad]:6.2f} +{DUR[ad]:.2f}" + (f"  {TAKE[r]}" if r else ""))
