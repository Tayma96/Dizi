# Dizi Stüdyosu

Remotion (React) ile kodla dikey (9:16) animasyon dizileri üretme projesi. Birden fazla dizi yapılabilir; şu an odak tek dizi.

## Değişmez kurallar
- **Kullanıcı açıkça istemeden senaryo/hikâye/replik yazma.** Fikir ve öneri sunulabilir.
- Başka dizilerin karakter/hikâye/görsellerini kopyalama; içerik özgün olmalı.
- Her şey ücretsiz ve ticari kullanıma uygun olmalı (MIT/OFL/CC0 ya da kendi sentezimiz). Tek istisna: kullanıcının kendi ElevenLabs kredisi.
- **ElevenLabs kredisi asla aşılmaz.** Önce kuru çalıştırma + maliyet, kullanıcı onayı, sonra `--onayla`. Önce hesap1 (~6 bin), sonra hesap2 (~60 bin). Ayrıntı: `.claude/skills/elevenlabs-seslendirme/SKILL.md`

## Ekip (ajanlar: `.claude/agents/`)
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
- **Varsayılan motor 3D:** `src/studio3d/` (Character3D, head, face2d, sets3d, furniture, textures, Episode3D). Render: `--gl=swangle`
- `tools/gercek_sesler.py`: gerçek CC0 kayıtlar (BigSoundBank) · `tools/muzik_indir.py`: kamu malı müzik
- `src/studio/rig/`: karakter motoru (duygular, Türkçe dudak senkronu, jestler, saç, kıyafet, yaş, yapı)
- `src/studio/cast.json`: oyuncu kadrosu (20 karakter)
- `src/studio/sets/`: 17 mekân + eşyalar
- `src/studio/engine/`: bölüm motoru (JSON → kamera, altyazı, ses, geçişler)
- `src/studio/sheets/`: kontrol sayfaları (Kadro, Duygular, Jestler, Agizlar, Mekanlar)
- `tools/elevenlabs.py`: ElevenLabs seslendirme (bütçe korumalı, çok hesaplı; durum/oyuncu-sec/ata/seslendir/efekt/replikler/ice-aktar) · `tools/ses_kontrol.py`: Whisper kontrolü
- `tools/seslendir.py`: yedek ücretsiz TTS (Chatterbox) + Whisper kontrolü + dudak senkronu
- `tools/ses_kutuphanesi.py`: müzik/ortam/efekt sentezi
- `tools/kurulum.sh`: yeni oturumda ortam kurulumu · `tools/render.sh`: render + −14 LUFS + Reels parçaları
- `public/episodes/`: bölüm JSON'ları · `public/voice/`: üretilmiş replik sesleri · `public/ses/`: ses kütüphanesi
- `bolumler/`: bitmiş videolar
- Eski prototip: `src/dizi/` (ilk Bölüm 1; yazı tipleri ve efektler hâlâ buradan kullanılıyor)

## Kullanıcı geri bildirimi — dersler (önemli)
**3D, kamera sistemi ve efektler bu projenin yönüdür; bırakılmaz, 2D'ye geri dönülmez.** Kullanıcının sözü: "Kötü değil, kötü kullanıldı. Düzgün kullanmayı öğrenmelisiniz. Yapan yapıyor." Sorun çıkarsa çözüm aracı terk etmek değil, profesyonelce kullanmaktır.

İlk fragmanın (`bolumler/imza-fragman.mp4`) neden başarısız olduğu ve doğrusu:
- **Hikâye önce:** Her sahnenin amacı tek cümleyle yazılır. Kurgu doğrusal ve sesli (ElevenLabs) olur. Bağlamsız, sessiz kareler peş peşe dizilmez.
- **Çekim dili:** Önce genel/orta çekimle mekân ve kimin kim olduğu kurulur (establishing). Yakın çekim yalnızca duygu doruğunda kullanılır. Aynı ölçek art arda tekrarlanmaz. 180° kuralı uygulanır. Kıpırtısız dev yüz çekimi yok.
- **Işık:** Her sahneye bilinçli ışık tasarımı yapılır: anahtar + dolgu + arka ışık, kontrast, renk senaryosu. Soluk, düz ışık yok.
- **Hareket:** Sahnede karakter eylemi ve motive edilmiş kamera hareketi olur. Efektler (flaş, ayna, sarsıntı) yalnızca hikâye gerektirdiğinde kullanılır.
- **Okunurluk:** Yazı ve belge telefonda okunur büyüklükte olur ve ekranda yeterince uzun kalır.
- **Denetim:** Her sahne render'dan önce birkaç kareyle kontrol edilir: anlaşılıyor mu, kim nerede, ne oluyor?
- **Onay:** Büyük bir değişiklikten önce kullanıcıya tek bir sahnelik tam kaliteli örnek gösterilir.
