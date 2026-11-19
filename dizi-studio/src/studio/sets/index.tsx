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
  | "sokak" | "kafe" | "sinif" | "mezarlik" | "villa" | "karakol" | "park" | "apartman_kapisi" | "koridor" | "merdiven" | "hucre" | "hucre1" | "kogus_koridoru" | "ortak_salon" | "ucak_kabin" | "sahil_enkaz" | "kulube";

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
  ucak_kabin: { title: "Uçak kabini (business)", marks: { emir: { x: 430, y: 1600, size: 1060, sit: true }, hostes: { x: 830, y: 1860, size: 1200 } } },
  sahil_enkaz: { title: "Sahil: uçak enkazı", marks: { emir: { x: 560, y: 1660, size: 860 }, y1: { x: 230, y: 1700, size: 1040 }, y2: { x: 130, y: 1520, size: 900 }, yb: { x: 860, y: 1720, size: 1040 }, ya: { x: 960, y: 1520, size: 880 }, giris: { x: -260, y: 1600, size: 980 } } },
  kulube: { title: "Kulübe içi", marks: { yatak: { x: 560, y: 1470, size: 860 }, kadin: { x: 880, y: 1720, size: 980, sit: true } } },
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

const SetBG: React.FC<{ name: SetName; time: TimeOfDay; rain?: boolean; flash?: number; doorOpen?: number; kus?: React.ReactNode; saat?: string; sallanan?: number; kaydir?: number; tv?: string; turb?: number; kemer?: boolean }> = ({ name, time, rain, flash = 0, doorOpen = 0, kus, saat, sallanan, kaydir, tv, turb, kemer }) => {
  const frame = useCurrentFrame();
  const props = { kus, saat, frame, sallanan, kaydir, tv, turb, kemer };
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
      // Business sınıfı, burun tarafından kıça bakış. Emir pencere koltuğunda (sol duvara bitişik);
      // koltuk ile cam arasında lambalı konsol, sağda koridor ve karşı sıra. Kaçış noktası (700, 880).
      const fr = props.frame ?? 0;
      const tb = props.turb ?? 0;
      // ışık titremesi yalnızca güçlü türbülansta
      const flick = tb >= 0.4 ? (random(`fl${Math.floor(fr / 2)}`) > 0.8 - (tb - 0.4) ? 0.3 : 1) : 1;
      const bob = tb ? Math.sin(fr / 3.1) * 7 * tb + Math.sin(fr / 7.3) * 5 * tb : 0;
      const rattle = tb ? (random(`rt${fr}`) - 0.5) * 3 * tb : 0;
      // yan duvardaki pencere (perspektifte daralan yuvarlak köşeli dikdörtgen); d: 0 yakın .. 1 uzak
      const winL = (x: number, y: number, w: number, h: number, id: string, near = false) => (
        <g key={id}>
          <defs>
            <clipPath id={id}><rect x={x} y={y} width={w} height={h} rx={w * 0.45} /></clipPath>
            <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#77ade2" />
              <stop offset="0.62" stopColor="#c8e0f1" />
              <stop offset="1" stopColor="#f6dcae" />
            </linearGradient>
          </defs>
          <rect x={x - w * 0.22} y={y - h * 0.1} width={w * 1.44} height={h * 1.2} rx={w * 0.62} fill="#f1efea" stroke="#b9b4aa" strokeWidth={Math.max(2, w / 26)} />
          <g clipPath={`url(#${id})`}>
            <rect x={x} y={y} width={w} height={h} fill={`url(#${id}g)`} />
            {near ? <circle cx={x + w * 0.75} cy={y + h * 0.2} r={w * 0.35} fill="#fff7dc" opacity={0.8} /> : null}
            <g transform={`translate(0 ${bob * (w / 110)})`}>
              {[0, 1, 2].map((i) => {
                const cx = x - w + ((i * w * 1.1 - fr * 0.6 * (w / 110)) % (w * 3.3) + w * 3.3) % (w * 3.3);
                return <ellipse key={i} cx={cx} cy={y + h * (0.72 + (i % 2) * 0.06)} rx={w * 0.75} ry={h * 0.07} fill="#ffffff" opacity={0.95} />;
              })}
              <rect x={x} y={y + h * 0.78} width={w} height={h * 0.4} fill="#fbfbff" />
            </g>
            {/* yarı inik perde */}
            <rect x={x} y={y} width={w} height={h * 0.2} fill="#dcd7ce" />
            <rect x={x} y={y + h * 0.2 - Math.max(2, w / 30)} width={w} height={Math.max(3, w / 15)} fill="#c4beb3" />
          </g>
        </g>
      );
      const shell = (x: number, y: number, sc: number, k: string, flip = 1) => (
        <g key={k} transform={`translate(${x} ${y}) scale(${sc * flip} ${sc})`}>
          <path d="M -170 160 L -170 -230 Q -170 -300 -100 -300 L 100 -300 Q 170 -300 170 -230 L 170 160 Z" fill="#2c2f35" stroke={O} strokeWidth={8} />
          <path d="M -130 160 L -130 -210 Q -130 -260 -80 -260 L 80 -260 Q 130 -260 130 -210 L 130 160 Z" fill="#7a6656" />
          <rect x={-80} y={-252} width={160} height={70} rx={16} fill="#f3efe8" />
          <path d="M -170 -60 L 170 -60" stroke="#8a9098" strokeWidth={6} />
        </g>
      );
      return (
        <g>
          <defs>
            <linearGradient id="ucTavan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f7f6f2" />
              <stop offset="1" stopColor="#e3e5ea" />
            </linearGradient>
            <linearGradient id="ucDuvarL" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#e9e6e0" />
              <stop offset="1" stopColor="#d6d2ca" />
            </linearGradient>
            <linearGradient id="ucHuzme" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0" stopColor="#fff0c6" stopOpacity={0.6} />
              <stop offset="1" stopColor="#fff0c6" stopOpacity={0} />
            </linearGradient>
            <radialGradient id="ucMood" cx="0.6" cy="0.25" r="0.6">
              <stop offset="0" stopColor="#d9e4ff" stopOpacity={0.55} />
              <stop offset="1" stopColor="#d9e4ff" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect width={W} height={H} fill="#dad7d1" />
          {/* arka bölme (galley perdesi + çıkış işareti) */}
          <rect x={560} y={760} width={280} height={260} fill="#cfcbc4" stroke={O} strokeWidth={4} />
          <rect x={600} y={790} width={90} height={230} fill="#8a96a8" />
          <path d="M 610 790 L 610 1020 M 630 790 L 630 1020 M 650 790 L 650 1020 M 670 790 L 670 1020" stroke="#7a8698" strokeWidth={3} />
          <rect x={730} y={784} width={60} height={22} rx={4} fill="#2f9a5a" />
          {/* tavan: orta panel + kavisli bagaj dolapları + LED */}
          <path d="M 330 0 L 1000 0 L 800 740 L 600 740 Z" fill="url(#ucTavan)" />
          <rect width={W} height={760} fill="url(#ucMood)" />
          <g transform={`translate(${rattle} 0)`}>
            <path d="M 0 0 L 330 0 L 600 740 L 560 770 Q 300 520 0 300 Z" fill="#f2f1ee" stroke={O} strokeWidth={6} />
            <path d="M 0 240 Q 300 470 568 742" stroke="#d9d6cf" strokeWidth={5} fill="none" />
            <path d="M 0 300 Q 300 520 560 770" stroke="#fff3d2" strokeWidth={8} fill="none" opacity={0.95 * flick} />
            <path d="M 1080 0 L 1000 0 L 800 740 L 840 770 Q 960 560 1080 380 Z" fill="#ecebe7" stroke={O} strokeWidth={6} />
            <path d="M 1080 330 Q 950 540 832 742" stroke="#d4d1ca" strokeWidth={5} fill="none" />
            <path d="M 1080 380 Q 960 560 840 770" stroke="#fff3d2" strokeWidth={8} fill="none" opacity={0.95 * flick} />
          </g>
          {/* emniyet kemeri işareti (Emir'in üstünde) */}
          <g transform="translate(300 330) rotate(28)">
            <rect x={-60} y={-24} width={120} height={48} rx={10} fill="#e6e4df" stroke={O} strokeWidth={4} />
            <rect x={-50} y={-16} width={100} height={32} rx={6} fill={props.kemer ? "#ffd84a" : "#bcb8b0"} />
            {props.kemer ? <rect x={-50} y={-16} width={100} height={32} rx={6} fill="#ffe680" opacity={0.6} /> : null}
            <path d="M -32 6 q 0 -14 10 -14 q 10 0 10 14 M -22 -14 a 5 5 0 1 0 0.1 0 M 8 -8 L 36 8 M 8 8 L 36 -8" stroke="#3a3630" strokeWidth={4} fill="none" />
          </g>
          {/* sol yan duvar: pencereler Emir'in koltuğunun hemen yanında */}
          <path d="M 0 300 Q 300 520 560 770 L 560 1020 L 0 1640 Z" fill="url(#ucDuvarL)" stroke={O} strokeWidth={6} />
          <path d="M 0 1180 L 560 990" stroke="#c8c3ba" strokeWidth={5} />
          {winL(520, 850, 14, 34, "uw5")}
          {winL(470, 836, 22, 52, "uw4")}
          {winL(392, 812, 34, 82, "uw3")}
          {winL(262, 770, 58, 132, "uw2")}
          {winL(54, 640, 112, 250, "uw1", true)}
          {/* sağ yan duvar (karşı sıra) */}
          <path d="M 1080 380 Q 960 560 840 770 L 840 1020 L 1080 1500 Z" fill="#d4d0c8" stroke={O} strokeWidth={6} />
          {winL(870, 850, 12, 30, "uw7")}
          {winL(930, 818, 22, 54, "uw6")}
          {/* zemin + koridor + yer ışıkları */}
          <path d="M 0 1640 L 560 1020 L 840 1020 L 1080 1500 L 1080 1920 L 0 1920 Z" fill="#363c4a" />
          <path d="M 640 1020 L 790 1020 L 1080 1600 L 1080 1920 L 700 1920 Z" fill="#454d60" />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${650 + i * 40} ${1030 + i * 160} l 26 0`} stroke="#9fb8ff" strokeWidth={3} opacity={0.6} />)}
          {/* arka sıralar (perspektif) */}
          {shell(560, 1000, 0.22, "r4")}
          {shell(520, 1040, 0.34, "r3")}
          {shell(800, 1010, 0.24, "r6")}
          {shell(880, 1080, 0.4, "r5")}
          {shell(1040, 1240, 0.7, "r7")}
          {/* koltuk ile cam arası konsol + okuma lambası */}
          <path d="M 120 1180 L 250 1160 L 250 1560 L 110 1600 Z" fill="#2c2f35" stroke={O} strokeWidth={6} />
          <path d="M 120 1180 L 250 1160 L 262 1172 L 132 1194 Z" fill="#8a7058" stroke={O} strokeWidth={4} />
          <path d="M 200 1170 Q 196 1080 240 1050" stroke="#9aa0a8" strokeWidth={8} fill="none" />
          <ellipse cx={246} cy={1048} rx={18} ry={10} fill="#e9e6df" stroke={O} strokeWidth={4} />
          <rect x={150} y={1140} width={22} height={40} rx={6} fill="#d8eef6" stroke={O} strokeWidth={3} />
          {/* gün ışığı huzmesi (anahtar ışık: soldaki pencereden) */}
          <path d="M 90 700 L 170 680 L 760 1600 L 380 1720 Z" fill="url(#ucHuzme)" opacity={0.55 * flick} />
          {/* Emir'in koltuk kabuğu */}
          <path d="M 222 1620 L 222 900 Q 222 800 320 800 L 540 800 Q 638 800 638 900 L 638 1620 Z" fill="#2c2f35" stroke={O} strokeWidth={8} />
          <path d="M 262 1600 L 262 920 Q 262 850 332 850 L 528 850 Q 598 850 598 920 L 598 1600 Z" fill="#7a6656" stroke="#5e4e42" strokeWidth={4} />
          <path d="M 300 1060 L 560 1060 M 300 1240 L 560 1240" stroke="#66544a" strokeWidth={4} strokeDasharray="10 8" />
          <rect x={320} y={848} width={220} height={110} rx={22} fill="#f3efe8" stroke={O} strokeWidth={4} />
          <path d="M 222 1150 L 638 1150" stroke="#8a9098" strokeWidth={6} opacity={0.7} />
          {/* titreşimde kabin kararması */}
          {tb >= 0.4 ? <rect width={W} height={H} fill="#0a0c14" opacity={(1 - flick) * 0.3 + (tb - 0.4) * 0.15} /> : null}
        </g>
      );
    }
    case "sahil_enkaz": {
      // Öğle: güneş tepede, gölgeler kısa. Uçak ağaçları biçerek sahile çakılmış; duman, dağınık enkaz.
      const fr = props.frame ?? 0;
      const smoke = (x: number, y: number, k: string, sc = 1) =>
        new Array(14).fill(0).map((_, i) => {
          const a = (fr * 0.9 + i * 22) % 300;
          return <circle key={k + i} cx={x + a * 0.5 * sc + Math.sin((a + i * 40) / 30) * 14 * sc} cy={y - a * 2.2 * sc} r={(26 + a * 0.32) * sc} fill={i % 2 ? "#5a5856" : "#7a7774"} opacity={Math.max(0, 0.55 - a / 560)} />;
        });
      const palm = (x: number, y: number, h: number, lean: number, k: string, broken = false) => (
        <g key={k}>
          <path d={`M ${x - 14} ${y} Q ${x + lean * 0.5} ${y - h * 0.5} ${x + lean} ${y - h} L ${x + lean + 16} ${y - h + 6} Q ${x + lean * 0.5 + 16} ${y - h * 0.5} ${x + 14} ${y} Z`} fill="#8a6a44" stroke={O} strokeWidth={5} />
          {broken ? (
            <path d={`M ${x + lean - 6} ${y - h} l 10 -26 l 8 18 l 10 -22 l 6 30 Z`} fill="#c9a874" stroke={O} strokeWidth={4} />
          ) : (
            [-150, -110, -60, -20, 20, 70, 120, 160].map((a, i) => (
              <path key={i} d={`M ${x + lean + 8} ${y - h} q ${Math.cos((a * Math.PI) / 180) * 90} ${Math.sin((a * Math.PI) / 180) * 50 - 30} ${Math.cos((a * Math.PI) / 180) * 170} ${Math.sin((a * Math.PI) / 180) * 90 + 30}`} stroke={i % 2 ? "#2e6a32" : "#3e7e3a"} strokeWidth={22} fill="none" strokeLinecap="round" />
            ))
          )}
        </g>
      );
      return (
        <g>
          <defs>
            <linearGradient id="seGok" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6fb6e6" />
              <stop offset="1" stopColor="#d6eef8" />
            </linearGradient>
            <linearGradient id="seDeniz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1f7e9e" />
              <stop offset="1" stopColor="#5fc6cc" />
            </linearGradient>
            <linearGradient id="seKum" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ecd7a6" />
              <stop offset="1" stopColor="#dcc08a" />
            </linearGradient>
            <radialGradient id="seGunes" cx="0.5" cy="0.06" r="0.5">
              <stop offset="0" stopColor="#fffbe6" stopOpacity={0.9} />
              <stop offset="1" stopColor="#fffbe6" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect width={W} height={760} fill="url(#seGok)" />
          <circle cx={560} cy={110} r={66} fill="#fffdf0" />
          <rect width={W} height={900} fill="url(#seGunes)" />
          {/* deniz */}
          <rect y={700} width={W} height={260} fill="url(#seDeniz)" />
          <path d="M 0 700 L 180 690 L 300 700 Z" fill="#4a7a6a" opacity={0.6} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${((i * 300 + fr * 1.2) % 1300) - 200} ${760 + i * 40} q 40 -10 80 0`} stroke="#ffffff" strokeWidth={4} opacity={0.6} fill="none" />)}
          {/* kum + kıyı köpüğü */}
          <path d="M 0 930 Q 540 900 1080 940 L 1080 1920 L 0 1920 Z" fill="url(#seKum)" />
          <path d={`M 0 ${930 + Math.sin(fr / 25) * 6} Q 540 ${900 + Math.sin(fr / 25) * 8} 1080 ${940 + Math.sin(fr / 25) * 6}`} stroke="#ffffff" strokeWidth={14} fill="none" opacity={0.8} />
          <path d="M 0 960 Q 540 930 1080 968" stroke="#cdb27a" strokeWidth={10} fill="none" opacity={0.6} />
          {/* ağaç sırası (sol) ve uçağın biçtiği ağaçlar */}
          <path d="M 0 520 Q 120 460 260 520 Q 340 560 420 640 L 440 1000 L 0 1100 Z" fill="#2f6a34" />
          <path d="M 0 600 Q 160 560 300 640 L 360 1000 L 0 1060 Z" fill="#245a2a" />
          {palm(60, 1060, 420, -40, "p1")}
          {palm(380, 1010, 300, 60, "p2", true)}
          {palm(470, 990, 220, 80, "p3", true)}
          {palm(250, 1050, 360, 30, "p4")}
          {/* devrilmiş gövde */}
          <path d="M 260 1140 L 640 1060 L 650 1086 L 270 1170 Z" fill="#8a6a44" stroke={O} strokeWidth={5} />
          {/* kayma izi */}
          <path d="M 360 1060 Q 520 1010 640 990 L 700 1040 Q 540 1080 380 1120 Z" fill="#b89a64" opacity={0.7} />
          {/* kopmuş kuyruk */}
          <g transform="rotate(-18 220 960)">
            <path d="M 150 980 L 190 760 L 270 760 L 300 980 Z" fill="#f2f4f6" stroke={O} strokeWidth={7} />
            <path d="M 150 980 L 300 980 L 296 1010 L 156 1010 Z" fill="#c8ccd2" stroke={O} strokeWidth={5} />
            <path d="M 300 980 l 10 -20 l 6 24 l 12 -18 l -2 34 Z" fill="#3a3a3e" />
          </g>
          {/* ana gövde: burun denize doğru, kopuk ucu sola */}
          <g>
            <path d="M 560 900 L 1000 830 Q 1080 840 1090 900 Q 1070 960 990 980 L 580 1050 Z" fill="#f4f6f8" stroke={O} strokeWidth={8} />
            <path d="M 560 900 l 14 30 l -18 20 l 22 26 l -14 24 l 16 50" fill="#2a2a2e" stroke={O} strokeWidth={6} />
            <path d="M 600 1010 L 990 948" stroke="#2a3a5a" strokeWidth={9} />
            {new Array(9).fill(0).map((_, i) => <rect key={i} x={640 + i * 40} y={918 - i * 6} width={18} height={22} rx={8} fill="#3a4a60" />)}
            <path d="M 700 900 L 640 690 L 700 680 L 780 880 Z" fill="#dfe4e9" stroke={O} strokeWidth={7} />
            <ellipse cx={830} cy={1060} rx={260} ry={22} fill="#000" opacity={0.14} />
          </g>
          {smoke(580, 900, "sm1")}
          {/* kopmuş motor */}
          <g>
            <rect x={340} y={1190} width={190} height={92} rx={44} fill="#c9ced4" stroke={O} strokeWidth={7} transform="rotate(14 435 1236)" />
            <ellipse cx={530} cy={1262} rx={20} ry={44} fill="#2a2a2e" transform="rotate(14 530 1262)" />
            <ellipse cx={440} cy={1300} rx={110} ry={14} fill="#000" opacity={0.15} />
          </g>
          {smoke(420, 1200, "sm2", 0.6)}
          {/* dağınık enkaz */}
          <path d="M 880 1300 L 1010 1260 L 1040 1340 L 900 1360 Z" fill="#2c2f35" stroke={O} strokeWidth={5} />
          <rect x={250} y={1440} width={120} height={84} rx={10} fill="#5a3a2a" stroke={O} strokeWidth={5} transform="rotate(-10 310 1480)" />
          <path d="M 270 1440 l 70 -12" stroke="#c9a75a" strokeWidth={6} />
          {[[700, 1240, 12], [780, 1500, -20], [160, 1340, 30], [960, 1600, 8]].map(([x, y, r], i) => <rect key={i} x={x} y={y} width={60} height={42} fill="#f6f4ee" stroke={O} strokeWidth={3} transform={`rotate(${r} ${x} ${y})`} />)}
          <path d="M 620 1180 l 80 -14 l -10 26 Z M 820 1420 l 60 6 l -30 20 Z" fill="#9aa0a8" stroke={O} strokeWidth={4} />
          {/* mürettebat (yüzüstü, kansız): lacivert üniforma, düşmüş kep */}
          <g>
            <path d="M 690 1360 L 860 1330 L 868 1372 L 700 1404 Z" fill="#1d2a44" stroke={O} strokeWidth={6} />
            <circle cx={676} cy={1384} r={24} fill="#3a2a20" stroke={O} strokeWidth={5} />
            <path d="M 860 1334 L 940 1322 L 944 1346 L 866 1360 Z M 864 1360 L 944 1366 L 942 1390 L 866 1380 Z" fill="#1d2a44" stroke={O} strokeWidth={5} />
            <path d="M 740 1398 l -40 40 M 760 1340 l -30 -40" stroke="#1d2a44" strokeWidth={22} strokeLinecap="round" />
            <path d="M 712 1446 l 18 -6 M 722 1302 l 16 -4" stroke="#d9b45a" strokeWidth={5} />
            <ellipse cx={600} cy={1440} rx={34} ry={14} fill="#1d2a44" stroke={O} strokeWidth={4} />
            <path d="M 572 1436 l 56 0" stroke="#d9b45a" strokeWidth={4} />
            <ellipse cx={790} cy={1410} rx={150} ry={14} fill="#000" opacity={0.12} />
          </g>
          <g>
            <path d="M 1020 1200 L 1100 1190 L 1100 1226 L 1024 1232 Z" fill="#1d2a44" stroke={O} strokeWidth={5} />
            <path d="M 1020 1230 l -40 10" stroke="#1d2a44" strokeWidth={20} strokeLinecap="round" />
          </g>
          {/* sıcak hava titreşimi */}
          <rect y={1000} width={W} height={60} fill="#ffffff" opacity={0.04 + 0.02 * Math.sin(fr / 6)} />
        </g>
      );
    }
    case "kulube": {
      // Bambu duvar, saz çatı aralığından süzülen ışık, saman + yaprak yatak, reçine kâsesi, küçük ateş.
      const fr = props.frame ?? 0;
      return (
        <g>
          <defs>
            <linearGradient id="kuIsik" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0" stopColor="#ffe9b0" stopOpacity={0.45} />
              <stop offset="1" stopColor="#ffe9b0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="#5a3e24" />
          {new Array(27).fill(0).map((_, i) => <rect key={i} x={i * 40} y={420} width={36} height={1100} fill={i % 3 ? "#8a6238" : "#7a5430"} stroke="#4a321c" strokeWidth={3} />)}
          {[620, 900, 1180].map((y) => <path key={y} d={`M 0 ${y} L 1080 ${y + 10}`} stroke="#4a321c" strokeWidth={10} />)}
          {/* kapı aralığı: dışarısı parlak */}
          <rect x={830} y={600} width={210} height={900} fill="#f7e8b8" stroke="#3a2614" strokeWidth={10} />
          <path d="M 860 700 q 60 -40 140 10 M 850 820 q 80 -30 170 20" stroke="#4f8a3e" strokeWidth={26} fill="none" strokeLinecap="round" />
          <path d="M 830 1500 L 1040 1500 L 1080 1920 L 700 1920 Z" fill="#f7e8b8" opacity={0.22} />
          {/* saz çatı */}
          <path d="M 0 0 L 1080 0 L 1080 470 Q 540 380 0 470 Z" fill="#b08a48" />
          {new Array(10).fill(0).map((_, r) => (
            <path key={r} d={`M 0 ${40 + r * 44} ${new Array(28).fill(0).map((_, i) => `L ${i * 40 + 20} ${40 + r * 44 + 26} L ${i * 40 + 40} ${40 + r * 44}`).join(" ")}`} stroke={r % 2 ? "#c9a45c" : "#9a7838"} strokeWidth={6} fill="none" />
          ))}
          <path d="M 0 470 Q 540 380 1080 470" stroke="#6a4a24" strokeWidth={14} fill="none" />
          {/* çatı aralıklarından ışık huzmeleri */}
          {[[300, 0.9], [560, 0.7], [700, 1]].map(([x, o], i) => (
            <path key={i} d={`M ${x} 300 L ${x + 40} 300 L ${x + 300} 1600 L ${x + 160} 1600 Z`} fill="url(#kuIsik)" opacity={(o as number) * (0.8 + 0.2 * Math.sin(fr / 40 + i))} />
          ))}
          {/* asılı kuru otlar */}
          {[180, 260, 640].map((x, i) => (
            <g key={x}>
              <path d={`M ${x} 430 L ${x} 520`} stroke="#4a321c" strokeWidth={4} />
              <path d={`M ${x - 20} 520 Q ${x} 600 ${x + 20} 520 Z`} fill={i % 2 ? "#7a8a3a" : "#8a7a3a"} stroke="#3a2a14" strokeWidth={3} />
            </g>
          ))}
          {/* toprak zemin + hasır */}
          <rect y={1500} width={W} height={420} fill="#6a4a2c" />
          <path d="M 60 1700 L 760 1680 L 800 1880 L 20 1900 Z" fill="#b8955a" opacity={0.75} />
          {new Array(8).fill(0).map((_, i) => <path key={i} d={`M ${60 + i * 90} 1690 L ${40 + i * 96} 1895`} stroke="#9a7a44" strokeWidth={4} />)}
          {/* küçük ateş (arka sol) */}
          <ellipse cx={150} cy={1360} rx={70} ry={20} fill="#3a2a1a" />
          <path d={`M 120 1360 Q 140 ${1300 + Math.sin(fr / 3) * 8} 150 1280 Q 160 ${1310 + Math.cos(fr / 4) * 8} 182 1360 Z`} fill="#ff9a3a" />
          <path d={`M 138 1360 Q 150 ${1320 + Math.sin(fr / 2) * 6} 164 1360 Z`} fill="#ffe08a" />
          {new Array(6).fill(0).map((_, i) => { const a = (fr + i * 30) % 180; return <circle key={i} cx={150 + Math.sin(a / 20) * 16} cy={1270 - a * 3} r={18 + a * 0.2} fill="#9a8a7a" opacity={Math.max(0, 0.3 - a / 600)} />; })}
          {/* yatak: alçak ahşap çerçeve, saman, iri yapraklar */}
          <rect x={150} y={1440} width={760} height={110} rx={14} fill="#6a4a28" stroke={O} strokeWidth={7} />
          <path d="M 160 1450 Q 530 1390 900 1450 L 900 1480 L 160 1480 Z" fill="#d8b866" stroke={O} strokeWidth={5} />
          {new Array(14).fill(0).map((_, i) => <path key={i} d={`M ${170 + i * 52} 1452 q 20 -30 50 -6`} stroke="#c09a48" strokeWidth={4} fill="none" />)}
          {[[200, 1440, -20], [380, 1430, 10], [600, 1432, -8], [800, 1442, 18]].map(([x, y, r], i) => (
            <path key={i} d={`M ${x} ${y} q 60 -40 140 0 q -70 30 -140 0 Z`} fill={i % 2 ? "#4f7e34" : "#5f8a3a"} stroke="#2e4a1e" strokeWidth={3} transform={`rotate(${r} ${x} ${y})`} />
          ))}
          {/* tabure + reçine kâsesi */}
          <rect x={930} y={1560} width={110} height={18} rx={6} fill="#6a4a28" stroke={O} strokeWidth={4} />
          <path d="M 944 1578 L 940 1660 M 1026 1578 L 1030 1660" stroke="#6a4a28" strokeWidth={10} />
          <path d="M 940 1560 Q 985 1610 1030 1560 Z" fill="#8a5a34" stroke={O} strokeWidth={4} />
          <ellipse cx={985} cy={1560} rx={44} ry={8} fill="#d99a2a" />
          {/* genel loşluk */}
          <rect width={W} height={H} fill="#1a0e04" opacity={0.18} />
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
const SetFG: React.FC<{ name: SetName; turb?: number; fincanElde?: boolean }> = ({ name, turb = 0, fincanElde }) => {
  const fr = useCurrentFrame();
  switch (name) {
    case "ucak_kabin": {
      // koltuk önü masa: notlar ve kahve fincanı (türbülansta fincan titrer)
      const j = turb ? (random(`cup${fr}`) - 0.5) * 8 * turb : 0;
      return (
        <g>
          <path d="M 170 1300 L 700 1300 L 720 1920 L 150 1920 Z" fill="#2c2f35" stroke={O} strokeWidth={7} />
          <path d="M 180 1330 L 690 1330" stroke="#8a9098" strokeWidth={5} opacity={0.7} />
          <rect x={210} y={1420} width={450} height={300} rx={24} fill="#34373e" stroke="#22242a" strokeWidth={5} />
          <rect x={140} y={1262} width={590} height={46} rx={12} fill="#8a7058" stroke={O} strokeWidth={7} />
          <path d="M 220 1268 L 450 1256 L 464 1276 L 228 1288 Z" fill="#f8f5ee" stroke={O} strokeWidth={4} />
          <path d="M 242 1274 L 430 1265" stroke="#8a8a90" strokeWidth={3} />
          <path d="M 360 1272 L 450 1268" stroke="#1d2a44" strokeWidth={5} strokeLinecap="round" />
          <ellipse cx={610} cy={1266} rx={58} ry={10} fill="#f4f0e8" stroke={O} strokeWidth={4} />
          <g transform={`translate(${j} ${j * 0.4})`} opacity={fincanElde ? 0 : 1}>
            <ellipse cx={610} cy={1266} rx={58} ry={10} fill="#f4f0e8" stroke={O} strokeWidth={4} />
            <path d="M 572 1226 L 648 1226 L 640 1262 Q 610 1272 580 1262 Z" fill="#fbf9f4" stroke={O} strokeWidth={5} />
            <path d="M 648 1234 q 22 4 6 22" stroke={O} strokeWidth={5} fill="none" />
            <ellipse cx={610} cy={1227} rx={37} ry={6} fill="#5a3a24" />
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
  /** emniyet kemeri işareti yanıyor */
  kemer?: boolean;
  /** fincan karakterin elinde: masadaki fincanı gizle */
  fincanElde?: boolean;
}> = ({ name, layer, time = "gunduz", rain, flash = 0, doorOpen = 0, children, kus, saat, sallanan, kaydir, tv, turb, kemer, fincanElde }) => {
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
          <SetFG name={name} turb={turb} fincanElde={fincanElde} />
        </svg>
        {LIGHT[time] ? <AbsoluteFill style={LIGHT[time]!} /> : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <SetBG name={name} time={time} rain={rain} flash={flash} doorOpen={doorOpen} kus={kus} saat={saat} sallanan={sallanan} kaydir={kaydir} tv={tv} turb={turb} kemer={kemer} />
      </svg>
      {LIGHT[time] ? <AbsoluteFill style={LIGHT[time]!} /> : null}
      <AbsoluteFill style={{ backgroundColor: "#cfe0ff", opacity: flash * 0.3, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

export { Door, Armchair, TV, Bird };
