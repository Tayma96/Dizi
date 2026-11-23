import React from "react";
import { random } from "remotion";

/* =====================================================================================
 * Kırmızı Düğme (dosyalar `kd-*`): 2D mekânlar ve araçlar.
 *   kd_ev         Göbekli adamın salonu (gece). Anahtar: soldaki TV'nin titreyen mavi ışığı.
 *                 Dolgu: telefon ekranı (yüzde). Arka: perdenin ardındaki şehir (soğuk mor).
 *   kd_market_onu Mahalle marketi önü (gece, dış). Anahtar: sodyum turuncusu sokak lambası.
 *                 Dolgu: vitrinden taşan beyaz ışık. Arka: lacivert gökyüzü, apartman pencereleri.
 *   kd_cadde      Gece caddesi. "takip": kuryenin önünde giden araçtan geriye bakış, yol akar.
 *                 "kavsak": kavşak genel (trafik ışığı, yaya geçidi; minibüsün çarptığı yer).
 *   kd_yayin      Influencer odası. Anahtar: ring ışık (soğuk beyaz). Dolgu: pembe LED.
 *                 Arka: mor LED şerit. Arkada aralık, karanlık kapı (arka oda).
 * Araçlar: KacirmaVan (yan / ön; plaka çamurlu, okunmaz; sürücü siluet), KuryeMotor (önden).
 * Hiçbir gerçek marka/logo yoktur; tabelalar uydurmadır.
 * ===================================================================================== */

const W = 1080;
const H = 1920;
const OUT = "#1a1416";

/* ------------------------------------------------------------------ yardımcılar */
const Glow: React.FC<{ id: string; c: string; o?: number }> = ({ id, c, o = 1 }) => (
  <radialGradient id={id}>
    <stop offset="0" stopColor={c} stopOpacity={o} />
    <stop offset="1" stopColor={c} stopOpacity={0} />
  </radialGradient>
);

/* ===================================================================== B. EV (gece) */
export const KD_EV_MARKS = {
  kanepe: { x: 560, y: 1560, size: 1060, sit: true },
  uzanma: { x: 560, y: 1450, size: 1000 },
  ayak: { x: 560, y: 1790, size: 1200 },
  kapi: { x: 930, y: 1700, size: 1080 },
};

