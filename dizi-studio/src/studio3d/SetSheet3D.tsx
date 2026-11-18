import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../studio/cast";
import { SANS } from "../dizi/fonts";
import { Character3D } from "./Character3D";
import { CameraRig } from "./CameraRig";
import { SETS3D, Set3D, type SetName3D } from "./sets3d";
import type { TimeOfDay } from "./textures";

const DEMO: [SetName3D, TimeOfDay, string, string][] = [
  ["salon", "gece", "zeynep", "orta"], ["mutfak", "gunduz", "nermin", "orta"], ["yatak_odasi", "aksam", "leyla", "yatak"], ["cocuk_odasi", "gunduz", "elif", "orta"],
  ["ofis", "gece", "kaan", "masa"], ["hastane_odasi", "gunduz", "deniz", "sag"], ["hastane_koridoru", "gunduz", "ozan", "orta"], ["sokak", "gece", "emre", "orta"],
  ["kafe", "gunduz", "melek", "orta"], ["sinif", "gunduz", "can", "orta"], ["mezarlik", "aksam", "kemal", "orta"], ["villa", "gunduz", "selin", "orta"],
  ["karakol", "gunduz", "burak", "masa"], ["park", "gunduz", "riza", "bank_sol"], ["apartman_kapisi", "gece", "kemal", "kapi"], ["koridor", "gece", "nermin", "orta"], ["merdiven", "gece", "huseyin", "orta"],
];

/** Her kare bir mekân gösterir (kare 0..16) */
export const SetSheet3D = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const [name, time, who, mark] = DEMO[Math.min(frame, DEMO.length - 1)];
  const info = SETS3D[name];
  const m = info.marks[mark];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 50, position: info.wide.pos }}>
        <CameraRig pos={info.wide.pos} target={info.wide.target} fov={50} />
        <Set3D name={name} time={time} rain={time === "gece"} doorOpen={1} />
        <Character3D look={castById(who)} position={[m.x, m.seat ? 0 : 0, m.z]} pose={{ turn: m.facing ?? 0, body: m.seat ? "sit" : "stand" }} />
      </ThreeCanvas>
      <div style={{ position: "absolute", bottom: 40, width: "100%", textAlign: "center", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 56, textShadow: "0 4px 12px #000" }}>
        {info.title} · {time}
      </div>
    </AbsoluteFill>
  );
};
