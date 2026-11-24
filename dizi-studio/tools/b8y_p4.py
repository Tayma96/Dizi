"""7/24 B8 (yeni) Parça 4: "Merak etme ben yanındayım" → depo kapısı PAT → kaçan kadın raflar arasına düşer, Ece çığlıkla Mert'e
yapışır → "Peşimdeee!" → Mert koşup depo kapısını kapatır → (doğaçlama) kapıya arkadan dev bir darbe.
Kullanım: python3 tools/b8y_p4.py  -> public/episodes/724-08y-p4.json
Metin: bolumler.md "Bölüm 8 (YENİ), Parça 4" (AYNEN). FPS yok. Sesler: public/voice/724-08y-p4 (yoksa tahmini süreler, sessiz önizleme).
"""
import json, os, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
VFROM = 2 / FPS
sys.argv = [sys.argv[0]]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import b8y_p1 as P1  # noqa: E402  (yan açı izdüşümü, yerleşimler, ortak çizim)

VD = f"{K}/public/voice/724-08y-p4"
M = json.load(open(f"{VD}/manifest.json")) if os.path.exists(f"{VD}/manifest.json") else {}
TAKE = {"M1": "M1a_01", "E1": "E1a_01", "K1": "K1a_01"}
if os.path.exists(f"{VD}/secim.json"):
    TAKE.update(json.load(open(f"{VD}/secim.json")))
TAHMIN = {"M1": 2.4, "E1": 1.5, "K1": 1.8}
METIN = {"M1": ("ece_sivil", "Merak etme ben yanındayım"), "E1": ("ece_sivil", "Aaaaa!"), "K1": ("kacan724", "Peşimdeee!")}
SES_VAR = all(TAKE[r] in M for r in TAKE)

SIRA = [("GIRIS", None, 0.35), ("M1", "M1", 0.0), ("PAT", None, 0.75), ("E1", "E1", 0.05), ("DUS", None, 1.25),
        ("K1", "K1", 0.25), ("YAKLAS", None, 2.6), ("FPS", None, 13.0)]


def sure(r):
    return M[TAKE[r]]["duration"] if SES_VAR else TAHMIN[r]


T, DUR, fr = {}, {}, 0
for ad, r, d in SIRA:
    T[ad] = fr / FPS
    n = round(((sure(r) + d) if r else d) * FPS)
    DUR[ad] = n / FPS
    fr += n
SON_T = fr / FPS
V = lambda r: (T[r] + VFROM, T[r] + VFROM + sure(r))
konus = lambda r: {"t": round(T[r] + VFROM, 3), "cues": M[TAKE[r]]["mouth"]} if SES_VAR else {"t": round(T[r] + VFROM, 3), "cues": []}
sirala = lambda k: sorted(k, key=lambda q: q[0])

g0 = T["GIRIS"]; m1a, m1b = V("M1"); p0 = T["PAT"]; e1a, e1b = V("E1"); d0 = T["DUS"]; k1a, k1b = V("K1")
ka0 = T["YAKLAS"]; fp0 = T["FPS"]
t_pat = p0 + 0.08                 # kapı pat diye açılır (cümle biterken)
t_carp = d0 + 0.62                # kadın rafa çarpar, düşer
t_kapan = 999                     # (iptal) Mert kapıyı kapatmaz
t_darbe = 999                     # (iptal)

# ------------------------------------------------------------------ kamera
SINIR = {"kasa": (0, 1080, 0, 1920), "tezgah": (0, 1080, 0, 1920), "yan": (0, 1080, 0, 1920), "reyon": (-200, 1280, -200, 2120)}
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


EX, EYUZ = P1.EX, P1.EYUZ
KX, KY, KS = P1.KX, P1.KY, P1.KS
MX2, MY, MS = 730, P1.MY, P1.MS
MYUZ = MY - 765 * MS / 1000
yI = P1.yI
YSB = P1.YSB
YK, YD = P1.YK, P1.YD
# yan açıda yerler
YM_TZ = YSB                                    # Mert tezgâhın arkasında (Sabri'nin yeri)
YM_KAPI = yI(1.35, 1.75, 1.8)                  # kapının önü
YK_ES = yI(1.48, 1.85)                         # kadın kapı eşiğinde
YK_KAC = [1350, 1900, 1500]                    # kadraj sağından çıkar (kameraya yakın)