export const KdEvBG: React.FC<{ frame: number }> = ({ frame }) => {
  const tv = 0.75 + 0.25 * Math.sin(frame / 3.1) * Math.sin(frame / 7.3) + 0.1 * (random(`tv${Math.floor(frame / 4)}`) - 0.5);
  return (
    <g>
      <defs>
        <linearGradient id="kev_duvar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c2236" /><stop offset="1" stopColor="#262c42" /></linearGradient>
        <pattern id="kev_desen" width="90" height="120" patternUnits="userSpaceOnUse">
          <path d="M 45 14 C 60 34 60 50 45 64 C 30 50 30 34 45 14 Z M 45 64 C 52 80 52 96 45 106 C 38 96 38 80 45 64 Z" fill="#33395a" opacity={0.55} />
        </pattern>
        <linearGradient id="kev_pen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141836" /><stop offset="1" stopColor="#3a2a5a" /></linearGradient>
        <Glow id="kev_tv" c="#5aa8ff" o={0.55} />
        <linearGradient id="kev_yer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2a28" /><stop offset="1" stopColor="#1e1616" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#kev_duvar)" />
      <rect width={W} height={1330} fill="url(#kev_desen)" />
      {/* süpürgelik + parke */}
      <rect y={1300} width={W} height={H - 1300} fill="url(#kev_yer)" />
      {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${i * 150 - 200} ${H} L ${i * 120 + 30} 1300`} stroke="#2a1e1c" strokeWidth={4} />)}
      <rect y={1286} width={W} height={26} fill="#2a2430" stroke={OUT} strokeWidth={4} />
      {/* pencere: tül perde ardında gece şehri (soğuk arka ışık) */}
      <rect x={640} y={330} width={330} height={560} fill="url(#kev_pen)" stroke="#3a3e52" strokeWidth={14} />
      {[[680, 700, 60, 190], [760, 640, 80, 250], [860, 720, 70, 170]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#0c0e1e" />
          {new Array(6).fill(0).map((_, j) => <rect key={j} x={x + 10 + (j % 2) * (w / 2 - 4)} y={y + 16 + Math.floor(j / 2) * 40} width={14} height={18} fill="#f2c46a" opacity={random(`kp${i}${j}`) > 0.45 ? 0.85 : 0.12} />)}
        </g>
      ))}
      <circle cx={900} cy={420} r={26} fill="#f4f0d8" opacity={0.85} />
      <path d="M 805 330 V 890 M 640 610 H 970" stroke="#3a3e52" strokeWidth={10} />
      <path d={`M 626 310 Q ${700 + Math.sin(frame / 30) * 6} 600 650 930 L 760 930 Q 740 600 760 310 Z`} fill="#e8e8f4" opacity={0.2} />
      <path d={`M 984 310 Q ${930 + Math.sin(frame / 34) * 6} 600 960 930 L 860 930 Q 880 600 860 310 Z`} fill="#e8e8f4" opacity={0.2} />
      <rect x={600} y={300} width={410} height={20} rx={8} fill="#5a4a3a" stroke={OUT} strokeWidth={4} />
      {/* duvarda düğün fotoğrafı + nazarlık + saat */}
      <rect x={140} y={470} width={190} height={240} fill="#5a4630" stroke={OUT} strokeWidth={6} />
      <rect x={160} y={490} width={150} height={200} fill="#8a9ab0" />
      <circle cx={210} cy={560} r={24} fill="#d8b894" /><circle cx={262} cy={566} r={22} fill="#d8b894" />
      <path d="M 180 690 Q 210 600 240 690 Z" fill="#2a2a34" /><path d="M 236 690 Q 262 596 292 690 Z" fill="#f4f2f0" />
      <circle cx={470} cy={430} r={34} fill="#1e4fb0" stroke={OUT} strokeWidth={4} />
      <circle cx={470} cy={430} r={22} fill="#f4f6fa" /><circle cx={470} cy={430} r={13} fill="#6ab0ec" /><circle cx={470} cy={430} r={6} fill="#10142a" />
      <path d="M 470 396 V 360" stroke="#c9a24a" strokeWidth={3} />
      {/* kanepe (bordo, sırtında dantel örtü) */}
      <path d="M 170 1060 Q 170 990 240 990 L 920 990 Q 990 990 990 1060 L 990 1360 L 170 1360 Z" fill="#6a2a34" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
      {/* sırt minderine asılı dantel örtü (tığ işi): dikdörtgen, alt kenarı fistolu */}
      <path d={`M 470 984 L 650 984 L 650 1060 ${new Array(9).fill(0).map((_, i) => `Q ${640 - i * 20} ${1080} ${630 - i * 20} 1060`).join(" ")} L 470 1060 Z`} fill="#f2ece0" opacity={0.9} stroke="#cfc6b4" strokeWidth={3} />
      {new Array(8).fill(0).map((_, i) => <circle key={i} cx={490 + i * 20} cy={1020} r={6} fill="none" stroke="#cfc6b4" strokeWidth={2} />)}
      <rect x={130} y={1120} width={130} height={300} rx={40} fill="#7a3440" stroke={OUT} strokeWidth={7} />
      <rect x={900} y={1120} width={130} height={300} rx={40} fill="#7a3440" stroke={OUT} strokeWidth={7} />
      <rect x={240} y={1200} width={680} height={150} rx={20} fill="#7a3440" stroke={OUT} strokeWidth={6} />
      <path d="M 580 1206 V 1346" stroke="#4a1a22" strokeWidth={5} />
      <rect x={760} y={1100} width={130} height={110} rx={24} fill="#e0a43a" stroke={OUT} strokeWidth={5} transform="rotate(10 825 1155)" />
      <rect x={250} y={1110} width={120} height={100} rx={22} fill="#3a6a8a" stroke={OUT} strokeWidth={5} transform="rotate(-12 310 1160)" />
      {/* TV ışığı odaya (sol): titrer */}
      <ellipse cx={120} cy={1060} rx={620} ry={560} fill="url(#kev_tv)" opacity={tv} />
    </g>
  );
};

export const KdEvFG: React.FC<{ frame: number }> = ({ frame }) => {
  const tv = 0.75 + 0.25 * Math.sin(frame / 3.1) * Math.sin(frame / 7.3);
  return (
    <g>
      <defs>
        <linearGradient id="kev_ekran" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#bfe2ff" /><stop offset="1" stopColor="#3a7ad8" /></linearGradient>
        <radialGradient id="kev_vin" cx="0.55" cy="0.5" r="0.75"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#05040c" stopOpacity={0.6} /></radialGradient>
      </defs>
      {/* sehpa: cips paketleri, kola şişesi, çay bardağı, çekirdek kabukları, kumanda */}
      <path d="M 120 1600 L 960 1600 L 1000 1660 L 80 1660 Z" fill="#5a3a28" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
      <rect x={80} y={1660} width={920} height={40} fill="#3e2818" stroke={OUT} strokeWidth={6} />
      <rect x={120} y={1700} width={36} height={220} fill="#3e2818" stroke={OUT} strokeWidth={5} />
      <rect x={924} y={1700} width={36} height={220} fill="#3e2818" stroke={OUT} strokeWidth={5} />
      {/* cips paketi 1 (açık, devrik) */}
      <path d="M 200 1612 L 214 1520 L 330 1508 L 350 1604 Z" fill="#e8462e" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 214 1520 l 14 -12 l 14 10 l 16 -12 l 14 10 l 16 -10 l 14 10 l 14 -8 l 14 10" stroke={OUT} strokeWidth={4} fill="#d8d8dc" />
      <circle cx={276} cy={1562} r={26} fill="#f6c63a" stroke={OUT} strokeWidth={3} />
      {[[360, 1606], [378, 1600], [394, 1608]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={14} ry={7} fill="#f2c45a" stroke={OUT} strokeWidth={2} />)}
      {/* cips paketi 2 (yeşil, buruşuk boş) */}
      <path d="M 420 1606 Q 412 1560 440 1546 L 500 1540 Q 524 1560 516 1606 Z" fill="#3aa04a" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 438 1570 l 20 8 l 22 -10 M 448 1590 l 30 2" stroke="#1e6a2a" strokeWidth={3} fill="none" />
      {/* kola şişesi (etiketsiz) */}
      <path d="M 560 1608 L 560 1500 Q 560 1470 574 1460 L 574 1430 L 594 1430 L 594 1460 Q 608 1470 608 1500 L 608 1608 Z" fill="#3a1a12" stroke={OUT} strokeWidth={5} />
      <rect x={560} y={1520} width={48} height={36} fill="#c8282e" />
      <rect x={572} y={1418} width={24} height={14} fill="#c8282e" stroke={OUT} strokeWidth={3} />
      {/* çay bardağı + tabağı */}
      <ellipse cx={690} cy={1604} rx={44} ry={10} fill="#e8e8e8" stroke={OUT} strokeWidth={4} />
      <path d="M 668 1600 Q 660 1560 672 1530 Q 664 1510 672 1490 L 708 1490 Q 716 1510 708 1530 Q 720 1560 712 1600 Z" fill="#c8602a" fillOpacity={0.85} stroke={OUT} strokeWidth={4} />
      {/* çekirdek kabukları tabakta */}
      <ellipse cx={830} cy={1604} rx={74} ry={16} fill="#f2f0ea" stroke={OUT} strokeWidth={4} />
      {new Array(16).fill(0).map((_, i) => <ellipse key={i} cx={776 + (i % 8) * 15} cy={1594 - Math.floor(i / 8) * 8} rx={7} ry={3.5} fill={i % 3 ? "#2a2a2a" : "#d8d4c8"} transform={`rotate(${random(`ck${i}`) * 180} ${776 + (i % 8) * 15} ${1594 - Math.floor(i / 8) * 8})`} />)}
      <rect x={880} y={1630} width={90} height={22} rx={8} fill="#22242a" stroke={OUT} strokeWidth={3} transform="rotate(-8 925 1641)" />
      {/* TV (sol önde, ekran kanepeye dönük; titreyen ışık) */}
      <path d="M -10 1090 L 120 1120 L 120 1500 L -10 1540 Z" fill="#101218" stroke={OUT} strokeWidth={6} />
      <path d="M 0 1104 L 108 1130 L 108 1490 L 0 1524 Z" fill="url(#kev_ekran)" opacity={0.55 + 0.45 * tv} />
      <rect x={-20} y={1540} width={200} height={100} fill="#2a2228" stroke={OUT} strokeWidth={5} />
      <rect width={W} height={H} fill="url(#kev_vin)" />
    </g>
  );
};

/* ===================================================================== C. MARKET ÖNÜ (gece, dış) */
export const KD_MARKET_MARKS = {
  kapi: { x: 720, y: 1560, size: 1000 },
  kaldirim: { x: 420, y: 1620, size: 1060 },
  on: { x: 540, y: 1800, size: 1240 },
  van: { x: 300, y: 1800, size: 1000 },
};

export const KdMarketOnuBG: React.FC<{ frame: number }> = ({ frame }) => {
  const vizz = 0.92 + 0.08 * Math.sin(frame / 2.3) * (random(`neon${Math.floor(frame / 9)}`) > 0.85 ? 0 : 1);
  return (
    <g>
      <defs>
        <linearGradient id="kmo_gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c0c26" /><stop offset="1" stopColor="#2a1e46" /></linearGradient>
        <Glow id="kmo_lamba" c="#ffa63a" o={0.6} />
        <Glow id="kmo_vitrin" c="#fff6dc" o={0.45} />
        <linearGradient id="kmo_isik" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb04a" stopOpacity={0.4} /><stop offset="1" stopColor="#ffb04a" stopOpacity={0} /></linearGradient>
        <linearGradient id="kmo_yol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2630" /><stop offset="1" stopColor="#121016" /></linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#kmo_gok)" />
      {new Array(30).fill(0).map((_, i) => <circle key={i} cx={random(`st${i}`) * W} cy={random(`sy${i}`) * 300 + 40} r={1.6} fill="#ffffff" opacity={0.5} />)}
      {/* sol: karşı yandaki eski bina + elektrik direği */}
      <rect x={-20} y={300} width={300} height={900} fill="#2e2a3a" stroke={OUT} strokeWidth={6} />
      {[0, 1, 2].map((r) => <rect key={r} x={60} y={360 + r * 240} width={130} height={160} fill={r === 1 ? "#6a8ad8" : "#141424"} opacity={r === 1 ? 0.6 : 1} stroke={OUT} strokeWidth={4} />)}
      <path d="M -20 240 Q 300 300 600 230 Q 900 300 1100 250" stroke="#0a0a0a" strokeWidth={3} fill="none" />
      {/* cephe grubu: kamera dükkâna yakın (ölçek 1,45; kapı ≈ 300 px, insan boyuyla uyumlu) */}
      <g transform="translate(540 1380) scale(1.45) translate(-690 -1380)">
      {/* apartman (marketin üstü), 3 kat; birkaç pencere yanık */}
      <rect x={300} y={160} width={800} height={1020} fill="#4a3a44" stroke={OUT} strokeWidth={6} />
      {new Array(3).fill(0).map((_, r) => new Array(3).fill(0).map((__, c) => {
        const on = random(`apw${r}${c}`) > 0.5;
        return (
          <g key={`${r}${c}`}>
            <rect x={350 + c * 240} y={220 + r * 260} width={150} height={180} fill={on ? "#f4c66a" : "#1a1a2a"} stroke={OUT} strokeWidth={5} />
            {on ? <path d={`M ${350 + c * 240} ${220 + r * 260} h 150 v 40 q -75 20 -150 0 Z`} fill="#c87a4a" opacity={0.7} /> : null}
            <rect x={340 + c * 240} y={400 + r * 260} width={170} height={14} fill="#5a4a54" stroke={OUT} strokeWidth={3} />
          </g>
        );
      }))}
      {/* klima dış ünitesi + çamaşır ipi */}
      <rect x={830} y={720} width={90} height={60} fill="#c8c8cc" stroke={OUT} strokeWidth={4} />
      <circle cx={875} cy={750} r={20} fill="none" stroke="#7a7a80" strokeWidth={4} />
      <path d="M 300 600 Q 200 640 0 610" stroke="#111" strokeWidth={3} fill="none" />
      {/* market cephesi */}
      <rect x={300} y={960} width={780} height={420} fill="#e8e2d6" stroke={OUT} strokeWidth={6} />
      {/* tabela (uydurma): ÇINAR MARKET */}
      <rect x={320} y={980} width={740} height={110} rx={10} fill="#1e6a46" stroke={OUT} strokeWidth={6} />
      <text x={690} y={1056} textAnchor="middle" fontFamily="DiziSans, Arial" fontWeight={900} fontSize={66} fill="#fff6d8" opacity={vizz} letterSpacing={4}>ÇINAR MARKET</text>
      <text x={1010} y={1078} textAnchor="end" fontFamily="DiziSans, Arial" fontWeight={800} fontSize={22} fill="#bfe6cc">şarküteri · manav · ekmek</text>
      {/* tente: yeşil-beyaz çizgili */}
      <path d="M 310 1092 L 1080 1092 L 1080 1150 L 310 1150 Z" fill="#f4f2ea" stroke={OUT} strokeWidth={5} />
      {new Array(10).fill(0).map((_, i) => <path key={i} d={`M ${310 + i * 80} 1092 h 40 v 58 h -40 Z`} fill="#2a8a5a" />)}
      {new Array(10).fill(0).map((_, i) => <path key={`f${i}`} d={`M ${310 + i * 80} 1150 q 20 24 40 0 q 20 24 40 0`} fill="#f4f2ea" stroke={OUT} strokeWidth={3} />)}
      {/* vitrin (sıcak beyaz ışık, raf siluetleri) + cam kapı */}
      <rect x={330} y={1180} width={330} height={200} fill="#fff4d6" stroke={OUT} strokeWidth={6} />
      {[0, 1].map((r) => <g key={r}><rect x={340} y={1230 + r * 70} width={310} height={8} fill="#b8a888" />{new Array(9).fill(0).map((_, i) => <rect key={i} x={346 + i * 34} y={1196 + r * 70} width={26} height={34} fill={["#d84a3a", "#3a8ad8", "#f2c43a", "#4ab86a"][(i + r) % 4]} opacity={0.75} />)}</g>)}
      <text x={495} y={1370} textAnchor="middle" fontFamily="DiziSans, Arial" fontWeight={900} fontSize={30} fill="#c8282e">TAZE EKMEK · SÜT · ÇAY</text>
      <rect x={680} y={1170} width={170} height={210} fill="#d8ecf4" fillOpacity={0.55} stroke={OUT} strokeWidth={6} />
      <path d="M 765 1170 V 1380" stroke={OUT} strokeWidth={4} />
      <rect x={740} y={1270} width={8} height={40} rx={3} fill="#c8ccd0" /><rect x={782} y={1270} width={8} height={40} rx={3} fill="#c8ccd0" />
      <text x={765} y={1222} textAnchor="middle" fontFamily="DiziSans, Arial" fontWeight={900} fontSize={22} fill="#1e6a46">AÇIK</text>
      {/* ekmek dolabı + meyve kasaları + kedi */}
      <rect x={880} y={1180} width={170} height={200} fill="#b8b4ac" stroke={OUT} strokeWidth={5} />
      <rect x={894} y={1196} width={142} height={120} fill="#e8d4a8" stroke={OUT} strokeWidth={3} />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={930 + i * 36} cy={1250} rx={20} ry={36} fill="#d8a45a" stroke={OUT} strokeWidth={3} transform={`rotate(70 ${930 + i * 36} 1250)`} />)}
      <rect x={884} y={1330} width={160} height={46} fill="#a8622a" stroke={OUT} strokeWidth={4} />
      {[[890, 1320, "#d8302a"], [930, 1316, "#e8462e"], [968, 1320, "#c8282e"], [1006, 1318, "#d83a2a"]].map(([x, y, c], i) => <circle key={i} cx={x as number} cy={y as number} r={17} fill={c as string} stroke={OUT} strokeWidth={3} />)}
      <g transform={`translate(1000 1288) rotate(${Math.sin(frame / 20) * 3})`}>
        <ellipse cx={0} cy={0} rx={26} ry={18} fill="#e89a3a" stroke={OUT} strokeWidth={3} />
        <circle cx={-22} cy={-14} r={14} fill="#e89a3a" stroke={OUT} strokeWidth={3} />
        <path d="M -32 -24 l 2 -12 l 8 8 Z M -18 -28 l 6 -10 l 4 12 Z" fill="#e89a3a" stroke={OUT} strokeWidth={2} />
        <path d="M 24 0 q 20 -10 14 -30" stroke="#e89a3a" strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d="M -27 -14 q 3 -3 6 0 M -19 -14 q 3 -3 6 0" stroke={OUT} strokeWidth={2} fill="none" />
      </g>
      </g>
      {/* kaldırım (parke taş) + bordür */}
      <rect y={1380} width={W} height={110} fill="#5a5258" />
      {new Array(18).fill(0).map((_, i) => <path key={i} d={`M ${i * 64} 1380 l -24 110`} stroke="#4a4248" strokeWidth={3} />)}
      {[1410, 1446].map((y) => <path key={y} d={`M 0 ${y} H ${W}`} stroke="#4a4248" strokeWidth={3} />)}
      <rect y={1488} width={W} height={26} fill="#8a8288" stroke={OUT} strokeWidth={4} />
      {/* yol */}
      <rect y={1514} width={W} height={H - 1514} fill="url(#kmo_yol)" />
      {new Array(5).fill(0).map((_, i) => <rect key={i} x={i * 260 - 40} y={1760} width={150} height={14} fill="#d8c86a" opacity={0.6} />)}
      {/* sokak lambası (sol): sodyum turuncusu ışık konisi */}
      <rect x={150} y={420} width={18} height={1080} fill="#2a2a30" stroke={OUT} strokeWidth={4} />
      <path d="M 159 430 Q 170 380 250 384 L 270 384" stroke="#2a2a30" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M 236 380 L 306 380 L 296 404 L 246 404 Z" fill="#3a3a40" stroke={OUT} strokeWidth={4} />
      <ellipse cx={271} cy={406} rx={22} ry={8} fill="#ffd28a" />
      <path d="M 250 410 L 0 1520 L 720 1520 L 292 410 Z" fill="url(#kmo_isik)" />
      <circle cx={271} cy={410} r={120} fill="url(#kmo_lamba)" />
      <ellipse cx={300} cy={1500} rx={420} ry={90} fill="#ffa63a" opacity={0.16} />
      {/* vitrin ışığı kaldırıma taşar */}
      <ellipse cx={600} cy={1440} rx={380} ry={110} fill="url(#kmo_vitrin)" />
    </g>
  );
};

export const KdMarketOnuFG: React.FC<{ frame: number }> = () => (
  <g>
    <defs>
      <radialGradient id="kmo_vin" cx="0.5" cy="0.55" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#060410" stopOpacity={0.55} /></radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#kmo_vin)" />
  </g>
);

/* ===================================================================== D. GECE CADDESİ */
export type CaddeView = "takip" | "kavsak";
export const KD_CADDE_MARKS = {
  takip: { motor: { x: 540, y: 1720, size: 1120, sit: true } },
  kavsak: { yaya: { x: 820, y: 1700, size: 760 } },
};

export const KdCaddeBG: React.FC<{ frame: number; view: CaddeView }> = ({ frame, view }) => {
  const t = frame / 30;
  if (view === "kavsak") {
    const isik = Math.floor(t / 2) % 2 ? "#ff3a3a" : "#3aff7a";
    return (
      <g>
        <defs>
          <linearGradient id="kc_gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0c22" /><stop offset="1" stopColor="#30204a" /></linearGradient>
          <Glow id="kc_sod" c="#ff9e3a" o={0.5} />
          <Glow id="kc_trf" c={isik} o={0.55} />
        </defs>
        <rect width={W} height={H} fill="url(#kc_gok)" />
        {/* binalar (iki köşe) */}
        <path d="M -20 260 L 360 330 L 360 1160 L -20 1160 Z" fill="#2a2638" stroke={OUT} strokeWidth={6} />
        <path d="M 1100 240 L 720 330 L 720 1160 L 1100 1160 Z" fill="#332c40" stroke={OUT} strokeWidth={6} />
        {new Array(12).fill(0).map((_, i) => {
          const r = Math.floor(i / 3), c = i % 3;
          return <rect key={i} x={30 + c * 100} y={400 + r * 180} width={60} height={90} fill={random(`kl${i}`) > 0.5 ? "#f2c46a" : "#151526"} />;
        })}
        {new Array(12).fill(0).map((_, i) => {
          const r = Math.floor(i / 3), c = i % 3;
          return <rect key={`r${i}`} x={780 + c * 100} y={400 + r * 180} width={60} height={90} fill={random(`kr${i}`) > 0.55 ? "#9ab8f4" : "#151526"} opacity={0.9} />;
        })}
        {/* uzaktaki cadde */}
        <rect x={360} y={900} width={360} height={260} fill="#1a1824" />
        {new Array(6).fill(0).map((_, i) => <circle key={i} cx={400 + i * 60} cy={1000 + (i % 2) * 20} r={6} fill="#ffd28a" />)}
        {/* asfalt + kavşak + yaya geçidi */}
        <path d="M 0 1160 L 1080 1160 L 1080 1920 L 0 1920 Z" fill="#26232c" />
        <path d="M 0 1160 L 360 1160 L 0 1260 Z M 1080 1160 L 720 1160 L 1080 1260 Z" fill="#4a4450" />
        {new Array(8).fill(0).map((_, i) => <path key={i} d={`M ${400 + i * 40} 1200 L ${380 + i * 46 - (i - 3.5) * 30} 1340 L ${400 + i * 46 - (i - 3.5) * 30} 1340 L ${418 + i * 40} 1200 Z`} fill="#e8e4dc" opacity={0.85} />)}
        <path d="M 540 1360 L 540 1920" stroke="#e8d06a" strokeWidth={14} strokeDasharray="70 60" />
        {/* trafik ışığı (sağ) */}
        <rect x={880} y={520} width={16} height={700} fill="#2a2a30" stroke={OUT} strokeWidth={4} />
        <rect x={846} y={420} width={84} height={220} rx={14} fill="#1a1a1e" stroke={OUT} strokeWidth={5} />
        {["#ff3a3a", "#ffc23a", "#3aff7a"].map((c, i) => <circle key={c} cx={888} cy={462 + i * 68} r={24} fill={c === isik ? c : "#2a2a2e"} stroke={OUT} strokeWidth={3} />)}
        <circle cx={888} cy={isik === "#ff3a3a" ? 462 : 598} r={110} fill="url(#kc_trf)" />
        {/* sodyum lambalar */}
        {[180, 540].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={300 + i * 240} r={180} fill="url(#kc_sod)" />
            <circle cx={x} cy={300 + i * 240} r={12} fill="#ffd28a" />
          </g>
        ))}
        <ellipse cx={540} cy={1500} rx={600} ry={220} fill="#ff9e3a" opacity={0.1} />
      </g>
    );
  }
  // takip: yol ufka doğru daralır; şerit çizgileri ve lambalar kameraya doğru akar
  const VX = 540, VY = 960;
  const flow = (t * 1.6) % 1;
  const depthY = (k: number) => VY + (H - VY) * k * k;
  return (
    <g>
      <defs>
        <linearGradient id="kt_gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#080a20" /><stop offset="1" stopColor="#3a2450" /></linearGradient>
        <linearGradient id="kt_yol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2a30" /><stop offset="1" stopColor="#141218" /></linearGradient>
        <Glow id="kt_sod" c="#ffa040" o={0.7} />
      </defs>
      <rect width={W} height={H} fill="url(#kt_gok)" />
      {/* şehir silueti (ufuk) */}
      <path d={`M 0 ${VY} L 0 760 L 80 760 L 80 700 L 160 700 L 160 800 L 240 800 L 240 640 L 330 640 L 330 820 L 420 820 L 420 880 L 660 880 L 660 780 L 740 780 L 740 660 L 840 660 L 840 740 L 940 740 L 940 690 L 1080 690 L 1080 ${VY} Z`} fill="#1c1830" />
      {new Array(28).fill(0).map((_, i) => <rect key={i} x={random(`cw${i}`) * W} y={680 + random(`ch${i}`) * 220} width={10} height={14} fill="#f2c46a" opacity={random(`co${i}`) > 0.4 ? 0.8 : 0.2} />)}
      <rect y={VY} width={W} height={H - VY} fill="url(#kt_yol)" />
      {/* kaldırımlar */}
      <path d={`M ${VX - 30} ${VY} L -400 ${H} L -60 ${H} L ${VX - 10} ${VY} Z`} fill="#4a3e48" />
      <path d={`M ${VX + 30} ${VY} L 1480 ${H} L 1140 ${H} L ${VX + 10} ${VY} Z`} fill="#4a3e48" />
      {/* akan şerit çizgileri */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const k0 = ((i + flow) / 6), k1 = k0 + 0.07;
        const y0 = depthY(k0), y1 = depthY(Math.min(1.2, k1));
        const wd = (y: number) => ((y - VY) / (H - VY)) * 22 + 2;
        return <path key={i} d={`M ${VX - wd(y0)} ${y0} L ${VX + wd(y0)} ${y0} L ${VX + wd(y1)} ${y1} L ${VX - wd(y1)} ${y1} Z`} fill="#f2e6a0" opacity={0.85} />;
      })}
      {/* sokak lambaları iki yanda: kameraya doğru gelip dışarı kayar */}
      {[0, 1, 2, 3].map((i) => {
        const k = ((i + flow) / 4);
        const s = 0.1 + 1.6 * k * k;
        const y = VY - 40 - 900 * k * k;
        return [-1, 1].map((sd) => {
          const x = VX + sd * (40 + 900 * k * k);
          return (
            <g key={`${i}${sd}`} opacity={Math.min(1, k * 4)}>
              <path d={`M ${x} ${y} L ${x} ${VY + (H - VY) * k * k * 0.8}`} stroke="#2a2830" strokeWidth={10 * s} />
              <circle cx={x - sd * 30 * s} cy={y} r={160 * s} fill="url(#kt_sod)" />
              <ellipse cx={x - sd * 30 * s} cy={y} rx={22 * s} ry={9 * s} fill="#ffe0a0" />
            </g>
          );
        });
      })}
      {/* hız çizgileri */}
      {new Array(10).fill(0).map((_, i) => {
        const a = random(`hz${i}`) * Math.PI * 2;
        const k = (flow + i / 10) % 1;
        const r0 = 300 + 900 * k, r1 = r0 + 160;
        return <path key={i} d={`M ${VX + Math.cos(a) * r0} ${VY + Math.sin(a) * r0 * 0.7} L ${VX + Math.cos(a) * r1} ${VY + Math.sin(a) * r1 * 0.7}`} stroke="#ffffff" strokeWidth={3} opacity={0.18} />;
      })}
    </g>
  );
};

/** Kuryenin motosikleti, önden (takip çekimi): ön kalkan, far, ön cam, aynalar, gidon. Karakterin önüne çizilir. */
export const KuryeMotor: React.FC<{ x: number; y: number; s?: number; frame: number }> = ({ x, y, s = 1, frame }) => {
  const sars = Math.sin(frame / 2.2) * 2;
  return (
    <g transform={`translate(${x} ${y + sars}) scale(${s})`}>
      <defs>
        <Glow id="km_far" c="#fff6d8" o={0.9} />
      </defs>
      {/* aynalar + gidon (ellerin hizası y≈-560) */}
      <path d="M -250 -560 L -150 -540 M 250 -560 L 150 -540" stroke="#1a1a1e" strokeWidth={18} strokeLinecap="round" />
      <path d="M -200 -560 L -230 -680 M 200 -560 L 230 -680" stroke="#2a2a30" strokeWidth={8} />
      <ellipse cx={-236} cy={-700} rx={36} ry={24} fill="#1a1a1e" stroke={OUT} strokeWidth={5} />
      <ellipse cx={236} cy={-700} rx={36} ry={24} fill="#1a1a1e" stroke={OUT} strokeWidth={5} />
      {/* ön cam (şeffaf) */}
      <path d="M -120 -600 Q 0 -700 120 -600 L 100 -480 L -100 -480 Z" fill="#bfe0ff" fillOpacity={0.22} stroke={OUT} strokeWidth={4} />
      {/* ön kalkan (gövde) */}
      <path d="M -170 -500 Q 0 -560 170 -500 L 140 -120 Q 0 -80 -140 -120 Z" fill="#e8e6e2" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
      <path d="M -150 -470 Q 0 -520 150 -470" stroke="#18a39a" strokeWidth={16} fill="none" />
      <path d="M 120 -440 L 104 -150" stroke="#c8c4bc" strokeWidth={14} />
      {/* far */}
      <circle cx={0} cy={-400} r={54} fill="#fff6d8" stroke={OUT} strokeWidth={6} />
      <circle cx={0} cy={-400} r={210} fill="url(#km_far)" opacity={0.7} />
      {/* sinyaller */}
      <rect x={-150} y={-330} width={40} height={20} rx={8} fill="#ffae3a" stroke={OUT} strokeWidth={4} />
      <rect x={110} y={-330} width={40} height={20} rx={8} fill="#ffae3a" stroke={OUT} strokeWidth={4} />
      {/* çamurluk + ön teker */}
      <path d="M -70 -130 Q 0 -170 70 -130 L 60 -40 L -60 -40 Z" fill="#d8d4cc" stroke={OUT} strokeWidth={5} />
      <rect x={-34} y={-60} width={68} height={160} rx={30} fill="#141416" stroke={OUT} strokeWidth={5} />
      <path d="M -20 -40 V 90 M 20 -40 V 90" stroke="#2a2a2e" strokeWidth={4} />
      {/* plaka yok (önden), sadece yansıtıcı */}
      <rect x={-30} y={-210} width={60} height={18} rx={6} fill="#ff5a3a" stroke={OUT} strokeWidth={3} />
    </g>
  );
};

/** Kaçırma minibüsü: koyu gri panel van. yan: kayar kapı (acik 0..1), sürücü siluet, çamurlu okunmaz plaka. on: önden farlar. */
export const KacirmaVan: React.FC<{ x: number; y: number; s?: number; view?: "yan" | "on"; acik?: number; frame: number; yon?: 1 | -1 }> = ({ x, y, s = 1, view = "yan", acik = 0, frame, yon = 1 }) => {
  const titre = Math.sin(frame / 1.6) * 1.5;
  if (view === "on") {
    return (
      <g transform={`translate(${x} ${y + titre}) scale(${s})`}>
        <defs><Glow id="kv_far" c="#fffbe8" o={0.95} /></defs>
        <path d="M -330 -40 L -320 -560 Q -300 -660 -200 -670 L 200 -670 Q 300 -660 320 -560 L 330 -40 Z" fill="#2a2d33" stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
        <path d="M -270 -620 L 270 -620 L 290 -420 L -290 -420 Z" fill="#0e1218" stroke={OUT} strokeWidth={6} />
        {/* sürücü siluet (kar maskeli, sol koltuk) */}
        <path d="M -200 -420 Q -200 -520 -150 -540 Q -100 -560 -80 -500 Q -70 -460 -60 -420 Z" fill="#050608" />
        <ellipse cx={-140} cy={-520} rx={6} ry={3} fill="#9aa0a8" opacity={0.7} /><ellipse cx={-116} cy={-520} rx={6} ry={3} fill="#9aa0a8" opacity={0.7} />
        <path d="M -230 -600 L -60 -460" stroke="#ffffff" strokeWidth={10} opacity={0.08} />
        <rect x={-200} y={-300} width={400} height={90} rx={12} fill="#1a1c20" stroke={OUT} strokeWidth={5} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M -180 ${-282 + i * 20} H 180`} stroke="#3a3c42" strokeWidth={5} />)}
        {[-1, 1].map((sd) => (
          <g key={sd}>
            <rect x={sd > 0 ? 210 : -300} y={-320} width={90} height={60} rx={14} fill="#fffbe8" stroke={OUT} strokeWidth={5} />
            <circle cx={sd * 255} cy={-290} r={260} fill="url(#kv_far)" />
          </g>
        ))}
        {/* plaka: çamurla kaplı, okunmaz */}
        <rect x={-110} y={-170} width={220} height={52} rx={6} fill="#e8e8e4" stroke={OUT} strokeWidth={5} />
        <rect x={-110} y={-170} width={18} height={52} fill="#2a4aa8" />
        <path d="M -90 -160 Q -40 -190 20 -150 Q 70 -170 108 -136 L 108 -120 Q 40 -130 -20 -122 Q -60 -128 -90 -122 Z" fill="#5a4a38" opacity={0.92} />
        <path d="M -330 -60 H 330 V 0 H -330 Z" fill="#1a1c20" stroke={OUT} strokeWidth={6} />
        <rect x={-310} y={-20} width={110} height={70} rx={14} fill="#0c0c0e" stroke={OUT} strokeWidth={5} />
        <rect x={200} y={-20} width={110} height={70} rx={14} fill="#0c0c0e" stroke={OUT} strokeWidth={5} />
      </g>
    );
  }
  const k = Math.max(0, Math.min(1, acik));
  return (
    <g transform={`translate(${x} ${y + titre}) scale(${s * yon} ${s})`}>
      <defs><Glow id="kv_farY" c="#fffbe8" o={0.8} /></defs>
      {/* gövde (sağa bakar: kaput sağda) */}
      <path d="M -520 -60 L -520 -560 Q -520 -600 -480 -600 L 230 -600 Q 290 -600 330 -520 L 420 -340 Q 470 -320 480 -260 L 490 -60 Z" fill="#2a2d33" stroke={OUT} strokeWidth={8} strokeLinejoin="round" />
      <path d="M -520 -300 L 490 -300" stroke="#1e2126" strokeWidth={6} />
      {/* sürücü kabini camı + siluet */}
      <path d="M 210 -560 L 300 -560 L 380 -360 L 210 -360 Z" fill="#0e1218" stroke={OUT} strokeWidth={6} />
      <path d="M 240 -360 Q 240 -470 280 -490 Q 320 -500 330 -440 Q 336 -400 330 -360 Z" fill="#050608" />
      <path d="M 220 -540 L 330 -380" stroke="#ffffff" strokeWidth={8} opacity={0.08} />
      {/* kayar yan kapı: açıldıkça geriye kayar, içerisi karanlık */}
      <rect x={-180} y={-560} width={330} height={500} fill="#050506" />
      <path d="M -170 -110 L 140 -110" stroke="#2a2a2e" strokeWidth={10} />
      <g transform={`translate(${-300 * k} 0)`}>
        <rect x={-180} y={-560} width={330} height={500} fill="#30333a" stroke={OUT} strokeWidth={6} />
        <rect x={-150} y={-530} width={270} height={170} fill="#0e1218" stroke={OUT} strokeWidth={5} />
        <rect x={110} y={-300} width={30} height={14} rx={5} fill="#8a8e94" stroke={OUT} strokeWidth={3} />
      </g>
      {/* arka cam + stop */}
      <rect x={-500} y={-560} width={140} height={170} fill="#0e1218" stroke={OUT} strokeWidth={5} />
      <rect x={-524} y={-260} width={22} height={80} rx={6} fill="#d8282e" stroke={OUT} strokeWidth={4} />
      {/* ezik + çamur */}
      <path d="M -440 -150 q 40 -20 80 0 M 340 -150 q 30 10 60 -6" stroke="#1a1c20" strokeWidth={6} fill="none" />
      <path d="M -520 -110 Q -400 -150 -300 -100 Q -200 -140 -100 -96 L -100 -60 L -520 -60 Z" fill="#4a3e30" opacity={0.6} />
      {/* arka plaka: çamurlu, okunmaz */}
      <rect x={-532} y={-180} width={16} height={46} fill="#e8e8e4" stroke={OUT} strokeWidth={3} />
      {/* far */}
      <rect x={440} y={-300} width={46} height={40} rx={10} fill="#fffbe8" stroke={OUT} strokeWidth={4} />
      <path d="M 486 -280 L 1100 -460 L 1100 -60 Z" fill="#fffbe8" opacity={0.12} />
      <circle cx={470} cy={-280} r={120} fill="url(#kv_farY)" />
      {/* tekerlekler */}
      {[-330, 300].map((wx) => (
        <g key={wx} transform={`rotate(${frame * 9} ${wx} -60)`}>
          <circle cx={wx} cy={-60} r={86} fill="#111214" stroke={OUT} strokeWidth={6} />
          <circle cx={wx} cy={-60} r={40} fill="#5a5e66" stroke={OUT} strokeWidth={4} />
          <path d={`M ${wx - 34} -60 H ${wx + 34} M ${wx} -94 V -26`} stroke="#2a2c30" strokeWidth={6} />
        </g>
      ))}
      <ellipse cx={0} cy={26} rx={560} ry={22} fill="#000" opacity={0.4} />
    </g>
  );
};

