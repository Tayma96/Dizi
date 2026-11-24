"""7/24 Bölüm 8 (yeni) Parça 1: "ölüme gönderdin beni abi" → depo kapısı → Mert → anime aşk anı → "bu insan mı?" → önlük.
Kullanım: python3 tools/b8y_p1.py [--cekim M1=M1b_01 ...]  -> public/episodes/724-08y-p1.json (+ manifest anahtarları)
Kullanıcının replikleri AYNEN; doğaçlamalar (kullanıcı onaylı, bolumler.md "B8 (yeni) P1: doğaçlama önerisi"):
  sözsüz bölünmüş yüz + duvardaki gölge kontrolü + kola dürtme; Ece: "Abi... bu insan mı?" (âşık tonda); Sabri: "Sakin ol, henüz gece olmadı."
Kanca A (kullanıcı): Ece tezgâha avuçlarını vurur; Sabri konuşurken arkada depo kapısının kolu iner (Ece somurtup tezgâha bakar,
görmez); kapı "geçer"de açılır.
GÖRÜNTÜ (DoP yeniden tasarım, 24 Kasım 2026; rapor: docs/diziler/724/raporlar/b8y-p1-goruntu.md):
  yan    : YENİ ana açı (sets/market724yan): tezgâh yandan-çapraz; Ece solda (müşteri), Sabri sağda (tezgâh arkası), DEPO kapısı
           arkada kadraj İÇİNDE. Establishing, kolun inişi (izleyici görür, Ece görmez), kapının aralanıp açılması, Mert'in
           ters ışıkta siluetten ışığa çıkışı bu açıda.
  kasa   : Sabri'ye omuz üstü (OTS): önde Ece'nin ensesi/at kuyruğu (bulanık), Sabri kadraj soluna (Ece'ye) bakar.
  tezgah : Ece'ye ters OTS: önde Sabri'nin ensesi/omzu (sağda, bulanık), Ece kadraj sağına (Sabri'ye) bakar.
180°: bütün açılarda Ece SOLDA, Sabri (ve Mert) SAĞDA; kameralar eksenin aynı (müşteri/doğu) tarafında.
"""
import json, os, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
VFROM = 2 / FPS

VD = f"{K}/public/voice/724-08y-p1"
M = json.load(open(f"{VD}/manifest.json"))
TAKE = {"E1": "E1a_01", "S1": "S1a_01", "S2": "S2a_01", "E2": "E2a_01", "M1": "M1a_01", "E3": "E3a_01", "E4": "E4a_01",
        "S3": "S3a_01", "S4": "S4a_01", "S5": "S5a_01", "E5": "E5a_01"}
for a in sys.argv[1:]:
    for kv in a.replace("--cekim", "").split(","):
        if "=" in kv:
            k, v = kv.strip().split("=")
            TAKE[k] = v
METIN = {"E1": ("ece_sivil", "ölüme gönderdin beni abi"),
         "S1": ("sabri", "kurallara uy ece, gayet başarılıydın sadece o önlüğü attığın sövmen 3. Kuralı bozdu, zamanlamayla kurtardın."),
         "S2": ("sabri", "Ha kurallara uyup profesyonelce çalışırsın sorunsuz bi gece geçer"),
         "E2": ("ece_sivil", "aaaa yine miii"),
         "M1": ("mert724", "Abi depoyu topladım, malzemeleri yerleştirdim"),
         "E3": ("ece_sivil", "onee laan"),
         "E4": ("ece_sivil", "Abi... bu insan mı?"),
         "S3": ("sabri", "Sakin ol, henüz gece olmadı."),
         "S4": ("sabri", "Aferin Mert eline sağlık"),
         "S5": ("sabri", "Ece bu Mert, bu gece vardiyasında o olacak. Erkenden gelip yardım etmek istemiş sağ olsun."),
         "E5": ("ece_sivil", "Benim önlüğüm nerde abi")}

