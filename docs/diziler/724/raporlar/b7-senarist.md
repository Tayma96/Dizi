# 7/24 · Bölüm 7 (P1 + P2 + P3): senarist yardımcısı raporu, çekim çekim komedi planı

Tarih: 24 Kasım 2026 (gece çalışması). Kaynak: `b7-gece-brief.md`, `bolumler.md` "Bölüm 7, Parça 1/2/3", B1-B6 replikleri, mevcut sesler (`public/voice/724-07*`, süreler manifestlerden), `tools/b7p1devam.py`, `Inserts16.tsx`, `arastirma.md` §1-3, §7.
**Doğaçlama izni:** 7/24 B7, kullanıcı: "Doğaçlamalar serbest." Kullanıcının replikleri ve noktalaması AYNEN korunur. Bu rapordaki her yeni replik **[YENİ]** ile, her sözsüz ekleme **[D]** ile işaretli. Sabah kullanıcıya listelenecek.

## Genel değerlendirme
Metin, 5-6. bölümün dramından sonra tam doğru yerde: aynı ev, aynı anne-kız, kirli sepetinde bir deste para. Komedinin motoru hazır. Ece bütün gece dev böcekten sağ çıktı ama annesinden korkuyor. Para görünce de korkusunu unutuyor. Önceki sürümün sorunu fikir azlığı değildi; her replik ayrı bir poz gibi duruyordu. Bu plan her vuruşa bir **neden-sonuç zinciri** kuruyor: Ece "lan" der, anne kulağına yapışır; Ece parayı kapar, anne boş eliyle kalır; sonra anne parayı geri kapar, bu kez Ece boş eliyle kalır. Böylece tepkiler birbirini doğurur, kimse poz verip durmaz.

## Öncelikli 3 öneri

1. **Her şakayı bir öncekine bağla (sebep-sonuç zinciri, "üçleme" ve aynalama).**
   - Sorun: Önceki sürümde jestler birbirinden kopuk olduğu için sahne "oldu bittiye gelmiş" okunuyordu.
   - Öneri: (a) Ece içeri girince annesinden "terlik mesafesi" kadar uzakta durur. Anne A06'da bu mesafeyi kapatır, kulak çekme mümkün hâle gelir. (b) İlk "lan"da ("Oha lan") anne kulağa yapışır, ikinci "lan"da ("ama çok para lan") kulağı bir kat daha yukarı çeker. (c) Ece desteyi kapar, annenin eli havada boş kalır. A08'de anne desteyi geri kapar, bu kez Ece'nin eli havada boş kalır. (d) Anne açılışta çorabı koklayıp "Iyy" der. Ece de desteyi koklar ama mest olur: anne-kız aynası.
   - Etki: Her 2-4 sn'de bir tepki, her tepki bir sonraki eylemin sebebi olur. Ölü bölge kalmaz (`arastirma.md` §1b: 2-4 sn'de görsel değişim, 15-30 sn'de yeni bilgi).

2. **"Böcek evde de var terliği vur geç" lafını gözümüzün önünde gerçekleştir [D]: anne konuşurken yerden geçen küçük, sıradan bir hamamböceğini bakmadan ezer.**
   - Sorun: Terlik lafı tek başına kalırsa yalnızca bir söz olarak geçer. Kullanıcı annenin bu lafta bile öfkeli olmasını istiyor.
   - Öneri: Ece'nin "ölüyodummm" sözü biter bitmez makinenin altından küçük bir böcek çıkar. Ece görür, nefesi kesilir, donar. Anne öfkeyle "Böcek evde de var" der, "terliği vur" sözünde Ece'ye bakmaya devam ederek tek adımla böceği ezer (ÇAT). "geç" sözünü söylerken aşağı bakmaz bile. Ece yere, sonra annesine bakar: dehşet ve hayranlık bir arada.
   - Etki: Laf kendini kanıtlar. Bütün gece dev böcekle boğuşan kızın karşısında anne bir böceği bakmadan ezer. İzleyicinin "bizim anne" diye etiketleyip paylaşacağı an budur (§1b paylaşım tetikleyicisi). Üretimi kolay: B5'in küçük böcek varlığından tek bir böcek, annenin tek adımı, bir efekt sesi.

