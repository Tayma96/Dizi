# 7/24 · Bölüm 8, Parça 2: görüntü yönetmeni raporu

Tarih: 24 Kasım 2026. Metin: `bolumler.md` "Bölüm 8, Parça 2" (AYNEN; yeni replik YOK). Sesler: `public/voice/724-08-p2/` (ses yönetmeninin `secim.json` seçimleri otomatik okunur).

## Çıktılar
| | |
|---|---|
| Video | `bolumler/724-08-p2.mp4` (−14 LUFS, aac 256k, yorum kartı yok) |
| Bölüm JSON | `dizi-studio/public/episodes/724-08-p2.json` (üretici: `python3 tools/b8p2.py [--cekim E1=E1b_01,...]`; çekim seçimlerini `public/voice/724-08-p2/secim.json`'dan da okur; motorun `i_NN` anahtarlarını `manifest.json`'a EKLER, çekimlere dokunmaz) |
| Olay zamanları (ses için) | `docs/diziler/724/raporlar/b8p2-goruntu-zaman.json` (`sak`, floresan, kalem, lamba, hızlı yaklaşma, pompa, taklit, market, omuz silkme) |
| Motor | `engine/Inserts18.tsx` (`b8_market`: yeni `nah` görünümü, kasada Ece önde, `odak`, `kalemMasa`), `engine/nahEl.tsx` (NAH elleri), rig `taklit` (opt-in) |

