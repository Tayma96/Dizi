import React from "react";
import { egri, serit, Hacim, uzuv, ODA_ISIK, type P, type PW } from "./kukla";

/* =====================================================================================
 * Kolonya Teyze · beyaz oda (yeni çizim dili). "Tonton, tatlı": yuvarlak, kısa, tombul yanaklı; sıkı perma,
 * bordo gözlük + altın gözlük zinciri, inci küpe, mor hırka (düğmeleri MİNİK KIRMIZI MANTAR DÜĞME: ipucu),
 * pembe bluz, gri etek, ten çorap, koyu ayakkabı; kocaman el çantası kollarında.
 * Yerde YAN YATMIŞ, yüzü kameraya (güneye), düzgün ve huzurlu: bayılmış değil, uyuyor gibi (ince ipucu).
 * Üst beden dik çizilir, kalçadan döndürülerek yatırılır; `kalk` ile dirseğinin üstüne doğrulur (irkilme).
 * Yerel koordinat: baş solda, zemin y = 0, kalça (0, -150).
 * ===================================================================================== */

const TEN = "#f3d2b8", TEN_G = "#d8b4ac", TEN_C = "#8a4a3a";
const HIRKA = "#7a3a6a", HIRKA_G = "#5e2a52", HIRKA_C = "#3a1430";
const BLUZ = "#f6dfe6", ETEK = "#4a4652", ETEK_G = "#36323e", ETEK_C = "#17141c";
const SAC = "#8a4a2e", SAC_A = "#b8724a", SAC_C = "#4a2414";
const GOZLUK = "#8a2a4a", ALTIN = "#c9a24a", CANTA = "#8a4a32", CANTA_G = "#6a3424", CANTA_C = "#3a1a10";
const KIRMIZI = "#e2202e";
const IS = ODA_ISIK;

export type TeyzePoz = {
  kalk: number; goz: number; kas: number; agiz: number; basDon: number; nefes: number;
  /** göz bebeği yönü (-1 sol .. 1 sağ) */
  bak?: number;
  /** çantayı göğsüne bastırma 0..1 */
  canta?: number;
};
export const TEYZE_UYKU: TeyzePoz = { kalk: 0, goz: 0, kas: 0, agiz: 0, basDon: 0, nefes: 0 };

