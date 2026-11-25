"""7/24 Bölüm 9, Parça 1 (kullanıcının metni AYNEN: docs/diziler/724/bolumler.md "Bölüm 9, Parça 1").
Yaratık (twerk sonrası) Ece'ye saldırır → FPS: Ece döner, koridordan markete koşar; ilerde kapı boşluğundan aydınlık market,
koridora açık kapının ARKASI; kaçan kız yerde başı Mert'in göğsünde, Mert diz çökmüş teselli eder: "Geçti... tamam." →
markete çıkınca FPS biter → YAN: Ece depo kapısını çarparak kapatır, kapıya yaslanır, birden nefes nefese.
CANLILIK katmanı (engine/canli.tsx): Ece'de yaylı hareket + saç takibi, ter damlası.
Kullanım: python3 tools/b9_p1.py  -> public/episodes/724-09-p1.json
"""
import json, os, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KARE = 30
VFROM = 2 / KARE
sys.argv = [sys.argv[0]]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import b8y_p1 as P1  # noqa: E402  (yan açı izdüşümü)

VD = f"{K}/public/voice/724-09-p1"
M = json.load(open(f"{VD}/manifest.json"))
TAKE = {"M1": "M1a_01"}
METIN = {"M1": ("mert724", "Geçti... tamam.")}

# ------------------------------------------------------------------ zaman çizelgesi (sn)
F1 = 2.55                                  # FPS 1: saldırı, dönüş, koşu, omuz üstü bakış, koli çarpması
m1d = M[TAKE["M1"]]["duration"]
F2 = round(round((m1d + 0.02) * KARE) / KARE, 4)   # FPS 2 (Mert'in repliği boyunca): kapıdan geçiş
L0 = F1 + F2                               # YAN başlar
m1a = F1 + VFROM
w = {x["w"].strip(".,"): x for x in M[TAKE["M1"]]["words"]}

# ------------------------------------------------------------------ FPS (dünya: koridor x -0.9..0.9, z -1..7; market z < -1)
CEZ = 3.45                                 # Ece depo kapısının önünde (B8 sonu)
t_don0, t_don1 = 0.5, 0.85                 # başını çevirip döner
t_kos = 0.8
t_bk0, t_bk1, t_bk2, t_bk3 = 1.16, 1.34, 1.6, 1.76   # B9: omzunun üstünden geriye bakış (sol omuz): dön, bak, geri dön
t_carp = 1.97                              # B9: sol omzuyla koli yığınına çarpar (üstteki koli devrilir)
t_esik = 3.5                               # kapı boşluğundan geçer (z -1)
KAM = [[0, -0.5, 1.5, CEZ, -90, 6, 0], [0.45, -0.48, 1.47, CEZ + 0.05, -88, 4, 3],
       [t_don0 + 0.12, -0.42, 1.5, CEZ, -128, 6, -4], [t_don1, -0.2, 1.52, CEZ - 0.2, -178, 4, 2],
       [1.1, -0.05, 1.56, 2.75, -180, 3, 0], [t_bk0, -0.03, 1.56, 2.65, -184, 3, 0],
       [t_bk1, 0.02, 1.55, 2.33, -343, 6, 7], [t_bk2, 0.06, 1.54, 1.98, -349, 8, 5],
       [t_bk3, 0.14, 1.56, 1.72, -186, 2, -3], [1.92, 0.34, 1.57, 1.48, -182, 3, -2],
       [t_carp, 0.38, 1.55, 1.38, -186, 4, 0], [t_carp + 0.08, 0.3, 1.5, 1.28, -228, 38, 10], [t_carp + 0.2, 0.24, 1.5, 1.18, -226, 42, 8],
       [t_carp + 0.34, 0.18, 1.52, 1.05, -212, 30, 5], [t_carp + 0.5, 0.1, 1.55, 0.85, -190, 8, 2], [2.6, 0.03, 1.57, 0.6, -181, 3, 0],
       [t_esik, 0.0, 1.58, -1.0, -180, 2, 0], [L0 - 0.35, 0.05, 1.58, -1.85, -178, 6, 1], [L0, 0.05, 1.58, -2.0, -176, 8, 0]]