# ------------------------------------------------------------------ KARAKTERLER
A_MERT = (0.55, -0.12, 0.32)
ECE_TZ = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True, "yer": [[0, EX, P1.EY, P1.ES]],
    "elL": [[0, EX - 64, 1194]], "elR": [[0, EX + 80, 1194]],
    # Ece dingin, hafif gülümseyerek Mert'e güven verir (kendisi korkarken; ironi)
    "duygu": [[0, "korkmus"], [m1a - 0.1, "mutlu"]],
    "bak": sirala([[0, *A_MERT], [SON_T, *A_MERT]]),
    "tilt": [[0, -3], [m1a + 0.6, 4], [m1b, 6]], "egil": [[0, 0]],
    "nefes": [[0, 2.2], [m1a + 0.8, 1.4]], "goz": [[0, 0], [m1a + 1.0, 0], [m1a + 1.08, 0.9], [m1a + 1.16, 0]],
    "parilti": [[0, 0, 0], [m1a, 0, 0], [m1a + 0.4, 0.6, 0.6]], "kulak": [[0, 0.3]], "konus": [konus("M1")],
}
# kasa: Ece önde (çığlık, Mert'e yapışır), Mert tezgâhın arkasında
MERT_KS = {
    "onKol": True, "dogalKol": True, "yer": [[0, MX2, MY, MS], [ka0, MX2, MY, MS]],
    "duygu": [[0, "notr"], [e1a, "saskin"], [e1a + 0.5, "kararli"]],
    "bak": sirala([[0, -0.35, 0.1, -0.25], [e1a, 0.6, -0.1, 0.45], [e1a + 0.45, -0.35, 0.25, -0.25], [e1b, 0.65, -0.1, 0.5]]),
    "tilt": [[0, -2], [e1a, 4], [e1b, -3]], "egil": [[0, 0]],
}
ECE_KS = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": sirala([[0, KX + 60, KY, KS], [e1a, KX + 60, KY, KS], [e1a + 0.25, KX + 190, KY - 40, KS], [SON_T, KX + 190, KY - 40, KS]]),
    "egil": [[0, 0], [e1a, 0], [e1a + 0.25, 9]],
    "elR": sirala([[0, KX + 300, 1820], [e1a + 0.05, KX + 300, 1820], [e1a + 0.28, 690, 1290], [SON_T, 694, 1296]]),
    "elRara": [[e1a, 99]], "tutR": [[0, None]],
    "duygu": [[0, "korkmus"], [e1a, "dehset"]],
    "bak": sirala([[0, 0.7, -0.1, 0.55], [e1a, 0.75, -0.2, 0.6], [e1a + 0.3, 0.6, -0.15, 0.55]]),
    "tilt": [[0, 4], [e1a, -6], [e1b, -2]], "gozSok": [[0, 0], [e1a, 0], [e1a + 0.1, 0.9]], "kulak": [[0, 0.3]],
    "konus": [konus("E1")],
}
# yan: Mert (tezgâhta → kapıya koşar, kapatır, sırtını dayar), kadın (kapıdan fırlar)
MERT_YAN = {
    "onKol": True, "dogalKol": True, "yer": [[0, *YM_TZ]],
    "duygu": [[0, "notr"], [t_pat, "saskin"], [ka0, "korkmus"]],
    "bak": sirala([[0, -0.3, 0, -0.2], [t_pat, 0.6, -0.1, 0.45], [ka0, -0.4, 0.05, -0.3], [ka0 + 1.2, 0.3, 0, 0.2], [SON_T, 0.3, 0, 0.2]]),
    "gozSok": [[0, 0], [t_pat, 0], [t_pat + 0.1, 0.6], [t_pat + 0.5, 0]], "tilt": [[0, 0], [ka0, -4]], "egil": [[0, 0]],
}
# yan: Ece titreyerek, yavaş adımlarla tezgâhın önünden depoya doğru yürür, kadrajdan sağa çıkar
ECE_YAN = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True,
    "yer": sirala([[0, 233, 1604, 957], [ka0 + 0.1, 233, 1604, 957], [ka0 + 2.5, 1250, 1680, 1060]]),
    "yuru": [[ka0 + 0.1, ka0 + 2.5]], "egil": [[0, -6]],
    "duygu": [[0, "korkmus"]], "bak": [[0, 0.6, -0.1, 0.45]], "tilt": [[0, -3]],
    "kolL": [[0, 8, 25]], "kolR": [[0, 8, 25]],
    "nefes": [[0, 2.2]], "kulak": [[0, 0.3]],
}
KADIN_YAN = {
    "onKol": True, "dogalKol": True,
    "yer": sirala([[0, YK_ES[0], YK_ES[1], 1], [t_pat - 0.01, YK_ES[0], YK_ES[1], 1], [t_pat, *YK_ES], [t_pat + 0.65, *YK_KAC], [t_pat + 0.66, YK_KAC[0], YK_KAC[1], 1]]),
    "yuru": [[t_pat, t_pat + 0.66]], "egil": [[0, -14]],
    "duygu": [[0, "dehset"]], "bak": [[0, 0.5, 0, 0.4]], "sacDagin": 1,
}
# reyon: kadın sağdan girer, rafa çarpar, düşer; sonra doğrulup kapıya bakar: "Peşimdeee!"
KADIN_RY = {
    "onKol": True, "dogalKol": True,
    "yer": sirala([[0, 1300, 1700, 820], [d0, 1300, 1700, 820], [t_carp, 960, 1700, 820], [t_carp + 0.35, 900, 1730, 820], [SON_T, 900, 1730, 820]]),
    "yuru": [[d0, t_carp]],
    "egil": sirala([[0, -12], [t_carp - 0.05, -14], [t_carp + 0.35, -84], [k1a - 0.35, -84], [k1a + 0.1, -38], [SON_T, -36]]),
    "duygu": [[0, "dehset"], [t_carp + 0.1, "aci"], [k1a - 0.3, "dehset"]],
    "bak": sirala([[0, -0.4, 0, -0.3], [t_carp + 0.2, 0, 0.3, 0], [k1a - 0.3, 0.75, -0.2, 0.55], [SON_T, 0.75, -0.2, 0.55]]),
    "gozSok": [[0, 0.6], [t_carp, 0.6], [t_carp + 0.1, 0], [k1a - 0.2, 0.9]],
    "elR": sirala([[0, 1400, 1400], [k1a - 0.35, 700, 1700], [k1a + 0.15, 760, 1300], [SON_T, 760, 1300]]),
    "elRara": [[k1a - 0.4, 99]], "tutR": [[0, None], [k1a + 0.1, "isaret"]], "isaretAci": 70,
    "sacDagin": 1, "tears": 0.4, "konus": [konus("K1")],
}

