"""7/24 B5 parça 2: bölüm JSON üreteci (görüntü yönetmeni). Çıktı: public/episodes/724-05-p2.json"""
import json, sys, os

OUT = "/home/user/Dizi/dizi-studio/public/episodes/724-05-p2.json"
SES = "/home/user/Dizi/dizi-studio/public/episodes/724-05-p2-ses.json"

def J(d):
    return json.dumps(d, ensure_ascii=False, separators=(",", ":"))

def ins(kind, dur, p, **kw):
    b = {"type": "insert", "kind": kind, "dur": round(dur, 3), "text": [J(p)]}
    b.update(kw)
    return b

# ---------------------------------------------------------------- çekimler
# Zamanlar ses planından (724-05-p2-ses.json "plan"): ışık pencereleri, kepenk çarpmaları, vuruşlar, düşüşler, fısıltılar.
SES_PLAN = json.load(open(SES)).get("plan", {})
def pencere_to_dark(win, a, b):
    """ışık AÇIK pencerelerinden çekim içi karanlık aralıkları (çekim a..b, mutlak sn)"""
    on = sorted([(max(a, x), min(b, y)) for x, y in win if y > a and x < b])
    dark, cur = [], a
    for x, y in on:
        if x > cur + 1e-6: dark.append([round(cur - a, 3), round(x - a, 3)])
        cur = max(cur, y)
    if cur < b - 1e-6: dark.append([round(cur - a, 3), round(b - a + 0.5, 3)])
    return dark
ISIK = SES_PLAN.get("isik", {})
WIN = ISIK.get("B_pencereler", []) + [ISIK.get("surekli", [13.4, 33.0])]
SON = ISIK.get("kisa_sonmeler", [])
VUR = SES_PLAN.get("kepenk", {}).get("vuruslar", [])
DUS = [e["t"] for e in SES_PLAN.get("olaylar", []) if e.get("grup") == "bocek" and "raftan düşme" in e.get("olay", "")]
def rel(lst, a, b):
    return [round(x - a, 3) for x in lst if a - 0.6 <= x < b]
def sonme(a, b):
    return [[round(x - a, 3), round(y - a, 3)] for x, y in SON if a <= x < b]

SH = {}
# A 0-5: siyahtan açılış, mutlak sessizlik, her şey donmuş (ışık yanık, kıpırtı yok)
SH["A1"] = (0.0, 2.6, "p2_kasa", {"cam": [[0, 560, 960, 1.0], [2.6, 560, 945, 1.03]], "adim": [[0, 880, 1345, 1.212, 0.15, 7, 0]], "ece": [400, 1330, 1.85], "sabri": True, "acilis": 0.9, "red": 0.1})
SH["A2"] = (2.6, 5.0, "p2_kapi", {"cam": [[0, 545, 1030, 1.22], [2.4, 548, 1022, 1.26]], "eceDuygu": [[0, "dehset"]], "bak": [[0, 0.45, -0.05, 0.15]], "gozyasi": [[0, 0.25]], "sabri": True, "red": 0.1})
# B 5-14: floresan pencereleri; her yanışta böcek bir adım yakın (konum karanlıkta sıçrar)
SH["B1"] = (5.0, 8.6, "p2_kasa", {"cam": [[0, 560, 945, 1.03], [3.6, 560, 930, 1.07]],
                             "adim": [[0, 880, 1345, 1.212, 0.15, 7, 0], [1.28, 810, 1450, 1.385, 0.25, 9.3, 0.15], [2.38, 735, 1590, 1.616, 0.35, 12.1, 0.3]],
                             "ece": [400, 1330, 1.85], "sabri": True, "goz": True, "red": 0.3})
SH["B2"] = (8.6, 11.0, "p2_kapi", {"cam": [[0, 600, 1213, 1.95], [2.4, 600, 1208, 2.04]], "eceDuygu": [[0, "dehset"]], "bak": [[0, 0.45, -0.1, 0.15]], "gozyasi": [[0, 0.35], [2.4, 0.55]], "sabri": True, "sabriBlur": 4, "red": 0.38, "redX": 610, "redY": 1060, "redR": 380})
SH["B3"] = (11.0, 13.8, "p2_kasa", {"cam": [[0, 540, 820, 1.12], [2.8, 540, 795, 1.18]],
                             "adim": [[0, 640, 2010, 2.3, 0.5, 18, 0.55], [1.53, 600, 2230, 2.65, 0.66, 21, 0.75], [2.38, 565, 2480, 3.0, 0.86, 24.5, 0.95]],
                             "ece": [420, 1250, 2.0], "sabri": True, "sabriBlur": 9, "sabriDx": -130, "goz": True, "red": 0.3})
