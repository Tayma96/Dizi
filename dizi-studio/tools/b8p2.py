"""7/24 B8 Parça 2 (market, P1'in devamı): komik düşüş, "öbür taraf", Ece kameraya döner: NAH + 4. duvar.
Kullanım: python3 tools/b8p2.py [--cekim E1=E1b_01,S1=S1b_01 ...]  -> public/episodes/724-08-p2.json + public/voice/724-08-p2/ (manifest okunur)
Kullanıcının metni AYNEN ("Bölüm 8, Parça 2"); yeni replik YOK. Sözsüz eylem/tepkiler görüntü yönetmeninin.
Görünümler (Inserts18 b8_market): tezgah (Ece, Sabri'nin tarafından) · kasa (Sabri; "iki"/4. duvar çekimlerinde Ece ÖNDE, solda)
· nah (el yakın planı, seyircinin yerinden).
Coğrafya / 180°: Ece müşteri tarafında; kasa görünümünde Sabri'nin solunda (x 270), Sabri ortada (540). Ece Sabri'ye bakarken
sağa, Sabri Ece'ye bakarken sola bakar (P1 ile aynı). 4. duvarda Ece kameraya (seyirciye) döner; Sabri arkasında kalır.
"""
import json, math, os, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
VFROM = 2 / FPS

VD = f"{K}/public/voice/724-08-p2"
M = json.load(open(f"{VD}/manifest.json"))
TAKE = {"E1": "E1b_01", "S1": "S1b_01", "E2": "E2a_01", "S2": "S2a_01", "E3": "E3a_01", "S3": "S3a_01", "E4": "E4a_01", "E5": "E5b_01", "E6": "E6a_01"}
_sec = f"{VD}/secim.json"
if os.path.exists(_sec):   # ses yönetmeninin çekim seçimleri ({"E1_...": {"sec": "E1b_01"}} ya da {"E1": "E1b_01"})
    for k, v in json.load(open(_sec)).items():
        sec = v.get("sec") if isinstance(v, dict) else v
        if isinstance(sec, str) and sec in M:
            TAKE[sec[:2]] = sec
for a in sys.argv[1:]:
    for kv in a.replace("--cekim", "").split(","):
        if "=" in kv:
            k, v = kv.strip().split("=")
            TAKE[k] = v
METIN = {"E1": ("ece_sivil", "he koskoca korkunç paralel evrenler götü boklu markette ortak noktada buluşuyor"),
         "S1": ("sabri", "he valla"), "E2": ("ece_sivil", "haa öbür taraf yok yani?"), "S2": ("sabri", "öbür taraf derken?"),
         "E3": ("ece_sivil", "ruhlar alemi Sabri abi ruhlar alemi"), "S3": ("sabri", "yoo ne alaka."), "E4": ("ece_sivil", "heh"),
         "E5": ("ece_sivil", "Did ind jib deyip duruyordunuz al bak tek ortak noktamız market"),
         "E6": ("ece_sivil", "tamam böcek biraz sıçana benzemiş olabilir")}

