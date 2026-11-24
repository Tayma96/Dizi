#!/usr/bin/env bash
# 7/24 B7 v3: render çıktısını −14 LUFS'e getirip bolumler/ altına yazar.
# Kullanım: tools/b7v3_bitir.sh p1 [p2 p3]
set -euo pipefail
K="$(cd "$(dirname "$0")/.." && pwd)"
for p in "$@"; do
  src="$K/out/724-07-$p.mp4"; dst="$K/../bolumler/724-07-$p.mp4"
  I=$(ffmpeg -nostats -i "$src" -af ebur128 -f null - 2>&1 | grep -A3 "Summary" | grep "I:" | awk '{print $2}')
  G=$(python3 -c "print(round(-14.6-($I),2))")
  ffmpeg -v error -y -i "$src" -c:v copy -af "volume=${G}dB,alimiter=limit=0.89:level=false:attack=1:release=50" -c:a aac -b:a 256k "$dst"
  I2=$(ffmpeg -nostats -i "$dst" -af ebur128 -f null - 2>&1 | grep -A3 "Summary" | grep "I:" | awk '{print $2}')
  echo "$p: giriş $I LUFS, kazanç $G dB → çıkış $I2 LUFS ($dst)"
done
