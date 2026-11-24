#!/usr/bin/env bash
# Kırmızı Düğme · B1 Parça 2 devamı (KDP2Devam, 680 kare = 22,67 sn) ses miksi.
# Kareler (kd/p2bSes.ts): C1 kız kalkar 0 (kumaş) · C2 teyze 75 (kumaş) · C3 göbekli sürünür 150 (kumaş + nefes nefese)
# · kurye c_01 272 · kız c_02 452 · göbekli c_03 551. Oda tonu kısık, yankılı oda.
# Kullanım: bash tools/kd_b1p2b_ses.sh <video.mp4> <cikis.mp4>
set -euo pipefail
V="$1"; O="$2"
E=public/ses/efekt; P=public/voice/kd-b1-p2b
SON=22.6667
p="apad=whole_dur=$SON"
args=(-i "$E/kd_oda_tonu.mp3" -i "$E/kd_nefes_mont.mp3" -i "$E/kd_nefes_mont.mp3" -i "$E/kd_nefes_mont.mp3" -i public/voice/kd-b1-p2/acilis_04.mp3 -i "$P/c_01.mp3" -i "$P/c_02.mp3" -i "$P/c_03.mp3")
f="[1]aloop=loop=4:size=288000,atrim=0:$SON,afade=t=in:d=0.2,volume=-27dB,$p[oda];"
f+="[2]atrim=0:1.5,volume=-12dB,$p[k1];"
f+="[3]atrim=0:1.5,adelay=2500|2500,volume=-14dB,$p[k2];"
f+="[4]atrim=0:1.8,adelay=5000|5000,volume=-11dB,$p[k3];"
f+="[5]atrim=1.6:3.6,asetpts=PTS-STARTPTS,afade=t=out:st=1.7:d=0.3,adelay=5100|5100,volume=-8dB,$p[gn];"
f+="[6]adelay=9067|9067,volume=-1dB,$p[s1];"
f+="[7]adelay=15067|15067,volume=0dB,$p[s2];"
f+="[8]adelay=18367|18367,volume=-1dB,$p[s3];"
f+="[oda][k1][k2][k3][gn][s1][s2][s3]amix=inputs=8:normalize=0,atrim=0:$SON,volume=4dB,alimiter=limit=0.8:level=false[a]"
ffmpeg -loglevel error -y -i "$V" "${args[@]}" -filter_complex "$f" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 "$O"
ffmpeg -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:|Peak:" | tail -2