# ------------------------------------------------------------------ KURGU
ECE_Y = (EX, EYUZ + 300 / 2.1, 2.1)
kes(g0, "tezgah", *ECE_Y)                                      # 1 Ece tek (korkmuş, gözü Mert'te): Mert "Merak etme ben yanındayım"
it(p0, "tezgah", ECE_Y[0], ECE_Y[1] - 8, ECE_Y[2] + 0.2)
kes(p0, "yan", 640, 1000, 1.35)                                # 2 YAN: depo kapısı PAT diye açılır, kadın fırlar (Mert tezgâhta)
it(e1a, "yan", 660, 1010, 1.42)
kes(e1a, "kasa", 480, 1120, 1.3)                               # 3 kasa: Ece çığlık atıp Mert'e yapışır
it(d0, "kasa", 500, 1110, 1.42)
kes(d0, "reyon", 600, 1150, 1.0)                               # 4 REYON: kadın raflar arasına fırlar, rafa çarpıp düşer
it(k1a - 0.1, "reyon", 560, 1350, 1.2)
kes(k1a - 0.1, "reyon", 520, 1330, 1.9)                        # 5 kadın yerde, doğrulup kapıya bakar: "Peşimdeee!"
it(ka0, "reyon", 530, 1320, 2.05)
kes(ka0, "yan", 600, 1050, 1.25)                              # 6 YAN: Ece yavaşça, titreyerek depo kapısına yürür; Mert endişeyle bakar
it(fp0, "yan", 680, 1040, 1.38)
# 7 FPS (b8_fps "depo"): Ece'nin gözünden koridor → kapının girişi → başını sola çevirir: yaratık twerk atıyor

