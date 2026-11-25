import json
import math
import os
import sys
from copy import deepcopy

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KARE = 30
VF = 2 / KARE
sys.argv = [sys.argv[0]]
# sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))) # This is handled by the overall project structure or test setup
# For local execution, ensure `b8y_p1.py` and `b9_p2.py` are in a reachable path.
# Assuming this script is in `tools/`, and `b8y_p1.py` and `b9_p2.py` are also in `tools/`.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import b8y_p1 as P1  # noqa: E402
import b9_p2  # noqa: E402

EP_ID = "724-09-p3b"
VD_NEW = f"{K}/public/voice/{EP_ID}"

# --- Replicas from scenario and their durations ---
SURELER = {k: v["duration"] for k, v in json.load(open(f"{K}/public/voice/724-09-p3b/manifest.json")).items()}

TAKE = {
    "Y3_1": "B_01", "M3_1": "B_02", "E3_1": "B_03", "E3_2": "B_04", "Y3_2": "B_05", "E3_3": "B_06",
    "EL4_1": "B_07", "M4_1": "B_08", "E4_1": "B_09", "EL4_2": "B_10", "E4_2": "B_11", "EL4_3": "B_12", "M4_2": "B_13",
    "E5_1": "B_15", "EL5_1": "B_16", "EL5_2": "B_17",
    "E6_1": "B_18", "Y6_1": "B_19", "E6_2": "B_20", "EL6_1": "B_21", "EL6_2": "B_21",
}
METIN = {
    "Y3_1": "Kapıyı açın. Zahmetinizin karşılığını ödeyeceğim.", "M3_1": "Ece, sakın.", "E3_1": "Bir dakika Mert. Ben asgari ücretliyim.",
    "E3_2": "Kaç para?", "Y3_2": "Misafir başına elli bin.", "E3_3": "Elli mi? Bu kız en az iki yüz eder!",
    "EL4_1": "Bu saat orijinal mi, yakışıklı?", "M4_1": "E-evet... sanırım.", "E4_1": "Şıllık.", "EL4_2": "Asgari ücretli kızlar karışmasın, tatlım.",
    "E4_2": "Sen kime tatlım diyon, ikinci el çakma Barbie!", "EL4_3": "Çakma olan senin maaşın.", "M4_2": "Kızlar, lütfen...",
    "E5_1": "Bu kız parayı yiyor lan!", "EL5_1": "Senin cüzdanında ne var, yakışıklı?", "EL5_2": "Sen kaç para edersin, Ece?",
    "E6_1": "Seni kredi kartı borcunun vücut bulmuş hali!", "Y6_1": "Lütfen... onu bana geri verin.", "E6_2": "Ne yani, iyi taraf sen miydin lan?!",
    "EL6_1": "Aç bakalım Ece... kaç para ederse.", "EL6_2": "",
}
D = {r: SURELER[TAKE[r]] for r in TAKE}

# --- Manifest Loading (and dummy generation if not exists) ---
try:
    M = json.load(open(f"{VD_NEW}/manifest.json"))
except FileNotFoundError:
    print(f"Manifest not found at {VD_NEW}/manifest.json. Generating dummy manifest.")
    os.makedirs(VD_NEW, exist_ok=True)
    M_DUMMY = {}
    for k, v in TAKE.items():
        # Minimal words entry to prevent `ws` from failing on first run
        words = [{"w": METIN[k].split(' ')[0], "start": 0.0, "end": 0.1}] if METIN[k] else []
        M_DUMMY[v] = {"duration": D[k], "text": METIN[k], "words": words}
    with open(f"{VD_NEW}/manifest.json", "w", encoding="utf-8") as f:
        json.dump(M_DUMMY, f, ensure_ascii=False, indent=1)
    M = json.load(open(f"{VD_NEW}/manifest.json")) # Reload the newly created manifest

# --- Helper functions (from b9_p2.py) ---
R3 = lambda v: round(v, 3)
fr = lambda v: round(round(v * KARE) / KARE, 4)
W = {r: {x["w"].strip(".,?!…"): x for x in M[t]["words"]} for r, t in TAKE.items()}
def ws(r, t0, w_key):
    # Safer word cue lookup, falls back to line start + VF if word not found
    if r in W and w_key in W[r] and "start" in W[r][w_key]:
        return R3(t0 + VF + W[r][w_key]["start"])
    return R3(t0 + VF) # Fallback

def E(t, isim, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t, 3), "volume": vol, **kw}

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

def don(t, a, b, sure=0.55):
    """önce gözler (0.15 sn), sonra baş yaylı döner"""
    return [[R3(t), *a], [R3(t + 0.15), b[0], b[1], a[2]], [R3(t + 0.15 + sure), *b]]

