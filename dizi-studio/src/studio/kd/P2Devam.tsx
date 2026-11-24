import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { BeyazOda, proj, KAIDE, type Kam, type OdaDurum } from "../sets/beyazoda";
import { SANS } from "../../dizi/fonts";
import { yerlestir, lwOlcek, ara, mix, salin, sars, kirp, type Yer, type V3 } from "./kukla";
import { OdaGobekli, GOBEK_UYKU, type GobekPoz } from "./OdaGobekli";
import { OdaInfluencer, INF_UYKU, type InfPoz } from "./OdaInfluencer";
import { KuryeComel, KURYE_UYKU, type KuryePoz } from "./OdaKurye";
import { TeyzeAyakta, TEYZE_UYKU, type TeyzePoz } from "./OdaTeyze";
import { C_KURYE, C_KIZ, C_GOBEK } from "./p2bSes";

/* =====================================================================================
 * Kırmızı Düğme · B1 · Parça 2 DEVAMI (C1-C7), kompozisyon KDP2Devam. SESSİZ (miks ayrı; ses başlangıçları P2B_SES).
 * Kullanıcının metni (aynen): "herkes birbirinden 2-3 adım uzaklaşır kurye hariç, Bunları tekli kamera ile göster ...
 *   Kurye belini tutar canı yandığı bellidir. Kurye "haydee nereye düştük biz gardaş kamera şakası mı bu?"
 *   Kız:"dava edicem sizi, çıkarın beni hemen burdan!" Göbekli ayağa kalkmamıştır oturarak konuşur:"başım ağrıyo ne vermişler öyle bre""
 * KALICI KURAL (kullanıcı): grup/toplu çekim YOK; her karakter TEKLİ kamerayla. 180° bakışlar: göbekli/teyze batıda → sağa,
 * kurye/kız doğuda → sola bakar. Tekli çekimde kadrajda yalnız o karakter çizilir (diğerleri kadraj dışında).
 *
 *  C1   0- 74  KIZ, orta (dizden yukarı), göz hizası, güneybatıdan: kadrajın altından doğrulup kalkar, 2-3 adım geri
 *              (doğuya) çekilir, elleri önde savunmada; kamera onu izler (kaydır)
 *  C2  75-149  TEYZE, tek kişilik genel (tam boy), göz hizası, kusursuz sabit ve ortalı: doğrulup kalkar, çantasını göğsüne
 *              bastırır, 2-3 adım geri (batıya) çekilir; sakin ama temkinli, gözleri sağa (öbürlerine)
 *  C3 150-224  GÖBEKLİ, orta, alçak açı, kilitli: ayağa kalkmaz; oturarak, ellerine yaslanıp kalçasıyla 3 kez geri sürünür
 *  C4 225-269  KURYE, orta (3/4), elde: yerinde kalır, BELİNİ tutar, yüzü acıyla buruşur
 *  C5 270-449  KURYE, yakın, elde, çok hafif itme: "Haydee, nereye düştük biz gardaş?" (acılı, etrafa bakınır)
 *              → "Kamera şakası mı bu?" (tavana/köşelere bakınır)
 *  C6 450-547  KIZ, yakın, ÜST AÇI (tavan köşesinden, görünmeyen kaçıranların gözü): başını kaldırıp kameraya bağırır,
 *              ağlamaklı: "Dava edicem sizi! Çıkarın beni hemen burdan!"
 *  C7 548-679  GÖBEKLİ, orta-yakın, göz hizası (oturan), kilitli: başını ovar, sersem: "Başım ağrıyo... Ne vermişler öyle bre?"
 * Ölçek ritmi: orta → genel → orta(alçak) → orta → yakın → yakın(üst) → orta-yakın.
 * ===================================================================================== */

export const C = { C1: 0, C2: 75, C3: 150, C4: 225, C5: 270, C6: 450, C7: 548, SON: 680 };
/* ElevenLabs seslerinin başlayacağı kareler (public/voice/kd-b1-p2b/) */
export const P2B_SES = { kurye: 272, kiz: 452, gobek: 551 };