/** dik üst beden: kalça (0,0), baş yukarı */
const UstBeden: React.FC<{ p: TeyzePoz; lw: number }> = ({ p, lw }) => {
  const sy = 1 + 0.012 * p.nefes;
  const cy = -(p.canta ?? 0) * 110; // çanta göğse kalkar
  const bk = (p.bak ?? 0) * 4;
  const bukle: [number, number, number][] = [];
  for (let i = 0; i < 15; i++) {
    const a = ((-205 + i * 16.5) * Math.PI) / 180;
    bukle.push([Math.cos(a) * 112, -540 + Math.sin(a) * 118, 36 + (i % 3) * 5]);
  }
  bukle.push([-118, -470, 34], [118, -470, 34], [-104, -432, 28], [104, -432, 28]);
  const g = p.goz;
  const goz = (x: number) =>
    g < 0.1 ? (
      <path d={serit([[x - 16, -520, 0], [x, -512, 4.5 * lw], [x + 16, -520, 0]])} fill="#3a1a14" />
    ) : (
      <g>
        <ellipse cx={x} cy={-518} rx={10} ry={11 * g} fill="#fbf6f2" stroke={TEN_C} strokeWidth={2 * lw} />
        <circle cx={x + bk} cy={-517} r={6.5} fill="#3a2418" />
        <circle cx={x - 2.5 + bk} cy={-520} r={2.2} fill="#fff" />
      </g>
    );
  return (
    <g transform={`scale(1 ${sy})`}>
      {/* çanta sapı (kolların arkasında) */}
      <g transform={`translate(0 ${cy})`}>
      <path d="M -60 -250 Q 0 -330 60 -250" stroke={CANTA_C} strokeWidth={14 * Math.max(0.6, lw * 0.8)} fill="none" />
      <path d="M -60 -250 Q 0 -330 60 -250" stroke={CANTA} strokeWidth={9 * Math.max(0.6, lw * 0.8)} fill="none" />
      </g>
      {/* hırka gövde */}
      <Hacim id="ty-govde" pts={[[-150, -30], [-164, -190], [-156, -320], [-118, -384], [-44, -408], [44, -408], [118, -384], [156, -320], [164, -190], [150, -30], [80, 6], [-80, 6]]} dolgu={HIRKA} golge={HIRKA_G} cizgi={HIRKA_C} isik={IS} ince={2.4 * lw} kalin={7.5 * lw}>
        <path d={egri([[-44, -410], [44, -410], [30, -260], [0, -220], [-30, -260]], true)} fill={BLUZ} />
        <path d={serit([[-44, -406, 4], [-30, -300, 5], [-34, -100, 5], [-30, 6, 4]])} fill={HIRKA_C} opacity={0.45} />
        <path d={serit([[44, -406, 4], [30, -300, 5], [34, -100, 5], [30, 6, 4]])} fill={HIRKA_C} opacity={0.45} />
        {/* örgü dokusu */}
        {[-120, -90, 90, 120].map((x) => <path key={x} d={serit([[x, -360, 0], [x * 1.04, -200, 3], [x, -30, 0]])} fill={HIRKA_G} opacity={0.6} />)}
      </Hacim>
      {/* minik kırmızı mantar düğmeler (ipucu) */}
      {[-336, -292, -248].map((y) => (
        <g key={y}>
          <circle cx={-36} cy={y} r={8.5} fill="#8a0a14" />
          <circle cx={-37} cy={y - 1.5} r={7} fill={KIRMIZI} stroke="#4a0a10" strokeWidth={1.4 * lw} />
          <circle cx={-39.5} cy={y - 4} r={2.2} fill="#fff" opacity={0.8} />
        </g>
      ))}
      {/* kocaman el çantası, kollarının arasında */}
      <g transform={`translate(0 ${cy})`}>
      <Hacim id="ty-canta" pts={[[-110, -250], [110, -250], [130, -140], [120, -70], [-120, -70], [-130, -140]]} dolgu={CANTA} golge={CANTA_G} cizgi={CANTA_C} isik={IS} ince={2.4 * lw} kalin={7 * lw}>
        <path d={serit([[-118, -210, 0], [0, -200, 5], [118, -210, 0]])} fill={CANTA_C} opacity={0.5} />
        <rect x={-14} y={-214} width={28} height={20} rx={4} fill={ALTIN} stroke="#6a5010" strokeWidth={1.6 * lw} />
      </Hacim>
      </g>
      {/* kollar: çantaya sarılı */}
      {[-1, 1].map((s) => {
        const hat: PW[] = [[s * 140, -360, 84], [s * 166, -280 + cy * 0.3, 80], [s * 156, -200 + cy * 0.75, 72], [s * 96, -168 + cy, 64], [s * 52, -176 + cy, 56]];
        return (
          <g key={s}>
            <Hacim id={`ty-kol${s}`} pts={uzuv(hat)} dolgu={HIRKA} golge={HIRKA_G} cizgi={HIRKA_C} isik={IS} ince={2.2 * lw} kalin={6.5 * lw} />
            <Hacim id={`ty-el${s}`} pts={[[s * 56, -200 + cy], [s * 20, -196 + cy], [s * 8, -170 + cy], [s * 22, -148 + cy], [s * 56, -150 + cy]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5 * lw} />
          </g>
        );
      })}
      {/* altın bilezik */}
      <ellipse cx={-62} cy={-172 + cy} rx={7} ry={20} fill="none" stroke={ALTIN} strokeWidth={4 * lw} />
      {/* boyun */}
      <Hacim id="ty-boyun" pts={[[-40, -430], [40, -430], [44, -396], [0, -380], [-44, -396]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5 * lw} />
      {/* BAŞ */}
      <g transform={`rotate(${p.basDon} 0 -430)`}>
        {/* perma: arka bukleler */}
        {bukle.map(([x, y, r], i) => (
          <g key={`a${i}`}>
            <circle cx={x} cy={y} r={r} fill={SAC} stroke={SAC_C} strokeWidth={2.6 * lw} />
          </g>
        ))}
        <Hacim id="ty-yuz" pts={[[0, -628], [62, -616], [100, -578], [110, -520], [104, -470], [80, -432], [40, -412], [0, -406], [-40, -412], [-80, -432], [-104, -470], [-110, -520], [-100, -578], [-62, -616]]} dolgu={TEN} golge={TEN_G} cizgi={TEN_C} isik={IS} ince={2.2 * lw} kalin={6.5 * lw} golgeCarp={0.6}>
          <ellipse cx={-62} cy={-478} rx={26} ry={16} fill="#f08a8a" opacity={0.4} />
          <ellipse cx={62} cy={-478} rx={26} ry={16} fill="#f08a8a" opacity={0.4} />
          <path d={serit([[-40, -420, 0], [0, -414, 3], [40, -420, 0]])} fill={TEN_C} opacity={0.35} />
        </Hacim>
        {/* ön bukleler (alın) */}
        {[-70, -36, 0, 36, 70].map((x, i) => (
          <g key={`o${i}`}>
            <circle cx={x} cy={-620 + Math.abs(x) * 0.35} r={30} fill={SAC} stroke={SAC_C} strokeWidth={2.6 * lw} />
            <path d={serit([[x - 14, -624 + Math.abs(x) * 0.35, 0], [x - 2, -636 + Math.abs(x) * 0.35, 4], [x + 12, -626 + Math.abs(x) * 0.35, 0]])} fill={SAC_A} />
          </g>
        ))}
        {bukle.map(([x, y], i) => <path key={`p${i}`} d={serit([[x - 12, y - 4, 0], [x, y - 14, 4], [x + 12, y - 6, 0]])} fill={SAC_A} opacity={0.8} />)}
        {/* inci küpeler */}
        <circle cx={-108} cy={-488} r={10} fill="#f8f4ec" stroke="#a89a8a" strokeWidth={1.6 * lw} />
        <circle cx={108} cy={-488} r={10} fill="#f8f4ec" stroke="#a89a8a" strokeWidth={1.6 * lw} />
        {/* gözler, kaşlar */}
        {goz(-40)}
        {goz(40)}
        <path d={serit([[-62, -560 - p.kas * 10, 0], [-40, -566 - p.kas * 12, 5 * lw], [-18, -560 - p.kas * 8, 0]])} fill={SAC_C} />
        <path d={serit([[18, -560 - p.kas * 8, 0], [40, -566 - p.kas * 12, 5 * lw], [62, -560 - p.kas * 10, 0]])} fill={SAC_C} />
        {/* bordo gözlük + altın zincir */}
        {[-40, 40].map((x) => <rect key={x} x={x - 30} y={-546} width={60} height={50} rx={18} fill="#ffffff" fillOpacity={0.12} stroke={GOZLUK} strokeWidth={6 * Math.max(0.7, lw)} />)}
        <path d="M -10 -524 Q 0 -532 10 -524" stroke={GOZLUK} strokeWidth={5 * Math.max(0.7, lw)} fill="none" />
        <path d="M -70 -520 Q -110 -440 -96 -380" stroke={ALTIN} strokeWidth={3 * Math.max(0.7, lw)} strokeDasharray="5 4" fill="none" />
        <path d="M 70 -520 Q 110 -440 96 -380" stroke={ALTIN} strokeWidth={3 * Math.max(0.7, lw)} strokeDasharray="5 4" fill="none" />
        {/* burun, ağız (uykuda tatlı gülümseme) */}
        <ellipse cx={0} cy={-482} rx={13} ry={10} fill={TEN_G} opacity={0.6} />
        <path d={serit([[-8, -476, 0], [0, -472, 3 * lw], [8, -476, 0]])} fill={TEN_C} opacity={0.6} />
        {p.agiz > 0.1 ? (
          <ellipse cx={0} cy={-446} rx={12} ry={12 * p.agiz} fill="#4a1a20" stroke={TEN_C} strokeWidth={2 * lw} />
        ) : (
          <path d={serit([[-16, -450, 0], [0, -442, 4 * lw], [16, -450, 0]])} fill={TEN_C} />
        )}
      </g>
    </g>
  );
};

export const OdaTeyze: React.FC<{ p: TeyzePoz; lw: number }> = ({ p, lw }) => (
  <g>
    <ellipse cx={60} cy={4} rx={520} ry={14} fill="#8aa0b0" opacity={0.16} />
    {/* arka bacak + ayakkabı */}
    <Hacim id="ty-b2" pts={uzuv([[200, -190, 96], [330, -184, 82], [450, -176, 64]])} dolgu="#c8a490" golge="#b89484" cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5.5 * lw} />
    <Hacim id="ty-ayk2" pts={[[440, -210], [500, -214], [536, -190], [530, -164], [450, -156]]} dolgu="#1e181a" golge="#1e181a" cizgi="#0a0608" isik={IS} ince={2 * lw} kalin={5 * lw} />
    {/* ön bacak (dizler hafif bükük, ayaklar yan yana) */}
    <Hacim id="ty-b1" pts={uzuv([[200, -110, 104], [320, -96, 86], [452, -86, 68]])} dolgu="#dcb8a0" golge="#c4a08c" cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5.5 * lw} />
    <Hacim id="ty-ayk1" pts={[[442, -120], [504, -124], [544, -100], [538, -70], [452, -62]]} dolgu="#2a2224" golge="#1a1416" cizgi="#0a0608" isik={IS} ince={2 * lw} kalin={5.5 * lw}>
      <ellipse cx={500} cy={-112} rx={16} ry={5} fill="#fff" opacity={0.4} />
    </Hacim>
    {/* etek */}
    <Hacim id="ty-etek" pts={[[-10, -300], [90, -306], [250, -270], [270, -150], [250, -40], [90, -6], [-10, -4]]} dolgu={ETEK} golge={ETEK_G} cizgi={ETEK_C} isik={IS} ince={2.2 * lw} kalin={6.5 * lw}>
      <path d={serit([[60, -280, 0], [150, -160, 4], [160, -40, 0]])} fill={ETEK_C} opacity={0.45} />
    </Hacim>
    {/* üst beden: kalçadan yatırılır */}
    <g transform={`translate(0 -150) rotate(${-90 + p.kalk})`}>
      <UstBeden p={p} lw={lw} />
    </g>
  </g>
);
/** AYAKTA (tekli çekim): önden, tam boy; yerel (0,0) iki ayağın arası, zemin. Adım fazı ile geri çekilir. */
export const TeyzeAyakta: React.FC<{ p: TeyzePoz; lw: number; adim?: number; adimG?: number }> = ({ p, lw, adim = 0, adimG = 0 }) => {
  const kS = Math.max(0, Math.sin(adim)) * 34 * adimG, kG = Math.max(0, -Math.sin(adim)) * 34 * adimG;
  const bob = -Math.abs(Math.sin(adim)) * 10 * adimG;
  return (
    <g>
      {/* bacaklar (ten çorap) + ayakkabılar */}
      {[-1, 1].map((s) => {
        const k = s < 0 ? kS : kG;
        return (
          <g key={s}>
            <Hacim id={`tya-b${s}`} pts={uzuv([[s * 58, -270, 86], [s * 60, -150 - k * 0.5, 72], [s * 60, -46 - k, 62]])} dolgu="#dcb8a0" golge="#c4a08c" cizgi={TEN_C} isik={IS} ince={2 * lw} kalin={5.5 * lw} />
            <Hacim id={`tya-a${s}`} pts={[[s * 26, -40 - k], [s * 92, -44 - k], [s * 112, -18 - k], [s * 104, 2 - k], [s * 20, 2 - k]]} dolgu="#2a2224" golge="#1a1416" cizgi="#0a0608" isik={IS} ince={2 * lw} kalin={5.5 * lw}>
              <ellipse cx={s * 66} cy={-34 - k} rx={16} ry={5} fill="#fff" opacity={0.4} />
            </Hacim>
          </g>
        );
      })}
      <g transform={`translate(0 ${bob})`}>
        {/* etek (A kesim, diz altına) */}
        <Hacim id="tya-etek" pts={[[-150, -520], [150, -520], [168, -380], [188, -240], [0, -226], [-188, -240], [-168, -380]]} dolgu={ETEK} golge={ETEK_G} cizgi={ETEK_C} isik={IS} ince={2.2 * lw} kalin={6.5 * lw}>
          <path d={serit([[-60, -500, 0], [-80, -360, 4], [-96, -240, 0]])} fill={ETEK_C} opacity={0.4} />
          <path d={serit([[70, -500, 0], [90, -360, 4], [104, -240, 0]])} fill={ETEK_C} opacity={0.4} />
        </Hacim>
        <g transform="translate(0 -470)">
          <UstBeden p={p} lw={lw} />
        </g>
      </g>
    </g>
  );
};
export type { P };
