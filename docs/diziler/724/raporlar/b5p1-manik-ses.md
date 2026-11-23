# 7/24 · Bölüm 5, 1. parça: manik "lülü?" / "bu da mı olmadı?" (23 Kasım 2026)

Hazırlayan: ses yönetmeni. **Durum: ÜRETİLEMEDİ.** ElevenLabs hesabı her istekte şunu döndürüyor:

> `401 payment_required / payment_issue: "Your subscription has a failed or incomplete payment. Complete the latest invoice to continue usage."`

Kredi harcanmadı, bakiye 6.877. Kullanıcının ElevenLabs'te son faturayı tamamlaması gerekiyor. Üretim seti hazır; hesap açılınca tek komutla çalışır.

## Bağlam ve okuyuş (kullanıcının tarifi)
- Viral, deli bir hamamböceği meme'i var; sürekli "lülülülü" diyor. Ece dev böceğin karşısında dehşet içinde, "belki bu odur" diye çaresizce o sözü deniyor.
- Şimdiki okuyuş fazla "kibar". İstenen **MANİK** okuyuş: titrek, sesi kırılan, yarı ağlayıp yarı gülen histerik.
  - "lülü?": meme ritmini çağrıştıran, şarkımsı ama titrek bir deneme.
  - "bu da mı olmadı?": umut kırılınca panik, ses çatlar.
- Metin AYNEN kalır; yalnız okunuş ve ses etiketi değişir.
- Orijinal meme sesi kullanılmaz (telif). Ses Ece'nin kendisi (Nazlı Yeni).
- İki replik arasındaki 1 sn bekleme kullanıcı kararı; korunur.

## Hazır üretim seti: yalnız eleven_v4 (kullanıcı kararı)
Kaynak: `dizi-studio/public/voice/724-05-manik/kaynak_v4.json`. Çıktı aynı klasöre yazılır. Kuru çalıştırma tahmini **≈ 292 kredi** (tavan 300).

| id | Etiket | Okunuş (seslendirme) | Altyazı (text) |
|---|---|---|---|
| L1 | [manic, sing-song] | Lülü? | lülü? |
| L2 | [hysterical giggle, crying] | Lü-lü? | lülü? |
| L3 | [voice cracking, sing-song] | Lülüü? | lülü? |
| L4 | [manic, shaky, half-laugh] | Lülü? | lülü? |
| B1 | [hysterical, cracking] | Bu da mı olmadı?! | bu da mı olmadı? |
| B2 | [sobbing laugh, panicked] | Bu da mı olmadı?! | bu da mı olmadı? |
| B3 | [manic, crying, cracking] | Bu da mı olmadı?! | bu da mı olmadı? |
| B4 | [panic, voice breaks] | Bu da mı... olmadı?! | bu da mı olmadı? |

Hepsinde `stab: 0.0` (Creative): duygu aralığı en geniş olan ayar.

```bash
cd dizi-studio
python3 tools/elevenlabs.py seslendir public/voice/724-05-manik/kaynak_v4.json --model eleven_v4 --butce 300            # kuru
python3 tools/elevenlabs.py seslendir public/voice/724-05-manik/kaynak_v4.json --model eleven_v4 --butce 300 --onayla
```

## Seçim ve teslim yöntemi (üretimden sonra, ücretsiz)
1. **Whisper:**
   - "bu da mı olmadı" için benzerlik ≥0,9 aranır.
   - "lülü" için Whisper güvenilir değil (her durumda "Lulu" yazıyor; b5-ses.md).
2. **"lülü" telaffuzu:**
   - **Risk:** v4, B5'te altı yazımın altısında da ikinci heceyi "u" okudu (F2 ≈ 1.100-1.450 Hz).
   - Bu yüzden ölçüt formant: iki hecede F2 ≥ 1.800 Hz ("ü").
   - Bu ölçütü hiçbir v4 varyantı geçemezse kullanıcıya sorulmalı: v4 (manik ama "Lulu") ya da v3 (doğru "ü"). Kullanıcı yalnız v4 dedi.
3. **Manik ölçütü:**
   - perde oynaklığı (pyin F0 standart sapması)
   - titreme (4-8 Hz genlik modülasyonu)
   - sesin kırıldığı yerde ani perde sıçraması
   - En yüksek iki varyant seçilir.
4. **Manifest girdisi:**
   - Kelime zamanları ElevenLabs hizalamasından, enerji zarfıyla ±0,07 sn düzeltilerek.
   - Ağız işaretleri harf harf.
   - Anahtar, 724-05.json alanlarına göre hesaplanır (`ses_724_05.py` yöntemi). Böylece birleştirmeden sonra `seslendir` yeniden üretmez.
5. **gapAfter:**
   - i_05'te bugünkü değer 0,7.
   - Kullanıcının "1 sn" bekleyişi = "lülü?" sonu ile "bu" başı arası. Bu da gapAfter + motorun 0,08 sn girişi + yeni dosyanın kuyruk sessizliği + i_06'nın baş sessizliğinden oluşur.
   - Yeni dosyalarla şu formülle yeniden hesaplanacak: gapAfter = 1,0 − (i_05 kuyruğu + 0,08 + i_06 başı).

**Not:** Çalışma ağacındaki 724-05 dosyalarına yazılmadı (koordinatör talimatı). Parça 1'in güncel hâli `origin/claude/affectionate-allen-dxvfpb` dalından okundu:
- i_05: v3, 0,84 sn, tags `[scared, trembling, coaxing, small voice]`, gapAfter 0,7.
- i_06: v4, 2,09 sn, tags `[whimpering, shaky, nervous laugh]`, gapAfter 0,3.

## Geçici çözüm neden yok
- Mevcut kullanılmamış çekimlerin hepsi "çekingen / küçük ses / ikna eden" etiketli: 724-05-ece3 l_01-l_05, 724-05-ses k_01-k_05, ece3 / ece4 k_01-k_02. Kullanıcının beğenmediği "kibar" okuyuşun kendisi bunlar.
- Manik histeriyi (kırılan ses, ağlamalı gülme) sinyal işlemeyle sahte biçimde eklemek inandırıcı olmaz. Bu yüzden önerilmedi.
