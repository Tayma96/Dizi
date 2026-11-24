/* =====================================================================================
 * 7/24 B8 P2: "NAH" el işareti (iki el, adım adım). Ece kameraya (seyirciye) dönük; sağ eli kadrajın SOLUNDA.
 *  a: 0..1  sağ el açık, beş parmak aşağı (elin sırtı seyirciye), sol el açık avuç yanda hazır
 *     1..2  sol avuç sağ elin parmaklarını yukarı süpürüp kapatır (parmaklar kıvrılır → yumruk)
 *     2..3  yumruk ileri (seyirciye) uzar (2,75'te tam); sol el AÇIK AVUÇLA geri çekilip sağ bileğin içine şaklar:
 *           TEMAS a = 3 ("ŞAK" bu kare; kullanıcı: ses sağ bileğin sol avuç içine çarpmasıyla oluşur)
 *     3..3,3 sol el bileği kavrar (parmaklar kapanır); sonrası tutuş (pompa dışarıdan konum/ölçekle)
 *  Yumruk önden: dört parmağın kıvrık boğumları yan yana, BAŞPARMAK UCU işaret ile orta parmağın ARASINDAN çıkar.
 *  Geometri yerel birimde (avuç ~100 birim); s = ölçek. nahGeo bilekleri verir (rig kolları buraya bağlanır).
 * ===================================================================================== */
import React from "react";

