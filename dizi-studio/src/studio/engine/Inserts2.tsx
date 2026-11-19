/* İmza B1 parça 3-6 ekleme (insert) yakın planları. Hepsi 1080x1920 tam ekran SVG, kendi çizimimiz. */
import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const O = "#1b1412";
const SKIN = "#e6b08a";
const PAJAMA = "#8fa6b5";
const HAND_FONT = "'Courier New', monospace";

const Frame: React.FC<{ bg: string; dur: number; zoom?: [number, number]; vig?: number; children: React.ReactNode; pan?: [number, number] }> = ({ bg, dur, zoom = [1, 1.06], vig = 0.6, pan, children }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], zoom, clamp);
  const px = pan ? interpolate(f, [0, dur * 0.8], pan, { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `translateX(${px}px) scale(${z})` }}>
        {children}
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${vig}) 100%)` }} />
    </AbsoluteFill>
  );
};

/** Çentik demetleri (4 dikey + 1 çapraz) */
const Tally: React.FC<{ x: number; y: number; n: number; seed: string; s?: number; c?: string }> = ({ x, y, n, seed, s = 1, c = "#3a4640" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {new Array(n).fill(0).map((_, g) => {
      const gx = (g % 9) * 66 + random(`${seed}x${g}`) * 10;
      const gy = Math.floor(g / 9) * 70 + random(`${seed}y${g}`) * 10;
      return (
        <g key={g} transform={`translate(${gx} ${gy}) rotate(${(random(`${seed}r${g}`) - 0.5) * 8})`}>
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${i * 11} 0 L ${i * 11 + 2} 48`} stroke={c} strokeWidth={4} strokeLinecap="round" />)}
          <path d="M -6 38 L 44 8" stroke={c} strokeWidth={4} strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);

/** Kazınmış yazı: koyu oyuk + açık kenar */
const Carved: React.FC<{ x: number; y: number; size: number; children: string; rot?: number; anchor?: "start" | "middle" }> = ({ x, y, size, children, rot = -2, anchor = "middle" }) => (
  <g transform={`rotate(${rot} ${x} ${y})`}>
    <text x={x} y={y} textAnchor={anchor} fontFamily={HAND_FONT} fontWeight={700} fontSize={size} fill="none" stroke="#2c3630" strokeWidth={size * 0.07} strokeLinejoin="round">{children}</text>
    <text x={x + 3} y={y - 3} textAnchor={anchor} fontFamily={HAND_FONT} fontWeight={700} fontSize={size} fill="none" stroke="#e8eee9" strokeWidth={size * 0.02} opacity={0.7}>{children}</text>
  </g>
);

