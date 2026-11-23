import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { egri, serit, Hacim, rnd, type P, type PW, type Isik } from "./cizim";

/* =====================================================================================
 * Kırmızı Düğme · Göbekli Adam, yeni çizim katmanı ÖRNEĞİ (kompozisyon KDGobekOrnek)
 * Salon, gece, TV ışığı soldan (mavi kenar ışığı), gölgeler mor. Nefes, kaşınma, göz kırpma.
 * Koordinatlar 1080×1920 kare içinde; ayaklar ~y 1755.
 * ===================================================================================== */

const TEN = "#ecd3c6", TEN_G = "#c09ca8", TEN_C = "#8a3a2c";
const ATLET = "#efe8d4", ATLET_G = "#bcb2b6", ATLET_C = "#7a6440";
const ESOF = "#3c4256", ESOF_G = "#262a3e", ESOF_C = "#141828";
const SAC = "#2a221e";
const TERLIK = "#3a8ad8", TERLIK_G = "#24609e", TERLIK_C = "#123a6a";

const ISIK: Isik = { yon: [1, 0.35], golge: 22, kenar: 6, kenarRenk: "#a8d6ff", kenarOp: 0.85 };

/* ---------------- biçimler (noktalar) ---------------- */
const BAS: P[] = [[548, 452], [602, 458], [640, 488], [662, 540], [670, 600], [676, 655], [686, 702], [670, 748], [632, 774], [586, 788], [540, 792], [494, 784], [460, 764], [438, 728], [430, 688], [427, 640], [432, 584], [448, 524], [484, 474]];
const KULAK_SOL: P[] = [[436, 610], [420, 612], [408, 636], [411, 664], [426, 684], [442, 678]];
const KULAK_SAG: P[] = [[664, 616], [680, 618], [690, 640], [686, 666], [672, 680], [666, 660]];
const GOVDE: P[] = [[470, 772], [540, 778], [612, 772], [668, 782], [712, 800], [738, 836], [752, 890], [770, 950], [795, 1020], [812, 1090], [816, 1160], [802, 1215], [762, 1256], [700, 1277], [620, 1287], [540, 1290], [460, 1286], [385, 1274], [325, 1252], [285, 1212], [268, 1150], [272, 1080], [290, 1010], [315, 945], [335, 885], [348, 836], [372, 800], [418, 780]];
const ATLET_B: P[] = [[432, 776], [474, 776], [502, 826], [540, 852], [578, 826], [606, 774], [650, 778], [666, 834], [682, 890], [694, 936], [742, 980], [790, 1040], [804, 1100], [806, 1162], [762, 1188], [682, 1203], [600, 1210], [520, 1210], [440, 1204], [358, 1192], [284, 1166], [282, 1100], [298, 1040], [348, 980], [394, 936], [408, 890], [422, 834]];
const KALCA: P[] = [[332, 1300], [545, 1296], [758, 1300], [764, 1340], [756, 1384], [545, 1400], [334, 1384], [326, 1340]];
const BACAK_SOL: P[] = [[318, 1330], [430, 1336], [545, 1345], [538, 1440], [520, 1540], [506, 1630], [500, 1698], [432, 1702], [364, 1700], [352, 1630], [334, 1540], [316, 1440], [310, 1380]];
const BACAK_SAG: P[] = [[545, 1345], [660, 1336], [772, 1330], [780, 1380], [774, 1440], [756, 1540], [738, 1630], [726, 1698], [658, 1702], [590, 1700], [584, 1630], [570, 1540], [552, 1440]];
/* Kollar: omzun dış hattını deltoit kurar; kolun iç üst kenarı atletin kol oyuğunu birebir izler (dikiş yok),
   koltuk altında biter. İndeksler: kol oyuğuyla ortak kenar çizgisiz (atletin kendi çizgisi var). */
