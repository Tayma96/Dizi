/* Furniture & set pieces. All drawn in a 1080x1920 coordinate space, placed via x/y (top-left) and s (scale). */
import React from "react";
import { random, useCurrentFrame } from "remotion";

export const O = "#1b1412";
const sw = 5;
type P = { x: number; y: number; s?: number; c?: string; c2?: string };
const G: React.FC<P & { children: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>{children}</g>
);

export type TimeOfDay = "gunduz" | "aksam" | "gece";
export const SKY: Record<TimeOfDay, [string, string]> = {
  gunduz: ["#9fd0f0", "#e2f2fb"],
  aksam: ["#f0a26a", "#f6d49a"],
  gece: ["#0b1626", "#1d3552"],
};

export const WindowView: React.FC<P & { w: number; h: number; time: TimeOfDay; rain?: boolean; city?: boolean; id: string; flash?: number }> = ({
  x, y, w, h, time, rain, city = true, id, flash = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SKY[time][0]} />
          <stop offset="1" stopColor={SKY[time][1]} />
        </linearGradient>
        <clipPath id={`win-${id}`}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#sky-${id})`} />
      <g clipPath={`url(#win-${id})`}>
        {time === "gunduz" ? <circle cx={x + w * 0.75} cy={y + h * 0.2} r={40} fill="#fff6c8" opacity={0.9} /> : null}
        {time === "gece" ? <circle cx={x + w * 0.78} cy={y + h * 0.16} r={26} fill="#f2f0e0" opacity={0.85} /> : null}
        {city
          ? new Array(8).fill(0).map((_, i) => {
              const bw = 50 + random(`${id}-bw-${i}`) * 70;
              const bh = h * (0.25 + random(`${id}-bh-${i}`) * 0.5);
              const bx = x + i * (w / 7) - 20;
              const dark = time === "gece";
              return (
                <g key={i}>
                  <rect x={bx} y={y + h - bh} width={bw} height={bh} fill={dark ? "#14202f" : time === "aksam" ? "#7a5a5a" : "#9db4c8"} />
                  {new Array(8).fill(0).map((__, j) =>
                    random(`${id}-l-${i}-${j}`) > (dark ? 0.6 : 0.85) ? (
                      <rect key={j} x={bx + 8 + (j % 3) * 16} y={y + h - bh + 16 + Math.floor(j / 3) * 30} width={9} height={14} fill={dark ? "#ffd27a" : "#e8f0f8"} opacity={0.8} />
                    ) : null,
                  )}
                </g>
              );
            })
          : null}
        {rain
          ? new Array(50).fill(0).map((_, i) => {
              const rx = x + random(`${id}-rx-${i}`) * w;
              const ry = y + ((random(`${id}-ry-${i}`) * h + frame * 40) % h);
              return <line key={i} x1={rx} y1={ry} x2={rx - 6} y2={ry + 36} stroke="#a9c6e8" strokeWidth={2} opacity={0.6} />;
            })
          : null}
        <rect x={x} y={y} width={w} height={h} fill="#e8f0ff" opacity={flash * 0.8} />
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#e8e0d0" strokeWidth={20} />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={O} strokeWidth={4} />
      <path d={`M ${x + w / 2} ${y} V ${y + h} M ${x} ${y + h * 0.42} H ${x + w}`} stroke="#e8e0d0" strokeWidth={14} />
      <rect x={x - 26} y={y + h} width={w + 52} height={24} fill="#d6ccb8" stroke={O} strokeWidth={4} />
    </g>
  );
};

export const Curtains: React.FC<{ x: number; y: number; w: number; h: number; c: string; c2: string }> = ({ x, y, w, h, c, c2 }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 30) * 5;
  const one = (cx: number, flip: number) => (
    <g>
      <path d={`M ${cx} ${y} L ${cx + 130 * flip} ${y} Q ${cx + 100 * flip + sway} ${y + h / 2} ${cx + 70 * flip + sway} ${y + h} L ${cx - 10 * flip} ${y + h} Q ${cx + 10 * flip} ${y + h / 2} ${cx} ${y} Z`} fill={c} stroke={O} strokeWidth={4} />
      <path d={`M ${cx + 45 * flip} ${y + 10} Q ${cx + 50 * flip} ${y + h / 2} ${cx + 30 * flip} ${y + h - 6}`} stroke={c2} strokeWidth={9} fill="none" />
    </g>
  );
  return (
    <g>
      {one(x - 60, 1)}
      {one(x + w + 60, -1)}
      <rect x={x - 90} y={y - 16} width={w + 180} height={18} rx={9} fill="#5a4334" stroke={O} strokeWidth={4} />
    </g>
  );
};

export const Sofa: React.FC<P> = ({ x, y, s, c = "#6d4f3a", c2 = "#7d5c44" }) => (
  <G x={x} y={y} s={s}>
    <rect x={0} y={0} width={620} height={220} rx={40} fill={c} stroke={O} strokeWidth={sw} />
    <rect x={-30} y={120} width={110} height={240} rx={40} fill={c} stroke={O} strokeWidth={sw} />
    <rect x={540} y={120} width={110} height={240} rx={40} fill={c} stroke={O} strokeWidth={sw} />
    <rect x={40} y={170} width={540} height={150} rx={28} fill={c2} stroke={O} strokeWidth={sw} />
    <path d="M 310 180 V 316" stroke={O} strokeWidth={3} opacity={0.5} />
    <rect x={60} y={300} width={20} height={60} fill={O} />
    <rect x={540} y={300} width={20} height={60} fill={O} />
  </G>
);

