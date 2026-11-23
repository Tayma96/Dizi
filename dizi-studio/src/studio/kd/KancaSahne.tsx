import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { castById } from "../cast";
import { BeyazOda, Mizrak, petekBul, proj, type Kam, type OdaDurum, type OdaKarakter } from "../sets/beyazoda";
import { KD_BASLIK } from "../engine/KirmiziDugme";
import { SANS } from "../../dizi/fonts";
import { egri, serit, Hacim, type P, type Isik } from "./cizim";

/* =====================================================================================
 * Kırmızı Düğme · B1 AÇILIŞ SAHNESİ (kanca), dizi sahnesi olarak (kompozisyon KDKancaSahne)
 * Kullanıcının metni: göz kamerası; önümüzde kırmızı düğmelerden biri; basarken yandan biri "duuuur!" diye bağırır;
 * basılmış olur; karşısındaki bölme açılır ve göğse doğru bir mızrak fırlar; sonra dizi başlar. Düğmeye basan: kurye.
 *
 * Çekim planı (30 fps):
 *  Ç1  0-21  POV orta-genel: oda, duvarda düğmeler, arkada diğerleri (kim nerede kurulur); kuryenin iki kolu,
 *            sağ eli düğmeye uzanır, kamera elde ve nefes alır. 13: "Duuuur!" (soldan; altyazı)
 *  Ç2 22-31  YAKIN (tek yakın, doruk): eldivenli parmak mantar düğmeye basar; başlık çöker, LED, sayaç döner (klik A @24)
 *  Ç3 32-61  POV: düğmenin üstündeki (karşıdaki) bölmenin kilidi açılır, kırmızı ikaz ışığı; 42'de mızrak
 *            (ilk 6 kare ağır, sonra hızlanır), kamera ucu izler, kol geri çekilir.
 *  62-65     sert kesme, siyah, sessiz
 *  66-110    başlık: siyah üstüne "KIRMIZI DÜĞME" (74'te aynı klik ile belirir); fragman efekti yok.
 * ===================================================================================== */

export const KS = { dur: 13, yakin: 22, klik: 24, pov2: 32, kilit: 33, kanat: 34, mizrak: 42, kes: 62, baslik: 66, yazi: 74, son: 110 };

const cl = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => { const x = cl(v); return x * x * (3 - 2 * x); };
const titre = (frame: number, g: number) => ({ sx: (random(`tx${frame}`) - 0.5) * 2 * g, sy: (random(`ty${frame}`) - 0.5) * 2 * g });
/** elde kamera: yavaş nefes salınımı (düşük frekans) */
const elde = (frame: number, g = 1) => ({ sx: Math.sin(frame / 11) * 4 * g + Math.sin(frame / 5.3) * 1.5 * g, sy: Math.sin(frame / 13 + 1) * 5 * g });

/* ---------------- kurye kolu (yeni çizim dili: fırça kontur + ışıklı hacim) ---------------- */
const MONT = "#18a39a", MONT_G = "#0f6e69", MONT_C = "#063a38";
const KOYU = "#1f262b", KOYU_C = "#0a0e10";
const ELDIVEN = "#2a2f35", ELDIVEN_G = "#16191d", ELDIVEN_C = "#06080a";
const ODA_ISIK: Isik = { yon: [0.25, 1], golge: 26, kenar: 5, kenarRenk: "#ffffff", kenarOp: 0.55 };

const don = (p: P, a: number, s: number, o: P): P => {
  const c = Math.cos(a), si = Math.sin(a);
  return [o[0] + (p[0] * c - p[1] * si) * s, o[1] + (p[0] * si + p[1] * c) * s];
};

