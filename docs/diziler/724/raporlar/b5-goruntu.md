# 7/24 · Bölüm 5: görüntü yönetmeni çekim planı (23 Kasım 2026, gece)

Replikler kullanıcının metnidir; metin ve noktalama programla `bolumler.md`'den alındı. Tek dokunuş: tırnak içinde baştaki boşluklar (`" abi sen…"`, `" ne dönüyo…"`, `" hıığğ"`) kırpıldı.

**Kullanıcı kararları (23 Kasım 2026) işlendi:**
- Ece'nin yeni repliği "Şaka mı?.. Abi bir adamın eli yürüdü… ELİ." sahte Sabri'nin çay davetinden sonra, adımdan önce yer alıyor (çekim 6b).
- "hıığğ" ile "abi vallahi büyük hayranınım." arasında boşluk yok, tek akış.
- "hayranınım"dan sonra böcek kükrer; Ece "lülü?" der, 1 sn bekler, "bu da mı olmadı?" der (tedirgin, mahçup) (çekim 17a-17d).
- Senaristin diğer önerileri ([b5-senarist-komik.md](b5-senarist-komik.md)) kabul edilmedi ve kullanılmadı.

- **Bölüm JSON'u:** `dizi-studio/public/episodes/724-05.json`. Ses yok; her replik tahmini süreyle (`sure`) yazıldı. Konuşanın ağzı taslak olarak oynar. ElevenLabs sesleri gelince süreler ve ağız senkronu otomatik olarak sesten gelir.
- **Süre:** tahmini 48,2 sn idi; gerçek seslerle **~57,8 sn + 4 sn bitiş kartı ≈ 61,7 sn**. Tablodaki zamanlar tahminidir. Gerçek akış `ornekler/b5-ornek-taslak.mp4`'te.

## 0. Coğrafya, eksen, iki Sabri'yi ayırt etme

**Kat planı:** B4 ile aynı. Kapı önde solda, kasa önde sağda, DEPO arkada sağda.

B4 bittiğinde Ece kapıda, yüzü depoya dönük. Sahte Sabri depo eşiğinin bir adım önünde (`depo_on`), elinde boş çikolata ambalajı. Gerçek Sabri yağmurdan gelir; açık kapıda Ece'nin arkasında durur. Kapı, sensörün önünde durduğu için açık kalır.

**180° ekseni (Ece ↔ sahte Sabri):** Kamera her zaman B4'ün ana açısının tarafında kalır. Bölüm boyunca iki sabit yön var:
- **Sahte Sabri / DEPO hep kadrajın SAĞINDA.**
- **Kapı / dışarı / gerçek Sabri hep kadrajın SOLUNDA.**

| Görünüm | Kamera nerede, neye bakıyor | Sahte Sabri | Gerçek Sabri | Ece |
|---|---|---|---|---|
| `kapi` (Ece önden) | depo tarafında, kapıya bakar | kameranın sağ arkası (Ece kadraj sağına bakar) | Ece'nin arkasında, solda | önden |
| `kasa` (sahte Sabri) | kapı tarafında, depoya bakar | sağda, depo eşiğinde | kameranın arkası | — |
| 3 katman (g) | kasa açısı | arkada, sağda | ön planda solda, flu ense | ortada, ona döner |

Ece omzundaki ele dönerken sağ omzunun üstünden (kadraj soluna) döner. Böylece B4'teki "sol omuzdan dönüş" ile çakışmaz: dönüş yönü gerçek Sabri'nin durduğu tarafı gösterir.

**İki Sabri'yi ayırt eden işaretler (ikisi de aynı kadro görünüşü):**

