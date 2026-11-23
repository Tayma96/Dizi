/* =====================================================================================
 * 7/24 Bölüm 5 · parça 2 ("Işıklar"): tam ekran çekimler (opt-in; yalnız 724-05-p2 kullanır).
 *
 *  p2_kasa    : kasa görünümü (kapı tarafından depoya). Önde gerçek Sabri'nin ensesi (sol), ortada
 *               Ece'nin sırtı, depo önünde dev böcek. Floresan karanlıklarında böcek adım adım yaklaşır.
 *  p2_kapi    : kapı görünümü (depo tarafından kapıya). Ece önden, arkasında (solda) gerçek Sabri.
 *               Kepenk çarparak iner, dışarıdan vuruşlar (göçük + titreşim), Ece ağzını kapatır,
 *               omzuna böcekler tırmanır, ışıklar söner (yalnız kırmızı saat), Sabri'nin yeri boş.
 *  p2_kepenk  : kepengin içeriden yakın planı: vuruşlarla göçükler, toz, titreşim.
 *  p2_koridor : raf koridoru (tek kaçış noktası, sonda DEPO). Raflardan böcekler çıkar, raflar
 *               "erir", zemini kaplayan sel kameraya (Ece'ye) akar. Göz yüksekliği düşükse zemin çekimi
 *               (önde Ece'nin bacakları).
 *  p2_fisilti : kırmızı saat ışığında Ece'nin yakın planı; fısıltılara katmanlı tepkiler; kararma.
 *  p2_kulaklik: (saydam) "Kulaklıkla izle" rozeti.
 *
 *  Parametreler: text[0] = JSON. Zamanlar çekimin başından saniye.
 *  Işık: sahne sabit ışıkta çizilir; üstüne "multiply" ışık katmanı biner (floresan havuzu × seviye +
 *  kırmızı saat ışığı). Floresan karanlıkları açık aralıklarla verilir (saniyede en fazla 3 sönme;
 *  tam ekran beyaz flaş yok).
 * ===================================================================================== */
import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";
import type { Emotion } from "../rig/types";
import { Market724BG, Market724FG } from "../sets/market724";
import { Anten, DevBocek, K, sstep } from "./bocek";
import { Bas25D, Govde25D } from "../rig/head25d";
import { DeriYigin } from "./Inserts11";
import { SANS } from "../../dizi/fonts";

export type Insert12Kind = "p2_kasa" | "p2_kapi" | "p2_kepenk" | "p2_koridor" | "p2_fisilti" | "p2_kulaklik";
export const INSERT12_KINDS: Insert12Kind[] = ["p2_kasa", "p2_kapi", "p2_kepenk", "p2_koridor", "p2_fisilti", "p2_kulaklik"];

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
/** anahtar kareler [[t, v1, v2...]]: yumuşak geçiş */
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
/** basamak: t'ye kadar en son değer */
const basamak = <T,>(k: [number, T][] | undefined, t: number, def: T): T => {
  let v = def;
  for (const [a, x] of k ?? []) if (t >= a) v = x;
  return v;
};
/** floresan seviyesi: karanlık aralıklarında 0, dönüşte 2 kare yarım (balast tıkırtısı) */
const lamba = (t: number, fps: number, dark?: number[][], kapali?: number, acik?: number[][]): number => {
  if (kapali !== undefined && kapali !== null && t >= kapali) {
    for (const [a, b] of acik ?? []) if (t >= a && t < b) return t < a + 1 / fps ? 0.6 : 1;
    return 0;
  }
  for (const [a, b] of dark ?? []) {
    if (t >= a && t < b) return 0;
    if (t >= b && t < b + 2 / fps) return 0.55;
  }
  return 1;
};
/** vuruş sarsıntısı: her vuruşta sönümlü, rastgele yön */
const sars = (t: number, f: number, hits: number[] | undefined, amp: number): [number, number, number] => {
  let a = 0;
  for (const h of hits ?? []) {
    const d = t - h;
    if (d >= 0 && d < 0.4) a = Math.max(a, Math.exp(-d * 11));
  }
  return [(random(`p2sx${f}`) - 0.5) * 2 * amp * a, (random(`p2sy${f}`) - 0.5) * 2 * amp * a, a];
};
const camT = (cx: number, cy: number, z: number, sx = 0, sy = 0) => `translate(${540 + sx}px, ${960 + sy}px) scale(${z}) translate(${-cx}px, ${-cy}px)`;
const rgb = (c: number[]) => `rgb(${c.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255)).join(",")})`;

/** Işık katmanı (multiply): floresan havuzu × L + kırmızı saat ışığı × red. Koordinatlar ekran. */
const Isik: React.FC<{ L: number; fx: number; fy: number; fr: number; fEdge?: number; red: number; rx: number; ry: number; rr: number; amb?: number; tint?: number[] }> = ({ L, fx, fy, fr, fEdge = 0.62, red, rx, ry, rr, amb = 0.015, tint = [0.97, 0.99, 1] }) => {
  const fc = tint.map((v) => v * L + amb), fe = tint.map((v) => v * L * fEdge + amb);
  const R = [0.78, 0.085, 0.06].map((v) => v * red), Rm = [0.3, 0.02, 0.015].map((v) => v * red);
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "multiply",
        backgroundImage: `radial-gradient(circle ${rr}px at ${rx}px ${ry}px, ${rgb(R)} 0%, ${rgb(Rm)} 45%, rgb(0,0,0) 100%), radial-gradient(circle ${fr}px at ${fx}px ${fy}px, ${rgb(fc)} 0%, ${rgb(fc.map((v, i) => (v + fe[i]) / 2))} 50%, ${rgb(fe)} 100%)`,
        backgroundBlendMode: "screen",
      }}
    />
  );
};
const Siyah: React.FC<{ o: number }> = ({ o }) => (o > 0.001 ? <AbsoluteFill style={{ backgroundColor: "#000", opacity: Math.min(1, o) }} /> : null);

/* =====================================================================================
 *  MİNİ HAMAMBÖCEĞİ (dev böceğin ailesi: aynı pronotum motifi — açık kenar, iki koyu leke)
 *  Yerel: baş -y yönünde, boy 100 birim. 4 yürüyüş evresi <defs> içinde; örnekler <use>.
 * ===================================================================================== */
const MB_LEGS: [number, number, number, number, number][] = [
  // tabanX, tabanY, açı (sağ taraf, derece; 0 = +x), diz bükümü, uzunluk çarpanı
  [12, -14, -42, 38, 0.95],
  [14, 2, 4, 26, 1],
  [12, 16, 44, -18, 1.25],
];
const MiniDefs: React.FC<{ uid: string }> = ({ uid }) => (
  <defs>
    <radialGradient id={`${uid}mbw`} cx="0.4" cy="0.35" r="0.8"><stop offset="0" stopColor={K.k3} /><stop offset="0.6" stopColor={K.k2} /><stop offset="1" stopColor={K.k1} /></radialGradient>
    {[0, 1, 2, 3].map((ph) => {
      const legs: string[] = [];
      for (const side of [1, -1]) {
        MB_LEGS.forEach(([bx, by, a0, bend, lm], i) => {
          const grupA = (i % 2 === 0) === (side === 1);
          const sw = 18 * Math.cos((ph * Math.PI) / 2 + (grupA ? 0 : Math.PI));
          const a = ((a0 + sw * (i === 1 ? 0.8 : 1)) * Math.PI) / 180;
          const k = [bx + Math.cos(a) * 20 * lm, by + Math.sin(a) * 20 * lm];
          const a2 = a + (bend * Math.PI) / 180;
          const e = [k[0] + Math.cos(a2) * 24 * lm, k[1] + Math.sin(a2) * 24 * lm];
          legs.push(`M ${side * bx} ${by} L ${side * k[0]} ${k[1]} L ${side * e[0]} ${e[1]}`);
        });
      }
      const s1 = 6 * Math.sin((ph * Math.PI) / 2), s2 = 6 * Math.cos((ph * Math.PI) / 2);
      return (
        <g key={ph} id={`${uid}mb${ph}`}>
          <path d={legs.join(" ")} stroke="#1a0904" strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M -5 -50 C ${-20 - s1} -90 ${-34 - s1} -120 ${-26 - s2} -158 M 5 -50 C ${20 + s2} -90 ${34 + s2} -122 ${24 + s1} -160`} stroke="#2a1208" strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <path d="M -4 46 L -9 60 M 4 46 L 9 60" stroke={K.k2} strokeWidth={3} strokeLinecap="round" />
          <ellipse cx={0} cy={-46} rx={8} ry={6} fill={K.k1} stroke={K.out} strokeWidth={2} />
          <path d="M -20 -14 C -27 10 -23 38 -6 51 L 0 47 L 6 51 C 23 38 27 10 20 -14 Z" fill={`url(#${uid}mbw)`} stroke={K.out} strokeWidth={2.6} strokeLinejoin="round" />
          <path d="M 0 -12 L 0 48" stroke={K.k1} strokeWidth={2} />
          <path d="M -14 -4 C -18 14 -15 30 -8 41" stroke={K.parla} strokeWidth={3} fill="none" opacity={0.42} strokeLinecap="round" />
          {/* pronotum: dev böcekle aynı motif */}
          <path d="M -21 -11 C -24 -30 -12 -45 0 -45 C 12 -45 24 -30 21 -11 C 18 -7 12 -6 8 -7 L -8 -7 C -12 -6 -18 -7 -21 -11 Z" fill={K.kenar} stroke={K.out} strokeWidth={2.6} strokeLinejoin="round" />
          <path d="M -17 -13 C -19 -28 -10 -40 0 -40 C 10 -40 19 -28 17 -13 C 14 -10 10 -10 7 -10 L -7 -10 C -10 -10 -14 -10 -17 -13 Z" fill={K.k2} />
          <path d="M -13 -20 Q -11 -34 -3 -33 Q -3 -24 -8 -15 Q -13 -15 -13 -20 Z M 13 -20 Q 11 -34 3 -33 Q 3 -24 8 -15 Q 13 -15 13 -20 Z" fill={K.k1} />
          <path d="M -14 -30 Q -6 -42 8 -40" stroke={K.parla} strokeWidth={2.6} fill="none" opacity={0.6} strokeLinecap="round" />
        </g>
      );
    })}
    {/* kaynaşan sel dokusu (kaydırılarak "kaynar") */}
    <pattern id={`${uid}tm`} patternUnits="userSpaceOnUse" width={74} height={50}>
      <rect width={74} height={50} fill="#120602" />
      {[[12, 10, 80], [40, 22, 104], [60, 7, 66], [24, 38, 96], [62, 40, 118], [4, 28, 70], [48, 46, 88]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <ellipse rx={11} ry={5} fill={i % 2 ? K.k2 : "#2a1006"} stroke={K.out} strokeWidth={1.2} />
          <ellipse cx={-5} rx={3.4} ry={3.4} fill={K.kenar} opacity={0.55} />
          <path d="M 2 -2 L 8 -2" stroke={K.parla} strokeWidth={1.4} opacity={0.4} />
        </g>
      ))}
    </pattern>
  </defs>
);
/** tek böcek örneği: (x,y) ekran, a = gidiş yönü (radyan), s = boy (px), sq = dikey basıklık (zemin perspektifi) */
const Mb: React.FC<{ uid: string; x: number; y: number; a: number; s: number; ph: number; sq?: number; o?: number }> = ({ uid, x, y, a, s, ph, sq = 1, o }) => (
  <use href={`#${uid}mb${((Math.floor(ph) % 4) + 4) % 4}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(s / 100).toFixed(3)} ${((s / 100) * sq).toFixed(3)}) rotate(${((a * 180) / Math.PI + 90).toFixed(1)})`} opacity={o} />
);

/* =====================================================================================
 *  GERÇEK SABRİ: arkadan (3/4), ön planda flu ense — kel tepe, kır saç çemberi, kulak, yanaktan
 *  taşan bıyık ucu, ıslak hırka omzu. (kasa görünümünde kadraj solu)
 * ===================================================================================== */