def _ayna(q):
    for a, b_ in (("elL3", "elR3"), ("tutL", "tutR")):
        q[a], q[b_] = q.get(b_), q.get(a)
        if q[a] is None: q.pop(a)
        if q[b_] is None: q.pop(b_)
    q["bak"] = [[k[0], -k[1], k[2], -k[3]] for k in q["bak"]]

# --- Timings ---
tP3_0 = b9_p2.SON # Start time for Part 3, continuation from Part 2

# P3 Timings (~45 sn)
tY3_1 = tP3_0 + 1.0                              # Money slides + Yaratık starts
tM3_1 = fr(tY3_1 + VF + D["Y3_1"] + 0.3)
tE3_1 = fr(tM3_1 + VF + D["M3_1"] + 0.3)
tE3_2 = fr(tE3_1 + VF + D["E3_1"] + 0.2)
tY3_2 = fr(tE3_2 + VF + D["E3_2"] + 0.3)
tE3_3 = fr(tY3_2 + VF + D["Y3_2"] + 0.4)        # Elif bozulur, Mert şok
tP4_0 = fr(tE3_3 + VF + D["E3_3"] + 1.2)        # Elif actions + dialog

# P4 Timings (~45 sn)
tEL4_1 = tP4_0 + 1.0                             # Elif starts
tM4_1 = fr(tEL4_1 + VF + D["EL4_1"] + 0.3)
tE4_1 = fr(tM4_1 + VF + D["M4_1"] + 0.3)        # Ece "Şıllık"
tEL4_2 = fr(tE4_1 + VF + D["E4_1"] + 0.2)
tE4_2 = fr(tEL4_2 + VF + D["EL4_2"] + 0.3)
tEL4_3 = fr(tE4_2 + VF + D["E4_2"] + 0.3)
tM4_2 = fr(tEL4_3 + VF + D["EL4_3"] + 0.3)
t_fisilti = fr(tM4_2 + VF + D["M4_2"] + 0.5)    # Elif whispers, Mert empty gaze
tE4_end = fr(t_fisilti + 2.0)                   # Ece "...Mert?" (non-verbal reaction end)
tP5_0 = fr(tE4_end + 1.0)                       # Elif eats money

# P5 Timings (~40 sn)
tEL5_yemek = tP5_0 + 0.8                        # Elif starts eating money
tE5_1 = fr(tEL5_yemek + 1.5)                    # Ece reacts to eating
tEL5_1 = fr(tE5_1 + VF + D["E5_1"] + 0.5)       # Elif crawls towards Mert for wallet
tEL5_2 = fr(tEL5_1 + VF + D["EL5_1"] + 1.5)     # Elif in Ece's face
tP6_0 = fr(tEL5_2 + VF + D["EL5_2"] + 1.0)      # Elif eating credit card

# P6 Timings (~40 sn)
tEL6_kart_yemek = tP6_0 + 0.8                   # Elif bites card
tE6_1 = fr(tEL6_kart_yemek + 1.5)               # Ece reacts
tY6_1 = fr(tE6_1 + VF + D["E6_1"] + 0.5)
tE6_2 = fr(tY6_1 + VF + D["Y6_1"] + 0.5)
tEL6_1 = fr(tE6_2 + VF + D["E6_2"] + 0.5)       # Elif "Aç bakalım Ece..."
tEL6_2 = fr(tEL6_1 + VF + D["EL6_1"] + 0.1)     # Elif "kaç para ederse."
SON_FINAL = fr(tEL6_2 + 1.5)  # 1.5 sec hold, then kararma

# --- Character & Environment Definitions (Extend from b9_p2.py) ---
# Re-use character definitions (ECE, mertB, kizB, mertL, kizL, SPIKER)
# Ece's position (Ayakta, kapıya yaslı)
EK = b9_p2.EK
FK = b9_p2.FK
SE = EK[2] / 1000

YAN_L = b9_p2.YAN_L # Ece's default side hand positions
YAN_R = b9_p2.YAN_R
KAPI_SL = b9_p2.KAPI_SL
KAPI_SR = b9_p2.KAPI_SR
ACIK_L = b9_p2.ACIK_L
ACIK_R = b9_p2.ACIK_R

