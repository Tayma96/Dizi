"""7/24 B8 Parça 1 (market, ~19:00): Ece markete gelir, Sabri anlatır (kâğıda çizerek).
Kullanım: python3 tools/b8p1.py [--cekim R1=R1b_01,R6=R6b_01 ...]   -> public/episodes/724-08-p1.json + public/voice/724-08-p1/manifest.json
Kullanıcının metni AYNEN ("Bölüm 8, Parça 1"); yeni replik YOK. Sözsüz eylem/tepkiler görüntü yönetmeninin.
Kurgu (görünümler Inserts18 b8_market): dis → kapi (camın ardında nefes) → kapi (kapı açılır, girer) → [R1] kasa →
tezgah (eller tezgâhta) [R2: tezgah / kasa tepki / tezgah yakın] → [R3] kasa (lamba, fiş bloğu) → kagit (3 daire) [R4] →
tezgah (merak) → kagit (birleşen çizgiler) [R5: ortak yaşam çizgisi → kasa yakın] → [R6: kasa yakın / kagit paralel çizgiler /
tezgah (anlamaya çalışma) / kagit] → [R7: kasa çok yakın "ancak geceleri" / kagit (yakınsama, son daire, bastırma; yavaş itme)] →
kagit (floresan cızırtısı) → tezgah çok yakın (yutkunma).
Coğrafya / 180°: Ece müşteri tarafında (genelde solda), Sabri kasada (sağda). Tek kişilik çekimlerde Ece kadrajın biraz sağına
(Sabri'ye), Sabri biraz soluna (Ece'ye) bakar. Lamba Sabri'nin sağında: kasa görünümünde solda, kâğıtta sol üstte.
"""
import json, math, os, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
VFROM = 2 / FPS  # ses vuruş başından 2 kare sonra başlar (timeline.ts)

M = json.load(open(f"{K}/public/voice/724-08/manifest.json"))
TAKE = {"R1": "R1a_01", "R2": "R2a_01", "R3": "R3a_01", "R4": "R4a_01", "R5": "R5a_01", "R6": "R6a_01", "R7": "R7a_01"}
_sec = f"{K}/public/voice/724-08/secim.json"
if os.path.exists(_sec):   # ses yönetmeninin çekim seçimleri
    for k, v in json.load(open(_sec)).items():
        if isinstance(v, dict) and "sec" in v and v["sec"] in M:
            TAKE[f"R{k.split('_')[0]}"] = v["sec"]
for a in sys.argv[1:]:
    if a.startswith("--cekim"):
        continue
    for kv in a.split(","):
        if "=" in kv:
            k, v = kv.split("=")
            TAKE[k] = v
METIN = {"R1": ("sabri", "geldin demek, hoş geldin"), "R2": ("ece_sivil", "abi uzatmaya gerek yok neydi bu gece olanlar? Bana bazı cevaplar borçlusun!"),
         "R3": ("sabri", "Anlatayım kızım"), "R4": ("sabri", "bunlar dünyadaki topluluklar"), "R5": ("sabri", "Bu da ortak yaşam çizgimiz."),
         "R6": ("sabri", "İnsanlar asırlar boyunca hikâyeler anlattı, korkular yarattı ve bunların her biri paralel bir çizgi oluşturdu"),
         "R7": ("sabri", "ancak geceleri tüm bu paralel çizgiler bir ortak noktada buluşuyor")}

# (ad, replik|None, süre (insert) ya da boşluk (replik), sahne)
SIRA = [
    ("DIS", None, 3.9, "d"),
    ("CAM", None, 3.0, "i"),
    ("KAPI", None, 2.7, "i"),
    ("R1", "R1", 0.3, "i"),
    ("VARIS", None, 0.7, "i"),
    ("R2", "R2", 0.45, "i"),
    ("R3", "R3", 0.2, "i"),
    ("DAIRE", None, 1.3, "i"),
    ("R4", "R4", 0.2, "i"),
    ("MERAK", None, 1.25, "i"),
    ("BIRLES", None, 1.45, "i"),
    ("R5", "R5", 0.3, "i"),
    ("R6", "R6", 0.45, "i"),
    ("R7", "R7", 0.0, "i"),
    ("SON", None, 1.7, "i"),
    ("YUTKUN", None, 2.0, "i"),
]
T, DUR, fr = {}, {}, 0
for ad, r, d, _ in SIRA:
    T[ad] = fr / FPS
    n = round(((M[TAKE[r]]["duration"] + d) if r else d) * FPS)
    DUR[ad] = n / FPS
    fr += n
SON_T = fr / FPS


def W(r, kelime, uc="start", n=0):
    """replik r'nin n. eşleşen kelimesinin SAHNE zamanı"""
    ws = [w for w in M[TAKE[r]]["words"] if w["w"].lower().strip(",.?!").startswith(kelime.lower())]
    return round(T[r] + VFROM + ws[n][uc], 3)


def V(r):
    """replik sesinin sahne zamanında başlangıç / bitiş"""
    return T[r] + VFROM, T[r] + VFROM + M[TAKE[r]]["duration"]


konus = lambda r: {"t": round(T[r] + VFROM, 3), "cues": M[TAKE[r]]["mouth"]}
sirala = lambda k: sorted(k, key=lambda q: q[0])

