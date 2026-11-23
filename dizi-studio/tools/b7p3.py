"""7/24 B7 Parça 3 ("Zeytin") v2: salon/sofra + antre. Replikler kullanıcının metninden AYNEN; aradaki sözsüz şakalar Claude'un eklemesi.
Kullanım: python3 tools/b7p3.py [json | kare sn ...]
AKIŞ (sahne zamanı):
 0-2,6   geniş: anne tabak koyar; Ece pijamayla annenin ARKASINDAN odasına koşar, kapı kapanır
 2,6     anne: "otur şu masaya" (masaya vurur)
 4,1-7,3 şaka: aralık kapıdan pijama üstü, altı, çorap fırlar; çorap sofraya düşer; anne iki parmakla (iğrenerek) alıp odaya geri fırlatır
 7,3-8,6 Ece giyinik (hardal kazak) çıkar, annenin arkasından sağına gelir
 8,6     anne cebinden desteyi çıkarır: "o para...." (yarım kalır)
 9,65    yakın: Ece'nin parmakları kâseden zeytin kapar
 10,55   Ece zeytini havaya atar, ağzıyla yakalar (yanak şişer, çiğner)
 11,5    yakın: yanağına şapır öpücük, anne donar
 12,3    Ece ağzı dolu: "az işim var gelicemm", el sallayarak sağdan çıkar
 14,3    antre: Ece kapıyı açıp çıkar, kapı çarpar
 16,1    anne yakın: donmuş → yanağına dokunur, yumuşar → elindeki paraya bakar, gözleri kısılır (kanca)
"""
import json, os, subprocess, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAN = json.load(open(f"{K}/public/voice/724-07-p3/cekim/manifest.json"))
TAR = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"
sure = lambda tk: MAN[tk]["duration"]
konus = lambda t, tk: {"t": t + 0.08, "cues": MAN[tk]["mouth"]}

A1 = 2.6
A1E = A1 + sure("A1a_01") + 0.15
GAG = A1E
CIK = 7.3
A2 = 8.6
A2E = A2 + sure("A2a_01") + 0.06
ZA = A2E            # zeytin yakın (insert)
ZT = ZA + 0.9       # zeytin atma/yakalama
OP = ZT + 0.95      # öpücük
E1 = OP + 0.8
E1E = E1 + sure("E1a_01") + 0.1
AN = E1E            # antre
SONY = AN + 1.8     # son yakın
SON = SONY + 2.9

FY, SZ = 1600, 1250
S = SZ / 1000
AX, EXF = 560, 780
AGIZ_E = (EXF - 20, FY - 730 * S)
MASA = 1300          # masa üstü (tabak hizası)