# (ad, replik|None, süre (insert) ya da boşluk (replik))
SIRA = [
    ("GIRIS", None, 0.8),
    ("E1", "E1", 0.1),
    ("S1", "S1", 0.95),     # "he valla" + lambayı söndürür
    ("E2", "E2", 0.2),
    ("S2", "S2", 0.2),
    ("E3", "E3", 0.25),
    ("S3", "S3", 0.45),     # Ece'nin sinsi sırıtışı
    ("E4", "E4", 0.05),     # "heh": kameraya döner, kamera hızla yaklaşır
    ("NAH", None, 1.95),    # el yakın planı
    ("TUT", None, 1.15),    # yüzüyle birlikte (orta-yakın)
    ("E5", "E5", 0.15),
    ("TEPKI", None, 1.1),   # Sabri anlamaz
    ("E6", "E6", 0.75),
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
SINIR = {"kasa": (0, 1080, 0, 1920), "tezgah": (0, 1080, 0, 1920), "nah": (-600, 1680, -400, 2320)}


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


# ------------------------------------------------------------------ yerleşimler (P1 ile aynı)
EX, EY, ES = 560, 1700, 1250
EYUZ = EY - 765 * ES / 1000
SX, SY, SS = 540, 1960, 1180
SYUZ = SY - 765 * SS / 1000
# kasa görünümünde Ece ÖNDE (kameraya yakın), Sabri'nin solunda
KX, KS = 270, 1650
KYUZ = 990
KY = KYUZ + 765 * KS / 1000

# ------------------------------------------------------------------ zamanlar
g0 = T["GIRIS"]
e1a, e1b = V("E1")
t_he = W("E1", "he"); t_kos = W("E1", "koskoca"); t_kor = W("E1", "korkunç"); t_evr = W("E1", "evrenler")
t_got = W("E1", "götü"); t_mar = W("E1", "markette"); t_ort = W("E1", "ortak"); t_nok = W("E1", "noktada"); t_bul = W("E1", "buluşuyor")
s1a, s1b = V("S1"); t_val = W("S1", "valla")
e2a, e2b = V("E2"); t_haa = W("E2", "haa"); t_obur = W("E2", "öbür"); t_yani = W("E2", "yani")
s2a, s2b = V("S2"); t_der = W("S2", "derken")
e3a, e3b = V("E3"); t_ruh1 = W("E3", "ruhlar"); t_sab = W("E3", "sabri"); t_ruh2 = W("E3", "ruhlar", n=1); t_alem2 = W("E3", "alemi", n=1)
s3a, s3b = V("S3"); t_yoo = W("S3", "yoo"); t_ala = W("S3", "alaka")
e4a, e4b = V("E4"); t_heh = W("E4", "heh")
n0 = T["NAH"]; u0 = T["TUT"]
e5a, e5b = V("E5"); t_did = W("E5", "did"); t_jib_e = W("E5", "jib", "end"); t_dey = W("E5", "deyip"); t_al = W("E5", "al")
t_tek = W("E5", "tek"); t_mkt = W("E5", "market")
p0 = T["TEPKI"]
e6a, e6b = V("E6"); t_tam = W("E6", "tamam"); t_boc = W("E6", "böcek"); t_sic = W("E6", "sıçana"); t_ola = W("E6", "olabilir")
t_lamba = s1b + 0.45          # Sabri lambayı söndürür (tık)
t_pop = g0 + 0.5              # floresan normale döner (büyü bozulur)
t_kalem = t_val + 0.1         # kalem tezgâha düşer
t_sak = n0 + 0.82             # yumruk ileri + sol el bileği kavrar: ŞAK

# ------------------------------------------------------------------ ÇİZİM (P1'in son hâli: tamamlanmış şema)
_argv = sys.argv
sys.argv = [sys.argv[0]]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import b8p1 as P1  # noqa: E402
sys.argv = _argv
CIZIM = [{"w": c["w"], "p": [[-5, x, y] for _, x, y in c["p"]]} for c in P1.CIZIM]
BAS = [{**b, "t0": -5, "t1": -4.9} for b in P1.BAS]

# ------------------------------------------------------------------ KARAKTERLER
EL_L, EL_R = (496, 1194), (640, 1194)
# --- TEZGAH: Ece (Sabri'nin tarafından); E1 / E2 / E3
ECE_TZ = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": sirala([[0, EX, EY + 10, ES + 5], [t_kos, EX, EY + 10, ES + 5], [t_evr, EX, EY - 10, ES - 10], [t_got, EX, EY - 10, ES - 10],
                   [e2a, EX, EY, ES], [t_obur, EX, EY + 55, ES + 50], [e2b + 0.2, EX, EY + 55, ES + 50],      # E2: öne eğilir (umutla)
                   [e3a - 0.05, EX, EY, ES], [t_sab, EX, EY + 25, ES + 20], [e3b, EX, EY + 10, ES + 5], [SON_T, EX, EY + 10, ES + 5]]),
    # eller: tezgâhta → "koskoca korkunç" avuçlar yukarı yana açılır (dirsek aşağıda) → tezgâha; "ruhlar alemi" hayalet elleri (önkollar dikey)
    "elL": sirala([[0, *EL_L], [t_kos - 0.25, *EL_L], [t_kos + 0.1, EX - 165, 1012], [t_evr, EX - 178, 1000], [t_evr + 0.5, EX - 168, 1010],
                   [t_got, EX - 120, 1100], [t_got + 0.3, *EL_L],
                   [e3a - 0.1, *EL_L], [t_ruh1 + 0.05, EX - 70, 990], [t_ruh1 + 0.3, EX - 40, 965], [t_ruh1 + 0.55, EX - 80, 980], [t_ruh1 + 0.8, EX - 45, 960], [t_sab - 0.1, EX - 70, 1000],
                   [t_sab + 0.25, *EL_L], [t_ruh2 - 0.15, *EL_L], [t_ruh2 + 0.12, EX - 62, 985], [t_ruh2 + 0.3, EX - 50, 968], [t_ruh2 + 0.48, EX - 66, 982], [t_ruh2 + 0.66, EX - 50, 966],
                   [t_alem2 + 0.4, EX - 64, 980], [e3b + 0.25, *EL_L], [SON_T, *EL_L]]),
    "elR": sirala([[0, *EL_R], [t_kos - 0.25, *EL_R], [t_kos + 0.1, EX + 165, 1012], [t_evr, EX + 178, 1000], [t_evr + 0.5, EX + 168, 1010],
                   [t_got, EX + 120, 1100], [t_got + 0.3, *EL_R],
                   [t_ruh2 - 0.15, *EL_R], [t_ruh2 + 0.12, EX + 62, 980], [t_ruh2 + 0.3, EX + 50, 966], [t_ruh2 + 0.48, EX + 66, 984], [t_ruh2 + 0.66, EX + 50, 968],
                   [t_alem2 + 0.4, EX + 64, 982], [e3b + 0.25, *EL_R], [SON_T, *EL_R]]),
    "duygu": [[0, "korkmus"], [g0 + 0.3, "dusunceli"], [t_he - 0.15, "alayci"], [t_kos, "alayci"], [e1b, "alayci"],
              [e2a, "saskin"], [t_obur, "mutlu"], [e2b + 0.1, "mutlu"],
              [e3a, "yorgun"], [t_sab, "ofkeli"], [t_ruh2, "yorgun"], [e3b + 0.1, "yorgun"]],
    # bakış: kâğıda (aşağı) → Sabri'ye (kadraj sağı); "ruhlar alemi"nde göz devirme (yukarı)
    "bak": sirala([[0, 0.05, 0.62, 0], [g0 + 0.3, 0.05, 0.6, 0], [g0 + 0.55, 0.22, -0.05, 0.1], [t_kos, 0.22, -0.05, 0.1], [t_evr, 0.15, -0.15, 0.08],
                   [t_got, 0.22, 0, 0.1], [e2a, 0.25, -0.05, 0.12], [t_obur, 0.22, 0, 0.1],
                   [e3a - 0.05, 0.1, -0.85, 0.05], [t_ruh1 + 0.6, 0.1, -0.8, 0.05], [t_sab - 0.1, 0.25, 0, 0.12], [t_ruh2 - 0.1, 0.25, 0, 0.12],
                   [t_ruh2 + 0.15, 0.05, -0.85, 0.05], [e3b, 0.22, -0.1, 0.1]]),
    "tilt": sirala([[0, 0], [t_he, 4], [t_kos, 4], [t_evr, -4], [t_got, 0], [e2a, 0], [t_obur, 7], [e2b, 7], [e3a, 0], [t_sab, -6], [t_ruh2, -2], [e3b, 0]]),
    "egil": [[0, 0]],
    "gozSok": [[0, 0.3], [g0 + 0.4, 0.3], [g0 + 0.6, 0], [t_haa, 0], [t_haa + 0.15, 0.35], [t_obur, 0]],
    "solgun": [[0, 0.35], [g0 + 0.5, 0.35], [t_he, 0]],
    "goz": [[0, 0], [g0 + 0.25, 0], [g0 + 0.32, 0.9], [g0 + 0.4, 0]],     # P1'in gerilimi: bir göz kırpma, sonra büyü bozulur
    "omuzDus": [[0, 0], [t_mar - 0.1, 0], [t_mar + 0.1, -0.7], [t_mar + 0.45, 0], [e3a, 0], [t_ruh1, 0.6], [t_sab, 0.2], [e3b, 0.8], [SON_T, 0.8]],
    "nefes": [[e3a, 1], [e3a + 0.4, 2.2], [e3a + 1.0, 1]],
    "kulak": [[0, 0.3]],
    "konus": [konus("E1"), konus("E2"), konus("E3")],
}

