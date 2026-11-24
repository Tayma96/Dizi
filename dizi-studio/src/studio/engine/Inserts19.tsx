/* =====================================================================================
 * 7/24 Bölüm 8 (yeni) · Parça 3: "b8_fps": koşan bir kadının gözünden (birinci şahıs) karanlık ara sokak.
 * Gerçek perspektif izdüşümü (dünya: x yan, y yukarı, z sokak boyunca; metre). Kamera: konum + yaw/pitch/roll.
 * Sokak lambaları (sodyum turuncu) ışık havuzları, sis, ilerde harabe üstünde devrilmek üzere "7/24" market tabelası,
 * arkada özgün yaratık (çok uzun, aşırı ince, fazla eklemli; kemik beyazı uzun kafa, dikey yarık ağız).
 * Ekran katmanları: yerdeki eller (düşüş), oturarak geri itilen bacaklar + kırmızı mini etek.
 * Zaman çizelgesi JSON'dan (text[0]): kamera anahtar kareleri, yaratık konumu, el/bacak görünürlüğü. Hepsi kendi çizimimiz.
 * ===================================================================================== */
import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

export type Insert19Kind = "b8_fps";
export const INSERT19_KINDS: Insert19Kind[] = ["b8_fps"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Prm = Record<string, any>;
type KF = number[][];
const prm = (text?: string[]): Prm => {
  try {
    return text?.[0] ? JSON.parse(text[0]) : {};
  } catch {
    return {};
  }
};
const ss = (a: number, b: number, t: number) => {
  const u = Math.min(1, Math.max(0, (t - a) / Math.max(1e-6, b - a)));
  return u * u * (3 - 2 * u);
};
const kf = (k: KF | undefined, t: number, def: number[]): number[] => {
  if (!k || !k.length) return def;
  if (t <= k[0][0]) return k[0].slice(1);
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i], b = k[i + 1];
    if (t < b[0]) {
      const u = ss(a[0], b[0], t);
      return a.slice(1).map((v, j) => v + (b[j + 1] - v) * u);
    }
  }
  return k[k.length - 1].slice(1);
};
const kf1 = (k: KF | undefined, t: number, d: number) => kf(k, t, [d])[0];
const O = "#2b1d1a";
const W = 1080, H = 1920, F = 980;

