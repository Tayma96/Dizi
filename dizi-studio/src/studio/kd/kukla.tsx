import React from "react";
import { random } from "remotion";
import { proj, type Kam } from "../sets/beyazoda";
import { egri, serit, Hacim, type P, type PW, type Isik } from "./cizim";

/* =====================================================================================
 * Kırmızı Düğme · KUKLA yardımcıları (yeni çizim dili, beyaz oda)
 * - Çizim birimi: 1 m = U birim (Göbekli örneğiyle aynı ölçek: ayakta ~1320 birim).
 * - Karakterler 2B çizilir, 3B odaya iki yolla yerleştirilir:
 *     "dik"  : dikey düzlem (yan profilde yatan beden, ayaktaki/çömelmiş beden). Yatay eksen dünyadaki
 *              yöne göre kısalır; dikey eksen ekranda dik kalır (2,5B hile: tepeden bakışta ezilmez).
 *     "zemin": zemine yatırılmış çizim (tepeden görünüş). Yere paralel düzlemin afin izdüşümü; çok yatık
 *              bakışta okunur kalsın diye dikey sıkışma en az `min` ile sınırlanır.
 * - Çizgi kalınlığı ekranda dengeli kalsın diye karakterlere `lw` (çizgi çarpanı) verilir.
 * ===================================================================================== */

export const U = 780;
export type V3 = [number, number, number];

/** Beyaz oda ışığı: kaynağı görünmeyen, her yerden gelen soğuk beyaz. Biçim gölgesi çok hafif ve serin; düşen gölge yok. */
export const ODA_ISIK: Isik = { yon: [0.1, 1], golge: 9, kenar: 4, kenarRenk: "#ffffff", kenarOp: 0.8 };

export const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ease = (v: number) => { const x = cl(v); return x * x * (3 - 2 * x); };
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** a→b arası yumuşak geçiş penceresi (kare cinsinden) */
export const ara = (f: number, a: number, b: number) => ease((f - a) / Math.max(1, b - a));

/** Uzuv dış hattı: [x, y, çap] orta çizgisinden kapalı, uçları yuvarlak biçim (eklem kopmaz: tek parça). */
export const uzuv = (pts: PW[]): P[] => {
  const n = pts.length;
  const sol: P[] = [], sag: P[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l, ny = dx / l, w = pts[i][2] / 2;
    sol.push([pts[i][0] + nx * w, pts[i][1] + ny * w]);
    sag.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }
  const d0x = pts[1][0] - pts[0][0], d0y = pts[1][1] - pts[0][1], l0 = Math.hypot(d0x, d0y) || 1;
  const d1x = pts[n - 1][0] - pts[n - 2][0], d1y = pts[n - 1][1] - pts[n - 2][1], l1 = Math.hypot(d1x, d1y) || 1;
  const bas: P = [pts[0][0] - (d0x / l0) * pts[0][2] * 0.42, pts[0][1] - (d0y / l0) * pts[0][2] * 0.42];
  const son: P = [pts[n - 1][0] + (d1x / l1) * pts[n - 1][2] * 0.42, pts[n - 1][1] + (d1y / l1) * pts[n - 1][2] * 0.42];
  return [bas, ...sol, son, ...sag.reverse()];
};

/** İki kemikli kol/bacak: omuz, açı (derece, 0 = +x yönü, saat yönü pozitif), boylar → [omuz, dirsek, bilek] */
export const kemik = (o: P, a1: number, l1: number, a2: number, l2: number): [P, P, P] => {
  const r1 = (a1 * Math.PI) / 180, r2 = ((a1 + a2) * Math.PI) / 180;
  const e: P = [o[0] + Math.cos(r1) * l1, o[1] + Math.sin(r1) * l1];
  const w: P = [e[0] + Math.cos(r2) * l2, e[1] + Math.sin(r2) * l2];
  return [o, e, w];
};
/** kemik zincirinden uzuv orta çizgisi (ara noktalarla) */
export const kemikHat = (j: [P, P, P], w: [number, number, number]): PW[] => {
  const m = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const a = m(j[0], j[1], 0.5), b = m(j[1], j[2], 0.5);
  return [[j[0][0], j[0][1], w[0]], [a[0], a[1], (w[0] + w[1]) / 2 + w[1] * 0.08], [j[1][0], j[1][1], w[1]], [b[0], b[1], (w[1] + w[2]) / 2], [j[2][0], j[2][1], w[2]]];
};
export const aciDer = (a: P, b: P) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;

/* ---------------- 3B yerleştirme ---------------- */
export type Yer =
  | { tip: "dik"; o: V3; t1: V3; cap?: [number, number] }
  | { tip: "zemin"; o: V3; t1: V3; t2: V3; min?: number; cap?: [number, number] };

