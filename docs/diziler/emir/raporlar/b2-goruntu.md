# Kayıp CEO B2: görüntü planı (görüntü yönetmeni, 20 Kasım 2026)

## 1. Mekânlar ve ışık
- **kulube** (`gunduz`, `sicak`): kaza 14:07'de oldu ve aynı gündeyiz, o yüzden güneş ~35° açıyla girer.
  - Anahtar: kapıdan (#fff1c8). Dolgu: ateşten (#ffb060, %12). Arka: çatı aralığından.
  - YENİ fg katmanı: hasırdan sızan 60° eğimli ışık şeritleri (%22), karakterlerin üstüne de düşer. Dışarıdaki palmiye sallandıkça titrer.
- **YENİ `zenith_merkez`** (İstanbul genel merkez resepsiyonu; `gunduz`, yağmur, `soguk`):
  - Arka: tavandan yere cam, arkasında bulanık köprü ve minare silüeti (#8a97a6→#5a6878), camda akan damlalar.
  - Ön: parlak siyah taş zemin (#1c1f24), beyaz masa, arkadan aydınlatmalı çelik logo (#b8bcc2, altın nokta #c9a24a).
  - Duvarda TV; mavi ışığı yüzlere vurur.
  - İkincil hareket: santralde yanıp sönen hat ışıkları.
- **YENİ `koy_meydani`** (`aksam`, altın saat):
  - Ortada taş halkalı ateş, arkada 3 kulübe.
  - Solda enkaz yığını: lacivert ezik valiz, kabindeki elmas dikişli minder (#2c2f35), sarı can yeleği (#f2c21a), açık evrak çantası (#4a2a18), kırık tepsi, perçinli alüminyum parça.
  - Ateş ışığı: `random(seed)` titreşimiyle fg'de `soft-light` gradyan (karakterlerin üstüne biner), yükselen kıvılcımlar.

## 2. Çekim listesi
Eksen:
- Kulübede Emir'in başı solda (≈216,1470), kadın sağda. Kamera hep yatağın önünde.
- Meydanda yaşlı sağda, gençler solda (B1 sahille aynı).

Yeni işaretler:
- Kulübe: `bas_ucu` {400,1640,940,sit}, `kapi` {930,1560,900}.
- Meydan: `ates` (540,1500), `yb` (730,1560,1000), `y1` (250,1600,980), `y2` (130,1500,880), `ya` (900,1480,860).

| # | Set | Ölçek / hareket | Eylem |
|---|---|---|---|
| 1 | kulube | `pov_yaprak` | B1'in son POV karesinden başlar |
| 2 | kulube | genis {420,1300,1.5} | establishing |
| 3 | kulube | orta, yaklas | yarım doğrulma, `aci`, geri düşer; kadın `uzat` |
| 4 | kulube | `pov_bilek` | odak netleşir |
| 5 | kulube | `kol_saati` | tik-tak yok |
| 6 | kulube | yakin Emir | `saskin`, bakış saatten kadına |
| 7 | kulube | orta Emir | "Emir.", `eliKalbinde` |
| 8 | kulube | yakin kadın | `dusunceli`, tilt 8° |
| 9 | zenith_merkez | genis, yaklas | spiker sesi başlar |
| 10 | zenith_merkez | `tv_son_dakika` "1" | spiker, bantlar |
| 11 | zenith_merkez | `tv_son_dakika` "2" | portre, harita |
| 12 | zenith_merkez | orta resepsiyonist | ahize iner, `sok` |
| 13 | zenith_merkez | kaydir → logo, uzaklas | "akıbeti bilinmiyor" |
| 14 | kulube | genis kapı | kadın yemekle girer, kenar ışığı |
| 15 | kulube | `yemek_ust` | yaprağı iter |
| 16 | kulube | orta kadın | `yeIsareti` |
| 17 | kulube | orta Emir, `dogrul` %45 | "Ne ki bu?" |
| 18 | kulube | `yemek_el` | sargı ve saat görünür |
| 19 | kulube | yakin Emir, yaklas | "Nerdeyim ben?…" `korkmus` |
| 20 | kulube | yakin kadın | "Pilot, hostes…" ekran dışından |
| 21 | kulube | cok_yakin Emir | "onlar?" `sok`, tears 0.3 |
| 22 | kulube | orta Emir | "Gitmeliyim…" sweat 0.4 |
| 23 | kulube | iki (tek) | `bastir` |
| 24 | kulube | `omuz_bastir` | |
| 25 | kulube | yakin, `angle: ust`, uzaklas | çaresizlik |
| 26 | koy_meydani | genis, kaydir | ses köprüsü: nefes → çıtırtı |
| 27 | koy_meydani | `esya_yigini` | |
| 28 | koy_meydani | orta yaşlı, `angle: alt` | dosya elinde |
| 29 | koy_meydani | `sozlesme` | ≥2 sn okunur |
| 30 | koy_meydani | `sozlesme_burus` | |
| 31 | koy_meydani | orta yaşlı | ateşe fırlatır |
| 32 | koy_meydani | `sozlesme_ates` | |
| 33 | koy_meydani | genis, uzaklas | kıvılcımlar, kararma |

Aynı ölçek art arda en fazla 2. Toplam ~85 sn; parçalar: 1-8, 9-21, 22-33.

**Kadın birden belirmesin:** POV'un 0. karesinden itibaren kadraj boş kalmaz, kadın hep oradadır. Giriş ve çıkış yalnızca nesnel çekimde, yürüyerek. Kameraya yalnızca POV'da bakar. POV yüzü kıpırtısız olmaz: nefes, göz kırpma, kapı rüzgârıyla saç telleri, üstünden geçen ışık şeridi.

## 3. Yeni varlıklar
1. **kol_saati:**
   - Çelik kasa (#c0c4c8), lacivert güneş ışınlı kadran (#1f2a44).
   - İbreler: akrep 63,5°, yelkovan 42°, saniye ibresi 228°'de donuk.
   - Camda yıldız çatlak, çatlakta kum (#e6cf9c); kurumuş kan (#5a1414).
   - Hareketi yalnızca camda kayan parlama verir.
   - Yazı ve yıldız yok (Zenith gerçek bir saat markası).
   - Bilekte yırtık manşet ve yaprak sargının ucu.
2. **pov_yaprak:**
   - Kalp biçimli gölevez yaprağı (#5f8a3a, damarlar #9cc46a), ışığı arkadan geçirir, üstünde su damlaları.
   - Kol kadraj kenarına kadar uzanır.
   - Bulanık başlar; dokunuşta göz kırpılır, odak sonra kadına kayar.
3. **Yemek:** yarım hindistan cevizi kabuğu (#6a4a2c), suyunda dalgalanan yansıma. Muz yaprağında ızgara izli, buharı tüten balık. Papaya dilimleri (#f28a3a) ve muz.
4. **tv_son_dakika:**
   - Uydurma kanal "MERİDYEN HABER".
   - Kırmızı "SON DAKİKA" bandı (#c8102e). Beyaz bant: "ZENITH GRUP HOLDİNG CEO'SU EMİR ÖZDEMİR'İ TAŞIYAN UÇAKTAN HABER YOK".
   - Bantlar y≥1300'de. Ekranda saat yok.
   - Çerçeve ve tarama çizgileri spikerin bakışını diegetik kılar.
5. **koy_meydani** (§1'e ek): kumlu bagaj etiketi, düdüklü can yeleği, minderden fırlamış sünger, tepside kahve halkası.
6. **sozlesme:**
   - Kapak sayfası; B1'deki kâğıtla (#f8f5ee) ve mürekkeple (#1d2a44) aynı.
   - Logo: yıldızsız "Z" ve altın daire.
   - Metin: "ANLAŞMA TASLAĞI", "$50.000.000.000" (96 px). İmza alanları boş; karşı taraf "……… adına" (şirket uydurmadan). Kâğıtta kum ve su lekesi, zımba izi.
   - Yaşlının eli (#a8714a) ön koluyla birlikte görünür.
   - Buruşma: 6 ara morf.
   - Yanma: kâğıt ısıyla açılır, tutar 1,5 sn okunur, kara cephe (#1a1210) turuncu kenarla ilerler.
7. **bastir** (YENİ jest):
   - Sol avuç omuzda, sağ avuç göğüste.
   - Geçiş 0,6 sn easing; Emir -50°'den -90°'ye iner.

## 4. Süreklilik
- **Emir:**
  - Kıyafet: yırtık gömlek, kan 0,35, sargı, yalın ayak, kravat yok.
  - Saat: YENİ `saat` alanı, sol bilekte.
  - Yaprak: 2-16 arası alında; 17'de düşer.
- **Kadın:** tunik #d2b484, kolye, küpe, sağ bilekte bilezik (#c9a24a).
- **Yaşlı:** omuz örtüsü, kolye, sopa.

## 5. Riskler
- Yatan karakterin bakışını motor sıfırlıyor: uyanık Emir'e `bak` izni gerekli (yalnız göz).
- `dogrul` her zaman tam kalkıyor: YENİ `dogrulma` oranı ve geri düşüş gerekli.
- Yeni prop'lar ve `yeIsareti` jesti gerekli.
- Karakterde yerel ışık yok: çözüm fg katmanı.
- `zenith_resepsiyon` yeni kadro kaydı; yedek plan boş lobi.
- B1 sayfasında logo yoktu; logolu sayfa kapak, B1'deki iç sayfa olur.
- Altyazı bandı (y 1050-1260) TV bantları ve sözleşme tutarıyla çakışmamalı; kare denetimi 10, 29 ve 32'de.
- Kâğıt morfu ve jestler arasında ara kareler olmalı (B1'deki poz atlaması tekrarlanmasın).
- Kanal adının gerçek bir kanalla çakışmadığı denetlenmeli.
