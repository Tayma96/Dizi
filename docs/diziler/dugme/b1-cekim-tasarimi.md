# Kırmızı Düğme · Bölüm 1 · Çekim tasarımı (görüntü yönetmeni)

> 23 Kasım 2026. Bu belge görsel ve işitsel tasarımdır: kadraj, kamera, ışık, renk, geçiş, ses. **Replik ve anlatım metni yoktur**; `[Replik: kullanıcı]` yazan her yer kullanıcının senaryosuyla dolacak. Hikâye akışı kullanıcının B1 metnine ve onayladığı kararlara dayanır (`bolumler.md`).

## 0. Temel kurallar

**Format:** 9:16, 30 fps, 1080×1920.
**Hedef süre:** yaklaşık 4,5 dakika. Reels/Shorts için 4 parçaya bölünür (bölüm sonunda).

### Çekim ölçekleri (motordaki odak uzaklığı)
| Ölçek | Odak uzaklığı | Ne zaman |
|---|---|---|
| Genel | 560-650 | Mekânı ve kimin nerede olduğunu kurarken |
| Orta | 760-900 | Diyalog ve hareket |
| Yakın | 1050-1200 | **Yalnız duygu doruğunda** |

Aynı ölçek art arda iki kez kullanılmaz.

### Beyaz odada 180° kuralı
- **Eksen:** kaideden geçen çizgi.
- **Dizilim:** göbekli adam ve teyze eksenin solunda, kurye ve influencer sağında.
- **Kamera:** hep güney yarıda kalır. Eksen yalnız kaideyi dolanan, motive edilmiş bir kamera hareketiyle geçilir.

### Renk senaryosu
| Mekân | Renk | Duygu |
|---|---|---|
| Beyaz oda | Soğuk beyaz, gölgesiz; kırmızıyı yalnız düğme taşır | Steril, rahatsız edici |
| Göbekli flashback | Lacivert-mor gece, TV mavisi | Tembel gece, yalnızlık |
| Kurye flashback | Sodyum turuncusu, akan ışıklar | Özgürlük, müzik |
| Influencer flashback | Şeker pembe; arkadaki kapı zifiri karanlık | Güvenli alan, ama tehdit kapıda |

### Spoiler ve sürpriz kuralları
- **Spoiler:** Kanca 2.-3. bölüme ait bir ileri sıçrama. Bölümün geri kalanında kancaya hiçbir gönderme yapılmaz.
- **Sürpriz:** Bölüm sonuna kadar odada tek düğme var; duvarlar dikişsiz. Düğme kalabalığı ve petek derzleri yalnız finalde görünür.

### Karakter çizimi
Dört ana karakter, maskeli adam ve minibüs sürücüsü yeni çizim diliyle çizilir (`src/studio/kd/`, Göbekli Adam örneğindeki fırça kontur ve ışıklı hacim). Mekânlar mevcut, ışıkları bu belgeye göre ayarlanır.

---

## 1. Kanca (bitti, onaylı v6): 0:00-0:06
`ornekler/kd-kanca-sahne.mp4`. Başlık kartı: siyah üstüne KIRMIZI DÜĞME ve klik.

## 2. Uyanış: 0:06-1:05 (≈60 sn)
**Sahnenin amacı:** Dört yabancı kapısız, bembeyaz bir odada uyanır; ortada tek bir düğme vardır.

| # | Süre | Ölçek / kamera | Görüntü | Ses |
|---|---|---|---|---|
| 2.1 | 3 sn | **Genel, tepeden** (kuşbakışı), çok yavaş alçalır | Bembeyaz oda, ortada kaide ve tek düğme (sayaç 001), yerde baygın dört kişi | Kancanın ardından **tam sessizlik**, sonra kısık oda tonu |
| 2.2 | 3 sn | Orta, yerden alçak açı | Göbekli adam horlayarak uyanır, uyku sersemi göbeğini kaşır | Horlama (komik kırılma) |
| 2.3 | 4 sn | Orta | Kurye irkilerek doğrulur, kablolu kulaklığını yoklar; saçında kask izi | Mont hışırtısı |
| 2.4 | 4 sn | Orta | Influencer uyanır, cebini yoklar; telefon yok, paniğin başlangıcı | Nefes hızlanır |
| 2.5 | 3 sn | **Orta, sabit** (bilerek durgun) | Teyze zaten uyanık, perması bozulmamış, çantası kucağında, elini kolonyalıyor | Kolonya şişesinin "fıs"ı (ince ipucu) |
| 2.6 | 6 sn | Genel, kaideyi yarım dolanan yavaş kamera | Herkes ayakta, odayı süzüyor. Kapı yok, pencere yok; dikişsiz duvarlar | Adımların yankısız tıkırtısı |
| 2.7 | 8 sn | Orta → orta-yakın | Biri duvarı tıklatır; tok bir ses gelir | `[Replik: kullanıcı]` |
| 2.8 | 10 sn | Orta iki-çekim / üç-çekim, 180° korunur | Gözler düğmeye döner. Biri basmak ister, diğerleri durdurur; ilk çatışma | `[Replik: kullanıcı]` |
| 2.9 | 3 sn | **Yakın** (doruk) | Düğme ve 001 sayacı; LED hafifçe nabız atar | Alçak bir uğultu |
| 2.10 | ~16 sn | Orta | "Sen nasıl geldin buraya?" sorusu | `[Replik: kullanıcı]` |