ECE_KASA_ARA = [[e1a - 0.01, d0]]
DEPO = [[0, 0], [t_pat - 0.02, 0], [t_pat + 0.12, 1.05], [t_pat + 0.25, 0.96], [t_kapan - 0.25, 0.96], [t_kapan, 0], [SON_T, 0]]
SARS = [[0, 0], [t_pat - 0.01, 0], [t_pat, 0.7], [t_pat + 0.3, 0], [t_carp - 0.01, 0], [t_carp + 0.25, 0.5], [t_carp + 0.5, 0],
        [t_kapan - 0.01, 0], [t_kapan, 0.6], [t_kapan + 0.3, 0], [t_darbe - 0.01, 0], [t_darbe, 1.2], [t_darbe + 0.5, 0]]
DUSEN = [[t_carp + 0.05, 860, 1640, 1, 40], [t_carp + 0.1, 930, 1700, 0, -70], [t_carp + 0.15, 1000, 1760, 1, 95], [t_carp + 0.22, 820, 1790, 0, 20]]
ORTAK = {"saat": [[0, "00:03"]], "kapi": [[0, 0]], "flor": [[0, 0.85]], "cizir": [], "lamba": [[0, 0]], "titre": {"tezgah": 1.3, "kasa": 1.2, "yan": 1.0, "reyon": 1.6},
         "blok": [[0, 560]], "gazete": [[0, 1300]], "gazeteTz": [[0, -700]], "kagitTz": [[0, 1]], "elAra": [],
         "kalemMasa": [[0, 640, 1]], "eceKasaAra": ECE_KASA_ARA, "odak": [[0, 0]], "depo": DEPO, "depoKol": [[0, 0]], "sars": SARS,
         "dusen": DUSEN, "anime": {}, "animeMerkez": {}}
KAR = {"tezgah": {"ece": ECE_TZ}, "kasa": {"mert": MERT_KS, "ece": ECE_KS}, "yan": {"mert": MERT_YAN, "kadin": KADIN_YAN, "ece": ECE_YAN}, "reyon": {"kadin": KADIN_RY}}


def blob(t0, t1):
    vs = set()
    for i, (t, v) in enumerate(KURGU):
        tn = KURGU[i + 1][0] if i + 1 < len(KURGU) else 1e9
        if t < t1 and tn > t0:
            vs.add(v)
    p = {"t0": round(t0, 3), "kurgu": KURGU, **ORTAK, "cam": {v: CAM[v] for v in vs}, "kar": {v: KAR[v] for v in vs if KAR[v]}}
    if "tezgah" in vs:
        p.update({"cizim": P1.CIZIM, "bas": P1.BAS})
    return {"kind": "b8_market", "text": [json.dumps(p, ensure_ascii=False, separators=(",", ":"))]}


def E(ad, isim, t, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t - T[ad], 3), "volume": vol, **kw}


SFX = {"PAT": [E("PAT", "b8y_kapi_hiz", t_pat - 0.03, 0.9), E("PAT", "b8y3_adim", t_pat, 0.6, sure=0.8)],
       "DUS": [E("DUS", "b8y3_adim", d0, 0.6, sure=0.65), E("DUS", "b8y4_raf_dusus", t_carp - 0.05, 0.85)],
       "YAKLAS": [E("YAKLAS", "b8y4_adim_yavas", ka0 + 0.1, 0.55), E("YAKLAS", "b8y4_ece_nefes", ka0 + 0.2, 0.6)]}
# FPS (yerel zaman, sn): 0-3,2 koridor · 3,5-4,75 baş sola · 4,75 twerk (sırtı dönük) · 8,7 yana bakar, radyo kapanır ·
# 9,7 doğrulur · 10,3-11,3 elini ağzına götürüp öksürür (bozuntuya vermeden) · 11,5 Ece'ye döner, ağzı açılır · 11,7-12,9 koşar → kararma
G = lambda t: fp0 + t
FPS_SFX = [E("FPS", "b8y4_adim_yavas", G(0), 0.6, sure=3.2), E("FPS", "b8y4_ece_nefes", G(0.3), 0.55),
           E("FPS", "muzik/b8y4_twerk", G(0), 0.08, sure=3.9), E("FPS", "muzik/b8y4_twerk", G(3.9), 0.75, kirp=3.9, sure=4.85),
           E("FPS", "b8y4_radyo_kapan", G(8.72), 0.6), E("FPS", "b8y4_oksuruk", G(10.4), 0.85),
           E("FPS", "b8y3_ciglik", G(11.55), 0.75), E("FPS", "b8y3_kalk_kos", G(11.7), 0.6), E("FPS", "b8y4_ece_ciglik", G(11.85), 0.8)]