3. **İç sesin 5 saniyesini ölü bölge olmaktan kurtar: annenin baskısı artsın, Ece'nin hayali kısa bir ekle görünsün [D].**
   - Sorun: E06 en uzun replik (5,15 sn). Kulak tutulurken iki karakter duruyorsa sahne burada düşer.
   - Öneri: İç ses boyunca anne her saniye 1-2 cm yaklaşır, gözlerini kısar, kulak tutuşu gerilir. Ece'nin gözleri kaçamak sağa sola kayar, şakağında ter damlası belirir. "tekrar gitmeme izin vermez" sözünde 0,8 sn'lik bir hayal eki girer: renk tonu farklıdır (soluk sepya, kenarları yumuşak), anne kapının zincirini takıyor, kollarını kavuşturmuş başını sallıyor (B6'nın `ev_zincir` ekinin yeniden kullanımı). Ekin kollarında V şekli olmasın; anne yalnız zinciri takıp kapıya yaslanabilir.
   - Etki: İç ses görüntüyü tekrar etmez, gizli bilgi verir (çerçevenin 6. maddesi). Hayal eki 13-25 yaş kitlenin "kafamdaki senaryo" mizahına oturur.

---

## PARÇA 1: Banyo, 18:00 (hedef ~61-63 sn)

**Mekân ve ışık (süreklilik):** Kasım, 18:00, dışarısı **karanlık**. `b7p1devam.py` notundaki "gün batımı ışığı" bu saate uymuyor, düzeltilmeli. Önerilen ışık: anahtar ışık tavan lambası (sıcak sarı); dolgu ışığı aynadan ve fayanstan yansıyan soğuk beyaz; arka ışık koridordan sızan sarı ışık (Ece'nin girişini motive eder). Pencere varsa lacivert-siyah, karşı apartmanın birkaç ışığı yanıyor.
**Coğrafya (180° kuralı):** makine ve anne solda, sağa (Ece'ye) bakar. Kapı ve koridor sağda, Ece sola (anneye) bakar. Lavabo ve ayna sol arka.
**Mantık:** Ece sabah eve ağlayarak geldi (B6), kotunu sepete atıp pijamayla yattı. Paranın cebinde kalması travmanın sonucu, ayrıca 10 saatlik uyku "uyan kız artık" sözünü haklı çıkarır.

| Zaman (sn) | Vuruş | Kim ne YAPIYOR (eylem) | Dinleyenin TEPKİSİ | Kamera | Ses | Neden komik / işlevi |
|---|---|---|---|---|---|---|
| 0–14,55 | Açılış (korunur) | Beğenilen v2 açılışı: anne çamaşır, çorap koklama + "Iyy", "Eceee uyan kız artık", cepte deste, "yuhh", "Eceeee". | — | Mevcut | Mevcut | Kullanıcının beğendiği tek bölüm. Yalnız ışık 18:00'e göre düzeltilir. Anne sonunda desteyi sağ elinde tutar. |
| 14,55–15,6 | Giriş 1: gölge [D] | Koridordan önce terlik sürüme sesi gelir, sonra sağdaki kapı aralığının önünde yerde Ece'nin gölgesi belirir. Gölge durur, geri çekilir, yeniden gelir. | Anne kapıya döner, desteyi rozet gösterir gibi kaldırır, kaşı havada. | Orta, iki kişilik; kapı sağda, anne solda | terlik "şıp… şıp", esneme (nefes, replik değil) | "Kimse havadan belirmez" kuralını uygular. Ece'nin annesinden korkusu daha görünmeden okunur. |
| 15,6–16,6 | Giriş 2: el ve yarım yüz [D] | Kapı pervazını dört parmak kavrar, ardından yarım yüz görünür: tek göz açık tek göz kapalı, topuz yamuk, yanakta yastık izi (`uyku` var). | Anne kıpırdamaz, gözlerini kısar (`supheli`). | Aynı | kapı gıcırtısı (kısa) | Dev böcekten sağ çıkan kız annesinin "Eceeee"sinden korkuyor. Karşıtlığın kendisi komik. |
| 16,6–17,8 | Giriş 3: güvenli mesafe [D] | Ece iki adım atar, annesinin kol boyunun dışında durur (~1,5 kol). Gözü önce desteye, sonra sepetteki kota kayar; "ah, cepte unuttum" anlar (`mahcup`). Yutkunur. | Anne desteyi hafifçe sallar: "bunu mu arıyorsun?" | Orta | yutkunma | **Kurulum:** mesafe (A06'da ödenir). Ece paranın nereden çıktığını anlar; sebep-sonuç kurulur. |
| 17,8–21,2 | **A04** "nerden geldi bu paralar nasıl bi marketmiş lan o" | Anne her vurguda ("nerden", "nasıl", "lan o") desteyi Ece'ye doğru sallar, yarım adım öne çıkar. Öfkeli. Bakışı Ece'de. | Ece her bağırışta göz kırpar, başı geri çekilir (`tilt`), omuzları kalkar. | Anne sol önde, Ece sağda, iki kişilik orta | deste "fırr" (her sallamada) | Annenin ağzındaki "lan" sonra Ece'nin "lan"ına bağlanır (ironi). |
| 21,2–21,5 | Böcek flaşı [D] | "market" sözü Ece'de geceyi tetikler: 0,25 sn'lik flaş, B5 dev böceğin yüzü (mevcut varlık), sert kesme. | Ece'nin yüzü `dehset`, gözleri şok. | Aşırı yakın flaş, sonra Ece bel üstü | kısa böcek cıyırtısı + nefes | Efekt hikâyeden doğar (travma). E01'deki paniği motive eder. Kullanılmazsa da sahne işler; isteğe bağlı. |
| 21,5–25,1 | **E01** "anneee dev gibi böcek vardı markette ölüyodummm" | Ece panikle anlatır: "dev gibi"de parmak ucunda yükselir, gözleri faltaşı (kol yukarı **kaldırılmaz**, V-kol riski). "böcek"te işaret parmaklarını başına anten gibi diker (önden, dikey kol, `onKol`). "ölüyodummm"da dudağı titrer (`aci`). | **A seçeneği:** anne "dev gibi böcek" sözünde 0,4 sn donar (gözler hafif şok, deste eli 2 cm düşer), sonra "ölüyodummm"da göz devirip öfkesine döner. **B seçeneği:** donma yok, anne baştan göz devirir. | Ece bel üstü, annenin tepkisine 0,6 sn kesme (omuz üstü yakın) | — | A: B6'nın "yoksa öğrendi mi?" açık döngüsünü sözsüz canlı tutar (dramatik ironi: izleyici annenin bir şey bildiğini biliyor). Karar kullanıcının (soru 2). |
| 25,1–27,95 | **A05** "Böcek evde de var terliği vur geç" + böcek ezme [D] | "ölüyodummm" biter bitmez makinenin altından küçük, sıradan bir hamamböceği çıkar, Ece'nin ayağına doğru koşar. Anne öfkeyle konuşur. "terliği vur"da Ece'den gözünü ayırmadan tek adımla ezer. "geç"te aşağı bile bakmaz. | Ece böceği görünce nefesi kesilir, tek ayağı havada donar (`dehset`). ÇAT'ta irkilir, gözleri kapanır. | İki kişilik orta, yer kadrajda (böcek okunur büyüklükte, alt üçte birde) | böcek tıkırtısı, "ÇAT" (kuru, net), ardından 0,2 sn sessizlik | Laf eylemle kanıtlanır. Annenin öfkesi abartılı bir sakinlikle birleşince güldürür. Öncelikli öneri 2. |
| 27,95–28,65 | Sessiz vuruş [D] | Anne ayağını kaldırmaz, Ece'ye bakmaya devam eder: "Evet?" | Ece gözlerini yavaşça yerden annesine çıkarır: dehşet + hayranlık. | Ece yakın (duygu doruğu, kısa) | — | Kısa duraklama gülme payı bırakır. |
| 28,65–30,45 | **[YENİ] Y1** Ece (fısıltı): "anne vallahi büyük hayranınım." | Ece fısıldar, korkuyla sırıtır (`zorGulumse`), bir adım geri çekilir. | Anne gözlerini kısar, bir kaşı kalkar (`alayci`→`ofkeli`). | İki kişilik orta | — | B5'teki "abi vallahi büyük hayranınım." repliğine gönderme. Korkunca dalkavukluk Ece'nin tekrar eden şakası olur. B5'i izleyen hemen yakalar, yorumlara yazar. İsteğe bağlı (soru 3); çıkarılırsa parça 1,8 sn kısalır. |
| 30,6–34,4 | **A06** "para diyorum Ece para bu para ne alakaaaa?" | Anne iki adımda mesafeyi kapatır (**ödeme:** güvenli mesafe bitti), desteyi Ece'nin burnunun önünde sağa sola sallar. "alakaaaa"da başını öne uzatır, gözler kocaman. | Ece'nin gözleri desteyi kedi gibi sağa sola izler, baş hafifçe takip eder. Korkusu erir, açgözlülüğe döner (`saskin`→hafif `mutlu`). | İki kişilik, deste ön planda ortada | deste hışırtısı (sallama ritminde) | Kedi-lazer şakası: Ece para karşısında hipnotize. Bir sonraki repliği doğurur. |
| 34,7–37,6 | **E02** "çok mu ya o kadar ver bi bakıyım" | Ece meraklı, burnu desteye yaklaşır. "ver bi bakıyım"da desteyi kapar (hızlı, tek hamle, önden). | Annenin eli havada boş kalır. | Orta; kapma anında elin kısa yakını (isteğe bağlı) | "fişşt" | **Kurulum:** boş el (A08'de tersine döner). |
| 37,6–38,2 | Boş el [D] | Ece desteyi göğsüne bastırır. | Anne 0,6 sn önce boş eline, sonra Ece'ye bakar (`saskin`→`ofkeli`). | Annenin yarım planı | — | Klasik boş el tepkisi. Annenin şaşkınlığı tek kesmede okunur. |
| 38,2–38,8 | Parmak tükürükleme [D] | Ece başparmağını diline değdirip sayma pozisyonu alır. | Anne iğrenir (`igrenmis`), çorap koklamadaki yüze döner (açılışa gönderme). | Ece bel üstü | dil şaplatma (küçük) | Türk izleyicinin bildiği "tükürüklü sayma" hareketi. Tanıdık olduğu için güldürür. |
| 38,8–41,9 | **E03** "yüz, iki yüz, yüz, iki yüz" | Yakın `para_say` eki: banknotlar parmak altında kayar. Ece heyecandan 200'ü geçemez, başa döner (replik zaten öyle). | Anne istemeden Ece'nin omzunun üstünden eğilip saymaya bakar. "iki yüz"de onun da kaşları kalkar: o da etkilenmiştir. Sonra kendini toplar, kaşlar iner. | Yakın ek (deste), sonra iki kişilik | banknot "tık tık" | Anne de açgözlülüğe bir an kapılır: "elma ağacından uzak düşmez." |
| 42,05–44,4 | **E04** "Oha lan ne çok para" | Ece desteyi yanağına bastırır, sonra burnuna götürüp derin derin koklar, mest olur (`mutlu`, gözler kapalı). | "lan"da annenin göz kapağı seğirir. Sol eli omuz hizasından, soldan yavaşça kalkar. | Ece bel üstü; annenin eli kadraja soldan girer | uzun koklama nefesi | **Aynalama:** anne çorabı kokladı "Iyy", kız parayı kokluyor "mmm". **Sebep:** "lan" → kulak. |
| 44,5–47,35 | **E05** "aauuv ah ah acıyo" (kulak) | Annenin eli soldan, omuz hizasından gelip kulağı tutar ve yukarı kaldırır. Ece parmak ucuna kalkar. Desteyi yine de bırakmaz, göğsüne bastırır. | Anne çenesini sıkar (`ofkeli`), Ece'ye bakar. | **Ece yakın plan** (beğenildi) | kulak çekme "gıcırt" (hafif, çizgi film tadında) | Acı içinde bile parayı bırakmaz: açgözlülük şakasının doruğu. |
| 47,45–49,2 | **A07** "nerden geldi bu para?" | Anne kulağı tutarken yüzünü Ece'ninkine yaklaştırır, sesi alçak ve keskin. Bakışı Ece'nin gözünde. | Ece'nin gözleri annesinden kaçar, yana kayar. | İki kişilik yakın orta (iki yüz yakın) | — | Gerilim alçak sesle yükselir, bağırmakla değil. |
| 49,4–54,55 | **E06** iç ses "şimdi olanları anlatırsam…" | Ece'nin dudakları kıpırdamaz. Gözler sağa sola kayar (`dusunceli`), şakakta ter damlası belirir. 52,5'te 0,8 sn hayal eki girer (sepya ton): anne kapının zincirini takar, kapıya yaslanıp başını sallar. | Anne her saniye biraz daha yaklaşır, gözler kısılır, kulak tutuşu hafifçe gerilir. | Ece'ye yavaş itme (düşünce motive eder); hayal eki tam kare | iç ses kuru ve yakın; hayal ekinde zincir "şıkırt" | Öncelikli öneri 3. Bakış kuralına bilinçli istisna: iç seste Ece annesine bakmaz (kaçamak), çünkü yalan arıyor. |
| 54,75–57,35 | **E07** "ama çok para lan" | Ece kulağı tutulurken desteye bakıp sırıtır (`zorGulumse`→`mutlu`), sesli söyler. | **İkinci "lan":** anne kulağı bir kat daha yukarı çeker. | Ece bel üstü | — | Üçleme kalıbı: lan → kulak, lan → daha yukarı. İzleyici ikinciyi bekler ve güler. |
| 57,35–57,75 | **[YENİ] Y2** Ece: "Iıh!" (tek hece, ağrı) | Ece bir kademe daha parmak ucuna kalkar. | — | Aynı | — | Yeni kredi gerekmeyebilir: E05b çekiminin (4,05 sn) içinden kesilebilir (ses yönetmenine not). |
| 57,75–61,4 | **A08** "git elini yüzünü yıka bu paranın hesabını vereceksin bana!" | "git"te anne kulağı bırakır. "bu paranın"da desteyi Ece'nin elinden geri kapar (**ödeme:** boş el tersine döner). "hesabını"da sol eliyle lavaboyu gösterir. Son sözde desteyi hırkasının cebine sokar (**kurulum: P3**). | Ece'nin eli havada boş kalır, boş eline bakar (`saskin`), sonra kulağını ovuşturur (`mahcup`, asık surat). | İki kişilik orta | kapma "fişşt", cep hışırtısı | Ayna ödemesi: kapan kapana. Para annenin cebinde, P3'ün "o para...." anına hazır. |
| 61,4–63,0 | Çıkış [D] | Ece lavaboya yürür ama başı annenin cebine dönük kalır (vücut ileri, kafa geri). Aynanın önünde durur. Kulağı kırmızı (renk). | Anne cebine elini koyar, kolları belinde DEĞİL (V-kol yok); bir eli cebinde, öbürü yanda. | Orta, Ece kadrajın soluna (aynaya) yürür | terlik "şıp şıp" | Para merakı sürer. **Süreklilik:** kırmızı kulak P2'de aynada görünür. Mini soru: "Ece ne uyduracak?" |

**P1 toplamı: ~63 sn** (Y1 çıkarılırsa ~61 sn).

**Kol ve bakış denetimi (P1):** "dev gibi"de kol yukarı kaldırılmaz, parmak ucu ve göz yeter. Anten: iki işaret parmağı alına, önden, kısaltılmış üst kol (`onKol`). Anne eli belinde durmaz (V/U kol). Kulak eli soldan, omuz hizasından gelir. Bütün repliklerde konuşan karşısındakine bakar; tek istisna E06 iç ses.

---

## PARÇA 2: Ayna (hedef ~20-21 sn)

**Mekân:** B1'in aynası. İzleyici bu aynada "Bu ne olamazz" sivilce sahnesini gördü. Işık: ayna üstü lamba anahtar ışık (beyaz), koridordan sıcak sarı arka ışık. Pencere karanlık.
**Süreklilik:** kırmızı kulak (P1'den), sivilce (B1'den beri, küçülmüş), topuz dağınık, yastık izi solmuş.

| Zaman (sn) | Vuruş | Eylem | Tepki / iç durum | Kamera | Ses | Neden / işlev |
|---|---|---|---|---|---|---|
| 0–1,2 | Kanca: ayna [D] | Ece aynaya girer, musluğu açar. Aynada kırmızı kulağı görünür, dokunur, yüzünü buruşturur (`aci`). | — | Ayna görüntüsü (B1 FPS diline gönderme), bel üstü | su sesi başlar | İlk saniyede soru: "kulağına ne oldu?" P1'e bağlanır. |
| 1,2–2,2 | Sivilce bakışı [D] | Aynaya eğilir, sivilceyi görür, 0,6 sn ona dik dik bakar (`supheli`), "hâlâ mı?" der gibi iç çeker. | — | Ayna, yakın orta | iç çekiş | B1/B2 sivilce şakasının sessiz ödemesi; replik gerekmez. |
| 2,2–3,8 | Yüz yıkama [D] | İki avuç su çarpar (`islak`). İkincisi fazla sert olur, ağzına su kaçar: yanaklar şişer (`yanak`), "pfff" diye tükürür. | — | Ayna, bel üstü | iki şapırtı, "pfff" | Fiziksel küçük şaka, rig'in yapabildiği şeylerle. |
| 3,8–7,9 | **S1** "Saçmalama Ece ölüyodun lan canından daha mı değerli" | Islak işaret parmağıyla aynadaki kendini gösterir, kendine çıkışır (`kararli`/`ofkeli`). Damlalar düşer. | Kendi kendine nutuk: bakışı aynadaki gözlerinde. | Ayna, Ece'nin yüzüne hafif itme | damla "tıp" | Değer: akıl (+). |
| 7,9–9,4 | Duraksama [D] | İki damla düşer. Gözler yavaşça yana (kapıya, annenin cebindeki paraya) kayar. Islak eli bilinçsizce "para" jesti yapar (başparmak işaret ve orta parmağa sürtünür). Dudağının kenarı kıvrılır (`zorGulumse`). | Eli onu ele verir. | Yakın: önce el, sonra yüz (iki kısa çekim) | damla "tıp… tıp", sessizlik | Kullanıcının "bir duraksama"sı eyleme dönüşür. Değer döner: akıl (+) → açgözlülük (−). |
| 9,4–14,6 | **S2** "Günlük bu kadar çalışsam 1 haftalık maaşım 1 yıllık maaşım yapıyo olummmm" | Gözler yukarıda hesap yapar (`dusunceli`), parmakla yüzünün önünde sayar (`parmakUcu`; tek el, önden). "olummmm"da iki eliyle yanaklarını sıkar, kocaman sırıtır (`mutlu`). | — | Ayna bel üstü; "olummmm"da yakın | isteğe bağlı: "kaçıng" kasa sesi | Bozuk matematiğin kendisi komik. **İsteğe bağlı [D]:** ekranda okunur hesap kartı ("1 gece = 1 ay → 7 gece = ??? → 1 YIL"), 1,5 sn. |
| 14,6–15,9 | Havlu dönüşümü [D] | Askıdaki havluyu kapar (sette var), yüzünü gömer, siler, havluyu indirir: yüz artık `kararli`. | — | Ayna, yakın orta | havlu hışırtısı; salondan ilk tabak "tık" (P3'e ses köprüsü) | Klasik "maske indi" vuruşu. Kararlılık görünür bir eylemle gelir, ifade birden atlamaz. |
| 15,9–18,7 | **S3** "Gidip Sabri abiye olanları bir sorayım en iyisi" | Aynadaki kendine başıyla onaylar, havluyu omzuna atar. | — | Ayna bel üstü | salondan tabak/çatal sesleri sürer | Karar: değer (+). |
| 18,7–20,0 | Çıkış [D] | Döner, kadrajdan çıkar. Ayna 0,6 sn boş kalır, musluk açık kalmıştır. Ece'nin eli kadraja geri girer, musluğu kapatır, yeniden çıkar. | — | Ayna, boş kadraj | su kesilir; salondan anne: tabak "TAK" (sert) | Gerçekçi ve sevimli bir ayrıntı (musluk). Boş aynada küçük bir merak: P3'e geçiş. Mini soru: "Sabri ne diyecek?" |

**P2 toplamı: ~20 sn.**

---

## PARÇA 3: Salon ve sofra (hedef ~22-23 sn + yorum kartı)

**Coğrafya:** Ece'nin odası solda, antre ve çıkış sağda, sofra ortada. Banyo koridoru sağ tarafta. Ece'nin rotası: banyo (sağ) → odası (sol) → masanın yanından → antre (sağ). Zeytin, Ece'nin **çıkış yolu üstünde**: kapma mantıklı.
**Işık:** tavan lambası sıcak; pencerede şehir ışıkları, gece. Antre kapısı açılınca merdiven boşluğu karanlık, otomatik ışık yanar.
**Süreklilik:** deste annenin hırka cebinde (P1). Ece'nin kotu kirli sepetinde (P1). Ece dışarı çıkarken hardal kazak (`ece_sivil`) giyer, ama altı **başka bir pantolon** olmalı (siyah kot ya da eşofman); ya da kullanıcı fark etmez diyorsa aynı kot. Soru 6.

| Zaman (sn) | Vuruş | Eylem | Tepki | Kamera | Ses | Neden / işlev |
|---|---|---|---|---|---|---|
| 0–2,0 | Kurulum: sofra [D] | Anne tabakları gereğinden sert bırakır (tak! tak!), zeytin kâsesini masanın ortasına koyar. | Hâlâ öfkeli: öfkesini tabaklardan çıkarır. | Genel (establishing): oda kapısı solda, antre sağda | tabak "TAK" ×2 | Pasif-agresif anne, herkesin tanıdığı tip. **Kurulum:** zeytin. |
| 2,0–3,4 | Ece geçişi [D] | Ece sağdaki koridordan hızlı yürüyerek girer (havlu omzunda), masanın arkasından sola, odasına geçer, kapıyı çarpar. | Anne başını tenis seyircisi gibi sağdan sola çevirir, elinde tabak donar. | Genel | hızlı terlik, kapı "KÜT" | Önce mekân ve kim nerede (establishing), sonra hareket. |
| 3,4–5,4 | Kapı arkası [D] | Oda kapısının arkasından sesler gelir: çekmece, askı şıngırtısı, sonra "GÜM" (pantolona tek bacakla girip düşme, yalnız ses). | Anne tabağı bırakmadan kapıya döner, kaşı kalkar (`supheli`). | Annenin bel üstü, arkada kapı | çekmece, askı, "GÜM" | Görmediğimiz şakayı ses anlatır, ucuz ve etkili. |
| 5,4–6,0 | **[YENİ] Y3** Ece (kapının arkasından, boğuk): "İyiyim!" | — | Anne göz devirir (`alayci`). | Aynı | — | Kimse sormadan "İyiyim!" demek tanıdık bir gençlik refleksi. İsteğe bağlı. |
| 6,0–7,2 | Pijama fırlatma [D] | Kapı aralanır, pijama üstü (kedili baskı) fırlayıp annenin omzuna ve başının yarısına düşer, kapı kapanır. | Anne kıpırdamaz; yarım yüzü pijamanın altında, ifadesiz (`notr`). Sonra iki parmakla yavaşça çeker. | Annenin bel üstü | kumaş "fışş" | Annenin ifadesizliği güldürür. Kedili baskı süreklilik (Hello Kitty YOK). Çorap şakası istenirse burada pijama yerine çorap fırlar: anne iki parmakla yakalar, burnuna götürecekken durur, `igrenmis`, geri fırlatır (P1 çorap koklamasına gönderme). İkisi birden tempoyu düşürür; birini seçin. |
| 7,2–8,6 | **A1** "otur şu masaya" | Anne pijamayı sandalyeye fırlatır, kapıya bakarak bağırır, çatalı masaya vurur. | — | Annenin bel üstü | çatal "TIK" | Konuşan kime konuşuyorsa ona bakar: kapıya. |
| 8,6–10,0 | Ece çıkar [D] | Oda kapısı açılır: Ece hardal kazakla, topuzu yeniden bağlanmış, telefonu elinde, hızlı adımlarla sağa, masaya doğru gelir. | Anne hırka cebinden desteyi çıkarır (**ödeme:** P1'de cebe girmişti). | Orta, iki kişilik | adımlar | Giyinme mantıklı süre aldı (~5 sn ses). Kimse havadan belirmez. |
| 10,0–11,3 | **A2** "o para...." | Anne desteyi kaldırır, işaret parmağı havada, Ece'nin yoluna yarım adım çıkar. | Ece yön değiştirmeden zeytin kâsesine uzanır. Bakışı bir an anneye: "biliyorum". | İki kişilik, deste ve zeytin aynı kadrajda | — | Anne cümleyi bitiremez; kesilme bir sonraki vuruşla gelir. |
| 11,3–13,0 | Zeytin [D] | `zeytin_al` yakın eki: zeytini alır, havaya atar, ağzıyla yakalar, yanak şişer. | Anne donar, ağzı yarı açık (`agizAcik`), deste havada asılı kalır. | Yakın ek (zeytin), sonra annenin yüzüne kesme | "pıt" (atış), "hap" (yakalama) | Ece'nin küçük zaferi (shuang): anneyi sözsüz alt eder. |
| 13,0–13,8 | Öpücük [D] | Ece yanağı zeytinle şişkin, annenin yanağına "MUAH" diye kocaman bir öpücük kondurur. | Annenin gözleri istemsizce kapanır, yüzü 0,3 sn yumuşar (`mutlu` kıpırtısı), sonra toparlanır. | Yakın, iki yüz | "MUAH" | Annenin zaafı. Samimiyet geri gelir: ilk 3 bölümün havası. |
| 13,8–15,7 | **E1** "az işim var gelicemm" | Ece ağzı dolu konuşarak (boğuk okunur) geri geri antreye yürür, telefonlu eliyle küçük bir el sallar (önden, dikey). | Anne başıyla onu izler, deste hâlâ havada. | Orta, Ece sağa çıkar | — | Ağzı dolu "gelicemm" kendiliğinden komik. |
| 15,7–17,5 | Antre [D] | Ece anahtarı askıdan kapar (`ev_anahtar` eki), kapıyı açar: merdiven boşluğu karanlık, otomatik ışık "tık" diye yanar. Çıkar, kapı "küt". | — | Antre, orta | anahtar şıngırtısı, otomatik "tık", kapı | 18:00 karanlığı ve mantıklı çıkış. |
| 17,5–19,0 | **[YENİ] Y4** (isteğe bağlı) Ece (kapının arkasından, boğuk): "Hassiktir…" | Salonda kapının altından sızan ışık söner (otomatik kapandı). Bir an sessizlik, sonra Ece'nin boğuk sesi, düğme "tık", ışık geri gelir. Ayak sesleri hızla merdivenden iner. | Anne kapıya bakar. | Salondan antre kapısı, altından ışık çizgisi | otomatik "tık", boğuk ses, merdiven | Otomatik ışık şakası 13-25 yaş Türk izleyicinin bildiği bir şey. B2'deki "Hassiktir ya"ya gönderme. Karanlık, geceyi ve korku türünü hatırlatır. |
| 19,0–22,5 | **Kanca** (aşağıdaki A/B/C) | Anne yalnız; yanağındaki ıslaklığa dokunur, hırkasına siler. Sonra desteye bakar… | (seçeneğe göre) | Annenin yarım planı → deste yakın | müzik vurgusu (tek nota, asılı) | Bölüm sonu açık döngüsü. |
| 22,5– | Yorum kartı | Son karenin üstüne parlak, davetkâr kart (B5 kararı). | — | — | kısa, neşeli "pop" | — |

**P3 toplamı: ~22,5 sn + kart.** Y3/Y4 çıkarılırsa ~20 sn.

---

## Alternatif kanca seçenekleri

### Bölümün ilk 3 saniyesi (P1 açılışı)
- **A (önerilen, korur):** Beğenilen açılış aynen kalır. Yalnız 0-1,95 sn'deki gömlek toplama 1,0 sn'ye kısalır, çorap koklama ve "Iyy" ilk 2 saniyeye çekilir. En güçlü görsel ilk saniyelere gelir, kullanıcının beğendiği şey bozulmaz.
- **B:** 0-1,5 sn: Ece'nin karanlık odası. Yatakta ağzı açık, yastık izli, salyalı uyuyor, horluyor. Dışarıdan annenin "Eceee uyan kız artık"ı duyulur, Ece yorganı başına çeker. Sonra banyoya ve anneye kesilir. Uyku bağlamını kurar ama beğenilen açılışı 1,5 sn geciktirir.
- **C:** 0-0,8 sn: aşırı yakın, cepten çıkan desteyi gören annenin gözü, "yuhh" sesi önden gelir (ses ön çekim). Sonra çamaşır başlar. Soru güçlü ("ne para?") ama kurguyu bozar, beğenilen sırayı değiştirir.

### Bölüm sonu kancası (P3 sonu)
- **A (önerilen):** Anne destenin kâğıt bandını çevirir. Bantta okunur büyüklükte bir damga var: **"7/24"** (marketin adı, Sabri'nin parayı bantlamasıyla mantıklı). Anne gözlerini kısar, karanlık pencereye, Ece'nin gittiği yöne bakar, yüzü öfkeden endişeye döner (`supheli`→`dusunceli`). Tek nota, kesme. B6'nın "yoksa öğrendi mi?" açık döngüsünü yeni replik eklemeden besler. Varlık: destede bant zaten var; yalnız damga yazısı ve yakın ek gerekir.
- **B (hikâye kararı, kullanıcıya):** Anne telefonunu çıkarır, rehberde bir ismin üstünde durur; isim görünmez, yalnız ilk harfi "S…". Arar, telefonu kulağına götürür, kesme. Çok güçlü bir kanca ama "anne Sabri'yi tanıyor" anlamına gelir. Bu, dizinin gidişatını belirleyen bir karar; yalnız kullanıcının planı buysa kullanılmalı.
- **C (komedi + korku):** Kanca merdivende geçer: Ece otomatiğe basar, ışık yanar, duvarda göz hizasında sıradan küçük bir hamamböceği ona bakıyor. Ece'nin yüzü (`dehset`), kesme. P1'deki böcek ezme şakasının ödemesi ("böcekler peşimde mi?"). Gülerek biter, merak bırakır, hikâyeye yeni bilgi eklemez.

Önerim: **A**. Yalnız komedi istenirse **C**. A ile C birleştirilmemeli: iki kanca birbirini zayıflatır.

## Yorum kartı seçenekleri (önceki biçimde, 3 satır)
- **A (önerilen):** "Bir gece = bir aylık maaş." / "Sen olsan geri döner miydin?" / "Yorumlara yaz." Ahlaki ikilem en güçlü yorum tetikleyicisi (§1b).
- **B:** "Anne ne biliyor?" / "Sen olsan parayı annene söyler miydin?" / "Yorumlara yaz." Kanca A ile en uyumlu kart.
- **C (paylaşım):** "Annen bu desteyi bulsa ne derdi?" / "Anneni etiketle." / "Yorumlara yaz." Paylaşım ve etiketleme tetikleyicisi, 13-25 yaş için en "viral" olanı.

## Diğer öneriler (madde madde)
- **P1 18:00 ışığı (zorunlu düzeltme):** "Gün batımı ışığı" kasım 18:00'de tutarsız (İstanbul'da gün batımı ~16:40). Yapay ışık kullanılmalı, pencere karanlık olmalı. Açılış korunurken yalnız ışık değişir.
- **Anne her lafta öfkeli:** A05 bile bağırarak, sert söylenir. Anne hiçbir replikte gülümsemez; tek yumuşama P3'teki 0,3 sn'lik öpücük kıpırtısı.
- **Duygu geçişleri yumuşak:** `korku → mahcup → saskin → mutlu` geçişleri 0,2-0,3 sn içinde yapılmalı, pozdan poza atlamamalı (CLAUDE.md dersi).
- **Kırmızı kulak:** P1'de kulak çekmeden sonra Ece'nin sol kulağı kızarır; P2'de aynada görünür; P3'te solmaya başlamış. Ucuz, okunur bir süreklilik ayrıntısı.
- **Desteyi kim tutuyor (süreklilik tablosu):** açılış: anne sağ el → E02: Ece → A08: anne → hırka cebi → P3 A2: anne cebinden çıkarır → kanca: annede. Görüntü yönetmeni her kesmede kontrol etmeli.
- **Ses:** P1'de müzik yok ya da çok hafif, komedi sessizlikte daha iyi işler. P3'te kısa, oynak bir motif (pizzicato) zeytin-öpücük vuruşlarında, kancada tek bir asılı nota.
- **Dead zone denetimi:** P1 49,4-54,55 (iç ses) ve P3 3,4-6,0 (kapı arkası) en riskli bölümler. İkisine de yukarıda eylem kondu. Render sonrası bu iki aralık saniye saniye kontrol edilmeli.
- **Üretilebilirlik (`uretim-rehberi.md` §4):** Mevcut varlıklarla çekilebilenler: deste, çorap, kot, `uyku`, `islak`, `yanak`, `para_say`, `kulak_cek`, `zeytin_al`, `ev_anahtar`, `ev_zincir`, havlu askısı, B5 böcek. Yeni küçük varlıklar: (1) tek küçük hamamböceği (B5 sürü varlığından tek parça), annenin ezme adımı; (2) ter damlası (varsa `islak` ile); (3) kırmızı kulak tonu; (4) hayal eki için sepya filtre; (5) bantta "7/24" damgası (kanca A); (6) P2 hesap kartı (isteğe bağlı); (7) pijama üstünün uçan eşya olarak çizimi (kedili baskı).

## Yeni replik listesi (hepsi isteğe bağlı; kullanıcı onayına sunulacak)
| # | Parça / an | Kim | Metin | Duygu etiketi (ses) | Not |
|---|---|---|---|---|---|
| Y1 | P1, böcek ezildikten sonra | Ece | "anne vallahi büyük hayranınım." | fısıltı; korku + hayranlık, titrek, sırıtarak | B5 repliğine gönderme (tekrar eden şaka) |
| Y2 | P1, ikinci kulak çekişi | Ece | "Iıh!" | kısa ağrı, tiz | E05b çekiminden kesilebilir, kredi gerekmez |
| Y3 | P3, kapı arkasında düşünce | Ece | "İyiyim!" | boğuk, telaşlı, nefes nefese | kapı arkası filtre |
| Y4 | P3, merdivende otomatik söndüğünde | Ece | "Hassiktir…" | boğuk, irkilmiş, kısık | B2'ye gönderme; kanca C seçilirse burada kalabilir |

## Kullanıcıya sorular (karar gerektiren)
1. **Böcek ezme (öncelikli öneri 2):** Evde küçük, sıradan bir böcek çıkması uygun mu? İzleyici "anomali eve mi geldi?" diye düşünebilir. Bu bir merak kaynağı ama yanlış ipucu da olabilir. Sıradan olduğunu göstermek için anne onu bildiğimiz terlik/ayak ile öldürüyor, toza dönmüyor.
2. **Annenin donması (E01, A seçeneği):** "dev gibi böcek" sözünde anne 0,4 sn donsun mu (B6'daki "yoksa öğrendi mi?" döngüsü), yoksa yalnız komedi mi (B)?
3. **Y1 "anne vallahi büyük hayranınım."** tekrar eden şaka olarak girsin mi?
4. **Bölüm sonu kancası:** A (bant damgası), B (telefon "S…", hikâye kararı) ya da C (merdivende böcek)?
5. **Yorum kartı:** A, B ya da C?
6. **P3 pantolon:** Ece'nin kotu kirli sepetinde. P3'te başka bir alt mı giysin (önerim), yoksa önemsenmesin mi?
7. **P3 fırlayan eşya:** pijama üstü mü (annenin kafasına), çorap mı (P1 koklamasına gönderme)?
