"""7/24 Bölüm 9, Parça 2 (kullanıcının metni AYNEN: docs/diziler/724/bolumler.md "Bölüm 9, Parça 2").
P1 sonunun üstüne zaman geçer (Ece depo kapısının dibinde yere çökmüş; monitör saati 00:19) → FPS (Ece'nin gözünden, yerden):
Mert kıza su açar, kız içer, saçını savurur, Mert'in koluna dokunur → Ece kıskanır "Hıh." → duvar TV'sinde son dakika
(spiker, termal kamerada aslan kaybolur) → Ece şaşırıp ayağa kalkar → "Bu ses...?" → kapıya "Sen konuşmayı haberlerden mi
öğrendin lan?" → yaratık: aslan da yanımda (kapı altında pati gölgeleri) → Ece: "He amına koyim..." → kapı ardında utanma
(ayak gölgeleri geri çekilir) → çıldırma: kapı sarsılır, levha düşer → FPS (Ece'nin gözünden, kapıya yaslı): Mert ve kız
kapıya dehşetle bakarken ARKALARINDA, reyonların ucundaki ara koridordan dişi aslan geçer, durur, kameraya bakar, devam eder.
Kullanım: python3 tools/b9_p2.py  -> public/episodes/724-09-p2.json
"""
import json
import math
import os
import sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KARE = 30
VF = 2 / KARE
sys.argv = [sys.argv[0]]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import b8y_p1 as P1  # noqa: E402  (yan açı izdüşümü)

VD = f"{K}/public/voice/724-09-p2"
M = json.load(open(f"{VD}/manifest.json"))
TAKE = {"E1": "E1a_01", "N1": "N1a_01", "E2": "E2a_01", "E3": "E3b_01", "Y2": "Y2a_01", "E4": "E4a_01"}
W = {r: {x["w"].strip(".,?!…"): x for x in M[t]["words"]} for r, t in TAKE.items()}
D = {r: M[t]["duration"] for r, t in TAKE.items()}
R3 = lambda v: round(v, 3)
fr = lambda v: round(round(v * KARE) / KARE, 4)

# ------------------------------------------------------------------ zaman çizelgesi (sahne sn)
tA0, tB0 = 0.0, 1.6                       # A: YAN açılış (zaman geçti) · B: FPS (yerden, su/flört)
tC0 = 5.3                                 # C: Ece "Hıh." (line)
tE0 = fr(tC0 + 1.2)                       # E: spiker (line; TV ↔ Ece)
vE = tE0 + VF
t_term0 = R3(vE + W["N1"]["termal"]["start"] - 0.08)       # termal görüntüye geçiş
t_ece = R3(vE + W["N1"]["Yetkililer"]["start"] - 0.05)     # Ece'ye kesme (şaşkın, ayağa kalkar)
t_tv2 = R3(vE + W["N1"]["zorunlu"]["start"] + 0.3)         # TV'ye dönüş
tF0 = fr(vE + D["N1"] + 0.12)             # F: "Bu ses...?"
tG0 = fr(tF0 + VF + D["E2"] + 0.25)       # G: kapıya bağırır
tH0 = fr(tG0 + VF + D["E3"] + 0.15)       # H: yaratık (kapı ardı)
tI0 = fr(tH0 + VF + D["Y2"] + 0.15)       # I: Ece "He amına koyim..."
tJ0 = fr(tI0 + VF + D["E4"] + 0.12)       # J: utanma (insert)
t_kuk = R3(tJ0 + 1.05)                    # kükreme sesi başlar (dosya: 0-1.4 hırıltı, vuruşlar 1.75/2.0/2.25/2.55)
VUR = [R3(t_kuk + v) for v in (1.75, 2.0, 2.25, 2.55)]
tK0 = R3(t_kuk + 1.45)                    # K: geniş yan (vuruşlar, levha düşer)
tL0 = R3(VUR[2] + 0.08)                   # L: FPS final (aslan)
SON = R3(tL0 + 4.7)
jen = R3(tE0 - 0.35)                      # haber jeneriği (Ece'nin "Hıh"ının kuyruğunda)

# ------------------------------------------------------------------ YAN yerleşim
X_E, Z_E = 1.42, 1.66
EO = P1.yI(X_E, Z_E, 1.6)                  # oturan Ece işareti (kalça yerde)
EK = P1.yI(1.42, 1.74, 1.6)                # ayakta, kapıya yaslı (P1 ile aynı)
S = EO[2] / 1000
yP = P1.yP
fy = lambda q, k: q[1] - k * q[2]          # rig yüksekliğinde ekran y (yüz ≈ 0.765; oturunca 0.42)
GAP = [round(v, 1) for v in yP(1.475, 0.0, 1.9)]
t_kalk0, t_kalk1 = R3(t_ece + 0.45), R3(t_ece + 1.45)    # ayağa kalkış

