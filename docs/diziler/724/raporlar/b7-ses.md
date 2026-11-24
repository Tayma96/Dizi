# 7/24 · Bölüm 7: ses yönetmeni raporu (P1 + P2 + P3)

Tarih: 24 Kasım 2026 (gece çalışması). Kaynak: `b7-gece-brief.md`, `b7-senarist.md`, genel yönetmen kararları.
Tüm yollar `dizi-studio/public/` altındadır. Bölüm JSON'unda `name` için uzantısız katalog adı kullanılır (`efekt/el_tabak_tak` gibi). Replikler manifest anahtarıyla bağlanır: `public/voice/724-07-yeni/manifest.json` (seçim özeti `secim.json`).
Saatler senaristin planındaki sürelerdir. Y1 planda 1,8 sn ama seçilen çekim 3,1 sn sürüyor; bu yüzden P1'de Y1'den sonraki her vuruş **+1,3 sn** kayar. Tabloda kaydırılmamış plan saati ve kelimeye göre yerleşim birlikte verildi; görüntü yönetmeni kelime saatine göre yerleştirsin.

## Kredi
| | kredi |
|---|---|
| Başlangıç (`durum`) | 17.150 kalan |
| Yeni replikler Y1/Y3/Y4 (9 çekim) | 218 |
| Esneme Y0 (2 çekim) | 37 |
| A05 öfkeli (3) + E07 net "lan" (2) ek çekimleri | 144 |
| 21 ses efekti (ElevenLabs SFX) | ~327 |
| 1 müzik (`b7_sofra_komik`, 30 sn) | 375 |
| **Toplam** | **1.101** (kalan 16.049; gece tavanı 3.000, aşılmadı) |

Ücretsiz işler: Y2 kesimi, kapı arkası filtreleri, akşam ortamları ve efekt türevleri (`dizi-studio/tools/b7_ses.py`, yalnız ffmpeg).

---

## 1. Replikler

### Yeni replikler (GY onaylı doğaçlama; metin aynen)
| # | Kullanılacak dosya (manifest anahtarı) | Süre | Kelime zamanı | Whisper (medium) | Kullanım anı |
|---|---|---|---|---|---|
| Y1 "anne vallahi büyük hayranınım." | `voice/724-07-yeni/sec/Y1_sec.mp3` (`Y1_sec`, kaynak Y1c_01) | 3,11 sn | anne 0,10 · vallahi 1,22 · büyük 1,86 · hayranınım 2,18-3,14 | "Anne, vallahi büyük hayranınım." (1,00) | P1, böcek ezildikten sonraki sessiz vuruşun ardından (plan 28,65). Fısıltı, -17 LUFS. "Anne"den sonra 0,5 sn korku duraklaması var; o arada Ece sırıtıp bir adım geri çekilebilir. Ağız: manifestteki `mouth`. |
| Y1 yedek | `sec/Y1_yedek_kikir.mp3` (`Y1_yedek_kikir`) | 4,41 sn | 0-1,95 gergin kıkırdama, replik 2,0-4,2 | "…vallaha…" (0,78) | Kıkırdamalı sürüm. Daha komik olabilir ama 1,3 sn daha uzun, ayrıca "vallaha" gibi duyuluyor. |
| Y2 "Iıh!" | `sec/Y2_sec.mp3` (`Y2_sec`; E05b_01'in 1,78-2,28 sn'si) | 0,55 sn | tek hece | "Oh!" | P1, E07'deki ikinci kulak çekişinde (plan 57,35; Y1 kaymasıyla ~58,65). E05b P1'de kullanılmıyor, yani aynı ses iki kez duyulmaz. **Uyarı:** kesilen hece "ah/oh" tınısında; "ıh" değil. Yeni üretim yapılmadı (GY kararı). Beğenilmezse yaklaşık 15 kredilik tek bir çekim yeterli. |
| Y2 yedek | `sec/Y2_yedek.mp3` (E05b 0,22-0,64) | 0,47 sn | tiz başlangıç | — | Daha tiz ve kısa. |
| Y3 "İyiyim!" | `sec/Y3_kapi_kisa.mp3` (`Y3_kisa`; Y3b_01 2,22-3,24 + kapı arkası hafif filtre, -19 LUFS) | 1,33 sn | İyiyim 0,00-0,66 | "İyiyim." | P3, GÜM'den hemen sonra (plan 5,4-6,0). Plandaki 0,6 sn'lik yere oturur. |
| Y3 soluklu | `sec/Y3_kapi.mp3` (`Y3_sec`; nefes nefese 0-1,0 + İyiyim 1,02-1,66) | 2,35 sn | | "İyiyim." | "Nefes nefese" hissi daha güçlü. Zaman varsa bunu kullanın: GÜM'le aynı anda başlatılırsa soluk düşüşün üstüne biner. |
| Y4 "Hassiktir…" | `sec/Y4_kapi.mp3` (`Y4_sec`; Y4b_01 + dış kapı arkası filtre, -24 LUFS) | 2,53 sn | 0-0,4 irkilme nefesi, kelime 0,69-1,90 | "hasiktir" (0,94) | P3, merdiven otomatiği söndükten 0,3-0,4 sn sonra (plan 17,5-19,0). Boğuk ve uzak. Kuru sürüm: `sec/Y4_kuru.mp3`. |
| Y0 esneme (sözsüz) | `voice/724-07-yeni/Y0b_01.mp3` | 3,76 sn | esneme 1,48-3,72 | (kelime yok) | P1 girişi, koridordaki gölge belirirken (plan 14,55-15,6), ses 0,5-0,6. Baştaki 1,4 sn'yi kırpın (`kirp 1.4`). Yedek: `Y0a_01.mp3` ("Haaah… hıh", 3,63 sn). |

