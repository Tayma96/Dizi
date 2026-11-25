/* =====================================================================================
 * 7/24 B9 P2: DİŞİ ASLAN (özgün 2D varlık). Yan görünüş, +x yönüne (sağa) yürür; birim: cm, orijin = gövde ortasının altında zemin.
 *  Yelesiz, kum rengi, açık karın/çene, kulak arkaları koyu, kuyruk ucu koyu püskül. Lateral yürüyüş döngüsü (dört bacak faz farkıyla),
 *  gövde iniş-çıkışı, kürek kemiği kayması, kuyruk gecikmeli salınım. bak 0..1: başını kameraya çevirir (önden yüz; gözlerde ışık yansıması).
 *  mod "termal": TV'deki termal kamera görüntüsü için ısı paleti (gövde sıcak beyaz-sarı, uçlar turuncu-mor).
 * ===================================================================================== */
import React from "react";

const O = "#2b1d1a";
type Mod = "normal" | "termal";

export const Aslan: React.FC<{ faz: number; hiz: number; bak?: number; mod?: Mod; uid?: string; kuyrukT?: number }> = ({ faz, hiz, bak = 0, mod = "normal", uid = "as", kuyrukT = 0 }) => {
  const T = mod === "termal";
  const R = T
    ? { govde: `url(#${uid}g)`, golge: "#ff8a1a", karin: "#fff4b0", ag: "#fffbe0", koyu: "#c8301a", burun: "#ffe070", cizgi: "#3a0a3a", goz: "#ffffff" }
    : { govde: "#d6ad74", golge: "#b48a54", karin: "#ecd3a6", ag: "#f4e6ca", koyu: "#4a3222", burun: "#8a5446", cizgi: O, goz: "#c89a30" };
  const sw = T ? 0 : 3;
  const bob = hiz * 2.2 * Math.sin(2 * faz);
  // bacak: omuz/kalça P, açı θ (ileri +), diz bükümü (havadayken)
  const bacak = (px: number, py: number, off: number, uzak: boolean, on: boolean, key: string) => {
    const a = faz + off;
    const th = hiz * 0.4 * Math.sin(a);
    const kalk = hiz * Math.max(0, Math.cos(a)) * 0.9;            // öne salınırken bacak kalkar (diz/bilek bükülür)
    const L1 = on ? 36 : 34, L2 = on ? 36 : 40;
    const k1 = on ? th - 0.05 : th + 0.35;                           // arka bacak: uyluk öne eğik (hayvan bacağı)
    const kx = px + L1 * Math.sin(k1), ky = py + L1 * Math.cos(k1);
    const k2 = on ? th + 0.05 - kalk * 0.9 : th - 0.45 - kalk * 0.6;
    const ax = kx + L2 * Math.sin(k2), ay = Math.min(-1, ky + L2 * Math.cos(k2));
    const pati = ay + 2;
    const renk = uzak ? R.golge : R.govde;
    const w = on ? 15 : 17;
    const d = `M ${px} ${py} L ${kx} ${ky} L ${ax} ${ay}`;
    return (
      <g key={key}>
        {sw ? <path d={d} stroke={R.cizgi} strokeWidth={w + 5} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
        <path d={d} stroke={renk} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${px} ${py - 10} L ${kx} ${ky}`} stroke={renk} strokeWidth={w + 12} strokeLinecap="round" />
        <ellipse cx={ax + 5} cy={pati - 2} rx={11} ry={6} fill={renk} stroke={R.cizgi} strokeWidth={sw} />
        {!T ? <path d={`M ${ax + 9} ${pati + 1} l 3 -4 M ${ax + 4} ${pati + 2} l 3 -4`} stroke={O} strokeWidth={1.5} opacity={0.6} /> : null}
      </g>
    );
  };
  const kurek = hiz * 3 * Math.sin(faz + Math.PI / 2);   // kürek kemiği yürürken kayar
  const kS = 9 * Math.sin(kuyrukT * 2.1 + faz * 0.5), kU = 6 * Math.sin(kuyrukT * 1.3 + 1);
  const govde = `M -86 ${-78 + bob} Q -88 ${-96 + bob} -62 ${-97 + bob} Q -30 ${-90 + bob} 0 ${-88 + bob} Q ${30 + kurek} ${-92 + bob} ${46 + kurek} ${-100 + bob}
    Q 62 ${-104 + bob} 76 ${-100 + bob} L 82 ${-70 + bob} Q 66 ${-46 + bob} 52 ${-42 + bob} Q 10 ${-34 + bob} -30 ${-40 + bob} Q -66 ${-44 + bob} -80 ${-56 + bob} Q -90 ${-66 + bob} -86 ${-78 + bob} Z`;
  // baş (boyun ucunda): profil ↔ önden geçiş
  const hb = hiz * 1.5 * Math.sin(2 * faz + 0.6);
  const hx = 102, hy = -100 + bob + hb;
  return (
    <g>
      {T ? (
        <defs>
          <radialGradient id={`${uid}g`} gradientUnits="userSpaceOnUse" cx={10} cy={-75} r={110}>
            <stop offset="0" stopColor="#fffbe8" /><stop offset="0.45" stopColor="#ffe060" /><stop offset="0.8" stopColor="#ff8a1a" /><stop offset="1" stopColor="#c8301a" />
          </radialGradient>
        </defs>
      ) : null}
      {/* uzak bacaklar (gövdenin arkasında) */}
      {bacak(-58, -66 + bob, Math.PI, true, false, "ul")}
      {bacak(48, -66 + bob, Math.PI * 1.5, true, true, "uf")}
      {/* kuyruk: kalçadan sarkar, ucu kıvrık, koyu püskül */}
      <path d={`M -84 ${-80 + bob} Q ${-112 + kS * 0.3} ${-64 + bob} ${-116 + kS} ${-30 + bob + kU} Q ${-118 + kS} ${-12 + bob} ${-108 + kS * 1.2} ${-8 + bob + kU * 0.5}`}
        stroke={R.cizgi} strokeWidth={sw ? 11 : 0} fill="none" strokeLinecap="round" />
      <path d={`M -84 ${-80 + bob} Q ${-112 + kS * 0.3} ${-64 + bob} ${-116 + kS} ${-30 + bob + kU} Q ${-118 + kS} ${-12 + bob} ${-108 + kS * 1.2} ${-8 + bob + kU * 0.5}`}
        stroke={T ? "#ffb030" : R.govde} strokeWidth={7} fill="none" strokeLinecap="round" />
      <ellipse cx={-106 + kS * 1.2} cy={-7 + bob + kU * 0.5} rx={9} ry={7} fill={R.koyu} stroke={R.cizgi} strokeWidth={sw * 0.8} transform={`rotate(${20 + kS} ${-106 + kS * 1.2} ${-7 + bob})`} />
      {/* gövde */}
      <path d={govde} fill={R.govde} stroke={R.cizgi} strokeWidth={sw} strokeLinejoin="round" />
      {!T ? (
        <>
          <path d={`M -78 ${-56 + bob} Q -30 ${-40 + bob} 52 ${-44 + bob} Q 40 ${-52 + bob} 0 ${-50 + bob} Q -50 ${-54 + bob} -78 ${-56 + bob} Z`} fill={R.karin} opacity={0.85} />
          {/* kürek ve kalça kası (gölge çizgileri) */}
          <path d={`M ${38 + kurek} ${-92 + bob} Q ${30 + kurek} ${-70 + bob} ${40 + kurek * 0.5} ${-52 + bob}`} stroke={R.golge} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d={`M -48 ${-92 + bob} Q -66 ${-76 + bob} -60 ${-56 + bob}`} stroke={R.golge} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d={`M -60 ${-95 + bob} Q -10 ${-84 + bob} 44 ${-98 + bob}`} stroke="#fff0d0" strokeWidth={3} fill="none" opacity={0.5} />
        </>
      ) : null}
      {/* yakın bacaklar */}
      {bacak(-56, -66 + bob, 0, false, false, "yl")}
      {bacak(50, -66 + bob, Math.PI / 2, false, true, "yf")}
      {/* boyun */}
      <path d={`M 60 ${-100 + bob} Q 80 ${-112 + bob + hb} ${hx - 6} ${hy - 6} L ${hx} ${hy + 18} Q 86 ${-60 + bob} 72 ${-52 + bob} Z`} fill={R.govde} stroke={R.cizgi} strokeWidth={sw} strokeLinejoin="round" />
      {!T ? <path d={`M ${hx - 4} ${hy + 16} Q 86 ${-62 + bob} 74 ${-54 + bob}`} stroke={R.karin} strokeWidth={6} fill="none" opacity={0.8} /> : null}
      {/* PROFİL baş */}
      <g opacity={1 - bak} transform={`translate(${hx} ${hy})`}>
        <path d="M -16 -12 Q -10 -24 2 -24 Q 18 -24 26 -14 L 38 -6 Q 44 -2 42 6 Q 38 14 28 15 Q 10 18 -4 14 Q -18 8 -16 -12 Z" fill={R.govde} stroke={R.cizgi} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M 20 2 Q 32 2 40 6 Q 36 13 26 14 Q 16 14 12 8 Z" fill={R.ag} />
        <path d="M 37 -5 Q 44 -3 43 2 L 38 2 Z" fill={R.burun} stroke={R.cizgi} strokeWidth={sw * 0.6} />
        <path d="M 40 6 Q 32 10 22 9" stroke={R.cizgi} strokeWidth={1.8} fill="none" />
        <path d="M -6 -20 Q -12 -34 -2 -34 Q 6 -32 4 -22" fill={R.govde} stroke={R.cizgi} strokeWidth={sw} />
        <path d="M -4 -24 Q -7 -31 -2 -31" fill={R.koyu} />
        <ellipse cx={18} cy={-11} rx={4.2} ry={3} fill={R.goz} stroke={R.cizgi} strokeWidth={sw * 0.6} />
        {!T ? <><circle cx={19} cy={-11} r={1.6} fill="#1a1208" /><path d="M 12 -15 Q 18 -17 24 -13" stroke={O} strokeWidth={2} fill="none" /><path d="M 20 -7 Q 22 0 28 2" stroke="#7a5a3a" strokeWidth={1.5} fill="none" opacity={0.7} /></> : null}
      </g>
      {/* ÖNDEN baş (kameraya bakış) */}
      {bak > 0.01 ? (
        <g opacity={bak} transform={`translate(${hx - 4} ${hy + 2})`}>
          <path d="M -24 -10 Q -26 -26 -10 -30 Q 0 -32 10 -30 Q 26 -26 24 -10 Q 22 8 12 20 Q 0 28 -12 20 Q -22 8 -24 -10 Z" fill={R.govde} stroke={R.cizgi} strokeWidth={sw} strokeLinejoin="round" />
          {[-1, 1].map((s) => (
            <g key={s}>
              <path d={`M ${s * 14} -26 Q ${s * 26} -42 ${s * 26} -26 Q ${s * 24} -20 ${s * 18} -22 Z`} fill={R.govde} stroke={R.cizgi} strokeWidth={sw} />
              <path d={`M ${s * 17} -26 Q ${s * 23} -35 ${s * 23} -27`} stroke={R.koyu} strokeWidth={3} fill="none" />
            </g>
          ))}
          <path d="M -9 -2 Q 0 -6 9 -2 L 8 14 Q 0 22 -8 14 Z" fill={R.ag} />
          <path d="M -5 6 L 5 6 L 0 11 Z" fill={R.burun} stroke={R.cizgi} strokeWidth={sw * 0.6} strokeLinejoin="round" />
          <path d="M 0 11 L 0 15 M -6 17 Q 0 14 6 17" stroke={R.cizgi} strokeWidth={1.8} fill="none" />
          <path d="M -3 -24 L -4 -8 M 3 -24 L 4 -8" stroke={R.golge} strokeWidth={2} opacity={0.6} />
          {[-1, 1].map((s) => (
            <g key={`g${s}`}>
              <ellipse cx={s * 10} cy={-10} rx={4.6} ry={3.4} fill={R.goz} stroke={R.cizgi} strokeWidth={sw * 0.6} />
              {!T ? <><ellipse cx={s * 10} cy={-10} rx={1.3} ry={2.6} fill="#1a1208" /><path d={`M ${s * 15} -14 Q ${s * 10} -16 ${s * 5} -13`} stroke={O} strokeWidth={2} fill="none" /></> : null}
            </g>
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** önden bakışta gözlerin yerel konumu (cm): ışık yansıması için */
export const aslanGoz = (faz: number, hiz: number): [number, number][] => {
  const bob = hiz * 2.2 * Math.sin(2 * faz), hb = hiz * 1.5 * Math.sin(2 * faz + 0.6);
  const hy = -100 + bob + hb;
  return [[98 - 10, hy - 8], [98 + 10, hy - 8]];
};
