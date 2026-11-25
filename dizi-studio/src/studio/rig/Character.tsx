import React, { useId } from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Brow, EMOTION_FACE, Eye, Mouth, OUT } from "./face";
import { GESTURES, type FullArm } from "./gestures";
import { HairBack, HairFront } from "./hair";
import type { Look, MouthCue, Pose, Prop, Viseme } from "./types";
import { BilekEk, Gobek, TelefonYatay, YuzEk, KulaklikKablo, SacEk, PijamaBacak, Kask, KarMaske, KulakEk, MakyajAlt, MakyajUst, OnBoyun, SirtCanta, SlimeProp, TorsoDugme } from "./dugme";

const SW = 4;
const AHIZE_DX = 34, AHIZE_ROT = 22; // ahize yüzün yanında: üst uç kulakta, alt uç ağız köşesinin dışında

export const AGE = {
  child: { sx: 0.8, sy: 0.6, head: 0.94 },
  teen: { sx: 0.9, sy: 0.86, head: 0.97 },
  adult: { sx: 1, sy: 1, head: 1 },
  old: { sx: 1, sy: 0.97, head: 1 },
} as const;
const BUILD = { slim: 0.9, normal: 1, heavy: 1.24 } as const;

const SHORT_SLEEVES = new Set(["tshirt", "dress", "police", "yerli", "atlet"]);
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
    case "onluk_top":
      // buruşturulmuş turuncu önlük: kumaş top, kıvrımlar, sarkan askı
      return (
        <g>
          <path d={`M ${x - 40} ${y - 6} Q ${x - 46} ${y - 44} ${x - 14} ${y - 52} Q ${x + 18} ${y - 64} ${x + 40} ${y - 36} Q ${x + 52} ${y - 4} ${x + 30} ${y + 22} Q ${x} ${y + 36} ${x - 28} ${y + 22} Z`} fill="#e8701a" stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
          <path d={`M ${x - 26} ${y - 30} q 14 10 30 -4 M ${x - 8} ${y + 6} q 16 -14 32 -2 M ${x + 6} ${y - 44} q -2 16 10 24`} stroke="#b8520e" strokeWidth={3} fill="none" />
          <path d={`M ${x + 30} ${y + 18} q 18 26 6 52`} stroke="#e8701a" strokeWidth={7} fill="none" strokeLinecap="round" />
        </g>
      );
    case "ambalaj":
      // boş çikolata ambalajı (B2'deki kızın çikolatası): mor, sarı bant, yırtık uç, gümüş folyo; parmaklar arasında
      return (
        <g transform={`rotate(-18 ${x} ${y})`}>
          <path d={`M ${x - 22} ${y - 96} L ${x + 22} ${y - 92} L ${x + 20} ${y + 6} L ${x - 20} ${y + 4} Z`} fill="#5a2a8a" stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
          <rect x={x - 21} y={y - 56} width={42} height={24} fill="#f2c21a" transform={`rotate(2 ${x} ${y - 44})`} />
          <path d={`M ${x - 22} ${y - 96} l 6 -10 l 7 8 l 8 -12 l 7 10 l 6 -6 L ${x + 22} ${y - 92}`} fill="#c8ccd4" stroke={OUT} strokeWidth={2.5} strokeLinejoin="round" />
          <path d={`M ${x - 14} ${y - 80} q 10 6 24 -2 M ${x - 12} ${y - 20} q 12 -6 22 4`} stroke="#3a1a5a" strokeWidth={2.5} fill="none" />
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
    case "slime":
      return <SlimeProp x={x} y={y} />;
    case "tesbih":
      // tesbih: elden sarkan halka; taneler minik kırmızı mantar düğme biçiminde (ipucu), püskül
      return (
        <g>
          <path d={`M ${x - 8} ${y + 6} Q ${x - 30} ${y + 90} ${x} ${y + 120} Q ${x + 30} ${y + 90} ${x + 8} ${y + 6}`} stroke="#3a2a20" strokeWidth={1.5} fill="none" />
          {new Array(13).fill(0).map((_, i) => {
            const u = i / 12;
            const px = i < 7 ? x - 8 - 22 * Math.sin(u * Math.PI * 1.08) : x + 8 + 22 * Math.sin((1 - u) * Math.PI * 1.08);
            const py = y + 10 + 108 * Math.sin(Math.min(1, (i < 7 ? u : 1 - u) * 1.85) * Math.PI / 2);
            return <g key={i}><ellipse cx={px} cy={py + 2} rx={6.5} ry={3.5} fill="#f2f2ee" stroke={OUT} strokeWidth={1.2} /><ellipse cx={px} cy={py - 1} rx={5} ry={4} fill="#e2202e" stroke={OUT} strokeWidth={1.2} /></g>;
          })}
          <path d={`M ${x} ${y + 120} l 0 14 M ${x - 4} ${y + 134} l -2 22 M ${x} ${y + 134} l 0 24 M ${x + 4} ${y + 134} l 2 22`} stroke="#c9a24a" strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    case "kolonya":
      // kolonya şişesi (etiketsiz, limon sarısı), kırmızı kapak
      return (
        <g>
          <path d={`M ${x - 16} ${y - 4} L ${x - 16} ${y - 62} Q ${x - 16} ${y - 74} ${x - 6} ${y - 78} L ${x - 6} ${y - 90} L ${x + 6} ${y - 90} L ${x + 6} ${y - 78} Q ${x + 16} ${y - 74} ${x + 16} ${y - 62} L ${x + 16} ${y - 4} Z`} fill="#fff6b0" fillOpacity={0.85} stroke={OUT} strokeWidth={3} />
          <rect x={x - 8} y={y - 104} width={16} height={16} rx={4} fill="#e2202e" stroke={OUT} strokeWidth={2.5} />
          <path d={`M ${x - 10} ${y - 50} H ${x + 10}`} stroke="#e8d070" strokeWidth={6} />
        </g>
      );
    case "telefon_arka":
      // Kırmızı Düğme: dikey tutulan telefon, ARKASI kameraya dönük (ekran görünmez); kenarlardan ekran ışığı taşar
      return (
        <g>
          <defs><radialGradient id="tfArkaHale"><stop offset="0" stopColor="#cfe6ff" stopOpacity={0.45} /><stop offset="1" stopColor="#cfe6ff" stopOpacity={0} /></radialGradient></defs>
          <ellipse cx={x} cy={y - 50} rx={70} ry={80} fill="url(#tfArkaHale)" />
          <rect x={x - 22} y={y - 92} width={44} height={86} rx={9} fill="#3a3f48" stroke={OUT} strokeWidth={3.5} />
          <rect x={x - 17} y={y - 86} width={18} height={24} rx={6} fill="#22262c" stroke={OUT} strokeWidth={2} />
          <circle cx={x - 8} cy={y - 80} r={3.4} fill="#0e1014" stroke="#6a7080" strokeWidth={1} />
          <circle cx={x - 8} cy={y - 68} r={3.4} fill="#0e1014" stroke="#6a7080" strokeWidth={1} />
          <path d={`M ${x + 22} ${y - 86} V ${y - 12}`} stroke="#cfe6ff" strokeWidth={2.5} opacity={0.8} />
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

/** 7/24 B5 p2 (opt-in): iki el ağzın üstünde (sağ el altta, sol el üstte; parmaklar yukarı-içe), bilekte kazak manşeti.
 *  Baş grubunun içinde çizilir: nefes ve baş salınımıyla birlikte hareket eder. k: 0..1 (eller aşağıdan gelir) */
const AgizKapaEller: React.FC<{ look: Look; k: number; dx: number; titre: number; tek?: "sag" | "sol" }> = ({ look, k, dx, titre, tek }) => {
  const kk = Math.max(0, Math.min(1, k));
  const e = kk * kk * (3 - 2 * kk);
  const yOff = (1 - e) * 60;
  const sleeve = sleeveColor(look);
  const hand = (side: 1 | -1, x: number, y: number, rot: number) => (
    <g transform={`translate(${x} ${y + yOff}) rotate(${rot + titre * 1.6 * side}) scale(0.92)`}>
      {/* bilek + manşet (önkol kadraj altından gelir) */}
      <path d="M -22 26 L -26 96 L 26 96 L 22 26 Z" fill={look.skin} stroke={OUT} strokeWidth={3.5} />
      <path d="M -30 58 Q 0 66 30 58 L 34 120 L -34 120 Z" fill={sleeve} stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M -28 66 Q 0 74 28 66" stroke="#000" strokeOpacity={0.18} strokeWidth={4} fill="none" />
      {/* avuç + dört parmak (uçlar yuvarlak) */}
      <path d="M -31 32 L -32 -4 Q -33 -40 -24 -44 Q -16 -47 -12 -36 Q -9 -52 0 -52 Q 9 -52 11 -40 Q 16 -50 23 -46 Q 31 -41 32 -22 L 31 32 Q 0 42 -31 32 Z" fill={look.skin} stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M -12 -34 L -12 -6 M 11 -38 L 10 -8 M -1 -48 L -1 -10" stroke={OUT} strokeWidth={2.4} strokeOpacity={0.55} fill="none" strokeLinecap="round" />
      <path d="M -26 10 Q 0 18 26 8" stroke={look.skinShade} strokeWidth={5} fill="none" opacity={0.6} />
      {/* başparmak (iç yanda) */}
      <path d={`M ${30 * side} 14 Q ${46 * side} 0 ${40 * side} -18 Q ${34 * side} -26 ${28 * side} -14 Z`} fill={look.skin} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
    </g>
  );
  return (
    <g opacity={kk < 0.5 ? 0 : 1}>
      {tek === "sag" ? hand(-1, 212 + dx * 1.05, 290, -18) : tek === "sol" ? hand(1, 188 + dx * 1.05, 286, 18) : (
        <>
          {hand(1, 172 + dx * 1.05, 282, 30)}
          {hand(-1, 228 + dx * 1.05, 292, -30)}
        </>
      )}
    </g>
  );
};

/** 7/24 B6 (opt-in): ağlama ağzı. o = açıklık 0..1. Köşeler aşağı çekik, üst dudak gergin, alt dudak titrer;
 *  açıkken üst dişler ve dil görünür; çenede ağlama buruşukluğu. */
const AglaAgiz: React.FC<{ o: number; cx: number; cy: number; frame: number; titre: number }> = ({ o, cx, cy, frame, titre }) => {
  const tr = Math.sin(frame * 2.6) * 1.8 * titre + Math.sin(frame * 4.1) * 0.9 * titre;
  const w = 17 + 6 * o;
  const kY = cy + 8 + 3 * o; // köşeler
  const ust = cy - 3 - 2 * o;
  const alt = cy + 10 + 30 * o + tr;
  const lip = "#c4605f";
  if (o < 0.1) {
    // kapalı, titreyen, aşağı kıvrık ağız (ağlamayı tutmaya çalışır)
    return (
      <g>
        <path d={`M ${cx - w} ${kY} Q ${cx - w * 0.45} ${cy - 3 + tr * 0.5} ${cx} ${cy + 1} Q ${cx + w * 0.45} ${cy - 3 - tr * 0.5} ${cx + w} ${kY}`} fill="none" stroke={OUT} strokeWidth={4.5} strokeLinecap="round" />
        <path d={`M ${cx - 8} ${cy + 26} Q ${cx} ${cy + 30} ${cx + 8} ${cy + 26}`} fill="none" stroke={OUT} strokeWidth={2.2} opacity={0.35} strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g>
      <path d={`M ${cx - w} ${kY} Q ${cx - w * 0.55} ${ust - 2} ${cx} ${ust} Q ${cx + w * 0.55} ${ust - 2} ${cx + w} ${kY} Q ${cx + w * 0.8} ${alt - 2} ${cx} ${alt} Q ${cx - w * 0.8} ${alt - 2} ${cx - w} ${kY} Z`} fill="#5e2324" stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      {o > 0.22 ? <path d={`M ${cx - w * 0.72} ${kY - 4} Q ${cx} ${ust - 1} ${cx + w * 0.72} ${kY - 4} L ${cx + w * 0.62} ${kY - 1} Q ${cx} ${ust + 6} ${cx - w * 0.62} ${kY - 1} Z`} fill="#fffaf2" /> : null}
      {o > 0.35 ? <path d={`M ${cx - w * 0.5} ${alt - 2} Q ${cx} ${alt - 12 * o} ${cx + w * 0.5} ${alt - 2} Z`} fill="#d9777a" /> : null}
      <path d={`M ${cx - w * 0.7} ${alt + 2} Q ${cx} ${alt + 7} ${cx + w * 0.7} ${alt + 2}`} fill="none" stroke={lip} strokeWidth={3.2} strokeLinecap="round" opacity={0.75} />
      {/* çenede ağlama buruşukluğu ve ağız köşesinden inen çizgiler */}
      <path d={`M ${cx - 9} ${alt + 14} Q ${cx} ${alt + 19} ${cx + 9} ${alt + 14}`} fill="none" stroke={OUT} strokeWidth={2.2} opacity={0.3} strokeLinecap="round" />
      <path d={`M ${cx - w - 2} ${kY + 2} q -4 8 -2 16 M ${cx + w + 2} ${kY + 2} q 4 8 2 16`} fill="none" stroke={OUT} strokeWidth={2.2} opacity={0.28} strokeLinecap="round" />
    </g>
  );
};

/** 7/24 B6 (opt-in): hıçkırık ritmi. Döngü ~1,75 sn: 2-3 hızlı içe çekiş (spaz), sonra uzun titrek veriş (ver).
 *  Dışarıdan da çağrılır (sarılmada omuz noktası rig'le birlikte oynasın diye). */
export const hickirDurum = (frame: number, fps: number, seed: number, k: number, faz = 0): { spaz: number; ver: number; omzY: number } => {
  if (k <= 0) return { spaz: 0, ver: 0, omzY: 0 };
  const P = 1.75;
  const tt = frame / fps + faz + seed * 0.37;
  const c = Math.floor(tt / P);
  const u = tt - c * P;
  const n = random(`hc${seed}-${c}`) < 0.45 ? 2 : 3;
  let spaz = 0;
  for (let i = 0; i < n; i++) {
    const d = u - i * 0.17;
    if (d >= 0) spaz = Math.max(spaz, Math.exp(-d * 15) * Math.min(1, d / 0.035));
  }
  const v0 = n * 0.17 + 0.06;
  const ver = (u > v0 ? Math.sin(Math.min(1, (u - v0) / (P - v0)) ** 0.7 * Math.PI) : 0) * k;
  spaz *= k;
  return { spaz, ver, omzY: 15 * spaz + 2.6 * ver * Math.sin(frame * 2.3) };
};

export const Character: React.FC<CharacterProps> = ({ look, pose = {}, size = 1000, style, flip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const seed = pose.seed ?? look.name.length * 7;
  const emo = pose.emotion ?? "notr";
  // 7/24 B5: nefes çekme (hıığğ): hızlı içe çekiş, kısa tutma, yarım bırakma
  const hikK = pose.hik !== undefined && pose.hik > 0 ? Math.min(1, pose.hik / 0.28) ** 0.6 * (1 - 0.45 * Math.max(0, Math.min(1, (pose.hik - 0.75) / 0.25))) : 0;
  const face00 = EMOTION_FACE[emo];
  // 7/24 B6 (opt-in): hıçkırarak ağlama. Döngü ~1,75 sn: 2-3 hızlı içe çekiş (spazm), sonra uzun, titrek veriş.
  const hcK = Math.max(0, Math.min(1, pose.hickir ?? 0));
  const { spaz: hcSpaz, ver: hcVer } = hickirDurum(frame, fps, seed, hcK, pose.hickirFaz ?? 0);
  const face0 = hcK > 0 ? { ...face00, browInner: face00.browInner + 7 * hcK + 4 * hcSpaz, browOuter: face00.browOuter - 3 * hcK, browLift: face00.browLift - 2 * hcSpaz } : face00;
  const face = hikK > 0 ? { ...face0, eyeOpen: face0.eyeOpen + 0.28 * hikK, browLift: face0.browLift - 8 * hikK, browInner: face0.browInner + 4 * hikK } : face0;
  const blink0 = useBlink(seed);
  const blink = pose.kirpmaz ? 0 : blink0;
  const age = AGE[look.age];
  const kilo = Math.max(0, Math.min(1, look.kilo ?? 0));
  const wx = BUILD[look.build] * (1 + 0.14 * kilo) * (look.omuzEn ?? 1);
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
  const runPh = running ? pose.kosPh ?? ((frame + (pose.kosFaz ?? 0)) * 2 * Math.PI) / (0.6 * fps) : 0;
  const runU = Math.sin(runPh);
  const bob = walking ? Math.abs(Math.cos(frame / 5)) * -8 : running ? -18 * Math.abs(Math.cos(runPh)) + 6 : 0;

  // --- face state ---
  const yaw = pose.yaw ?? 0;
  // güçlü dönüş (|yaw| > 0.6): yüz hatları belirgin biçimde yana kayar (omuz üstünden bakış)
  const strong = Math.sign(yaw) * Math.max(0, Math.abs(yaw) - 0.6);
  const dx = yaw * 24 + strong * 70;
  const lookX = pose.lookX ?? yaw * 0.6;
  const tk = Math.max(0, Math.min(1, pose.taklit ?? 0));
  const lookY = (pose.lookY ?? 0) + 0.3 * (pose.yutkun !== undefined && pose.yutkun > 0 && pose.yutkun < 1 ? Math.sin(Math.PI * pose.yutkun) : 0);
  const eyeOpenBase = face.eyeOpen * (1 - Math.max(blink, pose.eyesClosed ?? 0, hcK > 0 ? 0.48 * hcK + 0.4 * hcSpaz + 0.14 * hcVer : 0));
  const time = pose.speech ? (frame - pose.speech.from) / fps : -1;
  let vis: Viseme | null = pose.speech ? currentViseme(pose.speech.cues, time) : null;
  if (!vis && pose.talk && pose.talk.some(([a, b]) => frame >= a && frame < b)) {
    const opts: Viseme[] = ["A", "E", "L", "O", "M", "I", "L", "A"];
    vis = opts[Math.floor(random(`t-${seed}-${Math.floor(frame / 3)}`) * opts.length)];
  }
  const yk = pose.yutkun !== undefined && pose.yutkun > 0 && pose.yutkun < 1 ? Math.sin(Math.PI * pose.yutkun) : 0;
  const amp = emo === "dehset" ? 1.45 : emo === "ofkeli" || emo === "korkmus" || emo === "sok" ? 1.25 : emo === "uzgun" || emo === "yorgun" ? 0.8 : 1;
  const browColor = look.yakisikli ? look.hair.shade : look.age === "old" && !["hijab"].includes(look.hair.style) ? "#7d746c" : look.hair.style === "hijab" ? "#4a3428" : look.hair.color;

  // --- arms ---
  const g = GESTURES[pose.gesture ?? "rest"] ?? GESTURES.rest;
  const armL: FullArm = { ...g.L, ...(pose.armL ?? {}) };
  const armR: FullArm = { ...g.R, ...(pose.armR ?? {}) };
  if (pose.gesture === "elSalla") armR.fore += Math.sin(frame / 3) * 18;
  if (pose.gesture === "cagir") { const c = Math.sin(frame / 3.2); armL.fore += 22 * c; armL.upper += 4 * c; }
  if (pose.gesture === "krem") { armR.fore += Math.sin(frame / 2.4) * 5; armR.upper += Math.sin(frame / 2.4 + 1.2) * 3; }
  if (pose.gesture === "kafaKasi") armR.fore += Math.sin(frame / 1.7) * 9;
  if (pose.gesture === "gobekKasi") { armL.fore += Math.sin(frame / 1.9) * 8; armL.upper += Math.sin(frame / 1.9 + 0.8) * 3; }
  if (pose.gesture === "slime") { const c = Math.sin(frame / 7); armL.upper += 6 * c; armR.upper -= 6 * c; armL.fore -= 6 * c; armR.fore += 6 * c; }
  if (pose.gesture === "okşa") armL.upper += Math.sin(frame / 5) * 5;
  if (pose.gesture === "havaImzaSol") { const st = Math.floor(frame / 7); armR.fore += (random(`hs${st}`) - 0.5) * 16; armR.upper += (random(`hu${st}`) - 0.5) * 8; }
  if (pose.gesture === "havaImza") { armL.fore += Math.sin(frame / 2.2) * 9 + Math.sin(frame / 5.3) * 5; armL.upper += Math.cos(frame / 3.1) * 5; }
  if (pose.gesture === "raf") { armR.fore += Math.sin(frame / 4) * 12; armR.upper += Math.sin(frame / 6) * 6; armL.fore += Math.cos(frame / 5) * 9; }
  // önlük çıkarma (B4): giymenin tersi + başın üstünde at kuyruğuna takılma (iki sert çekiş) + kurtulma
  const oc = pose.onlukCikar;
  let takil = 0, cekis = 0;
  let onlCik: number | undefined;
  if (oc !== undefined) {
    const k = Math.max(0, Math.min(1, oc));
    if (k < 0.15) onlCik = 1 - 0.28 * (k / 0.15);
    else if (k < 0.3) onlCik = 0.72 - 0.16 * ((k - 0.15) / 0.15);
    else if (k < 0.75) {
      takil = Math.min(1, (k - 0.3) / 0.05);
      const j = (k - 0.3) / 0.45; // iki çekiş
      cekis = Math.max(0, Math.sin(j * Math.PI * 2 * 2 - 0.4)) ** 2;
      onlCik = 0.56 - 0.03 * cekis;
    } else if (k < 0.85) { takil = 1 - (k - 0.75) / 0.1; onlCik = 0.53 - 0.09 * ((k - 0.75) / 0.1); }
    else onlCik = 0.44 - 0.19 * ((k - 0.85) / 0.15);
  }
  // önlük giyme: kollar ara pozlarla akar (elde katlı → başın üstüne → boyna geçirir → arkadan bağlar)
  const onl = onlCik ?? pose.onluk;
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
  if (cekis > 0) { armL.upper -= 14 * cekis; armR.upper -= 14 * cekis; armL.fore -= 10 * cekis; armR.fore -= 10 * cekis; }
  // yere çarpma (sağ el, elde prop): hazırlıkta kol başın üstüne kalkar, çarpmada aşağı iner
  const ya = pose.yereAt;
  let propGizle = false;
  if (ya !== undefined && ya > -0.5) {
    const kf: [number, number, number][] = [[-0.5, -4, -78], [-0.08, 150, -38], [0.0, 120, -20], [0.12, 12, -6], [0.5, 6, 0]];
    let i = 0;
    while (i < kf.length - 2 && ya > kf[i + 1][0]) i++;
    const [t0, u0, f0] = kf[i], [t1, u1, f1] = kf[i + 1];
    const e = Math.max(0, Math.min(1, (ya - t0) / (t1 - t0)));
    const ee = e * e * (3 - 2 * e);
    armR.upper = u0 + (u1 - u0) * ee; armR.fore = f0 + (f1 - f0) * ee; armR.ul = 1; armR.fl = 1;
    propGizle = ya > 0.04;
  }
  // sendeleme: kollar savrulur
  const sk = pose.sendeleK;
  const sLean = sk !== undefined && sk > 0 && sk < 1 ? Math.sin(Math.PI * sk) * (1 - 0.3 * sk) : 0;
  if (sLean > 0) { armL.upper += 70 * sLean; armL.fore -= 30 * sLean; armR.upper += 45 * sLean; armR.fore += 20 * sLean; }
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
    // kilo: kollar kalınlaşır (omuz, dirsek, bilek)
    const AW = 22 * (1 + 0.55 * kilo), EW = 19 * (1 + 0.55 * kilo), HW = 16 * (1 + 0.6 * kilo);
    const upperD = `M ${sx - AW} 352 A ${AW} ${AW} 0 0 1 ${sx + AW} 352 Q ${sx + AW + 2} ${355 + ul * 0.6} ${sx + EW} ${ey} A ${EW} ${EW} 0 0 1 ${sx - EW} ${ey} Q ${sx - AW - 3} ${355 + ul * 0.6} ${sx - AW} 352 Z`;
    const foreD = `M ${sx - EW} ${ey} A ${EW} ${EW} 0 0 1 ${sx + EW} ${ey} L ${sx + HW} ${hy} L ${sx - HW} ${hy} Z`;
    const armFill = shortSleeve ? skin : sleeve;
    const handFill = look.eldiven ?? skin;
    const sivali = !!look.sivali;
    // Çift geçiş: önce iki parçanın dış çizgisi, sonra dolgular → eklemde iç çizgi görünmez, kol tek parça gibi bükülür.
    return (
      <g transform={`rotate(${a.upper * dir} ${sx} 355)`}>
        <path d={upperD} fill={OUT} stroke={OUT} strokeWidth={SW * 2} strokeLinejoin="round" />
        <g transform={`rotate(${a.fore * dir} ${sx} ${ey})`}>
          <path d={foreD} fill={OUT} stroke={OUT} strokeWidth={SW * 2} strokeLinejoin="round" />
        </g>
        <path d={upperD} fill={armFill} />
        {look.kil && shortSleeve ? <g stroke={look.hair.color} strokeWidth={2} opacity={0.5} strokeLinecap="round">{[0.15, 0.3, 0.45, 0.6, 0.75].map((q, i) => <path key={i} d={`M ${sx + (i % 2 ? 6 : -8)} ${355 + ul * q} l ${i % 2 ? 4 : -4} 6`} />)}</g> : null}
        {look.sargi && side === "l" ? <rect x={sx - 27} y={360 + ul * 0.55} width={54} height={30} rx={9} fill="#5f8a3a" stroke={OUT} strokeWidth={3} /> : null}
        {shortSleeve && out.type !== "atlet" ? (
          <path d={`M ${sx - 24} 352 A 24 24 0 0 1 ${sx + 24} 352 L ${sx + 25} ${355 + ul * 0.45} L ${sx - 25} ${355 + ul * 0.45} Z`} fill={out.top} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
        ) : null}
        <g transform={`rotate(${a.fore * dir} ${sx} ${ey})`}>
          <path d={foreD} fill={sivali ? skin : armFill} />
          {look.kil && shortSleeve ? <g stroke={look.hair.color} strokeWidth={2} opacity={0.55} strokeLinecap="round">{[0.2, 0.35, 0.5, 0.65, 0.8].map((q, i) => <path key={i} d={`M ${sx + (i % 2 ? 5 : -7)} ${ey + (hy - ey) * q} l ${i % 2 ? 4 : -4} 6`} />)}</g> : null}
          {sivali ? <rect x={sx - 21} y={ey - 6} width={42} height={22} rx={6} fill={sleeve} stroke={OUT} strokeWidth={3} /> : null}
          {out.type === "kurye" ? <rect x={sx - 18} y={ey + fl * 0.38} width={36} height={14} fill="#e4eaee" stroke={OUT} strokeWidth={2.5} /> : null}
          {!shortSleeve && out.type === "tracksuit" ? <path d={`M ${sx + 12} ${ey} L ${sx + 10} ${hy}`} stroke="#fff" strokeWidth={5} /> : null}
          {!shortSleeve && !sivali ? <rect x={sx - 17} y={hy - 12} width={34} height={10} fill={out.topShade} stroke={OUT} strokeWidth={3} /> : null}
          <BilekEk look={look} side={side} sx={sx} hy={hy} />
          {side === "r" && look.bileklik ? <rect x={sx - 18} y={hy - 4} width={36} height={12} rx={4} fill="#f6f6f2" stroke={OUT} strokeWidth={3} /> : null}
          {(pose.agizKapa ?? 0) > 0.5 && (!pose.agizKapaEl || (pose.agizKapaEl === "sag") === (side === "r")) ? null : (
            <>
            <circle cx={sx} cy={hy + 12} r={21 * (1 + 0.22 * kilo)} fill={handFill} stroke={OUT} strokeWidth={SW} />
            {look.tirnak ? [-11, -1, 9].map((dxn) => <ellipse key={dxn} cx={sx + dxn} cy={hy + 30} rx={3.6} ry={5} fill={look.tirnak} stroke={OUT} strokeWidth={1.5} />) : null}
            {look.kil ? <path d={`M ${sx - 8} ${hy + 4} l 3 -5 M ${sx + 2} ${hy + 2} l 3 -5 M ${sx + 10} ${hy + 6} l 3 -5`} stroke={look.hair.color} strokeWidth={1.8} opacity={0.6} /> : null}
            <path d={`M ${sx + 12 * dir * -1} ${hy + 2} q ${-10 * dir} 6 ${-4 * dir} 16`} fill="none" stroke={OUT} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
            </>
          )}
          {side === "l" && pose.murekkep ? (
            <g>
              <circle cx={sx - 6} cy={hy + 24} r={7} fill="#10204a" opacity={0.9} />
              <path d={`M ${sx + 12} ${hy + 4} q 6 14 2 26`} stroke="#10204a" strokeWidth={5} strokeLinecap="round" opacity={0.6} fill="none" />
            </g>
          ) : null}
          {side === "r" && pose.prop && pose.prop !== "none" && !propGizle ? (
            <g transform={`rotate(${-(a.upper + a.fore) * dir} ${sx} ${hy + 12})`}>
              <HandProp prop={pose.prop} x={sx} y={hy + 12} look={look} />
              <circle cx={sx} cy={hy + 12} r={21 * (1 + 0.22 * kilo)} fill={handFill} stroke={OUT} strokeWidth={SW} />
            </g>
          ) : null}
        </g>
      </g>
    );
  };

  // --- legs ---
  /** Kırmızı Düğme: terlik / bağcık (ayakkabının yerine ya da üstüne), ayakta duruşun koordinatlarında */
  const AyakEk = ({ side }: { side: -1 | 1 }) => {
    const m = (d: string) => d;
    const ayna = side < 0 ? undefined : "translate(400 0) scale(-1 1)";
    if (look.tavsanTerlik) {
      // tavşan terlik: tüylü yuvarlak gövde, iki uzun kulak, minik göz ve pembe burun; taban tertemiz beyaz
      const c = look.tavsanTerlik;
      return (
        <g transform={ayna}>
          <path d="M 120 972 Q 116 992 146 992 L 204 992 L 204 972 Z" fill="#ffffff" stroke={OUT} strokeWidth={3} />
          <path d="M 122 970 Q 112 930 152 924 L 204 926 L 204 976 L 132 978 Z" fill={c} stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
          <ellipse cx={138} cy={918} rx={8} ry={22} fill={c} stroke={OUT} strokeWidth={3} transform="rotate(-24 138 918)" />
          <ellipse cx={156} cy={914} rx={8} ry={22} fill={c} stroke={OUT} strokeWidth={3} transform="rotate(-6 156 914)" />
          <ellipse cx={138} cy={920} rx={3.5} ry={13} fill="#ffb0c8" transform="rotate(-24 138 920)" />
          <ellipse cx={156} cy={916} rx={3.5} ry={13} fill="#ffb0c8" transform="rotate(-6 156 916)" />
          <circle cx={136} cy={950} r={3} fill={OUT} />
          <ellipse cx={126} cy={958} rx={4} ry={3} fill="#ff8aac" />
        </g>
      );
    }
    if (look.terlik && look.tekTerlik && side === 1) {
      // tek terlik: bu ayakta yalnız çorap (kaçırılırken terliğin biri düşmüş); başparmakta delik
      return (
        <g transform={ayna}>
          <path d="M 134 948 Q 124 980 158 980 L 200 980 L 200 944 Z" fill="#e6e2d8" stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
          <ellipse cx={140} cy={964} rx={6} ry={5} fill={skin} stroke={OUT} strokeWidth={2} />
          <path d="M 160 956 q 10 4 20 0" stroke="#bdb6a6" strokeWidth={2.5} fill="none" />
        </g>
      );
    }
    if (look.terlik) {
      return (
        <g transform={ayna}>
          <path d={m("M 126 968 Q 124 986 150 986 L 202 986 L 202 968 Z")} fill="#2b2f36" stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
          <path d={m("M 136 950 Q 128 974 160 972 L 198 972 L 198 946 Z")} fill={skin} stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
          <path d={m("M 148 952 L 198 950 L 198 966 L 144 968 Z")} fill={look.terlik} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
          <path d={m("M 134 962 q 2 -8 8 -6 M 136 970 q 3 -6 8 -4")} stroke={OUT} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>
      );
    }
    if (look.bagcik) {
      return (
        <g stroke={look.bagcik} strokeWidth={3.2} strokeLinecap="round" fill="none" transform={ayna}>
          <path d={m("M 172 951 L 192 959 M 172 959 L 192 951")} />
          <path d={m("M 182 950 q -12 -12 -14 -2 q 4 6 14 2 q 12 -12 14 -2 q -4 6 -14 2")} />
        </g>
      );
    }
    return null;
  };
  /** 7/24 B6 (opt-in): popo üstü yere çökme. k=0 ayakta bacaklar, k=1 yerde: uyluklar kalçadan dizlere yukarı (göbeğin
   *  önünde), baldırlar dizden öndeki ayaklara iner, ayakkabılar burunları kameraya dönük. Gövdeden sonra çizilir. */
  const YerBacak = ({ k }: { k: number }) => {
    const pants = out.bottom;
    const F = 985 - 345 * k;
    const shoe = out.shoes === "skin" ? skin : out.shoes;
    const parts = [-1, 1].map((side) => {
      const kx = (side < 0 ? 172 : 228) + side * 18 * k;
      const ky = 790 - 315 * k;
      const fx = (side < 0 ? 170 : 230) + side * 26 * k;
      const fy = F - 36 + 52 * k;
      const w = 28 + 3 * k;
      const h0 = side < 0 ? 146 : 200, h1 = side < 0 ? 200 : 254;
      return { side, kx, ky, fx, fy, w, h0, h1 };
    });
    return (
      <g>
        {parts.map(({ side, kx, ky, w, h0, h1 }) => (
          <path key={`u${side}`} d={`M ${h0} 600 L ${h1} 600 L ${kx + w} ${ky} L ${kx - w} ${ky} Z`} fill={pants} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
        ))}
        {parts.map(({ side, kx, ky, fx, fy, w }) => (
          <g key={`s${side}`}>
            <path d={`M ${kx - w} ${ky} L ${kx + w} ${ky} L ${fx + w * 0.86} ${fy} L ${fx - w * 0.86} ${fy} Z`} fill={pants} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
            <path d={`M ${kx + side * w * 0.45} ${ky + 20} L ${fx + side * w * 0.4} ${fy - 6}`} stroke="#00000030" strokeWidth={5} />
          </g>
        ))}
        {parts.map(({ side, kx, ky, w }) => (
          <g key={`d${side}`} opacity={Math.min(1, k * 3)}>
            <ellipse cx={kx} cy={ky + 4} rx={w + 3} ry={16 + 10 * k} fill={pants} stroke={OUT} strokeWidth={SW} />
            <path d={`M ${kx - w * 0.55} ${ky + 2} Q ${kx} ${ky - 8 - 4 * k} ${kx + w * 0.55} ${ky + 2}`} stroke="#ffffff" strokeWidth={4} opacity={0.18} fill="none" />
          </g>
        ))}
        {parts.map(({ side, fx, fy }) => (
          <g key={`a${side}`}>
            <path d={`M ${fx - 30} ${fy - 4} Q ${fx - 36} ${fy + 30 + 6 * k} ${fx} ${fy + 32 + 6 * k} Q ${fx + 36} ${fy + 30 + 6 * k} ${fx + 30} ${fy - 4} Z`} fill={shoe} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
            <path d={`M ${fx - 31} ${fy + 18 + 4 * k} Q ${fx} ${fy + 26 + 6 * k} ${fx + 31} ${fy + 18 + 4 * k}`} stroke="#b8b8b8" strokeWidth={6} fill="none" opacity={0.8} />
            <path d={`M ${fx - 12} ${fy + 2} L ${fx + 12} ${fy + 2} M ${fx - 10} ${fy + 9} L ${fx + 10} ${fy + 9}`} stroke="#9a9a9a" strokeWidth={2.5} opacity={0.7 * k} />
          </g>
        ))}
      </g>
    );
  };
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
          {look.terlik || look.tavsanTerlik ? null : <path d="M 124 876 Q 120 908 156 908 L 190 908 L 190 876 Z" fill={out.shoes === "skin" ? skin : out.shoes} stroke={OUT} strokeWidth={SW} />}
          {look.terlik || look.tavsanTerlik ? null : <path d="M 210 876 L 210 908 L 244 908 Q 280 908 276 876 Z" fill={out.shoes === "skin" ? skin : out.shoes} stroke={OUT} strokeWidth={SW} />}
          {look.serit ? <path d="M 133 704 L 138 874 M 267 704 L 262 874" stroke={look.serit} strokeWidth={6} /> : null}
          <g transform="translate(-14 -70)"><AyakEk side={-1} /></g>
          <g transform="translate(12 -70)"><AyakEk side={1} /></g>
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
          {look.serit ? <path d={side < 0 ? "M 151 606 L 150 944" : "M 249 606 L 250 944"} stroke={look.serit} strokeWidth={7} /> : null}
          {out.type === "pijama" ? <PijamaBacak side={side} renk={out.topShade} /> : null}
          {out.type === "tulum" ? (
            <g>
              <path d={side < 0 ? "M 144 926 L 196 926 L 196 948 L 144 948 Z" : "M 204 926 L 256 926 L 256 948 L 204 948 Z"} fill={out.topShade} stroke={OUT} strokeWidth={3} />
              {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${(side < 0 ? 150 : 210) + i * 10} 928 v 18`} stroke="#b8bec0" strokeWidth={2} />)}
            </g>
          ) : null}
          {look.terlik || look.tavsanTerlik ? null : <path d={side < 0 ? "M 138 946 Q 136 978 170 978 L 198 978 L 198 946 Z" : "M 202 946 L 202 978 L 230 978 Q 264 978 262 946 Z"} fill={out.shoes === "skin" ? skin : out.shoes} stroke={OUT} strokeWidth={SW} />}
          <AyakEk side={side as -1 | 1} />
        </g>
      );
    };
    return (
      <g transform={kilo ? `translate(200 0) scale(${1 + 0.32 * kilo} 1) translate(-200 0)` : undefined}>
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
            d={`M 136 590 L ${t === "dress" ? 96 : 110} ${t === "dress" ? (look.mini ? 690 : 830) : 760} Q 200 ${t === "dress" ? (look.mini ? 706 : 850) : 776} ${t === "dress" ? 304 : 290} ${t === "dress" ? (look.mini ? 690 : 830) : 760} L 264 590 Z`}
            fill={t === "dress" ? out.top : out.bottom}
            stroke={OUT}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
        ) : null}
        {skirtGirl ? <path d={`M 170 610 L 150 ${t === "dress" ? (look.mini ? 690 : 830) : 760} M 230 610 L 250 ${t === "dress" ? (look.mini ? 690 : 830) : 760} M 200 612 L 200 ${t === "dress" ? (look.mini ? 698 : 840) : 768}`} stroke={t === "dress" ? out.topShade : "#00000033"} strokeWidth={4} /> : null}
        <path d={body} fill={t === "atlet" ? skin : out.top} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
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
              <circle key={y} cx={176} cy={y} r={look.dugmeRenk ? 7 : 5} fill={look.dugmeRenk ?? out.topShade} stroke={OUT} strokeWidth={2} />
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
        <TorsoDugme look={look} skin={skin} />
        {look.earrings && look.hair.style !== "hijab" ? null : null}
      </g>
    );
  };

  // --- head ---
  const old = look.age === "old";
  const facePath = kilo > 0
    ? "M 106 150 Q 98 250 122 294 Q 138 324 166 338 Q 200 354 234 338 Q 262 324 278 294 Q 302 250 294 150 Q 286 86 200 86 Q 114 86 106 150 Z"
    : look.yakisikli
    ? "M 114 150 Q 112 236 126 266 Q 146 304 184 314 Q 200 318 216 314 Q 254 304 274 266 Q 288 236 286 150 Q 280 90 200 90 Q 120 90 114 150 Z"
    : male
    ? "M 114 150 Q 112 250 140 286 Q 170 312 200 312 Q 230 312 260 286 Q 288 250 286 150 Q 280 90 200 90 Q 120 90 114 150 Z"
    : "M 116 150 Q 112 246 146 284 Q 174 310 200 310 Q 226 310 254 284 Q 288 246 284 150 Q 278 92 200 92 Q 122 92 116 150 Z";
  const squeezeL = 1 - Math.max(0, -yaw) * 0.3 - Math.max(0, -strong) * 0.5;
  const squeezeR = 1 - Math.max(0, yaw) * 0.3 - Math.max(0, strong) * 0.5;
  const tears = pose.tears ?? (emo === "agliyor" ? 0.8 : 0);
  const pale = pose.pale ?? (emo === "sok" ? 0.6 : 0);
  const blushAmt = (look.blush === false ? 0 : 1) * face.blush * (1 - pale);

  const kapali = !!(look.kask || look.karMaske);
  const Head = () => (
    <g>
      {look.hair.style !== "hijab" && !kapali ? (
        <>
          <ellipse cx={110 - 6 * kilo - dx * 0.4} cy={210} rx={14} ry={22} fill={skin} stroke={OUT} strokeWidth={SW} />
          <ellipse cx={290 + 6 * kilo - dx * 0.4} cy={210} rx={14} ry={22} fill={skin} stroke={OUT} strokeWidth={SW} />
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
      <YuzEk look={look} dx={dx} kilo={kilo} />
      {pose.mumParlak ? (
        <g opacity={Math.min(1, pose.mumParlak)}>
          {/* mum/maske parlaklığı: yüz fazla pürüzsüz ve ıslak görünür */}
          <path d={facePath} fill="#f4e6d4" opacity={0.16} />
          <ellipse cx={196 + dx} cy={128} rx={46} ry={13} fill="#ffffff" opacity={0.5} transform={`rotate(-6 ${196 + dx} 128)`} />
          <ellipse cx={150 + dx} cy={232} rx={13} ry={7} fill="#ffffff" opacity={0.42} />
          <ellipse cx={252 + dx} cy={230} rx={11} ry={6} fill="#ffffff" opacity={0.36} />
          <ellipse cx={206 + dx} cy={236} rx={5} ry={7} fill="#ffffff" opacity={0.5} />
        </g>
      ) : null}
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
      <MakyajAlt look={look} dx={dx} />
      <Eye cx={160 + dx} cy={198} look={look} lookX={lookX + (0.95 - lookX) * tk} lookY={lookY + 0.25 * tk} open={eyeOpenBase * (1 - 0.3 * tk) * (1 - 0.55 * (pose.gozKis?.[0] ?? 0))} smile={face.eyeSmile && tk < 0.5} pupil={look.korkunc ? 0.38 : face.pupil} squeeze={squeezeL} uid={`${uid}l`} sok={pose.gozSok ?? 0} parilti={pose.parilti?.[0] ?? 0} bos={pose.bosGoz ?? 0} />
      <Eye cx={240 + dx} cy={198} look={look} lookX={lookX + (-0.95 - lookX) * tk} lookY={lookY - 0.1 * tk} open={eyeOpenBase * (1 + 0.22 * tk) * (1 - 0.55 * (pose.gozKis?.[1] ?? 0))} smile={face.eyeSmile && tk < 0.5} pupil={look.korkunc ? 0.38 : face.pupil} squeeze={squeezeR} flip uid={`${uid}r`} sok={pose.gozSok ?? 0} parilti={pose.parilti?.[1] ?? 0} bos={pose.bosGoz ?? 0} />
      <Brow cx={160 + dx} cy={160} inner={face.browInner + (-12 - face.browInner) * tk} outer={face.browOuter + (-4 - face.browOuter) * tk} lift={face.browLift + (8 - face.browLift) * tk} color={browColor} thick={look.yakisikli ? 9.5 : male ? 8 : 6.5} squeeze={squeezeL} />
      <Brow cx={240 + dx} cy={160} inner={face.browInner + (14 - face.browInner) * tk} outer={face.browOuter + (12 - face.browOuter) * tk} lift={face.browLift + (-16 - face.browLift) * tk} color={browColor} thick={look.yakisikli ? 9.5 : male ? 8 : 6.5} squeeze={squeezeR} flip />
      <path d={`M ${202 + dx * 1.3} ${214 - 6 * tk} Q ${196 + dx * 1.5 - Math.abs(yaw) * 6 * Math.sign(yaw || 1) - 8 * tk} ${236 - 8 * tk} ${204 + dx * 1.3 + 6 * tk} ${244 - 9 * tk}`} fill="none" stroke={OUT} strokeWidth={3.5} strokeLinecap="round" />
      {tk > 0.05 ? (
        // taklit: burun kıvrık (sırt kırışıkları, kalkık burun kanatları)
        <g opacity={Math.min(1, tk * 1.4)} stroke={OUT} strokeLinecap="round" fill="none">
          <path d={`M ${190 + dx} 196 Q ${200 + dx} 191 ${212 + dx} 197`} strokeWidth={2.6} />
          <path d={`M ${188 + dx} 205 Q ${201 + dx} 199 ${214 + dx} 206`} strokeWidth={2.6} />
          <path d={`M ${186 + dx} 231 Q ${180 + dx} 222 ${192 + dx} 219`} strokeWidth={3} />
          <path d={`M ${220 + dx} 230 Q ${227 + dx} 220 ${214 + dx} 217`} strokeWidth={3} />
          <ellipse cx={194 + dx} cy={232} rx={4} ry={2.6} fill={OUT} stroke="none" />
          <ellipse cx={214 + dx} cy={231} rx={4} ry={2.6} fill={OUT} stroke="none" />
        </g>
      ) : null}
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
      {(() => {
        const agiz = (
          <>
            <g transform={look.agizOlcek ? `translate(${200 + dx * 1.1} ${274 + 2 * yk}) scale(${look.agizOlcek}) translate(${-(200 + dx * 1.1)} ${-(274 + 2 * yk)})` : undefined}>
              {!vis && (pose.aglaAgiz !== undefined || hcK > 0) ? (
                <AglaAgiz o={Math.max(0, Math.min(1, (pose.aglaAgiz ?? 0.45 * hcK) + 0.5 * hcVer - 0.45 * hcSpaz))} cx={200 + dx * 1.1} cy={274 + 2 * yk} frame={frame} titre={0.6 + hcK} />
              ) : (
                <Mouth viseme={vis} rest={hikK > 0.1 && !vis ? "o" : yk > 0.15 ? "tight" : face.mouth} cx={200 + dx * 1.1} cy={274 + 2 * yk} amp={amp} scream={emo === "dehset"} />
              )}
            </g>
            <MakyajUst look={look} dx={dx} mouthX={200 + dx * 1.1} mouthY={274 + 2 * yk} konusuyor={!!vis && vis !== "X"} restMouth={face.mouth} />
          </>
        );
        if (pose.cigne !== undefined) {
          // B9: çiğneme: çene ritmik iner-kalkar (ağız kapalı, gerili), dudaklar yana kayar
          const mx = 200 + dx * 1.1, my = 274 + 2 * yk;
          const c = Math.sin(pose.cigne * 2 * Math.PI * 2.1), yk2 = pose.yanak ?? 0;
          return <g transform={`translate(${mx + 3 * yk2 * Math.sin(pose.cigne * 6.6)} ${my + 5 * yk2 * Math.max(0, c)}) scale(${1 + 0.1 * yk2 * c} ${1 - 0.25 * yk2 * Math.max(0, c)}) translate(${-mx} ${-my})`}>{agiz}</g>;
        }
        if (tk > 0.01) {
          const mx = 200 + dx * 1.1, my = 274 + 2 * yk;
          return <g transform={`translate(${mx + 16 * tk} ${my - 4 * tk}) rotate(${-15 * tk}) skewX(${-12 * tk}) scale(${1 + 0.12 * tk} ${1 - 0.08 * tk}) translate(${-mx} ${-my})`}>{agiz}</g>;
        }
        return pose.dudakTitre ? (
          <g transform={`translate(${200 + dx * 1.1} ${274 + 2 * yk + 1.6 * pose.dudakTitre * Math.sin(frame * 2.3)}) scale(${1 + 0.07 * pose.dudakTitre * Math.sin(frame * 3.1)} ${1 + 0.12 * pose.dudakTitre * Math.sin(frame * 2.7 + 1)}) translate(${-(200 + dx * 1.1)} ${-(274 + 2 * yk)})`}>
            {agiz}
          </g>
        ) : (
          agiz
        );
      })()}
      {pose.yanak && pose.yanak > 0.01 ? (() => {
        // B9: yanaklar dolu (çiğnerken sırayla şişer)
        const ph = pose.cigne ?? 0, a = pose.yanak;
        const l = a * (0.75 + 0.25 * Math.sin(ph * 6.6)), r = a * (0.75 + 0.25 * Math.sin(ph * 6.6 + 2.2));
        return (
          <g>
            <path d={`M ${132 + dx} ${222} Q ${118 + dx - 16 * l} ${262} ${150 + dx} ${292 + 6 * l}`} fill={look.skin} stroke={OUT} strokeWidth={4} />
            <path d={`M ${268 + dx} ${222} Q ${282 + dx + 16 * r} ${262} ${250 + dx} ${292 + 6 * r}`} fill={look.skin} stroke={OUT} strokeWidth={4} />
            <ellipse cx={146 + dx - 6 * l} cy={256} rx={14} ry={9} fill="#ef8f8a" opacity={0.35 * l} />
            <ellipse cx={254 + dx + 6 * r} cy={256} rx={14} ry={9} fill="#ef8f8a" opacity={0.35 * r} />
          </g>
        );
      })() : null}
      {pose.agizPara && pose.agizPara > 0.01 ? (
        // B9: ağız kenarından sarkan kırmızı banknot ucu (çiğnendikçe içeri çekilir)
        <g transform={`translate(${214 + dx * 1.1} ${280}) rotate(${18 + 10 * Math.sin((pose.cigne ?? 0) * 13)})`} opacity={Math.min(1, pose.agizPara * 3)}>
          <path d={`M 0 -6 L ${30 * pose.agizPara} -10 L ${34 * pose.agizPara} 8 L ${4} 10 Z`} fill="#c8283a" stroke={OUT} strokeWidth={2.5} />
          <path d={`M 6 -2 L ${28 * pose.agizPara} -4`} stroke="#f2b0a0" strokeWidth={1.5} opacity={0.8} />
          <text x={9} y={6} fontSize={8} fontWeight={900} fontFamily="Arial, sans-serif" fill="#f8d8c8">200</text>
        </g>
      ) : null}
      {pose.sirit && pose.sirit > 0.01 ? (
        // B9: gülümseme kulaklara uzar (ince mürekkep çizgisi + koyu yarık; yalnız 1-2 karede)
        <g opacity={Math.min(1, pose.sirit * 1.4)}>
          <path d={`M ${174 + dx} 278 Q ${150 + dx - 6 * pose.sirit} ${268 - 4 * pose.sirit} ${122 + dx - 4 * pose.sirit} ${224 - 10 * pose.sirit}`} stroke="#2a0c10" strokeWidth={3.2} fill="none" strokeLinecap="round" />
          <path d={`M ${226 + dx} 278 Q ${250 + dx + 6 * pose.sirit} ${268 - 4 * pose.sirit} ${278 + dx + 4 * pose.sirit} ${224 - 10 * pose.sirit}`} stroke="#2a0c10" strokeWidth={3.2} fill="none" strokeLinecap="round" />
          <path d={`M ${176 + dx} 279 Q ${200 + dx} ${292 + 8 * pose.sirit} ${224 + dx} 279 Q ${200 + dx} 286 ${176 + dx} 279 Z`} fill="#1a0608" />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${184 + i * 8 + dx} 281 l 3 ${5 + pose.sirit! * 3} l 3 ${-5 - pose.sirit! * 3} Z`} fill="#f4eee0" />)}
        </g>
      ) : null}
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
      {kapali ? null : <HairFront look={look} dx={yaw * 10 + strong * 30} />}
      {kapali ? null : <KulakEk look={look} dx={dx} />}
      {kapali ? null : <SacEk look={look} dx={dx} />}
      {pose.sacDagin ? (
        <g stroke={look.hair.color} strokeWidth={3.5} fill="none" strokeLinecap="round">
          <path d={`M ${150 + dx} 90 q -16 -14 -10 -30`} />
          <path d={`M ${232 + dx} 84 q 12 -18 28 -18`} stroke={look.hair.shade} />
          <path d={`M ${116 + dx * 0.4} 168 q -16 12 -12 32`} />
          <path d={`M ${286 + dx * 0.4} 164 q 14 10 12 30`} stroke={look.hair.shade} />
          <path d={`M ${196 + dx} 82 q -4 -16 6 -24`} />
        </g>
      ) : null}
      {look.glasses ? (
        <g fill="none" stroke={look.glasses} strokeWidth={5}>
          <rect x={130 + dx} y={176} width={60} height={44} rx={14} />
          <rect x={210 + dx} y={176} width={60} height={44} rx={14} />
          <path d={`M ${190 + dx} 194 Q ${200 + dx} 186 ${210 + dx} 194 M ${130 + dx} 192 L 114 186 M ${270 + dx} 192 L 286 186`} />
        </g>
      ) : null}
      <KarMaske look={look} dx={dx} uid={uid} />
      <Kask look={look} dx={dx} uid={uid} yansima={pose.kaskYansima ?? 0} />
      {pose.yagmur ? (
        <g opacity={Math.min(1, pose.yagmur)}>
          {/* yağmurda ıslanmış baş: tepede damlalar, şakaktan süzülen su, çeneden damlayan damla */}
          {[[150, 112], [232, 104], [186, 96], [262, 140], [128, 150], [204, 120]].map(([x, y], i) => (
            <path key={i} d={`M ${x + dx * 0.5} ${y} q -4 9 0 13 q 4 -4 0 -13 z`} fill="#d8ecff" stroke="#6fa8cf" strokeWidth={1.6} />
          ))}
          {[0, 1].map((i) => {
            const per = 38 + i * 11;
            const k = ((frame + i * 17) % per) / per;
            const x = i ? 284 + dx * 0.3 : 118 + dx * 0.3;
            return <path key={`s${i}`} d={`M ${x} ${170 + 70 * k} q -3 7 0 10 q 3 -3 0 -10 z`} fill="#d8ecff" stroke="#6fa8cf" strokeWidth={1.4} opacity={k < 0.9 ? 1 : 0} />;
          })}
          {(() => {
            const per = 27;
            const k = (frame % per) / per;
            const y = k < 0.55 ? 314 + 6 * (k / 0.55) : 320 + 220 * ((k - 0.55) / 0.45) ** 2;
            return <path d={`M ${200 + dx} ${y} q -4 9 0 13 q 4 -4 0 -13 z`} fill="#d8ecff" stroke="#6fa8cf" strokeWidth={1.6} />;
          })()}
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
  const syB = age.sy * (look.boy ?? 1);
  const yerK = Math.max(0, Math.min(1, pose.yerOtur ?? 0));
  const groundShift = 680 * (1 - syB) + 185 * dizK + 345 * yerK;
  const bodyT = `translate(200 300) scale(${age.sx} ${syB}) translate(-200 -300)${running ? ` rotate(${2.4 * runU} 200 600)` : ""}${sLean > 0 ? ` translate(0 ${24 * sLean}) rotate(${-13 * sLean} 200 980)` : ""}`;
  const torsoScale = `translate(200 470) scale(${wx} ${1 + breathe}) translate(-200 -470)`;
  const runTilt = running ? 3.2 * Math.sin(runPh - 0.6) : 0;
  const yutY = 5 * yk;
  const sTilt = -8 * sLean;
  const kah = pose.kahkaha ? Math.min(1, pose.kahkaha) * Math.abs(Math.sin(frame * 0.95)) : 0;
  const omzY = 14 * hikK + 7 * kah - 12 * Math.min(1, pose.omuzDus ?? 0) + 15 * hcSpaz + 2.6 * hcVer * Math.sin(frame * 2.3);
  const headT = `translate(0 ${-omzY * 1.35 - breathe * 300 + sobbing + (running ? 5 * Math.abs(Math.cos(runPh - 0.5)) : 0) + yutY}) rotate(${(pose.tilt ?? 0) + sway * 0.6 + runTilt + sTilt + 4 * cekis - 4 * hikK - 3 * kah + (hcK > 0 ? -3 * hcSpaz + 1.6 * hcVer * Math.sin(frame * 0.7 + seed) : 0)} 200 300) translate(200 300) scale(${age.head * (look.basOlcek ?? 1)}) translate(-200 -300)`;

  return (
    <svg
      viewBox="0 0 400 1000"
      width={size * 0.4}
      height={size}
      style={{ overflow: "visible", scale: flip ? "-1 1" : undefined, ...style }}
    >
      <g transform={`translate(0 ${groundShift + bob})`}>
        {pose.hideLegs || pose.golgesiz ? null : <ellipse cx={200} cy={(pose.body === "sit" ? 910 : 985) - groundShift + 345 * yerK} rx={130 * wx * (1 + 0.45 * yerK)} ry={16 + 8 * yerK} fill="#000" opacity={0.2} transform={`translate(0 ${-bob})`} />}
        {/* back hair (follows the head) */}
        <g transform={bodyT}>
          <g transform={headT}>
            {kapali ? null : <HairBack look={look} dx={yaw * 10} sway={sway * 2 + (pose.sacEk ?? 0) + (running ? 26 * Math.sin(runPh - 1.1) : 0)} />}
          </g>
        </g>
        <g transform={bodyT}>
          <SirtCanta look={look} />
          {pose.hideLegs || yerK > 0.001 ? null : <Legs />}
          <g transform={torsoScale}>
            <g transform={omzY ? `translate(0 ${-omzY * 0.6})` : undefined}>
            <Torso />
            <Gobek look={look} skin={skin} uid={uid} />
            {pose.yagmur ? (
              <g opacity={Math.min(1, pose.yagmur) * 0.85}>
                {/* ıslak omuzlar ve yaka: kumaş koyulaşır */}
                <path d="M 128 340 Q 200 320 272 340 Q 288 360 284 410 Q 240 396 200 420 Q 160 396 116 410 Q 112 360 128 340 Z" fill="#0c1420" opacity={0.32} />
                {[[150, 380], [238, 372], [206, 440], [170, 470], [252, 452]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#0c1420" opacity={0.35} />)}
              </g>
            ) : null}
            </g>
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
          {yerK > 0.001 && !pose.hideLegs ? <YerBacak k={yerK} /> : null}
          {/* neck */}
          <path d={kilo > 0 ? "M 166 290 L 162 340 Q 200 354 238 340 L 234 290 Z" : "M 180 290 L 180 336 Q 200 346 220 336 L 220 290 Z"} fill={look.hair.style === "hijab" ? look.hair.color : look.karMaske ?? skin} stroke={OUT} strokeWidth={SW} />
          <path d="M 182 318 Q 200 330 218 318" fill="none" stroke={look.skinShade} strokeWidth={6} opacity={look.hair.style === "hijab" || look.karMaske ? 0 : 1} />
          <OnBoyun look={look} />
          <KulaklikKablo look={look} />
          {yk > 0 ? <path d={`M 193 ${330 - 22 * yk} q 7 -7 14 0`} fill="none" stroke={look.skinShade} strokeWidth={5} strokeLinecap="round" opacity={0.9} /> : null}
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
            {takil > 0 ? (
              <path d={`M 252 124 C 284 ${100 - 30 * takil} ${268 - 6 * cekis} ${44 - 34 * takil - 10 * cekis} 238 ${34 - 30 * takil - 14 * cekis} C 234 ${54 - 20 * takil} 250 94 240 128 Z`} fill={look.hair.color} stroke={OUT} strokeWidth={4} strokeLinejoin="round" opacity={Math.min(1, takil * 1.5)} />
            ) : null}
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
          <g transform={omzY ? `translate(0 ${-omzY})` : undefined}>
          {pose.kolGizle === "l" || pose.kolGizle === "ikisi" ? null : <Arm side="l" a={armL} />}
          {pose.kolGizle === "r" || pose.kolGizle === "ikisi" ? null : <Arm side="r" a={armR} />}
          {pose.prop === "telefon_yatay" ? (() => {
            // ileri kinematik: iki elin gövde uzayındaki yeri; telefon aralarına çizilir
            const fk = (side: "l" | "r", ar: FullArm): [number, number] => {
              const sx0 = side === "l" ? 200 - shoulderOff : 200 + shoulderOff;
              const dir = side === "l" ? 1 : -1;
              const ul = 140 * (ar.ul ?? 1), fl = 108 * (ar.fl ?? 1) + 12;
              const u = (ar.upper * dir * Math.PI) / 180, t2 = ((ar.upper + ar.fore) * dir * Math.PI) / 180;
              return [sx0 - ul * Math.sin(u) - fl * Math.sin(t2), 355 + ul * Math.cos(u) + fl * Math.cos(t2)];
            };
            return <TelefonYatay l={fk("l", armL)} r={fk("r", armR)} el={look.eldiven ?? skin} />;
          })() : null}
          </g>
        </g>
        {pose.agizKapa ? (
          <g transform={bodyT}>
            <g transform={headT}>
              <AgizKapaEller look={look} k={pose.agizKapa} dx={dx} titre={(pose.elTitre ?? 0) * (Math.sin(frame * 1.9) * 0.6 + Math.sin(frame * 3.3) * 0.4)} tek={pose.agizKapaEl} />
            </g>
          </g>
        ) : null}
      </g>
    </svg>
  );
};
