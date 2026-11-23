"""7/24 B7 Parça 1, v2 (elle kurgulanmış "b7_banyo" sahnesi). Örnek: açılış (anne çamaşır, para, "Eceeee").
Kullanım: python3 tools/b7p1v2.py [json | kare sn ...]

MANTIK DENETİMİ (her vuruş için): sebep-sonuç, süreklilik (eşya nerede?), ışık/saat, karakter neye bakıyor, tepki komik mi?
 - Kasım, 18:00 → dışarısı karanlık: pencere gece, tavan lambası sıcak ışık.
 - Çamaşırlar AÇIK makineye atılır; atılan gömlek/çorap tamburda görünür.
 - Sepet kalçada → kot sahnesinde makinenin üstüne bırakılır (görünür hareket) → sonra hep orada.
 - Anne cebi yoklar (hışırtı), şüphelenir, kameraya bakar, sonra elini sokar. Kot sonra sepetin yanına konur.
 - "yuhh" annenin YÜZÜNDE (göz fırlar, çift bakış); "Eceeee" kapıya dönüp, derin nefesten sonra.
"""
import json, os, subprocess, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CK = f"{K}/public/voice/724-07/cekim"
MAN = json.load(open(f"{CK}/manifest.json"))
TAR = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"
sure = lambda tk: MAN[tk]["duration"]

T = {}
t = 0.0
T["acilis"] = t; t += 3.6                      # gömlek makineye, çorap koklama → Iyy → fırlat
T["A01"] = t; t += sure("A01a_01") + 0.15      # "Eceee uyan kız artık" (kapıya doğru)
T["kot"] = t; t += 2.7                         # sepeti makineye koyar, kotu alır, cebi yoklar, şüphe
T["cep"] = t; t += 1.5                         # yakın: cepten deste (sağ el)
T["say"] = t; t += 1.6                         # yakın: sayar (sessiz, hışırtı)
T["A02"] = t; t += sure("A02a_01") + 0.15      # yüz: "yuhh" (şok)
T["cift"] = t; t += 1.0                        # çift bakış: para – kamera – para
T["A03"] = t; t += sure("A03b_01") + 0.5       # nefes → kapıya dönüp "Eceeee"
SON = t
a0, k, y0, c0, e0 = T["A01"], T["kot"], T["A02"], T["cift"], T["A03"]
BAS, MAK = [680, 1300], [470, 1395]
MAK_UST = [470, 1050]

