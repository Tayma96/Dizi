import React from "react";

/* =====================================================================================
 * Dram (5. dizi) · ailenin mutfağı, akşam. Kamera yemek masasının uzun kenarına bakar.
 *   Arka duvar: solda ocak + tezgâh (anne burada yemek yapar), ortada dantel perdeli pencere (akşam alacası),
 *   sağda buzdolabı (magnetler) ve koridora açılan kapı (baba buradan gelir).
 *   Masa (FG): çiçekli muşamba örtü, tabaklar, ekmek sepeti, çay bardakları. Masanın arkasında sandalyeler:
 *   solda Sıla, ortada babanın yeri, sağda Ahmet.
 * Işık: masanın üstünde sarkan sıcak lamba (anahtar), pencereden soğuk mavi dolgu, ocaktan buhar.
 * ===================================================================================== */

const W = 1080;
const H = 1920;
const OUT = "#1a1412";

export const MutfakDgBG: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / 30;
  return (
    <g>
      <defs>
        <linearGradient id="mk_duvar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8d8b8" /><stop offset="1" stopColor="#d8c49c" /></linearGradient>
        <linearGradient id="mk_pen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4a78" /><stop offset="1" stopColor="#d88a6a" /></linearGradient>
        <radialGradient id="mk_lamba" cx="0.5" cy="0.42" r="0.6"><stop offset="0" stopColor="#ffd890" stopOpacity={0.42} /><stop offset="1" stopColor="#ffd890" stopOpacity={0} /></radialGradient>
        <radialGradient id="mk_vin" cx="0.5" cy="0.5" r="0.78"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.42} /></radialGradient>
        <filter id="mk_bl"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      {/* duvar ve fayans şeridi */}
      <rect width={W} height={H} fill="url(#mk_duvar)" />
      <rect x={0} y={880} width={W} height={300} fill="#f0ece0" />
      {new Array(12).fill(0).map((_, i) => <path key={i} d={`M ${i * 90} 880 V 1180`} stroke="#d8d0c0" strokeWidth={3} />)}
      {[960, 1040, 1120].map((y) => <path key={y} d={`M 0 ${y} H ${W}`} stroke="#d8d0c0" strokeWidth={3} />)}
      {new Array(12).fill(0).map((_, i) => <rect key={`d${i}`} x={i * 90 + 34} y={1000} width={22} height={22} fill="#4a7ab0" opacity={0.5} transform={`rotate(45 ${i * 90 + 45} 1011)`} />)}
      {/* üst dolaplar (sol) */}
      <rect x={0} y={420} width={380} height={300} fill="#b88a58" stroke={OUT} strokeWidth={6} />
      {[0, 1].map((i) => <rect key={i} x={20 + i * 180} y={440} width={160} height={260} fill="#c89a68" stroke="#7a5a38" strokeWidth={4} />)}
      {[0, 1].map((i) => <circle key={`k${i}`} cx={160 + i * 60} cy={660} r={7} fill="#e8d8a8" />)}
      {/* tezgâh + ocak (sol) */}
      <rect x={0} y={1180} width={400} height={200} fill="#b88a58" stroke={OUT} strokeWidth={6} />
      <rect x={0} y={1160} width={410} height={30} fill="#e8e4dc" stroke={OUT} strokeWidth={5} />
      <rect x={120} y={1100} width={240} height={64} rx={6} fill="#f2f2f0" stroke={OUT} strokeWidth={5} />
      {/* tencere + buhar */}
      <path d="M 160 1100 L 170 1030 L 300 1030 L 310 1100 Z" fill="#a8b0b8" stroke={OUT} strokeWidth={5} />
      <rect x={150} y={1020} width={170} height={16} rx={6} fill="#8a929a" stroke={OUT} strokeWidth={4} />
      <path d="M 300 1050 h 40" stroke={OUT} strokeWidth={8} strokeLinecap="round" />
      {[0, 1, 2].map((i) => { const k = ((t * 0.5 + i / 3) % 1); return <path key={i} d={`M ${215 + i * 18} ${1010 - k * 220} q ${18 * Math.sin(t * 2 + i)} -40 0 -80`} stroke="#ffffff" strokeWidth={10} fill="none" opacity={(1 - k) * 0.4} strokeLinecap="round" />; })}
      {/* pencere + dantel perde + saksı */}
      <rect x={430} y={360} width={300} height={460} fill="url(#mk_pen)" stroke="#f4f0e8" strokeWidth={18} />
      <path d="M 580 360 V 820 M 430 590 H 730" stroke="#f4f0e8" strokeWidth={10} />
      <path d="M 420 340 Q 470 600 440 840 L 520 840 Q 520 580 500 340 Z" fill="#fbf8f0" opacity={0.85} />
      <path d="M 740 340 Q 690 600 720 840 L 640 840 Q 640 580 660 340 Z" fill="#fbf8f0" opacity={0.85} />
      {new Array(8).fill(0).map((_, i) => <circle key={i} cx={445 + (i % 2) * 40} cy={400 + i * 55} r={8} fill="none" stroke="#e8e0d0" strokeWidth={3} />)}
      <rect x={410} y={820} width={340} height={24} fill="#f0ece0" stroke={OUT} strokeWidth={4} />
      <path d="M 520 820 L 530 770 L 590 770 L 600 820 Z" fill="#c8643a" stroke={OUT} strokeWidth={4} />
      <path d="M 560 770 q -30 -60 -50 -40 M 560 770 q 0 -70 10 -80 M 560 770 q 30 -50 50 -40" stroke="#3a8a3a" strokeWidth={10} fill="none" strokeLinecap="round" />
      {/* duvar saati */}
      <circle cx={250} cy={300} r={60} fill="#fbf8f0" stroke={OUT} strokeWidth={6} />
      <path d={`M 250 300 L ${250 + Math.sin(t * 0.02) * 30} ${300 - Math.cos(t * 0.02) * 30}`} stroke={OUT} strokeWidth={6} strokeLinecap="round" />
      <path d="M 250 300 L 280 318" stroke={OUT} strokeWidth={4} strokeLinecap="round" />
      {/* buzdolabı (sağ) + magnetler */}
      <rect x={770} y={480} width={200} height={900} rx={16} fill="#f2f2ee" stroke={OUT} strokeWidth={6} />
      <path d="M 770 820 H 970" stroke={OUT} strokeWidth={5} />
      <rect x={940} y={560} width={12} height={160} rx={6} fill="#c8c8c4" />
      <rect x={940} y={880} width={12} height={220} rx={6} fill="#c8c8c4" />
      {[[800, 560, "#e84a3a"], [860, 600, "#3a8ad8"], [820, 900, "#f2c830"], [880, 980, "#3ab86a"]].map(([x, y, c], i) => <rect key={i} x={x as number} y={y as number} width={34} height={28} rx={5} fill={c as string} stroke={OUT} strokeWidth={2} />)}
      <rect x={800} y={640} width={90} height={110} fill="#fbfaf4" stroke="#8a8a8a" strokeWidth={3} transform="rotate(-4 845 695)" />
      <rect x={812} y={652} width={66} height={58} fill="#8ab0d0" transform="rotate(-4 845 695)" />
      {/* koridora açılan kapı (en sağ) */}
      <rect x={990} y={420} width={90} height={960} fill="#3a2c22" />
      <rect x={984} y={410} width={96} height={20} fill="#f4efe4" />
      <rect x={984} y={420} width={16} height={960} fill="#f4efe4" />
      {/* zemin */}
      <rect x={0} y={1380} width={W} height={540} fill="#a8784a" />
      {new Array(10).fill(0).map((_, i) => <path key={i} d={`M ${i * 120} 1380 L ${i * 130 - 60} 1920`} stroke="#8a5e38" strokeWidth={4} />)}
      {/* sandalye arkalıkları (masanın arkasında) */}
      {[250, 530, 810].map((x) => (
        <g key={x}>
          <rect x={x - 120} y={1160} width={240} height={340} rx={18} fill="#8a5a32" stroke={OUT} strokeWidth={6} />
          <rect x={x - 96} y={1186} width={192} height={110} rx={10} fill="#a86e40" stroke="#5a3a20" strokeWidth={4} />
        </g>
      ))}
      {/* sarkıt lamba ve ışığı */}
      <path d="M 540 0 V 240" stroke={OUT} strokeWidth={6} />
      <path d="M 430 320 Q 540 200 650 320 Z" fill="#c8643a" stroke={OUT} strokeWidth={6} />
      <ellipse cx={540} cy={322} rx={110} ry={16} fill="#ffe8b0" />
      <path d="M 440 320 L 120 1500 L 960 1500 L 640 320 Z" fill="#ffe0a0" opacity={0.08} />
      <rect width={W} height={H} fill="url(#mk_lamba)" />
      <rect width={W} height={H} fill="url(#mk_vin)" />
    </g>
  );
};

