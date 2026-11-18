/* Mekân kütüphanesi. Her mekân iki katman verir: "bg" (karakterlerin arkası) ve "fg" (önü: masa, tezgâh vb.).
   `MARKS` karakterlerin duracağı önerilen noktalardır (x = karakter merkezi, y = ayak çizgisi, size = boy px). */
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import {
  Armchair, Bed, Bookshelf, CafeCounter, CafeTable, Car, CeilingLamp, Chalkboard, Chandelier, CoffeeTable, Curtains,
  Desk, DiningTable, Door, FloorLamp, Frame, HospitalBed, Kitchen, O, Plant, PoliceDesk, Rug, SchoolDesk, Sofa,
  StreetLamp, TimeOfDay, Tombstone, Tree, TV, WallClock, Wardrobe, WindowView, SKY,
  Bird, CellDoor, IronBed, IronBedBlanket, WindowBars,
} from "./props";
import { Corridor, FrontDoor, Stairwell } from "../../dizi/Sets";

export const W = 1080;
export const H = 1920;

export type SetName =
  | "salon" | "mutfak" | "yatak_odasi" | "cocuk_odasi" | "ofis" | "hastane_odasi" | "hastane_koridoru"
  | "sokak" | "kafe" | "sinif" | "mezarlik" | "villa" | "karakol" | "park" | "apartman_kapisi" | "koridor" | "merdiven" | "hucre";

export type Mark = { x: number; y: number; size: number; sit?: boolean };

export const SET_INFO: Record<SetName, { title: string; marks: Record<string, Mark> }> = {
  salon: { title: "Salon", marks: { sol: { x: 300, y: 1760, size: 1250 }, orta: { x: 540, y: 1780, size: 1270 }, sag: { x: 790, y: 1760, size: 1250 }, kanepe: { x: 400, y: 1630, size: 1150, sit: true } } },
  mutfak: { title: "Mutfak", marks: { sol: { x: 280, y: 1760, size: 1250 }, orta: { x: 540, y: 1780, size: 1270 }, sag: { x: 800, y: 1760, size: 1250 } } },
  yatak_odasi: { title: "Yatak odası", marks: { sol: { x: 260, y: 1780, size: 1250 }, orta: { x: 540, y: 1790, size: 1270 }, sag: { x: 820, y: 1780, size: 1250 }, yatak: { x: 560, y: 1520, size: 1100, sit: true } } },
  cocuk_odasi: { title: "Çocuk odası", marks: { sol: { x: 300, y: 1780, size: 1250 }, orta: { x: 540, y: 1790, size: 1270 }, sag: { x: 800, y: 1780, size: 1250 } } },
  ofis: { title: "Ofis", marks: { masa: { x: 560, y: 1640, size: 1150, sit: true }, sol: { x: 260, y: 1780, size: 1250 }, sag: { x: 840, y: 1780, size: 1250 } } },
  hastane_odasi: { title: "Hastane odası", marks: { sol: { x: 220, y: 1800, size: 1250 }, sag: { x: 860, y: 1800, size: 1250 }, yatak: { x: 470, y: 1500, size: 1050, sit: true } } },
  hucre: { title: "Tımarhane odası", marks: { yatak: { x: 590, y: 1238, size: 950 }, orta: { x: 520, y: 1780, size: 1250 }, kapi: { x: 860, y: 1780, size: 1250 } } },
  hastane_koridoru: { title: "Hastane koridoru", marks: { sol: { x: 320, y: 1780, size: 1250 }, orta: { x: 540, y: 1790, size: 1270 }, sag: { x: 780, y: 1780, size: 1250 } } },
  sokak: { title: "Sokak", marks: { sol: { x: 300, y: 1800, size: 1250 }, orta: { x: 540, y: 1810, size: 1270 }, sag: { x: 790, y: 1800, size: 1250 } } },
  kafe: { title: "Kafe", marks: { sol: { x: 280, y: 1780, size: 1250 }, orta: { x: 540, y: 1790, size: 1270 }, sag: { x: 820, y: 1780, size: 1250 }, tezgah: { x: 540, y: 1480, size: 1150 } } },
  sinif: { title: "Sınıf", marks: { ogretmen: { x: 760, y: 1640, size: 1200 }, sol: { x: 280, y: 1800, size: 1250 }, orta: { x: 540, y: 1810, size: 1270 } } },
  mezarlik: { title: "Mezarlık", marks: { sol: { x: 300, y: 1820, size: 1250 }, orta: { x: 540, y: 1830, size: 1270 }, sag: { x: 800, y: 1820, size: 1250 } } },
  villa: { title: "Villa salonu", marks: { sol: { x: 300, y: 1800, size: 1250 }, orta: { x: 540, y: 1810, size: 1270 }, sag: { x: 800, y: 1800, size: 1250 }, merdiven: { x: 820, y: 1260, size: 900 } } },
  karakol: { title: "Karakol", marks: { masa: { x: 560, y: 1520, size: 1150, sit: true }, sol: { x: 260, y: 1800, size: 1250 }, sag: { x: 840, y: 1800, size: 1250 } } },
  park: { title: "Park", marks: { sol: { x: 300, y: 1800, size: 1250 }, orta: { x: 540, y: 1810, size: 1270 }, sag: { x: 800, y: 1800, size: 1250 }, bank: { x: 540, y: 1700, size: 1150, sit: true } } },
  apartman_kapisi: { title: "Apartman kapısı (içeriden)", marks: { kapi: { x: 540, y: 1740, size: 1300 } } },
  koridor: { title: "Karanlık koridor", marks: { orta: { x: 540, y: 1840, size: 1500 } } },
  merdiven: { title: "Apartman merdiveni", marks: { orta: { x: 540, y: 1760, size: 1300 } } },
};

