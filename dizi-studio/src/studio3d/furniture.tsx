/* 3D mobilya ve dekor parçaları (yuvarlatılmış kutular + toon + mürekkep çizgisi). Birim: metre. */
import React from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { random, useCurrentFrame } from "remotion";
import { cached, flat, outline, toon } from "./toon";
import { clockFace, paintingTex, screenTex, windowView, type TimeOfDay } from "./textures";

type V3 = [number, number, number];
export type FP = { p?: V3; r?: number; s?: number };

const rbox = (x: number, y: number, z: number, rad = 0.03) =>
  cached(`rb-${x}-${y}-${z}-${rad}`, () => new RoundedBoxGeometry(x, y, z, 3, Math.min(rad, x / 2.1, y / 2.1, z / 2.1)));
const cylG = (r1: number, r2: number, h: number, seg = 20) => cached(`cy-${r1}-${r2}-${h}-${seg}`, () => new THREE.CylinderGeometry(r1, r2, h, seg));
const sphG = cached("f-sph", () => new THREE.SphereGeometry(1, 20, 14));
const planeG = cached("f-plane", () => new THREE.PlaneGeometry(1, 1));

/** Mürekkep çizgili toon parça */
export const B: React.FC<{ g: THREE.BufferGeometry; c: string; p?: V3; r?: V3; s?: V3 | number; line?: number }> = ({ g, c, p, r, s, line = 0.012 }) => (
  <group position={p} rotation={r} scale={s}>
    <mesh geometry={g} material={toon(c)} />
    {line > 0 ? <mesh geometry={g} material={outline(line)} /> : null}
  </group>
);
export const Box: React.FC<{ d: V3; c: string; p?: V3; r?: V3; rad?: number; line?: number }> = ({ d, c, p, r, rad = 0.03, line }) => <B g={rbox(d[0], d[1], d[2], rad)} c={c} p={p} r={r} line={line} />;
export const Cyl: React.FC<{ r1: number; r2?: number; h: number; c: string; p?: V3; r?: V3; line?: number }> = ({ r1, r2, h, c, p, r, line }) => <B g={cylG(r1, r2 ?? r1, h)} c={c} p={p} r={r} line={line} />;
export const Ball: React.FC<{ rad: V3 | number; c: string; p?: V3; line?: number }> = ({ rad, c, p, line }) => <B g={sphG} c={c} p={p} s={rad} line={line} />;
/** Işıktan etkilenmeyen dokulu düzlem (pencere manzarası, ekran, tablo) */
export const Pic: React.FC<{ tex: THREE.Texture; w: number; h: number; p?: V3; r?: V3; lit?: boolean }> = ({ tex, w, h, p, r, lit }) => (
  <mesh geometry={planeG} position={p} rotation={r} scale={[w, h, 1]}>
    {lit ? <meshToonMaterial map={tex} /> : <meshBasicMaterial map={tex} toneMapped={false} />}
  </mesh>
);

const G: React.FC<FP & { children: React.ReactNode }> = ({ p, r = 0, s = 1, children }) => (
  <group position={p} rotation={[0, (r * Math.PI) / 180, 0]} scale={s}>
    {children}
  </group>
);

