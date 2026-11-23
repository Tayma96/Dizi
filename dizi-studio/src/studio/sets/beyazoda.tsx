import React from "react";
import { random } from "remotion";
import { Character } from "../rig/Character";
import type { CastMember } from "../cast";
import type { Pose } from "../rig/types";

/* =====================================================================================
 * Kırmızı Düğme · BEYAZ ODA (dizinin ana mekânı). Gerçek perspektif izdüşümlü küçük bir 3B sahne, 2D çizim diliyle.
 *
 * Görsel dil ("Symbol" (2009) ile karışmasın diye bilinçli farklar):
 *   - Oran: geniş, derin, görece alçak tavanlı (8 × 3,6 × 12 m) bir oda; köşeler dik.
 *   - Dikişsiz başlar; final anında duvarlarda ALTIGEN panel derzleri belirir (petek). Her petekte bir düğme.
 *   - Düğme: acil durdurma tipi KIRMIZI MANTAR başlık, beyaz altıgen taban plakası, altında 3 haneli
 *     siyah LCD sayaç (her düğmenin numarası var) ve çevresinde LED halka. Basılınca başlık içeri çöker,
 *     LED halka kırmızı yanıp söner, sayaç bir artar.
 *   - Bölme kapağı: altıgen, iki kanatlı SÜRGÜLÜ kapak (kanatlar yana kayıp duvarın içine girer);
 *     kenarında sarı-siyah ikaz şeridi, içi kırmızı dönen ikaz ışıklı karanlık bir hazne.
 *   - Işık: kaynağı görünmeyen, her yerden gelen soğuk beyaz (camgöbeği tonlu); gölge yok (karakterlerin
 *     ayak gölgesi bile çizilmez: rahatsız edici). Final: kırmızı darbe ışığı.
 * Birim metre. X sağ, Y yukarı, Z ileri (kameradan uzağa). Zemin Y=0.
 * ===================================================================================== */

export const ODA = { x0: -4, x1: 4, y1: 3.6, z0: -2, z1: 10 };
export const KAIDE = { x: 0, z: 4.2, h: 1.0, r: 0.3 };

export type Kam = { x: number; y: number; z: number; yaw: number; pitch: number; f: number; cx?: number; cy?: number; sx?: number; sy?: number };
type V3 = [number, number, number];
type P2 = { x: number; y: number; z: number };

const W = 1080;
const OUT = "#2a1e22";
const deg = Math.PI / 180;

export const proj = (k: Kam, p: V3): P2 => {
  const dx = p[0] - k.x, dy = p[1] - k.y, dz = p[2] - k.z;
  const cy = Math.cos(k.yaw * deg), sy = Math.sin(k.yaw * deg);
  const x1 = dx * cy - dz * sy;
  const z1 = dx * sy + dz * cy;
  const cp = Math.cos(k.pitch * deg), sp = Math.sin(k.pitch * deg);
  const y2 = dy * cp - z1 * sp;
  const z2 = dy * sp + z1 * cp;
  return { x: (k.cx ?? 540) + (k.sx ?? 0) + (k.f * x1) / z2, y: (k.cy ?? 860) + (k.sy ?? 0) - (k.f * y2) / z2, z: z2 };
};

const camSpace = (k: Kam, p: V3): V3 => {
  const dx = p[0] - k.x, dy = p[1] - k.y, dz = p[2] - k.z;
  const cy = Math.cos(k.yaw * deg), sy = Math.sin(k.yaw * deg);
  const x1 = dx * cy - dz * sy;
  const z1 = dx * sy + dz * cy;
  const cp = Math.cos(k.pitch * deg), sp = Math.sin(k.pitch * deg);
  return [x1, dy * cp - z1 * sp, dy * sp + z1 * cp];
};
const NEAR = 0.08;
/** Çokgeni kameranın önündeki düzleme göre kırpar ve izdüşümünü verir. */
const polyPath = (k: Kam, pts: V3[]): string => {
  const c = pts.map((p) => camSpace(k, p));
  const outp: V3[] = [];
  for (let i = 0; i < c.length; i++) {
    const a = c[i], b = c[(i + 1) % c.length];
    const ain = a[2] > NEAR, bin = b[2] > NEAR;
    if (ain) outp.push(a);
    if (ain !== bin) {
      const t = (NEAR - a[2]) / (b[2] - a[2]);
      outp.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR]);
    }
  }
  if (outp.length < 3) return "";
  return outp.map((q, i) => `${i ? "L" : "M"} ${((k.cx ?? 540) + (k.sx ?? 0) + (k.f * q[0]) / q[2]).toFixed(1)} ${((k.cy ?? 860) + (k.sy ?? 0) - (k.f * q[1]) / q[2]).toFixed(1)}`).join(" ") + " Z";
};

