/* =====================================================================================
 * 7/24 Bölüm 5: dev hamamböceği (özgün tasarım). Ayakta duran, önden (karın) görünüş.
 *
 *   Yerel koordinat: ayak tabanı y = 0, yukarı negatif; boy ≈ 1000 birim (pronotum tepesi ~ -1010).
 *   Anatomi (stilize): kafanın üstüne siper gibi eğilen pronotum kalkanı (gözler onun gölgesinde),
 *   böbrek biçimli bileşik gözler, kırbaç antenler, testere dişli mandibulalar ve aralarında ıslak gırtlak,
 *   seğiren palpler, kıllı ve dikenli bacaklar (ön çift saldırmaya kalkık, orta çift yana açık, arka çift
 *   ayakta), segmentli karın, serkuslar, arkada yağlı deri kanatlar. Kitin ıslak: üstten floresan parlaması.
 *
 *   Hareketler parametrik: açılma (bacaklar/kanatlar), mandibula, anten, baş eğimi/eğilme, zaman (seğirme).
 * ===================================================================================== */
import React from "react";
import { random } from "remotion";

export type V = [number, number];
export const K = {
  out: "#0e0604",
  k1: "#1c0b05",
  k2: "#3c1a0b",
  k3: "#663216",
  k4: "#a45e2a",
  kar1: "#3e1e0e",
  kar2: "#5e3218",
  kar3: "#84502a",
  kenar: "#a07034",
  goz: "#070304",
  parla: "#fff0d8",
  salya: "#e4dcb0",
  gir: "#3a0608",
  gir2: "#8a1a1e",
  lif: "#7a1e24",
  lif2: "#2a0a10",
  et: "#9a2e34",
};

const D2R = Math.PI / 180;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const sstep = (a: number, b: number, v: number) => {
  if (b <= a) return v > b ? 1 : 0;
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** sönümlü yay: 0 → 1, küçük taşmayla oturur */
export const yay = (u: number, zeta = 0.38, w = 11) => {
  if (u <= 0) return 0;
  return 1 - Math.exp(-zeta * w * u) * Math.cos(w * Math.sqrt(1 - zeta * zeta) * u);
};
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const pol = (p: V, ang: number, L: number): V => [p[0] + Math.cos(ang * D2R) * L, p[1] + Math.sin(ang * D2R) * L];

/** konik kapsül (yuvarlak uçlu, a'da w0 → b'de w1 yarı genişlik) */
export const kapsul = (a: V, b: V, w0: number, w1: number) => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  const f = (v: number) => v.toFixed(1);
  return `M ${f(a[0] + nx * w0)} ${f(a[1] + ny * w0)} L ${f(b[0] + nx * w1)} ${f(b[1] + ny * w1)} A ${w1} ${w1} 0 0 0 ${f(b[0] - nx * w1)} ${f(b[1] - ny * w1)} L ${f(a[0] - nx * w0)} ${f(a[1] - ny * w0)} A ${w0} ${w0} 0 0 0 ${f(a[0] + nx * w0)} ${f(a[1] + ny * w0)} Z`;
};
export const P = (a: V[]) => a.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

/** bir kenar boyunca kısa sert kıllar (setae) */
const killar = (a: V, b: V, w: number, n: number, yon: number, len: number, seed: string) => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L, nx = -uy * yon, ny = ux * yon;
  let d = "";
  for (let i = 0; i < n; i++) {
    const k = (i + 0.5) / n;
    const side = random(`${seed}s${i}`) > 0.35 ? 1 : -1;
    const px = a[0] + dx * k + nx * w * side, py = a[1] + dy * k + ny * w * side;
    const l = len * (0.6 + random(`${seed}l${i}`) * 0.6);
    d += `M ${px.toFixed(1)} ${py.toFixed(1)} l ${(nx * l * side + ux * l * 0.7).toFixed(1)} ${(ny * l * side + uy * l * 0.7).toFixed(1)} `;
  }
  return d;
};

