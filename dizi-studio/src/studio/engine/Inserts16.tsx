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
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";
import type { ArmPose, Emotion, MouthCue } from "../rig/types";
import { Banyo724BG, Banyo724FG } from "../sets/banyo724";
import { Ev724BG, Ev724FG, Ev724SalonBG, Ev724SalonFG } from "../sets/ev724";
import { sstep } from "./bocek";
import { kfYay, yaySim } from "./canli";
import { ik, Kol, type V2 } from "./Inserts13";
import { Insert11, type Insert11Kind } from "./Inserts11";
import { Insert14, type Insert14Kind } from "./Inserts14";
import { Insert15, type Insert15Kind } from "./Inserts15";
import { Insert17, INSERT17_KINDS, type Insert17Kind } from "./Inserts17";

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
const kfDuz = kf;
const basamak = <T,>(k: [number, T][] | undefined, t: number, def: T): T => {
  let v = def;
  for (const [a, x] of k ?? []) if (t >= a) v = x;
  return v;
};
const aralik = (r: number[][] | undefined, t: number) => (r ?? []).some(([a, b]) => t >= a && t < b);
const O = "#2b1d1a";
/** makinenin üstü: bırakılan sepetin yeri */
const MAK_SEPET: V2 = [450, 1095];
const camT = (cx: number, cy: number, z: number, sx = 0, sy = 0) => `translate(${540 + sx}px, ${960 + sy}px) scale(${z}) translate(${-cx}px, ${-cy}px)`;
const rot = (p: V2, c: V2, deg: number): V2 => {
  const r = (deg * Math.PI) / 180, dx = p[0] - c[0], dy = p[1] - c[1];
  return [c[0] + dx * Math.cos(r) - dy * Math.sin(r), c[1] + dx * Math.sin(r) + dy * Math.cos(r)];
};

/* ------------------------------------------------------------------ doğal kol: dirsek kendiliğinden seçilir, kol yumuşak kavisle çizilir
 * İki IK çözümünden: el omuzdan belirgin yukarıdaysa dirsek gövdeden DIŞA, değilse AŞAĞI bakan seçilir (dirsek asla ters kırılmaz). */
const ikDogal = (S0: V2, T: V2, L1: number, L2: number, merkezX: number): { E: V2; H: V2 } => {
  const a = ik(S0, T, L1, L2, 1), b = ik(S0, T, L1, L2, -1);
  // el omuz hizasının üstündeyse (yüz, kulak, baş) dirsek DIŞA; değilse AŞAĞI
  if (T[1] < S0[1] + L1 * 0.15) {
    const dis = (E: V2) => Math.abs(E[0] - merkezX);
    return dis(a.E) >= dis(b.E) ? a : b;
  }
  return a.E[1] >= b.E[1] ? a : b;
};
const KolYumusak: React.FC<{ S: V2; E: V2; H: V2; w: number; renk: string; manset?: string; el: string }> = ({ S, E, H, w, renk, manset, el }) => {
  // kontrol noktası: eğri dirsekten geçsin (Q eğrisi orta noktası = E)
  const C: V2 = [2 * E[0] - (S[0] + H[0]) / 2, 2 * E[1] - (S[1] + H[1]) / 2];
  const d = `M ${S[0].toFixed(1)} ${S[1].toFixed(1)} Q ${C[0].toFixed(1)} ${C[1].toFixed(1)} ${H[0].toFixed(1)} ${H[1].toFixed(1)}`;
  const ang = Math.atan2(H[1] - C[1], H[0] - C[0]);
  const mx = H[0] - Math.cos(ang) * w * 0.6, my = H[1] - Math.sin(ang) * w * 0.6;
  return (
    <g>
      <path d={d} stroke={O} strokeWidth={w * 2.36} fill="none" strokeLinecap="round" />
      <path d={d} stroke={renk} strokeWidth={w * 2} fill="none" strokeLinecap="round" />
      {manset ? <path d={`M ${mx - Math.sin(ang) * w * 0.85} ${my + Math.cos(ang) * w * 0.85} L ${mx + Math.sin(ang) * w * 0.85} ${my - Math.cos(ang) * w * 0.85}`} stroke={manset} strokeWidth={w * 0.5} /> : null}
      <circle cx={H[0]} cy={H[1]} r={w * 0.95} fill={el} stroke={O} strokeWidth={w * 0.18} />
    </g>
  );
};

