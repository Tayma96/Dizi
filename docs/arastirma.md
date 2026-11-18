# Dikey Animasyon Dizisi Üretimi: Araştırma ve Uygulama Rehberi

> Kapsam: 9:16 dikey, 4-5 dakikalık bölümler (60-90 sn'lik parçalara bölünebilir), Remotion/React ile kodla üretilen düz 2D vektör karakterler, Türkçe iç ses ve altyazı, birinci şahıs aile draması.
> Araştırma tarihi: Kasım 2026. Bu belge senaryo içermez; yalnızca yöntem ve ilkeleri toplar.

## Etiketler

- **[DOĞRULANDI]**: Birincil ya da resmî kaynakta okundu (platform yardım sayfası, model kartı, lisans metni, hakemli makale özeti).
- **[İKİNCİL]**: Birden fazla ikincil kaynak aynı şeyi söylüyor ama birincil kaynak görülmedi.
- **[DOĞRULANAMADI]**: Rakam ya da iddia, yöntemi belirsiz bir kaynakta geçiyor, ya da kaynaklar birbiriyle çelişiyor. Kural gibi değil, başlangıç varsayımı gibi kullanın.
- **[ÖNERİ]**: Bulgulardan çıkardığımız üretim kararı. Kaynakta doğrudan geçmez.

---

## 0. Önce bilinmesi gerekenler

1. **Platform süre sınırları.** YouTube Shorts 15 Ekim 2024'ten beri 3 dakikaya kadar çıkıyor [DOĞRULANDI] (https://www.tubefilter.com/2024/10/03/youtube-shorts-three-minutes-max-length-redesign-trends-templates/). Instagram Reels Ocak 2025'te 90 saniyeden 3 dakikaya çıktı [DOĞRULANDI, haber kaynağı] (https://www.socialmediatoday.com/news/instagram-officially-expands-reels-length-3-minutes/737766/). TikTok çok daha uzun yüklemeye izin veriyor. **Sonuç:** 4-5 dakikalık bölüm Shorts ve Reels'e tek parça olarak sığmaz. Ya bölümü parçalara bölün (ör. 2 × 2:30 ya da 3 × 1:30), ya da tam bölümü YouTube'a normal video, TikTok'a tek parça olarak koyun. [ÖNERİ]
2. **TikTok gelir programı (Creator Rewards) 1 dakikadan uzun videoları şart koşuyor** [İKİNCİL] (https://blog.nuelink.com/tiktok-creator-rewards-program/, https://manychat.com/blog/tiktok-creator-rewards-program/). Bir kaynağa göre "Series" (ücretli dizi) içindeki videolar bu programa dahil değil [DOĞRULANAMADI]. Parçaları 60 saniyenin üstünde tutmak bu yüzden de mantıklı.
3. **Referans hesap "oadambendegilim".** Web aramalarında bu hesaba dair herhangi bir kayıt bulunamadı (Instagram/TikTok içerikleri arama motorlarında zayıf indeksleniyor). 2M izlenme rakamı ve formatı **bağımsız olarak doğrulanamadı** [DOĞRULANAMADI]. Ekibin hesabı elle incelemesi önerilir. Aşağıdaki "Referans analizi şablonu" (Bölüm 7c) bunun için var.

---

## 1. İzleyiciyi ekranda tutma (retention) ve algoritma sinyalleri

### 1a. Temel ilkeler

- **Akışta ilk karar: izlemek mi, kaydırmak mı?** YouTube Shorts analizlerinde "Shown in feed" ve "How many chose to view" ölçümleri var. İkincisi, Short'un akışta gösterildiği durumların yüzde kaçında izlendiğini, yüzde kaçında kaydırıldığını gösteriyor [DOĞRULANDI: YouTube Yardım üzerinden aktaran] (https://subscribr.ai/p/youtube-shorts-algorithm-explained). Bu oranın sıralamada tam olarak nasıl tartıldığını YouTube açıklamıyor.
- **Instagram'ın açıkladığı üç ana sinyal** (Adam Mosseri, Ocak 2025): izlenme süresi, erişim başına beğeni, erişim başına gönderim (DM ile paylaşım) [DOĞRULANDI, Mosseri'nin sözlerini aktaran haber] (https://www.socialmediatoday.com/news/instagram-shares-algorithm-2025/738034/). Takipçi olmayanlara ulaşmada gönderimin biraz daha ağır bastığı belirtiliyor [İKİNCİL] (https://www.lindseygamble.com/blog/unpacking-instagrams-focus-on-sends-per-reach-a-timeline-why-it-matters-and-tips-for-creators-brands). "DM paylaşımı beğeniden 3-5 kat değerli" gibi rakamların birincil kaynağı yok [DOĞRULANAMADI].
- **TikTok resmî açıklaması:** öneriler kullanıcı etkileşimi (beğeni, paylaşım, yorum, takip), video bilgisi (açıklama, ses, hashtag) ve cihaz/hesap ayarlarına dayanıyor. Güçlü sinyal örneği olarak "kullanıcının uzun bir videoyu baştan sona izlemesi" veriliyor. Takipçi sayısı doğrudan bir faktör değil [DOĞRULANDI] (https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you).
- **Tekrar izleme (loop).** Yaygın olarak olumlu sinyal sayılıyor ama ağırlığını gösteren resmî bir belge bulunamadı [DOĞRULANAMADI] (https://subscribr.ai/p/youtube-shorts-algorithm-explained). Shorts'ta ortalama izlenme yüzdesinin %100'ü geçmesi tekrar izlemeyi gösterir. Bu bir raporlama gözlemi, sıralama formülü değil.
- **YouTube "Key moments" raporu (uzun video):** [DOĞRULANDI] (https://support.google.com/youtube/answer/9314415?hl=en)
  - *Intro*: İlk 30 saniyeden sonra izlemeye devam edenlerin yüzdesi. Yüksek olması, açılışın başlık ve küçük resmin verdiği sözü tuttuğu anlamına gelebilir.
  - *Top moments*: Neredeyse kimsenin bırakmadığı anlar.
  - *Spikes*: Tekrar izlenen ya da paylaşılan anlar. Ama "içerik anlaşılmadığı için geri sarıldı" anlamına da gelebilir.
  - *Dips*: Atlanan ya da izlemenin bırakıldığı anlar.
  - Bu rapor yalnızca en az 60 saniyelik ve en az 100 izlenmeli videolarda çıkıyor.
- **Merak boşluğu (curiosity gap).** Loewenstein (1994), merakı "bilgide algılanan bir boşluğun yarattığı yoksunluk" olarak tanımlar. Boşluğun kapatılabilir görünmesi ve izleyicinin biraz ön bilgisinin olması gerekir. Cevaba yaklaştıkça merak artar [İKİNCİL] (https://concepts.dsebastien.net/concept/information-gap-theory/, makale: Psychological Bulletin 116(1), 1994).
- **Açık döngü (open loop) / Zeigarnik.** Yarım kalan işin akılda kalması fikri (Zeigarnik, 1927) içerik üretiminde "açık döngü" olarak kullanılıyor. Loewenstein ile Zeigarnik'i birlikte test eden bir çalışma bulunamadı. Bu birleşik çerçeve pratisyen yorumu [İKİNCİL] (https://blog.autonolab.com/blog/2025-08-22-open-loops-and-curiosity-gaps-the-psychology-of-binge-watching/). Uyarı: Aynı anda çok fazla açık döngü kafa karışıklığı yaratır.
- **Çekim süresi bağlamı.** Cutting ve arkadaşlarının 2010 çalışmasına göre Hollywood filmlerinde ortalama çekim süresi 1960'larda 8-10 saniyeydi, 2005'e gelindiğinde 3-4 saniyeye düştü [İKİNCİL] (https://www.davidbordwell.net/blog/2011/06/09/cognitive-scientists-1-screenplay-gurus-0/). Dikey sosyal video için yayımlanmış güvenilir bir ortalama çekim süresi verisi bulunamadı.

### 1b. Somut kurallar ve sayılar

| Kural | Değer | Durum |
|---|---|---|
| İlk karenin işi | Kaydırma kararından önce "neden izlemeliyim" sorusunu cevaplamak | [ÖNERİ]. "İlk 2-3 saniye" kuralı çok yaygın ama birincil veri yok [DOĞRULANAMADI] (https://subscribr.ai/p/youtube-shorts-algorithm-explained) |
| İlk 30 sn | Uzun videoda Intro metriği bu aralığı ölçer. İlk 30 sn'de izleyicilerin ≥%50'sinin kalması "ortalamanın üstü" sayılıyor | Metrik [DOĞRULANDI]; %50 eşiği [İKİNCİL] (https://subscribr.ai/p/youtube-key-moments-audience-retention) |
| Mikro kanca sıklığı | Her 15-30 sn'de yeni bilgi, soru ya da tersine dönüş | [ÖNERİ]. Kaynaklarda "her 15 sn", "her dakika" gibi çelişen rakamlar var [DOĞRULANAMADI] (https://theworldofchinese.com/2025/09/welcome-to-the-micro-drama-nation-china) |
| Görsel değişim sıklığı | Ortalama 2-4 sn'de bir çekim değişimi ya da belirgin hareket (zoom, yeni çekim ölçeği, metin girişi) | [ÖNERİ]. Hollywood'un 3-4 sn ortalamasından türetildi |
| Bölüm sonu | Her bölüm (ve her 60-90 sn'lik parça) çözümsüz bir soruyla kapanır | Mikro drama kaynaklarında ortak nokta [İKİNCİL] (https://nogood.io/blog/micro-drama/, https://invideo.io/blog/ai-micro-drama-hooks-cliffhangers/) |
| Paylaşım tetikleyicisi | Her bölümde en az bir "bunu annemle/eşimle paylaşmalıyım" anı (özdeşlik, haksızlık, itiraf) | [ÖNERİ]. Instagram'ın gönderim sinyaline dayanıyor |
| Yorum tetikleyicisi | Ahlaki ikilem ya da "sen olsan ne yapardın" anı | [ÖNERİ] |

**Pattern interrupt (örüntü kırma):** Akademik tanımı olan bir terim değil, pazarlama dilinden geliyor. Ritim tekdüzeleştiğinde araya beklenmedik bir şey koymak demek: ses kesilmesi, renk değişimi, ani yakın plan, iç sesin doğrudan seyirciye dönmesi. Etkisini ölçen bir çalışma bulunamadı [DOĞRULANAMADI]. Kendi retention grafiklerinizdeki "dip" noktalarına koyarak test edin.

### 1c. Üretimimize uygulama (kontrol listesi)

- [ ] İlk kare boş/siyah değil. Karakterin yüzü + iç ses altyazısıyla bir soru ya da çatışma cümlesi ilk saniyede ekranda. [ÖNERİ]
- [ ] Bölümün ilk 30 sn'si, başlıkta ve kapakta verilen sözü tutuyor (YouTube Intro metriği).
- [ ] Senaryo zaman çizelgesinde her 15-30 sn'ye bir "yeni bilgi / soru / tersine dönüş" işaretlendi.
- [ ] Her 60-90 sn'lik parça kendi kancasıyla açılıp kendi mini cliffhanger'ıyla kapanıyor (parçalar bağımsız yayınlanabilsin).
- [ ] Yayından 2-3 gün sonra YouTube Key Moments / Shorts retention grafiği okunuyor, "dip" anları bir sonraki bölümün yazım notlarına ekleniyor. Çin mikro drama stüdyoları da izleyicinin bıraktığı gerilim noktalarını veriye bakarak yeniden yazıyor [İKİNCİL] (https://technode.com/2025/10/01/fast-paced-life-fuels-the-rise-of-short-dramas-as-a-new-symbol-of-chinese-entertainment/).
- [ ] Spike anları da kontrol ediliyor: tekrar izlenme, anlaşılmama yüzünden de olabilir.

---

## 2. Kısa/dikey drama (micro-drama) yazım formülleri

### 2a. Temel ilkeler

- **Format:** Bölümler genelde 1-3 dakika, sezonlar 50-100 bölüm [İKİNCİL] (https://www.milligazete.com.tr/dikey-dizi-ne-demek-formati-ve-ozellikleri-nedir-kac-dakika-surer-nereden-izlenir-turkiyenin-ilk-dikey-dizisi-hangisi, https://invideo.io/blog/ai-micro-drama-episodes-per-season/). ReelShort/DramaBox'ta ilk ~8-12 bölüm ücretsiz. Ödeme duvarı genellikle bir cliffhanger'ın hemen ardından geliyor [İKİNCİL] (https://www.bamboo-cloud.com/micro-drama-boom/, https://letsgetspatial.substack.com/p/dramabox-mobile-game-logic-microdramas).
- **Açılış ve tempo:** Bölümler çatışma ya da gerilimle açılıyor. Uzun kurulum yerine hızla karşılık verme, "tokat" (face-slap: haksızlık yapanın rezil olması) ve twist sahnelerine geçiliyor [İKİNCİL] (https://technode.com/2025/10/01/fast-paced-life-fuels-the-rise-of-short-dramas-as-a-new-symbol-of-chinese-entertainment/).
- **"Shuang" (爽).** Kötü karakterin cezasını bulması ya da kahramanın güçlüye kafa tutması gibi tatmin anı. Türün duygusal ödemesi budur [İKİNCİL] (https://longreads.com/2026/07/09/short-dramas-china/).
- **Baskın kalıplar (tropes):** Yeniden doğuş ve intikam (重生复仇), gizli kimlik ("aslında CEO / ünlü cerrah / kayıp varis"), sözleşmeli ya da zorla evlilik, yerine geçme (substitute marriage), statünün tersine dönmesi [İKİNCİL] (https://www.theworldofchinese.com/post/welcome-to-the-micro-drama-nation-china/, https://www.chinadaily.com.cn/a/202601/02/WS69570b75a310d6866eb3190a.html). En tutarlı bulgu bu trope listesi.
- **Maske düşme ödemesi:** Ezilen, ihanete uğrayan ya da kimliğini gizleyen kahramanın maskesi düştüğünde ödeme büyük olur. Ama bu yalnızca izleyici önceden yeterince haksızlık biriktirdiyse işler (setup → payoff) [İKİNCİL] (https://socialpeta.com/blog/Short-Drama-Weekly-Ranking-How-Classic-Tropes-Continue-to-Win-Across-Global-Markets).
- **Eleştiri / risk:** Formüller hızlı sarsıntı veriyor ama karmaşıklığı düzleştiriyor. Yazarlar giderek daha uç kancalara (şiddet, ahlaki provokasyon) yöneliyor [İKİNCİL] (https://www.theworldofchinese.com/2025/12/chinas-micro-dramas-really-evolving/). Aile draması için bu, platform kuralları ve marka güvenliği açısından bir uyarıdır.
- **Yazım süreci:** Diyalogdan önce zaman damgalı bir beat taslağı çıkarın. 90 saniyelik bölümde sahneyi ilerletmeyen diyaloğa yer yoktur [İKİNCİL] (https://filmustage.com/blog/how-to-write-a-vertical-drama-script/). ReelShort ABD içerik başkanı, 20 kişilik yazar ekibinin ayda 15-20 senaryo ürettiğini söylüyor [İKİNCİL, TheWrap] (https://www.thewrap.com/?p=7869093).

### 2b. Somut kurallar ve sayılar

| Konu | Kaynaklardaki yapı | Durum |
|---|---|---|
| 90 sn bölüm iskeleti | 0:00-0:03 kanca → 0:03-0:30 mini doruk → 0:30-0:55 açığa çıkma/dönüş → 0:55-1:00 cliffhanger | Satıcı blogu, [DOĞRULANAMADI] (https://genra.ai/blog/ai-short-drama-script-formula-hooks-cliffhangers) |
| Tek bölüm 3 perde | 30 sn kanca → ~1 dk çatışma tırmanışı → 30 sn tatmin (shuang) | Satıcı kaynağı, [DOĞRULANAMADI] (https://youmind.com/landing/x-viral-articles/ai-short-drama-script-skill) |
| Bölüm başına twist sayısı | "Bölüm başına 3 twist" gibi bir kuralı doğrulayan kaynak bulunamadı | [DOĞRULANAMADI] |
| Cliffhanger kuralı | Çözümden bir vuruş önce kes | [İKİNCİL] (https://invideo.io/blog/ai-micro-drama-hooks-cliffhangers/) |

**Bölüm sonu cliffhanger türleri** (sınıflandırma bizim, örnekler genel [ÖNERİ]):
1. **Açığa çıkma:** Bir sır yarım açıklanır (mektup, telefon ekranı, kapı aralığından duyulan cümle).
2. **Karar anı:** Karakter geri dönüşü olmayan bir şey söylemek üzeredir. Kesme, ağzını açtığı anda.
3. **Tehdit / saat:** "Yarın sabaha kadar..." (Hitchcock'un bombası, bkz. Bölüm 3).
4. **Yeni karakter / giriş:** Kapı çalar, beklenmeyen kişi.
5. **Statü tersine dönüşü:** Güçlü olan bir anda zayıf düşer (ya da tersi), tepki bir sonraki bölümde.
6. **İç ses çelişkisi:** Karakter dışarıya bir şey söyler, iç ses tersini söyler. Birinci şahıs anlatımımıza özgü güçlü bir araç.

### 2c. 4-5 dakikalık bölüme uyarlama

Mikro dramalar 1-3 dakika. Bizim bölümümüz bunun 2-4 katı. Bu yüzden **bir bölüm = 3 mikro bölüm + bir ana kemer** gibi düşünün [ÖNERİ]:

- [ ] Bölüm 3 "perdeye" (her biri ~80-100 sn) bölündü. Her perde mikro drama gibi kanca → tırmanış → mini cliffhanger yapısında. Böylece parçalara bölündüğünde her parça tek başına çalışır.
- [ ] Bölümün tamamında tek bir ana soru (dramatik soru) var. Perdeler bu soruya yeni bilgi ekliyor.
- [ ] En az bir "shuang" anı (haksızlığa karşılık / küçük zafer) ve en az bir "haksızlık birikimi" anı var. Biri olmadan öbürü çalışmaz.
- [ ] Trope seçimi Türk aile bağlamına çevrildi (gizli kimlik → saklanan miras / evlat edinilme; statü tersine dönüşü → küçümsenen gelin; intikam → yıllar sonra ortaya çıkan haksızlık). Bunlar yöntem örnekleri, hikâye değil. [ÖNERİ]
- [ ] Uç provokasyondan (şiddet, istismarın sansasyonel gösterimi) kaçınıldı. Platform politikaları ve marka güvenliği.

---

## 3. Senaryo zanaatı

### 3a. Temel ilkeler ve araçlar

- **McKee: Sahne başına değer değişimi.** Her sahnede tehlikedeki değeri adlandırın (sevgi, güven, adalet, aidiyet). Sahne başındaki yükünü (+/-) ve sonundaki yükünü yazın. Değişmiyorsa sahne "dönmüyor" demektir [DOĞRULANDI: McKee'nin sitesi] (https://mckeestory.com/do-your-scenes-turn/). Değişim, kahramanın kendi eylemiyle gelirse daha anlamlıdır. Değişim "-'den daha -'ye" de olabilir [İKİNCİL].
- **Save the Cat (Blake Snyder):** 15 vuruş. Katalizör ~%10, orta nokta ~%50, "her şey bitti" ~%75 [İKİNCİL] (https://sudowrite.com/blog/what-is-a-beat-sheet/, https://www.jessicabrody.com/2020/11/how-to-write-your-novel-using-the-save-the-cat-beat-sheet/). Yüzdeler hedef, katı kural değil. Bir bölümün değil, **sezonun** iskeleti olarak daha kullanışlı [ÖNERİ].
- **Dan Harmon Story Circle:** Sen → İhtiyaç → Git → Ara → Bul → Bedel öde → Dön → Değiş. 8 adım [İKİNCİL] (https://www.studiobinder.com/blog/dan-harmon-story-circle). Kısa bölümler için idealdir, çünkü Harmon bunu bölümlük TV (Community, Rick and Morty) için kullanıyor. **4-5 dk bölüme birebir oturur:** her adım ~30-40 sn [ÖNERİ].
- **Dramatik ironi (Hitchcock'un bombası):** Masanın altında bomba var ve seyirci bunu bilmiyorsa, patlama 15 saniyelik bir sürpriz verir. Seyirci biliyorsa, aynı sahne 15 dakikalık bir gerilim verir. "Mümkün olduğunca seyirci bilgilendirilmeli", ancak sürprizin kendisi twist ise bu kural geçerli değildir [İKİNCİL: Truffaut'nun *Hitchcock* kitabından aktaran] (https://www.futilitycloset.com/2023/12/20/hitchcocks-bomb-theory/, https://nofilmschool.com/alfred-hitchcock-and-francois-truffaut-explain-surprise-vs-suspense). **Birinci şahıs iç ses bunun için ideal:** anlatıcı izleyiciye diğer karakterlerin bilmediğini söyler.
- **Show, don't tell (göster, söyleme):** İç ses anlatımında en büyük risk, iç sesin görüntüyü tekrar etmesi. İç ses, görüntünün **söylemediğini** söylemeli: çelişki, sır, yorum [ÖNERİ]. Bir kaynak, uzun formatta kesintisiz monoloğun "yaşanmış" değil "oynanmış" hissettirmeye başladığını belirtiyor [İKİNCİL] (https://www.influencers-time.com/master-tiktoks-pov-videos-for-immersive-storytelling/).
- **Diyalog alt metni:** Karakterler istediklerini doğrudan söylemez. Aile dramasında alt metin, "çay koyayım mı?" gibi sıradan cümlelerde taşınır. İç ses alt metni açığa çıkarabilir, ama her seferinde değil. Bazen izleyicinin çözmesine bırakın [ÖNERİ].
- **İstek ve ihtiyaç (want/need):** İstek dışsal ve bilinçlidir (evin kendisine kalması). İhtiyaç içsel ve çoğu zaman bilinçsizdir (annesinin onayı). Harmon çemberinde "İhtiyaç" ve "Değiş" adımları bunu taşır.
- **Setup / payoff:** Shuang ve maske düşme anları ancak önceden kurulduysa çalışır (Bölüm 2a). Kurulum ile ödeme arasındaki süre dizi formatında birkaç bölüm olabilir. Her bölüm hem eski bir kurulumu ödesin hem yeni bir kurulum ekesin [ÖNERİ].
- **Pixar'ın 22 kuralı (Emma Coats, 2011):** Kural 1: Karakteri başarılarından çok çabası için severiz. Kural 22: Hikâyenin özünü ve en ekonomik anlatımını bulun, oradan genişletin [İKİNCİL] (https://fs.blog/22-rules-pixar-uses-to-create-appealing-stories/).
- **Walter Murch'ün altı kuralı (kurgu):** Duygu (%51) > hikâye (%23) > ritim (%10) > göz takibi (%7) > 2D düzlem > 3D uzay. Duygusal testi geçemeyen kesme, teknik olarak doğru olsa da yanlıştır [İKİNCİL] (https://nofilmschool.com/2016/11/6-rules-good-cutting-according-oscar-winning-editor-walter-murch).

### 3b. Somut kurallar

- Her sahne için kâğıda yazılan tek satır: `Değer: ___ | Başta: +/- | Sonda: +/- | Dönüş anı: ___` [McKee'den uyarlama]
- Bölümde sahne sayısı: 4-5 dk ÷ sahne başına 30-60 sn ≈ **5-8 sahne**, her biri değer değiştiriyor [ÖNERİ]
- İç ses / diyalog oranı: iç sesin görüntüyü tekrar ettiği her cümle silinir. [ÖNERİ]
- Dramatik ironi: her bölümde izleyicinin en az bir karakterden fazla bildiği bir an. [ÖNERİ]

### 3c. Kontrol listesi

- [ ] Bölüm Harmon çemberinin 8 adımına yerleştirildi.
- [ ] Her sahnenin değer satırı dolu ve hiçbir sahne +'dan +'ya kalmıyor.
- [ ] İç ses en az bir yerde görüntüyle çelişiyor ya da görüntünün göstermediği bir bilgiyi veriyor.
- [ ] Bu bölüm eski bir kurulumu ödüyor ve yeni bir kurulum ekiyor (liste: `kurulumlar.md` gibi bir takip dosyası) [ÖNERİ].
- [ ] Hitchcock testi: izleyici "bombayı" biliyor mu? Bilmesi gerekiyor mu, yoksa sürpriz mi daha iyi?

---

## 4. Görüntü yönetimi (2D'ye uyarlanmış)

### 4a. Temel ilkeler

- **Çekim ölçekleri:** Geniş (mekân/ilişki) → orta (beden dili) → yakın (duygu) → çok yakın (göz, el, nesne: sır/ipucu). Dikey kadrajda yakın plan doğal olarak güçlüdür: yüz ekranı doldurur. Duygu doruklarını yakın plana saklayın [ÖNERİ].
- **Açı psikolojisi:** Alt açı güç ve üstünlük, göz hizası eşitlik, üst açı zayıflık çağrıştırır. Kraft (1987) ve sonraki deneyler bu yönde bulgular bildiriyor. Ancak etki bağlama göre değişiyor ve bazı çalışmalar her iki uç açının da güvenilirlik algısını düşürdüğünü buldu (Baranowski & Hecht, 2018) [DOĞRULANDI, akademik özetler] (https://econtent.hogrefe.com/doi/10.1027/1864-1105/a000295, https://account.psychologicabelgica.com/index.php/up-j-pb/article/view/pb-46-3-199/132). 2D'de açı, karakterin kadrajdaki dikey konumu, ölçeği ve perspektif çizgileriyle taklit edilir.
- **180 derece kuralı ve shot-reverse-shot:** İki karakter konuşurken aralarındaki hayali çizginin aynı tarafında kalın. A hep ekranın solundan sağa, B hep sağdan sola baksın. Kodla üretimde bu bir **sahne parametresi** olarak tutulabilir (`facing: 'left' | 'right'`) [ÖNERİ]. Bilinçli kural ihlali kopuşu (ihanet anı gibi) göstermek için kullanılabilir.
- **Dikey kadrajda iki kişi:** 9:16'da yan yana iki-kişi çekimi zor. Kaynaklar şunları öneriyor: (1) tek kişilik çekimler arasında kesme, (2) omuz üstü çekimde yakın omzu alta koyup karşıdaki yüzü yukarıda büyütmek (üst üste dizme), (3) iki-kişi çekimini yüzleşme/yakınlık anlarına saklamak. Kimin daha yukarıda ve büyük olduğu güç ilişkisini anlatır [İKİNCİL] (https://morphic.com/resources/shots/over-the-shoulder-vertical, https://morphic.com/resources/shots/vertical-two-shot). 16:9 bir çekimi 9:16'ya kırpmak görüntünün ~%70'ini kaybettirir. Baştan dikey kurgulayın.
- **Kamera hareketinin anlamı (2D'de):** Yavaş içe zoom (push-in) farkındalık, gerilim ve yakınlaşma demektir. Dışa zoom (pull-out) yalnızlık ya da büyük resmin açığa çıkmasıdır. Sarsıntı şok demektir. Sabit kamera gözlem ve soğukluk demektir. Bunlar sinema geleneği. Kontrollü deneysel kanıt bulunamadı [ÖNERİ]. Remotion'da `interpolate`/`spring` ile katman ölçeği ve konumu üzerinden yapılır. Paralaks (arka plan katmanını daha yavaş kaydırmak) derinlik hissi verir.
- **Renk senaryosu (color script):** Pixar'da Ralph Eggleston'ın yöntemi: filmin duygusunu renk ve ışıkla anlatan kısaltılmış bir versiyon. *Inside Out* için 500-600 resim yapılıp ~200'e indirildi ve storyboard gibi düzenlendi [DOĞRULANDI: Eggleston röportajı] (https://www.awn.com/animationworld/ralph-eggleston-talks-inside-out).
- **Renk psikolojisi (araştırma):** Valdez & Mehrabian (1994): Duygu üzerinde **doygunluk ve parlaklık**, renk tonundan daha güçlü ve tutarlı etkiler gösteriyor. Hoşnutluk ≈ .69·Parlaklık + .22·Doygunluk; uyarılma ≈ −.31·Parlaklık + .60·Doygunluk [DOĞRULANDI: PubMed özeti] (https://pubmed.ncbi.nlm.nih.gov/7996122/). Wilms & Oberfeld (2018) da doygunluğun tondan daha etkili olduğunu destekliyor (https://pubmed.ncbi.nlm.nih.gov/28612080/). **Pratikte:** gerilimi doygunluğu artırıp parlaklığı düşürerek, huzuru parlaklığı artırıp doygunluğu ılımlı tutarak verin. "Kırmızı = öfke" gibi tek renk-tek duygu eşleşmeleri kültüre göre değişir (Eggleston da bunu not ediyor).
- **Işıkla duygu (2D):** Sahneye bir "ışık katmanı" ekleyin (yarı saydam gradyan ya da multiply/overlay blend). Sıcak/soğuk sıcaklık, kontrast ve gölge yönü tek parametreyle değişebilir. Geçmişe dönüşte (flashback) belirgin farklı bir palet okunabilirliği artırır [ÖNERİ].

### 4b. Güvenli alanlar (1080×1920)

Platformlar organik içerik için resmî piksel değeri yayınlamıyor. Kaynaklar birbirinden farklı rakamlar veriyor [DOĞRULANAMADI, aralık olarak verildi]:

| Kenar | TikTok | Instagram Reels | YouTube Shorts | Önerilen ortak değer |
|---|---|---|---|---|
| Üst | ~130-240 px | ~250-270 px | ~140-288 px | **288 px** |
| Alt | ~270-660 px (en çok ~480) | ~340-672 px | ~288-672 px | **672 px** (metin için), 480 px (yüz için) |
| Sağ (butonlar) | ~100-180 px | ~120-180 px | ~140-192 px | **180 px** |
| Sol | ~60-120 px | ~65 px | belirtilmemiş | **96 px** |

Kaynaklar: https://www.socialync.io/tools/safe-zones/tiktok, https://www.socialync.io/tools/safe-zones/instagram-reels, https://www.socialync.io/tools/safe-zones/youtube-shorts, https://reap.video/blog/short-form-video-safe-zones, https://www.hopperhq.com/blog/instagram-reel-size/, https://www.clipspeed.ai/blog/youtube-shorts-size.html. Meta'nın reklam rehberinden aktarılan değerler: üst %14 (~269 px), alt %35 (~672 px), yanlar %6 (~65 px). Bunlar reklam yerleşimi için verilmiş [İKİNCİL].

**Uygulama [ÖNERİ]:**
- **Altyazı / iç ses metni:** y = 288…1248 aralığında, x = 96…900. Tercihen ekranın **orta-alt bandı** (y ≈ 1000-1240). Göz yüzden metne kısa yol kat etsin.
- **Yüzler ve kritik nesneler:** y ≈ 350-1100 aralığında.
- **Alt 480-672 px:** Yalnızca zemin, gövde, dekor. Hiçbir bilgi taşımasın.
- Remotion'da yalnızca önizlemede görünen bir `SafeZoneOverlay` bileşeni kullanın (render'da kapalı).
- Her yayından önce hedef uygulamada taslak/önizleme kontrolü yapın.

### 4c. Kontrol listesi

- [ ] Her sahne için çekim listesi: ölçek (G/O/Y/ÇY) + açı + hareket + kim nereye bakıyor.
- [ ] 180 derece çizgisi sahne başına tanımlı, ihlal yalnızca bilinçli.
- [ ] Dizi için renk senaryosu şeridi (bölüm başına 1 satır, sahne başına 1 renk kutusu) hazır. Karakter başına ana renk tanımlı.
- [ ] Gerilim sahnelerinde doygunluk/parlaklık parametreleri renk senaryosuna göre ayarlandı.
- [ ] Altyazı ve yüzler güvenli alan içinde (overlay ile kontrol edildi).
- [ ] Ortalama 2-4 sn'de bir görsel değişim var (kesme, zoom, yeni öğe) [ÖNERİ].

---

## 5. Ses yönetimi

### 5a. Temel ilkeler

- **Ses yüksekliği hedefi:** YouTube ~-14 LUFS'ye normalize ediyor ve yalnızca aşağı yönde (yüksek sesi kısar, kısık sesi yükseltmez). TikTok ve Instagram resmî hedef yayınlamıyor. Kaynaklar çelişiyor (-14, ya da daha yüksek -10/-12 öneren var) [İKİNCİL/DOĞRULANAMADI] (https://www.forasoft.com/learn/audio-for-video/articles-audio/lufs-targets-per-platform-2026, https://openclip.app/learn/audio-normalization). **Pratik standart:** −14 LUFS entegre, true peak ≤ −1 dBTP. -23/-24 LUFS bir yayın (TV) standardıdır, sosyal medya için değil. Netflix ise diyalog bazlı -27 LKFS kullanır (https://backlothelp.netflix.com/hc/en-us/articles/360001794307-Netflix-Sound-Mix-Specifications-Best-Practices-v1-5).
- **Diyalog / müzik / efekt dengesi:** Endüstride sabit bir dB standardı yok. Profesyonel miks kulakla yapılır. Kaynaklardaki başlangıç değerleri: diyalog tepeleri ~-12 dBFS (aralık -15…-6), diyaloğun altındaki müzik -25…-18 dB (bazı kaynaklar -30'a kadar), efekt -20…-10 dB [İKİNCİL] (https://www.adorama.com/alc/mastering-audio-levels/, https://wevideo.com/blog/how-to-set-audio-levels). Diyalog sırasında müziği kısın (ducking). Önceden kaydedilmiş içerikte bunu otomatik kompresör yerine elle (zarf/keyframe) yapmak önerilir.
- **J-cut / L-cut:** J-cut'ta sonraki sahnenin sesi görüntüden önce başlar ve ivme kazandırır. L-cut'ta önceki sahnenin sesi yeni görüntü üzerinde sürer ve duygusal yankı yaratır [İKİNCİL] (https://www.storyblocks.com/resources/tutorials/film-editing-techniques). Remotion'da `<Sequence>` ses başlangıcını görüntüden birkaç kare kaydırarak kolayca yapılır.
- **Gerilim araçları:** Shepard tonu, sürekli yükselen ses yanılsamasıdır (Nolan filmlerinde kullanılır) [İKİNCİL] (https://www.premiumbeat.com/blog/shepard-tone-sound-design-filmmaking). Riser (yükselen ses) bir açıklamadan önce gelir. **Sessizlik:** müziği ve ambiyansı aniden kesmek en ucuz örüntü kırmadır. Sessizliğin etkisini ölçen güvenilir bir kaynak bulunamadı [ÖNERİ].
- **Leitmotif:** Karakter ya da ilişkiye bağlı kısa bir müzik motifi. Dizide tekrarlandıkça çağrışım kazanır (araştırmada yeterli birincil kaynak bulunamadı, sinema geleneği [ÖNERİ]). Uygulama: karakter başına 3-5 notalık motif, durum değişince enstrüman ya da tempo değişir.
- **Ambiyans katmanları:** (1) oda tonu / sürekli taban, (2) mekân sesi (mutfak, sokak, saat tiktağı), (3) nokta efektleri (kapı, bardak, telefon). Düz 2D görüntüde mekân hissinin çoğu bu katmanlardan gelir [ÖNERİ].
- **Altyazı:** Sosyal videoların büyük kısmı sessiz izleniyor varsayımıyla altyazı zorunlu kabul ediliyor. Altyazının izlenme süresini artırdığına dair rakamlar kaynaksız [DOĞRULANAMADI]. Bizim formatta iç ses zaten altyazılı, bu artı.

### 5b. Ücretsiz müzik ve efekt kaynakları (lisans koşullarıyla)

| Kaynak | Lisans | Koşul / risk |
|---|---|---|
| **Freesound** | Ses başına CC0, CC BY ya da CC BY-NC | CC0: her kullanım serbest. CC BY: kullanıcı adı + bağlantı ile atıf. **CC BY-NC: ticari kullanım yok.** Gelir getiren kanalda kullanmayın [DOĞRULANDI: Freesound SSS] (https://freesound.org/help/faq) |
| **Pixabay Music/SFX** | Pixabay Content License: atıf gerekmez, ticari kullanım serbest | Bazı parçalar Content ID'ye kayıtlı olabilir. İndirmede lisans sertifikasını saklayın [İKİNCİL] (https://hellothematic.com/best-free-music-websites/) |
| **YouTube Audio Library** | Çoğu parça atıfsız. Bazıları CC BY (açıklamaya atıf) | Standart lisans yalnızca YouTube'da geçerli olabilir. CC BY parçalar her platformda atıfla kullanılabilir [İKİNCİL] (https://vidiq.com/blog/post/royalty-free-music-youtube-audio-library/). TikTok/IG için CC BY olanları seçin |
| **Incompetech (Kevin MacLeod)** | CC BY 4.0 (bazı eski parçalar 3.0) | Atıf formatı: "Parça adı – Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0" [DOĞRULANDI: SSS] (https://incompetech.com/music/royalty-free/faq.html) |
| **Sonniss GDC bundle** | Telifsiz efekt paketi | Bu araştırmada lisans metni doğrulanamadı [DOĞRULANAMADI]. Kullanmadan önce sonniss.com'daki lisansı okuyun |

**Kural [ÖNERİ]:** `assets/LICENSES.csv` dosyası tutun: dosya adı, kaynak URL, lisans, atıf metni, indirme tarihi. Bölüm açıklamasına atıflar otomatik eklensin.

### 5c. Kontrol listesi

- [ ] Final miks −14 LUFS entegre, ≤ −1 dBTP (ffmpeg `loudnorm=I=-14:TP=-1:LRA=11` ile ölçülüp düzeltilebilir).
- [ ] İç ses/diyalog her zaman müzikten belirgin. Müzik diyalog altında elle kısıldı.
- [ ] Her sahne geçişinde J-cut ya da L-cut kullanımı düşünüldü.
- [ ] Bölümde en az bir bilinçli sessizlik anı (açıklama ya da cliffhanger öncesi).
- [ ] Karakter motifleri tanımlı ve tutarlı.
- [ ] Hiçbir CC BY-NC ya da lisansı belirsiz ses yok. LICENSES.csv güncel.

---

## 6. Ücretsiz/açık Türkçe TTS ve dudak senkronu

> Önemli ayrım: **kod lisansı ≠ model ağırlık lisansı ≠ eğitim verisi lisansı.** Ticari (para kazanan) kanal için hepsine bakılmalı. Hukuki tavsiye değildir.

| Model | Türkçe | Lisans (ağırlıklar) | Ticari kullanım | Ses klonlama | Not |
|---|---|---|---|---|---|
| **Chatterbox Multilingual** (Resemble AI) | Var (23 dil) | MIT | **Evet** (MIT) | Evet (referans klip) | Her çıktıda fark edilmeyen Perth filigranı var. Proje artık "emekliye ayrılmış araştırma", bakım yapılmıyor [DOĞRULANDI: GitHub] (https://github.com/resemble-ai/chatterbox). Duygu için `exaggeration` (0.5 nötr, yükseldikçe dramatik ve hızlı), `cfg_weight` (referans farklı dildeyse 0 önerilir) [İKİNCİL] (https://wiro.ai/blog/chatterbox-multilingual-voice-cloning-in-23-languages/) |
| **Piper `tr_TR-dfki-medium`** | Var (tek ses) | Veri seti **CC BY-NC-SA 4.0** | **Hayır** | Hayır | Motor MIT ama ses lisansı belirleyici. `fahrettin` ve `fettah` sesleri katkıcıların isteğiyle depodan kaldırıldı [DOĞRULANDI: HF model kartı ve depo] (https://huggingface.co/rhasspy/piper-voices/tree/main/tr/tr_TR) |
| **Coqui XTTS-v2** | Var | Coqui Public Model License | **Hayır**: yalnızca ticari olmayan kullanım. Doğrudan ya da dolaylı gelir varsa ticari sayılır, çıktılar da kapsamda | Evet (~6 sn) | [DOĞRULANDI: lisans metni] (https://huggingface.co/coqui/XTTS-v2/blob/main/LICENSE.txt). Coqui şirketi kapandığı için ticari lisans almak da pratikte mümkün değil [İKİNCİL] |
| **Meta MMS-TTS (`mms-tts-tur`)** | Var | CC BY-NC 4.0 | **Hayır** | Hayır | [DOĞRULANDI: HF etiketi] (https://huggingface.co/facebook/mms-tts-tur/tree/main) |
| **F5-TTS** | Resmî Türkçe yok (topluluk ince ayarları var) | Kod MIT, önceden eğitilmiş ağırlıklar **CC BY-NC** (Emilia verisi nedeniyle) | **Hayır** (ince ayarlı türevler de) | Evet | [İKİNCİL] (https://github.com/SWivid/F5-TTS) |
| **EMA Lightning** (`canberkkkkkk/ema-lightning`) | Türkçeye özel | Apache-2.0 | Model kartına göre evet | Hayır (tek ses, duygu kontrolü yok) | Çok küçük (~34 MB), CPU'da çalışır [İKİNCİL] (https://www.ssdnodes.com/learn/lang/tr/open-source-turkish-tts-models-compared) |
| **FreyaTTS-small** | Türkçeye özel | Apache-2.0 (kart üzerinde; LICENSE dosyası yok) | Belirsiz-olumlu | Hayır | [İKİNCİL] aynı kaynak |
| **Trendyol-TTS** | Türkçe (VoxCPM2 + LoRA) | MIT etiketi, araştırma amaçlı | **Belirsiz** | Belirtilmemiş | Büyük (~5 GB), GPU ister [İKİNCİL] aynı kaynak |

**Çıkarım [ÖNERİ]:** Para kazanılacak bir dizi için **Chatterbox Multilingual** tek ücretsiz, ticari kullanıma açık ve **çok sesli/duygulu** seçenek görünüyor. Kullanacağınız referans seslerin (klonlanan kişinin) yazılı onayı olmalı. Anlatıcı dışındaki yan karakterler için EMA Lightning / FreyaTTS-small denenebilir. XTTS-v2, MMS ve Piper-dfki prototip için uygun, yayın için değil. Her durumda Türkçe telaffuz (özel isimler, sayılar, ğ/ı) ana dili Türkçe olan biri tarafından dinlenmeli. Chatterbox'ın Türkçe kalitesini değerlendiren bağımsız bir test bulunamadı [DOĞRULANAMADI].

**Rhubarb Lip Sync:** MIT lisanslı. Üretilen dudak senkronu verisi kullanıcıya ait [DOĞRULANDI] (https://github.com/DanielSWolf/rhubarb-lip-sync, LICENSE.md). İki tanıyıcısı var: `pocketSphinx` (İngilizce, varsayılan) ve **`phonetic` (dilden bağımsız, Türkçe için bunu kullanın)**. Ağız şekilleri A-F temel, G/H/X isteğe bağlı (`--extendedShapes`). `-f json` çıktısı `mouthCues: [{start, end, value}]` verir. Remotion'da kareye çevirip ağız sprite'ı seçmek için doğrudan kullanılabilir. Diyalog metnini `--dialogFile` ile vermek doğruluğu artırır, ancak bu özelliğin `phonetic` modda etkisi sınırlı olabilir [DOĞRULANAMADI].

**Remotion lisansı (hatırlatma):** Remotion bireyler ve küçük ekipler için ücretsiz, belirli bir çalışan sayısının üstündeki şirketler için ücretli şirket lisansı gerektiriyor. Güncel eşiği https://www.remotion.dev/license adresinden doğrulayın [DOĞRULANAMADI: bu araştırmada açılmadı].

### 6c. Kontrol listesi

- [ ] Yayında kullanılan her TTS modelinin ağırlık lisansı ticari kullanıma izin veriyor (tablo).
- [ ] Klonlanan seslerin sahiplerinden yazılı izin alındı.
- [ ] Türkçe telaffuz sözlüğü (özel isimler, kısaltmalar, sayılar) tutuluyor. Metin TTS'ten önce normalize ediliyor (sayılar yazıyla).
- [ ] Rhubarb `phonetic` modunda çalıştırılıyor. JSON, Remotion `mouthCues` bileşenine bağlı.
- [ ] Platformların yapay zekâ ile üretilmiş içerik etiketleme kurallarına uyuluyor (AI ses kullanımı beyanı; güncel platform politikasını kontrol edin) [ÖNERİ].

---

## 7. Türkiye'de animasyon / aile draması: örnekler ve temalar

### 7a. Bulgular

- **Türk dizilerinin ihracat gücü:** Parrot Analytics'e göre Türk dizilerine talep 2020-2023 arasında %184 arttı (aynı dönemde Kore %73). Türkiye 2023'te ABD ve İngiltere'den sonra en çok senaryolu dizi ihraç eden ülke oldu. ABD'de en çok talep gören Türk yapımlarının çoğu drama [İKİNCİL: Parrot'un basın sayfası] (https://www.parrotanalytics.com/press/how-turkish-drama-is-conquering-the-world/). Forbes Türkiye'ye göre Türk dizileri 150'den fazla ülkeye ulaşıyor ve izleyiciler giderek 90-120 saniyelik dikey dizilere kayıyor (https://www.forbes.com.tr/dergi/tiktok-ve-reels-caginda-turk-dizileri-yeni-bir-ihracat-hamlesi-yapiyor).
- **Yerli dikey dizi örnekleri:** BMAG platformunda *Yeni Nesil Aile* (Eda Ece, Sumru Yavrucuk), yüksek prodüksiyonlu dikey dizi örneği olarak anılıyor. Bölümler 1-3 dk (bazıları 3-4 dk), dizi başına 50-100 bölüm (https://www.milligazete.com.tr/dikey-dizi-ne-demek-formati-ve-ozellikleri-nedir-kac-dakika-surer-nereden-izlenir-turkiyenin-ilk-dikey-dizisi-hangisi). GAİN'in "Gain Shorts" sekmesi açtığı ve MedYapım'ın dizilerini dikey formata uyarlamaya hazırlandığı bildiriliyor [İKİNCİL] (https://www.aydinlik.com.tr/haber/dijital-dunyada-fast-food-furyasi-kisa-videolar-iradeyi-esir-aliyor-582096). Dikkat çekici bir tesadüf: yerli ilk örneklerden biri de bir **aile** dizisi.
- **Türk animasyonu:** Rafadan Tayfa'nın YouTube kanalı için üçüncü taraf istatistik sitesi ~1,8M abone ve ~1,5 milyar toplam izlenme gösteriyor [İKİNCİL] (https://www.speakrj.com/audit/report/UCNejE03PzpBBfX9NNEVRLCQ/youtube). Kral Şakir ve diğerleri için güvenilir izlenme verisi bulunamadı. Bunlar çocuk içerikleri. **Yetişkin kitleye düz çizim aile draması** için kamuya açık bir başarı analizi bulunamadı [DOĞRULANAMADI].
- **Gelin-kayınvalide teması:** Akademik literatürde hem gerçek hayatta hem medyada güçlü bir tema. Kayınvalidenin oğlunun ilgisi için gelinle rekabeti çatışma kaynağı olarak inceleniyor. Medyada "iyi geçinen gelin-kayınvalide" temsiline neredeyse hiç rastlanmıyor. Gelin-kayınvalide yarışma programları popülerliğini koruyor. Instagram'da mâni ve türkülerden bugüne bu ilişkinin dijital kültürdeki dönüşümünü inceleyen bir çalışma var [DOĞRULANDI: akademik özetler] (https://dergipark.org.tr/tr/download/article-file/4569260, https://openaccess.gedik.edu.tr/items/513b722b-375f-4aef-b607-20180fe4c0be, https://acikerisim.sakarya.edu.tr/handle/20.500.12619/96945). Türk dizilerinde toplumsal cinsiyete dayalı anne-baba rolleri "hemen her bölümde" belirgin biçimde işleniyor (https://openaccess.marmara.edu.tr/entities/publication/f073985b-7762-428a-9912-fc8c0d5713e9).
- **Kitlenin sevdiği temalar.** Aşağıdaki liste **çıkarımdır**: yukarıdaki akademik bulgular, Türk dizi ihracatında dramanın ağırlığı ve mikro drama trope'larının kesişimi. Bunu ölçen bir izleyici araştırması bulunamadı [ÖNERİ/DOĞRULANAMADI]:
  - gelin-kayınvalide / görümce-elti gerilimi,
  - miras ve mülk kavgası,
  - sınıf farkı (zengin aileye gelin giden yoksul kız; Çin trope'larının "statü tersine dönüşü" ile uyumlu),
  - aile sırrı (evlat edinilme, gizli kardeş; "gizli kimlik" ile uyumlu),
  - ihanet ve aldatma,
  - fedakâr anne / ihmal eden baba,
  - "el âlem ne der" baskısı,
  - göç ve gurbet.

### 7b. Uygulama kontrol listesi

- [ ] Her bölümün teması, kitlenin kendi ailesinden tanıyacağı bir gerilime dayanıyor (paylaşım ve yorum tetikleyici).
- [ ] Hassas konularda (aile içi şiddet, istismar) platform topluluk kuralları gözden geçirildi. Sansasyon yerine sonuç ve duygu gösteriliyor.
- [ ] Yorumlar sistemli okunuyor: hangi karakter "sevilen kötü", hangi trope tepki alıyor. Bir sonraki bölümün notlarına aktarılıyor.

### 7c. Referans analizi şablonu ("oadambendegilim" ve benzer hesaplar için)

Ekip, referans hesaptaki en çok izlenen 5 videoyu ve en az izlenen 5 videoyu elle inceleyip şu tabloyu doldursun:

| Video | Süre | İlk 3 sn'de ne var (görüntü + metin) | İç ses cümle sayısı/dk | Kesme sayısı/dk | Kaç trope | Bitiş türü (Bölüm 2b listesi) | İzlenme | Yorum sayısı | Paylaşım |
|---|---|---|---|---|---|---|---|---|---|

İki grup arasındaki fark, bu belgedeki genel kurallardan daha değerli bir yerel veridir.

---

## 8. Gemini önerisinin değerlendirmesi

Öneri: *"15-30 saniyelik bölüm formatı, her 3 saniyede mikro kanca, Stable Diffusion/ComfyUI ile görsel üretimi, Manim kullanımı."*

| Öneri | Bizim üretime uyumu | Gerekçe |
|---|---|---|
| **15-30 sn bölüm** | **Düşük** (ana format olarak). Fragman/teaser olarak **orta-yüksek** | Hedefimiz 4-5 dk. 15-30 sn'de karakter, kurulum ve ödeme sığmaz. Mikro dramaların kendisi bile 1-3 dk. TikTok Creator Rewards 1 dk'dan uzun video şart koşuyor [İKİNCİL]. YouTube Key Moments raporu 60 sn altı videoda çıkmıyor [DOĞRULANDI]. **Öneri:** Her bölümden 1-2 adet 15-30 sn'lik "kanca klibi" kesip tam bölüme yönlendirin |
| **Her 3 sn'de mikro kanca** | **Düşük** (anlatı kancası olarak). **Orta** (görsel değişim olarak) | Bu sıklığı destekleyen bir veri bulunamadı. Kaynaklar 15 sn ile 1 dk arasında çelişiyor [DOĞRULANAMADI]. 4-5 dk'da her 3 sn'de anlatısal kanca yaklaşık 90 kanca demek: yorucu, inandırıcılığı öldürür, duygusal sahnelere nefes bırakmaz. Doğru yorum: **her 2-4 sn'de görsel değişim** (Hollywood ortalama çekim süresiyle uyumlu), **her 15-30 sn'de anlatısal kanca** |
| **Stable Diffusion / ComfyUI** | **Düşük** (karakterler için). **Orta** (arka plan / konsept için) | Kod tabanlı vektör üretimimizin avantajı tam tutarlılık, düzenlenebilirlik ve parametrik animasyon. Difüzyon modellerinde karakter tutarlılığı bilinen bir sorun ve LoRA/IPAdapter/ControlNet ile ancak kısmen çözülüyor [İKİNCİL] (https://forum.comfy.org/t/character-consistency-issue-with-lora-in-comfyui/3704). Raster çıktı vektör stilimizle uyumsuz, ağız/göz animasyonu için katmanlara ayrılamıyor. Model ve ağırlık lisansları ayrıca kontrol gerektiriyor. **Olası kullanım:** konsept çizimi, renk senaryosu taslağı, statik arka plan (sonra vektörleştirilip stile uydurulmalı) |
| **Manim** | **Çok düşük** | Manim matematiksel açıklama videoları için bir animasyon motoru (MIT lisanslı) (https://github.com/ManimCommunity/manim). Karakter animasyonu, dudak senkronu ya da ses zamanlaması için tasarlanmamış. Remotion (React) zaten aynı "kodla animasyon" avantajını, web ekosistemi, ses ve altyazı desteğiyle birlikte sağlıyor. İkinci bir motor eklemek bakım yükü getirir |

**Özet:** Gemini önerisi kısa reklam/teaser mantığına uygun. 4-5 dakikalık, karakter tutarlılığı gerektiren, kodla üretilen bir dizinin ana boru hattına uymuyor. Alınacak doğru ders: "sık görsel uyarı + bölüm sonu kancası + kısa tanıtım klipleri".

---

## 9. 4-5 dakikalık bölüm şablonu (zaman çizelgesi)

> Harmon çemberi + 3 mikro perde + mikro drama kanca/cliffhanger mantığının birleşimidir. Süreler 4:30'luk bir bölüm için verildi. Kaynaklarla doğrulanmış bir standart değil, bu belgedeki ilkelerden türetilmiş bir **başlangıç şablonudur** [ÖNERİ]. Parçalara bölünecekse kesme noktaları ✂ ile işaretli.

| Zaman | Bölüm | Harmon | İçerik işlevi | Görüntü / ses notu |
|---|---|---|---|---|
| 0:00-0:03 | **Soğuk açılış kancası** | – | Bölümün en güçlü anından bir kare ya da bir soru cümlesi (flash-forward veya çatışma ortası). Yüz + iç ses altyazısı | Yakın plan, güvenli alan içinde metin, ses hemen başlar (sessiz ilk kare yok) |
| 0:03-0:15 | Kancanın açılması | – | "Bu nasıl oldu?" sorusu kurulur. Önceki bölümün cliffhanger'ına cevap ya da ona bağ | Kesme, geniş plana çıkış, karakter motifi |
| 0:15-0:45 | **Perde 1: Kurulum** | Sen + İhtiyaç | Karakterin normal dünyası ve bu bölümdeki isteği. Dramatik ironi kurulur (izleyici bir şey öğrenir) | Değer satırı #1. Ortalama 2-4 sn'de görsel değişim |
| 0:45-1:05 | Mikro kanca 1 | Git | Karakter harekete geçer ya da bir engelle karşılaşır | J-cut ile yeni sahneye geçiş |
| 1:05-1:30 | **Perde 1 sonu** | – | Mini cliffhanger: yeni bilgi ya da tehdit ✂ (parça 1 burada biter, ~1:30) | Riser + kesme ya da sessizlik |
| 1:30-1:40 | Perde 2 açılışı | – | Parça olarak yayınlanacaksa kendi kancası (bir cümle özet + soru) | – |
| 1:40-2:10 | **Perde 2: Tırmanış** | Ara | Karakter çözüm arar. Çatışma büyür, haksızlık birikir | İki-kişi çekimi: güç ilişkisi dikey konumla |
| 2:10-2:30 | **Orta nokta tersine dönüşü** | Bul | Karakter istediğini bulur ya da büyük bir gerçeği öğrenir. Değer yükü tersine döner | Renk/ışık değişimi (renk senaryosu), müzik değişimi |
| 2:30-2:55 | Bedel | Bedel öde | Bulduğunun bedeli ortaya çıkar | Yakın plan, iç ses ile görüntü çelişkisi |
| 2:55-3:05 | **Perde 2 sonu** | – | Mini cliffhanger ✂ (parça 2 burada biter, ~1:30) | Sessizlik ya da ani ses kesimi |
| 3:05-3:15 | Perde 3 açılışı | – | Parça kancası | – |
| 3:15-3:50 | **Perde 3: Yüzleşme / shuang** | Dön | Bölümün doruk sahnesi. Haksızlığa karşılık, itiraf ya da maskenin kısmen düşmesi | En yakın planlar, en yüksek doygunluk, motif tam hâliyle |
| 3:50-4:10 | Sonuç | Değiş | Karakterin küçük değişimi. Bölümün sorusuna kısmi cevap | L-cut ile duygusal yankı, nefes alanı |
| 4:10-4:25 | **Bölüm sonu cliffhanger** | (yeni İhtiyaç) | Yeni ve daha büyük soru (Bölüm 2b listesinden bir tür). Çözümden bir vuruş önce kes | Ani kesme, siyah ya da donmuş kare + iç ses son cümle |
| 4:25-4:30 | Kapanış kartı | – | "Devamı…" + seri adı / bölüm no. Takip çağrısı en fazla 2 sn | Güvenli alan içinde, kısa |

**Ritim özeti:** ~13 anlatısal "vuruş" ≈ ortalama **her 20 sn'de bir yeni bilgi/gerilim**. 3 mini cliffhanger, 1 orta nokta tersine dönüşü, 1 shuang doruğu, 1 bölüm sonu cliffhanger.

---

## 10. Bölüm kontrol listesi (yayından önce)

**Hikâye**
- [ ] Bölümün tek cümlelik dramatik sorusu yazıldı.
- [ ] Harmon çemberinin 8 adımı zaman çizelgesinde işaretli.
- [ ] Her sahnenin McKee değer satırı dolu ve her sahne dönüyor.
- [ ] İzleyicinin bir karakterden fazla bildiği en az bir an var (dramatik ironi).
- [ ] İç ses en az bir kez görüntüyle çelişiyor ya da gizli bir bilgi veriyor. Görüntüyü tekrar eden iç ses cümlesi yok.
- [ ] Eski bir kurulum ödendi, yeni bir kurulum ekildi (kurulum takip listesi güncel).
- [ ] Bir shuang/tatmin anı ve bir haksızlık birikimi anı var.

**Retention**
- [ ] 0-3 sn: yüz + soru ya da çatışma, ses hemen başlıyor.
- [ ] İlk 30 sn başlık ve kapağın sözünü tutuyor.
- [ ] Her 15-30 sn'de yeni bilgi, soru ya da tersine dönüş var (zaman çizelgesinde işaretli).
- [ ] 60-90 sn'lik parçaların her biri kendi kancası ve mini cliffhanger'ıyla bağımsız çalışıyor.
- [ ] Bölüm, çözümden bir vuruş önce kesilen bir cliffhanger ile bitiyor.
- [ ] En az bir "paylaşılabilir" an ve bir "yorum tetikleyici" ikilem var.

**Görüntü**
- [ ] Çekim listesi (ölçek/açı/hareket/bakış yönü) sahne başına hazır, 180 derece çizgisi korunuyor.
- [ ] Renk senaryosundaki duygusal eğriye uyuluyor (doygunluk/parlaklık).
- [ ] Altyazı y=288-1248, x=96-900 içinde. Yüzler ve kritik öğeler alt 480 px'in ve sağ 180 px'in dışında (overlay ile doğrulandı).
- [ ] 2-4 sn'den uzun hareketsiz kare yok (bilinçli duraklama hariç).

**Ses**
- [ ] −14 LUFS entegre, ≤ −1 dBTP.
- [ ] Diyalog/iç ses müzikten net. Müzik diyalog altında kısıldı.
- [ ] J/L-cut'lar, en az bir bilinçli sessizlik ve karakter motifleri yerinde.
- [ ] Tüm müzik ve efektlerin lisansı LICENSES.csv'de. CC BY-NC yok. Atıflar açıklamada.

**Teknik ve yasal**
- [ ] TTS modeli ticari kullanıma uygun (Chatterbox MIT gibi). XTTS-v2, MMS, Piper-dfki ve F5-TTS yayında yok.
- [ ] Klonlanan sesler için yazılı izin var. Türkçe telaffuz bir ana dil konuşucusu tarafından dinlendi.
- [ ] Rhubarb `phonetic` ile senkron yapıldı. Ağız kayması kontrol edildi.
- [ ] 1080×1920, 30 fps (ya da ekip standardı). Platform süre sınırlarına göre parçalar hazır (Shorts/Reels ≤ 3 dk).
- [ ] Gerekli AI içerik etiketleri ve platform beyanları yapıldı.
- [ ] Hedef uygulamada önizleme yapıldı (UI çakışması yok).

**Yayın sonrası (48-72 saat)**
- [ ] Shorts "viewed vs swiped", ortalama izlenme yüzdesi; Reels izlenme süresi, gönderim/erişim, beğeni/erişim; YouTube Key Moments (intro, dip, spike) not edildi.
- [ ] En büyük dip anı tespit edildi ve bir sonraki bölümün yazım notuna eklendi.

---

## Ek: Kaynak güvenilirliği notu

- Mikro drama "formül" kaynaklarının çoğu yapay zekâ senaryo aracı satıcılarının blogları (genra.ai, invideo.io, jenova.ai vb.). Saniye cinsinden şablonları **endüstri standardı değil**, uygulayıcı önerisi olarak okuyun.
- Güvenli alan piksel değerleri platformlarca resmî olarak yayınlanmıyor ve arayüz değiştikçe değişiyor.
- Algoritma ağırlıkları hiçbir platform tarafından formül olarak açıklanmıyor. Yalnızca hangi sinyallerin önemli olduğu (Mosseri, TikTok Newsroom, YouTube Yardım) söyleniyor.
- Lisans bilgileri araştırma tarihindeki durumu yansıtıyor. Yayın öncesi model kartı ve LICENSE dosyası yeniden kontrol edilmeli.
