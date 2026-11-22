# 7/24 · Bölüm 4: senarist yardımcısı incelemesi (22 Kasım 2026)

Kullanıcının metnine dokunulmadı. Aşağıdakilerin hepsi öneridir; uygulanması kullanıcı onayına bağlıdır. Dayanak: `docs/arastirma.md` §1b (mikro kanca, bölüm sonu), §2b (cliffhanger türleri, "çözümden bir vuruş önce kes"), §3a (değer değişimi, setup/payoff, Hitchcock).

## Genel değerlendirme
Bölüm çok sağlam bir iskelet: korku → komik boşalma → korku → komik boşalma → donma şeklinde düzenli bir sarkaç var ve final, dizinin büyük sorusuna ("Sabri Abi ne saklıyor?") doğrudan bağlanıyor. Asıl risk mantıkta değil, belirsizliğin dozunda: izleyici "taklit mi, gerçek mi?" diye düşünürken bir ipucu yakalamazsa final "Sabri sabah geldi" diye düz okunabilir. Metin şu hâliyle ~30-35 sn tutar.

## Öncelikli 3 öneri
1. **Sabri'nin kim olduğuna (yazar odası sırrı olarak) şimdi karar verin, ekranda tek bir ipucu bırakın.**
   - Sorun: Üç okuma da mümkün. (A) Depodaki şey artık yalnız ses değil, beden de taklit ediyor. (B) Gerçek Sabri sabah 06.00'da vardiyayı devralmaya arka kapıdan gelmiş. (C) Gerçek Sabri, ama depodakiyle bir bağı var.
   - Öneri: C'yi öneririm (A'yı da destekleyecek şekilde çekilebilir). Dev adamın "Depodakine selam söyle" cümlesinden hemen sonra Sabri'nin depodan çıkması zaten "Sabri = depodaki mi?" sorusunu soruyor. Bunu kesin cevaplamayın, ama aşağıdaki finale ayrıntılarından **yalnız birini** koyun.
   - Neden: Belirsizlik, izleyicinin elinde bir ipucu olduğunda merak yaratır (Loewenstein: boşluk kapatılabilir görünmeli). İpucu olmazsa yalnızca kafa karışıklığı olur.
2. **"sıçarım işinedeee marketinedeee" ile depo kapısının açılması arasındaki bağı kural 3'e bağlayın.**
   - Sorun: Kapı tam Ece markete söverken açılıyor. Bu çok iyi bir rastlantı ama şu an yalnızca zamanlama gibi duruyor.
   - Öneri: "ece" sesi geldiği anda, yarım saniyelik bir ekleme: kasanın arkasındaki kural kâğıdında **3. kural** ("Asla kimseye saygısızlık yapma!") vurgulanır. Ya da hiç göstermeyin, izleyiciye bırakın. Bu bir karar noktası (aşağıda soru 2).
   - Neden: Dizinin motoru "her bölüm bir kuralı sınar" (bible). 1. kural (B1-B2), 2. kural (B2-B3), 4. kural (B2 P3) sınandı. 3. kural ilk kez burada çiğneniyor. Komik bir küfrün bedelinin korku olması, "korkarken güldüren" tonun tam kendisi.
   - Risk: Küfrün kendisi kuralı bozuyor gibi okunursa Ece'nin sevilen ağzı "tehlikeli" olur. Bunu önlemek için saygısızlığın hedefi "market/iş" olmalı (metindeki gibi), genel küfür değil. B2-B3'teki küfürleri hiçbir şey cezalandırmadı; bu ayrım zaten tutarlı.
3. **Finali "çözümden bir vuruş önce" kesin, ama Sabri'yi 1,5-2 sn gösterin.**
   - Sorun: Baş yavaş dönüyor → Sabri görünüyor. Kesme çok erkense izleyici kimi gördüğünü kaydetmez. Çok geçse Sabri bir şey yapmak zorunda kalır ve gerilim düşer.
   - Öneri: Ece'nin gözünden (ya da omzunun üstünden) Sabri'yi orta çekimde gösterin. Sabri kıpırdamadan durur, tek tuhaf ayrıntı fark edilir. Siyah. Bitiş kartı: "Bu gerçekten Sabri mi?" ya da "Sen dönüp bakar mıydın?"
   - Neden: §2b "çözümden bir vuruş önce kes". Bitiş kartı sorusu yorum tetikler (§1b).