# Ece'nin işareti: oturur → kalkarken kapıya doğru hafif geri/yukarı → ayakta yaslı
YER = [[0, *EO], [t_kalk0, *EO], [t_kalk1, *EK]]
# G: kapıya avuçla vurur; I: kapıya doğru eğilir; K: vuruşlarda sarsılır
t_tok = R3(tG0 + VF + W["E3"]["Sen"]["start"] - 0.06)
YER += [[t_tok - 0.01, *EK], [t_tok + 0.04, EK[0] + 5, EK[1], EK[2]], [t_tok + 0.2, *EK]]
for i, tv in enumerate(VUR):
    YER += [[R3(tv - 0.01), *EK], [R3(tv + 0.03), EK[0] - 9 - 3 * i, EK[1] - 4, EK[2]], [R3(tv + 0.16), EK[0] - 2, EK[1], EK[2]]]
YER.append([SON, *EK])
YER.sort(key=lambda k: k[0])

# el hedefleri (ekran): oturuşta dizler üstünde; ayakta yanlarda / kapıda
def dz(q):
    s = q[2] / 1000
    return [[q[0] - 52 * s, q[1] - 175 * s], [q[0] + 52 * s, q[1] - 175 * s]]


KN = dz(EO)
SE = EK[2] / 1000
YAN_L = [EK[0] - 120 * SE, EK[1] - 420 * SE]
YAN_R = [EK[0] + 115 * SE, EK[1] - 410 * SE]
KAPI_R = [EK[0] + 235 * SE, EK[1] - 640 * SE]     # sağ avuç kapıya (omzunun yanında)
t_hih = R3(tC0 + VF + W["E1"]["Hıh"]["start"])
t_bes = R3(tI0 + VF + W["E4"]["He"]["start"] - 0.1)
t_eks = R3(tI0 + VF + W["E4"]["bi"]["start"] - 0.05)
t_bar = R3(tI0 + VF + W["E4"]["Barkodu"]["start"] - 0.15)
t_twk = R3(tI0 + VF + W["E4"]["twerkçü"]["start"])
ISARET = [EK[0] + 270 * SE, EK[1] - 340 * SE]     # kapının altındaki aralığı (ayak gölgelerini) gösterir

ELL = [[0, *KN[0]], [R3(tC0 + 0.15), *KN[0]], [t_kalk0, *KN[0]], [t_kalk1, *YAN_L],
       [R3(tI0 + 0.1), *YAN_L], [R3(tJ0 + 0.3), *YAN_L], [SON, *YAN_L]]
ELR = [[0, *KN[1]], [R3(tC0 + 0.15), *KN[1]], [t_kalk0, *KN[1]], [t_kalk1, *YAN_R],
       [R3(t_tok - 0.12), *YAN_R], [t_tok, *KAPI_R], [R3(t_tok + 0.7), *KAPI_R], [R3(t_tok + 1.0), *YAN_R],
       [R3(t_bar), *YAN_R], [R3(t_bar + 0.3), *ISARET], [R3(tJ0 + 0.9), *ISARET], [R3(tJ0 + 1.5), ISARET[0] - 10 * SE, ISARET[1] + 80 * SE],
       [R3(t_kuk + 1.0), YAN_R[0] + 30 * SE, YAN_R[1] - 120 * SE], [SON, YAN_R[0] + 30 * SE, YAN_R[1] - 120 * SE]]
# jestler (rig kolları): "Hıh": kollar kavuşur · küfür: avuçlar yüze · "bi bu eksikti": eller açılır
JEST = [[0, None], [R3(tC0 + 0.05), "kollarBagli"], [R3(t_ece + 0.2), None],
        [t_bes, "ellerYuzde"], [t_eks, "ellerAcik"], [R3(t_bar - 0.02), None]]
ARA_L = [[-99, R3(tC0 + 0.05)], [R3(t_ece + 0.2), t_bes], [R3(t_bar - 0.02), 99]]
ARA_R = ARA_L

# bakış [lookX, lookY, yaw]: Mert ve kız solda (ekran solu, yerde); TV sol-yukarıda; kapı arkasında (sağ omuz)
SOL = [-0.75, 0.35, -0.5]
TV = [-0.55, -0.75, -0.45]
KAPI = [0.75, 0.15, 0.7]
ON = [0.0, 0.05, 0.0]
t_bs1 = R3(tF0 + VF + W["E2"]["Bu"]["start"])
BAK = [[0, *SOL], [1.0, -0.6, 0.4, -0.45], [1.25, *SOL],
       [R3(tC0), *SOL], [R3(t_hih + 0.1), *SOL], [R3(t_hih + 0.3), 0.3, 0.1, 0.4],      # "Hıh": başını öbür yana çevirir
       [R3(jen + 0.05), 0.3, 0.1, 0.4], [R3(jen + 0.22), *TV],                            # jenerik: başı TV'ye fırlar
       [t_ece, *TV], [R3(t_kalk1 + 0.3), -0.5, -0.55, -0.45], [R3(tF0), -0.5, -0.55, -0.45],
       [R3(t_bs1 + 0.05), *TV], [R3(t_bs1 + 0.32), *KAPI], [R3(t_bs1 + 0.62), *KAPI], [R3(t_bs1 + 0.85), *TV],   # TV → kapı → TV
       [R3(tG0 - 0.05), *TV], [R3(tG0 + 0.12), 0.85, 0.2, 0.85], [R3(tH0), 0.6, 0.15, 0.55],                     # kapıya bağırır
       [R3(tH0 + 1.6), 0.4, 0.2, 0.3], [R3(tH0 + 2.6), *ON], [R3(tI0), *ON],
       [R3(t_bes + 0.1), 0.0, -0.5, 0.0], [R3(t_eks + 0.1), *ON], [R3(t_bar + 0.1), 0.6, 0.6, 0.55], [R3(tJ0 + 0.6), 0.6, 0.8, 0.5],
       [R3(t_kuk + 0.8), 0.5, 0.6, 0.45], [R3(VUR[0]), *ON], [SON, *ON]]
