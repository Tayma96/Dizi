/* =====================================================================================
 * 7/24 Bölüm 6 · parça 2: tam ekran yakın planlar (opt-in; yalnız 724-06-p2 kullanır).
 *  ev_anahtar: kapının kilit göbeği; Ece'nin titreyen eli anahtarı iki tur çevirir (0,25–0,65 ve 0,8–1,2 sn).
 *  ev_zincir : kapının üst köşesi; el zincirin topuzunu raya sokup sona kaydırır (0,2–1,1 sn), zincir gerilir.
 * ===================================================================================== */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type Insert14Kind = "ev_anahtar" | "ev_zincir";
export const INSERT14_KINDS: Insert14Kind[] = ["ev_anahtar", "ev_zincir"];

const O = "#2a1c12";
const TEN = "#f0c8a8", TEN_G = "#dcac88", KAZAK = "#c8902a", KAZAK_G = "#a8741a";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (x: number) => x * x * (3 - 2 * x);

const Kapi: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#5a3a26" />
    <rect x={90} y={-40} width={900} height={2000} fill="#6a4630" stroke="#3a2416" strokeWidth={10} />
    <rect x={150} y={40} width={780} height={1840} fill="none" stroke="#4a2e1c" strokeWidth={6} />
    {/* ahşap damar */}
    {[220, 340, 470, 610, 760, 880].map((x, i) => <path key={x} d={`M ${x} 0 Q ${x + (i % 2 ? 18 : -14)} 960 ${x} 1920`} stroke="#5a3a24" strokeWidth={4} opacity={0.6} fill="none" />)}
    {/* sağdan salon ışığı */}
    <rect width={1080} height={1920} fill="url(#i14_isik)" />
  </g>
);

/** Ece'nin eli (kolu kadrajın altından/sağından gelir): bilek (x,y), açı a; parmaklar tutma pozunda */
const El: React.FC<{ x: number; y: number; a: number; s?: number; kol: [number, number] }> = ({ x, y, a, s = 1, kol }) => (
  <g>
    {/* kol (kazak) */}
    <path d={`M ${kol[0]} ${kol[1]} L ${x} ${y}`} stroke={O} strokeWidth={150 * s + 10} strokeLinecap="round" />
    <path d={`M ${kol[0]} ${kol[1]} L ${x} ${y}`} stroke={KAZAK} strokeWidth={150 * s} strokeLinecap="round" />
    <path d={`M ${kol[0] + 30} ${kol[1]} L ${x + 30 * s} ${y + 30 * s}`} stroke={KAZAK_G} strokeWidth={40 * s} strokeLinecap="round" opacity={0.6} />
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      {/* manşet */}
      <rect x={-80} y={-20} width={160} height={50} rx={22} fill={KAZAK_G} stroke={O} strokeWidth={5} />
      {/* avuç */}
      <path d="M -62 -10 Q -80 -110 -40 -170 L 50 -170 Q 80 -100 62 -10 Z" fill={TEN} stroke={O} strokeWidth={6} />
      {/* bükülü parmaklar */}
      {[-36, -8, 20].map((fx, i) => <path key={i} d={`M ${fx} -165 q 4 -60 26 -60 q 22 0 20 40`} fill={TEN} stroke={O} strokeWidth={6} />)}
      {/* başparmak */}
      <path d="M -58 -90 Q -120 -140 -96 -196 Q -78 -214 -60 -190 Q -56 -150 -30 -130" fill={TEN} stroke={O} strokeWidth={6} />
      <path d="M -40 -60 Q 0 -50 40 -60" stroke={TEN_G} strokeWidth={5} fill="none" />
    </g>
  </g>
);

