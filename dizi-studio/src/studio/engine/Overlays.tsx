import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF } from "../../dizi/fonts";
import type { TBeat } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------------- Altyazı (klasik, alt kısım; satır ≤37 karakter, konuşmaya senkron parçalar) ---------------- */
export const KaraokeSubtitle: React.FC<{ tb: TBeat; speakerName?: string; speakerColor?: string }> = ({ tb, speakerName, speakerColor }) => {
  const frame = useCurrentFrame(); // relative to the beat
  const { fps } = useVideoConfig();
  if (tb.beat.type !== "line") return null;
  const beat = tb.beat;
  const words = tb.voice?.words?.length
    ? tb.voice.words
    : beat.text.split(" ").map((w, i, arr) => {
        const d = tb.dur / fps / arr.length;
        return { w, start: i * d, end: (i + 1) * d };
      });
  const vStart = tb.voice?.from ?? 0;
  const time = (frame - vStart) / fps;
  // chunk into groups of max 6 words; show the chunk containing the current word
  // satır başına en fazla 37 karakter (mobil okunabilirlik)
  const chunks: (typeof words)[] = [];
  let cur: typeof words = [];
  for (const w of words) {
    const len = cur.reduce((n, x) => n + x.w.length + 1, 0) + w.w.length;
    if (cur.length && len > 37) {
      chunks.push(cur);
      cur = [];
    }
    cur.push(w);
  }
  if (cur.length) chunks.push(cur);
  let ci = chunks.findIndex((c) => time < c[c.length - 1].end + 0.05);
  if (ci < 0) ci = chunks.length - 1;
  const chunk = chunks[ci];
  const vo = beat.voiceover;
  const inA = interpolate(frame, [0, 5], [0, 1], clamp);
  const outA = interpolate(frame, [tb.dur - 5, tb.dur], [1, 0], clamp);
  // Klasik altyazı: ekranın alt kısmında, sade beyaz yazı + ince kontur. Alt kenar y=1450
  // (Reels/TikTok açıklama metninin üstünde kalır).
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 1920 - 1450, display: "flex", flexDirection: "column", alignItems: "center", opacity: inA * outA }}>
        {speakerName && !vo ? (
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: speakerColor ?? "#ffd166", marginBottom: 6, WebkitTextStroke: "6px #000", paintOrder: "stroke fill" }}>
            {speakerName.toLocaleUpperCase("tr-TR")}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 54,
            lineHeight: 1.25,
            textAlign: "center",
            color: vo ? "#f2f2f2" : "#ffffff",
            fontStyle: vo ? "italic" : "normal",
            WebkitTextStroke: "8px #000",
            paintOrder: "stroke fill",
            textShadow: "0 3px 10px rgba(0,0,0,0.65)",
          }}
        >
          {chunk.map((w) => w.w).join(" ")}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Ekran yazısı (ör. "15 YIL ÖNCE") ---------------- */
export const TitleCard: React.FC<{ text: string; sub?: string; dur: number }> = ({ text, sub, dur }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 10, dur - 10, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: `rgba(0,0,0,${0.55 * a})` }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: "#f4ead8", opacity: a, letterSpacing: 6, textAlign: "center", padding: "0 60px", translate: `0px ${(1 - a) * 30}px` }}>
        {text}
      </div>
      {sub ? <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#ff8f8f", opacity: a, marginTop: 24 }}>{sub}</div> : null}
    </AbsoluteFill>
  );
};