# ------------------------------------------------------------------ kamera (görünüm başına; taşma kırpması: siyah boşluk yok)
SINIR = {"dis": (-420, 1500, -300, 2240), "kapi": (0, 1080, 0, 1920), "tezgah": (0, 1080, 0, 1920), "kasa": (0, 1080, 0, 1920), "kagit": (-600, 1680, -400, 2320)}


def kirp(view, cx, cy, z, pay=10):
    x0, x1, y0, y1 = SINIR[view]
    hw, hh = 540 / z + pay, 960 / z + pay
    return [round(min(max(cx, x0 + hw), x1 - hw), 1), round(min(max(cy, y0 + hh), y1 - hh), 1), round(z, 3)]


CAM = {v: [] for v in SINIR}
KURGU = []


def kes(t, view, cx, cy, z):
    """yeni çekim: görünüm değişir ya da aynı görünümde sert kesme"""
    k = CAM[view]
    if k:
        k.append([round(t - 0.004, 3)] + k[-1][1:])
    k.append([round(t, 3)] + kirp(view, cx, cy, z))
    KURGU.append([round(t, 3), view])


def it(t, view, cx, cy, z):
    CAM[view].append([round(t, 3)] + kirp(view, cx, cy, z))


# ------------------------------------------------------------------ yerleşimler
# tezgah: Ece tezgâhın önünde (ayak 1700, boy 1250 → yüz y≈744, omuz y≈915), tezgâh uzak kenarı y 1205
EX, EY, ES = 560, 1700, 1250
EYUZ = EY - 765 * ES / 1000
# kasa: Sabri kasiyer işaretinde (540, 1960, 1180) → yüz y≈1057, tezgâh üstü y≈1440
SX, SY, SS = 540, 1960, 1180
SYUZ = SY - 765 * SS / 1000

# ------------------------------------------------------------------ ÇİZİM (kâğıt koordinatı)
C = [(330, 600), (330, 840), (330, 1080)]
R = 78
MN = (165, 1300)          # birleşme noktası (ortak nokta)
N = (870, 840)            # gecenin buluşma noktası
CIZIM, UC, BAS, NOKTA = [], [], [], []


def ease(u):
    return u * u * (3 - 2 * u)


def daire_pts(c, r, n=46, bas=-100, tur=1.08, faz=0.0):
    out = []
    for i in range(n + 1):
        u = i / n
        th = math.radians(bas) - 2 * math.pi * tur * u   # saat yönünün tersine (sağ elle doğal)
        rr = r * (1 + 0.03 * math.sin(3 * th + faz) + 0.012 * math.sin(7 * th))
        out.append((c[0] + rr * math.cos(th), c[1] + rr * math.sin(th)))
    return out