FPSP = {"mekan": "depo", "kacis": {}, "kam": KAM, "koli": t_carp,
        "siluet": [[0, 0], [t_bk0 + 0.04, 0], [t_bk1 - 0.04, 1], [t_bk2 + 0.04, 1], [t_bk3 - 0.06, 0]],
        "sallan": [[0, 0, 3.2], [t_kos, 0, 3.2], [t_kos + 0.15, 1, 3.3], [t_bk1, 0.8, 3.3], [t_bk3, 1, 3.3], [t_carp, 1, 3.3], [t_carp + 0.1, 0.5, 2.6],
                   [t_carp + 0.35, 1, 3.1], [t_esik + 0.2, 1, 3.1], [L0 - 0.15, 0.25, 2.6], [L0, 0.15, 2.6]],
        "sac": [[0, 9], [t_don0, 9], [t_don0 + 0.01, 1.25], [t_don1, -1.25], [t_don1 + 0.01, 9],
                [t_bk0, 9], [t_bk0 + 0.01, -1.1], [t_bk1, 1.2], [t_bk2, 1.0], [t_bk3, -1.2], [t_bk3 + 0.01, 9],
                [t_carp + 0.02, 9], [t_carp + 0.03, -0.9], [t_carp + 0.25, 1.1], [t_carp + 0.26, 9]],
        "titreme": [[0, 0.8], [t_don1, 0.3], [t_bk1, 0.5], [t_bk3, 0.3], [t_esik, 0]],
        "sars": [[0, 0.4], [0.3, 0.6], [t_don0, 0.2], [t_don1, 0], [t_carp - 0.01, 0], [t_carp, 1.3], [t_carp + 0.12, 0.5], [t_carp + 0.3, 0]],
        "fov": [[0, 0.92], [t_don0, 0.95], [t_don1, 1.0], [t_bk1, 1.04], [t_bk2, 1.06], [t_bk3, 1.0]],
        "kalp": [[0, 1], [t_esik, 0.8], [L0, 0.4]], "kirmizi": [[0, 0.8], [t_don1, 0.3], [t_bk1, 0.5], [t_bk3, 0.25], [t_esik, 0]],
        "flas": [[0, 0], [t_esik - 0.05, 0], [t_esik + 0.05, 0.12], [t_esik + 0.45, 0]],
        "kosEl": [[0, 0], [t_kos, 0], [t_kos + 0.2, 1], [t_bk0, 1], [t_bk1, 0.3], [t_bk2, 0.3], [t_bk3, 1], [t_esik + 0.25, 1], [L0 - 0.2, 0.45], [L0, 0.35]],
        "depoYaratik": {"koridor": [[0, -1.3, 3.42, 0, 0], [1.0, -1.3, 3.42, 0, 0], [1.12, -0.75, 3.42, 2, 1], [1.5, -0.4, 3.28, 5, 1], [2.2, -0.15, 2.85, 9, 1],
                                    [3.3, 0.0, 2.3, 14, 1], [L0, 0.0, 2.0, 17, 0.8]],
                        "yer": [[0, -2.7, 3.3, 12], [0.6, -1.75, 3.38, 17], [1.0, -1.3, 3.42, 20]], "on": [[0, 1]], "boy": [[0, 0.62]],
                        "agiz": [[0, 1]], "seg": [[0, 0.6], [0.15, 1], [0.4, 0.3]]}}

# Mert (diz çökmüş) ve kaçan kız (yerde, başı Mert'in göğsünde) — reyonların arasında, kapının ilerisinde
MZ = -3.9
gecti0, gecti1 = m1a + w["Geçti"]["start"] - 0.1, m1a + w["Geçti"]["end"] + 0.15
t_tamam = m1a + w["tamam"]["start"]
# saçını okşayan sağ el: yavaş okşama; "Geçti..." boyunca ince, hızlı titreme (dingin görünür ama korkuyor)
EL_R = []
import math as _m  # noqa: E402
for i in range(int(L0 * KARE) + 2):
    tt = i / KARE
    ok = 0.5 - 0.5 * _m.cos(tt * 2 * _m.pi / 0.95)
    tr = 0.011 * (1 if i % 2 else -1) * (1.0 if gecti0 <= tt <= gecti1 else 0.35 if gecti1 < tt < t_tamam + 0.3 else 0)
    EL_R.append([round(tt, 3), round(-0.17 + 0.07 * ok + tr, 4), round(0.9 - 0.05 * ok + tr * 0.6, 4), MZ + 0.08])
