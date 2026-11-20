/* Kayıp CEO · Bölüm 2 ekleme çekimleri (tam ekran 1080x1920, kendi çizimimiz):
 * pov_yaprak, kol_saati, tv_son_dakika (faz 1/2), yemek_ust, sozlesme (faz tut/burus/ates). */
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SANS = "Inter, Arial, sans-serif";
const O = "#1a1412";

export type Insert7Kind = "pov_yaprak" | "kol_saati" | "tv_son_dakika" | "yemek_ust" | "sozlesme" | "omuz_bastir" | "yemek_el" | "icir" | "telefon_kirik";
export const INSERT7_KINDS: Insert7Kind[] = ["pov_yaprak", "kol_saati", "tv_son_dakika", "yemek_ust", "sozlesme", "omuz_bastir", "yemek_el", "icir", "telefon_kirik"];

/* ------------------------------------------------------------------------------------------
 * POV (Emir'in gözü): saz tavan, üstüne eğilmiş kadın (B1 son karesindeki gibi kadrajda), sağ eli kalp biçimli
 * gölevez yaprağıyla alına uzanır. Yaprak kameraya değince göz kırpılır; damlalar parlar, odak kadına kayar.
 * ---------------------------------------------------------------------------------------- */
const PovYaprak: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const touch = 1.55;
  const ease = (x: number) => x * x * (3 - 2 * x);
  // kadının KENDİ sağ kolu (kadrajda sağda) kalkar; yaprak elindedir, kameraya (Emir'in alnına) yaklaşıp kadrajın üst kenarına değer
  const p = interpolate(t, [0.15, touch], [0, 1], { ...clamp, easing: ease });
  const geri = interpolate(t, [touch + 0.5, Math.min(dur / fps, touch + 1.4)], [0, 1], { ...clamp, easing: ease }); // el geri çekilir (yaprak alında kalır)
  const blink = interpolate(t, [touch, touch + 0.1, touch + 0.32], [0, 1, 0], clamp);
  const blurFace = interpolate(t, [0, touch, touch + 0.6], [5, 3, 0], clamp);
  const breathe = Math.sin(f / 22) * 6;
  const size = 2900, k = size / 1000;
  const L0 = 540 - 0.2 * size, T0 = 640 - 0.2 * size + breathe;
  // rig'in sağ kolu omuzda gizlenir (ul/fl ~0); kol omuzdan başlayan kısalmış (perspektif) bir boru olarak kameraya uzanır
  const SX = L0 + (200 + 72 * 0.9) * k, SY = T0 + 362 * k;
  const q = p * (1 - geri);
  const HX = interpolate(q, [0, 1], [905, 790]), HY = interpolate(q, [0, 1], [1560, 60]);
  const hs = interpolate(q, [0, 1], [1, 3.1]); // el kameraya yaklaştıkça büyür
  const ang = Math.atan2(HY - SY, HX - SX);
  const nx = -Math.sin(ang), ny = Math.cos(ang);
  const w1 = 52, w2 = 50 * hs;
  const kolYol = `M ${SX + nx * w1} ${SY + ny * w1} L ${HX + nx * w2} ${HY + ny * w2} L ${HX - nx * w2} ${HY - ny * w2} L ${SX - nx * w1} ${SY - ny * w1} Z`;
  const leafS = interpolate(p, [0, 1], [0.85, 3.2]);
  const leafX = geri > 0 ? 720 : HX - 40 * hs;
  const leafY = geri > 0 ? -60 : HY - 150 * hs;
  const tazelik = interpolate(t, [touch, touch + 0.25, touch + 1.2], [0, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#5a3e24", overflow: "hidden" }}>
      {/* yatarak yukarı bakış: saz tavan, kirişler, çatı aralığından ışık (bulanık) */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(8px)" }}>
        <rect width={1080} height={1920} fill="#9a7838" />
        {new Array(40).fill(0).map((_, i) => <path key={i} d={`M ${i * 30 - 200} 0 L ${i * 30 + 100} 1920`} stroke={i % 2 ? "#b8955a" : "#80602c"} strokeWidth={14} />)}
        {[300, 900, 1500].map((y) => <rect key={y} x={-50} y={y} width={1180} height={70} fill="#4a3018" />)}
        <path d="M 760 0 L 880 0 L 660 1920 L 520 1920 Z" fill="#fff0c0" opacity={0.3} />
      </svg>
      {/* kadın: Emir'in üstüne eğilmiş, ona (kameraya) bakar */}
      <div style={{ position: "absolute", left: L0, top: T0, filter: `blur(${blurFace}px)` }}>
        <Character look={castById("yerli_kadin")} size={size} pose={{ emotion: "dusunceli", lookX: 0, lookY: 0.45, yaw: 0, tilt: -6, seed: 7, armR: { upper: 0, fore: 0, ul: 0.05, fl: 0.05 } }} />
      </div>
      {/* kapıdan gelen sıcak anahtar ışık */}
      <AbsoluteFill style={{ background: "linear-gradient(240deg, rgba(255,236,190,0.30) 0%, rgba(255,236,190,0) 45%)" }} />
      {/* yaprak (elin içinde, parmaklar önünde) */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="py_yap" cx="0.4" cy="0.4" r="0.7"><stop offset="0" stopColor="#8ab85a" /><stop offset="1" stopColor="#4f7a2e" /></radialGradient>
          <filter id="py_bl"><feGaussianBlur stdDeviation={2 + 6 * p} /></filter>
        </defs>
        {/* kısalmış kol (omuzdan) + el; yaprak sapını başparmak ve işaret parmağı tutar */}
        <g filter={q > 0.6 ? "url(#py_bl)" : undefined}>
          <path d={kolYol} fill="#b8805a" stroke={O} strokeWidth={6} strokeLinejoin="round" />
          <circle cx={SX} cy={SY} r={w1} fill="#b8805a" stroke={O} strokeWidth={6} />
          {/* tunik kısa kolu: omzu örter, kolun yönünde uzanır */}
          <g transform={`translate(${SX} ${SY}) rotate(${(ang * 180) / Math.PI - 90})`}>
            <path d={`M ${-w1 - 14} -30 Q 0 ${-w1 - 40} ${w1 + 14} -30 L ${w1 + 10} 150 Q 0 162 ${-w1 - 10} 150 Z`} fill="#d2b484" stroke={O} strokeWidth={6} strokeLinejoin="round" />
            <path d={`M ${-w1 - 8} 128 Q 0 140 ${w1 + 8} 128`} stroke="#b0925e" strokeWidth={5} fill="none" />
          </g>
          {/* altın bilezik (sağ bilek) */}
          <ellipse cx={HX - Math.cos(ang) * 40 * hs} cy={HY - Math.sin(ang) * 40 * hs} rx={w2 * 1.05} ry={16 * hs} fill="#c9a24a" stroke={O} strokeWidth={4} transform={`rotate(${(ang * 180) / Math.PI + 90} ${HX - Math.cos(ang) * 40 * hs} ${HY - Math.sin(ang) * 40 * hs})`} />
          <ellipse cx={HX} cy={HY} rx={56 * hs} ry={64 * hs} fill="#b8805a" stroke={O} strokeWidth={5} />
        </g>
        <g transform={`translate(${leafX} ${leafY}) scale(${leafS}) rotate(${170 - 15 * p})`} filter="url(#py_bl)">
          <path d="M 0 -150 C 120 -170 200 -40 120 60 C 70 130 10 150 0 170 C -10 150 -70 130 -120 60 C -200 -40 -120 -170 0 -150 Z" fill="url(#py_yap)" stroke="#2e4a1e" strokeWidth={4} />
          <path d="M 0 -150 V 170" stroke="#c8e09a" strokeWidth={5} />
          {[-110, -60, -10, 40, 90].map((y) => <path key={y} d={`M 0 ${y} q 70 -10 110 ${30 + y * 0.1} M 0 ${y} q -70 -10 -110 ${30 + y * 0.1}`} stroke="#9cc46a" strokeWidth={3} fill="none" />)}
          {[[40, -60], [-50, 0], [70, 40], [-20, 90]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={9} fill="#e8f6ff" opacity={0.85} /><circle cx={x - 3} cy={y - 3} r={3} fill="#ffffff" /></g>)}
        </g>
        {q > 0.02 ? (
          <g filter={q > 0.6 ? "url(#py_bl)" : undefined}>
            <ellipse cx={HX - 34 * hs} cy={HY - 40 * hs} rx={22 * hs} ry={34 * hs} fill="#b8805a" stroke={O} strokeWidth={4} transform={`rotate(-20 ${HX - 34 * hs} ${HY - 40 * hs})`} />
            <ellipse cx={HX + 14 * hs} cy={HY - 54 * hs} rx={20 * hs} ry={36 * hs} fill="#b8805a" stroke={O} strokeWidth={4} />
          </g>
        ) : null}
      </svg>
      {/* serinlik: dokunuşta üst kenarda soğuk parıltı */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(200,236,255,${0.35 * tazelik}) 0%, rgba(200,236,255,0) 35%)` }} />
      {/* göz kapağı: dokunuşta kırpma + kenar kararması */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
      <div style={{ position: "absolute", left: -100, right: -100, top: 0, height: 960 * blink, background: "#000", borderBottomLeftRadius: "50%", borderBottomRightRadius: "50%" }} />
      <div style={{ position: "absolute", left: -100, right: -100, bottom: 0, height: 960 * blink, background: "#000", borderTopLeftRadius: "50%", borderTopRightRadius: "50%" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------------------------
 * Kol saati yakın planı: 14:07'de durmuş. Çelik kasa, lacivert güneş ışınlı kadran, yıldız çatlaklı cam,
 * çatlakta kum ve kurumuş kan. Saniye ibresi kıpırdamaz; hareketi camda kayan parlama ve (D2) camı silen başparmak verir.
 * Marka/yazı/yıldız yok. Bilekte yırtık gömlek manşeti ve yaprak sargının ucu.
 * ---------------------------------------------------------------------------------------- */
const KolSaati: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const mod = text?.[0] ?? "";
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const z = interpolate(f, [0, dur], [1, 1.08], clamp);
  // "sil": başparmak hızla camı siler (1,5 sn) · "temiz": kum silinmiş, başparmak yok (iç ses temiz kadranda)
  const sw = mod === "temiz" ? 1 : mod === "sil" ? interpolate(t, [0.25, 1.05], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) }) : interpolate(t, [1.0, 2.0], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  // başparmak sağdan girer, camı sağdan sola siler, sonra geri çekilir (el gövdesi kadraj dışına uzanır)
  const thumbX = mod === "temiz" ? 2000 : mod === "sil" ? interpolate(t, [0, 0.25, 1.05, 1.45], [1300, 760, 300, 1400], { ...clamp, easing: (x) => x * x * (3 - 2 * x) }) : interpolate(t, [0.7, 1.0, 2.0, 2.6], [1300, 760, 300, 1400], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const glint = (t * 0.5) % 1;
  const cx = 540, cy = 900, R = 300;
  const ang = (deg: number, len: number) => `M ${cx} ${cy} L ${cx + Math.sin((deg * Math.PI) / 180) * len} ${cy - Math.cos((deg * Math.PI) / 180) * len}`;
  return (
    <AbsoluteFill style={{ backgroundColor: "#6a4a2c", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "50% 47%" }}>
        <defs>
          <radialGradient id="ks_kadran" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#2c3a5e" /><stop offset="1" stopColor="#141c32" /></radialGradient>
          <linearGradient id="ks_kasa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e8ecf0" /><stop offset="0.5" stopColor="#9aa0a6" /><stop offset="1" stopColor="#d8dce0" /></linearGradient>
          <clipPath id="ks_cam"><circle cx={cx} cy={cy} r={R - 34} /></clipPath>
          <filter id="ks_kum"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" /><feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.81  0 0 0 0 0.61  0 0 0 0.9 0" /></filter>
          <linearGradient id="ks_silme" x1="1" y1="0" x2="0" y2="0"><stop offset={Math.max(0, sw - 0.15)} stopColor="#000" /><stop offset={sw} stopColor="#fff" /></linearGradient>
          <mask id="ks_kummask"><rect x={0} y={0} width={1080} height={1920} fill="url(#ks_silme)" /></mask>
        </defs>
        {/* bilek: ten, yırtık gömlek manşeti, sargı ucu */}
        <rect x={-100} y={540} width={1300} height={720} fill="#e0b088" />
        <path d="M -100 540 Q 540 470 1180 540" stroke="#c89068" strokeWidth={10} fill="none" />
        <path d="M -100 1260 Q 540 1330 1180 1260 L 1180 1920 L -100 1920 Z" fill="#e8e2d2" />
        <path d="M 120 1290 l 40 70 l 30 -50 l 40 80 M 820 1280 l 30 60 l 40 -40" stroke="#b8b0a0" strokeWidth={6} fill="none" />
        <path d="M 60 1300 Q 300 1340 520 1310" stroke="#7a1a14" strokeWidth={10} opacity={0.4} fill="none" />
        <path d="M 900 560 Q 1000 700 960 860 Q 1060 760 1100 620 Z" fill="#5f8a3a" stroke="#2e4a1e" strokeWidth={4} />
        {/* kayış (deri) */}
        <defs>
          <linearGradient id="ks_kayis" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a100a" /><stop offset="0.12" stopColor="#3a2418" /><stop offset="0.88" stopColor="#3a2418" /><stop offset="1" stopColor="#1a100a" /></linearGradient>
        </defs>
        <rect x={360} y={520} width={360} height={760} fill="url(#ks_kayis)" stroke={O} strokeWidth={6} />
        {new Array(6).fill(0).map((_, i) => <path key={i} d={`M 380 ${560 + i * 26} H 700`} stroke="#4a3020" strokeWidth={2} />)}
        {new Array(6).fill(0).map((_, i) => <path key={`b${i}`} d={`M 380 ${1110 + i * 26} H 700`} stroke="#4a3020" strokeWidth={2} />)}
        {/* bileğin yuvarlaklığı: kayış kenarlarda gölgeye girer */}
        <path d="M -100 540 Q 540 470 1180 540 L 1180 600 Q 540 540 -100 600 Z" fill="#000" opacity={0.18} />
        <path d="M -100 1260 Q 540 1330 1180 1260 L 1180 1200 Q 540 1270 -100 1200 Z" fill="#000" opacity={0.18} />
        {/* kasa + taç */}
        <circle cx={cx} cy={cy} r={R} fill="url(#ks_kasa)" stroke={O} strokeWidth={6} />
        <rect x={cx + R - 4} y={cy - 26} width={44} height={52} rx={8} fill="#b8bcc0" stroke={O} strokeWidth={4} />
        {new Array(6).fill(0).map((_, i) => <path key={i} d={`M ${cx + R + 2 + i * 7} ${cy - 22} V ${cy + 22}`} stroke="#8a8e92" strokeWidth={2} />)}
        {/* kadran: güneş ışınları, indeksler */}
        <circle cx={cx} cy={cy} r={R - 34} fill="url(#ks_kadran)" />
        {new Array(60).fill(0).map((_, i) => <path key={i} d={ang(i * 6, R - 40)} stroke="#3a4a70" strokeWidth={1.5} opacity={0.5} />)}
        <circle cx={cx} cy={cy} r={R - 120} fill="url(#ks_kadran)" opacity={0.6} />
        {new Array(12).fill(0).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const r1 = R - 60, r2 = R - (i % 3 === 0 ? 110 : 90);
          return <path key={i} d={`M ${cx + Math.sin(a) * r1} ${cy - Math.cos(a) * r1} L ${cx + Math.sin(a) * r2} ${cy - Math.cos(a) * r2}`} stroke="#e8ecf0" strokeWidth={i % 3 === 0 ? 14 : 8} strokeLinecap="round" />;
        })}
        {/* ibreler: 14:07, saniye 228° (donuk) */}
        <path d={ang(63.5, 150)} stroke="#e8ecf0" strokeWidth={18} strokeLinecap="round" />
        <path d={ang(42, 220)} stroke="#e8ecf0" strokeWidth={12} strokeLinecap="round" />
        <path d={ang(228, 230)} stroke="#c8102e" strokeWidth={4} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={16} fill="#c8102e" stroke="#e8ecf0" strokeWidth={4} />
        {/* cam: yıldız çatlak, çatlakta kum, kurumuş kan, kayan parlama */}
        <g clipPath="url(#ks_cam)">
          {(() => { const ox = cx + 150, oy = cy + 120; return <path d={`M ${ox} ${oy} l 40 -22 l 18 -38 M ${ox} ${oy} l -36 -14 l -30 8 M ${ox} ${oy} l 8 44 l -14 30 M ${ox} ${oy} l 46 26 l 10 34 M ${ox} ${oy} l -20 -46 l 6 -26 M ${ox - 30} ${oy - 50} l -26 -10 M ${ox + 50} ${oy + 30} l 26 -6`} stroke="#ffffff" strokeWidth={3} opacity={0.6} fill="none" strokeLinejoin="round" />; })()}
          <circle cx={cx + 150} cy={cy + 120} r={7} fill="#ffffff" opacity={0.5} />
          <g mask="url(#ks_kummask)">
            <rect x={cx - R} y={cy - R} width={2 * R} height={2 * R} filter="url(#ks_kum)" opacity={0.55} />
          </g>
          <path d={`M ${cx - 180} ${cy + 120} q 40 -20 70 10 q 20 40 -30 60 q -50 10 -40 -70 z`} fill="#5a1414" opacity={0.75} />
          <rect x={cx - R + glint * 2 * R - 60} y={cy - R} width={60} height={2 * R} fill="#ffffff" opacity={0.12} transform={`rotate(25 ${cx} ${cy})`} />
        </g>
        <circle cx={cx} cy={cy} r={R - 34} fill="none" stroke="#8a8e92" strokeWidth={6} />
        {/* (D2) camı silen başparmak */}
        <g transform={`translate(${thumbX} ${cy - 30}) rotate(-10)`}>
          {/* el gövdesi: kıvrık işaret parmağı + avuç sırtı, sağ kenardan dışarı uzanır */}
          <path d="M 230 40 Q 330 260 620 300 L 1500 330 L 1500 -10 Q 900 -40 520 10 Z" fill="#c8946e" stroke={O} strokeWidth={5} />
          <path d="M 300 120 Q 380 250 560 270" stroke="#a87858" strokeWidth={4} fill="none" />
          <path d="M 700 290 Q 720 250 700 210 M 900 300 Q 920 260 900 220" stroke="#a87858" strokeWidth={3} fill="none" />
          <path d="M 200 -78 Q 600 -150 1500 -120 L 1500 60 Q 800 40 300 70 Z" fill="#d09c74" stroke={O} strokeWidth={5} />
          <rect x={-90} y={-70} width={420} height={150} rx={75} fill="#d8a47c" stroke={O} strokeWidth={5} />
          <path d="M -70 -50 Q -96 0 -70 50 L -20 54 Q -6 0 -20 -54 Z" fill="#ecc8a8" stroke="#a87858" strokeWidth={3} />
          <path d="M -60 -30 Q -40 0 -60 30" stroke="#c8946e" strokeWidth={3} fill="none" />
        </g>
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------------------------
 * TV son dakika (resepsiyondaki TV'nin ekranı, çerçeveyle): uydurma kanal "MERİDYEN HABER", spiker, kırmızı
 * SON DAKİKA bandı + beyaz bant. faz "2": sağda Emir'in portresi (takım elbise) ve Hint Okyanusu haritası (son sinyal).
 * Bantlar altyazı bölgesinin üstünde (y < 1150). Ekranda saat yok.
 * ---------------------------------------------------------------------------------------- */
const TvSonDakika: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const faz = text?.[0] ?? "1";
  const { fps } = useVideoConfig();
  const pipAt = Math.round(Number(text?.[1] ?? 0) * fps);
  // faz 3: Emir'in portresine yavaş itiş ("akıbeti henüz bilinmiyor")
  const z = interpolate(f, [0, dur], [faz === "3" ? 1.78 : 1, faz === "3" ? 2.25 : 1.06], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const pip = faz === "2" || faz === "3" ? interpolate(f, [pipAt, pipAt + 10], [0, 1], clamp) : 0;
  const konus: [number, number][] = new Array(40).fill(0).map((_, k) => [k * 34, k * 34 + 28]);
  const ticker = (f * 6) % 2400;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0d10", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: faz === "3" ? "85% 10%" : "40% 30%" }}>
        {/* TV çerçevesi */}
        <div style={{ position: "absolute", left: 30, top: 90, width: 1020, height: 1060, background: "#111214", borderRadius: 16, boxShadow: "0 0 0 6px #2a2e34" }} />
        <div style={{ position: "absolute", left: 50, top: 110, width: 980, height: 1020, overflow: "hidden", background: "linear-gradient(160deg, #0e2a5a 0%, #12386e 50%, #0a1e40 100%)" }}>
          {/* stüdyo arka planı: dünya çizgileri */}
          <svg viewBox="0 0 980 1020" width={980} height={1020} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
            {new Array(9).fill(0).map((_, i) => <ellipse key={i} cx={700} cy={400} rx={60 + i * 40} ry={300} fill="none" stroke="#5a8ad8" strokeWidth={1.5} />)}
            {new Array(7).fill(0).map((_, i) => <path key={`h${i}`} d={`M 380 ${130 + i * 90} H 1020`} stroke="#5a8ad8" strokeWidth={1.5} />)}
          </svg>
          {/* spiker */}
          <div style={{ position: "absolute", left: 300 - 0.2 * 1300 - (pip ? 120 * pip : 0), top: 140 }}>
            <Character look={castById("spiker_meridyen")} size={1300} pose={{ emotion: "notr", lookX: 0, lookY: 0, yaw: 0, seed: 5, talk: faz === "3" ? undefined : konus }} />
          </div>
          {/* masa */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 780, height: 260, background: "linear-gradient(180deg, #1a2a48, #0e1a30)", borderTop: "4px solid #4a7ac8" }} />
          {/* kanal logosu */}
          <div style={{ position: "absolute", left: 28, top: 26, padding: "8px 16px", background: "rgba(255,255,255,0.92)", borderRadius: 6, fontFamily: SANS, fontWeight: 900, fontSize: 34, color: "#0e2a5a", letterSpacing: 1 }}>MERİDYEN <span style={{ color: "#c8102e" }}>HABER</span></div>
          <div style={{ position: "absolute", right: 28, top: 30, display: "flex", alignItems: "center", gap: 8, fontFamily: SANS, fontWeight: 900, fontSize: 28, color: "#fff" }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: "#ff2a2a", opacity: f % 30 < 18 ? 1 : 0.3 }} /> CANLI
          </div>
          {/* faz 2: portre + harita */}
          {pip > 0 ? (
            <div style={{ position: "absolute", right: 30, top: 160, width: 420, opacity: pip, transform: `translateX(${(1 - pip) * 60}px)` }}>
              <div style={{ width: 420, height: 300, background: "#e8e2d8", border: "6px solid #fff", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", left: 210 - 0.2 * 620, top: 20 }}>
                  <Character look={castById("emir")} size={620} pose={{ emotion: "kararli", lookX: 0, lookY: 0, yaw: 0.15, seed: 9 }} />
                </div>
              </div>
              <div style={{ background: "#c8102e", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 26, padding: "6px 12px" }}>EMİR ÖZDEMİR · CEO</div>
              <svg viewBox="0 0 420 260" width={420} height={260} style={{ display: "block", marginTop: 14, background: "#0c2448", border: "4px solid #4a7ac8" }}>
                <path d="M 0 30 Q 60 20 110 50 L 130 110 Q 90 140 40 120 L 0 130 Z" fill="#2a5a3a" />
                <path d="M 300 0 L 420 0 L 420 90 Q 360 110 330 60 Z" fill="#2a5a3a" />
                <path d="M 230 200 Q 280 180 320 210 L 300 250 Q 250 260 220 240 Z" fill="#2a5a3a" />
                <path d="M 70 70 Q 170 120 250 150" stroke="#e8e8e8" strokeWidth={3} strokeDasharray="8 7" fill="none" />
                <circle cx={250} cy={150} r={9 + (f % 30) / 4} fill="none" stroke="#ff2a2a" strokeWidth={3} opacity={1 - (f % 30) / 30} />
                <circle cx={250} cy={150} r={7} fill="#ff2a2a" />
                <text x={16} y={236} fontFamily="Arial, sans-serif" fontWeight={900} fontSize={20} fill="#cfe0ff">HİNT OKYANUSU</text>
                <text x={262} y={140} fontFamily="Arial, sans-serif" fontWeight={800} fontSize={16} fill="#ffd0d0">SON SİNYAL</text>
              </svg>
            </div>
          ) : null}
          {/* bantlar */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, height: 76, background: "#c8102e", display: "flex", alignItems: "center", padding: "0 24px", fontFamily: SANS, fontWeight: 900, fontSize: 44, color: "#fff", letterSpacing: 2 }}>SON DAKİKA</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 896, height: 104, background: "#f4f4f2", display: "flex", alignItems: "center", padding: "0 24px", fontFamily: SANS, fontWeight: 900, fontSize: 36, lineHeight: 1.1, color: "#111" }}>ZENITH GRUP HOLDİNG CEO'SU EMİR ÖZDEMİR'İ TAŞIYAN UÇAKTAN HABER YOK</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1000, height: 20, background: "#0e2a5a", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 980 - ticker, top: -2, whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 700, fontSize: 18, color: "#cfe0ff" }}>ARAMA KURTARMA ÇALIŞMALARI SÜRÜYOR · ZENITH GRUP HİSSELERİ İŞLEME KAPATILDI · ŞİRKETTEN HENÜZ AÇIKLAMA YAPILMADI ·</div>
          </div>
          {/* tarama çizgileri + ekran yansıması */}
          <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, rgba(0,0,0,0) 3px)" }} />
          <AbsoluteFill style={{ background: "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.07) 40%, rgba(255,255,255,0) 50%)" }} />
        </div>
      </AbsoluteFill>
      {/* ön plan (faz 3'te itişte kadraj dışında kalır): lobi zemini, masa kenarı, resepsiyonistin arkadan bulanık silueti */}
      {faz !== "3" ? (
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(9px)" }}>
          <rect x={-40} y={1180} width={1160} height={800} fill="#2a2e36" />
          <rect x={-40} y={1180} width={1160} height={30} fill="#5a6270" opacity={0.6} />
          <path d="M -40 1560 L 1120 1520 L 1120 1980 L -40 1980 Z" fill="#e8e8ea" opacity={0.9} />
          {/* resepsiyonist: koyu ceket omuzlar + topuz (arkadan) */}
          <path d="M 120 1980 Q 140 1600 300 1540 Q 420 1500 540 1540 Q 700 1600 720 1980 Z" fill="#141820" />
          <ellipse cx={420} cy={1430} rx={120} ry={140} fill="#1a1210" />
          <circle cx={420} cy={1270} r={62} fill="#1a1210" />
          <path d="M 300 1440 Q 290 1360 330 1320" stroke="#e8c0a0" strokeWidth={22} fill="none" opacity={0.7} />
        </svg>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------------------------
 * Yemek (üstten): hasır üstünde muz yaprağı; ızgara izli balık (buharı tüter), papaya dilimleri, küçük muzlar,
 * yarım hindistan cevizinde su (yansıma dalgalanır). (D4) kadının eli girer, balıktan bir parça koparıp kendi ağzına götürür.
 * ---------------------------------------------------------------------------------------- */
const YemekUst: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const z = interpolate(f, [0, dur], [1, 1.07], clamp);
  const el = interpolate(t, [0.5, 1.3, 1.7, 2.6], [0, 1, 1, 0], clamp);
  const parcaGitti = t > 1.5;
  return (
    <AbsoluteFill style={{ backgroundColor: "#b8955a", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "50% 50%" }}>
        <defs>
          <linearGradient id="yu_yaprak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3f6e2a" /><stop offset="0.5" stopColor="#5f8a3a" /><stop offset="1" stopColor="#3f6e2a" /></linearGradient>
          <radialGradient id="yu_su" cx="0.45" cy="0.4" r="0.6"><stop offset="0" stopColor="#e8f6f6" /><stop offset="1" stopColor="#9ac8cc" /></radialGradient>
        </defs>
        {/* hasır */}
        <rect width={1080} height={1920} fill="#b8955a" />
        {new Array(40).fill(0).map((_, i) => <path key={i} d={`M ${i * 30} 0 V 1920`} stroke={i % 2 ? "#a8854a" : "#c8a56a"} strokeWidth={14} />)}
        {new Array(64).fill(0).map((_, i) => <path key={`h${i}`} d={`M 0 ${i * 30} H 1080`} stroke="#9a7a44" strokeWidth={3} opacity={0.5} />)}
        {/* muz yaprağı */}
        <path d="M 140 520 Q 540 380 960 560 Q 1000 1000 940 1440 Q 540 1560 120 1420 Q 60 980 140 520 Z" fill="url(#yu_yaprak)" stroke="#2e4a1e" strokeWidth={6} />
        <path d="M 150 980 Q 540 940 960 990" stroke="#a8c87a" strokeWidth={10} fill="none" />
        {new Array(14).fill(0).map((_, i) => <path key={i} d={`M ${200 + i * 52} ${960 - Math.sin(i / 2) * 6} q 10 -200 30 -400 M ${200 + i * 52} ${990} q 10 200 30 400`} stroke="#4f7a2e" strokeWidth={3} fill="none" opacity={0.7} />)}
        {/* ızgara balık */}
        <g transform="rotate(-12 520 900)">
          <path d="M 260 900 Q 420 760 640 820 Q 720 850 760 900 Q 720 950 640 980 Q 420 1040 260 900 Z" fill="#c8945a" stroke="#5a3418" strokeWidth={6} />
          <path d="M 760 900 L 860 830 L 850 970 Z" fill="#b8844a" stroke="#5a3418" strokeWidth={5} />
          {new Array(6).fill(0).map((_, i) => <path key={i} d={`M ${340 + i * 60} 830 l -40 140`} stroke="#3a2010" strokeWidth={9} opacity={0.75} />)}
          <circle cx={320} cy={880} r={14} fill="#f2e8d0" stroke="#3a2010" strokeWidth={4} />
          <circle cx={318} cy={878} r={6} fill="#1a1a1a" />
          {parcaGitti ? <path d="M 520 860 q 40 -10 70 20 q -10 40 -60 40 q -30 -20 -10 -60 Z" fill="#f2e2c8" stroke="#a87a4a" strokeWidth={3} /> : null}
        </g>
        {/* buhar */}
        {new Array(4).fill(0).map((_, i) => { const a = ((t * 30 + i * 20) % 80); return <path key={i} d={`M ${430 + i * 60} ${820 - a * 3} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#ffffff" strokeWidth={10} fill="none" opacity={Math.max(0, 0.35 - a / 240)} strokeLinecap="round" />; })}
        {/* papaya dilimleri + muzlar */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${300 + i * 110} ${1180 + (i % 2) * 30}) rotate(${-20 + i * 15})`}>
            <path d="M -70 0 Q 0 -60 70 0 Q 0 30 -70 0 Z" fill="#f28a3a" stroke="#8a4a1a" strokeWidth={4} />
            <path d="M -50 -2 Q 0 -30 50 -2" stroke="#3a2010" strokeWidth={6} strokeDasharray="4 8" fill="none" />
            <path d="M -70 0 Q 0 -66 70 0" stroke="#5a8a3a" strokeWidth={6} fill="none" />
          </g>
        ))}
        {[0, 1].map((i) => <path key={i} d={`M ${640 + i * 50} 1120 q 40 80 160 110`} stroke="#f2d44a" strokeWidth={46} fill="none" strokeLinecap="round" />)}
        {[0, 1].map((i) => <path key={`k${i}`} d={`M ${640 + i * 50} 1120 q 40 80 160 110`} stroke="#8a7a2a" strokeWidth={3} fill="none" />)}
        {/* yarım hindistan cevizinde su */}
        {/* lifli, düzensiz kenarlı kabuk; içte beyaz hindistan cevizi eti; süt beyazı, yarı saydam su */}
        <path d={new Array(28).fill(0).map((_, i) => { const a = (i / 28) * Math.PI * 2; const r = 150 + (random(`hk${i}`) - 0.5) * 16; return `${i ? "L" : "M"} ${760 + Math.cos(a) * r} ${620 + Math.sin(a) * r}`; }).join(" ") + " Z"} fill="#6a4a2c" stroke={O} strokeWidth={6} strokeLinejoin="round" />
        {new Array(40).fill(0).map((_, i) => { const a = (i / 40) * Math.PI * 2; return <path key={`l${i}`} d={`M ${760 + Math.cos(a) * 128} ${620 + Math.sin(a) * 128} L ${760 + Math.cos(a + 0.05) * 152} ${620 + Math.sin(a + 0.05) * 152}`} stroke="#8a6440" strokeWidth={3} opacity={0.8} />; })}
        <circle cx={760} cy={620} r={124} fill="#f4ecd8" stroke="#d8ccb0" strokeWidth={3} />
        <circle cx={760} cy={620} r={106} fill="#f6f2e8" opacity={0.95} />
        <circle cx={760} cy={620} r={106} fill="#e8eef0" opacity={0.35} />
        <ellipse cx={730 + Math.sin(f / 12) * 6} cy={592} rx={46} ry={14} fill="#ffffff" opacity={0.6} />
        <circle cx={760} cy={620} r={60 + (f % 40)} fill="none" stroke="#ffffff" strokeWidth={2} opacity={Math.max(0, 0.4 - (f % 40) / 100)} />
        {/* (D4) kadının eli: parça koparıp götürür */}
        {el > 0 ? (
          <g transform={`translate(${1150 - 540 * el} ${1500 - 640 * el}) rotate(-35)`}>
            <path d="M 0 0 L 600 120" stroke="#8a5a34" strokeWidth={130} strokeLinecap="round" />
            <path d="M 0 0 L 600 120" stroke="#a06a40" strokeWidth={104} strokeLinecap="round" />
            <circle cx={150} cy={30} r={30} fill="#c9a24a" stroke={O} strokeWidth={3} />
            <ellipse cx={-40} cy={-10} rx={70} ry={50} fill="#a06a40" stroke={O} strokeWidth={4} />
            {[-30, 0, 30].map((d, k) => <ellipse key={k} cx={-110} cy={-20 + d} rx={34} ry={16} fill="#a06a40" stroke={O} strokeWidth={3} />)}
            {parcaGitti ? <path d="M -140 -20 q 20 -14 40 0 q -6 18 -26 18 Z" fill="#f2e2c8" stroke="#a87a4a" strokeWidth={2} /> : null}
          </g>
        ) : null}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(40,20,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------------------------
 * Sözleşme (kapak sayfası): fildişi kâğıt (#f8f5ee), lacivert mürekkep (#1d2a44), yıldızsız "Z" logosu ve altın nokta,
 * "ZENITH GRUP HOLDİNG · ANLAŞMA TASLAĞI", "$50.000.000.000", boş imza alanları, kum ve su lekesi, zımba izi.
 * faz "tut": yaşlının nasırlı eli (ön koluyla) tutar, okunur (ateş ışığı titreşir).
 * faz "burus": eli kapanırken kâğıt 6 ara biçimle buruşur, küçülür.
 * faz "ates": ateşte top açılır, tutar ~1.5 sn okunur, kara cephe turuncu kenarla ilerler, kül yükselir.
 * ---------------------------------------------------------------------------------------- */
const KAGIT = "#f8f5ee";
const MUR = "#1d2a44";
const SozlesmeSayfa: React.FC<{ yanik?: number; buruşma?: number }> = ({ yanik = 0, buruşma = 0 }) => {
  // sayfa koordinatı: 0..700 x 0..960
  const jitter = (i: number) => (random(`br${i}`) - 0.5) * 120 * buruşma;
  const pts: [number, number][] = [[0, 0], [175, 0], [350, 0], [525, 0], [700, 0], [700, 240], [700, 480], [700, 720], [700, 960], [525, 960], [350, 960], [175, 960], [0, 960], [0, 720], [0, 480], [0, 240]];
  const poly = pts.map(([x, y], i) => `${x + jitter(i)} ${y + jitter(i + 50)}`).join(" L ");
  // yanma cephesi: alt kenardan (sol alt köşe önde) düzensiz yükselir
  const cephe = (x: number) => 1010 - yanik * 1250 + (700 - x) * 0.25 * Math.min(1, yanik * 3) + Math.sin(x / 37 + 1.3) * 26 + Math.sin(x / 13) * 10 + (random(`c${Math.round(x / 35)}`) - 0.5) * 30;
  const xs = new Array(21).fill(0).map((_, i) => 700 - i * 35);
  const cepheYol = xs.map((x) => `L ${x} ${cephe(x)}`).join(" ") + ` L -200 ${cephe(0)}`;
  const cepheCizgi = "M " + xs.slice().reverse().map((x) => `${x} ${cephe(x)}`).join(" L ");
  return (
    <g>
      <g clipPath={yanik > 0 ? "url(#sz_kalan)" : undefined}>
      <defs>
        <clipPath id="sz_kagit"><path d={`M ${poly} Z`} /></clipPath>
        <clipPath id="sz_kalan"><path d={`M -200 -200 H 900 V ${cephe(700)} ${cepheYol} V -200 Z`} /></clipPath>
        <filter id="sz_kor" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id="sz_leke"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="11" /><feColorMatrix values="0 0 0 0 0.75  0 0 0 0 0.68  0 0 0 0 0.5  0 0 0 0.55 0" /></filter>
      </defs>
      <path d={`M ${poly} Z`} fill={KAGIT} stroke="#b8b0a0" strokeWidth={3} />
      <g clipPath="url(#sz_kagit)">
        {/* su ve kum lekesi */}
        <rect x={0} y={560} width={700} height={400} filter="url(#sz_leke)" opacity={0.6} />
        {new Array(30).fill(0).map((_, i) => <circle key={i} cx={(i * 137) % 700} cy={700 + ((i * 251) % 260)} r={2} fill="#c8a870" opacity={0.7} />)}
        {/* logo: yıldızsız Z + altın nokta */}
        <circle cx={350} cy={150} r={56} fill="none" stroke={MUR} strokeWidth={8} />
        <path d="M 322 126 H 378 L 324 176 H 380" stroke={MUR} strokeWidth={10} fill="none" strokeLinejoin="round" />
        <circle cx={392} cy={110} r={8} fill="#c9a24a" />
        <text x={350} y={250} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={34} letterSpacing={6} fill={MUR}>ZENITH GRUP HOLDİNG</text>
        <path d="M 120 274 H 580" stroke={MUR} strokeWidth={3} />
        <text x={350} y={334} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={40} fill={MUR}>ANLAŞMA TASLAĞI</text>
        <text x={350} y={380} textAnchor="middle" fontFamily="Georgia, serif" fontSize={22} fill="#4a5470">Gizli · Yalnızca taraflar içindir</text>
        <text x={350} y={500} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={74} fill={MUR}>$50.000.000.000</text>
        <text x={350} y={548} textAnchor="middle" fontFamily="Georgia, serif" fontSize={24} fill="#4a5470">(elli milyar ABD doları)</text>
        {[630, 680, 730].map((y, i) => <path key={y} d={`M 90 ${y} H ${i === 2 ? 420 : 610}`} stroke="#9aa0b0" strokeWidth={5} />)}
        <text x={90} y={850} fontFamily="Georgia, serif" fontSize={24} fill={MUR}>Zenith Grup adına</text>
        <path d="M 90 880 H 300" stroke={MUR} strokeWidth={2} />
        <text x={390} y={850} fontFamily="Georgia, serif" fontSize={24} fill={MUR}>……… adına</text>
        <path d="M 390 880 H 610" stroke={MUR} strokeWidth={2} />
        {/* zımba izi */}
        <path d="M 40 30 L 60 50 M 52 26 L 72 46" stroke="#8a8e92" strokeWidth={4} />
        {/* kırışıklık çizgileri (buruşma arttıkça) */}
        {new Array(Math.round(buruşma * 14)).fill(0).map((_, i) => <path key={i} d={`M ${random(`k${i}`) * 700} ${random(`l${i}`) * 960} L ${random(`m${i}`) * 700} ${random(`n${i}`) * 960}`} stroke="#c8c0b0" strokeWidth={3} />)}
        {yanik > 0 ? (
          <g>
            {/* kömürleşmiş şerit + kahverengi kavrulma */}
            <path d={cepheCizgi} stroke="#c89a5a" strokeWidth={150} fill="none" opacity={0.35} />
            <path d={cepheCizgi} stroke="#4a2a14" strokeWidth={70} fill="none" opacity={0.85} />
            <path d={cepheCizgi} stroke="#1a1210" strokeWidth={34} fill="none" />
          </g>
        ) : null}
      </g>
      </g>
      {yanik > 0 ? (
        <g clipPath="url(#sz_kagit)">
          {/* kor kenar */}
          <path d={cepheCizgi} stroke="#ff8a2a" strokeWidth={16} fill="none" filter="url(#sz_kor)" />
          <path d={cepheCizgi} stroke="#ffd070" strokeWidth={4} fill="none" transform="translate(0 6)" />
        </g>
      ) : null}
    </g>
  );
};

/* ------------------------------------------------------------------------------------------
 * Omuz bastırma (yakın, üstten-yandan): Emir'in göğsü ve omzu (yırtık beyaz gömlek, kan lekesi, yaprak sargı).
 * Gövde kalkmaya çalışır (kameraya doğru büyür); kadının iki eli (sağ bilekte altın bilezik) sol üstten girer,
 * sol avuç omza, sağ avuç göğse oturur, gövdeyi geri yatırır; avuçların çevresinde gömlek kırışır.
 * Emir'in sağ eli kadının bileğini kavrar, sonra gevşeyip düşer (vazgeçiş). Yüz kadraja girmez (yalnız çene ucu).
 * ---------------------------------------------------------------------------------------- */
const OmuzBastir: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ease = (x: number) => x * x * (3 - 2 * x);
  const kalk = interpolate(t, [0, 0.7, 1.5], [0.2, 1, 0], { ...clamp, easing: ease }); // gövde kalkışı
  const nefes = Math.sin(t * 5.5) * (t > 1.5 ? 0.012 : 0.02);
  const elGir = interpolate(t, [0.25, 0.85], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const bas = interpolate(t, [0.85, 1.5], [0, 1], { ...clamp, easing: ease });
  const sc = 1 + kalk * 0.07 + nefes;
  const gx = -kalk * 30, gy = -kalk * 50;
  const z = interpolate(f, [0, dur], [1, 1.05], clamp);
  const SKIN = "#ecc19c", SKIN2 = "#d8a67f", KSK = "#b8805a", KSK2 = "#9a6644", GOM = "#e6e0d4", GOM2 = "#c8c0b0";
  const omuz = { x: 290, y: 760 }, gogus = { x: 470, y: 1200 };
  // elin oturduğu yer gövdeyle birlikte hareket eder
  const tr = (p: { x: number; y: number }) => ({ x: 540 + (p.x - 540) * sc + gx, y: 1000 + (p.y - 1000) * sc + gy });
  const o = tr(omuz), g = tr(gogus);
  const kol = (to: { x: number; y: number }, from: { x: number; y: number }, bilezik: boolean, rot: number) => {
    const ex = from.x + (to.x - from.x) * elGir, ey = from.y + (to.y - from.y) * elGir;
    const dx = ex - from.x, dy = ey - from.y;
    const ang = (Math.atan2(to.y - from.y + 1e-3, to.x - from.x) * 180) / Math.PI;
    const yay = 1 + bas * 0.1; // bastırınca avuç yayılır
    return (
      <g>
        {/* ön kol: kadraj dışından ele */}
        <path d={`M ${from.x - 900 * Math.cos((ang * Math.PI) / 180)} ${from.y - 900 * Math.sin((ang * Math.PI) / 180)} L ${ex - Math.cos((ang * Math.PI) / 180) * 200} ${ey - Math.sin((ang * Math.PI) / 180) * 200}`} stroke={O} strokeWidth={250} strokeLinecap="round" />
        <path d={`M ${from.x - 900 * Math.cos((ang * Math.PI) / 180)} ${from.y - 900 * Math.sin((ang * Math.PI) / 180)} L ${ex - Math.cos((ang * Math.PI) / 180) * 200} ${ey - Math.sin((ang * Math.PI) / 180) * 200}`} stroke={KSK} strokeWidth={238} strokeLinecap="round" />
        <path d={`M ${from.x - 900 * Math.cos((ang * Math.PI) / 180) + 30} ${from.y - 900 * Math.sin((ang * Math.PI) / 180) + 30} L ${ex + 30 - dx * 0.0} ${ey + 30 - dy * 0.0}`} stroke={KSK2} strokeWidth={50} strokeLinecap="round" opacity={0.3} />
        <g transform={`translate(${ex} ${ey}) rotate(${ang + rot}) scale(${1.6 * yay} 1.6)`}>
          {bilezik ? <g>
            <rect x={-150} y={-70} width={46} height={140} rx={16} fill="#c9a24a" stroke={O} strokeWidth={5} />
            <path d="M -140 -60 V 60" stroke="#f0d890" strokeWidth={6} opacity={0.7} />
          </g> : null}
          {/* avuç sırtı */}
          <path d="M -100 -66 Q -30 -86 60 -70 Q 110 -60 118 0 Q 110 60 60 70 Q -30 86 -100 66 Z" fill={KSK} stroke={O} strokeWidth={5} />
          {/* parmaklar (bastırınca düzleşir) */}
          {[-48, -16, 16, 46].map((yy, i) => (
            <path key={i} d={`M 100 ${yy} q ${70 + (i === 1 || i === 2 ? 14 : 0)} ${-4 + bas * 3} ${92 + (i === 1 || i === 2 ? 16 : 0) - (1 - bas) * 14} ${-2}`} stroke={O} strokeWidth={36} strokeLinecap="round" fill="none" />
          ))}
          {[-48, -16, 16, 46].map((yy, i) => (
            <path key={`i${i}`} d={`M 100 ${yy} q ${70 + (i === 1 || i === 2 ? 14 : 0)} ${-4 + bas * 3} ${92 + (i === 1 || i === 2 ? 16 : 0) - (1 - bas) * 14} ${-2}`} stroke={KSK} strokeWidth={27} strokeLinecap="round" fill="none" />
          ))}
          {/* başparmak */}
          <path d="M 20 -60 Q 70 -92 122 -86" stroke={O} strokeWidth={38} strokeLinecap="round" fill="none" />
          <path d="M 20 -60 Q 70 -92 122 -86" stroke={KSK} strokeWidth={29} strokeLinecap="round" fill="none" />
          {/* eklem çizgileri */}
          {[-46, -15, 16, 45].map((yy, i) => <path key={`k${i}`} d={`M 92 ${yy - 9} q 6 9 0 18`} stroke={KSK2} strokeWidth={3} fill="none" />)}
          <path d="M -60 -30 Q 0 -40 60 -30 M -60 20 Q 0 28 60 22" stroke={KSK2} strokeWidth={3} fill="none" opacity={0.6} />
        </g>
      </g>
    );
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#a8884a", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "45% 45%" }}>
        <defs>
          <radialGradient id="ob_isik" cx="0.62" cy="0.38" r="0.75"><stop offset="0" stopColor="#fff1c8" stopOpacity={0.28} /><stop offset="1" stopColor="#000" stopOpacity={0.35} /></radialGradient>
        </defs>
        {/* hasır döşek */}
        <rect width={1080} height={1920} fill="#c9a868" />
        {new Array(70).fill(0).map((_, i) => <path key={i} d={`M ${-400 + i * 30} 0 L ${i * 30 + 300} 1920`} stroke={i % 2 ? "#b8955a" : "#d8b878"} strokeWidth={13} />)}
        {/* gövdenin döşeğe düşen gölgesi */}
        <ellipse cx={600 + gx * 0.4} cy={1150} rx={560 - kalk * 40} ry={760} fill="#000" opacity={0.18 + kalk * 0.06} transform="rotate(-24 600 1150)" />
        <g transform={`translate(${gx} ${gy}) translate(540 1000) scale(${sc}) translate(-540 -1000)`}>
          {/* çene ve boyun: yüzün alt kısmı üst kenarda (ağız köşesi, kirli sakal), boyun kısa */}
          <path d="M 300 380 L 330 600 L 690 600 L 710 380 Z" fill={SKIN} stroke={O} strokeWidth={6} />
          <path d="M 640 380 L 660 600 L 690 600 L 710 380 Z" fill={SKIN2} opacity={0.8} />
          <path d="M 140 -80 Q 150 200 300 330 Q 420 430 510 440 Q 610 430 720 330 Q 870 200 880 -80 Z" fill={SKIN} stroke={O} strokeWidth={7} />
          <path d="M 200 120 Q 260 330 420 410 Q 510 440 600 410 Q 760 330 820 120 Q 760 300 600 370 Q 510 400 420 370 Q 260 300 200 120 Z" fill="#5a4a40" opacity={0.22} />
          {new Array(60).fill(0).map((_, i) => <circle key={i} cx={230 + ((i * 97) % 560)} cy={170 + ((i * 61) % 230)} r={3} fill="#4a3a30" opacity={0.45} />)}
          <path d="M 440 120 Q 510 150 580 120" stroke={O} strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M 470 40 Q 510 30 550 40" stroke="#c88a7a" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} />
          {/* gövde: yırtık gömlek */}
          <path d="M 180 560 Q 420 470 760 520 Q 1020 600 1120 980 L 1160 2000 L 120 2000 Q 60 1500 90 1100 Q 110 720 180 560 Z" fill={GOM} stroke={O} strokeWidth={7} />
          {/* yaka */}
          <path d="M 330 560 L 430 700 L 520 540 M 520 540 L 600 700 L 700 560" stroke={O} strokeWidth={6} fill={GOM2} />
          <path d="M 430 700 L 520 640 L 600 700 L 560 1900" stroke={O} strokeWidth={5} fill="none" />
          {[820, 1060, 1300, 1540].map((yy) => <circle key={yy} cx={520 + (yy - 700) * 0.035} cy={yy} r={13} fill="#f4f0e8" stroke={O} strokeWidth={4} />)}
          {/* kırışıklar (bastırınca avuç çevresinde artar) */}
          {new Array(10).fill(0).map((_, i) => <path key={i} d={`M ${omuz.x + Math.cos(i) * 150} ${omuz.y + Math.sin(i * 1.7) * 130} q ${30} ${20} ${60 + i * 4} ${10}`} stroke={GOM2} strokeWidth={5} fill="none" opacity={0.3 + bas * 0.6} />)}
          {new Array(12).fill(0).map((_, i) => <path key={`g${i}`} d={`M ${gogus.x + Math.cos(i * 1.3) * 170} ${gogus.y + Math.sin(i * 2.1) * 150} q 40 -10 70 ${20 - i * 3}`} stroke={GOM2} strokeWidth={5} fill="none" opacity={0.3 + bas * 0.6} />)}
          {/* yırtık + kan */}
          <path d="M 820 820 l 50 40 l -30 30 l 60 50 l -20 40" stroke={O} strokeWidth={5} fill="none" />
          <path d="M 830 840 l 40 30 l -26 26 l 50 46 l -40 20 Z" fill={SKIN} opacity={0.9} />
          <ellipse cx={300} cy={1300} rx={90} ry={60} fill="#7a1a14" opacity={0.28} />
          <ellipse cx={760} cy={1500} rx={60} ry={40} fill="#7a1a14" opacity={0.22} />
          {/* yaprak sargı (göğüsten çapraz) */}
          <path d="M 80 1500 Q 600 1200 1150 1020 L 1160 1140 Q 620 1320 100 1640 Z" fill="#5f8a3a" stroke="#2e4a1e" strokeWidth={5} />
          {new Array(8).fill(0).map((_, i) => <path key={i} d={`M ${180 + i * 120} ${1520 - i * 60} l 40 -40`} stroke="#9cc46a" strokeWidth={4} />)}
        </g>
        {/* kadının elleri */}
        {kol(o, { x: -120, y: 260 }, false, -6)}
        {kol(g, { x: -200, y: 700 }, true, 4)}
        <rect width={1080} height={1920} fill="url(#ob_isik)" />
        {/* hasırdan sızan ışık şeridi */}
        <path d="M 600 -100 L 760 -100 L 260 2000 L 100 2000 Z" fill="#fff1c8" opacity={0.08} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------------------------
 * Yemek (Emir'in elinde, onun bakışından): sol eli (bilekte durmuş saat, yaprak sargı) yarım hindistan cevizi
 * kabuğunu tutar; içinde süt beyazı su hafifçe çalkalanır. Arka planda bulanık kulübe ve kadının silueti.
 * ---------------------------------------------------------------------------------------- */
const YemekEl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1, 1.08], clamp);
  const sal = Math.sin(f / 7) * 3; // el titrer
  const SK = "#ecc19c", SK2 = "#d8a67f";
  const cx = 540 + sal, cy = 900;
  return (
    <AbsoluteFill style={{ backgroundColor: "#6a4a2c", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(10px)" }}>
        <rect width={1080} height={1920} fill="#7a5a32" />
        {new Array(24).fill(0).map((_, i) => <rect key={i} x={i * 48} y={0} width={20} height={1920} fill="#5a3e20" opacity={0.6} />)}
        <path d="M 760 0 L 880 0 L 660 1920 L 520 1920 Z" fill="#fff0c0" opacity={0.25} />
        {/* kadın silueti (arkada, solda) */}
        <ellipse cx={170} cy={520} rx={110} ry={130} fill="#2a1a10" />
        <path d="M 40 1100 Q 60 700 170 660 Q 280 700 300 1100 Z" fill="#b8955a" />
      </svg>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "50% 48%" }}>
        <defs>
          <radialGradient id="ye_su" cx="0.42" cy="0.38" r="0.7"><stop offset="0" stopColor="#fbf8f0" /><stop offset="1" stopColor="#dfe4e0" /></radialGradient>
        </defs>
        {/* ön kol (alttan, sol el): yırtık beyaz manşet, yaprak sargı, saat */}
        <path d={`M ${cx - 60} ${cy + 260} L ${cx + 260} 2100`} stroke={O} strokeWidth={300} strokeLinecap="round" />
        <path d={`M ${cx - 60} ${cy + 260} L ${cx + 260} 2100`} stroke={SK} strokeWidth={286} strokeLinecap="round" />
        <path d={`M ${cx + 140} ${cy + 900} L ${cx + 420} 2100 L ${cx - 60} 2100 L ${cx - 40} ${cy + 980} Z`} fill="#e6e0d4" stroke={O} strokeWidth={6} />
        <path d={`M ${cx - 40} ${cy + 980} l 40 -40 l 30 50 l 40 -60 l 30 40 l 40 -30`} stroke={O} strokeWidth={5} fill="none" />
        {/* saat (bilek) */}
        <g transform={`rotate(-24 ${cx + 40} ${cy + 560})`}>
          <rect x={cx - 120} y={cy + 500} width={330} height={120} fill="#3a2418" stroke={O} strokeWidth={5} />
          <circle cx={cx + 40} cy={cy + 560} r={92} fill="#c0c4c8" stroke={O} strokeWidth={5} />
          <circle cx={cx + 40} cy={cy + 560} r={74} fill="#1f2a44" />
          <path d={`M ${cx + 40} ${cy + 560} L ${cx + 40 + Math.sin(1.108) * 40} ${cy + 560 - Math.cos(1.108) * 40} M ${cx + 40} ${cy + 560} L ${cx + 40 + Math.sin(0.733) * 60} ${cy + 560 - Math.cos(0.733) * 60}`} stroke="#e8ecf0" strokeWidth={7} strokeLinecap="round" />
          <path d={`M ${cx + 70} ${cy + 590} l 14 -10 l 6 -14 M ${cx + 70} ${cy + 590} l -12 -4`} stroke="#fff" strokeWidth={2} opacity={0.7} />
        </g>
        {/* yaprak sargı (bileğin üstünde) */}
        <path d={`M ${cx - 170} ${cy + 700} Q ${cx + 60} ${cy + 640} ${cx + 300} ${cy + 720} L ${cx + 320} ${cy + 800} Q ${cx + 60} ${cy + 720} ${cx - 150} ${cy + 790} Z`} fill="#5f8a3a" stroke="#2e4a1e" strokeWidth={5} />
        {/* avuç: kabuğun altında */}
        <ellipse cx={cx} cy={cy + 240} rx={250} ry={150} fill={SK} stroke={O} strokeWidth={6} />
        {/* yarım hindistan cevizi kabuğu (lifli, düzensiz kenar) */}
        <path d={new Array(32).fill(0).map((_, i) => { const a = (i / 32) * Math.PI * 2; const r = 1 + (random(`ye${i}`) - 0.5) * 0.05; return `${i ? "L" : "M"} ${cx + Math.cos(a) * 300 * r} ${cy + Math.sin(a) * 200 * r}`; }).join(" ") + " Z"} fill="#6a4a2c" stroke={O} strokeWidth={7} strokeLinejoin="round" />
        {new Array(48).fill(0).map((_, i) => { const a = (i / 48) * Math.PI * 2; return <path key={i} d={`M ${cx + Math.cos(a) * 250} ${cy + Math.sin(a) * 165} L ${cx + Math.cos(a + 0.04) * 298} ${cy + Math.sin(a + 0.04) * 198}`} stroke="#8a6440" strokeWidth={4} opacity={0.8} />; })}
        <ellipse cx={cx} cy={cy} rx={250} ry={165} fill="#f4ecd8" stroke="#d8ccb0" strokeWidth={4} />
        <ellipse cx={cx} cy={cy + 6} rx={215} ry={138} fill="url(#ye_su)" />
        <ellipse cx={cx - 60 + Math.sin(f / 9) * 14} cy={cy - 40} rx={80} ry={18} fill="#ffffff" opacity={0.7} />
        <ellipse cx={cx} cy={cy + 6} rx={120 + (f % 45) * 2} ry={(120 + (f % 45) * 2) * 0.64} fill="none" stroke="#ffffff" strokeWidth={3} opacity={Math.max(0, 0.45 - (f % 45) / 100)} />
        {/* parmaklar kabuğu yanlardan sarar (başparmak solda) */}
        <path d={`M ${cx - 300} ${cy + 120} Q ${cx - 330} ${cy + 20} ${cx - 270} ${cy - 40}`} stroke={O} strokeWidth={66} strokeLinecap="round" fill="none" />
        <path d={`M ${cx - 300} ${cy + 120} Q ${cx - 330} ${cy + 20} ${cx - 270} ${cy - 40}`} stroke={SK} strokeWidth={54} strokeLinecap="round" fill="none" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M ${cx + 230 - i * 6} ${cy + 170 - i * 50} Q ${cx + 330} ${cy + 120 - i * 55} ${cx + 300 - i * 8} ${cy + 60 - i * 58}`} stroke={O} strokeWidth={56} strokeLinecap="round" fill="none" />
            <path d={`M ${cx + 230 - i * 6} ${cy + 170 - i * 50} Q ${cx + 330} ${cy + 120 - i * 55} ${cx + 300 - i * 8} ${cy + 60 - i * 58}`} stroke={i % 2 ? SK2 : SK} strokeWidth={45} strokeLinecap="round" fill="none" />
          </g>
        ))}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------------------------
 * İçirme (yakın): Akilla'nın eli (sağ bilekte altın bilezik) hindistan cevizi kabuğunu Emir'in dudaklarına tutar,
 * kabuk yavaşça eğilir; Emir içerken gözünü ondan ayırmaz (bakış kadraj dışında, solda duran kadına).
 * ---------------------------------------------------------------------------------------- */
