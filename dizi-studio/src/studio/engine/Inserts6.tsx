/* Deli Değilim · Bölüm 2 ekleme çekimleri: tablet videosu (güvenlik kamerası), mürekkepli parmaklar, Nalan'ın cebindeki kalem.
 * Tam ekran 1080x1920, kendi çizimimiz. Mürekkep rengi dizi boyunca sabit: #10204a (Bölüm 1'deki TV imzası ve flas_imza ile aynı). */
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MONO = "'Courier New', monospace";
const MUREKKEP = "#10204a";

export type Insert6Kind = "tablet_video" | "murekkep_parmak" | "kalem_cep";
export const INSERT6_KINDS: Insert6Kind[] = ["tablet_video", "murekkep_parmak", "kalem_cep"];

/* ---------------------------------------------------------------------------------------------
 * Tablet videosu. Deniz'in elindeki tablette, odanın köşesindeki kameradan (kamera_led açısı) çekilmiş kayıt:
 * Berkay yatak kenarında dizindeki boş kâğıda imza atar, kâğıdı boşluğa uzatır, kalkar ve kimseyle el sıkışır.
 * text[0] = videonun kaçıncı saniyeden oynadığı (iki vuruşa bölündüğünde süreklilik için).
 * ------------------------------------------------------------------------------------------- */
