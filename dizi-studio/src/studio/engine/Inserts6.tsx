/* Deli Değilim · Bölüm 2 ekleme çekimleri: tablet videosu (güvenlik kamerası), mürekkepli parmaklar, Nalan'ın cebindeki kalem.
 * Tam ekran 1080x1920, kendi çizimimiz. Mürekkep rengi dizi boyunca sabit: #10204a (Bölüm 1'deki TV imzası ve flas_imza ile aynı). */
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MONO = "'Courier New', monospace";
const MUREKKEP = "#10204a";

export type Insert6Kind = "tablet_video" | "murekkep_parmak" | "kalem_cep" | "hap_uc" | "avuc_iki" | "foto_sofor" | "yuzuk_izi";
export const INSERT6_KINDS: Insert6Kind[] = ["tablet_video", "murekkep_parmak", "kalem_cep", "hap_uc", "avuc_iki", "foto_sofor", "yuzuk_izi"];

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

/* ---------------------------------------------------------------------------------------------
 * Üç hap: Bölüm 1'deki tepsi ve kâğıt kap birebir; beyaz yuvarlak + yarısı mavi kapsül + YENİ üçüncü hap:
 * küçük, tebeşir gibi mat açık mavi (#8fc1ea), kenarı hafif tozlu (ağızda eriyen tablet). Hafif yaklaşma.
 * ------------------------------------------------------------------------------------------- */
const OUTL = "#1b1412";
const HapUc: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1, 1.1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#9aa4a8" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "52% 56%" }}>
        <defs>
          <radialGradient id="h3-vig" cx="0.5" cy="0.55" r="0.7"><stop offset="0.5" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.6" /></radialGradient>
          <radialGradient id="h3-toz" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor="#bfe0f8" /><stop offset="1" stopColor="#7fb4e0" /></radialGradient>
          <filter id="h3-gren"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="3" /><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.25 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
        </defs>
        {/* metal tepsi (B1 ile aynı) */}
        <rect x={-40} y={700} width={1160} height={700} rx={40} fill="#c4ccd2" stroke={OUTL} strokeWidth={10} />
        <rect x={0} y={740} width={1080} height={620} rx={30} fill="#b4bcc2" />
        <path d="M 60 760 L 1020 760" stroke="#dfe5ea" strokeWidth={6} opacity={0.7} />
        {/* su bardağı (köşede, plastik) */}
        <ellipse cx={890} cy={860} rx={110} ry={46} fill="#e8f2f6" stroke={OUTL} strokeWidth={6} opacity={0.9} />
        <ellipse cx={890} cy={866} rx={92} ry={36} fill="#cfe4ee" />
        <path d="M 820 856 q 30 -14 60 -4" stroke="#ffffff" strokeWidth={6} fill="none" opacity={0.8} />
        {/* kâğıt hap kabı (üstten) */}
        <ellipse cx={540} cy={1040} rx={300} ry={230} fill="#f6f2e8" stroke={OUTL} strokeWidth={10} />
        <ellipse cx={540} cy={1060} rx={250} ry={180} fill="#ebe5d6" />
        {new Array(16).fill(0).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return <path key={i} d={`M ${540 + Math.cos(a) * 250} ${1060 + Math.sin(a) * 180} L ${540 + Math.cos(a) * 300} ${1040 + Math.sin(a) * 230}`} stroke="#d8d0be" strokeWidth={6} />;
        })}
        {/* beyaz yuvarlak hap */}
        <ellipse cx={420} cy={1090} rx={78} ry={62} fill="#fbfbf8" stroke={OUTL} strokeWidth={8} />
        <path d="M 360 1090 H 480" stroke="#c8c8c0" strokeWidth={6} />
        {/* yarısı mavi kapsül */}
        <g transform="rotate(-28 640 1060)">
          <rect x={560} y={1020} width={90} height={80} rx={40} fill="#fbfbf8" stroke={OUTL} strokeWidth={8} />
          <rect x={640} y={1020} width={90} height={80} rx={40} fill="#3f86d6" stroke={OUTL} strokeWidth={8} />
          <rect x={630} y={1024} width={20} height={72} fill="#3f86d6" />
          <rect x={590} y={1034} width={40} height={10} rx={5} fill="#ffffff" opacity={0.7} />
        </g>
        {/* YENİ: üçüncü hap, küçük, mat, tebeşir gibi açık mavi; kenarında toz */}
        <ellipse cx={548} cy={958} rx={50} ry={40} fill="url(#h3-toz)" stroke={OUTL} strokeWidth={7} />
        <ellipse cx={548} cy={958} rx={50} ry={40} fill="#ffffff" filter="url(#h3-gren)" />
        <ellipse cx={536} cy={948} rx={18} ry={9} fill="#ffffff" opacity={0.35} />
        {[[598, 990], [606, 972], [500, 994], [588, 1004]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3 + (i % 2)} fill="#a8d0f0" opacity={0.8} />)}
        <rect width={1080} height={1920} fill="url(#h3-vig)" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------------------------------------
 * Avuçta iki hap: Berkay'ın sağ eli (dünkü lacivert mürekkep işaret parmağı ucunda solmuş hâlde), terli avuçta
 * beyaz yuvarlak hap + yarısı mavi kapsül; üçüncünün yerinde açık mavi, macunlaşmış leke (terle erimiş).
 * 1.3 sn'de sol işaret parmağı yukarıdan girer, lekeye dokunur; parmak ucunda macun kalır.
 * ------------------------------------------------------------------------------------------- */
