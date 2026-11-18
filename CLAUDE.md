# Dizi

Remotion (React ile programatik video) kullanılarak dizi/bölüm üretme projesi.

- Remotion projesi: `dizi-studio/` (`npm i`, `npm run dev` ile Studio, `npx remotion render <CompId> out/<ad>.mp4` ile render)
- Remotion agent skill'leri `.claude/skills/remotion-*` altında (kaynak: github.com/remotion-dev/skills).
  Remotion ile ilgili her işte önce `remotion-best-practices` skill'ini yükle.

## Dizi: "Geç Kaldım Kızım"
- Kod: `dizi-studio/src/dizi/` — `Character.tsx` (karakter rig'i: göz kırpma, nefes, konuşma ağzı, gözyaşı), `Sets.tsx` (mekanlar), `Subtitles.tsx` (kelime kelime altyazı), `Episode1.tsx` (bölüm kurgusu).
- Format: 1080x1920 dikey, 30fps. Sesler `public/audio/` (ffmpeg ile sentezlendi), fontlar `public/fonts/` (OFL).
- Render: `cd dizi-studio && npx remotion render Bolum1 out/b1.mp4` — çıktılar `bolumler/` klasörüne kopyalanır.