/* ---------------- oturma ---------------- */
export const Sofa: React.FC<FP & { c?: string; c2?: string }> = ({ c = "#6d4f3a", c2 = "#7d5c44", ...f }) => (
  <G {...f}>
    <Box d={[2.0, 0.42, 0.85]} c={c} p={[0, 0.21, 0]} rad={0.08} />
    <Box d={[2.0, 0.55, 0.22]} c={c} p={[0, 0.65, -0.33]} rad={0.1} />
    <Box d={[0.22, 0.6, 0.85]} c={c} p={[-1.0, 0.4, 0]} rad={0.1} />
    <Box d={[0.22, 0.6, 0.85]} c={c} p={[1.0, 0.4, 0]} rad={0.1} />
    <Box d={[0.86, 0.14, 0.62]} c={c2} p={[-0.44, 0.48, 0.06]} rad={0.06} />
    <Box d={[0.86, 0.14, 0.62]} c={c2} p={[0.44, 0.48, 0.06]} rad={0.06} />
    <Box d={[0.4, 0.34, 0.12]} c="#c9a24a" p={[-0.7, 0.68, -0.15]} r={[-0.2, 0.3, 0.1]} rad={0.06} />
  </G>
);
export const Armchair: React.FC<FP & { c?: string }> = ({ c = "#8a5a3a", ...f }) => (
  <G {...f}>
    <Box d={[0.85, 0.42, 0.8]} c={c} p={[0, 0.21, 0]} rad={0.08} />
    <Box d={[0.85, 0.6, 0.2]} c={c} p={[0, 0.7, -0.3]} rad={0.1} />
    <Box d={[0.18, 0.55, 0.8]} c={c} p={[-0.42, 0.42, 0]} rad={0.08} />
    <Box d={[0.18, 0.55, 0.8]} c={c} p={[0.42, 0.42, 0]} rad={0.08} />
  </G>
);
export const Chair: React.FC<FP & { c?: string }> = ({ c = "#8a5e3e", ...f }) => (
  <G {...f}>
    <Box d={[0.45, 0.05, 0.45]} c={c} p={[0, 0.46, 0]} rad={0.015} />
    <Box d={[0.45, 0.5, 0.05]} c={c} p={[0, 0.72, -0.2]} rad={0.015} />
    {[[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]].map(([x, z], i) => <Box key={i} d={[0.04, 0.46, 0.04]} c={c} p={[x, 0.23, z]} rad={0.01} line={0.006} />)}
  </G>
);
export const Bench: React.FC<FP> = (f) => (
  <G {...f}>
    <Box d={[1.6, 0.06, 0.45]} c="#7a5236" p={[0, 0.45, 0]} rad={0.015} />
    <Box d={[1.6, 0.35, 0.05]} c="#7a5236" p={[0, 0.72, -0.22]} rad={0.015} />
    <Box d={[0.06, 0.45, 0.4]} c="#2a2a2a" p={[-0.7, 0.22, 0]} rad={0.01} />
    <Box d={[0.06, 0.45, 0.4]} c="#2a2a2a" p={[0.7, 0.22, 0]} rad={0.01} />
  </G>
);

/* ---------------- masalar ---------------- */
export const CoffeeTable: React.FC<FP> = (f) => (
  <G {...f}>
    <Cyl r1={0.5} h={0.05} c="#5a3e2c" p={[0, 0.4, 0]} />
    <Cyl r1={0.05} h={0.4} c="#3a2a20" p={[0, 0.2, 0]} />
    <Cyl r1={0.05} r2={0.04} h={0.09} c="#f4eee4" p={[-0.15, 0.47, 0.05]} line={0.006} />
    <Box d={[0.25, 0.03, 0.18]} c="#b33" p={[0.15, 0.44, 0]} rad={0.01} line={0.006} />
  </G>
);
export const DiningTable: React.FC<FP & { chairs?: boolean }> = ({ chairs = true, ...f }) => (
  <G {...f}>
    <Box d={[1.6, 0.06, 0.9]} c="#7a5236" p={[0, 0.76, 0]} rad={0.02} />
    {[[-0.72, -0.38], [0.72, -0.38], [-0.72, 0.38], [0.72, 0.38]].map(([x, z], i) => <Box key={i} d={[0.06, 0.74, 0.06]} c="#5a3a26" p={[x, 0.37, z]} rad={0.015} line={0.008} />)}
    <Cyl r1={0.14} h={0.02} c="#f4f0e8" p={[-0.4, 0.8, 0.1]} line={0.006} />
    <Cyl r1={0.14} h={0.02} c="#f4f0e8" p={[0.4, 0.8, 0.1]} line={0.006} />
    <Cyl r1={0.04} r2={0.035} h={0.12} c="#cde6f0" p={[0, 0.85, 0]} line={0.006} />
    {chairs ? (
      <>
        <Chair p={[-0.45, 0, -0.62]} />
        <Chair p={[0.45, 0, -0.62]} />
      </>
    ) : null}
  </G>
);
export const Desk: React.FC<FP & { laptop?: boolean }> = ({ laptop = true, ...f }) => {
  const frame = useCurrentFrame();
  return (
    <G {...f}>
      <Box d={[1.6, 0.05, 0.75]} c="#6a4a36" p={[0, 0.76, 0]} rad={0.015} />
      <Box d={[0.45, 0.72, 0.7]} c="#5a3e2c" p={[-0.55, 0.36, 0]} rad={0.02} />
      <Box d={[0.05, 0.72, 0.7]} c="#5a3e2c" p={[0.76, 0.36, 0]} rad={0.01} />
      {laptop ? (
        <group position={[0.15, 0.79, 0]}>
          <Box d={[0.42, 0.02, 0.3]} c="#9aa0a8" rad={0.008} line={0.005} />
          <group position={[0, 0.01, -0.15]} rotation={[-0.25, 0, 0]}>
            <Box d={[0.42, 0.28, 0.015]} c="#3a3f48" p={[0, 0.14, 0]} rad={0.008} line={0.005} />
            <Pic tex={screenTex("laptop", "laptop", frame)} w={0.38} h={0.24} p={[0, 0.14, 0.009]} />
          </group>
        </group>
      ) : null}
      <Cyl r1={0.04} h={0.1} c="#f4eee4" p={[-0.5, 0.84, 0.15]} line={0.006} />
    </G>
  );
};
export const SchoolDesk: React.FC<FP> = (f) => (
  <G {...f}>
    <Box d={[1.1, 0.04, 0.5]} c="#c8a070" p={[0, 0.72, 0]} rad={0.01} />
    <Box d={[0.04, 0.7, 0.45]} c="#5a6a7a" p={[-0.5, 0.35, 0]} rad={0.01} />
    <Box d={[0.04, 0.7, 0.45]} c="#5a6a7a" p={[0.5, 0.35, 0]} rad={0.01} />
    <Box d={[0.28, 0.03, 0.2]} c="#3a6a9a" p={[-0.2, 0.75, 0]} rad={0.005} line={0.005} />
  </G>
);
export const CafeTable: React.FC<FP> = (f) => (
  <G {...f}>
    <Cyl r1={0.38} h={0.04} c="#e8e0d0" p={[0, 0.74, 0]} />
    <Cyl r1={0.035} h={0.72} c="#2a2a2a" p={[0, 0.36, 0]} />
    <Cyl r1={0.22} h={0.03} c="#2a2a2a" p={[0, 0.015, 0]} />
    <Cyl r1={0.045} r2={0.035} h={0.08} c="#f4eee4" p={[0.1, 0.8, 0]} line={0.006} />
  </G>
);