/* ------------------------------------------------------------------ yüzeyler ve petekler */
type Yuzey = { ad: string; o: V3; t1: V3; t2: V3; n: V3; l1: number; l2: number; renk: string };
const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
export const YUZEYLER: Yuzey[] = [
  { ad: "arka", o: [ODA.x0, 0, ODA.z1], t1: [1, 0, 0], t2: [0, 1, 0], n: [0, 0, -1], l1: ODA.x1 - ODA.x0, l2: ODA.y1, renk: "#eef4f7" },
  { ad: "sol", o: [ODA.x0, 0, ODA.z0], t1: [0, 0, 1], t2: [0, 1, 0], n: [1, 0, 0], l1: ODA.z1 - ODA.z0, l2: ODA.y1, renk: "#e1e9ee" },
  { ad: "sag", o: [ODA.x1, 0, ODA.z0], t1: [0, 0, 1], t2: [0, 1, 0], n: [-1, 0, 0], l1: ODA.z1 - ODA.z0, l2: ODA.y1, renk: "#e6edf2" },
  { ad: "zemin", o: [ODA.x0, 0, ODA.z0], t1: [1, 0, 0], t2: [0, 0, 1], n: [0, 1, 0], l1: ODA.x1 - ODA.x0, l2: ODA.z1 - ODA.z0, renk: "#e9eff2" },
  { ad: "tavan", o: [ODA.x0, ODA.y1, ODA.z0], t1: [1, 0, 0], t2: [0, 0, 1], n: [0, -1, 0], l1: ODA.x1 - ODA.x0, l2: ODA.z1 - ODA.z0, renk: "#f6fafc" },
  { ad: "on", o: [ODA.x0, 0, ODA.z0], t1: [1, 0, 0], t2: [0, 1, 0], n: [0, 0, 1], l1: ODA.x1 - ODA.x0, l2: ODA.y1, renk: "#e4ebf0" },
];

/** petek yarıçapı: oda 8×3,6×12 m; 0,42 ile ~610 düğme (eski odanın %70'i), aralarda boş petek görünür */
export const HEX_R = 0.42;
export type Petek = { id: number; y: number; u: number; v: number; c: V3; no: number; d: number };
const PETEKLER: Petek[] = (() => {
  const out: Petek[] = [];
  let id = 0;
  YUZEYLER.forEach((s, yi) => {
    const du = 1.5 * HEX_R, dv = Math.sqrt(3) * HEX_R;
    const cols = Math.floor((s.l1 - 2 * HEX_R) / du) + 1;
    const u0 = (s.l1 - (cols - 1) * du) / 2;
    for (let i = 0; i < cols; i++) {
      const off = i % 2 ? dv / 2 : 0;
      const rows = Math.floor((s.l2 - dv - off) / dv) + 1;
      const v0 = (s.l2 - (rows - 1) * dv - (i % 2 ? dv / 2 : 0)) / 2 + off;
      for (let j = 0; j < rows; j++) {
        const u = u0 + i * du, v = v0 + j * dv;
        if (v + dv / 2 > s.l2 + 1e-6 || v - dv / 2 < -1e-6) continue;
        const c = add(add(s.o, s.t1, u), s.t2, v);
        // kaidenin altına ve karakterlerin durduğu yere zemin düğmesi koyma
        if (s.ad === "zemin" && Math.hypot(c[0] - KAIDE.x, c[2] - KAIDE.z) < 0.8) continue;
        const d = Math.hypot(c[0] - KAIDE.x, c[1] - 1, c[2] - KAIDE.z);
        out.push({ id: id++, y: yi, u, v, c, no: 1 + Math.floor(random(`no${id}`) * 998), d });
      }
    }
  });
  return out;
})();

export const petekBul = (yuzey: string, x: number, y: number, z: number): Petek => {
  const yi = YUZEYLER.findIndex((s) => s.ad === yuzey);
  let best = PETEKLER[0], bd = 1e9;
  for (const p of PETEKLER) {
    if (p.y !== yi) continue;
    const d = Math.hypot(p.c[0] - x, p.c[1] - y, p.c[2] - z);
    if (d < bd) { bd = d; best = p; }
  }
  return best;
};

const hexPts = (s: Yuzey, p: Petek, r = HEX_R * 0.97): V3[] =>
  new Array(6).fill(0).map((_, i) => {
    const a = (i / 6) * Math.PI * 2;
    return add(add(p.c, s.t1, Math.cos(a) * r), s.t2, Math.sin(a) * r);
  });

/** Yüzeyin yerel düzleminden ekrana afin dönüşüm (petek merkezinde yerel türev). */
const yerelMatris = (k: Kam, c: V3, t1: V3, t2: V3) => {
  const e = 0.02;
  const p = proj(k, c), a = proj(k, add(c, t1, e)), b = proj(k, add(c, t2, e));
  return { p, m: [(a.x - p.x) / e, (a.y - p.y) / e, (b.x - p.x) / e, (b.y - p.y) / e] };
};

