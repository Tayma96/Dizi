# Kayıp CEO B2 Parça 3: izleme denetimi (görüntü yönetmeni, 20 Kasım 2026)

**İzlenen dosya:** `bolumler/kayip-ceo-02-parca3.mp4` (33,0 sn, 1080x1920, 30 fps). JSON: `dizi-studio/public/episodes/emir-02-p3.json`.

**Yöntem:**
- 0,5 sn arayla 66 kare alındı ve 4 şeritte incelendi.
- Doğrulma 0,2 sn arayla incelendi.
- Şüpheli anlar tam çözünürlükte kırpılarak incelendi (göz, el, bacak, altyazı).
- Kareler `/tmp/claude-0/-home-user-Dizi/b07199cd-cb6f-51e2-8731-5eac438d8fb0/scratchpad/gy3/` altında:
  - Şeritler: `serit0-3.png`.
  - Toplu kareler: `g_diz.png`, `g_dogrul.png`, `g_kalkis.png`, `g_icir.png`, `g_isim1.png`, `g_isim2.png`, `g_telefon.png`, `g_devir.png`.
  - Kırpmalar: `goz/` (`diz_iki`, `kalp_sen`, `alt_iki`, `icir_goz`, `tel_goz`).
  - Tam kareler: `full/`.

**Kesme zamanları (sahne algılama):**

| Zaman (sn) | Çekim |
|---|---|
| 0-3,6 | Geniş, doğrulma |
| 3,6-5,6 | Orta, kâse |
| 5,6-9,0 | İçirme eki |
| 9,0-10,3 | Akilla yakın |
| 10,3-12,8 | İki çekim: "Emir." ve "Sen?" |
| 12,8-15,2 | Akilla yakın: "Akilla." |
| 15,2-16,5 | Emir orta: "Akela?" |
| 16,5-20,1 | Akilla yakın: gülerek "Akilla." |
| 20,1-22,2 | İki çekim: Emir "Akilla." |
| 22,2-25,5 | Emir orta: "Telefon..." |
| 25,5-27,3 | Telefon eki |
| 27,3-28,9 | Akilla yakın: "Telpon?" |
| 28,9-33,0 | Emir orta: "Ooahhh hayır." ve kararma |

---

## Kullanıcının istediği eylemler okunuyor mu?

| Eylem | Sonuç |
|---|---|
| Acı içinde zorlana zorlana yarı doğrulma | **Kısmen.** Kalkış 0,0-0,6 sn'de tek hamlede oluyor, sonra 3 sn bekliyor. Yüz uykulu, acı okunmuyor (P1-1). |
| Sırtını direğe verme | **Hayır.** Emir sola, kadının bacaklarına yaslanıyor; direk sağ omzunun arkasında kalıyor (P0-2). |
| Kadının diz çökmesi | **Hayır.** Kadın, Emir'in arkasında yatağın üstünde ayakta duruyor gibi görünüyor (P0-1). |
| Suyu içirme | **Evet.** Kabuk ağza geliyor ve eğiliyor. |
| İçerken kadının gözüne bakma | **Zayıf.** Göz bebekleri yalnızca 5 px sola kayıyor ve kadın kadrajda yok. Emir kameraya bakıyor gibi duruyor (P1-2). |
| "Emir." derken göğsüne dokunma | **Hayır.** El karnında; karnını tutuyor gibi okunuyor (P0-3). |
| "Sen?" derken onu gösterme | **Bozuk.** Uzak kol göğsün önünden çaprazlıyor, dirsek topu göğüste yumruk gibi duruyor ve parmak kadının dizini gösteriyor (P0-4). |
| Akilla'nın önce anlamayıp sonra gülümseyerek göğsüne dokunması | **Evet.** Önce 1,1 sn şaşkın, sonra el göğüste. Ancak el, konuşmacı etiketinin altında kalıyor (P1-9). |
| Yanlış ve doğru söyleme, gülerek düzeltme | **Okunuyor.** Ancak 3,6 sn'lik kıpırtısız gülme yakını var ve Emir'in tepkisi gösterilmiyor (P1-4). |
| Kırık telefonu gösterme | **Ana çekimde hayır.** Telefon kasık hizasında, küçük mavi bir çubuk gibi duruyor ve ona gösterilmiyor. Ek çekim (25,5 sn) kırığı iyi gösteriyor (P0-5). |
| "Telpon?" (şaşkın) | **Evet.** |
| "Ooahhh hayır" derken göz devirme | **Hayır.** Gözler 4 sn boyunca aynı kalıyor, yalnızca bir kez kırpıyor (P0-6). |

