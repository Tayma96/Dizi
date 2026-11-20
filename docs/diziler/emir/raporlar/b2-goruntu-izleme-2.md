# Kayıp CEO B2: ikinci izleme denetimi (görüntü yönetmeni, 20 Kasım 2026)

**İzlenen dosyalar:**
- `bolumler/kayip-ceo-02-parca1.mp4`: 39,8 sn, 80 kare (0,5 sn arayla).
- `bolumler/kayip-ceo-02-parca2.mp4`: 45,3 sn, 91 kare.

**Yöntem:**
- Her 0,5 sn'de bir kare alındı ve 16'lık şeritlerde incelendi.
- Şüpheli anlar 540x960 ve 1080x1920 çözünürlükte ayrıca bakıldı.
- Ahizenin inişi ve topun düşüşü 0,1 sn arayla incelendi.
- Kareler `/tmp/claude-0/-home-user-Dizi/b07199cd-cb6f-51e2-8731-5eac438d8fb0/scratchpad/gy2/` altında:
  - Şeritler: `strip_grp1_*.png`, `strip_grp2_*.png`.
  - Yakın bakışlar: `full/` (`pov`, `dogrul`, `isim`, `resep`, `kapanis`, `kapanis2`, `ahize`, `yemek`, `neki`, `agiz`, `gitme`, `bastir`, `burus`, `firlat`, `dus`, `ates`, `meydan`).

---

## 1. Önceki P0'ların durumu

| # | Konu | Durum |
|---|------|-------|
| P0-1 | POV'da üç kol, yaprak karına gidiyor | **Düzeldi.** Kol kadının omzundan çıkıyor, kısalarak kameraya uzanıyor ve yaprak üst kenara, yani alna geliyor. Göz kırpma (1,5 sn) dokunuşla eşleşiyor. Kalan küçük kusur: el iki sosis parmaktan oluşuyor (0,3 ve 2,8 sn), P2. |
| P0-2 | Kadın kapıda, ışınlanıyor | **Düzeldi.** Kadın 3,0 sn'den itibaren Emir'in başının hemen solunda ve arkasında duruyor. Kalan sorun: hep ayakta ve dimdik duruyor, Emir'e hiç eğilmiyor (P1-B). |
| P0-3 | Altyazı Emir'in yüzünde | **Kulübede düzeldi.** Altyazı y≈1580-1680'de, yarı saydam koyu zemin üstünde; yüzler y<1350'de kalıyor. Yeni çakışma TV haritasında çıktı (P1-E). |
| P0-4 | Doğrulma görülmüyor | **Kısmen düzeldi.** Kadraj sabit; kalkış (7,0-7,6), bekleme (7,6-9,2) ve düşüş (9,2-9,7) okunuyor. Ancak yüz hâlâ acı değil, uykulu ve ifadesiz (P1-A). |
| P0-5 | Tahta gibi dönen beden | **Düzeldi.** Yalnız üst gövde dönüyor, bacaklar yatay kalıyor (parça 1, 7,6 sn; parça 2, 14,8-19,6 sn). |
| P0-6 | Donuk TV, alt %40 siyah | **Düzeldi.** Spiker kır saçlı, gözlüklü ve bıyıklı. Ön planda resepsiyonistin silueti var, kesmeler ve portreye itiş çalışıyor, "İSTANBUL" yazısı yazılıyor. Ama bu bölümün dinleme çekiminde yeni bir P0 doğdu (N-1). |
| P0-7 | Kapanışta okunmayan altyazı, kaybolan ahize | **Kısmen düzeldi.** Altyazı okunuyor ve ahize eliyle iniyor. Ancak iniş 0,3 sn sürüyor (37,4-37,7), ahize masada dik bir şişe gibi duruyor, kablo ve telefon gövdesi yok. Yüz 2 sn boyunca nötr, şok okunmuyor (P1-C). |
| P0-8 | "Ne ki bu?" nesnesi yok, panik gülümsemeyle | **Hâlâ sorunlu.** Nesne çok küçük ve Emir ona bakmıyor (N-3). Gülümseyen dinlenme yüzü gitti, ama kaşlar öfke V'si yapıyor ve dudak senkronu konuşurken sırıtma ağzı açıyor (P1-D). |
| P0-9 | Bastırma eklemesinde uzuv yığını | **Kısmen düzeldi.** Fazla uzuv ve boyun sütunu yok, çene görünüyor. Ancak çene GÜLÜMSÜYOR, eller 3 sn kıpırtısız ve bastırma hareketi yok (P1-F). |
| P0-10 | Buruşturma ve ateşe atma görünmüyor | **Hâlâ sorunlu.** Buruşturma artık kabaca okunuyor. Atış hareketi yok, top halka gibi görünüyor, ateşte top yeniden dümdüz dikey poster oluyor ve kapanışta top hâlâ yaşlının elinde (N-2). |