const AvucIki: React.FC<{ dur: number }> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const blur = interpolate(t, [0, 0.4], [6, 0], clamp);
  const tx = Math.sin(f / 5) * 2.5;
  const ty = Math.cos(f / 6.3) * 2;
  const pIn = interpolate(t, [1.3, 1.9], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const skin = "#f1c6a0";
  return (
    <AbsoluteFill style={{ backgroundColor: "#a9c4d6", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, filter: `blur(${blur.toFixed(1)}px)` }}>
        <defs>
          <linearGradient id="ai_isik" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity={0.22} /><stop offset="0.6" stopColor="#ffffff" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.25} /></linearGradient>
          <filter id="ai_sur"><feGaussianBlur stdDeviation="8" /></filter>
          <filter id="ai_kenar"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="10" /></filter>
        </defs>
        {/* pijama kumaşı */}
        <rect width={1080} height={1920} fill="#a9c4d6" />
        {[[-40, 380, 1120, 560], [-60, 1350, 1140, 1560]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M ${x1} ${y1} Q 540 ${(y1 + y2) / 2 + 80} ${x2} ${y2}`} stroke="#8aa8bc" strokeWidth={26} fill="none" opacity={0.7} />)}
        <g transform={`translate(${tx} ${ty - 170})`}>
          {/* elin gölgesi */}
          <path d="M 300 1180 Q 260 1500 360 1920 L 760 1920 Q 860 1500 840 1150 Z" fill="#6a889c" opacity={0.35} transform="translate(26 30)" filter="url(#ai_sur)" />
          {/* avuç + bilek */}
          <path d="M 360 1920 L 372 1640 Q 300 1450 300 1200 Q 300 1080 380 1060 L 760 1050 Q 840 1080 845 1200 Q 850 1420 745 1640 L 735 1920 Z" fill={skin} stroke="#5a3a2a" strokeWidth={6} />
          {/* parmaklar hafif kıvrık (avuç çukur tutuluyor) */}
          <Parmak x={372} y={1110} len={250} w={92} ang={-6} skin={skin} id="s" />
          <Parmak x={478} y={1050} len={320} w={102} ang={-2} skin={skin} id="y" />
          <Parmak x={592} y={1035} len={350} w={108} ang={2} skin={skin} id="o" />
          <Parmak x={706} y={1065} len={320} w={104} ang={6} skin={skin} id="i">
            {/* dünkü mürekkep: solmuş, tırnak dibinde kalmış */}
            <path d="M -32 -282 Q -36 -306 -6 -316 Q 24 -320 34 -296 Q 36 -276 18 -268 Q -4 -260 -24 -270 Z" fill={MUREKKEP} opacity={0.45} filter="url(#ai_kenar)" />
          </Parmak>
          <g transform="translate(812 1330) rotate(40)">
            <rect x={-62} y={-280} width={124} height={320} rx={62} fill={skin} stroke="#5a3a2a" strokeWidth={6} />
          </g>
          {/* avuç çukuru gölgesi + ter parlaması */}
          <ellipse cx={560} cy={1270} rx={190} ry={120} fill="#d8a888" opacity={0.45} />
          <ellipse cx={560} cy={1290} rx={150} ry={80} fill="#fff4e8" opacity={0.14} />
          {/* üçüncü hapın yerinde: terle erimiş, macunlaşmış açık mavi leke ve izi */}
          <g filter="url(#ai_kenar)">
            <path d="M 600 1338 Q 590 1310 626 1302 Q 666 1298 684 1322 Q 692 1350 664 1362 Q 628 1372 606 1358 Z" fill="#8fc1ea" opacity={0.9} />
            <path d="M 612 1330 Q 640 1318 668 1328" stroke="#c8e2f6" strokeWidth={5} fill="none" opacity={0.8} />
            <circle cx={700} cy={1344} r={7} fill="#8fc1ea" opacity={0.7} />
            <circle cx={590} cy={1370} r={5} fill="#8fc1ea" opacity={0.6} />
          </g>
          {/* iki hap: ıslak parıltı ve damlalar */}
          <ellipse cx={500} cy={1290} rx={62} ry={50} fill="#f6f6f2" stroke={OUTL} strokeWidth={6} />
          <path d="M 452 1290 H 548" stroke="#c8c8c0" strokeWidth={5} />
          <path d="M 470 1262 q 20 -10 44 -2" stroke="#ffffff" strokeWidth={7} fill="none" />
          <g transform="rotate(-24 640 1250)">
            <rect x={572} y={1218} width={72} height={64} rx={32} fill="#f6f6f2" stroke={OUTL} strokeWidth={6} />
            <rect x={636} y={1218} width={72} height={64} rx={32} fill="#3a7ec8" stroke={OUTL} strokeWidth={6} />
            <rect x={628} y={1222} width={16} height={56} fill="#3a7ec8" />
            <rect x={596} y={1230} width={34} height={8} rx={4} fill="#ffffff" opacity={0.8} />
            <rect x={660} y={1230} width={30} height={8} rx={4} fill="#ffffff" opacity={0.5} />
          </g>
          {[[440, 1340, 4], [530, 1236, 3]].map(([x, y, r], i) => (
            <g key={i}><circle cx={x} cy={y} r={r} fill="#e8f4ff" opacity={0.8} /><circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#ffffff" /></g>
          ))}
          {/* bileklik */}
          <rect x={352} y={1690} width={406} height={92} rx={16} fill="#f4f4f0" stroke="#6a6a66" strokeWidth={5} />
          {new Array(22).fill(0).map((_, i) => <rect key={i} x={392 + i * 11} y={1708} width={i % 3 ? 4 : 7} height={40} fill="#3a3a3a" opacity={0.25 + (i % 4) * 0.08} />)}
        </g>
        {/* sol işaret parmağı yukarıdan girer: ucunda erimiş hapın açık mavi macunu */}
        <g transform={`translate(${900 - 216 * pIn} ${-500 + 1577 * pIn}) rotate(205) scale(1.35)`} opacity={pIn > 0 ? 1 : 0}>
          <rect x={-55} y={-60} width={110} height={520} rx={55} fill={skin} stroke="#5a3a2a" strokeWidth={6} />
          <path d="M -30 -10 q 30 12 60 0" stroke="#d39f7c" strokeWidth={4} fill="none" />
          <g filter="url(#ai_kenar)" opacity={pIn > 0.97 ? 1 : 0}>
            <path d="M -40 -40 Q -48 -70 -10 -76 Q 30 -78 42 -48 Q 46 -24 22 -16 Q -6 -8 -30 -18 Z" fill="#8fc1ea" opacity={0.95} />
            <circle cx={-34} cy={-6} r={8} fill="#8fc1ea" opacity={0.8} />
          </g>
          <path d="M -24 -58 q 14 -8 30 -2" stroke="#ffffff" strokeWidth={5} fill="none" opacity={0.8} />
        </g>
        <rect width={1080} height={1920} fill="url(#ai_isik)" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-200 + i * 300} 0 L ${200 + i * 300} 1920`} stroke="#203040" strokeWidth={46} opacity={0.1} />)}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------------------------------------
 * Fotoğraf: Zeynep'in parmakları arasında, kenarları hafif kıvrılmış, beyaz çerçeveli baskı. Gün ışığında plaza önü,
 * siyah makam arabası; Berkay koyu şoför takımı ve kasketiyle arka kapıyı tutuyor, kibar gülümsüyor (kameraya değil,
 * arabaya bakıyor). Arka camda takım elbiseli bir silüet (yüz seçilmez). Köşede eski makine tarih damgası.
 * Renkler hafif soluk ve sıcak (eski baskı). Yavaş yaklaşma + el titremesi.
 * ------------------------------------------------------------------------------------------- */
