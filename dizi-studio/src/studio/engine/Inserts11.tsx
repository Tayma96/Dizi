/* 7/24 Bölüm 5 eklemeleri: omuz_el, donusum_yuz, donusum_govde, bocek_dev, bocek_yakin, ece_yakin, ece_sirt, sabri_omuz. */
import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";
import type { Emotion } from "../rig/types";
import { Market724BG } from "../sets/market724";
import { Anten, BocekKafa, DevBocek, K, PronotumArka, PronotumSiper, clamp01, kapsul, sstep, yay } from "./bocek";
import { Bas25D, Govde25D } from "../rig/head25d";

export type Insert11Kind = "omuz_el" | "donusum_yuz" | "donusum_govde" | "bocek_dev" | "bocek_yakin" | "ece_yakin" | "ece_sirt" | "sabri_omuz" | "bocek_golge";
export const INSERT11_KINDS: Insert11Kind[] = ["omuz_el", "donusum_yuz", "donusum_govde", "bocek_dev", "bocek_yakin", "ece_yakin", "ece_sirt", "sabri_omuz", "bocek_golge"];

/** Kontrol: dev böcek (açık / yarı açık / katlı) + kafa yakın */
export const BocekSheet: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  return (
    <AbsoluteFill style={{ backgroundColor: "#cfd4d8" }}>
      <svg viewBox="0 0 3200 1500" width="100%" height="100%">
        {[1, 0.5, 0].map((a, i) => (
          <g key={i} transform={`translate(${420 + i * 820} 1380) scale(1.15)`}>
            <DevBocek t={t} acil={a} kanat={a * 0.6} mand={0.4} anten={a * 620 + 60} kalinti={i === 0 ? 1 : 0} uid={`s${i}`} />
          </g>
        ))}
        <g transform="translate(2800 620) scale(2.4)">
          <BocekKafa t={t} mand={0.7} anten={260} salya={1} uid="sk" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* =====================================================================================
 *  ORTAK: yüz parçaları (soyulma), lifler, damlalar
 * ===================================================================================== */
type Pt = [number, number];
/** yüz koordinatı (rig Head çizimi) → rig svg birimi (yaşlı: sy 0.97 + zemin kayması) */
const FY = (y: number) => 300 + (y - 300) * 0.97 + 20.4;
const HP = (p: Pt): Pt => [p[0], FY(p[1])];

const C_LINE: Pt[] = [[200, 50], [206, 78], [195, 102], [205, 128], [197, 152], [206, 174], [200, 200]];
const LH: Pt[] = [[200, 200], [186, 212], [172, 206], [160, 219], [146, 212], [132, 223], [116, 214], [98, 227], [56, 226]];
const RH: Pt[] = [[200, 200], [214, 210], [228, 204], [242, 219], [256, 210], [270, 223], [286, 214], [302, 229], [344, 228]];
const LJ: Pt[] = [[172, 206], [167, 232], [179, 250], [165, 269], [177, 290], [169, 307], [178, 324]];
const RJ: Pt[] = [[228, 204], [235, 231], [221, 251], [237, 272], [225, 292], [233, 309], [224, 324]];
const rev = (a: Pt[]) => a.slice().reverse();

type Parca = {
  id: string;
  poly: Pt[];
  /** yırtık kenarlar (lif ve çatlak çizgileri) */
  yirtik: Pt[][];
  hinge: Pt;
  /** katlanma ekseni: x = yana açılır (scaleX), y = aşağı sarkar (scaleY) */
  eksen: "x" | "y";
  yon: 1 | -1;
  /** soyulma başlangıcı ve süresi (sn), kopma anı */
  t0: number;
  sure: number;
  kop: number;
  /** damlalar: [x, y, uzunluk, genişlik, başlangıç] (yüz koordinatı) */
  damla: [number, number, number, number, number][];
};

const PARCALAR: Parca[] = [
  { id: "ul", poly: [[56, 46], ...C_LINE, ...LH.slice(1)], yirtik: [C_LINE, LH], hinge: [92, 150], eksen: "x", yon: -1, t0: 2.5, sure: 0.75, kop: 3.05, damla: [[150, 214, 70, 13, 0.75]] },
  { id: "ur", poly: [[200, 50], [344, 46], [344, 228], ...rev(RH).slice(1, -1), ...rev(C_LINE)], yirtik: [C_LINE, RH], hinge: [308, 150], eksen: "x", yon: 1, t0: 2.62, sure: 0.75, kop: 3.2, damla: [[246, 216, 84, 14, 0.85], [278, 172, 46, 10, 1.15]] },
  { id: "j", poly: [[172, 206], ...rev(LH.slice(0, 3)).slice(1), ...RH.slice(1, 3), ...RJ.slice(1), ...rev(LJ).slice(0, -1)], yirtik: [LH.slice(0, 3), RH.slice(0, 3), LJ, RJ], hinge: [200, 322], eksen: "y", yon: 1, t0: 2.2, sure: 0.5, kop: 2.6, damla: [[206, 244, 56, 10, 0.95]] },
  { id: "ll", poly: [[56, 226], ...rev(LH).slice(1, 7), ...LJ.slice(1), [56, 324]], yirtik: [LH.slice(2), LJ], hinge: [104, 280], eksen: "x", yon: -1, t0: 2.85, sure: 0.7, kop: 3.4, damla: [[136, 266, 60, 12, 1.05]] },
  { id: "lr", poly: [[228, 204], ...RH.slice(3), [344, 324], ...rev(RJ).slice(0, -1)], yirtik: [RH.slice(2), RJ], hinge: [296, 280], eksen: "x", yon: 1, t0: 2.98, sure: 0.7, kop: 3.55, damla: [[264, 258, 52, 11, 1.25]] },
];

type Mat = [number, number, number, number, number, number];
const app = (m: Mat, p: Pt): Pt => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
/** menteşe etrafında katlanma (ölçek) + dönüş + düşme ötelemesi; rig svg biriminde */
const parcaMat = (pc: Parca, t: number): { m: Mat; ters: boolean; a: number } => {
  const u = clamp01((t - pc.t0) / pc.sure);
  const e = u * u * (3 - 2 * u);
  // katlanma: 0 → 150° (alt yüz görünür), yaylı sarsıntıyla
  const phi = (e * 108 + Math.sin(u * Math.PI * 3) * 6 * (1 - u)) * (Math.PI / 180);
  const fold = Math.cos(phi);
  const kt = Math.max(0, t - pc.kop);
  const rot = pc.yon * (e * 18 + kt * kt * 90) * (pc.eksen === "y" ? 0.3 : 1);
  const dropY = 0.5 * 2600 * kt * kt; // yerçekimi (birim/sn²)
  const dropX = pc.yon * kt * 160;
  const sx = pc.eksen === "x" ? fold : 1 + 0.04 * Math.sin(u * Math.PI);
  const sy = pc.eksen === "y" ? fold : 1 - 0.06 * e;
  const h = HP(pc.hinge);
  const r = (rot * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  const a = c * sx, b = s * sx, cc = -s * sy, d = c * sy;
  const ex = h[0] + dropX - (a * h[0] + cc * h[1]);
  const fy = h[1] + dropY - (b * h[0] + d * h[1]);
  return { m: [a, b, cc, d, ex, fy], ters: (pc.eksen === "x" ? sx : sy) < 0, a: kt > 0.5 ? Math.max(0, 1 - (kt - 0.5) * 3) : 1 };
};

/** Simbiyot lifi (B3 KopukEl liflerinin kalın, ıslak siyah-kırmızı dili): iki ucu bağlı gerilir, incelir;
 *  parça tarafında deri şeridi çeker; eşikte kopar: kafa tarafı anında geri çekilir, parça tarafı parçaya bağlı sallanır. */
const Lif: React.FC<{ a: Pt; b: Pt; b0: Pt; maxL: number; w: number; t: number; seed: number; ten?: string }> = ({ a, b, b0, maxL, w, t, seed, ten = "#b07a58" }) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const L0 = Math.max(4, Math.hypot(b0[0] - a[0], b0[1] - a[1]));
  if (L < 2) return null;
  const col = seed % 3 === 0 ? K.lif2 : seed % 2 ? K.lif : "#8a2a30";
  const dx = (b[0] - a[0]) / L, dy = (b[1] - a[1]) / L;
  if (L <= maxL) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const gerg = L / maxL;
    const wob = Math.sin(t * 9 + seed) * 4 * (1 - gerg);
    const sag = 0.16 * L * (1 - 0.6 * gerg);
    const ww = Math.max(1.6, w * Math.sqrt(L0 / Math.max(L0, L)) * (1 - 0.35 * gerg));
    const d = `M ${a[0]} ${a[1]} Q ${mx - dy * wob} ${my + dx * wob + sag} ${b[0]} ${b[1]}`;
    // parça ucundan sökülen deri şeridi
    const sk = Math.min(0.35, 18 / L);
    const sx = b[0] - (b[0] - a[0]) * sk, sy = b[1] - (b[1] - a[1]) * sk + sag * 0.3;
    return (
      <g strokeLinecap="round" fill="none">
        <path d={d} stroke="#120406" strokeWidth={ww + 2.2} />
        <path d={d} stroke={col} strokeWidth={ww} />
        <path d={d} stroke="#e88080" strokeWidth={ww * 0.25} opacity={0.45} />
        <path d={`M ${b[0]} ${b[1]} L ${sx} ${sy}`} stroke={ten} strokeWidth={ww * 1.5} opacity={0.9} />
        <path d={`M ${b[0]} ${b[1]} L ${sx} ${sy}`} stroke="#2a1410" strokeWidth={1.2} opacity={0.6} />
      </g>
    );
  }
  // koptu: kafa ucu hızla geri çekilir (söner); parça ucu parçaya bağlı kıvrılır
  const over = (L - maxL) / 50;
  const r = Math.max(10, 0.32 * maxL * Math.exp(-over * 0.4));
  const curl = 0.8 + 0.6 * Math.sin(seed);
  const ucB: Pt = [b[0] - dx * r * 0.6 + dy * r * 0.35 * curl, b[1] - dy * r * 0.6 + r * 0.7];
  const kafaA = Math.max(0, 1 - over * 2.5);
  const ucA: Pt = [a[0] + dx * r * 0.35 * kafaA, a[1] + dy * r * 0.35 * kafaA + 4];
  return (
    <g fill="none" strokeLinecap="round">
      {kafaA > 0 ? <path d={`M ${a[0]} ${a[1]} L ${ucA[0]} ${ucA[1]}`} stroke={col} strokeWidth={w * 0.9} opacity={kafaA} /> : null}
      <path d={`M ${b[0]} ${b[1]} Q ${b[0] - dx * r * 0.4} ${b[1] + r * 0.3} ${ucB[0]} ${ucB[1]}`} stroke="#120406" strokeWidth={w * 0.8 + 2} />
      <path d={`M ${b[0]} ${b[1]} Q ${b[0] - dx * r * 0.4} ${b[1] + r * 0.3} ${ucB[0]} ${ucB[1]}`} stroke={col} strokeWidth={w * 0.8} />
    </g>
  );
};