FPS = {"t0": 0, "mekan": "depo",
       "kam": [[0, 0.1, 1.55, -0.4, 0, 2, 0], [3.2, -0.25, 1.52, 3.3, -4, 3, -1], [3.5, -0.35, 1.5, 3.42, -8, 3, 0],
               [4.4, -0.45, 1.5, 3.45, -70, 2, 1], [4.75, -0.48, 1.5, 3.45, -90, 1, 0], [8.7, -0.5, 1.5, 3.45, -91, 0, 0],
               [11.4, -0.5, 1.5, 3.45, -90, -6, 0], [11.7, -0.5, 1.5, 3.45, -90, -13, 0], [12.9, -0.42, 1.42, 3.5, -88, -26, 4]],
       "sallan": [[0, 0.4, 1.5], [3.2, 0.4, 1.5], [3.4, 0, 1.5]],
       "titreme": [[0, 0.5], [4.4, 0.6], [4.8, 0.1], [11.5, 0.1], [11.7, 1.0]],
       "sars": [[0, 0], [11.55, 0], [11.6, 0.5], [12.0, 0.2], [12.9, 0.8]],
       "fov": [[0, 1], [4.75, 1], [8.7, 1.18], [9.2, 1.25], [11.0, 1.25], [11.45, 1.0], [12.9, 0.9]],
       "twerk": [[0, 0], [3.9, 0], [4.1, 1], [8.6, 1], [8.8, 0]], "radyo": [[0, 0], [3.9, 0], [4.0, 1], [8.72, 1], [8.75, 0]],
       "kalp": [[0, 0.5], [3.9, 0.7], [4.4, 0], [9.2, 0], [9.4, 0.6], [12.9, 1]],
       "kirmizi": [[0, 0], [11.5, 0], [11.8, 0.9]], "karart": [[0, 0], [12.75, 0], [12.95, 1]],
       "depoYaratik": {"yer": [[0, -3.3, 3.15, 0], [11.7, -3.3, 3.15, 0], [12.9, -1.95, 3.35, 12]],
                       "bak": [[0, 0], [8.8, 0], [9.2, 1], [10.2, 0.6]], "dogrul": [[0, 0], [9.7, 0], [10.2, 1]],
                       "oksur": [[0, 0], [10.3, 0], [10.45, 1], [11.2, 1], [11.35, 0]],
                       "on": [[0, 0], [11.45, 0], [11.5, 1]], "boy": [[0, 1], [11.65, 1], [12.0, 0.58]], "agiz": [[0, 0], [11.5, 0], [11.8, 1]], "seg": [[0, 0], [11.5, 0], [11.55, 1], [11.9, 0.3]]}}


if __name__ == "__main__":
    ep_id = "724-08y-p4"
    man, beats = {}, []
    for i, (ad, r, d) in enumerate(SIRA):
        if ad == "FPS":
            beats.append({"type": "insert", "dur": round(DUR[ad], 4), "kind": "b8_fps", "text": [json.dumps(FPS, separators=(",", ":"))], "sfx": FPS_SFX})
            continue
        ek = blob(T[ad], T[ad] + DUR[ad])
        if r and SES_VAR:
            who, metin = METIN[r]
            b = {"type": "line", "who": who, "text": metin, "emotion": "notr", "gapAfter": d, "ekle": ek}
            man[f"i_{i + 1:02d}"] = M[TAKE[r]]
        else:
            b = {"type": "insert", "dur": round(DUR[ad], 4), **ek}
        if SFX.get(ad):
            b["sfx"] = SFX[ad]
        beats.append(b)
    if SES_VAR:
        tum = {k: v for k, v in M.items() if not k.startswith("i_")}
        tum.update(man)
        json.dump(tum, open(f"{VD}/manifest.json", "w"), ensure_ascii=False, indent=1)
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Market · depo kapısı", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.5}, "music": {"name": "yok"}, "beats": beats}
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 8, "title": "Bölüm 8 · Parça 4", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON_T:.2f} sn  ses: {'var' if SES_VAR else 'YOK (tahmini süreler)'}")
