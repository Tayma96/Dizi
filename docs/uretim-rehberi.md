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
| 3 | Senaryo incelemesi (çekişmeli, paralel) | **senarist-yardimcisi** (öneri) + **yapimci** (tempo/bütçe) + **izleyici-simulatoru** (puan) + **dizi-hafizasi** (tutarlılık) | Tek birleşik rapor, seçenekli |
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
# Replikleri seslendir — ElevenLabs (önce kuru çalıştırma, onaydan sonra --onayla; kredi asla aşılmaz)
python3 tools/elevenlabs.py durum
python3 tools/elevenlabs.py seslendir public/episodes/<id>.json
python3 tools/elevenlabs.py seslendir public/episodes/<id>.json --butce 3000 --onayla
/opt/tts/venv/bin/python tools/ses_kontrol.py <id>
# Yedek / taslak ses (ücretsiz, yerel Chatterbox)
/opt/tts/venv/bin/python tools/seslendir.py public/episodes/<id>.json

# Ses kütüphanesine yeni ses ekledikten sonra yeniden üret
/opt/tts/venv/bin/python tools/ses_kutuphanesi.py

# Tek kare kontrol
npx remotion still <KompozisyonId> out/kare.png --frame=120 --scale=0.5

# Tam bölüm render + -14 LUFS normalizasyonu + Reels parçaları
bash tools/render.sh <KompozisyonId> <bolum-id>

# 30 sn'lik parça üretimi ve birleştirme (her sahne grubunun başında "partBreak": true)
bash tools/parca.sh <bolum-id> <parca-no>      # tek parça → bolumler/<id>-parcaN.mp4
bash tools/birlestir.sh <bolum-id>             # tüm parçalar → bolumler/<id>.mp4 (3 dk, -14 LUFS)

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
- `shot`: `{ "type": "genis|orta|yakin|cok_yakin|iki|omuz|ust_aci", "on": "id", "with": "id", "move": "sabit|yaklas|uzaklas|sarsinti|kaydir", "angle": "duz|alt|ust" }`. Yazılmazsa konuşan kişiye orta çekim gelir.
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

### 7/24 B5 eklemeleri (hepsi isteğe bağlı; eski bölümleri değiştirmez)
- **Kadro:** `sabri_sahte` (Sabri ile aynı görünüş, aynı ses eşlemesi).
- **Duygular:** `sahteGulus` (ağız sırıtır, gözler gülmez), `zorGulumse` (korkudan zoraki sırıtış).
- **Jestler:** `cagir` ("gel" diye el sallama, sol kol), `ellerKenetli` (eller göğüste kenetli).
- **Karakter durumu (`cast`):**
  - `kirpmaz` (göz kırpmaz)
  - `mumParlak` 0..1 (yüzde mum/maske parlaklığı)
  - `yagmur` 0..1 (ıslak baş, damlayan su, koyu omuzlar)
  - `kahkaha` 0..1 (omuz/baş sarsıntısı)
  - `hik: <sn>` (nefes çekme, tek sefer)
  - `onde` (bankonun/ön planın önünde çizilir)
  - `bakSira: [{at, x, y?, yaw?}]` (vuruş içinde hızlı baş çevirmeler)
- **Replik:** `sure` (ses yokken tahmini süre; konuşanın ağzı taslak oynar).
- **Sahne:** `bgBlur` (arka plan bulanıklığı, px).
- **Eklemeler (`insert` / `ekle`, `engine/Inserts11.tsx`):**
  - `omuz_el` (text: kayma, irkilme anı, dönüş anı)
  - `donusum_yuz`, `donusum_govde`, `bocek_dev`, `bocek_yakin` (text[0]: zaman kayması)
  - `ece_yakin` (text: duygu1, duygu2, geçiş sn, bakışX, solgunluk, ek: `hik<sn>` | `ter` | `goz`)
  - Saydam ön plan katmanları: `ece_sirt` (text[0]: baş açısı), `sabri_omuz`, `bocek_golge`
