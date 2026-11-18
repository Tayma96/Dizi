# Üretim Rehberi — Dizi Stüdyosu

Bu belge, ekipteki herkesin (kullanıcı + 4 ajan) ortak başvuru kaynağıdır.
Yöntem ve izleyici-tutma ilkeleri için: `docs/arastirma.md`.

> **Kural:** Kullanıcı açıkça istemeden senaryo/hikâye/replik yazılmaz. Ajanlar fikir ve öneri sunar, ama bölüm metnini kullanıcı onaylamadan üretmez.

---

## 1. Üretim hattı (adım adım)

| # | Adım | Sorumlu | Çıktı |
|---|------|---------|-------|
| 1 | Fikir / tema / bölüm özeti | **Kullanıcı** (senarist yardımcısı öneri sunar) | Onaylı bölüm özeti |
| 2 | Senaryo taslağı | Kullanıcı ister → genel yönetmen yazar | `docs/senaryolar/<dizi>/<bolum>.md` |
| 3 | Senaryo incelemesi | **senarist-yardimcisi** | İyileştirme önerileri listesi (kanca, merak, diyalog) |
| 4 | Çekim senaryosuna dönüştürme | **genel-yonetmen** | `dizi-studio/public/episodes/<id>.json` |
| 5 | Görsel plan (çekim ölçekleri, mekân, ışık, kostüm, yeni varlık ihtiyacı) | **goruntu-yonetmeni** | JSON'daki `shot`, `set`, `time`, `cast` alanları + gerekirse yeni karakter/mekân kodu |
| 6 | Ses planı (ses/duygu seçimi, müzik, ortam, efekt) | **ses-yonetmeni** | JSON'daki `emotion`, `music`, `ambience`, `sfx` alanları |
| 7 | Seslendirme | ses-yonetmeni | `tools/seslendir.py` → `public/voice/<id>/` |
| 8 | Ön izleme kareleri + kontrol | genel-yonetmen | `npx remotion still` kareleri |
| 9 | Render + ses normalizasyonu | genel-yonetmen | `bolumler/<id>.mp4` (+ Reels parçaları) |
| 10 | Yayın öncesi kontrol listesi | hepsi | `docs/arastirma.md` §10 |

---

## 2. Komutlar

```bash
# Ortam kurulumu (yeni oturumda bir kez; TTS modeli ~3 GB indirir)
bash dizi-studio/tools/kurulum.sh

cd dizi-studio
# Replikleri seslendir (önbellekli; sadece değişen replikler yeniden üretilir)
/opt/tts/venv/bin/python tools/seslendir.py public/episodes/<id>.json

# Ses kütüphanesine yeni ses ekledikten sonra yeniden üret
/opt/tts/venv/bin/python tools/ses_kutuphanesi.py

# Tek kare kontrol
npx remotion still <KompozisyonId> out/kare.png --frame=120 --scale=0.5

# Tam bölüm render + -14 LUFS normalizasyonu + Reels parçaları
bash tools/render.sh <KompozisyonId> <bolum-id>

# Stüdyo (canlı önizleme)
npm run dev
```

---

## 3. Bölüm JSON formatı (`public/episodes/<id>.json`)

```jsonc
{
  "series": "dizi-kisa-adi",
  "seriesTitle": "Dizinin Adı",
  "episode": "kisa-b1",          // dosya adıyla aynı
  "episodeNo": 1,
  "title": "Bölüm başlığı",
  "endCard": { "text": "Devamı yarın · Takip et", "sub": "opsiyonel alt satır" },
  "scenes": [
    {
      "id": "s1",                 // benzersiz; replik id'leri buradan türetilir (s1_01, s1_02…)
      "set": "salon",             // §4 mekân listesi
      "time": "gece",             // gunduz | aksam | gece
      "rain": true,
      "title": "Salon",
      "look": "normal",           // normal | flashback | soguk | sicak
      "transition": "kesme",      // kesme | kararma | whoosh | flas (sahne başında)
      "partBreak": false,         // true: Reels parçası bu sahneden başlar
      "ambience": { "name": "ortam/yagmur", "volume": 0.3 },
      "music": { "name": "muzik/gerilim", "volume": 0.3 },   // yazılmazsa önceki müzik sürer; "yok" durdurur
      "cast": {                   // sahnedeki karakterlerin başlangıç durumu
        "zeynep": { "mark": "orta", "emotion": "uzgun", "lookAt": "kemal" }
      },
      "beats": [ /* vuruşlar, sırayla */ ]
    }
  ]
}
```

### Vuruş (beat) türleri

| type | Alanlar | Açıklama |
|------|---------|----------|
| `line` | `who`, `text`, `emotion?`, `voiceover?`, `gapAfter?` | Replik. Süre = ses süresi + boşluk (vars. 0.3 sn). `voiceover: true` → iç ses (ağız oynamaz, italik altyazı) |
| `action` | `dur` (sn) | Sessiz aksiyon / tepki / bekleme |
| `yazi` | `text`, `sub?`, `dur` | Ekran yazısı ("15 YIL ÖNCE") |
| `mesaj` | `from`, `text`, `dur` | Telefon mesajı ekranı (bildirim sesi otomatik) |

