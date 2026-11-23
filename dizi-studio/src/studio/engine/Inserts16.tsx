/* =====================================================================================
 * 7/24 Bölüm 7 · parça 1: "b7_banyo": Ece'nin evindeki banyo, akşam 18:00. Elle kurgulanmış sahne (opt-in; yalnız 724-07).
 *  Set: Banyo724 kapı görünümü + banyo penceresinden giren turuncu gün batımı huzmesi, sıcak renk derecelendirmesi.
 *  Karakterler (anne, Ece) rig'le çizilir; kollar istendiğinde IK ile ele hedef verilerek çizilir (elde eşya tutabilir).
 *
 *  ZAMAN: bütün anahtarlar SAHNE zamanında (sn); her vuruş t0 verir (vuruşlar arası süreklilik).
 *  prm: cam [[t,cx,cy,z]], titre (el kamerası genliği px), isik 0..1 (gün batımı), etiket ("18:00"),
 *   anne / ece: {
 *     yer [[t,x,y,size]] (ayak noktası, dünya koordinatı), egil [[t,derece]] (ayaktan öne eğilme), bak [[t,lx,ly,yaw]],
 *     duygu [[t,emo]], goz [[t,kapalılık]], tilt [[t,derece]], konus [{t, cues}] (manifest ağız işaretleri, sahne zamanı),
 *     agzi [[t0,t1]] (işaretsiz ağız), yuru [[t0,t1]], elL/elR [[t,x,y]] (IK el hedefi; yoksa rig kolu), kolL/kolR [[t,upper,fore]],
 *     tutL/tutR [[t, eşya|null]] (corap | gomlek | kot | deste | para), gozSok [[t,v]], tears, sacDagin, uyku (yastık izi), parmakUcu [[t,px]] }
 *   ucan: [{n: eşya, t0, t1, a:[x,y], b:[x,y], h: yükseklik, don: tur}] (havada uçan eşya)
 *   yerde: [{n, t, x, y}] (t'den sonra yerde duran eşya)
 * ===================================================================================== */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";
import type { ArmPose, Emotion, MouthCue } from "../rig/types";
import { Banyo724BG, Banyo724FG } from "../sets/banyo724";
import { sstep } from "./bocek";
import { ik, Kol, type V2 } from "./Inserts13";

export type Insert16Kind = "b7_banyo";
export const INSERT16_KINDS: Insert16Kind[] = ["b7_banyo"];

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
const aralik = (r: number[][] | undefined, t: number) => (r ?? []).some(([a, b]) => t >= a && t < b);
const O = "#2b1d1a";
const camT = (cx: number, cy: number, z: number, sx = 0, sy = 0) => `translate(${540 + sx}px, ${960 + sy}px) scale(${z}) translate(${-cx}px, ${-cy}px)`;
const rot = (p: V2, c: V2, deg: number): V2 => {
  const r = (deg * Math.PI) / 180, dx = p[0] - c[0], dy = p[1] - c[1];
  return [c[0] + dx * Math.cos(r) - dy * Math.sin(r), c[1] + dx * Math.sin(r) + dy * Math.cos(r)];
};

