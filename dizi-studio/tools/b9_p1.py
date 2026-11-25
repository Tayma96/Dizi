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
F1 = 1.9                                   # FPS 1: saldırı, dönüş, koşu başı
m1d = M[TAKE["M1"]]["duration"]
F2 = round(round((m1d + 0.02) * KARE) / KARE, 4)   # FPS 2 (Mert'in repliği boyunca): kapıdan geçiş
L0 = F1 + F2                               # YAN başlar
YAN = 4.4
SON = L0 + YAN
m1a = F1 + VFROM
w = {x["w"].strip(".,"): x for x in M[TAKE["M1"]]["words"]}

# ------------------------------------------------------------------ FPS (dünya: koridor x -0.9..0.9, z -1..7; market z < -1)
CEZ = 3.45                                 # Ece depo kapısının önünde (B8 sonu)
t_don0, t_don1 = 0.5, 0.85                 # başını çevirip döner
t_kos = 0.8
t_esik = 3.05                              # kapı boşluğundan geçer (z -1)
KAM = [[0, -0.5, 1.5, CEZ, -90, 6, 0], [0.45, -0.48, 1.47, CEZ + 0.05, -88, 4, 3],
       [t_don0 + 0.12, -0.42, 1.5, CEZ, -128, 6, -4], [t_don1, -0.2, 1.52, CEZ - 0.2, -178, 4, 2],
       [1.3, -0.05, 1.56, CEZ - 0.95, -180, 3, 0], [t_esik, 0.0, 1.58, -1.0, -180, 2, 0],
       [L0 - 0.35, 0.05, 1.58, -1.85, -178, 6, 1], [L0, 0.05, 1.58, -2.0, -176, 8, 0]]
FPSP = {"mekan": "depo", "kacis": {}, "kam": KAM,
        "sallan": [[0, 0, 3.2], [t_kos, 0, 3.2], [t_kos + 0.15, 1, 3.3], [t_esik + 0.2, 1, 3.3], [L0 - 0.15, 0.25, 2.6], [L0, 0.15, 2.6]],
        "sac": [[0, 9], [t_don0, 9], [t_don0 + 0.01, 1.25], [t_don1, -1.25], [t_don1 + 0.01, 9]],
        "titreme": [[0, 0.8], [t_don1, 0.3], [t_esik, 0]],
        "sars": [[0, 0.4], [0.3, 0.6], [t_don0, 0.2], [t_don1, 0]],
        "fov": [[0, 0.92], [t_don0, 0.95], [t_don1, 1.0]],
        "kalp": [[0, 1], [t_esik, 0.8], [L0, 0.4]], "kirmizi": [[0, 0.8], [t_don1, 0.3], [t_esik, 0]],
        "flas": [[0, 0], [t_esik - 0.05, 0], [t_esik + 0.05, 0.12], [t_esik + 0.45, 0]],
        "depoYaratik": {"yer": [[0, -2.7, 3.3, 12], [0.6, -1.75, 3.38, 17], [1.0, -1.3, 3.42, 20]], "on": [[0, 1]], "boy": [[0, 0.62]],
                        "agiz": [[0, 1]], "seg": [[0, 0.6], [0.15, 1], [0.4, 0.3]]}}

# Mert (diz çökmüş) ve kaçan kız (yerde, başı Mert'in göğsünde) — reyonların arasında, kapının ilerisinde
MZ = -3.9
mert = {"id": "mert724", "w": [-0.42, -0.55, MZ], "boy": 1.75,
        "q": {"onKol": True, "dogalKol": True, "duygu": [[0, "uzgun"]], "bak": [[0, -0.45, 0.45, -0.35]], "tilt": [[0, -9]],
              "elL3": [0.18, 0.62, MZ + 0.05], "elR3": [-0.18, 0.86, MZ + 0.08],
              "konus": [{"t": round(m1a, 3), "cues": M[TAKE["M1"]]["mouth"]}], "yay": 1}}
