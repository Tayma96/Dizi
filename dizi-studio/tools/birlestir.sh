#!/usr/bin/env bash
# Parçaları birleştirip tam bölüm: bash tools/birlestir.sh <bolum-id>
# ../bolumler/<id>-parca1..N.mp4 → ../bolumler/<id>.mp4 (tek geçişte -14 LUFS, parçalar arası ses zıplamaz)
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"; LIST=$(mktemp)
for f in $(ls ../bolumler/"$EP"-parca*.mp4 | sort -V); do echo "file '$(realpath "$f")'" >> "$LIST"; done
cat "$LIST"
# iki geçiş: önce ölç, sonra doğrusal uygula (tek geçiş aşırı sıkıştırır)
M=$(ffmpeg -hide_banner -f concat -safe 0 -i "$LIST" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$M" | python3 -c "import sys,json;print(json.load(sys.stdin)['$1'])"; }
LN="loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,alimiter=limit=0.84:level=false"
ffmpeg -y -v error -f concat -safe 0 -i "$LIST" -c:v copy -af "$LN" -ar 48000 -c:a aac -b:a 192k "../bolumler/$EP.mp4"
rm -f "$LIST"
ffprobe -v error -show_entries format=duration -of csv=p=0 "../bolumler/$EP.mp4" | xargs -I{} echo "✓ ../bolumler/$EP.mp4 ({} sn)"