### Mevcut repliklerde duygu denetimi ve ek çekimler
| Replik | Bulgu | Öneri (dosya) | Süre / kelime |
|---|---|---|---|
| **A05** "Böcek evde de var terliği vur geç" | Kullanılan A05a_01'in etiketi `[dismissive, sarcastic, unimpressed]`, A05b'ninki `[deadpan…]`. Kullanıcı "anne terlik lafında bile ÖFKELİ" dedi; iki çekim de buna uymuyor. | Yeni öfkeli çekimler. **A05d_01** (`voice/724-07-yeni/A05d_01.mp3`, "furious, snapping"); yedek **A05c_01** ("vur, geç" arasında es var, ÇAT için rahat). Ses perdesi A04b'nin öfke düzeyine yakın: A05a'nın ortanca f0'ı 308 Hz, A05d'ninki 413 Hz. | A05d 2,69 sn: terliği 1,44 · **vur 1,80** · geç 2,00. A05c 2,85 sn: **vur 1,92** · geç 2,32 |
| **E07** "ama çok para lan" | Kullanılan E07b_01'i Whisper small "paralam" diye duyuyor (medium doğru: "lan."). İkinci kulak çekişinin sebebi "lan" olduğu için kelime net duyulmalı. | **E07c_01** (`voice/724-07-yeni/E07c_01.mp3`): "Ama çok para lan!", lan net ve ünlemli. Yedek E07b (mevcut). | 1,83 sn: ama 0,11 · çok 0,51 · para 0,83 · **lan 1,15-1,79** |
| E05 "aauuv ah ah acıyo" | E05a_01 (kullanılan) sözsüz acı sesi, Whisper puanı 0,43; acı sesi olduğu için normal. | Değişiklik yok. | |
| Diğerleri (A01-A04, A06-A08, E01-E04, E06, S1-S3, A1, A2, E1) | Whisper 0,86-1,00; etiketler sahne duygusuna uygun. "gelicemm" "geleceğim" diye yazıya dökülüyor; bu Whisper'ın normalleştirmesi, ses doğru. | Mevcut seçimler kalsın: A04b, E01a, A06b, E02b, E03b, E04b, E05a, A07a, E06a, A08a, S1a, S2b, S3b, A1a, A2a, E1a. | |

