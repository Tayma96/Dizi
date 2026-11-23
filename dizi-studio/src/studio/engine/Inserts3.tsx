/* Emir dizisi ekleme (insert) yakın planları. Hepsi 1080x1920 tam ekran SVG, kendi çizimimiz. */
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Character } from "../rig/Character";
import { castById } from "../cast";
import { Insert4, INSERT4_KINDS, type Insert4Kind } from "./Inserts4";
import { Insert5, INSERT5_KINDS, type Insert5Kind } from "./Inserts5";
import { Insert6, INSERT6_KINDS, type Insert6Kind } from "./Inserts6";
import { Insert7, INSERT7_KINDS, type Insert7Kind } from "./Inserts7";
import { Insert8, INSERT8_KINDS, type Insert8Kind } from "./Inserts8";
import { Insert9, INSERT9_KINDS, type Insert9Kind } from "./Inserts9";
import { Insert10, INSERT10_KINDS, type Insert10Kind } from "./Inserts10";
import { Insert11, INSERT11_KINDS, type Insert11Kind } from "./Inserts11";
import { Insert12, INSERT12_KINDS, type Insert12Kind } from "./Inserts12";
import { Insert13, INSERT13_KINDS, type Insert13Kind } from "./Inserts13";
import { Insert14, INSERT14_KINDS, type Insert14Kind } from "./Inserts14";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const O = "#1b1412";
const SKIN = "#e9b994";
const SUIT = "#1f2a44";

