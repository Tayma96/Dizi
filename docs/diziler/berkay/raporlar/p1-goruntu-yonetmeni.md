# Parça 1: görüntü yönetmeni raporu (özet, 19 Kasım 03:05)

Test kareleri: `/tmp/claude-0/-home-user-Dizi/b07199cd-cb6f-51e2-8731-5eac438d8fb0/scratchpad/` (`k/`, `s*.png`, `v*.png`, `nalan.png`). Oturum kapanırsa silinebilir.

## TEKNİK RİSK (JSON düzenlerken)
- **Ses eşleşmesi vuruş sırasına bağlı.** Replik kimliği `p1_<vuruş sırası>` (`types.ts:147`, `elevenlabs.py:312`). Mevcut sesler p1_02, p1_03, p1_05.
  - Bir replik vuruşunun önüne vuruş eklenir ya da biri silinirse ses kayar.
  - Çözüm: ya yeni vuruşları yalnızca son replikten sonra ekle, ya da `public/voice/imza-01/manifest.json` anahtarlarını ve mp3 adlarını yeni sıraya göre yeniden adlandır. Yeniden adlandırma ücretsizdir; `key` alanı aynı kalır, önbellek bozulmaz.
- **Replik vuruşundaki `emotion` değişirse yeniden seslendirme (kredi) gerekir.** Yüz ifadesini `cast.<id>.emotion` ile değiştir.

## P0 (kritik)
1. **Yatan Berkay'ın yüzü 90° yan, itici.**
   - `Character`'a boyun pivotlu `pose.headRoll` ekle.
   - Render'da `headRoll = ang !== undefined ? -0.72 * ang : 0`: yatarken yüz kameraya döner, yastıkta yaklaşık 25° eğik kalır.
2. **Doğrulurken kamera savruluyor ve kol kadrajdan fırlıyor.**
   - 6a (1,6 sn): `body:"dogrul"`, jest yok, yüz yorgun; sabit kadraj `{"cx":470,"cy":1060,"z":1.4}`; çınlama sesi burada.
   - 6b (1,8 sn): `basTutma`, yüz `aci`, `eyesClosed:0.45`; `orta` + `yaklas`.
3. **Battaniye kutu gibi ve önündekileri örtüyor** (Nalan arkasında kalır).
   - Ön plandan alınıp yatanın hemen üstünde çizilmeli.
   - İki şekil: `yat` (şiltenin ≤130 px üstü, göğüs ve ayak kabarıklığı) ve `otur` (belde katlı, ≤110 px).
4. **Zemin gölgesi:** `hideLegs` açıkken çizilmemeli (`Character.tsx` yaklaşık satır 494).
5. **Geniş çekim yok, pencere kadrajı 7,6 sn sürüyor.**
   - 2. vuruşun ortasında ("burası güvenli" kelimesinde) tüm odanın geniş çekimine kes. Gereken motor özelliği: vuruş içinde `shots:[{at, shot}]`.
   - Ya da 2. vuruşu düz `genis` yap.
   - 3. vuruş: `orta` + `kadraj {"cx":400,"cy":1320,"z":1.6}` + `yaklas`.
6. **Altyazı kuşu kapatıyor:** `KADRAJ.pencere = {cx:770, cy:600, z:2.05}`.

## P1
7. **Berkay'ın kostümü cerrahi formaya benziyor.**
   - Uzun kollu yakalı pijama: `shirt`, `#8fa6b5` / `#7790a0`, gri terlik `#9aa0a4`.
   - `pale:0.35`.
   - Bilekte beyaz bant geniş ve orta planlarda da görünmeli.
   - Ekleme çekimindeki kol ve ten rengi kadrodan okunmalı (şu an kollar uzun-kısa tutarsız).
8. **Yüz ifadesi duyguyu taşımıyor.**
   - 4. vuruş: yüz `yorgun`, `eyesClosed:0.25`, `cok_yakin`.
   - 5. vuruş: yüz `korkmus` (replik duygusu `aci` kalır).
   - `face.tsx` `aci` ayarı: `browInner 18`, `browLift -4`, `eyeOpen 0.42`, `mouth "wavy"`.
