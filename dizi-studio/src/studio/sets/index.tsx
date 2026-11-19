/* Mekân kütüphanesi. Her mekân iki katman verir: "bg" (karakterlerin arkası) ve "fg" (önü: masa, tezgâh vb.).
   `MARKS` karakterlerin duracağı önerilen noktalardır (x = karakter merkezi, y = ayak çizgisi, size = boy px). */
import { Banyo724BG, Banyo724FG, BANYO724_MARKS, type BanyoView } from "./banyo724";
import { Market724BG, Market724FG, MARKET724_MARKS, type MarketView } from "./market724";
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
  | "sokak" | "kafe" | "sinif" | "mezarlik" | "villa" | "karakol" | "park" | "apartman_kapisi" | "koridor" | "merdiven" | "hucre" | "hucre1" | "kogus_koridoru" | "ortak_salon" | "ucak_kabin" | "sahil_enkaz" | "kulube" | "lobi" | "kat7_koridor" | "market" | "market_genel" | "market_kapi" | "market_kasa" | "banyo_ayna" | "banyo_kapi";

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
  sahil_enkaz: { title: "Sahil: uçak enkazı", marks: { emir: { x: 560, y: 1730, size: 860 }, y1: { x: 210, y: 1500, size: 960 }, y2: { x: 110, y: 1430, size: 880 }, yb: { x: 820, y: 1520, size: 980 }, ya: { x: 960, y: 1440, size: 860 }, m1: { x: 760, y: 1420, size: 640 }, m2: { x: 300, y: 1330, size: 560 } } },
  lobi: { title: "Gece lobisi (iş hanı)", marks: { cemil: { x: 790, y: 1660, size: 1060, sit: true }, ayak: { x: 760, y: 1800, size: 1180 }, pano: { x: 640, y: 1760, size: 1120 }, tel: { x: 690, y: 1780, size: 1120 }, asansor: { x: 360, y: 1560, size: 1000 } } },
  banyo_ayna: { title: "Ece'nin banyosu · ayna (FPS)", marks: BANYO724_MARKS.ayna },
  banyo_kapi: { title: "Ece'nin banyosu · kapı", marks: BANYO724_MARKS.kapi },
  market_genel: { title: "Can Market · genel", marks: MARKET724_MARKS.genel },
  market_kapi: { title: "Can Market · kapı", marks: MARKET724_MARKS.kapi },
  market_kasa: { title: "Can Market · kasa", marks: MARKET724_MARKS.kasa },
  market: { title: "Can Market 7/24 (gece)", marks: { ece: { x: 820, y: 1700, size: 1120 }, sabri: { x: 420, y: 1780, size: 1160 }, kapi: { x: 150, y: 1500, size: 900 }, depo: { x: 450, y: 1100, size: 520 }, musteri: { x: 400, y: 1790, size: 1160 } } },
  kat7_koridor: { title: "7. kat: yanık arşiv koridoru", marks: { cemil: { x: 540, y: 1790, size: 1160 }, ileri: { x: 560, y: 1500, size: 820 } } },
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

