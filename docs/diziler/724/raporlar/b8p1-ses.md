# 7/24 · Bölüm 8 Parça 1: ses yönetmeni raporu

Tarih: 24 Kasım 2026. Metin: `bolumler.md` "Bölüm 8, Parça 1". Replik metinlerine dokunulmadı. Seslendirmede yalnız `okunus` (virgül, üç nokta, son kelimede büyük harf vurgusu), `tags` ve `stab` kullanıldı; bunlar altyazıya girmez. Yeni replik yok.
Yollar `dizi-studio/public/` altındadır. Katalog adları uzantısızdır (`efekt/b8_kalem_dokun` gibi).

## Kredi
| | kredi |
|---|---|
| Başlangıç (`durum`) | 16.049 kalan |
| 19 replik çekimi (7 replik; eleven_v4) | 592 |
| 4 ses efekti (kalem ×3, kâğıt) | 115 |
| 1 müzik (`b8_anlatim`, 30 sn) | 375 |
| **Toplam** | **1.082** (kalan 14.967; parça tavanı 1.200 aşılmadı) |

Ücretsiz işler: kesimler, dokunma tıkı, floresan vızıltısı, ortamlar, müzik türevleri, taslak miks (`dizi-studio/tools/b8p1_ses.py`, yalnız ffmpeg).

---

## 1. Replikler: seçimler
Çekim kaynağı `public/episodes/724-08-ses.json`. Bu dosya bölüm değil, yalnız çekim listesidir. Çıktılar `public/voice/724-08/` altında: `manifest.json` ve seçim özeti `secim.json`.
Görüntü yönetmeninin kurucusuna verilecek komut:
```
python3 tools/b8p1.py --cekim R1=R1c_01,R2=R2b_01,R3=R3b_01,R4=R4a_01,R5=R5a_01,R6=R6a_01,R7=R7d_01
```
Tüm çekimler Whisper'dan geçti: small modelde 0,99-1,00, medium modelde birebir. **KONTROL ET işaretli replik yok.**

Kelime zamanları klibin başından itibaren saniyedir (manifest `words`). Whisper medium ile karşılaştırıldı; fark 0,1-0,2 sn içinde.

