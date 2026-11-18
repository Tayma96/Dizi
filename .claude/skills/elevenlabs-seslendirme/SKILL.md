---
name: elevenlabs-seslendirme
description: Dizi repliklerini ElevenLabs ile seslendirme — kredi bütçesini ASLA aşmadan (önce 6 bin kredilik hesap, sonra 60 binlik hesap). Karakterlere Türkçe ses seçme (ücretsiz önizleme), bölüm seslendirme, ses efekti üretme, MCP bağlayıcısıyla üretilen sesleri içeri alma. "seslendir", "dublaj", "ElevenLabs", "karakter sesi", "kredi" geçen her işte kullan.
---

# ElevenLabs seslendirme (bütçe korumalı)

Araç: `dizi-studio/tools/elevenlabs.py`. Yalnızca Python standart kütüphanesi ve ffmpeg gerekir; sanal ortam gerekmez.
Tüm komutlar `dizi-studio/` içinden çalıştırılır.

## DEĞİŞMEZ KURALLAR
1. **Kredi aşımı yok.** Araç her istekten önce hesabın kalan kredisini sorar ve yedek payı (hesap1: 100, hesap2: 300) korur. Kredi yetmezse durur. Bu korumayı devre dışı bırakacak bir kod ya da parametre ekleme.
2. **Önce kuru çalıştırma.** `seslendir` komutunu önce `--onayla` olmadan çalıştır. Maliyeti kullanıcıya göster, kullanıcı "evet" demeden `--onayla` kullanma. Bölüm başına bütçe sınırı için `--butce N` ekle.
3. **Hesap sırası:** önce **hesap1** (≈6.000 kredi) bitirilir, sonra **hesap2** (≈60.000). Sıra `.elevenlabs.json`'daki sıradır.
4. **Anahtarlar sohbete yazılmaz ve repoya girmez.** `.elevenlabs.json` ve `.elevenlabs-durum.json` git dışıdır.
5. **Önbelleği koru.** Aynı replik iki kez ödenmez. Yeniden üretim sadece `--yeniden id,id` ile ve bilinçli yapılır; her yeniden üretim kredi harcar.
6. **Senaryo yazılmaz.** Bu skill yalnızca onaylanmış bölüm JSON'larını seslendirir.

## 1. Anahtarı bağlama (bir kez)
Hangisi uygunsa:
- **Claude Code bulut oturumu (önerilen):** `request_credential` aracıyla `api.elevenlabs.io` için kimlik bilgisi iste. Değerler: `header_name: xi-api-key`, `prefix` yok, `suggested_type: bearer`. Ağ geçidi anahtarı isteklere kendisi ekler; araç "proxy" hesabıyla çalışır.
  - Hesap1'in kredisi bitince kullanıcı ortam ayarlarındaki ağ sırrını hesap2'nin anahtarıyla değiştirir.
- **Kendi bilgisayarında:** `dizi-studio/.elevenlabs.json` dosyası:
  ```json
  {"hesaplar": [{"ad": "hesap1", "anahtar": "sk_...", "yedek": 100}, {"ad": "hesap2", "anahtar": "sk_...", "yedek": 300}]}
  ```
- **Tek hesap, ortam değişkeni:** `ELEVENLABS_API_KEY`.

Ardından şunu çalıştır (kredi harcamaz):
```bash
python3 tools/elevenlabs.py durum
```
"AŞIM AÇIK" uyarısı çıkarsa kullanıcıya şunu söyle: ElevenLabs → Settings → Subscription / usage-based billing kapatılmalı. Araç zaten aşmaz; bu ikinci emniyet.

## 2. Oyuncu seçimi (kredi harcamaz)
```bash
python3 tools/elevenlabs.py oyuncu-sec            # Türkçe ses kütüphanesi → docs/ses-kadrosu.html + .md
python3 tools/elevenlabs.py oyuncu-sec --cinsiyet f --sayfa 1
```
- Her karakter için 4 öneri ve ücretsiz önizleme bağlantısı çıkar. `docs/ses-kadrosu.html` dosyasını Artifact olarak yayınlayıp kullanıcıya dinlet.
- Kullanıcı seçince sesi ata:
  ```bash
  python3 tools/elevenlabs.py ata zeynep <voice_id> --sahip <public_owner_id> --ad "<ses adı>"
  ```
  Atamalar `src/studio/sesler_elevenlabs.json`'a yazılır (repoya girer, anahtar içermez).
