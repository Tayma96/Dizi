# 7/24 · Bölüm 5: ses raporu (23 Kasım 2026)

Hazırlayan: ses yönetmeni. Kullanıcının replik metinlerine ve noktalamasına dokunulmadı. Seslendirmede yalnız `okunus`, `tags`, `stab`, `hiz` alanları kullanıldı; bunlar altyazıya girmez. Yeni replik ya da metin eklenmedi. JSON'da yalnız replik ses alanları ile `sfx`, `ambience2` ve `music` yazıldı; çekim ve kamera alanlarına dokunulmadı.

**Önizleme:** `ornekler/b5-ses-onizleme.mp3` (61,7 sn). Video render'ı değil; motorun ses kurallarıyla çevrimdışı kuruldu (`tools/ses_onizleme.py`). Bütün replikler, efektler, ortam, müzik ve bitiş kartı zaman çizelgesindeki yerinde. Master: **−14,4 LUFS, tepe −1,5 dBTP**, LRA 4,5.

> **Güncelleme (23 Kasım, kullanıcı geri bildirimi):** "Ece'nin ses tonu çok sakin… panik hâlinde biraz sert ses tonu olmalıydı. Tüm diyaloglar."
> - Ece'nin B5'teki **bütün replikleri** panik, nefes nefese ve yer yer sert/çıkışan tonda yeniden üretildi.
> - Her replik için en az 3 farklı çekim alındı (v4 A/B + v3). Seçim ölçümle yapıldı: perde ortancası, perde değişkenliği (yarım ton) ve Whisper doğruluğu.
> - Eski sakin çekimler `voice/724-05/kuru/sakin_*.mp3` olarak saklanıyor.

---

## 1. Kredi

| Kalem | Kredi |
|---|---|
| İlk diyalog turu (12 replik + denemeler) | 511 |
| 16 SFX + 1 müzik (14 sn) | ≈ 580 |
| Ece panik yeniden çekimleri (9 replik × 3+ çekim, "lülü" ve tek nefes için ek denemeler) | ≈ 721 |
| **Toplam** | **1.812** (23.543 → 21.731). Bölüm sınırı 3.000 aşılmadı. |

- Kalan bakiye: 21.731. Aracın bütçe koruması açık kaldı.
- Her komut `--butce` ile çalıştı. Yedek pay (100) korundu. Aşım (usage-based billing) kapalı.
- Abonelik sayacı SFX'lerde gecikmeli düşüyor. Kesin rakam için birkaç dakika sonra `python3 tools/elevenlabs.py durum` çalıştırılmalı.

## 2. Replikler (süreler ve kelime zamanları)

- Model `eleven_v4`, ses kimlikleri B1-B4 ile aynı: Ece = Nazlı Yeni (`o9DOmAyPjfFu8AfoFAnM`), Sabri ve sahte Sabri = Nihat (`MuOq11XzQTthwLhmGZ2V`).
- Duygu `tags` ile verildi (dizinin yöntemi; `emotion: "notr"`). Ece replikleri `stab: 0.0` (Creative), gerçek Sabri 0.5 (Natural).
- Kelime zamanları dosyanın başına göredir. Motor sesi vuruş başından **0,08 sn sonra** başlatır.

### Ece: panik çekimleri (güncel, kullanılan)