---

## 2. Ortam (her sahnede bir katman; kasım 18:00, kuş yok)
`ortam/banyo_sabah` içinde **kuş sesi** var. 18:00 karanlığına uymuyor, B7'de kullanılmamalı.
| Dosya | Süre | Seviye | Kullanım |
|---|---|---|---|
| `ortam/b7_banyo_aksam` | 58 sn döngü | -20 LUFS → `volume` 0,5 | P1 ve P2 banyo: oda tonu, aspiratör uğultusu, kapalı pencere arkasında gece şehri. |
| `ortam/b7_musluk_dongu` | 14 sn döngü | -24 LUFS → 0,45 | P2: musluk açıldığı andan (0,0) kapanana kadar (18,7-20,0). Tek el kadraja girip musluğu kapatınca `efekt/b7_musluk_kapat` çalar. |
| `ortam/b7_salon_aksam` | 58 sn döngü | -20 LUFS → 0,5 | P3 salon ve antre: oda tonu, pencere arkasında gece şehri, hafif duvar saati. P2'nin son 0,4 sn'sinde başlar (J-cut). |

---

## 3. Efekt yerleşimi

### P1: Banyo (plan saatleri; Y1'den sonrası +1,3 sn)
| Plan sn | Olay | Dosya | Süre | Ses | Yerleşim |
|---|---|---|---|---|---|
| 0-14,55 | Açılış (korunur) | mevcut `b7p1v2` sesleri (el_koklama, b7_anne_iyy, el_kumas_*, el_kaching…) | | | Değişiklik yok. |
| 14,3 | Koridordan terlik sürümesi | `efekt/el_terlik_surume` | 2,51 | 0,45 | 14,3'ten başlar, 3 adım. |
| 14,6 | Esneme | `Y0b_01` (kırp 1,4) | 2,3 | 0,55 | Gölge belirirken. |
| 15,6 | Kapı aralığı | `efekt/kapi_gicirti` | 1,33 | 0,35 | `kirp` 0-0,7. |
| 17,4 | Yutkunma | `efekt/yutkunma` | 0,71 | 0,5 | Ece desteyi görünce. |
| A04 | Deste sallama ×3 | `efekt/el_deste_salla` | 1,04 | 0,4 | A04b'de "nerden" (0,16), "nasıl" (1,76), "lan" (2,80) kelimelerine. Tepe 0,50'de, `at` = kelime − 0,45. |
| 21,2 | Böcek flaşı | `efekt/el_bocek_tislama` (kırp 0-0,35) + `efekt/nefes_kesilme` | 0,35 / 0,9 | 0,55 / 0,5 | Flaşla aynı anda; nefes Ece'ye kesilince. **Müzik burada kesilir** (bkz. §4). |
| 25,1 | Küçük böcek koşar | `efekt/el_kucuk_bocek` | 1,04 | 0,35 | A05 başlamadan 0,3 sn önce, makinenin altından. |
| A05 "vur" | **ÇAT**: terlik + çıtırtı | `efekt/el_bocek_ezme` | 1,04 | 0,8 | Tepe 0,50 sn'de; `at` = "vur" − 0,45 (A05d: 1,35; A05c: 1,47). Ardından 0,2 sn yalnız ortam. |
| ÇAT +0,05 | Ece irkilir | `efekt/el_irkilme` | 1,0 | 0,35 | |
| 28,65 | Y1 | `Y1_sec` | 3,11 | — | |
| A06 | Deste burnunun önünde | `efekt/el_deste_salla` ×2 | 1,04 | 0,3 | A06b'de "para" (1,28) ve "para" (2,24) − 0,45. |
| E02 "bakıyım" | Kapma | `efekt/el_deste_kapma` | 0,73 | 0,6 | Tepe 0,32; E02b "bakıyım" 2,20 → `at` 1,9. |
| 38,2 | Başparmak tükürükleme | `efekt/el_dil_saplatma` | 0,52 | 0,5 | Tek tık. |
| E03 | Para sayma | `efekt/el_para_sayma` | 2,51 | 0,45 | E03b'nin 1,1. saniyesinden başlar ("yüz" 1,20). |
| E04 sonrası | Desteyi derin koklama | `efekt/el_uzun_koklama` | 1,52 | 0,55 | "para"dan (1,60) sonra, E04 bitince. Annenin "Iyy"ine ayna. |
| E05 | Kulak tutulur | `efekt/el_kulak_cekme` | 0,84 | 0,45 | E05 başında. Mevcut `el_sok_vurgu` ile ikisi birden fazla olur; birini seçin (öneri: kulak_cekme). |
| 52,5 | Hayal eki (sepya) | `efekt/whoosh` (0,3 sn) + `efekt/b7_hayal_zincir` | 1,2 / 1,78 | 0,25 / 0,5 | Ekin girişinde whoosh, zincir ekin ortasında; rüya yankısı var. |
| E07 "lan" | İkinci kulak çekişi | `efekt/el_kulak_cekme` | 0,84 | 0,55 | E07c "lan" 1,15. Hemen ardından **Y2** (`Y2_sec`). |
| A08 "bu paranın" | Desteyi geri kapma | `efekt/el_deste_kapma` | 0,73 | 0,6 | A08a "bu" 1,52 → `at` 1,25. |
| A08 "bana" | Cebe sokma | `efekt/el_cep_hisirti` | 1,04 | 0,45 | A08a "bana" 3,12. |
| 61,4 | Çıkış, terlik | `efekt/el_terlik_surume` | 2,51 | 0,35 | |