# --- KASA: Sabri (P1'in sonu: kalem sol elinde, lamba açık). Ece ÖNDE yalnız iki/4. duvar çekimlerinde.
SAB = {
    "onKol": True, "dogalKol": True,
    "yer": [[0, SX, SY, SS]],
    # sol eli (kadraj sağı, kalemli): kâğıtta → "he valla"da kalemi bırakır → tezgâhta; "yoo ne alaka" el sallar (yok canım)
    "elR": sirala([[0, 590, 1432], [t_got, 590, 1432], [t_got + 0.3, 600, 1424], [t_kalem - 0.12, 620, 1410], [t_kalem, 628, 1434],
                   [t_kalem + 0.3, 612, 1436], [s3a, 612, 1436], [t_yoo - 0.05, 660, 1300], [t_yoo + 0.15, 700, 1290], [t_yoo + 0.32, 662, 1300],
                   [t_yoo + 0.5, 702, 1292], [t_ala + 0.4, 610, 1436], [p0, 610, 1436], [p0 + 0.5, 612, 1432], [SON_T, 612, 1432]]),
    # sağ eli (kadraj solu): tezgâhta → lambanın düğmesine uzanır, söndürür → TEPKİ'de kafasını kaşır
    "elL": sirala([[0, 480, 1434], [s1b, 480, 1434], [t_lamba - 0.3, 378, 1408], [t_lamba + 0.15, 380, 1412], [t_lamba + 0.5, 470, 1436],
                   [p0 + 0.1, 470, 1436], [p0 + 0.45, 522, 1160], [p0 + 0.6, 532, 1150], [p0 + 0.75, 520, 1162], [p0 + 0.9, 532, 1150], [SON_T, 526, 1156]]),
    "tutR": [[0, "kalem"], [t_kalem, None]],
    "duygu": [[0, "notr"], [t_got + 0.1, "saskin"], [t_mar + 0.1, "mahcup"], [e2a, "mahcup"], [s2a - 0.3, "saskin"], [s2b + 0.1, "saskin"],
              [s3a, "mutlu"], [s3b + 0.2, "mutlu"], [t_heh, "saskin"], [p0, "saskin"], [p0 + 0.6, "dusunceli"]],
    # bakış: Ece'ye (kadraj solu); utanınca kâğıda; TEPKİ'de Ece'nin konuştuğu boşluğa (kamera soluna) bakar
    "bak": sirala([[0, -0.18, -0.08, -0.06], [t_got + 0.15, -0.2, -0.05, -0.1], [t_mar + 0.2, 0.1, 0.65, 0], [t_bul, 0.05, 0.7, 0],
                   [s1a + 0.1, -0.15, 0.4, -0.05], [t_val, -0.2, 0.1, -0.1], [t_lamba - 0.3, -0.5, 0.45, -0.3], [t_lamba + 0.3, -0.22, -0.05, -0.1],
                   [s3a, -0.22, -0.05, -0.1], [t_yoo, -0.05, -0.05, 0.12], [t_yoo + 0.25, -0.35, -0.05, -0.25], [t_yoo + 0.5, -0.05, -0.05, 0.1],
                   [t_ala, -0.22, -0.05, -0.1], [t_heh, -0.3, 0.05, -0.15],
                   [p0, -0.35, 0.05, -0.18], [p0 + 0.45, -0.75, -0.1, -0.45], [p0 + 0.85, -0.75, -0.1, -0.45], [SON_T, -0.4, 0.05, -0.2]]),
    "tilt": sirala([[0, 0], [t_mar, -3], [s1b, -3], [s2a, 0], [s2a + 0.3, 8], [s2b + 0.3, 8], [s3a, 0], [t_heh, 5], [p0, 5], [p0 + 0.5, -7], [SON_T, -7]]),
    "omuzDus": [[0, 0], [t_mar, 0], [t_val, 1], [s1b + 0.6, 1], [e2a + 0.4, 0.4], [s3a, 0]],
    "egil": [[0, 0]],
    "goz": [[0, 0], [t_got + 0.05, 0], [t_got + 0.12, 0.9], [t_got + 0.2, 0], [s2b + 0.05, 0], [s2b + 0.12, 0.9], [s2b + 0.2, 0],
            [p0 + 0.95, 0], [p0 + 1.0, 0.9], [p0 + 1.06, 0]],
    "konus": [konus(r) for r in ("S1", "S2", "S3")],
}