ANNE = {
    "yer": [[0, 610, 1880, 1290]], "sepet": [[0, 1]], "sepetBirak": [k + 0.05, k + 0.5],
    "egil": [[0, 0], [0.55, 0], [0.8, -6], [1.05, -6], [1.3, 0], [2.3, 0], [2.42, 8], [2.6, 6], [2.75, 8], [2.9, 6], [3.1, 2], [3.3, 0],
             [a0, 0], [a0 + 0.2, 4], [a0 + 2.2, 4], [a0 + 2.4, 0], [k, 0], [k + 0.25, -5], [k + 0.55, 0]],
    "kolR": [[0, 28, -75], [k + 0.45, 28, -75], [k + 0.75, 6, 0]],
    "elL": [[0, *BAS], [0.45, 690, 1270], [0.8, *MAK], [1.05, 480, 1380], [1.35, *BAS], [1.55, 690, 1270],
            [1.95, 600, 905], [2.3, 600, 905], [2.45, 400, 1060], [2.95, 395, 1070], [3.12, 515, 1235], [3.35, 560, 1285],
            [k, 478, 1372], [k + 0.6, 478, 1372], [k + 0.85, 395, 1085], [k + 1.0, 420, 1080], [k + 1.3, 470, 1195], [k + 2.7, 470, 1195]],
    "bukumL": [[0, 1], [k, -1]], "elLara": [[-99, a0], [k, 99]],
    # sağ el: sepeti bıraktıktan sonra cebi yoklar (iki pat), sonra cebe girer
    "elR": [[0, 735, 1374], [k + 1.3, 735, 1374], [k + 1.45, 546, 1352], [k + 1.55, 560, 1338], [k + 1.65, 546, 1352], [k + 1.75, 560, 1338],
            [k + 2.25, 552, 1346], [k + 2.55, 546, 1362]],
    "elRara": [[k + 1.3, 99]], "bukumR": -1,
    "tutL": [[0, None], [0.45, "gomlek"], [0.85, None], [1.5, "corap"], [3.2, None], [k + 0.9, "kot"]],
    "duygu": [[0, "notr"], [1.95, "igrenmis"], [3.4, "notr"], [a0, "ofkeli"], [a0 + 2.3, "notr"], [k + 1.5, "supheli"]],
    "tilt": [[0, 0], [1.95, 0], [2.1, -4], [2.3, -4], [2.4, -14], [2.95, -12], [3.3, 0], [k + 1.6, 0], [k + 1.8, 7], [k + 2.3, 7], [k + 2.5, 0]],
    "goz": [[0, 0], [1.95, 0], [2.05, 0.6], [2.3, 0.6], [2.38, 0.9], [3.0, 0.9], [3.2, 0], [k + 1.8, 0], [k + 1.9, 0.35], [k + 2.3, 0.35], [k + 2.4, 0]],
    "bak": [[0, 0.5, 0.5, 0.25], [0.6, -0.5, 0.3, -0.3], [1.1, 0.5, 0.5, 0.25], [1.8, 0, -0.1, 0], [2.3, 0, -0.1, 0], [2.42, 0.35, -0.25, 0.3],
            [2.95, 0.3, -0.2, 0.25], [3.1, -0.45, 0.25, -0.25], [3.35, -0.45, 0.25, -0.25], [3.5, 0.9, -0.05, 0.6],
            [a0 + 2.3, 0.9, -0.05, 0.6], [k + 0.1, -0.5, 0.2, -0.3], [k + 1.3, 0.2, 0.5, 0.1], [k + 1.75, 0.2, 0.5, 0.1],
            [k + 1.85, 0, 0, 0], [k + 2.3, 0, 0, 0], [k + 2.45, 0.2, 0.55, 0.1]],  # cebe bakar → kameraya şüpheli bakış → cebe
    "konus": [{"t": a0 + 0.08, "cues": MAN["A01a_01"]["mouth"]}],
}
UCAN = [
    {"n": "gomlek", "t0": 0.85, "t1": 1.1, "a": [475, 1390], "b": [445, 1392], "h": 20, "don": 0.3},
    {"n": "corap", "t0": 3.2, "t1": 3.55, "a": [520, 1300], "b": [450, 1392], "h": 90, "don": 1.5},
]
# yüz: "yuhh" → çift bakış → nefes → kapıya "Eceeee"; deste iki elde göğüs hizasında, sonra sağ elde sallanır
ANNE_YUZ = {
    "yer": [[0, 610, 1880, 1290]], "egil": [[0, 0], [y0 + 0.1, -5], [y0 + 0.5, -3], [e0, -3], [e0 + 0.12, 3], [e0 + 0.3, 0]],
    "elL": [[0, 560, 1170], [e0, 560, 1170], [e0 + 0.18, 515, 1290]], "elLara": [[-99, e0 + 0.2]], "bukumL": 1, "kolL": [[0, 38, -105]],
    "elR": [[0, 650, 1165], [e0, 650, 1165], [e0 + 0.1, 790, 1020], [e0 + 0.25, 770, 1060], [e0 + 0.4, 795, 1010], [e0 + 0.55, 772, 1055]], "bukumR": -1,
    "tutR": [[0, "deste"]],
    "duygu": [[0, "sok"], [y0 + 0.9, "agizAcik"], [c0 + 0.7, "ofkeli"]], "gozSok": [[0, 0], [y0 + 0.05, 1], [c0 + 0.6, 1], [c0 + 0.75, 0]],
    "tilt": [[0, 0], [y0 + 0.08, -10], [y0 + 0.4, -6], [c0, -6], [c0 + 0.3, 0]],
    # para (aşağı) – kamera – para – kapı (çift bakış)
    "bak": [[0, 0.1, 0.55, 0.05], [y0 + 1.2, 0.1, 0.55, 0.05], [y0 + 1.3, 0, 0, 0], [c0, 0, 0, 0], [c0 + 0.12, 0.1, 0.55, 0.05], [c0 + 0.45, 0.1, 0.55, 0.05],
            [c0 + 0.55, 0, -0.05, 0], [e0, 0, -0.05, 0], [e0 + 0.12, 0.9, -0.08, 0.65]],
    "konus": [{"t": y0 + 0.08, "cues": MAN["A02a_01"]["mouth"]}, {"t": e0 + 0.08, "cues": MAN["A03b_01"]["mouth"]}],
}
ORT = {"titre": 3, "isik": 0, "gece": True, "ucan": UCAN, "makineSepet": k + 0.5, "makineKot": T["say"]}


