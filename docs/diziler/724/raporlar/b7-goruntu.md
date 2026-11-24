# 7/24 · Bölüm 7 (P1 + P2 + P3): görüntü yönetmeni raporu (v3)

Tarih: 24 Kasım 2026, gece çalışması. Kaynaklar: `b7-gece-brief.md` (kontrol listesi), `b7-senarist.md` (vuruş planı), `b7-ses.md` (sesler ve efekt zamanları), genel yönetmen kararları.

## Çıktılar
| Parça | Video | Süre | Bölüm JSON | Üretici |
|---|---|---|---|---|
| P1 banyo | `bolumler/724-07-p1.mp4` | ~65,7 sn | `public/episodes/724-07-p1.json` | `tools/b7v3p1.py json` |
| P2 ayna | `bolumler/724-07-p2.mp4` | ~21,9 sn | `public/episodes/724-07-p2.json` | `tools/b7v3p2.py` |
| P3 sofra + antre + kanca | `bolumler/724-07-p3.mp4` | ~30,4 sn + 3,5 sn yorum kartı | `public/episodes/724-07-p3.json` | `tools/b7v3p3.py` |

Her video −14 LUFS'e getirildi (`volume=(-14.6-I)dB,alimiter=limit=0.89:level=false:attack=1:release=50`, aac 256k). Ölçümler aşağıda.

## Ne yaptım (kontrol listesine göre)
- **Saat ve ışık (kasım 18:00):** Bütün sahneler gece. Pencereler karanlık; karşı apartmanda birkaç ışık yanıyor. Gün batımı huzmesi kaldırıldı. Yeni ışık katmanı (`gece: true`) şöyle kuruldu:
  - Anahtar ışık: tavan lambası, sıcak havuz.
  - Gölgeler: soğuk, mor-lacivert (multiply), kadraj kenarlarına doğru koyulaşıyor.
  - Arka ve kenar ışığı: banyoda koridordan sızan sıcak ışık. Dolgu: pencereden soğuk şehir ışığı.
  - Renk: tepe sıcak, taban soğuk; üstüne vinyet. Lamba ışığında toz zerreleri dolaşıyor (ortam katmanı).
  - Beğenilen açılış (ilk 14,55 sn) çekim çekim aynı. Yalnız ışığı geceye çevrildi.
- **Kollar (V/U yok):** Kol çözümü yeniden yazıldı. El gövdeye yakınsa (göğüs, yüz, kulak, cep) dirsek her zaman aşağıda, gövdenin yanında kalıyor; üst kol önden kısaltılıyor, önkol ele gidiyor (`onKol`). Uzak hedeflerde doğal IK kullanılıyor (dirsek aşağı ya da dışa). Önceki sürümdeki şu sorunlar giderildi: annenin elini beline koyduğu U kol, göğse giden elde dirseğin yana açılması, uzun "sosis" önkol.
- **Kulak çekme:** Ece'nin yakın planı (beğenilen `kulak_cek "sol"`) korundu. İki kişilik planlarda annenin kolu soldan, omuz hizasından çapraz gelip kulağı tutuyor; dirsek omuz hizasında. Mesafe buna göre ayarlandı (anne 660, Ece 1050).
- **Boy ve mesafe:** Ece annesiyle aynı boyda (1300 / 1290).
  - Girişte "güvenli mesafe"de duruyor (anne 610, Ece 1000).
  - "hayranınım"da bir adım daha geri çekiliyor.
  - A06'da anne yarım adım yaklaşıyor.