const TabletVideo: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = Number(text?.[0] ?? 0);
  const modOn = text?.[1] ?? "";
  // hatıra: yalnızca imza anı döner (sol el kalemle yazar)
  const t = modOn === "hatira" ? (t0 + f / fps) % 1.4 : t0 + f / fps;
  // text[1] mod: "" normal | "hatira" (hatırlanan kare: sıcak-soluk, ele yaklaşır) | "ayna" (text[2] sn'de ekrana dokunulur, görüntü aynalanır)
  //              | "ayna_kilit" (baştan aynalı; kapının üstündeki 7'ye yaklaşır; text[2] sn'de ekran kilitlenir)
  const mod = text?.[1] ?? "";
  const tLocal = f / fps;
  const flipAt = Number(text?.[2] ?? 999);
  const flipK = mod === "ayna" ? interpolate(tLocal, [flipAt, flipAt + 0.18, flipAt + 0.36], [1, 0, -1], clamp) : mod === "ayna_kilit" ? -1 : 1;
  const dokunus = mod === "ayna" && tLocal >= flipAt - 0.35 && tLocal < flipAt + 0.25;
  const kilit = mod === "ayna_kilit" && tLocal >= flipAt;
  const kilitA = mod === "ayna_kilit" ? interpolate(tLocal, [flipAt, flipAt + 0.25], [0, 1], clamp) : 0;
  const plakaZoom = mod === "ayna_kilit" ? interpolate(tLocal, [0.1, 1.3], [1, 3.4], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 }) : 1;
  const hatiraZoom = mod === "hatira" ? interpolate(tLocal, [0, 2.6], [2.1, 2.6], clamp) : 1;
  const look = castById("berkay_hasta");
  // el titremesi + yavaş yaklaşma
  const jx = Math.sin(f / 7) * 2.5 + Math.sin(f / 3.1) * 0.8;
  const jy = Math.cos(f / 8) * 2 + Math.sin(f / 2.7) * 0.7;
  const z = 1 + interpolate(t, [0, 6], [0, 0.07], clamp);
  // videodaki eylem evreleri
  const ayakta = t >= 3.2;
  const uzatiyor = t >= 1.6 && t < 3.2;
  const imza = t < 1.6;
  const kx = ayakta ? 560 : 430;
  const armR = imza
    ? { upper: 30 + Math.sin(t * 22) * 4, fore: -78 + Math.sin(t * 17) * 7, ul: 0.82 }
    : ayakta
      ? { upper: 50, fore: -34 + Math.sin(t * 9) * 7, ul: 0.72, fl: 0.9 }
      : { upper: 52, fore: -34, ul: 0.72, fl: 0.9 };
  const sec = 7 + Math.floor(t);
  const ilerleme = 41 + Math.floor(t);
  const rec = Math.floor(f / 15) % 2 === 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#22282e", overflow: "hidden" }}>
      {/* odanın bulanık arka planı (tabletin arkası) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 30%, #4a545c 0%, #2a3036 55%, #14181c 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(220,235,255,0.10) 0%, rgba(0,0,0,0) 40%)" }} />
      <AbsoluteFill style={{ transform: `translate(${jx}px, ${jy}px) scale(${z * plakaZoom * hatiraZoom}) rotate(-1.2deg)`, transformOrigin: mod === "ayna_kilit" ? "205px 540px" : mod === "hatira" ? "600px 1240px" : "50% 50%", filter: mod === "hatira" ? "sepia(0.35) saturate(0.7) brightness(1.05) blur(1.2px)" : undefined }}>
        {/* tablet gövdesi */}
        <div style={{ position: "absolute", left: 90, top: 200, width: 900, height: 1500, borderRadius: 64, backgroundColor: "#16181c", boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 3px #2a2e34" }} />
        <div style={{ position: "absolute", left: 534, top: 214, width: 12, height: 12, borderRadius: 6, backgroundColor: "#2e3440" }} />
        {/* ekran */}
        <div style={{ position: "absolute", left: 118, top: 236, width: 844, height: 1428, borderRadius: 26, overflow: "hidden", backgroundColor: "#000" }}>
          {/* video: tek renk mavi-gri güvenlik kamerası */}
          <div style={{ position: "absolute", inset: 0, filter: "grayscale(1) sepia(0.2) hue-rotate(180deg) saturate(0.55) contrast(1.28) brightness(0.95)", transform: `scaleX(${flipK})`, transformOrigin: "50% 50%" }}>
            <svg viewBox="0 0 844 1428" width={844} height={1428} style={{ position: "absolute", left: 0, top: 0 }}>
              {/* köşe kamerasından eğik bakış: arka duvar, zemin (perspektif karolar) */}
              <rect width={844} height={1428} fill="#6e7270" />
              <rect x={0} y={0} width={844} height={760} fill="#7c807e" />
              <path d="M 0 760 H 844" stroke="#4e5250" strokeWidth={6} />
              <rect x={0} y={640} width={844} height={120} fill="#727674" />
              {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${i * 105} 760 L ${-200 + i * 160} 1428`} stroke="#555958" strokeWidth={3} />)}
              {[860, 990, 1150, 1350].map((y) => <path key={y} d={`M 0 ${y} H 844`} stroke="#555958" strokeWidth={3} />)}
              {/* duvarda sürtünme lekesi (yatak başı hizası) */}
              <ellipse cx={200} cy={720} rx={130} ry={40} fill="#5e6260" opacity={0.6} />
              {/* parmaklıklı pencere + zemine düşen ışık ve parmaklık gölgesi */}
              <rect x={330} y={170} width={230} height={260} fill="#d4d8d4" stroke="#3a3e3c" strokeWidth={8} />
              {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${362 + i * 54} 170 V 430`} stroke="#2a2e2c" strokeWidth={10} />)}
              <path d="M 330 430 L 560 430 L 700 1060 L 300 1060 Z" fill="#b8bcb8" opacity={0.28} />
              {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${362 + i * 54} 430 L ${390 + i * 84} 1060`} stroke="#3a3e3c" strokeWidth={16} opacity={0.35} />)}
              {/* kapı (sağ) ve kapı altından sızan koridor ışığı */}
              <rect x={690} y={330} width={150} height={430} fill="#4a4e50" stroke="#2a2e30" strokeWidth={6} />
              <rect x={720} y={380} width={70} height={60} fill="#2a2e30" />
              {/* kapının üstündeki oda numarası (gerçek odadakiyle aynı emaye plaka) */}
              <rect x={737} y={282} width={56} height={40} rx={5} fill="#eceae2" stroke="#2a2e30" strokeWidth={3} />
              <text x={765} y={313} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={30} fill="#141618">7</text>
              <path d="M 690 760 L 840 760 L 760 900 L 640 900 Z" fill="#c8ccc8" opacity={0.2} />
              {/* demir karyola (yandan): başlık, şilte, buruşuk çarşaf, yastık */}
              <path d="M 120 760 V 1160 M 150 760 V 1160" stroke="#2e3230" strokeWidth={12} />
              {[820, 880, 940].map((y) => <path key={y} d={`M 120 ${y} H 150`} stroke="#2e3230" strokeWidth={8} />)}
              <rect x={130} y={950} width={560} height={58} rx={10} fill="#a6aaa8" stroke="#3a3e3c" strokeWidth={5} />
              <path d="M 150 960 q 90 -14 180 4 q 110 20 210 -6 q 70 -12 130 6" stroke="#7a7e7c" strokeWidth={5} fill="none" />
              <ellipse cx={210} cy={944} rx={80} ry={26} fill="#c2c6c4" stroke="#6a6e6c" strokeWidth={4} />
              <ellipse cx={214} cy={946} rx={34} ry={9} fill="#9a9e9c" />
              <rect x={130} y={1006} width={560} height={22} fill="#3a3e3c" />
              <path d="M 150 1028 V 1170 M 670 1028 V 1170" stroke="#2e3230" strokeWidth={12} />
              <ellipse cx={420} cy={1180} rx={300} ry={24} fill="#3a3e3c" opacity={0.35} />
            </svg>
            {/* Berkay (rig): yatak kenarında oturur → kalkar */}
            <div style={{ position: "absolute", left: kx - 620 * 0.2, top: ayakta ? 640 : 692 }}>
              <Character
                look={look}
                size={620}
                pose={{
                  emotion: "mutlu",
                  gesture: ayakta ? "uzat" : imza ? "rest" : "uzat",
                  armR,
                  armL: imza ? { upper: 10, fore: -36, ul: 0.95 } : undefined,
                  prop: uzatiyor ? "kagit" : imza ? "kalem" : "none",
                  body: ayakta ? "stand" : "sit",
                  yaw: 0.35,
                  lookX: 0.6,
                  lookY: imza ? 0.7 : 0,
                  tilt: ayakta ? Math.sin(t * 4) * 4 : undefined,
                  seed: 7,
                }}
              />
            </div>
            {/* dizindeki boş kâğıt (imza evresi) */}
            {imza ? (
              <svg viewBox="0 0 844 1428" width={844} height={1428} style={{ position: "absolute", left: 0, top: 0 }}>
                <path d="M 392 1004 L 488 998 L 492 1022 L 396 1030 Z" fill="#e8e8e2" stroke="#3a3e3c" strokeWidth={3} />
              </svg>
            ) : null}
            {/* sıkıştırma blokları, tarama çizgileri, kenar vinyeti */}
            <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, rgba(0,0,0,0) 3px)" }} />
            <svg viewBox="0 0 844 1428" width={844} height={1428} style={{ position: "absolute", left: 0, top: 0 }}>
              {new Array(14).fill(0).map((_, i) => {
                const r = random(`blk${Math.floor(f / 3)}-${i}`);
                if (r < 0.55) return null;
                const x = Math.floor(random(`bx${i}${Math.floor(f / 3)}`) * 105) * 8;
                const y = Math.floor(random(`by${i}${Math.floor(f / 3)}`) * 178) * 8;
                return <rect key={i} x={x} y={y} width={8 * (1 + Math.floor(r * 4))} height={8} fill="#fff" opacity={0.06} />;
              })}
            </svg>
            <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
          </div>
          {mod !== "hatira" ? (<>
          {/* kayıt yazıları (okunur, altyazı bandına girmez) */}
          <div style={{ position: "absolute", left: 30, top: 28, fontFamily: MONO, fontWeight: 700, fontSize: 46, color: "#e8f0ff", textShadow: "0 2px 4px #000" }}>KAM 2 · ODA 7</div>
          <div style={{ position: "absolute", right: 30, top: 28, fontFamily: MONO, fontWeight: 700, fontSize: 46, color: "#ff4a3a", opacity: rec ? 1 : 0.25, textShadow: "0 2px 4px #000" }}>● REC</div>
          <div style={{ position: "absolute", left: 30, top: 1250, fontFamily: MONO, fontWeight: 700, fontSize: 54, color: "#e8f0ff", textShadow: "0 2px 4px #000" }}>11.09 · 03:12:{String(sec).padStart(2, "0")}</div>
          {/* oynatıcı çubuğu */}
          <div style={{ position: "absolute", left: 30, right: 30, top: 1340, height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.25)" }}>
            <div style={{ width: `${(ilerleme / 135) * 100}%`, height: 10, borderRadius: 5, backgroundColor: "#e8f0ff" }} />
          </div>
          <div style={{ position: "absolute", left: 30, top: 1366, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: "#dfe6f0" }}>00:{String(ilerleme).padStart(2, "0")} / 02:15</div>
          </>) : null}
          {/* ekrana dokunuş */}
          {dokunus ? <div style={{ position: "absolute", left: 640, top: 1040, width: 120, height: 120, borderRadius: 60, border: "6px solid rgba(255,255,255,0.7)", transform: `scale(${interpolate(tLocal, [flipAt - 0.35, flipAt + 0.25], [0.4, 1.3], clamp)})`, opacity: interpolate(tLocal, [flipAt - 0.35, flipAt + 0.25], [0.9, 0], clamp) }} /> : null}
          {/* kilit: ekran kararır, asma kilit simgesi, siyah camda silik yansıma */}
          {kilit ? (
            <div style={{ position: "absolute", inset: 0, backgroundColor: `rgba(4,5,7,${kilitA})` }}>
              <svg viewBox="0 0 844 1428" width={844} height={1428} style={{ position: "absolute", left: 0, top: 0, opacity: kilitA }}>
                <rect x={382} y={640} width={80} height={64} rx={10} fill="none" stroke="#c8d0dc" strokeWidth={6} />
                <path d="M 398 640 V 616 Q 398 588 422 588 Q 446 588 446 616 V 640" fill="none" stroke="#c8d0dc" strokeWidth={6} />
                <circle cx={422} cy={668} r={7} fill="#c8d0dc" />
                <path d="M 0 0 L 844 0 L 844 520 L 0 900 Z" fill="#ffffff" opacity={0.03} />
              </svg>
            </div>
          ) : null}
          {/* camda pencere yansıması + parmak izi lekeleri */}
          <AbsoluteFill style={{ background: "linear-gradient(118deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.08) 38%, rgba(255,255,255,0) 46%)" }} />
          <svg viewBox="0 0 844 1428" width={844} height={1428} style={{ position: "absolute", left: 0, top: 0 }}>
            {[[220, 520, 70], [600, 900, 90], [420, 1180, 60], [700, 300, 50]].map(([x, y, r], i) => (
              <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.8} fill="#ffffff" opacity={0.05} />
            ))}
          </svg>
        </div>
        {/* Deniz'in başparmağı (sağ alt köşe, tableti tutan el) */}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {/* başparmak: sağ kenardan tabletin çerçevesini kavrar (tırnağı görünür) */}
          <g transform="translate(1040 1360) rotate(-14)">
            <rect x={-150} y={-48} width={220} height={96} rx={48} fill="#eebf98" stroke="#5a3a2a" strokeWidth={4} />
            <path d="M -138 -30 Q -150 0 -138 30 L -92 34 Q -84 0 -92 -34 Z" fill="#f6dccb" stroke="#c89a80" strokeWidth={2.5} />
            <path d="M -60 -40 q 8 40 0 80" stroke="#d8a888" strokeWidth={3} fill="none" />
            <path d="M -130 -12 q -6 12 0 24" stroke="#ffffff" strokeWidth={3} opacity={0.6} fill="none" />
          </g>
          {/* avuç tabletin arkasında; alttan görünen parmak uçları */}
          <path d="M 1080 1460 Q 1000 1480 992 1560 Q 990 1640 1080 1660 Z" fill="#d8a888" opacity={0.9} stroke="#5a3a2a" strokeWidth={3} />
        </svg>
      </AbsoluteFill>
      {/* ekranın soğuk ışığı odaya vurur */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(159,196,255,0.10) 0%, rgba(0,0,0,0) 60%)" }} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------------------------------------
 * Mürekkepli parmaklar: Berkay'ın sağ eli, avuç yukarı, pijamalı dizinin üstünde. Pencereden sol üstten ışık,
 * elin üstünden parmaklık gölgesi geçer. Odak bulanıktan netleşir. Lekeler: işaret parmağı ucu (yoğun, tırtıklı),
 * orta parmağın yanı (ince iz), serçe parmak tarafından bileğe sürtülmüş şerit (ıslak imzaya sürtünme).
 * ------------------------------------------------------------------------------------------- */
const Parmak: React.FC<{ x: number; y: number; len: number; w: number; ang: number; skin: string; id: string; children?: React.ReactNode }> = ({ x, y, len, w, ang, skin, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`}>
    <rect x={-w / 2} y={-len} width={w} height={len + 40} rx={w / 2} fill={skin} stroke="#5a3a2a" strokeWidth={5} />
    {/* boğum çizgileri (avuç tarafı) */}
    <path d={`M ${-w * 0.32} ${-len * 0.34} q ${w * 0.32} ${w * 0.1} ${w * 0.64} 0`} stroke="#d39f7c" strokeWidth={4} fill="none" />
    <path d={`M ${-w * 0.36} ${-len * 0.66} q ${w * 0.36} ${w * 0.1} ${w * 0.72} 0`} stroke="#d39f7c" strokeWidth={4} fill="none" />
    {/* parmak ucu yastığı */}
    <ellipse cx={0} cy={-len + w * 0.55} rx={w * 0.3} ry={w * 0.38} fill="#f6d2b2" opacity={0.7} />
    {children}
  </g>
);

