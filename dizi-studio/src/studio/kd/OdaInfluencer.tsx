import React from "react";
import { egri, serit, Hacim, uzuv, Agiz, ODA_ISIK, type P, type PW } from "./kukla";

/* =====================================================================================
 * Influencer · beyaz oda · YERDE SIRTÜSTÜ, TEPEDEN (yeni çizim dili)
 * Perde kakül, uçları pembe uzun saç (yere yelpaze gibi yayılmış), iki kalp toka, altın halka küpe,
 * lila far + eyeliner, dağılmış rimel (gözyaşı değil, makyaj), ruj köşeden taşmış; lila oversize sweatshirt
 * ("gülen slime" baskısı), bol paça jean, beyaz spor ayakkabı; telefonsuz, elleri karnında kenetli, pembe tırnak.
 * Yerel koordinat: kalça (0, 0), baş yukarıda (-y = kuzey). 1 m = 780 birim.
 * ===================================================================================== */

const TEN = "#f7d6c0", TEN_G = "#dcb8b4", TEN_C = "#9a4a3a";
const SAC = "#3a2218", SAC_G = "#24140e", SAC_C = "#140a06", SAC_UC = "#f49ac1";
const SW = "#cbb8f4", SW_G = "#a892d6", SW_C = "#4e3a86";
const JEAN = "#9cbbe0", JEAN_G = "#7d9cc8", JEAN_C = "#34507a";
const AYK = "#f8f8f6", AYK_G = "#d0d6de", AYK_C = "#5a6470";
const RUJ = "#d8708a", FAR = "#c9a0d8", TOKA = "#ff4a8a", TIRNAK = "#ff6ab0", ALTIN = "#e8b830";
const IS = ODA_ISIK;

export type InfPoz = {
  /** göz açıklığı 0 kapalı, 1 açık, 1.3 fal taşı */
  goz: number;
  /** sıkma 0..1 (kapalı gözler kırışır) */
  sik: number;
  /** kaş: -1 çatık .. 1 havada; kasIc: iç uçlar yukarı (korku) */
  kas: number;
  kasIc: number;
  agiz: { ac: number; yuv: number };
  /** dudak gerginliği: -1 somurtma/yüz buruşturma .. 1 */
  gul: number;
  /** baş dönüşü (derece) ve kalkış (0..1) */
  basDon: number;
  basKalk: number;
  /** bakış yönü (-1..1) */
  bak: P;
  /** eller: 0 karında kenetli, 1 yüzüne (korku) */
  eller: number;
};

export const INF_UYKU: InfPoz = { goz: 0, sik: 0, kas: 0, kasIc: 0, agiz: { ac: 0, yuv: 0 }, gul: 0, basDon: 0, basKalk: 0, bak: [0, 0], eller: 0 };

/* yere yayılmış saç kütlesi: dalgalı dış kenar (açı, yarıçap) */
const SAC_YAY: P[] = new Array(30).fill(0).map((_, i) => {
  const a = ((-205 + i * (230 / 29)) * Math.PI) / 180;
  const r = 250 + Math.sin(i * 1.9) * 22 + Math.sin(i * 0.7) * 16 + (i % 2) * 10;
  return [Math.cos(a) * r * 1.02, -590 + Math.sin(a) * r * 1.05] as P;
}).concat([[150, -400], [0, -430], [-150, -400]] as P[]);
/* tel çizgileri: [açı, boy, dalga] */
const TEL: [number, number, number][] = new Array(26).fill(0).map((_, i) => [-200 + i * 8.6, 110 + ((i * 37) % 50), i * 0.9]);
const YUZ: P[] = [[0, -752], [62, -742], [100, -704], [111, -646], [106, -592], [92, -544], [64, -500], [30, -474], [0, -466], [-30, -474], [-64, -500], [-92, -544], [-106, -592], [-111, -646], [-100, -704], [-62, -742]];
const KAKUL: P[] = [[4, -752], [-40, -740], [-88, -706], [-118, -648], [-124, -584], [-112, -540], [-102, -590], [-88, -642], [-60, -690], [-20, -718]];
const SWEAT: P[] = [[-62, -452], [-30, -432], [0, -428], [30, -432], [62, -452], [140, -440], [184, -404], [194, -300], [190, -160], [186, -40], [166, 24], [0, 34], [-166, 24], [-186, -40], [-190, -160], [-194, -300], [-184, -404], [-140, -440]];
const KALCA: P[] = [[-184, 10], [184, 10], [190, 120], [0, 150], [-190, 120]];

