## Bölüm 8 (YENİ), Parça 1 Ses Planı

**Genel Miks Hedefleri:** Diyaloglar −16 LUFS, ortam sesleri −20 LUFS (volume 0.4-0.6), efektler duruma göre, müzik otomatik ducking ile diyalog altında −7 dB. Son master −14 LUFS, tepe ≤ −1 dBTP.

---

### Karakter Sesleri ve Mert İçin Yeni Ses Seçimi

*   **Ece:** Nazlı Yeni sesi (`Ece_Yeni`)
*   **Sabri:** Nihat sesi (`Sabri_Nihat`)
*   **Mert için Yeni Erkek Ses Seçim Kriterleri:**
    *   **Ses Tınısı:** Hafif bas tonlu, sıcak ve çekici. Genç (20-25 yaş aralığı) ve olgun arasında dengeli.
    *   **Konuşma Tarzı:** Kendinden emin, sakin, cool bir ritimle konuşmalı. Karizmatik bir etki yaratmak için ses tonlamaları doğal ve akıcı olmalı.
    *   **Telaffuz:** Standardize edilmiş, net ve akıcı Türkçe telaffuzu olmalı, bölgesel ağız belirtisi olmamalıdır.
    *   **ElevenLabs Karşılığı (Öneri):** ElevenLabs'ın genç erkek seslerinden, cool ve karizmatik duruşu olan bir seçeneğin `oyuncu-sec` aracıyla kullanıcıya sunulması gerekmektedir. Kullanıcının onayı ile `ata` komutu kullanılacaktır.

---

### Replik Planı

| Replik Metni                                                                                                   | Karakter | ElevenLabs v3 Duygu Etiketi   | Okuma Notu                                                                                                                                                                                                                                                                 | Çekim Sayısı Önerisi | Kredi Tahmini |
| :------------------------------------------------------------------------------------------------------------- | :------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------- | :------------ |
| "ölüme gönderdin beni abi"                                                                                     | Ece      | `[sad]` veya `[sarcastic]`    | Hafif sitemli, kırgın ama aynı zamanda yaşadığı absürtlükle kendi kendine alay eden bir tonda. Cümlenin sonunda hafifçe uzatarak vurgu yapılabilir.                                                                                                                         | 1                    | 18            |
| "kurallara uy ece, gayet başarılıydın sadece o önlüğü attığın sövmen 3. Kuralı bozdu, zamanlamayla kurtardın." | Sabri    | `[neutral]`                   | Açıklayıcı, huysuz ama olayları özetlerken sakin ve profesyonel bir ton. Hafif bir sitem içerebilir. Kısa bir nefes duraklaması veya virgül sonrası kısa bir duraklama.                                                                                                         | 1-2                  | 95            |
| "Ha kurallara uyup profesyonelce çalışırsın sorunsuz bi gece geçer"                                            | Sabri    | `[neutral]`                   | Önceki cümlenin devamı niteliğinde, didaktik ve uyarıcı ama yine sakin bir ton.                                                                                                                                                                                             | (devam)              | 80            |
| "aaaa yine miii"                                                                                               | Ece      | `[fearful]`                   | Ani bir irkilme ve korkuyla çıkan ses, yüksek sesli ve kısa bir çığlık gibi. Uzatarak (a-a-a-a gibi).                                                                                                                                                                      | 1                    | 12            |
| "Abi depoyu topladım, malzemeleri yerleştirdim"                                                                | Mert     | `[neutral]`                   | Kendinden emin, rahat, cool ve karizmatik bir tonla. Çok vurgu yapmadan, doğal bir akışta.                                                                                                                                                                                 | 1                    | 40            |
| "onee laan"                                                                                                    | Ece      | `[excited]`                   | Şaşkınlık ve hayranlıkla karışık, aptal âşık bir tonda. Kelimeyi uzatarak, ağızda geveler gibi.                                                                                                                                                                            | 1                    | 9             |
| "Aferin Mert eline sağlık"                                                                                     | Sabri    | `[neutral]`                   | Mert'e yönelik kısa bir onaylama ve memnuniyet ifadesi.                                                                                                                                                                                                                    | 1                    | 23            |
| "Ece bu Mert, bu gece vardiyasında o olacak. Erkenden gelip yardım etmek istemiş sağ olsun."                   | Sabri    | `[neutral]`                   | Ece'ye Mert'i tanıtırken her zamanki huysuz ama bilgilendirici tonunda. Cümlenin sonuna doğru hafifçe yumuşak.                                                                                                                                                               | (devam)              | 110           |
| "Benim önlüğüm nerde abi"                                                                                      | Ece      | `[neutral]`                   | Soru sorar gibi ama aslında Mert'ten gözünü ayırmadan, dikkati Mert'te olan, flörtöz ve hafifçe dalgın bir ton.                                                                                                                                                            | 1                    | 22            |
| **Toplam Tahmini Kredi:**                                                                                      |          |                               |                                                                                                                                                                                                                                                            | **10-12 Çekim**      | **409**       |

