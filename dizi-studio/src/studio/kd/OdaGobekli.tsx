import React from "react";
import { egri, serit, Hacim, uzuv, kemik, kemikHat, aciDer, noktalar, ODA_ISIK, type P, type PW } from "./kukla";

/* =====================================================================================
 * Göbekli Adam · beyaz oda · YERDE SIRTÜSTÜ (yan profil kuklası, yeni çizim dili)
 * Onaylı görünüm korunur: solgun ten, kalın renkli kontur, noktalı bir haftalık sakal, iki katlı gıdı,
 * yağlı/seyrek saç, patates burun, sararmış lekeli atlet (yukarı sıyrılmış, göbek taşıyor), cips kırıntısı,
 * kıllı kollar, lacivert eşofman (gri yan şerit). Beyaz odada: tek terlik (arka ayak), öbür ayakta başparmağı
 * delik çorap.
 * Yerel koordinat: baş solda (batı), yüz tavana; zemin y = 0; kalça ekseni (0, -110). 1 m = 780 birim.
 * Kukla: gövde kalçadan kalkar (kalk), baş boyundan eğilir, iki kol iki kemikli, iki bacak dizden bükülür.
 * ===================================================================================== */

const TEN = "#ecd3c6", TEN_G = "#c6aeb8", TEN_C = "#8a3a2c";
const ATLET = "#efe8d4", ATLET_G = "#c9c3c6", ATLET_C = "#7a6440";
const ESOF = "#3c4256", ESOF_G = "#2a3044", ESOF_C = "#141828";
const SAC = "#2a221e";
const TERLIK = "#3a8ad8", TERLIK_G = "#24609e", TERLIK_C = "#123a6a";
const CORAP = "#e6e2da", CORAP_G = "#b9b8c2", CORAP_C = "#6a6470";
const IS = ODA_ISIK;

export type GobekPoz = {
  /** gövdenin kalçadan kalkışı (derece; + = baş yukarı) */
  kalk: number;
  /** başın boyundan eğilmesi (derece; + = çene göğse) */
  basEg: number;
  /** nefes -1..1 (göbek iner/kalkar) */
  nefes: number;
  /** ön kol: omuz açısı, dirsek açısı (derece) */
  kolOn: [number, number];
  /** arka kol */
  kolArka: [number, number];
  /** diz kalkışı 0..1 */
  dizOn: number;
  dizArka: number;
  /** kaşınma: parmak bükülmesi -1..1 */
  kasi: number;
  /** bilek bükümü (derece; elin önkola göre açısı) */
  bilek?: number;
  /** arka elin bükümü; elArkaUstte: arka el başın ÖNÜNDE çizilir (başını ovarken eli başın arkasını kavrar) */
  bilekArka?: number;
  elArkaUstte?: boolean;
  /** göz açıklığı 0 (kapalı) .. 1 (açık) .. 1.4 (fal taşı) */
  goz: number;
  /** gözleri sıkma 0..1 */
  sik: number;
  /** kaş: -1 çatık .. 1 havada */
  kas: number;
  /** çene açıklığı 0..1 */
  agiz: number;
  /** düşen kırıntılar (yerel) */
  kirinti?: { x: number; y: number; a: number }[];
  /** ter damlaları (panik) */
  ter?: number;
};

export const GOBEK_UYKU: GobekPoz = { kalk: 0, basEg: 10, nefes: 0, kolOn: [20, -92], kolArka: [8, 4], dizOn: 0.05, dizArka: 0, kasi: 0, bilek: 48, goz: 0, sik: 0, kas: 0, agiz: 0.35 };

/* ---------------- gövde biçimleri ---------------- */
const GOVDE: P[] = [[-560, -60], [-470, -14], [-330, -3], [-160, -2], [-20, -3], [30, -60], [45, -150], [82, -214], [62, -290], [10, -346], [-70, -393], [-170, -419], [-270, -409], [-360, -373], [-430, -323], [-480, -293], [-530, -270], [-572, -216], [-588, -140]];
const ATLET_B: P[] = [[-196, -424], [-270, -414], [-362, -378], [-432, -328], [-482, -298], [-532, -275], [-578, -220], [-594, -140], [-566, -56], [-472, -8], [-330, 3], [-150, 4], [-140, -90], [-152, -220], [-172, -340]];
const KALCA: P[] = [[-30, -2], [120, -4], [190, -60], [204, -160], [176, -244], [112, -284], [40, -282], [16, -160]];
const BOYUN: P[] = [[-640, -26], [-520, -30], [-500, -150], [-516, -262], [-580, -284], [-640, -210]];

