import React from "react";
import { random } from "remotion";

/* =====================================================================================
 * 7/24 · Can Market (Tarlabaşı), gece. Tek bir ölçülü kat planından üç kamera açısı:
 *
 *   Kat planı (metre, yukarıdan): genişlik X -2.05..2.05, derinlik Z (0 = arka, 4 = cam vitrin/sokak).
 *   - Ön duvar (Z=4): X -2.05..1.0 cam vitrin; otomatik kapı X -1.2..0.2; X 1.0..2.05 dolu duvar + sigara dolabı.
 *   - Kasa (L biçimli): uzun kol X 0.5..1.1, Z 2.4..3.7 (müşteri yüzü sola, kapı yoluna bakar);
 *     kısa kol Z 2.4..2.9, X 0.5..1.9. Ece içeride X 1.4, Z 3.1, yüzü kapıya dönük.
 *   - Kapının içinde tavandan sarkan kırmızı dijital saat; kapının solunda ekmek reyonu.
 *   - Arka sağ: DEPO · PERSONEL kapısı.
 *
 *   genel: mağazanın içinden ön cama bakış (establishing). Kapı, saat, kasa ve Ece birlikte.
 *   kapi : kasanın yanından kapıya bakış (Ece'nin gördüğü). Ayak izleri burada.
 *   kasa : kapı tarafından kasaya ters açı (Ece'ye yarım profil/önden).
 * ===================================================================================== */

export type MarketView = "genel" | "kapi" | "kasa";
export type MarketProps = { view: MarketView; frame: number; doorOpen: number; saat: string; iz: number; turb: number; /** B4: depo kapısı 0..1 (verilmezse eski aralık çizimi) */ depoAcik?: number; /** B4: bankonun solunda kasa ağzı açıklığı */ agiz?: boolean; /** B4: banko sarsıntısı 0..1 */ sars?: number; /** B6 (opt-in, kapı): gece sokağı yerine çizilecek dış görünüm */ dis?: React.ReactNode; /** B6 (opt-in, kapı): dışla cam/kapı arasında kalan katman (kepenk) */ kepenkKatman?: React.ReactNode; /** B8 (opt-in): camın ardındaki sokakta yağmur yoğunluğu (0 = yağmur yok) */ yagmur?: number };

const W = 1080;
const H = 1920;

/** floresan titremesi (turb > 0 iken) */
const flicker = (frame: number, turb: number) => (turb > 0 ? (random(`mk724f${Math.floor(frame / 2)}`) > 1 - turb * 0.55 ? 0.45 : 1) : 1);

/* ------------------------------ ortak parçalar ------------------------------ */

/** Gece sokağı (camın ardı): karşı bina, kepenkli dükkân, sokak lambası, ıslak asfalt, yağmur. Kendi koordinatında (x,y,w,h). */
const Sokak: React.FC<{ id: string; x: number; y: number; w: number; h: number; ufuk: number; frame: number; yogun?: number }> = ({ id, x, y, w, h, ufuk, frame, yogun = 1 }) => {
  const lampX = x + w * 0.78;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060a12" />
          <stop offset="1" stopColor="#0e1522" />
        </linearGradient>
        <radialGradient id={`${id}l`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb860" stopOpacity={0.55} />
          <stop offset="1" stopColor="#ffb860" stopOpacity={0} />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${id}g)`} />
        {/* karşı bina: eski Tarlabaşı cephesi */}
        <rect x={x} y={y} width={w} height={ufuk - y} fill="#121822" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={x + w * (0.06 + i * 0.25)} y={y + (ufuk - y) * 0.1} width={w * 0.12} height={(ufuk - y) * 0.32} fill={i === 2 ? "#a8803c" : "#1a2230"} stroke="#0a0e14" strokeWidth={3} />
            {i === 2 ? <path d={`M ${x + w * (0.12 + i * 0.25)} ${y + (ufuk - y) * 0.1} v ${(ufuk - y) * 0.32} M ${x + w * (0.06 + i * 0.25)} ${y + (ufuk - y) * 0.26} h ${w * 0.12}`} stroke="#3a2a14" strokeWidth={4} /> : null}
            <path d={`M ${x + w * (0.04 + i * 0.25)} ${y + (ufuk - y) * 0.45} h ${w * 0.16}`} stroke="#0a0e14" strokeWidth={5} />
          </g>
        ))}
        {/* kepenk (kapalı dükkân) */}
        <rect x={x + w * 0.05} y={y + (ufuk - y) * 0.58} width={w * 0.5} height={(ufuk - y) * 0.42} fill="#2a3038" />
        {new Array(9).fill(0).map((_, i) => (
          <path key={i} d={`M ${x + w * 0.05} ${y + (ufuk - y) * (0.6 + i * 0.045)} h ${w * 0.5}`} stroke="#1a1e24" strokeWidth={3} />
        ))}
        {/* kaldırım ve ıslak yol */}
        <rect x={x} y={ufuk} width={w} height={(y + h - ufuk) * 0.35} fill="#1a2028" />
        <rect x={x} y={ufuk + (y + h - ufuk) * 0.35} width={w} height={(y + h - ufuk) * 0.65} fill="#0c1018" />
        <path d={`M ${x} ${ufuk + (y + h - ufuk) * 0.35} h ${w}`} stroke="#3a4450" strokeWidth={4} />
        {/* sokak lambası ve asfalttaki yansıması */}
        <rect x={lampX - 4} y={y} width={8} height={ufuk + (y + h - ufuk) * 0.3 - y} fill="#0a0d12" />
        <circle cx={lampX} cy={y + 20} r={w * 0.22} fill={`url(#${id}l)`} />
        <rect x={lampX - 14} y={ufuk + (y + h - ufuk) * 0.4} width={28} height={(y + h - ufuk) * 0.6} fill="#ffb860" opacity={0.16} />
        <rect x={lampX - 5} y={ufuk + (y + h - ufuk) * 0.4} width={10} height={(y + h - ufuk) * 0.6} fill="#ffc880" opacity={0.25} />
        {/* yağmur */}
        {new Array(Math.round(46 * yogun)).fill(0).map((_, i) => {
          const rx = x + ((i * 61) % 1000) / 1000 * w;
          const ry = y + ((frame * 31 + i * 89) % Math.max(1, h));
          return <path key={i} d={`M ${rx} ${ry} l -5 ${h * 0.05}`} stroke="#9ab4cc" strokeWidth={2} opacity={0.45} />;
        })}
        {/* yağmur sıçraması (yol) */}
        {new Array(yogun > 0 ? 10 : 0).fill(0).map((_, i) => {
          const k = (frame + i * 7) % 14;
          const sx = x + ((i * 137) % 1000) / 1000 * w;
          const sy = ufuk + (y + h - ufuk) * (0.45 + ((i * 53) % 50) / 100);
          return <ellipse key={i} cx={sx} cy={sy} rx={2 + k} ry={(2 + k) * 0.3} fill="none" stroke="#7a90a8" strokeWidth={1.5} opacity={Math.max(0, 0.5 - k / 28)} />;
        })}
      </g>
    </g>
  );
};