const Vig: React.FC<{ v?: number }> = ({ v = 0.55 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${v}) 100%)` }} />
);

/** Masa üstü: krem fincan + tabak, siyah deri masa, yumuşak gün ışığı */
const Masa: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <rect width={1080} height={1920} fill="#2a2524" />
    <rect width={1080} height={1920} fill="url(#masaIsik)" />
    <defs>
      <radialGradient id="masaIsik" cx="0.75" cy="0.2" r="0.9">
        <stop offset="0" stopColor="#fff0c8" stopOpacity={0.35} />
        <stop offset="1" stopColor="#fff0c8" stopOpacity={0} />
      </radialGradient>
    </defs>
    {children}
  </>
);

/** Kahve yudumu: takım elbise kolu, beyaz manşet; el fincanı kaldırıp kadraj dışına çıkarır */
const KahveYudum: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const reach = interpolate(f, [0, dur * 0.35], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const lift = interpolate(f, [dur * 0.4, dur * 0.85], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const hx = interpolate(reach, [0, 1], [1300, 640]);
  const cupY = 1180 - lift * 900;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <Masa />
        <ellipse cx={540} cy={1240} rx={250} ry={60} fill="#f4f0e8" stroke={O} strokeWidth={8} />
        <ellipse cx={540} cy={1236} rx={120} ry={26} fill="#e2dccf" />
        <g transform={`translate(0 ${cupY - 1180})`}>
          <path d="M 400 1000 L 680 1000 L 650 1200 Q 540 1250 430 1200 Z" fill="#fbf9f4" stroke={O} strokeWidth={9} />
          <ellipse cx={540} cy={1002} rx={140} ry={26} fill="#5a3a24" stroke={O} strokeWidth={7} />
          <ellipse cx={510} cy={998} rx={40} ry={6} fill="#8a6040" opacity={0.6} />
          <path d="M 676 1040 q 90 20 30 110" stroke={O} strokeWidth={12} fill="none" />
          {/* el */}
          <g transform={`translate(${hx - 640} 0)`}>
            <path d="M 700 1060 Q 760 1010 820 1040 L 1100 1000 L 1100 1240 L 820 1180 Q 740 1180 700 1120 Z" fill={SKIN} stroke={O} strokeWidth={8} />
            <path d="M 720 1080 q 30 -10 60 4 M 716 1110 q 30 -8 62 6" stroke="#b98a6a" strokeWidth={6} fill="none" />
            <rect x={960} y={980} width={60} height={290} rx={10} fill="#f6f6f8" stroke={O} strokeWidth={7} />
            <rect x={1010} y={960} width={200} height={330} fill={SUIT} stroke={O} strokeWidth={8} />
          </g>
        </g>
      </svg>
      <Vig />
    </AbsoluteFill>
  );
};

/** Fincanda titreşim: yukarıdan kahve yüzeyi, halkalar büyür (ilk sarsıntı) */
const KahveTitresim: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const amp = interpolate(f, [0, dur], [0.12, 0.5], clamp);
  const jx = (random(`kt${f}`) - 0.5) * 3 * amp;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <Masa />
        <g transform={`translate(${jx} ${jx * 0.6})`}>
          <circle cx={540} cy={960} r={420} fill="#f4f0e8" stroke={O} strokeWidth={9} />
          <circle cx={540} cy={960} r={320} fill="#fbf9f4" stroke={O} strokeWidth={8} />
          <circle cx={540} cy={960} r={270} fill="#4e321f" />
          <defs><clipPath id="kahveYuzey"><circle cx={540} cy={960} r={270} /></clipPath></defs>
          <g clipPath="url(#kahveYuzey)">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const r = ((f * 3 + i * 46) % 280);
              return <circle key={i} cx={540} cy={960} r={r} fill="none" stroke="#8a6444" strokeWidth={5} opacity={(1 - r / 280) * 0.8 * amp} />;
            })}
            <ellipse cx={460} cy={880} rx={90} ry={30} fill="#fff4dc" opacity={0.18} />
          </g>
          <path d="M 860 900 q 140 10 140 70 q 0 60 -140 70" stroke={O} strokeWidth={14} fill="none" />
        </g>
      </svg>
      <Vig />
    </AbsoluteFill>
  );
};

/** Notlar: masadaki anlaşma taslağı (okunur yazı, en az 2 sn) */
const Notlar: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1, 1.06], clamp);
  const lines = text ?? ["ANLAŞMA TASLAĞI", "$50.000.000.000"];
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a2524" }}>
      <AbsoluteFill style={{ transform: `scale(${z}) rotate(-3deg)` }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
          <rect x={150} y={360} width={780} height={1100} rx={10} fill="#f8f5ee" stroke={O} strokeWidth={8} />
          {new Array(12).fill(0).map((_, i) => <rect key={i} x={220} y={900 + i * 44} width={(i % 3 === 2 ? 380 : 620)} height={12} rx={6} fill="#b8b6b0" />)}
          <path d="M 260 1360 q 60 -80 110 -10 q 40 50 90 -30 q 30 -40 70 10" stroke="#1d2a44" strokeWidth={7} fill="none" />
          <rect x={640} y={1290} width={300} height={34} rx={17} fill="#141414" stroke={O} strokeWidth={5} transform="rotate(-28 790 1307)" />
          <rect x={890} y={1180} width={40} height={34} fill="#c9a24a" transform="rotate(-28 790 1307)" />
        </svg>
        <div style={{ position: "absolute", left: 220, top: 450, width: 660, fontFamily: "Georgia, serif", color: "#1d2a44" }}>
          <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: 2 }}>{lines[0]}</div>
          <div style={{ fontSize: 96, fontWeight: 700, marginTop: 40, color: "#0f1a30" }}>{lines[1]}</div>
          <div style={{ height: 6, width: 520, background: "#b8202a", marginTop: 14 }} />
        </div>
      </AbsoluteFill>
      <Vig v={0.6} />
    </AbsoluteFill>
  );
};

/** Dışarıdan uçak: bulutların üstünde, motordan duman, burun aşağı, irtifa kaybı */
const UcakDis: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], clamp);
  const ang = interpolate(p, [0, 1], [1, 7], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const dy = interpolate(p, [0, 1], [-60, 150], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const cloudShift = p * 420; // bulutlar yukarı kayar: uçak alçalıyor
  const shake = Math.sin(f / 2.2) * 2.5;
  const ex = 330, ey = 1095; // sol motor (uçak yerel koordinatı)
  const puffs = new Array(34).fill(0).map((_, i) => {
    const age = (f + 60 - i * 2);
    if (age < 0) return null;
    const a = (age % 68);
    const r = 26 + a * 2.4;
    return <circle key={i} cx={ex - 40 - a * 15} cy={ey - a * 3.5 + (random(`pf${i}`) - 0.5) * 30} r={r} fill={i % 3 ? "#3a3a3e" : "#5a5a60"} opacity={Math.max(0, 0.75 - a / 80)} />;
  });
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <defs>
          <linearGradient id="gokDis" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5d93cf" />
            <stop offset="0.55" stopColor="#a9cbe8" />
            <stop offset="1" stopColor="#f4d8a6" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#gokDis)" />
        <circle cx={900} cy={360} r={120} fill="#fff6d8" opacity={0.8} />
        {/* bulut katmanları (yukarı kayar) */}
        <g transform={`translate(0 ${-cloudShift * 0.6})`}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <ellipse key={i} cx={(i * 190 + 60) % 1180 - 50} cy={1500 + (i % 3) * 90} rx={230} ry={80} fill="#ffffff" opacity={0.95} />)}
          <rect x={0} y={1600} width={1080} height={1400} fill="#fbfbff" />
        </g>
        <g transform={`translate(0 ${dy + shake}) rotate(${ang} 540 960)`}>
          {puffs}
          {/* kuyruk */}
          <path d="M 120 900 L 60 640 L 170 640 L 280 880 Z" fill="#f2f4f6" stroke={O} strokeWidth={8} />
          <path d="M 120 920 L 20 960 L 60 990 L 220 960 Z" fill="#e4e8ec" stroke={O} strokeWidth={7} />
          {/* gövde */}
          <path d="M 110 880 Q 540 840 900 880 Q 1010 900 1040 960 Q 1010 1010 900 1020 Q 540 1050 140 990 Q 90 950 110 880 Z" fill="#f6f8fa" stroke={O} strokeWidth={9} />
          <path d="M 140 975 Q 540 1010 900 990" stroke="#2a3a5a" strokeWidth={10} fill="none" />
          {new Array(14).fill(0).map((_, i) => <rect key={i} x={300 + i * 44} y={900} width={20} height={26} rx={9} fill="#3a4a60" />)}
          <path d="M 950 900 Q 990 905 1010 925 L 960 930 Z" fill="#2a3a50" />
          {/* kanat + motor */}
          <path d="M 420 990 L 250 1180 L 340 1190 L 640 1000 Z" fill="#dfe4e9" stroke={O} strokeWidth={8} />
          <rect x={330} y={1060} width={170} height={70} rx={34} fill="#c9ced4" stroke={O} strokeWidth={8} />
          <ellipse cx={500} cy={1095} rx={16} ry={34} fill="#2a2a2e" />
          <path d="M 330 1080 q -20 15 0 30" stroke="#ff7a2a" strokeWidth={10} fill="none" opacity={0.6 + 0.4 * Math.sin(f / 2)} />
        </g>
      </svg>
      <Vig v={0.4} />
    </AbsoluteFill>
  );
};


/** Emniyet kemeri işareti yanar (iki tonlu ikaz ile birlikte) */
const KemerIsareti: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const on = f > 8;
  const z = interpolate(f, [0, dur], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#e9e7e2" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})` }}>
        <rect width={1080} height={1920} fill="#ecebe7" />
        <path d="M 0 1300 Q 540 1180 1080 1300 L 1080 1920 L 0 1920 Z" fill="#dedcd6" />
        <rect x={190} y={740} width={700} height={300} rx={40} fill="#d6d4ce" stroke={O} strokeWidth={10} />
        <rect x={230} y={780} width={620} height={220} rx={26} fill={on ? "#ffd84a" : "#a9a59c"} stroke={O} strokeWidth={6} />
        {on ? <rect x={230} y={780} width={620} height={220} rx={26} fill="#fff2a0" opacity={0.35 + 0.15 * Math.sin(f / 3)} /> : null}
        {/* emniyet kemeri simgesi */}
        <g transform="translate(400 890)" stroke="#2e2a24" strokeWidth={14} fill="none" strokeLinecap="round">
          <circle cx={0} cy={-55} r={22} fill="#2e2a24" />
          <path d="M -40 70 L -40 0 Q -40 -26 0 -26 Q 40 -26 40 0 L 40 70" />
          <path d="M -46 20 L 46 30" stroke="#2e2a24" strokeWidth={10} />
        </g>
        {/* sigara içilmez simgesi */}
        <g transform="translate(680 890)" stroke="#2e2a24" strokeWidth={12} fill="none">
          <circle cx={0} cy={0} r={70} />
          <rect x={-46} y={-10} width={92} height={20} fill="#2e2a24" />
          <path d="M -50 -50 L 50 50" />
        </g>
      </svg>
      {on ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(255,230,120,0.25) 0%, rgba(0,0,0,0) 40%)" }} /> : null}
      <Vig v={0.5} />
    </AbsoluteFill>
  );
};