# (ad, replik|None, süre (insert) ya da boşluk (replik))
SIRA = [
    ("GIRIS", None, 0.3),    # eller havada → BAM
    ("E1", "E1", 0.25),
    ("S1", "S1", 0.2),       # kol inmeye başlar
    ("S2", "S2", 0.15),      # "geçer": kapı açılır
    ("E2", "E2", 0.1),
    ("M1", "M1", 0.15),
    ("DON", None, 1.0),      # Ece donar → anime
    ("PARILTI", None, 1.8),  # Mert, anime ışığında
    ("E3", "E3", 0.3),
    ("BOL", None, 1.35),     # bölünmüş yüz: bir göz âşık, bir göz şüpheli; duvara bakar
    ("GOLGE", None, 1.1),    # duvarda gölgesi var
    ("DURT", None, 2.3),     # kola dürter; Mert tek kaş
    ("E4", "E4", 0.25),
    ("S3", "S3", 0.3),
    ("S4", "S4", 0.15),
    ("S5", "S5", 0.3),
    ("E5", "E5", 1.0),
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
SINIR = {"kasa": (0, 1080, 0, 1920), "tezgah": (0, 1080, 0, 1920), "yan": (0, 1080, 0, 1920)}


def kirp(view, cx, cy, z, pay=10):
    x0, x1, y0, y1 = SINIR[view]
    hw, hh = 540 / z + pay, 960 / z + pay
    return [round(min(max(cx, x0 + hw), x1 - hw), 1), round(min(max(cy, y0 + hh), y1 - hh), 1), round(z, 3)]


CAM = {v: [] for v in SINIR}
KURGU = []


def kes(t, view, cx, cy, z):
    k = CAM[view]
    if k:
        k.append([round(t - 0.004, 3)] + k[-1][1:])
    k.append([round(t, 3)] + kirp(view, cx, cy, z))
    KURGU.append([round(t, 3), view])


def it(t, view, cx, cy, z):
    CAM[view].append([round(t, 3)] + kirp(view, cx, cy, z))


# ------------------------------------------------------------------ YAN açı izdüşümü (src/studio/sets/market724yan.tsx ile AYNI)
import math  # noqa: E402
_YC, _YH, _YF = (1.9, 1.45, -3.4), (1.0, 1.0), 1600
_YT = math.atan2(_YH[0] - _YC[0], _YH[1] - _YC[2])
_YS, _YCS = math.sin(_YT), math.cos(_YT)


def yP(X, Y, Z):
    dx, dz = X - _YC[0], Z - _YC[2]
    d = max(0.2, dx * _YS + dz * _YCS)
    return 540 + _YF * (dx * _YCS - dz * _YS) / d, 900 - _YF * (Y - _YC[1]) / d


def yI(X, Z, boy=1.62):
    """karakter işareti [x, y, size] (yüz = y - 0.765·size)"""
    x, y = yP(X, 0, Z)
    d = (X - _YC[0]) * _YS + (Z - _YC[2]) * _YCS
    return [round(x, 1), round(y, 1), round(_YF * boy * 0.93 / d / 765 * 1000, 1)]


# ------------------------------------------------------------------ yerleşimler (tezgah/kasa: P2 ile aynı eksen)
EX, EY, ES = 450, 1700, 1250
EYUZ = EY - 765 * ES / 1000
SX, SY, SS = 540, 1960, 1180
SYUZ = SY - 765 * SS / 1000
KX, KS = 150, 1650           # kasa görünümünde Ece ÖNDE, solda
KYUZ = 990
KY = KYUZ + 765 * KS / 1000
MX, MY, MS = 800, 1960, 1300  # Mert tezgâhın arkasında, Sabri'nin sağında
MYUZ = MY - 765 * MS / 1000
DX, DY, DS = 1030, 1345, 900  # depo eşiği

# ------------------------------------------------------------------ zamanlar
g0 = T["GIRIS"]
t_bam = g0 + 0.2
e1a, e1b = V("E1"); t_gon = W("E1", "gönderdin"); t_abi1 = W("E1", "abi")
s1a, s1b = V("S1"); t_ece = W("S1", "ece"); t_sad = W("S1", "sadece"); t_onl = W("S1", "önlüğü"); t_boz = W("S1", "bozdu"); t_zam = W("S1", "zamanlamayla")
s2a, s2b = V("S2"); t_ha = W("S2", "ha"); t_prof = W("S2", "profesyonelce"); t_sor = W("S2", "sorunsuz"); t_gecer = W("S2", "geçer")
e2a, e2b = V("E2"); t_yine = W("E2", "yine")
m1a, m1b = V("M1"); t_dep = W("M1", "depoyu"); t_malz = W("M1", "malzemeleri"); t_yer = W("M1", "yerleştirdim")
d0 = T["DON"]; p0 = T["PARILTI"]
e3a, e3b = V("E3"); t_laan = W("E3", "laan")
b0 = T["BOL"]; go0 = T["GOLGE"]; u0 = T["DURT"]
e4a, e4b = V("E4"); t_bu = W("E4", "bu"); t_ins = W("E4", "insan")
s3a, s3b = V("S3"); t_hen = W("S3", "henüz")
s4a, s4b = V("S4"); t_mert1 = W("S4", "mert")
s5a, s5b = V("S5"); t_bum = W("S5", "mert"); t_erk = W("S5", "erkenden"); t_sag = W("S5", "sağ")
e5a, e5b = V("E5"); t_onl5 = W("E5", "önlüğüm")

# kesmeler (örnek sahne: açılış → Mert'in çıkışı)
c2 = s1a - 0.1              # Sabri OTS
c3 = t_sad + 0.75           # Ece OTS ("o önlüğü attığın sövmen…")
c4 = t_zam - 0.1            # YAN geniş: kol iner, kamera kapıya kayar
c5 = t_prof + 0.15          # kol yakın planı: kol dipte, kapı ARALANIR (ışık çizgisi)
c6 = t_sor - 0.0            # YAN orta: "sorunsuz bi gece geçer" → kapı AÇILIR
c7 = e2a - 0.0              # Ece yakın: "aaaa yine miii"
c8 = m1a - 0.12             # kapı: Mert ters ışıkta siluet → ışığa adım
c9 = t_malz - 0.05          # YAN geniş: Mert tezgâha yürür
t_kol0 = c4 + 0.45          # kol inmeye başlar (YAN genişte; izleyici görür, Ece tezgâha bakıyor)
t_kol1 = c5 + 0.55          # kol tam aşağıda (mandal); kapı aralanır
t_aralik = t_kol1 + 0.12    # kapı 5° aralanır: kenarda ışık çizgisi
t_kapi = t_gecer            # kapı açılır
t_durt1, t_durt2 = u0 + 0.75, u0 + 1.05

# ------------------------------------------------------------------ KARAKTERLER
EL_L, EL_R = (EX - 64, 1194), (EX + 80, 1194)                # tezgâhta
ELH_L, ELH_R = (EX - 130, 1010), (EX + 130, 1010)              # havada (vurmadan önce)
# --- TEZGAH: Ece (Sabri'nin tarafından, kameraya dönük)
A_ = {"sabri": (0.42, -0.02, 0.3), "mert": (0.55, -0.12, 0.32), "kapi": (0.7, -0.2, 0.4), "duvar": (0.62, -0.6, 0.3), "asagi": (0.05, 0.6, 0)}
ECE_TZ = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": sirala([[0, EX, EY + 30, ES + 25], [t_bam, EX, EY + 60, ES + 55], [t_bam + 0.25, EX, EY + 45, ES + 40], [e1b, EX, EY + 35, ES + 30],
                   [e2a - 0.02, EX, EY + 35, ES + 30], [e2a + 0.15, EX, EY - 35, ES - 40], [e2b, EX, EY - 30, ES - 35],     # E2: geri sıçrar
                   [d0, EX, EY - 30, ES - 35], [d0 + 0.9, EX, EY, ES], [SON_T, EX, EY, ES]]),
    "elL": sirala([[0, *ELH_L], [t_bam - 0.06, *ELH_L], [t_bam, *EL_L], [e2a, *EL_L], [e2a + 0.12, EX - 160, 1000], [e2b + 0.1, EX - 150, 1010],
                   [d0 + 0.4, EX - 110, 1100], [d0 + 0.8, *EL_L], [SON_T, *EL_L]]),
    "elR": sirala([[0, *ELH_R], [t_bam - 0.06, *ELH_R], [t_bam, *EL_R], [e2a, *EL_R], [e2a + 0.12, EX + 160, 1000], [e2b + 0.1, EX + 150, 1010],
                   [d0 + 0.4, EX + 110, 1100], [d0 + 0.8, *EL_R], [e5a, *EL_R],
                   # E5: önlüğünü sorarken eli boşlukta, Mert'e doğru hafif uzanır (gözü hâlâ onda)
                   [t_onl5, EX + 140, 1120], [e5b + 0.4, EX + 152, 1112], [SON_T, EX + 152, 1112]]),
    # S1 (OTS): azarı dinler → "sövmen"de mahçup gözünü kaçırır → "bozdu"da yan gözle bakıp göz devirir
    "duygu": [[0, "ofkeli"], [t_abi1, "uzgun"], [e1b + 0.1, "yorgun"], [t_onl, "mahcup"], [t_boz + 0.2, "yorgun"],
              [e2a, "dehset"], [e2b + 0.05, "korkmus"],
              [d0, "saskin"], [d0 + 0.45, "agizAcik"], [d0 + 0.9, "mutlu"],
              [e3a, "mutlu"], [b0, "supheli"], [b0 + 0.9, "supheli"],
              [e4a, "mutlu"], [e5a, "mutlu"]],
    "bak": sirala([[0, *A_["sabri"]], [e1b, *A_["sabri"]], [t_onl, *A_["sabri"]], [t_onl + 0.35, 0.05, 0.55, 0.05], [t_boz - 0.1, 0.05, 0.55, 0.05],
                   [t_boz + 0.15, 0.55, -0.1, 0.25], [t_boz + 0.55, 0.3, -0.75, 0.2], [t_zam, 0.3, -0.75, 0.2], [t_zam + 0.3, 0.2, 0.5, 0.1], [e2a - 0.05, 0.2, 0.5, 0.1],
                   [e2a, *A_["kapi"]], [e2b, *A_["kapi"]],
                   [d0, *A_["mert"]], [b0, *A_["mert"]], [b0 + 0.35, *A_["duvar"]], [b0 + DUR["BOL"], *A_["duvar"]],
                   [e4a, *A_["mert"]], [SON_T, *A_["mert"]]]),
    "tilt": sirala([[0, -4], [t_bam, 0], [t_abi1, 3], [e1b, 2], [e2a, 0], [e2a + 0.2, -6], [e2b, -4],
                    [d0, 0], [d0 + 1.0, 7], [e3a, 7], [t_laan, -5], [e3b + 0.2, 6], [b0, 0], [b0 + 0.6, -3],
                    [e4a, 5], [t_ins, -4], [e4b, 4], [e5a, -6], [t_onl5, 5], [e5b, -3], [SON_T, 6]]),
    "egil": [[0, 0]],
    "gozSok": [[0, 0], [e2a - 0.02, 0], [e2a + 0.1, 0.9], [e2b, 0.7], [d0, 0.8], [d0 + 0.5, 0]],
    "goz": [[0, 0], [e1b + 0.05, 0], [e1b + 0.12, 0.9], [e1b + 0.2, 0], [d0 + 0.7, 0], [d0 + 0.78, 0.9], [d0 + 0.86, 0],
            [e3b + 0.1, 0], [e3b + 0.2, 0.9], [e3b + 0.3, 0], [e5b + 0.3, 0], [e5b + 0.38, 0.9], [e5b + 0.46, 0]],
    # anime: iki göz parlar; bölünmüş yüzde sol göz (kadraj solu) kısılır, sağ göz parlamaya devam eder
    "parilti": [[0, 0, 0], [d0 + 0.45, 0, 0], [d0 + 0.85, 1, 1], [b0, 1, 1], [b0 + 0.12, 0, 1], [e4a - 0.1, 0, 1], [e4a + 0.1, 1, 1], [SON_T, 1, 1]],
    "gozKis": [[0, 0, 0], [b0, 0, 0], [b0 + 0.15, 1, 0], [e4a - 0.1, 1, 0], [e4a + 0.1, 0, 0]],
    "nefes": [[0, 2.2], [e1b, 1.6], [e2a, 2.4], [d0 + 0.5, 0.4], [d0 + 1.0, 1.2]],
    "kulak": [[0, 0.3]],
    "konus": [konus(r) for r in ("E1", "E2", "E3", "E4", "E5")],
}

