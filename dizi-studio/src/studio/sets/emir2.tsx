import React from "react";
import { random } from "remotion";

/* =====================================================================================
 * Kayıp CEO · Bölüm 2 mekânları (kendi çizimimiz).
 *  zenith_merkez: İstanbul, Zenith Grup Holding genel merkezi resepsiyonu, yağmurlu gün. Tavandan yere cam cephe
 *    (arkasında bulanık köprü ve minare silüeti, camda akan damlalar), parlak siyah taş zemin, beyaz resepsiyon bankosu
 *    (FG), arkadan aydınlatmalı çelik "Z" logosu (yıldız YOK: gerçek marka çağrışımı olmasın), duvarda TV (son dakika).
 *  koy_meydani: ada köyünün meydanı, akşam altın saati. Arkada 3 saz kulübe, palmiyeler, deniz şeridi; ortada taş halkalı
 *    ateş (titreşen alev, yükselen kıvılcımlar); solda enkazdan getirilmiş eşya yığını. Ateş ışığı FG'de karakterlerin üstüne biner.
 * ===================================================================================== */

const W = 1080;
const H = 1920;
const O = "#1a1412";

export const ZenithBG: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;
  return (
    <g>
      <defs>
        <linearGradient id="zm_gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a97a6" /><stop offset="1" stopColor="#5a6878" /></linearGradient>
        <linearGradient id="zm_zemin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2e34" /><stop offset="1" stopColor="#111317" /></linearGradient>
        <radialGradient id="zm_tv" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stopColor="#7fb2ff" stopOpacity={0.35} /><stop offset="1" stopColor="#7fb2ff" stopOpacity={0} /></radialGradient>
        <filter id="zm_bl"><feGaussianBlur stdDeviation="8" /></filter>
        <clipPath id="zm_camc"><rect x={0} y={180} width={W} height={1120} /></clipPath>
      </defs>
      {/* cam cephe: dışarıda yağmurlu İstanbul (bulanık) */}
      <rect width={W} height={H} fill="#2c3036" />
      <g clipPath="url(#zm_camc)">
        <rect x={0} y={180} width={W} height={1120} fill="url(#zm_gok)" />
        <g filter="url(#zm_bl)" opacity={0.85}>
          {/* köprü: kuleler ve kablo eğrisi */}
          <rect x={150} y={640} width={18} height={360} fill="#3e4a58" />
          <rect x={720} y={600} width={20} height={400} fill="#3e4a58" />
          <path d="M 0 900 Q 159 700 159 640 Q 440 940 730 600 Q 900 760 1080 820" stroke="#3e4a58" strokeWidth={6} fill="none" />
          <rect x={0} y={960} width={W} height={22} fill="#3a4654" />
          {/* karşı kıyı ve minare silüeti */}
          <path d="M 0 1040 L 120 1010 L 260 1030 L 420 990 L 600 1020 L 820 1000 L 1080 1030 L 1080 1300 L 0 1300 Z" fill="#46525e" />
          <path d="M 520 1000 Q 560 930 600 1000 Z" fill="#3a4450" />
          <rect x={628} y={880} width={10} height={130} fill="#3a4450" />
          <path d="M 624 880 L 633 846 L 642 880 Z" fill="#3a4450" />
        </g>
        {/* camda akan yağmur damlaları */}
        {new Array(70).fill(0).map((_, i) => {
          const x = (i * 157) % W;
          const sp = 3 + (i % 5);
          const y = 180 + ((f * sp + i * 97) % 1120);
          return <path key={i} d={`M ${x} ${y} q 2 14 0 ${18 + (i % 4) * 6}`} stroke="#c8d4e0" strokeWidth={2.2} opacity={0.35} fill="none" />;
        })}
        {new Array(40).fill(0).map((_, i) => <circle key={`d${i}`} cx={(i * 263) % W} cy={200 + ((i * 431) % 1080)} r={2 + (i % 3)} fill="#dfe8f0" opacity={0.28} />)}
      </g>
      {/* cam kayıtları (çelik) */}
      {[0, 270, 540, 810, 1080].map((x) => <rect key={x} x={x - 8} y={180} width={16} height={1120} fill="#1e2228" />)}
      <rect x={0} y={170} width={W} height={20} fill="#1e2228" />
      {/* tavan (asma, gömme spotlar) */}
      <rect width={W} height={170} fill="#e8e8e6" />
      {[160, 420, 680, 940].map((x) => <g key={x}><circle cx={x} cy={110} r={14} fill="#fff8e8" /><circle cx={x} cy={110} r={40} fill="#fff8e8" opacity={0.25} /></g>)}
      {/* duvarda TV (sol üst): son dakika */}
      <rect x={60} y={380} width={430} height={250} rx={8} fill="#0a0b0d" stroke="#2a2e34" strokeWidth={6} />
      <rect x={72} y={392} width={406} height={226} fill="#1a2a4a" />
      <rect x={72} y={392} width={406} height={226} fill="url(#zm_tv)" />
      <ellipse cx={275} cy={480} rx={52} ry={58} fill="#c89a78" opacity={0.85} />
      <rect x={210} y={520} width={130} height={98} fill="#2a2e3a" opacity={0.9} />
      <rect x={72} y={560} width={406} height={30} fill="#c8102e" opacity={f % 40 < 30 ? 1 : 0.85} />
      <text x={84} y={582} fontFamily="Arial, sans-serif" fontWeight={900} fontSize={18} fill="#fff">SON DAKİKA</text>
      <rect x={72} y={590} width={406} height={28} fill="#f2f2f2" />
      <text x={84} y={610} fontFamily="Arial, sans-serif" fontWeight={800} fontSize={13} fill="#111">ZENITH GRUP HOLDİNG CEO'SU EMİR ÖZDEMİR…</text>
      <rect x={60} y={380} width={430} height={250} fill="url(#zm_tv)" />
      <ellipse cx={275} cy={505} rx={320} ry={260} fill="#7fb2ff" opacity={0.06} />
      {/* arkadan aydınlatmalı çelik logo (resepsiyonun arkası) */}
      <rect x={600} y={330} width={400} height={300} rx={6} fill="#24282e" />
      <circle cx={800} cy={450} r={92} fill="none" stroke="#b8bcc2" strokeWidth={14} />
      <path d="M 750 410 H 850 L 760 492 H 852" stroke="#b8bcc2" strokeWidth={18} fill="none" strokeLinejoin="round" />
      <circle cx={868} cy={384} r={10} fill="#c9a24a" />
      <ellipse cx={800} cy={450} rx={170} ry={130} fill="#ffffff" opacity={0.06} filter="url(#zm_bl)" />
      <text x={800} y={600} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={900} fontSize={34} letterSpacing={10} fill="#d8dce0">ZENITH GRUP</text>
      {/* parlak siyah taş zemin ve yansımalar */}
      <rect x={0} y={1300} width={W} height={620} fill="url(#zm_zemin)" />
      {[1380, 1500, 1660, 1860].map((y) => <path key={y} d={`M 0 ${y} H ${W}`} stroke="#3a3e46" strokeWidth={2} />)}
      <rect x={60} y={1310} width={430} height={180} fill="#7fb2ff" opacity={0.06} filter="url(#zm_bl)" />
      <rect x={600} y={1310} width={400} height={160} fill="#ffffff" opacity={0.04} filter="url(#zm_bl)" />
    </g>
  );
};

