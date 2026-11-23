# Kırmızı Düğme · Karakter İncili

> Görünüm `dizi-studio/src/studio/cast.json` ile birebir aynıdır (id'ler `kd_*`). Kontrol görseli: `ornekler/kd-kadro.png` (kompozisyon `KDKadro`).
> **Adlar geçicidir.** İstek, ihtiyaç, sır, ark ve replikler kullanıcı senaryoyu yazınca doldurulacak; buradaki her şey GÖRSEL tasarımdır (görüntü yönetmeni, 23 Kasım 2026; geri bildirim 1 işlendi).
> İlke: her karakterin silüeti uzaktan bile ayırt edilir (kadro sayfasında siyah silüet testi var). Her karakterin bir imza aksesuarı ve tekrar eden bir tavrı var. Diğer dizilerimizin karakterlerine benzemez.

## Göbekli Adam (`kd_gobek`, beyaz oda: `kd_gobek_oda`)
- **Yaş / rol:** 38 · bir yıldır evden çıkmamış adam
- **Görünüm (geri bildirim 1'e göre yeniden):** Kilolu olduğu yalnız göbeğinden değil her yerinden belli (rig `kilo: 1`): geniş yüz, gıdı kıvrımı, tombul yanak çizgileri, kalın boyun ve ense, kalın kol ve bacaklar, geniş kalça. Göbek atletin altından taşıyor, atlet gerilmiş. Gün görmemiş solgun ten; şiş, morumsu göz altları (`gozAlti`); noktalı bir haftalık sakal (`sakalNokta`, düz dolgu değil, maske gibi durmaz); seyrek, yağlı, dağınık saç (yeni saç `yagli`: tepesi açılmış, alnına yapışık tutamlar, yağ parlaması). Kollarda ve omuzlarda kıl (`kil`), sararmış ve lekeli atlet (`leke`), üstünde cips kırıntıları (`kirinti`). Soluk lacivert eşofman altı, mavi terlik. Varsayılan yüz: ağzı açık, gözkapakları ağır. Biraz çirkin ama tiksindirmez; izleyici güler.
- **Beyaz odada:** buruşuk; tek terlik, öbür ayağında başparmağı delik çorap (`tekTerlik`).
- **Pozlar:** `gobekKasi`. `telefonYatay` + `telefon_yatay`: telefonu iki eliyle yatay tutup göbeğine dayar, film izler gibi; ekran ona dönük, kameraya arkası görünür. Salon karesinde kanepede yan yatmış.
- **Silüet:** yuvarlak, geniş, kısa boylu (`boy: 0.97`).
- **Ses:** `voices/ref_erkek.wav` (geçici eşleme)

## Motokurye (`kd_kurye`, `kd_kurye_kasksiz`, beyaz oda: `kd_kurye_oda`)
- **Yaş / rol:** 24 · motokurye
- **Görünüm:** Turkuaz, kabarık kurye montu (`kurye`, `omuzEn: 1.12`): koyu omuz boyunduruğu, dik yaka, reflektör şeritler, uydurma "VINN!" rozeti. Sırtta turkuaz-sarı teslimat çantası, siyah eldiven, kablolu beyaz kulaklık (`kulaklikKablo`).
- **Kask (geri bildirim 1):** gerçekçi oranda, kafanın yaklaşık 1,2 katı. Siyah, tam yüz kask, sarı şerit, geniş vizör; yüz vizörün ardından görünür, vizörde kayan yansıma var (`kaskYansima`).
- **Beyaz odada:** kask ve çanta yok; saçında kask izi (`kaskIzi`), kulaklık kablosu sarkık, eldivenler elinde.
- **Silüet:** geniş, kabarık omuzlar, dirsekler dışarıda.

## Influencer (`kd_influencer`, beyaz oda: `kd_influencer_oda`)
- **Yaş / rol:** 19 · canlı yayıncı, slime yapar
- **Görünüm:** perde kakül, uçları pembe uzun saç (`perdeli`), iki kalp toka (`kalpToka`), pembe takma tırnak (`tirnak`), lila far, eyeliner, ruj, ışıltı. Altın halka küpe, pembe saç lastiği. Lila oversize sweatshirt üstünde uydurma "gülen slime" baskısı, bol paça jean.
- **Beyaz odada:** telefonu yok, elleri boşlukta kenetli; makyajı dağılmış.
- **Silüet:** uzun düz saç, A biçimi (bol üst, bol paça).

## Kar maskeli (`kd_maskeli`)
- Koyu gri kar maskesi, yalnız göz yarığı açık (ağız deliği yok, sakal gibi okunmasın diye). Siyah kapüşonlu, eldiven, bot. Minibüs sürücüsü yalnızca siluet.

## 4. kişi: üç yeni seçenek (geri bildirim 1)
Her biri ilk bakışta sevimli ve komik, akılda kalan ve paylaşılabilir bir tip. Hepsinde içeriden biri olduğuna dair ince ipuçları var. **Kırmızı mantar düğme motifi bilinçli olarak yalnız 4. kişinin ipuçlarında kullanılır.**
1. **Kolonya Teyze** (`kd_dorduncu_teyze`, 55): sıkı perma (yeni saç `perma`), bordo çerçeveli gözlük ve altın gözlük zinciri (`gozlukZinciri`), mor hırka, inci küpe, kocaman el çantası.
   - *İpuçları:* çantası hiç alınmamış; hırkasının düğmeleri minik kırmızı mantar düğme (`dugmeRenk`); perması ve zinciri bozulmamış.
   - *Komik jest:* herkesin eline kolonya döker; çantasından durmadan bir şey çıkarır; aşırı kibar söz kalıpları (replik kullanıcıda).
   - *Silüet:* kısa boy, yuvarlak perma, koca çanta.
2. **Uykucu** (`kd_dorduncu_uykucu`, 22): ay-bulut desenli bebek mavisi pijama (yeni kıyafet `pijama`), alnına itilmiş pembe uyku maskesi (`uykuMaskesi`), kocaman tavşan terlik (`tavsanTerlik`), dağınık saç.
   - *İpuçları:* terliklerinin tabanı tertemiz; kaçırıldığı hâlde hiç şaşırmıyor; pijamasının tek bir düğmesi kırmızı.
   - *Komik jest:* her sahnede esner, en gergin anda kıvrılıp uyur, maskesini indirip kaldırır.
   - *Silüet:* uzun ve sıska, başı eğik.
3. **Sporcu Abi** (`kd_dorduncu_sporcu`, 30): mor eşofman, lime şerit, ter bandı (`terBandi`), göğüste çapraz bel çantası (`belCantasi`), keçi sakal, tesbih (`tesbih`).
   - *İpuçları:* tesbih taneleri minik kırmızı mantar düğme; şınav çekiyor ama ter bandı kupkuru; bel çantası kapalı ve dolu.
   - *Komik jest:* gerilince şınav çeker, tesbih şaklatır, herkese nefes egzersizi yaptırmaya kalkar.
   - *Silüet:* uzun, geniş omuzlu (`omuzEn: 1.16`), eli belinde.
- Seçim kullanıcıda.

## Beyaz oda görünüşü (kullanıcı kararı: ortak tulum YOK)
Herkes kaçırıldığı andaki kendi kıyafetiyle; imza detaylar karakteri anlatır (bkz. her karakterin "Beyaz odada" maddesi). 4. kişi tertemiz. `kd-kadro.png` 3. satır: imza detaylar + silüet testi.

## FPS el seçenekleri (kanca)
`FpsEl` (`engine/KirmiziDugme.tsx`) altı seçenek sunar:
- göbekli: tombul, kıllı, solgun önkol;
- kurye: mont ve eldiven;
- influencer: lila kol, pembe tırnak, saç lastiği;
- Kolonya Teyze: mor hırka, altın bilezik;
- Uykucu: pijama kolu;
- Sporcu Abi: eşofman kolu, bileğinde kırmızı düğme taneli tesbih.

## İmza işaret önerisi (stil denemesi, `ornekler/kd-stil.png`)
Her karakterde göğüste minik altıgen rozet (`rozet`): biçim beyaz odanın peteğinden gelir, simge kişiye özeldir.
- Göbekli: cips
- Kurye: şimşek
- Influencer: kalp
- Kolonya Teyze: kolonya damlası
- Uykucu: ay
- Sporcu Abi: dambıl