# --- YAN: Ece (solda, tezgâhın önünde; gövde önden, baş Sabri'ye dönük)
YE = yI(0.62, -0.3)
YE_G = yI(0.45, -0.58)                                 # "aaaa": geri sıçrar
YS_ = YE[2] / 1000
Y_EL_L, Y_EL_R = [round(v) for v in yP(0.66, 0.95, 0.03)], [round(v) for v in yP(0.92, 0.95, 0.12)]
Y_ELH_L, Y_ELH_R = (YE[0] + 40, YE[1] - 880 * YS_), (YE[0] + 175, YE[1] - 860 * YS_)  # vurmadan önce: eller tezgâhın üstünde havada
YB = {"sabri": (0.62, 0.0, 0.78), "tezgah": (0.5, 0.62, 0.45), "kapi": (0.85, -0.3, 0.95), "mert": (0.8, -0.2, 0.85)}
YECE = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": sirala([[0, YE[0], YE[1] - 18, YE[2]], [t_bam, YE[0], YE[1] + 8, YE[2]], [t_bam + 0.3, *YE], [e2a, *YE],
                   [e2a + 0.22, *YE_G], [t_malz, *YE_G], [m1b + 0.1, *YE], [SON_T, *YE]]),   # Mert'e doğru farkında olmadan geri süzülür
    "elL": sirala([[0, *Y_ELH_L], [t_bam - 0.07, *Y_ELH_L], [t_bam, *Y_EL_L], [e2a, *Y_EL_L],
                   [e2a + 0.15, YE_G[0] - 40, YE_G[1] - 560 * YS_], [m1a, YE_G[0] - 30, YE_G[1] - 545 * YS_], [SON_T, YE_G[0] - 30, YE_G[1] - 545 * YS_]]),
    # sağ el: S1-S2 somurtarken tezgâhta işaret parmağıyla küçük daireler çizer (ikincil hareket)
    "elR": sirala([[0, *Y_ELH_R], [t_bam - 0.07, *Y_ELH_R], [t_bam, *Y_EL_R], [s1a, *Y_EL_R]] +
                  [[c4 + 0.3 + i * 0.28, Y_EL_R[0] + (9 if i % 2 else -7), Y_EL_R[1] + (3 if i % 3 else -3)] for i in range(14)] +
                  [[t_kapi - 0.1, *Y_EL_R], [e2a, *Y_EL_R], [e2a + 0.15, YE_G[0] + 45, YE_G[1] - 570 * YS_], [m1a, YE_G[0] + 40, YE_G[1] - 550 * YS_],
                   [SON_T, YE_G[0] + 40, YE_G[1] - 550 * YS_]]),
    "tutR": [[0, None], [c4 + 0.2, "isaret"], [t_kapi - 0.1, None]],
    "duygu": [[0, "ofkeli"], [t_abi1, "uzgun"], [e1b + 0.1, "yorgun"], [t_kapi + 0.05, "saskin"], [e2a, "dehset"], [e2b + 0.05, "korkmus"],
              [t_dep + 0.35, "saskin"], [t_malz, "agizAcik"]],
    "bak": sirala([[0, *YB["sabri"]], [e1b + 0.2, *YB["sabri"]], [c4, *YB["tezgah"]], [t_kapi + 0.05, *YB["tezgah"]], [t_kapi + 0.2, *YB["kapi"]],
                   [m1a, *YB["kapi"]], [t_malz, *YB["kapi"]], [m1b, *YB["mert"]], [SON_T, *YB["mert"]]]),
    "tilt": sirala([[0, -5], [t_bam, 2], [t_abi1, 5], [e1b, 3], [c4, 6], [t_kapi, 6], [t_kapi + 0.2, -4], [e2a + 0.2, -7], [e2b, -3], [t_dep + 0.4, 2], [SON_T, 4]]),
    "gozSok": [[0, 0], [t_kapi, 0], [t_kapi + 0.15, 0.5], [e2a + 0.1, 0.95], [e2b, 0.6], [t_dep + 0.3, 0.3], [t_malz, 0.15]],
    "goz": [[0, 0], [e1b + 0.05, 0], [e1b + 0.12, 0.9], [e1b + 0.2, 0], [c4 + 1.5, 0], [c4 + 1.58, 0.9], [c4 + 1.66, 0]],
    "nefes": [[0, 2.2], [e1b, 1.6], [c4, 1.2], [e2a, 2.6], [m1a, 0.8]],
    "omuzDus": [[0, 0], [c4, 0.2], [s2a, 0.55], [t_kapi, 0.55], [t_kapi + 0.15, -0.7], [e2b, -0.4], [m1a, 0]],
    "kulak": [[0, 0.3]],
    "konus": [konus(r) for r in ("E1", "E2")],
}
# --- YAN: Sabri (tezgâhın arkası, sağda; Ece'ye bakar)
YSB = yI(0.85, 0.95, 1.72)
YSS = YSB[2] / 1000
YSAB = {
    "onKol": True, "dogalKol": True,
    "yer": [[0, *YSB]],
    # "Ha kurallara uyup profesyonelce": avucuyla Ece'yi gösterir (tezgâhın üstünde); sonra iner
    "elL": sirala([[0, YSB[0] - 70, YSB[1] - 330 * YSS], [s2a, YSB[0] - 70, YSB[1] - 330 * YSS], [t_ha + 0.25, YSB[0] - 125, YSB[1] - 470 * YSS],
                   [t_prof, YSB[0] - 135, YSB[1] - 480 * YSS], [t_sor, YSB[0] - 120, YSB[1] - 462 * YSS], [t_gecer, YSB[0] - 70, YSB[1] - 330 * YSS], [SON_T, YSB[0] - 70, YSB[1] - 330 * YSS]]),
    "elR": [[0, YSB[0] + 80, YSB[1] - 330 * YSS]],
    "duygu": [[0, "dusunceli"], [s1a, "notr"], [t_boz, "dusunceli"], [t_zam, "mutlu"], [s2a, "mutlu"], [t_gecer + 0.15, "saskin"],
              [m1a + 0.4, "notr"], [m1b, "mutlu"]],
    "bak": sirala([[0, -0.55, 0.05, -0.7], [t_gecer + 0.1, -0.55, 0.05, -0.7], [t_gecer + 0.35, 0.8, -0.1, 0.95], [m1a + 0.3, 0.8, -0.1, 0.95],
                   [c9 + 0.4, 0.75, -0.05, 0.85], [SON_T, 0.75, -0.05, 0.85]]),
    "tilt": sirala([[0, 2], [t_bam, -3], [e1b, 2], [s2a, 0], [t_prof, 4], [t_gecer, 0], [SON_T, 0]]),
    "goz": [[0, 0], [t_bam - 0.02, 0], [t_bam + 0.04, 1], [t_bam + 0.14, 0], [s2b + 0.3, 0], [s2b + 0.38, 0.9], [s2b + 0.46, 0]],
    "konus": [konus(r) for r in ("S1", "S2")],
}
# --- YAN: Mert (depoda ters ışıkta siluet → eşik → tezgâhın arkası, Sabri'nin sağı)
YM_IC, YM_ES, YM_YN = yI(1.48, 2.4, 1.8), yI(1.46, 1.8, 1.8), yI(1.27, 1.2, 1.8)
t_esik = t_top = W("M1", "topladım")
YMERT = {
    "onKol": True, "dogalKol": False,
    "yer": sirala([[0, YM_IC[0], YM_IC[1], 1], [t_kapi + 0.12, YM_IC[0], YM_IC[1], 1], [t_kapi + 0.13, *YM_IC], [t_dep - 0.15, *YM_IC],
                   [t_top + 0.15, *YM_ES], [c9 + 0.15, *YM_ES], [m1b - 0.15, *YM_YN], [SON_T, *YM_YN]]),
    "yuru": [[t_dep - 0.15, t_top + 0.15], [c9 + 0.15, m1b - 0.15]],
    "duygu": [[0, "notr"]],
    "bak": sirala([[0, -0.5, 0.05, -0.6], [c9, -0.5, 0.05, -0.6], [m1b - 0.2, -0.6, 0.05, -0.7], [SON_T, -0.6, 0.05, -0.7]]),
    "tilt": [[0, -2]],
    "konus": [konus("M1")],
}

