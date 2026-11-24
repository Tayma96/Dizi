"""7/24 B7 Parça 2 v3 (ayna, gece). Senarist planı: docs/diziler/724/raporlar/b7-senarist.md "PARÇA 2".
Kullanım: python3 tools/b7v3p2.py json
FPS ayna görünümü: gördüğümüz Ece'nin YANSIMASI (yatayda ters çizilir: sivilce ve P1'de kızaran kulak aynada doğru tarafta).
Vuruşlar: aynaya gelir, musluğu açar, kızaran kulağına dokunur → sivilceye dik dik bakar, iç çeker → iki avuç su, ikincisi ağzına
kaçar (yanak şişer, "pfff") → S1 parmak sallayarak kendine çıkışır → duraksama: gözler kapıya kayar, el çenede, dudak kıvrılır →
S2 parmakla sayar, "olummmm"da elleri yanaklarında → elleri yüzünden aşağı süzer, yüz kararlı ("maske indi") → S3 başını sallar →
çıkar; ayna boş, su akıyor; gerçek eli kadrajın altından girip musluğu kapatır; salondan tabak sesi (P3'e köprü).
Kullanıcının replikleri AYNEN ("Bölüm 7, Parça 2").
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from b7v3_ortak import Kamera, b7, man_yukle, yaz, sirala  # noqa: E402

M = man_yukle("724-07-p2/cekim", "724-07-yeni")
sure = lambda tk: M[tk]["duration"]
SIRA = [
    ("GIR", None, None, None, 1.3),
    ("SIV", None, None, None, 1.1),
    ("YIKA", None, None, None, 1.8),
    ("S1", "ece_ev", "Saçmalama Ece ölüyodun lan canından daha mı değerli", "S1a_01", 0.1),
    ("DUR", None, None, None, 1.7),
    ("S2", "ece_ev", "Günlük bu kadar çalışsam 1 haftalık maaşım 1 yıllık maaşım yapıyo olummmm", "S2b_01", 0.25),
    ("MASKE", None, None, None, 1.25),
    ("S3", "ece_ev", "Gidip Sabri abiye olanları bir sorayım en iyisi", "S3b_01", 0.25),
    ("CIK", None, None, None, 2.2),
]
T, t = {}, 0.0
for ad, kim, metin, tk, gap in SIRA:
    T[ad] = t
    t += (sure(tk) + gap) if tk else gap
SON = t
gir, siv, yika, s1, dur, s2, mas, s3, ck = (T[x] for x in ("GIR", "SIV", "YIKA", "S1", "DUR", "S2", "MASKE", "S3", "CIK"))
TK = {"S1": "S1a_01", "S2": "S2b_01", "S3": "S3b_01"}
WI = lambda ad, i: T[ad] + 0.08 + M[TK[ad]]["words"][i]["start"]   # i. kelimenin anı
konus = lambda ad: {"t": T[ad] + 0.08, "cues": M[TK[ad]]["mouth"]}
OL = WI("S2", 11)  # "olummmm"

# ÇİZİM (çevirmeden ÖNCEKİ) koordinatları; ayna ekseni x=540. Kızaran kulak çizimde solda → aynada sağda.
X, Y, SZ = 540, 1790, 1320
S = SZ / 1000
YUZ = (540, 1790 - 765 * S)          # (540, 780)
KUL = (540 - 92 * S, 1790 - 742 * S)  # sol kulak (çizim) (419, 811)
LAV_L, LAV_R = (470, 1430), (610, 1430)   # eller lavaboda (tezgâhın arkasında, görünmez)
YZ_L, YZ_R = (500, 810), (580, 810)       # avuçlar yüzde
YAN_L, YAN_R = (450, 830), (630, 830)     # avuçlar yanaklarda
el_L = [
    [0, 455, 1300], [0.45, *LAV_L], [0.75, *LAV_L],                                    # musluğu açar
    [0.85, 430, 1000], [1.05, KUL[0] - 6, KUL[1] + 8], [1.2, KUL[0] - 2, KUL[1] + 4], [1.32, KUL[0] - 6, KUL[1] + 8], [1.55, 455, 1300],   # kulağa dokunur
    [yika, *LAV_L], [yika + 0.25, *YZ_L], [yika + 0.42, 495, 790], [yika + 0.6, *LAV_L], [yika + 0.8, *LAV_L], [yika + 0.98, *YZ_L], [yika + 1.15, 490, 840],
    [yika + 1.35, 460, 1300], [dur + 0.55, 460, 1300],
    [s2 - 0.1, 460, 1300], [OL - 0.15, 470, 1150], [OL + 0.05, *YAN_L], [mas, *YAN_L],
    [mas + 0.15, *YZ_L], [mas + 0.4, 505, 800], [mas + 0.75, 500, 900], [mas + 1.05, 460, 1300],
]
el_R = [
    [0, 625, 1300], [yika, *LAV_R], [yika + 0.25, *YZ_R], [yika + 0.42, 585, 790], [yika + 0.6, *LAV_R], [yika + 0.8, *LAV_R], [yika + 0.98, *YZ_R], [yika + 1.15, 590, 840],
    [yika + 1.35, 625, 1300], [s1 + 0.1, 625, 1300],
    # S1: ıslak işaret parmağını sallar (her vurguda)
    [WI("S1", 0) - 0.1, 660, 930], [WI("S1", 1), 690, 920], [WI("S1", 2), 650, 930], [WI("S1", 3), 690, 918], [WI("S1", 4), 652, 930], [WI("S1", 5), 688, 920],
    [WI("S1", 7), 660, 928], [dur, 650, 960], [dur + 0.35, 625, 1300],
    # duraksama: el çenede (düşünür)
    [dur + 0.6, 625, 1300], [dur + 0.95, 575, 905], [s2, 575, 905],
    # S2: parmakla sayar (yüzün önünde, sağda)
    [WI("S2", 0), 650, 960], [WI("S2", 4) - 0.1, 660, 930], [WI("S2", 5), 665, 925], [WI("S2", 7) - 0.1, 668, 930], [WI("S2", 9), 662, 920], [WI("S2", 10), 666, 930],
    [OL - 0.15, 620, 1150], [OL + 0.05, *YAN_R], [mas, *YAN_R],
    [mas + 0.15, *YZ_R], [mas + 0.4, 575, 800], [mas + 0.75, 580, 900], [mas + 1.05, 625, 1300],
]
ECE = {
    "yer": [[0, X - 60, Y - 60, SZ - 120], [0.6, X, Y, SZ], [siv, X, Y, SZ], [siv + 0.35, X, Y + 40, SZ + 90], [siv + 1.0, X, Y + 40, SZ + 90], [siv + 1.1, X, Y, SZ],
            [OL, X, Y, SZ], [OL + 0.12, X, Y - 18, SZ], [OL + 0.24, X, Y, SZ], [OL + 0.36, X, Y - 18, SZ], [OL + 0.48, X, Y, SZ],
            [ck + 0.15, X, Y, SZ], [ck + 0.75, X - 620, Y, SZ]],
    "yuru": [[0, 0.6], [ck + 0.1, ck + 0.8]],
    "dogalKol": True, "onKol": True, "elLara": [[-99, ck + 0.12]], "elRara": [[-99, ck + 0.12]],
    "elL": sirala(el_L), "elR": sirala(el_R),
    "tutR": [[0, None], [WI("S1", 0) - 0.1, "isaret"], [dur + 0.2, None], [WI("S2", 4) - 0.1, "isaret"], [WI("S2", 7) - 0.1, "iki"], [OL - 0.1, None]],
    "duygu": [[0, "yorgun"], [0.95, "aci"], [1.5, "notr"], [siv + 0.25, "supheli"], [yika, "notr"], [yika + 1.15, "saskin"], [s1, "ofkeli"],
              [dur + 0.3, "dusunceli"], [dur + 1.1, "alayci"], [s2, "dusunceli"], [WI("S2", 7), "saskin"], [OL, "gulen"], [mas + 0.6, "kararli"]],
    "goz": [[0, 0.35], [0.6, 0.2], [0.95, 0.5], [1.4, 0], [siv + 0.8, 0], [siv + 0.95, 0.6], [siv + 1.1, 0],
            [yika + 0.2, 0], [yika + 0.25, 1], [yika + 0.6, 1], [yika + 0.7, 0], [yika + 0.95, 1], [yika + 1.3, 1], [yika + 1.4, 0],
            [mas + 0.1, 0], [mas + 0.2, 1], [mas + 0.7, 1], [mas + 0.85, 0]],
    "gozSok": [[0, 0], [WI("S2", 7), 0], [WI("S2", 8), 0.7], [OL, 1], [mas, 1], [mas + 0.2, 0]],
    "bak": [[0, 0, 0.1, 0], [0.9, 0.5, 0.0, 0.15], [1.4, 0, 0, 0], [siv + 0.2, -0.35, 0.3, -0.05], [siv + 1.0, -0.35, 0.3, -0.05], [yika, 0, 0.2, 0],
            [s1, 0, 0, 0], [dur + 0.3, 0, 0, 0], [dur + 0.6, -0.85, 0.05, -0.2], [dur + 1.3, -0.85, 0.05, -0.2], [s2, 0, -0.15, 0],
            [WI("S2", 2), 0.4, -0.6, 0.08], [WI("S2", 5), -0.4, -0.6, -0.08], [WI("S2", 8), 0.3, -0.5, 0.06], [OL, 0, 0, 0],
            [s3, 0, 0, 0], [WI("S3", 1), 0, 0.25, 0], [WI("S3", 2), 0, -0.05, 0], [WI("S3", 4), 0, 0.25, 0], [WI("S3", 6), 0, -0.05, 0],
            [ck, 0, 0, 0], [ck + 0.15, -0.9, 0.1, -0.8]],
    "tilt": [[0, 0], [0.95, -6], [1.4, 0], [siv + 0.3, 5], [siv + 1.0, 5], [siv + 1.1, 0], [s1, 0], [WI("S1", 1), -5], [WI("S1", 3), 5], [WI("S1", 5), -4], [dur, 0],
             [dur + 0.6, 6], [s2, 0], [OL, 0], [OL + 0.15, -7], [OL + 0.3, 7], [OL + 0.45, -6], [OL + 0.6, 0], [s3, 0], [WI("S3", 1), 4], [WI("S3", 4), -3], [ck, 0]],
    "yanak": [[0, 0], [yika + 1.15, 0], [yika + 1.25, 1], [yika + 1.6, 1], [yika + 1.72, 0]],
    "islak": [[0, 0], [yika + 0.35, 0], [yika + 0.5, 1], [ck, 0.9], [SON, 0.7]],
    "kulak": [[0, 0.85], [SON, 0.75]],
    "sacDagin": True,
    "konus": [konus("S1"), konus("S2"), konus("S3")],
}
ORT = {"view": "ayna", "gece": True, "isik": 0, "titre": 2.5, "aynala": 540, "ece": ECE,
       "su": [[0.75, ck + 1.45]], "musEl": [[ck + 0.85, 760, 2150], [ck + 1.25, 585, 1500], [ck + 1.45, 560, 1495], [ck + 1.6, 560, 1495], [ck + 2.0, 760, 2150]],
       "musElAra": [[ck + 0.85, ck + 2.05]]}

cam = Kamera("ayna")
cam.kes(0, 540, 900, 1.22).it(siv, 540, 880, 1.28)               # aynaya gelir (orta)
cam.kes(siv, 560, 800, 2.0).it(yika, 565, 790, 2.15)             # sivilceye bakış (yakın)
cam.kes(yika, 540, 900, 1.35).it(s1, 540, 890, 1.4)              # yüz yıkama (orta)
cam.kes(s1, 560, 860, 1.6).it(dur, 560, 845, 1.78)               # kendine çıkışır (yaklaş)
cam.kes(dur, 560, 820, 2.25).it(s2, 560, 815, 2.35)              # duraksama (yakın)
cam.kes(s2, 560, 880, 1.5).it(OL - 0.05, 560, 870, 1.6)          # hesap (orta)
cam.kes(OL, 540, 800, 2.3).it(mas, 540, 795, 2.4)                # "olummmm" (yakın)
cam.kes(mas, 540, 850, 1.75).it(s3, 540, 845, 1.82)              # maske indi
cam.kes(s3, 540, 880, 1.45).it(ck, 540, 870, 1.55)               # karar
cam.kes(ck, 540, 1060, 1.12).it(SON, 540, 1060, 1.15)            # çıkış: boş ayna, musluk

SFX = {
    "GIR": [{"name": "efekt/ayak_sesleri", "at": 0.0, "volume": 0.25}, {"name": "efekt/el_yuz_yikama", "at": 0.75, "volume": 0.25}],
    "SIV": [{"name": "efekt/ic_cekme", "at": 0.8, "volume": 0.6}],
    "YIKA": [{"name": "efekt/el_yuz_yikama", "at": 0.2, "volume": 0.7}, {"name": "efekt/el_tukurme", "at": 1.55, "volume": 0.6}],
    "DUR": [{"name": "efekt/tik", "at": 0.25, "volume": 0.2}, {"name": "efekt/tik", "at": 0.8, "volume": 0.18}],
    "S2": [{"name": "efekt/el_kaching", "at": OL - s2, "volume": 0.3}],
    "CIK": [{"name": "efekt/ayak_sesleri", "at": 0.1, "volume": 0.25}, {"name": "efekt/fincan_tikirti", "at": 1.5, "volume": 0.35},
            {"name": "efekt/tezgah_carpma", "at": 1.9, "volume": 0.3}],
}


def vuruslar():
    V = []
    for ad, kim, metin, tk, gap in SIRA:
        ek = b7(T[ad], cam.k, ORT)
        if kim:
            b = {"type": "line", "who": kim, "text": metin, "emotion": "notr", "gapAfter": gap, "_take": tk, "ekle": ek}
        else:
            b = {"type": "insert", "dur": round(gap, 3), **ek}
        if ad in SFX:
            b["sfx"] = SFX[ad]
        V.append(b)
    return V


if __name__ == "__main__":
    beats = vuruslar()
    sc = {"id": "a", "set": "banyo_ayna", "time": "gece", "title": "Ayna", "transition": "kesme", "cast": {},
          "music": {"name": "muzik/banyo_komik", "volume": 0.12}, "ambience": {"name": "ortam/oda_tonu", "volume": 0.3}, "beats": beats}
    yaz("724-07-p2", "Bölüm 7 · Parça 2", [sc], M)
    print(f"P2 toplam {SON:.2f} sn", {k: round(v, 2) for k, v in T.items()}, "olum", round(OL, 2))
