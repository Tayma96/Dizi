# B2 · Parça 1: görüntü planı (görüntü yönetmeni)

## Mekân ve ışık
| Mekân | Anahtar / dolgu / arka | Renk |
|---|---|---|
| A `kogus_koridoru` (gunduz, `soguk`) | Tavan floresanı / zemin yansıması / koridor dibi | Yeşil-gri, düşük doygunluk, 4. lamba titrer |
| B `hucre1` (gunduz, `soguk`) | Pencere (sağ üst, soğuk beyaz) / kapıdan sızan floresan, düşük / pencere Deniz'e kontur verir | Gri-mavi, sert kontrast |
| C Tablet videosu | Ekranın kendi ışığı | Mavi-gri tek renk, tarama çizgisi (kat7'nin yeşilinden ayrı) |
| D Final | Parlaklık ve doygunluk düşer | Tek doygun renk lacivert mürekkep (#10204a, TV'deki imza ve `flas_imza` ile aynı) |

**180° ekseni:** B1'de olduğu gibi Berkay solda, personel sağda. Kapı sağda. Yön soldan akar: B1 p5'te sola çıktılar, koridorda da sola yürürler, odaya sağdaki kapıdan girerler.

## Çekim listesi (~31 sn)
1. **A genis sabit, 2,5 sn (establishing).** `enter: sag` ile girip `exit: sol` ile çıkarlar. Önde Berkay (x≈400), arkasında Nalan (x≈560). Nalan onu kolundan tutup iter. Berkay `ofkeli`, geriye Nalan'a döner (`lookAt: nalan`). Arkadan bakıcı gelir (p5 sürekliliği), y≈1500'de küçük görünür.
2. **A orta Berkay, sarsinti (hafif).** "Ekrandaki bendim lan, BENDİM!" `isaret`: geriye, salonu gösterir.
3. **A yakin Nalan, 1,2 sn (dinleyen).** `kararli`, gözünü kaçırır (`bak x:-0.6`).
4. **B genis sabit, 3 sn.** Deniz ilk karede zaten pencere önündedir, birden belirmez. `door: ac`. Nalan, Berkay'ı yatağın kenarına oturtur, sonra kapının içinde (`kapi_ic`) durur ve çıkışı tutar.
5. **B orta Deniz, `angle: alt`, sabit.** "O haber bir yıl önce…" `notr`, `tutuyor` + tablet. `lookAt: berkay_hasta`.
6. Aynı vuruşta `shots` ile **yakin Berkay**: `supheli` → `saskin`.
7. **B orta Berkay, yaklas.** "Ama 'bu sabah' dedi!" `ellerAcik`, `korkmus`.
8. **B iki (Berkay+Deniz), 1,5 sn.** Deniz tableti uzatır (`uzat`). Ekran ışığı Berkay'ın yüzüne vurur.
9. **Insert YENİ `tablet_video`, 4,5 sn, yavaş yaklaş.** "Hayırlı olsun beyler" (ses: `fx: telefon`).
10. **B yakin Berkay, 2 sn.** Deniz kadraj dışından konuşur (`offscreen`): "Bunu dün sen yaptın." `sok`, `pale: 0.4`, `lookAt: deniz`.
11. **Insert YENİ `murekkep_parmak`, 2,5 sn.** Dış ses başlar.
12. **B cok_yakin Berkay, yavaş yaklaş, 3 sn.** Gözler elden boşluğa kalkar. `korkmus`, `tears: 0.3`.
13. **B genis, `angle: ust`, uzaklas, 2,5 sn.** Berkay tek başına yatakta. Arkada Deniz ve Nalan birbirine bakar (`supheli`). Son 1 sn'de kare tablet videosunun dokusuna döner (YENİ katman). `fade: cikis`.

Ölçek sırası: G-O-Y-G-O-Y-O-İ-ins-Y-ins-ÇY-G. Aynı ölçek art arda gelmiyor.

## Süreklilik
- **Berkay:** açık mavi pijama, kirli sakal, yara izi, bileklik. Videoda birebir aynı görünür.
- **Nalan:** beyaz forma, sarı topuz.
- **Deniz:** önlük, topuz, lacivert gözlük. B1'deki panonun yerinde artık tablet var.

## YENİ varlıklar: çizim tarifi
1. **Insert `tablet_video`**
   - **Katmanlar (alttan üste):**
     1. Arka plan: odanın bulanık gri zemini #2a3036.
     2. Tablet gövdesi: #16181c, köşe yarıçapı 60, ekranı 900×1500. Üst kenarda ön kamera noktası, sağ alt köşede Deniz'in başparmağı (#f1c6a0, tırnak #f6dccb). Hafif el titremesi: ±3 px.
     3. Ekran içi video: köşe kamerasından tepeye bakış, `kamera_led` açısıyla aynı. Odanın sadeleştirilmiş çizimi: demir karyola, parmaklıklı pencere, ışık lekesi ve yerdeki çapraz parmaklık gölgesi, sağda kapı. Gece ve tek ışıklı oda: koridordan sızan ışık zemine üçgen düşer.
     4. Filtre: `grayscale(1) sepia(.2) hue-rotate(180deg) saturate(.5) contrast(1.3)` ile mavi-gri.
     5. 8 px'lik sıkıştırma blokları, 3 px tarama çizgisi, kenar vinyeti.
     6. Camda pencere yansıması: %8 beyaz çapraz şerit.
     7. Ekranda parmak izi lekeleri: %5'lik yağlı daireler. Bu küçük leke gerçeklik hissi verir.
   - **Eylem:** Berkay yatak kenarında, pijamalı, bileklik ekranda seçilir. Dizinde boş kâğıt (#e8e8e2), elinde kalem.
     - 0-1,5 sn: imza atar. Kâğıtta iz görünmez; çözünürlük düşük olduğu için belirsizlik kalır.
     - 1,5-3 sn: kâğıdı boşluğa uzatır.
     - 3-4,5 sn: ayağa kalkar, el sıkışır, başını eğer.
     - Gölgesi tek başına. Kameraya bakmaz.
   - **Yazılar:** Videonun üst kısmında "KAM 2 · ODA 12" ve kırmızı ● REC; altta "18.11 · 03:12:07" (saniyeler akar). Yazı tipi monospace, 54 px, #e8f0ff, siyah gölgeli. Video süresi çubuğu: 00:41 / 02:15. Yazılar y 1050-1260 aralığına girmez.
2. **Insert `murekkep_parmak`**
   - **Arka plan:** pijama dizi (#a9c4d6), kumaş kıvrımı gölgesi #8aa8bc.
   - **El:** sağ el, avuç yukarı. Ten #f1c6a0, avuç çizgileri #dda983. Bilekte beyaz plastik bileklik (#f4f4f0), üzerinde yarı silik barkod.
   - **Mürekkep (#10204a):**
     - İşaret parmağının ucu: yoğun leke, kenarı tırtıklı.
     - Orta parmağın yan yüzü: ince iz.
     - Serçe parmak tarafından bileğe doğru: sürtülmüş, açılan bulanık şerit. Sağ elle ıslak imzaya sürtünmenin izi; detay buradan inandırıcı olur.
   - **Kirlilik ayrıntısı:** tırnak kenarlarında koyu kir çizgisi (#3a3030), tırnak altında mürekkep.
   - **Hareket ve ışık:** el hafif titrer (sinüs, 2 px). Odak başta bulanık, 0,6 sn'de netleşir. Işık sol üstten pencereden gelir; parmaklık gölgesi elin üzerinden geçer.
3. **Jest `kolTut` ve `direnme` (sürükleme)**
   - **Nalan (`kolTut`):** sol eli Berkay'ın üst kolunu kavrar, parmaklar pijamayı buruşturur. Kumaşta 3 kıvrım çizgisi #8aa8bc. Sağ eli sırtında. Gövdesi 8° öne eğik.
   - **Berkay (`direnme`):** gövde 10° geriye, başı geriye dönük. Topuklar sürünür, adım yarı hızda.
   - **Geçiş:** poz değişimleri 8 karede yumuşak geçer.
4. **Prop `tablet`:** #16181c gövde. Kapalıyken ekranda pencere yansıması görünür. Açılınca #9fc4ff parlar ve Deniz'in gözlük camında küçük mavi dikdörtgen yansır.
5. **Koridor ayrıntıları**
   - **Zemin:** fayans derzlerinde kir (#7d867f), tekerlek izi çizgileri. Lambaların zemindeki yansıması: uzun soluk elipsler, %10.
   - **Duvar:** lambri üst kenarında çarpma çizikleri. Kapı kollarının altında el kirinden koyu leke.
   - **Kapı:** bir kapının gözetleme camında yüz silueti (ikincil hareket).
   - **Toz:** ışık hüzmesinde toz zerreleri (ortam katmanı).
6. **Oda ayrıntıları**
   - **Duvar ve zemin:** duvarda karyola başı hizasında sürtünme lekesi (#a9b3ab). Boya kabarması. Pencere hüzmesinde toz. Zeminde parmaklık gölgesi.
   - **Karyola:** buruşuk çarşaf, yastıkta baş çukuru.
   - **Kamera:** köşedeki kamerada kırmızı LED yanar. Tablet videosu ile kafiyelenir.
   - **Ayrıntı:** komodinin altında tek bir kalem kapağı. Bu yeni bir ipucu sayılır: dizi-hafizasi onaylamazsa çıkarılır.
7. **İşaretler (`isaretler`):** hucre1'e `yatak_kenar` {x 430, y 1560, size 940, sit} ve `deniz_pencere` {x 760, y 1650, size 1000}. Değerler kareden doğrulanacak.
8. **2D ışık katmanları**
   - `ekranIsigi`: yüzde #9fc4ff radyal parlama (%18) ve gözde mavi parıltı.
   - Pencere konturu: Deniz'in omuz ve topuz kenarında 4 px #eef4ff.
   - `cctv`: isteğe bağlı final geçiş katmanı.

## Riskler
- **2D ışık tasarımı yok:** 2D motor `isik`'i okumuyor, yalnızca `look` var. Çözüm: radyal gradyan katmanı (anahtar, dolgu, kontur).
- **`omuz` ve `ust_aci` 2D'de yok:** plan bunları kullanmıyor.
- **Koridorda yön:** `kaydirma` ile yürüyüş yalnız sağa akıyor. Çözüm: sabit koridor, `enter: sag` → `exit: sol`, yürüyüş yönü (`flip`) kareden kontrol edilir.
- **Odaya giriş:** `enter: sag` derindeki işaretten duvarın içinden geçer. Çözüm: `kapi` işaretinde gizli başlar, kapı açılınca kısa yürür.
- **`kolTut`'ta el kaçabilir:** el karşı karakterin koluna denk gelmeyebilir. Çözüm: Nalan biraz geride durur, eli Berkay'ın omzunun arkasında kalır.
- **Bakış:** kameraya bakış riskine karşı her vuruşta `lookAt` açıkça verilir.