/* ---------------------------------------------------------------- bacak */
/** Dikenli, kıllı böcek bacağı: femur → tibia → tarsus (5 boğum) + çift tırnak. Açılar mutlak (derece, 0 = sağ, 90 = aşağı). */
export const Bacak: React.FC<{ base: V; a1: number; L1: number; a2: number; L2: number; a3: number; L3: number; w?: number; yon?: number; parlak?: number; uid: string }> = ({ base, a1, L1, a2, L2, a3, L3, w = 1, yon = 1, parlak = 1, uid }) => {
  const knee = pol(base, a1, L1);
  const ank = pol(knee, a2, L2);
  const tip = pol(ank, a3, L3);
  const fem = kapsul(base, knee, 26 * w, 19 * w);
  const tib = kapsul(knee, ank, 16 * w, 9 * w);
  const dx = ank[0] - knee[0], dy = ank[1] - knee[1];
  const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L;
  const nx = -uy * yon, ny = ux * yon;
  // uzun, uca yatık dikenler (iki sıra)
  const dikenler = [0.12, 0.26, 0.4, 0.54, 0.66, 0.78, 0.9].map((k, i) => {
    const s = 1 - k * 0.4;
    const px = knee[0] + dx * k, py = knee[1] + dy * k;
    const w0 = (16 - 7 * k) * w;
    const side = i % 2 ? 1 : -1;
    const bx = px + nx * w0 * side, by = py + ny * w0 * side;
    const len = (40 + (i % 3) * 12) * s * w;
    return `M ${(bx - ux * 6 * w).toFixed(1)} ${(by - uy * 6 * w).toFixed(1)} L ${(bx + nx * len * side * 0.8 + ux * len * 0.7).toFixed(1)} ${(by + ny * len * side * 0.8 + uy * len * 0.7).toFixed(1)} L ${(bx + ux * 6 * w).toFixed(1)} ${(by + uy * 6 * w).toFixed(1)} Z`;
  });
  const fdx = knee[0] - base[0], fdy = knee[1] - base[1];
  const fL = Math.hypot(fdx, fdy) || 1;
  const fux = fdx / fL, fuy = fdy / fL;
  const fnx = -fuy * yon, fny = fux * yon;
  const fdiken = [0.4, 0.6, 0.8].map((k) => {
    const px = base[0] + fdx * k + fnx * 20 * w, py = base[1] + fdy * k + fny * 20 * w;
    return `M ${(px - fux * 7).toFixed(1)} ${(py - fuy * 7).toFixed(1)} L ${(px + fnx * 26 * w + fux * 16).toFixed(1)} ${(py + fny * 26 * w + fuy * 16).toFixed(1)} L ${(px + fux * 7).toFixed(1)} ${(py + fuy * 7).toFixed(1)} Z`;
  });
  const tars: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    const k0 = i / 5, k1 = (i + 0.9) / 5;
    const a: V = [ank[0] + (tip[0] - ank[0]) * k0, ank[1] + (tip[1] - ank[1]) * k0];
    const b: V = [ank[0] + (tip[0] - ank[0]) * k1, ank[1] + (tip[1] - ank[1]) * k1];
    tars.push(<path key={i} d={kapsul(a, b, (8 - i) * w, (6.5 - i) * w)} fill={i % 2 ? K.k3 : K.k2} stroke={K.out} strokeWidth={3} />);
  }
  const tAng = Math.atan2(tip[1] - ank[1], tip[0] - ank[0]) / D2R;
  const t1 = pol(tip, tAng + 40, 26 * w), t2 = pol(tip, tAng - 40, 26 * w);
  return (
    <g>
      {dikenler.map((d, i) => <path key={i} d={d} fill={K.k1} stroke={K.out} strokeWidth={2.5} strokeLinejoin="round" />)}
      {fdiken.map((d, i) => <path key={`f${i}`} d={d} fill={K.k1} stroke={K.out} strokeWidth={2.5} />)}
      <path d={killar(knee, ank, 13 * w, 16, yon, 14 * w, `${uid}t`)} stroke={K.out} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d={killar(base, knee, 22 * w, 12, yon, 12 * w, `${uid}f`)} stroke={K.out} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d={tib} fill={K.k2} stroke={K.out} strokeWidth={4.5} strokeLinejoin="round" />
      <path d={`M ${knee[0] - nx * 6} ${knee[1] - ny * 6} L ${ank[0] - nx * 3} ${ank[1] - ny * 3}`} stroke={K.k4} strokeWidth={3.5 * w} opacity={0.6 * parlak} strokeLinecap="round" />
      <path d={fem} fill={K.k2} stroke={K.out} strokeWidth={5} strokeLinejoin="round" />
      <path d={`M ${base[0] + fnx * -9} ${base[1] + fny * -9} L ${knee[0] + fnx * -7} ${knee[1] + fny * -7}`} stroke={K.k3} strokeWidth={10 * w} opacity={0.55} strokeLinecap="round" />
      <path d={`M ${lerp(base[0], knee[0], 0.15) + fnx * -12} ${lerp(base[1], knee[1], 0.15) + fny * -12} L ${lerp(base[0], knee[0], 0.7) + fnx * -10} ${lerp(base[1], knee[1], 0.7) + fny * -10}`} stroke={K.parla} strokeWidth={3.5 * w} opacity={0.7 * parlak} strokeLinecap="round" />
      <circle cx={knee[0]} cy={knee[1]} r={16 * w} fill={K.k1} stroke={K.out} strokeWidth={4} />
      <circle cx={knee[0] - 5} cy={knee[1] - 5} r={4 * w} fill={K.parla} opacity={0.6 * parlak} />
      {tars}
      <path d={`M ${tip[0]} ${tip[1]} Q ${t1[0]} ${t1[1]} ${pol(t1, tAng + 120, 14 * w)[0]} ${pol(t1, tAng + 120, 14 * w)[1]} M ${tip[0]} ${tip[1]} Q ${t2[0]} ${t2[1]} ${pol(t2, tAng - 120, 14 * w)[0]} ${pol(t2, tAng - 120, 14 * w)[1]}`} stroke={K.out} strokeWidth={5.5 * w} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* ---------------------------------------------------------------- anten */
/** Kırbaç anten: kökten uca boğum boğum; salınım boğumlar boyunca gecikir (dalga). */
export const Anten: React.FC<{ kok: V; a0: number; L: number; buk: number; t: number; faz?: number; w?: number; seg?: number; sal?: number }> = ({ kok, a0, L, buk, t, faz = 0, w = 1, seg = 30, sal = 1 }) => {
  const pts: V[] = [kok];
  let a = a0;
  const dL = L / seg;
  for (let i = 1; i <= seg; i++) {
    const k = i / seg;
    a += buk / seg + sal * (Math.sin(t * 2.3 - k * 3.2 + faz) * 2.4 + Math.sin(t * 5.1 - k * 5 + faz * 2) * 1.1) * (0.4 + k);
    pts.push(pol(pts[i - 1], a, dL));
  }
  return (
    <g strokeLinecap="round" fill="none">
      {pts.slice(1).map((p, i) => {
        const ww = (9 - 7.2 * (i / seg)) * w;
        return <path key={i} d={`M ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`} stroke={K.out} strokeWidth={ww + 3.5} />;
      })}
      {pts.slice(1).map((p, i) => {
        const ww = (9 - 7.2 * (i / seg)) * w;
        return <path key={`c${i}`} d={`M ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`} stroke={i % 2 ? K.k2 : K.k3} strokeWidth={ww} />;
      })}
    </g>
  );
};

/* ---------------------------------------------------------------- kafa */
export type KafaProps = {
  /** mandibula açıklığı 0..1 (açıkken arada ıslak gırtlak) */
  mand?: number;
  t: number;
  anten?: number;
  antenBuk?: number;
  antenSal?: number;
  parlak?: number;
  salya?: number;
  /** floresan ışığı 0..1 (yansımalar) */
  isik?: number;
  uid: string;
  antenYok?: boolean;
  /** pronotum siperinin gölgesi (gözler) 0..1 */
  siper?: number;
  /** gözlerde küçük insan yansıması (Ece: sarı kazak, at kuyruğu) */
  yansima?: number;
};

/** Hamamböceği kafası (önden). Yerel: kafa merkezi (0,0); genişlik ±104, tepe -150, mandibula uçları ~ +165. */
export const BocekKafa: React.FC<KafaProps> = ({ mand = 0, t, anten = 0, antenBuk = 40, antenSal = 1, parlak = 1, salya = 0, isik = 1, uid, antenYok, siper = 0, yansima = 0 }) => {
  const m = clamp01(mand);
  const sg = (s: number) => Math.sin(t * 13 + s) * 4 + Math.sin(t * 29 + s * 2) * 2.5 + (random(`palp${s}${Math.floor(t * 6)}`) - 0.5) * 7;
  const palp = (side: 1 | -1, kisa: boolean) => {
    const base: V = kisa ? [side * 20, 124] : [side * 52, 100];
    const angs = kisa ? [96 + side * -12, 100 + side * -8, 104] : [110 - side * 70, 94 - side * 36, 98 - side * 16, 104, 112 + side * 8];
    const lens = kisa ? [30, 26, 22] : [36, 32, 36, 32, 28];
    const pts: V[] = [base];
    angs.forEach((a, i) => pts.push(pol(pts[i], a + sg(side * (i + 1) + (kisa ? 7 : 0)) * (1 + i * 0.3), lens[i])));
    return (
      <g>
        {pts.slice(1).map((p, i) => <path key={i} d={kapsul(pts[i], p, (kisa ? 7 : 9) - i, (kisa ? 6 : 8) - i)} fill={i % 2 ? K.k3 : K.k2} stroke={K.out} strokeWidth={3} />)}
        {pts.slice(1).map((p, i) => <path key={`h${i}`} d={killar(pts[i], p, 7 - i, 3, side, 9, `${uid}p${side}${kisa}${i}`)} stroke={K.out} strokeWidth={1.4} fill="none" />)}
      </g>
    );
  };
  // mandibula: menteşe (±36, 90); kapalıyken uçlar ortada kesişir; açıldıkça dışa döner
  const mandib = (side: 1 | -1) => {
    const ang = side * (-16 - 46 * m);
    return (
      <g transform={`rotate(${ang} ${side * 36} 90)`}>
        <path d={`M ${side * 60} 84 Q ${side * 66} 134 ${side * 30} 166 Q ${side * 10} 178 ${-side * 6} 170 Q ${side * 10} 156 ${side * 18} 138 Q ${side * 24} 112 ${side * 18} 88 Z`} fill={K.k1} stroke={K.out} strokeWidth={4.5} strokeLinejoin="round" />
        <path d={`M ${side * 19} 100 l ${-side * 12} 6 l ${side * 9} 5 l ${-side * 13} 8 l ${side * 10} 5 l ${-side * 15} 9 l ${side * 11} 6 l ${-side * 16} 11 l ${side * 8} 6`} fill="#e0c098" stroke={K.out} strokeWidth={2} strokeLinejoin="round" />
        <path d={`M ${side * 54} 94 Q ${side * 56} 128 ${side * 34} 152`} stroke={K.parla} strokeWidth={4} fill="none" opacity={0.55 * parlak * isik} strokeLinecap="round" />
      </g>
    );
  };
  const g = `bk${uid}`;
  const goz = (side: 1 | -1) => {
    const d = `M ${side * 66} -136 C ${side * 104} -128 ${side * 114} -64 ${side * 104} -18 C ${side * 98} 8 ${side * 82} 14 ${side * 78} -4 C ${side * 74} -26 ${side * 86} -54 ${side * 82} -84 C ${side * 78} -106 ${side * 56} -130 ${side * 66} -136 Z`;
    const cid = `${g}g${side}`;
    const pet: React.ReactNode[] = [];
    for (let r = 0; r < 11; r++) for (let c = 0; c < 4; c++) {
      const x = side * (70 + c * 10 + (r % 2) * 5), y = -138 + r * 15;
      pet.push(<circle key={`${r}${c}`} cx={x} cy={y} r={5.2} fill="none" stroke="#2e1a26" strokeWidth={1.6} opacity={0.8} />);
    }
    return (
      <g>
        <clipPath id={cid}><path d={d} /></clipPath>
        <path d={d} fill={K.goz} />
        <g clipPath={`url(#${cid})`}>
          <ellipse cx={side * 92} cy={-64} rx={26} ry={76} fill={`url(#${g}gg)`} />
          {pet}
          <rect x={side * 86 - 6} y={-116} width={12} height={24} rx={4} fill={K.parla} opacity={0.9 * isik} transform={`rotate(${side * 16} ${side * 86} -104)`} />
          <circle cx={side * 98} cy={-56} r={4} fill={K.parla} opacity={0.75 * isik} />
          <circle cx={side * 88} cy={-24} r={2.6} fill={K.parla} opacity={0.55 * isik} />
          <circle cx={side * 100} cy={-88} r={2.2} fill={K.parla} opacity={0.6 * isik} />
          {yansima > 0 ? (
            <g opacity={yansima * 0.8} transform={`translate(${side * 92} -44) scale(${side * 0.7} 0.7)`}>
              <path d="M -9 18 Q -10 4 0 2 Q 10 4 9 18 Z" fill="#e0a040" />
              <circle cx={0} cy={-4} r={6} fill="#f0c8a8" />
              <path d="M -6 -8 Q 0 -13 6 -8 L 7 -3 Q 0 -9 -7 -3 Z M 5 -6 Q 12 -2 9 10" fill="#5a3a28" stroke="#5a3a28" strokeWidth={1.5} />
            </g>
          ) : null}
        </g>
        <path d={d} fill="none" stroke={K.out} strokeWidth={4.5} strokeLinejoin="round" />
      </g>
    );
  };
  const kapsulD = "M -104 -66 C -108 -132 -46 -156 0 -156 C 46 -156 108 -132 104 -66 C 102 -8 70 50 44 90 L -44 90 C -70 50 -102 -8 -104 -66 Z";
  const sal = clamp01(salya);
  const sh = clamp01(siper);
  return (
    <g>
      <defs>
        <radialGradient id={`${g}h`} cx="0.42" cy="0.24" r="0.85"><stop offset="0" stopColor={K.k3} /><stop offset="0.5" stopColor={K.k2} /><stop offset="1" stopColor={K.k1} /></radialGradient>
        <radialGradient id={`${g}gg`} cx="0.4" cy="0.3" r="0.7"><stop offset="0" stopColor="#3a1a2a" /><stop offset="0.6" stopColor="#1a0a12" /><stop offset="1" stopColor="#050203" /></radialGradient>
        <linearGradient id={`${g}c`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.k2} /><stop offset="1" stopColor={K.kar1} /></linearGradient>
        <radialGradient id={`${g}m`} cx="0.5" cy="0.35" r="0.7"><stop offset="0" stopColor={K.gir2} /><stop offset="0.55" stopColor={K.gir} /><stop offset="1" stopColor="#0a0102" /></radialGradient>
        <linearGradient id={`${g}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0.85} /><stop offset="1" stopColor="#000" stopOpacity={0} /></linearGradient>
      </defs>
      {palp(-1, false)}
      {palp(1, false)}
      {/* ıslak gırtlak: mandibulalar açıldıkça görünür */}
      {m > 0.05 ? (
        <g>
          <path d={`M ${-22 - 34 * m} 96 Q 0 ${100 + 10 * m} ${22 + 34 * m} 96 Q ${30 + 30 * m} ${130 + 50 * m} 0 ${150 + 62 * m} Q ${-30 - 30 * m} ${130 + 50 * m} ${-22 - 34 * m} 96 Z`} fill={`url(#${g}m)`} stroke={K.out} strokeWidth={4} />
          {/* iç dişçikler ve kıvrımlar */}
          {[-1, 1].map((s) => <path key={s} d={`M ${s * (14 + 26 * m)} 104 l ${-s * 8} 10 l ${s * 2} 6 l ${-s * 9} 9 l ${s * 3} 6 l ${-s * 8} 10`} stroke="#d8b890" strokeWidth={3} fill="none" strokeLinejoin="round" />)}
          <path d={`M -10 ${118 + 20 * m} Q 0 ${126 + 30 * m} 10 ${118 + 20 * m}`} stroke={K.gir2} strokeWidth={4} fill="none" />
          <ellipse cx={-8} cy={112 + 14 * m} rx={6} ry={3} fill={K.parla} opacity={0.5} />
        </g>
      ) : null}
      {palp(-1, true)}
      {palp(1, true)}
      {sal > 0 ? (
        <g opacity={sal}>
          {[[-20, 120, 22, 124, 28], [-30, 104, 28, 108, 40], [-12, 146, 14, 150, 20]].map(([x1, y1, x2, y2, sag], i) => (
            <path key={i} d={`M ${x1 - 26 * m} ${y1} Q ${(x1 + x2) / 2} ${y1 + sag * (0.6 + 1.4 * m) + Math.sin(t * 3 + i) * 5} ${x2 + 26 * m} ${y2}`} stroke={K.salya} strokeWidth={2.6} fill="none" opacity={0.8} />
          ))}
          {[-1, 1].map((s, i) => {
            const L = 26 + 22 * Math.abs(Math.sin(t * 1.1 + i * 1.7));
            return <path key={s} d={`M ${s * (10 + 18 * m)} ${160 + 10 * m} q ${-s * 4} ${L * 0.6} 0 ${L} q ${s * 6} -4 0 ${-L}`} fill={K.salya} opacity={0.75} />;
          })}
        </g>
      ) : null}
      {mandib(-1)}
      {mandib(1)}
      <path d={kapsulD} fill={`url(#${g}h)`} stroke={K.out} strokeWidth={5} strokeLinejoin="round" />
      {/* alın sırtları ve klipeus */}
      <path d="M -46 4 Q 0 -12 46 4 L 38 80 Q 0 90 -38 80 Z" fill={`url(#${g}c)`} stroke={K.out} strokeWidth={3} strokeLinejoin="round" opacity={0.9} />
      <path d="M 0 -120 L 0 82 M -24 -60 Q -30 -10 -24 50 M 24 -60 Q 30 -10 24 50" stroke={K.k1} strokeWidth={3} fill="none" opacity={0.55} />
      {/* kitin dokusu: çukurcuklar ve ince kıllar (yakın planda düz "maske" gibi durmasın) */}
      {new Array(22).fill(0).map((_, i) => {
        const x = (random(`cx${i}`) - 0.5) * 150, y = -130 + random(`cy${i}`) * 190;
        if (Math.abs(x) > 92 - Math.max(0, y) * 0.5) return null;
        const r = 2 + random(`cr${i}`) * 3;
        return <g key={`c${i}`}><ellipse cx={x} cy={y} rx={r} ry={r * 0.75} fill={K.k1} opacity={0.55} /><circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.35} fill={K.parla} opacity={0.35 * parlak} /></g>;
      })}
      <path d={killar([-96, -40], [-46, 86], 3, 9, -1, 9, `${uid}yk1`) + killar([96, -40], [46, 86], 3, 9, 1, 9, `${uid}yk2`)} stroke={K.out} strokeWidth={1.6} fill="none" />
      <path d="M -28 82 Q 0 104 28 82 Q 22 98 0 102 Q -22 98 -28 82 Z" fill={K.kar1} stroke={K.out} strokeWidth={3.5} />
      <path d={killar([-40, 84], [40, 84], 4, 14, 1, 10, `${uid}lb`)} stroke={K.out} strokeWidth={1.5} fill="none" />
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={s * 30} cy={-102} rx={10} ry={15} fill="#cfb488" opacity={0.6} stroke={K.out} strokeWidth={2} />
          <circle cx={s * 46} cy={-118} r={13} fill={K.k1} stroke={K.out} strokeWidth={3.5} />
          <circle cx={s * 46} cy={-118} r={6} fill={K.k3} />
        </g>
      ))}
      {goz(-1)}
      {goz(1)}
      <path d="M -62 -136 Q -20 -154 30 -146" stroke={K.parla} strokeWidth={7} fill="none" opacity={0.6 * parlak * isik} strokeLinecap="round" />
      <path d="M -44 -30 Q -36 16 -30 50" stroke={K.parla} strokeWidth={3.5} fill="none" opacity={0.35 * parlak * isik} strokeLinecap="round" />
      {/* siperin gölgesi: gözlerin üst yarısı karanlıkta */}
      {sh > 0 ? (
        <g>
          <clipPath id={`${g}kc`}><path d={kapsulD} /></clipPath>
          <path d="M -112 -160 L 112 -160 L 112 -40 Q 0 -70 -112 -40 Z" fill={`url(#${g}s)`} opacity={sh} clipPath={`url(#${g}kc)`} />
        </g>
      ) : null}
      {!antenYok && anten > 0 ? (
        <g>
          <Anten kok={[-46, -118]} a0={-112} L={anten} buk={-antenBuk} t={t} faz={0.6} sal={antenSal} />
          <Anten kok={[46, -118]} a0={-68} L={anten} buk={antenBuk} t={t} faz={2.1} sal={antenSal} />
        </g>
      ) : null}
    </g>
  );
};