- Paylaşılan ses ilk kullanımda hesaba otomatik eklenir. Bu kredi harcamaz ama ses yuvası (voice slot) kullanır; planın yuva sınırına dikkat et.
- Aynı sahnedeki iki karakter aynı sesi almamalı.

## 3. Bölüm seslendirme
```bash
python3 tools/elevenlabs.py seslendir public/episodes/<id>.json                    # maliyet listesi, harcama yok
python3 tools/elevenlabs.py seslendir public/episodes/<id>.json --butce 3000 --onayla
/opt/tts/venv/bin/python tools/ses_kontrol.py <id>    # ücretsiz Whisper kontrolü (venv yoksa: bash tools/kurulum.sh --modelsiz)
```
- **Model:** varsayılan `eleven_v4` (en kaliteli, Türkçe). Alternatifler: `eleven_v3` (duygu etiketleri), `eleven_multilingual_v2` (kararlı), `eleven_flash_v2_5` / `eleven_v4_turbo` (yaklaşık yarı fiyat). Seçim için `--model`.
- **Duygu:** Bölüm JSON'undaki `emotion` v3/v4 için otomatik olarak ses etiketine çevrilir: `[whispers]`, `[crying]`, `[angry]`, `[sad]`… Ek etiket için repliğe `"tags": "[sighs]"` yazılabilir. Etiketler altyazıya girmez.
- **Çıktı:** `public/voice/<id>/*.mp3` + `manifest.json`. Kelime zamanları ve dudak senkronu ElevenLabs'in karakter zamanlarından çıkar. Motor (`Episode3D`) değişmeden çalışır.
- **Gerçek maliyet** her istekten sonra kaydedilir (`.elevenlabs-durum.json`). `durum` komutu toplamı gösterir.

**Kredi planlama:** 1 kredi ≈ 1 karakter (v4/v3/v2). 4-5 dakikalık bir bölümün replikleri yaklaşık 2.500-4.000 karakter tutar. Yani hesap1 ≈ 1-2 bölüm, hesap2 ≈ 15-20 bölüm. Kullanıcıya bölüm başına tahmini her seferinde göster.

## 4. Ses efekti (isteğe bağlı, kredi harcar)
```bash
python3 tools/elevenlabs.py efekt "gentle rain on a window at night, distant thunder" yagmur_el --sure 10   # kuru
python3 tools/elevenlabs.py efekt "..." yagmur_el --sure 10 --onayla
```
Ücretsiz gerçek kayıtlar (`tools/gercek_sesler.py`, BigSoundBank CC0) varken önce onları dene. Efekt için kredi, kullanıcı isterse harcanır.

## 5. MCP bağlayıcısıyla üretim (API anahtarı yerine ElevenLabs bağlayıcısı kuruluysa)
API anahtarı yoksa ve yalnızca ElevenLabs MCP araçları varsa:
1. `python3 tools/elevenlabs.py replikler public/episodes/<id>.json --model eleven_v4`
   - Her satır bir replik (id, voice_id, text) verir; sonda toplam kredi tahmini çıkar.
   - Kullanıcıdan onay al.
   - Bağlayıcının abonelik/kredi aracıyla kalan krediyi kontrol et. Tahmin + 100'den azsa durma noktasını kullanıcıya bildir.
2. Her repliği bağlayıcının text-to-speech aracıyla aynı `voice_id`, `model_id` ve `text` ile üret. Dosyayı `public/voice/<id>/gelen/<replik_id>.mp3` olarak kaydet. Her 5 replikte bir kalan krediyi yeniden kontrol et.
3. `python3 tools/elevenlabs.py ice-aktar public/episodes/<id>.json` → seviye, zamanlama, dudak senkronu, manifest.
4. `/opt/tts/venv/bin/python tools/ses_kontrol.py <id>` ile kontrol et.

Bu yolda bütçe koruması sende. Kalan kredi yetmiyorsa üretme.

## Test (kredi harcamaz)
Her komut `--sahte` ile API'ye gitmeden çalışır. Örnek: `python3 tools/elevenlabs.py --sahte seslendir ... --onayla`. Sahte çalıştırmalar `.elevenlabs-durum.json`'a "sahte" diye işlenir; testten sonra bu dosyayı ve sahte atamaları sil.
