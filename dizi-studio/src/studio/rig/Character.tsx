import React, { useId } from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Brow, EMOTION_FACE, Eye, Mouth, OUT } from "./face";
import { GESTURES, type FullArm } from "./gestures";
import { HairBack, HairFront } from "./hair";
import type { Look, MouthCue, Pose, Prop, Viseme } from "./types";

const SW = 4;

export const AGE = {
  child: { sx: 0.8, sy: 0.6, head: 0.94 },
  teen: { sx: 0.9, sy: 0.86, head: 0.97 },
  adult: { sx: 1, sy: 1, head: 1 },
  old: { sx: 1, sy: 0.97, head: 1 },
} as const;
const BUILD = { slim: 0.9, normal: 1, heavy: 1.24 } as const;

const SHORT_SLEEVES = new Set(["tshirt", "dress", "police"]);
const LONG_COATS = new Set(["coat", "labcoat"]);

const useBlink = (seed: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const period = Math.round(fps * (2.8 + random(`blink-${seed}`) * 2.4));
  const offset = Math.round(random(`blink-o-${seed}`) * period);
  const t = (frame + offset) % period;
  return interpolate(t, [0, 2, 4, 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const currentViseme = (cues: MouthCue[], time: number): Viseme | null => {
  if (!cues.length || time < cues[0].t - 0.02) return null;
  const last = cues[cues.length - 1];
  if (time > last.t + 0.15) return null;
  let v: Viseme = "X";
  for (const c of cues) {
    if (c.t <= time + 0.02) v = c.v;
    else break;
  }
  return v;
};

const sleeveColor = (look: Look) => {
  const t = look.outfit.type;
  if (t === "labcoat") return "#f2f2ee";
  if (t === "school") return "#f6f5f0";
  return look.outfit.top;
};

/* ------------------------------ props ------------------------------ */
const HandProp: React.FC<{ prop: Prop; x: number; y: number; look: Look }> = ({ prop, x, y }) => {
  switch (prop) {
    case "telefon":
      return (
        <g>
          <rect x={x - 16} y={y - 70} width={32} height={62} rx={7} fill="#222630" stroke={OUT} strokeWidth={3} />
          <rect x={x - 11} y={y - 64} width={22} height={46} rx={3} fill="#5d7fb0" />
        </g>
      );
    case "poset":
      return (
        <g>
          <path d={`M ${x - 44} ${y + 18} L ${x + 40} ${y + 18} L ${x + 52} ${y + 158} Q ${x} ${y + 178} ${x - 54} ${y + 158} Z`} fill="#f3f1ea" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          <path d={`M ${x - 30} ${y + 28} Q ${x - 34} ${y - 52} ${x - 10} ${y - 56} Q ${x + 6} ${y - 52} ${x + 2} ${y + 28} Z`} fill="#d79a4e" stroke={OUT} strokeWidth={SW} />
          <path d={`M ${x - 26} ${y - 22} L ${x - 8} ${y - 28} M ${x - 28} ${y - 2} L ${x - 6} ${y - 8}`} stroke="#8a5523" strokeWidth={3} />
        </g>
      );
    case "fincan":
      return (
        <g>
          <path d={`M ${x - 22} ${y - 40} L ${x + 22} ${y - 40} L ${x + 18} ${y - 4} Q ${x} ${y + 4} ${x - 18} ${y - 4} Z`} fill="#f4eee4" stroke={OUT} strokeWidth={3.5} />
          <path d={`M ${x + 20} ${y - 32} q 16 4 2 20`} fill="none" stroke={OUT} strokeWidth={3.5} />
          <path d={`M ${x - 6} ${y - 52} q 6 -10 0 -20 M ${x + 6} ${y - 50} q 6 -10 0 -20`} stroke="#fff" strokeOpacity={0.6} strokeWidth={3} fill="none" />
        </g>
      );
    case "mektup":
      return (
        <g>
          <rect x={x - 34} y={y - 52} width={68} height={46} fill="#f3ead6" stroke={OUT} strokeWidth={3.5} />
          <path d={`M ${x - 34} ${y - 52} L ${x} ${y - 26} L ${x + 34} ${y - 52}`} fill="none" stroke={OUT} strokeWidth={3} />
          <circle cx={x} cy={y - 26} r={6} fill="#b33" />
        </g>
      );
    case "canta":
      return (
        <g>
          <path d={`M ${x - 18} ${y + 6} Q ${x} ${y - 30} ${x + 18} ${y + 6}`} fill="none" stroke={OUT} strokeWidth={5} />
          <rect x={x - 46} y={y + 6} width={92} height={74} rx={12} fill="#8a3b3b" stroke={OUT} strokeWidth={SW} />
          <rect x={x - 8} y={y + 24} width={16} height={10} fill="#d9b45a" />
        </g>
      );
    case "cicek":
      return (
        <g>
          <path d={`M ${x} ${y} L ${x - 20} ${y - 80} M ${x} ${y} L ${x + 4} ${y - 90} M ${x} ${y} L ${x + 24} ${y - 76}`} stroke="#3f7a3a" strokeWidth={5} />
          {[
            [-20, -86, "#e2506a"],
            [4, -96, "#f2c14e"],
            [24, -82, "#e2506a"],
          ].map(([dx, dy, c], i) => (
            <circle key={i} cx={x + (dx as number)} cy={y + (dy as number)} r={14} fill={c as string} stroke={OUT} strokeWidth={3} />
          ))}
          <path d={`M ${x - 20} ${y - 10} L ${x + 20} ${y - 10} L ${x + 6} ${y + 24} L ${x - 6} ${y + 24} Z`} fill="#d8c7a8" stroke={OUT} strokeWidth={3} />
        </g>
      );
    case "bicak":
      return (
        <g>
          <rect x={x - 6} y={y - 20} width={12} height={34} rx={3} fill="#3a2a22" stroke={OUT} strokeWidth={3} />
          <path d={`M ${x - 6} ${y - 20} L ${x - 4} ${y - 100} Q ${x + 10} ${y - 60} ${x + 6} ${y - 20} Z`} fill="#d7dde3" stroke={OUT} strokeWidth={3} />
        </g>
      );
    case "anahtar":
      return (
        <g>
          <circle cx={x} cy={y - 30} r={12} fill="none" stroke="#c9a75a" strokeWidth={6} />
          <path d={`M ${x} ${y - 18} L ${x} ${y + 30} M ${x} ${y + 18} l 10 0 M ${x} ${y + 28} l 8 0`} stroke="#c9a75a" strokeWidth={6} />
        </g>
      );
    case "kitap":
      return (
        <g>
          <rect x={x - 40} y={y - 56} width={80} height={60} rx={4} fill="#3b5d8a" stroke={OUT} strokeWidth={3.5} />
          <path d={`M ${x - 30} ${y - 46} H ${x + 30}`} stroke="#d9c38a" strokeWidth={4} />
        </g>
      );
    case "tepsi":
      // metal ilaç tepsisi: kâğıt ilaç kabı + su bardağı (el tepsinin altında)
      return (
        <g>
          <rect x={x - 95} y={y - 24} width={190} height={16} rx={6} fill="#c4ccd2" stroke={OUT} strokeWidth={3.5} />
          <path d={`M ${x - 60} ${y - 24} L ${x - 54} ${y - 52} L ${x - 26} ${y - 52} L ${x - 20} ${y - 24} Z`} fill="#f6f2e8" stroke={OUT} strokeWidth={3} />
          <circle cx={x - 46} cy={y - 56} r={5} fill="#e85a5a" stroke={OUT} strokeWidth={2} />
          <circle cx={x - 34} cy={y - 57} r={5} fill="#f4f4f0" stroke={OUT} strokeWidth={2} />
          <path d={`M ${x + 20} ${y - 24} L ${x + 26} ${y - 74} L ${x + 62} ${y - 74} L ${x + 68} ${y - 24} Z`} fill="#dff0ff" fillOpacity={0.75} stroke={OUT} strokeWidth={3} />
          <path d={`M ${x + 24} ${y - 50} H ${x + 64}`} stroke="#9cc8ec" strokeWidth={3} />
        </g>
      );
    case "ilac":
      // iki parmak arasında hap
      return (
        <g>
          <ellipse cx={x} cy={y - 24} rx={11} ry={6} fill="#e85a5a" stroke={OUT} strokeWidth={2.5} />
          <path d={`M ${x} ${y - 30} V ${y - 18}`} stroke="#ffffff" strokeWidth={2} />
        </g>
      );
    case "kalem":
      return (
        <g transform={`rotate(-35 ${x} ${y})`}>
          <rect x={x - 5} y={y - 78} width={10} height={80} rx={3} fill="#1e2430" stroke={OUT} strokeWidth={2.5} />
          <rect x={x - 5} y={y - 78} width={10} height={14} fill="#c9a75a" />
        </g>
      );
    default:
      return null;
  }
};

/* ------------------------------ main ------------------------------ */
export type CharacterProps = {
  look: Look;
  pose?: Pose;
  /** pixel height of a full adult (1000 units) */
  size?: number;
  style?: React.CSSProperties;
  /** mirror the whole character horizontally */
  flip?: boolean;
};

export const Character: React.FC<CharacterProps> = ({ look, pose = {}, size = 1000, style, flip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const seed = pose.seed ?? look.name.length * 7;
  const emo = pose.emotion ?? "notr";
  const face = EMOTION_FACE[emo];
  const blink = useBlink(seed);
  const age = AGE[look.age];
  const wx = BUILD[look.build];
  const male = look.gender === "m";
  const skin = look.skin;
  const out = look.outfit;

  // --- motion ---
  const breathAmt = pose.breath ?? (emo === "korkmus" || emo === "ofkeli" || emo === "agliyor" ? 2 : 1);
  const breathSpeed = breathAmt > 1.5 ? 9 : 22;
  const breathe = Math.sin((frame + seed * 13) / breathSpeed) * 0.01 * breathAmt;
  const sobbing = emo === "agliyor" ? Math.max(0, Math.sin(frame / 4)) * 3 : 0;
  const sway = Math.sin((frame + seed * 7) / 40) * 1.2;
  const walking = pose.body === "walk";
  const walkPhase = walking ? Math.sin(frame / 5) : 0;
  const bob = walking ? Math.abs(Math.cos(frame / 5)) * -8 : 0;

  // --- face state ---
  const yaw = pose.yaw ?? 0;
  const dx = yaw * 24;
  const lookX = pose.lookX ?? yaw * 0.6;
  const lookY = pose.lookY ?? 0;
  const eyeOpenBase = face.eyeOpen * (1 - Math.max(blink, pose.eyesClosed ?? 0));
  const time = pose.speech ? (frame - pose.speech.from) / fps : -1;
  let vis: Viseme | null = pose.speech ? currentViseme(pose.speech.cues, time) : null;
  if (!vis && pose.talk && pose.talk.some(([a, b]) => frame >= a && frame < b)) {
    const opts: Viseme[] = ["A", "E", "L", "O", "M", "I", "L", "A"];
    vis = opts[Math.floor(random(`t-${seed}-${Math.floor(frame / 3)}`) * opts.length)];
  }
  const amp = emo === "ofkeli" || emo === "korkmus" || emo === "sok" ? 1.25 : emo === "uzgun" || emo === "yorgun" ? 0.8 : 1;
  const browColor = look.age === "old" && !["hijab"].includes(look.hair.style) ? "#7d746c" : look.hair.style === "hijab" ? "#4a3428" : look.hair.color;

  // --- arms ---
  const g = GESTURES[pose.gesture ?? "rest"];
  const armL: FullArm = { ...g.L, ...(pose.armL ?? {}) };
  const armR: FullArm = { ...g.R, ...(pose.armR ?? {}) };
  if (pose.gesture === "elSalla") armR.fore += Math.sin(frame / 3) * 18;
  if (walking) {
    armL.upper += walkPhase * 10;
    armR.upper -= walkPhase * 10;
  }
  const shoulderOff = 72 * wx;
  const sleeve = sleeveColor(look);
  const shortSleeve = SHORT_SLEEVES.has(out.type);
  const longCoat = LONG_COATS.has(out.type);

  const Arm = ({ side, a }: { side: "l" | "r"; a: FullArm }) => {
    const sx = side === "l" ? 200 - shoulderOff : 200 + shoulderOff;
    const dir = side === "l" ? 1 : -1;
    const ul = 140 * (a.ul ?? 1);
    const fl = 108 * (a.fl ?? 1);
    const ey = 355 + ul;
    const hy = ey + fl;
    // Eklemler yuvarlak uçlu: omuz ve dirsek döndükçe parçalar daima örtüşür (boşluk açılmaz).
    const upperD = `M ${sx - 22} 352 A 22 22 0 0 1 ${sx + 22} 352 Q ${sx + 24} ${355 + ul * 0.6} ${sx + 19} ${ey} A 19 19 0 0 1 ${sx - 19} ${ey} Q ${sx - 25} ${355 + ul * 0.6} ${sx - 22} 352 Z`;
    const foreD = `M ${sx - 19} ${ey} A 19 19 0 0 1 ${sx + 19} ${ey} L ${sx + 16} ${hy} L ${sx - 16} ${hy} Z`;
    const armFill = shortSleeve ? skin : sleeve;
    // Çift geçiş: önce iki parçanın dış çizgisi, sonra dolgular → eklemde iç çizgi görünmez, kol tek parça gibi bükülür.
    return (
      <g transform={`rotate(${a.upper * dir} ${sx} 355)`}>
        <path d={upperD} fill={OUT} stroke={OUT} strokeWidth={SW * 2} strokeLinejoin="round" />
        <g transform={`rotate(${a.fore * dir} ${sx} ${ey})`}>
          <path d={foreD} fill={OUT} stroke={OUT} strokeWidth={SW * 2} strokeLinejoin="round" />
        </g>
        <path d={upperD} fill={armFill} />
        {shortSleeve ? (
          <path d={`M ${sx - 24} 352 A 24 24 0 0 1 ${sx + 24} 352 L ${sx + 25} ${355 + ul * 0.45} L ${sx - 25} ${355 + ul * 0.45} Z`} fill={out.top} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
        ) : null}
        <g transform={`rotate(${a.fore * dir} ${sx} ${ey})`}>
          <path d={foreD} fill={armFill} />
          {!shortSleeve && out.type === "tracksuit" ? <path d={`M ${sx + 12} ${ey} L ${sx + 10} ${hy}`} stroke="#fff" strokeWidth={5} /> : null}
          {!shortSleeve ? <rect x={sx - 17} y={hy - 12} width={34} height={10} fill={out.topShade} stroke={OUT} strokeWidth={3} /> : null}
          <circle cx={sx} cy={hy + 12} r={21} fill={skin} stroke={OUT} strokeWidth={SW} />
          <path d={`M ${sx + 12 * dir * -1} ${hy + 2} q ${-10 * dir} 6 ${-4 * dir} 16`} fill="none" stroke={OUT} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
          {side === "r" && pose.prop && pose.prop !== "none" ? (
            <g transform={`rotate(${-(a.upper + a.fore) * dir} ${sx} ${hy + 12})`}>
              <HandProp prop={pose.prop} x={sx} y={hy + 12} look={look} />
              <circle cx={sx} cy={hy + 12} r={21} fill={skin} stroke={OUT} strokeWidth={SW} />
            </g>
          ) : null}
        </g>
      </g>
    );
  };

  // --- legs ---
  const Legs = () => {
    const pants = out.bottom;
    const skirt = out.type === "dress" || (out.type === "school" && !male);
    const legFill = skirt ? skin : pants;
    if (pose.body === "sit") {
      return (
        <g>
          <path d="M 140 600 L 120 700 L 196 712 L 200 640 L 204 712 L 280 700 L 260 600 Z" fill={legFill} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M 126 696 L 132 880 L 186 880 L 194 706 Z" fill={legFill} stroke={OUT} strokeWidth={SW} />
          <path d="M 206 706 L 214 880 L 268 880 L 274 696 Z" fill={legFill} stroke={OUT} strokeWidth={SW} />
          <path d="M 124 876 Q 120 908 156 908 L 190 908 L 190 876 Z" fill={out.shoes} stroke={OUT} strokeWidth={SW} />
          <path d="M 210 876 L 210 908 L 244 908 Q 280 908 276 876 Z" fill={out.shoes} stroke={OUT} strokeWidth={SW} />
        </g>
      );
    }
    const leg = (side: number) => {
      const hx = side < 0 ? 172 : 228;
      const rot = walking ? walkPhase * 16 * side : 0;
      return (
        <g key={side} transform={`rotate(${rot} ${hx} 600)`}>
          <path d={side < 0 ? "M 146 600 L 144 950 L 196 950 L 200 600 Z" : "M 200 600 L 204 950 L 256 950 L 254 600 Z"} fill={legFill} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          <path d={side < 0 ? "M 138 946 Q 136 978 170 978 L 198 978 L 198 946 Z" : "M 202 946 L 202 978 L 230 978 Q 264 978 262 946 Z"} fill={out.shoes} stroke={OUT} strokeWidth={SW} />
        </g>
      );
    };
    return (
      <g>
        {leg(-1)}
        {leg(1)}
      </g>
    );
  };

  // --- torso + outfit ---
  const torsoEnd = longCoat ? 740 : 628;
  const Torso = () => {
    const t = out.type;
    const body = `M 128 340 Q 200 320 272 340 Q 290 360 282 470 L ${longCoat ? 292 : 268} ${torsoEnd} Q 200 ${torsoEnd + 16} ${longCoat ? 108 : 132} ${torsoEnd} L 118 470 Q 110 360 128 340 Z`;
    const skirtGirl = t === "dress" || (t === "school" && !male);
    return (
      <g>
        {t === "hoodie" ? <path d="M 140 330 Q 200 390 260 330 Q 250 300 200 296 Q 150 300 140 330 Z" fill={out.topShade} stroke={OUT} strokeWidth={SW} /> : null}
        {skirtGirl ? (
          <path
            d={`M 136 590 L ${t === "dress" ? 96 : 110} ${t === "dress" ? 830 : 760} Q 200 ${t === "dress" ? 850 : 776} ${t === "dress" ? 304 : 290} ${t === "dress" ? 830 : 760} L 264 590 Z`}
            fill={t === "dress" ? out.top : out.bottom}
            stroke={OUT}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
        ) : null}
        {skirtGirl ? <path d={`M 170 610 L 150 ${t === "dress" ? 830 : 760} M 230 610 L 250 ${t === "dress" ? 830 : 760} M 200 612 L 200 ${t === "dress" ? 840 : 768}`} stroke={t === "dress" ? out.topShade : "#00000033"} strokeWidth={4} /> : null}
        <path d={body} fill={out.top} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
        <path d={`M 250 360 Q 268 470 ${longCoat ? 266 : 252} ${torsoEnd - 8} L ${longCoat ? 284 : 268} ${torsoEnd - 8} Q 286 470 268 350 Z`} fill={out.topShade} opacity={0.7} />
        {/* per-outfit details */}
        {t === "tshirt" || t === "sweater" || t === "dress" || t === "tracksuit" ? <path d="M 172 330 Q 200 362 228 330" fill="none" stroke={OUT} strokeWidth={SW} /> : null}
        {t === "sweater" ? <path d="M 136 612 Q 200 626 264 612" fill="none" stroke={out.topShade} strokeWidth={6} /> : null}
        {t === "tracksuit" ? <path d="M 200 336 L 200 620" stroke="#d8d8d8" strokeWidth={4} /> : null}
        {t === "shirt" || t === "school" || t === "police" ? (
          <g>
            {t === "school" ? <path d="M 150 340 L 150 610 Q 200 622 250 610 L 250 340 L 220 330 L 200 420 L 180 330 Z" fill={out.top} stroke={OUT} strokeWidth={3} /> : null}
            {t === "school" ? <path d="M 180 330 L 200 420 L 220 330 Z" fill="#f6f5f0" stroke={OUT} strokeWidth={3} /> : null}
            <path d="M 176 326 L 200 356 L 168 368 Z M 224 326 L 200 356 L 232 368 Z" fill={t === "school" ? "#f6f5f0" : out.topShade} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
            {t !== "school" ? <path d="M 200 356 L 200 620" stroke={OUT} strokeWidth={2.5} strokeOpacity={0.6} /> : null}
            {[400, 460, 520, 580].map((y) => (t !== "school" ? <circle key={y} cx={206} cy={y} r={3.5} fill={OUT} opacity={0.7} /> : null))}
          </g>
        ) : null}
        {(t === "shirt" || t === "suit" || t === "school") && out.accent ? (
          <path d="M 194 356 L 206 356 L 212 372 L 204 470 L 200 482 L 196 470 L 188 372 Z" fill={out.accent} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
        ) : null}
        {t === "suit" ? (
          <g>
            <path d="M 172 330 L 200 420 L 228 330 Z" fill="#f4f2ec" stroke={OUT} strokeWidth={3} />
            {out.accent ? <path d="M 194 340 L 206 340 L 210 352 L 204 418 L 200 426 L 196 418 L 190 352 Z" fill={out.accent} stroke={OUT} strokeWidth={3} /> : null}
            <path d="M 160 334 L 200 450 L 186 360 Z M 240 334 L 200 450 L 214 360 Z" fill={out.topShade} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
            <circle cx={206} cy={500} r={5} fill={OUT} />
            <circle cx={206} cy={560} r={5} fill={OUT} />
            <path d="M 236 420 L 262 418" stroke={OUT} strokeWidth={3} />
          </g>
        ) : null}
        {t === "cardigan" ? (
          <g>
            <path d="M 176 332 Q 200 350 224 332 L 214 624 Q 200 628 186 624 Z" fill={out.accent ?? "#f2ece0"} stroke={OUT} strokeWidth={3} />
            {[420, 490, 560].map((y) => (
              <circle key={y} cx={176} cy={y} r={5} fill={out.topShade} stroke={OUT} strokeWidth={2} />
            ))}
          </g>
        ) : null}
        {t === "coat" ? (
          <g>
            <path d="M 200 330 L 200 740" stroke={OUT} strokeWidth={3} />
            <path d="M 168 330 L 200 420 L 232 330" fill={out.accent ?? "#e9e2d6"} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
            <path d="M 150 336 L 200 440 L 180 350 Z M 250 336 L 200 440 L 220 350 Z" fill={out.topShade} stroke={OUT} strokeWidth={3} />
            {[480, 560, 640].map((y) => (
              <circle key={y} cx={214} cy={y} r={5} fill={OUT} />
            ))}
          </g>
        ) : null}
        {t === "labcoat" ? (
          <g>
            <path d="M 176 330 L 200 380 L 224 330 L 216 740 L 184 740 Z" fill={out.accent ?? "#7fa7c9"} stroke={OUT} strokeWidth={3} />
            <path d="M 156 336 L 196 460 L 180 350 Z M 244 336 L 204 460 L 220 350 Z" fill="#dcdcd6" stroke={OUT} strokeWidth={3} />
            <rect x={226} y={470} width={36} height={40} fill="none" stroke={OUT} strokeWidth={3} />
            <path d="M 236 470 L 236 452" stroke="#2b5fa8" strokeWidth={5} />
            <path d="M 160 350 Q 150 460 190 470 Q 230 474 240 440" fill="none" stroke="#333" strokeWidth={5} />
            <circle cx={240} cy={440} r={10} fill="#bbb" stroke={OUT} strokeWidth={3} />
          </g>
        ) : null}
        {t === "police" ? (
          <g>
            <path d="M 222 420 l 10 -12 l 10 12 l -4 16 l -12 0 z" fill="#d9b45a" stroke={OUT} strokeWidth={2.5} />
            <rect x={128} y={598} width={144} height={22} fill="#222" />
            <rect x={190} y={598} width={22} height={22} fill="#c9a75a" />
            <rect x={130} y={338} width={40} height={10} fill={out.topShade} transform="rotate(8 150 343)" />
            <rect x={230} y={338} width={40} height={10} fill={out.topShade} transform="rotate(-8 250 343)" />
          </g>
        ) : null}
        {t === "hoodie" ? (
          <g>
            <path d="M 150 520 L 250 520 L 262 600 L 138 600 Z" fill={out.topShade} stroke={OUT} strokeWidth={3} />
            <path d="M 186 350 L 182 420 M 214 350 L 218 420" stroke="#eee" strokeWidth={4} strokeLinecap="round" />
          </g>
        ) : null}
        {t === "apron" ? (
          <g>
            <path d="M 160 400 L 240 400 L 262 700 L 138 700 Z" fill={out.accent ?? "#f3efe6"} stroke={OUT} strokeWidth={3.5} />
            <path d="M 160 400 L 182 332 M 240 400 L 218 332" stroke={out.accent ?? "#f3efe6"} strokeWidth={8} />
            <rect x={172} y={520} width={56} height={40} fill="none" stroke={OUT} strokeWidth={3} />
          </g>
        ) : null}
        {look.earrings && look.hair.style !== "hijab" ? null : null}
      </g>
    );
  };

  // --- head ---
  const old = look.age === "old";
  const facePath = male
    ? "M 114 150 Q 112 250 140 286 Q 170 312 200 312 Q 230 312 260 286 Q 288 250 286 150 Q 280 90 200 90 Q 120 90 114 150 Z"
    : "M 116 150 Q 112 246 146 284 Q 174 310 200 310 Q 226 310 254 284 Q 288 246 284 150 Q 278 92 200 92 Q 122 92 116 150 Z";
  const squeezeL = 1 - Math.max(0, -yaw) * 0.3;
  const squeezeR = 1 - Math.max(0, yaw) * 0.3;
  const tears = pose.tears ?? (emo === "agliyor" ? 0.8 : 0);
  const pale = pose.pale ?? (emo === "sok" ? 0.6 : 0);
  const blushAmt = (look.blush === false ? 0 : 1) * face.blush * (1 - pale);

  const Head = () => (
    <g>
      {look.hair.style !== "hijab" ? (
        <>
          <ellipse cx={110 - dx * 0.4} cy={210} rx={14} ry={22} fill={skin} stroke={OUT} strokeWidth={SW} />
          <ellipse cx={290 - dx * 0.4} cy={210} rx={14} ry={22} fill={skin} stroke={OUT} strokeWidth={SW} />
          {look.earrings ? (
            <>
              <circle cx={110 - dx * 0.4} cy={238} r={6} fill={look.earrings} stroke={OUT} strokeWidth={2} />
              <circle cx={290 - dx * 0.4} cy={238} r={6} fill={look.earrings} stroke={OUT} strokeWidth={2} />
            </>
          ) : null}
        </>
      ) : null}
      <path d={facePath} fill={skin} stroke={OUT} strokeWidth={SW} />
      <path d={facePath} fill="#c9d6e0" opacity={pale * 0.45} />
      <path d={`M ${262 - Math.min(0, dx)} 180 Q 276 240 248 282 Q 270 270 280 230 Q 286 190 278 160 Z`} fill={look.skinShade} opacity={0.55} />
      {old ? (
        <g stroke={OUT} strokeOpacity={0.3} strokeWidth={2.5} fill="none">
          <path d={`M ${160 + dx} 126 Q ${200 + dx} 118 ${240 + dx} 126`} />
          <path d={`M ${170 + dx} 138 Q ${200 + dx} 132 ${230 + dx} 138`} />
          <path d={`M ${150 + dx} 250 Q ${156 + dx} 268 ${166 + dx} 278`} />
          <path d={`M ${250 + dx} 250 Q ${244 + dx} 268 ${234 + dx} 278`} />
        </g>
      ) : null}
      {look.facialHair === "stubble" || look.facialHair === "beard" ? (
        <path d={`M 128 236 Q 132 300 200 314 Q 268 300 272 236 Q 250 276 200 282 Q 150 276 128 236 Z`} fill={look.facialHair === "beard" ? look.hair.color : "#5a4a44"} opacity={look.facialHair === "beard" ? 1 : 0.22} stroke={look.facialHair === "beard" ? OUT : "none"} strokeWidth={3} />
      ) : null}
      <g opacity={blushAmt}>
        <ellipse cx={148 + dx} cy={238} rx={19} ry={10} fill="#ef8f8a" />
        <ellipse cx={252 + dx} cy={238} rx={19} ry={10} fill="#ef8f8a" />
      </g>
      <Eye cx={160 + dx} cy={198} look={look} lookX={lookX} lookY={lookY} open={eyeOpenBase} smile={face.eyeSmile} pupil={face.pupil} squeeze={squeezeL} uid={`${uid}l`} />
      <Eye cx={240 + dx} cy={198} look={look} lookX={lookX} lookY={lookY} open={eyeOpenBase} smile={face.eyeSmile} pupil={face.pupil} squeeze={squeezeR} flip uid={`${uid}r`} />
      <Brow cx={160 + dx} cy={160} inner={face.browInner} outer={face.browOuter} lift={face.browLift} color={browColor} thick={male ? 8 : 6.5} squeeze={squeezeL} />
      <Brow cx={240 + dx} cy={160} inner={face.browInner} outer={face.browOuter} lift={face.browLift} color={browColor} thick={male ? 8 : 6.5} squeeze={squeezeR} flip />
      <path d={`M ${202 + dx * 1.3} 214 Q ${196 + dx * 1.5 - Math.abs(yaw) * 6 * Math.sign(yaw || 1)} 236 ${204 + dx * 1.3} 244`} fill="none" stroke={OUT} strokeWidth={3.5} strokeLinecap="round" />
      {look.mole ? <circle cx={236 + dx} cy={262} r={3} fill="#5a3a2a" /> : null}
      {look.facialHair === "mustache" || look.facialHair === "beard" ? (
        <path d={`M ${166 + dx} 262 Q ${200 + dx} 246 ${234 + dx} 262 Q ${220 + dx} 270 ${200 + dx} 264 Q ${180 + dx} 270 ${166 + dx} 262 Z`} fill={look.hair.color} stroke={OUT} strokeWidth={3} />
      ) : null}
      {look.facialHair === "goatee" ? <path d={`M ${186 + dx} 292 Q ${200 + dx} 312 ${214 + dx} 292 L ${210 + dx} 302 Q ${200 + dx} 306 ${190 + dx} 302 Z`} fill={look.hair.color} stroke={OUT} strokeWidth={3} /> : null}
      <Mouth viseme={vis} rest={face.mouth} cx={200 + dx * 1.1} cy={274} amp={amp} />
      {tears > 0 ? (
        <g opacity={Math.min(1, tears * 2)}>
          {[160 + dx - 12, 240 + dx + 12].map((x, i) => {
            const len = tears * 70 + ((frame + i * 9) % 30) * 0.4;
            return (
              <path key={i} d={`M ${x - 3} 214 Q ${x - 6} ${214 + len} ${x} ${220 + len} Q ${x + 5} ${214 + len} ${x + 3} 214 Z`} fill="#bfe3ff" stroke="#7fb6dd" strokeWidth={2} />
            );
          })}
          <path d={`M ${138 + dx} 210 Q ${160 + dx} 220 ${182 + dx} 210 M ${218 + dx} 210 Q ${240 + dx} 220 ${262 + dx} 210`} stroke="#bfe3ff" strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
      {pose.sweat ? <path d={`M ${280} 140 q -7 16 0 22 q 7 -6 0 -22 z`} fill="#bfe3ff" stroke="#6fa8cf" strokeWidth={2} /> : null}
      <HairFront look={look} dx={yaw * 10} />
      {look.glasses ? (
        <g fill="none" stroke={look.glasses} strokeWidth={5}>
          <rect x={130 + dx} y={176} width={60} height={44} rx={14} />
          <rect x={210 + dx} y={176} width={60} height={44} rx={14} />
          <path d={`M ${190 + dx} 194 Q ${200 + dx} 186 ${210 + dx} 194 M ${130 + dx} 192 L 114 186 M ${270 + dx} 192 L 286 186`} />
        </g>
      ) : null}
      {pose.wet ? (
        <g fill="#bfe3ff" stroke="#6fa8cf" strokeWidth={1.5}>
          <path d="M 130 210 q -4 10 0 14 q 4 -4 0 -14 z" />
          <path d="M 274 190 q -4 10 0 14 q 4 -4 0 -14 z" />
          <path d="M 210 120 q -4 10 0 14 q 4 -4 0 -14 z" />
        </g>
      ) : null}
    </g>
  );

  const groundShift = 680 * (1 - age.sy) + (pose.body === "sit" ? 0 : 0);
  const bodyT = `translate(200 300) scale(${age.sx} ${age.sy}) translate(-200 -300)`;
  const torsoScale = `translate(200 470) scale(${wx} ${1 + breathe}) translate(-200 -470)`;
  const headT = `translate(0 ${-breathe * 300 + sobbing}) rotate(${(pose.tilt ?? 0) + sway * 0.6} 200 300) translate(200 300) scale(${age.head}) translate(-200 -300)`;

  return (
    <svg
      viewBox="0 0 400 1000"
      width={size * 0.4}
      height={size}
      style={{ overflow: "visible", scale: flip ? "-1 1" : undefined, ...style }}
    >
      <g transform={`translate(0 ${groundShift + bob})`}>
        <ellipse cx={200} cy={(pose.body === "sit" ? 910 : 985) - groundShift} rx={130 * wx} ry={16} fill="#000" opacity={0.2} transform={`translate(0 ${-bob})`} />
        {/* back hair (follows the head) */}
        <g transform={bodyT}>
          <g transform={headT}>
            <HairBack look={look} dx={yaw * 10} sway={sway * 2} />
          </g>
        </g>
        <g transform={bodyT}>
          {pose.hideLegs ? null : <Legs />}
          <g transform={torsoScale}>
            <Torso />
          </g>
          {/* neck */}
          <path d="M 180 290 L 180 336 Q 200 346 220 336 L 220 290 Z" fill={look.hair.style === "hijab" ? look.hair.color : skin} stroke={OUT} strokeWidth={SW} />
          <path d="M 182 318 Q 200 330 218 318" fill="none" stroke={look.skinShade} strokeWidth={6} opacity={look.hair.style === "hijab" ? 0 : 1} />
        </g>
        <g transform={bodyT}>
          <g transform={headT}>
            <Head />
          </g>
        </g>
        <g transform={bodyT}>
          <Arm side="l" a={armL} />
          <Arm side="r" a={armR} />
        </g>
      </g>
    </svg>
  );
};