## Kurgu (sahne saniyesi; çekimler E1a S1a E2a S2a E3a S3a E4h E5a E6a ile; toplam 38,6 sn)
| sn | görünüm | ölçek | ne olur |
|---|---|---|---|
| 0-5,6 | tezgah | orta, yavaş itme | P1'in gerilimi: floresan kısık, lamba açık, Ece solgun ve kâğıda bakıyor. Bir göz kırpma, bakışını Sabri'ye kaldırıyor. 0,5'te floresan "tık" diye normale dönüyor (büyü bozuluyor). Alaycı "he… koskoca korkunç paralel evrenler": avuçlar yukarıda, önkollar dışa açılıyor (dirsekler aşağıda), kaş kalkık. |
| 5,6-11,2 | kasa | orta | Sabri'nin tepkisi "götü boklu markette…": göz kırpıyor, şaşkın, sonra mahcup; kâğıda bakıyor. "he valla"da omuzları düşüyor, kalem elinden tezgâha düşüyor. Ardından lambaya uzanıp söndürüyor; ışık normale dönüyor. |
| 11,2-14,2 | tezgah | yakın | "haa öbür taraf yok yani?": "haa"da gözler açılıyor, sonra umutla öne eğiliyor, başı yana, hafif gülümsüyor. |
| 14,2-16,1 | kasa | yakın | Sabri saf: "öbür taraf derken?", başı yana eğik, kaşlar kalkık. |
| 16,1-20,1 | tezgah | orta | Bıkkın "ruhlar alemi Sabri abi ruhlar alemi": göz deviriyor (yukarı), tek elle göğüs önünde "uuu" dalgası. "Sabri abi"de öfkeyle başını eğiyor. İkinci "ruhlar alemi"de iki el göğüs önünde, gövdeye yakın kıpırdıyor (U kol yok). Sonda omuzları düşüyor. |
| 20,1-23,5 | kasa (iki) | geniş-orta → HIZLI itme | Ece önde, solda; Sabri arkada, tezgâhın ardında. "yoo ne alaka." diyen Sabri elini sallıyor, başını iki yana çeviriyor, masum gülümsüyor. Ece rahatlıyor, ardından sinsi sırıtıyor. "heh"te başını KAMERAYA çeviriyor (4. duvar): kamera 0,22 sn'de orta-yakına iniyor, arka plan bulanıp kararıyor. Eller göğsün önüne kalkıyor (sağ el açık, parmaklar aşağıda). |
| 23,5-25,4 | nah | el yakın planı | Seyircinin yerinden göğüs ve iki el. Sağ el açık, beş parmak aşağıda, elin sırtı bize dönük; sol avuç yanda hazır. Sol avuç sağın parmaklarını yukarı süpürüp kapatıyor ve sağ el yumruk oluyor. Yumruk önden ileri uzanıp büyüyor: dört boğum yan yana, BAŞPARMAK UCU işaret ile orta parmağın ARASINDAN çıkıyor. Bu sırada sol el açık avuçla geri çekiliyor ve hız iziyle sağ bileğin içine ŞAKLIYOR (24,42: temas karesi, ışınlar ve parlama, kadraj titremesi). Sonra bileği kavrıyor. İki "nah" pompası var. |
| 25,4-26,5 | kasa | orta-yakın | Yüzüyle birlikte: yumruk önde, sol el bilekte, Ece sırıtıp gülüyor, göz kırpıyor, iki pompa daha yapıyor. Sabri arkada, bulanık; Ece'ye şaşkın bakıyor. |
| 26,5-29,2 | kasa | yakın | "Did ind jib" boyunca TAKLİT SURATI: gözler şaşı, kaşlar ters, burun kıvrık, dudak çarpık. "deyip duruyordunuz"da yüz normale dönüyor; kızgın, kaşlar çatık. |
| 29,2-32,4 | kasa | orta | "al bak tek ortak noktamız market": arka plan yarı bulanık, market görünüyor. "market"te başparmağıyla omzunun üstünden arkadaki marketi (rafları, Sabri'yi) gösteriyor ve başını oraya çeviriyor. |
| 32,4-33,5 | kasa | yakın | Sözsüz: Sabri bir şey anlamıyor. Ece'nin konuştuğu boşluğa (kameranın soluna) bakıyor, çenesini ovuyor, başını eğiyor, göz kırpıyor. |
| 33,5-38,6 | kasa | orta-yakın, yavaş itme | Mahcup "tamam böcek biraz sıçana benzemiş olabilir": eli ensesinde kaşınıyor, gözleri önce sağa sonra sola kaçıyor, "olabilir"de omuz silkiyor, sonda utangaç sırıtışla kameraya dönüyor. Parça sonu. |

Ölçek sırası: orta → orta → yakın → yakın → orta → iki (itme) → el yakın planı → orta-yakın → yakın → orta → yakın → orta-yakın. Aynı ölçek arka arkaya en çok iki kez geliyor. Görüntü 2-4 sn'de bir değişiyor (kesme, ifade, jest ya da kamera hareketi).

## Kontrol listesi (B7)
- **Kollar:** V/U kol yok. "koskoca" jestinde önkollar dışa-yukarı açılıyor, dirsekler aşağıda kalıyor. İlk "ruhlar alemi" denemesinde eller baş hizasındaydı ve U kola dönüştü; göğüs önüne indirildi. Sabri'nin kafa kaşıması direk gibi dik bir kol üretiyordu; yerine önden çene ovma kondu. Ense kaşıma ve başparmak jestinde önkol önden ve dik.
- **Bakış:** Konuşan muhatabına bakıyor. 180° korunuyor: Ece Sabri'ye bakarken sağa, Sabri Ece'ye bakarken sola bakıyor. İki çekimde Ece solda, Sabri sağda. 4. duvarda Ece kameraya bakıyor; Sabri ona, sonra onun konuştuğu boşluğa bakıyor.
- **Süreklilik:** P1'in sonu korunuyor: floresan %60, lamba açık, kalem Sabri'nin sol elinde, şema ters duran kâğıtta tamamlanmış, gazete kenarda, fiş bloğu önde, kostüm `ece_sivil`, sağ kulak kırmızı. Kalem tezgâhta kalıyor, lamba sönük kalıyor. Saat 19:09.
- **Dinleyenin tepkisi:** E1'de Sabri'nin tepkisi kesiliyor. S3'te Ece önde tepki veriyor. 4. duvarda Sabri arka planda; parçanın sonunda kendi tek çekimi var.
- **Altyazı:** Yüzler üst-orta bölgede. "market" jestindeki el başta altyazı bandındaydı; omuz hizasına alındı.
- **Kadrajda siyah boşluk yok:** Kamera her görünümde dünya sınırına kırpılıyor.

## NAH işaretinin kare kare denetimi
- **Kullanıcı düzeltmesi:** ŞAK sesi sol avucun sağ bileğe çarpmasıyla çıkıyor. Bu uygulandı. Sol el yumruk ileri giderken AÇIK avuçla geri çekiliyor, hızlanarak bileğin içine çarpıyor (hız izi var), temas karesinde ışınlar ve parlama çıkıyor, ardından 0,15 sn'de parmaklar kapanıp bileği kavrıyor.
- **ŞAK anı:** `b8p2-goruntu-zaman.json` → `olaylar.sak` (şu anki çekimlerle 24,417 sn). `efekt/b8_nah_sak` (0,85) üreticide `t_sak` değişkenine bağlı, görüntüdeki temas karesiyle birlikte kayıyor. Ses raporunda 24,287 yazıyordu; o değer eski temas anından (n0 + 0,82) hesaplanmış. Avucun geri çekilip çarpması 0,13 sn sürdüğü için temas 24,417'ye kaydı ve ses bu kareye oturtuldu.
- Kontrol kareleri saniyede 4 kare alındı: el açık → parmaklar kapanıyor → yumruk ileri → avuç bileğe → kavrama → pompa. Başparmak ucu her yumruk karesinde işaret ile orta parmak arasında net görünüyor.

## Ses bağlantısı (b8p2-ses.md §3, aynen)
- Floresan tık: `floresan_cit` 0,4.
- Müzik: `muzik/b8_komik_dusus_kesik`, 8,33'ten başlar, sfx olarak 0,25, `sure` 14,4.
- Kalem: `b8_kalem_dus` 0,6 (`kalem_cit` kullanılmadı). Lamba tıkı: `el_kalem_tik` 0,4.
- Plak çiziği: `b8_plak_kisa`, 22,33-22,71.
- Kameraya dönüş: `el_whoosh_kay` 0,3. Kumaş: `el_kumas_burus` 0,3.
- ŞAK: `b8_nah_sak` 0,85, `t_sak`'ta.
- Kapanış: `muzik/b8_komik_buton`, 37,95'te, 0,3.
- E1 çekimindeki 0,20-0,90 sn gülüş dudak senkronunda yoktu. O aralıkta Ece gözleri kapalı sırıtıyor (`gulen`) ve kıkırdama ağzı yapıyor (yeni opt-in karakter alanı `kikir`: bu aralıkta manifest ağzı yerine kıpır kıpır ağız).

## Yeni varlıklar / motor (hepsi opt-in; eski bölümleri değiştirmez)
- `engine/nahEl.tsx`: `NahEller` (iki el, adım `a`, kollar/yenler, darbe ışınları, hız izi) ve `nahGeo` (bilek noktaları; kasa görünümünde Ece'nin rig kolları bunlara bağlanıyor).
- `engine/Inserts18.tsx`:
  - `nah` görünümü.
  - Kasada Ece önde: `kar.kasa.ece` + `eceKasaAra`.
  - `odak`: arka plan ve Sabri bulanıp kararıyor.
  - `kalemMasa`, `nahA`, `nahYer`, `nahIleri`, `nahIleriIns`, `darbe`.
- Rig: `Pose.taklit` (`types.ts`, `Character.tsx`). `Inserts16` karakter alanları `taklit` ve `omuzDus` (eksi değer omuz silkme). Yeni eşya: `basparmakArka`.
- Katalog: `docs/uretim-rehberi.md` §4 (b8_market maddesi).

## Riskler / bilinen sınırlar
- **2D rig ve arka:** Ece'nin rig'i önden çizildiği için iki çekimde gövdesi kameraya dönük, yalnız başı Sabri'ye çevrili ("cheat"). Arkası dönük bir rig yok.
- **"market" jesti:** Başparmak omzun üstünden arkayı gösteriyor. Okunuyor, ama küçük ekranda "el kaldırma" gibi de algılanabilir.
- **Ense kaşıma:** El başın yanında, ensede. Rig eli kafanın arkasına alamıyor.
- **Sabri'nin göz kırpması:** "öbür taraf derken?"in başında rastgele bir göz kırpma düşüyor (doğal). Yaşlı göz kapağı yüzünden kırpma uzun görünebilir.
- **Manifest:** `manifest.json` ses yönetmeniyle ortak. Ses yönetmeni dosyayı yeniden yazarsa `python3 tools/b8p2.py` yeniden çalıştırılmalı (motorun `i_NN` anahtarları geri gelir).