const Wall: React.FC<{ c1: string; c2: string; pattern?: "elmas" | "cizgi" | "nokta" | "yildiz" | "yok"; pc?: string; h?: number }> = ({ c1, c2, pattern = "elmas", pc = "#00000018", h = 1500 }) => (
  <g>
    <defs>
      <linearGradient id={`wall-${c1}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c1} />
        <stop offset="1" stopColor={c2} />
      </linearGradient>
      <pattern id={`pat-${pattern}-${c1}`} width="90" height="90" patternUnits="userSpaceOnUse">
        {pattern === "elmas" ? <path d="M 45 22 L 54 45 L 45 68 L 36 45 Z" fill={pc} /> : null}
        {pattern === "cizgi" ? <rect x={0} y={0} width={10} height={90} fill={pc} /> : null}
        {pattern === "nokta" ? <circle cx={45} cy={45} r={6} fill={pc} /> : null}
        {pattern === "yildiz" ? <path d="M 45 30 l 5 12 l 13 1 l -10 8 l 4 13 l -12 -7 l -12 7 l 4 -13 l -10 -8 l 13 -1 z" fill={pc} /> : null}
      </pattern>
    </defs>
    <rect width={W} height={h} fill={`url(#wall-${c1})`} />
    {pattern !== "yok" ? <rect width={W} height={h} fill={`url(#pat-${pattern}-${c1})`} /> : null}
  </g>
);

const WoodFloor: React.FC<{ y?: number; c1?: string; c2?: string }> = ({ y = 1500, c1 = "#7a5236", c2 = "#4a3022" }) => (
  <g>
    <defs>
      <linearGradient id={`floor-${c1}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c1} />
        <stop offset="1" stopColor={c2} />
      </linearGradient>
    </defs>
    <rect y={y} width={W} height={H - y} fill={`url(#floor-${c1})`} />
    {new Array(9).fill(0).map((_, i) => (
      <path key={i} d={`M ${i * 170 - 260} ${H} L ${i * 125 + 40} ${y}`} stroke="#00000030" strokeWidth={3} />
    ))}
    <rect y={y - 24} width={W} height={28} fill="#00000040" />
  </g>
);

const TileFloor: React.FC<{ y?: number; c?: string; line?: string }> = ({ y = 1500, c = "#d8dde2", line = "#b8bec6" }) => (
  <g>
    <rect y={y} width={W} height={H - y} fill={c} />
    {new Array(8).fill(0).map((_, i) => (
      <path key={i} d={`M ${i * 190 - 260} ${H} L ${i * 140 + 50} ${y}`} stroke={line} strokeWidth={3} />
    ))}
    {[0.15, 0.38, 0.66].map((p, i) => (
      <path key={i} d={`M 0 ${y + (H - y) * p} H ${W}`} stroke={line} strokeWidth={3} />
    ))}
    <rect y={y - 20} width={W} height={22} fill="#00000025" />
  </g>
);

const SetBG: React.FC<{ name: SetName; time: TimeOfDay; rain?: boolean; flash?: number; doorOpen?: number; kus?: React.ReactNode }> = ({ name, time, rain, flash = 0, doorOpen = 0, kus }) => {
  const props = { kus };
  const night = time === "gece";
  switch (name) {
    case "salon":
      return (
        <g>
          <Wall c1={night ? "#1b2735" : "#e9d9b8"} c2={night ? "#2a3a4b" : "#d9c39a"} pc={night ? "#33465a88" : "#c8a87a55"} />
          <WoodFloor />
          <WindowView x={600} y={330} w={380} h={600} time={time} rain={rain} id="salon" flash={flash} />
          <Curtains x={600} y={310} w={380} h={720} c="#6e2c2f" c2="#4f1d21" />
          <Frame x={130} y={540} art="yirtik" />
          <WallClock x={260} y={380} />
          <FloorLamp x={40} y={880} on={time !== "gunduz"} />
          <Rug x={160} y={1620} />
          <Sofa x={110} y={1320} s={0.95} />
          <Plant x={930} y={1390} s={0.9} />
        </g>
      );
    case "mutfak":
      return (
        <g>
          <Wall c1={night ? "#24323a" : "#f0e6cf"} c2={night ? "#2f3e46" : "#e0d2b2"} pattern="nokta" pc={night ? "#3a4a5288" : "#d6c49e88"} />
          <TileFloor c={night ? "#3a4248" : "#d8d2c4"} line={night ? "#2a3036" : "#bfb7a6"} />
          <WindowView x={360} y={200} w={300} h={300} time={time} rain={rain} id="mutfak" city={false} flash={flash} />
          <Kitchen x={60} y={560} s={1.0} />
          <CeilingLamp x={540} y={0} on={time !== "gunduz"} />
        </g>
      );
    case "yatak_odasi":
      return (
        <g>
          <Wall c1={night ? "#22283c" : "#dfe4f0"} c2={night ? "#2c3450" : "#c9d0e2"} pattern="cizgi" pc={night ? "#30385488" : "#b8c0d888"} />
          <WoodFloor c1="#8a6248" c2="#5a3e2c" />
          <WindowView x={80} y={340} w={300} h={460} time={time} rain={rain} id="yatak" flash={flash} />
          <Curtains x={80} y={320} w={300} h={560} c="#8a7aa8" c2="#6a5a88" />
          <Wardrobe x={700} y={720} />
          <Frame x={460} y={560} w={200} h={150} art="aile" />
          <Bed x={180} y={1300} s={0.95} />
        </g>
      );
    case "cocuk_odasi":
      return (
        <g>
          <Wall c1={night ? "#22304a" : "#cfe6f4"} c2={night ? "#2c3c5a" : "#b8d8ee"} pattern="yildiz" pc={night ? "#f2e48a55" : "#ffffffaa"} />
          <WoodFloor c1="#c9a070" c2="#9a7650" />
          <WindowView x={640} y={360} w={300} h={400} time={time} rain={rain} id="cocuk" flash={flash} city={false} />
          <Bookshelf x={70} y={820} s={0.9} />
          <Bed x={380} y={1360} s={0.75} c2="#e2879a" />
          <circle cx={900} cy={1700} r={60} fill="#e0503a" stroke={O} strokeWidth={5} />
          <path d="M 860 1670 Q 900 1700 940 1670" stroke="#fff" strokeWidth={8} fill="none" />
        </g>
      );
    case "ofis":
      return (
        <g>
          <Wall c1={night ? "#1e242c" : "#e4e6e8"} c2={night ? "#262e38" : "#cfd3d8"} pattern="yok" />
          <rect y={1500} width={W} height={420} fill={night ? "#2a2e34" : "#7a8088"} />
          <WindowView x={60} y={220} w={960} h={760} time={time} rain={rain} id="ofis" flash={flash} />
          <Bookshelf x={40} y={800} s={1} />
          <Plant x={900} y={1380} s={1} />
        </g>
      );
    case "hastane_odasi":
      return (
        <g>
          <Wall c1="#dfeceb" c2="#c7dbd9" pattern="yok" />
          <TileFloor c="#cfd8d6" line="#b2bebc" />
          <WindowView x={640} y={300} w={340} h={460} time={time} rain={rain} id="hastane" flash={flash} />
          <rect x={0} y={260} width={120} height={1240} fill="#9ec8c4" opacity={0.7} />
          <HospitalBed x={180} y={1380} s={0.9} />
        </g>
      );
    case "hucre": {
      const kus = props.kus;
      return (
        <g>
          <Wall c1="#c9d2cb" c2="#b6c1b9" pattern="yok" />
          {/* nem lekeleri */}
          <ellipse cx={180} cy={420} rx={120} ry={70} fill="#00000010" />
          <ellipse cx={980} cy={1180} rx={90} ry={160} fill="#00000012" />
          <TileFloor c="#b9c2bd" line="#a1aba6" />
          <defs>
            <clipPath id="hucre-win"><rect x={600} y={260} width={340} height={460} /></clipPath>
            <linearGradient id="hucre-beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fffbe8" stopOpacity="0.38" />
              <stop offset="1" stopColor="#fffbe8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <WindowView x={600} y={260} w={340} h={460} time={time} rain={rain} id="hucre" flash={flash} city={false} />
          {kus ? <g clipPath="url(#hucre-win)">{kus}</g> : null}
          <WindowBars x={600} y={260} w={340} h={460} />
          {/* pencereden düşen ışık */}
          <path d="M 600 720 L 940 720 L 760 1500 L 200 1500 Z" fill="url(#hucre-beam)" />
          <CellDoor x={900} y={860} s={1} open={doorOpen} />
          <IronBed x={60} y={1240} s={1} />
        </g>
      );
    }
    case "hastane_koridoru":
      return (
        <g>
          <rect width={W} height={H} fill="#d8e6e4" />
          <path d="M 0 0 L 380 640 L 380 1260 L 0 1920 Z" fill="#c4d6d4" />
          <path d="M 1080 0 L 700 640 L 700 1260 L 1080 1920 Z" fill="#bccfcd" />
          <path d="M 380 1260 L 700 1260 L 1080 1920 L 0 1920 Z" fill="#b8c4c2" />
          <rect x={380} y={640} width={320} height={620} fill="#e8f0ef" />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={480 - i * 60} y={120 + i * 170} width={120 + i * 120} height={24 + i * 10} fill="#fffef4" opacity={0.9} />
          ))}
          <path d="M 80 400 L 240 600 L 240 1300 L 80 1500 Z" fill="#7aa8c8" stroke={O} strokeWidth={4} />
          <path d="M 1000 400 L 840 600 L 840 1300 L 1000 1500 Z" fill="#7aa8c8" stroke={O} strokeWidth={4} />
          <rect x={470} y={700} width={140} height={60} rx={8} fill="#2a8a5a" />
        </g>
      );
    case "sokak":
      return (
        <g>
          <rect width={W} height={H} fill={SKY[time][0]} />
          <rect y={0} width={W} height={900} fill={SKY[time][1]} opacity={0.6} />
          {[
            [-40, 300, 380, "#c48a6a"],
            [330, 160, 420, "#8a9aaa"],
            [740, 260, 380, "#d0b48a"],
          ].map(([x, y, w, c], i) => (
            <g key={i}>
              <rect x={x as number} y={y as number} width={w as number} height={1500 - (y as number)} fill={c as string} stroke={O} strokeWidth={5} />
              {new Array(12).fill(0).map((_, j) => (
                <rect key={j} x={(x as number) + 40 + (j % 3) * 110} y={(y as number) + 60 + Math.floor(j / 3) * 220} width={70} height={110} fill={night ? (random(`sw-${i}-${j}`) > 0.5 ? "#ffd27a" : "#1a2230") : "#bcd4e6"} stroke={O} strokeWidth={4} />
              ))}
            </g>
          ))}
          <rect y={1500} width={W} height={140} fill="#a8a29a" stroke={O} strokeWidth={4} />
          <rect y={1640} width={W} height={280} fill="#3a3c40" />
          <path d="M 0 1780 H 1080" stroke="#e8e0c0" strokeWidth={10} strokeDasharray="80 60" />
          <StreetLamp x={900} y={600} on={night} />
          <Tree x={60} y={1500} s={0.9} />
          <Car x={300} y={1560} s={0.9} c="#3a6a9a" />
        </g>
      );
    case "kafe":
      return (
        <g>
          <Wall c1="#e2c9a4" c2="#caa77a" pattern="cizgi" pc="#b8916244" h={1500} />
          <WoodFloor c1="#6a4a36" c2="#3a2a20" />
          <WindowView x={60} y={300} w={300} h={520} time={time} rain={rain} id="kafe" flash={flash} />
          <CafeCounter x={260} y={1180} s={0.85} />
          {[300, 540, 780].map((x) => (
            <g key={x}>
              <path d={`M ${x} 0 V 160`} stroke={O} strokeWidth={3} />
              <path d={`M ${x - 50} 220 L ${x + 50} 220 L ${x + 20} 160 L ${x - 20} 160 Z`} fill="#2a2a2a" />
              <circle cx={x} cy={228} r={14} fill="#ffe7a8" />
              <path d={`M ${x - 50} 220 L ${x - 220} 900 L ${x + 220} 900 L ${x + 50} 220 Z`} fill="#ffe7a8" opacity={0.08} />
            </g>
          ))}
        </g>
      );
    case "sinif":
      return (
        <g>
          <Wall c1="#e8e2c8" c2="#d6ceac" pattern="yok" />
          <rect y={1100} width={W} height={400} fill="#9ab09a" />
          <WoodFloor c1="#a07850" c2="#6a4a32" />
          <Chalkboard x={130} y={360} />
          <WallClock x={940} y={280} hour={9} s={0.8} />
        </g>
      );
    case "mezarlik":
      return (
        <g>
          <rect width={W} height={H} fill={night ? "#0e1520" : time === "aksam" ? "#b07a6a" : "#9aa8b4"} />
          <rect y={1250} width={W} height={670} fill={night ? "#1a2418" : "#5a6a4a"} />
          <Tree x={-20} y={1300} s={1.1} dead />
          <Tree x={840} y={1260} s={0.9} />
          <Tombstone x={140} y={1180} s={0.7} />
          <Tombstone x={780} y={1200} s={0.65} />
          <Tombstone x={430} y={1220} s={0.9} />
          <rect y={1250} width={W} height={200} fill="#ffffff" opacity={0.08} />
        </g>
      );
    case "villa":
      return (
        <g>
          <Wall c1="#f2ebe0" c2="#e2d6c2" pattern="cizgi" pc="#d8c8a844" />
          <rect y={1500} width={W} height={420} fill="#efe9e2" />
          {new Array(6).fill(0).map((_, i) => (
            <path key={i} d={`M 0 ${1540 + i * 70} H ${W}`} stroke="#d8d0c4" strokeWidth={2} />
          ))}
          <WindowView x={80} y={300} w={300} h={900} time={time} rain={rain} id="villa1" flash={flash} city={false} />
          <path d="M 640 1500 L 1080 900 L 1080 1500 Z" fill="#d8cbb4" stroke={O} strokeWidth={5} />
          {new Array(8).fill(0).map((_, i) => (
            <path key={i} d={`M ${640 + i * 55} ${1500 - i * 75} H 1080`} stroke="#b8a888" strokeWidth={5} />
          ))}
          <path d="M 640 1300 L 1080 700" stroke="#7a5236" strokeWidth={12} />
          <Frame x={460} y={420} w={200} h={280} art="portre" />
          <Chandelier x={540} y={0} s={1.1} />
        </g>
      );
    case "karakol":
      return (
        <g>
          <Wall c1="#cfd6d8" c2="#b8c0c2" pattern="yok" />
          <rect y={1000} width={W} height={500} fill="#8a9496" />
          <TileFloor c="#9aa0a2" line="#80888a" />
          <WindowView x={640} y={300} w={360} h={420} time={time} rain={rain} id="karakol" flash={flash} />
          {new Array(9).fill(0).map((_, i) => (
            <rect key={i} x={640} y={300 + i * 46} width={360} height={22} fill="#d8dcd0" opacity={0.85} />
          ))}
          <rect x={80} y={340} width={420} height={320} fill="#b08a5a" stroke={O} strokeWidth={6} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={110 + (i % 3) * 125} y={370 + Math.floor(i / 3) * 140} width={100} height={110} fill="#f4f0e4" stroke={O} strokeWidth={3} transform={`rotate(${(i - 2) * 3} ${160 + i * 60} 420)`} />
          ))}
          <path d="M 160 420 L 300 520 L 420 400" stroke="#c22" strokeWidth={4} fill="none" />
        </g>
      );
    case "park":
      return (
        <g>
          <rect width={W} height={H} fill={SKY[time][0]} />
          <rect y={700} width={W} height={600} fill={SKY[time][1]} opacity={0.6} />
          <rect y={1300} width={W} height={620} fill={night ? "#1e2e1e" : "#7ab060"} />
          <path d="M 300 1920 Q 540 1500 700 1300 L 780 1300 Q 640 1500 760 1920 Z" fill={night ? "#3a3a32" : "#d8c8a0"} />
          <Tree x={60} y={1360} s={1.1} />
          <Tree x={820} y={1330} s={0.9} />
          <StreetLamp x={940} y={620} s={0.8} on={night} />
          <g>
            <rect x={300} y={1560} width={480} height={30} fill="#7a5236" stroke={O} strokeWidth={4} />
            <rect x={300} y={1470} width={480} height={26} fill="#7a5236" stroke={O} strokeWidth={4} />
            <path d="M 330 1590 V 1700 M 750 1590 V 1700" stroke="#2a2a2a" strokeWidth={12} />
          </g>
        </g>
      );
    default:
      return null;
  }
};