/** Pencereden bakış: kanat ve motor; motordan ince bir duman başlar, kanat hafifçe sarsılır */
const PencereMotor: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], clamp);
  const smoke = interpolate(p, [0.25, 1], [0, 1], clamp);
  const wob = Math.sin(f / 2.6) * 6 + Math.sin(f / 5.3) * 4;
  const puffs = new Array(26).fill(0).map((_, i) => {
    const a = ((f * 1.4 + i * 9) % 140);
    if (smoke <= 0) return null;
    return <circle key={i} cx={410 - a * 4.2} cy={1150 - a * 0.9 + (random(`pm${i}`) - 0.5) * 20} r={(14 + a * 0.9) * (0.4 + smoke * 0.6)} fill={i % 3 ? "#4a4a50" : "#6a6a70"} opacity={Math.max(0, (0.6 - a / 240) * smoke)} />;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#d9d6cf" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <defs>
          <clipPath id="pmCam"><rect x={140} y={360} width={800} height={1200} rx={360} /></clipPath>
          <linearGradient id="pmGok" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6fa6dd" />
            <stop offset="0.6" stopColor="#c6def0" />
            <stop offset="1" stopColor="#f5d9a8" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="#e6e3dd" />
        <rect x={90} y={300} width={900} height={1320} rx={420} fill="#f1efea" stroke="#b9b4aa" strokeWidth={10} />
        <g clipPath="url(#pmCam)">
          <rect x={140} y={360} width={800} height={1200} fill="url(#pmGok)" />
          <g transform={`translate(0 ${wob * 0.5})`}>
            {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={((i * 300 - f * 2) % 1400 + 1400) % 1400 - 160} cy={1380 + (i % 2) * 40} rx={260} ry={60} fill="#fff" />)}
            <rect x={140} y={1420} width={800} height={200} fill="#fbfbff" />
          </g>
          {/* kanat ve motor (sarsılır) */}
          <g transform={`translate(0 ${wob}) rotate(${wob * 0.15} 300 1100) translate(540 1160) scale(1.45) translate(-540 -1160)`}>
            <path d="M 140 1000 L 960 1180 L 960 1240 L 140 1120 Z" fill="#e2e6ea" stroke={O} strokeWidth={8} />
            <path d="M 140 1060 L 960 1210" stroke="#b8bec6" strokeWidth={5} />
            <rect x={420} y={1110} width={240} height={110} rx={52} fill="#c9ced4" stroke={O} strokeWidth={8} />
            <ellipse cx={652} cy={1165} rx={26} ry={52} fill="#2a2a2e" stroke={O} strokeWidth={6} />
            <path d="M 420 1140 L 396 1150 L 396 1180 L 420 1190 Z" fill="#8a8e94" stroke={O} strokeWidth={5} />
            {puffs}
          </g>
        </g>
        {/* perde */}
        <rect x={140} y={360} width={800} height={150} fill="#dcd7ce" clipPath="url(#pmCam)" />
      </svg>
      <Vig v={0.55} />
    </AbsoluteFill>
  );
};