export const Armchair: React.FC<P> = ({ x, y, s, c = "#8a5a3a", c2 = "#9a6a48" }) => (
  <G x={x} y={y} s={s}>
    <rect x={20} y={0} width={300} height={230} rx={50} fill={c} stroke={O} strokeWidth={sw} />
    <rect x={-10} y={120} width={90} height={220} rx={36} fill={c} stroke={O} strokeWidth={sw} />
    <rect x={260} y={120} width={90} height={220} rx={36} fill={c} stroke={O} strokeWidth={sw} />
    <rect x={60} y={180} width={220} height={130} rx={26} fill={c2} stroke={O} strokeWidth={sw} />
  </G>
);

export const CoffeeTable: React.FC<P> = ({ x, y, s, c = "#5a3e2c" }) => (
  <G x={x} y={y} s={s}>
    <ellipse cx={180} cy={20} rx={190} ry={36} fill={c} stroke={O} strokeWidth={sw} />
    <path d="M 40 40 L 30 150 M 320 40 L 330 150 M 180 56 L 180 160" stroke={O} strokeWidth={10} />
    <rect x={120} y={-10} width={36} height={22} rx={4} fill="#f4eee4" stroke={O} strokeWidth={3} />
    <path d="M 200 4 h 60 v 8 h -60 z" fill="#b33" stroke={O} strokeWidth={2} />
  </G>
);

export const DiningTable: React.FC<P & { chairs?: boolean }> = ({ x, y, s, c = "#7a5236", chairs = true }) => (
  <G x={x} y={y} s={s}>
    {chairs ? (
      <>
        <path d="M 40 -160 h 110 v 300 M 40 -160 v 300" stroke={O} strokeWidth={10} fill="none" />
        <rect x={40} y={-160} width={110} height={120} rx={10} fill="#8a5e3e" stroke={O} strokeWidth={4} />
        <rect x={550} y={-160} width={110} height={120} rx={10} fill="#8a5e3e" stroke={O} strokeWidth={4} />
        <path d="M 550 -160 v 300 M 660 -160 v 300" stroke={O} strokeWidth={10} />
      </>
    ) : null}
    <rect x={0} y={0} width={700} height={36} rx={8} fill={c} stroke={O} strokeWidth={sw} />
    <path d="M 40 36 V 280 M 660 36 V 280" stroke={O} strokeWidth={16} />
    <ellipse cx={200} cy={-6} rx={60} ry={14} fill="#f4f0e8" stroke={O} strokeWidth={3} />
    <ellipse cx={480} cy={-6} rx={60} ry={14} fill="#f4f0e8" stroke={O} strokeWidth={3} />
    <path d="M 330 -50 l 20 0 l 6 50 l -32 0 z" fill="#cde6f0" stroke={O} strokeWidth={3} />
  </G>
);

export const Kitchen: React.FC<P & { night?: boolean }> = ({ x, y, s, c = "#e7d9bd", c2 = "#cfbf9f" }) => (
  <G x={x} y={y} s={s}>
    {/* upper cabinets */}
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={i * 170} y={0} width={160} height={240} fill={c} stroke={O} strokeWidth={4} />
        <circle cx={i * 170 + (i % 2 ? 20 : 140)} cy={210} r={7} fill={O} />
      </g>
    ))}
    {/* tiles */}
    <rect x={0} y={260} width={680} height={260} fill="#f2efe8" stroke={O} strokeWidth={3} />
    {new Array(6).fill(0).map((_, i) => (
      <path key={i} d={`M 0 ${300 + i * 40} H 680`} stroke="#d8d2c6" strokeWidth={2} />
    ))}
    {/* counter */}
    <rect x={-20} y={520} width={720} height={36} fill="#5a5450" stroke={O} strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={i * 170} y={556} width={160} height={300} fill={c2} stroke={O} strokeWidth={4} />
        <circle cx={i * 170 + 80} cy={600} r={7} fill={O} />
      </g>
    ))}
    {/* stove + pot */}
    <rect x={360} y={510} width={140} height={12} fill="#2a2a2a" />
    <path d="M 380 440 h 100 v 70 h -100 z" fill="#8a8f96" stroke={O} strokeWidth={4} />
    <path d="M 370 440 h 120" stroke={O} strokeWidth={8} />
    {/* sink */}
    <path d="M 60 520 q 0 -40 40 -40" stroke="#9aa3ab" strokeWidth={8} fill="none" />
    {/* fridge */}
    <rect x={720} y={60} width={220} height={796} rx={16} fill="#e9eef2" stroke={O} strokeWidth={sw} />
    <path d="M 720 360 H 940" stroke={O} strokeWidth={4} />
    <rect x={740} y={240} width={12} height={90} rx={6} fill="#9aa3ab" />
    <rect x={740} y={390} width={12} height={120} rx={6} fill="#9aa3ab" />
    <rect x={800} y={140} width={50} height={60} fill="#f2c14e" transform="rotate(-6 825 170)" />
  </G>
);

