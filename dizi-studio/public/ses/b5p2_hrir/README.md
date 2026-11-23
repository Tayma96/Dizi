# SADIE KU100 3. derece SH-HRIR (B5 2. parça binaural)

- Dosya: `sadie_ku100_toa_sh_hrir_48k.wav`: 16 kanal (ACN sırası, SN3D/AmbiX), 48 kHz, 256 örnek, yalnız SOL kulak; sağ kulak m<0 kanallarının işareti çevrilerek bulunur (kafa simetrisi).
- Kaynak: npm `omnitone@1.3.0` paketi, `test/resources/omnitone-toa-hrir-base64.js` (Google, Omnitone/Resonance Audio). Filtreler York Üniversitesi SADIE projesinin Neumann KU100 ölçümlerinden türetilmiştir.
- Lisans: Apache License 2.0 (paketle gelen metin: `LICENSE-Apache-2.0.txt`). Ticari kullanım serbest; lisans metni ve kaynak bildirimi korunmalı.
- Üretim: `/opt/tts/venv/bin/python tools/ses_724_05_p2.py hrir`. Kullanım: `tools/ses_724_05_p2.py` (render).