- **Bakış:** Konuşan, muhatabına bakıyor (anne sağa, Ece sola). Tek bilinçli istisna E06 iç ses: Ece kaçamak bakıyor.
- **Dinleyenin tepkisi:** Her replikte dinleyenin bir eylemi var. Ece her bağırışta göz kırpıp geri çekiliyor. Anne "dev gibi böcek"te 0,4 sn donuyor, "ölüyodummm"da göz deviriyor, boş eline bakıyor, Ece'nin omzunun üstünden desteye bakıp kaşlarını kaldırıyor, "lan"da göz kapağı seğiriyor.
- **Mantık ve süreklilik:**
  - Ece kapının arkasından geliyor: önce koridorda gölgesi, sonra pervazı kavrayan parmaklar, sonra kapı boşluğundan içeri. Kapı boşluğuna kırpıldığı için duvarın önünde belirmiyor.
  - Destenin yolu: annenin sağ eli → Ece kapar → anne geri kapar → hırka cebi (P1 sonu, P3 başında görünür) → P3'te anne cebinden çıkarır → kancada annede.
  - Ece'nin sağ kulağı P1'deki çekmeden sonra kızarıyor, P2'de aynada görünüyor, P3'te soluyor.
  - Aynada yansıma yatayda ters. Sivilce ve kızaran kulak aynada doğru tarafta.
  - Antre: Ece kapalı kapının önüne geliyor, kolu tutuyor, kapı açılıyor, karanlık sahanlıkta otomatik ışık yanıyor, Ece çıkıyor, kapı kapanıyor.