# C 14-22: üç kepenk çarparak iner; dışarıdan hızlanan vuruşlar
INIS = SES_PLAN.get("kepenk", {}).get("inis", 14.0)
KEP3 = [[-40, 300, INIS - 13.8 + 0.06], [300, 800, INIS - 13.8], [800, 1120, INIS - 13.8 + 0.13]]
SH["C1"] = (13.8, 16.0, "p2_kapi", {"cam": [[0, 540, 1000, 1.08]], "kepenkler": KEP3,
                             "gocuk": [[t, 560, 820, 120, 22] for t in rel(VUR, 13.8, 16.0)],
                             "eceDuygu": [[0, "dehset"], [0.2, "sok"]], "bak": [[0, 0.45, -0.05, 0.15], [0.3, 0.45, -0.05, 0.15], [0.6, -0.5, -0.1, -0.25]], "gozyasi": [[0, 0.4]], "sabri": True, "sabriDuygu": "sok", "red": 0.1})
GP = [[300, 700], [700, 1100], [420, 1350], [800, 560], [250, 1000], [620, 420], [900, 1300]]
SH["C2"] = (16.0, 18.6, "p2_kepenk", {"gocuk": [[t, GP[i % 7][0], GP[i % 7][1], 170, 44] for i, t in enumerate(rel(VUR, 16.0, 18.6))], "cam": [[0, 1.0], [2.6, 1.06]]})
CP = [[300, 700], [760, 900], [500, 520], [160, 1000], [880, 640], [420, 1080], [640, 760], [220, 560], [960, 1050], [560, 980], [340, 880], [720, 600]]
SH["C3"] = (18.6, 22.0, "p2_kapi", {"cam": [[0, 600, 1213, 1.75], [3.4, 600, 1203, 1.88]], "kepenkler": [[-40, 300, -5], [300, 800, -5], [800, 1120, -5]], "agiz": [[0, 0], [0.3, 0], [0.62, 1]],
                             "gocuk": [[t, CP[i % 12][0], CP[i % 12][1], 90, 20] for i, t in enumerate(rel(VUR, 18.6, 22.0))],
                             "eceDuygu": [[0, "dehset"], [0.6, "korkmus"]], "bak": [[0, -0.4, -0.05, -0.1], [0.6, 0.1, 0.05, 0]], "gozyasi": [[0, 0.5], [3.4, 0.85]], "sabri": True, "sabriBlur": 4, "sarsAmp": 6, "irkGoz": True, "red": 0.1})
# D 22-33: raflardan böcek seli (düşüşler ses olaylarına bağlı)
LMP_D = [[[], None], [[], None], [[], 0], [[], 0]]
SH["D1"] = (22.0, 25.0, "p2_koridor", {"cam": [[0, 230, 1120, 2.4], [3, 225, 1125, 2.55]], "cik": [0.0, 3], "dusus": rel(DUS, 22.0, 25.0), "dususYer": [[-1, 3, 1.3, 1.7], [-1, 2, 1.5, 1.9], [-1, 3, 1.6, 2.0]], "lambalar": LMP_D})
SH["D2"] = (25.0, 28.3, "p2_koridor", {"cam": [[0, 540, 920, 1.0], [3.3, 540, 935, 1.06]], "cik": [-3, 0], "erime": [0, 1.0, 0.25], "sel": [0.3, 3.3, 6.0, 1.45], "dusus": rel(DUS, 25.0, 28.3), "dususYer": [[-1, 3, 1.5, 2.6], [1, 3, 1.5, 2.6], [-1, 2, 1.6, 2.8], [1, 2, 1.6, 2.8]], "lambalar": [[[], None], [[], None], [[], 1.2], [[], 0]]})
UCAN = [e["t"] for e in SES_PLAN.get("olaylar", []) if "uçan böcek" in e.get("olay", "")]
SH["D3"] = (28.3, 31.3, "p2_koridor", {"h": 0.2, "vy": 760, "zn": 0.3, "bacakZ": 0.62, "cam": [[0, 540, 960, 1.0], [3, 540, 960, 1.04]], "sel": [-0.3, 1.9, 3.0, 0.25], "erime": [-4.5, 1.0, 0.25], "bacak": True,
                             "dusus": rel(DUS, 28.3, 31.3), "dususYer": [[-1, 3, 1.0, 1.4], [1, 3, 1.0, 1.4]], "ucan": round(UCAN[0] - 28.3, 3) if UCAN else 2.2, "lambalar": [[[], None], [[], 0.6], [[], 0], [[], 0]]})
