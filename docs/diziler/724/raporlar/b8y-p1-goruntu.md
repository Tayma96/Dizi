> Eski (Gemini denemesi) görüntü raporu: `b8y-p1-goruntu-gemini.md`. Bu dosya DoP yeniden tasarımının raporudur.

# 7/24 B8 (yeni) P1: görüntü yönetmenliği (DoP), 24 Kasım 2026

Örnek sahne (açılış → Mert'in çıkışı, 0-22,1 sn): `bolumler/724-08y-p1-ornek.mp4` (−14 LUFS).
Kontak sayfası: `docs/diziler/724/raporlar/b8y-p1-ornek-kareler.png`.
Sesler, replikler, `public/voice/724-08y-p1/` ve `tools/b8y_p1_ses.py` değişmedi. Replik sırası ve aralıklar (SIRA) aynı.

## Coğrafya ve 180° kararı
- Oda tek: soldan sağa vitrin, monitör, sigara dolabı, kazı kazan + takvim, **DEPO · PERSONEL** kapısı (sağ köşe). Tezgâh odanın önünde, doğu-batı uzanır.
- Eksen: Ece (müşteri tarafı) ↔ Sabri (tezgâh arkası). Bütün kameralar eksenin aynı (müşteri/depo) tarafında. Sonuç: **Ece her açıda SOLDA ve sağa bakar; Sabri ve Mert SAĞDA ve sola bakar.**
- Yeni ana açı `yan` (`src/studio/sets/market724yan.tsx`): gerçek bir izdüşümle çizildi (kamera tezgâhın sağ ucunun önünden ~12° çapraz bakar). Ece önde solda, Sabri tezgâhın arkasında, depo kapısı Sabri'nin sağında, kadrajın içinde ve büyük. Karakter boyları aynı izdüşümden hesaplanır (`yI()` Python, `yanIsaret()` TS).
- "Sırtı dönük" sorunu: ters açılarda artık kameraya dönük tek kişi yok. Her tek çekim omuz üstü (OTS):
  - `kasa`: önde Ece'nin ensesi ve at kuyruğu (bulanık), Sabri kadraj soluna bakar.
  - `tezgah`: önde Sabri'nin kel başı, kulağı ve omzu sağda (bulanık), Ece kadraj sağına bakar.
  - Arkadan baş çizimleri yeni: `SirtEce`, `SirtSabri` (Inserts18, opt-in `eceSirt` / `sabriSirt`).

## Çekim listesi (örnek sahne)
| # | sn | açı / ölçek | ne oluyor | kamera |
|---|----|-------------|-----------|--------|
| 1 | 0,00-2,70 | yan, orta-geniş (establishing) | Eller havada → BAM (0,20) + "ölüme gönderdin beni abi" | yavaş yaklaş (gerilim), BAM'de sarsıntı |
| 2 | 2,70-6,56 | kasa, Sabri OTS (orta) | "Kurallara uy Ece…", işaret parmağı | hafif itme |
| 3 | 6,56-9,55 | tezgah, Ece ters OTS (yakın) | azar; "sövmen"de mahçup bakış, "bozdu"da göz devirme | hafif itme |
| 4 | 9,55-13,21 | yan, geniş → kapıya kaydır | Ece somurtup parmağıyla tezgâhta daire çizer (görmez); 10,0'da kol iner; kamera kapıya kayar | kaydır (dikkati kapıya taşır) |
| 5 | 13,21-14,86 | yan, kol çok yakın | kol dibe (13,76, mandal), kapı aralanır (13,88; kenarda sıcak ışık çizgisi) | yavaş itme |
| 6 | 14,86-16,60 | yan, orta (3'lü coğrafya) | "sorunsuz bi gece geçer" → 15,78 kapı açılır, depo ışığı, içeride ters ışıkta siluet | sarsıntı |
| 7 | 16,60-18,61 | yan, Ece yakın | "aaaa yine miii": geri sıçrar, şok gözler | sarsıntı |
| 8 | 18,61-20,44 | yan, kapı (orta) | Mert siluet → "topladım"da eşiği geçer, ışığa çıkar (siluet → aydınlık) | yavaş itme |
| 9 | 20,44-22,07 | yan, geniş | Mert tezgâhın arkasına, Sabri'nin sağına yürür; Ece ağzı açık, farkında olmadan ona doğru süzülür | hafif itme |

Ölçek dizisi: orta-geniş · orta · yakın · geniş · çok yakın · orta · yakın · orta · geniş. Aynı ölçek art arda yok; görsel değişim 1,6-3,9 sn.

## Işık
- Gece marketi: üstten floresan anahtar ışık, tezgâh ve yüzler aydınlık, tavan, ön zemin ve kenarlar düşük (yan için ışık havuzu, multiply).
- Kapı kapalıyken depo köşesi loş (gizem). Bu sırada kol, metal parlamasıyla tek parlak nokta.
- Aralanınca kenarda sıcak ışık çizgisi ve zeminde ince ışık kaması. Açılınca sıcak depo ışığı (çıplak ampul) odaya taşar: zeminde ışık lekesi, Sabri'nin sağına ve Mert'e sıcak dolgu. Soğuk floresan ile sıcak depo ışığı arasında renk karşıtlığı var.
- Mert ters ışıkta siluet (koyu, sıcak kenar ışığı). Işığa adım atınca aydınlanır.

## Yeni olay zamanları (ses bunlara bağlı)
`t_bam=0,20` · `t_kol0=10,00` · `t_kol1=13,76` · `t_aralik=13,88` (yeni, kapı aralanır) · `t_kapi=15,78` ("geçer") · `d0=22,07` · `t_durt1=29,98` · `t_durt2=30,28`.
Not: Ses yönetmeninin aralanma anına ayrı bir efekt koymak isteyebileceği yer `t_aralik`. Şu an mandal sesi `t_kol1 − 0,05`'te.

## Görsel riskler
- Kol yakın planındaki ışık çizgisi telefonda ince görünebilir. Mandal sesiyle birlikte okunuyor; gerekirse aralık açısı büyütülür.
- Rig'in gövdesi önden çizilir; yan açıda baş 3/4 döner. Kollar tezgâha uzandığı için konuşma yönü okunuyor ama gövde tam profil değil.
- Çekim 8'de Sabri'nin başı kadrajın sol kenarında yarım görünüyor (bilinçli "kirli" kadraj).

## Kalan sahneler için plan (onaydan sonra)
1. **Anime âşık anı (d0 → E3):** `yan` açıda Ece'nin yakın planı (Mert kadraj sağında, bakış yönü korunur) → Mert'e Ece'nin bakışından OTS (önde Ece'nin ensesi, `kasa` ya da yeni `yan` ters OTS) → pembe ışıma, hüzme, yıldızcık ve göz parıltısı korunur. Işık sıcak-pembeye kayar, arka plan bulanır.
2. **Bölünmüş yüz:** Ece'nin yakın planı korunur (bir göz âşık, bir göz şüpheli). Gözü Mert'in ayaklarına ve duvara iner.
3. **Gölge kontrolü:** `yan` açıda Mert'in arka duvara düşen gölgesi (depo ışığı arkasında, gölge öne ya da duvara düşmeli). Işık kaynağıyla tutarlı olacak şekilde yeniden çizilir.
4. **Dürtme:** önce `yan` orta 3'lü (Ece tezgâh boyunca uzanır, kolu Sabri'nin önünden GEÇMEZ; Mert tezgâhın ucunda, Ece'ye yakın durur). Ardından **yakın insert**: Ece'nin işaret parmağı Mert'in koluna iki kez (`t_durt1`, `t_durt2`; tişört kolu + ön kol çizimi). Sonra **Mert yakın**: parmağa bakar, tek kaşını kaldırır.
5. **"Abi... bu insan mı?" / "Sakin ol, henüz gece olmadı.":** Ece ters OTS (önde Sabri'nin ensesi) ↔ Sabri OTS (önde Ece'nin ensesi). Ece fısıldarken gözü Mert'te kalır (bakış sağ-yukarı).
6. **"Aferin Mert…" / "Ece bu Mert…":** `yan` orta 3'lü. Sabri avucuyla Mert'i tanıtır, Mert başıyla selam verir.
7. **"Benim önlüğüm nerde abi" (parça sonu):** Ece yakın (yan), gözü Mert'te. Yavaş itme ve hafif pembe kalıntı.
