# 7/24 Bölüm 5: gece durum notu (görüntü yönetmeni, 23 Kasım 2026)

Kullanıcıya video gönderilmedi; tam kalite render ve teslim öğlene bırakıldı. Gece mükemmelleştirmeye harcandı.

## Bitenler
- **Çekim planı:** [b5-goruntu.md](b5-goruntu.md). İçerik:
  - çekimlerin ölçeği, açısı, hareketi, ışığı ve mimiği
  - 180° ekseni (sahte Sabri hep sağda, gerçek Sabri ve kapı hep solda)
  - iki Sabri'yi ayırt eden işaretler
  - kancalar, komedi/korku dengesi
- **Kullanıcı kararlarının hepsi işlendi:**
  - "Şaka mı?.. Abi bir adamın eli yürüdü… ELİ." çay davetinden sonra, adımdan önce yer alıyor; "ELİ"de yakına kesme var.
  - "hıığğ" → "hayranınım" boşluksuz.
  - **Kükreme** var: hamle, geri yatan antenler, hava halkaları, salya, Ece'nin saçı savrulur.
  - "lülü?", 1 sn sessizlik, mahçup "bu da mı olmadı?".
  - Diğer senarist önerileri kullanılmadı.
- **Bölüm JSON'u:** `dizi-studio/public/episodes/724-05.json`.
  - Sesler ses yönetmeninden.
  - Kamera kesmeleri gerçek kelime zamanlarına bağlandı (b: "gece"de Ece'ye; d2: "ELİ" 3,75 sn; f/g bakışları).
  - Final siyah 1,2 sn.
  - Süre 57,7 sn + 4 sn kart ≈ **61,7 sn** (taslak videoda 62,4).
- **İnceleme 1'in bütün maddeleri düzeltildi:** notlar [b5-inceleme-1.md](b5-inceleme-1.md) sonunda. Kısaca:
  - omuz eli arkadan geliyor, parmaklar omuzdan sarkıyor
  - Ece dokunulan tarafa dönüyor; profilde kesiliyor, gövde de dönüyor
  - gerçek irkilme
  - tek hamamböceği tasarımı (pronotum kalkanı her çekimde aynı)
  - kalın ve bağlı simbiyot lifleri
  - kömürleşmiş erime
  - gri üçgen kaldırıldı; bacaklar ve kanatlar düzeltildi
  - kenar ışığı, kontrast
  - sona canlılık eklendi
- **Süreklilik düzeltmesi:** Yüz çekimi pronotum açık bitiyordu; gövde çekimi artık da kalkanlı başlıyor.
- **Eski bölümler değişmedi:** bütün eklemeler opt-in. 724-04'ten kareler yeniden render edildi; PSNR 38-46 dB. `npx tsc --noEmit` temiz.

## Örnek klipler (yalnız iç kontrol; `ornekler/`)

| Dosya | İçerik | Süre |
|---|---|---|
| `b5-ornek-omuz.mp4` | omuz eli, irkilme, dönüş | 2,8 sn |
| `b5-ornek-yuz.mp4` | yüz erimesi, soyulma, pronotumun açılması | 4,7 sn |
| `b5-ornek-govde.mp4` | gövde dönüşümü, büyüme, kıvılcım | 4,8 sn |
| `b5-ornek-dev.mp4` | ölçek açılışı (Ece ön planda) | 2,6 sn |
| `b5-ornek-kukreme.mp4` | kükreme | 1,5 sn |
| `b5-ornek-son.mp4` | son kare (gözlerde Ece'nin yansıması) | 2,2 sn |
| `b5-ornek-taslak.mp4` | bütün bölüm, seslerle, yarı çözünürlük, miks/mastering yok | |

## Sesler / kredi
- Kuru çalıştırma tahminim 10 replik için ≈ 667 krediydi.
- Seslendirmeyi sonradan ses yönetmeni yaptı. Gerçek harcama onun raporunda: `b5-ses.md`.
- Ben kredi harcamadım, `--onayla` kullanmadım.

## Sabah için açık kararlar
1. **Son kare:** Böcek merakla başını eğip siyaha kesiliyor (öneri A). Alternatifler yeni ses ister.
2. **Bitiş kartı:** Yalnızca "Bölüm 6 yakında" yazıyor; izleyici sorusu eklenecekse metni kullanıcı verir.
3. **Gerçek Sabri dönüşüm sırasında:** kadraj dışında. Kısa bir tepki karesi bir hikâye kararıdır.
4. **Tam render:**
   - Tam çözünürlükte tahminen 10-12 dk (dönüşüm eklemeleri ağır). Sonrasında −14 LUFS ve kurala göre ilk 10 sn analizi yapılacak.
   - `h` eklemelerinin süresi değişirse müzik `python3 tools/ses_724_05.py muzik <sn>` ile yeniden kurulur.

## Görsel riskler
- **f karesi:** Gerçek Sabri'nin işaret eden eli, öndeki Ece'nin başının arkasında kalabiliyor; bakış ve baş yönü taşıyor.
- **g karesi:** Gerçek Sabri yalnızca flu ense ve omuz olarak görünüyor; kimliği bir önceki karede kurulu.
- **Mahçup yüz:** Orta-yakın ölçekte (z 1,75) dudak ısırma küçük kalıyor. Daha belirgin istenirse son 0,5 sn için yakına kesilebilir.
- **Böceğin simetrisi:** Böcek önden simetrik. Seğirme, ağırlık aktarımı, asimetrik bacaklar ve salınım bunu kırıyor.
