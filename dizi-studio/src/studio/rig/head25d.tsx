/* =====================================================================================
 * 2.5D baş ve gövde (her açıdan görünüş): rig'in 400x1000 birim koordinatında çizilir.
 *
 *   aci (derece): 0 = önden (rig ile birebir), 180 = arkadan, -90 = profil (burun kadraj soluna),
 *   +90 = profil (burun kadraj sağına). Sürekli değer verilebilir (ör. 180 → 350 dönüş).
 *
 *   Yöntem (silindir/elipsoit izdüşümü): kafa, yüksekliğe (y) göre yarı genişliği a(y), yarı derinliği c(y)
 *   ve merkez kayması z0(y) olan yatay elips halkalardan oluşur. Yüzeydeki her öğenin bir boylamı (λ) vardır:
 *     x = a·sinλ, z = z0 + c·cosλ  →  ekran X = x·cosφ + z·sinφ,  görünürlük: dönmüş normalin z'si > 0.
 *   Yüz öğeleri (göz, kaş, ağız, yanak, sivilce) rig'in kendi bileşenleriyle çizilir; genişlikleri
 *   bakış açısına göre daralır (önden 1). Saç: silüet saç rengiyle dolar, üstüne saç çizgisinin altında
 *   kalan ten bölgesi çizilir. At kuyruğu 3B bir eğri olarak sarkar ve yaylanır.
 * ===================================================================================== */
import React from "react";
import { Brow, EMOTION_FACE, Eye, Mouth, OUT } from "./face";
import type { Emotion, Look, Viseme } from "./types";

const D2R = Math.PI / 180;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const norm180 = (l: number) => ((((l + 180) % 360) + 360) % 360) - 180;

/* ---------------- kafa geometrisi (rig önden yüz yolu ile uyumlu) ---------------- */
const TOP = 86, CHIN = 312, CX = 200;
const ringA = (y: number) => (y < 150 ? 86 * Math.sqrt(Math.max(0, 1 - ((150 - y) / 64) ** 2)) : y <= 240 ? 86 : 86 * Math.max(0, 1 - ((y - 240) / 72) ** 2) ** 0.9);
const ringC = (y: number) => (y < 150 ? 100 * Math.sqrt(Math.max(0, 1 - ((150 - y) / 64) ** 2)) : y <= 240 ? 100 : 100 * Math.max(0, 1 - ((y - 240) / 72) ** 2) ** 0.6);
const ringZ = (y: number) => (y <= 240 ? -12 : -12 + 34 * ((y - 240) / 72));
// saç hacmi (dış halka): tepede y=78'e kadar çıkar
const hairA = (y: number) => (y < 150 ? 93 * Math.sqrt(Math.max(0, 1 - ((150 - y) / 72) ** 2)) : ringA(y) + 7);
const hairC = (y: number) => (y < 150 ? 109 * Math.sqrt(Math.max(0, 1 - ((150 - y) / 72) ** 2)) : ringC(y) + 9);
/** saç çizgisi: önde alında 118, şakakta 190, arkada ensede 290 */
export const hairlineY = (lam: number) => {
  const u = Math.abs(norm180(lam));
  return u <= 90 ? 118 + 72 * (u / 90) ** 1.6 : 200 + 118 * ((u - 90) / 90) ** 0.35;
};

type P = { X: number; Z: number; nz: number };
/** halka (A, C, Z0) üstünde λ boylamlı noktanın izdüşümü */
const proj = (lam: number, A: number, C: number, Z0: number, phi: number, out = 0): P => {
  const l = lam * D2R, f = phi * D2R;
  const x = (A + out) * Math.sin(l), z = Z0 + (C + out) * Math.cos(l);
  let nx = Math.sin(l) / Math.max(1, A), nzh = Math.cos(l) / Math.max(1, C);
  const n = Math.hypot(nx, nzh) || 1;
  nx /= n; nzh /= n;
  return { X: x * Math.cos(f) + z * Math.sin(f), Z: -x * Math.sin(f) + z * Math.cos(f), nz: -nx * Math.sin(f) + nzh * Math.cos(f) };
};
/** halkanın sağ/sol kenar (silüet) noktası */
const limb = (A: number, C: number, Z0: number, phi: number, side: 1 | -1) => {
  const f = phi * D2R;
  const R = Math.hypot(A * Math.cos(f), C * Math.sin(f));
  const lamR = Math.atan2(A * Math.cos(f), C * Math.sin(f)) / D2R; // X'i en büyük yapan boylam
  return { X: Z0 * Math.sin(f) + side * R, lam: side === 1 ? lamR : lamR + 180 };
};
const surfP = (lam: number, y: number, phi: number, out = 0) => proj(lam, ringA(y), ringC(y), ringZ(y), phi, out);

