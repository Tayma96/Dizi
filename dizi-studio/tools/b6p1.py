"""7/24 B6 Parça 1 ("Gün ağarıyor") çekim senaryosu üretici.

Kullanım:
  python3 tools/b6p1.py json                 -> public/episodes/724-06.json
  python3 tools/b6p1.py kare A6:1.0 B5:3.0   -> out/b6kare/<ad>.png (çekim:çekim-içi sn), kontrol kareleri
Bütün anahtar kareler SAHNE zamanında (Inserts13 sözleşmesi); her çekim t0 = çekimin sahnedeki başlangıcı.
"""
import json, os, subprocess, sys

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARAYICI = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"

# ---------------------------------------------------------------- Sahne A: gece → kepenk → ışık → çöküş (0–25 sn)
GECE = {
    "ac": [[3.0, 0], [3.6, 0.03], [12, 0.4], [18, 1.0]],
    "acGecik": [0.0, 0.06, 0.03],
    "tanA": [[0, 0.38], [19, 0.38], [24, 0.62]],
    "gunes": [[2.9, 0], [3.3, 1]],
    "gunesY": [[3, 0], [20, 1]],
    "eceYer": [[0, 0.25, 3.3]],
    "eceOtur": [[19.0, 0], [19.55, 1]],
    "eceDuygu": [[0, "dehset"], [9, "korkmus"], [18.6, "agliyor"]],
    "eceHickir": [[18.8, 0], [19.6, 1]],
    "eceAgla": [[18.8, 0], [19.6, 0.6]],
    "eceBak": [[0, 0.1, 0.1, 0], [3.4, 0.05, 0.25, 0], [9, 0, 0.3, 0], [19, 0, 0.15, 0]],
    "eceKol": [[0, -30, -150, 0.5, -30, -150, 0.5], [8, -30, -150, 0.5, -30, -150, 0.5], [9.5, 6, 0, 1, 6, 0, 1]],
    "agizKapa": [[0, 1], [8, 1], [9.2, 0]],
    "gozyasi": [[0, 0.6], [19, 1]],
    "eceBocek": True,
    "saat": [[0, "07:24"]],
}
# (ad, tür, başlangıç, süre, ek parametre)
A = [
    ("A1", "b6_kapi", 0.0, 1.3, {"acilis": 1000, "cam": [[0, 540, 700, 1.25]]}),  # siyah: B5 fısıltı kuyruğu
    ("A2", "b6_kapi", 1.3, 1.7, {"acilis": 0.7, "cam": [[1.3, 540, 520, 1.7], [3.0, 540, 560, 1.6]]}),  # saat 07:24, KLAK
    ("A3", "b6_kapi", 3.0, 3.5, {"cam": [[3.0, 540, 1000, 1.0], [6.5, 540, 1010, 1.06]]}),  # kepenk kalkar, hüzmeler
    ("A4", "b6_dis", 6.5, 2.3, {}),  # dışarıdan: güneşin ucu
    ("A5", "b6_kapi", 8.8, 3.0, {"cam": [[8.8, 560, 1420, 1.5], [11.8, 590, 1400, 1.6]]}),  # zemin: ışık sınırı ilerler, böcekler toza
    ("A6", "b6_kapi", 11.8, 3.2, {"cam": [[11.8, 640, 1330, 1.55], [15.0, 650, 1270, 1.65]]}),  # ışık Ece'nin bacaklarına
    ("A7", "b6_kapi", 15.0, 2.2, {"cam": [[15.0, 677, 960, 2.5], [17.2, 677, 965, 2.65]]}),  # yanaktaki son böcek
    ("A8", "b6_kapi", 17.2, 4.3, {"sel": False, "tozIzi": 0.8, "cam": [[17.2, 590, 1180, 1.12], [21.5, 600, 1250, 1.2]]}),  # çöküş
    ("A9", "b6_kapi", 21.5, 3.5, {"sel": False, "tozIzi": 0.8, "cam": [[21.5, 670, 1300, 1.8], [25.0, 675, 1290, 1.9]]}),  # oturmuş, ağlıyor
]