kiz = {"id": "kacan724", "w": [0.12, -0.85, MZ + 0.1], "boy": 1.65,
       "q": {"onKol": True, "dogalKol": True, "duygu": [[0, "uzgun"]], "bak": [[0, 0.5, 0.2, 0.45]], "egil": [[0, 15]], "tilt": [[0, 10]],
             "goz": [[0, 0.85]], "tears": 0.5, "sacDagin": 1, "nefes": [[0, 2.2]]}}
FPSP["kacis"] = {"kar": [mert, kiz]}

# ------------------------------------------------------------------ YAN: Ece kapıyı çarpar, yaslanır, nefes nefese
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


y0 = L0
t_bak = y0 + 0.12                          # başını kapıya çevirir
t_tut = y0 + 0.3                           # kolu yakalar
t_pat = y0 + 0.5                           # kapı ÇARPILIR
t_yas = y0 + 0.85                          # sırtını kapıya verir
t_nef = y0 + 1.05                          # birden nefes nefese
DEPO = [[0, 1], [t_tut, 0.92], [t_tut + 0.08, 0.6], [t_pat - 0.04, 0.12], [t_pat, 0], [t_pat + 0.06, 0.025], [t_pat + 0.13, 0], [SON, 0]]
kl = lambda a: kol(a)
ECE = {
    "id": "ece_sivil", "onKol": True, "dogalKol": True, "yay": 1,
    "yer": [[0, *EB], [t_tut, *EB], [t_pat, EB[0] + 6, EB[1], EB[2]], [t_yas, *EY], [SON, *EY]],
    "yuru": [[t_pat + 0.02, t_yas]],
    "ezil": [[t_yas - 0.01, 0], [t_yas + 0.04, 0.05], [t_yas + 0.14, -0.02], [t_yas + 0.24, 0]],
    "elL": [[0, EB[0] - 95 * S, EB[1] - 640 * S], [t_bak, EB[0] - 95 * S, EB[1] - 640 * S], [t_tut, *kl(0.92)], [t_tut + 0.08, *kl(0.6)],
            [t_pat - 0.04, *kl(0.12)], [t_pat, *kl(0)], [t_yas, EY[0] - 120 * S, EY[1] - 420 * S], [t_nef, EY[0] - 130 * S, EY[1] - 400 * S],
            [SON, EY[0] - 128 * S, EY[1] - 402 * S]],
    "elR": [[0, EB[0] + 110 * S, EB[1] - 600 * S], [t_pat, EB[0] + 100 * S, EB[1] - 560 * S], [t_yas, EY[0] + 120 * S, EY[1] - 420 * S],
            [t_nef + 0.3, EY[0] + 40 * S, EY[1] - 640 * S], [SON, EY[0] + 44 * S, EY[1] - 636 * S]],      # eli göğsünde (kalp)
    "duygu": [[0, "dehset"], [t_yas, "korkmus"], [t_nef, "agizAcik"]],
    "bak": [[0, -0.3, 0, -0.35], [t_bak, 0.75, -0.05, 0.7], [t_pat + 0.05, 0.75, -0.05, 0.7], [t_yas, 0.05, -0.3, 0.05],
            [t_nef + 1.2, 0.0, -0.45, 0.0], [t_nef + 1.9, -0.1, 0.1, -0.05], [SON, -0.1, 0.12, -0.05]],
    "tilt": [[0, -6], [t_bak, 6], [t_pat, 8], [t_yas, -3], [t_nef, -7], [SON, -6]],
    "egil": [[0, 4], [t_tut, -3], [t_pat, -6], [t_yas, -2], [t_nef, -1.5], [SON, -1.5]],
    "goz": [[0, 0], [t_nef + 0.25, 0], [t_nef + 0.45, 1], [t_nef + 1.4, 1], [t_nef + 1.6, 0]],
    "gozSok": [[0, 0.8], [t_yas, 0.4], [t_nef, 0]],
    "nefes": [[0, 2.4], [t_nef - 0.01, 2.4], [t_nef, 4.2]],
    "sacDagin": 0.6,
}
CAM = {"yan": []}
KURGU = [[round(y0, 3), "yan"]]
P1.SINIR["yan"] = (0, 1080, 0, 1920)
fy = lambda q, k=0.765: q[1] - k * q[2]
CAM["yan"] = [[round(y0, 3)] + P1.kirp("yan", EB[0] - 40, fy(EB, 0.5), 1.35),
              [round(t_yas, 3)] + P1.kirp("yan", EY[0] - 20, fy(EY, 0.55), 1.45),
              [round(SON, 3)] + P1.kirp("yan", EY[0], fy(EY, 0.72), 2.15)]
