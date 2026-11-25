/* 7/24 ekleme çekimleri: kural kâğıdı, ıslak ayak izleri, düşen ekmek, kasa çekmecesi, telefon ekranı. Kendi çizimimiz. */
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SANS = "Inter, Arial, sans-serif";

const Vig: React.FC<{ v?: number }> = ({ v = 0.6 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${v}) 100%)` }} />
);

export const KURALLAR = [
  "Herkese hoş geldiniz diyeceksin ancak kapı kendiliğinden açılırsa sakın söyleme!",
  "Depodan bir ses duyarsan kulak asma, çağırırsa gitme!",
  "Asla kimseye saygısızlık yapma! Tartışmaya girme!",
  "Kepenkler bir anda kapanırsa sessizce açılmasını bekle.",
];

/** Lamine kural kâğıdı, kasanın arkasına bantlı. text[0] = vurgulanacak kural no (1-5) */
const Kurallar: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const vurgu = Number(text?.[0] ?? 0);
  // text[1] === "sirali": kurallar tek tek belirir (okunacak kadar ara ile)
  const sirali = text?.[1] === "sirali";
  const adim = (dur * 0.82) / KURALLAR.length;
  const z = interpolate(f, [0, dur], [1.0, 1.05], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#c8ccd0", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z}) rotate(-1.5deg)` }}>
        <div style={{ position: "absolute", left: 80, top: 330, width: 920, height: 1260, background: "#fbfaf4", boxShadow: "0 16px 50px rgba(0,0,0,0.35)", borderRadius: 8, padding: "60px 56px", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 380, top: -26, width: 160, height: 52, background: "rgba(240,230,170,0.75)", transform: "rotate(-3deg)" }} />
          <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#b81818", textAlign: "center", letterSpacing: 2, marginBottom: 50 }}>KURALLAR</div>
          {KURALLAR.map((k, i) => (
            <div key={i} style={{ display: "flex", gap: 22, marginBottom: 44, padding: "8px 10px", borderRadius: 10, background: vurgu === i + 1 ? "rgba(255,220,60,0.55)" : "transparent", opacity: sirali ? interpolate(f, [i * adim, i * adim + 10], [0, 1], clamp) : 1, transform: sirali ? `translateY(${interpolate(f, [i * adim, i * adim + 10], [14, 0], clamp)}px)` : undefined }}>
              <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 60, color: "#b81818", minWidth: 56 }}>{i + 1}.</div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, lineHeight: 1.22, color: "#1a1a1a" }}>{k}</div>
            </div>
          ))}
          {text?.[2] ? (
            // B9: kâğıda sonradan eklenen kural, ELLE yazılmış (kırmızı tükenmez); soldan sağa yazılarak belirir
            <div style={{ display: "flex", gap: 22, marginTop: 6, padding: "8px 10px", clipPath: `inset(0 ${interpolate(f, [8, dur * 0.6], [100, 0], clamp)}% 0 0)` }}>
              <div style={{ fontFamily: "'Comic Sans MS', 'Segoe Print', cursive", fontWeight: 700, fontSize: 60, color: "#b81818", minWidth: 56, transform: "rotate(-3deg)" }}>{KURALLAR.length + 1}.</div>
              <div style={{ fontFamily: "'Comic Sans MS', 'Segoe Print', cursive", fontWeight: 700, fontSize: 50, lineHeight: 1.22, color: "#a01010", transform: "rotate(-2deg)" }}>{text[2]}</div>
            </div>
          ) : null}
          <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.45) 42%, rgba(255,255,255,0) 52%)", borderRadius: 8 }} />
        </div>
      </AbsoluteFill>
      <Vig v={0.35} />
    </AbsoluteFill>
  );
};

