#!/usr/bin/env bash
# Tek parça render: bash tools/parca.sh <bolum-id> <parca-no> [Kompozisyon=GKK-B1]
# Çıktı: ../bolumler/<bolum-id>-parca<N>.mp4 (değişen parça tek başına yeniden üretilir)
set -euo pipefail
cd "$(dirname "$0")/.."
EP="$1"; N="$2"; COMP="${3:-GKK-B1}"
BROWSER=""; [ -x /opt/pw-browsers/chromium_headless_shell ] && BROWSER="--browser-executable=/opt/pw-browsers/chromium_headless_shell"
mkdir -p out ../bolumler
npx remotion render src/index.ts "$COMP" "out/$EP-parca$N.mp4" --concurrency=4 $BROWSER --props="{\"episodeId\":\"$EP\",\"part\":$N}"
cp "out/$EP-parca$N.mp4" "../bolumler/$EP-parca$N.mp4"
echo "✓ ../bolumler/$EP-parca$N.mp4"