export const Bed: React.FC<P> = ({ x, y, s, c = "#e8e2f0", c2 = "#8a7aa8" }) => (
  <G x={x} y={y} s={s}>
    <rect x={0} y={-180} width={760} height={260} rx={24} fill="#6a4a36" stroke={O} strokeWidth={sw} />
    <rect x={0} y={60} width={760} height={200} rx={10} fill="#f4f0ea" stroke={O} strokeWidth={sw} />
    <rect x={60} y={20} width={260} height={90} rx={40} fill="#fff" stroke={O} strokeWidth={4} />
    <rect x={440} y={20} width={260} height={90} rx={40} fill="#fff" stroke={O} strokeWidth={4} />
    <path d="M 0 140 Q 380 110 760 140 L 760 260 L 0 260 Z" fill={c2} stroke={O} strokeWidth={4} />
    <path d="M 0 260 H 760 V 330 H 0 Z" fill="#5a3e2c" stroke={O} strokeWidth={4} />
  </G>
);

export const Wardrobe: React.FC<P> = ({ x, y, s, c = "#8a6248" }) => (
  <G x={x} y={y} s={s}>
    <rect x={0} y={0} width={360} height={820} rx={8} fill={c} stroke={O} strokeWidth={sw} />
    <path d="M 180 0 V 820" stroke={O} strokeWidth={4} />
    <circle cx={160} cy={420} r={8} fill="#d9b45a" />
    <circle cx={200} cy={420} r={8} fill="#d9b45a" />
    <rect x={20} y={40} width={140} height={340} rx={6} fill="none" stroke="#00000033" strokeWidth={4} />
    <rect x={200} y={40} width={140} height={340} rx={6} fill="none" stroke="#00000033" strokeWidth={4} />
  </G>
);

export const Desk: React.FC<P & { laptop?: boolean }> = ({ x, y, s, c = "#6a4a36", laptop = true }) => (
  <G x={x} y={y} s={s}>
    <rect x={0} y={0} width={620} height={32} fill={c} stroke={O} strokeWidth={sw} />
    <rect x={20} y={32} width={180} height={300} fill={c} stroke={O} strokeWidth={4} />
    <path d="M 40 120 h 140 M 40 220 h 140" stroke={O} strokeWidth={3} />
    <path d="M 590 32 V 332" stroke={O} strokeWidth={14} />
    {laptop ? (
      <g>
        <path d="M 280 0 L 300 -150 L 500 -150 L 520 0 Z" fill="#3a3f48" stroke={O} strokeWidth={4} />
        <path d="M 304 -138 L 496 -138 L 512 -12 L 288 -12 Z" fill="#7aa0d0" opacity={0.85} />
        <rect x={260} y={-8} width={280} height={12} rx={4} fill="#9aa0a8" stroke={O} strokeWidth={3} />
      </g>
    ) : null}
    <rect x={100} y={-60} width={46} height={60} rx={6} fill="#f4eee4" stroke={O} strokeWidth={3} />
  </G>
);

export const Bookshelf: React.FC<P> = ({ x, y, s, c = "#6a4a36" }) => (
  <G x={x} y={y} s={s}>
    <rect x={0} y={0} width={300} height={700} fill={c} stroke={O} strokeWidth={sw} />
    {[0, 1, 2, 3].map((r) => (
      <g key={r}>
        <rect x={14} y={20 + r * 170} width={272} height={150} fill="#3a2a20" />
        {new Array(9).fill(0).map((_, i) => {
          const h = 90 + random(`bk-${r}-${i}`) * 50;
          const colors = ["#b33", "#3a6a9a", "#d9a441", "#4a7a5a", "#7a4a8a", "#e8dcc6"];
          return <rect key={i} x={20 + i * 29} y={20 + r * 170 + 150 - h} width={24} height={h} fill={colors[(i + r) % colors.length]} stroke={O} strokeWidth={2} />;
        })}
      </g>
    ))}
  </G>
);

export const Plant: React.FC<P> = ({ x, y, s }) => (
  <G x={x} y={y} s={s}>
    {[-40, -15, 10, 35, -60, 55].map((a, i) => (
      <ellipse key={i} cx={60 + a * 1.2} cy={-60 - (i % 3) * 40} rx={26} ry={70} fill={i % 2 ? "#4a8a4a" : "#3a7a3a"} stroke={O} strokeWidth={3} transform={`rotate(${a} ${60 + a * 1.2} ${-20})`} />
    ))}
    <path d="M 0 0 L 120 0 L 100 130 L 20 130 Z" fill="#c4704a" stroke={O} strokeWidth={4} />
  </G>
);

