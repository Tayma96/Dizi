import React from "react";

/* =====================================================================================
 * 7/24 · Ece'nin evindeki banyo (eski İstanbul apartmanı), sabah. İki açı:
 *   ayna: FPS, Ece aynaya bakıyor. BG = aynadaki yansıma (arkasındaki banyo + kapı), karakterler yansımadır.
 *         FG = aynanın çevresindeki fayans duvar (ayna deliği açık), çerçeve, cam parıltısı, lavabo.
 *   kapi: banyonun içinden kapıya bakış. Solda lavabo + ayna (yan açı), sağda kapı ve koridor.
 * Işık: sıcak beyaz tavan lambası + buzlu pencereden sabah ışığı (marketin soğuk ışığının karşıtı).
 * ===================================================================================== */

export type BanyoView = "ayna" | "kapi";
export type BanyoProps = { view: BanyoView; frame: number; doorOpen: number };

const W = 1080;
const H = 1920;
/** ayna (ekran koordinatı) */
const MX1 = 110, MX2 = 970, MY1 = 190, MY2 = 1330;

const Fayans: React.FC<{ x: number; y: number; w: number; h: number; s: number; c1: string; c2: string; line: string }> = ({ x, y, w, h, s, c1, c2, line }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={c1} />
    {new Array(Math.ceil(w / s) + 1).fill(0).map((_, i) =>
      new Array(Math.ceil(h / s) + 1).fill(0).map((__, j) => ((i + j) % 7 === 3 ? <rect key={`${i}-${j}`} x={x + i * s} y={y + j * s} width={s} height={s} fill={c2} /> : null)),
    )}
    {new Array(Math.ceil(w / s) + 1).fill(0).map((_, i) => <path key={`v${i}`} d={`M ${x + i * s} ${y} V ${y + h}`} stroke={line} strokeWidth={3} />)}
    {new Array(Math.ceil(h / s) + 1).fill(0).map((_, j) => <path key={`h${j}`} d={`M ${x} ${y + j * s} H ${x + w}`} stroke={line} strokeWidth={3} />)}
  </g>
);

