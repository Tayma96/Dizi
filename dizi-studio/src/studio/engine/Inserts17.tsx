/* =====================================================================================
 * 7/24 Bölüm 7 (v3) yakın planları (opt-in; yalnız 724-07 kullanır).
 *  b7_ez  : banyo zemini, alçak kamera. Makinenin altından küçük, sıradan bir hamamböceği çıkıp Ece'nin ayaklarına koşar;
 *           Ece'nin bir ayağı havaya kalkar; annenin terlikli ayağı bakmadan iner ve böceği ezer (ÇAT), ayak kalkmaz.
 *           text[0] = JSON {ez: ezme anı sn (vars. 0,62)}
 *  b7_bant: kanca. Annenin elleri desteyi çevirir; destenin bandının arkasında kırmızı mürekkep damga "7/24".
 * ===================================================================================== */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type Insert17Kind = "b7_ez" | "b7_bant";
export const INSERT17_KINDS: Insert17Kind[] = ["b7_ez", "b7_bant"];

const O = "#2a1c12";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (x: number) => x * x * (3 - 2 * x);
const prm = (text?: string[]): Record<string, number> => {
  try {
    return text?.[0] ? JSON.parse(text[0]) : {};
  } catch {
    return {};
  }
};

/** terlikli ayak (üstten-önden): bacak (pantolon) yukarıdan iner */
const Ayak: React.FC<{ x: number; y: number; s: number; pant: string; terlik: string; ten: string; ust?: number }> = ({ x, y, s, pant, terlik, ten, ust = -200 }) => (
  <g>
    <path d={`M ${x - 70 * s} ${ust} L ${x + 70 * s} ${ust} L ${x + 62 * s} ${y - 40 * s} L ${x - 62 * s} ${y - 40 * s} Z`} fill={pant} stroke={O} strokeWidth={6} />
    <path d={`M ${x - 60 * s} ${y - 70 * s} Q ${x} ${y - 52 * s} ${x + 60 * s} ${y - 70 * s}`} stroke="#000" strokeWidth={5} opacity={0.25} fill="none" />
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* taban */}
      <path d="M -70 -40 Q -80 60 -50 110 Q 0 140 50 110 Q 80 60 70 -40 Z" fill="#3a2a20" stroke={O} strokeWidth={5} />
      {/* ayak (bilek + parmaklar) */}
      <path d="M -50 -60 Q -58 40 -40 92 Q 0 112 40 92 Q 58 40 50 -60 Z" fill={ten} stroke={O} strokeWidth={5} />
      {[-30, -12, 6, 22, 36].map((px, i) => <ellipse key={i} cx={px} cy={96 - Math.abs(px) * 0.2} rx={9 - i * 0.6} ry={8} fill={ten} stroke={O} strokeWidth={3} />)}
      {/* terlik bandı */}
      <path d="M -66 -4 Q 0 -30 66 -4 L 62 46 Q 0 26 -62 46 Z" fill={terlik} stroke={O} strokeWidth={5} />
      <path d="M -54 12 Q 0 -6 54 12" stroke="#ffffff" strokeWidth={4} opacity={0.25} fill="none" />
    </g>
  </g>
);

const Bocek: React.FC<{ x: number; y: number; a: number; s: number; faz: number }> = ({ x, y, a, s, faz }) => (
  <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
    <ellipse cx={0} cy={8} rx={24} ry={9} fill="#000" opacity={0.25} />
    {[-1, 1].map((k) => [-8, 0, 8].map((lx, i) => {
      const sal = Math.sin(faz + i * 2.1 + (k > 0 ? Math.PI : 0)) * 5;
      return <path key={`${k}${i}`} d={`M ${lx} ${k * 4} l ${-4 + sal} ${k * 12} l ${-6 + sal * 0.5} ${k * 4}`} stroke="#3a2214" strokeWidth={2.4} fill="none" strokeLinecap="round" />;
    }))}
    <ellipse cx={-2} cy={0} rx={18} ry={9} fill="#6a3a1c" stroke="#2a160a" strokeWidth={2} />
    <path d="M -2 -8 V 8" stroke="#4a2810" strokeWidth={1.5} />
    <ellipse cx={14} cy={0} rx={6} ry={7} fill="#4a2a14" stroke="#2a160a" strokeWidth={2} />
    <ellipse cx={-6} cy={-3} rx={6} ry={2} fill="#c88a5a" opacity={0.5} />
    {[-1, 1].map((k) => <path key={k} d={`M 18 ${k * 3} q 12 ${k * (4 + Math.sin(faz * 0.3 + k) * 4)} 24 ${k * (10 + Math.sin(faz * 0.4 + k) * 5)}`} stroke="#3a2214" strokeWidth={1.6} fill="none" />)}
  </g>
);

