# 7/24 · Bölüm 8 Parça 2: ses yönetmeni raporu

Tarih: 24 Kasım 2026. Metin: `bolumler.md` "Bölüm 8, Parça 2". Replik metinlerine dokunulmadı; yeni replik yok. Seslendirmede yalnız `okunus` (virgül, üç nokta, büyük harf vurgusu, "jıb" Türkçe j), `tags` ve `stab` kullanıldı; bunlar altyazıya girmez.
Yollar `dizi-studio/public/` altındadır. Zamanlar görüntü yönetmeninin `docs/diziler/724/raporlar/b8p2-goruntu-zaman.json` tablosuna göre sahne saniyesidir.

## Kredi (tavan 1.000)
| | kredi |
|---|---|
| Başlangıç (`durum`) | 14.770 kalan |
| 30 replik çekimi (9 replik; eleven_v4) | 523 |
| 2 ses efekti (`el_nah_sak`, `el_nah_sak_bilek`) + 1 müzik (`b8_komik_dusus`, 16 sn) | 220 |
| **Toplam** | **743** (kalan 14.027; tavan aşılmadı) |

Ücretsiz işler (`tools/b8p2_ses.py`, yalnız ffmpeg): ŞAK, kısa plak çiziği, kalem düşmesi, müzik kesiği ve butonu, taslak miks.

## 1. Replikler
Çekim listesi: `public/episodes/724-08-p2-ses.json` (bölüm değil). Çıktılar `public/voice/724-08-p2/`: `manifest.json`, `secim.json`. Görüntü yönetmeninin üreticisi (`tools/b8p2.py`) bu seçimleri zaten kullanıyor.
Tüm seçilen çekimler −16 LUFS (E4h −17,7: tek hece), tepe ≤ −1,3 dBFS. Kelime zamanları klip başından saniyedir (manifest `words`); ağız: `mouth`.

| # | Seçilen | Süre | Kelime zamanları | Neden | Yedek |
|---|---|---|---|---|---|
| E1 Ece "he koskoca…" | **E1a_01** `[mocking laugh]` | 7,47 | (gülüş 0,20-0,90) he 0,96 · koskoca 1,76 · korkunç 2,68 · paralel 3,36 · evrenler 3,76 · götü 4,77 · boklu 5,00 · markette 5,28 · ortak 5,88 · noktada 6,16 · buluşuyor 6,56-7,44 | Whisper medium: "He he he, koskoca…". Alaycı gülüşle başlıyor, "he"ye akıyor; "götü" tepe perde (400 Hz), "buluşuyor" düşük ve bıkkın kapanış. E1b'de "he" kayboluyor. | E1b_01 (`[snorts]`) |
| S1 Sabri "he valla" | **S1a_01** `[sheepish, quiet]` | 1,86 | he 0,12-0,77 · valla 1,00-1,80 | Pes (101-110 Hz), kısık; "he" uzayıp düşüyor, 0,23 sn duraklama, sonra "valla". Medium: "Ehh, valla". | S1f_01 (daha mırıltılı; ElevenLabs hizalaması kaymış, "he" gerçekte 0,10-0,80), S1c_01 |
| E2 Ece "haa öbür taraf yok yani?" | **E2a_01** `[hopeful]` | 2,72 | haa 0,12-1,00 · öbür 1,08 · taraf 1,32 · yok 1,72 · yani? 2,09-2,68 | Uzun "haa…", "yok"ta perde çıkıyor (338 Hz): umutlu soru. | E2b_01 (kuşkulu, düz) |
| S2 Sabri "öbür taraf derken?" | **S2a_01** `[confused]` | 1,75 | öbür 0,03 · taraf 0,43 · derken? 0,83-1,71 | Saf soru, "derken" yükseliyor. | S2b_01 |
| E3 Ece "ruhlar alemi…" | **E3a_01** `[exasperated]` | 3,79 | ruhlar 0,15 · alemi 0,63 · Sabri 1,43 · abi 1,83 · ruhlar 2,55 · alemi 3,11-3,83 | İkinci "ruhlar" belirgin vurgulu (−12 dB / 296 Hz; ilki −20 dB). | E3b_01 |
| S3 Sabri "yoo ne alaka." | **S3a_01** `[calm]` | 1,83 | yoo 0,12-0,76 · ne 0,92 · alaka. 1,08-1,88 | Kesin, sakin. S3b sonu soru gibi kalkıyor. | S3b_01 |
| E4 Ece "heh" | **E4h_01** `[victorious, smug]` | 1,07 | heh 0,32-1,04 | Whisper medium'un "Heh!" duyduğu tek çekim; ötekiler "Hah"/"Hıh" ya da gülüşe dönüyor. | E4a_01, E4g_01 |
| E5 Ece "Did ind jib…" (4. duvar) | **E5a_01** `[nasal mocking voice] … [normal]` | 5,72 | Did 0,16 · ind 0,40 · jib 0,68-0,96 · deyip 1,34 · duruyordunuz 1,60 · al 2,64 · bak 2,96 · tek 3,52 · ortak 3,76 · noktamız 4,08 · market 4,96-5,76 | Taklit kısmı belirgin tiz (348-386 Hz; devamı 200-280 Hz). "jib"in başı ötümlü, yavaş yükselen sürtünmeli: Türkçe j'ye yakın (Whisper medium solo: "DİDİN JÜP"). "al bak" kısa ve iğneleyici, "market" vurgulu. | E5d_01 (en "aptal" genizli; j daha c'ye yakın), E5b_01 |
| E6 Ece "tamam böcek…" | **E6a_01** `[sheepish grin]` | 4,34 | (sırıtma nefesi 0-0,7) tamam 0,77 · böcek 1,89 · biraz 2,29 · sıçana 2,69 · benzemiş 3,13 · olabilir 3,57-4,37 | Sırıtarak başlıyor, sonda ses alçalıyor (olabilir −20 dB / 148 Hz). | E6b_01 |

