/* =====================================================================================
 * 7/24 Bölüm 6 · parça 1 ("Gün ağarıyor"): tam ekran çekimler (opt-in; yalnız 724-06 kullanır).
 *
 *  b6_kapi : kapı görünümü (B5 p2 ile aynı eksen: depo tarafından kapıya). Kepenk içeriden açılır, aralıktan
 *            gün ağarır; sıcak ışık zeminde büyür, değdiği yerde böcek seli ve Ece'nin üstündeki böcekler
 *            YAVAŞ YAVAŞ toza döner (gölgede kalanlar henüz dönmez). Ece yere çöker, hıçkıra hıçkıra ağlar.
 *            Sabah (gun=1) normale dönmüş market; Sabri kapıdan girer, çömelir, sarılır.
 *  b6_zemin: zemin hizası yakın plan: ışık sınırı kameraya ilerler, sınır boyunca böcekler toza döner.
 *  b6_dis  : dışarıdan: sokağın ucunda güneşin ucu, marketin kepengi kalkar.
 *
 *  ZAMAN: bütün anahtar kareler SAHNE zamanındadır (sn). Her vuruş `t0` (vuruşun sahnedeki başlangıcı) verir;
 *  böylece kesmeler arasında hangi böceğin ne zaman toza döndüğü tutarlı kalır (üç çekim de aynı ışık modelini kullanır).
 *
 *  IŞIK MODELİ (metre): kepenk açıklığı k → aralık yüksekliği h = 0,2 + 2,655·k. Güneşin eğimi tanA.
 *  Işık duvardan içeri D_far = h / tanA metre girer (zemindeki ışık alanı). Ece'nin gölgesi ışığın içinde kalır
 *  (boyu / tanA). Ece'nin gövdesinde ışık bandının üstü: h − D_ece·tanA.
 * ===================================================================================== */
import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character, hickirDurum } from "../rig/Character";
import type { ArmPose, Emotion } from "../rig/types";
import { Market724BG, Market724FG } from "../sets/market724";
import { sstep } from "./bocek";
import { Kepenk2, Mb, MiniDefs } from "./Inserts12";

export type Insert13Kind = "b6_kapi" | "b6_zemin" | "b6_dis";
export const INSERT13_KINDS: Insert13Kind[] = ["b6_kapi", "b6_zemin", "b6_dis"];

/* ------------------------------------------------------------------ yardımcılar */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Prm = Record<string, any>;
const prm = (text?: string[]): Prm => {
  try {
    return text?.[0] ? JSON.parse(text[0]) : {};
  } catch {
    return {};
  }
};
type KF = number[][];
const kf = (k: KF | undefined, t: number, def: number[]): number[] => {
  if (!k || !k.length) return def;
  if (t <= k[0][0]) return k[0].slice(1);
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i], b = k[i + 1];
    if (t < b[0]) {
      const u = sstep(a[0], b[0], t);
      return a.slice(1).map((v, j) => v + (b[j + 1] - v) * u);
    }
  }
  return k[k.length - 1].slice(1);
};
const kf1 = (k: KF | undefined, t: number, d: number) => kf(k, t, [d])[0];
const basamak = <T,>(k: [number, T][] | undefined, t: number, def: T): T => {
  let v = def;
  for (const [a, x] of k ?? []) if (t >= a) v = x;
  return v;
};
const araliktaMi = (r: number[][] | undefined, t: number) => (r ?? []).some(([a, b]) => t >= a && t < b);
const mixC = (a: number[], b: number[], k: number) => a.map((v, i) => v + (b[i] - v) * k);
const rgb = (c: number[]) => `rgb(${c.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255)).join(",")})`;
const camT = (cx: number, cy: number, z: number, sx = 0, sy = 0) => `translate(${540 + sx}px, ${960 + sy}px) scale(${z}) translate(${-cx}px, ${-cy}px)`;
const Siyah: React.FC<{ o: number }> = ({ o }) => (o > 0.001 ? <AbsoluteFill style={{ backgroundColor: "#000", opacity: Math.min(1, o) }} /> : null);
const poly = (pts: number[][]) => `M ${pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L ")} Z`;

/* ------------------------------------------------------------------ kapı görünümü geometrisi (B5 market724 ile aynı)
 * duvar (cam) zemin çizgisi y=1250, kaçış y=786, duvarda 290 px/m, kamera duvardan 7 m, göz 1,6 m. */
const VY = 786, F_ = 2030, D0 = 7, EH = 1.6;
const sD = (D: number) => F_ / (D0 - D);
const yD = (D: number) => VY + EH * sD(D);
const xX = (X: number, D: number) => 540 + X * sD(D);
const hOpen = (k: number) => 0.2 + (770 * k) / 290;
const KAYIT = [0, 300, 800, 1080].map((x) => (x - 540) / 290);
/** Ece ve Sabri'nin boy katsayısı (m başına rig birimi; B5 p2 ile aynı oran) */
const ECE_C = 1.616, SABRI_C = 1.88;

/* ------------------------------------------------------------------ ışık durumu */
type Delik = { x: number; y: number; X: number; D: number; panel: number };
type Durum = { t: number; k: number; tan: number; sun: number; ex: number; ed: number; eh: number; ehw: number; yan: number; ece: boolean; oy: number; delik: Delik[] };
/** B5 p2'de kepengi göçerten vuruşlar (kapı görünümü, dünya koordinatı): göçükler kalıcı; bazıları delinmiş */
export const B5_GOCUK: number[][] = [[300, 700], [760, 900], [500, 520], [160, 1000], [880, 640], [420, 1080], [640, 760], [220, 560], [960, 1050], [560, 980], [340, 880], [560, 820]];
const DELIKLI = [0, 1, 5, 6, 8, 9, 10];
const PANEL: [number, number][] = [[-40, 300], [300, 800], [800, 1120]];
const panelK = (p: Prm, k: number, i: number) => {
  const ac = p.acGecik ?? [0.0, 0.06, 0.03];
  return Math.max(0, Math.min(1, (k - ac[i]) / Math.max(0.2, 1 - ac[i])));
};
const durum = (p: Prm, tg: number): Durum => {
  const oy = kf1(p.eceOtur, tg, 0);
  const [ex, ed] = kf(p.eceYer, tg, [0.25, 3.3]);
  const k = kf1(p.ac, tg, 0), tan = kf1(p.tanA, tg, 0.38), sun = kf1(p.gunes, tg, 1), yan = p.yan ?? 0.1;
  const delik: Delik[] = [];
  if (p.delik !== false && sun > 0.04) {
    for (const i of DELIKLI) {
      const [gx, gy0] = (p.gocuk ?? B5_GOCUK)[i] ?? [0, 0];
      const panel = PANEL.findIndex(([a, b]) => gx >= a && gx < b);
      const y = gy0 - 770 * panelK(p, k, panel);
      if (y < 430) continue;
      const h = (1250 - y) / 290;
      const D = h / tan;
      const X = (gx - 540) / 290 + yan * D;
      delik.push({ x: gx, y, X, D, panel });
    }
  }
  return { t: tg, k, tan, sun, ex, ed, eh: 1.5 - 0.64 * oy, ehw: 0.2 + 0.16 * oy, yan, ece: p.ece !== false, oy, delik };
};
const dFar = (s: Durum) => (s.sun > 0.04 && s.k > 0.002 ? hOpen(s.k) / s.tan : -1);
const golgede = (X: number, D: number, s: Durum) => {
  if (!s.ece) return false;
  const L = s.eh / s.tan;
  if (D <= s.ed - 0.05 || D > s.ed + L) return false;
  const q = Math.max(0, (D - s.ed) / L);
  return Math.abs(X - s.yan * (D - s.ed) - s.ex) < s.ehw * (1 - 0.45 * q);
};
const DELIK_R = 0.075;
const delikte = (X: number, D: number, s: Durum) => s.delik.some((d) => Math.hypot(X - d.X, (D - d.D) * 0.8) < DELIK_R);
const zemindeIsik = (X: number, D: number, s: Durum) => ((D <= dFar(s) || delikte(X, D, s)) && !golgede(X, D, s));
/** Ece'nin gövdesinde ışık bandının üstü (m, zeminden); ışık ona ulaşmadıysa -1 */
const eceIsikUst = (s: Durum) => (dFar(s) >= s.ed ? hOpen(s.k) - s.ed * s.tan : -1);
const durumlar = (p: Prm, fps: number, tg: number): Durum[] => {
  const n = Math.max(0, Math.floor(tg * fps + 1e-6));
  const out: Durum[] = [];
  for (let i = 0; i <= n; i++) out.push(durum(p, i / fps));
  return out;
};
/** ilk ışık alma anı (sahne sn); hiç almadıysa Infinity */
const ilk = (arr: Durum[], test: (s: Durum) => boolean): number => {
  for (const s of arr) if (test(s)) return s.t;
  return Infinity;
};

/* ------------------------------------------------------------------ toz parçacıkları
 * Dönüşen her öğe, çözülürken parçacık saçar: sıcak ışıkta parlayan altın zerreler (screen katmanı) ve
 * gri-kahve kül (normal katman). Parçacıklar ışığın içinde yükselir, hafif sürüklenir, söner. */
type Zerre = { x: number; y: number; r: number; o: number; parlak: boolean };
const tozSac = (key: string, x: number, y: number, sc: number, tl: number, tg: number, n: number, yay: number, out: Zerre[], sure = 1.6) => {
  if (!isFinite(tl)) return;
  const d0 = tg - tl;
  if (d0 < 0) return;
  for (let i = 0; i < n; i++) {
    const dog = 0.12 + (i / n) * sure * 0.7 + random(`${key}b${i}`) * 0.15;
    const omur = 1.4 + random(`${key}o${i}`) * 1.3;
    const a = d0 - dog;
    if (a < 0 || a > omur) continue;
    const ox = (random(`${key}x${i}`) - 0.5) * yay, oy = (random(`${key}y${i}`) - 0.5) * yay * 0.45;
    const yuk = (30 + 70 * random(`${key}v${i}`)) * sc;
    const sur = (random(`${key}s${i}`) - 0.35) * 40 * sc;
    const px = x + ox + sur * a + Math.sin(a * 3.1 + i) * 6 * sc;
    const py = y + oy - yuk * a - 10 * sc * a * a;
    const u = a / omur;
    out.push({ x: px, y: py, r: (1.3 + 2.4 * random(`${key}r${i}`)) * sc * (1 - 0.4 * u), o: Math.sin(Math.PI * Math.min(1, u * 1.15)) ** 0.7, parlak: random(`${key}p${i}`) < 0.62 });
  }
};
const ZerreKatman: React.FC<{ z: Zerre[]; parlak: boolean; renk: string; carp?: number }> = ({ z, parlak, renk, carp = 1 }) => (
  <g>
    {z.filter((q) => q.parlak === parlak).map((q, i) => <circle key={i} cx={q.x.toFixed(1)} cy={q.y.toFixed(1)} r={Math.max(0.6, q.r).toFixed(2)} fill={renk} opacity={(q.o * carp).toFixed(3)} />)}
  </g>
);

