# 7/24 · Bölüm 5 · 2. parça ("Işıklar"): görüntü yönetmeni raporu (23 Kasım 2026)

Replik yok, yeni metin yok. Ekrandaki yazılar yalnız "Kulaklıkla izle" rozeti ile fısıltı altyazıları ("Ece…", "Kızım…").

## Çıktılar

| Dosya | İçerik |
|---|---|
| `dizi-studio/public/episodes/724-05-p2.json` | Bölüm dosyası: 17 vuruş, 56,0 sn, `endCard: false`. Ses: ilk sahnede `music: efekt/b5p2_tam` (ses yönetmeninin önerisi; başka ses girdisi yok). |
| `dizi-studio/src/studio/engine/Inserts12.tsx` | Parçanın bütün çekimleri. Opt-in: yalnız `p2_*` eklemeleri. Kontrol kompozisyonu: `B5P2Kare`. |
| `dizi-studio/src/studio/rig/Character.tsx`, `types.ts` | Opt-in poz alanları: `agizKapa` (iki elle ağzı kapama; eller baş grubunda, nefesle birlikte hareket eder), `elTitre`, `dudakTitre`. |
| `dizi-studio/src/studio/engine/Inserts3.tsx` | `p2_*` türlerinin yönlendirmesi. |
| `dizi-studio/src/studio/engine/Inserts11.tsx` | `DeriYigin` dışa açıldı (yalnız `export`). |
| `dizi-studio/src/Root.tsx` | `B5P2Kare` kompozisyonu. |
| `bolumler/724-05-p2.mp4` | Tam render. 1080×1920, 30 fps, 56,0 sn. Ses stereo (binaural), −14,1 LUFS, gerçek tepe −1,6 dBTP. |
| `ornekler/b5p2-kepenk.mp4` (13,5–19), `b5p2-sel.mp4` (22–33), `b5p2-cakma.mp4` (33–39,5), `b5p2-fisilti.mp4` (39–56) | Mastering yapılmış dosyadan alınan örnek kesitler. |

Bölüm dosyası, ses planından (`724-05-p2-ses.json` → `plan`) programla üretildi. Kaynak `isik.B_pencereler`, `isik.kisa_sonmeler`, `isik.E_cakma`, `kepenk.inis`/`vuruslar`, `olaylar` (raftan düşmeler, uçan böcek) ve `fisiltilar` (W1–W6: başlangıç, bitiş, yön). Bütün kesmeler ve ışık değişimleri bu zamanlara kare doğruluğunda bağlı.

## Mastering
- Remotion çıktısı stereo.
- Ses yönetmeninin miksi zaten −14,14 LUFS'tu. Tek geçişli `loudnorm` dinamik moda geçip sessiz bölümleri pompaladığı için kullanılmadı. Komut:

  `volume=0.14dB, aresample=192000, alimiter=limit=0.80:level=false, aresample=48000`
  - Çıkış: AAC 256k, `-ac` yok.
  - Bu, 4× örneklemede sınırlayıcı ile yapılan gerçek tepe güvenliğidir.
- Ölçüm sonuçları:
  - I −14,1 LUFS, TP −1,6 dBTP.
  - Sol ve sağ kanal farklı: 51–54 sn'de L −16,3 dB, R −20,8 dB.
  - 0–5 sn ve 54–56 sn dijital sessiz.

## Çekim listesi

Eksen B5 ile aynı: böcek ve depo sağda, kapı ve gerçek Sabri solda.
- **Kasa görünümü:** kapı tarafı, depoya bakar.
- **Kapı görünümü:** depo tarafı, kapıya bakar.

