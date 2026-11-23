/* =====================================================================================
 * 7/24 Bölüm 7 · parça 1: tam ekran yakın planlar (opt-in; yalnız 724-07 kullanır).
 *  cep_deste: annenin elleri Ece'nin kotunun arka cebinden bantlı desteyi çeker (0,3–1,1 sn), deste havada durur.
 *  para_say : desteyi sayan eller; başparmak banknot köşelerini hızla çevirir. text[0] = "ece" (pembe pijama kolu,
 *             aç gözlü hızlı) | "anne" (hırka kolu, şaşkın yavaş).
 *  kulak_cek: Ece'nin başı yakın; annenin eli sağ kulağı çimdikler ve YUKARI çeker (0,25 sn'den), Ece yüzünü buruşturur.
 * ===================================================================================== */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";

export type Insert15Kind = "cep_deste" | "para_say" | "kulak_cek";
export const INSERT15_KINDS: Insert15Kind[] = ["cep_deste", "para_say", "kulak_cek"];

const O = "#2a1c12";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (x: number) => x * x * (3 - 2 * x);
const KOL = { anne: ["#8a4a5a", "#6a3444", "#eec4a2"], ece: ["#e8a0b8", "#c87e98", "#f0c8a8"] } as const;

/** banyo zemini/duvarı (akşam ışığı) */
const Arka: React.FC<{ renk?: string }> = ({ renk = "#d8e2dc" }) => (
  <g>
    <rect width={1080} height={1920} fill={renk} />
    {new Array(12).fill(0).map((_, i) => <path key={i} d={`M ${i * 110 - 40} 0 V 1920`} stroke="#c4d0ca" strokeWidth={4} />)}
    {new Array(18).fill(0).map((_, i) => <path key={`h${i}`} d={`M 0 ${i * 110} H 1080`} stroke="#c4d0ca" strokeWidth={4} />)}
    <rect width={1080} height={1920} fill="url(#i15_aksam)" />
  </g>
);
const Defs: React.FC = () => (
  <defs>
    <linearGradient id="i15_aksam" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb870" stopOpacity={0.35} /><stop offset="1" stopColor="#3a2a40" stopOpacity={0.25} /></linearGradient>
  </defs>
);

/** Banknot destesi (bantlı); acik: üstteki banknotların köşesi kalkar (0..1) */
const Deste: React.FC<{ x: number; y: number; a: number; s: number; cevir?: number; bant?: boolean }> = ({ x, y, a, s, cevir = 0, bant = true }) => (
  <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={-150} y={-70 - i * 9} width={300} height={140} rx={8} fill={i % 2 ? "#86c096" : "#7ab88a"} stroke={O} strokeWidth={4} />)}
    <rect x={-150} y={-142} width={300} height={140} rx={8} fill="#8ac89a" stroke={O} strokeWidth={4} />
    <circle cx={0} cy={-72} r={34} fill="none" stroke="#3a7a4a" strokeWidth={5} />
    <text x={-130} y={-24} fontFamily="Arial" fontSize={36} fontWeight={900} fill="#2a5a3a">200</text>
    <text x={130} y={-112} textAnchor="end" fontFamily="Arial" fontSize={28} fontWeight={900} fill="#2a5a3a">200</text>
    {bant ? <rect x={-34} y={-150} width={68} height={230} fill="#e8d8b0" stroke={O} strokeWidth={3} /> : null}
    {/* çevrilen köşe */}
    {cevir > 0.02 ? <path d={`M 150 -142 L 150 ${-142 + 120 * cevir} Q ${150 - 70 * cevir} ${-142 + 60 * cevir} ${150 - 130 * cevir} -142 Z`} fill="#a8dcb4" stroke={O} strokeWidth={4} /> : null}
  </g>
);