/* ------------------------------------------------------------------ böcek ve halı listeleri (sabit) */
type Hali = { X: number; D: number; r: number; id: string };
const HALI: Hali[] = (() => {
  const out: Hali[] = [];
  for (let j = 0; j < 25; j++) {
    for (let i = 0; i < 21; i++) {
      const X = -2.55 + i * 0.245 + (j % 2) * 0.12 + (random(`hx${i}-${j}`) - 0.5) * 0.08;
      const D = 0.04 + j * 0.18 + (random(`hd${i}-${j}`) - 0.5) * 0.07;
      out.push({ X, D, r: 0.16 + random(`hr${i}-${j}`) * 0.08, id: `${i}-${j}` });
    }
  }
  return out;
})();
type ZBocek = { X: number; D: number; faz: number; hiz: number; id: number };
const ZBOCEK: ZBocek[] = new Array(120).fill(0).map((_, i) => ({ X: -2.3 + random(`zbx${i}`) * 4.6, D: 0.1 + random(`zbd${i}`) * 4.2, faz: random(`zbf${i}`) * 20, hiz: 0.6 + random(`zbh${i}`) * 0.9, id: i }));
/** Ece'nin üstündeki böcekler: rig birimi (x 0..400, y 0..1000; ayak 985), yön (derece, 0 = sağa), boy */
const ECE_BOCEK: [number, number, number, number][] = [
  [152, 950, -80, 50], [252, 935, -100, 48], [166, 840, -70, 52], [238, 790, -95, 50], [158, 720, -85, 54], [246, 668, -92, 50],
  [140, 590, -62, 54], [262, 540, -112, 52], [182, 480, -80, 50], [226, 440, -100, 48], [126, 420, -48, 50], [284, 410, -128, 52],
  [204, 572, -90, 46], [156, 384, -70, 46], [300, 470, -100, 46], [98, 500, -80, 48],
  // en son: yanağında, göz kenarında (sivilcenin karşı yanağı)
  [150, 236, -60, 34],
];

/* ------------------------------------------------------------------ iki kemikli kol (sarılma) */
type V2 = [number, number];
const ik = (S: V2, T: V2, L1: number, L2: number, bukum: 1 | -1): { E: V2; H: V2 } => {
  const dx = T[0] - S[0], dy = T[1] - S[1];
  let d = Math.hypot(dx, dy);
  const maxD = (L1 + L2) * 0.995;
  const H: V2 = d > maxD ? [S[0] + (dx / d) * maxD, S[1] + (dy / d) * maxD] : T;
  d = Math.min(d, maxD);
  const a = Math.atan2(dy, dx);
  const c = Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * Math.max(1e-6, d))));
  const b = Math.acos(c) * bukum;
  return { E: [S[0] + Math.cos(a + b) * L1, S[1] + Math.sin(a + b) * L1], H };
};
const OUT = "#2b1d1a";
/** iki parçalı kol: dış çizgi + dolgu (eklemler yuvarlak, kopmaz) */
const Kol: React.FC<{ S: V2; E: V2; H: V2; w: number; renk: string; manset?: string; el?: string; elYok?: boolean }> = ({ S, E, H, w, renk, manset, el, elYok }) => {
  const d = `M ${S[0].toFixed(1)} ${S[1].toFixed(1)} L ${E[0].toFixed(1)} ${E[1].toFixed(1)} L ${H[0].toFixed(1)} ${H[1].toFixed(1)}`;
  const ang = Math.atan2(H[1] - E[1], H[0] - E[0]);
  const mx = H[0] - Math.cos(ang) * w * 0.55, my = H[1] - Math.sin(ang) * w * 0.55;
  return (
    <g>
      <path d={d} stroke={OUT} strokeWidth={w * 2 + w * 0.36} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={renk} strokeWidth={w * 2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {manset ? <path d={`M ${mx - Math.sin(ang) * w * 0.85} ${my + Math.cos(ang) * w * 0.85} L ${mx + Math.sin(ang) * w * 0.85} ${my - Math.cos(ang) * w * 0.85}`} stroke={manset} strokeWidth={w * 0.5} /> : null}
      {elYok ? null : <circle cx={H[0]} cy={H[1]} r={w * 0.95} fill={el ?? "#d8a47c"} stroke={OUT} strokeWidth={w * 0.18} />}
    </g>
  );
};
/** omuza konan el: avuç omuzun üstünde, parmaklar öne-aşağı kıvrılır */
const OmuzEl: React.FC<{ H: V2; w: number; aci: number; ten: string; parmak?: number }> = ({ H, w, aci, ten, parmak = 0 }) => (
  <g transform={`translate(${H[0].toFixed(1)} ${H[1].toFixed(1)}) rotate(${aci.toFixed(1)})`}>
    <path d={`M ${-w * 0.9} ${-w * 0.7} Q ${-w * 1.1} ${w * 0.6} ${-w * 0.3} ${w * 1.6 + parmak} Q ${w * 0.3} ${w * 1.9 + parmak} ${w * 0.9} ${w * 1.3 + parmak} Q ${w * 1.1} ${0} ${w * 0.7} ${-w * 0.8} Z`} fill={ten} stroke={OUT} strokeWidth={w * 0.17} strokeLinejoin="round" />
    {[-0.35, 0.1, 0.5].map((q, i) => <path key={i} d={`M ${w * q} ${w * 0.4} L ${w * (q - 0.05)} ${w * (1.35 + (i === 1 ? 0.15 : 0)) + parmak}`} stroke={OUT} strokeWidth={w * 0.1} opacity={0.55} strokeLinecap="round" />)}
  </g>
);

/* =====================================================================================
 *  ŞAFAK (kapı görünümü, camın ardı): karşıda ara sokağın ucunda ufuk; güneş ucunu gösterir. Islak asfalt
 *  güneşi yansıtır. sabah 0 = şafak, 1 = 08:00 (gök maviye döner, güneş yükselir).
 * ===================================================================================== */
export const Safak: React.FC<{ uid: string; sabah: number; gunesY: number; t: number }> = ({ uid, sabah, gunesY, t }) => {
  const gk = [mixC([0.27, 0.33, 0.55], [0.47, 0.66, 0.86], sabah), mixC([0.86, 0.55, 0.5], [0.66, 0.8, 0.9], sabah), mixC([1, 0.74, 0.46], [0.92, 0.93, 0.9], sabah), mixC([1, 0.9, 0.66], [1, 0.97, 0.88], sabah)];
  const sx = 452, sy = 800 - 70 * gunesY - 230 * sabah, sr = 50;
  const bina = mixC([0.42, 0.36, 0.46], [0.6, 0.6, 0.64], sabah);
  const binaKoyu = mixC([0.3, 0.25, 0.34], [0.48, 0.48, 0.52], sabah);
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}gok`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgb(gk[0])} /><stop offset="0.45" stopColor={rgb(gk[1])} /><stop offset="0.8" stopColor={rgb(gk[2])} /><stop offset="1" stopColor={rgb(gk[3])} />
        </linearGradient>
        <radialGradient id={`${uid}gn`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff6d8" stopOpacity={0.95} /><stop offset="0.25" stopColor="#ffd890" stopOpacity={0.55} /><stop offset="1" stopColor="#ff9a50" stopOpacity={0} /></radialGradient>
        <linearGradient id={`${uid}yol`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe2a0" stopOpacity={0.9} /><stop offset="1" stopColor="#ffb860" stopOpacity={0.15} /></linearGradient>
        <clipPath id={`${uid}dc`}><rect x={0} y={420} width={1080} height={770} /></clipPath>
        <clipPath id={`${uid}uf`}><rect x={-100} y={0} width={1300} height={790} /></clipPath>
      </defs>
      <g clipPath={`url(#${uid}dc)`}>
        <rect x={0} y={420} width={1080} height={420} fill={`url(#${uid}gok)`} />
        {/* güneş: ufuk çizgisinin (uzak çatılar) üstünde yalnız ucu görünür */}
        <circle cx={sx} cy={sy} r={360} fill={`url(#${uid}gn)`} opacity={0.9 - 0.4 * sabah} />
        <g clipPath={`url(#${uid}uf)`}><circle cx={sx} cy={sy} r={sr} fill="#fff4d0" /><circle cx={sx} cy={sy} r={sr * 0.8} fill="#ffffff" opacity={0.7} /></g>
        {/* uzak siluet: alçak çatılar, bir kubbe ve minare (pus) */}
        <path d="M 300 790 L 300 772 L 340 772 L 340 764 L 372 764 L 372 778 L 396 778 L 396 768 L 420 768 L 420 790 Z" fill={rgb(mixC(bina, gk[3], 0.55))} />
        <path d="M 500 790 L 500 770 Q 530 742 560 770 L 566 770 L 566 744 L 569 730 L 572 744 L 572 776 L 610 776 L 610 790 Z" fill={rgb(mixC(bina, gk[3], 0.5))} />
        <rect x={290} y={788} width={340} height={10} fill={rgb(mixC(bina, gk[3], 0.4))} />
        {/* ara sokak: iki yanda binalar (perspektif), uçta ufuk */}
        <path d="M -20 300 L 330 728 L 330 800 L -20 1015 Z" fill={rgb(bina)} />
        <path d="M 330 728 L 344 742 L 344 800 L 330 800 Z" fill={rgb(binaKoyu)} />
        {[0, 1, 2, 3].map((i) => {
          const q = i / 4, x0 = -20 + q * 300, x1 = x0 + 46 * (1 - q * 0.7);
          const yt = (x: number) => 300 + (x + 20) * (428 / 350) + 120 * (1 - (x + 20) / 350), yb = (x: number) => 1015 - (x + 20) * (215 / 350) - 80 * (1 - (x + 20) / 350);
          return <path key={i} d={`M ${x0} ${yt(x0)} L ${x1} ${yt(x1)} L ${x1} ${yb(x1) - 140 * (1 - q)} L ${x0} ${yb(x0) - 140 * (1 - q)} Z`} fill={rgb(binaKoyu)} opacity={0.75} />;
        })}
        <path d="M 1100 280 L 600 726 L 600 800 L 1100 1015 Z" fill={rgb(mixC(bina, [0.5, 0.42, 0.5], 0.3))} />
        {[0, 1, 2, 3].map((i) => {
          const q = i / 4, x1 = 1100 - q * 440, x0 = x1 - 60 * (1 - q * 0.7);
          const yt = (x: number) => 280 + (1100 - x) * (446 / 500) + 90 * (1 - (1100 - x) / 500), yb = (x: number) => 1015 - (1100 - x) * (215 / 500) - 70 * (1 - (1100 - x) / 500);
          return <path key={i} d={`M ${x0} ${yt(x0)} L ${x1} ${yt(x1)} L ${x1} ${yb(x1) - 150 * (1 - q)} L ${x0} ${yb(x0) - 150 * (1 - q)} Z`} fill={rgb(binaKoyu)} opacity={0.7} />;
        })}
        {/* çatı kenarlarında güneşin kenar ışığı */}
        <path d="M -20 300 L 330 728" stroke="#ffd8a0" strokeWidth={5} opacity={0.65 * (1 - 0.5 * sabah)} />
        <path d="M 1100 280 L 600 726" stroke="#ffd8a0" strokeWidth={5} opacity={0.6 * (1 - 0.5 * sabah)} />
        {/* ara sokak zemini ve yansıma */}
        <path d="M 330 800 L 600 800 L 1100 1015 L -20 1015 Z" fill={rgb(mixC([0.24, 0.22, 0.27], [0.4, 0.4, 0.42], sabah))} />
        <path d={`M ${sx - 18} 800 L ${sx + 18} 800 L ${sx + 160} 1015 L ${sx - 150} 1015 Z`} fill={`url(#${uid}yol)`} opacity={0.75 - 0.35 * sabah} />
        {[830, 862, 900, 946, 990].map((y, i) => <path key={i} d={`M ${sx - 30 - (y - 800) * 0.6} ${y + Math.sin(t * 2 + i) * 1.5} h ${60 + (y - 800) * 1.2}`} stroke="#fff4d0" strokeWidth={2 + i * 0.6} opacity={0.5 - 0.25 * sabah} />)}
        {/* ana cadde (marketin önü): ıslak asfalt, kaldırım, kaldırım taşı */}
        <rect x={0} y={1015} width={1080} height={112} fill={rgb(mixC([0.2, 0.19, 0.23], [0.36, 0.36, 0.38], sabah))} />
        <path d={`M ${sx - 160} 1015 L ${sx + 170} 1015 L ${sx + 300} 1127 L ${sx - 280} 1127 Z`} fill="#ffcf88" opacity={0.32 - 0.15 * sabah} />
        <rect x={0} y={1127} width={1080} height={12} fill={rgb(mixC([0.62, 0.5, 0.42], [0.72, 0.7, 0.66], sabah))} />
        <rect x={0} y={1139} width={1080} height={60} fill={rgb(mixC([0.78, 0.6, 0.44], [0.8, 0.77, 0.7], sabah))} />
        {/* karşı köşede sokak lambası ve uzun gölgesi (güneş karşıdan: gölge bize doğru) */}
        <rect x={286} y={600} width={9} height={420} fill="#2a2630" />
        <path d="M 286 1015 L 295 1015 L 420 1190 L 396 1190 Z" fill="#1a1620" opacity={0.35 * (1 - 0.6 * sabah)} />
        <path d="M 290 606 q 30 -18 62 -6" stroke="#2a2630" strokeWidth={7} fill="none" />
      </g>
    </g>
  );
};