9. **Mekân tekinsiz değil.**
   - Kurum boyası: alt yarı `#6f8279`, üstte koyu şerit.
   - Huzmede parmaklık gölgeleri; vinyet %45; bulutlu, güneşsiz gökyüzü (`#d9e0e3` → `#bfc8cc`).
   - Damlama izli lekeler ve çatlaklar.
   - Sağ üstte güvenlik kamerası, kırmızı LED 1 sn'de bir yanıp söner.
   - Toz zerreleri; arada floresan titremesi.
   - Huzme gradyanı `stopOpacity` 0.55.
   - Yeni `look:"tekinsiz"` = `saturate(0.6) hue-rotate(-12deg) brightness(0.86) contrast(1.18)`. `soguk` değişmesin.
   - (Güvenlik kamerası Truman tarafını besler; hastanede olağandır, iki açıklama kuralına uyar.)
10. **Yerleşim:** yatağın ayakucu kapının önüne biniyor.
    - `CellDoor` x 900 → 780; `IronBed` x 30, s 0.86.
    - `yatak` işareti `{x:520, y:1238, size:820}`; battaniye de buna göre kaydırılır.
    - Önce still ile doğrula.
11. **GÜN 183:** yönetmen kararıyla sahnenin içine (duvar kazıması) alınacak.
    - Köşe yazısı kalırsa: 84 px, koyu plaka, 1. vuruş 3,8 sn, sonda solarak kaybolsun.
12. **Bileklik ekleme çekimi:**
    - Kol ~420 px kalınlıkta; bant ~230 px, silindir gölgeli, kolu sarar, çıtçıtlı.
    - El başparmaklı; süre 3,2 sn.
13. **Kapı kolu ekleme çekimi:**
    - Işık aralığı rozet tarafında açılmalı (sol, x 0-60).
    - Çizikler ve boya izi eklenmeli.
    - Bilekliğe tepki vuruşu: `yakin`, korkmuş (+ "Yedi'yi ben alırım" vuruşu bununla birleşebilir).
14. **Çekim sırası:** pencere → oda geniş → yatan orta → göz açılışı `cok_yakin` → replik `yakin` → 6a doğrulma (sabit) → 6b baş tutma (`orta`) → bileklik → tepki `yakin` → kapı kolu.

## P2
- Açılış kararması 20 kareden 8 kareye inmeli.
- Konuşmacı etiketi 26 → 34 px.
- Kuş: uçarken gövde −15° eğik, konarken kanat 3 kare açık kalsın.
- Berkay 183 gün sonra fazla derli toplu: dağınık saç (`shortMessy`), solgunluk, göz altı morluğu. Yara izi (`scar`) hiçbir karede görünmüyor; yeri belirlenmeli.

## Nalan (parça 2)
- **Kostüm:** kırık beyaz tunik (`#f4f5f2` / `#d8dedc`), V yaka.
  - Belde büyük anahtar halkası: güç sembolü, kapı motifiyle bağ.
  - "NALAN" isim kartı, yaka saati, beyaz sabo. Bone yok (klişe).
  - Rig'de yeni `hemsire` kıyafeti; geçici çözüm `dress` + `#f4f5f2`.
- **Görünüş:**
  - Bal-platin sarı saç `#f0d48c` / `#c4a058`; düşük, yumuşak topuz ve yüzü çerçeveleyen iki tutam.
  - Göz `#4a9be0`, koyu limbal halka, kirpikler. Dudak `#c96a6a`.
  - Allık 0.15; kaşlar ince ve kemerli.
  - `mutlu`'nun içe eğik kaşları onu kurnaz gösteriyor; düzeltilmeli.
- **Yerleşim:**
  - Yeni işaret `yatak_yani: {x:880, y:1720, size:1200}`. Berkay solda, Nalan sağda (kapı tarafı); `enter:"sag"`.
  - İlk kare kapıdan sızan sıcak ışıkta; güzellik yakın planında arkadan saç ışığı.
