import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { castById, type CastMember } from "../cast";
import { Character } from "../rig/Character";
import type { Pose } from "../rig/types";
import { SANS } from "../../dizi/fonts";
import { KD_BASLIK } from "../engine/KirmiziDugme";
import { KdStilFiltreleri } from "./KdStil";

/* =====================================================================================
 * Kırmızı Düğme · STİL 1 v2 "Renkli kontur" (kullanıcı seçimi, 23 Kasım 2026)
 * Kompozisyon KDStil2 → ornekler/kd-stil1-v2.png
 *
 * v1'e göre:
 *  - ÇİZGİ HİYERARŞİSİ: dış siluet kalın, iç çizgiler ince (v1'de her şey aynı kalınlıktaydı).
 *  - YEREL RENKLİ ÇİZGİ: her çizgi yanındaki dolgunun koyusu (ten → kızıl kahve, kot → lacivert, kazak → mor);
 *    karakterin imza mürekkebi bunun üstüne hafifçe karışır.
 *  - KAYNAMA yalnız dış hatta: yüz ve gözler sabit kalır, kenar 3 karede bir "kaynar" (el çizimi hissi).
 *  - IŞIK: her mekânın anahtar ışığına göre çarpımlı gölge bandı + karşı kenarda renkli kenar ışığı.
 *    Beyaz odada gölge YOK (incil: gölgesiz, rahatsız edici temizlik) → karakterler orada düz ve çıplak durur.
 *  - Kâğıt grenı ve 3 px riso kayması (v1'de 7 px: fazla bulanıktı).
 * Rig'e dokunmaz; yalnız Kırmızı Düğme'de karakteri saran filtre.
 * ===================================================================================== */

export type KdIsik = "ev" | "gece" | "pembe" | "oda";

/** Işık önayarları: yon = anahtar ışığın geldiği taraf (1: soldan, -1: sağdan). */
const ISIK: Record<KdIsik, { yon: number; golge: string; golgeOp: number; kenar: string; kenarOp: number }> = {
  ev: { yon: 1, golge: "#3a3a8a", golgeOp: 0.42, kenar: "#9fd0ff", kenarOp: 0.7 }, // TV mavisi soldan, mor gölge
  gece: { yon: -1, golge: "#4a2a6a", golgeOp: 0.45, kenar: "#ffb35a", kenarOp: 0.75 }, // sodyum lamba sağdan
  pembe: { yon: 1, golge: "#8a3a8a", golgeOp: 0.32, kenar: "#ffffff", kenarOp: 0.8 }, // ring ışık önden-soldan, pembe LED dolgu
  oda: { yon: 1, golge: "#9aa6ba", golgeOp: 0, kenar: "#ffffff", kenarOp: 0 }, // beyaz oda: gölgesiz
};