---

### Efekt, Ortam ve Müzik Planı

*   **Ortam Sesleri (Sahne Boyunca Sürekli):**
    *   `ambience/oda_tonu` (volume 0.5)
    *   `ambience/buzdolabi_ugultusu` (Yeni kaynak gerekiyorsa üretilmeli/bulunmalı, volume 0.4)
    *   `ambience/floresan_ugultusu` (Yeni kaynak gerekiyorsa üretilmeli/bulunmalı, volume 0.3)
    *   **Miks Notu:** Bu ortam sesleri diyalogların altında kalacak şekilde −20 LUFS seviyesinde karıştırılacak. Dijital sessizlikten kaçınılacak.

*   **Efektler:**
    *   **`efekt/kapi_acilma`**: Depo kapısı açıldığında (Sabri'nin ikinci repliği ile Ece'nin "aaaa yine miii" repliği arasında). Kapının eski, ağır bir kapı olduğu hissi verilebilir.
    *   **`ambience/ruzgar`**: Ece Mert'i gördüğünde 2-3 saniye boyunca arka planda hafifçe yükselen (volume 0.2'den 0.4'e), sonra tekrar alçalan rüzgâr sesi.
    *   **`ambience/gece_cekirge`**: Ece Mert'i gördüğünde 2-3 saniye boyunca rüzgâr ile eş zamanlı duyulan cırcır böceği sesi. (volume 0.3)
    *   **Öneri: Romantik Müzik Vurgusu (Yeni Sentez/PD):** Ece'nin Mert'i gördüğü anda (rüzgâr ve cırcır böceği seslerinin başlamasıyla eş zamanlı) çalacak, 1-1.5 saniyelik, abartılı, duygusal bir yaylı veya piyano motifi. Örneğin, Musopen'den alınmış veya sentezlenmiş klasik bir romantik parça fragmenti (`muzik/romantik_kisa_sting`).
    *   **`efekt/b8_plak_kisa`**: Romantik müzik vurgusunun hemen ardından veya Mert'in repliğinden sonra Ece'nin "onee laan" demeden önce komik bir kesik efekti olarak kullanılabilir (0.38 sn). Bu, Ece'nin aptal âşık halinin abartılılığını vurgular.

*   **Zamanlama ve Miks Seviyeleri:**
    *   Diyaloglar: −16 LUFS.
    *   Ortam: −20 LUFS (belirtilen volume seviyeleri ile).
    *   Efektler: Diyalogları ezmeyecek, ancak duyulabilir ve etkili olacak seviyede. Depo kapısı ani ve belirgin. Rüzgar/cırcır böceği ortamın üzerine hafifçe çıkar. Romantik vurgu kısa ve anlık tepe noktası yapar.
    *   Mastering: Tüm ses öğeleri mix edildikten sonra −14 LUFS ve tepe −1 dBTP olacak şekilde render alınacaktır.

---

### Kontrol Edilmesi Gerekenler (Kullanıcı Onayı Bekleniyor)

*   Mert karakteri için seçilecek **ElevenLabs sesi**.
*   Önerilen **romantik müzik vurgusunun içeriği ve tınısı** (yeni bir sentez mi, mevcut bir parçadan alıntı mı).