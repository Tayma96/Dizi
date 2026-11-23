import React from "react";

/* =====================================================================================
 * Kırmızı Düğme · ÇİZİM KATMANI yardımcıları (stil 1 "renkli kontur", el çizimi hissi)
 * - Catmull-Rom ile noktalardan yumuşak eğri (çizer gibi nokta koyarak biçim kurulur)
 * - Şerit (ribbon): kalınlığı nokta nokta değişen fırça çizgisi (uçları sivrilir)
 * - Hacim: dolgu + ışığa göre gölge hilali + kenar ışığı + kalınlığı ışığa göre değişen renkli kontur
 *   (gölge tarafında kalın, ışık tarafında ince çizgi: klasik çizgi ağırlığı kuralı)
 * ===================================================================================== */

export type P = [number, number];
export type PW = [number, number, number];

const f = (n: number) => Math.round(n * 10) / 10;

/** Noktalardan geçen yumuşak eğri (Catmull-Rom → kübik Bézier). */
export const egri = (pts: P[], kapali: boolean): string => {
  const n = pts.length;
  if (n < 2) return "";
  const at = (i: number): P => (kapali ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  const son = kapali ? n : n - 1;
  for (let i = 0; i < son; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return kapali ? d + " Z" : d;
};

const normal = (a: P, b: P): P => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  return [-dy / l, dx / l];
};

/** Fırça şeridi: [x, y, kalınlık] noktaları; kalınlık 0 → sivri uç. */
export const serit = (pts: PW[]): string => {
  const n = pts.length;
  const sol: P[] = [], sag: P[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const nm = normal([a[0], a[1]], [b[0], b[1]]);
    const w = pts[i][2] / 2;
    sol.push([pts[i][0] + nm[0] * w, pts[i][1] + nm[1] * w]);
    sag.push([pts[i][0] - nm[0] * w, pts[i][1] - nm[1] * w]);
  }
  const yol = [...sol, ...sag.reverse()];
  return egri(yol, true);
};

/** Kapalı biçimin çevresinde kalınlığı değişen halka (evenodd ile dolgu). */
const halka = (pts: P[], gen: number[]): string => {
  const n = pts.length;
  // yönü bul (dış normal için)
  let alan = 0;
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; alan += a[0] * b[1] - b[0] * a[1]; }
  const s = alan > 0 ? -1 : 1;
  const dis: P[] = [], ic: P[] = [];
  for (let i = 0; i < n; i++) {
    const nm = normal(pts[(i - 1 + n) % n], pts[(i + 1) % n]);
    const w = gen[i] / 2;
    dis.push([pts[i][0] + s * nm[0] * w, pts[i][1] + s * nm[1] * w]);
    ic.push([pts[i][0] - s * nm[0] * w, pts[i][1] - s * nm[1] * w]);
  }
  return egri(dis, true) + " " + egri(ic.reverse(), true);
};

/** Dış normale göre çizgi kalınlığı: ışığın geldiği yönün tersinde kalın. */
const kalinliklar = (pts: P[], ince: number, kalin: number, isik: P, acik?: number[]): number[] => {
  const n = pts.length;
  let alan = 0;
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; alan += a[0] * b[1] - b[0] * a[1]; }
  const s = alan > 0 ? -1 : 1;
  const L = Math.hypot(isik[0], isik[1]) || 1;
  return pts.map((_, i) => {
    if (acik && acik.includes(i)) return 0;
    const nm = normal(pts[(i - 1 + n) % n], pts[(i + 1) % n]);
    const dis: P = [s * nm[0], s * nm[1]];
    // ışık soldan-üstten geliyorsa (isik = ışığın gittiği yön), gölge tarafı = dis · isik > 0
    const g = Math.max(0, (dis[0] * isik[0] + dis[1] * isik[1]) / L);
    return ince + (kalin - ince) * g;
  });
};

export type Isik = {
  /** ışığın gittiği yön (soldan gelen ışık → [1, 0.4]) */
  yon: P;
  /** gölge hilalinin kalınlığı (px) */
  golge: number;
  /** kenar ışığı kalınlığı (px) */
  kenar: number;
  kenarRenk: string;
  kenarOp: number;
};

/** Gölgeli, kenar ışıklı, ağırlıklı konturlu hacim. */
export const Hacim: React.FC<{
  id: string; pts: P[]; dolgu: string; golge: string; cizgi: string; isik: Isik;
  ince?: number; kalin?: number; acik?: number[]; children?: React.ReactNode; golgeCarp?: number;
  /** kenar ışığı yalnız bu y'nin altında (kol/bacak eklem başında dikiş görünmesin) */
  kenarAlt?: number;
}> = ({ id, pts, dolgu, golge, cizgi, isik, ince = 2.6, kalin = 8, acik, children, golgeCarp = 1, kenarAlt }) => {
  const d = egri(pts, true);
  const L = Math.hypot(isik.yon[0], isik.yon[1]) || 1;
  const ux = isik.yon[0] / L, uy = isik.yon[1] / L;
  const g = isik.golge * golgeCarp;
  return (
    <g>
      <defs>
        <clipPath id={`k-${id}`}><path d={d} /></clipPath>
        <mask id={`m-${id}`} maskUnits="userSpaceOnUse" x={-500} y={-500} width={3000} height={3500}>
          <path d={d} fill="#fff" />
          <path d={d} fill="#000" transform={`translate(${f(ux * isik.kenar)} ${f(uy * isik.kenar)})`} />
          {kenarAlt !== undefined && <rect x={-500} y={-500} width={3000} height={kenarAlt + 500} fill="#000" />}
        </mask>
      </defs>
      <g clipPath={`url(#k-${id})`}>
        <path d={d} fill={golge} />
        <path d={d} fill={dolgu} transform={`translate(${f(-ux * g)} ${f(-uy * g)})`} />
        {children}
        <path d={d} fill={isik.kenarRenk} opacity={isik.kenarOp} mask={`url(#m-${id})`} />
      </g>
      <path d={halka(pts, kalinliklar(pts, ince, kalin, isik.yon, acik))} fill={cizgi} fillRule="evenodd" />
    </g>
  );
};

/** Basit sözde-rastgele (aynı tohum → aynı sonuç). */
export const rnd = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
};