## Süreklilik ve mantık
4. **"evdeyim" repliği resmî zaman çizelgesinde yok.** Bu replik yalnızca eski "Kural 1" taslağında (`724-01.json`) ve reddedilen 2. bölümde (`724-b2.json`) geçiyor. Kullanıcının 2. bölüm 3. parçasındaki telefon konuşmasında Sabri nerede olduğunu söylemiyor (`724-02-p3.json`). Yani doğrudan bir çelişki yok. Neden önemli: Bu sayede (B) okuması da açık kalıyor. "Evdeyim" sonradan bir bölüme eklenirse finalin anlamı değişir. Bu bilinçli olarak yapılmalı.
5. **Sabri depoya nasıl girdi?** Kepenkler 06.00'da açıldı, Ece kasada ve kapıya bakıyor. Sabri ön kapıdan geçmedi. Mekân yerleşiminde (bible) deponun arka kapısı yok. Öneri: Ya ileride deponun sokağa açılan bir servis kapısını gösterin (B okuması), ya da bilinçli olarak cevapsız bırakın (A/C). Neden: İzleyici bunu yorumlarda soracaktır. Cevap vermek de vermemek de olur, ama bilinçli bir seçim olmalı.
6. **Kalın "ece" sesi ile Sabri'nin sesi arasındaki bağ.** Öneri: "ece" sesini, Sabri'nin kayıtlı sesinin perdesi düşürülüp yavaşlatılmış hâliyle yapın (ses yönetmeni; kredi gerekmez, mevcut kayıt kullanılır). İlk izlemede "canavar sesi" gibi duyulur, ikinci izlemede Sabri'nin tınısı fark edilir. Neden: B2 P3'teki kız sesi de "yavaşlatılmış, boğuk" bir taklitti. Aynı ses imzası, depodaki şeyin dilini tutarlı kılar ve tekrar izleme (spike) yaratır.
7. **B1'de kurulan, ödenmemiş bir döngü.** İş görüşmesinde Ece "bu saatte burada olmam söylenmişti" diyor ve Sabri'nin yüzü düşüyor. Bunu Ece'ye kim söyledi? Dev adamın "Bu gece seni seçmiş" cümlesi ve Sabri'nin depodan çıkması, bu döngüye bağlanmaya çok uygun. Bu bölümde bir şey eklemeye gerek yok. Bir sonraki bölümler için `ipuclari.md` defterine yazılmasını öneririm.
8. **Saat ve ışık.** Saat 06.0x, kasım sonunda İstanbul'da güneş ~07.15 civarında doğar. Dışarısı hâlâ karanlık ama lacivert-mor bir şafak tonu olabilir. Öneri: Kapı camından görünen gökyüzü gece siyahından koyu laciverde dönmüş olsun. Neden: "Sabah oldu, kurtuldum" umudunu görsel olarak kurar. Final o umudu yıkar (değer: güvenlik + → −).
9. **Dev adamın çıkışı.** Metin fısıltıyla açılıyor ama adamın gidişi yazılmamış. Öneri: Fısıltıdan sonra adam döner, kapı "ding-dong"la açılıp kapanır, adam yağmurda kaybolur, sonra kamera Ece'ye döner. Neden: Ece'nin yalnız kaldığı kurulmadan yutkunma ve önlük atma çalışmaz. İzleyici "adam hâlâ içeride mi?" diye takılır.

## Kanca ve final
10. **Açılış (fısıltı) yeni bir açıdan çekilsin.** Sorun: B3'ü izleyenler bu anı bir dakika önce gördü. Aynı kare tekrar edilirse ilk 3 sn "zaten gördüm" etkisi yaratır. Öneri: Fısıltı aynı kalsın ama çekim Ece'nin yüzünde olsun (adam kadrajın kenarında, bulanık). İlk karede yeni bilgi Ece'nin tepkisi olur. Neden: İlk karenin işi "neden izlemeliyim" sorusunu cevaplamak (§1b). Yeni izleyici için de bağlam kurar.
11. **"Nereye gidiyosun kızım." neden iyi:** Bir çağrı değil, bir sorgu. Kural 2 "çağırırsa gitme" diyor. Sabri onu çağırmıyor, tutuyor. Bu, bir sonraki bölümde Ece'yi gerçek bir ikilemin içine sokuyor: Ona yaklaşırsa kuralı mı çiğnemiş olur? Final merak bırakıyor. Önerilen tek ayrıntıyla daha da güçlenir.
12. **Finale tek bir tuhaf ayrıntı** (yalnız birini seçin, üst üste koymayın):
    - **(a) Elinde çikolata ambalajı:** Sabri'nin parmaklarında B2'deki kızın aldığı çikolatanın ambalajı. Neden: Ölü kızı, depodaki sesi ve Sabri'yi tek nesneyle bağlar. En güçlü seçenek bu. Gereken varlık: çikolata/ambalaj eşyası (B2'den varsa yeniden kullanılır).
    - **(b) Arkasındaki depo kapısı kendiliğinden kapanır:** Sabri dışarıda, kapı arkasından yavaşça kapanıyor. Neden: "Depoda başka biri daha var" okumasını açar (C okuması). Ucuz: kapı ve gıcırtı efekti zaten var.
    - **(c) Kasket yok ya da kuru:** Sabri her zaman kasketli. Dışarısı yağmurlu ama Sabri kupkuru. Neden: İnce bir "dışarıdan gelmedi" ipucu. Telefonda zor fark edilebilir, bu yüzden (a) ya da (b) kadar güçlü değil.
    - **(d) Ses katmanı:** "Nereye gidiyosun kızım" repliğinin altında, çok kısık, kalın "ece" sesinin bir yankısı. Neden: Ses ile beden arasındaki bağı belirsiz ama hissedilir kılar. Kredi gerekmez.