| Kimlik | Süre (sn) | Okunuş / etiket (seçilen) | Perde ortancası eski → yeni | Kelime zamanları (sn) |
|---|---|---|---|---|
| a_01 | 1,31 | `[panicked, shouting, breathless] Sabri abi?!` hız 1,1 | 232 → 488 Hz | sabri 0,27-0,58 · abi? 0,60-0,95 |
| c_01 | 2,40 | `[panicked, angry, voice trembling, fast] Abi sen benle taştaş mı geçiyorsun?!` hız 1,1 | 205 → 332 Hz | abi 0,07 · sen 0,32 · benle 0,54 · taştaş 0,90-1,32 · mı 1,32 · geçiyorsun 1,50-2,08 |
| d2_01 | 4,21 | `[terrified, angry, voice trembling] Şaka mı?! Abi bir adamın eli yürüdü… [shouting] Elii!` hız 1,1 | 272 → 360 Hz | Şaka 0,13 · mı?.. 0,46-0,90 · Abi 1,16 · bir 1,54 · adamın 1,72 · eli 2,16 · yürüdü… 2,40-3,05 · **ELİ 3,28-3,87** |
| e_02 | 0,89 | `[shrieks] Hoaaa!` | 439 → 723 Hz (çığlık) | hoaa 0,08-0,76 |
| g_01 | 1,49 | `[screaming, furious, terrified] Ne dönüyo lan burda?!` | 404 → 520 Hz | ne 0,09 · dönüyo 0,28 · lan 0,58 · burda! 0,76-1,26 |
| i_01 | 1,25 | `[sharp scared gasp] Hığ!` (tek nefes çekiminin 1. parçası) | 249 → 349 Hz | iki panik nefes: 0,10-0,38 ve 0,66-0,94 |
| i_02 | 3,08 | `[terrified, shaky, high-pitched] Abi vallahi büyük hay-ra-nı-nım!` (2. parça) | (aynı çekim) | abi 0,08 · vallahi 0,66 · büyük 1,16 · hayranınım. 1,56-2,70 |
| i_05 | 0,84 | `[scared, trembling, coaxing, small voice] Lülü?` (**eleven_v3**) | 194 → 229 Hz, değişkenlik 4,9 yt (titrek) | lülü? 0,12-0,64 |
| i_06 | 2,09 | `[whimpering, shaky, nervous laugh] Bu da mı olmadı?!` | 256 → 390 Hz | (0-0,19 titrek nefes) bu 0,19 · da 0,42 · mı 0,60 · olmadı? 0,80-1,77 |

**Seçim notları:**
- **hoaa:** v4 "[shrieks]" en panik çekim. Whisper "Huuu!" yazıyor; çığlık olduğu için beklenen.
- **Tek nefes (i_01 + i_02):**
  - Yeni çekim (`724-05-ece4/j_02`) iki panik nefes + "Abi vallahi büyük hayranınım!" veriyor.
  - Aradaki 0,38 sn sessizlik 0,2 sn'ye kısaltıldı (boşluksuz).
  - Önceki panik çekiminde Whisper "hayran hanım" duyuyordu; bu çekimde 1,00. O sürüm `kuru/panik_A_*` olarak yedekte.
- **lülü:**
  - Panik etiketli 5 v3 çekiminden 2'si yine "Lülu" oldu.
  - "small voice" korunan 3 çekimin üçü de iki hecede ü verdi (F2 ≈ 1.900-2.100 Hz). En titreği seçildi.
- **bu da mı olmadı:** çekimin başındaki 1,3 sn'lik gergin gülme kırpıldı. Kullanıcının "1 sn bekler"i korunsun diye yalnız kısa titrek nefes bırakıldı.
- **Kelime zamanları:** ElevenLabs hizalaması kısa satırlarda 0,1-0,4 sn geç kalıyordu. Bütün Ece satırlarında zamanlar Whisper kelime zamanı ve enerji zarfıyla elle düzeltildi, ağız işaretleri bu zamanlardan yeniden üretildi.

### İlk tur (artık kullanılmıyor; Sabri satırları hâlâ geçerli)

