/* =====================================================================================
 * 7/24 B9 P2: Can Market duvar televizyonu YAKIN PLAN ("tv" görünümü, Inserts18 b8_market).
 *  Uydurma kanal "GECE HATTI" (özgün): stüdyo + spiker (rig, dudak senkronu), SON DAKİKA bandı, kayan yazı,
 *  arka ekranda özgün çizilmiş Sarıyer kıyı haritası; termal kamera görüntüsü (ısı paleti, aslan sıcak siluet,
 *  çalılığın arkasına geçip KAYBOLUR). Kamera: Ece'nin aşağıdan-sağdan bakışı (hafif perspektif), cam yansıması, tarama çizgisi.
 *  mod: 1 jenerik, 2 stüdyo, 3 termal (tt = o moddaki yerel zaman).
 * ===================================================================================== */
import React from "react";
import { random } from "remotion";
import { Aslan } from "./aslan724";

const SANS = "Arial, 'Helvetica Neue', sans-serif";
const SW = 960, SH = 540;

const Bantlar: React.FC<{ f: number; tt: number }> = ({ f, tt }) => {
  const ticker = (f * 5) % 2600;
  const g = Math.min(1, tt * 2.5);
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 392, height: 70, width: 236 * g, overflow: "hidden", background: "#c8102e", display: "flex", alignItems: "center", paddingLeft: 18, fontFamily: SANS, fontWeight: 900, fontSize: 34, color: "#fff", letterSpacing: 1, whiteSpace: "nowrap" }}>SON DAKİKA</div>
      <div style={{ position: "absolute", left: 236, top: 392, height: 70, width: 724 * Math.min(1, Math.max(0, tt * 2.5 - 0.4)), overflow: "hidden", background: "#f6f6f2", display: "flex", alignItems: "center", paddingLeft: 20, fontFamily: SANS, fontWeight: 900, fontSize: 38, color: "#121418", whiteSpace: "nowrap" }}>SARIYER'DE ASLAN ALARMI</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 462, height: 40, background: "#0b1a33", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: SW - ticker, top: 6, whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 700, fontSize: 24, color: "#d8e6ff" }}>
          VATANDAŞLARIN ZORUNLU OLMADIKÇA DIŞARI ÇIKMAMASI İSTENİYOR  ·  EKİPLER BÖLGEDE ARAMA YAPIYOR  ·  HAYVANAT BAHÇESİ YETKİLİLERİNDEN AÇIKLAMA BEKLENİYOR  ·
        </div>
      </div>
    </>
  );
};

const Logo: React.FC<{ f: number }> = ({ f }) => (
  <>
    <div style={{ position: "absolute", left: 22, top: 20, display: "flex", alignItems: "center", gap: 0, fontFamily: SANS, fontWeight: 900 }}>
      <div style={{ background: "#c8102e", color: "#fff", fontSize: 26, padding: "6px 9px" }}>GH</div>
      <div style={{ background: "rgba(255,255,255,0.92)", color: "#0b1a33", fontSize: 24, padding: "7px 12px", letterSpacing: 1 }}>GECE HATTI</div>
    </div>
    <div style={{ position: "absolute", right: 24, top: 24, display: "flex", alignItems: "center", gap: 8, fontFamily: SANS, fontWeight: 900, fontSize: 24, color: "#fff", textShadow: "0 1px 2px #000" }}>
      <span style={{ width: 13, height: 13, borderRadius: 7, background: "#ff2a2a", opacity: f % 30 < 18 ? 1 : 0.25 }} /> CANLI
    </div>
  </>
);