/* göbeğin üst çizgisi (atlet fitili göbeği izlesin) */
const UST: P[] = [[-588, -140], [-572, -216], [-530, -270], [-480, -293], [-430, -323], [-360, -373], [-270, -409], [-170, -419], [-70, -393], [10, -346]];
const ustY = (x: number) => {
  for (let i = 0; i < UST.length - 1; i++) {
    const a = UST[i], b = UST[i + 1];
    if (x >= a[0] && x <= b[0]) return a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
  }
  return -140;
};

/* ---------------- baş (dik profil, yüz sağa; sonra -90° döndürülür) ---------------- */
const BAS_UST: P[] = [[150, 84], [146, 72], [146, 62], [168, 60], [184, 44], [178, 24], [152, 4], [132, -18], [124, -34], [130, -52], [124, -90], [100, -134], [50, -170], [-20, -180], [-72, -170], [-114, -140], [-152, -82], [-163, 0], [-152, 80], [-114, 150], [-60, 192], [0, 200]];
/* çene (ağızla birlikte iner): alt dudak → çene → gıdı → boyun önü */
const BAS_CENE: P[] = [[40, 194], [72, 180], [96, 164], [122, 152], [142, 128], [148, 110], [140, 96]];
const CENE_MENTESE: P = [10, 40];

const rot = (p: P, o: P, a: number): P => {
  const c = Math.cos(a), s = Math.sin(a);
  return [o[0] + (p[0] - o[0]) * c - (p[1] - o[1]) * s, o[1] + (p[0] - o[0]) * s + (p[1] - o[1]) * c];
};