const pts = (a: [number, number][]) => a.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

export type Bas25DProps = {
  look: Look;
  /** derece: 0 önden, 180 arkadan, -90 profil (burun sola) */
  aci: number;
  emotion?: Emotion;
  /** bakış: -1..1 (göze göre); verilmezse düz ileri */
  lookX?: number;
  lookY?: number;
  /** göz kapanması 0..1 */
  kapali?: number;
  pale?: number;
  viseme?: Viseme | null;
  /** saç dağınıklığı 0..1 (kopmuş teller) */
  dagin?: number;
  /** at kuyruğu: yanal sallanma (birim) ve ileri/geri savrulma (derece, + yüzün yönüne) */
  kuyrukSal?: number;
  kuyrukIleri?: number;
  /** ışık: 0..1 yüzün aldığı sıcak-beyaz (dükkân) ışığı; kalan kısmı soğuk mavi */
  isik?: number;
  /** saç konturunda mavi kenar ışığı 0..1 */
  kenar?: number;
  uid: string;
  /** "arka": yalnız başın arkasında kalan at kuyruğu (gövdeden ÖNCE çizilir); "on": boyun + baş (vars.) */
  katman?: "arka" | "on";
  /** 7/24 B5 (opt-in): şok gözü 0..1 (göz akı büyür, bebek küçülür) */
  sok?: number;
};