/** El (kol bilekten): tutma pozu; renk: [kol, kol gölgesi, ten] */
const El: React.FC<{ x: number; y: number; a: number; s: number; kol: [number, number]; r: readonly [string, string, string]; bas?: number }> = ({ x, y, a, s, kol, r, bas = 0 }) => (
  <g>
    <path d={`M ${kol[0]} ${kol[1]} L ${x} ${y}`} stroke={O} strokeWidth={170 * s + 10} strokeLinecap="round" />
    <path d={`M ${kol[0]} ${kol[1]} L ${x} ${y}`} stroke={r[0]} strokeWidth={170 * s} strokeLinecap="round" />
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <rect x={-90} y={-24} width={180} height={56} rx={24} fill={r[1]} stroke={O} strokeWidth={5} />
      <path d="M -70 -10 Q -90 -120 -46 -186 L 56 -186 Q 90 -110 70 -10 Z" fill={r[2]} stroke={O} strokeWidth={6} />
      {[-40, -8, 24].map((fx, i) => <path key={i} d={`M ${fx} -180 q 4 -62 28 -62 q 24 0 22 42`} fill={r[2]} stroke={O} strokeWidth={6} />)}
      {/* başparmak (bas: çevirme hareketi) */}
      <g transform={`rotate(${-bas * 28} -60 -110)`}>
        <path d="M -64 -100 Q -134 -150 -108 -214 Q -88 -234 -68 -208 Q -62 -166 -34 -144" fill={r[2]} stroke={O} strokeWidth={6} />
      </g>
    </g>
  </g>
);

const CepDeste: React.FC<{ sol?: boolean }> = ({ sol }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cek = ease(interpolate(t, [0.3, 1.1], [0, 1], cl));
  const titre = Math.sin(t * 9) * 3;
  const dx = 620, dy = 1180 - 520 * cek;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <Defs />
        <Arka />
        {/* kot: arka cep (alt yarı), dikişler, perçin */}
        <path d="M -60 1020 L 1140 980 L 1140 1960 L -60 1960 Z" fill="#34466a" stroke={O} strokeWidth={8} />
        {new Array(30).fill(0).map((_, i) => <path key={i} d={`M ${-60 + i * 42} 1000 L ${-80 + i * 42} 1960`} stroke="#2c3c5c" strokeWidth={3} opacity={0.6} />)}
        <path d="M 330 1160 L 900 1140 L 880 1640 L 610 1740 L 350 1640 Z" fill="#3c5078" stroke={O} strokeWidth={7} />
        <path d="M 350 1180 L 880 1162 M 366 1620 L 610 1716 L 862 1622" stroke="#d8a860" strokeWidth={5} strokeDasharray="16 10" fill="none" />
        <circle cx={340} cy={1165} r={10} fill="#c8a050" stroke={O} strokeWidth={3} /><circle cx={890} cy={1146} r={10} fill="#c8a050" stroke={O} strokeWidth={3} />
        {/* deste (cepten çıkarken cep ağzının altı kırpılır) */}
        <clipPath id="i15_cep"><path d={`M -100 -100 H 1200 V 1162 L 330 1172 L -100 1172 Z`} /></clipPath>
        <g clipPath={cek < 0.98 ? "url(#i15_cep)" : undefined}>
          <Deste x={dx} y={dy} a={-6 + 4 * cek} s={1.25} />
        </g>
        {/* annenin eli desteyi tutar */}
        <g transform={`translate(${titre} 0)`}>
          {sol ? <El x={dx - 150} y={dy + 40} a={25} s={1.2} kol={[-220, dy + 700]} r={KOL.anne} /> : <El x={dx + 150} y={dy + 40} a={-25} s={1.2} kol={[1300, dy + 700]} r={KOL.anne} />}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const ParaSay: React.FC<{ kim: "ece" | "anne" }> = ({ kim }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const hz = kim === "ece" ? 4.2 : 2.2; // banknot/sn
  const faz = (t * hz) % 1;
  const cevir = faz < 0.6 ? ease(faz / 0.6) : 1 - ease((faz - 0.6) / 0.4);
  const ucan = Math.floor(t * hz);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <Defs />
        <Arka renk={kim === "ece" ? "#e2dcd2" : "#d8e2dc"} />
        {/* sol el (arkada): avuç yukarı; çevrilen banknotlar avucun İÇİNDE birikir, başparmak üstlerinden tutar */}
        <El x={250} y={1250} a={30} s={1.1} kol={[-300, 1800]} r={KOL[kim]} />
        {new Array(Math.min(ucan, 14)).fill(0).map((_, i) => (
          <g key={i} transform={`translate(${345 + (i % 3) * 5} ${1085 - i * 6}) rotate(${-18 + (i % 4) * 4})`}>
            <rect x={-150} y={-70} width={300} height={140} rx={8} fill={i % 2 ? "#86c096" : "#7ab88a"} stroke={O} strokeWidth={4} />
            {i === Math.min(ucan, 14) - 1 ? <text x={-130} y={50} fontFamily="Arial" fontSize={36} fontWeight={900} fill="#2a5a3a">200</text> : null}
          </g>
        ))}
        {ucan > 0 ? <path d="M 236 1150 Q 210 1080 252 1040 Q 278 1028 290 1060 Q 292 1100 276 1150 Z" fill={KOL[kim][2]} stroke={O} strokeWidth={6} /> : null}
        <Deste x={640} y={1000} a={8} s={1.3} cevir={cevir} bant={false} />
        <El x={760} y={1180} a={-20} s={1.2} kol={[1400, 1750]} r={KOL[kim]} bas={cevir} />
      </svg>
    </AbsoluteFill>
  );
};