| Kimlik | Süre (sn) | Okunuş / etiket | Kelime zamanları (sn) |
|---|---|---|---|
| a_01 (eski) | 1,75 | `[scared, hesitant, quiet] Sabri abi?` | sabri 0,52-0,70 · abi? 0,76-1,70 |
| b_01 | 8,62 | `[amused, teasing, warm] [laughs] Sakin kız sakin, ilk iş günü şakası... gece…` hız 1,1 | (0-0,9 gülme) sakin 1,10 · kız 1,68 · sakin 2,00 · ilk 2,96 · iş 3,28 · günü 3,44 · şakası.. 3,68-4,48 · (duraklama) · gece 4,72 · vardıyasına 5,04 · ilk 5,96 · defa 6,16 · başlayan 6,48 · herkese 7,04 · yaptığımız 7,60 · şaka 8,20-8,80 |
| c_01 | 3,47 | `[half laughing, nervous, suspicious] Abi sen benle taştaş mı geçiyorsun?` | (0-0,75 gergin gülüş) abi 0,96 · sen 1,36 · benle 1,68 · taştaş 2,00-2,40 · mı 2,48 · geçiyorsun 2,64-3,44 |
| d_01 | 4,62 | `[soft, warm, inviting] [chuckles] Depoya gel, çay yaptım, içte sakinleş biraz.` | (0-1,1 kıkırdama) depoya 1,41 · gel 1,73 · çay 2,29 · yaptım 2,53 · içte 3,25 · sakinleş 3,61 · biraz 4,21-4,77 |
| d2_01 | 4,44 | `[skeptical, rising panic] Şaka mı?.. Abi, bir adamın eli yürüdü… [emphatic] Eli!` | Şaka 0,24 · mı?.. 0,64-1,36 · Abi 1,48 · bir 2,00 · adamın 2,24 · eli 2,64 · yürüdü… 2,92-3,48 · **ELİ 3,70-4,40** |
| e_02 | 0,68 | `[startled yelp] Hoaa!` | hoaa 0,08-0,64 |
| f_01 | 2,48 | `[urgent, low, out of breath] Ona inanma kızım… o ben değilim.` | Ona 0,03 · inanma 0,43 · kızım, 0,71-1,27 · o 1,55 · ben 1,63 · değilim 1,87-2,51 |
| g_01 | 1,57 | `[exasperated, scared, shouting] Ne dönüyo lan burda!` | ne 0,16 · dönüyo 0,36 · lan 0,76 · burda! 0,96-1,52 |
| i_01 | 1,46 | tek nefes çekiminin 1. parçası | nefes çekme 0,02-0,30 · "Hığ!" 0,52-0,86 · titrek "hıh" 1,18-1,40 |
| i_02 | 2,48 | tek nefes çekiminin 2. parçası | (0-0,33 nefes) abi 0,37 · vallahi 0,93 · büyük 1,45 · hayranınım. 1,73-2,50 |
| i_05 | 0,78 | `[timid, coaxing, small voice] Lülü?` (**eleven_v3**) | lülü? 0,08-0,58 |
| i_06 | 1,54 | `[embarrassed, nervous, small voice] Bu da mı olmadı?` | bu 0,13 · da 0,37 · mı 0,49 · olmadı? 0,61-1,49 |

### Özel işlemler (hepsi ücretsiz, `tools/ses_724_05.py`)
- **hıığğ + hayranınım (kullanıcı kararı: boşluksuz):**
  - İki replik tek ElevenLabs çekiminde, tek nefeste üretildi (`724-05-ses.json`, B4 yöntemi). Ardından nefesin bittiği 1,47. saniyeden i_01 / i_02 olarak bölündü.
  - Manifest anahtarları `724-05.json` alanlarından hesaplandı, bu yüzden `seslendir` bu iki satırı yeniden üretmez.
  - JSON'daki `gapAfter: 0` ve motorun 0,08 sn'lik girişiyle birlikte "Hıh" ile "Abi" arasında doğal bir nefes payı kalıyor (≈0,5 sn: çekimdeki 0,4 sn + motorun 0,08 sn girişi; nefes sesiyle dolu, sessizlik yok).
  - İlk deneme (üç ayrı nefes, 2,6 sn) fazla uzun olduğu için kullanılmadı.
- **v4 tekrarları kırpıldı:**
  - e_02: model "Hoaa!"yı iki kez söyledi. Metne hizalı olan ikincisi alındı (0,64-1,28).
  - i_05: v4 çekiminde "Lülü?" iki kez vardı.
  - Kırpılmamış hâller `voice/724-05/kuru/` altında.
- **"lülü" telaffuzu:**
  - v4 altı farklı yazımda da kelimeyi "Lulu" ismi gibi okudu. İkinci hecede ü yerine u çıktı: formant ölçümünde F2 ≈ 1.100-1.450 Hz.
  - **eleven_v3** iki hecede de gerçek "ü" verdi (F2 ≈ 2.030-2.170 Hz). Kısa, soru tonunda bir "lü-lü?".
  - Whisper burada güvenilir değil (Türkçe "lülü"yü her durumda "Lulu" diye yazıyor), bu yüzden ölçüt formant oldu.
  - Aynı ses, model farkı. Tını farkı olabilir; dinlenmeli.
- **Sahte Sabri dokusu (b_01, d_01):**
  - Aynı sesin 14 ms gecikmeli, −0,18 yarım ton kaydırılmış kopyası −17 dB altta ("çift ağız" hissi), artı −30 dB oktav altı gölge.
  - Süre değişmedi; Whisper anlaşılırlığı aynı (0,99 / 1,00). Bilerek fark edilmeyecek düzeyde tutuldu.
  - Kuru hâller: `voice/724-05/kuru/b_01.mp3`, `kuru/d_01.mp3`. İstenirse `python3 tools/ses_724_05.py sahte` değerleri değiştirilerek yeniden uygulanır (kredi yok).