DUYGU = [[0, "yorgun"], [1.0, "supheli"], [R3(tC0), "supheli"], [R3(t_hih - 0.05), "alayci"], [R3(jen + 0.1), "saskin"],
         [R3(t_ece), "saskin"], [R3(tF0 + 0.1), "supheli"], [R3(tG0 + 0.05), "ofkeli"], [R3(tH0 + 0.3), "saskin"],
         [R3(tH0 + 2.7), "yorgun"], [R3(tI0 + 0.05), "ofkeli"], [R3(tJ0 + 0.25), "supheli"], [R3(t_kuk + 0.7), "korkmus"], [R3(VUR[0]), "dehset"]]
TILT = [[0, 7], [1.0, 3], [R3(t_hih + 0.05), 2], [R3(t_hih + 0.3), -7], [R3(jen + 0.22), 3], [t_ece, 3], [R3(t_bs1), 2], [R3(t_bs1 + 0.32), -4], [R3(t_bs1 + 0.85), 4],
        [R3(tG0 + 0.1), -6], [R3(tH0 + 2.6), 2], [R3(tH0 + 4.2), 9], [R3(tI0 + 0.05), 0], [R3(t_bar + 0.1), -5], [R3(tJ0 + 0.7), -2], [R3(VUR[0]), 0], [SON, 0]]
EGIL = [[0, 0], [R3(tG0 + 0.05), 0], [R3(tG0 + 0.15), 5], [R3(tH0), 2], [R3(tH0 + 2.6), 0], [R3(tH0 + 4.2), -3],
        [R3(tI0 + 0.1), -2], [R3(t_bar + 0.1), 6], [R3(tJ0 + 0.8), 3], [R3(t_kuk + 1.0), -1], [SON, -1]]
GOZKIS = [[0, 0, 0], [R3(tB0 - 0.4), 0, 0], [R3(tC0), 0.35, 0.3], [R3(t_hih), 0.55, 0.45], [R3(jen + 0.1), 0, 0],
          [R3(tF0 + 0.1), 0, 0], [R3(tF0 + 0.3), 0.35, 0.35], [R3(tG0 + 0.1), 0.2, 0.2], [R3(tH0 + 0.3), 0, 0],
          [R3(tI0 - 0.1), 0, 0], [R3(tI0 + 0.1), 0.3, 0.3], [R3(t_bar), 0.45, 0.4], [R3(tJ0 + 0.5), 0.15, 0.15], [R3(t_kuk + 0.6), 0, 0]]
GOZ = [[0, 0], [0.55, 0], [0.62, 1], [0.7, 0], [R3(tH0 + 3.0), 0], [R3(tH0 + 3.6), 0.85], [R3(tH0 + 4.4), 0.85], [R3(tI0), 0],
       [R3(VUR[0]), 0], [R3(VUR[0] + 0.04), 1], [R3(VUR[2] + 0.1), 1], [R3(VUR[2] + 0.2), 0]]
GOZSOK = [[0, 0], [R3(t_term0), 0], [R3(t_ece), 0.6], [R3(t_kalk1), 0.4], [R3(tF0), 0.2], [R3(tG0), 0],
          [R3(tH0 + VF + W["Y2"]["aslan"]["start"]), 0], [R3(tH0 + VF + W["Y2"]["yanımda"]["end"]), 0.9], [R3(tH0 + 3.0), 0.3],
          [R3(t_kuk + 0.8), 0.3], [R3(VUR[0]), 1], [SON, 1]]
NEFES = [[0, 0.8], [R3(t_kuk), 0.9], [R3(t_kuk + 0.9), 0.2], [R3(VUR[0]), 3.2]]
YEROTUR = [[0, 1], [t_kalk0, 1], [t_kalk1, 0]]
KONUS = []
for r, t0 in (("E1", tC0), ("E2", tF0), ("E3", tG0), ("E4", tI0)):
    KONUS.append({"t": R3(t0 + VF), "cues": M[TAKE[r]]["mouth"]})