const ProfilBas: React.FC<{ p: GobekPoz; lw: number }> = ({ p, lw }) => {
  const ca = p.agiz * 0.3;
  const cene = BAS_CENE.map((q, i) => rot(q, CENE_MENTESE, ca * (i < 2 ? 0.35 + i * 0.3 : 1)));
  const dis: P[] = [...BAS_UST, ...cene];
  // ağız boşluğu: üst dudak ile alt dudak arası
  const altDudak = cene[cene.length - 1];
  const kose: P = [116, 90 + p.agiz * 6];
  const sakal = React.useMemo(() => noktalar(77, 150, (x, y) => ((x - 70) / 78) ** 2 + ((y - 110) / 70) ** 2 < 1 && !(((x - 140) / 30) ** 2 + ((y - 90) / 22) ** 2 < 1) && x < 140, [-20, 30, 160, 200]), []);
  const g = Math.max(0, p.goz);
  const gozY = -30, gozX = 100;
  const kasK = p.kas * 12 - p.sik * 6;
  return (
    <g>
      <Hacim id="gb-bas" pts={dis} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={{ ...IS, yon: [-1, 0.1] }} ince={2.6 * lw} kalin={8.5 * lw} golgeCarp={1.2}>
        <ellipse cx={48} cy={36} rx={36} ry={20} fill="#e8846e" opacity={0.2} />
        {sakal.map(([x, y], i) => <circle key={i} cx={x} cy={y + (y > 100 ? ca * (x - 10) * 0.25 : 0)} r={1.6 + (i % 3) * 0.45} fill="#3a2a26" opacity={0.5} />)}
        {/* kel tepe, oda ışığında soluk parlama */}
        <ellipse cx={30} cy={-150} rx={46} ry={12} fill="#ffffff" opacity={0.45} transform="rotate(20 30 -150)" />
      </Hacim>
      {/* ağız boşluğu (horlama: açık) */}
      {p.agiz > 0.05 ? (
        <path d={egri([[150, 82], [kose[0], kose[1] - 4], [altDudak[0] - 2, altDudak[1] - 2], [altDudak[0] + 4, altDudak[1] - 6], [148, 86]], true)} fill="#4a1a1e" />
      ) : null}
      <path d={serit([[150, 84, 0], [132, 88, 4 * lw], [kose[0], kose[1], 0]])} fill={TEN_C} />
      {/* gıdı katları */}
      <path d={serit([[cene[2][0] - 20, cene[2][1] - 18, 0], [cene[1][0], cene[1][1] - 10, 4.5 * lw], [20, 182, 0]])} fill={TEN_C} opacity={0.7} />
      <path d={serit([[110, 150 + ca * 30, 0], [80, 164 + ca * 30, 3 * lw], [52, 170, 0]])} fill={TEN_C} opacity={0.45} />
      {/* burun deliği, burun-dudak kıvrımı */}
      <ellipse cx={156} cy={56} rx={9} ry={4.5} fill="#5a2a22" transform="rotate(-15 156 56)" />
      <path d={serit([[124, 30, 0], [112, 56, 3 * lw], [118, 80, 0]])} fill={TEN_C} opacity={0.55} />
      {/* göz */}
      <ellipse cx={gozX - 6} cy={gozY + 18} rx={24} ry={9} fill="#7a4a7a" opacity={0.26} />
      <path d={serit([[gozX - 22, gozY + 14, 0], [gozX - 6, gozY + 20, 2.6 * lw], [gozX + 12, gozY + 14, 0]])} fill={TEN_C} opacity={0.6} />
      {g > 0.08 ? (
        <g>
          <path d={egri([[gozX - 16, gozY], [gozX, gozY - 9 * g], [gozX + 17, gozY - 2], [gozX + 2, gozY + 7 * g]], true)} fill="#f4efe8" stroke={TEN_C} strokeWidth={2.4 * lw} />
          <circle cx={gozX + 9} cy={gozY - 1} r={5.5 * Math.min(1, g)} fill="#2a1a14" />
          <circle cx={gozX + 7} cy={gozY - 4} r={1.8} fill="#fff" />
          <path d={serit([[gozX - 18, gozY + 1, 0], [gozX, gozY - 10 * g, 6 * lw], [gozX + 19, gozY - 2, 0]])} fill={TEN_C} />
        </g>
      ) : (
        <g>
          <path d={serit([[gozX - 18, gozY - 2 - p.sik * 4, 0], [gozX - 2, gozY + 4, 5.5 * lw], [gozX + 18, gozY - 2 - p.sik * 2, 0]])} fill={TEN_C} />
          {[0, 1, 2].map((k) => <path key={k} d={serit([[gozX - 8 + k * 8, gozY + 4, 1.6 * lw], [gozX - 10 + k * 8, gozY + 12, 0]])} fill={TEN_C} />)}
          {p.sik > 0.1 ? [0, 1].map((k) => <path key={`s${k}`} d={serit([[gozX - 22, gozY - 6 + k * 10, 0], [gozX - 32, gozY - 8 + k * 14, 2 * lw], [gozX - 40, gozY - 10 + k * 18, 0]])} fill={TEN_C} opacity={0.6 * p.sik} />) : null}
        </g>
      )}
      {/* kaş */}
      <path d={serit([[gozX - 26, gozY - 26 - kasK * 0.5, 3 * lw], [gozX, gozY - 34 - kasK, 9 * lw], [gozX + 24, gozY - 30 - kasK * 0.6 + p.sik * 6, 2 * lw]])} fill={SAC} />
      {/* kulak */}
      <Hacim id="gb-kulak" pts={[[-52, -28], [-22, -38], [-6, -10], [-8, 30], [-24, 50], [-48, 42], [-60, 10]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2.2 * lw} kalin={6 * lw}>
        <path d={serit([[-40, -14, 0], [-22, -16, 4], [-20, 14, 4], [-34, 30, 0]])} fill={TEN_C} opacity={0.45} />
      </Hacim>
      {/* saç: kulak üstü/arkası seyrek tutam + tepeye yatırılmış yağlı teller */}
      {/* kulak arkası/üstü seyrek saç: yarı saydam kütle (deri seçilir) + ince, kıvrık teller */}
      <path d={egri([[-150, -58], [-118, -86], [-76, -74], [-60, -46], [-76, -16], [-100, 16], [-114, 54], [-140, 62], [-160, 12]], true)} fill="#4a3e36" opacity={0.42} />
      {new Array(10).fill(0).map((_, k) => {
        const y0 = -70 + k * 13, x0 = -148 + (k % 3) * 3;
        return <path key={k} d={serit([[x0, y0, 0], [x0 + 22, y0 - 4 + (k % 2) * 4, 2.6 * lw], [x0 + 48, y0 + 2, 2 * lw], [x0 + 66 - k * 2, y0 + 10, 0]])} fill={k % 2 ? "#2a221e" : "#4a3e36"} opacity={0.85} />;
      })}
      <path d={serit([[86, -150, 1 * lw], [30, -176, 7 * lw], [-50, -172, 6 * lw], [-118, -134, 1 * lw]])} fill={SAC} />
      <path d={serit([[70, -138, 1 * lw], [10, -164, 6 * lw], [-70, -158, 5 * lw], [-130, -110, 0]])} fill={SAC} />
      <path d={serit([[50, -124, 0], [-10, -150, 5 * lw], [-90, -140, 4 * lw], [-140, -88, 0]])} fill={SAC} />
      <path d={serit([[60, -175, 0], [20, -184, 3 * lw], [-20, -190, 0]])} fill="#ffffff" opacity={0.7} />
    </g>
  );
};

/* ---------------- el (yan): bilek (0,0), +x önkol yönünde ---------------- */
const El: React.FC<{ id: string; bilek: P; aci: number; bukul: number; lw: number; arka?: boolean; ayna?: boolean }> = ({ id, bilek, aci, bukul, lw, arka, ayna }) => {
  const d = arka ? "#dcc0b6" : TEN;
  const avuc: P[] = [[-6, -34], [40, -40], [80, -30], [98, -4], [90, 26], [50, 36], [4, 32]];
  return (
    <g transform={`translate(${bilek[0]} ${bilek[1]}) rotate(${aci}) scale(1 ${ayna ? -1 : 1})`}>
      <Hacim id={id} pts={avuc} dolgu={d} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2.2 * lw} kalin={6 * lw} />
      {[0, 1, 2, 3].map((k) => {
        const y = -26 + k * 16, b = 16 + bukul * 14;
        return <path key={k} d={serit([[84, y, 15], [112, y + 2, 14], [128, y + b * 0.6, 12], [126, y + b, 0]])} fill={d} stroke={TEN_C} strokeWidth={2.4 * lw} strokeLinejoin="round" />;
      })}
      <path d={serit([[30, -34, 18], [58, -52, 15], [80, -56, 0]])} fill={d} stroke={TEN_C} strokeWidth={2.4 * lw} />
    </g>
  );
};