---

## 2. Kalan ve yeni P0'lar: kullanıcı fark eder, "amatör" der

### N-1. Parça 1, 19,5-20,9 ve 27,4-33,0 sn: ahize burnun üstünde, ağız ve burun kapalı
- **Ne görülüyor:**
  - Resepsiyonist, ahizeyi yüzünün ortasında dikey bir beyaz çubuk gibi tutuyor. Üst uç burnun üstünde, alt uç çenenin altında.
  - Görüntü flüt çalan, pipo içen ya da bir şeyi koklayan biri gibi okunuyor.
  - Bu yakın dinleme çekimi 5,6 sn sürüyor; telefon ekranında en çok kalan resepsiyonist yüzü bu.
  - Ahize kulakta değil. Kullanıcının istediği "haberi telefonda duyup donma" anı okunmuyor.
- **Düzeltme:**
  - `rig/gestures.ts` → `telefon`: el hedefi baş genişliğinin dışında, kulak hizasında olsun (yüz merkezinden yatayda ≈ +0,55 kafa genişliği, dikeyde göz çizgisi).
  - Ahize prop'u yaklaşık −55° yatık çizilsin: üst uç kulakta, alt uç ağız köşesinin 20-30 px dışında. Yüzün ortasından hiçbir parça geçmesin.
  - Dinleme çekiminde kadına `turn: 25` ver. Ahize yanakta, profilden okunur.
  - Duvar TV'sinde (19,5-20,9) spiker hâlâ yüzsüz yumurta kafa. Eklemedeki spikerin küçültülmüş hâli kullanılsın (önceki P1-5).

### N-2. Parça 2, 35,8-38,4 ve 42,4-44,6 sn: atış yok, kâğıt ateşte dümdüz poster, top kapanışta hâlâ elde
- **Ne görülüyor:**
  - **Atış:** 36,0-37,2 sn arasında yaşlı topu kalça hizasında, hareketsiz kolla tutuyor.
  - **Top:** Ortası delik, altıgen beyaz bir halka. Somun, bilezik ya da simit gibi okunuyor.
  - **Düşüş:** Kesme geliyor ve top yukarıdan düşüyor (37,5-37,9). Bu bölüm iyi.
  - **Ateş:** 38,0'da top küçük ve düz bir kâğıda dönüşüyor, alevin ÜSTÜNDE havada dikey asılı. 38,4'te ateş halkasından geniş ve yazısı tamamen okunan bir poster oluyor. "Yatık açılma" yok; bu, önceki hatanın aynısı.
  - **Kapanış (42,4-44,6):** Yaşlının sağ elinde aynı beyaz halka duruyor. Kâğıt yandı, ama top hâlâ elinde.
