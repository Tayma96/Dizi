# 7/24 · Bölüm 4: görüntü yönetmeni çekim planı (öneri, 22 Kasım 2026)

Kod ve JSON'a dokunulmadı. Bu belge kamera açılarını kullanıcıyla tartışmak için hazırlanmış bir öneridir. Replikler kullanıcınınkiler, metne yeni replik eklenmedi.
Kesinleşen kullanıcı kararları plana işlendi:
- Gerçek Sabri çıkıyor ve parmaklarında çikolata ambalajı var.
- Gözler anime şok tarzı.
- Önlük at kuyruğuna takılıyor.
- Kaçış: ilk "vallahi bastım" kasadan çıkışta, ikincisi karşıdan bel üstü takip çekimiyle, kapıda arkadan yakın çekim, baş dönerken kamerayla göz göze.
- "vallahi bastım vallahi bastım kaç kaç kaç kaç" tek, kesintisiz bir replik (~3 sn). Görüntü sese uyar, iki kesme sesin içinde yapılır.

Süreler tahmindir. Kesin zamanlamayı seslendirmeden sonra Whisper kelime zamanları belirler.

## 0. Coğrafya ve eksen (180° kuralı)
- **Kat planı:** Kapı önde solda. Kasa önde sağda. DEPO arkada sağda.
- **Üç görünüm:**
  - `kasa`: kapı tarafından kasaya bakar. Ece'nin kapıdan gördüğü budur. DEPO her zaman kadrajın **sağında** durur.
  - `kapi`: kasanın yanından kapıya bakar. DEPO kameranın **sol arkasında** kalır.
  - `genel`: içeriden ön cama bakar. DEPO kameranın arkasında kalır. Bu bölümde yalnız gerekirse kullanılır.
- **Ana eksen Ece ↔ DEPO:**
  - Kasa açısında Ece depoya bakarken gözü kadrajın sağına kayar.
  - Kapıdaki arkadan çekimde kamera ters yöne bakar. Bu yüzden Ece başını **sol omzunun üstünden** (kadrajın soluna) çevirir.
  - Kadrajda Ece sağ yarıda durur, bakış boşluğu solda kalır.
- **Süreklilik:**
  - Ece `ece_sivil`.
  - Önlük (turuncu) 8. çekime kadar giyili, sonra yok. Buruşturulmuş önlük kasanın arkasında yerde kalır.
  - At kuyruğu takıldıktan sonra saçta birkaç dağınık tutam bölüm sonuna kadar kalır.
  - B3'teki `tik: titre` bu bölümde **kaldırılır** (kullanıcı: titreme yok).
  - Saat 06:03. Kapıdan kasaya ıslak ayak izleri duruyor. Kepenk açık. Dışarısı şafak laciverdi ve yağmurlu.
  - Sabri B1'deki görünümüyle çıkar: gri hırka, kel, bıyık. Kadroda kasket yok. Bible "kasket" diyor, bkz. §4.

## 1. Renk ve ışık senaryosu
| Blok | Duygu | Işık / renk |
|---|---|---|
| Fısıltı, yalnız kalma, yutkunma (1-5) | soğuk korku | `look: soguk`, `karanlik` 0.15. Floresan üstten sert. Doygunluk düşük. Camda lacivert-mor şafak (sahte umut). |
| Önlük, söylenme (6-8) | öfke, komik boşalma | `look: normal`, karanlık yok. En parlak ve en doygun blok. |
| "ece", gözler, depo (8 sonu-11) | dehşet | Kapı çarpınca `turb` 0.7 (floresan titrer). Sonra `soguk` + `karanlik` 0.35, `pale` 0.9. Ses boşluğu. |
| Kaçış (12-13) | panik + komedi | `normal`, titreme yok. El kamerası sallantısı adımlarla eşzamanlı. |
| Kapı ve Sabri (14-19) | tekinsiz | `look: tekinsiz`, `karanlik` 0.25. Kapıdaki Ece'ye kapıdan soğuk mavi şafak ışığı gelir (saçta kenar ışığı). Ece döndükçe yüzü dükkânın beyaz floresanına girer. Sabri'nin yüzü sol yarıda aydınlık, sağ yarısı depo karanlığında (yarım gölge). Sabri'de `altIsik` **yok**: alt ışık "canavar" der, belirsizlik bozulur. |

