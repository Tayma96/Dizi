# Kayıp CEO B2: izleme denetimi (görüntü yönetmeni, 20 Kasım 2026)

**İzlenen dosyalar:**
- `bolumler/kayip-ceo-02-parca1.mp4` (37,0 sn, 75 kare)
- `bolumler/kayip-ceo-02-parca2.mp4` (44,6 sn, 89 kare)

**Yöntem:**
- Her 0,5 sn'de bir kare alındı, hiçbir saniye atlanmadı.
- Şüpheli anlar 5-10 fps şeritle ve tam çözünürlükte (1080x1920) ayrıca incelendi.
- Kareler: `/tmp/claude-0/-home-user-Dizi/b07199cd-cb6f-51e2-8731-5eac438d8fb0/scratchpad/gy/` (`s1_*.png`, `s2_*.png`, `full/`, `dogrul.png`, `firlat.png`, `giris.png`, `yaprak_cmp.png`).

**Önemli not:**
- Altyazı motorda y≈1290-1450 aralığına basılıyor (`engine/Overlays.tsx`, `bottom: 1920-1450`).
- Kulübede yatan Emir'in yüzü de tam bu bantta, y≈1300-1560. Aşağıdaki çakışmaların çoğu bundan kaynaklanıyor.

---

## P0: kullanıcı fark eder ve reddeder

### P0-1. Parça 1, 0,0-3,0 sn: POV'da kadının üç kolu var, yaprak alna değil karnına gidiyor
- **Ne görülüyor:**
  - Kadının iki kolu da yanlarında aşağı sarkık duruyor (sol yumruk y≈1700, sağ el kalçada).
  - Yaprağı tutan ayrı bir kol sağ kenardan yatay giriyor: üçüncü bir kol.
  - Yaprak kadrajın alt yarısına, kadının karnının önüne iniyor ve orada büyüyor.
- **Neden yanlış:**
  - Bariz bir anatomi hatası.
  - İzleyici "yaprağı alnıma koydu" yerine "elinde yaprak tutup indirdi" görüyor. Kullanıcının metnindeki ilk eylem okunmuyor.
  - Göz kırpma (1,5 sn) dokunuşla eşleşmiyor; yaprak o anda alt kenarda kalıyor.