/** Eriyen deri damlası: kökte geniş, dalgalı kenarlı, boyunda incelir, uçta ağır damla (yüz koordinatı) */
const Damla: React.FC<{ x: number; y: number; L: number; w: number; renk: string; t: number; seed: number }> = ({ x, y, L, w, renk, t, seed }) => {
  if (L < 2) return null;
  const y0 = FY(y);
  const q = (k: number) => Math.sin(seed * 1.7 + k * 5.3 + t * 1.5) * w * 0.12;
  const neck = w * 0.42, bulb = w * (0.42 + 0.2 * Math.min(1, L / 70));
  const yb = y0 + L;
  const d = `M ${x - w * 1.25} ${y0 - 6} C ${x - w * 0.9 + q(1)} ${y0 + L * 0.25} ${x - neck + q(2)} ${y0 + L * 0.55} ${x - neck * 0.9} ${yb - bulb * 0.6} C ${x - bulb * 1.15} ${yb - bulb * 0.2} ${x - bulb} ${yb + bulb} ${x} ${yb + bulb} C ${x + bulb} ${yb + bulb} ${x + bulb * 1.15} ${yb - bulb * 0.2} ${x + neck * 0.9} ${yb - bulb * 0.6} C ${x + neck + q(3)} ${y0 + L * 0.55} ${x + w * 0.9 + q(4)} ${y0 + L * 0.25} ${x + w * 1.25} ${y0 - 6} Z`;
  const k = (t * 0.9 + seed * 0.37) % 1;
  return (
    <g>
      <path d={d} fill={renk} />
      {/* kontur yalnız yanlarda ve uçta: kök yüzle kaynaşır */}
      <path d={d.replace(/^M [^C]+/, (m) => m).split(" Z")[0]} fill="none" stroke={OUTR} strokeWidth={3.2} strokeLinejoin="round" strokeDasharray={`0 ${w * 1.4} 4000`} />
      <path d={`M ${x - w * 0.5} ${y0 + 2} Q ${x - neck * 0.6} ${y0 + L * 0.5} ${x - neck * 0.4} ${yb - bulb}`} stroke="#fff2e0" strokeWidth={Math.max(1.4, w * 0.18)} fill="none" opacity={0.5} strokeLinecap="round" />
      <ellipse cx={x - bulb * 0.35} cy={yb + bulb * 0.3} rx={bulb * 0.22} ry={bulb * 0.3} fill="#fff2e0" opacity={0.6} />
      {L > 45 ? <ellipse cx={x} cy={yb + bulb + 10 + 700 * k * k} rx={bulb * 0.55} ry={bulb * 0.7} fill={renk} stroke={OUTR} strokeWidth={2.5} opacity={k < 0.55 ? 1 : 0} /> : null}
    </g>
  );
};
/** çenenin altından sarkan erimiş deri perdesi (dalgalı alt kenar, üç damla lobu) */
const Perde: React.FC<{ S: number; renk: string; t: number }> = ({ S, renk, t }) => {
  if (S < 1) return null;
  const y0 = FY(292);
  const lob = (x: number, k: number) => `${x - 14} ${y0 + S * k} Q ${x} ${y0 + S * k * 1.35 + 10} ${x + 14} ${y0 + S * k}`;
  const w = Math.sin(t * 2) * 3;
  const d = `M 140 ${y0 - 20} Q 170 ${y0 + 10} 200 ${y0 + 12} Q 230 ${y0 + 10} 262 ${y0 - 20} Q 258 ${y0 + S * 0.5} 246 ${y0 + S * 0.55 + w} L ${lob(232, 0.75)} Q 214 ${y0 + S * 0.55} 210 ${y0 + S * 0.7} L ${lob(196, 1)} Q 180 ${y0 + S * 0.6} 172 ${y0 + S * 0.55} L ${lob(160, 0.62)} Q 142 ${y0 + S * 0.4} 140 ${y0 - 20} Z`;
  return (
    <g>
      <path d={d} fill={renk} stroke={OUTR} strokeWidth={3.2} strokeLinejoin="round" />
      <path d={`M 160 ${y0 + 4} Q 200 ${y0 + 20 + S * 0.2} 240 ${y0 + 4}`} stroke="#3a1a10" strokeWidth={3} fill="none" opacity={0.45} />
      <path d={`M 186 ${y0 + 14} Q 190 ${y0 + S * 0.5} 194 ${y0 + S * 0.85}`} stroke="#fff2e0" strokeWidth={2.4} fill="none" opacity={0.45} strokeLinecap="round" />
    </g>
  );
};
const OUTR = "#2b1d1a";

/* =====================================================================================
 *  ARKA PLAN: depo eşiği (kasa görünümünün ölçeklenmiş, flu hâli). (hx, hy): kasa görünümünde
 *  kadraj merkezine gelecek nokta; z: ölçek; turb: floresan titremesi
 * ===================================================================================== */
const DepoArka: React.FC<{ f: number; hx: number; hy: number; z: number; sx?: number; sy?: number; blur?: number; turb?: number; uid: string }> = ({ f, hx, hy, z, sx = 540, sy = 960, blur = 9, turb = 0, uid }) => (
  <g>
    <defs><filter id={`da${uid}`}><feGaussianBlur stdDeviation={blur} /></filter></defs>
    <g filter={blur > 0 ? `url(#da${uid})` : undefined} transform={`translate(${sx} ${sy}) scale(${z}) translate(${-hx} ${-hy})`}>
      <rect x={-900} y={-900} width={2900} height={1020} fill="#e2e5e6" />
      {[-700, -420, -140].map((y) => <path key={y} d={`M -900 ${y} H 2000`} stroke="#c8ced2" strokeWidth={4} />)}
      <rect x={-900} y={120} width={2900} height={1800} fill="#d4d8da" />
      <Market724BG view="kasa" frame={f} doorOpen={0} saat="06:03" iz={0} turb={turb} depoAcik={1} />
      {/* kasa görünümünün sağ dışı (depo kapısının ötesi): duvar devamı, tavan, zemin */}
      <rect x={1092} y={0} width={900} height={1920} fill="#cfd4d6" />
      <rect x={1092} y={0} width={900} height={120} fill="#e6e9ea" />
      <rect x={1180} y={50} width={520} height={40} rx={6} fill="#ffffff" />
      <rect x={1092} y={1330} width={900} height={600} fill="#b8bdbe" />
      <rect x={1240} y={700} width={90} height={150} rx={10} fill="#c83a2a" stroke="#2a1410" strokeWidth={5} />
      <rect x={1262} y={672} width={46} height={34} rx={6} fill="#2a2a2a" />
      <rect x={1092} y={0} width={900} height={1920} fill="#000" opacity={0.18} />
    </g>
  </g>
);

/* =====================================================================================
 *  DONUSUM_YUZ: sahte Sabri'nin yüzü yanmış maske gibi erir, çatlar, deri parça parça soyulur,
 *  altından parlak kitin böcek kafası çıkar; mandibulalar açılır, antenler kıvrılarak uzar.
 *  text[0]: zaman kayması (sn)
 * ===================================================================================== */
