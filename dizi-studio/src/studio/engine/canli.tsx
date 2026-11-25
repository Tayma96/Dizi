/**
 * CANLILIK katmanı (25 Kasım 2026): aynı çizim tarzı, daha "pahalı" hareket.
 *  - yayEase / kfYay : hazırlık (ters yöne küçük çekilme) → hızlı orta → hedefi biraz geçip yerine oturma
 *  - yaySim          : saç/aksesuar takip hareketi (yaylı, sönümlü; her kare t'den hesaplanır, durum tutmaz)
 *  - AnimeFx         : absürt anlar için anime dili (çarpma karesi, hız çizgileri, ter damlası, şok çizgileri,
 *                      ünlem, öfke işareti, kalpler, toz, titreşim çizgileri)
 * Hepsi isteğe bağlı (opt-in): eski bölümler aynen render olur.
 * İlkeler: Disney'in 12 ilkesi; açık kaynak beceriler (dylantarre/animation-principles, MIT; kelano86/what-if-animation, MIT)
 * okunup bizim motora uyarlandı, kod kopyalanmadı.
 */
import React from "react";
import { random } from "remotion";

type KF = number[][];
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** hazırlık + aşma eğrisi. a: hazırlık payı, o: aşma payı (0.1 ≈ %10). u=0 → 0, u=1 → 1 */
export const yayEase = (u: number, a = 0.08, o = 0.1): number => {
  u = clamp01(u);
  // ilk %22: ters yöne küçük çekilme (yavaş), sonra hızlı geçiş, son %30: hedefi geçip sönümlü oturma
  const h = 0.22;
  if (u < h) {
    const v = u / h;
    return -a * Math.sin(Math.PI * v) * (1 - v * 0.4);
  }
  const v = (u - h) / (1 - h);
  // yavaş kalkış (w = v^1.6), hızlı orta, hedefi o kadar geçip yerine oturma (easeOutBack ailesi)
  const c1 = 1.70158 * (o / 0.1), c3 = c1 + 1;
  const w = Math.pow(v, 1.6) - 1;
  return 1 + c3 * w * w * w + c1 * w * w;
};

/** kf ile aynı anahtarlar; aradaki geçiş yayEase ile (kısa geçişlerde hazırlık azalır, uzun geçişlerde artar) */
export const kfYay = (k: KF | undefined, t: number, def: number[], guc = 1): number[] => {
  if (!k || !k.length) return def;
  if (t <= k[0][0]) return k[0].slice(1);
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i], b = k[i + 1];
    if (t < b[0]) {
      const d = b[0] - a[0];
      const ant = 0.08 * guc * clamp01((d - 0.05) / 0.25), ov = 0.1 * guc * clamp01((d - 0.04) / 0.2);
      const u = yayEase((t - a[0]) / d, ant, ov);
      return a.slice(1).map((v, j) => v + (b[j + 1] - v) * u);
    }
  }
  // son anahtardan sonra: önceki geçişin aşması kısa bir yayla söner
  return k[k.length - 1].slice(1);
};

/**
 * yaylı takip: kaynak sinyal x(t) (ör. başın yatay konumu) değiştikçe saç geriden gelir, sallanıp durur.
 * Durum tutmaz: [t - pencere, t] aralığı her karede baştan simüle edilir (60 adım/sn).
 */
export const yaySim = (x: (t: number) => number, t: number, sert = 70, sonum = 7, pencere = 1.4): number => {
  const dt = 1 / 60;
  let tt = t - pencere;
  let p = x(tt), v = 0;
  const n = Math.round(pencere / dt);
  for (let i = 0; i < n; i++) {
    tt += dt;
    const hedef = x(tt);
    const acc = sert * (hedef - p) - sonum * v;
    v += acc * dt;
    p += v * dt;
  }
  return p - x(t); // kaynağa göre gecikme (+: saç sağda kalır)
};

/* ------------------------------------------------------------------ anime efektleri */
/** [t, tür, görünüm|"*", x, y, ölçek, süre] — x,y dünya koordinatı (kamera içinde); "cakma"/"hiz" ekran koordinatı */
export type Fx = [number, string, string, number, number, number?, number?];