/* arka ekran: Sarıyer kıyısı (özgün şematik harita): boğaz şeridi, orman, kırmızı nabız (son görülme) */
const Harita: React.FC<{ f: number }> = ({ f }) => {
  const u = (f % 36) / 36;
  return (
    <svg viewBox="0 0 420 300" width={420} height={300} style={{ position: "absolute", left: 500, top: 70 }}>
      <rect width={420} height={300} fill="#0a2240" />
      <path d="M 0 0 L 190 0 Q 210 60 250 90 Q 300 130 290 200 Q 280 250 330 300 L 0 300 Z" fill="#2c4a3a" />
      <path d="M 40 40 Q 90 30 120 70 Q 130 120 80 140 Q 30 130 40 40 Z" fill="#1e3a2c" />
      <path d="M 190 0 Q 210 60 250 90 Q 300 130 290 200 Q 280 250 330 300 L 420 300 L 420 0 Z" fill="#14406e" />
      <path d="M 380 0 L 420 0 L 420 140 Q 390 110 380 60 Z" fill="#2c4a3a" />
      {[[60, 200], [140, 230], [100, 100], [170, 150], [210, 250]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.5} fill="#e8d890" opacity={0.6} />)}
      <path d="M 20 260 Q 120 210 170 150 Q 200 110 230 60" stroke="#d8dce0" strokeWidth={2.5} fill="none" strokeDasharray="6 5" opacity={0.6} />
      <circle cx={150} cy={175} r={10 + 34 * u} fill="none" stroke="#ff2a2a" strokeWidth={4} opacity={1 - u} />
      <circle cx={150} cy={175} r={8} fill="#ff2a2a" />
      <text x={166} y={170} fontFamily={SANS} fontWeight={900} fontSize={18} fill="#ffd6d6">SON GÖRÜLDÜĞÜ YER</text>
      <text x={18} y={30} fontFamily={SANS} fontWeight={900} fontSize={22} fill="#e8f0ff">SARIYER</text>
      <rect width={420} height={300} fill="none" stroke="#4a8ad8" strokeWidth={4} />
    </svg>
  );
};

