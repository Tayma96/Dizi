#!/usr/bin/env bash
# Kırmızı Düğme · B1 açılış sahnesi (KDKancaSahne) ses miksi — ElevenLabs efektleri + bağırış + imza klik A.
# Zamanlar (30 fps): 0 nefes+mont · 8 "Duuuuur!" (soldan) · 21 klik (yakın) · 36 kilit+kanatlar · 40 ikaz alarmı
# · 48 gergin nefes · 60 mızrak fırlar · 71 SAPLANMA (güm) · 73 nefesi kesilir · 78 kulak çınlaması + kalp
# · saplanmadan sonra oda ve alarm boğuklaşır (alçak geçiren), 126'ya doğru söner · 126-130 sessizlik
# · 138 başlıkta aynı klik · 178 son. Oda tonu KISIK (kullanıcı: rahatsız etmesin).
# Kullanım: bash tools/kd_kanca_sahne_ses.sh <video.mp4> <cikis.mp4>
set -euo pipefail
V="$1"; O="$2"
E=public/ses/efekt; K=public/ses/kd/klik-A-tok.wav; D=public/voice/kd-kanca/kanca_01.mp3
SAP=2.3667; SONUS=4.2; SON=5.9333
args=(-i "$E/kd_oda_tonu.mp3" -i "$E/kd_nefes_mont.mp3" -i "$D" -i "$K" -i "$E/kd_bolme_acilis.mp3" -i "$E/kd_ikaz_alarm.mp3" -i "$E/kd_nefes_mont.mp3" -i "$E/kd_mizrak_firlama.mp3" -i "$K" -i "$E/kd_mizrak_saplanma.mp3" -i "$E/kd_nefes_kesilme.mp3" -i "$E/kd_cinlama_kalp.mp3")
p="apad=whole_dur=$SON"
# oda tonu: saplanmaya kadar net, sonra boğuk ve sönen (iki kopya)
f="[1]aloop=loop=1:size=288000,asplit=2[o1][o2];"
f+="[o1]atrim=0:$SAP,afade=t=in:d=0.3,volume=-25dB,$p[oda];"
f+="[o2]atrim=$SAP:$SONUS,asetpts=PTS-STARTPTS,lowpass=f=500,volume=-27dB,afade=t=out:st=1.2:d=0.6,adelay=2367|2367,$p[odab];"
f+="[2]volume=-6dB,$p[nef];"
f+="[3]adelay=267|267,pan=stereo|c0=c0|c1=0.5*c0,volume=-1dB,$p[duur];"
f+="[4]adelay=700|700,volume=2dB,$p[k1];"
f+="[5]adelay=1200|1200,volume=-2dB,$p[bol];"
# alarm: net, saplanmadan sonra boğuk
f+="[6]asplit=2[a1][a2];"
f+="[a1]atrim=0:1.0333,volume=-11dB,adelay=1333|1333,$p[alm];"
f+="[a2]atrim=1.0333:3,asetpts=PTS-STARTPTS,lowpass=f=450,volume=-15dB,afade=t=out:st=1.2:d=0.6,adelay=2367|2367,$p[almb];"
f+="[7]adelay=1600|1600,volume=-8dB,atrim=0:$SAP,afade=t=out:st=2.34:d=0.025,$p[nef2];"
f+="[8]adelay=2000|2000,volume=2dB,atrim=0:$SAP,afade=t=out:st=2.352:d=0.014,$p[miz];"
f+="[9]adelay=4600|4600,volume=2dB,$p[k2];"
f+="[10]adelay=2367|2367,volume=3dB,$p[sap];"
f+="[11]adelay=2450|2450,volume=-2dB,$p[kes];"
f+="[12]adelay=2600|2600,volume=-6dB,atrim=0:$SONUS,afade=t=out:st=3.7:d=0.5,$p[cin];"
f+="[oda][odab][nef][duur][k1][bol][alm][almb][nef2][miz][k2][sap][kes][cin]amix=inputs=14:normalize=0,atrim=0:$SON,volume=2dB,alimiter=limit=0.78:level=false[a]"
ffmpeg -loglevel error -y -i "$V" "${args[@]}" -filter_complex "$f" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 "$O"
ffmpeg -i "$O" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:|Peak:" | tail -2
