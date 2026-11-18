import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Rain } from "./Effects";

const OUT = "#1b1412";
export const W = 1080;
export const H = 1920;

/** Night city seen through a window, with rain and flickering windows. */
const NightWindow: React.FC<{ x: number; y: number; w: number; h: number; flash: number }> = ({ x, y, w, h, flash }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1626" />
          <stop offset="1" stopColor="#1d3552" />
        </linearGradient>
        <clipPath id="windowClip">
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill="url(#nightSky)" />
      <g clipPath="url(#windowClip)">
        {new Array(9).fill(0).map((_, i) => {
          const bw = 60 + random(`b-w-${i}`) * 70;
          const bh = 180 + random(`b-h-${i}`) * 380;
          const bx = x + i * (w / 8) - 30;
          return (
            <g key={i}>
              <rect x={bx} y={y + h - bh} width={bw} height={bh} fill="#14202f" />
              {new Array(10).fill(0).map((__, j) => {
                const lit = random(`lit-${i}-${j}`) > 0.62;
                const flick = random(`fl-${i}-${j}-${Math.floor(frame / 45)}`) > 0.08;
                if (!lit) return null;
                return (
                  <rect
                    key={j}
                    x={bx + 10 + (j % 3) * 18}
                    y={y + h - bh + 20 + Math.floor(j / 3) * 34}
                    width={10}
                    height={16}
                    fill="#ffd27a"
                    opacity={flick ? 0.75 : 0.15}
                  />
                );
              })}
            </g>
          );
        })}
        <g transform={`translate(${x} ${y})`}>
          <Rain width={w} height={h} count={90} opacity={0.55} seed="win" />
        </g>
        <rect x={x} y={y} width={w} height={h} fill="#dfe9ff" opacity={flash * 0.85} />
      </g>
      {/* frame + muntins */}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#c9b79c" strokeWidth={22} />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={OUT} strokeWidth={4} />
      <path d={`M ${x + w / 2} ${y} V ${y + h} M ${x} ${y + h * 0.45} H ${x + w}`} stroke="#c9b79c" strokeWidth={16} />
      <rect x={x - 30} y={y + h} width={w + 60} height={26} fill="#b9a487" stroke={OUT} strokeWidth={4} />
    </g>
  );
};

const Curtain: React.FC<{ x: number; y: number; w: number; h: number; flip?: boolean }> = ({ x, y, w, h, flip }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 30) * 6;
  return (
    <g style={{ transformOrigin: `${x + w / 2}px ${y}px`, scale: flip ? "-1 1" : "1 1" }}>
      <path
        d={`M ${x} ${y} L ${x + w} ${y} Q ${x + w * 0.8 + sway} ${y + h * 0.5} ${x + w * 0.55 + sway} ${y + h} L ${x - 10} ${y + h} Q ${x + 10} ${y + h * 0.5} ${x} ${y} Z`}
        fill="#6e2c2f"
        stroke={OUT}
        strokeWidth={4}
      />
      <path d={`M ${x + w * 0.3} ${y + 10} Q ${x + w * 0.35 + sway / 2} ${y + h * 0.5} ${x + w * 0.2} ${y + h - 6}`} stroke="#4f1d21" strokeWidth={10} fill="none" />
      <path d={`M ${x + w * 0.65} ${y + 10} Q ${x + w * 0.6 + sway / 2} ${y + h * 0.5} ${x + w * 0.42} ${y + h - 6}`} stroke="#8a3c3e" strokeWidth={6} fill="none" />
    </g>
  );
};

