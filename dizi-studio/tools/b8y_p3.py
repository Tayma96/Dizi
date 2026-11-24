"""7/24 B8 (yeni) Parça 3, 10'ar saniyelik bölümler. Bölüm a (3p1b, 0-10 sn): birinci şahıs kaçış.
Kullanım: python3 tools/b8y_p3.py  -> public/episodes/724-08y-p3a.json
Metin: bolumler.md "Bölüm 8 (YENİ), Parça 3" (kullanıcının metni AYNEN). Görüntü: Inserts19 "b8_fps".
Koreografi (sn):
  0,00-3,00 koşu: her basışta sert iniş + sarsıntı, öne eğik, omuz yalpası; ilerde eğik "7/24"
  3,00-3,38 ayak takılır → öne savrulur → YERE ÇARPAR (sarsıntı, bir anlık kararma, eller asfalta çarpar)
  3,38-4,35 dört ayak üstünde: titreme, nefes; baş ellerden yola kalkar
  4,20      arkadan ses (yaratık) → 4,35-4,60 donar, başını YAVAŞÇA çevirmeye başlar (dehşet)
  4,60-4,95 baş hızla arkaya döner (saç kadrajı süpürür) → 5,15 oturur
  5,15-6,30 yaratık: durur, başını yana yatırır, seğirir; kalp nabzı, kamera yaratığa çekilir (dolly zoom)
  6,30-8,50 bacaklarla geri itme: 4 itiş (her itişte kamera geri kayar), yaratık sarsak hızlı adımlarla gelir
  8,50-8,80 panikle önüne döner (saç), eller yerden iter → 8,80-9,35 sendeleyerek kalkar → 9,35-10 hızlanarak koşar
"""
import json, os

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SURE = 10.0

# kamera: [t, x, y, z, yaw°, pitch°, roll°]   (yaw 0 = markete, 180 = arkaya; pitch + = aşağı)
KAM = [[0, 0, 1.62, 0, 0, 3, 0], [3.0, 0.1, 1.6, 15.0, 0, 3, 0],
       [3.1, 0.12, 1.5, 15.45, 2, 18, -7], [3.38, 0.2, 0.34, 16.6, 7, 68, -15],
       [3.55, 0.2, 0.36, 16.68, 6, 64, -11], [4.2, 0.2, 0.42, 16.7, 4, 48, -6],
       [4.35, 0.2, 0.43, 16.7, 6, 40, -4], [4.6, 0.2, 0.47, 16.7, 30, 28, 2],
       [4.95, 0.22, 0.6, 16.75, 188, 4, 5], [5.15, 0.22, 0.62, 16.75, 180, 6, 1],
       [6.2, 0.22, 0.62, 16.76, 180, 9, 0], [6.4, 0.22, 0.63, 16.78, 180, 12, 0]]
z, BUK = 16.78, [[0, 0.1, 0.1], [6.4, 0.1, 0.1]]
for i in range(4):
    ts = 6.4 + i * 0.52
    sol = i % 2 == 0
    KAM.append([round(ts + 0.2, 3), 0.22, 0.6, round(z + 0.08, 3), 180 + (2 if sol else -2), 14, 2 if sol else -2])      # diz bükülür, gövde iner
    z += 0.34
    KAM.append([round(ts + 0.52, 3), 0.22, 0.64, round(z, 3), 180, 11, 0])                                             # itiş: geri kayar
    BUK.append([round(ts + 0.2, 3), 0.6 if sol else 0.1, 0.1 if sol else 0.6])
    BUK.append([round(ts + 0.52, 3), 0.12, 0.12])
KAM += [[8.55, 0.22, 0.64, z, 180, 11, 0], [8.8, 0.25, 0.55, z, 365, 48, -6],                                         # panikle önüne döner
        [9.1, 0.25, 1.15, z + 0.3, 360, 20, 7], [9.35, 0.22, 1.55, z + 0.9, 358, 6, -4],                              # sendeleyerek kalkar
        [SURE, 0.18, 1.6, z + 3.8, 360, 5, 0]]
