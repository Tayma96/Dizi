import React, { useId } from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Brow, EMOTION_FACE, Eye, Mouth, OUT } from "./face";
import { GESTURES, type FullArm } from "./gestures";
import { HairBack, HairFront } from "./hair";
import type { Look, MouthCue, Pose, Prop, Viseme } from "./types";

const SW = 4;
const AHIZE_DX = 34, AHIZE_ROT = 22; // ahize yüzün yanında: üst uç kulakta, alt uç ağız köşesinin dışında

export const AGE = {
  child: { sx: 0.8, sy: 0.6, head: 0.94 },
  teen: { sx: 0.9, sy: 0.86, head: 0.97 },
  adult: { sx: 1, sy: 1, head: 1 },
  old: { sx: 1, sy: 0.97, head: 1 },
} as const;
const BUILD = { slim: 0.9, normal: 1, heavy: 1.24 } as const;

const SHORT_SLEEVES = new Set(["tshirt", "dress", "police", "yerli"]);
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
    case "tablet":
      // tablet: ekranı karşıdakine dönük; arka yüzü koyu, kenarından soğuk ekran ışığı taşar
      return (
        <g>
          <defs><radialGradient id="tbHale"><stop offset="0" stopColor="#9fc4ff" stopOpacity={0.22} /><stop offset="1" stopColor="#9fc4ff" stopOpacity={0} /></radialGradient></defs>
          <ellipse cx={x + 30} cy={y - 76} rx={150} ry={140} fill="url(#tbHale)" />
          <rect x={x - 46} y={y - 150} width={92} height={136} rx={12} fill="#16181c" stroke={OUT} strokeWidth={3.5} />
          <rect x={x - 40} y={y - 144} width={80} height={124} rx={8} fill="#2a3446" />
          <path d={`M ${x + 40} ${y - 140} v 116`} stroke="#9fc4ff" strokeWidth={4} opacity={0.8} />
          <circle cx={x} cy={y - 60} r={5} fill="#3a3e44" />
        </g>
      );
    case "hindistan":
      // yarım hindistan cevizi kabuğu, içinde su
      return (
        <g>
          <path d={`M ${x - 40} ${y - 40} Q ${x - 44} ${y + 10} ${x} ${y + 14} Q ${x + 44} ${y + 10} ${x + 40} ${y - 40} Z`} fill="#6a4a2c" stroke={OUT} strokeWidth={3.5} />
          <ellipse cx={x} cy={y - 40} rx={40} ry={11} fill="#f4ecd8" stroke={OUT} strokeWidth={3} />
          <ellipse cx={x} cy={y - 39} rx={32} ry={7} fill="#cfe4e8" />
          <path d={`M ${x - 30} ${y - 24} q 10 6 20 0 M ${x + 4} ${y - 12} q 10 6 20 0`} stroke="#4a321c" strokeWidth={2} fill="none" />
        </g>
      );
    case "kasik":
      return (
        <g>
          <path d={`M ${x} ${y} L ${x - 6} ${y - 70}`} stroke="#c8ccd0" strokeWidth={7} strokeLinecap="round" />
          <ellipse cx={x - 7} cy={y - 82} rx={11} ry={16} fill="#d8dce0" stroke={OUT} strokeWidth={2.5} />
        </g>
      );
    case "kagit":
      // A4 kural kâğıdı (elde dik tutulur)
      return (
        <g transform={`rotate(-6 ${x} ${y})`}>
          <rect x={x - 46} y={y - 128} width={92} height={128} rx={3} fill="#fbfaf4" stroke={OUT} strokeWidth={3.5} />
          <rect x={x - 26} y={y - 118} width={52} height={9} fill="#b81818" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${x - 36} ${y - 96 + i * 22} h 10 M ${x - 22} ${y - 96 + i * 22} H ${x + 36} M ${x - 22} ${y - 88 + i * 22} H ${x + 20}`} stroke="#6a6a6a" strokeWidth={2.5} />)}
        </g>
      );
    case "cikolata":
      return (
        <g transform={`rotate(-12 ${x} ${y})`}>
          <rect x={x - 16} y={y - 70} width={32} height={84} rx={4} fill="#5a2a8a" stroke={OUT} strokeWidth={3} />
          <rect x={x - 16} y={y - 40} width={32} height={22} fill="#f2c21a" />
          <path d={`M ${x - 16} ${y - 70} l 4 -8 l 8 6 l 8 -6 l 8 6 l 4 -6 L ${x + 16} ${y - 70}`} fill="#c0c4cc" stroke={OUT} strokeWidth={2} />
        </g>
      );
    case "para":
      return (
        <g transform={`rotate(-20 ${x} ${y})`}>
          <rect x={x - 40} y={y - 46} width={80} height={40} rx={3} fill="#7ab88a" stroke={OUT} strokeWidth={2.5} />
          <circle cx={x} cy={y - 26} r={10} fill="none" stroke="#3a7a4a" strokeWidth={2} />
          <text x={x - 30} y={y - 12} fontFamily="Arial" fontSize={10} fontWeight={800} fill="#2a5a3a">50</text>
        </g>
      );
    case "kagit_top":
      // buruşturulmuş sözleşme: avuçta düzensiz kâğıt topu
      return (
        <g>
          <path d={`M ${x - 30} ${y - 4} L ${x - 20} ${y - 34} L ${x + 4} ${y - 40} L ${x + 28} ${y - 26} L ${x + 34} ${y + 2} L ${x + 22} ${y + 28} L ${x - 6} ${y + 34} L ${x - 28} ${y + 20} Z`} fill="#e8e2d0" stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
          <path d={`M ${x - 18} ${y - 20} L ${x + 2} ${y - 4} L ${x + 22} ${y - 14} M ${x + 2} ${y - 4} L ${x - 4} ${y + 22} M ${x - 22} ${y + 8} L ${x - 4} ${y + 2}`} stroke="#b8b0a0" strokeWidth={2.5} fill="none" />
        </g>
      );
    case "sozlesme":
      // Zenith anlaşma taslağı (kapak): lacivert Z halkası, başlık, tutar çizgisi, imza alanları
      return (
        <g transform={`rotate(-6 ${x} ${y})`}>
          <rect x={x - 46} y={y - 128} width={92} height={128} rx={3} fill="#f8f5ee" stroke={OUT} strokeWidth={3.5} />
          <circle cx={x} cy={y - 108} r={9} fill="none" stroke="#1d2a44" strokeWidth={2.5} />
          <circle cx={x + 7} cy={y - 115} r={2} fill="#c9a24a" />
          <path d={`M ${x - 26} ${y - 90} H ${x + 26}`} stroke="#1d2a44" strokeWidth={3} />
          <path d={`M ${x - 30} ${y - 70} H ${x + 30}`} stroke="#1d2a44" strokeWidth={6} />
          {[0, 1, 2].map((i) => <path key={i} d={`M ${x - 32} ${y - 50 + i * 12} H ${x + (i === 2 ? 8 : 32)}`} stroke="#9aa0b0" strokeWidth={2} />)}
          <path d={`M ${x - 34} ${y - 12} H ${x - 6} M ${x + 6} ${y - 12} H ${x + 34}`} stroke="#1d2a44" strokeWidth={1.5} />
          <path d={`M ${x - 40} ${y - 30} q 20 10 40 0`} stroke="#c8b890" strokeWidth={6} opacity={0.5} fill="none" />
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
    case "pano":
      // ilaç takip panosu (kâğıt + kıskaç)
      return (
        <g>
          <rect x={x - 46} y={y - 120} width={92} height={124} rx={6} fill="#b98a5a" stroke={OUT} strokeWidth={3.5} />
          <rect x={x - 38} y={y - 108} width={76} height={104} fill="#f6f4ee" />
          <rect x={x - 18} y={y - 126} width={36} height={16} rx={4} fill="#9aa4aa" stroke={OUT} strokeWidth={3} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${x - 28} ${y - 88 + i * 20} H ${x + 26}`} stroke="#9aa0a6" strokeWidth={3} />)}
        </g>
      );
    case "bardak":
      return <path d={`M ${x - 22} ${y - 6} L ${x - 18} ${y - 74} L ${x + 18} ${y - 74} L ${x + 22} ${y - 6} Z`} fill="#dff0ff" fillOpacity={0.8} stroke={OUT} strokeWidth={3} />;
    case "ahize":
      // telefon ahizesi: el ortadan tutar; üst uç (kulaklık) kulağa, alt uç (mikrofon) ağza doğru; kıvrık kablo aşağı sarkar
      return (
        <g transform={`translate(${AHIZE_DX} 0) rotate(${AHIZE_ROT} ${x} ${y})`}>
          <path d={`M ${x - 6} ${y - 70} Q ${x - 16} ${y - 5} ${x - 6} ${y + 62}`} stroke={OUT} strokeWidth={30} strokeLinecap="round" fill="none" />
          <path d={`M ${x - 6} ${y - 70} Q ${x - 16} ${y - 5} ${x - 6} ${y + 62}`} stroke="#d8d4c8" strokeWidth={22} strokeLinecap="round" fill="none" />
          <ellipse cx={x - 2} cy={y - 78} rx={22} ry={15} fill="#c8c2b2" stroke={OUT} strokeWidth={3.5} />
          <ellipse cx={x - 2} cy={y + 70} rx={22} ry={15} fill="#c8c2b2" stroke={OUT} strokeWidth={3.5} />
          <path d={`M ${x - 2} ${y + 84} q 12 18 0 30 q -12 12 0 26 q 12 14 0 28 q -12 14 0 30`} stroke="#5a564c" strokeWidth={4} fill="none" />
        </g>
      );
    case "fener":
      return (
        <g>
          <path d={`M ${x + 10} ${y - 20} L ${x + 420} ${y - 220} L ${x + 420} ${y + 200} Z`} fill="#fff6d0" opacity={0.16} />
          <rect x={x - 12} y={y - 30} width={44} height={22} rx={6} fill="#2a2a2e" stroke={OUT} strokeWidth={3} transform={`rotate(-8 ${x} ${y})`} />
          <rect x={x + 30} y={y - 34} width={10} height={30} rx={3} fill="#fff6d0" transform={`rotate(-8 ${x} ${y})`} />
        </g>
      );
    case "telsiz":
      return (
        <g>
          <rect x={x - 16} y={y - 78} width={32} height={74} rx={6} fill="#1c1c1e" stroke={OUT} strokeWidth={3} />
          <rect x={x - 10} y={y - 70} width={20} height={14} fill="#5a8a5a" />
          <path d={`M ${x + 8} ${y - 78} l 0 -40`} stroke="#1c1c1e" strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    case "sopa":
      return (
        <g transform={`rotate(-12 ${x} ${y})`}>
          <path d={`M ${x - 6} ${y - 260} L ${x + 6} ${y - 258} L ${x + 10} ${y + 300} L ${x - 2} ${y + 302} Z`} fill="#7a5530" stroke={OUT} strokeWidth={3} />
          <path d={`M ${x - 2} ${y - 120} l -16 -24 M ${x + 4} ${y + 80} l 14 -20`} stroke="#7a5530" strokeWidth={5} />
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
  // koşu: döngü 0.6 sn (iki adım); basışta gövde aşağı, havada yukarı
  const running = pose.body === "kos";
  const runPh = running ? ((frame + (pose.kosFaz ?? 0)) * 2 * Math.PI) / (0.6 * fps) : 0;
  const runU = Math.sin(runPh);
  const bob = walking ? Math.abs(Math.cos(frame / 5)) * -8 : running ? -18 * Math.abs(Math.cos(runPh)) + 6 : 0;

  // --- face state ---
  const yaw = pose.yaw ?? 0;
  // güçlü dönüş (|yaw| > 0.6): yüz hatları belirgin biçimde yana kayar (omuz üstünden bakış)
  const strong = Math.sign(yaw) * Math.max(0, Math.abs(yaw) - 0.6);
  const dx = yaw * 24 + strong * 70;
  const lookX = pose.lookX ?? yaw * 0.6;
  const lookY = pose.lookY ?? 0;
  const eyeOpenBase = face.eyeOpen * (1 - Math.max(blink, pose.eyesClosed ?? 0));
  const time = pose.speech ? (frame - pose.speech.from) / fps : -1;
  let vis: Viseme | null = pose.speech ? currentViseme(pose.speech.cues, time) : null;
  if (!vis && pose.talk && pose.talk.some(([a, b]) => frame >= a && frame < b)) {
    const opts: Viseme[] = ["A", "E", "L", "O", "M", "I", "L", "A"];
    vis = opts[Math.floor(random(`t-${seed}-${Math.floor(frame / 3)}`) * opts.length)];
  }
  const amp = emo === "dehset" ? 1.45 : emo === "ofkeli" || emo === "korkmus" || emo === "sok" ? 1.25 : emo === "uzgun" || emo === "yorgun" ? 0.8 : 1;
  const browColor = look.age === "old" && !["hijab"].includes(look.hair.style) ? "#7d746c" : look.hair.style === "hijab" ? "#4a3428" : look.hair.color;

  // --- arms ---
  const g = GESTURES[pose.gesture ?? "rest"];
  const armL: FullArm = { ...g.L, ...(pose.armL ?? {}) };
  const armR: FullArm = { ...g.R, ...(pose.armR ?? {}) };
  if (pose.gesture === "elSalla") armR.fore += Math.sin(frame / 3) * 18;
  if (pose.gesture === "krem") { armR.fore += Math.sin(frame / 2.4) * 5; armR.upper += Math.sin(frame / 2.4 + 1.2) * 3; }
  if (pose.gesture === "kafaKasi") armR.fore += Math.sin(frame / 1.7) * 9;
  if (pose.gesture === "okşa") armL.upper += Math.sin(frame / 5) * 5;
  if (pose.gesture === "havaImzaSol") { const st = Math.floor(frame / 7); armR.fore += (random(`hs${st}`) - 0.5) * 16; armR.upper += (random(`hu${st}`) - 0.5) * 8; }
  if (pose.gesture === "havaImza") { armL.fore += Math.sin(frame / 2.2) * 9 + Math.sin(frame / 5.3) * 5; armL.upper += Math.cos(frame / 3.1) * 5; }
  if (pose.gesture === "raf") { armR.fore += Math.sin(frame / 4) * 12; armR.upper += Math.sin(frame / 6) * 6; armL.fore += Math.cos(frame / 5) * 9; }
  // önlük giyme: kollar ara pozlarla akar (elde katlı → başın üstüne → boyna geçirir → arkadan bağlar)
  const onl = pose.onluk;
  if (onl !== undefined && onl < 1) {
    const K: [number, FullArm][] = [
      [0, { upper: 12, fore: -62, ul: 0.8 }], [0.26, { upper: 12, fore: -62, ul: 0.8 }], [0.44, { upper: 162, fore: -16, ul: 1 }],
      [0.56, { upper: 162, fore: -16, ul: 1 }], [0.72, { upper: 38, fore: -112, ul: 0.8 }], [0.86, { upper: -14, fore: 26, ul: 0.9, fl: 0.55 }], [1, { upper: 6, fore: 0, ul: 1 }],
    ];
    let i = 0;
    while (i < K.length - 2 && onl > K[i + 1][0]) i++;
    const [a0, A] = K[i], [a1, B] = K[i + 1];
    const u = Math.max(0, Math.min(1, (onl - a0) / Math.max(1e-6, a1 - a0)));
    const e = u * u * (3 - 2 * u);
    const mix = (x?: number, y?: number) => (x ?? 1) + ((y ?? 1) - (x ?? 1)) * e;
    const arm: FullArm = { upper: A.upper + (B.upper - A.upper) * e, fore: A.fore + (B.fore - A.fore) * e, ul: mix(A.ul, B.ul), fl: mix(A.fl, B.fl) };
    Object.assign(armL, arm);
    Object.assign(armR, arm);
  }
  if (running) {
    // kol pompalama (önden): öne gelen kolun eli göğse çıkar, kısalır (kameraya yaklaşır); geriye giden el kalçaya iner
    // ön kol kameraya döner: kısalır (fl), el gövdenin yanında göğüs hizasına çıkar; gövdenin önünden çaprazlamaz
    Object.assign(armL, { upper: 15 - 5 * runU, fore: -40 - 24 * runU, ul: 0.875 - 0.085 * runU, fl: 0.74 - 0.22 * runU });
    Object.assign(armR, { upper: 15 + 5 * runU, fore: -40 + 24 * runU, ul: 0.875 + 0.085 * runU, fl: 0.74 + 0.22 * runU });
  }
  if (walking) {
    // kollar bacaklarla zıt fazda: sol bacak öne → sağ kol öne (dir işaretleri ters olduğu için iki kola aynı işaret)
    armL.upper += walkPhase * 10;
    armR.upper += walkPhase * 10;
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
        {look.sargi && side === "l" ? <rect x={sx - 27} y={360 + ul * 0.55} width={54} height={30} rx={9} fill="#5f8a3a" stroke={OUT} strokeWidth={3} /> : null}
        {shortSleeve ? (
          <path d={`M ${sx - 24} 352 A 24 24 0 0 1 ${sx + 24} 352 L ${sx + 25} ${355 + ul * 0.45} L ${sx - 25} ${355 + ul * 0.45} Z`} fill={out.top} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
        ) : null}
        <g transform={`rotate(${a.fore * dir} ${sx} ${ey})`}>
          <path d={foreD} fill={armFill} />
          {!shortSleeve && out.type === "tracksuit" ? <path d={`M ${sx + 12} ${ey} L ${sx + 10} ${hy}`} stroke="#fff" strokeWidth={5} /> : null}
          {!shortSleeve ? <rect x={sx - 17} y={hy - 12} width={34} height={10} fill={out.topShade} stroke={OUT} strokeWidth={3} /> : null}
          {side === "r" && look.bileklik ? <rect x={sx - 18} y={hy - 4} width={36} height={12} rx={4} fill="#f6f6f2" stroke={OUT} strokeWidth={3} /> : null}
          <circle cx={sx} cy={hy + 12} r={21} fill={skin} stroke={OUT} strokeWidth={SW} />
          <path d={`M ${sx + 12 * dir * -1} ${hy + 2} q ${-10 * dir} 6 ${-4 * dir} 16`} fill="none" stroke={OUT} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
          {side === "l" && pose.murekkep ? (
            <g>
              <circle cx={sx - 6} cy={hy + 24} r={7} fill="#10204a" opacity={0.9} />
              <path d={`M ${sx + 12} ${hy + 4} q 6 14 2 26`} stroke="#10204a" strokeWidth={5} strokeLinecap="round" opacity={0.6} fill="none" />
            </g>
          ) : null}
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
    const skirt = out.type === "dress" || out.type === "hostes" || out.type === "yerli" || (out.type === "school" && !male);
    const legFill = skirt ? skin : pants;
    if (pose.body === "sit") {
      return (
        <g>
          <path d="M 140 600 L 120 700 L 196 712 L 200 640 L 204 712 L 280 700 L 260 600 Z" fill={legFill} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M 126 696 L 132 880 L 186 880 L 194 706 Z" fill={legFill} stroke={OUT} strokeWidth={SW} />
          <path d="M 206 706 L 214 880 L 268 880 L 274 696 Z" fill={legFill} stroke={OUT} strokeWidth={SW} />
          <path d="M 124 876 Q 120 908 156 908 L 190 908 L 190 876 Z" fill={out.shoes === "skin" ? skin : out.shoes} stroke={OUT} strokeWidth={SW} />
          <path d="M 210 876 L 210 908 L 244 908 Q 280 908 276 876 Z" fill={out.shoes === "skin" ? skin : out.shoes} stroke={OUT} strokeWidth={SW} />
        </g>
      );
    }
    if (dizK > 0) {
      // diz çökme (önden): sol uyluk dik iner, diz yere değer, baldır geriye (görünmez) kısalır;
      // sağ uyluk kameraya doğru kısalır, diz yukarıda, baldır dik, ayak yere basar
      const k = dizK;
      const sol = 175 * (1 - k);
      const sagUy = 600 + 175 * (1 - 0.8 * k);
      const zemin = 985 - 185 * k - 28;
      const ayak = (x: number, y: number, key: string) => (
        <path key={key} d={`M ${x - 26} ${y} Q ${x - 28} ${y + 32} ${x + 6} ${y + 32} L ${x + 30} ${y + 32} L ${x + 30} ${y} Z`} fill={out.shoes === "skin" ? skin : out.shoes} stroke={OUT} strokeWidth={SW} />
      );
      return (
        <g>
          {/* sol bacak: uyluk + kısalan baldır */}
          <path d={`M 146 600 L 144 775 L 196 775 L 200 600 Z`} fill={legFill} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          {sol > 4 ? <path d={`M 146 772 L 146 ${775 + sol} L 194 ${775 + sol} L 196 772 Z`} fill={legFill} stroke={OUT} strokeWidth={SW} /> : null}
          {k < 0.6 ? ayak(170, 775 + sol - 2, "al") : null}
          <ellipse cx={170} cy={786} rx={30} ry={18 + 6 * k} fill={legFill} stroke={OUT} strokeWidth={SW} />
          {/* sağ bacak: kısalmış uyluk, öne çıkan diz, dik baldır, basan ayak */}
          <path d={`M 202 600 L 256 600 L ${258 + 6 * k} ${sagUy} L ${198 - 4 * k} ${sagUy} Z`} fill={legFill} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          <path d={`M ${204 - 2 * k} ${sagUy - 6} L ${204} ${zemin} L ${256} ${zemin} L ${256 + 4 * k} ${sagUy - 6} Z`} fill={legFill} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          <ellipse cx={230 + k} cy={sagUy - 4} rx={31 + 4 * k} ry={22 + 8 * k} fill={legFill} stroke={OUT} strokeWidth={SW} />
          {ayak(230, zemin, "ar")}
        </g>
      );
    }
    const leg = (side: number) => {
      const hx = side < 0 ? 172 : 228;
      const rot = walking ? walkPhase * 16 * side : running ? runU * 28 * side : pose.legRot ? pose.legRot[side < 0 ? 0 : 1] : 0;
      return (
        <g key={side} transform={`rotate(${rot} ${hx} 600)`}>
          <path d={side < 0 ? "M 146 600 L 144 950 L 196 950 L 200 600 Z" : "M 200 600 L 204 950 L 256 950 L 254 600 Z"} fill={legFill} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          <path d={side < 0 ? "M 138 946 Q 136 978 170 978 L 198 978 L 198 946 Z" : "M 202 946 L 202 978 L 230 978 Q 264 978 262 946 Z"} fill={out.shoes === "skin" ? skin : out.shoes} stroke={OUT} strokeWidth={SW} />
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
        {t === "yerli" && male ? (
          <g>
            <path d="M 130 590 L 122 770 Q 200 784 278 770 L 270 590 Z" fill={out.bottom} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
            <path d="M 150 600 L 236 772" stroke="#00000033" strokeWidth={5} />
            <path d="M 126 760 Q 200 774 274 760" stroke={out.topShade} strokeWidth={6} fill="none" strokeDasharray="12 8" />
          </g>
        ) : null}
        {t === "yerli" && !male ? (
          <g>
            {/* diz çökünce etek öne çıkan sağ dizin üstüne dökülür; sağ kenarı kalkar, baldır ve ayak görünür */}
            <path d={`M 132 590 L 112 800 Q 170 812 ${210 + 6 * dizK} ${800 - 26 * dizK} Q ${250 + 4 * dizK} ${800 - 96 * dizK} ${288 + 12 * dizK} ${800 - 120 * dizK} L 268 590 Z`} fill={out.bottom} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
            {dizK > 0.05 ? <path d={`M 214 ${612} Q ${246 + 10 * dizK} ${610 + 20 * dizK} ${272 + 12 * dizK} ${640 + 10 * dizK}`} stroke="#00000035" strokeWidth={5} fill="none" opacity={dizK} /> : null}
            {new Array(12).fill(0).map((_, i) => { const x = 118 + i * 15; const yk = x < 200 ? 800 + (x - 118) * 0.05 : 800 - dizK * Math.min(120, (x - 200) * 1.3); return <path key={i} d={`M ${x} ${yk} l -2 26`} stroke={out.bottom} strokeWidth={6} strokeLinecap="round" />; })}
            <path d="M 150 660 Q 200 676 250 660" stroke="#00000030" strokeWidth={4} fill="none" />
          </g>
        ) : null}
        {t === "hostes" ? (
          <g>
            <path d="M 136 590 L 140 790 Q 200 800 260 790 L 264 590 Z" fill={out.bottom} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
            <path d="M 200 700 L 200 796" stroke={OUT} strokeWidth={3} opacity={0.6} />
          </g>
        ) : null}
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
        {t === "yerli" ? (
          <g>
            {/* dokuma deseni */}
            {[380, 430, 480, 530, 580].map((y) => <path key={y} d={`M 128 ${y} L 272 ${y}`} stroke={out.topShade} strokeWidth={4} strokeDasharray="10 8" opacity={0.8} />)}
            <path d="M 176 330 Q 200 372 224 330" fill="none" stroke={OUT} strokeWidth={SW} />
            {out.accent ? <path d="M 150 332 Q 200 360 272 470 L 270 520 Q 210 410 136 350 Z" fill={out.accent} stroke={OUT} strokeWidth={3} strokeLinejoin="round" /> : null}
            {out.accent ? <path d="M 160 346 Q 210 380 266 476" stroke="#f2e6cf" strokeWidth={4} fill="none" strokeDasharray="10 8" opacity={0.7} /> : null}
            {/* ip kemer */}
            <path d="M 132 590 Q 200 606 268 590" stroke="#a57a44" strokeWidth={9} fill="none" />
            <path d="M 238 598 l 6 40 M 248 596 l 10 36" stroke="#a57a44" strokeWidth={5} />
          </g>
        ) : null}
        {t === "hostes" ? (
          <g>
            {/* beyaz bluz V yaka */}
            <path d="M 170 330 L 200 440 L 230 330 Z" fill="#f7f6f2" stroke={OUT} strokeWidth={3} />
            {/* ceket yakaları */}
            <path d="M 158 334 L 200 470 L 184 360 Z M 242 334 L 200 470 L 216 360 Z" fill={out.topShade} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
            {/* boyun fuları: yanda düğüm, iki uç */}
            <path d="M 172 334 Q 200 352 228 334 L 226 348 Q 200 366 174 348 Z" fill={out.accent ?? "#c9312f"} stroke={OUT} strokeWidth={3} />
            <path d="M 226 340 L 254 372 L 238 384 L 220 350 Z M 230 344 L 246 398 L 230 402 L 222 352 Z" fill={out.accent ?? "#c9312f"} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
            <circle cx={226} cy={344} r={8} fill={out.accent ?? "#c9312f"} stroke={OUT} strokeWidth={3} />
            <path d="M 180 342 Q 200 352 220 342" stroke="#f2e3b0" strokeWidth={3} fill="none" />
            {/* altın kanat rozeti */}
            <path d="M 140 410 q 12 -10 24 -2 q 12 -8 24 2 q -12 6 -24 4 q -12 2 -24 -4 Z" fill="#d9b45a" stroke={OUT} strokeWidth={2} />
            <circle cx={164} cy={410} r={4} fill="#f6e6a6" stroke={OUT} strokeWidth={1.5} />
            {/* isim kartı */}
            <rect x={222} y={420} width={36} height={14} rx={3} fill="#f2f2ee" stroke={OUT} strokeWidth={2} />
            {/* düğmeler + bel */}
            <circle cx={206} cy={500} r={5} fill="#d9b45a" stroke={OUT} strokeWidth={2} />
            <circle cx={206} cy={555} r={5} fill="#d9b45a" stroke={OUT} strokeWidth={2} />
            <path d="M 236 470 L 262 468" stroke={OUT} strokeWidth={3} />
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
  const squeezeL = 1 - Math.max(0, -yaw) * 0.3 - Math.max(0, -strong) * 0.5;
  const squeezeR = 1 - Math.max(0, yaw) * 0.3 - Math.max(0, strong) * 0.5;
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
        <path d={look.facialHair === "beard" ? `M 128 236 Q 132 300 200 314 Q 268 300 272 236 Q 250 262 200 268 Q 150 262 128 236 Z` : `M 128 236 Q 132 300 200 314 Q 268 300 272 236 Q 250 276 200 282 Q 150 276 128 236 Z`} fill={look.facialHair === "beard" ? look.hair.color : "#5a4a44"} opacity={look.facialHair === "beard" ? 1 : 0.22} stroke={look.facialHair === "beard" ? OUT : "none"} strokeWidth={3} />
      ) : null}
      <g opacity={blushAmt}>
        <ellipse cx={148 + dx} cy={238} rx={19} ry={10} fill="#ef8f8a" />
        <ellipse cx={252 + dx} cy={238} rx={19} ry={10} fill="#ef8f8a" />
      </g>
      <Eye cx={160 + dx} cy={198} look={look} lookX={lookX} lookY={lookY} open={eyeOpenBase} smile={face.eyeSmile} pupil={look.korkunc ? 0.38 : face.pupil} squeeze={squeezeL} uid={`${uid}l`} />
      <Eye cx={240 + dx} cy={198} look={look} lookX={lookX} lookY={lookY} open={eyeOpenBase} smile={face.eyeSmile} pupil={look.korkunc ? 0.38 : face.pupil} squeeze={squeezeR} flip uid={`${uid}r`} />
      <Brow cx={160 + dx} cy={160} inner={face.browInner} outer={face.browOuter} lift={face.browLift} color={browColor} thick={male ? 8 : 6.5} squeeze={squeezeL} />
      <Brow cx={240 + dx} cy={160} inner={face.browInner} outer={face.browOuter} lift={face.browLift} color={browColor} thick={male ? 8 : 6.5} squeeze={squeezeR} flip />
      <path d={`M ${202 + dx * 1.3} 214 Q ${196 + dx * 1.5 - Math.abs(yaw) * 6 * Math.sign(yaw || 1)} 236 ${204 + dx * 1.3} 244`} fill="none" stroke={OUT} strokeWidth={3.5} strokeLinecap="round" />
      {look.mole ? <circle cx={236 + dx} cy={262} r={3} fill="#5a3a2a" /> : null}
      {pose.yaprak ? (
        <g transform={`rotate(-8 ${200 + dx} 140)`}>
          <path d={`M ${120 + dx} 150 Q ${200 + dx} 96 ${290 + dx} 140 Q ${206 + dx} 176 ${120 + dx} 150 Z`} fill="#5f8a3a" stroke="#2e4a1e" strokeWidth={3} />
          <path d={`M ${126 + dx} 150 Q ${206 + dx} 136 ${286 + dx} 141`} stroke="#9cc46a" strokeWidth={3} fill="none" />
          {[150, 180, 210, 240, 265].map((x2) => <path key={x2} d={`M ${x2 + dx} ${148 - (x2 - 150) * 0.06} l 10 -16 M ${x2 + dx} ${148 - (x2 - 150) * 0.06} l 12 12`} stroke="#9cc46a" strokeWidth={2} />)}
          <circle cx={230 + dx} cy={136} r={3.5} fill="#e8f6ff" opacity={0.9} />
        </g>
      ) : null}
      {look.sivilce ? (
        <g>
          <ellipse cx={252 + dx} cy={240} rx={17} ry={14} fill="#e8706a" opacity={0.45} />
          <circle cx={252 + dx} cy={240} r={9} fill="#d8524a" stroke="#9a2e28" strokeWidth={1.5} />
          <circle cx={251 + dx} cy={238} r={4} fill="#fbf2d8" />
          <circle cx={249 + dx} cy={236} r={1.6} fill="#ffffff" />
          {pose.krem ? <path d={`M ${236 + dx} 236 Q ${246 + dx} 224 ${264 + dx} 232 Q ${272 + dx} 246 ${256 + dx} 252 Q ${238 + dx} 252 ${236 + dx} 236 Z`} fill="#f8f6f0" opacity={0.92} stroke="#d8d4c8" strokeWidth={1.5} /> : null}
        </g>
      ) : null}
      {look.facialHair === "mustache" || look.facialHair === "beard" ? (
        <path d={`M ${160 + dx} 274 Q ${200 + dx} 246 ${240 + dx} 274 Q ${224 + dx} 268 ${200 + dx} 264 Q ${176 + dx} 268 ${160 + dx} 274 Z`} fill={look.hair.color} stroke={OUT} strokeWidth={3} />
      ) : null}
      {look.facialHair === "goatee" ? <path d={`M ${186 + dx} 292 Q ${200 + dx} 312 ${214 + dx} 292 L ${210 + dx} 302 Q ${200 + dx} 306 ${190 + dx} 302 Z`} fill={look.hair.color} stroke={OUT} strokeWidth={3} /> : null}
      {look.korkunc ? (
        <g>
          {/* çökük göz çukurları (gözlerin üstüne binen gölge halkası) */}
          {[160, 240].map((x) => <ellipse key={x} cx={x + dx} cy={204} rx={36} ry={28} fill="#1e1018" opacity={0.3} />)}
          {[160, 240].map((x) => <path key={`k${x}`} d={`M ${x - 30 + dx} 228 Q ${x + dx} 246 ${x + 30 + dx} 228`} stroke="#3a1e2a" strokeWidth={6} fill="none" opacity={0.6} />)}
          {/* kanlı göz damarları */}
          {[160, 240].map((x) => <path key={`d${x}`} d={`M ${x - 22 + dx} 196 l 8 2 l 4 -3 M ${x + 22 + dx} 200 l -9 -1 l -3 4 M ${x - 18 + dx} 206 l 7 -1`} stroke="#c0282a" strokeWidth={1.6} fill="none" opacity={0.85} />)}
          {/* yüzü çapraz kesen dikişli yara */}
          <path d={`M ${126 + dx} 140 Q ${158 + dx} 210 ${196 + dx} 300`} stroke="#6a2a2a" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d={`M ${126 + dx} 140 Q ${158 + dx} 210 ${196 + dx} 300`} stroke="#b86a6a" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          {[0.15, 0.32, 0.5, 0.68, 0.85].map((q, i) => {
            const x = 126 + (196 - 126) * q + dx, y = 140 + (300 - 140) * q;
            return <path key={i} d={`M ${x - 9} ${y - 3} L ${x + 9} ${y + 3}`} stroke="#2a1414" strokeWidth={2.5} />;
          })}
          {/* yanak çukurları */}
          <path d={`M ${128 + dx} 236 Q ${138 + dx} 262 ${150 + dx} 270 M ${272 + dx} 236 Q ${262 + dx} 262 ${250 + dx} 270`} stroke="#4a3a3a" strokeWidth={4} fill="none" opacity={0.45} />
        </g>
      ) : null}
      <Mouth viseme={vis} rest={face.mouth} cx={200 + dx * 1.1} cy={274} amp={amp} scream={emo === "dehset"} />
      {look.korkunc && (face.mouth === "smirk" || face.mouth === "smile" || face.mouth === "grin") && !vis ? (
        <g>
          {/* gülümsemede sivri, sararmış dişler ve çatlak dudak */}
          <path d={`M ${176 + dx} 278 Q ${200 + dx} 292 ${226 + dx} 276 L ${222 + dx} 286 Q ${200 + dx} 300 ${180 + dx} 288 Z`} fill="#2a0c0c" stroke={OUT} strokeWidth={2.5} />
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${182 + i * 7 + dx} ${280 + Math.abs(i - 2.5) * 0.8} l 3.5 8 l 3.5 -8 Z`} fill="#d8cc9a" stroke="#6a5a3a" strokeWidth={1} />)}
          <path d={`M ${196 + dx} 274 l 2 6 l -2 4`} stroke="#8a2a2a" strokeWidth={1.5} fill="none" />
        </g>
      ) : null}
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
      <HairFront look={look} dx={yaw * 10 + strong * 30} />
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

  const dizK = pose.body === "sit" || pose.body === "walk" ? 0 : Math.max(0, Math.min(1, pose.diz ?? 0));
  const groundShift = 680 * (1 - age.sy) + 185 * dizK;
  const bodyT = `translate(200 300) scale(${age.sx} ${age.sy}) translate(-200 -300)${running ? ` rotate(${2.4 * runU} 200 600)` : ""}`;
  const torsoScale = `translate(200 470) scale(${wx} ${1 + breathe}) translate(-200 -470)`;
  const runTilt = running ? 3.2 * Math.sin(runPh - 0.6) : 0;
  const headT = `translate(0 ${-breathe * 300 + sobbing + (running ? 5 * Math.abs(Math.cos(runPh - 0.5)) : 0)}) rotate(${(pose.tilt ?? 0) + sway * 0.6 + runTilt} 200 300) translate(200 300) scale(${age.head}) translate(-200 -300)`;

  return (
    <svg
      viewBox="0 0 400 1000"
      width={size * 0.4}
      height={size}
      style={{ overflow: "visible", scale: flip ? "-1 1" : undefined, ...style }}
    >
      <g transform={`translate(0 ${groundShift + bob})`}>
        {pose.hideLegs || pose.golgesiz ? null : <ellipse cx={200} cy={(pose.body === "sit" ? 910 : 985) - groundShift} rx={130 * wx} ry={16} fill="#000" opacity={0.2} transform={`translate(0 ${-bob})`} />}
        {/* back hair (follows the head) */}
        <g transform={bodyT}>
          <g transform={headT}>
            <HairBack look={look} dx={yaw * 10} sway={sway * 2 + (running ? 26 * Math.sin(runPh - 1.1) : 0)} />
          </g>
        </g>
        <g transform={bodyT}>
          {pose.hideLegs ? null : <Legs />}
          <g transform={torsoScale}>
            <Torso />
            {look.isimlik ? (
              <g>
                <rect x={210} y={396} width={66} height={20} rx={3} fill="#e8e6dc" stroke={OUT} strokeWidth={2.5} />
                <text x={243} y={411} textAnchor="middle" fontFamily="'Courier New', monospace" fontSize={10.5} fontWeight={700} fill="#111">{look.isimlik}</text>
              </g>
            ) : null}
            {look.yirtik ? (
              <g>
                <path d="M 150 420 L 158 408 L 166 414 L 172 400 L 176 418 L 188 412 L 184 440 L 192 452 L 180 466 L 164 470 L 156 452 Z" fill={look.skinShade} stroke={OUT} strokeWidth={2.5} strokeLinejoin="round" />
                <path d="M 160 430 Q 170 440 168 458" stroke={skin} strokeWidth={8} fill="none" opacity={0.8} />
                <path d="M 158 408 l -6 -8 M 176 418 l 4 -10 M 188 412 l 8 -4 M 156 452 l -8 4" stroke="#f4f0e6" strokeWidth={2} />
                <path d="M 226 500 L 236 494 L 244 500 L 252 488 L 258 506 L 262 522 L 250 520 L 246 540 L 236 546 L 228 528 Z" fill={look.skinShade} stroke={OUT} strokeWidth={2.5} strokeLinejoin="round" />
                <path d="M 236 494 l -4 -8 M 252 488 l 6 -6 M 246 540 l 4 8" stroke="#f4f0e6" strokeWidth={2} />
                <path d="M 140 560 Q 170 540 200 566 Q 230 590 262 570" stroke="#7a6a58" strokeWidth={14} fill="none" opacity={0.35} />
                <ellipse cx={238} cy={420} rx={20} ry={12} fill="#7a1c1c" opacity={0.55} />
                <ellipse cx={176} cy={520} rx={14} ry={22} fill="#6a5440" opacity={0.3} />
                {look.sargi ? <path d="M 136 450 Q 200 430 266 470 L 262 500 Q 200 462 138 482 Z" fill="#5f8a3a" stroke={OUT} strokeWidth={3} /> : null}
                {look.sargi ? <path d="M 150 462 Q 200 448 254 478" stroke="#c9a640" strokeWidth={3} fill="none" opacity={0.8} /> : null}
              </g>
            ) : null}
          </g>
          {/* neck */}
          <path d="M 180 290 L 180 336 Q 200 346 220 336 L 220 290 Z" fill={look.hair.style === "hijab" ? look.hair.color : skin} stroke={OUT} strokeWidth={SW} />
          <path d="M 182 318 Q 200 330 218 318" fill="none" stroke={look.skinShade} strokeWidth={6} opacity={look.hair.style === "hijab" ? 0 : 1} />
          {look.kolye ? (
            <g>
              <path d="M 168 334 Q 200 378 232 334" stroke="#6a4a2a" strokeWidth={3} fill="none" />
              {[0.15, 0.35, 0.5, 0.65, 0.85].map((k, i) => <ellipse key={i} cx={168 + k * 64} cy={334 + Math.sin(Math.PI * k) * 40} rx={7} ry={9} fill={look.kolye} stroke={OUT} strokeWidth={2} />)}
            </g>
          ) : null}
        </g>
        <g transform={bodyT}>
          <g transform={headT}>
            <Head />
            {look.kan ? (
              <g opacity={Math.min(1, look.kan)}>
                {/* alında yarık + kaş üstünde pıhtı */}
                <path d="M 154 128 Q 172 118 190 124 Q 176 134 156 138 Z" fill="#7a1010" stroke="#4a0808" strokeWidth={2} />
                <path d="M 150 134 Q 140 150 146 170 Q 152 178 156 166 Q 154 150 162 138 Z" fill="#9a1616" opacity={0.85} />
                <ellipse cx={170} cy={132} rx={26} ry={12} fill="#a01818" opacity={0.35} />
                {/* burundan ince sızıntı */}
                <path d="M 206 236 Q 210 248 206 258" stroke="#9a1616" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
                {/* toz ve sıyrıklar */}
                <path d="M 244 196 l 16 -6 M 246 206 l 14 -4" stroke="#9a3a2a" strokeWidth={3} opacity={0.6} />
                <ellipse cx={248} cy={176} rx={16} ry={10} fill="#7a5a4a" opacity={0.3} />
                <ellipse cx={142} cy={236} rx={12} ry={7} fill="#7a5a4a" opacity={0.28} />
              </g>
            ) : null}
            {look.sargi ? (
              <g>
                <path d="M 114 128 Q 200 96 286 128 L 286 156 Q 200 126 114 156 Z" fill="#5f8a3a" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
                {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${130 + i * 42} ${140 - (i === 1 || i === 2 ? 10 : 2)} q 20 -8 38 2`} stroke="#3e6428" strokeWidth={3} fill="none" />)}
                <path d="M 140 132 Q 200 110 262 132" stroke="#d9b850" strokeWidth={3} fill="none" opacity={0.7} />
              </g>
            ) : null}
          </g>
        </g>
        {onl !== undefined ? (
          <g transform={bodyT}>
            <g transform={torsoScale}>
              {(() => {
                const OR = "#e8701a", ORK = "#b8520e";
                const onlukSekil = (
                  <g>
                    <path d="M 166 396 L 234 396 L 238 470 L 268 486 L 262 722 Q 200 732 138 722 L 132 486 L 162 470 Z" fill={OR} stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
                    <path d="M 170 402 L 230 402" stroke={ORK} strokeWidth={3} />
                    <rect x={170} y={560} width={60} height={46} rx={6} fill="none" stroke={ORK} strokeWidth={3} />
                    <text x={200} y={650} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={800} fontSize={16} fill="#fff4e6">CAN MARKET</text>
                  </g>
                );
                if (onl < 0.26) {
                  // elde katlı önlük (göğüs hizasında, iki elin arasında)
                  return (
                    <g>
                      <rect x={158} y={470} width={84} height={58} rx={6} fill={OR} stroke={OUT} strokeWidth={3.5} />
                      <path d="M 160 492 L 240 492 M 160 510 L 240 510" stroke={ORK} strokeWidth={3} />
                      <path d="M 186 470 q 14 -18 28 0" stroke="#3a2a1a" strokeWidth={3} fill="none" />
                    </g>
                  );
                }
                const ust = onl < 0.44 ? 470 + (78 - 470) * ((onl - 0.26) / 0.18) : onl < 0.56 ? 78 : onl < 0.72 ? 78 + (396 - 78) * (((onl - 0.56) / 0.16) ** 1.4) : 396;
                const giyili = onl >= 0.72;
                return (
                  <g>
                    {giyili ? <path d="M 170 398 L 184 334 M 230 398 L 216 334" stroke={OR} strokeWidth={8} strokeLinecap="round" /> : <path d={`M 168 ${ust + 2} Q 200 ${ust - 70} 232 ${ust + 2}`} stroke={OR} strokeWidth={8} fill="none" />}
                    <g transform={`translate(0 ${ust - 396})`}>{onlukSekil}</g>
                    {giyili ? (
                      <g opacity={Math.min(1, (onl - 0.72) / 0.1)}>
                        <path d={`M 134 488 Q 112 ${496 + 10 * (1 - onl)} 104 ${520}`} stroke={OR} strokeWidth={7} fill="none" strokeLinecap="round" />
                        <path d={`M 266 488 Q 288 ${496 + 10 * (1 - onl)} 296 ${520}`} stroke={OR} strokeWidth={7} fill="none" strokeLinecap="round" />
                        {onl >= 0.98 ? <g><rect x={214} y={420} width={36} height={16} rx={3} fill="#f4f4f0" stroke={OUT} strokeWidth={2} /><text x={232} y={432} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={800} fontSize={10} fill="#222">ECE</text></g> : null}
                      </g>
                    ) : null}
                  </g>
                );
              })()}
            </g>
          </g>
        ) : null}
        <g transform={bodyT}>
          <Arm side="l" a={armL} />
          <Arm side="r" a={armR} />
        </g>
      </g>
    </svg>
  );
};
