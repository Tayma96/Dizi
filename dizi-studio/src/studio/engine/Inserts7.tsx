/* Kayıp CEO · Bölüm 2 ekleme çekimleri (tam ekran 1080x1920, kendi çizimimiz):
 * pov_yaprak, kol_saati, tv_son_dakika (faz 1/2), yemek_ust, sozlesme (faz tut/burus/ates). */
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SANS = "Inter, Arial, sans-serif";
const O = "#1a1412";

export type Insert7Kind = "pov_yaprak" | "kol_saati" | "tv_son_dakika" | "yemek_ust" | "sozlesme" | "omuz_bastir";
export const INSERT7_KINDS: Insert7Kind[] = ["pov_yaprak", "kol_saati", "tv_son_dakika", "yemek_ust", "sozlesme", "omuz_bastir"];

/* ------------------------------------------------------------------------------------------
 * POV (Emir'in gözü): saz tavan, üstüne eğilmiş kadın (B1 son karesindeki gibi kadrajda), sağ eli kalp biçimli
 * gölevez yaprağıyla alına uzanır. Yaprak kameraya değince göz kırpılır; damlalar parlar, odak kadına kayar.
 * ---------------------------------------------------------------------------------------- */
const PovYaprak: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const touch = 1.5;
  const p = interpolate(t, [0.2, touch], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 });
  const blink = interpolate(t, [touch, touch + 0.12, touch + 0.3], [0, 1, 0], clamp);
  const blurFace = interpolate(t, [0, touch, touch + 0.6], [4, 3, 0], clamp);
  const breathe = Math.sin(f / 22) * 6;
  const size = 2900;
  const leafX = interpolate(p, [0, 1], [930, 560]);
  const leafY = interpolate(p, [0, 1], [1260, 1760]);
  const leafS = interpolate(p, [0, 1], [0.8, 2.3]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#5a3e24", overflow: "hidden" }}>
      {/* saz tavan (bulanık) ve çatı aralığından ışık */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(9px)" }}>
        <rect width={1080} height={1920} fill="#9a7838" />
        {new Array(16).fill(0).map((_, r) => <path key={r} d={`M 0 ${r * 130} ${new Array(14).fill(0).map((_, i) => `L ${i * 80 + 40} ${r * 130 + 50} L ${i * 80 + 80} ${r * 130}`).join(" ")}`} stroke={r % 2 ? "#c9a45c" : "#7a5a28"} strokeWidth={14} fill="none" />)}
        <path d="M 760 0 L 860 0 L 640 1920 L 520 1920 Z" fill="#fff0c0" opacity={0.25} />
      </svg>
      {/* kadın: Emir'e eğilmiş, ona bakıyor (POV'da kameraya bakış doğal) */}
      <div style={{ position: "absolute", left: 540 - 0.2 * size, top: 520 - 0.2 * size + breathe, filter: `blur(${blurFace}px)` }}>
        <Character look={castById("yerli_kadin")} size={size} pose={{ emotion: "dusunceli", lookX: 0, lookY: 0.25, yaw: 0, tilt: -7, seed: 7 }} />
      </div>
      {/* kapıdan gelen sıcak anahtar ışık (yüzün sağ yanı) */}
      <AbsoluteFill style={{ background: "linear-gradient(240deg, rgba(255,236,190,0.30) 0%, rgba(255,236,190,0) 45%)" }} />
      {/* kol + el + yaprak (sağ alttan uzanır) */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="py_yap" cx="0.4" cy="0.4" r="0.7"><stop offset="0" stopColor="#8ab85a" /><stop offset="1" stopColor="#4f7a2e" /></radialGradient>
          <filter id="py_bl"><feGaussianBlur stdDeviation={6 * p} /></filter>
        </defs>
        <path d={`M 1180 ${1500 - 60 * p} Q ${1000 - 120 * p} ${1460 + 40 * p} ${leafX + 140} ${leafY - 40}`} stroke="#8a5a34" strokeWidth={120 + 60 * p} fill="none" strokeLinecap="round" />
        <path d={`M 1180 ${1500 - 60 * p} Q ${1000 - 120 * p} ${1460 + 40 * p} ${leafX + 140} ${leafY - 40}`} stroke="#a06a40" strokeWidth={96 + 50 * p} fill="none" strokeLinecap="round" />
        <circle cx={1030 - 200 * p} cy={1440 + 30 * p} r={22 + 10 * p} fill="#c9a24a" stroke={O} strokeWidth={3} />
        <g transform={`translate(${leafX} ${leafY}) scale(${leafS}) rotate(${-20 + 30 * p})`} filter="url(#py_bl)">
          <path d="M 0 -150 C 120 -170 200 -40 120 60 C 70 130 10 150 0 170 C -10 150 -70 130 -120 60 C -200 -40 -120 -170 0 -150 Z" fill="url(#py_yap)" stroke="#2e4a1e" strokeWidth={4} />
          <path d="M 0 -150 V 170" stroke="#c8e09a" strokeWidth={5} />
          {[-110, -60, -10, 40, 90].map((y) => <path key={y} d={`M 0 ${y} q 70 -10 110 ${30 + y * 0.1} M 0 ${y} q -70 -10 -110 ${30 + y * 0.1}`} stroke="#9cc46a" strokeWidth={3} fill="none" />)}
          {[[40, -60], [-50, 0], [70, 40], [-20, 90]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={9} fill="#e8f6ff" opacity={0.85} /><circle cx={x - 3} cy={y - 3} r={3} fill="#ffffff" /></g>)}
          {/* yaprağı tutan parmaklar */}
          <ellipse cx={90} cy={110} rx={34} ry={20} fill="#a06a40" stroke={O} strokeWidth={3} transform="rotate(30 90 110)" />
          <ellipse cx={60} cy={140} rx={30} ry={18} fill="#a06a40" stroke={O} strokeWidth={3} transform="rotate(40 60 140)" />
        </g>
      </svg>
      {/* göz kapağı: dokunuşta kırpma + kenar kararması */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
      <div style={{ position: "absolute", left: -100, right: -100, top: 0, height: 960 * blink, background: "#000", borderBottomLeftRadius: "50%", borderBottomRightRadius: "50%" }} />
      <div style={{ position: "absolute", left: -100, right: -100, bottom: 0, height: 960 * blink, background: "#000", borderTopLeftRadius: "50%", borderTopRightRadius: "50%" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------------------------
 * Kol saati yakın planı: 14:07'de durmuş. Çelik kasa, lacivert güneş ışınlı kadran, yıldız çatlaklı cam,
 * çatlakta kum ve kurumuş kan. Saniye ibresi kıpırdamaz; hareketi camda kayan parlama ve (D2) camı silen başparmak verir.
 * Marka/yazı/yıldız yok. Bilekte yırtık gömlek manşeti ve yaprak sargının ucu.
 * ---------------------------------------------------------------------------------------- */
const KolSaati: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const z = interpolate(f, [0, dur], [1, 1.08], clamp);
  const sw = interpolate(t, [1.0, 2.0], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) }); // başparmak silme ilerlemesi
  // başparmak sağdan girer, camı sağdan sola siler, sonra geri çekilir (el gövdesi kadraj dışına uzanır)
  const thumbX = interpolate(t, [0.7, 1.0, 2.0, 2.6], [1300, 760, 300, 1400], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const glint = (t * 0.5) % 1;
  const cx = 540, cy = 900, R = 300;
  const ang = (deg: number, len: number) => `M ${cx} ${cy} L ${cx + Math.sin((deg * Math.PI) / 180) * len} ${cy - Math.cos((deg * Math.PI) / 180) * len}`;
  return (
    <AbsoluteFill style={{ backgroundColor: "#6a4a2c", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "50% 47%" }}>
        <defs>
          <radialGradient id="ks_kadran" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#2c3a5e" /><stop offset="1" stopColor="#141c32" /></radialGradient>
          <linearGradient id="ks_kasa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e8ecf0" /><stop offset="0.5" stopColor="#9aa0a6" /><stop offset="1" stopColor="#d8dce0" /></linearGradient>
          <clipPath id="ks_cam"><circle cx={cx} cy={cy} r={R - 34} /></clipPath>
          <filter id="ks_kum"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" /><feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.81  0 0 0 0 0.61  0 0 0 0.9 0" /></filter>
          <linearGradient id="ks_silme" x1="1" y1="0" x2="0" y2="0"><stop offset={Math.max(0, sw - 0.15)} stopColor="#000" /><stop offset={sw} stopColor="#fff" /></linearGradient>
          <mask id="ks_kummask"><rect x={0} y={0} width={1080} height={1920} fill="url(#ks_silme)" /></mask>
        </defs>
        {/* bilek: ten, yırtık gömlek manşeti, sargı ucu */}
        <rect x={-100} y={540} width={1300} height={720} fill="#e0b088" />
        <path d="M -100 540 Q 540 470 1180 540" stroke="#c89068" strokeWidth={10} fill="none" />
        <path d="M -100 1260 Q 540 1330 1180 1260 L 1180 1920 L -100 1920 Z" fill="#e8e2d2" />
        <path d="M 120 1290 l 40 70 l 30 -50 l 40 80 M 820 1280 l 30 60 l 40 -40" stroke="#b8b0a0" strokeWidth={6} fill="none" />
        <path d="M 60 1300 Q 300 1340 520 1310" stroke="#7a1a14" strokeWidth={10} opacity={0.4} fill="none" />
        <path d="M 900 560 Q 1000 700 960 860 Q 1060 760 1100 620 Z" fill="#5f8a3a" stroke="#2e4a1e" strokeWidth={4} />
        {/* kayış (deri) */}
        <rect x={360} y={300} width={360} height={1300} rx={30} fill="#3a2418" stroke={O} strokeWidth={6} />
        {new Array(10).fill(0).map((_, i) => <path key={i} d={`M 380 ${330 + i * 30} H 700`} stroke="#4a3020" strokeWidth={2} />)}
        {new Array(10).fill(0).map((_, i) => <path key={`b${i}`} d={`M 380 ${1220 + i * 30} H 700`} stroke="#4a3020" strokeWidth={2} />)}
        {/* kasa + taç */}
        <circle cx={cx} cy={cy} r={R} fill="url(#ks_kasa)" stroke={O} strokeWidth={6} />
        <rect x={cx + R - 4} y={cy - 26} width={44} height={52} rx={8} fill="#b8bcc0" stroke={O} strokeWidth={4} />
        {new Array(6).fill(0).map((_, i) => <path key={i} d={`M ${cx + R + 2 + i * 7} ${cy - 22} V ${cy + 22}`} stroke="#8a8e92" strokeWidth={2} />)}
        {/* kadran: güneş ışınları, indeksler */}
        <circle cx={cx} cy={cy} r={R - 34} fill="url(#ks_kadran)" />
        {new Array(60).fill(0).map((_, i) => <path key={i} d={ang(i * 6, R - 40)} stroke="#3a4a70" strokeWidth={1.5} opacity={0.5} />)}
        <circle cx={cx} cy={cy} r={R - 120} fill="url(#ks_kadran)" opacity={0.6} />
        {new Array(12).fill(0).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const r1 = R - 60, r2 = R - (i % 3 === 0 ? 110 : 90);
          return <path key={i} d={`M ${cx + Math.sin(a) * r1} ${cy - Math.cos(a) * r1} L ${cx + Math.sin(a) * r2} ${cy - Math.cos(a) * r2}`} stroke="#e8ecf0" strokeWidth={i % 3 === 0 ? 14 : 8} strokeLinecap="round" />;
        })}
        {/* ibreler: 14:07, saniye 228° (donuk) */}
        <path d={ang(63.5, 150)} stroke="#e8ecf0" strokeWidth={18} strokeLinecap="round" />
        <path d={ang(42, 220)} stroke="#e8ecf0" strokeWidth={12} strokeLinecap="round" />
        <path d={ang(228, 230)} stroke="#c8102e" strokeWidth={4} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={16} fill="#c8102e" stroke="#e8ecf0" strokeWidth={4} />
        {/* cam: yıldız çatlak, çatlakta kum, kurumuş kan, kayan parlama */}
        <g clipPath="url(#ks_cam)">
          <path d={`M ${cx + 90} ${cy - 120} L ${cx + 10} ${cy - 10} L ${cx - 160} ${cy + 40} M ${cx + 10} ${cy - 10} L ${cx + 60} ${cy + 200} M ${cx + 10} ${cy - 10} L ${cx - 60} ${cy - 220} M ${cx + 10} ${cy - 10} L ${cx + 220} ${cy + 40} M ${cx + 90} ${cy - 120} L ${cx + 200} ${cy - 170}`} stroke="#ffffff" strokeWidth={3.5} opacity={0.75} fill="none" />
          <g mask="url(#ks_kummask)">
            <rect x={cx - R} y={cy - R} width={2 * R} height={2 * R} filter="url(#ks_kum)" opacity={0.55} />
          </g>
          <path d={`M ${cx - 180} ${cy + 120} q 40 -20 70 10 q 20 40 -30 60 q -50 10 -40 -70 z`} fill="#5a1414" opacity={0.75} />
          <rect x={cx - R + glint * 2 * R - 60} y={cy - R} width={60} height={2 * R} fill="#ffffff" opacity={0.12} transform={`rotate(25 ${cx} ${cy})`} />
        </g>
        <circle cx={cx} cy={cy} r={R - 34} fill="none" stroke="#8a8e92" strokeWidth={6} />
        {/* (D2) camı silen başparmak */}
        <g transform={`translate(${thumbX} ${cy - 30}) rotate(-10)`}>
          {/* el gövdesi: kıvrık işaret parmağı + avuç sırtı, sağ kenardan dışarı uzanır */}
          <path d="M 230 40 Q 330 260 620 300 L 1500 330 L 1500 -10 Q 900 -40 520 10 Z" fill="#c8946e" stroke={O} strokeWidth={5} />
          <path d="M 300 120 Q 380 250 560 270" stroke="#a87858" strokeWidth={4} fill="none" />
          <path d="M 700 290 Q 720 250 700 210 M 900 300 Q 920 260 900 220" stroke="#a87858" strokeWidth={3} fill="none" />
          <path d="M 200 -78 Q 600 -150 1500 -120 L 1500 60 Q 800 40 300 70 Z" fill="#d09c74" stroke={O} strokeWidth={5} />
          <rect x={-90} y={-70} width={420} height={150} rx={75} fill="#d8a47c" stroke={O} strokeWidth={5} />
          <path d="M -70 -50 Q -96 0 -70 50 L -20 54 Q -6 0 -20 -54 Z" fill="#ecc8a8" stroke="#a87858" strokeWidth={3} />
          <path d="M -60 -30 Q -40 0 -60 30" stroke="#c8946e" strokeWidth={3} fill="none" />
        </g>
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------------------------
 * TV son dakika (resepsiyondaki TV'nin ekranı, çerçeveyle): uydurma kanal "MERİDYEN HABER", spiker, kırmızı
 * SON DAKİKA bandı + beyaz bant. faz "2": sağda Emir'in portresi (takım elbise) ve Hint Okyanusu haritası (son sinyal).
 * Bantlar altyazı bölgesinin üstünde (y < 1150). Ekranda saat yok.
 * ---------------------------------------------------------------------------------------- */
const TvSonDakika: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const faz = text?.[0] ?? "1";
  const z = interpolate(f, [0, dur], [1, faz === "3" ? 1.12 : 1.05], clamp);
  const pip = faz === "2" || faz === "3" ? interpolate(f, [0, 10], [0, 1], clamp) : 0;
  const ticker = (f * 6) % 2400;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0d10", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "40% 30%" }}>
        {/* TV çerçevesi */}
        <div style={{ position: "absolute", left: 30, top: 90, width: 1020, height: 1060, background: "#111214", borderRadius: 16, boxShadow: "0 0 0 6px #2a2e34" }} />
        <div style={{ position: "absolute", left: 50, top: 110, width: 980, height: 1020, overflow: "hidden", background: "linear-gradient(160deg, #0e2a5a 0%, #12386e 50%, #0a1e40 100%)" }}>
          {/* stüdyo arka planı: dünya çizgileri */}
          <svg viewBox="0 0 980 1020" width={980} height={1020} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
            {new Array(9).fill(0).map((_, i) => <ellipse key={i} cx={700} cy={400} rx={60 + i * 40} ry={300} fill="none" stroke="#5a8ad8" strokeWidth={1.5} />)}
            {new Array(7).fill(0).map((_, i) => <path key={`h${i}`} d={`M 380 ${130 + i * 90} H 1020`} stroke="#5a8ad8" strokeWidth={1.5} />)}
          </svg>
          {/* spiker */}
          <div style={{ position: "absolute", left: 300 - 0.2 * 1300 - (pip ? 120 * pip : 0), top: 140 }}>
            <Character look={castById("spiker")} size={1300} pose={{ emotion: "soguk", lookX: 0, lookY: 0, yaw: 0, seed: 5 }} />
          </div>
          {/* masa */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 780, height: 260, background: "linear-gradient(180deg, #1a2a48, #0e1a30)", borderTop: "4px solid #4a7ac8" }} />
          {/* kanal logosu */}
          <div style={{ position: "absolute", left: 28, top: 26, padding: "8px 16px", background: "rgba(255,255,255,0.92)", borderRadius: 6, fontFamily: SANS, fontWeight: 900, fontSize: 34, color: "#0e2a5a", letterSpacing: 1 }}>MERİDYEN <span style={{ color: "#c8102e" }}>HABER</span></div>
          <div style={{ position: "absolute", right: 28, top: 30, display: "flex", alignItems: "center", gap: 8, fontFamily: SANS, fontWeight: 900, fontSize: 28, color: "#fff" }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: "#ff2a2a", opacity: f % 30 < 18 ? 1 : 0.3 }} /> CANLI
          </div>
          {/* faz 2: portre + harita */}
          {pip > 0 ? (
            <div style={{ position: "absolute", right: 30, top: 160, width: 420, opacity: pip, transform: `translateX(${(1 - pip) * 60}px)` }}>
              <div style={{ width: 420, height: 300, background: "#e8e2d8", border: "6px solid #fff", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", left: 210 - 0.2 * 620, top: 20 }}>
                  <Character look={castById("emir")} size={620} pose={{ emotion: "kararli", lookX: 0, lookY: 0, yaw: 0.15, seed: 9 }} />
                </div>
              </div>
              <div style={{ background: "#c8102e", color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: 26, padding: "6px 12px" }}>EMİR ÖZDEMİR · CEO</div>
              <svg viewBox="0 0 420 260" width={420} height={260} style={{ display: "block", marginTop: 14, background: "#0c2448", border: "4px solid #4a7ac8" }}>
                <path d="M 0 30 Q 60 20 110 50 L 130 110 Q 90 140 40 120 L 0 130 Z" fill="#2a5a3a" />
                <path d="M 300 0 L 420 0 L 420 90 Q 360 110 330 60 Z" fill="#2a5a3a" />
                <path d="M 230 200 Q 280 180 320 210 L 300 250 Q 250 260 220 240 Z" fill="#2a5a3a" />
                <path d="M 70 70 Q 170 120 250 150" stroke="#e8e8e8" strokeWidth={3} strokeDasharray="8 7" fill="none" />
                <circle cx={250} cy={150} r={9 + (f % 30) / 4} fill="none" stroke="#ff2a2a" strokeWidth={3} opacity={1 - (f % 30) / 30} />
                <circle cx={250} cy={150} r={7} fill="#ff2a2a" />
                <text x={140} y={236} fontFamily="Arial, sans-serif" fontWeight={900} fontSize={20} fill="#cfe0ff">HİNT OKYANUSU</text>
                <text x={262} y={140} fontFamily="Arial, sans-serif" fontWeight={800} fontSize={16} fill="#ffd0d0">SON SİNYAL</text>
              </svg>
            </div>
          ) : null}
          {/* bantlar */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, height: 76, background: "#c8102e", display: "flex", alignItems: "center", padding: "0 24px", fontFamily: SANS, fontWeight: 900, fontSize: 44, color: "#fff", letterSpacing: 2 }}>SON DAKİKA</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 896, height: 104, background: "#f4f4f2", display: "flex", alignItems: "center", padding: "0 24px", fontFamily: SANS, fontWeight: 900, fontSize: 36, lineHeight: 1.1, color: "#111" }}>ZENITH GRUP HOLDİNG CEO'SU EMİR ÖZDEMİR'İ TAŞIYAN UÇAKTAN HABER YOK</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1000, height: 20, background: "#0e2a5a", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 980 - ticker, top: -2, whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 700, fontSize: 18, color: "#cfe0ff" }}>ARAMA KURTARMA ÇALIŞMALARI SÜRÜYOR · ZENITH GRUP HİSSELERİ İŞLEME KAPATILDI · ŞİRKETTEN HENÜZ AÇIKLAMA YAPILMADI ·</div>
          </div>
          {/* tarama çizgileri + ekran yansıması */}
          <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, rgba(0,0,0,0) 3px)" }} />
          <AbsoluteFill style={{ background: "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.07) 40%, rgba(255,255,255,0) 50%)" }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------------------------
 * Yemek (üstten): hasır üstünde muz yaprağı; ızgara izli balık (buharı tüter), papaya dilimleri, küçük muzlar,
 * yarım hindistan cevizinde su (yansıma dalgalanır). (D4) kadının eli girer, balıktan bir parça koparıp kendi ağzına götürür.
 * ---------------------------------------------------------------------------------------- */
const YemekUst: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const z = interpolate(f, [0, dur], [1, 1.07], clamp);
  const el = interpolate(t, [0.5, 1.3, 1.7, 2.6], [0, 1, 1, 0], clamp);
  const parcaGitti = t > 1.5;
  return (
    <AbsoluteFill style={{ backgroundColor: "#b8955a", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "50% 50%" }}>
        <defs>
          <linearGradient id="yu_yaprak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3f6e2a" /><stop offset="0.5" stopColor="#5f8a3a" /><stop offset="1" stopColor="#3f6e2a" /></linearGradient>
          <radialGradient id="yu_su" cx="0.45" cy="0.4" r="0.6"><stop offset="0" stopColor="#e8f6f6" /><stop offset="1" stopColor="#9ac8cc" /></radialGradient>
        </defs>
        {/* hasır */}
        <rect width={1080} height={1920} fill="#b8955a" />
        {new Array(40).fill(0).map((_, i) => <path key={i} d={`M ${i * 30} 0 V 1920`} stroke={i % 2 ? "#a8854a" : "#c8a56a"} strokeWidth={14} />)}
        {new Array(64).fill(0).map((_, i) => <path key={`h${i}`} d={`M 0 ${i * 30} H 1080`} stroke="#9a7a44" strokeWidth={3} opacity={0.5} />)}
        {/* muz yaprağı */}
        <path d="M 140 520 Q 540 380 960 560 Q 1000 1000 940 1440 Q 540 1560 120 1420 Q 60 980 140 520 Z" fill="url(#yu_yaprak)" stroke="#2e4a1e" strokeWidth={6} />
        <path d="M 150 980 Q 540 940 960 990" stroke="#a8c87a" strokeWidth={10} fill="none" />
        {new Array(14).fill(0).map((_, i) => <path key={i} d={`M ${200 + i * 52} ${960 - Math.sin(i / 2) * 6} q 10 -200 30 -400 M ${200 + i * 52} ${990} q 10 200 30 400`} stroke="#4f7a2e" strokeWidth={3} fill="none" opacity={0.7} />)}
        {/* ızgara balık */}
        <g transform="rotate(-12 520 900)">
          <path d="M 260 900 Q 420 760 640 820 Q 720 850 760 900 Q 720 950 640 980 Q 420 1040 260 900 Z" fill="#c8945a" stroke="#5a3418" strokeWidth={6} />
          <path d="M 760 900 L 860 830 L 850 970 Z" fill="#b8844a" stroke="#5a3418" strokeWidth={5} />
          {new Array(6).fill(0).map((_, i) => <path key={i} d={`M ${340 + i * 60} 830 l -40 140`} stroke="#3a2010" strokeWidth={9} opacity={0.75} />)}
          <circle cx={320} cy={880} r={14} fill="#f2e8d0" stroke="#3a2010" strokeWidth={4} />
          <circle cx={318} cy={878} r={6} fill="#1a1a1a" />
          {parcaGitti ? <path d="M 520 860 q 40 -10 70 20 q -10 40 -60 40 q -30 -20 -10 -60 Z" fill="#f2e2c8" stroke="#a87a4a" strokeWidth={3} /> : null}
        </g>
        {/* buhar */}
        {new Array(4).fill(0).map((_, i) => { const a = ((t * 30 + i * 20) % 80); return <path key={i} d={`M ${430 + i * 60} ${820 - a * 3} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#ffffff" strokeWidth={10} fill="none" opacity={Math.max(0, 0.35 - a / 240)} strokeLinecap="round" />; })}
        {/* papaya dilimleri + muzlar */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${300 + i * 110} ${1180 + (i % 2) * 30}) rotate(${-20 + i * 15})`}>
            <path d="M -70 0 Q 0 -60 70 0 Q 0 30 -70 0 Z" fill="#f28a3a" stroke="#8a4a1a" strokeWidth={4} />
            <path d="M -50 -2 Q 0 -30 50 -2" stroke="#3a2010" strokeWidth={6} strokeDasharray="4 8" fill="none" />
            <path d="M -70 0 Q 0 -66 70 0" stroke="#5a8a3a" strokeWidth={6} fill="none" />
          </g>
        ))}
        {[0, 1].map((i) => <path key={i} d={`M ${640 + i * 50} 1120 q 40 80 160 110`} stroke="#f2d44a" strokeWidth={46} fill="none" strokeLinecap="round" />)}
        {[0, 1].map((i) => <path key={`k${i}`} d={`M ${640 + i * 50} 1120 q 40 80 160 110`} stroke="#8a7a2a" strokeWidth={3} fill="none" />)}
        {/* yarım hindistan cevizinde su */}
        <circle cx={760} cy={620} r={150} fill="#6a4a2c" stroke={O} strokeWidth={6} />
        <circle cx={760} cy={620} r={124} fill="#f4ecd8" />
        <circle cx={760} cy={620} r={108} fill="url(#yu_su)" />
        <ellipse cx={730 + Math.sin(f / 12) * 6} cy={592} rx={46} ry={14} fill="#ffffff" opacity={0.6} />
        <circle cx={760} cy={620} r={60 + (f % 40)} fill="none" stroke="#ffffff" strokeWidth={2} opacity={Math.max(0, 0.4 - (f % 40) / 100)} />
        {/* (D4) kadının eli: parça koparıp götürür */}
        {el > 0 ? (
          <g transform={`translate(${1150 - 540 * el} ${1500 - 640 * el}) rotate(-35)`}>
            <path d="M 0 0 L 600 120" stroke="#8a5a34" strokeWidth={130} strokeLinecap="round" />
            <path d="M 0 0 L 600 120" stroke="#a06a40" strokeWidth={104} strokeLinecap="round" />
            <circle cx={150} cy={30} r={30} fill="#c9a24a" stroke={O} strokeWidth={3} />
            <ellipse cx={-40} cy={-10} rx={70} ry={50} fill="#a06a40" stroke={O} strokeWidth={4} />
            {[-30, 0, 30].map((d, k) => <ellipse key={k} cx={-110} cy={-20 + d} rx={34} ry={16} fill="#a06a40" stroke={O} strokeWidth={3} />)}
            {parcaGitti ? <path d="M -140 -20 q 20 -14 40 0 q -6 18 -26 18 Z" fill="#f2e2c8" stroke="#a87a4a" strokeWidth={2} /> : null}
          </g>
        ) : null}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(40,20,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------------------------
 * Sözleşme (kapak sayfası): fildişi kâğıt (#f8f5ee), lacivert mürekkep (#1d2a44), yıldızsız "Z" logosu ve altın nokta,
 * "ZENITH GRUP HOLDİNG · ANLAŞMA TASLAĞI", "$50.000.000.000", boş imza alanları, kum ve su lekesi, zımba izi.
 * faz "tut": yaşlının nasırlı eli (ön koluyla) tutar, okunur (ateş ışığı titreşir).
 * faz "burus": eli kapanırken kâğıt 6 ara biçimle buruşur, küçülür.
 * faz "ates": ateşte top açılır, tutar ~1.5 sn okunur, kara cephe turuncu kenarla ilerler, kül yükselir.
 * ---------------------------------------------------------------------------------------- */
const KAGIT = "#f8f5ee";
const MUR = "#1d2a44";
const SozlesmeSayfa: React.FC<{ yanik?: number; buruşma?: number }> = ({ yanik = 0, buruşma = 0 }) => {
  // sayfa koordinatı: 0..700 x 0..960
  const jitter = (i: number) => (random(`br${i}`) - 0.5) * 120 * buruşma;
  const pts: [number, number][] = [[0, 0], [175, 0], [350, 0], [525, 0], [700, 0], [700, 240], [700, 480], [700, 720], [700, 960], [525, 960], [350, 960], [175, 960], [0, 960], [0, 720], [0, 480], [0, 240]];
  const poly = pts.map(([x, y], i) => `${x + jitter(i)} ${y + jitter(i + 50)}`).join(" L ");
  // yanma cephesi: alt kenardan (sol alt köşe önde) düzensiz yükselir
  const cephe = (x: number) => 1010 - yanik * 1250 + (700 - x) * 0.25 * Math.min(1, yanik * 3) + Math.sin(x / 37 + 1.3) * 26 + Math.sin(x / 13) * 10 + (random(`c${Math.round(x / 35)}`) - 0.5) * 30;
  const xs = new Array(21).fill(0).map((_, i) => 700 - i * 35);
  const cepheYol = xs.map((x) => `L ${x} ${cephe(x)}`).join(" ") + ` L -200 ${cephe(0)}`;
  const cepheCizgi = "M " + xs.slice().reverse().map((x) => `${x} ${cephe(x)}`).join(" L ");
  return (
    <g>
      <g clipPath={yanik > 0 ? "url(#sz_kalan)" : undefined}>
      <defs>
        <clipPath id="sz_kagit"><path d={`M ${poly} Z`} /></clipPath>
        <clipPath id="sz_kalan"><path d={`M -200 -200 H 900 V ${cephe(700)} ${cepheYol} V -200 Z`} /></clipPath>
        <filter id="sz_kor" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id="sz_leke"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="11" /><feColorMatrix values="0 0 0 0 0.75  0 0 0 0 0.68  0 0 0 0 0.5  0 0 0 0.55 0" /></filter>
      </defs>
      <path d={`M ${poly} Z`} fill={KAGIT} stroke="#b8b0a0" strokeWidth={3} />
      <g clipPath="url(#sz_kagit)">
        {/* su ve kum lekesi */}
        <rect x={0} y={560} width={700} height={400} filter="url(#sz_leke)" opacity={0.6} />
        {new Array(30).fill(0).map((_, i) => <circle key={i} cx={(i * 137) % 700} cy={700 + ((i * 251) % 260)} r={2} fill="#c8a870" opacity={0.7} />)}
        {/* logo: yıldızsız Z + altın nokta */}
        <circle cx={350} cy={150} r={56} fill="none" stroke={MUR} strokeWidth={8} />
        <path d="M 322 126 H 378 L 324 176 H 380" stroke={MUR} strokeWidth={10} fill="none" strokeLinejoin="round" />
        <circle cx={392} cy={110} r={8} fill="#c9a24a" />
        <text x={350} y={250} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={34} letterSpacing={6} fill={MUR}>ZENITH GRUP HOLDİNG</text>
        <path d="M 120 274 H 580" stroke={MUR} strokeWidth={3} />
        <text x={350} y={334} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={40} fill={MUR}>ANLAŞMA TASLAĞI</text>
        <text x={350} y={380} textAnchor="middle" fontFamily="Georgia, serif" fontSize={22} fill="#4a5470">Gizli · Yalnızca taraflar içindir</text>
        <text x={350} y={500} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={900} fontSize={74} fill={MUR}>$50.000.000.000</text>
        <text x={350} y={548} textAnchor="middle" fontFamily="Georgia, serif" fontSize={24} fill="#4a5470">(elli milyar ABD doları)</text>
        {[630, 680, 730].map((y, i) => <path key={y} d={`M 90 ${y} H ${i === 2 ? 420 : 610}`} stroke="#9aa0b0" strokeWidth={5} />)}
        <text x={90} y={850} fontFamily="Georgia, serif" fontSize={24} fill={MUR}>Zenith Grup adına</text>
        <path d="M 90 880 H 300" stroke={MUR} strokeWidth={2} />
        <text x={390} y={850} fontFamily="Georgia, serif" fontSize={24} fill={MUR}>……… adına</text>
        <path d="M 390 880 H 610" stroke={MUR} strokeWidth={2} />
        {/* zımba izi */}
        <path d="M 40 30 L 60 50 M 52 26 L 72 46" stroke="#8a8e92" strokeWidth={4} />
        {/* kırışıklık çizgileri (buruşma arttıkça) */}
        {new Array(Math.round(buruşma * 14)).fill(0).map((_, i) => <path key={i} d={`M ${random(`k${i}`) * 700} ${random(`l${i}`) * 960} L ${random(`m${i}`) * 700} ${random(`n${i}`) * 960}`} stroke="#c8c0b0" strokeWidth={3} />)}
        {yanik > 0 ? (
          <g>
            {/* kömürleşmiş şerit + kahverengi kavrulma */}
            <path d={cepheCizgi} stroke="#c89a5a" strokeWidth={150} fill="none" opacity={0.35} />
            <path d={cepheCizgi} stroke="#4a2a14" strokeWidth={70} fill="none" opacity={0.85} />
            <path d={cepheCizgi} stroke="#1a1210" strokeWidth={34} fill="none" />
          </g>
        ) : null}
      </g>
      </g>
      {yanik > 0 ? (
        <g clipPath="url(#sz_kagit)">
          {/* kor kenar */}
          <path d={cepheCizgi} stroke="#ff8a2a" strokeWidth={16} fill="none" filter="url(#sz_kor)" />
          <path d={cepheCizgi} stroke="#ffd070" strokeWidth={4} fill="none" transform="translate(0 6)" />
        </g>
      ) : null}
    </g>
  );
};

/* ------------------------------------------------------------------------------------------
 * Omuz bastırma (yakın, üstten-yandan): Emir'in göğsü ve omzu (yırtık beyaz gömlek, kan lekesi, yaprak sargı).
 * Gövde kalkmaya çalışır (kameraya doğru büyür); kadının iki eli (sağ bilekte altın bilezik) sol üstten girer,
 * sol avuç omza, sağ avuç göğse oturur, gövdeyi geri yatırır; avuçların çevresinde gömlek kırışır.
 * Emir'in sağ eli kadının bileğini kavrar, sonra gevşeyip düşer (vazgeçiş). Yüz kadraja girmez (yalnız çene ucu).
 * ---------------------------------------------------------------------------------------- */
const OmuzBastir: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ease = (x: number) => x * x * (3 - 2 * x);
  const kalk = interpolate(t, [0, 0.7, 1.5], [0.2, 1, 0], { ...clamp, easing: ease }); // gövde kalkışı
  const nefes = Math.sin(t * 5.5) * (t > 1.5 ? 0.012 : 0.02);
  const elGir = interpolate(t, [0.25, 0.85], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const bas = interpolate(t, [0.85, 1.5], [0, 1], { ...clamp, easing: ease });
  const tut = interpolate(t, [0.6, 1.0, 1.9, 2.4], [0, 1, 1, 0], { ...clamp, easing: ease }); // Emir'in eli bileği kavrar, sonra düşer
  const sc = 1 + kalk * 0.07 + nefes;
  const gx = -kalk * 30, gy = -kalk * 50;
  const z = interpolate(f, [0, dur], [1, 1.05], clamp);
  const SKIN = "#ecc19c", SKIN2 = "#d8a67f", KSK = "#b8805a", KSK2 = "#9a6644", GOM = "#e6e0d4", GOM2 = "#c8c0b0";
  const omuz = { x: 290, y: 760 }, gogus = { x: 470, y: 1200 };
  // elin oturduğu yer gövdeyle birlikte hareket eder
  const tr = (p: { x: number; y: number }) => ({ x: 540 + (p.x - 540) * sc + gx, y: 1000 + (p.y - 1000) * sc + gy });
  const o = tr(omuz), g = tr(gogus);
  const kol = (to: { x: number; y: number }, from: { x: number; y: number }, bilezik: boolean, rot: number) => {
    const ex = from.x + (to.x - from.x) * elGir, ey = from.y + (to.y - from.y) * elGir;
    const dx = ex - from.x, dy = ey - from.y;
    const ang = (Math.atan2(to.y - from.y + 1e-3, to.x - from.x) * 180) / Math.PI;
    const yay = 1 + bas * 0.1; // bastırınca avuç yayılır
    return (
      <g>
        {/* ön kol: kadraj dışından ele */}
        <path d={`M ${from.x - 900 * Math.cos((ang * Math.PI) / 180)} ${from.y - 900 * Math.sin((ang * Math.PI) / 180)} L ${ex - Math.cos((ang * Math.PI) / 180) * 200} ${ey - Math.sin((ang * Math.PI) / 180) * 200}`} stroke={O} strokeWidth={250} strokeLinecap="round" />
        <path d={`M ${from.x - 900 * Math.cos((ang * Math.PI) / 180)} ${from.y - 900 * Math.sin((ang * Math.PI) / 180)} L ${ex - Math.cos((ang * Math.PI) / 180) * 200} ${ey - Math.sin((ang * Math.PI) / 180) * 200}`} stroke={KSK} strokeWidth={238} strokeLinecap="round" />
        <path d={`M ${from.x - 900 * Math.cos((ang * Math.PI) / 180) + 30} ${from.y - 900 * Math.sin((ang * Math.PI) / 180) + 30} L ${ex + 30 - dx * 0.0} ${ey + 30 - dy * 0.0}`} stroke={KSK2} strokeWidth={50} strokeLinecap="round" opacity={0.3} />
        <g transform={`translate(${ex} ${ey}) rotate(${ang + rot}) scale(${1.6 * yay} 1.6)`}>
          {bilezik ? <g>
            <rect x={-150} y={-70} width={46} height={140} rx={16} fill="#c9a24a" stroke={O} strokeWidth={5} />
            <path d="M -140 -60 V 60" stroke="#f0d890" strokeWidth={6} opacity={0.7} />
          </g> : null}
          {/* avuç sırtı */}
          <path d="M -100 -66 Q -30 -86 60 -70 Q 110 -60 118 0 Q 110 60 60 70 Q -30 86 -100 66 Z" fill={KSK} stroke={O} strokeWidth={5} />
          {/* parmaklar (bastırınca düzleşir) */}
          {[-48, -16, 16, 46].map((yy, i) => (
            <path key={i} d={`M 100 ${yy} q ${70 + (i === 1 || i === 2 ? 14 : 0)} ${-4 + bas * 3} ${92 + (i === 1 || i === 2 ? 16 : 0) - (1 - bas) * 14} ${-2}`} stroke={O} strokeWidth={36} strokeLinecap="round" fill="none" />
          ))}
          {[-48, -16, 16, 46].map((yy, i) => (
            <path key={`i${i}`} d={`M 100 ${yy} q ${70 + (i === 1 || i === 2 ? 14 : 0)} ${-4 + bas * 3} ${92 + (i === 1 || i === 2 ? 16 : 0) - (1 - bas) * 14} ${-2}`} stroke={KSK} strokeWidth={27} strokeLinecap="round" fill="none" />
          ))}
          {/* başparmak */}
          <path d="M 20 -60 Q 70 -92 122 -86" stroke={O} strokeWidth={38} strokeLinecap="round" fill="none" />
          <path d="M 20 -60 Q 70 -92 122 -86" stroke={KSK} strokeWidth={29} strokeLinecap="round" fill="none" />
          {/* eklem çizgileri */}
          {[-46, -15, 16, 45].map((yy, i) => <path key={`k${i}`} d={`M 92 ${yy - 9} q 6 9 0 18`} stroke={KSK2} strokeWidth={3} fill="none" />)}
          <path d="M -60 -30 Q 0 -40 60 -30 M -60 20 Q 0 28 60 22" stroke={KSK2} strokeWidth={3} fill="none" opacity={0.6} />
        </g>
      </g>
    );
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#a8884a", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "45% 45%" }}>
        <defs>
          <radialGradient id="ob_isik" cx="0.62" cy="0.38" r="0.75"><stop offset="0" stopColor="#fff1c8" stopOpacity={0.28} /><stop offset="1" stopColor="#000" stopOpacity={0.35} /></radialGradient>
        </defs>
        {/* hasır döşek */}
        <rect width={1080} height={1920} fill="#c9a868" />
        {new Array(70).fill(0).map((_, i) => <path key={i} d={`M ${-400 + i * 30} 0 L ${i * 30 + 300} 1920`} stroke={i % 2 ? "#b8955a" : "#d8b878"} strokeWidth={13} />)}
        {/* gövdenin döşeğe düşen gölgesi */}
        <ellipse cx={600 + gx * 0.4} cy={1150} rx={560 - kalk * 40} ry={760} fill="#000" opacity={0.18 + kalk * 0.06} transform="rotate(-24 600 1150)" />
        <g transform={`translate(${gx} ${gy}) translate(540 1000) scale(${sc}) translate(-540 -1000)`}>
          {/* boyun (yüz kadraj dışında, üst kenardan) */}
          <path d="M 380 -60 L 640 -60 L 650 560 L 370 580 Z" fill={SKIN} stroke={O} strokeWidth={6} />
          <path d="M 590 -60 L 600 560 L 650 560 L 640 -60 Z" fill={SKIN2} opacity={0.8} />
          <path d="M 500 200 q 18 30 0 60" stroke={SKIN2} strokeWidth={6} fill="none" />
          {/* gövde: yırtık gömlek */}
          <path d="M 180 560 Q 420 470 760 520 Q 1020 600 1120 980 L 1160 2000 L 120 2000 Q 60 1500 90 1100 Q 110 720 180 560 Z" fill={GOM} stroke={O} strokeWidth={7} />
          {/* yaka */}
          <path d="M 330 560 L 430 700 L 520 540 M 520 540 L 600 700 L 700 560" stroke={O} strokeWidth={6} fill={GOM2} />
          <path d="M 430 700 L 520 640 L 600 700 L 560 1900" stroke={O} strokeWidth={5} fill="none" />
          {[820, 1060, 1300, 1540].map((yy) => <circle key={yy} cx={520 + (yy - 700) * 0.035} cy={yy} r={13} fill="#f4f0e8" stroke={O} strokeWidth={4} />)}
          {/* kırışıklar (bastırınca avuç çevresinde artar) */}
          {new Array(10).fill(0).map((_, i) => <path key={i} d={`M ${omuz.x + Math.cos(i) * 150} ${omuz.y + Math.sin(i * 1.7) * 130} q ${30} ${20} ${60 + i * 4} ${10}`} stroke={GOM2} strokeWidth={5} fill="none" opacity={0.3 + bas * 0.6} />)}
          {new Array(12).fill(0).map((_, i) => <path key={`g${i}`} d={`M ${gogus.x + Math.cos(i * 1.3) * 170} ${gogus.y + Math.sin(i * 2.1) * 150} q 40 -10 70 ${20 - i * 3}`} stroke={GOM2} strokeWidth={5} fill="none" opacity={0.3 + bas * 0.6} />)}
          {/* yırtık + kan */}
          <path d="M 820 820 l 50 40 l -30 30 l 60 50 l -20 40" stroke={O} strokeWidth={5} fill="none" />
          <path d="M 830 840 l 40 30 l -26 26 l 50 46 l -40 20 Z" fill={SKIN} opacity={0.9} />
          <ellipse cx={300} cy={1300} rx={90} ry={60} fill="#7a1a14" opacity={0.28} />
          <ellipse cx={760} cy={1500} rx={60} ry={40} fill="#7a1a14" opacity={0.22} />
          {/* yaprak sargı (göğüsten çapraz) */}
          <path d="M 80 1500 Q 600 1200 1150 1020 L 1160 1140 Q 620 1320 100 1640 Z" fill="#5f8a3a" stroke="#2e4a1e" strokeWidth={5} />
          {new Array(8).fill(0).map((_, i) => <path key={i} d={`M ${180 + i * 120} ${1520 - i * 60} l 40 -40`} stroke="#9cc46a" strokeWidth={4} />)}
        </g>
        {/* kadının elleri */}
        {kol(o, { x: -120, y: 260 }, false, -6)}
        {kol(g, { x: -200, y: 700 }, true, 4)}
        {/* Emir'in sağ eli: sağ alttan gelip kadının sağ bileğini kavrar, sonra gevşeyip düşer */}
        {tut > 0 ? (() => {
          const ang2 = Math.atan2(g.y - 700, g.x + 200);
          const ex2 = -200 + (g.x + 200) * elGir, ey2 = 700 + (g.y - 700) * elGir;
          const wx = ex2 - Math.cos(ang2) * 250, wy = ey2 - Math.sin(ang2) * 250; // kadının (şu anki) bileği
          const hx = wx + (1 - tut) * 380, hy = wy + (1 - tut) * 560;
          return (
            <g>
              <path d={`M ${hx} ${hy} L ${hx + 520} ${hy + 900}`} stroke={O} strokeWidth={250} strokeLinecap="round" />
              <path d={`M ${hx} ${hy} L ${hx + 520} ${hy + 900}`} stroke={GOM} strokeWidth={238} strokeLinecap="round" />
              <path d={`M ${hx + 150} ${hy + 380} l 70 -40`} stroke={GOM2} strokeWidth={10} />
              <ellipse cx={hx} cy={hy} rx={120} ry={95} fill={SKIN} stroke={O} strokeWidth={6} transform={`rotate(-30 ${hx} ${hy})`} />
              {[-60, -20, 20, 60].map((d, i) => (
                <g key={i}>
                  <path d={`M ${hx - 40 + d} ${hy + 60} Q ${hx - 110 + d * 0.6} ${hy - 30} ${hx - 60 + d * 0.8} ${hy - 110 + tut * 10}`} stroke={O} strokeWidth={48} strokeLinecap="round" fill="none" />
                  <path d={`M ${hx - 40 + d} ${hy + 60} Q ${hx - 110 + d * 0.6} ${hy - 30} ${hx - 60 + d * 0.8} ${hy - 110 + tut * 10}`} stroke={SKIN} strokeWidth={38} strokeLinecap="round" fill="none" />
                </g>
              ))}
              <path d={`M ${hx + 80} ${hy - 40} Q ${hx + 20} ${hy - 150} ${hx - 70} ${hy - 150}`} stroke={O} strokeWidth={50} strokeLinecap="round" fill="none" />
              <path d={`M ${hx + 80} ${hy - 40} Q ${hx + 20} ${hy - 150} ${hx - 70} ${hy - 150}`} stroke={SKIN} strokeWidth={40} strokeLinecap="round" fill="none" />
            </g>
          );
        })() : null}
        <rect width={1080} height={1920} fill="url(#ob_isik)" />
        {/* hasırdan sızan ışık şeridi */}
        <path d="M 600 -100 L 760 -100 L 260 2000 L 100 2000 Z" fill="#fff1c8" opacity={0.08} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

const Sozlesme: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const faz = text?.[0] ?? "tut";
  const fl = 0.85 + 0.15 * Math.sin(f / 2.3) * Math.sin(f / 5.1);
  if (faz === "ates") {
    const yanik = interpolate(t, [1.4, dur / fps - 0.2], [0, 1], clamp);
    const acil = interpolate(t, [0, 1.0], [0.55, 0.85], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 });
    return (
      <AbsoluteFill style={{ backgroundColor: "#1a0a04", overflow: "hidden" }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
          <defs>
            <radialGradient id="sa_kor" cx="0.5" cy="0.6" r="0.6"><stop offset="0" stopColor="#ff8a2a" /><stop offset="0.6" stopColor="#a8380a" /><stop offset="1" stopColor="#1a0a04" /></radialGradient>
            <linearGradient id="sa_dis" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ff5a10" /><stop offset="0.7" stopColor="#d8300a" /><stop offset="1" stopColor="#8a1a04" stopOpacity={0.2} /></linearGradient>
            <linearGradient id="sa_orta" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ffb030" /><stop offset="0.8" stopColor="#ff7a1a" /><stop offset="1" stopColor="#ff5a10" stopOpacity={0.3} /></linearGradient>
            <linearGradient id="sa_ic" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff4c0" /><stop offset="0.6" stopColor="#ffd860" /><stop offset="1" stopColor="#ffb030" stopOpacity={0.4} /></linearGradient>
            <filter id="sa_glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="40" /></filter>
          </defs>
          <rect width={1080} height={1920} fill="url(#sa_kor)" opacity={fl} />
          {/* kömür ve odunlar */}
          {new Array(12).fill(0).map((_, i) => <ellipse key={i} cx={(i * 197) % 1080} cy={1500 + ((i * 113) % 300)} rx={90} ry={34} fill="#2a1208" stroke="#ff6a1a" strokeWidth={3} opacity={0.9} />)}
          {/* ısıyla açılan sayfa */}
          <g transform={`translate(${190} ${520}) scale(${acil}) rotate(${-6 + Math.sin(f / 9) * 1.5})`}>
            <SozlesmeSayfa yanik={yanik} buruşma={0.55} />
          </g>
          {/* alev dilleri (sayfanın kenarından) */}
          <ellipse cx={540} cy={1560} rx={520} ry={260} fill="#ff7a1a" opacity={0.35 * fl} filter="url(#sa_glow)" />
          {[
            { n: 7, w: 150, hb: 360, c: "url(#sa_dis)", o: 0.9, sp: 0 },
            { n: 9, w: 105, hb: 260, c: "url(#sa_orta)", o: 0.95, sp: 37 },
            { n: 8, w: 62, hb: 160, c: "url(#sa_ic)", o: 0.95, sp: 71 },
          ].map((L, li) => (
            <g key={li} opacity={L.o}>
              {new Array(L.n).fill(0).map((_, i) => {
                const x0 = 130 + (i + 0.5) * (820 / L.n) + Math.sin(i * 7 + li) * 20;
                const ph = f / (3.1 + (i % 3) * 0.7) + i * 1.9 + L.sp;
                const h = L.hb * (0.75 + 0.35 * Math.sin(ph) * Math.sin(ph * 0.53 + 2)) + yanik * L.hb * 0.9 * (1 - Math.abs(i / (L.n - 1) - 0.5));
                const sway = Math.sin(f / 6 + i * 2.3 + li) * L.w * 0.45;
                const b = 1640, w = L.w;
                return <path key={i} d={`M ${x0 - w} ${b} C ${x0 - w * 1.05} ${b - h * 0.45}, ${x0 - w * 0.25 + sway * 0.5} ${b - h * 0.6}, ${x0 + sway} ${b - h} C ${x0 + w * 0.35 + sway * 0.4} ${b - h * 0.62}, ${x0 + w * 1.05} ${b - h * 0.4}, ${x0 + w} ${b} Z`} fill={L.c} />;
              })}
            </g>
          ))}
          {/* kül ve kıvılcım */}
          {new Array(24).fill(0).map((_, i) => { const a = (f * 3 + i * 31) % 200; return <rect key={i} x={200 + ((i * 89) % 700) + Math.sin(a / 15) * 30} y={1400 - a * 6} width={6} height={4} fill={i % 3 ? "#ffd060" : "#3a3030"} opacity={Math.max(0, 1 - a / 200)} />; })}
        </svg>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
      </AbsoluteFill>
    );
  }
  const burus = faz === "burus" ? interpolate(t, [0.2, dur / fps - 0.2], [0, 1], { ...clamp, easing: (x) => x * x }) : 0;
  const step = Math.floor(burus * 6) / 6; // 6 ara biçim
  const sc = 1 - step * 0.62;
  const z = interpolate(f, [0, dur], [1, 1.06], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#3a2418", overflow: "hidden" }}>
      {/* bulanık meydan arka planı (ateş ışığı) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 85%, rgba(255,150,60,0.55) 0%, rgba(120,50,20,0.6) 40%, rgba(30,15,10,1) 100%)", filter: "blur(4px)" }} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "50% 45%" }}>
        {/* sayfa */}
        <g transform={`translate(${540 - 350 * sc} ${300 + (1 - sc) * 400}) scale(${sc}) rotate(${-4 + step * 18} 350 480)`}>
          <SozlesmeSayfa buruşma={step} />
        </g>
        {/* yaşlının nasırlı eli + ön kolu (sağ alttan), kolye boncuklu bilezik */}
        <g transform={`translate(${760 - step * 140} ${1180 - step * 160})`}>
          <path d="M 0 0 L 420 700" stroke="#7a4a2a" strokeWidth={210} strokeLinecap="round" />
          <path d="M 0 0 L 420 700" stroke="#a8714a" strokeWidth={180} strokeLinecap="round" />
          {new Array(6).fill(0).map((_, i) => <path key={i} d={`M ${60 + i * 50} ${120 + i * 80} q 40 -20 60 10`} stroke="#8a5a34" strokeWidth={4} fill="none" />)}
          {new Array(9).fill(0).map((_, i) => <circle key={i} cx={130 + i * 18} cy={260 + i * 26} r={11} fill={i % 2 ? "#c9a24a" : "#e8e0d0"} stroke={O} strokeWidth={2} />)}
          {/* parmaklar (buruşmayla kapanır) */}
          {[0, 1, 2, 3].map((k) => (
            <ellipse key={k} cx={-60 + k * 10 - step * 30} cy={-40 + k * 50} rx={100 - step * 40} ry={32} fill="#a8714a" stroke={O} strokeWidth={4} transform={`rotate(${-20 + step * 40} 0 0)`} />
          ))}
          <ellipse cx={30} cy={-110} rx={46} ry={30} fill="#a8714a" stroke={O} strokeWidth={4} />
        </g>
      </svg>
      <AbsoluteFill style={{ background: `rgba(255,140,40,${0.08 * fl})`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Insert7: React.FC<{ kind: Insert7Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "pov_yaprak": return <PovYaprak dur={dur} />;
    case "kol_saati": return <KolSaati dur={dur} />;
    case "tv_son_dakika": return <TvSonDakika dur={dur} text={text} />;
    case "yemek_ust": return <YemekUst dur={dur} />;
    case "sozlesme": return <Sozlesme dur={dur} text={text} />;
    case "omuz_bastir": return <OmuzBastir dur={dur} />;
    default: return null;
  }
};
