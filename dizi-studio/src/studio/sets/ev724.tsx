import React from "react";

/* =====================================================================================
 * 7/24 · Ece'nin evi, antre (eski İstanbul apartmanı dairesi), sabah. Kamera evin içinden giriş kapısına bakar.
 *   Ortada çelik daire kapısı (içe, kameraya doğru açılır; arkasında apartman sahanlığı), üstte kapı zinciri.
 *   Solda portmanto (askıda montlar, ayakkabılık, küçük ayna), sağda salona açılan geçit (sıcak sabah ışığı;
 *   anne buradan gelir). Zincir: "ev_antre" asılı, "ev_antre_z" takılı.
 * Işık: salondan sağdan sıcak sabah ışığı (anahtar), tavanda kapalı aplik; kapı tarafı biraz gölgede.
 * ===================================================================================== */

export type EvProps = { frame: number; doorOpen: number; zincir: boolean; /** akşam: güneş huzmesi yok, sıcak lamba */ gece?: boolean; /** kanat karakterlerin ÖNÜNDE (FG) çizilir: Ece sahanlıkta, kapının arkasında */ kanatOnde?: boolean };

const W = 1080;
const H = 1920;
const O = "#2a2018";
/** kapı (ekran koordinatı) */
const KX1 = 380, KX2 = 720, KY1 = 470, KY2 = 1600;

const Sahanlik: React.FC = () => (
  <g>
    <rect x={KX1} y={KY1} width={KX2 - KX1} height={KY2 - KY1} fill="#8a8c84" />
    <rect x={KX1} y={KY1} width={KX2 - KX1} height={420} fill="#9a9c92" />
    <rect x={KX1} y={KY2 - 170} width={KX2 - KX1} height={170} fill="#6a6a62" />
    {/* karşı dairenin kapısı ve merdiven korkuluğu */}
    <rect x={KX1 + 60} y={KY1 + 170} width={150} height={KY2 - KY1 - 340} fill="#6a4a36" stroke={O} strokeWidth={4} />
    <path d={`M ${KX2 - 90} ${KY1 + 560} L ${KX2} ${KY1 + 470} M ${KX2 - 90} ${KY1 + 560} V ${KY2 - 170}`} stroke="#3a3a36" strokeWidth={8} />
    <rect x={KX1} y={KY1} width={KX2 - KX1} height={KY2 - KY1} fill="#000" opacity={0.18} />
  </g>
);

/** Kanat: menteşe solda, kameraya doğru açılır (sağ kenarı büyüyüp sola kayar) */
const Kanat: React.FC<{ op: number; zincir: boolean }> = ({ op, zincir }) => {
  const k = Math.max(0, Math.min(1, op));
  const rx = KX2 - (KX2 - KX1) * 0.85 * k - 120 * k; // sağ kenar sola kayar
  const ey = 150 * k; // sağ kenar kameraya yaklaştıkça uzar
  const pts = `M ${KX1} ${KY1} L ${rx} ${KY1 - ey} L ${rx} ${KY2 + ey * 0.6} L ${KX1} ${KY2} Z`;
  const w = rx - KX1;
  const X = (u: number) => KX1 + w * u;
  const Y = (u: number, v: number) => KY1 + (KY2 - KY1) * v + (v < 0.5 ? -ey * u * (1 - 2 * v) : ey * 0.6 * u * (2 * v - 1));
  return (
    <g>
      <path d={pts} fill="#5a3a26" stroke={O} strokeWidth={6} />
      {/* panolar */}
      {[[0.12, 0.08, 0.88, 0.45], [0.12, 0.55, 0.88, 0.92]].map(([u1, v1, u2, v2], i) => (
        <path key={i} d={`M ${X(u1)} ${Y(u1, v1)} L ${X(u2)} ${Y(u2, v1)} L ${X(u2)} ${Y(u2, v2)} L ${X(u1)} ${Y(u1, v2)} Z`} fill="#6a4630" stroke="#3a2416" strokeWidth={4} />
      ))}
      {k < 0.15 ? (
        <g>
          {/* dürbün */}
          <circle cx={X(0.5)} cy={Y(0.5, 0.3)} r={9} fill="#c8a860" stroke={O} strokeWidth={3} />
          {/* kol + kilit göbeği (sağda) */}
          <rect x={X(0.86) - 12} y={Y(0.86, 0.5) - 40} width={24} height={110} rx={8} fill="#c8a860" stroke={O} strokeWidth={3} />
          <path d={`M ${X(0.86)} ${Y(0.86, 0.5) - 20} h -70`} stroke="#d8b870" strokeWidth={16} strokeLinecap="round" />
          <circle cx={X(0.86)} cy={Y(0.86, 0.5) + 45} r={10} fill="#8a7040" stroke={O} strokeWidth={2} />
          {/* zincir rayı (kanatta) */}
          <rect x={X(0.8) - 50} y={Y(0.8, 0.33) - 10} width={70} height={20} rx={5} fill="#b8b4a8" stroke={O} strokeWidth={3} />
        </g>
      ) : null}
      {/* zincir: kasadaki plaka sağda */}
      {k < 0.15 ? (
        zincir ? (
          <g>
            <path d={`M ${KX2 + 22} ${Y(1, 0.33)} L ${X(0.8) - 40} ${Y(0.8, 0.33)}`} stroke="#c8c4b8" strokeWidth={7} strokeDasharray="10 5" />
            <circle cx={X(0.8) - 40} cy={Y(0.8, 0.33)} r={9} fill="#d8d4c8" stroke={O} strokeWidth={3} />
          </g>
        ) : (
          <g>
            <path d={`M ${KX2 + 22} ${Y(1, 0.33)} Q ${KX2 + 10} ${Y(1, 0.33) + 90} ${KX2 + 4} ${Y(1, 0.33) + 140}`} stroke="#c8c4b8" strokeWidth={7} strokeDasharray="10 5" fill="none" />
            <circle cx={KX2 + 4} cy={Y(1, 0.33) + 146} r={9} fill="#d8d4c8" stroke={O} strokeWidth={3} />
          </g>
        )
      ) : null}
    </g>
  );
};

