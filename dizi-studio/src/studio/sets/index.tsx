/* Mekân kütüphanesi. Her mekân iki katman verir: "bg" (karakterlerin arkası) ve "fg" (önü: masa, tezgâh vb.).
   `MARKS` karakterlerin duracağı önerilen noktalardır (x = karakter merkezi, y = ayak çizgisi, size = boy px). */
import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import {
  Armchair, Bed, Bookshelf, CafeCounter, CafeTable, Car, CeilingLamp, Chalkboard, Chandelier, CoffeeTable, Curtains,
  Desk, DiningTable, Door, FloorLamp, Frame, HospitalBed, Kitchen, O, Plant, PoliceDesk, Rug, SchoolDesk, Sofa,
  StreetLamp, TimeOfDay, Tombstone, Tree, TV, WallClock, Wardrobe, WindowView, SKY,
  Bird, CellDoor, IronBed, WindowBars, HucreClock, WallTally, SecurityCam, VentGrille, WardDoor,
} from "./props";
import { Corridor, FrontDoor, Stairwell } from "../../dizi/Sets";

export const W = 1080;
export const H = 1920;

export type SetName =
  | "salon" | "mutfak" | "yatak_odasi" | "cocuk_odasi" | "ofis" | "hastane_odasi" | "hastane_koridoru"
  | "sokak" | "kafe" | "sinif" | "mezarlik" | "villa" | "karakol" | "park" | "apartman_kapisi" | "koridor" | "merdiven" | "hucre" | "hucre1" | "kogus_koridoru" | "ortak_salon" | "ucak_kabin";

export type Mark = { x: number; y: number; size: number; sit?: boolean };