export const FloorLamp: React.FC<P & { on?: boolean }> = ({ x, y, s, on = true }) => {
  const frame = useCurrentFrame();
  const fl = on ? 0.85 + random(`fl-${Math.floor(frame / 5)}`) * 0.08 : 0;
  return (
    <G x={x} y={y} s={s}>
      <defs>
        <radialGradient id="lampGlowP">
          <stop offset="0" stopColor="#ffcc7a" stopOpacity={0.55} />
          <stop offset="1" stopColor="#ffcc7a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={80} cy={60} r={460} fill="url(#lampGlowP)" opacity={fl} />
      <path d="M 80 120 V 720" stroke="#2c2622" strokeWidth={10} />
      <ellipse cx={80} cy={724} rx={60} ry={14} fill="#2c2622" />
      <path d="M 0 120 L 160 120 L 130 0 L 30 0 Z" fill={on ? "#f3d9a0" : "#8a7a60"} stroke={O} strokeWidth={5} />
    </G>
  );
};

export const CeilingLamp: React.FC<P & { on?: boolean }> = ({ x, y, s, on = true }) => (
  <G x={x} y={y} s={s}>
    <path d="M 0 0 V 140" stroke={O} strokeWidth={4} />
    <path d="M -90 220 L 90 220 L 50 140 L -50 140 Z" fill={on ? "#f6e2a8" : "#bba"} stroke={O} strokeWidth={4} />
    {on ? <path d="M -90 220 L -300 900 L 300 900 L 90 220 Z" fill="#fff2c8" opacity={0.08} /> : null}
  </G>
);

export const Frame: React.FC<P & { w?: number; h?: number; art?: "aile" | "manzara" | "yirtik" | "portre" }> = ({ x, y, s, w = 260, h = 190, art = "manzara" }) => (
  <G x={x} y={y} s={s}>
    <rect x={0} y={0} width={w} height={h} fill="#6b5340" stroke={O} strokeWidth={5} />
    <rect x={16} y={16} width={w - 32} height={h - 32} fill={art === "manzara" ? "#bfe0f0" : "#e6d8bc"} stroke={O} strokeWidth={3} />
    {art === "manzara" ? <path d={`M 16 ${h - 16} L ${w * 0.35} ${h * 0.4} L ${w * 0.55} ${h * 0.65} L ${w * 0.75} ${h * 0.35} L ${w - 16} ${h - 16} Z`} fill="#6a9a5a" /> : null}
    {art === "aile" || art === "yirtik"
      ? [0.3, 0.5, 0.7].map((p, i) => (art === "yirtik" && i === 2 ? null : <circle key={i} cx={w * p} cy={h * 0.45} r={16} fill={["#c58d6e", "#e2a982", "#9a958f"][i]} />))
      : null}
    {art === "yirtik" ? <path d={`M ${w * 0.62} 16 L ${w * 0.68} ${h * 0.3} L ${w * 0.6} ${h * 0.55} L ${w * 0.7} ${h - 16} L ${w - 16} ${h - 16} L ${w - 16} 16 Z`} fill="#6b5340" /> : null}
    {art === "portre" ? <g><circle cx={w / 2} cy={h * 0.42} r={26} fill="#d9a47c" /><path d={`M ${w / 2 - 50} ${h - 16} Q ${w / 2} ${h * 0.5} ${w / 2 + 50} ${h - 16} Z`} fill="#3a3a4a" /></g> : null}
  </G>
);

export const WallClock: React.FC<P & { hour?: number }> = ({ x, y, s, hour = 3 }) => {
  const frame = useCurrentFrame();
  return (
    <G x={x} y={y} s={s}>
      <circle cx={0} cy={0} r={70} fill="#efe6d4" stroke={O} strokeWidth={6} />
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={-2} y={-62} width={4} height={10} fill={O} transform={`rotate(${i * 30})`} />
      ))}
      <path d="M 0 0 L 0 -50" stroke={O} strokeWidth={5} strokeLinecap="round" />
      <path d="M 0 0 L 0 -34" stroke={O} strokeWidth={7} strokeLinecap="round" transform={`rotate(${hour * 30})`} />
      <path d="M 0 0 L 0 -56" stroke="#b33" strokeWidth={2} transform={`rotate(${frame * 6})`} />
      <circle r={6} fill={O} />
    </G>
  );
};

export const TV: React.FC<P & { on?: boolean }> = ({ x, y, s, on }) => {
  const frame = useCurrentFrame();
  return (
    <G x={x} y={y} s={s}>
      <rect x={0} y={0} width={420} height={250} rx={10} fill="#16181c" stroke={O} strokeWidth={sw} />
      <rect x={14} y={14} width={392} height={222} fill={on ? `hsl(${(frame * 3) % 360} 40% 45%)` : "#23262c"} />
      <path d="M 180 250 L 160 300 M 240 250 L 260 300" stroke={O} strokeWidth={8} />
      <rect x={-40} y={300} width={500} height={140} fill="#5a3e2c" stroke={O} strokeWidth={4} />
    </G>
  );
};

export const Rug: React.FC<P & { w?: number }> = ({ x, y, s, c = "#8a2f2f", c2 = "#d9a441", w = 760 }) => (
  <G x={x} y={y} s={s}>
    <path d={`M 80 0 L ${w - 80} 0 L ${w} 160 L 0 160 Z`} fill={c} stroke={O} strokeWidth={4} />
    <path d={`M 120 30 L ${w - 120} 30 L ${w - 50} 130 L 50 130 Z`} fill="none" stroke={c2} strokeWidth={6} />
    <path d={`M ${w / 2 - 60} 80 L ${w / 2} 50 L ${w / 2 + 60} 80 L ${w / 2} 110 Z`} fill={c2} />
  </G>
);

export const Door: React.FC<P & { open?: number; w?: number; h?: number }> = ({ x, y, s, c = "#7d573c", w = 300, h = 640, open = 0 }) => (
  <G x={x} y={y} s={s}>
    <rect x={-20} y={-20} width={w + 40} height={h + 20} fill="#e2d6c0" stroke={O} strokeWidth={4} />
    <rect x={0} y={0} width={w} height={h} fill="#141414" />
    <g transform={`translate(0 0) scale(${1 - open * 0.85} 1)`}>
      <rect x={0} y={0} width={w} height={h} fill={c} stroke={O} strokeWidth={sw} />
      <rect x={30} y={40} width={w - 60} height={240} rx={6} fill="none" stroke="#00000044" strokeWidth={5} />
      <rect x={30} y={330} width={w - 60} height={270} rx={6} fill="none" stroke="#00000044" strokeWidth={5} />
      <circle cx={w - 40} cy={h * 0.52} r={12} fill="#d9b45a" stroke={O} strokeWidth={3} />
    </g>
  </G>
);