ANNE = {
    "yer": [[0, AX, FY, SZ]],
    "dogalKol": True, "onKol": True,
    "elR": [[0, 680, 1170], [0.6, 680, 1170], [1.5, 765, 1290], [1.75, 760, 1300], [2.1, 680, 1170],
            [SONY + 0.5, 680, 1170], [SONY + 0.85, 640, 700], [SON, 640, 700]],
    "tutR": [[0, "tabak"], [1.75, None]],
    "elL": [[0, 440, 1170], [A1, 440, 1170], [A1 + 0.15, 430, 1265], [A1 + 0.35, 432, 1200], [A1 + 0.55, 430, 1265], [A1 + 0.75, 432, 1200],
            [A1 + 0.95, 430, 1265], [A1 + 1.4, 440, 1170],
            [6.05, 440, 1170], [6.3, 432, 1285], [6.45, 430, 1270], [6.8, 190, 860], [7.0, 175, 855], [7.12, 210, 930], [7.4, 440, 1170],   # çorabı alır, uzak tutar, fırlatır
            [A2 - 0.1, 440, 1170], [A2 + 0.25, 455, 1150], [A2 + 0.5, 470, 905], [SON, 470, 905]],                                            # cepten deste, gösterir
    "elLara": [[A1 - 0.1, A1 + 1.6], [6.0, 7.5], [A2 - 0.15, 99]], "elRara": [[-99, 99]],
    "tutL": [[0, None], [6.4, "corap"], [7.05, None], [A2 + 0.3, "deste"]],
    "duygu": [[0, "notr"], [0.6, "supheli"], [A1, "ofkeli"], [A1 + 1.8, "notr"], [GAG + 0.4, "saskin"], [6.05, "igrenmis"], [7.4, "ofkeli"],
              [OP + 0.2, "sok"], [SONY + 0.5, "saskin"], [SONY + 1.0, "mutlu"], [SONY + 1.9, "supheli"]],
    "gozSok": [[0, 0], [GAG + 0.3, 0], [GAG + 0.45, 0.6], [6.0, 0.6], [6.1, 0], [OP + 0.15, 0], [OP + 0.25, 1], [SONY + 0.4, 1], [SONY + 0.7, 0]],
    "goz": [[0, 0], [6.3, 0], [6.4, 0.7], [7.05, 0.7], [7.15, 0], [SONY + 1.9, 0], [SONY + 2.1, 0.4], [SON, 0.4]],
    "tilt": [[0, 0], [6.3, 0], [6.45, -12], [7.0, -12], [7.2, 0], [OP + 0.15, 0], [OP + 0.3, 7], [E1 + 1.6, 7], [E1 + 1.9, 0], [SONY + 1.0, -5], [SONY + 1.9, 0]],
    "bak": [[0, 0.5, 0.5, 0.3], [0.5, -0.6, 0, -0.4], [1.6, 0.6, 0.5, 0.3], [2.4, -0.8, 0, -0.55], [A1 + 1.6, -0.8, 0, -0.55],
            [GAG + 0.3, -0.85, 0.1, -0.6], [5.6, -0.7, 0.35, -0.4], [6.05, -0.5, 0.5, -0.3], [6.45, 0.6, -0.1, 0.4], [7.0, 0.6, -0.1, 0.4],
            [7.15, -0.85, 0, -0.6], [CIK + 0.6, -0.7, 0, -0.45], [A2 - 0.3, 0.9, -0.05, 0.65], [ZT, 0.9, -0.05, 0.65], [ZT + 0.3, 0.8, -0.25, 0.55],
            [OP, 0.95, 0, 0.7], [E1 + 1.2, 0.95, 0, 0.75], [SONY, 0, 0, 0], [SONY + 1.9, -0.25, 0.6, -0.15], [SON, -0.25, 0.6, -0.15]],
    "konus": [konus(A1, "A1a_01"), konus(A2, "A2a_01")],
}
ECE = {
    "yer": [[0, 1150, FY, SZ], [0.25, 1150, FY, SZ], [1.85, 165, FY, SZ], [1.9, 165, FY, 0], [CIK + 0.05, 165, FY, 0], [CIK + 0.1, 165, FY, SZ],
            [8.5, EXF, FY, SZ], [E1 + 0.25, EXF, FY, SZ], [E1 + 1.6, 1220, FY, SZ]],
    "yuru": [[0.25, 1.85], [CIK + 0.1, 8.5], [E1 + 0.25, E1 + 1.6]],
    "egil": [[0, 0], [OP, 0], [OP + 0.2, -10], [OP + 0.55, -10], [OP + 0.75, 0]],
    "dogalKol": True, "onKol": True,
    "elL": [[ZT - 0.05, 712, 1150], [ZT + 0.2, 740, 810], [ZT + 0.32, 760, 780], [ZT + 0.45, 705, 1165]],
    "elLara": [[ZT - 0.1, ZT + 0.65]],
    "tutL": [[0, None], [ZT - 0.1, "zeytin"], [ZT + 0.3, None]],
    "elR": [[E1 + 0.3, 855, 1170], [E1 + 0.5, 1010, 640], [E1 + 0.7, 1070, 665], [E1 + 0.9, 1075, 640], [E1 + 1.1, 1135, 665], [E1 + 1.4, 1155, 1170]],
    "elRara": [[E1 + 0.3, E1 + 1.45]],
    "duygu": [[0, "korkmus"], [CIK, "mutlu"], [A2, "supheli"], [ZT + 0.2, "agizAcik"], [ZT + 0.6, "mutlu"]],
    "goz": [[0, 0], [OP + 0.1, 0], [OP + 0.2, 1], [OP + 0.55, 1], [OP + 0.65, 0]],
    "gozSok": [[0, 0], [ZT + 0.2, 0], [ZT + 0.25, 0.8], [ZT + 0.55, 0.8], [ZT + 0.6, 0]],
    "bak": [[0, -0.8, 0, -0.5], [CIK, 0.6, 0.1, 0.3], [8.5, -0.6, 0.2, -0.35], [A2 + 0.5, -0.4, 0.55, -0.2], [ZA, -0.4, 0.55, -0.2],
            [ZT + 0.15, 0, -0.7, 0], [ZT + 0.5, 0, 0, 0], [OP, -0.6, 0, -0.4], [E1 + 0.6, 0.8, 0, 0.6]],
    "yanak": [[0, 0], [ZT + 0.5, 0], [ZT + 0.6, 1], [E1 + 1.6, 1]],
    "agzi": [[ZT + 0.6, OP]],
    "konus": [konus(E1, "E1a_01")],
    "sacDagin": True,
}
UCAN = [
    {"n": "pijama", "t0": GAG + 0.3, "t1": GAG + 0.8, "a": [230, 980], "b": [300, 1580], "h": 120, "don": 0.8},
    {"n": "pantolon", "t0": GAG + 0.8, "t1": GAG + 1.25, "a": [230, 1040], "b": [150, 1585], "h": 90, "don": -0.6},
    {"n": "corap", "t0": GAG + 1.4, "t1": 6.0, "a": [240, 940], "b": [430, MASA - 8], "h": 160, "don": 1.5},
    {"n": "corap", "t0": 7.05, "t1": 7.35, "a": [200, 900], "b": [170, 1150], "h": 60, "don": -1.5},
]
YERDE = [{"n": "pijama", "t": GAG + 0.8, "x": 300, "y": 1580, "a": 10}, {"n": "pantolon", "t": GAG + 1.25, "x": 150, "y": 1585, "a": -12}]
SALON = {"view": "salon", "titre": 2.5, "isik": 0.4, "anne": ANNE, "ece": ECE, "eceId": [[0, "ece_ev"], [5.0, "ece_sivil"]],
         "odaKapi": [[0, 0], [1.35, 0], [1.6, 1], [2.1, 1], [2.4, 0], [GAG, 0], [GAG + 0.15, 0.35], [CIK - 0.15, 0.35], [CIK, 1], [8.0, 1], [8.3, 0]],
         "tabak2": 1.75, "zeytinAl": ZA + 0.45, "eceOnde": 8.55, "ucan": UCAN, "yerde": YERDE}
