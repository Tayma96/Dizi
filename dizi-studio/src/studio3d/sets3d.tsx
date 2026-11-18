/* 3D mekân kütüphanesi. Her mekân: geometri + ışık + işaretler (marks) + varsayılan geniş kamera.
   Koordinatlar: x sağ, y yukarı, z kameraya doğru. Arka duvar genelde z=-2.5. */
import React from "react";
import * as THREE from "three";
import { random, useCurrentFrame } from "remotion";
import {
  Armchair, B, Ball, Bed, Bench, Bookshelf, Box, Building, CafeCounter, CafeTable, Car, CeilingLamp, Chair, Chalkboard, Chandelier,
  CoffeeTable, Cyl, Desk, DiningTable, Door3D, Dust, FloorLamp, Fridge, HospitalBed, KitchenRow, Pic, Plant, PoliceDesk, RainFall,
  Rug, SchoolDesk, Sofa, StreetLamp, Tombstone, Tree, TV, WallClock, WallFrame, Wardrobe, Window3D,
} from "./furniture";
import { tileFloor, wallpaper, windowView, woodFloor, type TimeOfDay } from "./textures";
import { cached, flat, toon } from "./toon";

export type SetName3D =
  | "salon" | "mutfak" | "yatak_odasi" | "cocuk_odasi" | "ofis" | "hastane_odasi" | "hastane_koridoru" | "sokak" | "kafe"
  | "sinif" | "mezarlik" | "villa" | "karakol" | "park" | "apartman_kapisi" | "koridor" | "merdiven";

/** İşaret: karakterin durduğu yer. y = oturma yüksekliği (0 = ayakta). facing = derece (0 kameraya) */
export type Mark3D = { x: number; z: number; facing?: number; seat?: boolean };
export type SetInfo3D = { title: string; marks: Record<string, Mark3D>; wide: { pos: [number, number, number]; target: [number, number, number] } };

const M = (x: number, z: number, facing = 0, seat = false): Mark3D => ({ x, z, facing, seat });
const WIDE = (pos: [number, number, number], target: [number, number, number]) => ({ pos, target });