def b7(t0, dur, cam, anne, **ek):
    p = {"t0": t0, "cam": cam, "anne": anne, **ORT}
    p.update(ek)
    return {"type": "insert", "kind": "b7_banyo", "dur": round(dur, 3), "text": [json.dumps(p, ensure_ascii=False)]}


def line(who, text, take, ekle, gap, sfx=None):
    b = {"type": "line", "who": who, "text": text, "emotion": "notr", "gapAfter": gap, "_take": take, "ekle": ekle}
    if sfx:
        b["sfx"] = sfx
    return b


def ekle(b):
    return {"kind": b["kind"], "text": b["text"]}


def vuruslar():
    A = T
    return [
        dict(b7(0, A["A01"], [[0, 545, 1050, 1.12], [A["A01"], 550, 1040, 1.17]], ANNE), etiket="18:00",
             sfx=[{"name": "efekt/el_kumas_firlat", "at": 0.8, "volume": 0.5}, {"name": "efekt/el_koklama", "at": 1.95, "volume": 0.8},
                  {"name": "efekt/b7_anne_iyy", "at": 2.36, "volume": 1.0}, {"name": "efekt/el_kumas_firlat", "at": 3.2, "volume": 0.45}]),
        line("anne724", "Eceee uyan kız artık", "A01a_01", ekle(b7(a0, 0, [[a0, 610, 960, 1.6], [k, 615, 955, 1.7]], ANNE)), 0.15),
        dict(b7(k, A["cep"] - k, [[k, 560, 1060, 1.18], [k + 1.4, 600, 1080, 1.3], [A["cep"], 610, 1060, 1.42]], ANNE),
             sfx=[{"name": "efekt/el_kumas_dus", "at": 0.45, "volume": 0.5}, {"name": "efekt/el_kagit", "at": 1.42, "volume": 0.6},
                  {"name": "efekt/el_kagit", "at": 1.62, "volume": 0.6}]),
        {"type": "insert", "kind": "cep_deste", "dur": 1.5, "sfx": [{"name": "efekt/el_kumas_burus", "at": 0.3, "volume": 0.5}, {"name": "efekt/el_kaching", "at": 1.0, "volume": 0.45}]},
        {"type": "insert", "kind": "para_say", "dur": 1.6, "text": ["anne"], "sfx": [{"name": "efekt/el_kagit", "at": x, "volume": 0.35} for x in (0.2, 0.65, 1.1)]},
        line("anne724", "yuhh", "A02a_01", ekle(b7(y0, 0, [[y0, 600, 950, 1.75], [y0 + 0.1, 600, 930, 1.95], [c0, 600, 925, 2.0]], ANNE_YUZ)), 0.15,
             sfx=[{"name": "efekt/el_sok_vurgu", "at": 0.05, "volume": 0.5}]),
        b7(c0, e0 - c0, [[c0, 600, 925, 2.0], [e0, 600, 930, 2.05]], ANNE_YUZ),
        line("anne724", "Eceeee", "A03b_01", ekle(b7(e0, 0, [[e0, 600, 930, 2.05], [e0 + 0.12, 660, 920, 2.5], [SON, 660, 915, 2.6]], ANNE_YUZ, titre=6)), 0.5,
             sfx=[{"name": "efekt/el_plak_cizik", "at": 0.0, "volume": 0.5}, {"name": "efekt/whoosh", "at": 0.05, "volume": 0.35}]),
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
    print(f"toplam {SON:.1f} sn", {kk: round(v, 2) for kk, v in T.items()})


def kare(adlar):
    os.makedirs(f"{K}/out/b7kare", exist_ok=True)
    for a in adlar:
        tt = float(a)
        an = ANNE_YUZ if tt >= T["A02"] else ANNE
        cam = [[0, 545, 1050, 1.12]] if tt < a0 else [[0, 610, 960, 1.6]] if tt < k else [[0, 590, 1070, 1.25]] if tt < y0 else [[0, 600, 930, 2.0]]
        p = json.loads(b7(tt, 1, cam, an)["text"][0])
        json.dump({"text": [json.dumps(p)]}, open(f"{K}/out/b7kare/p.json", "w"))
        subprocess.run(["npx", "remotion", "still", "src/index.ts", "B7Kare", f"out/b7kare/k{a}.png", "--frame=0", "--props=out/b7kare/p.json",
                        f"--browser-executable={TAR}", "--log=error", "--scale=0.35"], cwd=K)


if __name__ == "__main__":
    if sys.argv[1] == "json":
        json_yaz()
    else:
        kare(sys.argv[2:])
