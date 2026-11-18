# Bölüm 1 açılışı — ekip incelemesi (özet)

## Ortak sonuç (üç ajan da aynı noktalarda birleşti)
- **Açılış:** Plazayla başlamak zayıf (ilk 3 sn'de çatışma yok). **Hastanede uyanışla başla, plazayı 1-3 sn'lik flaş olarak ver.** İzleyici simülasyonu: ilk 30 sn tutundurma %38 → %47 (tahmin). Senarist önerisi: *eşleşen kesme* — kalem ucu kâğıda değer → aynı el, aynı açı, bu kez hap kabını tutuyor.
- **Kimlik mantığı çelişiyor:** "Yani... Berkay ama" + aynada yabancı yüz + "devir imzası" birbirini bozuyor. Öneri: aynadaki yüz **Berkay'ın 6 ayda harap olmuş kendi yüzü** (sakal, kazınmış saç, solgunluk); asıl şoku "6 ay" taşısın. "Yani... Berkay ama" satırı çıksın.
- **Final kendi kancasını açıklıyor:** Ortağın 22 kelimelik plan anlatımı + iç sesin "o ses ortağımındı" tekrarı. Öneri: **ortağı plazadaki imza karesinde kur** (kalemi uzatan, güven veren tek sıcak cümle), koridorda aynı ses soğuk duyulsun; kapı aralığında elinde aynı kalem. İç ses kısalsın ya da kalksın; ortak ≤15 kelime ("Dozu iki katına çıkarın. İmzayı atana kadar." yönünde).
- **Berkay aktif olmalı (tatmin anı):** Finalde hapı uysalca alıp kapı kapanınca saklar → "gizli satranç"ın ilk hamlesi, dramatik ironi (izleyici bilir, hemşire bilmez).
- **Diyalog:** Replikler ≤15 kelime. Berkay'ın 5 soruluk listesi 2 soruya insin; hemşirenin 22 kelimelik açıklaması bölünsün ("Altı ay oldu, Berkay. Geçen ay da imza diyordun." yönünde); "Yine başladı" kalsın. Doktor: "başlar gibi mi" → "başlamış gibi mi". Genel dış ses ("Hayat bazen bir imzayla...") silinsin.
- **Süre:** Metin gerçekte ~70 sn; 4-5 dk bölümde bu, 1. Reels parçası olur.

## 4-5 dk vuruş planı önerisi (senarist; metin değil)
- **Parça 1 (0:00-1:30) "Altı ay":** eşleşen kesme kancası → plaza flaşları (ortağın sıcak cümlesi + kalem) → uyanış, "Yine başladı" → kapıyı zorlama denemesi → "6 ay" → yansımada harap yüz. Mini cliffhanger: tanımadığı yüz.
- **Parça 2 (1:30-3:00) "Kendi izleri":** Dr. Deniz viziti (müttefik mi?) → her itirazı semptom diye not ediliyor → odada daha önce de uyandığını gösteren kendi izi → her seferinde ilacı yutmuş. Mini cliffhanger: koridorda ayak sesleri.
- **Parça 3 (3:00-4:30) "İlk hamle":** koridor dinleme, ortağın elinde plazadaki kalem → hapı saklama (dramatik ironi) → bölüm sonu cliffhanger. Seçenekler: (A, önerilen) ortak gülümseyerek girer, "beni tanıdın mı?" — cevaptan önce kes; (B) hemşire fısıldar "bu sefer yutma"; (C) dosyada "devir imzası: cuma".

## Sezon motoru
- Büyük soru: Berkay, devir imzasını atmadan bu odadan çıkıp şirketini geri alabilecek mi? Bu 6 ayda unuttuğu şey ne?
- Gizli satranç: imza onda, onu canlı ve uysal tutmak zorundalar; o da uysal görünerek zaman kazanır. Özgünlük: kurumsal zekâsını (müzakere, kaldıraç, bilgi ticareti) hastanede kullanması.
- B1: hapı yutmama + ortağın yüzü. B2: ilk müttefik + bilerek geçersiz imza. B3: ortak da piyon mu / Berkay'ın geçmişi de kirli mi.

## Riskler
- **Özgünlük:** "…o hastane önlüğündeki adam değilim" ve kimliği inkâr edilen zengin adam çıkışı, referans hesap "oadambendegilim" adını çağrıştırıyor → yayın öncesi benzerlik kontrolü; bu replik zaten çıkarılıyor.
- Koridorda kapı açıkken planı yüksek sesle anlatan kötü → "kolaycı" yorumları. Ya Berkay kapıya gidip dinlesin ya da ortak kasten duyulmak istesin.
- "Altı aydır içerde, imza neden hâlâ atılmadı?" → bilinçli ipucu yapılmalı.
- Akıl hastanesi damgalayıcı/grotesk olmamalı; kötü olan sistemi kötüye kullanan kişi.

## Üretim ihtiyaçları (yapımcı; ucuz yollarla ~4-6 gün)
- **Mevcut:** kararma/flaş geçişleri, `hastane_odasi`, `hastane_koridoru`, Dr. Deniz, şok/korku mimikleri, kalp/nefes/hastane sesleri, gerilim müziği, `ofis` şehir manzarası.
- **Yeni:** toplantı odası (`ofis`'ten türet, cam duvar, uzun masa — ekran süresi 3-4 sn) · hücre-oda varyantı (parmaklık, loş, lavabo+ayna, açılır kapı) · ayna *hile çekimi* (gerçek yansıma CPU'da 2× render; ters çekim + cam katmanı) · kadro: `berkay` (takım), `berkay_hasta` (açık mavi önlük, sakal, buzz saç), hemşire (yeni), ortak (yeni: 45-50, açık gri takım, gözlük, güven veren yüz, kalın ses) · eşya: kalem, tepsi/ilaç kabı · jest: ellere bakma · çınlama sesi (≤2 sn, sentez) · kapı arkası boğuk ses filtresi.
- Ucuz yollar: yatıştan doğrulma yerine oturur başla + göz açılışı; koşu yerine hızlı kesme; arkadan yüze yay hareketi yerine iki çekim.
- Render: ~70 sn ≈ 15-30 dk; 5 dk ≈ 1-2 saat.

## Simülasyon puanları (gerçek veri değil)
| Ölçüt | Metindeki gibi (plaza) | Hastanede başla + plaza flaşı | Aynayla başla |
|---|---|---|---|
| 0-3 sn kaydırma riski | 6,0 | **4,0** | 4,4 |
| İlk 30 sn tutundurma | %38 | **%47** | %43 |
| Sonraki bölüm isteği | 5,8 | **6,6** | 5,8 |
En güçlü anlar: "yalnızsın ve hastasın" (gaslighting), aynadaki yüz, ortağın sesinin tanınması. Tatmin anı yok → hapı saklama sahnesi bunu çözer.