/** Yerel çizim birimini ekrana taşıyan SVG matrisi; s = birim başına piksel (çizgi ölçeği için), z = derinlik. */
export const yerlestir = (k: Kam, y0: Yer): { tr: string; s: number; z: number; p: { x: number; y: number } } | null => {
  // çapa: afin yaklaşım bu yerel noktada kurulur (yakın planda yüz gibi önemli bölge doğru izdüşsün)
  const cap = y0.cap ?? [0, 0];
  const t2d: V3 = y0.tip === "zemin" ? y0.t2 : [0, -1, 0];
  const o: V3 = [y0.o[0] + (y0.t1[0] * cap[0] + t2d[0] * cap[1]) / U, y0.o[1] + (y0.t1[1] * cap[0] + t2d[1] * cap[1]) / U, y0.o[2] + (y0.t1[2] * cap[0] + t2d[2] * cap[1]) / U];
  const y = { ...y0, o } as Yer;
  const p = proj(k, y.o);
  if (p.z < 0.12) return null;
  const e = 0.05;
  const a = proj(k, [y.o[0] + y.t1[0] * e, y.o[1] + y.t1[1] * e, y.o[2] + y.t1[2] * e]);
  let c1 = [(a.x - p.x) / e / U, (a.y - p.y) / e / U];
  let c2: number[];
  if (y.tip === "dik") {
    const up = proj(k, [y.o[0], y.o[1] + e, y.o[2]]);
    const vx = (up.x - p.x) / e, vy = (up.y - p.y) / e;
    const L = Math.hypot(vx, vy) || 1, nom = k.f / p.z;
    const boy = Math.max(L, nom * 0.78) / U;
    c2 = [(-vx / L) * boy, (-vy / L) * boy]; // yerel +y (aşağı) → ekranda dünyanın aşağısı
  } else {
    const b = proj(k, [y.o[0] + y.t2[0] * e, y.o[1] + y.t2[1] * e, y.o[2] + y.t2[2] * e]);
    c2 = [(b.x - p.x) / e / U, (b.y - p.y) / e / U];
    const yat = Math.hypot(y.o[0] - k.x, y.o[2] - k.z);
    const sinE = Math.max(0.02, Math.sin(Math.atan2(k.y - y.o[1], yat)));
    const ks = Math.max(1, (y.min ?? 0.5) / sinE);
    c1 = [c1[0], c1[1] * ks];
    c2 = [c2[0], c2[1] * ks];
  }
  const s = Math.sqrt(Math.abs(c1[0] * c2[1] - c1[1] * c2[0]));
  const f = (n: number) => n.toFixed(5);
  return { tr: `matrix(${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${p.x.toFixed(2)} ${p.y.toFixed(2)}) translate(${-cap[0]} ${-cap[1]})`, s, z: p.z, p };
};

/** Çizgi çarpanı: yakın planda çizgi incelir, genel planda kalınlaşır (ekranda 2-9 px aralığı). */
export const lwOlcek = (s: number) => Math.pow(Math.max(0.03, s), -0.78);

/* ---------------- yüz parçaları (önden) ---------------- */
export type Renkler = { ten: string; tenG: string; cizgi: string };

/** Kaş: (x, y) orta, w genişlik, aci derece (iç uç aşağı = çatık), kalk yukarı kalkma (birim), ayna sağ kaş */
export const Kas: React.FC<{ x: number; y: number; w: number; aci: number; kalk?: number; renk: string; kal?: number; ayna?: boolean }> = ({ x, y, w, aci, kalk = 0, renk, kal = 9, ayna }) => {
  const m = ayna ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y - kalk}) scale(${m} 1) rotate(${aci})`}>
      <path d={serit([[-w / 2, 2, kal * 0.4], [-w * 0.1, -3, kal], [w / 2, 0, kal * 0.25]])} fill={renk} />
    </g>
  );
};

/** Ağız (önden): ac 0..1 açıklık, yuv 0..1 yuvarlaklık (o/u), gen genişlik çarpanı, gul gülümseme (-1 somurtma .. 1) */
export const Agiz: React.FC<{ x: number; y: number; w: number; ac: number; yuv?: number; gul?: number; dudak: string; cizgi: string; dis?: boolean; lw?: number }> = ({ x, y, w, ac, yuv = 0, gul = 0, dudak, cizgi, dis = true, lw = 1 }) => {
  const g = w * (1 - 0.42 * yuv) * (1 + 0.1 * ac * (1 - yuv));
  const h = w * 0.62 * ac;
  const kv = -gul * w * 0.12;
  if (ac < 0.06) {
    return (
      <g>
        <path d={serit([[x - g / 2, y + kv, 0], [x - g * 0.2, y + 1, 4.5 * lw], [x + g * 0.2, y + 1, 4.5 * lw], [x + g / 2, y + kv, 0]])} fill={cizgi} />
        <path d={serit([[x - g * 0.3, y + w * 0.14, 0], [x, y + w * 0.17, 4 * lw], [x + g * 0.3, y + w * 0.14, 0]])} fill={dudak} opacity={0.75} />
      </g>
    );
  }
  const ust = y - h * 0.32, alt = y + h * 0.68;
  const sek: P[] = [[x - g / 2, y + kv], [x - g * 0.3, ust], [x, ust - h * 0.05], [x + g * 0.3, ust], [x + g / 2, y + kv], [x + g * 0.3, alt], [x, alt + h * 0.06], [x - g * 0.3, alt]];
  const d = egri(sek, true);
  const id = `ag${Math.round(x)}${Math.round(y)}`;
  return (
    <g>
      <defs><clipPath id={id}><path d={d} /></clipPath></defs>
      <path d={d} fill="#4a1420" />
      <g clipPath={`url(#${id})`}>
        {dis ? <rect x={x - g} y={ust - h * 0.3} width={g * 2} height={h * 0.3 + Math.min(h * 0.22, w * 0.12)} fill="#f8f4ee" /> : null}
        <ellipse cx={x} cy={alt + h * 0.05} rx={g * 0.34} ry={h * 0.28} fill="#d86a78" />
      </g>
      <path d={d} fill="none" stroke={cizgi} strokeWidth={3.2 * lw} strokeLinejoin="round" />
      <path d={serit([[x - g * 0.42, ust - 2 * lw, 0], [x, ust - 5 * lw, 5 * lw], [x + g * 0.42, ust - 2 * lw, 0]])} fill={dudak} opacity={0.8} />
      <path d={serit([[x - g * 0.3, alt + 4 * lw, 0], [x, alt + 7 * lw, 6 * lw], [x + g * 0.3, alt + 4 * lw, 0]])} fill={dudak} opacity={0.8} />
    </g>
  );
};

