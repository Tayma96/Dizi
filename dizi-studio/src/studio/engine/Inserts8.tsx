/* 7/24 Bölüm 2 eklemeleri: on_kamera (Ece'nin gözünden telefonun ön kamerası + Sabri'nin bildirimi), raf_duzen (sigara rafını düzenleyen eller). */
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const O = "#1a1412";
const SANS = "Inter, Arial, sans-serif";
const TEN = "#f0c8a8", TEN2 = "#dcac88", KAZAK = "#c8902a", KAZAK2 = "#a8741a";

export type Insert8Kind = "on_kamera" | "raf_duzen";
export const INSERT8_KINDS: Insert8Kind[] = ["on_kamera", "raf_duzen"];

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

export const Insert8: React.FC<{ kind: Insert8Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "on_kamera": return <OnKamera dur={dur} text={text} />;
    case "raf_duzen": return <RafDuzen dur={dur} />;
    default: return null;
  }
};