- **b_01 çekim seçimi:**
  - B çekimi (8,62 sn, hız 1,1) kullanıldı.
  - A çekimi (9,33 sn, ortada ek kıkırdama) `kuru/b_01_A.mp3` olarak yedekte.
- **Seviye:** hepsi −16 LUFS ±1 (kısa nefes ve ünlemlerde ölçüm doğal olarak oynak). Tepe ≤ −1,2 dBTP.

### Whisper kontrolü (`ses_kontrol.py 724-05`)
- **Panik çekimlerinden sonra:** a_01, d2_01, i_02, i_06 1,00; c_01 0,97; g_01 0,94. e_02 ("Huuu!" çığlık), i_01 ("Hıh! Hıh!") ve i_05 ("Lulu", formantla ü doğrulandı) ses taklidi olduğu için işaretli. Tam miks Whisper'da: "Sabri abi? … Şaka mı? Abi bir adamın eli yürüdü, eli! … Abi vallahi büyük hayranınım. … Lülü? Bu da mı olmadı?"; bütün replikler doğru sırada.
- İlk tur sonuçları:
- 9 replik ≥ 0,94.
- KONTROL ET işareti alan üç replik ses taklidi; işaret beklenen bir durum:
  - e_02 "Huah!"
  - i_01 "Hıh! Hıh! Ah!"
  - i_05 "Lulu?" (yukarıya bakınız)
- c_01'de Whisper "benimle" yazıyor. Hizalamada kelime 0,24 sn (iki hece), yani büyük ihtimalle "benle" söylendi. Dinlenmeli.
- **Tam miks** Whisper ile yazıya döküldü. Bütün replikler doğru sırada duyuluyor, efekt ve ortam diyaloğu örtmüyor.

## 3. Efektler (ElevenLabs SFX; türevler `efekt/b5_*`: baş olayın başına kırpılmış, tepe −3 dBFS)