/** Islak ayak izi (tek). Zeminde perspektifle: s = ölçek, ang = yürüyüş yönü (radyan, ekranda), sag = sağ ayak. */
const Iz: React.FC<{ x: number; y: number; s: number; ang: number; sag: boolean; a: number; squash?: number }> = ({ x, y, s, ang, sag, a, squash = 0.42 }) => {
  if (a <= 0) return null;
  const deg = (ang * 180) / Math.PI + 90;
  const ox = (sag ? 1 : -1) * 11 * s;
  return (
    <g transform={`translate(${x} ${y}) scale(1 ${squash}) rotate(${deg}) translate(${ox} 0)`} opacity={a}>
      {/* ön taban */}
      <path d={`M ${-11 * s} ${-12 * s} Q ${-13 * s} ${-36 * s} 0 ${-40 * s} Q ${13 * s} ${-36 * s} ${11 * s} ${-12 * s} Q ${9 * s} ${2 * s} 0 ${2 * s} Q ${-9 * s} ${2 * s} ${-11 * s} ${-12 * s} Z`} fill="#55656f" opacity={0.42} />
      {/* topuk */}
      <path d={`M ${-9 * s} ${14 * s} Q ${-10 * s} ${32 * s} 0 ${33 * s} Q ${10 * s} ${32 * s} ${9 * s} ${14 * s} Z`} fill="#55656f" opacity={0.42} />
      {/* taban dişleri */}
      {[-26, -18, -10].map((yy) => <path key={yy} d={`M ${-8 * s} ${yy * s} h ${16 * s}`} stroke="#3e4c56" strokeWidth={1.6 * s} opacity={0.35} />)}
      {/* ıslak parıltı */}
      <path d={`M ${-6 * s} ${-30 * s} Q 0 ${-36 * s} ${6 * s} ${-30 * s}`} stroke="#f4fbff" strokeWidth={2.5 * s} fill="none" opacity={0.75} />
      <path d={`M ${-5 * s} ${18 * s} Q 0 ${14 * s} ${5 * s} ${18 * s}`} stroke="#f4fbff" strokeWidth={2 * s} fill="none" opacity={0.6} />
      {/* damlalar */}
      <circle cx={16 * s} cy={-20 * s} r={1.6 * s} fill="#5a6a76" opacity={0.4} />
    </g>
  );
};

/** İz yolu: kapı paspasından kasaya. pts = [x, y, s] noktaları; iz = 0..1 ilerleme. Son iz yeni basılmış gibi parlar. */
const IzYolu: React.FC<{ pts: [number, number, number][]; iz: number; squash?: number }> = ({ pts, iz, squash }) => {
  const n = pts.length;
  const shown = iz * n;
  return (
    <g>
      {pts.map(([x, y, s], i) => {
        const a = Math.max(0, Math.min(1, (shown - i) * 4));
        const nx = pts[Math.min(n - 1, i + 1)], px = pts[Math.max(0, i - 1)];
        const ang = Math.atan2(nx[1] - px[1], nx[0] - px[0]);
        const fresh = Math.max(0, 1 - (shown - i - 0.25) * 1.5);
        return (
          <g key={i}>
            <Iz x={x} y={y} s={s} ang={ang} sag={i % 2 === 1} a={a} squash={squash} />
            {/* basış anında küçük su halkası */}
            {a > 0 && fresh > 0 ? <ellipse cx={x} cy={y} rx={(30 + (1 - fresh) * 40) * s} ry={(30 + (1 - fresh) * 40) * s * 0.35} fill="none" stroke="#e8f4ff" strokeWidth={2} opacity={fresh * 0.6} /> : null}
          </g>
        );
      })}
    </g>
  );
};

/** Kırmızı LED saat kutusu */
const Saat: React.FC<{ x: number; y: number; w: number; saat: string; id: string }> = ({ x, y, w, saat, id }) => {
  const h = w * 0.38;
  return (
    <g>
      <defs>
        <filter id={`${id}p`} x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation={w * 0.025} /></filter>
      </defs>
      <rect x={x - w / 2} y={y} width={w} height={h} rx={w * 0.04} fill="#160606" stroke="#2c2c2e" strokeWidth={w * 0.025} />
      <rect x={x - w / 2 + w * 0.05} y={y + h * 0.12} width={w * 0.9} height={h * 0.76} fill="#0c0303" />
      <text x={x} y={y + h * 0.78} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={h * 0.74} fill="#ff2a1a" filter={`url(#${id}p)`} opacity={0.9}>{saat}</text>
      <text x={x} y={y + h * 0.78} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={h * 0.74} fill="#ff3a24">{saat}</text>
      <ellipse cx={x} cy={y + h * 1.6} rx={w * 0.7} ry={h * 0.5} fill="#ff2a1a" opacity={0.05} />
    </g>
  );
};

/** Raf ürünleri: renkli paketler (marka yok) */
const PAKET = ["#d8402e", "#2f6fd0", "#e8a628", "#2f9e5a", "#e86a9a", "#f2f0e6", "#7a4ad0", "#e85a1a"];

/* =================================== GENEL =================================== */
// Kamera: X 0, göz yüksekliği 1.6 m, +Z (ön cama) bakar. Odak 760 px, kaçış noktası (540, 826).
const VX = 540, VY = 826, F = 760;
const P = (X: number, Y: number, Z: number): [number, number] => [VX + (X * F) / Z, VY - ((Y - 1.6) * F) / Z];
const poly = (pts: [number, number][]) => `M ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")} Z`;
/** X sabit düşey yüzey (Z1..Z2, Y1..Y2) */
const yuzX = (X: number, Z1: number, Z2: number, Y1: number, Y2: number) => poly([P(X, Y1, Z1), P(X, Y1, Z2), P(X, Y2, Z2), P(X, Y2, Z1)]);
/** Z sabit düşey yüzey */
const yuzZ = (Z: number, X1: number, X2: number, Y1: number, Y2: number) => poly([P(X1, Y1, Z), P(X2, Y1, Z), P(X2, Y2, Z), P(X1, Y2, Z)]);
/** Y sabit yatay yüzey */
const yuzY = (Y: number, X1: number, X2: number, Z1: number, Z2: number) => poly([P(X1, Y, Z1), P(X2, Y, Z1), P(X2, Y, Z2), P(X1, Y, Z2)]);

