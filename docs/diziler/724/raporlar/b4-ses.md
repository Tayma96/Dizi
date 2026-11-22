# 7/24 · Bölüm 4: ses yönetimi planı (22 Kasım 2026)

Hazırlayan: ses yönetmeni. **Hiç kredi harcanmadı.** Yalnızca kuru çalıştırma yapıldı, `--onayla` kullanılmadı. Kullanıcının replik metinlerine ve noktalamasına dokunulmadı. Aşağıdaki `okunus` ve `tags` alanları yalnızca seslendirmede kullanılır, altyazıya girmez. Doğaçlama replik önerilmedi.

Dayanak belgeler: `bolumler.md` (B4 metni ve kullanıcı kararları), `raporlar/b4-senarist.md`, `bible.md`, `.claude/skills/elevenlabs-seslendirme/SKILL.md`, `tools/elevenlabs.py`.

---

## 0. Kısa karar özeti
| Konu | Karar |
|---|---|
| Fısıltı ("…seni seçmiş") | B3'teki kayıt yeniden kullanılır (`724-03/l_01`). **0 kredi.** |
| "sıçarım işinedeee marketinedeee" | ElevenLabs v4, tek üretim. Son "dee", depodaki "ece" sesiyle kesilir (ücretsiz ffmpeg kırpması). |
| Depodaki kalın "ece" | Sabri'nin B1'deki depo kaydından ("Ece… ben Sabri. Gel.") ffmpeg ile üretilir. **0 kredi.** Denendi, Whisper "Ece" duyuyor. |
| "vallahi bastım vallahi bastım kaç kaç kaç kaç" | **Tek parça, tek TTS üretimi, tek nefes** (kullanıcı düzeltmesi). Görüntü bu sese oturur. Kaçlar ayrı üretilmez. |
| "Nereye gidiyosun kızım." | Normal Sabri sesi, kuru (efektsiz) üretilir. Nokta korunur, düz tonlama. |
| Efektler | Çoğu mevcut ya da ücretsiz sentez/türev. Yutkunma ve ambalaj hışırtısı için ElevenLabs SFX yalnızca yedek (onay gerekir). |
| Kredi (araç tahmini, üst sınır) | 1 tam çekim 208 kr. Yeniden çekim payıyla 464 kr. Gerçek harcama geçmişte tahminin %40'ı çıktı: ≈ 85 / 185 kr. |

---

## 1. Replik replik seslendirme tasarımı

Genel ayar: model `eleven_v4` (dizinin tüm Ece/Sabri replikleri bununla üretildi, tını sürekliliği için değiştirmiyoruz). Dizinin yerleşik yöntemi korunur: `emotion: "notr"` (otomatik etiket eklenmez) ve duygu tamamen `tags` ile verilir. Etiketler de kredi harcar (her karakter ≈ 1 kredi), bu yüzden kısa tutuldu.

Ece'nin karakter kimliği (`ece724` / `ece_sivil`) fark etmez: hepsi aynı ses (Nazlı Yeni, `o9DOmAyPjfFu8AfoFAnM`), önbellek anahtarı karakter adına değil ses kimliğine bağlı.

### 1.1 Açılış fısıltısı · iri724 · YENİDEN KULLANIM (0 kredi)
- Metin aynen: `Depodakine selam söyle. Bu gece seni seçmiş.`
- `724-03` manifestindeki `l_01` kaydı (anahtar `011602c02885`, 3,58 sn) B4 manifestine yeni replik kimliğiyle kopyalanır. `file` alanı `voice/724-03/l_01.mp3` olarak kalabilir.
- Şart: B4 JSON'unda bu vuruşun `text`, `emotion: "notr"`, `tags: "[leaning in, whisper, menacing]"` alanları B3 ile **birebir aynı** olmalı. `hiz`/`fx` eklenmemeli. Yoksa araç repliği yeniden üretmeye kalkar (tahmini 76 kr).
- Yalnız "Bu gece seni seçmiş." duyulsun istenirse: aynı dosya 2,00. saniyeden kesilir (ücretsiz). Ama metin değişeceği için önbellek eşleşmez. O durumda 1.3'teki "elle manifest" yöntemi uygulanır.
- B3'teki gibi sonuna `efekt/el_korku_vurus` eklenir, tekrar olmasın diye daha kısık (0,45).

### 1.2 Ece · "sıçarım işinedeee marketinedeee"
| Alan | Değer |
|---|---|
| `text` (altyazı, aynen) | `sıçarım işinedeee marketinedeee` |
| `tags` (A, birincil) | `[fed up, ranting, whiny angry]` |
| `tags` (B, yeniden çekim) | `[exasperated, complaining, angry whine]` |
| `okunus` (A) | `sıçarım işinedeeee… marketinedeeeeee!` |
| `okunus` (B) | `sıçarım işinedeeee marketinedeeeeeee` (duraksamasız, tek soluk) |
| `hiz` | yok (1.0). Sitem uzatması hızlanmamalı. |
| Stabilite | 0.0 "Creative" önerilir (bkz. 1.6). Mevcut araçla 0.5. |