const Icir: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ease = (x: number) => x * x * (3 - 2 * x);
  const gel = interpolate(t, [0, 0.7], [0, 1], { ...clamp, easing: ease });
  const egim = interpolate(t, [0.7, 2.2], [0, 1], { ...clamp, easing: ease });
  const z = interpolate(f, [0, dur], [1, 1.06], clamp);
  const S = 3400, L = 560 - 0.2 * S, T = 820 - 0.23 * S;
  const mx = 560, my = T + 0.268 * S;
  const kx = interpolate(gel, [0, 1], [-260, mx - 10]), ky = interpolate(gel, [0, 1], [1500, my + 70]);
  const yutkun = t > 1.2 && t < 2.6 ? Math.max(0, Math.sin((t - 1.2) * 6)) * 8 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#6a4a2c", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(9px)" }}>
        <rect width={1080} height={1920} fill="#7a5a32" />
        {new Array(24).fill(0).map((_, i) => <rect key={i} x={i * 48} y={0} width={20} height={1920} fill="#5a3e20" opacity={0.6} />)}
        <path d="M 760 0 L 880 0 L 660 1920 L 520 1920 Z" fill="#fff0c0" opacity={0.22} />
      </svg>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: L, top: T - yutkun * 0.3 }}>
          <Character look={castById("emir_kulube")} size={S} pose={{ emotion: "notr", lookX: -0.75, lookY: -0.1, yaw: -0.12, seed: 3 }} />
        </div>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {/* kadının ön kolu ve eli (soldan alttan) */}
          <path d={`M -200 2000 Q ${kx - 260} ${ky + 300} ${kx - 120} ${ky + 120}`} stroke={O} strokeWidth={170} strokeLinecap="round" fill="none" />
          <path d={`M -200 2000 Q ${kx - 260} ${ky + 300} ${kx - 120} ${ky + 120}`} stroke="#b8805a" strokeWidth={158} strokeLinecap="round" fill="none" />
          <ellipse cx={kx - 170} cy={ky + 200} rx={92} ry={30} fill="#c9a24a" stroke={O} strokeWidth={5} transform={`rotate(-48 ${kx - 170} ${ky + 200})`} />
          {/* kabuk: dudağa değer, içerken eğilir */}
          <g transform={`translate(${kx} ${ky}) rotate(${-10 - 28 * egim})`}>
            <path d="M -170 -20 Q -170 150 0 160 Q 170 150 170 -20 Z" fill="#6a4a2c" stroke={O} strokeWidth={7} />
            {new Array(14).fill(0).map((_, i) => <path key={i} d={`M ${-150 + i * 22} ${10 + Math.abs(i - 6.5) * 4} q 4 40 -2 ${70 - Math.abs(i - 6.5) * 8}`} stroke="#8a6440" strokeWidth={4} opacity={0.7} fill="none" />)}
            <ellipse cx={0} cy={-20} rx={170} ry={32} fill="#f4ecd8" stroke={O} strokeWidth={6} />
            <ellipse cx={0} cy={-18} rx={146} ry={22} fill="#eef0ea" />
          </g>
          {/* el: kabuğu alttan kavrar */}
          <path d={`M ${kx - 150} ${ky + 120} Q ${kx - 40} ${ky + 200} ${kx + 90} ${ky + 150}`} stroke={O} strokeWidth={84} strokeLinecap="round" fill="none" />
          <path d={`M ${kx - 150} ${ky + 120} Q ${kx - 40} ${ky + 200} ${kx + 90} ${ky + 150}`} stroke="#b8805a" strokeWidth={72} strokeLinecap="round" fill="none" />
          {[0, 1, 2].map((i) => <path key={i} d={`M ${kx + 40 + i * 30} ${ky + 150 - i * 8} q 30 -20 40 -70`} stroke={O} strokeWidth={36} strokeLinecap="round" fill="none" />)}
          {[0, 1, 2].map((i) => <path key={`f${i}`} d={`M ${kx + 40 + i * 30} ${ky + 150 - i * 8} q 30 -20 40 -70`} stroke="#b8805a" strokeWidth={27} strokeLinecap="round" fill="none" />)}
          {/* çeneden süzülen damla */}
          {egim > 0.6 ? <circle cx={mx + 120} cy={my + 230 + (t * 60) % 120} r={9} fill="#e8f6ff" opacity={0.8} /> : null}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------------------------
 * Kırık telefon (yakın): Emir'in eli telefonu Akilla'ya doğru tutar; ekranda örümcek ağı çatlağı.
 * Başparmak yan tuşa basar; ekran bir an titrer, yanmaz.
 * ---------------------------------------------------------------------------------------- */