def egri_pts(a, k, b, n=26, tit=1.6, faz=0.0):
    out = []
    for i in range(n + 1):
        u = i / n
        x = (1 - u) ** 2 * a[0] + 2 * u * (1 - u) * k[0] + u * u * b[0]
        y = (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * k[1] + u * u * b[1]
        out.append((x + tit * math.sin(u * 9 + faz), y + tit * math.sin(u * 7 + faz + 1)))
    return out


def cizgi(pts, t0, t1, w=9):
    """mürekkep + kalem ucu: noktalar t0..t1 arasında yumuşak hızla"""
    n = len(pts) - 1
    p = []
    for i, (x, y) in enumerate(pts):
        t = t0 + (t1 - t0) * ease(i / n) if n else t0
        p.append([round(t, 3), round(x, 1), round(y, 1)])
        UC.append([round(t, 3), round(x, 1), round(y, 1), 0])
    CIZIM.append({"w": w, "p": p})


def kalk(t0, t1, a, b, h=1.0):
    """kalem kalkar, a'dan b'ye gider (mürekkep yok)"""
    UC.append([round(t0 + 0.03, 3), round(a[0], 1), round(a[1], 1), 0.3])
    UC.append([round((t0 + t1) / 2, 3), round((a[0] + b[0]) / 2, 1), round((a[1] + b[1]) / 2 - 20, 1), h])
    UC.append([round(t1 - 0.04, 3), round(b[0], 1), round(b[1], 1), 0.3])


def dokun(t, p, nokta=True):
    """kalemle kâğıda dokunma (vurgu); ucu küçük nokta bırakır"""
    UC.extend([[round(t - 0.12, 3), p[0], p[1] - 10, 0.55], [round(t, 3), p[0], p[1], 0], [round(t + 0.1, 3), p[0], p[1] - 8, 0.5]])
    if nokta:
        BAS.append({"t0": round(t, 3), "t1": round(t + 0.05, 3), "x": p[0], "y": p[1], "r": 4})


def bekle(t0, t1, p, h=0.6):
    UC.extend([[round(t0, 3), p[0], p[1], h], [round(t1, 3), p[0] + 6, p[1] - 4, h]])


def cizim_kur():
    d0 = T["DAIRE"]
    # kalem önce C1'in tepesinin üstünde bekler (Sabri kâğıdı önüne çekmiş, kalemi tutuyor)
    st = daire_pts(C[0], R)[0]
    UC.append([round(d0 - 0.5, 3), st[0] + 30, st[1] - 60, 0.9])
    UC.append([round(d0 + 0.02, 3), st[0], st[1], 0.3])
    # 1) üç daire (altlı üstlü): DAIRE vuruşunda ikisi, R4 "bunlar" sırasında üçüncüsü
    t = d0 + 0.08
    for i, c in enumerate(C):
        pts = daire_pts(c, R, faz=i * 1.7)
        cizgi(pts, t, t + 0.6)
        if i < 2:
            nx = daire_pts(C[i + 1], R)[0]
            kalk(t + 0.6, t + 0.78, pts[-1], nx, 0.8)
        t += 0.78
    son = daire_pts(C[2], R)[-1]
    # "dünyadaki topluluklar": kalem üç daireye sırayla dokunur
    tD, tT = W("R4", "dünyadaki"), W("R4", "topluluklar")
    kalk(t - 0.18, tD - 0.12, son, (C[0][0], C[0][1] - 10), 0.8)
    dokun(tD, C[0])
    kalk(tD + 0.1, tD + 0.42, C[0], C[1], 0.6)
    dokun(tD + 0.5, C[1])
    kalk(tD + 0.6, tT + 0.12, C[1], C[2], 0.6)
    dokun(tT + 0.2, C[2])
    bekle(tT + 0.35, T["BIRLES"] - 0.2, (C[2][0] + 40, C[2][1] - 30), 0.7)
    # 2) birleşen çizgiler: her daireden ortak noktaya (sol-aşağı yay), BIRLES vuruşunda
    b0 = T["BIRLES"] + 0.06
    yay = [((262, 639), (170, 820)), ((262, 879), (205, 1060)), ((265, 1117), (215, 1240))]
    for i, (a, k) in enumerate(yay):
        if i == 0:
            kalk(b0 - 0.25, b0, (C[2][0] + 40, C[2][1] - 30), a, 0.7)
        pts = egri_pts(a, k, MN, faz=i)
        cizgi(pts, b0, b0 + 0.36)
        if i < 2:
            kalk(b0 + 0.36, b0 + 0.46, MN, yay[i + 1][0], 0.7)
        b0 += 0.46
    # 3) ortak yaşam çizgisi: ortak noktadan sağa ("Bu da ortak" boyunca çizilir)
    l0, l1 = W("R5", "bu") - 0.05, W("R5", "yaşam", "end")
    bekle(b0 - 0.1, l0 - 0.02, MN, 0.2)
    cizgi(egri_pts(MN, (560, 1308), (935, 1288), n=30, tit=1.2), l0, l1, w=10)
    # "çizgimiz": kalem çizginin üstünde geri kayar (vurgu, dokunmadan)
    tc = W("R5", "çizgimiz")
    UC.extend([[round(tc, 3), 935, 1280, 0.15], [round(tc + 0.7, 3), 560, 1292, 0.15], [round(tc + 0.85, 3), 540, 1270, 0.6]])
    # 4) paralel çizgiler: her dairenin yanından bağımsız birer çizgi (R6 "hikâyeler" / "korkular" / "yarattı")
    tp = [W("R6", "hikâyeler"), W("R6", "korkular"), W("R6", "yarattı")]
    onceki = (540, 1270)
    for i, c in enumerate(C):
        a = (c[0] + R + 4, c[1]); b = (690, c[1] + (-2, 1, 3)[i])
        kalk(tp[i] - 0.45, tp[i], onceki, a, 0.8)
        cizgi(egri_pts(a, ((a[0] + b[0]) / 2, c[1] + 2), b, n=18, tit=1.0, faz=i), tp[i], tp[i] + 0.55)
        onceki = b
    # "paralel bir çizgi oluşturdu": kalem üç çizginin ucuna sırayla dokunur (noktasız)
    tpar, tolu = W("R6", "paralel"), W("R6", "oluşturdu")
    kalk(tp[2] + 0.55, tpar - 0.1, onceki, (640, C[0][1]), 0.7)
    dokun(tpar, (640, C[0][1] - 1), nokta=False)
    dokun(tpar + 0.45, (640, C[1][1] + 1), nokta=False)
    dokun(tolu + 0.15, (640, C[2][1] + 3), nokta=False)
    bekle(tolu + 0.3, W("R7", "tüm") - 0.25, (700, C[2][1] - 40), 0.7)
    # 5) gece: paralel çizgiler tek noktada buluşur ("tüm bu" / "paralel" / "çizgiler")
    tq = [W("R7", "tüm"), W("R7", "paralel"), W("R7", "çizgiler")]
    yak = [((690, 598), (800, 612)), ((690, 841), (780, 841)), ((690, 1083), (800, 1068))]
    sira = [2, 0, 1]
    onceki = (700, C[2][1] - 40)
    for j, i in enumerate(sira):
        a, k = yak[i]
        kalk(tq[j] - 0.3, tq[j], onceki, a, 0.7)
        cizgi(egri_pts(a, k, N, n=20, tit=0.8, faz=i), tq[j], tq[j] + 0.5)
        onceki = N
    # "bir ortak noktada": kalem buluşma noktasının üstünde bekler, iki kez dokunur
    to, tn = W("R7", "ortak"), W("R7", "noktada")
    bekle(tq[2] + 0.55, to - 0.15, (N[0] + 10, N[1] - 30), 0.5)
    dokun(to, N, nokta=False)
    dokun(tn + 0.2, N, nokta=False)
    # "buluşuyor": noktanın çevresine yuvarlak, kalem ortada bastırılır (mürekkep lekesi)
    tb = W("R7", "buluşuyor")
    pts = daire_pts(N, 58, n=40, bas=-120, tur=1.12, faz=2.2)
    kalk(tn + 0.35, tb, N, pts[0], 0.5)
    cizgi(pts, tb, tb + 0.62, w=12)
    kalk(tb + 0.62, tb + 0.8, pts[-1], N, 0.3)
    UC.append([round(tb + 0.82, 3), N[0], N[1], 0])
    UC.append([round(tb + 1.5, 3), N[0], N[1], 0])     # bastırır
    BAS.append({"t0": round(tb + 0.82, 3), "t1": round(tb + 1.5, 3), "x": N[0], "y": N[1], "r": 15})
    # el kalkar ve çekilir (SON)
    s0 = T["SON"]
    UC.extend([[round(max(tb + 1.6, s0 + 0.1), 3), N[0] - 20, N[1] - 40, 0.8], [round(s0 + 0.9, 3), -200, -500, 1]])


cizim_kur()
UC = sirala(UC)
# eşit zamanlı kalem anahtarlarını ayır (doğrusal ara değer için)
for i in range(1, len(UC)):
    if UC[i][0] <= UC[i - 1][0]:
        UC[i][0] = round(UC[i - 1][0] + 0.002, 3)

# ------------------------------------------------------------------ KARAKTERLER
r1a, r1b = V("R1"); r2a, r2b = V("R2"); r3a, r3b = V("R3")
t_bas_R1 = W("R1", "geldin"); t_hos = W("R1", "hoş")
t_neydi = W("R2", "neydi"); t_bana = W("R2", "bana"); t_borc = W("R2", "borçlusun")
t_anlat = W("R3", "anlatayım"); t_kizim = W("R3", "kızım")

# --- DIŞ: Ece arkadan, siluet; vitrine yürür, durur, tabelaya bakar (dış izdüşüm: x = 540 + X·900/Z, y = 1050 + 1350/Z, boy = 1515/Z)
disP = lambda X, Z: [round(540 + X * 900 / Z, 1), round(1050 + 1350 / Z, 1), round(1515 / Z, 1)]
d0 = T["DIS"]
ECE_DIS = {"id": "ece_sivil", "yer": [[d0, *disP(0.72, 1.12)], [d0 + 2.75, *disP(0.5, 4.0)], [d0 + 3.9, *disP(0.5, 4.0)]],
           "yuru": [[d0, d0 + 2.75]], "duygu": [[0, "korkmus"]],
           "bak": [[d0, 0, 0, 0], [d0 + 2.9, 0, 0, 0], [d0 + 3.2, 0, -0.6, 0]], "tilt": [[d0, 0], [d0 + 2.9, 0], [d0 + 3.25, -5]],
           "egil": [[d0, 0], [d0 + 2.9, 0], [d0 + 3.3, -3]], "kolL": [[0, 6, 0]], "kolR": [[0, 6, 0]]}

# --- KAPI: dışarıda camın ardında (ayak 1188, boy 600) → kapı açılır → içeri, kameraya (kasaya) doğru yürür
c0, k0 = T["CAM"], T["KAPI"]
t_adim = k0 + 0.15          # sensörün önüne adım
t_ac0, t_ac1 = k0 + 0.42, k0 + 1.15
t_esik = k0 + 1.35          # eşiği geçer (artık camın önünde)
ECE_KAPI = {
    "id": "ece_sivil",
    "yer": [[c0, 550, 1176, 585], [k0, 550, 1176, 585], [t_adim + 0.35, 550, 1190, 600], [t_ac1, 550, 1192, 600],
            [t_esik, 548, 1265, 650], [k0 + 2.7, 520, 1560, 980], [r1a + 0.05, 515, 1610, 1040], [r1b + 1, 515, 1610, 1040]],
    "yuru": [[t_adim, t_adim + 0.35], [t_ac1, r1a + 0.05]],
    "duygu": [[0, "korkmus"], [c0 + 2.1, "kararli"], [k0 + 1.6, "supheli"], [k0 + 2.2, "korkmus"], [r1a + 0.1, "saskin"], [t_hos, "kararli"]],
    "goz": [[c0, 0], [c0 + 0.95, 0], [c0 + 1.2, 1], [c0 + 1.85, 1], [c0 + 2.05, 0]],
    "nefes": [[c0, 2], [c0 + 0.9, 2], [c0 + 1.0, 0.6], [c0 + 2.2, 0.6], [c0 + 2.4, 1.6]],
    "parmakUcu": [[c0, 0], [c0 + 0.95, 0], [c0 + 1.5, 9], [c0 + 1.75, 9], [c0 + 2.2, 0]],      # derin nefes: göğüs/omuz kalkar
    "egil": [[c0, 0], [c0 + 0.95, 0], [c0 + 1.5, -2.5], [c0 + 2.2, 0]],
    "bak": [[c0, 0.1, 0.1, 0.05], [c0 + 0.5, -0.25, -0.55, -0.1], [c0 + 0.9, 0, 0.1, 0], [c0 + 2.05, 0, 0.15, 0], [c0 + 2.35, 0.05, -0.05, 0],
            [k0 + 1.4, 0, 0, 0], [k0 + 1.65, -0.2, -0.85, -0.1], [k0 + 2.05, -0.2, -0.85, -0.1], [k0 + 2.3, 0.15, 0.8, 0.1],
            [r1a, 0.15, 0.7, 0.1], [r1a + 0.25, 0.85, 0.0, 0.55], [r1b + 1, 0.85, 0.0, 0.55]],
    "tilt": [[c0, 0], [c0 + 0.5, -4], [c0 + 0.9, 0], [k0 + 1.65, -3], [k0 + 2.3, 4], [r1a, 0]],
    "gozSok": [[r1a, 0], [r1a + 0.12, 0.45], [r1a + 0.6, 0]],
    "kulak": [[0, 0.32]], "kolL": [[0, 6, 0]], "kolR": [[0, 6, 0]],
    "yutkun": [[c0, 0], [c0 + 2.35, 0], [c0 + 2.75, 1]],
}

# --- TEZGAH: Ece tezgâhın önünde (Sabri'nin tarafından); elleri tezgâhta
v0 = T["VARIS"]
m0 = T["MERAK"]
y0 = T["YUTKUN"]
r6a, r6b = V("R6"); r7a, r7b = V("R7")
t6_ve = W("R6", "ve")
EL_L, EL_R = (474, 1192), (648, 1190)
ECE_TZ = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": [[v0, EX, EY - 110, ES - 120], [v0 + 0.42, EX, EY, ES], [t_bana, EX, EY, ES], [t_borc + 0.3, EX, EY + 40, ES + 40], [r2b + 0.4, EX, EY, ES],
            [m0, EX, EY, ES], [m0 + 0.6, EX, EY + 60, ES + 55], [r6a, EX, EY + 45, ES + 40], [t6_ve, EX, EY + 45, ES + 40], [t6_ve + 0.8, EX, EY + 30, ES + 25],
            [y0, EX, EY + 30, ES + 25], [y0 + 0.8, EX, EY + 10, ES + 5], [SON_T, EX, EY + 10, ES + 5]], "yuru": [[v0, v0 + 0.42]],
    "elL": sirala([[v0, 470, 1300], [v0 + 0.3, 474, 1150], [v0 + 0.42, *EL_L], [m0, *EL_L], [m0 + 0.4, EL_L[0] + 10, EL_L[1] + 8], [y0, EL_L[0] + 10, EL_L[1] + 8],
                   [y0 + 0.5, EL_L[0] + 22, EL_L[1] + 2], [SON_T, EL_L[0] + 22, EL_L[1] + 2]]),
    "elR": sirala([[v0, 650, 1300], [v0 + 0.3, 648, 1150], [v0 + 0.42, *EL_R], [t_borc - 0.25, *EL_R], [t_borc - 0.05, 656, 1125], [t_borc + 0.12, 656, 1192],
                   [t_borc + 0.3, 656, 1125], [t_borc + 0.45, 656, 1192], [m0, 656, 1192], [m0 + 0.4, 650, 1196], [y0, 650, 1196], [y0 + 0.5, 640, 1194], [SON_T, 640, 1194]]),
    "duygu": [[0, "kararli"], [r2a + 0.1, "ofkeli"], [t_bana - 0.1, "ofkeli"], [r2b + 0.2, "kararli"],
              [m0, "saskin"], [m0 + 0.6, "dusunceli"], [r6a, "dusunceli"], [t6_ve, "supheli"], [y0, "korkmus"]],
    "bak": [[v0, 0.15, 0.1, 0.1], [r2a, 0.2, -0.05, 0.12], [t_bana, 0.2, -0.1, 0.12], [r2b + 0.3, 0.2, 0, 0.1],
            [m0, 0.05, 0.75, 0.0], [m0 + 0.7, 0.05, 0.8, 0.0], [m0 + 1.0, 0.25, -0.05, 0.1],
            [t6_ve - 0.1, 0.05, 0.75, 0.0], [t6_ve + 0.55, 0.25, -0.05, 0.12], [t6_ve + 1.1, 0.05, 0.75, 0], [t6_ve + 1.5, 0.22, 0, 0.1],
            [y0, 0.05, 0.6, 0], [y0 + 0.9, 0.05, 0.62, 0], [y0 + 1.3, 0.22, -0.05, 0.1]],
    "tilt": [[v0, 0], [t_bana, -3], [r2b, 0], [m0, 0], [m0 + 0.6, 5], [t6_ve, 5], [t6_ve + 0.8, -4], [y0, 0]],
    "egil": [[0, 0]],
    "goz": [[y0, 0], [y0 + 1.45, 0], [y0 + 1.55, 0.7], [y0 + 1.65, 0]],
    "gozSok": [[y0, 0], [y0 + 0.2, 0.3], [SON_T, 0.3]],
    "yutkun": [[y0, 0], [y0 + 0.45, 0], [y0 + 1.15, 1]],
    "solgun": [[y0, 0], [y0 + 0.6, 0.35]],
    "nefes": [[r2b, 2.5], [r2b + 0.8, 1.2]],
    "kulak": [[0, 0.3]],
    "konus": [konus("R2")],
}

