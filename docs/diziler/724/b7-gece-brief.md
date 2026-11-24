# 7/24 Bölüm 7: gece çalışması brifingi (24 Kasım 2026, 04:30 TSİ başlar)

## Kullanıcının talimatı (23 Kasım gece, aynen)
"Bok gibi olmuş. 04:30 da limit yenileniyor zamanlayıcı kur görüntü yönetmeni ve senaryo yardımcılarını tekrar devreye sok, 7. Bölümü tamamen hazırla. Doğaçlamalar serbest, uyandığımda 7. Bölüm tamamen hazır olsun."

- **Doğaçlama izni (7/24 B7):** kullanıcının replikleri ve noktalaması AYNEN korunur; aradaki boşluklar, geçişler, sözsüz şakalar ve kısa yeni replikler doğaçlanabilir. Doğaçlanan her şey sabah kullanıcıya açıkça listelenir.
- **Kredi:** 7/24 için genel onay var ("maliyet sorup durma"); kredi ASLA aşılmaz, `--butce` ver, harcamayı raporla. Bu gece tavanı: 3.000 kredi.
- **Teslim:** sabah `bolumler/724-07.mp4` = 7. Bölümün TAMAMI (P1+P2+P3 birleşik, −14 LUFS, sonunda yorum kartı), ayrıca parçalar.

## Metin (kullanıcının, aynen): `docs/diziler/724/bolumler.md` → "Bölüm 7, Parça 1/2/3"
1. **P1 (banyo, 18:00):** anne kirlileri toplar, "Eceee uyan kız artık", cepte deste, "yuhh", "Eceeee"; Ece uykulu ve korkak gelir; "nerden geldi bu paralar…", "anneee dev gibi böcek vardı…", "Böcek evde de var terliği vur geç", "para diyorum Ece…", "çok mu ya o kadar ver bi bakıyım", "yüz, iki yüz…", "Oha lan ne çok para", kulak çekme "aauuv ah ah acıyo", "nerden geldi bu para?", iç ses "şimdi olanları anlatırsam…", "ama çok para lan", "git elini yüzünü yıka…".
2. **P2 (ayna):** yüz yıkama, "Saçmalama Ece ölüyodun lan canından daha mı değerli", duraksama, "Günlük bu kadar çalışsam 1 haftalık maaşım 1 yıllık maaşım yapıyo olummmm", "Gidip Sabri abiye olanları bir sorayım en iyisi" (kararlı).
3. **P3 (salon, sofra):** anne sofrayı kurar; Ece hızla odasına gidip giyinir; anne "otur şu masaya"; Ece çıkınca anne "o para...." derken Ece zeytin alıp ağzına atar, annesini öper, "az işim var gelicemm" deyip evden çıkar.