# MERT (yan view)
MK_X, MK_Y, MK_S = EK[0] - 150 * SE, EK[1] - 300 * SE, EK[2]
MERT_YAN_YER = [[tP3_0, MK_X, MK_Y, MK_S]]
MERT_YAN_YER.extend([
    [tE3_3 + 0.1, MK_X, MK_Y, MK_S], # Mert in shock
    [tEL4_1 - 0.1, MK_X, MK_Y, MK_S], # Holding watch
    [tEL5_1 + 0.5, MK_X, MK_Y + 20*SE, MK_S], # Giving wallet, slightly leaning forward
    [tEL5_2 - 0.1, MK_X, MK_Y, MK_S],
    [SON_FINAL, MK_X, MK_Y, MK_S]
])
MERT_YAN = {"id": "mert724", "onKol": True, "dogalKol": True, "yay": 1, "yer": MERT_YAN_YER,
            "duygu": [[tP3_0, "notr"], [tM3_1, "kararli"], [tE3_3 + 0.1, "sok"],
                      [tM4_1, "supheli"], [t_fisilti, "sok"],
                      [tEL5_1 + 0.1, "sok"],
                      [tE6_1, "notr"]
                     ],
            "bak": [[tP3_0, 0.0, 0.0, 0.0], [tE3_3 + 0.2, 0.2, -0.1, 0.15],
                    [tEL4_1 + 0.1, 0.2, -0.1, 0.15],
                    [t_fisilti, 0.0, -0.7, 0.0],
                    [tEL5_1, 0.0, -0.7, 0.0],
                    [tEL6_kart_yemek, 0.0, -0.7, 0.0]
                   ],
            "gozSok": [[tP3_0, 0], [tE3_3, 0.6], [t_fisilti, 1], [tEL5_1, 1], [tE6_1, 1]],
            "nefes": [[tP3_0, 0.8]],
            "elL": [[tP3_0, *YAN_L]],
            "elR": [[tP3_0, *YAN_R]],
            "tutL": [[tP3_0, None], [tEL5_1 + 0.5, "cuzdan"], [tEL5_2 - 0.1, None]],
            "egil": [[tP3_0, 0]]
           }

# ELIF (yan view)
ELK_X, ELK_Y, ELK_S = EK[0] - 25 * SE, EK[1] - 320 * SE, EK[2]
ELIF_YAN_YER = [[tP3_0, ELK_X, ELK_Y, ELK_S]]
# Elif crawling position
EL_CRAWL_X, EL_CRAWL_Y, EL_CRAWL_S = ELK_X - 100 * SE, ELK_Y + 120 * SE, EK[2] * 0.7
# Elif climbing position (on the wall/shelf)
EL_CLIMB_X, EL_CLIMB_Y, EL_CLIMB_S = ELK_X - 50 * SE, ELK_Y - 800 * SE, EK[2]
ELIF_YAN_YER.extend([
    [tE3_3, ELK_X, ELK_Y, ELK_S], # Bozulur
    [tP4_0 + 0.5, ELK_X, ELK_Y, ELK_S], # Holding watch
    [tEL4_1, ELK_X + 50*SE, ELK_Y, ELK_S], # Towards Mert for watch
    [tEL4_2, ELK_X, ELK_Y, ELK_S], # Back to normal stance
    [tEL5_yemek - 0.1, ELK_X, ELK_Y, ELK_S], # Before eating money
    [tEL5_yemek + 0.1, EL_CRAWL_X, EL_CRAWL_Y, EL_CRAWL_S], # Eating, crawling pose
    [tEL5_1, ELK_X - 50*SE, ELK_Y + 80*SE, ELK_S * 0.8], # Crawling towards Mert for wallet
    [tEL5_2, ELK_X - 10*SE, ELK_Y - 20*SE, ELK_S], # Close to Ece for final line
    [tEL6_kart_yemek - 0.1, ELK_X, ELK_Y, ELK_S], # Before climbing
    [tEL6_kart_yemek + 0.1, EL_CLIMB_X, EL_CLIMB_Y, EL_CLIMB_S], # Climbing
    [tE6_1 - 0.1, EL_CLIMB_X, EL_CLIMB_Y, EL_CLIMB_S],
    [SON_FINAL, EL_CLIMB_X, EL_CLIMB_Y, EL_CLIMB_S]
])

