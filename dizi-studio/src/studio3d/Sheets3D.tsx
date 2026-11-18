import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { CAST, castById } from "../studio/cast";
import type { Emotion } from "../studio/rig/types";
import { EMOTION_FACE } from "../studio/rig/face";
import { Character3D, GESTURES3D } from "./Character3D";

const Lights = () => (
  <>
    <ambientLight intensity={0.8} />
    <directionalLight position={[1.5, 2.5, 6]} intensity={1.5} />
  </>
);

/** 360° dönüş: her satır bir karakter, sütunlar 0°, 45°, 90°, 135°, 180° */
export const Turnaround3D = ({ ids = ["zeynep", "kemal", "hatice", "elif", "kaan", "defne"] }: { ids?: string[] }) => {
  const { width, height } = useVideoConfig();
  const turns = [0, 45, 90, 135, 180, 270];
  return (
    <AbsoluteFill style={{ backgroundColor: "#efe3cf" }}>
      <ThreeCanvas width={width} height={height} orthographic camera={{ zoom: 260, position: [0, 0, 20], near: 0.1, far: 100 }}>
        <Lights />
        {ids.map((id, r) =>
          turns.map((t, c) => (
            <Character3D key={`${id}-${t}`} look={castById(id)} position={[(c - (turns.length - 1) / 2) * 0.62, ((ids.length - 1) / 2 - r) * 2.05 - 0.9, 0]} pose={{ turn: t, seed: r * 10 + c }} />
          )),
        )}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export const Cast3D = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#efe3cf" }}>
      <ThreeCanvas width={width} height={height} orthographic camera={{ zoom: 300, position: [0, 0, 20], near: 0.1, far: 100 }}>
        <Lights />
        {CAST.map((c, i) => (
          <Character3D key={c.id} look={c} position={[((i % 10) - 4.5) * 0.62, i < 10 ? 0.15 : -1.95, 0]} pose={{ turn: 15, seed: i }} />
        ))}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export const Emotions3D = () => {
  const { width, height } = useVideoConfig();
  const emos = Object.keys(EMOTION_FACE) as Emotion[];
  return (
    <AbsoluteFill style={{ backgroundColor: "#e8eef2" }}>
      <ThreeCanvas width={width} height={height} orthographic camera={{ zoom: 900, position: [0, 0, 20], near: 0.1, far: 100 }}>
        <Lights />
        {emos.map((e, i) => (
          <Character3D key={e} look={castById(i % 2 ? "ozan" : "zeynep")} position={[((i % 6) - 2.5) * 0.42, 0.4 - Math.floor(i / 6) * 0.5 - 1.6, 0]} pose={{ emotion: e, turn: 20, seed: i, eyesClosed: 0 }} />
        ))}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export const Gestures3D = () => {
  const { width, height } = useVideoConfig();
  const gs = Object.keys(GESTURES3D) as (keyof typeof GESTURES3D)[];
  return (
    <AbsoluteFill style={{ backgroundColor: "#f0e8dc" }}>
      <ThreeCanvas width={width} height={height} orthographic camera={{ zoom: 230, position: [0, 0, 20], near: 0.1, far: 100 }}>
        <Lights />
        {gs.map((g, i) => (
          <Character3D key={g} look={castById("ozan")} position={[((i % 6) - 2.5) * 0.75, i < 6 ? 1.3 : i < 12 ? -0.8 : -2.9, 0]} pose={{ gesture: g, turn: 25, seed: i, prop: g === "telefon" ? "telefon" : g === "tutuyor" ? "fincan" : undefined }} />
        ))}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