- **Dev hamamböceği:** `engine/bocek.tsx` (`DevBocek`, `BocekKafa`, `Bacak`, `Anten`). Kontrol kompozisyonu: `Bocek`. Örnekler: `B5OrnekYuz`, `B5OrnekGovde`, `B5OrnekOmuz`, `B5OrnekDev`, `B5OrnekYakin`.

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


---

## 6. 3D sistem (varsayılan motor)

Karakterler ve mekânlar 3D'dir. Böylece karakter yandan, arkadan ya da 3/4 açıdan göründüğünde de aynı kalır.

- **Bölüm kompozisyonu:** `Episode3D`. JSON formatı aynıdır, mekân adları da aynıdır. İşaretler (mark) `src/studio3d/sets3d.tsx` → `SETS3D` tablosunda.
- **Ek çekim türleri:** `omuz` (omuz üstü: `on` bakılan, `with` önde omzu görünen) ve `ust_aci`.
- **Ek jestler:** `sarilma`, `kapiAc`.
- **Karakter alanı:** `turn` (gövde açısı, derece).
- **Render:** `--gl=swangle` (CPU). Bir 5 dakikalık bölüm yaklaşık 1-2 saat sürer.
- **Kontrol sayfaları:** `Donus3D`, `Kadro3D`, `Duygular3D`, `Jestler3D`, `JestTest`, `Mekanlar3D`.
- **3D mekân işaretleri:**

| set | işaretler |
|-----|-----------|
| salon | sol, orta, sag, kanepe (oturur), pencere |
| mutfak | sol, orta, sag, masa (oturur), tezgah |
| yatak_odasi | sol, orta, sag, yatak (oturur) |
| cocuk_odasi | sol, orta, sag, yatak (oturur) |
| ofis | masa (oturur), sol, sag, kapi |
| hastane_odasi | yatak (oturur), sol, sag, kapi |
| hastane_koridoru | sol, orta, sag, uzak, bank (oturur) |
| sokak | sol, orta, sag, kaldirim |
| kafe | sol, orta, sag, tezgah, masa_sol/masa_sag (oturur) |
| sinif | ogretmen, sol, orta, sira (oturur) |
| mezarlik | sol, orta, sag, mezar |
| villa | sol, orta, sag, merdiven |
| karakol | masa (oturur), sol, sag, sorgu |
| park | sol, orta, sag, bank_sol/bank_sag (oturur) |
| apartman_kapisi | kapi (dışarıda), ic, ic_sol (içeride, kapıya dönük) |
| koridor | orta, uzak, yakin |
| merdiven | orta, basamak |
| hucre | yatak (oturur), orta, tepsi, ayna, duvar, kose (yataktan kalkıp gerileme), kapi_ic, kapi |

### Işık tasarımı (`isik`, sahne alanı)
Her sahneye bilinçli ışık. Verilmezse eski düz gündüz/akşam/gece ışığı kullanılır (yalnızca taslak için).
```json
"isik": {
  "kontrast": 0.8,                 // 0-1: gölge sertliği; karakter öz-ışımasını da kısar
  "ortam": 0.12, "ortamRenk": "#b4c4d8", "gok": 0.1,
  "anahtar": { "tip": "nokta", "p": [1.3, 2.0, -1.9], "c": "#e6efff", "i": 11, "menzil": 8 },
  "dolgu":   { "p": [-1.0, 1.5, 4.0], "c": "#ffe4cc", "i": 0.35 },
  "arka":    { "p": [1.5, 3.0, -5.0], "c": "#8fb8ff", "i": 1.0 },
  "ekstra":  [{ "tip": "nokta", "p": [3.7, 2.0, -0.5], "c": "#ffe8c8", "i": 5, "menzil": 4 }]
}
```
- **Anahtar ışık kameranın karşısından değil, karakterin kameraya uzak yanından** gelir (upstage key). Önden gelen anahtar yüzü düzleştirir.
- Duvarlarda düşüş için anahtarı `nokta` yap (yönlü ışık her yeri eşit boyar). Motivasyon: pencere, kapı aralığı, lamba.
- Dolgu düşük (0.3-0.4), sıcak/soğuk zıtlığı için anahtarın karşı rengi.
- Örnek: `public/episodes/ornek15.json` (hücre, klinik soğuk gündüz).