ECE = {"id": "ece_sivil", "onKol": True, "dogalKol": True, "yay": 1, "yer": YER, "elL": ELL, "elR": ELR, "elLara": ARA_L, "elRara": ARA_R,
       "jest": JEST, "bak": BAK, "duygu": DUYGU, "tilt": TILT, "egil": EGIL, "gozKis": GOZKIS, "goz": GOZ, "gozSok": GOZSOK,
       "nefes": NEFES, "yerOtur": YEROTUR, "konus": KONUS, "sacDagin": 0.6,
       "tutR": [[0, None], [R3(t_bar + 0.25), "isaret"], [R3(tJ0 + 1.4), None]], "isaretAci": 140,
       "ezil": [[0, 0]] + sum([[[R3(v - 0.01), 0], [R3(v + 0.03), 0.05], [R3(v + 0.15), 0]] for v in VUR], [])}

# ------------------------------------------------------------------ kapı altı (ışık, ayak gölgeleri, pati gölgeleri), levha
t_ys = R3(tH0 - 0.6)                                     # yaratık kapıya yaklaşır (ayak gölgeleri belirir)
t_pati0 = R3(tH0 + VF + W["Y2"]["aslan"]["start"] + 0.15)
t_ut = R3(tJ0 + 0.15)                                    # utanma: ayaklar geri çekilir, içe döner
t_lev = VUR[0]
LEVHA_DUS = R3(t_lev + 0.42)
KA = [[0, 0.42, -1, 0.25, -1, 0, 1], [0.9, 0.5, -1, 0.25, -1, 0, 1], [1.3, 0.38, -1, 0.25, -1, 0, 1],    # sallanan ampul: ışık hafif solar/artar
      [R3(tG0), 0.45, -1, 0.25, -1, 0, 1], [t_ys, 0.5, -1, 0.25, -1, 0, 1], [R3(t_ys + 0.35), 0.5, 0.74, 0.22, -1, 0, 1],
      [R3(t_pati0), 0.5, 0.74, 0.22, 1.08, 0.13, 1], [R3(t_pati0 + 0.45), 0.5, 0.74, 0.22, 0.93, 0.13, 1],
      [R3(t_ut), 0.5, 0.74, 0.22, 0.93, 0.13, 1], [R3(t_ut + 0.5), 0.5, 0.72, 0.15, 0.93, 0.13, 0.75], [R3(t_ut + 1.1), 0.5, 0.71, 0.1, 0.93, 0.13, 0.45],
      [R3(t_kuk + 0.9), 0.5, 0.71, 0.1, 0.93, 0.13, 0.45], [R3(t_kuk + 1.2), 0.5, 0.74, 0.26, 0.93, 0.13, 1]]
for i, tv in enumerate(VUR):                              # vuruşlarda ışık çakar/söner (ampul sallanır)
    KA += [[R3(tv - 0.01), 0.5, 0.74, 0.26, 0.93, 0.13, 1], [R3(tv + 0.02), 0.95, 0.74, 0.26, 0.93, 0.13, 1], [R3(tv + 0.1), 0.15, 0.74, 0.26, 0.93, 0.13, 1]]
KA += [[R3(LEVHA_DUS), 0.0, 0.74, 0.26, 0.93, 0.13, 1], [SON, 0.0, 0.74, 0.26, 0.93, 0.13, 1]]   # levha kapıya yaslanınca aralığı örter
KA.sort(key=lambda k: k[0])
for k in KA:                                              # yaratık kapıdayken ampul ona yakın: aralık daha parlak (gölgeler okunsun)
    if t_ys <= k[0] < VUR[0] - 0.02:
        k[1] = 0.9
LEVHA = [[0, 11], [R3(t_ut + 0.2), 11], [R3(t_ut + 0.3), 11.8], [R3(t_ut + 0.5), 10.6], [R3(t_ut + 0.7), 11]]
for tv in VUR[:1]:
    LEVHA += [[R3(tv - 0.01), 11], [R3(tv + 0.06), 2], [R3(tv + 0.3), 0], [SON, 0]]
LEVHADY = [[0, 0], [R3(t_lev + 0.02), 0]] + [[R3(t_lev + 0.02 + i * 0.04), round(min(2.2, 0.5 * 9.8 * (i * 0.04) ** 2 * 1.1), 3)] for i in range(1, 11)] + [[SON, 2.2]]