/** Her açıdan baş: boyun dahil (gövdeden önce değil, gövdeden SONRA çizilir). */
export const Bas25D: React.FC<Bas25DProps> = ({ look, aci, emotion = "notr", lookX = 0, lookY = 0, kapali = 0, pale = 0, viseme = null, dagin = 0, kuyrukSal = 0, kuyrukIleri = 0, isik = 1, kenar = 0, uid, katman = "on", sok = 0 }) => {
  const phi = aci;
  const f = phi * D2R;
  const face = EMOTION_FACE[emotion];
  const hairC1 = look.hair.color, hairS = look.hair.shade;
  const skin = look.skin;

  /* ---- silüet (saç hacmiyle) ---- */
  const R: [number, number][] = [], L: [number, number][] = [];
  for (let y = 78; y <= CHIN; y += 3) {
    for (const side of [1, -1] as const) {
      let X = -Infinity * side;
      let hasBase = false;
      if (y >= TOP) {
        const b = limb(ringA(y), ringC(y), ringZ(y), phi, side);
        X = b.X;
        hasBase = true;
        // saç bu yükseklikte kenarda mı? (geçiş yumuşak)
        const hy = hairlineY(b.lam);
        const k = smooth(hy + 8, hy - 8, y);
        if (k > 0) {
          const h = limb(hairA(y), hairC(y), ringZ(y), phi, side).X;
          X = X + (h - X) * k;
        }
      }
      if (!hasBase) X = limb(hairA(y), hairC(y), ringZ(y), phi, side).X;
      (side === 1 ? R : L).push([CX + X, y]);
    }
  }
  const silD = `${pts([...R, ...L.reverse()])} Z`;

  /* ---- ten bölgesi: görünen saç çizgisi + iki kenar ---- */
  const N = 120;
  const smp = new Array(N).fill(0).map((_, i) => {
    const lam = -180 + (360 * i) / N;
    const y = hairlineY(lam);
    const p = surfP(lam, y, phi);
    return { lam, y, X: CX + p.X, vis: p.nz > 0.0 };
  });
  let skinD = "", hairlineD = "";
  const visCount = smp.filter((s) => s.vis).length;
  if (visCount >= 2) {
    // dairesel ardışık görünen dizi
    let start = 0;
    for (let i = 0; i < N; i++) if (smp[i].vis && !smp[(i - 1 + N) % N].vis) { start = i; break; }
    const run: typeof smp = [];
    for (let k = 0; k < N; k++) { const s = smp[(start + k) % N]; if (!s.vis) break; run.push(s); }
    if (run.length >= 2) {
      if (run[0].X > run[run.length - 1].X) run.reverse();
      const top: [number, number][] = run.map((s) => [s.X, s.y]);
      const yR = run[run.length - 1].y, yL = run[0].y;
      const right: [number, number][] = [], left: [number, number][] = [];
      for (let y = yR; y <= CHIN; y += 4) right.push([CX + limb(ringA(y), ringC(y), ringZ(y), phi, 1).X, y]);
      for (let y = CHIN; y >= yL; y -= 4) left.push([CX + limb(ringA(y), ringC(y), ringZ(y), phi, -1).X, y]);
      skinD = `${pts([...top, ...right, [CX + limb(ringA(CHIN - 1), ringC(CHIN - 1), ringZ(CHIN - 1), phi, 1).X, CHIN], ...left])} Z`;
      hairlineD = pts(top);
    }
  }

  /* ---- yüz öğeleri ---- */
  const feat = (lam: number, y: number, out = 0) => {
    const p = surfP(lam, y, phi, out);
    const p0 = surfP(lam, y, 0, out);
    const sx = Math.max(0, Math.min(1.15, p.nz / Math.max(0.05, p0.nz)));
    return { X: CX + p.X, sx, a: smooth(0.04, 0.22, p.nz), nz: p.nz };
  };
  const LAM_EYE = 27.7, LAM_CHEEK = 37.2;
  const eyeL = feat(-LAM_EYE, 198), eyeR = feat(LAM_EYE, 198);
  const brL = feat(-LAM_EYE, 160), brR = feat(LAM_EYE, 160);
  const mouth = feat(0, 274);
  const chL = feat(-LAM_CHEEK, 238), chR = feat(LAM_CHEEK, 238);
  const eyeOpen = face.eyeOpen * (1 - kapali);
  const blushAmt = (look.blush === false ? 0 : 1) * face.blush * (1 - pale);
  const browColor = look.hair.color;
  // burun: önden rig çizgisi; yandan 3B çıkıntı
  const prof = smooth(0.22, 0.6, Math.abs(Math.sin(f)));
  const nB = surfP(0, 202, phi), nT = surfP(0, 238, phi, 21), nN = surfP(0, 249, phi, 5), nW = surfP(9, 243, phi, 6);
  const noseVis = surfP(0, 230, phi).nz > -0.15;
  const noseFront = surfP(0, 230, phi);
  // kulaklar
  const ear = (side: 1 | -1) => {
    const lam = 92 * side;
    const p = surfP(lam, 210, phi, 3);
    const l = lam * D2R;
    const nZ = -Math.sin(l) * Math.sin(f) + Math.cos(l) * Math.cos(f);
    return { X: CX + p.X, nZ, rx: 6 + 10 * clamp01(nZ + 0.2), behind: nZ < 0.12, vis: nZ > -0.45 };
  };
  const ears = [ear(1), ear(-1)];
  const EarG = ({ e }: { e: ReturnType<typeof ear> }) => (
    <g>
      <ellipse cx={e.X} cy={211} rx={e.rx} ry={22} fill={skin} stroke={OUT} strokeWidth={4} />
      {e.nZ > 0.3 ? <path d={`M ${e.X - e.rx * 0.35} 200 q ${e.rx * 0.5} 6 ${e.rx * 0.1} 22`} stroke={look.skinShade} strokeWidth={4} fill="none" strokeLinecap="round" /> : null}
    </g>
  );

  /* ---- at kuyruğu (3B eğri) ---- */
  const tail = (() => {
    if (look.hair.style !== "ponytail") return null;
    const root = { lam: 180, y: 140 };
    const rp = proj(root.lam, hairA(root.y), hairC(root.y), ringZ(root.y), phi);
    const rVis = rp.nz > 0;
    const ileri = kuyrukIleri * D2R;
    const segs: [number, number][] = [];
    const widths: number[] = [];
    const M = 14;
    for (let i = 0; i <= M; i++) {
      const s = i / M;
      // kafa çerçevesinde: kökten geriye çıkar, aşağı sarkar; ucu hafif kadraj sağına (rig ile uyumlu)
      // kafa çerçevesi: x (önden kadraj sağı), y aşağı, z yüzün yönü. ileri > 0: kuyruk yüz yönüne savrulur
      const down = 250 * s ** 1.15;
      const back = 30 * Math.sin(Math.min(1, s * 1.6) * Math.PI * 0.5) - 8 * s;
      const y = root.y + down * Math.cos(ileri);
      const z = ringZ(root.y) - (hairC(root.y) - 6) - back + down * Math.sin(ileri);
      const x = 40 * s ** 1.6 + kuyrukSal * s ** 1.4;
      const X = x * Math.cos(f) + z * Math.sin(f);
      segs.push([CX + X, y]);
      widths.push(19 * (1 - s) ** 0.8 + 4 + 6 * Math.sin(s * Math.PI));
    }
    // kalın şerit poligonu (ekran normalleriyle)
    const lft: [number, number][] = [], rgt: [number, number][] = [];
    for (let i = 0; i <= M; i++) {
      const a = segs[Math.max(0, i - 1)], b = segs[Math.min(M, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1];
      const n = Math.hypot(tx, ty) || 1;
      tx /= n; ty /= n;
      lft.push([segs[i][0] - ty * widths[i], segs[i][1] + tx * widths[i]]);
      rgt.push([segs[i][0] + ty * widths[i], segs[i][1] - tx * widths[i]]);
    }
    const d = `${pts([...lft, ...rgt.reverse()])} Z`;
    const strand = pts(segs.slice(2, M - 1).map((p, i) => [p[0] + Math.sin(i) * 3, p[1]]));
    return { d, strand, root: { X: CX + rp.X, Y: root.y }, rVis, front: rVis };
  })();

  /* ---- saç çizgileri (alından kuyruk köküne yüzey üstünde) ---- */
  const strands: string[] = [];
  for (const l0 of [-62, -34, -8, 18, 44, 70, 118, 150, -118, -150]) {
    const seg: [number, number][] = [];
    let open = false;
    const target = 180 * Math.sign(l0 || 1);
    for (let i = 0; i <= 18; i++) {
      const s = i / 18;
      const lam = l0 + (target - l0) * s;
      const yStart = Math.abs(l0) > 90 ? hairlineY(l0) - 6 : hairlineY(l0) - 4;
      const y = yStart + (140 - yStart) * s - (Math.abs(l0) < 90 ? 46 : 8) * Math.sin(Math.PI * s);
      const yy = Math.max(84, y);
      const p = proj(lam, hairA(yy) - 3, hairC(yy) - 3, ringZ(yy), phi);
      if (p.nz > 0.08) {
        seg.push([CX + p.X, yy]);
        open = true;
      } else if (open) break;
    }
    if (seg.length > 2) strands.push(pts(seg));
  }

  /* ---- ışık ---- */
  const cool = (1 - isik) * 0.6;
  const shadeSide = Math.sin(f) >= 0 ? -1 : 1; // gölge, yüzün baktığı yönün tersindeki kenarda
  const clipId = `b25${uid}`;

  const TailG = tail ? (
    <g>
      <path d={tail.d} fill={hairC1} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      <path d={tail.strand} stroke={hairS} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  ) : null;

  if (katman === "arka") return tail && !tail.front ? TailG : null;
  const neckCx = CX - 10 * Math.sin(f);
  // ense/çene altı teni: saçın gölgesinde (arkadan bakışta "yüz" gibi okunmasın)
  const back = clamp01(-Math.cos(f));
  return (
    <g>
      <defs>
        <clipPath id={clipId}><path d={silD} /></clipPath>
      </defs>
      {/* boyun (başın arkasında) */}
      <path d={`M ${neckCx - 21} 280 L ${neckCx - 22} 338 Q ${neckCx} 348 ${neckCx + 22} 338 L ${neckCx + 21} 280 Z`} fill={skin} stroke={OUT} strokeWidth={4} />
      <path d={`M ${neckCx - 21} 282 L ${neckCx + 21} 282 L ${neckCx + 21} 300 Q ${neckCx} ${306} ${neckCx - 21} 300 Z`} fill="#3a2418" opacity={0.18 + 0.2 * back} />
      {ears.map((e, i) => (e.vis && e.behind ? <EarG key={i} e={e} /> : null))}
      {/* silüet: saç rengi */}
      <path d={silD} fill={hairC1} />
      <g clipPath={`url(#${clipId})`}>
        {skinD ? <path d={skinD} fill={skin} /> : null}
        {skinD ? <path d={skinD} fill="#c9d6e0" opacity={pale * 0.45} /> : null}
        {/* soğuk ışık (kapıdan gelen şafak) ve kenar gölgesi */}
        {skinD ? <path d={skinD} fill="#4a6a9a" opacity={0.22 * cool} /> : null}
        {skinD ? <path d={skinD} fill="#2a1a14" opacity={0.22 * back * back} /> : null}
        <rect x={CX + shadeSide * 40 - (shadeSide < 0 ? 140 : 0)} y={60} width={140} height={280} fill="#000" opacity={0.07} />
        {/* saç akışı */}
        {strands.map((d, i) => <path key={i} d={d} stroke={hairS} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.75} />)}
        {hairlineD ? <path d={hairlineD} stroke={OUT} strokeWidth={3.2} fill="none" strokeLinejoin="round" opacity={0.9} /> : null}
        {/* yüz öğeleri */}
        <g opacity={chL.a * blushAmt}><ellipse cx={chL.X} cy={238} rx={19 * chL.sx} ry={10} fill="#ef8f8a" /></g>
        <g opacity={chR.a * blushAmt}><ellipse cx={chR.X} cy={238} rx={19 * chR.sx} ry={10} fill="#ef8f8a" /></g>
        {look.sivilce ? (() => {
          const s = feat(37.6, 240);
          return s.a > 0 ? (
            <g opacity={s.a}>
              <ellipse cx={s.X} cy={240} rx={17 * s.sx} ry={14} fill="#e8706a" opacity={0.45} />
              <ellipse cx={s.X} cy={240} rx={9 * s.sx} ry={9} fill="#d8524a" stroke="#9a2e28" strokeWidth={1.5} />
              <ellipse cx={s.X - 1 * s.sx} cy={238} rx={4 * s.sx} ry={4} fill="#fbf2d8" />
            </g>
          ) : null;
        })() : null}
        {[[eyeL, false], [eyeR, true]].map(([e, fl], i) => {
          const E = e as typeof eyeL;
          return E.a > 0 ? (
            <g key={i} opacity={E.a}>
              <Eye cx={E.X} cy={198} look={look} lookX={lookX} lookY={lookY} open={eyeOpen} smile={face.eyeSmile} pupil={face.pupil} squeeze={Math.max(0.12, E.sx)} flip={fl as boolean} uid={`${uid}e${i}`} sok={sok} />
            </g>
          ) : null;
        })}
        {[[brL, false], [brR, true]].map(([b, fl], i) => {
          const B = b as typeof brL;
          return B.a > 0 ? (
            <g key={i} opacity={B.a}>
              <Brow cx={B.X} cy={160} inner={face.browInner} outer={face.browOuter} lift={face.browLift} color={browColor} thick={6.5} squeeze={Math.max(0.15, B.sx)} flip={fl as boolean} />
            </g>
          ) : null;
        })}
        {mouth.a > 0 ? (
          <g opacity={mouth.a} transform={`translate(${mouth.X} 0) scale(${Math.max(0.15, mouth.sx)} 1)`}>
            <Mouth viseme={viseme} rest={face.mouth} cx={0} cy={274} amp={1.1} />
          </g>
        ) : null}
        {/* burun: önden çizgi */}
        {noseVis && noseFront.nz > 0 ? (
          <path d={`M ${CX + noseFront.X + 2} 214 Q ${CX + noseFront.X - 4 - Math.sin(f) * 8} 236 ${CX + noseFront.X + 4} 244`} fill="none" stroke={OUT} strokeWidth={3.5} strokeLinecap="round" opacity={(1 - prof) * smooth(0, 0.3, noseFront.nz)} />
        ) : null}
      </g>
      {/* burun profili: silüetin dışına taşar */}
      {noseVis && prof > 0.01 ? (
        <g opacity={prof}>
          <path d={`M ${CX + nB.X} 206 L ${CX + nT.X} 238 Q ${CX + nT.X + (nN.X - nT.X) * 0.2} 247 ${CX + nN.X} 248 L ${CX + nW.X} 242 Z`} fill={skin} />
          <path d={`M ${CX + nB.X} 206 L ${CX + nT.X} 238 Q ${CX + nT.X + (nN.X - nT.X) * 0.2} 247 ${CX + nN.X} 248`} fill="none" stroke={OUT} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
        </g>
      ) : null}
      {/* dış kontur + mavi kenar ışığı */}
      <path d={silD} fill="none" stroke="#8aa8d8" strokeWidth={10} opacity={0.45 * kenar} clipPath={`url(#${clipId})`} />
      <path d={silD} fill="none" stroke={OUT} strokeWidth={4.5} strokeLinejoin="round" />
      {ears.map((e, i) => (e.vis && !e.behind ? <EarG key={i} e={e} /> : null))}
      {/* kuyruk önde (arkadan bakışta) + toka */}
      {tail && tail.front ? TailG : null}
      {tail && tail.rVis ? <ellipse cx={tail.root.X} cy={tail.root.Y + 4} rx={15} ry={9} fill={look.outfit.accent ?? "#e05a6a"} stroke={OUT} strokeWidth={3} /> : null}
      {/* dağınık teller: önlük takılmasından kalan, başa yatık ince teller */}
      {dagin > 0 ? (
        <g opacity={dagin} fill="none" strokeLinecap="round">
          {[[0.18, -1, 0], [0.42, 1, 1], [0.3, 1, 2], [0.55, -1, 3]].map(([k, s, i]) => {
            const y = 96 + (k as number) * 110;
            const sd = s as 1 | -1;
            const ed = limb(hairA(y), hairC(y), ringZ(y), phi, sd).X;
            const x0 = CX + ed - sd * 6;
            return <path key={i} d={`M ${x0} ${y} q ${sd * 10} ${-4 - (i as number) * 2} ${sd * 13} ${8 + (i as number) * 3}`} stroke={(i as number) % 2 ? hairC1 : hairS} strokeWidth={3} />;
          })}
          {tail && tail.rVis ? <path d={`M ${tail.root.X - 8} ${tail.root.Y - 4} q -10 -12 -4 -22 M ${tail.root.X + 10} ${tail.root.Y} q 14 -6 16 -18`} stroke={hairC1} strokeWidth={3} /> : null}
        </g>
      ) : null}
    </g>
  );
};