/** Sağ (veya sol) kol: `bilek` ekrandaki bilek noktası, `aci` kolun yönü (rad; 0 = yukarı), `isaret` işaret parmağı açık mı. */
const KuryeKol: React.FC<{ id: string; bilek: P; aci: number; s?: number; isaret?: boolean; bas?: number; sol?: boolean }> = ({ id, bilek, aci, s = 1, isaret = true, bas = 0, sol }) => {
  const m = sol ? -1 : 1;
  const T = (pts: P[]) => pts.map(([x, y]) => don([x * m, y], aci, s, bilek));
  const TW = (pts: [number, number, number][]): [number, number, number][] => pts.map(([x, y, w]) => { const q = don([x * m, y], aci, s, bilek); return [q[0], q[1], w * s]; });
  const kolS: P[] = T([[-76, 40], [78, 40], [96, 200], [124, 420], [160, 900], [-160, 900], [-124, 420], [-96, 200]]);
  const manset: P[] = T([[-80, 22], [80, 22], [84, 52], [-84, 52]]);
  const serit1: P[] = T([[-108, 300], [108, 300], [114, 344], [-114, 344]]);
  const el: P[] = T([[-58, 14], [-70, -50], [-58, -112], [-20, -138], [30, -134], [62, -96], [64, -30], [40, 18]]);
  const parmakBoy = 105 * (1 - 0.18 * bas);
  return (
    <g>
      <Hacim id={`${id}k`} pts={kolS} dolgu={MONT} golge={MONT_G} cizgi={MONT_C} isik={ODA_ISIK} ince={3} kalin={9}>
        {/* omuz boyunduruğu tonu (koyu) kolun dibinde */}
        <path d={egri(T([[-170, 640], [170, 640], [170, 920], [-170, 920]]), true)} fill={KOYU} opacity={0.9} />
        {/* kumaş kırışıkları */}
        <path d={serit(TW([[-60, 150, 0], [-10, 168, 5], [50, 150, 0]]))} fill={MONT_C} opacity={0.5} />
        <path d={serit(TW([[-80, 480, 0], [-20, 506, 6], [60, 488, 0]]))} fill={MONT_C} opacity={0.45} />
      </Hacim>
      <Hacim id={`${id}s`} pts={serit1} dolgu="#e8eef2" golge="#b8c4cc" cizgi="#5a6a74" isik={ODA_ISIK} ince={2} kalin={5} />
      <Hacim id={`${id}m`} pts={manset} dolgu={KOYU} golge={KOYU_C} cizgi={KOYU_C} isik={ODA_ISIK} ince={2.5} kalin={6} />
      <Hacim id={`${id}e`} pts={el} dolgu={ELDIVEN} golge={ELDIVEN_G} cizgi={ELDIVEN_C} isik={ODA_ISIK} ince={3} kalin={8}>
        {/* eldiven dikişi ve parlaması */}
        <path d={serit(TW([[-40, -20, 0], [0, -30, 3], [40, -20, 0]]))} fill="#4a525a" />
        <ellipse cx={T([[-20, -80]])[0][0]} cy={T([[-20, -80]])[0][1]} rx={18 * s} ry={8 * s} fill="#ffffff" opacity={0.18} />
      </Hacim>
      {/* bükülü parmaklar (boğumlar) */}
      {[[8, -132], [32, -124], [52, -104]].map(([x, y], i) => {
        const pts = T([[x - 15, y + 4], [x - 12, y - 18], [x + 6, y - 24], [x + 18, y - 10], [x + 14, y + 8]]);
        return <Hacim key={i} id={`${id}b${i}`} pts={pts} dolgu={ELDIVEN} golge={ELDIVEN_G} cizgi={ELDIVEN_C} isik={ODA_ISIK} ince={2} kalin={6} />;
      })}
      {/* başparmak */}
      <path d={serit(TW([[-56, -40, 34], [-74, -88, 30], [-70, -122, 22]]))} fill={ELDIVEN} stroke={ELDIVEN_C} strokeWidth={3} />
      {/* işaret parmağı */}
      {isaret ? (
        <path d={serit(TW([[-24, -128, 36], [-20, -128 - parmakBoy * 0.55, 33], [-16, -128 - parmakBoy, 30]]))} fill={ELDIVEN} stroke={ELDIVEN_C} strokeWidth={3.5} strokeLinejoin="round" />
      ) : null}
    </g>
  );
};

/* ---------------- sahne ---------------- */
const KAM0 = { x: 2.85, y: 1.62, z: 2.05 };

