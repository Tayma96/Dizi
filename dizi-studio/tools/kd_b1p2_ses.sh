#!/usr/bin/env bash
# Kırmızı Düğme · B1 Parça 2 açılışı (KDP2Acilis, 728 kare = 24,27 sn) ses miksi.
# Kareler (görüntü yönetmeni, kd/p2Ses.ts): horlama 0 ve 180 (ikincisi 345'te kesilir) · kurye sayıklama 351
# · kız çığlık 441 · herkes irkilir 509 (kumaş) · kurye "Noluyo lan" 555 · göbekli panik 603.
# A1 (0-89) güvenlik kamerası: horlama kamera mikrofonundan ince/cızırtılı; A2'den itibaren dolgun ve yankılı.
# Oda tonu kısık (kullanıcı kuralı). Kullanım: bash tools/kd_b1p2_ses.sh <video.mp4> <cikis.mp4>
set -euo pipefail
V="$1"; O="$2"
E=public/ses/efekt; P=public/voice/kd-b1-p2
SON=24.2667
p="apad=whole_dur=$SON"
args=(-i "$E/kd_oda_tonu.mp3" -i "$E/kd_horlama.mp3" -i "$E/kd_horlama.mp3" -i "$P/acilis_01.mp3" -i "$P/acilis_02.mp3" -i "$E/kd_nefes_mont.mp3" -i "$P/acilis_03.mp3" -i "$P/acilis_04.mp3")
f="[1]aloop=loop=4:size=288000,atrim=0:$SON,afade=t=in:d=0.4,volume=-27dB,$p[oda];"
# horlama 1: ilk 3 sn güvenlik kamerası mikrofonu (bant geçiren, tek kanal, cızırtılı), sonra dolgun
f+="[2]asplit=2[h1][h2];"
f+="[h1]atrim=0:3,highpass=f=350,lowpass=f=3200,acrusher=bits=10:mix=0.25,volume=-3dB,$p[hk];"
f+="[h2]atrim=3:6,asetpts=PTS-STARTPTS,adelay=3000|3000,$p[hd];"
f+="[3]atrim=0:5.5,afade=t=out:st=5.3:d=0.2,adelay=6000|6000,$p[h3];"
f+="[4]adelay=11700|11700,volume=-1dB,$p[s1];"
f+="[5]adelay=14700|14700,volume=0dB,$p[s2];"
f+="[6]atrim=0:1.2,adelay=16967|16967,volume=-9dB,$p[kum];"
f+="[7]adelay=18500|18500,volume=-1dB,$p[s3];"
f+="[8]adelay=20100|20100,volume=-2dB,$p[s4];"
f+="[oda][hk][hd][h3][s1][s2][kum][s3][s4]amix=inputs=9:normalize=0,atrim=0:$SON,volume=4.3dB,alimiter=limit=0.8:level=false[a]"
ffmpeg -loglevel error -y -i "$V" "${args[@]}" -filter_complex "$f" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 "$O"
ffmpeg -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:|Peak:" | tail -2