/** Bir karakter için v2 filtresi. `ad`: benzersiz id eki, `murekkep`: imza çizgi rengi, `kaynat`: titreme tohumu. */
export const KdKonturV2: React.FC<{ ad: string; murekkep: string; isik: KdIsik; kaynat: number; olcek?: number }> = ({ ad, murekkep, isik, kaynat, olcek = 1 }) => {
  const L = ISIK[isik];
  const s = olcek;
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <defs>
        <filter id={`kdK2-${ad}`} x="-10%" y="-6%" width="120%" height="112%" colorInterpolationFilters="sRGB">
          {/* 0) kaynak: yüz sabit, yalnız çok hafif bir el titremesi */}
          <feTurbulence type="fractalNoise" baseFrequency={0.03 / s} numOctaves={1} seed={kaynat} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={1.6 * s} xChannelSelector="R" yChannelSelector="G" result="w" />

          {/* 1) iç çizgi maskesi: koyu pikseller */}
          <feColorMatrix in="w" type="luminanceToAlpha" result="lum" />
          <feComponentTransfer in="lum" result="koyuA"><feFuncA type="discrete" tableValues="1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0" /></feComponentTransfer>
          <feComposite in="koyuA" in2="w" operator="in" result="maske0" />
          <feMorphology in="maske0" operator="erode" radius={0.35 * s} result="maske" />

          {/* 2) dolgu (çizgisiz) ve çizgiye taşan yerel renk */}
          <feComposite in="w" in2="maske0" operator="out" result="dolgu" />
          <feMorphology in="dolgu" operator="dilate" radius={3.2 * s} result="yayil" />
          {/* koyulaştır + doygunlaştır: çizgi = dolgunun koyusu */}
          <feColorMatrix in="yayil" type="matrix" values="0.62 -0.12 -0.12 0 0  -0.1 0.52 -0.1 0 0  -0.1 -0.1 0.58 0 0  0 0 0 1 0" result="koyu" />
          <feComposite in="koyu" in2="maske" operator="in" result="cizgiYerel" />
          <feFlood floodColor={murekkep} floodOpacity={0.42} />
          <feComposite in2="maske" operator="in" result="cizgiImza" />
          <feMerge result="icCizgi"><feMergeNode in="cizgiYerel" /><feMergeNode in="cizgiImza" /></feMerge>

          {/* 3) ışık: çarpımlı gölge bandı (anahtarın karşı kenarı) + kenar ışığı (anahtar tarafı) */}
          <feOffset in="w" dx={22 * L.yon * s} dy={-12 * s} result="kayG" />
          <feComposite in="w" in2="kayG" operator="out" result="bantG0" />
          <feGaussianBlur in="bantG0" stdDeviation={1.2 * s} result="bantG" />
          <feFlood floodColor={L.golge} floodOpacity={L.golgeOp} />
          <feComposite in2="bantG" operator="in" result="golge" />
          <feBlend in="golge" in2="dolgu" mode="multiply" result="dolguG0" />
          <feComposite in="dolguG0" in2="dolgu" operator="in" result="dolguG" />
          <feOffset in="w" dx={-7 * L.yon * s} dy={4 * s} result="kayK" />
          <feComposite in="w" in2="kayK" operator="out" result="bantK" />
          <feFlood floodColor={L.kenar} floodOpacity={L.kenarOp} />
          <feComposite in2="bantK" operator="in" result="kenar0" />
          <feComposite in="kenar0" in2="dolgu" operator="in" result="kenar" />

          {/* 4) kâğıt greni (yalnız karakterin içinde) */}
          <feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={2} seed={5} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.32  0 0 0 0 0.22  0 0 0 0 0.16  0 0 0 -0.8 0.42" result="g2" />
          <feComposite in="g2" in2="w" operator="in" result="gren" />

          {/* 5) dış siluet: kalın, imza mürekkep, kendi başına kaynar */}
          <feMorphology in="w" operator="dilate" radius={3.6 * s} result="sis" />
          <feComposite in="sis" in2="w" operator="out" result="dis0" />
          <feTurbulence type="fractalNoise" baseFrequency={0.045 / s} numOctaves={2} seed={kaynat + 20} result="n2" />
          <feDisplacementMap in="dis0" in2="n2" scale={4.5 * s} xChannelSelector="R" yChannelSelector="G" result="dis1" />
          <feFlood floodColor={murekkep} />
          <feComposite in2="dis1" operator="in" result="dis" />

          {/* 6) birleştir: dolgu (3 px riso kayması) → kenar ışığı → gren → iç çizgi → dış siluet */}
          <feOffset in="dolguG" dx={2.2 * s} dy={1.6 * s} result="dolguK" />
          <feOffset in="kenar" dx={2.2 * s} dy={1.6 * s} result="kenarK" />
          <feMerge><feMergeNode in="dolguK" /><feMergeNode in="kenarK" /><feMergeNode in="gren" /><feMergeNode in="icCizgi" /><feMergeNode in="dis" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
};

/** Karakterlerin imza mürekkepleri: kendi renk dünyalarının en koyusu. */
export const KD_MUREKKEP: Record<string, string> = {
  gobek: "#6a2a14",
  kurye: "#0a4a4a",
  infl: "#6a1a6a",
  teyze: "#5a1a3a",
  maskeli: "#1a1a2a",
};