SALLAN = [[0, 1, 3.0], [2.95, 1, 3.0], [3.05, 0, 3.0], [9.3, 0, 3.0], [9.65, 1, 3.2], [SURE, 1, 3.2]]
SARS = [[0, 0], [3.37, 0], [3.38, 1.3], [3.75, 0], [9.05, 0], [9.1, 0.4], [9.3, 0]]
TITREME = [[0, 0], [3.5, 0], [3.6, 0.8], [4.35, 0.8], [4.4, 0.2], [5.15, 0.2], [5.3, 0.7], [8.5, 0.7], [8.7, 0]]
KARART = [[0, 0], [3.36, 0], [3.385, 0.75], [3.5, 0]]
SAC = [[0, 9], [4.58, 9], [4.59, 1.25], [4.97, -1.25], [4.98, 9], [8.52, 9], [8.53, -1.25], [8.82, 1.25], [8.83, 9]]
EL = [[0, 0], [3.3, 0], [3.37, 1], [4.35, 1], [4.6, 0], [8.7, 0], [8.82, 1], [9.12, 1], [9.3, 0]]
BACAK = [[0, 0], [5.0, 0], [5.3, 1], [8.5, 1], [8.65, 0]]
FOV = [[0, 1], [5.15, 1], [6.3, 1.28], [8.5, 1.12], [8.62, 1]]
KALP = [[0, 0], [5.0, 0], [5.3, 1], [8.5, 1], [9.5, 0.4], [SURE, 0.3]]
KIRMIZI = [[0, 0], [5.1, 0], [5.6, 0.9], [8.5, 0.7], [9.0, 0]]
# yaratık [t, x, z, adım fazı]: görününce DURUR, başını yatırır; sonra sarsak, aksayan hızlı adımlarla gelir
YARATIK = [[0, 0.4, 2, 0], [5.15, 0.4, 6.75, 0], [5.9, 0.4, 6.75, 0], [6.6, 0.35, 8.4, 4], [6.8, 0.35, 8.6, 4.6],
           [7.6, 0.3, 10.8, 9], [7.75, 0.3, 11.0, 9.5], [8.5, 0.3, 13.0, 14], [SURE, 0.3, 16.5, 22]]
YKAFA = [[0, 0], [5.55, 0], [5.85, 38], [6.2, 38], [6.3, 8]]
YSEG = [[0, 0], [6.3, 0], [6.35, 1], [6.6, 0], [7.6, 0], [7.65, 1], [7.85, 0]]
# doğaçlama (kullanıcı izni): başını yatırdıktan sonra dikey yarık ağız açılır, çığlık; koşarken kapanmaz
YAGIZ = [[0, 0], [5.9, 0], [6.15, 1], [6.9, 0.6], [7.6, 0.9], [SURE, 0.8]]

PRM = {"t0": 0, "kam": KAM, "sallan": SALLAN, "sars": SARS, "titreme": TITREME, "karart": KARART, "sac": SAC, "el": EL,
       "bacak": BACAK, "buk": BUK, "fov": FOV, "kalp": KALP, "kirmizi": KIRMIZI, "yaratik": YARATIK, "yaratikGor": [[0, 1]],
       "yKafa": YKAFA, "ySeg": YSEG, "yAgiz": YAGIZ}


def E(isim, t, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t, 3), "volume": vol, **kw}


# ses yönetmeni: ElevenLabs SFX (b8y3_*) + kütüphaneden kalp atışı
SFX = [
       E("b8y3_adim", 0, 0.7, sure=3.05), E("b8y3_nefes_kosu", 0, 0.75, sure=3.2),
       E("b8y3_dusus", 3.28, 0.95),
       E("b8y3_nefes_korku", 3.55, 0.7),
       E("b8y3_yaratik", 4.15, 0.45),
       E("b8y3_donus", 4.58, 0.65), E("b8y3_sting", 4.8, 0.6),
       E("b8y3_kafa_cit", 5.6, 0.6),
       E("kalp_atisi", 5.2, 0.45, sure=4.6), E("b8y3_ciglik", 5.95, 0.7),
       E("b8y3_surunme", 6.4, 0.75),
       E("b8y3_yaratik", 7.3, 0.6, kirp=1.0),
       E("b8y3_donus", 8.5, 0.6),
       E("b8y3_kalk_kos", 8.78, 0.85),
       E("b8y3_adim", 9.35, 0.7), E("b8y3_nefes_kosu", 9.2, 0.7, kirp=1.0)]

if __name__ == "__main__":
    ep_id = "724-08y-p3a"
    beat = {"type": "insert", "dur": SURE, "kind": "b8_fps", "text": [json.dumps(PRM, separators=(",", ":"))], "sfx": SFX}
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Ara sokak · kaçış", "transition": "kesme", "cast": {},
           "ambience": {"name": "efekt/b8y3_ortam", "volume": 0.5}, "music": {"name": "yok"}, "beats": [beat]}
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 8, "title": "Bölüm 8 · Parça 3 (a)", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    print("tamam", ep_id, SURE, "sn")