const Goz: React.FC<{ s: 1 | -1; p: InfPoz; lw: number }> = ({ s, p, lw }) => {
  /* gerçekçi oranlı göz (stil 1 ailesi: göbekli/teyze/kuryeyle aynı ölçek); makyaj üstüne */
  const x = 44 * s, y = -604;
  const g = p.goz, w = 23;
  const id = `infg${s}`;
  const T = (pts: P[]): P[] => pts.map(([a, b]) => [x + a * s, y + b]);
  const TW = (pts: PW[]): PW[] => pts.map(([a, b, c]) => [x + a * s, y + b, c]);
  const sek = T([[-w, 1], [-w * 0.45, -9.5 * g], [w * 0.45, -9 * g], [w + 3, -2], [w * 0.35, 6 * g], [-w * 0.45, 5.5 * g]]);
  const ix = x + p.bak[0] * 6, iy = y - 1 + p.bak[1] * 3;
  const genis = g > 1.1;
  return (
    <g>
      {/* lila far: kapak ve kaş altı */}
      <path d={egri(T([[-w - 3, -3], [-w * 0.3, -15 - g * 4], [w * 0.6, -14 - g * 4], [w + 8, -6], [w * 0.4, -7 - g * 3], [-w * 0.4, -7 - g * 3]]), true)} fill={FAR} opacity={0.5} />
      {/* dağılmış rimel: göz altında soluk mor bulaşma (makyaj, gözyaşı değil) */}
      <path d={serit(TW([[-w * 0.7, 10, 0], [-w * 0.1, 14, 5], [w * 0.7, 10, 0]]))} fill="#6a5a7a" opacity={0.2} />
      <path d={serit(TW([[w * 0.5, 12, 0], [w * 0.6, 22, 3], [w * 0.55, 30, 0]]))} fill="#6a5a7a" opacity={0.15} />
      {g > 0.08 ? (
        <g>
          <defs><clipPath id={id}><path d={egri(sek, true)} /></clipPath></defs>
          <path d={egri(sek, true)} fill="#f8f3f0" />
          <g clipPath={`url(#${id})`}>
            <circle cx={ix} cy={iy} r={genis ? 7.5 : 9} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.6} />
            <circle cx={ix} cy={iy + 2} r={genis ? 4.5 : 5.5} fill="#9a7450" opacity={0.5} />
            <circle cx={ix} cy={iy} r={genis ? 2.6 : 4} fill="#1a100a" />
            <circle cx={ix - 2.6} cy={iy - 3} r={2.2} fill="#fff" />
            <rect x={x - w - 4} y={y - 12 * g} width={2 * w + 8} height={4} fill="#d8b0a8" opacity={0.45} />
          </g>
          {/* üst kapak çizgisi + eyeliner kanadı, kapak kıvrımı, alt kapak */}
          <path d={serit(TW([[-w - 1, 2, 1.4 * lw], [-w * 0.45, -9.5 * g - 1, 3.8 * lw], [w * 0.45, -9 * g - 1, 4.2 * lw], [w + 4, -3, 3 * lw], [w + 13, -10, 0]]))} fill="#1a1018" />
          {[0, 1, 2].map((k) => <path key={k} d={serit(TW([[w * 0.15 + k * 7, -9 * g, 1.6 * lw], [w * 0.25 + k * 8, -9 * g - 6, 0]]))} fill="#1a1018" />)}
          <path d={serit(TW([[-w * 0.6, -13 * g - 3, 0], [0, -15 * g - 3, 2 * lw], [w * 0.7, -12 * g - 2, 0]]))} fill={TEN_C} opacity={0.45} />
          <path d={serit(TW([[-w * 0.6, 6 * g + 1, 0], [0, 7 * g + 1.5, 1.6 * lw], [w * 0.6, 5 * g, 0]]))} fill={TEN_C} opacity={0.5} />
        </g>
      ) : (
        <g>
          {/* kapalı göz: aşağı kavis, kirpikler; sıkınca kırışır ve kısalır */}
          <path d={serit(TW([[-w, -1 - p.sik * 3, 0], [-w * 0.3, 4 - p.sik * 3, 3.8 * lw + p.sik * 1.6], [w * 0.4, 3.5 - p.sik * 3, 3.8 * lw + p.sik * 1.6], [w + 4, -3 - p.sik * 3, 0]]))} fill="#1a1018" />
          {[0, 1, 2, 3].map((k) => <path key={k} d={serit(TW([[-w * 0.4 + k * 9, 4 - p.sik * 3, 1.5 * lw], [-w * 0.45 + k * 10, 10 - p.sik * 2, 0]]))} fill="#1a1018" />)}
          {p.sik > 0.05 ? (
            <g opacity={p.sik}>
              <path d={serit(TW([[w + 6, -8, 0], [w + 14, -5, 2 * lw], [w + 21, -1, 0]]))} fill={TEN_C} />
              <path d={serit(TW([[w + 6, 3, 0], [w + 14, 6, 2 * lw], [w + 19, 11, 0]]))} fill={TEN_C} />
              <path d={serit(TW([[-w * 0.6, -13, 0], [0, -16, 2.2 * lw], [w * 0.6, -13, 0]]))} fill={TEN_C} opacity={0.6} />
              <path d={serit(TW([[-w * 0.5, 12, 0], [0, 14, 1.8 * lw], [w * 0.5, 11, 0]]))} fill={TEN_C} opacity={0.5} />
            </g>
          ) : null}
        </g>
      )}
      {/* kaş: ince, şekilli */}
      <g transform={`translate(${x} ${y - 36 - Math.max(0, p.kas) * 8 - g * 3 + p.sik * 3})`}>
        <path d={serit([[-20 * s, 5 - Math.min(0, p.kas) * 14 - p.kasIc * 11 + p.sik * 5, 2 * lw], [-3 * s, -2 - Math.min(0, p.kas) * 5, 5 * lw], [16 * s, -2 + Math.min(0, p.kas) * 2, 3.6 * lw], [28 * s, 5 - Math.max(0, p.kas) * 2, 0]])} fill="#4a2a1c" />
        {p.kas < -0.2 ? <path d={serit([[-27 * s, 6, 0], [-30 * s, 17, 2 * lw], [-28 * s, 27, 0]])} fill={TEN_C} opacity={-p.kas * 0.6} /> : null}
      </g>
    </g>
  );
};

