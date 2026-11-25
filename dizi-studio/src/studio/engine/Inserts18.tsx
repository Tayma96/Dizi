/* =====================================================================================
 * 7/24 Bölüm 8 · parça 1: "b8_market": Can Market, kasım akşamı ~19:00. Elle kurgulanmış sahne (opt-in; yalnız 724-08).
 *  Tek bir sahne zaman çizelgesi; görünüm KURGU listesinden seçilir (vuruş sınırlarından bağımsız sert kesmeler):
 *   dis    : karşı kaldırımdan cephe (Ece arkadan, vitrin ışığına karşı siluet)
 *   kapi   : içeriden kapıya (market724 "kapi"): Ece camın ardında → kapı açılır → içeri girer
 *   tezgah : Sabri'nin tarafından ters açı: Ece tezgâhın önünde, elleri tezgâhta; önde (ters) kâğıt
 *   kasa   : müşteri tarafından kasa (market724 "kasa"): Sabri, masa lambası, gazete, sipariş fişi
 *   kagit  : tezgâhın üstünden kâğıdın yakın planı (Ece'nin gözünden); Sabri'nin eli üstten girer, kalem CANLI çizer
 *
 *  ZAMAN: bütün anahtarlar SAHNE zamanında (sn); her vuruş t0 verir.
 *  prm: t0, kurgu [[t, görünüm]], cam {görünüm: [[t,cx,cy,z]]}, titre {görünüm: px}, saat, kapi [[t,k]], sensor [[t0,t1]],
 *       flor [[t,v]] (floresan 0..1), cizir [[t0,t1]] (floresan titremesi), lamba [[t,v]] (sıcak masa lambası),
 *       kar {görünüm: {ece?: {...}, sabri?: {...}}} (Inserts16 karakter alanları), disarida [[t0,t1]] (kapi: Ece camın ardında),
 *       cizim [{w, p:[[t,x,y],...]}] (kâğıt koordinatında zamanlı mürekkep), uc [[t,x,y,h]] (kalem ucu; h=kalkıklık 0..1),
 *       elAra [[t0,t1]] (kâğıtta el görünür), bas [{t0,t1,x,y,r}] (mürekkep lekesi), blok [[t,x]] / gazete [[t,x]] (kasa: tezgâhtaki eşya),
 *       ekK [[t,v]] (kagit: Ece'nin parmak uçları alt kenarda 0..1, kıvrılma), siluet (dis)
 * ===================================================================================== */
import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Market724BG, Market724FG } from "../sets/market724";
import { Market724DisBG, Market724DisZemin } from "../sets/market724dis";
import { Market724YanBG, Market724YanTezgah, YAN_KAPI, YanAyakkabi, kapiAltGolge, yanKapiBosluk, yanTezgahUst } from "../sets/market724yan";
import { TvEkran } from "./tv724";
import { sstep } from "./bocek";
import { AnimeFxDunya, AnimeFxEkran, fxKamera, type Fx } from "./canli";
import { karakter, type KarCiz } from "./Inserts16";
import { NahEller, nahGeo } from "./nahEl";