**Işık:** Kaynağı görünmeyen, her yerden gelen soğuk beyaz; gölge yok, yalnız köşelerde hafif koyuluk. Karakterlerde kenar ışığı yok. Dış dünyanın sıcaklığından sonra burada herkes "çıplak" durur.
**Geçiş:** Soru sorulunca anlatacak kişiye **yavaş itme** yapılır, flashback'e o karakterin kendi geçişiyle girilir.

## 3. Göbekli adamın flashback'i (komedi): 1:05-1:55 (≈50 sn)
**Sahnenin amacı:** Bir yıldır evden çıkmayan adam, markete inmeye karar verdiği gece kaçırılır.

**Anlatım:** Kendi sesi, Trakya şivesiyle, dış ses olarak: `[Anlatım: kullanıcı]`.
**Geçiş içeri:** Odanın beyazı TV karlanmasına döner (cızırtı), salonun mavi ışığına açılır.

| # | Süre | Ölçek / kamera | Görüntü | Ses |
|---|---|---|---|---|
| 3.1 | 4 sn | Genel, sabit (komedi = sabit kamera) | Salon, gece, kanepede yan yatmış adam. Telefonu yatay tutup göbeğine dayamış, film izler gibi | Telefondan yayıncı klibinin sesi (görüntüsü görünmez) |
| 3.2 | 4 sn | Orta | Göbeğini kaşır; cips kırıntıları atlete dökülür | Kaşınma, cips hışırtısı |
| 3.3 | 6 sn | Orta-yakın, sabit | İki repliği | `[Replik: kullanıcı ×2]` |
| 3.4 | 3 sn | Orta | Zorlukla kalkar, terliğini arar | Kanepe gıcırtısı (komik zamanlama) |
| 3.5 | 4 sn | Genel, kapı eşiği | Kapıyı açar; bir yıldır dışarı çıkmamış biri için dış dünyanın ışığı yüzüne vurur | Şehir ambiyansı |
| 3.6 | 5 sn | Genel | Çınar Market önü: sodyum lambası, vitrin, kasada uyuyan kedi | Uzaktan köpek, lamba vızıltısı |
| 3.7 | 4 sn | Orta | Gri minibüs sessizce yanaşır, kayar kapı açılır | Kayar kapı sesi |
| 3.8 | 3 sn | **Yakın** (doruk) | Adamın şaşkın yüzü (öneri: elinde marketten aldığı bir şey) | — |
| 3.9 | 3 sn | Genel | Maskeli adam onu içeri çeker, kapı kapanır, minibüs gider | Kısa boğuşma, kapı "güm" |

**Işık:**
- **Salon:** Anahtar ışık soldaki TV'nin titreyen mavisi, dolgu telefon ekranının yüze vuran soğuk ışığı, arka ışık perde ardındaki mor şehir.
- **Market:** Anahtar ışık sodyum turuncusu, dolgu vitrinin sıcak beyazı.

**Geçiş dışarı:** Minibüs kapısının "güm"ünde sert kesme; beyaz oda ve kısık oda tonu.

## 4. Kuryenin flashback'i (müzik klibi): 1:55-2:30 (≈30 sn)
**Sahnenin amacı:** Gece teslimata giden kurye, kaskında çalan şarkıyla ritme kapılmışken çarpılıp kaçırılır.

**Geçiş içeri (kullanıcı kararı):** "BAS!" şarkısı odada, kurye "Nasıl mı?" demeden yaklaşık 3 saniye önce başlar. Flashback'e ritme oturan bir kesmeyle girilir; 124 BPM'de iki ölçü 3,9 saniye ediyor.