# --- KASA'da Ece (önde, solda): S3 iki çekimi → "heh"te kameraya döner → NAH → 4. duvar → E6
ECE_KS = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": sirala([[0, KX, KY, KS], [t_heh, KX, KY, KS], [t_heh + 0.25, KX + 10, KY - 10, KS], [e5a, KX + 10, KY - 10, KS], [SON_T, KX + 10, KY - 10, KS]]),
    "duygu": [[0, "supheli"], [t_yoo + 0.2, "saskin"], [s3b - 0.1, "dusunceli"], [s3b + 0.2, "alayci"], [t_heh, "alayci"], [n0, "gulen"],
              [u0, "alayci"], [u0 + 0.5, "gulen"], [e5a, "alayci"], [t_dey, "supheli"], [t_al, "alayci"], [t_mkt, "mutlu"], [e5b + 0.1, "alayci"],
              [e6a, "mahcup"]],
    # bakış: Sabri'ye (kadraj sağı) → "heh"te KAMERAYA; E6'da gözler kaçar, sonda kameraya döner
    "bak": sirala([[0, 0.6, 0, 0.55], [s3b, 0.6, 0, 0.55], [t_heh - 0.1, 0.55, 0, 0.5], [t_heh + 0.2, 0, 0, 0], [e5a, 0, 0, 0],
                   [t_mkt - 0.2, 0, 0, 0], [t_mkt + 0.1, 0.55, -0.05, 0.4], [e5b, 0.5, -0.05, 0.35], [e5b + 0.25, 0, 0, 0],
                   [e6a, 0, 0, 0], [t_tam + 0.1, 0.75, 0.25, 0.25], [t_boc, 0.75, 0.25, 0.25], [t_boc + 0.15, -0.7, 0.3, -0.2],
                   [t_sic + 0.1, -0.7, 0.3, -0.2], [t_sic + 0.25, 0.1, 0.5, 0.05], [t_ola, 0.1, 0.5, 0.05], [t_ola + 0.5, 0, 0.05, 0], [SON_T, 0, 0.05, 0]]),
    "tilt": sirala([[0, 3], [s3b, 3], [t_heh, -6], [n0, -6], [u0, -8], [u0 + 0.6, 4], [e5a, 0], [t_dey, -4], [t_al, 0], [t_mkt, 5], [e5b, 0],
                    [e6a, 0], [t_tam, 6], [t_ola, -5], [SON_T, 3]]),
    "taklit": [[0, 0], [t_did - 0.12, 0], [t_did + 0.06, 1], [t_jib_e + 0.05, 1], [t_jib_e + 0.2, 0]],
    "omuzDus": [[0, 0], [e6a, 0], [t_tam, 0.5], [t_ola - 0.1, 0.4], [t_ola + 0.1, -1], [t_ola + 0.55, -1], [t_ola + 0.85, 0.3], [SON_T, 0.3]],
    "goz": [[0, 0], [u0 + 0.75, 0], [u0 + 0.82, 0.85], [u0 + 0.9, 0]],    # NAH sonrası göz kırpma
    "kulak": [[0, 0.3]],
    "konus": [konus("E4"), konus("E5"), konus("E6")],
    # E5 "market": sol eli (kadraj sağı) arkadaki marketi gösterir; E6: ense kaşır (sol el ensede)
    "elR": sirala([[e5a, KX + 150, 1820], [t_tek - 0.1, KX + 150, 1820], [t_mkt - 0.05, KX + 250, 1130], [e5b + 0.3, KX + 262, 1120], [p0, KX + 160, 1800],
                   [e6a - 0.2, KX + 160, 1800], [t_tam + 0.05, KX + 165, 1080], [t_tam + 0.2, KX + 172, 1062], [t_tam + 0.35, KX + 162, 1080],
                   [t_tam + 0.5, KX + 172, 1062], [t_boc, KX + 164, 1078], [t_boc + 0.2, KX + 172, 1062], [t_sic, KX + 166, 1078], [t_ola - 0.1, KX + 170, 1070],
                   [t_ola + 0.5, KX + 168, 1064], [SON_T, KX + 168, 1066]]),
    "elRara": [[e5a + 0.05, 99]],
}

