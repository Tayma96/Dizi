import React from "react";
import type { Emotion, Look, Viseme } from "./types";

export const OUT = "#2b1d1a";

export type FaceParams = {
  /** brow inner raise (+ up), outer raise */
  browInner: number;
  browOuter: number;
  /** extra brow vertical lift */
  browLift: number;
  /** eye openness 0..1.3 */
  eyeOpen: number;
  /** happy closed-arc eyes */
  eyeSmile: boolean;
  pupil: number;
  /** resting mouth */
  mouth: "line" | "smile" | "grin" | "frown" | "open" | "o" | "smirk" | "tight" | "wavy" | "flat";
  blush: number;
};

export const EMOTION_FACE: Record<Emotion, FaceParams> = {
  aci: { browInner: 13, browOuter: -4, browLift: 4, eyeOpen: 0.5, eyeSmile: false, pupil: 0.9, mouth: "tight", blush: 0.1 },
  notr: { browInner: 0, browOuter: 0, browLift: 0, eyeOpen: 1, eyeSmile: false, pupil: 1, mouth: "line", blush: 0.4 },
  mutlu: { browInner: 3, browOuter: 3, browLift: -3, eyeOpen: 0.95, eyeSmile: false, pupil: 1.05, mouth: "smile", blush: 0.6 },
  gulen: { browInner: 5, browOuter: 4, browLift: -6, eyeOpen: 1, eyeSmile: true, pupil: 1, mouth: "grin", blush: 0.8 },
  uzgun: { browInner: 12, browOuter: -6, browLift: -2, eyeOpen: 0.78, eyeSmile: false, pupil: 1, mouth: "frown", blush: 0.5 },
  agliyor: { browInner: 16, browOuter: -8, browLift: -4, eyeOpen: 0.6, eyeSmile: false, pupil: 1, mouth: "wavy", blush: 0.9 },
  ofkeli: { browInner: -14, browOuter: 6, browLift: 6, eyeOpen: 0.85, eyeSmile: false, pupil: 0.85, mouth: "tight", blush: 0.7 },
  korkmus: { browInner: 14, browOuter: 4, browLift: -10, eyeOpen: 1.25, eyeSmile: false, pupil: 0.65, mouth: "open", blush: 0.1 },
  saskin: { browInner: 10, browOuter: 10, browLift: -14, eyeOpen: 1.25, eyeSmile: false, pupil: 0.9, mouth: "o", blush: 0.4 },
  sok: { browInner: 12, browOuter: 12, browLift: -18, eyeOpen: 1.35, eyeSmile: false, pupil: 0.55, mouth: "open", blush: 0 },
  supheli: { browInner: -6, browOuter: 4, browLift: 2, eyeOpen: 0.62, eyeSmile: false, pupil: 1, mouth: "flat", blush: 0.3 },
  utangac: { browInner: 6, browOuter: 0, browLift: -2, eyeOpen: 0.8, eyeSmile: false, pupil: 1.1, mouth: "smile", blush: 1.3 },
  alayci: { browInner: -2, browOuter: 6, browLift: 0, eyeOpen: 0.72, eyeSmile: false, pupil: 1, mouth: "smirk", blush: 0.3 },
  dusunceli: { browInner: 6, browOuter: -2, browLift: -2, eyeOpen: 0.85, eyeSmile: false, pupil: 1, mouth: "flat", blush: 0.3 },
  yorgun: { browInner: 4, browOuter: -4, browLift: 2, eyeOpen: 0.55, eyeSmile: false, pupil: 1, mouth: "line", blush: 0.2 },
  soguk: { browInner: -4, browOuter: 0, browLift: 2, eyeOpen: 0.75, eyeSmile: false, pupil: 0.9, mouth: "flat", blush: 0.1 },
  kararli: { browInner: -8, browOuter: 2, browLift: 3, eyeOpen: 0.9, eyeSmile: false, pupil: 1, mouth: "tight", blush: 0.4 },
  igrenmis: { browInner: -8, browOuter: -2, browLift: 4, eyeOpen: 0.65, eyeSmile: false, pupil: 1, mouth: "wavy", blush: 0.3 },
};