mert = {"id": "mert724", "w": [-0.42, -0.55, MZ], "boy": 1.75,
        "q": {"onKol": True, "dogalKol": True, "duygu": [[0, "uzgun"]], "bak": [[0, -0.45, 0.45, -0.35], [t_tamam - 0.2, -0.45, 0.45, -0.35], [t_tamam + 0.05, 0.05, -0.08, 0.08]],
              "tilt": [[0, -9], [t_tamam - 0.2, -9], [t_tamam + 0.05, -2]],
              "elL3": [0.16, 0.5, MZ + 0.1],
              "elR3": EL_R,
              "gozSok": [[0, 0], [t_tamam - 0.15, 0], [t_tamam, 0.55]],
              "konus": [{"t": round(m1a, 3), "cues": M[TAKE["M1"]]["mouth"]}], "yay": 1}}
TUTAM = [-0.5, 0.6, MZ + 0.2]
kiz = {"id": "kacan724", "w": [0.12, -0.85, MZ + 0.1], "boy": 1.65, "tutam3": TUTAM,
       # yerde: sağ bacak dizden kıvrık (çıplak ayak, kirli taban), sol bacak uzanmış (beyaz spor ayakkabı)
       "bacak3": [{"n": [[0.2, 0.08, MZ + 0.2], [0.42, 0.3, MZ + 0.42], [0.5, 0.06, MZ + 0.66], [0.56, 0.04, MZ + 0.82]], "ayak": "ciplak"},
                  {"n": [[0.28, 0.07, MZ + 0.14], [0.6, 0.1, MZ + 0.3], [0.86, 0.07, MZ + 0.48], [0.95, 0.07, MZ + 0.62]], "ayak": "ayakkabi"}],
       "q": {"onKol": True, "dogalKol": True, "duygu": [[0, "uzgun"]], "bak": [[0, 0.5, 0.2, 0.45]], "egil": [[0, 15]], "tilt": [[0, 10]],
             "goz": [[0, 0.85]], "tears": 0.5, "elL3": TUTAM, "sacDagin": 1, "nefes": [[0, 2.2]]}}
FPSP["kacis"] = {"kar": [mert, kiz]}

# ------------------------------------------------------------------ YAN: Ece kapıyı çarpar, yaslanır, nefes nefese → fısıltı → "sus" → tırnaklar → ayakkabı → kibar vuruş → ses
K1 = M["K1a_01"]                           # kız (ekran dışı, Mert'in göğsüne gömülü): "Gitti mi?"
Y1 = M["Y1c_01"]                           # yaratık (kapının ardından, kibar): "Sayın bezmenler, lütfen kapıyı açar mısınız?"
y0 = L0
r = lambda v: round(y0 + v, 3)             # YAN içi göreli zaman → sahne zamanı
t_bak = r(0.12)                            # başını kapıya çevirir
t_tut = r(0.3)                             # kolu yakalar
t_pat = r(0.5)                             # kapı ÇARPILIR
t_yas = r(0.85)                            # sırtını kapıya verir
t_nef = r(1.05)                            # birden nefes nefese
t_golge = r(2.35)                          # kapının altındaki ışık şeridinden bir gölge geçer, durur
t_tut2 = r(2.6)                            # Ece nefesini tutar, gözleri yana kayar
t_k1 = r(2.95)                             # fısıltı başlar ("Gitti mi?")
K1D = round(round((K1["duration"] + 0.2) * KARE) / KARE, 4)
t_sus = r(3.12)                            # Ece başını sola (Mert'e) çevirir, işaret parmağı dudaklarında
t_tir0, t_tir1 = r(3.75), r(4.45)          # tırnaklar kapıyı kazır (sırtında hisseder) → ses birden KESİLİR
t_comel = r(4.6)                           # sessizlik: kapı altındaki gölge genişler (bir şey yere çömeliyor)
t_ay0 = r(5.0)                             # ayakkabı sesi başlar (itme 0.35, gıcırtı 1.03, pop 1.57 dosya içinde)
t_it, t_gic, t_pop = round(t_ay0 + 0.35, 3), round(t_ay0 + 1.03, 3), round(t_ay0 + 1.57, 3)
t_don = round(t_pop + 0.08, 3)             # Ece donar
t_tik = r(7.3)                             # iki kibar vuruş (dosya: 0.025, 0.35)
t_v1, t_v2 = round(t_tik + 0.025, 3), round(t_tik + 0.35, 3)
t_y1 = r(7.95)                             # yaratığın kibar sesi
Y1D = round(round((Y1["duration"] + 0.1) * KARE) / KARE, 4)
yw = {x["w"].strip(".,?"): x for x in Y1["words"]}
t_kay = round(t_y1 + yw["lütfen"]["start"] - 0.1, 3)   # gözleri yavaşça kapıya kayar
t_yut = round(t_y1 + yw["açar"]["start"] + 0.05, 3)    # yutkunur ("açar mısınız")
SON = round(t_y1 + Y1D + 0.5, 3)
YAN = round(SON - y0, 4)