ELIF_YAN = {"id": "kacan724", "onKol": True, "dogalKol": True, "yay": 1, "sacDagin": 0.35, "yer": ELIF_YAN_YER,
            "duygu": [[tP3_0, "notr"], [tE3_3 - 0.1, "uzgun"], [tP4_0 + 0.5, "sahteGulus"],
                      [tEL4_2, "alayci"], [tEL4_3, "alayci"],
                      [tP5_0 + 0.5, "gulen"],
                      [tEL5_2, "sahteGulus"],
                      [tEL6_kart_yemek, "gulen"]
                     ],
            "bak": [[tP3_0, 0.0, 0.0, 0.0], [tE3_3 + 0.1, -0.2, 0.1, 0.05],
                    [tEL4_1, 0.2, -0.1, 0.15],
                    [tEL4_2, -0.2, 0.1, 0.05],
                    [tEL5_1, 0.2, -0.1, 0.15],
                    [tEL5_2, -0.2, 0.1, 0.05],
                    [tE6_1, -0.2, 0.1, 0.05],
                    [tEL6_1, 0.2, -0.1, 0.15]
                   ],
            "gozKis": [[tP3_0, 0, 0], [tE3_3 - 0.1, 0.2, 0.1], [tP4_0 + 0.5, 0.5, 0.4]],
            "egil": [[tP3_0, 0], [tEL5_yemek + 0.1, 20], [tEL5_1, 10], [tEL5_2, 0], [tEL6_kart_yemek + 0.1, -10]],
            "elL": [[tP3_0, *YAN_L], [tP4_0 + 0.8, *YAN_L], [tEL5_yemek, ACIK_L], [tEL5_1, ACIK_L], [tEL6_kart_yemek, ACIK_L], [tEL6_kart_yemek + 0.5, ACIK_L[0], ACIK_L[1] - 100*SE], [tEL6_kart_yemek + 1.0, ACIK_L[0], ACIK_L[1] - 200*SE], [SON_FINAL, ACIK_L[0], ACIK_L[1] - 200*SE]],
            "elR": [[tP3_0, *YAN_R], [tEL4_1 + 0.5, *YAN_R], [tEL5_yemek, ACIK_R], [tEL5_1, ACIK_R], [tEL6_kart_yemek, ACIK_R], [tEL6_kart_yemek + 0.5, ACIK_R[0], ACIK_R[1] - 100*SE], [tEL6_kart_yemek + 1.0, ACIK_R[0], ACIK_R[1] - 200*SE], [SON_FINAL, ACIK_R[0], ACIK_R[1] - 200*SE]],
            "tutL": [[tP3_0, None], [tP4_0 + 0.8, "paraYigin"], [tEL4_1, None],
                     [tEL5_yemek, "paraYigin"], [tE5_1 - 0.1, None],
                     [tEL6_kart_yemek, "krediKart"], [tE6_1 - 0.1, None]
                    ],
            "tutR": [[tP3_0, None], [tEL4_1 + 0.5, "saat"], [tM4_1 - 0.1, None]],
            "sacDagin": 0.35, # For hair movement clue
            "tirnak": [[tP6_0 + 0.1, "notr"], [tEL6_kart_yemek + 0.5, "altin"]] # Gold claws
           }

# ECE character (extending b9_p2.ECE)
ECE_NEW = deepcopy(b9_p2.ECE)
ECE_NEW["yer"].extend([
    [tE3_3 + 0.1, *EK], [tP4_0, *EK], [tEL4_1, *EK], [tEL4_2, *EK], [tE4_2, *EK], [tEL4_3, *EK], [tM4_2, *EK],
    [tE4_end - 0.1, *EK], [tP5_0, *EK], [tE5_1 - 0.1, *EK], [tEL5_2 - 0.1, *EK], [tE6_1 - 0.1, *EK],
    [tEL6_1 - 0.1, *EK], [tEL6_2, *EK], [SON_FINAL, *EK]
])
ECE_NEW["duygu"].extend([
    [tE3_1, "notr"], [tE3_3, "sok"],
    [tE4_1, "ofkeli"], [tE4_2, "ofkeli"],
    [tE5_1, "saskin"], [tEL5_2, "dehset"],
    [tE6_1, "ofkeli"], [tE6_2, "saskin"],
    [tEL6_1, "dehset"], [tEL6_2, "dehset"]
])
ECE_NEW["gozSok"].extend([
    [tE3_3, 0.7], [tE4_1, 0], [tEL5_2 - 0.1, 0.7], [tEL6_1 - 0.1, 0.9]
])
ECE_NEW["tilt"].extend([
    [tE3_3, 0], [tE4_1, 5], [tEL5_2 - 0.1, -8], [tEL6_1 - 0.1, -10]
])
ECE_NEW["egil"].extend([
    [tE3_3, 0], [tE4_1, 0], [tE4_2, 5], [tEL5_2 - 0.1, 0], [tEL6_1 - 0.1, 0]
])
ECE_NEW["elL"].extend([
    [tEL6_1 + 0.1, *KAPI_SL]
])
ECE_NEW["elR"].extend([
    [tEL6_1 + 0.1, *KAPI_SR]
])
ECE_NEW["tutL"].append([tEL6_1 + 0.1, "kapiKol"])
ECE_NEW["konus"] = [{"t": R3(t0 + VF), "cues": M[TAKE[r]]["mouth"]} for r, t0 in (
    ("E3_1", tE3_1), ("E3_2", tE3_2), ("E3_3", tE3_3),
    ("E4_1", tE4_1), ("E4_2", tE4_2),
    ("E5_1", tE5_1),
    ("E6_1", tE6_1), ("E6_2", tE6_2)
)]

MERT_YAN["konus"] = [{"t": R3(t0 + VF), "cues": M[TAKE[r]]["mouth"]} for r, t0 in (
    ("M3_1", tM3_1),
    ("M4_1", tM4_1), ("M4_2", tM4_2)
)]

ELIF_YAN["konus"] = [{"t": R3(t0 + VF), "cues": M[TAKE[r]]["mouth"]} for r, t0 in (
    ("EL4_1", tEL4_1), ("EL4_2", tEL4_2), ("EL4_3", tEL4_3),
    ("EL5_1", tEL5_1), ("EL5_2", tEL5_2),
    ("EL6_1", tEL6_1)
)]