# ---------------------------------------------------------------- Sahne B: 07:30 sabah, Sabri (0–16,5 sn; -1,4 saat çekimi)
SABAH = {
    "ac": [[0, 1]], "gunes": [[0, 1]], "tanA": [[0, 0.75]], "gun": [[0, 1]], "gunesY": [[0, 1]], "floresan": [[0, 1]],
    "sel": False, "eceBocek": False, "red": 0, "tozIzi": 0.6,
    "saat": [[-9, "07:29"], [-0.8, "07:30"]],
    "eceYer": [[0, 0.25, 3.3]], "eceOtur": [[0, 1]],
    "eceDuygu": [[0, "agliyor"], [5.0, "dehset"], [6.4, "agliyor"]],
    "eceHickir": [[0, 1], [4.9, 1], [5.0, 0], [6.4, 0], [6.8, 1]],
    "eceAgla": [[0, 0.55]], "eceGoz": [[0, 0]],
    "eceBak": [[0, 0, 0.25, 0], [4.9, 0, 0.25, 0], [5.1, -0.5, -0.05, -0.35], [7.0, -0.3, 0.05, -0.2]],
    # yumruk: 9,4'te sağ kol Sabri'nin göğsüne (yalnız bir kez), sonra çözülür
    "eceKol": [[0, 15, -95, 0.9, 15, -95, 0.9], [4.9, 15, -95, 0.9, 15, -95, 0.9], [5.15, -20, -150, 0.6, -20, -150, 0.6],
               [6.4, -20, -150, 0.6, -20, -150, 0.6], [7.2, 10, -60, 0.9, 10, -60, 0.9],
               [9.1, 10, -60, 0.9, 10, -60, 0.9], [9.3, 140, -30, 1.0, 10, -60, 0.9], [9.6, 60, -80, 0.9, 10, -60, 0.9],
               [10.4, 10, -60, 0.9, 10, -60, 0.9]],
    "eceIrk": [5.0], "eceKonus": [[5.0, 6.3]], "gozyasi": [[0, 1]],
    "eceTilt": [[0, 0], [9.8, 0], [10.6, -10]], "eceEgil": [[0, 0], [9.8, 0], [10.6, -8]],
    "kapi": [[0, 0], [0.5, 1]],
    "sabri": {"yol": [[0, 0.0, -0.35], [3.2, -0.2, 2.9], [6.5, -0.2, 2.9], [7.4, -0.12, 3.1]],
              "yuru": [[0.2, 3.2], [6.5, 7.3]], "diz": [[0, 0], [6.6, 0], [7.6, 1]],
              "saril": [[0, 0], [7.6, 0], [8.8, 1]], "duygu": [[0, "uzgun"]],
              "konus": [[3.3, 4.8], [7.7, 11.0]], "bak": [[0, 0.3, 0.3, 0.2], [3, 0.5, 0.45, 0.35]],
              "egil": [[0, 0], [7.4, 0], [8.6, 9]], "darbe": [9.4], "bukum": 1},
}
B = [
    ("B1", "b6_kapi", -1.4, 1.4, {"cam": [[-1.4, 540, 380, 2.3], [0, 540, 390, 2.2]]}),  # saat 07:29 → 07:30
    ("B2", "b6_kapi", 0.0, 3.2, {"cam": [[0, 540, 1060, 1.0], [3.2, 540, 1080, 1.05]]}),  # Sabri girer, ışıktan geçer
    ("B3", "b6_kapi", 3.2, 1.7, {"cam": [[3.2, 470, 860, 1.9], [4.9, 470, 860, 1.95]]}),  # "bitti artık"
    ("B4", "b6_kapi", 4.9, 1.7, {"cam": [[4.9, 677, 1240, 2.2], [6.6, 677, 1240, 2.1]]}),  # "aaaaa"
    ("B5", "b6_kapi", 6.6, 1.1, {"cam": [[6.6, 560, 1330, 1.4], [11.5, 580, 1340, 1.55]]}),  # diz çöker
    ("B5s", "b6_kapi", 7.7, 3.3, {"cam": [[6.6, 560, 1330, 1.4], [11.5, 580, 1340, 1.55]]}),  # sarılır, "Şhh", yumruk
    ("B5c", "b6_kapi", 11.0, 0.5, {"cam": [[6.6, 560, 1330, 1.4], [11.5, 580, 1340, 1.55]]}),
    ("B6", "b6_kapi", 11.5, 5.0, {"cam": [[11.5, 600, 1290, 1.8], [16.5, 605, 1285, 1.95]]}),  # hıçkırık
]