EB = P1.yI(1.33, 1.38, 1.6)                # markete fırlamış (kapının önü)
EY = P1.yI(1.42, 1.74, 1.6)                # kapıya yaslanmış
S = EY[2] / 1000
yP = P1.yP
import math  # noqa: E402
KANAT, DX2, WZ = 0.85, 1.9, 1.9


def kol(acik):
    """kapı kolunun ekran noktası (kanat açıklığına göre)"""
    a = max(0, min(1.05, acik)) * 1.66
    ex, ez = DX2 - KANAT * math.cos(a), WZ + KANAT * math.sin(a)
    hx, hz = ex + 0.1 * (DX2 - ex) / KANAT, ez + 0.1 * (WZ - ez) / KANAT
    return [round(v, 1) for v in yP(hx, 1.0, hz)]


DEPO = [[0, 1], [t_tut, 0.92], [t_tut + 0.08, 0.6], [t_pat - 0.04, 0.12], [t_pat, 0], [t_pat + 0.06, 0.025], [t_pat + 0.13, 0], [SON, 0]]
kl = lambda a: kol(a)
# Ece'nin yaslandığı yer: tırnaklar kapıyı kazırken sırtında hisseder (ince titreşim); her kibar vuruşta küçük sarsılma
YER = [[0, *EB], [t_tut, *EB], [t_pat, EB[0] + 6, EB[1], EB[2]], [t_yas, *EY], [t_tut2, EY[0], EY[1] + 22, EY[2]], [round(t_tir0, 3), EY[0], EY[1] + 23, EY[2]]]
for i in range(1, int((t_tir1 - t_tir0) * 30)):
    YER.append([round(t_tir0 + i / 30, 3), EY[0] + (1.6 if i % 2 else -1.6), EY[1] + 23, EY[2]])
YER += [[t_tir1 + 0.03, EY[0], EY[1] + 23, EY[2]], [t_pop, EY[0], EY[1] + 23, EY[2]], [t_pop + 0.05, EY[0] - 3, EY[1] + 21, EY[2]], [t_pop + 0.2, EY[0], EY[1] + 24, EY[2]]]
for tv in (t_v1, t_v2):
    YER += [[round(tv - 0.01, 3), EY[0], EY[1] + 24, EY[2]], [round(tv + 0.03, 3), EY[0] + 3.5, EY[1] + 24, EY[2]], [round(tv + 0.14, 3), EY[0], EY[1] + 24, EY[2]]]