const SabriEnse: React.FC<{ uid: string; blur: number; t: number }> = ({ uid, blur, t }) => {
  const nef = Math.sin(t * 4.2) * 4;
  return (
    <g>
      <defs><filter id={`${uid}seb`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={blur} /></filter></defs>
      <g filter={blur > 0.2 ? `url(#${uid}seb)` : undefined} transform={`translate(0 ${nef})`}>
        <path d="M -200 1920 L -200 1130 Q -60 1010 120 1030 Q 300 1050 350 1230 L 390 1920 Z" fill="#55565a" stroke="#1b1412" strokeWidth={6} />
        <path d="M 60 1050 Q 240 1060 320 1200" stroke="#7a7e84" strokeWidth={26} fill="none" opacity={0.55} />
        <path d="M 30 1046 Q 150 1020 240 1062" stroke="#d8d0c0" strokeWidth={14} fill="none" />
        {/* boyun */}
        <path d="M 10 940 Q 20 1040 90 1052 Q 180 1050 220 980 L 200 900 Z" fill="#b0805e" stroke="#1b1412" strokeWidth={5} />
        {/* baş (arkadan 3/4: yüz kadraj sağına, böceğe dönük) */}
        <ellipse cx={110} cy={820} rx={168} ry={192} fill="#d0a07a" stroke="#1b1412" strokeWidth={6} />
        <path d="M 248 870 Q 286 930 262 1000 Q 236 1030 214 1010" fill="#c8966e" stroke="#1b1412" strokeWidth={5} />
        {/* bıyık ucu yanaktan taşar (kimlik işareti) */}
        <path d="M 262 968 Q 300 972 306 998 Q 284 992 262 992 Z" fill="#9a948c" stroke="#1b1412" strokeWidth={4} />
        {/* kır saç çemberi (ense + şakak) */}
        <path d="M -52 800 Q -70 900 -20 978 Q 60 1040 170 1010 Q 236 990 252 930 Q 214 960 160 966 Q 60 968 2 900 Q -30 860 -26 790 Z" fill="#9a948c" stroke="#1b1412" strokeWidth={5} strokeLinejoin="round" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-30 + i * 46} ${930 + Math.abs(i - 2) * 12} q 12 14 28 16`} stroke="#7a746c" strokeWidth={4} fill="none" />)}
        {/* kulak */}
        <ellipse cx={244} cy={880} rx={26} ry={44} fill="#c08a64" stroke="#1b1412" strokeWidth={5} />
        <path d="M 240 856 Q 254 880 240 904" stroke="#8a5a40" strokeWidth={4} fill="none" />
        {/* kel tepe parlaması + yağmur damlaları */}
        <ellipse cx={70} cy={700} rx={70} ry={30} fill="#fff" opacity={0.42} transform="rotate(-18 70 700)" />
        {[[30, 760], [150, 740], [96, 860], [190, 820]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={6} ry={9} fill="#e8f4ff" opacity={0.7} />)}
      </g>
    </g>
  );
};

/* =====================================================================================
 *  P2_KASA
 *  prm: cam [[t,cx,cy,z]], adim [[t, x, y, s, egil, tt, saldir]] (basamak: karanlıkta konum sıçrar),
 *       ece [EX, EY, S] | null, sabri bool, dark [[a,b]], red, acilis (sn), kapanis (sn)
 * ===================================================================================== */
const P2Kasa: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const p = prm(text);
  const uid = "p2k";
  const ece = castById("ece_sivil");
  const [cx, cy, z] = kf(p.cam, t, [560, 960, 1]);
  const L = lamba(t, fps, p.dark);
  const adimlar: [number, number[]][] = (p.adim ?? [[0, 880, 1345, 1.212, 0.15, 7, 0]]).map((a: number[]) => [a[0], a.slice(1)]);
  const [bx, by, bs, egil, tt, saldir] = basamak(adimlar, t, adimlar[0][1]);
  const bocek = <DevBocek t={tt} acil={1} kanat={0.5} mand={0.32} egil={egil} anten={820} antenSal={0.6} parlak={1} salya={1} isik={Math.max(0.15, L)} kalinti={1} nefes={0} saldir={saldir ?? 0} uid={uid} />;
  const eceP: number[] | null = p.ece === null ? null : p.ece ?? [360, 1500, 1.65];
  const tit = (Math.sin(t * 41) * 2 + Math.sin(t * 23) * 1.4) * (p.titre ?? 1);
  const egK = Math.min(1, Math.max(0, (bs - 1.2) / 0.8));
  const [shx, shy] = sars(t, f, p.hits, 10);
  const op = 1 - (p.acilis ? sstep(0, p.acilis, t) : 1);
  // floresan havuzu (tavan, sahne üstü) ve kırmızı saat (kameranın arkası, kapı tarafı): ekran koordinatı
  const toS = (wx: number, wy: number) => [540 + (wx - cx) * z, 960 + (wy - cy) * z];
  const [fxs, fys] = toS(520, 60);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden", isolation: "isolate" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: camT(cx, cy, z, shx, shy), filter: "saturate(0.7) contrast(1.16) brightness(0.95)" }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id={`${uid}golG`} x1="0" y1="0" x2="0" y2="1"><stop offset="0.3" stopColor="#fff" stopOpacity={0} /><stop offset="1" stopColor="#fff" stopOpacity={0.72} /></linearGradient>
            <mask id={`${uid}golM`} maskUnits="userSpaceOnUse" x={-1600} y={-1600} width={3200} height={1700}><rect x={-1600} y={-1100} width={3200} height={1110} fill={`url(#${uid}golG)`} /></mask>
            <filter id={`${uid}siyah`}><feColorMatrix type="matrix" values="0 0 0 0 0.02  0 0 0 0 0.01  0 0 0 0 0.02  0 0 0 1 0" /></filter>
            <filter id={`${uid}kenar`} x="-10%" y="-10%" width="120%" height="120%"><feOffset in="SourceAlpha" dy={8} result="asag" /><feComposite in="SourceAlpha" in2="asag" operator="out" result="ust" /><feColorMatrix in="ust" type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.94  0 0 0 0 1  0 0 0 0.75 0" /></filter>
            <filter id={`${uid}bl`}><feGaussianBlur stdDeviation="4" /></filter>
            <filter id={`${uid}ebl`}><feGaussianBlur stdDeviation={p.eceBlur ?? 0.8} /></filter>
          </defs>
          <Market724BG view="kasa" frame={0} doorOpen={0} saat="06:03" iz={0} turb={0} depoAcik={1} />
          {/* depo önünde kalan iki deri yığını ve ambalaj (B5 sürekliliği) */}
          <g transform="translate(776 1347) scale(0.87)"><DeriYigin t={2} /></g>
          <g transform="translate(993 1347) scale(-0.78 0.78)"><DeriYigin t={2} /></g>
          <g transform="translate(1028 1342) rotate(78) scale(1.04)">
            <path d="M -12 -40 L 12 -38 L 11 10 L -11 9 Z" fill="#5a2a8a" stroke="#2b1d1a" strokeWidth={2.5} />
            <rect x={-11} y={-20} width={22} height={11} fill="#f2c21a" />
          </g>
          {/* dev böcek: taban + alt gövde gölgesi + üstten kenar ışığı */}
          <ellipse cx={bx} cy={by + 6} rx={420 * (bs / 1.212)} ry={36 * (bs / 1.212)} fill="#000" opacity={0.42} filter={`url(#${uid}bl)`} />
          <g transform={`translate(${bx} ${by}) scale(${bs})`}>
            {bocek}
            <g mask={`url(#${uid}golM)`}><g filter={`url(#${uid}siyah)`}>{bocek}</g></g>
            <g filter={`url(#${uid}kenar)`} opacity={0.8 * L}>{bocek}</g>
          </g>
          {/* Ece arkadan: başı böceğe kalkık, omuzlar kasık, titrer */}
          {eceP ? (
            <g filter={`url(#${uid}ebl)`} transform={`translate(${eceP[0] + tit} ${eceP[1]}) scale(${eceP[2]}) translate(-200 -300)`}>
              <Bas25D look={ece} aci={176 - 6 * egK} katman="arka" kuyrukSal={1.5 * Math.sin(t * 2)} kuyrukIleri={-6 - 6 * egK} uid={`${uid}ek`} />
              <Govde25D look={ece} aci={178 - 4 * egK} omuz={16 + 6 * egK + 1.5 * Math.sin(t * 31)} uid={`${uid}eg`} />
              <g transform={`rotate(${-7 - 9 * egK} 200 300) translate(0 ${-10 - 6 * egK})`}>
                <Bas25D look={ece} aci={176 - 6 * egK} emotion="dehset" pale={0.6} dagin={1} kuyrukSal={1.5 * Math.sin(t * 2)} kuyrukIleri={-6 - 6 * egK} isik={0.5} kenar={1} uid={`${uid}eb`} />
              </g>
            </g>
          ) : null}
          {p.sabri ? <g transform={`translate(${p.sabriDx ?? 0} 0)`}><SabriEnse uid={uid} blur={p.sabriBlur ?? 7} t={t} /></g> : null}
        </svg>
      </AbsoluteFill>
      <Isik L={L * (p.base ?? 0.92)} fx={fxs} fy={fys} fr={1350 * z} fEdge={0.38} red={p.red ?? 0.1} rx={540} ry={2050} rr={1750} amb={0.012} />
      {/* karanlıkta: böceğin gözlerinde kırmızı saatin cılız yansıması (yalnız karanlıkta, kıpırtısız) */}
      {L < 0.1 && p.goz ? (() => {
        const hx = bx, hy = by - (770 - 110 * egil) * bs;
        const [sx1, sy1] = toS(hx - 66 * bs, hy - 6 * bs), [sx2, sy2] = toS(hx + 66 * bs, hy - 6 * bs);
        return (
          <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            {[[sx1, sy1], [sx2, sy2]].map(([x, y], i) => <ellipse key={i} cx={x + shx} cy={y + shy} rx={4 * z * (bs / 1.2)} ry={2.4 * z * (bs / 1.2)} fill="#ff4a30" opacity={0.55} />)}
          </svg>
        );
      })() : null}
      <Siyah o={op} />
      {p.kapanis ? <Siyah o={1} /> : null}
    </AbsoluteFill>
  );
};

/* =====================================================================================
 *  KEPENK (kapı görünümü, cam vitrinin dışında): iniş (yerçekimi + sekme), vuruş göçükleri
 *  (çıtalar göçüğün etrafında bükülür), titreşim, toz. Dünya koordinatı (kapı görünümü).
 * ===================================================================================== */
type Gocuk = { t: number; x: number; y: number; r: number; d: number };
const KEP_TOP = 420, KEP_BOT = 1190;
const kepenkK = (t: number, t0: number | undefined): number => {
  if (t0 === undefined || t0 === null) return 0;
  const d = t - t0;
  if (d <= 0) return 0;
  const T = 0.2;
  if (d < T) return (d / T) ** 2;
  const b = d - T;
  return 1 - 0.035 * Math.exp(-b * 18) * Math.abs(Math.sin(b * 30));
};
const gocukDerin = (g: Gocuk, t: number) => (t < g.t ? 0 : g.d * (1 - Math.exp(-(t - g.t) * 60)));
const Kepenk2: React.FC<{ k: number; t: number; f: number; gocuk: Gocuk[]; uid: string; x0?: number; x1?: number; top?: number; bot?: number; aralik?: number }> = ({ k, t, f, gocuk, uid, x0 = -40, x1 = 1120, top = KEP_TOP, bot = KEP_BOT, aralik = 26 }) => {
  if (k <= 0.001) return null;
  const h = (bot - top) * Math.min(1, k);
  // titreşim: son vuruştan sonra sönümlü
  let vib = 0;
  for (const g of gocuk) {
    const d = t - g.t;
    if (d >= 0 && d < 0.5) vib += Math.exp(-d * 9) * Math.sin(d * 150) * 5;
  }
  const n = Math.ceil((bot - top) / aralik) + 2;
  const bump = (x: number, y: number) => {
    let v = 0;
    for (const g of gocuk) {
      const dd = gocukDerin(g, t);
      if (dd <= 0) continue;
      const q = ((x - g.x) ** 2 + (y - g.y) ** 2) / (g.r * g.r);
      if (q < 4) v += dd * Math.exp(-q * 1.6);
    }
    return v;
  };
  const N = 44;
  return (
    <g transform={`translate(0 ${vib * 0.4})`}>
      <defs>
        <linearGradient id={`${uid}kpG`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a9096" /><stop offset="0.5" stopColor="#6a7076" /><stop offset="1" stopColor="#4a5056" /></linearGradient>
        <clipPath id={`${uid}kpC`}><rect x={x0} y={top} width={x1 - x0} height={h} /></clipPath>
        <radialGradient id={`${uid}goc`} cx="0.45" cy="0.3" r="0.62"><stop offset="0" stopColor="#e8eef2" stopOpacity={0.7} /><stop offset="0.45" stopColor="#7a8086" stopOpacity={0.05} /><stop offset="0.8" stopColor="#14181c" stopOpacity={0.6} /><stop offset="1" stopColor="#0a0c0e" stopOpacity={0} /></radialGradient>
      </defs>
      <g clipPath={`url(#${uid}kpC)`}>
        <rect x={x0} y={top} width={x1 - x0} height={bot - top} fill={`url(#${uid}kpG)`} />
        {new Array(n).fill(0).map((_, i) => {
          const y = top + h - (bot - top) - aralik + i * aralik;
          const pts: string[] = [], pts2: string[] = [];
          for (let j = 0; j <= N; j++) {
            const x = x0 + ((x1 - x0) * j) / N;
            const b = bump(x, y);
            pts.push(`${j ? "L" : "M"} ${x.toFixed(0)} ${(y + b * 0.55).toFixed(1)}`);
            pts2.push(`${j ? "L" : "M"} ${x.toFixed(0)} ${(y + 6 + b * 0.55).toFixed(1)}`);
          }
          return (
            <g key={i}>
              <path d={pts.join(" ")} stroke="#3a3e42" strokeWidth={aralik * 0.16} fill="none" />
              <path d={pts2.join(" ")} stroke="#a8aeb4" strokeWidth={aralik * 0.12} fill="none" opacity={0.6} />
            </g>
          );
        })}
        {gocuk.map((g, i) => {
          const dd = gocukDerin(g, t);
          if (dd <= 0) return null;
          const s = Math.min(1, dd / g.d);
          return (
            <g key={i}>
              <ellipse cx={g.x} cy={g.y} rx={g.r * 1.15 * s} ry={g.r * 0.95 * s} fill={`url(#${uid}goc)`} />
              {[0, 1, 2, 3, 4].map((j) => {
                const a = (j / 5) * Math.PI * 2 + random(`kr${i}${j}`) * 0.8;
                const r0 = g.r * 0.25 * s, r1 = g.r * (0.8 + 0.3 * random(`kq${i}${j}`)) * s;
                return <path key={j} d={`M ${g.x + Math.cos(a) * r0} ${g.y + Math.sin(a) * r0 * 0.85} L ${g.x + Math.cos(a + 0.15) * (r0 + r1) / 2} ${g.y + Math.sin(a + 0.15) * ((r0 + r1) / 2) * 0.85} L ${g.x + Math.cos(a) * r1} ${g.y + Math.sin(a) * r1 * 0.85}`} stroke="#1a1e22" strokeWidth={Math.max(2, g.r * 0.035)} fill="none" opacity={0.55} strokeLinejoin="round" />;
              })}
            </g>
          );
        })}
        <rect x={x0} y={top + h - 40} width={x1 - x0} height={40} fill="#3a3e42" />
        <rect x={500} y={top + h - 34} width={80} height={24} rx={4} fill="#c8a03a" stroke="#1b1412" strokeWidth={3} />
      </g>
      <rect x={x0} y={top - 30} width={x1 - x0} height={34} fill="#2a2e32" />
      {/* vuruşlarda üst kutudan dökülen toz */}
      {gocuk.flatMap((g, i) =>
        new Array(10).fill(0).map((_, j) => {
          const d = t - g.t - j * 0.012;
          if (d < 0 || d > 1.1) return null;
          const x = g.x + (random(`tz${i}-${j}`) - 0.5) * 420;
          const y = top + 4 + 500 * d * d + 30 * d;
          return <circle key={`${i}-${j}`} cx={x + Math.sin(d * 9 + j) * 8} cy={y} r={2 + random(`tr${i}-${j}`) * 3} fill="#c8c4b8" opacity={0.55 * (1 - d / 1.1)} />;
        })
      )}
      {f < -1 ? null : null}
    </g>
  );
};

/* =====================================================================================
 *  P2_KAPI
 *  prm: cam [[t,cx,cy,z]], kepenk t0, gocuk [[t,x,y,r,d]], dark, kapali (floresan tamamen sönük),
 *       red (kırmızı saat şiddeti), eceDuygu [[t,emo]], bak [[t,lookX,lookY,yaw]], agiz [[t,k]],
 *       gozyasi [[t,v]], pale, uzan [[t,k]], sabri bool, sabriYok t, sabriDuygu, irk [t...] (irkilme),
 *       omuzBocek [[t,k]] (omza tırmanan böcekler), anten [[t,k]], acilis, kapanis
 * ===================================================================================== */
const P2Kapi: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const p = prm(text);
  const uid = "p2c";
  const ece = castById("ece_sivil");
  const sabri = castById("sabri");
  const [cx, cy, z] = kf(p.cam, t, [560, 1000, 1.2]);
  const L = lamba(t, fps, p.dark, p.kapali, p.acik);
  // üç kepenk (sol vitrin, kapı, sağ vitrin): [x0, x1, iniş anı (çarpma)]
  const kBol: number[][] = p.kepenkler ?? (p.kepenk !== undefined ? [[-40, 1120, p.kepenk + 0.2]] : []);
  const kk = Math.max(0, ...kBol.map((b) => kepenkK(t, b[2] - 0.2)));
  const gocuk: Gocuk[] = (p.gocuk ?? []).map((g: number[]) => ({ t: g[0], x: g[1], y: g[2], r: g[3], d: g[4] }));
  const hits = [...kBol.map((b) => b[2]), ...gocuk.map((g) => g.t)];
  const [shx, shy, sa] = sars(t, f, hits, p.sarsAmp ?? 9);
  // irkilme: her vuruşta karakterler sıçrar (yaylı)
  let irk = 0;
  for (const h of [...hits, ...(p.irk ?? [])]) {
    const d = t - h;
    if (d >= 0 && d < 0.5) irk = Math.max(irk, Math.exp(-d * 9) * Math.abs(Math.sin(d * 18 + 0.3)));
  }
  const emo = basamak<string>(p.eceDuygu, t, "dehset") as Emotion;
  const [lx, ly, yaw] = kf(p.bak, t, [0.45, -0.05, 0.15]);
  const [ak] = kf(p.agiz, t, [0]);
  const [gy] = kf(p.gozyasi, t, [0.2]);
  const [uz] = kf(p.uzan, t, [0]);
  const sabriVar = p.sabri !== false && !(p.sabriYok !== undefined && t >= p.sabriYok);
  const tit = (Math.sin(t * 43) * 2.2 + Math.sin(t * 27) * 1.3) * (p.titre ?? 1);
  // kollar: ağız kapama (önkol yukarı) ↔ yanda; uzanma: sağ el (kadraj solu) yana-arkaya uzanır
  const armMouth = { upper: -30, fore: -150, ul: 0.5, fl: 1 };
  const armRest = { upper: 6, fore: 0 };
  const mix = (a: { upper: number; fore: number; ul?: number; fl?: number }, b: { upper: number; fore: number; ul?: number; fl?: number }, k: number) => ({ upper: a.upper + (b.upper - a.upper) * k, fore: a.fore + (b.fore - a.fore) * k, ul: (a.ul ?? 1) + ((b.ul ?? 1) - (a.ul ?? 1)) * k, fl: (a.fl ?? 1) + ((b.fl ?? 1) - (a.fl ?? 1)) * k });
  const reach = { upper: 62, fore: -18, ul: 0.95, fl: 1 };
  let armL = mix(mix(armRest, armMouth, ak), reach, uz);
  const armR = mix(armRest, armMouth, ak);
  // sessiz boğuşma (opt-in `bogusma`): kadraj sağındaki el ağızda, öteki kol panikle silkeler; gövde ürperir, sendeler
  const bg = p.bogusma as Prm | undefined;
  let tekEl: "sag" | "sol" | undefined;
  let bTit = 0, bTilt = 0, bX = 0, bY = 0;
  if (bg) {
    const [u, fo, ul, fl, osc] = kf(bg.kolL, t, [6, 0, 1, 1, 0]);
    const sw = osc * (Math.sin(t * 44) * 0.7 + Math.sin(t * 29 + 1) * 0.3);
    armL = { upper: u + sw * 0.35, fore: fo + sw, ul, fl };
    tekEl = basamak<string>(bg.tekEl, t, "sag") === "iki" ? undefined : "sag";
    const [sh] = kf(bg.titre, t, [1]);
    bTit = (Math.sin(t * 51) * 4 + Math.sin(t * 33) * 2.5) * sh;
    bY = Math.abs(Math.sin(t * 23)) * 6 * sh;
    const [eg, ox] = kf(bg.egim, t, [0, 0]);
    bTilt = eg + Math.sin(t * 17) * 2.5 * sh;
    bX = ox;
  }
  const eceSize = 1560, eceX = 610 + tit + bTit + bX, eceFeet = 2330 - 18 * irk - bY;
  const saSize = 1180, saX = 440, saFeet = 1790 - 14 * irk;
  const [ob] = kf(p.omuzBocek, t, [0]);
  const [an] = kf(p.anten, t, [0]);
  const toS = (wx: number, wy: number) => [540 + (wx - cx) * z + shx, 960 + (wy - cy) * z + shy];
  const [fxs, fys] = toS(540, 190);
  const [rxs, rys] = toS(p.redX ?? 600, p.redY ?? 860);
  const op = p.acilis ? 1 - sstep(0, p.acilis, t) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden", isolation: "isolate" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: camT(cx, cy, z, shx, shy), filter: "saturate(0.7) contrast(1.16) brightness(0.95)" }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <defs><filter id={`${uid}bg`}><feGaussianBlur stdDeviation={p.bgBlur ?? 3} /></filter></defs>
          <g filter={(p.bgBlur ?? 3) > 0 ? `url(#${uid}bg)` : undefined}>
            <Market724BG view="kapi" frame={f} doorOpen={p.door ?? 0.72} saat="06:03" iz={1} turb={0} />
            {kBol.map((b, i) => <Kepenk2 key={i} k={kepenkK(t, b[2] - 0.2)} t={t} f={f} gocuk={gocuk.filter((g) => g.x >= b[0] && g.x < b[1])} uid={`${uid}${i}`} x0={b[0]} x1={b[1]} />)}
            {kk > 0 ? (
              <g>
                {/* kepengin önünde kalan cam: kayıtlar, ters neon */}
                {[0, 300, 800, 1080].map((x) => <rect key={x} x={x - 9} y={420} width={18} height={770} fill="#9aa2a8" />)}
                <rect x={0} y={596} width={1080} height={18} fill="#9aa2a8" />
                <rect x={850} y={560} width={200} height={60} rx={12} fill="#ff4a8a" opacity={0.2} />
                <text x={950} y={604} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={40} fill="#ff6aa0" transform="scale(-1 1) translate(-1900 0)">AÇIK 7/24</text>
                <rect x={0} y={420} width={1080} height={770} fill="#a8c4d8" opacity={0.07} />
              </g>
            ) : null}
          </g>
          {/* ışık sönükken arka plan (kapı, kepenk, Sabri'nin yeri) kırmızı saatin erişmediği karanlıkta kalır */}
          {p.bgKaranlik ? <rect x={-400} y={-400} width={1900} height={2800} fill="#000" opacity={p.bgKaranlik * (1 - L)} /> : null}
        </svg>
        {sabriVar ? (
          <div style={{ position: "absolute", left: saX - saSize * 0.2, top: saFeet - 0.98 * saSize, filter: `blur(${p.sabriBlur ?? 2}px)` }}>
            <Character look={sabri} size={saSize} pose={{ emotion: (p.sabriDuygu ?? "korkmus") as Emotion, yagmur: 1, lookX: p.sabriBak ?? 0.5, yaw: 0.2, golgesiz: false, seed: 23 }} />
          </div>
        ) : null}
        <div style={{ position: "absolute", left: eceX - eceSize * 0.2, top: eceFeet - 0.98 * eceSize }}>
          <Character look={ece} size={eceSize} pose={{ emotion: emo, lookX: lx, lookY: ly, yaw, pale: p.pale ?? 0.7, sacDagin: true, tears: gy, armL, armR, agizKapa: ak, agizKapaEl: tekEl, tilt: bg ? bTilt : undefined, elTitre: 1, dudakTitre: p.dudak ?? 0, golgesiz: false, seed: 41, eyesClosed: (() => {
            const base = p.gozKapa ? kf(p.gozKapa, t, [0])[0] : 0;
            let w = 0;
            if (p.irkGoz) for (const h of hits) { const d = t - h; if (d >= 0 && d < 0.3) w = Math.max(w, 0.85 * (1 - d / 0.3)); }
            const v = Math.max(base, w);
            return v > 0.01 ? v : undefined;
          })(), hik: p.hik !== undefined && t > p.hik ? (t - p.hik) / 0.8 : undefined, yutkun: p.yutkun !== undefined ? (t - p.yutkun) / 0.7 : undefined, gozSok: p.gozSok !== undefined && t > p.gozSok ? Math.min(1, (t - p.gozSok) / 0.12) * 0.7 : undefined }} />
        </div>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <Market724FG view="kapi" frame={f} doorOpen={0} saat="" iz={0} turb={0} />
          <MiniDefs uid={uid} />
          {ob > 0 ? <OmuzBocek uid={uid} t={p.donBocek !== undefined ? Math.min(t, p.donBocek) : t} k={ob} sx={eceX} top={eceFeet - 0.98 * eceSize} size={eceSize} /> : null}
          {bg ? <SilkBocek uid={uid} t={t} sx={eceX} top={eceFeet - 0.98 * eceSize} size={eceSize} silk={bg.silk ?? []} yagan={bg.yagan ?? []} /> : null}
        </svg>
      </AbsoluteFill>
      {an > 0 ? <AntenFG t={t} k={an} /> : null}
      <Isik L={L * (p.base ?? 0.95)} fx={fxs} fy={fys} fr={(p.fr ?? 1250) * z} fEdge={p.fEdge ?? 0.4} red={p.red ?? 0.12} rx={rxs} ry={rys} rr={(p.redR ?? 760) * z} amb={0.01} />
      {sa > 0.02 ? <AbsoluteFill style={{ backgroundColor: "#000", opacity: 0 }} /> : null}
      <Siyah o={op} />
    </AbsoluteFill>
  );
};

