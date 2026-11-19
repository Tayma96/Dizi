import React from "react";

/* =====================================================================================
 * Dram (5. dizi) · babanın eski sedanı, akşam üstü yolda. Kamera ön camın DIŞINDA, arabayla birlikte gider
 * ve içeriye bakar: ekranın solunda yolcu koltuğu (anne), sağında şoför koltuğu (baba, direksiyon önünde).
 * Arka camdan geride kalan yol ve sokak lambaları görünür. Dikiz aynasında nazar boncuğu ve tespih.
 * doorOpen = karşıdan gelen farın şiddeti (0-1): ön camı ve yüzleri beyaza boğar.
 * BG: arabanın içi (arka cam, koltuklar). FG: ön göğüs/torpido, direksiyon, ön cam çerçevesi, kaporta, cam yansımaları, far parlaması.
 * ===================================================================================== */

export type ArabaProps = { frame: number; far: number };

const W = 1080;
const H = 1920;
const OUT = "#1a1412";

/** ön cam (ekran): üst kenar dar, alt kenar geniş */
const CAM = { tl: [190, 470], tr: [890, 470], br: [1040, 1420], bl: [40, 1420] } as const;
const camPath = `M ${CAM.tl[0]} ${CAM.tl[1]} L ${CAM.tr[0]} ${CAM.tr[1]} Q 1000 900 ${CAM.br[0]} ${CAM.br[1]} L ${CAM.bl[0]} ${CAM.bl[1]} Q 80 900 ${CAM.tl[0]} ${CAM.tl[1]} Z`;

export const ArabaBG: React.FC<ArabaProps> = ({ frame }) => {
  const t = frame / 30;
  return (
    <g>
      <defs>
        <linearGradient id="ar_ic" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2420" /><stop offset="1" stopColor="#141010" /></linearGradient>
        <linearGradient id="ar_gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3a5c" /><stop offset="0.6" stopColor="#c87a5a" /><stop offset="1" stopColor="#e8a868" /></linearGradient>
        <radialGradient id="ar_lamba" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffc070" stopOpacity={0.9} /><stop offset="1" stopColor="#ffc070" stopOpacity={0} /></radialGradient>
      </defs>
      {/* arabanın içi (karanlık, sıcak) */}
      <rect width={W} height={H} fill="url(#ar_ic)" />
      {/* arka cam: geride kalan yol (akşam alacası), uzaklaşan sokak lambaları */}
      <path d="M 250 640 L 830 640 Q 860 760 850 860 L 230 860 Q 220 760 250 640 Z" fill="url(#ar_gok)" />
      <g>
        <clipPath id="ar_arka"><path d="M 250 640 L 830 640 Q 860 760 850 860 L 230 860 Q 220 760 250 640 Z" /></clipPath>
        <g clipPath="url(#ar_arka)">
          <path d="M 230 860 L 520 770 L 560 770 L 850 860 Z" fill="#2a2a30" />
          <path d="M 540 860 L 540 772" stroke="#e8d8a0" strokeWidth={3} strokeDasharray="14 12" strokeDashoffset={-t * 60} />
          {/* binalar silueti */}
          {[[250, 700, 60], [320, 720, 50], [700, 690, 70], [780, 715, 60]].map(([x, y, w], i) => <rect key={i} x={x} y={y} width={w} height={860 - y} fill="#1a1c24" />)}
          {[[262, 720], [282, 740], [712, 710], [736, 730], [792, 735]].map(([x, y], i) => <rect key={i} x={x} y={y} width={8} height={10} fill="#ffd890" opacity={0.8} />)}
          {/* geride kalan lambalar: kaçış noktasına doğru küçülerek akar */}
          {[0, 1, 2].map((i) => {
            const k = ((t * 0.55 + i / 3) % 1);
            const x = 540 + (k < 0.5 ? -1 : 1) * 0 - (1 - k) * 260 * (i % 2 ? -1 : 1);
            const y = 770 - (1 - k) * 60;
            return <circle key={i} cx={x} cy={y} r={4 + (1 - k) * 18} fill="url(#ar_lamba)" />;
          })}
        </g>
      </g>
      {/* koltuk başlıkları ve sırtlar */}
      {[[330, 0], [750, 1]].map(([x, i]) => (
        <g key={i}>
          <rect x={x - 190} y={880} width={380} height={900} rx={70} fill="#4a3a30" stroke={OUT} strokeWidth={6} />
          <path d={`M ${x - 150} 960 V 1700 M ${x + 150} 960 V 1700`} stroke="#3a2c24" strokeWidth={6} />
          <rect x={x - 110} y={700} width={220} height={190} rx={50} fill="#4a3a30" stroke={OUT} strokeWidth={6} />
          <rect x={x - 22} y={884} width={14} height={30} fill="#8a8a8a" />
          <rect x={x + 10} y={884} width={14} height={30} fill="#8a8a8a" />
        </g>
      ))}
      {/* tavan iç kaplaması */}
      <rect x={0} y={0} width={W} height={620} fill="#3a322c" />
      <path d="M 0 620 Q 540 590 1080 620" stroke="#2a2420" strokeWidth={10} fill="none" />
      {/* kapı camları (yanlarda, akan ışık) */}
      <path d="M 0 700 L 120 680 L 120 1100 L 0 1120 Z" fill="#3a4460" />
      <path d="M 1080 700 L 960 680 L 960 1100 L 1080 1120 Z" fill="#3a4460" />
    </g>
  );
};