const UST_KOL_SOL: P[] = [[430, 778], [390, 786], [350, 806], [322, 842], [304, 892], [292, 950], [287, 1000], [287, 1046], [297, 1080], [330, 1091], [362, 1072], [382, 1032], [393, 986], [394, 936], [408, 890], [422, 834]];
const UST_KOL_SOL_ORTAK = [14, 15, 0];
const ON_KOL_SOL: P[] = [[294, 1026], [322, 1022], [346, 1046], [372, 1082], [402, 1090], [404, 1142], [370, 1137], [332, 1118], [302, 1094], [288, 1060]];
const KOL_SAG_B: P[] = [[652, 778], [692, 786], [732, 806], [760, 842], [780, 892], [794, 950], [803, 1000], [809, 1050], [810, 1110], [804, 1170], [796, 1212], [752, 1212], [748, 1170], [745, 1110], [737, 1068], [714, 1030], [699, 986], [694, 936], [682, 890], [666, 834]];
const KOL_SAG_ORTAK = [18, 19, 0];
/* kıl dağılımı için orta çizgiler */
const KIL_SOL: PW[] = [[372, 840, 50], [334, 910, 70], [316, 990, 66], [312, 1040, 50], [330, 1080, 40], [366, 1106, 38], [396, 1116, 34]];
const KIL_SAG: PW[] = [[716, 840, 50], [750, 910, 66], [768, 1000, 60], [776, 1100, 50], [772, 1190, 40]];

const KolKillari: React.FC<{ kol: PW[]; seed: number }> = ({ kol, seed }) => {
  const r = rnd(seed);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 26; i++) {
    const t = 0.25 + r() * 0.72;
    const k = Math.min(kol.length - 2, Math.floor(t * (kol.length - 1)));
    const u = t * (kol.length - 1) - k;
    const x = kol[k][0] + (kol[k + 1][0] - kol[k][0]) * u + (r() - 0.5) * kol[k][2] * 0.6;
    const y = kol[k][1] + (kol[k + 1][1] - kol[k][1]) * u + (r() - 0.5) * 20;
    const a = (r() - 0.3) * 1.2, L = 7 + r() * 6;
    out.push(<path key={i} d={serit([[x, y, 0], [x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5 - 3, 2.1], [x + Math.cos(a) * L, y + Math.sin(a) * L, 0]])} fill="#5a3a30" opacity={0.75} />);
  }
  return <>{out}</>;
};

const Kirli: React.FC = () => (
  <g>
    {/* lekeler */}
    <path d={egri([[602, 980], [632, 972], [648, 996], [630, 1020], [604, 1014], [594, 996]], true)} fill="#d8bc7c" opacity={0.55} />
    <path d={egri([[462, 1066], [488, 1060], [500, 1082], [482, 1098], [460, 1090]], true)} fill="#cdb070" opacity={0.5} />
    <path d={egri([[690, 1118], [708, 1114], [716, 1130], [700, 1140]], true)} fill="#c8a868" opacity={0.5} />
    {/* fitil dokusu */}
    {new Array(34).fill(0).map((_, i) => {
      const x = 286 + i * 15.5;
      const bk = (x - 545) * 0.1;
      return <path key={i} d={`M ${x} 800 Q ${x + bk} 1000 ${x + bk * 0.6} 1215`} stroke="#cfc4a8" strokeWidth={2} fill="none" opacity={0.45} />;
    })}
    {/* cips kırıntıları: göbek "rafının" üstünde */}
    {([[560, 968, 12], [600, 952, 8], [640, 978, 10], [512, 990, -15], [702, 1004, 20], [468, 1004, 5]] as const).map(([x, y, a], i) => (
      <rect key={i} x={x} y={y} width={i % 2 ? 8 : 11} height={i % 2 ? 6 : 8} rx={1.5} fill="#f0a030" stroke="#b86a10" strokeWidth={1.2} transform={`rotate(${a} ${x} ${y})`} />
    ))}
  </g>
);

