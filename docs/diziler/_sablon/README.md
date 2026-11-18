# Dizi dosyası şablonu

Her dizi için `docs/diziler/<dizi-kisa-adi>/` klasörü açılır ve bu şablondaki dosyalar kopyalanır.
Bu dosyaları `dizi-hafizasi` ajanı güncel tutar. Diğer ajanlar yazmadan önce bunları okur.

| Dosya | İçerik |
|-------|---------|
| `bible.md` | Dizinin kimliği: tür, ton, hedef kitle, ana çatışma, kurallar, renk senaryosu, müzik temaları |
| `karakterler.md` | KARAKTER İNCİLİ: kim kimdir, görünüm (cast.json id), ses, konuşma biçimi, sırları, istek/ihtiyaç, ilişki ağı |
| `ipuclari.md` | Ekilmiş ipuçları ve açık döngüler defteri (kurulum → planlanan ödeme → durum) |
| `bolumler.md` | Bölüm özetleri (kayan bellek): her bölümün 5 satırlık özeti, son 3 bölüm ayrıntılı |
| `zaman-cizelgesi.md` | Hikâyenin iç kronolojisi (geçmiş olaylar, yaşlar, tarihler) |

Kullanıcı onayı olmadan bu dosyalara hikâye içeriği yazılmaz; ajanlar yalnızca onaylanmış içerikleri kaydeder.