# --- KASA: Sabri
SB_L, SB_R = (480, 1434), (590, 1432)
SAB = {
    "onKol": True, "dogalKol": True,
    "yer": [[0, SX, SY, SS]],
    "elL": sirala([[0, *SB_L], [SON_T, *SB_L]]),
    # sol eli (kadraj sağı): "kurallara uy" işaret parmağı sallar; "bu Mert" avucuyla Mert'i gösterir
    "elR": sirala([[0, *SB_R], [s1a, *SB_R], [s1a + 0.25, 620, 1300], [t_ece, 626, 1290], [t_ece + 0.25, 618, 1305], [t_sad - 0.2, *SB_R],
                   [s5a, *SB_R], [t_bum - 0.2, 680, 1300], [t_bum + 0.15, 700, 1285], [t_erk, 700, 1290], [t_erk + 0.3, *SB_R], [SON_T, *SB_R]]),
    "tutR": [[0, None], [s1a + 0.2, "isaret"], [t_sad - 0.2, None]],
    "duygu": [[0, "dusunceli"], [s1a, "notr"], [t_boz, "dusunceli"], [t_zam, "mutlu"], [s2a, "mutlu"], [t_gecer + 0.05, "saskin"],
              [m1a + 0.4, "notr"], [m1b, "mutlu"], [s3a, "mutlu"], [s4a, "mutlu"]],
    # bakış: Ece'ye (kadraj solu); kapı açılınca kapıya, sonra Mert'e (kadraj sağı)
    "bak": sirala([[0, -0.45, 0.04, -0.42], [c3, -0.45, 0.04, -0.42], [c3 + 0.3, -0.18, -0.05, -0.08], [t_gecer + 0.05, 0.6, -0.1, 0.45], [m1a + 0.6, 0.45, -0.05, 0.32], [m1b + 0.2, 0.45, -0.05, 0.32],
                   [s3a - 0.1, -0.2, -0.05, -0.1], [s4a, 0.42, -0.05, 0.3], [s5a, -0.18, -0.05, -0.08], [t_bum + 0.1, 0.4, -0.05, 0.3],
                   [t_bum + 0.7, -0.18, -0.05, -0.08], [SON_T, -0.18, -0.05, -0.08]]),
    "tilt": sirala([[0, 0], [s1a, 0], [t_ece, -4], [t_boz, 3], [s2a, 0], [t_prof, 4], [t_gecer, 0], [s3a, -3], [t_hen, 3], [SON_T, 0]]),
    "goz": [[0, 0], [s2b + 0.3, 0], [s2b + 0.38, 0.9], [s2b + 0.46, 0], [s3b + 0.05, 0], [s3b + 0.12, 0.9], [s3b + 0.2, 0]],
    "egil": [[0, 0]],
    "konus": [konus(r) for r in ("S1", "S2", "S3", "S4", "S5")],
}