---

## P0: kullanıcı fark eder ve reddeder

### P0-1. Diz çökme okunmuyor (0,3-33 sn, tüm geniş, orta ve iki çekimler)
- **Ne görülüyor:**
  - `diz` pozu kadını yaklaşık 185 px alçaltıyor, ama önden çizildiği için kısa bacaklı, ayakta duran bir kadın gibi okunuyor.
  - Eteğin altında dik bir baldır ve ayak var. Ayaklar yatağın saman şiltesinin üstünde; kadın yatağın içinde, Emir'in hemen arkasında duruyor gibi.
  - Başı her iki çekimde Emir'in başından yaklaşık 250 px yukarıda.
  - Çökme 0,0-0,6 sn'de, Emir'in kalkışıyla aynı anda oluyor ve göze çarpmıyor.
- **Düzeltme (JSON):**
  - `scenes[0].isaretler.bas` değerini yatağın ÖNÜNE, zemine al: yaklaşık `{x: 190, y: 1600, size: 900}` (denenmeli). Böylece kadın yatağın arkasında kalmaz, bacakları ve yere değen dizi görünür.
  - Kadın Emir'e dönük olsun (`turn`/yaw ile).
  - Diz çökmeyi ayrı bir vuruş yap: Emir doğrulduktan sonra, ~0,8 sn, `genis` çekim.
  - Hedef: diz çökünce kadının başı Emir'in başıyla aynı hizada ya da ±60 px içinde olsun.
- **Düzeltme (kod, `rig/Character.tsx` ~400):**
  - Önden diz çökme fotoğrafta da zor okunur.
  - `yaw` > 0,3 olduğunda 3/4 profil varyantı ekle: uyluk yatay ve öne, baldır yerde, ayak tabanı arkada görünsün.
  - `diz` pozunun hiçbir kontrol kompozisyonunda karesi yok. `Kadro` ya da `Jestler`'e önden ve 3/4 iki kare ekle.

### P0-2. Sırtını direğe vermiyor, kadına yaslanıyor (0,4-5,6 sn ve sonraki tüm iki çekimler)
- **Ne görülüyor:**
  - Emir'in gövdesi başı solda olacak biçimde sola yatıyor; sırtı kadının eteğine ve bacağına dayanıyor.
  - `direk: 560` sağ omzunun arkasında kalıyor. Dünya koordinatında baş x≈385-480, direk x≈525-595.
  - İzleyici "kadına yaslanmış" görüyor.
- **Düzeltme (JSON):**
  - `scenes[0].direk` değerini ≈ 430 yap; direk başının ve sırtının tam arkasına gelsin (denenmeli).
  - P0-1'deki gibi kadını arkadan çıkar.
  - Son `dogrulma` değerini 0,85'ten 0,95'e çıkar; gövde direğe dik yaslansın.
  - İstenirse sırt direğe değdiğinde kısa bir nefes verme ya da göz kapama vuruşu ekle.

### P0-3. "Emir." (10,3-11,6 sn): el göğüste değil, karında
- **Ne görülüyor:** `eliKalbinde`, `dogrul` gövdesinde ön kolu bel bağının altına, karına götürüyor. Emir karnını tutuyor gibi okunuyor; kendini tanıtma anlamı kayboluyor.
- **Düzeltme (JSON):**
  - Bu vuruşta `cast.emir_kulube.kol.R` değerini yaklaşık `{upper: -35, fore: -150, ul: 0.6}` yap (denenmeli). Hedef: el göğüs kemiğinde, yaka altında.
