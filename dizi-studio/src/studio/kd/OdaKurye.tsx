import React from "react";
import { egri, serit, Hacim, uzuv, kemik, kemikHat, aciDer, noktalar, Agiz, ODA_ISIK, type P, type PW } from "./kukla";

/* =====================================================================================
 * Motokurye · beyaz oda (yeni çizim dili). Kasksız, çantasız; saçında kask izi, kablolu kulaklık sarkık,
 * eldivenler elinde. Turkuaz kabarık mont (koyu omuz boyunduruğu, dik yaka, reflektör şerit, "VINN!" rozeti),
 * koyu pantolon, spor ayakkabı. Silüet: geniş, kabarık omuzlar.
 *  - KuryeYatan : yerde sırtüstü, dizi kalkık; yan profil (baş solda çizilir, sahnede aynalanır)
 *  - KuryeComel : irkilip fırlamış, tek dizi yerde, savunmada; 3/4 önden, ekranın soluna bakar
 * ===================================================================================== */

const TEN = "#e8b892", TEN_G = "#c89c8c", TEN_C = "#7a3a22";
const MONT = "#18a39a", MONT_G = "#10807a", MONT_C = "#063a38";
const KOYU = "#1f262b", KOYU_G = "#141a1e", KOYU_C = "#06090b";
const PANT = "#2c3036", PANT_G = "#1e2126", PANT_C = "#0a0c10";
const AYK = "#f2f4f6", AYK_G = "#c8d0d8", AYK_C = "#3a4450";
const SAC = "#1e1612";
const ELD = "#25292e", ELD_C = "#06080a";
const REF = "#e8eef2";
const IS = ODA_ISIK;

export type KuryePoz = {
  goz: number; // 0 kapalı .. 1 açık .. 1.3 fal taşı
  sik: number; // gözleri sıkma (uykuda öfke)
  kas: number; // -1 çatık .. 1 havada
  agiz: { ac: number; yuv: number };
  basEg: number; // baş eğimi (derece)
  bak: number; // bakış (-1 sol .. 1 sağ)
  /** çömelmiş: kollar savunmada 0..1 */
  savun: number;
  nefes: number;
  /** yerden doğrulma (derece, kalçadan; 0 = yatık) ve bacak bükme 0..1: yatma → dirsek/oturma ara pozu */
  kalk?: number;
  bacakBuk?: number;
};
export const KURYE_UYKU: KuryePoz = { goz: 0, sik: 0.5, kas: -0.6, agiz: { ac: 0, yuv: 0 }, basEg: 6, bak: 0, savun: 0, nefes: 0 };

/* ---------------- spor ayakkabı (yan): bilek (0,0), burun +x ---------------- */
const Ayakkabi: React.FC<{ id: string; at: P; aci: number; lw: number; koyu?: boolean }> = ({ id, at, aci, lw, koyu }) => (
  <g transform={`translate(${at[0]} ${at[1]}) rotate(${aci})`}>
    <Hacim id={id} pts={[[-34, -34], [30, -36], [80, -20], [124, 0], [132, 22], [118, 38], [-30, 38], [-44, 10]]} dolgu={koyu ? AYK_G : AYK} golge={AYK_G} cizgi={AYK_C} isik={IS} ince={2.2 * lw} kalin={6 * lw}>
      <path d={egri([[-50, 26], [140, 26], [140, 44], [-50, 44]], true)} fill="#3a4450" />
      <path d={serit([[0, -24, 0], [40, -18, 4], [80, -8, 0]])} fill={MONT} />
    </Hacim>
  </g>
);

/* ---------------- yan profil baş (dik, yüz sağa; merkez 0,0) ---------------- */
const BAS_UST: P[] = [[128, 60], [124, 50], [132, 42], [146, 32], [140, 12], [124, -6], [114, -22], [120, -36], [116, -54], [110, -82], [90, -118], [50, -146], [-10, -152], [-58, -144], [-98, -118], [-128, -76], [-142, -14], [-134, 52], [-104, 108], [-60, 150], [-10, 168], [20, 160]];
const BAS_CENE: P[] = [[40, 124], [80, 128], [112, 118], [128, 102], [126, 88], [132, 76], [124, 68]];
const rot = (p: P, o: P, a: number): P => {
  const c = Math.cos(a), s = Math.sin(a);
  return [o[0] + (p[0] - o[0]) * c - (p[1] - o[1]) * s, o[1] + (p[0] - o[0]) * s + (p[1] - o[1]) * c];
};