/* ---------------- Telefon mesajı ---------------- */
export const PhoneMessage: React.FC<{ from: string; text: string; dur: number }> = ({ from, text, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = interpolate(frame, [0, 12], [1, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const out = interpolate(frame, [dur - 8, dur], [1, 0], clamp);
  const typing = frame < 0.9 * fps;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: `rgba(0,0,0,${0.5 * out})` }}>
      <div style={{ width: 620, height: 1100, borderRadius: 70, backgroundColor: "#0e0f12", border: "14px solid #2a2c32", translate: `0px ${slide * 1400}px`, opacity: out, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 150, backgroundColor: "#1c1e24", display: "flex", alignItems: "flex-end", padding: "0 34px 24px", gap: 20 }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: "#556", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: 34, color: "#fff" }}>
            {from.slice(0, 1)}
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#fff" }}>{from}</div>
        </div>
        <div style={{ padding: 34 }}>
          <div style={{ display: "inline-block", maxWidth: 480, backgroundColor: "#2c2f38", color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 44, lineHeight: 1.25, padding: "22px 30px", borderRadius: 34, borderBottomLeftRadius: 8 }}>
            {typing ? <span style={{ letterSpacing: 8 }}>{".".repeat(1 + (Math.floor(frame / 6) % 3))}</span> : text}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Bölüm sonu kartı ---------------- */
export const EndCard: React.FC<{ series: string; episodeNo: number; text?: string; sub?: string }> = ({ series, episodeNo, text, sub }) => {
  const frame = useCurrentFrame();
  const words = series.toLocaleUpperCase("tr-TR").split(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: "#07090c", justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 122, color: "#f4ead8", textAlign: "center", lineHeight: 1.05, width: 940, textShadow: "0 0 40px rgba(255,190,120,0.35)" }}>
        {words.map((w, i) => (
          <span key={i} style={{ display: "inline-block", marginRight: 26, opacity: interpolate(frame, [6 + i * 5, 18 + i * 5], [0, 1], clamp), translate: `0px ${interpolate(frame, [6 + i * 5, 18 + i * 5], [30, 0], clamp)}px` }}>
            {w}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 44, fontFamily: SANS, fontWeight: 900, fontSize: 44, letterSpacing: 14, color: "#ff6b6b", opacity: interpolate(frame, [30, 45], [0, 1], clamp) }}>
        BÖLÜM {episodeNo}
      </div>
      <div style={{ marginTop: 70, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: "#fff", border: "3px solid rgba(255,255,255,0.5)", padding: "18px 44px", borderRadius: 60, opacity: interpolate(frame, [50, 65], [0, 1], clamp) }}>
        {text ?? "Devamı yarın · Takip et"}
      </div>
      {sub ? <div style={{ marginTop: 26, fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#bbb", opacity: interpolate(frame, [60, 75], [0, 1], clamp) }}>{sub}</div> : null}
    </AbsoluteFill>
  );
};

/* ---------------- Belge (dosya / sözleşme yakın çekimi) ---------------- */
export const DocumentCard: React.FC<{ title: string; lines: string[]; imza?: string; dur: number }> = ({ title, lines, imza, dur }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 10, dur - 8, dur], [0, 1, 1, 0], clamp);
  const zoom = interpolate(frame, [0, dur], [1, 1.08], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: `rgba(0,0,0,${0.6 * a})` }}>
      <div style={{ width: 760, padding: "70px 64px", backgroundColor: "#f6f2e8", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", opacity: a, scale: `${zoom}`, rotate: "-1.5deg", fontFamily: SERIF }}>
        <div style={{ fontSize: 40, fontWeight: 900, color: "#222", textAlign: "center", marginBottom: 36, letterSpacing: 1 }}>{title}</div>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#333", marginBottom: 18, lineHeight: 1.3 }}>{l}</div>
        ))}
        {imza ? (
          <div style={{ marginTop: 40, display: "flex", justifyContent: "flex-end" }}>
            <svg width="300" height="110" viewBox="0 0 300 110">
              <path
                d="M 10 80 C 40 20 60 100 90 50 S 140 30 150 70 S 200 90 230 40 S 270 60 290 30"
                fill="none"
                stroke="#1a3a8a"
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={600}
                strokeDashoffset={interpolate(frame, [12, 40], [600, 0], clamp)}
              />
            </svg>
          </div>
        ) : null}
        {imza ? <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#555", textAlign: "right" }}>{imza}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Ayna görünümü ---------------- */
export const MirrorOverlay: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.0) 30%, rgba(220,235,245,0.18) 42%, rgba(255,255,255,0.0) 50%), radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(20,30,35,0.55) 100%)" }} />
    <AbsoluteFill style={{ border: "34px solid #8a9298", boxShadow: "inset 0 0 0 6px #2b2b2b" }} />
  </AbsoluteFill>
);

/* ---------------- Köşe yazısı (ör. "GÜN 183"): daktilo gibi belirir, telefonda okunur ---------------- */
export const CornerLabel: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const n = Math.min(text.length, Math.floor(interpolate(f, [8, 8 + text.length * 2.5], [0, text.length], clamp)));
  const cursor = Math.floor(f / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{ padding: "300px 0 0 70px" }}>
      <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 64, letterSpacing: 8, color: "#f2f2ee", textShadow: "0 0 18px rgba(0,0,0,0.9), 0 2px 4px #000" }}>
        {text.slice(0, n)}
        <span style={{ opacity: cursor ? 0.9 : 0 }}>_</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Ekleme (insert) yakın planları ---------------- */
