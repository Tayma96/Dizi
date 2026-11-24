# Kırmızı Düğme · B1 · Parça 2: Dörtlü uyanış (çekim stratejisi)

> 23 Kasım 2026, görüntü yönetmeni. Görsel ve işitsel tasarım; replik yok. Konuşma gerekirse kullanıcı yazar (`[Replik: kullanıcı]`). Hedef süre 55-65 sn.

**Sahnenin amacı (tek cümle):** Birbirini tanımayan dört kişi kapısız, dikişsiz, bembeyaz bir odada uyanır, birbirini ve odadaki tek kırmızı düğmeyi fark eder.

## 0. GÜNCEL AÇILIŞ: kullanıcının metni (24 Kasım 2026) → çekim dökümü
> Bu bölüm aşağıdaki çekim listesinin 2.1-2.5 çekimlerinin yerini alır. Metin kullanıcıya aittir; buradaki yalnız kamera, ışık ve ses tasarımıdır.

| # | Süre | Kaynak / ölçek / açı | Kamera | Görüntü | Ses |
|---|---|---|---|---|---|
| A1 | 0,0-3,0 | **CANLI KAMERA KAYDI**: tavan köşesinden genel, hafif balıkgözü | Kıpırtısız; kayıt görüntüsü 15 fps'te takılır | "Bam" diye açılır: başlık kartının siyahından dijital bir parazitle. Bembeyaz oda, ortada kaide ve tek düğme, yerde baygın dört kişi. Ekranda kayıt arayüzü: kırmızı nokta, tarih ve saat, kamera numarası; görüntü soluk, sıkıştırılmış, hafif tarama çizgili | Göbekli adamın horlaması **odada yankılanır**; kamera mikrofonundan, cızırtılı ve ince |
| A2 | 3,0-4,5 | **Geçiş: canlı kayıttan iç kameraya** | Kayıt görüntüsü parazitle kırılır → sinema görüntüsüne açılır | Aynı oda, şimdi renkli, net ve yumuşak; orta-genel, göz hizasına yakın, güneyden | Horlama birden dolgunlaşır, yankısı odayı sarar |
| A3 | 4,5-8,5 | **Göbekliye yakın kadraj**: orta-yakın, yer hizası, kilitli | Sabit | Sırtüstü horluyor; uykusunda göbeğini kaşıyor, atletinden kırıntılar dökülüyor | Horlama (yakın, dolgun), kaşınma |
| A4 | 8,5-11,5 | **Kamera kıza geçer**: horlamanın sesine motive, yavaş yatay kayma | Göbekliden kıza kayan çevrinme | Influencer yakın; gözleri kapalı, sesten rahatsız, göz kapaklarını sıkıyor, kaşlarını çatıyor | Horlama arkada, biraz uzak |
| A5 | 11,5-14,5 | **Kurye**: orta-yakın, yan profil, yer hizası | Çok hafif itme | Uykusunda sayıklıyor, kaşları çatık: **"vurun şu ayıyı lan artık"** (Adanalı keko, fısıltılı ve öfkeli) | Fısıltı + horlama |
| A6 | 14,5-16,0 | **Influencer yakın** | Sabit → çığlıkla sarsıntı | Kuryenin sesiyle gözleri açılır; çığlık **"Aaaa"**, ardından **"nerdeyim beeen"** | Çığlık odada yankılanır |
| A7 | 16,0-17,5 | **Genel, güneyden** | Kısa sarsıntı | Herkes sesten korkup uyanır, afallar: kurye fırlar, teyze ve göbekli adam irkilir | Çığlığın yankısı söner |
| A8 | 17,5-18,5 | **Kurye**: orta | Elde | **"Noluyo lan"** | — |
| A9 | 18,5-22,5 | **Göbekli adam**: orta, alçak açı, kilitli | Sabit | Kalkmaya çalışır; göbekten doğrulamaz, tekrar yatar, panik hâlinde (kolları çırpınır, nefes nefese) | Panik soluklar, zemine düşüş |