/** boğuşma böcekleri: `yagan` [t0, x, yKonma] yukarıdan (kadraj dışından) düşüp gövdeye konar; `silk` [t0, x0, y0, x1, y1, tSilk, yön]
 *  kazaktan tırmanır, el çarptığında dönerek kadraj dışına savrulur. Koordinatlar rig birimi (x 0..400, y 0..1000). */
const SilkBocek: React.FC<{ uid: string; t: number; sx: number; top: number; size: number; silk: number[][]; yagan: number[][] }> = ({ uid, t, sx, top, size, silk, yagan }) => {
  const S = size / 1000;
  const X = (lx: number) => sx - 200 * S + lx * S, Y = (ly: number) => top + ly * S;
  const out: React.ReactNode[] = [];
  yagan.forEach(([t0, lx, ly], i) => {
    const d = t - t0;
    if (d < 0) return;
    const T = 0.32;
    const k = Math.min(1, d / T);
    const yy = -700 + (ly + 700) * k * k;
    const sek = d > T ? Math.max(0, Math.sin((d - T) * 20) * Math.exp(-(d - T) * 8)) * 14 : 0;
    const a = d < T ? Math.PI / 2 + d * 9 : -Math.PI / 2 + Math.sin(t * 7 + i) * 0.4 - 0.3 * (d - T);
    out.push(<Mb key={`y${i}`} uid={uid} x={X(lx + (d > T ? Math.sin(t * 5 + i) * 6 : 0))} y={Y(yy - sek - (d > T ? 30 * (d - T) : 0))} a={a} s={52 * S} ph={t * 13 + i} />);
  });
  silk.forEach(([t0, x0, y0, x1, y1, ts, yon], i) => {
    const d = t - t0;
    if (d < 0) return;
    if (t < ts) {
      const u = Math.min(1, d / Math.max(0.1, ts - t0));
      const lx = x0 + (x1 - x0) * u + Math.sin(t * 9 + i) * 5, ly = y0 + (y1 - y0) * u;
      out.push(<Mb key={`s${i}`} uid={uid} x={X(lx)} y={Y(ly)} a={Math.atan2(y1 - y0, x1 - x0) + Math.sin(t * 7 + i) * 0.25} s={48 * S} ph={t * 13 + i} />);
    } else {
      // el çarptı: dönerek savrulur (kadraj dışına)
      const e = t - ts;
      const lx = x1 + yon * 900 * e, ly = y1 - 500 * e + 1400 * e * e;
      if (e > 0.9) return;
      out.push(<Mb key={`s${i}`} uid={uid} x={X(lx)} y={Y(ly)} a={e * 22 * yon} s={48 * S} ph={t * 30 + i} />);
    }
  });
  return <g>{out}</g>;
};