const FotoSofor: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1, 1.12], clamp);
  const jx = Math.sin(f / 6) * 2, jy = Math.cos(f / 7.5) * 1.6;
  const base = castById("berkay_hasta");
  const sofor = { ...base, outfit: { type: "suit" as const, top: "#1c1e24", topShade: "#121418", bottom: "#1c1e24", shoes: "#0e0e10", accent: "#f2f2ee" } };
  const S = 560; // fotoğraf içinde Berkay'ın boyu
  const bx = 640, by = 1370; // ayak noktası (fotoğraf koordinatı = ekran)
  const top = by - 0.98 * S;
  return (
    <AbsoluteFill style={{ backgroundColor: "#3a3836", overflow: "hidden" }}>
      {/* odanın bulanık arka planı */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #6a706c 0%, #3a3e3c 60%, #1a1c1c 100%)" }} />
      <AbsoluteFill style={{ transform: `translate(${jx}px, ${jy - 190}px) scale(${z}) rotate(-3deg)`, transformOrigin: "50% 52%" }}>
        {/* baskı: beyaz çerçeve + gölge */}
        <div style={{ position: "absolute", left: 120, top: 520, width: 840, height: 1040, backgroundColor: "#f4f0e6", boxShadow: "0 24px 60px rgba(0,0,0,0.55)", borderRadius: 4 }} />
        {/* resim alanı */}
        <div style={{ position: "absolute", left: 160, top: 560, width: 760, height: 900, overflow: "hidden", filter: "sepia(0.28) saturate(0.85) contrast(0.95) brightness(1.04)" }}>
          <svg viewBox="160 560 760 900" width={760} height={900} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <linearGradient id="fs_gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9cc4e8" /><stop offset="1" stopColor="#dfe9f2" /></linearGradient>
              <linearGradient id="fs_cam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3a4a5a" /><stop offset="1" stopColor="#141a22" /></linearGradient>
              <linearGradient id="fs_govde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2c32" /><stop offset="1" stopColor="#0c0d10" /></linearGradient>
            </defs>
            {/* gökyüzü + cam plaza */}
            <rect x={160} y={560} width={760} height={900} fill="url(#fs_gok)" />
            <rect x={160} y={560} width={760} height={520} fill="#8aa4bc" />
            {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${180 + i * 86} 560 V 1080`} stroke="#6a849c" strokeWidth={5} />)}
            {new Array(7).fill(0).map((_, i) => <path key={i} d={`M 160 ${600 + i * 70} H 920`} stroke="#6a849c" strokeWidth={4} />)}
            <path d="M 160 560 L 520 560 L 160 960 Z" fill="#ffffff" opacity={0.14} />
            {/* giriş saçağı ve kaldırım */}
            <rect x={160} y={1060} width={760} height={30} fill="#5a646c" />
            <rect x={160} y={1090} width={760} height={370} fill="#b8b2a6" />
            {new Array(8).fill(0).map((_, i) => <path key={i} d={`M ${160 + i * 110} 1090 L ${120 + i * 130} 1460`} stroke="#a29c90" strokeWidth={3} />)}
            {/* siyah makam arabası (yandan, sağa bakar), arka kapı açık */}
            <path d="M 170 1300 Q 180 1200 290 1180 L 420 1110 Q 520 1090 640 1110 L 760 1180 Q 880 1200 900 1290 L 900 1340 L 170 1340 Z" fill="url(#fs_govde)" stroke="#060608" strokeWidth={5} />
            <path d="M 440 1120 Q 530 1104 630 1120 L 700 1176 L 400 1176 Z" fill="url(#fs_cam)" />
            {/* arka camdaki silüet: takım elbiseli adam, yüz seçilmez */}
            <path d="M 470 1176 L 470 1146 Q 474 1128 492 1128 Q 512 1128 514 1146 L 516 1176 Z" fill="#06080a" opacity={0.85} />
            <path d="M 452 1176 Q 470 1150 492 1158 Q 516 1150 534 1176 Z" fill="#06080a" opacity={0.85} />
            <path d="M 450 1124 L 520 1176" stroke="#ffffff" strokeWidth={6} opacity={0.12} />
            <path d="M 290 1182 L 420 1116 L 430 1176 Z" fill="url(#fs_cam)" />
            <circle cx={300} cy={1342} r={56} fill="#0a0a0c" stroke="#3a3a3e" strokeWidth={8} />
            <circle cx={300} cy={1342} r={24} fill="#7a7c80" />
            <circle cx={780} cy={1342} r={56} fill="#0a0a0c" stroke="#3a3a3e" strokeWidth={8} />
            <circle cx={780} cy={1342} r={24} fill="#7a7c80" />
            <path d="M 180 1250 H 890" stroke="#4a4c52" strokeWidth={3} />
            <path d="M 600 1180 Q 640 1150 700 1200" stroke="#ffffff" strokeWidth={5} opacity={0.25} fill="none" />
            {/* açık arka kapı (Berkay tutuyor) */}
            <path d="M 700 1180 L 760 1150 L 770 1300 L 708 1330 Z" fill="#141518" stroke="#060608" strokeWidth={4} />
          </svg>
          {/* Berkay (şoför takımı) */}
          <div style={{ position: "absolute", left: bx - 160 - S * 0.2, top: top - 560 }}>
            <Character look={sofor} size={S} pose={{ emotion: "mutlu", gesture: "rest", armR: { upper: 40, fore: -40, ul: 0.9 }, yaw: 0.45, lookX: 0.7, seed: 3 }} />
          </div>
          {/* şoför kasketi (başın üstünde) */}
          <svg viewBox="160 560 760 900" width={760} height={900} style={{ position: "absolute", left: 0, top: 0 }}>
            {(() => {
              const hx = bx + 4, hy = top + 0.07 * S;
              return (
                <g>
                  <path d={`M ${hx - 66} ${hy + 18} Q ${hx - 70} ${hy - 30} ${hx} ${hy - 34} Q ${hx + 70} ${hy - 30} ${hx + 70} ${hy + 18} Z`} fill="#16181c" stroke="#060608" strokeWidth={4} />
                  <rect x={hx - 68} y={hy + 10} width={138} height={16} rx={6} fill="#26282e" stroke="#060608" strokeWidth={3} />
                  <path d={`M ${hx - 60} ${hy + 26} Q ${hx + 10} ${hy + 46} ${hx + 84} ${hy + 30}`} fill="#0a0a0c" stroke="#060608" strokeWidth={3} />
                  <rect x={hx - 10} y={hy - 6} width={20} height={12} rx={3} fill="#c8a860" />
                </g>
              );
            })()}
          </svg>
          {/* eski makine tarih damgası */}
          <div style={{ position: "absolute", right: 22, bottom: 18, fontFamily: MONO, fontWeight: 700, fontSize: 40, color: "#ff8a3a", textShadow: "0 0 6px rgba(255,120,40,0.6)", opacity: 0.9 }}>'19 6 14</div>
          {/* baskı dokusu: hafif gren + köşe solması */}
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(60,40,20,0.25) 100%)" }} />
        </div>
        {/* kıvrık köşe ve kırışık çizgisi */}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M 120 1480 L 210 1560 L 120 1560 Z" fill="#d8d2c4" />
          <path d="M 300 520 Q 420 900 380 1560" stroke="#ffffff" strokeWidth={3} opacity={0.3} fill="none" />
          {/* Zeynep'in parmakları: sol alt ve sağ üst köşede baskıyı tutar */}
          <g>
            <rect x={60} y={1380} width={150} height={70} rx={35} fill="#f2cdb0" stroke="#5a3a2a" strokeWidth={4} transform="rotate(-20 135 1415)" />
            <ellipse cx={176} cy={1396} rx={22} ry={16} fill="#f8e0cc" stroke="#c89a80" strokeWidth={2} transform="rotate(-20 176 1396)" />
            <rect x={880} y={520} width={150} height={66} rx={33} fill="#f2cdb0" stroke="#5a3a2a" strokeWidth={4} transform="rotate(25 955 553)" />
            <ellipse cx={912} cy={540} rx={22} ry={15} fill="#f8e0cc" stroke="#c89a80" strokeWidth={2} transform="rotate(25 912 540)" />
          </g>
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------------------------------------
 * Yüzük izi: Berkay'ın sol eli, elin üstü (tırnaklar görünür), pijamalı dizin üstünde. Yüzük parmağının dibinde
 * ince, keskin kenarlı solgun halka (güneş görmemiş deri) ve hafif çökük iz. Yüzük yok. Yavaş yaklaşma, odak netleşir.
 * ------------------------------------------------------------------------------------------- */
const YuzukIzi: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const zeynep = text?.[0] === "zeynep";
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blur = interpolate(f, [0, 0.5 * fps], [6, 0], clamp);
  const z = interpolate(f, [0, dur], [1.0, 1.18], clamp);
  const tx = Math.sin(f / 5) * 1.8, ty = Math.cos(f / 6.4) * 1.4;
  const skin = zeynep ? "#f2cdb0" : "#e8b892";
  const ws = zeynep ? 0.8 : 1;
  const finger = (x: number, y: number, len: number, w0: number, ang: number, key: string, ring?: boolean) => { const w = w0 * ws; return (
    <g key={key} transform={`translate(${x} ${y}) rotate(${ang})`}>
      <rect x={-w / 2} y={-len} width={w} height={len + 40} rx={w / 2} fill={skin} stroke="#5a3a2a" strokeWidth={5} />
      {/* tırnak */}
      <path d={`M ${-w * 0.32} ${-len + w * 0.75} Q ${-w * 0.34} ${-len + w * 0.12} 0 ${-len + w * 0.08} Q ${w * 0.34} ${-len + w * 0.12} ${w * 0.32} ${-len + w * 0.75} Z`} fill={zeynep ? "#a82a36" : "#f2d4c0"} stroke={zeynep ? "#6a141c" : "#b88a70"} strokeWidth={3} />
      <path d={`M ${-w * 0.24} ${-len + w * 0.3} Q 0 ${-len + w * 0.22} ${w * 0.24} ${-len + w * 0.3}`} stroke="#ffffff" strokeWidth={3} opacity={0.6} fill="none" />
      {/* eklem kırışıkları (elin üstü) */}
      {[0.38, 0.66].map((k) => <path key={k} d={`M ${-w * 0.22} ${-len * k} q ${w * 0.22} ${-6} ${w * 0.44} 0`} stroke="#c8946e" strokeWidth={3} fill="none" />)}
      {ring ? (
        <g>
          {/* solgun halka: keskin kenarlı, hafif çökük */}
          <rect x={-w / 2 + 3} y={-len * 0.2} width={w - 6} height={26} fill="#f8e2cc" />
          <path d={`M ${-w / 2 + 3} ${-len * 0.2} H ${w / 2 - 3}`} stroke="#c8946e" strokeWidth={2.5} />
          <path d={`M ${-w / 2 + 3} ${-len * 0.2 + 26} H ${w / 2 - 3}`} stroke="#c8946e" strokeWidth={2.5} />
          <path d={`M ${-w / 2 + 8} ${-len * 0.2 + 13} H ${w / 2 - 8}`} stroke="#e8c8ae" strokeWidth={3} opacity={0.7} />
        </g>
      ) : null}
    </g>
  ); };
  return (
    <AbsoluteFill style={{ backgroundColor: zeynep ? "#c8b49a" : "#a9c4d6", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, filter: `blur(${blur.toFixed(1)}px)` }}>
        <defs>
          <linearGradient id="yi_isik" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity={0.22} /><stop offset="0.6" stopColor="#ffffff" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.28} /></linearGradient>
          <filter id="yi_sur"><feGaussianBlur stdDeviation="9" /></filter>
        </defs>
        <rect width={1080} height={1920} fill={zeynep ? "#c8b49a" : "#a9c4d6"} />
        {[[-40, 300, 1120, 520], [-60, 1400, 1140, 1600]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M ${x1} ${y1} Q 540 ${(y1 + y2) / 2 + 80} ${x2} ${y2}`} stroke={zeynep ? "#a8947a" : "#8aa8bc"} strokeWidth={26} fill="none" opacity={0.7} />)}
        <g transform={`translate(${tx} ${ty}) translate(560 1050) scale(${-z} ${z}) translate(-560 -1050)`}>
          {/* gölge */}
          <path d="M 300 1180 Q 260 1500 360 1920 L 760 1920 Q 860 1500 840 1150 Z" fill="#6a889c" opacity={0.35} transform="translate(24 30)" filter="url(#yi_sur)" />
          {/* elin üstü + bilek (sol el: başparmak solda) */}
          <path d="M 360 1920 L 372 1640 Q 300 1450 300 1200 Q 300 1080 380 1060 L 760 1050 Q 840 1080 845 1200 Q 850 1420 745 1640 L 735 1920 Z" fill={skin} stroke="#5a3a2a" strokeWidth={6} />
          {/* el üstü damarlar ve kemik çıkıntıları */}
          <path d="M 470 1500 Q 500 1350 470 1180 M 600 1520 Q 620 1360 590 1170" stroke="#c8946e" strokeWidth={4} fill="none" opacity={0.6} />
          {[420, 520, 620, 720].map((x) => <ellipse key={x} cx={x} cy={1100} rx={26} ry={14} fill="#f2ccaa" opacity={0.7} />)}
          {/* başparmak (solda) */}
          <g transform="translate(300 1330) rotate(-48)">
            <rect x={-60} y={-290} width={120} height={330} rx={60} fill={skin} stroke="#5a3a2a" strokeWidth={6} />
            <path d="M -30 -270 Q -32 -296 0 -300 Q 32 -296 30 -270 L 28 -226 Q 0 -218 -28 -226 Z" fill="#f2d4c0" stroke="#b88a70" strokeWidth={3} />
          </g>
          {finger(420, 1080, 380, 102, -8, "isaret")}
          {finger(535, 1060, 420, 106, -2, "orta")}
          {finger(650, 1068, 390, 102, 4, "yuzuk", !zeynep)}
          {finger(756, 1104, 300, 90, 11, "serce")}
          {zeynep ? (
            <g>
              {/* trençkot kolu (deve tüyü) ve işaret parmağında gözyaşı damlası */}
              <path d="M 330 1720 L 780 1700 L 800 1920 L 320 1920 Z" fill="#b8865a" stroke="#5a3a20" strokeWidth={6} />
              <path d="M 330 1720 L 780 1700" stroke="#9a6c44" strokeWidth={14} />
              <path d="M 404 820 q -12 22 0 34 q 12 -12 0 -34 z" fill="#e8f4ff" stroke="#9ac0dc" strokeWidth={2} />
              <circle cx={400} cy={846} r={3} fill="#ffffff" />
            </g>
          ) : null}
          {/* bileklik (sol bilekte değil; çıplak bilek) */}
        </g>
        <rect width={1080} height={1920} fill="url(#yi_isik)" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-200 + i * 300} 0 L ${200 + i * 300} 1920`} stroke="#203040" strokeWidth={46} opacity={0.1} />)}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 52% 42%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Insert6: React.FC<{ kind: Insert6Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "tablet_video": return <TabletVideo dur={dur} text={text} />;
    case "murekkep_parmak": return <MurekkepParmak dur={dur} />;
    case "kalem_cep": return <KalemCep dur={dur} />;
    case "hap_uc": return <HapUc dur={dur} />;
    case "avuc_iki": return <AvucIki dur={dur} />;
    case "foto_sofor": return <FotoSofor dur={dur} />;
    case "yuzuk_izi": return <YuzukIzi dur={dur} text={text} />;
    default: return null;
  }
};
