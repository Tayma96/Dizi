# Dizi Stüdyosu

Remotion (React) ile kodla dikey (9:16) animasyon dizileri üretme projesi. Birden fazla dizi yapılabilir; şu an odak tek dizi.

## Değişmez kurallar
- **Kullanıcı açıkça istemeden senaryo/hikâye/replik yazma.** Fikir ve öneri sunulabilir.
- Başka dizilerin karakter/hikâye/görsellerini kopyalama; içerik özgün olmalı.
- Her şey ücretsiz ve ticari kullanıma uygun olmalı (MIT/OFL/CC0 ya da kendi sentezimiz).

## Ekip (ajanlar: `.claude/agents/`)
- `genel-yonetmen`: bölümün bütünü, çekim senaryosu JSON'u, koordinasyon, render, yayın kontrolü
- `goruntu-yonetmeni`: çekimler, kamera, ışık, mekân, karakter görünümü, mimik/jest, yeni görsel varlıklar
- `ses-yonetmeni`: seslendirme (Chatterbox TTS), müzik, ortam, efekt, miks/mastering
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
- `tools/seslendir.py`: TTS + Whisper kontrolü + kelime zamanları + dudak senkronu
- `tools/ses_kutuphanesi.py`: müzik/ortam/efekt sentezi
- `tools/kurulum.sh`: yeni oturumda ortam kurulumu · `tools/render.sh`: render + −14 LUFS + Reels parçaları
- `public/episodes/`: bölüm JSON'ları · `public/voice/`: üretilmiş replik sesleri · `public/ses/`: ses kütüphanesi
- `bolumler/`: bitmiş videolar
- Eski prototip: `src/dizi/` (ilk Bölüm 1; yazı tipleri ve efektler hâlâ buradan kullanılıyor)
