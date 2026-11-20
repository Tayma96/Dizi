# İmza, Bölüm 1: üretim durumu ve yönetmen kararları

Güncelleme: 19 Kasım 2026, 03:00 (TR). Devam: 05:50 (TR), zamanlanmış görev.

## Kullanıcı kararları (bağlayıcı)
- **Motor:** 2D. Kompozisyon `GKK-B1`, bölüm id `imza-01`.
- **Tek kural:** her şey ücretsiz.
- **Doğaçlama izni:** konuya uygun doğaçlama serbest ("sadece fire verme"). Kullanıcının replikleri aynen korunur.
- **Format:** bölüm 3 dk = 6 parça × 30 sn. Her parça ayrı render (`tools/parca.sh imza-01 N`), sonunda birleştirilir (`tools/birlestir.sh imza-01`).
- **ElevenLabs bütçesi:** Bölüm 1 için üst sınır **5.000 kredi** (kullanıcı onayı, 19 Kasım 03:10; önceki 1.500 sınırının yerine geçer).
  - Her seslendirmede `--butce` ile sınır korunur.
  - Toplam aşılacaksa DUR ve kullanıcıya sor.
  - Model `eleven_v4`. Sesler: Berkay = Mert Aksoy (dış ses de Berkay, `anlatim` duygusu), Nalan = İrem.