/* ------------------------------------------------------------------ eşyalar (el ölçeğinde, s = karakter ölçeği) */
const Esya: React.FC<{ n: string; x: number; y: number; s: number; a?: number }> = ({ n, x, y, s, a = 0 }) => {
  const tr = `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)}) scale(${s.toFixed(3)})`;
  if (n === "corap")
    return (
      <g transform={tr}>
        <path d="M -14 -60 L 14 -60 L 16 10 Q 18 34 48 40 Q 62 46 56 60 Q 30 70 0 58 Q -16 50 -16 20 Z" fill="#f2efe6" stroke={O} strokeWidth={4} />
        {[-44, -30].map((yy) => <path key={yy} d={`M -14 ${yy} H 14`} stroke="#d8503a" strokeWidth={6} />)}
        <path d="M 30 52 Q 44 52 52 48" stroke="#c8c0b0" strokeWidth={3} fill="none" />
      </g>
    );
  if (n === "gomlek")
    return (
      <g transform={tr}>
        <path d="M -60 -40 Q -20 -70 30 -50 Q 70 -30 58 10 Q 40 50 -10 46 Q -60 40 -66 0 Z" fill="#7ab0d8" stroke={O} strokeWidth={4} />
        <path d="M -30 -20 Q 0 0 30 -14 M -20 20 Q 10 30 34 14" stroke="#5a8ab0" strokeWidth={4} fill="none" />
      </g>
    );
  if (n === "kot")
    return (
      <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)}) scale(${(s * 0.78).toFixed(3)} ${s.toFixed(3)})`}>
        <path d="M -50 -90 L 50 -90 L 58 80 L 12 84 L 2 -10 L -8 84 L -56 80 Z" fill="#34466a" stroke={O} strokeWidth={5} strokeLinejoin="round" />
        <path d="M -50 -74 H 50" stroke="#d8a860" strokeWidth={3} strokeDasharray="8 5" />
        <path d="M 14 -60 L 46 -60 L 44 -24 L 30 -16 L 16 -24 Z" fill="#3c5078" stroke={O} strokeWidth={3} />
      </g>
    );
  if (n === "deste" || n === "para")
    return (
      <g transform={tr}>
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-40} y={-20 - i * (n === "deste" ? 5 : 1.5)} width={80} height={40} rx={4} fill={i % 2 ? "#86c096" : "#7ab88a"} stroke={O} strokeWidth={3} />)}
        <circle cx={0} cy={-20 - (n === "deste" ? 20 : 6)} r={9} fill="none" stroke="#3a7a4a" strokeWidth={3} />
        {n === "deste" ? <rect x={-9} y={-46} width={18} height={66} fill="#e8d8b0" stroke={O} strokeWidth={2} /> : null}
      </g>
    );
  return null;
};

/* ------------------------------------------------------------------ bir karakter (rig + IK kollar + eşyalar) */
type KarCiz = { govde: React.ReactNode; on: React.ReactNode };
const karakter = (id: string, q: Prm | undefined, tg: number, f: number, fps: number, t0f: number): KarCiz | null => {
  if (!q) return null;
  const look = castById(id);
  const [x, y, size] = kf(q.yer, tg, [540, 1850, 1200]);
  if (size <= 1) return null;
  const S = size / 1000;
  const left = x - 200 * S, top = y - 980 * S;
  const piv: V2 = [x, y];
  const egil = kf1(q.egil, tg, 0);
  const [lx, ly, yaw] = kf(q.bak, tg, [0, 0, 0]);
  const emo = basamak<string>(q.duygu, tg, "notr") as Emotion;
  // konuşma: manifest ağız işaretleri (sahne zamanında başlar)
  let speech: { cues: MouthCue[]; from: number } | undefined;
  for (const k of q.konus ?? []) {
    const bas = k.t as number, cues = k.cues as MouthCue[];
    const son = bas + (cues.length ? cues[cues.length - 1].t + 0.3 : 0);
    if (tg >= bas && tg < son) speech = { cues, from: t0f + Math.round(bas * fps) };
  }
  const wx = look.build === "slim" ? 0.9 : look.build === "heavy" ? 1.24 : 1;
  const ozelL = !!q.elL && aralik(q.elLara ?? [[-99, 99]], tg), ozelR = !!q.elR && aralik(q.elRara ?? [[-99, 99]], tg);
  const kolL = kf(q.kolL, tg, [6, 0]), kolR = kf(q.kolR, tg, [6, 0]);
  const armL: ArmPose = { upper: kolL[0], fore: kolL[1] }, armR: ArmPose = { upper: kolR[0], fore: kolR[1] };
  const kolGizle = ozelL && ozelR ? "ikisi" : ozelL ? "l" : ozelR ? "r" : undefined;
  const parmak = kf1(q.parmakUcu, tg, 0);
  const govde = (
    <div style={{ position: "absolute", left, top: top - parmak, transformOrigin: `${200 * S}px ${980 * S}px`, transform: egil ? `rotate(${egil}deg)` : undefined }}>
      <Character look={look} size={size} pose={{
        emotion: emo, lookX: lx, lookY: ly, yaw, tilt: kf1(q.tilt, tg, 0), armL, armR, kolGizle,
        eyesClosed: q.goz ? kf1(q.goz, tg, 0) || undefined : undefined, gozSok: q.gozSok ? kf1(q.gozSok, tg, 0) || undefined : undefined,
        speech, talk: !speech && aralik(q.agzi, tg) ? [[f - 2, f + 2]] : undefined,
        body: aralik(q.yuru, tg) ? "walk" : undefined, tears: q.tears, sacDagin: q.sacDagin, seed: id.length * 7,
      }} />
    </div>
  );
  // IK kollar (ekran/dünya koordinatında): omuz rig (200 ± 72·wx, 352)
  const kollar: React.ReactNode[] = [];
  const esyalar: React.ReactNode[] = [];
  const renk = look.outfit.top, manset = look.outfit.topShade;
  const L1 = 140 * S, L2 = 124 * S, w = 20 * S;
  const sideDraw = (side: "L" | "R") => {
    const omuz = rot([left + (200 + (side === "L" ? -72 : 72) * wx) * S, top - parmak + 352 * S], [piv[0], piv[1] - parmak], egil);
    const ozel = side === "L" ? ozelL : ozelR;
    const tut = basamak<string | null>(side === "L" ? q.tutL : q.tutR, tg, null);
    let H: V2;
    if (ozel) {
      const [hx, hy] = kf(side === "L" ? q.elL : q.elR, tg, [omuz[0], omuz[1] + 250 * S]);
      const bk = side === "L" ? q.bukumL : q.bukumR;
      const bukum = (Array.isArray(bk) ? basamak<number>(bk as [number, number][], tg, side === "L" ? 1 : -1) : bk ?? (side === "L" ? 1 : -1)) as 1 | -1;
      const r = ik(omuz, [hx, hy], L1, L2, bukum);
      H = r.H;
      kollar.push(<Kol key={side} S={omuz} E={r.E} H={r.H} w={w} renk={renk} manset={manset} el={look.skin} />);
    } else {
      // rig kolu: elin yaklaşık yeri (eşya için): omuzdan aşağı, upper açısıyla
      const up = ((side === "L" ? kolL[0] : kolR[0]) * Math.PI) / 180;
      const sgn = side === "L" ? -1 : 1;
      H = [omuz[0] + sgn * Math.sin(up) * (L1 + L2) * 0.9, omuz[1] + Math.cos(up) * (L1 + L2) * 0.9];
    }
    // çorap bilekten (lastikten) tutulur, aşağı sarkar; kot belinden tutulur
    const dy = tut === "corap" ? 52 * S : tut === "kot" ? 215 * S : -6 * S;
    if (tut) esyalar.push(<Esya key={`e${side}`} n={tut} x={H[0]} y={H[1] + dy} s={S * (tut === "kot" ? 2.5 : 1)} a={tut === "corap" ? 0 : side === "L" ? -15 : 15} />);
  };
  sideDraw("L");
  sideDraw("R");
  // kirli sepeti sağ kalçada (sağ kol sarar; el sepetin arkasında kalır)
  let sepet: React.ReactNode = null;
  if (kf1(q.sepet, tg, 0) > 0.5) {
    const [hx, hy] = rot([left + 300 * S, top - parmak + 600 * S], [piv[0], piv[1] - parmak], egil);
    sepet = (
      <g transform={`translate(${hx.toFixed(1)} ${hy.toFixed(1)}) rotate(${(-8 + egil).toFixed(1)}) scale(${S.toFixed(3)})`}>
        <path d="M -95 -50 L 95 -50 L 80 80 L -80 80 Z" fill="#c8a070" stroke={O} strokeWidth={5} />
        {[-20, 15, 50].map((yy) => <path key={yy} d={`M ${-92 + (yy + 50) * 0.11} ${yy} H ${92 - (yy + 50) * 0.11}`} stroke="#8a6440" strokeWidth={5} />)}
        <path d="M -92 -48 Q -50 -100 0 -76 Q 50 -110 94 -48 Z" fill="#e8a0b8" stroke="#a86078" strokeWidth={4} />
        <path d="M -60 -52 Q -30 -86 20 -66" stroke="#7ab0d8" strokeWidth={24} strokeLinecap="round" fill="none" />
        <path d="M 20 -56 Q 50 -84 80 -56" stroke="#34466a" strokeWidth={22} strokeLinecap="round" fill="none" />
      </g>
    );
  }
  return { govde, on: <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>{sepet}{kollar}{esyalar}</svg> };
};

/* ------------------------------------------------------------------ sahne */
const B7Banyo: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = prm(text);
  const t0 = p.t0 ?? 0;
  const tg = f / fps + t0;
  const t0f = -Math.round(t0 * fps); // sahne zamanı 0'ın bu vuruştaki kare karşılığı
  const [cx, cy, z] = kf(p.cam, tg, [540, 1000, 1]);
  const tA = p.titre ?? 3;
  const sx = tA * (Math.sin(tg * 1.7) * 0.7 + Math.sin(tg * 3.1) * 0.3), sy = tA * (Math.sin(tg * 1.3 + 1) * 0.6 + Math.sin(tg * 2.7) * 0.4);
  const isik = p.isik ?? 1;
  const anne = karakter("anne724", p.anne, tg, f, fps, t0f);
  const ece = karakter("ece_ev", p.ece, tg, f, fps, t0f);
  const ucanlar = (p.ucan ?? []).map((u: Prm, i: number) => {
    if (tg < u.t0 || tg > u.t1 + 0.05) return null;
    const k = Math.min(1, (tg - u.t0) / (u.t1 - u.t0));
    const xx = u.a[0] + (u.b[0] - u.a[0]) * k, yy = u.a[1] + (u.b[1] - u.a[1]) * k - (u.h ?? 200) * 4 * k * (1 - k);
    return <Esya key={i} n={u.n} x={xx} y={yy} s={u.s ?? 1.25} a={(u.don ?? 1) * 360 * k} />;
  });
  const yerde = (p.yerde ?? []).filter((u: Prm) => tg >= u.t).map((u: Prm, i: number) => <Esya key={i} n={u.n} x={u.x} y={u.y} s={u.s ?? 1.25} a={u.a ?? 0} />);
  const onceEce = p.eceOnde ? [anne, ece] : [ece, anne];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: camT(cx, cy, z, sx, sy), filter: `sepia(${0.12 * isik}) saturate(${1 + 0.08 * isik})` }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id="b7_pen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd08a" /><stop offset="1" stopColor="#ff9a5a" /></linearGradient>
          </defs>
          <Banyo724BG view="kapi" frame={f} doorOpen={kf1(p.kapi, tg, 1)} />
          {/* gün batımı penceresi (buzlu), makinenin üstünde */}
          <rect x={330} y={470} width={230} height={300} fill="url(#b7_pen)" stroke="#f4f0e8" strokeWidth={14} />
          <path d="M 445 470 V 770 M 330 620 H 560" stroke="#f4f0e8" strokeWidth={8} />
          <rect x={330} y={470} width={230} height={300} fill="#fff" opacity={0.12} />
          {/* sepet makinenin üstüne bırakılmış (p.makineSepet) */}
          {p.makineSepet ? (
            <g transform="translate(450 1095) rotate(-4) scale(1.2)">
              <path d="M -95 -50 L 95 -50 L 80 55 L -80 55 Z" fill="#c8a070" stroke={O} strokeWidth={5} />
              {[-20, 15].map((yy) => <path key={yy} d={`M ${-92 + (yy + 50) * 0.11} ${yy} H ${92 - (yy + 50) * 0.11}`} stroke="#8a6440" strokeWidth={5} />)}
              <path d="M -92 -48 Q -50 -100 0 -76 Q 50 -110 94 -48 Z" fill="#e8a0b8" stroke="#a86078" strokeWidth={4} />
              <path d="M -60 -52 Q -30 -86 20 -66" stroke="#7ab0d8" strokeWidth={24} strokeLinecap="round" fill="none" />
            </g>
          ) : null}
        </svg>
        {/* karakterler: önce arkadaki */}
        {onceEce.map((k, i) => (k ? <React.Fragment key={i}>{k.govde}{k.on}</React.Fragment> : null))}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {ucanlar}
          {yerde}
          {/* kirli sepeti yerde (önde, sağda; p.yerSepet) */}
          {p.yerSepet ? <g>
            <path d="M 760 1700 L 960 1700 L 935 1900 L 785 1900 Z" fill="#c8a070" stroke="#6a4a2a" strokeWidth={6} />
            {[1740, 1785, 1830, 1872].map((yy) => <path key={yy} d={`M ${765 + (yy - 1700) * 0.12} ${yy} H ${955 - (yy - 1700) * 0.12}`} stroke="#8a6440" strokeWidth={5} />)}
            <path d="M 768 1702 Q 810 1650 860 1676 Q 910 1640 956 1702 Z" fill="#e8a0b8" stroke="#a86078" strokeWidth={4} />
            <path d="M 800 1702 Q 830 1664 880 1690" stroke="#7ab0d8" strokeWidth={26} strokeLinecap="round" fill="none" />
          </g> : null}
          <Banyo724FG view="kapi" frame={f} doorOpen={0} />
        </svg>
        {/* gün batımı huzmesi: pencereden sağ-aşağı (karakterleri de aydınlatır) */}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", mixBlendMode: "screen", pointerEvents: "none" }}>
          <defs>
            <linearGradient id="b7_h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffb060" stopOpacity={0.55 * isik} /><stop offset="1" stopColor="#ff8a40" stopOpacity={0} /></linearGradient>
            <filter id="b7_bl"><feGaussianBlur stdDeviation="18" /></filter>
          </defs>
          <path d="M 330 470 L 560 470 L 1180 1700 L 760 1960 Z" fill="url(#b7_h)" filter="url(#b7_bl)" />
          {new Array(18).fill(0).map((_, i) => {
            const u = ((i * 0.137 + tg * 0.03) % 1);
            const xx = 420 + u * 600 + Math.sin(tg + i) * 20, yy = 560 + u * 1100 + ((i * 97) % 160);
            return <circle key={i} cx={xx} cy={yy} r={2 + (i % 3)} fill="#fff0c8" opacity={0.25 + 0.3 * Math.abs(Math.sin(tg * 1.4 + i))} />;
          })}
        </svg>
      </AbsoluteFill>
      {/* sıcak renk + vinyet */}
      <AbsoluteFill style={{ background: `linear-gradient(160deg, rgba(255,150,80,${0.1 * isik}) 0%, rgba(40,20,50,${0.12 * isik}) 100%)`, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 48%, rgba(0,0,0,0) 58%, rgba(30,12,20,0.42) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Insert16: React.FC<{ kind: Insert16Kind; dur: number; text?: string[] }> = ({ text }) => <B7Banyo text={text} />;
