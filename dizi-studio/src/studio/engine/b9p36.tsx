/* =====================================================================================
 * 7/24 B9 · P3-P6 (Rüşvet, Kıskançlık, Para yiyen kadın, Bekçi): Inserts18 "b8_market" için ek görünümler ve katmanlar.
 *  Hepsi özgün çizim. Banknot: stilize kırmızı "200" (geometrik gül motifi; gerçek banknotun kopyası değil).
 *   para   : kapı altı, yer hizası yakın plan: sıcak ışık şeridinden banknotlar kayar, yığılır; ayak gölgeleri şeritte
 *   sise   : yerdeki su şişesi yakın plan (ağzına kadar dolu), arka planda Elif'in çıplak ayağı + spor ayakkabısı; odak kaydırma
 *   golge  : Elif'in yerdeki gölgesi: ayakları kıpırdamazken gölgedeki saçlar kendi kendine dalgalanır, parmaklar uzar
 *   saat   : duvar saati (kırmızı LED) 02:59 yakın plan
 *  yan görünüm katmanları: yerdeki banknotlar (kapı altından kayar, toplanır, yenir), düşen banknotlar, duvarda örümcek gölgesi
 * ===================================================================================== */
import React from "react";
import { random } from "remotion";
import { yanP, yanD } from "../sets/market724yan";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Prm = Record<string, any>;
const O = "#2b1d1a";
const ss = (a: number, b: number, t: number) => {
  const u = Math.min(1, Math.max(0, (t - a) / Math.max(1e-6, b - a)));
  return u * u * (3 - 2 * u);
};