export const OdaInfluencer: React.FC<{ p: InfPoz; lw: number; detay?: boolean }> = ({ p, lw, detay = true }) => {
  const e = p.eller;
  // kollar: omuz → dirsek → bilek (eller karında kenetli; korkuda göğse/yüze kalkar)
  const kol = (s: 1 | -1): PW[] => {
    const wx = 30 + (1 - e) * 26, wy = -130 - e * 300;
    return [[-170 * s, -404, 98], [-186 * s, -300 + e * 20, 94], [-186 * s, -200 + e * 40, 86], [(-126 + e * 40) * s, (-160 - e * 120), 76], [-wx * s, wy, 66]];
  };
  const kolSol = kol(1), kolSag = kol(-1);
  const elY = -122 - e * 300;
  return (
    <g transform={`translate(0 ${-p.basKalk * 0})`}>
      {/* saç: yere yelpaze gibi yayılmış, dalgalı kenar; içten dışa kahve → pembe uç (ombre) */}
      <defs>
        <radialGradient id="inf-ombre" gradientUnits="userSpaceOnUse" cx={0} cy={-590} r={300}>
          <stop offset="0.62" stopColor={SAC} />
          <stop offset="0.8" stopColor="#7a3a4a" />
          <stop offset="0.93" stopColor={SAC_UC} />
        </radialGradient>
      </defs>
      <g transform={`rotate(${p.basDon * 0.6} 0 -560)`}>
        <path d={egri(SAC_YAY, true)} fill="url(#inf-ombre)" stroke={SAC_C} strokeWidth={4 * lw} strokeLinejoin="round" />
        {detay ? TEL.map(([a0, L, dal], i) => {
          const pts: PW[] = [0, 0.33, 0.66, 1].map((t) => {
            const r = ((a0 + Math.sin(t * 3 + dal) * 5) * Math.PI) / 180, R = 120 + t * L;
            return [Math.cos(r) * R, -590 + Math.sin(r) * R, t === 0 || t === 1 ? 0 : 3.2 * lw];
          });
          return <path key={i} d={serit(pts)} fill={i % 3 === 0 ? "#8a5a48" : "#160a06"} opacity={i % 3 === 0 ? 0.55 : 0.45} />;
        }) : null}
      </g>
      {/* ayakkabılar (burunlar tavana) */}
      {[-1, 1].map((s) => (
        <Hacim key={s} id={`inf-ayk${s}`} pts={[[s * 70, 640], [s * 120, 610], [s * 168, 640], [s * 176, 700], [s * 150, 744], [s * 106, 748], [s * 74, 710]]} dolgu={AYK} golge={AYK_G} cizgi={AYK_C} isik={IS} ince={2.2 * lw} kalin={6 * lw}>
          <path d={serit([[s * 96, 660, 0], [s * 122, 668, 4], [s * 148, 662, 0]])} fill={AYK_C} opacity={0.5} />
          <path d={serit([[s * 96, 682, 0], [s * 122, 690, 4], [s * 148, 684, 0]])} fill={AYK_C} opacity={0.5} />
        </Hacim>
      ))}
      {/* jean: kalça + bol paçalı bacaklar */}
      {[-1, 1].map((s) => (
        <Hacim key={s} id={`inf-bacak${s}`} pts={uzuv([[s * 92, 70, 176], [s * 104, 300, 150], [s * 114, 470, 140], [s * 122, 620, 166]])} dolgu={JEAN} golge={JEAN_G} cizgi={JEAN_C} isik={IS} ince={2.4 * lw} kalin={7 * lw}>
          <path d={serit([[s * 60, 120, 0], [s * 70, 360, 3], [s * 80, 600, 0]])} fill={JEAN_C} opacity={0.35} />
          <path d={serit([[s * 70, 360, 0], [s * 104, 376, 3], [s * 140, 368, 0]])} fill={JEAN_C} opacity={0.35} />
        </Hacim>
      ))}
      <Hacim id="inf-kalca" pts={KALCA} dolgu={JEAN} golge={JEAN_G} cizgi={JEAN_C} isik={IS} ince={2.4 * lw} kalin={7 * lw}>
        <path d={serit([[0, 20, 0], [0, 80, 4], [-6, 140, 0]])} fill={JEAN_C} opacity={0.5} />
      </Hacim>
      {/* sweatshirt */}
      <Hacim id="inf-sw" pts={SWEAT} dolgu={SW} golge={SW_G} cizgi={SW_C} isik={IS} ince={2.4 * lw} kalin={7.5 * lw}>
        {/* gülen slime baskısı */}
        <g transform="translate(0 -300)">
          <path d={egri([[-60, 20], [-56, -30], [-20, -58], [24, -56], [58, -26], [62, 20], [44, 30], [40, 52], [22, 34], [0, 40], [-20, 34], [-30, 58], [-40, 30]], true)} fill="#ff9ac8" stroke="#c84a8a" strokeWidth={3 * lw} />
          <circle cx={-18} cy={-14} r={6} fill="#4a1a3a" /><circle cx={18} cy={-14} r={6} fill="#4a1a3a" />
          <path d={serit([[-20, 6, 0], [0, 16, 4], [20, 6, 0]])} fill="#4a1a3a" />
          <ellipse cx={-30} cy={-34} rx={10} ry={5} fill="#fff" opacity={0.7} />
        </g>
        <path d={serit([[-150, -60, 0], [-100, -40, 4], [-60, -50, 0]])} fill={SW_C} opacity={0.35} />
        <path d={serit([[150, -80, 0], [110, -54, 4], [70, -60, 0]])} fill={SW_C} opacity={0.35} />
        <path d={serit([[-184, 0, 6], [0, 12, 8], [184, 0, 6]])} fill={SW_G} opacity={0.8} />
      </Hacim>
      {/* boyun + yaka ribanası */}
      <Hacim id="inf-boyun" pts={[[-42, -506], [42, -506], [48, -440], [0, -428], [-48, -440]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5 * lw} />
      <path d={serit([[-66, -452, 8], [-30, -428, 12], [0, -422, 12], [30, -428, 12], [66, -452, 8]])} fill={SW_G} stroke={SW_C} strokeWidth={2 * lw} />
      {/* kollar */}
      {[kolSol, kolSag].map((k, i) => (
        <Hacim key={i} id={`inf-kol${i}`} pts={uzuv(k)} dolgu={SW} golge={SW_G} cizgi={SW_C} isik={IS} ince={2.4 * lw} kalin={7 * lw}>
          <path d={serit([[k[2][0] - 20, k[2][1] - 30, 0], [k[2][0], k[2][1], 4], [k[2][0] + 10, k[2][1] + 26, 0]])} fill={SW_C} opacity={0.4} />
        </Hacim>
      ))}
      {/* kenetli eller, pembe tırnaklar */}
      <g transform={`translate(0 ${elY})`}>
        <Hacim id="inf-el" pts={[[-58, -6], [-30, -30], [0, -34], [30, -30], [58, -6], [44, 26], [0, 34], [-44, 26]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5.5 * lw}>
          {[-24, -8, 8, 24].map((x) => <path key={x} d={serit([[x, -28, 0], [x + 2, 0, 2.4], [x, 24, 0]])} fill={TEN_C} opacity={0.5} />)}
        </Hacim>
        {[-24, -8, 8, 24].map((x) => <ellipse key={x} cx={x + 1} cy={-22} rx={5.5} ry={7} fill={TIRNAK} stroke={TEN_C} strokeWidth={1.4 * lw} />)}
        {/* bilek: pembe saç lastiği */}
        <ellipse cx={-56} cy={-2} rx={9} ry={20} fill="#ff9cc8" stroke="#c84a8a" strokeWidth={2 * lw} />
      </g>

      {/* BAŞ */}
      <g transform={`rotate(${p.basDon} 0 -560) translate(0 -470) scale(${1 + p.basKalk * 0.05}) translate(0 470)`}>
        {/* altın halka küpeler (yerde, kulakların yanında) */}
        <circle cx={-122} cy={-552} r={18} fill="none" stroke={ALTIN} strokeWidth={5 * lw} />
        <circle cx={122} cy={-552} r={18} fill="none" stroke={ALTIN} strokeWidth={5 * lw} />
        <Hacim id="inf-yuz" pts={YUZ} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2.4 * lw} kalin={7 * lw} golgeCarp={0.7}>
          <ellipse cx={-70} cy={-556} rx={26} ry={14} fill="#ff9aa8" opacity={0.32} />
          <ellipse cx={70} cy={-556} rx={26} ry={14} fill="#ff9aa8" opacity={0.32} />
          <ellipse cx={-62} cy={-574} rx={10} ry={4} fill="#fff" opacity={0.5} />
          <ellipse cx={62} cy={-574} rx={10} ry={4} fill="#fff" opacity={0.5} />
        </Hacim>
        <Goz s={1} p={p} lw={lw} />
        <Goz s={-1} p={p} lw={lw} />
        {/* burun */}
        <path d={serit([[6, -598, 0], [10, -572, 3 * lw], [4, -556, 0]])} fill={TEN_C} opacity={0.5} />
        <path d={serit([[-14, -556, 0], [-8, -550, 3 * lw], [0, -552, 2 * lw], [8, -550, 3 * lw], [14, -556, 0]])} fill={TEN_C} opacity={0.65} />
        <ellipse cx={2} cy={-566} rx={6} ry={4} fill="#fff" opacity={0.5} />
        {p.sik > 0.3 ? <path d={serit([[-10, -590, 0], [0, -596, 2 * lw], [10, -590, 0]])} fill={TEN_C} opacity={0.5 * p.sik} /> : null}
        {/* taşmış ruj (köşede) */}
        <Agiz x={0} y={-518} w={50} ac={p.agiz.ac} yuv={p.agiz.yuv} gul={p.gul} dudak={RUJ} cizgi={TEN_C} lw={lw} />
        {/* perde kakül + kalp tokalar */}
        {[1, -1].map((s) => (
          <g key={s} transform={`scale(${s} 1)`}>
            <Hacim id={`inf-kakul${s}`} pts={KAKUL} dolgu={SAC} golge={SAC_G} cizgi={SAC_C} isik={IS} ince={2.2 * lw} kalin={6 * lw}>
              <path d={serit([[-20, -726, 0], [-70, -690, 3], [-104, -620, 0]])} fill="#7a5040" opacity={0.6} />
            </Hacim>
            <g transform="translate(-82 -712) rotate(-30)">
              <path d="M 0 10 C -22 -6 -14 -22 0 -12 C 14 -22 22 -6 0 10 Z" fill={TOKA} stroke="#a01a4a" strokeWidth={2.4 * lw} />
              <ellipse cx={-6} cy={-8} rx={4} ry={2.4} fill="#fff" opacity={0.7} />
            </g>
          </g>
        ))}
        <path d={serit([[0, -760, 0], [2, -746, 4 * lw], [0, -730, 0]])} fill={SAC_C} />
      </g>
    </g>
  );
};