YER.append([SON, EY[0], EY[1] + 24, EY[2]])
AGIZ = [EY[0] + 6 * S, EY[1] + 23 - 640 * S]    # dudak hizasının altı (el hedefi; parmak yukarı, dudakların üstünden geçer)
GOGUS = [EY[0] + 44 * S, EY[1] - 636 * S]
ECE = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True, "yay": 1,
    "yer": YER,
    "yuru": [[t_pat + 0.02, t_yas]],
    "ezil": [[t_yas - 0.01, 0], [t_yas + 0.04, 0.05], [t_yas + 0.14, -0.02], [t_yas + 0.24, 0], [t_tir0, 0], [t_tir0 + 0.06, 0.03], [t_tir0 + 0.2, 0],
             [t_pop, 0], [t_pop + 0.05, 0.04], [t_pop + 0.2, 0]],
    "elL": [[0, EB[0] - 95 * S, EB[1] - 640 * S], [t_bak, EB[0] - 95 * S, EB[1] - 640 * S], [t_tut, *kl(0.92)], [t_tut + 0.08, *kl(0.6)],
            [t_pat - 0.04, *kl(0.12)], [t_pat, *kl(0)], [t_yas, EY[0] - 120 * S, EY[1] - 420 * S], [t_nef, EY[0] - 130 * S, EY[1] - 400 * S],
            [t_tir0, EY[0] - 128 * S, EY[1] - 402 * S], [t_tir0 + 0.1, EY[0] - 150 * S, EY[1] - 380 * S],   # avucu kapıya bastırır
            [SON, EY[0] - 150 * S, EY[1] - 380 * S]],
    "elR": [[0, EB[0] + 110 * S, EB[1] - 600 * S], [t_pat, EB[0] + 100 * S, EB[1] - 560 * S], [t_yas, EY[0] + 120 * S, EY[1] - 420 * S],
            [t_nef + 0.3, *GOGUS], [t_sus - 0.02, *GOGUS], [round(t_sus + 0.2, 3), *AGIZ], [round(t_it + 0.15, 3), *AGIZ],
            [round(t_it + 0.75, 3), AGIZ[0] + 10 * S, AGIZ[1] + 120 * S], [SON, AGIZ[0] + 10 * S, AGIZ[1] + 125 * S]],   # sus → el çenesine iner, kalır
    "tutR": [[0, None], [round(t_sus + 0.06, 3), "isaret"], [round(t_it + 0.5, 3), None]],
    "isaretAci": 4,
    "duygu": [[0, "dehset"], [t_yas, "korkmus"], [t_nef, "agizAcik"], [t_tut2, "korkmus"]],
    "bak": [[0, -0.3, 0, -0.35], [t_bak, 0.75, -0.05, 0.7], [t_pat + 0.05, 0.75, -0.05, 0.7], [t_yas, 0.05, -0.3, 0.05],
            [t_nef + 0.6, 0.0, -0.45, 0.0], [t_tut2 - 0.15, -0.1, 0.1, -0.05], [t_tut2, -0.1, 0.1, -0.05], [round(t_tut2 + 0.3, 3), 0.7, 0.35, 0.15],
            [t_sus - 0.05, 0.7, 0.35, 0.15], [t_sus + 0.12, -0.8, 0.05, -0.55], [t_tir0, -0.8, 0.05, -0.55],
            [t_tir0 + 0.12, 0.55, 0.15, -0.2], [t_it, 0.55, 0.15, -0.15],                      # tırnaklar: gözü kapıya döner, baş Mert'te kalır
            [t_it + 0.25, 0.3, 0.95, 0.08], [t_gic, 0.35, 1.0, 0.12], [t_don, 0.35, 1.0, 0.12],   # aşağı bakar (ayakkabı)
            [round(t_tik - 0.05, 3), 0.35, 1.0, 0.12], [round(t_v2 + 0.25, 3), 0.0, 0.2, 0.0],     # vuruşlarla başını kaldırır, öne bakar
            [t_kay, 0.0, 0.15, 0.0], [round(t_kay + 0.9, 3), 0.62, 0.1, 0.05], [SON, 0.66, 0.12, 0.06]],   # gözler yavaşça kapıya kayar
    "tilt": [[0, -6], [t_bak, 6], [t_pat, 8], [t_yas, -3], [t_nef, -7], [t_tut2, -6], [t_tut2 + 0.4, 4], [t_sus, 4], [t_sus + 0.15, -5],
             [t_it, -5], [t_gic, 3], [round(t_tik, 3), 3], [round(t_v2 + 0.25, 3), 1], [SON, 2]],
    "egil": [[0, 4], [t_tut, -3], [t_pat, -6], [t_yas, -2], [t_nef, -1.5], [t_it, -1.5], [t_gic, 3.5], [round(t_tik - 0.05, 3), 3.5], [round(t_v2 + 0.25, 3), -1], [SON, -1]],
    "goz": [[0, 0], [t_nef + 0.25, 0], [t_nef + 0.45, 1], [t_nef + 1.0, 1], [t_nef + 1.2, 0]],
    "gozSok": [[0, 0.8], [t_yas, 0.4], [t_nef, 0], [t_tut2, 0], [t_tut2 + 0.12, 1], [t_sus, 1], [t_tir0, 1], [t_tir0 + 0.05, 0.6], [t_tir1, 0.7],
               [t_pop, 0.8], [t_don, 1], [SON, 1]],
    "nefes": [[0, 2.4], [t_nef - 0.01, 2.4], [t_nef, 4.2], [t_tut2 - 0.01, 4.2], [t_tut2, 0.25]],
    "yutkun": [[0, 0], [t_yut, 0], [round(t_yut + 0.55, 3), 1]],
    "sacDagin": 0.6,
}
CAM = {"yan": []}
GAP = [round(v, 1) for v in yP(1.475, 0.0, 1.9)]
TOP = [round(v, 1) for v in yP(1.475, 2.12, 1.89)]
AYK = [round(v, 1) for v in yP(1.6, 0.0, 1.72)]
# levha: sağ vidası fırlar, sol vidada sönümlü sallanır (oturduğu açı 11°); her kibar vuruşta hafifçe titrer
LEVHA = [[0, 0], [t_pat, 0]] + [[round(t_pat + 0.02 + i * 0.04, 3), round(11 * (1 - math.exp(-3.2 * i * 0.04) * math.cos(9.5 * i * 0.04)), 2)] for i in range(40)]
for tv in (t_v1, t_v2):
    LEVHA += [[round(tv + i * 0.035, 3), round(11 + 1.4 * math.exp(-5 * i * 0.035) * math.sin(14 * i * 0.035) * (1 if i else 0), 2)] for i in range(9)]