const Goz: React.FC<{ x: number; y: number; ac: number; s?: number }> = ({ x, y, ac, s = 1 }) => {
  const h = 9 * ac;
  const beyaz: P[] = [[x - 24 * s, y + 2], [x - 10 * s, y - h], [x + 10 * s, y - h - 1], [x + 24 * s, y], [x + 10 * s, y + Math.max(3, h * 0.8)], [x - 10 * s, y + Math.max(3, h * 0.8)]];
  const id = `goz${x}`;
  return (
    <g>
      {/* göz altı morluğu */}
      <ellipse cx={x} cy={y + 16} rx={26 * s} ry={9} fill="#7a4a7a" opacity={0.28} />
      <path d={serit([[x - 20 * s, y + 12, 0], [x, y + 18, 2.8], [x + 20 * s, y + 12, 0]])} fill={TEN_C} opacity={0.7} />
      <path d={serit([[x - 16 * s, y + 22, 0], [x + 2, y + 27, 2], [x + 18 * s, y + 21, 0]])} fill={TEN_C} opacity={0.45} />
      {ac > 0.08 && (
        <>
          <defs><clipPath id={id}><path d={egri(beyaz, true)} /></clipPath></defs>
          <path d={egri(beyaz, true)} fill="#f4efe8" />
          <g clipPath={`url(#${id})`}>
            <circle cx={x + 3} cy={y + 1} r={10} fill="#5a4636" />
            <circle cx={x + 3} cy={y + 1} r={5} fill="#1a1210" />
            <circle cx={x - 1} cy={y - 3} r={2.6} fill="#fff" />
            <rect x={x - 30} y={y - 16} width={60} height={9} fill="#d8b8b0" opacity={0.5} />
          </g>
        </>
      )}
      {/* ağır üst kapak */}
      <path d={serit([[x - 28 * s, y + 3, 0], [x - 12 * s, y - h - 2, 6], [x + 10 * s, y - h - 3, 7], [x + 28 * s, y, 0]])} fill={TEN_C} />
      <path d={serit([[x - 22 * s, y - h - 10, 0], [x, y - h - 15, 2.4], [x + 22 * s, y - h - 9, 0]])} fill={TEN_C} opacity={0.55} />
    </g>
  );
};