type V2 = [number, number];
const O = "#2b1d1a";
const TEN = "#f0c8a8", TEN_K = "#dcac88", TIRNAK = "#f8e0d0";
const KAZAK = "#c8902a", KAZAK_K = "#a8741a";
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ss = (u: number) => { const x = cl(u); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerp2 = (a: V2, b: V2, u: number): V2 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

export type NahGeo = {
  R: V2; rS: number; /** sağ el merkezi ve ölçeği */
  sagBilek: V2; L: V2; lRot: number; solBilek: V2; on: number; Lg: V2; Wd: V2; /** 0: elin sırtı (açık/kapanan), 1: yumruk önden */
};
/** a ve sağ elin dayanak noktası (x,y) + ölçekten iki elin yerleri */
export const nahGeo = (a: number, x: number, y: number, s: number, ileri = 0.55): NahGeo => {
  const u2 = ss(a - 1), u3 = ss((a - 2) / 0.75);
  // yumruk: aşağıdan biraz yukarı + merkeze, ölçek büyür (seyirciye doğru)
  const R: V2 = [x + 40 * s * u3, y - 10 * s * u2 - 30 * s * u3];
  const rS = s * (1 + ileri * u3);
  const on = ss((a - 2) / 0.35);
  // sağ bilek: açıkken avucun üstünde; yumruk önden olunca geri-yukarı-sola (önkol kısalır)
  const sagBilek: V2 = lerp2([R[0] - 4 * rS, R[1] - 62 * rS], [R[0] - 118 * rS, R[1] - 34 * rS], on);
  // sol el: sağda hazır → parmakların üstünden süpürür → geri çekilir (hazırlık) → bileğe ŞAK → kavrar
  const L0: V2 = [x + 150 * s, y + 62 * s];
  const L1: V2 = [x + 34 * s, y + 52 * s - 70 * s * ss((a - 1.45) / 0.55)];
  const Lg: V2 = [R[0] - 92 * rS, R[1] - 22 * rS];       // temas: sağ bileğin iç yanı
  const Wd: V2 = [Lg[0] + 40 * rS, Lg[1] + 150 * rS];     // hazırlık: bileğin altı
  let L: V2, lRot: number;
  if (a <= 1) { L = L0; lRot = -18; }
  else if (a <= 2) { L = lerp2(L0, L1, ss((a - 1) / 0.6)); lRot = lerp(-18, -70, ss((a - 1) / 0.8)); }
  else if (a <= 2.6) { const u = ss((a - 2) / 0.6); L = lerp2(L1, Wd, u); lRot = lerp(-70, -10, u); }
  else if (a < 3) { const u = Math.pow(cl((a - 2.6) / 0.4), 2); L = lerp2(Wd, Lg, u); lRot = lerp(-10, 0, u); }   // hızlanarak çarpar
  else { L = Lg; lRot = lerp(0, 16, ss((a - 3) / 0.15)); }
  const kav = a >= 3.08;
  const solBilek: V2 = kav ? [L[0] + 6 * rS, L[1] + 100 * rS] : a > 2 ? [L[0] + 22 * rS, L[1] + 92 * rS] : [L[0] + 40 * s, L[1] + 72 * s];
  return { R, rS, sagBilek, L, lRot, solBilek, on, Lg, Wd };
};

/* ---------------- sağ el, sırtı seyirciye, parmaklar aşağı; c = kıvrılma 0..1 */
const SagElSirt: React.FC<{ c: number }> = ({ c }) => {
  const P: [number, number, number, number][] = [[-35, 15, 70, 21], [-12, 5, 92, 24], [12, -3, 100, 25], [36, -13, 90, 24]];
  const kalan = 1 - 0.86 * c;
  return (
    <g>
      {/* parmaklar (avucun ARKASINDA başlar; kıvrıldıkça kısalır, boğum belirir) */}
      {P.map(([bx, ang, L, w], i) => {
        const l = L * kalan;
        return (
          <g key={i} transform={`translate(${bx} 26) rotate(${ang * (1 - c)})`}>
            <path d={`M 0 0 L 0 ${l}`} stroke={O} strokeWidth={w + 7} strokeLinecap="round" />
            <path d={`M 0 0 L 0 ${l}`} stroke={TEN} strokeWidth={w} strokeLinecap="round" />
            {c < 0.5 ? <path d={`M ${-w * 0.3} ${l * 0.5} q ${w * 0.3} 4 ${w * 0.6} 0`} stroke={TEN_K} strokeWidth={2.2} fill="none" opacity={1 - 2 * c} /> : null}
            {c < 0.6 ? <ellipse cx={0} cy={l - w * 0.15} rx={w * 0.3} ry={w * 0.24} fill={TIRNAK} opacity={0.8 * (1 - c / 0.6)} /> : null}
          </g>
        );
      })}
      {/* başparmak (işaret parmağı tarafında, iç tarafa); kapanınca avucun altına girer */}
      <g transform={`translate(44 -6) rotate(${-40 + 70 * c})`}>
        <path d={`M 0 0 L 0 ${62 * (1 - 0.45 * c)}`} stroke={O} strokeWidth={34} strokeLinecap="round" />
        <path d={`M 0 0 L 0 ${62 * (1 - 0.45 * c)}`} stroke={TEN} strokeWidth={27} strokeLinecap="round" />
      </g>
      {/* elin sırtı */}
      <path d="M -50 -62 Q -56 6 -46 32 Q 0 46 48 32 Q 56 0 50 -62 Z" fill={TEN} stroke={O} strokeWidth={6} />
      <path d="M 30 -50 Q 42 -10 36 24" stroke={TEN_K} strokeWidth={9} fill="none" opacity={0.6} strokeLinecap="round" />
      {/* tendon izleri ve kapanınca boğum sırası */}
      {[-24, -2, 20].map((xx, i) => <path key={i} d={`M ${xx} -30 L ${xx + 2} 14`} stroke={TEN_K} strokeWidth={2.4} opacity={0.5} />)}
      {c > 0.4 ? [-35, -12, 12, 36].map((xx, i) => <ellipse key={i} cx={xx} cy={34} rx={11} ry={8} fill={TEN} stroke={O} strokeWidth={3} opacity={cl((c - 0.4) / 0.4)} />) : null}
    </g>
  );
};

/* ---------------- sağ yumruk ÖNDEN (seyirciye uzanmış): boğumlar yan yana, başparmak ucu işaret-orta arasında */
const SagYumrukOn: React.FC = () => (
  <g>
    {/* kullanıcı düzeltmesi: 180° çevrilip aynalandı (= dikey çevirme): boğumlar yukarıdan aşağı, başparmak ucu SAĞDA */}
    <g transform="scale(1 -1)">
    {/* yumruğun gövdesi (avuç tarafı/üst) */}
    <path d="M -66 -46 Q -70 -70 -40 -72 L 46 -72 Q 74 -70 70 -40 L 70 40 Q 70 68 40 70 L -40 70 Q -70 68 -66 40 Z" fill={TEN} stroke={O} strokeWidth={6} />
    {/* başparmağın gövdesi: işaret parmağının altından dolanır (sağ kenardan) */}
    <path d="M 66 30 Q 78 6 58 -8 Q 44 -16 30 -10" stroke={O} strokeWidth={36} strokeLinecap="round" fill="none" />
    <path d="M 66 30 Q 78 6 58 -8 Q 44 -16 30 -10" stroke={TEN} strokeWidth={28} strokeLinecap="round" fill="none" />
    {/* dört parmağın kıvrık orta boğumları (soldan: serçe, yüzük, orta, işaret) */}
    {[-48, -16, 16, 48].map((cx, i) => (
      <g key={i}>
        <rect x={cx - 17} y={-8 + (i === 0 ? 8 : 0)} width={34} height={66 - (i === 0 ? 12 : 0)} rx={15} fill={TEN} stroke={O} strokeWidth={5} />
        <path d={`M ${cx - 9} ${30} q 9 6 18 0`} stroke={TEN_K} strokeWidth={3} fill="none" />
      </g>
    ))}
    {/* üst boğum sırası (elin sırtı, yukarıda) */}
    {[-48, -16, 16, 48].map((cx, i) => <path key={`k${i}`} d={`M ${cx - 12} -50 q 12 -10 24 0`} stroke={TEN_K} strokeWidth={3.5} fill="none" />)}
    </g>
    {/* başparmak UCU: işaret (sağ) ile orta parmağın ARASINDAN dışarı çıkar (tırnak kameraya) */}
    <g transform="translate(32 -4)">
      <ellipse cx={0} cy={0} rx={17} ry={22} fill={TEN} stroke={O} strokeWidth={5} />
      <ellipse cx={0} cy={-6} rx={10} ry={11} fill={TIRNAK} stroke={TEN_K} strokeWidth={2} />
      <ellipse cx={-3} cy={-9} rx={3.5} ry={4} fill="#ffffff" opacity={0.7} />
    </g>
  </g>
);

/* ---------------- sol el: açık avuç (parmaklar yukarı, başparmak iç tarafta) */
const SolElAcik: React.FC = () => (
  <g>
    {[[-34, -10, 68, 21], [-12, -3, 88, 24], [12, 3, 96, 25], [35, 12, 86, 24]].map(([bx, ang, L, w], i) => (
      <g key={i} transform={`translate(${bx} -34) rotate(${ang})`}>
        <path d={`M 0 0 L 0 ${-L}`} stroke={O} strokeWidth={w + 7} strokeLinecap="round" />
        <path d={`M 0 0 L 0 ${-L}`} stroke={TEN} strokeWidth={w} strokeLinecap="round" />
        <path d={`M ${-w * 0.3} ${-L * 0.5} q ${w * 0.3} -3 ${w * 0.6} 0`} stroke={TEN_K} strokeWidth={2.2} fill="none" />
      </g>
    ))}
    <g transform="translate(-46 4) rotate(-52)">
      <path d="M 0 0 L 0 -60" stroke={O} strokeWidth={33} strokeLinecap="round" />
      <path d="M 0 0 L 0 -60" stroke={TEN} strokeWidth={26} strokeLinecap="round" />
    </g>
    <path d="M -50 -40 Q -56 30 -40 56 Q 0 70 42 56 Q 56 20 50 -40 Q 0 -50 -50 -40 Z" fill={TEN} stroke={O} strokeWidth={6} />
    {/* avuç çizgileri */}
    <path d="M -36 -6 Q 0 -16 38 -8" stroke={TEN_K} strokeWidth={3} fill="none" />
    <path d="M -30 16 Q -4 6 24 20" stroke={TEN_K} strokeWidth={3} fill="none" />
    <path d="M -30 46 Q -26 20 -36 0" stroke={TEN_K} strokeWidth={3} fill="none" />
  </g>
);

/* ---------------- sol el bileği kavrar (elin sırtı görünür, dört parmak önkolun üstünden dolanır) */
const SolElKavra: React.FC = () => (
  <g>
    {/* elin sırtı/avuç topuğu bileğin ALTINDA (önkol aşağıdan gelir) */}
    <path d="M -62 34 Q -66 96 -30 118 Q 8 132 44 116 Q 70 96 62 34 Z" fill={TEN} stroke={O} strokeWidth={6} />
    <path d="M -36 70 Q 0 84 38 70" stroke={TEN_K} strokeWidth={3} fill="none" />
    {/* başparmak: bileğin ÖBÜR yanından üst kenara dolanır (ucu görünür) */}
    <path d="M 72 30 Q 86 -40 52 -70" stroke={O} strokeWidth={30} strokeLinecap="round" fill="none" />
    <path d="M 72 30 Q 86 -40 52 -70" stroke={TEN} strokeWidth={23} strokeLinecap="round" fill="none" />
    {/* dört parmak bileğin önünden yukarı sarılır (içe kavisli), uçlar üst kenarda içe kıvrık */}
    {[-45, -16, 13, 41].map((x, i) => (
      <g key={i}>
        <path d={`M ${x} 52 Q ${x - 12} 0 ${x - 2} -50 Q ${x + 2} -64 ${x + 12} -58`} stroke={O} strokeWidth={31} strokeLinecap="round" fill="none" />
        <path d={`M ${x} 52 Q ${x - 12} 0 ${x - 2} -50 Q ${x + 2} -64 ${x + 12} -58`} stroke={TEN} strokeWidth={24} strokeLinecap="round" fill="none" />
        <path d={`M ${x - 13} 4 q 7 4 13 0`} stroke={TEN_K} strokeWidth={2.6} fill="none" />
        <path d={`M ${x - 11} -30 q 6 3 11 0`} stroke={TEN_K} strokeWidth={2.4} fill="none" />
      </g>
    ))}
  </g>
);

/** kazak kolu (önkol): bilekten dirseğe doğru; manşet fitilli */
const Yen: React.FC<{ a: V2; b: V2; w: number }> = ({ a, b, w }) => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const nx = -Math.sin(ang), ny = Math.cos(ang);
  const m = [a[0] + Math.cos(ang) * w * 0.25, a[1] + Math.sin(ang) * w * 0.25];
  return (
    <g>
      <path d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke={O} strokeWidth={w + 8} strokeLinecap="round" />
      <path d={`M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`} stroke={KAZAK} strokeWidth={w} strokeLinecap="round" />
      <path d={`M ${a[0] + nx * w * 0.3} ${a[1] + ny * w * 0.3} L ${b[0] + nx * w * 0.3} ${b[1] + ny * w * 0.3}`} stroke={KAZAK_K} strokeWidth={w * 0.22} strokeLinecap="round" opacity={0.6} />
      {[0, 1, 2].map((i) => {
        const cx = m[0] + Math.cos(ang) * i * w * 0.12, cy = m[1] + Math.sin(ang) * i * w * 0.12;
        return <path key={i} d={`M ${cx + nx * w * 0.48} ${cy + ny * w * 0.48} L ${cx - nx * w * 0.48} ${cy - ny * w * 0.48}`} stroke={KAZAK_K} strokeWidth={w * 0.06} />;
      })}
    </g>
  );
};