const Pill: React.FC<{ x: number; y: number; r?: number; kind: "beyaz" | "kapsul"; old?: boolean }> = ({ x, y, r = 0, kind, old }) =>
  kind === "beyaz" ? (
    <g transform={`rotate(${r} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx={36} ry={28} fill={old ? "#e8dcb0" : "#fbfbf8"} stroke={O} strokeWidth={5} />
      <path d={`M ${x - 26} ${y} H ${x + 26}`} stroke="#c8c8c0" strokeWidth={3} />
    </g>
  ) : (
    <g transform={`rotate(${r} ${x} ${y})`}>
      <rect x={x - 44} y={y - 18} width={46} height={36} rx={18} fill={old ? "#e8dcb0" : "#fbfbf8"} stroke={O} strokeWidth={5} />
      <rect x={x - 6} y={y - 18} width={46} height={36} rx={18} fill={old ? "#7d9cb8" : "#3f86d6"} stroke={O} strokeWidth={5} />
    </g>
  );

/* ------------------------------ P3 ------------------------------ */
const HapAvuc: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame bg="#7d878a" dur={dur}>
    <path d="M -40 1300 L 300 1180 Q 360 1400 300 1620 L -40 1700 Z" fill={PAJAMA} stroke={O} strokeWidth={9} />
    <path d="M 270 1150 Q 560 1020 840 1060 Q 1000 1120 960 1300 Q 900 1520 640 1560 Q 400 1600 280 1500 Z" fill={SKIN} stroke={O} strokeWidth={9} />
    <path d="M 420 1260 Q 600 1200 780 1280" stroke="#c98c66" strokeWidth={8} fill="none" />
    <ellipse cx={600} cy={1320} rx={170} ry={90} fill="#ffffff" opacity={0.25} />
    <Pill x={530} y={1320} kind="beyaz" r={10} />
    <Pill x={680} y={1300} kind="kapsul" r={-20} />
    <circle cx={520} cy={1306} r={7} fill="#fff" opacity={0.9} />
    <circle cx={690} cy={1290} r={6} fill="#fff" opacity={0.9} />
  </Frame>
);

const KameraLed: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = f > 0.3 * fps && f < 0.9 * fps;
  return (
    <Frame bg="#4a5450" dur={dur} vig={0.75}>
      <path d="M 0 0 L 1080 0 L 1080 600 L 0 900 Z" fill="#c3ccc5" />
      <rect x={720} y={0} width={60} height={260} fill="#3a4044" stroke={O} strokeWidth={6} />
      <g transform="rotate(28 700 320)">
        <rect x={360} y={240} width={460} height={220} rx={30} fill="#d8dcde" stroke={O} strokeWidth={10} />
        <rect x={280} y={280} width={100} height={140} rx={16} fill="#2a3034" stroke={O} strokeWidth={8} />
        <circle cx={330} cy={350} r={40} fill="#0e1214" />
        <circle cx={540} cy={420} r={22} fill={on ? "#ff2a2a" : "#4a1414"} />
        {on ? <circle cx={540} cy={420} r={60} fill="#ff2a2a" opacity={0.35} /> : null}
      </g>
    </Frame>
  );
};

const HapZulasi: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame bg="#2a302c" dur={dur} vig={0.7}>
    <rect x={0} y={700} width={1080} height={520} fill="#56645c" />
    <rect x={0} y={1180} width={1080} height={60} fill="#3a4640" />
    <path d="M 120 1060 Q 300 1030 520 1070 Q 760 1100 960 1050 L 960 1160 Q 700 1190 500 1170 Q 300 1150 120 1170 Z" fill="#141816" stroke={O} strokeWidth={8} />
    {new Array(22).fill(0).map((_, i) => (
      <Pill key={i} x={170 + random(`hz${i}`) * 760} y={1090 + random(`hy${i}`) * 60} r={random(`hr${i}`) * 180} kind={i % 2 ? "beyaz" : "kapsul"} old={random(`ho${i}`) > 0.45} />
    ))}
    {new Array(40).fill(0).map((_, i) => <circle key={i} cx={150 + random(`d${i}`) * 800} cy={1060 + random(`dd${i}`) * 120} r={2 + random(`dr${i}`) * 3} fill="#c8c0a8" opacity={0.5} />)}
    <path d="M -40 980 L 160 1010 Q 220 1060 180 1120 L -40 1140 Z" fill={SKIN} stroke={O} strokeWidth={8} />
    <Pill x={220} y={1060} kind="beyaz" r={20} />
  </Frame>
);

/** Karyolanın altındaki duvar: yüzlerce çentik ve büyük "İÇME" (kaydırarak) */
const IcmeDuvar: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame bg="#3e4a44" dur={dur} vig={0.65} pan={[260, -260]} zoom={[1.15, 1.18]}>
    <rect x={-400} y={0} width={1880} height={1920} fill="#56645c" />
    <Tally x={-360} y={560} n={63} seed="ic" s={0.95} />
    <Carved x={760} y={1300} size={260} rot={-3}>İÇME</Carved>
    <path d="M 1080 1270 q 60 -20 70 30 q 6 44 -50 40" stroke="#2c3630" strokeWidth={16} fill="none" strokeLinecap="round" />
    {[0, 1, 2].map((i) => <rect key={i} x={-360 + i * 700} y={0} width={34} height={1920} fill="#2a3034" opacity={0.85} />)}
    <rect x={-400} y={1500} width={1880} height={420} fill="#2a302c" opacity={0.6} />
  </Frame>
);

/** Parmak harfleri izler, toz dökülür; sonda tırnak altları beyaz */
const ParmakIz: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tr = interpolate(f, [0.2 * fps, dur - 1.4 * fps], [0, 1], clamp);
  const fx = 140 + tr * 820;
  const fy = 1010 + Math.sin(tr * Math.PI * 6) * 50;
  const turn = interpolate(f, [dur - 1.2 * fps, dur - 0.7 * fps], [0, 1], clamp);
  return (
    <Frame bg="#3e4a44" dur={dur} vig={0.6} zoom={[1, 1.04]}>
      <rect width={1080} height={1920} fill="#56645c" />
      <Carved x={540} y={1080} size={330} rot={-3}>İÇME</Carved>
      {new Array(18).fill(0).map((_, i) => {
        const t0 = i / 18;
        if (tr < t0) return null;
        const age = (tr - t0) * 8;
        return <circle key={i} cx={140 + t0 * 820 + random(`p${i}`) * 30} cy={1000 + age * 300} r={4 + random(`pr${i}`) * 4} fill="#e8e4d8" opacity={Math.max(0, 0.8 - age * 0.4)} />;
      })}
      {turn < 0.5 ? (
        <g transform={`translate(${fx} ${fy}) rotate(12)`}>
          {/* el: işaret parmağı uzanmış, diğerleri kıvrık */}
          <path d="M -40 380 Q -70 520 -40 700 L 300 720 Q 330 520 260 380 Q 150 330 -40 380 Z" fill={SKIN} stroke={O} strokeWidth={9} />
          {[0, 1, 2].map((i) => <path key={i} d={`M ${60 + i * 70} 390 q 10 -60 50 -50 q 30 10 20 60`} fill={SKIN} stroke={O} strokeWidth={7} />)}
          <rect x={-34} y={0} width={86} height={420} rx={43} fill={SKIN} stroke={O} strokeWidth={9} />
          <path d="M -14 22 Q 9 6 32 22 L 30 70 Q 9 62 -12 70 Z" fill="#f4dcc8" stroke={O} strokeWidth={5} />
          <path d="M -20 150 Q 9 140 38 150 M -20 290 Q 9 280 38 290" stroke="#c98c66" strokeWidth={5} fill="none" />
          <path d="M -50 700 L 310 720 L 330 1000 L -70 1000 Z" fill={PAJAMA} stroke={O} strokeWidth={9} />
          <rect x={-46} y={660} width={350} height={70} rx={14} fill="#f6f6f2" stroke={O} strokeWidth={7} />
        </g>
      ) : (
        <g>
          <rect width={1080} height={1920} fill="#2a302c" opacity={0.55} />
          <path d="M 300 1900 L 340 900 Q 360 760 480 760 Q 600 760 620 900 L 660 1900 Z" fill={SKIN} stroke={O} strokeWidth={10} />
          <path d="M 380 800 Q 480 720 580 800 L 570 880 Q 480 850 390 880 Z" fill="#f2f0e8" stroke={O} strokeWidth={8} />
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={410 + i * 36} cy={860} r={6} fill="#ffffff" />)}
        </g>
      )}
    </Frame>
  );
};

/* ------------------------------ P4 flaşları ------------------------------ */
const FlashIn: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f, [0, 5], [0.9, 0], clamp) }} />;
};

const FlasPlaza: React.FC<{ dur: number }> = ({ dur }) => (
  <AbsoluteFill>
    <Frame bg="#9fb6c8" dur={dur} zoom={[1, 1.1]} vig={0.4}>
      <path d="M 120 1920 L 380 0 L 1080 0 L 1080 1920 Z" fill="#5f7c96" />
      <path d="M 0 1920 L 120 1920 L 380 0 L 0 0 Z" fill="#d6e2ea" />
      {new Array(14).fill(0).map((_, i) => <path key={i} d={`M ${120 + i * 70} 1920 L ${380 + i * 52} 0`} stroke="#2e4256" strokeWidth={6} />)}
      {new Array(18).fill(0).map((_, i) => <path key={`h${i}`} d={`M ${120 + (1920 - i * 110) * 0.135} ${1920 - i * 110} L 1080 ${1920 - i * 140}`} stroke="#2e4256" strokeWidth={4} opacity={0.7} />)}
      <path d="M 500 400 L 900 300 L 1000 900 L 600 1000 Z" fill="#cfe0ee" opacity={0.35} />
    </Frame>
    <FlashIn />
  </AbsoluteFill>
);

const FlasKalem: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cap = interpolate(f, [0.35 * fps, 0.5 * fps], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Frame bg="#1c1814" dur={dur} vig={0.5}>
        <rect y={900} width={1080} height={1020} fill="#3a2a20" />
        <g transform="rotate(-20 540 1000)">
          <rect x={160} y={960} width={560} height={80} rx={36} fill="#14161a" stroke="#000" strokeWidth={6} />
          <rect x={700} y={975} width={90} height={50} rx={10} fill="#c9a75a" />
          <path d="M 780 985 L 880 1000 L 780 1015 Z" fill="#c9a75a" />
          <g transform={`translate(${-cap * 120} ${-cap * 60}) rotate(${-cap * 15} 200 1000)`}>
            <rect x={110} y={955} width={260} height={90} rx={40} fill="#1c1f24" stroke="#000" strokeWidth={6} />
            <rect x={190} y={940} width={160} height={18} rx={9} fill="#d9b45a" />
          </g>
          <rect x={220} y={968} width={300} height={10} rx={5} fill="#ffffff" opacity={0.3} />
        </g>
      </Frame>
      <FlashIn />
    </AbsoluteFill>
  );
};

/** Selim'in eli kâğıdı iter: gri manşet, çelik saat (koyu yeşil kadran). Yüz yok. */
const SelimEl: React.FC<{ x: number; y: number; s?: number; pen?: number }> = ({ x, y, s = 1, pen }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -120 L 520 -150 L 540 150 L 0 160 Z" fill="#8a8f98" stroke={O} strokeWidth={8} />
    <rect x={-40} y={-110} width={60} height={250} fill="#f2f2ee" stroke={O} strokeWidth={6} />
    <path d="M -40 -100 Q -260 -120 -330 -30 Q -360 60 -300 120 Q -200 160 -40 130 Z" fill="#e2b08c" stroke={O} strokeWidth={8} />
    <rect x={-120} y={-150} width={110} height={300} rx={20} fill="#9aa2a8" stroke={O} strokeWidth={6} />
    <circle cx={-65} cy={0} r={70} fill="#c8ced2" stroke={O} strokeWidth={7} />
    <circle cx={-65} cy={0} r={54} fill="#1f4a3a" />
    <path d="M -65 0 L -65 -40 M -65 0 L -35 10" stroke="#e8e8e0" strokeWidth={6} strokeLinecap="round" />
    {pen !== undefined ? (
      <g transform="rotate(-30 -300 0)">
        <rect x={-560} y={-20} width={300} height={40} rx={18} fill="#14161a" />
        <rect x={-300 - pen * 60} y={-26} width={90} height={52} rx={22} fill="#1c1f24" stroke="#000" strokeWidth={4} />
        <rect x={-290 - pen * 60} y={-34} width={60} height={12} rx={6} fill="#d9b45a" />
      </g>
    ) : null}
  </g>
);

const FlasEl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = interpolate(f, [0, 1.2 * fps], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Frame bg="#2a2420" dur={dur} vig={0.5}>
        <rect y={700} width={1080} height={1220} fill="#3a2a20" />
        <g transform={`translate(${-push * 160} ${push * 120})`}>
          <path d="M 260 900 L 860 860 L 920 1500 L 300 1560 Z" fill="#f4f0e4" stroke={O} strokeWidth={8} />
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={340} y={960 + i * 60} width={420 - (i % 3) * 60} height={14} rx={7} fill="#c8c0b0" />)}
          <path d="M 380 1440 H 760" stroke="#1a1a1a" strokeWidth={5} />
          <SelimEl x={900} y={1180} s={0.9} />
        </g>
      </Frame>
      <FlashIn />
    </AbsoluteFill>
  );
};

/** Geçmişteki Berkay'ın eli imzalar (bileklik yok, beyaz manşet); E kıvrımı, mürekkep lekesi */
const FlasImza: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(f, [0.1 * fps, dur - 0.4 * fps], [0, 1], clamp);
  const sig = "M 300 1300 q 40 -120 80 0 q 30 80 70 -20 q 20 -60 60 10 q 40 70 90 -40 q 30 -50 70 20 q 30 60 80 -30 q 60 -20 70 30 q 6 44 -50 40";
  const blot = interpolate(f, [dur - 0.6 * fps, dur], [0, 70], clamp);
  return (
    <AbsoluteFill>
      <Frame bg="#2a2420" dur={dur} vig={0.5}>
        <rect width={1080} height={1920} fill="#f4f0e4" />
        <path d="M 260 1340 H 860" stroke="#1a1a1a" strokeWidth={5} />
        <path d={sig} stroke="#10204a" strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray={2400} strokeDashoffset={2400 * (1 - t)} />
        {blot > 0 ? <circle cx={300 + t * 560} cy={1300} r={blot} fill="#10204a" opacity={0.85} /> : null}
        <g transform={`translate(${t * 560} ${Math.sin(t * 20) * 20})`}>
          <g transform="rotate(-30 300 1290)">
            <rect x={300} y={1270} width={420} height={36} rx={16} fill="#14161a" />
          </g>
          <path d="M 330 1240 Q 460 1080 700 1100 Q 860 1140 880 1300 Q 760 1400 560 1360 Q 420 1330 330 1240 Z" fill="#e6b08a" stroke={O} strokeWidth={8} />
          <path d="M 860 1100 L 1200 1000 L 1240 1380 L 880 1340 Z" fill="#f6f6f2" stroke={O} strokeWidth={8} />
        </g>
      </Frame>
      <FlashIn />
    </AbsoluteFill>
  );
};

/* ------------------------------ P4-P5 kapı aralığı ------------------------------ */
/** Kapı aralığından koridor: dar dikey şerit; içinde Dr. Deniz (yarım profil) ve Selim'in kolu/eli (yüzsüz) */
const KapiAraligi: React.FC<{ dur: number; kim?: "golge" | "ikisi" }> = ({ dur, kim = "ikisi" }) => {
  const f = useCurrentFrame();
  const sh = interpolate(f, [0, dur], [0, 80], clamp);
  return (
    <Frame bg="#0c0f10" dur={dur} vig={0.3} zoom={[1, 1.04]}>
      <defs>
        <clipPath id="aralik"><rect x={400} y={0} width={280} height={1920} /></clipPath>
      </defs>
      <g clipPath="url(#aralik)">
        <rect x={0} y={0} width={1080} height={1920} fill="#dfe4dc" />
        <rect x={0} y={1400} width={1080} height={520} fill="#b9c0b8" />
        {kim === "golge" ? (
          <g opacity={0.35}>
            <ellipse cx={500 + sh} cy={700} rx={60} ry={70} fill="#2a2e2c" />
            <rect x={440 + sh} y={760} width={120} height={700} rx={40} fill="#2a2e2c" />
            <ellipse cx={640 - sh * 0.5} cy={680} rx={64} ry={74} fill="#2a2e2c" />
            <rect x={580 - sh * 0.5} y={740} width={130} height={720} rx={40} fill="#2a2e2c" />
          </g>
        ) : (
          <g>
            {/* Dr. Deniz: beyaz önlük, topuz, gözlük (yarım profil) */}
            <rect x={440} y={760} width={220} height={900} rx={60} fill="#f2f2ee" stroke={O} strokeWidth={6} />
            <ellipse cx={550} cy={600} rx={100} ry={120} fill="#f1c6a0" stroke={O} strokeWidth={6} />
            <path d="M 450 560 Q 470 460 560 470 Q 650 480 650 560 Q 600 520 520 530 Q 480 540 450 560 Z" fill="#3a2a22" stroke={O} strokeWidth={5} />
            <circle cx={470} cy={520} r={40} fill="#3a2a22" stroke={O} strokeWidth={5} />
            <rect x={565} y={585} width={60} height={34} rx={10} fill="none" stroke="#2a3a5a" strokeWidth={6} />
            <path d="M 600 660 Q 620 668 640 660" stroke={O} strokeWidth={5} fill="none" />
            <circle cx={598} cy={600} r={7} fill="#3a2414" />
          </g>
        )}
      </g>
      {kim === "ikisi" ? <SelimEl x={760} y={1200} s={0.85} pen={0} /> : null}
      <rect x={380} y={0} width={20} height={1920} fill="#1a1e20" />
      <rect x={680} y={0} width={30} height={1920} fill="#1a1e20" />
    </Frame>
  );
};

const ElKalem: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const pen = t < 1.6 ? (Math.floor(t / 0.35) % 2 === 0 ? 0 : 1) : 0;
  return (
    <Frame bg="#cfd6cf" dur={dur} vig={0.55}>
      <rect width={1080} height={1920} fill="#dfe4dc" />
      <SelimEl x={760} y={1000} s={1.25} pen={pen} />
    </Frame>
  );
};

/** İkinci not: ışık şeridinin içinde, karyola altındaki duvar */
const IkinciNot: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame bg="#141816" dur={dur} vig={0.5} zoom={[1, 1.03]}>
    <rect width={1080} height={1920} fill="#2a302c" />
    <path d="M 380 0 L 700 0 L 1080 1920 L 160 1920 Z" fill="#56645c" />
    <path d="M 380 0 L 700 0 L 1080 1920 L 160 1920 Z" fill="#fff6d8" opacity={0.18} />
    <Tally x={40} y={420} n={20} seed="n2" s={0.7} />
    <Carved x={560} y={1000} size={74} rot={-2}>KUŞ HER SABAH</Carved>
    <Carved x={560} y={1100} size={74} rot={-2}>07:14'TE KONAR.</Carved>
    <Carved x={560} y={1260} size={68} rot={-3}>SAYMAYI BIRAKMA.</Carved>
  </Frame>
);

/* ------------------------------ P5-P6 saat, havalandırma, çentik ------------------------------ */
/** Duvar saati yakın planı: text = ["07:13"] ya da ["07:13", "07:14", "<atlama sn>"] */
const SaatYakin: React.FC<{ dur: number; text: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const jumpAt = text[2] ? parseFloat(text[2]) : 99;
  const t = f / fps;
  const [h, m] = (t >= jumpAt ? text[1] ?? text[0] : text[0]).split(":").map(Number);
  // saniye ibresi: atlama anında tam 12'de
  const sec = (jumpAt < 99 ? (t - jumpAt) * 6 : 300 + t * 6) % 360;
  const tick = Math.floor(t);
  return (
    <Frame bg="#8a948e" dur={dur} vig={0.65} zoom={[1, 1.08]}>
      <rect width={1080} height={1920} fill="#c3ccc5" />
      <g transform="translate(540 960)">
        <circle r={420} fill="#e9e6dc" stroke={O} strokeWidth={22} />
        <circle r={360} fill="none" stroke="#c8c4b8" strokeWidth={8} />
        {new Array(60).fill(0).map((_, i) => <rect key={i} x={-4} y={-380} width={8} height={i % 5 === 0 ? 50 : 22} fill={O} transform={`rotate(${i * 6})`} />)}
        <path d="M 0 0 L 0 -200" stroke={O} strokeWidth={30} strokeLinecap="round" transform={`rotate(${(h % 12) * 30 + m * 0.5})`} />
        <path d="M 0 0 L 0 -300" stroke={O} strokeWidth={20} strokeLinecap="round" transform={`rotate(${m * 6})`} />
        <path d="M 0 50 L 0 -330" stroke="#b33" strokeWidth={8} transform={`rotate(${sec})`} />
        <circle r={22} fill={O} />
        <text x={0} y={180} textAnchor="middle" fontFamily={HAND_FONT} fontWeight={700} fontSize={1} fill="none">{tick}</text>
      </g>
    </Frame>
  );
};

const Havalandirma: React.FC<{ dur: number }> = ({ dur }) => (
  <Frame bg="#2a302c" dur={dur} vig={0.75} zoom={[1, 1.12]}>
    <rect width={1080} height={1920} fill="#8a948e" />
    <rect x={140} y={560} width={800} height={800} rx={30} fill="#6e7872" stroke={O} strokeWidth={14} />
    {new Array(9).fill(0).map((_, i) => (
      <g key={i}>
        <rect x={190} y={620 + i * 80} width={700} height={44} rx={12} fill="#0a0c0b" />
        <rect x={190} y={610 + i * 80} width={700} height={14} rx={7} fill="#9aa49e" />
      </g>
    ))}
    {[[180, 600], [900, 600], [180, 1320], [900, 1320]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={14} fill="#4a524e" stroke={O} strokeWidth={4} />)}
  </Frame>
);

/** "183" ve tırnakla kazınan yeni çentik (toz dökülür) */
const Centik: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(f, [0.3 * fps, 1.8 * fps], [0, 1], clamp);
  return (
    <Frame bg="#56645c" dur={dur} vig={0.55}>
      <rect width={1080} height={1920} fill="#c3ccc5" />
      <Tally x={140} y={760} n={4} seed="c" s={1.8} c="#4c5a52" />
      <path d={`M 860 760 L ${860 + t * 4} ${760 + t * 86}`} stroke="#3a4640" strokeWidth={8} strokeLinecap="round" />
      {new Array(12).fill(0).map((_, i) => {
        const a = t * 8 - i * 0.5;
        if (a <= 0) return null;
        return <circle key={i} cx={862 + random(`ct${i}`) * 20} cy={760 + t * 86 + a * 90} r={4 + random(`cr${i}`) * 3} fill="#f0ece0" opacity={Math.max(0, 1 - a * 0.3)} />;
      })}
      <Carved x={540} y={1240} size={220} rot={-4}>183</Carved>
      {t < 1 ? (
        <g transform={`translate(${860 + t * 4} ${760 + t * 86})`}>
          <path d="M 0 0 Q 40 -30 140 -10 L 260 200 L 80 240 Z" fill={SKIN} stroke={O} strokeWidth={8} />
          <path d="M -8 -6 Q 20 -20 46 -8 L 40 10 Q 18 2 -4 10 Z" fill="#f2f0e8" stroke={O} strokeWidth={5} />
        </g>
      ) : null}
    </Frame>
  );
};

export type Insert2Kind =
  | "hap_avuc" | "kamera_led" | "hap_zulasi" | "icme" | "parmak"
  | "flas_plaza" | "flas_kalem" | "flas_el" | "flas_imza"
  | "kapi_araligi" | "kapi_golge" | "el_kalem" | "ikinci_not" | "saat" | "havalandirma" | "centik" | "siyah";

export const INSERT2_KINDS: Insert2Kind[] = ["hap_avuc", "kamera_led", "hap_zulasi", "icme", "parmak", "flas_plaza", "flas_kalem", "flas_el", "flas_imza", "kapi_araligi", "kapi_golge", "el_kalem", "ikinci_not", "saat", "havalandirma", "centik", "siyah"];

export const Insert2: React.FC<{ kind: Insert2Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "hap_avuc": return <HapAvuc dur={dur} />;
    case "kamera_led": return <KameraLed dur={dur} />;
    case "hap_zulasi": return <HapZulasi dur={dur} />;
    case "icme": return <IcmeDuvar dur={dur} />;
    case "parmak": return <ParmakIz dur={dur} />;
    case "flas_plaza": return <FlasPlaza dur={dur} />;
    case "flas_kalem": return <FlasKalem dur={dur} />;
    case "flas_el": return <FlasEl dur={dur} />;
    case "flas_imza": return <FlasImza dur={dur} />;
    case "kapi_araligi": return <KapiAraligi dur={dur} kim="ikisi" />;
    case "kapi_golge": return <KapiAraligi dur={dur} kim="golge" />;
    case "el_kalem": return <ElKalem dur={dur} />;
    case "ikinci_not": return <IkinciNot dur={dur} />;
    case "saat": return <SaatYakin dur={dur} text={text ?? ["07:13"]} />;
    case "havalandirma": return <Havalandirma dur={dur} />;
    case "centik": return <Centik dur={dur} />;
    case "siyah": return <AbsoluteFill style={{ backgroundColor: "#000" }} />;
  }
};