# ------------------------------------------------------------------ kamera (yan) + kurgu
P1.SINIR["yan"] = (0, 1080, 0, 1920)
kp = lambda cx, cy, z: P1.kirp("yan", cx, cy, z)
FO = fy(EO, 0.42)                       # oturan yüz
FK = fy(EK, 0.765)                      # ayakta yüz
GA2 = [round(v, 1) for v in yP(1.62, 0.0, 1.9)]
GA2[1] = round(GA2[1] + 75, 1)          # aralık kadrajın üst-ortasında (altyazı bandının üstünde)
TVc = [round(v, 1) for v in yP(0.36, 2.4, 1.8)]
CAMY = [[0] + kp(EO[0] - 160, 1060, 1.42), [tB0 - 0.01] + kp(EO[0] - 120, 1070, 1.55),         # A: açılış, yavaş itiş (TV sol üstte)
        [tC0] + kp(EO[0] + 10, FO + 30, 3.0), [R3(tE0 - 0.02)] + kp(EO[0] + 5, FO + 20, 3.15),    # C: "Hıh" yakın
        [t_ece] + kp(EO[0] - 170, FO - 120, 1.95), [t_kalk1] + kp(EK[0] - 140, FK + 40, 2.0), [R3(t_tv2 - 0.01)] + kp(EK[0] - 140, FK + 40, 2.05),   # E: Ece şaşkın, kalkar (TV kadrajda)
        [tF0] + kp(EK[0] - 20, FK + 70, 2.7), [R3(tG0 - 0.01)] + kp(EK[0] - 10, FK + 60, 2.8),                       # F: "Bu ses"
        [tG0] + kp(EK[0] + 20, FK + 120, 2.35), [R3(tH0 - 0.01)] + kp(EK[0] + 30, FK + 110, 2.45),                    # G: bağırır
        [tH0] + kp(GA2[0], GA2[1], 3.4), [R3(tH0 + 2.45)] + kp(GA2[0] + 5, GA2[1] - 5, 3.7),         # H: kapı altı (gölgeler)
        [R3(tH0 + 2.5)] + kp(EK[0] + 10, FK + 30, 3.1), [R3(tI0 - 0.01)] + kp(EK[0] + 10, FK + 25, 3.3),             # H: Ece'nin yüzü
        [tI0] + kp(EK[0] - 10, FK + 160, 2.2), [R3(tJ0 - 0.01)] + kp(EK[0] - 5, FK + 170, 2.3),                       # I: küfür (orta)
        [tJ0] + kp(745, 1150, 2.5), [R3(t_kuk + 1.0)] + kp(745, 1135, 2.62), [R3(tK0 - 0.01)] + kp(745, 1130, 2.66),  # J: üstte yüz, altta aralık
        [tK0] + kp(EK[0] + 30, FK + 300, 1.7), [SON] + kp(EK[0] + 30, FK + 300, 1.75)]
KURGU = [[0, "yan"], [tC0, "yan"], [tE0, "tv"], [t_ece, "yan"], [t_tv2, "tv"], [tF0, "yan"]]
SARS = [[0, 0], [R3(t_tok - 0.01), 0], [R3(t_tok), 0.25], [R3(t_tok + 0.15), 0]]
for tv in VUR:
    SARS += [[R3(tv - 0.01), 0.05], [R3(tv), 1.3], [R3(tv + 0.18), 0.2]]
SARS += [[R3(VUR[-1] + 0.5), 0]]
TOZ = [[0, 0]]
SPIKER = {"yer": [[0, 270, 760, 720]], "duygu": [[0, "notr"]], "bak": [[0, 0.02, 0.0, 0.05], [R3(vE + 3.2), -0.02, 0.05, -0.04], [R3(vE + 6), 0.03, 0.0, 0.06]],
          "tilt": [[0, 0], [R3(vE + 0.3), 2], [R3(vE + 1.0), -1], [R3(vE + 4.0), 2], [R3(vE + 5.2), -2], [R3(vE + 8.5), 1]],
          "konus": [{"t": R3(vE), "cues": M[TAKE["N1"]]["mouth"]}], "goz": [[0, 0], [R3(vE + 2.2), 0], [R3(vE + 2.26), 1], [R3(vE + 2.34), 0], [R3(vE + 7.1), 0], [R3(vE + 7.16), 1], [R3(vE + 7.24), 0]]}
ORTAK = {"saat": [[0, "00:19"]], "kapi": [[0, 0]], "flor": [[0, 0.85]], "lamba": [[0, 0]], "titre": {"yan": 1.0, "tv": 0.6},
         "eceArkada": True, "odak": [[0, 0]], "depo": [[0, 0]], "depoKol": [[0, 0]], "toz": TOZ, "sars": SARS, "anime": {}, "animeMerkez": {},
         "levha": LEVHA, "levhaDy": LEVHADY, "kapiAltBas": 0.6, "kapiAlt": KA, "ayakkabi": [[0, 1.63, 1.69, 79, 0]], "ayakkabiIz": [1.68, 1.9],
         "tvYayin": {"jen": jen, "sp": R3(tE0), "term": [t_term0, t_ece]}, "karart": [[0, 1], [0.45, 0], [R3(SON - 0.12), 0], [SON, 1]],
         "kurgu": KURGU, "cam": {"yan": CAMY, "tv": [[0, 540, 820, 1.12], [SON, 540, 800, 1.16]]},
         "kar": {"yan": {"ece": ECE}, "tv": {"spiker": SPIKER}},
         "fx": [[R3(VUR[0] + 0.02), "dokuntu", "yan", *[round(v, 1) for v in yP(1.475, 2.12, 1.89)], 0.9, 1.9]]}

