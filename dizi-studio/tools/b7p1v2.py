"""7/24 B7 Parça 1, v2 (elle kurgulanmış "b7_banyo" sahnesi). Örnek: ilk ~12 sn (anne çamaşır, para, "Eceeee").
Kullanım: python3 tools/b7p1v2.py [json | kare ad:sn ...]
"""
import json, os, subprocess, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CK = f"{K}/public/voice/724-07/cekim"
FPS = 30
MAN = json.load(open(f"{CK}/manifest.json"))
TAR = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"


def sure(take):
    return MAN[take]["duration"]


# ---------------------------------------------------------------- zaman çizelgesi (sahne zamanı)
T = {}
t = 0.0
T["acilis"] = t; t += 3.6                      # anne çamaşır: gömlek, çorap koklama
T["A01"] = t; t += sure("A01a_01") + 0.15      # "Eceee uyan kız artık"
T["kot"] = t; t += 1.25                        # kotu alır, cebine bakar
T["cep"] = t; t += 1.5                         # yakın: cepten deste
T["A02"] = t; t += sure("A02a_01") + 0.1       # sayar: "yuhh"
T["sok"] = t; t += 0.9                         # şok → öfke
T["A03"] = t; t += sure("A03b_01") + 0.45      # "Eceeee"
SON = t

# anne: makine solda (kapak 449,1385), sepet sağda (760-960 x, 1700 üst)
a0, a1 = T["A01"], T["kot"]
# anne makinenin sağında; sepet sağ kalçada (sağ kol sarar); sol el sepetten alır, makineye atar
BAS, MAK = [680, 1300], [470, 1395]
ANNE = {
    "yer": [[0, 610, 1880, 1290]], "sepet": [[0, 1]],
    "egil": [[0, 0], [0.55, 0], [0.8, -6], [1.05, -6], [1.3, 0], [2.3, 0], [2.42, 8], [2.6, 6], [2.75, 8], [2.9, 6], [3.1, 2], [3.3, 0], [a1, 0], [a1 + 0.9, 0]],
    "kolR": [[0, 28, -75]],
    "elL": [[0, *BAS], [0.45, 690, 1270], [0.8, *MAK], [1.05, 480, 1380], [1.35, *BAS], [1.55, 690, 1270],
            [1.95, 600, 905], [2.3, 600, 905], [2.45, 400, 1060], [2.95, 395, 1070], [3.12, 515, 1235], [3.35, 560, 1285], [a1, 640, 1250],
            [a1 + 0.3, *BAS], [a1 + 0.6, 690, 1260], [a1 + 1.0, 600, 1160]],
    "bukumL": 1, "elLara": [[-99, a0], [a1, 99]],
    "tutL": [[0, None], [0.45, "gomlek"], [0.85, None], [1.5, "corap"], [3.2, None], [a1 + 0.55, "kot"]],
    "duygu": [[0, "notr"], [1.95, "igrenmis"], [3.4, "notr"], [a0, "ofkeli"], [a0 + 2.3, "notr"]],
    "tilt": [[0, 0], [1.95, 0], [2.1, -4], [2.3, -4], [2.4, -14], [2.95, -12], [3.3, 0]],
    "goz": [[0, 0], [1.95, 0], [2.05, 0.6], [2.3, 0.6], [2.38, 0.9], [3.0, 0.9], [3.2, 0]],
    "bak": [[0, 0.5, 0.5, 0.25], [0.6, -0.5, 0.3, -0.3], [1.1, 0.5, 0.5, 0.25], [1.8, 0, -0.1, 0], [2.3, 0, -0.1, 0], [2.42, 0.35, -0.25, 0.3],
            [2.95, 0.3, -0.2, 0.25], [3.1, -0.45, 0.25, -0.25], [3.35, -0.45, 0.25, -0.25], [3.5, 0.85, -0.05, 0.5],
            [a0 + 2.3, 0.85, -0.05, 0.5], [a1 + 0.2, 0.5, 0.5, 0.25], [a1 + 1.0, 0.2, 0.45, 0.1]],
    "konus": [{"t": a0 + 0.08, "cues": MAN["A01a_01"]["mouth"]}],
}
UCAN = [
    {"n": "gomlek", "t0": 0.85, "t1": 1.1, "a": [475, 1390], "b": [445, 1392], "h": 20, "don": 0.3},
    {"n": "corap", "t0": 3.2, "t1": 3.55, "a": [520, 1300], "b": [450, 1392], "h": 90, "don": 1.5},
]
# şok ve öfke (sok + A03): anne yarım plan, elinde deste
s0, s1 = T["sok"], T["A03"]
ANNE_SON = {
    "yer": [[0, 610, 1880, 1290]], "egil": [[0, 0]], "kolL": [[0, 38, -105]],
    "elR": [[0, 760, 1120], [s1, 760, 1110], [s1 + 0.1, 790, 1020], [s1 + 0.25, 770, 1060], [s1 + 0.4, 795, 1010], [s1 + 0.55, 772, 1055]], "bukumR": -1,
    "tutR": [[0, "deste"]],
    "duygu": [[0, "sok"], [s0 + 0.45, "ofkeli"]], "gozSok": [[0, 1], [s0 + 0.4, 1], [s0 + 0.5, 0]],
    "bak": [[0, 0.1, 0.45, 0.05], [s0 + 0.5, 0.85, -0.05, 0.5]],
    "konus": [{"t": s1 + 0.08, "cues": MAN["A03b_01"]["mouth"]}],
}


