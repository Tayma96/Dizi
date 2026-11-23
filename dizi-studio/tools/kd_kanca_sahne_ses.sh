#!/usr/bin/env bash
# Kırmızı Düğme · B1 açılış sahnesi (KDKancaSahne) ses miksi — ElevenLabs efektleri + imza klik A.
# Zamanlar (30 fps): 0 nefes+mont · 24 klik (yakın plan) · 33 bölme açılışı · 34 ikaz alarmı · 42 mızrak
# · 62 SERT KESME (sessizlik) · 74 başlıkta aynı klik · 110 son. Oda tonu KISIK (kullanıcı: rahatsız etmesin).
# Kullanım: bash tools/kd_kanca_sahne_ses.sh <video.mp4> <cikis.mp4> [duur.wav]
set -euo pipefail
V="$1"; O="$2"; DUUR="${3:-}"
E=public/ses/efekt; K=public/ses/kd/klik-A-tok.wav
KES=2.0667   # 62/30
args=(-i "$E/kd_oda_tonu.mp3" -i "$E/kd_nefes_mont.mp3" -i "$K" -i "$E/kd_bolme_acilis.mp3" -i "$E/kd_ikaz_alarm.mp3" -i "$E/kd_mizrak_firlama.mp3" -i "$K")
f="[1]atrim=0:$KES,afade=t=in:d=0.25,volume=-24dB,apad=whole_dur=3.6667[oda];"
f+="[2]volume=-5dB,atrim=0:$KES,apad=whole_dur=3.6667[nef];"
f+="[3]adelay=800|800,volume=2dB,apad=whole_dur=3.6667[k1];"
f+="[4]adelay=1100|1100,volume=-3dB,atrim=0:$KES,apad=whole_dur=3.6667[bol];"
f+="[5]adelay=1133|1133,volume=-10dB,atrim=0:$KES,afade=t=out:st=2.04:d=0.02,apad=whole_dur=3.6667[alm];"
f+="[6]adelay=1400|1400,volume=1dB,atrim=0:$KES,afade=t=out:st=2.05:d=0.015,apad=whole_dur=3.6667[miz];"
f+="[7]adelay=2467|2467,volume=2dB,apad=whole_dur=3.6667[k2];"
n=7; ins="[oda][nef][k1][bol][alm][miz][k2]"
if [ -n "$DUUR" ]; then
  args+=(-i "$DUUR"); f+="[8]adelay=433|433,pan=stereo|c0=0.9*c0|c1=0.45*c0,atrim=0:$KES,apad=whole_dur=3.6667[duur];"; n=8; ins+="[duur]"
fi
f+="${ins}amix=inputs=$n:normalize=0,atrim=0:3.6667,volume=3dB,alimiter=limit=0.8:level=false[a]"
ffmpeg -loglevel error -y -i "$V" "${args[@]}" -filter_complex "$f" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 "$O"
ffmpeg -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:|Peak:" | tail -2