# ------------------------------------------------------------------ NAH: adımlar ve el yerleri
NAH_A = [[0, 0], [t_heh + 0.05, 0], [t_heh + 0.45, 1], [n0 + 0.3, 1], [n0 + 0.62, 2], [t_sak, 3], [e5a - 0.02, 3], [e5a, -1]]
# kasa (orta-yakın): sağ elin dayanağı Ece'nin göğsünün önünde (kadraj solu); yükselir, NAH'tan sonra iki pompa
MX, MS = KX - 50, 0.95
NAH_KASA = [[t_heh + 0.05, MX, 1820, MS], [t_heh + 0.45, MX, 1335, MS], [n0, MX, 1330, MS],
            [u0, MX, 1300, MS], [u0 + 0.28, MX + 6, 1262, MS * 1.08], [u0 + 0.45, MX, 1300, MS], [u0 + 0.62, MX + 6, 1262, MS * 1.08], [u0 + 0.8, MX, 1300, MS]]
NAH_INS = [[n0, 420, 960, 3.2], [n0 + 0.3, 420, 920, 3.2], [t_sak, 420, 900, 3.2], [n0 + 1.2, 420, 900, 3.2], [n0 + 1.34, 425, 860, 3.36],
           [n0 + 1.5, 420, 900, 3.2], [n0 + 1.64, 425, 860, 3.36], [n0 + 1.8, 420, 900, 3.2]]