### P2: Ayna
| Plan sn | Olay | Dosya | Süre | Ses | Yerleşim |
|---|---|---|---|---|---|
| 0,0 | Musluk açılır, su akar | `ortam/b7_musluk_dongu` | 14 döngü | 0,45 | 0'dan 18,7-20,0'a kadar. |
| 2,2-3,8 | Yüz yıkama (iki avuç) | `efekt/el_yuz_yikama` (kırp 0,3-2,6) | 2,3 | 0,5 | Şapırtılar 0,9 / 1,3 / 1,8 / 2,1 sn'de. |
| 3,2 | Ağzına su kaçar, "pfff" | `efekt/el_su_tukurme` | 1,04 | 0,5 | Tepe 0,18. |
| S1 | Damla "tıp" | `efekt/el_damla` | 1,04 | 0,3 | S1 sonunda (değerli 3,36 sonrası). |
| 7,9-9,4 | Duraksama | `efekt/el_damla` ×2 | 1,04 | 0,4 | 8,0 ve 8,8. Burada **müzik yok, yalnız damla ve musluk**: duygu dönüşü sessizlikle verilir. |
| S2 "olummmm" | Kasa | `efekt/el_kaching` | 1,2 | 0,45 | S2b "olummmm" 4,44 − 0,1. |
| 14,6 | Havlu | `efekt/el_havlu` | 1,52 | 0,5 | |
| 15,0 | Salondan ilk tabak (köprü) | `efekt/b7_tabak_uzak` | 0,99 | 0,6 | Uzak ve yankılı. |
| 18,7 | Musluğu kapatma | `efekt/b7_musluk_kapat` | 1,54 | 0,6 | Musluk döngüsü burada biter. |
| P2 son 0,4 sn | Salondan sert "TAK" (J-cut) | `efekt/b7_tabak_uzak` + `ortam/b7_salon_aksam` 0,4 sn önden | | 0,8 / 0,5 | P3'ün ilk tabağı. |