const GenelBG: React.FC<MarketProps> = ({ frame, doorOpen, saat, iz, turb }) => {
  const fl = flicker(frame, turb);
  const op = Math.max(0, Math.min(1, doorOpen));
  const ZF = 4;
  const [gx1, gy1] = P(-2.05, 2.6, ZF);
  const [gx2, gy2] = P(1.0, 0.3, ZF);
  const [, ufuk] = P(0, 0.05, 6.5);
  // otomatik kapı kanatları (X -1.2..-0.5 ve -0.5..0.2), dışa kayar
  const kL1 = -1.2 - 0.68 * op, kL2 = -0.5 - 0.68 * op;
  const kR1 = -0.5 + 0.68 * op, kR2 = 0.2 + 0.68 * op;
  const izPts: [number, number, number][] = [
    [-0.55, 3.85], [-0.4, 3.62], [-0.18, 3.42], [0.02, 3.24], [0.22, 3.08], [0.36, 2.95],
  ].map(([X, Z]) => { const [x, y] = P(X, 0, Z); return [x, y, (760 / Z / 260) * 1.5]; });
  return (
    <g>
      <defs>
        <linearGradient id="g724tav" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d4d8da" /><stop offset="1" stopColor="#eceff0" /></linearGradient>
        <linearGradient id="g724zem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9cdca" /><stop offset="1" stopColor="#e6e8e4" /></linearGradient>
        <linearGradient id="g724tup" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff" stopOpacity={0} /><stop offset="0.5" stopColor="#ffffff" /><stop offset="1" stopColor="#ffffff" stopOpacity={0} /></linearGradient>
        <radialGradient id="g724vin" cx="0.5" cy="0.46" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.5} /></radialGradient>
        <filter id="g724bl"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      <rect width={W} height={H} fill="#e2e5e6" />
      {/* tavan + asma tavan ızgarası */}
      <path d={poly([[0, 0], [W, 0], ...[P(2.05, 3, 2.885), P(2.05, 3, ZF), P(-2.05, 3, ZF), P(-2.05, 3, 2.885)]] as [number, number][])} fill="url(#g724tav)" />
      {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((X) => { const a = P(X, 3, 1.2), b = P(X, 3, ZF); return <path key={X} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke="#b8bec2" strokeWidth={2} />; })}
      {[1.6, 2.2, 2.8, 3.4].map((Z) => { const a = P(-2.05, 3, Z), b = P(2.05, 3, Z); return <path key={Z} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke="#b8bec2" strokeWidth={2} />; })}
      {/* floresan armatürler: iki sıra */}
      {[-0.9, 0.9].map((X) => [1.6, 2.8].map((Z) => (
        <g key={`${X}${Z}`}>
          <path d={yuzY(2.99, X - 0.16, X + 0.16, Z, Z + 0.9)} fill="#f4f6f6" stroke="#9aa2a6" strokeWidth={3} />
          <path d={yuzY(2.98, X - 0.1, X + 0.1, Z + 0.04, Z + 0.86)} fill="#ffffff" opacity={fl} />
          <path d={yuzY(2.98, X - 0.3, X + 0.3, Z - 0.1, Z + 1)} fill="#ffffff" opacity={0.35 * fl} filter="url(#g724bl)" />
        </g>
      )))}
      {/* sol duvar + sağ duvar (yakın kısımlar) */}
      <path d={yuzX(-2.05, 2.885, ZF, 0, 3)} fill="#cfd4d6" />
      <path d={yuzX(2.05, 2.885, ZF, 0, 3)} fill="#c8cdd0" />
      {/* sağ duvarda sigara rafı (Ece'nin arkası) */}
      <path d={yuzX(2.04, 2.885, ZF, 1.0, 2.2)} fill="#2a2e34" />
      {[1.25, 1.5, 1.75, 2.0].map((Y) => { const a = P(2.03, Y, 2.885), b = P(2.03, Y, ZF); return <path key={Y} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke="#5a6068" strokeWidth={3} />; })}
      {/* ön duvar */}
      <path d={yuzZ(ZF, -2.05, 2.05, 0, 3)} fill="#d6dadb" />
      {/* tabela kutusunun içi (camın üstü) */}
      <path d={yuzZ(ZF, -2.05, 1.0, 2.6, 3)} fill="#bfc5c8" />
      {/* cam vitrin: sokak */}
      <Sokak id="g724s" x={gx1} y={gy1} w={gx2 - gx1} h={gy2 - gy1} ufuk={ufuk} frame={frame} />
      {/* açık kapı aralığı: içeri yağmur ve soğuk hava */}
      {op > 0 ? <path d={yuzZ(ZF - 0.01, -0.5 - 0.68 * op, -0.5 + 0.68 * op, 0, 2.2)} fill="#9ab4cc" opacity={0.06 * op} /> : null}
      {/* camdaki iç mekân yansımaları (floresan çizgileri) */}
      {[0.15, 0.42, 0.7].map((k, i) => <path key={i} d={`M ${gx1 + (gx2 - gx1) * k} ${gy1 + 10} l ${(gx2 - gx1) * 0.16} ${(gy2 - gy1) * 0.55}`} stroke="#ffffff" strokeWidth={10} opacity={0.05} />)}
      {/* kapı kanatları (cam + alüminyum çerçeve) */}
      {[[kL1, kL2], [kR1, kR2]].map(([a, b], i) => (
        <g key={i}>
          <path d={yuzZ(ZF - 0.02, a, b, 0.02, 2.2)} fill="#a8c4d8" opacity={0.16} stroke="#8a9298" strokeWidth={6} />
          <path d={yuzZ(ZF - 0.02, a + 0.05, b - 0.05, 1.05, 1.15)} fill="#eef4f6" opacity={0.85} />
        </g>
      ))}
      {/* "GİRİŞ" etiketi sağ kanatta */}
      {(() => { const [tx, ty] = P((kR1 + kR2) / 2, 1.3, ZF - 0.02); return <text x={tx} y={ty} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={17} fill="#e8eef2">GİRİŞ</text>; })()}
      {/* vitrin çerçeveleri */}
      {[-2.05, -1.2, 0.2, 1.0].map((X) => <path key={X} d={yuzZ(ZF, X - 0.03, X + 0.03, 0, 2.6)} fill="#9aa2a8" />)}
      <path d={yuzZ(ZF, -2.05, 1.0, 2.2, 2.26)} fill="#9aa2a8" />
      <path d={yuzZ(ZF, -2.05, 1.0, 2.55, 2.62)} fill="#9aa2a8" />
      <path d={yuzZ(ZF, -2.05, -1.2, 0, 0.3)} fill="#8a9298" />
      <path d={yuzZ(ZF, 0.2, 1.0, 0, 0.3)} fill="#8a9298" />
      {/* kapı sensörü */}
      <path d={yuzZ(ZF - 0.03, -0.75, -0.25, 2.27, 2.42)} fill="#3a3e44" />
      <circle cx={P(-0.5, 2.34, ZF - 0.03)[0]} cy={P(-0.5, 2.34, ZF - 0.03)[1]} r={3} fill={op > 0 && op < 1 ? "#ff3020" : "#30d060"} />
      {/* camda ters okunan neon */}
      {(() => { const [nx, ny] = P(0.6, 1.95, ZF); return (
        <g>
          <rect x={nx - 62} y={ny - 26} width={124} height={34} rx={8} fill="#ff4a8a" opacity={0.12} />
          <text x={nx} y={ny} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={24} fill="#ff6aa0" transform={`scale(-1 1) translate(${-2 * nx} 0)`}>AÇIK 7/24</text>
        </g>
      ); })()}
      {/* sigara dolabı (ön duvar, kasanın arkası) */}
      <path d={yuzZ(ZF - 0.05, 1.05, 2.0, 1.0, 2.4)} fill="#22262c" stroke="#0e1014" strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => (
        <path key={`${r}${c}`} d={yuzZ(ZF - 0.06, 1.1 + c * 0.13, 1.2 + c * 0.13, 1.1 + r * 0.26, 1.28 + r * 0.26)} fill={PAKET[(r * 3 + c) % PAKET.length]} opacity={0.85} />
      )))}
      <path d={yuzZ(ZF - 0.07, 1.05, 2.0, 1.0, 2.4)} fill="#bcd4e4" opacity={0.1} />
      {/* ekmek reyonu (kapının solu, camın önünde) */}
      <path d={yuzZ(3.75, -1.95, -1.3, 0, 1.1)} fill="#b07838" stroke="#5a3a18" strokeWidth={4} />
      {[0.35, 0.7].map((Y) => <path key={Y} d={yuzZ(3.74, -1.95, -1.3, Y - 0.02, Y)} fill="#5a3a18" />)}
      {[0, 1, 2, 3].map((i) => [0.42, 0.77].map((Y) => { const [bx, by] = P(-1.85 + i * 0.16, Y + 0.08, 3.74); return <ellipse key={`${i}${Y}`} cx={bx} cy={by} rx={14} ry={9} fill="#f2d49a" stroke="#9a6a2a" strokeWidth={2} />; }))}
      {/* zemin + karolar */}
      <path d={poly([P(-2.05, 0, 1.0), P(2.05, 0, 1.0), P(2.05, 0, ZF), P(-2.05, 0, ZF)])} fill="url(#g724zem)" />
      {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((X) => { const a = P(X, 0, 1.05), b = P(X, 0, ZF); return <path key={X} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke="#b4b9b6" strokeWidth={2.5} />; })}
      {[1.3, 1.6, 2.0, 2.4, 2.9, 3.4].map((Z) => { const a = P(-2.05, 0, Z), b = P(2.05, 0, Z); return <path key={Z} d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke="#b4b9b6" strokeWidth={2.5} />; })}
      {/* zeminde floresan yansıması + kapıdan düşen gece ışığı */}
      {[-0.9, 0.9].map((X) => <path key={X} d={yuzY(0.001, X - 0.1, X + 0.1, 1.6, 3.7)} fill="#ffffff" opacity={0.28 * fl} filter="url(#g724bl)" />)}
      <path d={yuzY(0.001, -1.2, 0.2, 3.3, ZF)} fill="#6a86a8" opacity={0.12 + 0.1 * op} />
      {/* paspas */}
      <path d={yuzY(0.005, -1.1, 0.1, 3.55, 3.95)} fill="#3a3e44" />
      {/* ıslak izler (kapıdan kasaya) */}
      <IzYolu pts={izPts} iz={iz} squash={0.3} />
      {/* kapının iç tarafında tavandan sarkan saat */}
      {(() => {
        const [cx, cy] = P(-0.5, 2.62, 3.6);
        const [, r1] = P(-0.5, 3, 3.6);
        return (
          <g>
            <path d={`M ${cx - 55} ${r1} L ${cx - 55} ${cy} M ${cx + 55} ${r1} L ${cx + 55} ${cy}`} stroke="#6a7076" strokeWidth={3} />
            <Saat x={cx} y={cy} w={190} saat={saat} id="g724sa" />
          </g>
        );
      })()}
      {/* sol önde reyon (ürünler koridora bakar) */}
      <path d={yuzZ(2.6, -1.9, -1.2, 0, 1.7)} fill="#d4d8da" stroke="#8a9298" strokeWidth={4} />
      <path d={yuzX(-1.2, 1.05, 2.6, 0, 1.7)} fill="#eef0f0" stroke="#8a9298" strokeWidth={4} />
      {[0.15, 0.55, 0.95, 1.35].map((Y, r) => (
        <g key={Y}>
          <path d={yuzX(-1.19, 1.05, 2.6, Y - 0.03, Y)} fill="#9aa2a8" />
          {new Array(9).fill(0).map((_, c) => {
            const z1 = 1.12 + c * 0.165, z2 = z1 + 0.13;
            return <path key={c} d={yuzX(-1.18, z1, z2, Y + 0.02, Y + 0.3)} fill={PAKET[(r * 2 + c) % PAKET.length]} />;
          })}
          <path d={yuzX(-1.17, 1.05, 2.6, Y - 0.02, Y + 0.04)} fill="#f8e070" opacity={0.9} />
        </g>
      ))}
      {/* tekinsiz soğuk parlaklık + kenar kararması */}
      <rect width={W} height={H} fill="#a8c8ff" opacity={0.05} />
      <rect width={W} height={H} fill="url(#g724vin)" />
      <rect width={W} height={H} fill="#000" opacity={(1 - fl) * 0.4} />
    </g>
  );
};

