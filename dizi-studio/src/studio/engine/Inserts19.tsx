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
const W = 1080, H = 1920;
let F = 980;   // odak uzaklığı: her karede fov ile ayarlanır (dolly zoom)

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

const Sahne: React.FC<{ c: Cam; t: number; f: number; yaratik: number[]; yaratikGor: number; marketFlas: number; egik: number; seg: number; agiz: number }> = ({ c, t, f, yaratik, yaratikGor, marketFlas, egik, seg, agiz }) => {
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
    ya = <g transform={`translate(${x} ${y}) scale(${s})`} opacity={yaratikGor}><Yaratik ph={yaratik[2]} t={t} egik={egik} seg={seg} agiz={agiz} /></g>;
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

/* ------------------------------------------------------------------ yaratık (metre; ayak tabanı = 0, yukarı = -y). Özgün tasarım:
 * 3,5 m, sıska; dizleri GERİYE kırılan bacaklar, boğumlu eklemler; kaburga ve omurga derinin altından belli;
 * fazladan eklemli, yere sarkan kollar, asfaltta sürünen iğne pençeler; omur omur uzun boyun;
 * çatlak kemik beyazı uzun kafa: iki derin göz çukuru + altında küçük siyah göz kümesi; alından çeneye DİKEY YARIK ağız
 * (agiz 0..1 açılır: içi koyu kırmızı, kenarlarında iğne dişler, sarkan salya). */
const Yaratik: React.FC<{ ph: number; t: number; egik?: number; seg?: number; agiz?: number }> = ({ ph, t, egik = 0, seg = 0, agiz = 0 }) => {
  const a = Math.sin(ph), b = Math.cos(ph);
  const sarsil = Math.sin(t * 23) * (Math.sin(t * 1.7) > 0.85 ? 0.08 : 0) + seg * 0.06 * Math.sin(t * 41);
  const DERI = "#24232a", DERI2 = "#3a3842", KENAR = "#c89060", KEMIK = "#d9d2c0";
  const eklem = (x: number, y: number, r: number) => <circle cx={x} cy={y} r={r} fill={DERI2} stroke="#0a090c" strokeWidth={0.015} />;
  const bacak = (s: number) => {
    const k = s * a;
    const kalca: [number, number] = [s * 0.11, -1.8];
    const diz: [number, number] = [s * 0.13 - 0.2 + 0.18 * k, -1.08 + 0.06 * Math.abs(k)];     // diz GERİYE kırık
    const bilek: [number, number] = [s * 0.12 + 0.12 + 0.3 * k, -0.32 - 0.1 * Math.max(0, s * b)];
    const ayak: [number, number] = [bilek[0] + 0.06, -0.02];
    return (
      <g>
        <path d={`M ${kalca[0]} ${kalca[1]} L ${diz[0]} ${diz[1]} L ${bilek[0]} ${bilek[1]} L ${ayak[0]} ${ayak[1]}`} stroke={DERI} strokeWidth={0.07} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {eklem(diz[0], diz[1], 0.05)}
        {eklem(bilek[0], bilek[1], 0.04)}
        {[-1, 0, 1].map((i) => <path key={i} d={`M ${ayak[0]} ${ayak[1]} l ${0.12 + 0.03 * i} ${0.015 * i}`} stroke={DERI} strokeWidth={0.02} strokeLinecap="round" />)}
      </g>
    );
  };
  const kol = (s: number) => {
    const k = -s * a;
    const omuz: [number, number] = [s * 0.21, -2.82];
    const e1: [number, number] = [s * 0.4 + 0.08 * k, -2.25];
    const e2: [number, number] = [s * 0.33 + 0.16 * k, -1.55];       // fazladan eklem
    const bilek: [number, number] = [s * 0.42 + 0.24 * k, -0.85];
    const parmak = [0, 1, 2, 3, 4].map((i) => {
      const ux = s * (-0.05 + i * 0.035), uy = 0.78 - Math.abs(i - 2) * 0.05;
      return `M ${bilek[0]} ${bilek[1]} q ${ux * 0.5} ${uy * 0.5} ${ux} ${uy}`;
    }).join(" ");
    return (
      <g>
        <path d={`M ${omuz[0]} ${omuz[1]} L ${e1[0]} ${e1[1]} L ${e2[0]} ${e2[1]} L ${bilek[0]} ${bilek[1]}`} stroke={DERI} strokeWidth={0.055} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {eklem(e1[0], e1[1], 0.04)}
        {eklem(e2[0], e2[1], 0.035)}
        <path d={parmak} stroke="#121116" strokeWidth={0.022} fill="none" strokeLinecap="round" />
        <path d={parmak} stroke={KEMIK} strokeWidth={0.006} fill="none" strokeLinecap="round" opacity={0.5} />
      </g>
    );
  };
  const ac = Math.max(0, Math.min(1, agiz));
  return (
    <g>
      <ellipse cx={0} cy={0} rx={0.7} ry={0.09} fill="#000" opacity={0.5} />
      {bacak(-1)}
      {bacak(1)}
      {/* leğen kemiği + sıska gövde, öne kambur */}
      <path d="M -0.17 -1.72 Q 0 -1.62 0.17 -1.72 L 0.13 -1.9 Q 0 -1.84 -0.13 -1.9 Z" fill={DERI2} />
      <path d="M -0.14 -1.86 Q -0.26 -2.35 -0.24 -2.9 Q -0.02 -3.06 0.24 -2.9 Q 0.25 -2.35 0.13 -1.86 Q 0 -1.8 -0.14 -1.86 Z" fill={DERI} stroke="#0a090c" strokeWidth={0.025} />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M -0.21 ${-2.3 - i * 0.1} Q 0 ${-2.22 - i * 0.1} 0.2 ${-2.3 - i * 0.1}`} stroke="#6a6470" strokeWidth={0.016} fill="none" />)}
      <path d="M 0 -2.92 L 0 -1.9" stroke="#4a4852" strokeWidth={0.012} strokeDasharray="0.03 0.03" />
      <path d="M -0.12 -2.08 q 0.12 0.05 0.24 0" stroke="#4a4852" strokeWidth={0.012} fill="none" />
      {kol(-1)}
      {kol(1)}
      {/* omur omur boyun */}
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={0.02 + i * 0.03} cy={-2.95 - i * 0.07} r={0.04} fill={DERI2} stroke="#0a090c" strokeWidth={0.01} />)}
      {/* kafa */}
      <g transform={`translate(${0.16 + sarsil + egik * 0.004} -3.5) rotate(${10 + 30 * sarsil + egik}) scale(1.4)`}>
        <path d="M -0.18 0.3 Q -0.26 -0.05 -0.17 -0.38 Q 0 -0.52 0.17 -0.38 Q 0.26 -0.05 0.18 0.3 Q 0 0.44 -0.18 0.3 Z" fill={KEMIK} stroke="#2a2420" strokeWidth={0.02} />
        {/* çatlaklar */}
        <path d="M -0.14 -0.3 l 0.04 0.08 l -0.02 0.07 M 0.15 -0.18 l -0.05 0.06 l 0.02 0.08 M -0.16 0.12 l 0.05 0.03 M 0.12 0.2 l -0.03 0.07" stroke="#6a5a4a" strokeWidth={0.008} fill="none" />
        {/* iki derin göz çukuru + küçük göz kümesi */}
        <ellipse cx={-0.08} cy={-0.16} rx={0.055} ry={0.075} fill="#050405" />
        <ellipse cx={0.08} cy={-0.16} rx={0.055} ry={0.075} fill="#050405" />
        <circle cx={-0.075} cy={-0.15} r={0.007} fill="#ffefe0" />
        <circle cx={0.085} cy={-0.15} r={0.007} fill="#ffefe0" />
        {[[-0.12, -0.04, 0.016], [-0.09, 0.0, 0.012], [0.1, -0.03, 0.014], [0.13, 0.01, 0.011], [-0.13, 0.05, 0.01], [0.12, 0.07, 0.01]].map(([x, y, r], i) => (
          <g key={i}><circle cx={x} cy={y} r={r} fill="#080607" /><circle cx={x + r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#e8dccc" /></g>
        ))}
        {/* dikey yarık ağız: alından çeneye; açılınca baklava şeklinde, içi koyu kırmızı, iğne dişler */}
        <path d={`M 0 -0.34 Q ${0.01 + 0.1 * ac} 0 0 0.4 Q ${-0.01 - 0.1 * ac} 0 0 -0.34 Z`} fill="#24060a" stroke="#120304" strokeWidth={0.01} />
        {ac > 0.05 ? <path d={`M 0 -0.2 Q ${0.05 * ac} 0.03 0 0.28 Q ${-0.05 * ac} 0.03 0 -0.2 Z`} fill="#6a0c16" opacity={0.8} /> : null}
        {new Array(12).fill(0).map((_, i) => {
          const y = -0.28 + i * 0.055, gen = Math.sin(((y + 0.34) / 0.74) * Math.PI) * (0.01 + 0.1 * ac);
          return <path key={i} d={`M ${i % 2 ? gen : -gen} ${y} l ${i % 2 ? -0.035 : 0.035} 0.012`} stroke="#f0e8d6" strokeWidth={0.009} strokeLinecap="round" />;
        })}
        {ac > 0.3 ? <path d={`M 0.01 0.38 q 0.01 ${0.12 * ac} -0.005 ${0.22 * ac}`} stroke="#c8d0d8" strokeWidth={0.006} fill="none" opacity={0.7} /> : null}
      </g>
      {/* lamba ışığından kenar parlaması */}
      <path d="M 0.24 -2.9 Q 0.25 -2.35 0.13 -1.86" stroke={KENAR} strokeWidth={0.012} opacity={0.6} fill="none" />
      <path d="M 0.36 -3.75 Q 0.44 -3.55 0.38 -3.25" stroke={KENAR} strokeWidth={0.012} opacity={0.5} fill="none" />
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
      {/* çıplak ön kol (kırmızı mini elbise; kol yok) */}
      <path d="M -96 440 L -66 116 Q 0 84 70 116 L 104 440 Z" fill={ten} stroke={O} strokeWidth={6} />
      <path d="M -40 300 Q -30 200 -40 140" stroke={tenK} strokeWidth={10} fill="none" opacity={0.6} />
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
  // Oturan kadının gözünden kendi bacağı (kamera ~20° aşağı): kalça altta geniş, uyluk dolgun, diz kapağı belirgin, baldır incelir;
  // bacaklar korkuyla hafif açık (ayaklar dizlerden dışarıda). Uçta iri beyaz spor ayakkabı (taban kenarı ve burnu görünür).
  const b = Math.min(0.6, buk);
  const ten = "#efc6a4", tenK = "#c99878", isik = "#ffe0c6";
  const X = (v: number) => s * v;
  const hy = 2150, ky = 1600 - 250 * b, ay = 1235 + 170 * b;
  const kx = 205 + 10 * b, ax = 250 - 35 * b;
  const d = `M ${X(560)} ${hy} C ${X(520)} 1950 ${X(kx + 140)} ${ky + 180} ${X(kx + 105)} ${ky + 20}
    C ${X(kx + 98)} ${ky - 25} ${X(kx + 88)} ${ky - 50} ${X(kx + 70)} ${ky - 80}
    C ${X(ax + 64)} ${(ky + ay) / 2} ${X(ax + 50)} ${ay + 60} ${X(ax + 46)} ${ay + 12}
    L ${X(ax - 44)} ${ay + 12}
    C ${X(ax - 48)} ${ay + 80} ${X(kx - 64)} ${(ky + ay) / 2 + 60} ${X(kx - 80)} ${ky - 50}
    C ${X(kx - 98)} ${ky - 10} ${X(kx - 106)} ${ky + 30} ${X(kx - 104)} ${ky + 80}
    C ${X(kx - 112)} ${ky + 260} ${X(40)} 1980 ${X(-20)} ${hy} Z`;
  return (
    <g>
      <path d={d} fill={ten} stroke={O} strokeWidth={7} strokeLinejoin="round" />
      <path d={`M ${X(40)} ${hy - 60} C ${X(kx - 92)} ${ky + 240} ${X(kx - 92)} ${ky + 110} ${X(kx - 94)} ${ky + 50}`} stroke={tenK} strokeWidth={30} fill="none" opacity={0.3} strokeLinecap="round" />
      {/* diz kapağı: yarım ay gölge + parlama */}
      <path d={`M ${X(kx - 52)} ${ky - 6} Q ${X(kx)} ${ky + 40} ${X(kx + 52)} ${ky - 6}`} stroke={tenK} strokeWidth={6} fill="none" />
      <ellipse cx={X(kx + 6)} cy={ky - 22} rx={38} ry={20} fill={isik} opacity={0.45} />
      <path d={`M ${X(400)} ${hy - 80} C ${X(kx + 150)} ${ky + 250} ${X(kx + 104)} ${ky + 90} ${X(kx + 76)} ${ky - 30}`} stroke={isik} strokeWidth={22} fill="none" opacity={0.28} strokeLinecap="round" />
      {/* beyaz spor ayakkabı (kendi ayağı, arkadan-üstten): dil ve bağcık bileğe yakın, burun ileride; korkuyla dışa açık */}
      <path d={`M ${X(ax - 50)} ${ay + 40} Q ${X(ax)} ${ay + 58} ${X(ax + 52)} ${ay + 40} L ${X(ax + 48)} ${ay - 6} Q ${X(ax)} ${ay + 8} ${X(ax - 46)} ${ay - 6} Z`} fill="#f2f2f0" stroke={O} strokeWidth={5} />
      {[0, 1, 2].map((i) => <path key={`c${i}`} d={`M ${X(ax - 30 + i * 30)} ${ay - 2} L ${X(ax - 30 + i * 30)} ${ay + 44}`} stroke="#c8c8ce" strokeWidth={4} />)}
      <g transform={`translate(${X(ax)} ${ay + 8}) rotate(${s * 22})`}>
        <path d="M -62 26 Q -70 -60 -54 -150 Q -32 -206 0 -210 Q 32 -206 54 -150 Q 70 -60 62 26 Q 0 46 -62 26 Z" fill="#f6f6f4" stroke={O} strokeWidth={6} />
        <path d="M -62 20 Q -72 -60 -56 -150 M 62 20 Q 72 -60 56 -150" stroke="#5a5a62" strokeWidth={10} fill="none" />
        <path d="M -48 -160 Q 0 -214 48 -160 Q 0 -180 -48 -160 Z" fill="#e2e2e8" stroke={O} strokeWidth={4} />
        <path d="M -34 14 Q 0 -4 34 14 L 30 -44 Q 0 -60 -30 -44 Z" fill="#ececf0" stroke={O} strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M -30 ${-62 - i * 20} L 30 ${-62 - i * 20}`} stroke="#8a8a92" strokeWidth={6} strokeLinecap="round" />)}
        <path d="M -60 -20 Q -66 -90 -40 -130" stroke="#c4162a" strokeWidth={9} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};