# --- KASA: Mert (depodan çıkar → Sabri'nin sağı)
mert_cik = t_kapi + 0.1
MERT = {
    "onKol": True, "dogalKol": True,
    "yer": sirala([[0, DX, DY, 1], [mert_cik - 0.01, DX, DY, 1], [mert_cik, DX, DY, DS], [c9 - 0.02, DX, DY, DS], [c9 - 0.01, MX + 200, MY, MS],
                   [c9 + 0.75, MX, MY, MS], [SON_T, MX, MY, MS]]),
    "yuru": [[c9, c9 + 0.75]],
    "duygu": [[0, "notr"], [p0 + 0.6, "mutlu"], [p0 + DUR["PARILTI"], "notr"], [u0 + 1.75, "supheli"], [e4b, "supheli"], [s3a, "notr"], [s4a, "mutlu"]],
    # bakış: kapıdan Sabri'ye (kadraj solu); anime çekiminde kameraya (Ece'nin yeri) yarım dönüş; dürtmede parmağa → Ece'ye
    "bak": sirala([[0, -0.4, 0, -0.25], [p0, -0.4, 0, -0.25], [p0 + 0.5, -0.12, 0.02, -0.06], [p0 + DUR["PARILTI"], -0.15, 0.02, -0.08],
                   [e3b, -0.3, 0.1, -0.2], [u0 + 0.7, -0.3, 0.1, -0.2], [u0 + 0.85, -0.45, 0.65, -0.3], [u0 + 1.6, -0.45, 0.65, -0.3],
                   [u0 + 1.8, -0.35, 0.15, -0.25], [e4b, -0.35, 0.15, -0.25], [s4a, -0.42, -0.02, -0.3],
                   # "Aferin Mert": hafif baş selamı (aşağı-yukarı)
                   [t_mert1 + 0.2, -0.42, 0.25, -0.3], [t_mert1 + 0.5, -0.42, -0.02, -0.3],
                   [t_bum, -0.35, 0.15, -0.25], [t_bum + 0.3, -0.35, 0.3, -0.25], [t_bum + 0.55, -0.35, 0.12, -0.25], [SON_T, -0.35, 0.12, -0.25]]),
    "tilt": sirala([[0, -2], [p0, -2], [p0 + 0.8, -6], [p0 + DUR["PARILTI"], -4], [u0 + 1.75, 5], [e4b, 5], [s3a, -3], [SON_T, -3]]),
    "goz": [[0, 0], [p0 + 1.0, 0], [p0 + 1.12, 0.9], [p0 + 1.3, 0]],     # anime: yavaş göz kırpma
    "egil": [[0, 0]],
    "konus": [konus("M1")],
}