/** genel: Ece'nin önündeki L kasa */
const GenelFG: React.FC<MarketProps> = () => (
  <g>
    {/* uzun kol: müşteri yüzü (X=0.5), sola bakar */}
    <path d={yuzX(0.5, 2.4, 3.7, 0, 0.95)} fill="#c23a22" stroke="#2a1410" strokeWidth={4} />
    <path d={yuzY(0.95, 0.46, 1.1, 2.9, 3.7)} fill="#f2f0ea" stroke="#5a4a40" strokeWidth={3} />
    {/* kısa kol (kameraya bakan uç) */}
    <path d={yuzY(0.95, 0.46, 1.9, 2.4, 2.9)} fill="#f2f0ea" stroke="#5a4a40" strokeWidth={3} />
    <path d={yuzZ(2.4, 0.46, 1.9, 0, 0.95)} fill="#d84a2a" stroke="#2a1410" strokeWidth={5} />
    <path d={yuzZ(2.39, 0.46, 1.9, 0.86, 0.95)} fill="#f2f0ea" />
    {(() => { const [tx, ty] = P(1.18, 0.42, 2.39); return (
      <g>
        <text x={tx} y={ty} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={44} fill="#fff4ea">CAN MARKET</text>
        <text x={tx} y={ty + 46} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={34} fill="#fff4ea">7/24</text>
      </g>
    ); })()}
    {/* yazar kasa (müşteri ekranı sola) + kart makinesi */}
    <path d={yuzX(0.7, 3.05, 3.35, 0.95, 1.18)} fill="#2a2e34" stroke="#0a0b0d" strokeWidth={3} />
    <path d={yuzX(0.69, 3.09, 3.31, 1.0, 1.14)} fill="#3aa06a" opacity={0.85} />
    <path d={yuzY(1.18, 0.7, 0.98, 3.05, 3.35)} fill="#3a3e44" />
    <path d={yuzX(0.8, 2.55, 2.68, 0.95, 1.08)} fill="#1a1c20" />
    {/* sakız standı */}
    <path d={yuzZ(2.45, 1.45, 1.8, 0.95, 1.2)} fill="#e8e8e0" stroke="#5a4a40" strokeWidth={3} />
    {[0, 1, 2].map((i) => <path key={i} d={yuzZ(2.44, 1.48 + i * 0.105, 1.57 + i * 0.105, 0.98, 1.17)} fill={PAKET[i + 1]} />)}
  </g>
);