export const SETS3D: Record<SetName3D, SetInfo3D> = {
  salon: { title: "Salon", marks: { sol: M(-1.3, 0.5, 15), orta: M(0, 0.6), sag: M(1.3, 0.5, -15), kanepe: M(-0.9, -1.45, 0, true), pencere: M(1.4, -1.6, 180) }, wide: WIDE([0, 1.6, 6.8], [0, 1.1, -0.6]) },
  mutfak: { title: "Mutfak", marks: { sol: M(-1.2, 0.4, 15), orta: M(0.2, -1.3, 0), sag: M(1.4, 0.4, -15), masa: M(-1.6, -0.15, 90, true), tezgah: M(0.6, -1.4, 180) }, wide: WIDE([0, 1.6, 6.8], [0, 1.1, -0.6]) },
  yatak_odasi: { title: "Yatak odası", marks: { sol: M(-1.5, 0.5, 15), orta: M(0, 0.7), sag: M(1.5, 0.5, -15), yatak: M(0, -0.2, 0, true) }, wide: WIDE([0, 1.6, 6.8], [0, 1.0, -0.6]) },
  cocuk_odasi: { title: "Çocuk odası", marks: { sol: M(-1.2, 0.4, 15), orta: M(0, 0.6), sag: M(1.2, 0.4, -15), yatak: M(1.2, -0.75, 0, true) }, wide: WIDE([0, 1.5, 6.5], [0, 1.0, -0.6]) },
  ofis: { title: "Ofis", marks: { masa: M(0, -1.55, 0, true), sol: M(-1.5, 0.3, 30), sag: M(1.5, 0.3, -30), kapi: M(2.2, -0.8, -60) }, wide: WIDE([0, 1.7, 6.8], [0, 1.1, -0.8]) },
  hastane_odasi: { title: "Hastane odası", marks: { yatak: M(-0.5, -1.2, 0, true), sol: M(-1.7, 0.2, 30), sag: M(0.9, -0.3, -45), kapi: M(2.2, 0.6, -60) }, wide: WIDE([0.2, 1.7, 6.6], [0, 1.0, -0.8]) },
  hastane_koridoru: { title: "Hastane koridoru", marks: { sol: M(-0.6, 0.4, 20), orta: M(0, 0.0), sag: M(0.6, 0.4, -20), uzak: M(0, -5, 0), bank: M(-1.15, -1.2, 90, true) }, wide: WIDE([0, 1.6, 6.0], [0, 1.2, -3]) },
  sokak: { title: "Sokak", marks: { sol: M(-1.2, 0.8, 15), orta: M(0, 1.0), sag: M(1.2, 0.8, -15), kaldirim: M(1.8, -1.2, -30) }, wide: WIDE([0, 1.7, 8.5], [0, 1.4, -1.5]) },
  kafe: { title: "Kafe", marks: { sol: M(-1.5, 0.75, 20), orta: M(0, 0.4), sag: M(1.8, 0.95, -20), tezgah: M(0.6, -2.25, 0), masa_sol: M(-1.5, -0.2, 0, true), masa_sag: M(1.8, -0.1, 0, true) }, wide: WIDE([0, 1.7, 7.0], [0, 1.1, -0.8]) },
  sinif: { title: "Sınıf", marks: { ogretmen: M(1.0, -1.7, -10), sol: M(-1.2, 0.6, 0), orta: M(0, 0.9), sira: M(-0.9, 1.05, 180, true) }, wide: WIDE([0, 1.7, 7.0], [0, 1.2, -1.0]) },
  mezarlik: { title: "Mezarlık", marks: { sol: M(-1.2, 0.6, 20), orta: M(0, 0.8), sag: M(1.2, 0.6, -20), mezar: M(0, -0.6, 180) }, wide: WIDE([0, 1.6, 8.0], [0, 1.0, -1.5]) },
  villa: { title: "Villa salonu", marks: { sol: M(-1.4, 0.6, 20), orta: M(0, 0.8), sag: M(1.4, 0.6, -20), merdiven: M(2.3, -1.4, -30) }, wide: WIDE([0, 1.9, 8.5], [0, 1.6, -1.0]) },
  karakol: { title: "Karakol", marks: { masa: M(0, -1.45, 0, true), sol: M(-1.4, 0.3, 30), sag: M(1.4, 0.3, -30), sorgu: M(0, 0.2, 180) }, wide: WIDE([0, 1.7, 6.8], [0, 1.1, -0.8]) },
  park: { title: "Park", marks: { sol: M(-1.2, 0.6, 15), orta: M(0, 0.8), sag: M(1.2, 0.6, -15), bank_sol: M(-0.4, -0.85, 0, true), bank_sag: M(0.4, -0.85, 0, true) }, wide: WIDE([0, 1.6, 8.0], [0, 1.1, -1.0]) },
  apartman_kapisi: { title: "Apartman kapısı", marks: { kapi: M(0, -1.0, 0), ic: M(0, 1.0, 180), ic_sol: M(-0.9, 1.2, 160) }, wide: WIDE([0.4, 1.6, 5.5], [0, 1.2, -1.0]) },
  koridor: { title: "Karanlık koridor", marks: { orta: M(0, 0.0), uzak: M(0, -3.5), yakin: M(0, 1.6, 180) }, wide: WIDE([0, 1.6, 5.5], [0, 1.2, -2.5]) },
  merdiven: { title: "Apartman merdiveni", marks: { orta: M(0, 0.5), basamak: M(0.4, -1.4, -20) }, wide: WIDE([0, 1.6, 6.0], [0, 1.4, -1.0]) },
};