/* ------------------------------------------------------------------ düğme */
export type DugmeDurum = { cikis: number; bas: number; led: number; sayac?: number };
/** Tek düğme: yerel metre biriminde çizilir. cikis 0..1 (belirme), bas 0..1 (basılma), led 0..1. */
export const Dugme: React.FC<{ k: Kam; c: V3; t1: V3; t2: V3; n: V3; d: DugmeDurum; no: number; olcek?: number; plaka?: boolean }> = ({ k, c, t1, t2, n, d, no, olcek = 1, plaka = true }) => {
  if (d.cikis <= 0.001) return null;
  const { p, m } = yerelMatris(k, c, t1, t2);
  if (p.z < 0.15) return null;
  const pn = proj(k, add(c, n, 0.02));
  const nv = [(pn.x - p.x) / 0.02, (pn.y - p.y) / 0.02];
  const s = d.cikis * olcek;
  const h = 0.075 * (1 - 0.75 * d.bas) * Math.min(1, d.cikis * 1.4);
  const mat = (o: number) => `translate(${(p.x + nv[0] * o).toFixed(2)} ${(p.y + nv[1] * o).toFixed(2)}) matrix(${m[0] * s} ${m[1] * s} ${m[2] * s} ${m[3] * s} 0 0)`;
  const pxm = Math.hypot(m[0], m[1]) * s; // metre başına piksel
  // yüzeyin yerel ekseni ekranda aynalanıyorsa (ör. sağ duvar) sayaç yazısını düzelt
  const ayna = m[0] * m[3] - m[1] * m[2] > 0;
  const yakin = pxm > 900;
  const sw = Math.max(1, Math.min(4, pxm / 260));
  const katman = yakin ? 7 : 3;
  const sayac = String(d.sayac ?? no).padStart(3, "0");
  return (
    <g>
      {plaka ? (
        <g transform={mat(0)}>
          <path d={new Array(6).fill(0).map((_, i) => `${i ? "L" : "M"} ${(Math.cos((i / 6) * Math.PI * 2) * 0.155).toFixed(3)} ${(Math.sin((i / 6) * Math.PI * 2) * 0.155).toFixed(3)}`).join(" ") + " Z"} fill="#f7fafb" stroke="#9fb0bb" strokeWidth={sw * 0.8} vectorEffect="non-scaling-stroke" />
          <circle r={0.112} fill="none" stroke={d.led > 0.05 ? "#ff2030" : "#c9d2d8"} strokeWidth={sw * (1 + 2 * d.led)} vectorEffect="non-scaling-stroke" />
          {d.led > 0.05 ? <circle r={0.14} fill="#ff2030" opacity={0.28 * d.led} /> : null}
          {/* sayaç: tabanın altında siyah LCD, kırmızı rakamlar */}
          <rect x={-0.045} y={-0.148} width={0.09} height={0.036} rx={0.006} fill="#16181c" />
          {yakin ? <text x={0} y={0.141} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={0.032} fill="#ff3a3a" transform={`scale(${ayna ? -1 : 1} -1)`}>{sayac}</text> : null}
        </g>
      ) : null}
      {/* mantar başlık: gölgeli yan yüz (katmanlar normal yönünde), sonra parlak tepe */}
      {new Array(katman).fill(0).map((_, i) => (
        <g key={i} transform={mat((h * i) / katman)}>
          <circle r={i === 0 ? 0.07 : 0.09} fill={i === 0 ? "#6a0a12" : "#a8121e"} />
        </g>
      ))}
      <g transform={mat(h)}>
        <circle r={0.092} fill={d.led > 0.5 ? "#ff3442" : "#e2202e"} stroke={OUT} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
        <circle r={0.07} fill="none" stroke="#ff6a74" strokeWidth={sw * 0.8} vectorEffect="non-scaling-stroke" opacity={0.7} />
        <ellipse cx={-0.03} cy={0.035} rx={0.03} ry={0.016} fill="#ffffff" opacity={0.65} transform="rotate(-30 -0.03 0.035)" />
      </g>
      {d.led > 0.5 ? <circle cx={p.x + nv[0] * h} cy={p.y + nv[1] * h} r={0.2 * pxm} fill="#ff2030" opacity={0.18 * d.led} /> : null}
    </g>
  );
};