- **Ekip iş akışı (her parça):** senarist yardımcısı (doğaçlama) → genel yönetmen (karar + JSON) → ses yönetmeni (ses ve duygu denetimi) → görüntü yönetmeni (dekor, kostüm, kadraj) → genel yönetmen son kontrol → render.
- **Nalan:** sarışın, mavi gözlü (cast.json'da).

## Parça 1 (taslak render: `bolumler/imza-01-parca1.mp4`, 26 sn). Kullanıcı: "Çok iyi olmuş, devam et."
Senarist raporundan yönetmen kararları (uygulanacak):
1. **Dış ses erken başlar:** ~0,8 sn'de, kuşun üzerine (kullanıcının metni: "bunlar olurken dış ses konuşur").
2. **"GÜN 183" sahnenin içine alınır:** pencerenin yanındaki duvara kazınmış çentik demetleri ve "183". Köşe yazısı (`etiket`) kaldırılır. Aynı çentik varlığı parça 3'te yatağın altında tekrar kullanılır.
3. **Duvar saati:** geniş çekimde göz ucuyla görünür, **07:14**. Parça 5'te 07:13, parça 6'da tekrar 07:14 → zaman ilerlemedi mi? Döngü motifi.
4. **Kuşun imza hareketi:** konunca gagasıyla cama **iki kez vurur** (iki "tik"). Parça 6'da birebir aynısı kullanılır.
5. **Çekim ölçeği:** gözlerin açılması "Evet, o benim" kaydırmasının sonunda olur; aynı yakın ölçek art arda gelmez.
6. **Bileklik gerekçeli:** eli başından iner, bileğine bakar → insert onun bakış açısı.
7. **Seçenek A (parça sonu, +~4 sn):**
   - Koridorda ayak sesleri. Berkay kapıya döner; kapı orta çekimde görünür.
   - Kapı arkasından boğuk ses, NALAN (kadraj dışı): **"Yedi'yi ben alırım."** (kapı arkası filtresi)
   - 0,8 sn sessizlik, müzik kesilir. Sonra kapı kolu insert'i.
8. **Kapı sesi:** gıcırtı yerine kilit dili ve anahtar sesi (kendi sentezimiz). Parça, kapı açılmadan biter.
9. **Takvim:** 14 Mart = 1. gün → 183. gün = 12 Eylül (yaz sonu ışığı). Bileklikte yıl yok.

## Parça 2 (0:30-1:00): senarist akışı onaylandı (yönetmen)
- **Kullanıcının replikleri:** "Günaydın Berkay, uyanmışsın." / "Sen kimsin, nerdeyim ben?" / "Yine başladık." / "Al haplarını getirdim, bunları içmelisin."
- **Doğaçlama:** "Yine mi?" / bileklik kontrolü / hap insert'i / "Ne hapı bunlar?" / "Her sabah içtiğin haplar. Korkma, burası güvenli." / dış ses "O sabah ilk kez yutmadım." / "Aç ağzını." / "Aferin."
- **Parça sonu:** Nalan eşikte durur: **"Bardağı bitir, Berkay."** Bardak dudağına değmeden kesilir.
- **Haplar (dizi boyunca sabit):** beyaz yuvarlak + yarısı mavi kapsül.
- **Nalan'ın çizgisi:** eşyalara dokunur, insana dokunmaz. Tek göz teması ağız kontrolünde olur; orada duraksar. Rutin, yorgun, zalim değil.
- **Anlatım:** geçmiş zaman (film anlatımı).

## Parça 3-6
Plan: `1-bolum-plan-oneri.md`. Kurallar: `belirsizlik-kurallari.md`. Senarist yardımcısı her parça için doğaçlama önerir, genel yönetmen seçer.
- **Parça 3 (İÇME):** Berkay hapı tükürür; yatağın altında çentikler ve kendi el yazısıyla "İÇME".
- **Parça 4 (hafıza çakması):** plaza, kalem, imza flaşları; bir isim (ortağın adı, öneri "Selim").
- **Parça 5 (kapı aralığı):** koridorda doktor ve ortağın sesi; el, kalem, saat görünür; ikinci not "KUŞ HER SABAH 07:14'TE KONAR. SAYMAYI BIRAKMA."; saat 07:13.
- **Parça 6 (döngü):** saat 07:14; kuş aynı hareketle konar, cama iki kez vurur; havalandırmadan fısıltı "Hatırla, Berkay."; kararma.

## Ekip raporları
- Senarist: `raporlar/p1-p2-senarist.md`
- Görüntü yönetmeni: `raporlar/p1-goruntu-yonetmeni.md`. **Önce TEKNİK RİSK bölümünü oku:** ses eşleşmesi vuruş sırasına bağlı; replik vuruşlarının önüne vuruş eklersen manifest anahtarlarını ve mp3 adlarını yeniden adlandır (ücretsiz).
- Ses yönetmeni: `raporlar/p1-ses-yonetmeni.md` (gelince yazılır).
- **Yönetmen önceliği:** P0 (1-6) maddelerinin hepsi ve P1'den kostüm (7), ifade (8), tekinsiz mekân (9), yerleşim (10), bileklik (12), kapı kolu ışığı (13) uygulanır. Nalan önerisi parça 2'de uygulanır. GÜN 183 sahnenin içine alınır (köşe yazısı kalkar).

## Bekleyen
- Her parça: kontrol kareleri → render → kullanıcıya gönder.
- Sonda: 6 parça birleştir → `bolumler/imza-01.mp4` (3 dk, -14 LUFS) → kullanıcıya gönder → commit ve push.


## İlerleme (19 Kasım, zamanlanmış devam)
- Parça 1: ekip raporlarıyla düzeltildi, 30 sn, render edildi.
- Parça 2: senarist akışı, 30 sn, render edildi.
- Parça 3-6: senarist metni (`raporlar/p3-p6-senarist.md`), 16 yeni yakın plan çizimi (`engine/Inserts2.tsx`), sesler üretildi, render sürüyor.
- Kredi: Bölüm 1 toplam ~634 / 5.000.
- Sesler: Selim = Kadir Kayışcı, Deniz = Mia.

## Kullanıcı geri bildirimi (19 Kasım, bölüm 1 birleşik hâli): BEĞENİLMEDİ
- **Parça 1:** eski hâli (ilk taslak, commit 6ba6d8d sonrası `bolumler/imza-01-parca1.mp4`) daha iyiydi. Onaylanmış parça yeniden yapılmaz.
- **Yürüyüş:** kollar adımdan önce ve aynı anda hareket ediyor (doğal değil).
- **Sahneleme:** hemşire kapıdan girip birden kameranın önünde beliriyor, Berkay arkada kalıyor. Konumlar ve açılar tuhaf.
- **Bakış:** karakterler konuşurken kameraya bakıyor. Dizilerde kameraya bakılmaz; birbirlerine bakmalılar (3/4, profil).
- **Senaryo:** kullanıcının söylediklerinden çok sapılmış, ilk bölümde her şey ele verilmiş, gizem yok, tahmin edilebilir.
- **Karar:** plan modunda yalnızca senaryoya odaklanılacak; parça parça, kısa. Görsel düzeltmeler sonra.

## Bölüm 2 · Parça 1 (19 Kasım 2026) — `bolumler/deli-degilim-02-parca1.mp4` (45 sn)
- Yayın adı **Deli Değilim**. Bölüm 1'in gerçek sonu: ortak salonda TV haberi → "Bu… benim." → "Hadi, odana dönelim. Hemen!" (imza-01-p2…p5).
- Senarist: `raporlar/b2-p1-senarist.md`, görüntü: `raporlar/b2-p1-goruntu.md`. Kanca: Nalan'ın cebinde kapaksız lacivert kalem (iki yönlü kalmalı).
- Yeni varlıklar: `engine/Inserts6.tsx` (tablet_video: KAM 2 · ODA 7 · 11.09 03:12; murekkep_parmak; kalem_cep), jest `kolTut`, prop `tablet`, CharState `murekkep`. Mürekkep rengi sabit #10204a.
- Ses: ElevenLabs hastane koridoru/oda ortamı, dizi teması `muzik/deli_tema`, efektler (sürükleme, demir kapı, tablet, kalp, kalem, kamera kaydı). Repliklere mekân akustiği (koridor uzun yankı, oda kısa); dış ses kuru; video sesi telefon filtresi. Duygu etiketi yerine replik başına yönlendirme (emotion "notr" + tags).

## Bölüm 2 · Parça 2 "Ayna" (19 Kasım 2026) — `bolumler/deli-degilim-02-parca2.mp4`
- Senarist: `raporlar/b2-p2-senarist.md`, ses: `raporlar/b2-p2-ses.md`. Görüntü yönetmeni QA: 1 P0 (Deniz girişi/plaka örtülmesi) + 5 P1 düzeltildi.
- İpucu defteri: videodaki adam SOL eliyle imza atar; Berkay sağ elini kullanır; mürekkep sağ elde. Deniz: "Güvenlik kameraları görüntüyü ayna gibi kaydeder." Aynalanmış görüntüde kapı üstündeki "7" TERS (gerçek odada kapının iç üstünde emaye "7" plakası düz okunur). Personelin olası sonraki cevabı (senarist): numara vasistas camında, koridordan okunur.
- Berkay'ın kapıdaki cümlesi ("Videodaki adam solak") dış sesin tekrarı; Deniz "Aynı cümleyle" der.

## Bölüm 2 · Parça 3 "Doz" (19-20 Kasım 2026) — `bolumler/deli-degilim-02-parca3.mp4`
- Senarist: `raporlar/b2-p3-senarist.md`. B1 kayıtları birebir yeniden kullanıldı: "Günaydın Berkay, uyanmışsın.", "Aç ağzını.", "Aferin." ve "Yine başladık" (Berkay'ın aynı repliğiyle üst üste, "Yine baş—"ta kesik).
- Kullanıcı düzeltmesi: "Hemşire ağzına bakıyor, yutmuşsun diyor, sonra tekrar tükürüyor?" → mantık hatası giderildi: Berkay hapları ağzına değil AVUCUNA saklar; Nalan "Aç ağzını" + "Dilini kaldır" ile kontrol eder (ağız gerçekten boş). Avuçta iki hap + üçüncünün yerinde terle erimiş açık mavi macun.
- İpucu defteri: dün 2 hap, bugün 3 (yeni: küçük, mat, açık mavi #8fc1ea, ağızda/terde eriyen). İki açıklama: personel avuçlamayı öngördü / mavi leke kapsülün boyası, üçüncü hap hiç yoktu.
- Odaya duvar saati eklendi (yalnızca `saat` verilen sahnelerde): 07:14.

## Bölüm 2 · Parça 4 "Ses" (20 Kasım 2026) — `bolumler/deli-degilim-02-parca4.mp4`
- Senarist: `raporlar/b2-p4-senarist.md` (D1: Deniz numarayı ezberden tuşlar; D2: "Teşekkürler, Ayla Hanım.").
- Yeni ses: santral görevlisi Ayla (Elif Ozder), fx telefon. Arka plandaki "Kim arıyor, Ayla?" Berkay'ın kendi sesi (`berkay_ofis`, fx `telefon_uzak`), altyazıda isim yok.
- Dizinin sorusu büyüdü: "deli mi?" → "bu adam kim?" İki açıklama: şirkette yerine geçen biri / Berkay kendini haberlerdeki adam sanan bir hasta.

## Bölüm 2 · Parça 5 FİNAL "Ziyaretçi" (20 Kasım 2026) — `bolumler/deli-degilim-02-parca5.mp4`
- Senarist: `raporlar/b2-p5-senarist.md` (D1 Zeynep "Yaklaşma… lütfen.", D2 Deniz "Yeter, Zeynep Hanım.").
- Yeni karakter: **Zeynep** (`zeynep_dd`, Berkay'ın eşi?): bakır rengi uzun düz saç, deve tüyü trençkot, kırmızı oje; ses Çiğdem.
- İpucu defteri: fotoğraf (Berkay şoför kasketiyle, siyah makam arabası, arka camda silüet, tarih damgası '19 6 14); Zeynep'in sol elinde yüzük yok; Berkay'ın sol yüzük parmağında solgun yüzük izi. "Sen onun şoförüydün. Sekiz yıl." ("onun" kim olduğu söylenmedi).
- Sol el yakın çekimleri anatomik: elin üstü, başparmak sağda.

## Bölüm 2 birleşik (kullanıcı kararı: 4 parçayla biter): `bolumler/deli-degilim-02.mp4` (2:56, -14 LUFS), son: "O ses… benimdi.", bitiş kartı: "Sence telefondaki ses kimdi?"
- Zeynep'li "Ziyaretçi" parçası ÇOK İLERİDE kullanılacak (kullanıcı, 20 Kasım 2026): `bolumler/deli-degilim-ileride-zeynep.mp4` (JSON: imza-02-p5.json). Silinmez.