export const Ev724BG: React.FC<EvProps> = ({ doorOpen, zincir, kanatOnde }) => (
  <g>
    <defs>
      <linearGradient id="ev_duvar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d8c8a8" /><stop offset="1" stopColor="#e8d8b8" /></linearGradient>
      <linearGradient id="ev_zemin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a6a42" /><stop offset="1" stopColor="#7a5232" /></linearGradient>
      <radialGradient id="ev_salon" cx="1" cy="0.55" r="0.7"><stop offset="0" stopColor="#ffe6b0" stopOpacity={0.55} /><stop offset="1" stopColor="#ffe6b0" stopOpacity={0} /></radialGradient>
      <radialGradient id="ev_vin" cx="0.5" cy="0.45" r="0.8"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.35} /></radialGradient>
    </defs>
    {/* arka duvar + tavan */}
    <rect width={W} height={H} fill="url(#ev_duvar)" />
    <rect width={W} height={300} fill="#efe6d4" />
    <path d="M 0 300 H 1080" stroke="#c8b898" strokeWidth={6} />
    <rect x={0} y={1380} width={W} height={24} fill="#b89a72" />
    {/* kapı boşluğu: sahanlık + kasa */}
    <Sahanlik />
    <rect x={KX1 - 22} y={KY1 - 22} width={KX2 - KX1 + 44} height={KY2 - KY1 + 22} fill="none" stroke="#efe6d4" strokeWidth={24} />
    {/* sol: portmanto (askılar, montlar, ayna, ayakkabılık) */}
    <rect x={60} y={560} width={250} height={20} rx={6} fill="#7a5232" stroke={O} strokeWidth={3} />
    {[100, 170, 240].map((x) => <circle key={x} cx={x} cy={600} r={9} fill="#c8a860" stroke={O} strokeWidth={2} />)}
    <path d="M 88 600 Q 70 760 84 940 L 160 940 Q 170 760 112 600 Z" fill="#3a4a5a" stroke={O} strokeWidth={4} />
    <path d="M 156 600 Q 140 800 150 1020 L 240 1020 Q 250 800 184 600 Z" fill="#b84a3a" stroke={O} strokeWidth={4} />
    <path d="M 230 602 Q 236 700 228 800 L 286 800 Q 286 700 252 602 Z" fill="#d8c070" stroke={O} strokeWidth={4} />
    <rect x={70} y={1120} width={240} height={290} rx={6} fill="#8a6040" stroke={O} strokeWidth={4} />
    <path d="M 190 1120 V 1410" stroke={O} strokeWidth={3} />
    <circle cx={175} cy={1260} r={6} fill="#c8a860" /><circle cx={205} cy={1260} r={6} fill="#c8a860" />
    <rect x={120} y={1070} width={60} height={50} rx={6} fill="#5a8ab0" stroke={O} strokeWidth={3} />
    {/* duvarda aile fotoğrafı (Ece küçükken annesiyle) ve anahtarlık */}
    <rect x={180} y={330} width={150} height={190} fill="#f4ecd8" stroke="#6a4a30" strokeWidth={10} />
    <rect x={198} y={348} width={114} height={130} fill="#9ab8c8" />
    <circle cx={238} cy={400} r={20} fill="#eec4a2" /><path d="M 216 470 Q 238 420 260 470 Z" fill="#8a4a5a" />
    <circle cx={280} cy={420} r={13} fill="#f0c8a8" /><path d="M 266 470 Q 280 438 294 470 Z" fill="#e8a0b8" />
    <rect x={300} y={1040} width={50} height={20} rx={4} fill="#c8a860" stroke={O} strokeWidth={2} />
    {/* sağ: salona geçit (sıcak ışık) */}
    <rect x={800} y={440} width={280} height={1160} fill="#f6dca8" />
    <rect x={800} y={1380} width={280} height={220} fill="#c89a62" />
    <rect x={880} y={620} width={150} height={220} fill="#e8f0f4" stroke="#c8b890" strokeWidth={8} />
    <path d="M 955 620 V 840 M 880 730 H 1030" stroke="#c8b890" strokeWidth={6} />
    <rect x={790} y={430} width={20} height={1170} fill="#efe6d4" />
    {/* zemin (laminat) + paspas */}
    <path d="M 0 1600 H 1080 V 1920 H 0 Z" fill="url(#ev_zemin)" />
    {new Array(10).fill(0).map((_, i) => <path key={i} d={`M ${i * 130 - 60} 1600 L ${i * 170 - 330} 1920`} stroke="#6a4428" strokeWidth={3} opacity={0.6} />)}
    <path d="M 360 1610 L 740 1610 L 790 1700 L 310 1700 Z" fill="#8a3a3a" stroke="#5a2424" strokeWidth={4} />
    {/* kanat (kanatOnde ise FG'de, karakterlerin önünde) */}
    {kanatOnde ? null : <Kanat op={doorOpen} zincir={zincir} />}
    {/* salon ışığı ve vinyet */}
    <rect width={W} height={H} fill="url(#ev_salon)" />
    <rect width={W} height={H} fill="url(#ev_vin)" />
  </g>
);