LEVHA.sort(key=lambda k: k[0])
KURGU = [[round(y0, 3), "yan"]]
P1.SINIR["yan"] = (0, 1080, 0, 1920)
fy = lambda q, k=0.765: q[1] - k * q[2]
CAM["yan"] = [[round(y0, 3)] + P1.kirp("yan", EB[0] - 40, fy(EB, 0.5), 1.35),
              [round(t_yas, 3)] + P1.kirp("yan", EY[0] - 20, fy(EY, 0.55), 1.45),
              [round(t_golge - 0.1, 3)] + P1.kirp("yan", EY[0], fy(EY, 0.72), 2.05),
              [round(t_golge + 0.2, 3)] + P1.kirp("yan", GAP[0] + 40, GAP[1] - 120, 2.3),
              [round(t_tut2 + 0.3, 3)] + P1.kirp("yan", GAP[0] + 40, GAP[1] - 125, 2.4),
              [round(t_sus, 3)] + P1.kirp("yan", EY[0] + 10, fy(EY, 0.76), 2.35),
              [round(t_tir1, 3)] + P1.kirp("yan", EY[0] + 10, fy(EY, 0.77), 2.45),
              [round(t_it - 0.1, 3)] + P1.kirp("yan", EY[0] + 10, fy(EY, 0.76), 2.45),
              [round(t_it + 0.55, 3)] + P1.kirp("yan", 745, 1150, 2.5),          # dikey kompozisyon: üstte Ece'nin yüzü, altta ayakkabı
              [round(t_don + 0.6, 3)] + P1.kirp("yan", 745, 1148, 2.58),
              [round(t_v2 + 0.15, 3)] + P1.kirp("yan", 745, 1146, 2.62),
              [round(t_kay, 3)] + P1.kirp("yan", 742, 1120, 2.62),
              [round(t_yut, 3)] + P1.kirp("yan", EY[0] + 20, 1040, 2.75),
              [round(SON, 3)] + P1.kirp("yan", EY[0] + 14, fy(EY, 0.8), 3.3)]