def b7(t0, dur, cam, anne, **ek):
    p = {"t0": t0, "cam": cam, "titre": 3, "isik": 1, "anne": anne, "ucan": UCAN}
    p.update(ek)
    return {"type": "insert", "kind": "b7_banyo", "dur": round(dur, 3), "text": [json.dumps(p, ensure_ascii=False)]}


def line(who, text, take, ekle, gap):
    return {"type": "line", "who": who, "text": text, "emotion": "notr", "gapAfter": gap, "_take": take, "ekle": ekle}


def vuruslar():
    A = T
    return [
        dict(b7(0, A["A01"], [[0, 545, 1050, 1.12], [A["A01"], 550, 1040, 1.17]], ANNE), etiket="18:00",
             sfx=[{"name": "efekt/el_kumas_firlat", "at": 0.8, "volume": 0.5}, {"name": "efekt/el_koklama", "at": 1.95, "volume": 0.8},
                  {"name": "efekt/b7_anne_iyy", "at": 2.36, "volume": 1.0}, {"name": "efekt/el_kumas_firlat", "at": 3.2, "volume": 0.45}]),
        line("anne724", "Eceee uyan kız artık", "A01a_01",
             {"kind": "b7_banyo", "text": json.loads(json.dumps(b7(A["A01"], 0, [[A["A01"], 590, 960, 1.65], [A["kot"], 595, 955, 1.75]], ANNE)["text"]))}, 0.15),
        b7(A["kot"], A["cep"] - A["kot"], [[A["kot"], 600, 1060, 1.18], [A["cep"], 610, 1050, 1.24]], ANNE),
        {"type": "insert", "kind": "cep_deste", "dur": 1.5, "text": ["sol"], "sfx": [{"name": "efekt/el_kumas_burus", "at": 0.3, "volume": 0.5}, {"name": "efekt/el_kaching", "at": 1.0, "volume": 0.45}]},
        line("anne724", "yuhh", "A02a_01", {"kind": "para_say", "text": ["anne"]}, 0.1),
        dict(b7(A["sok"], A["A03"] - A["sok"], [[A["sok"], 600, 1000, 1.5], [A["A03"], 600, 990, 1.6]], ANNE_SON, makineSepet=True), sfx=[{"name": "efekt/el_sok_vurgu", "at": 0.0, "volume": 0.55}]),
        line("anne724", "Eceeee", "A03b_01",
             {"kind": "b7_banyo", "text": json.loads(json.dumps(b7(A["A03"], 0, [[A["A03"], 600, 990, 1.6], [A["A03"] + 0.12, 640, 930, 2.3], [SON, 640, 925, 2.4]], ANNE_SON, titre=6, makineSepet=True)["text"]))}, 0.45) | {"sfx": [{"name": "efekt/el_plak_cizik", "at": 0.0, "volume": 0.5}, {"name": "efekt/whoosh", "at": 0.05, "volume": 0.35}]},
    ]


def json_yaz():
    beats = vuruslar()
    man = {}
    for i, b in enumerate(beats):
        if b["type"] == "line":
            man[f"a_{i + 1:02d}"] = MAN[b.pop("_take")]
    os.makedirs(f"{K}/public/voice/724-07-v2", exist_ok=True)
    json.dump(man, open(f"{K}/public/voice/724-07-v2/manifest.json", "w"), ensure_ascii=False, indent=1)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": "724-07-v2", "episodeNo": 7, "title": "Bölüm 7 · Parça 1", "endCard": False,
          "scenes": [{"id": "a", "set": "banyo_kapi", "time": "gunduz", "title": "Deste", "transition": "kesme", "cast": {},
                      "music": {"name": "muzik/banyo_komik", "volume": 0.18}, "ambience": {"name": "ortam/banyo_sabah", "volume": 0.22}, "beats": beats}]}
    json.dump(ep, open(f"{K}/public/episodes/724-07-v2.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON:.1f} sn", {k: round(v, 2) for k, v in T.items()})


def kare(adlar):
    os.makedirs(f"{K}/out/b7kare", exist_ok=True)
    for a in adlar:
        tt = float(a)
        an = ANNE_SON if tt >= T["sok"] else ANNE
        p = json.loads(b7(tt, 1, [[0, 545, 1050, 1.12]] if tt < T["A01"] else [[0, 590, 960, 1.65]], an)["text"][0])
        json.dump({"text": [json.dumps(p)]}, open(f"{K}/out/b7kare/p.json", "w"))
        subprocess.run(["npx", "remotion", "still", "src/index.ts", "B7Kare", f"out/b7kare/k{a}.png", "--frame=0", "--props=out/b7kare/p.json",
                        f"--browser-executable={TAR}", "--log=error", "--scale=0.4"], cwd=K)


if __name__ == "__main__":
    if sys.argv[1] == "json":
        json_yaz()
    else:
        kare(sys.argv[2:])