/* =================================== KAPI =================================== */
// Kasanın yanından kapıya bakış. Duvar düzlemi: tavan y=380, zemin y=1250 (3 m → 290 px/m). Kaçış noktası (540, 786).
const KVY = 786, KFL = 1250, KS = 290;
const KapiBG: React.FC<MarketProps> = ({ frame, doorOpen, saat, iz, turb, dis, kepenkKatman, yagmur }) => {
  const fl = flicker(frame, turb);
  const op = Math.max(0, Math.min(1, doorOpen));
  const dx1 = 300, dx2 = 800, dTop = KFL - 2.2 * KS; // kapı 500 px (~1.7 m), 2.2 m
  const mid = (dx1 + dx2) / 2;
  const half = (dx2 - dx1) / 2;
  const sl = half * 0.96 * op;
  const ufuk = KFL - 120;
  // ayak izleri: paspastan kameraya (kasaya) doğru
  const izPts: [number, number, number][] = [
    [540, 1290], [585, 1350], [600, 1425], [640, 1510], [650, 1610], [690, 1720], [700, 1845],
  ].map(([x, y]) => [x, y, ((y - KVY) / (KFL - KVY)) * 1.45]);
  return (
    <g>
      <defs>
        <linearGradient id="k724zem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c6cbc8" /><stop offset="1" stopColor="#e8eae6" /></linearGradient>
        <radialGradient id="k724vin" cx="0.5" cy="0.45" r="0.78"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.55} /></radialGradient>
        <filter id="k724bl"><feGaussianBlur stdDeviation="14" /></filter>
        <clipPath id="k724cam"><rect x={0} y={420} width={W} height={KFL - 420 - 60} /></clipPath>
      </defs>
      <rect width={W} height={H} fill="#dfe3e4" />
      {/* tavan + armatür */}
      <rect width={W} height={380} fill="#e4e7e8" />
      {[120, 260].map((y, i) => <path key={y} d={`M 0 ${y} H ${W}`} stroke="#c2c8cc" strokeWidth={3} opacity={0.7 - i * 0.2} />)}
      <rect x={180} y={150} width={720} height={70} rx={8} fill="#f6f8f8" stroke="#9aa2a6" strokeWidth={4} />
      <rect x={200} y={168} width={680} height={34} rx={6} fill="#ffffff" opacity={fl} />
      <rect x={150} y={120} width={780} height={140} fill="#ffffff" opacity={0.3 * fl} filter="url(#k724bl)" />
      {/* ön duvar (iç) */}
      <rect y={380} width={W} height={KFL - 380} fill="#d2d6d8" />
      {/* cam vitrin: tüm genişlik; dışarısı */}
      {dis ?? <Sokak id="k724s" x={0} y={420} w={W} h={KFL - 420 - 60} ufuk={ufuk} frame={frame} yogun={yagmur ?? 1.4} />}
      {kepenkKatman ?? null}
      {/* camdaki yansımalar */}
      <g clipPath="url(#k724cam)">
        {[90, 420, 860].map((x, i) => <path key={i} d={`M ${x} 420 l 150 700`} stroke="#ffffff" strokeWidth={22} opacity={0.045} />)}
        <rect x={180} y={430} width={720} height={26} fill="#ffffff" opacity={0.06 * fl} />
      </g>
      {/* açık kapı aralığından içeri esen yağmur */}
      {op > 0.05 && !dis && yagmur !== 0 ? new Array(16).fill(0).map((_, i) => {
        const yy = dTop + ((frame * 38 + i * 71) % (KFL - dTop + 120));
        const xx = mid - sl + ((i * 53) % 100) / 100 * sl * 2;
        return <path key={i} d={`M ${xx} ${yy} l -4 22`} stroke="#b8d0e4" strokeWidth={2.5} opacity={0.5 * op} />;
      }) : null}
      {/* kapı kanatları: ortadan iki yana kayar (sabit camın önünden) */}
      {[[dx1 - sl, mid - sl], [mid + sl, dx2 + sl]].map(([a, b], i) => (
        <g key={i}>
          <rect x={a} y={dTop} width={b - a} height={KFL - dTop} fill="#a8c4d8" opacity={0.18} stroke="#8a9298" strokeWidth={10} />
          <rect x={a + 14} y={dTop + 0.48 * (KFL - dTop)} width={b - a - 28} height={18} fill="#eef4f6" opacity={0.85} />
          {i === 1 ? <text x={(a + b) / 2} y={dTop + 0.44 * (KFL - dTop)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={34} fill="#e8eef2" opacity={0.9}>GİRİŞ</text> : null}
          {i === 0 ? <text x={(a + b) / 2} y={dTop + 0.44 * (KFL - dTop)} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={26} fill="#e8eef2" opacity={0.8}>İTMEYİNİZ</text> : null}
        </g>
      ))}
      {/* vitrin kayıtları ve kapı kasası */}
      {[0, dx1, dx2, W].map((x) => <rect key={x} x={x - 9} y={420} width={18} height={KFL - 420} fill="#9aa2a8" />)}
      <rect x={0} y={dTop - 16} width={W} height={18} fill="#9aa2a8" />
      <rect x={0} y={410} width={W} height={16} fill="#9aa2a8" />
      <rect x={0} y={KFL - 60} width={dx1} height={60} fill="#8a9298" />
      <rect x={dx2} y={KFL - 60} width={W - dx2} height={60} fill="#8a9298" />
      {/* sensör */}
      <rect x={mid - 80} y={dTop - 62} width={160} height={42} rx={6} fill="#3a3e44" />
      <circle cx={mid + 56} cy={dTop - 41} r={6} fill={op > 0 && op < 1 ? "#ff3020" : "#30d060"} />
      {/* ters neon (sağ cam) */}
      <rect x={850} y={560} width={200} height={60} rx={12} fill="#ff4a8a" opacity={0.12} />
      <text x={950} y={604} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={40} fill="#ff6aa0" transform="scale(-1 1) translate(-1900 0)">AÇIK 7/24</text>
      {/* ekmek reyonu (sol, camın önünde) */}
      <path d="M 0 840 L 240 860 L 250 1330 L 0 1350 Z" fill="#b07838" stroke="#5a3a18" strokeWidth={6} />
      {[990, 1150].map((y) => <path key={y} d={`M 0 ${y} L 246 ${y + 8}`} stroke="#5a3a18" strokeWidth={10} />)}
      {[0, 1, 2].map((i) => [960, 1120, 1290].map((y) => <ellipse key={`${i}${y}`} cx={50 + i * 72} cy={y - 18} rx={32} ry={20} fill="#f2d49a" stroke="#9a6a2a" strokeWidth={3} />))}
      <rect x={10} y={866} width={220} height={40} fill="#f8f4e8" stroke="#5a3a18" strokeWidth={3} />
      <text x={120} y={896} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={26} fill="#5a3a18">TAZE EKMEK</text>
      {/* zemin */}
      <rect y={KFL} width={W} height={H - KFL} fill="url(#k724zem)" />
      {[-6, -4, -2, 0, 2, 4, 6].map((k) => <path key={k} d={`M ${540 + k * 90} ${KFL} L ${540 + k * 90 + ((540 + k * 90 - 540) * (H - KFL)) / (KFL - KVY)} ${H}`} stroke="#b2b8b4" strokeWidth={3} />)}
      {[1290, 1350, 1440, 1570, 1760].map((y) => <path key={y} d={`M 0 ${y} H ${W}`} stroke="#b2b8b4" strokeWidth={3} />)}
      {/* zeminde kapı ve floresan yansıması */}
      <rect x={dx1 + 30} y={KFL} width={dx2 - dx1 - 60} height={420} fill="#2a3a50" opacity={0.16} filter="url(#k724bl)" />
      <rect x={300} y={1500} width={480} height={60} fill="#ffffff" opacity={0.22 * fl} filter="url(#k724bl)" />
      {/* paspas: HOŞ GELDİNİZ */}
      <path d={`M ${dx1 + 20} ${KFL + 6} L ${dx2 - 20} ${KFL + 6} L ${dx2 + 10} ${KFL + 80} L ${dx1 - 10} ${KFL + 80} Z`} fill="#33373c" />
      <text x={mid} y={KFL + 60} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={40} fill="#8a9096" transform={`translate(${mid} ${KFL + 45}) scale(1 0.62) translate(${-mid} ${-(KFL + 45)})`}>HOŞ GELDİNİZ</text>
      {/* paspasta ıslaklık: iz başlayınca koyulaşır */}
      <ellipse cx={mid} cy={KFL + 44} rx={70} ry={20} fill="#0e1216" opacity={Math.min(1, iz * 6) * 0.35} />
      {/* ıslak ayak izleri */}
      <IzYolu pts={izPts} iz={iz} squash={0.42} />
      {/* tavandan sarkan saat (kapının iç tarafında, kameraya yakın) */}
      <path d="M 455 0 L 455 300 M 625 0 L 625 300" stroke="#6a7076" strokeWidth={5} />
      <Saat x={540} y={300} w={300} saat={saat} id="k724sa" />
      <rect width={W} height={H} fill="#a8c8ff" opacity={0.05} />
      <rect width={W} height={H} fill="url(#k724vin)" />
      <rect width={W} height={H} fill="#000" opacity={(1 - fl) * 0.4} />
    </g>
  );
};