const MurekkepParmak: React.FC<{ dur: number }> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blur = interpolate(f, [0, 0.6 * fps], [7, 0], clamp);
  const tx = Math.sin(f / 5) * 2;
  const ty = Math.cos(f / 6.3) * 1.5;
  const z = interpolate(f, [0, 3 * fps], [1.0, 1.05], clamp);
  const skin = "#f1c6a0";
  return (
    <AbsoluteFill style={{ backgroundColor: "#a9c4d6", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, filter: `blur(${blur.toFixed(1)}px)` }}>
        <defs>
          <linearGradient id="mp_isik" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity={0.22} /><stop offset="0.6" stopColor="#ffffff" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.25} /></linearGradient>
          <filter id="mp_sur"><feGaussianBlur stdDeviation="9" /></filter>
          <filter id="mp_kenar"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="12" /></filter>
        </defs>
        {/* pijama dizinin kumaşı, kıvrımlar, dikiş */}
        <rect width={1080} height={1920} fill="#a9c4d6" />
        {[[-40, 300, 1120, 520], [-60, 1300, 1140, 1520], [0, 1700, 1080, 1860]].map(([x1, y1, x2, y2], i) => (
          <path key={i} d={`M ${x1} ${y1} Q 540 ${(y1 + y2) / 2 + 80} ${x2} ${y2}`} stroke="#8aa8bc" strokeWidth={26} fill="none" opacity={0.7} />
        ))}
        <path d="M 0 140 Q 520 230 1080 120" stroke="#c8dce8" strokeWidth={4} strokeDasharray="14 10" fill="none" />
        {new Array(40).fill(0).map((_, i) => <circle key={i} cx={(i * 211) % 1080} cy={(i * 383) % 1920} r={1.6} fill="#8aa8bc" opacity={0.6} />)}
        <g transform={`translate(${tx} ${ty}) translate(540 1100) scale(${z}) translate(-540 -1100)`}>
          {/* elin gölgesi (kumaşa düşer) */}
          <path d="M 300 1180 Q 260 1500 360 1920 L 760 1920 Q 860 1500 840 1150 Z" fill="#6a889c" opacity={0.35} transform="translate(26 30)" filter="url(#mp_sur)" />
          {/* bilek ve avuç */}
          <path d="M 360 1920 L 372 1640 Q 300 1450 300 1200 Q 300 1080 380 1060 L 760 1050 Q 840 1080 845 1200 Q 850 1420 745 1640 L 735 1920 Z" fill={skin} stroke="#5a3a2a" strokeWidth={6} />
          {/* parmaklar: soldan serçe → işaret; başparmak sağda */}
          <Parmak x={372} y={1110} len={300} w={92} ang={-13} skin={skin} id="serce" />
          <Parmak x={478} y={1050} len={385} w={102} ang={-5} skin={skin} id="yuzuk" />
          <Parmak x={592} y={1035} len={425} w={108} ang={1} skin={skin} id="orta">
            {/* orta parmağın yan yüzünde ince mürekkep izi */}
            <path d={`M ${50} ${-340} Q 56 -270 52 -200`} stroke={MUREKKEP} strokeWidth={9} strokeLinecap="round" opacity={0.85} filter="url(#mp_kenar)" />
          </Parmak>
          <Parmak x={706} y={1065} len={380} w={104} ang={8} skin={skin} id="isaret">
            {/* işaret parmağının ucu: yoğun, tırtıklı leke + tırnak altı */}
            <g filter="url(#mp_kenar)">
              <path d="M -36 -340 Q -44 -372 -10 -386 Q 26 -392 38 -360 Q 46 -330 26 -312 Q 6 -296 -18 -306 Q -34 -316 -36 -340 Z" fill={MUREKKEP} opacity={0.92} />
              <circle cx={-34} cy={-300} r={7} fill={MUREKKEP} opacity={0.8} />
              <circle cx={30} cy={-296} r={5} fill={MUREKKEP} opacity={0.7} />
            </g>
            <path d="M -30 -378 Q 0 -392 30 -378" stroke={MUREKKEP} strokeWidth={5} fill="none" opacity={0.9} />
          </Parmak>
          {/* başparmak */}
          <g transform="translate(812 1330) rotate(52)">
            <rect x={-62} y={-300} width={124} height={340} rx={62} fill={skin} stroke="#5a3a2a" strokeWidth={6} />
            <path d="M -38 -150 q 38 12 76 0" stroke="#d39f7c" strokeWidth={4} fill="none" />
            <ellipse cx={0} cy={-236} rx={36} ry={44} fill="#f6d2b2" opacity={0.7} />
          </g>
          {/* avuç çizgileri */}
          <path d="M 330 1230 Q 520 1190 760 1150" stroke="#d39f7c" strokeWidth={6} fill="none" />
          <path d="M 340 1330 Q 520 1300 700 1250" stroke="#d39f7c" strokeWidth={5} fill="none" />
          <path d="M 720 1190 Q 610 1380 640 1600" stroke="#d39f7c" strokeWidth={6} fill="none" />
          {/* serçe parmak tarafından bileğe sürtülmüş mürekkep şeridi */}
          <path d="M 318 1170 Q 300 1380 352 1600" stroke={MUREKKEP} strokeWidth={44} fill="none" opacity={0.42} filter="url(#mp_sur)" strokeLinecap="round" />
          <path d="M 318 1190 Q 306 1330 330 1460" stroke={MUREKKEP} strokeWidth={10} fill="none" opacity={0.55} strokeLinecap="round" />
          {/* bileklik: beyaz plastik, yarı silik barkod */}
          <rect x={352} y={1690} width={406} height={92} rx={16} fill="#f4f4f0" stroke="#6a6a66" strokeWidth={5} />
          {new Array(22).fill(0).map((_, i) => <rect key={i} x={392 + i * 11} y={1708} width={i % 3 ? 4 : 7} height={40} fill="#3a3a3a" opacity={0.25 + (i % 4) * 0.08} />)}
          <text x={660} y={1754} fontFamily={MONO} fontWeight={700} fontSize={28} fill="#5a5a5a" opacity={0.6}>ODA 7</text>
        </g>
        {/* pencereden ışık + elin üstünden geçen parmaklık gölgesi */}
        <rect width={1080} height={1920} fill="url(#mp_isik)" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-200 + i * 300} 0 L ${200 + i * 300} 1920`} stroke="#203040" strokeWidth={46} opacity={0.12} />)}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------------------------------------
 * Nalan'ın göğüs cebi: beyaz forma, cepte kapağı olmayan lacivert mürekkepli kalem. Cebin kenarında küçük bir
 * mürekkep lekesi (hemşire için doğal da olabilir, iz de). Yavaş yaklaşma, hafif nefes hareketi.
 * ------------------------------------------------------------------------------------------- */
const KalemCep: React.FC<{ dur: number }> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = interpolate(f, [0, 1.6 * fps], [1.0, 1.08], clamp);
  const nefes = Math.sin(f / 14) * 4;
  return (
    <AbsoluteFill style={{ backgroundColor: "#e8e8e2", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="kc_isik" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity={0.35} /><stop offset="1" stopColor="#7a8a9a" stopOpacity={0.3} /></linearGradient>
          <filter id="kc_kenar"><feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" seed="9" /><feDisplacementMap in="SourceGraphic" scale="8" /></filter>
        </defs>
        <g transform={`translate(540 960) scale(${z}) translate(-540 ${-960 + nefes})`}>
          {/* forma kumaşı ve kıvrımlar */}
          <rect x={-100} y={-100} width={1280} height={2120} fill="#f4f4f0" />
          {[[60, 0, 200, 1920], [880, 0, 760, 1920], [0, 1500, 1080, 1620]].map(([a, b, c, d], i) => <path key={i} d={`M ${a} ${b} Q ${(a + c) / 2 + 60} ${(b + d) / 2} ${c} ${d}`} stroke="#d8d8d2" strokeWidth={30} fill="none" />)}
          {/* yaka ve düğme hattı */}
          <path d="M 260 -40 L 540 420 L 820 -40" stroke="#c8c8c2" strokeWidth={14} fill="none" />
          {[560, 900, 1240, 1580].map((y) => <circle key={y} cx={540} cy={y} r={20} fill="#ffffff" stroke="#9a9a94" strokeWidth={4} />)}
          {/* göğüs cebi (sol göğüs = ekranın sağı) */}
          <path d="M 600 820 L 960 820 L 950 1260 Q 780 1290 610 1260 Z" fill="#efefea" stroke="#a8a8a2" strokeWidth={6} />
          <path d="M 612 850 H 948" stroke="#b8b8b2" strokeWidth={4} strokeDasharray="12 9" />
          <path d="M 620 1240 Q 780 1270 940 1240" stroke="#b8b8b2" strokeWidth={4} strokeDasharray="12 9" fill="none" />
          {/* kalem: lacivert gövde, metal klips, kapağı yok, ucu dışarıda; mürekkep ucu */}
          <g transform="rotate(-4 800 760)">
            <rect x={770} y={560} width={56} height={560} rx={26} fill="#1c2e6a" stroke="#0a1230" strokeWidth={5} />
            <rect x={778} y={570} width={14} height={520} rx={7} fill="#4a5e9a" opacity={0.6} />
            <path d="M 770 560 L 798 470 L 826 560 Z" fill="#c8ccd0" stroke="#6a6e72" strokeWidth={4} />
            <path d="M 798 470 L 798 440" stroke="#2a2e32" strokeWidth={6} strokeLinecap="round" />
            <circle cx={798} cy={438} r={5} fill={MUREKKEP} />
            <rect x={818} y={600} width={14} height={300} rx={6} fill="#d8dce0" stroke="#7a7e82" strokeWidth={3} />
          </g>
          {/* cebin kenarında küçük lacivert leke */}
          <g filter="url(#kc_kenar)">
            <ellipse cx={720} cy={836} rx={16} ry={11} fill={MUREKKEP} opacity={0.55} />
            <circle cx={742} cy={850} r={5} fill={MUREKKEP} opacity={0.45} />
          </g>
          {/* yaka kartı (sol) */}
          <rect x={170} y={860} width={300} height={170} rx={14} fill="#ffffff" stroke="#8a8a86" strokeWidth={5} />
          <rect x={170} y={860} width={300} height={46} rx={12} fill="#3a7aa8" />
          <text x={320} y={893} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={26} fill="#fff">HEMŞİRE</text>
          <text x={320} y={980} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={54} fill="#1a1a1a">NALAN</text>
        </g>
        <rect width={1080} height={1920} fill="url(#kc_isik)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 62% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Insert6: React.FC<{ kind: Insert6Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "tablet_video": return <TabletVideo dur={dur} text={text} />;
    case "murekkep_parmak": return <MurekkepParmak dur={dur} />;
    case "kalem_cep": return <KalemCep dur={dur} />;
    default: return null;
  }
};