DARBE = [[0, 0], [t_sak - 0.02, 0], [t_sak, 1], [t_sak + 0.35, 0]]

# ------------------------------------------------------------------ KURGU + KAMERA
IKI = (440, 1150, 1.3)
MCU = (365, KYUZ + 350 / 1.55, 1.55)
YAK = (KX + 5, KYUZ + 330 / 2.4, 2.4)
ORT = (470, 1110, 1.2)
OY = (330, KYUZ + 330 / 1.7, 1.7)
kes(g0, "tezgah", EX, EYUZ + 400 / 1.3, 1.3)                    # A: Ece orta; kâğıda → Sabri'ye; büyü bozulur; "he koskoca…"
it(t_got - 0.05, "tezgah", EX, EYUZ + 400 / 1.42, 1.42)
kes(t_got - 0.05, "kasa", SX, SYUZ + 330 / 1.5, 1.5)            # B: Sabri orta: "götü boklu markette…" mahcup; "he valla" kalem düşer; lamba söner
it(e2a, "kasa", SX - 5, SYUZ + 330 / 1.58, 1.58)
kes(e2a, "tezgah", EX + 10, EYUZ + 330 / 2.0, 2.0)              # C: Ece yakın: "haa öbür taraf yok yani?" (öne eğilir)
it(s2a, "tezgah", EX + 10, EYUZ + 330 / 2.12, 2.12)
kes(s2a, "kasa", SX - 15, SYUZ + 320 / 2.2, 2.2)                # D: Sabri yakın, saf: "öbür taraf derken?"
it(e3a, "kasa", SX - 15, SYUZ + 320 / 2.3, 2.3)
kes(e3a, "tezgah", EX, EYUZ + 400 / 1.4, 1.4)                   # E: Ece orta, bıkkın: "ruhlar alemi" (hayalet elleri)
it(s3a, "tezgah", EX, EYUZ + 400 / 1.48, 1.48)
kes(s3a, "kasa", *IKI)                                          # F: iki çekim (Ece önde solda): "yoo ne alaka." → sinsi sırıtış
it(t_heh - 0.08, "kasa", IKI[0] - 10, IKI[1] + 5, IKI[2] + 0.04)
it(t_heh + 0.22, "kasa", *MCU)                                  # "heh": kameraya döner, kamera HIZLA yaklaşır (4. duvar)
kes(n0, "nah", 540, 960, 1.0)                                   # G: NAH el yakın planı
it(t_sak, "nah", 540, 940, 1.04)
it(n0 + DUR["NAH"], "nah", 540, 935, 1.06)
kes(u0, "kasa", *MCU)                                           # H: yüzüyle birlikte (orta-yakın): yumruk önde, pompa
it(e5a, "kasa", MCU[0] - 3, MCU[1] - 4, MCU[2] + 0.06)
kes(e5a, "kasa", *YAK)                                          # I: yakın: "Did ind jib" taklit suratı → "deyip duruyordunuz"
it(t_al - 0.05, "kasa", YAK[0], YAK[1] - 4, YAK[2] + 0.1)
kes(t_al - 0.05, "kasa", *ORT)                                  # J: orta: "al bak tek ortak noktamız market" (arkadaki marketi gösterir)
it(p0, "kasa", ORT[0], ORT[1] - 5, ORT[2] + 0.05)
kes(p0, "kasa", SX - 15, SYUZ + 320 / 2.15, 2.15)               # K: Sabri yakın: anlamaz, Ece'nin konuştuğu boşluğa bakar, kafasını kaşır
it(e6a, "kasa", SX - 15, SYUZ + 320 / 2.22, 2.22)
kes(e6a, "kasa", *OY)                                           # L: Ece orta-yakın: "tamam böcek biraz sıçana benzemiş olabilir" (mahcup)
it(SON_T, "kasa", OY[0] - 5, OY[1] - 6, OY[2] + 0.08)

