/* 7/24 Bölüm 2 eklemeleri: on_kamera (Ece'nin gözünden telefonun ön kamerası + Sabri'nin bildirimi), raf_duzen (sigara rafını düzenleyen eller). */
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const O = "#1a1412";
const SANS = "Inter, Arial, sans-serif";
const TEN = "#f0c8a8", TEN2 = "#dcac88", KAZAK = "#c8902a", KAZAK2 = "#a8741a";

export type Insert8Kind = "on_kamera" | "raf_duzen" | "depo_kolu" | "depo_el";
export const INSERT8_KINDS: Insert8Kind[] = ["on_kamera", "raf_duzen", "depo_kolu", "depo_el"];

/** Ece'nin gözünden: iki elinde telefon, ön kamerada kendi yüzü (ayna görüntüsü), sağ yanakta sivilce.
 *  text[0]: bildirimin düştüğü saniye ("Sabri Abi · Kuralları unutma"). text[1]: konuşma bitişi (sn). */
const OnKamera: React.FC<{ dur: number; text?: string[] }> = ({ dur, text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const bAt = Number(text?.[0] ?? 1.4);
  const konusSon = Math.round(Number(text?.[1] ?? 1.8) * fps);
  const bil = interpolate(t, [bAt, bAt + 0.35], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 3 });
  const titre = Math.sin(f / 9) * 4 + Math.sin(f / 23) * 3; // el titremesi
  const z = interpolate(f, [0, dur], [1, 1.05], clamp);
  const px = 170, py = 230, pw = 740, ph = 1460;
  const konus: [number, number][] = new Array(20).fill(0).map((_, k) => [6 + k * 9, Math.min(konusSon, 6 + k * 9 + 6)] as [number, number]).filter(([a]) => a < konusSon);
  const S = 2300;
  return (
    <AbsoluteFill style={{ backgroundColor: "#cfd6dc", overflow: "hidden" }}>
      {/* arka plan: kasa arkasındaki raflar, tavan ışıkları (bulanık) */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(12px)" }}>
        <rect width={1080} height={1920} fill="#d8dee2" />
        {[0, 1, 2, 3, 4, 5].map((r) => new Array(9).fill(0).map((_, i) => <rect key={`${r}-${i}`} x={i * 124} y={200 + r * 250} width={100} height={170} fill={["#c84a3a", "#3a6ac8", "#e8c43a", "#3aa86a", "#a84ac8", "#e8823a"][(i + r) % 6]} opacity={0.75} />))}
        <rect x={0} y={1500} width={1080} height={420} fill="#c8402a" />
      </svg>
      <AbsoluteFill style={{ transform: `translate(${titre}px, ${titre * 0.6}px) scale(${z})`, transformOrigin: "50% 55%" }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {/* telefon gövdesi */}
          <rect x={px - 22} y={py - 22} width={pw + 44} height={ph + 44} rx={86} fill="#202226" stroke={O} strokeWidth={8} />
          <rect x={px} y={py} width={pw} height={ph} rx={70} fill="#e8eef2" />
        </svg>
        {/* ekran: ön kamera görüntüsü (ayna), Ece'nin yüzü */}
        <div style={{ position: "absolute", left: px, top: py, width: pw, height: ph, borderRadius: 70, overflow: "hidden", background: "linear-gradient(180deg, #f4f6f8 0%, #dfe4e8 60%, #c9cfd4 100%)" }}>
          {/* tavan ışıkları (ekranın içinde, arkada) */}
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 80 + i * 230, top: 40, width: 150, height: 26, background: "#ffffff", borderRadius: 8, boxShadow: "0 0 30px #ffffff" }} />)}
          <div style={{ position: "absolute", left: pw / 2 - 0.2 * S, top: 120, transform: "scaleX(-1)" }}>
            <Character look={castById("ece_sivil")} size={S} pose={{ emotion: "igrenmis", lookX: 0, lookY: 0.15, yaw: 0, tilt: -4, seed: 21, talk: konus }} />
          </div>
          {/* kamera arayüzü */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 230, background: "rgba(0,0,0,0.55)" }} />
          <div style={{ position: "absolute", left: pw / 2 - 62, bottom: 60, width: 124, height: 124, borderRadius: 62, border: "10px solid #fff", boxSizing: "border-box" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 200, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#ffd84a", letterSpacing: 3 }}>FOTOĞRAF</div>
          <div style={{ position: "absolute", left: pw / 2 - 70, top: 22, width: 140, height: 40, borderRadius: 20, background: "#000" }} />
          {/* Sabri Abi'nin bildirimi: yukarıdan kayar */}
          {bil > 0 ? (
            <div style={{ position: "absolute", left: 30, right: 30, top: 80 + (bil - 1) * 260, height: 170, borderRadius: 40, background: "rgba(245,245,247,0.97)", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", padding: "0 28px", gap: 24, fontFamily: SANS }}>
              <div style={{ width: 92, height: 92, borderRadius: 24, background: "#25d366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 48 }}>S</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 38, color: "#111" }}><span>Sabri Abi</span><span style={{ fontWeight: 600, fontSize: 28, color: "#888" }}>şimdi</span></div>
                <div style={{ fontWeight: 700, fontSize: 40, color: "#222", marginTop: 6 }}>Kuralları unutma</div>
              </div>
            </div>
          ) : null}
        </div>
        {/* eller: başparmaklar ekran kenarlarında, avuçlar altta */}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {[-1, 1].map((d) => {
            const x = d < 0 ? px - 10 : px + pw + 10;
            return (
              <g key={d}>
                <path d={`M ${x + d * 160} 2100 Q ${x + d * 90} 1760 ${x - d * 10} ${py + ph - 260}`} stroke={O} strokeWidth={230} strokeLinecap="round" fill="none" />
                <path d={`M ${x + d * 160} 2100 Q ${x + d * 90} 1760 ${x - d * 10} ${py + ph - 260}`} stroke={TEN} strokeWidth={216} strokeLinecap="round" fill="none" />
                <path d={`M ${x + d * 200} 2100 L ${x + d * 150} 1880`} stroke={KAZAK} strokeWidth={250} strokeLinecap="round" />
                <path d={`M ${x + d * 90} 1900 L ${x + d * 210} 1880`} stroke={KAZAK2} strokeWidth={10} />
                {/* başparmak ekranın kenarında */}
                <path d={`M ${x + d * 10} ${py + ph - 320} Q ${x - d * 40} ${py + ph - 470} ${x - d * 70} ${py + ph - 560}`} stroke={O} strokeWidth={78} strokeLinecap="round" fill="none" />
                <path d={`M ${x + d * 10} ${py + ph - 320} Q ${x - d * 40} ${py + ph - 470} ${x - d * 70} ${py + ph - 560}`} stroke={TEN} strokeWidth={66} strokeLinecap="round" fill="none" />
                <ellipse cx={x - d * 70} cy={py + ph - 562} rx={22} ry={16} fill="#f8dcc8" opacity={0.85} />
                <path d={`M ${x + d * 40} ${py + ph - 200} q ${d * 30} 20 ${d * 40} 60`} stroke={TEN2} strokeWidth={5} fill="none" />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Kasanın arkasındaki sigara rafı (yakın, Ece'nin gözünden): paketler dizili; eller boşluğa bir paket yerleştirir,
 *  yamuk duranları hizalar. Kapı arkada kalır (izleyici görmez). */
const RafDuzen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const z = interpolate(f, [0, dur], [1, 1.06], clamp);
  const RENK = ["#c84a3a", "#2a4a8a", "#e8e4dc", "#1a1a1a", "#c8a03a", "#3a7a5a", "#8a2a3a", "#e8e4dc"];
  const yerles = interpolate(t, [0.3, 1.1], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const hiza = interpolate(t, [1.3, 1.9], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const sagEl = interpolate(t, [0, 0.3, 1.1, 1.3, 1.9, 2.4], [0, 1, 1, 0.6, 0.6, 0], clamp);
  const solEl = interpolate(t, [1.0, 1.3, 1.9, 2.3], [0, 1, 1, 0], clamp);
  const bosR = 1, bosI = 3; // boşluk
  return (
    <AbsoluteFill style={{ backgroundColor: "#3a3530", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "50% 45%" }}>
        <rect width={1080} height={1920} fill="#5a5048" />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x={-20} y={260 + r * 380} width={1120} height={360} fill="#6a6058" />
            <rect x={-20} y={600 + r * 380} width={1120} height={26} fill="#c8c0b0" stroke={O} strokeWidth={4} />
            {new Array(6).fill(0).map((_, i) => {
              const bos = r === bosR && i === bosI;
              const egri = r === 2 && i === 1 ? 12 * (1 - hiza) : 0;
              let x = 40 + i * 172, y = 330 + r * 380;
              if (bos) { x += (1 - yerles) * 600; y -= (1 - yerles) * 120; }
              if (bos && yerles <= 0) return null;
              return (
                <g key={i} transform={`rotate(${egri} ${x + 70} ${y + 270})`}>
                  <rect x={x} y={y} width={140} height={270} rx={8} fill={RENK[(i + r * 3) % RENK.length]} stroke={O} strokeWidth={4} />
                  <rect x={x + 14} y={y + 160} width={112} height={70} fill="#f4f0e8" stroke={O} strokeWidth={2} />
                  <path d={`M ${x + 22} ${y + 182} H ${x + 118} M ${x + 22} ${y + 200} H ${x + 100}`} stroke="#555" strokeWidth={4} />
                  <rect x={x + 10} y={y + 20} width={120} height={36} fill="#ffffff" opacity={0.85} />
                  <rect x={x} y={y} width={30} height={270} fill="#ffffff" opacity={0.12} />
                </g>
              );
            })}
            <rect x={60} y={612 + r * 380} width={120} height={8} fill="#f2c21a" />
          </g>
        ))}
        {/* sağ el (paketi boşluğa iter) */}
        {sagEl > 0 ? (() => {
          const hx = 40 + bosI * 172 + 140 + (1 - yerles) * 600, hy = 330 + bosR * 380 + 150 - (1 - yerles) * 120;
          return (
            <g transform={`translate(${(1 - sagEl) * 500} ${(1 - sagEl) * 300})`}>
              <path d={`M ${hx + 60} ${hy + 40} L 1300 ${hy + 700}`} stroke={O} strokeWidth={190} strokeLinecap="round" />
              <path d={`M ${hx + 60} ${hy + 40} L 1300 ${hy + 700}`} stroke={TEN} strokeWidth={178} strokeLinecap="round" />
              <path d={`M ${hx + 260} ${hy + 160} L 1300 ${hy + 760}`} stroke={KAZAK} strokeWidth={230} strokeLinecap="round" />
              {[0, 1, 2, 3].map((k) => <path key={k} d={`M ${hx + 40} ${hy - 30 + k * 34} q -40 -6 -60 4`} stroke={O} strokeWidth={36} strokeLinecap="round" fill="none" />)}
              {[0, 1, 2, 3].map((k) => <path key={`f${k}`} d={`M ${hx + 40} ${hy - 30 + k * 34} q -40 -6 -60 4`} stroke={TEN} strokeWidth={27} strokeLinecap="round" fill="none" />)}
            </g>
          );
        })() : null}
        {/* sol el (eğri paketi düzeltir) */}
        {solEl > 0 ? (() => {
          const hx = 40 + 1 * 172 - 10, hy = 330 + 2 * 380 + 120;
          return (
            <g transform={`translate(${-(1 - solEl) * 500} ${(1 - solEl) * 300})`}>
              <path d={`M ${hx - 40} ${hy + 60} L -260 ${hy + 640}`} stroke={O} strokeWidth={190} strokeLinecap="round" />
              <path d={`M ${hx - 40} ${hy + 60} L -260 ${hy + 640}`} stroke={TEN} strokeWidth={178} strokeLinecap="round" />
              <path d={`M ${hx - 230} ${hy + 220} L -260 ${hy + 700}`} stroke={KAZAK} strokeWidth={230} strokeLinecap="round" />
              {[0, 1, 2, 3].map((k) => <path key={k} d={`M ${hx - 30} ${hy - 30 + k * 34} q 40 -6 60 4`} stroke={O} strokeWidth={36} strokeLinecap="round" fill="none" />)}
              {[0, 1, 2, 3].map((k) => <path key={`f${k}`} d={`M ${hx - 30} ${hy - 30 + k * 34} q 40 -6 60 4`} stroke={TEN} strokeWidth={27} strokeLinecap="round" fill="none" />)}
            </g>
          );
        })() : null}
        {new Array(12).fill(0).map((_, i) => <circle key={i} cx={random(`rd${i}`) * 1080} cy={random(`re${i}`) * 1920} r={2} fill="#fff" opacity={0.2} />)}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Depo kapısı kolu (yakın, Ece'nin gözünden): gri metal kapı, "DEPO · PERSONEL" levhası, alttaki aralıktan karanlık.
 *  Ece'nin eli sağ alttan kola uzanır, değmeden durur, titrer, parmaklar kıvrılır ve geri çekilir. */
const DepoKolu: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const T = dur / fps;
  const z = interpolate(f, [0, dur], [1, 1.08], clamp);
  const uzan = interpolate(t, [0.1, 1.0], [0, 1], { ...clamp, easing: (x) => 1 - (1 - x) ** 2 });
  const geri = interpolate(t, [T - 0.7, T - 0.1], [0, 1], { ...clamp, easing: (x) => x * x });
  const titre = t > 1.0 && t < T - 0.7 ? Math.sin(f * 2.3) * 4 + Math.sin(f * 3.9) * 2 : 0;
  const kivir = interpolate(t, [1.4, 1.9], [0, 1], clamp);
  const kx = 470, ky = 900; // kolun ekseni
  const hx = interpolate(uzan - geri * 0.8, [0, 1], [1250, kx + 150]) + titre, hy = interpolate(uzan - geri * 0.8, [0, 1], [1500, ky + 40]) + titre * 0.5;
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a2c30", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "44% 48%" }}>
        <defs>
          <linearGradient id="dk_kapi" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7a8088" /><stop offset="0.5" stopColor="#9aa0a8" /><stop offset="1" stopColor="#6a7078" /></linearGradient>
          <linearGradient id="dk_kol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8ecf0" /><stop offset="1" stopColor="#8a9098" /></linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="#d8dcde" />
        <rect x={60} y={-40} width={860} height={1900} fill="url(#dk_kapi)" stroke={O} strokeWidth={8} />
        {[260, 1500].map((y) => <rect key={y} x={110} y={y} width={760} height={200} rx={10} fill="none" stroke="#6a7078" strokeWidth={6} />)}
        {/* levha */}
        <rect x={250} y={420} width={480} height={170} rx={10} fill="#f4f0e4" stroke={O} strokeWidth={5} />
        <text x={490} y={500} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={72} fill="#1a1a1a">DEPO</text>
        <text x={490} y={560} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} fill="#c8402a">PERSONEL</text>
        {/* kilit göbeği + kol */}
        <rect x={kx - 50} y={ky - 90} width={100} height={260} rx={14} fill="#c0c4c8" stroke={O} strokeWidth={5} />
        <circle cx={kx} cy={ky + 110} r={14} fill="#2a2a2a" />
        <path d={`M ${kx} ${ky} L ${kx + 260} ${ky + 6}`} stroke={O} strokeWidth={50} strokeLinecap="round" />
        <path d={`M ${kx} ${ky} L ${kx + 260} ${ky + 6}`} stroke="url(#dk_kol)" strokeWidth={38} strokeLinecap="round" />
        <circle cx={kx} cy={ky} r={44} fill="#c8ccd0" stroke={O} strokeWidth={5} />
        {/* kapı altı aralık: karanlık, içeride hafif kıpırtı */}
        <rect x={60} y={1840} width={860} height={40} fill="#050505" />
        <rect x={60 + ((f * 9) % 860)} y={1846} width={120} height={28} fill="#1a1a1a" opacity={0.6} />
        {/* el: sağ alttan uzanır, kola değmeden durur, titrer, geri çekilir */}
        <g>
          <path d={`M ${hx + 60} ${hy + 40} L 1400 ${hy + 800}`} stroke={O} strokeWidth={200} strokeLinecap="round" />
          <path d={`M ${hx + 60} ${hy + 40} L 1400 ${hy + 800}`} stroke={TEN} strokeWidth={188} strokeLinecap="round" />
          <path d={`M ${hx + 330} ${hy + 220} L 1400 ${hy + 900}`} stroke={KAZAK} strokeWidth={240} strokeLinecap="round" />
          <ellipse cx={hx + 40} cy={hy + 30} rx={95} ry={80} fill={TEN} stroke={O} strokeWidth={5} />
          {[0, 1, 2, 3].map((k) => {
            const fx = hx - 20 - k * 6, fy = hy - 30 + k * 30;
            const ux = fx - 90 + kivir * 50, uy = fy - 10 + kivir * 40;
            return (
              <g key={k}>
                <path d={`M ${fx} ${fy} Q ${fx - 50} ${fy - 14} ${ux} ${uy}`} stroke={O} strokeWidth={40} strokeLinecap="round" fill="none" />
                <path d={`M ${fx} ${fy} Q ${fx - 50} ${fy - 14} ${ux} ${uy}`} stroke={k % 2 ? TEN2 : TEN} strokeWidth={30} strokeLinecap="round" fill="none" />
              </g>
            );
          })}
          <path d={`M ${hx + 20} ${hy - 50} Q ${hx - 30} ${hy - 90} ${hx - 70 + kivir * 30} ${hy - 80}`} stroke={O} strokeWidth={44} strokeLinecap="round" fill="none" />
          <path d={`M ${hx + 20} ${hy - 50} Q ${hx - 30} ${hy - 90} ${hx - 70 + kivir * 30} ${hy - 80}`} stroke={TEN} strokeWidth={34} strokeLinecap="round" fill="none" />
        </g>
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Depo kapısı (karanlıkta, yakın): kapı gıcırdayarak birkaç santim aralanır, aralık simsiyah.
 *  Kapının kenarında yavaşça küçük, solgun bir çocuk eli belirir; parmaklar kenarı kavrar. Floresan titrer. */
const DepoEl: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const z = interpolate(f, [0, dur], [1.0, 1.18], { ...clamp, easing: (x) => x * x });
  const acik = interpolate(t, [0.2, 1.6], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const el = interpolate(t, [1.9, 3.2], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const flk = random(`de${Math.floor(f / 2)}`) > 0.86 ? 0.35 : 1;
  const gapX = 600, gapW = 20 + 170 * acik; // kapı sağa doğru açılır (menteşe solda)
  const SOL = "#d8dcd6", SOL2 = "#b8bcb4";
  return (
    <AbsoluteFill style={{ backgroundColor: "#060708", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ transform: `scale(${z})`, transformOrigin: "60% 50%" }}>
        <defs>
          <linearGradient id="de_k" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a3e44" /><stop offset="1" stopColor="#5a6068" /></linearGradient>
        </defs>
        {/* duvar (loş) */}
        <rect width={1080} height={1920} fill="#2a2c2e" />
        {/* kapı kanadı (aralığın solunda) + kasa */}
        <rect x={120} y={-20} width={gapX - 120} height={1960} fill="url(#de_k)" stroke="#0a0a0a" strokeWidth={8} />
        <rect x={210} y={420} width={300} height={110} rx={6} fill="#c8c4b8" opacity={0.6} />
        <text x={360} y={498} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={60} fill="#1a1a1a" opacity={0.7}>DEPO</text>
        <path d={`M ${gapX - 80} 900 L ${gapX - 260} 906`} stroke="#9aa0a6" strokeWidth={34} strokeLinecap="round" />
        {/* aralık: zifiri karanlık */}
        <rect x={gapX} y={-20} width={gapW} height={1960} fill="#000" />
        <rect x={gapX + gapW} y={-20} width={1080} height={1960} fill="#1c1e20" />
        <rect x={gapX + gapW} y={-20} width={28} height={1960} fill="#3a3e42" />
        {/* küçük el: kapının kenarını içeriden kavrar */}
        {el > 0 ? (
          <g transform={`translate(${gapX + 14 - (1 - el) * 60} 960) scale(2.6)`} opacity={Math.min(1, el * 1.5)}>
            {/* elin sırtı aralıkta (karanlıktan çıkar) */}
            <path d="M 6 -14 Q 40 -20 60 10 L 60 110 Q 30 120 6 104 Z" fill="#9a9e98" opacity={0.55} />
            {[0, 1, 2, 3].map((k) => (
              <g key={k}>
                <path d={`M 10 ${k * 30} Q ${-24 - k * 2} ${k * 30 - 6} ${-34 - (k === 1 || k === 2 ? 8 : 0)} ${k * 30 + 10}`} stroke="#0a0a0a" strokeWidth={24} strokeLinecap="round" fill="none" />
                <path d={`M 10 ${k * 30} Q ${-24 - k * 2} ${k * 30 - 6} ${-34 - (k === 1 || k === 2 ? 8 : 0)} ${k * 30 + 10}`} stroke={k % 2 ? SOL2 : SOL} strokeWidth={16} strokeLinecap="round" fill="none" />
                <ellipse cx={-34 - (k === 1 || k === 2 ? 8 : 0)} cy={k * 30 + 10} rx={6} ry={5} fill="#8a8a86" />
              </g>
            ))}
          </g>
        ) : null}
        {/* yerdeki ışık şeridi (titrer) */}
        <path d={`M 0 1860 L 1080 1830 L 1080 1920 L 0 1920 Z`} fill="#c8d0d8" opacity={0.12 * flk} />
      </svg>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${flk < 1 ? 0.45 : 0})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 58% 52%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Insert8: React.FC<{ kind: Insert8Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "on_kamera": return <OnKamera dur={dur} text={text} />;
    case "raf_duzen": return <RafDuzen dur={dur} />;
    case "depo_kolu": return <DepoKolu dur={dur} />;
    case "depo_el": return <DepoEl dur={dur} />;
    default: return null;
  }
};
