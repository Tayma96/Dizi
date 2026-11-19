/* KAT 7 ekleme çekimleri: güvenlik kamerası (CCTV) görüntüleri, kat göstergesi. Hepsi 1080x1920, kendi çizimimiz. */
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Character } from "../rig/Character";
import { castById } from "../cast";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MONO = "'Courier New', monospace";

/** CCTV katmanı: siyah-beyaz yeşilimsi görüntü, tarama çizgileri, parazit, balıkgözü vinyet, kamera adı, REC, saat.
 *  glitchAt: bu karede (6 kare) tarih 19.11.1998'e atlar. startSec: saatin başladığı saniye (03:17:sn). */
const CCTV: React.FC<{ kam: string; children: React.ReactNode; glitchAt?: number; startSec?: number; zoom?: [number, number]; dur: number; caption?: string }> = ({ kam, children, glitchAt, startSec = 41, zoom = [1, 1], dur, caption }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], zoom, { ...clamp, easing: Easing.inOut(Easing.quad) });
  const glitch = glitchAt !== undefined && f >= glitchAt && f < glitchAt + 6;
  const sec = startSec + Math.floor(f / 30);
  const ss = String(sec % 60).padStart(2, "0");
  const date = glitch ? "19.11.1998" : "19.11.2026";
  const jx = glitch ? (random(`gx${f}`) - 0.5) * 40 : 0;
  const noiseRows = new Array(glitch ? 14 : 3).fill(0).map((_, i) => ({ y: random(`ny${f}-${i}`) * 1920, h: 2 + random(`nh${f}-${i}`) * (glitch ? 30 : 6), o: 0.08 + random(`no${f}-${i}`) * (glitch ? 0.4 : 0.12) }));
  return (
    <AbsoluteFill style={{ backgroundColor: "#050605", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${jx}px) scale(${z})`, filter: "grayscale(1) contrast(1.35) brightness(0.95) sepia(0.35) hue-rotate(55deg) saturate(1.4)" }}>
        {children}
      </AbsoluteFill>
      {/* tarama çizgileri + parazit */}
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 5px)" }} />
      {noiseRows.map((r, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: r.y, height: r.h, background: `rgba(220,255,220,${r.o})` }} />)}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 48%, rgba(0,0,0,0.85) 100%)" }} />
      {/* etiketler */}
      <div style={{ position: "absolute", left: 60, top: 150, fontFamily: MONO, fontWeight: 700, fontSize: 46, color: "#e8ffe8", textShadow: "0 0 8px #000" }}>{kam}</div>
      <div style={{ position: "absolute", right: 60, top: 150, fontFamily: MONO, fontWeight: 700, fontSize: 46, color: "#ff3a2a", opacity: Math.floor(f / 15) % 2 ? 1 : 0.25 }}>● REC</div>
      <div style={{ position: "absolute", left: 60, bottom: 380, fontFamily: MONO, fontWeight: 700, fontSize: 50, color: glitch ? "#ff3a2a" : "#e8ffe8", textShadow: "0 0 8px #000" }}>{date}  03:17:{ss}</div>
      {caption ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1180, textAlign: "center", fontFamily: "Inter, Arial, sans-serif", fontWeight: 900, fontSize: 72, color: "#fff", WebkitTextStroke: "3px #000", textShadow: "0 4px 18px #000", opacity: interpolate(f, [0, 4], [0, 1], clamp) }}>{caption}</div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Omuz üstü monitör çekimi: CRT çerçevesi, önde Cemil'in kafa/omuz silueti; ekranın içinde CCTV görüntüsü */
const Monitor: React.FC<{ children: React.ReactNode; dur: number; zoom?: [number, number] }> = ({ children, dur, zoom = [1, 1.08] }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], zoom, { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ backgroundColor: "#07080a", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <div style={{ position: "absolute", left: 110, top: 330, width: 860, height: 1300, borderRadius: 40, background: "#1a1b1e", boxShadow: "0 0 120px rgba(120,170,255,0.25)" }} />
        <div style={{ position: "absolute", left: 150, top: 370, width: 780, height: 1220, borderRadius: 28, overflow: "hidden" }}>
          <div style={{ width: 1080, height: 1920, transform: `scale(${780 / 1080}, ${1220 / 1920})`, transformOrigin: "0 0" }}>{children}</div>
        </div>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
          <rect x={470} y={1630} width={140} height={120} fill="#141518" />
          <path d="M -40 1920 L -40 1560 Q 60 1450 230 1470 Q 330 1480 380 1560 L 420 1920 Z" fill="#0b0c10" />
          <ellipse cx={170} cy={1360} rx={150} ry={175} fill="#0d0e12" />
          <path d="M 40 1320 q 20 -60 70 -70 M 300 1320 q -20 -60 -70 -70" stroke="#3a3c40" strokeWidth={16} fill="none" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Yüzsüz siluet (sırtı dönük): Cemil'inkiyle aynı bekçi üniforması, uzun kollar, eğik baş */
const Siluet: React.FC<{ x: number; y: number; s: number; tilt: number; isim?: number; don?: number }> = ({ x, y, s, tilt, isim = 0, don = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -70 -10 L -78 300 L -30 300 L -10 60 L 10 60 L 30 300 L 78 300 L 70 -10 Z" fill="#0c0e14" />
    <path d="M -110 -330 Q -120 -380 -60 -400 L 60 -400 Q 120 -380 110 -330 L 90 0 L -90 0 Z" fill="#141a28" />
    <rect x={-92} y={-30} width={184} height={22} fill="#05060a" />
    {/* uzun kollar */}
    <path d="M -108 -350 Q -150 -150 -140 120 L -112 124 Q -118 -120 -86 -320 Z" fill="#121826" />
    <path d="M 108 -350 Q 150 -150 140 120 L 112 124 Q 118 -120 86 -320 Z" fill="#121826" />
    <ellipse cx={-126} cy={136} rx={20} ry={30} fill="#0a0a0c" />
    <ellipse cx={126} cy={136} rx={20} ry={30} fill="#0a0a0c" />
    {/* boyun + baş (eğik) */}
    <g transform={`rotate(${tilt} 0 -400)`}>
      <rect x={-24} y={-440} width={48} height={50} fill="#0a0a0c" />
      <ellipse cx={0} cy={-500} rx={66} ry={80} fill="#08080a" />
      {/* kameraya dönen baş: göz çukurları belli belirsiz parlar */}
      {don > 0 ? (
        <g opacity={don}>
          <ellipse cx={-24} cy={-505} rx={11} ry={7} fill="#c8d8c8" opacity={0.55} />
          <ellipse cx={24} cy={-505} rx={11} ry={7} fill="#c8d8c8" opacity={0.55} />
        </g>
      ) : null}
    </g>
    {isim > 0 ? (
      <g opacity={isim}>
        <rect x={20} y={-300} width={70} height={26} fill="#d8d8c8" />
        <text x={55} y={-280} textAnchor="middle" fontFamily={MONO} fontSize={18} fontWeight={700} fill="#111">C.AYDIN</text>
      </g>
    ) : null}
  </g>
);

/** Asansör kabini, tavan köşesindeki kameradan: kabin göstergesi, açık kapı (dışarısı karanlık) */
const Kabin: React.FC<{ kat: string; children?: React.ReactNode }> = ({ kat, children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
    <rect width={1080} height={1920} fill="#2a2c26" />
    <path d="M 0 0 L 1080 0 L 880 520 L 200 520 Z" fill="#4a4c44" />
    <path d="M 0 0 L 200 520 L 200 1500 L 0 1920 Z" fill="#3c3e36" />
    <path d="M 1080 0 L 880 520 L 880 1500 L 1080 1920 Z" fill="#34362f" />
    <rect x={200} y={520} width={680} height={980} fill="#44463d" />
    {[0, 1, 2].map((i) => <rect key={i} x={240 + i * 220} y={560} width={180} height={900} fill="none" stroke="#55574c" strokeWidth={6} />)}
    <path d="M 200 1500 L 880 1500 L 1080 1920 L 0 1920 Z" fill="#25261f" />
    <rect x={380} y={40} width={320} height={60} fill="#f2f2e0" opacity={0.85} />
    {/* büyük kat göstergesi (kapının üstü, kameranın tam karşısı) */}
    <rect x={400} y={300} width={280} height={200} rx={14} fill="#060404" stroke="#111" strokeWidth={6} />
    <text x={540} y={465} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={190} fill="#ff2a1a">{kat}</text>
    {/* kabin göstergesi */}
    <rect x={930} y={640} width={110} height={150} rx={10} fill="#060404" stroke="#111" strokeWidth={5} transform="skewY(-12)" />
    <text x={985} y={950} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={120} fill="#ff2a1a" transform="skewY(-12)">{kat}</text>
    {/* açık kapı: karanlık boşluk (önde, alt) */}
    <path d="M 120 1700 L 960 1700 L 1080 1920 L 0 1920 Z" fill="#000" />
    {children}
  </svg>
);

/** KAM 04: kabinde köşeye dönük siluet, baş ilk kareden eğilmeye başlar; büyük "7"; 1998 glitch'i */
const CctvAsansor: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const tilt = interpolate(f, [0, dur], [0, 34], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return (
    <CCTV kam="KAM 04 · ASANSÖR" dur={dur} glitchAt={Math.round(dur * 0.62)} zoom={[1.0, 1.06]} caption={f < 75 ? "Bu binada 7. kat yok." : undefined}>
      <Kabin kat="7">
        <Siluet x={560} y={1560} s={1.45} tilt={tilt} />
      </Kabin>
    </CCTV>
  );
};

/** KAM 04 yakınlaşma: kabin bomboş */
const CctvBos: React.FC<{ dur: number }> = ({ dur }) => (
  <CCTV kam="KAM 04 · ASANSÖR" dur={dur} startSec={45} zoom={[1.15, 1.35]}>
    <Kabin kat="7" />
  </CCTV>
);

/** KAM 01: lobi, tepeden. Masada Cemil; sandalyesinin hemen arkasında siluet, başı eğik. Ortada 4 kare yaka kartı parlar. */
const CctvLobi: React.FC<{ dur: number; mod?: string }> = ({ dur, mod = "normal" }) => {
  const f = useCurrentFrame();
  const isim = mod === "normal" && f >= Math.round(dur * 0.5) && f < Math.round(dur * 0.5) + 4 ? 1 : 0;
  const don = mod === "don" ? interpolate(f, [dur * 0.2, dur * 0.8], [0, 1], clamp) : 0;
  const tilt = mod === "don" ? interpolate(f, [dur * 0.2, dur * 0.8], [28, 4], clamp) : 28;
  return (
    <CCTV kam="KAM 01 · LOBİ" dur={dur} startSec={mod === "normal" ? 58 : mod === "don" ? 9 : 16} zoom={mod === "normal" ? [1.0, 1.45] : [1.25, 1.4]}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        <rect width={1080} height={1920} fill="#1e201c" />
        <rect x={360} y={300} width={720} height={800} fill="#5a5c54" />
        <rect x={360} y={300} width={720} height={800} fill="url(#clIs)" />
        <defs><radialGradient id="clIs" cx="0.5" cy="0.35" r="0.6"><stop offset="0" stopColor="#8a8c80" /><stop offset="1" stopColor="#5a5c54" stopOpacity={0} /></radialGradient></defs>
        <path d="M 0 1100 L 1080 980 L 1080 1920 L 0 1920 Z" fill="#2c2e28" />
        {/* asansör (solda, uzakta) */}
        <rect x={60} y={500} width={260} height={560} fill="#4a4c44" stroke="#111" strokeWidth={6} />
        <rect x={150} y={440} width={90} height={50} fill="#060404" />
        <text x={195} y={482} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={44} fill="#ff2a1a">0</text>
        {/* masa (tepeden, açılı) */}
        <path d="M 360 1250 L 1000 1160 L 1060 1420 L 420 1520 Z" fill="#3a3630" stroke="#111" strokeWidth={6} />
        <rect x={470} y={1150} width={160} height={110} fill="#5a6a70" stroke="#111" strokeWidth={5} transform="rotate(-8 550 1205)" />
      </svg>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        {mod !== "bos" ? <Siluet x={700} y={1300} s={1.25} tilt={tilt} isim={isim} don={don} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 700 - 0.2 * 760, top: 1010 }}>
        <Character look={castById("cemil")} size={760} pose={{ body: "sit", emotion: "notr", yaw: -0.3, lookX: -0.6, lookY: 0.5, seed: 3 }} />
      </div>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        <path d="M 420 1440 L 1060 1340 L 1080 1920 L 400 1920 Z" fill="#3a3630" stroke="#111" strokeWidth={6} />
      </svg>
    </CCTV>
  );
};

/** Lobideki gerçek kat göstergesi: büyük kırmızı rakam, text[0] = başlangıç kat, hızlanarak 0'a iner */
const KatGostergesi: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const from = Number((text ?? ["7"])[0]);
  const p = interpolate(f, [0, dur * 0.95], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const kat = Math.max(0, Math.round(from - p * from));
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0d" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <rect x={190} y={620} width={700} height={560} rx={30} fill="#3a3d44" stroke="#000" strokeWidth={10} />
        <rect x={250} y={680} width={580} height={440} rx={20} fill="#0c0606" />
        <text x={540} y={1070} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={420} fill="#ff2a1a">{kat}</text>
        <text x={540} y={1070} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={420} fill="#ff2a1a" opacity={0.4} filter="url(#kgP)">{kat}</text>
        <defs><filter id="kgP"><feGaussianBlur stdDeviation="16" /></filter></defs>
        <path d="M 540 560 l -40 40 l 80 0 Z" fill="#ff2a1a" opacity={0.85} transform="rotate(180 540 580)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Cemil'in arkası: karanlık mermer duvar, sandalye sırtı, kimse yok; floresan titrer */
const ArkaBos: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const fl = random(`ab${Math.floor(f / 2)}`) > 0.8 ? 0.4 : 1;
  const z = interpolate(f, [0, dur], [1.05, 1.0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0b0d", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})` }}>
        <rect width={1080} height={1920} fill="#1c1e23" />
        {[0, 1, 2].map((i) => <rect key={i} x={i * 360} y={200} width={356} height={1300} fill={i % 2 ? "#202329" : "#1d2025"} stroke="#141619" strokeWidth={4} />)}
        <rect x={200} y={90} width={680} height={30} rx={8} fill="#e8f2ea" opacity={0.7 * fl} />
        <rect y={1500} width={1080} height={420} fill="#141619" />
        {/* sandalye sırtı (önde, bulanık değil) */}
        <path d="M 300 1920 L 320 1300 Q 540 1240 760 1300 L 780 1920 Z" fill="#101114" stroke="#000" strokeWidth={8} />
        <rect width={1080} height={1920} fill="#000" opacity={0.25 + (1 - fl) * 0.4} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)" }} />
    </AbsoluteFill>
  );
};

