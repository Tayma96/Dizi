import React from "react";
import { random } from "remotion";

/* =====================================================================================
 * 7/24 B8 · Can Market'in DIŞ cephesi, kasım akşamı ~19:00 (karanlık). Karşı kaldırımdan, cepheye dik bakış.
 *   Kat planıyla aynı market (market724.tsx): dışarıdan bakınca X aynalanır →
 *   solda dolu duvar (içeride sigara dolabı + kasa), ortada-sağda cam vitrin, otomatik kapı (X_dış -0.2..1.2).
 *   İzdüşüm: göz 1,5 m, kaçış noktası (540, 1050), cephe Z = 5 m → 180 px/m. Cephe zemin çizgisi y = 1320, kaldırım kenarı y ≈ 1725.
 *   Dünya: x -420..1500, y -300..2240 arası çizilir (kamera kırpmasında siyah boşluk kalmasın).
 *   Katmanlar: gök + üst katlar (pencerelerde ışık, TV mavisi), ışıklı tabela (pervaneler), vitrin içi (floresan, raflar, kasanın ucu),
 *   kapı (kayar kanatlar, sensör ışığı), komşular (kepenkli dükkân, apartman kapısı), kaldırım + vitrin ışığı yaması, ıslak asfalt.
 * ===================================================================================== */

export const DIS_VY = 1050;
export const DIS_F = 900;
/** dış dünya izdüşümü: X (sağ +), Y (yukarı +, metre), Z (derinlik, metre) → ekran */
export const disP = (X: number, Y: number, Z: number): [number, number] => [540 + (X * DIS_F) / Z, DIS_VY + ((1.5 - Y) * DIS_F) / Z];
const ZF = 5;
const fx = (X: number) => 540 + (X * DIS_F) / ZF;
const fy = (Y: number) => DIS_VY + ((1.5 - Y) * DIS_F) / ZF;
const O = "#1a1418";
const PAKET = ["#d8402e", "#2f6fd0", "#e8a628", "#2f9e5a", "#e86a9a", "#f2f0e6", "#7a4ad0", "#e85a1a"];

export type DisProps = {
  frame: number;
  /** kapı açıklığı 0..1 */
  doorOpen: number;
  /** vitrin içi floresan şiddeti 0..1 */
  flor?: number;
  /** sensör LED'i kırmızı mı (biri önünde) */
  sensor?: boolean;
};

