# 7/24 Bölüm 4: devir notu (başka oturum kaldığı yerden devam etsin diye)

Dal: `claude/affectionate-allen-dxvfpb`. Önce `bash tools/kurulum.sh` (dizi-studio içinde) çalıştırılır.

## Okunacaklar (sırayla)
1. `docs/diziler/724/bolumler.md` → "Bölüm 4" bölümü: kullanıcının metni (replikler ve noktalama AYNEN), tüm kullanıcı kararları.
2. `docs/diziler/724/raporlar/b4-goruntu.md` → 19 çekimlik plan, yeni görsel varlıklar (P0 listesi).
3. `docs/diziler/724/raporlar/b4-ses.md` → ses tasarımı.

## Durum (22 Kasım 2026)
- **Sesler BİTTİ** (165 kredi harcandı, kalan ~23.565; bütçe üst sınırı bu bölüm için 5.000). `dizi-studio/public/episodes/724-04-ses.json` + `public/voice/724-04-ses/` (a_01 fısıltı, b_01 sıçarım 2,85 sn, c_01 depo "ece", d_01 meme 3,53 sn, e_01 Sabri). Efektler `public/ses/efekt/` (yutkunma, onluk_cikar, onluk_cekistir, kumas_burus, kumas_firlat, kumas_dus, ayakkabi_gicirti, tezgah_carpma, ambalaj, adim_kosu_1..4, depo_kapi_kisa, depo_ece). Önizleme `ornekler/b4-ses-onizleme.mp3`.
- Meme d_01 kelime başlangıçları: vallahi 0,26 · bastım 0,76 · vallahi 1,08 (takılma; kesme 1) · bastım 1,48 · kaç 1,96 / 2,20 / 2,56 / 2,88 (kesme 2, kapı arkadan).
- **Görsel varlıklar YARIM:** `src/studio/rig/head25d.tsx` (2.5D baş dönüşü), `src/studio/engine/Inserts10.tsx`. Yapılacak P0: gozSok (anime şok gözü, nokta bebek), yutkun, onluk "cikar" + at kuyruğuna takılma + sacDagin, onluk_top + yereAt, kapi_arka baş dönüşü, body "kos" bel üstü koşu + takip arka planı, sendele, depoAcik + depo_esik + yarimGolge, ambalaj + ambalaj_parmak, ön plan palto omzu, tasma:true altyazı.
- **Bölüm JSON'u YARIM:** `public/episodes/724-04.json` (genel yönetmen yazıyordu). Replik satırlarının text/tags/okunus/hiz/stab alanları 724-04-ses.json ile birebir aynı kalmalı; sesler `public/voice/724-04/` altına kopyalanıp kimlikler eşlenmeli. `seslendir` KURU çalıştırması 0 replik göstermeli.

## Kurallar
- ElevenLabs: önce kuru çalıştırma + maliyet, kullanıcıya açık onay sorusu, sonra `--onayla`. Anahtar ortamda ağ sırrı olarak durur (`ELEVENLABS_API_KEY=` boş verilir, proxy ekler); yeni hesapta/ortamda kullanıcı bu sırrı kendisi eklemeli.
- Bitince: render → −14 LUFS → `bolumler/724-04.mp4`. Teslimden önce **ilk 10 saniye saniye saniye analiz edilip kullanıcıya rapor verilir, talimat beklenir.**
- Kullanıcı baş dönüşü örneğini (ornekler/b4-ornek-bas-donusu.mp4) onayladı: "Beğendim beğendim devam".
- **Kullanıcı kararı:** 2.5D yalnızca özel hareketlerde (arkadan çekim, baş çevirme vb.) kullanılır, isteğe bağlı (opt-in). Diğer bütün çekimler eski 2D yapıyla; izleyici buna alıştı, varsayılan rig görünümü değişmez.

## Son durum (limit %94'te)
- `724-04.json` + `public/voice/724-04/` HAZIR (genel yönetmen; kuru çalıştırma 0 replik). Fısıltı iki satıra bölündü (a_01 / b_01).
- Görüntü yönetmeni JSON'daki yeni alanları uyguluyordu: depoAcik, paltoOmuz, isaretler (kasa_agzi, depo_esik, depo_on), siluet, tasma, yutkun, onluk "cikar", sacDagin, onluk_top + yereAt, gozSok + bakSure, body "sendele" + sendeleAt, yarimGolge, ambalaj, basEgim; eklemeler kosu_takip, ambalaj_parmak, kapi_arka text[3] zaman kayması. Bilinmeyen jest adı Character.tsx:339'da çöküyor, güvenli hale getirilmeli.
- Sonra: kare kontrolü → tam render → −14 LUFS → `bolumler/724-04.mp4` → ilk 10 sn saniye saniye analiz → kullanıcıya rapor, talimat bekle.
- Render tarayıcısı: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
- Tüm görsel alanlar bağlandı (8c209b8). Kalan tek iş: render (komut yukarıda, --concurrency=4) → loudness → bolumler/724-04.mp4 → ilk 10 sn analizi.
