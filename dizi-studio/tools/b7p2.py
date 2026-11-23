"""7/24 B7 Parça 2 ("Ayna"): Ece aynada yüzünü yıkar, kendini azarlar, parayı hesaplar, karar verir.
Kullanım: python3 tools/b7p2.py [json | kare sn ...]
Replikler kullanıcının metninden AYNEN (docs/diziler/724/bolumler.md "Bölüm 7, Parça 2").
Sahne: banyo ayna görünümü (Ece'nin yansıması), b7_banyo view=ayna; P1 sonundaki pijama/topuz sürekliliği.
MANTIK: yıkarken başını lavaboya eğer (yansıma alçalır), elleri lavaboda (ayna altında görünmez), avuçla yüze; su açık → kapanır.
 Azar: kendine öfkeli, yumruğunu aynaya sallar. Duraksama: damla süzülür, gözler kayar, yavaşça aç gözlü sırıtış.
 "olummmm": elleri yanaklarında, parmak uçlarında zıplar. Karar: eller iner, baş sallar, kararlı bakış.
"""
import json, os, subprocess, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAN = json.load(open(f"{K}/public/voice/724-07-p2/cekim/manifest.json"))
TAR = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell"
sure = lambda tk: MAN[tk]["duration"]
konus = lambda t, tk: {"t": t + 0.08, "cues": MAN[tk]["mouth"]}

T = {"yika": 0.0, "S1": 3.9}
T["dur"] = T["S1"] + sure("S1a_01") + 0.1
T["S2"] = T["dur"] + 1.7
T["S3"] = T["S2"] + sure("S2b_01") + 0.45
T["son"] = T["S3"] + sure("S3b_01") + 0.2
SON = T["son"] + 0.9
s1, du, s2, s3, sn = T["S1"], T["dur"], T["S2"], T["S3"], T["son"]
OL = s2 + 3.3  # "olummmm" başlangıcı (S2 çekiminde ~3,3 sn)

X, Y, SZ = 540, 1790, 1320
LAV_L, LAV_R = (470, 1420), (610, 1420)   # eller lavaboda (aynanın altında, görünmez)
YUZ_L, YUZ_R = (510, 850), (570, 850)     # avuçlar yüzde
ECE = {
    "yer": [[0, X, Y + 70, SZ], [0.9, X, Y + 70, SZ], [1.2, X, Y + 30, SZ], [1.9, X, Y + 30, SZ], [2.1, X, Y + 70, SZ], [2.4, X, Y + 30, SZ],
            [3.1, X, Y + 30, SZ], [3.6, X, Y, SZ], [OL, X, Y, SZ], [OL + 0.15, X, Y - 25, SZ], [OL + 0.3, X, Y, SZ], [OL + 0.45, X, Y - 25, SZ],
            [OL + 0.6, X, Y, SZ], [s3 + 1.4, X, Y, SZ], [s3 + 1.55, X, Y + 12, SZ], [s3 + 1.75, X, Y, SZ]],
    "dogalKol": True, "elLara": [[-99, 99]], "elRara": [[-99, 99]],
    "elL": [[0, *LAV_L], [0.9, *LAV_L], [1.3, *YUZ_L], [1.5, 495, 825], [1.65, 510, 805], [1.8, 495, 825], [2.15, *LAV_L],
            [2.35, *LAV_L], [2.7, *YUZ_L], [2.85, 495, 825], [3.0, 510, 805], [3.2, 500, 870], [3.6, 470, 1180], [3.9, 460, 1300],
            [s2 - 0.3, 460, 1300], [s2 + 0.2, 515, 1090], [s2 + 0.5, 530, 1075], [s2 + 0.8, 515, 1090], [s2 + 1.1, 530, 1075], [s2 + 1.4, 515, 1090],
            [s2 + 1.7, 530, 1075], [s2 + 2.0, 515, 1090], [s2 + 2.3, 530, 1075], [OL - 0.1, 520, 1080], [OL + 0.15, 470, 810], [s3, 470, 810],
            [s3 + 0.4, 460, 1300]],
    "elR": [[0, *LAV_R], [0.9, *LAV_R], [1.3, *YUZ_R], [1.5, 585, 825], [1.65, 570, 805], [1.8, 585, 825], [2.15, *LAV_R],
            [2.35, *LAV_R], [2.7, *YUZ_R], [2.85, 585, 825], [3.0, 570, 805], [3.2, 580, 870], [3.6, 610, 1180], [3.9, 620, 1300],
            [s1 + 1.0, 620, 1300], [s1 + 1.3, 655, 980], [s1 + 1.55, 665, 950], [s1 + 1.8, 655, 980], [s1 + 2.05, 665, 950], [s1 + 2.3, 655, 980],
            [s1 + 3.2, 655, 990], [du + 0.2, 620, 1300],
            [s2 - 0.3, 620, 1300], [s2 + 0.2, 565, 1090], [s2 + 0.5, 550, 1075], [s2 + 0.8, 565, 1090], [s2 + 1.1, 550, 1075], [s2 + 1.4, 565, 1090],
            [s2 + 1.7, 550, 1075], [s2 + 2.0, 565, 1090], [s2 + 2.3, 550, 1075], [OL - 0.1, 560, 1080], [OL + 0.15, 610, 810], [s3, 610, 810],
            [s3 + 0.4, 620, 1300]],
    "duygu": [[0, "notr"], [s1, "ofkeli"], [du + 0.4, "dusunceli"], [du + 1.1, "zorGulumse"], [s2, "mutlu"], [s3, "kararli"]],
    "goz": [[0, 0.3], [1.25, 0.3], [1.35, 1], [1.85, 1], [2.0, 0.4], [2.6, 0.4], [2.7, 1], [3.3, 1], [3.6, 0]],
    "gozSok": [[0, 0], [du + 1.0, 0], [du + 1.5, 0.5], [s2, 0.5], [s2 + 0.3, 0.8], [OL, 1], [s3, 1], [s3 + 0.2, 0]],
    "bak": [[0, 0, 0.7, 0], [3.4, 0, 0.7, 0], [3.7, 0, 0, 0], [s1, 0, 0, 0], [du + 0.5, 0, 0.05, 0], [du + 0.9, 0.55, -0.45, 0.15],
            [du + 1.6, 0.55, -0.45, 0.15], [s2, 0, -0.1, 0], [s2 + 1.5, -0.5, -0.4, -0.1], [s2 + 2.6, 0.5, -0.4, 0.1], [OL, 0, 0, 0], [sn, 0, 0, 0],
            [sn + 0.4, -0.7, 0.1, -0.5]],
    "tilt": [[0, 0], [s1, 0], [s1 + 0.4, -6], [s1 + 1.8, 6], [s1 + 3.0, -4], [du, 0], [du + 1.0, 0], [du + 1.5, 7], [s2, 7], [s2 + 0.4, 0],
             [OL, 0], [OL + 0.2, -8], [OL + 0.4, 8], [OL + 0.6, -8], [OL + 0.8, 0]],
    "islak": [[0, 0], [1.4, 0], [1.6, 1], [s3, 1], [SON, 0.6]],
    "sacDagin": True,
    "konus": [konus(s1, "S1a_01"), konus(s2, "S2b_01"), konus(s3, "S3b_01")],
}
ORT = {"view": "ayna", "titre": 2.5, "isik": 0.5, "ece": ECE, "su": [[0, 3.45]]}