/** kapı: sağ önde kasanın köşesi (Ece'nin tarafı) */
const KapiFG: React.FC<MarketProps> = () => (
  <g>
    <path d="M 870 1580 L 1080 1540 L 1080 1920 L 930 1920 Z" fill="#c23a22" stroke="#2a1410" strokeWidth={6} />
    <path d="M 840 1560 L 1080 1515 L 1080 1545 L 872 1588 Z" fill="#f2f0ea" stroke="#5a4a40" strokeWidth={4} />
    <rect x={930} y={1430} width={120} height={110} rx={8} fill="#e8e8e0" stroke="#5a4a40" strokeWidth={4} transform="rotate(-8 990 1485)" />
    {[0, 1, 2].map((i) => <rect key={i} x={942 + i * 36} y={1442} width={30} height={84} fill={PAKET[i + 2]} transform="rotate(-8 990 1485)" />)}
  </g>
);

/* =================================== KASA =================================== */
// Kapı tarafından kasaya ters açı: Ece önden/yarım profil, arkasında sigara dolabı, solda vitrin köşesi, sağda DEPO kapısı.
const KasaBG: React.FC<MarketProps> = ({ frame, doorOpen, saat, turb, depoAcik, yagmur }) => {
  const fl = flicker(frame, turb);
  const op = Math.max(0, Math.min(1, doorOpen));
  const sec = 14 + Math.floor(frame / 30);
  return (
    <g>
      <defs>
        <linearGradient id="c724d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dde1e2" /><stop offset="1" stopColor="#c9ced0" /></linearGradient>
        <radialGradient id="c724key" cx="0.5" cy="0.05" r="0.75"><stop offset="0" stopColor="#ffffff" stopOpacity={0.45} /><stop offset="1" stopColor="#ffffff" stopOpacity={0} /></radialGradient>
        <radialGradient id="c724vin" cx="0.5" cy="0.45" r="0.78"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.55} /></radialGradient>
        <filter id="c724bl"><feGaussianBlur stdDeviation="12" /></filter>
        <clipPath id="c724m"><rect x={86} y={300} width={232} height={150} /></clipPath>
      </defs>
      {/* arka duvar */}
      <rect width={W} height={H} fill="url(#c724d)" />
      {/* tavan şeridi + floresan (anahtar ışık, üstten) */}
      <rect width={W} height={120} fill="#e6e9ea" />
      <rect x={140} y={50} width={760} height={40} rx={6} fill="#ffffff" opacity={fl} />
      <rect x={100} y={30} width={840} height={90} fill="#ffffff" opacity={0.35 * fl} filter="url(#c724bl)" />
      <path d="M 0 120 H 1080" stroke="#b8bec2" strokeWidth={4} />
      {/* sol: ön vitrin köşesi (gece, yağmur) */}
      <Sokak id="c724s" x={0} y={160} w={70} h={1150} ufuk={980} frame={frame} yogun={yagmur ?? 1} />
      <rect x={66} y={150} width={14} height={1200} fill="#9aa2a8" />
      {/* güvenlik kamerası monitörü (dört bölme, siyah-beyaz) */}
      <path d="M 200 120 L 200 290" stroke="#4a4e54" strokeWidth={8} />
      <rect x={74} y={288} width={256} height={174} rx={10} fill="#16181c" stroke="#0a0b0d" strokeWidth={5} />
      <g clipPath="url(#c724m)">
        <rect x={86} y={300} width={232} height={150} fill="#2a302c" />
        {/* 1: kapı (açıksa ortası kararır) */}
        <rect x={88} y={302} width={113} height={72} fill="#5a625c" />
        <rect x={120} y={312} width={50} height={56} fill="#1a1e1c" />
        <rect x={120 + 25 * (1 - op)} y={312} width={0.1 + 50 * 0} height={56} fill="#1a1e1c" />
        <rect x={120} y={312} width={25 * (1 - op)} height={56} fill="#7a827c" opacity={0.8} />
        <rect x={145 + 25 * op} y={312} width={25 * (1 - op)} height={56} fill="#7a827c" opacity={0.8} />
        {/* 2: koridor */}
        <rect x={203} y={302} width={113} height={72} fill="#4e5650" />
        <path d="M 230 372 L 255 320 L 265 320 L 290 372 Z" fill="#6a726c" />
        {/* 3: kasa üstten (Ece) */}
        <rect x={88} y={376} width={113} height={72} fill="#555d57" />
        <rect x={100} y={410} width={90} height={22} fill="#7a827c" />
        <circle cx={160} cy={398} r={11} fill="#2a2e2c" />
        {/* 4: depo (karanlık) */}
        <rect x={203} y={376} width={113} height={72} fill="#1a1e1c" />
        <rect x={86} y={300} width={232} height={150} fill="#c8ffd8" opacity={0.08} />
        {new Array(12).fill(0).map((_, i) => <path key={i} d={`M 86 ${300 + i * 13} h 232`} stroke="#000" strokeWidth={2} opacity={0.18} />)}
        <text x={92} y={316} fontFamily="'Courier New', monospace" fontSize={11} fontWeight={700} fill="#e8ffe8">K1 GİRİŞ</text>
        <text x={207} y={390} fontFamily="'Courier New', monospace" fontSize={11} fontWeight={700} fill="#e8ffe8">K4 DEPO</text>
        <text x={312} y={446} textAnchor="end" fontFamily="'Courier New', monospace" fontSize={12} fontWeight={700} fill="#e8ffe8">{saat}:{String(sec % 60).padStart(2, "0")}</text>
      </g>
      {/* sigara dolabı: Ece'nin arkası (yüzü öne çıksın diye koyu) */}
      <rect x={190} y={420} width={600} height={720} rx={6} fill="#1e2228" stroke="#0c0e12" strokeWidth={8} />
      {new Array(6).fill(0).map((_, r) => (
        <g key={r}>
          {new Array(10).fill(0).map((__, c) => (
            <g key={c}>
              <rect x={212 + c * 57} y={448 + r * 112} width={46} height={78} rx={3} fill={PAKET[(r * 7 + c * 3) % PAKET.length]} opacity={0.82} />
              <rect x={212 + c * 57} y={448 + r * 112} width={46} height={20} fill="#ffffff" opacity={0.25} />
            </g>
          ))}
          <path d={`M 200 ${540 + r * 112} H 780`} stroke="#4a5058" strokeWidth={6} />
        </g>
      ))}
      <rect x={190} y={420} width={600} height={720} fill="#bcd4e4" opacity={0.1} />
      <path d="M 240 430 l 160 700 M 580 430 l 120 700" stroke="#ffffff" strokeWidth={26} opacity={0.05} />
      {/* 18 yaş uyarısı */}
      <rect x={240} y={1150} width={500} height={56} rx={6} fill="#f8f4e8" stroke="#2a2e32" strokeWidth={3} />
      <text x={490} y={1188} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={26} fill="#a01818">18 YAŞ ALTINA SİGARA SATILMAZ</text>
      {/* sağ: kazı kazan standı + takvim */}
      <rect x={808} y={480} width={124} height={250} rx={6} fill="#f2c830" stroke="#6a5010" strokeWidth={5} />
      {[0, 1, 2].map((i) => <rect key={i} x={818} y={496 + i * 76} width={104} height={62} rx={4} fill={["#e84a3a", "#3a8ad8", "#3ab86a"][i]} />)}
      <rect x={805} y={770} width={130} height={160} fill="#f8f8f4" stroke="#5a5a56" strokeWidth={3} />
      <rect x={805} y={770} width={130} height={36} fill="#c02020" />
      <text x={870} y={796} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={20} fill="#ffffff">KASIM</text>
      <text x={870} y={890} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={66} fill="#2a2a2a">19</text>
      {/* sağ arka: DEPO · PERSONEL koridoru (karanlık, aralık) */}
      <rect x={955} y={330} width={140} height={1010} fill="#5a6066" stroke="#2a2e32" strokeWidth={6} />
      <rect x={975} y={350} width={110} height={990} fill="#0a0b0d" />
      {depoAcik === undefined ? (
        <path d="M 975 350 L 1035 372 L 1035 1318 L 975 1340 Z" fill="#4a5056" stroke="#2a2e32" strokeWidth={4} />
      ) : (() => {
        // kanat menteşeden (sol) içeri açılır: açıldıkça daralır; tam açıkta duvara yaslanmış ince şerit
        const w = Math.max(6, 104 * (1 - Math.max(0, Math.min(1.1, depoAcik))));
        const dy = 22 * (1 - w / 104) + 2;
        return <path d={`M 975 350 L ${975 + w} ${350 + dy} L ${975 + w} ${1340 - dy} L 975 1340 Z`} fill="#4a5056" stroke="#2a2e32" strokeWidth={4} />;
      })()}
      <circle cx={1022} cy={860} r={7} fill="#c8ccd0" />
      <rect x={950} y={262} width={130} height={56} fill="#e8e0c0" stroke="#2a2e32" strokeWidth={3} />
      <text x={1015} y={286} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={22} fill="#1a1a1a">DEPO</text>
      <text x={1015} y={310} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={16} fill="#1a1a1a">PERSONEL</text>
      {/* zemin hizası (kasanın arkası görünmez) */}
      <rect y={1330} width={W} height={H - 1330} fill="#b8bdbe" />
      {/* üstten anahtar ışık havuzu + kenar kararması */}
      <rect width={W} height={H} fill="url(#c724key)" />
      <rect width={W} height={H} fill="#a8c8ff" opacity={0.05} />
      <rect width={W} height={H} fill="url(#c724vin)" />
      <rect width={W} height={H} fill="#000" opacity={(1 - fl) * 0.4} />
    </g>
  );
};