# ------------------------------------------------------------------ FPS B: yerden (oturan Ece), su şişesi, flört
MZ = -3.9
KZ = MZ + 0.1
cB = [0.05, 0.82, -1.3]
b_ac = R3(tB0 + 0.15)            # kapak çıtlar (ses dosyası 0.10'da) → şişe açılır
b_ver0, b_ver1 = R3(tB0 + 0.55), R3(tB0 + 0.85)    # Mert şişeyi uzatır, kız alır
b_ic0, b_ic1 = R3(tB0 + 1.0), R3(tB0 + 1.75)       # içer (baş geri)
b_sac = R3(tB0 + 1.95)                             # saçını savurur
b_dok = R3(tB0 + 2.5)                              # Mert'in koluna dokunur
b_mert = R3(tB0 + 2.75)                            # Mert utangaç gülümser, başını eğer
KAM_B = [[tB0, *cB, -181, -1, 0], [R3(tC0), cB[0] - 0.03, cB[1] + 0.01, cB[2] - 0.05, -180, -1.5, 0]]
MERT_EL_B = [[tB0, -0.26, 0.74, MZ + 0.22], [b_ac, -0.24, 0.76, MZ + 0.22], [b_ver0, -0.24, 0.74, MZ + 0.22], [b_ver1, -0.07, 0.68, MZ + 0.3],
             [R3(b_ver1 + 0.25), -0.2, 0.6, MZ + 0.2], [b_mert, -0.2, 0.6, MZ + 0.2], [R3(b_mert + 0.35), -0.32, 0.98, MZ + 0.05], [R3(tC0), -0.32, 0.98, MZ + 0.05]]
mertB = {"id": "mert724", "w": [-0.42, -0.55, MZ], "boy": 1.75,
         "q": {"onKol": True, "dogalKol": True, "yay": 1, "duygu": [[0, "notr"], [R3(b_sac + 0.1), "saskin"], [b_mert, "mahcup"]],
               "bak": [[0, 0.4, 0.2, 0.25], [b_mert, 0.4, 0.2, 0.25], [R3(b_mert + 0.2), 0.1, 0.7, 0.1], [R3(b_mert + 0.8), 0.45, 0.35, 0.25]],
               "tilt": [[0, -2], [b_mert, -2], [R3(b_mert + 0.3), -9]], "elR3": MERT_EL_B, "elL3": [[0, -0.5, 0.55, MZ + 0.1]],
               "tutR": [[0, "su"], [b_ac, "suAcik"], [R3(b_ver1 + 0.05), None]], "tutL": [[0, None], [b_ac - 0.1, "kapak"], [R3(b_ver1 + 0.4), None]]}}
KIZ_EL_L = [[tB0, 0.05, 0.42, KZ + 0.25], [b_ver0, 0.05, 0.45, KZ + 0.25], [b_ver1, -0.04, 0.66, KZ + 0.3], [R3(b_ic0), 0.07, 0.78, KZ + 0.3],
            [R3(b_ic1), 0.07, 0.8, KZ + 0.3], [R3(b_ic1 + 0.3), 0.18, 0.5, KZ + 0.3], [R3(tC0), 0.18, 0.5, KZ + 0.3]]
KIZ_EL_R = [[tB0, 0.35, 0.4, KZ + 0.2], [R3(b_sac - 0.1), 0.35, 0.4, KZ + 0.2], [R3(b_sac + 0.12), 0.3, 0.95, KZ + 0.1], [R3(b_sac + 0.35), 0.34, 0.5, KZ + 0.2],
            [R3(b_dok - 0.15), 0.3, 0.5, KZ + 0.25], [b_dok, -0.2, 0.72, MZ + 0.15], [R3(tC0), -0.19, 0.7, MZ + 0.15]]
kizB = {"id": "kacan724", "w": [0.14, -0.74, KZ], "boy": 1.65, "hale": [[0, 0.55, 0.7], [R3(b_sac), 0.6, 1.0], [R3(tC0), 0.6, 1.0]],
        "bacak3": [{"n": [[0.22, 0.08, KZ + 0.1], [0.44, 0.3, KZ + 0.32], [0.52, 0.06, KZ + 0.56], [0.58, 0.04, KZ + 0.72]], "ayak": "ciplak"},
                   {"n": [[0.3, 0.07, KZ + 0.04], [0.62, 0.1, KZ + 0.2], [0.88, 0.07, KZ + 0.38], [0.97, 0.07, KZ + 0.52]], "ayak": "ayakkabi"}],
        "q": {"onKol": True, "dogalKol": True, "yay": 1, "sacDagin": 0.35,
              "duygu": [[0, "uzgun"], [b_ver1, "mutlu"], [b_ic0, "notr"], [R3(b_ic1 + 0.1), "mutlu"], [b_dok, "gulen"], [R3(b_dok + 0.5), "mutlu"]],
              "bak": [[0, -0.5, 0.0, -0.3], [b_ic0, -0.1, -0.7, -0.05], [R3(b_ic1), -0.1, -0.7, -0.05], [R3(b_ic1 + 0.2), -0.55, 0.1, -0.35], [b_dok, -0.6, 0.05, -0.4]],
              "tilt": [[0, 4], [b_ic0, -10], [R3(b_ic1), -10], [R3(b_ic1 + 0.15), 2], [R3(b_sac), 2], [R3(b_sac + 0.12), 16], [R3(b_sac + 0.4), -3], [R3(b_dok), 6]],
              "egil": [[0, 0], [b_ic0, -5], [R3(b_ic1), -5], [R3(b_ic1 + 0.2), 0], [b_dok, -4]],
              "goz": [[0, 0], [R3(b_ic0 + 0.1), 0], [R3(b_ic0 + 0.2), 1], [R3(b_ic1 - 0.1), 1], [R3(b_ic1), 0]],
              "parilti": [[0, 0, 0], [R3(b_ic1 + 0.2), 0.6, 0.6], [R3(tC0), 0.6, 0.6]],
              "elL3": KIZ_EL_L, "elR3": KIZ_EL_R, "tutL": [[0, None], [b_ver1, "suAcik"], [R3(b_ic1 + 0.05), "suYarim"]],
              "esyaAci": [[0, -15], [b_ic0, -120], [R3(b_ic1), -125], [R3(b_ic1 + 0.3), -15]], "nefes": [[0, 1.2]]}}