- **Neden P0:** Kullanıcının metnindeki son eylem "ateşin içine atar". Atış görünmüyor, süreklilik iki kez kopuyor.
- **Düzeltme:**
  - **Top prop'u (`kagit_top`):**
    - Ortadaki deliği kaldır.
    - 9-11 köşeli düzensiz bir çokgen çiz.
    - Üstüne 4-5 kısa gri kırışık çizgisi ve bir yanına gölge koy.
    - Boyutu yaşlının yumruğunun 1,2 katı olsun. Şu an halka gibi parlak beyaz; rengi kâğıt kırığına (#e8e2d0) çek.
  - **Atış (`emir-02-p2.json`, sahne `b`, atış vuruşu):**
    - Yeni `firlat` jesti (`gestures.ts`): kol 0,3 sn geri ve aşağı gitsin, sonra 0,25 sn öne ve yukarı açılsın.
    - Top elden 0,55. sn'de ayrılsın ve kadrajın sağ altına, ateşe doğru yay çizsin.
    - Kesme top elden çıktıktan sonra gelsin.
    - En az 0,9 sn sürsün.
  - **Yanma (`Inserts7.tsx` → `Sozlesme`, `ates` fazı):**
    - Top düştüğü yerde, taşların üstünde ve köz hizasında kalsın; havada durmasın.
    - Açılma olacaksa en çok %60 boyuta açılsın ve yatay olsun (`scaleY ≈ 0.35`). Kenarlar 0,4 sn içinde kararsın, sonra tutuşsun.
    - Kâğıt hiçbir anda ateş halkasından geniş olmasın.
    - Yazı yalnızca bir an, yanarken kısmen ("$50.000…") görünsün.
  - **Kapanış geniş planı:** `cast.yerli_bilge.prop: "none"`. Ateşin içine kararmış kâğıt kıvrımı ve kıvılcım ekle.

### N-3. Parça 2, 7,5-9,3 sn: "Ne ki bu?" sorulan nesne okunmuyor
- **Ne görülüyor:**
  - Emir göbeğinin önünde, kadrajın 1080 genişliğinde ≈80 px'lik bir kahverengi-beyaz yarım küre tutuyor.
  - Gözleri nesnede değil, kameraya ve sağa bakıyor. 8,7'de gözleri kapalı.
  - Kadın kadrajın sol kenarında yarım ve yüzü kesik.
- **Neden P0:** İzleyici "bu" sözcüğünün neyi gösterdiğini görmüyor. Replik havada kalıyor.
- **Düzeltme:**
  - "Ne ki bu?" vuruşunu `insert` ile aç: Emir'in sargılı elinde hindistan cevizi, kadrajın merkezinde ve ≥400 px. Saat bilekte görünsün.
  - Ardından Emir `yakin`, `bak: {"x": 0.3, "y": 0.6}` ile nesneye baksın.
  - Bu vuruşta kadın `mark`'ını kadrajın tamamen dışına al ya da `kadraj.cx` değerini +90 yap.

---

## 3. P1: ciddi, düzeltilmeli

**P1-A. Parça 1, 7,0-9,7: doğrulmada acı yok.**
- Emir'in gözleri yarı kapalı, ağzı düz ve küçük; uykulu görünüyor.
- Kadının uzattığı kol 7,0-10,0 arasında havada donuk kalıyor ve Emir düşerken tepki vermiyor.
- **Düzeltme:**
  - `aci` ifadesi: gözler sıkılı (üst ve alt kapak birbirine yaklaşsın), kaş iç uçları yukarı, ağız yatay gerili ve dişler görünsün.
  - Kadın 9,2'de, Emir düşerken kolunu Emir'in omzuna doğru 0,3 sn indirsin (`uzat` → `rest` geçişini düşüşle eşle).

**P1-B. Kulübe, iki parça boyunca kadın hep dimdik ayakta.**
- Emir'in başı kadının kalçasının altında kalıyor.
- Kollar iki yanda düz çubuk gibi sarkıyor: parça 1, 16-17,4; parça 2, 14,5-19,9.
- "Bakım veren" yerine "nöbetçi" gibi okunuyor.
- **Düzeltme:** Kulübe vuruşlarında `cast.yerli_kadin.body: "sit"` (diz çökmüş) ver; ya da en azından `tilt: -6` ve ellerden biri yatak kenarında olsun.

**P1-C. Parça 1, 37,4-39,8: ahizenin inişi ve kapanış yüzü.**
- **Ahize:** İniş 0,3 sn sürüyor ve ahize masada dikey bir şişe gibi duruyor. Kablo ve telefon gövdesi yok.
- **Yüz:** 37,7-39,4 arasında 1,7 sn tamamen nötr. Parçanın son duygu karesi boş.
- **Düzeltme:**
  - `ahize_indir` jesti 0,9 sn sürsün; ahize yatay olarak masadaki telefon gövdesine konsun. Gövde yeni bir prop olarak çizilsin.
  - Yüz `sok` olsun ve `pale: 0.4` eklensin: kaşlar yukarı, ağız aralık.
  - Kamera `yaklas` ile z farkı ≥0,15 olsun.

**P1-D. Parça 2, 9,5-14,3 ve 14,5-19,9: korku öfkeye dönmüş, dudak senkronu sırıtıyor.**
- **Korku:** Kaşlar iç uçları aşağıda, V biçiminde (9,6 / 10,2 / 13,4). Yüz kızgın ya da şüpheci okunuyor.
- **Sırıtma:**
  - 13,7'de ağız yukarı kıvrık, dişli bir sırıtma.
  - 16,0'da Emir ağlarken (gözyaşı var) ağzı açık gülüyor.
- **Düzeltme:**
  - `rig/emotions` → `korkmus` ve `aci`: kaş iç uçları YUKARI (ters V).
  - Dudak senkronunda viseme yalnızca açıklık ve genişliği belirlesin; ağız köşesi eğrisi daima `emotion`'dan gelsin. Bu tek değişiklik 13,7, 16,0 ve P1-F'yi birlikte düzeltir.

**P1-E. Parça 1, 33,4-37,3: portre itişinde altyazı haritanın üstünde.**
- "henüz" sözcüğü "HİNT OKYANUSU" etiketinin üstüne biniyor (34,0).
- "bilinmiyor." sözcüğü "SON SİNYAL" noktasının ve kesik çizginin üstünde (36,8).
- Alt bantta bant yazısı soldan kesik: "DİNG CEO'SU…", "N HABER YOK".
- **Düzeltme:**
  - İtişin son kadrajını portre ve kırmızı isim bandıyla sınırla, harita alt kenarın dışında kalsın; ya da bu bölümde altyazıyı y≈1700'e indir.
  - Kesik bant yazısını kadraja ya tamamen al ya da tamamen dışarıda bırak.

**P1-F. Parça 2, 20,0-23,9: bastırma eklemesi.**
- Üstte görünen çenede ağız GÜLÜMSÜYOR. Önceki ve sonraki karede Emir ağlıyor.
- Eller 20,5'ten sonra 3,4 sn kıpırtısız; omuz değil göğüs ve karın üstünde, ve aşağı bastırma hareketi yok.
- Alttaki elde altın bilezik var; kadının geniş planlarında bilezik yok (süreklilik).
- Çenede sakal noktaları var; Emir'in diğer planlarında sakal yok.
- **Düzeltme (`Inserts7.tsx` → `OmuzBastir`):**
  - Ağzı düz ya da aşağı kıvrık çiz.
  - Üst eli sol omuz başına taşı.
  - İki el 0,5 sn boyunca 15-20 px aşağı bastırsın ve gövde 10 px çöksün.
  - 1,5. sn'de Emir'in eli kadının bileğini tutsun.
  - Bileziği ve sakal noktalarını kaldır.

**P1-G. Parça 1, 16,4-19,5: isim anı.**
- "Emir." geniş planda söyleniyor; Emir yarı kapalı gözle hafif gülümsüyor ve `eliKalbinde` jesti çok küçük.
- "Emir?" yakın planında kadın 17,8'de dişleri görünen geniş bir gülüş, 18,6'da yan bakışlı bir sırıtma yapıyor. "Tuhaf merak" yerine flört ya da alay okunuyor.
- **Düzeltme:**
  - "Emir." için `orta` ya da `iki` kullan, kadraj eli ve yüzü birlikte alsın.
  - Kadına `saskin` ifadesi ver (kaşlar yukarı, ağız kapalı ve hafif aralık), `tilt: 8` ekle; gülüş viseme'si gelmesin (P1-D'deki kural).

