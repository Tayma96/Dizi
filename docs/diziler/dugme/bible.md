# Kırmızı Düğme · Dizi İncili

> Hikâye alanları (tür, ton, logline, kurallar) kullanıcı senaryoyu yazınca doldurulacak. Bu dosyada şimdilik yalnızca kullanıcı kararları ve GÖRSEL tasarım var (görüntü yönetmeni, 23 Kasım 2026).

## Kimlik
- **Ad:** Kırmızı Düğme (kullanıcı kararı; dizi adı B1'de 3. saniyeden sonra gelir)
- **Tür / ton:** (kullanıcı yazacak)
- **Hedef kitle:** 13-25 yaş arası kızlar (kullanıcı kararı)
- **Logline / ana soru:** (kullanıcı yazacak)

## Yapı
- Bölüm süresi: 4-5 dk (tam) + ~90 sn Reels/Shorts parçaları
- B1 kurgusu: 4-1-2-3-5 (bkz. `bolumler.md`)
- Dizi adı kartı: `ornekler/kd-logo.png` (kompozisyon `KDLogo`; animasyonlu hali `KdLogo` bileşeninde `t` ile)

## Görsel dil
### Logo / dizi adı kartı
- Yazı tipi **Baloo 2 ExtraBold** (OFL, Türkçe harflerin tamamı var; Fredoka denendi, Ğ/ş/İ olmadığı için bırakıldı). Dosyalar `public/fonts/baloo-2-*`, lisans `public/fonts/OFL-Baloo2.txt`.
- "KIRMIZI" kırmızı, koyu konturlu; "DÜĞME" beyazdan pembeye dolgu, koyu kırmızı kontur ve kabartma; **Ü'nün noktaları iki minik kırmızı düğme.** Üstte büyük parlak mantar düğme, altında "001" sayaç; arka planda soluk altıgen petek ve pembe-kırmızı hale, ışıltılar.
- Kart animasyonu: düğme yukarıdan düşer, basılır (ezilme + LED flaşı, sayaç 000→001), harfler sırayla zıplayarak gelir.

### Renk ve ışık senaryosu (her mekânda anahtar + dolgu + arka)
| Mekân | Anahtar | Dolgu | Arka / ayırma | Duygu |
|---|---|---|---|---|
| Beyaz oda (uyanış) | her yerden gelen, kaynağı görünmeyen soğuk beyaz | yok (gölgesiz) | yalnız köşe gölgeleri (AO) | steril, rahatsız edici; karakterlerin ayak gölgesi bile yok |
| Beyaz oda (final) | aynı + kırmızı darbe ışığı | düğme LED'leri | bölmelerin içindeki dönen kırmızı ikaz ışığı | panik, alarm |
| Göbekli adamın salonu | soldaki TV'nin titreyen mavisi | telefon ekranının yüze vuran soğuk ışığı | perde ardındaki şehir (mor) | tembel gece, yalnızlık |
| Market önü | sodyum turuncusu sokak lambası | vitrinden taşan sıcak beyaz | lacivert gök, apartman pencereleri | tanıdık mahalle → tehdit |
| Gece caddesi | sodyum lambalar (akarak geçer) | motor farı | şehir silueti, hız çizgileri | özgürlük, müzik |
| Influencer odası | ring ışık (soğuk beyaz; gözde halka yansıması için) | pembe LED | mor LED şerit + peri ışıkları; arkadaki kapı zifiri karanlık | şeker pembe güvenli alan; kapı = tehdit |

### Mekânlar (`dizi-studio/src/studio/sets/`)
- `kd_beyaz_oda` (`beyazoda.tsx`): gerçek perspektif izdüşümlü küçük bir 3B sahne, 2D çizim diliyle. 8 × 3,6 × 12 m geniş ve derin oda (geri bildirim 1 ile büyütüldü); ortada beyaz silindir kaide, üstünde tek kırmızı mantar düğme, kaidenin önünde sayaç ekranı. Petek yarıçapı 0,42 m: finalde ~610 düğme (önceki ~890'ın %70'i), düğmelerin arasında boş petek yüzeyi görünür.
- `kd_ev` (`dugme.tsx`): bordo kanepe ve dantel örtü, nazarlık, düğün fotoğrafı, sehpada cips paketleri, etiketsiz kola, çay bardağı, çekirdek kabukları, kumanda; solda TV.
- `kd_market_onu`: uydurma "ÇINAR MARKET" (Can Market değil): yeşil-beyaz tente, vitrin, ekmek dolabı, meyve kasaları, kasada uyuyan turuncu sokak kedisi, parke kaldırım, sodyum lamba; önde minibüsün yanaşacağı yol.
- `kd_cadde_takip` / `kd_cadde_kavsak`: ufka daralan yol, akan şerit çizgileri ve lambalar (sürüş takip); kavşak, yaya geçidi, trafik ışığı.
- `kd_yayin`: ring ışık, tripotta telefon (arkası), masada slime malzemeleri ("TUTKAL" şişesi, aktivatör, sim tüpleri), raf dolusu slime kavanozu, posterler, polaroidler, yatak ve peluş tavşan, LED şerit; arkada aralık, karanlık kapı.
- Araçlar: `KacirmaVan` (koyu gri panel van; yan ve önden; kayar kapı; plaka çamurla kaplı, okunmaz; sürücü siluet), `KuryeMotor` (önden scooter: ön kalkan turuncu-turkuaz şerit, far, ön cam, aynalar).

### Beyaz oda finali: "Symbol" (2009) ile karışmaması için bilinçli farklar
- **Derzler:** oda dikişsiz başlar; final anında duvar, tavan ve zeminde **altıgen panel derzleri** belirir (petek). Her petekte bir düğme.
- **Düğme:** acil durdurma tipi **kırmızı mantar başlık**, beyaz altıgen taban plakası, altında **3 haneli siyah LCD sayaç** (her düğmenin kendi numarası), çevresinde LED halka. Basılınca başlık içeri çöker, LED kırmızı yanıp söner, sayaç bir artar.
- **Bölme kapağı:** altıgen, **iki kanatlı sürgülü** (kanatlar yana kayıp duvarın içine girer), kenarında sarı-siyah ikaz şeridi, içi kırmızı dönen ikaz ışıklı karanlık hazne.
- **Işık:** düğmeler dalga hâlinde kaideden dışa doğru belirir, her biri belirirken kırmızı çakar; oda kırmızı darbelerle nabız gibi atar.
- **Nesneler:** Türk gündelik hayatından komik seçki (terlik, simit, lastik ördek, çaydanlık, top, kaktüs, balık, nazar boncuğu, yastık, şemsiye, pasta...).
- Oda motoru, düğme, bölme, nesne ve mızrak bileşenleri hazır; animasyon prototipleri (`KDDugmeOrnek`, `KDKanca` kompozisyonları) kullanıcı kararıyla **senaryodan sonraya** bırakıldı: kod taslak hâlinde duruyor, render edilip denetlenmedi.

### İmza stil denemesi (`ornekler/kd-stil.png`, kompozisyon `KDStil`; karar kullanıcıda)
Aynı iki karakter üç stilde. Hepsi yalnız Kırmızı Düğme için isteğe bağlı açılır; diğer dizilerin rig görünümü değişmez.
1. **Renkli kontur:** siyah çizgi yerine karakterin kendi renginin koyusu, titrek el çizgisi (3 karede bir "kaynar"), renk dolgularında riso baskı kayması, sıcak gölge bandı, kâğıt dokusu. Uygulama: karakteri saran tek SVG filtresi (`KdStilFiltreleri`), düşük maliyet.
2. **Büyük kafa · ifade gözleri:** baş ~1,5×, gövde biraz kısa (oran ~1:3,5), imza göz (yuvarlak-kare iris, tek büyük parlama + küçük yıldız, dış köşede tek kirpik), her karakterde yanak işareti (göbekli: yastık izi, influencer: üç kalp çil), esnek ağız. Uygulama: Look alanları `basOlcek`, `gozStili: "kd"`, `yanakIsaret`, `agizOlcek`, `boy`; orta maliyet (kadraj ve jestler yeniden ayarlanmalı).
3. **Sticker · kesik kâğıt:** kalın beyaz sticker kenarı, yumuşak gölge, hafif eğik duruş, kâğıt dokusu; mekân solgun, karakterler patlar. Uygulama: tek filtre + mekânda doygunluk düşürme; düşük maliyet.
- **İmza işaret:** göğüste minik altıgen rozet (`rozet`), içinde kişisel simge (cips, şimşek, kalp, kolonya damlası, ay, dambıl).

## Ses dili
- (ses yönetmeni; motokurye şarkısı özgün üretilecek, bkz. `bolumler.md`)

## Yasaklar / hassasiyetler
- Gerçek marka, logo, platform arayüzü yok: kurye markası "VINN!", market "ÇINAR MARKET", yayın arayüzü ve "aslan" hediyesi uydurmadır. Kola şişesi etiketsiz.
- Ortak tulum yok (kullanıcı kararı): herkes kendi kıyafetiyle. Beyaz oda düğmesi ve oda dili "Symbol"den farklı tutulur (yukarıdaki liste).
- Kırmızı mantar düğme motifi karakter üstünde yalnız 4. kişinin ipuçlarında kullanılır.
- Kaçırma araçları: plaka okunmaz.
- Şiddet: mızrak göğse ulaşmadan kesilir, kan yok (13-25 kitlesi).