/* ------------------------------------------------------------------ bölme kapağı */
export const Bolme: React.FC<{ k: Kam; p: Petek; acik: number; frame: number; uid: string }> = ({ k, p, acik, frame, uid }) => {
  const s = YUZEYLER[p.y];
  const hp = polyPath(k, hexPts(s, p));
  if (!hp) return null;
  const pc = proj(k, p.c);
  if (pc.z < 0.15) return null;
  const a = Math.max(0, Math.min(1, acik));
  const R = HEX_R * 0.97;
  // iki kanat: t1 ekseni boyunca ayrılır, duvarın içine kayar
  const kanat = (sd: number) => {
    const sh = sd * a * R * 1.05;
    const pts: V3[] = sd < 0
      ? [[-R, 0], [-R / 2, -R * 0.866], [0, -R * 0.866], [0, R * 0.866], [-R / 2, R * 0.866]].map(([u, v]) => add(add(p.c, s.t1, u + sh), s.t2, v))
      : [[R, 0], [R / 2, -R * 0.866], [0, -R * 0.866], [0, R * 0.866], [R / 2, R * 0.866]].map(([u, v]) => add(add(p.c, s.t1, u + sh), s.t2, v));
    return polyPath(k, pts);
  };
  const ikaz = 0.5 + 0.5 * Math.sin(frame / 2.2);
  const ic = add(p.c, s.n, -0.6);
  const ip = proj(k, ic);
  const { m } = yerelMatris(k, p.c, s.t1, s.t2);
  const pxm = Math.hypot(m[0], m[1]);
  return (
    <g>
      <defs><clipPath id={`bc-${uid}`}><path d={hp} /></clipPath></defs>
      {/* hazne: karanlık, derin; içte dönen kırmızı ikaz ışığı */}
      <path d={hp} fill="#120609" />
      <g clipPath={`url(#bc-${uid})`}>
        <path d={polyPath(k, hexPts(s, { ...p, c: ic }, R * 0.7))} fill="#2a0a10" />
        <circle cx={ip.x} cy={ip.y} r={0.5 * pxm} fill="#ff1a2a" opacity={a * (0.25 + 0.35 * ikaz)} />
        <circle cx={(pc.x + ip.x) / 2} cy={(pc.y + ip.y) / 2} r={0.12 * pxm} fill="#ff5a5a" opacity={a * ikaz} />
        {/* kanatlar: kenarlarında sarı-siyah ikaz şeridi */}
        {[-1, 1].map((sd) => (
          <g key={sd}>
            <path d={kanat(sd)} fill="#eef3f6" stroke="#8a9aa6" strokeWidth={1.5} />
          </g>
        ))}
        {a > 0.01 && a < 0.98 ? null : null}
      </g>
      <path d={hp} fill="none" stroke="#f2c21a" strokeWidth={Math.max(2, pxm * 0.03)} strokeDasharray={`${Math.max(4, pxm * 0.05)} ${Math.max(4, pxm * 0.05)}`} />
      <path d={hp} fill="none" stroke={OUT} strokeWidth={Math.max(1.5, pxm * 0.008)} />
    </g>
  );
};

