> **GERÇEK (19 Kasım 2026):** Berkay deli değil, hastanede ilk günü; herkes onu deli olduğuna inandırmaya çalışıyor (gaslighting). Ayrıntı: `belirsizlik-kurallari.md`.
>
> **Yayın adı: DELİ DEĞİLİM** (kullanıcı, 19 Kasım 2026: "o dizinin adını 'deli değilim' olarak paylaştım her yerde"). Eski çalışma adı "İmza"; dosya adları (`imza-*`) teknik nedenle aynı kalır.

# Berkay dizisi (çalışma adı) — durum notu

**Kullanıcının yönü:** Zekice, merak uyandıran, psikolojik gerilim veren bir dizi.
**Öncül (kullanıcının metni):** Holding yöneticisi Berkay imza atarken kararır; akıl hastanesi odasında uyanır. Hemşire "altı aydır buradasın" der. Koridordan en güvendiği ortağının sesini duyar: "Devir imzasını atana kadar çıkmayacak."
**GÜNCEL kaynak (18 Kasım 2026):** `1-bolum-acilis-kullanici-v2.md` — kuşlu pencere açılışı, hafıza kaybı, Zindan Adası × Truman Show hissi. Eski sürüm: `1-bolum-acilis-kullanici.md` (geçersiz).
**Motor:** 2D (kullanıcı kararı).
**Büyük gerçek: C (katmanlı)** + sürekli belirsizlik ("Berkay gerçekten deli mi?"). Bağlayıcı kurallar: `belirsizlik-kurallari.md`. Bölüm 1 planı (öneri): `1-bolum-plan-oneri.md`. Bölüm süresi: 3 dk = **6 parça × 30 sn** (her parçada kullanıcının gündem göndermesi için yer; her parça ayrı render ve ayrı Reels).
Ekip incelemesi (senarist, yapımcı, izleyici simülatörü): `1-bolum-inceleme.md`

## Sıradaki adımlar
1. Kullanıcı inceleme raporundaki karar sorularını cevaplar (aşağıda).
2. Ses yönetmeni planı (bu oturumda tamamlanmadıysa yeniden çalıştır): ses kadrosu ölçütleri, replik duygu haritası (eleven_v4 etiketleri), ses tasarımı, müzik, kredi tahmini.
3. Kullanıcı onayıyla 1. bölüm (4-5 dk) vuruş planı → çekim senaryosu JSON → yeni varlıklar (toplantı odası, hücre-oda varyantı, ayna hilesi, Berkay/hemşire/ortak kadro kayıtları, kalem/tepsi, çınlama sesi).
4. ElevenLabs: "Dizi" ortamında yeni oturumda `python3 dizi-studio/tools/elevenlabs.py durum` (bu oturumda anahtarlı istekler zaman aşımına uğradı).

## Kullanıcıya açık sorular
1. Aynadaki yüz: Berkay'ın 6 ayda harap olmuş kendi yüzü mü (ekip önerisi), yoksa gerçekten başka bir yüz mü?
2. Hemşire: bilerek suç ortağı mı, yanlış bilgilendirilmiş mi (ekip önerisi: ikincisi, ileride müttefik olabilir)?
3. Ortağın yüzü 1. bölümde görünsün mü, yoksa sadece ses + el + kalem mi?
4. Anlatım zamanı: geçmiş ("tanımıştım") mı, şimdiki mi?
5. Berkay temiz kurban mı, kendi günahları olan gri bir CEO mu?
6. Ortak için yeni karakter + hemşire için yeni karakter kaydı onaylanıyor mu?

## Seslendirme (ElevenLabs v4) — yeni oturumda yapılacak
Bu oturumda ElevenLabs anahtarlı istekleri zaman aşımına uğradı; `imza-b1` geçici olarak ücretsiz Chatterbox sesiyle üretildi.
"Dizi" ortamında açılan yeni oturumda:
1. `python3 dizi-studio/tools/elevenlabs.py durum` (kredi + aşım kontrolü, ücretsiz)
2. `python3 dizi-studio/tools/elevenlabs.py oyuncu-sec` → Türkçe kütüphanede en çok kullanılan doğal sesler önce gelir; ses yönetmeni ölçütleri (Berkay: 30'lar, sıcak bariton, panik+CEO; Selim: pes, pürüzsüz, tane tane — imza ses; Nalan: düz, kuru, rutin; Dr. Deniz: sakin, temkinli). Kullanıcı önizlemeleri dinleyip seçer → `ata berkay_hasta <id>`, `ata berkay <id>` (aynı ses), `ata selim`, `ata nalan`, `ata deniz`.
3. `python3 dizi-studio/tools/elevenlabs.py seslendir dizi-studio/public/episodes/imza-b1.json` (kuru: maliyet) → kullanıcı onayı → `--onayla --model eleven_v4`. Tahmin: ~30 replik ≈ 1.000-1.300 kredi.
4. Selim'in koridor replikleri (k1_03, k1_05) için kapı arkası filtresi: `ffmpeg -i X.mp3 -af "highpass=f=200,lowpass=f=2500,aecho=0.8:0.5:45|90:0.35|0.2,volume=-6dB" X.mp3` (manifest değişmez).
5. `bash dizi-studio/tools/render.sh IMZA-B1 imza-b1`