# replik çekimleri: ses tam miksin içinde (efekt/b6p1_tam); burada yalnız altyazı için line + ekle
SATIR = {"B3": ("sabri", "bitti artık"), "B4": ("ece_sivil", "aaaaa"), "B5s": ("sabri", "Şhh bitti kızım bitti tamam")}


def prm(sahne, ad, t0, ek):
    p = dict(sahne)
    p.update(ek)
    p["t0"] = t0
    return p


def cekimler():
    for ad, tur, t0, dur, ek in A:
        yield ad, tur, t0, dur, prm(GECE, ad, t0, ek)
    for ad, tur, t0, dur, ek in B:
        yield ad, tur, t0, dur, prm(SABAH, ad, t0, ek)


def json_yaz():
    def beat(ad, tur, dur, p):
        txt = [json.dumps(p, ensure_ascii=False)]
        if ad in SATIR:
            who, metin = SATIR[ad]
            return {"type": "line", "who": who, "text": metin, "sure": dur, "gapAfter": 0, "ekle": {"kind": tur, "text": txt}}
        return {"type": "insert", "kind": tur, "dur": dur, "text": txt}
    sa = [beat(ad, t, d, p) for ad, t, t0, d, p in cekimler() if ad[0] == "A"]
    sb = [beat(ad, t, d, p) for ad, t, t0, d, p in cekimler() if ad[0] == "B"]
    ep = {
        "series": "724", "seriesTitle": "7/24", "episode": "724-06", "episodeNo": 6,
        "title": "Bölüm 6 · Parça 1", "endCard": False,
        "scenes": [
            {"id": "a", "set": "market_kapi", "time": "gece", "saat": "07:24", "title": "Gün ağarıyor",
             "transition": "kesme", "cast": {}, "beats": sa, "music": {"name": "efekt/b6p1_tam", "volume": 1.0}},
            {"id": "b", "set": "market_kapi", "time": "gunduz", "saat": "07:30", "title": "Gerçek Sabri",
             "transition": "kesme", "cast": {}, "beats": sb},
        ],
    }
    yol = os.path.join(KOK, "public/episodes/724-06.json")
    json.dump(ep, open(yol, "w"), ensure_ascii=False, indent=1)
    top = sum(d for _, _, _, d, _ in cekimler())
    print(yol, f"{top:.1f} sn")


def kare(isimler):
    os.makedirs(os.path.join(KOK, "out/b6kare"), exist_ok=True)
    tum = {ad: (tur, t0, dur, p) for ad, tur, t0, dur, p in cekimler()}
    for i in isimler:
        ad, t = i.split(":")
        tur, t0, dur, p = tum[ad]
        fr = 0
        q = dict(p); q["t0"] = t0 + float(t)  # kompozisyon 3 sn: zamanı t0 ile kaydır
        q.pop("acilis", None) if float(t) > 0.8 else None
        props = {"kind": tur, "text": [json.dumps(q)]}
        pf = os.path.join(KOK, f"out/b6kare/p_{ad}.json")
        json.dump(props, open(pf, "w"))
        out = os.path.join(KOK, f"out/b6kare/{ad}_{t}.png")
        r = subprocess.run(["npx", "remotion", "still", "src/index.ts", "B6P1Kare", out, f"--frame={fr}", f"--props={pf}",
                            f"--browser-executable={TARAYICI}", "--log=error", "--scale=0.5"], cwd=KOK, capture_output=True, text=True)
        print(out if r.returncode == 0 else r.stderr[-1500:])


if __name__ == "__main__":
    if sys.argv[1] == "json":
        json_yaz()
    else:
        kare(sys.argv[2:])