export const SET_INFO: Record<SetName, { title: string; marks: Record<string, Mark> }> = {
  salon: { title: "Salon", marks: { sol: { x: 300, y: 1760, size: 1250 }, orta: { x: 540, y: 1780, size: 1270 }, sag: { x: 790, y: 1760, size: 1250 }, kanepe: { x: 400, y: 1630, size: 1150, sit: true } } },
  mutfak: { title: "Mutfak", marks: { sol: { x: 280, y: 1760, size: 1250 }, orta: { x: 540, y: 1780, size: 1270 }, sag: { x: 800, y: 1760, size: 1250 } } },
  yatak_odasi: { title: "Yatak odası", marks: { sol: { x: 260, y: 1780, size: 1250 }, orta: { x: 540, y: 1790, size: 1270 }, sag: { x: 820, y: 1780, size: 1250 }, yatak: { x: 560, y: 1520, size: 1100, sit: true } } },
  cocuk_odasi: { title: "Çocuk odası", marks: { sol: { x: 300, y: 1780, size: 1250 }, orta: { x: 540, y: 1790, size: 1270 }, sag: { x: 800, y: 1780, size: 1250 } } },
  ofis: { title: "Ofis", marks: { masa: { x: 560, y: 1640, size: 1150, sit: true }, sol: { x: 260, y: 1780, size: 1250 }, sag: { x: 840, y: 1780, size: 1250 } } },
  hastane_odasi: { title: "Hastane odası", marks: { sol: { x: 220, y: 1800, size: 1250 }, sag: { x: 860, y: 1800, size: 1250 }, yatak: { x: 470, y: 1500, size: 1050, sit: true } } },
  // hucre1: ilk tasarım (bölüm 1 parça 1-2 bununla çekildi; süreklilik için korunur)
  kogus_koridoru: { title: "Koğuş koridoru", marks: { b: { x: 380, y: 1790, size: 1150 }, n: { x: 680, y: 1790, size: 1100 } } },
  ucak_kabin: { title: "Uçak kabini (business)", marks: { emir: { x: 540, y: 1600, size: 1080, sit: true }, hostes: { x: 925, y: 1860, size: 1220 } } },
  ortak_salon: { title: "Ortak salon", marks: { b0: { x: -300, y: 1800, size: 960 }, n0: { x: -600, y: 1800, size: 920 }, b: { x: 330, y: 1800, size: 960 }, n: { x: 700, y: 1800, size: 920 }, s1: { x: 120, y: 1490, size: 680, sit: true }, s4: { x: 980, y: 1480, size: 680, sit: true }, ayak_tv: { x: 870, y: 1150, size: 480 }, volta: { x: 540, y: 1260, size: 420 }, tavan: { x: 220, y: 1150, size: 480 }, k: { x: 110, y: 1810, size: 1000 }, n2: { x: 540, y: 1800, size: 920 } } },
  hucre1: { title: "Tımarhane odası (ilk)", marks: { yatak: { x: 590, y: 1238, size: 950 }, yatak_yani: { x: 905, y: 1575, size: 960 }, kapi: { x: 1000, y: 1600, size: 980 }, kapi_ic: { x: 1010, y: 1500, size: 900 }, yatak_yani2: { x: 800, y: 1500, size: 880 }, doktor: { x: 960, y: 1660, size: 1000 } } },
  hucre: { title: "Tımarhane odası", marks: { yatak: { x: 520, y: 1238, size: 820 }, orta: { x: 480, y: 1780, size: 1250 }, kapi: { x: 900, y: 1760, size: 1220 }, yatak_yani: { x: 880, y: 1720, size: 1200 }, yatak_alti: { x: 420, y: 1640, size: 1100 }, kapi_dibi: { x: 700, y: 1700, size: 1150 } } },
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

const SetBG: React.FC<{ name: SetName; time: TimeOfDay; rain?: boolean; flash?: number; doorOpen?: number; kus?: React.ReactNode; saat?: string; sallanan?: number; kaydir?: number; tv?: string; turb?: number }> = ({ name, time, rain, flash = 0, doorOpen = 0, kus, saat, sallanan, kaydir, tv, turb }) => {
  const frame = useCurrentFrame();
  const props = { kus, saat, frame, sallanan, kaydir, tv, turb };
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
          <defs>
            <clipPath id="hucre-win"><rect x={600} y={260} width={340} height={460} /></clipPath>
            <linearGradient id="hucre-beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fffbe8" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fffbe8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hucre-cloud" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d9e0e3" />
              <stop offset="1" stopColor="#bfc8cc" />
            </linearGradient>
            <radialGradient id="hucre-vig" cx="0.5" cy="0.45" r="0.75">
              <stop offset="0.55" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.45" />
            </radialGradient>
          </defs>
          {/* kurum boyası: üstte soluk, altta koyu yağlı boya, aralarında koyu şerit */}
          <rect width={W} height={1500} fill="#c3ccc5" />
          <rect y={1000} width={W} height={500} fill="#6f8279" />
          <rect y={988} width={W} height={14} fill="#4e5e56" />
          {/* damlama izli lekeler ve çatlak */}
          <path d="M 120 330 Q 190 300 250 340 Q 236 420 220 480 L 214 560 L 206 470 Q 160 430 120 330 Z" fill="#00000014" />
          <path d="M 1000 1040 Q 1050 1100 1040 1200 L 1032 1290 L 1024 1180 Q 980 1120 1000 1040 Z" fill="#00000018" />
          <path d="M 330 140 L 352 210 L 340 260 L 366 330" stroke="#5c6862" strokeWidth={3} fill="none" opacity={0.6} />
          <TileFloor c="#9aa49e" line="#848e88" />
          <WindowView x={600} y={260} w={340} h={460} time={time} rain={rain} id="hucre" flash={flash} city={false} />
          <g clipPath="url(#hucre-win)">
            <rect x={600} y={260} width={340} height={460} fill="url(#hucre-cloud)" opacity={0.9} />
            <ellipse cx={700} cy={360} rx={110} ry={40} fill="#e6eaec" opacity={0.7} />
            <ellipse cx={860} cy={460} rx={130} ry={46} fill="#cdd4d7" opacity={0.7} />
            {kus}
          </g>
          <WindowBars x={600} y={260} w={340} h={460} />
          {/* gün çentikleri ve 183 (pencerenin altında, Berkay'ın kazıdığı) */}
          <WallTally x={612} y={752} s={0.72} groups={8} text="183" />
          <HucreClock x={240} y={420} s={1} time={props.saat ?? "07:14"} />
          <SecurityCam x={1010} y={70} s={1} />
          <VentGrille x={330} y={150} s={1} />
          {/* pencereden düşen ışık + parmaklık gölgeleri */}
          <path d="M 600 720 L 940 720 L 760 1500 L 200 1500 Z" fill="url(#hucre-beam)" />
          {[0, 1, 2, 3, 4].map((i) => {
            const t = (i + 1) / 6;
            const x1 = 600 + 340 * t;
            const x2 = 200 + 560 * t;
            return <path key={i} d={`M ${x1 - 5} 720 L ${x1 + 5} 720 L ${x2 + 14} 1500 L ${x2 - 14} 1500 Z`} fill="#26302b" opacity={0.18} />;
          })}
          {/* toz zerreleri */}
          {new Array(14).fill(0).map((_, i) => {
            const fr = props.frame ?? 0;
            const px = 420 + random(`dz${i}`) * 420 + Math.sin((fr + i * 40) / 60) * 20;
            const py = 800 + ((random(`dy${i}`) * 600 + fr * 0.6) % 600);
            return <circle key={i} cx={px} cy={py} r={2 + random(`dr${i}`) * 2} fill="#fffbe8" opacity={0.35} />;
          })}
          <CellDoor x={780} y={860} s={1} open={doorOpen} />
          <IronBed x={30} y={1240} s={0.86} />
          <rect width={W} height={H} fill="url(#hucre-vig)" />
        </g>
      );
    }
    case "hucre1": {
      const kus = props.kus;
      return (
        <g>
          <Wall c1="#c9d2cb" c2="#b6c1b9" pattern="yok" />
          <ellipse cx={180} cy={420} rx={120} ry={70} fill="#00000010" />
          <ellipse cx={980} cy={1180} rx={90} ry={160} fill="#00000012" />
          <TileFloor c="#b9c2bd" line="#a1aba6" />
          <defs>
            <clipPath id="hucre1-win"><rect x={600} y={260} width={340} height={460} /></clipPath>
            <linearGradient id="hucre1-beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fffbe8" stopOpacity="0.38" />
              <stop offset="1" stopColor="#fffbe8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <WindowView x={600} y={260} w={340} h={460} time={time} rain={rain} id="hucre1" flash={flash} city={false} />
          {kus ? <g clipPath="url(#hucre1-win)">{kus}</g> : null}
          <WindowBars x={600} y={260} w={340} h={460} />
          <path d="M 600 720 L 940 720 L 760 1500 L 200 1500 Z" fill="url(#hucre1-beam)" />
          <CellDoor x={900} y={860} s={1} open={doorOpen} />
          <IronBed x={60} y={1240} s={1} />
        </g>
      );
    }
    case "kogus_koridoru": {
      // uzun koridor: kamera yürüyenleri takip eder, koridor sağdan sola akar (props.kaydir = dünya kayması px)
      const fr = props.frame ?? 0;
      const off = props.kaydir ?? 0;
      const doors: [number, string][] = [[300, "11"], [1196, "12"], [2756, "13"], [3796, "14"], [4800, "15"], [5700, "16"]];
      const lights = new Array(20).fill(0).map((_, i) => i * 380 - 200);
      const extras: [number, "bank" | "sondurucu" | "pano"][] = [[1900, "bank"], [2260, "sondurucu"], [3300, "pano"], [4350, "bank"]];
      return (
        <g>
          <rect width={W} height={1500} fill="#c8d0c6" />
          <rect y={1040} width={W} height={460} fill="#7f9087" />
          <rect y={1030} width={W} height={12} fill="#55645c" />
          <rect width={W} height={200} fill="#b6beb4" />
          <TileFloor c="#a8b2aa" line="#949e96" />
          <g transform={`translate(${-off} 0)`}>
            {lights.map((lx, i) => (
              <g key={i}>
                <rect x={lx - 110} y={150} width={220} height={26} rx={6} fill="#f6fbf2" opacity={i === 4 && fr % 97 < 3 ? 0.4 : 1} />
                <path d={`M ${lx - 140} 176 L ${lx + 140} 176 L ${lx + 260} 1500 L ${lx - 260} 1500 Z`} fill="#fbfff0" opacity={0.06} />
              </g>
            ))}
            {new Array(30).fill(0).map((_, i) => <path key={`f${i}`} d={`M ${i * 260 - 200} 1500 L ${i * 260 - 380} 1920`} stroke="#949e96" strokeWidth={4} />)}
            {extras.map(([ex, k], i) =>
              k === "bank" ? (
                <g key={`e${i}`}><rect x={ex - 150} y={1300} width={300} height={40} rx={8} fill="#7a5a44" stroke={O} strokeWidth={5} /><rect x={ex - 130} y={1340} width={16} height={150} fill="#4a4e50" /><rect x={ex + 114} y={1340} width={16} height={150} fill="#4a4e50" /></g>
              ) : k === "sondurucu" ? (
                <g key={`e${i}`}><rect x={ex - 30} y={1180} width={60} height={150} rx={20} fill="#c43a2a" stroke={O} strokeWidth={5} /><rect x={ex - 14} y={1150} width={28} height={36} fill="#2a2a2a" /></g>
              ) : (
                <g key={`e${i}`}><rect x={ex - 120} y={620} width={240} height={300} fill="#e8ecef" stroke={O} strokeWidth={5} />{[0, 1, 2, 3].map((r) => <rect key={r} x={ex - 90} y={660 + r * 56} width={180 - r * 30} height={18} fill="#b8c0c4" />)}</g>
              ),
            )}
            {doors.map(([dx, no]) => (
              <WardDoor key={no} x={dx - 140} y={860} s={1} no={no} shake={props.sallanan === Number(no) ? Math.sin(fr * 2.4) * 6 : 0} />
            ))}
          </g>
          <path d="M 0 1480 H 1080" stroke="#5a665e" strokeWidth={6} />
        </g>
      );
    }
    case "ucak_kabin": {
      // business sınıfı, önden (burun tarafından) bakış: pencereler sol yan duvarda Emir'in yanında,
      // koridor sağda, arkada perspektifle uzaklaşan koltuk sıraları. Kaçış noktası (600, 900).
      const fr = props.frame ?? 0;
      const tb = props.turb ?? 0;
      const flick = tb ? (random(`fl${Math.floor(fr / 2)}`) > 0.72 ? 0.25 : 1) : 1;
      const wob = tb ? Math.sin(fr / 2.3) * 8 * tb + Math.sin(fr / 5.1) * 5 * tb : 0;
      const win = (cx: number, cy: number, rx: number, ry: number, id: string) => (
        <g key={id}>
          <defs>
            <clipPath id={id}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} /></clipPath>
            <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6fa8e0" />
              <stop offset="0.6" stopColor="#c2dcef" />
              <stop offset="1" stopColor="#f7dcaa" />
            </linearGradient>
          </defs>
          <ellipse cx={cx} cy={cy} rx={rx * 1.3} ry={ry * 1.22} fill="#ddd5c8" stroke={O} strokeWidth={Math.max(3, rx / 18)} />
          <g clipPath={`url(#${id})`}>
            <rect x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 2} fill={`url(#${id}g)`} />
            <g transform={`translate(0 ${wob * (rx / 100)})`}>
              {[0, 1, 2, 3].map((i) => {
                const x = cx - rx * 1.6 + ((i * rx * 0.9 - fr * 0.8 * (rx / 100)) % (rx * 3.6) + rx * 3.6) % (rx * 3.6);
                return <ellipse key={i} cx={x} cy={cy + ry * 0.45 + (i % 2) * ry * 0.12} rx={rx * 0.8} ry={ry * 0.2} fill="#ffffff" opacity={0.92} />;
              })}
              <rect x={cx - rx} y={cy + ry * 0.6} width={rx * 2} height={ry} fill="#fbfbff" opacity={0.95} />
            </g>
            <rect x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 0.32} fill="#efe8dc" />
          </g>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#b9b0a2" strokeWidth={Math.max(2, rx / 22)} />
        </g>
      );
      // arka sıralardaki koltuklar (derinlik s: 1 = yakın)
      const seat = (x: number, y: number, sc: number, k: string) => (
        <g key={k} transform={`translate(${x} ${y}) scale(${sc})`}>
          <rect x={-150} y={-260} width={300} height={420} rx={50} fill="#3b3432" stroke={O} strokeWidth={8} />
          <rect x={-100} y={-248} width={200} height={80} rx={18} fill="#f2ede4" stroke={O} strokeWidth={5} />
        </g>
      );
      return (
        <g>
          <defs>
            <linearGradient id="kabinDuvar" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#efe8dd" />
              <stop offset="1" stopColor="#d9d0c2" />
            </linearGradient>
            <linearGradient id="kabinHuzme" x1="0" y1="0" x2="1" y2="0.6">
              <stop offset="0" stopColor="#fff1cc" stopOpacity={0.55} />
              <stop offset="1" stopColor="#fff1cc" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* arka duvar (kabin bölmesi) */}
          <rect width={W} height={H} fill="#d4cbbd" />
          <rect x={470} y={720} width={260} height={340} fill="#e6dfd3" stroke={O} strokeWidth={4} />
          {/* tavan + bagaj dolapları */}
          <path d="M 300 0 L 820 0 L 690 720 L 510 720 Z" fill="#f6f2ea" />
          <path d="M 560 0 L 590 720 M 640 0 L 610 720" stroke="#e2dacd" strokeWidth={6} />
          <path d="M 0 0 L 300 0 L 510 720 L 470 760 L 0 360 Z" fill="#f2ede4" stroke={O} strokeWidth={6} />
          <path d="M 0 300 L 470 720" stroke="#d6cec1" strokeWidth={5} />
          <path d="M 1080 0 L 820 0 L 690 720 L 730 760 L 1080 360 Z" fill="#ece6dc" stroke={O} strokeWidth={6} />
          <path d="M 1080 300 L 730 720" stroke="#d2cabd" strokeWidth={5} />
          {/* tavan ışık şeritleri (titrer) */}
          <path d="M 20 330 L 478 742" stroke="#fff4d6" strokeWidth={9} opacity={0.9 * flick} />
          <path d="M 1060 330 L 722 742" stroke="#fff4d6" strokeWidth={9} opacity={0.9 * flick} />
          {/* sol yan duvar: pencereler (Emir'in yanında en büyüğü) */}
          <path d="M 0 360 L 470 760 L 470 1060 L 0 1560 Z" fill="url(#kabinDuvar)" stroke={O} strokeWidth={6} />
          {win(418, 880, 13, 24, "kw4")}
          {win(360, 870, 22, 40, "kw3")}
          {win(270, 862, 38, 66, "kw2")}
          {win(118, 860, 74, 120, "kw1")}
          {/* sağ yan duvar (koridorun karşısı) */}
          <path d="M 1080 360 L 730 760 L 730 1060 L 1080 1560 Z" fill="#dcd3c5" stroke={O} strokeWidth={6} />
          {win(776, 880, 11, 22, "kw7")}
          {win(830, 872, 18, 34, "kw6")}
          {win(920, 864, 30, 54, "kw5")}
          {/* zemin + koridor halısı */}
          <path d="M 0 1560 L 470 1060 L 730 1060 L 1080 1560 L 1080 1920 L 0 1920 Z" fill="#3e4458" />
          <path d="M 560 1060 L 680 1060 L 1080 1640 L 1080 1920 L 760 1920 Z" fill="#4a5270" />
          {/* arka sıralar: sol (Emir'in arkası) ve sağ (koridorun karşısı) */}
          {seat(520, 1000, 0.28, "s3")}
          {seat(470, 1060, 0.45, "s2")}
          {seat(700, 1000, 0.28, "s6")}
          {seat(790, 1070, 0.45, "s5")}
          {seat(930, 1180, 0.72, "s4")}
          {/* pencereden düşen gün ışığı (anahtar ışık soldan) */}
          <path d="M 60 760 L 190 760 L 760 1700 L 300 1760 Z" fill="url(#kabinHuzme)" opacity={0.6 * flick} />
          {/* Emir'in koltuğu */}
          <rect x={318} y={820} width={444} height={800} rx={70} fill="#3b3432" stroke={O} strokeWidth={7} />
          <rect x={350} y={850} width={380} height={140} rx={40} fill="#4a4240" />
          <rect x={400} y={836} width={280} height={110} rx={22} fill="#f2ede4" stroke={O} strokeWidth={4} />
          <path d="M 352 1080 L 728 1080 M 352 1260 L 728 1260" stroke="#2c2624" strokeWidth={5} />
          <rect x={278} y={1240} width={80} height={330} rx={22} fill="#332c2a" stroke={O} strokeWidth={6} />
          <rect x={722} y={1240} width={80} height={330} rx={22} fill="#332c2a" stroke={O} strokeWidth={6} />
          {/* titreşimde kabin kararması */}
          {tb ? <rect width={W} height={H} fill="#0a0c14" opacity={(1 - flick) * 0.35 + tb * 0.08} /> : null}
        </g>
      );
    }
    case "ortak_salon": {
      const fr = props.frame ?? 0;
      const on = props.tv !== "kapali";
      return (
        <g>
          <rect width={W} height={1500} fill="#c9d1c4" />
          <rect y={1060} width={W} height={440} fill="#8a9a8c" />
          <rect y={1050} width={W} height={12} fill="#5c6a60" />
          <rect width={W} height={190} fill="#b8c0b4" />
          {[200, 880].map((lx) => <rect key={lx} x={lx - 110} y={140} width={220} height={26} rx={6} fill="#f6fbf2" />)}
          <TileFloor c="#a9b3aa" line="#949e96" />
          {/* duvara monteli televizyon (kafesli koruma) */}
          <rect x={300} y={500} width={480} height={300} rx={16} fill="#121416" stroke={O} strokeWidth={8} />
          <rect x={322} y={520} width={436} height={260} fill={on ? "#2a4a6a" : "#0a0c0e"} />
          {on ? (
            <g>
              <rect x={322} y={520} width={436} height={260} fill="#3a5a7a" opacity={0.6 + 0.2 * Math.sin(fr / 7)} />
              <rect x={322} y={720} width={436} height={40} fill="#b8202a" />
              <rect x={340} y={732} width={220} height={16} rx={4} fill="#f2f2f2" />
            </g>
          ) : (
            <path d="M 340 540 L 420 540 L 360 640 Z" fill="#ffffff" opacity={0.08} />
          )}
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${300 + i * 96} 500 V 800`} stroke="#6a7276" strokeWidth={4} opacity={0.7} />)}
          <rect x={530} y={800} width={20} height={60} fill="#4a5054" />
          {/* boş plastik sandalyeler */}
          {[[120, 1380], [300, 1400], [820, 1390], [980, 1370]].map(([cx, cy], i) => (
            <g key={i}>
              <rect x={cx - 70} y={cy - 150} width={140} height={110} rx={18} fill="#6a8aa0" stroke={O} strokeWidth={5} />
              <rect x={cx - 80} y={cy - 40} width={160} height={30} rx={10} fill="#5a7a90" stroke={O} strokeWidth={5} />
              <path d={`M ${cx - 66} ${cy - 10} L ${cx - 74} ${cy + 110} M ${cx + 66} ${cy - 10} L ${cx + 74} ${cy + 110}`} stroke="#3a4448" strokeWidth={8} />
            </g>
          ))}
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
const SetFG: React.FC<{ name: SetName; turb?: number }> = ({ name, turb = 0 }) => {
  const fr = useCurrentFrame();
  switch (name) {
    case "ucak_kabin": {
      // koltuk önü konsol + masa: notlar ve kahve fincanı (türbülansta fincan titrer)
      const j = turb ? (random(`cup${fr}`) - 0.5) * 6 * turb : 0;
      return (
        <g>
          <path d="M 262 1300 L 806 1300 L 826 1920 L 242 1920 Z" fill="#2e2827" stroke={O} strokeWidth={7} />
          <path d="M 250 1330 L 830 1330" stroke="#3e3634" strokeWidth={6} />
          <rect x={300} y={1420} width={480} height={300} rx={24} fill="#352e2c" stroke="#231e1d" strokeWidth={5} />
          <rect x={236} y={1262} width={600} height={46} rx={12} fill="#6a4a32" stroke={O} strokeWidth={7} />
          <path d="M 330 1268 L 560 1256 L 574 1276 L 338 1288 Z" fill="#f8f5ee" stroke={O} strokeWidth={4} />
          <path d="M 352 1274 L 540 1265" stroke="#8a8a90" strokeWidth={3} />
          <path d="M 470 1272 L 560 1268" stroke="#1d2a44" strokeWidth={5} strokeLinecap="round" />
          <g transform={`translate(${j} ${j * 0.4})`}>
            <ellipse cx={720} cy={1266} rx={58} ry={10} fill="#f4f0e8" stroke={O} strokeWidth={4} />
            <path d="M 682 1226 L 758 1226 L 750 1262 Q 720 1272 690 1262 Z" fill="#fbf9f4" stroke={O} strokeWidth={5} />
            <path d="M 758 1234 q 22 4 6 22" stroke={O} strokeWidth={5} fill="none" />
            <ellipse cx={720} cy={1227} rx={37} ry={6} fill="#5a3a24" />
          </g>
        </g>
      );
    }
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
  /** hücre saati "07:14" */
  saat?: string;
  /** sarsılan kapı (koğuş koridoru: 1, 2, 3) */
  sallanan?: number;
  /** takip çekiminde mekânın kayması (px) */
  kaydir?: number;
  /** ortak salon televizyonu: "acik" | "kapali" */
  tv?: string;
  /** uçak türbülansı 0-1 (ışık titremesi, bulut sarsıntısı) */
  turb?: number;
}> = ({ name, layer, time = "gunduz", rain, flash = 0, doorOpen = 0, children, kus, saat, sallanan, kaydir, tv, turb }) => {
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
          <SetFG name={name} turb={turb} />
        </svg>
        {LIGHT[time] ? <AbsoluteFill style={LIGHT[time]!} /> : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <SetBG name={name} time={time} rain={rain} flash={flash} doorOpen={doorOpen} kus={kus} saat={saat} sallanan={sallanan} kaydir={kaydir} tv={tv} turb={turb} />
      </svg>
      {LIGHT[time] ? <AbsoluteFill style={LIGHT[time]!} /> : null}
      <AbsoluteFill style={{ backgroundColor: "#cfe0ff", opacity: flash * 0.3, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

export { Door, Armchair, TV, Bird };