/* ---------------- yapı taşları ---------------- */
const plane = cached("s-plane", () => new THREE.PlaneGeometry(1, 1));
const Floor: React.FC<{ tex: THREE.Texture; w?: number; d?: number; z?: number }> = ({ tex, w = 7, d = 7, z = 0 }) => (
  <mesh geometry={plane} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, z]} scale={[w, d, 1]}>
    <meshToonMaterial map={tex} />
  </mesh>
);
const Wall: React.FC<{ tex?: THREE.Texture; color?: string; p: [number, number, number]; r?: number; w: number; h: number }> = ({ tex, color = "#ffffff", p, r = 0, w, h }) => (
  <mesh geometry={plane} position={p} rotation={[0, r, 0]} scale={[w, h, 1]}>
    <meshToonMaterial map={tex ?? null} color={color} />
  </mesh>
);
const Room: React.FC<{ wall: THREE.Texture; floor: THREE.Texture; h?: number; w?: number; back?: number; side?: boolean }> = ({ wall, floor, h = 2.9, w = 6.6, back = -2.5, side = true }) => (
  <group>
    <Floor tex={floor} w={w + 0.4} d={9} z={back + 4.5} />
    <Wall tex={wall} p={[0, h / 2, back]} w={w} h={h} />
    {side ? (
      <>
        <Wall tex={wall} p={[-w / 2, h / 2, back + 2.5]} r={Math.PI / 2} w={5} h={h} />
        <Wall tex={wall} p={[w / 2, h / 2, back + 2.5]} r={-Math.PI / 2} w={5} h={h} />
      </>
    ) : null}
    <Box d={[w, 0.12, 0.04]} c="#3c3029" p={[0, 0.06, back + 0.02]} rad={0.01} line={0.006} />
    <Ceiling y={h} w={w} d={9} z={back + 4.5} />
  </group>
);
const Ceiling: React.FC<{ y: number; w: number; d: number; z: number; c?: string }> = ({ y, w, d, z, c = "#e8e2d6" }) => (
  <mesh geometry={plane} rotation={[Math.PI / 2, 0, 0]} position={[0, y, z]} scale={[w, d, 1]} material={toon(c)} />
);
const Sky: React.FC<{ time: TimeOfDay; rain?: boolean; flash?: number; z?: number; id: string; city?: boolean }> = ({ time, rain, flash = 0, z = -14, id, city = false }) => {
  const frame = useCurrentFrame();
  return <Pic tex={windowView(id, time, frame, Boolean(rain), flash, city)} w={40} h={22} p={[0, 9, z]} />;
};

/* ---------------- ışık ---------------- */
export const Lighting: React.FC<{ time: TimeOfDay; flash?: number; indoor?: boolean }> = ({ time, flash = 0, indoor = true }) => {
  const L = {
    gunduz: { amb: 0.95, ambC: "#ffffff", dir: 1.25, dirC: "#fff6e8", dirP: [2.5, 5, 4] },
    aksam: { amb: 0.7, ambC: "#ffd9b5", dir: 1.1, dirC: "#ffa860", dirP: [-4, 2, 3] },
    gece: { amb: indoor ? 0.62 : 0.55, ambC: "#c4cce2", dir: 0.55, dirC: "#b8c8ff", dirP: [-2, 4, 3] },
  }[time];
  return (
    <>
      <ambientLight intensity={L.amb + flash * 2.2} color={flash > 0.2 ? "#e8f0ff" : L.ambC} />
      <directionalLight position={L.dirP as [number, number, number]} intensity={L.dir} color={L.dirC} />
      <hemisphereLight args={[L.ambC, "#3a2a20", 0.25]} />
    </>
  );
};

