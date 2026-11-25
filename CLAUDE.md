# Dizi Stüdyosu

Remotion (React) ile kodla dikey (9:16) animasyon dizileri üretme projesi. Birden fazla dizi yapılabilir; şu an odak tek dizi.

> **Yeni oturumda önce `docs/son-oturum.md` dosyasını oku** (son konuşmanın özeti: token düzeni, Gemini, 7/24 B8'de kaldığımız yer).

## Değişmez kurallar
- **Kullanıcı açıkça istemeden senaryo/hikâye/replik yazma.** Fikir ve öneri sunulabilir.
  - **7/24 Bölüm 7 için izin (23 Kasım 2026):** kullanıcı "Doğaçlamalar serbest" dedi. Kullanıcının replikleri aynen korunur; aradaki boşluklar, sözsüz şakalar ve kısa yeni replikler doğaçlanabilir, her biri kullanıcıya açıkça belirtilir. Ayrıntı: `docs/diziler/724/b7-gece-brief.md`.
  - **7/24 Bölüm 8 (yeni) Parça 1 için izin (24 Kasım 2026):** "senarist yardımcısı doğaçlama yapabilir ama eski bölümlerden replikleri kullanmasın ya da aynı kelimeleri." Kullanıcının replikleri aynen korunur; yeni replik/şaka eklenebilir ama önceki bölümlerin replikleri ve ayırt edici kelimeleri (ör. "gerçek") tekrar edilmez; her doğaçlama kullanıcıya belirtilir.
  - **7/24 Bölüm 8 (yeni) Parça 3 için izin (24 Kasım 2026):** "Doğaçlama da yapabilirsin sorun yok, canavarı daha korkunç da yapabilirsin sana bıraktım." Kullanıcının metni aynen korunur; ayrıntı, sözsüz eylem ve yaratık tasarımı doğaçlanabilir (yaratık özgün kalır, başka eserden kopyalanmaz); her doğaçlama kullanıcıya belirtilir.
  - **7/24 Bölüm 9 için izin (25 Kasım 2026):** "Görüntü yönetmenini ve yardımcı senaristi devreye sok, detaylara girsinler, doğaçlama serbest." Kullanıcının metni ve replikleri aynen korunur; ayrıntı, sözsüz eylem, kısa yeni replik doğaçlanabilir; önceki bölümlerin replik/sahne fikirleri tekrar edilmez; anime efekti yok (yalnız hız çizgileri, nadiren); her doğaçlama kullanıcıya belirtilir. Kullanıcı bu iş için alt ajanları (görüntü yönetmeni, senarist yardımcısı) açıkça istedi.
  - **Kayıp CEO (dosyalar `emir-*`) için izin (20 Kasım 2026):** kullanıcı "Doğaçlama iznin var, ekleyebileceğin güzel bir detay varsa ekle" dedi. Kullanıcının metni aynen korunur; aradaki güzel ayrıntılar, geçişler ve kısa yeni replikler eklenebilir, her biri kullanıcıya açıkça belirtilir.
  - **Deli Değilim (eski adı İmza; dosyalar `imza-*`) için izin (18 Kasım 2026):** kullanıcı "konuya uygun doğaçlama yapabilirsin, sadece fire verme" dedi. Kullanıcının verdiği metin ve replikler aynen korunur; aradaki boşluklar, geçişler ve yeni replikler dizinin kurallarına (`docs/diziler/berkay/belirsizlik-kurallari.md`) uygun doğaçlanabilir. Doğaçlanan her şey kullanıcıya açıkça belirtilir.
- **Kalite çıtası (kullanıcı, 25 Kasım 2026; 7/24 ve sonrası):** görüntü yönetmeni seviyesi: oldu bittiye getirilmez; sahneyi zenginleştiren ince görsel/ses ayrıntıları (ışık, gölge, sahne eşyasının tepkisi, oyunculuk nüansı, kamera) kendiliğinden düşünülüp tasarlanır. Örnek kalite: böcek sahnesi, dönüşüm, sel, yumruklanan kapıdan sızan güneş ışığı (BUNLAR TEKRARLANMAZ, yalnız seviye örneği). Diyalog ve sahne fikirleri önceki bölümlerden tekrar edilmez. Görsel/ses ayrıntısı doğaçlaması serbest (kalite = gerçekçi ayrıntı/ışık/oyunculuk, gereksiz efekt DEĞİL). **Anime efektleri (ter damlası, kalp, ünlem vb.) kullanılmaz; yalnız hız çizgileri, nadiren.** hikâyeyi değiştiren yeni olay/replik yazılmaz; her ayrıntı kullanıcıya raporlanır.
- **Tek kesin kural: her şey ücretsiz** (kullanıcının kendi ElevenLabs kredisi hariç; o da bütçe kurallarıyla).
- Başka dizilerin karakter/hikâye/görsellerini kopyalama; içerik özgün olmalı.
- Her şey ücretsiz ve ticari kullanıma uygun olmalı (MIT/OFL/CC0 ya da kendi sentezimiz). Tek istisna: kullanıcının kendi ElevenLabs kredisi.
- **Kırmızı Düğme (dosyalar `kd-*`) için ElevenLabs sınırı (kullanıcı, 23 Kasım 2026): bölüm başına en fazla 4.000 kredi** (replik + efekt + müzik + yeniden çekimler dahil). Takip: `docs/diziler/dugme/bolumler.md` bütçe tablosu.
- **7/24 Bölüm 8 (yeni) ses onayı (kullanıcı, 24 Kasım 2026):** B8 parçalarının replik ve efektleri için kredi harcamaya kalıcı onay verildi ("Evet, üret"; bundan sonraki parçalarda tekrar sorulmaz). Yine de kuru çalıştırma ile maliyet hesaplanır, parça başına ~1.000 kredi tavanı ve hesap yedeği korunur, harcama kullanıcıya bildirilir.
- **7/24 Bölüm 9 ses onayı (kullanıcı, 25 Kasım 2026):** B9 parçaları için de kalıcı onay ("Evet, B9 için kalıcı"); kuru çalıştırma, parça başına ~1.000 kredi tavanı ve bildirim aynen geçerli.
- **ElevenLabs kredisi asla aşılmaz.** Önce kuru çalıştırma + maliyet, kullanıcı onayı, sonra `--onayla`. Önce hesap1 (~6 bin), sonra hesap2 (~60 bin). Ayrıntı: `.claude/skills/elevenlabs-seslendirme/SKILL.md`

**Kullanıcı kararı (23 Kasım 2026): alt ajan (Agent aracı) ÇALIŞTIRILMAZ.** Her ajan sıfırdan okuyup limiti hızla tüketiyor. Genel yönetmen, görüntü yönetmeni, ses yönetmeni ve senarist yardımcısı görevlerinin hepsini ana oturum kendisi yapar; aşağıdaki ajan tanımları yalnız görev tarifi olarak okunur.

## Ekip (ajanlar: `.claude/agents/`)
**Her parça (30 sn) için iş akışı (kullanıcı kararı):**
1. `senarist-yardimcisi`: senaryoya uygun doğaçlama, geçiş ve kanca fikirleri verir.
2. `genel-yonetmen`: fikirleri seçer, çekim senaryosu JSON'unu yazar.
3. `ses-yonetmeni`: sesleri, seslerdeki duyguyu ve oyuncuların duygu durumunu inceler, kontrol eder (Whisper, duygu etiketleri, miks).
4. `goruntu-yonetmeni`: dekoru, kostümleri, karakter tiplerini, kadrajı ve ışığı kontrol eder.
5. `genel-yonetmen`: hepsini son kez kontrol eder; render ve teslim.

- `genel-yonetmen`: bölümün bütünü, çekim senaryosu JSON'u, koordinasyon, render, yayın kontrolü
- `goruntu-yonetmeni`: çekimler, kamera, ışık, mekân, karakter görünümü, mimik/jest, yeni görsel varlıklar
- `ses-yonetmeni`: seslendirme (ElevenLabs öncelikli, yedek Chatterbox), müzik, ortam, efekt, miks/mastering
- `senarist-yardimcisi`: senaryoyu inceler, iyileştirme önerir (kendi başına metin yazmaz)
- `yapimci`: tempo/kanca/bütçe denetimi, keser (metin yazmaz)
- `izleyici-simulatoru`: izleyici profilleriyle saniye saniye tutundurma puanı (simülasyon)
- `dizi-hafizasi`: dizi incili, karakter incili, ipucu defteri, bölüm özetleri; süreklilik denetimi (`docs/diziler/`)

## Belgeler
- `docs/uretim-rehberi.md`: üretim hattı, komutlar, bölüm JSON formatı, tüm varlık kataloğu
- `docs/arastirma.md`: izleyiciyi tutma, senaryo, görüntü ve ses yönetimi araştırması (kaynaklı)
- `docs/arastirma-2.md`: ses/müzik kaynakları ve lisanslar, platform kuralları, para kazanma, dağıtım
- `docs/diziler/_sablon/`: yeni dizi için incil şablonları

## Kod haritası (`dizi-studio/`)
- **Varsayılan motor 2D:** `src/studio/` (rig, sets, engine/Episode). Kompozisyon: `GKK-B1` + `--props={"episodeId":"<id>"}`
- 3D motor (deneme, yedek): `src/studio3d/` (Character3D, head, face2d, sets3d, Episode3D). Render: `--gl=swangle`
- `tools/gercek_sesler.py`: gerçek CC0 kayıtlar (BigSoundBank) · `tools/muzik_indir.py`: kamu malı müzik
- `src/studio/rig/`: karakter motoru (duygular, Türkçe dudak senkronu, jestler, saç, kıyafet, yaş, yapı)
- `src/studio/cast.json`: oyuncu kadrosu (20 karakter)
- `src/studio/sets/`: 17 mekân + eşyalar
- `src/studio/engine/`: bölüm motoru (JSON → kamera, altyazı, ses, geçişler)
- `src/studio/sheets/`: kontrol sayfaları (Kadro, Duygular, Jestler, Agizlar, Mekanlar)
- `tools/gemini.py`: ücretsiz Gemini işçisi (Claude görev verir, Gemini yazar, Claude kontrol eder). Anahtar ortamın ağ sırrında (Bearer). Ücretsiz katmanda çalışan: `gemini-2.5-flash`; pro modellerin ücretsiz kotası 0, 3.8-flash sık sık meşgul.
- `tools/elevenlabs.py`: ElevenLabs seslendirme (bütçe korumalı, çok hesaplı; durum/oyuncu-sec/ata/seslendir/efekt/replikler/ice-aktar) · `tools/ses_kontrol.py`: Whisper kontrolü
- `tools/seslendir.py`: yedek ücretsiz TTS (Chatterbox) + Whisper kontrolü + dudak senkronu
- `tools/ses_kutuphanesi.py`: müzik/ortam/efekt sentezi
- `tools/kurulum.sh`: yeni oturumda ortam kurulumu · `tools/render.sh`: render + −14 LUFS + Reels parçaları
- `public/episodes/`: bölüm JSON'ları · `public/voice/`: üretilmiş replik sesleri · `public/ses/`: ses kütüphanesi
- `bolumler/`: bitmiş videolar
- Eski prototip: `src/dizi/` (ilk Bölüm 1; yazı tipleri ve efektler hâlâ buradan kullanılıyor)

## Kullanıcı geri bildirimi — dersler (önemli)
**Kullanıcı kararı (18 Kasım 2026): 2D ile devam.** Aynı sahne 2D ve 3D (film stili) yapılıp karşılaştırıldı (`bolumler/ornek15-2d.mp4`, `bolumler/ornek15.mp4`); kullanıcı 2D'yi ve 2D karakterleri daha güzel buldu. Aşağıdaki çekim, ışık ve kurgu dersleri 2D için de geçerlidir. Sorun çıkarsa çözüm aracı terk etmek değil, profesyonelce kullanmaktır.
- Karakterler itici olmamalı: çene ve yüz hattı net, sakal maske gibi değil, eklemler hareket ederken kopmamalı, jestler pozdan poza atlamamalı (yumuşak geçiş).

İlk fragmanın (`bolumler/imza-fragman.mp4`) neden başarısız olduğu ve doğrusu:
- **Hikâye önce:** Her sahnenin amacı tek cümleyle yazılır. Kurgu doğrusal ve sesli (ElevenLabs) olur. Bağlamsız, sessiz kareler peş peşe dizilmez.
- **Çekim dili:** Önce genel/orta çekimle mekân ve kimin kim olduğu kurulur (establishing). Yakın çekim yalnızca duygu doruğunda kullanılır. Aynı ölçek art arda tekrarlanmaz. 180° kuralı uygulanır. Kıpırtısız dev yüz çekimi yok.
- **Işık:** Her sahneye bilinçli ışık tasarımı yapılır: anahtar + dolgu + arka ışık, kontrast, renk senaryosu. Soluk, düz ışık yok.
- **Hareket:** Sahnede karakter eylemi ve motive edilmiş kamera hareketi olur. Efektler (flaş, ayna, sarsıntı) yalnızca hikâye gerektirdiğinde kullanılır.
- **Okunurluk:** Yazı ve belge telefonda okunur büyüklükte olur ve ekranda yeterince uzun kalır.
- **Denetim:** Her sahne render'dan önce birkaç kareyle kontrol edilir: anlaşılıyor mu, kim nerede, ne oluyor?
- **Onay:** Büyük bir değişiklikten önce kullanıcıya tek bir sahnelik tam kaliteli örnek gösterilir.