export const Market724DisBG: React.FC<DisProps> = ({ frame, doorOpen, flor = 1, sensor }) => {
  const op = Math.max(0, Math.min(1, doorOpen));
  const fl = flor * (random(`dsf${Math.floor(frame / 3)}`) > 0.985 ? 0.8 : 1);
  const gL = fx(-1.0), gR = fx(2.05), gT = fy(2.6), gB = fy(0.25);
  const dL = fx(-0.2), dR = fx(1.2), dT = fy(2.2), zem = fy(0);
  const mid = (dL + dR) / 2, half = (dR - dL) / 2, sl = half * 0.94 * op;
  const sL = fx(-2.05), sR = fx(2.05);
  // tabela: 7/24 kısmında ara ara cızırtılı titreme (ikincil hareket)
  const tabTit = random(`dst${Math.floor(frame / 2)}`) > 0.93 ? 0.55 : 1;
  return (
    <g>
      <defs>
        <linearGradient id="d8gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070b16" /><stop offset="1" stopColor="#1a1626" /></linearGradient>
        <linearGradient id="d8ic" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4f8f6" /><stop offset="0.7" stopColor="#dfe6e4" /><stop offset="1" stopColor="#c4ccca" /></linearGradient>
        <linearGradient id="d8kal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3c44" /><stop offset="1" stopColor="#24262e" /></linearGradient>
        <linearGradient id="d8asf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#14161c" /><stop offset="1" stopColor="#0a0b10" /></linearGradient>
        <radialGradient id="d8tab" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff5a3a" stopOpacity={0.55} /><stop offset="1" stopColor="#ff5a3a" stopOpacity={0} /></radialGradient>
        <radialGradient id="d8lmb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb860" stopOpacity={0.55} /><stop offset="1" stopColor="#ffb860" stopOpacity={0} /></radialGradient>
        <filter id="d8bl"><feGaussianBlur stdDeviation="16" /></filter>
        <filter id="d8bl2"><feGaussianBlur stdDeviation="5" /></filter>
        <clipPath id="d8cam"><rect x={gL} y={gT} width={gR - gL} height={gB - gT} /></clipPath>
        <clipPath id="d8kapi"><rect x={dL} y={dT} width={dR - dL} height={zem - dT} /></clipPath>
      </defs>
      {/* gök (çatıların üstü) */}
      <rect x={-420} y={-300} width={1920} height={900} fill="url(#d8gok)" />
      {/* üst katlar: eski Tarlabaşı apartmanı (ortada), solda/sağda komşu binalar */}
      <rect x={-420} y={-120} width={sL + 420} height={zem + 120} fill="#2a2528" />
      <rect x={sL} y={-300} width={sR - sL} height={fy(3.3) + 300} fill="#4a3e3a" />
      <rect x={sR} y={-60} width={1500 - sR} height={zem + 60} fill="#2c2a30" />
      {/* korniş çizgileri */}
      {[fy(3.3), fy(6.3), fy(9.3)].map((y, i) => <rect key={i} x={sL - 14} y={y - 16} width={sR - sL + 28} height={18} fill="#5e504a" stroke={O} strokeWidth={3} />)}
      {/* pencereler: 3 × 2 kat; bazısında sıcak ışık, birinde TV mavisi titrer */}
      {[[4.0, 0], [7.0, 1]].map(([Y, k]) =>
        [-1.45, 0, 1.45].map((X, i) => {
          const x1 = fx(X - 0.42), x2 = fx(X + 0.42), y1 = fy(Y + 1.7), y2 = fy(Y);
          const tv = k === 0 && i === 2;
          const yan = (k === 0 && i === 0) || (k === 1 && i === 1);
          const tvR = tv ? 0.55 + 0.35 * Math.sin(frame * 0.9) * Math.sin(frame * 0.23) : 0;
          return (
            <g key={`${k}${i}`}>
              <rect x={x1 - 10} y={y1 - 10} width={x2 - x1 + 20} height={y2 - y1 + 22} fill="#5a4c46" />
              <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill={yan ? "#e8b060" : tv ? "#5a7ac8" : "#141822"} opacity={tv ? tvR : 1} stroke={O} strokeWidth={4} />
              {tv ? <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill="#141822" opacity={1 - tvR} /> : null}
              {yan ? <path d={`M ${x1 + 8} ${y1 + 6} Q ${(x1 + x2) / 2} ${y1 + 40} ${x1 + 10} ${y2 - 6} M ${x2 - 8} ${y1 + 6} Q ${(x1 + x2) / 2} ${y1 + 40} ${x2 - 10} ${y2 - 6}`} stroke="#b07030" strokeWidth={8} fill="none" /> : null}
              <path d={`M ${(x1 + x2) / 2} ${y1} V ${y2}`} stroke="#3a302c" strokeWidth={5} />
              <rect x={x1 - 16} y={y2 + 4} width={x2 - x1 + 32} height={12} fill="#6a5a52" />
            </g>
          );
        }),
      )}
      {/* 1. kat balkon demiri + asılı çamaşır (rüzgârla sallanır) */}
      <path d={`M ${fx(-0.75)} ${fy(4.0) + 4} H ${fx(0.75)}`} stroke="#1a1416" strokeWidth={6} />
      {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${fx(-0.75 + i * 0.1875)} ${fy(4.0) + 4} V ${fy(3.45)}`} stroke="#1a1416" strokeWidth={4} />)}
      <path d={`M ${fx(-0.75)} ${fy(3.45)} H ${fx(0.75)}`} stroke="#1a1416" strokeWidth={6} />
      <path d={`M ${fx(-0.7)} ${fy(4.55)} Q 540 ${fy(4.45)} ${fx(0.7)} ${fy(4.55)}`} stroke="#8a8a8a" strokeWidth={2} fill="none" />
      {[[-0.45, "#c8c0b8"], [-0.1, "#7a98b8"], [0.3, "#b86a6a"]].map(([X, c], i) => {
        const sw = Math.sin(frame * 0.07 + i) * 4;
        const x = fx(X as number);
        return <path key={i} d={`M ${x - 22} ${fy(4.5)} L ${x + 22} ${fy(4.5)} L ${x + 20 + sw} ${fy(4.15)} L ${x - 20 + sw} ${fy(4.15)} Z`} fill={c as string} opacity={0.75} />;
      })}
      {/* sol komşu: apartman kapısı, loş ampul */}
      <rect x={-260} y={fy(2.3)} width={190} height={zem - fy(2.3)} fill="#1a1c20" stroke="#0c0c10" strokeWidth={6} />
      <rect x={-250} y={fy(2.3) + 10} width={80} height={zem - fy(2.3) - 20} fill="#22252a" />
      <rect x={-160} y={fy(2.3) + 10} width={80} height={zem - fy(2.3) - 20} fill="#22252a" />
      <circle cx={-165} cy={fy(2.55)} r={9} fill="#ffcc80" />
      <circle cx={-165} cy={fy(2.55)} r={60} fill="#ffcc80" opacity={0.14} filter="url(#d8bl)" />
      <rect x={-48} y={fy(1.5)} width={34} height={54} rx={4} fill="#3a3c40" />
      {/* sağ komşu: kapalı kepenk + silik grafiti */}
      <rect x={sR + 40} y={fy(2.6)} width={420} height={zem - fy(2.6)} fill="#5a6068" />
      {new Array(26).fill(0).map((_, i) => <path key={i} d={`M ${sR + 40} ${fy(2.6) + 12 + i * 17} h 420`} stroke="#3c4248" strokeWidth={3} />)}
      <path d={`M ${sR + 90} ${fy(1.2)} q 40 -70 90 -10 t 90 0 q 30 -40 70 10`} stroke="#7a4a8a" strokeWidth={10} fill="none" opacity={0.45} />
      <rect x={sR + 30} y={fy(2.6) - 20} width={440} height={22} fill="#3a3e44" />
      {/* market cephesi (zemin kat): dolu duvar solda */}
      <rect x={sL} y={fy(3.3)} width={sR - sL} height={zem - fy(3.3)} fill="#8a8e92" />
      <rect x={sL} y={fy(2.6)} width={gL - sL} height={zem - fy(2.6)} fill="#9aa0a4" stroke="#6a7074" strokeWidth={4} />
      {/* duvarda bantlı A4 ilan (okunmaz, eski) */}
      <rect x={sL + 40} y={fy(1.75)} width={70} height={92} fill="#e8e4d8" transform={`rotate(-4 ${sL + 75} ${fy(1.5)})`} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${sL + 50} ${fy(1.75) + 22 + i * 16} h 50`} stroke="#8a8478" strokeWidth={4} transform={`rotate(-4 ${sL + 75} ${fy(1.5)})`} />)}
      {/* vitrin içi: aydınlık market (floresan), raflar, kasanın kırmızı ucu (solda) */}
      <g clipPath="url(#d8cam)">
        <rect x={gL} y={gT} width={gR - gL} height={gB - gT} fill="url(#d8ic)" />
        {/* tavan floresanları */}
        {[0.2, 0.62].map((k, i) => <rect key={i} x={gL + (gR - gL) * (k - 0.12)} y={gT + 14} width={(gR - gL) * 0.24} height={14} rx={4} fill="#ffffff" opacity={fl} />)}
        {/* arka duvar rafları: renkli paketler */}
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x={gL + 70} y={gT + 90 + r * 70} width={gR - gL - 120} height={8} fill="#9aa2a8" />
            {new Array(14).fill(0).map((_, c) => <rect key={c} x={gL + 78 + c * 33} y={gT + 52 + r * 70} width={26} height={38} rx={3} fill={PAKET[(r * 5 + c * 3) % PAKET.length]} opacity={0.8} />)}
          </g>
        ))}
        {/* orta reyon (kameraya dik) */}
        <rect x={gL + 230} y={gT + 150} width={120} height={gB - gT - 150} fill="#d0d6d8" stroke="#8a9298" strokeWidth={4} />
        {[0, 1, 2].map((r) => new Array(4).fill(0).map((_, c) => <rect key={`${r}${c}`} x={gL + 238 + c * 28} y={gT + 172 + r * 70} width={22} height={50} fill={PAKET[(r + c * 2) % PAKET.length]} />))}
        {/* kasanın ucu (içeride, solda): kırmızı banko */}
        <rect x={gL - 10} y={gB - 120} width={110} height={120} fill="#c23a22" stroke="#2a1410" strokeWidth={4} />
        <rect x={gL - 10} y={gB - 132} width={116} height={14} fill="#f2f0ea" />
        <rect x={gL + 20} y={gB - 176} width={60} height={46} rx={4} fill="#2a2e34" />
        {/* zemin */}
        <rect x={gL} y={gB - 40} width={gR - gL} height={40} fill="#bfc6c4" />
      </g>
      {/* kapı açıklığı: kanatlar kayınca içerisi doğrudan görünür (cam yok) */}
      {/* kapı kanatları (cam + alüminyum), ortadan iki yana kayar */}
      <g>
        {[[dL - sl, mid - sl], [mid + sl, dR + sl]].map(([a, b], i) => (
          <g key={i}>
            <rect x={a} y={dT} width={b - a} height={zem - dT} fill="#a8c4d8" opacity={0.2} stroke="#7a8288" strokeWidth={9} />
            <rect x={a + 12} y={dT + (zem - dT) * 0.5} width={b - a - 24} height={14} fill="#eef4f6" opacity={0.85} />
            {i === 1 ? <text x={(a + b) / 2} y={dT + (zem - dT) * 0.45} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={22} fill="#3a4a58" opacity={0.9}>GİRİŞ</text> : null}
          </g>
        ))}
      </g>
      {/* vitrin kayıtları ve kasa */}
      {[gL, dL, dR, gR].map((x) => <rect key={x} x={x - 7} y={gT} width={14} height={zem - gT} fill="#9aa2a8" />)}
      <rect x={gL} y={gT - 10} width={gR - gL} height={14} fill="#9aa2a8" />
      <rect x={gL} y={dT - 10} width={gR - gL} height={12} fill="#9aa2a8" />
      <rect x={gL} y={gB} width={dL - gL} height={zem - gB} fill="#7a8288" />
      <rect x={dR} y={gB} width={gR - dR} height={zem - gB} fill="#7a8288" />
      {/* sensör kutusu + LED */}
      <rect x={mid - 46} y={dT - 44} width={92} height={28} rx={5} fill="#2a2e34" />
      <circle cx={mid + 30} cy={dT - 30} r={5} fill={sensor ? "#ff3020" : "#30d060"} />
      {sensor ? <circle cx={mid + 30} cy={dT - 30} r={16} fill="#ff3020" opacity={0.3} filter="url(#d8bl2)" /> : null}
      {/* "AÇIK 7/24" pembe neon (sol vitrin camında, dışarıdan DÜZ okunur) */}
      <rect x={gL + 26} y={fy(1.95)} width={112} height={40} rx={9} fill="#ff4a8a" opacity={0.16} />
      <text x={gL + 82} y={fy(1.95) + 29} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={23} fill="#ff7ab0">AÇIK 7/24</text>
      <text x={gL + 82} y={fy(1.95) + 29} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={23} fill="#ff4a8a" opacity={0.6} filter="url(#d8bl2)">AÇIK 7/24</text>
      {/* camda gök/sokak yansıması (çapraz parıltılar) */}
      {[0.1, 0.45, 0.8].map((k, i) => <path key={i} d={`M ${gL + (gR - gL) * k} ${gT} l ${(gR - gL) * 0.12} ${gB - gT}`} stroke="#ffffff" strokeWidth={16} opacity={0.05} />)}
      {/* ışıklı tabela kutusu */}
      <rect x={sL - 6} y={fy(3.25)} width={sR - sL + 12} height={fy(2.62) - fy(3.25)} fill="#b8301c" stroke={O} strokeWidth={5} />
      <rect x={sL + 6} y={fy(3.25) + 8} width={sR - sL - 12} height={fy(2.62) - fy(3.25) - 16} fill="#d8402a" />
      <text x={540 - 40} y={fy(2.78)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={64} fill="#fff4ea" letterSpacing={3}>CAN MARKET</text>
      <text x={sR - 70} y={fy(2.78)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={50} fill="#fff4ea" opacity={tabTit}>7/24</text>
      <rect x={sL - 60} y={fy(3.25) - 50} width={sR - sL + 120} height={fy(2.62) - fy(3.25) + 100} fill="url(#d8tab)" />
      {/* tabelanın etrafında pervaneler */}
      {[0, 1, 2].map((i) => {
        const a = frame * (0.31 + i * 0.07) + i * 2;
        const x = 540 + Math.sin(a) * 240 + Math.sin(a * 2.3) * 40, y = fy(2.95) + Math.cos(a * 1.3) * 50 - 40;
        return <circle key={i} cx={x} cy={y} r={3.2} fill="#f8e8d0" opacity={0.85} />;
      })}
      {/* kaldırım: karolar perspektifte */}
      <rect x={-420} y={zem} width={1920} height={disP(0, 0, 2)[1] - zem} fill="url(#d8kal)" />
      {[-3, -2, -1, 0, 1, 2, 3, 4].map((X) => { const a = disP(X * 0.8, 0, ZF), b = disP(X * 0.8, 0, 2); return <path key={X} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke="#4a4c54" strokeWidth={3} />; })}
      {[4.2, 3.4, 2.75, 2.3].map((Z) => <path key={Z} d={`M -420 ${disP(0, 0, Z)[1]} H 1500`} stroke="#4a4c54" strokeWidth={3} />)}
      {/* kaldırım kenarı (bordür) */}
      <rect x={-420} y={disP(0, 0, 2)[1]} width={1920} height={26} fill="#5a5c62" />
      {/* asfalt: ıslak, tabela ve vitrin yansıması */}
      <rect x={-420} y={disP(0, 0, 2)[1] + 26} width={1920} height={600} fill="url(#d8asf)" />
      <rect x={fx(-1.6)} y={disP(0, 0, 2)[1] + 40} width={fx(1.6) - fx(-1.6)} height={300} fill="#ff5a3a" opacity={0.08} filter="url(#d8bl)" />
      <rect x={gL} y={disP(0, 0, 2)[1] + 34} width={gR - gL} height={220} fill="#dff0ff" opacity={0.05} filter="url(#d8bl)" />
      {/* sokak lambası (sağda, direk) */}
      <rect x={1270} y={-300} width={16} height={disP(0, 0, 2.6)[1] + 300} fill="#14161a" />
      <circle cx={1180} cy={120} r={300} fill="url(#d8lmb)" />
    </g>
  );
};