const SURE: Record<string, number> = { cakma: 0.1, hiz: 0.6, ter: 1.2, sok: 1.2, unlem: 0.7, ofke: 1.0, kalp: 1.4, toz: 0.5, titres: 0.4, kizar: 1.4, dokuntu: 1.6 };
const pop = (u: number) => (u < 0.35 ? 1.18 * Math.sin((u / 0.35) * Math.PI * 0.5) : 1 + 0.18 * Math.exp(-9 * (u - 0.35)) * Math.cos(16 * (u - 0.35)));
const ICI = "#1c1626";

const fxAktif = (fx: Fx[] | undefined, view: string, tg: number) =>
  (fx ?? []).filter(([t, tur, v, , , , s]) => (v === "*" || v === view) && tg >= t && tg < t + (s ?? SURE[tur] ?? 0.6));

/** kamera sarsıntısı + yumruk zoom'u (çarpma anında) */
export const fxKamera = (fx: Fx[] | undefined, view: string, tg: number) => {
  let z = 1;
  for (const [t, tur, v, , , g] of fx ?? []) {
    if (tur !== "cakma" || (v !== "*" && v !== view) || tg < t) continue;
    const u = tg - t;
    z += 0.05 * (g ?? 1) * Math.exp(-u * 9) * Math.cos(u * 30);
  }
  return z;
};