/** omza ve kola tırmanan küçük böcekler (Ece'nin sağ omzu = kadraj solu, sol kolu = kadraj sağı) */
const OmuzBocek: React.FC<{ uid: string; t: number; k: number; sx: number; top: number; size: number }> = ({ uid, t, k, sx, top, size }) => {
  const S = size / 1000;
  // yollar: kazağın alt kenarından omza (yerel rig birimi: x 0..400, y 0..1000)
  const yollar: [number, number, number, number, number][] = [
    // x0, y0, x1, y1, başlangıç (k)
    [120, 700, 136, 372, 0], [292, 720, 268, 380, 0.12], [150, 760, 118, 470, 0.3], [262, 770, 300, 520, 0.42], [196, 740, 160, 420, 0.55], [230, 760, 252, 450, 0.7],
  ];
  return (
    <g>
      {yollar.map(([x0, y0, x1, y1, s0], i) => {
        const u = Math.max(0, Math.min(1, (k - s0) / 0.45));
        if (u <= 0) return null;
        const wob = Math.sin(t * 9 + i * 2) * 6;
        const lx = x0 + (x1 - x0) * u + wob, ly = y0 + (y1 - y0) * u;
        const a = Math.atan2(y1 - y0, x1 - x0) + Math.sin(t * 7 + i) * 0.25;
        return <Mb key={i} uid={uid} x={sx - 200 * S + lx * S} y={top + ly * S} a={a} s={(46 + (i % 3) * 8) * S} ph={t * 12 + i} />;
      })}
    </g>
  );
};

/** kameranın hemen yanındaki dev böceğin antenleri: kadrajın sağ üstünden flu, yoklayarak girer */
const AntenFG: React.FC<{ t: number; k: number }> = ({ t, k }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <defs><filter id="p2afb"><feGaussianBlur stdDeviation="2.4" /></filter></defs>
    <g filter="url(#p2afb)" opacity={Math.min(1, k * 1.5)}>
      <Anten kok={[1180, -160]} a0={128 - 10 * k} L={500 + 520 * k} buk={-120 + 30 * Math.sin(t * 1.3)} t={t} faz={0.6} w={4.2} sal={1.2} seg={34} />
      <Anten kok={[1260, -60]} a0={140 - 8 * k} L={420 + 380 * k} buk={-60 - 40 * Math.sin(t * 1.1)} t={t} faz={2.1} w={4.2} sal={1.2} seg={34} />
    </g>
  </svg>
);

/* =====================================================================================
 *  P2_KEPENK: kepengin içeriden yakın planı (cam + kayıt önde, ters neon parıltısı)
 *  prm: gocuk [[t,x,y,r,d]], dark, red, cam [[t, z]]
 * ===================================================================================== */
const P2Kepenk: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const p = prm(text);
  const uid = "p2kp";
  const gocuk: Gocuk[] = (p.gocuk ?? []).map((g: number[]) => ({ t: g[0], x: g[1], y: g[2], r: g[3], d: g[4] }));
  const [shx, shy] = sars(t, f, gocuk.map((g) => g.t), 14);
  const L = lamba(t, fps, p.dark);
  const [z] = kf(p.cam, t, [1]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden", isolation: "isolate" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: camT(540, 960, z, shx, shy) }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
          <defs>
            <filter id={`${uid}nb`}><feGaussianBlur stdDeviation="16" /></filter>
            <filter id={`${uid}fb`}><feGaussianBlur stdDeviation="5" /></filter>
          </defs>
          <Kepenk2 k={1} t={t} f={f} gocuk={gocuk} uid={uid} x0={-120} x1={1200} top={-120} bot={2040} aralik={58} />
          {/* cam: yansıma çizgileri, ters neon (flu), önde alüminyum kayıt */}
          <g filter={`url(#${uid}fb)`}>
            <rect x={-100} y={1240} width={1300} height={60} fill="#9aa2a8" />
            <text x={300} y={1600} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={190} fill="#ff6aa0" opacity={0.85} transform="scale(-1 1) translate(-600 0)">AÇIK</text>
          </g>
          <text x={300} y={1600} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={190} fill="#ff4a8a" opacity={0.55} filter={`url(#${uid}nb)`} transform="scale(-1 1) translate(-600 0)">AÇIK</text>
          <rect x={860} y={-200} width={70} height={2400} fill="#8a9298" />
          <rect x={872} y={-200} width={14} height={2400} fill="#c8ced4" opacity={0.7} />
          {[120, 520].map((x, i) => <path key={i} d={`M ${x} -100 l 260 2200`} stroke="#ffffff" strokeWidth={40} opacity={0.035} />)}
        </svg>
      </AbsoluteFill>
      <Isik L={L * 0.9} fx={540} fy={-300} fr={1900} fEdge={0.45} red={p.red ?? 0.1} rx={300} ry={1600} rr={900} amb={0.02} tint={[0.95, 0.98, 1]} />
    </AbsoluteFill>
  );
};

/* =====================================================================================
 *  P2_KORİDOR: raf koridoru (tek kaçış noktası). Tavan floresanları tek tek söner; raflardan
 *  böcekler çıkar, raflar "erir" (kaynaşan sel rafların yüzünden aşağı akar, paketler devrilir),
 *  zemini kaplayan sel kameraya akar. h küçükse zemin çekimi (önde Ece'nin bacakları, arkadan).
 *  prm: cam [[t,cx,cy,z]], h (göz yüksekliği m), vy, lambalar [[koyu aralıklar], kapanma t] x4,
 *       cik [t0, t1] (tek tük çıkış), erime [t0, hız m/sn, gecikme sn/m], sel [t0, t1, Z0, Z1], bacak bool
 * ===================================================================================== */