### P3: Salon ve sofra
| Plan sn | Olay | Dosya | Süre | Ses | Yerleşim |
|---|---|---|---|---|---|
| 0,3 / 1,1 | Tabak TAK ×2 | `efekt/el_tabak_tak` | 1,04 | 0,7 / 0,8 | Tepe 0,14. İkincisi daha sert. |
| 1,6 | Zeytin kâsesi | `efekt/el_catal_tik` | 0,63 | 0,3 | Küçük seramik tık. |
| 2,0 | Ece hızlı geçer | `efekt/adim_kosu_1..4` (her biri 0,37) | | 0,35 | 4 adım, 0,3 sn arayla. |
| 3,3 | Oda kapısı KÜT | `efekt/b7_oda_kapi_kut` | 0,86 | 0,7 | |
| 3,4 | Kapı arkasında çekmece, askı | `efekt/b7_kapi_arkasi_dolap` | 2,95 | 0,7 | Boğuk. |
| 4,3 | Tek ayak zıplama + GÜM | `efekt/el_kapi_arkasi_gum` | 2,04 | 0,75 | GÜM tepesi 0,96 → plan 5,26. |
| 5,4 | Y3 | `Y3_kisa` (ya da `Y3_sec`) | 1,33 | — | |
| 6,0 | Kapı aralanır, pijama fırlar | `efekt/kapi_gicirti` (kırp 0-0,4) + `efekt/kumas_firlat` + `efekt/kumas_dus` | 0,4 / 0,44 / 0,55 | 0,3 / 0,5 / 0,5 | kumas_dus pijamanın annenin başına düştüğü an. |
| 6,8 | Kapı yeniden kapanır | `efekt/b7_oda_kapi_kut` | 0,86 | 0,45 | Daha yumuşak. |
| A1 "masaya" | Çatalı masaya vurma | `efekt/el_catal_tik` | 0,63 | 0,6 | A1a "masaya" 0,63. |
| 8,6 | Ece odadan çıkar | `efekt/kapi_gicirti` + `efekt/ayak_sesleri` (kırp 0-1,4) | | 0,3 / 0,35 | |
| 9,8 | Anne cebinden desteyi çıkarır | `efekt/el_cep_hisirti` | 1,04 | 0,35 | Ödeme: P1'de cebe girmişti. |
| A2 | Deste havada | `efekt/el_deste_salla` (kırp 0-0,5) | 0,5 | 0,3 | |
| 11,3 | Zeytin at, yakala | `efekt/el_zeytin_yakala` + `efekt/el_cigneme` (kırp 0-0,7) | 1,0 / 0,7 | 0,6 / 0,35 | |
| 13,0 | MUAH | `efekt/el_opucuk` | 1,0 | 0,65 | Tepe 0,42 → `at` 12,6. |
| 15,7 | Anahtarlar askıdan | `efekt/el_anahtar_kap` | 1,04 | 0,5 | |
| 16,0 | Antre kapısı açılır | `efekt/kapi_acilma` (kırp 0-1,5) | 1,5 | 0,45 | |
| 16,4 | Merdiven otomatiği (kapı açık) | `efekt/el_otomatik_isik` | 1,52 | 0,5 | Büyük düğme tıkı 0,14, ardından vızıltı. |
| 17,0 | Kapı "küt" | `efekt/kapi_kapanma` (kırp 0-1,2) | 1,2 | 0,5 | |
| 17,5 | Otomatik söner (kapı arkası) | `efekt/b7_otomatik_sonme` | 0,39 | 0,5 | Kapının altındaki ışık çizgisi aynı karede söner. |
| 17,9 | Y4 | `Y4_sec` | 2,53 | — | |
| 19,0 | Düğme yeniden, ışık gelir | `efekt/b7_otomatik_isik_kapi` | 1,85 | 0,6 | |
| 19,3 | Merdivenden hızlı iniş | `efekt/b7_merdiven_kosu` | 2,2 | 0,6 | Uzaklaşıp söner. |
| 19,6+ | Kanca: anne bandı çevirir | `efekt/el_kagit` (kırp 0-0,6) | 0,6 | 0,3 | |
| kanca | Tek asılı nota | `efekt/el_asili_nota` | 4,05 | 0,45 | Anne desteye/bant damgasına baktığı an. Nota kesmeyle biter. |
| 22,5 | Yorum kartı | `efekt/el_kart_pop` | 0,63 | 0,5 | Kart belirince. |