FPS_B = {"mekan": "depo", "kacis": {"kar": [mertB, kizB]}, "kam": KAM_B, "sallan": [[0, 0, 2.8]], "titreme": [[0, 0.18]],
         "fov": [[tB0, 1.72], [R3(tC0), 1.86]], "sac": [[0, 9]]}

# ------------------------------------------------------------------ FPS L: kapıya yaslı (ayakta), dehşet; arkada aslan
cL = [0.02, 1.6, -1.28]
L_tur0 = R3(tL0 + 0.75)          # aslan görünür alana girer
L_dur = R3(tL0 + 1.65)            # durur
L_bak0, L_bak1 = R3(L_dur + 0.12), R3(L_dur + 1.25)   # başını çevirip bakar / geri çevirir
L_dev = R3(L_bak1 + 0.2)         # devam eder
ASL = []
x, faz, hiz = 2.6, 0.0, 1.0
AZ = -8.85
for i in range(int((SON - tL0) * KARE) + 2):
    t = tL0 + i / KARE
    if t < L_dur:
        v = 0.95
    elif t < L_dev:
        v = max(0.0, 0.95 * (1 - (t - L_dur) / 0.2))
    else:
        v = min(0.95, 0.95 * (t - L_dev) / 0.3)
    hiz = v / 0.95
    x -= v / KARE
    faz += 5.4 * hiz / KARE
    bak = 0.0 if t < L_bak0 else min(1, (t - L_bak0) / 0.22) if t < L_bak1 else max(0, 1 - (t - L_bak1) / 0.2)
    ASL.append([R3(t), round(x, 4), AZ, round(faz, 3), round(hiz, 3), round(bak, 3), 1, -1])
mertL = {"id": "mert724", "w": [-0.42, -0.55, MZ], "boy": 1.75,
         "q": {"onKol": True, "dogalKol": True, "yay": 1, "duygu": [[0, "dehset"]], "bak": [[0, 0.2, -0.6, 0.15], [R3(L_dur), 0.15, -0.65, 0.12]],
               "tilt": [[0, -3]], "elR3": [[0, -0.05, 0.62, MZ + 0.3]], "elL3": [[0, -0.55, 0.5, MZ + 0.15]], "gozSok": [[0, 0.8]], "nefes": [[0, 3.5]]}}
kizL = {"id": "kacan724", "w": [-0.04, -0.74, KZ], "boy": 1.65, "tutam3": [-0.27, 0.66, MZ + 0.25],
        "bacak3": kizB["bacak3"],
        "q": {"onKol": True, "dogalKol": True, "yay": 1, "sacDagin": 0.5, "duygu": [[0, "dehset"]], "bak": [[0, -0.1, -0.6, -0.08]],
              "tilt": [[0, 6]], "egil": [[0, -8]], "elL3": [-0.27, 0.66, MZ + 0.25], "elR3": [[0, 0.3, 0.42, KZ + 0.25]], "gozSok": [[0, 1]], "nefes": [[0, 4]]}}
KAM_L = [[tL0, *cL, -180, 13, -2], [R3(tL0 + 0.5), cL[0], cL[1], cL[2], -180, 11, 1], [L_tur0, cL[0], cL[1], cL[2], -180, 9, 0],
         [R3(L_dur + 0.4), cL[0] - 0.02, cL[1] - 0.02, cL[2], -180.5, 6, 0], [R3(SON), cL[0] - 0.02, cL[1] - 0.02, cL[2], -180.5, 5.5, 0]]