export const HospitalBed: React.FC<P> = ({ x, y, s }) => {
  const frame = useCurrentFrame();
  const beat = (frame % 30) / 30;
  return (
    <G x={x} y={y} s={s}>
      {/* monitor */}
      <rect x={760} y={-420} width={200} height={150} rx={10} fill="#1a1e24" stroke={O} strokeWidth={4} />
      <path d={`M 772 -340 h ${40 + beat * 20} l 10 -40 l 12 70 l 10 -30 h ${100 - beat * 20}`} fill="none" stroke="#5ef08a" strokeWidth={4} />
      <path d="M 860 -270 V 300" stroke="#8a9098" strokeWidth={10} />
      {/* IV */}
      <path d="M -60 -500 V 300" stroke="#8a9098" strokeWidth={8} />
      <rect x={-90} y={-500} width={60} height={90} rx={14} fill="#dff0ff" stroke={O} strokeWidth={3} opacity={0.9} />
      <path d="M -60 -410 Q -40 -100 60 40" stroke="#c8e0f0" strokeWidth={3} fill="none" />
      {/* bed */}
      <rect x={0} y={-80} width={60} height={300} rx={8} fill="#c8d0d8" stroke={O} strokeWidth={4} />
      <rect x={20} y={40} width={700} height={140} rx={12} fill="#f4f6f8" stroke={O} strokeWidth={sw} />
      <rect x={40} y={0} width={220} height={70} rx={30} fill="#fff" stroke={O} strokeWidth={4} />
      <path d="M 260 60 Q 480 30 720 60 L 720 180 L 260 180 Z" fill="#a8c8e0" stroke={O} strokeWidth={4} />
      <path d="M 60 180 V 320 M 680 180 V 320" stroke="#8a9098" strokeWidth={12} />
    </G>
  );
};

export const StreetLamp: React.FC<P & { on?: boolean }> = ({ x, y, s, on }) => (
  <G x={x} y={y} s={s}>
    {on ? <path d="M 60 30 L -200 900 L 320 900 Z" fill="#ffe7a8" opacity={0.12} /> : null}
    <path d="M 0 0 V 900" stroke="#2a2e34" strokeWidth={16} />
    <path d="M 0 10 Q 30 -20 70 10" stroke="#2a2e34" strokeWidth={10} fill="none" />
    <path d="M 40 10 L 100 10 L 90 40 L 50 40 Z" fill={on ? "#ffe7a8" : "#9aa"} stroke={O} strokeWidth={3} />
  </G>
);

export const Car: React.FC<P> = ({ x, y, s, c = "#b33a3a" }) => (
  <G x={x} y={y} s={s}>
    <path d="M 0 120 L 30 60 L 140 50 L 220 0 L 470 0 L 560 60 L 680 80 L 700 160 L 0 160 Z" fill={c} stroke={O} strokeWidth={sw} />
    <path d="M 240 14 L 340 14 L 340 60 L 180 60 Z M 360 14 L 460 14 L 530 60 L 360 60 Z" fill="#bcd4e6" stroke={O} strokeWidth={3} />
    <circle cx={150} cy={160} r={50} fill="#222" stroke={O} strokeWidth={4} />
    <circle cx={150} cy={160} r={20} fill="#999" />
    <circle cx={560} cy={160} r={50} fill="#222" stroke={O} strokeWidth={4} />
    <circle cx={560} cy={160} r={20} fill="#999" />
  </G>
);

export const Tree: React.FC<P & { dead?: boolean }> = ({ x, y, s, dead }) => (
  <G x={x} y={y} s={s}>
    <path d="M 60 0 L 50 -300 Q 30 -350 0 -380 M 50 -260 Q 80 -330 130 -360" stroke="#5a3e2c" strokeWidth={30} fill="none" strokeLinecap="round" />
    {!dead
      ? [
          [0, -420, 110],
          [120, -430, 120],
          [60, -520, 120],
          [-40, -330, 80],
          [160, -340, 90],
        ].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? "#4f8a4a" : "#3f7a3a"} stroke={O} strokeWidth={4} />)
      : null}
  </G>
);

export const Tombstone: React.FC<P & { text?: string }> = ({ x, y, s, c = "#9aa0a6" }) => (
  <G x={x} y={y} s={s}>
    <path d="M 0 260 L 0 80 Q 0 0 90 0 Q 180 0 180 80 L 180 260 Z" fill={c} stroke={O} strokeWidth={sw} />
    <path d="M 40 90 H 140 M 50 130 H 130 M 60 160 H 120" stroke="#5a6066" strokeWidth={6} />
    <rect x={-30} y={250} width={240} height={30} fill="#7a8086" stroke={O} strokeWidth={4} />
  </G>
);

export const Chalkboard: React.FC<P> = ({ x, y, s }) => (
  <G x={x} y={y} s={s}>
    <rect x={0} y={0} width={820} height={420} fill="#2f4a3a" stroke="#7a5236" strokeWidth={18} />
    <path d="M 60 80 q 40 -20 80 0 t 80 0 M 60 150 h 300 M 60 210 h 220 M 480 100 l 120 120 M 600 100 l -120 120" stroke="#e8f0e8" strokeWidth={6} opacity={0.75} fill="none" />
    <rect x={20} y={420} width={780} height={20} fill="#7a5236" />
  </G>
);