**P1-H. Parça 1, 11,5-16,0: saat eklemesi 4,5 sn tamamen donuk.**
- Silme 10,4-11,4'te bitiyor, sonra kadran kıpırtısız kalıyor (2-4 sn kuralı).
- **Düzeltme:** "Saat, düştüğümüz anda durmuş." bölümünde yavaş bir `yaklas` (z +0,12) kullan. Saniye ibresi 13,8'de bir kez titreyip dursun; durduğu anlaşılsın.

**P1-I. Parça 2, 0,0-3,0: yemek yoktan var oluyor.**
- Kadın yalnız bir fincanla giriyor (önceki P1-7).
- 0,6'da kadının ayakları Emir'in bacaklarının üstünde görünüyor; derinlik okunmuyor ve kadın Emir'in üstünde duruyor gibi.
- **Düzeltme:** `prop: "yemek_yaprak"` ile girsin. Yürüyüş yolunu yatağın arkasından değil önünden geçir; ya da kadının ayağı yatak çizgisinin üstünde (daha arkada) kalsın.

**P1-J. Parça 2, 6,0-7,4: "yudum" hâlâ cilveli.**
- Kadın elini çenesine götürmüş ve gülümsüyor; Emir de gözleri yarı kapalı gülümsüyor.
- **Düzeltme:** `emotion: "notr"`. Elde küçük bir lokma gösterilsin.