- **Düzeltme (kod, kalıcı):** `Episode.tsx` / `Character.tsx` içinde `dogrul` eğimi kol açılarına eklenince jest hedefi kayıyor. Jestler, gövde eğiminden bağımsız olarak göğse göre çözülmeli.

### P0-4. "Sen?" (11,6-12,8 sn): üçüncü kol görüntüsü, dizi gösteriyor
- **Ne görülüyor:**
  - `kol.L {upper: 72, fore: -12}` uzak kolu göğsün önünden sola çaprazlıyor.
  - Omuzdaki dirsek topu göğüste ayrı bir yumruk gibi duruyor; yaka altından ikinci bir kol çıkıyor gibi.
  - Parmak ucu kadının dizini ve eteğini gösteriyor.
- **Düzeltme (JSON):**
  - Yakın kolla göster: `kol: {R: {upper: 110, fore: -5}}` (denenmeli). L kolu `rest` olsun.
  - P0-1 düzeltilince parmak kadının göğsüne gelir.
  - Sonraki vuruştaki `"kol": {}` sıfırlaması kalsın.

### P0-5. Telefonu göstermiyor (22,2-25,5 sn)
- **Ne görülüyor:**
  - `okuma` jestiyle telefon kasık hizasında duruyor: küçük, parlak mavi bir çubuk.
  - Emir telefona da kadına da bakmıyor.
  - "Telefona ihtiyacım var" derken kaşları öfke V'sinde (`kararli`); sinirli okunuyor, yalvarma okunmuyor.
  - Altyazı ve "EMİR" etiketi eli örtüyor.
- **Düzeltme (JSON):**
  - Telefonu ona uzatsın: `gesture: "uzat"` + `prop: "telefon"`, ya da `kol.R ≈ {upper: 70, fore: -50}`. Telefon göğüs hizasında ve kadına dönük olsun.
  - `bak` kadına: `x: -1, y: -0.3`.
  - Duygu `kararli` yerine `uzgun` olsun: iç kaş yukarıda, yalvaran bakış.
  - `kadraj.cy` değerini 1130'dan ≈1080'e indir; el altyazı bandından çıksın.
- **Düzeltme (kod, isteğe bağlı):** `rig/gestures.ts` içine `telefonGoster` jesti ekle: ekran karşıya dönük, kol yarı uzanmış.

### P0-6. Göz devirme yok (28,9-33,0 sn)
- **Ne görülüyor:**
  - `bak {x: 0, y: -1}` göz bebeğini yalnızca 5 birim oynatıyor (`face.tsx`: `iy = cy + lookY*5`); `yorgun` emotion'ının ağır kapakları bunu da örtüyor.
  - Bebekler alt kapakta duruyor; bakış aşağı ve ileri gibi.
  - 4,1 sn kıpırtısız orta çekim; tek değişim bir göz kırpma.
  - Orta çekimde göz yaklaşık 50 px; devirme telefonda zaten seçilmez.
- **Düzeltme (kod, `rig/face.tsx` / `Character.tsx`):**
  - Göz devirme animasyonu ekle, ör. `tik: "gozDevir"`:
    - ~0,7 sn'de bebekler sol üst → tam üst → sağ üste yay çizer.
    - Üst kapak açılır.
    - Baş 6-8° geriye yatar.
    - Ardından nefes verilir: baş öne düşer, gözler kapanır.
- **Düzeltme (JSON):**
  - Bu replikte çekim `yakin` (on: `emir_kulube`), hareket `yaklas` olsun; ölçek duyguya uysun.
  - Emotion `yorgun` → devirme sırasında `notr` (kapaklar açık), sonra `yorgun`.
  - Kadın için ayrı bir tepki vuruşu ekle: `saskin` ya da `utangac`. Şu an arka planda nötr gülümsüyor.

---