/* ------------------------------------------------------------------ fırlayan nesneler */
export type NesneTur = "terlik" | "simit" | "ordek" | "caydanlik" | "top" | "kaktus" | "balik" | "nazar" | "yastik" | "semsiye" | "tavuk" | "pasta";
const NesneCiz: React.FC<{ tur: NesneTur }> = ({ tur }) => {
  // 100 birimlik kutu, merkez 0,0
  switch (tur) {
    case "terlik":
      return (<g><path d="M -46 10 Q -50 -20 -20 -22 L 40 -16 Q 54 -10 50 8 Q 40 22 -30 22 Q -46 22 -46 10 Z" fill="#3a8ad8" stroke={OUT} strokeWidth={4} /><path d="M -10 -20 Q 10 -40 30 -16" stroke="#2a5aa8" strokeWidth={12} fill="none" /></g>);
    case "simit":
      return (<g><circle r={40} fill="#c8782a" stroke={OUT} strokeWidth={4} /><circle r={16} fill="#00000000" stroke={OUT} strokeWidth={4} /><circle r={16} fill="#5a3a20" opacity={0.0} />{new Array(14).fill(0).map((_, i) => <ellipse key={i} cx={Math.cos(i) * 28} cy={Math.sin(i * 1.7) * 26} rx={3} ry={1.6} fill="#f4e8c8" />)}</g>);
    case "ordek":
      return (<g><ellipse cx={0} cy={14} rx={42} ry={28} fill="#ffd21a" stroke={OUT} strokeWidth={4} /><circle cx={-16} cy={-22} r={22} fill="#ffd21a" stroke={OUT} strokeWidth={4} /><path d="M -36 -20 L -54 -14 L -36 -10 Z" fill="#ff8a1a" stroke={OUT} strokeWidth={3} /><circle cx={-20} cy={-28} r={4} fill={OUT} /></g>);
    case "caydanlik":
      return (<g><path d="M -34 30 L -30 -10 Q 0 -30 30 -10 L 34 30 Z" fill="#c8d0d8" stroke={OUT} strokeWidth={4} /><path d="M -20 -14 L -14 -40 Q 0 -50 14 -40 L 20 -14 Z" fill="#d8dee4" stroke={OUT} strokeWidth={4} /><path d="M 32 10 L 54 -10" stroke={OUT} strokeWidth={8} strokeLinecap="round" /><path d="M -32 0 Q -54 6 -32 20" stroke={OUT} strokeWidth={5} fill="none" /><circle cx={0} cy={-46} r={5} fill={OUT} /></g>);
    case "top":
      return (<g><circle r={40} fill="#ffffff" stroke={OUT} strokeWidth={4} /><path d="M 0 -14 L 13 -4 L 8 12 L -8 12 L -13 -4 Z" fill={OUT} /><path d="M 0 -14 V -38 M 13 -4 L 36 -12 M 8 12 L 22 32 M -8 12 L -22 32 M -13 -4 L -36 -12" stroke={OUT} strokeWidth={3} /></g>);
    case "kaktus":
      return (<g><path d="M -26 20 L 26 20 L 20 48 L -20 48 Z" fill="#d8743a" stroke={OUT} strokeWidth={4} /><rect x={-12} y={-40} width={24} height={62} rx={12} fill="#4aa84a" stroke={OUT} strokeWidth={4} /><path d="M -12 0 Q -32 0 -30 -22" stroke="#4aa84a" strokeWidth={12} fill="none" strokeLinecap="round" /><circle cx={0} cy={-44} r={6} fill="#ff6ab0" /></g>);
    case "balik":
      return (<g><path d="M -40 0 Q -10 -30 26 0 Q -10 30 -40 0 Z" fill="#ff8a3a" stroke={OUT} strokeWidth={4} /><path d="M 24 0 L 46 -18 L 46 18 Z" fill="#ff8a3a" stroke={OUT} strokeWidth={4} /><circle cx={-24} cy={-4} r={4} fill={OUT} /></g>);
    case "nazar":
      return (<g><circle r={40} fill="#1e4fb0" stroke={OUT} strokeWidth={4} /><circle r={27} fill="#f4f6fa" /><circle r={16} fill="#6ab0ec" /><circle r={7} fill="#10142a" /></g>);
    case "yastik":
      return (<g><path d="M -46 -30 Q 0 -40 46 -30 Q 54 0 46 30 Q 0 40 -46 30 Q -54 0 -46 -30 Z" fill="#ff9ac8" stroke={OUT} strokeWidth={4} /><circle cx={0} cy={0} r={6} fill="#ff6ab0" /></g>);
    case "semsiye":
      return (<g><path d="M -50 0 Q 0 -60 50 0 Q 38 -8 25 0 Q 12 -8 0 0 Q -12 -8 -25 0 Q -38 -8 -50 0 Z" fill="#e8202e" stroke={OUT} strokeWidth={4} /><path d="M 0 0 V 44 Q 0 54 10 50" stroke={OUT} strokeWidth={5} fill="none" /></g>);
    case "tavuk":
      return (<g><ellipse cx={0} cy={10} rx={30} ry={36} fill="#f4e8a8" stroke={OUT} strokeWidth={4} /><circle cx={0} cy={-34} r={16} fill="#f4e8a8" stroke={OUT} strokeWidth={4} /><path d="M -6 -50 l 4 -10 l 4 8 l 4 -8 l 2 10" fill="#e8302e" stroke={OUT} strokeWidth={2} /><path d="M 12 -34 l 12 4 l -12 4 Z" fill="#ff9a1a" /></g>);
    case "pasta":
      return (<g><path d="M -40 30 L 40 30 L 40 -6 L -40 -6 Z" fill="#ffd8e8" stroke={OUT} strokeWidth={4} /><path d="M -40 -6 Q -30 6 -20 -6 Q -10 6 0 -6 Q 10 6 20 -6 Q 30 6 40 -6" fill="#ffffff" stroke={OUT} strokeWidth={3} /><circle cx={0} cy={-18} r={9} fill="#e8202e" stroke={OUT} strokeWidth={3} /></g>);
  }
};

/** Nesne: dünya konumunda, ölçek metre cinsinden boy. */
export const Nesne: React.FC<{ k: Kam; pos: V3; boy: number; tur: NesneTur; donus: number; bulanik?: number }> = ({ k, pos, boy, tur, donus, bulanik = 0 }) => {
  const p = proj(k, pos);
  if (p.z < 0.2) return null;
  const s = (boy * k.f) / p.z / 100;
  return (
    <g transform={`translate(${p.x} ${p.y}) rotate(${donus}) scale(${s})`} opacity={1 - Math.min(0.4, bulanik)}>
      <NesneCiz tur={tur} />
    </g>
  );
};

/** Fırlatma yörüngesi: petek merkezinden normal yönünde çıkış + yerçekimi. t: saniye (fırlamadan beri). */
export const yorunge = (p: Petek, t: number, hiz = 5, yan: V3 = [0, 0, 0]): V3 => {
  const s = YUZEYLER[p.y];
  const g = 9.8;
  return [p.c[0] + (s.n[0] * hiz + yan[0]) * t, Math.max(0.15, p.c[1] + (s.n[1] * hiz + yan[1]) * t - 0.5 * g * t * t * 0.6), p.c[2] + (s.n[2] * hiz + yan[2]) * t];
};