- **Düzeltme:** `engine/Inserts7.tsx` → `PovYaprak`
  - **Kol:** Ayrı kolu (iki `path` ve `circle`, satır ~51-53) kaldır. Kadının kendi pozuna `gesture: "uzat"` ver ve yaprağı onun sağ eline bağla. Ya da kolu omuz noktasından (≈ x 700, y 900) başlat ve sağ kolu `hideArm` ile gizle.
  - **Yaprağın yolu:** `leafY` [1260→1760] olsun → [1100→-150]. `leafS` [0,8→2,3] olsun → [1,0→3,4]. Yaprak kameraya, yani kadrajın ÜST kenarına gelip üst üçte biri kaplamalı (alın, POV'da görüşün hemen üstündedir).
  - **Dokunuş anı:** Yaprak üst kenara değdiğinde kısa bir mavi-serin parlama ve damla, ardından göz kırpma gelsin.
  - **Kadının duruşu:** Kadın eğilmiş görünmeli: `tilt: -7` yanında `top` değerini 520'den 700'e indir, başı kadrajın üst üçte birine taşıyıp hafif aşağı baktır (`lookY: 0.45`).

### P0-2. Parça 1, 3,0-17,9 sn: kadın yaprağı koyduktan bir kare sonra kapıda; isim alışverişi oda boyunca yapılıyor
- **Ne görülüyor:**
  - POV'da kadın Emir'in tepesinde, yaprağı alnına koyuyor.
  - Kesme (3,0 sn) geliyor ve kadın ~5 metre ötede, kapı ağzında hazır ola geçmiş duruyor (`mark: "arka"` x 930).
  - "Emir." (14,0) ve "Emir?" (15,5) repliklerinde ikisi aynı kadrajda hiç yok. Kadın kapıda kalıyor.
- **Neden yanlış:**
  - Işınlanma ve süreklilik kopması var.
  - Kullanıcının istediği "adını işaretlerle söyler, kadın ona tuhaf bir merakla bakar" anı yakınlık ister. Uzaklık bu anı öldürüyor.
  - İzleyici kimin kime konuştuğunu kuramıyor. Bu kusur benim planımdan geliyordu (§2 "kapı ağzında"), hatayı kabul ediyorum.
- **Düzeltme:** `public/episodes/emir-02-p1.json`, sahne `a`
  - **Konum:** `isaretler`'e `"bas_ucu": {"x": 430, "y": 1500, "size": 900}` ekle. `cast.yerli_kadin`: `"mark": "bas_ucu", "body": "sit"`.
  - **Geniş vuruş** ("Yaşıyorum…"): `cast.yerli_kadin.gesture: "uzat"` → 1 sn sonra `rest`. Elini alnından çekerken görülsün.
  - **"Emir." vuruşu:** `shot: {"type": "iki", "on": "emir_kulube", "with": "yerli_kadin"}`. Jest (`eliKalbinde`) ile kadının yüzü aynı karede olsun.
  - **"Emir?" vuruşu:** `shot: {"type": "yakin", "on": "yerli_kadin"}`. Arkada kapı değil duvar ve ışık şeridi olur. Ekseni korumak için kadın kadrajın sağında, sola (Emir'e) baksın.

### P0-3. Altyazı Emir'in yüzünü kapatıyor
- **Yerler:**
  - Parça 1, 3,0-6,6: "Yaşıyorum… Ama her yerim yanıyor." doğrudan yüzün ve gövdenin üstünde.
  - Parça 2, 14,0-19,4: "Gitmeliyim…" ağız ve çene hizasında.
  - Parça 2, 8,0-13,5: altyazı göğüs ve kol üstünde, bu daha hafif.
- **Neden yanlış:** Yüz okunmuyor; duygu karesi altyazıyla örtülüyor.
- **Düzeltme:**
  - **Parça 1, sahne `a`, geniş vuruş:** `shot.kadraj: {"cx": 540, "cy": 1250, "z": 1.25}`. Emir'in başı y≈900-1050'ye çıkar, üstteki boş saz tavan kırpılır.
  - **Parça 2, "Gitmeliyim…" `iki` vuruşu:** `kadraj: {"cx": 470, "cy": 1250, "z": 1.35}`. Başlar y<1150'de kalır.
  - **Alternatif (motor düzeyi):** Kulübe sahnesine özel altyazı yeri. `scene.altyaziY: "alt"` ile `Overlays.tsx`'te `bottom: 120` kullanılır. Kulübede alt kısım zaten boş zemin.

### P0-4. Parça 1, 6,6-9,3 sn: "doğrulmaya çalışır, acıyla geri düşer" görülmüyor
- **Ne görülüyor:**
  - Kalkış 6,8-7,4 sn arasında. Kamera (`yakin`, `on: emir_kulube`) başı takip ettiği için kalkış kadrajda neredeyse kıpırtısız.
  - 7,4-9,0 sn arası aynı poz: yalnız göz kırpma var.
  - Geri düşüş beat'in son 0,55 sn'sine sıkışmış (`Episode.tsx:149`, T-0,75…T-0,2). 9,3'te saate kesildiği için ekranda ~0,3 sn kalıyor.
  - Yüz `aci` olmasına rağmen uykulu ya da huysuz görünüyor; acı buruşması yok.
  - Kadının `uzat` jesti kadraj dışında kalıyor.
- **Neden yanlış:** Kullanıcının metnindeki eylem ekranda yok. İzleyici 3 sn boyunca hareketsiz bir yüz görüyor.
- **Düzeltme:**
  - **Kamerayı sabitle:** `emir-02-p1.json`, sahne `a`, `action` vuruşunda `shot: {"type": "orta", "kadraj": {"cx": 420, "cy": 1300, "z": 1.8}, "move": "sabit"}`. Kamera başı takip etmediği için kalkış ve düşüş kadrajda görülür.
  - **Süre:** `dur: 3.0` → `3.6`. Düşüş en az 0,6 sn görünsün; ardından 0,4 sn düşmüş hâlde nefes ve `sfx` inleme gelsin.
  - **Düşüş zamanı:** `Episode.tsx` kısmi doğrulmada düşüşü `[T-1.1, T-0.5]` aralığına çek. Kesmeden önce yere oturmuş poz kalsın.
  - **İfade:** Kalkarken `emotion: "aci"` yanında yüzde gözler sıkılı ve dişler kenetli olmalı. `face2d` / `rig/emotions` → `aci` ifadesinde `squeeze` ve ağız değerleri artırılmalı. Şu hâliyle `yorgun`'dan ayırt edilmiyor.
  - **Kadının jesti:** Kadın `bas_ucu`'nda olursa (P0-2) `uzat` jesti aynı kadrajda görülür.

### P0-5. Doğrulma rigi: tüm beden tahta gibi kalçadan dönüyor, bacaklar yatağın altına giriyor
- **Yerler:** Parça 2, 14,0-19,4 ("Gitmeliyim…"). Ayrıca parça 1, 7,0-9,0 ve parça 2, 7,0-13,5.
- **Ne görülüyor:**
  - Gövde ve bacaklar tek parça çapraz bir çubuk hâlinde.
  - Kalça ve bacaklar yatağın üst çizgisinin (y≈1580) altına, karanlığa iniyor. Emir yataktan baş aşağı kayıyor gibi görünüyor.
- **Neden yanlış:** Geometri hatası. Oturmaya çalışan biri değil, yataktan düşen biri görünüyor.
- **Düzeltme:** `engine/Episode.tsx` (lieAng bloğu, satır ~134-160) ve `rig/Character.tsx`:
  - `body: "dogrul"` ve `zemin: true` olduğunda yalnız üst gövde dönsün. Bacaklar yatay kalsın (ayrı grup, açı -90°).
  - Ya da `hideLegs: true` verip `Blanket` çiz. Şu an `zemin` olunca `hideLegs` false oluyor (satır 297, 317).
  - Kontrol karesi: `Kadro`, yatak üstünde `dogrulma` 0,4 / 0,7 / 1,0.

### P0-6. Parça 1, 19,5-30,5 sn: TV ekleme planı 11 sn boyunca neredeyse donuk ve kadrajın alt %40'ı simsiyah
- **Ne görülüyor:**
  - Ekran y 80-1160 arasında. Altı boş siyah, yalnızca altyazı var.
  - 11 sn'de tek görsel değişiklik var: 25,5'te portre ve harita belirmesi. Spikerin ağzı çok az kıpırdıyor; ölçülen kare farkı ortalama 3/255.
  - Spiker koyu saçlı, takım elbiseli genç bir adam. Emir'in portresi gelene kadar (25,5) izleyici spikeri Emir sanabilir.
- **Neden yanlış:**
  - "Görsel değişim 2-4 sn" kuralı ihlal ediliyor. 6 + 5 sn ölü an var.
  - Kullanıcının "amatör" dediği türden bir ekran görüntüsü gibi duruyor.
- **Düzeltme:** `emir-02-p1.json`, sahne `b`. Üç spiker repliğini kesmelerle böl (`shots` alanı):
  1. Replik 1 ("…sinyali kesildi."):
     - 0-2,2 sn: `tv_son_dakika` "1".
     - 2,2 sn'den sonra `shots: [{"at": 2.2, "shot": {"type": "omuz", "on": "zenith_resepsiyon", "move": "yaklas"}}]`: resepsiyonistin arkasından ve omzu üstünden TV.
  2. Replik 2 ("Hint Okyanusu…"): `tv_son_dakika` "2", portre ve harita. 2 sn sonra `shots` ile resepsiyonistin yakın planı: ahize yavaşça iner.
  3. Replik 3 ("akıbeti…"): tamamı resepsiyonist, `yakin`, `emotion: "sok"`, `move: "yaklas"`.
  - **TV kadrajı:** `Inserts7.tsx` → `TvSonDakika`. TV'yi dikey kadraja doldur: ekranı y 80-1700 aralığında ölçekle ve bantları y≈1050'ye al. Ya da ekranın altında masa ve resepsiyonistin bulanık omzunu ön plan olarak göster. Alt %40 siyah kalmamalı.
  - **Spiker:** Emir'den ayrışan bir siluet olsun: kadın spiker ya da kır saçlı, gözlüklü orta yaşlı bir erkek (`cast.json`'a `spiker` kaydı). Konuşurken dudak senkronu açık olmalı (`amp`).

### P0-7. Parça 1, 31,0-35,3 sn: altyazı beyaz masanın üstünde okunmuyor, resepsiyonistin tepkisi yok, ahize havada kayboldu
- **Ne görülüyor:**
  - "CEO Emir Özdemir'in akıbeti henüz / bilinmiyor." beyaz yazı açık gri masanın üstünde (y≈1395-1440) okunmuyor.
  - Resepsiyonistin yüzü düz; `sok` okunmuyor.
  - Önceki karede ahize elindeydi. Bu karede eli boğazında yumruk hâlinde, ahize yok: nesne kesmede kayboluyor.
  - 4,3 sn kıpırtısız vesikalık gibi önden çekim.
- **Düzeltme:**
  - **Kadraj:** `emir-02-p1.json`, sahne `b`, 3. replik: `shot.kadraj: {"cx": 540, "cy": 1000, "z": 1.9}`. Masa kadrajın altına iner, arka plan koyu cam olur ve altyazı koyu zemine düşer.
  - **Ahize:** `cast.zenith_resepsiyon` `prop: "ahize"` + `gesture: "telefon"` replik başında kalsın; replik ortasında `gesture: "rest"` ile ahize ELİYLE birlikte insin. Bunun için `rig/gestures.ts`'e `ahize_indir` geçiş jesti eklenmeli; prop el kemiğine bağlı kalmalı. "prop none" ile anında silmek olmaz.
  - **İfade:** `emotion: "sok"` + `pale: 0.4`. Yüzde sok çok zayıf: kaşlar yukarı ve ağız aralık olmalı (`rig/emotions` → `sok`).
  - **Genel kural:** Altyazının altına her zaman yarı saydam koyu bir şerit (`Overlays.tsx`, `rgba(0,0,0,0.35)`) konmalı. Açık zeminlerde de okunur.

### P0-8. Parça 2, 7,0-13,9 sn: "Ne ki bu?" sorulan nesne görünmüyor, panik repliği gülümseyen yüzle söyleniyor
- **Ne görülüyor:**
  - **"Ne ki bu?" (7,0-8,9):** Hindistan cevizi sağ alt köşede yarısı kesik (x 870-1080) ve fincan gibi görünüyor. Emir nesneye değil sağa bakıyor (`bak: {"x": 0, "y": 0.5}` aşağı bakışı vermiyor).
  - **"Nerdeyim ben? Mürettebat nerde? Pilot, hostes, onlar?" (9,0-13,9, `korkmus`):** Yüz yarı kapalı göz kapakları, tek kaş yukarı ve ağzı açık hafif gülümsemeyle kendinden emin ya da alaycı görünüyor. Ayrıca 4,9 sn tek çekim.
- **Neden yanlış:**
  - Duygu repliğin tam tersini söylüyor; kullanıcının "şok hâlindedir" notuna aykırı.
  - Soru nesnesi kadrajda yok.
- **Düzeltme:**
  - **"Ne ki bu?":** Önce `insert` `yemek_el` (Emir'in sargılı elinde hindistan cevizi, saat görünür), sonra Emir `yakin`. Ya da `shot.kadraj` ile eli ve nesneyi merkezde tut. Emir'e `bak: {"x": 0.35, "y": 0.6}` ver, nesneye baksın.
  - **İfade (`rig/emotions` / `face2d`):** `korkmus` ifadesinde üst göz kapağı açık olsun (`eyeOpen` ≥1,1), kaş iç uçları yukarı kalksın, ağız gergin ve aşağı dönsün. Şu an `yorgun` göz kapağı tabanı (`eyeOpenBase`) üstüne biniyor gibi.
  - **Replik bölme:** `shots` ile üçe böl:
    - "Nerdeyim ben?" Emir yakın.
    - "Mürettebat nerde?" kadının tepki yakın planı (`uzgun`, başını hafif eğer).
    - "Pilot, hostes, onlar?" Emir `cok_yakin`, `tears: 0.3`, `sarsinti` yok, `yaklas`.

### P0-9. Parça 2, 19,4-23,3 sn: "omuz_bastir" eklemesi kol yığını gibi, başsız gövde var, eylem okunmuyor
- **Ne görülüyor:**
  - Kadının iki kolu, Emir'in yumruğu ve Emir'in çapraz giden iki beyaz kolu üst üste binmiş: 5 uzuv.
  - Üstte kafasız, dev ten rengi bir sütun var: boyun. Parmaklar dörder sosis biçiminde, başparmak yok.
  - Bir önceki karede (19,0) kadın Emir'in arkasında dimdik ve eller sarkık duruyordu. Eğildiği hiç görülmüyor.
  - Altyazı "Şşş…" tam ellerin üstünde.
- **Neden yanlış:** Bölümün duygu doruğu ("omzundan ve göğsünden yavaşça bastırır") anlaşılmıyor ve en amatör çizim burada.
- **Düzeltme:**
  - **Nesnel çekimde göster:** `emir-02-p2.json`, sahne `a`, "Şşş…" vuruşu. `ekle: omuz_bastir` yerine `shot: {"type": "iki", "on": "yerli_kadin", "with": "emir_kulube", "kadraj": {"cx": 400, "cy": 1250, "z": 1.5}}`. `cast.yerli_kadin: {"gesture": "bastir", "body": "sit"}` (planlanan YENİ jest; sol avuç omuzda, sağ avuç göğüste, 0,6 sn geçiş). `cast.emir_kulube: {"body": "dogrul", "dogrulma": 0.45, "geriDus": true}`.
  - **Eklemeyi düzelt:** Ekleme kalacaksa `Inserts7.tsx` → `OmuzBastir` sadeleştirilmeli:
    - Tek bir kadın eli (başparmaklı) omuzda, biri göğüste.
    - Emir'in eli bileğini kavrar, sonra gevşer.
    - Boyun sütunu kaldırılır; kadraj çene altından başlar ve çene görünür.
    - Emir'in kendi kolları gövdenin yanında olur, çapraz X olmaz.
  - **Altyazı:** Bu vuruşta `label: ""` ve altyazı zaten kısa. Altyazıyı ellerden uzak tut (P0-3'teki `altyaziY`).

### P0-10. Parça 2, 33,0-37,0 sn: buruşturma ve ateşe atma gösterilmiyor
- **Ne görülüyor:**
  - **"Buruş" eklemesi (33,0-35,1):** Kâğıt yalnızca küçülüyor ve üstüne birkaç kırışık çizgisi geliyor. El hiç kapanmıyor, parmaklar kâğıdın önünde açık duruyor.
  - **Fırlatma (35,2-36,5):** Yaşlının elinde kâğıt YOK (`prop: "none"`); boş kolunu robot gibi yana uzatıyor. Kâğıt havada uçmuyor.
  - **Ateş (36,6-):** Kâğıt yeniden DÜMDÜZ ve daha BÜYÜK hâlde alevlerin üstünde dikey olarak süzülüyor. Buruşuk top hâli kayboluyor.
- **Neden yanlış:** Kullanıcının metnindeki son eylem ("Adam buruşturur, ateşin içine atar") ekranda yok. Süreklilik kopuyor (buruşuk → düz).
- **Düzeltme:**
  - **Buruşturma:** `Inserts7.tsx` → `Sozlesme`, `burus` fazı. El parmakları kâğıdın kenarını kavrayıp kapanmalı (4 parmak + başparmak, 6 ara poz). Kâğıt yamuk çokgen morfla topa dönüşmeli (kenar noktaları merkeze, `buruşma` 0→1). Sonda avuçta buruşuk top kalmalı.
  - **Fırlatma:** `emir-02-p2.json`, sahne `b`, 5. vuruş: `cast.yerli_bilge: {"gesture": "uzat", "prop": "kagit_top"}`. YENİ prop: buruşuk top. Ardından `shots: [{"at": 0.6, ...}]` ile ateşin `yakin` planı: top yay çizerek ateşin ORTASINA düşer (yeni ekleme fazı `"dus"`).
  - **Yanma:** `ates` fazı yere düşmüş buruşuk topla başlasın. Isıyla yarı açılsın (plandaki "ısıyla açılır" ancak yerde ve yatay hâlde inandırıcı olur), tutar 1,5 sn okunsun. Havada dikey poster gibi durmasın.

---

## P1: ciddi, düzeltilmeli

1. **Parça 1, 9,3-13,9: kol saati.**
   - "İkiyi yedi geçiyor" söylenirken (≈9,5-11,8) başparmak tam ibrelerin üstünde.
   - Yıldız çatlağın merkezi ibre milinin yanında (`cx+10, cy-10`). Beyaz, ince, uzun çatlak çizgileri fazladan ibre gibi okunuyor; kadranda 5 ibre var sanılıyor.
   - Kayış bileğin 240 px üstüne ve 340 px altına, boşluğa taşıyor.
   - **Düzeltme:** `Inserts7.tsx` → `KolSaati`:
     - Silmeyi `thumbX` zamanlarıyla [0,2-1,2] sn'ye al. Ekleme süresini artırmak için repliğin önüne 1,2 sn'lik `action` ekle (`emir-02-p1.json`); replik temiz kadranda söylensin.
     - Çatlak merkezini (cx+150, cy+130)'a taşı, çizgileri kısa ve kırık yap.
     - Kayışı y 540-1260 bandına kırp; uçları bileğin kıvrımında koyulaşarak kaybolsun.
2. **Parça 1, 0-17,9: "serin yaprak" görünmüyor.**
   - Alındaki yaprak sargının altında yarı saydam küçük bir parça olarak kalıyor ve telefonda görünmüyor (`yaprak_cmp.png`).
   - Yatağın kenarında ayrı bir yaprak var; yakın planda havada asılı gibi görünüyor.
   - **Düzeltme:** `rig/Character.tsx` satır 613: yaprağı sargının ÜSTÜNE çiz (sargıdan sonra render). Ölçeği 1,4 olsun, rengi açık #8ab85a, su damlası 2 adet.
   - Parça 2'de `yaprak: false` olduğunda yaprak düşüp yatakta görünsün; bunu `Ne ki bu?` vuruşunda Emir'in eliyle kaldırması olarak yap.
3. **Parça 1, 15,5-17,9: "Emir?" yakın planı.**
   - Yüz `dusunceli` ama sıkılmış ve uykulu görünüyor; "tuhaf merak" yok.
   - Eller sarkık, 2,4 sn kıpırtısız, `gapAfter: 1.3` ölü an.
   - **Düzeltme:** `emotion: "saskin"` (kaşlar yukarı), `tilt: 8` (planda vardı, uygulanmamış), `gapAfter` sırasında başını hafif yana eğsin ve bir adım öne gelsin (`mark` küçük kayma).
4. **Bütün karakterler: göz tasarımı.**
   - Ağır, yarı inik üst kapak ve göz altı çizgileri (`Eye`, `eyeOpenBase`) herkesi uykulu, alaycı ya da yaşlı gösteriyor:
     - Kadın: `uzgun` kızgın, `dusunceli` sıkılmış görünüyor.
     - Emir: `yorgun` sırıtma gibi görünüyor.
   - CLAUDE.md'ye göre "karakterler itici olmamalı".
   - **Düzeltme:** `rig/Character.tsx` → `Eye`. Genç karakterlerde (`yaş < 35`) göz altı çizgisi kapalı olsun. Varsayılan göz açıklığı 1,0'a çekilsin. `yorgun` yalnız ağırlık versin, ağız eğrisini yukarı çevirmesin (parça 2, 0-6 sn Emir'in ağzı gülümsüyor).
5. **Parça 1, 18,0-19,4 ve 35,5-37,0: resepsiyon geniş planı.**
   - Ahize çeneye dayalı bir çubuk; mikrofon gibi görünüyor.
   - Resepsiyonist haber verilirken gülümsüyor.
   - Duvardaki TV'de spikerin yüzü yok (yumurta kafa). Bant pembe-mor; eklemede kırmızı (#c8102e).
   - **Düzeltme:**
     - `gesture: "telefon"` ahizeyi kulak ve ağız arasına koysun (`gestures.ts`).
     - Resepsiyonistin `emotion` değeri `notr` → `endiseli`.
     - Duvar TV'sinde eklemenin küçültülmüş hâli kullanılsın (`sets/emir2.tsx` → `zenith_merkez`, aynı `TvSonDakika` bileşeni ölçekli). Bant rengi #c8102e olsun.
6. **Parça 1, 17,9: mekân kimliği yok.** Kulübeden İstanbul'a sert kesme var; "İSTANBUL" ya da "Zenith Grup Genel Merkezi" yazısı yok.
   - **Düzeltme:** Sahne `b`'nin ilk `action` vuruşuna küçük konum yazısı ekle (`yazi` türü ya da `title` alt yazısı, 1,6 sn). Köprü silüeti camdan daha belirgin olsun (opaklık 0,35 → 0,6).
7. **Parça 2, 0-5,0: yemek yoktan var oluyor.**
   - Kadın kapıdan elinde yalnızca küçük bir fincanla giriyor ve 1,2 sn'de odayı koşar adım geçiyor.
   - Ardından muz yaprağında balık, papaya ve muz tepsisi görünüyor; bu tepsi hiç taşınmadı.
   - Hindistan cevizi kabuğu kahverengi çerçeveli yuvarlak bir ayna ya da lombar gibi görünüyor.
   - **Düzeltme:**
     - `cast.yerli_kadin.prop: "yemek_yaprak"` (YENİ prop: yaprak tepsi + hindistan cevizi) ile girsin.
     - Yürüme hızı yavaşlasın: `dur` 2,4 → 3,2.
     - `Inserts7.tsx` → `YemekUst`: kabuğun dışına lif dokusu ve düzensiz kenar çiz; içteki su düz mavi değil, süt beyazı ve yarı saydam olsun.
8. **Parça 2, 5,4-7,0: "yudum" jesti.**
   - El ağza değmiş, kadın gülümsüyor: kıkırdayan ya da cilveli bir poz olarak okunuyor.
   - Diğer kolda dirsek ters kırılmış gibi duruyor.
   - Lokma hiç görünmüyor.
   - **Düzeltme:** `gesture: "yudum"` için `prop: "balik_lokma"` (elde küçük parça) ver; `emotion: "notr"` olsun. `gestures.ts`'te serbest kolun dirsek açısını 30°'nin altına indir.
9. **Parça 2, 14,0-19,4: `iki` çekimi 5,4 sn tek kare.**
   - Kadın yumrukları sarkık, kıpırtısız; tepki jesti yok.
   - **Düzeltme:** `shots` ile ortadan böl. "anlaşmayı yapmak için" sırasında kadın yakın planı gelsin (`uzgun`, başını iki yana sallar: yeni `tik: "hayir"`). "gitmem gerekiyor"da iki çekime dönülsün ve kadın elini kaldırmaya başlasın (P0-9'a geçiş).
10. **Parça 2, 25,0-28,0 ve 42,0-44,6: köy meydanı geniş planı.**
    - Dört kişi önden, kollar sarkık, sıra hâlinde dizilmiş.
    - `yerli_genc` öndeki gencin arkasında kalıyor; yüzünün yarısı kapalı.
    - `yerli_ana` yaşlıya değil sağa, kadraj dışına bakıyor.
    - Enkaz eşyaları (valiz, can yeleği, çanta) küçük ve gencin bacaklarının arkasında. Can yeleği sarı bir dosya gibi görünüyor.
    - **Düzeltme:**
      - `isaretler`: `y1` x 250 → 330, `y2` x 130 → 90, y 1500 → 1440. Çakışma biter.
      - `cast` içine `turn` ver; yüzler yaşlıya dönük olsun.
      - `yerli_ana.lookAt: "yerli_bilge"` görünmüyor: `bak.x` değerini -0,6 olarak elle ver.
      - Enkaz yığını (`sets/emir2.tsx` → `koy_meydani`) ön plana ve sağ alta taşınsın, 1,4 kat büyütülsün. Can yeleğine boyun açıklığı ve kayış çizilsin.
11. **Ateşin ölçeği tutarsız.**
    - Geniş planda küçük bir kamp ateşi var (diz boyu). Yanma eklemesinde kadrajı kaplayan alev duvarı var.
    - Kapanış geniş planında kâğıt ya da kül izi yok.
    - **Düzeltme:**
      - `Sozlesme` `ates` fazında taş halkayı ve odunları geniş plandakiyle aynı çiz; alev yüksekliği kadrajın ≤%35'i olsun.
      - Kapanış geniş planına (`sets/emir2.tsx`) ateşin içinde kararmış kâğıt parçası ve yükselen kıvılcım yoğunluğu ekle.
12. **Parça 2, 28,0-30,5 ve 33,0-35,1: iki sözleşme eklemesi aynı kadrajda.** Aralarındaki 1,8 sn'lik orta plan tekrar hissini kırmıyor.
    - El dört sosis parmak kâğıdın ÖNÜNDE; başparmak yok.
    - **Düzeltme:**
      - `burus` fazına farklı kadraj ver: daha yakın, kâğıt 1,4 kat ve 8° dönük.
      - `Sozlesme` elinde başparmak önde, dört parmak kâğıdın arkasında olsun; sadece parmak uçları görünsün.
13. **Parça 2, 7,0-13,5: kadraj kenarlarında kesik uzuvlar.** Sol üst köşede kadının kesik bacağı ve havada duran yumruğu (x 0-250, y 0-170) dikkati dağıtıyor.
    - **Düzeltme:** Bu vuruşlarda kadın `mark` x 150 → 60 (kadraj dışı) ya da `kadraj.cx` +80.
14. **Parça 1, 3,0-6,6: geniş plan kompozisyonu.** Üst %35 boş saz tavan, Emir y 1300-1560'ta çok küçük ve tam altyazı bandında. Düzeltme P0-3'teki `kadraj` ile gelir.

---

## P2: iyileştirme

1. **Ön plandaki ateş konisi:** Parça 1, 6,8-7,2 ve 14,0-15,4; parça 2, 7,0-8,0 ve 23,5-24,6. Turuncu üçgen kadraj kenarında yarım kalıyor ve gözü çekiyor. `kadraj.cx` ile dışarı al ya da `sets` → `kulube` ateşini x 120'den x 60'a taşı.
2. **Kulübe ışığı:** Her iki parçada da aynı düz kahverengi ışık var. Yüzlerde anahtar ışık ayrımı yok; ışık şeritleri yalnızca duvarda. Planlanan fg ışık şeridi (karakterin üstüne düşen) uygulanmamış. Parça 2 için hafif öğleden sonraya kayan, daha sıcak ve alçak açılı bir ışık seç (`look: "sicak"`, `time: "aksam"`'a yakın), parçalar ayrışsın.
3. **Parça 2, 2,4-5,4, yemek eklemesi:** Lokmayı alan el kahverengi bir topak, parmaklar ayrışmıyor. `YemekUst` elinde başparmak ve işaret parmağıyla tutuş çiz.
4. **Parça 1, 25,5-30,5, harita:** "HİNT OKYANUSU" etiketi bir adanın üstüne düşmüş. Etiketi denize taşı (`TvSonDakika`, y +40).
5. **Alevler:** Parça 2, 36,6-42,0. Düz zikzak taç biçiminde. Katmanlı, uçları dalgalanan dil biçimli alev kullan (`Sozlesme` → alev path'lerine `Math.sin(frame)` dalga).
6. **Yaşlı kadın kadraj sağ kenarında yarım:** Parça 2, 25-28, 31-36, 42-44. `ya` x 1010 → 930.
7. **Parça 2, 42,0-44,6, kapanış:** Kıpırtısız sıra hâlinde 2,6 sn. Gençlerden biri yaşlıya döner ve yaşlı ateşe bakar (`lookAt`). `uzaklas` neredeyse fark edilmiyor; z farkını artır.
8. **Parça 2, 23,5-24,6, `angle: "ust"`:** Yukarıdan çekim hissi vermiyor, düz yakın plan gibi. `kadraj.cy` −150 ve z +0,2 ile başı alt üçte bire al; "çaresizlik" okunsun.
9. **Parça 1, 0-3, POV arka planı:** Zikzak duvar desenli. Kadının arkasında tavan kirişleri ve çatı aralığından ışık görünürse "yatarak yukarı bakıyorum" hissi güçlenir.

---

## Özet: hikâye anlaşılırlığı

**Parça 1'de izleyicinin gördüğü:**
1. Bulanık bir kadın elinde yaprak tutuyor.
2. Kesme: adam yatıyor, kadın kapıda, yazı adamın yüzünde.
3. Adam 3 sn hiç kıpırdamadan bakıyor.
4. Bir saat ve camı silen parmak.
5. Adam "Emir." diyor, kadın kapıda "Emir?" diyor.
6. 11 sn donuk TV.
7. Kadın resepsiyonist.

**Okunmayanlar:**
- Kullanıcının 4 eyleminden ikisi okunmuyor: yaprağı alna koyma ve doğrulup geri düşme.
- İkisi zayıf: saat ve isim (aradaki mesafe yüzünden).
- Bu yüzden kullanıcının "ne oluyor anlaşılmıyor" tespiti doğru.

**Öncelik sırası:**
1. P0-2: kadını Emir'in baş ucuna al.
2. P0-1: POV'u düzelt.
3. P0-4 ve P0-5: doğrulma.
4. P0-3: altyazı.
5. P0-6 ve P0-7: TV bölümünü kesmelerle canlandır.
6. Parça 2: P0-8, P0-9, P0-10.

Her düzeltmeden sonra aynı saniyelerden yeniden kare alınmalı.
