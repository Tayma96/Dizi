import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { castById } from "../studio/cast";
import { Character3D, GESTURES3D } from "./Character3D";

export const GestureTest = ({ gs = ["elBelde", "omuzSilk", "isaret", "eliYuzunde", "telefon", "kollarBagli"] }: { gs?: string[] }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#f0e8dc" }}>
      <ThreeCanvas width={width} height={height} orthographic camera={{ zoom: 330, position: [0, 0, 20], near: 0.1, far: 100 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[1.5, 2.5, 6]} intensity={1.5} />
        {gs.map((g, i) =>
          [0, 90].map((t, j) => (
            <Character3D key={g + t} look={castById("ozan")} position={[(i - 2.5) * 1.0 + (j ? 0.42 : -0.12), j ? -2.0 : 0.05, 0]} pose={{ gesture: g as keyof typeof GESTURES3D, turn: t, seed: i }} />
          )),
        )}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