| # | Süre | Ölçek / kamera | Görüntü | Ses |
|---|---|---|---|---|
| 4.1 | 3 sn | Orta, beyaz oda | Kurye düşünür, şarkı uzaktan ve boğuk başlar | "BAS!" 0-3,9 sn (anı gibi) |
| 4.2 | 4 sn | Orta, önden sürüş takibi | Motor, gece caddesi, akan lambalar | Şarkı **kaskın içinden net** duyulur |
| 4.3 | 3 sn | **Kask içi yakın** | Vizörün ardında kafasını ritme uydurur, vizörde ışıklar kayar | Net |
| 4.4 | 4 sn | Genel, yandan, hız çizgileri | Şehir silueti, şeritler akar | Dış çekimde boğuk şarkı, üstüne rüzgâr ve motor |
| 4.5 | 3 sn | Orta | Teslimat çantası, VINN! logosu; dar sokağa döner | — |
| 4.6 | 3 sn | Genel, kavşak | Trafik ışığı yeşil; karanlıkta duran gri minibüsün farları yanar | Şarkı devam |
| 4.7 | 2 sn | **Yakın** (doruk) | Farlar vizörde patlar | — |
| 4.8 | — | — | **22. saniye:** çarpma, şarkı "bir, iki…" derken kesilir | Sessizlik, ardından çarpma |
| 4.9 | 2 sn | Genel, yerden | Devrilmiş motor, dönen tekerlek; maskeli adamın botları yaklaşır | Tekerlek tıkırtısı |

**Işık:** Anahtar ışık sodyum lambalar (akarak geçer), dolgu motor farı, arka ışık şehrin turuncu hâlesi. Kavşakta trafik ışığının yeşili yüze vurur, ardından minibüs farının beyazı her şeyi yakar.
**Geçiş dışarı:** Dönen tekerleğin tıkırtısında beyaz odaya kesme.

## 5. Influencer'ın flashback'i (korku tonu): 2:30-3:35 (≈65 sn)
**Sahnenin amacı:** Şeker pembe yayın odasında parasını kazanmış kız, yayını kapattığı an arka odadan gelen adamla kaçırılır.

**Geçiş içeri:** Uydurma canlı yayın arayüzü ekranı süpürerek açılır (CANLI rozeti, izleyici sayısı).

| # | Süre | Ölçek / kamera | Görüntü | Ses |
|---|---|---|---|---|
| 5.1 | 5 sn | Orta, telefon kamerası bakışı (arayüzle) | Masada tepsi, tepside slime yoğurur, şarkıya dudak senkronu yapar | Şarkı (öneri aşağıda) |
| 5.2 | 6 sn | Orta | Slime'a su ekleyenlere sesleniyor | `[Replik: kullanıcı]` |
| 5.3 | 4 sn | Arayüz yakın | **ASLAN** hediyesi ekranı kaplar | Hediye "ding"i |
| 5.4 | 6 sn | Orta → yakın | Dışarıdan itiraz eder, içinden sevinir | `[Replik + iç ses: kullanıcı]` |
| 5.5 | 4 sn | Orta | Yayını kapatır; arayüz söner, oda birden sessizleşir | Ani sessizlik |
| 5.6 | 5 sn | Orta-yakın | Rahatlar | `[Replik: kullanıcı]` |
| 5.7 | 4 sn | **Genel, statik** | Kızın arkasında aralık duran kapı zifiri karanlık; biz görürüz, o görmez | Döşeme gıcırtısı |
| 5.8 | 4 sn | Orta, ağır itme | Karanlıkta bir siluet belirir | Nefes |
| 5.9 | 3 sn | **Yakın** (doruk) | Ring ışığın halkası kızın gözünde; arkasında beliren el | — |
| 5.10 | 2 sn | — | Çuval başına geçer, ring ışık devrilir, görüntü kararır | Çuval hışırtısı, ring ışık "tak" |

**Işık:**
- **Yayın odası:** Anahtar ışık ring ışık (soğuk beyaz, gözde halka yansıması), dolgu pembe LED, arka ışık mor LED şerit ve peri ışıkları.
- **Arka kapı:** Hiç ışık almaz.
- **Yayın kapanınca:** LED ve peri ışıkları birer birer söner, yalnız ring ışık kalır. Oda korku tonuna geçer.

**Öneri (karar senin):** Kızın dudak senkronu yaptığı şarkı aynı "BAS!" olabilir. Hem kredi harcamayız, hem de dizide "viral şarkı" motifi kurulur: kurye kaskında dinliyor, kız yayında söylüyor. İkisinin bağlantısı izleyiciye bir ipucu gibi gelir.

**Geçiş dışarı:** Kararmadan beyaz odaya, kulak çınlamasıyla.

## 6. Teyze geçiştirir: 3:35-3:50 (≈15 sn)
- **Görüntü:** Sıra teyzeye gelir. Orta çekimden **yakına itme**, ama yüz sakin. Kolonyasını uzatır, konuyu değiştirir: `[Replik: kullanıcı]`.
- **Ölçek kuralı:** Bu, sahnedeki tek yakın plan. Hırkasının **kırmızı mantar düğmeleri** kadrajın altında bir an parlar (ipucu).
- **Ses:** Müzik yok, kısık oda tonu; çok hafif, uyumsuz bir nota.

