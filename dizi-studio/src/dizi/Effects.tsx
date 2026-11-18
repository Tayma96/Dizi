import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

/** Animated rain streaks. Fills its parent. */
export const Rain: React.FC<{
  count?: number;
  width: number;
  height: number;
  color?: string;
  speed?: number;
  opacity?: number;
  seed?: string;
}> = ({ count = 120, width, height, color = "#a9c6e8", speed = 70, opacity = 0.5, seed = "rain" }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      {new Array(count).fill(0).map((_, i) => {
        const x0 = random(`${seed}-x-${i}`) * (width + 200) - 100;
        const len = 30 + random(`${seed}-l-${i}`) * 50;
        const v = speed * (0.7 + random(`${seed}-v-${i}`) * 0.6);
        const y = ((random(`${seed}-y-${i}`) * (height + 200) + frame * v) % (height + 200)) - 100;
        const x = x0 - (y / height) * 60;
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x - len * 0.18}
            y2={y + len}
            stroke={color}
            strokeWidth={2 + random(`${seed}-w-${i}`) * 1.5}
            strokeLinecap="round"
            opacity={opacity * (0.4 + random(`${seed}-o-${i}`) * 0.6)}
          />
        );
      })}
    </svg>
  );
};

/** Subtle animated film grain + vignette for a cinematic finish. */
export const FilmFinish: React.FC<{ vignette?: number; grain?: number }> = ({ vignette = 0.55, grain = 0.07 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: grain, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 12} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