# --- KASA'da Ece (önde, solda): somurtur, tezgâha bakar (kapıyı görmez); dürtme
ER0 = (KX + 150, 1820)
ECE_KS = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": sirala([[0, KX, KY, KS], [u0 + 0.4, KX, KY, KS], [t_durt1, KX + 90, KY - 20, KS], [u0 + 1.5, KX + 80, KY - 15, KS], [u0 + 2.0, KX, KY, KS], [SON_T, KX, KY, KS]]),
    "duygu": [[0, "yorgun"], [t_gecer, "dehset"], [m1a, "korkmus"], [u0, "supheli"], [u0 + 1.4, "mutlu"], [s3a, "mutlu"]],
    # S1-S2: gözü tezgâhta (somurtma); kapı: kapıya; sonra Mert'e (kadraj sağı)
    "bak": sirala([[0, 0.3, 0.55, 0.3], [t_gecer, 0.3, 0.55, 0.3], [t_gecer + 0.12, 0.75, -0.15, 0.55], [m1a, 0.75, -0.15, 0.55],
                   [u0, 0.7, -0.1, 0.55], [SON_T, 0.7, -0.1, 0.55]]),
    "tilt": sirala([[0, 4], [t_gecer, 4], [t_gecer + 0.2, -3], [u0, 0], [t_durt1, -4], [u0 + 1.6, 3], [SON_T, 3]]),
    "omuzDus": [[0, 0.6], [t_gecer, 0.6], [t_gecer + 0.15, -0.8], [m1a, 0], [SON_T, 0]],
    "kulak": [[0, 0.3]],
    # dürtme: sağ eli (kadraj sağı) işaret parmağıyla Mert'in koluna, iki kez
    "elR": sirala([[0, *ER0], [u0 + 0.3, *ER0], [u0 + 0.65, 690, 1295], [t_durt1, 714, 1290], [t_durt1 + 0.14, 692, 1295], [t_durt2, 714, 1290],
                   [t_durt2 + 0.14, 692, 1295], [u0 + 1.6, 692, 1295], [u0 + 2.1, *ER0], [SON_T, *ER0]]),
    "elRara": [[u0 + 0.28, u0 + 2.15]],
    "tutR": [[0, None], [u0 + 0.35, "isaret"], [u0 + 2.0, None]], "isaretAci": 78,
}