**KONTROL ET (dinleyip onaylanacak):**
- **E5 "Did ind jib":** j'nin Türkçe j ([ʒ]) mi, "c" mi duyulduğu. Ölçümler j'yi gösteriyor ama miks içinde Whisper "didincip" yazdı. Taklidin genizli ve "aptal" duyulması da kulakla onaylanmalı. Beğenilmezse yedek E5d_01.
- **S1 "he":** miks içinde Whisper yalnız "valla" duydu; solo çekimde "Ehh, valla". "he" zayıf gelirse S1f_01 (daha mırıltılı) ya da S1c_01.
- **E4 "heh":** zafer tınısı yeterli mi?
- **E1 gülüşü:** 0,20-0,90 arasındaki "he he" gülüşü. Ağız senkronunda gülüş yok (ElevenLabs kelimesi değil); görüntüde bu aralığa sırıtma/gülüş ağzı konmalı.

## 2. Ortam
| Dosya | Seviye | Kullanım |
|---|---|---|
| `ortam/b8_market_gece` | −20 LUFS, `volume` 0,5 | P1'den kesintisiz, parça boyunca tek katman. Müziğin kesildiği 4. duvar bölümünde yalnız bu kalır: boş dijital sessizlik yok. |

## 3. Efektler (`tools/b8p2.py` SFX tablosunun yerine)
```python
# M0 = 8.33: müzik girişi (E1 'buluşuyor' bitişi 8,31). Kesim M0 + 14.38 = 22.71 (heh 22.72'den hemen önce).
M0 = 8.33
SFX = {
    "GIRIS": [E("GIRIS", "floresan_cit", t_pop, 0.4)],
    "S1": [{"name": "muzik/b8_komik_dusus_kesik", "at": round(M0 - T["S1"], 3), "volume": 0.25, "sure": 14.4},
           E("S1", "b8_kalem_dus", t_kalem, 0.6),          # kalem_cit DEĞİL (Deli Değilim motifi)
           E("S1", "el_kalem_tik", t_lamba, 0.4)],         # lamba düğmesi
    "S3": [E("S3", "b8_plak_kisa", M0 + 14.38 - 0.38, 0.55)],  # 22,33-22,71: müzik 'durur'
    "E4": [E("E4", "el_whoosh_kay", t_heh, 0.3)],          # kameraya dönüş + hızlı yaklaşma
    "NAH": [E("NAH", "el_kumas_burus", n0 + 0.35, 0.3),    # parmaklar kapanır
            E("NAH", "b8_nah_sak", t_sak, 0.85)],          # ŞAK = 24,287 (tokat yerine)
    "E6": [{"name": "muzik/b8_komik_buton", "at": round(37.95 - T["E6"], 3), "volume": 0.3}],
}
```
`muzik/...` girdileri sfx olarak verilir: motor sahneyi bölmeden (tek sahne `i`, `music: yok`) çalar. Müzik sfx olduğu için otomatik ducking yoktur. Seviye 0,25 seçildi: müzik diyalogdan yaklaşık 14 dB aşağıda kalıyor (diyalog −16, müzik yaklaşık −30 LUFS). Plak çiziği S3 vuruşunda başlar (22,33) ve E4 vuruşuna (22,333) taşar. Motor efekti sonuna kadar çaldığı için sorun olmaz.