type V3 = [number, number, number];
type Cam = { x: number; y: number; z: number; yaw: number; pitch: number; roll: number };
/** dünya → kamera uzayı (x sağ, y yukarı, z ileri) */
const toCam = (c: Cam, p: V3): V3 => {
  const dx = p[0] - c.x, dy = p[1] - c.y, dz = p[2] - c.z;
  const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
  const x1 = dx * cy - dz * sy, z1 = dx * sy + dz * cy;
  const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
  const y2 = dy * cp + z1 * sp, z2 = -dy * sp + z1 * cp;
  return [x1, y2, z2];
};
const NEAR = 0.08;
const proj = (q: V3): [number, number] => [W / 2 + (F * q[0]) / q[2], H / 2 - (F * q[1]) / q[2]];
/** çokgen: yakın düzlemde kırp, ekrana izdüşür */
const poly = (c: Cam, pts: V3[]): { d: string; z: number } | null => {
  const q = pts.map((p) => toCam(c, p));
  const out: V3[] = [];
  for (let i = 0; i < q.length; i++) {
    const a = q[i], b = q[(i + 1) % q.length];
    const ai = a[2] >= NEAR, bi = b[2] >= NEAR;
    if (ai) out.push(a);
    if (ai !== bi) {
      const u = (NEAR - a[2]) / (b[2] - a[2]);
      out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, NEAR]);
    }
  }
  if (out.length < 3) return null;
  const s = out.map(proj);
  const zm = q.reduce((m, v) => m + v[2], 0) / q.length;
  return { d: "M " + s.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") + " Z", z: zm };
};
const hex = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const mix = (a: string, b: string, u: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * u)).join(",")})`;
};
const SIS = "#0c1220";
const sis = (renk: string, z: number) => mix(renk, SIS, Math.min(0.85, 1 - Math.exp(-Math.max(0, z) / 42)));

/* ------------------------------------------------------------------ sokak geometrisi (deterministik) */
const SOL = -2.7, SAG = 2.7;
type Bina = { x: number; z0: number; z1: number; h: number; renk: string; pencere: number };
const BINALAR: Bina[] = [];
for (const side of [SOL, SAG]) {
  let z = -90;
  let i = 0;
  while (z < 90) {
    const L = 5 + 7 * random(`bL${side}${i}`);
    const renk = ["#3a2e2a", "#2e2a2c", "#3c3430", "#2a2c30", "#433630"][Math.floor(random(`bR${side}${i}`) * 5)];
    BINALAR.push({ x: side, z0: z, z1: z + L, h: 7 + 6 * random(`bH${side}${i}`), renk, pencere: Math.floor(random(`bP${side}${i}`) * 1000) });
    z += L;
    i++;
  }
}
const LAMBALAR: { x: number; z: number }[] = [];
for (let i = 0; i < 16; i++) LAMBALAR.push({ x: i % 2 ? SAG - 0.25 : SOL + 0.25, z: -84 + i * 12 + (i % 3) * 1.5 });
const MARKET_Z = 46;

const Sahne: React.FC<{ c: Cam; t: number; f: number; yaratik: number[]; yaratikGor: number; marketFlas: number }> = ({ c, t, f, yaratik, yaratikGor, marketFlas }) => {
  const parcalar: { z: number; el: React.ReactNode }[] = [];
  const ekle = (pts: V3[], renk: string, key: string, extra?: React.SVGProps<SVGPathElement>) => {
    const p = poly(c, pts);
    if (p) parcalar.push({ z: p.z, el: <path key={key} d={p.d} fill={sis(renk, p.z)} {...extra} /> });
  };
  // zemin: 2 m şeritler (asfalt, ortada su oluğu)
  for (let z = -90; z < 90; z += 2) {
    const k = Math.floor(z / 2);
    const r = random(`z${k}`);
    ekle([[SOL, 0, z], [SAG, 0, z], [SAG, 0, z + 2], [SOL, 0, z + 2]], r > 0.5 ? "#26252a" : "#232227", `g${k}`);
    ekle([[-0.25, 0.002, z], [0.25, 0.002, z], [0.25, 0.002, z + 2], [-0.25, 0.002, z + 2]], "#1a1a1f", `o${k}`);
    if (r > 0.72) ekle([[-1.4 + r, 0.003, z + 0.4], [-0.2 + r, 0.003, z + 0.5], [-0.4 + r, 0.003, z + 1.5], [-1.6 + r, 0.003, z + 1.3]], "#3a4050", `su${k}`);
  }
  // binalar (iç yüzler) + pencereler + kapılar
  for (const [i, b] of BINALAR.entries()) {
    ekle([[b.x, 0, b.z0], [b.x, 0, b.z1], [b.x, b.h, b.z1], [b.x, b.h, b.z0]], b.renk, `w${i}`);
    ekle([[b.x, 0, b.z0], [b.x, 0, b.z1], [b.x, 0.6, b.z1], [b.x, 0.6, b.z0]], "#1c1a1c", `wd${i}`);
    for (let kat = 0; kat < Math.floor((b.h - 2.5) / 2.6); kat++) {
      for (let p = 0; p < Math.floor((b.z1 - b.z0) / 2.4); p++) {
        const zz = b.z0 + 0.9 + p * 2.4, yy = 3 + kat * 2.6;
        const yanik = random(`pw${b.pencere}${kat}${p}`) > 0.86;
        ekle([[b.x, yy, zz], [b.x, yy, zz + 1.1], [b.x, yy + 1.4, zz + 1.1], [b.x, yy + 1.4, zz]], yanik ? "#6a5a3a" : "#121418", `p${i}_${kat}_${p}`);
      }
    }
    if ((b.pencere % 3) === 0) ekle([[b.x, 0, b.z0 + 1.5], [b.x, 0, b.z0 + 2.6], [b.x, 2.2, b.z0 + 2.6], [b.x, 2.2, b.z0 + 1.5]], "#161414", `k${i}`);
  }
  // asfalt dokusu: kameranın çevresinde çakıl ve çatlaklar (yere bakınca ve koşarken derinlik verir)
  const z0 = Math.floor(c.z) - 6;
  for (let i = 0; i < 260; i++) {
    const zz = z0 + (i % 26) * 0.6 + random(`tz${Math.floor(i / 26)}${i % 26}${z0 % 7}`) * 0.6, xx = SOL + 0.1 + random(`tx${i}${z0 % 5}`) * (SAG - SOL - 0.2);
    const q = toCam(c, [xx, 0.004, zz]);
    if (q[2] > 0.15 && q[2] < 14) {
      const [sx, sy] = proj(q);
      const r = (F * (0.012 + 0.02 * random(`tr${i}`))) / q[2];
      parcalar.push({ z: q[2] + 0.001, el: <ellipse key={`t${i}`} cx={sx} cy={sy} rx={r} ry={r * 0.6} fill={random(`tc${i}`) > 0.5 ? "#4a4850" : "#121116"} opacity={0.8} /> });
    }
  }
  // sıralama: uzaktan yakına
  parcalar.sort((a, b) => b.z - a.z);

  // ışık havuzları + lambalar (eklemeli)
  const isik: React.ReactNode[] = [];
  for (const [i, L] of LAMBALAR.entries()) {
    const zc = toCam(c, [L.x * 0.55, 0, L.z]);
    if (zc[2] > NEAR) {
      const [sx, sy] = proj(zc);
      const r = (F * 2.2) / zc[2];
      const yer = toCam(c, [L.x * 0.55, 0, L.z + 2.2]);
      const ry = yer[2] > NEAR ? Math.max(3, Math.abs(proj(yer)[1] - sy)) : r * 0.4;
      isik.push(<ellipse key={`h${i}`} cx={sx} cy={sy} rx={r} ry={Math.min(r, ry)} fill="url(#fpsHavuz)" opacity={0.55 * Math.exp(-zc[2] / 45)} />);
    }
    const lc = toCam(c, [L.x, 4.3, L.z]);
    if (lc[2] > NEAR) {
      const [sx, sy] = proj(lc);
      const r = (F * 0.55) / lc[2];
      const titre = i === 5 ? (random(`lt${Math.floor(f / 3)}`) > 0.7 ? 0.3 : 1) : 1;
      isik.push(<circle key={`l${i}`} cx={sx} cy={sy} r={r * 3.2} fill="url(#fpsHale)" opacity={0.9 * titre * Math.exp(-lc[2] / 55)} />);
      isik.push(<circle key={`lb${i}`} cx={sx} cy={sy} r={Math.max(1.5, r * 0.32)} fill="#ffe2a8" opacity={titre} />);
    }
  }

  // market harabesi (billboard, metre ölçeği)
  const mc = toCam(c, [0, 0, MARKET_Z]);
  let market: React.ReactNode = null;
  if (mc[2] > 1) {
    const [mx, my] = proj(mc);
    const s = F / mc[2];
    const neon = marketFlas * (random(`nf${Math.floor(f / 2)}`) > 0.82 ? 0.25 : 1);
    market = (
      <g transform={`translate(${mx} ${my}) scale(${s})`} opacity={1 - Math.min(0.55, mc[2] / 140)}>
        {/* moloz yığını */}
        <path d="M -4.6 0 L -3.8 -1.2 L -2.6 -1.6 L -1.2 -2.3 L 0.4 -1.9 L 1.8 -2.5 L 3.2 -1.7 L 4.4 -0.9 L 4.8 0 Z" fill="#2a2628" />
        <path d="M -3.2 -1.3 L -2.2 -1.9 L -1.6 -1.4 Z M 1.2 -2.1 L 2.4 -2.6 L 2.6 -2.0 Z M -0.6 -1.9 L 0.3 -2.4 L 0.8 -1.8 Z" fill="#3a3436" />
        {/* yıkık duvar kalıntısı + eğik bina gövdesi */}
        <g transform="rotate(-7 0 -1.6)">
          <path d="M -2.8 -1.6 L -2.8 -5.4 L -1.6 -5.9 L -0.9 -5.2 L 0.4 -6.1 L 1.5 -5.3 L 2.6 -5.6 L 2.7 -1.6 Z" fill="#332d2e" stroke="#151214" strokeWidth={0.06} />
          <path d="M -2.2 -2.0 L -0.6 -2.0 L -0.6 -3.7 L -2.2 -3.7 Z M 0.4 -2.0 L 2.0 -2.0 L 2.0 -3.7 L 0.4 -3.7 Z" fill="#0c0c10" />
          <path d="M -0.4 -1.6 L 0.25 -1.6 L 0.25 -3.3 L -0.4 -3.3 Z" fill="#a8c8e8" opacity={0.12 + 0.18 * neon} />
          {/* devrilmek üzere tabela: tek ayağı kırık, eğik */}
          <g transform="rotate(-14 -2.4 -5.4)">
            <path d="M -2.5 -5.3 L -2.5 -6.0" stroke="#4a4a50" strokeWidth={0.08} />
            <rect x={-2.7} y={-7.1} width={5.0} height={1.15} rx={0.08} fill="#1a1416" stroke="#3a3034" strokeWidth={0.06} />
            <text x={-0.2} y={-6.2} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight={900} fontSize={0.95} fill="#ff2a2a" opacity={0.25 + 0.75 * neon}>7/24</text>
            <text x={-0.2} y={-6.2} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight={900} fontSize={0.95} fill="none" stroke="#ff8a8a" strokeWidth={0.03} opacity={0.6 * neon}>7/24</text>
          </g>
        </g>
        <ellipse cx={-0.2} cy={-6.6} rx={3.4} ry={1.6} fill="url(#fpsNeon)" opacity={0.55 * neon} />
      </g>
    );
  }

  // yaratık (billboard; yaratik = [x, z, adımFazı])
  let ya: React.ReactNode = null;
  const yc = toCam(c, [yaratik[0], 0, yaratik[1]]);
  if (yaratikGor > 0.01 && yc[2] > 0.5) {
    const [x, y] = proj(yc);
    const s = F / yc[2];
    ya = <g transform={`translate(${x} ${y}) scale(${s})`} opacity={yaratikGor}><Yaratik ph={yaratik[2]} t={t} /></g>;
  }

  return (
    <g>
      {/* gökyüzü şeridi: bulutlu lacivert, ay ışığı */}
      <rect x={-400} y={-600} width={W + 800} height={H + 1200} fill="#0a0f1c" />
      {parcalar.map((p) => p.el)}
      <g style={{ mixBlendMode: "screen" }}>{isik}</g>
      {market}
      {ya}
    </g>
  );
};

/* ------------------------------------------------------------------ yaratık (metre; ayak tabanı = 0, yukarı = -y) */
const Yaratik: React.FC<{ ph: number; t: number }> = ({ ph, t }) => {
  const a = Math.sin(ph), b = Math.cos(ph);
  const sarsil = Math.sin(t * 23) * (Math.sin(t * 1.7) > 0.85 ? 0.08 : 0);       // ara ara kafa seğirmesi
  const bacak = (s: number) => {
    const k = s * a;
    const kalca: [number, number] = [s * 0.12, -1.75];
    const diz: [number, number] = [s * 0.16 + 0.22 * k, -0.95 + 0.08 * Math.abs(k)];
    const ayak: [number, number] = [s * 0.14 + 0.32 * k, -0.02 - 0.12 * Math.max(0, s * b)];
    return <path d={`M ${kalca[0]} ${kalca[1]} L ${diz[0]} ${diz[1]} L ${ayak[0]} ${ayak[1]} l ${0.16 * s} 0.02`} stroke="#16141a" strokeWidth={0.075} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
  };
  const kol = (s: number) => {
    const k = -s * a;
    const omuz: [number, number] = [s * 0.2, -2.85];
    const dirsek: [number, number] = [s * 0.42 + 0.12 * k, -2.05];
    const bilek: [number, number] = [s * 0.36 + 0.28 * k, -1.2];
    const parmak = [0, 1, 2, 3].map((i) => `M ${bilek[0]} ${bilek[1]} q ${s * (0.02 + i * 0.03)} 0.2 ${s * (0.04 + i * 0.04)} ${0.42 - i * 0.03}`).join(" ");
    return (
      <g>
        <path d={`M ${omuz[0]} ${omuz[1]} L ${dirsek[0]} ${dirsek[1]} L ${bilek[0]} ${bilek[1]}`} stroke="#18161c" strokeWidth={0.06} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={parmak} stroke="#18161c" strokeWidth={0.025} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  return (
    <g>
      <ellipse cx={0} cy={0} rx={0.55} ry={0.08} fill="#000" opacity={0.45} />
      {bacak(-1)}
      {bacak(1)}
      {/* gövde: dar, uzun, kaburgalı; hafif öne kambur */}
      <path d="M -0.16 -1.72 Q -0.24 -2.3 -0.26 -2.9 Q -0.05 -3.05 0.22 -2.92 Q 0.22 -2.3 0.14 -1.72 Z" fill="#1d1a20" stroke="#0a090c" strokeWidth={0.03} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M -0.2 ${-2.45 - i * 0.12} Q 0 ${-2.4 - i * 0.12} 0.18 ${-2.46 - i * 0.12}`} stroke="#3a343e" strokeWidth={0.018} fill="none" />)}
      {kol(-1)}
      {kol(1)}
      {/* boyun: uzun, öne eğik */}
      <path d="M 0.02 -2.95 Q 0.06 -3.12 0.12 -3.22" stroke="#1d1a20" strokeWidth={0.07} fill="none" strokeLinecap="round" />
      {/* kafa: kemik beyazı, uzun; çukur gözler, dikey yarık ağız + iğne dişler */}
      <g transform={`translate(${0.13 + sarsil} -3.5) rotate(${8 + 30 * sarsil})`}>
        <path d="M -0.17 0.28 Q -0.24 -0.05 -0.16 -0.34 Q 0 -0.48 0.16 -0.34 Q 0.24 -0.05 0.17 0.28 Q 0 0.42 -0.17 0.28 Z" fill="#d6d0c2" stroke="#2a2420" strokeWidth={0.02} />
        <path d="M -0.12 -0.12 q 0.05 -0.07 0.09 0 q -0.04 0.07 -0.09 0 Z M 0.03 -0.12 q 0.05 -0.07 0.09 0 q -0.04 0.07 -0.09 0 Z" fill="#060506" />
        <circle cx={-0.075} cy={-0.115} r={0.008} fill="#f4f0e0" />
        <circle cx={0.075} cy={-0.115} r={0.008} fill="#f4f0e0" />
        <path d="M 0 -0.02 Q 0.035 0.14 0 0.34 Q -0.035 0.14 0 -0.02 Z" fill="#1a0808" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${i % 2 ? 0.02 : -0.02} ${0.02 + i * 0.05} l ${i % 2 ? -0.025 : 0.025} 0.01`} stroke="#efe8d8" strokeWidth={0.008} />)}
        <path d="M -0.15 -0.26 q 0.05 0.06 0.02 0.14 M 0.12 0.05 q 0.03 0.08 -0.01 0.16" stroke="#8a8274" strokeWidth={0.008} fill="none" />
      </g>
      {/* lamba ışığından kenar parlaması */}
      <path d="M 0.22 -2.92 Q 0.22 -2.3 0.14 -1.72" stroke="#c89060" strokeWidth={0.012} opacity={0.6} fill="none" />
    </g>
  );
};

/* ------------------------------------------------------------------ eller (ekran katmanı; düşünce yere basılı) */
const El: React.FC<{ s: 1 | -1 }> = ({ s }) => {
  // s: -1 sol el (kadraj solu), 1 sağ el; avuç yere basık, parmaklar ileri (yukarı), hafif açık
  const ten = "#f0c8a8", tenK = "#d9a888", oje = "#c4162a";
  const parmaklar = [
    { x: -38, l: 118, a: -14 }, { x: -12, l: 146, a: -4 }, { x: 14, l: 150, a: 3 }, { x: 40, l: 128, a: 10 }, { x: 62, l: 96, a: 20 },
  ];
  return (
    <g transform={`scale(${s} 1)`}>
      <ellipse cx={8} cy={-40} rx={120} ry={95} fill="#000" opacity={0.35} />
      {/* kol: siyah deri ceket kolu */}
      <path d="M -120 420 L -70 120 Q 0 70 70 120 L 130 420 Z" fill="#1a1a1e" stroke={O} strokeWidth={6} />
      <path d="M -70 120 Q 0 70 70 120" stroke="#3a3a42" strokeWidth={8} fill="none" />
      {/* bilek + avuç sırtı */}
      <path d="M -62 118 Q -80 40 -70 -20 Q -40 -70 20 -66 Q 78 -58 86 -10 Q 92 50 66 118 Z" fill={ten} stroke={O} strokeWidth={6} />
      <path d="M -40 -10 Q 0 -30 50 -14" stroke={tenK} strokeWidth={4} fill="none" opacity={0.7} />
      {/* parmaklar: işaret→küçük; başparmak içe */}
      {parmaklar.slice(0, 4).map((p, i) => (
        <g key={i} transform={`translate(${p.x} -52) rotate(${p.a})`}>
          <path d={`M -15 0 L -13 ${-p.l + 14} Q 0 ${-p.l - 6} 13 ${-p.l + 14} L 15 0 Z`} fill={ten} stroke={O} strokeWidth={5.5} strokeLinejoin="round" />
          <path d={`M -9 ${-p.l * 0.45} q 9 -5 18 0 M -9 ${-p.l * 0.75} q 9 -4 18 0`} stroke={tenK} strokeWidth={3} fill="none" />
          <path d={`M -9 ${-p.l + 16} Q 0 ${-p.l - 2} 9 ${-p.l + 16} L 8 ${-p.l + 30} Q 0 ${-p.l + 26} -8 ${-p.l + 30} Z`} fill={oje} stroke={O} strokeWidth={3} />
          <path d={`M -4 ${-p.l + 12} l 2 8`} stroke="#ff8a96" strokeWidth={2.5} />
        </g>
      ))}
      <g transform="translate(-70 0) rotate(-32)">
        <path d={`M -17 0 L -15 -74 Q 0 -90 15 -74 L 17 0 Z`} fill={ten} stroke={O} strokeWidth={5.5} />
        <path d="M -9 -72 Q 0 -86 9 -72 L 8 -60 Q 0 -64 -8 -60 Z" fill={oje} stroke={O} strokeWidth={3} />
      </g>
      {/* sıyrık */}
      <path d="M 30 40 l 24 -8 M 34 52 l 20 -6" stroke="#c0505a" strokeWidth={3} opacity={0.7} />
    </g>
  );
};

/* ------------------------------------------------------------------ bacaklar (oturarak geri itme; ekran katmanı) */
const Bacak: React.FC<{ s: 1 | -1; buk: number }> = ({ s, buk }) => {
  // Oturan kadının gözünden kendi bacağı (kamera ~22° aşağı bakar): kalçadan bileğe TEK kesintisiz hat (uyluk dolgun, diz hafif
  // kabarık, baldır ince), uçta beyaz spor ayakkabı (topuğu bize dönük). buk 0..0,6: diz hafifçe kalkar, ayak yaklaşır (itme).
  const b = Math.min(0.6, buk);
  const ten = "#efc6a4", tenK = "#cf9e7c", isik = "#ffdcc0";
  const hy = 2120, ky = 1690 - 300 * b, ay = 1300 + 160 * b;
  const X = (v: number) => s * v;
  const kx = 168 + 14 * b, ax = 124 + 22 * b;
  // dış hat (kadraj kenarına bakan) ve iç hat; diz bölgesinde hafif kabarıklık
  const d = `M ${X(410)} ${hy} C ${X(390)} ${hy - 160} ${X(kx + 150)} ${ky + 170} ${X(kx + 118)} ${ky + 20}
    C ${X(kx + 112)} ${ky - 30} ${X(kx + 98)} ${ky - 50} ${X(kx + 86)} ${ky - 90}
    C ${X(ax + 92)} ${(ky + ay) / 2} ${X(ax + 64)} ${ay + 70} ${X(ax + 52)} ${ay}
    L ${X(ax - 46)} ${ay}
    C ${X(ax - 56)} ${ay + 80} ${X(kx - 82)} ${(ky + ay) / 2 + 40} ${X(kx - 92)} ${ky - 60}
    C ${X(kx - 104)} ${ky - 20} ${X(kx - 110)} ${ky + 20} ${X(kx - 108)} ${ky + 60}
    C ${X(kx - 120)} ${ky + 200} ${X(70)} ${hy - 160} ${X(30)} ${hy} Z`;
  return (
    <g>
      <path d={d} fill={ten} stroke={O} strokeWidth={7} strokeLinejoin="round" />
      {/* iç uyluk gölgesi, diz kapağı çizgisi, lamba ışığı sırtı */}
      <path d={`M ${X(60)} ${hy - 40} C ${X(kx - 90)} ${ky + 220} ${X(kx - 96)} ${ky + 80} ${X(kx - 98)} ${ky + 30}`} stroke={tenK} strokeWidth={26} fill="none" opacity={0.35} strokeLinecap="round" />
      <path d={`M ${X(kx - 40)} ${ky - 20} Q ${X(kx)} ${ky + 8} ${X(kx + 40)} ${ky - 20}`} stroke={tenK} strokeWidth={5} fill="none" />
      <path d={`M ${X(380)} ${hy - 60} C ${X(kx + 150)} ${ky + 230} ${X(kx + 100)} ${ky + 60} ${X(kx + 70)} ${ky - 50}`} stroke={isik} strokeWidth={20} fill="none" opacity={0.3} strokeLinecap="round" />
      {/* spor ayakkabı: topuk bize dönük, burnu ileride (yukarıda); bilekten geniş */}
      <g transform={`translate(${X(ax + 3)} ${ay - 4}) rotate(${s * 6})`}>
        <path d="M -78 34 Q -86 -40 -50 -104 Q 0 -134 50 -104 Q 86 -40 78 34 Q 0 58 -78 34 Z" fill="#f4f4f2" stroke={O} strokeWidth={6} />
        <path d="M -56 -84 Q 0 -122 56 -84 Q 34 -128 0 -132 Q -34 -128 -56 -84 Z" fill="#dcdce2" stroke={O} strokeWidth={4} />
        <path d="M -46 -50 Q 0 -70 46 -50 L 40 6 Q 0 -6 -40 6 Z" fill="#e8e8ec" stroke={O} strokeWidth={4} />
        {[0, 1, 2].map((i) => <path key={i} d={`M -28 ${-40 + i * 15} L 28 ${-40 + i * 15}`} stroke="#8a8a92" strokeWidth={5} strokeLinecap="round" />)}
        <path d="M -74 22 Q 0 50 74 22" stroke="#c4162a" strokeWidth={10} fill="none" />
        <path d="M -30 30 Q 0 40 30 30" stroke="#b8b8c0" strokeWidth={5} fill="none" />
      </g>
    </g>
  );
};
const Etek: React.FC<{ sal: number }> = ({ sal }) => (
  // kırmızı mini etek kenarı, kadrajın altında (kamera aşağı baktıkça görünür)
  <g>
    <path d={`M -60 1920 L -60 ${1800 + sal} Q 200 ${1760 - sal} 540 ${1790 + sal} Q 880 ${1760 - sal} 1140 ${1800 + sal} L 1140 1920 Z`} fill="#c4162a" stroke={O} strokeWidth={7} />
    <path d={`M 120 1790 q 30 50 10 130 M 380 1785 q 20 60 0 135 M 700 1785 q -20 60 0 135 M 960 1790 q -30 50 -10 130`} stroke="#8a0c1c" strokeWidth={6} fill="none" opacity={0.7} />
  </g>
);

/* ------------------------------------------------------------------ ana bileşen */
const B8Fps: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = prm(text);
  const t = f / fps + (p.t0 ?? 0);
  // kamera anahtar kareleri: [t, x, y, z, yawDerece, pitchDerece, rollDerece]
  const [x, y, z, yawD, pitD, rolD] = kf(p.kam, t, [0, 1.62, 0, 0, 0, 0]);
  // koşu/sürünme sallantısı: [t, koşuGenliği 0..1, adımHz]
  const [kos, hz] = kf(p.sallan, t, [0, 2.8]);
  const faz = 2 * Math.PI * hz * t;
  const bobY = kos * (0.055 * Math.abs(Math.sin(faz)) - 0.03), bobX = kos * 0.05 * Math.sin(faz / 2 + 0.3), bobR = kos * 2.2 * Math.sin(faz / 2);
  const sars = kf1(p.sars, t, 0);
  const shX = sars * 30 * (random(`sx${f}`) - 0.5), shY = sars * 30 * (random(`sy${f}`) - 0.5);
  const cam: Cam = { x: x + bobX, y: y + bobY, z, yaw: (yawD * Math.PI) / 180, pitch: (pitD * Math.PI) / 180 + kos * 0.012 * Math.sin(faz), roll: 0 };
  const roll = rolD + bobR;
  // dönüş hızına göre hareket bulanıklığı
  const yawHiz = Math.abs(kf(p.kam, t + 0.02, [0, 0, 0, 0])[3] - yawD) / 0.02;
  const blur = Math.min(14, yawHiz / 40) + kos * 0.6;
  const ya = kf(p.yaratik, t, [0, -60, 0]);
  const yaG = kf1(p.yaratikGor, t, 0);
  const el = kf1(p.el, t, 0);
  const bacak = kf1(p.bacak, t, 0);
  const [b1, b2] = kf(p.buk, t, [0.2, 0.6]);
  const nefes = 1 + 0.02 * Math.sin(t * 9);
  const elTit = el > 0 ? 4 * Math.sin(t * 31) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070c", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shX}px, ${shY}px) rotate(${roll}deg) scale(1.06)`, transformOrigin: "540px 960px", filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <radialGradient id="fpsHavuz"><stop offset="0" stopColor="#ffb25a" stopOpacity={0.55} /><stop offset="0.6" stopColor="#c86a2a" stopOpacity={0.18} /><stop offset="1" stopColor="#c86a2a" stopOpacity={0} /></radialGradient>
            <radialGradient id="fpsHale"><stop offset="0" stopColor="#ffd08a" stopOpacity={0.9} /><stop offset="0.25" stopColor="#ff9a40" stopOpacity={0.35} /><stop offset="1" stopColor="#ff9a40" stopOpacity={0} /></radialGradient>
            <radialGradient id="fpsNeon"><stop offset="0" stopColor="#ff2030" stopOpacity={0.7} /><stop offset="1" stopColor="#ff2030" stopOpacity={0} /></radialGradient>
          </defs>
          <Sahne c={cam} t={t} f={f} yaratik={ya} yaratikGor={yaG} marketFlas={1} />
        </svg>
      </AbsoluteFill>
      {/* sis/derinlik: ufukta soğuk sis bandı */}

      {/* eller (düşüş) */}
      {el > 0.01 ? (
        <AbsoluteFill style={{ transform: `translateY(${(1 - el) * 900}px)` }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <g transform={`translate(${290 + elTit} ${1360 * nefes}) rotate(14) scale(1.75)`}><El s={-1} /></g>
            <g transform={`translate(${800 - elTit} ${1390 * nefes}) rotate(-12) scale(1.75)`}><El s={1} /></g>
            <rect width={W} height={H} fill="#2a3050" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
          </svg>
        </AbsoluteFill>
      ) : null}
      {/* bacaklar + etek (oturarak geri itme) */}
      {bacak > 0.01 ? (
        <AbsoluteFill style={{ transform: `translateY(${(1 - bacak) * 1000}px)` }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <g transform="translate(540 0)">
              <Bacak s={-1} buk={b1} />
              <Bacak s={1} buk={b2} />
            </g>
            <Etek sal={8 * Math.sin(t * 6)} />
            <rect width={W} height={H} fill="#2a3050" opacity={0.22} style={{ mixBlendMode: "multiply" }} />
          </svg>
        </AbsoluteFill>
      ) : null}
      {/* renk: soğuk gece, kenar kararması, nefes buğusu titremesi, grenli */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 62% at 50% 48%, rgba(0,0,0,0) 45%, rgba(2,3,8,0.88) 100%)" }} />
      <AbsoluteFill style={{ background: `rgba(160,0,10,${(kf1(p.kirmizi, t, 0) * 0.25).toFixed(3)})`, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ opacity: 0.08, backgroundImage: `radial-gradient(circle at ${(random(`gr${f}`) * 100).toFixed(1)}% ${(random(`gq${f}`) * 100).toFixed(1)}%, #fff 0.5px, transparent 1.2px)`, backgroundSize: "5px 5px" }} />
    </AbsoluteFill>
  );
};

export const Insert19: React.FC<{ kind: Insert19Kind; dur: number; text?: string[] }> = ({ text }) => <B8Fps text={text} />;