type Konusma = { bas: number; zarf: number[]; parca: [number, number, string, number][] };
const K_KURYE: Konusma = { bas: P2B_SES.kurye, zarf: C_KURYE, parca: [[6, 73, "aeeeeüü", 1.4], [92, 121, "iaa", 1.4], [138, 172, "aeaaaııu", 1.3]] };
const K_KIZ: Konusma = { bas: P2B_SES.kiz, zarf: C_KIZ, parca: [[2, 31, "aaeieii", 1.1], [48, 90, "ıaıeieeua", 1.1]] };
const K_GOBEK: Konusma = { bas: P2B_SES.gobek, zarf: C_GOBEK, parca: [[2, 56, "aıaıo", 3.2], [72, 122, "eeieöee", 1.3]] };
const YUV: Record<string, number> = { a: 0.1, e: 0, "ı": 0, i: 0, o: 0.8, "ö": 0.7, u: 1, "ü": 0.9 };
const sesAgiz = (f: number, k: Konusma) => {
  const i = f - k.bas;
  if (i < 0 || i >= k.zarf.length) return { ac: 0, yuv: 0, parca: -1 };
  let yuv = 0, parca = -1, kaz = 1;
  k.parca.forEach(([a, b, sl, g], pi) => {
    if (i >= a && i <= b) { const j = Math.min(sl.length - 1, Math.floor(((i - a) / (b - a + 1)) * sl.length)); yuv = YUV[sl[j]] ?? 0; parca = pi; kaz = g; }
  });
  const e = (k.zarf[i] + (k.zarf[i - 1] ?? 0) * 0.5) / 1.5;
  return { ac: parca < 0 ? 0 : Math.min(1, Math.pow(e * kaz, 0.7)), yuv, parca };
};

const ALTYAZI: { bas: number; son: number; metin: string }[] = [
  { bas: P2B_SES.kurye + 5, son: P2B_SES.kurye + 128, metin: "Haydee, nereye düştük biz gardaş?" },
  { bas: P2B_SES.kurye + 134, son: C.C6, metin: "Kamera şakası mı bu?" },
  { bas: P2B_SES.kiz + 1, son: P2B_SES.kiz + 42, metin: "Dava edicem sizi!" },
  { bas: P2B_SES.kiz + 44, son: C.C7, metin: "Çıkarın beni hemen burdan!" },
  { bas: P2B_SES.gobek + 1, son: P2B_SES.gobek + 66, metin: "Başım ağrıyo..." },
  { bas: P2B_SES.gobek + 68, son: C.SON, metin: "Ne vermişler öyle bre?" },
];

/* ---------------- yerler (P2 açılışının son yerleşimi; uzaklaşma yönleri: kız doğuya, teyze ve göbekli batıya) ---------------- */
const KIZ_A: V3 = [1.15, 0, 3.25], KIZ_B: V3 = [1.78, 0, 3.02];
const TEYZE_A: V3 = [-1.3, 0, 5.6], TEYZE_B: V3 = [-1.9, 0, 5.85];
const GOBEK_A: V3 = [-1.2, 0, 3.3], GOBEK_B: V3 = [-1.78, 0, 3.3];
const KURYE_O: V3 = [1.2, 0, 5.25];
const lerp3 = (a: V3, b: V3, t: number): V3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

/* ---------------- pozlar ---------------- */
const kizPoz = (f: number): { p: InfPoz; o: V3; batma: number } => {
  const p: InfPoz = { ...INF_UYKU, ayakta: true, bak: [-0.7, 0], agiz: { ac: 0.2, yuv: 0.3 }, goz: 1.2, kas: 0.8, kasIc: 1 };
  if (f < C.C2) {
    // C1: kadrajın altından doğrulup kalkar (0-14), savunma elleri, 2-3 adım geri (18-58)
    const kalk = ara(f, 2, 16);
    const yuru = ara(f, 18, 58);
    p.savun = ara(f, 10, 22);
    p.adim = yuru * Math.PI * 5; p.adimG = yuru > 0 && yuru < 1 ? 1 : 0;
    p.goz = 1.25 * kirp(f, 200, 30); p.bak = [-0.8, 0.1];
    p.agiz = { ac: 0.25 + 0.15 * Math.abs(Math.sin(f / 4)), yuv: 0.4 };
    return { p, o: lerp3(KIZ_A, KIZ_B, yuru), batma: (1 - kalk) * 0.95 };
  }
  // C6: başını kaldırıp tavandaki kameraya bağırır, ağlamaklı, yumruklar sıkılı
  const ag = sesAgiz(f, K_KIZ);
  p.savun = 0; p.yanda = 1; p.basYukari = ara(f, C.C6, C.C6 + 6); p.bak = [0, -1]; p.yas = ara(f, C.C6 + 20, C.C6 + 50);
  p.goz = 1.15; p.kas = 0.6; p.kasIc = 1;
  p.agiz = { ac: Math.max(0.12, ag.ac * 1.25), yuv: ag.yuv };
  p.basDon = Math.sin(f / 6) * 2 * (ag.parca >= 0 ? 1 : 0.3);
  return { p, o: KIZ_B, batma: 0 };
};