/** Living room at night. `flash` = lightning intensity 0..1 */
export const LivingRoom: React.FC<{ flash?: number; lampOn?: boolean }> = ({ flash = 0, lampOn = true }) => {
  const frame = useCurrentFrame();
  const lampFlicker = lampOn ? 0.85 + random(`lamp-${Math.floor(frame / 4)}`) * 0.08 : 0;
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b2735" />
            <stop offset="1" stopColor="#2a3a4b" />
          </linearGradient>
          <pattern id="paper" width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M 45 20 L 55 45 L 45 70 L 35 45 Z" fill="#33465a" opacity={0.55} />
          </pattern>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2a22" />
            <stop offset="1" stopColor="#21160f" />
          </linearGradient>
          <radialGradient id="lampGlow">
            <stop offset="0" stopColor="#ffcc7a" stopOpacity={0.55} />
            <stop offset="1" stopColor="#ffcc7a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={W} height={1500} fill="url(#wall)" />
        <rect width={W} height={1500} fill="url(#paper)" />
        {/* floor */}
        <rect y={1500} width={W} height={420} fill="url(#floor)" />
        {new Array(8).fill(0).map((_, i) => (
          <path key={i} d={`M ${i * 160 - 200} 1920 L ${i * 120 + 40} 1500`} stroke="#18100b" strokeWidth={3} opacity={0.6} />
        ))}
        <rect y={1480} width={W} height={30} fill="#3c3029" stroke={OUT} strokeWidth={4} />

        <NightWindow x={590} y={330} w={400} h={640} flash={flash} />
        <Curtain x={520} y={300} w={140} h={760} />
        <Curtain x={920} y={300} w={140} h={760} flip />
        <rect x={500} y={286} width={580} height={20} rx={10} fill="#5a4334" stroke={OUT} strokeWidth={4} />

        {/* torn family photo */}
        <g>
          <rect x={150} y={560} width={270} height={200} fill="#6b5340" stroke={OUT} strokeWidth={5} />
          <path d="M 168 578 H 402 V 590 L 380 610 L 398 640 L 376 670 L 396 700 L 382 742 H 168 Z" fill="#d9cbb0" stroke={OUT} strokeWidth={3} />
          <circle cx={215} cy={640} r={20} fill="#c58d6e" />
          <path d="M 190 742 Q 215 670 240 742 Z" fill="#7a9a6b" />
          <circle cx={285} cy={660} r={14} fill="#e2a982" />
          <path d="M 268 742 Q 285 690 302 742 Z" fill="#d9a441" />
          <path d="M 330 640 a 18 18 0 0 1 30 -6" stroke="#9a958f" strokeWidth={6} fill="none" opacity={0.7} />
        </g>
        {/* clock showing 03:00 */}
        <g>
          <circle cx={290} cy={390} r={70} fill="#e8dcc6" stroke={OUT} strokeWidth={6} />
          {new Array(12).fill(0).map((_, i) => (
            <rect key={i} x={288} y={328} width={4} height={10} fill={OUT} style={{ transformOrigin: "290px 390px", rotate: `${i * 30}deg` }} />
          ))}
          <path d="M 290 390 L 290 340" stroke={OUT} strokeWidth={5} strokeLinecap="round" />
          <path d="M 290 390 L 326 390" stroke={OUT} strokeWidth={7} strokeLinecap="round" />
          <path
            d="M 290 390 L 290 334"
            stroke="#b33"
            strokeWidth={2}
            style={{ transformOrigin: "290px 390px", rotate: `${frame * 6}deg` }}
          />
          <circle cx={290} cy={390} r={6} fill={OUT} />
        </g>
        {/* floor lamp */}
        <circle cx={120} cy={980} r={520} fill="url(#lampGlow)" opacity={lampFlicker} />
        <path d="M 120 1000 V 1600" stroke="#2c2622" strokeWidth={10} />
        <ellipse cx={120} cy={1605} rx={60} ry={14} fill="#2c2622" />
        <path d="M 40 1000 L 200 1000 L 170 880 L 70 880 Z" fill={lampOn ? "#f3d9a0" : "#8a7a60"} stroke={OUT} strokeWidth={5} />
        {/* sofa */}
        <g>
          <rect x={-60} y={1290} width={560} height={210} rx={40} fill="#6d4f3a" stroke={OUT} strokeWidth={5} />
          <rect x={-60} y={1420} width={600} height={200} rx={30} fill="#7d5c44" stroke={OUT} strokeWidth={5} />
          <rect x={460} y={1360} width={100} height={260} rx={40} fill="#6d4f3a" stroke={OUT} strokeWidth={5} />
          <rect x={60} y={1340} width={150} height={110} rx={30} fill="#c9a24a" stroke={OUT} strokeWidth={4} style={{ rotate: "-8deg", transformOrigin: "135px 1395px" }} />
        </g>
      </svg>
      {/* lightning lights the whole room */}
      <AbsoluteFill style={{ backgroundColor: "#cfe0ff", opacity: flash * 0.35, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

/** Stairwell seen through the open front door, with a flickering bulb. */
export const Stairwell: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = random(`bulb-${Math.floor(frame / 3)}`) > 0.12 ? 1 : 0.35;
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <defs>
          <radialGradient id="bulb" cx="0.5" cy="0.22" r="0.7">
            <stop offset="0" stopColor="#d8f0c8" stopOpacity={0.55} />
            <stop offset="1" stopColor="#0b120e" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="#0d1411" />
        {/* stairs */}
        {new Array(9).fill(0).map((_, i) => (
          <rect key={i} x={620 + i * 30} y={1720 - i * 70} width={400} height={70} fill={i % 2 ? "#1a231e" : "#151d19"} />
        ))}
        <path d="M 600 1700 L 1000 1060" stroke="#3b4a40" strokeWidth={10} />
        {new Array(7).fill(0).map((_, i) => (
          <path key={i} d={`M ${640 + i * 54} ${1640 - i * 88} V ${1720 - i * 88 + 40}`} stroke="#2c3832" strokeWidth={6} />
        ))}
        <rect width={W} height={H} fill="url(#bulb)" opacity={flicker} />
        <circle cx={540} cy={420} r={18} fill="#eaffd8" opacity={flicker} />
        <path d="M 540 300 V 402" stroke="#222" strokeWidth={4} />
      </svg>
    </AbsoluteFill>
  );
};

/** Inside of the apartment entrance: wall, door frame and an opening door. open: 0..1 */
export const FrontDoor: React.FC<{ open: number; children?: React.ReactNode }> = ({ open, children }) => {
  const doorX = 250;
  const doorY = 360;
  const doorW = 580;
  const doorH = 1370;
  return (
    <AbsoluteFill>
      {/* outside (visible through the opening) */}
      <div
        style={{
          position: "absolute",
          left: doorX,
          top: doorY,
          width: doorW,
          height: doorH,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: -doorX, top: -doorY, width: W, height: H }}>
          <Stairwell />
          {children}
        </div>
      </div>
      {/* interior wall with a hole for the door */}
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="hallWall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3d3329" />
            <stop offset="0.5" stopColor="#4f4234" />
            <stop offset="1" stopColor="#3a3027" />
          </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          d={`M 0 0 H ${W} V ${H} H 0 Z M ${doorX} ${doorY} V ${doorY + doorH} H ${doorX + doorW} V ${doorY} Z`}
          fill="url(#hallWall)"
        />
        <rect x={0} y={1730} width={W} height={190} fill="#2a2019" />
        <rect x={doorX - 34} y={doorY - 34} width={doorW + 68} height={doorH + 34} fill="none" stroke="#6b5440" strokeWidth={34} />
        <rect x={doorX - 52} y={doorY - 52} width={doorW + 104} height={doorH + 52} fill="none" stroke="#1b1412" strokeWidth={4} />
        {/* coat hook with an empty hanger */}
        <path d="M 940 760 v 40 q 0 20 -20 20" stroke="#2b2420" strokeWidth={8} fill="none" />
        <path d="M 905 830 l 35 -16 l 35 16 z" fill="none" stroke="#8a7a6a" strokeWidth={4} />
        {/* light spill on floor */}
        <path
          d={`M ${doorX} 1730 L ${doorX + doorW} 1730 L ${doorX + doorW + 260} 1920 L ${doorX - 200} 1920 Z`}
          fill="#d8f0c8"
          opacity={open * 0.18}
        />
      </svg>
      {/* the door leaf itself, hinged on the left */}
      <div
        style={{
          position: "absolute",
          left: doorX,
          top: doorY,
          width: doorW,
          height: doorH,
          perspective: 1800,
          perspectiveOrigin: "0% 50%",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transformOrigin: "0% 50%",
            transform: `rotateY(${-open * 105}deg)`,
            background: "linear-gradient(90deg, #6e4b33, #7d573c 60%, #6a4730)",
            border: "5px solid #1b1412",
            boxSizing: "border-box",
            filter: `brightness(${1 - open * 0.4})`,
          }}
        >
          <div style={{ position: "absolute", left: 60, top: 80, right: 60, height: 520, border: "6px solid #553722", borderRadius: 8 }} />
          <div style={{ position: "absolute", left: 60, top: 700, right: 60, height: 560, border: "6px solid #553722", borderRadius: 8 }} />
          <div style={{ position: "absolute", right: 40, top: 660, width: 70, height: 26, borderRadius: 13, background: "#c9a75a", border: "4px solid #1b1412" }} />
          <div style={{ position: "absolute", left: "50%", top: 300, width: 34, height: 34, marginLeft: -17, borderRadius: 17, background: "#222", border: "5px solid #c9a75a" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Dark corridor behind Zeynep, cold moonlight from the side. */
export const Corridor: React.FC<{ flash?: number }> = ({ flash = 0 }) => {
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <defs>
          <linearGradient id="corr" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#131b25" />
            <stop offset="0.5" stopColor="#1f2c3b" />
            <stop offset="1" stopColor="#0e141c" />
          </linearGradient>
          <linearGradient id="moon" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9fc0e8" stopOpacity={0.35} />
            <stop offset="1" stopColor="#9fc0e8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#corr)" />
        {/* perspective corridor */}
        <path d="M 0 0 L 360 560 L 360 1360 L 0 1920 Z" fill="#0f161f" />
        <path d="M 1080 0 L 720 560 L 720 1360 L 1080 1920 Z" fill="#17212d" />
        <path d="M 360 1360 L 720 1360 L 1080 1920 L 0 1920 Z" fill="#1b1612" />
        <rect x={360} y={560} width={360} height={800} fill="#0a0f15" />
        <rect x={440} y={700} width={200} height={660} fill="#151c26" stroke="#000" strokeWidth={4} />
        {/* side door frames */}
        <path d="M 90 360 L 250 600 L 250 1300 L 90 1500 Z" fill="#1a232f" stroke="#000" strokeWidth={4} />
        <path d="M 990 360 L 830 600 L 830 1300 L 990 1500 Z" fill="#202b38" stroke="#000" strokeWidth={4} />
        <path d="M 1080 200 L 600 1920 L 1080 1920 Z" fill="url(#moon)" />
      </svg>
      <AbsoluteFill style={{ backgroundColor: "#cfe0ff", opacity: flash * 0.3, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

/** Lightning envelope helper: returns 0..1 for a double-strike flash starting at `at`. */
export const lightning = (frame: number, at: number) =>
  interpolate(frame - at, [0, 2, 5, 8, 10, 22], [0, 1, 0.2, 0.9, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