export type Govde25DProps = {
  look: Look;
  /** gövdenin açısı (derece, Bas25D ile aynı kural). Şimdilik arkadan (±150..180) ve önden (0) çizilir. */
  aci: number;
  /** omuz kalkması (birim) */
  omuz?: number;
  /** 7/24 B5 (opt-in): kolları çizme (kollar dışarıda ayrıca çizilir) */
  kolYok?: boolean;
  uid: string;
};

/** Her açıdan gövde (elips kesitli): sırt/göğüs, kazak dikişleri, kollar. aci: Bas25D ile aynı kural
 *  (0 önden, 180 arkadan, 270 = yüz kadraj soluna). Yakın kollar gövdenin önünde, uzaktaki arkasında çizilir. */
export const Govde25D: React.FC<Govde25DProps> = ({ look, aci, omuz = 0, kolYok = false }) => {
  const wx = look.build === "slim" ? 0.9 : look.build === "heavy" ? 1.24 : 1;
  const out = look.outfit;
  const f = aci * D2R;
  const cf = Math.cos(f), sf = Math.sin(f);
  // kesit yarı genişlik W(y) ve yarı derinlik D(y)
  const Wy = (y: number) => wx * (y < 360 ? 70 + 12 * ((y - 330) / 30) : y < 470 ? 82 - 2 * ((y - 360) / 110) : 80 - 12 * ((y - 470) / 170));
  const Dy = (y: number) => Wy(y) * 0.62;
  const ext = (y: number) => Math.hypot(Wy(y) * cf, Dy(y) * sf);
  const ys = [330, 340, 360, 400, 440, 470, 520, 580, 640];
  const R: [number, number][] = ys.map((y): [number, number] => [200 + ext(y), y === 330 ? 330 - omuz : y]);
  const L: [number, number][] = ys.map((y): [number, number] => [200 - ext(y), y === 330 ? 330 - omuz : y]).reverse();
  const body = `M ${200 - ext(330) * 0.7} ${330 - omuz} Q 200 ${316 - omuz} ${200 + ext(330) * 0.7} ${330 - omuz} ${pts(R).replace("M", "L")} ${pts(L).replace("M", "L")} Z`;
  // yüzey noktası (λ: 0 göğüs ortası, 180 sırt ortası)
  const sp = (lam: number, y: number) => {
    const l = lam * D2R;
    const x = Wy(y) * Math.sin(l), z = Dy(y) * Math.cos(l);
    let nx = Math.sin(l) / Wy(y), nz = Math.cos(l) / Dy(y);
    const n = Math.hypot(nx, nz);
    nx /= n; nz /= n;
    return { X: 200 + x * cf + z * sf, Z: -x * sf + z * cf, nz: -nx * sf + nz * cf };
  };
  const seam = (lam: number, y1: number, y2: number) => {
    const a: [number, number][] = [];
    for (let y = y1; y <= y2; y += 20) { const p = sp(lam, y); if (p.nz > 0.05) a.push([p.X, y]); }
    return a.length > 1 ? pts(a) : "";
  };
  // kollar: omuz noktası λ=±90 (biraz dışarıda), sarkık
  const arm = (side: 1 | -1) => {
    const p = sp(90 * side, 360);
    const X = 200 + (Wy(360) + 4) * side * cf;
    const Z = -(Wy(360) + 4) * side * sf;
    const tilt = side * (4 + 3 * Math.abs(cf));
    const d = `M ${X - 23} ${352 - omuz} A 23 23 0 0 1 ${X + 23} ${352 - omuz} L ${X + 21 + tilt} 640 L ${X - 21 + tilt} 640 Z`;
    return { d, Z, X, p };
  };
  const arms = [arm(1), arm(-1)];
  const ArmG = ({ a }: { a: (typeof arms)[number] }) => (
    <g>
      <path d={a.d} fill={out.top} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M ${a.X} ${370 - omuz} L ${a.X + 2} 630`} stroke={out.topShade} strokeWidth={4} opacity={0.5} />
    </g>
  );
  const backSeam = seam(180, 360, 600);
  const blade = (lam: number) => { const p = sp(lam, 425); return p.nz > 0.15 ? `M ${p.X - 17} 418 q 17 22 34 6` : ""; };
  const neckBack = sp(180, 336), neckFront = sp(0, 336);
  return (
    <g>
      {kolYok ? null : arms.map((a, i) => (a.Z < 0 ? <ArmG key={i} a={a} /> : null))}
      <path d={body} fill={out.top} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      {/* gölge tarafı */}
      <path d={body} fill="#000" opacity={0.08 * Math.abs(sf)} />
      {backSeam ? <path d={backSeam} stroke={out.topShade} strokeWidth={4} fill="none" opacity={0.45} /> : null}
      {[150, -150].map((l) => { const d = blade(l); return d ? <path key={l} d={d} stroke={out.topShade} strokeWidth={5} fill="none" opacity={0.75} /> : null; })}
      <path d={`M ${200 - ext(612) + 4} 612 Q 200 624 ${200 + ext(612) - 4} 612`} stroke={out.topShade} strokeWidth={6} fill="none" />
      {neckBack.nz > 0.1 ? <path d={`M ${neckBack.X - 22} ${334 - omuz} Q ${neckBack.X} ${344 - omuz} ${neckBack.X + 22} ${334 - omuz}`} stroke={OUT} strokeWidth={3.5} fill="none" opacity={Math.min(1, neckBack.nz * 2)} /> : null}
      {neckFront.nz > 0.1 ? <path d={`M ${neckFront.X - 28} ${330 - omuz} Q ${neckFront.X} ${362 - omuz} ${neckFront.X + 28} ${330 - omuz}`} stroke={OUT} strokeWidth={4} fill="none" opacity={Math.min(1, neckFront.nz * 2)} /> : null}
      {kolYok ? null : arms.map((a, i) => (a.Z >= 0 ? <ArmG key={i} a={a} /> : null))}
    </g>
  );
};

/** Boyun (her açıdan aynı silindir; başın arkasında, gövdenin önünde çizilir) */
export const Boyun25D: React.FC<{ look: Look; aci: number }> = ({ look, aci }) => {
  const f = aci * D2R;
  const cx = 200 + -10 * Math.sin(f);
  return (
    <g>
      <path d={`M ${cx - 21} 280 L ${cx - 22} 338 Q ${cx} 348 ${cx + 22} 338 L ${cx + 21} 280 Z`} fill={look.skin} stroke={OUT} strokeWidth={4} />
      <path d={`M ${cx - 19} 300 Q ${cx} 310 ${cx + 19} 300`} fill="none" stroke={look.skinShade} strokeWidth={6} opacity={0.7} />
    </g>
  );
};