| # | Seçilen (manifest) | Süre | Kelime zamanları | Neden bu çekim | Yedek |
|---|---|---|---|---|---|
| 1 Sabri "geldin demek, hoş geldin" | **R1c_01** `[unsurprised, weary, low]` | 2,64 | geldin 0,10 · demek 0,59 · hoş 1,71 · geldin 1,99-2,67 | En pes çekim (ortanca perde 102 Hz; R1a'da 118). Son "geldin" yorgunca sönüyor; şaşkınlık yok. "demek"ten sonra 0,32 sn bekleme var. | R1a_01 (biraz daha sıcak), R1b_01 (son hecede perde yükseliyor, daha "hoş geldin" havası) |
| 2 Ece "abi uzatmaya gerek yok…" | **R2b_01** `[nervous, then firm, louder]` | 4,91 | abi 0,23 · uzatmaya 0,40 · gerek 0,88 · yok 1,20 · neydi 1,68 · bu 1,96 · gece 2,08 · olanlar? 2,32 · Bana 3,04 · bazı 3,28 · cevaplar 3,60 · **borçlusun! 4,08-4,88** | Başta 0,2 sn gergin nefes alıyor. İkinci cümlede ses yükseliyor (ortalama perde 307 Hz'den 338 Hz'e). Sonu en sert ve en tok olan çekim bu: "borçlusun" tepesi −14 dB; R2a'da −20, R2c'de −17. | R2c_01 (daha alçak ve tedirgin başlıyor, ama sonu nefesli), R2a_01 (daha sakin) |
| 3 Sabri "Anlatayım kızım" | **R3b_01** `[sighs, slow, grave]` | 3,14 | nefes 0,05-0,95 · Anlatayım 1,22 · kızım 2,38-3,10 | Derin nefes 0,9 sn sürüyor ve duyuluyor. "Anlatayım… kızım" arasında 0,28 sn ağır bir bekleme var. En pes çekim (91 Hz). | R3a_01 (nefes var, bekleme yok) |
| 4 "bunlar dünyadaki topluluklar" | **R4a_01** `[wise storyteller, slow]` | 3,27 | bunlar 0,10 · dünyadaki 1,38 · topluluklar 2,10-3,22 | "Bunlar…" sözcüğünden sonra 0,28 sn bekleme var. Masal anlatıcısı ritminde. | R4b_01 |
| 5 "Bu da ortak yaşam çizgimiz." | **R5a_01** (aynı etiket) | 3,08 | Bu 0,16 · da 0,32 · ortak 1,28 · yaşam 1,76 · çizgimiz 2,16-3,12 | "Bu da…" sonrasında bekleme var. 4 ve 6 ile aynı çekim ailesinden, tını tutarlı. | R5b_01 |
| 6 "İnsanlar asırlar boyunca…" | **R6a_01** (aynı etiket) | 9,51 | İnsanlar 0,03 · asırlar 0,99 · boyunca 1,63 · hikâyeler 2,11 · anlattı 2,83-3,71 · korkular 4,03 · yarattı 4,67-5,71 · ve 5,79 · bunların 5,91 · her 6,55 · biri 6,75 · paralel 7,47 · bir 7,95 · çizgi 8,19 · oluşturdu 8,59-9,55 | En yavaşı (R6b 9,09 sn). "anlattı… korkular yarattı…" arasında nefes payları var. | R6b_01 |
| 7 "ancak geceleri… buluşuyor" | **R7d_01** `[slow, hushed, eerie]` + okunuşta "BULUŞUYOR" | 6,64 | ancak 0,04 · geceleri 0,52 · tüm 1,80 · bu 2,12 · paralel 2,28 · çizgiler 2,76 · bir 3,96 · ortak 4,20 · noktada 4,64 · **buluşuyor 5,72-6,68** | Sesli başlıyor, "çizgiler"den sonra kısık ve yarı fısıltıya iniyor. Son kelime öncekilerden güçlü (tepe −12 dB; "bir" −17). Önündeki 0,28 sn bekleme vurguyu açıyor. | R7b_01 (baştan sona fısıltı; son kelime vurgusu en belirgin, −13'e karşı −17), R7e_01, R7a_01, R7c_01 (bunlarda son kelime öncekilerden zayıf) |

- **R1c düzeltmesi:** ElevenLabs hizalaması ilk kelimeyi 0,35 sn'de başlatıyordu, oysa ses dalgası ve Whisper 0,10'u gösteriyor. Manifestte ilk kelime 0,10-0,55'e çekildi ve ilk kelimenin ağız işaretleri yeniden ölçeklendi (`duzeltme` alanı).
- **R3b:** Ağız 1,22 sn'ye kadar kapalı (nefes). Görüntüde göğüs ya da omuz kalkışı 0,05-0,95 arasına konabilir.
- Seviye: tüm replikler −16 LUFS. Ağız senkronu: manifestteki `mouth`.

## 2. Ortam (her an bir katman)
| Dosya | Süre | Seviye | Kullanım |
|---|---|---|---|
| `ortam/b8_market_gece` (yeni) | 52 sn döngü | −20 LUFS → `volume` 0,5 | Sahne `i` (market içi) ana katmanı. İçinde buzdolabı uğultusu, floresan vızıltısı (100 Hz), uzakta hafif yağmur (dizi incili: yağmurlu sokak) ve camın arkasında seyrek gece trafiği var. Mevcut `ortam/market_gece`nin yerine önerilir; o dosyada trafik ve ayrı floresan katmanı yok. |
| `ortam/sehir_gece` | 58 sn | 0,5 | Sahne `d` (dış) için doğru seçim, kalsın. Motor sahne kesmesinde içerideki ortamı 0,4 sn önce başlatır (J-cut). |
| `ortam/b8_floresan` (yeni) | 40 sn | −20 LUFS | İsteğe bağlı `ambience2`, 0,12. Kâğıt yakın planlarında vızıltıyı biraz öne almak için. |
| `ortam/b8_trafik_cam` (yeni) | 58 sn | −20 LUFS | İsteğe bağlı. Otomatik kapı açıkken trafik içeri dolsun diye: KAPI vuruşunda `sfx`, kapı açılışından itibaren `sure` 2,5, ses 0,3. |

## 3. Efektler (görüntü yönetmeninin çizim zamanlamasına göre)
Zamanlar `tools/b8p1.py`'deki değişkenlerle yazıldı. Aşağıdaki `SFX` tablosu oradakinin yerine doğrudan konabilir (`E(ad, isim, sahne_saniyesi, ses, sure=)`). Mevcut yer tutucular gözden geçirildi; değişiklikler tablonun altında.

```python
# çizimle aynı anlar (cizim_kur ile aynı formüller)
d0, b0 = T["DAIRE"], T["BIRLES"] + 0.06
tD, tT = W("R4", "dünyadaki"), W("R4", "topluluklar")
l0, l1 = W("R5", "bu") - 0.05, W("R5", "yaşam", "end")
tp = [W("R6", "hikâyeler"), W("R6", "korkular"), W("R6", "yarattı")]
tpar, tolu = W("R6", "paralel"), W("R6", "oluşturdu")
tq = [W("R7", "tüm"), W("R7", "paralel"), W("R7", "çizgiler")]
to, tn, tb = W("R7", "ortak"), W("R7", "noktada"), W("R7", "buluşuyor")
KESIM = tb + 1.6                     # el kalkar = müzik kesilir = floresan cızırtısı
SFX = {
    "DIS": [E("DIS", "ayak_sesleri", T["DIS"] + 0.1, 0.35, sure=2.7)],
    "CAM": [E("CAM", "el_nefes_tutma", c0 + 1.0, 0.45)],
    "KAPI": [E("KAPI", "otomatik_kapi", t_ac0 - 0.05, 0.6), E("KAPI", "kapi_dingdong", t_ac0 + 0.1, 0.55),
             E("KAPI", "b8_trafik_cam", t_ac0, 0.3, sure=2.5), E("KAPI", "ayak_sesleri", t_esik, 0.3, sure=1.4)],
    "VARIS": [E("VARIS", "el_tezgah_carpma", v0 + 0.42 - 0.08, 0.45, sure=0.5)],
    "R3": [E("R3", "b8_kagit_tezgah", r3a + 0.25 - 0.18, 0.45), E("R3", "el_kalem_tik", r3a + 1.0, 0.4)],
    "DAIRE": [E("DAIRE", f"b8_kalem_daire_{i + 1}", d0 + 0.08 + i * 0.78, 0.5) for i in range(3)],
    "R4": [E("R4", "b8_kalem_dokun", t, 0.55) for t in (tD, tD + 0.5, tT + 0.2)],
    "BIRLES": [E("BIRLES", f"b8_kalem_birles_{i + 1}", b0 + i * 0.46, 0.5) for i in range(3)],
    "R5": [E("R5", "b8_kalem_yasam_cizgisi", l0, 0.35, sure=round(l1 - l0 + 0.05, 2))],
    "R6": [E("R6", f"b8_kalem_paralel_{i + 1}", tp[i], 0.3) for i in range(3)]
          + [E("R6", "b8_kalem_dokun", t, 0.45) for t in (tpar, tpar + 0.45, tolu + 0.15)],
    "R7": [E("R7", f"b8_kalem_yakinsa_{j + 1}", tq[j], 0.3) for j in range(3)]
          + [E("R7", "b8_kalem_dokun", t, 0.45) for t in (to, tn + 0.2)]
          + [E("R7", "b8_kalem_son_daire", tb, 0.4), E("R7", "b8_kalem_dokun", tb + 0.82, 0.7)],
    "SON": [E("SON", "el_floresan", KESIM, 0.45, sure=1.2)],
    "YUTKUN": [E("YUTKUN", "yutkunma", y0 + 0.5, 0.7)],
}
```

Bu kurgu ve seçilen çekimlerle hesaplanan saatler (sahne saniyesi): daireler 22,01 / 22,79 / 23,57 · R4 dokunuşları 24,68 / 25,18 / 25,60 · birleşme 28,03 / 28,49 / 28,95 · yaşam çizgisi 29,61-31,63 · paralel çizgiler 34,98 / 36,90 / 37,54 · dokunuşlar 40,34 / 40,79 / 41,61 · yakınsama 44,64 / 45,12 / 45,60 · dokunuşlar 47,04 / 47,68 · son daire 48,56 · bastırma 49,38 · **kesim 50,16** · yutkunma 51,60.

**Yeni efekt dosyaları** (tepe noktası baştadır, `at` = olay anı):
| Dosya | Süre | Ne |
|---|---|---|
| `efekt/b8_kalem_daire_1..3` | 0,65 | Tükenmez kalemle yuvarlak (çizim 0,6 sn). |
| `efekt/b8_kalem_birles_1..3` | 0,42 | Birleşme yayı (0,36 sn). |
| `efekt/b8_kalem_yasam_cizgisi` | 2,09 | Ortak yaşam çizgisi: tek uzun çizgi, sonu bastırarak. `sure` ile çizim süresine kırpılır. |
| `efekt/b8_kalem_paralel_1..3` | 0,60 | Paralel çizgi (0,55 sn). |
| `efekt/b8_kalem_yakinsa_1..3` | 0,55 | Ortak noktaya yakınsayan çizgi (0,5 sn). |
| `efekt/b8_kalem_son_daire` | 0,71 | Kesişimdeki son yuvarlak (0,62 sn), biraz daha güçlü (−18 LUFS). |
| `efekt/b8_kalem_dokun` | 0,26 | Kalem ucunun kâğıda (altı tahta) vuruşu. Kendi sentezimiz. Bastırma anında 0,7. |
| `efekt/b8_kagit_tezgah` | 1,15 | Kâğıt tezgâha konur, avuçla düzlenir. Tepe 0,18. |
| `efekt/b8_kalem_uzun_tam` | 2,51 | Yedek: tam uzun çizgi. |
| Ham kayıtlar | | `efekt/el_kalem_daire`, `el_kalem_uzun_cizgi`, `el_kalem_kisa_cizgi`, `el_kagit_tezgah` (ElevenLabs SFX). |

**Yer tutuculara notlar:**
- VARIS `el_kapi_yumruk` metal hastane kapısına vurma sesi; tezgâh tahta. Yerine `el_tezgah_carpma` (tok tahta vuruşu, tepe 0,08) konmalı.
- R3 `el_kagit` "elden ele kâğıt" sesi. Yerine `b8_kagit_tezgah` (tezgâha konan kâğıt) önerilir.
- R3 `kalem_cit` dolma kalem kapağıdır ve Deli Değilim'in (İmza) motifidir. 7/24'te kullanılmamalı; çıkarılsın. Kalemi alma sesi `el_kalem_tik` yeterli.
- KAPI `el_market_adim` görünmeyen birinin ağır, uğursuz adımları (B1 korku sesi). Ece'nin tedirgin girişi için gerçek kayıt `ayak_sesleri` (kırp 1,4, ses 0,3) daha doğru.
- YUTKUN `el_yutkunma` (1,5 sn) yerine B4'te temizlenmiş tek yutkunma `yutkunma` (0,71) kullanılabilir.
- SON `el_floresan` müzik kesimiyle aynı ana kaydırıldı (`KESIM`). Işık titremesi de görüntüde bu kareye alınırsa kesim motive olur.

## 4. Müzik
| Ne zaman | Müzik | Ses | Not |
|---|---|---|---|
| DIS başı → R3 başı (0-18,6) | `muzik/market_tedirgin` (from 0) | 0,14 | Tedirgin alçak alt ton. Motor segment sonunda 1 sn söndürür; bu, Ece'nin "borçlusun"una denk gelir. |
| R3 (18,6-21,93) | **yok** | — | Derin nefes ve "Anlatayım kızım" sessizlikte. Duygu dönüşü sessizlikle veriliyor. |
| DAIRE başı → son (21,93-53,1) | `muzik/b8_anlatim_uzun`, **`from` = 33,55 − (KESIM − T["DAIRE"])** (bu kurguda **5,32**) | 0,30 | Kalem kâğıda değdiği an girer. Gizemli ve yavaş bir alt ton, tını giderek parlaklaşıyor. Dosyada büyüme rampası (−5 → +1 dB) var. Çizim boşluklarında müzik açılıyor, replikte kısılıyor. Son kelimeden 0,64 sn sonra, el kalkarken **sert kesim** (dosyada 33,55. sn) ve ardından sessizlik. Yutkunma yalnız ortamla duyulur. |

- **Motor notu (önemli):** Müzik izi sahne sınırında başlar ve döngülü çalar. Bu yüzden üç müzik durumu için sahne `i` üçe bölünmeli: `i1` (CAM…R2, müzik `market_tedirgin`), `i2` (R3, `music: {"name": "yok"}`), `i3` (DAIRE…YUTKUN, `b8_anlatim_uzun` ve `from`). Üç sahnede de aynı `ambience` adı kullanılırsa motor ortamı kesmede söndürmez, ortam kesintisiz sürer.
- **Sert kesim:** Motor müzik segmentinin sonunu 1 sn söndürür. Bunun kesimi yumuşatmaması için kesimden sonra dosyada 10 sn dijital sessizlik var; segment parça sonuna kadar uzayabilir, döngüye girmez. Kesim, segment sonundaki sönüme bağlı değil, dosyanın içinde.
- Kurgu değişirse `from` formülü yeniden hesaplanır. Formülün çalışması için `KESIM − T["DAIRE"]` 33,55 sn'yi geçmemeli. Daha kısa bir anlatımda `muzik/b8_anlatim_kesik` (kesim 25,55; formülde 33,55 yerine 25,55) kullanılabilir.
- İsteğe bağlı leitmotif: kesimden sonra `jenerik_tema` girmesin; sessizlik daha güçlü. Kanca kartı gelirse oraya konabilir.

## 5. Miks seviyeleri
- Diyalog −16 LUFS. Ortam −20 LUFS, `volume` 0,5. Müzik −18 LUFS dosya: tedirgin 0,14, anlatım 0,30 (motor replikte −7 dB kısar).
- Kalem sesleri sessiz anlarda 0,5, replik altında 0,3-0,35. Dokunma tıkı 0,45-0,55, bastırmada 0,7.
- Taslak miks: `public/voice/724-08/taslak_miks_b8p1.mp3` (53,1 sn). Görüntü yönetmeninin kurgusu, seçilen çekimler ve yukarıdaki tablo ile yapıldı; motorun kısma davranışı taklit edildi. Ölçüm −14,3 LUFS, tepe −1,1 dBTP. Whisper medium tüm metni 1,00 benzerlikle yazıya döktü. Kesimden sonra (50,2+) yalnız ortam kalıyor: −21,5 LUFS anlık. Bu taslak yalnız dinleme içindir; motor kullanmaz.
- Son master −14 LUFS, tepe ≤ −1,5 dBTP (`render.sh`). Render sonrası `ebur128` ve Whisper ile bölüm denetimi yapılacak.

## 6. Dinleyip onaylanması gerekenler (ölçemediğim şeyler)
1. **R7d'deki "BULUŞUYOR" vurgusu** doğal mı, abartılı mı? Abartılıysa tam fısıltı yedeği R7b_01. R7b 0,6 sn kısa olduğu için `--cekim R7=R7b_01` ile kurgu kendiliğinden kayar.
2. **R2b'de Ece:** Samimi ve doğal mı, yoksa fazla mı bağırıyor? Daha alçak ve tedirgin bir alternatif R2c_01.
3. **R1c:** "Hiç şaşırmamış, bekliyormuş" havası. Çok kayıtsız gelirse R1a_01.
4. **Kalem sesleri:** Tükenmez kalem gerçekçi mi? Kısa kesimler (0,4-0,6 sn) tek tek çizgi gibi duyuluyor mu?
5. **Müzik:** Büyüme ve kesim anı. Kesim el kalkarken. Son kelimeden hemen sonra kesilmesi istenirse `KESIM = tb + 1.0` yapılır; o zaman müzik dorukta duyulmadan kesilir.
6. Ortamdaki uzak yağmur bu gece için uygun mu (dizi incili: yağmurlu sokak)? Yağmursuz isteniyorsa ortam yalnız `b8_floresan` + `b8_trafik_cam` + `efekt/el_buzdolabi` ile yeniden kurulur (ücretsiz).

## 7. Lisans
`public/ses/LISANSLAR.csv`'ye iki satır eklendi: ElevenLabs SFX ve Music (kullanıcının hesabı) ile türevler (BigSoundBank #0680 CC0 ve kendi sentezimiz). Katalog: `public/ses/katalog.json`.