const OUTL = "#1b1412";

const InsertBileklik: React.FC<{ text: string[]; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1, 1.07], clamp);
  const tw = Math.sin(f / 5) * 1.5;
  return (
    <AbsoluteFill style={{ backgroundColor: "#a3adb0" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})` }}>
        <defs>
          <radialGradient id="ins-vig" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        {/* battaniye zemini */}
        <rect width={1080} height={1920} fill="#8c979a" />
        <path d="M 0 700 Q 540 640 1080 720 M 0 1300 Q 540 1240 1080 1320" stroke="#74808a" strokeWidth={10} fill="none" />
        {/* bilek yakın planı: pijama kolu (kadrodaki renk), kalın kol, kolu saran bileklik, başparmaklı el */}
        <path d="M -60 740 Q 380 700 700 760 Q 800 900 760 1130 Q 400 1200 -60 1180 Z" fill="#e6b08a" stroke={OUTL} strokeWidth={10} />
        <path d="M -60 700 L 170 712 Q 214 950 190 1200 L -60 1220 Z" fill="#8fa6b5" stroke={OUTL} strokeWidth={10} />
        <path d="M 170 712 Q 214 950 190 1200" stroke="#7790a0" strokeWidth={18} fill="none" />
        <path d="M 40 760 Q 70 950 40 1160" stroke="#7790a0" strokeWidth={8} fill="none" opacity={0.7} />
        <g transform={`rotate(${tw} 760 940)`}>
          <path d="M 680 770 Q 900 740 980 880 Q 1010 1020 930 1110 Q 800 1170 700 1100 Z" fill="#e6b08a" stroke={OUTL} strokeWidth={10} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M 950 ${830 + i * 58} q 92 -8 116 24 q 6 30 -26 32 q -54 2 -90 -8`} fill="#e6b08a" stroke={OUTL} strokeWidth={8} strokeLinejoin="round" />
          ))}
          {/* başparmak */}
          <path d="M 760 760 q 60 -70 140 -50 q 30 16 4 40 q -60 0 -110 40" fill="#e6b08a" stroke={OUTL} strokeWidth={8} strokeLinejoin="round" />
        </g>
        {/* bileklik: kolu sarar (üst ve alt kenar kolun arkasına döner), çıtçıtlı */}
        <path d="M 360 730 Q 330 940 360 1150 L 600 1150 Q 630 940 600 730 Z" fill="#f6f6f2" stroke={OUTL} strokeWidth={9} />
        <path d="M 360 730 Q 480 712 600 730 M 360 1150 Q 480 1168 600 1150" stroke="#c8ccd0" strokeWidth={10} fill="none" />
        <path d="M 600 730 Q 630 940 600 1150" stroke="#d8dcde" strokeWidth={14} fill="none" />
        <circle cx={588} cy={940} r={14} fill="#c8ccd0" stroke={OUTL} strokeWidth={4} />
        {text.map((t, i) => (
          <text key={`h${i}`} x={480} y={870 + i * 70} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={i === 0 ? 50 : 40} fill="#1a1e24">
            {t}
          </text>
        ))}
        <rect width={1080} height={1920} fill="url(#ins-vig)" />
      </svg>
    </AbsoluteFill>
  );
};