const KolKil: React.FC<{ hat: PW[]; seed: number }> = ({ hat, seed }) => {
  const pts = React.useMemo(() => {
    let s = seed;
    const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    return new Array(22).fill(0).map(() => [r(), r() - 0.5, r()]);
  }, [seed]);
  return (
    <g>
      {pts.map(([t, o, a], i) => {
        const u = 0.08 + t * 0.84, k = Math.min(hat.length - 2, Math.floor(u * (hat.length - 1))), f = u * (hat.length - 1) - k;
        const x = hat[k][0] + (hat[k + 1][0] - hat[k][0]) * f, y = hat[k][1] + (hat[k + 1][1] - hat[k][1]) * f;
        const w = hat[k][2] * 0.7;
        const dx = hat[k + 1][0] - hat[k][0], dy = hat[k + 1][1] - hat[k][1], L = Math.hypot(dx, dy) || 1;
        const px = x + (-dy / L) * o * w, py = y + (dx / L) * o * w, an = Math.atan2(dy, dx) + (a - 0.5);
        return <path key={i} d={serit([[px, py, 0], [px + Math.cos(an) * 5, py + Math.sin(an) * 5 - 2, 2], [px + Math.cos(an) * 10, py + Math.sin(an) * 10, 0]])} fill="#5a3a30" opacity={0.7} />;
      })}
    </g>
  );
};

/* ---------------- bacak ---------------- */
const bacakHat = (diz: number, dx: number, dy: number): PW[] => [
  [130 + dx, -130 + dy, 250], [232 + dx - diz * 20, -136 + dy - diz * 70, 214], [318 + dx - diz * 44, -136 + dy - diz * 160, 170], [386 + dx - diz * 50, -108 + dy - diz * 90, 140], [452 + dx - diz * 60, -76 + dy, 110],
];