# Ece kasa görünümünde yalnız iki/4. duvar çekimlerinde (Sabri'nin tek çekimlerinde kamera Ece'nin "içinden" bakar, P1 gibi)
ECE_KASA_ARA = [[s3a - 0.01, p0], [e6a - 0.01, 99]]
# 4. duvar odağı: arka plan bulanır/kararır (market planında yarıya iner ki market görünsün)
ODAK = [[0, 0], [t_heh, 0], [t_heh + 0.25, 1], [t_al - 0.06, 1], [t_al - 0.05, 0.45], [p0 - 0.01, 0.45], [p0, 0], [e6a - 0.01, 0], [e6a, 1], [SON_T, 1]]

# ------------------------------------------------------------------ IŞIK (P1 sonu: floresan kısık + lamba açık → normale döner)
FLOR = [[0, 0.6], [t_pop - 0.01, 0.6], [t_pop + 0.12, 1], [SON_T, 1]]
CIZIR = [[0, 0.3], [t_pop, t_pop + 0.22]]
LAMBA = [[0, 1], [t_lamba - 0.01, 1], [t_lamba + 0.04, 0], [SON_T, 0]]

ORTAK = {"saat": [[0, "19:09"]], "kapi": [[0, 0]], "flor": FLOR, "cizir": CIZIR, "lamba": LAMBA,
         "titre": {"tezgah": 1.4, "kasa": 1.3, "nah": 2.2},
         "blok": [[0, 560]], "gazete": [[0, 1300]], "gazeteTz": [[0, -700]], "kagitTz": [[0, 1]], "elAra": [],
         "kalemMasa": [[0, -999, 0], [t_kalem - 0.001, -999, 0], [t_kalem, 640, 0], [t_kalem + 0.18, 640, 1]],
         "eceKasaAra": ECE_KASA_ARA, "odak": ODAK, "nahA": NAH_A, "nahYer": {"kasa": NAH_KASA, "nah": NAH_INS}, "nahIleri": 0.55,
         "nahIleriIns": 0.3, "darbe": DARBE}