/* ------------------------------------------------------------------ kaide */
const Kaide: React.FC<{ k: Kam; bas: number; led: number; sayac: number }> = ({ k, bas, led, sayac }) => {
  const { x, z, h, r } = KAIDE;
  // silindir: alt ve üst elipsler (yerel afin), yan yüz iki uç çizgiyle
  const ust = yerelMatris(k, [x, h, z], [1, 0, 0], [0, 0, 1]);
  const alt = yerelMatris(k, [x, 0, z], [1, 0, 0], [0, 0, 1]);
  if (ust.p.z < 0.2) return null;
  const L = proj(k, [x - r, h, z]), Rr = proj(k, [x + r, h, z]);
  const Lb = proj(k, [x - r, 0, z]), Rb = proj(k, [x + r, 0, z]);
  const lcd = yerelMatris(k, [x, h * 0.72, z - r * 0.99], [1, 0, 0], [0, 1, 0]);
  const M = (q: { p: P2; m: number[] }) => `translate(${q.p.x} ${q.p.y}) matrix(${q.m.join(" ")} 0 0)`;
  return (
    <g>
      <g transform={M(alt)}><circle r={r} fill="#dfe6ea" /></g>
      <path d={`M ${L.x} ${L.y} L ${Lb.x} ${Lb.y} L ${Rb.x} ${Rb.y} L ${Rr.x} ${Rr.y} Z`} fill="#f2f6f8" />
      <path d={`M ${(L.x * 0.2 + Rr.x * 0.8)} ${L.y} L ${(Lb.x * 0.2 + Rb.x * 0.8)} ${Lb.y} L ${Rb.x} ${Rb.y} L ${Rr.x} ${Rr.y} Z`} fill="#dbe3e8" />
      <path d={`M ${L.x} ${L.y} L ${Lb.x} ${Lb.y} M ${Rr.x} ${Rr.y} L ${Rb.x} ${Rb.y}`} stroke="#a8b6c0" strokeWidth={2} />
      <g transform={M(alt)}><path d={`M ${-r} 0 A ${r} ${r} 0 0 0 ${r} 0`} fill="none" stroke="#a8b6c0" strokeWidth={2} vectorEffect="non-scaling-stroke" /></g>
      {/* kaidenin önünde sayaç ekranı */}
      <g transform={M(lcd)}>
        <rect x={-0.13} y={-0.05} width={0.26} height={0.1} rx={0.015} fill="#16181c" stroke="#8a98a2" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        <text x={0} y={0.032} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={0.085} fill="#ff3a3a" transform="scale(1 -1)">{String(sayac).padStart(3, "0")}</text>
      </g>
      <g transform={M(ust)}>
        <circle r={r} fill="#fbfdfe" stroke="#a8b6c0" strokeWidth={2} vectorEffect="non-scaling-stroke" />
      </g>
      <Dugme k={k} c={[x, h, z]} t1={[1, 0, 0]} t2={[0, 0, 1]} n={[0, 1, 0]} d={{ cikis: 1, bas, led }} no={sayac} olcek={1.6} plaka={false} />
    </g>
  );
};

/* ------------------------------------------------------------------ sahne */
export type OdaKarakter = { look: CastMember; x: number; z: number; pose?: Pose };
export type OdaNesne = { petek: Petek; t0: number; tur: NesneTur; hiz?: number; yan?: V3; boy?: number; donHiz?: number };
export type OdaDurum = {
  /** derzlerin belirmesi 0..1 */
  derz: number;
  /** düğme dalgası: zaman (sn, -1 = düğme yok); dalga merkezi kaideden hızla yayılır */
  dalga: number;
  /** ana düğme basılma 0..1, led 0..1, sayaç */
  anaBas: number;
  anaLed: number;
  sayac: number;
  /** kırmızı darbe ışığı 0..1 */
  kirmizi: number;
  /** bölmeler: petek + açılma 0..1 */
  bolmeler?: { petek: Petek; acik: number }[];
  nesneler?: OdaNesne[];
  /** sahne zamanı (sn): nesneler için */
  t: number;
  /** tek bir düğmeye özel basılma (kanca) */
  ozelBas?: { petek: Petek; bas: number; led: number; sayac: number };
  /** kaide görünür mü */
  kaide?: boolean;
};