**Işık:** Canlı kayıtta düz, soluk, hafif yeşilimsi, "güvenlik kamerası" ışığı. İç kamerada kaynağı görünmeyen soğuk beyaz; gölgesiz, kırmızıyı yalnız düğme taşır.

**Ses:** Bu parçada oda **yankılı** (kullanıcı kararı); horlama ve çığlık duvarlardan geri döner. Canlı kayıt sesi ince, cızırtılı ve tek kanal; iç kamerada tam ve dolgun.

**Teyze:** A7'de herkesle **aynı anda** irkilir (kullanıcı kararı, 24 Kasım 2026; gecikme önerisi iptal).

**A1 (kullanıcı kararı):** **güvenlik kamerası** kaydı: REC + kırmızı nokta, tarih-saat, kamera no ("KAM 04"); CANLI rozeti ve izleyici sayısı YOK. Sağ alt köşede etiketsiz, yavaşça artan küçük bir sayı (ileride izleyici sayısı olduğu anlaşılacak). Teyze A1'de bayılmış değil, düzgün ve uyuyor gibi yatar (yan yatmış, çantasına sarılı, gözlüğü yerinde).

**Üretim (görüntü yönetmeni, 24 Kasım 2026):** `KDP2Acilis` (`dizi-studio/src/studio/kd/P2Acilis.tsx`), çıktı `ornekler/kd-b1-p2-acilis.mp4` (sessiz), kontrol `ornekler/kd-b1-p2-acilis-kareler.png`. Baş yönleri: göbekli baş batıda (sırtüstü), teyze baş batıda ve yüzü güneye (yan yatmış), influencer baş kuzeyde (sırtüstü), kurye baş doğuda. Güncel yerleşim ve zamanlar aşağıdaki düzeltme turunda (eski: A7 480, son 680).
- **Düzeltme turu (kullanıcı: "Düzelt hepsini"):** kızın gözleri gerçekçi orana indirildi (stil 1 ailesi, büyük anime göz yok; makyaj, toka, halka, dağılmış rimel duruyor). A3 ve A9 çapraz kadraj (eğik kamera; baş üst köşede, beden kadrajı çapraz keser). Dördü kaideye yaklaştırıldı (batı/doğu ve 180° ekseni aynı): göbekli (-1,2; 3,3), teyze (-1,15; 5,5), influencer (1,1; 2,9), kurye (1,25; 5,3); A2 ve A7 genel planlar güneybatıdan çapraz bakar (eksenin güney tarafı korunur; yatan bedenler kısalır, grup dikey kadraja yayılır): karakterler ilk sürüme göre belirgin büyük, dördü ve kaide aynı karede. Kurye A7'de yatma → dirseklenip doğrulma → oturma (510-518) → çömelme (519). ElevenLabs seslerine göre yeniden zamanlama: A6 435-506, A7 507-551, A8 552-602, A9 603-727, toplam 728 kare (24,27 sn). Ses başlangıç kareleri: horlama 0 ve 180 (A1-A4; ikinci kopya 345'te kesilir), acilis_01 351, acilis_02 441, acilis_03 555, acilis_04 603. Ağız ve horlama nefesi ses zarfına bağlı (`kd/p2Ses.ts`).

## 0b. PARÇA 2 DEVAMI (C1-C7): kullanıcının metni → tekli çekimler (görüntü yönetmeni, 24 Kasım 2026)
> Metin kullanıcıya aittir (`bolumler.md` sonu). **Kalıcı kural:** grup/toplu çekim yok; her karakter tek kişilik kamerayla. Bakışlar 180° eksenine göre: göbekli ve teyze (batı) sağa, kurye ve kız (doğu) sola bakar. Tekli çekimde kadrajda yalnız o karakter çizilir.
> Kompozisyon `KDP2Devam` (`dizi-studio/src/studio/kd/P2Devam.tsx`), çıktı `ornekler/kd-b1-p2b.mp4` (sessiz, 680 kare, 22,7 sn), kontrol `ornekler/kd-b1-p2b-kareler.png`.