/** Islak ayak izleri: tepeden, beyaz karo zemin; izler tek tek belirir. text[0] = "kapi" (kapıdan raflara) | "kasa" (kasanın önünde durur) */
const AyakIzi: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const mod = text?.[0] ?? "kapi";
  const n = 8;
  const shown = Math.floor(interpolate(f, [0, dur * 0.85], [0, n + 0.99], clamp));
  return (
    <AbsoluteFill style={{ backgroundColor: "#d8dcd8", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <rect width={1080} height={1920} fill="#dfe3df" />
        {new Array(7).fill(0).map((_, i) => <path key={i} d={`M ${i * 180} 0 L ${i * 180} 1920`} stroke="#c4c8c4" strokeWidth={4} />)}
        {new Array(11).fill(0).map((_, i) => <path key={i} d={`M 0 ${i * 180} L 1080 ${i * 180}`} stroke="#c4c8c4" strokeWidth={4} />)}
        {mod === "kasa" ? <rect x={0} y={0} width={1080} height={360} fill="#d84a2a" stroke="#2a1410" strokeWidth={8} /> : null}
        {new Array(n).fill(0).map((_, i) => {
          if (i >= shown) return null;
          const left = i % 2 === 0;
          const y = mod === "kasa" ? 1820 - i * 175 : 1820 - i * 210;
          const x = 540 + (left ? -70 : 70) + (mod === "kasa" ? 0 : Math.sin(i / 2) * 60);
          const fresh = i === shown - 1 ? 1 : 0.75;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${left ? -6 : 6})`} opacity={fresh}>
              <ellipse cx={0} cy={0} rx={42} ry={74} fill="#7a8a96" opacity={0.55} />
              <ellipse cx={0} cy={-92} rx={30} ry={30} fill="#7a8a96" opacity={0.55} />
              <ellipse cx={0} cy={0} rx={52} ry={86} fill="#9ab0c0" opacity={0.18} />
            </g>
          );
        })}
      </svg>
      <Vig v={0.55} />
    </AbsoluteFill>
  );
};

/** Ekmek reyonu: poşetli ekmekler; biri kendiliğinden kayıp düşer */
const EkmekRaf: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [dur * 0.4, dur * 0.62], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const wob = f < dur * 0.4 ? Math.sin(f / 1.5) * Math.min(1, f / (dur * 0.3)) * 3 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#e8eaec", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <rect width={1080} height={1920} fill="#eef0f2" />
        {[600, 1000, 1400].map((y) => <rect key={y} x={0} y={y} width={1080} height={26} fill="#9aa2a8" />)}
        {[0, 1, 2].map((r) => new Array(4).fill(0).map((_, c) => {
          const isFall = r === 1 && c === 2;
          const x = 80 + c * 250, y = 400 + r * 400;
          const dy = isFall ? t * 900 : 0, rot = isFall ? t * 70 + wob : 0;
          return (
            <g key={`${r}-${c}`} transform={`translate(${x + (isFall ? t * 60 : 0)} ${y + dy}) rotate(${rot} 110 100)`}>
              <rect x={0} y={20} width={220} height={180} rx={70} fill="#e8b878" stroke="#8a5a2a" strokeWidth={6} />
              <rect x={-6} y={14} width={232} height={192} rx={74} fill="#ffffff" opacity={0.3} stroke="#c8ccd0" strokeWidth={4} />
              <path d="M 50 70 q 60 -30 120 0" stroke="#8a5a2a" strokeWidth={6} fill="none" />
            </g>
          );
        }))}
        <rect x={0} y={260} width={1080} height={60} fill="#e8a03a" />
        <text x={540} y={304} textAnchor="middle" fontFamily={SANS} fontSize={40} fontWeight={900} fill="#2a1a0a">EKMEK</text>
      </svg>
      <Vig v={0.6} />
    </AbsoluteFill>
  );
};

/** Yazar kasa çekmecesi kendiliğinden açılır */
const KasaAcilir: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur * 0.25, dur * 0.4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1c1e", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <rect width={1080} height={1920} fill="#2a2e32" />
        <rect x={140} y={500} width={800} height={500} rx={30} fill="#3a3e44" stroke="#0a0b0d" strokeWidth={10} />
        <rect x={200} y={560} width={680} height={200} fill="#3a8a5a" />
        <text x={540} y={690} textAnchor="middle" fontFamily="'Courier New', monospace" fontSize={90} fontWeight={700} fill="#d8ffd8">0,00 ₺</text>
        <g transform={`translate(0 ${o * 380})`}>
          <rect x={120} y={1000} width={840} height={340} fill="#4a4e54" stroke="#0a0b0d" strokeWidth={10} />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={150 + i * 160} y={1030} width={140} height={200} fill="#2a2e32" stroke="#0a0b0d" strokeWidth={5} />)}
          {[0, 1, 2].map((i) => <rect key={i} x={170 + i * 160} y={1060} width={100} height={60} fill={["#6a9a6a", "#9a6aaa", "#c8a06a"][i]} />)}
        </g>
      </svg>
      <Vig v={0.6} />
    </AbsoluteFill>
  );
};

/** Telefon ekranı: "SABRİ ABİ arıyor", titreşim */
/** 7/24 B8 (opt-in, text ["alarm", "00:00"]): Ece'nin elinde titreyen telefon, çalan alarm ekranı */
const TelefonAlarm: React.FC<{ saat: string }> = ({ saat }) => {
  const f = useCurrentFrame();
  const sh = (f % 10) < 6 ? (random(`ta${f}`) - 0.5) * 16 : 0;
  const nab = 1 + 0.06 * Math.sin(f / 2.2);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0e1014", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(120,150,200,0.25) 0%, rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 230 + sh, top: 330, width: 620, height: 1200, borderRadius: 70, background: "#111", border: "14px solid #2a2c32", overflow: "hidden", transform: `rotate(${-3 + sh * 0.15}deg)` }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#2a1a3a,#0a0e1a)" }} />
        <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", fontFamily: SANS, color: "#ffd0c8", fontSize: 46, fontWeight: 800, letterSpacing: 4 }}>⏰ ALARM</div>
        <div style={{ position: "absolute", top: 260, width: "100%", textAlign: "center", fontFamily: SANS, color: "#fff", fontSize: 150, fontWeight: 900, transform: `scale(${nab})` }}>{saat}</div>
        <div style={{ position: "absolute", top: 520, width: "100%", textAlign: "center", fontFamily: SANS, color: "#cfd8e8", fontSize: 40 }}>Vardiya başladı</div>
        <div style={{ position: "absolute", bottom: 150, left: 110, width: 400, height: 120, borderRadius: 60, background: "#d83a3a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, color: "#fff", fontSize: 46, fontWeight: 900 }}>KAPAT</div>
      </div>
      {/* Ece'nin parmakları (hardal kazak kolu) telefonu tutar */}
      <div style={{ position: "absolute", left: 150 + sh, top: 1180, width: 180, height: 120, borderRadius: 60, background: "#f0c8a8", border: "6px solid #2b1d1a", transform: "rotate(-20deg)" }} />
      <div style={{ position: "absolute", left: -120 + sh, top: 1240, width: 330, height: 260, borderRadius: 80, background: "#c8902a", border: "6px solid #2b1d1a", transform: "rotate(-20deg)" }} />
      <Vig v={0.55} />
    </AbsoluteFill>
  );
};

const TelefonEkran: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  if (text?.[0] === "alarm") return <TelefonAlarm saat={text?.[1] ?? "00:00"} />;
  const sh = (f % 12) < 7 ? (random(`te${f}`) - 0.5) * 14 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0e1014", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 230 + sh, top: 360, width: 620, height: 1200, borderRadius: 70, background: "#111", border: "14px solid #2a2c32", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#1a2a3a,#0a1018)" }} />
        <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center", fontFamily: SANS, color: "#cfe0f0", fontSize: 40 }}>gelen arama</div>
        <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", fontFamily: SANS, color: "#fff", fontSize: 78, fontWeight: 900 }}>SABRİ ABİ</div>
        <div style={{ position: "absolute", top: 410, left: 210, width: 200, height: 200, borderRadius: 100, background: "#4a5a6a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 100, fontWeight: 900, color: "#cfe0f0" }}>S</div>
        <div style={{ position: "absolute", bottom: 140, left: 90, width: 130, height: 130, borderRadius: 65, background: "#d83a3a" }} />
        <div style={{ position: "absolute", bottom: 140, right: 90, width: 130, height: 130, borderRadius: 65, background: "#3ab86a", transform: `scale(${1 + 0.08 * Math.sin(f / 3)})` }} />
      </div>
      <Vig v={0.5} />
    </AbsoluteFill>
  );
};

/** Kapüşonlu müşteri (Ece'nin bakışından): kapüşonun içi zifiri, yüz yok; tezgâha tam bozuk para bırakır, sonra yok olur */
const Kapusonlu: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const gone = f > dur * 0.72;
  const coins = Math.min(5, Math.floor(interpolate(f, [dur * 0.25, dur * 0.6], [0, 5.99], clamp)));
  const flick = gone ? (f < dur * 0.78 ? 0.4 : 1) : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: "#d8dcde", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <rect width={1080} height={1920} fill="#dfe3e6" />
        <rect x={0} y={1300} width={1080} height={620} fill="#d84a2a" />
        <rect x={0} y={1260} width={1080} height={60} fill="#f0f0ec" />
        {!gone ? (
          <g opacity={flick}>
            <path d="M 240 1300 L 260 760 Q 540 520 820 760 L 840 1300 Z" fill="#26282c" />
            <path d="M 330 760 Q 540 520 750 760 L 760 1000 Q 540 1100 320 1000 Z" fill="#1a1c20" stroke="#0a0b0d" strokeWidth={8} />
            <ellipse cx={540} cy={860} rx={170} ry={190} fill="#020203" />
            <path d="M 300 1060 q -40 140 -20 240 M 780 1060 q 40 140 20 240" stroke="#1a1c20" strokeWidth={60} strokeLinecap="round" />
          </g>
        ) : null}
        {new Array(coins).fill(0).map((_, i) => <ellipse key={i} cx={420 + i * 60} cy={1285 - (i % 2) * 6} rx={26} ry={10} fill="#c8a85a" stroke="#6a5020" strokeWidth={3} />)}
      </svg>
      <Vig v={0.5} />
    </AbsoluteFill>
  );
};

export type Insert5Kind = "kurallar" | "ayak_izi" | "ekmek_raf" | "kasa_acilir" | "telefon_ekran" | "kapusonlu";
export const INSERT5_KINDS: Insert5Kind[] = ["kurallar", "ayak_izi", "ekmek_raf", "kasa_acilir", "telefon_ekran", "kapusonlu"];

export const Insert5: React.FC<{ kind: Insert5Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "kurallar": return <Kurallar dur={dur} text={text} />;
    case "ayak_izi": return <AyakIzi dur={dur} text={text} />;
    case "ekmek_raf": return <EkmekRaf dur={dur} />;
    case "kasa_acilir": return <KasaAcilir dur={dur} />;
    case "telefon_ekran": return <TelefonEkran dur={dur} text={text} />;
    case "kapusonlu": return <Kapusonlu dur={dur} />;
  }
};
