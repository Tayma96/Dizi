#!/usr/bin/env bash
# Yeni bir oturumda üretim ortamını kurar: Node paketleri + ücretsiz TTS (Chatterbox, MIT) + Whisper (MIT).
# İlk çalıştırmada modeller (~3 GB) Hugging Face'ten iner.
# Kullanım: bash tools/kurulum.sh [--modelsiz]   (--modelsiz: modelleri ilk kullanımda indir)
set -euo pipefail
cd "$(dirname "$0")/.."
T="${TTS_DIR:-/opt/tts}"
npm ci --no-audit --no-fund
# venv var ama paketler yarım kalmışsa (ör. ağ hatası) yeniden dene
if ! "$T/venv/bin/python" -c "import torch, faster_whisper" 2>/dev/null; then
  mkdir -p "$T"
  [ -x "$T/venv/bin/python" ] || python3 -m venv "$T/venv"
  "$T/venv/bin/pip" install -q --upgrade pip
  "$T/venv/bin/pip" install -q torch torchaudio --index-url https://download.pytorch.org/whl/cpu
  "$T/venv/bin/pip" install -q chatterbox-tts==0.1.7 --no-deps
  "$T/venv/bin/pip" install -q "numpy>=2" librosa==0.11.0 s3tokenizer transformers==5.2.0 diffusers==0.29.0 \
    resemble-perth conformer==0.3.2 "safetensors>=0.5.3" pyloudnorm omegaconf pykakasi==2.3.0 soundfile \
    spacy-pkuseg faster-whisper num2words scipy
fi
[ "${1:-}" = "--modelsiz" ] && { echo "Kurulum tamam (modeller ilk kullanımda inecek)"; exit 0; }
# Modelleri önceden indir (önbelleğe)
"$T/venv/bin/python" - <<'PY'
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel
ChatterboxMultilingualTTS.from_pretrained(device="cpu")
WhisperModel("small", device="cpu", compute_type="int8")
print("TTS + Whisper hazır")
PY