| # | Kareler | Ölçek / açı | Kamera | Görüntü | Ses (başlangıç karesi) |
|---|---|---|---|---|---|
| C1 | 0-74 | **Kız**, orta (dizden yukarı), göz hizası, güneybatıdan | Elde, onu izleyen yumuşak kaydırma | Kadrajın altından doğrulup kalkar (hareket bulanıklığı), elleri önde avuçlar dışa, 2-3 adım geri (doğuya) çekilir; korkulu, sola bakar | — |
| C2 | 75-149 | **Teyze**, tek kişilik genel (tam boy), göz hizası | Kusursuz sabit, ortalı | Çömelmişken doğrulur (ezilme → gerilme), çantasını göğsüne bastırır, 2-3 adım geri (batıya); sakin ama temkinli, gözleri sağa | — |
| C3 | 150-224 | **Göbekli**, orta, alçak açı | Kilitli | Ayağa kalkmaz: ellerine yaslanıp oturarak kalçasıyla 3 kez geri (batıya) sürünür; terli, nefes nefese, sağa bakar | — |
| C4 | 225-269 | **Kurye**, orta (3/4) | Elde | Yerinde kalır; sağ eli BELİNDE (dirsek dışarı, gövde öne eğik), yüzü acıyla buruşur | — |
| C5 | 270-449 | **Kurye**, yakın | Elde, çok hafif itme | Acılı, etrafa bakınır; ikinci cümlede gözleri tavana/köşelere | `c_01.mp3` **272** (konuşma 278-443; 2. cümle ≈410) |
| C6 | 450-547 | **Kız**, yakın, **üst açı** (tavan köşesinden: görünmeyen kaçıranların gözü) | Elde; bağırırken sarsıntı | Başını kaldırıp bu kameraya bağırır, yumrukları sıkılı, ağlamaklı (ıslak göz, süzülen yaş) | `c_02.mp3` **452** (konuşma 454-541) |
| C7 | 548-679 | **Göbekli**, orta-yakın, oturan göz hizası | Kilitli | Daha dik oturur, bir eli yerde, öbür eliyle başının arkasını ovar; sersem, gözleri yarı kapalı | `c_03.mp3` **551** (konuşma 553-667) |

Ölçek ritmi: orta → genel → orta (alçak) → orta → yakın → yakın (üst) → orta-yakın. Ağız hareketi ses zarfından (`kd/p2bSes.ts`); ses dosyaları gömülmez, miks ayrı (`P2B_SES`).

## 1. Kamera stratejisi: dört katman

1. **Gözetleyen göz (tepeden, simetrik):** Parça, birinin onları yukarıdan izlediği hissiyle açılır ve kapanır. Kuşbakışı, kusursuz simetrik ve kıpırtısız bir kadraj; laboratuvardaki deney fareleri gibi. Bu, dizinin "içeriden biri" fikrini ve odanın bir deney olduğunu görsel olarak eker, tek kelime gerekmeden.
2. **Her karaktere kendi kamera dili:** İzleyici kimin kim olduğunu kameradan da okur.
   | Karakter | Kamera dili | Neden |
   |---|---|---|
   | Göbekli adam | **Kilitli, sabit, simetrik**, hafif alttan | Komedi zamanlaması sabit kamerada çalışır; alt açı göbeği ve tembelliği büyütür |
   | Kurye | **Elde, kısa çekimler, hızlı tepki**, göz hizası | Refleksli, sokak enerjisi |
   | Influencer | **Yakın, hafif titrek, sığ odak** (arka plan bulanık), hafif üstten | Panik ve kırılganlık; üst açı onu küçültür |
   | Teyze | **Kusursuz sabit, ortalanmış, fazla "temiz" kadraj**, göz hizası, uzun tutulur | Huzursuz edici sakinlik: kimse panik yaparken kadraj ona dokunmaz; izleyici bilinçsizce "bu kadın neden bu kadar rahat?" diye düşünür |