/* =====================================================================================
 *  B6_KAPI
 *  prm (hepsi sahne zamanında; t0 = vuruşun sahnedeki başlangıcı):
 *   cam [[t,cx,cy,z]], ac [[t,k]] kepenk açıklığı 0..1, acGecik [sol,orta,sag] (k cinsinden gecikme),
 *   gunes [[t,v]] güneş şiddeti, tanA [[t,v]] güneş eğimi, gun [[t,v]] gece→sabah (0..1), gunesY [[t,v]],
 *   saat [[t,"07:21"]], kapi [[t,v]] kapı açıklığı, red (kırmızı saat ışığı), sel (bool, yerde böcek seli),
 *   floresan [[t,v]] (sabah tavan ışığı 0..1),
 *   ece {false ile yok}, eceYer [[t,X,D]] (m), eceOtur [[t,k]], eceDuygu [[t,emo]], eceHickir [[t,v]], eceAgla [[t,v]],
 *   eceGoz [[t,kapalı]], eceBak [[t,lx,ly,yaw]], eceKol [[t,uL,fL,ulL,uR,fR,ulR]], eceTilt [[t,deg]], eceEgil [[t,deg]],
 *   eceKonus [[t0,t1]], eceIrk [t...], gozyasi [[t,v]], eceBocek (bool), agizKapa [[t,k]],
 *   sabri {yol [[t,X,D]], yuru [[t0,t1]], diz [[t,k]], saril [[t,k]], duygu [[t,emo]], konus [[t0,t1]], bak [[t,lx,ly,yaw]],
 *          egil [[t,deg]], okşa (bool)} | null
 * ===================================================================================== */