| | Sahte Sabri (`sabri_sahte`) | Gerçek Sabri (`sabri`) |
|---|---|---|
| Elinde | boş çikolata ambalajı (B2'deki kızın; B4'ün kancası) | boş |
| Gözler | **hiç kırpmaz** (`kirpmaz`) | doğal kırpar |
| Gülüş | ağız kocaman sırıtır, gözler gülmez, açık ve donuk kalır (`sahteGulus`) | gülmez; endişeli, kararlı |
| Ten | mum/maske gibi parlak; erimeden önce giderek artar (`mumParlak` 0,35 → 0,9). "Maske" ödemesinin kurulumu | yağmurda ıslanmış: başta damlalar, şakaktan süzülen su, çeneden damlayan damla, koyulaşmış omuzlar (`yagmur`) |
| Işık | depo karanlığının soğuk-yeşil tekinsiz ışığı | kapıdan gelen mavi şafak kenar ışığı, yüzde sıcak floresan |
| Kadraj tarafı | sağ | sol |

## 1. Renk ve ışık senaryosu

| Blok | Duygu | Işık / renk |
|---|---|---|
| a, c, e (Ece önden, kapı arkada) | rahatlamaya çalışan korku | `soguk`, `karanlik` 0,12. Kapıdan mavi şafak kenar ışığı. Arka plan flu (`bgBlur` 6): yüz öne çıkar. |
| b, d (sahte Sabri) | sahte sıcaklık, tekinsiz | `tekinsiz` (doygunluk düşük, kontrast yüksek, ara sıra hafif titreme), `karanlik` 0,18. Arkasında zifiri depo. |
| f (gerçek Sabri) | insani, aciliyet | `normal`. Arkasında açık kapı, yağmur. Yüzü floresanda sıcak, kenarları mavi. |
| g (ne dönüyo) | bıkkın korku, komedi | `normal`, `karanlik` 0,1. En aydınlık kare; hemen ardından gelecek karanlığı büyütür. |
| h (dönüşüm) | dehşet | Floresan düzensiz titrer (sık karartmalar). Yeşilimsi kirli ton. Ağır vinyet. Kitin üstünde ıslak, beyaz parlama (üstten). Böceğin alt gövdesi gölgeye gömülür (üstten ışık). Antenin floresana çarptığı anda kıvılcım + sert titreme. |
| i (hayranınım) | panik + komedi | `tekinsiz`, `karanlik` 0,2. Üstten böceğin başının gölgesi Ece'nin üstüne düşer, anten uçları kadrajın tepesinden yüzüne doğru yoklar. Hafif sarsıntı (`turb`). |
| j (son kare) | çözülmemiş tehdit | Tavanda titreyen floresan, alt açı, ağır vinyet; siyaha sert kesme. |

**Her sahnedeki üç hareket katmanı:**
- Birincil: oyuncu eylemi.
- İkincil: floresan titremesi, kapıdan esen yağmur, anten salınımı, palp seğirmesi, salya.
- Ortam: camın ardında yağmur, duman (yanık yüz), dökülen damlalar.

## 2. Çekim listesi (tahmini süreler; seslendirmeden sonra Whisper zamanlarına göre kayar)

