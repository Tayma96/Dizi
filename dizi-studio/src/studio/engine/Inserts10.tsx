/* 7/24 Bölüm 4 eklemeleri (2.5D): kapi_arka (kapıda Ece arkadan → başını sol omzundan çevirip kamerayla göz göze),
 * kosu_takip (karşıdan bel üstü koşu, kamera Ece'yle geri geri gider). */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Bas25D, Govde25D } from "../rig/head25d";
import { Character } from "../rig/Character";
import { Market724BG, Market724FG } from "../sets/market724";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (x: number) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
const easeOut = (x: number) => 1 - (1 - Math.max(0, Math.min(1, x))) ** 3;

export type Insert10Kind = "kapi_arka" | "kosu_takip" | "depo_acik" | "ambalaj_parmak";
export const INSERT10_KINDS: Insert10Kind[] = ["kapi_arka", "kosu_takip", "depo_acik", "ambalaj_parmak"];

/** Baş dönüşü eğrisi: 180 (arka) → 350 (kameraya ~10°). Profilde (≈270) kısa ürkek duraklama. */
export const donusAci = (u: number) => {
  if (u <= 0) return 180;
  if (u >= 1) return 350;
  if (u < 0.46) return 180 + 84 * ease(u / 0.46);
  if (u < 0.58) return 264 + 8 * ((u - 0.46) / 0.12);
  return 272 + 78 * easeOut((u - 0.58) / 0.42);
};

/** Kapıda Ece, kamera arkasında (kapıya bakar). text[0]: dönüş başlangıcı (sn), text[1]: dönüş süresi (sn),
 *  text[2]: "son" verilirse dönüşün bittiği poz baştan gösterilir (tepki çekimi). */
const KapiArka: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f0 = useCurrentFrame();
  const { fps } = useVideoConfig();
  // text[3]: zaman kayması (tek eğri birkaç vuruşa bölünür; varış animasyonu her vuruşta baştan oynamaz)
  const kay = Number(text?.[3] || 0);
  const f = f0 + Math.round(kay * fps);
  const t = f / fps;
  const ece = castById("ece_sivil");
  const tBas = Number(text?.[0] ?? 1.4);
  const tSure = Number(text?.[1] ?? 2.4);
  const son = text?.[2] === "son";
  const u = son ? 1 : (t - tBas) / tSure;
  const aci = donusAci(u);
  // bakış başı 0.3 sn önden götürür
  const g = son ? 360 : donusAci(u + 0.3 / tSure) + (u > 0.7 ? 10 * ease((u - 0.7) / 0.3) : 0);
  const lookX = Math.max(-1, Math.min(1, Math.sin(((g - aci) * Math.PI) / 180) * 1.7));
  // varış: kuyruk öne savrulur, yaylanıp geri gelir; omuzlar nefesle kalkıp donar
  const tv = son ? 9 : t;
  const ileri = 34 * Math.exp(-3.2 * tv) * Math.cos(8.5 * tv) - 6 * ease((tv - 0.1) / 0.3) * 0;
  const sal = 12 * Math.exp(-2.5 * tv) * Math.sin(7 * tv + 0.6) + (u > 0 && u < 1 ? -16 * Math.sin(Math.PI * u) : 0);
  const omuz = son ? 6 : interpolate(t, [0, 0.35, 0.8, tBas], [0, 3, 6, 6], clamp) + Math.sin(t * 6) * (t < 0.8 ? 1.5 : 0);
  // gövde başı takip eder (boyun burkulması ≤ ~95°): 180 → 255
  const govdeAci = son ? 255 : 180 + 75 * ease((u - 0.3) / 0.7);
  const varis = son ? 1 : easeOut(t / 0.45);
  // kamera: varışta hafif öne kayar; dönüşte yavaş yaklaşma
  const S = 3.0 * (1.05 - 0.05 * varis) * (1 + 0.1 * ease(u));
  const X0 = 640, Y0 = 950 + 14 * (1 - varis) - 40 * ease(u);
  const door = son ? 0.62 : interpolate(t, [0.15, 1.4], [0, 0.62], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 });
  const isik = Math.max(0, Math.cos(((aci - 360) * Math.PI) / 180)) ** 1.2;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0c1018", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs>
          <filter id="ka10bl"><feGaussianBlur stdDeviation="7" /></filter>
          <radialGradient id="ka10kapi" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#7a9ad8" stopOpacity={0.5} /><stop offset="1" stopColor="#7a9ad8" stopOpacity={0} /></radialGradient>
          <radialGradient id="ka10vin" cx="0.55" cy="0.4" r="0.8"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.6} /></radialGradient>
        </defs>
        {/* kapı görünümü, yakından ve flu (alan derinliği) */}
        <g filter="url(#ka10bl)" transform={`translate(540 880) scale(${1.62 + 0.04 * ease(u)}) translate(-560 -880)`}>
          <Market724BG view="kapi" frame={f} doorOpen={door} saat="06:03" iz={1} turb={0} />
        </g>
        {/* açılan kapıdan giren şafak ışığı */}
        <ellipse cx={470} cy={980} rx={520} ry={760} fill="url(#ka10kapi)" opacity={0.4 + 0.6 * door} />
        {/* Ece (arkadan) */}
        <g transform={`translate(${X0} ${Y0}) scale(${S}) translate(-200 -300)`}>
          <Bas25D look={ece} aci={aci} katman="arka" kuyrukIleri={ileri} kuyrukSal={sal} uid="ka10k" />
          <Govde25D look={ece} aci={govdeAci} omuz={omuz} uid="ka10g" />
          <g transform={`translate(0 ${-omuz * 0.6})`}>
            <Bas25D look={ece} aci={aci} emotion={u > 0.55 ? "korkmus" : "sok"} lookX={lookX} lookY={-0.05} pale={0.3} dagin={1} kuyrukIleri={ileri} kuyrukSal={sal} isik={isik} kenar={0.8} uid="ka10" />
          </g>
        </g>
        <rect width={1080} height={1920} fill="url(#ka10vin)" />
      </svg>
    </AbsoluteFill>
  );
};