/**
 * İki el. kollar: önkol yenlerini de çiz (insert planı); rig kolu varsa yalnız eller (kolsuz).
 * sagDirsek/solDirsek: yenlerin uzandığı yön (insert'te kadraj dışı).
 */
export const NahEller: React.FC<{ a: number; x: number; y: number; s: number; ileri?: number; kollar?: { sagDirsek: V2; solDirsek: V2; sagDirsek3?: V2; solDirsek3?: V2 }; darbe?: number; titre?: V2 }> = ({ a, x, y, s, ileri, kollar, darbe = 0, titre = [0, 0] }) => {
  const g = nahGeo(a, x + titre[0], y + titre[1], s, ileri);
  const c = ss((a - 1.15) / 0.75);
  const kavra = a >= 3.08;
  const tokat = a > 2.35 && a < 3.08; // açık avuç bileğe gidiyor/çarpıyor
  const solEl = (
    <g transform={`translate(${g.L[0]} ${g.L[1]}) rotate(${g.lRot}) scale(${(kavra ? g.rS * 0.82 : tokat ? g.rS * 0.78 : s) * 1.02})`}>
      {kavra ? <SolElKavra /> : <SolElAcik />}
    </g>
  );
  return (
    <g>
      {kollar ? <Yen a={g.sagBilek} b={g.on > 0.5 && kollar.sagDirsek3 ? kollar.sagDirsek3 : kollar.sagDirsek} w={118 * g.rS * (1 - 0.15 * g.on)} /> : null}
      {/* darbe çizgileri (ŞAK): yumruğun çevresinde kısa ışınlar */}
      {darbe > 0.01 ? new Array(9).fill(0).map((_, i) => {
        const an = (i / 9) * Math.PI * 2 + 0.3;
        const r0 = 70 * g.rS * (1 + 0.4 * (1 - darbe)), r1 = r0 + 85 * g.rS * darbe;
        return <path key={i} d={`M ${g.Lg[0] + Math.cos(an) * r0} ${g.Lg[1] + Math.sin(an) * r0} L ${g.Lg[0] + Math.cos(an) * r1} ${g.Lg[1] + Math.sin(an) * r1}`} stroke="#fff6d8" strokeWidth={12 * g.rS} strokeLinecap="round" opacity={0.9 * darbe} />;
      }) : null}
      {darbe > 0.3 ? <circle cx={g.Lg[0]} cy={g.Lg[1]} r={60 * g.rS * (1.4 - 0.4 * darbe)} fill="#fffbe8" opacity={0.35 * darbe} /> : null}
      {/* sırası: açıkken sol el sağın ÖNÜNDE süpürür; yumrukta sol el bileğin üstünde */}
      {kollar ? <Yen a={g.solBilek} b={kavra && kollar.solDirsek3 ? kollar.solDirsek3 : kollar.solDirsek} w={112 * s} /> : null}
      {a > 2.62 && a < 3.12 ? [0, 1, 2].map((i) => {
        const k = (i - 1) * 34 * g.rS;
        const dx = g.Lg[0] - g.Wd[0], dy = g.Lg[1] - g.Wd[1], d = Math.hypot(dx, dy) || 1;
        const nx = -dy / d, ny = dx / d;
        const bas = a < 3 ? g.Wd : [g.L[0] - dx * 0.9, g.L[1] - dy * 0.9];
        return <path key={`iz${i}`} d={`M ${bas[0] + nx * k} ${bas[1] + ny * k} L ${g.L[0] - dx / d * 70 * g.rS + nx * k} ${g.L[1] - dy / d * 70 * g.rS + ny * k}`} stroke="#fff6d8" strokeWidth={9 * g.rS} strokeLinecap="round" opacity={a < 3 ? 0.75 : 0.75 * (3.12 - a) / 0.12} />;
      }) : null}
      {kavra || tokat ? solEl : null}
      <g transform={`translate(${g.R[0]} ${g.R[1]}) scale(${g.rS})`}>
        <g opacity={1 - g.on}><SagElSirt c={c} /></g>
        {g.on > 0.01 ? <g opacity={g.on}><SagYumrukOn /></g> : null}
      </g>
      {!kavra && !tokat && a > 0.02 ? solEl : null}
    </g>
  );
};