const KX = 0.7, KZ_END = 6.2, KF_ = 760;
const RAF_Y = [0.1, 0.52, 0.94, 1.36];
const LAMBA_Z = [1.3, 2.7, 4.1, 5.4];
const P2Koridor: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const p = prm(text);
  const uid = "p2r";
  const h = p.h ?? 1.6, VY = p.vy ?? 860;
  const P = (X: number, Y: number, Z: number): [number, number] => [540 + (X * KF_) / Z, VY - ((Y - h) * KF_) / Z];
  const poly = (pts: [number, number][]) => `M ${pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L ")} Z`;
  const yuzX = (X: number, Z1: number, Z2: number, Y1: number, Y2: number) => poly([P(X, Y1, Z1), P(X, Y1, Z2), P(X, Y2, Z2), P(X, Y2, Z1)]);
  const yuzY = (Y: number, X1: number, X2: number, Z1: number, Z2: number) => poly([P(X1, Y, Z1), P(X2, Y, Z1), P(X2, Y, Z2), P(X1, Y, Z2)]);
  const [cx, cy, z] = kf(p.cam, t, [540, 960, 1]);
  const ZN = p.zn ?? 0.75;
  const lambaL = LAMBA_Z.map((_, i) => {
    const d = p.lambalar?.[i];
    return lamba(t, fps, d?.[0], d?.[1]);
  });
  // erime: rafların yüzünde kaynaşan selin alt kenarı (Y), Z'ye ve zamana göre
  const [e0, eV, eLag] = p.erime ?? [99, 0.9, 0.35];
  const erY = (Z: number, side: number) => {
    const t0 = e0 + (KZ_END - Z) * eLag + 0.25 * (0.5 + 0.5 * Math.sin(Z * 3.1 + side * 1.7));
    if (t < t0) return 2.05;
    const parmak = 0.09 * Math.abs(Math.sin(Z * 9.7 + side * 2.1)) ** 2 + 0.03 * Math.sin(Z * 23 + t * 2);
    return Math.max(-0.05, 2.0 - eV * (t - t0) - parmak);
  };
  const [s0, s1, sZ0, sZ1] = p.sel ?? [99, 100, 6, 1];
  const Zf = t < s0 ? 99 : sZ0 + (sZ1 - sZ0) * Math.min(1, (t - s0) / (s1 - s0)) ** 0.85;
  const [c0] = p.cik ?? [99, 100];
  const urunler: React.ReactNode[] = [];
  // zorunlu düşüşler: dusus [çarpma anları], dususYer [[side, raf, Zmin, Zmax]]
  const zorla: Record<string, number> = {};
  ((p.dusus ?? []) as number[]).forEach((tt, i) => {
    const yer: number[][] = p.dususYer ?? [[-1, 3, 1.4, 2.4], [1, 2, 1.4, 2.4]];
    const [sd, rr, za, zb] = yer[i % yer.length];
    const zz = za + (zb - za) * random(`zd${i}`);
    const zi = Math.max(0, Math.round((zz - 0.8) / 0.2));
    zorla[`${sd}|${rr}|${zi}`] = tt;
  });
  const dusenler: React.ReactNode[] = [];
  for (const side of [-1, 1]) {
    const X = side * KX;
    RAF_Y.forEach((Y0, r) => {
      for (let zi = 0; ; zi++) {
        const Z1 = 0.8 + zi * 0.2;
        if (Z1 > 5.9) break;
        const Z2 = Z1 + 0.17;
        const Zc = (Z1 + Z2) / 2;
        if (Zc < ZN - 0.1) continue;
        const ph = [0.3, 0.16, 0.24, 0.12, 0.28, 0.2][(zi * 7 + r * 3 + (side > 0 ? 2 : 0)) % 6];
        const renk = ["#d8402e", "#2f6fd0", "#e8a628", "#2f9e5a", "#e86a9a", "#f2f0e6", "#7a4ad0", "#e85a1a"][(zi * 3 + r * 5 + (side > 0 ? 1 : 0)) % 8];
        // düşme: erime kenarı ürünün üstüne gelince devrilir
        const ey = erY(Zc, side);
        const ust = Y0 + 0.02 + ph;
        const seed = `${side}${r}${zi}`;
        const zor = zorla[`${side}|${r}|${zi}`];
        if (zor !== undefined) {
          // ses olayına bağlı düşüş: çarpma anı = zor
          const Yb = Y0 + 0.02;
          const T = Math.sqrt((2 * Yb) / 9.8);
          const d = t - (zor - T);
          if (d < 0) {
            // ses olayından önce sallanır (arkasındaki küme iter)
            const sal = p.kume && d > -0.7 ? side * (3 + 5 * (1 + d / 0.7)) * Math.sin(d * 38) * (1 + d / 0.7) : 0;
            const [bx, by] = P(X, Y0 + 0.02, Zc);
            urunler.push(<path key={`u${seed}`} d={yuzX(X * 0.995, Z1, Z2, Y0 + 0.02, ust)} fill={renk} stroke="#1b1412" strokeWidth={Math.max(0.6, 2.4 / Zc)} transform={sal ? `rotate(${sal.toFixed(2)} ${bx.toFixed(1)} ${by.toFixed(1)})` : undefined} />);
          } else {
            const yy = Math.max(0.03, Yb + ph / 2 - 4.9 * d * d);
            const xx = X - side * Math.min(0.2, 0.35 * d);
            const [px, py] = P(xx, yy, Zc);
            const w = (0.17 * KF_) / Zc, hh = (ph * KF_) / Zc;
            const yerde = d >= T;
            const sek = yerde ? Math.max(0, Math.sin((d - T) * 22) * Math.exp(-(d - T) * 9)) * 0.04 : 0;
            const [qx, qy] = P(xx, yy + sek, Zc);
            dusenler.push(
              <g key={`z${seed}`} transform={`translate(${yerde ? qx : px} ${yerde ? qy : py}) rotate(${yerde ? 84 : side * -Math.min(84, d * 190)}) scale(1 ${yerde ? 0.45 : 1})`}>
                <rect x={-w / 2} y={-hh / 2} width={w} height={hh} fill={renk} stroke="#1b1412" strokeWidth={Math.max(0.6, 2.4 / Zc)} />
                <rect x={-w / 2} y={-hh / 2 + hh * 0.12} width={w} height={hh * 0.13} fill="#fff" opacity={0.35} />
              </g>
            );
          }
          continue;
        }
        const dus = random(`du${seed}`) < 0.3;
        const tf = ey < ust + 0.12 && dus && Zc > 1.6 ? 1 : 0;
        if (!tf) {
          urunler.push(
            <g key={`u${seed}`}>
              <path d={yuzX(X * 0.995, Z1, Z2, Y0 + 0.02, ust)} fill={renk} stroke="#1b1412" strokeWidth={Math.max(0.6, 2.4 / Zc)} />
              <path d={yuzX(X * 0.993, Z1, Z2, ust - 0.07, ust - 0.03)} fill="#ffffff" opacity={0.35} />
            </g>
          );
        } else {
          // devrilme zamanını yaklaşık bul: erime hızından
          const t0 = e0 + (KZ_END - Zc) * eLag + 0.25 * (0.5 + 0.5 * Math.sin(Zc * 3.1 + side * 1.7));
          const tDev = t0 + (2.0 - (ust + 0.12)) / eV;
          const d = Math.max(0, t - tDev);
          const yy = Math.max(0.03, Y0 + 0.17 + 0.6 * d - 9.8 * 0.5 * d * d * 1.6);
          const xx = X - side * Math.min(0.16, 0.3 * d) * (0.5 + 0.5 * random(`dx${seed}`));
          const [px, py] = P(xx, yy, Zc);
          const w = (0.17 * KF_) / Zc, hh = (ph * KF_) / Zc;
          const yerde = yy <= 0.031;
          const rot = yerde ? 90 + 20 * (random(`dr${seed}`) - 0.5) : side * -Math.min(80, d * 260);
          dusenler.push(
            <g key={`d${seed}`} transform={`translate(${px} ${py}) rotate(${rot}) scale(1 ${yerde ? 0.45 : 1})`}>
              <rect x={-w / 2} y={-hh / 2} width={w} height={hh} fill={renk} stroke="#1b1412" strokeWidth={Math.max(0.6, 2.4 / Zc)} />
              <rect x={-w / 2} y={-hh / 2 + hh * 0.12} width={w} height={hh * 0.13} fill="#fff" opacity={0.35} />
            </g>
          );
        }
      }
    });
  }
  // böcek örnekleri
  const bocekler: React.ReactNode[] = [];
  // 1) tek tük çıkış (görünür bir kaynaktan): her böcek bir paketin ARKASINDAN çıkar. Paket dörtgeni kırpma maskesiyle
  //    böceği örter; böcek baş önde yukarı süründükçe önce anten uçları, sonra baş, sonra gövde paketin üst kenarından
  //    sıyrılır, kısa bir duraksamadan sonra raf boşluğunda yoluna devam eder. Ölçek ya da saydamlıkla "belirme" yok.
  const L_C = 0.11;
  const yuzA = (X: number, Z: number, Y: number, dZ: number, dY: number) => {
    const [x1, y1] = P(X, Y, Z), [x2, y2] = P(X, Y + dY * 0.01, Z + dZ * 0.01);
    return Math.atan2(y2 - y1, x2 - x1);
  };
  const urunUst = (side: number, r: number, zi: number) => RAF_Y[r] + 0.02 + [0.3, 0.16, 0.24, 0.12, 0.28, 0.2][(zi * 7 + r * 3 + (side > 0 ? 2 : 0)) % 6];
  const urunQ = (side: number, r: number, zi: number) => yuzX(side * KX * 0.995, 0.8 + zi * 0.2, 0.97 + zi * 0.2, RAF_Y[r] + 0.02, urunUst(side, r, zi));
  const CIK2: [number, number, number, number, number][] = [
    // side, raf, slot, başlangıç (c0'dan sonra sn), çıkış yönü (Z eğimi)
    [-1, 2, 4, 0.0, 0.25], [-1, 1, 5, 0.45, -0.3], [-1, 3, 6, 0.8, 0.35], [-1, 2, 7, 1.05, -0.2], [1, 2, 4, 1.2, 0.3], [-1, 0, 3, 1.3, 0.2], [-1, 1, 8, 1.45, -0.35], [1, 1, 5, 1.55, -0.25], [-1, 3, 4, 1.65, 0.15], [-1, 2, 9, 1.75, -0.3], [1, 3, 6, 1.85, 0.25], [-1, 1, 3, 1.9, 0.3], [-1, 0, 6, 2.0, -0.2], [1, 0, 3, 2.05, 0.2], [-1, 2, 2, 2.1, 0.35], [-1, 3, 8, 2.15, -0.25], [1, 2, 7, 2.2, -0.3], [-1, 1, 10, 2.25, 0.25], [-1, 0, 9, 2.3, -0.2], [1, 1, 8, 2.35, 0.3],
  ];
  const kirpTanim: React.ReactNode[] = [];
  if (t >= c0 - 0.001) {
    CIK2.forEach(([side, r, zi, ts, eg], i) => {
      const d = t - c0 - ts;
      if (d < 0) return;
      const Zc = 0.885 + zi * 0.2;
      if (Zc < ZN) return;
      const X = side * KX * 0.99;
      const ust = urunUst(side, r, zi);
      // ilerleme (gövde uzunluğu cinsinden): gizli → anten uçları (0,5) → duraksama → gövde dışarı (2,4) → yol
      const ilk = sstep(0, 0.5, d) * 0.5;
      const kip = d > 0.5 && d < 1.15 ? 0.06 * Math.sin((d - 0.5) * 17) : 0;
      const cik = sstep(1.15, 1.95, d) * 1.9;
      const yol = Math.max(0, d - 1.95) * 0.05;
      const s0 = -1.75 + ilk + cik + kip;
      let Y = ust + s0 * L_C;
      let Zg = Zc + s0 * L_C * eg * 0.5;
      let dZ = eg, dY = 1;
      if (d > 1.95) {
        // raf boşluğunda yana döner (Z yönünde), hafif kıvrılarak ilerler
        const don = sstep(1.95, 2.35, d);
        dZ = eg + (Math.sign(eg) * 1 - eg) * don;
        dY = 1 - 0.95 * don;
        Zg += Math.sign(eg) * yol * 1.2 + 0.01 * Math.sin(d * 4 + i);
        Y += yol * 0.15 + 0.008 * Math.sin(d * 6 + i);
      }
      const [x, y] = P(X, Y, Zg);
      const a = yuzA(X, Zg, Y, dZ, dY) + Math.sin(d * 5 + i) * 0.12;
      const s = (L_C * KF_) / Zg;
      const kid = `${uid}kc${i}`;
      kirpTanim.push(
        <clipPath key={kid} id={kid}>
          <path d={`M -6000 -6000 H 8000 V 8000 H -6000 Z ${urunQ(side, r, zi)}`} clipRule="evenodd" />
        </clipPath>
      );
      // duraksamada antenler yoklar (evre yavaş ilerler), yürürken hızlı
      const ph = d < 1.15 ? d * 5 + i : d * 14 + i;
      bocekler.push(
        <g key={`c${i}`} clipPath={`url(#${kid})`}>
          <Mb uid={uid} x={x} y={y} a={a} s={s} ph={ph} sq={0.8} />
        </g>
      );
    });
  }
  // devrilen paketin arkasından dökülen küme (yalnız `kume` açıkken): paket raftayken onun arkasında gizli (kırpma),
  // paket düşerken düşen paketin altında kalır, sonra boşalan yuvadan aşağı dökülür
  const kume: React.ReactNode[] = [];
  if (p.kume) {
    Object.entries(zorla).forEach(([k, tz], j) => {
      const [sd, rr, zz] = k.split("|").map(Number);
      const Zc = 0.885 + zz * 0.2;
      if (Zc < ZN) return;
      const Yb = RAF_Y[rr] + 0.02;
      const T = Math.sqrt((2 * Yb) / 9.8);
      const dd = t - (tz - T);
      const ust = urunUst(sd, rr, zz);
      const kid = `${uid}kk${j}`;
      if (dd < 0) kirpTanim.push(<clipPath key={kid} id={kid}><path d={`M -6000 -6000 H 8000 V 8000 H -6000 Z ${urunQ(sd, rr, zz)}`} clipRule="evenodd" /></clipPath>);
      for (let m = 0; m < 7; m++) {
        const zr = (random(`kz${j}${m}`) - 0.5) * 0.13;
        const yr = Yb + 0.05 + random(`ky${j}${m}`) * (ust - Yb - 0.06);
        let Y = yr, Zg = Zc + zr, dY = 1, dZ = 0;
        if (dd < 0) {
          // paketin arkasında kıpırdanma: antenler üst kenardan hafifçe taşabilir
          Y = Math.min(yr, ust - 0.6 * L_C) + 0.015 * Math.sin(t * 7 + m);
        } else {
          const g = Math.max(0, dd - 0.15 - m * 0.06);
          const v = 0.22 + random(`kv${j}${m}`) * 0.15;
          Y = yr - v * g;
          Zg = Zc + zr + (random(`kd${j}${m}`) - 0.5) * 0.25 * g;
          dY = -1;
          dZ = (random(`kd${j}${m}`) - 0.5) * 0.5;
          if (Y < 0.03) Y = 0.03;
        }
        const X = sd * KX * 0.99;
        const [x, y] = P(X, Y, Zg);
        const a = yuzA(X, Zg, Y, dZ, dY) + Math.sin(t * 6 + m) * 0.15;
        const el = <Mb key={`kb${j}${m}`} uid={uid} x={x} y={y} a={a} s={(0.1 * KF_) / Zg} ph={t * (dd < 0 ? 4 : 15) + m} sq={0.8} />;
        kume.push(dd < 0 ? <g key={`kg${j}${m}`} clipPath={`url(#${kid})`}>{el}</g> : el);
      }
    });
  }
  // 2) erime kenarından dökülenler (rafların yüzünden aşağı)
  for (const side of [-1, 1]) {
    for (let i = 0; i < 46; i++) {
      const Zg = 1.0 + (i / 46) * 4.6 + 0.05 * random(`ez${side}${i}`);
      if (Zg < ZN) continue;
      const ey = erY(Zg, side);
      if (ey > 2.0) continue;
      if (p.dusenSel && Zg < Zf - 0.2) continue;
      const fall = (t * (0.9 + random(`ef${side}${i}`) * 0.8) + random(`eo${side}${i}`)) % 1;
      const Y = ey - fall * (ey + 0.05);
      if (Y < 0) continue;
      const [x, y] = P(side * KX * 0.985, Y, Zg);
      bocekler.push(<Mb key={`e${side}${i}`} uid={uid} x={x} y={y} a={Math.PI / 2 + (random(`ea${i}`) - 0.5) * 0.9} s={(0.075 * KF_) / Zg} ph={t * 16 + i} sq={0.85} />);
    }
  }
  // 3) zemin seli ön kenarı + öncüler
  if (Zf < 50) {
    for (let i = 0; i < 150; i++) {
      const u = random(`zu${i}`);
      const dz = -0.35 + random(`zd${i}`) * 1.3;
      const Zg = Zf + dz + 0.08 * Math.sin(t * 3 + i);
      if (Zg < Math.max(ZN, 0.32) || Zg > (p.selDuvar ? KZ_END - 0.05 : KZ_END)) continue;
      const Xg = -KX * 0.96 + u * KX * 1.92 + 0.05 * Math.sin(t * 4 + i * 1.7);
      const [x, y] = P(Xg, 0.005, Zg);
      const s = (0.085 * KF_) / Zg;
      if (y > 2100 || y < -200) continue;
      const a = Math.PI / 2 + (Xg * 0.15) + Math.sin(t * 6 + i) * 0.45;
      bocekler.push(<Mb key={`z${i}`} uid={uid} x={x} y={y} a={a} s={s} ph={t * 18 + i} sq={Math.min(1, 0.25 + (h / Zg) * 0.6)} o={dz < -0.2 ? 0.9 : 1} />);
    }
  }
  // zemin seli çokgeni (ön kenar düzensiz)
  let selD = "";
  if (Zf < 50) {
    const on: [number, number][] = [];
    for (let j = 0; j <= 24; j++) {
      const X = -KX + (2 * KX * j) / 24;
      const Zq = Math.max(Math.max(ZN, 0.3), Zf + 0.12 * (0.5 + 0.5 * Math.sin(X * 9 + t * 3)) + 0.06 * Math.sin(X * 23 - t * 5));
      on.push(P(X, 0.003, Zq));
    }
    selD = poly([...on, P(KX, 0.003, KZ_END), P(-KX, 0.003, KZ_END)]);
  }
  const erimeD = (side: number) => {
    const X = side * KX * 0.99;
    const top: [number, number][] = [], bot: [number, number][] = [];
    for (let Zq = Math.max(ZN, 0.9); Zq <= 5.95; Zq += 0.08) {
      const ey = erY(Zq, side);
      if (ey > 2.0) continue;
      top.push(P(X, 2.0, Zq));
      bot.push(P(X, ey, Zq));
    }
    if (top.length < 2) return "";
    return poly([...top, ...bot.reverse()]);
  };
  const ert = (t * 70) % 50;
  // ışık havuzları (karanlık katmanının maskesi)
  const havuz = LAMBA_Z.map((Zl, i) => {
    const [px, py] = P(0, 0.9, Zl + 0.45);
    const r = (1.5 * KF_) / (Zl + 0.45);
    return { px, py, rx: r * 1.05, ry: r * 1.35, L: lambaL[i] };
  });
  const eceBacak = p.bacak;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden", isolation: "isolate" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: camT(cx, cy, z) }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
          <MiniDefs uid={uid} />
          <defs>
            <pattern id={`${uid}tm2`} href={`#${uid}tm`} patternTransform={`translate(${ert * 0.3} ${ert}) scale(1.3)`} />
            <pattern id={`${uid}tm3`} href={`#${uid}tm`} patternTransform={`translate(0 ${ert * 0.6}) scale(0.7)`} />
            <radialGradient id={`${uid}hv`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#000" /><stop offset="0.55" stopColor="#000" stopOpacity={0.6} /><stop offset="1" stopColor="#000" stopOpacity={0} /></radialGradient>
            <mask id={`${uid}km`} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={5000} height={6000}>
              <rect x={-2000} y={-2000} width={5000} height={6000} fill="#fff" />
              {havuz.map((q, i) => (q.L > 0 ? <ellipse key={i} cx={q.px} cy={q.py} rx={q.rx} ry={q.ry} fill={`url(#${uid}hv)`} opacity={q.L} /> : null))}
            </mask>
            <filter id={`${uid}gl`}><feGaussianBlur stdDeviation="14" /></filter>
            <linearGradient id={`${uid}uz`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.9} /></linearGradient>
          </defs>
          {/* tavan, uç duvar, zemin */}
          <rect x={-1000} y={-1000} width={3080} height={3920} fill="#cfd3d5" />
          <path d={yuzY(3, -KX, KX, 0.3, KZ_END)} fill="#e2e5e6" />
          {[1, 2, 3, 4, 5].map((Zq) => <path key={Zq} d={`M ${P(-KX, 3, Zq)[0]} ${P(-KX, 3, Zq)[1]} L ${P(KX, 3, Zq)[0]} ${P(KX, 3, Zq)[1]}`} stroke="#b8bec2" strokeWidth={2} />)}
          <path d={poly([P(-KX, 0, KZ_END), P(KX, 0, KZ_END), P(KX, 3, KZ_END), P(-KX, 3, KZ_END)])} fill="#c4c9cc" />
          {/* uçta DEPO kapısı (aralık, zifiri) */}
          <path d={poly([P(0.06, 0, KZ_END), P(0.62, 0, KZ_END), P(0.62, 2.06, KZ_END), P(0.06, 2.06, KZ_END)])} fill="#5a6066" />
          <path d={poly([P(0.1, 0, KZ_END), P(0.58, 0, KZ_END), P(0.58, 2.0, KZ_END), P(0.1, 2.0, KZ_END)])} fill="#050506" />
          <path d={poly([P(0.1, 0, KZ_END), P(0.24, 0, KZ_END - 0.3), P(0.24, 2.0, KZ_END - 0.3), P(0.1, 2.0, KZ_END)])} fill="#3a3e44" />
          <path d={poly([P(0.12, 2.18, KZ_END), P(0.56, 2.18, KZ_END), P(0.56, 2.42, KZ_END), P(0.12, 2.42, KZ_END)])} fill="#e8e0c0" stroke="#2a2e32" strokeWidth={1.5} />
          <text x={P(0.34, 2.24, KZ_END)[0]} y={P(0.34, 2.24, KZ_END)[1]} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={(0.17 * KF_) / KZ_END} fill="#1a1a1a">DEPO</text>
          <path d={yuzY(0, -KX, KX, Math.max(0.2, ZN - 0.6), KZ_END)} fill="#c2c7c4" />
          {[-0.35, 0, 0.35].map((X) => <path key={X} d={`M ${P(X, 0, Math.max(0.2, ZN - 0.6))[0]} ${P(X, 0, Math.max(0.2, ZN - 0.6))[1]} L ${P(X, 0, KZ_END)[0]} ${P(X, 0, KZ_END)[1]}`} stroke="#a8aeab" strokeWidth={2.5} />)}
          {[0.6, 0.9, 1.3, 1.8, 2.4, 3.1, 4, 5].map((Zq) => (Zq < ZN - 0.6 ? null : <path key={Zq} d={`M ${P(-KX, 0, Zq)[0]} ${P(-KX, 0, Zq)[1]} L ${P(KX, 0, Zq)[0]} ${P(KX, 0, Zq)[1]}`} stroke="#a8aeab" strokeWidth={2.5} />))}
          {/* zeminde floresan yansımaları */}
          {LAMBA_Z.map((Zl, i) => <path key={i} d={yuzY(0.001, -0.1, 0.1, Zl, Zl + 0.9)} fill="#ffffff" opacity={0.3 * lambaL[i]} filter={`url(#${uid}gl)`} />)}
          {/* raflar: yan paneller, raf tahtaları + fiyat şeritleri */}
          {[-1, 1].map((side) => (
            <g key={side}>
              <path d={yuzX(side * KX, Math.max(0.3, ZN - 0.3), 5.95, 0, 1.95)} fill="#e6e8e8" />
              <path d={yuzX(side * KX * 1.002, Math.max(0.3, ZN - 0.3), 5.95, 0, 1.95)} fill="#2a2e32" opacity={0.25} />
              {RAF_Y.map((Y) => (
                <g key={Y}>
                  <path d={yuzX(side * KX * 0.99, Math.max(0.3, ZN - 0.3), 5.95, Y - 0.03, Y + 0.02)} fill="#9aa2a8" />
                  <path d={yuzX(side * KX * 0.985, Math.max(0.3, ZN - 0.3), 5.95, Y - 0.02, Y + 0.035)} fill="#f8e070" opacity={0.9} />
                </g>
              ))}
              <path d={yuzX(side * KX * 0.99, Math.max(0.3, ZN - 0.3), 5.95, 1.88, 1.95)} fill="#9aa2a8" />
            </g>
          ))}
          {urunler}
          {/* erime: kaynaşan sel rafların yüzünden aşağı akar */}
          {[-1, 1].map((side) => {
            const d = erimeD(side);
            return d ? (
              <g key={`er${side}`}>
                <path d={d} fill={`url(#${uid}tm3)`} />
                <path d={d} fill="#000" opacity={0.25} />
                <path d={d} fill="none" stroke={K.k3} strokeWidth={2} opacity={0.5} />
              </g>
            ) : null;
          })}
          <defs>{kirpTanim}</defs>
          {kume}
          {dusenler}
          {/* zemin seli */}
          {selD ? (
            <g>
              <path d={selD} fill={`url(#${uid}tm2)`} />
              <path d={selD} fill="#000" opacity={0.2} />
            </g>
          ) : null}
          {bocekler}
          {p.ucan !== undefined ? <UcanBocek uid={uid} t={t - p.ucan} /> : null}
          {/* zemin çekimi: önde Ece'nin bacakları (arkadan), sel ayakkabıların etrafından akar */}
          {eceBacak ? <EceBacak P={P} t={t} Zf={Zf} uid={uid} Z={p.bacakZ ?? 0.62} tepki={p.tepki} /> : null}
          {/* karanlık: yalnız yanan floresanların havuzu aydınlık */}
          <rect x={-2000} y={-2000} width={5000} height={6000} fill="#020203" opacity={p.karanlik ?? 0.9} mask={`url(#${uid}km)`} />
          {/* floresan armatürler (karanlığın üstünde: kendi ışığı) */}
          {LAMBA_Z.map((Zl, i) => (
            <g key={i}>
              <path d={yuzY(2.99, -0.17, 0.17, Zl, Zl + 0.9)} fill="#3a3e42" stroke="#1a1c1e" strokeWidth={2} />
              <path d={yuzY(2.985, -0.11, 0.11, Zl + 0.04, Zl + 0.86)} fill="#ffffff" opacity={0.15 + 0.85 * lambaL[i]} />
              {lambaL[i] > 0 ? <path d={yuzY(2.98, -0.35, 0.35, Zl - 0.15, Zl + 1.05)} fill="#ffffff" opacity={0.4 * lambaL[i]} filter={`url(#${uid}gl)`} /> : null}
            </g>
          ))}
          {/* uç kısım: derinlikte koyulaşma (DEPO'nun karanlığı) */}
          <path d={poly([P(-KX, 0, 4.4), P(KX, 0, 4.4), P(KX, 3, 4.4), P(-KX, 3, 4.4)])} fill="#000" opacity={0} />
        </svg>
      </AbsoluteFill>
      <Siyah o={p.acilis ? 1 - sstep(0, p.acilis, t) : 0} />
    </AbsoluteFill>
  );
};