# ayakkabı: kapı altından (Z > 1.9 görünmez) yassı çıkar, "pop" diye şekline döner, Ece'nin ayaklarının dibinde durur
AYAK = [[t_it, 1.7, 2.03, 62, 1], [round(t_it + 0.3, 3), 1.69, 1.9, 64, 1], [t_gic, 1.68, 1.8, 66, 1], [round(t_pop - 0.05, 3), 1.67, 1.76, 68, 0.95],
        [round(t_pop + 0.05, 3), 1.66, 1.73, 72, -0.22], [round(t_pop + 0.12, 3), 1.64, 1.7, 77, 0.1], [round(t_pop + 0.2, 3), 1.63, 1.69, 79, 0], [SON, 1.63, 1.69, 79, 0]]
# kapı altı ışık şeridi: [ışık, gölge merkezi (0..1), genişlik]
KAPIALT = ([[0, 0, -1, 0.25], [t_pat, 0, -1, 0.25], [t_pat + 0.1, 0.7, -1, 0.25]]
           + [[round(t_pat + 0.3 + i * 0.3, 2), 0.55 + 0.35 * (i % 2), -1, 0.25] for i in range(int((t_golge - t_pat) / 0.3))]
           + [[t_golge, 0.8, 1.2, 0.22], [t_golge + 0.5, 0.75, 0.78, 0.26], [t_tir0, 0.72, 0.78, 0.26], [t_tir1, 0.7, 0.77, 0.27],
              [t_comel, 0.7, 0.77, 0.27], [round(t_comel + 0.3, 3), 0.62, 0.74, 0.42], [round(t_pop + 0.1, 3), 0.62, 0.74, 0.42],
              [round(t_pop + 0.5, 3), 0.7, 0.78, 0.26], [t_v1 - 0.02, 0.7, 0.78, 0.26], [t_v1 + 0.04, 0.55, 0.78, 0.26], [t_v1 + 0.15, 0.7, 0.78, 0.26],
              [t_v2 - 0.02, 0.7, 0.78, 0.26], [t_v2 + 0.04, 0.55, 0.78, 0.26], [t_v2 + 0.15, 0.7, 0.78, 0.26], [SON, 0.7, 0.78, 0.26]])
ORTAK = {"t0": 0, "saat": [[0, "00:04"]], "kapi": [[0, 0]], "flor": [[0, 0.85]], "cizir": [[t_pat, t_pat + 0.3]], "lamba": [[0, 0]],
         "titre": {"yan": 1.0}, "eceArkada": True, "odak": [[0, 0]], "depo": DEPO, "depoKol": [[0, 0]], "toz": [[0, 0]],
         "sars": [[0, 0], [t_pat - 0.01, 0], [t_pat, 1.1], [t_pat + 0.4, 0], [t_tir0, 0], [t_tir0 + 0.05, 0.12], [t_tir1, 0.1], [t_tir1 + 0.02, 0],
                  [t_v1 - 0.01, 0], [t_v1, 0.18], [t_v1 + 0.12, 0], [t_v2 - 0.01, 0], [t_v2, 0.18], [t_v2 + 0.12, 0]],
         "anime": {}, "animeMerkez": {}, "levha": LEVHA, "kapiAltBas": 0.6, "kapiAlt": KAPIALT,
         "ayakkabi": AYAK, "ayakkabiIz": [1.68, 1.9],
         "fx": [[t_pat + 0.02, "dokuntu", "yan", TOP[0], TOP[1], 0.8, 1.7]]}


def E(t, isim, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t, 3), "volume": vol, **kw}


SFX1 = [E(1.0, "b9_floresan", 0.22), E(0, "b8y3_yaratik", 0.75), E(0.05, "b8y4_ece_ciglik", 0.8), E(t_don0, "b8y3_donus", 0.65), E(t_kos, "b8y3_kalk_kos", 0.6),
        E(t_kos + 0.1, "b8y3_adim", 0.75, sure=F1 - t_kos), E(t_kos, "b8y3_nefes_kosu", 0.6, sure=F1 - t_kos), E(0, "kalp_atisi", 0.35, sure=F1),
        E(t_bk1 - 0.05, "b8y3_yaratik", 0.35, kirp=0.6, sure=0.7),                               # geriye bakınca: çok yakından hırıltı
        E(t_carp - 0.01, "b8y4_raf_dusus", 0.42, sure=0.5), E(t_carp + 0.4, "esya_dusme", 0.55)]  # omuz + koli; koli arkada yere düşer