export type Insert18Kind = "b8_market";
export const INSERT18_KINDS: Insert18Kind[] = ["b8_market"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Prm = Record<string, any>;
type V2 = [number, number];
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
/** doğrusal ara değer (kalem ucu ve mürekkep için; yumuşatma yok) */
const kfLin = (k: KF | undefined, t: number, def: number[]): number[] => {
  if (!k || !k.length) return def;
  if (t <= k[0][0]) return k[0].slice(1);
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i], b = k[i + 1];
    if (t < b[0]) {
      const u = (t - a[0]) / Math.max(1e-6, b[0] - a[0]);
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
const MUREKKEP = "#1c2c78";
const camT = (cx: number, cy: number, z: number, sx = 0, sy = 0) => `translate(${540 + sx}px, ${960 + sy}px) scale(${z}) translate(${-cx}px, ${-cy}px)`;
const SVG: React.FC<{ children: React.ReactNode; blend?: React.CSSProperties["mixBlendMode"] }> = ({ children, blend }) => (
  <svg viewBox="-600 -400 2280 2720" width={2280} height={2720} style={{ position: "absolute", left: -600, top: -400, overflow: "visible", mixBlendMode: blend, pointerEvents: "none" }}>{children}</svg>
);
const kar = (k: KarCiz | null) => (k ? <>{k.govde}{k.on}</> : null);

/* ------------------------------------------------------------------ çizim: zamanlı mürekkep */
type Cizgi = { w?: number; p: number[][] };
const cizgiYol = (c: Cizgi, tg: number): string | null => {
  const p = c.p;
  if (!p.length || tg < p[0][0]) return null;
  const pts: V2[] = [];
  for (let i = 0; i < p.length; i++) {
    if (p[i][0] <= tg) pts.push([p[i][1], p[i][2]]);
    else {
      const a = p[i - 1], b = p[i];
      const u = (tg - a[0]) / Math.max(1e-6, b[0] - a[0]);
      pts.push([a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]);
      break;
    }
  }
  if (pts.length < 2) pts.push([pts[0][0] + 0.5, pts[0][1] + 0.5]);
  return `M ${pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L ")}`;
};
/** kâğıt + mürekkep (kâğıt koordinatı = dünya; kâğıt 90..990 × 330..1500) */
const Kagit: React.FC<{ p: Prm; tg: number; golge?: boolean }> = ({ p, tg, golge = true }) => {
  const cizim = (p.cizim ?? []) as Cizgi[];
  const bas = (p.bas ?? []) as Prm[];
  return (
    <g>
      {golge ? <rect x={104} y={348} width={900} height={1170} rx={6} fill="#000" opacity={0.22} filter="url(#b8gb6)" /> : null}
      <rect x={90} y={330} width={900} height={1170} rx={6} fill="#f7f1de" stroke="#c8bc98" strokeWidth={3} />
      {/* basılı başlık: sipariş fişi */}
      <text x={540} y={402} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={40} fill="#b83a26" letterSpacing={2}>CAN MARKET</text>
      <text x={540} y={442} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={700} fontSize={24} fill="#b83a26" letterSpacing={6}>SİPARİŞ FİŞİ</text>
      <path d="M 130 466 H 950" stroke="#d07a66" strokeWidth={3} />
      <text x={940} y={500} textAnchor="end" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={24} fill="#b8a888">No 0724</text>
      {/* yırtma payı (üstte delikli çizgi) */}
      <path d="M 100 344 H 980" stroke="#d8ccaa" strokeWidth={3} strokeDasharray="6 8" />
      {/* hafif kâğıt dokusu */}
      {[0.2, 0.45, 0.7].map((k, i) => <path key={i} d={`M 100 ${330 + 1170 * k} q 400 ${12 - i * 8} 880 ${-6 + i * 5}`} stroke="#e8dfc4" strokeWidth={2} fill="none" />)}
      {/* mürekkep */}
      {cizim.map((c, i) => {
        const d = cizgiYol(c, tg);
        if (!d) return null;
        const w = c.w ?? 9;
        return (
          <g key={i}>
            <path d={d} stroke={MUREKKEP} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.92} />
            <path d={d} stroke="#0e1650" strokeWidth={w * 0.4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
          </g>
        );
      })}
      {bas.map((b, i) => {
        if (tg < b.t0) return null;
        const u = sstep(b.t0, b.t1, tg);
        return <g key={`b${i}`}><circle cx={b.x} cy={b.y} r={b.r * (0.25 + 0.75 * u)} fill={MUREKKEP} opacity={0.9} /><circle cx={b.x} cy={b.y} r={b.r * (0.35 + 0.9 * u)} fill={MUREKKEP} opacity={0.18} /></g>;
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ Sabri'nin kalemli eli (üstten görünüş; uç (x,y)'de) */
/** Sabri solak: kalem SOL elinde; Ece'nin gözünden el sağ üstten gelir (çizilenleri örtmez), lamba sol üstte */
const OMUZ: V2 = [1250, -560];
const KalemEl: React.FC<{ x: number; y: number; h: number; golge?: boolean }> = ({ x, y, h, golge }) => {
  // kalem ekseni: uçtan omza doğru, biraz sağa döndürülmüş (tükenmez eğik tutulur)
  const ang0 = Math.atan2(OMUZ[1] - y, OMUZ[0] - x);
  const ang = ang0 - 0.28;
  const deg = (ang * 180) / Math.PI;
  const s = 1 + 0.07 * h;
  // bilek: uçtan 230 px; dirseğe doğru kol (omuz yönünde)
  const wx = x + Math.cos(ang) * 230 * s, wy = y + Math.sin(ang) * 230 * s;
  const kolAng = Math.atan2(OMUZ[1] - wy, OMUZ[0] - wx);
  const kx = wx + Math.cos(kolAng) * 1500, ky = wy + Math.sin(kolAng) * 1500;
  const ten = "#d8a47c", tenK = "#c08a64", hirka = "#6a6a66", hirkaK = "#525250";
  const g = golge;
  const f = (c: string) => (g ? "#000" : c);
  const st = g ? "none" : O;
  return (
    <g opacity={g ? 0.26 : 1} filter={g ? "url(#b8gb10)" : undefined}>
      {/* kol (hırka kolu) */}
      <path d={`M ${wx} ${wy} L ${kx} ${ky}`} stroke={g ? "#000" : O} strokeWidth={168} strokeLinecap="round" />
      <path d={`M ${wx} ${wy} L ${kx} ${ky}`} stroke={f(hirka)} strokeWidth={160} strokeLinecap="round" />
      {!g ? <path d={`M ${wx + Math.cos(kolAng) * 60} ${wy + Math.sin(kolAng) * 60} L ${kx} ${ky}`} stroke={hirkaK} strokeWidth={50} strokeLinecap="round" opacity={0.5} transform={`translate(${Math.cos(kolAng + 1.57) * 40} ${Math.sin(kolAng + 1.57) * 40})`} /> : null}
      {/* manşet (fitilli) */}
      {!g ? new Array(6).fill(0).map((_, i) => {
        const cx = wx + Math.cos(kolAng) * (20 + i * 9), cy = wy + Math.sin(kolAng) * (20 + i * 9);
        return <path key={i} d={`M ${cx + Math.cos(kolAng + 1.57) * 74} ${cy + Math.sin(kolAng + 1.57) * 74} L ${cx - Math.cos(kolAng + 1.57) * 74} ${cy - Math.sin(kolAng + 1.57) * 74}`} stroke={hirkaK} strokeWidth={3} />;
      }) : null}
      {/* el (yerel eksen: x kalem boyunca uçtan bileğe) */}
      <g transform={`translate(${x} ${y}) rotate(${deg}) scale(${s} ${-s})`}>
        {/* kalem */}
        <path d="M 6 0 L 300 0" stroke={g ? "#000" : O} strokeWidth={20} strokeLinecap="round" />
        <path d="M 30 0 L 298 0" stroke={f("#f4f4f2")} strokeWidth={14} strokeLinecap="round" />
        <path d="M 270 0 L 300 0" stroke={f("#2a4aa8")} strokeWidth={15} strokeLinecap="round" />
        <path d="M 2 0 L 32 0" stroke={f("#9aa0a6")} strokeWidth={10} strokeLinecap="round" />
        <circle cx={1} cy={0} r={3.5} fill={f("#2a2a2a")} />
        {/* avuç ve parmak boğumları */}
        <ellipse cx={175} cy={-6} rx={86} ry={66} fill={f(ten)} stroke={st} strokeWidth={5} />
        <path d="M 120 -58 Q 150 -74 190 -66 Q 230 -56 248 -30" stroke={g ? "none" : tenK} strokeWidth={5} fill="none" />
        {/* kıvrık parmaklar (orta, yüzük, serçe) avucun altında */}
        {[[118, 34, 30, 22], [140, 52, 28, 20], [168, 62, 24, 18]].map(([cx, cy, rx, ry], i) => <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={f(ten)} stroke={st} strokeWidth={4} />)}
        {/* işaret parmağı kalemin üstünde */}
        <path d="M 168 -30 Q 110 -22 64 -12" stroke={g ? "#000" : O} strokeWidth={34} strokeLinecap="round" fill="none" />
        <path d="M 168 -30 Q 110 -22 64 -12" stroke={f(ten)} strokeWidth={26} strokeLinecap="round" fill="none" />
        {!g ? <path d="M 74 -18 q -8 4 -10 10" stroke={tenK} strokeWidth={3} fill="none" /> : null}
        {/* başparmak kalemin altında */}
        <path d="M 150 26 Q 104 22 80 12" stroke={g ? "#000" : O} strokeWidth={32} strokeLinecap="round" fill="none" />
        <path d="M 150 26 Q 104 22 80 12" stroke={f(ten)} strokeWidth={24} strokeLinecap="round" fill="none" />
        {!g ? <ellipse cx={86} cy={13} rx={9} ry={7} fill="#e8bc98" opacity={0.8} /> : null}
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ B8 (yeni) P1: anime âşık anı
 * AnimeArka: karakterin ARKASINA pembe-lila ışıma, ışık hüzmeleri, bokeh. yarim>0: ekran ikiye bölünür (sol soğuk şüphe, sağ pembe aşk).
 * AnimeOn: karakterin ÖNÜNE yıldızcıklar (başın çevresinde yanıp söner). Hepsi kendi çizimimiz. */
const yildiz = (x: number, y: number, r: number) => `M ${x} ${y - r} L ${x + r * 0.22} ${y - r * 0.22} L ${x + r} ${y} L ${x + r * 0.22} ${y + r * 0.22} L ${x} ${y + r} L ${x - r * 0.22} ${y + r * 0.22} L ${x - r} ${y} L ${x - r * 0.22} ${y - r * 0.22} Z`;
const AnimeArka: React.FC<{ v: number; tg: number; cx: number; cy: number; yarim?: number }> = ({ v, tg, cx, cy, yarim = 0 }) => {
  if (v < 0.005) return null;
  const pembe = (
    <g>
      <rect x={-600} y={-400} width={2280} height={2720} fill="url(#b8anP)" />
      {/* ışık hüzmeleri: üst soldan, yavaşça döner */}
      <g transform={`rotate(${-8 + 4 * Math.sin(tg * 0.6)} ${cx - 420} -300)`} opacity={0.55}>
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${cx - 420} -300 L ${cx - 360 + i * 210} 2300 L ${cx - 250 + i * 210} 2300 Z`} fill="#ffffff" opacity={0.16 + 0.08 * Math.sin(tg * 1.3 + i)} />)}
      </g>
      {/* bokeh daireleri: yavaşça yükselir */}
      {new Array(16).fill(0).map((_, i) => {
        const x = cx - 560 + ((i * 173) % 1120), y0 = cy + 900 - ((tg * (24 + (i % 5) * 9) + i * 211) % 1700);
        const r = 18 + (i % 4) * 14;
        return <circle key={i} cx={x} cy={y0} r={r} fill={i % 3 ? "#ffffff" : "#ffd6ec"} opacity={0.22 + 0.12 * Math.sin(tg * 2 + i)} />;
      })}
    </g>
  );
  return (
    <g opacity={v}>
      <defs>
        <radialGradient id="b8anP" gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={1100}><stop offset="0" stopColor="#fff2fa" /><stop offset="0.35" stopColor="#ffc8e4" /><stop offset="0.75" stopColor="#e8a8e0" /><stop offset="1" stopColor="#b48ad8" /></radialGradient>
        <linearGradient id="b8anS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a2a5a" /><stop offset="1" stopColor="#2a3a6a" /></linearGradient>
        <clipPath id="b8anR"><rect x={cx} y={-400} width={2280} height={2720} /></clipPath>
        <clipPath id="b8anL"><rect x={-600} y={-400} width={cx + 600} height={2720} /></clipPath>
      </defs>
      {yarim > 0.01 ? (
        <>
          <g clipPath="url(#b8anR)">{pembe}</g>
          <g clipPath="url(#b8anL)" opacity={yarim}>
            {/* şüphe yarısı: koyu lacivert, çapraz çizgiler (gerilim) */}
            <rect x={-600} y={-400} width={2280} height={2720} fill="url(#b8anS)" />
            {new Array(30).fill(0).map((_, i) => <path key={i} d={`M ${-600 + i * 70} -400 l 900 2700`} stroke="#4a5a9a" strokeWidth={10} opacity={0.35} />)}
          </g>
          <g clipPath="url(#b8anL)" opacity={1 - yarim}>{pembe}</g>
          <path d={`M ${cx} -400 V 2320`} stroke="#ffffff" strokeWidth={8} opacity={0.8 * yarim} />
        </>
      ) : pembe}
    </g>
  );
};
const AnimeOn: React.FC<{ v: number; tg: number; cx: number; cy: number; r?: number; sag?: boolean }> = ({ v, tg, cx, cy, r = 330, sag }) => {
  if (v < 0.005) return null;
  return (
    <g opacity={v}>
      {new Array(9).fill(0).map((_, i) => {
        const a = (i / 9) * Math.PI * 2 + 0.4;
        const x = cx + Math.cos(a) * r * (0.85 + 0.2 * ((i * 37) % 5) / 5), y = cy + Math.sin(a) * r * 0.9;
        if (sag && x < cx) return null;
        const ph = Math.max(0, Math.sin(tg * 3.2 + i * 1.7));
        return <path key={i} d={yildiz(x, y, 10 + 30 * ph)} fill="#ffffff" opacity={0.3 + 0.7 * ph} stroke="#ffd0ea" strokeWidth={3} />;
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ depo kapısının kolu (kasa görünümü; kanat kenarında) */
const DepoKol: React.FC<{ acik: number; kol: number }> = ({ acik, kol }) => {
  // B8 (yeni) P1: menteşe SAĞDA (kol kadrajın içinde kalsın); BG'nin kanadını ve topuzunu karanlıkla örter, kendi kanadını çizer
  const w = Math.max(6, 110 * (1 - Math.max(0, Math.min(1.1, acik))));
  const x0 = 1085 - w, dy = 22 * (1 - w / 110) + 2;
  const px = x0 + 18, py = 860;
  return (
    <g>
      <rect x={975} y={350} width={110} height={990} fill="#0a0b0d" />
      {acik > 0.02 ? (
        <>
          <defs><radialGradient id="b8depoI" gradientUnits="userSpaceOnUse" cx={1000} cy={760} r={440}><stop offset="0" stopColor="#ffd890" stopOpacity={0.8} /><stop offset="1" stopColor="#ffd890" stopOpacity={0} /></radialGradient></defs>
          <rect x={975} y={350} width={110} height={990} fill="url(#b8depoI)" opacity={Math.min(1, acik * 1.4)} />
        </>
      ) : null}
      <path d={`M 1085 350 L ${x0} ${350 + dy} L ${x0} ${1340 - dy} L 1085 1340 Z`} fill="#4a5056" stroke="#2a2e32" strokeWidth={4} />
      {w > 40 ? (
        <g>
          <rect x={px - 10} y={py - 34} width={20} height={78} rx={6} fill="#9aa0a6" stroke="#2a2e32" strokeWidth={3} />
          <g transform={`rotate(${42 * kol} ${px} ${py})`}>
            <rect x={px - 2} y={py - 7} width={60} height={14} rx={7} fill="#d0d4d8" stroke="#2a2e32" strokeWidth={3} />
          </g>
          <circle cx={px} cy={py} r={9} fill="#c8ccd0" stroke="#2a2e32" strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
};

/* ------------------------------------------------------------------ B8 (yeni) P1: omuz üstü (OTS) ön plan: ensesi/omzu kadrajda olan kişi
 * Kendi çizimimiz; rig'in arkadan görünüşü olmadığı için baş arkası + omuz ayrı çizilir. Ön plan: bulanık ve hafif karanlık.
 * yon: +1 → kişi kadraj SAĞINA bakar (yanağı/kulağı sağda görünür), -1 → SOLA. (x,y): başın merkezi; s: ölçek (baş eni ~300·s) */
const SirtEce: React.FC<{ x: number; y: number; s: number; yon?: number }> = ({ x, y, s, yon = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * yon} ${s})`}>
    {/* kazak: omuzlar */}
    <path d="M -460 760 Q -440 420 -250 330 Q -120 290 0 292 Q 120 290 250 330 Q 440 420 460 760 Z" fill="#c8902a" stroke={O} strokeWidth={8} />
    <path d="M -300 380 Q -380 480 -400 760 M 300 380 Q 380 480 400 760" stroke="#a8741a" strokeWidth={30} fill="none" opacity={0.6} />
    {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${-260 + i * 65} ${330 + Math.abs(i - 4) * 6} V 760`} stroke="#a8741a" strokeWidth={8} opacity={0.35} />)}
    {/* boyun (arkadan, gölgede) */}
    <path d="M -70 150 L -78 312 Q 0 336 78 312 L 70 150 Z" fill="#dcac88" stroke={O} strokeWidth={6} />
    {/* yanak ve çene kenarı (baktığı yöne doğru) + kulak */}
    <path d="M 96 40 Q 150 120 120 190 Q 90 230 40 236 L 40 60 Z" fill="#f0c8a8" stroke={O} strokeWidth={6} />
    <ellipse cx={146} cy={44} rx={26} ry={44} fill="#f0c8a8" stroke={O} strokeWidth={6} />
    <path d="M 146 20 q 12 22 0 46" stroke="#dcac88" strokeWidth={6} fill="none" />
    {/* baş (saç, arkadan) */}
    <ellipse cx={-6} cy={-10} rx={156} ry={178} fill="#3a2418" stroke={O} strokeWidth={8} />
    <path d="M -110 -120 Q -40 -170 40 -150" stroke="#5a3a28" strokeWidth={18} fill="none" strokeLinecap="round" />
    <path d="M -130 20 Q -90 -60 -20 -70 M 110 -20 Q 70 -70 10 -70" stroke="#5a3a28" strokeWidth={9} fill="none" />
    {/* at kuyruğu (tepeden enseye, omza düşer) + toka */}
    <path d="M 10 -60 Q 70 40 50 160 Q 30 290 90 430 Q 120 500 80 560" stroke={O} strokeWidth={98} fill="none" strokeLinecap="round" />
    <path d="M 10 -60 Q 70 40 50 160 Q 30 290 90 430 Q 120 500 80 560" stroke="#3a2418" strokeWidth={84} fill="none" strokeLinecap="round" />
    <path d="M 26 0 Q 60 120 40 240 Q 34 330 80 430" stroke="#5a3a28" strokeWidth={12} fill="none" />
    <ellipse cx={14} cy={-62} rx={44} ry={22} fill="#e86a9a" stroke={O} strokeWidth={6} />
  </g>
);
const SirtSabri: React.FC<{ x: number; y: number; s: number; yon?: number }> = ({ x, y, s, yon = -1 }) => (
  <g transform={`translate(${x} ${y}) scale(${-s * yon} ${s})`}>
    {/* hırka: geniş omuzlar (iri yapı), yaka */}
    <path d="M -560 820 Q -540 430 -300 330 Q -150 285 0 288 Q 150 285 300 330 Q 540 430 560 820 Z" fill="#6a6a66" stroke={O} strokeWidth={8} />
    <path d="M -150 300 Q 0 360 150 300 L 130 260 Q 0 300 -130 260 Z" fill="#525250" stroke={O} strokeWidth={6} />
    <path d="M -380 400 Q -470 520 -490 820 M 380 400 Q 470 520 490 820" stroke="#525250" strokeWidth={34} fill="none" opacity={0.6} />
    {/* kalın boyun */}
    <path d="M -100 140 L -112 300 Q 0 330 112 300 L 100 140 Z" fill="#c08a64" stroke={O} strokeWidth={6} />
    {/* kulak + bıyık ucu (baktığı yöne) */}
    <ellipse cx={-160} cy={50} rx={30} ry={50} fill="#d8a47c" stroke={O} strokeWidth={6} />
    <path d="M -160 26 q -14 24 0 50" stroke="#c08a64" strokeWidth={6} fill="none" />
    <path d="M -150 150 Q -190 160 -205 140" stroke="#7a746c" strokeWidth={18} strokeLinecap="round" fill="none" />
    {/* kel tepe + arkada gri saç kuşağı */}
    <ellipse cx={0} cy={-6} rx={166} ry={186} fill="#d8a47c" stroke={O} strokeWidth={8} />
    <path d="M -150 -60 Q -60 -150 60 -140" stroke="#e8bc94" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M -166 10 Q -160 150 0 178 Q 160 150 166 10 Q 150 90 0 100 Q -150 90 -166 10 Z" fill="#9a948c" stroke={O} strokeWidth={6} />
    {[-120, -70, -20, 30, 80, 125].map((dx) => <path key={dx} d={`M ${dx} ${110 + Math.abs(dx) * -0.25} q 6 30 0 54`} stroke="#7a746c" strokeWidth={5} fill="none" />)}
  </g>
);
/** OTS katmanı: ön planda bulanık, hafif karanlık */
const OnPlan: React.FC<{ children: React.ReactNode; bulan?: number; karanlik?: number }> = ({ children, bulan = 9, karanlik = 0.72 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, filter: `blur(${bulan}px) brightness(${karanlik})` }}><SVG>{children}</SVG></div>
);

/* ------------------------------------------------------------------ masa lambası (kasa görünümü, tezgâhta, Sabri'nin sağında) */
const Lamba: React.FC<{ v: number }> = ({ v }) => (
  <g>
    <ellipse cx={345} cy={1442} rx={58} ry={14} fill="#2a2a2e" stroke="#0e0e10" strokeWidth={4} />
    <path d="M 345 1438 Q 330 1330 372 1262 Q 392 1236 418 1240" stroke="#2a2a2e" strokeWidth={11} fill="none" strokeLinecap="round" />
    <path d="M 345 1438 Q 330 1330 372 1262 Q 392 1236 418 1240" stroke="#4a4a50" strokeWidth={4} fill="none" strokeLinecap="round" />
    <g transform="translate(424 1250) rotate(38)">
      <path d="M -34 -20 L 34 -20 L 54 40 L -54 40 Z" fill="#2e5a4a" stroke="#0e1a16" strokeWidth={5} />
      <ellipse cx={0} cy={40} rx={54} ry={10} fill={v > 0.05 ? "#fff2c8" : "#3a3a30"} opacity={0.4 + 0.6 * v} stroke="#0e1a16" strokeWidth={3} />
    </g>
  </g>
);

/* ------------------------------------------------------------------ sahne */
const B8Market: React.FC<{ text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = prm(text);
  const t0 = p.t0 ?? 0;
  const tg = f / fps + t0;
  const t0f = -Math.round(t0 * fps);
  const view = basamak<string>(p.kurgu, tg, "dis");
  const [cx, cy, z] = kf(p.cam?.[view], tg, [540, 960, 1]);
  const sars = kf1(p.sars, tg, 0);
  const tA = (p.titre?.[view] ?? 2) + 26 * sars;
  const sx = tA * (Math.sin(tg * 1.7) * 0.7 + Math.sin(tg * 3.1) * 0.3), sy = tA * (Math.sin(tg * 1.3 + 1) * 0.6 + Math.sin(tg * 2.7) * 0.4);
  // floresan: temel şiddet × titreme (cızırtı aralıklarında rastgele düşüşler)
  const titrer = aralik(p.cizir, tg);
  const tit = titrer ? (random(`b8fl${Math.floor(f / 2)}`) > 0.55 ? 0.35 + 0.3 * random(`b8fk${f}`) : 1) : 1;
  const flor = kf1(p.flor, tg, 1) * tit;
  const lambaTit = aralik(p.lambaCizir, tg) && random(`b8lt${Math.floor(f / 2)}`) > 0.6 ? 0.55 : 1;
  const lamba = kf1(p.lamba, tg, 0) * lambaTit;
  const kapi = kf1(p.kapi, tg, 0);
  const K = (p.kar?.[view] ?? {}) as Prm;
  // B8 P2: nah işareti (a: adım, yer: sağ elin dayanağı ve ölçeği); Ece'nin rig kolları ellere bağlanır
  const nahA = kf1(p.nahA, tg, -1);
  const nahYer = kf(p.nahYer?.[view], tg, [540, 1200, 1]);
  const nahVar = nahA > 0.001 && !!p.nahYer?.[view];
  const darbe = kf1(p.darbe, tg, 0);
  const nahTit: [number, number] = [darbe * 10 * Math.sin(tg * 90), darbe * 8 * Math.cos(tg * 77)];
  let eceQ = K.ece as Prm | undefined;
  if (view === "kasa" && p.eceKasaAra && !aralik(p.eceKasaAra, tg)) eceQ = undefined;
  // B8 (yeni) P1 (opt-in): kasa görünümünde Ece'nin yerine ensesi/omzu (OTS); tezgah görünümünde Sabri'nin ensesi
  const eceSirt = view === "kasa" && p.eceSirt && aralik(p.eceSirtAra ?? [[-99, 99]], tg) ? kf(p.eceSirt, tg, [200, 1250, 1]) : null;
  if (eceSirt) eceQ = undefined;
  const sabriSirt = view === "tezgah" && p.sabriSirt && aralik(p.sabriSirtAra ?? [[-99, 99]], tg) ? kf(p.sabriSirt, tg, [950, 950, 1]) : null;
  const nahIleri = view === "nah" ? p.nahIleriIns ?? p.nahIleri ?? 0.55 : p.nahIleri ?? 0.55;
  if (eceQ && nahVar && view !== "nah") {
    const g = nahGeo(nahA, nahYer[0] + nahTit[0], nahYer[1] + nahTit[1], nahYer[2], nahIleri);
    eceQ = { ...eceQ, elL: [[0, g.sagBilek[0], g.sagBilek[1]]], elR: [[0, g.solBilek[0], g.solBilek[1]]], elLara: [[-99, 99]], elRara: [[-99, 99]] };
  }
  const nahEl = nahVar && view !== "nah" ? <SVG><NahEller a={nahA} x={nahYer[0]} y={nahYer[1]} s={nahYer[2]} ileri={nahIleri} darbe={darbe} titre={nahTit} /></SVG> : null;
  const ece = eceQ ? karakter(eceQ.id ?? "ece_sivil", eceQ, tg, f, fps, t0f) : null;
  const sabri = K.sabri ? karakter("sabri", K.sabri, tg, f, fps, t0f) : null;
  // B8 (yeni) P1: Mert (kasa görünümü, Sabri'nin sağında), depo kapısı + kolu, anime anı, masa vuruşu sarsıntısı
  const mert = K.mert ? karakter("mert724", K.mert, tg, f, fps, t0f) : null;
  // B8 (yeni) P4: kaçan kadın (yan: depodan fırlar; reyon: raflar arasında düşer)
  const kadin = K.kadin ? karakter("kacan724", K.kadin, tg, f, fps, t0f) : null;
  const depoAcik = p.depo ? kf1(p.depo, tg, 0) : undefined;
  const depoKol = kf1(p.depoKol, tg, 0);
  const anime = kf1(p.anime?.[view], tg, 0), animeYarim = kf1(p.animeYarim?.[view], tg, 0);
  const animeMerkez = kf(p.animeMerkez?.[view], tg, [540, 800]);
  const saat = basamak<string>(p.saat, tg, "19:07");
  // B9 P2: duvar TV'si yayın akışı (sahne zamanı): jen (jenerik), sp (spiker), term [t0, t1] (termal görüntü)
  const tvY = p.tvYayin as Prm | undefined;
  const tvDurum: number[] | undefined = tvY ? (tvY.kapat !== undefined && tg >= tvY.kapat ? [4, tg - tvY.kapat] : tg < tvY.jen ? [0, tg] : tg < tvY.sp ? [1, tg - tvY.jen] : tvY.term && tg >= tvY.term[0] && tg < tvY.term[1] ? [3, tg - tvY.term[0]] : [2, tg - tvY.sp]) : undefined;

  let sahne: React.ReactNode = null;
  if (view === "dis") {
    // karşıdan cephe; Ece vitrin ışığına karşı siluet, gölgesi kaldırımda bize doğru uzar
    const q = K.ece as Prm | undefined;
    const [ex, ey, es] = kf(q?.yer, tg, [540, 2400, 1000]);
    sahne = (
      <>
        <SVG><Market724DisBG frame={f} doorOpen={kapi} flor={flor} sensor={aralik(p.sensor, tg)} /><Market724DisZemin flor={flor} op={kapi} />
          {q ? <path d={`M ${ex - es * 0.09} ${ey} L ${ex + es * 0.09} ${ey} L ${ex + es * 0.22} ${ey + es * 0.7} L ${ex - es * 0.12} ${ey + es * 0.7} Z`} fill="#05060a" opacity={0.5} filter="url(#b8gb10)" /> : null}
        </SVG>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, filter: "brightness(0.13) saturate(0.3) drop-shadow(0 0 2.5px rgba(200,225,255,0.75))" }}>{kar(ece)}</div>
      </>
    );
  } else if (view === "kapi" || view === "tezgah") {
    const dis = aralik(p.disarida, tg) && view === "kapi";
    const op = view === "tezgah" ? 0 : kapi;
    const sl = 250 * 0.96 * op;
    const sens = aralik(p.sensor, tg);
    sahne = (
      <>
        <SVG>
          <Market724BG view="kapi" frame={f} doorOpen={op} saat={saat} iz={0} turb={0} yagmur={0.4} />
          {/* kapı aralığının dibi: dışarının kaldırımı (iç duvar rengi görünmesin) */}
          <rect x={300} y={1186} width={500} height={66} fill="#1c222a" />
          {sens ? <circle cx={606} cy={571} r={16} fill="#ff3020" opacity={0.35} filter="url(#b8gb6)" /> : null}
        </SVG>
        {dis ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, filter: "brightness(0.9) saturate(0.92)" }}>{kar(ece)}</div> : null}
        {dis ? (
          <SVG>
            {/* Ece camın ardındayken: kanatların camı, çerçeveler ve yansımalar ÖNÜNDE */}
            {[[300 - sl, 550 - sl], [550 + sl, 800 + sl]].map(([a, b], i) => (
              <g key={i}>
                <rect x={a} y={612} width={b - a} height={638} fill="#a8c4d8" opacity={0.2} stroke="#8a9298" strokeWidth={10} />
                <rect x={a + 14} y={918} width={b - a - 28} height={18} fill="#eef4f6" opacity={0.85} />
                {i === 1 ? <text x={(a + b) / 2} y={892} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={34} fill="#e8eef2" opacity={0.9}>GİRİŞ</text> : null}
                {i === 0 ? <text x={(a + b) / 2} y={892} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={26} fill="#e8eef2" opacity={0.8}>İTMEYİNİZ</text> : null}
              </g>
            ))}
            {[0, 300, 800, 1080].map((x) => <rect key={x} x={x - 9} y={420} width={18} height={830} fill="#9aa2a8" />)}
            <rect x={0} y={596} width={1080} height={18} fill="#9aa2a8" />
            {/* camda kayan floresan yansıması (ikincil hareket) */}
            {[0, 1].map((i) => <path key={i} d={`M ${(tg * 40 + i * 520) % 1300 - 200} 420 l 160 760`} stroke="#ffffff" strokeWidth={26} opacity={0.05} />)}
          </SVG>
        ) : null}
        {!dis && view === "kapi" ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>{kar(ece)}</div> : null}
        {view === "tezgah" ? <SVG><AnimeArka v={anime} tg={tg} cx={animeMerkez[0]} cy={animeMerkez[1]} yarim={animeYarim} /></SVG> : null}
        {view === "tezgah" && ece ? ece.govde : null}
        <SVG>
          {view === "kapi" ? <Market724FG view="kapi" frame={f} doorOpen={op} saat={saat} iz={0} turb={0} /> : <TezgahOn p={p} tg={tg} lamba={lamba} />}
        </SVG>
        {/* tezgah: kollar ve eller tezgâhın ÜSTÜNDE (gövde tezgâhın arkasında kalır) */}
        {view === "tezgah" && ece ? ece.on : null}
        {view === "tezgah" ? <SVG><AnimeOn v={anime} tg={tg} cx={animeMerkez[0]} cy={animeMerkez[1]} r={270} sag={animeYarim > 0.5} /></SVG> : null}
        {sabriSirt ? <OnPlan><SirtSabri x={sabriSirt[0]} y={sabriSirt[1]} s={sabriSirt[2]} /></OnPlan> : null}
      </>
    );
  } else if (view === "yan") {
    // B8 (yeni) P1: tezgâhın yan açısı: Ece solda (önde), Sabri sağda (tezgâhın arkasında), depo kapısı arkada kadraj içinde
    const acik = depoAcik ?? 0;
    const sil = kf1(p.mertSil, tg, 0);
    const klip = aralik(p.mertKlip, tg);
    const ustY = yanTezgahUst(0.7);
    const bosluk = yanKapiBosluk().map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(", ");
    sahne = (
      <>
        <SVG><Market724YanBG frame={f} acik={acik} kol={depoKol} saat={saat} fl={flor} levha={p.levha ? kf1(p.levha, tg, 0) : 0} kapiAlt={p.kapiAlt ? kf(p.kapiAlt, tg, [0, -1, 0.2, -1, 0, 1]) : undefined} tv={tvDurum} levhaDy={p.levhaDy ? kf1(p.levhaDy, tg, 0) : 0} kanatTit={p.kanatTit ? kf1(p.kanatTit, tg, 0) : 0} /></SVG>
        {mert ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: klip ? `polygon(${bosluk})` : undefined,
            filter: sil > 0.01 ? `brightness(${(1 - 0.9 * sil).toFixed(3)}) saturate(${(1 - 0.7 * sil).toFixed(3)}) drop-shadow(0 0 ${(4 * sil).toFixed(1)}px rgba(255,214,150,${(0.9 * sil).toFixed(2)}))` : undefined }}>
            {mert.govde}{mert.on}
          </div>
        ) : null}
        {kadin ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>{kadin.govde}{kadin.on}</div> : null}
        {sabri ? sabri.govde : null}
        {ece && p.eceArkada ? ece.govde : null}
        <SVG><Market724YanTezgah sars={sars} frame={f} /></SVG>
        {sabri ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: `polygon(-600px -400px, 1680px -400px, 1680px ${ustY + 4}px, -600px ${ustY + 4}px)` }}>{sabri.on}</div> : null}
        {ece && p.eceArkada ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: `polygon(-600px -400px, 1680px -400px, 1680px ${ustY + 4}px, -600px ${ustY + 4}px)` }}>{ece.on}</div> : null}
        {ece && !p.eceArkada ? ece.govde : null}
        {ece && !p.eceArkada ? ece.on : null}
        {p.ayakkabi && tg >= p.ayakkabi[0][0] ? (() => {
          // B9 P1 kanca: [t, X, Z, yaw°, ezik]; iz: sürüklenme izinin başı [X, Z]
          const [ax, az, ayw, aez] = kf(p.ayakkabi, tg, [0, 0, 0, 0]);
          return <SVG><YanAyakkabi X={ax} Z={az} yaw={ayw} ezik={aez} iz={p.ayakkabiIz} isik={kf(p.kapiAlt, tg, [0])[0]} /></SVG>;
        })() : null}
        {kf1(p.toz, tg, 0) > 0.01 ? <SVG>{new Array(14).fill(0).map((_, i) => { const u = kf1(p.toz, tg, 0); const [kx, ky] = YAN_KAPI; return <circle key={i} cx={kx - 120 + (i * 37) % 240 + 60 * u * Math.sin(i)} cy={ky + 260 - (i * 53) % 520 - 80 * u} r={14 + (i % 5) * 7} fill="#e8d8b8" opacity={0.35 * (1 - u)} />; })}</SVG> : null}
      </>
    );
  } else if (view === "tv" && tvDurum) {
    // B9 P2: duvar televizyonu yakın plan; spiker rig'i ekran koordinatında (960×540), dudak senkronu sahne zamanından
    const sp = K.spiker ? karakter("spiker", K.spiker, tg, f, fps, t0f) : null;
    sahne = <TvEkran mod={tvDurum[0]} tt={tvDurum[1]} f={f} tg={tg} spiker={sp ? <>{sp.govde}{sp.on}</> : null} />;
  } else if (view === "tepe") {
    // B8 (yeni) P4: raflar arası koridor TEPEDEN (kuşbakışı): karo zemin, iki yanda rafların üstü, floresan; yerde kadın
    sahne = (
      <>
        <SVG>
          <defs><radialGradient id="b8tpI" gradientUnits="userSpaceOnUse" cx={540} cy={900} r={1100}><stop offset="0" stopColor="#ffffff" stopOpacity={0.35 * flor} /><stop offset="1" stopColor="#ffffff" stopOpacity={0} /></radialGradient></defs>
          <rect x={-600} y={-400} width={2280} height={2720} fill="#c9cdce" />
          {new Array(16).fill(0).map((_, i) => <path key={`v${i}`} d={`M ${-600 + i * 150} -400 V 2320`} stroke="#b4b8b9" strokeWidth={4} />)}
          {new Array(20).fill(0).map((_, i) => <path key={`h${i}`} d={`M -600 ${-400 + i * 150} H 1680`} stroke="#b4b8b9" strokeWidth={4} />)}
          {/* rafların üstü (sol/sağ): koyu metal + ürünlerin üst yüzleri */}
          {[-1, 1].map((s) => {
            const x0 = s < 0 ? -600 : 820, w = s < 0 ? 860 : 860;
            return (
              <g key={s}>
                <rect x={x0} y={-400} width={w} height={2720} fill="#3a3e44" />
                {new Array(26).fill(0).map((_, i) => new Array(3).fill(0).map((__, j) => (
                  <rect key={`${i}_${j}`} x={(s < 0 ? 40 : 860) + j * 70} y={-380 + i * 105} width={60} height={92} rx={6}
                    fill={["#d8402a", "#2a7ad8", "#f2c830", "#3ab86a", "#e8e0d0", "#a83ad8", "#f28a2a"][(i * 3 + j * 5 + (s < 0 ? 0 : 2)) % 7]} opacity={0.9} />
                )))}
                <rect x={s < 0 ? 252 : 820} y={-400} width={8} height={2720} fill="#c8ccd0" />
              </g>
            );
          })}
          <rect x={-600} y={-400} width={2280} height={2720} fill="url(#b8tpI)" />
          {/* yere saçılan ürünler */}
          {(p.dusenTepe ?? []).filter((d: number[]) => tg >= d[0]).map((d: number[], i: number) => {
            const u = Math.min(1, (tg - d[0]) / 0.3);
            return <rect key={i} x={d[1] - 30 + d[3] * (1 - u)} y={d[2] - 40} width={60} height={82} rx={8} fill={["#d8402a", "#2a7ad8", "#f2c830", "#3ab86a"][i % 4]} stroke="#2b1d1a" strokeWidth={4} transform={`rotate(${d[4] * u} ${d[1]} ${d[2]})`} />;
          })}
          {/* kadının yerdeki gölgesi */}
          {kadin && p.tepeGolge ? <ellipse cx={p.tepeGolge[0]} cy={p.tepeGolge[1]} rx={p.tepeGolge[2]} ry={p.tepeGolge[3]} fill="#000" opacity={0.25} transform={`rotate(${p.tepeGolge[4] ?? 0} ${p.tepeGolge[0]} ${p.tepeGolge[1]})`} /> : null}
        </SVG>
        {kadin ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>{kadin.govde}{kadin.on}</div> : null}
      </>
    );
  } else if (view === "reyon") {
    // B8 (yeni) P4: raflar arası koridor (kasadan ön cama doğru); iki yanda ürün rafları, floresan, parlak karo zemin
    const VX = 540, VY = p.reyonUfuk ?? 820;
    const raf = (s: number) => {
      const x0 = s < 0 ? -40 : 1120, x1 = s < 0 ? 380 : 700;
      const kat = [0, 1, 2, 3, 4, 5];
      const yUst = (x: number) => VY - (VY - 120) * Math.abs((x - VX) / (x0 - VX));
      const yAlt = (x: number) => VY + (1900 - VY) * Math.abs((x - VX) / (x0 - VX));
      return (
        <g>
          <path d={`M ${x0} ${yUst(x0)} L ${x1} ${yUst(x1)} L ${x1} ${yAlt(x1)} L ${x0} ${yAlt(x0)} Z`} fill="#3a3e44" />
          {kat.map((k) => {
            const u = k / 6;
            const yA = (x: number) => yUst(x) + (yAlt(x) - yUst(x)) * u, yB = (x: number) => yUst(x) + (yAlt(x) - yUst(x)) * (u + 1 / 6);
            return (
              <g key={k}>
                {new Array(9).fill(0).map((_, i) => {
                  const xa = x0 + ((x1 - x0) * i) / 9, xb = x0 + ((x1 - x0) * (i + 0.85)) / 9;
                  const renk = ["#d8402a", "#2a7ad8", "#f2c830", "#3ab86a", "#e8e0d0", "#a83ad8", "#f28a2a"][(k * 3 + i * 5 + (s < 0 ? 0 : 2)) % 7];
                  return <path key={i} d={`M ${xa} ${yA(xa) + 6} L ${xb} ${yA(xb) + 6} L ${xb} ${yB(xb) - 4} L ${xa} ${yB(xa) - 4} Z`} fill={renk} opacity={0.88} />;
                })}
                <path d={`M ${x0} ${yB(x0)} L ${x1} ${yB(x1)}`} stroke="#c8ccd0" strokeWidth={8} />
              </g>
            );
          })}
          <path d={`M ${x0} ${yUst(x0)} L ${x1} ${yUst(x1)} L ${x1} ${yAlt(x1)} L ${x0} ${yAlt(x0)} Z`} fill="url(#b8ryG)" />
        </g>
      );
    };
    sahne = (
      <>
        <SVG>
          <defs>
            <linearGradient id="b8ryG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity={0.25} /><stop offset="1" stopColor="#000" stopOpacity={0.05} /></linearGradient>
            <linearGradient id="b8ryZ" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9aa0a4" /><stop offset="1" stopColor="#d8dcdc" /></linearGradient>
          </defs>
          <rect x={-600} y={-400} width={2280} height={2720} fill="#d6dadb" />
          {/* tavan + floresan şeritleri */}
          <path d={`M -600 -400 L 1680 -400 L ${VX + 160} ${VY - 280} L ${VX - 160} ${VY - 280} Z`} fill="#e8eaea" />
          {[-1, 1].map((s) => <path key={s} d={`M ${VX + s * 300} -400 L ${VX + s * 40} ${VY - 280} L ${VX + s * 60} ${VY - 280} L ${VX + s * 420} -400 Z`} fill="#ffffff" opacity={flor} />)}
          {/* koridor sonu: ön cam (gece), otomatik kapı */}
          <rect x={VX - 160} y={VY - 280} width={320} height={380} fill="#1a2230" />
          <rect x={VX - 60} y={VY - 230} width={120} height={330} fill="#24304a" stroke="#9aa2a8" strokeWidth={6} />
          {/* zemin karoları */}
          <path d={`M -600 2320 L 1680 2320 L ${VX + 160} ${VY + 100} L ${VX - 160} ${VY + 100} Z`} fill="url(#b8ryZ)" />
          {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${VX - 160 + i * 40} ${VY + 100} L ${-600 + i * 285} 2320`} stroke="#b8bcbe" strokeWidth={3} />)}
          {new Array(7).fill(0).map((_, i) => { const y = VY + 100 + (1820 - VY) * Math.pow(i / 7, 1.8); return <path key={i} d={`M -600 ${y} L 1680 ${y}`} stroke="#b8bcbe" strokeWidth={3} />; })}
          <path d={`M ${VX - 40} ${VY + 110} L ${VX - 260} 1920 L ${VX + 260} 1920 L ${VX + 40} ${VY + 110} Z`} fill="#ffffff" opacity={0.18 * flor} />
          {raf(-1)}
          {raf(1)}
          {/* yere düşen ürünler (P4: kadın rafa çarpınca) */}
          {(p.dusen ?? []).filter((d: number[]) => tg >= d[0]).map((d: number[], i: number) => {
            const u = Math.min(1, (tg - d[0]) / 0.35);
            return <rect key={i} x={d[1] - 22} y={d[2] - 300 * (1 - u) * (1 - u) - 30} width={44} height={60} rx={6} fill={d[3] ? "#d8402a" : "#2a7ad8"} stroke="#2b1d1a" strokeWidth={4} transform={`rotate(${d[4] * u} ${d[1]} ${d[2]})`} />;
          })}
        </SVG>
        {kadin ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>{kadin.govde}{kadin.on}</div> : null}
      </>
    );
  } else if (view === "kasa") {
    const bx = kf1(p.blok, tg, 560), gx = kf1(p.gazete, tg, 640);
    const blokVar = bx > -100;
    // B8 P2: 4. duvar odağı (arka plan bulanır, kararır; Ece önde keskin)
    const odak = kf1(p.odak, tg, 0);
    const kalemX = kf(p.kalemMasa, tg, [-999, 0]);
    sahne = (
      <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, filter: odak > 0.01 ? `blur(${(odak * 7).toFixed(2)}px) brightness(${(1 - 0.32 * odak).toFixed(3)}) saturate(${(1 - 0.3 * odak).toFixed(3)})` : undefined }}>
        <SVG><Market724BG view="kasa" frame={f} doorOpen={0} saat={saat} iz={0} turb={0} yagmur={0.5} depoAcik={depoAcik} />
          {depoAcik !== undefined ? <DepoKol acik={depoAcik} kol={depoKol} /> : null}
        </SVG>
        {mert && p.mertGolge && (depoAcik ?? 0) > 0.3 ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${p.mertGolge[0]}px, ${p.mertGolge[1]}px)`, filter: "brightness(0) blur(4px)", opacity: p.mertGolge[2] ?? 0.28 }}>{mert.govde}</div> : null}
        {sabri ? sabri.govde : null}
        {anime > 0.005 ? <SVG><AnimeArka v={anime} tg={tg} cx={animeMerkez[0]} cy={animeMerkez[1]} /></SVG> : null}
        {mert ? mert.govde : null}
        {ece && p.eceArkada ? ece.govde : null}
        <SVG>
          <Market724FG view="kasa" frame={f} doorOpen={0} saat={saat} iz={0} turb={0} />
          {/* tezgâhın üstü (bankonun üst tablası, hafif üstten): gazete, sipariş fişi bloğu, kâğıt */}
          {gx > -100 ? <g><path d={`M ${gx - 120} 1446 L ${gx + 120} 1446 L ${gx + 110} 1428 L ${gx - 108} 1428 Z`} fill="#d8d4cc" stroke="#6a665e" strokeWidth={3} /><path d={`M ${gx - 90} 1437 H ${gx + 80}`} stroke="#8a867e" strokeWidth={3} /></g> : null}
          {blokVar ? <g><path d={`M ${bx - 92} 1447 L ${bx + 92} 1447 L ${bx + 82} 1428 L ${bx - 82} 1428 Z`} fill="#f7f1de" stroke="#a89c78" strokeWidth={3} /><path d={`M ${bx - 80} 1432 H ${bx + 80}`} stroke="#b83a26" strokeWidth={4} /></g> : null}
          <Lamba v={lamba} />
        </SVG>
        {/* kollar ve eller tezgâhın üstünde (banko ön panelinin altına taşmasın) */}
        {sabri ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: "polygon(-600px -400px, 1680px -400px, 1680px 1448px, -600px 1448px)" }}>{sabri.on}</div> : null}
        {mert ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: "polygon(-600px -400px, 1680px -400px, 1680px 1448px, -600px 1448px)" }}>{mert.on}</div> : null}
        {ece && p.eceArkada ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: "polygon(-600px -400px, 1680px -400px, 1680px 1448px, -600px 1448px)" }}>{ece.on}</div> : null}
        {anime > 0.005 ? <SVG><AnimeOn v={anime} tg={tg} cx={animeMerkez[0]} cy={animeMerkez[1]} r={230} /></SVG> : null}
        {/* B8 P2: Sabri'nin bıraktığı kalem tezgâhta (düşüş: y 0..1) */}
        {kalemX[0] > -900 ? <SVG><g transform={`translate(${kalemX[0]} ${1438 - 40 * (1 - kalemX[1])}) rotate(${-14 + 30 * (1 - kalemX[1])})`}><rect x={-62} y={-5} width={124} height={10} rx={5} fill="#f4f4f2" stroke={O} strokeWidth={3} /><rect x={42} y={-6} width={22} height={12} rx={4} fill="#2a4aa8" /><path d="M -62 0 L -76 0" stroke="#9aa0a6" strokeWidth={6} strokeLinecap="round" /></g></SVG> : null}
      </div>
        {eceSirt ? <OnPlan karanlik={0.82}><SirtEce x={eceSirt[0]} y={eceSirt[1]} s={eceSirt[2]} /></OnPlan> : null}
        {/* B8 P2: Ece önde (müşteri tarafı, kameraya yakın) */}
        {ece && !p.eceArkada ? ece.govde : null}
        {ece && !p.eceArkada ? ece.on : null}
        {nahEl}
      </>
    );
  } else if (view === "nah") {
    // el yakın planı: Ece'nin göğsü (hardal kazak) önünde iki el; kamera seyircinin yerinde
    sahne = (
      <SVG>
        <defs>
          <radialGradient id="b8nahIsik" gradientUnits="userSpaceOnUse" cx={560} cy={820} r={1100}><stop offset="0" stopColor="#d89a34" /><stop offset="0.7" stopColor="#a8741a" /><stop offset="1" stopColor="#6a4810" /></radialGradient>
          <filter id="b8nahBlur"><feGaussianBlur stdDeviation="5" /></filter>
        </defs>
        <g filter="url(#b8nahBlur)">
          <rect x={-600} y={-400} width={2280} height={2720} fill="url(#b8nahIsik)" />
          {/* örgü dokusu (dikey fitiller) */}
          {new Array(44).fill(0).map((_, i) => <path key={i} d={`M ${-560 + i * 52} -400 V 2320`} stroke="#9a6814" strokeWidth={9} opacity={0.35} />)}
          {/* boyun ve çene (üstte), at kuyruğu (sağ omuzda) */}
          <path d="M 330 -400 L 330 40 Q 540 160 750 40 L 750 -400 Z" fill="#dcac88" />
          <path d="M 300 60 Q 540 200 780 60" stroke="#a8741a" strokeWidth={34} fill="none" />
          <path d="M 900 -400 Q 1010 200 940 760 Q 920 860 880 900" stroke="#3a2418" strokeWidth={120} fill="none" strokeLinecap="round" />
          <rect x={-600} y={-400} width={2280} height={2720} fill="#1a0e04" opacity={0.3} />
        </g>
        <NahEller a={nahA} x={nahYer[0]} y={nahYer[1]} s={nahYer[2]} ileri={nahIleri} darbe={darbe} titre={nahTit}
          kollar={{ sagDirsek: [nahYer[0] - 620, nahYer[1] - 900], solDirsek: [nahYer[0] + 760, nahYer[1] + 900], sagDirsek3: [-700, nahYer[1] - 300], solDirsek3: [nahYer[0] + 300, 2300] }} />
      </SVG>
    );
  } else if (view === "kagit") {
    const [ux, uy, uh] = kfLin(p.uc, tg, [700, -400, 1]);
    const elVar = aralik(p.elAra, tg);
    const ek = kf1(p.ekK, tg, 0);
    sahne = (
      <SVG>
        {/* tezgâh yüzeyi (laminat), kenarda bankonun kırmızı dudağı */}
        <rect x={-600} y={-400} width={2280} height={2720} fill="#e6e1d4" />
        {new Array(40).fill(0).map((_, i) => <path key={i} d={`M -600 ${-380 + i * 70 + (i % 3) * 9} H 1680`} stroke="#ddd6c6" strokeWidth={2} opacity={0.7} />)}
        <rect x={-600} y={1720} width={2280} height={40} fill="#f4f2ec" />
        <rect x={-600} y={1760} width={2280} height={600} fill="#c63c22" />
        <rect x={-600} y={1760} width={2280} height={18} fill="#000" opacity={0.25} />
        {/* tezgâhta: sakız standının köşesi (sağ üst), kart makinesi (sol üst) */}
        <rect x={1010} y={-120} width={260} height={330} rx={10} fill="#e8e8e0" stroke="#5a4a40" strokeWidth={5} />
        {[0, 1, 2].map((i) => <rect key={i} x={1026 + i * 80} y={-100} width={66} height={290} fill={["#e8a628", "#2f9e5a", "#e86a9a"][i]} />)}
        <g transform="rotate(-8 -40 160)"><rect x={-150} y={60} width={150} height={220} rx={18} fill="#1a1c20" stroke="#0a0b0d" strokeWidth={5} /><rect x={-128} y={84} width={106} height={62} fill="#3a6aa8" /></g>
        <g transform="rotate(-2.5 540 915)">
          <Kagit p={p} tg={tg} />
        </g>
        {/* Ece'nin parmak uçları alt kenarda (tezgâhı kavrar; ürpertide kıvrılır) */}
        {ek > 0.01 ? [250, 830].map((hx, k) => (
          <g key={k} transform={`translate(${hx} ${1790 - 40 * ek})`}>
            {[-54, -18, 18, 54].map((dx, i) => <rect key={i} x={dx - 16} y={-30 + Math.abs(dx) * 0.25 + 12 * (1 - ek)} width={32} height={90} rx={16} fill="#f0c8a8" stroke={O} strokeWidth={4} />)}
            <rect x={-90} y={40} width={180} height={140} fill="#c8902a" stroke={O} strokeWidth={4} />
          </g>
        )) : null}
        {/* el + kalem (gölgesi lambanın tersine, sağ-alta) */}
        {elVar ? <g transform={`translate(${26 + 26 * uh} ${30 + 30 * uh})`}><KalemEl x={ux} y={uy} h={uh} golge /></g> : null}
        {elVar ? <g transform={`translate(${-6 * uh} ${-10 * uh})`}><KalemEl x={ux} y={uy} h={uh} /></g> : null}
      </SVG>
    );
  }

  // ışık katmanları (görünüme göre): floresan kararması (multiply), masa lambası sıcak havuzu (screen), gece notu
  const karart = 1 - flor;
  const lmb = lamba;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: camT(cx, cy, z * fxKamera(p.fx as Fx[] | undefined, view, tg), sx, sy) }}>
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <defs>
            <filter id="b8gb6"><feGaussianBlur stdDeviation="6" /></filter>
            <filter id="b8gb10"><feGaussianBlur stdDeviation="10" /></filter>
          </defs>
        </svg>
        {sahne}
        {/* floresan kararması: soğuk lacivert multiply (lamba havuzu bundan sonra eklenir, kararmaz) */}
        {view !== "dis" ? (
          <SVG blend="multiply">
            <rect x={-600} y={-400} width={2280} height={2720} fill="#5a6488" opacity={Math.min(0.85, karart * 1.1 + (view === "kagit" ? 0.18 * lmb : view === "kasa" ? 0.22 * lmb : 0.1 * lmb))} />
          </SVG>
        ) : null}
        {lmb > 0.01 && view === "kasa" ? (
          <SVG blend="multiply">
            <defs>
              <linearGradient id="b8kt" gradientUnits="userSpaceOnUse" x1={0} y1={300} x2={0} y2={1250}><stop offset="0" stopColor="#3a3c5c" stopOpacity={0.75 * lmb} /><stop offset="0.7" stopColor="#6a6a88" stopOpacity={0.3 * lmb} /><stop offset="1" stopColor="#ffffff" stopOpacity={0} /></linearGradient>
            </defs>
            <rect x={-600} y={-400} width={2280} height={2720} fill="url(#b8kt)" />
          </SVG>
        ) : null}
        {/* masa lambası: sıcak havuz + yüzlere alttan dolgu */}
        {lmb > 0.01 && view === "kasa" ? (
          <SVG blend="screen">
            <defs>
              <radialGradient id="b8lk1" gradientUnits="userSpaceOnUse" cx={480} cy={1440} r={330}><stop offset="0" stopColor="#ffcf80" stopOpacity={0.6 * lmb} /><stop offset="1" stopColor="#ffcf80" stopOpacity={0} /></radialGradient>
              <radialGradient id="b8lk2" gradientUnits="userSpaceOnUse" cx={510} cy={1230} r={420}><stop offset="0" stopColor="#ff9a4a" stopOpacity={0.5 * lmb} /><stop offset="0.6" stopColor="#ff8a40" stopOpacity={0.18 * lmb} /><stop offset="1" stopColor="#ff8a40" stopOpacity={0} /></radialGradient>
            </defs>
            <rect x={-600} y={-400} width={2280} height={2720} fill="url(#b8lk1)" />
            <rect x={-600} y={-400} width={2280} height={2720} fill="url(#b8lk2)" />
            <ellipse cx={400} cy={1283} rx={34} ry={9} fill="#fff4d0" opacity={0.45 * lmb} filter="url(#b8gb6)" transform="rotate(38 400 1283)" />
          </SVG>
        ) : null}
        {view === "yan" ? (() => {
          // köşe: kapı kapalıyken depo köşesi loş (gizem); açılınca sıcak ışık odaya taşar (Sabri'nin sağı, Mert)
          const ac = Math.min(1, (depoAcik ?? 0) * 1.1);
          return (
            <>
              <SVG blend="multiply">
                {/* ışık havuzu: tezgâh ve yüzler aydınlık; tavan, ön zemin ve kenarlar düşer (gece marketi) */}
                <defs><radialGradient id="yanHavuz" gradientUnits="userSpaceOnUse" cx={470} cy={1000} r={760}><stop offset="0.35" stopColor="#ffffff" /><stop offset="1" stopColor="#6c7290" /></radialGradient></defs>
                <rect x={-600} y={-400} width={2280} height={2720} fill="url(#yanHavuz)" opacity={0.55} />
              </SVG>
              <SVG blend="multiply">
                <defs><radialGradient id="yanKose" gradientUnits="userSpaceOnUse" cx={YAN_KAPI[0] + 60} cy={YAN_KAPI[1] - 60} r={420}><stop offset="0" stopColor="#4a5060" stopOpacity={0.6 * (1 - Math.min(1, (depoAcik ?? 0) * 9))} /><stop offset="1" stopColor="#5a6070" stopOpacity={0} /></radialGradient></defs>
                <rect x={-600} y={-400} width={2280} height={2720} fill="url(#yanKose)" />
              </SVG>
              {p.kapiAlt && ac < 0.02 ? (() => {
                // B9: kapı altı ışığı karanlık köşede de parlasın (renk katmanlarından SONRA, ekran karışımı)
                const ka = kf(p.kapiAlt, tg, [0, -1, 0.2, -1, 0, 1]);
                const isk = ka[0];
                if (isk < 0.01) return null;
                const [a0, b0] = yanKapiBosluk();
                const X = (u: number) => a0[0] + (b0[0] - a0[0]) * (0.05 + 0.9 * u), Yy = (u: number) => a0[1] + (b0[1] - a0[1]) * (0.05 + 0.9 * u);
                const u0g = (p.kapiAltBas as number | undefined) ?? 0; // önünde duran karakterin bacaklarının sağından başla
                // ışıklı parçalar = gölgelerin (ayak + pati) tümleyeni
                const gol = kapiAltGolge(ka).filter((g) => g[2] > 0.5).sort((a, b) => a[0] - b[0]);
                const parca: number[][] = [];
                let u = 0;
                for (const [a, b] of gol) { if (a > u) parca.push([u, a]); u = Math.max(u, b); }
                if (u < 1) parca.push([u, 1]);
                for (const pc of parca) pc[0] = Math.max(pc[0], u0g);
                return (
                  <SVG blend="screen">
                    <defs><filter id="kaB" x="-20%" y="-300%" width="140%" height="700%"><feGaussianBlur stdDeviation="9" /></filter></defs>
                    {parca.map(([u0, u1], i) => u1 > u0 ? (
                      <g key={i}>
                        <path d={`M ${X(Math.max(0, u0))} ${Yy(Math.max(0, u0)) - 4} L ${X(Math.min(1, u1))} ${Yy(Math.min(1, u1)) - 4}`} stroke="#ffa040" strokeWidth={22} opacity={0.75 * isk} filter="url(#kaB)" />
                        <path d={`M ${X(Math.max(0, u0))} ${Yy(Math.max(0, u0)) - 3} L ${X(Math.min(1, u1))} ${Yy(Math.min(1, u1)) - 3}`} stroke="#ffe0a0" strokeWidth={4} opacity={0.9 * isk} />
                      </g>
                    ) : null)}
                  </SVG>
                );
              })() : null}
              {ac > 0.01 ? (
                <SVG blend="screen">
                  <defs><radialGradient id="yanSicak" gradientUnits="userSpaceOnUse" cx={YAN_KAPI[0]} cy={YAN_KAPI[1] + 40} r={560}><stop offset="0" stopColor="#ffb860" stopOpacity={0.42 * ac} /><stop offset="0.6" stopColor="#ff9a40" stopOpacity={0.12 * ac} /><stop offset="1" stopColor="#ff9a40" stopOpacity={0} /></radialGradient></defs>
                  <rect x={-600} y={-400} width={2280} height={2720} fill="url(#yanSicak)" />
                </SVG>
              ) : null}
            </>
          );
        })() : null}
        {lmb > 0.01 && view === "kagit" ? (
          <SVG blend="screen">
            <defs>
              <radialGradient id="b8lk3" gradientUnits="userSpaceOnUse" cx={420} cy={760} r={900}><stop offset="0" stopColor="#ffc878" stopOpacity={0.42 * lmb} /><stop offset="0.55" stopColor="#ffb060" stopOpacity={0.14 * lmb} /><stop offset="1" stopColor="#ffb060" stopOpacity={0} /></radialGradient>
            </defs>
            <rect x={-600} y={-400} width={2280} height={2720} fill="url(#b8lk3)" />
          </SVG>
        ) : null}
        {lmb > 0.01 && view === "tezgah" ? (
          <SVG blend="screen">
            <defs>
              <radialGradient id="b8lk4" gradientUnits="userSpaceOnUse" cx={760} cy={1500} r={700}><stop offset="0" stopColor="#ffc070" stopOpacity={0.32 * lmb} /><stop offset="1" stopColor="#ffc070" stopOpacity={0} /></radialGradient>
            </defs>
            <rect x={-600} y={-400} width={2280} height={2720} fill="url(#b8lk4)" />
          </SVG>
        ) : null}
        <AnimeFxDunya fx={p.fx as Fx[] | undefined} view={view} tg={tg} f={f} />
      </AbsoluteFill>
      {/* renk: dışarıda soğuk gece; içeride floresan yeşilimsi-soğuk, lamba yanınca alt sıcak; vinyet */}
      {view === "dis" ? (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(120,140,200,0.9) 0%, rgba(200,205,230,0.9) 55%, rgba(150,150,190,0.9) 100%)", mixBlendMode: "multiply", opacity: 0.45 }} />
      ) : (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(214,232,236,0.9) 0%, rgba(236,240,236,0.9) 50%, rgba(200,206,226,0.9) 100%)", mixBlendMode: "multiply", opacity: 0.3 }} />
      )}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 50% 44%, rgba(0,0,0,0) ${view === "kagit" ? 50 : 55}%, rgba(8,10,24,${0.5 + 0.25 * karart}) 100%)` }} />
      <AnimeFxEkran fx={p.fx as Fx[] | undefined} view={view} tg={tg} f={f} />
      {p.karart ? <AbsoluteFill style={{ backgroundColor: "#000", opacity: kf1(p.karart, tg, 0) }} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ tezgah: Sabri'nin tarafından tezgâhın üstü (önde) */
const TezgahOn: React.FC<{ p: Prm; tg: number; lamba: number }> = ({ p, tg, lamba }) => {
  const kv = kf1(p.kagitTz, tg, 0); // tezgahta kâğıt görünür mü (0..1)
  return (
    <g>
      {/* tezgâh üst tablası: uzak kenar (müşteri tarafı) y 1178 */}
      <defs>
        <linearGradient id="b8tz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8d2c2" /><stop offset="0.25" stopColor="#ece7da" /><stop offset="1" stopColor="#e2dccc" /></linearGradient>
      </defs>
      <path d="M -600 1178 L 1680 1178 L 1680 2320 L -600 2320 Z" fill="url(#b8tz)" />
      <path d="M -600 1178 H 1680" stroke="#ffffff" strokeWidth={5} opacity={0.8} />
      <path d="M -600 1172 H 1680" stroke="#8a7a68" strokeWidth={3} opacity={0.6} />
      {/* sol: sakız standının arkası + kart makinesi (Sabri'nin solu) */}
      <rect x={-20} y={1130} width={200} height={130} rx={8} fill="#e0e0d8" stroke="#5a4a40" strokeWidth={5} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-8 + i * 46} y={1110} width={38} height={36} rx={4} fill={["#e8a628", "#2f9e5a", "#e86a9a", "#2f6fd0"][i]} />)}
      <rect x={210} y={1200} width={86} height={120} rx={12} fill="#1a1c20" stroke="#0a0b0d" strokeWidth={4} transform="rotate(-6 253 1260)" />
      {/* sağ: yazar kasanın kasiyer yüzü (klavye) ve lambanın tabanı (Sabri'nin sağı) */}
      <path d="M 880 1500 L 1180 1470 L 1180 1760 L 900 1790 Z" fill="#2a2e34" stroke="#0a0b0d" strokeWidth={5} />
      {new Array(12).fill(0).map((_, i) => <rect key={i} x={915 + (i % 4) * 56} y={1530 + Math.floor(i / 4) * 64 - (i % 4) * 5} width={42} height={44} rx={6} fill="#4a4e56" />)}
      {/* masa lambası (Sabri'nin sağında; kadrajın sağ kenarı): taban, boyun, yeşil başlık kâğıda eğik */}
      <ellipse cx={1040} cy={1420} rx={90} ry={24} fill="#2a2a2e" stroke="#0e0e10" strokeWidth={5} />
      <path d="M 1040 1412 Q 1060 1250 1000 1150 Q 975 1112 930 1118" stroke="#2a2a2e" strokeWidth={16} fill="none" strokeLinecap="round" />
      <g transform="translate(915 1128) rotate(-28)">
        <path d="M -50 -30 L 50 -30 L 78 56 L -78 56 Z" fill="#2e5a4a" stroke="#0e1a16" strokeWidth={6} />
        <ellipse cx={0} cy={56} rx={78} ry={14} fill={lamba > 0.05 ? "#fff2c8" : "#3a3a30"} opacity={0.4 + 0.6 * lamba} stroke="#0e1a16" strokeWidth={4} />
      </g>
      {/* bulmacalı gazete (Sabri'nin önünde; R3'te soluna itilir) */}
      {kf1(p.gazeteTz, tg, 1) > -1 ? (() => {
        const gx = kf1(p.gazeteTz, tg, 0);
        return (
          <g transform={`translate(${520 + gx} 1560) rotate(4)`}>
            <path d="M -230 -70 L 230 -70 L 240 90 L -240 90 Z" fill="#dcd8ce" stroke="#6a665e" strokeWidth={4} />
            {new Array(6).fill(0).map((_, i) => <path key={i} d={`M -210 ${-48 + i * 22} H -20`} stroke="#8a867e" strokeWidth={5} />)}
            {new Array(5).fill(0).map((_, r) => new Array(6).fill(0).map((__, c) => <rect key={`${r}${c}`} x={20 + c * 32} y={-56 + r * 28} width={30} height={26} fill={(r * 3 + c) % 5 === 0 ? "#2a2a2a" : "#f4f2ea"} stroke="#5a5650" strokeWidth={2} />))}
          </g>
        );
      })() : null}
      {lamba > 0.05 ? <ellipse cx={600} cy={1420} rx={300} ry={110} fill="#ffd890" opacity={0.18 * lamba} /> : null}
      {/* tezgâhta TERS duran kâğıt (Ece'ye dönük): aynı çizim, uzaklıkla basık */}
      {kv > 0.01 ? (
        <g opacity={kv} transform="translate(540 1520) scale(0.52 0.2) rotate(180) rotate(-2.5) translate(-540 -915)">
          <Kagit p={p} tg={tg} golge={false} />
        </g>
      ) : null}
    </g>
  );
};

export const Insert18: React.FC<{ kind: Insert18Kind; dur: number; text?: string[] }> = ({ text }) => <B8Market text={text} />;