## P1: düzeltilmeli

### P1-1. Doğrulma çok hızlı, yüzde acı yok (0,0-3,6 sn)
- **Ne görülüyor:**
  - Kalkış 0,6 sn'de bitiyor, sonra 3 sn bekliyor. Arada küçük bir sarkma var (1,8-2,4 sn) ama okunmuyor.
  - `aci` yüzü yarı kapalı gözlerle uykulu ve üzgün okunuyor.
- **Düzeltme (JSON):** İlk vuruşu üçe böl:
  1. `dogrulma 0.25`, 1,2 sn, ilk inleme.
  2. `dogrulma 0.12`, 0,5 sn, geri düşüş.
  3. `dogrulma 0.55`, 1,9 sn, ikinci inleme.
  - Bu vuruşlarda `sweat: true`, `pale: true`.
- **Düzeltme (kod):** `aci` için gözleri sıkan bir ifade ekle (`squeeze` > 1, dişler sıkılı).

### P1-2. İçirme ekinde göz teması zayıf, 3,4 sn tek poz (5,6-9,0 sn)
- **Ne görülüyor:**
  - `Inserts7.tsx` `Icir`: `lookX -0.75` → bebekler 5 px sola kayıyor; izleyici kameraya baktığını düşünür.
  - Ekin ilk karesinde (5,6) yüz gülümsüyor; önceki çekimde `uzgun` idi.
  - 2,2 sn'den sonra hiçbir şey değişmiyor.
  - Kadının bileğindeki sarı elips (bilezik) ana çekimlerde yok ve garip bir leke gibi duruyor.
- **Düzeltme:**
  - `Icir` içinde `lookX: -1, lookY: -0.35` ve bakış katsayısını büyüt (bkz. P1-7).
  - Başlangıç emotion'ı `yorgun` olsun.
  - 2,6 sn'de göz kırpma ve hafif kaş kalkması ekle.
  - Bileziği kaldır ya da kadının kostümüne ekle.
  - JSON'da ek süresi 3,4 → 2,6; sonraki Akilla yakını 1,3 → 1,8. Göz göze gelme, kesmeyle kurulsun.

### P1-3. Akilla yakınlarında Emir'in yarım yüzü kadraj kenarında (9,0 / 12,8-15,2 / 16,5-20,1 / 27,3-28,9 sn)
- **Ne görülüyor:**
  - Sağ alt köşede Emir'in yüzü gözün ortasından kesiliyor; kameraya bakan bir göz kalıyor.
  - Dört yakında da aynı kadraj kullanılmış.
- **Düzeltme (JSON):** Bu çekimlere `kadraj` ekleyip cx'i ~100 px sola kaydır ve Emir'i tamamen dışarıda bırak. Ya da omuzunu ve ensesini net gösteren bir omuz üstü çekim kur.

### P1-4. Gülerek düzeltme 3,6 sn kıpırtısız (16,5-20,1 sn)
- **Ne görülüyor:** Gözler kapalı `gulen` yüz, sabit kamera; omuz ve baş hareketi yok. Emir'in mahcup tepkisi hiç görülmüyor.
- **Düzeltme (JSON):**
  - Bu replikte çekim `iki` (on: `yerli_kadin`, with: `emir_kulube`) olsun; Emir `utangac`.
  - Ya da `yakin` + `move: "yaklas"` + `gesture: "eliYuzunde"` (gülerken eli ağzına).

### P1-5. Altyazı "var." tek başına kalıyor ve eli örtüyor (22,2-25,5 sn)
- **Ne görülüyor:**
  - 37 karakter kuralı yüzünden ilk kart "Telefon... Akilla. Telefona / ihtiyacım" oluyor.
  - "var." 24,9-25,5 sn'de tek başına yanıp sönüyor.
- **Düzeltme (kod, `engine/Overlays.tsx` ~30):**
  - Bölmeyi önce cümle sonu noktalamasında (`.`, `?`, `…`) yap.
  - Tek kelimelik son parçayı önceki parçaya kat.
  - Beklenen bölüm: "Telefon... Akilla." / "Telefona ihtiyacım var."