/** kasa: banko (Ece'nin belinden aşağısını örter) */
const KasaFG: React.FC<MarketProps> = ({ agiz, sars = 0, frame }) => {
  const sx = sars > 0 ? (random(`ks${frame}`) - 0.5) * 14 * sars : 0;
  const sy = sars > 0 ? (random(`ky${frame}`) - 0.5) * 8 * sars : 0;
  return (
  <g transform={`translate(${sx} ${sy})`} clipPath={agiz ? "url(#kasaAgziClip)" : undefined}>
    {agiz ? <defs><clipPath id="kasaAgziClip"><rect x={232} y={0} width={1080} height={1920} /></clipPath></defs> : null}
    {/* üst tabla */}
    <path d="M 0 1440 L 1080 1440 L 1080 1500 L 0 1500 Z" fill="#f2f0ea" stroke="#5a4a40" strokeWidth={5} />
    <path d="M 0 1440 L 1080 1440" stroke="#ffffff" strokeWidth={4} opacity={0.8} />
    {/* ön panel */}
    <rect x={0} y={1500} width={1080} height={420} fill="#c63c22" stroke="#2a1410" strokeWidth={6} />
    <rect x={0} y={1500} width={1080} height={22} fill="#000" opacity={0.18} />
    <text x={540} y={1690} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={96} fill="#fff4ea">CAN MARKET</text>
    <text x={540} y={1790} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={70} fill="#fff4ea">7/24</text>
    {/* yazar kasanın sırtı (müşteri ekranı) — solda, yüzü örtmez */}
    <rect x={60} y={1280} width={230} height={170} rx={10} fill="#2a2e34" stroke="#0a0b0d" strokeWidth={5} />
    <rect x={80} y={1298} width={190} height={70} fill="#2a8a5a" />
    <text x={175} y={1346} textAnchor="middle" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={34} fill="#d8ffe4">0,00 ₺</text>
    <rect x={100} y={1380} width={150} height={60} rx={6} fill="#3a3e44" />
    {/* kart makinesi + poşet rulosu + sakız standı (sağda) */}
    <rect x={760} y={1360} width={70} height={90} rx={10} fill="#1a1c20" stroke="#0a0b0d" strokeWidth={4} />
    <rect x={770} y={1372} width={50} height={30} fill="#3a6aa8" />
    <rect x={860} y={1290} width={190} height={160} rx={8} fill="#e8e8e0" stroke="#5a4a40" strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={872 + i * 44} y={1304} width={36} height={132} fill={PAKET[(i + 3) % PAKET.length]} transform={sars > 0.3 ? `rotate(${(i % 2 ? 1 : -1) * 18 * sars} ${890 + i * 44} 1436)` : undefined} />)}
    {agiz ? <g><rect x={226} y={1440} width={14} height={480} fill="#8a2a18" stroke="#2a1410" strokeWidth={4} /><path d="M 232 1440 L 232 1920" stroke="#f2f0ea" strokeWidth={3} opacity={0.5} /></g> : null}
  </g>
  );
};

export const Market724BG: React.FC<MarketProps> = (p) => (p.view === "genel" ? <GenelBG {...p} /> : p.view === "kapi" ? <KapiBG {...p} /> : <KasaBG {...p} />);
export const Market724FG: React.FC<MarketProps> = (p) => (p.view === "genel" ? <GenelFG {...p} /> : p.view === "kapi" ? <KapiFG {...p} /> : <KasaFG {...p} />);

/** işaretler (karakter ayak noktası ve boyu) */
export const MARKET724_MARKS = {
  genel: { ece: { x: 885, y: 1218, size: 404 }, kasiyer: { x: 885, y: 1218, size: 404 }, kapi: { x: 445, y: 1141, size: 326 } },
  kapi: { kapi: { x: 550, y: 1262, size: 640 }, musteri: { x: 470, y: 1990, size: 1300 } },
  kasa: { ece: { x: 540, y: 1960, size: 1180 }, kasiyer: { x: 540, y: 1960, size: 1180 }, kasa_agzi: { x: 320, y: 2050, size: 1260 }, depo_esik: { x: 1000, y: 1345, size: 900 }, depo_on: { x: 880, y: 1345, size: 900 } },
};
