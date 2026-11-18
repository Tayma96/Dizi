import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS } from "./fonts";

const fontFamily = SANS;
export const subtitleFont = fontFamily;

export type Cue = {
  /** seconds */
  from: number;
  to: number;
  text: string;
  /** Speaker name for dialogue; omit for narration (inner voice). */
  speaker?: string;
  speakerColor?: string;
  /** words (lowercase, no punctuation) to colour */
  emphasis?: string[];
  whisper?: boolean;
};

const clean = (w: string) => w.toLocaleLowerCase("tr-TR").replace(/[.,!?…:;"']/g, "");

const CueView: React.FC<{ cue: Cue }> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = cue.from * fps;
  const end = cue.to * fps;
  const words = cue.text.split(" ");
  // Words appear progressively over the first 55% of the cue.
  const revealSpan = Math.max(1, (end - start) * 0.55);
  const out = interpolate(frame, [end - 6, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const isDialogue = Boolean(cue.speaker);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1330,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: out,
      }}
    >
      {isDialogue ? (
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 34,
            letterSpacing: 3,
            color: "#111",
            backgroundColor: cue.speakerColor ?? "#ffd166",
            padding: "6px 22px",
            borderRadius: 40,
            marginBottom: 18,
            scale: interpolate(frame, [start, start + 8], [0.6, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12 }),
            }),
          }}
        >
          {cue.speaker}
        </div>
      ) : null}
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: cue.whisper ? 66 : 76,
          lineHeight: 1.18,
          textAlign: "center",
          fontStyle: isDialogue ? "normal" : "italic",
        }}
      >
        {words.map((w, i) => {
          const t = start + (i / words.length) * revealSpan;
          const p = interpolate(frame, [t, t + 7], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          const emph = cue.emphasis?.includes(clean(w));
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 18,
                opacity: p,
                translate: `0px ${(1 - p) * 26}px`,
                color: emph ? "#ff6b6b" : cue.whisper ? "#cfe3ff" : "#fff",
                WebkitTextStroke: "14px #120d0b",
                paintOrder: "stroke fill",
                textShadow: "0 8px 24px rgba(0,0,0,0.55)",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Subtitles: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const active = cues.filter((c) => frame >= c.from * fps && frame < c.to * fps);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {active.map((c) => (
        <CueView key={`${c.from}-${c.text}`} cue={c} />
      ))}
    </AbsoluteFill>
  );
};