/* ---------------- konuşma (yaklaşık ağız hareketi) ---------------- */
export type Replik = { bas: number; son: number; sesli: string; sabit?: boolean };
const SESLI: Record<string, { ac: number; yuv: number }> = {
  a: { ac: 1, yuv: 0.1 }, e: { ac: 0.7, yuv: 0 }, "ı": { ac: 0.45, yuv: 0 }, i: { ac: 0.42, yuv: 0 },
  o: { ac: 0.75, yuv: 0.8 }, "ö": { ac: 0.6, yuv: 0.7 }, u: { ac: 0.45, yuv: 1 }, "ü": { ac: 0.42, yuv: 0.9 },
};
export const agizDurum = (frame: number, rep: Replik[]): { ac: number; yuv: number; konus: boolean } => {
  for (const r of rep) {
    if (frame < r.bas || frame > r.son) continue;
    const n = r.sesli.length;
    const u = ((frame - r.bas) / Math.max(1, r.son - r.bas)) * n;
    const i = Math.min(n - 1, Math.floor(u));
    const ph = u - i;
    const v = SESLI[r.sesli[i]] ?? SESLI.a;
    const acik = r.sabit ? Math.min(1, ph * 6, (1 - ph) * 8 + 0.2) : Math.pow(Math.sin(ph * Math.PI), 0.7);
    return { ac: v.ac * acik, yuv: v.yuv, konus: true };
  }
  return { ac: 0, yuv: 0, konus: false };
};

/** Göz kırpma: her `per` karede bir, 5 karelik kırpma (0 = kapalı, 1 = açık) */
export const kirp = (frame: number, per = 97, faz = 0) => {
  const k = (frame + faz) % per;
  return k < 5 ? Math.abs(k - 2.5) / 2.5 : 1;
};

/** Düşük frekanslı titrek el/kamera salınımı */
export const salin = (frame: number, g = 1, tohum = 0) => ({
  x: (Math.sin(frame / 11 + tohum) * 4 + Math.sin(frame / 5.3 + tohum * 2) * 1.5) * g,
  y: (Math.sin(frame / 13 + 1 + tohum) * 5 + Math.sin(frame / 6.1 + tohum) * 1.2) * g,
});
export const sars = (frame: number, g: number) => ({ x: (random(`sx${frame}`) - 0.5) * 2 * g, y: (random(`sy${frame}`) - 0.5) * 2 * g });

/** Kıl / sakal noktası dağıtıcı (aynı tohum → aynı noktalar) */
export const noktalar = (tohum: number, n: number, icinde: (x: number, y: number) => boolean, kutu: [number, number, number, number]): P[] => {
  const r = (() => { let s = tohum % 2147483647; if (s <= 0) s += 2147483646; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
  const out: P[] = [];
  let deneme = 0;
  while (out.length < n && deneme < n * 40) {
    deneme++;
    const x = kutu[0] + r() * (kutu[2] - kutu[0]), y = kutu[1] + r() * (kutu[3] - kutu[1]);
    if (icinde(x, y)) out.push([x, y]);
  }
  return out;
};

export { egri, serit, Hacim };
export type { P, PW, Isik };