SH["D4"] = (31.3, 33.0, "p2_kapi", {"cam": [[0, 600, 1240, 1.6], [1.7, 600, 1232, 1.68]], "kepenkler": [[-40, 300, -5], [300, 800, -5], [800, 1120, -5]], "agiz": [[0, 1]], "omuzBocek": [[0, 0.1], [1.7, 1]], "eceDuygu": [[0, "agliyor"]], "gozKapa": [[0, 0.6]], "gozyasi": [[0, 0.8]], "bak": [[0, 0.1, 0.1, 0]], "sabri": True, "sabriBlur": 4, "red": 0.12})
# E 33-39: her şey durur; yalnız kırmızı saat; Sabri'ye uzanır; son çakmada yeri boş
EC = ISIK.get("E_cakma", [37.6, 37.95])
RED_E = {"red": 1.0, "redX": 600, "redY": 1070, "redR": 560, "bgKaranlik": 0.9}
KEP_E = [[-40, 300, -5], [300, 800, -5], [800, 1120, -5]]
SH["E1"] = (33.0, 35.6, "p2_kapi", dict({"cam": [[0, 525, 1100, 1.35], [2.6, 530, 1110, 1.48]], "kepenkler": KEP_E, "kapali": 0, "agiz": [[0, 1]], "omuzBocek": [[0, 1]], "donBocek": 0, "eceDuygu": [[0, "korkmus"]], "bak": [[0, 0.1, 0.05, 0]], "gozyasi": [[0, 0.8]], "sabri": False, "titre": 0.6, "hik": 0.35}, **RED_E))
SH["E2"] = (35.6, EC[0], "p2_kapi", dict({"cam": [[0, 530, 1110, 1.48], [2.0, 525, 1130, 1.54]], "kepenkler": KEP_E, "kapali": 0, "agiz": [[0, 1], [0.1, 1], [0.6, 0]], "uzan": [[0, 0], [0.8, 0], [1.9, 1]], "omuzBocek": [[0, 1]], "donBocek": 0,
                             "eceDuygu": [[0, "korkmus"]], "bak": [[0, 0.1, 0.05, 0], [0.5, 0.1, 0.05, 0], [1.1, -0.95, 0.05, -0.4]], "gozyasi": [[0, 0.8]], "sabri": False, "titre": 0.6, "yutkun": round(36.35 - 35.6, 3)}, **RED_E))
SH["E3"] = (EC[0], 39.0, "p2_kapi", dict({"cam": [[0, 525, 1130, 1.54]], "kepenkler": KEP_E, "kapali": 0, "acik": [[0, round(EC[1] - EC[0], 3)]], "uzan": [[0, 1], [0.45, 1], [0.7, 0]], "agiz": [[0, 0], [0.45, 0], [0.62, 1]], "omuzBocek": [[0, 1]], "donBocek": 0,
                             "eceDuygu": [[0, "korkmus"], [0.12, "sok"], [0.5, "agliyor"]], "bak": [[0, -0.95, 0.05, -0.4], [0.5, -0.95, 0.05, -0.4], [0.8, 0.1, 0.05, 0]], "gozyasi": [[0, 0.8], [1.4, 1.0]], "sabri": False, "titre": 0.9, "gozSok": 0.1}, **RED_E))
# F 39-54: binaural fısıltılar; her birine giderek ağırlaşan tepki
F0, FEND = 39.0, SES_PLAN.get("kesme", 54.0)
def yon(az):
    return -1 if az < 0 else 1
FIS = []
for w in SES_PLAN.get("fisiltilar", []):
    FIS.append([round(w["bas"] - F0, 3), "kizim" if w["kim"] == "Anne" else "ece", yon(w["yol"][0][1]), round(w["son"] - F0, 3), yon(w["yol"][-1][1])])