const InsertKapiKolu: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // kol yavaşça aşağı döner (biri kapıyı açıyor), sonunda bir an durur
  const a = interpolate(f, [0.5 * fps, 1.9 * fps], [0, 34], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const z = interpolate(f, [0, dur], [1.0, 1.09], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0e1214" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})` }}>
        <defs>
          <linearGradient id="ins-steel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8e9aa1" />
            <stop offset="1" stopColor="#5e6a71" />
          </linearGradient>
          <linearGradient id="ins-lever" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e4e9ec" />
            <stop offset="1" stopColor="#9aa4aa" />
          </linearGradient>
          <radialGradient id="ins-vig2" cx="0.45" cy="0.48" r="0.65">
            <stop offset="0.45" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.7" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#ins-steel)" />
        <path d="M 0 400 H 1080 M 0 1560 H 1080" stroke="#4e5a60" strokeWidth={14} />
        {/* kapı aralığı (sağda): koridordan sızan ışık */}
        <rect x={0} y={0} width={70} height={1920} fill="#2a3134" />
        <rect x={30} y={0} width={14} height={1920} fill="#fff6d8" opacity={interpolate(f, [1.6 * fps, 2.3 * fps], [0, 0.55], clamp)} />
        {/* çizikler ve boya izleri */}
        <path d="M 620 600 L 760 640 M 300 1300 L 420 1270 M 700 1350 L 860 1420" stroke="#4e5a60" strokeWidth={4} opacity={0.6} />
        <rect x={160} y={500} width={460} height={140} rx={8} fill="#3a4448" stroke={OUTL} strokeWidth={6} />
        {/* rozet + kol */}
        <ellipse cx={420} cy={960} rx={110} ry={150} fill="#a8b2b8" stroke={OUTL} strokeWidth={8} />
        <circle cx={420} cy={1060} r={22} fill="#2a3134" />
        {/* anahtar deliğinde dönen anahtar (kilit sesiyle) */}
        <g transform={`rotate(${interpolate(f, [0.15 * fps, 0.45 * fps], [0, 90], clamp)} 420 1060)`}>
          <rect x={414} y={1030} width={12} height={60} rx={4} fill="#c9a75a" stroke={OUTL} strokeWidth={3} />
        </g>
        <g transform={`rotate(${a} 420 930)`}>
          <rect x={360} y={880} width={520} height={100} rx={50} fill="url(#ins-lever)" stroke={OUTL} strokeWidth={8} />
          <rect x={400} y={898} width={440} height={16} rx={8} fill="#ffffff" opacity={0.55} />
          <circle cx={420} cy={930} r={66} fill="#c8d0d4" stroke={OUTL} strokeWidth={8} />
        </g>
        <rect width={1080} height={1920} fill="url(#ins-vig2)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Hap kabı yakın planı: beyaz yuvarlak hap + yarısı mavi kapsül (dizi boyunca sabit) */
const InsertHaplar: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1, 1.08], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#9aa4a8" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})` }}>
        <defs>
          <radialGradient id="hp-vig" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0.5" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        {/* metal tepsi */}
        <rect x={-40} y={700} width={1160} height={700} rx={40} fill="#c4ccd2" stroke={OUTL} strokeWidth={10} />
        <rect x={0} y={740} width={1080} height={620} rx={30} fill="#b4bcc2" />
        {/* kâğıt hap kabı (üstten) */}
        <ellipse cx={540} cy={1040} rx={300} ry={230} fill="#f6f2e8" stroke={OUTL} strokeWidth={10} />
        <ellipse cx={540} cy={1060} rx={250} ry={180} fill="#ebe5d6" />
        {new Array(16).fill(0).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return <path key={i} d={`M ${540 + Math.cos(a) * 250} ${1060 + Math.sin(a) * 180} L ${540 + Math.cos(a) * 300} ${1040 + Math.sin(a) * 230}`} stroke="#d8d0be" strokeWidth={6} />;
        })}
        {/* beyaz yuvarlak hap */}
        <ellipse cx={440} cy={1070} rx={78} ry={62} fill="#fbfbf8" stroke={OUTL} strokeWidth={8} />
        <path d="M 380 1070 H 500" stroke="#c8c8c0" strokeWidth={6} />
        {/* yarısı mavi kapsül */}
        <g transform="rotate(-28 640 1040)">
          <rect x={560} y={1000} width={90} height={80} rx={40} fill="#fbfbf8" stroke={OUTL} strokeWidth={8} />
          <rect x={640} y={1000} width={90} height={80} rx={40} fill="#3f86d6" stroke={OUTL} strokeWidth={8} />
          <rect x={630} y={1004} width={20} height={72} fill="#3f86d6" />
          <rect x={590} y={1014} width={40} height={10} rx={5} fill="#ffffff" opacity={0.7} />
        </g>
        <rect width={1080} height={1920} fill="url(#hp-vig)" />
      </svg>
    </AbsoluteFill>
  );
};

export const InsertShot: React.FC<{ kind: "bileklik" | "kapi_kolu" | "haplar"; text?: string[]; dur: number }> = ({ kind, text, dur }) =>
  kind === "bileklik" ? <InsertBileklik text={text ?? []} dur={dur} /> : kind === "haplar" ? <InsertHaplar dur={dur} /> : <InsertKapiKolu dur={dur} />;