---

## 4. Müzik (sahne başına en fazla bir değişim; duygu dönüşünde sessizlik)
| Parça | Müzik | Ses | Ne zaman |
|---|---|---|---|
| P1 | `muzik/banyo_komik` (35 sn, ElevenLabs pizzicato) | 0,16 | **0-21,2:** beğenilen açılıştaki gibi. **21,2 (böcek flaşı) - A06 başı:** müzik kesilir, yalnız ortam ve efekt kalır. Ölüyodum → ÇAT → sessiz vuruş → Y1 komedisi sessizlikte işler. **A06 başı (plan 30,6+1,3) → son:** `banyo_komik` kendi başından (offset 0) yeniden girer, 0,14; P1'in sonunda 2 sn söner. Müziğin sonundaki "hafif uğursuz alçak nota" (32-33. sn) P1'in kapanışına ("Ece ne uyduracak?") denk gelir. |
| P2 | 0-9,4 müzik yok (su, damla, nefes) | — | Kendine çıkışma ve duraksama sessizde. |
| P2 | `muzik/b7_sofra_komik` (yeni, 30 sn; ölçüme göre 0-24 sn oynak pizzicato ve klarnet, 24-25'te söner) | 0,15 | S2 "Günlük…" girişiyle (9,4) offset 0'dan başlar: açgözlülüğe dönüş anı. P2 sonuna kadar (~10,6 sn) sürer, son 1 sn'de söner. |
| P3 | `muzik/b7_sofra_komik` offset **10,6** | 0,16 | 0'dan başlar (0,3 sn fade-in), P2'nin devamı gibi akar. Parça kendi doğal sonuna 13,9 civarında, Ece'nin "az işim var gelicemm" deyip antreye yürüdüğü yerde ulaşır. Antre, otomatik ışık ve Y4 **müziksiz** ilerler (sessizlik). |
| P3 kanca | `efekt/el_asili_nota` | 0,45 | Kancada tek asılı nota (bkz. §3). Yeni müzikte istenen "asılı nota" kendiliğinden çıkmadı, bu yüzden ayrı efekt kullanılıyor. |
| Yorum kartı | `muzik/jenerik_tema` (kırp 0-4 sn, 1 sn fade-out) | 0,22 | Leitmotif: kilit an + kart. İsteğe bağlı. Kart sessiz kalacaksa yalnız `el_kart_pop`. |

**Ayrı yayın uyarısı (Reels):** P2 ve P3 tek başına da yayınlanacağı için P3 müziği parçanın ortasından (offset 10,6) başlar. Parça zaten ilk saniyeden enerjik, fade-in 0,3 sn yeterli. Birleşik bölümde P2→P3 geçişi kesintisiz akar.

## 5. Miks seviyeleri
- Diyalog −16 LUFS (fısıltı Y1 −17). Kapı arkası: Y3 −19 (oda kapısı, yakın), Y4 −24 (dış kapı, merdiven).
- Müzik diyalog altında motor tarafından yaklaşık −7 dB kısılır; P1/P3 için 0,14-0,16 yeterli. Komedi vuruşlarının (ÇAT, MUAH, GÜM) üstünde müzik olmamalı ya da çok kısık olmalı.
- Ortam dosyaları −20 LUFS, `volume` 0,45-0,5.
- Efektler: darbe tipi sesler (ÇAT, TAK, KÜT, GÜM) 0,7-0,8; hışırtı ve kâğıt sesleri 0,3-0,45. Diyalogla çakışanlar 0,3'ü geçmesin.
- Son master −14 LUFS, tepe ≤ −1 dBTP (brief: `volume=(-14.6-I)dB,alimiter=limit=0.89`).
- Render sonrası denetim: `ffmpeg -af ebur128` ile LUFS ölçülür; Whisper ile bölüm sesi baştan sona yazıya dökülüp senaryoyla karşılaştırılır (GY birleştirmeden sonra).

## 6. KONTROL ET (Whisper)
- `Y3a_01`, `Y3c_01`: small model "İm!" duyuyor. Kullanılmıyor.
- `Y3b_01`: replik iki kez söylenmiş ("İyiyim! İyiyim!"). Metin aynen kalsın diye yalnız biri kesilerek kullanıldı (ikinci ve daha net olanı).
- `Y2_sec`: "Oh!" duyuluyor (hedef "Iıh!"). Kesim olduğu için tını sınırlı.
- `Y0a/Y0b` (esneme), `E05*`: sözsüz, puan anlamsız.
- Diğer seçilen tüm replikler Whisper medium ile metne birebir uyuyor.

## 7. Kullanıcının dinleyip onaylaması gerekenler (ben dinleyemiyorum)
1. **A05d** (yeni öfkeli terlik lafı): öfke düzeyi ve annenin tınısı A04 ile tutarlı mı? Yedek A05c.
2. **Y1**: fısıltı korku ve hayranlığı birlikte taşıyor mu? Kıkırdamalı yedek daha mı komik?
3. **Y2** kesimi ("ah/oh" tınısı) "Iıh!" yerine geçer mi?
4. **Y3/Y4** kapı arkası filtreleri: boğukluk ve mesafe inandırıcı mı?
5. **Y0** esneme doğal mı?
6. Yeni efektler, özellikle `el_bocek_ezme` (ÇAT komik ve kuru mu), `el_kapi_arkasi_gum`, `el_kulak_cekme` (çizgi film gıcırtısı fazla mı?), `el_uzun_koklama` (Whisper burada kıkırdamaya benzer bir ses duydu).
7. `muzik/b7_sofra_komik`: anne-kız samimiyetine uyuyor mu? `banyo_komik` ile aynı ailede mi?
8. Akşam ortamları (`b7_banyo_aksam`, `b7_salon_aksam`): uğultu fazla mı?

## Telaffuz notu (öneri, metin değişmedi)
Yok. "gelicemm" ve "ölüyodummm" doğru okunuyor; Whisper yazıya dökerken normalleştiriyor.

## Dosyalar
- Yeni replikler: `dizi-studio/public/voice/724-07-yeni/` (`kaynak_v4.json`, `manifest.json`, `secim.json`, `*_01.mp3` ham çekimler, `sec/` seçilmiş kesimler)
- Yeni efektler: `public/ses/efekt/el_{bocek_ezme,kucuk_bocek,deste_salla,para_sayma,deste_kapma,cep_hisirti,tabak_tak,catal_tik,kapi_arkasi_gum,otomatik_isik,havlu,damla,su_tukurme,terlik_surume,kulak_cekme,anahtar_kap,uzun_koklama,asili_nota,kart_pop,musluk,dil_saplatma}.mp3`
- Türevler: `public/ses/efekt/b7_{oda_kapi_kut,kapi_arkasi_dolap,hayal_zincir,musluk_kapat,otomatik_sonme,otomatik_isik_kapi,tabak_uzak,merdiven_kosu}.mp3`, `public/ses/ortam/b7_{banyo_aksam,salon_aksam,musluk_dongu}.mp3`
- Müzik: `public/ses/muzik/b7_sofra_komik.mp3`
- Üretici: `dizi-studio/tools/b7_ses.py` (ücretsiz türevler; yeniden çalıştırılabilir). Katalog ve `LISANSLAR.csv` güncellendi.