/* ---------------- mekânlar ---------------- */
export const Set3D: React.FC<{ name: SetName3D; time?: TimeOfDay; rain?: boolean; flash?: number; doorOpen?: number }> = ({ name, time = "gunduz", rain, flash = 0, doorOpen = 0 }) => {
  const frame = useCurrentFrame();
  const night = time === "gece";
  const lampsOn = time !== "gunduz";
  const W = (p: [number, number, number], w: number, h: number, id: string, curtain?: string, city = true) => (
    <Window3D p={p} w={w} h={h} time={time} rain={rain} flash={flash} id={`${name}-${id}`} curtain={curtain} city={city} />
  );
  let body: React.ReactNode = null;
  let indoor = true;
  switch (name) {
    case "salon":
      body = (
        <>
          <Room wall={wallpaper(night ? "#26344a" : "#e9d9b8", night ? "#33465a" : "#d4b98e", "elmas")} floor={woodFloor("#7a5236", "#5a3a26")} />
          {W([1.4, 1.55, -2.47], 1.3, 1.5, "w", "#6e2c2f")}
          <WallFrame art="yirtik" p={[-1.7, 1.65, -2.46]} />
          <WallClock hour={3} p={[-0.5, 2.25, -2.46]} />
          <Sofa p={[-0.9, 0, -1.95]} />
          <CoffeeTable p={[-0.9, 0, -0.75]} />
          <Rug p={[-0.9, 0, -0.9]} />
          <FloorLamp p={[-2.7, 0, -2.05]} on={lampsOn} />
          <Plant p={[2.75, 0, -2.1]} />
          <TV p={[2.85, 0, -0.4]} r={-90} on={night} />
          <Dust center={[0.5, 1.4, -1.2]} size={[3, 1.6, 1.5]} />
        </>
      );
      break;
    case "mutfak":
      body = (
        <>
          <Room wall={wallpaper(night ? "#24323a" : "#f0e6cf", night ? "#3a4a52" : "#d6c49e", "nokta")} floor={tileFloor(night ? "#3a4248" : "#d8d2c4", night ? "#2a3036" : "#bfb7a6")} />
          {W([-2.2, 1.6, -2.47], 1.0, 1.1, "w", undefined, false)}
          <KitchenRow p={[0.35, 0, -2.18]} n={4} />
          <Fridge p={[2.55, 0, -2.12]} />
          <DiningTable p={[-1.6, 0, 0.75]} r={90} chairs={false} />
          <Chair p={[-1.6, 0, -0.15]} r={0} />
          <CeilingLamp p={[0, 0, -0.5]} on={lampsOn} />
        </>
      );
      break;
    case "yatak_odasi":
      body = (
        <>
          <Room wall={wallpaper(night ? "#22283c" : "#dfe4f0", night ? "#303854" : "#c4cce0", "cizgi")} floor={woodFloor("#8a6248", "#6a4a36")} />
          {W([-2.0, 1.6, -2.47], 1.1, 1.4, "w", "#8a7aa8")}
          <WallFrame art="aile" p={[0, 1.95, -2.46]} w={0.6} h={0.45} />
          <Bed p={[0, 0, -1.35]} />
          <Wardrobe p={[2.4, 0, -2.15]} />
          <FloorLamp p={[-2.8, 0, -1.6]} on={lampsOn} />
          <Rug p={[0, 0, 0.3]} c="#5a6a9a" w={2} d={1.2} />
        </>
      );
      break;
    case "cocuk_odasi":
      body = (
        <>
          <Room wall={wallpaper(night ? "#22304a" : "#cfe6f4", night ? "#f2e48a" : "#ffffff", "yildiz")} floor={woodFloor("#c9a070", "#a88050")} />
          {W([0.0, 1.7, -2.47], 1.0, 1.1, "w", "#f2b8c6", false)}
          <Bookshelf p={[-2.4, 0, -2.25]} s={0.85} />
          <Bed p={[1.4, 0, -1.55]} s={0.75} c="#e2879a" />
          <Ball rad={0.16} c="#e0503a" p={[-1.0, 0.16, 0.6]} />
          <Box d={[0.35, 0.3, 0.35]} c="#4a8ad9" p={[-1.6, 0.15, -0.8]} rad={0.04} />
          <Box d={[0.25, 0.25, 0.25]} c="#f2c14e" p={[-1.55, 0.43, -0.8]} rad={0.04} />
          <CeilingLamp p={[0, 0, -0.5]} on={lampsOn} />
        </>
      );
      break;
    case "ofis":
      body = (
        <>
          <Room wall={wallpaper(night ? "#1e242c" : "#e4e6e8", night ? "#262e38" : "#d8dce0", "duz")} floor={tileFloor(night ? "#2a2e34" : "#7a8088", night ? "#1a1e24" : "#6a7078")} />
          {W([0, 1.55, -2.47], 4.2, 2.3, "w")}
          <Desk p={[0, 0, -0.95]} />
          <Chair p={[0, 0, -1.6]} c="#2a2a2e" />
          <Bookshelf p={[-2.7, 0, -2.2]} />
          <Plant p={[2.8, 0, -2.0]} />
          <CeilingLamp p={[0, 0, -0.8]} on={lampsOn} />
        </>
      );
      break;
    case "hastane_odasi":
      body = (
        <>
          <Room wall={wallpaper("#dfeceb", "#cfe2e0", "duz")} floor={tileFloor("#cfd8d6", "#b2bebc")} />
          {W([1.6, 1.6, -2.47], 1.2, 1.3, "w")}
          <HospitalBed p={[-0.5, 0, -1.25]} />
          <Box d={[0.05, 2.0, 2.4]} c="#9ec8c4" p={[-2.6, 1.0, -0.8]} rad={0.02} />
          <Chair p={[0.9, 0, -0.9]} r={-60} c="#6a8a9a" />
          <CeilingLamp p={[0, 0, -0.5]} on />
        </>
      );
      break;
    case "hastane_koridoru":
      body = (
        <>
          <Floor tex={tileFloor("#d0dad8", "#b8c4c2")} w={3.4} d={16} z={-4} />
          <Wall tex={wallpaper("#d8e6e4", "#c4d6d4", "duz")} p={[-1.6, 1.4, -4]} r={Math.PI / 2} w={16} h={2.8} />
          <Wall tex={wallpaper("#d8e6e4", "#c4d6d4", "duz")} p={[1.6, 1.4, -4]} r={-Math.PI / 2} w={16} h={2.8} />
          <Wall color="#e8f0ef" p={[0, 1.4, -11.5]} w={3.4} h={2.8} />
          <Ceiling y={2.8} w={3.4} d={16} z={-4} c="#eef4f2" />
          {[-1, -4, -7, -10].map((z) => (
            <group key={z}>
              <Door3D p={[-1.58, 0, z]} r={90} c="#7aa8c8" />
              <Box d={[0.8, 0.04, 0.4]} c="#fffef4" p={[0, 2.78, z]} rad={0.01} line={0} />
              <pointLight position={[0, 2.5, z]} intensity={0.9} distance={4} color="#f4fff8" />
            </group>
          ))}
          <Door3D p={[1.58, 0, -5.5]} r={-90} c="#7aa8c8" />
          <Bench p={[-1.25, 0, -1.2]} r={90} />
        </>
      );
      break;
    case "sokak":
      indoor = false;
      body = (
        <>
          <Sky time={time} rain={rain} flash={flash} id="sokak" />
          <mesh geometry={plane} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} scale={[30, 30, 1]} material={toon("#3a3c40")} />
          <Box d={[30, 0.15, 3]} c="#a8a29a" p={[0, 0.075, -3.2]} rad={0.02} />
          <Box d={[30, 0.02, 0.15]} c="#e8e0c0" p={[0, 0.01, 1.8]} rad={0.005} line={0} />
          <Building p={[-4.5, 0, -6.2]} w={4} h={9} c="#c48a6a" night={night} seed="b1" />
          <Building p={[0, 0, -6.4]} w={4.4} h={11} c="#8a9aaa" night={night} seed="b2" />
          <Building p={[4.6, 0, -6.2]} w={4} h={8} c="#d0b48a" night={night} seed="b3" />
          <StreetLamp p={[2.6, 0.15, -2.4]} on={night} />
          <Tree p={[-3.0, 0.15, -2.8]} />
          <Car p={[-0.8, 0, -1.0]} r={0} c="#3a6a9a" />
          {rain ? <RainFall area={[12, 8]} center={[0, 0, 0]} /> : null}
        </>
      );
      break;
    case "kafe":
      body = (
        <>
          <Room wall={wallpaper("#e2c9a4", "#caa77a", "cizgi")} floor={woodFloor("#6a4a36", "#4a3426")} />
          {W([-2.2, 1.6, -2.47], 1.3, 1.5, "w")}
          <CafeCounter p={[0.6, 0, -1.85]} />
          <CafeTable p={[-1.5, 0, 0.35]} />
          <Chair p={[-1.5, 0, -0.25]} r={0} c="#2a2a2a" />
          <CafeTable p={[1.8, 0, 0.5]} />
          <Chair p={[1.8, 0, -0.1]} r={0} c="#2a2a2a" />
          {[-1.2, 0.6, 2.2].map((x) => (
            <group key={x}>
              <Cyl r1={0.006} h={0.8} c="#2b1d1a" p={[x, 2.5, -0.6]} line={0} />
              <B g={cached("pend", () => new THREE.ConeGeometry(0.18, 0.2, 20, 1, true))} c="#2a2a2a" p={[x, 2.05, -0.6]} />
              <pointLight position={[x, 1.9, -0.6]} color="#ffe2a8" intensity={0.9} distance={3.5} />
            </group>
          ))}
        </>
      );
      break;
    case "sinif":
      body = (
        <>
          <Room wall={wallpaper("#e8e2c8", "#d6ceac", "duz")} floor={woodFloor("#a07850", "#7a5a3a")} />
          <Box d={[6.6, 1.0, 0.02]} c="#9ab09a" p={[0, 0.5, -2.48]} rad={0.004} line={0} />
          <Chalkboard p={[0, 1.6, -2.44]} />
          <WallClock hour={9} p={[2.4, 2.4, -2.46]} />
          <Desk p={[1.5, 0, -1.6]} laptop={false} />
          <SchoolDesk p={[-0.9, 0, 0.5]} />
          <SchoolDesk p={[1.0, 0, 0.5]} />
          <SchoolDesk p={[-0.9, 0, 1.6]} />
          <SchoolDesk p={[1.0, 0, 1.6]} />
          {W([-3.28, 1.6, -0.8], 1.6, 1.3, "w", undefined, false)}
        </>
      );
      break;
    case "mezarlik":
      indoor = false;
      body = (
        <>
          <Sky time={time} rain={rain} flash={flash} id="mezar" />
          <mesh geometry={plane} rotation={[-Math.PI / 2, 0, 0]} scale={[30, 30, 1]} material={toon(night ? "#1a2418" : "#5a6a4a")} />
          <Tombstone p={[0, 0, -1.0]} />
          <Tombstone p={[-2.0, 0, -2.4]} r={8} />
          <Tombstone p={[2.1, 0, -2.2]} r={-6} />
          <Tombstone p={[-1.0, 0, -4.2]} />
          <Tombstone p={[1.3, 0, -4.6]} />
          <Tree p={[-3.4, 0, -3.5]} dead />
          <Tree p={[3.5, 0, -4.0]} />
          <mesh geometry={plane} position={[0, 0.4, -3]} scale={[30, 0.8, 1]} material={flat("#ffffff", 0.12)} />
          {rain ? <RainFall area={[12, 8]} /> : null}
        </>
      );
      break;
    case "villa":
      body = (
        <>
          <Room wall={wallpaper("#f2ebe0", "#e6dccb", "cizgi")} floor={tileFloor("#efe9e2", "#d8d0c4")} h={4.2} w={8} />
          {W([-2.4, 2.1, -2.47], 1.4, 2.8, "w1", "#b8a888", false)}
          {W([-0.6, 2.1, -2.47], 1.4, 2.8, "w2", "#b8a888", false)}
          <WallFrame art="portre" p={[1.3, 2.4, -2.46]} w={0.8} h={1.1} />
          {Array.from({ length: 9 }).map((_, i) => (
            <Box key={i} d={[1.2, 0.2 * (i + 1), 0.4]} c="#d8cbb4" p={[3.2, 0.1 * (i + 1), -0.4 - i * 0.4]} rad={0.01} line={0.006} />
          ))}
          <Chandelier p={[0, 0, -0.5]} />
          <Armchair p={[-2.6, 0, 0.2]} r={45} c="#7a2a3a" />
          <Plant p={[2.4, 0, 1.2]} s={1.3} />
        </>
      );
      break;
    case "karakol":
      body = (
        <>
          <Room wall={wallpaper("#cfd6d8", "#c0c8ca", "duz")} floor={tileFloor("#9aa0a2", "#80888a")} />
          <Box d={[6.6, 1.2, 0.02]} c="#8a9496" p={[0, 0.6, -2.48]} rad={0.004} line={0} />
          {W([1.8, 1.7, -2.47], 1.3, 1.2, "w")}
          {Array.from({ length: 8 }).map((_, i) => <Box key={i} d={[1.3, 0.07, 0.03]} c="#d8dcd0" p={[1.8, 1.2 + i * 0.14, -2.42]} rad={0.005} line={0.003} />)}
          <Box d={[1.6, 1.1, 0.04]} c="#b08a5a" p={[-1.4, 1.75, -2.46]} rad={0.01} />
          {Array.from({ length: 6 }).map((_, i) => <Box key={i} d={[0.32, 0.38, 0.01]} c="#f4f0e4" p={[-1.9 + (i % 3) * 0.5, 1.95 - Math.floor(i / 3) * 0.48, -2.43]} r={[0, 0, (random(`kp${i}`) - 0.5) * 0.15]} rad={0.003} line={0.003} />)}
          <PoliceDesk p={[0, 0, -0.85]} />
          <Chair p={[0, 0, -1.55]} c="#2a2a2e" />
          <Chair p={[0, 0, 0.25]} r={180} c="#5a5a62" />
          <CeilingLamp p={[0, 0, -0.5]} on />
        </>
      );
      break;
    case "park":
      indoor = false;
      body = (
        <>
          <Sky time={time} rain={rain} flash={flash} id="park" />
          <mesh geometry={plane} rotation={[-Math.PI / 2, 0, 0]} scale={[30, 30, 1]} material={toon(night ? "#1e2e1e" : "#7ab060")} />
          <mesh geometry={plane} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -2]} scale={[1.6, 14, 1]} material={toon(night ? "#3a3a32" : "#d8c8a0")} />
          <Bench p={[0, 0, -1.2]} />
          <Tree p={[-2.6, 0, -2.6]} />
          <Tree p={[2.8, 0, -3.4]} s={1.2} />
          <Tree p={[-1.0, 0, -6.0]} s={1.3} />
          <StreetLamp p={[1.6, 0, -1.6]} on={night} />
          {rain ? <RainFall area={[12, 8]} /> : null}
        </>
      );
      break;
    case "apartman_kapisi": {
      const fl = random(`bulb-${Math.floor(frame / 3)}`) > 0.12 ? 1 : 0.3;
      body = (
        <>
          {/* iç taraf (z>0) */}
          <Floor tex={woodFloor("#6a4a36", "#4a3426")} w={6} d={4} z={1.8} />
          <Wall tex={wallpaper("#4f4234", "#5a4c3c", "duz")} p={[-1.85, 1.45, 0]} w={2.75} h={2.9} />
          <Wall tex={wallpaper("#4f4234", "#5a4c3c", "duz")} p={[1.85, 1.45, 0]} w={2.75} h={2.9} />
          <Wall tex={wallpaper("#4f4234", "#5a4c3c", "duz")} p={[0, 2.5, 0]} w={1.0} h={0.8} />
          <Door3D p={[0, 0, 0]} open={doorOpen} />
          <Ceiling y={2.9} w={6} d={8} z={0} c="#3a3028" />
          <Box d={[0.04, 0.3, 0.1]} c="#2b2420" p={[1.6, 1.6, 0.05]} rad={0.01} line={0.004} />
          {/* dış taraf: merdiven boşluğu */}
          <Floor tex={tileFloor("#1a231e", "#101612")} w={4} d={4} z={-2} />
          <Wall color="#2a3a32" p={[0, 1.6, -3.6]} w={4} h={3.2} />
          {Array.from({ length: 8 }).map((_, i) => <Box key={i} d={[1.4, 0.18, 0.3]} c="#3a4a40" p={[1.4, 0.09 + i * 0.18, -1.0 - i * 0.3]} rad={0.01} line={0.005} />)}
          <Cyl r1={0.03} h={0.4} c="#222" p={[0, 2.85, -1.6]} line={0} />
          <Ball rad={0.06} c="#eaffd8" p={[0, 2.6, -1.6]} line={0} />
          <pointLight position={[0, 2.4, -1.6]} color="#d8f0c8" intensity={2.2 * fl} distance={5} decay={1.2} />
        </>
      );
      break;
    }
    case "koridor":
      body = (
        <>
          <Floor tex={woodFloor("#3a2c22", "#2a1e16")} w={2.6} d={10} z={-2} />
          <Wall color="#1f2c3b" p={[-1.3, 1.4, -2]} r={Math.PI / 2} w={10} h={2.8} />
          <Wall color="#17212d" p={[1.3, 1.4, -2]} r={-Math.PI / 2} w={10} h={2.8} />
          <Wall color="#0a0f15" p={[0, 1.4, -6.5]} w={2.6} h={2.8} />
          <Ceiling y={2.8} w={2.6} d={10} z={-2} c="#141a22" />
          <Door3D p={[-1.28, 0, -1.8]} r={90} c="#3a2a22" />
          <Door3D p={[1.28, 0, -3.6]} r={-90} c="#3a2a22" />
          <directionalLight position={[3, 3, -1]} color="#9fc0e8" intensity={0.6} />
        </>
      );
      break;
    case "merdiven": {
      const fl = random(`bulb2-${Math.floor(frame / 3)}`) > 0.12 ? 1 : 0.3;
      body = (
        <>
          <Floor tex={tileFloor("#1a231e", "#101612")} w={5} d={8} />
          <Wall color="#2a3a32" p={[0, 2, -3]} w={5} h={4} />
          <Ceiling y={4} w={5} d={8} z={0} c="#1a241e" />
          {Array.from({ length: 10 }).map((_, i) => <Box key={i} d={[1.6, 0.18, 0.3]} c="#3a4a40" p={[0.8, 0.09 + i * 0.18, -0.8 - i * 0.3]} rad={0.01} line={0.005} />)}
          <Ball rad={0.06} c="#eaffd8" p={[0, 3, -1.5]} line={0} />
          <pointLight position={[0, 2.8, -1.5]} color="#d8f0c8" intensity={2.4 * fl} distance={6} decay={1.2} />
        </>
      );
      break;
    }
  }
  return (
    <group>
      <Lighting time={time} flash={flash} indoor={indoor} />
      {body}
    </group>
  );
};