# ------------------------------------------------------------------ KURGU + KAMERA
UC = (588, 1050, 1.12)                       # 3'lü: Ece önde solda, Sabri ortada, depo kapısı sağda
KOL = (920, 870, 2.8)                        # depo kolu insert
KAPI = (900, 820, 1.9)                      # kapı + Sabri'nin sağ yarısı
ECE_O = (EX, EYUZ + 400 / 1.45, 1.45)        # Ece orta-yakın
ECE_Y = (EX, EYUZ + 300 / 2.1, 2.1)          # Ece yakın
# --- ÖRNEK SAHNE (açılış → Mert'in çıkışı): ölçek dizisi orta-geniş · orta OTS · yakın OTS · geniş→kaydır · çok yakın · orta · yakın · orta · geniş
YK = yP(1.13, 1.0, 1.9)                                       # kapı kolu (ekran)
YD = yP(1.475, 1.05, 1.9)                                     # kapı ortası
# Kullanıcı kuralı (24 Kasım): Ece konuşurken / âşıkken TEK çekim; Sabri ve Mert konuşurken Ece'nin sırtı önde (OTS).
# Yan açı yalnız kapı, kol ve Mert'in çıkışı için (Ece bu açıda yok). Üçünü aynı kareye almak gerekmez.
OTS_ECE = (EX + 110, EYUZ + 260 / 1.75, 1.75)                  # Ece tek, sağda Sabri'nin ensesi (flu)
kes(g0, "tezgah", EX, EYUZ + 400 / 1.5, 1.5)                  # 1 Ece tek (eski açılış): eller havada → BAM + "ölüme gönderdin beni abi"
it(e1b, "tezgah", EX, EYUZ + 400 / 1.62, 1.62)
kes(c2, "kasa", 520, 1250, 1.5)                               # 2 Sabri OTS (önde Ece'nin ensesi): "Kurallara uy Ece…"
it(c3, "kasa", 528, 1238, 1.58)
kes(c3, "tezgah", *OTS_ECE)                                   # 3 Ece OTS (önde Sabri'nin ensesi): azar yer, mahçup
it(c4, "tezgah", OTS_ECE[0] - 5, OTS_ECE[1] - 6, OTS_ECE[2] + 0.1)
kes(c4, "yan", 600, 1000, 1.6)                                # 4 YAN: Sabri + depo kapısı: arkada kol iner (izleyici görür)
it(t_kol0 + 0.3, "yan", 600, 1000, 1.6)
it(c5, "yan", YK[0] + 40, 1040, 2.0)
kes(c5, "yan", YK[0] + 72, YK[1] - 25, 4.1)                   # 5 kol çok yakın: kol dibe iner, mandal, kapı ARALANIR
it(c6, "yan", YK[0] + 74, YK[1] - 27, 4.45)
kes(c6, "yan", 620, 1010, 1.55)                               # 6 YAN: "sorunsuz bi gece geçer" → kapı AÇILIR, depo ışığı, siluet
it(c7, "yan", 630, 1005, 1.62)
kes(c7, "tezgah", *OTS_ECE)                                   # 7 Ece OTS: "aaaa yine miii"
it(c8, "tezgah", OTS_ECE[0], OTS_ECE[1] + 10, OTS_ECE[2] - 0.08)
kes(c8, "yan", YD[0] - 5, YD[1] - 25, 2.05)                   # 8 kapı: Mert ters ışıkta siluet → ışığa adım atar
it(c9, "yan", YD[0] - 25, YD[1] - 30, 2.3)
kes(c9, "kasa", 670, 1150, 1.35)                              # 9 Sabri + Mert (önde Ece'nin ensesi): "…yerleştirdim"
it(d0, "kasa", 672, 1140, 1.4)
kes(d0, "tezgah", *ECE_Y)                                     # G: Ece donar → anime
it(p0, "tezgah", ECE_Y[0], ECE_Y[1] - 6, ECE_Y[2] + 0.18)
kes(p0, "kasa", MX - 10, MYUZ + 150 / 2.3, 2.3)               # H: Mert, anime ışığında (yavaş itme)
it(e3a, "kasa", MX - 10, MYUZ + 140 / 2.45, 2.45)
kes(e3a, "tezgah", *ECE_Y)                                    # I: "onee laan"
it(b0, "tezgah", ECE_Y[0], ECE_Y[1] - 4, ECE_Y[2] + 0.1)
kes(b0, "tezgah", EX, EYUZ + 280 / 2.25, 2.25)                # J: bölünmüş yüz; gözü duvara kayar
it(go0, "tezgah", EX, EYUZ + 280 / 2.35, 2.35)
kes(go0, "kasa", 690, 880, 2.3)                               # K: duvarda Mert'in gölgesi (var)
it(u0, "kasa", 685, 880, 2.4)
kes(u0, "kasa", 712, 1270, 2.6)                               # L1: insert: Ece'nin işaret parmağı Mert'in koluna (iki kez)
it(u0 + 1.35, "kasa", 716, 1262, 2.75)
kes(u0 + 1.35, "kasa", MX - 10, MYUZ + 150 / 2.3, 2.3)        # L2: Mert yakın: parmağa bakar → Ece'ye, tek kaş
it(e4a, "kasa", MX - 10, MYUZ + 140 / 2.4, 2.4)
kes(e4a, "tezgah", *ECE_Y)                                    # M: "Abi... bu insan mı?" (âşık)
it(s3a, "tezgah", ECE_Y[0], ECE_Y[1] - 4, ECE_Y[2] + 0.1)
kes(s3a, "kasa", SX - 15, SYUZ + 320 / 2.1, 2.1)              # N: Sabri yakın: "Sakin ol, henüz gece olmadı."
it(s4a, "kasa", SX - 15, SYUZ + 320 / 2.18, 2.18)
kes(s4a, "kasa", 670, 1150, 1.35)                             # O: Sabri + Mert (önde Ece'nin ensesi): "Aferin Mert" / "Ece bu Mert…"
it(e5a, "kasa", 672, 1140, 1.42)
kes(e5a, "tezgah", *ECE_O)                                    # P: "Benim önlüğüm nerde abi" (gözü Mert'te) → yavaş itme
it(SON_T, "tezgah", ECE_O[0], ECE_O[1] - 30, ECE_O[2] + 0.4)

# Ece kasa görünümünde yalnız 3'lü çekimlerde (Sabri/Mert/kol/gölge planlarında kamera onun "içinden" bakar)
ECE_KASA_ARA = [[u0 - 0.01, u0 + 1.35]]

# ------------------------------------------------------------------ anime
AN_TZ = [[0, 0], [d0 + 0.35, 0], [d0 + 0.85, 1], [b0 + 0.01, 1], [e4a - 0.1, 1], [e4a, 1], [s3a, 1], [s3a + 0.01, 0], [e5a, 0], [e5a + 0.01, 0.45], [SON_T, 1]]
AN_KS = [[0, 0], [p0 - 0.01, 0], [p0, 0.4], [p0 + 0.6, 1], [e3a, 1], [e3a + 0.01, 0]]
AN_YARIM = [[0, 0], [b0, 0], [b0 + 0.12, 1], [go0, 1], [go0 + 0.01, 0]]