Her vuruşta ortak alanlar:
- `shot`: `{ "type": "genis|orta|yakin|cok_yakin|iki", "on": "id", "with": "id", "move": "sabit|yaklas|uzaklas|sarsinti|kaydir", "angle": "duz|alt|ust" }`. Yazılmazsa konuşan kişiye orta çekim gelir.
- `cast`: karakter durum değişikliği. Kalıcıdır, sonraki vuruşlara taşınır. Alanlar: `mark`, `emotion`, `gesture`, `prop`, `body`, `lookAt`, `tears`, `pale`, `sweat`, `wet`, `flip`, `enter: sol|sag`, `exit: sol|sag`, `hidden`, `eyesClosed`. Bir karakterin `mark`'ı değişirse yürüyerek oraya gider.
- `sfx`: `[{ "name": "efekt/kapi_zili", "at": 0.2, "volume": 0.8 }]`
- `lightning: true` → şimşek (ışık + gök gürültüsü + sarsıntı)
- `door: "ac" | "kapat"` → `apartman_kapisi` mekânında kapı
- `fade: "giris" | "cikis"` → karadan açılma / karaya kararma

---

## 4. Varlık kataloğu

### Mekânlar (`set`) ve işaretler (`mark`)
| set | işaretler |
|-----|-----------|
| salon | sol, orta, sag, kanepe (oturur) |
| mutfak | sol, orta, sag |
| yatak_odasi | sol, orta, sag, yatak (oturur) |
| cocuk_odasi | sol, orta, sag |
| ofis | masa (oturur), sol, sag |
| hastane_odasi | sol, sag, yatak (oturur) |
| hastane_koridoru | sol, orta, sag |
| sokak | sol, orta, sag |
| kafe | sol, orta, sag, tezgah |
| sinif | ogretmen, sol, orta |
| mezarlik | sol, orta, sag |
| villa | sol, orta, sag, merdiven |
| karakol | masa (oturur), sol, sag |
| park | sol, orta, sag, bank (oturur) |
| apartman_kapisi | kapi (kapının dışında durur) |
| koridor | orta |
| merdiven | orta |

Yeni mekân: `dizi-studio/src/studio/sets/index.tsx` (+ eşyalar `sets/props.tsx`). Kontrol: `Mekanlar` kompozisyonu.

### Oyuncular (`dizi-studio/src/studio/cast.json`)
zeynep, kemal, nermin, emre, elif, hatice, riza, kaan, selin, murat, ayse, deniz, burak, ozan, defne, can, leyla, huseyin, melek, yusuf.
Kontrol: `Kadro` kompozisyonu. Yeni karakter eklemek için `cast.json`'a bir kayıt eklemek yeterli.
- saç: longStraight, longWavy, ponytail, bun, bob, curly, braids, shortMale, spiky, slick, buzz, balding, bald, hijab
- kıyafet: tshirt, sweater, shirt, suit, dress, cardigan, coat, hoodie, school, apron, labcoat, police, tracksuit
- yaş: child, teen, adult, old · yapı: slim, normal, heavy · ekstra: glasses, earrings, facialHair (mustache, beard, stubble, goatee), mole

### Duygular (`emotion`)
notr, mutlu, gulen, uzgun, agliyor, ofkeli, korkmus, saskin, sok, supheli, utangac, alayci, dusunceli, yorgun, soguk, kararli, igrenmis.
Kontrol: `Duygular` kompozisyonu.

### Jestler (`gesture`)
rest, elBelde, kollarBagli, isaret, elSalla, eliYuzunde, eliKalbinde, omuzSilk, yumruk, dusunme, telefon, tutuyor, ellerAcik, ellerYuzde, durDur.
Kontrol: `Jestler` kompozisyonu.

### Eşyalar (`prop`, sağ elde)
telefon, poset, fincan, mektup, canta, cicek, bicak, anahtar, kitap

### Sesler / ses duyguları (`emotion` replikte)
Ses duyguları: notr, ic_ses, sakin, mutlu, heyecanli, uzgun, agliyor, korkmus, ofkeli, bagiriyor, alayci, soguk, fisilti.
Karakter sesleri: `voices/ref_*.wav` (genc_kadin, genc_kadin2, kadin, kadin2, yasli_kadin, cocuk_kiz, cocuk_erkek, genc_erkek, genc_erkek2, erkek, yasli_erkek, kalin_erkek).
Hepsi Chatterbox'ın kendi sentetik sesinden perde/tını dönüşümüyle türetildi; gerçek bir kişinin sesi değil.

### Müzik / ortam / efekt (`public/ses/katalog.json`)
- **muzik/**: huzunlu_piyano, gerilim, gizem, umut, romantik, aksiyon, hafif_komik, jenerik_tema, cliffhanger
- **ortam/**: yagmur, sehir, kafe_kalabalik, oda_tonu, hastane, ruzgar, kus_sesleri, gece_cekirge, saat_tiklama
- **efekt/**: kapi_vurma, kapi_yumruk, kapi_zili, kapi_carpma, kapi_gicirti, ayak_sesleri, kosma, telefon_titresim, telefon_zil, bildirim, cam_kirilma, tokat, nefes_kesilme, whoosh, riser, darbe, gok_gurultusu, kalp_atisi, esya_dusme, araba_gecis, fren, tik, cay_dokme, hickirik

---

## 5. Teknik kurallar
- Kanvas 1080×1920, 30 fps. Altyazı bandı y≈1050-1260. Üst 280 px ve alt 660 px'te önemli bir şey olmamalı (platform arayüzü).
- Son mix −14 LUFS, tepe ≤ −1 dBTP (`tools/render.sh` bunu otomatik yapar). Diyalog sırasında müzik otomatik olarak ~%55 alçalır.
- Instagram Reels ve YouTube Shorts en fazla **3 dakika**. 4-5 dakikalık bölüm buralara `partBreak` ile ~90 sn'lik parçalar halinde konur; TikTok ve YouTube'a tam bölüm konabilir.
- Yazı tipleri Nunito ve Playfair Display (OFL). Sesler kodla sentezlendi (telifsiz). Dışarıdan eklenen her ses `public/ses/LISANSLAR.csv`'ye yazılır.