# Sort all character timelines
for char_obj in [ECE_NEW, MERT_YAN, ELIF_YAN]:
    for key in ["yer", "elL", "elR", "bak", "duygu", "tilt", "egil", "gozKis", "goz", "gozSok", "nefes", "yerOtur", "tutL", "tutR", "ezil", "konus", "sacDagin", "tirnak"]:
        if key in char_obj and isinstance(char_obj[key], list):
            char_obj[key] = sorted(char_obj[key], key=lambda x: x["t"] if isinstance(x, dict) else x[0])


# FPS Character Definitions
MZ = b9_p2.MZ # Mert's Z depth from b9_p2.py
KZ = b9_p2.KZ # Kiz's Z depth from b9_p2.py

# FPS P3: money slides
FPS_MONEY_KAM = [[tP3_0, 0.0, 0.8, -1.0, -180, 0, 0], [tY3_1 + 0.5, 0.05, 0.82, -1.2, -180, 0, 0], [tM3_1 - 0.1, 0.05, 0.82, -1.2, -180, 0, 0]]
FPS_P3 = {"mekan": "depo", "kacis": {"kar": []}, "kam": FPS_MONEY_KAM, "fov": [[tP3_0, 1.0]], "sallan": [[0,0,0]]}

# FPS P4: Elif whispers to Mert
FPS_WHISPER_KAM = [[t_fisilti, -0.05, 1.7, -1.0, 0, 0, 0], [tE4_end, -0.05, 1.7, -1.0, 0, 0, 0]]
MERT_FPS_WHISPER = deepcopy(b9_p2.mertL) # Re-using mertL as a base (standing, dehset)
MERT_FPS_WHISPER["q"]["duygu"] = [[0, "sok"]]
MERT_FPS_WHISPER["q"]["gozSok"] = [[0, 1.0]]
MERT_FPS_WHISPER["q"]["nefes"] = [[0, 3.5]]
ELIF_FPS_WHISPER = deepcopy(b9_p2.kizL) # Re-using kizL as a base
ELIF_FPS_WHISPER["q"]["duygu"] = [[0, "sahteGulus"]]
ELIF_FPS_WHISPER["q"]["egil"] = [[0, -10]] # Bending to whisper
ELIF_FPS_WHISPER["q"]["elL3"] = [[0, -0.27, 0.66, MZ + 0.25]]
ELIF_FPS_WHISPER["q"]["elR3"] = [[0, 0.3, 0.42, KZ + 0.25]]
_ayna(MERT_FPS_WHISPER["q"])
_ayna(ELIF_FPS_WHISPER["q"])
FPS_P4 = {"mekan": "depo", "kacis": {"kar": [MERT_FPS_WHISPER, ELIF_FPS_WHISPER]}, "kam": FPS_WHISPER_KAM,
          "fov": [[t_fisilti, 1.0]], "sallan": [[0,0,0]]}

# FPS P5: Elif eating money & crawling
FPS_EATING_CRAWLING_KAM = [[tP5_0, 0.0, 0.4, -0.8, -180, 0, 0], [tE5_1 - 0.1, 0.05, 0.45, -1.0, -180, 0, 0]]
ELIF_FPS_EAT = deepcopy(b9_p2.kizL)
ELIF_FPS_EAT["q"]["duygu"] = [[0, "gulen"]]
ELIF_FPS_EAT["q"]["egil"] = [[0, -20]]
ELIF_FPS_EAT["q"]["yerOtur"] = [[0, 1]]
ELIF_FPS_EAT["q"]["elL3"] = [[0, -0.27, 0.66, MZ + 0.25], [tEL5_1 + 0.5, 0.05, 0.7, MZ+0.3]]
ELIF_FPS_EAT["q"]["elR3"] = [[0, 0.3, 0.42, KZ + 0.25], [tEL5_1 + 0.5, 0.3, 0.75, KZ+0.2]]
ELIF_FPS_EAT["q"]["tutL"] = [[tP5_0 + 0.5, "paraYigin"], [tE5_1 - 0.1, None]]
ELIF_FPS_EAT["q"]["tutR"] = [[tP5_0 + 0.5, "paraYigin"], [tE5_1 - 0.1, None]]
_ayna(ELIF_FPS_EAT["q"])
FPS_P5 = {"mekan": "depo", "kacis": {"kar": [ELIF_FPS_EAT]}, "kam": FPS_EATING_CRAWLING_KAM,
          "fov": [[tP5_0, 1.0]], "sallan": [[0,0,0]], "titreme": [[tP5_0 + 2.0, 0.5], [tP5_0 + 2.5, 0.1]]}

