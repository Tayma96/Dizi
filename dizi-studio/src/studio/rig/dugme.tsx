import React from "react";
import { random, useCurrentFrame } from "remotion";
import { OUT } from "./face";
import type { Look } from "./types";

/* =====================================================================================
 * Kırmızı Düğme (dosyalar `kd-*`, kadro id'leri `kd_*`): rig eklemeleri.
 * Hepsi Look'taki isteğe bağlı alanlarla açılır; eski karakterler bu dosyadan hiçbir şey çizmez.
 * Koordinatlar Character.tsx ile aynı: 400×1000 gövde, baş 112..288 × 90..312.
 * ===================================================================================== */

const SW = 4;

/** Sırttaki teslimat çantası: önden omuzların üstünde ve gövdenin iki yanında görünür. */
export const SirtCanta: React.FC<{ look: Look }> = ({ look }) => {
  const c = look.sirtCanta;
  if (!c) return null;
  return (
    <g>
      <rect x={84} y={232} width={232} height={380} rx={22} fill={c.renk} stroke={OUT} strokeWidth={SW} />
      <path d="M 84 274 H 316" stroke={c.kenar} strokeWidth={10} />
      <rect x={96} y={244} width={208} height={22} rx={8} fill="#ffffff" opacity={0.22} />
    </g>
  );
};

const RIB = (x0: number, x1: number, y0: number, y1: number, c: string, step = 12, op = 0.5) =>
  new Array(Math.floor((x1 - x0) / step) + 1).fill(0).map((_, i) => <path key={i} d={`M ${x0 + i * step} ${y0} V ${y1}`} stroke={c} strokeWidth={2} opacity={op} />);