/** Salon penceresinden gelen sabah güneşi: çapraz huzmeler + uçuşan toz (karakterleri de aydınlatır) */
export const Ev724FG: React.FC<EvProps> = ({ frame, doorOpen, zincir, kanatOnde, gece }) => {
  const t = frame / 30;
  return (
    <g>
    {kanatOnde ? <Kanat op={doorOpen} zincir={zincir} /> : null}
    {gece ? <g><rect width={W} height={H} fill="#2a1a30" opacity={0.18} /><ellipse cx={560} cy={360} rx={520} ry={620} fill="#ffd090" opacity={0.16} /></g> : null}
    <g style={{ mixBlendMode: "screen" }} opacity={gece ? 0 : 1}>
      <defs>
        <linearGradient id="evf_h" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd890" stopOpacity={0.42} /><stop offset="1" stopColor="#ffb860" stopOpacity={0} /></linearGradient>
        <filter id="evf_b"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      {[[0, 150], [210, 110], [380, 70]].map(([d, w], i) => (
        <path key={i} d={`M ${1080} ${560 + d} L ${1080} ${560 + d + w} L ${260 - d * 0.4} ${1920} L ${60 - d * 0.4 - w} ${1920} Z`} fill="url(#evf_h)" filter="url(#evf_b)" opacity={0.85 + 0.15 * Math.sin(t * 0.7 + i)} />
      ))}
      {new Array(26).fill(0).map((_, i) => {
        const x = 1080 - ((i * 137 + t * 14 * (1 + (i % 3))) % 900);
        const y = 700 + ((i * 211) % 1100) + Math.sin(t * 0.9 + i) * 18;
        return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="#fff0c8" opacity={0.35 + 0.3 * Math.abs(Math.sin(t * 1.3 + i))} />;
      })}
    </g>
    </g>
  );
};

export const EV724_MARKS = {
  ece_kapi: { x: 560, y: 1760, size: 1180 },
  ece_giris: { x: 560, y: 1620, size: 1080 },
  anne: { x: 900, y: 1700, size: 1150 },
  anne_yan: { x: 770, y: 1770, size: 1200 },
};

