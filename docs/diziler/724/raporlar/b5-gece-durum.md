# 7/24 Bölüm 5: gece durum notu (görüntü yönetmeni, 23 Kasım 2026)

Render ve teslim yapılmadı; kullanıcıya video gönderilmedi. Gece mükemmelleştirmeye harcandı.

## Bitenler
- **Çekim planı:** [b5-goruntu.md](b5-goruntu.md). İçerik:
  - 20 çekim; her birinin ölçeği, açısı, hareketi, ışığı ve mimiği
  - 180° ekseni: sahte Sabri hep sağda, gerçek Sabri ve kapı hep solda
  - iki Sabri'yi ayırt eden işaretler
  - kancalar ve komedi/korku dengesi
- **Kullanıcı kararları işlendi:**
  - "Şaka mı?.. Abi bir adamın eli yürüdü… ELİ." çay davetinden sonra, adımdan önce yer alıyor (çekim 6b, "ELİ"de yakına kesme).
  - "hıığğ" → "abi vallahi büyük hayranınım." boşluksuz.
  - Diğer senarist önerileri kullanılmadı.
- **Bölüm iskeleti:** `dizi-studio/public/episodes/724-05.json`.
  - 11 sahne; replik metinleri `bolumler.md`'den programla birebir alındı (yalnız tırnak başındaki boşluklar kırpıldı).
  - Ses yok; tahmini süreler var. Toplam 42,7 sn + 4 sn bitiş kartı.
  - Motor, ses yokken konuşanın ağzını taslak olarak oynatıyor. ElevenLabs sesleri gelince süreler ve dudak senkronu sesten gelir.
- **Görsel varlıklar (hepsi opt-in; eski bölümler aynı):** 724-04'ten 4 kare yeniden render edildi; teslim edilen videoyla PSNR 38-46 dB.
  - Dev hamamböceği (`engine/bocek.tsx`): pronotum siperi altında gölgeli gözler, ıslak kitin, testere dişli mandibulalar, kırmızı ıslak gırtlak, seğiren palpler, kıllı ve dikenli bacaklar, kanatlar, gözlerde Ece'nin küçük yansıması.
  - Dönüşüm iki ekleme:
    - `donusum_yuz`: yanmış maske gibi erime, damlayan deri ve çene perdesi, yanık ve kabarcıklar, duman, kor çatlaklar, beş parçalı soyulma, simbiyot lifleri.
    - `donusum_govde`: ortadan yırtılma, yere düşüp yığılan deri ve hırka, yaylı açılan bacaklar, tavana büyüme ve kamera takibi, floresana çarpan anten ve kıvılcım.
  - Omuz eli (`omuz_el`): ıslak hırkalı kol ve yaşlı el, sahibi görünmez; sıçrama ile "hoaa", 2.5D baş dönüşü.
  - Diğer eklemeler: `bocek_dev` (ölçek açılışı), `bocek_yakin` (son kare: merakla baş eğme), `ece_yakin`, ön plan katmanları (`ece_sirt`, `sabri_omuz`, `bocek_golge`).
  - Rig'e eklenenler:
    - alanlar: `kirpmaz`, `mumParlak`, `yagmur`, `hik` (nefes çekme), `kahkaha`
    - duygular: `sahteGulus`, `zorGulumse`
    - jestler: `cagir`, `ellerKenetli`
    - kadro: `sabri_sahte` (ses eşlemesi Sabri ile aynı)
  - Motora eklenenler: `sure`, `bgBlur`, `onde`, `bakSira`.
- **Kontrol:** `npx tsc --noEmit` temiz. Her örnek 0,25 sn aralıklı karelerle incelendi. Bulunan hatalar düzeltildi:
  - NaN dönüşüm matrisi
  - kafa dışına taşan yanık ve çatlak
  - kibrit çöpü gibi damlalar
  - tahta gibi düşen deri parçaları
  - ani büyüme
  - altyazıya giren yüzler
  - silik antenler
- `docs/uretim-rehberi.md` §4 kataloğu güncellendi.

## Örnek klipler (yalnız iç kontrol; `ornekler/`)
- `b5-ornek-yuz.mp4`: yüz erimesi ve soyulma (4,7 sn)
- `b5-ornek-govde.mp4`: gövde dönüşümü ve büyüme (4,8 sn)
- `b5-ornek-omuz.mp4`: omuzdaki el, irkilme, dönüş (2,8 sn)
- `b5-ornek-dev.mp4`: devasa böcek, Ece ön planda (2,6 sn)
- `b5-ornek-son.mp4`: son kare (2,2 sn)
- `b5-ornek-taslak.mp4`: bütün bölüm, sessiz, yarı çözünürlük, tahmini sürelerle

## ElevenLabs (KURU ÇALIŞTIRMA, kredi harcanmadı)
- `python3 tools/elevenlabs.py seslendir public/episodes/724-05.json` → **10 replik, eleven_v4, ≈ 667 kredi.**
- Etiketler (`tags`) öneri olarak yazıldı; ses yönetmeni değiştirebilir. Etiketsiz tahmin daha düşük olur.
- "hıığğ" ile "hayranınım" boşluksuz akmalı. Ses yönetmeni tek kayıt alırsa JSON'da iki satır birleştirilip tek replik yapılır.
- `sabri_sahte` sesi `sesler_elevenlabs.json`'da Sabri'nin sesine eşlendi (aynı ses, aynı ayar).

## Sabah için açık sorular / kararlar
1. **Son kare:** Şu an böcek merakla başını eğip siyaha kesiliyor (öneri A). Alternatifler (geri tıslama, siyahta gerçek Sabri'nin sesi) yeni ses ister.
2. **Bitiş kartı:** Yalnızca "7/24 · Bölüm 6 yakında" yazıyor. İzleyiciye bir soru eklenecekse metni kullanıcı verir.
3. **Gerçek Sabri dönüşüm sırasında:** Şu an kadraj dışında. Kısa bir tepki karesi ("biliyordu" ipucu) bir hikâye kararıdır.
4. **Ses gelince yapılacaklar:**
   - Omuz eklemesindeki irkilme anı ("hoaa" başlangıcı) Whisper zamanına göre ayarlanacak.
   - Sahte Sabri'nin uzun repliğindeki ilk vuruşun `gapAfter`'ı = −(süre − 2,4) olacak.
   - "ELİ"deki yakın kesmenin anı (şu an 2,35 sn) kelime başlangıcına bağlanacak.
5. **Render:** Tam çözünürlükte tahminen 8-10 dk. Sonrasında −14 LUFS ve kurallara göre ilk 10 sn analizi yapılacak.

## Görsel riskler
- **f karesi:** Gerçek Sabri'nin işaret eden eli, öndeki Ece'nin başının arkasında kalabiliyor. Bakışı ve başı yönü taşıyor.
- **g karesi:** Gerçek Sabri yalnızca flu ense ve omuz olarak görünüyor (kimliği bir önceki karede kuruldu).
- **Böceğin simetrisi:** Böcek önden simetrik. Seğirme ve salınım bunu kırıyor; geniş kare kısa (2,6 sn) tutuldu.