- **Neden bu okunuş:** Uzun "e"ler TTS'e uzatmayı, sondaki "!" yükselen sitemi, "…" ise "işine deee… marketine deee" ritmindeki kısa sitem duraksamasını verir. Sözcük sayısı (3) altyazıyla aynı kaldığı için kelime zamanları altyazıya doğru eşlenir. Bu bilinçli olarak korundu: `words_from_alignment` sözcük sayısı tutmazsa okunuş yazımını altyazı kelimesi olarak kullanır.
- **Son "dee" bilerek daha uzun yazıldı (7 e).** Bunun nedeni 2. bölümdeki kesme: son "e" bitmeden depodaki "ece" sesi girmeli (senarist öneri 14).
- **Kesme (ücretsiz):** Üretimden sonra dosya, son "dee"nin ortasında (yaklaşık sondan 0,25 sn önce) 50 ms'lik bir sönümle kesilir:
  `ffmpeg -i c_xx.mp3 -af "atrim=0:<kesme_sn>,afade=t=out:st=<kesme_sn-0.05>:d=0.05" ...`
  Ardından manifestteki `duration` güncellenir. Anahtar aynı kaldığı için önbellek bozulmaz. Vuruşta `gapAfter: 0` olur; "ece" hemen arkasından girer. Ece'nin öfkesi bir irkilmeyle yarıda kalmış gibi duyulur.
- Kontrol: Whisper büyük ihtimalle "işine de" yazacak. `ses_kontrol.py` bunu KONTROL ET diye işaretleyebilir. Uzatmadan kaynaklandığı için beklenen bir sonuç. Kulakla dinlenmeli.

### 1.3 Depodan kalın "ece" · ÜCRETSİZ (ElevenLabs yok)
**Kaynak:** `public/voice/724-01/c_15.mp3`. Bu, B1'de depodaki şeyin Sabri sesiyle söylediği "Ece… ben Sabri. Gel." repliği; "Ece…" sözcüğü 0,076-0,756 sn arasında. Depodaki sesin imzası böylece B1'den beri aynı kalır. İlk izlemede canavar sesi gibi gelir, ikinci izlemede Sabri'nin tınısı fark edilir (senarist öneri 6).