const ProfilBas: React.FC<{ p: KuryePoz; lw: number }> = ({ p, lw }) => {
  const ca = p.agiz.ac * 0.16;
  const cene = BAS_CENE.map((q, i) => rot(q, [0, 40], ca * (i < 2 ? 0.4 : 1)));
  const sac = React.useMemo(() => noktalar(23, 160, (x, y) => (y < -96 + (x > 60 ? (x - 60) * -0.2 : 0) || x < -40 + y * 0.2) && x * x / 150 / 150 + y * y / 160 / 160 < 1, [-150, -160, 120, 80]), []);
  const g = p.goz, gx = 100, gy = -24;
  const kk = p.kas * 10 - p.sik * 6;
  return (
    <g>
      <Hacim id="ky-bas" pts={[...BAS_UST, ...cene]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={{ ...IS, yon: [-1, 0.1] }} ince={2.4 * lw} kalin={8 * lw}>
        {/* kısa saç (buzz): noktalı doku; kask izi: saçta basık bir halka */}
        <path d={egri([[-10, -154], [52, -148], [92, -120], [100, -98], [60, -102], [20, -92], [-20, -58], [-50, -30], [-56, 20], [-92, 60], [-132, 56], [-146, -14], [-130, -80], [-96, -124]], true)} fill={SAC} opacity={0.88} />
        {sac.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.2} fill="#4a3a32" opacity={0.6} />)}
        <path d={serit([[94, -104, 0], [40, -96, 7], [-30, -62, 8], [-90, -10, 7], [-136, 30, 0]])} fill="#5a4a44" opacity={0.75} />
        <path d={serit([[96, -98, 0], [40, -88, 2], [-30, -54, 2.4], [-88, -2, 2], [-130, 36, 0]])} fill={TEN_C} opacity={0.4} />
        {/* bıyık gölgesi ve çene */}
        {noktalar(5, 40, (x, y) => (y > 44 && y < 54 && x > 104 && x < 132) || (y > 86 && y < 116 && x > 80 && x < 124), [80, 40, 134, 118]).map(([x, y], i) => <circle key={`b${i}`} cx={x} cy={y} r={1.4} fill="#3a2a22" opacity={0.45} />)}
      </Hacim>
      {/* dudak aralığı */}
      <path d={serit([[cene[6][0] + 4, (cene[6][1] + 62) / 2, 0], [114, 64 + ca * 30, 3.6 * lw], [100, 62 + ca * 20, 0]])} fill={TEN_C} />
      {p.agiz.ac > 0.15 ? <path d={egri([[128, 62], [112, 64], [cene[6][0], cene[6][1] - 2]], true)} fill="#4a1a1e" /> : null}
      <ellipse cx={130} cy={36} rx={7} ry={3.6} fill="#5a2a1a" transform="rotate(-20 130 36)" />
      <path d={serit([[112, 14, 0], [104, 36, 2.6 * lw], [110, 54, 0]])} fill={TEN_C} opacity={0.5} />
      {/* göz */}
      {g > 0.08 ? (
        <g>
          <path d={egri([[gx - 16, gy], [gx, gy - 8 * g], [gx + 15, gy - 2], [gx + 2, gy + 6 * g]], true)} fill="#f8f2ec" stroke={TEN_C} strokeWidth={2.2 * lw} />
          <circle cx={gx + 8 + p.bak * 2} cy={gy - 1} r={5.2} fill="#2a1a10" />
          <circle cx={gx + 6} cy={gy - 4} r={1.6} fill="#fff" />
          <path d={serit([[gx - 18, gy, 0], [gx, gy - 9 * g, 5.5 * lw], [gx + 17, gy - 3, 0]])} fill="#1a100c" />
        </g>
      ) : (
        <g>
          <path d={serit([[gx - 16, gy - 2 - p.sik * 3, 0], [gx, gy + 3, 5 * lw], [gx + 16, gy - 2 - p.sik * 2, 0]])} fill="#1a100c" />
          {[0, 1].map((k) => <path key={k} d={serit([[gx - 4 + k * 8, gy + 3, 1.6 * lw], [gx - 6 + k * 8, gy + 10, 0]])} fill="#1a100c" />)}
          {p.sik > 0.1 ? <path d={serit([[gx - 20, gy - 4, 0], [gx - 30, gy - 2, 2 * lw], [gx - 38, gy + 2, 0]])} fill={TEN_C} opacity={0.6 * p.sik} /> : null}
        </g>
      )}
      {/* kaş: kalın, öfkede ön ucu iner */}
      <path d={serit([[gx - 26, gy - 26 - kk * 0.6, 3 * lw], [gx - 2, gy - 32 - kk, 10 * lw], [gx + 20, gy - 26 - kk * 0.4 + p.sik * 8 - Math.min(0, p.kas) * 8, 2 * lw]])} fill={SAC} />
      {p.kas < -0.2 ? <path d={serit([[gx + 16, gy - 46, 0], [gx + 20, gy - 36, 2.4 * lw], [gx + 18, gy - 28, 0]])} fill={TEN_C} opacity={0.5} /> : null}
      {/* kulak + kulaklık */}
      <Hacim id="ky-kulak" pts={[[-56, -24], [-28, -32], [-16, -6], [-18, 30], [-32, 46], [-54, 38], [-64, 8]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5.5 * lw}>
        <path d={serit([[-46, -12, 0], [-30, -14, 3.6], [-28, 14, 3.6], [-40, 28, 0]])} fill={TEN_C} opacity={0.45} />
      </Hacim>
      <circle cx={-34} cy={8} r={11} fill="#f6f8fa" stroke="#8a96a0" strokeWidth={2 * lw} />
    </g>
  );
};