FPS_L = {"mekan": "depo", "kacis": {"kar": [mertL, kizL]}, "kam": KAM_L, "sallan": [[0, 0, 2.8]], "aslan": ASL,
         "titreme": [[tL0, 0.7], [R3(tL0 + 0.8), 0.35], [L_dur, 0.2], [SON, 0.15]],
         "sars": [[tL0, 0.3], [R3(VUR[3] - 0.01), 0.1], [VUR[3], 1.2], [R3(VUR[3] + 0.25), 0.15], [R3(VUR[3] + 0.6), 0]],
         "fov": [[tL0, 1.05], [L_tur0, 1.1], [R3(L_dur + 0.1), 1.55], [SON, 1.62]], "kalp": [[tL0, 0.5], [L_dur, 0.8], [SON, 0.8]], "sac": [[0, 9]],
         "karart": [[0, 0], [R3(SON - 0.1), 0], [SON, 1]]}


def E(t, isim, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t, 3), "volume": vol, **kw}


if __name__ == "__main__":
    ep_id = "724-09-p2"

    def yan(t0):
        return {"kind": "b8_market", "text": [json.dumps({**ORTAK, "t0": round(t0, 3)}, ensure_ascii=False, separators=(",", ":"))]}

    def fps(prm, t0):
        return {"kind": "b8_fps", "text": [json.dumps({**prm, "t0": round(t0, 3)}, separators=(",", ":"))]}

    def line(r, who, metin, t0, t1, ekle, label=None, sfx=None, duygu="notr"):
        b = {"type": "line", "who": who, "text": metin, "emotion": duygu, "gapAfter": round((t1 - t0) - D[r], 4), "ekle": ekle}
        if label is not None:
            b["label"] = label
        if sfx:
            b["sfx"] = sfx
        return b

    beats = [
        {"type": "insert", "dur": R3(tB0 - tA0), **yan(tA0), "sfx": [E(0.0, "b9_floresan", 0.16)]},
        {"type": "insert", "dur": R3(tC0 - tB0), **fps(FPS_B, tB0), "sfx": [E(0.05, "b9_su_sise", 0.75)]},
        line("E1", "ece_sivil", "Hıh.", tC0, tE0, yan(tC0), sfx=[E(jen - tC0, "b9_haber_jenerik", 0.55)]),
        line("N1", "spiker", M[TAKE["N1"]]["text"], tE0, tF0, yan(tE0)),
        line("E2", "ece_sivil", "Bu ses...?", tF0, tG0, yan(tF0)),
        line("E3", "ece_sivil", "Sen konuşmayı haberlerden mi öğrendin lan?", tG0, tH0, yan(tG0), sfx=[E(t_tok - tG0, "tokat", 0.55)]),
        line("Y2", "yaratik724b", "Bu arada aranan aslan da yanımda. O da kapıyı açmanızı rica ediyor.", tH0, tI0, yan(tH0), label="",
             sfx=[E(t_pati0 - tH0 - 0.1, "b9_kapi_arkasi", 0.35, kirp=0.3, sure=0.8)]),
        line("E4", "ece_sivil", "He amına koyim, bi bu eksikti! Barkodu okutulmamış twerkçü!", tI0, tJ0, yan(tI0)),
        {"type": "insert", "dur": R3(tL0 - tJ0), **yan(tJ0),
         "sfx": [E(0.1, "b9_utanma", 0.85), E(t_kuk - tJ0, "b9_kukreme", 1.0), E(VUR[0] - tJ0 + 0.03, "b9_levha", 0.7), E(LEVHA_DUS - tJ0 - 0.05, "esya_dusme", 0.5),
                 E(VUR[0] - tJ0 + 0.05, "b8y4_ece_nefes", 0.55, sure=round(tL0 - VUR[0], 3))]},
        {"type": "insert", "dur": R3(SON - tL0), **fps(FPS_L, tL0),
         "sfx": [E(0.0, "b8y4_ece_nefes", 0.5, kirp=0.4, sure=1.4), E(L_tur0 - tL0 - 0.3, "b9_aslan_adim", 0.85, sure=round(L_dur - L_tur0 + 0.45, 3)),
                 E(L_dev - tL0, "b9_aslan_adim", 0.8, kirp=1.6, sure=round(SON - L_dev, 3)), E(0.0, "kalp_atisi", 0.3, sure=round(SON - tL0, 3))]},
    ]
    man = {k: v for k, v in M.items() if not k.startswith("i_")}
    for j, b in enumerate(beats):
        if b["type"] == "line":
            r = {"Hıh.": "E1", "Bu ses...?": "E2"}.get(b["text"]) or next(k for k, t in TAKE.items() if M[t]["text"] == b["text"])
            man[f"i_{j + 1:02d}"] = M[TAKE[r]]
    json.dump(man, open(f"{VD}/manifest.json", "w"), ensure_ascii=False, indent=1)
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Market · aslan", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.24}, "music": {"name": "yok"}, "beats": beats}
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 9, "title": "Bölüm 9 · Parça 2", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON:.2f} sn  FPS-B {tB0}  Hıh {tC0}  jenerik {jen}  spiker {tE0}  termal {t_term0}  Ece {t_ece}  TV {t_tv2}  BuSes {tF0}  bağır {tG0}"
          f"  yaratık {tH0}  küfür {tI0}  utanma {tJ0}  kükreme {t_kuk} vuruş {VUR}  FPS-L {tL0}  aslan dur {L_dur}")