/** vitrinden kaldırıma düşen soğuk beyaz ışık yaması + sokak lambasının sıcak havuzu (karakterlerin altında) */
export const Market724DisZemin: React.FC<{ flor?: number; op: number }> = ({ flor = 1, op }) => {
  const zem = fy(0);
  const a = disP(-1.0, 0, ZF), b = disP(2.05, 0, ZF), c = disP(2.6, 0, 2.4), d = disP(-1.3, 0, 2.4);
  const k1 = disP(-0.2, 0, ZF), k2 = disP(1.2, 0, ZF), k3 = disP(1.7, 0, 2.2), k4 = disP(-0.5, 0, 2.2);
  return (
    <g>
      <defs><filter id="d8zb"><feGaussianBlur stdDeviation="22" /></filter></defs>
      <path d={`M ${a[0]} ${zem} L ${b[0]} ${zem} L ${c[0]} ${c[1]} L ${d[0]} ${d[1]} Z`} fill="#d8ecff" opacity={0.2 * flor} filter="url(#d8zb)" />
      <path d={`M ${k1[0]} ${zem} L ${k2[0]} ${zem} L ${k3[0]} ${k3[1]} L ${k4[0]} ${k4[1]} Z`} fill="#ffffff" opacity={(0.08 + 0.12 * op) * flor} filter="url(#d8zb)" />
      <ellipse cx={1180} cy={disP(0, 0, 3)[1]} rx={300} ry={90} fill="#ffb860" opacity={0.16} filter="url(#d8zb)" />
    </g>
  );
};