/* ---------------- depolama ---------------- */
export const Bookshelf: React.FC<FP> = (f) => (
  <G {...f}>
    <Box d={[1.0, 2.0, 0.35]} c="#6a4a36" p={[0, 1.0, 0]} rad={0.02} />
    {[0, 1, 2, 3].map((r) => (
      <group key={r}>
        <Box d={[0.9, 0.38, 0.05]} c="#3a2a20" p={[0, 0.3 + r * 0.46, 0.13]} rad={0.005} line={0} />
        {Array.from({ length: 9 }).map((_, i) => {
          const h = 0.26 + random(`bk-${r}-${i}`) * 0.1;
          const cols = ["#b33", "#3a6a9a", "#d9a441", "#4a7a5a", "#7a4a8a", "#e8dcc6"];
          return <Box key={i} d={[0.08, h, 0.24]} c={cols[(i + r) % 6]} p={[-0.38 + i * 0.095, 0.13 + r * 0.46 + h / 2, 0.04]} rad={0.008} line={0.005} />;
        })}
      </group>
    ))}
  </G>
);
export const Wardrobe: React.FC<FP> = (f) => (
  <G {...f}>
    <Box d={[1.2, 2.1, 0.6]} c="#8a6248" p={[0, 1.05, 0]} rad={0.02} />
    <Box d={[0.02, 2.0, 0.02]} c="#3a2a20" p={[0, 1.05, 0.31]} rad={0.005} line={0} />
    <Ball rad={0.025} c="#d9b45a" p={[-0.06, 1.05, 0.32]} line={0.004} />
    <Ball rad={0.025} c="#d9b45a" p={[0.06, 1.05, 0.32]} line={0.004} />
  </G>
);
export const KitchenRow: React.FC<FP & { n?: number }> = ({ n = 4, ...f }) => (
  <G {...f}>
    {Array.from({ length: n }).map((_, i) => (
      <group key={i} position={[(i - (n - 1) / 2) * 0.62, 0, 0]}>
        <Box d={[0.6, 0.86, 0.6]} c="#cfbf9f" p={[0, 0.43, 0]} rad={0.015} />
        <Ball rad={0.018} c="#2b1d1a" p={[0.22, 0.75, 0.31]} line={0} />
        <Box d={[0.6, 0.7, 0.35]} c="#e7d9bd" p={[0, 1.95, -0.12]} rad={0.015} />
      </group>
    ))}
    <Box d={[n * 0.62 + 0.04, 0.05, 0.64]} c="#5a5450" p={[0, 0.885, 0]} rad={0.01} />
    <Box d={[n * 0.62, 0.62, 0.02]} c="#f2efe8" p={[0, 1.22, -0.29]} rad={0.005} line={0} />
    {/* ocak + tencere */}
    <Box d={[0.5, 0.02, 0.45]} c="#222" p={[0.31, 0.92, 0]} rad={0.005} line={0} />
    <Cyl r1={0.14} h={0.16} c="#8a8f96" p={[0.31, 1.0, 0]} />
    {/* evye musluğu */}
    <Cyl r1={0.012} h={0.25} c="#9aa3ab" p={[-0.62, 1.02, -0.2]} line={0.004} />
  </G>
);
export const Fridge: React.FC<FP> = (f) => (
  <G {...f}>
    <Box d={[0.75, 1.9, 0.7]} c="#e9eef2" p={[0, 0.95, 0]} rad={0.06} />
    <Box d={[0.74, 0.02, 0.02]} c="#9aa3ab" p={[0, 1.25, 0.36]} rad={0.005} line={0} />
    <Box d={[0.03, 0.3, 0.03]} c="#9aa3ab" p={[-0.3, 1.5, 0.37]} rad={0.01} line={0.004} />
    <Box d={[0.03, 0.35, 0.03]} c="#9aa3ab" p={[-0.3, 0.9, 0.37]} rad={0.01} line={0.004} />
    <Box d={[0.12, 0.14, 0.005]} c="#f2c14e" p={[0.1, 1.55, 0.355]} rad={0.002} line={0.003} />
  </G>
);
export const Bed: React.FC<FP & { c?: string }> = ({ c = "#8a7aa8", ...f }) => (
  <G {...f}>
    <Box d={[1.6, 1.0, 0.1]} c="#6a4a36" p={[0, 0.5, -1.0]} rad={0.04} />
    <Box d={[1.6, 0.3, 2.0]} c="#5a3e2c" p={[0, 0.15, 0]} rad={0.03} />
    <Box d={[1.55, 0.2, 1.95]} c="#f4f0ea" p={[0, 0.4, 0]} rad={0.06} />
    <Box d={[0.6, 0.14, 0.38]} c="#ffffff" p={[-0.38, 0.56, -0.72]} rad={0.07} />
    <Box d={[0.6, 0.14, 0.38]} c="#ffffff" p={[0.38, 0.56, -0.72]} rad={0.07} />
    <Box d={[1.62, 0.1, 1.3]} c={c} p={[0, 0.52, 0.32]} rad={0.05} />
  </G>
);
export const HospitalBed: React.FC<FP> = (f) => {
  const frame = useCurrentFrame();
  return (
    <G {...f}>
      <Box d={[1.0, 0.08, 2.0]} c="#c8d0d8" p={[0, 0.55, 0]} rad={0.02} />
      <Box d={[0.95, 0.15, 1.95]} c="#f4f6f8" p={[0, 0.66, 0]} rad={0.05} />
      <Box d={[1.0, 0.75, 0.06]} c="#c8d0d8" p={[0, 0.85, -1.0]} rad={0.03} />
      <Box d={[0.6, 0.12, 0.35]} c="#fff" p={[0, 0.8, -0.72]} rad={0.06} />
      <Box d={[0.98, 0.08, 1.2]} c="#a8c8e0" p={[0, 0.76, 0.35]} rad={0.04} />
      {[[-0.45, -0.9], [0.45, -0.9], [-0.45, 0.9], [0.45, 0.9]].map(([x, z], i) => <Cyl key={i} r1={0.025} h={0.55} c="#8a9098" p={[x, 0.27, z]} line={0.005} />)}
      {/* monitör */}
      <Cyl r1={0.02} h={1.5} c="#8a9098" p={[0.8, 0.75, -0.8]} line={0.005} />
      <Box d={[0.45, 0.32, 0.08]} c="#1a1e24" p={[0.8, 1.55, -0.8]} rad={0.02} />
      <Pic tex={screenTex("ekg", "ekg", frame)} w={0.4} h={0.26} p={[0.8, 1.55, -0.755]} />
      {/* serum */}
      <Cyl r1={0.015} h={1.8} c="#8a9098" p={[-0.8, 0.9, -0.6]} line={0.004} />
      <Box d={[0.14, 0.22, 0.06]} c="#dff0ff" p={[-0.8, 1.7, -0.6]} rad={0.03} line={0.005} />
    </G>
  );
};