# FPS P6: Elif climbing
FPS_CLIMBING_KAM = [[tP6_0, -0.05, 1.7, -1.0, 0, 0, 0], [tE6_1 - 0.1, -0.05, 1.7, -1.0, 0, 0, 0]]
ELIF_FPS_CLIMB = deepcopy(b9_p2.kizL)
ELIF_FPS_CLIMB["q"]["duygu"] = [[0, "gulen"]]
ELIF_FPS_CLIMB["q"]["egil"] = [[0, -10]]
ELIF_FPS_CLIMB["q"]["sacDagin"] = 0.8
ELIF_FPS_CLIMB["q"]["yerOtur"] = [[0, 0]]
ELIF_FPS_CLIMB["q"]["elL3"] = [[0, -0.27, 0.66, MZ + 0.25], [tP6_0 + 0.5, -0.2, 0.8, MZ+0.4], [tP6_0 + 1.0, -0.1, 0.9, MZ+0.5]]
ELIF_FPS_CLIMB["q"]["elR3"] = [[0, 0.3, 0.42, KZ + 0.25], [tP6_0 + 0.5, 0.2, 0.85, KZ+0.4], [tP6_0 + 1.0, 0.1, 0.95, KZ+0.5]]
ELIF_FPS_CLIMB["q"]["tutL"] = [[tP6_0 + 0.5, "krediKart"], [tE6_1 - 0.1, None]]
ELIF_FPS_CLIMB["q"]["tutR"] = [[tP6_0 + 0.5, "krediKart"], [tE6_1 - 0.1, None]]
ELIF_FPS_CLIMB["q"]["tirnak"] = [[tP6_0 + 0.1, "notr"], [tEL6_kart_yemek + 0.5, "altin"]]
_ayna(ELIF_FPS_CLIMB["q"])
FPS_P6 = {"mekan": "depo", "kacis": {"kar": [ELIF_FPS_CLIMB]}, "kam": FPS_CLIMBING_KAM,
          "fov": [[tP6_0, 1.0]], "sallan": [[0,0,0]], "titreme": [[tP6_0 + 2.0, 0.5], [tP6_0 + 2.5, 0.1]]}


# --- ORTAK parameters (from b9_p2.py) ---
ORTAK_NEW = deepcopy(b9_p2.ORTAK)
ORTAK_NEW["saat"] = [[0, "02:57"], [SON_FINAL - 1.0, "02:59"]]
ORTAK_NEW["kar"]["yan"]["ece"] = ECE_NEW
ORTAK_NEW["kar"]["yan"]["mert724"] = MERT_YAN
ORTAK_NEW["kar"]["yan"]["kacan724"] = ELIF_YAN
ORTAK_NEW["kar"]["tv"] = {} # No TV in this part

# Kapi Alt (money, then Elif eating it)
GX, GW, PX, PW = b9_p2.GX, b9_p2.GW, b9_p2.PX, b9_p2.PW
ORTAK_NEW["kapiAlt"] = deepcopy(b9_p2.KA)
ORTAK_NEW["kapiAlt"].extend([
    [tP3_0, 0.0, GX, GW, PX, PW, 0.0], # Money not visible initially
    [tP3_0 + 0.5, 0.0, 0.74, 0.22, 0.93, 0.13, 1.0], # Money appears
    [tY3_1 - 0.1, 0.0, 0.74, 0.22, 0.93, 0.13, 1.0],
    [tY3_1 + 0.3, 0.0, 0.74, 0.22, 0.93, 0.13, 1.0],
    [tP4_0 - 0.5, 0.0, 0.74, 0.22, 0.93, 0.13, 1.0], # Money visible till Elif drops it
    [tP4_0 + 0.5, 0.0, 0.74, 0.22, 0.93, 0.13, 0.0], # Money gone after Elif drops it
    [tEL5_yemek - 0.1, 0.0, 0.74, 0.22, 0.93, 0.13, 0.0], # Money appears for eating
    [tEL5_yemek + 0.1, 0.0, 0.74, 0.22, 0.93, 0.13, 1.0], # Money appears for eating
    [tEL5_yemek + 0.5, 0.0, 0.74, 0.22, 0.93, 0.13, 0.7],
    [tE5_1 - 0.1, 0.0, 0.74, 0.22, 0.93, 0.13, 0.0], # Money eaten
])
ORTAK_NEW["kapiAlt"].sort(key=lambda x: x[0])

# Flor (light flickering)
ORTAK_NEW["flor"].extend([
    [tP5_0 + 1.5, 0.85], [tP5_0 + 1.8, 0.2], [tP5_0 + 2.0, 0.9],
    [tP5_0 + 2.8, 0.4], [tP5_0 + 3.0, 0.85],
    [tP6_0 + 1.5, 0.85], [tP6_0 + 1.8, 0.2], [tP6_0 + 2.0, 0.9],
    [tP6_0 + 2.8, 0.4], [tP6_0 + 3.0, 0.85],
    [SON_FINAL - 0.5, 0.85], [SON_FINAL, 0.1]
])
ORTAK_NEW["flor"].sort(key=lambda x: x[0])