ORTAK = {"t0": 0, "saat": [[0, "00:04"]], "kapi": [[0, 0]], "flor": [[0, 0.85]], "cizir": [[t_pat, t_pat + 0.3]], "lamba": [[0, 0]],
         "titre": {"yan": 1.0}, "eceArkada": True, "odak": [[0, 0]], "depo": DEPO, "depoKol": [[0, 0]], "toz": [[0, 0]],
         "sars": [[0, 0], [t_pat - 0.01, 0], [t_pat, 1.1], [t_pat + 0.4, 0]], "anime": {}, "animeMerkez": {},
         "fx": [[t_nef + 0.5, "ter", "yan", EY[0] + 95 * S, fy(EY, 0.86), 0.85, 2.2]]}


def E(t, isim, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t, 3), "volume": vol, **kw}


SFX1 = [E(0, "b8y3_yaratik", 0.75), E(0.05, "b8y4_ece_ciglik", 0.8), E(t_don0, "b8y3_donus", 0.65), E(t_kos, "b8y3_kalk_kos", 0.6),
        E(t_kos + 0.1, "b8y3_adim", 0.75, sure=F1 - t_kos), E(t_kos, "b8y3_nefes_kosu", 0.6, sure=F1 - t_kos), E(0, "kalp_atisi", 0.35, sure=F1)]
SFX2 = [E(0, "b8y3_adim", 0.55, sure=t_esik - F1 + 0.3), E(0, "b8y3_nefes_kosu", 0.45, sure=F2),
        E(0.25, "b8y3_yaratik", 0.3, kirp=1.0), E(0, "kalp_atisi", 0.25, sure=F2)]
SFX3 = [E(t_pat - y0 - 0.02, "b8y4_kapi_pat", 1.0), E(t_nef - y0, "b8y4_ece_nefes", 0.85), E(t_nef - y0 + 1.6, "b8y4_ece_nefes", 0.7)]

if __name__ == "__main__":
    ep_id = "724-09-p1"
    fps2 = dict(FPSP, t0=F1)
    beats = [
        {"type": "insert", "dur": F1, "kind": "b8_fps", "text": [json.dumps(dict(FPSP, t0=0), separators=(",", ":"))], "sfx": SFX1},
        {"type": "line", "who": "mert724", "text": METIN["M1"][1], "emotion": "notr", "gapAfter": round(F2 - m1d, 4),
         "ekle": {"kind": "b8_fps", "text": [json.dumps(fps2, separators=(",", ":"))]}, "sfx": SFX2},
        {"type": "insert", "dur": YAN, "kind": "b8_market", "sfx": SFX3,
         "text": [json.dumps({**ORTAK, "t0": round(y0, 3), "kurgu": KURGU, "cam": CAM, "kar": {"yan": {"ece": ECE}}}, ensure_ascii=False, separators=(",", ":"))]},
    ]
    man = {k: v for k, v in M.items() if not k.startswith("i_")}
    man["i_02"] = M[TAKE["M1"]]
    json.dump(man, open(f"{VD}/manifest.json", "w"), ensure_ascii=False, indent=1)
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Depo · kaçış", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.35}, "music": {"name": "yok"}, "beats": beats}
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 9, "title": "Bölüm 9 · Parça 1", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON:.2f} sn  (FPS1 {F1}, FPS2 {F2}, YAN {YAN})")