# --- KASA: Sabri kasada (SOLAK: kalem sol elinde = kadraj sağı). Bulmaca → başını kaldırır → lamba (sağ el), gazete/fiş bloğu (sol el)
SAB = {
    "onKol": True, "dogalKol": True,
    "yer": [[0, SX, SY, SS]],
    # sol el (kadraj sağı, kalemli): bulmacaya yazar; R3'te gazeteyi kenara iter, fiş bloğunu önüne çeker
    "elR": sirala([[0, 590, 1428], [r1a, 590, 1428], [r1a + 0.2, 612, 1432], [r1a + 0.4, 596, 1426], [r1a + 0.6, 620, 1431], [r1a + 0.8, 600, 1427],
                   [t_hos - 0.1, 598, 1430], [t_hos + 0.3, 610, 1434], [t_neydi, 610, 1434], [t_neydi + 0.6, 625, 1438],
                   [r3a + 0.25, 625, 1436], [r3a + 0.7, 870, 1434], [r3a + 0.85, 760, 1432], [r3a + 1.0, 712, 1432], [r3a + 1.35, 590, 1432], [SON_T, 590, 1432]]),
    # sağ el (kadraj solu): tezgâhta durur; R3'te lambanın düğmesine uzanır, sonra fişi tutar
    "elL": sirala([[0, 470, 1436], [r3a + 0.15, 470, 1436], [r3a + 0.42, 378, 1408], [r3a + 0.62, 380, 1412], [r3a + 1.0, 480, 1434], [SON_T, 480, 1434]]),
    "tutR": [[0, "kalem"]],
    "duygu": [[0, "notr"], [t_hos, "mutlu"], [r1b + 0.2, "notr"], [t_neydi, "uzgun"], [r2b, "notr"], [r6a, "notr"]],
    "bak": [[0, 0, 0.85, 0], [t_hos - 0.15, 0, 0.85, 0], [t_hos + 0.2, -0.25, -0.05, -0.12],
            [t_neydi, -0.25, 0.0, -0.12], [r2b, -0.25, 0.05, -0.12],
            [r3a + 0.3, -0.5, 0.5, -0.3], [r3a + 0.7, 0.3, 0.6, 0.15], [r3a + 1.2, 0, 0.6, 0], [t_anlat, -0.25, 0.0, -0.12],
            [V("R5")[1] - 1.3, -0.05, 0.5, 0], [V("R5")[1] - 0.9, -0.22, -0.1, -0.1], [r6a + 0.5, -0.2, -0.05, -0.1], [r6a + 1.3, 0, 0.45, 0],
            [r7a, -0.18, -0.08, -0.06], [r7b, -0.18, -0.08, -0.06]],
    "tilt": [[0, 4], [t_hos, 4], [t_hos + 0.3, 0], [t_neydi, 0], [t_neydi + 0.7, -3], [r2b, -3], [r3a + 1.2, 0], [r7a, 0], [r7a + 1.5, 2]],
    "egil": [[0, 0]],
    "goz": [[0, 0], [t_neydi + 0.3, 0], [t_neydi + 0.45, 0.85], [t_neydi + 0.8, 0.85], [t_neydi + 0.95, 0]],
    "konus": [konus(r) for r in ("R1", "R3", "R4", "R5", "R6", "R7")],
}