/* =====================================================================================
 * 7/24 · Ece'nin evi, SALON (B7 p3), akşam: arkada sofra, solda Ece'nin oda kapısı, sağda antreye geçiş.
 * Karakterler masanın ARKASINDA durur (ayak y≈1640); masa ve üstündekiler FG'de çizilir.
 * ===================================================================================== */
export const Ev724SalonBG: React.FC<{ frame: number; odaKapi: number }> = ({ odaKapi }) => (
  <g>
    <defs>
      <linearGradient id="sl_duvar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6d2b0" /><stop offset="1" stopColor="#d4bc96" /></linearGradient>
      <radialGradient id="sl_lamba" cx="0.5" cy="0.42" r="0.55"><stop offset="0" stopColor="#ffe0a0" stopOpacity={0.45} /><stop offset="1" stopColor="#ffe0a0" stopOpacity={0} /></radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#sl_duvar)" />
    {/* duvar kâğıdı deseni */}
    {new Array(10).fill(0).map((_, i) => new Array(12).fill(0).map((__, j) => (
      <path key={`${i}-${j}`} d={`M ${i * 120 + (j % 2) * 60} ${300 + j * 110} l 8 -12 l 8 12 l -8 12 Z`} fill="#c8ae86" opacity={0.45} />
    )))}
    <rect width={W} height={300} fill="#efe4cc" />
    <path d="M 0 300 H 1080" stroke="#c8b08a" strokeWidth={8} />
    <rect x={0} y={1580} width={W} height={30} fill="#a8865c" />
    <rect x={0} y={1610} width={W} height={310} fill="#8a6440" />
    {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${i * 135} 1610 L ${i * 170 - 140} 1920`} stroke="#6a4a2c" strokeWidth={3} opacity={0.6} />)}
    {/* pencere: gece, perdeler */}
    <rect x={400} y={500} width={300} height={430} fill="#1c2440" stroke="#f4ece0" strokeWidth={16} />
    {[[430, 600], [470, 700], [600, 560], [640, 760], [520, 820], [660, 650]].map(([x, y], i) => <rect key={i} x={x} y={y} width={20} height={16} fill="#ffcf70" opacity={0.6} />)}
    <path d="M 550 500 V 930 M 400 715 H 700" stroke="#f4ece0" strokeWidth={9} />
    <path d="M 360 470 Q 400 700 370 960 L 430 960 Q 450 700 420 470 Z" fill="#b8584a" stroke="#6a2a20" strokeWidth={4} />
    <path d="M 740 470 Q 700 700 730 960 L 670 960 Q 650 700 680 470 Z" fill="#b8584a" stroke="#6a2a20" strokeWidth={4} />
    <rect x={340} y={458} width={420} height={18} rx={8} fill="#8a6440" />
    {/* duvarda saat ve tablo */}
    <circle cx={880} cy={520} r={54} fill="#f8f4ea" stroke="#5a4028" strokeWidth={8} />
    <path d="M 880 520 L 880 482 M 880 520 L 906 532" stroke="#2a1c12" strokeWidth={6} strokeLinecap="round" />
    <rect x={820} y={700} width={170} height={130} fill="#9ab88a" stroke="#6a4a30" strokeWidth={10} />
    <path d="M 830 800 Q 880 740 920 790 Q 950 760 980 800 V 820 H 830 Z" fill="#5a7a4a" />
    {/* solda Ece'nin oda kapısı (içe açılır; açıkken arkası karanlık oda) */}
    <rect x={40} y={560} width={250} height={1050} fill="#2a2430" />
    <rect x={40} y={560} width={250} height={1050} fill="none" stroke="#f2ead8" strokeWidth={22} />
    <path d={`M 40 560 L ${40 + 250 * (1 - 0.8 * odaKapi)} ${560 - 30 * odaKapi} L ${40 + 250 * (1 - 0.8 * odaKapi)} ${1610 + 30 * odaKapi} L 40 1610 Z`} fill="#f6efe2" stroke="#b8ae9c" strokeWidth={5} />
    {odaKapi < 0.5 ? <g><circle cx={258} cy={1100} r={11} fill="#c8a860" stroke="#5a4a2a" strokeWidth={3} />
      <path d="M 110 760 l 8 -26 l 14 22 l 14 -22 l 8 26" stroke="#e87aa0" strokeWidth={6} fill="none" /><text x={160} y={850} textAnchor="middle" fontFamily="Arial" fontSize={34} fontWeight={900} fill="#e87aa0">ECE</text></g> : null}
    {/* sağda antreye geçiş (sıcak koridor ışığı) */}
    <rect x={960} y={540} width={140} height={1070} fill="#f2d8a8" />
    <rect x={950} y={530} width={20} height={1080} fill="#efe4cc" />
    <rect width={W} height={H} fill="url(#sl_lamba)" />
  </g>
);

/** Sofra (FG): masa örtüsü, tabaklar, ekmek, çay bardakları, peynir, domates, zeytin kâsesi (zeytin: kalan sayı) */
export const Ev724SalonFG: React.FC<{ frame: number; tabak2: boolean; zeytin: number; yukari?: number }> = ({ tabak2, zeytin, yukari = 0 }) => (
  <g transform={`translate(0 ${-yukari})`}>
    {/* sarkıt lamba */}
    <path d="M 540 0 V 330" stroke="#3a2a1c" strokeWidth={5} />
    <path d="M 450 400 Q 540 300 630 400 Z" fill="#c8583a" stroke="#5a2418" strokeWidth={5} />
    <ellipse cx={540} cy={402} rx={50} ry={10} fill="#fff2c0" />
    {/* masa */}
    <path d="M 70 1520 L 1010 1520 L 1060 1640 L 20 1640 Z" fill="#f8f4ec" stroke="#8a7a62" strokeWidth={5} />
    <path d="M 20 1640 L 1060 1640 L 1060 1800 L 20 1800 Z" fill="#f2ece0" stroke="#8a7a62" strokeWidth={5} />
    {new Array(14).fill(0).map((_, i) => <rect key={i} x={20 + i * 74.3} y={1770} width={37} height={30} fill="#c8483a" opacity={0.8} />)}
    <rect x={90} y={1800} width={30} height={400} fill="#6a4a2c" /><rect x={960} y={1800} width={30} height={400} fill="#6a4a2c" />
    {/* tabaklar */}
    <ellipse cx={330} cy={1585} rx={86} ry={26} fill="#ffffff" stroke="#9a9488" strokeWidth={4} />
    <ellipse cx={330} cy={1583} rx={56} ry={16} fill="#f2f0ea" />
    {tabak2 ? <g><ellipse cx={760} cy={1585} rx={86} ry={26} fill="#ffffff" stroke="#9a9488" strokeWidth={4} /><ellipse cx={760} cy={1583} rx={56} ry={16} fill="#f2f0ea" /></g> : null}
    {/* ekmek sepeti */}
    <path d="M 470 1560 L 590 1560 L 575 1600 L 485 1600 Z" fill="#b8844c" stroke="#5a3a1c" strokeWidth={4} />
    <path d="M 482 1562 Q 500 1525 530 1540 Q 560 1520 582 1560 Z" fill="#e8b878" stroke="#8a5a2a" strokeWidth={3} />
    {/* çay bardakları */}
    {[[245, 1555], [850, 1555]].map(([x, y], i) => (
      <g key={i}><path d={`M ${x - 14} ${y - 40} Q ${x - 6} ${y - 20} ${x - 12} ${y} L ${x + 12} ${y} Q ${x + 6} ${y - 20} ${x + 14} ${y - 40} Z`} fill="#b8401a" opacity={0.85} stroke="#7a2a10" strokeWidth={3} />
        <ellipse cx={x} cy={y + 6} rx={22} ry={6} fill="#e8e4da" stroke="#9a9488" strokeWidth={2} /></g>
    ))}
    {/* peynir ve domates */}
    <ellipse cx={420} cy={1612} rx={46} ry={13} fill="#ffffff" stroke="#9a9488" strokeWidth={3} />
    <rect x={398} y={1598} width={40} height={16} rx={3} fill="#fffbe8" stroke="#c8c0a0" strokeWidth={2} />
    <ellipse cx={890} cy={1612} rx={42} ry={12} fill="#ffffff" stroke="#9a9488" strokeWidth={3} />
    {[[875, 1604], [902, 1606]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#e23a2a" stroke="#8a1a10" strokeWidth={2} />)}
    {/* zeytin kâsesi */}
    <ellipse cx={650} cy={1578} rx={50} ry={16} fill="#e8e0d0" stroke="#7a6a52" strokeWidth={4} />
    <path d="M 600 1578 Q 650 1620 700 1578" fill="#d8ccb4" stroke="#7a6a52" strokeWidth={4} />
    {[[630, 1572], [648, 1566], [666, 1572], [640, 1580], [660, 1580], [652, 1574]].slice(0, zeytin).map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx={9} ry={7} fill="#2a2228" stroke="#000" strokeWidth={1.5} />
    ))}
  </g>
);