/** dünya koordinatında (kamera içinde) çizilen efektler */
export const AnimeFxDunya: React.FC<{ fx?: Fx[]; view: string; tg: number; f: number }> = ({ fx, view, tg, f }) => {
  const list = fxAktif(fx, view, tg).filter(([, tur]) => tur !== "cakma" && tur !== "hiz");
  if (!list.length) return null;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {list.map(([t, tur, , x, y, s0, sr], i) => {
        const s = s0 ?? 1;
        const d = sr ?? SURE[tur];
        const u = (tg - t) / d;
        const cik = clamp01((1 - u) / 0.15); // son %15'te söner
        const key = `${tur}${i}`;
        if (tur === "ter") {
          // büyük anime ter damlası: şakaktan "pop" ile belirir, yavaşça aşağı kayar
          const sc = s * pop(clamp01(u * 3));
          return (
            <g key={key} transform={`translate(${x} ${y + 40 * s * u}) scale(${sc}) rotate(-12)`} opacity={cik}>
              <path d="M 0 -62 C 18 -30 34 -4 34 16 C 34 36 18 50 0 50 C -18 50 -34 36 -34 16 C -34 -4 -18 -30 0 -62 Z" fill="#bfe6ff" stroke={ICI} strokeWidth={5} />
              <path d="M -16 6 C -18 22 -10 32 0 36" stroke="#fff" strokeWidth={7} strokeLinecap="round" fill="none" />
            </g>
          );
        }
        if (tur === "sok") {
          // şok/umutsuzluk: başın üstünden inen dikey çizgiler + üstte mavi gölge
          const ac = clamp01(u * 4) * cik;
          return (
            <g key={key} opacity={ac}>
              <defs>
                <linearGradient id={`sokG${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4aa8" stopOpacity={0.55} /><stop offset="1" stopColor="#3a4aa8" stopOpacity={0} /></linearGradient>
              </defs>
              <rect x={x - 130 * s} y={y - 170 * s} width={260 * s} height={190 * s} fill={`url(#sokG${i})`} style={{ mixBlendMode: "multiply" }} />
              {[-100, -66, -34, 0, 34, 66, 100].map((dx, j) => {
                const L = (70 + 50 * random(`sk${j}`)) * s * clamp01(u * 5 - j * 0.12);
                return <path key={j} d={`M ${x + dx * s} ${y - 120 * s} v ${L}`} stroke={ICI} strokeWidth={5 * s} strokeLinecap="round" opacity={0.75} />;
              })}
            </g>
          );
        }
        if (tur === "unlem") {
          const sc = s * pop(clamp01(u * 2.5));
          const sallan = 8 * Math.sin(u * 22) * Math.exp(-u * 4);
          return (
            <g key={key} transform={`translate(${x} ${y}) rotate(${sallan}) scale(${sc})`} opacity={cik}>
              <path d="M -16 -96 L 16 -96 L 9 -10 L -9 -10 Z" fill="#ffe14a" stroke={ICI} strokeWidth={6} strokeLinejoin="round" />
              <circle cx={0} cy={16} r={12} fill="#ffe14a" stroke={ICI} strokeWidth={6} />
              {[-1, 1].map((k) => <path key={k} d={`M ${k * 34} -82 l ${k * 22} -16 M ${k * 40} -52 l ${k * 26} -2`} stroke={ICI} strokeWidth={5} strokeLinecap="round" />)}
            </g>
          );
        }
        if (tur === "ofke") {
          // öfke damarı: dört kıvrık köşe, nabız gibi atar
          const nabiz = 1 + 0.14 * Math.max(0, Math.sin(tg * 18));
          const sc = s * pop(clamp01(u * 3)) * nabiz;
          return (
            <g key={key} transform={`translate(${x} ${y}) scale(${sc})`} opacity={cik}>
              {[0, 90, 180, 270].map((r) => (
                <path key={r} transform={`rotate(${r})`} d="M 8 -30 C 8 -14 14 -8 30 -8" stroke="#e8283c" strokeWidth={11} strokeLinecap="round" fill="none" />
              ))}
            </g>
          );
        }
        if (tur === "kalp") {
          // kalpler: farklı hızlarda yükselir, sallanır, patlayarak söner
          return (
            <g key={key} opacity={cik}>
              {[0, 1, 2, 3, 4].map((j) => {
                const gec = j * 0.1;
                const v = clamp01((u - gec) / (1 - gec));
                if (v <= 0) return null;
                const rx = (random(`kp${j}`) - 0.5) * 260 * s;
                const yy = y - v * (180 + 120 * random(`ky${j}`)) * s;
                const xx = x + rx + 18 * s * Math.sin(v * 9 + j);
                const sc = s * (0.55 + 0.4 * random(`ks${j}`)) * pop(clamp01(v * 3));
                return (
                  <path key={j} transform={`translate(${xx} ${yy}) scale(${sc}) rotate(${(random(`kr${j}`) - 0.5) * 30})`}
                    d="M 0 18 C -30 -4 -34 -28 -16 -34 C -6 -37 0 -30 0 -22 C 0 -30 6 -37 16 -34 C 34 -28 30 -4 0 18 Z" fill="#ff5c8a" stroke={ICI} strokeWidth={4} />
                );
              })}
            </g>
          );
        }
        if (tur === "toz") {
          // çarpma tozu: vuruş noktasından iki yana fışkıran 2+2 yumuşak bulutçuk; hızla açılıp söner
          const e = 1 - Math.pow(1 - clamp01(u), 3);
          return (
            <g key={key} opacity={0.75 * (1 - u)}>
              {[-1, 1].map((k) => [0, 1].map((j) => (
                <ellipse key={`${k}${j}`} cx={x + k * (20 + (60 + 40 * j) * e) * s} cy={y - (6 + (18 + 22 * j) * e) * s}
                  rx={(10 + 8 * j) * s * (0.7 + e)} ry={(7 + 5 * j) * s * (0.7 + e)} fill="#f6f1e8" />
              )))}
            </g>
          );
        }
        if (tur === "titres") {
          // titreşim yayları: ellerin DIŞ yanlarında kısa "))" (x,y: iki elin ortası; s: aralık ölçeği)
          return (
            <g key={key} opacity={cik} stroke={ICI} strokeWidth={5} strokeLinecap="round" fill="none">
              {[-1, 1].map((k) => [0, 1].map((j) => {
                const ox = x + k * (150 + 22 * j + 20 * u) * s, R = (22 + 10 * j) * s;
                return <path key={`${k}${j}`} d={`M ${ox} ${y - R} Q ${ox + k * R * 0.55} ${y} ${ox} ${y + R}`} opacity={1 - j * 0.3} />;
              }))}
            </g>
          );
        }
        if (tur === "dokuntu") {
          // sarsıntıda kapı kasasının üstünden dökülen sıva tozu: ince zerreler düşer, hafif salınır (x,y: kasa üstü, s: genişlik ölçeği)
          return (
            <g key={key}>
              {Array.from({ length: 26 }, (_, j) => {
                const gec = random(`dk${j}`) * 0.35, v = (tg - t - gec) / (d - gec);
                if (v <= 0 || v >= 1) return null;
                const dx = (random(`dx${j}`) - 0.5) * 360 * s + 10 * Math.sin(v * 7 + j);
                const dy = v * v * (380 + 240 * random(`dy${j}`)) * s;
                const r = (1.6 + 2.6 * random(`dr${j}`)) * s;
                return <circle key={j} cx={x + dx} cy={y + dy} r={r} fill="#e8e2d4" opacity={0.85 * (1 - v)} />;
              })}
              <ellipse cx={x} cy={y + 30 * s * u} rx={190 * s * (0.6 + u)} ry={26 * s * (0.6 + u)} fill="#e8e2d4" opacity={0.28 * (1 - u)} />
            </g>
          );
        }
        if (tur === "kizar") {
          // utanma/aşk kızarıklığı: yanakta çapraz çizgiler
          const ac = clamp01(u * 4) * cik;
          return (
            <g key={key} opacity={ac}>
              {[-1, 1].map((k) => (
                <g key={k} transform={`translate(${x + k * 62 * s} ${y})`}>
                  <ellipse cx={0} cy={0} rx={34 * s} ry={14 * s} fill="#ff7a9a" opacity={0.45} />
                  {[-14, 0, 14].map((dx) => <path key={dx} d={`M ${(dx - 6) * s} ${8 * s} l ${12 * s} ${-16 * s}`} stroke="#d0405c" strokeWidth={3.5 * s} strokeLinecap="round" />)}
                </g>
              ))}
            </g>
          );
        }
        return null;
      })}
    </svg>
  );
};

/** ekran koordinatında (kamera dışında) çizilen efektler: çarpma karesi ve manga hız çizgileri */
export const AnimeFxEkran: React.FC<{ fx?: Fx[]; view: string; tg: number; f: number }> = ({ fx, view, tg, f }) => {
  const list = fxAktif(fx, view, tg).filter(([, tur]) => tur === "cakma" || tur === "hiz");
  if (!list.length) return null;
  return (
    <>
      {list.map(([t, tur, , x, y, s0, sr], i) => {
        const s = s0 ?? 1;
        const d = sr ?? SURE[tur];
        const u = (tg - t) / d;
        const ikili = Math.floor(f / 2); // hız çizgileri "ikişerli" titrer (el çizimi hissi)
        const cizgiler = (n: number, ic: number, renk: string, op: number) => (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: n }, (_, j) => {
              const a = (j / n) * Math.PI * 2 + random(`hz${j}-${ikili}`) * 0.12;
              const r0 = ic * (0.85 + 0.35 * random(`hr${j}-${ikili}`)), r1 = 1500;
              const w = 3 + 9 * random(`hw${j}-${ikili}`);
              const ca = Math.cos(a), sa = Math.sin(a), na = -sa, nb = ca;
              return (
                <path key={j} d={`M ${x + ca * r0} ${y + sa * r0} L ${x + ca * r1 + na * w * 3} ${y + sa * r1 + nb * w * 3} L ${x + ca * r1 - na * w * 3} ${y + sa * r1 - nb * w * 3} Z`} fill={renk} opacity={op} />
              );
            })}
          </svg>
        );
        if (tur === "cakma") {
          // 1. kare: renkler ters (beyaz fark), 2-3. kare: beyaz zemin üstünde siyah patlama çizgileri, sonra normale döner
          const k = Math.floor(u * 3);
          if (k === 0) return <div key={i} style={{ position: "absolute", inset: 0, background: "#fff", mixBlendMode: "difference" }} />;
          return (
            <div key={i} style={{ position: "absolute", inset: 0 }}>
              <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: k === 1 ? 0.55 : 0.25 }} />
              {cizgiler(46, 260 * s, ICI, k === 1 ? 0.9 : 0.5)}
            </div>
          );
        }
        // hiz: kenarlardan merkeze manga odak çizgileri
        const ac = clamp01(u * 6) * clamp01((1 - u) / 0.25);
        return <div key={i} style={{ position: "absolute", inset: 0, opacity: ac }}>{cizgiler(64, 420 * s, "#ffffff", 0.55)}</div>;
      })}
    </>
  );
};
