"""7/24 B8 (yeni) Parça 3, 10'ar saniyelik bölümler. Bölüm a (3p1b, 0-10 sn): birinci şahıs kaçış.
Kullanım: python3 tools/b8y_p3.py  -> public/episodes/724-08y-p3a.json
Metin: bolumler.md "Bölüm 8 (YENİ), Parça 3" (kullanıcının metni AYNEN). Görüntü: Inserts19 "b8_fps".
Zamanlar (sn): koşu 0-3,2 · düşüş 3,2-3,65 · eller 3,65-4,6 · baş arkaya 4,6-5,25 · yaratık 5,25-6,4 ·
geri geri sürünme 6,4-8,6 · dönüp kalkar 8,6-9,15 · markete koşar 9,15-10.
"""
import json, os

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SURE = 10.0
T_DUS, T_YER, T_DON, T_BAK, T_SUR, T_KALK, T_KOS = 3.2, 3.65, 4.6, 5.25, 6.4, 8.6, 9.15

# kamera: [t, x, y, z, yaw°, pitch°, roll°]  (yaw 0 = markete, 180 = arkaya; pitch + = aşağı)
KAM = [[0, 0, 1.62, 0, 0, 1, 0], [T_DUS, 0.1, 1.62, 16, 0, 1, 0],
       [T_DUS + 0.18, 0.15, 1.1, 16.9, 3, 25, -6], [T_YER, 0.2, 0.42, 17.3, 6, 54, -10],
       [T_YER + 0.25, 0.2, 0.46, 17.35, 5, 52, -7], [T_DON, 0.2, 0.47, 17.35, 4, 50, -5],
       [T_DON + 0.25, 0.2, 0.55, 17.4, 70, 30, 6], [T_BAK, 0.2, 0.62, 17.4, 182, 6, 2],
       [T_BAK + 0.6, 0.2, 0.62, 17.42, 181, 8, 0], [T_SUR, 0.2, 0.64, 17.45, 181, 21, 0], [T_KALK - 0.1, 0.25, 0.64, 18.7, 179, 22, 0],
       [T_KALK + 0.25, 0.25, 1.0, 18.8, 270, 5, -4], [T_KOS, 0.2, 1.62, 18.9, 360, 1, 0],
       [SURE, 0.15, 1.62, 22.6, 360, 1, 0]]
SALLAN = [[0, 1, 2.9], [T_DUS - 0.05, 1, 2.9], [T_DUS + 0.05, 0, 2.9], [T_SUR - 0.05, 0, 1.0], [T_SUR + 0.1, 0.35, 1.0],
          [T_KALK - 0.1, 0.35, 1.0], [T_KALK + 0.05, 0, 2.9], [T_KOS - 0.05, 0, 2.9], [T_KOS + 0.25, 1, 2.9], [SURE, 1, 2.9]]
SARS = [[0, 0], [T_YER - 0.03, 0], [T_YER, 1], [T_YER + 0.25, 0]]
EL = [[0, 0], [T_YER - 0.12, 0], [T_YER + 0.02, 1], [T_DON - 0.05, 1], [T_DON + 0.15, 0]]
BACAK = [[0, 0], [T_DON + 0.45, 0], [T_BAK + 0.1, 1], [T_KALK - 0.05, 1], [T_KALK + 0.2, 0]]
# diz bükülmesi [sol, sağ]: sürünürken dönüşümlü it (her itiş ~0,55 sn)
BUK = [[0, 0.25, 0.55], [T_SUR, 0.25, 0.55]]
t, sira = T_SUR, 0
while t < T_KALK - 0.3:
    t += 0.55
    sira ^= 1
    BUK.append([round(t, 3), 0.9 if sira else 0.15, 0.15 if sira else 0.9])
BUK.append([T_KALK, 0.5, 0.5])
# yaratık: [t, x, z, adım fazı]; arkadan yaklaşır (~2,7 m/sn), uzun ağır adımlar
YARATIK = [[0, 0.3, -14.0, 0], [SURE, 0.3, 12.0, 30]]
KIRMIZI = [[0, 0], [T_BAK, 0], [T_BAK + 0.4, 1], [T_KALK, 0.6], [T_KOS, 0]]

PRM = {"t0": 0, "kam": KAM, "sallan": SALLAN, "sars": SARS, "el": EL, "bacak": BACAK, "buk": BUK,
       "yaratik": YARATIK, "yaratikGor": [[0, 1]], "kirmizi": KIRMIZI}


def E(isim, t, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t, 3), "volume": vol, **kw}


# geçici ses (kütüphaneden, ücretsiz); ElevenLabs efektleri kullanıcı onayıyla eklenecek
SFX = [E("kosma", 0.0, 0.6, sure=T_DUS + 0.1), E("nefes_kesilme", 0.2, 0.55), E("el_deri_dusme", T_YER - 0.05, 0.8),
       E("korku_vurus", T_BAK - 0.05, 0.55), E("nefes_kesilme", T_BAK + 0.3, 0.6), E("kosma", T_KOS, 0.6)]

if __name__ == "__main__":
    ep_id = "724-08y-p3a"
    beat = {"type": "insert", "dur": SURE, "kind": "b8_fps", "text": [json.dumps(PRM, separators=(",", ":"))], "sfx": SFX}
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Ara sokak · kaçış", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/ruzgar", "volume": 0.45}, "music": {"name": "yok"}, "beats": [beat]}
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 8, "title": "Bölüm 8 · Parça 3 (a)", "endCard": False, "scenes": [sah]}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)
    print("tamam", ep_id, SURE, "sn")