SFX2 = [E(0, "b8y3_adim", 0.55, sure=t_esik - F1 + 0.3), E(0, "b8y3_nefes_kosu", 0.45, sure=F2),
        E(0.25, "b8y3_yaratik", 0.3, kirp=1.0), E(0, "kalp_atisi", 0.25, sure=F2)]
SFX3 = [E(t_pat - y0 - 0.02, "b8y4_kapi_pat", 1.0), E(t_pat - y0 + 0.04, "b9_levha", 0.6),
        E(t_nef - y0, "b8y4_ece_nefes", 0.85, sure=t_tut2 - t_nef), E(t_golge - y0, "b9_kapi_arkasi", 0.9, kirp=0.1, sure=round(t_tir1 - t_golge, 3)),
        E(t_tir0 - y0, "b9_kapi_arkasi", 1.0, kirp=1.5, sure=round(t_tir1 - t_tir0, 3))]   # tırnak kuyruğu ikinci katman (kazıma öne çıksın, kesilişi duyulsun)
SFX5 = [E(t_ay0 - (t_k1 + K1D), "b9_ayakkabi", 0.85), E(t_tik - (t_k1 + K1D), "b9_kibar_tik", 0.8)]

if __name__ == "__main__":
    ep_id = "724-09-p1"
    fps2 = dict(FPSP, t0=F1)

    def yan(t0):
        return {"kind": "b8_market", "text": [json.dumps({**ORTAK, "t0": round(t0, 3), "kurgu": KURGU, "cam": CAM, "kar": {"yan": {"ece": ECE}}}, ensure_ascii=False, separators=(",", ":"))]}

    beats = [
        {"type": "insert", "dur": F1, "kind": "b8_fps", "text": [json.dumps(dict(FPSP, t0=0), separators=(",", ":"))], "sfx": SFX1},
        {"type": "line", "who": "mert724", "text": METIN["M1"][1], "emotion": "notr", "gapAfter": round(F2 - m1d, 4),
         "ekle": {"kind": "b8_fps", "text": [json.dumps(fps2, separators=(",", ":"))]}, "sfx": SFX2},
        {"type": "insert", "dur": round(t_k1 - y0, 4), **yan(y0), "sfx": SFX3},
        {"type": "line", "who": "kacan724", "text": "Gitti mi?", "emotion": "notr", "gapAfter": round(K1D - K1["duration"], 4), "ekle": yan(t_k1)},
        {"type": "insert", "dur": round(t_y1 - (t_k1 + K1D), 4), **yan(t_k1 + K1D), "sfx": SFX5},
        {"type": "line", "who": "yaratik724b", "label": "", "text": "Sayın bezmenler, lütfen kapıyı açar mısınız?", "emotion": "notr",
         "gapAfter": round(Y1D - Y1["duration"], 4), "ekle": yan(t_y1)},
        {"type": "insert", "dur": round(SON - (t_y1 + Y1D), 4), **yan(t_y1 + Y1D)},
    ]
    man = {k: v for k, v in M.items() if not k.startswith("i_")}
    man["i_02"] = M[TAKE["M1"]]
    man["i_04"] = K1
    man["i_06"] = Y1
    json.dump(man, open(f"{VD}/manifest.json", "w"), ensure_ascii=False, indent=1)
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Depo · kaçış", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.26}, "music": {"name": "yok"}, "beats": beats}
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 9, "title": "Bölüm 9 · Parça 1", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON:.2f} sn  (FPS1 {F1}, FPS2 {F2}, YAN {YAN})  fısıltı {t_k1}  sus {t_sus}  tırnak {t_tir0}-{t_tir1}  ayakkabı {t_it}/pop {t_pop}  vuruş {t_v1},{t_v2}  ses {t_y1}  yutkun {t_yut}")