/* ------------------------------------------------------------------ banknot deseni (yerel birim: 160 × 72, merkez 0,0) */
export const NotDesen: React.FC<{ ton?: number; isik?: number }> = ({ ton = 0, isik = 0 }) => (
  <g>
    <rect x={-80} y={-36} width={160} height={72} rx={4} fill={ton ? "#c02838" : "#d03644"} stroke={O} strokeWidth={3} />
    <rect x={-72} y={-28} width={144} height={56} rx={2} fill="none" stroke="#f2a6a2" strokeWidth={2} opacity={0.85} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M -70 ${-16 + i * 10} Q -35 ${-24 + i * 10} 0 ${-16 + i * 10} T 70 ${-16 + i * 10}`} stroke="#e8707a" strokeWidth={1.4} fill="none" opacity={0.7} />)}
    <circle cx={30} cy={0} r={20} fill="#b82232" stroke="#f6c0b8" strokeWidth={2.5} />
    <path d="M 30 -15 L 35 -5 L 45 0 L 35 5 L 30 15 L 25 5 L 15 0 L 25 -5 Z" fill="#f6c8c0" />
    <circle cx={30} cy={0} r={4} fill="#b82232" />
    <text x={-62} y={-8} fontSize={20} fontWeight={900} fontFamily="Arial, sans-serif" fill="#fde8e0">200</text>
    <text x={-62} y={22} fontSize={10} fontWeight={800} fontFamily="Arial, sans-serif" fill="#f6c0b8" letterSpacing={1}>İKİ YÜZ</text>
    <rect x={56} y={-28} width={6} height={56} fill="#e8c060" opacity={0.75} />
    {isik > 0 ? <rect x={-80} y={-36} width={160} height={72} rx={4} fill="#ffb860" opacity={0.35 * isik} /> : null}
  </g>
);

/* ------------------------------------------------------------------ PARA: kapı altı yer hizası yakın plan */
// izdüşüm: kamera yerden 0.12 m; zemin noktası (x, z) → ekran
const PF = 1300, PH = 0.12, UFUK = 760;
const pp = (x: number, z: number): [number, number] => [540 + (PF * x) / z, UFUK + (PF * PH) / z];
const KAPI_Z = 1.0;
/** paralar: [[tÇıkış, x, z, açı°, tAlınma(-1 yok)], ...] (x m, z m; kapı z = 1) */
export const ParaYakin: React.FC<{ p: Prm; tg: number; f: number; isik: number; ayak: number[] }> = ({ p, tg, f, isik, ayak }) => {
  const notlar = (p.paraYakin ?? []) as number[][];
  const [, gx, gw, , , gop = 1] = ayak;
  const yK = pp(0, KAPI_Z)[1];
  return (
    <g>
      <defs>
        <linearGradient id="pyZem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3e46" /><stop offset="1" stopColor="#6a707a" /></linearGradient>
        <radialGradient id="pyIsik" gradientUnits="userSpaceOnUse" cx={540} cy={yK} r={760} gradientTransform={`translate(0 ${yK}) scale(1 0.42) translate(0 ${-yK})`}><stop offset="0" stopColor="#ffb050" stopOpacity={0.75 * isik} /><stop offset="0.5" stopColor="#ff9040" stopOpacity={0.22 * isik} /><stop offset="1" stopColor="#ff9040" stopOpacity={0} /></radialGradient>
        <filter id="pyB"><feGaussianBlur stdDeviation="5" /></filter>
        <filter id="pyB2"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      {/* kapı (alt kısmı) + tekme sacı */}
      <rect x={-600} y={-400} width={2280} height={yK + 400 - 6} fill="#3c434c" />
      <rect x={-600} y={yK - 250} width={2280} height={238} fill="#56606a" />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M -600 ${yK - 240 + i * 40} H 1680`} stroke="#6a747e" strokeWidth={2} opacity={0.5} />)}
      <path d={`M -600 ${yK - 252} H 1680`} stroke="#2a3038" strokeWidth={5} />
      {/* çizikler, kir */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={`c${i}`} d={`M ${random(`pc${i}`) * 1080} ${yK - 200 + random(`pd${i}`) * 160} l ${30 + random(`pe${i}`) * 60} ${-4 + random(`pf${i}`) * 8}`} stroke="#8a949e" strokeWidth={2} opacity={0.4} />)}
      {/* zemin */}
      <rect x={-600} y={yK} width={2280} height={2320 - yK} fill="url(#pyZem)" />
      {[0.2, 0.3, 0.45, 0.7].map((z) => <path key={z} d={`M -600 ${pp(0, z)[1]} H 1680`} stroke="#2a2e36" strokeWidth={3} opacity={0.5} />)}
      {[-0.6, -0.3, 0, 0.3, 0.6].map((x) => { const a = pp(x, KAPI_Z), b = pp(x, 0.12); return <path key={x} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke="#2a2e36" strokeWidth={3} opacity={0.5} />; })}
      {/* kapı altı ışığı + zemine vuran sıcak havuz */}
      <rect x={-600} y={-400} width={2280} height={2720} fill="url(#pyIsik)" style={{ mixBlendMode: "screen" }} />
      <rect x={-600} y={yK - 7} width={2280} height={9} fill="#ffe2a8" opacity={0.95 * isik} />
      <rect x={-600} y={yK - 14} width={2280} height={22} fill="#ffb050" opacity={0.6 * isik} filter="url(#pyB)" />
      {/* ayak gölgeleri: şeritte iki koyu boşluk + zemine bize doğru uzanan gölge kamaları */}
      {gx >= 0 ? [-1, 1].map((s) => {
        const cxN = (gx - 0.5) * 1.6 + s * gw * 0.45;
        const a = pp(cxN - 0.05, KAPI_Z), b = pp(cxN + 0.05, KAPI_Z), c = pp(cxN + 0.11, 0.55), d = pp(cxN - 0.11, 0.55);
        return (
          <g key={s} opacity={gop}>
            <rect x={a[0]} y={yK - 16} width={b[0] - a[0]} height={26} fill="#0a0806" />
            <path d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${c[0]} ${c[1]} L ${d[0]} ${d[1]} Z`} fill="#0a0806" opacity={0.55} filter="url(#pyB2)" />
          </g>
        );
      }) : null}
      {/* ışıkta toz */}
      {new Array(16).fill(0).map((_, i) => {
        const u = (tg * 0.05 + random(`pt${i}`)) % 1;
        return <circle key={`t${i}`} cx={random(`px${i}`) * 1080 + 30 * Math.sin(tg * 0.7 + i)} cy={yK - 30 - u * 260} r={2 + random(`pr${i}`) * 3} fill="#ffd8a0" opacity={0.5 * isik * Math.sin(u * Math.PI)} />;
      })}
      {/* banknotlar (uzaktan yakına sırala) */}
      {notlar.map((n, i) => ({ n, i })).sort((A, B) => B.n[2] - A.n[2]).map(({ n, i }) => {
        const [t0, x, z, aci, tAl] = n;
        if (tg < t0 || (tAl > 0 && tg > tAl)) return null;
        const u = ss(t0, t0 + 0.55, tg);
        const zz = KAPI_Z + 0.06 + (z - KAPI_Z - 0.06) * u;   // kapının altından (biraz içeriden) çıkar
        const xx = x * (0.4 + 0.6 * u);
        const kalk = tAl > 0 ? ss(tAl - 0.3, tAl, tg) : 0;
        const r = ((aci * u) * Math.PI) / 180, cs = Math.cos(r), sn = Math.sin(r);
        const k = 0.155 / 160;
        const c = pp(xx, zz), pu = pp(xx + cs * k, zz + sn * k), pv = pp(xx - sn * k, zz - cs * k);
        const m = `matrix(${pu[0] - c[0]} ${pu[1] - c[1]} ${pv[0] - c[0]} ${pv[1] - c[1]} ${c[0]} ${c[1] - kalk * 300})`;
        // kapının altındayken (zz > 1) kapı kesiti üstünü örter: kırpma
        const gizli = zz > KAPI_Z;
        return (
          <g key={i} clipPath={gizli ? "url(#pyKirp)" : undefined} opacity={1 - kalk}>
            <g transform={m}><NotDesen ton={i % 2} isik={Math.max(0, 1 - (KAPI_Z - zz) * 3) * isik} /></g>
          </g>
        );
      })}
      {/* B9 P3: Elif'in eli (kırmızı oje, altın bileklik) soldan girer, banknotları süpürür: [[t, x, z, op]] */}
      {p.paraEl ? (() => {
        const k = p.paraEl as number[][];
        let v = k[0].slice(1);
        for (let i = 0; i < k.length - 1; i++) if (tg >= k[i][0] && tg < k[i + 1][0]) { const u = ss(k[i][0], k[i + 1][0], tg); v = k[i].slice(1).map((a, j) => a + (k[i + 1][j + 1] - a) * u); }
        if (tg >= k[k.length - 1][0]) v = k[k.length - 1].slice(1);
        const [x, z, op] = v;
        if (op < 0.01) return null;
        const c = pp(x, z), s = PF / z / 1000 * 0.11;
        return (
          <g opacity={op} transform={`translate(${c[0]} ${c[1] - 40 * s}) scale(${s})`}>
            <path d="M -1400 -60 Q -700 -120 -160 -70 L -150 90 Q -700 110 -1400 120 Z" fill="#f0c8a8" stroke={O} strokeWidth={8} />
            <rect x={-420} y={-96} width={60} height={210} rx={20} fill="#f2c850" stroke="#8a6a10" strokeWidth={6} />
            <ellipse cx={-80} cy={10} rx={150} ry={110} fill="#f0c8a8" stroke={O} strokeWidth={8} />
            {[-80, -25, 30, 80].map((y, i) => (
              <g key={i}>
                <path d={`M -20 ${y} Q 120 ${y - 10 + i * 6} 190 ${y + 6 + i * 4}`} stroke={O} strokeWidth={56} fill="none" strokeLinecap="round" />
                <path d={`M -20 ${y} Q 120 ${y - 10 + i * 6} 190 ${y + 6 + i * 4}`} stroke="#f0c8a8" strokeWidth={44} fill="none" strokeLinecap="round" />
                <ellipse cx={196} cy={y + 6 + i * 4} rx={22} ry={16} fill="#c8102e" stroke={O} strokeWidth={4} />
              </g>
            ))}
          </g>
        );
      })() : null}
      <defs><clipPath id="pyKirp"><rect x={-600} y={yK - 3} width={2280} height={2400} /></clipPath></defs>
      {/* ön planda sakız lekesi, toz (derinlik) */}
      <ellipse cx={180} cy={1760} rx={40} ry={12} fill="#2a2a2e" opacity={0.4} />
      <path d={`M 860 1690 l 60 8`} stroke="#9aa0a8" strokeWidth={3} opacity={0.4} />
      {f < -1 ? null : null}
    </g>
  );
};

/* ------------------------------------------------------------------ SİSE: yerdeki dolu su şişesi */
export const SiseYakin: React.FC<{ tg: number; odak: number; f: number }> = ({ tg, odak, f }) => {
  // odak 0: arka plan net, şişe flu; 1: şişe net, arka flu
  const bS = (1 - odak) * 9, bA = odak * 10;
  const nab = 0.5 + 0.5 * Math.sin(tg * 2.1);
  return (
    <g>
      <defs>
        <linearGradient id="ssZ" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a606c" /><stop offset="1" stopColor="#a8aeb8" /></linearGradient>
        <filter id="ssA" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={bA} /></filter>
        <filter id="ssS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={bS} /></filter>
        <linearGradient id="ssSu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7ab0d0" stopOpacity={0.75} /><stop offset="0.35" stopColor="#c8e8f8" stopOpacity={0.55} /><stop offset="1" stopColor="#5a90b8" stopOpacity={0.8} /></linearGradient>
      </defs>
      <rect x={-600} y={-400} width={2280} height={2720} fill="url(#ssZ)" />
      <g filter="url(#ssA)">
        {/* arka plan: zemin derzleri, rafın tabanı, Elif'in ayakları (biri çıplak, biri spor ayakkabı) + kırmızı etek ucu */}
        <rect x={-600} y={-400} width={2280} height={900} fill="#2a3040" />
        <rect x={-600} y={420} width={2280} height={80} fill="#c8402e" opacity={0.6} />
        {[0, 1, 2].map((i) => <path key={i} d={`M -600 ${560 + i * 160} H 1680`} stroke="#4a505a" strokeWidth={4} opacity={0.5} />)}
        <g transform={`translate(${700 + 2 * Math.sin(tg * 0.6)} 560)`}>
          <path d="M -40 -340 L -20 -30 L 40 -30 L 48 -340 Z" fill="#f0c8a8" stroke={O} strokeWidth={5} />
          <path d="M -30 -40 Q -60 30 30 40 Q 110 40 100 0 Q 70 -30 40 -30 Z" fill="#f0c8a8" stroke={O} strokeWidth={5} />
          <path d="M -10 -10 Q 30 20 80 8" stroke="#8a7a6a" strokeWidth={6} fill="none" opacity={0.5} />
          <path d="M 120 -340 L 130 -30 L 190 -30 L 200 -340 Z" fill="#f0c8a8" stroke={O} strokeWidth={5} />
          <path d="M 110 -40 Q 90 40 190 44 Q 280 44 260 0 Q 230 -36 190 -36 Z" fill="#f4f4f2" stroke={O} strokeWidth={5} />
          <path d="M -60 -420 L 230 -420 L 250 -330 L -80 -330 Z" fill="#c4162a" stroke={O} strokeWidth={5} />
        </g>
      </g>
      <g filter="url(#ssS)">
        {/* şişe (yere yakın, ön plan; hafif sola) */}
        <g transform="translate(400 1120)">
          <ellipse cx={0} cy={430} rx={150} ry={26} fill="#1a1e26" opacity={0.45} />
          <path d="M -120 -260 Q -120 -330 -60 -370 L -50 -470 L 50 -470 L 60 -370 Q 120 -330 120 -260 L 120 400 Q 120 430 90 430 L -90 430 Q -120 430 -120 400 Z" fill="url(#ssSu)" stroke={O} strokeWidth={7} />
          {/* ağzına kadar: menisküs boyun ağzında, bir damla kenarda */}
          <path d="M -50 -462 Q 0 -474 50 -462" stroke="#e8f8ff" strokeWidth={5} fill="none" />
          <path d={`M 48 -462 Q 58 ${-440 + 6 * nab} 52 ${-420 + 10 * nab}`} stroke="#bfe6fa" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.9} />
          {[-180, -60, 60, 180, 300].map((y) => <path key={y} d={`M -120 ${y} Q 0 ${y + 18} 120 ${y}`} stroke="#4a7a9a" strokeWidth={3} fill="none" opacity={0.5} />)}
          <rect x={-120} y={-90} width={240} height={190} fill="#2a5ad8" stroke={O} strokeWidth={5} />
          <text x={0} y={22} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={54} fill="#f4f8ff">DOĞAL</text>
          <text x={0} y={70} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={700} fontSize={30} fill="#c8d8ff">KAYNAK SUYU</text>
          <path d="M -86 -300 L -80 380" stroke="#ffffff" strokeWidth={16} opacity={0.35} strokeLinecap="round" />
          <path d="M 70 -280 L 76 360" stroke="#ffffff" strokeWidth={6} opacity={0.25} strokeLinecap="round" />
          {/* su içinde kımıltısız ışık kırılması (tavandaki floresan) */}
          <rect x={-40} y={-240} width={30} height={120} fill="#ffffff" opacity={0.22 + 0.04 * Math.sin(f * 0.4)} />
        </g>
        {/* kapak: yanında yerde, ters */}
        <g transform="translate(700 1520) rotate(-20)">
          <rect x={-44} y={-30} width={88} height={60} rx={8} fill="#2a5ad8" stroke={O} strokeWidth={5} />
          {[-28, -14, 0, 14, 28].map((x) => <path key={x} d={`M ${x} -24 V 24`} stroke="#1a3a98" strokeWidth={3} />)}
        </g>
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ GÖLGE: Elif'in yerdeki gölgesi (tepeden-önden) */
export const GolgeYakin: React.FC<{ tg: number; f: number; tuhaf: number }> = ({ tg, tuhaf }) => {
  // ayaklar yukarıda (kıpırtısız); gölge bize doğru uzar. Saç telleri kendi kendine dalgalanır (tuhaf 0..1), parmaklar uzar.
  const sac: React.ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const x0 = 470 + i * 18, y0 = 1330;
    let d = `M ${x0} ${y0}`;
    let x = x0, y = y0;
    for (let k = 1; k <= 8; k++) {
      y += 46 + 6 * tuhaf;
      x += (i - 4) * 4 + tuhaf * 26 * Math.sin(tg * (1.6 + i * 0.13) + k * 0.8 + i);
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    sac.push(<path key={i} d={d} stroke="#05060a" strokeWidth={22 - i % 3 * 3} fill="none" strokeLinecap="round" strokeLinejoin="round" />);
  }
  const parmak = (sx: number, sy: number, yon: number) => (
    <g>
      {[0, 1, 2, 3].map((j) => {
        const L = 40 + tuhaf * (90 + j * 14);
        const a = ((90 + yon * (j * 9 - 10)) * Math.PI) / 180;
        const bk = Math.sin(tg * 2.4 + j) * tuhaf * 10;
        return <path key={j} d={`M ${sx + yon * j * 10} ${sy} Q ${sx + yon * j * 12 + Math.cos(a) * L * 0.5 + bk} ${sy + Math.sin(a) * L * 0.5} ${sx + yon * j * 14 + Math.cos(a) * L} ${sy + Math.sin(a) * L}`} stroke="#05060a" strokeWidth={14 - j} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
  return (
    <g>
      <defs>
        <linearGradient id="gyZ" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a909a" /><stop offset="1" stopColor="#c8ccd2" /></linearGradient>
        <filter id="gyB" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <rect x={-600} y={-400} width={2280} height={2720} fill="url(#gyZ)" />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M -600 ${300 + i * 420} H 1680`} stroke="#9a9ea6" strokeWidth={4} />)}
      {[-1, 0, 1, 2].map((i) => <path key={`v${i}`} d={`M ${120 + i * 420} -400 L ${60 + i * 460} 2320`} stroke="#9a9ea6" strokeWidth={4} />)}
      {/* gölge (yumuşak kenar) */}
      <g opacity={0.82} filter="url(#gyB)">
        {/* bacaklar */}
        <path d="M 470 230 L 520 230 L 530 760 L 470 760 Z" fill="#05060a" />
        <path d="M 600 230 L 650 230 L 660 760 L 600 760 Z" fill="#05060a" />
        {/* elbise */}
        <path d="M 430 740 L 700 740 L 660 1000 L 640 1260 L 480 1260 L 460 1000 Z" fill="#05060a" />
        {/* kollar (aşağı sarkık) */}
        <path d="M 440 1240 Q 380 1100 400 900" stroke="#05060a" strokeWidth={40} fill="none" strokeLinecap="round" />
        <path d="M 680 1240 Q 740 1100 720 900" stroke="#05060a" strokeWidth={40} fill="none" strokeLinecap="round" />
        {parmak(400, 900, -1)}
        {parmak(720, 900, 1)}
        {/* baş + saç */}
        <ellipse cx={560} cy={1360} rx={82} ry={96} fill="#05060a" />
        {sac}
      </g>
      {/* ayaklar (gerçek; kıpırtısız): solda çıplak ayak (kirli taban), sağda beyaz spor ayakkabı */}
      <g>
        <path d="M 455 60 L 465 240 L 530 240 L 540 60 Z" fill="#f0c8a8" stroke={O} strokeWidth={5} />
        <path d="M 450 220 Q 440 290 500 296 Q 556 296 548 220 Z" fill="#f0c8a8" stroke={O} strokeWidth={5} />
        {[0, 1, 2, 3, 4].map((j) => <ellipse key={j} cx={466 + j * 18} cy={292 - Math.abs(j - 2) * 3} rx={8} ry={7} fill="#f0c8a8" stroke={O} strokeWidth={2.5} />)}
        <path d="M 600 60 L 610 240 L 670 240 L 680 60 Z" fill="#f0c8a8" stroke={O} strokeWidth={5} />
        <path d="M 590 200 Q 580 300 640 306 Q 700 306 694 200 Z" fill="#f4f4f2" stroke={O} strokeWidth={5} />
        <path d="M 600 210 H 684" stroke="#c8c8c4" strokeWidth={5} />
        <path d="M 420 -400 L 720 -400 L 710 70 L 430 70 Z" fill="#c4162a" stroke={O} strokeWidth={5} opacity={0} />
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ SAAT: kırmızı LED duvar saati */
const SEG: Record<string, string> = { "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc", "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg" };
const Hane: React.FC<{ x: number; y: number; c: string; renk: string }> = ({ x, y, c, renk }) => {
  const on = SEG[c] ?? "";
  const S: Record<string, string> = { a: "M 14 0 H 76", b: "M 86 10 V 84", c: "M 86 104 V 178", d: "M 14 188 H 76", e: "M 4 104 V 178", f: "M 4 10 V 84", g: "M 14 94 H 76" };
  return (
    <g transform={`translate(${x} ${y})`}>
      {Object.entries(S).map(([k, d]) => <path key={k} d={d} stroke={on.includes(k) ? renk : "#3a0c0e"} strokeWidth={16} strokeLinecap="round" opacity={on.includes(k) ? 1 : 0.45} />)}
    </g>
  );
};
export const DuvarSaat: React.FC<{ tg: number; f: number; yazi: string; isik: number }> = ({ tg, yazi, isik }) => {
  const nokta = Math.floor(tg * 2) % 2 === 0;
  const [h, m] = yazi.split(":");
  const renk = "#ff2a2a";
  return (
    <g>
      <defs>
        <radialGradient id="dsG" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff3030" stopOpacity={0.35} /><stop offset="1" stopColor="#ff3030" stopOpacity={0} /></radialGradient>
        <filter id="dsB"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>
      <rect x={-600} y={-400} width={2280} height={2720} fill={`rgb(${Math.round(60 + 70 * isik)},${Math.round(64 + 72 * isik)},${Math.round(76 + 78 * isik)})`} />
      {[0, 1, 2].map((i) => <path key={i} d={`M -600 ${300 + i * 520} H 1680`} stroke="#000" strokeWidth={3} opacity={0.12} />)}
      <ellipse cx={540} cy={900} rx={620} ry={360} fill="url(#dsG)" />
      <rect x={90} y={700} width={900} height={400} rx={26} fill="#121214" stroke="#050506" strokeWidth={10} />
      <rect x={120} y={730} width={840} height={340} rx={14} fill="#1a0a0c" />
      <g filter="url(#dsB)" opacity={0.8}>
        <Hane x={160} y={806} c={h[0]} renk={renk} /><Hane x={330} y={806} c={h[1]} renk={renk} />
        <Hane x={590} y={806} c={m[0]} renk={renk} /><Hane x={760} y={806} c={m[1]} renk={renk} />
      </g>
      <Hane x={160} y={806} c={h[0]} renk={renk} /><Hane x={330} y={806} c={h[1]} renk={renk} />
      <Hane x={590} y={806} c={m[0]} renk={renk} /><Hane x={760} y={806} c={m[1]} renk={renk} />
      <circle cx={518} cy={860} r={11} fill={nokta ? renk : "#3a0c0e"} /><circle cx={518} cy={950} r={11} fill={nokta ? renk : "#3a0c0e"} />
      <path d="M 140 740 L 940 740" stroke="#ffffff" strokeWidth={6} opacity={0.07} />
      <path d="M 520 1100 L 520 1240" stroke="#1a1a1c" strokeWidth={8} />
    </g>
  );
};

/* ------------------------------------------------------------------ YAN katmanları */
/** yerdeki banknotlar: [[tÇıkış, X, Z, açı°, tAlınma(-1)], ...] (dünya m; kapı altından WZ=1.9'dan kayar) */
export const YanParalar: React.FC<{ notlar: number[][]; tg: number; isik: number }> = ({ notlar, tg, isik }) => (
  <g>
    {notlar.map((n, i) => {
      const [t0, X, Z, aci, tAl] = n;
      if (tg < t0 || (tAl > 0 && tg > tAl)) return null;
      const u = ss(t0, t0 + 0.5, tg);
      const zz = 1.93 + (Z - 1.93) * u;
      const r = ((aci * u) * Math.PI) / 180;
      const pts = [[-0.09, -0.042], [0.09, -0.042], [0.09, 0.042], [-0.09, 0.042]].map(([a, b]) => yanP(X + a * Math.cos(r) - b * Math.sin(r), 0.003, zz + a * Math.sin(r) + b * Math.cos(r)));
      const d = `M ${pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L ")} Z`;
      const yak = Math.max(0, 1 - (1.9 - zz) * 2.5);
      return (
        <g key={i} clipPath="url(#ypKirp)">
          <path d={d} fill={i % 2 ? "#c02838" : "#d03644"} stroke={O} strokeWidth={1.6} />
          <path d={d} fill="#ffb860" opacity={0.4 * yak * isik} />
        </g>
      );
    })}
    <defs><clipPath id="ypKirp"><path d={(() => { const a = yanP(-3, 0, 1.9), b = yanP(4, 0, 1.9); return `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${b[0]} 2400 L ${a[0]} 2400 Z`; })()} /></clipPath></defs>
  </g>
);
/** havada süzülüp düşen banknotlar (ekran): [[t0, x, y0, y1, ölçek], ...] */
export const DusenPara: React.FC<{ k: number[][]; tg: number }> = ({ k, tg }) => (
  <g>
    {k.map(([t0, x, y0, y1, s, tSon], i) => {
      if (tg < t0 || (tSon && tg > tSon)) return null;
      const u = Math.min(1, (tg - t0) / 1.3);
      const y = y0 + (y1 - y0) * (u * u * 0.4 + u * 0.6);
      const sal = u < 1 ? Math.sin((tg - t0) * 7 + i) * 26 * (1 - u) : 0;
      const ac = u < 1 ? Math.sin((tg - t0) * 5 + i * 2) * 35 : 8 * (i % 3 - 1);
      const sk = u < 1 ? 0.35 + 0.65 * Math.abs(Math.cos((tg - t0) * 4 + i)) : 0.32;
      return <g key={i} transform={`translate(${x + sal} ${y}) rotate(${ac}) scale(${s} ${s * sk})`}><NotDesen ton={i % 2} /></g>;
    })}
  </g>
);
/** duvarda örümcek gibi tırmanan gölge: [t, X, Y, op] (Z = duvar), faz yürüyüşten */
export const OrumcekGolge: React.FC<{ k: number[]; tg: number }> = ({ k, tg }) => {
  const [X, Y, op, hiz] = k;
  if (op < 0.01) return null;
  const Z = 1.86;
  const [cx, cy] = yanP(X, Y, Z);
  const s = 1600 / yanD(X, Z) / 1000 * 1.1;     // 1 m ≈ s·1000 px
  const fz = tg * 7 * (hiz ?? 1);
  const bacak = (i: number) => {
    const sag = i % 2 ? 1 : -1, ust = i < 2 ? -1 : 1;
    const ph = fz + i * Math.PI / 2;
    const ox = sag * 120, oy = ust * 150;
    const dx = sag * (420 + 40 * Math.sin(ph)), dy = ust * (300 + 120 * Math.cos(ph));
    const ex = ox + dx * 0.55 + sag * 60, ey = oy + dy * 0.2 - 170;
    return <path key={i} d={`M ${ox} ${oy} L ${ex} ${ey} L ${ox + dx} ${oy + dy}`} stroke="#04050a" strokeWidth={46} fill="none" strokeLinejoin="round" strokeLinecap="round" />;
  };
  return (
    <g opacity={op} transform={`translate(${cx} ${cy}) scale(${s})`}>
      <defs><filter id="orB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16" /></filter></defs>
      <g filter="url(#orB)">
        {[0, 1, 2, 3].map(bacak)}
        <ellipse cx={0} cy={0} rx={150} ry={300} fill="#04050a" />
        <circle cx={0} cy={-340} r={110} fill="#04050a" />
        {[0, 1, 2, 3, 4, 5].map((j) => <path key={j} d={`M ${-80 + j * 32} -380 Q ${-90 + j * 36 + 30 * Math.sin(tg * 3 + j)} -560 ${-120 + j * 48 + 50 * Math.sin(tg * 2.3 + j)} -720`} stroke="#04050a" strokeWidth={30} fill="none" strokeLinecap="round" />)}
      </g>
    </g>
  );
};