- **Kostüm:** Evde kedili pijama (özgün baskı) ve topuz. Dışarı çıkarken `ece_sivil` (hardal kazak, at kuyruğu).
- **Kadraj:** Siyah boşluk yok. Kamera kırpılıyor ve banyo seti sağa sola uzatıldı (sağ duvarda havlu askısı). Yüzler kadrajın üst-orta bölgesinde, altyazı bandının üstünde. Aynı ölçek arka arkaya üçten fazla kullanılmıyor (P1: genel → kapı yakın → genel → anne → Ece tepki → Ece → anne → Ece → zemin genel → yakın ek → genel → Ece yakın → …).
- **Ses bağlantısı (ses raporu §1-4):**
  - Seçilen çekimler: A05d (öfkeli), E07c (net "lan"), Y1_sec, Y2_sec, Y3_kisa, Y4_sec.
  - Böcek ezme adımı A05d'deki "vur" kelimesine, ikinci kulak çekişi E07c'deki "lan"a oturtuldu. Eski çekimlerin kelime çapaları yenilerine doğrusal eşlendi.
  - Efektler raporun saatlerinde. Motora efekt kırpma eklendi (`kirp`, `sure`).
  - Müzik: P1'de böcek paniğinde kesiliyor, A06'da baştan giriyor. P2'de S2'de `b7_sofra_komik` giriyor. P3 aynı müziğin 10,6. saniyesinden başlıyor; antre ve kanca müziksiz, kancada `el_asili_nota` çalıyor.
  - Ortam: `b7_banyo_aksam`, `b7_musluk_dongu` (P2'de musluk kapanana kadar), `b7_salon_aksam`. `banyo_sabah` (kuş sesi) kullanılmadı.

## Doğaçlamalar (kullanıcıya listelenecek)
### Yeni replikler (genel yönetmen onaylı; ses yönetmeni üretti)
- Y1 (P1) Ece, fısıltıyla: "anne vallahi büyük hayranınım."
- Y2 (P1) Ece: "Iıh!" (ikinci kulak çekişi)
- Y3 (P3) Ece, kapının arkasından: "İyiyim!"
- Y4 (P3) Ece, dış kapının arkasından: "Hassiktir…"
- Esneme (P1, sözsüz)

### Sözsüz eklemeler
**P1**
- Ece'nin girişi: koridorda gölgesi (ileri gelir, geri çekilir, yine gelir), pervazı kavrayan dört parmak, yarım yüz, güvenli mesafede durup yutkunma.
- Anne girişte desteyi "rozet gibi" kaldırıyor.
- "marketmiş"te 0,3 sn'lik böcek flaşı (B5'in dev böcek yakın planı).
- "dev gibi böcek"te anne 0,4 sn donuyor (A seçeneği). "böcek" sözünde Ece işaret parmaklarıyla anten yapıyor (eller şakaklarda).
- Böcek ezme: makinenin altından küçük, sıradan bir hamamböceği çıkıyor. Zemin yakın planında Ece'nin bir ayağı havaya kalkıyor, anne terlikli ayağıyla bakmadan eziyor (ÇAT). Geri döndüğümüzde anne hâlâ Ece'ye bakıyor; ayakkabının altından bir anten seğiriyor.
- Sessiz vuruş: Ece'nin gözleri yerden annesine çıkıyor.
- A06: deste Ece'nin yüzünün önünde sağa sola sallanıyor, Ece'nin gözleri kedi gibi izliyor.
- E02 sonu: Ece desteyi kapıyor, annenin eli havada boş kalıyor; anne önce boş eline, sonra Ece'ye bakıyor.
- Ece başparmağını tükürükleyip sayıyor (anne iğreniyor). Anne saymayı Ece'nin omzunun üstünden izliyor, kaşları kalkıyor.
- "Oha lan": deste yanağa bastırılıyor, sonra burnun altında koklanıyor (annenin çorap koklamasına ayna).
- İç ses (E06): şakakta ter, kaçamak gözler, anne yaklaşıp gözlerini kısıyor. 1,1 sn'lik sepya hayal eki: anne antrede, kapı zincirli, kolları bağlı, başını sallıyor.
- A08: anne kulağı bırakıyor, desteyi geri kapıyor (bu kez Ece'nin eli boş kalıyor), sol eliyle lavaboyu gösteriyor, desteyi hırka cebine koyuyor. Ece kulağını ovuşturuyor, annesinin önünden lavaboya yürürken başı annenin cebine dönük.

**P2**
- Aynaya gelip musluğu açıyor, kızaran kulağına dokunup yüzünü buruşturuyor.
- Sivilceye dik dik bakıp iç çekiyor.
- İki avuç su çarpıyor; ikincisi ağzına kaçıyor, yanak şişiyor, "pfff".
- S1'de ıslak işaret parmağını sallayarak kendine çıkışıyor.
- Duraksamada damlalar düşüyor, gözler kapıya kayıyor, eli çenesinde, dudağı kıvrılıyor.
- S2'de parmakla sayıyor ("1", "1" iki parmak). "olummmm"da elleri yanaklarında, parmak uçlarında zıplıyor.
- "Maske indi": iki elini yüzünden aşağı süzüyor, yüz kararlı. Plandaki havlu yerine bu yapıldı; FPS ayna açısında havluya uzanmak okunmuyordu.
- S3'te başını sallıyor.
- Çıkış: ayna boş kalıyor, su akıyor; Ece'nin gerçek eli kadrajın altından girip musluğu kapatıyor; salondan tabak sesi geliyor.

**P3**
- Anne tabakları sert bırakıyor (TAK TAK), zeytin kâsesini ortalıyor.
- Ece pijamayla sağdan girip annenin arkasından odasına koşuyor; anne başıyla tenis seyircisi gibi izliyor.
- Kapı arkası sesleri: dolap, GÜM, "İyiyim!"; anne göz deviriyor.
- Kapı aralanıyor, pijama üstü annenin başına düşüyor. Anne kıpırdamıyor, iki parmakla çekip omzunun üstünden atıyor.
- "otur şu masaya"da çatalı masaya vuruyor.
- Ece hardal kazakla çıkıp annenin arkasından sağına geçiyor (180° korunur). Anne desteyi hırka cebinden çıkarıyor.
- "o para...." yarım kalıyor: zeytin yakın planı, zeytini havaya atıp ağzıyla yakalama (yanak şişik), annenin şaşkın donması.
- MUAH: anne gözlerini kapatıyor, 0,3 sn yumuşuyor.
- "az işim var gelicemm" ağzı dolu, el sallayarak geri geri çıkış.
- Antre: kapı, karanlık sahanlık, otomatik ışık, çıkış, kapı kapanıyor. Kapının altındaki ışık sönüyor, boğuk "Hassiktir…" geliyor, ışık geri yanıyor, merdivenden koşma sesi.
- Kanca A: anne yanağına dokunup hırkasına siliyor. Destenin bandını çevirince kırmızı "7/24 MARKET" damgası görünüyor. Yüzü şüpheden endişeye dönüyor, Ece'nin gittiği yöne bakıyor.
- Yorum kartı A (arkada damgalı deste): "Bir gece = bir aylık maaş." / "Sen olsan geri döner miydin?" / "Yorumlara yaz."

## Yeni varlıklar ve motor değişiklikleri
- `engine/Inserts16.tsx` (`b7_banyo`):
  - gece ışık katmanı, yeni kol çözümü (`onKol`)
  - `eceKirp`, `golge`, `pervazEl`, `bocek` (küçük hamamböceği + ezik anten), `ek` (vuruş içinde yakın ek, sepya filtre), `flas`, `aynala`, `musEl`
  - `sahanlik` / `kapiAlti` (antre otomatik ışığı), `kanatOnde` (zamanlı), `kulak` (kızarma), `cepDeste`, `kafada`, `jest`, `ter`, `solgun`
  - eşyalar `isaret`, `iki`
  - geniş SVG alanı: kadraj taşmasında siyah yok.
- `engine/Inserts17.tsx`: `b7_ez` (zemin yakın planı, böcek ezme), `b7_bant` (damgalı bant).
- `sets/banyo724.tsx`: kapı görünümü −400..1580'e uzatıldı (sağ duvarda havlu askısı), ayna yansımasında gece penceresi. `sets/ev724.tsx`: sofrada `tabak1`.
- `engine/Episode.tsx` + `types.ts`: efekt `kirp` / `sure`.
- `tools/kareler.mjs`: tek paketle çok kare alıp şerit yapan denetim aracı.
- `public/ses/efekt/b7_esneme.mp3`: Y0b_01'in ilk 1,4 sn'si kırpılmış hâli.
- Katalog: `docs/uretim-rehberi.md` §4 güncellendi.

## Denetim
- Her vuruş önce `kareler.mjs` şeritleriyle (P1 ~150 kare, P2 ~45, P3 ~80) incelendi, hatalar düzeltilip yeniden bakıldı. Düzeltilen başlıca hatalar:
  - uzatma bölgesinde siyah / dama deseni
  - Ece'nin kapı boşluğu dışında görünmesi
  - V kollar, antenlerde ellerin yüzü kapatması, destenin yüzü kapatması
  - annenin kulak kolunun kendi yüzünü kesmesi
  - hayal ekinde annenin kanadın arkasında kalması
  - antrede kapalı kapının karanlık görünmesi
  - kapı altı ışığının gece katmanında kaybolması
- Render sonrası saniyede 4 kare şeritlerle tekrar bakıldı (aşağıda).

## Bilinen eksikler ve riskler
- Y2 "Iıh!" kesimi "ah/oh" tınısında (ses raporu §6). Beğenilmezse yaklaşık 15 kredilik tek çekim yeter.
- `b7_ez` zemin yakın planında bacaklar kadrajın tepesine kadar uzanıyor (alçak açı). Okunuyor ama stilize.
- P2'de plandaki havlu yerine "eller yüzden aşağı" vuruşu yapıldı (FPS ayna açısında daha okunur).
- P3'te Ece kâseden zeytini alırken eli masa hizasında kadraj dışında kalıyor; alma anını `zeytin_al` yakın planı gösteriyor.
- Rig'de ayak kaldırma yok. "Tek ayak havada" yalnız zemin yakın planında görünüyor; genel planda Ece parmak ucunda.