/** masa (karakterlerin önünde) */
export const MutfakDgFG: React.FC<{ frame: number }> = () => (
  <g>
    <defs>
      <pattern id="mk_musamba" width="120" height="120" patternUnits="userSpaceOnUse">
        <rect width="120" height="120" fill="#f4ece0" />
        <rect width="60" height="60" fill="#e8c8c0" opacity={0.6} />
        <rect x="60" y="60" width="60" height="60" fill="#e8c8c0" opacity={0.6} />
        <circle cx="30" cy="30" r="12" fill="#c83a4a" opacity={0.75} />
        <circle cx="30" cy="30" r="5" fill="#f2c830" />
        <circle cx="90" cy="90" r="12" fill="#c83a4a" opacity={0.75} />
        <circle cx="90" cy="90" r="5" fill="#f2c830" />
        <path d="M 30 44 q 8 10 16 4 M 90 104 q 8 10 16 4" stroke="#3a8a3a" strokeWidth="4" fill="none" />
      </pattern>
    </defs>
    {/* masa üstü (perspektifte) + muşamba */}
    <path d="M 60 1440 L 1020 1440 L 1080 1640 L 0 1640 Z" fill="url(#mk_musamba)" stroke={OUT} strokeWidth={6} />
    <path d="M 0 1640 L 1080 1640 L 1080 1720 L 0 1720 Z" fill="#d8b8a8" stroke={OUT} strokeWidth={5} />
    <path d="M 0 1720 L 1080 1720 L 1080 1920 L 0 1920 Z" fill="#6a4426" />
    <path d="M 40 1720 L 60 1920 M 1040 1720 L 1020 1920" stroke="#4a2e18" strokeWidth={30} />
    {/* tabaklar */}
    {[250, 530, 810].map((x) => (
      <g key={x}>
        <ellipse cx={x} cy={1560} rx={110} ry={34} fill="#fbfaf6" stroke={OUT} strokeWidth={4} />
        <ellipse cx={x} cy={1556} rx={76} ry={22} fill="#e8a048" opacity={0.9} />
        <path d={`M ${x + 128} 1540 l 6 50 M ${x - 130} 1540 l -6 50`} stroke="#b8b8c0" strokeWidth={7} strokeLinecap="round" />
      </g>
    ))}
    {/* ekmek sepeti, çay bardakları, tuzluk */}
    <path d="M 380 1490 Q 390 1460 470 1462 Q 540 1460 552 1490 L 540 1520 L 392 1520 Z" fill="#b8844a" stroke={OUT} strokeWidth={4} />
    <ellipse cx={440} cy={1478} rx={42} ry={16} fill="#f2d49a" stroke="#9a6a2a" strokeWidth={3} />
    {[640, 680].map((x) => (
      <g key={x}>
        <path d={`M ${x - 14} 1470 Q ${x - 20} 1500 ${x - 12} 1522 L ${x + 12} 1522 Q ${x + 20} 1500 ${x + 14} 1470 Z`} fill="#c84a1a" opacity={0.85} stroke={OUT} strokeWidth={3} />
        <ellipse cx={x} cy={1524} rx={22} ry={6} fill="#f4f4f0" stroke={OUT} strokeWidth={2} />
      </g>
    ))}
    <rect x={930} y={1470} width={26} height={44} rx={8} fill="#f4f4f0" stroke={OUT} strokeWidth={3} />
  </g>
);

export const MUTFAK_DG_MARKS = {
  sila: { x: 250, y: 1690, size: 900, sit: true },
  baba: { x: 530, y: 1690, size: 960, sit: true },
  ahmet: { x: 810, y: 1690, size: 960, sit: true },
  anne_ocak: { x: 120, y: 1400, size: 880 },
  anne_masa: { x: 400, y: 1600, size: 1040 },
  anne_ahmet: { x: 980, y: 1600, size: 1040 },
  kapi: { x: 1030, y: 1390, size: 900 },
};