| # | Zaman (sn) | Görünüm · ölçek | Açı / hareket | Işık | Oyunculuk / olay |
|---|---|---|---|---|---|
| A1 | 0,00–2,60 | kasa · geniş, üç katman. Önde flu gerçek Sabri'nin kel ensesi ve bıyık ucu; ortada Ece'nin sırtı; depo önünde tavana kadar dev böcek; yerde deri yığınları ve ambalaj | siyahtan 0,9 sn açılış, çok yavaş yaklaşma | sabit floresan, tekinsiz ton, sert düşüş | Her şey donmuş: böcek kıpırtısız. Ece hafifçe titrer, başı böceğe kalkık. 0,5 sn'de "Kulaklıkla izle" rozeti (üst güvenli alan, y 300). |
| A2 | 2,60–5,00 | kapı · orta iki kişi: Ece önde, arkasında solda Sabri | ters açı, yavaş yaklaşma | sabit floresan | Ece dehşette, gözyaşı var, bakışı kadraj sağında (böcek). Sabri korkmuş ve ıslak. Rozet 4,25–4,6'da söner. |
| B1 | 5,00–8,60 | kasa · geniş (A1 ile aynı kadraj; sıçramalar okunsun diye) | sabit + çok yavaş yaklaşma | **yalnız ses planının ışık pencereleri:** 5,06–5,45 / 6,30–6,48 / 7,40–8,60. Karanlıkta cılız kırmızı (kamera arkasındaki saat), böceğin gözlerinde kırmızı parıltı | Böcek her yanışta bir adım yakında: depo (~7 m) → 6 m → 5 m. Konum, ışık gelmeden hemen önce değişir; hareketi görmeyiz. |
| B2 | 8,60–11,00 | kapı · yakın Ece, arkada flu Sabri | yavaş yaklaşma | karanlıkta yüz yalnız kırmızı saatle aydınlık; pencereler 9,10–9,30 / 9,90–10,25 | Dehşet, gözyaşı artar. Sabri'nin varlığı bir kez daha kurulur. |
| B3 | 11,00–13,80 | kasa · orta, omuz üstü: önde Ece'nin sırtı ve başı, üstüne eğilen böceğin kafası ve mandibulaları | yaklaşma | pencereler 11,0–12,2 / 12,55–12,75 / 13,4→ | Böcek 3 m → 2,4 m → 1,8 m. Mandibulalar Ece'nin başının hemen üstünde. |
| C1 | 13,80–16,00 | kapı · geniş (vitrin + kapı) | sabit; çarpmalarda sarsıntı | 14,00–14,12 sönme; 15,40 kısa sönme | Üç kepenk (sol vitrin, kapı, sağ vitrin) 14,00 / 14,06 / 14,13'te çarparak iner; düşüş 13,83'ten görünür. 15,40'ta ilk vuruş: göçük, titreşim, toz. Ece ile Sabri irkilir; Ece bakışını kapıya çevirir. |
| C2 | 16,00–18,60 | kepenk · ekleme (içeriden çok yakın; önde cam kaydı ve ters "AÇIK" neonu) | yaklaşma; her vuruşta 14 px sarsıntı | 16,55 / 17,50 / 18,25 kısa sönmeler | 16,55 / 17,50 / 18,25'te göçükler. Çıtalar göçüğün çevresinde bükülür, metal kırışıkları, toz dökülür. 15,40'taki göçük de görünür. |
| C3 | 18,60–22,00 | kapı · yakın Ece, arkada flu Sabri ve göçüklenen kepenk | yavaş yaklaşma; vuruşlarda ölçülü sarsıntı (6 px) | sabit (ses planı: 18,9'dan sonra sönme yok) | Vuruşlar hızlanır: 18,90 → 21,82, 10 vuruş. Ece iki eliyle ağzını kapatır (18,9–19,2), sessiz ağlar, her vuruşta gözlerini sıkar. |
| D1 | 22,00–25,00 | koridor · yakın (sol raf) | hafif yaklaşma | ön floresan | Tek tük: ürün aralıklarından önce antenler, sonra böcekler çıkar. Paketlerin yere çarpması 22,15 / 22,9 / 23,6 / 24,3'e bağlı. |
| D2 | 25,00–28,30 | koridor · geniş (tek kaçış noktası, sonda DEPO) | hafif yaklaşma | ön iki floresan yanık, arka floresanlar sönük; sel karanlıktan gelir | Raflar "erir": sel, damlayan bir kenarla rafların yüzünden aşağı akar. Paketler devrilir (düşüşler 25,1…27,6'ya bağlı). Zemindeki sel dalgası kameraya doğru akar. |
| D3 | 28,30–31,30 | koridor · zemin hizası. Önde Ece'nin bacakları arkadan (kot, beyaz spor ayakkabı) | alçak açı, sabit | ön floresan havuzu | Sel ayakkabılara ulaşır. Böcekler topuklara tırmanır, paketler düşer. 30,5'te uçan böcek kameranın üstünden geçer. |
| D4 | 31,30–33,00 | kapı · yakın Ece, arkada Sabri | yaklaşma | floresan | Eller ağzında, gözler sımsıkı, ağlıyor. Böcekler kazağından omzuna tırmanır. |
| E1 | 33,00–35,60 | kapı · orta Ece (kadraj sağında; solda Sabri'nin yeri) | yavaş yaklaşma | **floresan tamamen sönük, tek kaynak kırmızı saat.** Arka plan zifiri (Sabri'nin yeri görünmez) | Her şey durur; omzundaki böcekler de donar. 33,35'te nefesini tutar. |
| E2 | 35,60–37,60 | aynı | yaklaşma sürer | kırmızı | Ellerini indirir. 36,35'te yutkunur. Gözleri sola, Sabri'nin olduğu yere kayar. Sol eli yana-arkaya, karanlığa uzanır. |
| E3 | 37,60–39,00 | aynı | sabit | **37,60–37,95 son floresan çakması**, sonra yine kırmızı | Çakmada Sabri'nin durduğu yer **bomboş**. Ece'nin eli boşluğu tutuyor, gözleri şokta. 38,05'te elleriyle ağzını kapatır (bastırılmış hıçkırık). |
| F | 39,00–54,00 | Ece yakın → çok yakın, tek plan (15 sn) | çok yavaş yaklaşma (z 1,0 → 1,38). Sonda kadraj sesin geldiği sağ tarafa kayar, kulağının arkasında boşluk açılır | tek ışık kırmızı saat: alın ve elmacık aydınlık, çene ve boyun karanlıkta | Fısıltılara giderek ağırlaşan tepkiler (aşağıda). |
| G | 54,00–56,00 | siyah | sert kesme (54,00, tek kare) | — | Fısıltının en yakın anında kararma; ses de 54,00'te dijital sıfır. |

### F: fısıltı tepkileri

Ses planı yönleri: az < 0 Ece'nin sağı, yani kadraj solu.

| Zaman | Ses | Ece |
|---|---|---|
| 39–42 | (nefesler, kitin) | Elleri ağzında. 39,8–42'de elleri yavaşça iner, dudakları görünür. |
| 42,15 | Sabri'nin ıslak nefesi | Gözler bir an büyür (`gozSok` 0,45). |
| 43,60 | W1 "Ece…" (Sabri, sağ arka) | Gözler kadraj soluna kayar; baş dönmez (donmuş). |
| 45,00 | W2 "Kızım…" (anne, sol arka) | Gözler sağa kayar. Dudak titrer, gözyaşı akar; ifade ağlamaya döner. Annesinin sesi onu en çok kırar. |
| 46,60 | W3 "Ece…" (enseden sağdan sola geçer) | Gözler sesi izler, sonra sımsıkı kapanır. |
| 47,55 | W4 "Kızım…" (sağ üst arka) | Gözler sola; dudak titremesi sürer. |
| 48,50 | (Ece'nin kaçırdığı nefes) | Gözlerini sıkar, iki eliyle ağzını kapatır. |
| 50,00 | W5 "Kızım…" (sol kulağa iner) | Dehşet: gözler fal taşı, bebekler küçülür, sağa kayar. |
| 51,30 | W6 "Ece…" (sağ arkadan enseyi dolanıp sol kulağa) | 51,55'te tamamen donar: nefes, titreme ve göz kırpma durur. Gözler sesi sağa izler. 52,5–53,9'da sol kulağının hemen arkasında, karanlıkta bir profil belirir: kel baş, burun, bıyık. Yalnız kırmızı kenar ışığıyla görünür; flu. |
| 54,00 | kesme | siyah |

## Kararlar ve gerekçeler
- **Altyazı:** "Ece…" ve "Kızım…" yazılır: italik, konuşmacı etiketi yok, sesin geldiği tarafta, yüzün altında (y ≈ 1120, güvenli alanda). Gerekçe:
  - Reels/Shorts izleyicisinin büyük kısmı sessiz izler. Fısıltı bu parçanın ödemesi; yazı olmazsa sessiz izleyici hiçbir şey anlamaz.
  - Küçük ve sönük tutuldu, böylece kulaklıkla izleyenin deneyimini bozmaz.
  - Üst üste binen W5/W6 alt alta dizilir.
- **"🎧" emojisi:** Render tarayıcısında emoji yazı tipi güvenilir olmadığı için kulaklık simgesi SVG olarak çizildi. Metin: "Kulaklıkla izle" (Nunito 800, 44 px).
- **A'da ışık yanık:** Ses planında A dijital sessizliktir; ışık pencereleri 5,06'da başlar. A'nın görevi "kim nerede"yi kurmak olduğu için A aydınlık bırakıldı. Vızıltının olmaması donmuşluğun parçası.
- **Böcek seli için yeni açı (koridor):** 2D setlerde yalnız sigara dolabı vardı. "TÜM raflar"ın okunması için tek kaçış noktalı bir raf koridoru çizildi. Sonunda DEPO var ve aynı yöne bakıyor, böylece eksen korunuyor.
  - Böcekler dev böceğin ailesinden: aynı pronotum motifi (açık kenar, iki koyu leke) ve aynı renk paleti.
  - Sel, ışığın değdiği yerde gösterilir; arka floresanlar sönük olduğu için sel karanlıktan gelir.
- **E'de arka plan zifiri:** Saat ışığı yalnız Ece'ye ulaşır. Sabri'nin yokluğu ancak çakmada görünür; ilk denemede kırmızı ışık arka planı da aydınlatıyordu ve yokluk erken seçiliyordu.

## 0,25 sn kare denetimi

Bütün parça 0,25 sn aralıkla, 224 kare ve 7 kontak sayfası olarak birkaç tur incelendi. Kritik anlar 1/30 sn aralıkla ayrıca incelendi:
- kepenk inişi: 13,7–14,4
- son çakma: 37,5–38,2
- sel doruğu: 27,6–28,4
- fısıltı ve kararma: 53,4–54,1

Bulunan ve düzeltilen sorunlar:
1. A1/B1: Ece'nin sırtı kadrajın altında küçük kalıyordu → büyütülüp yukarı alındı (baş y ≈ 1150).
2. B3: Sabri'nin flu başı Ece'nin başını örtüyordu → sola kaydırıldı.
3. B3: Böceğin karın kısmı bir duvar gibiydi → kamera yükseltildi. Kadrajda baş, mandibulalar ve Ece'nin başı var.
4. Ağız kapama: rig'in yuvarlak elleri parmakların üstünde görünüyordu → eller kollardan sonra çiziliyor. Ağız kapalıyken rig eli gizleniyor, bilekte kazak manşeti var.
5. E2: Uzanan kol kadrajın yanlış tarafındaydı (sağ) → sol kol yapıldı (Sabri'nin tarafı).
6. E1/E2: Kırmızı ışık arka planı aydınlatıyor, Sabri'nin yeri erken boş görünüyordu → `bgKaranlik`.
7. D1: Böcekler okunmayacak kadar küçüktü → yakın raf kadrajına geçildi. Önce anten, sonra böcek; boy 11 cm ölçeğinde.
8. D2: Erime kenarı dişli ve rastgele görünüyordu → yumuşak damla parmakları. Uçuşan dev paketler azaltıldı (yalnız Z > 1,6, ölçülü savrulma).
9. Raflar kitaplık gibi duruyordu → paket boyları ve etiket şeritleri çeşitlendirildi.
10. D3: Ece'nin gövdesi ve tavan armatürü üst üste biniyordu. Yalnız bacaklar kalacak şekilde yeniden kadrajlandı (zemin kamerası, Ece 0,62 m).
11. D3: Raflar D2'nin sonunda erimişken D3'te sağlam görünüyordu (süreklilik) → erime öne çekildi.
12. C2: Göçükler yastık gibiydi → metal kırışık çizgileri eklendi, gölge koyulaştırıldı.
13. C3: 3,4 sn aynı kareydi → her vuruşta göz sıkma ve irkilme.
14. F: Yüz düz, doygun kırmızıydı → üstten ve kadraj sağından düşen ışık, alın-elmacık parlak, çene karanlıkta; yüz büyütüldü (boy 3300).
15. F: Siluet kadrajın dışında kalıyordu → sesin geldiği sağ tarafa kadraj kayması eklendi. Siluetin kenar ışığı, ışık katmanının üstünde çiziliyor.
16. B: Uzun karanlıklarda kare tamamen siyahtı → cılız kırmızı saat ışığıyla siluetler ve böceğin gözlerindeki parıltı görünüyor. Konum değişimi, ışık gelmeden hemen öncesine alındı.
17. Ses planı güncellendi (W6 51,0 → 51,3) → JSON yeniden üretildi, tam render tekrarlandı.

**Işığa duyarlı epilepsi denetimi:**
- Kare başına ortalama parlaklık ölçüldü; ≥ %10 değişim geçiş sayıldı.
- Sonuç: herhangi 1 sn'de en çok **2 flaş** (sınır 3). En yoğun yer 17,4–18,4.
- Tam ekran beyaz flaş yok. Son çakma tek pencere: 37,60–37,95, normal oda ışığı.

**Güvenli alan:**
- Rozet y 300–380, x 270–630.
- Altyazılar y 1120–1290; x 140–560 ve 340–760.
- Yüzler üst-orta bölgede; altyazı yüzü kapatmıyor.

## Eski bölümler değişmedi

Değişiklikten önceki kod (b4f26e5) ayrı bir worktree'de, aynı `public` ile render edildi ve yeni kodla karşılaştırıldı:
- 724-04: kare 60, 420, 800, 1100
- 724-05: kare 100, 720 (omuz eli), 1350 (eller kenetli), 1520

Sekiz karenin hepsinde PSNR **sonsuz** (bit bit aynı). `npx tsc --noEmit` temiz.

## İlk 10 saniye (saniye saniye)

| sn | Ne görülüyor |
|---|---|
| 0–1 | Siyahtan 0,9 sn'de açılış. Kasa geniş planında önde Sabri'nin ensesi, ortada Ece'nin sırtı, depo önünde tavana kadar dev böcek. 0,5'te "Kulaklıkla izle" belirir. Ses dijital sıfır. |
| 1–2 | Donmuş tablo. Yalnız Ece'nin titremesi ve çok yavaş yaklaşma var. Kim nerede net. |
| 2–3 | 2,6'da ters açıya kesme. Ece önden: dehşet, gözyaşı. Arkasında solda gerçek Sabri. Saat 06:03, camda yağmur. |
| 3–4 | Aynı plan. Sabri göz kırpar, Ece kıpırtısız. Rozet okunur durumda. |
| 4–5 | Rozet 4,25–4,6'da söner. Sessizlik sürer. |
| 5–6 | 5,00 karanlık. 5,06–5,45 floresan yanar (vızıltı): böcek hâlâ depoda. Sonra karanlık; cılız kırmızıda siluetler ve böceğin gözlerinde parıltı. |
| 6–7 | Karanlık. 6,30–6,48 kısa yanışta böcek bir adım yakında. |
| 7–8 | 7,40'ta ışık gelir ve 1,2 sn kalır: böcek 5 m'de, belirgin biçimde büyümüş. Mandibula sesi. |
| 8–9 | 8,60'ta Ece'nin yakınına kesme. Karanlıkta yüzü yalnız kırmızı saat ışığında. 9,10–9,30'da floresan yanar; arkasında Sabri. |
| 9–10 | Kırmızı karanlık. 9,90–10,25 yanışı: Ece'nin gözyaşları, Sabri arkada. |

## Açık riskler
- **5,45–7,40 arası:** Yalnız 0,18 sn'lik bir yanış var. Görüntü neredeyse karanlık, ses sessiz; kaydırıp geçme riski taşır. Cılız kırmızı siluetler ve göz parıltısı var, ama bilinçli bir bekletme. İstenirse ses planında ikinci pencere uzatılabilir (6,30–6,48 → 6,30–6,70).
- **F'deki siluet** bilerek çok az gösteriliyor: kırmızı kenar ışığı, kadrajın sağ kenarı. Bazı izleyiciler fark etmeyebilir. Daha belirgin istenirse kenar ışığı güçlendirilir.
- **Kadrajın sağ kenarı:** F'nin sonunda kadraj sesin tarafına kaydığı için siluet sağ kenarda (x > 880). Platform düğmeleri y 900–1600'de; siluet y 500–900'de, çakışma az.
- **D3:** Düşen paketler havada düz dikdörtgen olarak geçiyor (hareket bulanıklığı yok). 2–3 karelik anlar.
- **Ses planı A'da ışığı tanımlamıyor.** Görüntüde A aydınlık bırakıldı (gerekçe yukarıda). Ses yönetmeniyle teyit edilmeli.
- **`docs/uretim-rehberi.md` §4 kataloğu güncellenmedi:** Bu görevde dosya listem dışındaydı. Yeni varlıklar: `p2_kasa`, `p2_kapi`, `p2_kepenk`, `p2_koridor` (raf koridoru seti), `p2_fisilti`, `p2_kulaklik`, mini hamamböceği, `agizKapa`, `dudakTitre`. Genel yönetmen eklemeli.

## Kaldığım yer (24 Kasım 2026, limit nedeniyle ara kayıt)
1. D aralığı (22–33) yeniden yapıldı, ama tam render ve rapor güncellemesi henüz yok. Yapılanlar:
   - D1'de ilk böcekler artık birden belirmiyor. Paketlerin arkasından kırpma maskesiyle çıkıyorlar: önce anten, sonra baş, sonra gövde.
   - Devrilen paket önce sallanıyor, arkasındaki küme sonra dökülüyor.
   - Ece sessizce boğuşuyor: D3'te bacağını silkeleyip geri çekiliyor ve eliyle paçasını silkeliyor. D4'te tek eli ağzında, öteki eliyle silkeliyor, sonunda iki eli ağzında donuyor.
   - "Kulaklıkla izle" rozeti kaldırıldı.
2. Yedek alındı: `bolumler/724-05-p2-v1.mp4`.
3. Eski kod (worktree, HEAD 2af7c11) ile 0–22 ve 33–56 aralığından 0,25 sn'lik 181 kare scratch'te hazır (`kimlik_eski/`). Aynı kareler yeni kodla render ediliyordu (`kimlik_yeni/`), karşılaştırma yapılmadı. Rozet karelerinde fark yalnız rozet alanında olmalı.
4. Sıradaki adımlar:
   - PSNR karşılaştırması.
   - KD karşılaştırması: `KDKanca` ve `KDDugmeOrnek` kareleri, eski hâli `kd_eski/`.
   - Tam render → `bolumler/724-05-p2.mp4` (−14 LUFS, stereo).
   - Önce/sonra karelerini `ornekler/b5p2-sel-v2-*.png` olarak kaydetmek.
   - Ses yönetmenine boğuşma sesleri:
     - 28,3–29,6 ayak sürtmesi
     - 29,8–30,9 paça silkeleme, kumaş hışırtısı
     - 31,3–32,6 kumaş silkeleme
     - 31,9 ve 32,1 böcek konma
     - 32,7 iki el ağza, bastırılmış inilti
5. Parça 1 düzeltmeleri başlamadı (ışık, g sahnesindeki baş dönüşünde yüz parçaları, manik ses). Yapılan tek hazırlık: `agizKapaEl` alanı eklendi (istenirse devreye giriyor).