/** Gövde üstü yeni kıyafetler + kırışıklık + baskılar. Torso'nun gövde yolundan SONRA çizilir. */
export const TorsoDugme: React.FC<{ look: Look; skin: string }> = ({ look, skin }) => {
  const o = look.outfit;
  const t = o.type;
  return (
    <g>
      {t === "atlet" ? (
        <g>
          {/* kolsuz fitilli atlet: ince askılar, derin yuvarlak yaka; omuzlar ve göğüs üstü ten */}
          <path d="M 150 334 L 174 336 Q 200 404 226 336 L 250 334 Q 252 404 284 446 L 268 628 Q 200 644 132 628 L 116 446 Q 148 404 150 334 Z" fill={o.top} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          {RIB(136, 264, 440, 620, o.topShade, 12, 0.55)}
          <path d="M 252 352 Q 262 420 282 448" stroke={o.topShade} strokeWidth={8} fill="none" opacity={0.6} />
          {/* göğüste iki küçük kıl kıvrımı (komik, abartısız) */}
          <path d="M 192 366 q 4 -6 8 0 M 202 374 q 4 -6 8 0" stroke={look.hair.color} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>
      ) : null}
      {t === "kurye" ? (
        <g>
          {/* omuz boyunduruğu (koyu), fermuar, reflektör bant, göğüste uydurma logo */}
          <path d="M 128 340 Q 200 322 272 340 Q 282 356 284 392 L 116 392 Q 118 356 128 340 Z" fill={o.accent ?? "#20262b"} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
          <path d="M 200 350 V 626" stroke={OUT} strokeWidth={3} opacity={0.7} />
          <path d="M 205 352 V 624" stroke="#cfd6da" strokeWidth={2} strokeDasharray="4 4" opacity={0.7} />
          <path d="M 120 500 L 280 500 L 278 524 L 122 524 Z" fill="#e4eaee" stroke={OUT} strokeWidth={3} />
          <path d="M 124 506 L 276 506" stroke="#ffffff" strokeWidth={3} opacity={0.9} />
          <path d="M 140 572 h 40 M 220 572 h 40" stroke={OUT} strokeWidth={3} opacity={0.5} />
        </g>
      ) : null}
      {t === "tulum" ? (
        <g>
          {/* tek parça beyaz tulum: fermuar + kırmızı çekecek, göğüs cebi, bel lastiği büzgüsü */}
          <path d="M 200 344 V 622" stroke="#aeb4b6" strokeWidth={3} />
          <rect x={196} y={366} width={10} height={22} rx={4} fill="#e0262e" stroke={OUT} strokeWidth={2} />
          <rect x={222} y={404} width={38} height={44} rx={4} fill="none" stroke="#b8bec0" strokeWidth={3} />
          <path d="M 220 404 H 262 L 260 418 H 222 Z" fill={o.topShade} stroke="#b8bec0" strokeWidth={2.5} />
          <path d="M 122 592 Q 200 604 278 592" stroke="#b8bec0" strokeWidth={3} fill="none" />
          {new Array(14).fill(0).map((_, i) => <path key={i} d={`M ${132 + i * 10} ${592 + Math.sin((i / 13) * Math.PI) * 6} v 12`} stroke="#c4c9cb" strokeWidth={2} />)}
        </g>
      ) : null}
      {t === "oversize" ? (
        <g>
          {/* düşük omuz dikişi, fitilli yaka ve etek, yanlarda bol kumaş kıvrımı */}
          <path d="M 164 332 Q 200 360 236 332" stroke={o.topShade} strokeWidth={11} fill="none" strokeLinecap="round" />
          <path d="M 164 332 Q 200 360 236 332" stroke={OUT} strokeWidth={2.5} fill="none" opacity={0.5} transform="translate(0 7)" />
          <path d="M 134 598 Q 200 612 266 598 L 268 628 Q 200 644 132 628 Z" fill={o.topShade} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
          {RIB(142, 258, 604, 628, o.top, 10, 0.6)}
          <path d="M 132 470 q 16 40 4 90 M 268 470 q -16 40 -4 90" stroke={o.topShade} strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
      {look.baski === "blob" ? (
        <g transform="translate(200 470)">
          {/* uydurma baskı: gülümseyen pembe-lila slime damlası + parıltılar */}
          <path d="M -40 10 C -44 -30 -18 -52 0 -52 C 20 -52 44 -30 40 10 C 38 30 26 30 24 44 C 22 56 10 56 10 44 C 10 34 -2 34 -6 40 C -10 50 -24 48 -22 36 C -20 26 -38 32 -40 10 Z" fill="#ff8fc4" stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
          <ellipse cx={-16} cy={-30} rx={10} ry={6} fill="#ffffff" opacity={0.6} transform="rotate(-30 -16 -30)" />
          <circle cx={-12} cy={-6} r={4.5} fill={OUT} />
          <circle cx={12} cy={-6} r={4.5} fill={OUT} />
          <path d="M -9 8 Q 0 16 9 8" stroke={OUT} strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M 54 -40 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 l 8 -3 Z M -58 -18 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2 l 6 -2 Z" fill="#fff5a8" stroke={OUT} strokeWidth={1.5} />
        </g>
      ) : null}
      {look.baski === "vinn" ? <VinnLogo x={182} y={440} s={0.5} /> : null}
      {look.baski === "cep" ? (
        <g>
          <path d="M 222 400 H 258 V 440 Q 240 446 222 440 Z" fill="none" stroke={OUT} strokeWidth={2.5} opacity={0.55} />
          <rect x={236} y={384} width={7} height={30} rx={2} fill="#2a4a8a" stroke={OUT} strokeWidth={2} />
          <rect x={235} y={384} width={9} height={6} fill="#c8ccd0" />
        </g>
      ) : null}
      {t === "pijama" ? (
        <g>
          {/* pijama üstü: ay-bulut deseni, biyeli devrik yaka, düğme patı (düğmelerden biri dugmeRenk: ipucu), göğüs cebi */}
          {new Array(16).fill(0).map((_, i) => {
            const x = 140 + (i % 4) * 40 + (Math.floor(i / 4) % 2) * 20, y = 400 + Math.floor(i / 4) * 52;
            return i % 2 ? <path key={i} d={`M ${x} ${y} a 7 7 0 1 0 8 -9 a 5 5 0 1 1 -8 9 Z`} fill={o.topShade} opacity={0.8} /> : <path key={i} d={`M ${x - 8} ${y} q 0 -8 8 -8 q 4 -6 10 0 q 7 0 6 8 Z`} fill="#ffffff" opacity={0.75} />;
          })}
          <path d="M 200 352 V 624" stroke={o.topShade} strokeWidth={3} />
          {[400, 460, 520, 580].map((y, i) => <circle key={y} cx={206} cy={y} r={6} fill={i === 2 && look.dugmeRenk ? look.dugmeRenk : "#ffffff"} stroke={OUT} strokeWidth={2} />)}
          <path d="M 222 410 H 258 V 446 Q 240 452 222 446 Z" fill="none" stroke={o.topShade} strokeWidth={3} />
        </g>
      ) : null}
      {look.belCantasi ? (
        <g>
          {/* göğüste çapraz bel çantası */}
          <path d="M 136 348 L 262 560" stroke="#1e1e22" strokeWidth={14} />
          <rect x={186} y={420} width={92} height={56} rx={22} fill={look.belCantasi} stroke={OUT} strokeWidth={4} transform="rotate(-28 232 448)" />
          <path d="M 196 440 L 268 402" stroke="#d8d8d8" strokeWidth={3} strokeDasharray="5 4" transform="rotate(0)" />
        </g>
      ) : null}
      {look.leke ? (
        <g>
          {/* lekeler: çay, yağ, ketçap izi */}
          <path d="M 156 452 q 14 -10 26 2 q 8 14 -6 20 q -18 4 -20 -22 Z" fill="#cdb07a" opacity={0.55} />
          <path d="M 228 404 q 10 -6 16 4 q 2 10 -10 10 q -10 -2 -6 -14 Z" fill="#b8925a" opacity={0.45} />
          <circle cx={214} cy={560} r={6} fill="#c8503a" opacity={0.5} />
        </g>
      ) : null}
      {look.kil && t === "atlet" ? (
        <g stroke={look.hair.color} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.7}>
          {/* omuz kılları + yakadan taşan göğüs kılı */}
          <path d="M 134 344 l -3 -7 M 142 340 l -1 -8 M 258 340 l 1 -8 M 266 344 l 3 -7" />
          <path d="M 184 360 q 4 -6 8 0 M 196 350 q 4 -6 8 0 M 208 360 q 4 -6 8 0 M 190 372 q 4 -6 8 0 M 204 372 q 4 -6 8 0" />
        </g>
      ) : null}
      {look.rozet ? <Rozet x={244} y={396} r={22} simge={look.rozet.simge} renk={look.rozet.renk} /> : null}
      {look.kirisik ? (
        <g>
          {/* buruşukluk ve toz: kaçırılırken yerde sürüklenmiş */}
          <path d="M 146 400 q 14 20 6 44 M 236 430 q -10 24 4 46 M 160 540 q 22 -10 40 6 M 214 586 q 14 -16 34 -8" stroke={OUT} strokeWidth={2.5} fill="none" opacity={0.28} strokeLinecap="round" />
          <ellipse cx={170} cy={496} rx={22} ry={12} fill="#8a8274" opacity={0.22} />
          <ellipse cx={244} cy={566} rx={16} ry={10} fill="#8a8274" opacity={0.2} />
        </g>
      ) : null}
    </g>
  );
};

/** Göbek: gövdenin alt yarısında öne ve yanlara taşan yuvarlak karın (kıyafet rengiyle). */
export const Gobek: React.FC<{ look: Look; skin: string; uid: string }> = ({ look, skin, uid }) => {
  const g = look.gobek ?? 0;
  if (g <= 0) return null;
  const o = look.outfit;
  const w = 16 * g, d = 20 * g;
  const Po = `M 122 466 C ${104 - w} 512 ${100 - w} 592 ${142} ${630 + d * 0.3} Q 200 ${650 + d * 0.4} 258 ${630 + d * 0.3} C ${300 + w} 592 ${296 + w} 512 278 466`;
  const P = `${Po} Z`;
  const acik = look.gobekAcik;
  return (
    <g>
      <defs>
        <clipPath id={`gb-${uid}`}>
          <path d={`M 40 300 H 360 V ${610 - 14 * (look.kilo ?? 0)} Q 200 ${642 - 14 * (look.kilo ?? 0)} 40 ${610 - 14 * (look.kilo ?? 0)} Z`} />
        </clipPath>
      </defs>
      <path d={P} fill={acik ? skin : o.top} />
      <path d={Po} fill="none" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      {acik ? (
        <g>
          <g clipPath={`url(#gb-${uid})`}>
            <path d={P} fill={o.top} />
            <path d={Po} fill="none" stroke={OUT} strokeWidth={SW} />
            {o.type === "atlet" ? RIB(116, 284, 450, 640, o.topShade, 12, 0.55) : null}
          </g>
          <path d={`M 64 ${609.5 - 14 * (look.kilo ?? 0)} Q 200 ${641 - 14 * (look.kilo ?? 0)} 336 ${609.5 - 14 * (look.kilo ?? 0)}`} stroke={OUT} strokeWidth={3.5} fill="none" clipPath={`url(#gbs-${uid})`} />
          <defs>
            <clipPath id={`gbs-${uid}`}>
              <path d={P} />
            </clipPath>
          </defs>
          {/* göbek deliği */}
          <path d="M 196 646 q 4 6 8 0" stroke={OUT} strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
      {/* hacim: sağda gölge hilali, solda üstte parlaklık */}
      <path d={`M ${268 + w * 0.5} 490 C ${292 + w} 540 ${286 + w} 600 ${250} ${636} C ${274 + w * 0.5} 596 ${280 + w * 0.5} 540 ${268 + w * 0.5} 490 Z`} fill={o.topShade} opacity={0.55} />
      <ellipse cx={164 - w * 0.4} cy={540} rx={20} ry={34} fill="#ffffff" opacity={0.25} transform={`rotate(18 ${164 - w * 0.4} 540)`} />
      {look.kilo ? (
        <g stroke={OUT} strokeWidth={2} fill="none" opacity={0.28} strokeLinecap="round">
          {/* atlet gerilmiş: göbek üstünde gerilme çizgileri */}
          <path d="M 132 486 Q 160 476 184 488 M 216 488 Q 244 476 268 486 M 150 530 Q 200 518 250 530" />
        </g>
      ) : null}
      {look.leke ? <path d="M 230 566 q 16 -8 24 6 q 4 14 -12 16 q -16 0 -12 -22 Z" fill="#cdb07a" opacity={0.55} /> : null}
      {look.kirinti ? (
        <g>
          {[[168, 470], [182, 506], [236, 520], [214, 582], [150, 560], [256, 590], [196, 548]].map(([x, y], i) => (
            <path key={i} d={`M ${x} ${y} l 6 -3 l 3 6 l -6 3 Z`} fill={i % 2 ? "#f2c45a" : "#e89a3a"} stroke="#9a6a2a" strokeWidth={1} transform={`rotate(${i * 37} ${x} ${y})`} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Boynun önünde kalan yaka parçaları (Character'da boyundan sonra çizilir). */
export const OnBoyun: React.FC<{ look: Look }> = ({ look }) => {
  const t = look.outfit.type;
  if (t === "kurye")
    return (
      <g>
        <path d="M 170 300 Q 200 314 230 300 L 234 346 Q 200 358 166 346 Z" fill={look.outfit.accent ?? "#20262b"} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M 200 312 V 352" stroke="#cfd6da" strokeWidth={3} />
      </g>
    );
  if (t === "tulum")
    return (
      <g>
        <path d="M 176 326 L 200 352 L 164 372 L 160 334 Z M 224 326 L 200 352 L 236 372 L 240 334 Z" fill={look.outfit.top} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
      </g>
    );
  return null;
};

/** Uydurma kurye markası "VINN!" (gerçek firma değildir): hız çizgili yazı rozeti. */
export const VinnLogo: React.FC<{ x: number; y: number; s?: number; dark?: boolean }> = ({ x, y, s = 1, dark }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-62} y={-22} width={124} height={44} rx={22} fill={dark ? "#1b2226" : "#f4f22e"} stroke={OUT} strokeWidth={4} />
    <path d="M -54 -6 h 10 M -56 4 h 12" stroke={dark ? "#f4f22e" : OUT} strokeWidth={4} strokeLinecap="round" />
    <text x={8} y={9} textAnchor="middle" fontFamily="DiziSans, Arial" fontWeight={900} fontStyle="italic" fontSize={25} fill={dark ? "#f4f22e" : "#14323a"}>VINN!</text>
  </g>
);

/** Kask: tam yüz kask, büyük vizör penceresi (yüz görünür), çene parçası. dx: baş dönüşü. */
export const Kask: React.FC<{ look: Look; dx: number; uid: string; yansima?: number }> = ({ look, dx, uid, yansima = 0 }) => {
  const k = look.kask;
  if (!k) return null;
  const sx = dx * 0.35;
  const win = `M ${122 + dx} 150 C ${124 + dx} 126 ${162 + dx} 120 ${200 + dx} 120 C ${238 + dx} 120 ${276 + dx} 126 ${278 + dx} 150 L ${280 + dx} 258 C ${280 + dx} 288 ${248 + dx} 302 ${200 + dx} 302 C ${152 + dx} 302 ${120 + dx} 288 ${120 + dx} 258 Z`;
  const shell = `M ${200 + sx} 46 C ${292 + sx} 46 ${320 + sx} 112 ${318 + sx} 192 C ${317 + sx} 262 ${306 + sx} 308 ${280 + sx} 336 Q ${200 + sx} 354 ${120 + sx} 336 C ${94 + sx} 308 ${83 + sx} 262 ${82 + sx} 192 C ${80 + sx} 112 ${108 + sx} 46 ${200 + sx} 46 Z`;
  return (
    <g>
      <defs>
        <clipPath id={`kw-${uid}`}><path d={win} /></clipPath>
        <clipPath id={`ks-${uid}`}><path d={shell} /></clipPath>
        <linearGradient id={`kv-${uid}`} x1="0" y1="116" x2="0" y2="306" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#16222c" stopOpacity={0.62} />
          <stop offset="0.3" stopColor="#3a6a8a" stopOpacity={0.22} />
          <stop offset="1" stopColor="#9fd0ee" stopOpacity={0.12} />
        </linearGradient>
      </defs>
      {/* kabuk (pencere boş) */}
      <path d={`${shell} ${win}`} fill={k.renk} fillRule="evenodd" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <g clipPath={`url(#ks-${uid})`}>
        <path d={`M ${268 + sx} 60 C ${330 + sx} 130 ${322 + sx} 290 ${266 + sx} 350 L ${360 + sx} 350 L ${360 + sx} 40 Z`} fill="#000" opacity={0.22} />
        {k.serit ? <path d={`M ${189 + sx} 40 L ${211 + sx} 40 L ${208 + dx} 122 L ${192 + dx} 122 Z`} fill={k.serit} stroke={OUT} strokeWidth={2.5} /> : null}
        <ellipse cx={146 + sx} cy={92} rx={30} ry={15} fill="#ffffff" opacity={0.3} transform={`rotate(-30 ${146 + sx} 92)`} />
        {/* çene havalandırması */}
        {[0, 1, 2].map((i) => <path key={i} d={`M ${186 + dx * 0.8} ${314 + i * 7} h 28`} stroke="#0c0e10" strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />)}
      </g>
      {/* iç sünger kenarı */}
      <path d={win} fill="none" stroke="#2a2e33" strokeWidth={9} clipPath={`url(#kw-${uid})`} />
      <path d={win} fill="none" stroke={OUT} strokeWidth={3} />
      {!k.vizorAcik ? (
        <g>
          <path d={win} fill={`url(#kv-${uid})`} />
          <g clipPath={`url(#kw-${uid})`}>
            <path d={`M ${120 + dx + yansima} 300 L ${170 + dx + yansima} 116 L ${196 + dx + yansima} 116 L ${146 + dx + yansima} 300 Z`} fill="#ffffff" opacity={0.26} />
            <path d={`M ${204 + dx + yansima} 300 L ${248 + dx + yansima} 116 L ${258 + dx + yansima} 116 L ${214 + dx + yansima} 300 Z`} fill="#ffffff" opacity={0.18} />
          </g>
          <path d={`M ${114 + dx} 150 C ${116 + dx} 116 ${284 + dx} 116 ${286 + dx} 150`} fill="none" stroke={OUT} strokeWidth={3} />
          <circle cx={104 + sx} cy={196} r={7} fill="#3a3f44" stroke={OUT} strokeWidth={2.5} />
          <circle cx={296 + sx} cy={196} r={7} fill="#3a3f44" stroke={OUT} strokeWidth={2.5} />
        </g>
      ) : (
        <g>
          <path d={`M ${116 + dx} 150 C ${120 + dx} 100 ${280 + dx} 100 ${284 + dx} 150 L ${280 + dx} 158 C ${252 + dx} 132 ${148 + dx} 132 ${120 + dx} 158 Z`} fill="#2a4a62" opacity={0.92} stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={104 + sx} cy={158} r={7} fill="#3a3f44" stroke={OUT} strokeWidth={2.5} />
          <circle cx={296 + sx} cy={158} r={7} fill="#3a3f44" stroke={OUT} strokeWidth={2.5} />
        </g>
      )}
    </g>
  );
};

/** Kar maskesi: başı ve boynu saran koyu örgü; yalnız göz yarığı açık (ağız deliği yok: alt yüz sakal gibi okunmasın).
 *  Örgü dokusu yatay ilmek sıralarıyla verilir (dikey çizgiler kıl gibi görünür). */
export const KarMaske: React.FC<{ look: Look; dx: number; uid: string }> = ({ look, dx, uid }) => {
  const c = look.karMaske;
  if (!c) return null;
  const sx = dx * 0.4;
  const outer = `M ${200 + sx} 66 C ${296 + sx} 66 ${304 + sx} 140 ${302 + sx} 200 C ${300 + sx} 262 ${288 + sx} 302 ${260 + sx} 320 L 266 352 Q 200 366 134 352 L ${140 + sx} 320 C ${112 + sx} 302 ${100 + sx} 262 ${98 + sx} 200 C ${96 + sx} 140 ${104 + sx} 66 ${200 + sx} 66 Z`;
  const eye = `M ${126 + dx} 174 C ${126 + dx} 156 ${160 + dx} 154 ${200 + dx} 156 C ${240 + dx} 154 ${274 + dx} 156 ${274 + dx} 174 L ${274 + dx} 212 C ${274 + dx} 228 ${240 + dx} 232 ${200 + dx} 230 C ${160 + dx} 232 ${126 + dx} 228 ${126 + dx} 212 Z`;
  return (
    <g>
      <defs>
        <clipPath id={`km-${uid}`}><path d={`${outer} ${eye}`} clipRule="evenodd" /></clipPath>
      </defs>
      <path d={`${outer} ${eye}`} fill={c} fillRule="evenodd" stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <g clipPath={`url(#km-${uid})`}>
        {new Array(14).fill(0).map((_, i) => <path key={i} d={`M 90 ${74 + i * 20} Q ${200 + sx} ${82 + i * 20} 310 ${74 + i * 20}`} stroke="#ffffff" strokeWidth={2} opacity={0.08} fill="none" />)}
        <path d={eye} fill="none" stroke="#4a4a52" strokeWidth={10} />
        {/* burun ve ağız kabartısı (kumaşın altındaki yüz) */}
        <path d={`M ${190 + dx * 1.2} 246 Q ${200 + dx * 1.3} 254 ${212 + dx * 1.2} 246`} stroke="#ffffff" strokeWidth={3} opacity={0.18} fill="none" strokeLinecap="round" />
        <path d={`M ${178 + dx * 1.1} 282 Q ${200 + dx * 1.1} 290 ${222 + dx * 1.1} 282`} stroke="#000000" strokeWidth={4} opacity={0.35} fill="none" strokeLinecap="round" />
        <path d={`M ${262 + sx} 90 C ${320 + sx} 160 ${300 + sx} 300 ${250 + sx} 340 L 330 340 L 330 60 Z`} fill="#000" opacity={0.3} />
        <ellipse cx={150 + sx} cy={104} rx={42} ry={18} fill="#ffffff" opacity={0.16} transform={`rotate(-24 ${150 + sx} 104)`} />
        <ellipse cx={164 + sx} cy={268} rx={26} ry={12} fill="#ffffff" opacity={0.07} />
      </g>
      <path d={eye} fill="none" stroke={OUT} strokeWidth={3} />
    </g>
  );
};

/** Makyaj: far (gözlerden önce çizilir). */
export const MakyajAlt: React.FC<{ look: Look; dx: number }> = ({ look, dx }) => {
  const m = look.makyaj;
  if (!m?.far) return null;
  return (
    <g opacity={0.55}>
      <ellipse cx={156 + dx} cy={184} rx={28} ry={13} fill={m.far} />
      <ellipse cx={244 + dx} cy={184} rx={28} ry={13} fill={m.far} />
    </g>
  );
};

/** Makyaj: eyeliner kuyruğu, ruj, ışıltı (ağızdan sonra çizilir). */
export const MakyajUst: React.FC<{ look: Look; dx: number; mouthX: number; mouthY: number; konusuyor: boolean; restMouth: string }> = ({ look, dx, mouthX, mouthY, konusuyor, restMouth }) => {
  const m = look.makyaj;
  if (!m) return null;
  const lipOk = !konusuyor && ["line", "smile", "flat", "smirk", "tight", "isir", "wavy", "frown"].includes(restMouth);
  const lowY = restMouth === "smile" || restMouth === "isir" ? 5 : restMouth === "frown" ? -1 : 3;
  return (
    <g>
      {m.eyeliner ? (
        <path d={`M ${137 + dx} 198 L ${121 + dx} 188 M ${263 + dx} 196 L ${279 + dx} 186`} stroke={OUT} strokeWidth={5} strokeLinecap="round" />
      ) : null}
      {m.ruj && lipOk ? (
        <g>
          <path d={`M ${mouthX - 11} ${mouthY + lowY} Q ${mouthX} ${mouthY + lowY + 12} ${mouthX + 11} ${mouthY + lowY} Q ${mouthX} ${mouthY + lowY + 4} ${mouthX - 11} ${mouthY + lowY} Z`} fill={m.ruj} opacity={0.85} />
          <ellipse cx={mouthX - 3} cy={mouthY + lowY + 6} rx={3} ry={1.6} fill="#ffffff" opacity={0.75} />
        </g>
      ) : null}
      {m.isilti ? (
        <g fill="#ffffff" stroke="#ff9cc8" strokeWidth={1}>
          {[[132, 226, 5], [144, 236, 3], [268, 224, 5], [256, 236, 3]].map(([x, y, r], i) => (
            <path key={i} d={`M ${x + dx} ${y - r} L ${x + dx + r * 0.3} ${y - r * 0.3} L ${x + dx + r} ${y} L ${x + dx + r * 0.3} ${y + r * 0.3} L ${x + dx} ${y + r} L ${x + dx - r * 0.3} ${y + r * 0.3} L ${x + dx - r} ${y} L ${x + dx - r * 0.3} ${y - r * 0.3} Z`} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Kulak süsleri: halka küpe, küçük kulaklık. */
export const KulakEk: React.FC<{ look: Look; dx: number }> = ({ look, dx }) => (
  <g>
    {look.halka ? (
      <g fill="none" stroke={look.halka} strokeWidth={4.5}>
        <circle cx={110 - dx * 0.4} cy={250} r={12} />
        <circle cx={290 - dx * 0.4} cy={250} r={12} />
      </g>
    ) : null}
    {look.kulaklikKablo ? (
      <g>
        <circle cx={114 - dx * 0.4} cy={214} r={7} fill="#f4f4f2" stroke={OUT} strokeWidth={2} />
        <circle cx={286 - dx * 0.4} cy={214} r={7} fill="#f4f4f2" stroke={OUT} strokeWidth={2} />
      </g>
    ) : null}
    {look.kulaklik ? (
      <g>
        <ellipse cx={116 - dx * 0.4} cy={212} rx={6} ry={7} fill={look.kulaklik} stroke={OUT} strokeWidth={2} />
        <circle cx={114 - dx * 0.4} cy={210} r={1.6} fill="#ffffff" opacity={0.7} />
      </g>
    ) : null}
  </g>
);

/** Bilekte saat (sol kol görüntüsü) ya da saç lastiği. Kolun ön parça koordinatlarında. */
export const BilekEk: React.FC<{ look: Look; side: "l" | "r"; sx: number; hy: number }> = ({ look, side, sx, hy }) => (
  <g>
    {side === "l" && look.saat ? (
      <g>
        <rect x={sx - 19} y={hy - 16} width={38} height={13} rx={4} fill={look.saat} stroke={OUT} strokeWidth={2.5} />
        <circle cx={sx} cy={hy - 9.5} r={10.5} fill="#eef0ea" stroke={OUT} strokeWidth={2.5} />
        <path d={`M ${sx} ${hy - 9.5} v -6 M ${sx} ${hy - 9.5} h 4.5`} stroke={OUT} strokeWidth={1.8} strokeLinecap="round" />
      </g>
    ) : null}
    {side === "r" && look.toka ? (
      <g>
        <ellipse cx={sx} cy={hy - 8} rx={24} ry={10} fill={look.toka} stroke={OUT} strokeWidth={2.5} />
        {[-14, -4, 6, 16].map((x) => <path key={x} d={`M ${sx + x} ${hy - 16} q 3 8 0 16`} stroke="#00000030" strokeWidth={2} fill="none" />)}
      </g>
    ) : null}
  </g>
);

/** Slime (elde): parıltılı lila top, elden sarkan ince damla. */
export const SlimeProp: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const frame = useCurrentFrame();
  const w = Math.sin(frame / 6) * 4;
  return (
    <g>
      <path d={`M ${x - 44} ${y - 18} C ${x - 50} ${y - 52} ${x - 14} ${y - 64 - w} ${x + 6} ${y - 58} C ${x + 40} ${y - 56} ${x + 54} ${y - 30} ${x + 46} ${y - 6} C ${x + 40} ${y + 12} ${x + 26} ${y + 10} ${x + 24} ${y + 30 + w} C ${x + 22} ${y + 44 + w} ${x + 12} ${y + 44 + w} ${x + 12} ${y + 28} C ${x + 10} ${y + 14} ${x - 30} ${y + 14} ${x - 44} ${y - 18} Z`} fill="#c7a6ff" stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
      <ellipse cx={x - 16} cy={y - 40} rx={14} ry={7} fill="#ffffff" opacity={0.6} transform={`rotate(-20 ${x - 16} ${y - 40})`} />
      {[[-24, -16], [2, -30], [20, -14], [-6, 2], [30, -36]].map(([a, b], i) => <circle key={i} cx={x + a} cy={y + b} r={2.2} fill={i % 2 ? "#fff6a8" : "#ffffff"} />)}
    </g>
  );
};

/** Yatay tutulan telefon (iki elin arasında, göbeğe dayalı): arkası kameraya dönük, ekran ışığı yukarı (yüze) taşar.
 *  Eller telefonun iki ucunu kavrar; başparmaklar önde. Koordinatlar gövde (Character) uzayında. */
export const TelefonYatay: React.FC<{ l: [number, number]; r: [number, number]; el: string }> = ({ l, r, el }) => {
  const cx = (l[0] + r[0]) / 2, cy = (l[1] + r[1]) / 2 - 10;
  const a = (Math.atan2(r[1] - l[1], r[0] - l[0]) * 180) / Math.PI;
  const w = Math.max(120, Math.hypot(r[0] - l[0], r[1] - l[1]) + 24);
  return (
    <g>
      <defs><radialGradient id="tfYatayHale" cx="0.5" cy="0.7" r="0.6"><stop offset="0" stopColor="#cfe6ff" stopOpacity={0.5} /><stop offset="1" stopColor="#cfe6ff" stopOpacity={0} /></radialGradient></defs>
      <ellipse cx={cx} cy={cy - 70} rx={110} ry={90} fill="url(#tfYatayHale)" />
      <g transform={`rotate(${a} ${cx} ${cy})`}>
        <rect x={cx - w / 2} y={cy - 34} width={w} height={68} rx={12} fill="#3a3f48" stroke={OUT} strokeWidth={3.5} />
        <rect x={cx - w / 2 + 8} y={cy - 28} width={26} height={22} rx={6} fill="#22262c" stroke={OUT} strokeWidth={2} />
        <circle cx={cx - w / 2 + 16} cy={cy - 17} r={3.6} fill="#0e1014" stroke="#6a7080" strokeWidth={1} />
        <circle cx={cx - w / 2 + 27} cy={cy - 17} r={3.6} fill="#0e1014" stroke="#6a7080" strokeWidth={1} />
        <path d={`M ${cx - w / 2 + 10} ${cy - 34} H ${cx + w / 2 - 10}`} stroke="#cfe6ff" strokeWidth={3} opacity={0.85} />
      </g>
      {[l, r].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={21} fill={el} stroke={OUT} strokeWidth={SW} />
          <path d={`M ${x + (i ? -6 : 6)} ${y - 14} q ${i ? -12 : 12} -4 ${i ? -16 : 16} 6`} stroke={OUT} strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
};

/** Kilo, 1 haftalık sakal, göz altı: yüzün üstüne (gözlerden önce) çizilir. */
export const YuzEk: React.FC<{ look: Look; dx: number; kilo: number }> = ({ look, dx, kilo }) => {
  const n = look.sakalNokta ?? 0;
  return (
    <g>
      {kilo > 0 ? (
        <g>
          {/* gıdı (çift çene) kıvrımı, tombul yanak çizgileri */}
          <path d={`M ${160 + dx} 318 Q ${200 + dx} 336 ${240 + dx} 318`} stroke={OUT} strokeWidth={3} fill="none" opacity={0.55} strokeLinecap="round" />
          <path d={`M ${146 + dx} 258 Q ${150 + dx} 282 ${170 + dx} 292 M ${254 + dx} 258 Q ${250 + dx} 282 ${230 + dx} 292`} stroke={OUT} strokeWidth={2.6} fill="none" opacity={0.35} strokeLinecap="round" />
          <path d={`M ${174 + dx} 120 Q ${200 + dx} 114 ${226 + dx} 120`} stroke={OUT} strokeWidth={2.2} fill="none" opacity={0.25} />
        </g>
      ) : null}
      {n > 0 ? (
        <g fill={look.hair.color} opacity={0.55}>
          {/* noktalı kirli sakal: çene, yanak altı, üst dudak (düz dolgu değil) */}
          <path d={`M ${130 + dx} 250 Q ${136 + dx} ${kilo ? 330 : 300} ${200 + dx} ${kilo ? 348 : 314} Q ${264 + dx} ${kilo ? 330 : 300} ${270 + dx} 250 Q ${250 + dx} 286 ${200 + dx} 292 Q ${150 + dx} 286 ${130 + dx} 250 Z`} opacity={0.12} />
          {new Array(Math.round(230 * n)).fill(0).map((_, i) => {
            // rastgele (ama sabit) dağılım: çene hattı boyunca bant, yukarı doğru seyrelir
            const u = random(`sk-u${i}`), v = random(`sk-v${i}`);
            const a = Math.PI * (0.06 + 0.88 * u);
            const jaw = kilo ? 62 : 52;
            const x = 200 + Math.cos(a) * (jaw + 20 * (u > 0.5 ? 1 : 1)) * (0.62 + 0.38 * v) * (Math.cos(a) > 0 ? 1.05 : 1.05);
            const y = 268 + Math.sin(a) * (kilo ? 70 : 44) * (0.45 + 0.55 * v);
            if (Math.abs(x - 200) < 26 && y < 296 && y > 266) return null;
            return <circle key={i} cx={x + dx} cy={y} r={1.1 + random(`sk-r${i}`) * 0.9} opacity={0.55 + 0.45 * v} />;
          })}
          {new Array(Math.round(30 * n)).fill(0).map((_, i) => <circle key={`u${i}`} cx={176 + random(`sku${i}`) * 48 + dx} cy={258 + random(`skv${i}`) * 9} r={1.2} />)}
        </g>
      ) : null}
      {look.yanakIsaret === "yastik" ? (
        <g stroke="#e8a0a0" strokeWidth={2.6} strokeLinecap="round" fill="none" opacity={0.75}>
          {/* imza: yanağında hiç geçmeyen yastık izi */}
          <path d={`M ${244 + dx} 238 q 14 -4 24 4 M ${240 + dx} 250 q 16 -2 26 8`} />
        </g>
      ) : null}
      {look.yanakIsaret === "kalp" ? (
        <g fill="#ff6a9a">
          {/* imza: sol yanakta üç minik kalp çil */}
          {[[140, 236, 5], [154, 246, 4], [134, 250, 3.5]].map(([x, y, r], i) => (
            <path key={i} d={`M ${x + dx} ${y + r} C ${x - r * 1.6 + dx} ${y - r * 0.2} ${x - r * 0.6 + dx} ${y - r * 1.4} ${x + dx} ${y - r * 0.5} C ${x + r * 0.6 + dx} ${y - r * 1.4} ${x + r * 1.6 + dx} ${y - r * 0.2} ${x + dx} ${y + r} Z`} />
          ))}
        </g>
      ) : null}
      {look.gozAlti ? (
        <g>
          {/* şiş, morumsu göz altları (uykusuz, gün görmemiş) */}
          {[160, 240].map((x) => (
            <g key={x}>
              <path d={`M ${x - 22 + dx} 214 Q ${x + dx} 236 ${x + 22 + dx} 214 Q ${x + dx} 226 ${x - 22 + dx} 214 Z`} fill="#9a7a9a" opacity={0.35} />
              <path d={`M ${x - 18 + dx} 226 Q ${x + dx} 238 ${x + 18 + dx} 224`} stroke={OUT} strokeWidth={2} fill="none" opacity={0.35} />
            </g>
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Saçın üstüne: kask izi, alına itilmiş uyku maskesi, ter bandı. */
export const SacEk: React.FC<{ look: Look; dx: number }> = ({ look, dx }) => (
  <g>
    {look.kaskIzi ? (
      <g>
        <path d={`M ${116 + dx} 158 Q ${200 + dx} 118 ${284 + dx} 158`} stroke="#00000055" strokeWidth={7} fill="none" />
        <path d={`M ${120 + dx} 150 Q ${200 + dx} 112 ${280 + dx} 150`} stroke="#ffffff" strokeWidth={2} fill="none" opacity={0.25} />
        <ellipse cx={176 + dx} cy={150} rx={14} ry={5} fill="#ffffff" opacity={0.35} />
      </g>
    ) : null}
    {look.uykuMaskesi ? (
      <g>
        <path d={`M ${108 + dx} 132 Q ${200 + dx} 106 ${292 + dx} 132`} stroke={look.uykuMaskesi} strokeWidth={8} fill="none" />
        <path d={`M ${132 + dx} 118 Q ${200 + dx} 92 ${268 + dx} 118 Q ${272 + dx} 150 ${236 + dx} 152 Q ${212 + dx} 150 ${200 + dx} 140 Q ${188 + dx} 150 ${164 + dx} 152 Q ${128 + dx} 150 ${132 + dx} 118 Z`} fill={look.uykuMaskesi} stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
        {[164, 236].map((x) => (
          <g key={x} stroke={OUT} strokeWidth={2.5} fill="none" strokeLinecap="round">
            <path d={`M ${x - 16 + dx} 128 Q ${x + dx} 140 ${x + 16 + dx} 128`} />
            <path d={`M ${x - 10 + dx} 134 l -3 5 M ${x + dx} 137 l 0 6 M ${x + 10 + dx} 134 l 3 5`} />
          </g>
        ))}
        <text x={274 + dx} y={104} fontFamily="DiziSans, Arial" fontWeight={900} fontSize={20} fill="#e2202e">z</text>
        <text x={286 + dx} y={88} fontFamily="DiziSans, Arial" fontWeight={900} fontSize={14} fill="#e2202e">z</text>
      </g>
    ) : null}
    {look.terBandi ? (
      <g>
        <path d={`M ${110 + dx} 150 Q ${200 + dx} 118 ${290 + dx} 150 L ${290 + dx} 172 Q ${200 + dx} 140 ${110 + dx} 172 Z`} fill={look.terBandi} stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
        <path d={`M ${112 + dx} 160 Q ${200 + dx} 129 ${288 + dx} 160`} stroke="#ffffff" strokeWidth={3} fill="none" opacity={0.7} />
      </g>
    ) : null}
  </g>
);

/** Kablolu kulaklık: sol kulaktan göğse sarkan beyaz kablo (gövde uzayında). */
export const KulaklikKablo: React.FC<{ look: Look }> = ({ look }) =>
  look.kulaklikKablo ? (
    <g>
      <path d="M 116 226 Q 112 280 150 320 Q 176 350 168 420 Q 164 470 196 500" stroke="#f4f4f2" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M 116 226 Q 112 280 150 320 Q 176 350 168 420 Q 164 470 196 500" stroke={OUT} strokeWidth={1} fill="none" opacity={0.5} />
      <path d="M 288 226 Q 300 300 240 330 Q 196 352 182 400" stroke="#f4f4f2" strokeWidth={4} fill="none" strokeLinecap="round" />
      <rect x={176} y={396} width={12} height={22} rx={4} fill="#f4f4f2" stroke={OUT} strokeWidth={1.5} />
    </g>
  ) : null;

/** Pijama altı deseni (bacak üstünde). */
export const PijamaBacak: React.FC<{ side: number; renk: string }> = ({ side, renk }) => (
  <g>
    {new Array(7).fill(0).map((_, i) => {
      const x = (side < 0 ? 160 : 216) + (i % 2) * 18, y = 640 + i * 44;
      return i % 2 ? <path key={i} d={`M ${x} ${y} a 7 7 0 1 0 8 -9 a 5 5 0 1 1 -8 9 Z`} fill={renk} opacity={0.8} /> : <path key={i} d={`M ${x - 8} ${y} q 0 -8 8 -8 q 4 -6 10 0 q 7 0 6 8 Z`} fill="#ffffff" opacity={0.75} />;
    })}
  </g>
);

/** İmza rozet: minik altıgen (beyaz odanın peteği) + karakter simgesi. Dizinin her karakterinde aynı biçim, farklı simge. */
export const Rozet: React.FC<{ x: number; y: number; r: number; simge: "cips" | "kalp" | "simsek" | "damla" | "ay" | "dambil"; renk: string }> = ({ x, y, r, simge, renk }) => {
  const hex = new Array(6).fill(0).map((_, i) => `${i ? "L" : "M"} ${x + Math.cos((i / 6) * Math.PI * 2 + Math.PI / 6) * r} ${y + Math.sin((i / 6) * Math.PI * 2 + Math.PI / 6) * r}`).join(" ") + " Z";
  const k = r / 22;
  return (
    <g>
      <path d={hex} fill="#ffffff" stroke={OUT} strokeWidth={3} strokeLinejoin="round" />
      <g transform={`translate(${x} ${y}) scale(${k})`} fill={renk} stroke={OUT} strokeWidth={2}>
        {simge === "cips" ? <path d="M -11 6 Q -12 -10 2 -12 Q 13 -10 11 4 Q 0 12 -11 6 Z" /> : null}
        {simge === "kalp" ? <path d="M 0 10 C -16 0 -10 -14 0 -6 C 10 -14 16 0 0 10 Z" /> : null}
        {simge === "simsek" ? <path d="M 3 -13 L -8 2 L -1 2 L -4 13 L 8 -3 L 1 -3 Z" /> : null}
        {simge === "damla" ? <path d="M 0 -13 Q 10 0 8 6 Q 6 12 0 12 Q -6 12 -8 6 Q -10 0 0 -13 Z" /> : null}
        {simge === "ay" ? <path d="M 4 -12 A 12 12 0 1 0 10 8 A 9 9 0 1 1 4 -12 Z" /> : null}
        {simge === "dambil" ? <path d="M -12 -6 h 5 v 12 h -5 Z M 7 -6 h 5 v 12 h -5 Z M -7 -2 h 14 v 4 h -14 Z" /> : null}
      </g>
    </g>
  );
};