| Dosya | Süre | Ne | Tepe |
|---|---|---|---|
| `efekt/b8_nah_sak` | 0,40 | **Kullanıcı düzeltmesine göre:** sağ bilek sol avuç içine çarpar. Tok, etli, tek şaplak; kuru alkış değil. Spektral merkez 2,3 kHz'den 1,1 kHz'e indi; tek vuruş, 0,15 sn'de −40 dB. `el_nah_sak`tan türetildi, gövde artırıldı, kendi sentezimiz et "tok"u eklendi. | baştadır, −3,4 dBFS |
| `efekt/b8_plak_kisa` | 0,42 | Plak çiziği (`el_plak_cizik` ilk 0,38 sn). heh'in önündeki 0,32 sn boşluğa sığıyor, heh temiz kalıyor. | baş |
| `efekt/b8_kalem_dus` | 0,52 | Tükenmez kalem tahta tezgâha düşer, 3 kez seker. | baş |
| `efekt/el_nah_sak_bilek` | 1,0 | Ham ElevenLabs denemesi. Çok vuruşlu çıktı, **kullanılmaz**. | |

## 4. Müzik
| Ne zaman | Müzik | Ses | Not |
|---|---|---|---|
| 0 → 8,33 | yok | | P1'in sert kesiminin sessizliği sürüyor; E1 kuru başlıyor (ortam + floresan). |
| 8,33 → 22,71 | `muzik/b8_komik_dusus_kesik` (from 0) | 0,25 | Yeni, B8'e özgü komik alt ton: pizzicato, fagot, tahta blok, yaklaşık 120 vuruş. E1'in "buluşuyor"u biter bitmez ilk pizzicato vuruşu düşüyor, gerilimden komediye dönüş. Dosyada 14,38'de sert kesim ve ardından 10 sn sessizlik var. |
| 22,33-22,71 | plak çiziği | | Müzik "durur". 22,72'de heh ve kameraya dönüş sessizlikte geliyor: 4. duvar. |
| 22,71 → 37,95 | **yok** | | NAH, ŞAK ve E5 yalnız ortamla. Seyirciyle konuşmanın çıplaklığı sessizlikten geliyor. |
| 37,95 → son | `muzik/b8_komik_buton` | 0,3 | Aynı ipin son pizzicato vuruşu: mahçup itirafın ardından kapanış "butonu". 38,6'da kesilir; o noktada −45 dB'nin altında. |

- Zaman değişirse: `KES = heh kelime başı − 0,01`, `M0 = KES − 14,38`. M0, E1'in "buluşuyor" bitişinden önceye düşerse M0 = o bitiş alınır ve müzik `from = 14,38 − (KES − M0)` ile başlatılır. Plak her zaman `KES − 0,38`'de.
- `jenerik_tema` girmez. Komik parçada leitmotif yerine sessizlik ve buton daha güçlü.

## 5. Taslak miks ve kontrol
- `public/voice/724-08-p2/b8p2_taslak_miks.mp3` (38,6 sn): görüntü zaman tablosuna oturtulmuş tüm replikler, efektler, müzik ve ortam. Ölçüm −14,7 LUFS, tepe −1,5 dBTP.
- Whisper medium (miks): bütün replikler okunuyor ("He he he, koskoca, korkunç paralel evrenler, götü boklu markette ortak noktada buluşuyor." … "Heh." … "Didincip deyip duruyordunuz. Al bak, tek ortak noktamız market." … "Tamam, böcek biraz sıçana benzemiş olabilir."). Sapmalar: S1'de "he" duyulmadı, E5'te "jib" "cip" olarak duyuldu (bkz. KONTROL ET).
- Render sonrası `ebur128` ile LUFS ölçümü ve tüm bölümün Whisper'la yazıya dökülmesi genel yönetmen render'ından sonra tekrarlanmalı.

## Lisans
`public/ses/LISANSLAR.csv`'ye eklendi: ElevenLabs SFX ve müzik (kullanıcının kendi hesabı) ve türevler (`tools/b8p2_ses.py`, kendi sentezimiz).