# ------------------------------------------------------------------ ORTAK
ORTAK = {"saat": [[0, "19:12"]], "kapi": [[0, 0]], "flor": [[0, 1]], "cizir": [], "lamba": [[0, 0]],
         "titre": {"tezgah": 1.3, "kasa": 1.2, "yan": 1.0},
         "blok": [[0, 560]], "gazete": [[0, 1300]], "gazeteTz": [[0, -700]], "kagitTz": [[0, 1]], "elAra": [],
         "kalemMasa": [[0, 640, 1]], "eceKasaAra": ECE_KASA_ARA, "odak": [[0, 0]],
         "depo": [[0, 0], [t_aralik, 0], [t_aralik + 0.3, 0.06], [t_kapi - 0.06, 0.065], [t_kapi + 0.28, 1.0], [t_kapi + 0.45, 0.96], [SON_T, 0.96]],
         "depoKol": [[0, 0], [t_kol0, 0], [t_kol0 + 0.5, 0.12], [t_kol1, 1], [t_kapi - 0.05, 1], [t_kapi + 0.3, 0]],
         "sars": [[0, 0], [t_bam - 0.01, 0], [t_bam, 1], [t_bam + 0.3, 0], [t_kapi - 0.01, 0], [t_kapi, 0.5], [t_kapi + 0.25, 0], [e2a + 0.08, 0], [e2a + 0.16, 0.35], [e2a + 0.7, 0]],
         "mertGolge": [-175, -40, 0.6],
         # OTS ön planları (örnek sahne): kasa'da Ece'nin ensesi (solda), tezgah'ta Sabri'nin ensesi (sağda)
         "eceSirt": [[0, 290, 1440, 1.3]], "eceSirtAra": [[c2 - 0.01, c3], [c9 - 0.01, d0], [s3a - 0.01, e5a]],
         "sabriSirt": [[0, EX + 410, EYUZ + 70, 0.95]], "sabriSirtAra": [[c3 - 0.01, c4], [c7 - 0.01, c8]],
         # Mert: kapı eşiğini geçene dek kapı boşluğuna kesilir; ters ışıkta siluet → ışığa adım atınca aydınlanır
         "mertKlip": [[0, t_top + 0.05]],
         "mertSil": [[0, 1], [t_dep + 0.1, 1], [t_top + 0.25, 0.25], [c9, 0], [SON_T, 0]],
         "anime": {"tezgah": AN_TZ, "kasa": AN_KS}, "animeYarim": {"tezgah": AN_YARIM},
         "animeMerkez": {"tezgah": [[0, EX, EYUZ - 20]], "kasa": [[0, MX, MYUZ - 40]]}}
KAR = {"tezgah": {"ece": ECE_TZ}, "kasa": {"sabri": SAB, "mert": MERT, "ece": ECE_KS}, "yan": {"sabri": YSAB, "mert": YMERT}}

# ------------------------------------------------------------------ çizim (P1'in tamamlanmış şeması kâğıtta)
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


# ------------------------------------------------------------------ SES (efekt/müzik; ses yönetmeni)
def E(ad, isim, t, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t - T[ad], 3), "volume": vol, **kw}


SFX = {
    "GIRIS": [E("GIRIS", "b8y_bam", t_bam, 0.8)],
    "S1": [E("S1", "b8y_kol_gicirti", t_kol0 + 0.1, 0.3)],
    "S2": [E("S2", "b8y_kol_mandal", t_kol1 - 0.05, 0.4), E("S2", "b8y_kapi_hiz", t_kapi - 0.02, 0.75)],
    # âşık olduğu süre boyunca TEK parça hafif romantik fon (kullanıcı: 10-15 sn, kesik değil, cızırtı yok)
    "DON": [E("DON", "b8y_parilti", d0 + 0.3, 0.55), E("DON", "muzik/b8y_ask", d0 + 0.3, 0.22)],
    "DURT": [E("DURT", "el_kart_pop", t_durt1, 0.3), E("DURT", "el_kart_pop", t_durt2, 0.26)],
}


def vuruslar():
    out = []
    for ad, r, d in SIRA:
        t0, t1 = T[ad], T[ad] + DUR[ad]
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
    ep_id = "724-08y-p1"
    man, beats = {}, []
    for i, (ad, r, b) in enumerate(vuruslar()):
        if r:
            man[f"i_{i + 1:02d}"] = M[TAKE[r]]
        beats.append(b)
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Market · Mert", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.5}, "music": {"name": "yok"}, "beats": beats}
    tum = {k: v for k, v in M.items() if not k.startswith("i_")}
    tum.update(man)
    json.dump(tum, open(f"{VD}/manifest.json", "w"), ensure_ascii=False, indent=1)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 8, "title": "Bölüm 8 · Parça 1", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON_T:.2f} sn  çekimler: {TAKE}")
    for ad, r, d in SIRA:
        print(f"  {ad:8s} {T[ad]:6.2f} +{DUR[ad]:.2f}" + (f"  {TAKE[r]}" if r else ""))
    print("kurgu:", [(round(t, 2), v) for t, v in KURGU])
    print(f"olaylar: t_bam={t_bam:.2f} t_kol0={t_kol0:.2f} t_kol1={t_kol1:.2f} t_aralik={t_aralik:.2f} t_kapi={t_kapi:.2f} d0={d0:.2f} t_durt1={t_durt1:.2f} t_durt2={t_durt2:.2f}")