/* ---------------------------------------------------------------- gövde */
export type BocekProps = {
  t: number;
  /** bacak/kanat açılması 0..1 (0: gövdeye katlı) */
  acil?: number;
  kanat?: number;
  mand?: number;
  /** baş eğimi (derece) ve öne eğilme (0..1: baş aşağı, kameraya doğru) */
  egim?: number;
  egil?: number;
  anten?: number;
  antenSal?: number;
  parlak?: number;
  salya?: number;
  isik?: number;
  /** insan kalıntıları (sarkan deri, hırka parçası) 0..1 */
  kalinti?: number;
  nefes?: number;
  uid: string;
  basYok?: boolean;
  /** ön bacakların saldırı uzanması 0..1 */
  saldir?: number;
  /** pronotum kalkanının arkadan açılması 0..1 (dönüşümde) */
  kalkan?: number;
};


type PrProps = { uid: string; egil?: number; kk?: number; parlak?: number; isik?: number };
const prT = (dy: number, kk: number) => `translate(0 ${dy}) translate(0 -760) scale(${lerp(0.3, 1, kk)}) translate(0 760)`;
/** Pronotum kalkanı (arkada, başlık gibi). Yerel: DevBocek koordinatı (baş merkezi y=-770). */
export const PronotumArka: React.FC<PrProps> = ({ uid, egil = 0, kk = 1, parlak = 1, isik = 1 }) => {
  const kT = (dy: number) => prT(dy, kk);
  return (
    <g>
      <defs><radialGradient id={`pr${uid}`} cx="0.42" cy="0.3" r="0.75"><stop offset="0" stopColor={K.k3} /><stop offset="0.55" stopColor={K.k2} /><stop offset="1" stopColor={K.k1} /></radialGradient></defs>
      {/* pronotum kalkanı: arkada geniş başlık */}
      <g transform={kT(60 * egil)} opacity={sstep(0, 0.35, kk)}>
        <path d="M -226 -810 C -230 -930 -130 -1012 0 -1012 C 130 -1012 230 -930 226 -810 C 222 -740 170 -704 120 -700 L -120 -700 C -170 -704 -222 -740 -226 -810 Z" fill={K.kenar} stroke={K.out} strokeWidth={5.5} />
        <path d="M -206 -812 C -208 -916 -122 -990 0 -990 C 122 -990 208 -916 206 -812 C 202 -752 160 -722 116 -718 L -116 -718 C -160 -722 -202 -752 -206 -812 Z" fill={`url(#pr${uid})`} />
        <path d="M -160 -880 Q -110 -968 -18 -944 Q -30 -860 -96 -790 Q -160 -800 -160 -880 Z" fill={K.k1} opacity={0.9} />
        <path d="M 160 -880 Q 110 -968 18 -944 Q 30 -860 96 -790 Q 160 -800 160 -880 Z" fill={K.k1} opacity={0.9} />
        <path d="M -176 -900 Q -70 -1000 96 -980" stroke={K.parla} strokeWidth={11} fill="none" opacity={0.55 * parlak * isik} strokeLinecap="round" />
      </g>
    </g>
  );
};
/** Pronotumun ön kenarı (siper): başın üstüne eğilir, gözler gölgede kalır. */
export const PronotumSiper: React.FC<PrProps> = ({ uid, egil = 0, kk = 1, parlak = 1, isik = 1 }) => {
  const kT = (dy: number) => prT(dy, kk);
  return (
    <g>
      {/* siper: pronotumun ön kenarı başın üstüne eğilir (gözler gölgede) */}
      <g transform={kT(60 * egil)} opacity={sstep(0.3, 0.8, kk)}>
        <path d={`M -150 -${958 - 40 * egil} Q 0 -${1020 - 30 * egil} 150 -${958 - 40 * egil} Q 120 -${900 - 70 * egil} 0 -${892 - 80 * egil} Q -120 -${900 - 70 * egil} -150 -${958 - 40 * egil} Z`} fill={`url(#pr${uid})`} stroke={K.out} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M -140 -${950 - 40 * egil} Q 0 -${1006 - 30 * egil} 140 -${950 - 40 * egil}`} stroke={K.kenar} strokeWidth={7} fill="none" />
        <path d={`M -100 -${970 - 40 * egil} Q -20 -${1000 - 30 * egil} 60 -${990 - 35 * egil}`} stroke={K.parla} strokeWidth={6} fill="none" opacity={0.5 * parlak * isik} strokeLinecap="round" />
      </g>
    </g>
  );
};

/** Ayakta dev hamamböceği. Yerel: ayaklar y=0, pronotum tepesi ~ -1010. */
export const DevBocek: React.FC<BocekProps> = ({ t, acil = 1, kanat = 0.4, mand = 0.2, egim = 0, egil = 0, anten = 700, antenSal = 1, parlak = 1, salya = 0.6, isik = 1, kalinti = 0, nefes = 1, uid, basYok, saldir = 0, kalkan = 1 }) => {
  const kk = clamp01(kalkan);
  const a = clamp01(acil);
  const br = 1 + 0.02 * Math.sin(t * 2.6) * nefes;
  const tw = (s: number) => Math.sin(t * 3.1 + s) * 2.2 + Math.sin(t * 7.3 + s * 1.7) * 1.2;
  const sd = clamp01(saldir);
  const legs = (side: 1 | -1) => {
    const S = (ang: number) => (side === 1 ? ang : 180 - ang);
    // ön çift: dirsek yukarıda, pençe aşağı-içe (pusuya yatmış yırtıcı); katlıyken gövdeye yapışık
    // asimetri: sağ ön bacak daha ileri/yukarıda, sol orta bacak daha aşağıda; arka bacaklarda yavaş ağırlık aktarımı
    const as = side === 1 ? 1 : -1;
    const agirlik = Math.sin(t * 1.3) * 3 * as;
    const on = { base: [side * 80, -700] as V, a1: S(lerp(98, -34 + 16 * sd - 8 * as, a) + tw(side)), a2: S(lerp(-82, 52 + 30 * sd + 6 * as, a) + tw(side + 1) * 1.5), a3: S(lerp(-70, 128 + 14 * sd, a) + tw(side + 2) * 3) };
    const orta = { base: [side * 104, -616] as V, a1: S(lerp(96, 16 - 7 * as, a) + tw(side + 3)), a2: S(lerp(-86, 84 + 5 * as, a) + tw(side + 4)), a3: S(lerp(-90, 112, a) + tw(side + 5) * 2) };
    const arka = { base: [side * 84, -470] as V, a1: S(50 + agirlik + tw(side + 6) * 0.3), a2: S(100 - agirlik * 0.6), a3: S(16) };
    return { on, orta, arka };
  };
  const R = legs(1), L = legs(-1);
  const kan = clamp01(kanat);
  const wing = (side: 1 | -1) => (
    <g transform={`rotate(${side * (4 + 30 * kan + Math.sin(t * 9) * 1.5 * kan)} ${side * 96} -730)`}>
      <path d={`M ${side * 80} -742 C ${side * 214} -716 ${side * 262} -470 ${side * 196} -260 Q ${side * 150} -150 ${side * 46} -150 C ${side * 120} -260 ${side * 112} -560 ${side * 80} -742 Z`} fill={`url(#db${uid}w)`} stroke={K.out} strokeWidth={4.5} strokeLinejoin="round" />
      {[0.2, 0.42, 0.64].map((k, i) => <path key={i} d={`M ${side * (90 + 20 * k)} -720 Q ${side * (170 + 50 * k)} -480 ${side * (150 + 20 * k)} ${-200 - i * 14}`} stroke={K.k1} strokeWidth={2.5} fill="none" opacity={0.7} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={`x${i}`} d={`M ${side * (130 + i * 8)} ${-600 + i * 66} l ${side * 30} ${-6}`} stroke={K.k1} strokeWidth={2} opacity={0.5} />)}
      <path d={`M ${side * 120} -690 C ${side * 196} -560 ${side * 214} -430 ${side * 186} -290`} stroke={K.parla} strokeWidth={7} fill="none" opacity={0.45 * parlak * isik} strokeLinecap="round" />
    </g>
  );
  const karin = new Array(8).fill(0).map((_, i) => {
    const y = -592 + i * 44 * br;
    const hw = 124 - i * 8.5 - (i > 5 ? (i - 5) * 10 : 0);
    return (
      <g key={i}>
        <path d={`M ${-hw} ${y} Q 0 ${y - 16} ${hw} ${y} Q ${hw + 6} ${y + 26} ${hw - 8} ${y + 46} Q 0 ${y + 58} ${-hw + 8} ${y + 46} Q ${-hw - 6} ${y + 26} ${-hw} ${y} Z`} fill={i % 2 ? K.kar1 : K.kar2} stroke={K.out} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M ${-hw + 20} ${y + 8} Q 0 ${y - 4} ${hw - 20} ${y + 8}`} stroke={K.kar3} strokeWidth={3} fill="none" opacity={0.45} />
        <path d={`M ${-hw * 0.7} ${y + 2} Q ${-hw * 0.5} ${y - 6} ${-hw * 0.2} ${y - 4}`} stroke={K.parla} strokeWidth={3} fill="none" opacity={0.4 * parlak * isik} strokeLinecap="round" />
      </g>
    );
  });
  const kalK = clamp01(kalinti);
  const headY = -770;
  return (
    <g>
      <defs>
        <linearGradient id={`db${uid}w`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5a2c10" /><stop offset="0.6" stopColor="#3e1c0a" /><stop offset="1" stopColor="#8a5428" stopOpacity={0.9} /></linearGradient>
        <radialGradient id={`db${uid}p`} cx="0.42" cy="0.3" r="0.75"><stop offset="0" stopColor={K.k3} /><stop offset="0.55" stopColor={K.k2} /><stop offset="1" stopColor={K.k1} /></radialGradient>
        <linearGradient id={`db${uid}t`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={K.kar1} /><stop offset="0.5" stopColor={K.kar3} /><stop offset="1" stopColor={K.kar1} /></linearGradient>
        <linearGradient id={`db${uid}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0.75} /><stop offset="1" stopColor="#000" stopOpacity={0} /></linearGradient>
      </defs>
      {wing(-1)}
      {wing(1)}
      <PronotumArka uid={uid} egil={egil} kk={kk} parlak={parlak} isik={isik} />
      <Bacak {...L.arka} L1={250} L2={300} L3={86} w={1.15} yon={-1} parlak={parlak} uid={`${uid}la`} />
      <Bacak {...R.arka} L1={250} L2={300} L3={86} w={1.15} yon={1} parlak={parlak} uid={`${uid}ra`} />
      {[-1, 1].map((s) => <path key={s} d={kapsul([s * 26, -250], [s * 64, -140], 12, 4)} fill={K.k2} stroke={K.out} strokeWidth={3.5} />)}
      {karin.slice().reverse()}
      <Bacak {...L.orta} L1={232} L2={268} L3={92} w={1} yon={-1} parlak={parlak} uid={`${uid}lo`} />
      <Bacak {...R.orta} L1={232} L2={268} L3={92} w={1} yon={1} parlak={parlak} uid={`${uid}ro`} />
      <path d="M -124 -720 Q 0 -746 124 -720 L 130 -604 Q 0 -582 -130 -604 Z" fill={`url(#db${uid}t)`} stroke={K.out} strokeWidth={5} strokeLinejoin="round" />
      <path d="M -114 -662 Q 0 -678 114 -662" stroke={K.out} strokeWidth={3.5} fill="none" />
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={s * 82} cy={-702} rx={34} ry={22} fill={K.k2} stroke={K.out} strokeWidth={4} />
          <ellipse cx={s * 104} cy={-620} rx={36} ry={24} fill={K.k2} stroke={K.out} strokeWidth={4} />
          <ellipse cx={s * 84} cy={-474} rx={40} ry={28} fill={K.k2} stroke={K.out} strokeWidth={4} />
        </g>
      ))}
      {/* ön bacaklar */}
      <Bacak {...L.on} L1={220} L2={210} L3={80} w={1} yon={-1} parlak={parlak} uid={`${uid}lf`} />
      <Bacak {...R.on} L1={220} L2={210} L3={80} w={1} yon={1} parlak={parlak} uid={`${uid}rf`} />
      {kalK > 0 ? (
        <g opacity={kalK}>
          {[R.on, L.on].map((lg, i) => {
            const k = pol(lg.base, lg.a1, 150);
            const sw = Math.sin(t * 2 + i) * 6;
            return (
              <g key={i}>
                <path d={`M ${k[0] - 14} ${k[1]} Q ${k[0] - 18 + sw} ${k[1] + 60} ${k[0] - 4 + sw * 1.4} ${k[1] + 110} L ${k[0] + 10 + sw} ${k[1] + 70} Q ${k[0] + 14} ${k[1] + 30} ${k[0] + 16} ${k[1]} Z`} fill="#b88660" stroke={K.out} strokeWidth={3.5} strokeLinejoin="round" />
                <path d={`M ${k[0] - 8} ${k[1] + 10} Q ${k[0] - 6 + sw} ${k[1] + 60} ${k[0] - 2 + sw * 1.3} ${k[1] + 96}`} stroke={K.et} strokeWidth={3} fill="none" opacity={0.7} />
                <path d={`M ${k[0] - 4 + sw * 1.4} ${k[1] + 110} q 4 18 -2 30`} stroke={K.lif} strokeWidth={4} fill="none" strokeLinecap="round" />
              </g>
            );
          })}
        </g>
      ) : null}
      {basYok ? null : (
        <g transform={`translate(0 ${headY + 110 * egil}) rotate(${egim} 0 0) scale(${1 + 0.14 * egil})`}>
          <BocekKafa mand={mand} t={t} anten={anten} antenSal={antenSal} parlak={parlak} salya={salya} isik={isik} uid={`${uid}k`} siper={0.55 - 0.3 * egil} />
        </g>
      )}
      <PronotumSiper uid={uid} egil={egil} kk={kk} parlak={parlak} isik={isik} />
    </g>
  );
};