const BocekEz: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ez = prm(text).ez ?? 0.62;
  // böcek: makinenin altındaki karanlık aralıktan (sol arka) çıkar, ön-ortaya, Ece'nin ayaklarına doğru koşar
  const u = Math.min(1, t / ez);
  const P0: [number, number] = [300, 700], P1: [number, number] = [640, 1290];
  const bx = P0[0] + (P1[0] - P0[0]) * u + Math.sin(u * 10) * 22, by = P0[1] + (P1[1] - P0[1]) * u;
  const ang = Math.atan2(P1[1] - P0[1], P1[0] - P0[0]) * 180 / Math.PI + Math.cos(u * 10) * 22;
  const bS = 2.2 + 1.5 * u; // yaklaştıkça büyür (perspektif)
  // annenin sağ ayağı (ön sol): kalkar (kadraj dışına), böceğin üstüne iner, KALKMAZ
  const kalk = ease(interpolate(t, [ez - 0.36, ez - 0.14], [0, 1], cl)), in_ = ease(interpolate(t, [ez - 0.14, ez], [0, 1], cl));
  const ayX = in_ > 0 ? 600 + (P1[0] + 10 - 600) * in_ : 470 + (600 - 470) * kalk;
  const ayY = in_ > 0 ? 380 + (P1[1] - 150 - 380) * in_ : 1700 + (380 - 1700) * kalk;
  const ayS = in_ > 0 ? 1.9 - 0.35 * in_ : 1.9;
  const eceKalk = ease(interpolate(t, [ez * 0.55, ez * 0.75], [0, 1], cl));
  const sars = t > ez && t < ez + 0.3 ? Math.sin((t - ez) * 80) * 16 * (1 - (t - ez) / 0.3) : 0;
  const toz = t > ez ? Math.min(1, (t - ez) / 0.35) : 0;
  const golgeA = kalk > 0 && t < ez ? 0.1 + 0.3 * in_ : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `translate(${sars}px, ${sars * 0.6}px)` }}>
        <defs>
          <radialGradient id="i17_isik" cx="0.5" cy="0.1" r="1"><stop offset="0" stopColor="#ffd8a0" stopOpacity={0.22} /><stop offset="0.6" stopColor="#1a1830" stopOpacity={0.1} /><stop offset="1" stopColor="#1a1830" stopOpacity={0.5} /></radialGradient>
        </defs>
        {/* duvar (fayans) + süpürgelik */}
        <rect width={1080} height={700} fill="#d8e4de" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M ${i * 150} 0 V 700`} stroke="#c0cec8" strokeWidth={4} />)}
        {[230, 470].map((y) => <path key={y} d={`M 0 ${y} H 1080`} stroke="#c0cec8" strokeWidth={4} />)}
        {/* çamaşır makinesinin alt kısmı (solda) + altındaki karanlık aralık */}
        <rect x={-30} y={-20} width={500} height={672} rx={14} fill="#eceee8" stroke="#7a7e80" strokeWidth={8} />
        <path d="M 40 -20 A 200 200 0 0 0 400 -20" fill="#c8d4da" stroke="#7a7e80" strokeWidth={12} />
        <rect x={60} y={520} width={360} height={70} rx={10} fill="#dcdfd8" stroke="#9a9e98" strokeWidth={4} />
        <rect x={-30} y={652} width={500} height={52} fill="#141618" />
        <rect x={10} y={690} width={46} height={26} fill="#5a5e60" /><rect x={390} y={690} width={46} height={26} fill="#5a5e60" />
        {/* zemin (alçak perspektif fayans) */}
        <path d="M 0 700 H 1080 V 1920 H 0 Z" fill="#b4c0bc" />
        {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M ${540 + i * 120} 700 L ${540 + i * 520} 1920`} stroke="#9eaaa6" strokeWidth={4} />)}
        {[760, 850, 990, 1210, 1560].map((y) => <path key={y} d={`M 0 ${y} H 1080`} stroke="#9eaaa6" strokeWidth={4} />)}
        {/* Ece'nin ayakları (sağ arka): sağ ayağı böcek yaklaşınca havaya */}
        <ellipse cx={790} cy={1020} rx={70} ry={16} fill="#000" opacity={0.22} />
        <ellipse cx={930} cy={1020} rx={70} ry={16} fill="#000" opacity={0.22 * (1 - eceKalk * 0.7)} />
        <Ayak x={790} y={900} s={0.95} pant="#b8a0d0" terlik="#f0e0e8" ten="#f0c8a8" ust={-60} />
        <Ayak x={930} y={900 - 230 * eceKalk} s={0.95} pant="#b8a0d0" terlik="#f0e0e8" ten="#f0c8a8" ust={-60} />
        {/* inen ayağın gölgesi (beklenti) */}
        {golgeA > 0 ? <ellipse cx={P1[0] + 10} cy={P1[1] + 20} rx={150 - 60 * in_} ry={40 - 14 * in_} fill="#000" opacity={golgeA} /> : null}
        {/* böcek (ezilmeden önce) */}
        {t < ez ? <Bocek x={bx} y={by} a={ang} s={bS} faz={t * 40} /> : null}
        {/* annenin ayakları (ön sol, kahve pantolon, kahve terlik) */}
        <ellipse cx={200} cy={1880} rx={190} ry={40} fill="#000" opacity={0.25} />
        <Ayak x={200} y={1700} s={1.9} pant="#5a4a48" terlik="#6a4a3a" ten="#eec4a2" ust={-100} />
        <Ayak x={ayX} y={ayY} s={ayS} pant="#5a4a48" terlik="#6a4a3a" ten="#eec4a2" ust={-300} />
        {/* ezildi: tabanın kenarından anten seğirir; toz */}
        {t >= ez ? (
          <g>
            <path d={`M ${ayX + 100} ${ayY + 160} q 30 ${-14 + Math.sin(t * 34) * 12 * Math.max(0, 1 - (t - ez))} 64 ${-6 + Math.sin(t * 30) * 16 * Math.max(0, 1 - (t - ez))}`} stroke="#3a2214" strokeWidth={5} fill="none" strokeLinecap="round" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const a = (i / 6) * Math.PI - Math.PI;
              return <circle key={i} cx={ayX + Math.cos(a) * (110 + 150 * toz)} cy={ayY + 190 + Math.sin(a) * 40 * toz} r={18 * (1 - toz) + 5} fill="#e8e4dc" opacity={0.6 * (1 - toz)} />;
            })}
          </g>
        ) : null}
        <rect width={1080} height={1920} fill="url(#i17_isik)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(14,10,28,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Kanca: destenin bandı çevrilir; arkasında kırmızı "7/24" damgası */