/* ---------------- aydınlatma ---------------- */
export const FloorLamp: React.FC<FP & { on?: boolean }> = ({ on = true, ...f }) => {
  const frame = useCurrentFrame();
  const fl = on ? 0.95 : 0; // sabit ışık (titreme yok)
  void frame;
  return (
    <G {...f}>
      <Cyl r1={0.2} h={0.03} c="#2c2622" p={[0, 0.015, 0]} />
      <Cyl r1={0.018} h={1.5} c="#2c2622" p={[0, 0.75, 0]} line={0.005} />
      <B g={cylG(0.16, 0.26, 0.3)} c={on ? "#f6e2a8" : "#8a7a60"} p={[0, 1.6, 0]} />
      {on ? <pointLight position={[0, 1.55, 0.1]} color="#ffcc7a" intensity={2.2 * fl} distance={4.5} decay={1.2} /> : null}
    </G>
  );
};
export const CeilingLamp: React.FC<FP & { on?: boolean; y?: number }> = ({ on = true, y = 2.8, ...f }) => (
  <G {...f}>
    <Cyl r1={0.008} h={0.5} c="#2b1d1a" p={[0, y - 0.25, 0]} line={0} />
    <B g={cylG(0.08, 0.28, 0.22)} c={on ? "#f6e2a8" : "#bbaa99"} p={[0, y - 0.6, 0]} />
    {on ? <pointLight position={[0, y - 0.75, 0]} color="#fff0c8" intensity={1.6} distance={6} decay={1.2} /> : null}
  </G>
);
export const Chandelier: React.FC<FP> = (f) => (
  <G {...f}>
    <Cyl r1={0.01} h={0.8} c="#c9a75a" p={[0, 3.6, 0]} line={0} />
    <B g={cached("chand", () => new THREE.TorusGeometry(0.45, 0.025, 8, 32))} c="#c9a75a" p={[0, 3.15, 0]} r={[Math.PI / 2, 0, 0]} line={0.006} />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <Ball key={i} rad={[0.03, 0.05, 0.03]} c="#fff4c8" p={[Math.cos(a) * 0.45, 3.24, Math.sin(a) * 0.45]} line={0.003} />;
    })}
    <pointLight position={[0, 3.0, 0]} color="#fff0d0" intensity={2} distance={8} decay={1} />
  </G>
);
export const StreetLamp: React.FC<FP & { on?: boolean }> = ({ on, ...f }) => (
  <G {...f}>
    <Cyl r1={0.06} h={4} c="#2a2e34" p={[0, 2, 0]} />
    <Box d={[0.6, 0.06, 0.06]} c="#2a2e34" p={[0.3, 3.95, 0]} rad={0.02} />
    <B g={cylG(0.06, 0.16, 0.14)} c={on ? "#ffe7a8" : "#9aa"} p={[0.55, 3.88, 0]} />
    {on ? <pointLight position={[0.55, 3.7, 0]} color="#ffe2a0" intensity={3} distance={8} decay={1} /> : null}
  </G>
);