## 7. Final: 3:50-4:30 (≈40 sn)
**Sahnenin amacı:** Düğmeye basılır ve oda yüzlerce düğmeyle dolar.

| # | Süre | Ölçek / kamera | Görüntü | Ses |
|---|---|---|---|---|
| 7.1 | 6 sn | Orta | Kimin basacağı tartışılır | `[Replik: kullanıcı]` |
| 7.2 | 2 sn | **Yakın** | Parmak düğmede | Kalp atışı |
| 7.3 | 1 sn | Yakın | Basılır | **Klik A** |
| 7.4 | 2 sn | Genel | Bir an hiçbir şey olmaz | Tam sessizlik (gerilim) |
| 7.5 | 4 sn | Genel, tepeden | Duvarda, tavanda ve zeminde altıgen **derzler belirir** | Taş çatlar gibi bir ses |
| 7.6 | 6 sn | Genel, kaideyi dolanan hızlı kamera | Yüzlerce düğme **kaideden dışa doğru dalga hâlinde** belirir, her biri kırmızı çakar; oda nabız gibi atar | Dalga dalga "tık-tık-tık" ve ikaz darbesi |
| 7.7 | 3 sn | Dört karakterin yakınları (kurgu: 4 × 0,7 sn) | Dördünün tepkisi | — |
| 7.8 | 6 sn | Genel | Bölmeler sürgüyle açılır, içlerinden nesneler fırlar: terlik, simit, lastik ördek, çaydanlık… (senaryoda ne çıkacağını sen belirlersin) | Komik ve tehlikeli karışık sesler |
| 7.9 | 3 sn | Yakın | (öneri) komik bir nesne birine çarpar | Komik "pat" |
| 7.10 | 3 sn | Genel | (öneri) tehlikeli bir şeyin bölmesi açılır | Alarm |
| 7.11 | — | — | **Kesme → bölüm sonu kartı** (cliffhanger) | Sessizlik + klik |

**Işık:** Finalde soğuk beyaz ilk kez bozulur: kırmızı darbe ışığı, düğme LED'leri ve bölmelerin içinde dönen ikaz ışıkları.

---

## 8. Reels / Shorts bölünmesi (≈90 sn parçalar)
| Parça | İçerik | Gerilim sonu |
|---|---|---|
| 1 | Kanca, başlık, uyanış | "Kapı yok." / düğmeye uzanan el |
| 2 | Göbekli adamın ve kuryenin flashback'leri | Araba çarpması, şarkının kesilmesi |
| 3 | Influencer'ın flashback'i | Çuval, kararma |
| 4 | Teyzenin geçiştirmesi ve final | Düğmeler belirir, tehlikeli bölme açılır |

## 9. ElevenLabs bütçesi (kullanıcı kuralı: bölüm başına en fazla 4.000 kredi)
| Kalem | Kredi | Durum |
|---|---|---|
| "BAS!" şarkısı (68 sn) | 889 | harcandı |
| Kanca efektleri (5 + 3 adet) | 210 | harcandı |
| "Duuuur" bağırışı | 12 | harcandı |
| **B1'e harcanan** | **1.111** | |
| Şive denemesi (4 karakter, kısa) | ~350 | onay bekliyor (genel kurulum; istersen B1 dışında sayılır) |
| Replikler ve anlatım (≈4,5 dk, ≈2.000 harf, v4) | ~2.000 | senaryodan sonra kesinleşir |
| Yeni efektler (≈15 adet, 10 kr/sn ölçüldü) | ~300 | |
| Yeniden çekim payı | ~240 | |
| **Planlanan toplam** | **≈4.000** | Sınırda. Sıkışırsak efektlerin bir kısmı ücretsiz CC0 kayıtlardan (BigSoundBank) ya da sentezden gelir |

Not: Sınırın içinde kalmak için repliklerin toplamı yaklaşık 2.000 harfi geçmemeli. Bu, 4,5 dakikalık bölüm için rahat bir miktar; diyalog yoğun yazılırsa uyarırım.

## 10. Üretim sırası
1. Dört ana karakter ve maskeli adam yeni çizim diline geçer (beyaz oda + flashback kıyafetleri).
2. Şive denemesi (onaydan sonra) ve seslerin kesinleşmesi.
3. Kullanıcının senaryosu → çekim senaryosu JSON'u (sahne sahne, bu belgedeki ölçek, ışık ve geçişlerle).
4. Her sahne render'dan önce birkaç kareyle denetlenir. İlk tam kaliteli örnek: uyanış (2.1-2.6).
5. Seslendirme (kuru çalıştırma → onay) → miks (−14 LUFS) → bölüm ve 4 Reels parçası.