export const BeyazOda: React.FC<{ k: Kam; durum: OdaDurum; karakterler?: OdaKarakter[]; frame: number; ekstra?: React.ReactNode }> = ({ k, durum, karakterler = [], frame, ekstra }) => {
  const H = 1920;
  const bolmeIds = new Set((durum.bolmeler ?? []).map((b) => b.petek.id));
  type Ciz = { z: number; el: React.ReactNode };
  const list: Ciz[] = [];
  // düğmeler
  if (durum.dalga >= 0 || durum.ozelBas) {
    for (const p of PETEKLER) {
      if (bolmeIds.has(p.id)) continue;
      const s = YUZEYLER[p.y];
      const pc = proj(k, p.c);
      if (pc.z < 0.2 || pc.x < -200 || pc.x > W + 200 || pc.y < -200 || pc.y > H + 200) continue;
      // yüzeyi arkadan görüyorsak çizme
      const cam: V3 = [k.x - p.c[0], k.y - p.c[1], k.z - p.c[2]];
      if (cam[0] * s.n[0] + cam[1] * s.n[1] + cam[2] * s.n[2] < 0) continue;
      let d: DugmeDurum;
      const oz = durum.ozelBas && durum.ozelBas.petek.id === p.id ? durum.ozelBas : null;
      if (durum.dalga >= 0) {
        const t0 = p.d * 0.16 + random(`dg${p.id}`) * 0.12;
        const u = (durum.dalga - t0) / 0.28;
        if (u <= 0 && !oz) continue;
        const cik = u <= 0 ? 1 : u >= 1 ? 1 : u < 0.6 ? (u / 0.6) * 1.18 : 1.18 - 0.18 * ((u - 0.6) / 0.4);
        const blink = random(`bl${p.id}${Math.floor((durum.t + random(`bp${p.id}`)) * 2.5)}`) > 0.82 ? 1 : 0;
        const led = u > 0 && u < 1.6 ? 1 - Math.max(0, u - 0.6) : blink * Math.min(1, durum.dalga / 2);
        d = { cikis: oz ? 1 : cik, bas: oz?.bas ?? 0, led: oz ? Math.max(oz.led, led * 0.5) : led, sayac: oz?.sayac };
      } else {
        if (!oz) continue; // düğme dalgası yokken yalnız özel düğme (kanca: tek düğme, sürpriz korunur)
        d = { cikis: 1, bas: oz.bas, led: oz.led, sayac: oz.sayac };
      }
      list.push({ z: pc.z, el: <Dugme key={`d${p.id}`} k={k} c={p.c} t1={s.t1} t2={s.t2} n={s.n} d={d} no={p.no} /> });
    }
  }
  (durum.bolmeler ?? []).forEach((b) => {
    const pc = proj(k, b.petek.c);
    list.push({ z: pc.z + 0.01, el: <Bolme key={`b${b.petek.id}`} k={k} p={b.petek} acik={b.acik} frame={frame} uid={`${b.petek.id}`} /> });
  });
  if (durum.kaide !== false) {
    const kp = proj(k, [KAIDE.x, 0.5, KAIDE.z]);
    list.push({ z: kp.z, el: <Kaide key="kaide" k={k} bas={durum.anaBas} led={durum.anaLed} sayac={durum.sayac} /> });
  }
  karakterler.forEach((c, i) => {
    const fp = proj(k, [c.x, 0, c.z]);
    if (fp.z < 0.4) return;
    const size = (1.75 * k.f) / fp.z;
    list.push({
      z: fp.z,
      el: (
        <g key={`c${i}`} transform={`translate(${fp.x - size * 0.2} ${fp.y - size * 0.985})`}>
          <Character look={c.look} size={size} pose={{ golgesiz: true, seed: i * 5 + 2, ...c.pose }} />
        </g>
      ),
    });
  });
  (durum.nesneler ?? []).forEach((n, i) => {
    const tt = durum.t - n.t0;
    if (tt < 0) return;
    const pos = yorunge(n.petek, tt, n.hiz ?? 5, n.yan);
    const pz = proj(k, pos).z;
    list.push({ z: pz, el: <Nesne key={`n${i}`} k={k} pos={pos} boy={n.boy ?? 0.45} tur={n.tur} donus={tt * (n.donHiz ?? 400) + i * 40} /> });
  });
  list.sort((a, b) => b.z - a.z);

  // yüzeyler + derzler
  const derzD = (s: Yuzey, yi: number) => PETEKLER.filter((p) => p.y === yi).map((p) => polyPath(k, hexPts(s, p))).join(" ");
  const koseler: [V3, V3][] = [
    [[ODA.x0, 0, ODA.z1], [ODA.x1, 0, ODA.z1]], [[ODA.x0, ODA.y1, ODA.z1], [ODA.x1, ODA.y1, ODA.z1]],
    [[ODA.x0, 0, ODA.z1], [ODA.x0, ODA.y1, ODA.z1]], [[ODA.x1, 0, ODA.z1], [ODA.x1, ODA.y1, ODA.z1]],
    [[ODA.x0, 0, ODA.z0], [ODA.x0, 0, ODA.z1]], [[ODA.x1, 0, ODA.z0], [ODA.x1, 0, ODA.z1]],
    [[ODA.x0, ODA.y1, ODA.z0], [ODA.x0, ODA.y1, ODA.z1]], [[ODA.x1, ODA.y1, ODA.z0], [ODA.x1, ODA.y1, ODA.z1]],
    [[ODA.x0, 0, ODA.z0], [ODA.x0, ODA.y1, ODA.z0]], [[ODA.x1, 0, ODA.z0], [ODA.x1, ODA.y1, ODA.z0]],
    [[ODA.x0, 0, ODA.z0], [ODA.x1, 0, ODA.z0]], [[ODA.x0, ODA.y1, ODA.z0], [ODA.x1, ODA.y1, ODA.z0]],
  ];
  const kenar = (a: V3, b: V3) => {
    // çizgiyi parçalara bölüp yalnız önde kalanları çiz
    const N = 24;
    let d = "";
    let pen = false;
    for (let i = 0; i <= N; i++) {
      const q = add(a, [b[0] - a[0], b[1] - a[1], b[2] - a[2]], i / N);
      const p = proj(k, q);
      if (p.z < NEAR * 2) { pen = false; continue; }
      d += `${pen ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
      pen = true;
    }
    return d;
  };
  return (
    <g>
      <defs>
        <filter id="bo_ao" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
        <radialGradient id="bo_vin" cx="0.5" cy="0.45" r="0.8"><stop offset="0.6" stopColor="#9ab4c4" stopOpacity={0} /><stop offset="1" stopColor="#6a8496" stopOpacity={0.32} /></radialGradient>
        <radialGradient id="bo_kirmizi" cx="0.5" cy="0.5" r="0.75"><stop offset="0" stopColor="#ff1a2a" stopOpacity={0.12} /><stop offset="1" stopColor="#a8000e" stopOpacity={0.5} /></radialGradient>
      </defs>
      <rect width={W} height={H} fill="#e8eff3" />
      {YUZEYLER.map((s) => {
        const d = polyPath(k, [s.o, add(s.o, s.t1, s.l1), add(add(s.o, s.t1, s.l1), s.t2, s.l2), add(s.o, s.t2, s.l2)]);
        return d ? <path key={s.ad} d={d} fill={s.renk} /> : null;
      })}
      {/* köşe gölgeleri (ambient occlusion): kaynağı belli olmayan ışıkta tek derinlik ipucu */}
      <g filter="url(#bo_ao)" opacity={0.55}>
        {koseler.map(([a, b], i) => <path key={i} d={kenar(a, b)} stroke="#9fb2be" strokeWidth={14} fill="none" />)}
      </g>
      <g opacity={0.5}>
        {koseler.map(([a, b], i) => <path key={i} d={kenar(a, b)} stroke="#b8c6d0" strokeWidth={2} fill="none" />)}
      </g>
      {durum.derz > 0 ? (
        <g opacity={durum.derz}>
          {YUZEYLER.map((s, yi) => <path key={s.ad} d={derzD(s, yi)} fill="none" stroke="#a9bac6" strokeWidth={1.6} />)}
        </g>
      ) : null}
      {list.map((c) => c.el)}
      {ekstra}
      <rect width={W} height={H} fill="url(#bo_vin)" />
      {durum.kirmizi > 0 ? <rect width={W} height={H} fill="url(#bo_kirmizi)" opacity={durum.kirmizi} /> : null}
    </g>
  );
};

/* ------------------------------------------------------------------ mızrak (kanca) */
export const Mizrak: React.FC<{ k: Kam; uc: V3; yon: V3; boy?: number }> = ({ k, uc, yon, boy = 2.2 }) => {
  const n = Math.hypot(...yon);
  const D: V3 = [yon[0] / n, yon[1] / n, yon[2] / n];
  const kuyruk = add(uc, D, -boy);
  const boyun = add(uc, D, -0.34);
  // dik vektörler
  const S0: V3 = [D[2], 0, -D[0]];
  const sn = Math.hypot(...S0) || 1;
  const S: V3 = [S0[0] / sn, 0, S0[2] / sn];
  const U: V3 = [D[1] * S[2] - D[2] * S[1], D[2] * S[0] - D[0] * S[2], D[0] * S[1] - D[1] * S[0]];
  const pu = proj(k, uc);
  if (pu.z < 0.15) return null;
  const sap = (a: V3, b: V3, w: number) => {
    const pa = proj(k, a), pb = proj(k, b);
    const wa = (w * k.f) / pa.z, wb = (w * k.f) / pb.z;
    const dx = pb.x - pa.x, dy = pb.y - pa.y, L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L;
    return `M ${pa.x + nx * wa} ${pa.y + ny * wa} L ${pb.x + nx * wb} ${pb.y + ny * wb} L ${pb.x - nx * wb} ${pb.y - ny * wb} L ${pa.x - nx * wa} ${pa.y - ny * wa} Z`;
  };
  const yap = (v: V3, w: number) => polyPath(k, [uc, add(add(boyun, v, w), D, 0.08), add(boyun, D, -0.06), add(add(boyun, v, -w), D, 0.08)]);
  const ck = proj(k, kuyruk);
  return (
    <g>
      {/* hız izi */}
      <path d={`M ${pu.x} ${pu.y} L ${ck.x} ${ck.y}`} stroke="#ffffff" strokeWidth={(0.2 * k.f) / pu.z} opacity={0.25} strokeLinecap="round" />
      <path d={sap(add(boyun, D, -0.05), kuyruk, 0.022)} fill="#7a5530" stroke={OUT} strokeWidth={2} />
      <path d={sap(add(boyun, D, -0.12), add(boyun, D, -0.2), 0.03)} fill="#c8282e" stroke={OUT} strokeWidth={2} />
      <path d={yap(U, 0.075)} fill="#9aa6ae" stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
      <path d={yap(S, 0.075)} fill="#d8e0e6" stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
      <path d={polyPath(k, [uc, add(boyun, S, 0.02), add(boyun, S, -0.02)])} fill="#ffffff" opacity={0.6} />
    </g>
  );
};
