#!/usr/bin/env bash
# Kullanım: bash tools/render.sh <KompozisyonId> <bolum-id>
# Çıktı: ../bolumler/<bolum-id>.mp4 (tam bölüm, -14 LUFS) + ../bolumler/<bolum-id>-parca<N>.mp4 (Reels/Shorts)
set -euo pipefail
cd "$(dirname "$0")/.."
COMP="$1"; EP="$2"
OUTDIR="../bolumler"; mkdir -p "$OUTDIR" out
master() { ffmpeg -y -v error -i "$1" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k "$2"; }
npx remotion render "$COMP" "out/$EP.mp4" --gl=swangle --concurrency=4 --props="{\"episodeId\":\"$EP\",\"part\":0}"
master "out/$EP.mp4" "$OUTDIR/$EP.mp4"
PARTS=$(node -e "const s=require('./public/episodes/$EP.json');console.log(1+s.scenes.slice(1).filter(x=>x.partBreak).length)")
if [ "$PARTS" -gt 1 ]; then
  for i in $(seq 1 "$PARTS"); do
    npx remotion render "$COMP" "out/$EP-parca$i.mp4" --gl=swangle --concurrency=4 --props="{\"episodeId\":\"$EP\",\"part\":$i}"
    master "out/$EP-parca$i.mp4" "$OUTDIR/$EP-parca$i.mp4"
  done
fi
ls -la "$OUTDIR" | grep "$EP"