**P1-K. Parça 2, 24,0-25,9: `angle: "ust"` ağlama planı.**
- Yüz sol üst köşeye sıkışmış, başın üstü kesik. Kadrajın alt %55'i boş zemin ve ön plandaki ateş konisi.
- Sağdaki kol büyük beyaz bir yastık gibi görünüyor.
- **Düzeltme:** `kadraj.cy` +250 ve `cx` +120 ile yüzü kadrajın ortasına al. Ateş konisini kadraj dışına it.

**P1-L. Parça 2, 26,0-28,9 ve 42,4-44,6: köy meydanı.**
- Ortadaki gencin ayakları valizin üstünde; enkaz önde olduğu hâlde genç onun üstüne basıyor gibi.
- Soldaki genç kadrajın kenarında kesik.
- Herkes kameraya bakıyor ve dört kişi sıra hâlinde diziliyor.
- **Düzeltme:** Enkazı x 0-300, y 1650-1900 aralığına (ön plan, ayakların altına) taşı. `y1` x +60. Gençlere `turn` ve `lookAt: yerli_bilge` ver.

---

## 4. P2

1. **Parça 1, 0,3-2,8: POV eli.** İki yuvarlak parmaktan oluşuyor. Dört parmak ve başparmak çiz ya da eli yaprağın arkasında gizle.
2. **Parça 1, 27,4-33,0 ve 37,4-39,8: resepsiyon yakın planı.** Sol üstte kesik TV parçası, üstte kesik "ZENITH GRU" logosu var. Kadrajı kaydır ya da logoyu tümüyle al.
3. **Altyazı satır kırılması.**
   - Parça 1, 29,9-33: "…herhangi / bir".
   - Parça 2, 37-40: "…anlaşma... Bu".
   - Tek sözcük alt satırda yetim kalıyor. Satır bölmeyi sözcük gruplarına göre yap.
4. **Parça 2, 3,0-5,9: hindistan cevizi.** Kenar artık lifli, ama içi parlak bembeyaz bir disk; ayna ya da tabak gibi okunuyor. İçine süt beyazı, yarı saydam bir yüzey, üst kenarda bir parlama ve iç çeper koyuluğu koy.
5. **Parça 2, 34,7-35,0: buruşturma.**
   - Kâğıdın arkasında soluk ikinci bir çerçeve var (hayalet kenar).
   - Parmaklar yarı saydam kahverengi bir leke gibi.
   - Kâğıt buruşmuyor, düz hâlde küçülüyor.
6. **Kolda boncuk dizisi.** Ekleme kolunda boncuk ya da dövme dizisi var, yaşlının geniş planındaki kolunda yok. Ya ikisinde de olsun ya da hiçbirinde olmasın.
7. **Parça 2, 37-42: alevler.** Hâlâ düz zikzak taç biçiminde.

---

## 5. Kullanıcı "amatör" ya da "anlaşılmıyor" der mi?

**Evet, üç yerde neredeyse kesin:**
1. **Parça 1, 27,4-33,0:** Resepsiyonist ahizeyi burnuna dayamış gibi; ekranın en uzun yüz karesi bu. "Amatör" tepkisi beklenir.
2. **Parça 2, 36,0-38,4 ve 42,4-44,6:** Yaşlı bir şey atmıyor. Elindeki halka ateşte dev bir afişe dönüşüyor ve sonra hâlâ elinde duruyor. Hem "anlaşılmıyor" hem "amatör" tepkisi beklenir; kullanıcı bu sahneyi önceki turda zaten sordu.
3. **Parça 2, 7,5-9,3:** "Ne ki bu?" sahnesinde nesne görünmüyor. "Anlaşılmıyor" tepkisi beklenir.

**Orta risk:**
- Panik ve ağlama sırasında sırıtan ağız (parça 2, 13,7 ve 16,0, bastırma çenesi).
- Kadının "Emir?" sırıtması.

İkisi de "karakterler itici" yorumunu tetikler.

**Düşük risk (önceki tura göre belirgin iyileşme):**
- POV.
- Kadının konumu.
- Doğrulma.
- Kulübe altyazısı.
- TV spikeri ve "İSTANBUL" girişi.

**Öncelik sırası:**
1. N-1: ahize.
2. N-2: atış, top ve yanma.
3. P1-D: viseme'nin ağız köşesini ezmemesi. Tek kod değişikliğiyle dört kareyi düzeltir.
4. N-3: "Ne ki bu?".
5. P1-C ve P1-A: yüzlerde şok ve acı.