/* ---------------- duvar dekoru ---------------- */
export const WallFrame: React.FC<FP & { art: "manzara" | "aile" | "yirtik" | "portre"; w?: number; h?: number }> = ({ art, w = 0.7, h = 0.52, ...f }) => (
  <G {...f}>
    <Box d={[w + 0.08, h + 0.08, 0.04]} c="#6b5340" rad={0.01} />
    <Pic tex={paintingTex(art)} w={w} h={h} p={[0, 0, 0.022]} lit />
  </G>
);
export const WallClock: React.FC<FP & { hour?: number }> = ({ hour = 3, ...f }) => {
  const frame = useCurrentFrame();
  return (
    <G {...f}>
      <B g={cylG(0.22, 0.22, 0.05, 32)} c="#6b5340" r={[Math.PI / 2, 0, 0]} />
      <mesh position={[0, 0, 0.027]}>
        <circleGeometry args={[0.2, 32]} />
        <meshBasicMaterial map={clockFace("w", hour, frame)} transparent toneMapped={false} />
      </mesh>
    </G>
  );
};
export const TV: React.FC<FP & { on?: boolean }> = ({ on, ...f }) => {
  const frame = useCurrentFrame();
  return (
    <G {...f}>
      <Box d={[1.6, 0.5, 0.45]} c="#5a3e2c" p={[0, 0.25, 0]} rad={0.02} />
      <Box d={[1.1, 0.65, 0.05]} c="#16181c" p={[0, 0.9, 0]} rad={0.015} />
      {on ? <Pic tex={screenTex("tv", "tv", frame)} w={1.02} h={0.57} p={[0, 0.9, 0.03]} /> : null}
    </G>
  );
};
export const Plant: React.FC<FP> = (f) => (
  <G {...f}>
    <Cyl r1={0.2} r2={0.15} h={0.35} c="#c4704a" p={[0, 0.175, 0]} />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const a = (i / 6) * Math.PI * 2;
      return <Ball key={i} rad={[0.09, 0.28, 0.09]} c={i % 2 ? "#4a8a4a" : "#3a7a3a"} p={[Math.cos(a) * 0.12, 0.6, Math.sin(a) * 0.12]} line={0.006} />;
    })}
  </G>
);
export const Rug: React.FC<FP & { c?: string; w?: number; d?: number }> = ({ c = "#8a2f2f", w = 2.4, d = 1.6, ...f }) => (
  <G {...f}>
    <Box d={[w, 0.015, d]} c={c} p={[0, 0.008, 0]} rad={0.005} line={0.004} />
    <Box d={[w * 0.8, 0.017, d * 0.7]} c="#d9a441" p={[0, 0.009, 0]} rad={0.005} line={0} />
    <Box d={[w * 0.74, 0.019, d * 0.6]} c={c} p={[0, 0.01, 0]} rad={0.005} line={0} />
  </G>
);
export const Curtain: React.FC<FP & { c: string; w?: number; h?: number }> = ({ c, w = 0.55, h = 2.2, ...f }) => {
  const frame = useCurrentFrame();
  const geo = cached(`curtain-${w}-${h}`, () => {
    const g = new THREE.PlaneGeometry(w, h, 24, 4);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin((pos.getX(i) / w) * Math.PI * 6) * 0.04);
    g.computeVertexNormals();
    return g;
  });
  return (
    <G {...f}>
      <group rotation={[0, 0, Math.sin(frame / 30) * 0.01]}>
        <mesh geometry={geo} material={toon(c)} position={[0, -h / 2, 0]} />
      </group>
    </G>
  );
};