/** Elements that sit IN FRONT of the characters. */
const SetFG: React.FC<{ name: SetName }> = ({ name }) => {
  switch (name) {
    case "salon":
      return <CoffeeTable x={340} y={1780} s={0.9} />;
    case "mutfak":
      return <DiningTable x={190} y={1640} s={1} chairs={false} />;
    case "ofis":
      return <Desk x={240} y={1500} s={1.05} />;
    case "kafe":
      return <CafeTable x={720} y={1720} s={0.9} />;
    case "sinif":
      return (
        <g>
          <SchoolDesk x={60} y={1640} s={1.1} />
          <SchoolDesk x={600} y={1660} s={1.1} />
        </g>
      );
    case "karakol":
      return <PoliceDesk x={160} y={1460} s={1} />;
    case "hucre":
      return <IronBedBlanket x={385} y={1230} s={1} />;
    default:
      return null;
  }
};

const LIGHT: Record<TimeOfDay, React.CSSProperties | null> = {
  gunduz: null,
  aksam: { backgroundColor: "rgba(255,140,60,0.16)", mixBlendMode: "soft-light" },
  gece: { backgroundColor: "rgba(10,20,60,0.35)", mixBlendMode: "multiply" },
};

export const SetLayer: React.FC<{
  name: SetName;
  layer: "bg" | "fg";
  time?: TimeOfDay;
  rain?: boolean;
  flash?: number;
  doorOpen?: number;
  children?: React.ReactNode;
  /** pencere dışındaki kuş (hücre) — SVG düğümü */
  kus?: React.ReactNode;
}> = ({ name, layer, time = "gunduz", rain, flash = 0, doorOpen = 0, children, kus }) => {
  const frame = useCurrentFrame();
  void frame;
  // special sets with their own HTML structure
  if (name === "apartman_kapisi") return layer === "bg" ? <FrontDoor open={doorOpen}>{children}</FrontDoor> : null;
  if (name === "koridor") return layer === "bg" ? <Corridor flash={flash} /> : null;
  if (name === "merdiven") return layer === "bg" ? <Stairwell /> : null;
  if (layer === "fg") {
    return (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
          <SetFG name={name} />
        </svg>
        {LIGHT[time] ? <AbsoluteFill style={LIGHT[time]!} /> : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <SetBG name={name} time={time} rain={rain} flash={flash} doorOpen={doorOpen} kus={kus} />
      </svg>
      {LIGHT[time] ? <AbsoluteFill style={LIGHT[time]!} /> : null}
      <AbsoluteFill style={{ backgroundColor: "#cfe0ff", opacity: flash * 0.3, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

export { Door, Armchair, TV, Bird };