/** kameranın üstünden geçen uçan hamamböceği (kanatlar açık, flu, hızlı): t = olaydan bu yana sn */
const UcanBocek: React.FC<{ uid: string; t: number }> = ({ uid, t }) => {
  if (t < 0 || t > 0.7) return null;
  const k = t / 0.7;
  const x = 1250 - 1500 * k, y = 300 + 160 * Math.sin(k * Math.PI) - 120 * k;
  const fl = Math.sin(t * 160);
  return (
    <g transform={`translate(${x} ${y}) rotate(${-100 + 20 * Math.sin(t * 9)}) scale(4.2)`} opacity={0.95}>
      <ellipse cx={-22} cy={4} rx={40} ry={11 + 7 * fl} fill="#c8a070" opacity={0.35} transform="rotate(-25)" />
      <ellipse cx={22} cy={4} rx={40} ry={11 - 7 * fl} fill="#c8a070" opacity={0.35} transform="rotate(25)" />
      <use href={`#${uid}mb${Math.floor(t * 30) % 4}`} transform="scale(0.9)" />
    </g>
  );
};

/** zemin çekimi: Ece arkadan (kot + beyaz spor ayakkabı), sel ayakkabılara ulaşır, birkaçı topuğa tırmanır */
const EceBacak: React.FC<{ P: (X: number, Y: number, Z: number) => [number, number]; t: number; Zf: number; uid: string; Z: number; tepki?: Prm }> = ({ P, t, Zf, uid, Z: Z0, tepki }) => {
  const tr = Math.sin(t * 40) * 0.004;
  // sessiz boğuşma (opt-in `tepki`): sel ayakkabıya varınca bacak silkelenir, geri geri sendeler, yukarıdan inen el paçayı silkeler
  const tp = tepki ?? {};
  const legZ = (side: number) => {
    const [a0] = side < 0 ? kf(tp.geriSol, t, [0]) : kf(tp.geriSag, t, [0]);
    return Z0 - (tepki ? a0 : 0);
  };
  const legLift = (side: number) => {
    if (!tepki) return { lift: 0, sx: 0 };
    const [lf, sk] = side < 0 ? kf(tp.solBacak, t, [0, 0]) : kf(tp.sagBacak, t, [0, 0]);
    return { lift: lf * (0.7 + 0.3 * Math.abs(Math.sin(t * 19 + side))), sx: sk * Math.sin(t * 57 + side * 2) };
  };
  /** bacağa bağlı nokta (y: zeminden yükseklik, m) → ekran */
  const legP = (side: number, dx: number, Y: number): [number, number] => {
    const Z = legZ(side);
    const { lift, sx } = legLift(side);
    const k = Math.max(0, 1 - Y / 1.1);
    return P(side * 0.09 + dx + tr + sx * k, Y + lift * k, Z);
  };
  const bacak = (side: number) => {
    const w = 0.065;
    const Z = legZ(side);
    const a = legP(side, -w, 0.1), b = legP(side, w, 0.1), c = P(side * 0.09 + w * 1.15 + tr, 1.1, Z), d = P(side * 0.09 - w * 1.15 + tr, 1.1, Z);
    const s1 = legP(side, -0.06, -0.0), s2 = legP(side, 0.06, -0.0), s3 = legP(side, 0.055, 0.11), s4 = legP(side, -0.055, 0.11);
    return (
      <g key={side}>
        <path d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${c[0]} ${c[1]} L ${d[0]} ${d[1]} Z`} fill="#34466a" stroke="#1b1412" strokeWidth={5} />
        <path d={`M ${(a[0] + b[0]) / 2} ${a[1]} L ${(c[0] + d[0]) / 2} ${c[1]}`} stroke="#22304e" strokeWidth={6} opacity={0.6} />
        <path d={`M ${s1[0]} ${s1[1]} Q ${(s1[0] + s2[0]) / 2} ${s1[1] + 14} ${s2[0]} ${s2[1]} L ${s3[0]} ${s3[1]} Q ${(s3[0] + s4[0]) / 2} ${s3[1] - 18} ${s4[0]} ${s4[1]} Z`} fill="#f0f0f0" stroke="#1b1412" strokeWidth={5} strokeLinejoin="round" />
        <path d={`M ${s1[0]} ${s1[1] - 16} Q ${(s1[0] + s2[0]) / 2} ${s1[1] - 2} ${s2[0]} ${s2[1] - 16}`} stroke="#b8b8b8" strokeWidth={10} fill="none" />
      </g>
    );
  };
  const W = P(0.2, 0.95, Z0)[0] - P(0, 0.95, Z0)[0];
  // tırmananlar: sel ayakkabıya VARDIĞINDA zeminden başlar (sel kütlesinin içinden), paça boyunca yükselir;
  // el çarptığında savrulur. [bacak, dx, başlangıç gecikmesi, hedef yükseklik, savrulma anı]
  const var_ = tepki ? sstep(Z0 + 0.05, Z0 - 0.12, Zf) : Math.max(0, Math.min(1, (Z0 + 0.35 - Zf) / 0.4));
  const tVar = tp.varis ?? 0;
  const tirmanan: number[][] = tepki
    ? tp.tirman ?? []
    : new Array(7).fill(0).map((_, i) => [i % 2 ? 1 : -1, (random(`ab${i}`) - 0.5) * 0.1, i * 0.12, (i % 3 === 0 ? 1.6 : 0.9) * 0.1, 99]);
  const elT = tp.el as number[] | undefined; // [iniş, kalkış]
  const elVar = elT ? sstep(elT[0], elT[0] + 0.22, t) * (1 - sstep(elT[1] - 0.2, elT[1], t)) : 0;
  const elY = 0.32 + 0.12 * Math.sin(t * 9.5), elDx = 0.07 * Math.sin(t * 41);
  return (
    <g>
      <ellipse cx={P(0, 0, Z0)[0]} cy={P(0, 0, Z0)[1] + 4} rx={W * 1.4} ry={22} fill="#000" opacity={0.35} />
      {bacak(-1)}
      {bacak(1)}
      {tirmanan.map(([side, dx, gec, hedef, savr], i) => {
        if (!tepki) {
          const u = Math.max(0, Math.min(1, var_ * 1.6 - gec));
          if (u <= 0) return null;
          const [x, y] = P(side * 0.09 + dx, 0.02 + hedef * u, Z0 - 0.06);
          return <Mb key={i} uid={uid} x={x} y={y} a={-Math.PI / 2 + (random(`aa${i}`) - 0.5) * 0.8} s={(0.09 * KF_) / Z0} ph={t * 15 + i} />;
        }
        const d = t - tVar - gec;
        if (d < 0) return null;
        const Z = legZ(side);
        if (t < savr) {
          const Y = Math.min(hedef, 0.01 + 0.16 * d);
          const [x, y] = legP(side, dx + 0.01 * Math.sin(t * 8 + i), Y);
          return <Mb key={i} uid={uid} x={x} y={y - 10} a={-Math.PI / 2 + Math.sin(t * 7 + i) * 0.35} s={(0.09 * KF_) / Z} ph={t * 15 + i} />;
        }
        const e = t - savr;
        if (e > 0.8) return null;
        const Y0 = Math.min(hedef, 0.01 + 0.16 * (savr - tVar - gec));
        const [x0, y0] = legP(side, dx, Y0);
        const yon = side < 0 ? -1 : 1;
        return <Mb key={i} uid={uid} x={x0 + yon * 1300 * e} y={y0 - 900 * e + 2200 * e * e} a={e * 25 * yon} s={(0.09 * KF_) / Z} ph={t * 30 + i} />;
      })}
      {elVar > 0.001 ? (() => {
        // yukarıdan (kadraj dışından) inen el: sol paçayı hızlı hızlı silkeler
        const [hx, hy] = legP(-1, elDx, elY + (1 - elVar) * 1.4);
        const [ax, ay] = P(-0.02, 1.9, legZ(-1) - 0.05);
        const hw = (0.05 * KF_) / legZ(-1);
        return (
          <g>
            <path d={`M ${ax} ${ay} L ${hx + hw * 0.4} ${hy - hw * 1.4}`} stroke="#1b1412" strokeWidth={hw * 1.55 + 10} strokeLinecap="round" />
            <path d={`M ${ax} ${ay} L ${hx + hw * 0.4} ${hy - hw * 1.4}`} stroke="#c8902a" strokeWidth={hw * 1.55} strokeLinecap="round" />
            <g transform={`translate(${hx} ${hy}) rotate(${12 + 18 * Math.sin(t * 41)})`}>
              <path d={`M ${-hw * 0.8} ${-hw * 1.5} L ${-hw * 0.9} ${hw * 0.6} Q ${-hw * 0.85} ${hw * 1.3} ${-hw * 0.4} ${hw * 1.25} Q 0 ${hw * 1.45} ${hw * 0.4} ${hw * 1.25} Q ${hw * 0.9} ${hw * 1.2} ${hw * 0.85} ${hw * 0.5} L ${hw * 0.75} ${-hw * 1.5} Z`} fill="#f0c8a8" stroke="#1b1412" strokeWidth={5} strokeLinejoin="round" />
              <path d={`M ${-hw * 0.4} ${hw * 0.2} L ${-hw * 0.4} ${hw * 1.1} M 0 ${hw * 0.2} L 0 ${hw * 1.3} M ${hw * 0.4} ${hw * 0.2} L ${hw * 0.4} ${hw * 1.1}`} stroke="#1b1412" strokeWidth={3} opacity={0.5} />
              <path d={`M ${-hw * 0.95} ${-hw * 1.5} L ${hw * 0.85} ${-hw * 1.5}`} stroke="#a8741a" strokeWidth={hw * 0.5} />
            </g>
          </g>
        );
      })() : null}
    </g>
  );
};

/* =====================================================================================
 *  P2_FISILTI: kırmızı saat tek ışık; Ece'nin yakın planı, yavaş yaklaşma. Fısıltılara katmanlı tepki:
 *  fis [[t, tip("ece"|"kizim"), yon(-1 sol / 1 sağ), yakınlık 0..1]]; her fısıltının tepkisi sırayla ağırlaşır.
 *  prm: cam [[t, z, ax, ay]], agiz [[t,k]], gozyasi [[t,v]], yazi bool (altyazı), kapanis t (sert kararma),
 *       golge [t0, t1] (ensede beliren siluet), donma t (nefes ve titreme durur)
 * ===================================================================================== */
const P2Fisilti: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const p = prm(text);
  const ece = castById("ece_sivil");
  const [zz, ax, ay] = kf(p.cam, t, [1, 560, 740]);
  // fis: [başlangıç, tip, ilk yön, son, son yön]
  const fis: [number, string, number, number, number][] = p.fis ?? [];
  // bakış: son fısıltının yönüne kayar (yalnız gözler; baş dönmez — donmuş)
  let lx = 0.05, ly = 0.05;
  let son = -1;
  fis.forEach((w, i) => { if (t >= w[0]) son = i; });
  if (son >= 0) {
    const w = fis[son];
    const u = sstep(w[0] + 0.12, w[0] + 0.5, t);
    const prevX = son > 0 ? fis[son - 1][4] * 0.88 : 0.05;
    lx = prevX + (w[2] * 0.88 - prevX) * u;
    // ses enseden öbür yana geçiyorsa gözler de izler
    if (w[4] !== w[2]) lx = lx + (w[4] * 0.88 - w[2] * 0.88) * sstep(w[0] + 0.6, w[3], t);
    ly = 0.12;
  }
  const [ak] = kf(p.agiz, t, [0]);
  const [gy] = kf(p.gozyasi, t, [0.3]);
  const [dud] = kf(p.dudak, t, [0]);
  const [gk] = kf(p.gozKapa, t, [0]);
  const donma = p.donma !== undefined && t >= p.donma;
  const emo = basamak<string>(p.duygu, t, "korkmus") as Emotion;
  const tit = donma ? 0 : (Math.sin(t * 47) * 1.6 + Math.sin(t * 29) * 1.1) * (p.titre ?? 1);
  const size = p.boy ?? 3300;
  const S = size / 1000;
  const armMouth = { upper: -30, fore: -150, ul: 0.5, fl: 1 };
  const armChest = { upper: -6, fore: -128, ul: 0.74, fl: 0.92 };
  const mixA = (a: typeof armMouth, b: typeof armMouth, k: number) => ({ upper: a.upper + (b.upper - a.upper) * k, fore: a.fore + (b.fore - a.fore) * k, ul: a.ul + (b.ul - a.ul) * k, fl: a.fl + (b.fl - a.fl) * k });
  const arm = mixA(armChest, armMouth, ak);
  // siluet (Sabri profili, ensede): kırmızı kenar ışığı, flu
  const [g0, g1] = p.golge ?? [99, 100];
  const gK = sstep(g0, g1, t);
  const siluetT = (p.golgeYon ?? -1) > 0 ? `translate(${540 + 0.118 * size + 10 - 60 * gK} 780) scale(${-0.00039 * size} ${0.00039 * size}) translate(-296 -600)` : `translate(${540 - 0.118 * size - 40 + 60 * gK} 780) scale(${0.00039 * size}) translate(-296 -600)`;
  // ışığın ekrandaki yeri: Ece'nin alnının üstü (yüzle birlikte kayar), hafif kadraj sağında
  const fxL = ax + (540 + 60 - ax) * zz, fyL = ay + (740 - 330 - ay) * zz;
  const kap = p.kapanis !== undefined ? sstep(p.kapanis, p.kapanis + 0.1, t) : 0;
  // altyazı: aktif fısıltı (0,15 sn önce belirir, 1,3 sn kalır)
  const yazilar: { s: string; o: number; yon: number; dy: number }[] = [];
  if (p.yazi) {
    fis.forEach((w, i) => {
      const a = w[0] - 0.05, b = w[3] + 0.35;
      if (t < a || t > b) return;
      const o = sstep(a, a + 0.2, t) * (1 - sstep(b - 0.3, b, t));
      const ust = i > 0 && fis[i - 1][3] + 0.35 > w[0];
      yazilar.push({ s: w[1] === "kizim" ? "Kızım…" : "Ece…", o, yon: w[2], dy: ust ? 86 : 0 });
    });
  }
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden", isolation: "isolate" }}>
      <AbsoluteFill style={{ transformOrigin: `${ax}px ${ay}px`, transform: `scale(${zz})` }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <filter id="p2fb"><feGaussianBlur stdDeviation="10" /></filter>
            <filter id="p2fs"><feGaussianBlur stdDeviation="5" /></filter>
          </defs>
          {/* arka plan: kepengin ve kapı kasasının kırmızıya boğulmuş, flu kenarları */}
          <g filter="url(#p2fb)" opacity={0.45}>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#3a2a2a" />
            {new Array(30).fill(0).map((_, i) => <path key={i} d={`M -300 ${-200 + i * 70} H 1400`} stroke="#7a6a6a" strokeWidth={12} opacity={0.5} />)}
            <rect x={250} y={-300} width={40} height={2500} fill="#8a8080" />
            <rect x={790} y={-300} width={40} height={2500} fill="#8a8080" />
          </g>
          {/* ensede beliren siluet (Ece'nin başının arkasında, kadraj solu) */}
          {gK > 0 ? (
            <g filter="url(#p2fs)" transform={siluetT}>
              <path d="M -60 330 Q 120 300 210 380 Q 268 440 262 520 Q 300 560 296 600 Q 280 612 266 616 Q 272 650 250 676 Q 262 700 238 720 Q 230 770 200 800 Q 150 860 40 880 L -60 880 Z" fill="#050101" />
              <path d="M -60 330 Q 120 300 210 380 Q 268 440 262 520 Q 300 560 296 600" stroke="#ff4a30" strokeWidth={8} fill="none" opacity={0.95 * gK} />
              <path d="M 296 600 Q 280 612 266 616 Q 272 650 250 676" stroke="#c83020" strokeWidth={6} fill="none" opacity={0.7 * gK} />
              <path d="M 232 676 Q 262 684 268 700" stroke="#c83a26" strokeWidth={9} fill="none" opacity={0.7 * gK} />
              <ellipse cx={120} cy={350} rx={60} ry={14} fill="#ff5a3a" opacity={0.35 * gK} />
            </g>
          ) : null}
        </svg>
        <div style={{ position: "absolute", left: 540 - 200 * S + tit, top: 740 - 200 * S }}>
          <Character look={ece} size={size} pose={{ emotion: emo, lookX: lx, lookY: ly, pale: 0.75, sacDagin: true, golgesiz: true, seed: 41, tears: gy, armL: arm, armR: arm, agizKapa: ak, elTitre: donma ? 0 : 1, dudakTitre: donma ? 0 : dud, breath: donma ? 0 : undefined, eyesClosed: gk > 0.01 ? gk : undefined, kirpmaz: donma ? true : undefined, gozSok: p.sok ? kf(p.sok, t, [0])[0] || undefined : undefined }} />
        </div>
      </AbsoluteFill>
      {/* tek ışık: üstten-önden kırmızı saat. Alın ve elmacık parlak, çene ve boyun karanlığa düşer;
          ışık hafif kadraj sağından (asimetri), yüzün kadraj solu yarı gölgede. */}
      <AbsoluteFill
        style={{
          mixBlendMode: "multiply",
          backgroundImage: `radial-gradient(ellipse ${620 * zz}px ${950 * zz}px at ${fxL}px ${fyL}px, rgb(255,${Math.round(96 * (p.red ?? 1))},${Math.round(70 * (p.red ?? 1))}) 0%, rgb(215,34,24) 30%, rgb(110,10,7) 56%, rgb(26,1,1) 82%, rgb(0,0,0) 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 38%, rgba(0,0,0,0) 60%)` }} />
      {gK > 0 ? (
        <AbsoluteFill style={{ transformOrigin: `${ax}px ${ay}px`, transform: `scale(${zz})`, pointerEvents: "none" }}>
          <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <defs><filter id="p2fr"><feGaussianBlur stdDeviation="2.2" /></filter></defs>
            <g filter="url(#p2fr)" transform={siluetT}>
              <path d="M 40 318 Q 140 304 210 380 Q 268 440 262 520 Q 300 560 296 600" stroke="#ff5236" strokeWidth={6} fill="none" opacity={0.7 * gK} strokeLinecap="round" />
              <path d="M 232 676 Q 262 684 268 700" stroke="#e04a30" strokeWidth={6} fill="none" opacity={0.5 * gK} strokeLinecap="round" />
            </g>
          </svg>
        </AbsoluteFill>
      ) : null}
      {yazilar.map((y, i) =>
        y.o > 0.01 ? (
          <AbsoluteFill key={i} style={{ pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 1120 + y.dy, left: y.yon < 0 ? 140 : 340, width: 420, textAlign: "center", fontFamily: SANS, fontStyle: "italic", fontWeight: 900, fontSize: 62, letterSpacing: 2, color: "#eed8d2", opacity: y.o * 0.9, textShadow: "0 0 18px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.9)" }}>{y.s}</div>
          </AbsoluteFill>
        ) : null
      )}
      <Siyah o={kap} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- "Kulaklıkla izle" rozeti */
const P2Kulaklik: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const p = prm(text);
  const [a, b] = p.aralik ?? [0.5, dur - 0.4];
  const o = sstep(a, a + 0.35, t) * (1 - sstep(b - 0.35, b, t));
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 300, left: 450, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 18, padding: "16px 30px 16px 24px", borderRadius: 60, backgroundColor: "rgba(6,6,8,0.62)", border: "2px solid rgba(255,255,255,0.22)", opacity: o, whiteSpace: "nowrap" }}>
        <svg width={56} height={56} viewBox="0 0 56 56">
          <path d="M 8 34 V 28 Q 8 8 28 8 Q 48 8 48 28 V 34" stroke="#f2f2f2" strokeWidth={5} fill="none" strokeLinecap="round" />
          <rect x={4} y={30} width={13} height={20} rx={5} fill="#f2f2f2" />
          <rect x={39} y={30} width={13} height={20} rx={5} fill="#f2f2f2" />
        </svg>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#f2f2f2", letterSpacing: 0.5 }}>Kulaklıkla izle</span>
      </div>
    </AbsoluteFill>
  );
};

export const Insert12: React.FC<{ kind: Insert12Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "p2_kasa": return <P2Kasa text={text} />;
    case "p2_kapi": return <P2Kapi text={text} />;
    case "p2_kepenk": return <P2Kepenk text={text} />;
    case "p2_koridor": return <P2Koridor text={text} />;
    case "p2_fisilti": return <P2Fisilti text={text} />;
    case "p2_kulaklik": return <P2Kulaklik dur={dur} text={text} />;
    default: return null;
  }
};

/** tek çekim denetimi için kompozisyon */
export const B5P2Kare: React.FC<{ kind: Insert12Kind; text?: string[] }> = ({ kind, text }) => {
  const { durationInFrames, fps } = useVideoConfig();
  return <Insert12 kind={kind} dur={durationInFrames / fps} text={text} />;
};