/* termal kamera: ısı paleti; aslan sıcak siluet soldan girer, çalılığın arkasına geçer ve çıkmaz */
const Termal: React.FC<{ f: number; tt: number }> = ({ f, tt }) => {
  const yur = Math.min(1, tt / 2.0);
  const ax = 70 + yur * 560;
  const kayip = tt > 2.05;
  const sn = 14 + Math.floor(tt);
  const kutuX = Math.min(ax, 600);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#120626" }}>
      <svg viewBox={`0 0 ${SW} ${SH}`} width={SW} height={SH} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="tmLamba"><stop offset="0" stopColor="#ffffff" /><stop offset="0.3" stopColor="#ffe060" /><stop offset="0.7" stopColor="#ff6a1a" stopOpacity={0.5} /><stop offset="1" stopColor="#ff6a1a" stopOpacity={0} /></radialGradient>
          <filter id="tmB"><feGaussianBlur stdDeviation="2.2" /></filter>
        </defs>
        {/* gök soğuk, zemin ılık-mor, ağaçlar (gün boyu ısınmış gövdeler daha ılık) */}
        <rect width={SW} height={SH} fill="#140830" />
        <path d={`M 0 330 L ${SW} 300 L ${SW} ${SH} L 0 ${SH} Z`} fill="#3a1258" />
        <path d={`M 0 400 L ${SW} 380 L ${SW} 420 L 0 440 Z`} fill="#521a6a" />
        {[[80, 120], [230, 90], [400, 140], [860, 110]].map(([x, y], i) => (
          <g key={i} filter="url(#tmB)">
            <rect x={x - 9} y={y + 60} width={18} height={330 - y - 60 + 10} fill="#6a1e78" />
            <ellipse cx={x} cy={y + 40} rx={80} ry={70} fill="#2e0e4e" />
            <ellipse cx={x - 30} cy={y + 70} rx={50} ry={40} fill="#3a1258" />
          </g>
        ))}
        {/* sokak lambası (sıcak) + park etmiş araba (motor kaputu ılık) */}
        <rect x={760} y={80} width={8} height={260} fill="#4a1a6a" />
        <circle cx={764} cy={84} r={34} fill="url(#tmLamba)" />
        <path d="M 40 360 Q 50 320 110 316 L 200 316 Q 240 320 250 360 Z" fill="#7a2070" filter="url(#tmB)" />
        <path d="M 196 330 Q 232 332 246 356 L 200 356 Z" fill="#ff8a2a" filter="url(#tmB)" />
        {/* aslan: sıcak siluet */}
        <g transform={`translate(${ax} 372) scale(1.05)`} filter="url(#tmB)">
          <Aslan faz={tt * 5.2} hiz={1} mod="termal" uid="tmAs" kuyrukT={tt} />
        </g>
        {/* çalılık + duvar (soğuk): aslan arkasına geçer */}
        <path d="M 600 400 Q 590 300 640 270 Q 700 240 760 280 Q 820 250 850 300 Q 880 360 860 400 Z" fill="#1c0a3c" filter="url(#tmB)" />
        <rect x={600} y={330} width={280} height={84} fill="#220c44" />
        {/* izleme kutusu */}
        {!kayip ? <rect x={kutuX - 110} y={250} width={260} height={140} fill="none" stroke="#7dff9a" strokeWidth={3} strokeDasharray="22 8" /> : null}
        {kayip && f % 16 < 10 ? <rect x={560} y={250} width={260} height={140} fill="none" stroke="#ff3a3a" strokeWidth={4} /> : null}
        {kayip && f % 16 < 10 ? <text x={690} y={240} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={30} fill="#ff4a4a">HEDEF KAYBOLDU</text> : null}
        {/* kamera arayüzü */}
        {[[20, 20, 1, 1], [940, 20, -1, 1], [20, 380, 1, -1], [940, 380, -1, -1]].map(([x, y, sx, sy], i) => <path key={i} d={`M ${x} ${y + 34 * sy} L ${x} ${y} L ${x + 34 * sx} ${y}`} stroke="#e8f0ff" strokeWidth={3} fill="none" />)}
        <text x={40} y={60} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={24} fill="#e8f0ff">TERMAL · SARIYER K-7</text>
        <circle cx={736} cy={52} r={8} fill="#ff2a2a" opacity={f % 30 < 18 ? 1 : 0.2} />
        <text x={750} y={60} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={24} fill="#e8f0ff">KAYIT 23:58:{String(sn).padStart(2, "0")}</text>
        <path d={`M ${SW / 2 - 18} 210 H ${SW / 2 + 18} M ${SW / 2} 192 V 228`} stroke="#e8f0ff" strokeWidth={2} opacity={0.6} />
        <defs><linearGradient id="tmOlcek" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="0.3" stopColor="#ffe060" /><stop offset="0.6" stopColor="#ff4a1a" /><stop offset="1" stopColor="#1a0838" /></linearGradient></defs>
        <rect x={912} y={110} width={16} height={220} fill="url(#tmOlcek)" stroke="#e8f0ff" strokeWidth={1.5} />
        <text x={904} y={106} textAnchor="end" fontFamily={SANS} fontSize={16} fill="#e8f0ff">38°</text>
        <text x={904} y={334} textAnchor="end" fontFamily={SANS} fontSize={16} fill="#e8f0ff">6°</text>
      </svg>
      {/* sensör gürültüsü */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.18, backgroundImage: `radial-gradient(circle at ${(random(`tg${f}`) * 100).toFixed(1)}% ${(random(`th${f}`) * 100).toFixed(1)}%, #fff 0.6px, transparent 1.4px)`, backgroundSize: "4px 4px" }} />
    </div>
  );
};