## Kullanıcının bu bölümdeki itirazları (HEPSİ kontrol listesi; tekrarlanmayacak)
- "Oldu bittiye getirilmiş, baştan savma, alt yapı gibi": her vuruşta EYLEM ve TEPKİ olmalı; karakterler poz verip durmaz.
- Komedi ve samimiyet (ilk 3 bölümün havası) geri gelmeli; tepkiler komik olmalı; anne terlik lafında bile ÖFKELİ.
- Kollar: V/U şeklinde yana açılan, çarpık, ters dirsekli kollar YOK. Ele yüze giden kollar önden, dikey (kısaltılmış üst kol; `onKol`). Hareket ederken kollar çarpık çurpuk olmasın.
- Boy: Ece annesiyle aynı boyda (yetişkin). Mesafe doğal; kollar birbirinin üstüne binmez.
- Bakış: konuşan kime konuşuyorsa ona BAKAR (anne solda → sağa, Ece'ye).
- Kulak çekme: Ece yakın plan (beğenildi); annenin eli soldan, omuz hizasından gelir (yukarıdan DEĞİL).
- Mantık: saat (kasım 18:00 karanlık), eşyaların sürekliliği, sebep-sonuç; kimse havadan belirmez; kapıdan girerken önce kapının ARKASINDA olunur.
- Ece'nin pijaması: kedili özgün baskı (Hello Kitty YOK, telif); evde topuz; dışarı çıkarken hardal kazak (ece_sivil).
- Beğenilen tek şey: P1 açılışının ilk 14,5 sn'si (`ornekler/b7p1-v2-ornek.mp4`: anne çamaşır, çorap koklama + Iyy, cepte deste, yuhh, Eceeee) — korunabilir ya da daha iyisiyle değiştirilebilir.

## Mevcut altyapı (yeniden kullan, baştan okumaya gerek yok)
- `dizi-studio/src/studio/engine/Inserts16.tsx` → `b7_banyo` elle kurgulanmış sahne: `view` = (yok: banyo kapı) | "ayna" | "salon" | "antre"; karakterler `anne`/`ece` (`yer`, `egil`, `bak`, `duygu`, `goz`, `gozSok`, `tilt`, `konus` [manifest ağız], `elL/elR` IK hedefleri + `dogalKol` + `onKol`, `tutL/tutR` eşya, `parmakUcu`, `islak`, `yanak`), `ucan`, `yerde`, kamera `cam`, `titre`.
- `Inserts15.tsx`: `cep_deste`, `para_say`, `kulak_cek` (text ["sol"]), `zeytin_al`. `Inserts14.tsx`: `ev_anahtar`, `ev_zincir`.
- Setler: `sets/banyo724.tsx` (ayna, kapı + çamaşır makinesi), `sets/ev724.tsx` (antre, salon + sofra).
- Üreticiler: `tools/b7p1v2.py` (açılış), `tools/b7p1devam.py`, `tools/b7p2.py`, `tools/b7p3.py`.
- Sesler: `public/voice/724-07/cekim`, `724-07/cekim3`, `724-07-p2/cekim`, `724-07-p3/cekim` (her repliğin 2 çekimi). Ece = Nazlı Yeni, anne = anne724 sesi, eleven_v4.
- Render: `npx remotion render src/index.ts GKK-B1 out/<id>.mp4 --concurrency=3 --props='{"episodeId":"<id>","part":0}' --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`; ses −14 LUFS (`volume=(-14.6-I)dB,alimiter=limit=0.89`).
- Kontrol: `B7Kare` kompozisyonu (still), saniyede 4-10 kare şeritler; render sonrası saniye saniye.

## İş bölümü (bu gece) — kullanıcı: "Alt ajanları sok devreye, sen yapma"
Kullanıcı ayrıca: "Genel yönetmen sen ol." → Senaryo, ses ve görüntü işini alt ajanlar yapar; genel yönetmen ana oturumdur (koordinasyon, son denetim, birleştirme, teslim).
1. **Senarist yardımcısı:** üç parça için komik doğaçlama ve tepki planı (kim ne yapar, dinleyen ne tepki verir, sözsüz şakalar, gerekirse kısa yeni replikler). Rapor: `docs/diziler/724/raporlar/b7-senarist.md`.
2. **Ses yönetmeni:** yeni replik seslendirmesi (eleven_v4, aynı sesler, toplam ≤ 3.000 kredi), Whisper, efekt/müzik/miks. Rapor: `docs/diziler/724/raporlar/b7-ses.md`.
3. **Görüntü yönetmeni:** senaristin planıyla üç parçayı 6. Bölüm 1. Parça kalitesinde yeniden kurar (ışık, kamera dili, oyunculuk, kollar, süreklilik), kontrol kareleriyle didik didik inceler, render alır. Rapor: `docs/diziler/724/raporlar/b7-goruntu.md`.
4. **Genel yönetmen (ana oturum):** son denetim, düzelttirme, birleştirme (+ yorum kartı, −14 LUFS) → `bolumler/724-07.mp4`; sabah notu `docs/diziler/724/raporlar/b7-sabah.md` (doğaçlamaların listesi dahil).