KAR = {"tezgah": {"ece": ECE_TZ}, "kasa": {"sabri": SAB, "ece": ECE_KS}, "nah": {}}


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


# ------------------------------------------------------------------ EFEKT (görüntü olayları; ses yönetmeni son hâlini verir)
def E(ad, isim, t, vol=0.5, **kw):
    return {"name": f"efekt/{isim}", "at": round(t - T[ad], 3), "volume": vol, **kw}


SFX = {
    "GIRIS": [E("GIRIS", "floresan_cit", t_pop, 0.5)],
    "E1": [],
    "S1": [E("S1", "kalem_cit", t_kalem, 0.5), E("S1", "el_kalem_tik", t_lamba, 0.45)],
    "E4": [E("E4", "el_whoosh_kay", t_heh, 0.4)],
    "NAH": [E("NAH", "el_kumas_burus", n0 + 0.35, 0.35), E("NAH", "tokat", t_sak, 0.7)],
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
    ep_id = "724-08-p2"
    man, beats = {}, []
    for i, (ad, r, b) in enumerate(vuruslar()):
        if r:
            man[f"i_{i + 1:02d}"] = M[TAKE[r]]
        beats.append(b)
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Market · nah", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.5}, "music": {"name": "yok"}, "beats": beats}
    # manifest: motorun anahtarı (sahne_vuruş) → seçilen çekim; çekimlerin kendisi korunur
    tum = dict(M)
    tum.update(man)
    json.dump(tum, open(f"{VD}/manifest.json", "w"), ensure_ascii=False, indent=1)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 8, "title": "Bölüm 8 · Parça 2", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON_T:.2f} sn  çekimler: {TAKE}")
    for ad, r, d in SIRA:
        print(f"  {ad:6s} {T[ad]:6.2f} +{DUR[ad]:.2f}" + (f"  {TAKE[r]}" if r else ""))
    print("kurgu:", [(round(t, 2), v) for t, v in KURGU])
    olay = {"_not": "B8 P2 görüntü olayları (sahne zamanı, sn; parça başı = 0). Üretici: tools/b8p2.py. Ses yönetmeni efektleri buna oturtur.",
            "cekimler": TAKE, "vuruslar": {ad: [round(T[ad], 3), round(T[ad] + DUR[ad], 3)] for ad, *_ in SIRA},
            "replik_ses": {r: [round(V(r)[0], 3), round(V(r)[1], 3)] for r in TAKE},
            "kurgu": KURGU,
            "olaylar": {"floresan_normale": round(t_pop, 3), "kalem_duser": round(t_kalem, 3), "lamba_soner": round(t_lamba, 3),
                        "heh_kameraya_doner": round(t_heh, 3), "hizli_yaklasma": [round(t_heh, 3), round(t_heh + 0.22, 3)],
                        "nah_el_acik": round(n0, 3), "nah_parmaklar_kapanir": [round(n0 + 0.3, 3), round(n0 + 0.62, 3)], "SAK": round(t_sak, 3),
                        "nah_pompa": [round(n0 + 1.34, 3), round(n0 + 1.64, 3), round(u0 + 0.28, 3), round(u0 + 0.62, 3)],
                        "taklit_surat": [round(t_did - 0.12, 3), round(t_jib_e + 0.2, 3)], "market_gosterir": round(t_mkt, 3),
                        "sabri_cene_ovar": [round(p0 + 0.45, 3), round(p0 + 0.9, 3)], "ense_kasir": [round(t_tam, 3), round(t_ola, 3)],
                        "omuz_silker": round(t_ola + 0.1, 3)},
            "toplam": round(SON_T, 3)}
    json.dump(olay, open(f"{K}/../docs/diziler/724/raporlar/b8p2-goruntu-zaman.json", "w"), ensure_ascii=False, indent=1)