| # | Zaman | Sahne / görünüm | Ölçek · kadraj | Hareket / açı | Oyunculuk / mimik | Replik (tahmini süre) | Neden |
|---|---|---|---|---|---|---|---|
| 1 | 0,00-1,13 | a · `kapi` | yakın Ece, yüz üst-orta | hafif `yaklas` | korkmuş, solgun (0,35), gözler kadraj sağına (sahte Sabri). Dağınık saç (B4 sürekliliği). | **"sabri abi?"** (1,0 sn), ilk karede başlar | **Sesli soğuk açılış.** İlk saniyede soru, B4'ün son karesine cevap. |
| 2 | 1,13-3,53 | b · `kasa` | orta, bel üstü sahte Sabri | sabit | `sahteGulus` + kahkaha sarsıntısı (omuzlar, baş geri). "sakin kız sakin"de iki eli açık (`ellerAcik`), sağ elde ambalaj görünür. Kırpmaz. | **"sakin kız sakin ilk iş günü şakası..   gece vardıyasına…"** (tek kayıt, 5,6 sn, `tasma`) | Sahte rahatlama. Ambalaj ve donuk göz ilk ipucu. |
| 3 | 3,53-5,23 | ekleme `ece_yakin` | yakın Ece | yavaş yaklaşma | korkmuş → 0,8 sn'de şüpheli (gözler kısılır). Replik bu karede sürer. | (2'nin devamı) | **Dinleyenin yüzü:** Ece inanmak istiyor ama inanmıyor. |
| 4 | 5,23-6,83 | b · `kasa` | yakın sahte Sabri | `yaklas` | kahkaha söner; gülüş yüzde **donup kalır**, gözler hâlâ kırpmaz. Kollar iner. | (2'nin sonu: "…yaptığımız şaka") | Gülüşün fazla uzun durması tekinsizliği kurar. |
| 5 | 6,83-9,37 | c · `kapi` | orta Ece (eller görünür) | sabit | şaşkın + tedirgin, avuçlar yukarı ("ne diyosun abi" jesti). Yarım gülme. | **"abi sen benle taştaş mı geçiyorsun"** (2,3 sn) | Komik boşalma. Ölçek değişir (yakın → orta). |
| 6 | 9,37-12,90 | d · `kasa` | yakın sahte Sabri | yavaş `yaklas` | kıkırdama (hafif sarsıntı). Sol eliyle "gel" (`cagir`). "biraz"dan sonra 0,5 sn gülüş donar. Mum parlaklığı artar (0,5). | **"depoya gel çay yaptım içte sakinleş biraz"** (3,0 sn) | Davet = tuzak. İzleyici kural 2'yi biliyor. |
| 6b | 12,90-16,40 | d2 · `kapi` | orta Ece → 2,35 sn'de "ELİ"de yakına kesme | sabit → `yaklas` | "Şaka mı?.."da şüpheli, avuçlar açık. "bir adamın eli yürüdü"de bakışı aşağı kayar (B3'teki eli hatırlar, `bakSira`). "ELİ"de kesmeyle yakın, bakış yeniden sahteye. | **"Şaka mı?.. Abi bir adamın eli yürüdü… ELİ."** (3,2 sn) | Kullanıcı kararı. B3 geri çağrısı. "ELİ" vurgusu kesme + yaklaşmayla görüntüye de biner. Hemen ardından gelen omuzdaki el, sözün görsel ödemesi olur. |
| 7 | 16,40-17,40 | e · ekleme `omuz_el` | yakın Ece (kamera ona dönük, arkada açık kapı) | el kamerası, çok hafif | Ece çekinerek bir adım atar (kameraya doğru, büyür). 0,76 sn'de gerçek Sabri'nin ıslak gri hırkalı kolu kadrajın sol üstünden, Ece'nin **omzunun arkasından** gelir. El sırtı omzun arkasında kalır; yalnız parmaklar **sağ omzunun dış ucundan** öne sarkar, kumaşa gömülür. Sahibi görünmez: kadraj kenarında flu koyu bir kütle. | — | Kullanıcının tarifi: kamera Ece'ye dönük, el görünür, sahibi görünmez. (İnceleme 1, md. 1: kol artık boyna değil, omzun dış ucuna, arkadan.) |
| 8 | 17,40-18,13 | aynı ekleme (süren) | aynı | 0,16 sn sarsıntı | **İrkilme:** gövde yaylı sıçrar (esneme, sonra iniş ezilmesi), omuzlar kalkar, baş geri gider. İki eli göğsüne fırlar. Gözler şokla açılır (göz bebekleri küçülür), kaşlar en yukarıda. Ağız "O"dan "A"ya. Mikro sarsıntıdan sonra yumuşak oturur. Kafadan komik bir ter damlası fırlar. | **"hoaa"** (0,6 sn) | Ani korku + komedi. |
| 9 | 18,13-19,43 | aynı ekleme (süren) | aynı | — | Önce gözler elin tarafına (kadraj soluna) kayar, 0,25 sn önden. Sonra baş 2.5D olarak **sağ omzunun üstünden elin tarafına** döner ve profilde (88°) durur. Gövde 42° birlikte döner (Exorcist etkisi yok). Elin altındaki kol iner, öteki el göğüste kalır. At kuyruğu savrulur. | — | Dokunulan tarafa dönüş. Kesme profilde, hareketin içinde. |
| 10 | 19,43-22,17 | f · `kapi` | orta-yakın gerçek Sabri. Ön planda sağda Ece'nin sırtı (2.5D, hafif flu, başı ona dönük) | yavaş `yaklas` | Islak, nefes nefese. Önce Ece'ye bakar (aşağı-sağ). "o ben değilim"de bakışı kadraj sağına, sahteye kayar; sağ eli o yönü gösterir (`isaret`). | **"Ona inanma kızım, o ben değilim"** (2,4 sn) | İfşa. Omuz üstü (OTS) çekim Ece'yi kadrajda tutar. |
| 11 | 22,17-24,03 | g · `kasa` 3 katman | orta-geniş. Önde solda gerçek Sabri'nin flu ıslak ensesi. Ortada Ece (bankonun önünde, `onde`), arkada sağda sahte Sabri (kıpırtısız, gülüş donuk, yüz parlıyor) | sabit | Ece iki eli başında (`basTut`), bıkkın. Baş ping-pong yapar: gerçek Sabri'ye → sahteye → gerçeğe → sahteye (`bakSira`, 0,18 sn'lik hızlı dönüşler). | **"ne dönüyo lan burda!"** (1,5 sn) | **İki Sabri aynı karede.** Eksen korunur: sahte sağda, gerçek solda. |
| 12 | 24,03-28,43 | h · ekleme `donusum_yuz` | yakından çok yakına (sahte Sabri'nin yüzü) | yavaş yaklaşma. Çatlamada ve tıslamada sarsıntı | **Dönüşüm I (yüz).** 0-0,6: gülüş donar, bir göz seğirir, yüz mum gibi parlar. 0,45-2,1: yüz **yanmış maske gibi erir**: hatlar aşağı akar, kaş/göz/burun/çeneden kalın deri damlaları sarkar ve kopup düşer, çenenin altından erimiş deri perdesi iner. Kenarlar kömürleşir, kabarcıklar kabarıp patlar, yüzden duman tüter. Kafanın tepesinde maskenin ardındaki **koyu böcek kafası belirir**. 1,55-2,25: yüzde kor ışıklı çatlaklar. 2,2-3,6: **deri beş parça hâlinde menteşesinden katlanarak soyulur** (önce çene, sonra alın, sonra yanaklar). Parçalarla böcek kafası arasında simbiyot lifleri gerilir, incelir, kopar, uçları kıvrılıp söner. Soyulan deri yerçekimiyle düşer. Altından ıslak kitin kafa çıkar: yanlarda bileşik gözler, testere dişli mandibulalar, ıslak kırmızı gırtlak, seğiren palpler. 2,7-3,9: pronotum kalkanı kafanın arkasından başlık gibi açılır, siper başın üstüne iner. 3,0-4,3: antenler kıvrılarak uzar, salya ipleri, tıslama; son saniyede baş salınır, öne itilir. | — (ses: cızırtı, ıslak yırtılma, kitin çıtırtısı) | Kullanıcının tarifi birebir. Espri yok. |
| 13 | 28,43-29,33 | ekleme `ece_yakin` | yakın Ece | — | Anime şok gözü (B4'teki gibi), solgunluk 0,9, ağız açık. | — | Dinleyenin yüzü. B4'ün göz gag'ine geri çağrı. |
| 14 | 29,33-33,93 | h · ekleme `donusum_govde` | tam boy → geniş | **tilt-up + uzaklaşma**, büyümeyi sönümlü izler | **Dönüşüm II (gövde).** 0-0,6: insan gövdesi kıvranır, göğüste kor çatlak. 0,6-1,4: hırka ve deri ortadan yırtılır, iki yana katlanıp soyulur, lifler gerilip kopar. Altından bacaklar yaylı olarak açılır (ön çift saldırı pozunda, orta çift yana). 1,05-2,7: böcek **tavana kadar büyür** (yay, hafif taşma). Pronotum başın arkasından başlık gibi açılır. Soyulan deri ve hırka yere düşüp seker, yerde buruşuk bir deri+hırka yığınına döner (çikolata ambalajı da yere düşer). 2,42: anten floresana çarpar, kıvılcım, sert titreme. 2,1-2,5: kanatlar kabarır. 3,3-4,5: baş öne eğilir, ön bacaklar uzanır. | — | Devasa, ayakta, ürkütücü. Kamera büyümenin arkasından gider: boyutu izleyici hisseder. |
| 15 | 33,93-36,53 | h · ekleme `bocek_dev` | geniş, alt açı. Önde Ece'nin sırtı (ölçek) | yavaş yaklaşma, tıslamada sarsıntı | Böcek tavanı dolduruyor. Yerde iki deri yığını ve ambalaj. Kanatlar kabarır, **tıslar** (mandibulalar ardına kadar). Baş Ece'ye doğru eğilir. Ece yarım adım geri sendeler, başı yukarıda, titrer. | — | Ölçek ve tehdit tek karede. |
| 16 | 36,53-37,43 | i · `kapi` | yakın Ece | sabit, hafif sarsıntı | Böceğin gölgesi üstünde, anten uçları yüzüne doğru yoklar. **Nefes çekme** (`hik`): omuzlar kalkar, göğüs şişer, baş geri, gözler büyür, ağız küçük "o". | **"hıığğ"** (0,9 sn, `gapAfter` 0) | Panik. Ardından boşluksuz 17'ye geçer (kullanıcı kararı; seste tek kayıt olarak da alınabilir). |
| 17 | 37,43-40,03 | i · `kapi` | orta Ece (eller görünür) | yavaş `yaklas` | **Zoraki gülümseme** (`zorGulumse`: kaşlar korkuyla yukarıda, ağız sırıtır). Eller göğüste kenetli (`ellerKenetli`, hayran pozu). Gözlerde yaş (0,25), alında ter. | **"abi vallahi büyük hayranınım."** (2,2 sn) | Bölümün komik düğmesi: korkudan yaranmaya çalışma. |
| 17a | 39,77-41,17 | i · ekleme `bocek_kukreme` | yakın böcek (baş, pronotum, ön bacaklar; alt açı) | hamle + titreşim | **Kükreme** (kullanıcı eklemesi): 0-0,22 hazırlık (baş geri, mandibulalar kapanır, antenler kalkar). 0,22-1,15 kükreme: mandibulalar ardına kadar açılır, ıslak kırmızı gırtlak, antenler **geriye yatar**. Baş ve ön bacaklarla öne hamle eder, titrer. Kanatlar kabarır, ağızdan hava halkaları çıkar. Salya damlaları kameraya sıçrar. Floresan sert çakar. Sonra oturur. | (ses: kükreme) | Hayranlık itirafına cevap. Korkunun doruğu. |
| 17b | 41,17-42,07 | i · ekleme `ece_yakin` (rüzgâr) | yakın Ece | titreşim | Kükremenin üfürüğü: saç tutamları kadraj sağına savrulur, rüzgâr çizgileri geçer. Gözler sımsıkı kısılır, yüz acıyla buruşur, baş yana eğilir, gövde sarsılır. | (kükreme sürer) | Dinleyenin yüzü; komik çaresizlik. |
| 17c | 42,07-43,77 | i · `kapi` | yakın Ece | sabit | Gözler açılır, zoraki sırıtış (`zorGulumse`), eller göğüste kenetli, ter + gözde yaş. **"lülü?"** cılız sesle. Ardından **1 sn sessizlik**: gözler kaçamak sola-aşağı, tekrar böceğe, tekrar kaçar (`bakSira`). | **"lülü?"** (0,7 sn) + 1,0 sn bekleme | Kullanıcı eklemesi. Sessizlik komedinin kendisi. |
| 17d | 43,77-45,47 | i · `kapi` | orta Ece | yavaş `yaklas` | **Mahçup** (`mahcup`): kaşlar yukarı-içe, gözler kaçamak aşağı-yana, utangaç sırıtma ve **dudak ısırma**, yanaklar kızarık. Omuzlar düşük (`omuzDus`), sağ eli ensesini kaşır (`kafaKasi`). Bir an böceğe bakıp yine kaçırır. | **"bu da mı olmadı?"** (1,4 sn) | Kullanıcı eklemesi: tedirgin + mahçup. |
| 18 | 45,47-47,67 | j · ekleme `bocek_yakin` | çok yakın böcek kafası (Ece'nin gözünden, alt açı) | iniş (yay), yaklaşma | Kafa kadraja iner. 0,7-1,15 sn'de **merakla başını yana eğer** (köpek gibi, 19°). Antenler kameraya, yani Ece'ye uzanır. Mandibulalar yavaşça açılır. Salya. **Bileşik gözlerde Ece'nin küçük yansıması** görünür (sarı kazak, at kuyruğu). | — (ses: tık tık mandibula, alçak tıslama) | **Son kare çözülmemiş soru:** Hayranlık işe yaradı mı, yoksa yiyecek mi? Komik + korkunç. |
| 19 | 47,67-48,17 | siyah | — | — | sert kesme | (tıslama siyahta kesilir) | Çözümden bir vuruş önce kes. |
| son | 48,17-52,17 | bitiş kartı | | | | "7/24 · Bölüm 6 yakında" | |

**Ölçek sırası:**
- yakın · orta · yakın · yakın · orta · yakın · orta→yakın · yakın (omuz) · orta-yakın (OTS) · orta-geniş (3 katman) · yakın→çok yakın · yakın · tam boy→geniş · geniş · yakın · orta · çok yakın.
- Aynı ölçek arka arkaya en fazla 3 kez geliyor.
- Görsel değişim her 0,9-2,6 sn'de bir oluyor. En uzun çekimler 12 ve 14; ikisinde de her an yeni bir olay var.

**Kancalar:**
- **İlk 2 sn:** İlk karede korkmuş Ece ve "sabri abi?" var. İzleyici B4'ün cevabını bekliyor; 1,1 sn'de gülen Sabri'ye kesme geliyor.
- **Orta:** "ELİ." (16,0), hemen ardından omuzdaki el (16,4), sonra iki Sabri (22,2).
- **Son:** Hayranlık itirafı, kükreme, "lülü?" ve mahçup "bu da mı olmadı?"nın ardından böcek başını merakla eğer, siyah.

## 3. Komedi / korku dengesi
- Senarist haritasıyla aynı ilke izlendi: **espriler dönüşümden önce ve sonra, dönüşümün kendisi sessiz.**
- **Komik vurgular** yalnızca görsel ve küçük:
  - c'deki avuçlar.
  - Omuz irkilmesinde fırlayan ter damlası.
  - g'deki ping-pong baş ve iki el başta.
  - 13'teki anime göz (B4 geri çağrısı).
  - i'deki hayran pozu ve zoraki sırıtış.
  - Son karede gözdeki Ece yansıması ve böceğin köpek gibi baş eğmesi.
- **Korku dönüşümde tam:** erime, yanık, lifler, kitin, salya. Hepsi floresan titremesi ve sert kontrastla verilir.
- "Korkutucu değil" eleştirisine karşı alınan önlemler:
  - Böcek tavanı dolduruyor.
  - Gözler pronotum siperinin gölgesinde.
  - Islak kırmızı gırtlak, testere dişler ve kıllı, dikenli bacaklar var.
  - Alt gövde karanlığa gömülü.
  - Yerde insan derisi ve hırka yığını duruyor.
  - Kamera büyümeyi alttan izliyor.

## 4. Yeni görsel varlıklar (kod)
Hepsi **opt-in**. Eski bölümlerin görüntüsü değişmedi: 724-04'ten 4 kare yeniden render edildi, teslim edilen videoyla PSNR 38-46 dB (kodlama farkı düzeyinde).

| Varlık | Dosya | Not |
|---|---|---|
| Dev hamamböceği `DevBocek`, kafası `BocekKafa`, `Bacak`, `Anten` | `src/studio/engine/bocek.tsx` | Özgün tasarım. Parametreler: açılma (yaylı), kanat, mandibula, eğilme/eğim, anten, pronotum açılması (`kalkan`), saldırı, insan kalıntıları, göz yansıması. Kontrol: `Bocek`. |
| `donusum_yuz` | `engine/Inserts11.tsx` | Rig yüzünün yer değiştirme filtresiyle erimesi; yanık filtresi (kararma, leke, kömürleşmiş kenar); organik damlalar ve deri perdesi; 5 parçalı soyulma (menteşe katlanması + yerçekimi); simbiyot lifleri (gerilir, incelir, kopar, kıvrılır, söner); duman. |
| `donusum_govde` | aynı | Gövdenin ortadan yırtılması, katlanarak soyulma, yere düşme + sekme → deri/hırka yığını; bacakların yaylı açılması; yaylı büyüme; sönümlü kamera takibi; kıvılcım; alt gövde gölgesi. |
| `bocek_dev`, `bocek_yakin` | aynı | Ölçek açılışı (Ece sırtı) ve son kare (baş eğme, anten, gözde yansıma). |
| `omuz_el` | aynı | Ece 2.5D önden. Islak hırkalı kol ve yaşlı el (eklemli parmaklar, kumaşta kıvrımlar, yağmur damlaları); yaylı sıçrama, "hoaa" ağız şekilleri, ter damlası, göz önde baş sonra dönüş. |
| `ece_yakin`, `ece_sirt`, `sabri_omuz`, `bocek_golge` | aynı | Tepki yakını (rüzgâr modu: savrulan saç, kısılan gözler); ön plan katmanları (OTS) ve böcek gölgesi + anten uçları. |
| `bocek_kukreme` | aynı | Kükreme: hazırlık, hamle, titreşim, geri yatan antenler, ağızdan hava halkaları, sıçrayan salya, floresan çakması, üstten kenar ışığı. |
| Pronotum bileşenleri | `engine/bocek.tsx` | `PronotumArka`, `PronotumSiper`: bütün böcek çekimlerinde tek tasarım. |
| Rig | `rig/Character.tsx`, `face.tsx`, `gestures.ts`, `types.ts` | `kirpmaz`, `mumParlak`, `yagmur`, `hik` (nefes çekme), `kahkaha`; duygular `sahteGulus`, `zorGulumse`, `mahcup`; ağız `isir` (dudak ısırma); `omuzDus`; jestler `cagir`, `ellerKenetli`. 2.5D: `Bas25D sok`, `Govde25D kolYok` (opt-in). |
| Kadro | `cast.json` | `sabri_sahte` (Sabri ile aynı görünüş). Ses eşlemesi `sesler_elevenlabs.json`'da Sabri'nin sesiyle aynı. |
| Motor | `engine/Episode.tsx`, `timeline.ts`, `types.ts` | Replik `sure` (ses yokken tahmini süre + taslak ağız); sahne `bgBlur` (alan derinliği); karakter `onde` (bankonun önünde), `bakSira` (vuruş içi baş çevirmeler). |

## 5. Görsel riskler
- **Ses gelince zamanlama:**
  - Omuz eklemesi üç vuruşa bölünmüş tek bir eğridir (zaman kayması 0 / 1,0 / 1,75). "hoaa" kaydının süresi değişirse `omuz_el` `text[1]` (irkilme anı) ve üçüncü vuruşun kayması birlikte güncellenmeli.
  - Sahte Sabri'nin uzun repliği `tasma` ile üç vuruşa yayılır. Gerçek süre 5,6 sn'den farklıysa ilk vuruşun `gapAfter`'ı = −(süre − 2,4) olmalı.
- **Altyazı bandı (y 1050-1260):**
  - Ece'nin kapı yakınlarında yüz y ≈ 380-1050 aralığında; uygun.
  - "ne dönüyo" karesinde altyazı Ece'nin göğsüne düşüyor; uygun.
  - Dönüşüm eklemelerinde altyazı yok.
- **Ön plan Ece sırtı (f):** gerçek Sabri'nin `isaret` eden sağ eli Ece'nin başının arkasında kalabiliyor. Bakış yönü ve baş, işareti zaten taşıyor; istenirse Sabri kadrajda biraz sola alınır.
- **3 katmanda gerçek Sabri:** yalnızca flu ense ve omuz olarak görünüyor. Kim olduğu bir önceki karede (f) kurulduğu için okunur. Daha net istenirse ense keskinleştirilir.
- **Böceğin gövdesi önden tam simetrik.** Bacak seğirmesi, anten ve palp hareketi bunu kırıyor, ama uzun tutulursa "çizim" gibi durabilir; o yüzden geniş kare 2,6 sn'de tutuldu.
- **Performans:** dönüşüm eklemeleri ağır (çoklu rig kopyası + SVG filtreleri). Tam bölüm yarı çözünürlükte 2,5 dk'da render oluyor; tam çözünürlükte tahminen 8-10 dk.

## 6. Örnek klipler (yalnız iç kontrol; kullanıcıya gönderilmedi)
`ornekler/` altında: `b5-ornek-yuz.mp4`, `b5-ornek-govde.mp4`, `b5-ornek-omuz.mp4`, `b5-ornek-dev.mp4`, `b5-ornek-kukreme.mp4`, `b5-ornek-son.mp4`, `b5-ornek-taslak.mp4` (bütün bölüm, ElevenLabs sesleriyle, yarı çözünürlük, miks/mastering yok). Kamera kesmeleri gerçek kelime zamanlarına bağlandı (b: "gece"de Ece'ye, "ilk iş günü"nde yakına; d2: "ELİ"de yakın; f ve g bakışları). İnceleme ve düzeltmeler: [b5-inceleme-1.md](b5-inceleme-1.md). Durumları gece notunda: `b5-gece-durum.md`.

## 7. Açık kararlar (kullanıcıya)
1. ~~Senarist önerileri~~: kullanıcı kararıyla kapandı. Yalnızca "ELİ" repliği girdi (6b).
2. **Son kare:**
   - A) Böcek merakla başını eğer, siyah. **(önerim, şu anki hâli)**
   - B) Böcek de "hıııı" der gibi geri tıslar.
   - C) Siyahta gerçek Sabri'nin sesi.
   - B ve C yeni ses/replik ister.
3. **Bitiş kartı alt yazısı:** şu an yalnızca "Bölüm 6 yakında". Soru cümlesi (ör. izleyiciye "Sen olsan ne derdin?") bir metin kararıdır, kullanıcıya bırakıldı.
4. **Gerçek Sabri dönüşüm sırasında:** şu an kadraj dışında. İstenirse 14 ile 15 arasına 0,8 sn'lik bir tepki karesi (ıslak, şaşırmamış yüz) girer. Bu bir hikâye ipucu olur ("biliyordu"), kullanıcı kararı.