/* ===================================================================== E. INFLUENCER ODASI */
export const KD_YAYIN_MARKS = {
  masa: { x: 540, y: 1640, size: 1080, sit: true },
  ayak: { x: 540, y: 1800, size: 1220 },
  kapi: { x: 880, y: 1500, size: 900 },
};

export const KdYayinBG: React.FC<{ frame: number; kapiAcik?: number }> = ({ frame, kapiAcik = 0.12 }) => {
  const led = 0.85 + 0.15 * Math.sin(frame / 18);
  return (
    <g>
      <defs>
        <linearGradient id="ky_duvar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a2456" /><stop offset="0.6" stopColor="#5a2e6a" /><stop offset="1" stopColor="#2a1a3a" /></linearGradient>
        <linearGradient id="ky_led" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff5ad8" stopOpacity={0.75} /><stop offset="1" stopColor="#ff5ad8" stopOpacity={0} /></linearGradient>
        <Glow id="ky_pem" c="#ff7ad8" o={0.5} />
        <Glow id="ky_mor" c="#9a6aff" o={0.5} />
        <Glow id="ky_ring" c="#f4f8ff" o={0.55} />
      </defs>
      <rect width={W} height={H} fill="url(#ky_duvar)" />
      {/* LED şerit (tavan kenarı) ve duvara vuran pembe ışık */}
      <rect x={0} y={190} width={W} height={14} fill="#ff8ae0" opacity={led} />
      <rect x={0} y={204} width={W} height={360} fill="url(#ky_led)" opacity={led} />
      {/* peri ışıkları */}
      <path d="M 40 330 Q 280 420 520 330 Q 760 420 1040 330" stroke="#2a1a2a" strokeWidth={3} fill="none" />
      {new Array(16).fill(0).map((_, i) => {
        const u = i / 15, xx = 40 + u * 1000;
        const yy = 330 + Math.sin(u * Math.PI * 2) ** 2 * 60;
        return <circle key={i} cx={xx} cy={yy + 8} r={7} fill="#fff0b0" opacity={0.6 + 0.4 * Math.sin(frame / 6 + i)} />;
      })}
      {/* posterler (uydurma, soyut) + polaroidler */}
      <rect x={90} y={460} width={200} height={270} fill="#ffd0e8" stroke={OUT} strokeWidth={5} transform="rotate(-4 190 595)" />
      <circle cx={190} cy={570} r={60} fill="#ff6ab0" /><path d="M 120 680 Q 190 620 260 680" stroke="#7a4ad8" strokeWidth={14} fill="none" />
      {[[330, 500, -8], [400, 520, 6], [360, 620, 3]].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x + 40} ${y + 48})`}>
          <rect x={x} y={y} width={80} height={96} fill="#f8f6f2" stroke={OUT} strokeWidth={3} />
          <rect x={x + 8} y={y + 8} width={64} height={60} fill={["#8ac8f4", "#f4b8d8", "#c8f4b8"][i]} />
        </g>
      ))}
      {/* arka kapı: aralık, ardı zifiri karanlık (arka oda) */}
      <rect x={760} y={500} width={260} height={880} fill="#2a1a34" stroke={OUT} strokeWidth={8} />
      <rect x={772} y={512} width={236} height={868} fill="#000000" />
      <path d={`M 772 512 L ${772 + 236 * (1 - kapiAcik)} ${512 - 20 * kapiAcik} L ${772 + 236 * (1 - kapiAcik)} ${1380 + 20 * kapiAcik} L 772 1380 Z`} fill="#4a3260" stroke={OUT} strokeWidth={6} />
      <circle cx={772 + 236 * (1 - kapiAcik) - 26} cy={950} r={10} fill="#c8b8d8" stroke={OUT} strokeWidth={3} />
      {/* raf: slime kavanozları */}
      <rect x={60} y={860} width={360} height={18} fill="#f4e8f0" stroke={OUT} strokeWidth={4} />
      {["#9ff0d8", "#ffb0d8", "#c8a8ff", "#fff09a", "#8ad0ff"].map((c, i) => (
        <g key={c}>
          <rect x={74 + i * 68} y={790} width={52} height={70} rx={10} fill={c} stroke={OUT} strokeWidth={4} />
          <rect x={72 + i * 68} y={780} width={56} height={16} rx={5} fill="#f4f4f4" stroke={OUT} strokeWidth={3} />
          <circle cx={90 + i * 68} cy={818} r={3} fill="#fff" />
        </g>
      ))}
      {/* yatak (arkada solda): kabarık yastıklar, peluş */}
      <rect x={-20} y={1150} width={660} height={260} rx={30} fill="#f8e4f0" stroke={OUT} strokeWidth={7} />
      <rect x={-20} y={1100} width={660} height={80} rx={30} fill="#e8b8d8" stroke={OUT} strokeWidth={6} />
      <ellipse cx={120} cy={1110} rx={110} ry={60} fill="#ffffff" stroke={OUT} strokeWidth={5} />
      <ellipse cx={330} cy={1116} rx={100} ry={56} fill="#c8b0f4" stroke={OUT} strokeWidth={5} />
      {/* peluş tavşan (uydurma) */}
      <g transform="translate(520 1080)">
        <ellipse cx={0} cy={30} rx={46} ry={40} fill="#fff4e0" stroke={OUT} strokeWidth={4} />
        <circle cx={0} cy={-20} r={34} fill="#fff4e0" stroke={OUT} strokeWidth={4} />
        <ellipse cx={-14} cy={-70} rx={11} ry={30} fill="#fff4e0" stroke={OUT} strokeWidth={4} />
        <ellipse cx={14} cy={-70} rx={11} ry={30} fill="#fff4e0" stroke={OUT} strokeWidth={4} />
        <circle cx={-10} cy={-22} r={3.5} fill={OUT} /><circle cx={10} cy={-22} r={3.5} fill={OUT} />
        <ellipse cx={-18} cy={-12} rx={6} ry={4} fill="#ffb0c8" /><ellipse cx={18} cy={-12} rx={6} ry={4} fill="#ffb0c8" />
      </g>
      {/* zemin (pembe halı) */}
      <rect y={1400} width={W} height={H - 1400} fill="#2a1a34" />
      <ellipse cx={540} cy={1700} rx={600} ry={230} fill="#f4c8e4" opacity={0.85} />
      {/* ışık: solda pembe dolgu, sağda mor arka ışık */}
      <circle cx={60} cy={900} r={560} fill="url(#ky_pem)" />
      <circle cx={1040} cy={700} r={520} fill="url(#ky_mor)" />
    </g>
  );
};

/** Ön plan: masa (slime malzemeleri), tripotta telefon (arkası), ring ışık (sol ön, kısmen kadraj dışı). */
export const KdYayinFG: React.FC<{ frame: number; yayin?: boolean }> = ({ frame, yayin = true }) => (
  <g>
    <defs>
      <Glow id="ky_ring2" c="#f4f8ff" o={0.5} />
      <radialGradient id="ky_vin" cx="0.5" cy="0.45" r="0.8"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#12061c" stopOpacity={0.55} /></radialGradient>
    </defs>
    {/* masa */}
    <path d="M 60 1560 L 1020 1560 L 1060 1640 L 20 1640 Z" fill="#f4f0f4" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
    <rect x={20} y={1640} width={1040} height={36} fill="#d8d0dc" stroke={OUT} strokeWidth={6} />
    {/* slime malzemeleri: kâse, yapıştırıcı şişesi, aktivatör, sim tüpleri, boya damlalık */}
    <path d="M 150 1572 Q 150 1500 250 1500 Q 350 1500 350 1572 Z" fill="#9fe8d8" stroke={OUT} strokeWidth={5} />
    <ellipse cx={250} cy={1504} rx={98} ry={18} fill="#c8a6ff" stroke={OUT} strokeWidth={4} />
    <path d="M 410 1572 L 410 1450 Q 410 1430 430 1430 L 470 1430 Q 490 1430 490 1450 L 490 1572 Z" fill="#f8f8f4" stroke={OUT} strokeWidth={5} />
    <path d="M 440 1430 L 445 1390 L 455 1390 L 460 1430 Z" fill="#ff9a3a" stroke={OUT} strokeWidth={3} />
    <rect x={418} y={1480} width={64} height={46} fill="#ffd84a" />
    <text x={450} y={1510} textAnchor="middle" fontFamily="DiziSans, Arial" fontWeight={900} fontSize={16} fill="#5a3a12">TUTKAL</text>
    <rect x={520} y={1480} width={60} height={92} rx={12} fill="#bfe4ff" fillOpacity={0.8} stroke={OUT} strokeWidth={4} />
    <rect x={530} y={1466} width={40} height={18} rx={4} fill="#3a8ad8" stroke={OUT} strokeWidth={3} />
    {["#ff6ab0", "#ffd84a", "#6ad8ff"].map((c, i) => (
      <g key={c} transform={`rotate(${-14 + i * 12} ${640 + i * 34} 1560)`}>
        <rect x={628 + i * 34} y={1490} width={24} height={76} rx={8} fill={c} stroke={OUT} strokeWidth={3} />
        {[0, 1, 2].map((j) => <circle key={j} cx={636 + i * 34 + j * 4} cy={1510 + j * 16} r={2.4} fill="#fff" />)}
      </g>
    ))}
    {/* tripot + telefon (arkası) */}
    <path d="M 820 1560 L 780 1640 M 860 1560 L 900 1640 M 840 1560 L 840 1300" stroke="#1a1a1e" strokeWidth={10} strokeLinecap="round" />
    <rect x={782} y={1170} width={116} height={200} rx={18} fill="#1e1e24" stroke={OUT} strokeWidth={5} />
    <circle cx={810} cy={1200} r={12} fill="#3a3a44" stroke="#5a5a66" strokeWidth={3} />
    <circle cx={836} cy={1200} r={8} fill="#3a3a44" />
    <rect x={792} y={1340} width={96} height={18} rx={5} fill={yayin ? "#ff3a5a" : "#3a3a44"} opacity={yayin ? 0.6 + 0.4 * Math.sin(frame / 5) : 1} />
    {/* telefon kılıfında süs (charm) */}
    <path d="M 890 1350 q 10 30 -6 50" stroke="#ff9cc8" strokeWidth={3} fill="none" />
    <circle cx={884} cy={1404} r={10} fill="#ffd84a" stroke={OUT} strokeWidth={3} />
    {/* ring ışık: sol önde, kadrajdan taşar; anahtar ışık */}
    <circle cx={-40} cy={860} r={260} fill="url(#ky_ring2)" />
    <circle cx={-40} cy={860} r={200} fill="none" stroke="#ffffff" strokeWidth={44} />
    <circle cx={-40} cy={860} r={200} fill="none" stroke={OUT} strokeWidth={5} />
    <circle cx={-40} cy={860} r={224} fill="none" stroke={OUT} strokeWidth={4} />
    <circle cx={-40} cy={860} r={176} fill="none" stroke={OUT} strokeWidth={4} />
    <path d="M 120 1040 L 160 1900" stroke="#1a1a1e" strokeWidth={14} />
    <rect width={W} height={H} fill="url(#ky_vin)" />
  </g>
);

/** Canlı yayın arayüzü (uydurma, platform logosu yok): CANLI etiketi, izleyici sayısı, kalpler, aslan hediyesi. */
export const YayinArayuz: React.FC<{ frame: number; izleyici?: number; aslan?: number; ax?: number; ay?: number; as?: number }> = ({ frame, izleyici = 12480, aslan = -1, ax = 540, ay = 760, as = 1 }) => {
  const t = frame / 30;
  return (
    <g>
      <rect x={60} y={300} width={150} height={56} rx={14} fill="#ff2a55" />
      <text x={135} y={340} textAnchor="middle" fontFamily="DiziSans, Arial" fontWeight={900} fontSize={30} fill="#fff">CANLI</text>
      <rect x={224} y={300} width={200} height={56} rx={14} fill="#00000088" />
      <circle cx={256} cy={328} r={12} fill="#fff" />
      <text x={280} y={340} fontFamily="DiziSans, Arial" fontWeight={900} fontSize={30} fill="#fff">{izleyici.toLocaleString("tr-TR")}</text>
      {new Array(6).fill(0).map((_, i) => {
        const k = (t * 0.6 + i / 6) % 1;
        const x = 960 + Math.sin(k * 9 + i) * 30;
        const y = 1260 - k * 520;
        return (
          <path key={i} d={`M ${x} ${y + 14} C ${x - 30} ${y - 6} ${x - 16} ${y - 30} ${x} ${y - 14} C ${x + 16} ${y - 30} ${x + 30} ${y - 6} ${x} ${y + 14} Z`} fill={["#ff4a7a", "#ff9ac8", "#ffd84a"][i % 3]} opacity={1 - k} />
        );
      })}
      {aslan >= 0 && aslan <= 1 ? (
        <g transform={`translate(${ax} ${ay - 40 * Math.sin(aslan * Math.PI)}) scale(${as * (0.6 + 0.6 * Math.sin(Math.min(1, aslan * 3) * Math.PI / 2))})`} opacity={aslan > 0.85 ? (1 - aslan) / 0.15 : 1}>
          {/* sevimli aslan hediyesi (uydurma çizim) */}
          {new Array(14).fill(0).map((_, i) => { const a = (i / 14) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 120} cy={Math.sin(a) * 120} r={52} fill={i % 2 ? "#e8902a" : "#f2a83a"} stroke={OUT} strokeWidth={5} />; })}
          <circle cx={0} cy={0} r={120} fill="#ffd26a" stroke={OUT} strokeWidth={6} />
          <circle cx={-42} cy={-20} r={14} fill={OUT} /><circle cx={42} cy={-20} r={14} fill={OUT} />
          <circle cx={-38} cy={-25} r={5} fill="#fff" /><circle cx={46} cy={-25} r={5} fill="#fff" />
          <path d="M -18 20 Q 0 36 18 20 Q 0 10 -18 20 Z" fill="#6a3a2a" />
          <path d="M 0 30 V 46 M 0 46 Q -20 60 -34 46 M 0 46 Q 20 60 34 46" stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />
          <ellipse cx={-70} cy={30} rx={20} ry={12} fill="#ff9a8a" opacity={0.7} /><ellipse cx={70} cy={30} rx={20} ry={12} fill="#ff9a8a" opacity={0.7} />
          <path d="M -60 -150 l 20 -40 l 20 40 l 20 -40 l 20 40 l 20 -40 l 20 40 Z" fill="#ffd84a" stroke={OUT} strokeWidth={5} strokeLinejoin="round" transform="translate(-10 40)" />
          <rect x={-160} y={150} width={320} height={64} rx={32} fill="#ff2a55" stroke={OUT} strokeWidth={5} />
          <text x={0} y={194} textAnchor="middle" fontFamily="DiziSans, Arial" fontWeight={900} fontSize={34} fill="#fff">ASLAN gönderdi!</text>
        </g>
      ) : null}
    </g>
  );
};