/** Kapı + arkasında koridor (sıcak ışık, aile fotoğrafları). Kanat içe açılır (sola dönerek). */
const KapiKoridor: React.FC<{ x: number; y: number; w: number; h: number; op: number; id: string }> = ({ x, y, w, h, op, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}k`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c89a62" /><stop offset="1" stopColor="#8a6440" /></linearGradient>
    </defs>
    {/* koridor */}
    <rect x={x} y={y} width={w} height={h} fill={`url(#${id}k)`} />
    <rect x={x} y={y + h * 0.78} width={w} height={h * 0.22} fill="#6a4a30" />
    <rect x={x + w * 0.18} y={y + h * 0.2} width={w * 0.26} height={h * 0.18} fill="#e8dcc0" stroke="#4a3220" strokeWidth={5} />
    <rect x={x + w * 0.24} y={y + h * 0.24} width={w * 0.14} height={h * 0.1} fill="#7a9ab0" />
    <rect x={x + w * 0.56} y={y + h * 0.26} width={w * 0.22} height={h * 0.14} fill="#e8dcc0" stroke="#4a3220" strokeWidth={5} />
    <ellipse cx={x + w * 0.5} cy={y + h * 0.05} rx={w * 0.5} ry={h * 0.12} fill="#fff0c8" opacity={0.35} />
    {/* kasa */}
    <rect x={x - 18} y={y - 18} width={w + 36} height={h + 18} fill="none" stroke="#f2ece0" strokeWidth={20} />
    {/* kanat: içe açılırken daralır (perspektif) */}
    <path d={`M ${x} ${y} L ${x + w * (1 - op * 0.82)} ${y - h * 0.04 * op} L ${x + w * (1 - op * 0.82)} ${y + h + h * 0.04 * op} L ${x} ${y + h} Z`} fill="#f4efe4" stroke="#b8ae9c" strokeWidth={5} />
    <circle cx={x + w * (1 - op * 0.82) - 26 * (1 - op * 0.7)} cy={y + h * 0.52} r={9} fill="#c8a860" stroke="#6a5a30" strokeWidth={2} />
    <path d={`M ${x + 20} ${y + h * 0.12} h ${w * (1 - op * 0.82) - 40} M ${x + 20} ${y + h * 0.88} h ${w * (1 - op * 0.82) - 40}`} stroke="#d8d0c0" strokeWidth={5} />
  </g>
);

/* ------------------------------- AYNA (FPS) ------------------------------- */
const AynaBG: React.FC<BanyoProps> = ({ doorOpen }) => {
  const op = Math.max(0, Math.min(1, doorOpen));
  return (
    <g>
      <defs>
        <radialGradient id="by_lamba" cx="0.5" cy="0.1" r="0.8"><stop offset="0" stopColor="#fff4d8" stopOpacity={0.5} /><stop offset="1" stopColor="#fff4d8" stopOpacity={0} /></radialGradient>
        <linearGradient id="by_pen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d8e8f0" /></linearGradient>
      </defs>
      {/* yansıyan arka duvar: fayans */}
      <Fayans x={0} y={0} w={W} h={H} s={96} c1="#e4eeea" c2="#d4e4de" line="#c4d4ce" />
      {/* tavan */}
      <rect x={0} y={0} width={W} height={300} fill="#f2f2ec" />
      <path d="M 0 300 H 1080" stroke="#c8c8c0" strokeWidth={6} />
      <ellipse cx={500} cy={300} rx={120} ry={26} fill="#fffaf0" stroke="#d8d0c0" strokeWidth={4} />
      {/* buzlu pencere (sabah) */}
      <rect x={170} y={360} width={230} height={260} fill="url(#by_pen)" stroke="#f4f0e8" strokeWidth={14} />
      <path d="M 285 360 V 620 M 170 490 H 400" stroke="#f4f0e8" strokeWidth={8} />
      <rect x={130} y={330} width={310} height={330} fill="#ffffff" opacity={0.18} />
      {/* duş perdesi (sol) */}
      <path d="M 120 700 H 470" stroke="#b8b8b0" strokeWidth={10} />
      <path d="M 130 708 Q 160 1000 140 1500 L 300 1500 Q 320 1000 290 708 Z" fill="#9ac4d8" stroke="#6a94a8" strokeWidth={4} />
      {[170, 210, 250].map((x) => <path key={x} d={`M ${x} 712 Q ${x + 14} 1100 ${x - 4} 1500`} stroke="#7aa6ba" strokeWidth={4} fill="none" />)}
      {/* havlu askısı */}
      <rect x={480} y={760} width={160} height={10} rx={5} fill="#c8c8c0" />
      <path d="M 495 768 L 495 1040 Q 560 1060 625 1040 L 625 768 Z" fill="#e8a8a0" stroke="#b87870" strokeWidth={4} />
      <path d="M 495 980 H 625" stroke="#f4d0c8" strokeWidth={10} />
      {/* kapı (Ece'nin arkasında, sağda) */}
      <KapiKoridor x={700} y={500} w={240} h={1000} op={op} id="bya" />
      {/* lamba havuzu */}
      <rect width={W} height={H} fill="url(#by_lamba)" />
    </g>
  );
};

const AynaFG: React.FC<BanyoProps> = () => (
  <g>
    <defs>
      <clipPath id="byf_duvar"><path d={`M 0 0 H ${W} V ${H} H 0 Z M ${MX1} ${MY1} V ${MY2} H ${MX2} V ${MY1} Z`} clipRule="evenodd" /></clipPath>
      <linearGradient id="byf_cam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity={0.12} /><stop offset="0.5" stopColor="#ffffff" stopOpacity={0} /><stop offset="1" stopColor="#ffffff" stopOpacity={0.08} /></linearGradient>
      <linearGradient id="byf_tezgah" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbfaf6" /><stop offset="1" stopColor="#dcd8cc" /></linearGradient>
      <radialGradient id="byf_lav" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stopColor="#c8ccc8" /><stop offset="1" stopColor="#f6f6f2" /></radialGradient>
    </defs>
    {/* aynanın çevresi: gerçek duvar (yansımadan biraz daha sıcak ve aydınlık) */}
    <g clipPath="url(#byf_duvar)">
      <Fayans x={0} y={0} w={W} h={H} s={120} c1="#eaf2ee" c2="#dce8e2" line="#c8d6d0" />
      <rect width={W} height={H} fill="#fff4dc" opacity={0.12} />
    </g>
    {/* cam parıltısı ve hafif buğu */}
    <rect x={MX1} y={MY1} width={MX2 - MX1} height={MY2 - MY1} fill="url(#byf_cam)" />
    <path d={`M ${MX1 + 60} ${MY1} L ${MX1 + 260} ${MY1} L ${MX1 + 40} ${MY2} L ${MX1} ${MY2} L ${MX1} ${MY1 + 300} Z`} fill="#ffffff" opacity={0.05} />
    <path d={`M ${MX2 - 120} ${MY1} L ${MX2 - 70} ${MY1} L ${MX2 - 300} ${MY2} L ${MX2 - 350} ${MY2} Z`} fill="#ffffff" opacity={0.06} />
    {/* çerçeve: beyaz lake dolap kapağı */}
    <rect x={MX1 - 26} y={MY1 - 26} width={MX2 - MX1 + 52} height={MY2 - MY1 + 52} rx={10} fill="none" stroke="#f6f4ee" strokeWidth={36} />
    <rect x={MX1 - 44} y={MY1 - 44} width={MX2 - MX1 + 88} height={MY2 - MY1 + 88} rx={14} fill="none" stroke="#b8b4a8" strokeWidth={4} />
    <rect x={MX1 - 8} y={MY1 - 8} width={MX2 - MX1 + 16} height={MY2 - MY1 + 16} fill="none" stroke="#9a968a" strokeWidth={4} />
    {/* aynanın üstünde aplik */}
    <rect x={380} y={60} width={320} height={56} rx={26} fill="#fffaf0" stroke="#c8c0b0" strokeWidth={4} />
    <ellipse cx={540} cy={110} rx={260} ry={60} fill="#fff4d8" opacity={0.35} />
    {/* ayna altı rafı */}
    <rect x={80} y={1372} width={920} height={34} rx={8} fill="#f6f4ee" stroke="#b8b4a8" strokeWidth={4} />
    {/* raftakiler: diş fırçası bardağı, parfüm, krem tüpü (kapağı açık), saç tokası */}
    <rect x={150} y={1270} width={70} height={104} rx={10} fill="#a8d0e0" opacity={0.85} stroke="#6a94a8" strokeWidth={4} />
    <path d="M 170 1272 L 158 1180 M 195 1272 L 210 1170" stroke="#e85a6a" strokeWidth={8} strokeLinecap="round" />
    <path d="M 205 1172 l 16 -6" stroke="#ffffff" strokeWidth={8} strokeLinecap="round" />
    <rect x={820} y={1290} width={54} height={84} rx={8} fill="#e8c8e0" stroke="#a87898" strokeWidth={4} />
    <rect x={834} y={1264} width={26} height={28} rx={4} fill="#c8a8b8" stroke="#a87898" strokeWidth={3} />
    {/* tezgâh + lavabo */}
    <path d="M 0 1440 H 1080 V 1920 H 0 Z" fill="url(#byf_tezgah)" />
    <path d="M 0 1440 H 1080" stroke="#ffffff" strokeWidth={6} />
    <path d="M 0 1490 H 1080" stroke="#c8c4b8" strokeWidth={4} />
    <ellipse cx={540} cy={1700} rx={360} ry={150} fill="#f8f8f4" stroke="#b8b8b0" strokeWidth={6} />
    <ellipse cx={540} cy={1720} rx={300} ry={110} fill="url(#byf_lav)" />
    <ellipse cx={540} cy={1760} rx={22} ry={9} fill="#8a8e8a" />
    {/* batarya */}
    <rect x={505} y={1500} width={70} height={56} rx={14} fill="#d8dcde" stroke="#7a7e80" strokeWidth={4} />
    <path d="M 540 1520 Q 540 1600 540 1620" stroke="#c8ccce" strokeWidth={30} strokeLinecap="round" />
    <path d="M 540 1520 Q 540 1600 540 1620" stroke="#ffffff" strokeWidth={6} opacity={0.7} />
    <rect x={505} y={1478} width={70} height={18} rx={6} fill="#b8bcbe" />
    {/* tezgâhta: telefon, sabunluk, açık krem tüpü */}
    <rect x={120} y={1530} width={170} height={84} rx={14} fill="#1e2228" stroke="#0a0b0d" strokeWidth={4} transform="rotate(-8 205 1572)" />
    <rect x={820} y={1520} width={120} height={70} rx={20} fill="#f2e8d0" stroke="#b8a888" strokeWidth={4} />
    <path d="M 760 1640 L 930 1600 L 940 1640 L 772 1684 Z" fill="#f8f6f2" stroke="#c87890" strokeWidth={4} />
    <path d="M 930 1600 l 26 -6 l 4 34 l -24 6 Z" fill="#e87898" stroke="#a85070" strokeWidth={3} />
    <text x={850} y={1652} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={22} fill="#c85878" transform="rotate(-14 850 1652)">AKNE</text>
  </g>
);

/* ------------------------------- KAPI ------------------------------- */
const KapiBG: React.FC<BanyoProps> = ({ doorOpen }) => {
  const op = Math.max(0, Math.min(1, doorOpen));
  return (
    <g>
      <defs>
        <radialGradient id="bk_lamba" cx="0.55" cy="0.05" r="0.8"><stop offset="0" stopColor="#fff4d8" stopOpacity={0.45} /><stop offset="1" stopColor="#fff4d8" stopOpacity={0} /></radialGradient>
        <radialGradient id="bk_vin" cx="0.5" cy="0.45" r="0.8"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.4} /></radialGradient>
      </defs>
      {/* arka duvar (kapının olduğu) */}
      <Fayans x={0} y={0} w={W} h={H} s={100} c1="#e4eeea" c2="#d4e4de" line="#c4d4ce" />
      <rect x={0} y={0} width={W} height={250} fill="#f2f2ec" />
      <path d="M 0 250 H 1080" stroke="#c8c8c0" strokeWidth={6} />
      {/* sol duvar (lavabo + ayna, yan açı) */}
      <path d="M 0 0 L 300 250 L 300 1560 L 0 1920 Z" fill="#d8e4de" />
      {new Array(7).fill(0).map((_, i) => <path key={i} d={`M 0 ${180 + i * 250} L 300 ${400 + i * 175}`} stroke="#c0cec8" strokeWidth={3} />)}
      {[100, 200].map((x) => <path key={x} d={`M ${x} ${(x / 300) * 250} L ${x} ${1920 - (x / 300) * 360}`} stroke="#c0cec8" strokeWidth={3} />)}
      {/* yan açıdan ayna (yansıması parlak) */}
      <path d="M 40 360 L 250 440 L 250 1060 L 40 1110 Z" fill="#c8dce4" stroke="#f6f4ee" strokeWidth={16} />
      <path d="M 70 420 L 140 445 L 90 1080 L 60 1090 Z" fill="#ffffff" opacity={0.25} />
      {/* kapı + koridor (sağda) */}
      <KapiKoridor x={620} y={430} w={340} h={1130} op={op} id="bkk" />
      {/* zemin */}
      <path d="M 300 1560 L 1080 1560 L 1080 1920 L 0 1920 Z" fill="#b8c4c0" />
      {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${300 + i * 98} 1560 L ${i * 135} 1920`} stroke="#a4b0ac" strokeWidth={3} />)}
      {[1640, 1760].map((y) => <path key={y} d={`M 0 ${y} H 1080`} stroke="#a4b0ac" strokeWidth={3} />)}
      {/* tavan lambası */}
      <ellipse cx={620} cy={250} rx={140} ry={28} fill="#fffaf0" stroke="#d8d0c0" strokeWidth={4} />
      <rect width={W} height={H} fill="url(#bk_lamba)" />
      <rect width={W} height={H} fill="url(#bk_vin)" />
    </g>
  );
};

const KapiFG: React.FC<BanyoProps> = () => (
  <g>
    {/* sol önde lavabo tezgâhının ucu */}
    <path d="M 0 1380 L 250 1440 L 250 1500 L 0 1460 Z" fill="#fbfaf6" stroke="#b8b4a8" strokeWidth={5} />
    <path d="M 0 1460 L 250 1500 L 250 1920 L 0 1920 Z" fill="#e8e4da" stroke="#b8b4a8" strokeWidth={5} />
    <rect x={40} y={1560} width={170} height={20} rx={6} fill="#c8c4b8" />
  </g>
);

export const Banyo724BG: React.FC<BanyoProps> = (p) => (p.view === "ayna" ? <AynaBG {...p} /> : <KapiBG {...p} />);
export const Banyo724FG: React.FC<BanyoProps> = (p) => (p.view === "ayna" ? <AynaFG {...p} /> : <KapiFG {...p} />);

export const BANYO724_MARKS = {
  ayna: { ece: { x: 540, y: 1790, size: 1320 }, anne: { x: 820, y: 1480, size: 860 } },
  kapi: { ece: { x: 300, y: 1880, size: 1180 }, anne: { x: 790, y: 1640, size: 1000 } },
};