const teyzePoz = (f: number): { p: TeyzePoz; o: V3; adim: number; adimG: number; comel: number } => {
  const a = f - C.C2;
  const kalk = ara(a, 0, 14);
  const yuru = ara(a, 22, 62);
  const p: TeyzePoz = { ...TEYZE_UYKU, kalk: 0, goz: 1.05 * kirp(f, 110, 20), kas: 0.55, agiz: 0.25, basDon: 4, nefes: Math.sin(f / 9), bak: 1, canta: ara(a, 8, 20) };
  return { p, o: lerp3(TEYZE_A, TEYZE_B, yuru), adim: yuru * Math.PI * 5, adimG: yuru > 0 && yuru < 1 ? 1 : 0, comel: 1 - kalk };
};

const OTUR = 38; // oturma: gövde kalçadan 38° kalkık, ellerine yaslanmış
const gobekPoz = (f: number): { p: GobekPoz; o: V3; zip: number } => {
  const p: GobekPoz = { ...GOBEK_UYKU, kalk: OTUR, basEg: 26, nefes: Math.sin(f / 5), goz: 1.2, kas: 0.9, agiz: 0.45, dizOn: 0.55, dizArka: 0.45, kolOn: [72, 8], kolArka: [80, 4], kasi: 0, bilek: 70 };
  if (f < C.C7) {
    // C3: 3 kez geri sürünür (her biri: eller geride → kalça kalkar, geri kayar → oturur)
    const a = f - C.C3;
    const hop = Math.max(0, Math.min(3, (a - 8) / 20));
    const n = Math.floor(hop), u = hop - n;
    const kay = (n + ease01(u)) / 3;
    const kaldir = n < 3 && hop > 0 ? Math.sin(u * Math.PI) : 0;
    p.kalk = OTUR + 4 * kaldir;
    p.kolOn = [72 - 18 * kaldir, 8]; p.kolArka = [80 - 18 * kaldir, 4];
    p.dizOn = 0.55 + 0.15 * kaldir; p.dizArka = 0.45 + 0.15 * kaldir;
    p.agiz = 0.4 + 0.3 * Math.abs(Math.sin(a / 3.2)); p.nefes = Math.sin(a / 3.2);
    p.ter = 0.8;
    return { p, o: lerp3(GOBEK_A, GOBEK_B, kay), zip: kaldir * 0.05 };
  }
  // C7: sersem, başını ovar
  const ag = sesAgiz(f, K_GOBEK);
  const a = f - C.C7;
  const ov = ara(a, 4, 16);
  p.goz = mix(1.0, 0.45, ara(a, 0, 12)) * kirp(f, 70, 10);
  p.kas = 0.5; p.agiz = Math.max(0.12, ag.ac * 0.95); p.nefes = Math.sin(f / 22);
  // daha dik oturur; ön kol yere dayanır, arka el başının arkasını ovar (yüz açık kalır)
  p.kalk = mix(OTUR, 50, ov);
  p.kolOn = [mix(72, 62, ov), 8];
  p.kolArka = [mix(80, 166 + Math.sin(f / 2.6) * 3, ov), mix(4, -15 + Math.sin(f / 2.6 + 1) * 4, ov)];
  p.bilekArka = 109 * ov; p.elArkaUstte = ov > 0.6;
  p.kasi = 0;
  p.basEg = 26 + Math.sin(f / 14) * 3;
  return { p, o: GOBEK_B, zip: 0 };
};
function ease01(u: number) { return u * u * (3 - 2 * u); }

const kuryePoz = (f: number): KuryePoz => {
  const p: KuryePoz = { ...KURYE_UYKU, goz: 1.1, sik: 0, kas: 0.6, savun: 0.6, bak: -0.6, basEg: -4, nefes: Math.sin(f / 30), agiz: { ac: 0, yuv: 0 } };
  const bt = ara(f, C.C4 + 3, C.C4 + 12);
  p.belTut = bt; p.aci = bt;
  p.goz = mix(1.1, 0.42, bt) * kirp(f, 90, 5); p.kas = mix(0.6, -0.9, bt);
  if (f >= C.C5) {
    const ag = sesAgiz(f, K_KURYE);
    p.agiz = { ac: ag.ac, yuv: ag.yuv };
    p.aci = 0.75; p.goz = 0.7 * kirp(f, 80, 12); p.kas = -0.5;
    // ilk cümle: etrafa bakınır (sola-sağa); ikinci cümle: tavana/köşelere
    const ikinci = ara(f, P2B_SES.kurye + 128, P2B_SES.kurye + 138);
    p.bak = mix(Math.sin((f - C.C5) / 14) * 1, Math.sin((f - C.C5) / 9) * 0.8, ikinci);
    p.bakY = -ikinci;
    p.goz = mix(p.goz, 1.0, ikinci);
    p.basEg = -4 + 4 * Math.sin((f - C.C5) / 18) - 8 * ikinci;
  }
  return p;
};

