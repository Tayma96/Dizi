Görüntü ve sanat yönetmeni olarak, "Bölüm 8 (YENİ), Parça 1" için çekim planını ve istenen varlıkları hazırladım.

---

## Bölüm 8 (YENİ), Parça 1: Çekim Planı

**Mekân:** Market (kasa, sol duvar kapı, arka-sol DEPO kapısı)
**Karakterler:** Ece (müşteri tarafında, sivil kıyafet), Sabri (kasada), Mert (yeni karakter, market çalışanı)
**Işık:** Marketin genel aydınlatması beyaz floresan ışık. Depo kapısından Mert'in girişi sırasında daha sıcak bir ışık süzülecek.
**180 Derece Kuralı:** Ece müşteri tarafında (kamera sağ tarafında), Sabri kasa tarafında (kamera sol tarafında). Mert depodan çıktığında, sahnenin kamera eksenine göre Ece'nin arkasında ve solunda (Sabri'nin yanında) yer alacak. Kamera bu ekseni koruyacak.

| No | Süre (sn) | Ölçek     | Açı     | Kamera Hareketi | Kim   | Eylem/Mimik                                                                                                              | Hangi Replik                                                                                                                                                                                                                                                |
|----|-----------|-----------|---------|-----------------|-------|--------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | 2.5       | yakın     | normal  | sabit           | Ece   | Gergin, korkulu ama suçlayıcı bir ifadeyle Sabri'ye bakar.                                                               | "ölüme gönderdin beni abi"                                                                                                                                                                                                                                  |
| 2  | 4.0       | orta      | normal  | sabit           | Sabri | Sakin, bilgece, hafif bıkkın bir ifadeyle Ece'ye bakar. Elini kasada tutar.                                              | "kurallara uy ece, gayet başarılıydın sadece o önlüğü attığın sövmen 3. Kuralı bozdu, zamanlamayla kurtardın."                                                                                                                                            |
| 3  | 3.5       | orta      | normal  | yaklas          | Sabri | Ciddi ve yönlendirici bir ifadeyle konuşur, "profesyonelce" kelimesinde kamera hafifçe yaklaşır.                          | "Ha kurallara uyup profesyonelce çalışırsın sorunsuz bi gece geçer"                                                                                                                                                                                         |
| 4  | 2.0       | geniş     | normal  | sabit           | Ortam | Arka-sol depo kapısı yavaşça açılır. Kapıdan hafif bir uğultu sesi ve sıcak, yumuşak bir ışık süzülür.                  | (sessiz) "Tam o anda depo kapısı açılır."                                                                                                                                                                                                                   |
| 5  | 2.0       | çok_yakın | üst     | sarsinti        | Ece   | Gözleri kocaman açılmış, şok ve korku içinde yüz ifadesi. Eli anlık olarak kalbine gider. Kısa bir titreme.             | "aaaa yine miii"                                                                                                                                                                                                                                            |
| 6  | 3.0       | orta      | normal  | kaydir          | Mert  | Depodan cool ve karizmatik bir duruşla Mert çıkar, depo ışığı onu vurgular. Kamera, Mert'in çıkışını takip eder.        | (sessiz) "Depodan çok yakışıklı aşırı yakışıklı mavi gözlü kumral kahverengi saçlı bir erkek çıkar. Adı Mert."                                                                                                                                            |
| 7  | 3.0       | çok_yakın | normal  | sabit           | Ece   | **AŞIK BAKIŞ GAG:** Ece donakalır, ağzı hafif açık, gözleri parıldar, yanakları kızarır. Saçları yavaşça dalgalanır. Mert'ten yansıyan yumuşak bir parıltı Ece'nin yüzünü aydınlatır. Arka plan bulanıklaşır ve doygunluğu azalır. Kameranın içsel `slowMotion` efekti (0.25x hız) uygulanır. | (sessiz) "Ece bir an donakalır, rüzgâr sesi ve cırcır böceği sesi gelir 2-3 saniyeliğine, âşık olduğu belli oluyordur."                                                                                                                                |
| 8  | 3.0       | orta      | normal  | sabit           | Mert  | Kendinden emin, karizmatik bir ifadeyle konuşur.                                                                         | "Abi depoyu topladım, malzemeleri yerleştirdim"                                                                                                                                                                                                             |
| 9  | 1.5       | yakın     | normal  | sabit           | Ece   | Hala sersemlemiş, aptal âşık bir ifadeyle konuşur, gözleri Mert'e dönük (kadraj dışı).                                  | "onee laan"                                                                                                                                                                                                                                                 |
| 10 | 2.0       | iki       | normal  | sabit           | Sabri | Mert'e memnuniyetle dönerek konuşur, Mert başını sallar. Ece kadrajda değildir, ancak Sabri'nin bakışı Ece'nin yönündedir. | "Aferin Mert eline sağlık"                                                                                                                                                                                                                                  |
| 11 | 4.0       | iki       | normal  | sabit           | Sabri | Sabri Ece'ye döner ve Mert'i tanıtır. Ece önde, şaşkın ve hayran bakışlarla dinler.                                       | "Ece bu Mert, bu gece vardiyasında o olacak. Erkenden gelip yardım etmek istemiş sağ olsun."                                                                                                                                                            |
| 12 | 2.5       | yakın     | normal  | sabit           | Ece   | Gözünü Mert'ten (kadraj dışı) ayırmadan, hala aptal âşık bir ifadeyle önlüğünü sorar. Hafifçe kıkırdar.                  | "Benim önlüğüm nerde abi"                                                                                                                                                                                                                                   |