const yer = (look: CastMember, pose: Pose, x: number, y: number, size: number, filtre?: string) => (
  <div style={{ position: "absolute", left: x - size * 0.2, top: y - size * 0.985, filter: filtre ? `url(#${filtre})` : undefined }}>
    <Character look={look} size={size} pose={{ golgesiz: !!filtre, kirpmaz: true, ...pose }} />
  </div>
);

const INK = "#24181c";
const PW = 1000, PH = 1180;

const Panel: React.FC<{ baslik: string; alt: string; bg: string; children: React.ReactNode }> = ({ baslik, alt, bg, children }) => (
  <div style={{ width: PW, display: "flex", flexDirection: "column" }}>
    <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 52, color: INK, lineHeight: 1.1 }}>{baslik}</div>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#6a5a60", marginBottom: 12 }}>{alt}</div>
    <div style={{ width: PW, height: PH, position: "relative", overflow: "hidden", borderRadius: 30, background: bg, border: `5px solid ${INK}` }}>{children}</div>
  </div>
);

const Gren: React.FC<{ op?: number }> = ({ op = 0.22 }) => (
  <AbsoluteFill style={{ background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0.5 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")", mixBlendMode: "multiply", opacity: op }} />
);

export const KDStil2: React.FC = () => {
  const frame = useCurrentFrame();
  const kaynat = 1 + (Math.floor(frame / 3) % 4);
  const g = castById("kd_gobek");
  const ku = castById("kd_kurye_kasksiz");
  const inf = castById("kd_influencer");
  const tz = castById("kd_dorduncu_teyze");
  const gO = castById("kd_gobek_oda");
  const kO = castById("kd_kurye_oda");
  const iO = castById("kd_influencer_oda");
  const GP: Pose = { gesture: "gobekKasi", emotion: "agizAcik", eyesClosed: 0.3, seed: 4 };
  const IP: Pose = { gesture: "slime", prop: "slime", emotion: "gulen", seed: 7 };
  const KP: Pose = { emotion: "notr", seed: 3 };
  const TP: Pose = { emotion: "gulen", seed: 9 };
  const filtreler: [string, string, KdIsik][] = [
    ["g-ev", KD_MUREKKEP.gobek, "ev"], ["k-gece", KD_MUREKKEP.kurye, "gece"], ["i-pembe", KD_MUREKKEP.infl, "pembe"],
    ["g-oda", KD_MUREKKEP.gobek, "oda"], ["k-oda", KD_MUREKKEP.kurye, "oda"], ["i-oda", KD_MUREKKEP.infl, "oda"], ["t-oda", KD_MUREKKEP.teyze, "oda"],
    ["g-cmp", KD_MUREKKEP.gobek, "ev"],
  ];
  return (
    <AbsoluteFill style={{ background: "#f3ece6" }}>
      <KdStilFiltreleri kaynat={kaynat} />
      {filtreler.map(([ad, m, i]) => <KdKonturV2 key={ad} ad={ad} murekkep={m} isik={i} kaynat={kaynat} />)}
      <div style={{ display: "flex", alignItems: "baseline", gap: 30, padding: "30px 60px 6px" }}>
        <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 110, color: "#e8202e", textShadow: "0 6px 0 #9a0a16" }}>Kırmızı Düğme</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 46, color: INK }}>Stil 1 · Renkli kontur v2</div>
      </div>

      {/* SATIR 1: v1 ↔ v2 karşılaştırma + dış dünya ışıkları */}
      <div style={{ display: "flex", gap: 50, padding: "16px 60px" }}>
        <Panel baslik="v1 (eski)" alt="her çizgi aynı kalınlık, tek renk, yüz titriyor" bg="#f6ecda">
          {yer(g, GP, 500, 1150, 1080, "kdKontur-gobek")}
          <Gren />
        </Panel>
        <Panel baslik="v2 · salon (TV ışığı)" alt="kalın dış hat, ince iç çizgi, yerel renkli çizgi, mavi kenar ışığı" bg="linear-gradient(110deg, #3a4a8a 0%, #2a2440 55%, #1a1628 100%)">
          <div style={{ position: "absolute", left: -120, top: 200, width: 520, height: 900, background: "radial-gradient(closest-side, #7ab0ff66, transparent)" }} />
          {yer(g, GP, 500, 1150, 1080, "kdK2-g-cmp")}
          <Gren op={0.18} />
        </Panel>
        <Panel baslik="v2 · gece caddesi" alt="sodyum lamba sağdan: turuncu kenar ışığı, mor gölge" bg="linear-gradient(200deg, #6a4430 0%, #2a2034 50%, #141020 100%)">
          <div style={{ position: "absolute", right: -160, top: -60, width: 640, height: 640, background: "radial-gradient(closest-side, #ffb35a88, transparent)" }} />
          {yer(ku, KP, 500, 1150, 1080, "kdK2-k-gece")}
          <Gren op={0.18} />
        </Panel>
        <Panel baslik="v2 · yayın odası" alt="ring ışık + pembe LED: yumuşak, sevimli" bg="linear-gradient(170deg, #f4c8e8 0%, #c8a8f0 60%, #8a68c8 100%)">
          <div style={{ position: "absolute", left: -260, top: 120, width: 700, height: 700, borderRadius: "50%", border: "60px solid #ffffffcc", filter: "blur(6px)" }} />
          {yer(inf, IP, 500, 1150, 1080, "kdK2-i-pembe")}
          <Gren op={0.14} />
        </Panel>
      </div>

      {/* SATIR 2: beyaz oda, gölgesiz, dördü yan yana */}
      <div style={{ padding: "26px 60px 0" }}>
        <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 52, color: INK }}>v2 · beyaz oda: gölgesiz, kenar ışığı yok, karakterler "çıplak"</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#6a5a60", marginBottom: 12 }}>dış dünyanın sıcak ışığından sonra burada her şey düz ve rahatsız edici temiz; kırmızıyı yalnız düğme taşır</div>
        <div style={{ width: 4180, height: 1240, position: "relative", overflow: "hidden", borderRadius: 30, border: `5px solid ${INK}`, background: "linear-gradient(180deg, #f8fafc 0%, #eef2f6 62%, #e2e8ee 62.2%, #f4f6f8 100%)" }}>
          {/* düğme ve kaide */}
          <svg width={4180} height={1240} style={{ position: "absolute", inset: 0 }}>
            <rect x={1990} y={760} width={200} height={300} rx={14} fill="#ffffff" stroke="#d8dee6" strokeWidth={4} />
            <ellipse cx={2090} cy={760} rx={100} ry={26} fill="#f2f5f8" stroke="#d8dee6" strokeWidth={4} />
            <ellipse cx={2090} cy={742} rx={60} ry={18} fill="#9a0a16" />
            <rect x={2030} y={712} width={120} height={30} fill="#d8101e" />
            <ellipse cx={2090} cy={712} rx={60} ry={18} fill="#f0283a" />
            <ellipse cx={2072} cy={706} rx={24} ry={6} fill="#ffffff" opacity={0.6} />
            <rect x={2050} y={800} width={80} height={34} rx={6} fill="#141418" />
            <text x={2090} y={826} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={26} fill="#ff3a3a">001</text>
          </svg>
          {yer(gO, { ...GP, gesture: undefined, emotion: "saskin" }, 560, 1190, 1060, "kdK2-g-oda")}
          {yer(kO, { emotion: "supheli", seed: 3 }, 1400, 1190, 1060, "kdK2-k-oda")}
          {yer(iO, { emotion: "korkmus", seed: 7 }, 2900, 1190, 1060, "kdK2-i-oda")}
          {yer({ ...tz, kilo: 0.55, build: "heavy", boy: 0.86, blush: true }, TP, 3700, 1190, 1060, "kdK2-t-oda")}
          <Gren op={0.1} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
