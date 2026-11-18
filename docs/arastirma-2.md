# Araştırma 2: Ses/Müzik Kaynakları, Platform Kuralları, Dağıtım, Lisanslar

> Tarih: 18 Kasım 2026. `docs/arastirma.md` dosyasının devamıdır ve onu tekrar etmez (5b'deki kaynak tablosu burada derinleştirildi).
> Etiketler: **[DOĞRULANDI]** birincil kaynak (resmî sayfa, lisans metni ya da dosya sayfası) açılıp okundu. **[İKİNCİL]** haber/blog kaynağı. **[DOĞRULANAMADI]** birincil kaynak açılamadı ya da kaynaklar çelişiyor. **[ÖNERİ]** kaynağa dayanmayan uygulama önerisi.
> Bu belge hukuki tavsiye değildir. Lisanslar değişebilir; indirme anındaki sayfayı arşivleyin.

---

## A. Gerçek ses kaydı kaynakları

### A1. Kaynak karşılaştırması

| Kaynak | Lisans (metin URL'si) | Ticari | Atıf | Programatik indirme | Not |
|---|---|---|---|---|---|
| **BigSoundBank** (Joseph Sardin) | CC0 1.0 + WTFPL + "Public Domain" beyanı. https://bigsoundbank.com/droit.html , https://bigsoundbank.com/licenses.html | **Evet**: "Use, including for commercial purposes. Without any restrictions. Without asking permission." | **Gerekmez**: "Nothing is mandatory, but definitely appreciated" | **Evet**. Dosya adresi kalıbı `https://bigsoundbank.com/UPLOAD/mp3/NNNN.mp3` (ayrıca `/ogg/`, çoğunda `/flac/`). 63 dosya HEAD ile 200 + `audio/mpeg` döndü. `/wav/` 301 ile sayfaya yönleniyor (WAV yalnızca site üzerinden). HTML sayfaları curl'e Cloudflare engeli veriyor, dosyalar vermiyor. **[DOĞRULANDI]** | "Free and royalty-free" işaretli sesler **Content ID'ye kayıtlı değil**. Site, üçüncü kişilerin bu seslerle yaptığı Content ID taleplerini "unfounded" sayıyor [DOĞRULANDI: licenses.html]. Ücretsiz hesapla imzalı lisans sertifikası alınabiliyor [DOĞRULANDI: droit.html]. Kontrol ettiğimiz 55 ses sayfasının hepsinde "CC0 (public domain): Free and royalty-free" yazıyor. **Birincil kaynağımız bu olmalı.** |
| **Wikimedia Commons** | Dosya başına değişir. CC0/PD dışındakiler (CC BY, CC BY-SA) atıf ister. Her dosyanın sayfası lisans metnidir | Lisansa göre | CC0/PD: hayır. CC BY/BY-SA: evet | **Evet**, MediaWiki API ile: `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=rain%20filemime:audio&prop=imageinfo&iiprop=url|extmetadata&iiextmetadatafilter=LicenseShortName|Artist&format=json`. `extmetadata.LicenseShortName` alanı "CC0" / "Public domain" ise atıfsız. **[DOĞRULANDI: API çalıştırıldı]** | Ses efekti tarafında CC0 dosya **çok az**. "rain" aramasındaki 25 sonuçtan yalnızca 2'si CC0, çoğu CC BY-SA 4.0. Bu ortamdan art arda isteklerde **HTTP 429** (retry-after 600 sn) aldık. Toplu indirmede açıklayıcı bir `User-Agent` kullanın, istekler arasında birkaç saniye bekleyin. Klasik müzik için çok değerli (bkz. B). |
| **Freesound** | Ses başına CC0 / CC BY / CC BY-NC. https://freesound.org/help/faq/ | CC0: evet ("you can do pretty much what you want… could even sell the sound… can't claim you are the author") | CC0: hayır | API anahtarıyla **önizleme** (mp3/ogg) indirilebilir. Orijinal dosya için OAuth2 gerekir [İKİNCİL: freesound-python]. **Ancak API kullanım şartları:** "You can use the Freesound API for free only for non-commercial purposes", ticari kullanım için iletişim gerekiyor [DOĞRULANDI] (https://freesound.org/docs/api/terms_of_use.html) | Gelir getiren bir kanalın üretim hattında API kullanmak bu şarta takılabilir; "ticari" tanımı yapılmamış [DOĞRULANAMADI]. **Öneri:** CC0 sesleri web sitesinden elle indirin, API'yi otomasyonda kullanmayın. Sampling+ ve NC lisanslı sesleri kullanmayın. Freesound HTML sayfaları bu ortamdan curl'e 403 döndü. |
| **OpenGameArt** | Varlık başına (CC0, CC BY, OGA-BY, GPL…). https://opengameart.org/content/faq | CC0: evet | CC0: hayır | Arama filtresiyle CC0 seçilebiliyor [İKİNCİL] (https://app.cinevva.com/guides/free-sound-effects-music). Sayfalar bu ortamdan WebFetch'e 403 verdi [DOĞRULANAMADI] | Oyun odaklı. Gerçekçi ambiyans kayıtları sınırlı. |
| **Sonniss GDC Bundle** (her yıl, 2026 dahil) | https://sonniss.com/gameaudiogdc | **Evet**: "All of the sounds are royalty free and commercially usable." | **Gerekmez**: "Attribution is always appreciated, but never required." | Doğrudan zip (downloads.sonniss.com), ayna ve torrent var. E-posta kaydının zorunlu olup olmadığı belirtilmemiş | **"Use for AI/ML training is strictly prohibited"**. Sesleri tek başına (düzenlenmiş olsa da) yeniden satmak yasak. Projede sınırsız kullanım serbest [DOĞRULANDI: sayfa özeti]. Paket büyük (2026 için ~7,5 GB WAV [İKİNCİL]) ama profesyonel kalitede. Tek seferlik elle indirip `assets/sfx/sonniss/` altına koymaya değer. |
| **Pixabay (SFX + müzik)** | Pixabay Content License. https://pixabay.com/service/license-summary/ | Evet. İçeriği "standalone" (değiştirmeden) satmak/dağıtmak yasak | Gerekmez | Resmî API yalnızca görsel/video içindir. Ses için resmî API bulunamadı [DOĞRULANAMADI] | **Content ID riski var**: bazı besteciler parçalarını Content ID'ye kaydediyor. Pixabay lisans sertifikasını itiraz kanıtı olarak öneriyor, ama Content ID ile doğrudan entegrasyonu yok [İKİNCİL] (https://hellothematic.com/thematic-vs-pixabay/, https://help.heygen.com/en/articles/8986144-content-id-claims-on-youtube). **Öneri:** Pixabay müziğini ana kaynak yapmayın. Kullanırsanız sertifikayı indirip LICENSES.csv'ye bağlayın. |
| **Kenney** | CC0. https://kenney.nl/support | Evet ("even in commercial projects") | Gerekmez | Paket zip'leri | Ses paketleri arayüz/oyun efekti ağırlıklı. Gerçekçi ambiyans için uygun değil [ÖNERİ]. |

**Sonuç [ÖNERİ]:** Ambiyans ve foley için **BigSoundBank** (CC0, Content ID yok, doğrudan URL) yeterli. Eksik kalanlar için Sonniss bundle'ı ve Commons CC0 dosyaları kullanılabilir. Freesound'u yalnızca elle ve yalnızca CC0 için kullanın.

### A2. Doğrudan indirilebilir ses dosyaları (otomatik indirme tablosu)

- Tüm BigSoundBank URL'leri 18.11.2026'da `curl -I` ile kontrol edildi: **HTTP 200, `content-type: audio/mpeg`**. İlk baytlar `ID3` (MP3) / `fLaC` (FLAC) olarak doğrulandı.
- **Her satırın ses sayfası tek tek açıldı** ve sayfada "CC0 (public domain): Free and royalty-free" ibaresi görüldü (Lisans sütunundaki bağlantı ilgili ses sayfasıdır; genel lisans: https://bigsoundbank.com/licenses.html).
- Daha yüksek kalite için aynı numarayla `.../UPLOAD/flac/NNNN.flac` deneyin. Çoğu var, ama örneğin 0007'de 404 döndü. Önce FLAC'ı deneyin, 404 gelirse MP3'e düşün.
- Süreler sayfadan alındı.

| # | Ses | Doğrudan URL | Süre / içerik | Lisans (sayfa) |
|---|---|---|---|---|
| 1 | Yağmur – pencere arkası (kapalı çift cam, yağmurlu gün, uzak araç/kuş) | https://bigsoundbank.com/UPLOAD/mp3/2387.mp3 | 3:53, "Apartment on the ground floor, closed double glazed window… Rainy day." | CC0 – https://bigsoundbank.com/apartment-closed-window-s2387.html |
| 2 | Yağmur – iç mekândan cama vuran (araç içinden ön cam) | https://bigsoundbank.com/UPLOAD/mp3/1295.mp3 | 1:14, iri damlalar ön camda, araç içinden kayıt | CC0 – https://bigsoundbank.com/rain-on-car-windshield-s1295.html |
| 3 | Yağmur – hafif (beton üzerinde) | https://bigsoundbank.com/UPLOAD/mp3/1289.mp3 | 1:21 | CC0 – https://bigsoundbank.com/rain-on-concrete-s1289.html |
| 4 | Yağmur – hafif (su birikintisi) | https://bigsoundbank.com/UPLOAD/mp3/1290.mp3 | 1:18 | CC0 – https://bigsoundbank.com/rain-on-puddle-s1290.html |
| 5 | Yağmur – şemsiye altında, sokak | https://bigsoundbank.com/UPLOAD/mp3/2679.mp3 | 0:32 | CC0 – https://bigsoundbank.com/rain-under-an-umbrella-s2679.html |
| 6 | Yağmur – hafif, uzak gök gürültüsü (orman) | https://upload.wikimedia.org/wikipedia/commons/b/b6/Light_Rain_Distant_Thunder_July_5th_2016.wav | 1:50, WAV ~40 MB, kuş sesi ve mikrofon rüzgârlığına damla sesi içeriyor | CC0 1.0 – https://commons.wikimedia.org/wiki/File:Light_Rain_Distant_Thunder_July_5th_2016.wav (API `LicenseShortName=CC0`. HEAD denemesi 429 aldı, dosya varlığı API'den) |
| 7 | Yağmur – sağanak + gök gürültüsü | https://bigsoundbank.com/UPLOAD/mp3/0740.mp3 | 2:38, "Heavy rain and thunderstorms" | CC0 – https://bigsoundbank.com/rain-and-storm-2-s0740.html |
| 8 | Yağmur – sağanak, uzun (döngü için) | https://bigsoundbank.com/UPLOAD/mp3/2719.mp3 | **34:53**, yoğun yağmur ve fırtına (MP3 ~50 MB) | CC0 – https://bigsoundbank.com/storm-and-rain-4-s2719.html |
| 9 | Yağmur – kesintisiz yoğun, sonunda gök gürültüsü | https://bigsoundbank.com/UPLOAD/mp3/0124.mp3 | 0:43 | CC0 – https://bigsoundbank.com/rain-and-storm-s0124.html |
| 10 | Yağmur – iri damla, teras (yaz sağanağı) | https://bigsoundbank.com/UPLOAD/mp3/1019.mp3 | 2:37 | CC0 – https://bigsoundbank.com/summer-rain-on-terrace-s1019.html |
| 11 | Gök gürültüsü – tek patlama (yağmursuz) | https://bigsoundbank.com/UPLOAD/mp3/2718.mp3 | 0:23 | CC0 – https://bigsoundbank.com/thunder-s2718.html |
| 12 | Gök gürültüsü – kısa | https://bigsoundbank.com/UPLOAD/mp3/3113.mp3 | 0:06 | CC0 – https://bigsoundbank.com/thunder-2-s3113.html |
| 13 | Gök gürültüsü – tek, uzun kuyruk | https://bigsoundbank.com/UPLOAD/mp3/3115.mp3 | 0:18 | CC0 – https://bigsoundbank.com/thunder-4-s3115.html |
| 14 | Rüzgâr – evin içinden fırtına | https://bigsoundbank.com/UPLOAD/mp3/1714.mp3 | 1:53, "Storm Ciara… from inside a house" | CC0 – https://bigsoundbank.com/wind-from-inside-1-s1714.html |
| 15 | Rüzgâr – içeriden, panjur takırtılı | https://bigsoundbank.com/UPLOAD/mp3/1715.mp3 | 2:50 | CC0 – https://bigsoundbank.com/wind-from-inside-2-s1715.html |
| 16 | Rüzgâr – foley (mono) | https://bigsoundbank.com/UPLOAD/mp3/0595.mp3 | 1:30 | CC0 – https://bigsoundbank.com/wind-s0595.html |
| 17 | Şehir trafiği – kapalı pencereli daire (Paris, 1. kat) | https://bigsoundbank.com/UPLOAD/mp3/0080.mp3 | 4:02, camda düşük frekans titreşimi | CC0 – https://bigsoundbank.com/paris-apartment-closed-window-s0080.html |
| 18 | Şehir trafiği – kavşak, dış mekân | https://bigsoundbank.com/UPLOAD/mp3/0608.mp3 | 2:07 | CC0 – https://bigsoundbank.com/street-and-roads-s0608.html |
| 19 | Şehir – gece, balkondan | https://bigsoundbank.com/UPLOAD/mp3/0680.mp3 | 1:21 | CC0 – https://bigsoundbank.com/paris-by-night-s0680.html |
| 20 | Kafe kalabalığı (iç teras, döngüye uygun) | https://bigsoundbank.com/UPLOAD/mp3/2561.mp3 | 4:03, "Easy to loop" | CC0 – https://bigsoundbank.com/coffee-shop-at-the-capucins-s2561.html |
| 21 | Restoran (pizzacı) | https://bigsoundbank.com/UPLOAD/mp3/0624.mp3 | 1:31 | CC0 – https://bigsoundbank.com/restaurant-s0624.html |
| 22 | Küçük restoran, ~15 kişi sohbet | https://bigsoundbank.com/UPLOAD/mp3/3542.mp3 | 2:45. **Konuşmalar Fransızca ve anlaşılır olabilir**, düşük seviyede kullanın | CC0 – https://bigsoundbank.com/small-restaurant-conversations-s3542.html |
| 23 | Kuşlar – sabah uyanışı (kırsal, kış) | https://bigsoundbank.com/UPLOAD/mp3/0222.mp3 | 2:55, güvercin, serçe, tavuk | CC0 – https://bigsoundbank.com/awakening-birds-s0222.html |
| 24 | Kuşlar – akşam (döngüye uygun) | https://bigsoundbank.com/UPLOAD/mp3/1859.mp3 | 3:57 | CC0 – https://bigsoundbank.com/evening-birds-s1859.html |
| 25 | Gece böcekleri (cırcır) + uzak yol | https://bigsoundbank.com/UPLOAD/mp3/1470.mp3 | 2:32, saat 01:00 | CC0 – https://bigsoundbank.com/nocturnal-insects-4-s1470.html |
| 26 | Tarla cırcır böceği | https://bigsoundbank.com/UPLOAD/mp3/1020.mp3 | 0:37 | CC0 – https://bigsoundbank.com/field-cricket-s1020.html |
| 27 | Oda tonu – ev içi, çok düşük seviye için | https://bigsoundbank.com/UPLOAD/mp3/2458.mp3 | 1:47 | CC0 – https://bigsoundbank.com/sound-atmosphere-in-a-house-s2458.html |
| 28 | Oda tonu – ev içi (uzak trafik, kedi, saat tiktağı) | https://bigsoundbank.com/UPLOAD/mp3/0750.mp3 | 1:27 | CC0 – https://bigsoundbank.com/inside-a-house-s0750.html |
| 29 | Hastane monitörü – EKG bip 60 bpm | https://bigsoundbank.com/UPLOAD/mp3/0457.mp3 | 0:10 (sentetik bip) | CC0 – https://bigsoundbank.com/electrocardiogram-60-Hz-s0457.html |
| 30 | Hastane monitörü – EKG bip 67 bpm | https://bigsoundbank.com/UPLOAD/mp3/0456.mp3 | 0:10 (sentetik) | CC0 – https://bigsoundbank.com/67-hz-electrocardiogram-s0456.html |
| 31 | Hastane monitörü – kalp durması (düz sinyal) | https://bigsoundbank.com/UPLOAD/mp3/1309.mp3 | 0:24, 475 Hz kare dalga | CC0 – https://bigsoundbank.com/cardiac-arrest-electrocardiogram-1-s1309.html |
| 32 | Kapı vurma – ev girişi (metal) | https://bigsoundbank.com/UPLOAD/mp3/0095.mp3 | 0:11 | CC0 – https://bigsoundbank.com/door-knock-s0095.html |
| 33 | Kapı vurma – hafif kapı, 3 vuruş | https://bigsoundbank.com/UPLOAD/mp3/0374.mp3 | 0:07. **Başta sözlü geri sayım var, kırpın** | CC0 – https://bigsoundbank.com/knock-on-a-light-door-s0374.html |
| 34 | Kapı zili – ev ("bigben") | https://bigsoundbank.com/UPLOAD/mp3/0159.mp3 | 0:09 | CC0 – https://bigsoundbank.com/doorbell-house-1-s0159.html |
| 35 | Kapı zili – ev girişi | https://bigsoundbank.com/UPLOAD/mp3/2365.mp3 | 0:07 | CC0 – https://bigsoundbank.com/doorbell-6-s2365.html |
| 36 | Kapı gıcırtısı – kısa | https://bigsoundbank.com/UPLOAD/mp3/0302.mp3 | 0:02 | CC0 – https://bigsoundbank.com/creaking-door-s0302.html |
| 37 | Kapı gıcırtısı – uzun | https://bigsoundbank.com/UPLOAD/mp3/0306.mp3 | 0:07 | CC0 – https://bigsoundbank.com/long-creaking-door-s0306.html |
| 38 | Kapı gıcırtısı – kapanırken | https://bigsoundbank.com/UPLOAD/mp3/3211.mp3 | 0:03 | CC0 – https://bigsoundbank.com/creaking-door-8-s3211.html |
| 39 | Daire kapısı açılma (sürtünmeli) | https://bigsoundbank.com/UPLOAD/mp3/1702.mp3 | 0:05 | CC0 – https://bigsoundbank.com/apartment-door-opening-1-s1702.html |
| 40 | Daire kapısı kapanma | https://bigsoundbank.com/UPLOAD/mp3/1704.mp3 | 0:04 | CC0 – https://bigsoundbank.com/apartment-door-closing-1-s1704.html |
| 41 | Kapı çarpma | https://bigsoundbank.com/UPLOAD/mp3/0103.mp3 | 0:05 | CC0 – https://bigsoundbank.com/door-slamming-s0103.html |
| 42 | Kapı çarpma – ahşap, stüdyo | https://bigsoundbank.com/UPLOAD/mp3/0223.mp3 | 0:04 | CC0 – https://bigsoundbank.com/door-slamming-2-s0223.html |
| 43 | Kapı çarpma – iç kapı, cereyanla | https://bigsoundbank.com/UPLOAD/mp3/1501.mp3 | 0:01 | CC0 – https://bigsoundbank.com/door-slamming-4-s1501.html |
| 44 | Ayak sesi – parke (çorapla/ayakkabısız) | https://bigsoundbank.com/UPLOAD/mp3/0376.mp3 | 0:34 | CC0 – https://bigsoundbank.com/footsteps-shoe-on-parquet-s0376.html |
| 45 | Ayak sesi – erkek, ahşap zemin, 13 adım | https://bigsoundbank.com/UPLOAD/mp3/0165.mp3 | 0:09 | CC0 – https://bigsoundbank.com/man-footsteps-on-the-wooden-floor-s0165.html |
| 46 | Ayak sesi – terlik, eski ahşap zemin | https://bigsoundbank.com/UPLOAD/mp3/0373.mp3 | 0:10 | CC0 – https://bigsoundbank.com/feet-slipper-on-floor-s0373.html |
| 47 | Telefon titreşimi – halı üzerinde | https://bigsoundbank.com/UPLOAD/mp3/0022.mp3 | 0:07 | CC0 – https://bigsoundbank.com/mobile-phone-vibrator-1-s0022.html |
| 48 | Telefon titreşimi – ahşap masada, 2 kez | https://bigsoundbank.com/UPLOAD/mp3/0023.mp3 | 0:10 | CC0 – https://bigsoundbank.com/mobile-phone-vibrator-2-s0023.html |
| 49 | Telefon titreşimi – kılıflı, ahşap yüzey | https://bigsoundbank.com/UPLOAD/mp3/1033.mp3 | 0:21 | CC0 – https://bigsoundbank.com/mobile-vibrator-in-protective-shell-s1033.html |
| 50 | Cam kırılma (foley) | https://bigsoundbank.com/UPLOAD/mp3/0771.mp3 | 0:09 | CC0 – https://bigsoundbank.com/broken-glass-s0771.html |
| 51 | Bardak yere düşüp patlama | https://bigsoundbank.com/UPLOAD/mp3/0148.mp3 | 0:02, hafif distorsiyonlu | CC0 – https://bigsoundbank.com/glass-burst-s0148.html |
| 52 | Ayna kırılma (kalın) | https://bigsoundbank.com/UPLOAD/mp3/0387.mp3 | 0:02 | CC0 – https://bigsoundbank.com/mirror-explodes-s0387.html |
| 53 | Saat tik-tak – mekanik çalar saat | https://bigsoundbank.com/UPLOAD/mp3/1372.mp3 | 0:44 | CC0 – https://bigsoundbank.com/tic-tac-mechanical-alarm-clock-s1372.html |
| 54 | Saat tik-tak – kısa (x9) | https://bigsoundbank.com/UPLOAD/mp3/0007.mp3 | 0:09 (FLAC yok) | CC0 – https://bigsoundbank.com/clock-s0007.html |
| 55 | Saat tik-tak – sarkaçlı ayaklı saat | https://bigsoundbank.com/UPLOAD/mp3/1567.mp3 | 0:20 | CC0 – https://bigsoundbank.com/grandfather-clock-ticking-s1567.html |

**Bulunamayan / dikkat edilecekler:**
- **Saf "oda tonu" kaydı** BigSoundBank'te yok. `one-minute-of-silence-s0917` dijital sessizliktir ("no noise, no room tone"), oda tonu olarak işe yaramaz. 27-28 numaralar en yakın seçenek. En temiz oda tonu için kendi odanızı 1 dk kaydetmek de bir yol [ÖNERİ].
- **"Pencere arkası yağmur"** için doğrudan bir kayıt bulunamadı. 1 numara (kapalı pencere, yağmurlu gün) zayıf bir yağmur içeriyor. Daha belirgin bir sonuç için 3/4/10 numaralara alçak geçiren filtre (≈ 1-2 kHz kesim) ve hafif reverb uygulayıp 1 numarayla katmanlayın. Pencere camı hissi böyle elde edilir [ÖNERİ].
- **Hastane monitör sesleri sentetik** (bilgisayarda üretilmiş). Bu sorun değil, gerçek monitörler de sentetik bip üretir.

### A3. Otomatik indirme ve kayıt [ÖNERİ]

```bash
# scripts/fetch-sfx.sh  — her satır: id|hedef_ad
UA="DiziStudio-asset-fetcher/1.0"
while IFS='|' read -r id name; do
  for ext in flac mp3; do
    url="https://bigsoundbank.com/UPLOAD/$ext/$id.$ext"
    code=$(curl -s -o /dev/null -w '%{http_code}' -A "$UA" -I "$url")
    if [ "$code" = 200 ]; then
      curl -sSf -A "$UA" -o "assets/sfx/$name.$ext" "$url"
      echo "$name.$ext,$url,CC0-1.0,https://bigsoundbank.com/licenses.html,$(date -I)" >> assets/LICENSES.csv
      break
    fi
  done
  sleep 2
done < sfx-list.txt
```
- Wikimedia'dan indirirken istekler arasında ≥5 sn bekleyin, 429 alırsanız `Retry-After` süresine uyun.
- MP3 kayıplı bir formattır. Ses işleme (filtre, pitch) yapılacaksa FLAC tercih edin, son mikste −14 LUFS normalizasyonu yapın (bkz. arastirma.md §5).

---

## B. Ücretsiz müzik

### B1. Kaynakların lisans durumu

- **Önemli ayrım:** Bestenin kamu malı olması (Chopin, Satie) **kaydın** kamu malı olduğu anlamına gelmez. Commons'taki bazı Satie/Chopin kayıtları CC BY-SA'dır. Örnek: Michael Laucke'nin Gymnopédie No.1 kaydı "Creative Commons Attribution-Share Alike 4.0" lisanslı, yani atıf + aynı lisansla paylaşım ister [DOĞRULANDI] (https://commons.wikimedia.org/wiki/File:Satie_Gymnopedie_No_1_performed_by_Michael_Laucke.flac). Martha Goldstein'ın Chopin Op.9 No.2 kaydı CC BY-SA 2.0 [DOĞRULANDI] (https://commons.wikimedia.org/wiki/File:Frederic_Chopin_-_Nocturne_Eb_major_Opus_9,_number_2.ogg).
- **Musopen kayıtları (Commons'ta "Set Chopin Free" ve "Musopen Kickstarter Project" kategorileri):** Dosya sayfaları "This work has been released into the public domain by its author, Musopen. This applies worldwide… Musopen grants anyone the right to use this work for any purpose, without any conditions" diyor. Kayıtlar Public Domain Mark ile işaretli, atıf istenmiyor [DOĞRULANDI] (https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._20_in_C-sharp_minor,_B._49_(Frank_Levy).flac, https://commons.wikimedia.org/wiki/Category:Set_Chopin_Free, https://commons.wikimedia.org/wiki/Category:Musopen_Kickstarter_Project).
  - Bir dosya sayfasında "Musopen's own works … are fully copyrighted" notu var. Bu not musopen.org'un kendi sitesi ve materyalleri içindir, Commons'a PD olarak bırakılmış kayıtları kapsamıyor gibi görünüyor, ancak kesin değil [DOĞRULANAMADI].
  - musopen.org/faq bu ortamdan 403 döndü. Musopen'in kendi sitesindeki indirme şartları (hesap, günlük limit) doğrulanamadı [DOĞRULANAMADI]. **Öneri:** Musopen kayıtlarını Commons üzerinden indirin.
  - Kamu malı klasik kayıtlarda bile üçüncü kişilerin haksız Content ID talebi gelebilir. Commons dosya sayfası bağlantısını itiraz kanıtı olarak LICENSES.csv'de tutun [ÖNERİ].
- **Satie Gymnopédie:** Commons'ta PD/CC0 lisanslı tam bir kayıt **bulunamadı**. Bulunanlar Laucke (CC BY-SA 4.0), Kevin MacLeod düzenlemesi "Gymnopedie No. 1" (CC BY 3.0, https://commons.wikimedia.org/wiki/File:Gymnopedie_No._1_(ISRC_USUAN1100787).mp3) ve 30 sn'lik PD parçalar. **Pratik çözüm:** Kevin MacLeod sürümünü CC BY atfıyla kullanın ya da Gymnopédie'yi (beste PD) kendiniz MIDI/sentezle üretin [ÖNERİ].
- **Incompetech (Kevin MacLeod):** CC BY 4.0. Zorunlu atıf biçimi [DOĞRULANDI] (https://incompetech.com/music/royalty-free/faq.html):
  ```
  "Parça Adı" Kevin MacLeod (incompetech.com)
  Licensed under Creative Commons: By Attribution 4.0
  https://creativecommons.org/licenses/by/4.0/
  ```
  "Title" yerine gerçek parça adı yazılmalı. YouTube'da açıklamaya konur. TikTok/IG için SSS bir şey söylemiyor; açıklama/altyazıda görünür bir yere koyun. Atıfsız kullanım için ücretli "Standard License" alınabiliyor. Incompetech parçalarının Content ID durumu doğrulanamadı [DOĞRULANAMADI].
- **Free Music Archive:** Lisans parça başına belirleniyor. CC0 / "Commercial Use" filtrelerinin varlığı yalnızca ikincil kaynaklarda geçiyor [İKİNCİL/DOĞRULANAMADI] (https://hongkiat.com/blog/creative-common-music-download). Her parçanın sayfasındaki lisans esas alınmalı.
- **Pixabay Music:** Atıfsız ve ticari kullanıma açık, ama Content ID riski var (bkz. A1).

### B2. Yapay zekâ ile müzik üretimi

| Model | Lisans | Ticari çıktı | Donanım | Türkçe vokal |
|---|---|---|---|---|
| **ACE-Step 1.5** | Kod MIT [DOĞRULANDI] (https://github.com/ace-step/ACE-Step-1.5). Model kartı da MIT [DOĞRULANDI] (https://huggingface.co/ACE-Step/Ace-Step1.5) | Model kartı: "You can strictly use the generated music for commercial purposes". Eğitim verisi: lisanslı kayıtlar + telifsiz/PD müzik + MIDI'den sentetik ses [DOĞRULANDI: model kartı] | "<4GB VRAM" ile yerelde çalışır. CUDA önerilir, "MPS / ROCm / Intel XPU / CPU" destekleniyor. ≤6 GB katmanı: 2B turbo DiT, LM kapalı, INT8, tam CPU offload. XL (4B) modeller ≥12 GB (offload ile) / ≥20 GB. Hız: A100'de <2 sn, RTX 3090'da <10 sn / şarkı [DOĞRULANDI: README]. **Yalnızca CPU ile hız resmî olarak verilmemiş**. Üçüncü taraf tahmini parça başına 1-5 dk [DOĞRULANAMADI] | "50+ languages" deniyor ama **Türkçe adıyla listelenmemiş** [DOĞRULANAMADI]. Denemeden vokalli kullanmayın. Enstrümantal (vokalsiz) alt yapı daha güvenli [ÖNERİ] |
| **Stable Audio Open Small** | Stability AI Community License (https://huggingface.co/stabilityai/stable-audio-open-small, https://stability.ai/license) | Yıllık geliri **1 milyon USD altındaki** kişi/kuruluş ücretsiz ticari kullanabilir. Çıktılar kullanıcıya ait [DOĞRULANDI: stability.ai/license SSS]. Ticari kullanımda Stability'ye kayıt gerekebilir (sayfa "register" diyor) [DOĞRULANDI, ayrıntı DOĞRULANAMADI] | Küçük model | **En fazla 11 sn** stereo çıktı. Müzik değil, kısa ses efekti/riser/geçiş için uygun [DOĞRULANDI: model kartı] |

**Not:** YouTube, ana odak noktası yapay zekâ müziği olan videolarda açıklama (disclosure) istiyor (bkz. C1). Arka plandaki AI müzik bu kapsamda değil gibi görünüyor ama netleştirilmemiş [DOĞRULANAMADI]. ACE-Step README'si de "clearly disclose AI involvement" diyor.

### B3. Dram / gerilim / hüzün için 15 parça (lisansları doğrulanmış, doğrudan indirilebilir)

Tamamı Wikimedia Commons'taki Musopen kayıtları. Lisans durumu API'deki `extmetadata.LicenseShortName = "Public domain"` alanından okundu. Bunlara ek olarak 2 dosya sayfası (No.20 ve Tchaikovsky) açılıp şablon metni okundu. Format FLAC. Süreler API'den alındı. **Not:** `upload.wikimedia.org` bu ortamdan HEAD isteğine 429 (rate limit) döndü. URL'ler API'nin `imageinfo.url` alanından alındı, kendi ortamınızda yavaş indirin.

| # | Parça (duygu) | Süre | Doğrudan URL | Lisans sayfası |
|---|---|---|---|---|
| 1 | Chopin – Nokturn No.20 do diyez minör (hüzün, klasik "acı" teması) | 3:45 | https://upload.wikimedia.org/wikipedia/commons/f/fc/Chopin_-_Nocturne_No._20_in_C-sharp_minor%2C_B._49_%28Frank_Levy%29.flac | https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._20_in_C-sharp_minor,_B._49_(Frank_Levy).flac |
| 2 | Chopin – Nokturn No.1 si bemol minör Op.9/1 (melankoli) | 5:37 | https://upload.wikimedia.org/wikipedia/commons/6/63/Chopin_-_Nocturne_No._1_in_B-flat_minor%2C_Op._9_No._1_%28Olga_Gurevich%29.flac | https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._1_in_B-flat_minor,_Op._9_No._1_(Olga_Gurevich).flac |
| 3 | Chopin – Nokturn No.7 do diyez minör Op.27/1 (tedirginlik → patlama) | 5:51 | https://upload.wikimedia.org/wikipedia/commons/f/f5/Chopin_-_Nocturne_No._7_in_C-sharp_minor%2C_Op._27_No._1_%28Luke_Faulkner%29.flac | https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._7_in_C-sharp_minor,_Op._27_No._1_(Luke_Faulkner).flac |
| 4 | Chopin – Nokturn No.13 do minör Op.48/1 (ağır dram) | 6:19 | https://upload.wikimedia.org/wikipedia/commons/f/f8/Chopin_-_Nocturne_No._13_in_C_minor%2C_Op._48_No._1_%28Luke_Faulkner%29.flac | https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._13_in_C_minor,_Op._48_No._1_(Luke_Faulkner).flac |
| 5 | Chopin – Nokturn No.19 mi minör Op.72/1 (hüzün) | 4:32 | https://upload.wikimedia.org/wikipedia/commons/2/2c/Chopin_-_Nocturne_No._19_in_E_minor%2C_Op._72_No._1_%28Luke_Faulkner%29.flac | https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._19_in_E_minor,_Op._72_No._1_(Luke_Faulkner).flac |
| 6 | Chopin – Nokturn No.21 do minör (kısa, hüzün) | 3:13 | https://upload.wikimedia.org/wikipedia/commons/0/0b/Chopin_-_Nocturne_No._21_in_C_minor%2C_B._108_%28Diana_Hughes%29.flac | https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_No._21_in_C_minor,_B._108_(Diana_Hughes).flac |
| 7 | Chopin – Marche Funèbre Op.72/2 (yas, cenaze) | 5:51 | https://upload.wikimedia.org/wikipedia/commons/0/07/Chopin_-_Marche_Funebre%2C_Op._72_No._2_%28Aya_Higuchi%29.flac | https://commons.wikimedia.org/wiki/File:Chopin_-_Marche_Funebre,_Op._72_No._2_(Aya_Higuchi).flac |
| 8 | Chopin – Ballad No.1 sol minör (gerilim, doruk) | 10:13 | https://upload.wikimedia.org/wikipedia/commons/b/b1/Chopin_-_Ballade_No._1_in_G_minor%2C_Op._23_%28Frank_Levy%29.flac | https://commons.wikimedia.org/wiki/File:Chopin_-_Ballade_No._1_in_G_minor,_Op._23_(Frank_Levy).flac |
| 9 | Chopin – Çello Sonatı, III. Largo (hüzünlü, çello + piyano) | 3:38 | https://upload.wikimedia.org/wikipedia/commons/0/05/Chopin_-_Cello_Sonata_in_G_minor%2C_Op._65_-_III._Largo_%28Christopher_Harding%2C_Yeonjin_Kim%29.flac | https://commons.wikimedia.org/wiki/File:Chopin_-_Cello_Sonata_in_G_minor,_Op._65_-_III._Largo_(Christopher_Harding,_Yeonjin_Kim).flac |
| 10 | Tchaikovsky – 6. Senfoni "Pathétique", IV. Adagio lamentoso (trajedi) | 10:18 | https://upload.wikimedia.org/wikipedia/commons/5/52/Tchaikovsky_-_Symphony_No._6_in_B_minor%2C_Op._74_%27Path%C3%A9tique%27_-_IV._Finale_%E2%80%93_Adagio_lamentoso_%28Musopen_Symphony%29.flac | https://commons.wikimedia.org/wiki/File:Tchaikovsky_-_Symphony_No._6_in_B_minor,_Op._74_%27Path%C3%A9tique%27_-_IV._Finale_%E2%80%93_Adagio_lamentoso_(Musopen_Symphony).flac |
| 11 | Beethoven – 3. Senfoni "Eroica", II. Marcia funebre (yas, ağırlık) | 15:28 | https://upload.wikimedia.org/wikipedia/commons/c/cd/Beethoven_-_Symphony_No._3_in_E_flat_major%2C_Op._55_%27Eroica%27_-_II._Marcia_funebre._Adagio_assai_%28Musopen_Symphony%29.flac | https://commons.wikimedia.org/wiki/File:Beethoven_-_Symphony_No._3_in_E_flat_major,_Op._55_%27Eroica%27_-_II._Marcia_funebre._Adagio_assai_(Musopen_Symphony).flac |
| 12 | Beethoven – Yaylı Çalgılar Dörtlüsü Op.18/6, II. Adagio (içe dönük) | 7:01 | https://upload.wikimedia.org/wikipedia/commons/3/33/Beethoven_-_String_Quartet_No._6_in_B_flat_major%2C_Op._18_No._6_-_II._Adagio%2C_ma_non_troppo_%28Musopen_String_Quartet%29.flac | https://commons.wikimedia.org/wiki/File:Beethoven_-_String_Quartet_No._6_in_B_flat_major,_Op._18_No._6_-_II._Adagio,_ma_non_troppo_(Musopen_String_Quartet).flac |
| 13 | Mendelssohn – Yaylı Dörtlü No.6 fa minör, III. Adagio (yas; kız kardeşinin ölümü sonrası yazıldı) | 8:06 | https://upload.wikimedia.org/wikipedia/commons/6/62/Mendelssohn_-_String_Quartet_No._6_in_F_minor%2C_Op._80_-_III._Adagio_%28Musopen_String_Quartet%29.flac | https://commons.wikimedia.org/wiki/File:Mendelssohn_-_String_Quartet_No._6_in_F_minor,_Op._80_-_III._Adagio_(Musopen_String_Quartet).flac |
| 14 | Schubert – Piyano Sonatı D958, II. Adagio (hüzün, gece) | 7:48 | https://upload.wikimedia.org/wikipedia/commons/7/70/Schubert_-_Piano_Sonata_No._19_in_C_minor%2C_D958_-_II._Adagio_%28Paul_Pitman%29.flac | https://commons.wikimedia.org/wiki/File:Schubert_-_Piano_Sonata_No._19_in_C_minor,_D958_-_II._Adagio_(Paul_Pitman).flac |
| 15 | Schubert – Piyano Sonatı D784, II. Andante (sakin hüzün) | 3:49 | https://upload.wikimedia.org/wikipedia/commons/4/41/Schubert_-_Piano_Sonata_No._14_in_A_minor%2C_D784_-_II._Andante_%28Paul_Pitman%29.flac | https://commons.wikimedia.org/wiki/File:Schubert_-_Piano_Sonata_No._14_in_A_minor,_D784_-_II._Andante_(Paul_Pitman).flac |

Duygu etiketleri [ÖNERİ] düzeyindedir, dinleyerek doğrulayın. Uzun parçalardan (8, 10, 11) 20-60 sn'lik bölümler kesip kullanın. Gerilim için en iyi aday 8 ve 3'ün orta bölümü, yas için 7, 10 ve 11.

---

## C. Platform kuralları (Kasım 2026 itibarıyla)

### C1. Yapay zekâ içerik etiketleme

**YouTube** [DOĞRULANDI] (https://support.google.com/youtube/answer/14328491):
- Açıklama gereken durumlar **gerçekçi** içerikle sınırlı: gerçek bir kişiyi söylemediği bir şeyi söylüyor gibi göstermek, gerçek yerin sahte görüntüsü, videonun ana odağı olan AI müzik.
- **Gerektirmeyen:** "Creators don't need to disclose non-realistic content that's made with AI". Örnek olarak tamamen animasyon bir videoda AI ile üretilmiş füze animasyonu verilmiş. Kendi sesinizi klonlayıp seslendirmede kullanmak da "minor" sayılıyor.
- **Bizim için sonuç:** Açıkça gerçekdışı, stilize 3D/2D animasyon zorunlu etiket gerektirmiyor. TTS sesler gerçek bir kişiyi taklit etmiyorsa (kurgu karakter) açık bir kural yok. Gerçek bir kişinin sesi klonlanıyorsa **etiketleyin** [ÖNERİ].
- "Disclosing AI content alone won't limit a video's audience or impact its eligibility to earn money". Sürekli açıklama yapmamak ise YPP'den uzaklaştırmaya kadar gidebilir.

**TikTok:**
- Resmî şeffaflık sayfası "realistic-appearing scenes or people" içeren AIGC'nin etiketlenmesini istiyor. C2PA Content Credentials ile otomatik etiketleme yapılıyor [DOĞRULANDI: şeffaflık sayfası] (https://www.tiktok.com/transparency/en/supporting-responsible-transparent-ai-generated-content/).
- TTS seslendirme konusunda kaynaklar çelişiyor: Hootsuite genel TTS için etiket gerekmediğini söylüyor, Pixo "AI-generated speech" içeren videoların kapsamda olduğunu aktarıyor [İKİNCİL/DOĞRULANAMADI] (https://blog.hootsuite.com/ai-disclosure-policy-for-tiktok/, https://pixo.video/blog/tiktok-ai-label-compliance-guide). Destek sayfası bu ortamdan okunamadı.
- **Öneri:** TikTok'ta "AI-generated" anahtarını açın. Bu erişimi düşürmez diye bir resmî açıklama bulunamadı [DOĞRULANAMADI], ama otomatik/sonradan etiketlenmekten daha güvenlidir.

**Instagram / Facebook (Meta):**
- Meta, "photorealistic video or realistic-sounding audio that was digitally generated or altered" için etiket istiyor ve uymayanlara yaptırım uygulayabileceğini söylüyor (Nisan 2024 politikası) [İKİNCİL: arama özeti, duyuru sayfası doğrudan açılmadı] (https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/).
- Instagram yardım sayfasının arama özetine göre etiket gereken örnekler arasında **"a reel narrated with a realistic AI-generated voiceover"** var, çizgi film tarzı video ise gerekmeyen örnek [İKİNCİL: arama özeti, sayfa doğrudan okunamadı] (https://help.instagram.com/761121959519495).
- **Bizim için en net sonuç:** Gerçekçi Türkçe TTS ile anlatılan Reels'te **"AI info"/AI etiketini açın** [ÖNERİ, Meta kuralına dayanarak].

### C2. Para kazanma uygunluğu

**YouTube İş Ortağı Programı (YPP):**
- Eşikler: 1.000 abone + son 12 ayda 4.000 geçerli izlenme saati **ya da** 1.000 abone + son 90 günde 10 milyon geçerli Shorts izlenmesi [DOĞRULANDI] (https://support.google.com/youtube/answer/72851). Alt katman (fan funding/Shopping): 500 abone + son 90 günde 3 geçerli yükleme + (3.000 saat **ya da** 3 milyon Shorts izlenmesi) [DOĞRULANDI] (https://support.google.com/youtube/answer/13429240).
- **Türkiye YPP ülke listesinde var** ("Turkey") [DOĞRULANDI] (https://support.google.com/youtube/answer/7101720).
- **Shorts gelir paylaşımı:** Shorts akışındaki reklam gelirleri havuzlanır. Müzik lisansı payı düşülür (müziksiz Shorts'un payı tamamen yaratıcı havuzuna gider). Havuz ülke bazında "engaged views" payına göre dağıtılır, yaratıcı kendi payının **%45'ini** alır. Özgün olmayan Shorts (başkasının film/dizi klipleri, katkısız derlemeler) uygun değildir [DOĞRULANDI] (https://support.google.com/youtube/answer/12504220). **Bizim formatta müziği kendi PD/CC0 kayıtlarımızdan koymak gelir payını düşürmez.** Havuz kesintisi yalnızca YouTube kütüphanesinden eklenen lisanslı müzikte olur (sayfa bunu "music partners" için anlatıyor) [ÖNERİ/yorum].
- **"Inauthentic content" politikası** (15 Temmuz 2025'te "repetitious content"in yeni adı) [DOĞRULANDI] (https://support.google.com/youtube/answer/1311392):
  - Yasak: "content that looks like it's made with a template", "Videos where characters are put in the same situation over and over again with the same outcome", "templated storylines… with minimal or no narrative", "AI-generated content made with generic or unoriginal templates" ile seri üretim izlenimi.
  - Serbest: Aynı giriş/çıkış ("intro and outro") kullanılabilir, yeter ki "the bulk of your content is different". Dizi serbesttir, "each video has a distinct storyline, focus, or concept" olduğu sürece.
  - İhlal durumunda **tüm kanalın** para kazanması kaldırılabilir.
- **Kod/AI ile üretilen animasyon dizisi için risk ve önlemler [ÖNERİ, politikaya dayanarak]:**
  1. Her bölümde benzersiz bir olay örgüsü, gelişen karakter arkı ve önceki bölümlere bağlanan bir sonuç olsun. "Aynı durum → aynı sonuç" kalıbından kaçının.
  2. Görsel şablonu (aynı oda, aynı kamera açıları) bölümler arasında değiştirin: yeni mekânlar, yeni kadrajlar.
  3. Aynı seslendirme kalıbı + aynı müzik + aynı jenerik ile kısa kesitler yayımlamayın. Shorts'lar tam bölümün "bağlamlı" parçaları olsun, aynı kesitin çoğaltılmış hâlleri olmasın.
  4. Kanalın insan emeğini görünür kılın: kanal açıklaması, kamera arkası Shorts, karakter tasarım süreci. Politika "we cannot clearly tell that you made the content" durumunu da gerekçe sayıyor.
  5. Günde onlarca kısa video gibi bir hacimle seri üretim izlenimi vermeyin.

**TikTok Creator Rewards:**
- Program ≥1 dk özgün videolar için ödüyor. 18 yaş, 10.000 takipçi, son 30 günde 100.000 izlenme şartları ikincil kaynaklarda geçiyor [İKİNCİL] (https://www.shortsync.app/resources/tiktok-creator-rewards-program-2026).
- **Türkiye'de mevcut değil gibi görünüyor.** Ülke listeleri (ABD, BK, Almanya, Japonya, G. Kore, Fransa, Meksika, Brezilya) Türkiye'yi içermiyor. Bir kaynak Türkiye'den gelen izlenmelerin nitelikli sayılmadığını da yazıyor. **Ancak resmî liste okunamadı** [DOĞRULANAMADI] (https://ttcalculator.net/data/reference/creator-fund-countries/). Türkiye "Effect Creator Rewards" (efekt üreticileri) programında var, bu ayrı bir program [İKİNCİL] (https://searchengineland.com/tiktok-expands-effect-creator-rewards-438353).
- Kesin kontrol: TikTok Studio → Creator Rewards ekranı. Türkiye'deki alternatifler: CANLI yayın hediyeleri, marka işbirlikleri [İKİNCİL].

**Instagram / Facebook (Türkiye):**
- Facebook "Stars" Türkiye'de mevcut [İKİNCİL] (https://www.lilachbullock.com/?p=123237). Facebook Content Monetization davetle ve ülke bazında açılıyor, Türkiye için doğrulanamadı [DOĞRULANAMADI]. Instagram hediyeleri/abonelikleri için Türkiye durumu doğrulanamadı [DOĞRULANAMADI].
- Kesin kontrol: Professional Dashboard → Monetization. **Pratik önerimiz:** Para kazanma omurgası YouTube (YPP, Türkiye'de kesin). IG/TikTok erişim ve huni kanalı olarak düşünülmeli [ÖNERİ].

### C3. AB Yapay Zekâ Yasası Madde 50 ve filigran

- **Madde 50(2):** Sentetik ses/görüntü/video/metin üreten AI sistemlerinin **sağlayıcıları** çıktıları "marked in a machine-readable format and detectable as artificially generated or manipulated" şeklinde işaretlemek zorunda. **Madde 50(4):** Deepfake oluşturan **kullanıcılar (deployer)** bunun yapay olduğunu açıklamalı. İçerik "evidently artistic, creative, satirical, fictional" bir eserin parçasıysa yükümlülük, eserin sunumunu/izlenmesini engellemeyecek şekilde bu varlığın belirtilmesiyle sınırlı. Yürürlük 2 Ağustos 2026 [DOĞRULANDI] (https://artificialintelligenceact.eu/article/50/).
- **Digital Omnibus:** 7 Mayıs 2026'daki siyasi anlaşmaya göre 50(2) yükümlülüğü, **2 Ağustos 2026'dan önce piyasaya sürülmüş** sistemler için 2 Aralık 2026'ya ertelendi. 50(1) ve 50(4) ertelenmedi. Resmî Gazete'de yayımlanma durumu doğrulanamadı [İKİNCİL] (https://www.williamfry.com/knowledge/eu-ai-act-omnibus-deal-reached-postponed-deadlines-watermarking-compromise-and-the-nudificiation-prohibition/, https://taylorwessing.com/en/insights-and-events/insights/2026/05/the-eu-digital-omnibus-on-ai-what-the-political-deal-means).
- **Bizim pozisyonumuz [ÖNERİ, hukuki görüş değil]:**
  - Biz TTS modelinin **sağlayıcısı değil, kullanıcısıyız**. 50(2) esas olarak Resemble AI gibi sağlayıcıları bağlar.
  - Kurgu karakter sesleri gerçek bir kişiyi taklit etmiyorsa "deepfake" tanımına (var olan kişi/nesne/olaya benzeyen içerik) girmesi zayıf bir ihtimal.
  - Yine de kurgu istisnası "varlığın belirtilmesini" istediği için kanal açıklamasına ve bölüm açıklamasına sabit bir not koymak ucuz ve güvenli: "Bu dizideki sesler yapay zekâ ile sentezlenmiştir."
  - Hedef kitle AB'de ise bu not daha da önemli.
- **Chatterbox / Perth filigranı:** Perth, MIT lisanslı, "imperceptible" nöral bir ses filigranıdır. "compression, resampling" gibi dönüşümlere dayanıklı olduğu iddia ediliyor. **C2PA veya AB Yapay Zekâ Yasası uyumu iddiası yok** [DOĞRULANDI] (https://github.com/resemble-ai/Perth).
  - Yeterli mi? Makine tarafından okunabilir işaretleme açısından teknik bir karşılık sağlar. Ancak platformlar C2PA meta verisini okuyor, Perth'i okumuyor. Miks, müzik ve sıkıştırma sonrası tespit edilebilirliği bağımsız olarak doğrulanmadı [DOĞRULANAMADI].
  - **Öneri:** Perth'i kapatmayın. Ham TTS dosyalarını arşivleyin. Final videoda açıklama metnini + platform etiketini kullanın. Bu kombinasyon tek başına filigrandan daha savunulabilir.

### C4. Türkiye'ye özgü

- **Reklam/işbirliği etiketi:** Ticaret Bakanlığı'nın "Sosyal Medya Etkileyicileri Tarafından Yapılan Ticari Reklam ve Haksız Ticari Uygulamalar Hakkında Kılavuz"u (2021, 6502 sayılı Kanun'a dayalı) gizli reklamı yasaklıyor. #Reklam, #İşbirliği, #Sponsor gibi ibarelerle reklam olduğunun açıkça belirtilmesi gerekiyor [İKİNCİL] (https://ticaret.gov.tr/haberler/ticaret-bakanligi-sosyal-medya-etkileyicileri-icin-kilavuz-yayimladi, https://webrazzi.com/2021/05/06/ticaret-bakanligi-influencerlara-yonelik-yeni-bir-kilavuz-yayinladi/). Marka ürünü yerleştirme ya da sponsorluk olursa bölüm başında/görselde ve açıklamada etiket kullanın.
- **RTÜK:** 6112 sayılı Kanun kapsamında RTÜK, 2025-2026'da düzenli haber/program yayını yapan bazı YouTube kanallarına (Fatih Altaylı, FluTV, BirGün TV, Tele2 Haber) 72 saat içinde lisans başvurusu yapma bildirimi gönderdi. Bireysel/anlık paylaşımların kapsam dışı tutulacağı haberleri var. Hukuki dayanak RTÜK içinde de tartışmalı [İKİNCİL] (https://medyascope.tv/2025/09/04/rtukten-birgun-tvye-lisans-zorunlulugu-72-saat-sure-verildi, https://www.haberturk.com/ekonomi/rtukten-youtube-a-ve-sosyal-medyaya-sert-denetim-sinyali-duzenli-yayinlara-lisans-zorunlulugu-geliyor-3900740). Kurgusal animasyon dizisi için lisans zorunluluğu olduğuna dair bir kaynak bulunamadı. Bir kanal "düzenli program yayıncısı" olarak tanımlanırsa risk teorik olarak var [DOĞRULANAMADI]. Kanal kurumsallaşır ya da büyürse bir medya hukukçusuna danışın [ÖNERİ].
- **AI içerik kanun teklifleri:** TBMM'de deepfake içeriklerin "yapay zekâ tarafından üretilmiştir" ibaresiyle etiketlenmesini öngören teklifler var (ör. MHP milletvekili teklifleri, 2025-2026). Yasalaşıp yasalaşmadıkları doğrulanamadı [DOĞRULANAMADI] (https://www.haber7.com/guncel/haber/3560251-turkiyede-ilk-olacak-yapay-zeka-kanunu-tbmmye-sunuldu-para-ve-hapis-cezasi-yolda, https://www.ekonomim.com/gundem/mhpden-yapay-zeka-ile-uretilen-sahte-iceriklere-karsi-kanun-teklifi-haberi-867993). Açıklamadaki "sesler yapay zekâ ile sentezlenmiştir" notu bu açıdan da tedbir sayılır.

---

## D. Dağıtım ve büyüme

> Bu alanda platformların resmî rakamı yok. Aşağıdakiler resmî özellik bilgisi [DOĞRULANDI] ile uygulama önerisinin [ÖNERİ] birleşimidir.

### D1. Huni: tam bölüm + parçalar
- **Tam bölüm (4-5 dk):** YouTube'da uzun video olarak yayımlanır (YPP saat eşiğine katkı yapar; Shorts izlenmeleri 4.000 saate sayılmaz [DOĞRULANDI: answer/72851]). TikTok'ta da tam bölüm yüklenebilir (≥1 dk, Creator Rewards formatına uygun ama TR'de program yok).
- **90 sn parçalar (Shorts/Reels):** Her bölümden 2-3 parça çıkarın: (a) kanca + ilk çatışma, (b) bölümün dönüm noktası, (c) cliffhanger (sonu vermeden).
- **Shorts → uzun video bağlantısı:** YouTube Studio'da (masaüstü) bir Short'a tek bir "related video" bağlantısı eklenebiliyor. Bu bağlantı aynı kanaldaki herhangi bir videoyu (uzun video, başka Short, canlı yayın) gösterebilir ve YouTube bunu dizi Shorts'larını bağlamak için de öneriyor [İKİNCİL] (https://vidiq.com/blog/post/youtube-related-links-connect-shorts-long-videos, https://tubefilter.com/2023/09/01/youtube-related-links-multi-format-creators-shorts-live-long-form/). **Her parçayı kendi tam bölümüne bağlayın** [ÖNERİ].
- **Reels:** Instagram'da "Trial Reels", içeriği önce yalnızca takipçi olmayanlara gösterir ve 24 saat sonra metrik verir. ≥1.000 takipçili herkese açık hesaplarda kullanılabilir [İKİNCİL] (https://petapixel.com/2024/12/13/instagram-launches-trial-reels-so-you-can-test-content-with-non-followers, https://www.thekeyword.co/news/instagram-expands-trial-reels-to-all-public-creators-with-1k-or-more-followers). Mosseri performans ölçütü olarak beğeni/erişim ve gönderim/erişim oranlarını öneriyor.

### D2. Numaralandırma ve oynatma listesi [ÖNERİ]
- Başlık kalıbı: `<Kanca cümlesi> | <Dizi Adı> 1. Sezon 3. Bölüm`. Kanca başta olmalı; numara sonda, ama hep aynı yerde.
- Küçük resimde ve videonun ilk/son karesinde küçük bir "B3" rozeti kullanın.
- YouTube'da her sezon için ayrı oynatma listesi açın, bölümleri eskiden yeniye sıralayın. Bölüm sonu ekranında "sonraki bölüm" + oynatma listesi gösterin.
- Açıklamaya "Önceki bölüm / Sonraki bölüm" bağlantıları ve ilk bölüm bağlantısı ekleyin.
- TikTok'ta "Playlist" özelliği bazı hesaplara açık. Erişim şartı (sıklıkla 10.000 takipçi) resmî olarak doğrulanamadı [DOĞRULANAMADI] (https://publer.com/blog/tiktok-playlists/). Açık değilse sabitlenmiş videolarda "1. Bölüm buradan" kullanın.
- Her parçanın ilk 1-2 sn'sinde ekranda "Bölüm 3 · Parça 2/3" gibi küçük bir bağlam yazısı olsun. Akışta yeni gelen izleyici diziyi anlasın.

### D3. Yayın sıklığı [ÖNERİ]
- Sabit bir takvim ve gerçekçi bir üretim kapasitesi, sıklıktan önemlidir. Kaynaksız "günde X video" rakamlarına güvenmeyin.
- Başlangıç önerisi: **haftada 1 tam bölüm** (aynı gün/saat) + **haftada 3-5 parça** (bölümden çıkarılmış). Bu düzen hem "seri üretim" izlenimini önler (C2) hem de huniyi besler.
- Sezon yapısı: 8-10 bölüm, sezon arası 2-4 hafta (kamera arkası, karakter tanıtım Shorts'ları).

### D4. Kanca A/B testi
- **YouTube "Test & Compare"** [DOĞRULANDI] (https://support.google.com/youtube/answer/13861714):
  - En fazla 3 başlık ve/veya küçük resim test edilebilir. Kazanan **izlenme süresine (watch time)** göre seçilir, tıklama oranına göre değil. Test iki hafta içinde biter.
  - Yalnızca masaüstü YouTube Studio'da ve "advanced features" açıkken kullanılabilir.
  - **Shorts'ta yok** ("A/B testing is not available for Shorts").
  - Videonun kendisini (açılışı) test etmez; yalnızca başlık ve küçük resim test edilir.
- **Aynı bölümü farklı açılışla yeniden yüklemek:**
  - YouTube'da birbirine çok benzeyen videolar "inauthentic/minimal variation" politikasına (C2) yaklaşır [DOĞRULANDI: politika metni].
  - TikTok'ta "unoriginal or reproduced content that does not have any new or creative changes" For You akışına uygun değil [DOĞRULANDI] (https://www.tiktok.com/community-guidelines/en/integrity-authenticity/).
  - **Öneri:** Aynı bölümü yeniden yüklemeyin. Açılış testini **farklı parçalarla** yapın: aynı bölümden iki farklı 90 sn'lik parça (farklı sahne, farklı kanca) üretin ve kanca türlerini (soru / şok cümlesi / sessiz görsel) karşılaştırın.
- **Instagram Trial Reels** açılış testi için en temiz araç: aynı parçanın iki farklı açılışı takipçi olmayanlara deneme olarak gösterilir, kazanan ana akışta paylaşılır (D1). Bu kullanım platformun amacına uygundur [ÖNERİ].
- **TikTok'ta deneme:** Resmî bir A/B aracı bulunamadı [DOĞRULANAMADI]. Kanca türlerini farklı bölümlerin parçalarında dönüşümlü deneyin, 48-72 saatlik izlenme yüzdesini kaydedin.
- **Kayıt:** `metrics.csv` dosyasında parça_id, kanca_türü, ilk_3sn_tutma, ortalama izlenme %, paylaşım/erişim, yorum/erişim sütunlarını tutun [ÖNERİ].

### D5. Yorum ve paylaşım tetikleyicileri [ÖNERİ]
- **Taraf tutturan soru:** "Sence haklı olan kim: X mi, Y mi?" Bunu bölüm sonunda karakterin kendisine sordurun (dördüncü duvar), açıklamada da tekrarlayın.
- **Tahmin isteği:** "Kapıdaki kim? Yoruma yaz, sonraki bölümde göreceğiz." Sonraki bölümde doğru tahmin eden yorumu sabitleyin.
- **Paylaşım tetikleyici:** Bir karakterin "tanıdık" bir aile tipini temsil ettiği an ("Bunu annene gönder"). Meta, gönderim/erişim oranını sinyal olarak öne çıkarıyor (arastirma.md §1).
- **Yorumu içeriğe dönüştürme:** Seçilen izleyici yorumunu bir sonraki parçanın açılışında ekranda gösterin. Bu, YouTube'un "özgün değer" ölçütüne de katkı yapar.
- Etkileşim dilenciliği yapmayın: "beğen, abone ol" çağrısını yalnızca sona koyun ve tek cümleyle sınırlayın.

---

## E. Remotion lisansı ve alternatif

- **Ücretsiz lisans:** "For individuals and companies of up to 3 people". Bu kişiler tüm özellikleri ticari olarak ücretsiz kullanabilir. Daha büyük kuruluşlar Company License almak zorunda: "Remotion for Creators" koltuk başı aylık $25, "Remotion for Automators" render başı $0,01 (1.000'lik bloklar, aylık en az $100), Enterprise aylık $500'dan başlıyor [DOĞRULANDI] (https://www.remotion.dev/docs/license/pricing). Kâr amacı gütmeyen kuruluşlar/değerlendirme için SSS'ye bakın (açılmadı) (https://www.remotion.dev/docs/license/faq).
- **"Remotion 5.0 telemetri" iddiası: KISMEN DOĞRU.**
  - 5.0 migration sayfasına göre 5.0 **henüz yayımlanmadı** ("incomplete list of breaking changes that are planned") ve şunu söylüyor: "Telemetry is now mandatory for Company License customers".
  - Telemetri sayfası bunu "Remotion for Automators" kapsamındaki şirketlerle sınırlıyor, "Remotion for Creators" için zorunluluk yok.
  - Ücretsiz lisans kullanıcıları `licenseKey: "free-license"` geçerek uygunluklarını beyan ediyor.
  - Gönderilen veriler: lisans anahtarı, render yapan makinenin IP'si, video/still ve prod/dev bilgisi. Video içeriği gönderilmiyor. Sunucu tarafında telemetri yalnızca anahtar ayarlıysa gönderiliyor (`free-license` da anahtar sayılıyor).
  - Kaynaklar: [DOĞRULANDI] (https://www.remotion.dev/docs/5-0-migration, https://www.remotion.dev/docs/license/telemetry).
  - **Bizim için:** ≤3 kişilik ekip ücretsiz lisansla devam eder. 5.0'a geçince config'e `licenseKey: "free-license"` eklemek yeterli görünüyor. Free kullanıcılar için telemetrinin zorunlu olup olmadığı açıkça yazılmamış [DOĞRULANAMADI].
- **HyperFrames (HeyGen):** **Var.** Lisansı **Apache-2.0**, "no per-render fees or commercial-use thresholds" [DOĞRULANDI] (https://github.com/heygen-com/hyperframes).
  - HTML/CSS bileşimlerini headless Chrome'da kare kare arayıp FFmpeg ile MP4'e kodluyor (Puppeteer tabanlı).
  - **Three.js** "seekable animation" seçenekleri arasında. WebGL geçişleri `@hyperframes/shader-transitions` ile yapılıyor. `<audio data-start …>` ile ses miksi destekleniyor.
  - Nisan 2026'da yayımlandı [İKİNCİL] (https://themenonlab.blog/blog/heygen-hyperframes-video-as-code).
  - Remotion'daki React bileşen modeli yerine düz HTML kullanıyor. Mevcut Remotion kod tabanını taşımak ciddi iş [ÖNERİ]. **Ekip 3 kişiyi aşarsa** maliyetsiz bir B planı olarak değerlendirilebilir.

---

## Ek: LICENSES.csv önerilen sütunlar

`dosya, kaynak_url, sayfa_url, lisans (CC0-1.0 / PD-Mark / CC-BY-4.0), atif_metni (gerekiyorsa), indirme_tarihi, sha256, not`

CC BY parçalar için `atif_metni` dolu olmalı ve bölüm açıklamasına otomatik eklenmeli. PD/CC0 için boş kalabilir, ama `sayfa_url` her zaman dolu olmalı (Content ID itirazında kanıt olarak kullanılır).