13. **Önlük için kurulum ve ödeme.** Ece B2 P1'de önlüğü "ilk iş günü modumuz yukarııı" diyerek giymişti. Burada buruşturup yere atıyor. Bu ayna zaten çok iyi. Öneri: Atılan önlük finalde kadrajda yerde dursun. Neden: Bir sonraki bölümde ödenebilecek görsel bir kurulum olur (önlüğü kim alacak?). Metne ek bir şey gerektirmez.

## Ritim (zaman tahminiyle, ~32 sn)
| Zaman | Vuruş | Ton |
|---|---|---|
| 0-3 sn | Fısıltı | Korku |
| 3-6 sn | (Öneri 9: adamın çıkışı) | Gerilim düşer |
| 6-8 sn | Yutkunma | Korku |
| 8-13 sn | Önlük + "sıçarım işinedeee" | Komik boşalma |
| 13-15 sn | Kapı + "ece" | Korku (zirve) |
| 15-18 sn | Bembeyaz gözler, bebekler döner | Korku (tutulan an) |
| 18-23 sn | "vallahi bastım…" + takılma + "kaç ×4" | Komik |
| 23-25 sn | "Nereye gidiyosun kızım." | Korku |
| 25-30 sn | Donma, baş dönüşü, Sabri | Dehşet |

14. **"ece" sesi "dee"yi kesmeli.** Uzayan "marketinedeee"nin son "e"si bitmeden kapı açılsın. Neden: Kahkahanın ortasında kesilen ses, korku-komedi geçişinin en etkili yolu. Ece'nin öfkesi yarıda kalır, izleyici de onunla birlikte irkilir.
15. **Gözler ile meme arasında 1,5-2 sn sessizlik.** Sorun: Bembeyaz gözlerden doğrudan "vallahi bastım"a geçmek dehşeti çok çabuk harcar. Öneri: Floresan ve buzdolabı uğultusu bu an için kesilsin (ses boşluğu), bebekler depoya dönsün, sonra meme gelsin. Neden: Komik boşalma, ancak önce gerilim tam dolarsa güldürür. Bu dizinin formülü bu.
16. **"kaç ×4" ile adımlar aynı ritimde olsun.** Kasa sağ önde, kapı sol duvarda. Mesafe dört "kaç" için kısa kalabilir. Öneri: Takılma kasanın köşesinde olsun, ardından dört adım, son "kaç"ta kapının önü. Bu, görüntü yönetmeniyle konuşulacak. Neden: Kullanıcının metninde son "kaç" ile varış aynı an. Kayarsa espri kaybolur.
17. **Ölü an riski: baş dönüşü.** "Yavaş yavaş" en fazla ~2 sn olmalı. Altında yalnızca nefes ve kalp atışı efekti. Neden: 30 sn'lik bir bölümde 3 sn'lik hareketsizlik, izleyicinin kaydırdığı "dip" noktasına dönüşebilir (§1a).
18. **Aceleye gelme riski: yutkunma.** Yutkunma tek başına 1,5-2 sn sürmeli (boğaz hareketi + ses). Metinde tek bir eylem ama B3 şartnamesindeki "oldu bittiye getirme" eleştirisi tam da bu tür anlar içindi.

## Ece'nin tepkileri (gerçekçilik ve sempati)
19. **Gerçekçi olanlar:** Yutkunma (korkunun fizyolojisi), önce öfke sonra kaçma (stres altında "savaş"tan "kaç"a geçiş), tanıdık sese donup kalma (refleks: umut ile dehşet aynı anda). Hepsi sahici. B3 şartnamesindeki "korkuyla tutarlı tepki" ilkesine uyuyor.
20. **"Bembeyaz gözler" netleştirilmeli.** "Gözler bembeyaz olur" iki türlü okunabilir: (a) komik bir şok stilizasyonu (göz akı büyür, bebekler küçülür), (b) gerçek bir ele geçirilme belirtisi (bebek tamamen kaybolur). (b) okunursa izleyici "Ece de mi ele geçirildi?" diye yanlış bir soruya kapılır. Öneri: Faltaşı gibi açılmış gözler, bebekler küçük ama görünür olsun ve yavaşça depoya kaysın. Bu, aşağıdaki soru 1.
21. **"vallahi bastım" memesi.** Orijinal meme kaydı kullanılmamalı. Ece'nin kendi sesiyle yeniden seslendirilmeli (telif ve "her şey ücretsiz" kuralı). Ritmi memeye benzeyebilir, ses ve kayıt bizim olmalı.

