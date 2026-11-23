"""7/24 B7 Parça 3 ("Zeytin"): salon, sofra. Replikler kullanıcının metninden AYNEN.
Kullanım: python3 tools/b7p3.py [json | kare sn ...]
MANTIK: Ece pijamayla odasına koşar (kapı açılır/kapanır) → anne sofraya tabak koyar, "otur şu masaya" diye masaya vurur →
 Ece giyinik (hardal kazak) çıkar, annenin yanına gelir → anne "o para...." derken Ece kâseden zeytin alır, ağzına atar,
 annesinin yanağını öper (anne donar) → ağzı dolu "az işim var gelicemm" diyerek sağdan çıkar, kapı çarpar → anne şaşkın.
"""
import json, os, subprocess, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAN = json.load(open(f"{K}/public/voice/724-07-p3/cekim/manifest.json"))
TAR = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"
sure = lambda tk: MAN[tk]["duration"]
konus = lambda t, tk: {"t": t + 0.08, "cues": MAN[tk]["mouth"]}

A1, A2, E1 = 2.6, 6.5, 8.0
SON = 12.2
FY, SZ = 1600, 1250
S = SZ / 1000
AX, EXF = 560, 780                      # anne ve Ece (giyinik) konumu; masanın ARKASINDA (masa üstü y≈1250-1370)
AGIZ_E = (EXF - 20, FY - 730 * S)       # Ece'nin ağzı
ANNE = {
    "yer": [[0, AX, FY, SZ]],
    "dogalKol": True, "onKol": True,
    "elR": [[0, 680, 1170], [0.6, 680, 1170], [1.5, 765, 1290], [1.75, 760, 1300], [2.1, 680, 1170],
            [SON - 2.0, 680, 1170], [SON - 1.7, 620, 700], [SON, 620, 700]],          # en sonda öpülen yanağına dokunur
    "tutR": [[0, "tabak"], [1.75, None]],
    "elL": [[0, 440, 1170], [A1, 440, 1170], [A1 + 0.15, 430, 1265], [A1 + 0.35, 432, 1200], [A1 + 0.55, 430, 1265], [A1 + 0.75, 432, 1200],
            [A1 + 0.95, 430, 1265], [A1 + 1.4, 440, 1170]],                           # "otur şu masaya": masaya vurur
    "elLara": [[A1 - 0.1, A1 + 1.6]], "elRara": [[-99, 99]],
    "duygu": [[0, "notr"], [0.6, "supheli"], [A1, "ofkeli"], [A1 + 1.8, "notr"], [A2 - 0.2, "ofkeli"], [7.65, "sok"], [9.9, "saskin"], [SON - 1.8, "mutlu"]],
    "gozSok": [[0, 0], [7.6, 0], [7.7, 1], [9.6, 1], [9.9, 0.4]],
    "bak": [[0, 0.5, 0.5, 0.3], [0.5, -0.6, 0, -0.4], [1.6, 0.6, 0.5, 0.3], [2.4, -0.8, 0, -0.55], [A1 + 1.6, -0.8, 0, -0.55],
            [A1 + 1.9, 0.3, 0.4, 0.15], [5.3, -0.7, 0, -0.45], [6.3, 0.85, -0.05, 0.6], [8.4, 0.95, 0, 0.7], [9.4, 0.95, 0, 0.75], [10.3, 0, 0, 0]],
    "tilt": [[0, 0], [7.6, 0], [7.75, 6], [9.4, 6], [9.7, 0]],
    "goz": [[0, 0], [10.6, 0], [10.7, 1], [10.8, 0], [11.2, 0], [11.3, 1], [11.4, 0]],
    "konus": [konus(A1, "A1a_01"), konus(A2, "A2a_01")],
}
ECE = {
    # pijamayla koşu: sağdan girer, annenin ARKASINDAN odasına (sol kapı) dalar; giyinik çıkar, arkadan annenin sağına gelir; sonra sağdan çıkar
    "yer": [[0, 1150, FY, SZ], [0.25, 1150, FY, SZ], [1.85, 165, FY, SZ], [1.9, 165, FY, 0], [5.15, 165, FY, 0], [5.2, 165, FY, SZ],
            [6.3, EXF, FY, SZ], [8.25, EXF, FY, SZ], [9.6, 1220, FY, SZ]],
    "yuru": [[0.25, 1.85], [5.2, 6.3], [8.25, 9.6]],
    "egil": [[0, 0], [7.35, 0], [7.55, -10], [7.85, -10], [8.05, 0]],
    "dogalKol": True, "onKol": True,
    "elL": [[6.3, 710, 1170], [6.6, 710, 1170], [6.9, 652, 1300], [7.0, 652, 1292], [7.2, AGIZ_E[0], AGIZ_E[1]], [7.3, AGIZ_E[0], AGIZ_E[1]],
            [7.5, 710, 1170]],
    "elLara": [[6.3, 7.55]],
    "tutL": [[0, None], [6.95, "zeytin"], [7.28, None]],
    "elR": [[8.3, 871, 1170], [8.5, 1026, 640], [8.7, 1112, 665], [8.9, 1157, 640], [9.1, 1242, 665], [9.4, 1230, 1170]],   # el sallar (gövdeyle birlikte ilerler)
    "elRara": [[8.3, 9.45]],
    "duygu": [[0, "korkmus"], [5.2, "mutlu"], [6.5, "supheli"], [6.9, "mutlu"], [8.0, "mutlu"]],
    "goz": [[0, 0], [7.5, 0], [7.55, 1], [7.85, 1], [7.95, 0]],
    "bak": [[0, -0.8, 0, -0.5], [5.2, 0.6, 0.1, 0.3], [6.3, -0.6, 0.2, -0.35], [6.75, -0.4, 0.55, -0.2], [7.0, -0.6, 0.2, -0.35],
            [8.0, -0.6, 0, -0.4], [8.6, -0.4, 0, -0.3], [9.0, 0.8, 0, 0.6]],
    "konus": [konus(E1, "E1a_01")],
    "sacDagin": True,
}
ORT = {"view": "salon", "titre": 2.5, "isik": 0.4, "anne": ANNE, "ece": ECE, "eceId": [[0, "ece_ev"], [5.0, "ece_sivil"]],
       "odaKapi": [[0, 0], [1.35, 0], [1.6, 1], [2.1, 1], [2.4, 0], [4.85, 0], [5.15, 1], [6.0, 1], [6.3, 0]],
       "tabak2": 1.75, "zeytinAl": 6.95, "eceOnde": 6.35}


