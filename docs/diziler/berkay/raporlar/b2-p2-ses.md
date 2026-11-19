# B2-P2 "Ayna": ses planı (ses yönetmeni)

## Replikler (eleven_v4, emotion "notr" + tags)
| Replik | tags | Oyunculuk notu |
|---|---|---|
| Dış ses: "Ben imzamı hep sağ elimle atarım." | `[quiet, intimate, thinking aloud]` | Yavaş, kuru, mikrofona yakın. Cümleden önce kısa nefes. |
| Dış ses: "Videodaki adam… solaktı." | `[quiet, slow realization]` | "adam"dan sonra ~0.6 sn durak, "solaktı" daha alçak. Öfke yok. |
| Berkay: "Deniz Hanım! O video sahte!" | `[shouting, pounding on door, urgent]` | Hızlı, nefes nefese; "Hanım!"dan sonra 0.2 sn. |
| Deniz: "Güvenlik kameraları görüntüyü ayna gibi kaydeder, Berkay." | `[calm, unhurried, patient]` | Ağır tempo, "Berkay" yumuşak ve alçak. Yükselmez. |
| Deniz: "Geçen hafta da tam bunu söylemiştin. Aynı cümleyle." | `[soft, quietly certain]` | Cümleler arasında 0.5 sn. "Aynı cümleyle." neredeyse fısıltıya yakın. |

Kontrast: Berkay'ın bağırışı en yüksek an, hemen ardından Deniz en alçak ve en yavaş ses. Dış ses yakın ve kuru.

## Zaman çizelgesi
1. **0-2 sn:** `kilit` (0.8) + `el_demir_kapi` kapanış (0.6). Ortam `el_hastane_oda` (0.45). Müzik yok.
2. **Hatıra:** `el_kamera_kayit` (0.35) + yeni `el_cctv_ugultu` (0.3) + ortamı `lowpass=1800` ile boğulur, video sesi `asetrate*0.94` ile hafif yavaşlar. Oda tonu 0.25. Müzik `deli_tema` (0.12) burada girer.
3. **Havaya imza:** efekt yok, yalnız oda tonu. Dış ses kuru (yansıma yok). "solaktı"dan sonra müzik 1 sn'de kesilir: **1.2 sn sessizlik** (yalnız oda tonu).
4. **Kapı:** `kapi_yumruk` ×3 (0.85, düzensiz aralık). Ardından yeni `el_koridor_adim_yaklasan`.
5. **Deniz gelir:** `kilit_yarim` + `kapi_acilma` (0.6). Müzik yok, ortam tek başına.
6. **Ekran döner:** `el_tablet_tik` (0.5) + `whoosh` (0.25). "Aynı cümleyle." altında `korku_drone` (0.15) yükselir.
7. **Kanca:** "7" görülünce `darbe` (0.7); öncesinde 1.5 sn `riser`. Yeni `el_tablet_kilit` (0.6), kararmada 0.8 sn yalnız alçak oda tonu, sonra drone kuyruğu.

**Yeni ElevenLabs efektleri (3):**
- `el_tablet_kilit`: "tablet screen lock click, soft digital tone, quiet room" (1 sn)
- `el_koridor_adim_yaklasan`: "calm footsteps approaching on hospital linoleum, heard through a metal door" (3 sn)
- `el_cctv_ugultu`: "low CCTV playback hum with faint tape hiss" (4 sn, döngü)

## Miks
- Diyalog −16 LUFS. Müzik diyalog altında ~−7 dB ducking, en fazla 0.12. Ortam 0.4-0.5.
- Oda replikleri: `aecho=0.8:0.55:28|52:0.14|0.07`. Dış ses kuru.
- Berkay'ın kapı repliği: oda yansıması + yakın metal rezonans `aecho=0.8:0.5:12:0.2`.
- Kapı arkasından gelen Deniz sesi: `lowpass=900,highpass=150,volume=0.6`.
- Tabletteki video: fx "telefon".
- Master −14 LUFS, tepe ≤ −1.5 dBTP, 48 kHz (`render.sh`).

**Dinleyip onaylanacak:** Deniz tonu soğuk değil "nazik üstün" mü; yavaşlatılmış hatıra sesi anlaşılır mı.