# Camera (CAMY for yan)
CAMY_NEW = deepcopy(b9_p2.CAMY)
CAMY_NEW.append([tP3_0, *P1.kirp("yan", EK[0] + 30, FK[1] + 300, 1.75)]) # Re-use end of P2 shot
CAMY_NEW.append([tM3_1 - 0.1, *P1.kirp("yan", EK[0] - 140, FK[1] + 45, 2.05)]) # Ece close-up (reaction)
CAMY_NEW.append([tE3_3 + 0.1, *P1.kirp("yan", ELK_X + 20, ELK_Y + 100, 2.7)]) # Elif's bozulur (close up on Elif)
CAMY_NEW.append([tP4_0 + 0.1, *P1.kirp("yan", (MK_X + ELK_X)/2, (MK_Y + ELK_Y)/2 + 100, 2.0)]) # Elif & Mert around door
CAMY_NEW.append([tE4_1 - 0.1, *P1.kirp("yan", ECE_NEW["yer"][-1][1] - 10, ECE_NEW["yer"][-1][2] + 40, 2.7)]) # Ece "Şıllık" close-up
CAMY_NEW.append([tEL4_2 - 0.1, *P1.kirp("yan", ELK_X + 20, ELK_Y + 80, 2.5)]) # Elif "Asgari ücretli" close-up
CAMY_NEW.append([tE5_1 - 0.1, *P1.kirp("yan", ECE_NEW["yer"][-1][1] - 10, ECE_NEW["yer"][-1][2] + 40, 2.7)]) # Ece's reaction
CAMY_NEW.append([tEL5_2 - 0.1, *P1.kirp("yan", ECE_NEW["yer"][-1][1], ECE_NEW["yer"][-1][2], 3.5)]) # Elif in Ece's face (closer shot on Ece for her reaction)
CAMY_NEW.append([tE6_1 - 0.1, *P1.kirp("yan", ECE_NEW["yer"][-1][1] - 10, ECE_NEW["yer"][-1][2] + 40, 2.7)]) # Ece's reaction
CAMY_NEW.append([tEL6_1 - 0.1, *P1.kirp("yan", ECE_NEW["yer"][-1][1], ECE_NEW["yer"][-1][2], 2.0)]) # Ece hand on door handle
CAMY_NEW.append([SON_FINAL, *P1.kirp("yan", ECE_NEW["yer"][-1][1], ECE_NEW["yer"][-1][2], 2.0)]) # Final shot of Ece
ORTAK_NEW["cam"]["yan"] = CAMY_NEW
ORTAK_NEW["cam"]["tv"] = []

# Kurgu (yan/fps switches)
KURGU_NEW = deepcopy(b9_p2.KURGU)
KURGU_NEW.extend([
    [tP3_0, "fps"],
    [tM3_1 - 0.1, "yan"],
    [tP4_0, "yan"],
    [t_fisilti, "fps"],
    [tE4_end, "yan"],
    [tP5_0, "fps"],
    [tE5_1 - 0.1, "yan"],
    [tEL5_2 - 0.1, "yan"],
    [tP6_0, "fps"],
    [tE6_1 - 0.1, "yan"],
    [SON_FINAL, "yan"]
])
ORTAK_NEW["kurgu"] = KURGU_NEW
ORTAK_NEW["karart"] = [[tP3_0, 1], [tP3_0 + 0.5, 0], [SON_FINAL - 1.0, 0], [SON_FINAL, 1]]

# Override music from P2. New music will be inserted via beats.
ORTAK_NEW["music"] = {"name": "yok"}


# --- Beats Assembly ---
BEATS = []

# -------------------- P3 BEATS (Rüşvet) --------------------
BEATS.append(ins(tP3_0, tY3_1, fps(FPS_P3, tP3_0), sfx=[E(0.0, "efekt/b8y_parilti", 0.6), E(0.0, "efekt/b8y4_adim_yavas", 0.4, sure=0.5)]))
BEATS.append(line("Y3_1", "yaratik724b", tY3_1, tM3_1, ORTAK_NEW["kar"], label=""))
BEATS.append(line("M3_1", "mert724", tM3_1, tE3_1, ORTAK_NEW["kar"]))
BEATS.append(line("E3_1", "ece_sivil", tE3_1, tE3_2, ORTAK_NEW["kar"]))
BEATS.append(line("E3_2", "ece_sivil", tE3_2, tY3_2, ORTAK_NEW["kar"]))
BEATS.append(line("Y3_2", "yaratik724b", tY3_2, tE3_3, ORTAK_NEW["kar"], label=""))
BEATS.append(line("E3_3", "ece_sivil", tE3_3, tP4_0, ORTAK_NEW["kar"]))