export const SchoolDesk: React.FC<P> = ({ x, y, s }) => (
  <G x={x} y={y} s={s}>
    <rect x={0} y={0} width={340} height={26} fill="#c8a070" stroke={O} strokeWidth={4} />
    <path d="M 20 26 V 220 M 320 26 V 220" stroke="#5a6a7a" strokeWidth={12} />
    <rect x={60} y={-14} width={90} height={14} fill="#3a6a9a" stroke={O} strokeWidth={2} />
  </G>
);

export const CafeCounter: React.FC<P> = ({ x, y, s }) => (
  <G x={x} y={y} s={s}>
    <rect x={0} y={-560} width={600} height={300} rx={10} fill="#2a2a2a" stroke="#7a5236" strokeWidth={12} />
    <path d="M 40 -500 h 220 M 40 -450 h 180 M 40 -400 h 200 M 340 -500 h 200 M 340 -450 h 160" stroke="#f2f2e8" strokeWidth={8} opacity={0.8} />
    <rect x={0} y={0} width={900} height={36} fill="#3a2a24" stroke={O} strokeWidth={4} />
    <rect x={20} y={36} width={860} height={300} fill="#8a5e3e" stroke={O} strokeWidth={4} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <path key={i} d={`M ${40 + i * 120} 50 V 320`} stroke="#6a4a30" strokeWidth={6} />
    ))}
    <rect x={560} y={-170} width={200} height={170} rx={10} fill="#b8bec6" stroke={O} strokeWidth={4} />
    <rect x={600} y={-130} width={120} height={50} fill="#2a2a2a" />
    <rect x={620} y={-40} width={40} height={40} fill="#f4eee4" stroke={O} strokeWidth={3} />
  </G>
);

export const CafeTable: React.FC<P> = ({ x, y, s }) => (
  <G x={x} y={y} s={s}>
    <ellipse cx={150} cy={0} rx={160} ry={30} fill="#e8e0d0" stroke={O} strokeWidth={4} />
    <path d="M 150 30 V 260 M 90 260 H 210" stroke="#2a2a2a" strokeWidth={12} />
    <path d="M 110 -40 h 40 l -4 36 h -32 z" fill="#f4eee4" stroke={O} strokeWidth={3} />
  </G>
);

export const Chandelier: React.FC<P> = ({ x, y, s }) => (
  <G x={x} y={y} s={s}>
    <path d="M 0 0 V 120" stroke="#c9a75a" strokeWidth={6} />
    <path d="M -160 160 Q 0 260 160 160" stroke="#c9a75a" strokeWidth={8} fill="none" />
    {[-160, -80, 0, 80, 160].map((cx, i) => (
      <g key={i}>
        <path d={`M ${cx} ${i === 2 ? 210 : 170} v -40`} stroke="#c9a75a" strokeWidth={5} />
        <ellipse cx={cx} cy={(i === 2 ? 210 : 170) - 50} rx={10} ry={16} fill="#fff4c8" />
        <circle cx={cx} cy={(i === 2 ? 210 : 170) - 50} r={40} fill="#fff4c8" opacity={0.15} />
      </g>
    ))}
  </G>
);

export const PoliceDesk: React.FC<P> = ({ x, y, s }) => (
  <G x={x} y={y} s={s}>
    <rect x={0} y={0} width={760} height={40} fill="#4a4a50" stroke={O} strokeWidth={4} />
    <rect x={20} y={40} width={720} height={300} fill="#6a6a72" stroke={O} strokeWidth={4} />
    <rect x={460} y={-160} width={220} height={160} rx={8} fill="#2a2e34" stroke={O} strokeWidth={4} />
    <rect x={476} y={-146} width={188} height={120} fill="#4a7aa0" />
    <rect x={80} y={-40} width={200} height={40} fill="#e8e0c8" stroke={O} strokeWidth={3} transform="rotate(-4 180 -20)" />
  </G>
);

/* ---------------- İmza: tımarhane odası (hücre) varlıkları ---------------- */

/** Demir karyola (yandan): ince borular, ince şilte, yastık. Battaniye ön katmanda (IronBedBlanket). */
export const IronBed: React.FC<P> = ({ x, y, s }) => {
  const tube = "#5c646a";
  return (
    <G x={x} y={y} s={s}>
      {/* başlık (sol) */}
      {[10, 50].map((tx) => <rect key={tx} x={tx} y={-190} width={16} height={450} rx={8} fill={tube} stroke={O} strokeWidth={4} />)}
      {[-150, -60].map((ry) => <rect key={ry} x={10} y={ry} width={56} height={12} rx={6} fill={tube} stroke={O} strokeWidth={3} />)}
      {/* ayakucu (sağ) */}
      {[800, 840].map((tx) => <rect key={tx} x={tx} y={-60} width={16} height={320} rx={8} fill={tube} stroke={O} strokeWidth={4} />)}
      <rect x={800} y={-30} width={56} height={12} rx={6} fill={tube} stroke={O} strokeWidth={3} />
      {/* yan ray + ayaklar */}
      <rect x={26} y={80} width={800} height={18} rx={8} fill={tube} stroke={O} strokeWidth={4} />
      {[120, 720].map((lx) => <rect key={lx} x={lx} y={90} width={14} height={170} fill={tube} stroke={O} strokeWidth={3} />)}
      {/* şilte + yastık */}
      <rect x={30} y={0} width={790} height={82} rx={14} fill="#e2e5e1" stroke={O} strokeWidth={sw} />
      <path d="M 40 58 H 810" stroke="#c9ceca" strokeWidth={6} />
      <rect x={52} y={-46} width={230} height={66} rx={30} fill="#f2f3ef" stroke={O} strokeWidth={4} />
      <path d="M 90 -20 Q 160 -34 240 -18" stroke="#d6d9d4" strokeWidth={5} fill="none" />
    </G>
  );
};