| Olay | Varlık | Nerede (`at`, vuruş başından) | Seviye |
|---|---|---|---|
| Ece adım atar | `el_ayakkabi_gicirti` (B4) | e omuz_el 0,50 | 0,2 |
| Omuza el (kumaş) | `b5_omuz_kavrama` | e omuz_el 0,90 (kavrama tI−0,06) | 0,9 |
| İrkilme | `b5_irkilme` | e "hoaa" 0,00 | 0,85 |
| Baş dönüşü savrulma | `kumas_firlat` (B4) | e "hoaa" 0,65 (tD≈1,7) | 0,3 |
| Ambalaj hışırtısı (sahte Sabri'nin elinde) | `el_ambalaj` (B4) | b_01 1,3 · d_01 3,6 | 0,35 / 0,3 |
| Floresan titreme vızıltısı | `el_floresan` | b_01 3,2 · b aksiyon 0,3 · d_01 0,2 · yüz 1,8 · kükreme 0,3 | 0,18-0,4 |
| Yüz erimesi (cızırtı, ıslak akış) | `b5_yuz_erime` | donusum_yuz 0,40 (erime 0,45) | 0,85 |
| Kor çatlak / kitin | `b5_kitin_catirti` | yüz 2,00 (sarsıntı 2,15) · gövde 0,00 · bocek_yakin 0,65 | 0,75 / 0,5 / 0,3 |
| Deri ıslak yırtılma + lif kopması | `b5_deri_yirtilma` | yüz 2,05 (soyulma 2,2; ikinci tepe 3,55 = son parça kopuşu) · gövde 0,45 (yırtılma 0,62) | 0,9 |
| Antenler | `b5_anten_hisirti` | yüz 3,0 · bocek_dev 1,2 · hıığğ 0,5 · bocek_yakin 0,4 | 0,3-0,45 |
| Tıslama | `b5_bocek_tislama` | yüz 3,5 (tepe 3,95) · bocek_dev 0,25 (tepe 0,7) | 0,6 / 0,95 |
| Bacak tıkırtıları | `b5_bocek_bacak` | gövde 0,60 | 0,7 |
| Gövdenin devleşmesi | `b5_govde_buyume` | gövde 0,90 (büyüme 1,0-2,5) | 0,85 |
| Deri/hırka yere düşer | `b5_deri_dusme` ×2 | gövde 1,55 / 1,75 | 0,8 / 0,55 |
| Anten floresana çarpar | `b5_floresan_kivilcim` | gövde 1,77 (kıvılcım tepesi 2,42) | 0,8 |
| Kanat vızıltısı | `b5_kanat_vizilti` | gövde 2,05 · bocek_dev 0,45 · kükreme 0,3 | 0,45-0,55 |
| Mandibula tık tık | `b5_mandibula` | gövde 3,3 · bocek_yakin 1,0 | 0,45 / 0,65 |
| Ece geri sendeler | `el_ayakkabi_gicirti` | bocek_dev 0,80 | 0,3 |
| **KÜKREME** (hırıltı + böceksi tıkırtı) | `b5_bocek_kukreme` (2,1 sn'ye kısaltıldı) | bocek_kukreme 0,18 (`kuk` 0,2'de başlar) | 1,0 |
| Mahçup sessizlik: buzdolabı | `b5_buzdolabi` (6 sn, −20 LUFS) | "lülü?" 0,00 | 0,4 |
| Final korku-komedi vuruşu | `b5_vurus` | siyah 0,00 | 0,75 |

- **Ortam:**
  - Bütün sahnelerde `el_market_ortam` 0,3 (görüntü yönetmeninin değeri, dizi standardı).
  - Kapı tarafındaki sahnelere (a, c, d2, e, i) `ambience2: ortam/yagmur` 0,12 eklendi. f sahnesinde (açık kapı, ıslak Sabri) 0,2; i'de 0,1.
  - Kasa/depo tarafında yağmur yok, yani kesmelerde yön duygusu sesle de kuruluyor.
- **Müzik:**
  - `muzik/b5_donusum_tam`: ElevenLabs Music `b5_donusum` (14 sn, korku dönüşümü) + kendi sentezimiz `korku_drone`'un yükselen kısmı. h sahnesinde başlar, 0,5 seviyesinde.
  - h başından **17,18 sn** sonra (panik çekimleriyle güncellendi), yani **kükremenin başladığı karede keskin kesilir**. Kükreme tek başına kalır, ardından "lülü?" sessizliği gelir: en güçlü araç olan sessizlik + buzdolabı uğultusu.
  - j sahnesinde `music: yok`.
  - B1-B4'teki gibi diyalogda otomatik kısılır.
  - Bitiş kartında `jenerik_tema` otomatik çalar.
- **Lisans:** `public/ses/LISANSLAR.csv`'ye iki satır eklendi (ElevenLabs SFX/Music, kullanıcının hesabı; türev müzik). Katalog: `public/ses/katalog.json`.

## 4. Görüntü yönetmeninin senkron için bilmesi gerekenler
1. **Süreler artık sesten geliyor** (`sure` yok sayılır). Panik çekimleriyle bölüm **57,73 sn + 4 sn kart**.
   - Mutlak başlangıçlar: a 0,00 · b 1,47 · c 10,47 · d 13,13 · d2 18,30 · e 22,80 · f 26,13 · g 28,97 · h 30,80 · i 43,30 · j 54,33.
   - b_01 8,62 sn. GY `gapAfter`'ı zaten −3,82'ye çekmiş; doğru.
   - omuz_el 3. vuruş kayması yeni hoaa için 2,03 olmalıydı; GY güncelledi (ef23d6b).
   - "lülü?" bitişinden "bu"ya şu an ≈1,3 sn var (gapAfter 1,0 + i_06'nın başındaki 0,19 sn titrek nefes). Tam 1 sn istenirse i_05 `gapAfter` 0,7.
2. **Müzik kesme noktası zaman çizelgesine bağlı.** Kesme, h başından 17,18 sn sonra.
   - Bu süre h eklemelerinin toplamı (4,4 + 0,9 + 4,6 + 2,6 = 12,5), i_01 (38 kare) ve i_02 (97 kare) sürelerinden oluşuyor.
   - h eklemelerinin süresi ya da hayranınım `gapAfter`'ı değişirse bana haber verin; `python3 tools/ses_724_05.py muzik <yeni_kesme>` ile ücretsiz yeniden kurulur.
3. **Kükreme sesi bocek_kukreme vuruşunun 0,18. saniyesinde başlar ve 2,1 sn sürer.**
   - Sonraki ece_yakin (rüzgâr, 0,9 sn) boyunca devam eder ve "lülü?" başlamadan ≈0,05 sn önce biter.
   - bocek_kukreme ya da ece_yakin kısalırsa kükreme lülü'ye taşar.
4. **Görsel işaret noktaları (dosya içi saniye, vuruş başına +0,08 ekleyin):**
   - "ELİ" (yeni çekim) 3,28-3,87; bağırarak. Yakın plana kesme şu an 2,35'te, "bir adamın eli"de. "ELİ"deki vurguyla tam örtüşsün istenirse `shots.at` ≈ 3,30. GY 3,31 yaptı (ef23d6b).
   - Sahte Sabri: b_01'in ilk 0,9 sn'si ve d_01'in ilk 1,1 sn'si sessiz gülme/kıkırdama (ağız açık, omuz sarsıntısı). b_01'de 4,48-4,72 arası ".." duraklaması.
   - i_01 (yeni): iki panik nefes, 0,10-0,38 ve 0,66-0,94 (`hik`). i_02'de "abi" 0,08'de.
   - c_01 (yeni): baştaki gülüş yok, "abi" 0,07'de, hızlı ve çıkışan.
   - a_01 (yeni): "Sabri abi?!" 0,27-0,95, bağırarak.
   - Siyah vuruşu 0,5 sn. Final vuruşu 1,3 sn çaldığı için bitiş kartının jeneriğiyle ≈0,8 sn üst üste biniyor. Siyah 1,0-1,3 sn yapılırsa vuruş temiz biter (öneri).
5. Kelime zamanlarının doğruluğu enerji zarfıyla doğrulandı, ±0,07 sn. a_01 ve d2_01'de ElevenLabs hizalaması 0,13-0,15 sn geç kalıyordu; düzeltildi.

## 5. Kullanıcının dinleyip onaylaması gerekenler (ben dinleyemiyorum)
0. **Ece'nin yeni panik tonu:**
   - Yeterince korkmuş ve sert mi? Abartılı ya da yapay duran var mı?
   - Değişen replikler: a_01, c_01, d2_01, e_02, g_01, i_01, i_02, i_05, i_06.
   - Beğenilmeyen satırın 2. aday çekimi `voice/724-05-ece4/` (v4) ve `voice/724-05-ece3/` (v3) altında; kredi harcamadan değiştirilebilir.
1. **"lülü?"** (v3): gerçekten "lü-lü?" mü, tını öteki Ece replikleriyle uyumlu mu? Değilse yedek: `kuru/i_05_v4_Lulu.mp3` (daha uyumlu tını ama "Lulu" gibi).
2. **hıığğ → "abi vallahi büyük hayranınım."** tek nefeste: komik panik oturuyor mu?
3. **Sahte Sabri dokusu:** fark edilmiyor mu, yoksa hiç mi duyulmuyor? Gülmesi ve hızı uygun mu (B / A çekimi)?
4. **c_01:** "benle" mi "benimle" mi duyuluyor? "taştaş" anlaşılıyor mu?
5. **Kükreme:** korkunç mu, böceksi tıkırtı + hırıltı karışımı yeterli mi?
6. **Final vuruşu** (`b5_vurus`): korku-komedi tonu (derin vuruş ardından inen bas "wah", perde 78 → 66 Hz) yerinde mi?
7. **Dönüşüm efektleri:** erime, yırtılma, lifler yeterince ıslak ve ürkütücü mü?

## 6. Dosyalar
- Bölüm JSON: `dizi-studio/public/episodes/724-05.json`.
- Ses JSON: `dizi-studio/public/episodes/724-05-ses.json`. Geçici; ilk tur tek nefes, b_01 B ve lülü denemeleri.
- Panik aday çekimleri: `dizi-studio/public/episodes/724-05-ece4.json` (v4) ve `724-05-ece3.json` (v3); sesleri `public/voice/724-05-ece4/`, `724-05-ece3/`.
- Replikler: `dizi-studio/public/voice/724-05/*.mp3` + `manifest.json`. Yedekler `kuru/` altında.
- Efektler: `dizi-studio/public/ses/efekt/el_*.mp3` (ham) ve `b5_*.mp3` (türev).
- Müzik: `dizi-studio/public/ses/muzik/b5_donusum.mp3`, `b5_donusum_tam.mp3`.
- Araçlar:
  - `dizi-studio/tools/ses_724_05.py`: bölme, sahte doku, kırpma, efekt türevleri, müzik, ölçüm.
  - `dizi-studio/tools/ses_onizleme.py`: çevrimdışı bölüm sesi önizlemesi, her bölüm için kullanılabilir.
- Önizleme: `ornekler/b5-ses-onizleme.mp3`.