/** KAM 04: boş kabin, kapı kapanır; kabin göstergesi 0'dan 7'ye çıkar */
const CctvCik: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const k = Math.min(7, Math.floor(interpolate(f, [dur * 0.25, dur * 0.85], [0, 7.99], clamp)));
  const door = interpolate(f, [0, dur * 0.2], [1, 0], clamp);
  return (
    <CCTV kam="KAM 04 · ASANSÖR" dur={dur} startSec={31} zoom={[1.0, 1.08]}>
      <Kabin kat={String(k)}>
        <rect x={0} y={1700} width={540 * (1 - door)} height={220} fill="#3a3c36" />
        <rect x={1080 - 540 * (1 - door)} y={1700} width={540 * (1 - door)} height={220} fill="#363832" />
      </Kabin>
    </CCTV>
  );
};

export type Insert4Kind = "cctv_asansor" | "cctv_bos" | "cctv_lobi" | "kat_gostergesi" | "arka_bos" | "cctv_cik";
export const INSERT4_KINDS: Insert4Kind[] = ["cctv_asansor", "cctv_bos", "cctv_lobi", "kat_gostergesi", "arka_bos", "cctv_cik"];

export const Insert4: React.FC<{ kind: Insert4Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "cctv_asansor": return <CctvAsansor dur={dur} />;
    case "cctv_bos": return text?.[0] === "monitor" ? <Monitor dur={dur} zoom={[1, 1.12]}><CctvBos dur={dur} /></Monitor> : <CctvBos dur={dur} />;
    case "cctv_lobi": return text?.[1] === "monitor" ? <Monitor dur={dur} zoom={[1, 1.25]}><CctvLobi dur={dur} mod={text?.[0]} /></Monitor> : <CctvLobi dur={dur} mod={text?.[0]} />;
    case "arka_bos": return <ArkaBos dur={dur} />;
    case "cctv_cik": return <CctvCik dur={dur} />;
    case "kat_gostergesi": return <KatGostergesi dur={dur} text={text} />;
  }
};