/** DEPO eşiğinde flu koyu siluet (kasa görünümü koordinatında; yüz seçilmez). a: 0..1 görünürlük, adim: 0..1 eşikten çıkış */
export const DepoSiluet: React.FC<{ a: number; adim?: number }> = ({ a, adim = 0 }) => (
  <g opacity={a} filter="url(#ka10sil)">
    <defs><filter id="ka10sil"><feGaussianBlur stdDeviation="9" /></filter></defs>
    <g transform={`translate(${1032 - 40 * adim} ${10 * adim}) scale(${1 + 0.06 * adim})`}>
      <ellipse cx={0} cy={600} rx={58} ry={70} fill="#06070a" />
      <path d="M -40 660 L 40 660 Q 118 690 122 780 L 112 1340 L -112 1340 L -122 780 Q -118 690 -40 660 Z" fill="#06070a" />
    </g>
  </g>
);

/** Karşıdan bel üstü koşu; kamera Ece'yle geri geri gider (arka plan katmanları uzaklaşır).
 *  text[0]: siluetin belirdiği sn (vars. dur-0.55; "yok" = siluet yok), text[1]: "sendele" → ilk 0.35 sn sendelemenin sonu. */
const KosuTakip: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ece = castById("ece_sivil");
  const p = Math.min(1, t / Math.max(0.5, dur));
  const ph0 = (f * 2 * Math.PI) / (0.6 * fps);
  // el kamerası: her basışta küçük sarsıntı
  const sBG = 1.2 - 0.2 * easeOut(p), sFG = 1.55 - 0.55 * easeOut(p);
  // text[0]: ayak basış zamanları ("0.00,0.40,…") ya da siluet anı; text[1]: siluet anı ya da "sendele"
  const adimlar = text?.[0]?.includes(",") ? text[0].split(",").map(Number) : null;
  const silRaw = adimlar ? text?.[1] : text?.[0];
  const silT = silRaw === "yok" ? Infinity : Number(silRaw ?? dur - 0.55);
  const silA = interpolate(t, [silT, silT + 0.25], [0, 0.85], clamp);
  const sendele = text?.[1] === "sendele" || (adimlar && adimlar[0] < 0.05) ? Math.max(0, 1 - t / 0.35) : 0;
  // koşu fazı basışlara kilitli: basış anında faz = π/2 + kπ (gövde en aşağıda)
  const kosPh = (() => {
    if (!adimlar || adimlar.length < 2) return undefined;
    const A = adimlar;
    if (t <= A[0]) return Math.PI / 2 + Math.PI * ((t - A[0]) / 0.3);
    for (let i = 0; i < A.length - 1; i++) if (t < A[i + 1]) return Math.PI / 2 + Math.PI * (i + (t - A[i]) / (A[i + 1] - A[i]));
    const per = A[A.length - 1] - A[A.length - 2];
    return Math.PI / 2 + Math.PI * (A.length - 1 + (t - A[A.length - 1]) / per);
  })();
  const ph = kosPh ?? ph0;
  const shY = 5 * Math.abs(Math.cos(ph)) - 2.5, shX = 3.5 * Math.sin(ph * 0.5);
  const size = 3000;
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1c20", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs><filter id="kt10bl"><feGaussianBlur stdDeviation="5" /></filter><filter id="kt10bl2"><feGaussianBlur stdDeviation="2.5" /></filter></defs>
        <g transform={`translate(${shX} ${shY})`}>
          {/* uzak katman: arka duvar, sigara dolabı, DEPO */}
          <g filter="url(#kt10bl)" transform={`translate(540 820) scale(${sBG}) translate(-540 -820)`}>
            <Market724BG view="kasa" frame={f} doorOpen={0} saat="06:03" iz={0} turb={0} />
            <DepoSiluet a={silA} adim={interpolate(t, [silT, silT + 0.6], [0, 1], clamp)} />
          </g>
          {/* orta katman: banko (hızlı uzaklaşır, sağ alta kayar) */}
          <g filter="url(#kt10bl2)" transform={`translate(${560 + 40 * (1 - p)} ${1520 + 120 * (1 - easeOut(p))}) scale(${sFG}) translate(-540 -1520)`}>
            <Market724FG view="kasa" frame={f} doorOpen={0} saat="" iz={0} turb={0} />
          </g>
        </g>
      </svg>
      {/* Ece: bel üstü, kadrajda sabit boy (kamera onunla gider) */}
      <div style={{ position: "absolute", left: 540 - size * 0.2 + shX * 0.3, top: 90 + shY * 0.3, transform: `rotate(${-7 * sendele}deg) translate(${-40 * sendele}px, ${30 * sendele}px)`, transformOrigin: "50% 60%" }}>
        <Character look={ece} size={size} pose={{ emotion: "dehset", body: "kos", kosPh: kosPh, lookX: 0.28, lookY: -0.1, talk: [[0, 9999]], seed: 31, sweat: true, golgesiz: true, hideLegs: true, pale: 0.15 }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Ece'nin gözünden DEPO: kapı ardına kadar açık, içi zifiri; eşikte hiçbir şey. Yavaş yaklaşma. */
const DepoAcik: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = interpolate(f, [0, dur * fps], [1, 1.12], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0b0d", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs>
          <linearGradient id="da10d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9ced0" /><stop offset="1" stopColor="#9aa0a4" /></linearGradient>
          <radialGradient id="da10v" cx="0.5" cy="0.5" r="0.7"><stop offset="0.45" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.7} /></radialGradient>
        </defs>
        <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
          <rect width={1080} height={1920} fill="url(#da10d)" />
          <rect x={210} y={250} width={660} height={1500} fill="#5a6066" stroke="#2a2e32" strokeWidth={10} />
          <rect x={250} y={290} width={580} height={1460} fill="#020203" />
          {/* duvara yaslanmış kanat */}
          <path d="M 250 290 L 300 330 L 300 1712 L 250 1750 Z" fill="#4a5056" stroke="#2a2e32" strokeWidth={6} />
          <circle cx={288} cy={1010} r={9} fill="#c8ccd0" />
          {/* zeminde floresanın ince yansıması */}
          <path d="M 330 1750 L 790 1750 L 700 1600 L 420 1600 Z" fill="#3a4048" opacity={0.25} />
          <rect x={360} y={170} width={360} height={64} fill="#e8e0c0" stroke="#2a2e32" strokeWidth={4} />
          <text x={540} y={214} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={40} fill="#1a1a1a">DEPO · PERSONEL</text>
          <rect y={1750} width={1080} height={170} fill="#b8bdbe" />
        </g>
        <rect width={1080} height={1920} fill="url(#da10v)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Sabri'nin parmakları (yakın): boş çikolata ambalajını çevirir. Mor ambalaj, sarı bant, yırtık gümüş uç. */
const AmbalajParmak: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const rot = -14 + 22 * ease(t / Math.max(0.5, dur * 0.8));
  const z = interpolate(t, [0, dur], [1, 1.1], clamp);
  const TEN = "#d8a47c", TEN2 = "#c08a64", O = "#2b1d1a";
  const kr = Math.sin(t * 9) * 1.5; // hışırtı titreşimi
  return (
    <AbsoluteFill style={{ backgroundColor: "#121418", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <defs>
          <radialGradient id="ap10" cx="0.45" cy="0.42" r="0.6"><stop offset="0" stopColor="#3a3c40" /><stop offset="1" stopColor="#0c0d10" /></radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#ap10)" />
        <g transform={`translate(540 900) scale(${z}) translate(-540 -900)`}>
          {/* hırka kolu (gri, örgü) */}
          <path d="M 1080 1500 L 720 1180 Q 660 1130 700 1060 L 1080 1240 Z" fill="#6a6a66" stroke={O} strokeWidth={6} />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${760 + i * 60} ${1150 + i * 30} l 40 -80`} stroke="#525250" strokeWidth={5} />)}
          <path d="M 700 1060 Q 690 1110 720 1180" stroke="#d8d0c0" strokeWidth={14} fill="none" />
          {/* el sırtı */}
          <path d="M 712 1080 Q 640 1000 560 980 Q 470 960 430 1000 Q 410 1040 450 1070 Q 520 1110 600 1150 Q 680 1180 720 1170 Z" fill={TEN} stroke={O} strokeWidth={6} strokeLinejoin="round" />
          {/* yüzük, işaret ve baş parmak ambalajı kıstırır */}
          <g transform={`rotate(${rot} 470 900)`}>
            <path d={`M 400 ${640 + kr} L 540 ${652 - kr} L 548 1010 L 392 1004 Z`} fill="#5a2a8a" stroke={O} strokeWidth={6} strokeLinejoin="round" />
            <rect x={396} y={790} width={148} height={78} fill="#f2c21a" transform="rotate(1.5 470 829)" />
            <path d="M 400 640 l 18 -34 l 22 26 l 26 -38 l 24 32 l 22 -24 L 540 652" fill="#c8ccd4" stroke={O} strokeWidth={5} strokeLinejoin="round" />
            <path d="M 420 700 q 40 18 100 -6 M 418 940 q 52 -20 108 8" stroke="#3a1a5a" strokeWidth={5} fill="none" />
            <path d="M 470 660 L 476 1000" stroke="#7a4aa8" strokeWidth={4} opacity={0.6} />
          </g>
          {/* işaret parmağı (üstte) */}
          <path d="M 560 990 Q 520 930 470 905 Q 430 890 418 910 Q 412 932 440 948 Q 500 980 540 1030 Z" fill={TEN} stroke={O} strokeWidth={6} strokeLinejoin="round" />
          <path d="M 425 905 q 8 -10 20 -4" stroke="#e8c8b0" strokeWidth={6} fill="none" />
          <path d="M 470 915 q 6 14 -4 24 M 505 945 q 6 12 -2 22" stroke={TEN2} strokeWidth={4} fill="none" />
          {/* baş parmak (altta) */}
          <path d="M 600 1130 Q 520 1100 470 1060 Q 440 1035 452 1012 Q 470 994 500 1012 Q 560 1050 640 1080 Z" fill={TEN} stroke={O} strokeWidth={6} strokeLinejoin="round" />
          <path d="M 460 1018 q 10 -8 22 0" stroke="#e8c8b0" strokeWidth={6} fill="none" />
          {/* eklem çizgileri, yaşlı el */}
          <path d="M 600 1020 q 12 10 8 24 M 640 1060 q 14 6 12 22 M 560 1060 q -6 14 4 26" stroke={TEN2} strokeWidth={4} fill="none" />
          <path d="M 640 1120 q 30 -10 50 6" stroke="#6a8aa8" strokeWidth={3} opacity={0.5} fill="none" />
        </g>
        <rect width={1080} height={1920} fill="#000" opacity={0.12} />
      </svg>
    </AbsoluteFill>
  );
};

export const Insert10: React.FC<{ kind: Insert10Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "kapi_arka": return <KapiArka dur={dur} text={text} />;
    case "kosu_takip": return <KosuTakip dur={dur} text={text} />;
    case "depo_acik": return <DepoAcik dur={dur} />;
    case "ambalaj_parmak": return <AmbalajParmak dur={dur} />;
    default: return null;
  }
};

/** Kontrol: baş dönüşü açıları (180/135/90/45/10 = kameraya göre) + önden rig karşılaştırması */
export const Donus25DSheet: React.FC = () => {
  const ece = castById("ece_sivil");
  const acilar = [180, 225, 270, 315, 350, 0];
  const etiket = ["180° arka", "135°", "90° profil", "45°", "10° göz göze", "0° (önden)"];
  return (
    <AbsoluteFill style={{ backgroundColor: "#cfd4d8" }}>
      <svg viewBox="0 0 2400 900" width="100%" height="100%">
        {acilar.map((a, i) => (
          <g key={a} transform={`translate(${i * 400} 40)`}>
            <g transform="translate(200 470) scale(1.35) translate(-200 -330)">
              <Bas25D look={ece} aci={a} katman="arka" uid={`sk${i}`} />
              <Govde25D look={ece} aci={a === 0 ? 0 : 180 + Math.min(75, Math.max(0, a - 180) * 0.45)} uid={`s${i}`} />
              <Bas25D look={ece} aci={a} emotion="sok" lookX={a === 350 ? 0.3 : 0} pale={0.3} dagin={1} uid={`sh${i}`} />
            </g>
            <text x={200} y={840} textAnchor="middle" fontFamily="Arial" fontWeight={800} fontSize={40} fill="#222">{etiket[i]}</text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Örnek klipler için tek başına kompozisyon */
export const B4Ornek: React.FC<{ kind: Insert10Kind; text?: string[] }> = ({ kind, text }) => {
  const { durationInFrames, fps } = useVideoConfig();
  return <Insert10 kind={kind} dur={durationInFrames / fps} text={text} />;
};