const KulakCek: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const kalk = ease(interpolate(t, [0.25, 0.7], [0, 1], cl)) - 0.15 * ease(interpolate(t, [dur - 0.5, dur], [0, 1], cl));
  const sars = Math.sin(t * 22) * 4 * kalk;
  const egim = 9 * kalk; // baş kulağın çekildiği yana (kadraj sağı) eğilir
  const size = 3000, S = size / 1000;
  const left = 540 - 200 * S, top = 300 - kalk * 160 + sars;
  // sağ kulak (rig 290,238), baş dönüş merkezi (200,300) etrafında egim kadar döner
  const r = (egim * Math.PI) / 180;
  const ex = 200 + (290 - 200) * Math.cos(r) - (238 - 300) * Math.sin(r);
  const ey = 300 + (290 - 200) * Math.sin(r) + (238 - 300) * Math.cos(r);
  const kx = left + ex * S, ky = top + ey * S;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        <Defs />
        <Arka />
      </svg>
      <div style={{ position: "absolute", left, top }}>
        <Character look={castById("ece_ev")} size={size} pose={{ emotion: "aci", tilt: egim, lookX: 0.4, lookY: -0.3, yaw: 0.15, talk: t > 0.3 && t < dur - 0.3 ? [[f - 2, f + 2]] : undefined, tears: 0.3, seed: 41 }} />
      </div>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        {/* annenin eli kulağı iki parmakla çimdikler; kol sağ üstten gelir */}
        <path d={`M 1300 -200 L ${kx + 70} ${ky - 60}`} stroke={O} strokeWidth={230} strokeLinecap="round" />
        <path d={`M 1300 -200 L ${kx + 70} ${ky - 60}`} stroke={KOL.anne[0]} strokeWidth={220} strokeLinecap="round" />
        <g transform={`translate(${kx} ${ky}) rotate(${-35 + egim})`}>
          <rect x={30} y={-150} width={170} height={60} rx={26} fill={KOL.anne[1]} stroke={O} strokeWidth={6} transform="rotate(-50 115 -120)" />
          <path d="M 20 -40 Q 70 -140 160 -110 Q 190 -40 120 20 Q 60 50 20 10 Z" fill={KOL.anne[2]} stroke={O} strokeWidth={7} />
          {/* başparmak önde, işaret parmağı arkada: kulak memesi arada */}
          <path d="M 30 -10 Q -30 -20 -40 20 Q -30 50 10 30" fill={KOL.anne[2]} stroke={O} strokeWidth={7} />
          <path d="M 40 10 Q -10 40 -26 70 Q -6 92 30 60" fill={KOL.anne[2]} stroke={O} strokeWidth={7} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const Insert15: React.FC<{ kind: Insert15Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "cep_deste": return <CepDeste sol={text?.[0] === "sol"} />;
    case "para_say": return <ParaSay kim={text?.[0] === "anne" ? "anne" : "ece"} />;
    case "kulak_cek": return <KulakCek dur={dur} />;
  }
};