export const KdKancaSahne: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const Z = KS;

  if (frame >= Z.kes && frame < Z.baslik) return <AbsoluteFill style={{ backgroundColor: "#000" }} />;
  if (frame >= Z.baslik) {
    const y = frame >= Z.yazi;
    return (
      <AbsoluteFill style={{ backgroundColor: "#07060a", alignItems: "center", justifyContent: "center" }}>
        {y ? (
          <div style={{ textAlign: "center", lineHeight: 0.95 }}>
            <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 150, letterSpacing: 10, color: "#e8202e", textShadow: "0 0 40px rgba(232,32,46,0.45)" }}>KIRMIZI</div>
            <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 200, letterSpacing: 6, color: "#f4f0f2" }}>DÜĞME</div>
          </div>
        ) : null}
      </AbsoluteFill>
    );
  }

  const hedefP = petekBul("sag", 4, 1.32, 3.55);
  const bolmeP = petekBul("sag", 4, hedefP.c[1] + 0.73, hedefP.c[2]);
  const karakterler: OdaKarakter[] = [
    { look: castById("kd_gobek_oda"), x: 1.1, z: 5.5, pose: { emotion: frame >= Z.dur + 2 ? "korkmus" : "saskin", seed: 4 } },
    { look: castById("kd_influencer_oda"), x: 2.1, z: 6.3, pose: { emotion: frame >= Z.dur + 2 ? "korkmus" : "supheli", seed: 7 } },
    { look: castById("kd_dorduncu_teyze"), x: 0.75, z: 7.3, pose: { emotion: "notr", seed: 9 } },
  ];
  const bak = (c: number[], kx = KAM0.x, ky = KAM0.y, kz = KAM0.z) => ({
    yaw: (Math.atan2(c[0] - kx, c[2] - kz) * 180) / Math.PI,
    pitch: (Math.atan2(c[1] - ky, Math.hypot(c[0] - kx, c[2] - kz)) * 180) / Math.PI,
  });

  const bas = cl((frame - (Z.klik - 1)) / 3);
  const led = frame >= Z.klik ? (Math.floor((frame - Z.klik) / 2) % 2 ? 0.45 : 1) : 0;
  const acik = frame >= Z.kanat ? ease((frame - Z.kanat) / 8) : 0;
  const kirmizi = frame >= Z.kanat ? 0.14 + 0.22 * Math.max(0, Math.sin((frame - Z.kanat) / 3)) : 0.04;
  const durum: OdaDurum = {
    derz: 1, dalga: 30, anaBas: 1, anaLed: 1, sayac: 417, kirmizi, t,
    ozelBas: { petek: hedefP, bas, led, sayac: hedefP.no + (frame >= Z.klik ? 1 : 0) },
    bolmeler: frame >= Z.kilit ? [{ petek: bolmeP, acik }] : [],
  };

  /* Ç2: YAKIN — düğmeye 0,5 m, parmak basar */
  if (frame >= Z.yakin && frame < Z.pov2) {
    const u = (frame - Z.yakin) / (Z.pov2 - Z.yakin);
    const k: Kam = { x: 4 - 0.5, y: hedefP.c[1] + 0.05, z: hedefP.c[2] - 0.03 - u * 0.02, yaw: 90, pitch: -6, f: 1150, cy: 940, ...titre(frame, frame >= Z.klik && frame < Z.klik + 3 ? 7 : 1) };
    const hp = proj(k, hedefP.c);
    const it = ease((frame - Z.yakin) / 2.5);
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
          <BeyazOda k={k} durum={durum} frame={frame} />
          <KuryeKol id="yk" bilek={[hp.x + 210 + (1 - it) * 120, hp.y + 330 + (1 - it) * 200]} aci={-0.42} s={1.9} bas={bas} />
          <rect width={1080} height={1920} fill="#ff1a2a" opacity={frame >= Z.klik && frame < Z.klik + 4 ? 0.22 * (1 - (frame - Z.klik) / 4) : 0} />
        </svg>
      </AbsoluteFill>
    );
  }

  /* Ç1 ve Ç3: POV */
  const pov1 = frame < Z.yakin;
  const yaklas = pov1 ? ease(frame / Z.yakin) : 1;
  const KX = KAM0.x + 0.28 * yaklas, KY = KAM0.y - 0.04 * yaklas, KZ = KAM0.z + 0.55 * yaklas;
  const b0 = bak([4, hedefP.c[1] + 0.12, hedefP.c[2] + 0.35], KX, KY, KZ); // başta oda derinliği de görünür (düğme sağda)
  const b1 = bak([4, hedefP.c[1] * 0.6 + bolmeP.c[1] * 0.4, hedefP.c[2]], KX, KY, KZ);
  const b2 = bak([4, bolmeP.c[1] - 0.1, bolmeP.c[2]], KX, KY, KZ);
  const yon0 = pov1 ? { yaw: b0.yaw * (1 - yaklas * 0.0) - 28 * (1 - yaklas), pitch: b0.pitch } : b1;
  const kalk = ease((frame - Z.kilit) / 9);
  // mızrak
  const mizrakK = cl((frame - Z.mizrak) / (Z.kes - Z.mizrak));
  const agir = mizrakK < 0.26 ? mizrakK * 0.35 : 0.091 + (mizrakK - 0.26) * 1.23; // ilk 6 kare ağır çekim, sonra hızlanır
  const e = 0.9 * cl(agir) ** 1.1;
  const gogus: [number, number, number] = [KX + 0.12, KY - 0.27, KZ];
  const bas0: [number, number, number] = [bolmeP.c[0] + 0.35, bolmeP.c[1], bolmeP.c[2]];
  const uc: [number, number, number] = [bas0[0] + (gogus[0] - bas0[0]) * e, bas0[1] + (gogus[1] - bas0[1]) * e, bas0[2] + (gogus[2] - bas0[2]) * e];
  const yonM: [number, number, number] = [gogus[0] - bas0[0], gogus[1] - bas0[1], gogus[2] - bas0[2]];
  const izle = ease((frame - Z.mizrak) / 10) * 0.75;
  const ucP = (Math.atan2(uc[1] - KY, Math.max(0.05, Math.hypot(uc[0] - KX, uc[2] - KZ))) * 180) / Math.PI;
  const yaw = pov1 ? yon0.yaw : b1.yaw + (b2.yaw - b1.yaw) * kalk;
  const pitch0 = pov1 ? yon0.pitch : b1.pitch + (b2.pitch - b1.pitch) * kalk;
  const pitch = pitch0 + (ucP - pitch0) * izle;
  const darbe = frame >= Z.mizrak ? 2 + 9 * mizrakK : 0;
  const el = elde(frame, pov1 ? 1 : 0.6);
  const tt = titre(frame, darbe + (frame >= Z.pov2 && frame < Z.pov2 + 3 ? 4 : 0));
  const k: Kam = { x: KX, y: KY, z: KZ, yaw, pitch, f: 860, cy: 960, sx: el.sx + tt.sx, sy: el.sy + tt.sy };
  const hp = proj(k, hedefP.c);
  // kollar
  const uzan = pov1 ? ease((frame - 2) / (Z.yakin - 4)) : 1;
  const cekil = ease((frame - (Z.mizrak + 2)) / 8);
  const sagBilek: P = [hp.x + 150 + (1 - uzan) * 260 + cekil * 420, hp.y + 260 + (1 - uzan) * 520 + cekil * 900];
  const solBilek: P = [150 + Math.sin(frame / 7) * 8 - cekil * 40, 1830 + Math.sin(frame / 9) * 10 + cekil * 200];
  const blur = frame > Z.kes - 5 ? (frame - (Z.kes - 5)) * 2.4 : 0;
  const altyazi = frame >= Z.dur && frame < Z.dur + 20;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <defs>
          <filter id="ks_blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={`${blur * 0.4} ${blur}`} /></filter>
          <radialGradient id="ks_vin" cx="0.5" cy="0.48" r="0.75"><stop offset="0.6" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#140006" stopOpacity={0.5} /></radialGradient>
        </defs>
        <g filter={blur > 0.5 ? "url(#ks_blur)" : undefined}>
          <BeyazOda k={k} durum={durum} karakterler={karakterler} frame={frame} ekstra={frame >= Z.mizrak - 1 ? <Mizrak k={k} uc={uc} yon={yonM} /> : null} />
        </g>
        {/* kollar (ön planda, oda ışığında) */}
        <KuryeKol id="sol" bilek={solBilek} aci={0.32} s={1.15} isaret={false} sol />
        {frame < Z.mizrak + 10 ? <KuryeKol id="sag" bilek={sagBilek} aci={-0.5 + uzan * 0.06} s={1.15} bas={frame >= Z.klik ? 1 : 0} /> : null}
        <rect width={1080} height={1920} fill="url(#ks_vin)" opacity={frame >= Z.kanat ? 1 : 0.55} />
      </svg>
      {altyazi ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 300, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 64, color: "#fff", WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>
          — Duuuur!
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