const AyakCorap: React.FC<{ at: P; lw: number }> = ({ at, lw }) => (
  <g transform={`translate(${at[0]} ${at[1]})`}>
    <Hacim id="gb-corap" pts={[[-34, 12], [-24, 58], [30, 74], [64, 40], [74, -40], [66, -128], [44, -168], [8, -176], [-20, -150], [-32, -80]]} dolgu={CORAP} golge={CORAP_G} cizgi={CORAP_C} isik={IS} ince={2.4 * lw} kalin={7 * lw}>
      <path d={serit([[-40, 0, 0], [0, -6, 12], [44, 4, 0]])} fill={CORAP_G} opacity={0.7} />
      {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M ${-30 + k * 2} ${-20 - k * 30} Q 20 ${-26 - k * 30} 66 ${-22 - k * 30}`} stroke="#cfcac2" strokeWidth={2} fill="none" />)}
    </Hacim>
    {/* başparmak delikten çıkmış */}
    <path d={egri([[8, -150], [30, -158], [48, -150], [40, -168], [18, -170]], true)} fill="#3a3238" opacity={0.6} />
    <Hacim id="gb-bparmak" pts={[[12, -160], [26, -186], [46, -190], [58, -172], [48, -154], [24, -150]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5 * lw}>
      <ellipse cx={44} cy={-180} rx={8} ry={5} fill="#f6e4dc" />
    </Hacim>
  </g>
);

const AyakTerlik: React.FC<{ at: P; lw: number }> = ({ at, lw }) => (
  <g transform={`translate(${at[0]} ${at[1]})`}>
    <Hacim id="gb-ayak2" pts={[[-30, 10], [-20, 56], [26, 70], [58, 38], [66, -40], [58, -126], [36, -160], [4, -166], [-20, -140], [-30, -80]]} dolgu={TEN_G} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={6 * lw} />
    <Hacim id="gb-terlik" pts={[[52, 70], [80, 62], [92, -60], [86, -170], [66, -186], [52, -150], [58, -40]]} dolgu={TERLIK} golge={TERLIK_G} cizgi={TERLIK_C} isik={IS} ince={2.2 * lw} kalin={6 * lw} />
    <Hacim id="gb-kayis" pts={[[-14, -64], [62, -78], [66, -36], [-12, -24]]} dolgu={TERLIK} golge={TERLIK_G} cizgi={TERLIK_C} isik={IS} ince={2.2 * lw} kalin={6 * lw} />
  </g>
);

/* ---------------- tüm beden ---------------- */
export const OdaGobekli: React.FC<{ p: GobekPoz; lw: number }> = ({ p, lw }) => {
  const H: P = [10, -110];
  const sy = 1 + 0.022 * p.nefes;
  const tr = `rotate(${p.kalk} ${H[0]} ${H[1]})`;
  // kollar
  const S_ON: P = [-455, -212], S_ARKA: P = [-470, -250];
  const jOn = kemik(S_ON, p.kolOn[0], 215, p.kolOn[1], 200);
  const jArka = kemik(S_ARKA, p.kolArka[0], 215, p.kolArka[1], 200);
  const kolOnHat = kemikHat(jOn, [138, 96, 72]);
  const kolArkaHat = kemikHat(jArka, [130, 92, 70]);
  const bOn = bacakHat(p.dizOn, 0, 0), bArka = bacakHat(p.dizArka, 26, -34);
  const ayakAci = (h: PW[]) => aciDer([h[3][0], h[3][1]], [h[4][0], h[4][1]]);
  // fitil çizgileri göbeği izler
  const fitil = new Array(22).fill(0).map((_, i) => {
    const t = 0.06 + i * 0.043;
    const xs = [-590, -540, -480, -420, -360, -300, -240, -180, -150];
    const pts: P[] = xs.map((x) => [x, ustY(x) * (1 - t) + 4]);
    return egri(pts, false);
  });
  return (
    <g>
      {/* yerle temas: köşe gölgesi gibi çok hafif yumuşak koyuluk (düşen gölge değil) */}
      <ellipse cx={-120} cy={4} rx={660} ry={16} fill="#8aa0b0" opacity={0.16} />

      {/* arka bacak + terlikli arka ayak */}
      <Hacim id="gb-barka" pts={uzuv(bArka)} dolgu={ESOF_G} golge={ESOF_G} cizgi={ESOF_C} isik={IS} ince={2.4 * lw} kalin={7 * lw} />
      <g transform={`rotate(${ayakAci(bArka) - 20} ${bArka[4][0]} ${bArka[4][1]})`}><AyakTerlik at={[bArka[4][0] + 8, bArka[4][1]]} lw={lw} /></g>

      {/* gövdenin arkasındaki kol (panikte göbeğin üstünden görünür) */}
      <g transform={tr}>
        <Hacim id="gb-kolarka" pts={uzuv(kolArkaHat)} dolgu="#dcc0b6" golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2.4 * lw} kalin={7 * lw} />
        {p.elArkaUstte ? null : <El id="gb-elarka" bilek={jArka[2]} aci={aciDer(jArka[1], jArka[2]) + (p.bilekArka ?? 0)} bukul={0.3} lw={lw} arka />}
      </g>

      {/* kalça + ön bacak + çoraplı ayak */}
      <Hacim id="gb-kalca" pts={KALCA} dolgu={ESOF} golge={ESOF_G} cizgi={ESOF_C} isik={IS} ince={2.4 * lw} kalin={7 * lw} />
      <Hacim id="gb-bon" pts={uzuv(bOn)} dolgu={ESOF} golge={ESOF_G} cizgi={ESOF_C} isik={IS} ince={2.4 * lw} kalin={7.5 * lw} acik={[0]}>
        <path d={serit(bOn.map(([x, y], i) => [x + 4, y + 12 - i * 2, 13] as PW))} fill="#c4c8ce" />
        <path d={serit([[bOn[2][0] - 30, bOn[2][1] - 40, 0], [bOn[2][0] - 6, bOn[2][1] - 20, 4], [bOn[2][0] + 4, bOn[2][1] + 10, 0]])} fill={ESOF_C} opacity={0.6} />
        <path d={serit([[200, -60, 0], [260, -70, 3.5], [300, -56, 0]])} fill={ESOF_C} opacity={0.5} />
      </Hacim>
      <g transform={`rotate(${ayakAci(bOn) - 18} ${bOn[4][0]} ${bOn[4][1]})`}><AyakCorap at={[bOn[4][0] + 6, bOn[4][1]]} lw={lw} /></g>

      {/* GÖVDE (kalçadan kalkar) */}
      <g transform={tr}>
        <Hacim id="gb-boyun" pts={BOYUN} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2.4 * lw} kalin={7 * lw} />
        <g transform={`translate(0 ${H[1]}) scale(1 ${sy}) translate(0 ${-H[1]})`}>
          <Hacim id="gb-govde" pts={GOVDE} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2.6 * lw} kalin={8.5 * lw} golgeCarp={1.3}>
            {/* göbek deliği ve kıl çizgisi, göbek altı kıvrımı */}
            <path d={serit([[-6, -352, 0], [4, -340, 6], [10, -328, 0]])} fill={TEN_C} />
            {[0, 1, 2, 3, 4].map((k) => <path key={k} d={serit([[16 + k * 9, -322 + k * 16, 0], [20 + k * 9, -318 + k * 16, 2], [18 + k * 9, -312 + k * 16, 0]])} fill="#5a3a30" opacity={0.7} />)}
            <path d={serit([[60, -250, 0], [36, -200, 5], [32, -150, 0]])} fill={TEN_C} opacity={0.45} />
          </Hacim>
          <Hacim id="gb-atlet" pts={ATLET_B} dolgu={ATLET} golge={ATLET_G} cizgi={ATLET_C} isik={{ ...IS, kenarOp: 0.5 }} ince={2.4 * lw} kalin={7 * lw} golgeCarp={1.4}>
            {fitil.map((d, i) => <path key={i} d={d} stroke="#d6ccb2" strokeWidth={2} fill="none" opacity={0.5} />)}
            <path d={egri([[-300, -330], [-262, -342], [-240, -318], [-262, -296], [-296, -302]], true)} fill="#d8bc7c" opacity={0.55} />
            <path d={egri([[-420, -200], [-390, -210], [-376, -186], [-398, -170], [-424, -180]], true)} fill="#cdb070" opacity={0.5} />
            <path d={egri([[-230, -150], [-210, -156], [-200, -136], [-222, -128]], true)} fill="#c8a868" opacity={0.5} />
            {([[-250, -396, 12], [-310, -372, -8], [-212, -405, 30], [-370, -340, 16], [-180, -412, -20]] as const).map(([x, y, a], i) => (
              <rect key={i} x={x} y={y} width={i % 2 ? 9 : 12} height={i % 2 ? 6 : 8} rx={1.5} fill="#f0a030" stroke="#b86a10" strokeWidth={1.2} transform={`rotate(${a} ${x} ${y})`} />
            ))}
            {/* gerilme kıvrımları */}
            <path d={serit([[-330, -250, 0], [-280, -290, 3], [-230, -300, 0]])} fill={ATLET_C} opacity={0.35} />
          </Hacim>
          {/* göğüs kılı atlet yakasından */}
          {[[-560, -236], [-548, -252], [-536, -244], [-566, -222]].map(([x, y], k) => <path key={k} d={serit([[x, y, 0], [x - 4, y - 6, 2.2], [x - 2, y - 12, 0]])} fill="#4a3028" />)}
        </g>

        {/* BAŞ: boyundan eğilir */}
        <g transform={`translate(-560 -150) rotate(${-90 + p.basEg}) translate(0 -182)`}>
          <ProfilBas p={p} lw={lw} />
        </g>

        {p.elArkaUstte ? <El id="gb-elarka2" bilek={jArka[2]} aci={aciDer(jArka[1], jArka[2]) + (p.bilekArka ?? 0)} bukul={0.6 + 0.4 * Math.sin(p.nefes * 3)} lw={lw} /> : null}
        {/* ön kol: tek parça (omuz deltoiti + üst kol + önkol), kaşınan el */}
        <Hacim id="gb-kolon" pts={uzuv(kolOnHat)} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2.4 * lw} kalin={7.5 * lw} golgeCarp={0.7}>
          <KolKil hat={kolOnHat} seed={11} />
          <path d={serit([[jOn[1][0] - 10, jOn[1][1] - 30, 0], [jOn[1][0], jOn[1][1] - 12, 2.8], [jOn[1][0] + 16, jOn[1][1] - 4, 0]])} fill={TEN_C} opacity={0.5} />
        </Hacim>
        {/* atletin kol oyuğu omzun üstünde */}
        <path d={serit([[S_ON[0] - 70, S_ON[1] - 40, 0], [S_ON[0] - 40, S_ON[1] - 66, 5 * lw], [S_ON[0] + 10, S_ON[1] - 70, 5 * lw], [S_ON[0] + 60, S_ON[1] - 48, 0]])} fill={ATLET} stroke={ATLET_C} strokeWidth={2.2 * lw} />
        <El id="gb-elon" bilek={jOn[2]} aci={aciDer(jOn[1], jOn[2]) + (p.bilek ?? 0)} bukul={p.kasi} lw={lw} ayna />
        {/* ter damlaları: alından/tepeden dışa fırlar (gözyaşı gibi okunmasın diye gözden uzakta) */}
        {p.ter ? [[-930, -250, -30], [-870, -330, -10], [-960, -170, -50]].map(([x, y, a], i) => (
          <g key={i} transform={`rotate(${a} ${x} ${y})`} opacity={p.ter}>
            <path d={egri([[x, y - 22], [x + 10, y], [x, y + 10], [x - 10, y]], true)} fill="#e8f6ff" stroke="#5a8ab0" strokeWidth={2.4 * lw} />
            <path d={serit([[x + 22, y - 8, 0], [x + 30, y - 14, 3 * lw], [x + 38, y - 20, 0]])} fill="#5a8ab0" />
          </g>
        )) : null}
      </g>

      {/* düşen cips kırıntıları */}
      {(p.kirinti ?? []).map((k, i) => (
        <rect key={i} x={k.x} y={k.y} width={i % 2 ? 9 : 12} height={i % 2 ? 6 : 8} rx={1.5} fill="#f0a030" stroke="#b86a10" strokeWidth={1.4} transform={`rotate(${k.a} ${k.x} ${k.y})`} />
      ))}
    </g>
  );
};