/** Battaniye: karakterin gövdesini (yatarken) ve bacaklarını (doğrulunca) örter; yatağın yanından sarkar. */
export const IronBedBlanket: React.FC<P> = ({ x, y, s }) => (
  <G x={x} y={y} s={s}>
    {/* gövdeyi örten kısım + sağa uzanan bacak kabarıklığı (yatarken de otururken de bacaklar altında) */}
    <path d="M -10 30 Q -16 -40 40 -58 Q 120 -76 210 -66 Q 300 -96 420 -84 Q 480 -78 500 -40 L 512 196 Q 250 214 -8 196 Z" fill="#8c979a" stroke={O} strokeWidth={sw} strokeLinejoin="round" />
    {/* üst kıvrım (katlanmış kenar) */}
    <path d="M -10 30 Q -16 -40 40 -58 Q 70 -30 60 20 Q 30 40 -10 30 Z" fill="#a2acae" stroke={O} strokeWidth={4} strokeLinejoin="round" />
    {/* diz/bacak kıvrımları */}
    <path d="M 210 -66 Q 230 -20 216 40 M 300 -86 Q 330 -40 320 30 M 420 -84 Q 440 -30 446 190 M 120 0 Q 130 100 110 190" stroke="#74808a" strokeWidth={4} fill="none" />
  </G>
);

/** Parmaklıklar: pencerenin önünde (kuş parmaklıkların arkasında kalır). */
export const WindowBars: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    {new Array(5).fill(0).map((_, i) => {
      const bx = x + ((i + 1) * w) / 6;
      return (
        <g key={i}>
          <rect x={bx - 7} y={y - 6} width={14} height={h + 12} rx={6} fill="#3e4448" stroke={O} strokeWidth={3} />
          <rect x={bx - 3} y={y} width={3} height={h} fill="#6e767c" />
        </g>
      );
    })}
    <rect x={x - 6} y={y + h * 0.5 - 8} width={w + 12} height={16} rx={6} fill="#3e4448" stroke={O} strokeWidth={3} />
  </g>
);

/** Serçe (yandan, sola bakar). flap: kanat açısı -1..1, fly: uçuyor, head: baş dönüşü -1..1 */
export const Bird: React.FC<{ x: number; y: number; s?: number; flap?: number; fly?: boolean; head?: number; tail?: number }> = ({ x, y, s = 1, flap = 0, fly = false, head = 0, tail = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* kuyruk */}
    <path d={`M 22 -6 L 62 ${-16 + tail * 6} L 60 ${2 + tail * 6} Z`} fill="#5a4636" stroke={O} strokeWidth={3} strokeLinejoin="round" />
    {/* bacaklar */}
    {!fly ? <path d="M -6 10 L -10 24 M 6 10 L 4 24 M -16 24 H -4 M -2 24 H 10" stroke="#8a6a4a" strokeWidth={3} strokeLinecap="round" /> : null}
    {/* gövde */}
    <ellipse cx={0} cy={-6} rx={28} ry={18} fill="#8a6a4e" stroke={O} strokeWidth={3} />
    <path d="M -24 0 Q -6 14 18 4 Q 0 18 -20 6 Z" fill="#e6d8c0" />
    {/* kanat */}
    {fly ? (
      <path d={`M -6 -12 Q 6 ${-12 - 46 * flap} 34 ${-14 - 40 * flap} Q 18 -6 -6 -12 Z`} fill="#6e5440" stroke={O} strokeWidth={3} strokeLinejoin="round" />
    ) : (
      <path d="M -10 -14 Q 14 -22 32 -8 Q 12 2 -10 -6 Z" fill="#6e5440" stroke={O} strokeWidth={3} strokeLinejoin="round" />
    )}
    {/* baş */}
    <g transform={`translate(-24 -20) scale(${head > 0.5 ? -1 : 1} 1)`}>
      <circle cx={0} cy={0} r={14} fill="#7a5c44" stroke={O} strokeWidth={3} />
      <path d="M -6 4 Q 0 12 8 6" stroke="#e6d8c0" strokeWidth={4} fill="none" />
      <path d="M -12 -2 L -24 2 L -12 5 Z" fill="#e2b04a" stroke={O} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={-5} cy={-3} r={3.2} fill="#120c0a" />
      <circle cx={-6} cy={-4} r={1} fill="#fff" />
    </g>
  </g>
);