# çorap masadayken (6,0–6,4) sofrada durur
SALON["yerde"] = YERDE + [{"n": "corap", "t": 6.0, "son": 6.42, "x": 430, "y": MASA - 8, "a": 80}]
ANTRE_ECE = {"yer": [[0, 960, 1760, 1150], [0.8, 600, 1615, 1000], [1.1, 560, 1600, 980], [1.15, 560, 1600, 0]], "yuru": [[0, 0.8]],
             "duygu": [[0, "mutlu"]], "bak": [[0, -0.8, 0, -0.6]], "yanak": [[0, 1]], "dogalKol": True, "sacDagin": True}


def b7(t0, cam, **ek):
    p = {"t0": t0, "cam": cam, **SALON}
    p.update(ek)
    return {"kind": "b7_banyo", "text": [json.dumps(p, ensure_ascii=False)]}


def vuruslar():
    ins = lambda dur, t0, cam, sfx=None, **ek: {"type": "insert", "dur": round(dur, 3), **b7(t0, cam, **ek), **({"sfx": sfx} if sfx else {})}
    line = lambda who, txt, tk, t0, t1, cam, sfx=None: {"type": "line", "who": who, "text": txt, "emotion": "notr", "gapAfter": round(t1 - t0 - sure(tk), 3),
                                                         "_take": tk, "ekle": b7(t0, cam), **({"sfx": sfx} if sfx else {})}
    antre = {"t0": 0, "view": "antre", "gece": True, "cam": [[0, 600, 1000, 1.05], [1.8, 590, 990, 1.1]], "titre": 2.5, "isik": 0.4, "ece": ANTRE_ECE,
             "eceId": "ece_sivil", "kapi": [[0, 0], [0.65, 0], [0.95, 0.9], [1.25, 0.9], [1.45, 0]]}
    antre["eceId"] = [[0, "ece_sivil"]]
    return [
        ins(A1, 0, [[0, 540, 980, 1.0], [A1, 545, 970, 1.04]],
            [{"name": "efekt/adim_kosu_1", "at": 0.3, "volume": 0.4}, {"name": "efekt/kapi_kapanma", "at": 2.3, "volume": 0.5},
             {"name": "efekt/fincan_tikirti", "at": 1.7, "volume": 0.5}]),
        line("anne724", "otur şu masaya", "A1a_01", A1, A1E, [[A1, 520, 830, 1.5], [A1E, 520, 825, 1.55]],
             [{"name": "efekt/tezgah_carpma", "at": x, "volume": 0.35} for x in (0.15, 0.55, 0.95)]),
        ins(CIK - GAG, GAG, [[GAG, 470, 1000, 1.08], [6.0, 470, 990, 1.12], [CIK, 480, 980, 1.14]],
            [{"name": "efekt/el_dolap_karistir", "at": 0.05, "volume": 0.7}, {"name": "efekt/el_kumas_firlat", "at": 0.3, "volume": 0.5},
             {"name": "efekt/el_kumas_firlat", "at": 0.8, "volume": 0.5}, {"name": "efekt/el_kumas_dus", "at": 6.0 - GAG, "volume": 0.6},
             {"name": "efekt/el_koklama", "at": 6.55 - GAG, "volume": 0.45}, {"name": "efekt/el_kumas_firlat", "at": 7.05 - GAG, "volume": 0.5}]),
        ins(A2 - CIK, CIK, [[CIK, 540, 970, 1.05], [A2, 560, 950, 1.1]],
            [{"name": "efekt/kapi_acilma", "at": 0.0, "volume": 0.4}, {"name": "efekt/ayak_sesleri", "at": 0.1, "volume": 0.3}]),
        line("anne724", "o para....", "A2a_01", A2, A2E, [[A2, 650, 800, 1.55], [A2E, 655, 790, 1.62]],
             [{"name": "efekt/el_kagit", "at": 0.35, "volume": 0.5}]),
        {"type": "insert", "kind": "zeytin_al", "dur": round(ZT - ZA, 3)},
        ins(OP - ZT, ZT, [[ZT, 760, 760, 1.75], [OP, 760, 750, 1.8]],
            [{"name": "efekt/whoosh", "at": 0.25, "volume": 0.25}, {"name": "efekt/el_zeytin_yakala", "at": 0.5, "volume": 0.7},
             {"name": "efekt/el_cigneme", "at": 0.65, "volume": 0.5}]),
        ins(E1 - OP, OP, [[OP, 650, 700, 2.0], [E1, 650, 695, 2.1]],
            [{"name": "efekt/el_opucuk", "at": 0.22, "volume": 0.9}, {"name": "efekt/el_sok_vurgu", "at": 0.3, "volume": 0.3}]),
        line("ece_sivil", "az işim var gelicemm", "E1a_01", E1, E1E, [[E1, 640, 880, 1.3], [E1E, 598, 940, 1.12]],
             [{"name": "efekt/ayak_sesleri", "at": 0.3, "volume": 0.3}, {"name": "efekt/el_cigneme", "at": 0.0, "volume": 0.3}]),
        {"type": "insert", "kind": "b7_banyo", "dur": round(SONY - AN, 3), "text": [json.dumps(antre, ensure_ascii=False)],
         "sfx": [{"name": "efekt/ayak_sesleri", "at": 0.0, "volume": 0.3}, {"name": "efekt/kapi_acilma", "at": 0.65, "volume": 0.5},
                 {"name": "efekt/kapi_carpma", "at": 1.45, "volume": 0.7}]},
        ins(SON - SONY, SONY, [[SONY, 560, 700, 1.9], [SON, 555, 690, 2.05]]),
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
    print(f"toplam {SON:.1f} sn", {k: round(v, 2) for k, v in dict(A1=A1, GAG=GAG, CIK=CIK, A2=A2, ZA=ZA, ZT=ZT, OP=OP, E1=E1, AN=AN, SONY=SONY).items()})


def kare(adlar):
    os.makedirs(f"{K}/out/b7kare", exist_ok=True)
    for a in adlar:
        p = {"t0": float(a), "cam": [[0, 560, 960, 1.05]], **SALON}
        json.dump({"text": [json.dumps(p)]}, open(f"{K}/out/b7kare/p.json", "w"))
        subprocess.run(["npx", "remotion", "still", "src/index.ts", "B7Kare", f"out/b7kare/z{a}.png", "--frame=0", "--props=out/b7kare/p.json",
                        f"--browser-executable={TAR}", "--log=error", "--scale=0.35"], cwd=K)


if __name__ == "__main__":
    json_yaz() if sys.argv[1] == "json" else kare(sys.argv[2:])