const Bant: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cev = ease(interpolate(t, [0.35, 0.85], [0, 1], cl)); // 0: ön, 1: arka
  const sx = Math.abs(Math.cos(cev * Math.PI));
  const arka = cev > 0.5;
  const bas = ease(interpolate(t, [1.2, 1.9], [0, 1], cl)); // başparmak damganın üstünden geçer
  const z = 1 + 0.08 * (t / Math.max(1, dur));
  const BANT = "#e8d8b0";
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a1c14" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <defs>
          <radialGradient id="i17_lmb" cx="0.5" cy="0.25" r="0.8"><stop offset="0" stopColor="#ffd8a0" stopOpacity={0.45} /><stop offset="1" stopColor="#140c10" stopOpacity={0.6} /></radialGradient>
          <filter id="i17_mur"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.4" /><feComposite in2="SourceGraphic" operator="in" /></filter>
          <filter id="i17_bl"><feGaussianBlur stdDeviation="10" /></filter>
        </defs>
        {/* arka: sofra, bulanık */}
        <g filter="url(#i17_bl)">
          <rect width={1080} height={1920} fill="#d4bc96" />
          <rect y={1300} width={1080} height={620} fill="#f2ece0" />
          {new Array(16).fill(0).map((_, i) => <rect key={i} x={i * 70} y={1820} width={35} height={60} fill="#c8483a" opacity={0.8} />)}
          <ellipse cx={240} cy={1420} rx={170} ry={50} fill="#ffffff" />
          <ellipse cx={860} cy={1440} rx={120} ry={40} fill="#e8e0d0" />
        </g>
        <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
          {/* hırka kolları + eller (iki yandan) */}
          {[-1, 1].map((k) => (
            <g key={k}>
              <path d={`M ${540 + k * 700} 1700 L ${540 + k * 330} 1060`} stroke={O} strokeWidth={196} strokeLinecap="round" />
              <path d={`M ${540 + k * 700} 1700 L ${540 + k * 330} 1060`} stroke="#8a4a5a" strokeWidth={184} strokeLinecap="round" />
              <path d={`M ${540 + k * 400} 1150 L ${540 + k * 330} 1060`} stroke="#6a3444" strokeWidth={60} />
            </g>
          ))}
          {/* deste (dönen) */}
          <g transform={`translate(540 960) scale(${Math.max(0.04, sx) * 2.4} 2.4) rotate(${-4})`}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={-150} y={-70 - i * 7} width={300} height={140} rx={8} fill={i % 2 ? "#86c096" : "#7ab88a"} stroke={O} strokeWidth={3} />)}
            <rect x={-150} y={-120} width={300} height={140} rx={8} fill="#8ac89a" stroke={O} strokeWidth={3} />
            {arka ? null : <><circle cx={0} cy={-50} r={30} fill="none" stroke="#3a7a4a" strokeWidth={4} /><text x={-130} y={2} fontFamily="Arial" fontSize={30} fontWeight={900} fill="#2a5a3a">200</text></>}
            <rect x={-40} y={-132} width={80} height={170} fill={BANT} stroke={O} strokeWidth={3} />
            {arka ? (
              <g transform="rotate(-9 0 -48)">
                <g filter="url(#i17_mur)">
                  <rect x={-36} y={-92} width={72} height={86} rx={6} fill="none" stroke="#c8202a" strokeWidth={5} />
                  <text x={0} y={-40} textAnchor="middle" fontFamily="Arial Black, Arial" fontWeight={900} fontSize={30} fill="#c8202a">7/24</text>
                  <path d="M -26 -26 H 26" stroke="#c8202a" strokeWidth={3} />
                  <text x={0} y={-12} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={9} fill="#c8202a" letterSpacing={1}>MARKET</text>
                </g>
              </g>
            ) : null}
          </g>
          {/* eller desteyi yanlardan tutar */}
          {[-1, 1].map((k) => (
            <g key={k} transform={`translate(${540 + k * Math.max(60, 330 * sx + 20)} 1000)`}>
              <ellipse cx={0} cy={0} rx={70} ry={92} fill="#eec4a2" stroke={O} strokeWidth={6} />
              {[0, 1, 2].map((i) => <path key={i} d={`M ${-k * 40} ${-50 + i * 40} q ${-k * 50} 6 ${-k * 56} 26`} stroke={O} strokeWidth={5} fill="#eec4a2" />)}
            </g>
          ))}
          {/* başparmak damganın üstünden kayar (arka yüzde) */}
          {arka ? (
            <g transform={`translate(${540 + 150 - 260 * bas} ${780 + 30 * bas})`}>
              <path d="M 0 0 q 60 -40 140 -10 q 30 30 -10 60 q -80 20 -130 -10 Z" fill="#eec4a2" stroke={O} strokeWidth={6} />
              <path d="M 90 0 q 20 6 22 24" stroke={O} strokeWidth={4} fill="none" />
            </g>
          ) : null}
        </g>
        <rect width={1080} height={1920} fill="url(#i17_lmb)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Insert17: React.FC<{ kind: Insert17Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "b7_ez": return <BocekEz dur={dur} text={text} />;
    case "b7_bant": return <Bant dur={dur} />;
  }
};