/* ---------------- kameralar (her çekim tek kişi) ---------------- */
const bak = (k: { x: number; y: number; z: number }, t: V3) => ({
  yaw: (Math.atan2(t[0] - k.x, t[2] - k.z) * 180) / Math.PI,
  pitch: (Math.atan2(t[1] - k.y, Math.hypot(t[0] - k.x, t[2] - k.z)) * 180) / Math.PI,
});
const kam = (pos: V3, t: V3, f: number, cy = 960, extra: Partial<Kam> = {}): Kam => ({ x: pos[0], y: pos[1], z: pos[2], ...bak({ x: pos[0], y: pos[1], z: pos[2] }, t), f, cy, ...extra });

type Cekim = { k: Kam; kim: "kiz" | "teyze" | "gobek" | "kurye"; cap?: [number, number] };
const kamera = (f: number): Cekim => {
  if (f < C.C2) {
    const { o } = kizPoz(f);
    const d = salin(f, 0.5);
    // orta: dizden yukarı; kamera kızı yumuşakça izler (kaydır)
    return { k: { ...kam([0.7, 1.22, 1.75], [mix(1.15, o[0], 0.8) - 0.08, 1.08, mix(3.25, o[2], 0.8)], 2050, 820), sx: d.x, sy: d.y }, kim: "kiz", cap: [0, -900] };
  }
  if (f < C.C3) {
    // tek kişilik genel: tam boy, ortalı, kusursuz sabit (teyzenin kamera dili)
    return { k: kam([-1.5, 0.82, 3.2], [-1.64, 0.6, 5.75], 1850, 960), kim: "teyze" };
  }
  if (f < C.C4) {
    // alçak açı, kilitli; göbekli batıya sürünür, kadraj onu bekler
    return { k: kam([-1.32, 0.3, 1.62], [-1.62, 0.36, 3.3], 1250, 1000), kim: "gobek", cap: [-200, -200] };
  }
  if (f < C.C5) {
    const d = salin(f, 1.2, 2);
    return { k: { ...kam([0.62, 1.0, 3.6], [1.04, 0.78, 5.25], 1750, 900), sx: d.x, sy: d.y }, kim: "kurye", cap: [0, -600] };
  }
  if (f < C.C6) {
    const u = (f - C.C5) / (C.C6 - C.C5);
    const d = salin(f, 0.9, 5);
    return { k: { ...kam([0.86, 1.24, 4.32 + 0.12 * u], [1.16, 1.12, 5.25], 1900, 760), sx: d.x, sy: d.y }, kim: "kurye", cap: [-20, -900] };
  }
  if (f < C.C7) {
    const ag = sesAgiz(f, K_KIZ);
    const s = sars(f, ag.parca >= 0 ? 2 + 4 * ag.ac : 0.5);
    // üst açı: tavan köşesinden (görünmeyen kaçıranların gözü); kız bu kameraya bağırır
    return { k: { ...kam([1.5, 2.25, 2.4], [1.77, 1.4, 3.02], 2500, 700), sx: s.x, sy: s.y }, kim: "kiz", cap: [0, -1200] };
  }
  return { k: kam([-1.92, 0.76, 2.0], [-2.18, 0.68, 3.3], 1400, 860), kim: "gobek", cap: [-450, -450] };
};

/* ---------------- sahne ---------------- */
const ciz = (k: Kam, yer: Yer, el: (lw: number) => React.ReactNode, sy = 1, dy = 0) => {
  const y = yerlestir(k, yer);
  if (!y) return null;
  const tr = sy === 1 && dy === 0 ? y.tr : `translate(${y.p.x} ${y.p.y + dy}) scale(1 ${sy}) translate(${-y.p.x} ${-y.p.y}) ${y.tr}`;
  return { z: y.z, el: <g key="kisi" filter="url(#kd_kaynat)"><g transform={tr}>{el(lwOlcek(y.s))}</g></g> };
};

