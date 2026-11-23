import React from "react";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { castById } from "../cast";
import { BeyazOda, Mizrak, petekBul, proj, type Kam, type OdaDurum, type OdaKarakter, type OdaNesne } from "../sets/beyazoda";

/* =====================================================================================
 * Kırmızı Düğme · prototip animasyonlar (sessiz):
 *   KdDugmeOrnek  (6 sn)  beyaz oda: tek düğme → basılır → yüzlerce düğme belirir → bölmeler açılır, nesneler fırlar
 *   KdKanca       (4,2 sn) B1 ilk 3 sn: FPS; düğmeye basılır, "DUUUR!", karşı duvarda bölme açılır, mızrak gelir,
 *                          çarpmadan sert kesme → dizi adı kartı
 *   KdLogo        dizi adı kartı (tek kare de kullanılabilir)
 *   FpsEl         birinci şahıs el (kol seçenekleri: notr / atlet / kurye / gomlek)
 * ===================================================================================== */

export const KD_BASLIK = "KdBaslik";
const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";
loadFont({ family: KD_BASLIK, url: staticFile("fonts/baloo-2-latin-800-normal.woff2"), weight: "800", unicodeRange: LATIN });
loadFont({ family: KD_BASLIK, url: staticFile("fonts/baloo-2-latin-ext-800-normal.woff2"), weight: "800", unicodeRange: LATIN_EXT });

const OUT = "#2a1e22";
const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => { const x = cl(v); return x * x * (3 - 2 * x); };