export const Eye: React.FC<{
  cx: number;
  cy: number;
  look: Look;
  lookX: number;
  lookY: number;
  open: number;
  smile: boolean;
  pupil: number;
  flip?: boolean;
  squeeze?: number;
  uid: string;
}> = ({ cx, cy, look, lookX, lookY, open, smile, pupil, flip, squeeze = 1, uid }) => {
  const w = 22 * squeeze;
  const h = 15;
  const clipId = `eye-${uid}`;
  const s = flip ? -1 : 1;
  const old = look.age === "old";
  if (smile || open <= 0.05) {
    // closed / laughing eye
    const d = smile
      ? `M ${cx - w} ${cy + 4} Q ${cx} ${cy - 16} ${cx + w} ${cy + 4}`
      : `M ${cx - w} ${cy} Q ${cx} ${cy + 9} ${cx + w} ${cy}`;
    return <path d={d} fill="none" stroke={OUT} strokeWidth={5} strokeLinecap="round" />;
  }
  const top = cy - h * 1.35 * Math.min(1.35, open);
  const bot = cy + h * 1.1 * Math.min(1.2, 0.6 + open * 0.4);
  const shape = `M ${cx - w * s} ${cy} Q ${cx - w * 0.3 * s} ${top} ${cx + w * s} ${cy - 2} Q ${cx + w * 0.2 * s} ${bot} ${cx - w * s} ${cy} Z`;
  const ix = cx + lookX * 7 * squeeze;
  const iy = cy + lookY * 5;
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={shape} />
        </clipPath>
      </defs>
      <path d={shape} fill="#fdfaf5" />
      <g clipPath={`url(#${clipId})`}>
        <circle cx={ix} cy={iy} r={11.5} fill={look.iris} />
        <circle cx={ix} cy={iy} r={6 * pupil} fill="#120c0a" />
        <circle cx={ix + 4} cy={iy - 4} r={3.2} fill="#fff" />
        <circle cx={ix - 4} cy={iy + 4} r={1.4} fill="#fff" opacity={0.8} />
      </g>
      {/* upper lid line */}
      <path
        d={`M ${cx - (w + 2) * s} ${cy + 1} Q ${cx - w * 0.3 * s} ${top - 1} ${cx + (w + 2) * s} ${cy - 2}`}
        fill="none"
        stroke={OUT}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
      {look.gender === "f" && look.age !== "child" ? (
        <path
          d={`M ${cx - (w + 1) * s} ${cy} l ${-8 * s} -5 M ${cx - (w - 5) * s} ${cy - 8} l ${-7 * s} -7`}
          stroke={OUT}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ) : null}
      {old ? (
        <path
          d={`M ${cx - w * 0.7} ${cy + h * 1.15} Q ${cx} ${cy + h * 1.6} ${cx + w * 0.7} ${cy + h * 1.0}`}
          fill="none"
          stroke={OUT}
          strokeOpacity={0.35}
          strokeWidth={2}
        />
      ) : null}
    </g>
  );
};

export const Brow: React.FC<{
  cx: number;
  cy: number;
  inner: number;
  outer: number;
  lift: number;
  color: string;
  flip?: boolean;
  thick?: number;
  squeeze?: number;
}> = ({ cx, cy, inner, outer, lift, color, flip, thick = 7, squeeze = 1 }) => {
  // inner end is toward the nose (screen center)
  const s = flip ? -1 : 1;
  const xi = cx + 22 * squeeze * s;
  const xo = cx - 22 * squeeze * s;
  const yi = cy + 3 + lift - inner;
  const yo = cy + 3 + lift - outer;
  const ym = Math.min(yi, yo) - 7;
  return (
    <path
      d={`M ${xo} ${yo} Q ${cx} ${ym} ${xi} ${yi}`}
      fill="none"
      stroke={color}
      strokeWidth={thick}
      strokeLinecap="round"
    />
  );
};