const B6Kapi: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = prm(text);
  const t = f / fps;
  const tg = t + (p.t0 ?? 0);
  const uid = "b6k";
  const ece = castById("ece_sivil");
  const sabri = castById("sabri");
  const s = durum(p, tg);
  const arr = durumlar(p, fps, tg);
  const [cx, cy, z] = kf(p.cam, tg, [540, 960, 1]);
  const gun = kf1(p.gun, tg, 0);
  const red = (p.red ?? 0.9) * (1 - gun);
  const Df = dFar(s);
  const yb = 1190 - 770 * s.k;
  const kAc = (i: number) => panelK(p, s.k, i);
  const floresan = kf1(p.floresan, tg, 0);
  const zerreler: Zerre[] = [];
  const emberler: React.ReactNode[] = [];

  /* --------------------- Ece geometrisi */
  const eceVar = p.ece !== false;
  const [eX, eD] = [s.ex, s.ed];
  const eSize = ECE_C * sD(eD);
  const eS = eSize / 1000;
  const eFx = xX(eX, eD), eFy = yD(eD);
  const eLeft = eFx - 0.2 * eSize, eTop = eFy - 0.98 * eSize;
  const eceEgil = kf1(p.eceEgil, tg, 0);
  const ePiv: V2 = [eLeft + 200 * eS, eTop + (600 + 345 * s.oy) * eS];
  const rot = (q: V2, c: V2, deg: number): V2 => {
    const a = (deg * Math.PI) / 180, dx = q[0] - c[0], dy = q[1] - c[1];
    return [c[0] + dx * Math.cos(a) - dy * Math.sin(a), c[1] + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  const eceSeed = 41;
  const eHick = kf1(p.eceHickir, tg, 0);
  const hc = hickirDurum(f + Math.round((p.t0 ?? 0) * fps), fps, eceSeed, eHick, 0);
  /** Ece rig noktası → ekran (oturma kayması, eğilme ve omuz sıçraması dahil) */
  const eceP = (lx: number, ly: number, omuz = false): V2 => rot([eLeft + lx * eS, eTop + (ly + 345 * s.oy - (omuz ? hc.omzY : 0)) * eS], ePiv, eceEgil);

  /* --------------------- zemin halısı (böcek seli) */
  const sel = p.sel !== false;
  const tozIzi: React.ReactNode[] = [];
  if (!sel && p.tozIzi) {
    for (const h of HALI) {
      if (random(`ti${h.id}`) > 0.55) continue;
      const sc = sD(h.D), x = xX(h.X, h.D), y = yD(h.D);
      if (y < 1240 || y > 2050) continue;
      tozIzi.push(<ellipse key={`t${h.id}`} cx={x.toFixed(1)} cy={y.toFixed(1)} rx={(h.r * sc * 0.75).toFixed(1)} ry={(h.r * sc * (EH / (D0 - h.D)) * 0.7).toFixed(1)} fill="#8a8276" opacity={0.2 * p.tozIzi} />);
    }
  }
  const haliEl: React.ReactNode[] = [];
  const haliOn: React.ReactNode[] = [];
  if (sel) {
    for (const h of HALI) {
      const tl = ilk(arr, (q) => zemindeIsik(h.X, h.D, q));
      const pp = isFinite(tl) ? (tg - tl) / 1.7 : -1;
      const sc = sD(h.D);
      const x = xX(h.X, h.D), y = yD(h.D);
      if (y < 1240 || y > 2050) continue;
      const rx = h.r * sc, ry = h.r * sc * (EH / (D0 - h.D)) * 1.15;
      if (pp >= 0.5) tozIzi.push(<ellipse key={`t${h.id}`} cx={x.toFixed(1)} cy={y.toFixed(1)} rx={(rx * 0.75).toFixed(1)} ry={(ry * 0.6).toFixed(1)} fill="#8a8276" opacity={(0.2 * sstep(0.5, 1, pp)).toFixed(3)} />);
      if (pp >= 1) continue;
      const pat = sc < 360 ? "A" : sc < 470 ? "B" : sc < 600 ? "C" : "D";
      const o = pp < 0 ? 1 : 1 - sstep(0.12, 0.92, pp);
      const el = <ellipse key={h.id} cx={x.toFixed(1)} cy={y.toFixed(1)} rx={rx.toFixed(1)} ry={ry.toFixed(1)} fill={`url(#${uid}tm${pat})`} opacity={o.toFixed(3)} />;
      (h.D > eD ? haliOn : haliEl).push(el);
      if (pp >= 0) {
        emberler.push(<ellipse key={`e${h.id}`} cx={x} cy={y} rx={rx * 0.9} ry={ry * 0.9} fill="#ff9a40" opacity={(0.2 * Math.sin(Math.PI * Math.min(1, pp * 1.3))).toFixed(3)} />);
        tozSac(`h${h.id}`, x, y, sc / 290, tl, tg, 5, rx * 1.4, zerreler, 1.7);
      }
    }
  }
  /* --------------------- zemindeki tek böcekler: ışık yaklaşınca kaçar (kameraya doğru), yakalanınca donar ve toza döner */
  const bocekArka: React.ReactNode[] = [], bocekOn: React.ReactNode[] = [];
  if (sel) {
    const konum = (b: ZBocek, q: Durum): [number, number, number] => {
      const w = q.t * b.hiz;
      const df = dFar(q);
      const kac = df > 0 ? 0.55 * Math.max(0, df + 0.45 - b.D) : 0;
      const X = b.X + 0.07 * Math.sin(w * 0.9 + b.faz) + 0.02 * Math.sin(w * 2.3);
      const D = b.D + 0.05 * Math.cos(w * 0.7 + b.faz) + kac;
      const a = kac > 0.01 ? Math.PI / 2 + 0.3 * Math.sin(w * 3 + b.faz) : Math.atan2(-0.05 * Math.sin(w * 0.7 + b.faz) * 0.7, 0.07 * Math.cos(w * 0.9 + b.faz) * 0.9);
      return [X, D, a];
    };
    for (const b of ZBOCEK) {
      let tl = Infinity, sabit: [number, number, number] | null = null;
      for (const q of arr) {
        const [X, D, a] = konum(b, q);
        if (zemindeIsik(X, D, q)) { tl = q.t; sabit = [X, D, a]; break; }
      }
      const [X, D, a] = sabit ?? konum(b, s);
      const pp = isFinite(tl) ? (tg - tl) / 1.9 : -1;
      if (pp >= 1) continue;
      const sc = sD(D);
      const x = xX(X, D), y = yD(D);
      if (y < 1245 || y > 2000) continue;
      const boy = 0.085 * sc;
      const sq = Math.min(1, 0.3 + (EH / (D0 - D)) * 0.9);
      const ph = pp >= 0 ? (tl * 14) : tg * 14 * b.hiz + b.id;
      const o = pp < 0 ? 1 : 1 - sstep(0.3, 0.95, pp);
      const el = <Mb key={`b${b.id}`} uid={uid} x={x} y={y} a={a} s={boy * (1 - 0.15 * Math.max(0, pp))} ph={ph} sq={sq} o={o} />;
      (D > eD ? bocekOn : bocekArka).push(el);
      if (pp >= 0) {
        emberler.push(<g key={`be${b.id}`} filter={`url(#${uid}kor)`} opacity={(0.9 * Math.sin(Math.PI * Math.min(1, pp * 1.25))).toFixed(3)}><Mb uid={uid} x={x} y={y} a={a} s={boy} ph={ph} sq={sq} /></g>);
        tozSac(`b${b.id}`, x, y, sc / 290, tl, tg, 9, boy * 0.9, zerreler, 1.9);
      }
    }
  }
  /* --------------------- Ece'nin üstündeki böcekler: ışık bandı ayaklarından yukarı tırmandıkça toza dönerler */
  const eceBocek: React.ReactNode[] = [];
  const emberE: React.ReactNode[] = [];
  const zerreE: Zerre[] = [];
  if (eceVar && p.eceBocek) {
    ECE_BOCEK.forEach(([lx, ly, aDeg, boy], i) => {
      const hb = ((985 - ly) / 1000) * ECE_C;
      const tl = ilk(arr, (q) => { const u = eceIsikUst(q); return u >= hb; });
      const pp = isFinite(tl) ? (tg - tl) / 1.8 : -1;
      if (pp >= 1) return;
      const yur = pp >= 0 ? tl : tg;
      const ly2 = ly - 10 * Math.sin(yur * 1.3 + i) - (i % 3) * 0.6 * Math.min(yur, 12);
      const lx2 = lx + (ly < 330 ? 3 : 6) * Math.sin(yur * 2.1 + i * 1.7);
      const [x, y] = eceP(lx2, ly < 330 ? ly + 3 * Math.sin(yur * 1.7) : Math.max(330, ly2));
      const a = (aDeg * Math.PI) / 180 + 0.25 * Math.sin(yur * 3 + i);
      const ph = pp >= 0 ? tl * 12 : tg * 12 + i;
      const o = pp < 0 ? 1 : 1 - sstep(0.3, 0.95, pp);
      eceBocek.push(<Mb key={`eb${i}`} uid={uid} x={x} y={y} a={a} s={boy * eS} ph={ph} o={o} />);
      if (pp >= 0) {
        emberE.push(<g key={`ebe${i}`} filter={`url(#${uid}kor)`} opacity={(0.9 * Math.sin(Math.PI * Math.min(1, pp * 1.25))).toFixed(3)}><Mb uid={uid} x={x} y={y} a={a} s={boy * eS} ph={ph} /></g>);
        tozSac(`eb${i}`, x, y, eS * 1.1, tl, tg, 10, boy * eS * 0.8, zerreE, 1.8);
      }
    });
  }

  /* --------------------- Ece pozu */
  const emo = basamak<string>(p.eceDuygu, tg, "dehset") as Emotion;
  const [lx, ly, yaw] = kf(p.eceBak, tg, [0.1, 0.05, 0]);
  const kol = kf(p.eceKol, tg, [6, 0, 1, 6, 0, 1]);
  const armL: ArmPose = { upper: kol[0], fore: kol[1], ul: kol[2] };
  const armR: ArmPose = { upper: kol[3], fore: kol[4], ul: kol[5] };
  let irk = 0;
  for (const h of p.eceIrk ?? []) { const d = tg - h; if (d >= 0 && d < 0.6) irk = Math.max(irk, Math.exp(-d * 8) * Math.abs(Math.sin(d * 16 + 0.4))); }
  const konusE = araliktaMi(p.eceKonus, tg);
  const eceTitre = eHick > 0 || emo === "dehset" ? Math.sin(tg * 43) * 1.6 + Math.sin(tg * 27) * 1.1 : 0;
  const eceGoz = kf1(p.eceGoz, tg, 0);

  /* --------------------- Sabri */
  const sp = p.sabri as Prm | undefined;
  let sabriEl: React.ReactNode = null, kolArka: React.ReactNode = null, kolOn: React.ReactNode = null, golgeSabri: number[][] | null = null;
  if (sp) {
    const [sX, sDd] = kf(sp.yol, tg, [-0.4, 3.15]);
    const dz = kf1(sp.diz, tg, 0);
    const sar = kf1(sp.saril, tg, 0);
    let darbe = 0;
    for (const h of sp.darbe ?? []) { const d = tg - h; if (d >= 0 && d < 1.1) darbe = Math.max(darbe, Math.exp(-d * 4) * Math.sin(Math.min(Math.PI, d * 8))); }
    const egil = kf1(sp.egil, tg, 0) - 16 * darbe;
    const size = SABRI_C * sD(sDd);
    const S = size / 1000;
    const fx = xX(sX, sDd), fy = yD(sDd);
    const left = fx - 0.2 * size, top = fy - 0.98 * size;
    const piv: V2 = [left + 200 * S, top + 980 * S];
    const gs = 680 * (1 - 0.97) + 185 * dz;
    const sP = (lx2: number, ly2: number): V2 => rot([left + lx2 * S, top + (300 + (ly2 - 300) * 0.97 + gs) * S], piv, egil);
    const yuru = araliktaMi(sp.yuru, tg);
    const konusS = araliktaMi(sp.konus, tg);
    const [blx, bly, byaw] = kf(sp.bak, tg, [0.4, 0.2, 0.25]);
    const duyguS = basamak<string>(sp.duygu, tg, "uzgun") as Emotion;
    // kapı eşiğindeyken (D < 0,05) yalnız kapı aralığında görünür
    const dOp = kf1(p.kapi, tg, 0);
    const sl = 250 * 0.96 * dOp;
    const klip = sDd < 0.05 ? `polygon(${(550 - sl - left).toFixed(1)}px -2000px, ${(550 + sl - left).toFixed(1)}px -2000px, ${(550 + sl - left).toFixed(1)}px ${(1262 - top).toFixed(1)}px, ${(550 - sl - left).toFixed(1)}px ${(1262 - top).toFixed(1)}px)` : undefined;
    const kolOverlay = sar > 0.001;
    sabriEl = (
      <div style={{ position: "absolute", left, top, clipPath: klip, transformOrigin: `${200 * S}px ${980 * S}px`, transform: egil ? `rotate(${egil}deg)` : undefined }}>
        <Character look={sabri} size={size} pose={{ emotion: duyguS, body: yuru ? "walk" : undefined, diz: dz, lookX: blx, lookY: bly, yaw: byaw, talk: konusS ? [[f - 2, f + 2]] : undefined, kolGizle: kolOverlay ? "ikisi" : undefined, seed: 23, golgesiz: gun < 0.5 }} />
      </div>
    );
    if (kolOverlay) {
      // sarılma: arka kol (Ece'ye yakın, sağ) Ece'nin sırtından uzak omzuna; ön kol (sol) Ece'nin başını okşar
      const wArm = 21 * S;
      const L1 = 140 * S, L2 = 122 * S;
      const Sr = sP(200 + 72 * 1.24, 352), Sl = sP(200 - 72 * 1.24, 352);
      const restR: V2 = [Sr[0] + 18 * S, Sr[1] + 255 * S], restL: V2 = [Sl[0] - 18 * S, Sl[1] + 255 * S];
      const uzakOmuz = eceP(200 + 72 * 0.9 - 4, 346, true);
      const okşa = sp.okşa !== false ? Math.sin(tg * 3.2) * 10 * eS : 0;
      // ön kol: el Ece'nin başının üstüne-arkasına (tepe, kadraj solu); dirsek yukarıda, kol yüzün üstünden geçmez
      const basT = eceP(172 + (okşa / eS) * 0.25, 96 + (okşa / eS) * 0.5, false);
      const u1 = sstep(0, 0.75, sar), u2 = sstep(0.25, 1, sar);
      const T1: V2 = [restR[0] + (uzakOmuz[0] - restR[0]) * u1, restR[1] + (uzakOmuz[1] - restR[1]) * u1];
      const T2: V2 = [restL[0] + (basT[0] - restL[0]) * u2, restL[1] + (basT[1] - restL[1]) * u2];
      const a1 = ik(Sr, T1, L1, L2, 1), a2 = ik(Sl, T2, L1, L2, (sp.bukum ?? 1) as 1 | -1);
      const renk = sabri.outfit.top;
      kolArka = <Kol S={Sr} E={a1.E} H={a1.H} w={wArm} renk={renk} manset={sabri.outfit.topShade} elYok />;
      kolOn = (
        <g>
          {u1 > 0.6 ? <OmuzEl H={a1.H} w={wArm * 0.95} aci={-20} ten={sabri.skin} parmak={1.5 * Math.sin(tg * 3.2) * S * 10} /> : <circle cx={a1.H[0]} cy={a1.H[1]} r={wArm * 0.95} fill={sabri.skin} stroke={OUT} strokeWidth={wArm * 0.18} />}
          <Kol S={Sl} E={a2.E} H={a2.H} w={wArm} renk={renk} manset={sabri.outfit.topShade} el={sabri.skin} />
        </g>
      );
    }
    golgeSabri = [[sX, sDd, dz]];
  }

  /* --------------------- ışık haritası (multiply) */
  const amb = mixC([0.07, 0.05, 0.065], [0.6, 0.63, 0.7], gun);
  const bounce = s.sun * Math.min(1, Math.max(0, Df) / 4.2) * (1 - gun);
  const ambB = mixC(amb, [amb[0] + 0.17, amb[1] + 0.11, amb[2] + 0.06], bounce);
  const ambF = mixC(ambB, [Math.max(ambB[0], 0.7), Math.max(ambB[1], 0.72), Math.max(ambB[2], 0.76)], floresan);
  const sunC = mixC([1, 0.84, 0.62], [1, 0.8, 0.55], gun).map((v) => v * s.sun);
  const Dm = Math.min(Df, 4.6);
  const yan = s.yan;
  const yamaD = Df > 0 ? poly([[xX(-2.8, 0), yD(0)], [xX(2.8, 0), yD(0)], [xX(2.8 + yan * Dm, Dm), yD(Dm)], [xX(-2.8 + yan * Dm, Dm), yD(Dm)]]) : "";
  const golgePoly = (X: number, D: number, H: number, hw: number) => {
    const L = Math.min(H / s.tan, Dm - D);
    if (L <= 0) return "";
    const D2 = D + L;
    const q = L / (H / s.tan);
    return poly([[xX(X - hw, D), yD(D)], [xX(X + hw, D), yD(D)], [xX(X + yan * L + hw * (1 - 0.45 * q), D2), yD(D2)], [xX(X + yan * L - hw * (1 - 0.45 * q), D2), yD(D2)]]);
  };
  const eceUst = eceIsikUst(s);
  const bandUstY = eFy - Math.max(0, Math.min(s.eh + 0.15, eceUst)) * sD(eD);

  /* --------------------- ışık hüzmesi (screen) */
  const hzOp = 0.1 * s.sun * Math.min(1, s.k * 4) * (1 - 0.6 * gun);
  const zerreGlow = zerreler.filter((q) => q.parlak);
  const motlar: React.ReactNode[] = [];
  if (Df > 0 && hzOp > 0.005) {
    for (let i = 0; i < 70; i++) {
      const D = random(`mt${i}`) * Math.min(Dm, 4.2);
      const ust = hOpen(s.k) - D * s.tan;
      if (ust <= 0.05) continue;
      const Y = ((random(`my${i}`) * ust + tg * 0.03 * (0.5 + random(`mv${i}`))) % ust);
      const X = -2.4 + random(`mx${i}`) * 4.8 + 0.05 * Math.sin(tg * 0.6 + i);
      const sc = sD(D);
      const gl = 0.5 + 0.5 * Math.sin(tg * (1.5 + random(`mg${i}`) * 2) + i);
      motlar.push(<circle key={i} cx={xX(X, D)} cy={yD(D) - Y * sc} r={(0.004 * sc).toFixed(2)} fill="#fff0c8" opacity={(0.7 * gl * s.sun).toFixed(3)} />);
    }
  }
  const saat = basamak<string>(p.saat, tg, "07:24");
  const grade = mixC([0.72, 1.14, 0.96], [1.06, 1.04, 1.02], Math.max(gun, 0.55 * bounce));
  const op = p.acilis ? 1 - sstep(p.t0 ?? 0, (p.t0 ?? 0) + p.acilis, tg) : 0;
  /* --------------------- karakter ışığı: ışık haritası karakterleri ETKİLEMEZ (camın ardındaki dış ışık onları
   * beyazlatırdı). Her karakter renk filtresiyle aydınlatılır: ortam (+ kırmızı saat) ve güneş bandı. Ece iki kopya:
   * bandın altı ışıklı, üstü ışıksız; sınır yumuşak maske (ışık çizgisi gövdesinde yukarı tırmanır). */
  const scr = (a: number[], b: number[]) => a.map((v, i) => 1 - (1 - v) * (1 - b[i]));
  const redAt = (x: number, y: number) => {
    const d = Math.min(1, Math.hypot((x - 540) / 1400, (y - 520) / 1750));
    const r = red * (d < 0.45 ? 0.85 - (0.5 * d) / 0.45 : 0.35 * (1 - (d - 0.45) / 0.55));
    return [r, r * 0.11, r * 0.08];
  };
  const eceAmb = scr(ambF, redAt(eFx, eFy - 0.5 * eSize));
  const eceLit = scr(eceAmb, sunC.map((v) => v * 0.92));
  const cm = (c: number[]) => `${c[0].toFixed(3)} 0 0 0 0  0 ${c[1].toFixed(3)} 0 0 0  0 0 ${c[2].toFixed(3)} 0 0  0 0 0 1 0`;
  const PAD = 400;
  const eW = eSize * 0.4 + 2 * PAD, eH = eSize + 2 * PAD;
  const bandRel = bandUstY - (eTop - PAD);
  const eceIsikli = eceVar && eceUst > 0 && Df > 0;
  const sabriLit = (() => {
    if (!sp) return ambF;
    const [, sDd] = kf(sp.yol, tg, [-0.4, 3.15]);
    const ust = dFar(s) >= sDd ? hOpen(s.k) - sDd * s.tan : -1;
    return scr(ambF, sunC.map((v) => v * 0.9 * Math.max(0, Math.min(1, ust / 1.3))));
  })();
  const eceKopya = (isikli: boolean) => (
    <div style={{
      position: "absolute", left: eLeft + eceTitre - PAD, top: eTop - 18 * irk * eS * 3 - PAD, width: eW, height: eH,
      transformOrigin: `${PAD + 200 * eS}px ${PAD + (600 + 345 * s.oy) * eS}px`, transform: eceEgil ? `rotate(${eceEgil}deg)` : undefined,
      filter: `url(#${uid}${isikli ? "fL" : "fA"})`,
      WebkitMaskImage: eceIsikli ? `linear-gradient(to bottom, ${isikli ? "transparent" : "black"} ${(bandRel - 7).toFixed(1)}px, ${isikli ? "black" : "transparent"} ${(bandRel + 7).toFixed(1)}px)` : undefined,
    }}>
      <div style={{ position: "absolute", left: PAD, top: PAD }}>
        <Character look={ece} size={eSize} pose={{
          emotion: emo, lookX: lx, lookY: ly, yaw, pale: kf1(p.pale, tg, 0.5), sacDagin: true, tears: kf1(p.gozyasi, tg, 0.5), armL, armR,
          agizKapa: kf1(p.agizKapa, tg, 0) || undefined, elTitre: 1, yerOtur: s.oy, hickir: eHick || undefined, aglaAgiz: p.eceAgla ? kf1(p.eceAgla, tg, 0) : undefined,
          tilt: kf1(p.eceTilt, tg, 0), eyesClosed: eceGoz > 0.01 ? eceGoz : undefined, talk: konusE ? [[f - 2, f + 2]] : undefined, golgesiz: true, seed: eceSeed,
        }} />
      </div>
      {/* Ece'nin üstündeki böcekler (rig'le aynı ışıkta); eğilme dönüşü dışarıda hesaplandığı için geri alınır */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: -(eLeft + eceTitre - PAD), top: -(eTop - 18 * irk * eS * 3 - PAD), overflow: "visible", transformOrigin: `${ePiv[0]}px ${ePiv[1]}px`, transform: eceEgil ? `rotate(${-eceEgil}deg)` : undefined }}>
        <MiniDefs uid={`${uid}${isikli ? "l" : "a"}`} />
        {React.Children.map(eceBocek, (el) => (React.isValidElement(el) ? React.cloneElement(el as React.ReactElement<{ uid: string }>, { uid: `${uid}${isikli ? "l" : "a"}` }) : el))}
      </svg>
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden", isolation: "isolate" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id={`${uid}fA`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={cm(eceAmb)} /></filter>
          <filter id={`${uid}fL`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={cm(eceLit)} /></filter>
          <filter id={`${uid}fS`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={cm(sabriLit)} /></filter>
        </defs>
      </svg>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: camT(cx, cy, z), filter: `saturate(${grade[0]}) contrast(${grade[1]}) brightness(${grade[2]})` }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <MiniDefs uid={uid} />
          <defs>
            {(["A", "B", "C", "D"] as const).map((k, i) => <pattern key={k} id={`${uid}tm${k}`} href={`#${uid}tm`} patternTransform={`translate(${(tg * 9) % 74} ${(tg * 23) % 50}) scale(${[1.15, 1.55, 2.0, 2.5][i]})`} />)}
            <filter id={`${uid}kor`} x="-30%" y="-30%" width="160%" height="160%"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.62  0 0 0 0 0.25  0 0 0 1 0" /><feGaussianBlur stdDeviation="1.5" /></filter>
          </defs>
          <Market724BG view="kapi" frame={f} doorOpen={kf1(p.kapi, tg, 0)} saat={saat} iz={0} turb={0}
            dis={<Safak uid={uid} sabah={gun} gunesY={kf1(p.gunesY, tg, 0)} t={tg} />}
            kepenkKatman={
              <g>
                {PANEL.map(([a, b], i) => <Kepenk2 key={i} k={1 - kAc(i)} t={tg} f={f} gocuk={((p.gocuk ?? B5_GOCUK) as number[][]).filter(([gx]) => gx >= a && gx < b).map(([gx, gy]) => ({ t: -100, x: gx, y: gy - 770 * kAc(i), r: 90, d: 20 }))} uid={`${uid}kp${i}`} x0={a} x1={b} />)}
                {s.delik.map((d, i) => (
                  <g key={`dl${i}`}>
                    <ellipse cx={d.x} cy={d.y} rx={7} ry={4} fill="#fff4d0" />
                    <ellipse cx={d.x} cy={d.y} rx={18} ry={10} fill="#ffcf80" opacity={0.5 * s.sun} />
                  </g>
                ))}
                {/* kepengin alt kenarından sızan çizgi ışık (aralık çok darken) */}
                {s.k > 0 && s.k < 0.08 ? <rect x={0} y={yb - 3} width={1080} height={6} fill="#ffe2a0" opacity={0.9} /> : null}
                {s.k > 0.001 && s.sun > 0.04 ? (
                  <g style={{ mixBlendMode: "screen" }}>
                    <defs><filter id={`${uid}apb`} x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="14" /></filter></defs>
                    <rect x={-60} y={Math.max(420, yb - 12)} width={1200} height={Math.min(36, 1190 - yb + 16)} fill="#ffcf80" opacity={0.6 * s.sun * (1 - 0.6 * gun)} filter={`url(#${uid}apb)`} />
                    <rect x={-60} y={1150} width={1200} height={44} fill="#ffcf80" opacity={0.4 * s.sun * Math.min(1, s.k * 6) * (1 - 0.6 * gun)} filter={`url(#${uid}apb)`} />
                  </g>
                ) : null}
              </g>
            }
          />
          <defs>
            <filter id={`${uid}yirt`} x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={7} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={26} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <g filter={`url(#${uid}yirt)`}>{tozIzi}{haliEl}{haliOn}</g>
          {bocekArka}
          {bocekOn}
          <ZerreKatman z={zerreler.filter((q) => !q.parlak)} parlak={false} renk="#8a7a66" carp={0.8} />
          <Market724FG view="kapi" frame={f} doorOpen={0} saat="" iz={0} turb={0} />
        </svg>
        {/* ışık haritası (yalnız set ve zemin): ortam + kırmızı saat + güneş yaması; gölgeler ortama döner */}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", mixBlendMode: "multiply" }}>
          <defs>
            <filter id={`${uid}lb`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5" /></filter>
            <radialGradient id={`${uid}rd`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={rgb([0.85 * red, 0.1 * red, 0.07 * red])} /><stop offset="0.45" stopColor={rgb([0.35 * red, 0.03 * red, 0.02 * red])} /><stop offset="1" stopColor="#000" /></radialGradient>
          </defs>
          <g filter={`url(#${uid}lb)`}>
            <rect x={-1200} y={-1200} width={3480} height={4320} fill={rgb(ambF)} />
            {red > 0.01 ? <ellipse cx={540} cy={520} rx={1400} ry={1750} fill={`url(#${uid}rd)`} style={{ mixBlendMode: "screen" }} /> : null}
            {yamaD ? <path d={yamaD} fill={rgb(sunC)} style={{ mixBlendMode: "screen" }} /> : null}
            {s.delik.map((d, i) => (d.D < 4.6 && d.D > dFar(s) ? <ellipse key={`dz${i}`} cx={xX(d.X, d.D)} cy={yD(d.D)} rx={DELIK_R * sD(d.D)} ry={DELIK_R * sD(d.D) * (EH / (D0 - d.D)) * 1.25} fill={rgb(sunC)} style={{ mixBlendMode: "screen" }} /> : null))}
            {/* gölgeler: Ece (ve Sabri) ile vitrin kayıtları */}
            {eceVar && Df > 0 ? <path d={golgePoly(s.ex, s.ed, s.eh, s.ehw)} fill={rgb(ambF)} /> : null}
            {golgeSabri && Df > 0 ? golgeSabri.map(([X, D, dz2], i) => <path key={i} d={golgePoly(X, D, 1.7 - 0.6 * dz2, 0.26)} fill={rgb(ambF)} opacity={0.85} />) : null}
            {Df > 0 ? KAYIT.map((X, i) => <path key={i} d={poly([[xX(X - 0.03, 0), yD(0)], [xX(X + 0.03, 0), yD(0)], [xX(X + 0.03 + yan * Dm, Dm), yD(Dm)], [xX(X - 0.03 + yan * Dm, Dm), yD(Dm)]])} fill={rgb(ambF)} opacity={0.8} />) : null}
            {/* kendi ışığı olanlar: dış (açık aralık), LED saat, neon */}
            {s.k > 0.001 ? <rect x={-60} y={yb} width={1200} height={1190 - yb} fill="#fff" /> : null}
            <rect x={380} y={290} width={320} height={110} fill="#fff" />
            {floresan > 0.01 ? <rect x={170} y={140} width={740} height={90} fill="#fff" opacity={floresan} /> : null}
            <rect x={840} y={550} width={220} height={80} fill="#fff" opacity={0.8} />
          </g>
        </svg>
        {/* hüzme, toz zerreleri, zemindeki korlar (screen) — karakterlerin ARKASINDA */}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", mixBlendMode: "screen" }}>
          <defs>
            <linearGradient id={`${uid}hz`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd890" stopOpacity={1} /><stop offset="1" stopColor="#ff9a50" stopOpacity={0.1} /></linearGradient>
            <filter id={`${uid}gb`}><feGaussianBlur stdDeviation="18" /></filter>
            <filter id={`${uid}gb2`}><feGaussianBlur stdDeviation="3" /></filter>
          </defs>
          {Df > 0 && hzOp > 0.005 ? (
            <g opacity={hzOp}>
              <path d={poly([[-80, yb], [1160, yb], [1160, 1195], [xX(2.8 + yan * Dm, Dm), yD(Dm)], [xX(-2.8 + yan * Dm, Dm), yD(Dm)], [-80, 1195]])} fill={`url(#${uid}hz)`} filter={`url(#${uid}gb)`} />
              {[0.12, 0.3, 0.47, 0.66, 0.85].map((q, i) => {
                const x0 = q * 1080, x1 = x0 + 60 + 20 * Math.sin(tg * 0.4 + i);
                const Xb = (x0 - 540) / 290 + yan * Dm, Xb2 = (x1 - 540) / 290 + yan * Dm;
                return <path key={i} d={poly([[x0, yb], [x1, yb], [xX(Xb2 * 1.3, Dm), yD(Dm)], [xX(Xb * 1.3, Dm), yD(Dm)]])} fill="#ffe8b0" opacity={0.35 + 0.25 * Math.sin(tg * 0.7 + i * 2)} filter={`url(#${uid}gb)`} />;
              })}
            </g>
          ) : null}
          {s.delik.map((d, i) => {
            const Dz = Math.min(d.D, 4.6), sc = sD(Dz);
            const fx = xX(d.X, Dz), fy = yD(Dz);
            const w = 0.05 * sc;
            return (
              <g key={`dh${i}`} opacity={0.55 * s.sun * (1 - 0.6 * gun)}>
                <path d={poly([[d.x - 3, d.y], [d.x + 3, d.y], [fx + w, fy], [fx - w, fy]])} fill="#ffe2a0" filter={`url(#${uid}gb2)`} />
                <path d={poly([[d.x - 1, d.y], [d.x + 1, d.y], [fx + w * 0.35, fy], [fx - w * 0.35, fy]])} fill="#fff6dc" opacity={0.8} />
              </g>
            );
          })}
          {motlar}
          <g filter={`url(#${uid}gb2)`}>{emberler}</g>
          <ZerreKatman z={zerreGlow} parlak renk="#ffe6a8" carp={0.95} />
        </svg>
        {/* Sabri (ve sarılmanın arka kolu) */}
        {sabriEl ? (
          <div style={{ position: "absolute", inset: 0, filter: `url(#${uid}fS)` }}>
            {sabriEl}
            <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{kolArka}</svg>
          </div>
        ) : null}
        {eceVar ? eceKopya(false) : null}
        {eceIsikli ? eceKopya(true) : null}
        {kolOn ? (
          <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: `url(#${uid}fS)` }}>{kolOn}</svg>
        ) : null}
        {/* Ece'nin üstündeki böceklerin korları ve tozu (önde) */}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", mixBlendMode: "screen" }}>
          <g filter={`url(#${uid}gb2)`}>{emberE}</g>
          <ZerreKatman z={zerreE.filter((q) => q.parlak)} parlak renk="#ffe6a8" carp={0.95} />
        </svg>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <ZerreKatman z={zerreE.filter((q) => !q.parlak)} parlak={false} renk="#6a5a4a" carp={0.7} />
        </svg>
      </AbsoluteFill>
      <Siyah o={op} />
    </AbsoluteFill>
  );
};

/* =====================================================================================
 *  B6_ZEMİN: zemin hizasında yakın plan (kamera 10 cm). Uçta kepengin aralığı parlar; ışık sınırı kameraya
 *  ilerler, sınır boyunca böcekler kor gibi kızarıp toza döner, toz hüzmede yükselir. Solda Ece'nin ayakkabıları
 *  (arkadan değil: kamera depo tarafında, kapıya bakar), gölgesinde böcekler bir süre daha yaşar.
 *  prm: t0, ac, tanA, gunes, gun (b6_kapi ile aynı), zw (kameradan duvara m, vars. 4,4), camX (m), cam [[t,z]],
 *       ece (bool), eceYer (b6_kapi ile aynı; derinlik buradan alınır), eceBocek (bool)
 * ===================================================================================== */
const B6Zemin: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = prm(text);
  const tg = f / fps + (p.t0 ?? 0);
  const uid = "b6z";
  const s = durum(p, tg);
  const arr = durumlar(p, fps, tg);
  const Zw = p.zw ?? 4.4, H = 0.1, FZ = 1000, VYz = 640;
  const camX = p.camX ?? 0.55;
  const P = (X: number, Y: number, Z: number): V2 => [540 + ((X - camX) * FZ) / Z, VYz - ((Y - H) * FZ) / Z];
  const zOf = (D: number) => Zw - D;
  const [zz] = kf(p.cam, tg, [1]);
  const Df = dFar(s);
  const gun = kf1(p.gun, tg, 0);
  const red = (p.red ?? 0.9) * (1 - gun);
  const zerreler: Zerre[] = [];
  const ember: React.ReactNode[] = [];
  const eceVar = p.ece !== false;
  const eD = s.ed, eZ = zOf(eD), eX = s.ex;
  // halı (yakın: daha sık), tek böcekler
  const hali: React.ReactNode[] = [];
  for (let j = 0; j < 46; j++) {
    for (let i = 0; i < 16; i++) {
      const Z = 0.16 + j * 0.092 + (random(`zh${i}-${j}`) - 0.5) * 0.04;
      if (Z > Zw - 0.03) continue;
      const X = camX - 1.6 + i * 0.21 + (j % 2) * 0.1 + (random(`zx${i}-${j}`) - 0.5) * 0.06;
      const D = Zw - Z;
      const tl = ilk(arr, (q) => zemindeIsik(X, D, q));
      const pp = isFinite(tl) ? (tg - tl) / 1.7 : -1;
      if (pp >= 1) continue;
      const [x, y] = P(X, 0, Z);
      if (x < -300 || x > 1380) continue;
      const r = (0.13 * FZ) / Z;
      const sq = H / Z + 0.05;
      const o = pp < 0 ? 1 : 1 - sstep(0.12, 0.92, pp);
      const sc = FZ / Z;
      const pat = sc < 400 ? "A" : sc < 900 ? "B" : sc < 2000 ? "C" : "D";
      hali.push(<ellipse key={`${i}-${j}`} cx={x} cy={y} rx={r} ry={r * sq * 1.3} fill={`url(#${uid}tm${pat})`} opacity={o} />);
      if (pp >= 0) {
        ember.push(<ellipse key={`e${i}-${j}`} cx={x} cy={y} rx={r} ry={r * sq * 1.3} fill="#ff9a40" opacity={0.5 * Math.sin(Math.PI * Math.min(1, pp * 1.3))} />);
        tozSac(`zh${i}-${j}`, x, y, sc / 500, tl, tg, 4, r, zerreler, 1.7);
      }
    }
  }
  const bocek: { Z: number; el: React.ReactNode }[] = [];
  for (let i = 0; i < 70; i++) {
    const Z0 = 0.22 + random(`zbz${i}`) ** 1.6 * (Zw - 0.4);
    const X0 = camX - 1.3 + random(`zbx${i}`) * 2.6;
    const faz = random(`zbf${i}`) * 10, hiz = 0.6 + random(`zbh${i}`) * 0.8;
    const konum = (q: Durum): [number, number, number] => {
      const w = q.t * hiz;
      const df = dFar(q);
      const D0b = Zw - Z0;
      const kac = df > 0 ? 0.55 * Math.max(0, df + 0.45 - D0b) : 0;
      const X = X0 + 0.04 * Math.sin(w * 0.9 + faz);
      const D = D0b + 0.03 * Math.cos(w * 0.7 + faz) + kac;
      return [X, D, kac > 0.01 ? Math.PI / 2 + 0.35 * Math.sin(w * 3 + faz) : w * 0.4 + faz];
    };
    let tl = Infinity, sabit: [number, number, number] | null = null;
    for (const q of arr) { const c = konum(q); if (zemindeIsik(c[0], c[1], q)) { tl = q.t; sabit = c; break; } }
    const [X, D, a] = sabit ?? konum(s);
    const Z = zOf(D);
    if (Z < 0.12) continue;
    const pp = isFinite(tl) ? (tg - tl) / 2.0 : -1;
    if (pp >= 1) continue;
    const [x, y] = P(X, 0.012, Z);
    const boy = (0.085 * FZ) / Z;
    const sq = Math.min(1, H / Z + 0.12);
    const ph = pp >= 0 ? tl * 14 : tg * 14 * hiz + i;
    const o = pp < 0 ? 1 : 1 - sstep(0.3, 0.95, pp);
    bocek.push({ Z, el: <Mb key={`b${i}`} uid={uid} x={x} y={y} a={a} s={boy} ph={ph} sq={sq} o={o} /> });
    if (pp >= 0) {
      ember.push(<g key={`be${i}`} filter={`url(#${uid}kor)`} opacity={0.9 * Math.sin(Math.PI * Math.min(1, pp * 1.25))}><Mb uid={uid} x={x} y={y} a={a} s={boy} ph={ph} sq={sq} /></g>);
      tozSac(`zb${i}`, x, y - boy * 0.1, (FZ / Z) / 500, tl, tg, 12, boy * 0.8, zerreler, 2.0);
    }
  }
  bocek.sort((a, b) => b.Z - a.Z);
  // ışık: duvardaki aralık, zemin yaması, gölgeler
  const yb = hOpen(s.k);
  const gy0 = P(camX, yb, Zw)[1], gy1 = P(camX, 0.2, Zw)[1];
  const [, wallY] = P(0, 0, Zw);
  const Zf = Df > 0 ? Math.max(0.05, Zw - Df) : Zw;
  const yamaD = Df > 0 ? poly([P(camX - 4, 0, Zw), P(camX + 4, 0, Zw), P(camX + 4, 0, Math.max(0.08, Zf)), P(camX - 4, 0, Math.max(0.08, Zf))]) : "";
  let golgeD = "";
  if (eceVar && Df > 0) {
    const L = s.eh / s.tan;
    const Z2 = Math.max(0.08, eZ - L);
    golgeD = poly([P(eX - s.ehw, 0, eZ), P(eX + s.ehw, 0, eZ), P(eX + s.ehw * 0.6 - s.yan * L, 0, Z2), P(eX - s.ehw * 0.6 - s.yan * L, 0, Z2)]);
  }
  const amb = mixC([0.05, 0.045, 0.06], [0.8, 0.79, 0.76], gun);
  const bounce = s.sun * Math.min(1, s.k * 2.5) * (1 - gun);
  const ambB = mixC(amb, [amb[0] + 0.28, amb[1] + 0.18, amb[2] + 0.1], bounce);
  const sunC = [1, 0.85, 0.63].map((v) => v * s.sun);
  // Ece'nin ayakkabıları + paçaları (önden; ışık bandı ayaktan yukarı)
  const ayak = (side: number) => {
    const X = eX + side * 0.09;
    const [a1, b1] = P(X - 0.05, 0, eZ + 0.04), [a2] = P(X + 0.05, 0, eZ + 0.04);
    const [c1, d1] = P(X - 0.065, 0.75, eZ), [c2] = P(X + 0.065, 0.75, eZ);
    const [, kay] = P(X, 0.1, eZ);
    return (
      <g key={side}>
        <path d={poly([[a1 + 8, kay], [a2 - 8, kay], [c2, d1], [c1, d1]])} fill="#34466a" stroke={OUT} strokeWidth={5} />
        <path d={`M ${(a1 + a2) / 2} ${kay} L ${(c1 + c2) / 2} ${d1}`} stroke="#22304e" strokeWidth={6} opacity={0.5} />
        <path d={`M ${a1 - 10} ${kay + 6} Q ${a1 - 18} ${b1 + 14} ${(a1 + a2) / 2} ${b1 + 18} Q ${a2 + 18} ${b1 + 14} ${a2 + 10} ${kay + 6} Q ${(a1 + a2) / 2} ${kay - 18} ${a1 - 10} ${kay + 6} Z`} fill="#f0f0f0" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M ${a1 - 12} ${b1 + 2} Q ${(a1 + a2) / 2} ${b1 + 12} ${a2 + 12} ${b1 + 2}`} stroke="#b8b8b8" strokeWidth={8} fill="none" />
      </g>
    );
  };
  // Ece'nin ayakkabısına tırmanmış böcekler (ışık bandı geçince toza)
  const ayakBocek: React.ReactNode[] = [];
  if (eceVar && p.eceBocek) {
    [[-1, 0.03, 0.05], [1, -0.02, 0.09], [-1, -0.03, 0.2], [1, 0.03, 0.27], [-1, 0.0, 0.38], [1, 0.0, 0.47]].forEach(([side, dx, Y], i) => {
      const tl = ilk(arr, (q) => eceIsikUst(q) >= Y);
      const pp = isFinite(tl) ? (tg - tl) / 1.8 : -1;
      if (pp >= 1) return;
      const yur = pp >= 0 ? tl : tg;
      const [x, y] = P(eX + side * 0.09 + dx + 0.01 * Math.sin(yur * 2 + i), Y + 0.01 * Math.sin(yur * 1.3 + i), eZ - 0.07);
      const boy = (0.07 * FZ) / eZ;
      const ph = pp >= 0 ? tl * 12 : tg * 12 + i;
      const a = -Math.PI / 2 + 0.3 * Math.sin(yur * 3 + i);
      ayakBocek.push(<Mb key={i} uid={uid} x={x} y={y} a={a} s={boy} ph={ph} o={pp < 0 ? 1 : 1 - sstep(0.3, 0.95, pp)} />);
      if (pp >= 0) {
        ember.push(<g key={`ae${i}`} filter={`url(#${uid}kor)`} opacity={0.9 * Math.sin(Math.PI * Math.min(1, pp * 1.25))}><Mb uid={uid} x={x} y={y} a={a} s={boy} ph={ph} /></g>);
        tozSac(`ab${i}`, x, y, (FZ / eZ) / 500, tl, tg, 10, boy * 0.7, zerreler, 1.8);
      }
    });
  }
  const eceUst = eceIsikUst(s);
  const [, bandY] = P(eX, Math.max(0, eceUst), eZ);
  const [, ayakY] = P(eX, 0, eZ);
  const hzOp = 0.2 * s.sun * Math.min(1, s.k * 4) * (1 - 0.55 * gun);
  const motlar: React.ReactNode[] = [];
  if (Df > 0) {
    for (let i = 0; i < 90; i++) {
      const Z = Math.max(0.3, Zw - random(`zm${i}`) * Math.min(Df, Zw - 0.3));
      const ust = yb - (Zw - Z) * s.tan;
      if (ust <= 0.02) continue;
      const Y = (random(`zmy${i}`) * ust + tg * 0.02 * (0.5 + random(`zmv${i}`))) % ust;
      const X = camX - 1.5 + random(`zmx${i}`) * 3 + 0.03 * Math.sin(tg * 0.6 + i);
      const [x, y] = P(X, Y, Z);
      const gl = 0.5 + 0.5 * Math.sin(tg * (1.5 + random(`zmg${i}`) * 2) + i);
      motlar.push(<circle key={i} cx={x} cy={y} r={(0.0035 * FZ) / Z} fill="#fff0c8" opacity={0.7 * gl * s.sun} />);
    }
  }
  const grade = mixC([0.72, 1.14, 0.96], [1.06, 1.04, 1.02], Math.max(gun, 0.55 * bounce));
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden", isolation: "isolate" }}>
      <AbsoluteFill style={{ transformOrigin: "540px 760px", transform: `scale(${zz})`, filter: `saturate(${grade[0]}) contrast(${grade[1]}) brightness(${grade[2]})` }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <MiniDefs uid={uid} />
          <defs>
            {(["A", "B", "C", "D"] as const).map((k, i) => <pattern key={k} id={`${uid}tm${k}`} href={`#${uid}tm`} patternTransform={`translate(${(tg * 12) % 74} ${(tg * 30) % 50}) scale(${[1.6, 2.6, 4.0, 6.0][i]})`} />)}
            <filter id={`${uid}kor`} x="-30%" y="-30%" width="160%" height="160%"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.62  0 0 0 0 0.25  0 0 0 1 0" /><feGaussianBlur stdDeviation="2" /></filter>
            <linearGradient id={`${uid}dis`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe9b8" /><stop offset="0.6" stopColor="#ffc880" /><stop offset="1" stopColor="#e89a5a" /></linearGradient>
            <filter id={`${uid}uzak`}><feGaussianBlur stdDeviation="4" /></filter>
          </defs>
          {/* duvar, cam, kepenk (uzak, flu) */}
          <g filter={`url(#${uid}uzak)`}>
            <rect x={-200} y={-400} width={1500} height={wallY + 400} fill="#4a4e54" />
            <rect x={-200} y={gy0} width={1500} height={gy1 - gy0} fill={`url(#${uid}dis)`} />
            {/* aralıktan görünen dış: kaldırım, karşı yol */}
            <rect x={-200} y={gy1 - (gy1 - gy0) * 0.25} width={1500} height={(gy1 - gy0) * 0.25} fill="#d8a070" opacity={0.6} />
            {new Array(Math.max(0, Math.ceil((gy0 + 400) / 14))).fill(0).map((_, i) => <path key={i} d={`M -200 ${gy0 - 6 - i * 14} H 1300`} stroke="#2a2e32" strokeWidth={4} />)}
            <rect x={-200} y={gy0 - 14} width={1500} height={14} fill="#3a3e42" />
            <rect x={-200} y={gy1} width={1500} height={wallY - gy1} fill="#8a9298" />
            {[0, 300, 800, 1080].map((xx) => { const [vx] = P((xx - 540) / 290, 0, Zw); return <rect key={xx} x={vx - 6} y={-400} width={12} height={wallY + 400} fill="#9aa2a8" />; })}
          </g>
          {/* zemin: karolar */}
          <rect x={-200} y={wallY} width={1500} height={1920 - wallY + 200} fill="#cfd3d0" />
          {[0.3, 0.45, 0.65, 0.9, 1.25, 1.7, 2.3, 3.1, 4.2].map((Z) => (Z < Zw ? <path key={Z} d={`M -200 ${P(0, 0, Z)[1]} H 1300`} stroke="#aab0ac" strokeWidth={Math.max(1.5, 6 / Z)} /> : null))}
          {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6].map((X) => <path key={X} d={`M ${P(camX + X, 0, 0.15)[0]} ${P(0, 0, 0.15)[1]} L ${P(camX + X, 0, Zw)[0]} ${wallY}`} stroke="#aab0ac" strokeWidth={3} />)}
          {hali}
          {bocek.filter((b) => b.Z > eZ).map((b) => b.el)}
          <ZerreKatman z={zerreler.filter((q) => !q.parlak)} parlak={false} renk="#8a7a66" carp={0.8} />
          {eceVar ? <g>{ayak(-1)}{ayak(1)}</g> : null}
          {ayakBocek}
          {bocek.filter((b) => b.Z <= eZ).map((b) => b.el)}
        </svg>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", mixBlendMode: "multiply" }}>
          <defs>
            <filter id={`${uid}lb`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="7" /></filter>
            <radialGradient id={`${uid}rd`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={rgb([0.6 * red, 0.07 * red, 0.05 * red])} /><stop offset="1" stopColor="#000" /></radialGradient>
          </defs>
          <g filter={`url(#${uid}lb)`}>
            <rect x={-1200} y={-1200} width={3480} height={4320} fill={rgb(ambB)} />
            {red > 0.01 ? <ellipse cx={540} cy={200} rx={1300} ry={1400} fill={`url(#${uid}rd)`} style={{ mixBlendMode: "screen" }} /> : null}
            {yamaD ? <path d={yamaD} fill={rgb(sunC)} style={{ mixBlendMode: "screen" }} /> : null}
            {eceVar && eceUst > 0 && Df > 0 ? <rect x={P(eX - 0.4, 0, eZ)[0]} y={bandY} width={(0.8 * FZ) / eZ} height={Math.max(0, ayakY + 40 - bandY)} fill={rgb(sunC.map((v) => v * 0.85))} style={{ mixBlendMode: "screen" }} /> : null}
            {golgeD ? <path d={golgeD} fill={rgb(ambB)} /> : null}
            {s.k > 0.001 ? <rect x={-300} y={gy0} width={1700} height={gy1 - gy0} fill="#fff" /> : null}
          </g>
        </svg>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", mixBlendMode: "screen" }}>
          <defs>
            <filter id={`${uid}gb`}><feGaussianBlur stdDeviation="22" /></filter>
            <filter id={`${uid}gb2`}><feGaussianBlur stdDeviation="3" /></filter>
            <linearGradient id={`${uid}hz`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd890" /><stop offset="1" stopColor="#ff9a50" stopOpacity={0.15} /></linearGradient>
          </defs>
          {Df > 0 ? (
            <g opacity={hzOp}>
              <path d={poly([[-300, gy0], [1400, gy0], [1400, gy1], P(camX + 4, 0, Math.max(0.08, Zf)), P(camX - 4, 0, Math.max(0.08, Zf)), [-300, gy1]])} fill={`url(#${uid}hz)`} filter={`url(#${uid}gb)`} />
            </g>
          ) : null}
          {s.k > 0.001 ? <rect x={-300} y={gy0 - 30} width={1700} height={gy1 - gy0 + 60} fill="#ffcf80" opacity={0.55 * s.sun * (1 - 0.6 * gun)} filter={`url(#${uid}gb)`} /> : null}
          {motlar}
          <g filter={`url(#${uid}gb2)`}>{ember}</g>
          <ZerreKatman z={zerreler.filter((q) => q.parlak)} parlak renk="#ffe6a8" carp={0.95} />
        </svg>
      </AbsoluteFill>
      <Siyah o={p.acilis ? 1 - sstep(p.t0 ?? 0, (p.t0 ?? 0) + p.acilis, tg) : 0} />
    </AbsoluteFill>
  );
};

/* =====================================================================================
 *  B6_DIŞ: dışarıdan. Kamera karşı kaldırımda; sokağın ucunda ufuk, güneş ucunu gösterir (soldan sıcak, yatay ışık).
 *  Sağda marketin cephesi (perspektif; tabela "CAN MARKET 7/24"), üç kepenk birlikte kalkar; aralıktan içerideki
 *  ışık yaması ve kararan böcek seli görünür.
 *  prm: t0, ac [[t,k]], acGecik, gunesY [[t,v]], gun [[t,v]], cam [[t,cx,cy,z]], eceIcerde (bool)
 * ===================================================================================== */
/** dikdörtgeni (0,0)-(w,h) dörtgene eşleyen CSS matrix3d (izdüşümsel) — köşeler: sol üst, sağ üst, sağ alt, sol alt */
const quad3d = (w: number, h: number, q: V2[]) => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, hh = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, ff = y0;
  return `matrix3d(${[a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, ff, 0, 1].map((v) => v.toFixed(8)).join(",")})`;
};
const B6Dis: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = prm(text);
  const tg = f / fps + (p.t0 ?? 0);
  const uid = "b6d";
  const k = kf1(p.ac, tg, 0);
  const gunesY = kf1(p.gunesY, tg, 0);
  const gun = kf1(p.gun, tg, 0);
  const [cx, cy, z] = kf(p.cam, tg, [540, 960, 1]);
  const vx = 300, vy = 1010, FD = 1100, CH = 1.5;
  const P = (X: number, Y: number, Z: number): V2 => [vx + (X * FD) / Z, vy - ((Y - CH) * FD) / Z];
  const FX = 2.5, Z0 = 4.0, Z1 = 10.0; // cephe düzlemi
  const ac = p.acGecik ?? [0.0, 0.06, 0.03];
  const kAc = (i: number) => Math.max(0, Math.min(1, (k - ac[i]) / Math.max(0.2, 1 - ac[i])));
  // cephe içeriği: 1200 × 660 (6 m × 3,3 m); u=0 uzak uç, u=1200 yakın uç
  const W = 1200, Hh = 660;
  const q = [P(FX, 3.3, Z1), P(FX, 3.3, Z0), P(FX, 0, Z0), P(FX, 0, Z1)];
  const sunX = vx - 40, sunY = vy + 6 - 80 * gunesY - 200 * gun;
  const gk = [mixC([0.25, 0.31, 0.55], [0.45, 0.65, 0.86], gun), mixC([0.88, 0.56, 0.5], [0.66, 0.8, 0.9], gun), mixC([1, 0.76, 0.46], [0.93, 0.94, 0.9], gun)];
  const bays: [number, number][] = [[0, 360], [360, 840], [840, 1200]];
  const kepTop = 96, kepBot = 640;
  const sicak = 1 - 0.5 * gun;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: camT(cx, cy, z) }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id={`${uid}gok`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={rgb(gk[0])} /><stop offset="0.62" stopColor={rgb(gk[1])} /><stop offset="1" stopColor={rgb(gk[2])} /></linearGradient>
            <radialGradient id={`${uid}gn`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff6d8" stopOpacity={1} /><stop offset="0.22" stopColor="#ffd890" stopOpacity={0.6} /><stop offset="1" stopColor="#ff9a50" stopOpacity={0} /></radialGradient>
            <linearGradient id={`${uid}yol`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff0c0" stopOpacity={0.95} /><stop offset="1" stopColor="#ffb060" stopOpacity={0.1} /></linearGradient>
            <clipPath id={`${uid}uf`}><rect x={-200} y={-2000} width={1500} height={vy + 2000} /></clipPath>
          </defs>
          <rect x={-300} y={-300} width={1700} height={2600} fill={`url(#${uid}gok)`} />
          <circle cx={sunX} cy={sunY} r={520} fill={`url(#${uid}gn)`} opacity={0.95 - 0.4 * gun} />
          <g clipPath={`url(#${uid}uf)`}>
            <circle cx={sunX} cy={sunY} r={58} fill="#fff6d8" />
          </g>
          {/* ufukta uzak siluet (kubbe, minare, çatılar) */}
          <path d={`M -200 ${vy} L -200 ${vy - 30} L 40 ${vy - 30} L 40 ${vy - 44} L 120 ${vy - 44} L 120 ${vy - 22} L 180 ${vy - 22} Q 215 ${vy - 62} 250 ${vy - 22} L 262 ${vy - 22} L 262 ${vy - 88} L 266 ${vy - 104} L 270 ${vy - 88} L 270 ${vy - 16} L 200 ${vy} Z`} fill={rgb(mixC([0.55, 0.42, 0.5], gk[2], 0.45))} />
          <path d={`M 360 ${vy} L 360 ${vy - 18} L 420 ${vy - 18} L 420 ${vy - 34} L 520 ${vy - 34} L 520 ${vy} Z`} fill={rgb(mixC([0.5, 0.4, 0.48], gk[2], 0.4))} />
          {/* sol sıra binalar (X = -5,5), gölgede, çatı kenarlarında sıcak ışık */}
          {[[3, 9, 16], [9, 15, 11], [15, 24, 19], [24, 40, 9], [40, 70, 14]].map(([za, zb, hb], i) => {
            const pts = [P(-5.5, 0, za), P(-5.5, hb, za), P(-5.5, hb, zb), P(-5.5, 0, zb)];
            return (
              <g key={i}>
                <path d={poly(pts)} fill={rgb(mixC([0.33 + 0.03 * (i % 2), 0.27, 0.36], [0.55, 0.55, 0.6], gun))} />
                <path d={`M ${pts[1][0]} ${pts[1][1]} L ${pts[2][0]} ${pts[2][1]}`} stroke="#ffd6a0" strokeWidth={4} opacity={0.75 * sicak} />
                {new Array(Math.floor((zb - za) / 2.2)).fill(0).map((_, j) => {
                  const zz1 = za + 0.6 + j * 2.2, zz2 = zz1 + 1.1;
                  return [2, 5.2, 8.4, 11.6].filter((y) => y + 1.6 < hb).map((y) => <path key={`${j}-${y}`} d={poly([P(-5.5, y, zz1), P(-5.5, y + 1.5, zz1), P(-5.5, y + 1.5, zz2), P(-5.5, y, zz2)])} fill={rgb(mixC([0.22, 0.2, 0.28], [0.42, 0.5, 0.58], gun))} />);
                })}
              </g>
            );
          })}
          {/* yol, kaldırımlar */}
          <path d={poly([P(-5.5, 0, 1.2), P(1.1, 0, 1.2), P(1.1, 0, 90), P(-5.5, 0, 90)])} fill={rgb(mixC([0.22, 0.2, 0.25], [0.38, 0.38, 0.4], gun))} />
          <path d={poly([P(-3.6, 0, 90), P(-0.6, 0, 90), P(-0.2, 0, 1.4), P(-5.2, 0, 1.4)])} fill={`url(#${uid}yol)`} opacity={0.7 - 0.35 * gun} />
          {[2, 2.6, 3.4, 4.6, 6.5, 10].map((Zr, i) => { const [a] = P(-3.2 + Math.sin(tg + i) * 0.1, 0, Zr), [b, y] = P(-0.8, 0, Zr); return <path key={i} d={`M ${a} ${y} L ${b} ${y}`} stroke="#fff4d0" strokeWidth={Math.max(1.5, 8 / Zr)} opacity={0.45 - 0.2 * gun} />; })}
          <path d={poly([P(1.1, 0.14, 1.2), P(FX, 0.14, 1.2), P(FX, 0.14, 90), P(1.1, 0.14, 90)])} fill={rgb(mixC([0.78, 0.6, 0.45], [0.78, 0.76, 0.7], gun))} />
          <path d={poly([P(1.1, 0, 1.2), P(1.1, 0.14, 1.2), P(1.1, 0.14, 90), P(1.1, 0, 90)])} fill={rgb(mixC([0.55, 0.44, 0.38], [0.62, 0.6, 0.56], gun))} />
          <path d={poly([P(-5.5, 0.14, 1.2), P(-4.3, 0.14, 1.2), P(-4.3, 0.14, 90), P(-5.5, 0.14, 90)])} fill={rgb(mixC([0.4, 0.33, 0.38], [0.6, 0.58, 0.56], gun))} />
          {/* kaldırımda lamba direği ve bize uzanan uzun gölgesi */}
          {(() => {
            const [a, b] = P(1.4, 0.14, 7), [c, d] = P(1.4, 4.2, 7);
            const [g1, g2] = P(1.9, 0.14, 2.2);
            return (
              <g>
                <path d={`M ${a - 4} ${b} L ${a + 4} ${b} L ${g1 + 14} ${g2} L ${g1 - 14} ${g2} Z`} fill="#2a1a20" opacity={0.35 * sicak} />
                <rect x={a - 6} y={d} width={12} height={b - d} fill="#2a2430" />
                <path d={`M ${c} ${d} q 40 -24 80 -8`} stroke="#2a2430" strokeWidth={9} fill="none" />
              </g>
            );
          })()}
          {/* cephenin üst katları (yakın uçtan uzağa), kaldırıma düşen kepenk aralığı ışığı */}
          <path d={poly([P(FX, 3.3, 1.2), P(FX, 16, 1.2), P(FX, 16, 30), P(FX, 3.3, 30)])} fill={rgb(mixC([0.62, 0.48, 0.42], [0.82, 0.76, 0.66], gun))} />
          {[4.4, 7.6, 10.8, 14].map((Y, j) => [1.6, 4.6, 7.4, 11.2, 14.6, 19].map((Zw2, i) => <path key={`${j}-${i}`} d={poly([P(FX, Y, Zw2), P(FX, Y + 1.6, Zw2), P(FX, Y + 1.6, Zw2 + 1.2), P(FX, Y, Zw2 + 1.2)])} fill={rgb(mixC([0.24, 0.22, 0.3], [0.45, 0.55, 0.65], gun))} stroke="#3a2a28" strokeWidth={3} />))}
          <path d={poly([P(FX, 0, 1.2), P(FX, 3.3, 1.2), P(FX, 3.3, Z0), P(FX, 0, Z0)])} fill={rgb(mixC([0.6, 0.46, 0.4], [0.8, 0.74, 0.64], gun))} />
          <path d={poly([P(FX, 0, Z1), P(FX, 3.3, Z1), P(FX, 3.3, 30), P(FX, 0, 30)])} fill={rgb(mixC([0.6, 0.46, 0.4], [0.8, 0.74, 0.64], gun))} />
          {/* aralıktan kaldırıma vuran yansıma (içerinin karanlığı / ışığı) */}
          {k > 0.01 ? <path d={poly([P(FX, 0.14, Z1), P(FX, 0.14, Z0), P(FX - 0.6 * k, 0.14, Z0 + 0.4), P(FX - 0.6 * k, 0.14, Z1 + 0.4)])} fill="#ffcf88" opacity={0.3 * sicak} /> : null}
        </svg>
        {/* cephe: izdüşümsel eşleme (tabela, kepenkler, içerisi) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: Hh, transformOrigin: "0 0", transform: quad3d(W, Hh, q) }}>
          <svg viewBox={`0 0 ${W} ${Hh}`} width={W} height={Hh} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id={`${uid}ic`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0a10" /><stop offset="0.75" stopColor="#1a1416" /><stop offset="1" stopColor="#6a4a30" /></linearGradient>
              <linearGradient id={`${uid}isik`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffd8a0" stopOpacity={0.55 * sicak} /><stop offset="1" stopColor="#ffd8a0" stopOpacity={0.05} /></linearGradient>
            </defs>
            <rect width={W} height={Hh} fill="#9a8a80" />
            {/* tabela */}
            <rect x={0} y={0} width={W} height={92} fill="#c23a22" stroke="#2a1410" strokeWidth={6} />
            <text x={W / 2} y={66} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={60} fill="#fff4ea" letterSpacing={4}>CAN MARKET 7/24</text>
            {/* vitrinler / kapı: içerisi karanlık; zeminde sıcak ışık yaması, kararan sel, toz pırıltısı */}
            {bays.map(([a, b], i) => {
              const kb = kAc(i);
              const ybb = kepBot - (kepBot - kepTop) * kb;
              return (
                <g key={i}>
                  <rect x={a + 10} y={kepTop} width={b - a - 20} height={kepBot - kepTop} fill={`url(#${uid}ic)`} />
                  {i === 1 ? <text x={(a + b) / 2} y={kepTop + 60} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={34} fill="#ff3a24" opacity={0.85}>{basamak<string>(p.saat, tg, "07:24")}</text> : null}
                  {kb > 0.02 ? <path d={`M ${a + 10} ${kepBot} L ${b - 10} ${kepBot} L ${b - 10 - 30} ${kepBot - 40 * kb} L ${a + 10 + 50} ${kepBot - 40 * kb} Z`} fill="#ffcf88" opacity={0.5 * sicak} /> : null}
                  {kb > 0.02 ? new Array(9).fill(0).map((_, j) => {
                    const x = a + 30 + ((j * 97 + i * 31) % (b - a - 60));
                    const yy = kepBot - 8 - ((j * 13) % 26) - ((tg * 20 + j * 7) % 40);
                    return <circle key={j} cx={x} cy={yy} r={2.5} fill="#ffe6a8" opacity={0.7 * Math.abs(Math.sin(tg * 2 + j))} />;
                  }) : null}
                  {i === 1 && p.eceIcerde && kb > 0.1 ? (
                    <g>
                      <rect x={(a + b) / 2 - 26} y={kepBot - 150} width={20} height={130} fill="#22304e" />
                      <rect x={(a + b) / 2 + 6} y={kepBot - 150} width={20} height={130} fill="#22304e" />
                      <ellipse cx={(a + b) / 2 - 16} cy={kepBot - 18} rx={16} ry={9} fill="#e8e8e8" />
                      <ellipse cx={(a + b) / 2 + 16} cy={kepBot - 18} rx={16} ry={9} fill="#e8e8e8" />
                    </g>
                  ) : null}
                  {/* kepenk */}
                  <g>
                    <clipPath id={`${uid}kc${i}`}><rect x={a} y={kepTop - 10} width={b - a} height={ybb - kepTop + 10} /></clipPath>
                    <g clipPath={`url(#${uid}kc${i})`}>
                      <rect x={a} y={kepTop - 10} width={b - a} height={kepBot - kepTop + 20} fill="#7a8086" />
                      {new Array(40).fill(0).map((_, j) => <path key={j} d={`M ${a} ${ybb - 4 - j * 14} H ${b}`} stroke="#4a5056" strokeWidth={3} />)}
                      {new Array(40).fill(0).map((_, j) => <path key={`h${j}`} d={`M ${a} ${ybb - 10 - j * 14} H ${b}`} stroke="#c8ced4" strokeWidth={2} opacity={0.55} />)}
                      <rect x={a} y={ybb - 16} width={b - a} height={16} fill="#3a3e42" />
                    </g>
                  </g>
                  <rect x={a} y={kepTop - 8} width={b - a} height={14} fill="#4a4e54" />
                  <rect x={a - 6} y={kepTop - 8} width={12} height={Hh - kepTop + 8} fill="#6a6e74" />
                </g>
              );
            })}
            <rect x={W - 6} y={kepTop - 8} width={12} height={Hh - kepTop + 8} fill="#6a6e74" />
            {/* sıcak yatay ışık: uzak uçtan (güneşe yakın) yakına doğru sönümlenir; alt kenarda sıcak sıyırma */}
            <rect width={W} height={Hh} fill={`url(#${uid}isik)`} style={{ mixBlendMode: "screen" }} />
            <rect x={0} y={Hh - 20} width={W} height={20} fill="#5a4a40" />
          </svg>
        </div>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", mixBlendMode: "screen", pointerEvents: "none" }}>
          <defs><filter id={`${uid}gb`}><feGaussianBlur stdDeviation="30" /></filter></defs>
          <ellipse cx={sunX} cy={vy - 10} rx={420} ry={90} fill="#ffb870" opacity={0.45 * sicak} filter={`url(#${uid}gb)`} />
          <circle cx={sunX} cy={sunY} r={110} fill="#fff0c8" opacity={0.55 * sicak} filter={`url(#${uid}gb)`} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 40% 50%, rgba(0,0,0,0) 55%, rgba(20,8,20,0.45) 100%)" }} />
      <Siyah o={p.acilis ? 1 - sstep(p.t0 ?? 0, (p.t0 ?? 0) + p.acilis, tg) : 0} />
    </AbsoluteFill>
  );
};

export const Insert13: React.FC<{ kind: Insert13Kind; dur: number; text?: string[] }> = ({ kind, text }) => {
  switch (kind) {
    case "b6_kapi": return <B6Kapi text={text} />;
    case "b6_zemin": return <B6Zemin text={text} />;
    case "b6_dis": return <B6Dis text={text} />;
    default: return null;
  }
};

/** tek çekim denetimi için kompozisyon */
export const B6P1Kare: React.FC<{ kind: Insert13Kind; text?: string[] }> = ({ kind, text }) => {
  const { durationInFrames, fps } = useVideoConfig();
  return <Insert13 kind={kind} dur={durationInFrames / fps} text={text} />;
};