/* =============================== YATAN (yan profil) =============================== */
const GOVDE: P[] = [[-500, -46], [-420, -8], [-250, -2], [-80, -2], [40, -8], [82, -60], [92, -150], [60, -206], [-20, -222], [-120, -234], [-240, -256], [-360, -276], [-440, -268], [-500, -236], [-532, -170], [-532, -100]];

export const KuryeYatan: React.FC<{ p: KuryePoz; lw: number }> = ({ p, lw }) => {
  const S: P = [-420, -196];
  const j = kemik(S, 16, 200, -166, 176);
  const kol = kemikHat(j, [112, 92, 76]);
  const bb = p.bacakBuk ?? 0, kalk = p.kalk ?? 0;
  const m = (a: number, b: number) => a + (b - a) * bb;
  const diz: PW[] = [[80, -96, 150], [m(176, 160), m(-206, -250), 136], [m(258, 230), m(-296, -400), 118], [m(328, 300), m(-190, -230), 100], [m(386, 350), -74, 88]];
  const arka: PW[] = [[110, -100, 140], [m(260, 230), m(-86, -170), 116], [m(420, 340), m(-66, -50), 90]];
  const sy = 1 + 0.015 * p.nefes;
  const PIV: P = [40, -96];
  return (
    <g>
      <ellipse cx={-100} cy={4} rx={620} ry={14} fill="#8aa0b0" opacity={0.16} />
      {/* kulaklık kablosu: kulaktan yere sarkar, öbür kulaklık yerde */}
      <g opacity={1 - Math.min(1, kalk / 20)}>
        <path d="M -700 -100 Q -660 -10 -600 2 T -470 8" stroke="#f4f6f8" strokeWidth={4.5 * lw} fill="none" />
        <path d="M -700 -100 Q -660 -10 -600 2 T -470 8" stroke="#8a96a0" strokeWidth={1.2 * lw} fill="none" opacity={0.6} />
        <circle cx={-466} cy={6} r={10} fill="#f6f8fa" stroke="#8a96a0" strokeWidth={2 * lw} />
      </g>
      {/* arka bacak (düz) + ayakkabı (burnu tavana) */}
      <Hacim id="ky-barka" pts={uzuv(arka)} dolgu={PANT_G} golge={PANT_G} cizgi={PANT_C} isik={IS} ince={2.2 * lw} kalin={6.5 * lw} />
      <Ayakkabi id="ky-ayk2" at={[m(430, 350), m(-40, -30)]} aci={m(-78, 0)} lw={lw} koyu />
      {/* kalça + kalkık ön bacak */}
      <Hacim id="ky-kalca" pts={[[10, -4], [120, -6], [150, -70], [140, -170], [90, -206], [40, -200], [24, -100]]} dolgu={PANT} golge={PANT_G} cizgi={PANT_C} isik={IS} ince={2.2 * lw} kalin={6.5 * lw} />
      <Hacim id="ky-bon" pts={uzuv(diz)} dolgu={PANT} golge={PANT_G} cizgi={PANT_C} isik={IS} ince={2.4 * lw} kalin={7 * lw} acik={[0]}>
        <path d={serit([[230, -300, 0], [256, -276, 3], [270, -250, 0]])} fill={PANT_C} opacity={0.6} />
      </Hacim>
      <Ayakkabi id="ky-ayk1" at={[m(392, 356), -44]} aci={0} lw={lw} />
      <g transform={`rotate(${kalk} ${PIV[0]} ${PIV[1]})`}>
      {/* gövde: kabarık mont */}
      <g transform={`translate(0 -100) scale(1 ${sy}) translate(0 100)`}>
        <Hacim id="ky-mont" pts={GOVDE} dolgu={MONT} golge={MONT_G} cizgi={MONT_C} isik={IS} ince={2.6 * lw} kalin={8 * lw} golgeCarp={1.3}>
          {/* kapitone dikişler */}
          {[-440, -360, -280, -200, -120, -40].map((x) => <path key={x} d={serit([[x, -4, 0], [x - 4, -130, 3], [x - 10, -260, 0]])} fill={MONT_C} opacity={0.35} />)}
          {/* omuz boyunduruğu (koyu) */}
          <path d={egri([[-540, -170], [-506, -240], [-440, -272], [-370, -282], [-370, -196], [-440, -150], [-520, -100]], true)} fill={KOYU} />
          {/* reflektör şerit */}
          <path d={egri([[-170, 0], [-136, 0], [-144, -250], [-178, -246]], true)} fill={REF} />
          <path d={egri([[-160, 0], [-150, 0], [-157, -248], [-167, -247]], true)} fill="#ffffff" opacity={0.8} />
          {/* fermuar */}
          <path d={serit([[-500, -230, 0], [-300, -270, 3], [-100, -232, 3], [70, -200, 0]])} fill={MONT_C} opacity={0.5} />
        </Hacim>
        {/* dik yaka */}
        <Hacim id="ky-yaka" pts={[[-566, -56], [-506, -64], [-492, -246], [-560, -236]]} dolgu={KOYU} golge={KOYU_G} cizgi={KOYU_C} isik={IS} ince={2.2 * lw} kalin={6 * lw} />
      </g>
      {/* boyun + baş */}
      <Hacim id="ky-boyun" pts={[[-612, -50], [-548, -58], [-546, -196], [-612, -186]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5.5 * lw} />
      <g transform={`translate(-572 -124) rotate(${-90 + p.basEg}) translate(0 -158)`}>
        <ProfilBas p={p} lw={lw} />
      </g>
      {/* ön kol: göğsünde, elinde eldivenler */}
      <Hacim id="ky-kol" pts={uzuv(kol)} dolgu={MONT} golge={MONT_G} cizgi={MONT_C} isik={IS} ince={2.4 * lw} kalin={7 * lw} golgeCarp={0.8}>
        <path d={serit([[j[1][0] - 40, j[1][1] - 20, 0], [j[1][0] - 4, j[1][1] - 4, 4], [j[1][0] + 10, j[1][1] + 30, 0]])} fill={MONT_C} opacity={0.5} />
        {(() => { const a: P = [j[1][0] + (j[2][0] - j[1][0]) * 0.55, j[1][1] + (j[2][1] - j[1][1]) * 0.55], b: P = [j[1][0] + (j[2][0] - j[1][0]) * 0.72, j[1][1] + (j[2][1] - j[1][1]) * 0.72]; return <path d={serit([[a[0], a[1], 26], [b[0], b[1], 26]])} fill={REF} />; })()}
      </Hacim>
      <g transform={`translate(${j[2][0]} ${j[2][1]}) rotate(${aciDer(j[1], j[2])})`}>
        <path d={egri([[-8, -36], [16, -38], [16, 38], [-8, 36]], true)} fill={KOYU} />
        {/* eldivenler (iki siyah eldiven elde) */}
        <path d={egri([[20, -30], [70, -44], [118, -40], [130, -10], [112, 14], [60, 20], [24, 26]], true)} fill={ELD} stroke={ELD_C} strokeWidth={2.4 * lw} />
        <path d={egri([[40, 10], [90, 0], [136, 14], [140, 40], [100, 52], [50, 44]], true)} fill="#30353b" stroke={ELD_C} strokeWidth={2.4 * lw} />
        <Hacim id="ky-el" pts={[[12, -30], [52, -34], [78, -20], [84, 6], [66, 30], [22, 30], [10, 0]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5.5 * lw} />
        {[0, 1, 2].map((k) => <path key={k} d={serit([[70, -16 + k * 14, 13], [96, -14 + k * 14, 12], [104, -4 + k * 14, 0]])} fill={TEN} stroke={TEN_C} strokeWidth={2.2 * lw} />)}
      </g>
      </g>
    </g>
  );
};

/* =============================== ÇÖMELMİŞ (3/4 önden, sola bakar) =============================== */
const BAS34: P[] = [[-10, -150], [60, -140], [104, -100], [120, -40], [118, 20], [100, 80], [62, 118], [14, 138], [-36, 140], [-76, 124], [-96, 100], [-104, 70], [-110, 36], [-116, 4], [-110, -20], [-114, -48], [-106, -94], [-78, -132], [-40, -150]];
const SAC34: P[] = [[-112, -50], [-104, -102], [-64, -146], [10, -160], [72, -146], [114, -102], [126, -40], [118, 14], [100, -14], [92, -60], [44, -98], [-30, -108], [-96, -86]];

const BasOn: React.FC<{ p: KuryePoz; lw: number; konus: { ac: number; yuv: number } }> = ({ p, lw, konus }) => {
  const g = p.goz;
  const goz = (x: number, w: number, dar: number) => {
    const h = 9 * g;
    if (g < 0.08) return <path d={serit([[x - w, -6, 0], [x, 0, 5 * lw], [x + w, -6, 0]])} fill="#1a100c" />;
    const id = `kyg${Math.round(x)}`;
    const sek: P[] = [[x - w, 0], [x - w * 0.3, -h * 1.3], [x + w * 0.5, -h * 1.2], [x + w, -2], [x + w * 0.3, h], [x - w * 0.4, h * 0.9]];
    return (
      <g>
        <defs><clipPath id={id}><path d={egri(sek, true)} /></clipPath></defs>
        <path d={egri(sek, true)} fill="#f8f2ec" />
        <g clipPath={`url(#${id})`}>
          <circle cx={x - 6 * dar + p.bak * 6} cy={-1} r={g > 1.1 ? 8 : 10} fill="#4a2e1c" />
          <circle cx={x - 6 * dar + p.bak * 6} cy={-1} r={g > 1.1 ? 3.5 : 5} fill="#120a06" />
          <circle cx={x - 9 * dar + p.bak * 6} cy={-5} r={2.6} fill="#fff" />
        </g>
        <path d={serit([[x - w - 2, 1, 2 * lw], [x - w * 0.3, -h * 1.3 - 1, 6 * lw], [x + w * 0.5, -h * 1.2 - 1, 6 * lw], [x + w + 2, -3, 1 * lw]])} fill="#1a100c" />
      </g>
    );
  };
  const kk = p.kas * 12;
  return (
    <g>
      <Hacim id="kc-bas" pts={BAS34} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2.4 * lw} kalin={8 * lw}>
        <path d={egri(SAC34, true)} fill={SAC} opacity={0.9} />
        {noktalar(31, 120, (x, y) => y < -96 + Math.abs(x) * 0.25 || (x > 96 && y < 10), [-120, -160, 130, 20]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.2} fill="#4a3a32" opacity={0.6} />)}
        {/* kask izi */}
        <path d={serit([[-110, -64, 0], [-40, -100, 7], [50, -104, 8], [118, -70, 0]])} fill="#5a4a44" opacity={0.75} />
        <path d={serit([[-108, -56, 0], [-40, -92, 2.2], [50, -96, 2.4], [118, -62, 0]])} fill={TEN_C} opacity={0.4} />
        {noktalar(9, 50, (x, y) => (y > 50 && y < 62 && x > -84 && x < -24) || (y > 100 && y < 134 && x > -70 && x < 10), [-90, 50, 12, 136]).map(([x, y], i) => <circle key={`b${i}`} cx={x} cy={y} r={1.4} fill="#3a2a22" opacity={0.45} />)}
      </Hacim>
      {/* kulak + kulaklık */}
      <Hacim id="kc-kulak" pts={[[96, -20], [122, -26], [134, 4], [128, 40], [110, 52], [96, 30]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5.5 * lw} />
      <circle cx={112} cy={14} r={10} fill="#f6f8fa" stroke="#8a96a0" strokeWidth={2 * lw} />
      {goz(-74, 16, 1)}
      {goz(0, 24, 1)}
      <path d={serit([[-100, -40 - kk * 0.5 + p.sik * 6, 3 * lw], [-78, -46 - kk, 9 * lw], [-54, -40 - kk * 0.4 + (p.kas < 0 ? 10 : 0), 2 * lw]])} fill={SAC} />
      <path d={serit([[-30, -40 - kk * 0.4 + (p.kas < 0 ? 12 : 0), 2 * lw], [4, -48 - kk, 10 * lw], [34, -42 - kk * 0.6, 3 * lw]])} fill={SAC} />
      {/* burun: yanaktan taşar */}
      <Hacim id="kc-burun" pts={[[-58, -10], [-74, 20], [-96, 40], [-84, 52], [-56, 50], [-44, 36]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5.5 * lw} acik={[0]} />
      <ellipse cx={-72} cy={48} rx={6} ry={3} fill="#5a2a1a" />
      <Agiz x={-46} y={84} w={44} ac={konus.ac} yuv={konus.yuv} gul={p.kas < 0 ? -0.5 : 0} dudak="#c98a7a" cizgi={TEN_C} lw={lw} />
    </g>
  );
};

export const KuryeComel: React.FC<{ p: KuryePoz; lw: number; konus: { ac: number; yuv: number }; nefes: number }> = ({ p, lw, konus, nefes }) => {
  const sv = p.savun;
  const bob = Math.sin(nefes) * 6;
  // kollar: sağdaki (arka omuz) savunmada göğüs önüne kalkar; soldaki dizine dayanır
  const jA = kemik([150, -720 + bob], 106 - sv * 6, 190, 92 + sv * 10, 170);
  const jB = kemik([-110, -730 + bob], 104, 200, -30, 170);
  return (
    <g>
      <ellipse cx={20} cy={6} rx={330} ry={18} fill="#8aa0b0" opacity={0.16} />
      {/* arka bacak: diz yerde, kaval yerde geriye */}
      <Hacim id="kc-b2" pts={uzuv([[50, -380, 150], [90, -200, 130], [116, -46, 110], [220, -40, 96], [300, -34, 84]])} dolgu={PANT_G} golge={PANT_G} cizgi={PANT_C} isik={IS} ince={2.2 * lw} kalin={6.5 * lw} />
      <Ayakkabi id="kc-ayk2" at={[316, -36]} aci={176} lw={lw} koyu />
      {/* kalça */}
      <Hacim id="kc-kalca" pts={[[-110, -420], [130, -420], [140, -330], [30, -300], [-100, -330]]} dolgu={PANT} golge={PANT_G} cizgi={PANT_C} isik={IS} ince={2.2 * lw} kalin={6.5 * lw} />
      {/* ön bacak: diz kalkık, ayak yerde */}
      <Hacim id="kc-b1" pts={uzuv([[-30, -380, 150], [-140, -420, 136], [-236, -440, 122], [-246, -250, 104], [-252, -70, 92]])} dolgu={PANT} golge={PANT_G} cizgi={PANT_C} isik={IS} ince={2.4 * lw} kalin={7 * lw} acik={[0]}>
        <path d={serit([[-250, -470, 0], [-226, -430, 3], [-216, -400, 0]])} fill={PANT_C} opacity={0.6} />
      </Hacim>
      <Ayakkabi id="kc-ayk1" at={[-246, -40]} aci={180} lw={lw} />
      {/* gövde (mont), hafif öne eğik */}
      <g transform={`translate(0 ${bob})`}>
        <Hacim id="kc-mont" pts={[[-130, -730], [-50, -776], [60, -780], [160, -756], [204, -690], [196, -560], [164, -430], [130, -360], [-90, -350], [-140, -440], [-170, -600], [-174, -690]]} dolgu={MONT} golge={MONT_G} cizgi={MONT_C} isik={IS} ince={2.6 * lw} kalin={8 * lw} golgeCarp={1.2}>
          <path d={egri([[-174, -690], [-130, -740], [-50, -780], [60, -784], [160, -760], [204, -690], [200, -640], [100, -660], [-40, -660], [-160, -630]], true)} fill={KOYU} />
          <path d={egri([[-170, -540], [196, -520], [192, -480], [-164, -500]], true)} fill={REF} />
          <path d={egri([[-168, -526], [195, -506], [194, -498], [-166, -518]], true)} fill="#ffffff" opacity={0.8} />
          {[-420, -600].map((y) => <path key={y} d={serit([[-150, y, 0], [20, y + 10, 3], [180, y, 0]])} fill={MONT_C} opacity={0.35} />)}
          <path d={serit([[-10, -770, 3], [-14, -560, 3], [-20, -360, 3]])} fill={MONT_C} opacity={0.6} />
          {/* VINN! rozeti */}
          <g transform="translate(-90 -610) rotate(-4)">
            <rect x={-30} y={-12} width={60} height={24} rx={10} fill="#f2d21a" stroke="#3a3008" strokeWidth={2} />
            <text x={0} y={6} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight={900} fontSize={15} fill="#1a1a1a">VINN!</text>
          </g>
        </Hacim>
        {/* dik yaka */}
        <Hacim id="kc-yaka" pts={[[-90, -800], [-40, -770], [60, -770], [110, -800], [100, -740], [-80, -740]]} dolgu={KOYU} golge={KOYU_G} cizgi={KOYU_C} isik={IS} ince={2.2 * lw} kalin={6 * lw} />
        <Hacim id="kc-boyun" pts={[[-50, -830], [40, -830], [44, -770], [-46, -770]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5 * lw} />
        {/* kulaklık kablosu göğse sarkar */}
        <path d={`M 80 -880 Q 70 -800 40 -740 T 30 -600`} stroke="#f4f6f8" strokeWidth={4.5 * lw} fill="none" />
        <circle cx={30} cy={-596} r={9} fill="#f6f8fa" stroke="#8a96a0" strokeWidth={2 * lw} />
        <g transform={`translate(-30 -920) rotate(${p.basEg})`}>
          <BasOn p={p} lw={lw} konus={konus} />
        </g>
        {/* sol kol: dizine dayalı */}
        <Hacim id="kc-kolB" pts={uzuv(kemikHat(jB, [108, 94, 76]))} dolgu={MONT} golge={MONT_G} cizgi={MONT_C} isik={IS} ince={2.4 * lw} kalin={7 * lw} />
        <Hacim id="kc-elB" pts={[[jB[2][0] - 34, jB[2][1] - 6], [jB[2][0] + 30, jB[2][1] - 8], [jB[2][0] + 36, jB[2][1] + 40], [jB[2][0] - 30, jB[2][1] + 44]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5.5 * lw} />
        {/* sağ kol: savunmada, elinde eldivenler */}
        <Hacim id="kc-kolA" pts={uzuv(kemikHat(jA, [112, 96, 78]))} dolgu={MONT} golge={MONT_G} cizgi={MONT_C} isik={IS} ince={2.4 * lw} kalin={7 * lw}>
          <path d={serit([[jA[1][0] - 30, jA[1][1] - 20, 0], [jA[1][0], jA[1][1], 4], [jA[1][0] + 20, jA[1][1] + 26, 0]])} fill={MONT_C} opacity={0.5} />
        </Hacim>
        <g transform={`translate(${jA[2][0]} ${jA[2][1]}) rotate(${aciDer(jA[1], jA[2])})`}>
          <path d={egri([[20, -30], [70, -44], [118, -40], [130, -10], [112, 14], [60, 20], [24, 26]], true)} fill={ELD} stroke={ELD_C} strokeWidth={2.4 * lw} />
          <Hacim id="kc-elA" pts={[[4, -32], [50, -36], [80, -20], [86, 8], [64, 32], [18, 32], [2, 0]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5.5 * lw} />
          {[0, 1, 2, 3].map((k) => <path key={k} d={serit([[72, -22 + k * 14, 13], [100, -22 + k * 14, 12], [110, -12 + k * 14, 0]])} fill={TEN} stroke={TEN_C} strokeWidth={2.2 * lw} />)}
        </g>
      </g>
    </g>
  );
};