/** Hücre kapısı: çelik, gözetleme penceresi, kollu. open 0..1 */
export const CellDoor: React.FC<P & { open?: number }> = ({ x, y, s, open = 0 }) => (
  <G x={x} y={y} s={s}>
    <rect x={-18} y={-18} width={336} height={658} fill="#aab4b2" stroke={O} strokeWidth={4} />
    {/* kapı ardı: aydınlık koridor (kapı açılınca görünür) */}
    <rect x={0} y={0} width={300} height={640} fill="#dfe4dc" />
    <rect x={0} y={520} width={300} height={120} fill="#b9c0b8" />
    <rect x={120} y={0} width={60} height={640} fill="#ffffff" opacity={0.35} />
    <g transform={`scale(${1 - open * 0.85} 1)`}>
      <rect x={0} y={0} width={300} height={640} fill="#87939a" stroke={O} strokeWidth={sw} />
      <rect x={70} y={70} width={160} height={110} rx={6} fill="#2a3236" stroke={O} strokeWidth={4} />
      {[100, 130, 160, 190].map((bx) => <rect key={bx} x={bx} y={70} width={8} height={110} fill="#4a5256" />)}
      {[40, 600].map((ry) => <rect key={ry} x={10} y={ry} width={280} height={6} fill="#76828a" />)}
      <rect x={24} y={300} width={22} height={60} rx={10} fill="#b8c0c4" stroke={O} strokeWidth={3} />
      <rect x={20} y={318} width={70} height={18} rx={9} fill="#c8d0d4" stroke={O} strokeWidth={3} />
    </g>
  </G>
);

/** Hücre saati: saat ve dakika ayarlı; saniye ibresi gerçek hızda */
export const HucreClock: React.FC<P & { time?: string }> = ({ x, y, s, time = "07:14" }) => {
  const frame = useCurrentFrame();
  const [h, m] = time.split(":").map(Number);
  return (
    <G x={x} y={y} s={s}>
      <circle cx={0} cy={0} r={62} fill="#e9e6dc" stroke={O} strokeWidth={6} />
      <circle cx={0} cy={0} r={52} fill="none" stroke="#c8c4b8" strokeWidth={2} />
      {new Array(12).fill(0).map((_, i) => (
        <rect key={i} x={-2} y={-54} width={4} height={i % 3 === 0 ? 13 : 8} fill={O} transform={`rotate(${i * 30})`} />
      ))}
      <path d="M 0 0 L 0 -32" stroke={O} strokeWidth={7} strokeLinecap="round" transform={`rotate(${(h % 12) * 30 + m * 0.5})`} />
      <path d="M 0 0 L 0 -46" stroke={O} strokeWidth={5} strokeLinecap="round" transform={`rotate(${m * 6})`} />
      <path d="M 0 8 L 0 -50" stroke="#b33" strokeWidth={2} transform={`rotate(${(frame / 30) * 6})`} />
      <circle r={5} fill={O} />
    </G>
  );
};

/** Duvara tırnakla kazınmış gün çentikleri + sayı (sahnenin içinde, Berkay'ın kendi saydığı günler) */
export const WallTally: React.FC<P & { groups?: number; text?: string }> = ({ x, y, s, groups = 8, text = "183" }) => (
  <G x={x} y={y} s={s}>
    {new Array(groups).fill(0).map((_, g) => {
      const gx = (g % 4) * 62;
      const gy = Math.floor(g / 4) * 64;
      return (
        <g key={g} transform={`translate(${gx} ${gy}) rotate(${(g % 3) - 1})`}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M ${i * 10} 0 L ${i * 10 + 2} 44`} stroke="#4c5a52" strokeWidth={4} strokeLinecap="round" />
              <path d={`M ${i * 10 + 2} 0 L ${i * 10 + 4} 44`} stroke="#e4ebe6" strokeWidth={1.5} opacity={0.7} />
            </g>
          ))}
          <path d="M -6 34 L 40 8" stroke="#4c5a52" strokeWidth={4} strokeLinecap="round" />
        </g>
      );
    })}
    <text x={260} y={110} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={64} fill="none" stroke="#3e4a44" strokeWidth={4} transform="rotate(-4 260 110)">
      {text}
    </text>
    <text x={262} y={108} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={64} fill="none" stroke="#e4ebe6" strokeWidth={1.2} opacity={0.6} transform="rotate(-4 262 108)">
      {text}
    </text>
  </G>
);

/** Tavan köşesinde güvenlik kamerası: kırmızı ışık yanıp söner */
export const SecurityCam: React.FC<P> = ({ x, y, s }) => {
  const frame = useCurrentFrame();
  const on = frame % 30 < 12;
  return (
    <G x={x} y={y} s={s}>
      <rect x={-8} y={-40} width={16} height={40} fill="#3a4044" stroke={O} strokeWidth={3} />
      <g transform="rotate(28)">
        <rect x={-70} y={-4} width={96} height={46} rx={8} fill="#d8dcde" stroke={O} strokeWidth={4} />
        <rect x={-86} y={4} width={20} height={30} rx={4} fill="#2a3034" stroke={O} strokeWidth={3} />
        <circle cx={-48} cy={30} r={6} fill={on ? "#ff2a2a" : "#5a1a1a"} />
        {on ? <circle cx={-48} cy={30} r={14} fill="#ff2a2a" opacity={0.3} /> : null}
      </g>
    </G>
  );
};

/** Havalandırma ızgarası */
export const VentGrille: React.FC<P> = ({ x, y, s }) => (
  <G x={x} y={y} s={s}>
    <rect x={0} y={0} width={150} height={90} rx={6} fill="#8a948e" stroke={O} strokeWidth={4} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={12} y={12 + i * 15} width={126} height={7} rx={3} fill="#2a302c" />)}
  </G>
);