---

## Mert Karakteri İçin cast.json Girdisi Önerisi

`src/studio/cast.json` dosyasına eklenmek üzere Mert karakterinin görünüm bilgileri:

```json
"mert": {
    "id": "mert",
    "name": "Mert",
    "role": "market_calisani",
    "voice": "cool_karizmatik_erkek",
    "gender": "male",
    "age": 22,
    "build": "fit",
    "skin": "normal",
    "skinShade": "light",
    "iris": "blue",
    "hair": {
        "style": "orta_kisa_daginik",
        "color": "kahverengi",
        "shade": "kumral"
    },
    "facialHair": "yok",
    "outfit": {
        "type": "casual",
        "top": "tshirt",
        "topShade": "beyaz",
        "bottom": "jeans",
        "shoes": "sneakers"
    },
    "blush": 0
}
```

*   **`voice`**: "cool_karizmatik_erkek" değeri, ses yönetmeni tarafından seçilecek seslendirme sanatçısı için bir referanstır.
*   **`age`**: Yakışıklı ve genç bir market çalışanı imajına uygun olarak 22 olarak belirlenmiştir.
*   **`outfit`**: İlk girişi için "casual" (beyaz tişört ve kot pantolon) olarak düşünülmüştür, market önlüğü giymeden önce bu şekilde görünecektir.

---

## Rapor

**Değiştirilen JSON Alanları:**
*   `cast.json`: Yeni karakter "mert" için girdi önerisi eklendi.
*   `beats` bölümü (`724-08y-p1.json` içinde): Yukarıdaki çekim planına göre `shot` ve `look` parametreleri düzenlenecek, özellikle "AŞIK BAKIŞ GAG" için görsel efekt parametreleri eklenecektir (bu, `look` objesi altında `name` ve `params` ile tanımlanacaktır).

**Eklenen Varlıklar:**
*   **Karakter:** Mert (yeni karakter). `src/studio3d/Character3D.tsx`'te oluşturulması gereken 3D model, saç ve kıyafet varlıkları.
*   **Görsel Efekt:** Aşık bakış gag'i için özel efekt seti (`slowMotion`, `hairWaveIntensity`, `sparkleStrength`, `bgBlur`, `bgDesaturate`, `bgWarmth`, `blush` artışı, `goz` ve `agiz` durumları). Bu efektler sahne zaman çizelgesine uygun olarak karakterin `look` parametreleri veya sahnenin genel `look` alanında tanımlanacaktır.

**Kontrol Karelerinin Yolu:**
Yeni varlıklar (Mert karakteri ve aşık bakış gag'i) üretildikten sonra aşağıdaki kontrol kompozisyonlarından kareler alınmalıdır:
*   `Kadro3D`: Mert'in genel görünümünü ve oranlarını kontrol etmek için.
*   `Duygular3D`: Mert'in temel yüz ifadeleri ve Ece'nin "asik_bakis" ifadesini kontrol etmek için.
*   `Jestler3D`: Mert'in duruşu ve "cool" jestlerini kontrol etmek için.
*   `Donus3D`: Mert'in 360 derece tutarlılığını kontrol etmek için.
*   `Mekanlar3D`: Depo kapısından gelen ışığın ve market ortamıyla uyumunu kontrol etmek için.

**Görsel Riskler:**
*   **S7 (Aşık Bakış Gag):** Efektlerin (slow-motion, saç dalgalanması, parıltı, arka plan bulanıklığı) abartı seviyesi kullanıcının tercihine bırakılmıştır. İlk denemede belirgin ancak komik bir etki hedeflenmiştir; geri bildirimlere göre yoğunluğu ayarlanabilir. `slowMotion` süresi 3 saniye olarak planlanmıştır, bu da normal sürenin 0.75-1 saniyesi civarında olması anlamına gelir; ancak efektin kendisi bu süreyi dolduracaktır.
*   **Depo Işığı:** Depodan gelen sıcak ışığın marketin floresan ışığıyla çatışmaması ve Mert'i "kahramanvari" bir şekilde vurgulaması için renk sıcaklığı ve yoğunluk ayarı dikkatlice yapılmalıdır.

---