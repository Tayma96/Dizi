/* =====================================================================================
 * 7/24 Can Market: YAN AÇI (B8 yeni P1, opt-in; yalnız Inserts18 "b8_market" görünüm "yan" kullanır).
 *  Kamera müşteri tarafında, tezgâhın sağ ucunun önünden (güneydoğu) arka duvara ~12° açıyla bakar:
 *   Ece solda (tezgâhın önünde, müşteri tarafı), Sabri sağda (tezgâhın arkasında), DEPO kapısı arka duvarda
 *   Sabri'nin sağında, kadrajın İÇİNDE ve büyük. "kasa" görünümüyle aynı oda: soldan sağa vitrin, monitör,
 *   sigara dolabı, kazı kazan + takvim, DEPO · PERSONEL kapısı (sağ köşe).
 *  Dünya (metre): X doğu (+ sağ), Y yukarı, Z kuzey (+ derin). Tezgâh X -2.2..1.35, Z 0..0.65, Y 0..0.95. Arka duvar Z 1.9.
 *  Depo kapısı X 1.05..1.9, Y 0..2.1; menteşe SAĞDA (X 1.9), depoya doğru (Z+) açılır; kol solda.
 * ===================================================================================== */
import React from "react";
import { random } from "remotion";

const CAM = { x: 1.9, y: 1.45, z: -3.4 };
const HEDEF = { x: 1.0, z: 1.0 };
const F = 1600, VX = 540, VY = 900;
const TH = Math.atan2(HEDEF.x - CAM.x, HEDEF.z - CAM.z);
const SN = Math.sin(TH), CS = Math.cos(TH);
type P2 = [number, number];
/** dünya (m) → ekran (px, 1080×1920 dünya tuvali) */
export const yanP = (X: number, Y: number, Z: number): P2 => {
  const dx = X - CAM.x, dz = Z - CAM.z;
  const d = Math.max(0.2, dx * SN + dz * CS);
  const r = dx * CS - dz * SN;
  return [VX + (F * r) / d, VY - (F * (Y - CAM.y)) / d];
};
/** derinlik (m): karakter boyu için */
export const yanD = (X: number, Z: number) => (X - CAM.x) * SN + (Z - CAM.z) * CS;
/** karakter işareti: ayak noktası + rig boyu (göz hizası ~ boy·0.93 m) */
export const yanIsaret = (X: number, Z: number, boy = 1.62): [number, number, number] => {
  const [x, y] = yanP(X, 0, Z);
  const px = (F * boy * 0.93) / yanD(X, Z);
  return [x, y, (px / 765) * 1000];
};
const pl = (pts: P2[]) => `M ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")} Z`;
const qZ = (Z: number, X1: number, X2: number, Y1: number, Y2: number) => pl([yanP(X1, Y1, Z), yanP(X2, Y1, Z), yanP(X2, Y2, Z), yanP(X1, Y2, Z)]);
const qX = (X: number, Z1: number, Z2: number, Y1: number, Y2: number) => pl([yanP(X, Y1, Z1), yanP(X, Y1, Z2), yanP(X, Y2, Z2), yanP(X, Y2, Z1)]);
const qY = (Y: number, X1: number, X2: number, Z1: number, Z2: number) => pl([yanP(X1, Y, Z1), yanP(X2, Y, Z1), yanP(X2, Y, Z2), yanP(X1, Y, Z2)]);
const line = (a: [number, number, number], b: [number, number, number]) => { const p = yanP(...a), q = yanP(...b); return `M ${p[0].toFixed(1)} ${p[1].toFixed(1)} L ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; };
/** düzlemde yazı: Z sabit duvar/panel üstüne yaklaşık afin dönüşüm */
const zMatris = (Z: number, X: number, Y: number, olcek: number) => {
  const o = yanP(X, Y, Z), ex = yanP(X + 0.01, Y, Z), ey = yanP(X, Y - 0.01, Z);
  const a = (ex[0] - o[0]) / 0.01, b = (ex[1] - o[1]) / 0.01, c = (ey[0] - o[0]) / 0.01, d = (ey[1] - o[1]) / 0.01;
  return `matrix(${(a * olcek).toFixed(4)} ${(b * olcek).toFixed(4)} ${(c * olcek).toFixed(4)} ${(d * olcek).toFixed(4)} ${o[0].toFixed(1)} ${o[1].toFixed(1)})`;
};

const PAKET = ["#d8402e", "#2f6fd0", "#e8a628", "#2f9e5a", "#e86a9a", "#f2f0e6", "#7a4ad0", "#e85a1a"];
const WZ = 1.9;
const DX1 = 1.05, DX2 = 1.9, DH = 2.1, KANAT = DX2 - DX1;

/** kapı kanadının açısı (radyan): acik 0..1 → 0..95°; aralık için küçük değerler (0.05 ≈ 5°) */
const kanatAci = (acik: number) => Math.max(0, Math.min(1.05, acik)) * 1.66;
/** kanadın serbest (kollu) kenarı, menteşe X 2.1 */
const kenar = (acik: number): [number, number] => {
  const a = kanatAci(acik);
  return [DX2 - KANAT * Math.cos(a), WZ + KANAT * Math.sin(a)];
};
/** kapı boşluğunun ekran poligonu (Mert'i keserken: duvarın ardındaki kısım) */
export const yanKapiBosluk = (): P2[] => [yanP(DX1, 0, WZ), yanP(DX2, 0, WZ), yanP(DX2, DH, WZ), yanP(DX1, DH, WZ)];
/** kapı kolu ekran noktası (kamera hedefi için) */
export const YAN_KOL: P2 = yanP(DX1 + 0.1, 1.0, WZ);
export const YAN_KAPI: P2 = yanP((DX1 + DX2) / 2, 1.05, WZ);

/* ------------------------------------------------------------------ arka plan */
export const Market724YanBG: React.FC<{ frame: number; acik: number; kol: number; saat: string; fl?: number; levha?: number; kapiAlt?: number[] }> = ({ frame, acik, kol, saat, fl = 1, levha = 0, kapiAlt }) => {
  const [ex, ez] = kenar(acik);
  const a = kanatAci(acik);
  const ic = Math.min(1, acik * 6); // depo ışığı (aralıkta bile parlak)
  const sec = 14 + Math.floor(frame / 30);
  // kanat poligonu
  const kanat = pl([yanP(ex, 0, ez), yanP(DX2, 0, WZ), yanP(DX2, DH, WZ), yanP(ex, DH, ez)]);
  // kol: kanat üstünde, serbest kenardan 0.08 m içeride, Y 1.0; yüzey normali odaya doğru
  const ux = Math.cos(a), uz = -Math.sin(a); // kenardan menteşeye birim
  const nx = -Math.sin(a), nz = -Math.cos(a); // odaya doğru normal
  const kP = (s: number, y: number, n = 0): [number, number, number] => [ex + ux * s + nx * n, y, ez + uz * s + nz * n];
  const r = (kol * 42 * Math.PI) / 180;
  const kolUc = kP(0.08 + 0.135 * Math.cos(r), 1.0 - 0.135 * Math.sin(r), 0.05);
  const kolDip = kP(0.08, 1.0, 0.05);
  const [kdx, kdy] = yanP(...kolDip), [kux, kuy] = yanP(...kolUc);
  const kolKal = 0.024 * F / yanD(kolDip[0], kolDip[2]);
  return (
    <g>
      <defs>
        <linearGradient id="yanDuvar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dde1e2" /><stop offset="1" stopColor="#c6cbcd" /></linearGradient>
        <linearGradient id="yanZemin" gradientUnits="userSpaceOnUse" x1="0" y1="1250" x2="0" y2="2300"><stop offset="0" stopColor="#d2d6d3" /><stop offset="0.45" stopColor="#c2c7c4" /><stop offset="1" stopColor="#8e9492" /></linearGradient>
        <linearGradient id="yanTavan" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="560"><stop offset="0" stopColor="#a8aeb4" /><stop offset="1" stopColor="#dfe3e4" /></linearGradient>
        <linearGradient id="yanDepo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff2c8" /><stop offset="0.45" stopColor="#ffd590" /><stop offset="1" stopColor="#c88a48" /></linearGradient>
        <radialGradient id="yanSpill" gradientUnits="userSpaceOnUse" cx={yanP((DX1 + DX2) / 2, 0, WZ)[0]} cy={yanP((DX1 + DX2) / 2, 0, WZ)[1]} r={620}><stop offset="0" stopColor="#ffe0a0" stopOpacity={0.85} /><stop offset="1" stopColor="#ffe0a0" stopOpacity={0} /></radialGradient>
        <filter id="yanBl"><feGaussianBlur stdDeviation="10" /></filter>
        <filter id="yanBl3"><feGaussianBlur stdDeviation="3" /></filter>
        <clipPath id="yanMon"><path d={qZ(WZ - 0.12, -1.45, -0.8, 2.08, 2.46)} /></clipPath>
      </defs>
      {/* zemin ve tavan zemini (tuvalin tamamı) */}
      <rect x={-600} y={-400} width={2280} height={2720} fill="#d9dcdc" />
      {/* tavan */}
      <path d={pl([yanP(-4, 3, WZ), yanP(2.9, 3, WZ), yanP(2.9, 3, -2.4), yanP(-4, 3, -2.4)])} fill="url(#yanTavan)" />
      {[-2, -1, 0, 1, 2].map((X) => <path key={`tx${X}`} d={line([X, 3, WZ], [X, 3, -2.4])} stroke="#b8bec2" strokeWidth={2} />)}
      {[1.2, 0.2, -0.8, -1.8].map((Z) => <path key={`tz${Z}`} d={line([-4, 3, Z], [2.9, 3, Z])} stroke="#b8bec2" strokeWidth={2} />)}
      {/* floresanlar (anahtar ışık, üstten) */}
      {[[-0.6, 0.3], [-0.6, -1.5], [1.5, 0.3]].map(([X, Z], i) => (
        <g key={`fl${i}`}>
          <path d={qY(2.99, X - 0.16, X + 0.16, Z, Z + 1.1)} fill="#f4f6f6" stroke="#9aa2a6" strokeWidth={3} />
          <path d={qY(2.98, X - 0.09, X + 0.09, Z + 0.05, Z + 1.05)} fill="#ffffff" opacity={fl} />
          <path d={qY(2.98, X - 0.35, X + 0.35, Z - 0.15, Z + 1.25)} fill="#ffffff" opacity={0.3 * fl} filter="url(#yanBl)" />
        </g>
      ))}
      {/* arka duvar */}
      <path d={pl([yanP(-4, 0, WZ), yanP(2.9, 0, WZ), yanP(2.9, 3, WZ), yanP(-4, 3, WZ)])} fill="url(#yanDuvar)" />
      <path d={line([-4, 3, WZ], [2.9, 3, WZ])} stroke="#b8bec2" strokeWidth={4} />
      {/* sağ duvar (doğu; köşe kadraj dışında kalır) */}
      <path d={pl([yanP(2.9, 0, WZ), yanP(2.9, 0, -2.4), yanP(2.9, 3, -2.4), yanP(2.9, 3, WZ)])} fill="#c4c9cc" />
      {/* süpürgelik */}
      <path d={qZ(WZ - 0.005, -4, DX1 - 0.07, 0, 0.1)} fill="#9aa2a8" />
      <path d={qZ(WZ - 0.005, DX2 + 0.07, 2.9, 0, 0.1)} fill="#9aa2a8" />
      {/* sol: vitrin köşesi (gece) */}
      <path d={qZ(WZ - 0.01, -4, -3.0, 0.3, 2.5)} fill="#141a26" />
      <path d={qZ(WZ - 0.012, -3.05, -2.97, 0, 2.6)} fill="#9aa2a8" />
      {/* güvenlik monitörü (asılı, dört bölme) */}
      <path d={line([-1.12, 3, WZ - 0.12], [-1.12, 2.46, WZ - 0.12])} stroke="#4a4e54" strokeWidth={6} />
      <path d={qZ(WZ - 0.12, -1.5, -0.75, 2.04, 2.5)} fill="#16181c" stroke="#0a0b0d" strokeWidth={4} />
      <g clipPath="url(#yanMon)">
        <path d={qZ(WZ - 0.12, -1.45, -0.8, 2.08, 2.46)} fill="#2a302c" />
        <path d={qZ(WZ - 0.121, -1.45, -1.13, 2.28, 2.46)} fill="#5a625c" />
        <path d={qZ(WZ - 0.121, -1.12, -0.8, 2.28, 2.46)} fill="#4e5650" />
        <path d={qZ(WZ - 0.121, -1.45, -1.13, 2.08, 2.27)} fill="#555d57" />
        {/* K4 DEPO bölmesi: kapı açıkken ışık */}
        <path d={qZ(WZ - 0.121, -1.12, -0.8, 2.08, 2.27)} fill={ic > 0.1 ? "#c8c8a0" : "#1a1e1c"} />
        {new Array(8).fill(0).map((_, i) => <path key={i} d={line([-1.45, 2.08 + i * 0.05, WZ - 0.122], [-0.8, 2.08 + i * 0.05, WZ - 0.122])} stroke="#000" strokeWidth={2} opacity={0.2} />)}
        <path d={qZ(WZ - 0.122, -1.45, -0.8, 2.08, 2.46)} fill="#c8ffd8" opacity={0.08} />
        <text transform={zMatris(WZ - 0.123, -0.83, 2.1, 0.0018)} textAnchor="end" fontFamily="'Courier New', monospace" fontSize={22} fontWeight={700} fill="#e8ffe8">{saat}:{String(sec % 60).padStart(2, "0")}</text>
      </g>
      {/* sigara dolabı (koyu; Ece'nin arkası) */}
      <path d={qZ(WZ - 0.04, -2.6, -0.15, 0.95, 2.0)} fill="#1e2228" stroke="#0c0e12" strokeWidth={6} />
      {new Array(5).fill(0).map((_, r) => new Array(13).fill(0).map((__, c) => {
        const x1 = -2.52 + c * 0.183, y1 = 1.02 + r * 0.2;
        return (
          <g key={`p${r}${c}`}>
            <path d={qZ(WZ - 0.045, x1, x1 + 0.14, y1, y1 + 0.15)} fill={PAKET[(r * 7 + c * 3) % PAKET.length]} opacity={0.82} />
            <path d={qZ(WZ - 0.046, x1, x1 + 0.14, y1 + 0.11, y1 + 0.15)} fill="#ffffff" opacity={0.25} />
          </g>
        );
      }))}
      {[1.0, 1.2, 1.4, 1.6, 1.8].map((Y) => <path key={`r${Y}`} d={line([-2.58, Y, WZ - 0.045], [-0.17, Y, WZ - 0.045])} stroke="#4a5058" strokeWidth={4} />)}
      <path d={qZ(WZ - 0.047, -2.6, -0.15, 0.95, 2.0)} fill="#bcd4e4" opacity={0.1} />
      {/* 18 yaş uyarısı (dolabın altı) */}
      <path d={qZ(WZ - 0.03, -2.2, -0.6, 0.78, 0.9)} fill="#f8f4e8" stroke="#2a2e32" strokeWidth={2} />
      <text transform={zMatris(WZ - 0.031, -1.4, 0.81, 0.0021)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={40} fill="#a01818">18 YAŞ ALTINA SİGARA SATILMAZ</text>
      {/* kazı kazan standı + takvim (dolapla Sabri arasında) */}
      <path d={qZ(WZ - 0.03, -0.02, 0.38, 1.45, 2.05)} fill="#f2c830" stroke="#6a5010" strokeWidth={4} />
      {[0, 1, 2].map((i) => <path key={`kk${i}`} d={qZ(WZ - 0.031, 0.02, 0.34, 1.88 - i * 0.18, 2.01 - i * 0.18)} fill={["#e84a3a", "#3a8ad8", "#3ab86a"][i]} />)}
      <path d={qZ(WZ - 0.02, 0.03, 0.38, 0.95, 1.36)} fill="#f8f8f4" stroke="#5a5a56" strokeWidth={2} />
      <path d={qZ(WZ - 0.021, 0.03, 0.38, 1.27, 1.36)} fill="#c02020" />
      <text transform={zMatris(WZ - 0.022, 0.205, 1.295, 0.0016)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={34} fill="#ffffff">KASIM</text>
      <text transform={zMatris(WZ - 0.022, 0.205, 1.03, 0.0016)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={110} fill="#2a2a2a">19</text>
      {/* yangın tüpü (kapının sağı) */}
      <path d={qZ(WZ - 0.06, 2.12, 2.26, 0.55, 1.12)} fill="#c8281e" stroke="#4a0e0a" strokeWidth={3} />
      <path d={qZ(WZ - 0.061, 2.14, 2.2, 1.12, 1.2)} fill="#2a2a2a" />
      <path d={qZ(WZ - 0.062, 2.13, 2.17, 0.62, 1.05)} fill="#ffffff" opacity={0.25} />
      {/* ===== DEPO KAPISI ===== */}
      {/* kasa (metal pervaz) */}
      <path d={qZ(WZ - 0.01, DX1 - 0.07, DX2 + 0.07, 0, DH + 0.07)} fill="#5a6066" stroke="#2a2e32" strokeWidth={4} />
      {/* boşluk: depo içi (sıcak çıplak ampul, raflar) */}
      <path d={qZ(WZ, DX1, DX2, 0, DH)} fill="#0a0b0d" />
      {ic > 0.001 ? (
        <g opacity={ic}>
          <path d={qZ(WZ, DX1, DX2, 0, DH)} fill="url(#yanDepo)" />
          {/* içerideki raf siluetleri (sol iç duvar) ve koliler */}
          {[0.3, 0.75, 1.2, 1.65].map((Y, i) => <path key={`dr${i}`} d={pl([yanP(DX1, Y, WZ + 0.02), yanP(DX1 + 0.35, Y, WZ + 0.02), yanP(DX1 + 0.35, Y + 0.05, WZ + 0.02), yanP(DX1, Y + 0.05, WZ + 0.02)])} fill="#7a5028" opacity={0.75} />)}
          {[[0.36, 0.3], [0.8, 0.22], [1.25, 0.28], [1.7, 0.2]].map(([Y, w], i) => <path key={`dk${i}`} d={qZ(WZ + 0.02, DX1 + 0.02, DX1 + 0.02 + w, Y, Y + 0.3)} fill="#b8844a" stroke="#6a4620" strokeWidth={2} opacity={0.85} />)}
          {/* tavandan sarkan çıplak ampul */}
          <path d={line([DX1 + 0.55, DH, WZ + 0.02], [DX1 + 0.55, 1.88, WZ + 0.02])} stroke="#4a3a2a" strokeWidth={3} />
          <circle cx={yanP(DX1 + 0.55, 1.85, WZ + 0.02)[0]} cy={yanP(DX1 + 0.55, 1.85, WZ + 0.02)[1]} r={9} fill="#ffffff" />
          <circle cx={yanP(DX1 + 0.55, 1.85, WZ + 0.02)[0]} cy={yanP(DX1 + 0.55, 1.85, WZ + 0.02)[1]} r={40} fill="#fff4d0" opacity={0.55} filter="url(#yanBl)" />
        </g>
      ) : null}
      {/* kanat (menteşe sağda, depoya doğru açılır): ön yüz gri metal, tekme sacı, levha */}
      <path d={kanat} fill="#4c5258" stroke="#22262a" strokeWidth={4} />
      <path d={pl([yanP(ex + ux * 0.04, 0.05, ez + uz * 0.04), yanP(DX2 - 0.03, 0.05, WZ), yanP(DX2 - 0.03, 0.3, WZ), yanP(ex + ux * 0.04, 0.3, ez + uz * 0.04)])} fill="#8a9098" opacity={0.7} />
      {a < 0.9 ? <path d={pl([yanP(ex + ux * 0.25, 1.45, ez + uz * 0.25), yanP(ex + ux * 0.62, 1.45, ez + uz * 0.62), yanP(ex + ux * 0.62, 1.62, ez + uz * 0.62), yanP(ex + ux * 0.25, 1.62, ez + uz * 0.25)])} fill="#e8e0c0" stroke="#2a2e32" strokeWidth={2} opacity={1 - a} /> : null}
      {a < 0.6 ? <text transform={zMatris(WZ, ex + 0.435, 1.515, 0.0015)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={46} fill="#a01818" opacity={1 - a / 0.6}>GİRİLMEZ</text> : null}
      {/* kanadın kenarındaki ışık çizgisi (aralanınca) */}
      {acik > 0.004 && acik < 0.5 ? (
        <g opacity={Math.min(1, acik * 40)}>
          <path d={line([DX1 + 0.005, 0.01, WZ], [DX1 + 0.005, DH - 0.01, WZ])} stroke="#ffb850" strokeWidth={40} opacity={0.75} filter="url(#yanBl)" />
          <path d={pl([yanP(DX1, 0.004, WZ), yanP(DX1 + 0.08, 0.004, WZ), yanP(DX1 + 0.25, 0.004, WZ - 1.2), yanP(DX1 - 0.12, 0.004, WZ - 1.2)])} fill="#ffd890" opacity={0.6} filter="url(#yanBl)" />
          <path d={pl([yanP(DX1, 0.01, WZ), yanP(ex, 0.01, ez), yanP(ex, DH - 0.01, ez), yanP(DX1, DH - 0.01, WZ)])} fill="#fff4d0" />
          <path d={line([DX1 + 0.004, 0.01, WZ], [DX1 + 0.004, DH - 0.01, WZ])} stroke="#fffbe8" strokeWidth={4} />
        </g>
      ) : null}
      {/* kol ve kilit aynası */}
      <path d={pl([yanP(...kP(0.055, 0.88, 0.005)), yanP(...kP(0.105, 0.88, 0.005)), yanP(...kP(0.105, 1.1, 0.005)), yanP(...kP(0.055, 1.1, 0.005))])} fill="#9aa0a6" stroke="#22262a" strokeWidth={2.5} />
      <circle cx={yanP(...kP(0.08, 0.93, 0.006))[0]} cy={yanP(...kP(0.08, 0.93, 0.006))[1]} r={kolKal * 0.28} fill="#1a1c1e" />
      <path d={`M ${kdx} ${kdy} L ${kux} ${kuy}`} stroke="#22262a" strokeWidth={kolKal + 4} strokeLinecap="round" />
      <path d={`M ${kdx} ${kdy} L ${kux} ${kuy}`} stroke="#d4d8dc" strokeWidth={kolKal} strokeLinecap="round" />
      <path d={`M ${kdx} ${kdy - kolKal * 0.2} L ${kux} ${kuy - kolKal * 0.2}`} stroke="#ffffff" strokeWidth={kolKal * 0.3} strokeLinecap="round" opacity={0.85} />
      <circle cx={kdx} cy={kdy} r={kolKal * 0.75} fill="#c8ccd0" stroke="#22262a" strokeWidth={2.5} />
      {/* DEPO · PERSONEL levhası (B9: kapı çarpınca sağ vidası düşer, sol vidada sallanır: levha = açı°) */}
      {(() => {
        const [vx, vy] = yanP(DX1 + 0.16, DH + 0.38, WZ - 0.02);
        return (
          <g transform={levha ? `rotate(${levha.toFixed(2)} ${vx} ${vy})` : undefined}>
            {levha ? <path d={qZ(WZ - 0.019, DX1 + 0.1, DX2 - 0.1, DH + 0.14, DH + 0.42)} fill="#000" opacity={0.25} transform="translate(5 7)" /> : null}
            <path d={qZ(WZ - 0.02, DX1 + 0.1, DX2 - 0.1, DH + 0.14, DH + 0.42)} fill="#e8e0c0" stroke="#2a2e32" strokeWidth={3} />
            <text transform={zMatris(WZ - 0.021, (DX1 + DX2) / 2, DH + 0.27, 0.002)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={56} fill="#1a1a1a">DEPO</text>
            <text transform={zMatris(WZ - 0.021, (DX1 + DX2) / 2, DH + 0.17, 0.002)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={40} fill="#1a1a1a">PERSONEL</text>
            <circle cx={vx} cy={vy} r={4} fill="#8a9098" stroke="#2a2e32" strokeWidth={1.5} />
            {!levha ? (() => { const [wx, wy] = yanP(DX2 - 0.16, DH + 0.38, WZ - 0.02); return <circle cx={wx} cy={wy} r={4} fill="#8a9098" stroke="#2a2e32" strokeWidth={1.5} />; })() : null}
          </g>
        );
      })()}
      {/* B9: kapının altındaki aralıktan depo ışığı sızar; [ışık 0..1, gölge merkezi (0..1 kapı boyunca, <0 yok), gölge genişliği] */}
      {kapiAlt && kapiAlt[0] > 0.01 && acik < 0.02 ? (() => {
        const [isik, gx, gw] = kapiAlt;
        const cizgi = (a: number, b: number, renk: string, op: number, k: string) => (
          <path key={k} d={pl([yanP(DX1 + 0.04 + (DX2 - DX1 - 0.08) * a, 0.004, WZ - 0.005), yanP(DX1 + 0.04 + (DX2 - DX1 - 0.08) * b, 0.004, WZ - 0.005),
            yanP(DX1 + 0.04 + (DX2 - DX1 - 0.08) * b, 0.045, WZ - 0.005), yanP(DX1 + 0.04 + (DX2 - DX1 - 0.08) * a, 0.045, WZ - 0.005)])} fill={renk} opacity={op} />
        );
        const yansi = <path key="y" d={pl([yanP(DX1 + 0.02, 0.001, WZ - 0.01), yanP(DX2 - 0.02, 0.001, WZ - 0.01), yanP(DX2 + 0.16, 0.001, WZ - 0.6), yanP(DX1 - 0.16, 0.001, WZ - 0.6)])} fill="url(#kapiAltIsik)" opacity={isik} />;
        const [g0x, g0y] = yanP((DX1 + DX2) / 2, 0.01, WZ);
        return (
          <g>
            <defs>
              <linearGradient id="kapiAltIsik" gradientUnits="userSpaceOnUse" x1={g0x} y1={g0y} x2={g0x} y2={g0y + 70}><stop offset="0" stopColor="#ffb860" stopOpacity={0.55} /><stop offset="1" stopColor="#ffb860" stopOpacity={0} /></linearGradient>
              <filter id="kapiAltBlur" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="5" /></filter>
            </defs>
            <g style={{ mixBlendMode: "screen" }}>{yansi}<g filter="url(#kapiAltBlur)">{cizgi(0, 1, "#ffb050", 0.9 * isik, "gl")}</g></g>
            {cizgi(0, 1, "#ffd890", 0.95 * isik, "s")}
            {gx >= 0 ? <>{cizgi(Math.max(0, gx - gw / 2), Math.min(1, gx - gw * 0.08), "#0a0604", 0.95, "g1")}{cizgi(Math.max(0, gx + gw * 0.08), Math.min(1, gx + gw / 2), "#0a0604", 0.95, "g2")}</> : null}
          </g>
        );
      })() : null}
      {/* zemin + karolar */}
      <path d={pl([yanP(-4, 0, WZ), yanP(2.9, 0, WZ), yanP(2.9, 0, -2.4), yanP(-4, 0, -2.4)])} fill="url(#yanZemin)" />
      {[-3, -2.4, -1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8, 2.4].map((X) => <path key={`zx${X}`} d={line([X, 0, WZ], [X, 0, -2.4])} stroke="#b0b5b2" strokeWidth={2.5} />)}
      {[1.3, 0.7, 0.1, -0.5, -1.1, -1.7, -2.3].map((Z) => <path key={`zz${Z}`} d={line([-4, 0, Z], [2.9, 0, Z])} stroke="#b0b5b2" strokeWidth={2.5} />)}
      {/* zeminde floresan yansıması */}
      {[[-0.6, 0.3], [-0.6, -1.5], [1.5, 0.3]].map(([X, Z], i) => <path key={`zy${i}`} d={qY(0.001, X - 0.12, X + 0.12, Z, Z + 1.1)} fill="#ffffff" opacity={0.22 * fl} filter="url(#yanBl)" />)}
      {/* kapıdan zemine düşen sıcak ışık (aralıkta ince kama, açıkta geniş) */}
      {ic > 0.001 ? (
        <g style={{ mixBlendMode: "screen" }}>
          <path d={pl([yanP(DX1, 0, WZ), yanP(DX1 + (DX2 - DX1) * Math.min(1, acik * 1.05), 0, WZ), yanP(DX1 + 0.2 + 0.95 * Math.min(1, acik * 1.05), 0, WZ - 2.4), yanP(DX1 - 0.35, 0, WZ - 2.4)])} fill="#ffd890" opacity={0.55 * ic} filter="url(#yanBl)" />
          <rect x={-600} y={-400} width={2280} height={2720} fill="url(#yanSpill)" opacity={0.35 * Math.min(1, acik * 1.2)} />
        </g>
      ) : null}
    </g>
  );
};

/* ------------------------------------------------------------------ tezgâh (Sabri'nin önünde, Ece'nin arkasında) */
export const Market724YanTezgah: React.FC<{ sars?: number; frame: number }> = ({ sars = 0, frame }) => {
  const sx = sars > 0 ? (random(`yt${frame}`) - 0.5) * 10 * sars : 0;
  const sy = sars > 0 ? (random(`yty${frame}`) - 0.5) * 6 * sars : 0;
  const X1 = -2.2, X2 = 1.35, Z1 = 0, Z2 = 0.65, H = 0.95;
  return (
    <g transform={`translate(${sx} ${sy})`}>
      {/* zeminde tezgâhın gölgesi */}
      <path d={pl([yanP(X1, 0.002, Z1 - 0.05), yanP(X2 + 0.1, 0.002, Z1 - 0.05), yanP(X2 + 0.1, 0.002, Z1 - 0.3), yanP(X1, 0.002, Z1 - 0.3)])} fill="#000" opacity={0.12} filter="url(#yanBl)" />
      {/* ön panel (kırmızı) ve sağ uç */}
      <path d={qZ(Z1, X1, X2, 0, H - 0.05)} fill="#c63c22" stroke="#2a1410" strokeWidth={5} />
      <path d={qX(X2, Z1, Z2, 0, H - 0.05)} fill="#9a2c18" stroke="#2a1410" strokeWidth={5} />
      <path d={qZ(Z1 - 0.001, X1, X2, H - 0.12, H - 0.05)} fill="#000" opacity={0.18} />
      <text transform={zMatris(Z1 - 0.002, -0.55, 0.42, 0.0034)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={60} fill="#fff4ea">CAN MARKET</text>
      <text transform={zMatris(Z1 - 0.002, -0.55, 0.22, 0.0034)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={46} fill="#fff4ea">7/24</text>
      {/* üst tabla */}
      <path d={pl([yanP(X1, H, Z1 - 0.03), yanP(X2 + 0.03, H, Z1 - 0.03), yanP(X2 + 0.03, H, Z2), yanP(X1, H, Z2)])} fill="#f2f0ea" stroke="#5a4a40" strokeWidth={4} />
      <path d={pl([yanP(X1, H, Z1 - 0.03), yanP(X2 + 0.03, H, Z1 - 0.03), yanP(X2 + 0.03, H - 0.05, Z1 - 0.03), yanP(X1, H - 0.05, Z1 - 0.03)])} fill="#dcd8cc" stroke="#5a4a40" strokeWidth={3} />
      <path d={pl([yanP(X2 + 0.03, H, Z1 - 0.03), yanP(X2 + 0.03, H, Z2), yanP(X2 + 0.03, H - 0.05, Z2), yanP(X2 + 0.03, H - 0.05, Z1 - 0.03)])} fill="#c8c4b8" stroke="#5a4a40" strokeWidth={3} />
      <path d={line([X1, H, Z1 - 0.03], [X2 + 0.03, H, Z1 - 0.03])} stroke="#ffffff" strokeWidth={3} opacity={0.8} />
      {/* yazar kasa (sol, müşteri ekranı Ece'ye dönük) */}
      <path d={qY(H + 0.005, -1.45, -1.0, 0.2, 0.55)} fill="#3a3e44" stroke="#0a0b0d" strokeWidth={3} />
      <path d={qZ(0.2, -1.45, -1.0, H, H + 0.12)} fill="#2a2e34" stroke="#0a0b0d" strokeWidth={3} />
      <path d={pl([yanP(-1.38, H + 0.12, 0.32), yanP(-1.07, H + 0.12, 0.32), yanP(-1.07, H + 0.32, 0.36), yanP(-1.38, H + 0.32, 0.36)])} fill="#2a8a5a" stroke="#0a0b0d" strokeWidth={3} />
      {/* kart makinesi */}
      <path d={qY(H + 0.004, -0.35, -0.23, 0.32, 0.5)} fill="#1a1c20" stroke="#0a0b0d" strokeWidth={2} />
      <path d={qY(H + 0.006, -0.33, -0.25, 0.34, 0.41)} fill="#3a6aa8" />
      {/* sakız standı (Ece'nin solunda) */}
      <path d={qZ(0.08, -0.95, -0.62, H, H + 0.24)} fill="#e8e8e0" stroke="#5a4a40" strokeWidth={3} />
      {[0, 1, 2].map((i) => <path key={i} d={qZ(0.079, -0.92 + i * 0.1, -0.84 + i * 0.1, H + 0.02, H + 0.21)} fill={PAKET[i + 1]} />)}
    </g>
  );
};
/** tezgâh üst tablasının ön kenarı (ekran): Sabri'nin kollarını keserken */
export const yanTezgahUst = (X: number) => yanP(X, 0.95, 0.65)[1];

/** B9 P1 kanca: kapının altındaki aralıktan itilen beyaz spor ayakkabı (zemin düzleminde, yan açı izdüşümüyle).
 *  X,Z: ayakkabı merkezi (m); yaw: burun yönü (derece, 0 = -Z, kameraya doğru); ezik: 0 normal, 1 aralıkta yassı (negatif: "pop" taşması);
 *  iz: aralıktan sürüklenme izinin başladığı [X, Z] (depo tozu). Kapı düzleminin (Z = WZ) arkasında kalan parçalar çizilmez. */
export const YanAyakkabi: React.FC<{ X: number; Z: number; yaw: number; ezik: number; iz?: [number, number]; isik?: number }> = ({ X, Z, yaw, ezik, iz, isik = 0 }) => {
  type V3 = [number, number, number];
  const a = (yaw * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
  const sx = 1 + 0.08 * ezik, sw = 1 + 0.28 * ezik, sh = Math.max(0.2, 1 - 0.72 * ezik);
  // yerel: l burun yönü (+), s yan; dünya: burun -Z yönüne bakar (yaw 0)
  const W = (l: number, s: number, y: number): V3 => [X + s * ca + l * sx * sa, y, Z - l * sx * ca + s * sa];
  const N = 18;
  const ring = (y: (l: number) => number, ic: number) => new Array(N).fill(0).map((_, i) => {
    const th = (i / N) * Math.PI * 2, l = 0.135 * Math.cos(th);
    const w = (l > 0 ? 0.048 - 0.06 * Math.pow(l / 0.135, 3) * 0.35 : 0.044) * sw * ic;
    return W(l * (ic < 1 ? 0.94 : 1), w * Math.sin(th), y(l));
  });
  const h = (l: number) => (0.028 + (0.1 - 0.028) * Math.min(1, Math.max(0, (0.06 - l) / 0.19)) ** 0.8) * sh;
  const alt = ring(() => 0.002, 1), orta = ring(() => 0.026 * Math.max(0.45, sh), 1), ust = ring((l) => h(l), 0.82);
  // kapı düzleminin önüne kırp (Z <= WZ)
  const kirp = (pts: V3[]): V3[] => {
    const out: V3[] = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      const pi = p[2] <= WZ, qi = q[2] <= WZ;
      if (pi) out.push(p);
      if (pi !== qi) { const u = (WZ - p[2]) / (q[2] - p[2]); out.push([p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u, WZ]); }
    }
    return out;
  };
  const ciz = (pts: V3[]) => { const k = kirp(pts); return k.length >= 3 ? pl(k.map((v) => yanP(...v))) : null; };
  const derin = (pts: V3[]) => pts.reduce((m, v) => m + yanD(v[0], v[2]), 0) / pts.length;
  const yuz: { d: number; el: React.ReactNode }[] = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const tab = [alt[i], alt[j], orta[j], orta[i]], ys = [orta[i], orta[j], ust[j], ust[i]];
    const d1 = ciz(tab), d2 = ciz(ys);
    const parlak = 0.5 + 0.5 * Math.cos((i / N) * Math.PI * 2 - a + 2.2);
    const ur = parlak > 0.45 ? "#f4f4f0" : "#dcdcd6";
    if (d1) yuz.push({ d: derin(tab) + 0.001, el: <path key={`t${i}`} d={d1} fill="#c9c7c0" stroke="#c9c7c0" strokeWidth={1} /> });
    if (d2) yuz.push({ d: derin(ys), el: <path key={`u${i}`} d={d2} fill={ur} stroke={ur} strokeWidth={1} /> });
  }
  yuz.sort((p, q) => q.d - p.d);
  const ustD = ciz(ust);
  const ag = ciz(new Array(10).fill(0).map((_, i) => { const th = (i / 10) * Math.PI * 2; return W(-0.075 + 0.04 * Math.cos(th), 0.026 * sw * Math.sin(th), h(-0.075) + 0.002); }));
  const bag = [-0.02, 0.01, 0.04].map((l, i) => { const p = W(l, -0.028 * sw, h(l) + 0.004), q = W(l + 0.012, 0.028 * sw, h(l) + 0.004); return Math.max(p[2], q[2]) <= WZ ? <path key={`b${i}`} d={`M ${yanP(...p).join(" ")} L ${yanP(...q).join(" ")}`} stroke="#a8a8a2" strokeWidth={2.4} strokeLinecap="round" /> : null; });
  const golge = ciz(ring(() => 0.001, 1.25).map((v) => [v[0] + 0.015, v[1], v[2] - 0.02] as V3));
  const izD = iz ? ciz([[iz[0] - 0.05, 0.0015, iz[1]], [iz[0] + 0.05, 0.0015, iz[1]], [X + 0.045, 0.0015, Z], [X - 0.045, 0.0015, Z]]) : null;
  // dış hat: tüm görünür noktaların dışbükey zarfı (mürekkep çizgisi)
  const nok = [...alt, ...ust].filter((v) => v[2] <= WZ).map((v) => yanP(...v));
  const zarf = (() => {
    const p = [...nok].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (p.length < 3) return null;
    const cr = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo: P2[] = [], up: P2[] = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (const q of [...p].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return pl([...lo.slice(0, -1), ...up.slice(0, -1)]);
  })();
  const tabanCizgi = ciz(orta);
  return (
    <g>
      {izD ? <path d={izD} fill="#6a6458" opacity={0.22} /> : null}
      {golge ? <path d={golge} fill="#1a1612" opacity={0.4} filter="url(#yanBl3)" /> : null}
      {yuz.map((y) => y.el)}
      {tabanCizgi ? <path d={tabanCizgi} fill="none" stroke="#8a8680" strokeWidth={1.6} /> : null}
      {ustD ? <path d={ustD} fill="#fbfbf8" stroke="#6a6660" strokeWidth={1.4} /> : null}
      {ag ? <path d={ag} fill="#3a3430" stroke="#2b1d1a" strokeWidth={1.4} /> : null}
      {bag}
      {zarf ? <path d={zarf} fill="none" stroke="#2b1d1a" strokeWidth={2.6} strokeLinejoin="round" /> : null}
      {isik > 0.01 && ustD ? <path d={ustD} fill="#ffb860" opacity={0.25 * isik} style={{ mixBlendMode: "multiply" }} /> : null}
    </g>
  );
};