export const ArabaFG: React.FC<ArabaProps> = ({ frame, far }) => {
  const t = frame / 30;
  // sokak lambası geçişi: her ~1.7 sn'de bir turuncu ışık şeridi yüzlerin üstünden akar
  const lp = (t % 1.7) / 1.7;
  const lampY = -400 + lp * 2600;
  const f = Math.max(0, Math.min(1, far));
  return (
    <g>
      <defs>
        <clipPath id="ar_cam"><path d={camPath} /></clipPath>
        <clipPath id="ar_dis"><path d={`M 0 0 H ${W} V ${H} H 0 Z ${camPath}`} clipRule="evenodd" /></clipPath>
        <linearGradient id="ar_lampband" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb860" stopOpacity={0} /><stop offset="0.5" stopColor="#ffb860" stopOpacity={0.32} /><stop offset="1" stopColor="#ffb860" stopOpacity={0} /></linearGradient>
        <linearGradient id="ar_kaporta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8d0c0" /><stop offset="1" stopColor="#8a8274" /></linearGradient>
        <linearGradient id="ar_torpido" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2e2824" /><stop offset="1" stopColor="#1a1614" /></linearGradient>
        <radialGradient id="ar_far" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stopColor="#ffffff" stopOpacity={1} /><stop offset="0.35" stopColor="#fff6dc" stopOpacity={0.85} /><stop offset="1" stopColor="#fff6dc" stopOpacity={0} /></radialGradient>
        <filter id="ar_bl"><feGaussianBlur stdDeviation="18" /></filter>
      </defs>
      {/* camın içinden: akan sokak lambası ışığı (yüzlerin üstünden geçer) */}
      <g clipPath="url(#ar_cam)">
        <rect x={0} y={lampY} width={W} height={520} fill="url(#ar_lampband)" transform={`skewY(-12)`} />
        {/* torpido + direksiyon (camın içinde, karakterlerin önünde) */}
        <path d="M 0 1230 Q 540 1180 1080 1230 L 1080 1440 L 0 1440 Z" fill="url(#ar_torpido)" />
        <path d="M 0 1230 Q 540 1180 1080 1230" stroke="#4a403a" strokeWidth={8} fill="none" />
        {/* direksiyon (şoför: ekranın sağı) */}
        <ellipse cx={750} cy={1250} rx={200} ry={70} fill="none" stroke="#1a1614" strokeWidth={34} />
        <ellipse cx={750} cy={1250} rx={200} ry={70} fill="none" stroke="#3a3430" strokeWidth={8} />
        <rect x={720} y={1240} width={60} height={200} fill="#1a1614" />
        {/* dikiz aynası + nazar boncuğu + tespih */}
        <path d="M 540 470 L 540 520" stroke="#1a1614" strokeWidth={12} />
        <rect x={440} y={515} width={200} height={62} rx={18} fill="#1a1614" stroke="#3a3430" strokeWidth={4} />
        <rect x={452} y={526} width={176} height={40} rx={12} fill="#5a6a84" />
        {(() => {
          const sw = Math.sin(t * 2.2) * 8;
          return (
            <g transform={`rotate(${sw} 540 577)`}>
              <path d="M 540 577 L 540 680" stroke="#c8a860" strokeWidth={2} />
              {new Array(9).fill(0).map((_, i) => <circle key={i} cx={540 + Math.sin(i) * 3} cy={590 + i * 11} r={4.5} fill="#3a2a1a" />)}
              <circle cx={540} cy={700} r={17} fill="#1a4ab8" stroke={OUT} strokeWidth={2} />
              <circle cx={540} cy={700} r={11} fill="#f4f4f4" />
              <circle cx={540} cy={700} r={6.5} fill="#4ab0e8" />
              <circle cx={540} cy={700} r={3.2} fill="#0a0a14" />
            </g>
          );
        })()}
        {/* far: camı beyaza boğar */}
        {f > 0 ? <rect width={W} height={H} fill="#fff6e0" opacity={f * 0.28} /> : null}
      </g>
      {/* ön cam çerçevesi, direkler, tavan */}
      <g clipPath="url(#ar_dis)">
        <rect width={W} height={H} fill="#16181e" />
        {/* arabanın gövdesi: tavan ve A direkleri (krem rengi eski sedan) */}
        <path d={`M 120 300 L 960 300 L 1080 520 L 1080 1500 L 0 1500 L 0 520 Z`} fill="#b8b0a0" />
        <path d={`M 150 330 L 930 330 L 1040 540`} stroke="#d8d0c0" strokeWidth={10} fill="none" />
        {/* yol kenarı akan karanlık (hız hissi) */}
        {[0, 1, 2, 3].map((i) => { const y = ((t * 900 + i * 520) % 2200) - 200; return <rect key={i} x={0} y={y} width={60} height={160} fill="#2a2e38" opacity={0.6} />; })}
        {[0, 1, 2, 3].map((i) => { const y = ((t * 900 + i * 520 + 260) % 2200) - 200; return <rect key={`r${i}`} x={1020} y={y} width={60} height={160} fill="#2a2e38" opacity={0.6} />; })}
        {/* kaporta */}
        <path d="M 0 1440 Q 540 1400 1080 1440 L 1080 1920 L 0 1920 Z" fill="url(#ar_kaporta)" stroke={OUT} strokeWidth={6} />
        <path d="M 540 1420 L 540 1920" stroke="#a8a090" strokeWidth={6} />
        {/* kaportada akan ışık yansıması */}
        <path d={`M ${-200 + ((t * 700) % 1600)} 1460 l 260 0 l -120 460 l -260 0 Z`} fill="#ffffff" opacity={0.18} />
        {/* silecekler */}
        <path d="M 120 1440 L 470 1400" stroke="#141414" strokeWidth={12} strokeLinecap="round" />
        <path d="M 560 1440 L 930 1400" stroke="#141414" strokeWidth={12} strokeLinecap="round" />
      </g>
      {/* cam kenarı (conta) */}
      <path d={camPath} fill="none" stroke="#141414" strokeWidth={16} />
      {/* camdaki yansımalar: gökyüzü ve akan ışıklar */}
      <g clipPath="url(#ar_cam)">
        <path d="M 240 470 L 420 470 L 180 1420 L 40 1420 Z" fill="#ffffff" opacity={0.06} />
        <path d={`M ${300 + ((t * 420) % 900)} 470 l 120 0 l -260 950 l -120 0 Z`} fill="#ffd8a0" opacity={0.08} />
      </g>
      {/* karşıdan gelen far parlaması (kameranın arkasından): göz kamaştırır */}
      {f > 0 ? (
        <g>
          {/* iki far: kameranın iki yanından, yüzleri boğmadan kamaştırır */}
          {[300, 780].map((x) => <ellipse key={x} cx={x} cy={1500} rx={260 + f * 240} ry={200 + f * 180} fill="url(#ar_far)" opacity={f * 0.75} />)}
          <path d={`M -100 ${1500 - 5} H 1180 V ${1500 + 5} H -100 Z`} fill="#ffffff" opacity={f * 0.7} filter="url(#ar_bl)" />
          {[300, 780].map((x) => <circle key={`c${x}`} cx={x} cy={1500} r={40 + f * 70} fill="#ffffff" opacity={f * 0.9} filter="url(#ar_bl)" />)}
          <rect width={W} height={H} fill="#fff8e8" opacity={f * 0.12} />
        </g>
      ) : null}
    </g>
  );
};

export const ARABA_MARKS = { anne: { x: 330, y: 1720, size: 1050, sit: true }, baba: { x: 750, y: 1730, size: 1100, sit: true } };