/** Koltuk kolunu sıkan el: takım elbise kolu, beyaz manşet, eklem yerleri beyazlar */
const KolDayama: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const grip = interpolate(f, [0, dur * 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sh = (random(`kd${f}`) - 0.5) * 6;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <rect width={1080} height={1920} fill="#7a6656" />
        <path d="M 0 0 L 1080 0 L 1080 1920 L 0 1920 Z" fill="#7a6656" />
        {new Array(8).fill(0).map((_, i) => <path key={i} d={`M 0 ${200 + i * 220} L 1080 ${180 + i * 220}`} stroke="#66544a" strokeWidth={5} strokeDasharray="14 10" />)}
        <g transform={`translate(${sh} ${sh * 0.5})`}>
          <rect x={-20} y={1020} width={1120} height={260} rx={60} fill="#2c2f35" stroke={O} strokeWidth={10} />
          <rect x={-20} y={1010} width={1120} height={40} fill="#8a9098" />
          {/* kol ve el */}
          <rect x={-40} y={760} width={420} height={250} fill={SUIT} stroke={O} strokeWidth={9} transform="rotate(-8 170 885)" />
          <rect x={330} y={780} width={70} height={240} rx={10} fill="#f6f6f8" stroke={O} strokeWidth={8} transform="rotate(-8 365 900)" />
          <path d={`M 390 860 Q 520 ${830 - grip * 20} 640 900 Q 700 960 690 ${1040 + grip * 40} L 640 ${1080 + grip * 30} Q 520 1080 420 1010 Z`} fill={SKIN} stroke={O} strokeWidth={9} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${470 + i * 52} ${930 + i * 6} q 30 ${50 + grip * 50} 0 ${110 + grip * 40}`} stroke={O} strokeWidth={7} fill="none" />)}
          {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={486 + i * 52} cy={936 + i * 6} rx={12} ry={7} fill="#f6e4d6" opacity={grip * 0.8} />)}
        </g>
      </svg>
      <Vig v={0.6} />
    </AbsoluteFill>
  );
};

const KUM = "#e6cf9c";
const Kum: React.FC = () => (
  <>
    <rect width={1080} height={1920} fill={KUM} />
    {new Array(160).fill(0).map((_, i) => <circle key={i} cx={random(`kx${i}`) * 1080} cy={random(`ky${i}`) * 1920} r={2 + random(`kr${i}`) * 4} fill={i % 2 ? "#cdb27c" : "#f4e2b8"} />)}
  </>
);

/** Yatan karakter (baş solda), ekleme çekimi için */
const Yatan: React.FC<{ id: string; size: number; cx: number; cy: number; eyes?: number; emotion?: string; rot?: number }> = ({ id, size, cx, cy, eyes = 1, emotion = "baygin", rot = -90 }) => (
  <div style={{ position: "absolute", left: cx - size * 0.2, top: cy - size * 0.2, transformOrigin: `${size * 0.2}px ${size * 0.2}px`, transform: `rotate(${rot}deg)` }}>
    <Character look={castById(id)} size={size} pose={{ emotion: emotion as never, eyesClosed: eyes, seed: 2, breath: 0.3, golgesiz: true }} />
  </div>
);

/** Kumda baygın Emir: yüz kan içinde, gömlek yırtık, güneş tepeden */
const EmirKumda: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1, 1.08], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}><Kum /></svg>
        <Yatan id="emir_kaza" size={2300} cx={330} cy={900} />
      </AbsoluteFill>
      <Vig v={0.2} />
    </AbsoluteFill>
  );
};

/** Sopa dürtmesi: hedef = "murettebat" (yerde yatan pilot, kımıldamıyor) | "emir" (yırtık beyaz gömlek) */
const SopaDurtme: React.FC<{ dur: number; hedef: "murettebat" | "emir" }> = ({ dur, hedef }) => {
  const f = useCurrentFrame();
  const n = hedef === "emir" ? 2 : 3;
  const per = dur / n;
  const k = (f % per) / per;
  const poke = k < 0.35 ? k / 0.35 : k < 0.5 ? 1 : 1 - (k - 0.5) / 0.5;
  const tip = interpolate(poke, [0, 1], [0, 120]);
  const give = poke > 0.95 ? 6 : 0;
  const id = hedef === "emir" ? "emir_kaza" : "pilot";
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}><Kum /></svg>
      <div style={{ position: "absolute", left: 0, top: give }}>
        <Yatan id={id} size={2600} cx={260} cy={760} emotion="baygin" />
      </div>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`translate(${-tip * 0.75} ${tip * 0.65})`}>
          <path d="M 640 1000 L 1180 420 L 1200 444 L 662 1020 Z" fill="#7a5530" stroke={O} strokeWidth={7} />
          <path d="M 900 730 l -30 -40 M 1040 570 l 30 10" stroke="#7a5530" strokeWidth={9} />
        </g>
      </svg>
      <Vig v={0.22} />
    </AbsoluteFill>
  );
};

/** Emir'in gözü bir an aralanır ve kapanır (çok yakın) */
const EmirGoz: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const eyes = interpolate(f, [0, dur * 0.3, dur * 0.42, dur * 0.62, dur * 0.8], [1, 1, 0.55, 0.6, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}><Kum /></svg>
      <Yatan id="emir_kaza" size={5200} cx={470} cy={1010} eyes={eyes} emotion="aci" />
      <Vig v={0.55} />
    </AbsoluteFill>
  );
};

/** Kumda parmaklar kıpırdar */
const EmirParmak: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  // istemsiz kas kasılması: önce işaret parmağı bir an kıvrılır, biraz sonra orta parmak hafifçe seğirir
  const spasm = (t0: number, amp: number) => { const k = f - t0; return k >= 0 && k < 5 ? amp * Math.sin((k / 5) * Math.PI) : 0; };
  const tw = (i: number) => (i === 0 ? spasm(Math.round(dur * 0.35), 16) : i === 1 ? spasm(Math.round(dur * 0.62), 9) : 0);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <Kum />
        <path d="M -40 1100 L 420 1020 L 440 1200 L -40 1260 Z" fill="#e6e0d4" stroke={O} strokeWidth={9} />
        <path d="M 400 1010 Q 520 980 620 1040 L 640 1180 Q 520 1220 420 1200 Z" fill={SKIN} stroke={O} strokeWidth={9} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`rotate(${-tw(i)} ${620} ${1050 + i * 36})`}>
            <path d={`M 610 ${1040 + i * 36} L 800 ${1030 + i * 40} Q 830 ${1046 + i * 40} 800 ${1064 + i * 40} L 616 ${1072 + i * 36} Z`} fill={SKIN} stroke={O} strokeWidth={7} />
          </g>
        ))}
        <path d="M 520 1000 Q 560 940 640 950 L 650 980 Q 590 990 560 1030 Z" fill={SKIN} stroke={O} strokeWidth={7} />
        <path d="M 470 1080 q 30 10 60 0" stroke="#8a1a1a" strokeWidth={8} opacity={0.6} />
        {/* kumda iz */}
      </svg>
      <Vig v={0.5} />
    </AbsoluteFill>
  );
};

/** İki genç Emir'i bileklerinden tutup ağaçlara doğru sürükler (geniş); arkada enkaz dumanı ve kuyruk */
const Tasima: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, dur], [780, 300], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#7fc0ea 0%,#d6eef8 30%,#1f7e9e 31%,#5fc6cc 40%,#e6cf9c 41%,#dcc08a 100%)" }} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        <defs><filter id="taBulanik"><feGaussianBlur stdDeviation="10" /></filter></defs>
        <path d="M 0 500 Q 200 420 420 520 L 460 820 L 0 860 Z" fill="#2f6a34" />
        <g filter="url(#taBulanik)">
          {new Array(6).fill(0).map((_, i) => { const a = (f * 0.7 + i * 50) % 300; return <ellipse key={i} cx={900 + a * 0.6} cy={760 - a * 1.8} rx={60 + a * 0.4} ry={44 + a * 0.3} fill="#6a6764" opacity={Math.max(0, 0.5 - a / 520)} />; })}
        </g>
        <path d="M 860 770 L 900 640 L 950 640 L 990 770 Z" fill="#e8ebee" stroke={O} strokeWidth={5} opacity={0.85} />
        <path d={`M ${x + 700} 1500 Q ${(x + 1080) / 2 + 300} 1490 1080 1496`} stroke="#c4a870" strokeWidth={12} strokeDasharray="34 18" fill="none" />
        <path d={`M ${x + 700} 1540 Q ${(x + 1080) / 2 + 300} 1530 1080 1536`} stroke="#c4a870" strokeWidth={12} strokeDasharray="34 18" fill="none" />
      </svg>
      <div style={{ position: "absolute", left: x + 40 - 0.2 * 900, top: 1150 - 0.2 * 900, transformOrigin: `${0.2 * 900}px ${0.2 * 900}px`, transform: "rotate(-80deg)" }}>
        <Character look={castById("emir_kaza")} size={900} pose={{ emotion: "baygin", eyesClosed: 1, seed: 2, golgesiz: true, armL: { upper: 168, fore: 0 }, armR: { upper: 168, fore: 0 } }} />
      </div>
      <div style={{ position: "absolute", left: x - 120 - 0.2 * 920, top: 1560 - 920 }}>
        <Character look={castById("yerli_genc")} size={920} pose={{ body: "walk", emotion: "kararli", yaw: -0.85, lookX: -1, lookY: 0.2, armR: { upper: 22, fore: -48 }, seed: 4 }} />
      </div>
      <div style={{ position: "absolute", left: x - 10 - 0.2 * 900, top: 1600 - 900 }}>
        <Character look={castById("yerli_genc2")} size={900} pose={{ body: "walk", emotion: "kararli", yaw: -0.85, lookX: -1, lookY: 0.2, armL: { upper: 22, fore: -48 }, seed: 5 }} />
      </div>
      <Vig v={0.22} />
    </AbsoluteFill>
  );
};

/** Reçineli yaprak sargı: koldaki yara parlayan reçineli yaprakla sarılmış, kadın eli bastırır */
const SargiYakin: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const press = interpolate(f, [0, dur * 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shine = 0.4 + 0.3 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <rect width={1080} height={1920} fill="#d8b866" />
        {new Array(40).fill(0).map((_, i) => <path key={i} d={`M ${random(`sx${i}`) * 1080} ${random(`sy${i}`) * 1920} q 30 -20 60 0`} stroke="#b8963e" strokeWidth={5} fill="none" />)}
        <path d="M -40 760 L 1120 700 L 1120 1180 L -40 1240 Z" fill={SKIN} stroke={O} strokeWidth={10} />
        <path d="M 300 740 Q 420 700 560 730 L 600 1200 Q 460 1230 330 1200 Z" fill="#4f7e34" stroke={O} strokeWidth={8} />
        <path d="M 520 728 Q 640 700 760 726 L 780 1180 Q 660 1206 560 1196 Z" fill="#5f8a3a" stroke={O} strokeWidth={8} />
        <path d="M 340 800 Q 450 780 560 800 M 560 790 Q 660 770 760 790" stroke="#2e4a1e" strokeWidth={5} fill="none" />
        <path d="M 360 880 Q 470 860 580 900" stroke="#f2c24a" strokeWidth={14} opacity={shine} fill="none" strokeLinecap="round" />
        <path d="M 600 960 Q 680 940 750 970" stroke="#f2c24a" strokeWidth={10} opacity={shine} fill="none" strokeLinecap="round" />
        <path d="M 300 1060 L 800 1040" stroke="#a57a44" strokeWidth={12} />
        {/* kadın eli: avuç yaprağa bastırır, başparmak + dört parmak, bilekte örgü bilezik */}
        <g transform={`translate(0 ${(1 - press) * -260})`}>
          <path d="M 540 -400 L 720 -400 L 704 640 L 556 640 Z" fill="#b8805a" stroke={O} strokeWidth={8} />
          <path d="M 548 -400 Q 560 100 566 600" stroke="#9a6644" strokeWidth={10} fill="none" opacity={0.5} />
          <rect x={548} y={560} width={164} height={34} rx={10} fill="#c9a24a" stroke={O} strokeWidth={5} />
          <path d="M 556 640 Q 540 740 580 790 L 700 790 Q 730 720 704 640 Z" fill="#b8805a" stroke={O} strokeWidth={8} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${592 + i * 32} 780 L ${590 + i * 34} 860 Q ${604 + i * 34} 880 ${618 + i * 34} 860 L ${616 + i * 32} 780`} fill="#b8805a" stroke={O} strokeWidth={6} />)}
          <path d="M 556 680 Q 500 720 510 790 Q 530 810 552 780 Q 556 740 580 720" fill="#b8805a" stroke={O} strokeWidth={6} />
        </g>
      </svg>
      <Vig v={0.55} />
    </AbsoluteFill>
  );
};