const SetBG: React.FC<{ name: SetName; time: TimeOfDay; rain?: boolean; flash?: number; doorOpen?: number; kus?: React.ReactNode; saat?: string; sallanan?: number; kaydir?: number; tv?: string; turb?: number; kemer?: boolean; iz?: number }> = ({ name, time, rain, flash = 0, doorOpen = 0, kus, saat, sallanan, kaydir, tv, turb, kemer, iz = 0 }) => {
  const frame = useCurrentFrame();
  if (name === "banyo_ayna" || name === "banyo_kapi") return <Banyo724BG view={name.slice(6) as BanyoView} frame={frame} doorOpen={doorOpen} />;
  if (name === "market_genel" || name === "market_kapi" || name === "market_kasa") return <Market724BG view={name.slice(7) as MarketView} frame={frame} doorOpen={doorOpen} saat={saat ?? "03:00"} iz={iz} turb={turb ?? 0} />;
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
      const smoke = (x: number, y: number, k: string, sc = 1) => (
        <g key={k} filter="url(#seBulanik)">
          {new Array(7).fill(0).map((_, i) => {
            const a = (fr * 0.7 + i * 48) % 336;
            return <ellipse key={k + i} cx={x + a * 0.9 * sc + Math.sin((a + i * 70) / 40) * 22 * sc} cy={y - a * 1.9 * sc} rx={(50 + a * 0.55) * sc} ry={(38 + a * 0.4) * sc} fill={i % 3 ? "#5e5b58" : "#85817c"} opacity={Math.max(0, (0.5 + 0.15 * random(`${k}o${i}`)) - a / 520)} />;
          })}
        </g>
      );
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
            <filter id="seBulanik"><feGaussianBlur stdDeviation="9" /></filter>
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
          {/* kopmuş kuyruk bölümü: gövde parçası + dikey ve yatay stabilizatör */}
          <g transform="rotate(-14 230 960)">
            <path d="M 110 930 Q 200 900 330 920 L 340 1000 Q 210 1010 120 990 Z" fill="#f2f4f6" stroke={O} strokeWidth={7} />
            <path d="M 118 975 Q 220 985 338 972" stroke="#2a3a5a" strokeWidth={8} fill="none" />
            <path d="M 330 918 l 12 18 l -10 14 l 14 20 l -8 32" fill="#2a2a2e" stroke={O} strokeWidth={5} />
            <path d="M 140 925 L 120 740 L 190 740 L 260 912 Z" fill="#f2f4f6" stroke={O} strokeWidth={7} />
            <path d="M 132 760 L 186 760 M 128 790 L 196 790" stroke="#2a3a5a" strokeWidth={10} />
            <path d="M 130 960 L 40 1000 L 70 1020 L 200 990 Z" fill="#e2e6ea" stroke={O} strokeWidth={6} />
            <ellipse cx={220} cy={1010} rx={130} ry={14} fill="#000" opacity={0.14} />
          </g>
          {/* ana gövde: burun denize doğru, kopuk ucu sola */}
          <g>
            <path d="M 560 900 L 1000 830 Q 1080 840 1090 900 Q 1070 960 990 980 L 580 1050 Z" fill="#f4f6f8" stroke={O} strokeWidth={8} />
            <path d="M 560 900 l 14 30 l -18 20 l 22 26 l -14 24 l 16 50" fill="#2a2a2e" stroke={O} strokeWidth={6} />
            <path d="M 600 1010 L 990 948" stroke="#2a3a5a" strokeWidth={9} />
            {new Array(9).fill(0).map((_, i) => <rect key={i} x={640 + i * 40} y={918 - i * 6} width={18} height={22} rx={8} fill="#3a4a60" />)}
            <path d="M 680 1000 L 520 1110 L 560 1130 L 640 1100 L 620 1150 L 700 1080 L 780 990 Z" fill="#dfe4e9" stroke={O} strokeWidth={7} />
            <path d="M 560 1112 l 30 -30" stroke="#b8bec6" strokeWidth={5} />
            <ellipse cx={830} cy={1060} rx={260} ry={22} fill="#000" opacity={0.14} />
          </g>
          {smoke(580, 900, "sm1")}
          {/* kopmuş motor: kaporta, ön halka, fan kanatları, yırtık pilon */}
          <g transform="rotate(12 440 1236)">
            <rect x={330} y={1186} width={210} height={100} rx={46} fill="#c9ced4" stroke={O} strokeWidth={7} />
            <path d="M 380 1186 l 10 -30 l 20 18 l 16 -26 l 18 38" fill="#9aa0a8" stroke={O} strokeWidth={5} />
            <ellipse cx={540} cy={1236} rx={26} ry={50} fill="#d8dde2" stroke={O} strokeWidth={7} />
            <ellipse cx={540} cy={1236} rx={16} ry={38} fill="#2a2a2e" />
            {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M 540 1236 L ${540 + Math.cos(i * 1.26) * 12} ${1236 + Math.sin(i * 1.26) * 32}`} stroke="#8a9098" strokeWidth={4} />)}
            <path d="M 330 1210 L 300 1226 L 300 1250 L 330 1264 Z" fill="#5a5e64" stroke={O} strokeWidth={5} />
          </g>
          <ellipse cx={440} cy={1300} rx={120} ry={14} fill="#000" opacity={0.15} />
          {smoke(420, 1200, "sm2", 0.6)}
          {/* dağınık enkaz */}
          <path d="M 880 1300 L 1010 1260 L 1040 1340 L 900 1360 Z" fill="#2c2f35" stroke={O} strokeWidth={5} />
          <rect x={250} y={1440} width={120} height={84} rx={10} fill="#5a3a2a" stroke={O} strokeWidth={5} transform="rotate(-10 310 1480)" />
          <path d="M 270 1440 l 70 -12" stroke="#c9a75a" strokeWidth={6} />
          {[[700, 1240, 12], [780, 1500, -20], [160, 1340, 30], [960, 1600, 8]].map(([x, y, r], i) => <rect key={i} x={x} y={y} width={60} height={42} fill="#f6f4ee" stroke={O} strokeWidth={3} transform={`rotate(${r} ${x} ${y})`} />)}
          <path d="M 620 1180 l 80 -14 l -10 26 Z M 820 1420 l 60 6 l -30 20 Z" fill="#9aa0a8" stroke={O} strokeWidth={4} />
          {/* düşmüş kep + enkaz parçası (mürettebat rig karakteri olarak yerde yatar) */}
          <path d="M 760 1290 L 930 1250 L 960 1340 L 780 1372 Z" fill="#9aa0a8" stroke={O} strokeWidth={6} />
          <path d="M 790 1300 L 920 1272" stroke="#7a8088" strokeWidth={5} />
          <ellipse cx={540} cy={1470} rx={34} ry={13} fill="#1d2a44" stroke={O} strokeWidth={4} />
          <path d="M 512 1466 l 56 0" stroke="#d9b45a" strokeWidth={4} />
          {/* sıcak hava titreşimi */}
          <rect y={1000} width={W} height={60} fill="#ffffff" opacity={0.04 + 0.02 * Math.sin(fr / 6)} />
        </g>
      );
    }
    case "lobi": {
      // 1952 yapımı eski İstanbul hanı lobisi, gece. Soldan sağa: merdiven kemeri, asansör (+ kırmızı kat göstergesi = props.saat),
      // kat rehberi, duvar telefonu, pirinç posta kutuları, cam giriş kapısı (yağmur, sokak lambası), üstte duvar saati.
      // props.turb = floresan titremesi; doorOpen = asansör kapısı.
      const fr = props.frame ?? 0;
      const tb = props.turb ?? 0;
      const flick = tb > 0 ? (random(`lf${Math.floor(fr / 2)}`) > 1 - tb * 0.6 ? 0.25 : 1) : 1;
      const op = Math.max(0, Math.min(1, doorOpen));
      const kat = props.saat ?? "0";
      const cabFl = op > 0 ? (random(`cf${Math.floor(fr / 3)}`) > 0.75 ? 0.35 : 1) : 1;
      return (
        <g>
          <defs>
            <linearGradient id="loDuvar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a3328" />
              <stop offset="1" stopColor="#2a251e" />
            </linearGradient>
            <linearGradient id="loLambri" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4a3020" />
              <stop offset="1" stopColor="#2e1c12" />
            </linearGradient>
            <linearGradient id="loKabin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fffbe0" />
              <stop offset="1" stopColor="#c8c4a0" />
            </linearGradient>
            <linearGradient id="loSokak" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0b1422" />
              <stop offset="1" stopColor="#1a2636" />
            </linearGradient>
            <radialGradient id="loLamba" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ffd890" stopOpacity={0.55} />
              <stop offset="1" stopColor="#ffd890" stopOpacity={0} />
            </radialGradient>
            <linearGradient id="loHuzme" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f2d290" stopOpacity={0.28} />
              <stop offset="1" stopColor="#f2d290" stopOpacity={0} />
            </linearGradient>
            <filter id="loParlak"><feGaussianBlur stdDeviation="8" /></filter>
          </defs>
          {/* duvar: sıva + ahşap lambri + pervazlar */}
          <rect width={W} height={H} fill="url(#loDuvar)" />
          <rect x={0} y={1180} width={W} height={340} fill="url(#loLambri)" />
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={20 + i * 180} y={1210} width={150} height={270} rx={6} fill="none" stroke="#5a3a26" strokeWidth={5} />)}
          <rect x={0} y={1170} width={W} height={16} fill="#5a3a26" />
          {/* tavan: kasetli, kalın kornişli */}
          <rect width={W} height={290} fill="#1e1a15" />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={30 + i * 262} y={40} width={240} height={190} fill="#26211a" stroke="#14110d" strokeWidth={6} />)}
          <rect x={0} y={280} width={W} height={34} fill="#4a4033" />
          <path d="M 0 314 L 1080 314" stroke="#2a241c" strokeWidth={8} />
          {/* floresan (titrer) */}
          <rect x={300} y={232} width={480} height={20} rx={8} fill="#e8f2ea" opacity={0.85 * flick} />
          <rect x={200} y={220} width={680} height={80} fill="#e8f2ea" opacity={0.06 * flick} />
          {/* duvar saati (cam kapının üstünde) */}
          <g transform="translate(910 520)">
            <circle r={66} fill="#e8e2cc" stroke="#2a241c" strokeWidth={10} />
            {new Array(12).fill(0).map((_, i) => <path key={i} d={`M ${Math.sin((i * Math.PI) / 6) * 50} ${-Math.cos((i * Math.PI) / 6) * 50} L ${Math.sin((i * Math.PI) / 6) * 58} ${-Math.cos((i * Math.PI) / 6) * 58}`} stroke="#2a241c" strokeWidth={4} />)}
            <path d="M 0 0 L 25 4" stroke="#1a1612" strokeWidth={8} strokeLinecap="round" />
            <path d="M 0 0 L 44 5" stroke="#1a1612" strokeWidth={5} strokeLinecap="round" />
            <path d={`M 0 0 L ${Math.sin(fr / 4.77) * 52} ${-Math.cos(fr / 4.77) * 52}`} stroke="#a01818" strokeWidth={2.5} />
            <circle r={6} fill="#1a1612" />
          </g>
          {/* merdiven kemeri (sol kenar): karanlığa çıkan basamaklar */}
          <path d="M 0 1520 L 0 700 Q 70 620 130 700 L 130 1520 Z" fill="#0c0b09" stroke="#4a4033" strokeWidth={8} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M 0 ${1500 - i * 90} L ${120 - i * 6} ${1500 - i * 90}`} stroke="#2a241c" strokeWidth={6} />)}
          <path d="M 10 1500 L 110 900" stroke="#6a5a40" strokeWidth={6} />
          {/* asansör: pirinç kasa, kat göstergesi, kapılar */}
          <rect x={150} y={600} width={420} height={920} fill="#2a241c" stroke="#0d0b08" strokeWidth={8} />
          <rect x={164} y={612} width={392} height={896} fill="none" stroke="#8a6a3a" strokeWidth={6} />
          <path d="M 170 640 Q 360 560 550 640" stroke="#8a6a3a" strokeWidth={8} fill="none" />
          <rect x={270} y={640} width={180} height={90} rx={8} fill="#0c0606" stroke="#8a6a3a" strokeWidth={5} />
          <text x={360} y={712} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={84} fill="#ff2a1a">{kat}</text>
          <text x={360} y={712} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={84} fill="#ff2a1a" opacity={0.4} filter="url(#loParlak)">{kat}</text>
          <rect x={190} y={760} width={340} height={740} fill="url(#loKabin)" opacity={cabFl} />
          <path d="M 190 1500 L 530 1500 L 640 1700 L 80 1700 Z" fill="#fff6d0" opacity={op * 0.4 * cabFl} />
          <rect x={150} y={600} width={420} height={920} fill="#fff6d0" opacity={op * 0.07 * cabFl} />
          <rect x={190} y={760} width={170 * (1 - op)} height={740} fill="#7a7468" stroke="#0d0b08" strokeWidth={5} />
          <rect x={360 + 170 * op} y={760} width={170 * (1 - op)} height={740} fill="#726c60" stroke="#0d0b08" strokeWidth={5} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${200} ${820 + i * 170} L ${200 + 150 * (1 - op)} ${820 + i * 170} M ${370 + 170 * op} ${820 + i * 170} L ${520} ${820 + i * 170}`} stroke="#8a8478" strokeWidth={3} opacity={1 - op} />)}
          <rect x={590} y={1060} width={46} height={110} rx={8} fill="#8a6a3a" stroke="#0d0b08" strokeWidth={4} />
          <circle cx={613} cy={1095} r={10} fill="#5a1a14" />
          <circle cx={613} cy={1135} r={10} fill="#2a2a2e" />
          {/* kat rehberi panosu: 6 kat; 6'nın üstünde sökülmüş bir satır */}
          <rect x={600} y={620} width={150} height={330} fill="#14120f" stroke="#8a6a3a" strokeWidth={5} />
          <text x={675} y={652} textAnchor="middle" fontFamily="'Courier New', monospace" fontSize={17} fontWeight={700} fill="#d8c890">KAT REHBERİ</text>
          <rect x={612} y={666} width={126} height={22} fill="#1e1b16" stroke="#3a3528" strokeWidth={2} strokeDasharray="4 4" />
          {[6, 5, 4, 3, 2, 1].map((k, i) => <text key={k} x={618} y={714 + i * 38} fontFamily="'Courier New', monospace" fontSize={19} fontWeight={700} fill="#e8dcb0">{k} ······</text>)}
          {/* eski duvar telefonu (bej, çevirmeli) */}
          <rect x={650} y={1180} width={84} height={130} rx={10} fill="#bdb49a" stroke="#0a0b0d" strokeWidth={4} />
          <rect x={640} y={1172} width={104} height={34} rx={14} fill="#a89e84" stroke="#0a0b0d" strokeWidth={4} />
          <circle cx={692} cy={1260} r={26} fill="#a89e84" stroke="#0a0b0d" strokeWidth={3} />
          <path d="M 692 1310 q -20 40 0 80 q 20 40 0 80" stroke="#8a826c" strokeWidth={5} fill="none" />
          {/* pirinç posta kutuları 1-6 */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <rect x={600 + (i % 3) * 52} y={1360 + Math.floor(i / 3) * 62} width={46} height={54} rx={4} fill="#8a6a3a" stroke="#2a1c10" strokeWidth={3} />
              <text x={623 + (i % 3) * 52} y={1396 + Math.floor(i / 3) * 62} textAnchor="middle" fontFamily="'Courier New', monospace" fontSize={20} fontWeight={700} fill="#2a1c10">{i + 1}</text>
            </g>
          ))}
          {/* cam giriş kapısı: yağmurlu gece sokağı, sokak lambası */}
          <rect x={760} y={700} width={300} height={820} fill="url(#loSokak)" stroke="#2a241c" strokeWidth={12} />
          <path d="M 760 760 Q 910 640 1060 760" stroke="#2a241c" strokeWidth={12} fill="none" />
          <rect x={985} y={760} width={10} height={420} fill="#14181e" />
          <circle cx={990} cy={760} r={26} fill="#f2c870" opacity={0.85} />
          <circle cx={990} cy={760} r={120} fill="#f2c870" opacity={0.1} />
          <rect x={780} y={1300} width={260} height={210} fill="#0a0e14" />
          {new Array(16).fill(0).map((_, i) => <rect key={i} x={790 + (i % 8) * 32} y={1310 + Math.floor(i / 8) * 26} width={28} height={20} rx={4} fill="#1a2230" />)}
          {new Array(40).fill(0).map((_, i) => { const y = (fr * 26 + i * 97) % 820; const x = 770 + ((i * 53) % 280); return <path key={i} d={`M ${x} ${700 + y} l -6 30`} stroke="#8aa0b8" strokeWidth={2} opacity={0.5} />; })}
          <path d="M 910 700 L 910 1520" stroke="#2a241c" strokeWidth={8} />
          <path d="M 760 1050 L 1060 1050" stroke="#2a241c" strokeWidth={6} />
          {/* sokak lambası ışığı içeri düşer */}
          <path d="M 760 760 L 1060 760 L 820 1920 L 300 1920 Z" fill="url(#loHuzme)" opacity={flick} />
          {/* yeşil ÇIKIŞ ışığı */}
          <rect x={30} y={600} width={90} height={34} rx={4} fill="#1e8a4a" />
          <text x={75} y={624} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={20} fontWeight={900} fill="#e8fff0">ÇIKIŞ</text>
          <rect x={10} y={580} width={130} height={74} fill="#1e8a4a" opacity={0.12} />
          {/* zemin: karo desenli mermer, yansımalar */}
          <rect y={1520} width={W} height={400} fill="#1e1a16" />
          {new Array(9).fill(0).map((_, i) => new Array(4).fill(0).map((__, j) => {
            const x = i * 140 - 70 + (j % 2) * 70, y = 1540 + j * 100;
            return <path key={`${i}-${j}`} d={`M ${x} ${y + 50} L ${x + 70} ${y} L ${x + 140} ${y + 50} L ${x + 70} ${y + 100} Z`} fill={(i + j) % 2 ? "#2a241e" : "#1a1612"} stroke="#3a3228" strokeWidth={2} />;
          }))}
          <rect x={190} y={1530} width={340} height={220} fill="#7a7468" opacity={0.07} />
          <rect x={300} y={1530} width={480} height={30} fill="#e8f2ea" opacity={0.05 * flick} />
          {/* masa lambasının sıcak havuzu (masa önde) */}
          <ellipse cx={560} cy={1500} rx={360} ry={180} fill="url(#loLamba)" />
          {/* köşe karanlığı */}
          <rect width={W} height={H} fill="#000" opacity={0.12 + (1 - flick) * 0.35} />
        </g>
      );
    }
    case "market": {
      // Can Market 7/24, yerleşim: kamera ana koridordan arkaya bakar (kaçış noktası VX,VY).
      // SOL duvar: sokağa bakan cam vitrin + otomatik kapı (doorOpen) + kapı üstünde dijital saat (props.saat) + ekmek reyonu.
      // SAĞ ön: kasa (FG). Ece kasanın arkasında, yüzü sola (kapıya) dönük. ARKA: buzdolabı duvarı + sağ köşede DEPO kapısı (props.tv === "depo").
      const fr = props.frame ?? 0;
      const tb = props.turb ?? 0;
      const flick = tb > 0 ? (random(`mf${Math.floor(fr / 2)}`) > 1 - tb * 0.6 ? 0.4 : 1) : 1;
      const op = Math.max(0, Math.min(1, doorOpen));
      const saat = props.saat ?? "23:00";
      const depo = props.tv === "depo" ? 1 : 0;
      const VX = 620;
      const BL = 400, BR = 840, BT = 600, BB = 1100; // arka duvar dikdörtgeni
      // sol duvarda t (0 = kamera, 1 = arka duvar) noktası
      const lx = (t: number) => BL * t;
      const lt = (t: number) => 60 + (BT - 60) * t;
      const lb = (t: number) => 1780 - (1780 - BB) * t;
      const quadL = (t1: number, t2: number, f1: number, f2: number) => `M ${lx(t1)} ${lt(t1) + (lb(t1) - lt(t1)) * f1} L ${lx(t2)} ${lt(t2) + (lb(t2) - lt(t2)) * f1} L ${lx(t2)} ${lt(t2) + (lb(t2) - lt(t2)) * f2} L ${lx(t1)} ${lt(t1) + (lb(t1) - lt(t1)) * f2} Z`;
      // otomatik kapı: t 0.18-0.52 arası; iki kanat duvar boyunca kayar
      const d1 = 0.18, d2 = 0.52, dm = (d1 + d2) / 2;
      return (
        <g>
          <defs>
            <linearGradient id="mkSokak2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05080f" /><stop offset="1" stopColor="#141c2a" /></linearGradient>
            <linearGradient id="mkZemin2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfd4d0" /><stop offset="1" stopColor="#9aa29c" /></linearGradient>
            <linearGradient id="mkDolap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4fbff" /><stop offset="1" stopColor="#cfe4f2" /></linearGradient>
            <filter id="mkParlak2"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>
          <rect width={W} height={H} fill="#d6dbde" />
          {/* tavan + floresan tüpler (arkaya doğru) */}
          <path d={`M 0 0 L 1080 0 L ${BR} ${BT} L ${BL} ${BT} Z`} fill="#e6eaec" />
          {[0.15, 0.4, 0.62, 0.8].map((k, i) => { const y = 40 + (BT - 40) * k; const w = 360 * (1 - k * 0.75); const cx = 540 + (VX - 540) * k; return <rect key={i} x={cx - w / 2} y={y} width={w} height={Math.max(6, 22 * (1 - k))} rx={5} fill="#ffffff" opacity={0.95 * flick} />; })}
          {/* arka duvar: buzdolabı vitrini + DEPO kapısı */}
          <rect x={BL} y={BT} width={BR - BL} height={BB - BT} fill="#c8ced2" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={BL + 106 + i * 82} y={BT + 30} width={76} height={400} fill="url(#mkDolap)" stroke="#6a7278" strokeWidth={4} />
              {[0, 1, 2, 3].map((j) => <rect key={j} x={BL + 112 + i * 82} y={BT + 60 + j * 90} width={64} height={60} fill={["#d84a3a", "#3a8ad8", "#e8c03a", "#3ab86a"][(i + j) % 4]} opacity={0.75} />)}
            </g>
          ))}
          <rect x={BL + 10} y={BT + 110} width={88} height={390} fill={depo ? "#000" : "#4a5056"} stroke="#2a2e32" strokeWidth={5} />
          <rect x={BL + 10} y={BT + 110} width={88 * (1 - depo * 0.6)} height={390} fill="#5a6066" stroke="#2a2e32" strokeWidth={4} />
          <circle cx={BL + 10 + 88 * (1 - depo * 0.6) - 12} cy={BT + 320} r={5} fill="#c8ccd0" />
          <rect x={BL + 8} y={BT + 70} width={92} height={32} fill="#e8e0c0" stroke="#2a2e32" strokeWidth={3} />
          <text x={BL + 54} y={BT + 92} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={16} fontWeight={900} fill="#1a1a1a">DEPO</text>
          {/* sol duvar: cam vitrin, otomatik kapı, saat */}
          <path d={`M 0 60 L ${BL} ${BT} L ${BL} ${BB} L 0 1780 Z`} fill="#b8c0c4" />
          <path d={quadL(0.02, 0.98, 0.18, 0.92)} fill="url(#mkSokak2)" stroke="#5a6066" strokeWidth={6} />
          {/* yağmur ve sokak lambası (camın ardında) */}
          {new Array(30).fill(0).map((_, i) => { const t = 0.05 + ((i * 37) % 90) / 100; const y0 = lt(t) + (lb(t) - lt(t)) * 0.2; const h = (lb(t) - lt(t)) * 0.7; const y = y0 + ((fr * 18 + i * 53) % h); return <path key={i} d={`M ${lx(t)} ${y} l -3 ${16 * (1 - t * 0.6)}`} stroke="#8aa0b8" strokeWidth={2} opacity={0.45} />; })}
          <circle cx={lx(0.75)} cy={lt(0.75) + (lb(0.75) - lt(0.75)) * 0.35} r={16} fill="#f2c870" opacity={0.75} />
          {/* otomatik kapı kanatları */}
          <path d={quadL(d1, d1 + (dm - d1) * (1 - op), 0.2, 0.92)} fill="#9ab8cc" opacity={0.28} stroke="#7a8288" strokeWidth={5} />
          <path d={quadL(dm + (d2 - dm) * op, d2, 0.2, 0.92)} fill="#9ab8cc" opacity={0.28} stroke="#7a8288" strokeWidth={5} />
          <path d={quadL(d1, d2, 0.17, 0.2)} fill="#9aa2a8" />
          <path d={`M ${lx(d1)} ${lt(d1) + (lb(d1) - lt(d1)) * 0.17} L ${lx(d1)} ${lt(d1) + (lb(d1) - lt(d1)) * 0.93}`} stroke="#c8d0d6" strokeWidth={12} />
          <path d={`M ${lx(d2)} ${lt(d2) + (lb(d2) - lt(d2)) * 0.17} L ${lx(d2)} ${lt(d2) + (lb(d2) - lt(d2)) * 0.93}`} stroke="#c8d0d6" strokeWidth={9} />
          <path d={quadL(dm - 0.06, dm + 0.06, 0.5, 0.56)} fill="#e8f0f4" opacity={0.85 * (1 - op)} />
          <text x={lx(dm)} y={lt(dm) + (lb(dm) - lt(dm)) * 0.545} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={20} fontWeight={900} fill="#1a2a3a" opacity={1 - op}>GİRİŞ</text>
          <path d={`M ${lx(d1)} ${lb(d1) + 6} L ${lx(d2)} ${lb(d2) + 6} L ${lx(d2) + 120} ${lb(d2) + 30} L ${lx(d1) + 170} ${lb(d1) + 40} Z`} fill="#3a3e44" opacity={0.85} />
          {/* kapının önünde tavandan sarkan dijital saat panosu (düz okunur) */}
          <path d="M 120 180 L 120 250 M 300 180 L 300 250" stroke="#5a6066" strokeWidth={5} />
          <rect x={70} y={250} width={280} height={96} rx={10} fill="#140404" stroke="#3a3a3a" strokeWidth={6} />
          <text x={210} y={318} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={66} fill="#ff2a1a">{saat}</text>
          <text x={210} y={318} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={66} fill="#ff2a1a" opacity={0.4} filter="url(#mkParlak2)">{saat}</text>
          {/* camda ters okunan neon */}
          <path d={quadL(0.6, 0.9, 0.24, 0.3)} fill="#ff4a8a" opacity={0.18} />
          <text x={lx(0.75)} y={lt(0.75) + (lb(0.75) - lt(0.75)) * 0.29} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={26} fill="#ff4a8a" opacity={0.9} transform={`scale(-1 1) translate(${-2 * lx(0.75)} 0)`}>AÇIK 7/24</text>
          {/* ekmek reyonu (sol, kapının arkasında) */}
          <path d={quadL(0.6, 0.85, 0.62, 0.95)} fill="#e8a03a" stroke="#6a4a1a" strokeWidth={4} />
          {[0, 1, 2].map((i) => <ellipse key={i} cx={lx(0.64 + i * 0.07)} cy={lt(0.64 + i * 0.07) + (lb(0.64 + i * 0.07) - lt(0.64 + i * 0.07)) * 0.7} rx={18 - i * 3} ry={10 - i * 2} fill="#f0d090" stroke="#8a5a2a" strokeWidth={2} />)}
          <path d={quadL(0.6, 0.85, 0.56, 0.61)} fill="#2a1a0a" />
          {/* sağ duvar: sigara/tütün rafı (kasanın arkası) */}
          <path d={`M 1080 60 L ${BR} ${BT} L ${BR} ${BB} L 1080 1780 Z`} fill="#c4cacd" />
          <path d={`M 1080 360 L ${BR + 40} ${BT + 120} L ${BR + 40} ${BT + 330} L 1080 1000 Z`} fill="#3a3e44" stroke="#1a1c1e" strokeWidth={5} />
          {[0, 1, 2, 3, 4].map((j) => <path key={j} d={`M 1080 ${420 + j * 110} L ${BR + 40} ${BT + 150 + j * 38}`} stroke="#6a7078" strokeWidth={4} />)}
          {/* orta raf koridorları */}
          {[[0.0, 500], [1.0, 700]].map(([k, x]) => (
            <g key={x}>
              <path d={`M ${x - 70 + (x - 600) * 0.6} 1500 L ${x - 30 + (x - 600) * 0.2} 1040 L ${x + 30 + (x - 600) * 0.2} 1040 L ${x + 70 + (x - 600) * 0.6} 1500 Z`} fill="#eef0f2" stroke="#8a9298" strokeWidth={4} />
              {[0, 1, 2].map((j) => <path key={j} d={`M ${x - 64 + (x - 600) * 0.6 - j * 0} ${1160 + j * 110} L ${x + 64 + (x - 600) * 0.6} ${1160 + j * 110}`} stroke="#8a9298" strokeWidth={4} />)}
              {[0, 1, 2].map((j) => new Array(4).fill(0).map((__, q) => <rect key={`${j}-${q}`} x={x - 56 + (x - 600) * 0.5 + q * 30} y={1100 + j * 110} width={22} height={50} rx={4} fill={["#e84a3a", "#3a6ad8", "#e8a03a", "#3ab86a"][(j + q + (k as number)) % 4]} />))}
            </g>
          ))}
          {/* zemin */}
          <path d={`M 0 1780 L ${BL} ${BB} L ${BR} ${BB} L 1080 1780 L 1080 1920 L 0 1920 Z`} fill="url(#mkZemin2)" />
          {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${i * 135} 1920 L ${BL + i * ((BR - BL) / 8)} ${BB}`} stroke="#b2b8b2" strokeWidth={3} />)}
          {[1180, 1300, 1460, 1680].map((y) => <path key={y} d={`M 0 ${y} L 1080 ${y}`} stroke="#b2b8b2" strokeWidth={3} opacity={0.6} />)}
          {/* tekinsiz soğuk parlaklık */}
          <rect width={W} height={H} fill="#9ec4ff" opacity={0.05} />
          <rect width={W} height={H} fill="#000" opacity={(1 - flick) * 0.35} />
        </g>
      );
    }
    case "kat7_koridor": {
      // 1998'de yanmış arşiv katı: isli duvarlar, yanık kapılar (701-704), çökmüş tavan, yerde yanmış klasörler,
      // koridor sonunda pencereden şehir ışıkları, katman katman duman, uçuşan kül; fener ışığı.
      const fr = props.frame ?? 0;
      const VX = 540, VY = 880;
      const door = (side: number, k: number, no: string) => {
        // side -1 sol duvar, 1 sağ duvar; k: 0 yakın .. 1 uzak
        const t = 0.15 + k * 0.7;
        const xNear = side < 0 ? 0 : 1080, xFar = side < 0 ? VX - 150 : VX + 150;
        const x1 = xNear + (xFar - xNear) * t, x2 = xNear + (xFar - xNear) * (t + 0.12);
        const top1 = 0 + (VY - 190) * t, top2 = 0 + (VY - 190) * (t + 0.12);
        const bot1 = 1920 - (1920 - (VY + 190)) * t, bot2 = 1920 - (1920 - (VY + 190)) * (t + 0.12);
        const h1 = (bot1 - top1) * 0.55, h2 = (bot2 - top2) * 0.55;
        return (
          <g key={no}>
            <path d={`M ${x1} ${bot1 - 10} L ${x1} ${bot1 - h1} L ${x2} ${bot2 - h2} L ${x2} ${bot2 - 6} Z`} fill="#1a1410" stroke="#4a3a2a" strokeWidth={4} />
            <path d={`M ${x1} ${bot1 - h1} L ${x2} ${bot2 - h2} L ${x2} ${bot2 - h2 * 0.8} L ${x1} ${bot1 - h1 * 0.8} Z`} fill="#000" opacity={0.6} />
            <text x={(x1 + x2) / 2} y={(bot1 - h1 * 0.85 + bot2 - h2 * 0.85) / 2} textAnchor="middle" fontFamily="'Courier New', monospace" fontSize={Math.max(14, 40 * (1 - k * 0.7))} fontWeight={700} fill="#8a7a60">{no}</text>
          </g>
        );
      };
      return (
        <g>
          <defs>
            <radialGradient id="k7Is" cx="0.5" cy="0.62" r="0.6">
              <stop offset="0" stopColor="#f6e8c0" stopOpacity={0.45} />
              <stop offset="1" stopColor="#000" stopOpacity={0} />
            </radialGradient>
            <filter id="k7Bul"><feGaussianBlur stdDeviation="24" /></filter>
          </defs>
          <rect width={W} height={H} fill="#1e1b18" />
          {/* tavan, duvarlar, zemin (perspektif) */}
          <path d={`M 0 0 L 1080 0 L ${VX + 150} ${VY - 190} L ${VX - 150} ${VY - 190} Z`} fill="#24201c" />
          <path d={`M 0 0 L ${VX - 150} ${VY - 190} L ${VX - 150} ${VY + 190} L 0 1920 Z`} fill="#3a342e" />
          <path d={`M 1080 0 L ${VX + 150} ${VY - 190} L ${VX + 150} ${VY + 190} L 1080 1920 Z`} fill="#342f2a" />
          <path d={`M 0 1920 L ${VX - 150} ${VY + 190} L ${VX + 150} ${VY + 190} L 1080 1920 Z`} fill="#26221e" />
          {/* is: duvarların üst yarısı kararmış, alevin bıraktığı dil izleri */}
          <path d={`M 0 0 L ${VX - 150} ${VY - 190} L ${VX - 150} ${VY - 40} Q 300 500 0 760 Z`} fill="#0a0806" opacity={0.75} />
          <path d={`M 1080 0 L ${VX + 150} ${VY - 190} L ${VX + 150} ${VY - 40} Q 800 520 1080 700 Z`} fill="#0a0806" opacity={0.75} />
          {[0, 1, 2].map((i) => <path key={i} d={`M ${60 + i * 90} ${1100 - i * 60} q 30 -160 -10 -300 q 40 120 60 40 q 0 140 -20 260 Z`} fill="#0a0806" opacity={0.5} />)}
          {/* yanık kapılar */}
          {door(-1, 0.05, "701")}
          {door(-1, 0.6, "703")}
          {door(1, 0.15, "702")}
          {door(1, 0.7, "704")}
          {/* koridor sonu: kırık pencere, şehir ışıkları */}
          <rect x={VX - 150} y={VY - 190} width={300} height={380} fill="#0a0d14" stroke="#2a2420" strokeWidth={6} />
          <rect x={VX - 110} y={VY - 150} width={220} height={170} fill="#121a2a" />
          {new Array(14).fill(0).map((_, i) => <rect key={i} x={VX - 100 + (i % 7) * 30} y={VY - 60 + Math.floor(i / 7) * 30} width={10} height={14} fill="#e8c878" opacity={0.25 + 0.15 * ((i * 7) % 3)} />)}
          <path d={`M ${VX - 110} ${VY - 150} L ${VX - 30} ${VY - 60} L ${VX + 20} ${VY - 140} L ${VX + 110} ${VY - 40}`} stroke="#3a3a40" strokeWidth={3} fill="none" />
          <path d={`M ${VX - 150} ${VY + 190} L ${VX + 150} ${VY + 190}`} stroke="#000" strokeWidth={6} />
          {/* çökmüş tavan paneli + sarkan kablolar */}
          <path d="M 640 90 L 860 120 L 810 420 L 720 330 Z" fill="#3a3430" stroke="#0a0908" strokeWidth={5} />
          <path d="M 300 100 q 10 120 -20 220 M 330 110 q -20 100 10 180" stroke="#0a0908" strokeWidth={4} fill="none" />
          {/* yerde yanık klasörler ve kâğıtlar */}
          {[[180, 1700, -8], [300, 1620, 12], [760, 1680, -14], [880, 1760, 6], [620, 1560, 20]].map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y})`}>
              <rect x={x - 60} y={y - 34} width={120} height={68} fill={i % 2 ? "#3a2e22" : "#2a2018"} stroke="#0a0908" strokeWidth={4} />
              <path d={`M ${x - 60} ${y - 34} l 30 20 l 20 -14 l 26 22 l 24 -18 l 20 10`} fill="#0a0806" />
            </g>
          ))}
          {new Array(10).fill(0).map((_, i) => <rect key={i} x={200 + ((i * 89) % 700)} y={1450 + ((i * 53) % 380)} width={44} height={32} fill="#cfc4a8" opacity={0.5} transform={`rotate(${(i * 37) % 60 - 30} ${220 + ((i * 89) % 700)} ${1466 + ((i * 53) % 380)})`} />)}
          {/* tabela */}
          <rect x={640} y={560} width={300} height={90} fill="#1e1c18" stroke="#6a5a40" strokeWidth={5} transform="skewY(14)" />
          <text x={790} y={618} textAnchor="middle" fontFamily="'Courier New', monospace" fontSize={34} fontWeight={700} fill="#b8a888" transform="skewY(14)">7. KAT · ARŞİV</text>
          {/* duman katmanları */}
          <g filter="url(#k7Bul)" opacity={0.55}>
            {[0, 1, 2].map((i) => <ellipse key={i} cx={(i * 420 + fr * (0.6 + i * 0.3)) % 1500 - 200} cy={700 + i * 220} rx={420} ry={110} fill="#5a524a" opacity={0.35} />)}
          </g>
          {/* fener ışığı ve kül */}
          <rect width={W} height={H} fill="url(#k7Is)" />
          {new Array(50).fill(0).map((_, i) => { const y = (random(`ay${i}`) * 1920 + fr * (0.6 + random(`av${i}`))) % 1920; return <circle key={i} cx={(random(`ax${i}`) * 1080 + Math.sin((fr + i * 20) / 30) * 20)} cy={y} r={2 + random(`ar${i}`) * 3} fill="#d8c8a8" opacity={0.4} />; })}
          <rect width={W} height={H} fill="#000" opacity={0.06} />
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
              <stop offset="0" stopColor="#ffe9b0" stopOpacity={0.5} />
              <stop offset="1" stopColor="#ffe9b0" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="#5a3e24" />
          {new Array(27).fill(0).map((_, i) => <rect key={i} x={i * 40} y={420} width={36} height={1100} fill={i % 3 ? "#8a6238" : "#7a5430"} stroke="#4a321c" strokeWidth={3} />)}
          {[620, 900, 1180].map((y) => <path key={y} d={`M 0 ${y} L 1080 ${y + 10}`} stroke="#4a321c" strokeWidth={10} />)}
          {/* kapı: ahşap pervaz, dışarıda gök + kum, aşırı pozlanmış parıltı */}
          <rect x={830} y={600} width={210} height={900} fill="#bfe2f2" />
          <rect x={830} y={1150} width={210} height={350} fill="#f2dfae" />
          <rect x={830} y={1080} width={210} height={70} fill="#3fa0b4" />
          <path d="M 850 760 q 60 -40 160 10 M 840 880 q 90 -30 190 20" stroke="#4f8a3e" strokeWidth={26} fill="none" strokeLinecap="round" />
          <rect x={830} y={600} width={210} height={900} fill="#fff8e0" opacity={0.45} />
          <rect x={812} y={590} width={26} height={920} fill="#5a3a1e" stroke={O} strokeWidth={5} />
          <rect x={1032} y={590} width={26} height={920} fill="#5a3a1e" stroke={O} strokeWidth={5} />
          <rect x={812} y={576} width={246} height={28} fill="#5a3a1e" stroke={O} strokeWidth={5} />
          <path d="M 830 1500 L 1040 1500 L 1080 1920 L 660 1920 Z" fill="#f7e8b8" opacity={0.4} />
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
          {/* küçük ateş: taş halka, ön solda */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <ellipse key={i} cx={130 + Math.cos(i * 0.785) * 74} cy={1700 + Math.sin(i * 0.785) * 22} rx={20} ry={13} fill="#8a8480" stroke={O} strokeWidth={3} />)}
          <path d={`M 96 1700 Q 120 ${1630 + Math.sin(fr / 3) * 10} 130 1606 Q 142 ${1640 + Math.cos(fr / 4) * 10} 166 1700 Z`} fill="#ff9a3a" />
          <path d={`M 114 1700 Q 130 ${1650 + Math.sin(fr / 2) * 6} 146 1700 Z`} fill="#ffe08a" />
          <ellipse cx={130} cy={1690} rx={160} ry={60} fill="#ffb060" opacity={0.12 + 0.04 * Math.sin(fr / 3)} />
          {new Array(6).fill(0).map((_, i) => { const a = (fr + i * 30) % 180; return <circle key={i} cx={130 + Math.sin(a / 20) * 16} cy={1600 - a * 3} r={18 + a * 0.2} fill="#9a8a7a" opacity={Math.max(0, 0.3 - a / 600)} />; })}
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
          {/* Emir'in göğsüne ve yüzüne düşen sıcak ışık + havada toz */}
          <ellipse cx={420} cy={1440} rx={220} ry={70} fill="#ffe2a0" opacity={0.18} />
          {new Array(22).fill(0).map((_, i) => <circle key={i} cx={(random(`tz${i}`) * 700 + 280 + fr * 0.2 * (i % 3)) % 1080} cy={500 + ((random(`ty${i}`) * 1000 + fr * 0.4) % 1000)} r={2.5} fill="#fff2c8" opacity={0.5} />)}
          {/* genel loşluk */}
          <rect width={W} height={H} fill="#1a0e04" opacity={0.16} />
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
  if (name === "banyo_ayna" || name === "banyo_kapi") return <Banyo724FG view={name.slice(6) as BanyoView} frame={fr} doorOpen={0} />;
  if (name === "market_genel" || name === "market_kapi" || name === "market_kasa") return <Market724FG view={name.slice(7) as MarketView} frame={fr} doorOpen={0} saat="" iz={0} turb={turb} />;
  switch (name) {
    case "market":
      return (
        <g>
          {/* kasa bankosu: önü (müşteri tarafı) sola, kapıya bakar */}
          <path d="M 600 1530 L 1080 1500 L 1080 1920 L 640 1920 Z" fill="#d84a2a" stroke="#2a1410" strokeWidth={8} />
          <path d="M 560 1500 L 600 1530 L 640 1920 L 560 1920 Z" fill="#b83a20" stroke="#2a1410" strokeWidth={6} />
          <path d="M 560 1490 L 1080 1460 L 1080 1500 L 600 1530 Z" fill="#f0f0ec" stroke="#2a1410" strokeWidth={6} />
          {/* yazar kasa: ekranı Ece'ye, müşteri ekranı sola */}
          <path d="M 640 1440 L 760 1430 L 770 1490 L 640 1500 Z" fill="#2a2e32" stroke="#0a0b0d" strokeWidth={4} />
          <path d="M 648 1446 L 752 1438 L 758 1468 L 650 1476 Z" fill="#3a8a5a" />
          <rect x={880} y={1410} width={70} height={60} rx={6} fill="#e8e8e0" stroke="#2a1410" strokeWidth={4} />
          {[0, 1].map((i) => <rect key={i} x={888 + i * 30} y={1418} width={24} height={44} fill={["#e84a3a", "#3a8ad8"][i]} />)}
          <text x={850} y={1720} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={60} fontWeight={900} fill="#fff2e8" opacity={0.9}>CAN MARKET</text>
          <text x={850} y={1790} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={42} fontWeight={900} fill="#fff2e8" opacity={0.9}>7/24</text>
        </g>
      );
    case "lobi":
      return (
        <g>
          {/* üç CRT monitör (arkaları bize dönük değil, yan açı): ekranlarda yeşilimsi kamera görüntüleri */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={410 + i * 0} y={960 + i * 130} width={180} height={130} rx={12} fill="#1c1d20" stroke="#0a0b0d" strokeWidth={6} transform={`skewY(${-6})`} />
              <rect x={424} y={974 + i * 130} width={152} height={100} fill={i === 0 ? "#3a4a3a" : i === 1 ? "#34443a" : "#2e3e34"} transform={`skewY(${-6})`} />
              <rect x={424} y={974 + i * 130} width={152} height={100} fill="#9ec4a0" opacity={0.18} transform={`skewY(${-6})`} />
              <text x={430} y={994 + i * 130} fontFamily="'Courier New', monospace" fontSize={13} fontWeight={700} fill="#d8ffd8" transform={`skewY(${-6})`}>{["KAM 04", "KAM 01", "KAM 02"][i]}</text>
              <rect x={490} y={1010 + i * 130} width={20} height={40} fill="#1a2018" opacity={0.7} transform={`skewY(${-6})`} />
            </g>
          ))}
          <path d="M 590 980 L 780 920 L 780 1360 L 590 1360 Z" fill="#9ec4ff" opacity={0.08} />
          {/* masa */}
          <path d="M 400 1500 L 1080 1500 L 1080 1920 L 360 1920 Z" fill="#3a2414" stroke="#0a0b0d" strokeWidth={8} />
          {new Array(6).fill(0).map((_, i) => <path key={i} d={`M ${420 + i * 110} 1520 L ${400 + i * 116} 1920`} stroke="#2e1c10" strokeWidth={4} />)}
          <rect x={390} y={1468} width={700} height={44} fill="#5a3a22" stroke="#0a0b0d" strokeWidth={6} />
          {/* yeşil abajurlu masa lambası */}
          <path d="M 470 1468 L 470 1380" stroke="#8a6a3a" strokeWidth={8} />
          <path d="M 410 1390 Q 470 1340 530 1390 Z" fill="#1e6a3a" stroke="#0a0b0d" strokeWidth={4} />
          <ellipse cx={470} cy={1392} rx={58} ry={8} fill="#ffe4a0" opacity={0.9} />
          <rect x={440} y={1462} width={60} height={10} rx={4} fill="#8a6a3a" />
          {/* termos + defter + telsiz şarjı */}
          <rect x={560} y={1400} width={40} height={74} rx={10} fill="#8a1a1a" stroke="#0a0b0d" strokeWidth={4} />
          <path d="M 640 1466 L 760 1456 L 770 1470 L 646 1480 Z" fill="#e8e2cc" stroke="#0a0b0d" strokeWidth={3} />
          <rect x={980} y={1380} width={36} height={96} rx={8} fill="#1a1a1c" stroke="#0a0b0d" strokeWidth={4} />
          <path d="M 998 1380 l 0 -50" stroke="#1a1a1c" strokeWidth={6} />
        </g>
      );
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
  /** 7/24: ıslak ayak izlerinin ilerlemesi 0-1 */
  iz?: number;
}> = ({ name, layer, time = "gunduz", rain, flash = 0, doorOpen = 0, children, kus, saat, sallanan, kaydir, tv, turb, kemer, fincanElde, iz }) => {
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
        <SetBG name={name} time={time} rain={rain} flash={flash} doorOpen={doorOpen} kus={kus} saat={saat} sallanan={sallanan} kaydir={kaydir} tv={tv} turb={turb} kemer={kemer} iz={iz} />
      </svg>
      {LIGHT[time] ? <AbsoluteFill style={LIGHT[time]!} /> : null}
      <AbsoluteFill style={{ backgroundColor: "#cfe0ff", opacity: flash * 0.3, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

export { Door, Armchair, TV, Bird };
