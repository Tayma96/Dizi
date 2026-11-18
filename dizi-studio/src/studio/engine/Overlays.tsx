import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF } from "../../dizi/fonts";
import type { TBeat } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------------- Karaoke altyazı (güvenli alan: y 1040-1260) ---------------- */
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
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 90, right: 150, top: 1060, display: "flex", flexDirection: "column", alignItems: "center", opacity: inA * outA }}>
        {speakerName && !vo ? (
          <div
            style={{
              fontFamily: SANS, fontWeight: 900, fontSize: 32, letterSpacing: 3, color: "#111",
              backgroundColor: speakerColor ?? "#ffd166", padding: "5px 20px", borderRadius: 40, marginBottom: 14,
              scale: interpolate(frame, [0, 8], [0.6, 1], { ...clamp, easing: Easing.spring({ damping: 12 }) }),
            }}
          >
            {speakerName.toLocaleUpperCase("tr-TR")}
          </div>
        ) : null}
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: vo ? 68 : 72, lineHeight: 1.2, textAlign: "center", fontStyle: vo ? "italic" : "normal" }}>
          {chunk.map((w, i) => {
            const active = time >= w.start - 0.05 && time < w.end + 0.05;
            const said = time >= w.end;
            const pop = interpolate(time, [w.start - 0.05, w.start + 0.08], [0, 1], clamp);
            return (
              <span
                key={`${ci}-${i}`}
                style={{
                  display: "inline-block",
                  marginRight: 16,
                  color: active ? (vo ? "#bfe0ff" : "#ffd166") : "#ffffff",
                  opacity: said || active ? 1 : 0.55,
                  scale: active ? `${1 + 0.06 * pop}` : "1",
                  WebkitTextStroke: "13px #120d0b",
                  paintOrder: "stroke fill",
                  textShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                {w.w}
              </span>
            );
          })}
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
