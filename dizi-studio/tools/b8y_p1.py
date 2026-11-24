"""7/24 Bölüm 8 (yeni) Parça 1: "ölüme gönderdin beni abi" → depo kapısı → Mert → anime aşk anı → "bu insan mı?" → önlük.
Kullanım: python3 tools/b8y_p1.py [--cekim M1=M1b_01 ...]  -> public/episodes/724-08y-p1.json (+ manifest anahtarları)
Kullanıcının replikleri AYNEN; doğaçlamalar (kullanıcı onaylı, bolumler.md "B8 (yeni) P1: doğaçlama önerisi"):
  sözsüz bölünmüş yüz + duvardaki gölge kontrolü + kola dürtme; Ece: "Abi... bu insan mı?" (âşık tonda); Sabri: "Sakin ol, henüz gece olmadı."
Kanca A (kullanıcı): Ece tezgâha avuçlarını vurur; Sabri konuşurken arkada depo kapısının kolu iner (Ece somurtup tezgâha bakar,
görmez); kapı "geçer"de açılır.
Görünümler (Inserts18 b8_market): tezgah (Ece, Sabri'nin tarafından) · kasa (Sabri ortada, depo kapısı sağda; Mert Sabri'nin sağında;
3'lü çekimlerde Ece ÖNDE solda).
180°: Ece kadraj sağına bakar (Sabri, daha sağda Mert); Sabri ve Mert Ece'ye bakarken kadraj soluna. P2 ile aynı eksen.
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
SINIR = {"kasa": (0, 1080, 0, 1920), "tezgah": (0, 1080, 0, 1920)}


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


# ------------------------------------------------------------------ yerleşimler (P2 ile aynı)
EX, EY, ES = 560, 1700, 1250
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

t_kol0 = s1a + 4.6          # kol inmeye başlar ("attığın" civarı); izleyici görür, Ece tezgâha bakıyor
t_kol1 = s2a + 1.6          # kol tam aşağıda; kapı aralanmak üzere
t_kapi = t_gecer            # kapı açılır
t_durt1, t_durt2 = u0 + 0.75, u0 + 1.05

# ------------------------------------------------------------------ KARAKTERLER
EL_L, EL_R = (496, 1194), (640, 1194)                # tezgâhta
ELH_L, ELH_R = (430, 1010), (690, 1010)              # havada (vurmadan önce)
# --- TEZGAH: Ece (Sabri'nin tarafından, kameraya dönük)
A_ = {"sabri": (0.22, -0.05, 0.1), "mert": (0.55, -0.12, 0.32), "kapi": (0.7, -0.2, 0.4), "duvar": (0.62, -0.6, 0.3), "asagi": (0.05, 0.6, 0)}
ECE_TZ = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": sirala([[0, EX, EY + 30, ES + 25], [t_bam, EX, EY + 60, ES + 55], [t_bam + 0.25, EX, EY + 45, ES + 40], [e1b, EX, EY + 35, ES + 30],
                   [e2a - 0.02, EX, EY + 35, ES + 30], [e2a + 0.15, EX, EY - 35, ES - 40], [e2b, EX, EY - 30, ES - 35],     # E2: geri sıçrar
                   [d0, EX, EY - 30, ES - 35], [d0 + 0.9, EX, EY, ES], [SON_T, EX, EY, ES]]),
    "elL": sirala([[0, *ELH_L], [t_bam - 0.06, *ELH_L], [t_bam, *EL_L], [e2a, *EL_L], [e2a + 0.12, 400, 1000], [e2b + 0.1, 410, 1010],
                   [d0 + 0.4, 450, 1100], [d0 + 0.8, *EL_L], [SON_T, *EL_L]]),
    "elR": sirala([[0, *ELH_R], [t_bam - 0.06, *ELH_R], [t_bam, *EL_R], [e2a, *EL_R], [e2a + 0.12, 720, 1000], [e2b + 0.1, 710, 1010],
                   [d0 + 0.4, 670, 1100], [d0 + 0.8, *EL_R], [e5a, *EL_R],
                   # E5: önlüğünü sorarken eli boşlukta, Mert'e doğru hafif uzanır (gözü hâlâ onda)
                   [t_onl5, 700, 1120], [e5b + 0.4, 712, 1112], [SON_T, 712, 1112]]),
    "duygu": [[0, "ofkeli"], [t_abi1, "uzgun"], [e1b + 0.1, "yorgun"],
              [e2a, "dehset"], [e2b + 0.05, "korkmus"],
              [d0, "saskin"], [d0 + 0.45, "agizAcik"], [d0 + 0.9, "mutlu"],
              [e3a, "mutlu"], [b0, "supheli"], [b0 + 0.9, "supheli"],
              [e4a, "mutlu"], [e5a, "mutlu"]],
    "bak": sirala([[0, *A_["sabri"]], [e1b, *A_["sabri"]],
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
    "bak": sirala([[0, -0.18, -0.05, -0.08], [t_gecer + 0.05, 0.6, -0.1, 0.45], [m1a + 0.6, 0.45, -0.05, 0.32], [m1b + 0.2, 0.45, -0.05, 0.32],
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
    "yer": sirala([[0, DX, DY, 1], [mert_cik - 0.01, DX, DY, 1], [mert_cik, DX, DY, DS], [m1a, DX, DY, DS], [t_malz - 0.05, DX - 40, DY + 20, DS + 40],
                   [t_malz, MX, MY, MS], [SON_T, MX, MY, MS]]),
    "yuru": [[m1a + 0.1, t_malz - 0.05]],
    "duygu": [[0, "notr"], [p0 + 0.6, "mutlu"], [p0 + DUR["PARILTI"], "notr"], [u0 + 1.2, "supheli"], [u0 + 1.9, "mutlu"], [s4a, "mutlu"]],
    # bakış: kapıdan Sabri'ye (kadraj solu); anime çekiminde kameraya (Ece'nin yeri) yarım dönüş; dürtmede parmağa → Ece'ye
    "bak": sirala([[0, -0.4, 0, -0.25], [p0, -0.4, 0, -0.25], [p0 + 0.5, -0.12, 0.02, -0.06], [p0 + DUR["PARILTI"], -0.15, 0.02, -0.08],
                   [e3b, -0.3, 0.1, -0.2], [u0 + 0.7, -0.3, 0.1, -0.2], [u0 + 0.85, -0.45, 0.65, -0.3], [u0 + 1.25, -0.45, 0.65, -0.3],
                   [u0 + 1.45, -0.35, 0.15, -0.25], [e4b, -0.35, 0.15, -0.25], [s4a, -0.42, -0.02, -0.3],
                   # "Aferin Mert": hafif baş selamı (aşağı-yukarı)
                   [t_mert1 + 0.2, -0.42, 0.25, -0.3], [t_mert1 + 0.5, -0.42, -0.02, -0.3],
                   [t_bum, -0.35, 0.15, -0.25], [t_bum + 0.3, -0.35, 0.3, -0.25], [t_bum + 0.55, -0.35, 0.12, -0.25], [SON_T, -0.35, 0.12, -0.25]]),
    "tilt": sirala([[0, -2], [p0, -2], [p0 + 0.8, -6], [p0 + DUR["PARILTI"], -4], [u0 + 1.2, 5], [u0 + 1.9, -3], [SON_T, -3]]),
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
    "tutR": [[0, None], [u0 + 0.35, "isaret"], [u0 + 2.0, None]],
}

# ------------------------------------------------------------------ KURGU + KAMERA
UC = (588, 1050, 1.12)                       # 3'lü: Ece önde solda, Sabri ortada, depo kapısı sağda
KOL = (920, 870, 2.8)                        # depo kolu insert
KAPI = (900, 820, 1.9)                      # kapı + Sabri'nin sağ yarısı
ECE_O = (EX, EYUZ + 400 / 1.45, 1.45)        # Ece orta-yakın
ECE_Y = (EX, EYUZ + 300 / 2.1, 2.1)          # Ece yakın
kes(g0, "tezgah", EX, EYUZ + 400 / 1.5, 1.5)                 # A: BAM + "ölüme gönderdin beni abi"
it(e1b, "tezgah", EX, EYUZ + 400 / 1.62, 1.62)
kes(s1a, "kasa", *UC)                                         # B: 3'lü: Sabri öğüt verir; Ece somurtur
it(t_onl - 0.1, "kasa", UC[0], UC[1], UC[2] + 0.03)
kes(t_onl - 0.1, "kasa", 684, 1000, 1.4)                      # B2: Sabri + depo kapısı: arkasında kol yavaşça iner (izleyici görür)
it(s2a + 0.05, "kasa", 684, 990, 1.48)
kes(s2a + 0.05, "kasa", *KOL)                                 # C: kolun yakın planı (Sabri'nin sesi sürer)
it(t_sor - 0.1, "kasa", KOL[0], KOL[1] + 5, KOL[2] + 0.12)
kes(t_sor - 0.1, "kasa", *UC)                                 # D: 3'lü: "sorunsuz bi gece geçer" → KAPI AÇILIR
it(s2b + 0.15, "kasa", UC[0] + 20, UC[1] - 10, UC[2] + 0.05)
kes(e2a, "tezgah", *ECE_O)                                    # E: Ece: "aaaa yine miii"
it(e2b, "tezgah", ECE_O[0], ECE_O[1] + 10, ECE_O[2] - 0.06)
kes(m1a - 0.1, "kasa", *KAPI)                                 # F1: Mert eşikte, ışığın önünde: "Abi depoyu topladım,"
it(t_malz - 0.05, "kasa", KAPI[0] - 10, KAPI[1], KAPI[2] + 0.06)
kes(t_malz, "kasa", *UC)                                      # F2: 3'lü: Mert tezgâhta, Sabri'nin yanında
it(d0, "kasa", UC[0], UC[1], UC[2] + 0.03)
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
kes(u0, "kasa", 620, 1080, 1.3)                               # L: 3'lü sıkı: Ece uzanıp Mert'in koluna dürter; Mert tek kaş
it(e4a, "kasa", 630, 1075, 1.36)
kes(e4a, "tezgah", *ECE_Y)                                    # M: "Abi... bu insan mı?" (âşık)
it(s3a, "tezgah", ECE_Y[0], ECE_Y[1] - 4, ECE_Y[2] + 0.1)
kes(s3a, "kasa", SX - 15, SYUZ + 320 / 2.1, 2.1)              # N: Sabri yakın: "Sakin ol, henüz gece olmadı."
it(s4a, "kasa", SX - 15, SYUZ + 320 / 2.18, 2.18)
kes(s4a, "kasa", *UC)                                         # O: 3'lü: "Aferin Mert" / "Ece bu Mert…"
it(e5a, "kasa", UC[0], UC[1] - 5, UC[2] + 0.06)
kes(e5a, "tezgah", *ECE_O)                                    # P: "Benim önlüğüm nerde abi" (gözü Mert'te) → yavaş itme
it(SON_T, "tezgah", ECE_O[0], ECE_O[1] - 30, ECE_O[2] + 0.4)

# Ece kasa görünümünde yalnız 3'lü çekimlerde (Sabri/Mert/kol/gölge planlarında kamera onun "içinden" bakar)
ECE_KASA_ARA = [[s1a - 0.01, t_onl - 0.1], [t_sor - 0.11, s2b + 0.4], [t_malz - 0.01, d0], [u0 - 0.01, e4a], [s4a - 0.01, e5a]]

# ------------------------------------------------------------------ anime
AN_TZ = [[0, 0], [d0 + 0.35, 0], [d0 + 0.85, 1], [b0 + 0.01, 1], [e4a - 0.1, 1], [e4a, 1], [s3a, 1], [s3a + 0.01, 0], [e5a, 0], [e5a + 0.01, 0.45], [SON_T, 1]]
AN_KS = [[0, 0], [p0 - 0.01, 0], [p0, 0.4], [p0 + 0.6, 1], [e3a, 1], [e3a + 0.01, 0]]
AN_YARIM = [[0, 0], [b0, 0], [b0 + 0.12, 1], [go0, 1], [go0 + 0.01, 0]]

# ------------------------------------------------------------------ ORTAK
ORTAK = {"saat": [[0, "19:12"]], "kapi": [[0, 0]], "flor": [[0, 1]], "cizir": [], "lamba": [[0, 0]],
         "titre": {"tezgah": 1.3, "kasa": 1.2},
         "blok": [[0, 560]], "gazete": [[0, 1300]], "gazeteTz": [[0, -700]], "kagitTz": [[0, 1]], "elAra": [],
         "kalemMasa": [[0, 640, 1]], "eceKasaAra": ECE_KASA_ARA, "odak": [[0, 0]],
         "depo": [[0, 0], [t_kol1, 0], [t_kol1 + 0.25, 0.06], [t_kapi - 0.02, 0.06], [t_kapi + 0.16, 1.05], [t_kapi + 0.3, 0.97], [SON_T, 0.97]],
         "depoKol": [[0, 0], [t_kol0, 0], [t_kol1, 1], [t_kol1 + 0.25, 0.85], [t_kapi, 0.9], [t_kapi + 0.2, 0]],
         "sars": [[0, 0], [t_bam - 0.01, 0], [t_bam, 1], [t_bam + 0.3, 0], [t_kapi - 0.01, 0], [t_kapi, 0.5], [t_kapi + 0.25, 0]],
         "mertGolge": [-175, -40, 0.42],
         "anime": {"tezgah": AN_TZ, "kasa": AN_KS}, "animeYarim": {"tezgah": AN_YARIM},
         "animeMerkez": {"tezgah": [[0, EX, EYUZ - 20]], "kasa": [[0, MX, MYUZ - 40]]}}
KAR = {"tezgah": {"ece": ECE_TZ}, "kasa": {"sabri": SAB, "mert": MERT, "ece": ECE_KS}}

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
