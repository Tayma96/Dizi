#!/usr/bin/env bash
# Kırmızı Düğme · B1 açılış sahnesi (KDKancaSahne) ses miksi — ElevenLabs efektleri + bağırış + imza klik A.
# Zamanlar (30 fps): 0 nefes+mont · 8 "Duuuuur!" (soldan) · 21 klik (yakın) · 36 kilit+kanatlar · 40 ikaz alarmı
# · 58 gergin nefes (mızrak belirmeden) · 80 mızrak fırlar · 118 SERT KESME (sessizlik) · 132 başlıkta aynı klik · 170 son.
# Oda tonu KISIK (kullanıcı: rahatsız etmesin).
# Kullanım: bash tools/kd_kanca_sahne_ses.sh <video.mp4> <cikis.mp4>
set -euo pipefail
V="$1"; O="$2"
E=public/ses/efekt; K=public/ses/kd/klik-A-tok.wav; D=public/voice/kd-kanca/kanca_01.mp3
KES=3.9333; SON=5.6667
args=(-i "$E/kd_oda_tonu.mp3" -i "$E/kd_nefes_mont.mp3" -i "$D" -i "$K" -i "$E/kd_bolme_acilis.mp3" -i "$E/kd_ikaz_alarm.mp3" -i "$E/kd_nefes_mont.mp3" -i "$E/kd_mizrak_firlama.mp3" -i "$K")
p="apad=whole_dur=$SON"
f="[1]aloop=loop=1:size=288000,atrim=0:$KES,afade=t=in:d=0.3,afade=t=out:st=3.90:d=0.03,volume=-25dB,$p[oda];"
f+="[2]volume=-6dB,$p[nef];"
f+="[3]adelay=267|267,pan=stereo|c0=c0|c1=0.5*c0,volume=-1dB,$p[duur];"
f+="[4]adelay=700|700,volume=2dB,$p[k1];"
f+="[5]adelay=1200|1200,volume=-2dB,$p[bol];"
f+="[6]adelay=1333|1333,volume=-11dB,atrim=0:$KES,afade=t=out:st=3.90:d=0.03,$p[alm];"
f+="[7]adelay=1933|1933,volume=-8dB,atrim=0:2.667,$p[nef2];"
f+="[8]adelay=2667|2667,volume=1dB,atrim=0:$KES,afade=t=out:st=3.915:d=0.015,$p[miz];"
f+="[9]adelay=4400|4400,volume=2dB,$p[k2];"
f+="[oda][nef][duur][k1][bol][alm][nef2][miz][k2]amix=inputs=9:normalize=0,atrim=0:$SON,volume=3dB,alimiter=limit=0.8:level=false[a]"
ffmpeg -loglevel error -y -i "$V" "${args[@]}" -filter_complex "$f" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 "$O"
ffmpeg -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:|Peak:" | tail -2