/** Pencere: çerçeve + dinamik manzara (gökyüzü/şehir/yağmur/şimşek) + perdeler */
export const Window3D: React.FC<FP & { w?: number; h?: number; time: TimeOfDay; rain?: boolean; flash?: number; city?: boolean; id: string; curtain?: string }> = ({
  w = 1.3, h = 1.6, time, rain, flash = 0, city = true, id, curtain, ...f
}) => {
  const frame = useCurrentFrame();
  return (
    <G {...f}>
      <Pic tex={windowView(id, time, frame, Boolean(rain), flash, city)} w={w} h={h} />
      <Box d={[w + 0.1, 0.07, 0.08]} c="#e8e0d0" p={[0, h / 2, 0.02]} rad={0.01} line={0.006} />
      <Box d={[w + 0.1, 0.07, 0.08]} c="#e8e0d0" p={[0, -h / 2, 0.02]} rad={0.01} line={0.006} />
      <Box d={[0.07, h, 0.08]} c="#e8e0d0" p={[-w / 2, 0, 0.02]} rad={0.01} line={0.006} />
      <Box d={[0.07, h, 0.08]} c="#e8e0d0" p={[w / 2, 0, 0.02]} rad={0.01} line={0.006} />
      <Box d={[0.05, h, 0.05]} c="#e8e0d0" p={[0, 0, 0.02]} rad={0.01} line={0.004} />
      <Box d={[w, 0.05, 0.05]} c="#e8e0d0" p={[0, h * 0.08, 0.02]} rad={0.01} line={0.004} />
      <Box d={[w + 0.3, 0.06, 0.2]} c="#d6ccb8" p={[0, -h / 2 - 0.05, 0.08]} rad={0.01} />
      {curtain ? (
        <>
          <Curtain c={curtain} p={[-w / 2 - 0.15, h / 2 + 0.2, 0.12]} />
          <Curtain c={curtain} p={[w / 2 + 0.15, h / 2 + 0.2, 0.12]} />
          <Cyl r1={0.02} h={w + 0.9} c="#5a4334" p={[0, h / 2 + 0.22, 0.12]} r={[0, 0, Math.PI / 2]} line={0.004} />
        </>
      ) : null}
    </G>
  );
};