# ------------------------------------------------------------------ KURGU + KAMERA
kes(T["DIS"], "dis", 560, 1200, 1.05)
it(T["DIS"] + 3.9, "dis", 600, 1150, 1.16)                 # yavaş itme: vitrine yaklaşır

kes(T["CAM"], "kapi", 552, 729 + 300 / 3.1, 3.1)                       # camın ardında yüz (orta-yakın): tedirgin, derin nefes
it(T["CAM"] + 3.0, "kapi", 552, 729 + 300 / 3.35, 3.35)
kes(T["KAPI"], "kapi", 545, 880, 1.12)                      # geniş: kapı açılır, içeri girer, saate / yere bakar
it(T["KAPI"] + 2.7, "kapi", 540, 960, 1.18)
it(r1a + 0.5, "kapi", 538, 975, 1.2)
kes(r1a + 0.55, "kasa", SX, SYUZ + 330 / 1.5, 1.5)          # "demek": Sabri başı önde bulmacada → "hoş geldin"de kaldırır
it(r1b + 0.3, "kasa", SX, SYUZ + 330 / 1.58, 1.58)
kes(v0, "tezgah", EX, EYUZ + 400 / 1.3, 1.3)                 # Ece gelir, avuçlar tezgâha (orta)
it(t_neydi, "tezgah", EX, EYUZ + 395 / 1.34, 1.34)
kes(t_neydi, "kasa", SX - 10, SYUZ + 320 / 2.15, 2.15)       # Sabri dinler (yakın tepki)
it(t_bana - 0.05, "kasa", SX - 10, SYUZ + 320 / 2.2, 2.2)
kes(t_bana - 0.05, "tezgah", EX + 10, EYUZ + 330 / 1.95, 1.95)   # "Bana bazı cevaplar borçlusun!" (yakın, sesi yükselir)
it(r2b + 0.4, "tezgah", EX + 10, EYUZ + 330 / 2.05, 2.05)
kes(T["R3"], "kasa", SX - 30, SYUZ + 330 / 1.42, 1.42)       # Sabri: lamba, fiş bloğu (orta) "Anlatayım kızım"
it(T["DAIRE"], "kasa", SX - 30, SYUZ + 330 / 1.5, 1.5)
KG = (540, 1150)                                             # kâğıt kadrajı: çizim üst-orta bölgede, alt bant altyazıya
kes(T["DAIRE"], "kagit", KG[0], KG[1], 1.12)                  # üç daire
it(T["MERAK"], "kagit", KG[0] - 10, KG[1] - 10, 1.16)
kes(m0, "tezgah", EX, EYUZ + 330 / 2.1, 2.1)                 # Ece: merak (yakın), öne eğilir
it(T["BIRLES"], "tezgah", EX, EYUZ + 330 / 2.18, 2.18)
kes(T["BIRLES"], "kagit", KG[0] - 20, KG[1] + 40, 1.12)      # birleşen çizgiler + ortak yaşam çizgisi
tc5 = W("R5", "çizgimiz") + 0.4
it(tc5, "kagit", KG[0] - 10, KG[1] + 50, 1.16)
kes(tc5, "kasa", SX - 15, SYUZ + 330 / 2.25, 2.25)            # Sabri yakın: kâğıttan Ece'ye bakar (alttan sıcak ışık)
t6_hik = W("R6", "hikâyeler") - 0.05
it(t6_hik, "kasa", SX - 15, SYUZ + 330 / 2.4, 2.4)
kes(t6_hik, "kagit", KG[0] + 30, KG[1] - 20, 1.08)            # paralel çizgiler
it(t6_ve, "kagit", KG[0] + 50, KG[1] - 30, 1.13)
kes(t6_ve, "tezgah", EX + 10, EYUZ + 330 / 2.3, 2.3)          # Ece: anlamaya çalışır (yakın)
t6_par = W("R6", "paralel") - 0.15
it(t6_par, "tezgah", EX + 10, EYUZ + 330 / 2.36, 2.36)
kes(t6_par, "kagit", KG[0] + 40, KG[1] - 10, 1.1)             # kalem paralel çizgilere dokunur
it(T["R7"], "kagit", KG[0] + 45, KG[1] - 15, 1.13)
kes(T["R7"], "kasa", SX - 15, SYUZ + 300 / 2.9, 2.9)          # "ancak geceleri": Sabri çok yakın, yavaş itme; floresan kısılır
t7_tum = W("R7", "tüm") - 0.2
it(t7_tum, "kasa", SX - 15, SYUZ + 290 / 3.25, 3.25)
kes(t7_tum, "kagit", 640, 1080, 1.12)                         # yakınsama: buluşma noktasına yavaş itme
it(W("R7", "buluşuyor"), "kagit", N[0] - 40, N[1] + 180, 1.55)
it(T["SON"] + DUR["SON"], "kagit", N[0] - 50, N[1] + 160, 1.72)
kes(y0, "tezgah", EX + 5, EYUZ + 330 / 3.0, 3.0)              # Ece çok yakın: yutkunur
it(SON_T, "tezgah", EX + 5, EYUZ + 330 / 3.2, 3.2)

