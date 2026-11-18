import React from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";

export type Mouth = "neutral" | "sad" | "smile" | "open" | "tight";
export type Brows = "neutral" | "sad" | "worried" | "angry" | "raised";

export type CharacterLook = {
  skin: string;
  skinShade: string;
  hair: string;
  hairShade: string;
  hairStyle: "longWavy" | "bob" | "shortMale";
  iris: string;
  top: string;
  topShade: string;
  bottom: string;
  shoes: string;
  gender: "f" | "m";
  age: "young" | "old";
  mustache?: boolean;
  coat?: { color: string; shade: string };
  blush?: boolean;
};

export type Pose = {
  mouth?: Mouth;
  brows?: Brows;
  /** -1 (left) .. 1 (right) */
  lookX?: number;
  lookY?: number;
  /** degrees, positive = forward/outward */
  armL?: number;
  armR?: number;
  forearmL?: number;
  forearmR?: number;
  headTilt?: number;
  /** frames (relative to the current sequence) during which the mouth moves */
  talk?: [number, number][];
  tears?: number; // 0..1
  pale?: number; // 0..1
  wet?: boolean;
  holdBag?: boolean;
  eyesClosed?: number; // 0..1
  seed?: number;
};

const OUTLINE = "#2b1d1a";
const SW = 4;

/** Natural blink: every ~3-5s, 6 frames long. */
const useBlink = (seed: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const period = Math.round(fps * (3 + random(`blink-${seed}`) * 2));
  const offset = Math.round(random(`blink-o-${seed}`) * period);
  const t = (frame + offset) % period;
  return interpolate(t, [0, 2, 4, 6], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
};

const useTalk = (ranges: [number, number][] | undefined, seed: number) => {
  const frame = useCurrentFrame();
  if (!ranges) return 0;
  const active = ranges.some(([a, b]) => frame >= a && frame < b);
  if (!active) return 0;
  // Syllable-like open/close with randomness (changes every 3 frames)
  const step = Math.floor(frame / 3);
  return 0.25 + random(`talk-${seed}-${step}`) * 0.75;
};

const Eye: React.FC<{
  cx: number;
  cy: number;
  iris: string;
  lookX: number;
  lookY: number;
  closed: number;
  flip?: boolean;
  old?: boolean;
}> = ({ cx, cy, iris, lookX, lookY, closed, flip, old }) => {
  const w = 22;
  const h = 15;
  const lid = Math.min(1, closed);
  const clipId = `eye-${cx}-${cy}`;
  const shape = `M ${cx - w} ${cy} Q ${cx - w * 0.3} ${cy - h * 1.35} ${cx + w} ${cy - 2} Q ${cx + w * 0.2} ${cy + h * 1.15} ${cx - w} ${cy} Z`;
  return (
    <g style={{ transformOrigin: `${cx}px ${cy}px`, scale: flip ? "-1 1" : "1 1" }}>
      <defs>
        <clipPath id={clipId}>
          <path d={shape} />
        </clipPath>
      </defs>
      <path d={shape} fill="#fdfaf5" />
      <g clipPath={`url(#${clipId})`}>
        <circle cx={cx + lookX * 7 * (flip ? -1 : 1)} cy={cy + lookY * 4} r={11} fill={iris} />
        <circle cx={cx + lookX * 7 * (flip ? -1 : 1)} cy={cy + lookY * 4} r={5.5} fill="#120c0a" />
        <circle cx={cx + lookX * 7 * (flip ? -1 : 1) + 4} cy={cy + lookY * 4 - 4} r={3} fill="#fff" />
        {/* eyelid */}
        <rect
          x={cx - w - 2}
          y={cy - h * 1.4}
          width={w * 2 + 4}
          height={h * 2.6 * lid}
          fill="var(--lid)"
        />
      </g>
      <path
        d={`M ${cx - w - 2} ${cy + 1} Q ${cx - w * 0.3} ${cy - h * 1.4 + h * 2.4 * lid} ${cx + w + 2} ${cy - 2}`}
        fill="none"
        stroke={OUTLINE}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
      {old ? (
        <path
          d={`M ${cx - w * 0.6} ${cy + h * 1.1} Q ${cx} ${cy + h * 1.5} ${cx + w * 0.6} ${cy + h * 0.9}`}
          fill="none"
          stroke={OUTLINE}
          strokeOpacity={0.35}
          strokeWidth={2}
        />
      ) : null}
    </g>
  );
};

const Brow: React.FC<{ cx: number; cy: number; kind: Brows; color: string; flip?: boolean }> = ({
  cx,
  cy,
  kind,
  color,
  flip,
}) => {
  const tilt = { neutral: 0, sad: -14, worried: -18, angry: 16, raised: -4 }[kind];
  const lift = { neutral: 0, sad: -2, worried: -6, angry: 4, raised: -10 }[kind];
  return (
    <g
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        scale: flip ? "-1 1" : "1 1",
      }}
    >
      <path
        d={`M ${cx - 22} ${cy + 4} Q ${cx} ${cy - 6} ${cx + 22} ${cy + 1}`}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          rotate: `${tilt}deg`,
          translate: `0px ${lift}px`,
        }}
      />
    </g>
  );
};