# -------------------- P4 BEATS (Kıskançlık krizi) --------------------
BEATS.append(ins(tP4_0, tEL4_1, ORTAK_NEW["kar"], sfx=[E(0.0, "muzik/b9_kiskanc", 0.3, sure=round(tP5_0-tP4_0, 3), zarf=[[0,0],[0.5,1],[round(t_fisilti-tP4_0-0.5, 3),1],[round(t_fisilti-tP4_0,3),0.2],[round(tP5_0-tP4_0,3),0]])]))
BEATS.append(line("EL4_1", "kacan724", tEL4_1, tM4_1, ORTAK_NEW["kar"]))
BEATS.append(line("M4_1", "mert724", tM4_1, tE4_1, ORTAK_NEW["kar"]))
BEATS.append(line("E4_1", "ece_sivil", tE4_1, tEL4_2, ORTAK_NEW["kar"]))
BEATS.append(line("EL4_2", "kacan724", tEL4_2, tE4_2, ORTAK_NEW["kar"]))
BEATS.append(line("E4_2", "ece_sivil", tE4_2, tEL4_3, ORTAK_NEW["kar"]))
BEATS.append(line("EL4_3", "kacan724", tEL4_3, tM4_2, ORTAK_NEW["kar"]))
BEATS.append(line("M4_2", "mert724", tM4_2, t_fisilti, ORTAK_NEW["kar"]))
BEATS.append(ins(t_fisilti, tE4_end, fps(FPS_P4, t_fisilti)))

# -------------------- P5 BEATS (Para yiyen kadın) --------------------
BEATS.append(ins(tP5_0, tE5_1, fps(FPS_P5, tP5_0), sfx=[E(0.0, "efekt/b8y3_surunme", 0.4, sure=2.0), E(0.5, "efekt/b8y4_oksuruk", 0.7), E(0.5, "muzik/b9_dehset", 0.4, sure=round(tP6_0-tP5_0, 3), zarf=[[0,0],[0.5,1],[round(tEL5_2-tP5_0-0.5,3),1],[round(tEL5_2-tP5_0,3),0.5],[round(tP6_0-tP5_0,3),0.8]])]))
BEATS.append(line("E5_1", "ece_sivil", tE5_1, tEL5_1, ORTAK_NEW["kar"]))
BEATS.append(line("EL5_1", "kacan724", tEL5_1, tEL5_2, ORTAK_NEW["kar"]))
BEATS.append(line("EL5_2", "kacan724", tEL5_2, tP6_0, ORTAK_NEW["kar"]))

# -------------------- P6 BEATS (Bekçi) --------------------
BEATS.append(ins(tP6_0, tE6_1, fps(FPS_P6, tP6_0), sfx=[E(0.0, "efekt/b8y3_surunme", 0.4, sure=2.0), E(0.5, "efekt/b8y_bam", 0.7), E(0.0, "muzik/b9_dehset", 0.8, sure=round(SON_FINAL-tP6_0, 3), zarf=[[0,0.8],[round(SON_FINAL-tP6_0-1.0,3),0.8],[round(SON_FINAL-tP6_0,3),1]])]))
BEATS.append(line("E6_1", "ece_sivil", tE6_1, tY6_1, ORTAK_NEW["kar"]))
BEATS.append(line("Y6_1", "yaratik724b", tY6_1, tE6_2, ORTAK_NEW["kar"], label=""))
BEATS.append(line("E6_2", "ece_sivil", tE6_2, tEL6_1, ORTAK_NEW["kar"]))
BEATS.append(line("EL6_1", "kacan724", tEL6_1, SON_FINAL, ORTAK_NEW["kar"]))


# --- Final JSON Output ---
if __name__ == "__main__":
    man = {k: v for k, v in M.items() if not k.startswith("i_")}
    for j, bb in enumerate(BEATS):
        if bb["type"] == "line":
            man[f"i_{j + 1:02d}"] = M[TAKE[bb.pop("_r")]]
    json.dump(man, open(f"{VD_NEW}/manifest.json", "w"), ensure_ascii=False, indent=1)

    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Market · Aslan & Elif", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.24}, # Re-using ambiance zarf from P2
           "music": ORTAK_NEW["music"], "beats": BEATS}
    ep = {"series": "724", "seriesTitle": "7/24", "episode": EP_ID, "episodeNo": 9, "title": "Bölüm 9 · Parça 3-6", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{EP_ID}.json", "w"), ensure_ascii=False, indent=1)
    
    print(f"Bölüm 9 · Parça 3-6 Oluşturuldu: {EP_ID}.json")
    print(f"Toplam süre: {SON_FINAL - tP3_0:.2f} saniye. (Beklenen: 2:40-2:55)")
    print(f"Başlangıç: {tP3_0:.2f}, Bitiş: {SON_FINAL:.2f}")

