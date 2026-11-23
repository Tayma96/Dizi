import React from "react";

/* =====================================================================================
 * 7/24 · Ece'nin evi, antre (eski İstanbul apartmanı dairesi), sabah. Kamera evin içinden giriş kapısına bakar.
 *   Ortada çelik daire kapısı (içe, kameraya doğru açılır; arkasında apartman sahanlığı), üstte kapı zinciri.
 *   Solda portmanto (askıda montlar, ayakkabılık, küçük ayna), sağda salona açılan geçit (sıcak sabah ışığı;
 *   anne buradan gelir). Zincir: "ev_antre" asılı, "ev_antre_z" takılı.
 * Işık: salondan sağdan sıcak sabah ışığı (anahtar), tavanda kapalı aplik; kapı tarafı biraz gölgede.
 * ===================================================================================== */

export type EvProps = { frame: number; doorOpen: number; zincir: boolean };

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

export const Ev724BG: React.FC<EvProps> = ({ doorOpen, zincir }) => (
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
    {/* kanat */}
    <Kanat op={doorOpen} zincir={zincir} />
    {/* salon ışığı ve vinyet */}
    <rect width={W} height={H} fill="url(#ev_salon)" />
    <rect width={W} height={H} fill="url(#ev_vin)" />
  </g>
);

export const Ev724FG: React.FC<EvProps> = () => null;

export const EV724_MARKS = {
  ece_kapi: { x: 560, y: 1760, size: 1180 },
  ece_giris: { x: 560, y: 1620, size: 1080 },
  anne: { x: 900, y: 1700, size: 1150 },
  anne_yan: { x: 770, y: 1770, size: 1200 },
};