/* ------------------------------------------------------------------ FPS el */
export type KolTuru = "notr" | "atlet" | "kurye" | "gomlek" | "tirnak" | "pijama" | "esofman" | "hirka";
/** Uç noktası (işaret parmağı ucu) (x,y)'de; kol `aci` yönünden (derece, 0 = aşağıdan) gelir. sol: sol el (aynalı). */
export const FpsEl: React.FC<{ x: number; y: number; s?: number; aci?: number; kol?: KolTuru; sol?: boolean; bas?: number; ten?: string }> = ({ x, y, s = 1, aci = -28, kol = "notr", sol, bas = 0, ten: ten0 = "#f0c4a0" }) => {
  let ten = ten0;
  const eldiven = kol === "kurye";
  if (kol === "atlet") ten = "#ecd6c4";
  const el = eldiven ? "#25292e" : ten;
  const tombul = kol === "atlet" ? 1.28 : 1;
  const tirnakRenk = kol === "tirnak" ? "#ff6ab0" : "#f8dccb";
  const golge = eldiven ? "#16191c" : "#d8a47e";
  const sw = 6;
  const parmakBoy = 170 * (1 - 0.12 * bas);
  return (
    <g transform={`translate(${x} ${y}) rotate(${aci}) scale(${s * (sol ? -1 : 1)} ${s}) translate(-40 0) scale(${tombul} 1) translate(40 0)`}>
      {/* önkol */}
      <path d="M -24 330 L 156 330 L 236 1700 L -80 1700 Z" fill={ten} stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M 120 330 L 156 330 L 236 1700 L 170 1700 Z" fill={golge} opacity={0.5} />
      {kol === "atlet" ? (
        <g stroke="#3a2a20" strokeWidth={3} strokeLinecap="round" opacity={0.6}>
          {/* tombul, kıllı önkol */}
          {new Array(22).fill(0).map((_, i) => { const a = -10 + (i * 47) % 150, b = 420 + ((i * 89) % 900); return <path key={i} d={`M ${a} ${b} q 6 -9 13 -5`} fill="none" />; })}
        </g>
      ) : null}
      {kol === "tirnak" ? (
        <g>
          <path d="M -60 420 L 176 420 L 260 1700 L -120 1700 Z" fill="#cbb8f4" stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M -60 420 L 176 420 L 180 486 L -64 486 Z" fill="#a690d8" stroke={OUT} strokeWidth={4} />
          {new Array(10).fill(0).map((_, i) => <path key={i} d={`M ${-50 + i * 24} 424 v 58`} stroke="#cbb8f4" strokeWidth={3} />)}
          <ellipse cx={58} cy={392} rx={100} ry={30} fill="#ff9cc8" stroke={OUT} strokeWidth={4} />
        </g>
      ) : null}
      {kol === "pijama" ? (
        <g>
          <path d="M -50 430 L 176 430 L 260 1700 L -110 1700 Z" fill="#a8c8f0" stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M -50 430 L 176 430" stroke="#ffffff" strokeWidth={10} />
          {new Array(8).fill(0).map((_, i) => <path key={i} d={`M ${-10 + (i % 3) * 70} ${520 + i * 120} a 14 14 0 1 0 16 -18 a 10 10 0 1 1 -16 18 Z`} fill="#6f98d0" />)}
        </g>
      ) : null}
      {kol === "esofman" ? (
        <g>
          <path d="M -50 420 L 176 420 L 260 1700 L -110 1700 Z" fill="#6a3ab8" stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M 120 420 L 196 1700" stroke="#c8f03a" strokeWidth={22} />
          <path d="M -50 420 L 176 420 L 178 470 L -52 470 Z" fill="#4e2a8a" stroke={OUT} strokeWidth={4} />
          {/* bileğe sarılı tesbih: kırmızı mantar düğme taneler */}
          {new Array(9).fill(0).map((_, i) => <circle key={i} cx={-36 + i * 22} cy={392 + Math.sin(i) * 4} r={11} fill="#e2202e" stroke={OUT} strokeWidth={2.5} />)}
        </g>
      ) : null}
      {kol === "hirka" ? (
        <g>
          <path d="M -60 440 L 176 440 L 260 1700 L -120 1700 Z" fill="#7a3a6a" stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M -60 440 L 176 440 L 180 506 L -64 506 Z" fill="#5e2a52" stroke={OUT} strokeWidth={4} />
          {new Array(10).fill(0).map((_, i) => <path key={i} d={`M ${-50 + i * 24} 444 v 58`} stroke="#7a3a6a" strokeWidth={3} />)}
          <path d="M -34 400 Q 60 420 160 398" stroke="#c9a24a" strokeWidth={8} fill="none" />
        </g>
      ) : null}
      {kol === "notr" ? (
        <g>
          <path d="M -40 440 L 170 440 L 250 1700 L -100 1700 Z" fill="#f3f5f4" stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M -40 440 L 170 440 L 176 490 L -44 490 Z" fill="#d8dddd" stroke={OUT} strokeWidth={4} />
          {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${-30 + i * 24} 444 v 42`} stroke="#b8bec0" strokeWidth={3} />)}
          <path d="M 150 500 L 230 1700" stroke="#d6dadb" strokeWidth={40} />
        </g>
      ) : null}
      {kol === "kurye" ? (
        <g>
          <path d="M -50 420 L 176 420 L 260 1700 L -110 1700 Z" fill="#18a39a" stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M -58 620 L 190 620 L 196 680 L -62 680 Z" fill="#e4eaee" stroke={OUT} strokeWidth={4} />
          <path d="M 150 440 L 240 1700" stroke="#11807a" strokeWidth={40} />
          <path d="M -34 330 L 160 330 L 172 430 L -46 430 Z" fill="#25292e" stroke={OUT} strokeWidth={5} />
        </g>
      ) : null}
      {kol === "gomlek" ? (
        <g>
          {/* gömlek manşeti + kol saati (4. kişi A ipucu) */}
          <path d="M -50 470 L 176 470 L 260 1700 L -110 1700 Z" fill="#d3e3f4" stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M -50 470 L 176 470 L 180 540 L -54 540 Z" fill="#a9c2dc" stroke={OUT} strokeWidth={4} />
          <circle cx={150} cy={505} r={8} fill="#f4f4f0" stroke={OUT} strokeWidth={3} />
          <path d="M -30 372 L 166 372 L 168 430 L -34 430 Z" fill="#2a2a2e" stroke={OUT} strokeWidth={4} />
          <rect x={24} y={350} width={90} height={100} rx={20} fill="#c8ccd0" stroke={OUT} strokeWidth={5} />
          <rect x={34} y={360} width={70} height={80} rx={14} fill="#eef0ea" stroke={OUT} strokeWidth={3} />
          <path d="M 69 400 v -26 M 69 400 h 20" stroke={OUT} strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : null}
      {/* el sırtı */}
      <path d="M -30 120 Q -48 230 -30 340 L 150 340 Q 178 240 160 140 Q 130 100 60 104 Q 10 104 -30 120 Z" fill={el} stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M 120 150 Q 150 240 136 336 L 150 340 Q 178 240 160 140 Z" fill={golge} opacity={0.6} />
      {/* kıvrık parmaklar */}
      {[[42, 118, 27], [88, 122, 26], [128, 136, 24]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={el} stroke={OUT} strokeWidth={sw} />)}
      {/* başparmak */}
      <path d="M -26 290 Q -92 262 -86 200 Q -80 170 -56 180 Q -44 214 -22 236 Z" fill={el} stroke={OUT} strokeWidth={sw} strokeLinejoin="round" />
      {/* işaret parmağı */}
      <g transform={`translate(0 ${170 - parmakBoy})`}>
        <rect x={-23} y={0} width={46} height={parmakBoy + 10} rx={23} fill={el} stroke={OUT} strokeWidth={sw} />
        {!eldiven ? <rect x={-14} y={8} width={28} height={kol === "tirnak" ? 38 : 32} rx={12} fill={tirnakRenk} stroke="#c89a80" strokeWidth={2.5} /> : null}
        {kol === "atlet" ? <path d="M -14 70 l 6 -6 M 0 74 l 6 -6 M -12 110 l 6 -6 M 4 112 l 6 -6" stroke="#3a2a20" strokeWidth={2.5} opacity={0.6} /> : null}
        <path d={`M -12 ${parmakBoy * 0.42} q 12 6 24 0 M -12 ${parmakBoy * 0.72} q 12 6 24 0`} stroke={OUT} strokeWidth={3} fill="none" opacity={0.45} />
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ logo */
/** Baloo 2 ExtraBold ilerleme genişlikleri (em) */
const GEN: Record<string, number> = { K: 0.615, I: 0.305, R: 0.609, M: 0.797, Z: 0.56, D: 0.666, U: 0.664, "Ğ": 0.664, E: 0.548 };
export const KdLogo: React.FC<{ t?: number; arkaPlan?: boolean }> = ({ t = 10, arkaPlan = true }) => {
  // t: saniye (kart açıldıktan beri). 10 = son hal.
  const dus = ease(t / 0.28);
  const ezil = t > 0.28 && t < 0.5 ? Math.sin(((t - 0.28) / 0.22) * Math.PI) : 0;
  const flas = t > 0.3 && t < 0.7 ? 1 - (t - 0.3) / 0.4 : 0;
  const harf = (i: number) => { const u = cl((t - 0.35 - i * 0.05) / 0.25); return u <= 0 ? 0 : u < 0.7 ? (u / 0.7) * 1.15 : 1.15 - 0.15 * ((u - 0.7) / 0.3); };
  const DUGME = ["D", "U", "Ğ", "M", "E"];
  const KIRMIZI = "KIRMIZI";
  const sim = (x: number, y: number, r: number, c: string, k: number) => (
    <path d={`M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z`} fill={c} opacity={k} />
  );
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
      <defs>
        <radialGradient id="kl_bg" cx="0.5" cy="0.42" r="0.7"><stop offset="0" stopColor="#ffffff" /><stop offset="0.6" stopColor="#eef4f7" /><stop offset="1" stopColor="#cfdde6" /></radialGradient>
        <radialGradient id="kl_glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff3a5a" stopOpacity={0.5} /><stop offset="1" stopColor="#ff3a5a" stopOpacity={0} /></radialGradient>
        <radialGradient id="kl_kap" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stopColor="#ff7a84" /><stop offset="0.45" stopColor="#f0202e" /><stop offset="1" stopColor="#a80a16" /></radialGradient>
        <linearGradient id="kl_yazi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#ffe2ea" /></linearGradient>
        <pattern id="kl_hex" width="104" height="180" patternUnits="userSpaceOnUse">
          <path d="M 26 0 L 78 0 L 104 45 L 78 90 L 26 90 L 0 45 Z M 0 135 L 26 90 M 78 90 L 104 135 L 78 180 L 26 180 L 0 135" fill="none" stroke="#c4d2dc" strokeWidth={2} />
        </pattern>
      </defs>
      {arkaPlan ? (
        <g>
          <rect width={1080} height={1920} fill="url(#kl_bg)" />
          <rect width={1080} height={1920} fill="url(#kl_hex)" opacity={0.55} />
        </g>
      ) : null}
      <circle cx={540} cy={860} r={540} fill="url(#kl_glow)" opacity={0.5 + 0.5 * flas} />
      {/* büyük mantar düğme (3/4 bakış): beyaz altıgen taban, LED halka, sayaç */}
      <g transform={`translate(540 ${650 + (1 - dus) * -800}) scale(${1 + 0.08 * ezil} ${1 - 0.12 * ezil})`}>
        <path d="M -230 40 L -115 -60 L 115 -60 L 230 40 L 115 140 L -115 140 Z" fill="#f7fafb" stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
        <path d="M -230 40 L -230 76 L -115 176 L 115 176 L 230 76 L 230 40 L 115 140 L -115 140 Z" fill="#d6e0e6" stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
        <ellipse cx={0} cy={40} rx={168} ry={76} fill="none" stroke={flas > 0 ? "#ff2a3a" : "#ff8a9a"} strokeWidth={10 + 10 * flas} />
        <ellipse cx={0} cy={40} rx={132} ry={58} fill="#7a0a14" />
        <path d={`M -132 40 L -132 ${-30 + 24 * ezil} A 132 58 0 0 0 132 ${-30 + 24 * ezil} L 132 40 A 132 58 0 0 1 -132 40 Z`} fill="#b0101c" stroke={OUT} strokeWidth={8} />
        <ellipse cx={0} cy={-30 + 24 * ezil} rx={140} ry={64} fill="url(#kl_kap)" stroke={OUT} strokeWidth={8} />
        <ellipse cx={-48} cy={-54 + 24 * ezil} rx={50} ry={18} fill="#ffffff" opacity={0.75} transform={`rotate(-12 -48 ${-54 + 24 * ezil})`} />
        <rect x={-62} y={150} width={124} height={44} rx={10} fill="#16181c" stroke={OUT} strokeWidth={5} />
        <text x={0} y={184} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={36} fill="#ff3a3a">{t > 0.3 ? "001" : "000"}</text>
      </g>
      {/* KIRMIZI: harf genişlikleri Baloo 2 ExtraBold ölçülerinden (orantılı aralık) */}
      <g>
        {(() => {
          const fs = 132, ara = 16;
          const g = KIRMIZI.split("").map((c) => GEN[c] * fs);
          const top = g.reduce((a, b) => a + b, 0) + ara * (g.length - 1);
          let x = 540 - top / 2;
          return KIRMIZI.split("").map((c, i) => {
            const cx = x + g[i] / 2;
            x += g[i] + ara;
            const k = harf(i);
            return (
              <text key={i} x={cx} y={1010} textAnchor="middle" fontFamily={KD_BASLIK} fontWeight={800} fontSize={fs} fill="#e8202e" stroke={OUT} strokeWidth={7} paintOrder="stroke" strokeLinejoin="round" transform={`translate(${cx} 980) scale(${k}) translate(${-cx} -980)`}>{c}</text>
            );
          });
        })()}
      </g>
      {/* DÜĞME: kalın, beyaz-pembe dolgu, koyu kırmızı kontur + kabartma; Ü'nün noktaları iki mini kırmızı düğme */}
      {(() => {
        const fs = 268, ara = 4;
        const g = DUGME.map((c) => GEN[c] * fs);
        const top = g.reduce((a, b) => a + b, 0) + ara * (g.length - 1);
        let x0 = 540 - top / 2;
        return DUGME.map((c, i) => {
          const x = x0 + g[i] / 2;
          x0 += g[i] + ara;
          const k = harf(i + 7);
          const tr = `translate(${x} 1220) scale(${k}) translate(${-x} -1220)`;
          return (
            <g key={i} transform={tr}>
              {[14, 10, 6].map((o) => <text key={o} x={x + o * 0.4} y={1290 + o} textAnchor="middle" fontFamily={KD_BASLIK} fontWeight={800} fontSize={fs} fill="#9a0a16">{c}</text>)}
              <text x={x} y={1290} textAnchor="middle" fontFamily={KD_BASLIK} fontWeight={800} fontSize={fs} fill="url(#kl_yazi)" stroke="#9a0a16" strokeWidth={14} paintOrder="stroke" strokeLinejoin="round">{c}</text>
              {c === "U" ? (
                [-40, 40].map((dx) => (
                  <g key={dx} transform={`translate(${x + dx} 1086)`}>
                    <ellipse cx={0} cy={10} rx={32} ry={13} fill="#f7fafb" stroke="#9a0a16" strokeWidth={6} />
                    <path d="M -23 8 L -23 -6 A 23 10 0 0 1 23 -6 L 23 8 A 23 10 0 0 1 -23 8 Z" fill="#b0101c" stroke="#9a0a16" strokeWidth={5} />
                    <ellipse cx={0} cy={-6} rx={25} ry={11} fill="url(#kl_kap)" stroke="#9a0a16" strokeWidth={5} />
                    <ellipse cx={-8} cy={-10} rx={8} ry={3} fill="#fff" opacity={0.8} />
                  </g>
                ))
              ) : null}
            </g>
          );
        });
      })()}
      {/* ışıltılar */}
      {sim(170, 700, 34, "#ff9ac0", cl((t - 0.6) / 0.3))}
      {sim(900, 590, 26, "#ffffff", cl((t - 0.7) / 0.3))}
      {sim(905, 960, 18, "#ff9ac0", cl((t - 0.8) / 0.3))}
      {sim(170, 1400, 22, "#ffd2e0", cl((t - 0.85) / 0.3))}
      {sim(900, 1410, 30, "#ffffff", cl((t - 0.9) / 0.3))}
      <rect x={390} y={1372} width={300} height={12} rx={6} fill="#e8202e" opacity={cl((t - 0.9) / 0.3)} />
    </svg>
  );
};

/* ------------------------------------------------------------------ düğme finali prototipi */
const KARAKTER_TULUM = (): OdaKarakter[] => [
  { look: castById("kd_gobek_oda"), x: -1.3, z: 3.15, pose: { yaw: 0.45, lookX: 0.6 } },
  { look: castById("kd_influencer_oda"), x: 1.3, z: 3.25, pose: { yaw: -0.45, lookX: -0.6 } },
  { look: castById("kd_kurye_oda"), x: -1.05, z: 5.5, pose: { yaw: 0.35 } },
  { look: castById("kd_dorduncu_uykucu"), x: 1.05, z: 5.6, pose: { yaw: -0.3 } },
];

const titresim = (frame: number, g: number) => ({ sx: (random(`sx${frame}`) - 0.5) * 2 * g, sy: (random(`sy${frame}`) - 0.5) * 2 * g });

export const KdDugmeOrnek: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const kar = KARAKTER_TULUM();
  const P = {
    arka: petekBul("arka", 0, 2.2, 10), arka2: petekBul("arka", -2, 1.0, 10), sol: petekBul("sol", -4, 1.6, 5.5), sag: petekBul("sag", 4, 2.0, 4.4),
    tavan: petekBul("tavan", 0.6, 3.6, 4.8), sag2: petekBul("sag", 4, 0.8, 6.5), sol2: petekBul("sol", -4, 2.4, 3.4),
  };
  // 1) genel: dikişsiz oda, tek düğme (0 - 1,5 sn)
  if (frame < 45) {
    const k: Kam = { x: 0, y: 1.6, z: interpolate(frame, [0, 45], [0.2, 0.8]), yaw: 0, pitch: -5, f: 760, cy: 880 };
    const durum: OdaDurum = { derz: 0, dalga: -1, anaBas: 0, anaLed: 0, sayac: 0, kirmizi: 0, t };
    kar[0].pose = { ...kar[0].pose, emotion: "saskin" };
    kar[1].pose = { ...kar[1].pose, emotion: "korkmus" };
    kar[2].pose = { ...kar[2].pose, emotion: "supheli" };
    kar[3].pose = { ...kar[3].pose, emotion: "notr" };
    return <AbsoluteFill><svg viewBox="0 0 1080 1920" width={1080} height={1920}><BeyazOda k={k} durum={durum} karakterler={kar} frame={frame} /></svg></AbsoluteFill>;
  }
  // 2) yakın: el düğmeye basar (1,5 - 2,2 sn)
  if (frame < 66) {
    const f = frame - 45;
    const k: Kam = { x: 0.05, y: 1.72, z: 3.05, yaw: -2, pitch: -40, f: 1050, cy: 860, ...titresim(frame, f > 10 && f < 16 ? 6 : 0) };
    const bas = cl((f - 10) / 3);
    const led = f >= 11 ? (Math.floor((f - 11) / 2) % 2 ? 0.3 : 1) : 0;
    const durum: OdaDurum = { derz: 0, dalga: -1, anaBas: bas, anaLed: led, sayac: f >= 12 ? 1 : 0, kirmizi: f >= 11 ? 0.35 * (1 - (f - 11) / 10) : 0, t };
    const hedef = proj(k, [0, 1.0 + 0.11 * (1 - 0.75 * bas), 4.2]);
    const yaklas = ease(f / 10);
    return (
      <AbsoluteFill>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
          <BeyazOda k={k} durum={durum} frame={frame} ekstra={<FpsEl x={hedef.x + (1 - yaklas) * 160} y={hedef.y + (1 - yaklas) * 520} s={1.15} aci={-22} kol="atlet" bas={bas} />} />
        </svg>
      </AbsoluteFill>
    );
  }
  // 3-4) genel (alçak açı): derzler belirir, yüzlerce düğme dalga hâlinde çıkar; bölmeler açılır, nesneler fırlar
  const f = frame - 66;
  const g = f > 54 ? 4 + 6 * Math.abs(Math.sin(f / 3)) : 0;
  const k: Kam = { x: 0, y: 1.25, z: interpolate(f, [0, 114], [0.9, 0.5]), yaw: interpolate(f, [0, 114], [-3, 3]), pitch: 2, f: 760, cy: 900, ...titresim(frame, g) };
  const dalga = f >= 6 ? (f - 6) / 30 : -1;
  const ac = (t0: number) => ease((t - t0) / 0.3) * (t > t0 ? 1 : 0);
  const bolmeler = [
    { petek: P.arka, acik: ac(4.0) }, { petek: P.sol, acik: ac(4.25) }, { petek: P.sag, acik: ac(4.45) },
    { petek: P.tavan, acik: ac(4.7) }, { petek: P.arka2, acik: ac(4.9) }, { petek: P.sag2, acik: ac(5.1) }, { petek: P.sol2, acik: ac(5.3) },
  ];
  const nesneler: OdaNesne[] = [
    { petek: P.arka, t0: 4.2, tur: "terlik", hiz: 6, yan: [0, 2, 0], boy: 0.4 },
    { petek: P.sol, t0: 4.45, tur: "simit", hiz: 5, yan: [0, 2.5, -2], boy: 0.42 },
    { petek: P.sag, t0: 4.65, tur: "ordek", hiz: 4.5, yan: [0, 2, -1.5], boy: 0.4 },
    { petek: P.tavan, t0: 4.9, tur: "caydanlik", hiz: 2, yan: [0, 0, -1], boy: 0.42 },
    { petek: P.arka2, t0: 5.1, tur: "top", hiz: 7, yan: [1, 3, 0], boy: 0.34 },
    { petek: P.sag2, t0: 5.3, tur: "kaktus", hiz: 4, yan: [0, 3, -2], boy: 0.4 },
    { petek: P.sol2, t0: 5.5, tur: "balik", hiz: 5, yan: [0, 1, -3], boy: 0.42 },
    { petek: P.arka, t0: 5.55, tur: "nazar", hiz: 7, yan: [0.6, 1.5, 0], boy: 0.3 },
  ];
  const kirmizi = dalga >= 0 ? 0.25 + 0.25 * Math.max(0, Math.sin(t * 9)) : 0;
  const tepki = f > 8;
  kar[0].pose = { ...kar[0].pose, emotion: tepki ? "sok" : "saskin", yaw: tepki ? -0.2 : 0.45, lookY: tepki ? -0.6 : 0, gesture: f > 60 ? "basTut" : "rest" };
  kar[1].pose = { ...kar[1].pose, emotion: tepki ? "dehset" : "korkmus", yaw: tepki ? 0.3 : -0.45, gesture: f > 40 ? "ellerYuzde" : "rest", lookY: -0.4, speech: f > 20 && f < 60 ? { cues: [{ t: 0, v: "A" }, { t: 9, v: "A" }], from: 0 } : undefined };
  kar[2].pose = { ...kar[2].pose, emotion: tepki ? "korkmus" : "supheli", lookY: -0.5, lookX: (Math.floor(f / 12) % 2) * 1.2 - 0.6 };
  // 4. kişi: herkes panikken o sakin (ipucu)
  kar[3].pose = { ...kar[3].pose, emotion: "soguk", yaw: -0.1 };
  const durum: OdaDurum = { derz: cl(f / 8), dalga, anaBas: 1, anaLed: 1, sayac: 1, kirmizi, bolmeler, nesneler, t };
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}><BeyazOda k={k} durum={durum} karakterler={kar} frame={frame} /></svg>
      {f < 4 ? <AbsoluteFill style={{ backgroundColor: "#ff1a2a", opacity: 0.35 * (1 - f / 4) }} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ kanca (B1 ilk ~2 sn + logo)
 * Kullanıcının metni: göz kamerası; önümüzde kırmızı düğmelerden biri; basarken yandan biri "duuuur!" diye bağırır;
 * basılmış olur, KARŞISINDAKİ bölme açılır ve göğse doğru bir mızrak fırlar; sonra dizi başlar.
 * Kurgu (30 fps): 0 el zaten uzanıyor · 13 "DUUUR!" (soldan) · 22-25 basış (klik A @23) · 30 bölme kilidi · 31-40 kanatlar
 * · 39-62 mızrak göğse (kamera ucu izler) · 62 sert kesme (siyah, sessiz) · 65 logo (düğme düşer, @74 aynı klik) · 128 son.
 * Bölme, düğmenin hemen üstündeki petek: mızrak 1,4 m'den doğrudan göğse gelir, ekranı doldurur (çarpmadan kesilir). */
export const KANCA = { dur: 13, bas: 22, klik: 23, kilit: 30, kanat: 31, mizrak: 39, kes: 62, logo: 65, son: 128 };
export const KdKanca: React.FC<{ kol?: KolTuru }> = ({ kol = "kurye" }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const Z = KANCA;
  if (frame >= Z.logo) {
    return <AbsoluteFill style={{ backgroundColor: "#eef4f7" }}><KdLogo t={(frame - Z.logo) / 30} /></AbsoluteFill>;
  }
  if (frame >= Z.kes) return <AbsoluteFill style={{ backgroundColor: "#000" }} />;
  const KX = 2.6, KY = 1.62, KZ = 3.2;
  const hedefP = petekBul("sag", 4, 1.3, 3.2);
  const bolmeP = petekBul("sag", 4, hedefP.c[1] + 0.73, hedefP.c[2]);
  const bak = (c: number[]) => ({
    yaw: (Math.atan2(c[0] - KX, c[2] - KZ) * 180) / Math.PI,
    pitch: (Math.atan2(c[1] - KY, Math.hypot(c[0] - KX, c[2] - KZ)) * 180) / Math.PI,
  });
  // kamera: önce düğmeyle bölme arasına (düğme alt üçte birde), kilit sesiyle bölmeye doğru hafif kalkar
  const orta = [4, hedefP.c[1] * 0.62 + bolmeP.c[1] * 0.38, hedefP.c[2]];
  const b0 = bak(orta), b1 = bak([4, bolmeP.c[1] - 0.12, bolmeP.c[2]]);
  const kalk = ease((frame - Z.kilit) / 10);
  const mizrakK = cl((frame - Z.mizrak) / (Z.kes - Z.mizrak));
  const itme = ease(frame / Z.bas) * 0.12; // basışa doğru hafif öne eğilme
  const darbe = frame >= Z.mizrak ? 3 + 9 * mizrakK : 0;
  const basSarsinti = frame >= Z.bas && frame < Z.bas + 4 ? 4 : 0;
  const elTit = frame < Z.bas ? 1.6 : 0;
  const KXi = KX + itme, KYi = KY - itme * 0.3;
  // mızrağın ucu (kamera onu izler: izleyici mızrağın üstüne geldiğini görür)
  const gogus: [number, number, number] = [KX + 0.12, KY - 0.27, KZ];
  const bas0: [number, number, number] = [bolmeP.c[0] + 0.35, bolmeP.c[1], bolmeP.c[2]];
  const e = 0.9 * mizrakK ** 1.15;
  const uc: [number, number, number] = [bas0[0] + (gogus[0] - bas0[0]) * e, bas0[1] + (gogus[1] - bas0[1]) * e, bas0[2] + (gogus[2] - bas0[2]) * e];
  const izle = ease((frame - Z.mizrak) / 10) * 0.75;
  const ucY = (Math.atan2(uc[1] - KYi, Math.max(0.05, Math.hypot(uc[0] - KXi, uc[2] - KZ))) * 180) / Math.PI;
  const yaw1 = b0.yaw + (b1.yaw - b0.yaw) * kalk;
  const pitch1 = b0.pitch + (b1.pitch - b0.pitch) * kalk;
  const k: Kam = {
    x: KXi, y: KYi, z: KZ,
    yaw: yaw1, pitch: pitch1 + (ucY - pitch1) * izle,
    f: 900, cy: 960, ...titresim(frame, elTit + darbe + basSarsinti),
  };
  const bas = cl((frame - Z.bas) / 3);
  const led = frame >= Z.klik ? (Math.floor((frame - Z.klik) / 2) % 2 ? 0.45 : 1) : 0;
  const acik = frame >= Z.kanat ? ease((frame - Z.kanat) / 9) : 0;
  const durum: OdaDurum = {
    derz: 1, dalga: 30, anaBas: 1, anaLed: 1, sayac: 417,
    kirmizi: frame >= Z.kanat ? 0.16 + 0.2 * Math.max(0, Math.sin((frame - Z.kanat) / 3)) : 0.08, t,
    ozelBas: { petek: hedefP, bas, led, sayac: hedefP.no + (frame >= Z.klik ? 1 : 0) },
    // kilit açılana kadar bölme görünmez (düz petek): sürpriz ele verilmez
    bolmeler: frame >= Z.kilit ? [{ petek: bolmeP, acik }] : [],
  };
  const yon: [number, number, number] = [gogus[0] - bas0[0], gogus[1] - bas0[1], gogus[2] - bas0[2]];
  const hp = proj(k, hedefP.c);
  const yaklas = ease(frame / Z.bas);
  const elCekil = ease((frame - (Z.mizrak + 1)) / 9);
  const elGorunur = frame < Z.mizrak + 10;
  const blur = frame > Z.kes - 6 ? (frame - (Z.kes - 6)) * 2.2 : 0;
  const duurK = frame >= Z.dur ? ease((frame - Z.dur) / 3) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <defs>
          <filter id="kk_blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={`${blur * 0.4} ${blur}`} /></filter>
          <radialGradient id="kk_vin" cx="0.5" cy="0.5" r="0.72"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#1a0006" stopOpacity={0.55} /></radialGradient>
        </defs>
        <g filter={blur > 0.5 ? "url(#kk_blur)" : undefined}>
          <BeyazOda k={k} durum={durum} frame={frame} ekstra={frame >= Z.mizrak - 2 ? <Mizrak k={k} uc={uc} yon={yon} /> : null} />
        </g>
        {/* hız çizgileri: mızrak yaklaşırken kenarlardan merkeze */}
        {frame >= Z.mizrak + 6 ? new Array(30).fill(0).map((_, i) => {
          const a = random(`kz${i}`) * Math.PI * 2;
          const pu = proj(k, uc);
          const r0 = 420 + random(`kr${i}${Math.floor(frame / 2)}`) * 260;
          return <path key={i} d={`M ${pu.x + Math.cos(a) * r0} ${pu.y + Math.sin(a) * r0} L ${pu.x + Math.cos(a) * (r0 + 600)} ${pu.y + Math.sin(a) * (r0 + 600)}`} stroke="#ffffff" strokeWidth={7} opacity={0.4 * mizrakK} />;
        }) : null}
        {elGorunur ? <FpsEl x={hp.x + (1 - yaklas) * 160 + elCekil * 380} y={hp.y + 14 + (1 - yaklas) * 520 + elCekil * 1000} s={1.3} aci={-28} kol={kol} bas={bas} /> : null}
        {/* "DUUUR!": sesin geldiği soldan girer (sessiz izleyen için de okunur) */}
        {frame >= Z.dur && frame < Z.mizrak ? (
          <g transform={`translate(${60 - (1 - duurK) * 300 + (random(`du${frame}`) - 0.5) * 12} 560) rotate(-9) scale(${0.6 + 0.4 * duurK})`} opacity={frame > Z.mizrak - 5 ? (Z.mizrak - frame) / 5 : 1}>
            <text x={0} y={0} fontFamily={KD_BASLIK} fontWeight={800} fontSize={160} fill="#ffffff" stroke="#c8101e" strokeWidth={18} paintOrder="stroke" strokeLinejoin="round">DUUUR!</text>
          </g>
        ) : null}
        <rect width={1080} height={1920} fill="url(#kk_vin)" opacity={frame >= Z.kanat ? 1 : 0.5} />
      </svg>
      {frame >= Z.klik && frame < Z.klik + 4 ? <AbsoluteFill style={{ backgroundColor: "#ff1a2a", opacity: 0.3 * (1 - (frame - Z.klik) / 4) }} /> : null}
    </AbsoluteFill>
  );
};

export const KdLogoKare: React.FC = () => <AbsoluteFill style={{ backgroundColor: "#eef4f7" }}><KdLogo t={10} /></AbsoluteFill>;