**Denenmiş zincir** (scratchpad'de üretildi, Whisper small ile kontrol edildi):
```bash
# 1) sözcüğü kes
ffmpeg -y -i public/voice/724-01/c_15.mp3 -ss 0.02 -t 0.80 -af "afade=t=out:st=0.70:d=0.10" kaynak.wav
# 2) ana katman: -4 yarım ton, %15 yavaş, formant korunur; alt katman: bir oktav aşağı (derinlik); karanlık depo yankısı
ffmpeg -y -i kaynak.wav -filter_complex \
 "[0:a]rubberband=pitch=0.79:tempo=0.85:formant=preserved,lowpass=f=6000,highpass=f=60[a];\
  [0:a]rubberband=pitch=0.395:tempo=0.85,lowpass=f=1500,volume=0.25[b];\
  [a][b]amix=inputs=2:normalize=0,apad=pad_dur=1.2,aecho=0.8:0.5:60|130|210:0.28|0.18|0.10" depo_ece.wav
# 3) seviye: -17 LUFS (diyalogdan biraz geride, depo uzaklığı)
```
| Sürüm | Ayar | Whisper (ipucusuz) | Not |
|---|---|---|---|
| **v3 (önerilen)** | −4 yt, tempo 0.85, alt katman 0.25 | "Ece" | Okunur, derin, Sabri tınısı seziliyor |
| v1 (daha korkunç) | −5 yt, tempo 0.80, alt katman 0.30 | "A.J." (ipucuyla "Ece") | Daha canavarımsı, okunurluk düşük |
| v2 (en karanlık) | −6 yt, formant kayık, alt katman 0.35 | "HH" | Fazla bozuk, önerilmez |

Deneme dosyaları: `/tmp/claude-0/-home-user-Dizi/b07199cd-cb6f-51e2-8731-5eac438d8fb0/scratchpad/ece/v1.wav`, `.../ece/v3.wav`, `.../ece/depo_ece.wav` (geçici klasör; kalıcı dosya, onaydan sonra `public/voice/724-04/` altına üretilir).

**Motora bağlama (altyazıda `ece` görünsün diye replik olarak):**
- Vuruş: `who: "sabri"`, `text: "ece"`, `emotion: "notr"`, `offscreen: true`, `label: "DEPO"`. `tags` yok.
- Dosya `public/voice/724-04/<id>.mp3` olarak yazılır. Manifest kaydı elle eklenir: `duration`, `words: [{"w":"ece","start":0.05,"end":0.95}]`, `mouth: []` (konuşan ekranda değil).
- **Önemli:** `key` alanı aracın hesapladığı anahtarla aynı olmalı. Yoksa `seslendir` bu satırı "üretilecek" sayar ve Sabri'nin TTS'iyle üzerine yazar (kredi + yanlış ses). Anahtar şöyle hesaplanır:
```python
import json, hashlib, sys; sys.path.insert(0, "tools"); import elevenlabs as E
ep = json.load(open("public/episodes/724-04.json")); vm = json.load(open("src/studio/sesler_elevenlabs.json"))
for l in E.lines_from_episode(ep):
    if l["id"] != "<ece_replik_id>": continue
    v = vm[l["who"]]; t = E.build_text(l, "eleven_v4")
    extra = "".join(f"|{k}={l[k]}" for k in ("hiz", "fx") if l.get(k))
    print(hashlib.sha1(f"el|eleven_v4|{v['voice_id']}|{json.dumps(v.get('ayar', {}), sort_keys=True)}|{l['emotion']}|{t}{extra}".encode()).hexdigest()[:12])
```
- Doğrulama: kuru `seslendir` çalıştırıldığında bu kimlik listede **görünmemeli**. Görünüyorsa `--onayla` verilmez.
- Bu yöntemle aynı satırı ElevenLabs'te üretseydik tahmini maliyet 16 kr olurdu. Ama aynı tınıyı bu kadar derin vermezdi ve B1 sürekliliği kaybolurdu.

### 1.4 Ece · "vallahi bastım vallahi bastım kaç kaç kaç kaç" · TEK ÇEKİM
**Kullanıcı kararı (kesin):** Tek parça, kesintisiz, tek nefeste; tek TTS üretimi. Görüntü sese uyar.

| Alan | Değer |
|---|---|
| `text` (altyazı, aynen) | `vallahi bastım vallahi bastım kaç kaç kaç kaç` |
| `tags` (A, birincil) | `[panicked, fast, breathless, crying-laughing]` |
| `tags` (B, yeniden çekim) | `[terrified, rushed, out of breath, whiny]` |
| `okunus` (A) | `vallahi bastım vallahi bastım kaç kaç kaç kaaaç!` |
| `okunus` (B, kaçlar birbirine yapışırsa) | `vallahi bastım vallahi bastım kaç! kaç! kaç! kaaaç!` |
| `okunus` (C, daha ağlamaklı) | `vallahi bastııım vallahi bastım kaç kaç kaç kaaaç!` |
| `hiz` | `1.15` (API sınırı 0.7-1.2) |
| Stabilite | 0.0 "Creative" önerilir (bkz. 1.6) |

- **Neden tek çekim doğru:** Panik komedisi nefesin kesintisizliğinden doğar. Parçalı üretimde her parçanın başında yeni bir "nefes alıp başlama" olur ve meme ritmi kaybolur. Kaçları tek tek üretip adımlara dizmek robotik, kopuk bir sonuç verir. Ayrıca her istekte etiketler yeniden ödenir.
- **Senkron ses → görüntü yönünde kurulur.** ElevenLabs karakter zamanlarından gelen `words` dizisi her "kaç"ın başlangıç saniyesini verir. Görüntü yönetmeni şu işaretleri buna göre koyar:
  - `words[0].start`: Ece kasanın arkasından çıkar (1. "vallahi").
  - `words[2].start` civarı (2. "vallahi"): kasaya bacağı takılır, sendeler. Ses durmaz. Sendeleme sesi efektlerden gelir (bkz. 4).
  - `words[4..7].start`: dört koşu adımı. Her "kaç" bir ayak basışı.
  - `words[7]` ("kaaaç!"): kapıya varış ve otomatik kapı ding-dong'u.
- **Hedef ritim:** Toplam 2,4-3,0 sn. Kaçların başlangıçları arası 0,28-0,35 sn (yaklaşık 180-200 adım/dk, panik koşusu). Son "kaaaç" 0,35-0,5 sn. Kaçlar arasında boşluk yok ya da çok kısa.
- **Ücretsiz rötuş (gerekirse, tek çekim hissi bozulmadan):**
  - Kaçlar arasında 60 ms'den uzun bir sessizlik varsa, yalnızca o sessizlik kısaltılır (sözcük içine asla kesme yapılmaz). Böylece aralıklar eşitlenir.
  - Bütün satır 3,3 sn'den uzunsa `rubberband=tempo=1.1` (perde korunur) uygulanır, manifestteki `words` ve `mouth` zamanları 1,1'e bölünür.
  - İkisi de manifest anahtarını değiştirmez. Betiği ben yazabilirim.
- **Yeniden çekim ölçütü:** Kaçlar "kaçkaçkaç" diye birbirine yapışırsa, gülme yerine düz okuma çıkarsa ya da "bastım" yanlış vurgulanırsa → okunuş B ya da etiket B ile yeni çekim.
- **Özgünlük:** Orijinal meme kaydı kullanılmaz. Ritim yalnızca bir gönderme. Ses, nefes ve ağlamaklı-gülünç renk Ece'ye ait (Nazlı Yeni sesi). Ece'nin B3'teki "Ama ölmek istemiyorm yaaa…" sızlanmasının bir uzantısı gibi duyulmalı.

### 1.5 Sabri · "Nereye gidiyosun kızım."
| Alan | Değer |
|---|---|
| `text` (aynen) | `Nereye gidiyosun kızım.` |
| `tags` (A) | `[calm, low, unhurried]` |
| `tags` (B) | `[calmly, tired, flat]` |
| `okunus` | Gerekmez. Nokta korunur: soru tonlaması değil, düz bir cümle. Tekinsizlik buradan gelir. |
| `fx` | **Yok** (kuru üretim). Bkz. 3. |
| `hiz` | 1.0 (ya da 0.95) |

- Ses, B1-B3'teki gündelik Sabri sesi. Dinleyicinin ilk tepkisi "ah, sadece Sabri" rahatlaması olmalı, ardından dehşet gelir.
- Kullanıcı finalde ayrıntı olarak (a) çikolata ambalajını seçti. Senaristin (d) önerisi olan "altında kısık 'ece' yankısı" seçilmedi, eklenmiyor.

### 1.6 Kod önerisi (genel yönetmen onayına): repliğe özel stabilite
- **Sorun:** `elevenlabs.py` v3/v4 için stabiliteyi her replikte 0.5 ("Natural") sabitliyor. Panik ve sitem için 0.0 ("Creative") çok daha canlı sonuç verir.
- **Neden karakter ayarı kullanılmamalı:** `ece724` karakterinin `ayar` alanına stabilite yazmak bütün eski Ece repliklerinin önbellek anahtarını bozar. Eski bölümlerde yeniden çalıştırılan `seslendir` gereksiz kredi harcar.
- **Öneri:** Repliğe isteğe bağlı bir `"stab"` alanı eklemek:
  - `lines_from_episode` içinde bu alanı taşımak.
  - Anahtar hesabındaki `extra` listesine eklemek: `("hiz", "fx", "stab")`.
  - `vs.update(...)` satırından sonra `if l.get("stab") is not None: vs["stability"] = float(l["stab"])` eklemek.
- **Uyarı:** v3 yalnızca 0.0 / 0.5 / 1.0 kabul eder. v4 için de aynı değerler kullanılmalı.
- Değişiklik yapılmazsa: plan 0.5 ile de çalışır. Yalnızca etiketlerin işi biraz artar.

### 1.7 Yeniden çekim tuzağı (önemli)
- Araç her isteğe sabit bir tohum (`seed`) gönderiyor ve bu tohum anahtardan türetiliyor. Hiçbir şey değiştirmeden `--yeniden <id>` çalıştırmak **büyük ihtimalle neredeyse aynı çekimi tekrar satın almak** demektir.
- Gerçekten farklı bir çekim için etiket ya da okunuş değişkenine (A→B) geçilmeli. Bu, anahtarı ve tohumu değiştirir.
- Yeniden çekim aynı dosyanın üzerine yazar. Karşılaştırma yapılacaksa önceki mp3 yeniden üretimden önce başka bir yere kopyalanmalı.

---

## 2. "vallahi bastım" yapısı: karar
- **Tek çekim.** Kullanıcı düzeltmesiyle kesinleşti. İki parçalı plan ve kaçları ayrı üretip adımlara dizme fikri iptal.
- Senkron yönü değişti: ses sabit, görüntü (çıkış, takılma, dört adım, kapıya varış) ElevenLabs kelime zamanlarına göre dizilir.
- Efektler (takılma, adımlar, ding-dong) aynı vuruşun `sfx` listesine `at` değerleriyle, kelime zamanlarına göre konur. Üretimden sonra manifestten okunup ben yerleştirebilirim.

---

## 3. Kalın "ece" → normal Sabri geçişi
Fikir şu: depodaki ses ıslak, derin, uzak ve "canavar"; finaldeki ses kuru, yakın ve sıradan. İkisinin aynı tınıdan (Sabri) gelmesi bağlantıyı belirsiz ama hissedilir kılar.

1. **"ece" (korku zirvesi):** Perdesi düşürülmüş Sabri tınısı, alt oktav katmanı, 1,2 sn'lik karanlık depo yankısı. Kuyruğu bir sonraki sessizlik sahnesine taşar (motor sesi vuruştan sonra 6 sn daha çalıyor). Yankı, buzdolabı uğultusunun kesildiği boşlukta asılı kalır.
2. **Sessizlik (gözler):** Uğultu kesilir, yalnız oda tonu kalır (bkz. 4).
3. **Meme (komik boşalma):** Ece'nin sesi kuru, yakın ve hızlı. Ortam sesi geri gelir.
4. **"Nereye gidiyosun kızım.":** İşlenmemiş, sakin Sabri. Ece kapıda, Sabri depo önünde, yani 8-10 m mesafe var. Gerekirse üretimden sonra hafif bir oda yansıması eklenir (ücretsiz, dosya üzerinde): `aecho=0.8:0.3:25|48:0.10|0.06,lowpass=f=7500`. Kuyruğu uzatan `apad` kullanılmaz.
   - `fx` alanı üretimde verilmez. `fx` anahtara girdiği için sonradan değiştirmek yeni kredi demektir.
5. Kaçışın sonundaki ding-dong ikinci tonunu bitirirken Sabri'nin cümlesi girer (4. "kaç"tan yaklaşık 0,5-0,6 sn sonra). Kapı "kurtuluş" diye çalar, ses onu keser.

---

## 4. Ses tasarımı: efektler, sessizlik, komik-korku dengesi

### 4.1 Varlık listesi
| Olay | Varlık | Durum | Seviye (`volume`) |
|---|---|---|---|
| Fısıltı sonu vuruşu | `efekt/el_korku_vurus` | VAR | 0.45 |
| (İsteğe bağlı, senarist #9) Adamın çıkışı | `efekt/el_market_adim` + `efekt/el_otomatik_kapi` + `efekt/el_dingdong` | VAR | 0.7 / 0.55 / 0.45 |
| **Yutkunma** (derin, duyulur, 1,5-2 sn) | `efekt/yutkunma` | **EKSİK → ücretsiz sentez.** Yapısı: dil-damak "çıt"ı (2-3 kHz, 5 ms) → 0,3 sn sonra boğaz "gulp"u (180→90 Hz düşen tok vuruş, 120 ms, 400-1200 Hz ıslak gürültü bandı) → hafif burun nefesi. Mevcut `efekt/yudum` su yudumu olduğu için uygun değil. **Yedek:** ElevenLabs SFX `el_yutkunma` (kuru tahmin 60 kr, onay gerekir). | 1.0 (yakın, kuru) |
| Önlüğü baştan çıkarma | `efekt/kumas_cikarma` | EKSİK → sentez (kumaş hışırtısı, 1,2 sn) | 0.6 |
| At kuyruğuna takılma (onaylı doğaçlama) | `efekt/kumas_cekistirme` | EKSİK → sentez: 3 kısa çekiştirme, saç lastiğinin gerilip sürtünmesi. Ece'nin sesi (efor homurtusu) eklenmez; yeni seslendirme kullanıcı onayı ister. | 0.6 |
| Buruşturma | `efekt/kumas_burusturma` | EKSİK → sentez (0,8 sn, yoğun kumaş sürtünmesi) | 0.7 |
| Fırlatma + yere düşüş | `efekt/kumas_firlatma` (küçük hava sesi) + `efekt/kumas_dusme` (yumuşak "pof") | EKSİK → sentez. `efekt/whoosh` sinematik ve fazla büyük kalır. | 0.4 / 0.7 |
| Depo kapısı açılır | `efekt/depo_kapi_kisa` | **TÜREV (ücretsiz):** B2 P3'te kullanılan `efekt/el_depo_kapi` dosyasının ilk 1,6 sn'si, sönümlü. Sürekliliği korur. Yedek: `efekt/kapi_gicirti` (BigSoundBank, CC0). | 0.6. "dee" kesilmeden 0,35 sn önce başlar. |
| Depodan "ece" | 1.3'teki ses | ücretsiz | replik (−17 LUFS) |
| Göz anı | Ortam: `ortam/oda_tonu`. İsteğe bağlı çok kısık `efekt/cinlama` | VAR | 0.12 / 0.05 |
| Kasanın arkasından çıkış (ayakkabı) | `efekt/ayakkabi_gicirti` | EKSİK → sentez (spor ayakkabı fayans gıcırtısı, 0,2 sn) | 0.5 |
| **Tezgâha takılma** | `efekt/tezgah_carpma` | EKSİK → sentez: incik tezgâha tok çarpar (ahşap/metal, 80-200 Hz), üstteki sakız standı ve kalemlik tıngırdar (2-5 kHz tıkırtılar), ayakkabı sürtünür. | 0.8 |
| Koşu adımları (4 "kaç") | `efekt/adim_kosu_1..4` | **TÜREV (ücretsiz):** gerçek kayıt `efekt/ayak_sesleri2` (BigSoundBank #0165, CC0) içinden 4 ayrı basış kesilir (başlangıçlar 0,66 / 1,25 / 1,81 / 2,49 sn). Koşu hissi için +2 dB ve daha kısa kuyruk verilir. Her biri bir "kaç"ın başında çalar. | 0.7 |
| Kapıya varış | `efekt/el_otomatik_kapi` + `efekt/el_dingdong` | VAR. Dizinin ding-dong motifi. Adamın çıkışında da kullanılırsa kurulum-ödeme olur: aynı zil bu kez "kurtuldum" der, ama Sabri'nin sesi keser. | 0.5 / 0.5 |
| Ece donar | `efekt/el_nefes_tutma` | VAR | 0.6 |
| Baş dönüşü (≤2 sn) | `efekt/el_kalp_yavas` + `efekt/riser` (bitişi Sabri'nin görüldüğü kareye denk gelir) | VAR | 0.5 / 0.35 |
| Sabri'nin parmaklarındaki çikolata ambalajı (kullanıcı kararı) | `efekt/ambalaj_hisirti` | EKSİK → sentez: seyrek, tiz plastik çıtırtılar (2-8 kHz). Ekranda olan fiziksel olayın sesi olmalı. **Yedek:** ElevenLabs SFX `el_ambalaj` (kuru tahmin 60 kr, onay gerekir). | 0.5 |
| Açığa çıkma | `efekt/el_korku_vurus` (ambalaj yakın planında) → kararma | VAR | 0.6 |
| Bitiş kartı | `muzik/jenerik_tema` | Motor bunu otomatik çalar (leitmotif). | 0.6 |

- Sentezler `tools/ses_724.py`'a (dizinin kendi sentez dosyası, `ses_kutuphanesi` yardımcılarıyla) eklenir. Katalog `public/ses/katalog.json`'a yazılır. Hepsi kendi sentezimiz, lisans sorunu yok.
- Türevler (`adim_kosu_*`, `depo_kapi_kisa`) için `LISANSLAR.csv`'ye "türev" satırı eklenir:
  - `adim_kosu_*`: kaynak BigSoundBank #0165, CC0.
  - `depo_kapi_kisa`: kaynak bizim önceki ElevenLabs SFX'imiz.
- **Not:** Bu oturumda `bigsoundbank.com` ağ geçidinde engelli (403). Yeni gerçek kayıt (ör. gerçek yutkunma) aranamadı. Bu yüzden sentez önerildi.

### 4.2 Sahne sahne ses haritası (yaklaşık süreler)
| # | Vuruş | Ses | Ortam | Müzik |
|---|---|---|---|---|
| 1 | Fısıltı (0-3,6 sn) | iri724 tekrar kullanım + korku vuruşu | `efekt/el_market_ortam` 0.32 | yok |
| 2 | (isteğe bağlı) Adam çıkar | Ağır adımlar, kapı, ding-dong | aynı | yok |
| 3 | Yutkunma (1,5-2 sn) | `yutkunma` 1.0 | aynı | yok |
| 4 | Önlük + rant (~4 sn) | Çıkarma → takılma (çekiştirme) → buruşturma → "sıçarım…dee" → fırlatma, düşüş. Depo kapısı son "dee"nin altında başlar. | aynı | yok |
| 5 | "ece" | Kalın ses; yankısı 6. sahneye taşar | aynı (kesmeye kadar) | yok |
| 6 | Gözler (1,5-2 sn) | **Ses boşluğu:** buzdolabı ve floresan uğultusu kesilir. Yalnız oda tonu ve "ece"nin yankı kuyruğu kalır. İsteğe bağlı çok kısık çınlama. Göz hareketine ses verilmez (korku anı, anime "çın" efekti yok). | `ortam/oda_tonu` 0.12 | yok |
| 7 | Meme koşusu (2,4-3 sn) | Tek çekim replik + ayakkabı gıcırtısı + tezgâh çarpması + 4 adım + kapı ve ding-dong | `el_market_ortam` 0.32 geri gelir ("dünya yeniden akıyor") | yok |
| 8 | "Nereye gidiyosun kızım." | Kuru Sabri, ding-dong'un kuyruğunun üstünde | aynı (diyalogda otomatik kısılır) | yok |
| 9 | Donma + baş dönüşü (≤2 sn) | Nefes tutma, kalp, riser | aynı, 0.25 | riser (efekt) |
| 10 | Sabri + ambalaj (1,5-2 sn) | Ambalaj hışırtısı → korku vuruşu → siyah | aynı | — |
| 11 | Bitiş kartı | jenerik_tema | — | jenerik (otomatik) |

- Ortam sesi B3'te hiçbir sahnede tanımlı değil (`724-03.json`'da `ambience` boş). Kural gereği B4'te her sahnede bir ortam katmanı olmalı. Dizinin standardı `efekt/el_market_ortam` 0.32 (B2 P1).
- Motor, ortam adı değiştiğinde 10 karelik (yaklaşık 0,33 sn) bir sönümle geçiş yapıyor. Göz sahnesine geçişte bu kısa sönüm uygundur.

### 4.3 Komik-korku dengesi (ilkeler)
- **Korku = az ve ıslak:** sessizlik, alçak frekans, uzun yankı, uzaktan gelen ses.
- **Komedi = dolu ve kuru:** yakın mikrofon, hız, ortam sesi tam, efektler net ve ritmik.
- **Bölümde fon müziği yok** (yalnızca finalde riser ve vuruş). Kaçların ritmi bu bölümün müziğidir. Altına müzik konursa kaçlar bulanıklaşır ve espri zamanlaması kayar. "Sahne başına en fazla bir müzik değişimi" kuralı da böylece kendiliğinden sağlanır.
- **En güçlü araç sessizlik:**
  - "ece"den sonraki 1,5-2 sn'lik ses boşluğu, gerilimi tam doldurur. Komik boşalma ancak bundan sonra güler (senarist öneri 15).
  - Boşluk dijital sessizlik değil, oda tonudur.
- **Kesilen ses:** "dee"nin yarıda kesilmesi, korkudan komediye geçişin değil, komediden korkuya geçişin anahtarı.
- **Kapı zili:**
  - Komik "bitiş çizgisi" anlamı taşır, ardından Sabri gelir.
  - Ding-dong 1. kuralı (kapı ve hoş geldiniz) çağrıştırdığı için izleyicinin kulağında zaten bir tehdit sinyali; bu çift anlam işe yarar.

---

## 5. Kredi (kuru çalıştırma) ve miks

### 5.1 Kuru çalıştırma sonucu
Taslak bir JSON'la çalıştırıldı (scratchpad, proje dosyalarına dokunulmadı): `python3 tools/elevenlabs.py seslendir <taslak> ` → **KURU ÇALIŞTIRMA, kredi harcanmadı.**

| Replik | Araç tahmini (kr) | Plan |
|---|---|---|
| iri724 fısıltı | 76 | **0** (B3 kaydı tekrar kullanılır) |
| Ece "sıçarım…" | 68 | üretilecek |
| Depo "ece" | 16 | **0** (ffmpeg, Sabri kaydı) |
| Ece "vallahi bastım… kaç" | 94 | üretilecek |
| Sabri "Nereye gidiyosun kızım." | 46 | üretilecek |
| **1 tam çekim (yeni)** | **208** | |
| Yeniden çekim payı (meme ×3, rant ×2, Sabri ×1) | **464** (üst sınır) | `--butce 500` önerilir |
| Yedek SFX (yutkunma, ambalaj; yalnız sentez yetmezse) | 60 + 60 (kaba tahmin) | ayrı onay |
| **En kötü durum toplamı** | **≈ 584** | Bible sınırı: parça başına ≤ 1.000 ✓ |

- **Gerçek harcama beklentisi:** Geçmiş kayıtlarda gerçekleşen harcama, araç tahmininin %40'ı çıktı (B3: 431/1082, B2 P3: 200/497). Buna göre 1 çekim ≈ 85 kr, yeniden çekim payıyla ≈ 185 kr.
- **Hesap durumu:** Yerel kayıtta bu araçla toplam 10.480 kr harcanmış ("proxy" hesabı). Kalan kredi sorgulanmadı. Onaydan önce `python3 tools/elevenlabs.py durum` çalıştırılmalı (kredi harcamaz).
- **Onaydan sonraki komut** (yalnız kullanıcı "evet" derse):
  `python3 tools/elevenlabs.py seslendir public/episodes/724-04.json --butce 300`
  Önce kuru çalıştırılır. Listede yalnızca bu 3 replik görünmeli, fısıltı ve "ece" **görünmemeli**. Sonra aynı komut `--onayla` ile çalıştırılır.

### 5.2 Miks seviyeleri
| Katman | Hedef |
|---|---|
| Diyalog (Ece, Sabri, iri724) | −16 LUFS (araç otomatik). `vol` 1.0 |
| Depo "ece" | −17 LUFS (elle). `vol` 1.0. Islak, uzak. |
| Ortam (`el_market_ortam`) | `volume` 0.32 (dizi standardı). Diyalogda motor %60 kısar. |
| Göz anı ortamı (`oda_tonu`) | 0.12 (tamamen sessiz değil) |
| Yakın efektler (yutkunma, tezgâh) | 0.8-1.0. Kısa ve tepe değerli; render'da limitörle kontrol edilir. |
| Arka efektler (kapı, ding-dong, adım) | 0.45-0.7 |
| Riser / korku vuruşu | 0.35 / 0.45-0.6 |
| Müzik | Yok (bitiş kartında jenerik 0.6, otomatik) |
| Master | `tools/render.sh`: −14 LUFS, tepe −1.5 dBTP, 48 kHz |

### 5.3 Kalite kontrol adımları (üretimden sonra)
1. `/opt/tts/venv/bin/python tools/ses_kontrol.py 724-04`. Beklenen KONTROL ET işaretleri ve nedenleri:
   - "işinedeee": uzatma nedeniyle.
   - "kaç kaç kaç kaç": Whisper tekrarları kısaltabilir.
   - Bunlar kulakla değerlendirilir.
2. Kaçların kelime zamanlarını çıkarıp aralıkları ölçmek (hedef 0,28-0,35 sn). Gerekirse 1.4'teki ücretsiz rötuşu yapmak.
3. Render sonrası tüm bölüm sesini Whisper'la yazıya döküp senaryoyla karşılaştırmak. `ffmpeg -af ebur128` ile −14 LUFS ve tepe ≤ −1.5 dBTP olduğunu doğrulamak.

### 5.4 Kullanıcının dinleyip onaylaması gerekenler (ben dinleyemiyorum)
1. Meme'nin hızı, panik ve gülünçlüğü: Ece'nin doğal, samimi sesi korunmuş mu?
2. "dee"lerin uzunluğu ve sitem tonu.
3. Depo "ece" sesi için v3 (önerilen, okunur) mı v1 (daha korkunç) mı? Sabri tınısı seziliyor mu?
4. Sentez yutkunma ikna edici mi? Değilse ElevenLabs SFX yedeği (≈60 kr, onaylı) kullanılsın mı?
5. Sabri'nin "Nereye gidiyosun kızım."ı yeterince sıradan ve tekinsiz mi?

---

## Özet (kısa)
1. Kredi harcanmadı; yalnızca kuru çalıştırma yapıldı. Replik ve noktalama aynen korundu, yeni replik eklenmedi.
2. Fısıltı B3'ten yeniden kullanılır (0 kr). Depodaki kalın "ece", Sabri'nin B1 depo kaydından ffmpeg ile üretilir (0 kr). −4 yarım ton sürümü Whisper'da "Ece" diye okunuyor.
3. "vallahi bastım vallahi bastım kaç kaç kaç kaç" tek parça, tek nefes, tek TTS çekimi. Etiketler `[panicked, fast, breathless, crying-laughing]`, hız 1.15, okunuş `…kaç kaç kaç kaaaç!`.
4. Görüntü sese uyar: kelime zamanlarından çıkış, takılma, dört adım ve 4. "kaç"ta kapı ding-dong'u.
5. "sıçarım işinedeee marketinedeee" uzun ve sitemli üretilir. Son "dee" depo kapısı ve "ece" ile yarıda kesilir (ücretsiz kırpma).
6. "Nereye gidiyosun kızım." kuru, düz, sıradan Sabri. Depodaki ıslak ve derin sesle zıtlık, korkunun kendisi.
7. Bölümde fon müziği yok, kaçların ritmi müzik. "ece"den sonra 1,5-2 sn ses boşluğu (oda tonu). Finalde kalp, riser, ambalaj hışırtısı, vuruş, siyah.
8. Eksik efektler (yutkunma, önlük sesleri, tezgâh çarpması, ayakkabı, ambalaj) ücretsiz sentez. Adımlar ve kısa depo kapısı mevcut kayıtlardan türetilir. ElevenLabs SFX yalnızca yedek.
9. Kredi (araç tahmini, üst sınır): 1 çekim 208, yeniden çekimlerle 464, yedek SFX dahil en kötü durum ≈ 584 (≤1.000). Gerçekleşme ≈ %40 (≈ 85-185 kr).
10. Yeniden çekim için okunuş ya da etiket değiştirilmeli. Sabit tohum yüzünden aynı ayarla `--yeniden` neredeyse aynı çekimi tekrar satın alır.
11. Kod önerisi (onaya): repliğe özel `stab` (0.0 Creative). Karakter ayarı değiştirilirse eski önbellek bozulur.
12. Miks: diyalog −16, "ece" −17, ortam 0.32, master −14 LUFS / −1.5 dBTP. Kullanıcı 5 maddeyi dinleyip onaylamalı (5.4).