/** Kapı: menteşeden açılır (open 0..1) */
export const Door3D: React.FC<FP & { open?: number; c?: string; w?: number; h?: number }> = ({ open = 0, c = "#7d573c", w = 0.95, h = 2.1, ...f }) => (
  <G {...f}>
    <Box d={[0.1, h + 0.1, 0.18]} c="#6b5440" p={[-w / 2 - 0.05, h / 2, 0]} rad={0.01} />
    <Box d={[0.1, h + 0.1, 0.18]} c="#6b5440" p={[w / 2 + 0.05, h / 2, 0]} rad={0.01} />
    <Box d={[w + 0.2, 0.1, 0.18]} c="#6b5440" p={[0, h + 0.05, 0]} rad={0.01} />
    <group position={[-w / 2, 0, 0.02]} rotation={[0, -open * 1.75, 0]}>
      <Box d={[w, h, 0.05]} c={c} p={[w / 2, h / 2, 0]} rad={0.01} />
      <Box d={[w * 0.7, h * 0.32, 0.01]} c="#00000022" p={[w / 2, h * 0.74, 0.03]} rad={0.004} line={0.004} />
      <Box d={[w * 0.7, h * 0.36, 0.01]} c="#00000022" p={[w / 2, h * 0.3, 0.03]} rad={0.004} line={0.004} />
      <Ball rad={0.035} c="#c9a75a" p={[w - 0.1, h * 0.5, 0.05]} line={0.004} />
    </group>
  </G>
);

export const Chalkboard: React.FC<FP> = (f) => {
  const frame = useCurrentFrame();
  return (
    <G {...f}>
      <Box d={[3.0, 1.4, 0.06]} c="#7a5236" rad={0.02} />
      <Pic tex={screenTex("tahta", "tahta", frame)} w={2.85} h={1.27} p={[0, 0, 0.035]} />
    </G>
  );
};
export const CafeCounter: React.FC<FP> = (f) => {
  const frame = useCurrentFrame();
  return (
    <G {...f}>
      <Box d={[2.6, 1.05, 0.6]} c="#8a5e3e" p={[0, 0.525, 0]} rad={0.02} />
      <Box d={[2.7, 0.06, 0.7]} c="#3a2a24" p={[0, 1.08, 0]} rad={0.015} />
      <Box d={[0.45, 0.5, 0.4]} c="#b8bec6" p={[0.7, 1.36, -0.05]} rad={0.04} />
      <Cyl r1={0.05} r2={0.04} h={0.1} c="#f4eee4" p={[0.7, 1.16, 0.1]} line={0.005} />
      <Box d={[1.6, 0.8, 0.04]} c="#7a5236" p={[-0.3, 2.3, -0.32]} rad={0.01} />
      <Pic tex={screenTex("menu", "menu", frame)} w={1.5} h={0.7} p={[-0.3, 2.3, -0.295]} />
    </G>
  );
};
export const PoliceDesk: React.FC<FP> = (f) => {
  const frame = useCurrentFrame();
  return (
    <G {...f}>
      <Box d={[1.8, 0.78, 0.8]} c="#6a6a72" p={[0, 0.39, 0]} rad={0.02} />
      <Box d={[1.9, 0.05, 0.85]} c="#4a4a50" p={[0, 0.8, 0]} rad={0.01} />
      <Box d={[0.55, 0.38, 0.05]} c="#2a2e34" p={[0.45, 1.08, -0.15]} rad={0.015} />
      <Pic tex={screenTex("polis", "laptop", frame)} w={0.5} h={0.32} p={[0.45, 1.08, -0.122]} />
      <Box d={[0.4, 0.02, 0.3]} c="#e8e0c8" p={[-0.4, 0.835, 0.1]} r={[0, 0.2, 0]} rad={0.004} line={0.004} />
    </G>
  );
};