### P1-6. Telefon ekinde kol çıplak (25,5-27,3 sn)
- **Ne görülüyor:**
  - Emir'in uzun beyaz kollu gömleği var, ama ekte ön kol bilekten aşağı tamamen ten rengi; kol ağzı y>1880'de, neredeyse kadraj dışında.
  - Ekran kameraya dönük, yani bu Akilla'nın bakış açısı. Arkadaki bulanık siluet Emir olmalı, ama yeşil saç bandı ve beyaz gömleği yok.
- **Düzeltme (`Inserts7.tsx` `TelefonKirik`):**
  - Kol ağzını bileğe kadar çıkar ve yeşil yaprak sargıyı ekle.
  - Siluete yeşil bant ve beyaz gövde ver.
- **Not (P2):** Ana çekimde telefonun sırtı parlak mavi, ekte gövde siyah. Rengi tek bir koyu tona çek.

### P1-7. Emir iki ve orta çekimlerde kadına değil kameraya bakıyor (10,3-25,5 sn)
- **Ne görülüyor:** `bak x: -0.6` → bebek 4 px kayıyor. Kadın üstte ve solda, ama bakış düz ve ileri.
- **Düzeltme:**
  - `face.tsx` `Eye` içinde bakış katsayılarını büyüt: `lookX*7` → `*11`, `lookY*5` → `*9`. Önce `Duygular` kontrol karesinde dene.
  - JSON'da kadına bakarken `bak {x: -1, y: -0.3}` kullan.

### P1-8. Emir orta çekimlerinde kadın yüzünün ortasından kesiliyor (15,2-16,5 ve 22,2-25,5 sn)
- **Düzeltme (JSON):**
  - `kadraj.cx` 540/560 → ≈620: kadın çıkar, temiz tek çekim olur.
  - Ya da cx ≈470: kadın bütünüyle girer.
  - Yarım yüz kalmasın.

### P1-9. "Akilla." (14,0-15,2 sn): göğsteki el konuşmacı etiketinin altında
- **Ne görülüyor:** "AKİLLA" etiketi ve altyazı kutusu eli ve kolyeyi örtüyor; isim söyleme jesti yarım okunuyor.
- **Düzeltme (JSON):** Bu yakına `kadraj` ver; z'yi hafif düşür ya da cy'yi aşağı al. El y<1500'de kalsın.

---

## P2: küçük
- **3,6-5,6 sn:** Kadın kâseyi belinde tutuyor; kesmeden önce Emir'e doğru kaldırmalı (eylemde eşleşme). JSON `gesture: "uzat"`.
- **28,9-33 sn:** Kadının yüzü nötr ve gülümsüyor. "Telpon?" şaşkınlığının devamı olarak `saskin` daha uygun.
- **Ses (ses yönetmenine):**
  - Whisper "Ooahhh hayır." yerine "Ah, ah, ayır.", "Telpon?" yerine "Telpom?" duymuş.
  - "Akilla." (a_10) 3,3 sn sürüyor; içinde gülme var, görüntüde gülme hareketi yok (P1-4).

## Süreklilik ve 180°
- **180° kuralı:** Kadın her çekimde solda, Emir sağda; içirme ekinde kol da soldan geliyor. Tutarlı.
- **Yaralar:** Alındaki kesik, burun çizgisi ve yanak morlukları ek çekimlerde ve ana çekimlerde aynı.
- **Kostüm ve eşya:** Kostüm tutarlı; istisnalar telefon ekindeki çıplak kol (P1-6) ve içirme ekindeki bilezik (P1-2).
- **Kâse:** Hindistan cevizi kâse, ana çekimde ve ekte aynı (kahverengi dış, beyaz iç).
- **Altyazı:** Altyazı y≈1580-1690'da; hiçbir yüzü kapatmıyor. Yalnızca eller kapanıyor (P0-5, P1-9).