# ------------------------------------------------------------------ IŞIK
FLOR = [[0, 1], [r7a + 0.4, 1], [W("R7", "geceleri", "end"), 0.62], [SON_T, 0.6]]
CIZIR = [[W("R7", "geceleri"), W("R7", "geceleri") + 0.35], [T["SON"] + 0.3, T["SON"] + 1.4], [y0 + 0.2, y0 + 0.9]]
LAMBA = [[0, 0], [r3a + 0.52, 0], [r3a + 0.6, 1], [SON_T, 1]]
LAMBA_CIZIR = [[T["SON"] + 0.95, T["SON"] + 1.15]]

ORTAK = {"saat": [[0, "19:07"], [r3a, "19:08"]], "kapi": [[0, 0], [t_ac0, 0], [t_ac1, 1]],
         "sensor": [[t_adim + 0.2, t_esik + 0.6]], "disarida": [[0, t_esik]],
         "flor": FLOR, "cizir": CIZIR, "lamba": LAMBA, "lambaCizir": LAMBA_CIZIR,
         "titre": {"dis": 2.2, "kapi": 1.8, "tezgah": 1.6, "kasa": 1.3, "kagit": 1.0},
         "blok": [[0, 700], [r3a + 1.0, 700], [r3a + 1.35, 560]], "gazete": [[0, 600], [r3a + 0.3, 600], [r3a + 0.7, 1300]],
         "elAra": [[T["DAIRE"] - 1, 99]], "kagitTz": [[0, 0], [r3a + 1.2, 0], [r3a + 1.4, 1]], "gazeteTz": [[0, 0], [r3a + 0.3, 0], [r3a + 0.7, -700]],
         "ekK": [[0, 0]]}