/** Göz kapağı katmanı: open 0 (kapalı) .. 1 (tam açık) */
const Kapaklar: React.FC<{ open: number }> = ({ open }) => {
  const h = interpolate(open, [0, 1], [980, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <path d={`M -100 -100 L 1180 -100 L 1180 ${h + 160} Q 540 ${h - 160} -100 ${h + 160} Z`} fill="#050302" />
        <path d={`M -100 2020 L 1180 2020 L 1180 ${1920 - h - 160} Q 540 ${1920 - h + 160} -100 ${1920 - h - 160} Z`} fill="#050302" />
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(0,0,0,0) ${30 + open * 25}%, rgba(0,0,0,0.85) 100%)` }} />
    </AbsoluteFill>
  );
};

const SazTavan: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
    <rect width={1080} height={1920} fill="#9a7838" />
    {new Array(30).fill(0).map((_, r) => (
      <path key={r} d={`M -40 ${r * 70} ${new Array(28).fill(0).map((_, i) => `L ${i * 44} ${r * 70 + (i % 2 ? 40 : 0)}`).join(" ")}`} stroke={r % 2 ? "#c9a45c" : "#7a5a28"} strokeWidth={10} fill="none" />
    ))}
    <path d="M 0 900 L 1080 760" stroke="#5a3e1c" strokeWidth={40} />
    {[[380, 0.9], [700, 0.6]].map(([x, o], i) => <circle key={i} cx={x} cy={600 + i * 500} r={60} fill="#fff4c8" opacity={o} />)}
  </svg>
);

/** POV: Emir gözlerini açmaya çalışır; saz çatı bulanık, kapaklar kırpışır */
const PovAcilis: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const open = interpolate(f, [0, dur * 0.2, dur * 0.35, dur * 0.5, dur * 0.7, dur * 0.85, dur], [0, 0.25, 0.1, 0.4, 0.2, 0.5, 0.45], clamp);
  const blur = interpolate(f, [0, dur], [26, 16], clamp);
  const sway = Math.sin(f / 18) * 10;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: `blur(${blur}px) brightness(1.1)`, transform: `translate(${sway}px, ${sway * 0.5}px)` }}>
        <AbsoluteFill style={{ filter: "blur(10px)" }}><SazTavan /></AbsoluteFill>
        <div style={{ position: "absolute", left: 540 - 0.2 * 3000, top: 960 - 0.2 * 3000 }}>
          <Character look={castById("yerli_kadin")} size={3000} pose={{ emotion: "notr", lookX: 0, lookY: 0.1, yaw: 0, tilt: -6, seed: 7 }} />
        </div>
      </AbsoluteFill>
      <Kapaklar open={open} />
    </AbsoluteFill>
  );
};

/** POV: genç kadın üstüne eğilmiş; text ["1"] bulanık başlangıç, ["2"] netleşme */
const PovKadin: React.FC<{ dur: number; faz: string }> = ({ dur, faz }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], clamp);
  const ilk = faz === "1";
  const open = ilk ? interpolate(p, [0, 1], [0.45, 0.65]) : interpolate(p, [0, 0.5, 1], [0.65, 1, 1]);
  const blur = ilk ? interpolate(p, [0, 1], [16, 8]) : interpolate(p, [0, 0.6, 1], [8, 0, 0]);
  const zoom = ilk ? interpolate(p, [0, 1], [1.0, 1.03]) : interpolate(p, [0, 1], [1.03, 1.08]);
  const size = 3000;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: `blur(${blur}px)`, transform: `scale(${zoom})` }}>
        <AbsoluteFill style={{ filter: "blur(10px)" }}><SazTavan /></AbsoluteFill>
        <div style={{ position: "absolute", left: 540 - 0.2 * size, top: 960 - 0.2 * size }}>
          <Character look={castById("yerli_kadin")} size={size} pose={{ emotion: ilk ? "notr" : "mutlu", lookX: 0, lookY: 0.1, yaw: 0, tilt: -6, seed: 7 }} />
        </div>
        <AbsoluteFill style={{ background: "linear-gradient(120deg, rgba(255,236,180,0.35) 0%, rgba(255,236,180,0) 45%)" }} />
      </AbsoluteFill>
      <Kapaklar open={open} />
    </AbsoluteFill>
  );
};

/** Çarpma: uçak dumanlar içinde ada kıyısındaki ağaçlara dalar; çarpma anında toz, kırılan ağaçlar, beyaz parlama ve sarsıntı */
const UcakCarpma: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const hit = dur * 0.72;
  const p = interpolate(f, [0, hit], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const px = interpolate(p, [0, 1], [120, 700]);
  const py = interpolate(p, [0, 1], [360, 1330]);
  const sc = interpolate(p, [0, 1], [0.5, 1.05]);
  const after = Math.max(0, f - hit);
  const shake = after > 0 ? Math.sin(after * 2.3) * Math.max(0, 26 - after * 1.2) : Math.sin(f / 2) * 3;
  const flash = after > 0 ? Math.max(0, 1 - after / 8) : 0;
  const smoke = new Array(30).fill(0).map((_, i) => {
    const age = (f - i * 1.6);
    if (age < 0 || f > hit) return null;
    const t0 = Math.max(0, (f - age)) / hit;
    const sx = interpolate(t0, [0, 1], [120, 700]) - 60;
    const sy = interpolate(t0, [0, 1], [360, 1330]) - 40;
    return <circle key={i} cx={sx - age * 1.5} cy={sy - age * 2.2} r={20 + age * 1.4} fill={i % 2 ? "#4a4846" : "#6a6764"} opacity={Math.max(0, 0.6 - age / 70)} />;
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
          <defs>
            <linearGradient id="ucGok" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6fb6e6" />
              <stop offset="1" stopColor="#d6eef8" />
            </linearGradient>
            <filter id="ucBul"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>
          <rect width={1080} height={1100} fill="url(#ucGok)" />
          <circle cx={820} cy={200} r={60} fill="#fffdf0" />
          <rect y={1000} width={1080} height={260} fill="#2a8eaa" />
          <path d="M 0 1240 Q 540 1200 1080 1250 L 1080 1920 L 0 1920 Z" fill="#e6cf9c" />
          <path d="M 380 1300 Q 600 1120 840 1180 Q 1000 1200 1080 1150 L 1080 1420 Q 760 1440 420 1420 Z" fill="#2f6a34" />
          {[460, 560, 660, 760, 880, 980].map((x, i) => {
            const bent = after > 0 && Math.abs(x - 700) < 200 ? Math.min(40, after * 4) * (x < 700 ? -1 : 1) : 0;
            return <g key={i} transform={`rotate(${bent} ${x} 1400)`}><path d={`M ${x} 1400 L ${x + 6} 1150`} stroke="#7a5a3a" strokeWidth={16} /><path d={`M ${x + 6} 1150 q -70 -10 -120 40 M ${x + 6} 1150 q 70 -10 120 40 M ${x + 6} 1150 q -20 -60 -80 -70 M ${x + 6} 1150 q 30 -60 90 -60`} stroke="#3e7e3a" strokeWidth={20} fill="none" strokeLinecap="round" /></g>;
          })}
          <g filter="url(#ucBul)">{smoke}</g>
          {f <= hit + 2 ? (
            <g transform={`translate(${px} ${py}) rotate(22) scale(${sc})`}>
              <path d="M -400 -40 Q 0 -80 300 -40 Q 400 -20 420 30 Q 390 70 300 80 Q 0 100 -380 50 Z" fill="#f6f8fa" stroke={O} strokeWidth={8} />
              <path d="M -380 30 Q 0 70 300 60" stroke="#2a3a5a" strokeWidth={9} fill="none" />
              <path d="M -360 -30 L -420 -240 L -320 -240 L -240 -40 Z" fill="#f2f4f6" stroke={O} strokeWidth={7} />
              <path d="M -60 40 L -240 220 L -150 230 L 120 50 Z" fill="#dfe4e9" stroke={O} strokeWidth={7} />
              <rect x={-170} y={110} width={150} height={60} rx={28} fill="#c9ced4" stroke={O} strokeWidth={6} />
              <path d="M -170 130 q -20 10 0 24" stroke="#ff7a2a" strokeWidth={10} fill="none" />
            </g>
          ) : null}
          {after > 0 ? (
            <g>
              {new Array(22).fill(0).map((_, i) => {
                const a = (i / 22) * Math.PI * 2;
                const r = after * (10 + random(`d${i}`) * 14);
                return <circle key={i} cx={720 + Math.cos(a) * r * 1.4} cy={1340 + Math.sin(a) * r * 0.6 - after * 3} r={30 + after * 2.5} fill={i % 3 ? "#c9b48a" : "#6a6560"} opacity={Math.max(0, 0.8 - after / 40)} />;
              })}
              {new Array(10).fill(0).map((_, i) => (
                <rect key={i} x={700 + Math.cos(i * 0.9) * after * 18} y={1320 - after * (8 + i * 2) + after * after * 0.4} width={24} height={10} fill="#e8ebee" stroke={O} strokeWidth={2} transform={`rotate(${after * 20 + i * 40} ${700 + Math.cos(i * 0.9) * after * 18} ${1320 - after * 8})`} />
              ))}
            </g>
          ) : null}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#fff8e8", opacity: flash }} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(f, [dur - 8, dur], [0, 1], clamp) }} />
    </AbsoluteFill>
  );
};

export type Insert3Kind = Insert14Kind | Insert13Kind | Insert12Kind | Insert11Kind | Insert10Kind | Insert4Kind | Insert5Kind | Insert6Kind | Insert7Kind | Insert8Kind | Insert9Kind | "kahve_yudum" | "kahve_titresim" | "notlar" | "ucak_dis" | "kemer_isareti" | "pencere_motor" | "kol_dayama" | "emir_kumda" | "sopa_murettebat" | "sopa_emir" | "emir_goz" | "emir_parmak" | "tasima" | "sargi_yakin" | "pov_acilis" | "pov_kadin" | "ucak_carpma";
export const INSERT3_KINDS: Insert3Kind[] = [...INSERT14_KINDS, ...INSERT13_KINDS, ...INSERT12_KINDS, ...INSERT11_KINDS, ...INSERT10_KINDS, ...INSERT4_KINDS, ...INSERT5_KINDS, ...INSERT6_KINDS, ...INSERT7_KINDS, ...INSERT8_KINDS, ...INSERT9_KINDS, "kahve_yudum", "kahve_titresim", "notlar", "ucak_dis", "kemer_isareti", "pencere_motor", "kol_dayama", "emir_kumda", "sopa_murettebat", "sopa_emir", "emir_goz", "emir_parmak", "tasima", "sargi_yakin", "pov_acilis", "pov_kadin", "ucak_carpma"];

export const Insert3: React.FC<{ kind: Insert3Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "kahve_yudum": return <KahveYudum dur={dur} />;
    case "kahve_titresim": return <KahveTitresim dur={dur} />;
    case "notlar": return <Notlar dur={dur} text={text} />;
    case "ucak_dis": return <UcakDis dur={dur} />;
    case "kemer_isareti": return <KemerIsareti dur={dur} />;
    case "pencere_motor": return <PencereMotor dur={dur} />;
    case "kol_dayama": return <KolDayama dur={dur} />;
    case "emir_kumda": return <EmirKumda dur={dur} />;
    case "sopa_murettebat": return <SopaDurtme dur={dur} hedef="murettebat" />;
    case "sopa_emir": return <SopaDurtme dur={dur} hedef="emir" />;
    case "emir_goz": return <EmirGoz dur={dur} />;
    case "emir_parmak": return <EmirParmak dur={dur} />;
    case "tasima": return <Tasima dur={dur} />;
    case "sargi_yakin": return <SargiYakin dur={dur} />;
    case "pov_acilis": return <PovAcilis dur={dur} />;
    case "ucak_carpma": return <UcakCarpma dur={dur} />;
    case "kurallar": case "ayak_izi": case "ekmek_raf": case "kasa_acilir": case "telefon_ekran": case "kapusonlu": return <Insert5 kind={kind} dur={dur} text={text} />;
    case "cctv_asansor": case "cctv_bos": case "cctv_lobi": case "kat_gostergesi": case "arka_bos": case "cctv_cik": case "pano_fener": case "not_yakin": case "telefon_cal": case "kablo": case "dugme_7": case "kep": case "takvim": case "dis_bina": return <Insert4 kind={kind} dur={dur} text={text} />;
    case "pov_yaprak": case "kol_saati": case "tv_son_dakika": case "yemek_ust": case "sozlesme": case "omuz_bastir": case "yemek_el": case "icir": case "telefon_kirik": return <Insert7 kind={kind} dur={dur} text={text} />;
    case "on_kamera": case "raf_duzen": case "depo_kolu": case "depo_el": case "el_kopar": return <Insert8 kind={kind} dur={dur} text={text} />;
    case "telefon_mesaj": case "yer_pov": case "tezgah_el": case "el_raf": return <Insert9 kind={kind} dur={dur} text={text} />;
    case "kapi_arka": case "kosu_takip": case "depo_acik": case "ambalaj_parmak": return <Insert10 kind={kind} dur={dur} text={text} />;
    case "b6_kapi": case "b6_zemin": case "b6_dis": return <Insert13 kind={kind} dur={dur} text={text} />;
    case "ev_anahtar": case "ev_zincir": return <Insert14 kind={kind} dur={dur} text={text} />;
    case "p2_kasa": case "p2_kapi": case "p2_kepenk": case "p2_koridor": case "p2_fisilti": case "p2_kulaklik": return <Insert12 kind={kind} dur={dur} text={text} />;
    case "omuz_el": case "donusum_yuz": case "donusum_govde": case "bocek_dev": case "bocek_yakin": case "ece_yakin": case "ece_sirt": case "sabri_omuz": case "bocek_golge": case "bocek_kukreme": return <Insert11 kind={kind} dur={dur} text={text} />;
    case "tablet_video": case "murekkep_parmak": case "kalem_cep": case "hap_uc": case "avuc_iki": case "foto_sofor": case "yuzuk_izi": return <Insert6 kind={kind} dur={dur} text={text} />;
    case "pov_kadin": return <PovKadin dur={dur} faz={(text ?? ["1"])[0]} />;
  }
};