const DonusumYuz: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f0 = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kay = Number(text?.[0] || 0);
  const t = f0 / fps + kay;
  const f = f0 + Math.round(kay * fps);
  const sab = castById("sabri_sahte");
  // zaman eğrileri
  const erime = sstep(0.45, 2.1, t); // yer değiştirme şiddeti
  const yanik = sstep(0.6, 2.4, t);
  const akis = sstep(0.4, 2.2, t);
  const catlak = sstep(1.55, 2.25, t);
  const acil = sstep(2.15, 2.9, t); // böcek kafası görünür alanı
  const mand = sstep(2.9, 3.7, t) * 0.75 + sstep(3.95, 4.25, t) * 0.25;
  const anten = 560 * sstep(3.0, 4.3, t);
  // ışık: floresan titremesi (soyulma sırasında yoğun)
  const fl = random(`dy${Math.floor(f / 2)}`) < 0.1 + 0.25 * sstep(1.8, 2.4, t) * (1 - sstep(4.0, 4.4, t)) ? 0.55 : 1;
  // kamera: yakından çok yakına; çatlamada sarsıntı
  const z = 1 + 0.22 * sstep(0, 4.4, t);
  const sars = (sstep(2.15, 2.25, t) * (1 - sstep(2.25, 2.7, t)) + 0.6 * sstep(3.95, 4.0, t) * (1 - sstep(4.0, 4.4, t))) * 16;
  const shx = (random(`dsx${f}`) - 0.5) * sars, shy = (random(`dsy${f}`) - 0.5) * sars;
  // rig yerleşimi: rig svg birimi → ekran: translate(OX, OY) scale(sc)
  const sc = 3.25;
  const OX = 540 - 200 * sc, OY = 720 - FY(200) * sc;
  // yüz: gülüş donar, bir göz seğirir, baş hafif sarsılır
  const seg = t > 0.35 && t < 0.6 ? Math.sin(t * 90) * 0.12 : 0;
  const pose = {
    emotion: (t < 1.3 ? "sahteGulus" : "dehset") as Emotion,
    kirpmaz: true,
    mumParlak: 0.6 + 0.4 * sstep(0, 0.6, t),
    lookX: -0.15 + seg,
    lookY: 0.05,
    prop: "ambalaj" as const,
    armR: { upper: -4, fore: -78 },
    seed: 7,
    golgesiz: true,
  };
  const rig = <Character look={sab} size={1000} pose={pose} />;
  const uid = "dy";
  const yuzRenk = (k: number) => {
    // ten → yanık kahve
    const a = [0xd8, 0xa4, 0x7c], b = [0x46, 0x1a, 0x0e];
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;
  };
  // kabarcıklar (yanık)
  const kabarcik = new Array(14).fill(0).map((_, i) => {
    const x = 120 + random(`kx${i}`) * 160, y = 110 + random(`ky${i}`) * 190;
    const tb = 0.8 + random(`kt${i}`) * 1.2;
    const u = clamp01((t - tb) / 0.5);
    const patla = t > tb + 0.5 + random(`kp${i}`) * 0.4;
    return { x, y, r: (3 + random(`kr${i}`) * 6) * u, patla, on: u > 0 };
  });
  const parcaG = PARCALAR.map((pc) => ({ pc, ...parcaMat(pc, t) }));
  const kafaCx = 200, kafaCy = FY(205);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0b0d", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs>
          <filter id={`${uid}melt`} x="-30%" y="-30%" width="160%" height="190%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045 0.007" numOctaves={2} seed={4} result="n" />
            <feColorMatrix in="n" type="matrix" values="0.18 0 0 0 0.41  0 -0.5 0 0 0.5  0 0 0 0 0  0 0 0 0 1" result="m" />
            <feDisplacementMap in="SourceGraphic" in2="m" scale={95 * erime} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <clipPath id={`${uid}base`}><rect x={-200} y={FY(300)} width={800} height={1200} /></clipPath>
          {parcaG.map(({ pc }) => <clipPath key={pc.id} id={`${uid}c${pc.id}`}><path d={`${pc.poly.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${FY(p[1])}`).join(" ")} Z`} /></clipPath>)}
          <clipPath id={`${uid}kafa`}>
            <path d="M 114 150 Q 112 250 140 286 Q 170 312 200 312 Q 230 312 260 286 Q 288 250 286 150 Q 280 90 200 90 Q 120 90 114 150 Z" transform={`translate(0 ${FY(0)}) scale(1 0.97)`} />
            <circle cx={kafaCx} cy={kafaCy} r={20 + 420 * acil} />
          </clipPath>
          <clipPath id={`${uid}sil`}>
            <path d="M 114 150 Q 112 250 140 286 Q 170 312 200 312 Q 230 312 260 286 Q 288 250 286 150 Q 280 90 200 90 Q 120 90 114 150 Z" transform="translate(-12 17.4) scale(1.06 1.03)" />
            <ellipse cx={110} cy={FY(210)} rx={18} ry={26} />
            <ellipse cx={290} cy={FY(210)} rx={18} ry={26} />
          </clipPath>
          <filter id={`${uid}yanF`} x="-30%" y="-30%" width="160%" height="190%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045 0.007" numOctaves={2} seed={4} result="n" />
            <feColorMatrix in="n" type="matrix" values="0.18 0 0 0 0.41  0 -0.5 0 0 0.5  0 0 0 0 0  0 0 0 0 1" result="m" />
            <feDisplacementMap in="SourceGraphic" in2="m" scale={95 * erime} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feColorMatrix in="d" type="matrix" values="0.42 0.05 0 0 0.02  0.1 0.22 0 0 0  0.05 0 0.14 0 0  0 0 0 1 0" result="koyu" />
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={9} result="lek" />
            <feColorMatrix in="lek" type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.02  0 0 0 0 0.01  0 0 0 2.6 -1.2" result="lekA" />
            <feComposite in="lekA" in2="d" operator="in" result="lekB" />
            <feMorphology in="d" operator="erode" radius={9} result="ic" />
            <feComposite in="d" in2="ic" operator="out" result="kenar" />
            <feColorMatrix in="kenar" type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.01  0 0 0 0 0  0 0 0 0.9 0" result="kenarK" />
            <feMerge><feMergeNode in="koyu" /><feMergeNode in="lekB" /><feMergeNode in="kenarK" /></feMerge>
          </filter>
          <radialGradient id={`${uid}yan`} cx="0.5" cy="0.45" r="0.6"><stop offset="0.35" stopColor="#2a0e06" stopOpacity={0} /><stop offset="1" stopColor="#1a0804" stopOpacity={0.85} /></radialGradient>
          <radialGradient id={`${uid}vin`} cx="0.5" cy="0.42" r="0.75"><stop offset="0.45" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.78} /></radialGradient>
        </defs>
        <g transform={`translate(${540 + shx} ${760 + shy}) scale(${z}) translate(-540 -760)`}>
          <DepoArka f={f} hx={880} hy={660} z={3.6} sx={540} sy={720} blur={10} turb={0} uid={uid} />
          <g transform={`translate(${OX} ${OY}) scale(${sc})`}>
            {/* gövde (boyundan aşağısı), erir */}
            <g filter={`url(#${uid}melt)`} clipPath={`url(#${uid}base)`}>{rig}</g>
            {/* böcek kafası: deri açıldıkça görünür */}
            <g clipPath={`url(#${uid}kafa)`}>
              <g transform={`translate(${kafaCx} ${kafaCy + 10 * sstep(3.7, 4.2, t)}) rotate(${(4 * Math.sin(t * 2.3) + 3 * Math.sin(t * 5.1)) * sstep(3.4, 3.9, t)}) scale(${(0.93 + 0.05 * acil) * (1 + 0.06 * sstep(3.8, 4.3, t))})`}>
                <g transform="translate(0 770)"><PronotumArka uid={`${uid}p`} kk={sstep(2.7, 3.9, t)} isik={fl} /></g>
                <BocekKafa t={t} mand={mand} anten={anten} antenBuk={46} antenSal={1 + 0.8 * sstep(3.5, 4, t)} parlak={1} salya={sstep(3.1, 3.6, t)} isik={fl} uid={`${uid}k`} siper={0.5 * sstep(3.0, 3.8, t)} />
                <g transform="translate(0 770)"><PronotumSiper uid={`${uid}p`} kk={sstep(2.7, 3.9, t)} isik={fl} /></g>
              </g>
            </g>
            {/* lifler: deri parçasının yırtık kenarı ↔ kafa yüzeyi */}
            {parcaG.map(({ pc, m }) =>
              t < pc.t0 - 0.05 ? null : pc.yirtik.flatMap((line, li) =>
                line.filter((p, i) => i % 2 === 0 && p[0] > 92 && p[0] < 308).map((p, i) => {
                  const b0 = HP(p);
                  const a: Pt = [b0[0] + (kafaCx - b0[0]) * 0.07, b0[1] + (kafaCy - b0[1]) * 0.07];
                  const sd = li * 13 + i * 7 + pc.id.charCodeAt(0);
                  return <Lif key={`${pc.id}${li}${i}`} a={a} b={app(m, b0)} b0={b0} maxL={110 + random(`lm${sd}`) * 150} w={5.5 + random(`lw${sd}`) * 5} t={t} seed={sd} ten={yuzRenk(0.35 + 0.6 * yanik)} />;
                }),
              ),
            )}
            {/* deri parçaları */}
            {parcaG.map(({ pc, m, ters, a }) => (
              <g key={pc.id} transform={`matrix(${m.join(" ")})`} opacity={a}>
                <g clipPath={`url(#${uid}sil)`}>
                {ters ? (
                  // iç yüz: çiğ et, lifli
                  <g>
                    <path d={`${pc.poly.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${FY(p[1])}`).join(" ")} Z`} fill={K.et} stroke={yuzRenk(0.5)} strokeWidth={14} strokeLinejoin="round" />
                    <g clipPath={`url(#${uid}c${pc.id})`}>
                      {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${60 + i * 34} ${FY(40)} q 14 ${140} -6 ${300}`} stroke="#5a0e14" strokeWidth={5} fill="none" opacity={0.6} />)}
                      <rect x={0} y={0} width={400} height={400} fill="#000" opacity={0.25} />
                    </g>
                  </g>
                ) : (
                  <g clipPath={`url(#${uid}c${pc.id})`}>
                    <g filter={`url(#${uid}melt)`}>{rig}</g>
                    {/* yanık: kararmış, lekeli, kenarı kömürleşmiş kopya */}
                    <g filter={`url(#${uid}yanF)`} opacity={0.75 * yanik}>{rig}</g>
                    {kabarcik.map((k, i) =>
                      k.on ? (
                        k.patla ? <circle key={i} cx={k.x} cy={FY(k.y)} r={k.r * 1.1} fill="#3a1206" stroke="#1a0604" strokeWidth={1.5} opacity={0.8} />
                          : <g key={i}><circle cx={k.x} cy={FY(k.y)} r={k.r} fill="#f0d0a0" stroke="#8a4a2a" strokeWidth={1.5} /><circle cx={k.x - k.r * 0.35} cy={FY(k.y) - k.r * 0.35} r={k.r * 0.3} fill="#fff" opacity={0.7} /></g>
                      ) : null,
                    )}
                  </g>
                )}
                </g>
                {/* yırtık kenarlar: önce çatlak (kor), sonra kanlı yırtık */}
                <g clipPath={`url(#${uid}sil)`}>
                {pc.yirtik.map((line, i) => {
                  const d = line.map((p, j) => `${j ? "L" : "M"} ${p[0]} ${FY(p[1])}`).join(" ");
                  return (
                    <g key={i} opacity={catlak}>
                      <path d={d} stroke="#1a0404" strokeWidth={6 + 3 * acil} fill="none" strokeLinejoin="round" strokeDasharray="600" strokeDashoffset={600 * (1 - catlak)} />
                      <path d={d} stroke={t < pc.t0 ? "#ff8a32" : "#c83a3a"} strokeWidth={2.2} fill="none" strokeLinejoin="round" strokeDasharray="600" strokeDashoffset={600 * (1 - catlak)} opacity={t < pc.t0 ? 0.6 + 0.4 * Math.sin(t * 30) : 0.9} />
                    </g>
                  );
                })}
                </g>
                {/* eriyen deri damlaları (parçayla birlikte hareket eder) */}
                {ters ? null : pc.damla.map(([x, y, L, w, tb], i) => (
                  <Damla key={i} x={x} y={y} L={L * 1.3 * sstep(tb - 0.35, tb + 1.2, t) * (1 + 0.5 * sstep(tb + 1.2, 3.2, t)) * (0.4 + 0.6 * akis)} w={w} renk={yuzRenk(0.35 + 0.6 * yanik)} t={t} seed={i + pc.id.length * 3} />
                ))}
                {pc.id === "j" && !ters ? <Perde S={70 * sstep(0.7, 2.1, t)} renk={yuzRenk(0.35 + 0.6 * yanik)} t={t} /> : null}
              </g>
            ))}
          </g>
          {/* yanık dumanı */}
          {new Array(6).fill(0).map((_, i) => {
            const k = ((t - 0.9 - i * 0.28) / 2.4);
            if (k < 0 || k > 1) return null;
            const x = 380 + i * 70 + Math.sin(t * 2 + i) * 30, y = 820 - 700 * k;
            return <ellipse key={i} cx={x} cy={y} rx={40 + 80 * k} ry={60 + 90 * k} fill="#c8c4bc" opacity={0.22 * Math.sin(Math.PI * k)} filter={`url(#da${uid})`} />;
          })}
        </g>
        {/* floresan titremesi + kenar kararması */}
        <rect width={1080} height={1920} fill="#000" opacity={(1 - fl) * 0.7} />
        <rect width={1080} height={1920} fill="#2a6040" opacity={0.06} />
        <rect width={1080} height={1920} fill={`url(#${uid}vin)`} />
      </svg>
    </AbsoluteFill>
  );
};


/* =====================================================================================
 *  DONUSUM_GOVDE: hırka ve deri ortadan yırtılır, iki yana katlanarak soyulur, yere düşer;
 *  içinden bacaklar açılır, böcek tavana kadar büyür (yaylı), antenler floresana çarpar (kıvılcım),
 *  kanatlar kabarır. Kamera büyümeyi aşağıdan yukarı izler. text[0]: zaman kayması
 * ===================================================================================== */
type GParca = { id: string; poly: Pt[]; hinge: Pt; yon: 1 | -1; t0: number; sure: number; kop: number; zemin: number; donus: number; yirtik: Pt[] };
const ORTA: Pt[] = [[200, 330], [208, 360], [194, 392], [206, 424], [192, 458], [207, 492], [195, 528], [206, 562], [194, 598], [203, 632], [197, 668]];
const GPARCA: GParca[] = [
  { id: "su", poly: [[-80, 330], ...ORTA.slice(0, 10), [-80, 650]], hinge: [96, 420], yon: -1, t0: 0.62, sure: 0.55, kop: 1.05, zemin: 1000, donus: -78, yirtik: ORTA.slice(0, 10) },
  { id: "sgu", poly: [[480, 330], [480, 650], ...rev(ORTA.slice(0, 10))], hinge: [304, 420], yon: 1, t0: 0.68, sure: 0.55, kop: 1.12, zemin: 1000, donus: 82, yirtik: ORTA.slice(0, 10) },
  { id: "sa", poly: [[-80, 650], ...ORTA.slice(9), [200, 1060], [-80, 1060]], hinge: [160, 1000], yon: -1, t0: 1.0, sure: 0.5, kop: 1.35, zemin: 1000, donus: -60, yirtik: ORTA.slice(9) },
  { id: "sga", poly: [[480, 650], [480, 1060], [200, 1060], ...rev(ORTA.slice(9))], hinge: [240, 1000], yon: 1, t0: 1.05, sure: 0.5, kop: 1.4, zemin: 1000, donus: 64, yirtik: ORTA.slice(9) },
];
/** gövde parçası: menteşede katlanır, kopunca yerçekimiyle düşer, yere çarpıp seker ve yatar */
const gParcaMat = (pc: GParca, t: number, buyu: number): { m: Mat; ters: boolean } => {
  const u = clamp01((t - pc.t0) / pc.sure);
  const e = u * u * (3 - 2 * u);
  const phi = (e * 72 + Math.sin(u * Math.PI * 3) * 7 * (1 - u)) * (Math.PI / 180);
  const cok = pc.id === "sa" || pc.id === "sga";
  const sx = cok ? 1 + 0.35 * e : Math.cos(phi);
  const kt = Math.max(0, t - pc.kop);
  const g = 2400;
  const h = pc.hinge;
  // düşüş: menteşe noktası yere (zemin - 30) iner, bir kez seker
  const D = Math.max(0, pc.zemin - 40 - h[1]);
  const tf = Math.sqrt((2 * D) / g);
  let dy: number;
  if (kt < tf) dy = 0.5 * g * kt * kt;
  else { const tb = kt - tf; dy = D - Math.max(0, 70 * Math.sin(Math.min(Math.PI, tb * 9)) * Math.exp(-tb * 4)); }
  const rotK = sstep(0, tf + 0.25, kt);
  const rot = pc.yon * 12 * e + pc.donus * rotK;
  // böcek büyüdükçe kenara itilir
  const dx = pc.yon * (40 * e + 120 * buyu + 90 * sstep(0, tf, kt));
  const r = (rot * Math.PI) / 180, c = Math.cos(r), s2 = Math.sin(r);
  const sy = cok ? 1 - 0.88 * e : 1 - 0.1 * e;
  const a = c * sx, b = s2 * sx, cc = -s2 * sy, d = c * sy;
  return { m: [a, b, cc, d, h[0] + dx - (a * h[0] + cc * h[1]), h[1] + dy - (b * h[0] + d * h[1])], ters: sx < 0 };
};

/** yerde buruşmuş deri ve gri hırka yığını (yerel: zemin y=0, sağa doğru uzanır) */
const DeriYigin: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <ellipse cx={30} cy={4} rx={150} ry={16} fill="#000" opacity={0.3} />
    {/* hırka: kol yeni çıkmış gibi kıvrık, düğmeli */}
    <path d="M -110 0 Q -120 -40 -80 -62 Q -30 -86 30 -70 Q 90 -60 120 -30 Q 140 -6 120 2 Z" fill="#6a6a66" stroke={OUTR} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -60 -58 Q -20 -40 10 -60 M 30 -64 Q 60 -30 100 -24" stroke="#525250" strokeWidth={5} fill="none" />
    <path d="M 70 -40 Q 130 -34 170 -6 L 168 4 L 96 2 Z" fill="#6a6a66" stroke={OUTR} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={-20} cy={-44} r={6} fill="#525250" stroke={OUTR} strokeWidth={2} />
    {/* sarkık ten (soyulmuş deri) */}
    <path d="M -96 -20 Q -70 -70 -20 -60 Q 10 -54 -8 -30 Q -30 -6 -60 -4 Q -90 0 -96 -20 Z" fill="#c8946c" stroke={OUTR} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -80 -26 Q -56 -50 -26 -48" stroke={K.et} strokeWidth={3} fill="none" opacity={0.7} />
    <path d="M -40 -10 q 6 -10 14 0 M -70 -36 q 6 -8 12 0" stroke="#8a5a40" strokeWidth={2.5} fill="none" />
    {/* lif artıkları ve ıslaklık */}
    {[0, 1, 2].map((i) => <path key={i} d={`M ${-20 + i * 30} ${-56 + i * 8} q ${8 + Math.sin(t * 4 + i) * 5} -18 ${-4 + i * 4} -30`} stroke={i % 2 ? K.lif : K.lif2} strokeWidth={4} fill="none" strokeLinecap="round" />)}
    <ellipse cx={-30} cy={2} rx={60} ry={7} fill="#5a1a1a" opacity={0.35} />
    <path d="M -40 -66 Q -30 -74 -16 -70" stroke="#fff" strokeWidth={3} opacity={0.35} fill="none" strokeLinecap="round" />
  </g>
);

const DonusumGovde: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f0 = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kay = Number(text?.[0] || 0);
  const t = f0 / fps + kay;
  const f = f0 + Math.round(kay * fps);
  const sab = castById("sabri_sahte");
  const uid = "dg";
  // eğriler
  const kivran = (1 - sstep(0.5, 0.9, t)) * sstep(0, 0.1, t);
  const acilB = yay(Math.max(0, t - 0.75) / 0.9, 0.42, 9);
  // büyüme: yavaş başlar, hızlanır, tavana yaklaşınca yavaşlar; küçük taşma ve geri oturma (kütle hissi)
  const buyu = sstep(1.0, 2.5, t) + 0.05 * Math.sin(Math.PI * sstep(2.3, 3.1, t));
  const kalkan = sstep(1.1, 2.0, t);
  const kanat = 0.05 + 0.95 * sstep(2.1, 2.5, t) - 0.4 * sstep(2.9, 3.6, t);
  const mand = 0.55 + 0.45 * sstep(2.3, 2.5, t) - 0.3 * sstep(3.3, 3.9, t) + 0.15 * Math.sin(t * 7) * sstep(3.6, 4, t);
  const egil = 0.6 * sstep(3.3, 4.5, t);
  const vurus = 2.42; // anten floresana çarpar
  const kivilcim = t > vurus ? t - vurus : -1;
  const fl = random(`dg${Math.floor(f / 2)}`) < (kivilcim >= 0 && kivilcim < 1.4 ? 0.45 : 0.12 + 0.2 * sstep(0.6, 1.4, t)) ? 0.42 : 1;
  // yerleşim: ayaklar (540, 1700); rig boyu 920 px
  const size = 920, fx = 540, fyy = 1700;
  const ps = size / 1000;
  const s0 = 0.928 * ps, s1 = 1.28;
  const bs = s0 + (s1 - s0) * buyu;
  // kamera: büyümeyi izler (aşağıdan yukarı tilt + uzaklaşma)
  // kamera büyümeyi biraz geriden, sönümlü izler (baş kadrajdan çıkmaz)
  const camK = sstep(0.95, 2.6, t);
  const camZ = 1.72 - 0.44 * camK;
  const camY = 1290 - 250 * camK;
  const sars = (sstep(0.0, 0.05, t) * (1 - sstep(0.1, 0.6, t)) * 10 + (kivilcim >= 0 ? 18 * Math.exp(-kivilcim * 5) : 0) + 8 * sstep(1.2, 1.4, t) * (1 - sstep(1.4, 1.9, t)));
  const shx = (random(`gx${f}`) - 0.5) * sars, shy = (random(`gy${f}`) - 0.5) * sars;
  const kv = kivran ? Math.sin(t * 38) * 2.5 * kivran : 0;
  const rigT = `translate(${fx - 200 * ps + kv * 3} ${fyy - 1000 * ps}) scale(${ps})`;
  const rig = <Character look={sab} size={1000} pose={{ emotion: "notr", kirpmaz: true, prop: "ambalaj", armR: { upper: -4, fore: -78 }, seed: 7, golgesiz: true }} />;
  const parcalar = GPARCA.map((pc) => ({ pc, ...gParcaMat(pc, t, buyu) }));
  // tavandaki floresan (kasa görünümünde y≈50-90) ekranda nerede: kasa → ekran ölçeği
  const bgZ = 1.02, bgHx = 880, bgHy = 1345;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0b0d", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs>
          <clipPath id={`${uid}govde`}><rect x={-200} y={336} width={800} height={800} /></clipPath>
          {parcalar.map(({ pc }) => <clipPath key={pc.id} id={`${uid}c${pc.id}`}><path d={`${pc.poly.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ")} Z`} /></clipPath>)}
          <filter id={`${uid}et`}>
            <feColorMatrix type="matrix" values="0 0 0 0 0.56  0 0 0 0 0.16  0 0 0 0 0.18  0 0 0 1 0" result="et" />
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.09" numOctaves={2} seed={3} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.03  0 0 0 0 0.05  0 0 0 2.2 -1" result="nA" />
            <feComposite in="nA" in2="et" operator="in" result="lif" />
            <feMerge><feMergeNode in="et" /><feMergeNode in="lif" /></feMerge>
          </filter>
          <linearGradient id={`${uid}golG`} x1="0" y1="0" x2="0" y2="1"><stop offset="0.3" stopColor="#fff" stopOpacity={0} /><stop offset="1" stopColor="#fff" stopOpacity={0.45} /></linearGradient>
          <mask id={`${uid}golM`} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={6000} height={6000}><rect x={-2000} y={-200} width={6000} height={2000} fill={`url(#${uid}golG)`} /></mask>
          <filter id={`${uid}siyah`}><feColorMatrix type="matrix" values="0 0 0 0 0.02  0 0 0 0 0.01  0 0 0 0 0.02  0 0 0 1 0" /></filter>
          <filter id={`${uid}beyaz`}><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" /></filter>
          <mask id={`${uid}m`} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={6000} height={6000}>
            <rect x={-2000} y={-2000} width={6000} height={6000} fill="#000" />
            <g transform={rigT} filter={`url(#${uid}beyaz)`}>{rig}</g>
            <circle cx={fx} cy={fyy - 715} r={175} fill="#fff" />
            <circle cx={fx} cy={fyy - 560} r={30 + 1400 * sstep(0.85, 1.55, t)} fill="#fff" />
          </mask>
          <radialGradient id={`${uid}vin`} cx="0.5" cy="0.45" r="0.75"><stop offset="0.45" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.8} /></radialGradient>
          <radialGradient id={`${uid}isik`} cx="0.5" cy="0" r="0.9"><stop offset="0" stopColor="#ffffff" stopOpacity={0.35} /><stop offset="1" stopColor="#ffffff" stopOpacity={0} /></radialGradient>
          <filter id={`${uid}bl`}><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <g transform={`translate(${540 + shx} ${960 + shy}) scale(${camZ}) translate(-540 ${-camY})`}>
          <DepoArka f={f} hx={bgHx} hy={bgHy} z={bgZ} sx={fx} sy={fyy} blur={3} turb={0} uid={uid} />
          {/* zemin gölgesi (büyüdükçe genişler) */}
          <ellipse cx={fx} cy={fyy + 6} rx={150 + 230 * buyu} ry={22 + 16 * buyu} fill="#000" opacity={0.35} filter={`url(#${uid}bl)`} />
          {/* böcek (insan silüetiyle maskeli, yırtık açıldıkça tamamı) */}
          {(() => {
            const bocek = <DevBocek t={t + 4} acil={acilB} kanat={kanat} mand={mand} egil={egil} anten={560 + 260 * sstep(1.2, 2.4, t)} antenSal={1 + (kivilcim >= 0 && kivilcim < 0.4 ? 3 : 0)} parlak={1} salya={1} isik={fl} kalinti={sstep(1.4, 1.8, t)} uid={uid} kalkan={kalkan} saldir={sstep(3.5, 4.3, t)} />;
            return (
              <g mask={`url(#${uid}m)`}>
                <g transform={`translate(${fx} ${fyy}) scale(${bs})`}>{bocek}</g>
                {/* üstten ışık: alt gövde karanlığa gömülür */}
                <g mask={`url(#${uid}golM)`}>
                  <g transform={`translate(${fx} ${fyy}) scale(${bs})`} filter={`url(#${uid}siyah)`}>{bocek}</g>
                </g>
              </g>
            );
          })()}
          {/* lifler: yırtık kenar ↔ böceğin göğsü */}
          {parcalar.map(({ pc, m }) =>
            t < pc.t0 ? null : pc.yirtik.filter((_, i) => i % 1 === 0).map((p, i) => {
              const sd = i * 11 + pc.id.length * 5 + pc.id.charCodeAt(1);
              const b0: Pt = [p[0], p[1]];
              const a: Pt = [200 + (p[0] - 200) * 0.3, p[1] + 6];
              const bb = app(m, b0);
              // böcek büyüdükçe çapa noktası da büyür (ayaklara göre)
              const aS: Pt = [200 + (a[0] - 200) * (bs / s0), 1000 - (1000 - a[1]) * (bs / s0)];
              return (
                <g key={`${pc.id}${i}`} transform={rigT}>
                  <Lif a={aS} b={bb} b0={b0} maxL={60 + random(`gl${sd}`) * 150} w={4 + random(`gw${sd}`) * 4} t={t} seed={sd} />
                </g>
              );
            }),
          )}
          {/* insan derisi + hırka parçaları */}
          {parcalar.map(({ pc, m, ters }) => (
            <g key={pc.id} transform={rigT} opacity={1 - sstep(0.3, 0.5, t - pc.kop)}>
              <g transform={`matrix(${m.join(" ")})`}>
                <g clipPath={`url(#${uid}c${pc.id})`}>
                  <g clipPath={`url(#${uid}govde)`}>
                    {ters ? <g filter={`url(#${uid}et)`}>{rig}</g> : rig}
                  </g>
                </g>
                {/* yırtık kenar: kanlı, lifli */}
                <path d={pc.yirtik.map((p, j) => `${j ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ")} stroke="#3a0408" strokeWidth={7} fill="none" strokeLinejoin="round" opacity={sstep(pc.t0 - 0.15, pc.t0, t)} />
                <path d={pc.yirtik.map((p, j) => `${j ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ")} stroke="#c8403a" strokeWidth={2.5} fill="none" strokeLinejoin="round" opacity={sstep(pc.t0 - 0.15, pc.t0, t)} />
              </g>
            </g>
          ))}
          {/* yerde: dökülen deri + hırka yığını (parçalar yere değince) */}
          {[-1, 1].map((s) => {
            const pc = GPARCA[s < 0 ? 0 : 1];
            const kt = t - pc.kop;
            const k = sstep(0.25, 0.5, kt);
            if (k <= 0) return null;
            const x = fx + s * (150 + 120 * buyu);
            return (
              <g key={s} transform={`translate(${x} ${fyy + 4}) scale(${s} 1) scale(${0.8 + 0.2 * k} ${0.6 + 0.4 * yay(kt - 0.25, 0.4, 14)})`} opacity={k}>
                <DeriYigin t={t} />
              </g>
            );
          })}
          {/* yırtılmadan hemen önce: göğüste kor çatlak */}
          {t < 0.75 ? (
            <g transform={rigT} opacity={sstep(0.2, 0.55, t)}>
              <path d={ORTA.slice(0, 10).map((p, j) => `${j ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ")} stroke="#1a0404" strokeWidth={8} fill="none" strokeDasharray="400" strokeDashoffset={400 * (1 - sstep(0.2, 0.6, t))} />
              <path d={ORTA.slice(0, 10).map((p, j) => `${j ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ")} stroke="#ff7a2a" strokeWidth={3} fill="none" strokeDasharray="400" strokeDashoffset={400 * (1 - sstep(0.2, 0.6, t))} opacity={0.7 + 0.3 * Math.sin(t * 40)} />
            </g>
          ) : null}
          {/* kıvılcımlar: anten floresana çarpar */}
          {kivilcim >= 0 && kivilcim < 1.2 ? new Array(16).fill(0).map((_, i) => {
            const ang = (random(`ka${i}`) * 140 + 20) * (Math.PI / 180);
            const v = 500 + random(`kv${i}`) * 700;
            const k = kivilcim;
            const x = fx - 300 + random(`kx${i}`) * 600 + Math.cos(ang) * v * k * (random(`kd${i}`) > 0.5 ? 1 : -1) * 0.6;
            const y = fyy - (1345 - 70) * bgZ + Math.sin(ang) * v * k * 0.3 + 0.5 * 2600 * k * k;
            return <circle key={i} cx={x} cy={y} r={3 + random(`kr${i}`) * 4} fill="#fff4b0" opacity={Math.max(0, 1 - k / (0.5 + random(`kl${i}`) * 0.7))} />;
          }) : null}
        </g>
        <rect width={1080} height={1920} fill="url(#dgisik)" opacity={fl} />
        <rect width={1080} height={1920} fill="#000" opacity={(1 - fl) * 0.55} />
        <rect width={1080} height={1920} fill="#2a6040" opacity={0.07} />
        <rect width={1080} height={1920} fill={`url(#${uid}vin)`} />
      </svg>
    </AbsoluteFill>
  );
};


/* =====================================================================================
 *  OMUZ_EL: kamera Ece'ye dönük (arkasında açık kapı, şafak). Ece bir adım atar; kadraj solundan
 *  ıslak gri hırkalı bir kol girer, el sağ omzunu kavrar (sahibi görünmez). Ece sıçrayarak irkilir
 *  ("hoaa"), önce gözleri sonra başı kadraj soluna (sağ omzunun üstünden) döner.
 *  text[0]: zaman kayması (sn) · text[1]: irkilme anı (vars. 1.0) · text[2]: dönüş başlangıcı (vars. 1.7)
 * ===================================================================================== */
const SABRI_TEN = "#d8a47c", SABRI_TEN2 = "#c08a64", HIRKA = "#5e6064", HIRKA2 = "#46484c";
/** Sabri'nin eli omuzda (Ece rig birimi). k: kavrama 0..1. Parmaklar omzun önüne sarkar, baş parmak arkada. */
const OmuzEl: React.FC<{ x: number; y: number; k: number; t: number }> = ({ x, y, k, t }) => {
  const bas = 4 * k; // kavrarken parmaklar kumaşa gömülür
  const parmak = (i: number) => {
    const px = x - 22 + i * 15, py = y + 6;
    const L1 = [30, 34, 32, 26][i], L2 = [22, 26, 24, 19][i];
    const a1 = 96 - i * 6 - 12 * k, a2 = 118 - i * 4 - 26 * k;
    const j: Pt = [px + Math.cos((a1 * Math.PI) / 180) * L1, py + Math.sin((a1 * Math.PI) / 180) * L1 + bas];
    const u: Pt = [j[0] + Math.cos((a2 * Math.PI) / 180) * L2, j[1] + Math.sin((a2 * Math.PI) / 180) * L2];
    const w = [7.5, 8, 7.8, 6.6][i];
    return (
      <g key={i}>
        <path d={kapsul([px, py], j, w, w * 0.92)} fill={i % 2 ? SABRI_TEN : "#d09c74"} stroke={OUTR} strokeWidth={2.6} />
        <path d={kapsul(j, u, w * 0.92, w * 0.8)} fill={i % 2 ? SABRI_TEN : "#d09c74"} stroke={OUTR} strokeWidth={2.6} />
        <path d={`M ${j[0] - w * 0.6} ${j[1] - 1} q ${w * 0.6} 3 ${w * 1.2} 0`} stroke={SABRI_TEN2} strokeWidth={1.6} fill="none" />
        <ellipse cx={u[0] + 1} cy={u[1] + 1} rx={w * 0.55} ry={w * 0.45} fill="#ead2bc" stroke={SABRI_TEN2} strokeWidth={1} />
      </g>
    );
  };
  return (
    <g>
      {/* parmakların bastırdığı kazak kıvrımları */}
      <path d={`M ${x - 30} ${y + 34 + bas} q 8 6 16 0 M ${x - 6} ${y + 40 + bas} q 8 6 16 0 M ${x + 16} ${y + 36 + bas} q 6 5 12 0`} stroke="#8a6418" strokeWidth={2.2} fill="none" opacity={0.6 * k} />
      {/* el sırtı (omzun üstünde, arkadan uzanır) */}
      <path d={`M ${x - 40} ${y - 6} Q ${x - 30} ${y - 26} ${x + 2} ${y - 24} Q ${x + 34} ${y - 22} ${x + 40} ${y - 4} Q ${x + 36} ${y + 12} ${x + 20} ${y + 12} L ${x - 30} ${y + 14} Q ${x - 44} ${y + 8} ${x - 40} ${y - 6} Z`} fill={SABRI_TEN} stroke={OUTR} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M ${x - 20} ${y - 12} q 14 -6 30 -2 M ${x - 10} ${y - 2} q 12 -4 24 0`} stroke={SABRI_TEN2} strokeWidth={1.8} fill="none" opacity={0.8} />
      <path d={`M ${x - 14} ${y - 18} q 10 -2 18 2`} stroke="#6a8aa8" strokeWidth={1.6} fill="none" opacity={0.5} />
      {[0, 1, 2, 3].map(parmak)}
      {/* yağmur damlaları elin sırtında */}
      <path d={`M ${x + 8} ${y - 20} q -2 5 0 7 q 2 -2 0 -7 z M ${x - 22} ${y - 10} q -2 5 0 7 q 2 -2 0 -7 z`} fill="#e0f0ff" stroke="#6fa8cf" strokeWidth={1} />
      <circle cx={x + 30 + Math.sin(t * 3) * 0.5} cy={y + 2} r={1.6} fill="#fff" opacity={0.6} />
    </g>
  );
};

const OmuzElSahne: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f0 = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kay = Number(text?.[0] || 0);
  const t = f0 / fps + kay;
  const f = f0 + Math.round(kay * fps);
  const ece = castById("ece_sivil");
  const tI = Number(text?.[1] ?? 1.0);
  const tD = Number(text?.[2] ?? 1.7);
  // adım: kameraya doğru (ölçek büyür), iniş-kalkış
  const adim = sstep(0.4, 0.85, t);
  const bob = -10 * Math.sin(Math.PI * clamp01((t - 0.4) / 0.45));
  // el: kadraj dışından hızlı girer, omza konar, kavrar
  const elU = sstep(tI - 0.24, tI - 0.06, t);
  const kavra = sstep(tI - 0.06, tI + 0.06, t);
  // irkilme: sıçrama (yaylı), omuzlar kalkar, baş geri
  const ir = t >= tI ? Math.exp(-(t - tI) * 6.5) * Math.sin(Math.min(Math.PI, (t - tI) * 16)) : 0;
  const omuz = 26 * sstep(tI, tI + 0.08, t) * (1 - 0.55 * sstep(tI + 0.5, tI + 1.0, t));
  // dönüş: önce gözler (0.25 sn önde), sonra baş, sonra omuzlar
  const dU = clamp01((t - tD) / 0.75);
  const dE = dU * dU * (3 - 2 * dU);
  const aci = -118 * dE + 6 * Math.sin(Math.PI * clamp01((t - tD - 0.62) / 0.3)) * sstep(tD + 0.6, tD + 0.75, t);
  const gozU = sstep(tD - 0.3, tD - 0.05, t);
  const lookX = 0.5 * (1 - sstep(tI - 0.05, tI + 0.15, t)) - 1 * gozU * (1 - dE * 0.6);
  const govdeAci = -34 * sstep(tD + 0.15, tD + 0.9, t);
  const emo: Emotion = t < tI ? "korkmus" : t < tI + 0.65 ? "dehset" : "korkmus";
  const vis = t >= tI + 0.02 && t < tI + 0.26 ? "O" : t >= tI + 0.26 && t < tI + 0.55 ? "A" : null;
  const S = 2.55 * (1 + 0.07 * adim);
  const X0 = 610, Y0 = 880 + bob - 70 * ir;
  // saç: irkilmede kuyruk zıplar, dönüşte savrulur
  const sal = -26 * Math.sin(Math.PI * dU) + 10 * Math.exp(-Math.max(0, t - tI) * 4) * Math.sin(Math.max(0, t - tI) * 14);
  const ileri = 14 * ir;
  const sars = t >= tI && t < tI + 0.14 ? 14 : 0;
  const shx = (random(`oe${f}`) - 0.5) * sars + Math.sin(t * 1.3) * 3, shy = (random(`oy${f}`) - 0.5) * sars + Math.sin(t * 1.7) * 2;
  // el konumu (Ece rig biriminde): sağ omuz (kadraj solu) üstü; omuzla birlikte kalkar, dönüşte omuz uzaklaşır
  const omzX = 200 - 64 * Math.cos((govdeAci * Math.PI) / 180), omzY = 330 - omuz;
  const elX = omzX + (1 - elU) * -260, elY = omzY - 2 + (1 - elU) * -60;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0c1018", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs>
          <filter id="oebl"><feGaussianBlur stdDeviation="9" /></filter>
          <filter id="oebl2"><feGaussianBlur stdDeviation="26" /></filter>
          <radialGradient id="oekapi" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#7a9ad8" stopOpacity={0.55} /><stop offset="1" stopColor="#7a9ad8" stopOpacity={0} /></radialGradient>
          <radialGradient id="oevin" cx="0.55" cy="0.4" r="0.8"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.6} /></radialGradient>
        </defs>
        <g transform={`translate(${shx} ${shy})`}>
          {/* arkada kapı (flu): açık, şafak, yağmur */}
          <g filter="url(#oebl)" transform="translate(540 900) scale(1.55) translate(-560 -880)">
            <Market724BG view="kapi" frame={f} doorOpen={0.72} saat="06:03" iz={1} turb={0} />
          </g>
          <ellipse cx={470} cy={980} rx={520} ry={760} fill="url(#oekapi)" opacity={0.75} />
          {/* kadraj solunda, Ece'nin arkasında: elin sahibinin flu gövdesi (kimliği seçilmez) */}
          <g filter="url(#oebl2)" opacity={elU}>
            <path d={`M -200 ${520 - 40 * elU} Q 60 ${470 - 40 * elU} 120 ${700} L 150 1920 L -200 1920 Z`} fill="#2a2c30" />
          </g>
          <g transform={`translate(${X0} ${Y0}) scale(${S}) translate(-200 -300)`}>
            <Bas25D look={ece} aci={aci} katman="arka" kuyrukIleri={ileri} kuyrukSal={sal} uid="oek" />
            {/* kol: omzun arkasından kadraj soluna (ıslak hırka); Ece'nin gövdesinin arkasında */}
            {elU > 0 ? (
              <g>
                <path d={`M ${elX - 4} ${elY - 22} L ${elX - 330} ${elY - 150} L ${elX - 340} ${elY - 64} L ${elX - 10} ${elY + 18} Z`} fill={HIRKA} stroke={OUTR} strokeWidth={3.5} strokeLinejoin="round" />
                <path d={`M ${elX - 60} ${elY - 40} L ${elX - 300} ${elY - 140}`} stroke={HIRKA2} strokeWidth={6} opacity={0.7} />
                {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={elX - 80 - i * 50} cy={elY - 40 - i * 20 + (i % 2) * 14} r={3} fill="#c8dcf0" opacity={0.6} />)}
                <path d={`M ${elX - 36} ${elY - 26} L ${elX - 44} ${elY + 10}`} stroke={HIRKA2} strokeWidth={10} strokeLinecap="round" />
              </g>
            ) : null}
            <Govde25D look={ece} aci={govdeAci} omuz={omuz} uid="oeg" />
            <g transform={`translate(0 ${-omuz * 0.7 - 6 * ir})`}>
              <Bas25D look={ece} aci={aci} emotion={emo} lookX={Math.max(-1, Math.min(1, lookX))} lookY={-0.05 - 0.1 * ir} pale={0.35} dagin={1} kuyrukIleri={ileri} kuyrukSal={sal} isik={0.85} kenar={0.9} viseme={vis as never} uid="oeb" />
            </g>
            {elU > 0 ? <OmuzEl x={elX + 8} y={elY} k={kavra} t={t} /> : null}
            {/* irkilmede fırlayan ter damlası (komik vurgu) */}
            {t > tI && t < tI + 0.45 ? (() => {
              const k = (t - tI) / 0.45;
              const x = 290 + 60 * k, y = 120 - 90 * k + 160 * k * k;
              return <path d={`M ${x} ${y} q -7 15 0 21 q 7 -6 0 -21 z`} fill="#bfe3ff" stroke="#6fa8cf" strokeWidth={2.5} opacity={1 - k * k} transform={`rotate(${30 * k} ${x} ${y})`} />;
            })() : null}
          </g>
        </g>
        <rect width={1080} height={1920} fill="url(#oevin)" />
      </svg>
    </AbsoluteFill>
  );
};


/* =====================================================================================
 *  BOCEK_DEV: alt açıdan geniş (kapı tarafından depoya). Önde Ece'nin sırtı (ölçek), arkada tavana
 *  dikilen dev böcek: kanatlar kabarır, tıslar (mandibulalar ardına kadar), baş Ece'ye doğru eğilir.
 *  text[0]: zaman kayması
 * ===================================================================================== */
const BocekDev: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f0 = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kay = Number(text?.[0] || 0);
  const t = f0 / fps + kay;
  const f = f0 + Math.round(kay * fps);
  const ece = castById("ece_sivil");
  const uid = "bd";
  const fx = 640, fyy = 1640, bgZ = 1.15;
  const bs = (1224 / 1010) * bgZ * (1 + 0.015 * yay(t / 0.5, 0.5, 12) - 0.015);
  const tis = sstep(0.7, 0.85, t) * (1 - 0.5 * sstep(1.6, 2.2, t));
  const kanat = 0.55 + 0.45 * sstep(0.55, 0.85, t) - 0.25 * sstep(1.6, 2.4, t);
  const egil = 0.15 + 0.35 * sstep(1.2, 2.4, t);
  const fl = random(`bd${Math.floor(f / 2)}`) < 0.18 + 0.3 * tis ? 0.45 : 1;
  const z = 1 + 0.06 * sstep(0, 2.6, t);
  const sars = tis > 0.5 && t < 1.1 ? 10 * (1 - sstep(0.85, 1.1, t)) : 0;
  const shx = (random(`bx${f}`) - 0.5) * sars, shy = (random(`by${f}`) - 0.5) * sars;
  // Ece (arkadan): korkuyla yarım adım geri, başı yukarı, omuzlar kalkık
  const geri = sstep(0.75, 1.2, t);
  const S = 2.1 * (1 - 0.04 * geri);
  const EX = 290 - 20 * geri, EY = 1450 + 30 * geri;
  const tit = Math.sin(t * 40) * 1.2;
  const bocek = <DevBocek t={t + 7} acil={1} kanat={kanat} mand={0.35 + 0.65 * tis} egil={egil} anten={820} antenSal={1.3} parlak={1} salya={1} isik={fl} kalinti={1} saldir={sstep(1.0, 2.0, t)} uid={uid} />;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0b0d", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs>
          <linearGradient id={`${uid}golG`} x1="0" y1="0" x2="0" y2="1"><stop offset="0.25" stopColor="#fff" stopOpacity={0} /><stop offset="1" stopColor="#fff" stopOpacity={0.66} /></linearGradient>
          <mask id={`${uid}golM`} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={6000} height={6000}><rect x={-2000} y={200} width={6000} height={1600} fill={`url(#${uid}golG)`} /></mask>
          <filter id={`${uid}siyah`}><feColorMatrix type="matrix" values="0 0 0 0 0.02  0 0 0 0 0.01  0 0 0 0 0.02  0 0 0 1 0" /></filter>
          <filter id={`${uid}bl`}><feGaussianBlur stdDeviation="3" /></filter>
          <radialGradient id={`${uid}vin`} cx="0.55" cy="0.4" r="0.8"><stop offset="0.45" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.82} /></radialGradient>
        </defs>
        <g transform={`translate(${540 + shx} ${960 + shy}) scale(${z}) translate(-540 -960)`}>
          <DepoArka f={f} hx={880} hy={1345} z={bgZ} sx={fx} sy={fyy} blur={2.5} turb={0} uid={uid} />
          <ellipse cx={fx} cy={fyy + 6} rx={440} ry={40} fill="#000" opacity={0.4} filter={`url(#${uid}bl)`} />
          <g transform={`translate(${fx - 360} ${fyy + 2}) scale(1.4)`}><DeriYigin t={t} /></g>
          <g transform={`translate(${fx + 330} ${fyy + 2}) scale(-1.3 1.3)`}><DeriYigin t={t} /></g>
          <g transform={`translate(${fx} ${fyy}) scale(${bs})`}>{bocek}</g>
          <g mask={`url(#${uid}golM)`}><g transform={`translate(${fx} ${fyy}) scale(${bs})`} filter={`url(#${uid}siyah)`}>{bocek}</g></g>
          {/* çikolata ambalajı yerde (sahte Sabri'nin elinden düştü) */}
          <g transform={`translate(${fx + 170} ${fyy - 6}) rotate(78) scale(1.2)`}>
            <path d="M -12 -40 L 12 -38 L 11 10 L -11 9 Z" fill="#5a2a8a" stroke={OUTR} strokeWidth={2.5} />
            <rect x={-11} y={-20} width={22} height={11} fill="#f2c21a" />
          </g>
        </g>
        <rect width={1080} height={1920} fill="#000" opacity={(1 - fl) * 0.7} />
        <rect width={1080} height={1920} fill="#2a6040" opacity={0.07} />
        {/* ön plan: Ece arkadan (ölçek için net) */}
        <g transform={`translate(${EX + tit} ${EY}) scale(${S}) translate(-200 -300)`}>
          <Bas25D look={ece} aci={176} katman="arka" kuyrukSal={4 * Math.sin(t * 3)} kuyrukIleri={-6} uid="bdek" />
          <Govde25D look={ece} aci={178} omuz={10 + 8 * geri} uid="bdeg" />
          <g transform={`rotate(-7 200 300) translate(0 ${-8 - 6 * geri})`}>
            <Bas25D look={ece} aci={176} emotion="dehset" pale={0.5} dagin={1} kuyrukSal={4 * Math.sin(t * 3)} kuyrukIleri={-6} isik={0.5} kenar={0.6} uid="bdeb" />
          </g>
        </g>
        <rect width={1080} height={1920} fill={`url(#${uid}vin)`} />
      </svg>
    </AbsoluteFill>
  );
};

/* =====================================================================================
 *  BOCEK_YAKIN: Ece'nin gözünden. Böceğin kafası iner, merakla başını yana eğer, antenler kameraya
 *  (Ece'ye) uzanır, mandibulalar yavaşça açılır. Son karede kesme (çözülmemiş soru). text[0]: kayma
 * ===================================================================================== */
const BocekYakin: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f0 = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kay = Number(text?.[0] || 0);
  const t = f0 / fps + kay;
  const f = f0 + Math.round(kay * fps);
  const uid = "by";
  const in_ = yay(t / 0.9, 0.55, 8);
  const egim = 19 * sstep(0.7, 1.15, t) + 2 * Math.sin(t * 2.2) * sstep(1.2, 1.6, t);
  const sc = 3.5 + 0.7 * in_ + 0.3 * sstep(1.4, 2.2, t);
  const y = 540 + 290 * in_;
  const mand = 0.15 + 0.6 * sstep(1.1, 2.0, t);
  const fl = random(`by${Math.floor(f / 2)}`) < 0.16 ? 0.5 : 1;
  const uzan = sstep(0.4, 1.6, t);
  return (
    <AbsoluteFill style={{ backgroundColor: "#07080a", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs>
          <radialGradient id={`${uid}vin`} cx="0.5" cy="0.45" r="0.7"><stop offset="0.4" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.85} /></radialGradient>
          <linearGradient id={`${uid}tavan`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8ccce" /><stop offset="1" stopColor="#5a6064" /></linearGradient>
          <filter id={`${uid}bl`}><feGaussianBlur stdDeviation="10" /></filter>
          <filter id={`${uid}bl2`}><feGaussianBlur stdDeviation="4" /></filter>
        </defs>
        {/* tavan ve titreyen floresan (alt açı) */}
        <rect width={1080} height={1920} fill={`url(#${uid}tavan)`} opacity={0.55 * fl} />
        <rect x={120} y={60} width={840} height={70} rx={10} fill="#ffffff" opacity={0.9 * fl} filter={`url(#${uid}bl)`} />
        <g transform={`translate(540 ${y}) rotate(${egim}) scale(${sc})`}>
          {/* pronotum kenarı (arkada, başın üstünde) */}
          <path d="M -230 -40 C -240 -180 -120 -260 0 -262 C 120 -260 240 -180 230 -40 Z" fill={K.k2} stroke={K.out} strokeWidth={5} />
          <path d="M -214 -60 C -222 -170 -110 -240 0 -242" stroke={K.kenar} strokeWidth={10} fill="none" />
          <path d="M -150 -200 Q -40 -250 90 -236" stroke={K.parla} strokeWidth={8} fill="none" opacity={0.5 * fl} strokeLinecap="round" />
          <BocekKafa t={t + 3} mand={mand} anten={0} parlak={1} salya={1} isik={fl} uid={`${uid}k`} siper={0.35} yansima={1} />
        </g>
        {/* antenler: yukarıdan, kameraya doğru uzanır (ön planda kalın, flu) */}
        <g transform={`translate(540 ${y}) rotate(${egim})`}>
          <Anten kok={[-46 * sc, -118 * sc]} a0={-118} L={1500} buk={-250 + 70 * uzan} t={t} faz={0.4} w={4.6} sal={1.6} seg={40} />
          <Anten kok={[46 * sc, -118 * sc]} a0={-62} L={1500} buk={250 - 70 * uzan} t={t} faz={2.4} w={4.6} sal={1.6} seg={40} />
        </g>
        <rect width={1080} height={1920} fill="#000" opacity={(1 - fl) * 0.6} />
        <rect width={1080} height={1920} fill={`url(#${uid}vin)`} />
      </svg>
    </AbsoluteFill>
  );
};

/* =====================================================================================
 *  ECE_YAKIN: Ece'nin tepkisi (kamera ona dönük, arkada açık kapı). rig (önden).
 *  text: [duygu1, duygu2, geçiş sn, bakışX, solgunluk, ek: "hik<sn>" nefes çekme | "ter"]
 * ===================================================================================== */
const EceYakin: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ece = castById("ece_sivil");
  const e1 = (text?.[0] || "korkmus") as Emotion, e2 = (text?.[1] || e1) as Emotion;
  const t2 = Number(text?.[2] ?? 99);
  const lx = Number(text?.[3] ?? 0.45), pale = Number(text?.[4] ?? 0.3);
  const ek = text?.[5] || "";
  const hikT = ek.startsWith("hik") ? Number(ek.slice(3) || 0.1) : -1;
  const size = 2900;
  const z = 1 + 0.04 * (t / 3);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0c1018", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="eybl"><feGaussianBlur stdDeviation="9" /></filter>
          <radialGradient id="eykapi" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#7a9ad8" stopOpacity={0.55} /><stop offset="1" stopColor="#7a9ad8" stopOpacity={0} /></radialGradient>
        </defs>
        <g filter="url(#eybl)" transform={`translate(540 900) scale(${1.55 * z}) translate(-560 -880)`}>
          <Market724BG view="kapi" frame={f} doorOpen={0.72} saat="06:03" iz={1} turb={0} />
        </g>
        <ellipse cx={470} cy={980} rx={520} ry={760} fill="url(#eykapi)" opacity={0.7} />
      </svg>
      <div style={{ position: "absolute", left: 540 - 200 * (size / 1000) * z, top: 740 - 200 * (size / 1000) * z, transform: `scale(${z})`, transformOrigin: "0 0" }}>
        <Character look={ece} size={size} pose={{ emotion: t < t2 ? e1 : e2, lookX: lx, lookY: -0.05, pale, sacDagin: true, golgesiz: true, seed: 41, hik: hikT >= 0 && t > hikT ? (t - hikT) / 0.8 : undefined, sweat: ek === "ter", gozSok: ek === "goz" ? Math.min(1, t / 0.12) : undefined }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 52% 42%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* =====================================================================================
 *  ÖN PLAN KATMANLARI (saydam; motorda `ekle` ile sahnenin üstüne biner)
 *  ece_sirt:   Ece arkadan, kadrajın sağ altında, başı sola (gerçek Sabri'ye) dönük. text[0]: baş açısı
 *  sabri_omuz: gerçek Sabri'nin flu ensesi ve ıslak omzu, kadrajın sol kenarında (OTS)
 * ===================================================================================== */
const EceSirt: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ece = castById("ece_sivil");
  const aci = Number(text?.[0] ?? 206);
  const nef = Math.sin(t * 5.5) * 2.5;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs><filter id="esbl"><feGaussianBlur stdDeviation="2.5" /></filter></defs>
        <g filter="url(#esbl)" transform={`translate(900 ${1420 + nef}) scale(2.9) translate(-200 -300)`}>
          <Bas25D look={ece} aci={aci} katman="arka" kuyrukSal={3 * Math.sin(t * 2)} uid="esk" />
          <Govde25D look={ece} aci={190} omuz={8 + nef * 0.4} uid="esg" />
          <Bas25D look={ece} aci={aci} emotion="korkmus" pale={0.35} dagin={1} kuyrukSal={3 * Math.sin(t * 2)} isik={0.6} kenar={1} uid="esb" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const SabriOmuz: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const nef = Math.sin(t * 4.2) * 5;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs><filter id="sobl"><feGaussianBlur stdDeviation="16" /></filter></defs>
        <g filter="url(#sobl)" transform={`translate(0 ${nef})`}>
          {/* ıslak hırka omzu */}
          <path d="M -160 1920 L -160 980 Q -40 880 150 900 Q 300 930 330 1100 L 360 1920 Z" fill="#3e4044" />
          <path d="M 40 920 Q 200 930 290 1060" stroke="#6a6e74" strokeWidth={30} fill="none" opacity={0.6} />
          {/* kel ense, kulak üstü kır saç, yağmur parlaması */}
          <ellipse cx={90} cy={720} rx={190} ry={215} fill="#b88a68" />
          <path d="M -90 760 Q -60 900 60 930 Q 190 930 260 820 Q 250 900 150 960 Q 20 990 -90 900 Z" fill="#8a847c" />
          <ellipse cx={60} cy={590} rx={70} ry={26} fill="#fff" opacity={0.45} />
          <ellipse cx={268} cy={760} rx={30} ry={52} fill="#a8785a" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};


/** bocek_golge (ön plan, saydam): kadrajın üstünden sarkan dev böceğin gölgesi ve yokladığı anten uçları;
 *  floresan titreşimi. text[0]: antenlerin yaklaşma çarpanı (vars. 1) */
const BocekGolge: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const k = Number(text?.[0] ?? 1);
  const fl = random(`bg${Math.floor(f / 2)}`) < 0.15 ? 1 : 0;
  const in_ = sstep(0, 0.8, t) * k;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs>
          <linearGradient id="bggol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05030a" stopOpacity={0.85} /><stop offset="0.45" stopColor="#05030a" stopOpacity={0.25} /><stop offset="1" stopColor="#05030a" stopOpacity={0} /></linearGradient>
          <filter id="bggbl"><feGaussianBlur stdDeviation="1.6" /></filter>
        </defs>
        {/* böceğin başı ve pronotumunun gölgesi (üstten) */}
        <rect width={1080} height={1920} fill="url(#bggol)" opacity={0.7 + 0.2 * Math.sin(t * 2.6)} />
        <ellipse cx={560 + 30 * Math.sin(t * 1.3)} cy={-60} rx={620} ry={330} fill="#05030a" opacity={0.55} />
        {/* anten uçları kadrajın üstünden iner, Ece'nin yüzünün önünde yoklar */}
        <g filter="url(#bggbl)">
          <Anten kok={[250, -120]} a0={74 - 8 * in_} L={640 + 300 * in_} buk={80 + 40 * Math.sin(t * 1.7)} t={t} faz={0.3} w={3.6} sal={1.8} seg={30} />
          <Anten kok={[860, -120]} a0={108 + 6 * in_} L={600 + 280 * in_} buk={-90 - 30 * Math.sin(t * 1.4)} t={t} faz={1.9} w={3.6} sal={1.8} seg={30} />
        </g>
        <rect width={1080} height={1920} fill="#000" opacity={fl * 0.45} />
      </svg>
    </AbsoluteFill>
  );
};

export const Insert11: React.FC<{ kind: Insert11Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "donusum_yuz": return <DonusumYuz dur={dur} text={text} />;
    case "omuz_el": return <OmuzElSahne dur={dur} text={text} />;
    case "donusum_govde": return <DonusumGovde dur={dur} text={text} />;
    case "bocek_dev": return <BocekDev dur={dur} text={text} />;
    case "bocek_yakin": return <BocekYakin dur={dur} text={text} />;
    case "ece_yakin": return <EceYakin dur={dur} text={text} />;
    case "ece_sirt": return <EceSirt text={text} />;
    case "sabri_omuz": return <SabriOmuz />;
    case "bocek_golge": return <BocekGolge text={text} />;
    default: return null;
  }
};

/** Örnek klipler için tek başına kompozisyon */
export const B5Ornek: React.FC<{ kind: Insert11Kind; text?: string[] }> = ({ kind, text }) => {
  const { durationInFrames, fps } = useVideoConfig();
  return <Insert11 kind={kind} dur={durationInFrames / fps} text={text} />;
};
