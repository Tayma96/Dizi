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
const SKIN = "#e0b08c";
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
        {/* kol (önlük kolundan çıkıyor): kadrajı dolduran bilek yakın planı */}
        <path d="M -60 800 Q 400 770 700 820 Q 780 900 760 1060 Q 420 1120 -60 1110 Z" fill={SKIN} stroke={OUTL} strokeWidth={9} />
        <path d="M -60 770 L 150 780 Q 180 960 160 1130 L -60 1140 Z" fill="#a9c4d6" stroke={OUTL} strokeWidth={9} />
        <path d="M 150 780 Q 180 960 160 1130" stroke="#8aa8bc" strokeWidth={14} fill="none" />
        {/* el: avuç + kıvrık parmaklar */}
        <g transform={`rotate(${tw} 780 950)`}>
          <path d="M 700 830 Q 900 800 960 900 Q 990 1010 900 1070 Q 790 1110 720 1050 Z" fill={SKIN} stroke={OUTL} strokeWidth={9} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M 930 ${860 + i * 52} q 90 -6 110 24 q 4 26 -26 28 q -50 2 -84 -6`} fill={SKIN} stroke={OUTL} strokeWidth={7} strokeLinejoin="round" />
          ))}
          <path d="M 760 1050 q 40 60 110 40" stroke={OUTL} strokeWidth={6} fill="none" opacity={0.5} />
        </g>
        {/* hasta bilekliği */}
        <rect x={330} y={790} width={470} height={300} rx={34} fill="#f6f6f2" stroke={OUTL} strokeWidth={9} />
        <rect x={350} y={810} width={430} height={260} rx={22} fill="none" stroke="#c8ccd0" strokeWidth={5} />
        {text.map((t, i) => (
          <text key={i} x={565} y={878 + i * 74} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={i === 0 ? 62 : 50} fill="#1a1e24">
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
        <rect x={1010} y={0} width={70} height={1920} fill="#2a3134" />
        <rect x={1030} y={0} width={14} height={1920} fill="#fff6d8" opacity={interpolate(f, [1.6 * fps, 2.3 * fps], [0, 0.55], clamp)} />
        {/* rozet + kol */}
        <ellipse cx={420} cy={960} rx={110} ry={150} fill="#a8b2b8" stroke={OUTL} strokeWidth={8} />
        <circle cx={420} cy={1060} r={22} fill="#2a3134" />
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

export const InsertShot: React.FC<{ kind: "bileklik" | "kapi_kolu"; text?: string[]; dur: number }> = ({ kind, text, dur }) =>
  kind === "bileklik" ? <InsertBileklik text={text ?? []} dur={dur} /> : <InsertKapiKolu dur={dur} />;