/* ------------------------------------------------------------------ eşyalar (el ölçeğinde, s = karakter ölçeği) */
export const Esya: React.FC<{ n: string; x: number; y: number; s: number; a?: number }> = ({ n, x, y, s, a = 0 }) => {
  const tr = `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)}) scale(${s.toFixed(3)})`;
  if (n === "su" || n === "suAcik" || n === "suYarim")  // B9 P2: pet su şişesi (el ortasından kavrar); suAcik: kapaksız; suYarim: yarıya inmiş
    return (
      <g transform={tr}>
        <path d="M -19 52 L -19 -46 Q -19 -60 -9 -68 L -8 -80 L 8 -80 L 9 -68 Q 19 -60 19 -46 L 19 52 Q 19 58 13 58 L -13 58 Q -19 58 -19 52 Z" fill="#d8eef8" fillOpacity={0.78} stroke={O} strokeWidth={4} />
        <path d={`M -17 ${n === "suYarim" ? 12 : -38} L 17 ${n === "suYarim" ? 12 : -38} L 17 52 Q 17 56 12 56 L -12 56 Q -17 56 -17 52 Z`} fill="#9ccbe8" opacity={0.75} />
        <rect x={-19} y={-18} width={38} height={30} fill="#2a7ad0" stroke={O} strokeWidth={2.5} />
        <path d="M -12 -4 Q 0 -12 12 -4" stroke="#ffffff" strokeWidth={3} fill="none" />
        <path d="M -11 -52 L -11 40" stroke="#ffffff" strokeWidth={4} opacity={0.6} strokeLinecap="round" />
        {n === "su" ? <rect x={-10} y={-92} width={20} height={14} rx={2} fill="#2a5ad8" stroke={O} strokeWidth={3} /> : <rect x={-8} y={-84} width={16} height={5} fill="#e8f4fa" stroke={O} strokeWidth={2} />}
      </g>
    );
  if (n === "kapak")  // B9 P2: şişe kapağı (parmaklar arasında)
    return (
      <g transform={tr}>
        <rect x={-10} y={-26} width={20} height={14} rx={2} fill="#2a5ad8" stroke={O} strokeWidth={3} />
      </g>
    );
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
  if (n === "pijama")
    return (
      <g transform={tr}>
        <path d="M -60 -50 L -20 -60 Q 0 -48 20 -60 L 60 -50 L 80 -20 L 52 -8 L 48 50 L -48 50 L -52 -8 L -80 -20 Z" fill="#e8a0b8" stroke={O} strokeWidth={4} strokeLinejoin="round" />
        <circle cx={0} cy={8} r={16} fill="#f2a25a" stroke={O} strokeWidth={2} />
      </g>
    );
  if (n === "pantolon")
    return (
      <g transform={tr}>
        <path d="M -40 -60 L 40 -60 L 48 60 L 10 62 L 0 -5 L -10 62 L -48 60 Z" fill="#b8a0d0" stroke={O} strokeWidth={4} strokeLinejoin="round" />
      </g>
    );
  if (n === "tabak")
    return (
      <g transform={tr}>
        <ellipse cx={0} cy={0} rx={70} ry={22} fill="#ffffff" stroke={O} strokeWidth={4} />
        <ellipse cx={0} cy={-2} rx={46} ry={13} fill="#f2f0ea" />
      </g>
    );
  if (n === "zeytin")
    return (
      <g transform={tr}>
        <ellipse cx={0} cy={-16} rx={10} ry={8} fill="#2a2228" stroke="#000" strokeWidth={1.5} />
        <circle cx={-3} cy={-19} r={2.5} fill="#ffffff" opacity={0.5} />
      </g>
    );
  if (n === "isaret")  // dik işaret parmağı (azar, sayma)
    return (
      <g transform={tr}>
        <path d="M 0 0 L 0 -66" stroke={O} strokeWidth={22} strokeLinecap="round" />
        <path d="M 0 0 L 0 -66" stroke="#f0c8a8" strokeWidth={15} strokeLinecap="round" />
      </g>
    );
  if (n === "basparmakArka")  // B8 P2: omzun üstünden arkayı gösteren başparmak (yumruk + kadraj sağına-yukarı başparmak)
    return (
      <g transform={`${tr} scale(1.2)`}>
        <path d="M 2 -10 Q 18 -34 34 -58" stroke={O} strokeWidth={24} strokeLinecap="round" fill="none" />
        <path d="M 2 -10 Q 18 -34 34 -58" stroke="#f0c8a8" strokeWidth={17} strokeLinecap="round" fill="none" />
        <ellipse cx={33} cy={-55} rx={4.5} ry={5.5} fill="#f8e0d0" />
      </g>
    );
  if (n === "iki")  // iki parmak (sayma: 2)
    return (
      <g transform={tr}>
        {[-12, 12].map((dx) => <g key={dx}><path d={`M ${dx} 0 L ${dx * 1.6} -62`} stroke={O} strokeWidth={20} strokeLinecap="round" /><path d={`M ${dx} 0 L ${dx * 1.6} -62`} stroke="#f0c8a8" strokeWidth={13} strokeLinecap="round" /></g>)}
      </g>
    );
  if (n === "parmak")  // dik işaret parmağı (böcek anteni)
    return (
      <g transform={tr}>
        <path d="M 0 0 L 0 -62" stroke={O} strokeWidth={22} strokeLinecap="round" />
        <path d="M 0 0 L 0 -62" stroke="#f0c8a8" strokeWidth={15} strokeLinecap="round" />
        <path d="M 0 -64 q 10 -30 30 -40" stroke={O} strokeWidth={4} fill="none" />
        <circle cx={32} cy={-106} r={6} fill={O} />
      </g>
    );
  if (n === "kalem")  // B8: tükenmez kalem (el içinde, uç aşağıda)
    return (
      <g transform={tr}>
        <path d="M 0 10 L 0 -92" stroke={O} strokeWidth={13} strokeLinecap="round" />
        <path d="M 0 4 L 0 -92" stroke="#f2f2f0" strokeWidth={8} strokeLinecap="round" />
        <path d="M 0 -76 L 0 -94" stroke="#2a4aa8" strokeWidth={9} strokeLinecap="round" />
        <path d="M 0 8 L 0 22" stroke="#8a8e94" strokeWidth={5} strokeLinecap="round" />
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
export type KarCiz = { govde: React.ReactNode; on: React.ReactNode };
export const karakter = (id: string, q: Prm | undefined, tg: number, f: number, fps: number, t0f: number): KarCiz | null => {
  if (!q) return null;
  const look = castById(id);
  // CANLILIK (opt-in, q.yay = güç ~1): hareket anahtarları hazırlık + aşma eğrisiyle; saç yaylı takip; ezilme/uzama
  const yay = (q.yay as number | undefined) ?? 0;
  const kf = (k: KF | undefined, t: number, def: number[]) => (yay ? kfYay(k, t, def, yay) : kfDuz(k, t, def));
  const kf1 = (k: KF | undefined, t: number, d: number) => kf(k, t, [d])[0];
  const kfD1 = (k: KF | undefined, t: number, d: number) => kfDuz(k, t, [d])[0];
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
  const parmak = kfD1(q.parmakUcu, tg, 0);
  // ezilme (+) / uzama (-): ayak noktasından, alan korunur (sx·sy ≈ 1)
  const ez = q.ezil ? kfDuz(q.ezil, tg, [0])[0] : 0;
  const ezY = 1 - ez, ezX = 1 / Math.max(0.5, ezY);
  // saç takibi: baş (yatay konum + eğilme + yatma) hareket edince saç geriden gelir, sallanıp durur
  const sacEk = yay ? yaySim((tt) => kf(q.yer, tt, [540])[0] / S * 0.35 + kf(q.egil, tt, [0])[0] * 2.2 + kf(q.tilt, tt, [0])[0] * 1.6 + kf(q.bak, tt, [0, 0, 0])[2] * 40, tg) * -1.2 : 0;
  const tf = [egil ? `rotate(${egil}deg)` : "", ez ? `scale(${ezX.toFixed(4)}, ${ezY.toFixed(4)})` : ""].join(" ").trim() || undefined;
  const govde = (
    <div style={{ position: "absolute", left, top: top - parmak, transformOrigin: `${200 * S}px ${980 * S}px`, transform: tf }}>
      <Character look={look} size={size} pose={{
        emotion: emo, lookX: lx, lookY: ly, yaw, tilt: kf1(q.tilt, tg, 0), armL: q.jest ? undefined : armL, armR: q.jest ? undefined : armR, kolGizle,
        eyesClosed: q.goz ? kfD1(q.goz, tg, 0) || undefined : undefined, gozSok: q.gozSok ? kfD1(q.gozSok, tg, 0) || undefined : undefined,
        speech: aralik(q.kikir, tg) ? undefined : speech, talk: aralik(q.kikir, tg) || (!speech && aralik(q.agzi, tg)) ? [[f - 2, f + 2]] : undefined,
        body: aralik(q.yuru, tg) ? "walk" : undefined, tears: q.tears, sacDagin: q.sacDagin, seed: id.length * 7,
        gesture: q.jest ? (basamak<string | null>(q.jest, tg, null) ?? undefined) as never : undefined,
        sweat: aralik(q.ter, tg) || undefined, pale: q.solgun ? kfD1(q.solgun, tg, 0) || undefined : undefined,
        yutkun: q.yutkun ? kfD1(q.yutkun, tg, 0) || undefined : undefined, breath: q.nefes ? kfD1(q.nefes, tg, 1) : undefined,
        omuzDus: q.omuzDus ? kfD1(q.omuzDus, tg, 0) || undefined : undefined, taklit: q.taklit ? kfD1(q.taklit, tg, 0) || undefined : undefined,
        parilti: q.parilti ? (kfDuz(q.parilti, tg, [0, 0]) as [number, number]) : undefined, gozKis: q.gozKis ? (kfDuz(q.gozKis, tg, [0, 0]) as [number, number]) : undefined,
        sacEk: sacEk ? Math.max(-40, Math.min(40, sacEk)) : undefined,
        yerOtur: q.yerOtur ? kfD1(q.yerOtur, tg, 0) || undefined : undefined,
      }} />
    </div>
  );
  // IK kollar (ekran/dünya koordinatında): omuz rig (200 ± 72·wx, 352)
  const kollar: React.ReactNode[] = [];
  const esyalar: React.ReactNode[] = [];
  const renk = look.outfit.top, manset = look.outfit.topShade;
  const L1 = 140 * S, L2 = 124 * S, w = 20 * S;
  const yerK = q.yerOtur ? Math.max(0, Math.min(1, kfD1(q.yerOtur, tg, 0))) : 0;   // B9 P2: yere oturunca omuz 345 birim iner
  const sideDraw = (side: "L" | "R") => {
    const omuz0: V2 = [left + (200 + (side === "L" ? -72 : 72) * wx) * S, top - parmak + (352 + 345 * yerK) * S];
    const omuz = rot(ez ? [x + (omuz0[0] - x) * ezX, y - parmak + (omuz0[1] - (y - parmak)) * ezY] : omuz0, [piv[0], piv[1] - parmak], egil);
    const ozel = side === "L" ? ozelL : ozelR;
    const tut = basamak<string | null>(side === "L" ? q.tutL : q.tutR, tg, null);
    let H: V2;
    if (ozel) {
      const [hx, hy] = kf(side === "L" ? q.elL : q.elR, tg, [omuz[0], omuz[1] + 250 * S]);
      let r: { E: V2; H: V2 };
      const uzak = Math.hypot(hx - omuz[0], hy - omuz[1]);
      if (q.onKol && uzak < (L1 + L2) * 0.84) {
        // önden kısaltılmış kol: dirsek HER ZAMAN aşağıda, gövdenin yanında (V/U kol yok); önkol ele gider
        const dis = side === "L" ? -1 : 1;
        const dirsekY = omuz[1] + L1 * 0.95;
        let E: V2;
        if (hy < dirsekY - 12) {
          const ex = omuz[0] + (hx - omuz[0]) * 0.35 + dis * 6 * S;
          const ey = Math.max(hy + L2 * 0.45, Math.min(dirsekY, hy + L2 * 1.15));
          E = [ex, ey];
        } else {
          E = [omuz[0] + (hx - omuz[0]) * 0.5 + dis * 14 * S, omuz[1] + (hy - omuz[1]) * 0.55];
        }
        r = { E, H: [hx, hy] };
        kollar.push(<Kol key={side} S={omuz} E={E} H={[hx, hy]} w={w} renk={renk} manset={manset} el={look.skin} />);
      } else if (q.dogalKol) {
        r = ikDogal(omuz, [hx, hy], L1, L2, piv[0]);
        kollar.push(<KolYumusak key={side} S={omuz} E={r.E} H={r.H} w={w} renk={renk} manset={manset} el={look.skin} />);
      } else {
        const bk = side === "L" ? q.bukumL : q.bukumR;
        const bukum = (Array.isArray(bk) ? basamak<number>(bk as [number, number][], tg, side === "L" ? 1 : -1) : bk ?? (side === "L" ? 1 : -1)) as 1 | -1;
        r = ik(omuz, [hx, hy], L1, L2, bukum);
        kollar.push(<Kol key={side} S={omuz} E={r.E} H={r.H} w={w} renk={renk} manset={manset} el={look.skin} />);
      }
      H = r.H;
    } else {
      // rig kolu: elin yaklaşık yeri (eşya için): omuzdan aşağı, upper açısıyla
      const up = ((side === "L" ? kolL[0] : kolR[0]) * Math.PI) / 180;
      const sgn = side === "L" ? -1 : 1;
      H = [omuz[0] + sgn * Math.sin(up) * (L1 + L2) * 0.9, omuz[1] + Math.cos(up) * (L1 + L2) * 0.9];
    }
    // çorap bilekten (lastikten) tutulur, aşağı sarkar; kot belinden tutulur
    const dy = tut === "corap" ? 52 * S : tut === "kot" ? 215 * S : tut === "parmak" || tut === "isaret" || tut === "iki" || tut === "basparmakArka" ? -10 * S : -6 * S;
    // eşya, tutan kolun hemen önünde; öbür kol sonra çizilir (ör. sağ el, sol elin tuttuğu kotun cebini yoklar)
    if (tut) kollar.push(<Esya key={`e${side}`} n={tut} x={H[0]} y={H[1] + dy} s={S * (tut === "kot" ? 2.5 : 1)} a={q.esyaAci && (tut === "su" || tut === "suAcik" || tut === "suYarim") ? kfD1(q.esyaAci, tg, 0) : tut === "isaret" && q.isaretAci !== undefined ? (q.isaretAci as number) : tut === "corap" || tut === "isaret" || tut === "iki" || tut === "basparmakArka" ? 0 : tut === "kalem" ? (side === "L" ? -32 : 32) : side === "L" ? -15 : 15} />);
  };
  sideDraw("L");
  sideDraw("R");
  // kirli sepeti sağ kalçada (sağ kol sarar; el sepetin arkasında kalır)
  let sepet: React.ReactNode = null;
  const birak = q.sepetBirak as number[] | undefined;
  if (kfD1(q.sepet, tg, 0) > 0.5 && !(birak && tg >= birak[1])) {
    const [hx0, hy0] = rot([left + 300 * S, top - parmak + 600 * S], [piv[0], piv[1] - parmak], egil);
    const u = birak ? sstep(birak[0], birak[1], tg) : 0;
    const hx = hx0 + (MAK_SEPET[0] - hx0) * u, hy = hy0 + (MAK_SEPET[1] - hy0) * u - 60 * Math.sin(Math.PI * u);
    const sc = S + (1.2 - S) * u;
    sepet = (
      <g transform={`translate(${hx.toFixed(1)} ${hy.toFixed(1)}) rotate(${(-8 + egil + 4 * u).toFixed(1)}) scale(${sc.toFixed(3)})`}>
        <path d="M -95 -50 L 95 -50 L 80 80 L -80 80 Z" fill="#c8a070" stroke={O} strokeWidth={5} />
        {[-20, 15, 50].map((yy) => <path key={yy} d={`M ${-92 + (yy + 50) * 0.11} ${yy} H ${92 - (yy + 50) * 0.11}`} stroke="#8a6440" strokeWidth={5} />)}
        <path d="M -92 -48 Q -50 -100 0 -76 Q 50 -110 94 -48 Z" fill="#e8a0b8" stroke="#a86078" strokeWidth={4} />
        <path d="M -60 -52 Q -30 -86 20 -66" stroke="#7ab0d8" strokeWidth={24} strokeLinecap="round" fill="none" />
        <path d="M 20 -56 Q 50 -84 80 -56" stroke="#34466a" strokeWidth={22} strokeLinecap="round" fill="none" />
      </g>
    );
  }
  const damlaOnce: React.ReactNode[] = [];
  // ıslak yüz: alından ve çeneden süzülen damlalar (yüz merkezi rig (200,210))
  const yk = kfD1(q.yanak, tg, 0);
  if (yk > 0.02) {
    const [fx, fy] = rot([left + 200 * S, top - parmak + 215 * S], [piv[0], piv[1] - parmak], egil);
    const ten = look.skin;
    damlaOnce.push(<g key="yanak"><ellipse cx={fx - 58 * S} cy={fy + 38 * S} rx={(16 + 6 * yk) * S} ry={(14 + 5 * yk) * S} fill={ten} stroke={O} strokeWidth={2.4 * S} opacity={yk} />
      <ellipse cx={fx - 62 * S} cy={fy + 34 * S} rx={6 * S} ry={4 * S} fill="#ffffff" opacity={0.35 * yk} /></g>);
  }
  const isl = kf1(q.islak, tg, 0);
  const damla: React.ReactNode[] = [];
  if (isl > 0.02) {
    const [fx, fy] = rot([left + 200 * S, top - parmak + 215 * S], [piv[0], piv[1] - parmak], egil);
    [[-46, -40, 0.0], [38, -30, 0.35], [-20, 30, 0.6], [24, 50, 0.15], [0, 95, 0.8], [-58, 20, 0.5]].forEach(([dx, dy0, ph], i) => {
      const u = (tg * 0.55 + ph) % 1;
      const yy = fy + (dy0 + 70 * u) * S, xx = fx + dx * S;
      damla.push(<path key={i} d={`M ${xx} ${yy - 9 * S} q ${-6 * S} ${10 * S} 0 ${15 * S} q ${6 * S} ${-5 * S} 0 ${-15 * S} z`} fill="#d8f0ff" stroke="#6fa8cf" strokeWidth={1.4 * S} opacity={isl * (u < 0.85 ? 0.9 : (1 - u) * 6)} />);
    });
    damla.push(<ellipse key="parla" cx={fx} cy={fy - 10 * S} rx={70 * S} ry={60 * S} fill="#ffffff" opacity={0.08 * isl} />);
  }
  // kızaran kulak (kadrajın solundaki kulak; kulak çekmeden sonra): rig (110,238)
  const kz = kf1(q.kulak, tg, 0);
  const kulakK: React.ReactNode[] = [];
  if (kz > 0.02) {
    const tl = kf1(q.tilt, tg, 0);
    const [kx, ky] = rot(rot([left + (104 + yaw * 18) * S, top - parmak + 210 * S], [left + 200 * S, top - parmak + 300 * S], tl), [piv[0], piv[1] - parmak], egil);
    kulakK.push(<ellipse key="kz" cx={kx} cy={ky} rx={13 * S} ry={22 * S} fill="#e8302a" opacity={0.65 * kz} style={{ mixBlendMode: "multiply" }} />);
    kulakK.push(<ellipse key="kz2" cx={kx - 2 * S} cy={ky - 4 * S} rx={6 * S} ry={9 * S} fill="#ff6a50" opacity={0.45 * kz} />);
  }
  // hırka cebinde deste (sağ cep, rig (262,640)): üst yarısı cepten görünür
  const cepte: React.ReactNode[] = [];
  if (basamak<number>(q.cepDeste, tg, 0) > 0.5) {
    const [cx2, cy2] = rot([left + 240 * S, top - parmak + 610 * S], [piv[0], piv[1] - parmak], egil);
    cepte.push(<g key="cep" transform={`translate(${cx2.toFixed(1)} ${cy2.toFixed(1)}) rotate(${(-8 + egil).toFixed(1)}) scale(${(S * 0.8).toFixed(3)})`}>
      <rect x={-26} y={-44} width={52} height={50} rx={3} fill="#7ab88a" stroke={O} strokeWidth={3} />
      <rect x={-7} y={-47} width={14} height={52} fill="#e8d8b0" stroke={O} strokeWidth={2} />
      <path d="M -40 -4 L 40 -4 L 36 60 L -36 60 Z" fill={look.outfit.topShade} stroke={O} strokeWidth={4} />
      <path d="M -34 4 L 34 4 M -30 54 L 30 54" stroke={look.outfit.top} strokeWidth={3} strokeDasharray="6 4" />
    </g>);
  }
  // başında/omzunda eşya (ör. fırlatılan pijama annenin başına düşer): kafada [[t, eşya|null]]
  const kafa = basamak<string | null>(q.kafada, tg, null);
  const kafaE: React.ReactNode[] = [];
  if (kafa) {
    const [hx2, hy2] = rot([left + 230 * S, top - parmak + 150 * S], [piv[0], piv[1] - parmak], egil);
    kafaE.push(<g key="kafa"><Esya n={kafa} x={hx2} y={hy2} s={S * 1.6} a={-28} /></g>);
  }
  return { govde, on: <svg viewBox="-600 -200 2280 2320" width={2280} height={2320} style={{ position: "absolute", left: -600, top: -200, overflow: "visible" }}>{sepet}{kulakK}{cepte}{damlaOnce}{kollar}{esyalar}{damla}{kafaE}</svg> };
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
  const ayna = p.view === "ayna";
  const salon = p.view === "salon";
  const antre = p.view === "antre";
  const anne = karakter("anne724", p.anne, tg, f, fps, t0f);
  const ece = karakter(basamak<string>(p.eceId, tg, "ece_ev"), p.ece, tg, f, fps, t0f);
  const ucanlar = (p.ucan ?? []).map((u: Prm, i: number) => {
    if (tg < u.t0 || tg > u.t1 + 0.05) return null;
    const k = Math.min(1, (tg - u.t0) / (u.t1 - u.t0));
    const xx = u.a[0] + (u.b[0] - u.a[0]) * k, yy = u.a[1] + (u.b[1] - u.a[1]) * k - (u.h ?? 200) * 4 * k * (1 - k);
    return <Esya key={i} n={u.n} x={xx} y={yy} s={u.s ?? 1.25} a={(u.don ?? 1) * 360 * k} />;
  });
  const yerde = (p.yerde ?? []).filter((u: Prm) => tg >= u.t && (u.son === undefined || tg < u.son)).map((u: Prm, i: number) => <Esya key={i} n={u.n} x={u.x} y={u.y} s={u.s ?? 1.25} a={u.a ?? 0} />);
  const eceOnde = typeof p.eceOnde === "number" ? tg >= p.eceOnde : !!p.eceOnde;
  const gece = !!p.gece;
  // Ece kapının arkasındayken kapı boşluğuna kırpılır: eceKirp [[t0,t1,x1,y1,x2,y2]]
  const kirp = (p.eceKirp ?? []).find((r: number[]) => tg >= r[0] && tg < r[1]) as number[] | undefined;
  const eceSar0 = (k: KarCiz | null) => (k ? (kirp ? (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: `polygon(${kirp[2]}px ${kirp[3]}px, ${kirp[4]}px ${kirp[3]}px, ${kirp[4]}px ${kirp[5]}px, ${kirp[2]}px ${kirp[5]}px)` }}>{k.govde}{k.on}</div>
  ) : <>{k.govde}{k.on}</>) : null);
  // ayna: yansıma yatayda ters (sivilce, kızaran kulak aynada doğru tarafta)
  const eceSar = (k: KarCiz | null) => (p.aynala && k ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "scaleX(-1)", transformOrigin: `${p.aynala}px 0` }}>{eceSar0(k)}</div> : eceSar0(k));
  const onceEce: React.ReactNode[] = eceOnde ? [anne ? <React.Fragment key="a">{anne.govde}{anne.on}</React.Fragment> : null, <React.Fragment key="e">{eceSar(ece)}</React.Fragment>]
    : [<React.Fragment key="e">{eceSar(ece)}</React.Fragment>, anne ? <React.Fragment key="a">{anne.govde}{anne.on}</React.Fragment> : null];
  // lamba (gece anahtar ışığı) konumu, görünüme göre
  const lamba: V2 = ayna ? [540, 90] : salon ? [540, 140] : antre ? [560, 200] : [620, 250];
  const golgeK = p.golgeK ?? 0.72;
  // hamamböceği: bocek {yol [[t,x,y]], t0, t1, ez, s}
  const bc = p.bocek as Prm | undefined;
  let bocekNode: React.ReactNode = null, bocekEzik: React.ReactNode = null;
  if (bc && !ayna && !salon && !antre) {
    if (tg >= bc.t0 && tg < (bc.ez ?? 99)) {
      const [bx, by] = kf(bc.yol, tg, [0, 0]);
      const [bx2, by2] = kf(bc.yol, tg + 0.05, [0, 0]);
      const ang = Math.atan2(by2 - by, bx2 - bx) * 180 / Math.PI;
      const hiz = Math.hypot(bx2 - bx, by2 - by) > 0.5;
      bocekNode = <Hamam x={bx} y={by} a={hiz ? ang : (bc.durAci ?? 200)} s={bc.s ?? 1} faz={hiz ? tg * 40 : 0} anten={tg * 9} />;
    } else if (bc.ez !== undefined && tg >= bc.ez) {
      const [bx, by] = kf(bc.yol, bc.ez, [0, 0]);
      const u = tg - bc.ez;
      // ezildi: ayakkabının altından tek anten ve bir bacak seğirir (1,5 sn), sonra durur
      const seg = u < 1.6 ? Math.sin(u * 30) * 10 * (1 - u / 1.6) : 0;
      bocekEzik = (
        <g transform={`translate(${bx + (bc.ezDx ?? 34)} ${by + 4}) scale(${bc.s ?? 1})`}>
          <path d={`M 0 0 q 14 ${-8 + seg * 0.4} 30 ${-4 + seg}`} stroke="#3a2214" strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <path d={`M -2 4 l 12 ${6 + seg * 0.3}`} stroke="#3a2214" strokeWidth={2.4} strokeLinecap="round" />
        </g>
      );
    }
  }
  // yakın ekler (sahne içinde tam ekran): ek [{k, tx, a, b, f}]
  const ekler = (p.ek ?? []).filter((e: Prm) => tg >= e.a && tg < e.b).map((e: Prm, i: number) => {
    const from = Math.round((e.a - t0) * fps), dur = e.b - e.a;
    return (
      <Sequence key={i} from={from} layout="none">
        <AbsoluteFill style={{ filter: e.f, zIndex: 5 }}>
          <EkKatman k={e.k} dur={dur} tx={e.tx} />
          {e.f ? <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 55%, rgba(60,40,20,0.55) 100%)" }} /> : null}
        </AbsoluteFill>
      </Sequence>
    );
  });
  const gol = p.golge ? kf(p.golge, tg, [1200, 0]) : null;
  const pel = p.pervazEl ? kf(p.pervazEl, tg, [1000, 0]) : null;
  const sah = p.sahanlik ? kf1(p.sahanlik, tg, 1) : 1;
  const alt = p.kapiAlti ? kf1(p.kapiAlti, tg, 0) : 0;
  const musAra = aralik(p.musElAra, tg);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: camT(cx, cy, z, sx, sy), filter: gece ? undefined : `sepia(${0.12 * isik}) saturate(${1 + 0.08 * isik})` }}>
        <svg viewBox="-600 -200 2280 2320" width={2280} height={2320} style={{ position: "absolute", left: -600, top: -200, overflow: "visible" }}>
          <defs>
            <linearGradient id="b7_pen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd08a" /><stop offset="1" stopColor="#ff9a5a" /></linearGradient>
            <filter id="b7_gbl"><feGaussianBlur stdDeviation="14" /></filter>
          </defs>
          {antre ? <Ev724BG frame={f} doorOpen={kf1(p.kapi, tg, 0)} zincir={!!p.zincir} kanatOnde={typeof p.kanatOnde === "number" ? tg >= p.kanatOnde : (p.kanatOnde ?? true)} /> : salon ? <Ev724SalonBG frame={f} odaKapi={kf1(p.odaKapi, tg, 0)} /> : <Banyo724BG view={ayna ? "ayna" : "kapi"} frame={f} doorOpen={kf1(p.kapi, tg, ayna ? 0 : 1)} gece={gece} />}
          {/* antre: gece pencere + sahanlık (otomatik ışık kapalıyken karanlık) */}
          {antre && gece ? <g><rect x={884} y={624} width={142} height={212} fill="#1c2440" />{[[900, 660], [960, 700], [990, 790], [915, 780]].map(([wx, wy], i) => <rect key={i} x={wx} y={wy} width={12} height={10} fill="#ffcf70" opacity={0.6} />)}<path d="M 955 620 V 840 M 880 730 H 1030" stroke="#c8b890" strokeWidth={6} /></g> : null}
          {antre && sah < 0.999 && kf1(p.kapi, tg, 0) > 0.02 ? (() => {
            const k = Math.min(1, kf1(p.kapi, tg, 0)), rx = Math.max(380, 720 - 340 * 0.85 * k - 120 * k);
            return <rect x={rx} y={470} width={720 - rx} height={1130} fill="#05060c" opacity={0.78 * (1 - sah)} />;
          })() : null}
          {/* koridorda gölge (Ece kapının arkasında yaklaşıyor) */}
          {gol && gol[1] > 0.01 && !ayna && !salon && !antre ? (
            <g clipPath="url(#b7_kapiKirp)" opacity={gol[1]}>
              <clipPath id="b7_kapiKirp"><rect x={620} y={430} width={340} height={1130} /></clipPath>
              <path d={`M ${gol[0] - 60} 1560 L ${gol[0] + 120} 1560 L ${gol[0] + 40} 1330 L ${gol[0] - 30} 1330 Z`} fill="#2a1a10" opacity={0.55} filter="url(#b7_gbl)" />
              <ellipse cx={gol[0] + 6} cy={1095} rx={70} ry={86} fill="#2a1a10" opacity={0.42} filter="url(#b7_gbl)" />
              <path d={`M ${gol[0] - 110} 1330 Q ${gol[0] + 4} 1150 ${gol[0] + 120} 1330 Z`} fill="#2a1a10" opacity={0.42} filter="url(#b7_gbl)" />
            </g>
          ) : null}
          {ayna || salon || antre ? null : <>
          {/* pencere (buzlu): gece (kasım, 18:00 karanlık) ya da gün batımı */}
          {p.gece ? (
            <g>
              <rect x={330} y={470} width={230} height={300} fill="#1c2440" stroke="#f4f0e8" strokeWidth={14} />
              {[[360, 560], [410, 640], [500, 520], [520, 690], [380, 700]].map(([wx, wy], i) => <rect key={i} x={wx} y={wy} width={18} height={14} fill="#ffcf70" opacity={0.55} />)}
              <rect x={330} y={470} width={230} height={300} fill="#8aa0c8" opacity={0.18} />
            </g>
          ) : (
            <rect x={330} y={470} width={230} height={300} fill="url(#b7_pen)" stroke="#f4f0e8" strokeWidth={14} />
          )}
          <path d="M 445 470 V 770 M 330 620 H 560" stroke="#f4f0e8" strokeWidth={8} />
          <rect x={330} y={470} width={230} height={300} fill="#fff" opacity={gece ? 0.04 : 0.08} />
          {/* çamaşır makinesi: kapak AÇIK (opt-in p.makineAcik; menteşe solda), tamburda çamaşırlar */}
          {p.makineAcik ? <g><circle cx={449} cy={1385} r={92} fill="#3a4248" stroke="#7a7e80" strokeWidth={10} />
          <circle cx={449} cy={1385} r={70} fill="#4a545c" />
          <path d="M 395 1420 Q 430 1370 480 1400 Q 505 1440 470 1450 Q 420 1460 395 1420 Z" fill="#e8a0b8" stroke="#a86078" strokeWidth={3} />
          {tg >= 1.1 ? <path d="M 430 1372 Q 470 1350 500 1380 Q 480 1405 440 1398 Z" fill="#7ab0d8" stroke="#5a8ab0" strokeWidth={3} /> : null}
          {tg >= 3.55 ? <path d="M 455 1408 l 30 -10 l 6 14 l -28 12 Z" fill="#f2efe6" stroke="#d8503a" strokeWidth={3} /> : null}
          <ellipse cx={338} cy={1385} rx={34} ry={104} fill="#c8d4da" stroke="#7a7e80" strokeWidth={10} />
          <ellipse cx={338} cy={1385} rx={18} ry={80} fill="#9ab0bc" opacity={0.7} /></g> : null}
          {/* sepet makinenin üstünde (p.makineSepet: zaman eşiği) */}
          {p.makineSepet === true || (typeof p.makineSepet === "number" && tg >= p.makineSepet) ? (
            <g transform="translate(450 1095) rotate(-4) scale(1.2)">
              <path d="M -95 -50 L 95 -50 L 80 55 L -80 55 Z" fill="#c8a070" stroke={O} strokeWidth={5} />
              {[-20, 15].map((yy) => <path key={yy} d={`M ${-92 + (yy + 50) * 0.11} ${yy} H ${92 - (yy + 50) * 0.11}`} stroke="#8a6440" strokeWidth={5} />)}
              <path d="M -92 -48 Q -50 -100 0 -76 Q 50 -110 94 -48 Z" fill="#e8a0b8" stroke="#a86078" strokeWidth={4} />
              <path d="M -60 -52 Q -30 -86 20 -66" stroke="#7ab0d8" strokeWidth={24} strokeLinecap="round" fill="none" />
            </g>
          ) : null}
          {/* cebi boşaltılmış kot, sepetin yanında makinenin üstünde (p.makineKot: zaman eşiği) */}
          {p.makineKot !== undefined && tg >= p.makineKot ? (
            <g transform="translate(548 1150) rotate(-80) scale(0.75 1.1)">
              <path d="M -50 -90 L 50 -90 L 58 80 L 12 84 L 2 -10 L -8 84 L -56 80 Z" fill="#34466a" stroke={O} strokeWidth={5} />
            </g>
          ) : null}
          {bocekNode}
          </>}
        </svg>
        {/* karakterler: önce arkadaki */}
        {onceEce}
        <svg viewBox="-600 -200 2280 2320" width={2280} height={2320} style={{ position: "absolute", left: -600, top: -200, overflow: "visible" }}>
          {bocekEzik}
          {/* kapı pervazını kavrayan dört parmak (Ece koridorda, duvarın arkasında): pervazEl [[t, y, görünürlük]] */}
          {pel && pel[1] > 0.01 && !ayna && !salon && !antre ? (
            <g opacity={Math.min(1, pel[1] * 3)}>
              {[0, 1, 2, 3].map((i) => {
                const yy = pel[0] + i * 21, uz = 22 * Math.min(1, pel[1]) - (i === 3 ? 6 : 0);
                return <rect key={i} x={984 - uz} y={yy} width={uz + 10} height={18} rx={9} fill="#f0c8a8" stroke={O} strokeWidth={3} />;
              })}
            </g>
          ) : null}
          {salon ? null : ucanlar}
          {salon ? null : yerde}
          {/* kirli sepeti yerde (önde, sağda; p.yerSepet) */}
          {p.yerSepet ? <g>
            <path d="M 760 1700 L 960 1700 L 935 1900 L 785 1900 Z" fill="#c8a070" stroke="#6a4a2a" strokeWidth={6} />
            {[1740, 1785, 1830, 1872].map((yy) => <path key={yy} d={`M ${765 + (yy - 1700) * 0.12} ${yy} H ${955 - (yy - 1700) * 0.12}`} stroke="#8a6440" strokeWidth={5} />)}
            <path d="M 768 1702 Q 810 1650 860 1676 Q 910 1640 956 1702 Z" fill="#e8a0b8" stroke="#a86078" strokeWidth={4} />
            <path d="M 800 1702 Q 830 1664 880 1690" stroke="#7ab0d8" strokeWidth={26} strokeLinecap="round" fill="none" />
          </g> : null}
          {antre ? <Ev724FG frame={f} doorOpen={kf1(p.kapi, tg, 0)} zincir={!!p.zincir} kanatOnde={typeof p.kanatOnde === "number" ? tg >= p.kanatOnde : (p.kanatOnde ?? true)} gece={gece} /> : salon ? <Ev724SalonFG yukari={p.yukari ?? 270} frame={f} tabak2={tg >= (p.tabak2 ?? 0)} tabak1={tg >= (p.tabak1 ?? 0)} zeytin={tg >= (p.zeytinAl ?? 99) ? 5 : 6} /> : <Banyo724FG view={ayna ? "ayna" : "kapi"} frame={f} doorOpen={0} gece={gece} />}
          {salon ? <>{yerde}{ucanlar}</> : null}
          {/* antre: kapalı kapının altından sızan sahanlık ışığı (kapiAlti 0..1) */}
          {/* musluk suyu (ayna görünümü, p.su [[t0,t1]]): bataryadan lavaboya akan su + sıçrama */}
          {ayna && aralik(p.su, tg) ? (
            <g>
              <path d={`M 532 1622 Q ${536 + Math.sin(tg * 30) * 2} 1690 534 1752 L 546 1752 Q ${544 + Math.sin(tg * 27) * 2} 1690 548 1622 Z`} fill="#cfeaff" opacity={0.85} />
              <path d="M 538 1630 V 1745" stroke="#ffffff" strokeWidth={3} opacity={0.7} />
              {[0, 1, 2, 3, 4].map((i) => {
                const u = (tg * 3 + i * 0.2) % 1;
                return <circle key={i} cx={540 + (i - 2) * 16 * u} cy={1755 - 26 * Math.sin(Math.PI * u)} r={4} fill="#dff2ff" opacity={1 - u} />;
              })}
            </g>
          ) : null}
          {/* ayna: Ece'nin GERÇEK eli (kadrajın altından) musluğu kapatır: musEl [[t,x,y]], musElAra */}
          {ayna && musAra ? (() => {
            const [mx, my] = kf(p.musEl, tg, [700, 2100]);
            return (
              <g>
                <path d={`M ${mx + 260} 2100 L ${mx + 40} ${my + 60}`} stroke={O} strokeWidth={118} strokeLinecap="round" />
                <path d={`M ${mx + 260} 2100 L ${mx + 40} ${my + 60}`} stroke="#e8a0b8" strokeWidth={108} strokeLinecap="round" />
                <ellipse cx={mx} cy={my} rx={58} ry={46} fill="#f0c8a8" stroke={O} strokeWidth={5} transform={`rotate(-30 ${mx} ${my})`} />
                <path d={`M ${mx - 40} ${my - 20} q -24 -30 -6 -50`} stroke={O} strokeWidth={5} fill="#f0c8a8" />
              </g>
            );
          })() : null}
        </svg>
        {/* IŞIK (gece): lamba anahtar ışık + soğuk gölgeler (multiply), sıcak havuz (screen), kapı/pencere sızıntıları */}
        {gece ? (
          <>
            <svg viewBox="-600 -200 2280 2320" width={2280} height={2320} style={{ position: "absolute", left: -600, top: -200, overflow: "visible", mixBlendMode: "multiply", pointerEvents: "none" }}>
              <defs>
                <radialGradient id="b7_gk" gradientUnits="userSpaceOnUse" cx={lamba[0]} cy={lamba[1]} r={1500}>
                  <stop offset="0" stopColor="#ffffff" /><stop offset="0.32" stopColor="#f2e8dc" /><stop offset="0.68" stopColor="#8a82a0" /><stop offset="1" stopColor="#38365a" />
                </radialGradient>
              </defs>
              <rect x={-600} y={-600} width={2280} height={3120} fill="url(#b7_gk)" opacity={golgeK} />
            </svg>
            <svg viewBox="-600 -200 2280 2320" width={2280} height={2320} style={{ position: "absolute", left: -600, top: -200, overflow: "visible", mixBlendMode: "screen", pointerEvents: "none" }}>
              <defs>
                <radialGradient id="b7_gs" gradientUnits="userSpaceOnUse" cx={lamba[0]} cy={lamba[1]} r={820}>
                  <stop offset="0" stopColor="#ffd89a" stopOpacity={0.42} /><stop offset="0.5" stopColor="#ffc880" stopOpacity={0.12} /><stop offset="1" stopColor="#ffc880" stopOpacity={0} />
                </radialGradient>
                <filter id="b7_gbl2"><feGaussianBlur stdDeviation="30" /></filter>
              </defs>
              <rect x={-600} y={-600} width={2280} height={3120} fill="url(#b7_gs)" />
              {!ayna && !salon && !antre ? <>
                {/* koridordan sızan sıcak ışık (arka/kenar ışığı) */}
                <path d="M 620 1560 L 960 1560 L 1180 1960 L 520 1960 Z" fill="#ffb060" opacity={0.16} filter="url(#b7_gbl2)" />
                {/* pencereden soğuk şehir ışığı (dolgu) */}
                <ellipse cx={445} cy={640} rx={260} ry={260} fill="#5a78c0" opacity={0.18} filter="url(#b7_gbl2)" />
              </> : null}
              {salon ? <ellipse cx={550} cy={720} rx={260} ry={300} fill="#5a78c0" opacity={0.14} filter="url(#b7_gbl2)" /> : null}
              {salon ? <rect x={960} y={540} width={140} height={1070} fill="#ffb060" opacity={0.2} filter="url(#b7_gbl2)" /> : null}
              {antre && sah > 0.01 && kf1(p.kapi, tg, 0) > 0.05 ? <path d="M 380 470 L 720 470 L 860 1960 L 260 1960 Z" fill="#fff0c0" opacity={0.16 * sah} filter="url(#b7_gbl2)" /> : null}
              {/* lamba ışığında uçuşan toz */}
              {new Array(14).fill(0).map((_, i) => {
                const u = ((i * 0.137 + tg * 0.025) % 1);
                const xx = lamba[0] - 260 + ((i * 173) % 520) + Math.sin(tg * 0.7 + i) * 24, yy = lamba[1] + 120 + u * 900;
                return <circle key={i} cx={xx} cy={yy} r={1.8 + (i % 3)} fill="#fff0c8" opacity={(0.2 + 0.3 * Math.abs(Math.sin(tg * 1.3 + i))) * (1 - u)} />;
              })}
            </svg>
          </>
        ) : (
        <svg viewBox="-600 -200 2280 2320" width={2280} height={2320} style={{ position: "absolute", left: -600, top: -200, overflow: "visible", mixBlendMode: "screen", pointerEvents: "none" }}>
          <defs>
            <linearGradient id="b7_h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffb060" stopOpacity={0.55 * isik} /><stop offset="1" stopColor="#ff8a40" stopOpacity={0} /></linearGradient>
            <filter id="b7_bl"><feGaussianBlur stdDeviation="18" /></filter>
          </defs>
          {antre || salon ? null : ayna ? <ellipse cx={540} cy={180} rx={560} ry={620} fill="#fff0d0" opacity={0.18} filter="url(#b7_bl)" /> : <path d="M 330 470 L 560 470 L 1180 1700 L 760 1960 Z" fill="url(#b7_h)" filter="url(#b7_bl)" />}
          {new Array(18).fill(0).map((_, i) => {
            const u = ((i * 0.137 + tg * 0.03) % 1);
            const xx = 420 + u * 600 + Math.sin(tg + i) * 20, yy = 560 + u * 1100 + ((i * 97) % 160);
            return <circle key={i} cx={xx} cy={yy} r={2 + (i % 3)} fill="#fff0c8" opacity={0.25 + 0.3 * Math.abs(Math.sin(tg * 1.4 + i))} />;
          })}
        </svg>
        )}
        {/* antre: kapalı kapının altından sızan sahanlık ışığı (kapiAlti 0..1) — ışık kaynağı olduğu için ışık katmanlarının ÜSTÜNDE */}
        {antre && alt > 0.01 ? (
          <svg viewBox="-600 -200 2280 2320" width={2280} height={2320} style={{ position: "absolute", left: -600, top: -200, overflow: "visible", pointerEvents: "none" }}>
            <defs><filter id="b7_abl"><feGaussianBlur stdDeviation="16" /></filter></defs>
            <ellipse cx={550} cy={1622} rx={300} ry={40} fill="#ffd890" opacity={0.5 * alt} filter="url(#b7_abl)" />
            <rect x={384} y={1590} width={332} height={12} fill="#fff4d0" opacity={alt} />
          </svg>
        ) : null}
      </AbsoluteFill>
      {/* renk: gece = sıcak tepe / soğuk taban (tungsten + gece), değilse sıcak; vinyet */}
      {gece ? (
        <>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,214,170,0.9) 0%, rgba(236,226,232,0.9) 45%, rgba(150,150,196,0.9) 100%)", mixBlendMode: "multiply", opacity: p.renkK ?? 0.42 }} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 42%, rgba(0,0,0,0) 52%, rgba(14,10,28,0.55) 100%)" }} />
        </>
      ) : (
        <>
          <AbsoluteFill style={{ background: `linear-gradient(160deg, rgba(255,150,80,${0.1 * isik}) 0%, rgba(40,20,50,${0.12 * isik}) 100%)`, mixBlendMode: "multiply" }} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 48%, rgba(0,0,0,0) 58%, rgba(30,12,20,0.42) 100%)" }} />
        </>
      )}
      {ekler}
      {/* geçiş flaşı (p.flas [[t0,t1]]) */}
      {aralik(p.flas, tg) ? <AbsoluteFill style={{ background: "#fff", opacity: 0.85 }} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ küçük, sıradan hamamböceği (B7): üstten görünüş */
const Hamam: React.FC<{ x: number; y: number; a: number; s: number; faz: number; anten: number }> = ({ x, y, a, s, faz, anten }) => (
  <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={22} ry={8} fill="#000" opacity={0.25} />
    {[-1, 1].map((k) => [-8, 0, 8].map((lx, i) => {
      const sal = Math.sin(faz + i * 2.1 + (k > 0 ? Math.PI : 0)) * 5;
      return <path key={`${k}${i}`} d={`M ${lx} ${k * 4} l ${-4 + sal} ${k * 12} l ${-6 + sal * 0.5} ${k * 4}`} stroke="#3a2214" strokeWidth={2.2} fill="none" strokeLinecap="round" />;
    }))}
    <ellipse cx={-2} cy={0} rx={18} ry={9} fill="#6a3a1c" stroke="#2a160a" strokeWidth={2} />
    <path d="M -2 -8 V 8" stroke="#4a2810" strokeWidth={1.5} />
    <ellipse cx={14} cy={0} rx={6} ry={7} fill="#4a2a14" stroke="#2a160a" strokeWidth={2} />
    <ellipse cx={-6} cy={-3} rx={6} ry={2} fill="#c88a5a" opacity={0.5} />
    {[-1, 1].map((k) => <path key={k} d={`M 18 ${k * 3} q 12 ${k * (4 + Math.sin(anten + k) * 4)} 24 ${k * (10 + Math.sin(anten * 1.3 + k) * 5)}`} stroke="#3a2214" strokeWidth={1.6} fill="none" />)}
  </g>
);

/** sahne içi yakın ek: diğer ekleme türlerini aynı vuruşun içinde tam ekran oynatır */
const EkKatman: React.FC<{ k: string; dur: number; tx?: string[] }> = ({ k, dur, tx }) => {
  if (k === "b7_banyo") return <B7Banyo text={tx} />;
  if ((INSERT17_KINDS as string[]).includes(k)) return <Insert17 kind={k as Insert17Kind} dur={dur} text={tx} />;
  if (["cep_deste", "para_say", "kulak_cek", "zeytin_al"].includes(k)) return <Insert15 kind={k as Insert15Kind} dur={dur} text={tx} />;
  if (["ev_anahtar", "ev_zincir"].includes(k)) return <Insert14 kind={k as Insert14Kind} dur={dur} text={tx} />;
  return <Insert11 kind={k as Insert11Kind} dur={dur} text={tx} />;
};

export const Insert16: React.FC<{ kind: Insert16Kind; dur: number; text?: string[] }> = ({ text }) => <B7Banyo text={text} />;