export const TvEkran: React.FC<{ mod: number; tt: number; f: number; spiker?: React.ReactNode; tg: number }> = ({ mod, tt, f, spiker, tg }) => {
  // kamera: Ece'nin aşağıdan bakışı; çok yavaş itiş + el titremesi
  const it = 1 + 0.025 * Math.min(1, Math.max(0, tg % 30) / 30);
  const sx = 3 * Math.sin(tg * 1.3), sy = 2.5 * Math.sin(tg * 1.7 + 1);
  const renk = mod < 1.5 ? "#ff3040" : mod < 2.5 ? "#4a90ff" : "#b050ff";
  let ic: React.ReactNode;
  if (mod < 1.5) {
    // jenerik: kırmızı zemin, beyaz şerit süpürür, SON DAKİKA yazısı kayarak gelir, ışık parlaması
    const u = Math.min(1, tt / 0.5), v = Math.min(1, Math.max(0, (tt - 0.25) / 0.4));
    ic = (
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, #e0182e 0%, #8a0614 100%)", overflow: "hidden" }}>
        {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", left: -200 + ((tt * 900 + i * 260) % 1400), top: 0, width: 60, height: SH, background: "rgba(255,255,255,0.08)", transform: "skewX(-20deg)" }} />)}
        <div style={{ position: "absolute", left: 0, top: 200, height: 140, width: SW * u, background: "#ffffff" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 900, fontSize: 92, color: "#c8102e", letterSpacing: 4, opacity: v, transform: `translateX(${(1 - v) * -80}px) scale(${1.15 - 0.15 * v})` }}>SON DAKİKA</div>
        <div style={{ position: "absolute", left: SW * u - 90, top: 150, width: 180, height: 240, background: "radial-gradient(ellipse, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)", opacity: 1 - v }} />
        <Logo f={f} />
      </div>
    );
  } else if (mod < 2.5) {
    ic = (
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #0c2850 0%, #13406e 55%, #0a1c3c 100%)", overflow: "hidden" }}>
        {/* stüdyo: arka plan ışık noktaları (gece şehri, bulanık) */}
        {new Array(22).fill(0).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: (i * 97) % 960, top: 40 + ((i * 53) % 220), width: 22 + (i % 4) * 8, height: 22 + (i % 4) * 8, borderRadius: "50%", background: i % 5 === 0 ? "#ffb060" : "#7ab8ff", opacity: 0.18 + 0.08 * Math.sin(tg * 0.8 + i), filter: "blur(5px)" }} />
        ))}
        <Harita f={f} />
        {/* spiker */}
        <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH }}>{spiker}</div>
        {/* masa: parlak kenar, logo şeridi */}
        <div style={{ position: "absolute", left: 40, width: 470, top: 352, height: 60, background: "linear-gradient(180deg, #24406a, #0e2242)", borderTop: "3px solid #7ab0ff", borderRadius: "8px 8px 0 0" }} />
        <Logo f={f} />
        <Bantlar f={f} tt={tt + 1} />
      </div>
    );
  } else {
    ic = (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Termal f={f} tt={tt} />
        <Logo f={f} />
        <Bantlar f={f} tt={9} />
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#b9bec0" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sx}px, ${sy}px) scale(${it})`, transformOrigin: "540px 640px" }}>
        {/* duvar: yukarı doğru kararır; TV ışığı duvara vurur */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #8e9496 0%, #b8bdbf 45%, #c6cbcc 100%)" }} />
        <div style={{ position: "absolute", left: -200, top: 120, width: 1480, height: 1060, background: `radial-gradient(ellipse at 50% 50%, ${renk}55 0%, ${renk}00 65%)`, mixBlendMode: "screen", opacity: 0.85 + 0.15 * Math.sin(f * 0.9) }} />
        {/* kazı kazan standının üstü (sarı), alt kenarda */}
        <div style={{ position: "absolute", left: 120, top: 1500, width: 520, height: 500, background: "#f2c830", border: "6px solid #6a5010" }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 150 + i * 160, top: 1540, width: 140, height: 200, background: ["#e84a3a", "#3a8ad8", "#3ab86a"][i], border: "3px solid #2a2a2a" }} />)}
        {/* duvar kolu (gölgede) */}
        <div style={{ position: "absolute", left: 470, top: 880, width: 140, height: 90, background: "#3a3e44", border: "3px solid #1a1c20" }} />
        {/* TV gövdesi + ekran (aşağıdan bakış: hafif perspektif) */}
        <div style={{ position: "absolute", left: 30, top: 300, width: 1020, height: 600, transform: "perspective(1600px) rotateX(6deg) rotateY(-7deg)", transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", inset: 0, background: "#0f1012", borderRadius: 10, boxShadow: "0 18px 40px rgba(0,0,0,0.45), inset 0 0 0 3px #26282c" }} />
          <div style={{ position: "absolute", left: 30, top: 30, width: SW, height: SH, overflow: "hidden", background: "#000" }}>
            {ic}
            {/* tarama çizgisi + cam yansıması (tavan floresanı) */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0) 3px)" }} />
            <div style={{ position: "absolute", left: 120, top: -60, width: 90, height: 700, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.09), rgba(255,255,255,0))", transform: "rotate(24deg)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(200deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 40%)" }} />
          </div>
          <div style={{ position: "absolute", left: 980, bottom: 9, width: 8, height: 8, borderRadius: 4, background: "#ff3030", opacity: 0.8 }} />
        </div>
      </div>
    </div>
  );
};