export const GobekliCizim: React.FC<{ frame: number }> = ({ frame }) => {
  const nefes = Math.sin(frame / 20);
  const kas = Math.sin(frame * 0.95);
  const kirp = frame % 96;
  const ac = kirp < 5 ? Math.abs(kirp - 2.5) / 2.5 * 0.55 : 0.55; // gözler yarı kapalı, ara sıra kırpar
  const basY = -2.5 * nefes;
  const sakal = React.useMemo(() => {
    const r = rnd(41), out: P[] = [];
    while (out.length < 340) {
      const x = 440 + r() * 236, y = 660 + r() * 130;
      const inside = ((x - 556) / 122) ** 2 + ((y - 735) / 66) ** 2 < 1;
      const agiz = ((x - 560) / 30) ** 2 + ((y - 714) / 18) ** 2 < 1;
      const burun = ((x - 562) / 30) ** 2 + ((y - 662) / 26) ** 2 < 1;
      if (inside && !agiz && !burun) out.push([x, y]);
    }
    return out;
  }, []);

  return (
    <g>
      {/* yer gölgesi */}
      <ellipse cx={545} cy={1760} rx={250} ry={24} fill="#0a0814" opacity={0.45} />

      {/* bacaklar ve kalça */}
      <Hacim id="kalca" pts={KALCA} dolgu={ESOF} golge={ESOF_G} cizgi={ESOF_C} isik={ISIK} />
      <Hacim id="bsol" pts={BACAK_SOL} dolgu={ESOF} golge={ESOF_G} cizgi={ESOF_C} isik={ISIK} acik={[0, 1, 2]}>
        <path d={serit([[318, 1340, 10], [340, 1540, 11], [362, 1694, 9]])} fill="#c4c8ce" />
        <path d={serit([[480, 1500, 0], [456, 1512, 3.5], [430, 1506, 0]])} fill={ESOF_C} opacity={0.6} />
        <path d={serit([[488, 1600, 0], [462, 1614, 3], [436, 1606, 0]])} fill={ESOF_C} opacity={0.5} />
      </Hacim>
      <Hacim id="bsag" pts={BACAK_SAG} dolgu={ESOF} golge={ESOF_G} cizgi={ESOF_C} isik={ISIK} acik={[0, 1, 2]}>
        <path d={serit([[772, 1340, 10], [750, 1540, 11], [728, 1694, 9]])} fill="#c4c8ce" />
        <path d={serit([[606, 1506, 0], [632, 1518, 3.5], [660, 1510, 0]])} fill={ESOF_C} opacity={0.6} />
      </Hacim>
      {/* ayaklar + terlik (önden: taban, ayak, kayış, parmaklar) */}
      {[0, 230].map((dx, i) => (
        <g key={i} transform={`translate(${dx} 0)`}>
          <Hacim id={`taban${i}`} pts={[[346, 1726], [516, 1726], [530, 1748], [516, 1772], [348, 1774], [332, 1750]]} dolgu={TERLIK} golge={TERLIK_G} cizgi={TERLIK_C} isik={ISIK} ince={2.2} kalin={7} />
          <Hacim id={`ayak${i}`} pts={[[376, 1694], [490, 1694], [506, 1718], [508, 1748], [484, 1758], [380, 1760], [358, 1748], [360, 1718]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={ISIK} ince={2} kalin={5} />
          {[0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={378 + k * 26 + (k === 0 ? -2 : 0)} cy={1752 - (k === 0 ? 2 : 0)} rx={k === 0 ? 15 : 11 - k * 0.6} ry={k === 0 ? 11 : 9} fill={TEN} stroke={TEN_C} strokeWidth={2.2} />)}
          <Hacim id={`kayis${i}`} pts={[[362, 1704], [502, 1704], [512, 1734], [354, 1736]]} dolgu={TERLIK} golge={TERLIK_G} cizgi={TERLIK_C} isik={ISIK} ince={2.2} kalin={6} />
          <path d={serit([[372, 1712, 0], [430, 1709, 3], [490, 1712, 0]])} fill="#8cc4ff" opacity={0.7} />
        </g>
      ))}

      <g transform="translate(0 45)">
      {/* gövde (nefesle) */}
      <g transform={`translate(545 1290) scale(${1 + 0.006 * nefes} ${1 + 0.009 * nefes}) translate(-545 -1290)`}>
        <Hacim id="govde" pts={GOVDE} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={ISIK} golgeCarp={1.4}>
          {/* açık kalan alt göbek: göbek deliği ve kıl çizgisi */}
          <path d={serit([[556, 1236, 0], [566, 1243, 5], [577, 1236, 0]])} fill={TEN_C} />
          {[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={serit([[560 + (k % 2) * 8, 1252 + k * 6, 0], [566 + (k % 2) * 8, 1255 + k * 6, 2], [562 + (k % 2) * 8, 1259 + k * 6, 0]])} fill="#5a3a30" opacity={0.7} />)}
          {/* göbek altı kıvrımı */}
          <path d={serit([[380, 1262, 0], [540, 1282, 5], [700, 1266, 0]])} fill={TEN_C} opacity={0.5} />
        </Hacim>
        {/* göğüs kılı yaka çukurunda */}
        {[[522, 840], [532, 848], [548, 846], [556, 838], [540, 834]].map(([x, y], k) => <path key={k} d={serit([[x, y, 0], [x + 3, y - 5, 2.2], [x + 8, y - 3, 0]])} fill="#4a3028" />)}
        <Hacim id="atlet" pts={ATLET_B} dolgu={ATLET} golge={ATLET_G} cizgi={ATLET_C} isik={{ ...ISIK, kenarOp: 0.4 }} ince={2.4} kalin={7} golgeCarp={1.5}>
          <Kirli />
          {/* atletin göbek üstünde gerilme kıvrımları */}
          <path d={serit([[360, 1120, 0], [420, 1140, 3], [470, 1142, 0]])} fill={ATLET_C} opacity={0.4} />
          <path d={serit([[640, 1150, 0], [700, 1140, 3], [752, 1110, 0]])} fill={ATLET_C} opacity={0.4} />
        </Hacim>
        {/* çene altı gölgesi atlete düşer */}
        <ellipse cx={550} cy={800} rx={96} ry={22} fill="#3a2a40" opacity={0.28} />

        {/* SAĞ KOL (telefonu tutar): deltoit omuz + sarkan kol, tek parça */}
        <Hacim id="kolsag" pts={KOL_SAG_B} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={ISIK} acik={KOL_SAG_ORTAK} golgeCarp={0.6}>
          <KolKillari kol={KIL_SAG} seed={7} />
          {/* deltoit kası alt sınırı, omuz kılları */}
          <path d={serit([[754, 858, 0], [772, 904, 3], [778, 948, 0]])} fill={TEN_C} opacity={0.45} />
          {[[680, 790], [700, 796], [716, 806], [690, 802]].map(([x, y], k) => <path key={k} d={serit([[x, y, 0], [x + 4, y - 4, 2], [x + 9, y - 2, 0]])} fill="#5a3a30" opacity={0.7} />)}
          <path d={serit([[704, 990, 0], [716, 1018, 3], [732, 1044, 0]])} fill={TEN_C} opacity={0.35} />
          {/* iç dirsek kıvrımı */}
          <path d={serit([[742, 1066, 0], [754, 1074, 2.6], [768, 1072, 0]])} fill={TEN_C} opacity={0.55} />
        </Hacim>
        {/* koltuk altı kıvrımı: kol gövdeye burada girer */}
        <path d={serit([[694, 938, 0], [697, 962, 2.4], [701, 984, 0]])} fill={TEN_C} opacity={0.45} />
        {/* telefon + el */}
        <g transform="rotate(-8 800 1262)">
          <defs><radialGradient id="telIsik"><stop offset="0" stopColor="#cfeaff" stopOpacity={0.45} /><stop offset="1" stopColor="#cfeaff" stopOpacity={0} /></radialGradient></defs><ellipse cx={802} cy={1262} rx={120} ry={110} fill="url(#telIsik)" />
          <rect x={766} y={1200} width={72} height={124} rx={12} fill="#16181c" stroke="#08090c" strokeWidth={3} />
          <rect x={771} y={1208} width={62} height={108} rx={8} fill="#cfeaff" opacity={0.92 + 0.08 * Math.sin(frame * 0.7)} />
        </g>
        <Hacim id="elsag" pts={[[756, 1202], [800, 1198], [816, 1214], [818, 1250], [806, 1286], [784, 1292], [762, 1272], [752, 1232]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={ISIK} ince={2} kalin={6} />
        <path d={serit([[766, 1228, 14], [790, 1226, 14], [806, 1232, 12], [816, 1242, 0]])} fill={TEN} stroke={TEN_C} strokeWidth={2.4} />

        {/* SOL KOL: üst kol (deltoitle) + önkol göbeğin önünde; dirsekte birleşir */}
        <Hacim id="ustsol" pts={UST_KOL_SOL} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={ISIK} acik={UST_KOL_SOL_ORTAK} golgeCarp={0.6}>
          <KolKillari kol={KIL_SOL.slice(0, 4)} seed={3} />
          <path d={serit([[336, 858, 0], [318, 904, 3], [312, 948, 0]])} fill={TEN_C} opacity={0.45} />
          <path d={serit([[388, 990, 0], [376, 1020, 3], [360, 1046, 0]])} fill={TEN_C} opacity={0.35} />
          {[[380, 812], [396, 805], [366, 822], [404, 796]].map(([x, y], k) => <path key={k} d={serit([[x, y, 0], [x + 4, y - 4, 2], [x + 9, y - 2, 0]])} fill="#5a3a30" opacity={0.7} />)}
        </Hacim>
        <path d={serit([[394, 938, 0], [392, 962, 2.4], [389, 984, 0]])} fill={TEN_C} opacity={0.45} />
        <Hacim id="onsol" pts={ON_KOL_SOL} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={ISIK} acik={[0]} golgeCarp={0.8}>
          <KolKillari kol={KIL_SOL.slice(3)} seed={5} />
          {/* iç dirsek kıvrımı */}
          <path d={serit([[322, 1030, 0], [334, 1042, 2.6], [338, 1056, 0]])} fill={TEN_C} opacity={0.6} />
        </Hacim>
        <g transform={`translate(${kas * 5} ${kas * 2.5})`}>
          <Hacim id="elsol" pts={[[388, 1092], [420, 1086], [446, 1096], [456, 1120], [446, 1142], [416, 1148], [392, 1138], [382, 1114]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={ISIK} ince={2} kalin={6} />
          {[0, 1, 2, 3].map((k) => {
            const y = 1098 + k * 13, kv = Math.sin(frame * 0.95 + k * 0.6) * 3;
            return (
              <g key={k}>
                <path d={serit([[440, y, 15], [462, y + 2 + kv * 0.3, 14], [478 + kv, y + 8, 12], [482 + kv, y + 14, 0]])} fill={TEN} stroke={TEN_C} strokeWidth={2.4} strokeLinejoin="round" />
                <ellipse cx={478 + kv} cy={y + 10} rx={4} ry={3} fill="#f6e2da" />
              </g>
            );
          })}
        </g>
      </g>

      {/* KAFA */}
      <g transform={`translate(0 ${basY}) rotate(${-1.5 + Math.sin(frame / 37) * 1} 548 780)`}>
        <Hacim id="ksol" pts={KULAK_SOL} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={ISIK} ince={2.2} kalin={6} />
        <Hacim id="ksag" pts={KULAK_SAG} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={ISIK} ince={2.2} kalin={6} />
        <Hacim id="bas" pts={BAS} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={ISIK} ince={2.8} kalin={9}>
          {/* yanak kızarıklığı, şakak çökükleri */}
          <ellipse cx={488} cy={676} rx={30} ry={18} fill="#e8846e" opacity={0.22} />
          <ellipse cx={630} cy={672} rx={28} ry={17} fill="#e8846e" opacity={0.22} />
          {/* noktalı sakal (bir haftalık) */}
          {sakal.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.5 + (i % 3) * 0.4} fill="#3a2a26" opacity={0.5} />)}
          {/* kel tepe parlaması (TV) */}
          <ellipse cx={560} cy={484} rx={34} ry={10} fill="#d8ecff" opacity={0.4} />
        </Hacim>
        {/* gıdı: iki kat */}
        <path d={serit([[474, 752, 0], [540, 772, 4.5], [626, 752, 0]])} fill={TEN_C} opacity={0.75} />
        <path d={serit([[500, 782, 0], [545, 791, 3], [598, 782, 0]])} fill={TEN_C} opacity={0.4} />
        {/* kaşlar: tembel, ortası hafif kalkık */}
        <path d={serit([[474, 584, 3], [500, 574, 9], [530, 579, 3]])} fill={SAC} />
        <path d={serit([[580, 578, 3], [608, 570, 9], [636, 577, 3]])} fill={SAC} />
        <Goz x={505} y={614} ac={ac} />
        <Goz x={607} y={612} ac={ac} />
        {/* burun: patates */}
        <path d={serit([[556, 612, 0], [552, 636, 2.6], [546, 652, 0]])} fill={TEN_C} opacity={0.6} />
        <Hacim id="burun" pts={[[544, 650], [562, 638], [582, 650], [588, 668], [574, 682], [552, 682], [538, 670]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={ISIK} ince={2} kalin={6}>
          <ellipse cx={556} cy={652} rx={8} ry={4} fill="#fff" opacity={0.35} />
        </Hacim>
        <ellipse cx={555} cy={677} rx={5} ry={3} fill="#5a2a22" />
        <ellipse cx={574} cy={677} rx={5} ry={3} fill="#5a2a22" />
        {/* nazolabial kıvrımlar */}
        <path d={serit([[532, 670, 0], [526, 688, 3], [530, 704, 0]])} fill={TEN_C} opacity={0.55} />
        <path d={serit([[592, 668, 0], [600, 686, 3], [598, 702, 0]])} fill={TEN_C} opacity={0.55} />
        {/* ağız: açık, gevşek */}
        <ellipse cx={562} cy={716} rx={15} ry={10 + nefes * 1.5} fill="#4a1a1e" />
        <ellipse cx={564} cy={722 + nefes} rx={10} ry={4} fill="#d86a78" />
        <path d={serit([[540, 709, 0], [562, 704, 4], [586, 710, 0]])} fill={TEN_C} />
        <path d={serit([[548, 729, 0], [564, 733, 3], [580, 728, 0]])} fill={TEN_C} opacity={0.6} />
        {/* SAÇ: yan tutamlar + yağlı, yatık birkaç tel (boynuz değil) */}
        {([[452, 530, -1], [446, 548, -1], [442, 566, -1], [440, 584, -1], [646, 520, 1], [654, 540, 1], [660, 560, 1], [664, 580, 1]] as const).map(([x, y, yon], k) => (
          <path key={`yt${k}`} d={serit([[x, y, 1], [x + yon * 8, y + 22, 7 - (k % 4)], [x + yon * 4, y + 44, 4], [x + yon * 14, y + 56 + (k % 3) * 4, 0]])} fill={k % 2 ? "#3a302a" : SAC} />
        ))}
        <path d={serit([[452, 542, 2], [500, 480, 7], [570, 462, 6], [632, 482, 1]])} fill={SAC} />
        <path d={serit([[456, 562, 2], [510, 494, 6], [586, 474, 5], [646, 502, 1]])} fill={SAC} />
        <path d={serit([[460, 582, 1], [522, 510, 5], [602, 490, 4], [654, 522, 0]])} fill={SAC} />
        <path d={serit([[560, 464, 3], [567, 440, 2], [586, 430, 0]])} fill={SAC} />
        {/* yağ parlaması */}
        <path d={serit([[492, 488, 0], [530, 474, 2.4], [566, 470, 0]])} fill="#cfe4ff" opacity={0.7} />
        <path d={serit([[520, 500, 0], [560, 486, 2], [596, 484, 0]])} fill="#cfe4ff" opacity={0.5} />
      </g>
      </g>
    </g>
  );
};

/* ---------------- Salon arka planı (TV ışığı soldan) ---------------- */
const Salon: React.FC<{ frame: number }> = ({ frame }) => {
  const tv = 0.55 + 0.12 * Math.sin(frame * 0.53) + 0.06 * Math.sin(frame * 1.7);
  return (
    <g>
      <defs>
        <linearGradient id="duvar" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stopColor="#36406e" /><stop offset="0.5" stopColor="#262444" /><stop offset="1" stopColor="#17142a" /></linearGradient>
        <radialGradient id="tvIsik" cx="0" cy="0.5" r="0.9"><stop offset="0" stopColor="#7aa8ff" stopOpacity={0.7} /><stop offset="1" stopColor="#7aa8ff" stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#duvar)" />
      {/* pencere: mor şehir */}
      <rect x={760} y={360} width={250} height={420} rx={6} fill="#1a1530" stroke="#0e0c1a" strokeWidth={6} />
      {[[790, 520, 40, 260], [850, 470, 50, 310], [920, 560, 60, 220]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#2a2248" />)}
      {[[800, 560], [866, 520], [880, 600], [936, 620], [950, 680], [812, 640]].map(([x, y], i) => <rect key={i} x={x} y={y} width={9} height={12} fill="#f4c46a" opacity={0.8} />)}
      <path d="M 760 360 Q 820 560 780 790 L 760 790 Z" fill="#5a2a4a" opacity={0.9} />
      <path d="M 1010 360 Q 960 560 990 790 L 1010 790 Z" fill="#5a2a4a" opacity={0.9} />
      {/* düğün fotoğrafı + nazarlık */}
      <rect x={160} y={360} width={150} height={190} rx={6} fill="#8a6a4a" stroke="#3a2a1a" strokeWidth={6} />
      <rect x={176} y={376} width={118} height={158} fill="#b8a890" />
      <circle cx={214} cy={430} r={18} fill="#6a5a4a" /><circle cx={258} cy={426} r={18} fill="#e8e0d0" />
      <circle cx={470} cy={330} r={22} fill="#1a5ab8" stroke="#0a2a6a" strokeWidth={3} /><circle cx={470} cy={330} r={14} fill="#fff" /><circle cx={470} cy={330} r={8} fill="#5ab0ff" /><circle cx={470} cy={330} r={4} fill="#111" />
      {/* kanepe sırtı (bordo) + dantel örtü */}
      <path d="M 40 1180 Q 60 1120 140 1120 L 940 1120 Q 1020 1120 1040 1180 L 1040 1560 L 40 1560 Z" fill="#5e1a28" stroke="#2a0a12" strokeWidth={6} />
      <path d="M 80 1180 L 1000 1180" stroke="#7a2a3a" strokeWidth={10} />
      <path d={`M 380 1122 ${new Array(12).fill(0).map((_, i) => `q 12 18 24 0`).join(" ")} L 668 1122 Z`} fill="#efe6d6" opacity={0.85} />
      {/* zemin + halı */}
      <rect x={0} y={1560} width={1080} height={360} fill="#1e1626" />
      <ellipse cx={545} cy={1780} rx={520} ry={110} fill="#3a1e2e" />
      <ellipse cx={545} cy={1780} rx={460} ry={88} fill="none" stroke="#6a3a4a" strokeWidth={6} strokeDasharray="14 10" />
      {/* TV ışığı */}
      <rect width={1080} height={1920} fill="url(#tvIsik)" opacity={tv} />
    </g>
  );
};

const Gren: React.FC = () => (
  <AbsoluteFill style={{ background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.3 0 0 0 0 0.25 0 0 0 0.55 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")", mixBlendMode: "overlay", opacity: 0.35 }} />
);

export const KdGobekOrnek: React.FC = () => {
  const frame = useCurrentFrame();
  const kaynat = 1 + (Math.floor(frame / 3) % 4);
  return (
    <AbsoluteFill style={{ background: "#17142a" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <defs>
          <filter id="elCizim" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={kaynat} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={2.2} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <Salon frame={frame} />
        <g filter="url(#elCizim)" transform="translate(-20 40)">
          <GobekliCizim frame={frame} />
        </g>
      </svg>
      <Gren />
    </AbsoluteFill>
  );
};