/** zenith_merkez: resepsiyon bankosu (karakterin belinden aşağısı) + santral hat ışıkları */
export const ZenithFG: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <path d="M 300 1380 L 1080 1360 L 1080 1920 L 330 1920 Z" fill="#f2f2f0" stroke="#9aa0a6" strokeWidth={4} />
    <path d="M 290 1360 L 1080 1340 L 1080 1384 L 300 1404 Z" fill="#fbfbfa" stroke="#9aa0a6" strokeWidth={3} />
    <path d="M 330 1500 L 1080 1484" stroke="#e0e2e4" strokeWidth={10} />
    <rect x={380} y={1300} width={150} height={64} rx={8} fill="#1a1c20" stroke="#0a0b0d" strokeWidth={3} />
    {new Array(6).fill(0).map((_, i) => <circle key={i} cx={402 + i * 22} cy={1332} r={6} fill={random(`hat${i}${Math.floor(frame / 9)}`) > 0.55 ? "#4ad86a" : "#2a3a2e"} />)}
    <path d="M 900 1300 L 980 1290 L 990 1346 L 906 1352 Z" fill="#2a2e34" />
  </g>
);

export const KoyMeydaniBG: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;
  const fl = 0.85 + 0.15 * Math.sin(f / 2.3) * Math.sin(f / 5.1);
  return (
    <g>
      <defs>
        <linearGradient id="km_gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3a6a" /><stop offset="0.45" stopColor="#d86a4a" /><stop offset="0.8" stopColor="#f2b05a" /><stop offset="1" stopColor="#f8d48a" /></linearGradient>
        <linearGradient id="km_kum" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c8955a" /><stop offset="1" stopColor="#8a5e34" /></linearGradient>
        <radialGradient id="km_ates" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffb050" stopOpacity={0.55} /><stop offset="1" stopColor="#ffb050" stopOpacity={0} /></radialGradient>
        <filter id="km_bl"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width={W} height={H} fill="url(#km_gok)" />
      {/* güneş ve deniz şeridi */}
      <circle cx={820} cy={760} r={90} fill="#ffe0a0" opacity={0.9} />
      <circle cx={820} cy={760} r={180} fill="#ffd080" opacity={0.18} />
      <rect x={0} y={820} width={W} height={110} fill="#c8705a" />
      {new Array(6).fill(0).map((_, i) => <path key={i} d={`M ${(i * 190 + f * 0.6) % 1180 - 100} ${840 + i * 14} h 120`} stroke="#ffd8a0" strokeWidth={4} opacity={0.6} />)}
      {/* palmiyeler (silüet) */}
      {[[90, 1.0], [980, 0.9], [640, 0.7]].map(([x, s], i) => (
        <g key={i} transform={`translate(${x} 930) scale(${s})`}>
          <path d={`M 0 0 Q ${10 + Math.sin(f / 30 + i) * 6} -260 ${30 + Math.sin(f / 30 + i) * 10} -520`} stroke="#3a2418" strokeWidth={22} fill="none" />
          {[-150, -100, -40, 20, 80, 140].map((a, k) => (
            <path key={k} d={`M ${30 + Math.sin(f / 30 + i) * 10} -520 q ${Math.sin((a * Math.PI) / 180) * 150} ${-60 + Math.abs(a) * 0.6} ${Math.sin((a * Math.PI) / 180) * 280} ${40 + Math.abs(a) * 0.8}`} stroke="#2a3a1e" strokeWidth={16} fill="none" strokeLinecap="round" />
          ))}
        </g>
      ))}
      {/* üç saz kulübe */}
      {[[170, 930, 1.0], [520, 900, 0.85], [880, 940, 1.05]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x={-130} y={0} width={260} height={230} fill="#7a5430" stroke={O} strokeWidth={5} />
          {new Array(7).fill(0).map((_, k) => <path key={k} d={`M ${-120 + k * 40} 0 V 230`} stroke="#5a3a1e" strokeWidth={4} />)}
          <path d="M -170 10 L 0 -150 L 170 10 Z" fill="#b08a48" stroke={O} strokeWidth={5} />
          {new Array(5).fill(0).map((_, k) => <path key={k} d={`M ${-150 + k * 15} ${-5 - k * 26} L ${150 - k * 15} ${-5 - k * 26}`} stroke="#8a6a34" strokeWidth={4} />)}
          <rect x={-36} y={110} width={72} height={120} fill="#2a1a0e" />
          <rect x={-36} y={110} width={72} height={120} fill="#ff9a3a" opacity={0.18 * fl} />
        </g>
      ))}
      {/* kum zemin + ayak izleri */}
      <path d="M 0 1120 Q 540 1080 1080 1120 L 1080 1920 L 0 1920 Z" fill="url(#km_kum)" />
      {new Array(18).fill(0).map((_, i) => <ellipse key={i} cx={(i * 211) % W} cy={1200 + ((i * 337) % 600)} rx={16} ry={7} fill="#9a6e40" opacity={0.5} />)}
      {/* enkaz eşyaları yığını (sol) */}
      <g>
        {/* perçinli alüminyum parça */}
        <path d="M 40 1430 L 300 1380 L 330 1470 L 70 1520 Z" fill="#a8acb0" stroke="#4a4e52" strokeWidth={5} />
        {new Array(6).fill(0).map((_, i) => <circle key={i} cx={80 + i * 40} cy={1430 - i * 8} r={4} fill="#5a5e62" />)}
        {/* lacivert ezik valiz + kumlu bagaj etiketi */}
        <path d="M 60 1500 L 250 1480 L 262 1640 L 70 1660 Z" fill="#1e2a4a" stroke="#0a1020" strokeWidth={5} />
        <path d="M 120 1490 q 40 -40 80 -6" stroke="#0a1020" strokeWidth={10} fill="none" />
        <path d="M 160 1560 l 30 -10" stroke="#3a4a6a" strokeWidth={6} />
        <rect x={232} y={1500} width={44} height={60} rx={5} fill="#f2e8d0" stroke="#8a7a5a" strokeWidth={3} transform="rotate(12 254 1530)" />
        <circle cx={250} cy={1508} r={5} fill="#8a7a5a" transform="rotate(12 254 1530)" />
        {/* elmas dikişli kabin minderi (yırtık, sünger fırlamış) */}
        <rect x={250} y={1560} width={190} height={110} rx={18} fill="#2c2f35" stroke="#0e0f12" strokeWidth={5} transform="rotate(-8 345 1615)" />
        {new Array(4).fill(0).map((_, i) => <path key={i} d={`M ${270 + i * 40} 1572 l 30 40 l -30 40`} stroke="#4a4e56" strokeWidth={3} fill="none" transform="rotate(-8 345 1615)" />)}
        <ellipse cx={420} cy={1600} rx={26} ry={16} fill="#e8d870" />
        {/* sarı can yeleği (düdüklü) */}
        <path d="M 120 1660 L 210 1640 L 240 1760 L 140 1780 Z" fill="#f2c21a" stroke="#8a6a0a" strokeWidth={5} />
        <path d="M 210 1640 L 290 1650 L 300 1770 L 240 1760" fill="#e8b80a" stroke="#8a6a0a" strokeWidth={5} />
        <circle cx={232} cy={1700} r={8} fill="#c8102e" />
        <path d="M 232 1700 l 16 -26" stroke="#8a6a0a" strokeWidth={3} />
        {/* açık deri evrak çantası (boş: dosya yaşlıda) */}
        <path d="M 330 1700 L 470 1690 L 480 1780 L 336 1790 Z" fill="#4a2a18" stroke="#1a0e08" strokeWidth={5} />
        <path d="M 330 1700 L 360 1640 L 490 1630 L 470 1690 Z" fill="#5a3420" stroke="#1a0e08" strokeWidth={5} />
        <rect x={396} y={1694} width={24} height={10} fill="#c9a24a" />
        {/* kırık tepsi + kurumuş kahve halkası */}
        <path d="M 30 1780 L 180 1800 L 170 1860 L 20 1840 Z" fill="#9a9ea2" stroke="#4a4e52" strokeWidth={4} />
        <ellipse cx={100} cy={1820} rx={24} ry={9} fill="none" stroke="#6a4a2c" strokeWidth={4} opacity={0.7} />
        <path d="M 150 1800 l -10 30 l 16 10" stroke="#4a4e52" strokeWidth={3} fill="none" />
      </g>
      {/* taş halkalı ateş (orta) */}
      <ellipse cx={540} cy={1520} rx={300} ry={90} fill="url(#km_ates)" opacity={fl} />
      {new Array(10).fill(0).map((_, i) => <ellipse key={i} cx={540 + Math.cos(i * 0.628) * 120} cy={1510 + Math.sin(i * 0.628) * 34} rx={30} ry={18} fill="#7a7470" stroke={O} strokeWidth={3} />)}
      {[[-60, 10], [0, -10], [60, 6]].map(([dx, dy], i) => <path key={i} d={`M ${500 + dx} ${1520 + dy} L ${580 + dx} ${1490 + dy}`} stroke="#3a2414" strokeWidth={16} strokeLinecap="round" />)}
      {[0, 1, 2, 3].map((i) => {
        const h = 150 + 40 * Math.sin(f / (2 + i * 0.7) + i);
        const x = 500 + i * 26;
        return <path key={i} d={`M ${x - 30} 1510 Q ${x - 10} ${1510 - h * 0.6} ${x + Math.sin(f / 3 + i) * 12} ${1510 - h} Q ${x + 18} ${1510 - h * 0.5} ${x + 30} 1510 Z`} fill={i % 2 ? "#ff7a2a" : "#ffb040"} opacity={0.92} />;
      })}
      <path d={`M 520 1510 Q 540 ${1440 + Math.sin(f / 2) * 8} 560 1510 Z`} fill="#fff0a0" />
      {/* kıvılcımlar */}
      {new Array(14).fill(0).map((_, i) => {
        const a = (f * 2 + i * 23) % 120;
        return <circle key={i} cx={540 + Math.sin((a + i * 40) / 14) * (20 + a * 0.6)} cy={1450 - a * 5} r={3} fill="#ffd060" opacity={Math.max(0, 1 - a / 120)} />;
      })}
      {/* duman */}
      {new Array(5).fill(0).map((_, i) => { const a = (f + i * 40) % 200; return <circle key={i} cx={560 + Math.sin(a / 25) * 30} cy={1300 - a * 3} r={30 + a * 0.4} fill="#7a6a62" opacity={Math.max(0, 0.22 - a / 900)} />; })}
    </g>
  );
};

/** köy meydanı: ateş ışığı karakterlerin üstüne biner (titreşimli sıcak parıltı) */
export const KoyMeydaniFG: React.FC<{ frame: number }> = ({ frame }) => {
  const fl = 0.8 + 0.2 * Math.sin(frame / 2.3) * Math.sin(frame / 5.1);
  return (
    <g>
      <defs>
        <radialGradient id="km_fg" cx="0.5" cy="0.78" r="0.6"><stop offset="0" stopColor="#ffa040" stopOpacity={0.22} /><stop offset="1" stopColor="#ffa040" stopOpacity={0} /></radialGradient>
        <radialGradient id="km_vin" cx="0.5" cy="0.6" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#1a0a04" stopOpacity={0.45} /></radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#km_fg)" opacity={fl} />
      <rect width={W} height={H} fill="url(#km_vin)" />
    </g>
  );
};

export const EMIR2_MARKS = {
  zenith_merkez: { resepsiyon: { x: 660, y: 1720, size: 980 } },
  koy_meydani: { yb: { x: 760, y: 1600, size: 1000 }, y1: { x: 300, y: 1620, size: 960 }, y2: { x: 160, y: 1520, size: 860 }, ya: { x: 930, y: 1500, size: 860 } },
};