const Sahne: React.FC<{ f: number; c: Cekim }> = ({ f, c }) => {
  const { k } = c;
  const durum: OdaDurum = { derz: 0, dalga: -1, anaBas: 0, anaLed: 0, sayac: 1, kirmizi: 0, t: f / 30, kaide: true };
  const list: { z: number; el: React.ReactNode }[] = [];
  const add = (x: { z: number; el: React.ReactNode } | null) => { if (x) list.push(x); };
  if (c.kim === "kiz") {
    const { p, o, batma } = kizPoz(f);
    add(ciz(k, { tip: "dik", o: [o[0], o[1] - batma, o[2]], t1: [1, 0, 0], cap: c.cap }, (lw) => <OdaInfluencer p={p} lw={lw} />));
  } else if (c.kim === "teyze") {
    const t = teyzePoz(f);
    // doğrulup kalkma: çömelmiş (ezik) → gerilme → oturma
    const sy = t.comel > 0.01 ? 0.66 + 0.34 * (1 - t.comel) + (t.comel < 0.25 ? Math.sin((t.comel / 0.25) * Math.PI) * 0.04 : 0) : 1;
    const yer: Yer = { tip: "dik", o: t.o, t1: [1, 0, 0] };
    const y = yerlestir(k, yer);
    if (y) {
      list.push({ z: y.z, el: <g key="kisi" filter="url(#kd_kaynat)"><g transform={`translate(${y.p.x} ${y.p.y}) scale(1 ${sy}) translate(${-y.p.x} ${-y.p.y}) ${y.tr}`}><TeyzeAyakta p={t.p} lw={lwOlcek(y.s)} adim={t.adim} adimG={t.adimG} /></g></g> });
    }
  } else if (c.kim === "gobek") {
    const { p, o, zip } = gobekPoz(f);
    add(ciz(k, { tip: "dik", o: [o[0], o[1] + zip, o[2]], t1: [1, 0, 0], cap: c.cap }, (lw) => <OdaGobekli p={p} lw={lw} />));
  } else {
    const kp = kuryePoz(f);
    add(ciz(k, { tip: "dik", o: KURYE_O, t1: [1, 0, 0], cap: c.cap }, (lw) => <KuryeComel p={kp} lw={lw} konus={kp.agiz} nefes={f / 4} />));
  }
  const bp = proj(k, [KAIDE.x, KAIDE.h + 0.06, KAIDE.z]);
  if (bp.z > 0.3) list.push({ z: bp.z - 0.05, el: <circle key="nabiz" cx={bp.x} cy={bp.y} r={(0.32 * k.f) / bp.z} fill="url(#p2b_nabiz)" opacity={0.55 + 0.35 * Math.sin(f / 14)} /> });
  return <BeyazOda k={k} durum={durum} frame={f} cizimler={list} />;
};

const Altyazi: React.FC<{ f: number }> = ({ f }) => {
  const a = ALTYAZI.find((x) => f >= x.bas && f < x.son);
  if (!a) return null;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 1110, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 62, lineHeight: 1.1, color: "#fff", WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>
      {a.metin}
    </div>
  );
};

const GREN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.6 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")";

export const KdP2Devam: React.FC = () => {
  const frame = useCurrentFrame();
  const c = kamera(frame);
  const kaynat = 1 + (Math.floor(frame / 3) % 4);
  // C1: kalkış anında hafif dikey hareket bulanıklığı
  const kalkBlur = frame < 16 ? Math.sin((frame / 16) * Math.PI) * 5 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <defs>
          <filter id="kd_kaynat" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={kaynat} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={2.4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="p2b_blur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`0 ${kalkBlur}`} /></filter>
          <radialGradient id="p2b_nabiz"><stop offset="0" stopColor="#ff2030" stopOpacity={0.35} /><stop offset="1" stopColor="#ff2030" stopOpacity={0} /></radialGradient>
        </defs>
        <g filter={kalkBlur > 0.5 ? "url(#p2b_blur)" : undefined}>
          <Sahne f={frame} c={c} />
        </g>
      </svg>
      <AbsoluteFill style={{ background: GREN, backgroundPosition: `${Math.floor(random(`gx${frame}`) * 300)}px ${Math.floor(random(`gy${frame}`) * 300)}px`, mixBlendMode: "overlay", opacity: 0.14 }} />
      <Altyazi f={frame} />
    </AbsoluteFill>
  );
};
