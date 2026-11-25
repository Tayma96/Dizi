"""7/24 Bölüm 9, Parça 2 (kullanıcının metni AYNEN: docs/diziler/724/bolumler.md "Bölüm 9, Parça 2").  Sürüm 2 (kullanıcı geri bildirimi:
"hisleri tam vermiyor, canavar konuşurken ses hâlâ TV'den geliyor sandım, hareketler oldu bittiye gelmiş"): her tepkiden önce/sonra nefes payı,
yavaş baş çevirmeleri (önce göz, sonra baş; yay), tepki yüzlerinde tutma; kıskançlık / dehşet / aslan müzikleri; "Bu ses"te ortam kısılır;
Ece TV'yi kumandayla KAPATIR (yaratık sahnesinde TV karanlık); yaratık konuşurken kamera kapı aralığında, ayak gölgeleri konuşma ritmiyle
kıpırdar, kanat vurgularda titrer; küfür repliği E4d (sert), son kelimede aralığa doğru öne eğilir; çıldırmadan önce 0.6 sn ölüm sessizliği.
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
M["Y2a_01"]["duration"] = 4.807          # boğuk/kapı tınlı yeniden işlenmiş dosya (ölçülen süre)
TAKE = {"E1": "E1a_01", "N1": "N1a_01", "E2": "E2a_01", "E3": "E3b_01", "Y2": "Y2a_01", "E4": "E4d_01"}
METIN = {"E1": "Hıh.", "N1": M["N1a_01"]["text"], "E2": "Bu ses...?", "E3": "Sen konuşmayı haberlerden mi öğrendin lan?",
         "Y2": "Bu arada aranan aslan da yanımda. O da kapıyı açmanızı rica ediyor.", "E4": "He amına koyim, bi bu eksikti! Barkodu okutulmamış twerkçü!"}
W = {r: {x["w"].strip(".,?!…"): x for x in M[t]["words"]} for r, t in TAKE.items()}
D = {r: M[t]["duration"] for r, t in TAKE.items()}
R3 = lambda v: round(v, 3)
fr = lambda v: round(round(v * KARE) / KARE, 4)
ws = lambda r, t0, w: R3(t0 + VF + W[r][w]["start"])     # sözcüğün sahne zamanı

# ------------------------------------------------------------------ zaman çizelgesi (sahne sn)
tB0 = 1.8                                   # FPS: yerden, su / flört
tC0 = 6.8                                   # Ece'nin yüzü (sözsüz kıskançlık)
tC1 = 8.5                                   # "Hıh." (line)
tC2 = 10.3                                  # jenerik, baş TV'ye
tE0 = 11.5                                  # spiker (line)
vE = tE0 + VF
t_term0 = R3(vE + W["N1"]["termal"]["start"] - 0.08)
t_ece = R3(vE + W["N1"]["Yetkililer"]["start"] - 0.05)
t_tv2 = R3(t_ece + 2.95)
tF0 = fr(vE + D["N1"] + 0.35)               # sessiz an (Ece'nin yüzü, ortam kısılır)
tF1 = fr(tF0 + 0.5)                         # "Bu ses...?" (line)
tF2 = fr(tF1 + VF + D["E2"] + 0.2)          # bakışlar + kumanda + TV kapanır
t_kpt = R3(tF2 + 2.45)                      # TV KAPANIR (tık)
tG0 = fr(t_kpt + 0.95)                      # kapıya bağırır (line)
tH0 = fr(tG0 + VF + D["E3"] + 0.4)          # kapı aralığı: ayak gölgeleri gelir (sessiz)
tH1 = fr(tH0 + 0.6)                         # yaratık (line)
tI0 = fr(tH1 + VF + D["Y2"] + 0.5)          # bezginlik (sözsüz)
tI1 = fr(tI0 + 0.55)                        # küfür (line, E4d)
tJ0 = fr(tI1 + VF + D["E4"] + 0.35)         # utanma
t_sus = R3(tJ0 + 1.45)                      # ölüm sessizliği (0.6 sn)
t_kuk = R3(t_sus + 0.6)                     # patlama (kükreme dosyası 1.6'dan)
KIRP_K = 1.6
VUR = [R3(t_kuk + v - KIRP_K) for v in (1.75, 2.0, 2.25, 2.55)]
tK0 = R3(VUR[0] - 0.03)                     # geniş yan (vuruşla kesme)
tL0 = R3(VUR[2] + 0.1)                      # FPS final
SON = R3(tL0 + 5.3)
jen = R3(tC2 + 0.25)

# ------------------------------------------------------------------ YAN yerleşim
EO = P1.yI(1.42, 1.66, 1.6)                 # oturan (kalça yerde)
EK = P1.yI(1.42, 1.74, 1.6)                 # ayakta, kapıya yaslı
EA = P1.yI(1.40, 1.50, 1.6)                 # sırtını kapıdan ayırmış (bir adım önde)
EF = P1.yI(1.40, 1.56, 1.6)                 # vuruşla öne savrulmuş
yP = P1.yP
fy = lambda q, k: q[1] - k * q[2]
SO, SE = EO[2] / 1000, EK[2] / 1000
FO = [EO[0], fy(EO, 0.42)]                  # oturan yüz
FK = [EK[0], fy(EK, 0.765)]                 # ayakta yüz
t_kalk0, t_kalk1 = R3(t_ece + 0.5), R3(t_ece + 2.2)      # haberde yavaşça doğrulur
t_tok = ws("E3", tG0, "Sen")
t_ayr0, t_ayr1 = R3(tH1 + VF + 2.75), R3(tH1 + VF + 4.0)  # "O da kapıyı...": sırtını yavaşça kapıdan ayırır
t_he = ws("E4", tI1, "He")
t_eks = ws("E4", tI1, "bi")
t_bar = ws("E4", tI1, "Barkodu")
t_twk = ws("E4", tI1, "twerkçü")

YER = [[0, *EO], [t_kalk0, *EO], [t_kalk1, *EK], [t_tok - 0.01, *EK], [t_tok + 0.05, EK[0] + 5, EK[1], EK[2]], [t_tok + 0.25, *EK],
       [t_ayr0, *EK], [t_ayr1, *EA], [R3(tI0 + 0.4), *EA], [R3(t_he - 0.05), *EA], [R3(t_he + 0.35), *EK],    # bezgin: sırtını yeniden kapıya bırakır
       [R3(t_twk - 0.1), *EK], [R3(t_twk + 0.25), EK[0] + 6, EK[1] + 4, EK[2]], [R3(tJ0 + 0.6), *EK]]
YER += [[R3(VUR[0] - 0.01), *EK], [R3(VUR[0] + 0.12), *EF], [R3(VUR[0] + 0.32), *EF], [R3(VUR[0] + 0.55), *EK]]   # öne savrulur, geri dayanır
for tv in VUR[1:]:
    YER += [[R3(tv - 0.01), *EK], [R3(tv + 0.03), EK[0] - 7, EK[1] - 3, EK[2]], [R3(tv + 0.16), *EK]]
YER.append([SON, *EK])
YER.sort(key=lambda k: k[0])

# el hedefleri (ekran)
KN = [[EO[0] - 52 * SO, EO[1] - 175 * SO], [EO[0] + 52 * SO, EO[1] - 175 * SO]]
CR = [[EO[0] + 62 * SO, EO[1] - 238 * SO], [EO[0] - 60 * SO, EO[1] - 228 * SO]]          # kollar kavuşuk (oturarak)
SAC0 = [FO[0] + 78 * SO, FO[1] - 45 * SO]                                                # at kuyruğunun dibi
SAC1 = [FO[0] + 92 * SO, FO[1] + 70 * SO]                                                # kuyruğu aşağı çeker
YAN_L = [EK[0] - 120 * SE, EK[1] - 420 * SE]
YAN_R = [EK[0] + 115 * SE, EK[1] - 410 * SE]
CEP_L = [EK[0] - 95 * SE, EK[1] - 450 * SE]                                              # arka cep (kumanda)
KUM = [EK[0] - 175 * SE, EK[1] - 770 * SE]                                               # kumandayı TV'ye doğrultur (sol-yukarı)
KAPI_R = [EK[0] + 235 * SE, EK[1] - 640 * SE]
YUZ_L, YUZ_R = [FK[0] - 42 * SE, FK[1] + 25 * SE], [FK[0] + 42 * SE, FK[1] + 25 * SE]
ACIK_L, ACIK_R = [EK[0] - 215 * SE, EK[1] - 560 * SE], [EK[0] + 215 * SE, EK[1] - 560 * SE]
ISARET = [EK[0] + 270 * SE, EK[1] - 330 * SE]
KAPI_SL, KAPI_SR = [EK[0] - 235 * SE, EK[1] - 650 * SE], [EK[0] + 240 * SE, EK[1] - 650 * SE]   # avuçlar kapıya yaslı
c_he = R3(t_he + 0.12)
ELL = [[0, *KN[0]], [R3(tC1 + 0.9), *KN[0]], [R3(tC1 + 1.45), *CR[0]], [R3(t_ece + 0.2), *CR[0]], [R3(t_ece + 0.8), *KN[0]], [t_kalk0, *KN[0]], [t_kalk1, *YAN_L],
       [R3(tF2 + 1.75), *YAN_L], [R3(tF2 + 2.0), *CEP_L], [R3(tF2 + 2.15), *CEP_L], [R3(tF2 + 2.4), *KUM], [R3(t_kpt + 0.45), *KUM], [R3(t_kpt + 0.85), *YAN_L],
       [R3(t_he - 0.02), *YAN_L], [c_he, *YUZ_L], [R3(t_eks - 0.05), *YUZ_L], [R3(t_eks + 0.25), *ACIK_L], [R3(t_bar - 0.1), *ACIK_L], [R3(t_bar + 0.3), *YAN_L],
       [R3(VUR[0] + 0.3), *YAN_L], [R3(VUR[0] + 0.55), *KAPI_SL], [SON, *KAPI_SL]]
ELR = [[0, *KN[1]], [R3(tC0 + 1.05), *KN[1]], [R3(tC0 + 1.3), *SAC0], [R3(tC0 + 1.45), *SAC0], [R3(tC0 + 1.7), *SAC1], [R3(tC0 + 2.0), *KN[1]],
       [R3(tC1 + 1.0), *KN[1]], [R3(tC1 + 1.55), *CR[1]], [R3(t_ece + 0.2), *CR[1]], [R3(t_ece + 0.8), *KN[1]], [t_kalk0, *KN[1]], [t_kalk1, *YAN_R],
       [R3(t_tok - 0.14), *YAN_R], [t_tok, *KAPI_R], [R3(t_tok + 0.8), *KAPI_R], [R3(t_tok + 1.2), *YAN_R],
       [R3(t_he - 0.02), *YAN_R], [c_he, *YUZ_R], [R3(t_eks - 0.05), *YUZ_R], [R3(t_eks + 0.25), *ACIK_R], [R3(t_bar - 0.1), *ACIK_R], [R3(t_bar + 0.35), *ISARET],
       [R3(tJ0 + 0.5), *ISARET], [R3(tJ0 + 1.4), ISARET[0] - 60 * SE, ISARET[1] + 60 * SE],
       [R3(VUR[0] + 0.3), *YAN_R], [R3(VUR[0] + 0.55), *KAPI_SR], [SON, *KAPI_SR]]


def don(t, a, b, sure=0.55):
    """önce gözler (0.15 sn), sonra baş yaylı döner"""
    return [[R3(t), *a], [R3(t + 0.15), b[0], b[1], a[2]], [R3(t + 0.15 + sure), *b]]


SOL = [-0.75, 0.35, -0.5]                   # Mert ve kız (ekran solu, yerde)
TV = [-0.55, -0.75, -0.45]                  # duvar TV'si (sol-yukarı)
KAPI = [0.75, 0.15, 0.7]                    # kapı (arkasında, sağ omuz)
ARALIK = [0.6, 0.75, 0.5]                   # kapının altındaki aralık
ON = [0.0, 0.05, 0.0]
UZAK = [0.35, 0.1, 0.45]                    # "Hıh": başını öbür yana çevirir
BAK = ([[0, *SOL], [0.9, *SOL]] + don(tC1 + VF + 0.25, SOL, UZAK, 0.5) + don(jen + 0.1, UZAK, TV, 0.55)
       + [[t_ece, *TV], [R3(t_kalk1 + 0.4), -0.5, -0.6, -0.45], [tF1, -0.5, -0.6, -0.45]]
       + don(tF2 + 0.1, [-0.5, -0.6, -0.45], KAPI, 0.55) + don(tF2 + 1.25, KAPI, TV, 0.5)
       + don(t_kpt + 0.45, TV, KAPI, 0.55) + [[R3(tG0 + 0.1), 0.85, 0.2, 0.85], [R3(tH0), 0.7, 0.4, 0.6]]
       + [[R3(tH1 + 2.6), 0.7, 0.4, 0.6]] + don(t_ayr0, [0.7, 0.4, 0.6], ARALIK, 0.7) + [[R3(tI0 + 0.1), *ARALIK]]
       + don(tI0 + 0.15, ARALIK, [0.0, -0.3, 0.0], 0.5) + [[R3(t_eks), 0.0, -0.3, 0.0], [R3(t_eks + 0.3), *ON]]
       + don(t_bar - 0.15, ON, ARALIK, 0.45) + [[R3(tJ0 + 0.5), *ARALIK], [R3(tJ0 + 0.9), -0.4, 0.3, 0.3], [R3(tJ0 + 1.3), 0.3, 0.6, 0.35],
                                               [R3(t_sus + 0.3), 0.55, 0.7, 0.45], [R3(VUR[0]), *ON], [SON, *ON]])
DUYGU = [[0, "yorgun"], [0.9, "supheli"], [R3(tC0 + 0.95), "soguk"], [R3(tC1), "alayci"], [R3(jen + 0.1), "saskin"], [R3(t_ece), "saskin"],
         [R3(t_kalk1), "korkmus"], [R3(tF1), "supheli"], [R3(t_kpt + 0.4), "kararli"], [R3(tG0 + 0.05), "ofkeli"], [R3(tH0 + 0.2), "supheli"],
         [R3(ws("Y2", tH1, "aslan")), "saskin"], [R3(t_ayr0), "korkmus"], [R3(tI0 + 0.1), "yorgun"], [R3(t_he + 0.05), "ofkeli"],
         [R3(tJ0 + 0.55), "mahcup"], [R3(t_sus + 0.1), "supheli"], [R3(VUR[0]), "dehset"]]
TILT = [[0, 7], [0.9, 3], [R3(tC0 + 0.95), 5], [R3(tC1 + 0.35), 2], [R3(tC1 + 0.9), -7], [R3(jen + 0.7), 3], [t_ece, 3],
        [R3(tF1), 2], [R3(tF2 + 0.6), -4], [R3(tF2 + 1.7), 4], [R3(t_kpt + 1.0), -2], [R3(tG0 + 0.15), -6], [R3(tH0), 0],
        [R3(t_ayr0), 0], [R3(tI0 + 0.4), 6], [R3(t_he + 0.2), 9], [R3(t_eks + 0.2), 0], [R3(t_bar + 0.3), -5], [R3(tJ0 + 0.9), 4],
        [R3(VUR[0]), 0], [SON, 0]]
EGIL = [[0, 0], [R3(tG0 + 0.05), 0], [R3(tG0 + 0.2), 5], [R3(tH0), 2], [R3(t_ayr0), 1], [R3(t_ayr1), 4], [R3(tI0 + 0.4), -1],
        [R3(t_he + 0.3), -4], [R3(t_twk - 0.1), 2], [R3(t_twk + 0.25), 10], [R3(tJ0 + 0.6), 3], [R3(t_sus), 1],
        [R3(VUR[0] - 0.01), 0], [R3(VUR[0] + 0.12), 12], [R3(VUR[0] + 0.35), 9], [R3(VUR[0] + 0.6), -3], [SON, -3]]
GOZKIS = [[0, 0, 0], [R3(tC0 + 0.2), 0, 0], [R3(tC0 + 0.8), 0.5, 0.45], [R3(tC1 + 0.4), 0.6, 0.5], [R3(jen), 0.3, 0.3], [R3(jen + 0.4), 0, 0],
          [R3(tF1), 0, 0], [R3(tF2 + 0.6), 0.3, 0.3], [R3(tG0 + 0.1), 0.25, 0.25], [R3(tH0 + 0.3), 0, 0],
          [R3(tI1), 0, 0], [R3(t_eks), 0.35, 0.35], [R3(t_twk), 0.6, 0.5], [R3(tJ0 + 0.55), 0, 0]]
GOZ = [[0, 0], [0.55, 0], [0.62, 1], [0.7, 0], [R3(tC0 + 0.5), 0], [R3(tC0 + 0.56), 1], [R3(tC0 + 0.64), 0],
       [R3(t_ece + 1.4), 0], [R3(t_ece + 1.46), 1], [R3(t_ece + 1.54), 0],
       [R3(tH1 + 3.6), 0], [R3(tH1 + 3.66), 1], [R3(tH1 + 3.74), 0],
       [R3(tI0 + 0.05), 0], [R3(tI0 + 0.3), 0.9], [R3(t_he - 0.05), 0.9], [R3(t_he + 0.05), 0],
       [R3(tJ0 + 1.0), 0], [R3(tJ0 + 1.06), 1], [R3(tJ0 + 1.14), 0],
       [R3(VUR[0]), 0], [R3(VUR[0] + 0.04), 1], [R3(VUR[2] + 0.06), 1], [R3(VUR[2] + 0.12), 0]]
GOZSOK = [[0, 0], [R3(t_term0), 0], [R3(t_ece + 0.3), 0.2], [R3(t_kalk1), 0.65], [R3(tF1), 0.4], [R3(tG0), 0],
          [R3(ws("Y2", tH1, "aslan")), 0], [R3(ws("Y2", tH1, "yanımda") + 0.5), 0.9], [R3(tI0), 0.4], [R3(t_he), 0],
          [R3(t_sus + 0.2), 0], [R3(t_sus + 0.5), 0.5], [R3(VUR[0]), 1], [SON, 1]]
NEFES = [[0, 0.8], [R3(tC0), 1.0], [R3(t_ece + 1.0), 0.4], [R3(tF1), 0.25], [R3(tI0), 0.9], [R3(tI0 + 0.45), 0.3],
         [R3(t_sus), 0.15], [R3(VUR[0]), 3.4]]
YEROTUR = [[0, 1], [t_kalk0, 1], [t_kalk1, 0]]
KONUS = [{"t": R3(t0 + VF), "cues": M[TAKE[r]]["mouth"]} for r, t0 in (("E1", tC1), ("E2", tF1), ("E3", tG0), ("E4", tI1))]
ECE = {"id": "ece_sivil", "onKol": True, "dogalKol": True, "yay": 1, "yer": YER, "elL": ELL, "elR": ELR,
       "bak": BAK, "duygu": DUYGU, "tilt": TILT, "egil": EGIL, "gozKis": GOZKIS, "goz": GOZ, "gozSok": GOZSOK,
       "nefes": NEFES, "yerOtur": YEROTUR, "konus": KONUS, "sacDagin": 0.6,
       "tutL": [[0, None], [R3(tF2 + 2.1), "kumanda"], [R3(t_kpt + 0.75), None]],
       "tutR": [[0, None], [R3(t_bar + 0.3), "isaret"], [R3(tJ0 + 1.3), None]], "isaretAci": 140,
       "ezil": [[0, 0], [R3(t_he + 0.3), 0], [R3(t_he + 0.36), 0.04], [R3(t_he + 0.5), 0]] + sum([[[R3(v - 0.01), 0], [R3(v + 0.03), 0.05], [R3(v + 0.15), 0]] for v in VUR], [])}

# ------------------------------------------------------------------ kapı altı: ışık, ayak gölgeleri (konuşma ritmiyle), pati gölgeleri; kanat titremesi; levha
GX, GW, PX, PW = 0.74, 0.22, 0.93, 0.13
t_ayak = R3(tH0 + 0.15)
t_pati = R3(ws("Y2", tH1, "aslan") + 0.15)
yv = tH1 + VF
cues = M[TAKE["Y2"]]["mouth"]


def acik(t):
    v = "X"
    for c in cues:
        if yv + c["t"] <= t:
            v = c["v"]
    return 0 if v == "X" else 1


KA = [[0, 0.42, -1, GW, -1, 0, 1], [0.9, 0.5, -1, GW, -1, 0, 1], [1.3, 0.38, -1, GW, -1, 0, 1], [R3(tH0), 0.9, -1, GW, -1, 0, 1],
      [t_ayak, 0.9, 0.8, 0.1, -1, 0, 0.5], [R3(t_ayak + 0.35), 0.9, GX, GW, -1, 0, 1]]
for i in range(int((D["Y2"] + 0.2) * 15)):           # konuşurken ayaklar ağırlık aktarır (ritimle kıpırdar)
    t = R3(yv + i / 15)
    a = acik(t)
    pati = t >= t_pati
    px = PX if t >= t_pati + 0.45 else (1.08 - (1.08 - PX) * min(1, (t - t_pati) / 0.45) if pati else -1)
    KA.append([t, 0.9, round(GX + 0.012 * a * math.sin(i * 1.7), 4), round(GW + 0.018 * a, 4), round(px, 4), PW if pati else 0, 1])
t_ut = R3(tJ0 + 0.1)
KA += [[t_ut, 0.9, GX, GW, PX, PW, 1], [R3(t_ut + 0.6), 0.9, 0.72, 0.15, PX, PW, 0.75], [R3(t_ut + 1.2), 0.9, 0.71, 0.1, PX, PW, 0.45],
       [R3(t_sus + 0.4), 0.9, 0.71, 0.1, PX, PW, 0.45], [R3(t_sus + 0.58), 0.9, GX, 0.26, PX, PW, 1]]       # sessizliğin sonunda kapıya yapışır
for tv in VUR:
    KA += [[R3(tv - 0.01), 0.9, GX, 0.26, PX, PW, 1], [R3(tv + 0.02), 1.0, GX, 0.26, PX, PW, 1], [R3(tv + 0.1), 0.2, GX, 0.26, PX, PW, 1]]
LEVHA_DUS = R3(VUR[0] + 0.42)
KA += [[LEVHA_DUS, 0.0, GX, 0.26, PX, PW, 1], [SON, 0.0, GX, 0.26, PX, PW, 1]]
KA.sort(key=lambda k: k[0])
TIT = [[0, 0]]
for w in ("aranan", "aslan", "yanımda", "kapıyı", "rica"):
    t = ws("Y2", tH1, w)
    TIT += [[R3(t - 0.01), 0], [R3(t + 0.03), 1.3], [R3(t + 0.07), -0.9], [R3(t + 0.11), 0.4], [R3(t + 0.16), 0]]
LEVHA = [[0, 11], [R3(t_ut + 0.2), 11], [R3(t_ut + 0.3), 11.8], [R3(t_ut + 0.5), 10.6], [R3(t_ut + 0.7), 11],
         [R3(VUR[0] - 0.01), 11], [R3(VUR[0] + 0.06), 2], [R3(VUR[0] + 0.3), 0], [SON, 0]]
LEVHADY = [[0, 0], [R3(VUR[0] + 0.02), 0]] + [[R3(VUR[0] + 0.02 + i * 0.04), round(min(2.2, 0.5 * 9.8 * (i * 0.04) ** 2 * 1.1), 3)] for i in range(1, 11)] + [[SON, 2.2]]

# ------------------------------------------------------------------ kamera (yan) + kurgu
P1.SINIR["yan"] = (0, 1080, 0, 1920)
kp = lambda cx, cy, z: P1.kirp("yan", cx, cy, z)
GA2 = [round(v, 1) for v in yP(1.68, 0.0, 1.9)]
GA2[1] = round(GA2[1] + 48, 1)          # aralık kadrajın üst-ortasında (altyazı bandının üstünde)
CAMY = [[0] + kp(EO[0] - 160, 1060, 1.42), [R3(tB0 - 0.01)] + kp(EO[0] - 125, 1068, 1.53),
        [tC0] + kp(FO[0] + 10, FO[1] + 60, 2.7), [R3(tC2 - 0.01)] + kp(FO[0] + 10, FO[1] + 40, 3.15),      # kıskançlık: yavaş itiş
        [tC2] + kp(EO[0] - 150, FO[1] - 160, 1.85), [R3(tE0 - 0.01)] + kp(EO[0] - 150, FO[1] - 170, 1.9),     # jenerik: TV + Ece
        [t_ece] + kp(EO[0] - 170, FO[1] - 120, 1.95), [t_kalk1] + kp(EK[0] - 140, FK[1] + 40, 2.05), [R3(t_tv2 - 0.01)] + kp(EK[0] - 140, FK[1] + 35, 2.1),
        [tF0] + kp(FK[0] - 10, FK[1] + 90, 2.6), [R3(tF2 - 0.01)] + kp(FK[0] - 5, FK[1] + 55, 3.15),           # "Bu ses": yavaş itiş
        [tF2] + kp(EK[0] - 150, FK[1] + 40, 1.95), [R3(tG0 - 0.01)] + kp(EK[0] - 140, FK[1] + 45, 2.05),       # TV + Ece: kumanda
        [tG0] + kp(EK[0] + 20, FK[1] + 120, 2.35), [R3(tH0 - 0.01)] + kp(EK[0] + 30, FK[1] + 110, 2.45),
        [tH0] + kp(GA2[0], GA2[1], 4.3), [R3(yv + 2.45)] + kp(GA2[0] + 3, GA2[1] - 3, 4.7),                  # kapı aralığı (ses kapıdan)
        [R3(yv + 2.5)] + kp(EK[0] + 10, FK[1] + 70, 2.6), [R3(tI0 - 0.01)] + kp(EA[0] + 5, fy(EA, 0.765) + 40, 2.75),
        [tI0] + kp(EA[0] + 5, fy(EA, 0.765) + 40, 2.75), [R3(tI1 + 0.3)] + kp(EK[0], FK[1] + 140, 2.25), [R3(tJ0 - 0.01)] + kp(EK[0] + 10, FK[1] + 170, 2.35),
        [tJ0] + kp(745, 1150, 2.5), [R3(tK0 - 0.01)] + kp(745, 1132, 2.68),                                   # utanma + sessizlik
        [tK0] + kp(EK[0] + 30, FK[1] + 300, 1.7), [SON] + kp(EK[0] + 30, FK[1] + 300, 1.75)]
KURGU = [[0, "yan"], [tE0, "tv"], [t_ece, "yan"], [t_tv2, "tv"], [tF0, "yan"]]
SARS = [[0, 0], [R3(t_tok - 0.01), 0], [R3(t_tok), 0.25], [R3(t_tok + 0.15), 0]]
for tv in VUR:
    SARS += [[R3(tv - 0.01), 0.05], [R3(tv), 1.3], [R3(tv + 0.18), 0.2]]
SARS += [[R3(VUR[-1] + 0.5), 0]]
SPIKER = {"yer": [[0, 270, 760, 720]], "duygu": [[0, "notr"]], "bak": [[0, 0.02, 0.0, 0.05], [R3(vE + 3.2), -0.02, 0.05, -0.04], [R3(vE + 6), 0.03, 0.0, 0.06]],
          "tilt": [[0, 0], [R3(vE + 0.3), 2], [R3(vE + 1.0), -1], [R3(vE + 4.0), 2], [R3(vE + 5.2), -2], [R3(vE + 8.5), 1]],
          "konus": [{"t": R3(vE), "cues": M[TAKE["N1"]]["mouth"]}], "goz": [[0, 0], [R3(vE + 2.2), 0], [R3(vE + 2.26), 1], [R3(vE + 2.34), 0], [R3(vE + 7.1), 0], [R3(vE + 7.16), 1], [R3(vE + 7.24), 0]]}
ORTAK = {"saat": [[0, "00:19"]], "kapi": [[0, 0]], "flor": [[0, 0.85]], "lamba": [[0, 0]], "titre": {"yan": 1.0, "tv": 0.6},
         "eceArkada": True, "odak": [[0, 0]], "depo": [[0, 0]], "depoKol": [[0, 0]], "toz": [[0, 0]], "sars": SARS, "anime": {}, "animeMerkez": {},
         "levha": LEVHA, "levhaDy": LEVHADY, "kanatTit": TIT, "kapiAltBas": 0.6, "kapiAlt": KA, "ayakkabi": [[0, 1.63, 1.69, 79, 0]], "ayakkabiIz": [1.68, 1.9],
         "tvYayin": {"jen": jen, "sp": R3(tE0), "term": [t_term0, t_ece], "kapat": t_kpt}, "karart": [[0, 1], [0.55, 0]],
         "kurgu": KURGU, "cam": {"yan": CAMY, "tv": [[0, 540, 820, 1.12], [SON, 540, 800, 1.16]]},
         "kar": {"yan": {"ece": ECE}, "tv": {"spiker": SPIKER}},
         "fx": [[R3(VUR[0] + 0.02), "dokuntu", "yan", *[round(v, 1) for v in yP(1.475, 2.12, 1.89)], 0.9, 1.9]]}

# ------------------------------------------------------------------ FPS B: yerden (oturan Ece), su şişesi, flört (yavaş; güzellik yavaş yavaş)
MZ = -3.9
KZ = MZ + 0.1
cB = [0.05, 0.82, -1.3]
b = lambda v: R3(tB0 + v)
b_ac, b_ver0, b_ver1 = b(0.3), b(0.8), b(1.35)
b_ic0, b_ic1 = b(1.6), b(2.45)
b_sac = b(2.95)
b_dok = b(3.75)
b_mert = b(4.0)
KAM_B = [[tB0, *cB, -181, -1, 0], [tC0, cB[0] - 0.03, cB[1] + 0.01, cB[2] - 0.08, -180, -1.5, 0]]
MERT_EL_B = [[tB0, -0.26, 0.74, MZ + 0.22], [b_ac, -0.24, 0.76, MZ + 0.22], [b_ver0, -0.24, 0.74, MZ + 0.22], [b_ver1, -0.07, 0.68, MZ + 0.3],
             [b(1.7), -0.2, 0.6, MZ + 0.2], [b_mert, -0.2, 0.6, MZ + 0.2], [b(4.45), -0.32, 0.98, MZ + 0.05], [tC0, -0.32, 0.98, MZ + 0.05]]
mertB = {"id": "mert724", "w": [-0.42, -0.55, MZ], "boy": 1.75,
         "q": {"onKol": True, "dogalKol": True, "yay": 1, "duygu": [[0, "notr"], [b(3.1), "saskin"], [b(3.6), "mutlu"], [b_mert, "mahcup"]],
               "bak": [[0, 0.4, 0.2, 0.25], [b_mert, 0.4, 0.2, 0.25], [b(4.3), 0.1, 0.7, 0.1], [b(4.7), 0.1, 0.7, 0.1], [b(5.0), 0.45, 0.35, 0.25]],
               "tilt": [[0, -2], [b_mert, -2], [b(4.5), -9]], "elR3": MERT_EL_B, "elL3": [[0, -0.5, 0.55, MZ + 0.1]],
               "tutR": [[0, "su"], [b_ac, "suAcik"], [R3(b_ver1 + 0.05), None]], "tutL": [[0, None], [R3(b_ac - 0.1), "kapak"], [b(1.8), None]]}}
KIZ_EL_L = [[tB0, 0.05, 0.42, KZ + 0.25], [b_ver0, 0.05, 0.45, KZ + 0.25], [b_ver1, -0.04, 0.66, KZ + 0.3], [b_ic0, 0.07, 0.78, KZ + 0.3],
            [b_ic1, 0.07, 0.8, KZ + 0.3], [b(2.85), 0.18, 0.5, KZ + 0.3], [tC0, 0.18, 0.5, KZ + 0.3]]
KIZ_EL_R = [[tB0, 0.35, 0.4, KZ + 0.2], [R3(b_sac - 0.15), 0.35, 0.4, KZ + 0.2], [R3(b_sac + 0.3), 0.3, 0.95, KZ + 0.1], [R3(b_sac + 0.7), 0.34, 0.5, KZ + 0.2],
            [R3(b_dok - 0.2), 0.3, 0.5, KZ + 0.25], [R3(b_dok + 0.2), -0.2, 0.72, MZ + 0.15], [tC0, -0.19, 0.7, MZ + 0.15]]
kizB = {"id": "kacan724", "w": [0.14, -0.74, KZ], "boy": 1.65, "hale": [[0, 0.5, 0.35], [b_ic1, 0.55, 0.6], [R3(b_sac + 0.5), 0.62, 1.0], [tC0, 0.62, 1.0]],
        "bacak3": [{"n": [[0.22, 0.08, KZ + 0.1], [0.44, 0.3, KZ + 0.32], [0.52, 0.06, KZ + 0.56], [0.58, 0.04, KZ + 0.72]], "ayak": "ciplak"},
                   {"n": [[0.3, 0.07, KZ + 0.04], [0.62, 0.1, KZ + 0.2], [0.88, 0.07, KZ + 0.38], [0.97, 0.07, KZ + 0.52]], "ayak": "ayakkabi"}],
        "q": {"onKol": True, "dogalKol": True, "yay": 1, "sacDagin": 0.35,
              "duygu": [[0, "uzgun"], [b_ver1, "mutlu"], [b_ic0, "notr"], [R3(b_ic1 + 0.2), "mutlu"], [b_dok, "gulen"], [b(4.5), "mutlu"]],
              "bak": [[0, -0.5, 0.0, -0.3], [b_ic0, -0.1, -0.7, -0.05], [b_ic1, -0.1, -0.7, -0.05], [b(2.9), -0.55, 0.1, -0.35], [b_dok, -0.6, 0.05, -0.4]],
              "tilt": [[0, 4], [b_ic0, 4], [b(2.0), -10], [b_ic1, -10], [b(2.85), 2], [b_sac, 2], [R3(b_sac + 0.35), 16], [R3(b_sac + 0.85), -3], [b_dok, 6]],
              "egil": [[0, 0], [b(2.0), -5], [b_ic1, -5], [b(2.85), 0], [b_dok, -4]],
              "goz": [[0, 0], [b(1.95), 0], [b(2.1), 1], [R3(b_ic1 - 0.1), 1], [b_ic1, 0]],
              "parilti": [[0, 0, 0], [R3(b_ic1 + 0.3), 0, 0], [R3(b_sac + 0.6), 0.6, 0.6], [tC0, 0.6, 0.6]],
              "elL3": KIZ_EL_L, "elR3": KIZ_EL_R, "tutL": [[0, None], [b_ver1, "suAcik"], [R3(b_ic1 + 0.05), "suYarim"]],
              "esyaAci": [[0, -15], [b_ic0, -15], [b(2.05), -120], [b_ic1, -125], [b(2.85), -15]], "nefes": [[0, 1.2]]}}
FPS_B = {"mekan": "depo", "kacis": {"kar": [mertB, kizB]}, "kam": KAM_B, "sallan": [[0, 0, 2.8]], "titreme": [[0, 0.15]],
         "fov": [[tB0, 1.55], [b(2.0), 1.7], [tC0, 1.98]], "sac": [[0, 9]]}

# ------------------------------------------------------------------ FPS L: kapıya yaslı (ayakta), dehşet; arkada aslan (acelesiz)
cL = [0.02, 1.6, -1.28]
L_dur = R3(tL0 + 1.95)
L_bak0, L_bak1 = R3(L_dur + 0.15), R3(L_dur + 1.75)
L_dev = R3(L_bak1 + 0.2)
ASL = []
x, faz = 2.35, 0.0
for i in range(int((SON - tL0) * KARE) + 2):
    t = tL0 + i / KARE
    v = 0.72 if t < L_dur else max(0.0, 0.72 * (1 - (t - L_dur) / 0.25)) if t < L_dev else min(0.72, 0.72 * (t - L_dev) / 0.4)
    hiz = v / 0.72
    x -= v / KARE
    faz += 4.6 * hiz / KARE
    bk = 0.0 if t < L_bak0 else min(1, (t - L_bak0) / 0.4) if t < L_bak1 else max(0, 1 - (t - L_bak1) / 0.35)
    ASL.append([R3(t), round(x, 4), -8.85, round(faz, 3), round(hiz, 3), round(bk, 3), 1, -1])
mertL = {"id": "mert724", "w": [-0.42, -0.55, MZ], "boy": 1.75,
         "q": {"onKol": True, "dogalKol": True, "yay": 1, "duygu": [[0, "dehset"]], "bak": [[0, 0.2, -0.6, 0.15], [L_dur, 0.15, -0.65, 0.12]],
               "tilt": [[0, -3]], "elR3": [[0, -0.05, 0.62, MZ + 0.3]], "elL3": [[0, -0.55, 0.5, MZ + 0.15]], "gozSok": [[0, 0.8]], "nefes": [[0, 3.5]]}}
kizL = {"id": "kacan724", "w": [-0.04, -0.74, KZ], "boy": 1.65, "tutam3": [-0.27, 0.66, MZ + 0.25], "bacak3": kizB["bacak3"],
        "q": {"onKol": True, "dogalKol": True, "yay": 1, "sacDagin": 0.5, "duygu": [[0, "dehset"]], "bak": [[0, -0.1, -0.6, -0.08]],
              "tilt": [[0, 6]], "egil": [[0, -8]], "elL3": [-0.27, 0.66, MZ + 0.25], "elR3": [[0, 0.3, 0.42, KZ + 0.25]], "gozSok": [[0, 1]], "nefes": [[0, 4]]}}
KAM_L = [[tL0, *cL, -180, 13, -2], [R3(tL0 + 0.5), *cL, -180, 11, 1], [R3(tL0 + 1.0), *cL, -180, 9, 0],
         [R3(L_dur + 0.5), cL[0] - 0.02, cL[1] - 0.02, cL[2], -180.5, 6, 0], [SON, cL[0] - 0.02, cL[1] - 0.02, cL[2], -180.5, 5.5, 0]]
FPS_L = {"mekan": "depo", "kacis": {"kar": [mertL, kizL]}, "kam": KAM_L, "sallan": [[0, 0, 2.8]], "aslan": ASL,
         "titreme": [[tL0, 0.7], [R3(tL0 + 0.9), 0.3], [L_dur, 0.15], [SON, 0.12]],
         "sars": [[tL0, 0.3], [R3(VUR[3] - 0.01), 0.1], [VUR[3], 1.2], [R3(VUR[3] + 0.25), 0.15], [R3(VUR[3] + 0.6), 0]],
         "fov": [[tL0, 1.05], [R3(tL0 + 1.0), 1.1], [R3(L_dur + 0.4), 1.5], [SON, 1.6]], "kalp": [[tL0, 0.5], [L_dur, 0.8], [SON, 0.8]], "sac": [[0, 9]],
         "karart": [[0, 0], [R3(SON - 0.12), 0], [SON, 1]]}


def E(t, isim, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t, 3), "volume": vol, **kw}


if __name__ == "__main__":
    ep_id = "724-09-p2"

    def yan(t0):
        return {"kind": "b8_market", "text": [json.dumps({**ORTAK, "t0": round(t0, 3)}, ensure_ascii=False, separators=(",", ":"))]}

    def fps(prm, t0):
        return {"kind": "b8_fps", "text": [json.dumps({**prm, "t0": round(t0, 3)}, separators=(",", ":"))]}

    def ins(t0, t1, ekle, sfx=None):
        bb = {"type": "insert", "dur": R3(t1 - t0), **ekle}
        if sfx:
            bb["sfx"] = sfx
        return bb

    def line(r, who, t0, t1, ekle, label=None, sfx=None):
        bb = {"type": "line", "who": who, "text": METIN[r], "emotion": "notr", "gapAfter": round((t1 - t0) - D[r], 4), "ekle": ekle, "_r": r}
        if label is not None:
            bb["label"] = label
        if sfx:
            bb["sfx"] = sfx
        return bb

    t_dehset = R3(t_term0 - 0.3)
    beats = [
        ins(0, tB0, yan(0), [E(0.0, "b9_floresan", 0.16)]),
        ins(tB0, tC0, fps(FPS_B, tB0), [E(0.15, "b9_su_sise", 0.75), E(0.05, "muzik/b9_kiskanc", 0.3, zarf=[[0, 0], [0.9, 1], [7.6, 1], [8.9, 0]])]),
        ins(tC0, tC1, yan(tC0)),
        line("E1", "ece_sivil", tC1, tC2, yan(tC1)),
        ins(tC2, tE0, yan(tC2), [E(jen - tC2, "b9_haber_jenerik", 0.55)]),
        line("N1", "spiker", tE0, tF0, yan(tE0), sfx=[E(t_dehset - tE0, "muzik/b9_dehset", 0.32, sure=round(tG0 + 0.05 - t_dehset, 3),
                                                       zarf=[[0, 0], [1.5, 0.35], [6.0, 0.55], [round(tF1 - t_dehset, 2), 0.8], [round(tG0 - t_dehset, 2), 1.0]])]),
        ins(tF0, tF1, yan(tF0)),
        line("E2", "ece_sivil", tF1, tF2, yan(tF1)),
        ins(tF2, tG0, yan(tF2), [E(t_kpt - tF2 - 0.02, "el_kalem_tik", 0.6)]),
        line("E3", "ece_sivil", tG0, tH0, yan(tG0), sfx=[E(t_tok - tG0, "tokat", 0.55)]),
        ins(tH0, tH1, yan(tH0), [E(0.1, "b9_kapi_arkasi", 0.3, kirp=0.3, sure=0.5)]),
        line("Y2", "yaratik724b", tH1, tI0, yan(tH1), label="", sfx=[E(t_pati - tH1 - 0.1, "b9_kapi_arkasi", 0.3, kirp=0.3, sure=0.7)]),
        ins(tI0, tI1, yan(tI0), [E(0.15, "b8y4_ece_nefes", 0.35, kirp=0.6, sure=0.5)]),
        line("E4", "ece_sivil", tI1, tJ0, yan(tI1), sfx=[E(t_he + 0.3 - tI1, "el_kapi_arkasi_gum", 0.35)]),
        ins(tJ0, tL0, yan(tJ0), [E(0.1, "b9_utanma", 0.85), E(t_kuk - tJ0, "b9_kukreme", 1.0, kirp=KIRP_K), E(VUR[0] - tJ0 + 0.03, "b9_levha", 0.7),
                                 E(LEVHA_DUS - tJ0 - 0.05, "esya_dusme", 0.5), E(VUR[0] - tJ0 + 0.05, "b8y4_ece_nefes", 0.55, sure=round(tL0 - VUR[0], 3))]),
        ins(tL0, SON, fps(FPS_L, tL0), [E(0.0, "b8y4_ece_nefes", 0.45, kirp=0.4, sure=1.4), E(0.25, "muzik/b9_aslan", 0.34, sure=round(SON - tL0, 3), zarf=[[0, 0], [1.0, 1], [7.0, 1]]),
                                       E(0.55, "b9_aslan_adim", 0.8, sure=round(L_dur - tL0 - 0.4, 3)),
                                       E(L_dev - tL0, "b9_aslan_adim", 0.75, kirp=1.6, sure=round(SON - L_dev, 3)), E(0.0, "kalp_atisi", 0.28, sure=round(SON - tL0, 3))]),
    ]
    man = {k: v for k, v in M.items() if not k.startswith("i_")}
    for j, bb in enumerate(beats):
        if bb["type"] == "line":
            man[f"i_{j + 1:02d}"] = M[TAKE[bb.pop("_r")]]
    json.dump(man, open(f"{VD}/manifest.json", "w"), ensure_ascii=False, indent=1)
    amb = [[0, 1], [tF0, 1], [R3(tF0 + 0.6), 0.25], [R3(tG0 - 0.05), 0.25], [R3(tG0 + 0.4), 1], [R3(t_sus - 0.05), 1], [R3(t_sus + 0.15), 0.3], [R3(t_kuk), 0.3], [R3(t_kuk + 0.2), 1]]
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Market · aslan", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.24, "zarf": amb}, "music": {"name": "yok"}, "beats": beats}
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 9, "title": "Bölüm 9 · Parça 2", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON:.2f}  B {tB0} C {tC0} Hıh {tC1} jen {jen} spiker {tE0} term {t_term0} Ece {t_ece} TV {t_tv2} sessiz {tF0} BuSes {tF1}"
          f" kumanda {tF2} kapat {t_kpt} bağır {tG0} aralık {tH0} yaratık {tH1} bezgin {tI0} küfür {tI1} utanma {tJ0} sessizlik {t_sus} vuruş {VUR} L {tL0} dur {L_dur}")
