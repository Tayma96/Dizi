"""7/24 B7 Parça 3 v3 (salon + antre + kanca, gece). Senarist planı: docs/diziler/724/raporlar/b7-senarist.md "PARÇA 3".
Kullanım: python3 tools/b7v3p3.py
Coğrafya: Ece'nin odası SOLDA, sofra ortada, banyo/antre koridoru SAĞDA. 180°: anne solda-ortada, Ece sağına gelir.
Akış: anne tabakları sert bırakır → Ece pijamayla sağdan girip annenin arkasından odasına koşar, kapı KÜT (anne başıyla izler) →
kapı arkasında dolap, GÜM, "İyiyim!" (anne göz devirir) → kapı aralanır, pijama üstü annenin başına düşer; anne kıpırdamaz, iki
parmakla çekip omzunun üstünden atar → "otur şu masaya" (çatal masaya) → Ece hardal kazakla çıkar, annenin arkasından sağına geçer;
anne cebinden desteyi çıkarır → "o para...." → zeytin (yakın), havaya atıp ağzıyla yakalar → MUAH → "az işim var gelicemm" ağzı
dolu, geri geri sağdan çıkar → antre: kapıyı açar, merdiven karanlık, otomatik "tık", çıkar, kapı kapanır → kapı altındaki ışık
söner, boğuk "Hassiktir…", ışık geri gelir, merdivenden koşar → KANCA: anne yanağını siler, bandı çevirir: "7/24" damgası;
yüzü öfkeden endişeye → yorum kartı.
Kullanıcının replikleri AYNEN ("Bölüm 7, Parça 3"); Y3 "İyiyim!" ve Y4 "Hassiktir…" onaylı doğaçlama.
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from b7v3_ortak import Kamera, b7, man_yukle, yaz, sirala  # noqa: E402

M = man_yukle("724-07-p3/cekim", "724-07-yeni")
sure = lambda tk: M[tk]["duration"]
SIRA = [  # (ad, kim, metin, çekim, boşluk, görünüm)
    ("SOF", None, None, None, 1.9, "salon"),
    ("GEC", None, None, None, 1.85, "salon"),
    ("KAPI", None, None, None, 1.9, "salon"),
    ("Y3", "ece_ev", "İyiyim!", "Y3_kisa", 0.0, "salon"),
    ("PIJ", None, None, None, 1.5, "salon"),
    ("A1", "anne724", "otur şu masaya", "A1a_01", 0.2, "salon"),
    ("CIKAR", None, None, None, 1.6, "salon"),
    ("A2", "anne724", "o para....", "A2a_01", 0.25, "salon"),
    ("ZEY", None, None, None, 0.95, "salon"),
    ("ATIS", None, None, None, 0.95, "salon"),
    ("OPUC", None, None, None, 0.95, "salon"),
    ("E1", "ece_sivil", "az işim var gelicemm", "E1a_01", 0.35, "salon"),
    ("ANT", None, None, None, 2.7, "antre"),
    ("SON", None, None, None, 0.8, "antre"),
    ("Y4", "ece_sivil", "Hassiktir…", "Y4_sec", 0.5, "antre"),
    ("K1", None, None, None, 1.5, "salon"),
    ("K2", None, None, None, 2.3, "salon"),
    ("K3", None, None, None, 2.2, "salon"),
]
T, t = {}, 0.0
for ad, kim, metin, tk, gap, v in SIRA:
    T[ad] = t
    t += (sure(tk) + gap) if tk else gap
SON = t
sof, gec, kapi, y3, pij, a1, cik, a2, zey, atis, opuc, e1, ant, sn, y4, k1, k2, k3 = (T[x[0]] for x in SIRA)
TK = {"A1": "A1a_01", "A2": "A2a_01", "E1": "E1a_01", "Y3": "Y3_kisa", "Y4": "Y4_sec"}
konus = lambda ad: {"t": T[ad] + 0.08, "cues": M[TK[ad]]["mouth"]}

# ------------------------------------------------------------------ SALON yerleşimi (karakterler masanın arkasında, ayak y 1600)
FY, SZ = 1600, 1250
S = SZ / 1000
AX = 560
EX = 820
YUZ_Y = FY - 765 * S          # 644
OM_Y = FY - 628 * S           # 815
MASA_Y = 1255                 # masa üstü (yukari=270)
CEP_A = (AX + 58 * S, FY - 340 * S)   # annenin hırka cebi (632, 1175)
KASE = (650, 1300)

anne_elR = [
    [0, 690, 1040], [0.25, 760, 1235], [0.35, 760, 1240], [0.6, 690, 1060],          # tabak (sağ yer) TAK
    [0.75, 600, 1060], [1.05, 360, 1235], [1.15, 360, 1240], [1.4, 640, 1120],        # ikinci tabak (sol yer) TAK
    [1.55, 650, 1255], [1.75, 650, 1260], [1.9, 650, 1180],                            # zeytin kâsesini ortalar
    [gec, 690, 1150], [kapi, 690, 1150],
    [a1, 690, 1150], [T["A1"] + 0.08 + 0.5, 700, 1100], [T["A1"] + 0.08 + 0.63, 720, 1255], [T["A1"] + 0.08 + 0.75, 715, 1200], [cik, 700, 1150],   # çatal "masaya"
    [cik + 0.35, *CEP_A], [cik + 0.55, *CEP_A], [cik + 0.95, 690, 1060], [a2, 690, 1040],
    [T["A2"] + 0.25, 700, 760], [opuc, 700, 760], [opuc + 0.4, 700, 760], [e1, 700, 780], [ant, 690, 840],          # deste havada (yarım kalan cümle)
    [k1, 690, 1000], [k2, 690, 1000], [SON, 690, 1000],
]
anne_elL = [
    [pij + 0.95, 470, 1150], [pij + 1.15, 560, 520], [pij + 1.3, 560, 520], [a1 + 0.05, 520, 560], [a1 + 0.3, 590, 430], [a1 + 0.45, 470, 1150],   # pijamayı başından alır, omzunun üstünden atar
    [k1, 470, 1150], [k1 + 0.35, 505, 670], [k1 + 0.7, 510, 685], [k1 + 0.95, 470, 1000], [k1 + 1.25, 470, 1150],                            # yanağına dokunur, siler
]
ANNE = {
    "yer": [[0, AX, FY, SZ], [cik + 0.9, AX, FY, SZ], [cik + 1.2, AX + 30, FY, SZ]], "yuru": [[cik + 0.9, cik + 1.2]],
    "dogalKol": True, "onKol": True, "kolL": [[0, 8, 3]],
    "elR": sirala(anne_elR), "elRara": [[-99, 99]],
    "elL": sirala(anne_elL), "elLara": [[pij + 0.9, a1 + 0.5], [k1 - 0.05, k1 + 1.3]],
    "tutR": [[0, "tabak"], [0.3, "tabak"], [1.1, None], [cik + 0.5, "deste"]],
    "tutL": [[0, None], [pij + 1.2, "pijama"], [a1 + 0.32, None]],
    "kafada": [[0, None], [pij + 0.55, "pijama"], [pij + 1.22, None]],
    "cepDeste": [[0, 1], [cik + 0.5, 0]],
    "duygu": [[0, "ofkeli"], [gec + 0.2, "saskin"], [kapi + 0.3, "supheli"], [y3 + 0.4, "alayci"], [pij + 0.5, "notr"], [a1, "ofkeli"],
              [atis + 0.3, "saskin"], [opuc + 0.45, "mutlu"], [opuc + 0.8, "saskin"], [e1 + 0.6, "ofkeli"],
              [k1, "saskin"], [k1 + 0.45, "mutlu"], [k1 + 0.9, "ofkeli"], [k3, "supheli"], [k3 + 0.9, "dusunceli"], [k3 + 1.4, "korkmus"]],
    "gozSok": [[0, 0], [atis + 0.3, 0], [atis + 0.4, 0.8], [opuc + 0.3, 0.8], [opuc + 0.4, 0]],
    "goz": [[0, 0], [y3 + 0.35, 0], [y3 + 0.45, 0.6], [y3 + 0.7, 0], [opuc + 0.4, 0], [opuc + 0.5, 1], [opuc + 0.85, 1], [opuc + 0.95, 0],
            [k1 + 0.35, 0], [k1 + 0.45, 0.7], [k1 + 0.75, 0], [k3, 0], [k3 + 0.2, 0.45], [k3 + 0.8, 0.45], [k3 + 1.0, 0]],
    "bak": [[0, 0.2, 0.6, 0.1], [1.9, 0.4, 0.4, 0.2],
            [gec, 1.0, 0.0, 0.7], [gec + 0.5, 0.8, 0.0, 0.5], [gec + 1.2, -1.0, 0.0, -0.7], [kapi, -1.0, 0.0, -0.7],                     # tenis seyircisi
            [y3 + 0.4, -0.3, -0.9, -0.4], [y3 + 0.8, -1.0, 0.0, -0.7],                                                                 # göz devirir
            [pij + 0.55, 0, 0, 0], [pij + 0.9, 0, 0, 0], [a1, -1.0, 0.0, -0.7], [cik + 0.4, -0.6, 0.1, -0.4],
            [cik + 1.0, 1.0, 0.0, 0.6], [atis, 1.0, -0.2, 0.6], [atis + 0.4, 1.0, -0.5, 0.6], [opuc, 1.0, 0, 0.6], [e1 + 0.5, 1.0, 0.0, 0.7],
            [k1, 0.4, 0.5, 0.2], [k1 + 1.3, 0.4, 0.6, 0.2], [k3, 0.4, 0.6, 0.2], [k3 + 0.7, 1.0, -0.1, 0.65]],
    "tilt": [[0, 0], [gec + 0.4, 5], [gec + 1.2, -5], [kapi + 0.5, -7], [pij, 0], [a1, -4], [cik, 0], [atis + 0.3, 0], [atis + 0.5, -5], [opuc + 0.4, 6], [opuc + 0.9, 0],
             [k3, 0], [k3 + 1.2, 4]],
    "egil": [[0, 0], [0.2, 4], [0.4, 0], [0.95, -4], [1.2, 0], [a1, 0], [T["A1"] + 0.6, 4], [T["A1"] + 0.9, 0], [a2, 0], [a2 + 0.3, 3], [zey, 0]],
    "konus": [konus("A1"), konus("A2")],
}
# Ece: pijamayla sağdan girer (masanın arkasından, annenin ARKASINDAN) odasına; hardal kazakla çıkar, annenin sağına geçer
ece_yer = [[0, 1120, 1560, 1180], [gec, 1120, 1560, 1180], [gec + 1.2, 175, 1560, 1180], [gec + 1.4, 170, 1555, 1120], [gec + 1.47, 170, 1555, 0],
           [cik, 170, 1555, 0], [cik + 0.18, 170, 1555, 1120], [cik + 0.35, 210, 1570, 1180], [cik + 1.35, EX, FY, SZ],
           [opuc, EX, FY, SZ], [e1 + 0.5, EX, FY, SZ], [ant, 1220, FY, SZ]]
ece_elL = [[a2, 760, 1150], [T["A2"] + 0.35, *KASE], [zey, *KASE], [atis, 770, 900], [atis + 0.2, 785, 730], [atis + 0.4, 770, 1050], [opuc, 770, 1150]]
ece_elR = [[e1, 880, 1150], [e1 + 0.3, 905, 760], [e1 + 0.55, 935, 745], [e1 + 0.8, 905, 760], [e1 + 1.05, 935, 745], [e1 + 1.3, 905, 760], [e1 + 1.7, 880, 1150]]
ECE = {
    "yer": ece_yer, "yuru": [[gec, gec + 1.45], [cik + 0.2, cik + 1.35], [e1 + 0.4, ant]],
    "dogalKol": True, "onKol": True,
    "elL": sirala(ece_elL), "elLara": [[a2 - 0.05, opuc + 0.1]],
    "elR": sirala(ece_elR), "elRara": [[e1 - 0.05, e1 + 1.8]],
    "tutL": [[0, None], [zey + 0.1, "zeytin"], [atis + 0.2, None]],
    "duygu": [[0, "korkmus"], [cik, "kararli"], [a2, "alayci"], [atis + 0.4, "mutlu"], [opuc, "mutlu"], [e1, "gulen"]],
    "goz": [[0, 0], [opuc + 0.2, 0], [opuc + 0.3, 1], [opuc + 0.7, 1], [opuc + 0.8, 0]],
    "bak": [[0, -1.0, 0.0, -0.7], [cik, 0.6, 0.0, 0.3], [cik + 1.1, -0.6, 0.3, -0.35], [a2, -0.2, 0.6, -0.1], [T["A2"] + 0.5, -0.9, 0.0, -0.5],
            [zey, -0.3, 0.6, -0.15], [atis + 0.15, 0, -0.9, 0], [atis + 0.5, -0.8, 0.0, -0.5], [opuc, -0.9, 0, -0.6], [e1 + 0.3, -0.9, 0, -0.5], [ant, -0.5, 0, -0.3]],
    "tilt": [[0, 0], [atis + 0.1, 0], [atis + 0.25, -14], [atis + 0.45, 4], [opuc, 0], [e1 + 0.2, 6], [e1 + 1.2, -4]],
    "egil": [[0, 0], [opuc, 0], [opuc + 0.3, -10], [opuc + 0.6, -10], [opuc + 0.85, 0]],
    "yanak": [[0, 0], [atis + 0.45, 0], [atis + 0.55, 1], [ant, 1]],
    "kulak": [[0, 0.6], [SON, 0.4]],
    "konus": [konus("E1")],
}
ZEYTIN_UC = {"n": "zeytin", "t0": atis + 0.2, "t1": atis + 0.5, "a": [785, 720], "b": [EX - 4, 720], "h": 230, "s": 1.25, "don": 2}
PIJ_UC = {"n": "pijama", "t0": pij + 0.25, "t1": pij + 0.55, "a": [230, 980], "b": [AX + 10, 520], "h": 140, "s": 1.25, "don": 0.6}
PIJ_AT = {"n": "pijama", "t0": a1 + 0.32, "t1": a1 + 0.75, "a": [590, 430], "b": [1260, 380], "h": 160, "s": 1.25, "don": 1.2}
SALON = {"view": "salon", "gece": True, "isik": 0, "titre": 2.5, "yukari": 270, "anne": ANNE, "ece": ECE,
         "eceId": [[0, "ece_ev"], [cik, "ece_sivil"]], "eceOnde": opuc - 0.05, "tabak1": 1.1, "tabak2": 0.3, "zeytinAl": zey + 0.4,
         "odaKapi": [[0, 0], [gec + 1.0, 0], [gec + 1.2, 1], [gec + 1.47, 1], [gec + 1.62, 0],
                     [pij + 0.1, 0], [pij + 0.22, 0.35], [pij + 0.6, 0.35], [pij + 0.7, 0], [cik, 0], [cik + 0.15, 1], [cik + 0.8, 1], [cik + 1.1, 0.15]],
         "ucan": [ZEYTIN_UC, PIJ_UC, PIJ_AT],
         "ek": [{"k": "zeytin_al", "a": zey, "b": atis}, {"k": "b7_bant", "a": k2, "b": k3}]}

# ------------------------------------------------------------------ ANTRE (kapı 380-720 x, 470-1600 y; kanat önde)
AE = [[ant, 1000, 1760, 1180], [ant + 0.7, 590, 1715, 1130], [ant + 1.05, 590, 1715, 1130], [ant + 1.55, 560, 1580, 980], [ant + 1.9, 640, 1560, 960],
      [ant + 2.15, 800, 1560, 960]]
ANTRE = {"view": "antre", "gece": True, "isik": 0, "titre": 2.5, "eceId": [[0, "ece_sivil"]],
         "ece": {"yer": AE, "yuru": [[ant, ant + 0.7], [ant + 1.05, ant + 2.2]], "dogalKol": True, "onKol": True,
                 "elR": [[ant + 0.6, 650, 1250], [ant + 0.75, 668, 1060], [ant + 1.0, 668, 1060], [ant + 1.15, 600, 1250]], "elRara": [[ant + 0.6, ant + 1.2]],
                 "duygu": [[0, "mutlu"], [ant + 1.3, "korkmus"], [ant + 1.45, "mutlu"]], "yanak": [[0, 0.7], [ant + 0.8, 0]],
                 "bak": [[0, -0.6, 0.0, -0.4], [ant + 0.7, 0.2, 0.0, 0.1], [ant + 1.3, 0.3, -0.5, 0.2], [ant + 1.6, 0.8, 0, 0.6]]},
         "eceKirp": [[ant + 1.25, 99, 380, 470, 720, 1600]],
         "kapi": [[0, 0], [ant + 0.8, 0], [ant + 1.15, 1], [ant + 2.15, 1], [ant + 2.5, 0]],
         "sahanlik": [[0, 0], [ant + 1.3, 0], [ant + 1.35, 1]],
         "kapiAlti": [[0, 0], [ant + 2.45, 0], [ant + 2.5, 1], [sn + 0.45, 1], [sn + 0.48, 0], [T["Y4"] + 1.95, 0], [T["Y4"] + 2.0, 1]]}

cam = Kamera("salon")
cam.kes(0, 540, 1000, 1.04).it(gec, 540, 990, 1.06)                    # genel: sofra, oda kapısı solda, koridor sağda
cam.it(kapi, 540, 990, 1.08)                                           # Ece annenin arkasından geçer (genel sürer)
cam.kes(kapi, 400, 860, 1.5).it(pij, 410, 850, 1.56)                   # anne + kapalı oda kapısı
cam.kes(pij, 480, 820, 1.7).it(a1, 485, 815, 1.75)                     # pijama başına düşer
cam.kes(a1, 560, 760, 2.0).it(cik, 565, 755, 2.08)                     # "otur şu masaya" (yakın)
cam.kes(cik, 540, 980, 1.12).it(a2, 560, 970, 1.18)                    # Ece çıkar, annenin arkasından sağına (genel)
cam.kes(a2, 690, 850, 1.65).it(zey, 690, 845, 1.7)                     # deste ve zeytin aynı kadrajda
cam.kes(atis, 700, 760, 1.85).it(opuc, 700, 755, 1.9)                  # zeytini havada yakalar
cam.kes(opuc, 640, 690, 2.45).it(e1, 645, 690, 2.5)                    # MUAH (iki yüz yakın)
cam.kes(e1, 700, 900, 1.45).it(ant, 720, 900, 1.4)                     # geri geri çıkar
cam.kes(k1, 560, 760, 2.0).it(k2, 560, 755, 2.08)                      # kanca: anne yalnız
cam.kes(k3, 560, 700, 2.4).it(SON, 565, 690, 2.75)                     # yüz: öfkeden endişeye (yavaş itme)
camA = Kamera("antre")
camA.kes(ant, 560, 1000, 1.12).it(sn, 560, 990, 1.16)
camA.kes(sn, 550, 1280, 1.45).it(k1, 550, 1330, 1.75)                   # kapalı kapı, altından ışık

W = lambda ad, w: T[ad] + 0.08 + w
SFX = {
    "SOF": [{"name": "efekt/el_tabak_tak", "at": 0.17, "volume": 0.7}, {"name": "efekt/el_tabak_tak", "at": 0.98, "volume": 0.8}, {"name": "efekt/el_catal_tik", "at": 1.6, "volume": 0.3}],
    "GEC": [{"name": "efekt/adim_kosu_1", "at": 0.05, "volume": 0.35}, {"name": "efekt/adim_kosu_2", "at": 0.35, "volume": 0.35}, {"name": "efekt/adim_kosu_3", "at": 0.65, "volume": 0.35},
            {"name": "efekt/adim_kosu_4", "at": 0.95, "volume": 0.35}, {"name": "efekt/b7_oda_kapi_kut", "at": 1.58, "volume": 0.7}],
    "KAPI": [{"name": "efekt/b7_kapi_arkasi_dolap", "at": 0.0, "volume": 0.7}, {"name": "efekt/el_kapi_arkasi_gum", "at": 0.85, "volume": 0.75}],
    "PIJ": [{"name": "efekt/kapi_gicirti", "at": 0.1, "volume": 0.3, "sure": 0.4}, {"name": "efekt/kumas_firlat", "at": 0.25, "volume": 0.5},
            {"name": "efekt/kumas_dus", "at": 0.55, "volume": 0.5}, {"name": "efekt/b7_oda_kapi_kut", "at": 0.7, "volume": 0.45}],
    "A1": [{"name": "efekt/kumas_firlat", "at": 0.3, "volume": 0.4}, {"name": "efekt/el_catal_tik", "at": 0.68, "volume": 0.6}],
    "CIKAR": [{"name": "efekt/kapi_gicirti", "at": 0.05, "volume": 0.3, "sure": 0.6}, {"name": "efekt/ayak_sesleri", "at": 0.2, "volume": 0.35, "sure": 1.4},
              {"name": "efekt/el_cep_hisirti", "at": 0.4, "volume": 0.35}],
    "A2": [{"name": "efekt/el_deste_salla", "at": 0.1, "volume": 0.3, "sure": 0.5}],
    "ATIS": [{"name": "efekt/el_zeytin_yakala", "at": 0.15, "volume": 0.6}, {"name": "efekt/el_cigneme", "at": 0.55, "volume": 0.35, "sure": 0.7}],
    "OPUC": [{"name": "efekt/el_opucuk", "at": 0.0, "volume": 0.65}],
    "E1": [{"name": "efekt/ayak_sesleri", "at": 0.5, "volume": 0.3, "sure": 1.2}],
    "ANT": [{"name": "efekt/el_anahtar_kap", "at": 0.3, "volume": 0.4}, {"name": "efekt/kapi_acilma", "at": 0.8, "volume": 0.45, "sure": 1.5},
            {"name": "efekt/el_otomatik_isik", "at": 1.2, "volume": 0.5}, {"name": "efekt/kapi_kapanma", "at": 2.2, "volume": 0.5, "sure": 1.2}],
    "SON": [{"name": "efekt/b7_otomatik_sonme", "at": 0.4, "volume": 0.5}],
    "Y4": [{"name": "efekt/b7_otomatik_isik_kapi", "at": 1.85, "volume": 0.6}, {"name": "efekt/b7_merdiven_kosu", "at": 2.15, "volume": 0.6}],
    "K2": [{"name": "efekt/el_kagit", "at": 0.3, "volume": 0.3, "sure": 0.6}, {"name": "efekt/el_asili_nota", "at": 0.55, "volume": 0.45}],
}


def vuruslar():
    gr = {"s": [], "a": [], "k": []}
    for ad, kim, metin, tk, gap, v in SIRA:
        if v == "antre":
            ek = b7(T[ad], camA.k, ANTRE)
            g = "a"
        else:
            ek = b7(T[ad], cam.k, SALON)
            g = "k" if T[ad] >= k1 else "s"
        if kim:
            b = {"type": "line", "who": kim, "text": metin, "emotion": "notr", "gapAfter": gap, "_take": tk, "ekle": ek}
            if ad in ("Y3", "Y4"):
                b["voiceover"] = True
        else:
            b = {"type": "insert", "dur": round(gap, 3), **ek}
        if ad in SFX:
            b["sfx"] = SFX[ad]
        gr[g].append(b)
    return gr


if __name__ == "__main__":
    g = vuruslar()
    amb = {"name": "ortam/b7_salon_aksam", "volume": 0.5}
    sahneler = [
        {"id": "s", "set": "ev_antre", "time": "gece", "title": "Sofra", "transition": "kesme", "cast": {}, "ambience": amb,
         "music": {"name": "muzik/b7_sofra_komik", "volume": 0.16, "from": 10.6}, "beats": g["s"]},
        {"id": "a", "set": "ev_antre", "time": "gece", "title": "Antre", "transition": "kesme", "cast": {}, "ambience": amb, "music": {"name": "yok"}, "beats": g["a"]},
        {"id": "k", "set": "ev_antre", "time": "gece", "title": "Kanca", "transition": "kesme", "cast": {}, "ambience": amb, "music": {"name": "yok"}, "beats": g["k"]},
    ]
    kart = {"tip": "yorum", "satirlar": ["Bir gece = bir aylık maaş.", "Sen olsan geri döner miydin?", "Yorumlara yaz."], "sure": 3.5,
            "arka": {"kind": "b7_bant", "text": []}, "etiket": "7/24 · Bölüm 8 yakında"}
    yaz("724-07-p3", "Bölüm 7 · Parça 3", sahneler, M, end_card=kart)
    print(f"P3 toplam {SON:.2f} sn + kart 3,5", {k: round(v, 2) for k, v in T.items()})
