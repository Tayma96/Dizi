# İmza, Bölüm 1: üretim durumu ve yönetmen kararları

Güncelleme: 19 Kasım 2026, 03:00 (TR). Devam: 05:50 (TR), zamanlanmış görev.

## Kullanıcı kararları (bağlayıcı)
- **Motor:** 2D. Kompozisyon `GKK-B1`, bölüm id `imza-01`.
- **Tek kural:** her şey ücretsiz.
- **Doğaçlama izni:** konuya uygun doğaçlama serbest ("sadece fire verme"). Kullanıcının replikleri aynen korunur.
- **Format:** bölüm 3 dk = 6 parça × 30 sn. Her parça ayrı render (`tools/parca.sh imza-01 N`), sonunda birleştirilir (`tools/birlestir.sh imza-01`).
- **ElevenLabs bütçesi:** Bölüm 1'in kalan tüm sesleri için üst sınır **1.500 kredi** (kullanıcı onayı, 19 Kasım 03:00).
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

## Bekleyen
- Ses yönetmeni ve görüntü yönetmeni parça 1 raporları (gelince bu dosyaya özetlenir ve uygulanır).
- Her parça: kontrol kareleri → render → kullanıcıya gönder.
- Sonda: 6 parça birleştir → `bolumler/imza-01.mp4` (3 dk, -14 LUFS) → kullanıcıya gönder → commit ve push.