Her çekimde üç hareket katmanı bulunur:
- Birincil: Ece'nin ya da Sabri'nin eylemi.
- İkincil: floresan titremesi, kapı kanatları, at kuyruğu.
- Ortam: cam ardında yağmur, toz zerreleri.

## 2. Çekim listesi (~45 sn = 41,8 sn bölüm + 3 sn bitiş kartı)
| # | Zaman | Set / görünüm | Ölçek · kadraj | Hareket / açı | Oyunculuk | Ses | Neden |
|---|---|---|---|---|---|---|---|
| 1 | 0.0-1.8 | `market_kapi` (B3'ün `yakin` işareti) | çok yakın iri724, B3'tekinden biraz daha sıkı | yavaş `yaklas`, `angle: alt`, `altIsik` | eğilmiş, soğuk bakış Ece'ye (kameranın hemen altına) | "Depodakine selam söyle." (B3 kaydının ilk yarısı) | B3'ün son anıyla açılış. Korkunç yüz ilk karenin kancası olur. Kare B3'tekinin aynısı değil. |
| 2 | 1.8-4.2 | `market_kasa` | orta Ece, kadrajın sol-ortasında. Sağda DEPO kapısı (aralık, karanlık). Sol kenarda adamın palto omzu, ön planda ve flu. | sabit | `korkmus`, nefesini tutmuş, kıpırtısız; "seçmiş"te `pale` 0.2 | "Bu gece seni seçmiş." | "Kamera Ece'ye döner." Dinleyenin yüzü. DEPO ilk karede ekseni kurar. |
| 3 | 4.2-6.2 | aynı | aynı kadraj | sabit | Palto omzu sola kayıp çıkar (silme). Ece yalnız gözleriyle adamı kapıya kadar izler, başı oynamaz. | ağır adımlar, kapı "ding-dong" | B3 şartnamesi "öyle gider" der. Ece'nin yalnız kaldığı kurulur. |
| 4 | 6.2-8.6 | `market_kapi` | geniş: kapı, saat 06:03, ıslak izler | sabit + toz | Kapı kanatları kapanır. Cam ardında adamın silueti yağmurda sola yürüyüp kaybolur. | Yağmur kapanan kapıyla kesilir, yalnız floresan vızıltısı kalır. | Geniş çekim yalnızlığı gösterir. Şafak "sabah oldu" umudunu kurar. |
| 5 | 8.6-11.6 | `market_kasa` | yakın Ece (baş, boyun, omuz; boyun kadrajda) | yutkunma boyunca sabit, son 0.6 sn hafif `yaklas` | **Yutkunma:** dudaklar sıkılır, çene içeri çekilir, gırtlak yukarı-aşağı, omuzlar kalkıp iner. Ardından uzun bir nefes verir. Titreme yok. | yakın mikrofonla yutkunma, nefes | Kullanıcı: belirgin ve derin. Bu an tek başına bir çekim olur, oldu bittiye gelmez. |
| 6 | 11.6-12.6 | `market_kasa` | orta | sabit | `korkmus` → `ofkeli`: kaşlar çatılır, çene sıkılır, eller boyun askısına gider. | burundan sert nefes | Değer değişimi korkudan öfkeye geçer. |
| 7 | 12.6-16.0 | `market_kasa` | orta, baş üstünde boşluk (kadraj `cy` yukarı, at kuyruğu kadrajda) | sabit | **Önlük takılır:** askı başın üstünden geçerken at kuyruğuna takılır. Önlük yüzünün önünde asılı kalır. İki sert çekiş (her birinde baş öne gider, at kuyruğu yukarı gerilir). Üçüncüde kurtulur, at kuyruğu yaylanıp sallanır. | kumaş hışırtısı, efor sesleri (replik değil) | Onaylı doğaçlama. B2 P1'deki giyme animasyonunun aynası. |
| 8 | 16.0-19.2 | `market_kasa` | `shots[]`: 0-1.6 orta (iki eliyle buruşturur), 1.6-2.8 yakın `angle: alt` (topu yere çarpar), 2.8-3.2 orta-geniş (Ece sol 1/3'te, DEPO kapısı sağda net) | ikinci bölümde `yaklas` | `ofkeli`, sitemli. "marketine"de kol kalkar ve iner. "deee" uzarken DEPO kapısı içe savrulup duvara çarpar, ağzı "e"de donar. | "sıçarım işinedeee marketinedeee". Kapı çarpması son "e"yi keser. | Komik boşalma. Korku yarıda keser. Ön planda yüz, arkada kapı: korkunun klasik kompozisyonu. |
| 9 | 19.2-20.4 | `market_kasa` | çok yakın Ece | 0.15 sn `sarsinti`, sonra sabit | Beti benzi atar (`pale` 0.5 sn'de 0'dan 0.9'a). **Anime şok gözleri** 0.12 sn'de açılır, bebek nokta olur. Ağız yarı açık, kafa kıpırtısız. | "ece" (kalın, etiket gizli). Floresan vızıltısı bu kelimeyle kesilir. | Şok: çok yakın + sarsıntı. |
| 10 | 20.4-24.0 | aynı | çok yakın göz bandı (z≈3), gözler üst 1/3'te | çok yavaş `yaklas` | Yalnız gözler hareket eder: nokta bebekler 2.4 sn'de kadrajın sağına, depoya kayar. Kırpma yok. Alından tek ter damlası (`sweat`). | ses boşluğu: tiz çınlama + tek kalp atışı | Kullanıcı: yalnız gözleriyle, yavaşça. Büyük göz akının içindeki nokta bakış yönünü okutur. |
| 11 | 24.0-25.2 | ekleme: Ece'nin gözünden DEPO | açık kapı, içi zifiri, eşikte hiçbir şey | yavaş `yaklas` | yok | uzak damla sesi | İzleyici Ece'nin gördüğünü görür. Boşluk korkuyu taşır, ekseni doğrular. |
| 12 | 25.2-26.05 | `market_kasa` (bankonun solunda kasa ağzı açık) | orta-geniş | takılma anında 0.1 sn `sarsinti` | **Ses başladığı an** Ece kasa ağzından fırlar. "bastım"da arkadaki bacağı banko köşesine takılır: banko sarsılır, sakız standı devrilir. Öne, kameraya doğru savrulur, sol eli bankoya çarpar. Düşmez, savrulma 13'e taşar. | "**vallahi bastım** vallahi bastım kaç kaç kaç kaç" tek, kesintisiz kayıt başlar | Kullanıcı kararı 1. Takılma sesi kesmeden akışın içinde olur. |
| ✂ | 26.05 | **Kesme 1: ikinci "vallahi"nin ilk hecesinde** (Whisper kelime başlangıcı) | | | | | Ses sürer, kesme kelimeye biner, atlama hissedilmez. |
| 13 | 26.05-27.9 | `market_kasa` **takip** (yeni) | orta, bel üstü, Ece karşıdan. Yüz üst 1/3'te. Arkada boş kasa ve açık DEPO kapısı (sağ). | kamera Ece'nin önünde geri geri gider (takip), adımlarla sallanır | İlk adım sendelemenin sonudur (omuz düşer, kol savrulur, toparlar). Sonra ~0.3 sn'lik hızlı adımlar: "vallahi bastım"da 2 adım, kaç 1-2-3'te birer ayak vuruşu. Yüzde korku, panik ve komedi bir arada. Bakış lensin hemen yanından kapıya, göz teması finale saklanır. **Öneri:** son 0.5 sn'de en arkadaki DEPO eşiğinde flu koyu siluet (Soru 2). | "…**vallahi bastım kaç kaç kaç**…" | Kullanıcı kararı 2. Koşu kaçların ritmine oturur. |
| ✂ | 27.9 | **Kesme 2: dördüncü "kaç"ın başında** | | | | | Son "kaç" = kapıya varış (metin madde 8). |
| 14 | 27.9-30.6 | `market_kapi` arka planı + **Ece arkadan** (yeni ekleme, §3.5) | yakın, kamera Ece'nin arkasında kapıya bakar. Ece kadrajın sağ yarısında. Ensesi, at kuyruğu ve omuzları görünür. Önünde cam kapı, şafak, yağmur. | sabit | Son "kaç"la ayak yere basar, gövde frenler. At kuyruğu öne savrulup geri gelir. Otomatik kapı **önünde açılmaya başlar**. 0.3 sn sonra Sabri konuşur, Ece adım ortasında donar. | "…**kaç**" (replik biter) → 0.3 sn yağmur sesi içeri dolar → Sabri: "Nereye gidiyosun kızım." (etiket gizli) | Kullanıcı kararı 3. Kurtuluş tam önünde açılırken donması gerilimi en üste çıkarır. |
| 15 | 30.6-33.4 | aynı | yakından çok yakına doğru | çok yavaş `yaklas` | **Baş dönüşü:** arka → profil → 3/4 → göz göze. Önce gözler gider, baş 0.3 sn arkadan gelir. Profilde 0.2 sn ürkek bir duraklama. Omuzlar son anda en fazla 15° takip eder. Yüz döndükçe floresan ışığına girer. Sonunda doğrudan lense bakar. | yalnız nefes + kalp atışı | Kullanıcı kararı 4. Kamera artık Sabri'nin gözüdür. |
| 16 | 33.4-36.2 | `market_kasa` (Ece'nin gözünden, kadrajda Ece yok) | orta Sabri, DEPO eşiğinde. Kadraj `cx` sağa kaydırılmış, boş kasa ön planda. | sabit, 0.5 sn sonra hafif `yaklas` | Karanlıktan bir adım çıkar ve durur. Gri hırka, yüz nötr, **lense bakar** (göz göze karşılığı). Sağ elinde mor-sarı ambalaj. | adım, hafif gıcırtı | İfşa. Karşılıklı lense bakış POV alışverişini tamamlar. |
| 17 | 36.2-38.2 | ekleme | çok yakın: Sabri'nin parmakları boş ambalajı çevirir | yavaş `yaklas` | yok | ambalaj hışırtısı | Kullanıcı kararı 2. Orta çekimde ambalaj ~50 px kalır, telefonda okunmaz. Ekleme şart. |
| 18 | 38.2-39.8 | 15'in son karesi | yakın Ece (göz göze pozu) | sabit | Gözler ambalajdan yüze çıkar. Dudak aralanır, ses çıkmaz. `pale` 0.6. | nefes kesilir | Dinleyenin yüzü: tanıma. |
| 19 | 39.8-41.8 | `market_kasa` | yakın Sabri | `yaklas`, `angle: alt` hafif | Baş 5° yana eğilir, kıpırtısız bakış. | yok | Güç. Çözümden bir vuruş önce kesilir. `fade: cikis`. |
| son | 41.8-44.8 | bitiş kartı | | | | | |

**Ölçek sırası:** çok yakın · orta · (orta) · geniş · yakın · orta · orta · orta→yakın→orta-geniş · çok yakın · çok yakın · ekleme · orta-geniş · orta takip · yakın · yakın→ · orta · ekleme · yakın · yakın.
- Aynı ölçek arka arkaya en fazla 3 kez geliyor.
- Görüntü her 1-3.6 sn'de değişiyor.
- Uzun tutulan 10 ve 15 numaralı çekimlerde de sürekli bir mikro hareket var.

**Kaçış repliği: ses ve kesmeler**
- Replik tek ElevenLabs kaydıdır ve **hiç bölünmez** (tek bir meme).
- Süresi ~2.5-3.5 sn. Plan 3.0 sn üzerine kurulu: 12'de 0.85 sn, 13'te 1.85 sn, 14'te 0.3 sn.
- İki kesme Whisper kelime başlangıçlarına bağlanır:
  - Kesme 1: ikinci "vallahi".
  - Kesme 2: dördüncü "kaç".
- Adım vuruşları "vallahi bastım" hecelerine ve ilk üç "kaç"a oturur. Dördüncü "kaç" kapıdaki son basıştır.
- **Motor durumu (Episode.tsx ve timeline.ts'e bakıldı):**
  - Replik sesi aynı sahne içinde vuruş bitiminden 6 sn'ye kadar çalmaya devam ediyor.
  - Negatif `gapAfter` vuruşu kısaltıyor.
  - Yani ses zaten kesintisiz akabilir, yeter ki 12, 13 ve 14 **aynı sahnede** olsun.
- **Bunun için gerekenler:**
  - Tek sahne: `market_kasa`.
  - 12: `line` vuruşu, `gapAfter` ≈ −(replik süresi − 0.85).
  - 13: `action` vuruşu, vuruş düzeyinde yeni `takip: true` bayrağı. KasaBG'yi katmanlı takip moduna geçirir, ayrı set gerekmez.
  - 14: `insert` vuruşu, `kapi_arka`.
  - Vuruş süreleri Whisper kelime zamanlarından hesaplanır.
- **Eksik olan tek şey altyazı:** `KaraokeSubtitle` vuruşun Sequence'i içinde kaldığı için kesme 1'de kırpılıyor. Gereken küçük motor değişikliği:
  - `line` vuruşunda `tasma: true` alanı.
  - Bu alan varken altyazı vuruş süresiyle değil ses süresiyle çizilir.
  - Altyazı sonraki vuruşların (13, 14) üstünde kesintisiz sürer.
- Fısıltı (1-2) farklı setlerde (kapi → kasa) olduğu için bu yöntem işlemez. B3 kaydı kelime sınırından iki dosyaya kesilir (yeni kredi gerekmez). Fısıltıda kesme zaten kelime arasına düşüyor.

## 3. Yeni görsel varlıklar (nasıl çizilecek)
**P0 (bölüm bunlarsız olmaz)**
1. **Anime şok gözleri.** `face.tsx` Eye'a `sokGoz` (0-1) eklenir. `CharState` alanı: `gozSok`.
   - Göz akı neredeyse daire olur (`open` ≈1.4, alt kapak aşağı).
   - İris 11.5'ten ~3.5'e, bebek 2'ye iner: ince halkalı bir nokta.
   - Parlama noktaları kaldırılır. "Ölü" his bundan gelir.
   - Göz kapağı çizgisi incelir.
   - Yönün okunması için `lookX` menzili 10'dan 15'e çıkar: nokta göz akının kenarına kadar gidebilir.
   - Açılış 0.12 sn'de, 1 karelik taşmayla.
   - İsteğe bağlı: alında 3-4 ince mavi dikey gölge çizgisi.
   - Kontrol karesi: `Duygular`.
2. **Yutkunma.** `CharState.yutkun: <saniye>`, tek sefer oynar, ~0.6 sn.
   - Dudaklar sıkı (`tight`), çene 2-3° içeri.
   - Boyunda gırtlak çıkıntısı (ince bir yay çizgisi) 10 px yukarı çıkıp iner.
   - Omuzlar 6 px kalkıp iner. Gözler bir an aşağı bakıp geri gelir.
   - Kontrol karesi: `Jestler`.
3. **Önlüğü çıkarma ve at kuyruğuna takılma.** `onluk: "cikar"` eklenir: mevcut `giy` animasyonunun tersi, arada bir takılma evresi var.
   - 0-0.25: eller askıda.
   - 0.25-0.5: askı başın üstüne çıkar.
   - 0.5-1.7: askı at kuyruğunda kalır, at kuyruğu askıyla tepenin üstüne doğru gerilir (önden görünür). Önlük yüzün önünde sarkar. İki çekiş, her birinde baş öne 4°.
   - 1.7-2.0: askı kurtulur, at kuyruğu yay gibi geri sallanır.
   - Sonrasında kalıcı `sacDagin` durumu: 3-4 serbest tel, at kuyruğu hafif yamuk.
4. **Önlük topu ve yere atma.**
   - Prop `onluk_top`: `kagit_top` biçimi, turuncu kumaş (#e8701a / #b8520e), kıvrım çizgileri ve sarkan bir askı ucu.
   - Jest `yereAt`: sağ kol baş hizasına kalkar, hızla aşağı iner, top kadrajın altından çıkar.
5. **Ece arkadan + baş dönüşü (14, 15, 18).** Ayrı bir ekleme bileşeni olarak yapılır: `kapi_arka`, Inserts10 içinde. Rig'e dokunulmaz.
   - **Arka plan:** `Market724BG view="kapi"` hafif bulanık çizilir. Kapı kanatlarının açılması (`doorOpen`) bileşenin içinden sürülür.
   - **Gövde (arkadan):**
     - Kazağın sırtı (#c8902a), omuz yuvarlakları, sırt dikişi.
     - Arkadan yaka, ense.
     - Önlük yok (atıldı). Kullanıcıya bkz. §4.
   - **Baş, silindir izdüşümüyle:**
     - Kafa bir silindir/elipsoit gibi ele alınır. Her yüz öğesinin bir boylamı var: göz ±25°, burun 0°, kulak ±90°, at kuyruğu kökü 180°.
     - Ekrandaki konum: `x = cx + R·sin(boylam + dönüş)`. Öğe `cos > 0` iken görünür, genişliği `cos` ile daralır. Gözler için mevcut Eye'ın `squeeze` parametresi kullanılır.
     - Profilde (90°) kontura burun, dudak ve çene çıkıntısı karışır. Ağırlığı `sin(açı)` ile verilir: 90°'de tam, 0° ve 180°'de sıfır.
     - Saç kütlesi arkada tam örter. Dönüşle birlikte saç çizgisi ve yanak öne doğru açılır. Sivilce sağ yanakta kalır (süreklilik).
     - At kuyruğu kökü dönüşün tersine, kadrajın sağına kayar. Kök ön yarıya geçince başın arkasına çizilir. Yay gecikmesiyle sallanır.
   - **Açılar:** 180° → 135° (kulak + yanak çizgisi + kirpik ucu) → 90° profil → 45° → ~10° (göz göze).
     - Gözler baştan 0.3 sn önde gider.
     - Ece kadrajın sağında, başını kadrajın soluna (sol omzunun üstünden) çevirir.
   - **Işık:** saç konturunda mavi şafak kenar ışığı (#8aa8d8). Yüz kameraya döndükçe sıcak-beyaz floresan alır.
   - **Uzun vade (P1):** aynı başı ve sırt gövdesini rig'e `yon: "arka"` olarak taşımak. Sırttan görünüş eksikliği B3'te de, burada da sorun çıkardı.
6. **Bel üstü koşu (13).** Yeni `body: "kos"`, yerinde koşu (`yuru` gibi).
   - **Zamanlama:** adım periyodu ~0.3 sn (hızlı). Takipte ~6 adım: ilk adım sendeleme sonu, sonra "vallahi bastım" heceleri ve ilk üç "kaç". Vuruş anları Whisper zamanlarından alınır.
   - **Gövde:** her adımda dikey sıçrama 14 px (basışta aşağı). Omuzlar her adımda ±5° yatar. Kameraya eğilmeyi göstermek için baş 4 px aşağıda, yüz %3 büyük.
   - **Kollar:** dirsek 90° bükülü, bacaklarla ters fazda pompalar. Öne gelen el göğüs hizasına çıkar ve %10 büyür (kameraya yakın). Geriye giden el kalçaya iner, küçülür, gövdenin arkasına kısmen gizlenir. Mevcut `kol` açıları her karede sinüsle sürülür.
   - **Baş:** sıçramayı 2 kare gecikmeyle izler, ±3° yalpalar.
   - **Saç:** at kuyruğu her adımda başın bir sağından bir solundan görünür (gövdeyle ters faz, yaylı). Dağınık teller ve kakül zıplar.
   - **Yüz:** `dehset` kaşları (yukarıda, titrek), büyük ağız dudak senkronu (`amp` yüksek), gözler büyük ama normal bebekli. Fırlayan iki ter damlası komediyi taşır.
   - **Arka plan (takip):** yeni `MarketView "kasa_takip"`. `KasaBG` üç derinlik katmanına ayrılır:
     - Uzak katman (arka duvar, sigara dolabı, DEPO): ölçek 1.12 → 1.00.
     - Orta katman (banko, yazar kasa): ölçek 1.35 → 1.00, kadrajın sağ altına doğru kayar.
     - Yakın katman (ekmek reyonu, sakız standı kenarı): kadraj kenarlarından hızla dışarı akar, hafif hareket bulanıklığıyla.
     - Kamera geri gittiği için arka plan uzaklaşır (dolly-out), Ece aynı boyda kalır.
     - Her ayak vuruşunda 3-6 px el kamerası sallantısı.
     - İşaret: yaklaşık (540, 2650, 2300), bel kadraj altında. Kontrol karesinde ayarlanır.
     - Son 0.5 sn için (Soru 2A): DEPO eşiğinde bulanık koyu siluet.
7. **Takılıp sendeleme (12).**
   - `KasaFG`'ye solda bir "kasa ağzı" açıklığı eklenir (banko x≈200'de biter, köşe kalınlaşır).
   - Yeni `body: "sendele"`, tek sefer, 0.5 sn (sesle sıkışık, kalanı 13'ün ilk adımında toparlanır): arkadaki bacak geride kalır, gövde öne ve kameraya doğru savrulur (baş ve kollar %8 büyür). Kollar savrulur, sol el banko tablasına çarpıp tutunur, sonra doğrulur.
   - Bankoda 6 px sarsıntı olur. Sakız standındaki paketler sırayla devrilir. Kart makinesi zıplar.
8. **DEPO kapısının açılması ve Sabri'nin çıkışı.**
   - `KasaBG`'ye `depoAcik` (0-1) ve vuruş içi `at` eklenir. Aralıktaki kanat yamuğu genişler, kanat duvara çarpınca 2 kare geri teper. İçerisi zifiri kalır.
   - Yeni işaretler: `depo_esik` (≈1000, 1345, 900) ve `depo_on` (≈880, 1345, 900). Aradaki derinlikli yürüme kısa tutulur (`yuruSure` 0.8).
   - Sabri'ye sağdan sola yarım gölge katmanı (yeni `yarimGolge` örtüsü).
9. **Çikolata ambalajı.**
   - Prop `ambalaj`: B2 P1'deki `cikolata` renkleri (mor #5a2a8a, sarı bant #f2c21a, gümüş kıvrım). Ucu yırtık, boş, yassı ve buruşuk; içi gümüş folyo. Orta çekimde 1.3 kat büyük çizilir, baş ve işaret parmağı arasında tutulur.
   - Ekleme `ambalaj_parmak`: yaşlı el (eklem çizgileri, Sabri'nin ten rengi #d8a47c) ve gri hırka manşeti (#6a6a66). Parmaklar ambalajı 20° çevirir, folyo ışığı yakalar.
10. **Ön plan palto omzu (2-3).** Kasa görünümünde sol kenarda yeni ön plan öğesi: B3 paltosu (#2a241e) rengindeki koyu kütle, Gauss bulanıklığıyla. Sözde eğilme sırasında 0.4 sn'de içeri girer, çıkışta sola kayarak siler.

**P1 (güçlendirir)**
11. Depo POV eklemesi `depo_acik` (11 numaralı çekim). `depo_el`'in tamamen açık varyantı: kanat duvarda, içi zifiri, zeminde floresanın ince yansıması.
12. Şafak gökyüzü: `Sokak`'a `safak` tonu (üstte #1a2244'ten #3a2a5a'ya), `kapi` ve `kasa` görünümlerinde.
13. Yağmurda uzaklaşan siluet (4 numaralı çekim): cam ardında, yön göstermeyen koyu figür, sola kayıp söner.

Her varlık için kontrol kareleri alınır:
- `Duygular`: göz, yutkunma.
- `Jestler`: yereAt, sendele, koşu döngüsü.
- `Kadro`: Sabri, ambalaj.
- `Mekanlar`: kasa depoAcik, kasa_takip, kasa ağzı.
- Yeni ekleme kareleri: `kapi_arka` için 180/135/90/45/10° kareleri ayrı ayrı.

## 4. Görsel riskler
- **Önlük bağcığı yok.** Koordinatör arkadan görünüşte "önlüğün sırttaki bağcıkları"nı istedi. Ama metne göre Ece önlüğü kaçmadan önce çıkarıp atıyor. Arkadan görünüşte kazak, at kuyruğu ve dağınık teller olacak. Bağcık istenirse önlüğün sırasının değişmesi gerekir; bu bir kullanıcı kararıdır.
- **Anime gözler komik okunabilir.** 9-10'da korku dağılırsa amaç kaçar. Bunu dengeleyenler: ses boşluğu, kıpırtısız kafa, parlama noktalarının olmaması, soluk ten. Anime göz yalnız bir kez kullanılmalı (Soru 3).
- **Altyazı bandı (y 1050-1260):**
  - 10'da altyazı yok.
  - 13'te yüz y≈550-800 aralığında, altyazı göğse düşer.
  - 14-15'te yüz/ense y≈600-950, altyazı sorun çıkarmaz.
  - 8'deki alt açıda yüz yukarıda tutulmalı.
- **Kapıdaki baş dönüşü yeni çizim tekniği.** Profil ara karesi rig yüzünden kopuk görünebilir. Önce beş açılık kontrol kareleri alınır, kullanıcıya tek sahnelik örnek gösterilir (CLAUDE.md onay kuralı).
- **Koşuda gövde kayıyor gibi okunabilir.** Ölçek Ece'de sabit, arka planda değişken olmalı. Sallantı mutlaka adımlarla eşzamanlı olmalı.
- **Sendelemede bacak görünmez.** Kasa görünümünde bacaklar kadraj dışında kalıyor. Okunurluğu banko sarsıntısı, sakız standının devrilmesi ve elle tutunma taşır.
- **Ses ve görüntü senkronu.** Kapı çarpması son "e"yi kesmeli, adımlar "kaç"lara oturmalı. Her ikisi de Whisper zamanlarına bağlanır.
- **Kaçış çok sıkışık.** 3 sn içinde iki kesme ve bir takılma var. Takılma 0.4 sn'de okunmazsa önce banko sarsıntısı ve sesi büyütülür, kesme 1 kaydırılmaz. Ses 3.5 sn'yi aşarsa ek süre takibe verilir, kesme 2 yine dördüncü "kaç"ta kalır.
- **Altyazı kırpılması.** `tasma` olmadan kaçış repliğinin altyazısı kesme 1'de kaybolur. Ses ise kesintisiz akar. Kodlamada ilk iş bu olmalı.
- **Kasket.** Bible "kasket" diyor, kadroda ve B1 görüntüsünde kasket yok. Görsel süreklilik için B1 görünümü korunur.

## 5. Açık kararlar (kullanıcıya)
1. **Açılış (ilk 4 sn):**
   - A) İri adamın yüzünde "Depodakine selam söyle", ardından kesmeyle Ece'nin yüzünde "Bu gece seni seçmiş". **(önerim)**
   - B) Tamamı Ece'nin yüzünde, adam yalnız flu omuz olarak görünür.
   - C) B3'ün son karesi aynen.
   - D) Siyah ekranda fısıltı, ilk görüntü yutkunma.
2. **Takip çekiminde arka plan (son "kaç"):**
   - A) Son 0.5 sn'de DEPO eşiğinde flu, yüzü seçilmeyen bir siluet belirir; izleyici Ece'den önce görür. **(önerim)**
   - B) Yalnız DEPO kapısı biraz daha açılır.
   - C) Hiçbir şey olmaz, ifşa tamamen sese ve ters açıya kalır.
3. **Göz göze anında Ece'nin gözü:**
   - A) Normal şok gözleri; anime gözler yalnız "ece"de kalır. **(önerim)**
   - B) Anime gözler ikinci kez.
   - C) Gözler dolar (`tears` 0.3).
   - D) Göz göze geldiği an kesme, Ece'nin yüzünde kalınmaz.
4. **Son kare:**
   - A) Sabri yakın plan, hafif alt açı, ifadesiz ve kıpırtısız, sonra siyah. **(önerim)**
   - B) Ambalaj eklemesiyle bitir.
   - C) Ece'nin göz göze yüzüyle bitir.
   - D) Sabri belli belirsiz gülümser, sonra siyah.

Not: Bölüm temel planla ~45 sn sürüyor. 50 sn'den uzun istenirse senaristin önerdiği "saate bakış" (+3 sn) ya da "anı flaşları" (+2 sn) eklenebilir. Bunlar replik/olay eklediği için ayrı kullanıcı onayı ister.