KAR = {"dis": {"ece": ECE_DIS}, "kapi": {"ece": ECE_KAPI}, "tezgah": {"ece": ECE_TZ}, "kasa": {"sabri": SAB}, "kagit": {}}


def blob(t0, t1):
    """vuruşa yalnız içinde görünen görünümlerin verisini koy (JSON boyu)"""
    vs = set()
    for i, (t, v) in enumerate(KURGU):
        tn = KURGU[i + 1][0] if i + 1 < len(KURGU) else 1e9
        if t < t1 and tn > t0:
            vs.add(v)
    p = {"t0": round(t0, 3), "kurgu": KURGU, **ORTAK, "cam": {v: CAM[v] for v in vs}, "kar": {v: KAR[v] for v in vs if KAR[v]}}
    if vs & {"kagit", "tezgah"}:
        p.update({"cizim": CIZIM, "uc": UC, "bas": BAS})
    return {"kind": "b8_market", "text": [json.dumps(p, ensure_ascii=False, separators=(",", ":"))]}


# ------------------------------------------------------------------ EFEKT (görüntü olayları; ses yönetmeni son hâlini verir)
def E(ad, isim, t, vol=0.5, **kw):
    return {"name": f"efekt/{isim}", "at": round(t - T[ad], 3), "volume": vol, **kw}