const MouthShape: React.FC<{ kind: Mouth; open: number; cx: number; cy: number }> = ({
  kind,
  open,
  cx,
  cy,
}) => {
  if (open > 0) {
    const h = 4 + open * 16;
    return (
      <g>
        <path
          d={`M ${cx - 15} ${cy} Q ${cx} ${cy - 4} ${cx + 15} ${cy} Q ${cx} ${cy + h * 1.4} ${cx - 15} ${cy} Z`}
          fill="#6b2a2a"
          stroke={OUTLINE}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
        <path d={`M ${cx - 8} ${cy + h * 0.9} Q ${cx} ${cy + h * 0.55} ${cx + 8} ${cy + h * 0.9}`} fill="#d9777a" />
      </g>
    );
  }
  const paths: Record<Mouth, string> = {
    neutral: `M ${cx - 14} ${cy} Q ${cx} ${cy + 3} ${cx + 14} ${cy}`,
    sad: `M ${cx - 15} ${cy + 5} Q ${cx} ${cy - 5} ${cx + 15} ${cy + 5}`,
    smile: `M ${cx - 16} ${cy - 2} Q ${cx} ${cy + 12} ${cx + 16} ${cy - 2}`,
    tight: `M ${cx - 10} ${cy + 1} L ${cx + 10} ${cy + 1}`,
    open: `M ${cx - 10} ${cy} Q ${cx} ${cy + 14} ${cx + 10} ${cy} Q ${cx} ${cy - 3} ${cx - 10} ${cy} Z`,
  };
  return (
    <path
      d={paths[kind]}
      fill={kind === "open" ? "#6b2a2a" : "none"}
      stroke={OUTLINE}
      strokeWidth={4}
      strokeLinecap="round"
    />
  );
};

const HairBack: React.FC<{ look: CharacterLook }> = ({ look }) => {
  if (look.hairStyle === "longWavy") {
    return (
      <path
        d="M 108 170 C 92 280 96 380 110 470 C 118 520 150 540 200 538 C 250 540 282 520 290 470 C 304 380 308 280 292 170 C 280 70 120 70 108 170 Z"
        fill={look.hair}
        stroke={OUTLINE}
        strokeWidth={SW}
      />
    );
  }
  if (look.hairStyle === "bob") {
    return (
      <path
        d="M 100 180 C 92 240 96 290 112 316 C 150 330 250 330 288 316 C 304 290 308 240 300 180 C 290 70 110 70 100 180 Z"
        fill={look.hair}
        stroke={OUTLINE}
        strokeWidth={SW}
      />
    );
  }
  return null;
};