## Uzunluk: onaylanırsa eklenebilecek doğaçlamalar (az ve seçici)
Metin ~30-35 sn. Aşağıdakilerin hepsi eklenirse ~45-50 sn olur. 60-90 sn'ye zorlamak için daha fazla ekleme yapmak, bu bölümün sıkı ritmini bozar. Önerim 45-55 sn. Seçenekler (her biri ayrı onay ister):
22. **Saate bakış (yutkunmadan sonra, ~3 sn, replik yok ya da tek kelime):** Ece kapının üstündeki saate bakar, 06.03. Camdan şafak görünür. Bu, önlüğü neden şimdi attığını gösterir: "bitti, gidiyorum". İsteğe bağlı tek örnek: "Altı… altı oldu lan." Neden: Önlük atmanın nedeni görünür olur. Sahte bir güvenlik (+) kurulur, final bunu (−) yıkar.
23. **Önlüğün takılması (fiziksel komedi, ~3 sn):** Önlük başından çıkarken at kuyruğuna takılır. Ece çekiştirir, söylenir. İsteğe bağlı tek örnek: "Çık… çık lan üstümden!" Sonra buruşturur, kullanıcının repliği gelir. Neden: Giyme animasyonunun (B2 P1) aynası olur, öfkeyi büyütür. B2'de "giyme animasyonu güzel olmalı" denmişti, bunun karşılığı.
24. **Kısa anı flaşları (önlüğü buruştururken, toplam ~2 sn):** Dört karelik yarım saniyelik geri dönüşler: sarı saçlı kız, depo kapısından görünen parmaklar, kopan el, dev adamın gülümsemesi. Replik yok, var olan render'lardan alınır. Neden: Travma tepkisi olarak gerçekçi. Yeni izleyici için 2 sn'de "önceki bölümlerde" işlevi görür. Öfkeyi haklı çıkarır.
25. **Telefonu kapma (kaçarken, ~1 sn):** Ece koşmaya başlarken tezgâhtaki telefonu kapar. Replik yok. Neden: Gerçek bir insan telefonunu bırakmaz. Bir sonraki bölümde telefonun kullanılmasına da zemin hazırlar.

## Alternatif kancalar (açılış, ilk 3 sn)
- **A (öneri):** Fısıltı aynı, ama kamera Ece'nin yüzünde. Adam kadrajın kenarında bulanık.
- **B:** Yakın çekim: adamın eli parayı kasaya bırakıyor, fısıltı üstüne geliyor, sonra Ece'nin yüzü.
- **C:** Siyah ekranda yalnız fısıltı ("…seni seçmiş"), ilk görüntü Ece'nin yutkunması. Risk: İlk kare siyah (§1c bunu önermez). En zayıf seçenek bu.

## Alternatif finaller (cliffhanger, kullanıcının finali korunarak)
- **A:** Sabri'nin elinde çikolata ambalajı. Kamera Ece'nin gözünden ambalaja iner. Siyah. (Bağlayıcı, belirsizliği korur.)
- **B:** Sabri durur, arkasında depo kapısı kendiliğinden kapanır. Siyah. (Depoda başka biri var.)
- **C:** Sabri görünür görünmez kepenkler yeniden iner (kural 4). Ece çıkış kapısının önünde, Sabri ile içeride kilitli kalır. Siyah. (En yüksek gerilim. Ancak bölüme yeni bir olay ekler, kullanıcı kararı gerekir.)
- Elenen: "Sabri arıyor" telefon numarası. Çok net bir kanca ama bu numara B2 P3'te kullanıldı ve belirsizliği tek seferde "taklit" olarak çözer.

## Kullanıcıya sorular
1. Gözler: komik şok mu (bebekler küçük ama görünür), yoksa gerçek bembeyaz mı (bebek kaybolur, sonra geri gelir)?
2. Depo kapısının açılmasını 3. kurala (saygısızlık) bağlayalım mı? Kural kâğıdı ekranda gösterilsin mi, yoksa izleyiciye mi bırakılsın?
3. Sabri'nin gerçeği (yazar odası için): A taklit, B gerçek Sabri, C gerçek ama bağlantılı. Hangisi?
4. Finalde tek ayrıntı: (a) ambalaj, (b) kendiliğinden kapanan kapı, (c) kasket/kuruluk, (d) ses katmanı, ya da hiçbiri?
5. Uzunluk: ~35 sn olduğu gibi mi, yoksa 22-25. maddelerden hangileri eklensin?