def fparams(fis, dur):
    w = [x[0] for x in fis]
    kac = round(48.5 - F0, 3)  # Ece'nin kaçırdığı titrek nefes
    return {
        "cam": [[0, 1.0, 560, 760], [w[0], 1.1, 560, 760], [w[3], 1.22, 600, 765], [w[4], 1.28, 650, 770], [dur, 1.38, 760, 775]],
        "fis": fis,
        "duygu": [[0, "agliyor"], [3.0, "korkmus"], [w[1], "agliyor"], [w[2] + 0.4, "korkmus"], [w[4], "dehset"]],
        "dudak": [[0, 0], [w[1], 0], [w[1] + 0.25, 1], [w[2] + 0.4, 0.5], [w[3], 0.9], [kac, 0.6]],
        "gozyasi": [[0, 0.7], [w[1], 0.7], [w[1] + 1.0, 1.0], [dur, 1.0]],
        "gozKapa": [[0, 0], [w[2], 0], [w[2] + 0.2, 0.9], [w[2] + 0.75, 0.9], [w[2] + 1.0, 0], [kac, 0], [kac + 0.12, 0.8], [kac + 0.5, 0]],
        "agiz": [[0, 1], [1.8, 1], [3.0, 0], [kac + 0.05, 0], [kac + 0.3, 1]],
        "golge": [w[5] + 1.2, w[5] + 2.6],
        "golgeYon": fis[5][4],
        "sok": [[0, 0], [round(42.15 - F0, 2), 0], [round(42.3 - F0, 2), 0.45], [round(43.2 - F0, 2), 0], [w[4], 0], [w[4] + 0.15, 0.7], [dur, 0.8]],
        "donma": round(w[5] + 0.25, 3),
        "yazi": True,
        "red": 1.0,
    }
SH["F"] = (F0, FEND, "p2_fisilti", fparams(FIS, FEND - F0))
# karanlıklar: B'de ışık pencerelerinin dışı; C'de kısa sönmeler (ses planı)
for k in ("B1", "B2", "B3"):
    a, b, _, p = SH[k]
    p["dark"] = pencere_to_dark(WIN, a, b)
for k in ("C1", "C2", "C3"):
    a, b, _, p = SH[k]
    d = sonme(a, b)
    if d: p["dark"] = d
ORDER = [("a", ["A1", "A2"]), ("b", ["B1", "B2", "B3"]), ("c", ["C1", "C2", "C3"]), ("d", ["D1", "D2", "D3", "D4"]), ("e", ["E1", "E2", "E3"]), ("f", ["F"])]
TITLES = {"a": "Donmuş an (kim nerede)", "b": "Floresan titremesi", "c": "Kepenkler", "d": "Böcek seli", "e": "Karanlık: Sabri yok", "f": "Ensede fısıltı", "g": "Kararma"}

def build():
    scenes = []
    for sid, shots in ORDER:
        beats = []
        for k in shots:
            a0, b0, kind, p = SH[k]
            b = ins(kind, b0 - a0, p)
            if k == "A1":
                b["ekle"] = {"kind": "p2_kulaklik", "text": [J({"aralik": [0.5, 99]})]}
            if k == "A2":
                b["ekle"] = {"kind": "p2_kulaklik", "text": [J({"aralik": [-1, 2.0]})]}
            b["_ad"] = k
            beats.append(b)
        sc = {"id": sid, "set": "market_kapi", "time": "gunduz", "saat": "06:03", "title": TITLES[sid], "transition": "kesme", "cast": {}, "beats": beats}
        if sid == "a" and SES_PLAN:
            sc["music"] = {"name": "efekt/b5p2_tam", "volume": 1.0}
        scenes.append(sc)
    scenes.append({"id": "g", "set": "market_kapi", "time": "gunduz", "saat": "06:03", "title": TITLES["g"], "transition": "kesme", "cast": {}, "beats": [{"type": "action", "dur": round(SES_PLAN.get("toplam_sure", 56.0) - FEND, 3), "siyah": True, "_ad": "G"}]})
    return scenes

def main():
    scenes = build()
    # ses planı (varsa): sfx/ambience/music aynen aktarılır (sync.py)
    for s in scenes:
        for b in s["beats"]:
            b.pop("_ad", None)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": "724-05-p2", "episodeNo": 5, "title": "Bölüm 5 · Parça 2", "endCard": False, "scenes": scenes}
    json.dump(ep, open(OUT, "w"), ensure_ascii=False, indent=1)
    t = 0
    for s in scenes:
        for b in s["beats"]:
            t += b["dur"]
    print("toplam", round(t, 2))

if __name__ == "__main__":
    main()