def b7(t0, cam, **ek):
    p = {"t0": t0, "cam": cam, **ORT}
    p.update(ek)
    return {"kind": "b7_banyo", "text": [json.dumps(p, ensure_ascii=False)]}


def vuruslar():
    V = [{"type": "insert", "dur": round(s1, 3), **b7(0, [[0, 540, 900, 1.25], [s1, 540, 860, 1.35]]),
          "sfx": [{"name": "efekt/el_yuz_yikama", "at": 0.0, "volume": 0.75}]}]
    V.append({"type": "line", "who": "ece_ev", "text": "Saçmalama Ece ölüyodun lan canından daha mı değerli", "emotion": "notr", "gapAfter": 0.1,
              "_take": "S1a_01", "ekle": b7(s1, [[s1, 540, 820, 1.65], [du, 540, 805, 1.8]])})
    V.append({"type": "insert", "dur": round(s2 - du, 3), **b7(du, [[du, 540, 805, 1.8], [s2, 540, 790, 2.25]])})
    V.append({"type": "line", "who": "ece_ev", "text": "Günlük bu kadar çalışsam 1 haftalık maaşım 1 yıllık maaşım yapıyo olummmm", "emotion": "notr",
              "gapAfter": 0.45, "_take": "S2b_01",
              "ekle": b7(s2, [[s2, 540, 840, 1.55], [OL, 540, 830, 1.7], [OL + 0.004, 540, 790, 2.3], [s3, 540, 785, 2.4]]),
              "sfx": [{"name": "efekt/el_kaching", "at": OL - s2, "volume": 0.35}]})
    V.append({"type": "line", "who": "ece_ev", "text": "Gidip Sabri abiye olanları bir sorayım en iyisi", "emotion": "notr", "gapAfter": 0.2,
              "_take": "S3b_01", "ekle": b7(s3, [[s3, 540, 830, 1.6], [sn, 540, 815, 1.75]])})
    V.append({"type": "insert", "dur": round(SON - sn, 3), **b7(sn, [[sn, 540, 815, 1.75], [SON, 540, 815, 1.75]])})
    return V


def json_yaz():
    beats = vuruslar()
    man = {}
    for i, b in enumerate(beats):
        if b["type"] == "line":
            man[f"a_{i + 1:02d}"] = MAN[b.pop("_take")]
    os.makedirs(f"{K}/public/voice/724-07-p2", exist_ok=True)
    json.dump(man, open(f"{K}/public/voice/724-07-p2/manifest.json", "w"), ensure_ascii=False, indent=1)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": "724-07-p2", "episodeNo": 7, "title": "Bölüm 7 · Parça 2", "endCard": False,
          "scenes": [{"id": "a", "set": "banyo_ayna", "time": "gunduz", "title": "Ayna", "transition": "kesme", "cast": {},
                      "music": {"name": "muzik/banyo_komik", "volume": 0.16}, "ambience": {"name": "ortam/banyo_sabah", "volume": 0.2}, "beats": beats}]}
    json.dump(ep, open(f"{K}/public/episodes/724-07-p2.json", "w"), ensure_ascii=False, indent=1)
    print(f"toplam {SON:.1f} sn", {k: round(v, 2) for k, v in T.items()}, "olum", round(OL, 2))


def kare(adlar):
    os.makedirs(f"{K}/out/b7kare", exist_ok=True)
    for a in adlar:
        p = {"t0": float(a), "cam": [[0, 540, 860, 1.4]], **ORT}
        json.dump({"text": [json.dumps(p)]}, open(f"{K}/out/b7kare/p.json", "w"))
        subprocess.run(["npx", "remotion", "still", "src/index.ts", "B7Kare", f"out/b7kare/y{a}.png", "--frame=0", "--props=out/b7kare/p.json",
                        f"--browser-executable={TAR}", "--log=error", "--scale=0.35"], cwd=K)


if __name__ == "__main__":
    json_yaz() if sys.argv[1] == "json" else kare(sys.argv[2:])
