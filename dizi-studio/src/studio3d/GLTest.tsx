import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";

const toonGrad = () => {
  const d = new Uint8Array([90, 170, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RedFormat);
  t.minFilter = THREE.NearestFilter; t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
  return t;
};

const Toon = ({ geo, color, pos, scale = [1, 1, 1] }: { geo: THREE.BufferGeometry; color: string; pos: [number, number, number]; scale?: [number, number, number] }) => {
  const g = useMemo(() => toonGrad(), []);
  return (
    <group position={pos} scale={scale}>
      <mesh geometry={geo}><meshToonMaterial color={color} gradientMap={g} /></mesh>
      <mesh geometry={geo} scale={1.04}><meshBasicMaterial color="#2b1d1a" side={THREE.BackSide} /></mesh>
    </group>
  );
};

export const GLTest = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sphere = useMemo(() => new THREE.SphereGeometry(1, 48, 32), []);
  const cap = useMemo(() => new THREE.CapsuleGeometry(0.6, 1.4, 8, 24), []);
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  return (
    <ThreeCanvas width={width} height={height} camera={{ fov: 35, position: [0, 1.6, 9] }} style={{ backgroundColor: "#d9c39a" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <group rotation={[0, frame * 0.05, 0]}>
        <Toon geo={sphere} color="#f6cfb0" pos={[0, 2.4, 0]} scale={[0.9, 1, 0.9]} />
        <Toon geo={cap} color="#d9a441" pos={[0, 0.8, 0]} />
        {Array.from({ length: 30 }).map((_, i) => (
          <Toon key={i} geo={box} color="#7d5c44" pos={[Math.sin(i) * 4, -1, -3 - (i % 5)]} scale={[0.5, 0.5, 0.5]} />
        ))}
      </group>
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[30, 30]} /><meshToonMaterial color="#7a5236" /></mesh>
    </ThreeCanvas>
  );
};