3. **Coğrafya ve 180° ekseni:**
   - **Eksen:** kaideden geçen kuzey-güney çizgisi.
   - **Uyanış yerleri:** Göbekli adam ile teyze **batı** yarıda, kurye ile influencer **doğu** yarıda uyanır.
   - **Kamera:** hep **güneyde** kalır. Bakış çizgileri tutarlı olur; batıdakiler sağa, doğudakiler sola bakar.
   - **Ekseni geçmek:** yalnız bir kez, motive edilmiş **kaideyi dolanan yarım tur** ile (karakterler kaideye yürürken).
4. **Düğmeyi saklayıp açmak:** Düğme baştan kadrajda, ama **ilk 40 saniye flu ya da kenarda** kalır. İzleyici onu karakterlerle aynı anda "fark eder": odak kayması ve yavaş itme ile sayaçtaki **001**.

## 2. Ölçek ritmi
Genel → orta → orta → yakın → genel → orta → yakın (düğme) → genel. Aynı ölçek art arda gelmez. Yakın plan yalnız üç yerde kullanılır: influencer'ın paniği, teyzenin kolonyası ve düğme.

## 3. Çekim listesi

| # | Süre | Ölçek / açı / mercek | Kamera hareketi | Görüntü ve hareket | Ses |
|---|---|---|---|---|---|
| **2.1** | 4 sn | **Genel, tam tepeden** (kuşbakışı, f≈560), simetrik | Kıpırtısız, ardından çok yavaş alçalma | Bembeyaz kare oda; ortada kaide ve tek düğme; yerde dört yönde yatan dört kişi, saat kadranı gibi | Kancanın ardından **2 sn tam sessizlik**, sonra çok kısık oda tonu |
| **2.2** | 4 sn | **Orta, yer hizası, alt açı**; göbekli adam kadrajın ortasında, simetrik (f≈800) | **Kilitli** | Göbekli adam sırtüstü horluyor; horlamanın sonunda kendi horultusuyla uyanır, uyku sersemi göbeğini kaşır, doğrulmaya çalışır (iki deneme) | Horlama, boğazı temizleme (komik kırılma) |
| **2.3** | 3 sn | **Orta, göz hizası**, doğu tarafı | **Elde**, hızlı bir ani hareket | Kurye irkilerek tek hamlede doğrulur, savunma pozisyonu alır, kablolu kulaklığını yoklar; saçında kask izi | Mont hışırtısı, kısa nefes |
| **2.4** | 4 sn | **Yakın, hafif üst açı, sığ odak** (f≈1100) | Hafif titrek | Influencer gözlerini açar, makyajı dağılmış; ilk refleksi cebini yoklamak, telefon yok; nefesi hızlanır | Hızlanan nefes, kumaş |
| **2.5** | 3 sn | **Influencer'ın bakış açısı**: bulanık → net | Odak kayması | Bulanık beyaz; üç yabancı yavaş yavaş netleşir | Kulakta hafif uğultu |
| **2.6** | 4 sn | **Orta, göz hizası, tam ortalı**, kusursuz simetri (f≈860) | **Kusursuz sabit**, uzun tutulur | Teyze oturuyor, zaten uyanık; perması bozulmamış, çantası kucağında. Sakin sakin elini kolonyalıyor | Kolonya şişesinin "fıs"ı ve onun dışında sessizlik |
| **2.7** | 2 sn | **Yakın** (ipucu): teyzenin elleri | Sabit | Kolonya avuçta; hırka düğmeleri **kırmızı mantar düğme**, bir an parlar | — |
| **2.8** | 5 sn | **Genel, 3/4 açı, güneybatıdan** (f≈620) | Yavaş yana kayma | Coğrafya: dördü ve kaide aynı karede. Göbekli adam ile teyze solda, kurye ile influencer sağda; birbirlerini süzerler | Kısık oda tonu, kumaş |
| **2.9** | 6 sn | **Orta iki-çekimler** (bakış çizgileri eksene göre) | Sabit ya da çok hafif itme | Tepki çaprazları: kurye ↔ göbekli adam, influencer ↔ teyze. Kim kime nasıl bakıyor (şüphe, korku, merak) | `[Replik: kullanıcı]` (gerekirse) |
| **2.10** | 6 sn | **Genel, kaideyi dolanan yarım tur** (eksen burada geçilir) | Yavaş dolly | Kurye ayağa kalkıp odayı dolaşır, duvarlara dokunur; kapı yok, pencere yok, dikiş yok | Adımlar (yankısız), avuç duvarda |
| **2.11** | 3 sn | **Orta, duvara paralel**, kurye profilden | Sabit | Duvarı yumruğuyla tıklatır | Tok, hiç yankısız ses (oda "ölü") |
| **2.12** | 4 sn | **Genel, yüksek açı** (köşeden, güvenlik kamerası gibi) | Kıpırtısız | Herkes ayakta, dağınık; oda fazla büyük ve fazla boş | Sessizlik |
| **2.13** | 5 sn | **Arkada kaide, önde karakterler**: düğme baştan flu | **Odak kayması**: önden kaideye, ardından yavaş itme | Göbekli adam düğmeyi ilk fark eden olur, parmağıyla gösterir; herkes döner | Alçak bir uğultu belirir |
| **2.14** | 3 sn | **Yakın, alt açı**: düğme ve **001** sayacı (f≈1150) | Çok yavaş itme | Kırmızı mantar, LED nabız gibi atıyor | Uğultu, LED'in çok kısık "tık"ı |
| **2.15** | 5 sn | **Orta, kaidenin arkasından**: dördü düğmeye bakıyor, kaide ön planda | Sabit | Kaideye doğru birer adım; biri elini uzatır, diğeri kolundan tutar | `[Replik: kullanıcı]` (gerekirse) |
| **2.16** | 3 sn | **Genel, tam tepeden** (2.1'in eşi, kapanış) | Kıpırtısız | Dördü düğmenin çevresinde; deney fareleri gibi. **Kesme** (parça sonu kancası) | Sessizlik; tek bir kalp atışı |

**Toplam:** ≈ 64 sn.

## 4. Işık
- **Beyaz oda:** Kaynağı görünmeyen, her yerden gelen soğuk beyaz (5600K+). Gölge yok, yalnız köşelerde hafif koyuluk. Karakterlerde kenar ışığı yok; dış dünyanın sıcaklığından sonra herkes "çıplak" ve savunmasız görünür.
- **Tek istisna, düğme:** Kırmızı LED'in hafif yansıması kaidenin beyazına ve yakın plan yüzlere düşer. Kırmızıyı yalnız düğme taşır.
- **Teyze çekimleri:** Işık bilerek biraz fazla düz ve kusursuz; yüzünde hiç kusur yok. Huzursuz edici.

## 5. Ses
- **Oda tonu:** Kısık (kullanıcı kuralı). Oda "ölü"; yankı yok, her ses kuru ve yakın.
- **Kullanılan sesler:** Horlama, nefesler, kumaş, adımlar, duvarın tok sesi, kolonya "fıs"ı, düğmenin uğultusu ve LED "tık"ı.
- **Kaynak:** Önce mevcut kayıtlar ve CC0 (ücretsiz), eksikler ElevenLabs'ten. Bu parçanın efekt bütçesi yaklaşık 150 kredi.
- **Müzik:** Yok. Sessizlik bu parçanın müziği.

## 6. Geçişler
- **Giriş:** Kanca başlık kartından **siyah → 2 sn sessizlik → 2.1** (tepeden beyaz, göz alır).
- **Çıkış:** 2.16'nın tepeden kıpırtısız karesi ve tek bir kalp atışı → parça sonu.

## 7. Üretim notu
- Bu parça için dört karakterin **yeni çizim dilinde ve pozlanabilir** (yatma, doğrulma, oturma, ayağa kalkma, yürüme, işaret etme) hâli gerekir.
- Mevcut yeni çizim yalnız göbekli adam için ve tek bir duruşta var. Onu eklemli bir **kuklaya** dönüştürmek gerekiyor: gövde, baş, üst kol/önkol, üst bacak/alt bacak, eller; eklem açıları ve yumuşak geçişler.
- **İlk tam kaliteli örnek:** Çekim 2.2, göbekli adamın uyanışı.