SFX = {
    "DIS": [E("DIS", "ayak_sesleri", T["DIS"] + 0.1, 0.35, sure=2.7)],
    "CAM": [E("CAM", "el_nefes_tutma", c0 + 1.0, 0.45)],
    "KAPI": [E("KAPI", "otomatik_kapi", t_ac0 - 0.05, 0.6), E("KAPI", "kapi_dingdong", t_ac0 + 0.1, 0.55), E("KAPI", "el_market_adim", t_esik, 0.35)],
    "VARIS": [E("VARIS", "el_kapi_yumruk", v0 + 0.42, 0.35, sure=0.4)],
    "R3": [E("R3", "el_kalem_tik", r3a + 0.58, 0.55), E("R3", "el_kagit", r3a + 1.05, 0.35, sure=0.5), E("R3", "kalem_cit", t_kizim + 0.3, 0.5)],
    "SON": [E("SON", "el_floresan", T["SON"] + 0.3, 0.55, sure=1.2)],
    "YUTKUN": [E("YUTKUN", "el_yutkunma", y0 + 0.5, 0.7)],
}


def vuruslar():
    sc = {"d": [], "i": []}
    for ad, r, d, s in SIRA:
        t0, t1 = T[ad], T[ad] + DUR[ad]
        ek = blob(t0, t1)
        if r:
            who, metin = METIN[r]
            b = {"type": "line", "who": who, "text": metin, "emotion": "notr", "gapAfter": d, "ekle": ek}
        else:
            b = {"type": "insert", "dur": round(DUR[ad], 4), **ek}
        if ad in SFX:
            b["sfx"] = SFX[ad]
        sc[s].append((ad, r, b))
    return sc


if __name__ == "__main__":
    ep_id = "724-08-p1"
    sc = vuruslar()
    man = {}
    sahneler = []
    for sid, baslik, amb in (("d", "Dış", {"name": "ortam/sehir_gece", "volume": 0.5}), ("i", "Market", {"name": "ortam/market_gece", "volume": 0.45})):
        beats = []
        for i, (ad, r, b) in enumerate(sc[sid]):
            if r:
                man[f"{sid}_{i + 1:02d}"] = M[TAKE[r]]
            beats.append(b)
        sahneler.append({"id": sid, "set": "market_kapi", "time": "gece", "title": baslik, "transition": "kesme", "cast": {}, "ambience": amb, "beats": beats})
    os.makedirs(f"{K}/public/voice/{ep_id}", exist_ok=True)
    json.dump(man, open(f"{K}/public/voice/{ep_id}/manifest.json", "w"), ensure_ascii=False, indent=1)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 8, "title": "Bölüm 8 · Parça 1", "endCard": False, "scenes": sahneler}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    # kontrol için: zaman tablosu
    print(f"toplam {SON_T:.2f} sn")
    for ad, r, d, s in SIRA:
        print(f"  {ad:7s} {T[ad]:6.2f} +{DUR[ad]:.2f}" + (f"  {TAKE[r]}" if r else ""))
    print("kurgu:", [(round(t, 2), v) for t, v in KURGU])
    olay = {"_not": "B8 P1 görüntü olayları (sahne zamanı, sn; parça başı = 0). Üretici: tools/b8p1.py. Ses yönetmeni kalem/efekt seslerini buna oturtur.",
            "cekimler": TAKE, "vuruslar": {ad: [round(T[ad], 3), round(T[ad] + DUR[ad], 3)] for ad, *_ in SIRA},
            "replik_ses": {r: [round(V(r)[0], 3), round(V(r)[1], 3)] for r in TAKE},
            "kurgu": KURGU,
            "cizgiler": [{"ad": ad, "bas": c["p"][0][0], "son": c["p"][-1][0]} for ad, c in zip(
                ["daire_1", "daire_2", "daire_3", "birles_1", "birles_2", "birles_3", "yasam_cizgisi", "paralel_1", "paralel_2", "paralel_3",
                 "yakinsa_3", "yakinsa_1", "yakinsa_2", "son_daire"], CIZIM)],
            "dokunma": [b["t0"] for b in BAS if b["r"] < 10], "bastirma": [b for b in BAS if b["r"] >= 10],
            "olaylar": {"sensor_adim": round(t_adim, 3), "kapi_acilir": round(t_ac0, 3), "kapi_tam_acik": round(t_ac1, 3), "esik": round(t_esik, 3),
                        "nefes_ice": round(c0 + 0.95, 3), "nefes_dis": round(c0 + 1.75, 3), "avuclar_tezgaha": round(v0 + 0.42, 3),
                        "parmak_vurus": [round(t_borc + 0.12, 3), round(t_borc + 0.45, 3)], "lamba_tik": round(r3a + 0.58, 3),
                        "gazete_itilir": [round(r3a + 0.3, 3), round(r3a + 0.7, 3)], "fis_cekilir": [round(r3a + 1.0, 3), round(r3a + 1.35, 3)],
                        "floresan_kisilir": [round(r7a + 0.4, 3), round(W("R7", "geceleri", "end"), 3)], "floresan_cizirti": CIZIR,
                        "lamba_titrer": LAMBA_CIZIR, "el_cekilir": [round(T["SON"] + 0.1, 3), round(T["SON"] + 0.9, 3)], "yutkunma": round(y0 + 0.8, 3)},
            "toplam": round(SON_T, 3)}
    json.dump(olay, open(f"{K}/../docs/diziler/724/raporlar/b8p1-goruntu-zaman.json", "w"), ensure_ascii=False, indent=1)
