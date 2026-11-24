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
import { sstep } from "./bocek";
import { karakter, type KarCiz } from "./Inserts16";

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
  const tA = p.titre?.[view] ?? 2;
  const sx = tA * (Math.sin(tg * 1.7) * 0.7 + Math.sin(tg * 3.1) * 0.3), sy = tA * (Math.sin(tg * 1.3 + 1) * 0.6 + Math.sin(tg * 2.7) * 0.4);
  // floresan: temel şiddet × titreme (cızırtı aralıklarında rastgele düşüşler)
  const titrer = aralik(p.cizir, tg);
  const tit = titrer ? (random(`b8fl${Math.floor(f / 2)}`) > 0.55 ? 0.35 + 0.3 * random(`b8fk${f}`) : 1) : 1;
  const flor = kf1(p.flor, tg, 1) * tit;
  const lambaTit = aralik(p.lambaCizir, tg) && random(`b8lt${Math.floor(f / 2)}`) > 0.6 ? 0.55 : 1;
  const lamba = kf1(p.lamba, tg, 0) * lambaTit;
  const kapi = kf1(p.kapi, tg, 0);
  const K = (p.kar?.[view] ?? {}) as Prm;
  const ece = K.ece ? karakter(K.ece.id ?? "ece_sivil", K.ece, tg, f, fps, t0f) : null;
  const sabri = K.sabri ? karakter("sabri", K.sabri, tg, f, fps, t0f) : null;
  const saat = basamak<string>(p.saat, tg, "19:07");

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
          <Market724BG view="kapi" frame={f} doorOpen={op} saat={saat} iz={0} turb={0} yagmur={0} />
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
        {view === "tezgah" && ece ? ece.govde : null}
        <SVG>
          {view === "kapi" ? <Market724FG view="kapi" frame={f} doorOpen={op} saat={saat} iz={0} turb={0} /> : <TezgahOn p={p} tg={tg} lamba={lamba} />}
        </SVG>
        {/* tezgah: kollar ve eller tezgâhın ÜSTÜNDE (gövde tezgâhın arkasında kalır) */}
        {view === "tezgah" && ece ? ece.on : null}
      </>
    );
  } else if (view === "kasa") {
    const bx = kf1(p.blok, tg, 560), gx = kf1(p.gazete, tg, 640);
    const blokVar = bx > -100;
    sahne = (
      <>
        <SVG><Market724BG view="kasa" frame={f} doorOpen={0} saat={saat} iz={0} turb={0} yagmur={0} /></SVG>
        {sabri ? sabri.govde : null}
        <SVG>
          <Market724FG view="kasa" frame={f} doorOpen={0} saat={saat} iz={0} turb={0} />
          {/* tezgâhın üstü (bankonun üst tablası, hafif üstten): gazete, sipariş fişi bloğu, kâğıt */}
          {gx > -100 ? <g><path d={`M ${gx - 120} 1446 L ${gx + 120} 1446 L ${gx + 110} 1428 L ${gx - 108} 1428 Z`} fill="#d8d4cc" stroke="#6a665e" strokeWidth={3} /><path d={`M ${gx - 90} 1437 H ${gx + 80}`} stroke="#8a867e" strokeWidth={3} /></g> : null}
          {blokVar ? <g><path d={`M ${bx - 92} 1447 L ${bx + 92} 1447 L ${bx + 82} 1428 L ${bx - 82} 1428 Z`} fill="#f7f1de" stroke="#a89c78" strokeWidth={3} /><path d={`M ${bx - 80} 1432 H ${bx + 80}`} stroke="#b83a26" strokeWidth={4} /></g> : null}
          <Lamba v={lamba} />
        </SVG>
        {/* kollar ve eller tezgâhın üstünde (banko ön panelinin altına taşmasın) */}
        {sabri ? <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: "polygon(-600px -400px, 1680px -400px, 1680px 1448px, -600px 1448px)" }}>{sabri.on}</div> : null}
      </>
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
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: camT(cx, cy, z, sx, sy) }}>
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
            <ellipse cx={455} cy={1292} rx={40} ry={18} fill="#fff4d0" opacity={0.55 * lmb} filter="url(#b8gb10)" />
          </SVG>
        ) : null}
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
      </AbsoluteFill>
      {/* renk: dışarıda soğuk gece; içeride floresan yeşilimsi-soğuk, lamba yanınca alt sıcak; vinyet */}
      {view === "dis" ? (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(120,140,200,0.9) 0%, rgba(200,205,230,0.9) 55%, rgba(150,150,190,0.9) 100%)", mixBlendMode: "multiply", opacity: 0.45 }} />
      ) : (
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(214,232,236,0.9) 0%, rgba(236,240,236,0.9) 50%, rgba(200,206,226,0.9) 100%)", mixBlendMode: "multiply", opacity: 0.3 }} />
      )}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 50% 44%, rgba(0,0,0,0) ${view === "kagit" ? 50 : 55}%, rgba(8,10,24,${0.5 + 0.25 * karart}) 100%)` }} />
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