const TelefonKirik: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const z = interpolate(f, [0, dur], [1, 1.07], clamp);
  const bas = interpolate(t, [0.4, 0.55, 0.8, 0.95], [0, 1, 1, 0], clamp);
  const titre = t > 0.6 && t < 0.85 && f % 3 === 0 ? 0.22 : 0;
  const SK = "#ecc19c";
  const px = 330, py = 520, pw = 420, ph = 860;
  const cxk = px + pw * 0.72, cyk = py + ph * 0.3;
  return (
    <AbsoluteFill style={{ backgroundColor: "#6a4a2c", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(10px)" }}>
        <rect width={1080} height={1920} fill="#7a5a32" />
        {new Array(24).fill(0).map((_, i) => <rect key={i} x={i * 48} y={0} width={20} height={1920} fill="#5a3e20" opacity={0.6} />)}
        <ellipse cx={860} cy={560} rx={120} ry={140} fill="#2a1a10" />
        <path d="M 700 1200 Q 720 760 860 720 Q 1000 760 1020 1200 Z" fill="#c8a870" />
      </svg>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "50% 45%" }}>
        {/* el: ön kol alttan gelir, avuç telefonun arkasında (alt kısmı ve kenarları görünür) */}
        <path d={`M ${px + pw / 2 + 40} ${py + ph + 80} L ${px + pw / 2 + 160} 2100`} stroke={O} strokeWidth={250} strokeLinecap="round" />
        <path d={`M ${px + pw / 2 + 40} ${py + ph + 80} L ${px + pw / 2 + 160} 2100`} stroke={SK} strokeWidth={238} strokeLinecap="round" />
        <path d={`M ${px + pw / 2 + 60} 1880 L ${px + pw / 2 + 420} 2100 L ${px + pw / 2 - 120} 2100 Z`} fill="#e6e0d4" stroke={O} strokeWidth={6} />
        <ellipse cx={px + pw / 2 + 20} cy={py + ph - 60} rx={pw / 2 + 70} ry={210} fill={SK} stroke={O} strokeWidth={6} />
        {/* telefon gövdesi */}
        <rect x={px - 14} y={py - 14} width={pw + 28} height={ph + 28} rx={62} fill="#1a1c20" stroke={O} strokeWidth={7} />
        <rect x={px} y={py} width={pw} height={ph} rx={50} fill="#08090b" />
        <rect x={px} y={py} width={pw} height={ph} rx={50} fill="#9aa4b4" opacity={titre} />
        <rect x={px + pw * 0.38} y={py + 22} width={pw * 0.24} height={22} rx={11} fill="#000" />
        {/* yan tuş */}
        <rect x={px + pw + 10} y={py + 230} width={14} height={110} rx={6} fill="#2a2c30" stroke={O} strokeWidth={3} />
        {/* örümcek ağı çatlak */}
        <defs><clipPath id="tk_ekran"><rect x={px} y={py} width={pw} height={ph} rx={50} /></clipPath></defs>
        <g stroke="#e8eef4" strokeWidth={3} fill="none" opacity={0.75} strokeLinejoin="round" clipPath="url(#tk_ekran)">
          {new Array(9).fill(0).map((_, i) => { const a = (i / 9) * Math.PI * 2 + 0.3; const r1 = 120 + random(`tc${i}`) * 90, r2 = 300 + random(`td${i}`) * 300; return <path key={i} d={`M ${cxk} ${cyk} L ${cxk + Math.cos(a) * r1} ${cyk + Math.sin(a) * r1} L ${cxk + Math.cos(a + 0.12) * r2} ${cyk + Math.sin(a + 0.12) * r2}`} />; })}
          {[50, 110, 190].map((r, j) => <path key={`r${j}`} d={new Array(10).fill(0).map((_, i) => { const a = (i / 9) * Math.PI * 2 + 0.3; return `${i ? "L" : "M"} ${cxk + Math.cos(a) * r * (0.85 + random(`rr${j}${i}`) * 0.3)} ${cyk + Math.sin(a) * r * (0.85 + random(`rq${j}${i}`) * 0.3)}`; }).join(" ")} />)}
        </g>
        <circle cx={cxk} cy={cyk} r={14} fill="#e8eef4" opacity={0.6} />
        {/* parmaklar telefonun sol kenarını sarar (avuçtan çıkar), başparmak sağ kenardan yan tuşa uzanır */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M ${px - 50} ${py + ph - 120 - i * 110} Q ${px - 30} ${py + ph - 170 - i * 110} ${px + 22} ${py + ph - 175 - i * 108}`} stroke={O} strokeWidth={66} strokeLinecap="round" fill="none" />
            <path d={`M ${px - 50} ${py + ph - 120 - i * 110} Q ${px - 30} ${py + ph - 170 - i * 110} ${px + 22} ${py + ph - 175 - i * 108}`} stroke={SK} strokeWidth={54} strokeLinecap="round" fill="none" />
          </g>
        ))}
        <path d={`M ${px - 60} ${py + ph - 80} L ${px - 50} ${py + ph - 470}`} stroke={SK} strokeWidth={40} />
        <path d={`M ${px + pw + 60} ${py + ph - 60} Q ${px + pw + 80} ${py + 520} ${px + pw + 20 - bas * 10} ${py + 300}`} stroke={O} strokeWidth={78} strokeLinecap="round" fill="none" />
        <path d={`M ${px + pw + 60} ${py + ph - 60} Q ${px + pw + 80} ${py + 520} ${px + pw + 20 - bas * 10} ${py + 300}`} stroke={SK} strokeWidth={66} strokeLinecap="round" fill="none" />
        <ellipse cx={px + pw + 20 - bas * 10} cy={py + 300} rx={18} ry={14} fill="#f2d8c0" opacity={0.8} />
        {/* cam yansıması */}
        <path d={`M ${px + 40} ${py + 60} L ${px + 140} ${py + 60} L ${px + 40} ${py + 300} Z`} fill="#ffffff" opacity={0.07} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Taş halkalı kamp ateşi (meydan geniş planındakiyle aynı): taşlar, odunlar, katmanlı alev dilleri. h: alev yüksekliği çarpanı. */
const KampAtesi: React.FC<{ f: number; cx: number; by: number; h: number; on?: boolean }> = ({ f, cx, by, h, on }) => {
  const katman = [
    { n: 5, w: 120, hb: 340, c: "url(#sa_dis)", sp: 0 },
    { n: 6, w: 84, hb: 250, c: "url(#sa_orta)", sp: 37 },
    { n: 5, w: 50, hb: 150, c: "url(#sa_ic)", sp: 71 },
  ];
  return (
    <g>
      {!on ? (
        <g>
          {/* odunlar */}
          <path d={`M ${cx - 300} ${by + 30} L ${cx + 260} ${by - 40}`} stroke="#3a2010" strokeWidth={56} strokeLinecap="round" />
          <path d={`M ${cx - 260} ${by - 50} L ${cx + 300} ${by + 20}`} stroke="#4a2a14" strokeWidth={50} strokeLinecap="round" />
          <path d={`M ${cx - 300} ${by + 30} L ${cx + 260} ${by - 40}`} stroke="#ff7a2a" strokeWidth={6} strokeDasharray="30 50" opacity={0.7} />
        </g>
      ) : null}
      {on ? katman.map((L, li) => (
        <g key={li} opacity={0.95}>
          {new Array(L.n).fill(0).map((_, i) => {
            const x0 = cx - 330 + (i + 0.5) * (660 / L.n) + Math.sin(i * 7 + li) * 16;
            const ph = f / (3.1 + (i % 3) * 0.7) + i * 1.9 + L.sp;
            const hh = L.hb * h * (0.75 + 0.3 * Math.sin(ph) * Math.sin(ph * 0.53 + 2)) * (1 - 0.35 * Math.abs(i / (L.n - 1) - 0.5));
            const sway = Math.sin(f / 6 + i * 2.3 + li) * L.w * 0.4;
            const w = L.w;
            return <path key={i} d={`M ${x0 - w} ${by} C ${x0 - w * 1.05} ${by - hh * 0.45}, ${x0 - w * 0.25 + sway * 0.5} ${by - hh * 0.62}, ${x0 + sway} ${by - hh} C ${x0 + w * 0.35 + sway * 0.4} ${by - hh * 0.62}, ${x0 + w * 1.05} ${by - hh * 0.4}, ${x0 + w} ${by} Z`} fill={L.c} />;
          })}
        </g>
      )) : null}
    </g>
  );
};

/** Taş halkası (ön kısmı alevlerin önünde çizilir) */
const TasHalka: React.FC<{ cx: number; by: number; on: boolean }> = ({ cx, by, on }) => (
  <g>
    {new Array(11).fill(0).map((_, i) => {
      const a = (i / 11) * Math.PI * 2;
      const x = cx + Math.cos(a) * 400, y = by + 40 + Math.sin(a) * 110;
      const front = Math.sin(a) > 0;
      if (front !== on) return null;
      return <ellipse key={i} cx={x} cy={y} rx={78} ry={46} fill={front ? "#6a625a" : "#4a443e"} stroke="#1a1412" strokeWidth={5} />;
    })}
  </g>
);

const Sozlesme: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const faz = text?.[0] ?? "tut";
  const fl = 0.85 + 0.15 * Math.sin(f / 2.3) * Math.sin(f / 5.1);
  if (faz === "ates") {
    // 0-0,7 sn: buruşuk top yukarıdan ateşin ortasına düşer · 0,7-1,7: ısıyla açılır (yatık) · ~3 sn tutar okunur · sonra yanar
    // text[1] === "on": soğuk açılış kancası (sayfa açık başlar, hemen yanmaya başlar)
    const on = text?.[1] === "on" ? 2.4 : 0;
    const t = f / fps + on;
    const T = dur / fps + on;
    const dus = interpolate(t, [0, 0.7], [0, 1], { ...clamp, easing: (x) => x * x });
    const ac = interpolate(t, [0.75, 1.8], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
    const yanik = interpolate(t, [Math.min(3.2, T - 1.2), T - 0.1], [0, 1], clamp);
    const cx = 540, by = 1560;
    const topX = interpolate(dus, [0, 1], [700, cx]), topY = interpolate(dus, [0, 1], [-200, by - 60]);
    const sc = interpolate(ac, [0, 1], [0.22, 0.98]);
    const alevH = 0.75 + 0.25 * ac + yanik * 0.4;
    return (
      <AbsoluteFill style={{ backgroundColor: "#160904", overflow: "hidden" }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
          <defs>
            <radialGradient id="sa_kor" cx="0.5" cy="0.75" r="0.75"><stop offset="0" stopColor="#ff8a2a" /><stop offset="0.45" stopColor="#8a2c08" /><stop offset="1" stopColor="#160904" /></radialGradient>
            <linearGradient id="sa_dis" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ff5a10" /><stop offset="0.7" stopColor="#d8300a" /><stop offset="1" stopColor="#8a1a04" stopOpacity={0.2} /></linearGradient>
            <linearGradient id="sa_orta" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ffb030" /><stop offset="0.8" stopColor="#ff7a1a" /><stop offset="1" stopColor="#ff5a10" stopOpacity={0.3} /></linearGradient>
            <linearGradient id="sa_ic" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff4c0" /><stop offset="0.6" stopColor="#ffd860" /><stop offset="1" stopColor="#ffb030" stopOpacity={0.4} /></linearGradient>
            <filter id="sa_glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="40" /></filter>
          </defs>
          <rect width={1080} height={1920} fill="url(#sa_kor)" opacity={fl} />
          {/* arka plan: akşam meydanı, bulanık kulübe silüetleri */}
          <path d="M 0 900 L 140 780 L 280 900 Z M 760 880 L 920 740 L 1080 880 Z" fill="#2a1408" opacity={0.6} />
          <ellipse cx={cx} cy={by - 40} rx={520} ry={300} fill="#ff7a1a" opacity={0.3 * fl} filter="url(#sa_glow)" />
          <TasHalka cx={cx} by={by} on={false} />
          <KampAtesi f={f} cx={cx} by={by} h={0} />
          {/* arka alevler */}
          <KampAtesi f={f} cx={cx} by={by} h={alevH * 0.85} on />
          {/* kâğıt: düşen top → ateşte yatık açılan sayfa */}
          {ac <= 0 ? (
            <g transform={`translate(${topX} ${topY}) rotate(${dus * 540}) scale(${3.2})`}>
              <path d="M -30 -4 L -20 -34 L 4 -40 L 28 -26 L 34 2 L 22 28 L -6 34 L -28 20 Z" fill="#f2eee4" stroke="#1a1412" strokeWidth={2.5} strokeLinejoin="round" />
              <path d="M -18 -20 L 2 -4 L 22 -14 M 2 -4 L -4 22 M -22 8 L -4 2" stroke="#b8b0a0" strokeWidth={2} fill="none" />
            </g>
          ) : (
            <g transform={`translate(${cx} ${by - 150}) rotate(${-4 + Math.sin(f / 9) * 0.6}) scale(${sc * 0.8} ${sc * 0.46}) translate(-350 -480)`}>
              <SozlesmeSayfa yanik={yanik} buruşma={0.9 - 0.45 * ac} />
            </g>
          )}
          {/* ön alevler (sayfanın alt kenarını yalar) */}
          <g opacity={0.9}>
            <KampAtesi f={f + 40} cx={cx} by={by + 30} h={alevH * 0.42} on />
          </g>
          <TasHalka cx={cx} by={by} on={true} />
          {/* kül ve kıvılcım */}
          {new Array(26).fill(0).map((_, i) => { const a = (f * 3 + i * 31) % 200; return <rect key={i} x={260 + ((i * 89) % 560) + Math.sin(a / 15) * 30} y={by - 200 - a * 5} width={6} height={4} fill={i % 3 ? "#ffd060" : "#3a3030"} opacity={Math.max(0, 1 - a / 200)} />; })}
        </svg>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
      </AbsoluteFill>
    );
  }
  // "tut": yaşlının eli sayfayı tutar · "burus": parmaklar kapanır, sayfa ara biçimlerle topa döner, avuçta top kalır
  const c = faz === "burus" ? interpolate(t, [0.15, dur / fps - 0.35], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) }) : 0;
  const z = interpolate(f, [0, dur], faz === "burus" ? [1.25, 1.35] : [1, 1.06], clamp);
  // sayfa kenar noktaları merkeze toplanır (buruşma), düzensiz sapma artar
  const merkez: [number, number] = [470, 700];
  const N = 24;
  const kenar: [number, number][] = new Array(N).fill(0).map((_, i) => {
    const u = i / N;
    const per = u * 3320; // 700+960+700+960
    if (per < 700) return [per, 0];
    if (per < 1660) return [700, per - 700];
    if (per < 2360) return [700 - (per - 1660), 960];
    return [0, 960 - (per - 2360)];
  });
  const k = 1 - 0.86 * c;
  const poly = kenar.map(([x, y], i) => {
    const jx = (random(`bx${i}`) - 0.5) * 140 * c * (1 - c * 0.5);
    const jy = (random(`by${i}`) - 0.5) * 140 * c * (1 - c * 0.5);
    return `${merkez[0] + (x - 350) * k + jx} ${merkez[1] + (y - 480) * k + jy}`;
  }).join(" L ");
  const kapan = c; // parmakların kapanması
  const elX = 760 - c * 200, elY = 1240 - c * 460;
  return (
    <AbsoluteFill style={{ backgroundColor: "#3a2418", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 85%, rgba(255,150,60,0.55) 0%, rgba(120,50,20,0.6) 40%, rgba(30,15,10,1) 100%)", filter: "blur(4px)" }} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z}) rotate(${faz === "burus" ? 6 : 0}deg)`, transformOrigin: "50% 42%" }}>
        <defs>
          <clipPath id="sz_burus"><path d={`M ${poly} Z`} /></clipPath>
        </defs>
        {/* yaşlının ön kolu + avuç (kâğıdın arkasında) */}
        <g transform={`translate(${elX} ${elY})`}>
          <path d="M 0 0 L 420 700" stroke="#5a341c" strokeWidth={230} strokeLinecap="round" />
          <path d="M 0 0 L 420 700" stroke="#a8714a" strokeWidth={204} strokeLinecap="round" />
          {new Array(6).fill(0).map((_, i) => <path key={i} d={`M ${60 + i * 50} ${120 + i * 80} q 40 -20 60 10`} stroke="#8a5a34" strokeWidth={4} fill="none" />)}
          {new Array(9).fill(0).map((_, i) => <circle key={i} cx={130 + i * 18} cy={260 + i * 26} r={11} fill={i % 2 ? "#c9a24a" : "#e8e0d0"} stroke={O} strokeWidth={2} />)}
          <ellipse cx={-10} cy={-20} rx={130} ry={115} fill="#a8714a" stroke={O} strokeWidth={5} />
        </g>
        {/* parmak uçları kâğıdın arkasında (yalnız uçlar görünür) */}
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={elX - 150 + i * 10 + kapan * 60} cy={elY - 150 + i * 62 - kapan * 40} rx={50} ry={28} fill="#a8714a" stroke={O} strokeWidth={4} transform={`rotate(${-30 + kapan * 50} ${elX - 150 + i * 10} ${elY - 150 + i * 62})`} />
        ))}
        {/* sayfa (buruşma: içerik çokgene kırpılır, kırışık çizgileri artar) */}
        <g clipPath="url(#sz_burus)">
          <g transform={`translate(${merkez[0]} ${merkez[1]}) scale(${Math.max(k, 0.2)}) translate(-350 -480)`}>
            <SozlesmeSayfa buruşma={0} />
          </g>
          {new Array(Math.round(c * 22)).fill(0).map((_, i) => <path key={i} d={`M ${merkez[0] + (random(`k${i}`) - 0.5) * 700 * k} ${merkez[1] + (random(`l${i}`) - 0.5) * 960 * k} L ${merkez[0] + (random(`m${i}`) - 0.5) * 700 * k} ${merkez[1] + (random(`n${i}`) - 0.5) * 960 * k}`} stroke="#a8a090" strokeWidth={4} />)}
          <rect x={0} y={0} width={1080} height={1920} fill="#7a6a50" opacity={0.18 * c} />
        </g>
        <path d={`M ${poly} Z`} fill="none" stroke="#8a8274" strokeWidth={4} strokeLinejoin="round" />
        {/* başparmak (önde) + kapanırken öne gelen parmaklar (yumruk) */}
        <g transform={`translate(${elX} ${elY})`}>
          <path d={`M 30 -60 Q ${-60 - kapan * 30} ${-150 + kapan * 40} ${-150 + kapan * 60} ${-150 + kapan * 50}`} stroke={O} strokeWidth={66} strokeLinecap="round" fill="none" />
          <path d={`M 30 -60 Q ${-60 - kapan * 30} ${-150 + kapan * 40} ${-150 + kapan * 60} ${-150 + kapan * 50}`} stroke="#a8714a" strokeWidth={54} strokeLinecap="round" fill="none" />
          <ellipse cx={-150 + kapan * 60} cy={-150 + kapan * 50} rx={16} ry={12} fill="#d8b090" opacity={0.8} />
          {kapan > 0.55 ? [0, 1, 2, 3].map((i) => {
            const o = interpolate(kapan, [0.55, 1], [0, 1], clamp);
            return <path key={i} d={`M ${-100 + i * 40} ${40 - i * 6} q ${-40} ${-30 * o} ${-10} ${-70 * o}`} stroke={O} strokeWidth={50} strokeLinecap="round" fill="none" opacity={o} />;
          }) : null}
          {kapan > 0.55 ? [0, 1, 2, 3].map((i) => {
            const o = interpolate(kapan, [0.55, 1], [0, 1], clamp);
            return <path key={`f${i}`} d={`M ${-100 + i * 40} ${40 - i * 6} q ${-40} ${-30 * o} ${-10} ${-70 * o}`} stroke="#a8714a" strokeWidth={40} strokeLinecap="round" fill="none" opacity={o} />;
          }) : null}
        </g>
      </svg>
      <AbsoluteFill style={{ background: `rgba(255,140,40,${0.08 * fl})`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Insert7: React.FC<{ kind: Insert7Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "pov_yaprak": return <PovYaprak dur={dur} />;
    case "kol_saati": return <KolSaati dur={dur} text={text} />;
    case "tv_son_dakika": return <TvSonDakika dur={dur} text={text} />;
    case "yemek_ust": return <YemekUst dur={dur} />;
    case "sozlesme": return <Sozlesme dur={dur} text={text} />;
    case "omuz_bastir": return <OmuzBastir dur={dur} />;
    case "yemek_el": return <YemekEl dur={dur} />;
    case "icir": return <Icir dur={dur} />;
    case "telefon_kirik": return <TelefonKirik dur={dur} />;
    default: return null;
  }
};