def b7(t0, cam, **ek):
    p = {"t0": t0, "cam": cam, **ORT}
    p.update(ek)
    return {"kind": "b7_banyo", "text": [json.dumps(p, ensure_ascii=False)]}


def vuruslar():
    a1e, a2e, e1e = A1 + sure("A1a_01") + 0.15, A2 + sure("A2a_01") + 0.5, E1 + sure("E1a_01") + 0.1
    return [
        {"type": "insert", "dur": A1, **b7(0, [[0, 540, 980, 1.0], [A1, 545, 970, 1.04]]),
         "sfx": [{"name": "efekt/adim_kosu_1", "at": 0.3, "volume": 0.4}, {"name": "efekt/kapi_kapanma", "at": 2.3, "volume": 0.5},
                 {"name": "efekt/fincan_tikirti", "at": 1.7, "volume": 0.5}]},
        {"type": "line", "who": "anne724", "text": "otur şu masaya", "emotion": "notr", "gapAfter": a1e - A1 - sure("A1a_01"), "_take": "A1a_01",
         "ekle": b7(A1, [[A1, 520, 830, 1.5], [a1e, 520, 825, 1.55]]),
         "sfx": [{"name": "efekt/tezgah_carpma", "at": x, "volume": 0.35} for x in (0.15, 0.55, 0.95)]},
        {"type": "insert", "dur": round(A2 - a1e, 3), **b7(a1e, [[a1e, 540, 970, 1.05], [A2, 560, 950, 1.1]]),
         "sfx": [{"name": "efekt/kapi_acilma", "at": 4.85 - a1e, "volume": 0.4}, {"name": "efekt/ayak_sesleri", "at": 5.2 - a1e, "volume": 0.3}]},
        {"type": "line", "who": "anne724", "text": "o para....", "emotion": "notr", "gapAfter": E1 - A2 - sure("A2a_01"), "_take": "A2a_01",
         "ekle": b7(A2, [[A2, 670, 800, 1.55], [E1, 675, 790, 1.62]]),
         "sfx": [{"name": "efekt/el_opucuk", "at": 7.62 - A2, "volume": 0.8}]},
        {"type": "line", "who": "ece_sivil", "text": "az işim var gelicemm", "emotion": "notr", "gapAfter": e1e - E1 - sure("E1a_01"), "_take": "E1a_01",
         "ekle": b7(E1, [[E1, 670, 880, 1.3], [e1e, 760, 940, 1.12]]),
         "sfx": [{"name": "efekt/ayak_sesleri", "at": 0.3, "volume": 0.3}]},
        {"type": "insert", "dur": round(SON - e1e, 3), **b7(e1e, [[e1e, 560, 660, 2.1], [SON, 560, 650, 2.25]]),
         "sfx": [{"name": "efekt/kapi_carpma", "at": 0.1, "volume": 0.6}]},
    ]


def json_yaz():
    beats = vuruslar()
    man = {}
    for i, b in enumerate(beats):
        if b["type"] == "line":
            man[f"a_{i + 1:02d}"] = MAN[b.pop("_take")]
    os.makedirs(f"{K}/public/voice/724-07-p3", exist_ok=True)
    json.dump(man, open(f"{K}/public/voice/724-07-p3/manifest.json", "w"), ensure_ascii=False, indent=1)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": "724-07-p3", "episodeNo": 7, "title": "Bölüm 7 · Parça 3", "endCard": False,
          "scenes": [{"id": "a", "set": "ev_antre", "time": "gunduz", "title": "Zeytin", "transition": "kesme", "cast": {},
                      "music": {"name": "muzik/banyo_komik", "volume": 0.16}, "beats": beats}]}
    json.dump(ep, open(f"{K}/public/episodes/724-07-p3.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam ≈ {SON:.1f} sn")


def kare(adlar):
    os.makedirs(f"{K}/out/b7kare", exist_ok=True)
    for a in adlar:
        p = {"t0": float(a), "cam": [[0, 560, 960, 1.05]], **ORT}
        json.dump({"text": [json.dumps(p)]}, open(f"{K}/out/b7kare/p.json", "w"))
        subprocess.run(["npx", "remotion", "still", "src/index.ts", "B7Kare", f"out/b7kare/z{a}.png", "--frame=0", "--props=out/b7kare/p.json",
                        f"--browser-executable={TAR}", "--log=error", "--scale=0.35"], cwd=K)


if __name__ == "__main__":
    json_yaz() if sys.argv[1] == "json" else kare(sys.argv[2:])