const Anahtar: React.FC<{ dur: number }> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const tur = ease(interpolate(t, [0.25, 0.65], [0, 1], cl)) + ease(interpolate(t, [0.8, 1.2], [0, 1], cl));
  const titre = Math.sin(t * 47) * 4 + Math.sin(t * 31) * 3;
  const aci = -tur * 90 + (tur % 1 === 0 && tur > 0 ? 0 : 0);
  const cx = 560, cy = 900;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <defs>
          <linearGradient id="i14_isik" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#ffe6b0" stopOpacity={0.3} /><stop offset="1" stopColor="#000" stopOpacity={0.15} /></linearGradient>
        </defs>
        <Kapi />
        {/* kol ve kilit aynası */}
        <rect x={cx + 120} y={cy - 420} width={70} height={560} rx={20} fill="#c8a860" stroke={O} strokeWidth={6} />
        <path d={`M ${cx + 155} ${cy - 360} h -330`} stroke={O} strokeWidth={70} strokeLinecap="round" />
        <path d={`M ${cx + 155} ${cy - 360} h -330`} stroke="#d8b870" strokeWidth={58} strokeLinecap="round" />
        <path d={`M ${cx + 140} ${cy - 372} h -300`} stroke="#f0d890" strokeWidth={12} strokeLinecap="round" opacity={0.7} />
        <rect x={cx - 110} y={cy - 160} width={220} height={430} rx={60} fill="#c8a860" stroke={O} strokeWidth={6} />
        <circle cx={cx} cy={cy} r={70} fill="#b8984e" stroke={O} strokeWidth={6} />
        {/* anahtar: göbekte döner (dişler içeride), baş kısmı tutuluyor */}
        <g transform={`translate(${cx} ${cy}) rotate(${aci})`}>
          <rect x={-14} y={-150} width={28} height={150} fill="#c8ccd0" stroke={O} strokeWidth={5} />
          <path d="M -70 -150 Q -80 -270 0 -280 Q 80 -270 70 -150 Z" fill="#b0b8c0" stroke={O} strokeWidth={6} />
          <circle cx={0} cy={-232} r={18} fill="#6a4630" stroke={O} strokeWidth={4} />
          {/* anahtarlık halkası ve sallanan küçük ponpon */}
          <circle cx={0} cy={-232} r={30} fill="none" stroke="#9aa0a8" strokeWidth={7} />
          <circle cx={-10 + 8 * Math.sin(t * 9)} cy={-140 + 6 * Math.cos(t * 9)} r={34} fill="#e87aa0" stroke={O} strokeWidth={4} transform={`rotate(${-aci} 0 -232)`} />
        </g>
        {/* el anahtarın başını tutar */}
        <g transform={`translate(${titre} ${titre * 0.6})`}>
          <g transform={`rotate(${aci * 0.3} ${cx} ${cy})`}>
            <El x={cx + 20} y={cy + 40} a={-8} s={1.15} kol={[cx + 300, cy + 1100]} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const Zincir: React.FC<{ dur: number }> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const titre = Math.sin(t * 43) * 5 + Math.sin(t * 29) * 3;
  // topuz: kasadan (sağ) asılı → raya girer → sola kayar
  const a = ease(interpolate(t, [0.15, 0.6], [0, 1], cl));
  const b = ease(interpolate(t, [0.6, 1.1], [0, 1], cl));
  const rayY = 860, raySag = 560, raySol = 250;
  const plakaX = 920, plakaY = 860;
  const asiliX = plakaX - 40, asiliY = plakaY + 330;
  const tx = a < 1 ? asiliX + (raySag - asiliX) * a : raySag + (raySol - raySag) * b;
  const ty = a < 1 ? asiliY + (rayY - asiliY) * a - 120 * Math.sin(Math.PI * a) : rayY;
  const sark = a < 1 ? 160 * (1 - a) + 60 : 40 * (1 - b) + 6;
  const mx = (plakaX + tx) / 2, my = (plakaY + ty) / 2 + sark;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <defs>
          <linearGradient id="i14_isik" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#ffe6b0" stopOpacity={0.3} /><stop offset="1" stopColor="#000" stopOpacity={0.15} /></linearGradient>
        </defs>
        <Kapi />
        {/* kasa (sağda, açık renk) */}
        <rect x={960} y={0} width={140} height={1920} fill="#efe6d4" stroke="#b8a888" strokeWidth={6} />
        {/* zincir rayı (kanatta) */}
        <rect x={210} y={rayY - 38} width={420} height={76} rx={16} fill="#c8c4b8" stroke={O} strokeWidth={6} />
        <rect x={240} y={rayY - 10} width={360} height={20} rx={10} fill="#5a5850" />
        {[250, 590].map((x) => <circle key={x} cx={x} cy={rayY} r={9} fill="#8a8678" stroke={O} strokeWidth={3} />)}
        {/* kasadaki plaka */}
        <rect x={plakaX - 30} y={plakaY - 70} width={90} height={140} rx={14} fill="#c8c4b8" stroke={O} strokeWidth={6} />
        {/* zincir halkaları */}
        {new Array(13).fill(0).map((_, i) => {
          const u = i / 12;
          const x = (1 - u) * (1 - u) * plakaX + 2 * u * (1 - u) * mx + u * u * tx;
          const y = (1 - u) * (1 - u) * plakaY + 2 * u * (1 - u) * my + u * u * ty;
          return <ellipse key={i} cx={x} cy={y} rx={i % 2 ? 22 : 12} ry={i % 2 ? 12 : 22} fill="none" stroke="#d8d4c8" strokeWidth={8} />;
        })}
        {/* topuz */}
        <circle cx={tx} cy={ty} r={30} fill="#e0dcd0" stroke={O} strokeWidth={6} />
        {/* el topuzu tutar (parmak uçları topuzda) */}
        <g transform={`translate(${titre} ${titre * 0.5})`}>
          <El x={tx + 70} y={ty + 190} a={-15} s={1.0} kol={[tx + 520, ty + 1100]} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const Insert14: React.FC<{ kind: Insert14Kind; dur: number; text?: string[] }> = ({ kind, dur }) => {
  switch (kind) {
    case "ev_anahtar": return <Anahtar dur={dur} />;
    case "ev_zincir": return <Zincir dur={dur} />;
  }
};