const HairFront: React.FC<{ look: CharacterLook }> = ({ look }) => {
  if (look.hairStyle === "longWavy") {
    return (
      <g>
        <path
          d="M 112 196 C 108 110 160 82 205 84 C 258 84 296 120 290 200 C 276 160 250 128 214 118 C 196 150 150 170 112 196 Z"
          fill={look.hair}
          stroke={OUTLINE}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
        <path d="M 230 104 C 252 116 270 140 278 168" stroke={look.hairShade} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M 180 106 C 160 120 140 140 126 168" stroke={look.hairShade} strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* side strands */}
        <path d="M 112 196 C 104 260 112 320 104 380" stroke={look.hairShade} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M 290 200 C 298 260 290 320 298 380" stroke={look.hairShade} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    );
  }
  if (look.hairStyle === "bob") {
    return (
      <g>
        <path
          d="M 108 214 C 100 110 160 84 204 86 C 262 86 302 124 292 214 C 270 150 236 132 200 128 C 168 132 130 150 108 214 Z"
          fill={look.hair}
          stroke={OUTLINE}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
        <path d="M 200 100 C 180 112 168 124 160 140" stroke={look.hairShade} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    );
  }
  // short male
  return (
    <g>
      <path
        d="M 112 196 C 100 120 140 80 200 80 C 262 80 302 118 290 196 C 284 160 270 140 250 132 C 230 146 190 150 150 138 C 130 150 118 170 112 196 Z"
        fill={look.hair}
        stroke={OUTLINE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d="M 170 96 C 190 104 220 104 240 98" stroke={look.hairShade} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};

/** Full body flat-vector character with blink, breathing, talking and simple rig. */
export const Character: React.FC<{
  look: CharacterLook;
  pose?: Pose;
  style?: React.CSSProperties;
  width?: number;
}> = ({ look, pose = {}, style, width = 400 }) => {
  const frame = useCurrentFrame();
  const seed = pose.seed ?? 1;
  const blink = Math.max(useBlink(seed), pose.eyesClosed ?? 0);
  const talkOpen = useTalk(pose.talk, seed);
  const breathe = Math.sin((frame + seed * 13) / 22) * 0.012;
  const sway = Math.sin((frame + seed * 7) / 40) * 1.2;
  const lookX = pose.lookX ?? 0;
  const lookY = pose.lookY ?? 0;
  const brows = pose.brows ?? "neutral";
  const mouth = pose.mouth ?? "neutral";
  const armL = pose.armL ?? 4;
  const armR = pose.armR ?? 4;
  const foreL = pose.forearmL ?? 0;
  const foreR = pose.forearmR ?? 0;
  const tears = pose.tears ?? 0;
  const pale = pose.pale ?? 0;
  const skin = look.skin;
  const topColor = look.coat?.color ?? look.top;
  const topShade = look.coat?.shade ?? look.topShade;
  const male = look.gender === "m";

  const Arm: React.FC<{ side: "l" | "r"; angle: number; fore: number }> = ({ side, angle, fore }) => {
    const sx = side === "l" ? 128 : 272;
    const dir = side === "l" ? 1 : -1;
    return (
      <g style={{ transformOrigin: `${sx}px 360px`, rotate: `${angle * dir}deg` }}>
        <path
          d={`M ${sx - 22} 350 Q ${sx - 26} 440 ${sx - 20} 500 L ${sx + 20} 500 Q ${sx + 24} 430 ${sx + 22} 350 Z`}
          fill={topColor}
          stroke={OUTLINE}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
        <g style={{ transformOrigin: `${sx}px 495px`, rotate: `${fore * dir}deg` }}>
          <path
            d={`M ${sx - 20} 492 L ${sx - 17} 600 L ${sx + 17} 600 L ${sx + 20} 492 Z`}
            fill={look.coat ? topColor : skin}
            stroke={OUTLINE}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          <circle cx={sx} cy={612} r={22} fill={skin} stroke={OUTLINE} strokeWidth={SW} />
          {pose.holdBag && side === "r" ? (
            <g>
              <path
                d={`M ${sx - 44} 630 L ${sx + 40} 630 L ${sx + 52} 770 Q ${sx} 790 ${sx - 54} 770 Z`}
                fill="#f3f1ea"
                stroke={OUTLINE}
                strokeWidth={SW}
                strokeLinejoin="round"
                opacity={0.95}
              />
              {/* bread loaves peeking out */}
              <path d={`M ${sx - 30} 640 Q ${sx - 34} 560 ${sx - 10} 556 Q ${sx + 6} 560 ${sx + 2} 640 Z`} fill="#d79a4e" stroke={OUTLINE} strokeWidth={SW} />
              <path d={`M ${sx - 26} 590 L ${sx - 8} 584 M ${sx - 28} 610 L ${sx - 6} 604`} stroke="#8a5523" strokeWidth={3} />
              <path d={`M ${sx - 20} 616 Q ${sx} 600 ${sx + 20} 616`} fill="none" stroke={OUTLINE} strokeWidth={3} />
              <circle cx={sx} cy={612} r={22} fill={skin} stroke={OUTLINE} strokeWidth={SW} />
            </g>
          ) : null}
        </g>
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 400 1000"
      width={width}
      height={width * 2.5}
      style={{ overflow: "visible", ...style }}
    >
      <g style={{ ["--lid" as string]: skin, transformOrigin: "200px 980px", rotate: `${sway * 0.3}deg` }}>
        {/* shadow */}
        <ellipse cx={200} cy={985} rx={130} ry={16} fill="#000" opacity={0.22} />
        {/* legs */}
        <path d="M 148 600 L 144 950 L 196 950 L 200 640 L 204 950 L 256 950 L 252 600 Z" fill={look.bottom} stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M 200 650 L 200 940" stroke={OUTLINE} strokeOpacity={0.4} strokeWidth={3} />
        <path d="M 138 946 Q 136 978 170 978 L 198 978 L 198 946 Z" fill={look.shoes} stroke={OUTLINE} strokeWidth={SW} />
        <path d="M 202 946 L 202 978 L 230 978 Q 264 978 262 946 Z" fill={look.shoes} stroke={OUTLINE} strokeWidth={SW} />

        <g style={{ transformOrigin: "200px 620px", scale: `${1 + breathe * 0.4} ${1 + breathe}` }}>
          <HairBack look={look} />
          {/* torso */}
          <path
            d={
              look.coat
                ? "M 128 340 Q 200 318 272 340 Q 290 360 284 470 L 290 720 Q 200 740 110 720 L 116 470 Q 110 360 128 340 Z"
                : "M 128 340 Q 200 320 272 340 Q 290 360 282 470 L 262 630 Q 200 645 138 630 L 118 470 Q 110 360 128 340 Z"
            }
            fill={topColor}
            stroke={OUTLINE}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          {/* torso shading */}
          <path d="M 250 360 Q 268 470 252 620 L 270 620 Q 286 470 268 350 Z" fill={topShade} opacity={0.7} />
          {look.coat ? (
            <g>
              <path d="M 200 330 L 200 730" stroke={OUTLINE} strokeWidth={3} />
              <path d="M 168 330 L 200 420 L 232 330" fill={look.top} stroke={OUTLINE} strokeWidth={SW} strokeLinejoin="round" />
              <circle cx={214} cy={480} r={5} fill={OUTLINE} />
              <circle cx={214} cy={560} r={5} fill={OUTLINE} />
              <circle cx={214} cy={640} r={5} fill={OUTLINE} />
            </g>
          ) : (
            <path d="M 172 330 Q 200 360 228 330" fill="none" stroke={OUTLINE} strokeWidth={SW} />
          )}
          {/* sweater ribbing */}
          {!look.coat && !male ? (
            <path d="M 140 612 Q 200 626 260 612" fill="none" stroke={topShade} strokeWidth={5} />
          ) : null}
          {/* neck */}
          <path d="M 180 290 L 180 336 Q 200 346 220 336 L 220 290 Z" fill={skin} stroke={OUTLINE} strokeWidth={SW} />
          <path d="M 182 318 Q 200 330 218 318" fill="none" stroke={look.skinShade} strokeWidth={6} />

          {/* head */}
          <g
            style={{
              transformOrigin: "200px 300px",
              rotate: `${(pose.headTilt ?? 0) + sway * 0.6}deg`,
            }}
          >
            {/* ears */}
            <ellipse cx={110} cy={210} rx={14} ry={22} fill={skin} stroke={OUTLINE} strokeWidth={SW} />
            <ellipse cx={290} cy={210} rx={14} ry={22} fill={skin} stroke={OUTLINE} strokeWidth={SW} />
            {/* face */}
            <path
              d={
                male
                  ? "M 114 150 Q 112 250 140 286 Q 170 312 200 312 Q 230 312 260 286 Q 288 250 286 150 Q 280 90 200 90 Q 120 90 114 150 Z"
                  : "M 116 150 Q 112 246 146 284 Q 174 310 200 310 Q 226 310 254 284 Q 288 246 284 150 Q 278 92 200 92 Q 122 92 116 150 Z"
              }
              fill={skin}
              stroke={OUTLINE}
              strokeWidth={SW}
            />
            {/* pale overlay */}
            <path
              d="M 116 150 Q 112 246 146 284 Q 174 310 200 310 Q 226 310 254 284 Q 288 246 284 150 Q 278 92 200 92 Q 122 92 116 150 Z"
              fill="#c9d6e0"
              opacity={pale * 0.45}
            />
            {/* cheek shading */}
            <path d="M 262 180 Q 276 240 248 282 Q 270 270 280 230 Q 286 190 278 160 Z" fill={look.skinShade} opacity={0.6} />
            {look.age === "old" ? (
              <g stroke={OUTLINE} strokeOpacity={0.3} strokeWidth={2.5} fill="none">
                <path d="M 160 128 Q 200 120 240 128" />
                <path d="M 170 140 Q 200 134 230 140" />
                <path d="M 150 250 Q 156 268 166 276" />
                <path d="M 250 250 Q 244 268 234 276" />
              </g>
            ) : null}
            {look.blush !== false ? (
              <g opacity={0.5 * (1 - pale)}>
                <ellipse cx={148} cy={236} rx={18} ry={10} fill="#ef8f8a" />
                <ellipse cx={252} cy={236} rx={18} ry={10} fill="#ef8f8a" />
              </g>
            ) : null}
            <Eye cx={160} cy={198} iris={look.iris} lookX={lookX} lookY={lookY} closed={blink} old={look.age === "old"} />
            <Eye cx={240} cy={198} iris={look.iris} lookX={lookX} lookY={lookY} closed={blink} flip old={look.age === "old"} />
            <Brow cx={160} cy={160} kind={brows} color={look.hairStyle === "shortMale" && look.age === "old" ? "#6b625c" : look.hair} />
            <Brow cx={240} cy={160} kind={brows} color={look.hairStyle === "shortMale" && look.age === "old" ? "#6b625c" : look.hair} flip />
            {/* nose */}
            <path d="M 202 214 Q 196 236 204 244" fill="none" stroke={OUTLINE} strokeWidth={3.5} strokeLinecap="round" />
            {look.mustache ? (
              <path d="M 166 262 Q 200 246 234 262 Q 220 270 200 264 Q 180 270 166 262 Z" fill={look.hair} stroke={OUTLINE} strokeWidth={3} />
            ) : null}
            {male && look.age === "old" ? (
              <path d="M 140 260 Q 150 300 200 308 Q 250 300 260 260" fill="none" stroke="#7d7672" strokeOpacity={0.35} strokeWidth={14} />
            ) : null}
            <MouthShape kind={mouth} open={talkOpen} cx={200} cy={274} />
            {/* tears */}
            {tears > 0 ? (
              <g opacity={Math.min(1, tears * 2)}>
                <path
                  d={`M 150 216 Q 146 ${216 + tears * 60} 150 ${222 + tears * 70} Q 156 ${216 + tears * 60} 152 216 Z`}
                  fill="#bfe3ff"
                  stroke="#7fb6dd"
                  strokeWidth={2}
                />
                <path d="M 138 212 Q 160 222 182 212" stroke="#bfe3ff" strokeWidth={4} fill="none" strokeLinecap="round" />
                <path d="M 218 212 Q 240 222 262 212" stroke="#bfe3ff" strokeWidth={4} fill="none" strokeLinecap="round" />
              </g>
            ) : null}
            <HairFront look={look} />
            {pose.wet ? (
              <g fill="#bfe3ff" stroke="#6fa8cf" strokeWidth={1.5}>
                <path d="M 130 210 q -4 10 0 14 q 4 -4 0 -14 z" />
                <path d="M 274 190 q -4 10 0 14 q 4 -4 0 -14 z" />
                <path d="M 210 120 q -4 10 0 14 q 4 -4 0 -14 z" />
              </g>
            ) : null}
          </g>
          {/* arms */}
          <Arm side="l" angle={armL} fore={foreL} />
          <Arm side="r" angle={armR} fore={foreR} />
        </g>
        {pose.wet ? (
          <g fill="#8fb8d8" opacity={0.5}>
            <rect x={150} y={560} width={6} height={30} rx={3} />
            <rect x={240} y={600} width={6} height={40} rx={3} />
            <rect x={190} y={680} width={6} height={26} rx={3} />
          </g>
        ) : null}
      </g>
    </svg>
  );
};

export const ZEYNEP: CharacterLook = {
  skin: "#f6cfb0",
  skinShade: "#e9b592",
  hair: "#4a2c22",
  hairShade: "#6e4434",
  hairStyle: "longWavy",
  iris: "#6a4a2c",
  top: "#d9a441",
  topShade: "#b9852a",
  bottom: "#3f5a7d",
  shoes: "#e9e4dc",
  gender: "f",
  age: "young",
};

export const BABA: CharacterLook = {
  skin: "#e8bd98",
  skinShade: "#d2a07c",
  hair: "#9a958f",
  hairShade: "#c8c3bd",
  hairStyle: "shortMale",
  iris: "#5a4030",
  top: "#e9e2d6",
  topShade: "#cfc6b8",
  bottom: "#3b3a3f",
  shoes: "#2c2622",
  gender: "m",
  age: "old",
  mustache: true,
  coat: { color: "#5b4636", shade: "#46352a" },
  blush: false,
};

export const ANNE: CharacterLook = {
  skin: "#f2c8a8",
  skinShade: "#e0ab88",
  hair: "#8c3b2a",
  hairShade: "#b0553f",
  hairStyle: "bob",
  iris: "#4e6b3e",
  top: "#4f7a64",
  topShade: "#3c604e",
  bottom: "#6d5a52",
  shoes: "#e0d6cc",
  gender: "f",
  age: "old",
};