const Etek: React.FC<{ sal: number }> = ({ sal }) => (
  // kırmızı mini etek (kendi gözünden): uylukların üst kısmını örten geniş bant; kenarı hafif dalgalı, kıvrımlı
  <g>
    <path d={`M -80 1920 L -80 ${1690 + sal} Q 160 ${1640 - sal} 330 ${1668 + sal} Q 540 ${1700 - sal} 750 ${1668 + sal} Q 920 ${1640 - sal} 1160 ${1690 + sal} L 1160 1920 Z`} fill="#c4162a" stroke={O} strokeWidth={8} />
    <path d={`M -80 ${1700 + sal} Q 160 ${1652 - sal} 330 ${1680 + sal} Q 540 ${1712 - sal} 750 ${1680 + sal} Q 920 ${1652 - sal} 1160 ${1700 + sal}`} stroke="#ff5a66" strokeWidth={6} fill="none" opacity={0.5} />
    <path d="M 150 1680 q 40 90 10 240 M 330 1690 q 30 100 0 230 M 540 1715 q 0 100 -10 205 M 750 1690 q -30 100 0 230 M 930 1680 q -40 90 -10 240" stroke="#7a0a18" strokeWidth={8} fill="none" opacity={0.6} />
  </g>
);

/* ------------------------------------------------------------------ saç: baş hızla dönerken kadrajı süpüren tutamlar (v: -1..1 geçiş) */
const Sac: React.FC<{ v: number }> = ({ v }) => {
  if (Math.abs(v) > 1.3) return null;
  const op = Math.max(0, 1 - Math.abs(v) * 0.85);
  return (
    <g style={{ filter: "blur(3px)" }} opacity={0.75 * op}>
      {new Array(9).fill(0).map((_, i) => {
        const x = 540 + v * 760 + (i - 4) * 34 + 22 * Math.sin(i * 2.1);
        const egri = 120 * Math.sin(i * 1.3 + v * 3);
        return <path key={i} d={`M ${x - 40} -100 C ${x + egri} 400 ${x - egri} 1000 ${x + 30} ${1500 + 300 * Math.sin(i)}`} stroke={i % 3 ? "#2a1a14" : "#4a3222"} strokeWidth={8 + (i % 4) * 7} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ B8 (yeni) P4: DEPO (Ece'nin gözünden)
 * Tezgâhın arkasındaki dar koridor (x -0.9..0.9, z 0..6); sol duvarda depo kapısı (z 3.0..3.9, açık).
 * Depo odası (x -5.5..-0.9, z 1..6): metal raflar, koliler, eski radyo, sallanan çıplak ampul.
 * Yaratık depo ortasında, SIRTI kapıya dönük, dizlerine abanmış twerk atıyor (twerk 0..1 şiddet). */
const SahneDepo: React.FC<{ c: Cam; t: number; f: number; twerk: number; radyo: number; y: Prm }> = ({ c, t, f, twerk, radyo, y }) => {
  const el: React.ReactNode[] = [];
  const q = (pts: V3[], renk: string, key: string, op = 1) => {
    const p = poly(c, pts);
    if (p) el.push(<path key={key} d={p.d} fill={renk} opacity={op} />);
  };
  // depo odası (önce: kapı boşluğundan görünür)
  const bx0 = -5.5, bx1 = -0.9, bz0 = 1.0, bz1 = 6.0, bh = 3.2;
  q([[bx0, 0, bz0], [bx1, 0, bz0], [bx1, 0, bz1], [bx0, 0, bz1]], "#4a3e32", "df");
  q([[bx0, 0, bz0], [bx0, 0, bz1], [bx0, bh, bz1], [bx0, bh, bz0]], "#5a4c3c", "dw1");
  q([[bx0, 0, bz0], [bx1, 0, bz0], [bx1, bh, bz0], [bx0, bh, bz0]], "#54473a", "dw2");
  q([[bx0, 0, bz1], [bx1, 0, bz1], [bx1, bh, bz1], [bx0, bh, bz1]], "#54473a", "dw3");
  q([[bx0, bh, bz0], [bx1, bh, bz0], [bx1, bh, bz1], [bx0, bh, bz1]], "#2e2620", "dc");
  // arka duvarda metal raflar + koliler
  for (let k = 0; k < 4; k++) {
    const y = 0.35 + k * 0.62;
    q([[bx0 + 0.02, y, 1.4], [bx0 + 0.02, y, 5.6], [bx0 + 0.5, y, 5.6], [bx0 + 0.5, y, 1.4]], "#7a7e84", `rf${k}`);
    for (let i = 0; i < 7; i++) {
      const z0 = 1.5 + i * 0.58, w = 0.42 + 0.1 * random(`kw${k}${i}`), h = 0.3 + 0.2 * random(`kh${k}${i}`);
      if (random(`kv${k}${i}`) > 0.2) q([[bx0 + 0.05, y, z0], [bx0 + 0.05, y, z0 + w], [bx0 + 0.05, y + h, z0 + w], [bx0 + 0.05, y + h, z0]], ["#b8895a", "#a87a4c", "#c89a6a"][i % 3], `kl${k}${i}`);
    }
  }
  // eski radyo (raf 2'de), ritimle titreyen ışığı
  q([[bx0 + 0.06, 1.6, 2.2], [bx0 + 0.06, 1.6, 2.75], [bx0 + 0.06, 1.95, 2.75], [bx0 + 0.06, 1.95, 2.2]], "#3a2a22", "rd");
  q([[bx0 + 0.07, 1.66, 2.25], [bx0 + 0.07, 1.66, 2.45], [bx0 + 0.07, 1.89, 2.45], [bx0 + 0.07, 1.89, 2.25]], "#1a1412", "rdh");
  q([[bx0 + 0.07, 1.8, 2.52], [bx0 + 0.07, 1.8, 2.7], [bx0 + 0.07, 1.88, 2.7], [bx0 + 0.07, 1.88, 2.52]], radyo > 0.5 && (f % 8) < 4 ? "#ffd060" : "#6a5030", "rdi");
  // koridor (sonra: depoyu kapı boşluğu dışında örter)
  const kx0 = -0.9, kx1 = 0.9, kh = 2.6;
  q([[kx0, 0, -1], [kx1, 0, -1], [kx1, 0, 7], [kx0, 0, 7]], "#5e5e5a", "kf");
  for (let z = -1; z < 7; z += 0.6) q([[kx0, 0.002, z], [kx1, 0.002, z], [kx1, 0.002, z + 0.02], [kx0, 0.002, z + 0.02]], "#4a4a46", `kfz${z}`);
  q([[kx0, kh, -1], [kx1, kh, -1], [kx1, kh, 7], [kx0, kh, 7]], "#6e726e", "kc");
  q([[-0.2, kh - 0.01, 0.5], [0.2, kh - 0.01, 0.5], [0.2, kh - 0.01, 2.5], [-0.2, kh - 0.01, 2.5]], "#c8d0c8", "kl");
  q([[kx1, 0, -1], [kx1, 0, 7], [kx1, kh, 7], [kx1, kh, -1]], "#6a6e6a", "kw");
  q([[kx0, 0, 7], [kx1, 0, 7], [kx1, kh, 7], [kx0, kh, 7]], "#5a5e5a", "kend");
  q([[kx0, 0, -1], [kx0, 0, 3.0], [kx0, kh, 3.0], [kx0, kh, -1]], "#727672", "kl1");
  q([[kx0, 0, 3.9], [kx0, 0, 7], [kx0, kh, 7], [kx0, kh, 3.9]], "#727672", "kl2");
  q([[kx0, 2.1, 3.0], [kx0, 2.1, 3.9], [kx0, kh, 3.9], [kx0, kh, 3.0]], "#727672", "kl3");
  // kapı kasası + içeri açılmış kanat (menteşe z 3.9 tarafında)
  q([[kx0 + 0.005, 0, 2.94], [kx0 + 0.005, 0, 3.0], [kx0 + 0.005, 2.16, 3.0], [kx0 + 0.005, 2.16, 2.94]], "#5a6066", "kk1");
  q([[kx0 + 0.005, 0, 3.9], [kx0 + 0.005, 0, 3.96], [kx0 + 0.005, 2.16, 3.96], [kx0 + 0.005, 2.16, 3.9]], "#5a6066", "kk2");
  q([[kx0 + 0.005, 2.1, 2.94], [kx0 + 0.005, 2.1, 3.96], [kx0 + 0.005, 2.16, 3.96], [kx0 + 0.005, 2.16, 2.94]], "#5a6066", "kk3");
  q([[kx0, 0, 3.9], [kx0 - 0.85, 0, 3.6], [kx0 - 0.85, 2.1, 3.6], [kx0, 2.1, 3.9]], "#4a5056", "kanat");
  // sallanan ampul + ışık konisi (depo)
  const sal = 0.18 * Math.sin(t * 2.2);
  const amp = toCam(c, [-3.2 + sal, 2.55, 3.45]);
  const isik: React.ReactNode[] = [];
  if (amp[2] > NEAR) {
    const [ax, ay] = proj(amp);
    const r = F / amp[2];
    const ust = toCam(c, [-3.2, bh, 3.45]);
    if (ust[2] > NEAR) { const [ux, uy] = proj(ust); isik.push(<path key="tel" d={`M ${ux} ${uy} L ${ax} ${ay}`} stroke="#1a1410" strokeWidth={Math.max(1, r * 0.01)} />); }
    isik.push(<circle key="ah" cx={ax} cy={ay} r={r * 1.4} fill="url(#fpsHale)" opacity={0.85} />);
    isik.push(<circle key="ab" cx={ax} cy={ay} r={Math.max(2, r * 0.06)} fill="#fff4c8" />);
    const zemin = toCam(c, [-3.2 + sal * 1.5, 0, 3.45]);
    if (zemin[2] > NEAR) { const [zx, zy] = proj(zemin); isik.push(<ellipse key="az" cx={zx} cy={zy} rx={(F * 1.6) / zemin[2]} ry={(F * 0.5) / zemin[2]} fill="url(#fpsHavuz)" opacity={0.9} />); }
  }
  // yaratık: depo ortasında, sırtı kapıya (+x yönüne) dönük
  let ya: React.ReactNode = null;
  const [yx, yz, yph] = kf(y.yer, t, [-3.3, 3.15, 0]);
  const yc = toCam(c, [yx, 0, yz]);
  if (yc[2] > 0.3) {
    const [x, yy] = proj(yc);
    const s = F / yc[2];
    const on = kf1(y.on, t, 0) > 0.5;
    const boy = kf1(y.boy, t, 1);   // koşarken kapıdan geçmek için eğilip çömelir (dikey basılır)
    ya = <g transform={`translate(${x} ${yy}) scale(${s} ${s * (on ? boy : 1)})`}>{on
      ? <Yaratik ph={yph} t={t} agiz={kf1(y.agiz, t, 0)} egik={0} seg={kf1(y.seg, t, 0)} />
      : <YaratikTwerk t={t} v={twerk} g={kf1(y.bak, t, 0)} d={kf1(y.dogrul, t, 0)} o={kf1(y.oksur, t, 0)} />}</g>;
  }
  const ki = el.findIndex((e) => (e as React.ReactElement).key === "kf");
  const depo = el.slice(0, ki), kor = el.slice(ki).filter((e) => (e as React.ReactElement).key !== "kanat"), kanat = el.filter((e) => (e as React.ReactElement).key === "kanat");
  // depo öğelerini kapı boşluğuna kırp: depo yalnız kapıdan görünür (koridor çokgenleri zaten üstte; ışık ve yaratık da kırpılır)
  const bosluk = poly(c, [[kx0, 0, 3.0], [kx0, 0, 3.9], [kx0, 2.1, 3.9], [kx0, 2.1, 3.0]]);
  return (
    <g>
      <rect x={-400} y={-600} width={W + 800} height={H + 1200} fill="#1a1612" />
      {kor}
      {bosluk ? (
        <>
          <defs><clipPath id="depoBosluk"><path d={bosluk.d} /></clipPath></defs>
          <g clipPath="url(#depoBosluk)">
            {depo}
            <g style={{ mixBlendMode: "screen" }}>{isik}</g>
            {ya}
            {kanat}
          </g>
        </>
      ) : null}
    </g>
  );
};

/* yaratık ARKADAN: dizler bükük, gövde öne eğik, eller dizlerde; kalça (kemikli leğen) ritimle sallanır */
const YaratikTwerk: React.FC<{ t: number; v: number; g?: number; d?: number; o?: number }> = ({ t, v, g = 0, d = 0, o = 0 }) => {
  // ARKADAN görünüş (sırt bize): iri kürek kemikleri, dikenli omurga, kafatasının arkası.
  // v: twerk şiddeti · g: başını yana çevirip bakar (profil) · d: doğrulur (çömelmeden dik duruşa) · o: elini ağzına götürüp öksürür
  const DERI = "#24232a", DERI2 = "#3a3842", KEMIK = "#d9d2c0";
  const L = (a: number, b: number, u: number) => a + (b - a) * u;
  const w = Math.PI * 2 * 2.6;
  const yay = Math.abs(Math.sin(t * w / 2)) * v;
  const oks = o > 0.5 ? Math.max(0, Math.sin(t * 22)) * 0.04 : 0;                 // öksürük sarsıntısı
  const kY = L(-0.95, -1.78, d) - 0.08 * yay;
  const govB = L(0.78, 1.12, d);                                                  // gövde boyu (öne eğikken kısa görünür)
  const yan = (s: number) => -0.13 * v * Math.max(0, Math.sin(t * w + (s > 0 ? 0 : Math.PI)));
  const sal = 0.04 * v * Math.sin(t * w);
  const dizX = L(0.62, 0.2, d), dizY = L(-0.62, -0.9, d), ayX = L(0.5, 0.16, d);
  const omY = kY - govB + 0.1 - oks;
  return (
    <g>
      <ellipse cx={0} cy={0} rx={L(0.85, 0.6, d)} ry={0.1} fill="#000" opacity={0.5} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <path d={`M ${s * 0.14} ${kY + 0.05} L ${s * dizX} ${dizY} L ${s * ayX} -0.04 l ${s * 0.14} 0`} stroke={DERI} strokeWidth={0.08} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={s * dizX} cy={dizY} r={0.055} fill={DERI2} />
        </g>
      ))}
      <g transform={`translate(${sal} ${-0.05 * yay})`}>
        {/* sırt */}
        <path d={`M -0.24 ${kY - 0.02} Q -0.34 ${kY - govB * 0.5} -0.3 ${omY} Q 0 ${omY - 0.12} 0.3 ${omY} Q 0.34 ${kY - govB * 0.5} 0.24 ${kY - 0.02} Z`} fill={DERI} stroke="#0a090c" strokeWidth={0.025} />
        {/* kürek kemikleri */}
        {[-1, 1].map((s) => <path key={s} d={`M ${s * 0.06} ${omY + 0.08} Q ${s * 0.26} ${omY + 0.02} ${s * 0.24} ${omY + 0.3} Q ${s * 0.14} ${omY + 0.36} ${s * 0.06} ${omY + 0.24} Z`} fill={DERI2} stroke="#0a090c" strokeWidth={0.015} />)}
        {/* dikenli omurga */}
        {new Array(8).fill(0).map((_, i) => {
          const y = kY - 0.08 - (i * (govB - 0.12)) / 8;
          return <path key={i} d={`M -0.03 ${y} L 0 ${y - 0.07} L 0.03 ${y} Z`} fill={KEMIK} stroke="#2a2420" strokeWidth={0.008} />;
        })}
        {/* kollar: twerkte eller dizlerde; doğrulunca sarkar; öksürürken sağ eli ağzına (dirsek yana kalkar) */}
        {[-1, 1].map((s) => {
          const okol = s > 0 ? o : 0;
          const dirX = L(L(s * 0.56, s * 0.36, d), 0.42, okol), dirY = L(L(kY - 0.3, omY + 0.55, d), omY + 0.12, okol);
          const elX = L(L(s * 0.6, s * 0.3, d), 0.12, okol), elY = L(L(-0.68, kY + 0.35, d), omY - 0.18, okol);
          return <path key={s} d={`M ${s * 0.28} ${omY + 0.04} L ${dirX} ${dirY} L ${elX} ${elY}`} stroke={DERI} strokeWidth={0.055} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
        })}
        {/* kafa: arkadan kafatası; g ile yana döner (profil: göz çukuru + yarık ağız kenarı görünür) */}
        <g transform={`translate(${2 * sal + 0.06 * g} ${omY - L(0.08, 0.2, d) + 0.05 * yay - oks}) rotate(${-120 * sal + 8 * g})`}>
          <ellipse cx={0} cy={0} rx={L(0.17, 0.14, g)} ry={0.21} fill={KEMIK} stroke="#2a2420" strokeWidth={0.02} />
          <path d="M 0 -0.19 L 0 0.17" stroke="#6a5a4a" strokeWidth={0.012} fill="none" opacity={1 - g} />
          {g > 0.25 ? (
            <g opacity={Math.min(1, (g - 0.25) * 2.5)}>
              <ellipse cx={0.09} cy={-0.06} rx={0.04} ry={0.055} fill="#050405" />
              <circle cx={0.1} cy={-0.06} r={0.008} fill="#ffefe0" />
              <path d="M 0.13 0.0 Q 0.15 0.08 0.12 0.18" stroke="#24060a" strokeWidth={0.025} fill="none" />
            </g>
          ) : null}
        </g>
      </g>
      {/* kemikli kalça (twerk) */}
      {[-1, 1].map((s) => <ellipse key={s} cx={s * L(0.15, 0.1, d) + sal} cy={kY + 0.06 + yan(s)} rx={L(0.17, 0.11, d)} ry={L(0.15, 0.09, d)} fill={DERI2} stroke="#0a090c" strokeWidth={0.02} />)}
      {v > 0.3 ? [-1, 1].map((s) => <path key={s} d={`M ${s * 0.38} ${kY - 0.02} q ${s * 0.09} 0.05 ${s * 0.05} 0.15 M ${s * 0.43} ${kY - 0.1} q ${s * 0.11} 0.06 ${s * 0.06} 0.2`} stroke="#e8e0c8" strokeWidth={0.016} fill="none" opacity={0.75 * yay} />) : null}
    </g>
  );
};

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
  F = 980 * kf1(p.fov, t, 1);
  const faz = 2 * Math.PI * hz * t;
  // koşu: her ayak basışında sert iniş (|sin| tabanı keskin), yanal salınım, omuz yalpası; basış anında kısa sarsıntı
  const adimU = (faz / Math.PI) % 1;                         // 0 = ayak yere değdi
  const darbe = kos * Math.exp(-adimU * 9);
  const bobY = kos * (0.085 * Math.abs(Math.sin(faz)) - 0.045) - 0.025 * darbe, bobX = kos * 0.07 * Math.sin(faz / 2 + 0.3), bobR = kos * 3.4 * Math.sin(faz / 2);
  const sars = kf1(p.sars, t, 0) + 0.35 * darbe;
  const tit = kf1(p.titreme, t, 0);
  const shX = sars * 30 * (random(`sx${f}`) - 0.5) + tit * 5 * Math.sin(t * 37), shY = sars * 30 * (random(`sy${f}`) - 0.5) + tit * 4 * Math.cos(t * 43);
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
          {p.mekan === "depo" ? <SahneDepo c={cam} t={t} f={f} twerk={kf1(p.twerk, t, 0)} radyo={kf1(p.radyo, t, 0)} y={p.depoYaratik ?? {}} /> : (
          <Sahne c={cam} t={t} f={f} yaratik={ya} yaratikGor={yaG} marketFlas={1} egik={kf1(p.yKafa, t, 0)} seg={kf1(p.ySeg, t, 0)} agiz={kf1(p.yAgiz, t, 0)} />)}
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
      <AbsoluteFill><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}><Sac v={kf1(p.sac, t, 9)} /></svg></AbsoluteFill>
      {/* kalp atışı: kenarlar nabızla kararır (korku) */}
      {kf1(p.kalp, t, 0) > 0.01 ? (() => { const k = kf1(p.kalp, t, 0), u = (t * 1.17) % 1, n = Math.exp(-u * 7) + 0.6 * Math.exp(-Math.max(0, u - 0.18) * 7) * (u > 0.18 ? 1 : 0);
        return <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 50% at 50% 46%, rgba(0,0,0,0) 30%, rgba(30,0,4,${(0.65 * k * n).toFixed(3)}) 100%)` }} />; })() : null}
      {/* renk: soğuk gece, kenar kararması, nefes buğusu titremesi, grenli */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 62% at 50% 48%, rgba(0,0,0,0) 45%, rgba(2,3,8,0.88) 100%)" }} />
      <AbsoluteFill style={{ background: `rgba(160,0,10,${(kf1(p.kirmizi, t, 0) * 0.25).toFixed(3)})`, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: kf1(p.karart, t, 0) }} />
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: kf1(p.flas, t, 0), mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ opacity: 0.08, backgroundImage: `radial-gradient(circle at ${(random(`gr${f}`) * 100).toFixed(1)}% ${(random(`gq${f}`) * 100).toFixed(1)}%, #fff 0.5px, transparent 1.2px)`, backgroundSize: "5px 5px" }} />
    </AbsoluteFill>
  );
};

export const Insert19: React.FC<{ kind: Insert19Kind; dur: number; text?: string[] }> = ({ text }) => <B8Fps text={text} />;