/** Mouth: viseme (talking) or resting shape. */
export const Mouth: React.FC<{ viseme: Viseme | null; rest: FaceParams["mouth"]; cx: number; cy: number; amp?: number }> = ({
  viseme,
  rest,
  cx,
  cy,
  amp = 1,
}) => {
  const lip = "#c4605f";
  const inside = "#5e2324";
  const tongue = "#d9777a";
  const teeth = "#fffaf2";
  if (viseme && viseme !== "X") {
    const shapes: Record<Exclude<Viseme, "X">, { w: number; h: number; round?: boolean; teeth?: boolean; closed?: boolean; f?: boolean }> = {
      A: { w: 17, h: 20 },
      E: { w: 19, h: 12, teeth: true },
      I: { w: 18, h: 7, teeth: true },
      O: { w: 11, h: 15, round: true },
      U: { w: 8, h: 9, round: true },
      M: { w: 15, h: 0, closed: true },
      F: { w: 15, h: 6, f: true },
      L: { w: 14, h: 8, teeth: true },
    };
    const s = shapes[viseme];
    const h = s.h * amp;
    if (s.closed) {
      return (
        <g>
          <path d={`M ${cx - s.w} ${cy} Q ${cx} ${cy + 3} ${cx + s.w} ${cy}`} fill="none" stroke={OUT} strokeWidth={4.5} strokeLinecap="round" />
          <path d={`M ${cx - s.w * 0.6} ${cy + 5} Q ${cx} ${cy + 8} ${cx + s.w * 0.6} ${cy + 5}`} fill="none" stroke={lip} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        </g>
      );
    }
    if (s.round) {
      return (
        <g>
          <ellipse cx={cx} cy={cy + h * 0.45} rx={s.w} ry={Math.max(4, h * 0.75)} fill={inside} stroke={OUT} strokeWidth={4} />
          <ellipse cx={cx} cy={cy + h * 0.8} rx={s.w * 0.5} ry={Math.max(2, h * 0.25)} fill={tongue} />
        </g>
      );
    }
    return (
      <g>
        <path
          d={`M ${cx - s.w} ${cy} Q ${cx} ${cy - 5} ${cx + s.w} ${cy} Q ${cx} ${cy + h * 1.5 + 4} ${cx - s.w} ${cy} Z`}
          fill={inside}
          stroke={OUT}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        {s.teeth ? <path d={`M ${cx - s.w * 0.75} ${cy + 1} Q ${cx} ${cy - 2} ${cx + s.w * 0.75} ${cy + 1} L ${cx + s.w * 0.6} ${cy + 5} Q ${cx} ${cy + 3} ${cx - s.w * 0.6} ${cy + 5} Z`} fill={teeth} /> : null}
        {s.f ? <path d={`M ${cx - s.w * 0.7} ${cy + 1} L ${cx + s.w * 0.7} ${cy + 1} L ${cx + s.w * 0.6} ${cy + 6} L ${cx - s.w * 0.6} ${cy + 6} Z`} fill={teeth} /> : null}
        {h > 10 ? <path d={`M ${cx - s.w * 0.5} ${cy + h * 1.2} Q ${cx} ${cy + h * 0.7} ${cx + s.w * 0.5} ${cy + h * 1.2}`} fill={tongue} /> : null}
      </g>
    );
  }
  const stroke = { fill: "none", stroke: OUT, strokeWidth: 4.5, strokeLinecap: "round" as const };
  switch (rest) {
    case "smile":
      return <path d={`M ${cx - 17} ${cy - 3} Q ${cx} ${cy + 12} ${cx + 17} ${cy - 3}`} {...stroke} />;
    case "grin":
      return (
        <g>
          <path d={`M ${cx - 22} ${cy - 4} Q ${cx} ${cy + 30} ${cx + 22} ${cy - 4} Z`} fill={inside} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M ${cx - 18} ${cy - 2} L ${cx + 18} ${cy - 2} L ${cx + 14} ${cy + 5} L ${cx - 14} ${cy + 5} Z`} fill={teeth} />
          <path d={`M ${cx - 9} ${cy + 17} Q ${cx} ${cy + 10} ${cx + 9} ${cy + 17}`} fill={tongue} />
        </g>
      );
    case "frown":
      return <path d={`M ${cx - 16} ${cy + 6} Q ${cx} ${cy - 6} ${cx + 16} ${cy + 6}`} {...stroke} />;
    case "open":
      return (
        <path d={`M ${cx - 12} ${cy} Q ${cx} ${cy - 6} ${cx + 12} ${cy} Q ${cx + 10} ${cy + 22} ${cx} ${cy + 22} Q ${cx - 10} ${cy + 22} ${cx - 12} ${cy} Z`} fill={inside} stroke={OUT} strokeWidth={4} />
      );
    case "o":
      return <ellipse cx={cx} cy={cy + 5} rx={9} ry={11} fill={inside} stroke={OUT} strokeWidth={4} />;
    case "smirk":
      return <path d={`M ${cx - 14} ${cy + 2} Q ${cx + 4} ${cy + 6} ${cx + 18} ${cy - 6}`} {...stroke} />;
    case "tight":
      return <path d={`M ${cx - 12} ${cy + 2} Q ${cx} ${cy - 1} ${cx + 12} ${cy + 2}`} {...stroke} strokeWidth={5.5} />;
    case "wavy":
      return <path d={`M ${cx - 16} ${cy + 4} Q ${cx - 8} ${cy - 3} ${cx} ${cy + 3} Q ${cx + 8} ${cy + 9} ${cx + 16} ${cy + 2}`} {...stroke} />;
    case "flat":
      return <path d={`M ${cx - 13} ${cy + 1} L ${cx + 13} ${cy + 1}`} {...stroke} />;
    default:
      return <path d={`M ${cx - 14} ${cy} Q ${cx} ${cy + 4} ${cx + 14} ${cy}`} {...stroke} />;
  }
};