/* ---------------- dış mekân ---------------- */
export const Tree: React.FC<FP & { dead?: boolean }> = ({ dead, ...f }) => (
  <G {...f}>
    <Cyl r1={0.12} r2={0.18} h={2.2} c="#5a3e2c" p={[0, 1.1, 0]} />
    {!dead
      ? [[0, 2.6, 0, 0.9], [0.6, 2.3, 0.2, 0.6], [-0.6, 2.3, -0.1, 0.65], [0, 3.2, 0, 0.6]].map(([x, y, z, r], i) => <Ball key={i} rad={r} c={i % 2 ? "#4f8a4a" : "#3f7a3a"} p={[x, y, z]} line={0.015} />)
      : [[0.4, 2.4, 0.4], [-0.4, 2.6, -0.5]].map(([x, y, r], i) => <Cyl key={i} r1={0.04} r2={0.07} h={1.2} c="#4a3426" p={[x, y, 0]} r={[0, 0, r]} />)}
  </G>
);
export const Tombstone: React.FC<FP> = (f) => (
  <G {...f}>
    <Box d={[0.6, 0.9, 0.18]} c="#9aa0a6" p={[0, 0.45, 0]} rad={0.08} />
    <Box d={[0.9, 0.08, 0.4]} c="#7a8086" p={[0, 0.04, 0.05]} rad={0.02} />
    <Box d={[0.3, 0.03, 0.01]} c="#5a6066" p={[0, 0.65, 0.095]} rad={0.004} line={0} />
    <Box d={[0.22, 0.03, 0.01]} c="#5a6066" p={[0, 0.55, 0.095]} rad={0.004} line={0} />
  </G>
);
export const Car: React.FC<FP & { c?: string }> = ({ c = "#3a6a9a", ...f }) => (
  <G {...f}>
    <Box d={[3.8, 0.6, 1.7]} c={c} p={[0, 0.6, 0]} rad={0.15} />
    <Box d={[2.1, 0.55, 1.5]} c={c} p={[-0.2, 1.1, 0]} rad={0.15} />
    <Box d={[2.0, 0.42, 1.52]} c="#bcd4e6" p={[-0.2, 1.12, 0]} rad={0.1} line={0.006} />
    {[[-1.2, 0.85], [1.2, 0.85], [-1.2, -0.85], [1.2, -0.85]].map(([x, z], i) => (
      <B key={i} g={cylG(0.32, 0.32, 0.22)} c="#222" p={[x, 0.32, z]} r={[Math.PI / 2, 0, 0]} />
    ))}
  </G>
);
export const Building: React.FC<FP & { w?: number; h?: number; c?: string; night?: boolean; seed?: string }> = ({ w = 4, h = 8, c = "#c48a6a", night, seed = "b", ...f }) => (
  <G {...f}>
    <Box d={[w, h, 2]} c={c} p={[0, h / 2, 0]} rad={0.03} />
    {Array.from({ length: Math.floor(h / 1.6) * 3 }).map((_, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const lit = night && random(`${seed}-${i}`) > 0.5;
      return <Box key={i} d={[0.7, 0.95, 0.04]} c={lit ? "#ffd27a" : night ? "#1a2230" : "#bcd4e6"} p={[(col - 1) * (w / 3), 1.3 + row * 1.6, 1.01]} rad={0.01} line={0.008} />;
    })}
  </G>
);

/* ---------------- ortam hareketi (3. katman) ---------------- */
/** Işıkta süzülen toz zerreleri */
export const Dust: React.FC<{ center: V3; size: V3; n?: number; color?: string }> = ({ center, size, n = 60, color = "#fff2c8" }) => {
  const frame = useCurrentFrame();
  return (
    <group position={center}>
      {Array.from({ length: n }).map((_, i) => {
        const x = (random(`dx${i}`) - 0.5) * size[0] + Math.sin(frame / 60 + i) * 0.05;
        const y = (((random(`dy${i}`) + frame * 0.0006 * (0.5 + random(`ds${i}`))) % 1) - 0.5) * size[1];
        const z = (random(`dz${i}`) - 0.5) * size[2];
        return (
          <mesh key={i} position={[x, y, z]} material={flat(color, 0.5)}>
            <sphereGeometry args={[0.006, 4, 4]} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Dış mekân yağmuru (çizgi parçacıklar) */
export const RainFall: React.FC<{ area?: [number, number]; n?: number; center?: V3 }> = ({ area = [10, 6], n = 400, center = [0, 0, 0] }) => {
  const frame = useCurrentFrame();
  const geo = React.useMemo(() => new THREE.BufferGeometry(), []);
  const arr = new Float32Array(n * 6);
  for (let i = 0; i < n; i++) {
    const x = (random(`rx${i}`) - 0.5) * area[0];
    const z = (random(`rz${i}`) - 0.5) * area[1];
    const y = 5 - ((random(`ry${i}`) * 5 + frame * 0.35) % 5);
    arr.set([x, y, z, x - 0.02, y + 0.35, z], i * 6);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  return (
    <lineSegments geometry={geo} position={center}>
      <lineBasicMaterial color="#b8d0ea" transparent opacity={0.55} />
    </lineSegments>
  );
};