### Tasarlanmış kadraj (`shot.cam`)
`"shot": { "type": "genis", "move": "sabit", "cam": { "pos": [2.2, 1.5, 2.5], "target": [-0.45, 0.95, -0.7], "fov": 50 } }`
Dikey kadrajda establishing için: iki karakteri yan yana değil, **derinlik ekseninde** dizecek açı seç. Kamera, set `wide` kamerasıyla aynı tarafta kalmalı (180°).

### Bitiş kartı
`"endCard": false` → bitiş kartı yok (örnek, fragman).

## 7. Kurgu ve sahneleme kuralları (araştırmalardan)

- **6 saniye kuralı:** Ekranda en geç ~6 sn'de bir değişim olmalı: kesme, kamera hareketi, yeni bilgi, ışık ya da müzik değişimi.
- **Çekim süreleri:**
  - Diyalog: 3-6 sn.
  - Gerilim yükselişi: 2 sn'nin altında hızlı kesmeler.
  - Ağır duygusal kırılma: 6-8 sn'lik "nefes" tutuşu (`action` vuruşu + `cok_yakin`).
- **Konuşma sahnesi kalıbı:** geniş (konumlar) → orta (etkileşim) → yakın (karar/şok). Shot-reverse-shot ve `omuz` çekimleri. Kritik ifşalarda kamera yaklaşır (`move: yaklas`).
- **Kuleşov etkisi:** Endişeli bir yüzün ardından nesne/ipucu çekimi kullan. Ör. `cok_yakin` yüz, ardından kapı ya da mektup.
- **Kesme anı:** Hareketin ortasında ya da müziğin vuruşunda kes.
- **Ses önce gelir:** Sonraki sahnenin ortam sesi 0.4 sn önce başlar (otomatik J-cut). Konuşan sesin tepki çekiminde sürmesi için `line` vuruşundan sonra `shot` değiştir (L-cut).
- **Diyalog ekonomisi:** Replik başına en fazla ~15 kelime, konuşma dili. Altyazı satırı en fazla 37 karakter (otomatik bölünür).
- **Renk senaryosu:** Her dizinin `bible.md`'sinde sahne türü → zaman/ışık/look eşlemesi bulunur.

## 8. Güvenli alanlar (1080×1920, üç platform ortak)

- **Kenar boşlukları:** üst 269 px, alt 672 px, sol 120 px, sağ alt 300 px. Önemli içerik bunların dışında kalmamalı.
- **Altyazı:** klasik stil (beyaz yazı + siyah kontur), ekranın alt kısmında, alt kenarı y=1450 (motor otomatik uygular).
- **Göz çizgisi:** üst 1/3'te (3D kamera otomatik uygular).

## 9. Lisans ve platform notları (ayrıntı: `docs/arastirma-2.md`)

- **Remotion:** Bireyler ve en fazla 3 kişilik şirketler için ücretsiz. Ekip büyürse lisans gerekir; alternatif HyperFrames (Apache-2.0).
- **Sesler:** Gerçek kayıtlar BigSoundBank (CC0). Müzik ya kendi sentezimiz ya da kamu malı (Musopen) kayıtlar. Liste: `public/ses/LISANSLAR.csv`.
- **TTS:** Chatterbox (MIT). Perth filigranı açık kalsın. Video açıklamasına "Sesler yapay zekâ ile sentezlenmiştir." yazılsın; Meta/TikTok'ta AI etiketi açılsın.
- **YouTube:** Her bölüm özgün hikâye taşımalı ("inauthentic content" riski); aynı jenerik serbest. Her Short'a tam bölüm "ilgili video" olarak bağlanır.
