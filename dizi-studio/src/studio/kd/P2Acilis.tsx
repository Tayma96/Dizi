import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { BeyazOda, proj, KAIDE, type Kam, type OdaDurum } from "../sets/beyazoda";
import { SANS } from "../../dizi/fonts";
import { yerlestir, lwOlcek, ara, mix, salin, sars, type Yer, type V3 } from "./kukla";
import { OdaGobekli, GOBEK_UYKU, type GobekPoz } from "./OdaGobekli";
import { OdaInfluencer, INF_UYKU, type InfPoz } from "./OdaInfluencer";
import { KuryeYatan, KuryeComel, KURYE_UYKU, type KuryePoz } from "./OdaKurye";
import { OdaTeyze, TEYZE_UYKU, type TeyzePoz } from "./OdaTeyze";
import { BALIKGOZU, BALIKGOZU_OLCEK } from "./balikgozu";
import { KURYE_SAYIKLA, KIZ_CIGLIK, KURYE_NOLUYO, GOBEK_SOLUK, HORLAMA } from "./p2Ses";

/* =====================================================================================
 * Kırmızı Düğme · B1 · Parça 2 AÇILIŞ (A1-A9, ≈22,5 sn), kompozisyon KDP2Acilis. SESSİZ (ses sonra eklenecek).
 * Metin kullanıcıya aittir (docs/diziler/dugme/bolumler.md); çekim dökümü: docs/diziler/dugme/b1-p2-cekim.md §0.
 *
 *  A1   0- 89  GÜVENLİK KAMERASI kaydı: tavan köşesi, balıkgözü, soluk/yeşilimsi, 15 fps takılma; REC + tarih-saat + KAM 04,
 *              köşede etiketsiz yavaş artan küçük sayı. Siyahtan dijital parazitle "bam" diye açılır.
 *  A2  90-134  parazitle kırılır → iç kamera: orta-genel, güneybatıdan çapraz (bedenler kısalır, karakterler büyük); yavaş itme
 *  A3 135-254  Göbekli orta-yakın, yer hizası, kilitli: sırtüstü horluyor, göbeğini kaşıyor, kırıntılar dökülüyor
 *  A4 255-344  horlamaya motive kayma: Göbekli'den kıza (tepeden yakın); kız gözleri kapalı, kapaklarını sıkıyor, kaş çatıyor
 *  A5 345-434  Kurye orta-yakın, yan profil, yer hizası, çok hafif itme; uykusunda sayıklar (fısıltı)
 *  A6 435-506  Influencer yakın: gözleri açılır → çığlık (sarsıntı) → "nerdeyim beeen" (ses 441'de başlar)
 *  A7 507-551  Genel, güneyden, kısa sarsıntı: hepsi AYNI ANDA irkilir (509); kurye dirseklenip doğrulur (510-518),
 *              519'da çömelmeye fırlar
 *  A8 552-602  Kurye orta, elde: "Noluyo lan" (ses 555)
 *  A9 603-727  Göbekli orta, alçak açı, çapraz kadraj: kalkmaya çalışır, doğrulamaz, geri yatar, panik (soluk sesi 603)
 *  A3 ve A9 çapraz kadraj (eğik kamera): baş üst köşede, beden kadrajı çapraz keser; dikey kadrajda boş zemin kalmaz.
 *  Ağız ve horlama nefesi ses zarflarına bağlı (p2Ses.ts); ses dosyaları gömülmez, miks ayrı (P2_SES kareleri).
 * 180° ekseni: kaideden geçen K-G çizgisi; kamera hep güney tarafında. Batı (ekranda sol): göbekli + teyze;
 * doğu (sağ): kurye + influencer. Işık: kaynağı görünmeyen soğuk beyaz, gölgesiz; kırmızıyı yalnız düğme taşır.
 * ===================================================================================== */

export const P2 = { A1: 0, A2: 90, A3: 135, A4: 255, A5: 345, A6: 435, A7: 507, A8: 552, A9: 603, SON: 728, IRK: 509, KALK: 510, FIRLA: 519 };

/* ElevenLabs/efekt seslerinin başlayacağı kareler (miks ayrı yapılır; ağız ve nefes bu zamanlara göre sese bağlı) */
export const P2_SES = { horlama: [0, 180], sayikla: 351, ciglik: 441, noluyo: 555, soluk: P2.A9 };

/* konuşma: ses zarfı (kare başına 0..1) + sesli harf dizisi (yuvarlaklık) */
type Konusma = { bas: number; zarf: number[]; parca: [number, number, string][] };
const K_SAYIKLA: Konusma = { bas: P2_SES.sayikla, zarf: KURYE_SAYIKLA, parca: [[4, 77, "uuuaııaaı"]] };
const K_CIGLIK: Konusma = { bas: P2_SES.ciglik, zarf: KIZ_CIGLIK, parca: [[5, 17, "a"], [30, 63, "eeiee"]] };
const K_NOLUYO: Konusma = { bas: P2_SES.noluyo, zarf: KURYE_NOLUYO, parca: [[2, 46, "ouoa"]] };
const YUV: Record<string, number> = { a: 0.1, e: 0, "ı": 0, i: 0, o: 0.8, u: 1 };
const sesAgiz = (f: number, k: Konusma, kazanc = 1.3) => {
  const i = f - k.bas;
  if (i < 0 || i >= k.zarf.length) return { ac: 0, yuv: 0, parca: -1 };
  let yuv = 0, parca = -1;
  k.parca.forEach(([a, b, sl], pi) => {
    if (i >= a && i <= b) { const j = Math.min(sl.length - 1, Math.floor(((i - a) / (b - a + 1)) * sl.length)); yuv = YUV[sl[j]] ?? 0; parca = pi; }
  });
  const e = (k.zarf[i] + (k.zarf[i - 1] ?? 0) * 0.5) / 1.5;
  return { ac: parca < 0 ? 0 : Math.min(1, Math.pow(e * kazanc, 0.7)), yuv, parca };
};
const ALTYAZI: { bas: number; son: number; metin: string; fisilti?: boolean }[] = [
  { bas: P2_SES.sayikla + 3, son: P2_SES.sayikla + 80, metin: "Vurun şu ayıyı lan artık", fisilti: true },
  { bas: P2_SES.ciglik + 4, son: P2_SES.ciglik + 27, metin: "Aaaa!" },
  { bas: P2_SES.ciglik + 28, son: P2_SES.ciglik + 66, metin: "Nerdeyim beeen" },
  { bas: P2_SES.noluyo + 1, son: P2.A9, metin: "Noluyo lan" },
];

/* ---------------- yerler (dünya, metre) ---------------- */
const GOBEK_O: V3 = [-1.2, 0, 3.3];
const KURYE_O: V3 = [1.25, 0, 5.3];
const INF_O: V3 = [1.1, 0.15, 2.9];
const TEYZE_O: V3 = [-1.15, 0, 5.5];
const KURYE_COMEL_O: V3 = [1.2, 0, 5.25];
/* kameralar karakterle birlikte kayar (ilk yerleşime göre farklar) */
const dG = (v: V3): V3 => [v[0] + 0.35, v[1], v[2] + 0.3];
const dI = (v: V3): V3 => [v[0] - 0.3, v[1], v[2] + 0.2];
const dK = (v: V3): V3 => [v[0] - 0.3, v[1], v[2] - 0.2];

/* ---------------- horlama: efekt dosyasına bağlı (kare 0 ve 180'de başlar, A1-A4 boyunca) ---------------- */
const horla = (f: number) => {
  const n = HORLAMA.length, i = ((f % n) + n) % n;
  let t = 0;
  for (let d = -5; d <= 5; d++) t += HORLAMA[Math.min(n - 1, Math.max(0, i + d))];
  const yumu = t / 11;
  // horultu nefes alırken çıkar: göbek sesle birlikte kalkar
  return { nefes: -1 + 2 * Math.min(1, yumu * 1.4), ses: HORLAMA[i] };
};

/* ---------------- pozlar (zaman çizelgesi) ---------------- */
const gobekPoz = (f: number): GobekPoz => {
  const h = horla(f);
  const p: GobekPoz = { ...GOBEK_UYKU, nefes: h.nefes, agiz: 0.22 + 0.5 * Math.min(1, h.ses * 1.2) };
  // uykuda göbek kaşıma (A3'ün içinde, kırıntılar dökülür)
  const ks = ara(f, 150, 158) * (1 - ara(f, 232, 242));
  if (ks > 0) {
    const w = Math.sin(f * 0.95);
    p.kasi = w * ks;
    p.kolOn = [20 + w * 2 * ks, -92 + w * 6 * ks];
    p.bilek = 48 + Math.sin(f * 0.95 + 1) * 10 * ks;
  }
  const kir: { x: number; y: number; a: number }[] = [];
  [162, 171, 183, 196, 204, 217].forEach((t0, i) => {
    if (f < t0) return;
    const t = (f - t0) / 30;
    const x0 = -240 + i * 22, y0 = -400 + (i % 3) * 8;
    const y = Math.min(6, y0 + 40 * t + 0.5 * 2400 * t * t);
    kir.push({ x: x0 + 30 * t * (i % 2 ? 1 : -0.6), y, a: (i * 47 + (y < 6 ? f * 18 : 0)) % 360 });
  });
  p.kirinti = kir;
  // A7: irkilme (herkesle aynı anda)
  if (f >= P2.IRK) {
    const i = ara(f, P2.IRK, P2.IRK + 4);
    p.goz = 1.3 * i; p.kas = i; p.agiz = mix(p.agiz, 0.85, i); p.basEg = mix(10, -4, i);
    p.kolOn = [mix(20, -50, i), mix(-92, -60, i)]; p.kolArka = [mix(8, -70, i), mix(4, -40, i)];
    p.dizOn = mix(0.05, 0.45, i); p.dizArka = mix(0, 0.3, i); p.kalk = 5 * i; p.kasi = 0; p.bilek = 10;
  }
  // A9: kalkmaya çalışır → göbekten doğrulamaz → geri yatar → panik
  if (f >= P2.A9 + 1) {
    const haz = ara(f, P2.A9 + 1, P2.A9 + 9);
    const kalk = ara(f, P2.A9 + 7, P2.A9 + 35) * (1 - ara(f, P2.A9 + 45, P2.A9 + 51));
    const zor = ara(f, P2.A9 + 7, P2.A9 + 15) * (1 - ara(f, P2.A9 + 45, P2.A9 + 49));
    const pan = ara(f, P2.A9 + 49, P2.A9 + 57);
    const tit = Math.sin(f * 2.1) * 1.4 * zor;
    p.kalk = 19 * kalk + tit + (f >= P2.A9 + 49 && f < P2.A9 + 55 ? Math.max(0, 2.5 - (f - P2.A9 + 49) * 0.6) : 0);
    p.basEg = mix(-4, 22, zor);
    p.goz = mix(1.2, 0, zor);
    p.sik = zor;
    p.kas = mix(0.6, -0.4, zor);
    p.agiz = mix(0.5, 0.12, zor);
    p.nefes = mix(p.nefes, 1, zor);
    p.kolOn = [mix(-20, -35, haz), mix(-70, -15, haz)];
    p.kolArka = [mix(-40, -45, haz), mix(-40, -10, haz)];
    p.dizOn = 0.3; p.dizArka = 0.15;
    p.ter = zor;
    if (pan > 0) {
      const a = f - P2.A9 + 49;
      p.goz = 1.3 * pan; p.sik = 0; p.kas = pan; p.ter = 1;
      const so = GOBEK_SOLUK[f - P2_SES.soluk] ?? 0;
      p.agiz = mix(p.agiz, 0.4 + 0.25 * Math.abs(Math.sin(a * 0.55)) + 0.5 * Math.min(1, so * 1.5), pan);
      p.nefes = Math.sin(a * 0.55);
      p.basEg = mix(p.basEg, 2 + 5 * Math.sin(a * 0.45), pan);
      p.kolOn = [mix(p.kolOn[0], -70 + 45 * Math.sin(a * 0.62), pan), mix(p.kolOn[1], -45 + 35 * Math.sin(a * 0.9 + 1), pan)];
      p.kolArka = [mix(p.kolArka[0], -95 + 40 * Math.sin(a * 0.7 + 2), pan), mix(p.kolArka[1], -35 + 30 * Math.sin(a * 1.1), pan)];
      p.dizOn = mix(0.3, 0.45 + 0.4 * Math.sin(a * 0.5), pan);
      p.dizArka = mix(0.15, 0.4 + 0.4 * Math.sin(a * 0.5 + 2.2), pan);
      p.kalk = mix(p.kalk, 3 + 3 * Math.sin(a * 0.32), pan);
    }
  }
  return p;
};

const infPoz = (f: number): InfPoz => {
  const p: InfPoz = { ...INF_UYKU, bak: [0, 0], agiz: { ac: 0, yuv: 0 } };
  const s = horla(f).ses;
  const rah = ara(f, 282, 300);
  p.sik = rah * (0.35 + 0.65 * s);
  p.kas = -rah * (0.55 + 0.45 * s);
  p.gul = -rah * 0.7;
  p.basDon = rah * (Math.sin(f / 9) * 3 - 5 * s);
  if (f >= 437) {
    const ac = ara(f, 437, 442);
    p.sik *= 1 - ac; p.goz = 1.3 * ac; p.kas = ac; p.kasIc = ac; p.gul = 0; p.basDon *= 1 - ac;
    p.bak = [0.25 * Math.sin(f / 5), 0];
  }
  const ag = sesAgiz(f, K_CIGLIK, 1.1);
  const ciglik = ag.parca === 0;
  p.agiz = { ac: ag.ac * (ciglik ? 1.55 : 1), yuv: ag.yuv };
  const c0 = P2_SES.ciglik + 5;
  if (f >= c0) { p.eller = ara(f, c0, c0 + 10) * 0.12; p.basKalk = ara(f, c0, c0 + 5); }
  if (f >= P2_SES.ciglik + 18) { p.goz = 1.15; p.bak = [Math.sin(f / 3.5) * 0.9, 0.2]; p.kasIc = 1; }
  if (f >= P2.A7) { p.agiz = { ac: 0.25, yuv: 0.3 }; p.bak = [-0.6, 0]; }
  return p;
};

const teyzePoz = (f: number): TeyzePoz => {
  const p: TeyzePoz = { ...TEYZE_UYKU, nefes: Math.sin(f / 40) };
  if (f >= P2.IRK) {
    const i = ara(f, P2.IRK, P2.IRK + 6);
    p.kalk = 38 * i; p.goz = 1.15 * i; p.kas = i; p.agiz = 0.7 * i * (1 - 0.5 * ara(f, P2.IRK + 12, P2.IRK + 30)); p.basDon = 10 * i;
  }
  return p;
};

const kuryePoz = (f: number): KuryePoz => {
  const p: KuryePoz = { ...KURYE_UYKU, nefes: Math.sin(f / 30), agiz: { ac: 0, yuv: 0 } };
  const fs = ara(f, 350, 358) * (1 - ara(f, 420, 432));
  p.sik = 0.5 + 0.4 * fs;
  p.kas = -0.6 - 0.4 * fs;
  p.basEg = 6 + 4 * Math.sin(f / 7) * fs;
  const ag = sesAgiz(f, K_SAYIKLA, 1.6);
  p.agiz = { ac: ag.ac * 0.8, yuv: ag.yuv };
  if (f >= P2.IRK) {
    // irkilir → dirseklenip doğrulur (ara poz) → çömelmeye fırlar
    const k = ara(f, P2.KALK, P2.FIRLA - 1);
    p.goz = 1.3; p.sik = 0; p.kas = 0.9; p.savun = 1; p.bak = -1; p.basEg = mix(6, -30, k);
    p.kalk = 64 * Math.pow(k, 0.8); p.bacakBuk = ara(f, P2.KALK + 2, P2.FIRLA);
  }
  if (f >= P2.A8) {
    const a = f - P2.A8;
    p.goz = 1.15; p.kas = 0.7;
    p.bak = Math.sin(a / 7) * 1;
    p.basEg = -4 + 6 * Math.sin(a / 9);
    const ag2 = sesAgiz(f, K_NOLUYO, 1.2);
    p.agiz = { ac: ag2.ac, yuv: ag2.yuv };
  }
  return p;
};

/* ---------------- kameralar ---------------- */
const bak = (k: { x: number; y: number; z: number }, t: V3) => ({
  yaw: (Math.atan2(t[0] - k.x, t[2] - k.z) * 180) / Math.PI,
  pitch: (Math.atan2(t[1] - k.y, Math.hypot(t[0] - k.x, t[2] - k.z)) * 180) / Math.PI,
});
const kamHedef = (pos: V3, t: V3, f: number, cy = 960, extra: Partial<Kam> = {}): Kam => ({ x: pos[0], y: pos[1], z: pos[2], ...bak({ x: pos[0], y: pos[1], z: pos[2] }, t), f, cy, ...extra });

/** çapraz kadraj: sahne `don` derece döndürülür ve kareyi boşluksuz kaplayacak kadar büyütülür */
const kaplama = (don: number) => {
  const r = (Math.abs(don) * Math.PI) / 180, c = Math.cos(r), sn = Math.sin(r);
  return Math.max((1080 * c + 1920 * sn) / 1080, (1080 * sn + 1920 * c) / 1920);
};
type Cekim = { k: Kam; infCap?: boolean; gbCap?: [number, number]; hiz?: number; don?: number };
const kamera = (f: number): Cekim => {
  if (f < P2.A2) return { k: kamHedef([-3.72, 3.42, -1.72], [0.1, -0.35, 4.4], 1150, 960) };
  if (f < P2.A3) {
    const u = (f - P2.A2) / (P2.A3 - P2.A2);
    return { k: kamHedef([-1.95 + 0.12 * u, 2.3, 0.45 + 0.15 * u], [0.05, 0.0, 4.3], 1000, 900) };
  }
  if (f < P2.A4) return { k: kamHedef(dG([-2.2, 0.3, 1.55]), dG([-2.2, 0.24, 3.0]), 960, 960), gbCap: [-480, -200], don: 34 };
  if (f < P2.A5) {
    // horlamaya motive kayma: önce horlayan göbekli, sonra hızlı ama yumuşak kayma, kızın yüzüne kilitlenir
    const u = ara(f, P2.A4 + 16, P2.A4 + 44);
    const a = kamHedef(dG([-0.35, 0.82, 1.25]), dG([-1.85, 0.25, 3.0]), 1000, 860);
    const b = kamHedef(dI([1.4, 0.98, 3.0]), dI([1.4, 0.15, 3.47]), 2350, 690);
    const d = salin(f, 0.5);
    return { k: { x: mix(a.x, b.x, u), y: mix(a.y, b.y, u), z: mix(a.z, b.z, u), yaw: mix(a.yaw, b.yaw, u), pitch: mix(a.pitch, b.pitch, u), f: mix(a.f, b.f, u * u), cy: mix(a.cy ?? 960, b.cy ?? 960, u), sx: d.x, sy: d.y }, infCap: u > 0.3, hiz: f > P2.A4 + 16 && f < P2.A4 + 44 ? Math.sin(((f - P2.A4 - 16) / 28) * Math.PI) : 0 };
  }
  if (f < P2.A6) {
    const u = (f - P2.A5) / (P2.A6 - P2.A5);
    return { k: kamHedef(dK([2.22, 0.36, 4.22 + 0.12 * u]), dK([2.22, 0.24, 5.5]), 1150, 620) };
  }
  if (f < P2.A7) {
    const c0 = P2_SES.ciglik + 5;
    const g = f >= c0 ? 14 * Math.exp(-(f - c0) / 7) + 3 : 0;
    const s = sars(f, g), d = salin(f, 0.6);
    return { k: { ...kamHedef(dI([1.4, 0.98, 3.04]), dI([1.4, 0.15, 3.47]), 2400, 690), sx: s.x + d.x, sy: s.y + d.y }, infCap: true };
  }
  if (f < P2.A8) {
    const g = 16 * Math.exp(-Math.max(0, f - P2.IRK) / 5) * (f >= P2.IRK ? 1 : 0.2);
    const s = sars(f, g);
    return { k: { ...kamHedef([-1.8, 2.05, 0.45], [-0.05, 0.0, 4.35], 960, 930), sx: s.x, sy: s.y } };
  }
  if (f < P2.A9) {
    const d = salin(f, 1.6, 3);
    return { k: { ...kamHedef(dK([1.22, 1.0, 4.05]), dK([1.45, 0.9, 5.45]), 1750, 900), sx: d.x, sy: d.y } };
  }
  return { k: kamHedef(dG([-2.0, 0.16, 1.25]), dG([-2.0, 0.3, 3.0]), 720, 1010), gbCap: [-380, -150], don: 26 };
};

/* ---------------- yardımcılar ---------------- */
let LW_CARP = 1; // çapraz kadrajda sahne büyütülür; çizgi kalınlığı ekrandaki ölçeğe göre
const ciz = (k: Kam, yer: Yer, key: string, el: (lw: number) => React.ReactNode, sy = 1) => {
  const y = yerlestir(k, yer);
  if (!y) return null;
  const tr = sy === 1 ? y.tr : `translate(${y.p.x} ${y.p.y}) scale(1 ${sy}) translate(${-y.p.x} ${-y.p.y}) ${y.tr}`;
  return { z: y.z, el: <g key={key} filter="url(#kd_kaynat)"><g transform={tr}>{el(lwOlcek(y.s * LW_CARP))}</g></g> };
};

const Sahne: React.FC<{ f: number; k: Kam; infCap?: boolean; gbCap?: [number, number] }> = ({ f, k, infCap, gbCap }) => {
  const durum: OdaDurum = { derz: 0, dalga: -1, anaBas: 0, anaLed: 0, sayac: 1, kirmizi: 0, t: f / 30, kaide: true };
  const list: { z: number; el: React.ReactNode }[] = [];
  const add = (c: { z: number; el: React.ReactNode } | null) => { if (c) list.push(c); };
  add(ciz(k, { tip: "dik", o: GOBEK_O, t1: [1, 0, 0], cap: gbCap }, "gb", (lw) => <OdaGobekli p={gobekPoz(f)} lw={lw} />));
  add(ciz(k, { tip: "zemin", o: INF_O, t1: [1, 0, 0], t2: [0, 0, -1], cap: infCap ? [0, -600] : undefined }, "inf", (lw) => <OdaInfluencer p={infPoz(f)} lw={lw} detay={lw < 2.5} />));
  add(ciz(k, { tip: "dik", o: TEYZE_O, t1: [1, 0, 0] }, "ty", (lw) => <OdaTeyze p={teyzePoz(f)} lw={lw} />));
  if (f < P2.FIRLA) {
    add(ciz(k, { tip: "dik", o: KURYE_O, t1: [-1, 0, 0], cap: f >= P2.A5 && f < P2.A6 ? [-560, -150] : undefined }, "ky", (lw) => <KuryeYatan p={kuryePoz(f)} lw={lw} />));
  } else {
    // fırlama: gerilme → ezilme → oturma (squash & stretch)
    const a = f - P2.FIRLA;
    const sy = a < 2 ? 1.08 : a < 4 ? 0.95 : a < 6 ? 1.02 : 1;
    const kp = kuryePoz(f);
    add(ciz(k, { tip: "dik", o: KURYE_COMEL_O, t1: [1, 0, 0], cap: f >= P2.A8 ? [0, -700] : undefined }, "kc", (lw) => <KuryeComel p={kp} lw={lw} konus={kp.agiz} nefes={f / 4} />, sy));
  }
  // düğmenin kırmızı nabzı: odadaki tek kırmızı ışık (çok hafif)
  const bp = proj(k, [KAIDE.x, KAIDE.h + 0.06, KAIDE.z]);
  if (bp.z > 0.3) {
    const r = (0.32 * k.f) / bp.z;
    list.push({ z: bp.z - 0.05, el: <circle key="nabiz" cx={bp.x} cy={bp.y} r={r} fill="url(#p2_nabiz)" opacity={0.55 + 0.35 * Math.sin(f / 14)} /> });
  }
  return <BeyazOda k={k} durum={durum} frame={f} cizimler={list} />;
};

const Altyazi: React.FC<{ f: number }> = ({ f }) => {
  const a = ALTYAZI.find((x) => f >= x.bas && f < x.son);
  if (!a) return null;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 1110, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 64, lineHeight: 1.1, color: "#fff", fontStyle: a.fisilti ? "italic" : "normal", WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>
      {a.metin}
    </div>
  );
};

/* güvenlik kamerası arayüzü (bozulmasız katman). Parametreli: etiket ileride değişebilir. */
export type KayitAyar = { etiket: string; kamNo: string; tarih: string; saat0: number; sayi0: number };
const KAYIT: KayitAyar = { etiket: "REC", kamNo: "KAM 04", tarih: "24.11.2026", saat0: 3 * 3600 + 17 * 60 + 42, sayi0: 127 };

const KayitArayuz: React.FC<{ f: number; a: KayitAyar }> = ({ f, a }) => {
  const sn = a.saat0 + Math.floor(f / 30);
  const hh = String(Math.floor(sn / 3600) % 24).padStart(2, "0"), mm = String(Math.floor(sn / 60) % 60).padStart(2, "0"), ss = String(sn % 60).padStart(2, "0");
  const ms = String(Math.floor(((f % 30) / 30) * 100)).padStart(2, "0");
  const st: React.CSSProperties = { position: "absolute", fontFamily: "'Courier New', 'DejaVu Sans Mono', monospace", fontWeight: 700, color: "#e8eee8", textShadow: "0 0 4px rgba(0,0,0,0.9), 2px 2px 0 rgba(0,0,0,0.6)", letterSpacing: 2 };
  const yan = Math.floor(f / 15) % 2 === 0;
  return (
    <>
      <div style={{ ...st, left: 70, top: 120, fontSize: 46, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 30, height: 30, borderRadius: 15, background: "#ff1a1a", opacity: yan ? 1 : 0.15, boxShadow: yan ? "0 0 12px #ff1a1a" : "none" }} />
        {a.etiket}
      </div>
      <div style={{ ...st, right: 70, top: 124, fontSize: 42 }}>{a.kamNo}</div>
      <div style={{ ...st, left: 70, bottom: 150, fontSize: 40 }}>{a.tarih}&nbsp;&nbsp;{hh}:{mm}:{ss}<span style={{ fontSize: 28, opacity: 0.7 }}>.{ms}</span></div>
      {/* etiketsiz, yavaşça artan küçük sayı (ileride izleyici sayısı olduğu anlaşılacak): göze batmaz */}
      <div style={{ ...st, right: 74, bottom: 156, fontSize: 26, opacity: 0.55, letterSpacing: 1 }}>{String(a.sayi0 + Math.floor(f / 23)).padStart(6, "0")}</div>
      {/* köşe çerçeveleri */}
      {[[50, 90, 1, 1], [1030, 90, -1, 1], [50, 1830, 1, -1], [1030, 1830, -1, -1]].map(([x, y, sx, sy], i) => (
        <div key={i} style={{ position: "absolute", left: x - (sx < 0 ? 60 : 0), top: y - (sy < 0 ? 60 : 0), width: 60, height: 60, borderLeft: sx > 0 ? "4px solid rgba(230,240,230,0.6)" : undefined, borderRight: sx < 0 ? "4px solid rgba(230,240,230,0.6)" : undefined, borderTop: sy > 0 ? "4px solid rgba(230,240,230,0.6)" : undefined, borderBottom: sy < 0 ? "4px solid rgba(230,240,230,0.6)" : undefined }} />
      ))}
    </>
  );
};

const GREN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.6 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")";

export const KdP2Acilis: React.FC<{ kayit?: KayitAyar }> = ({ kayit = KAYIT }) => {
  const frame = useCurrentFrame();
  const kayitta = frame < P2.A2 + 4; // güvenlik kamerası görüntüsü (geçişin ilk kareleri dahil)
  // 15 fps takılma: kayıt görüntüsü her kareyi iki kez gösterir
  const f = kayitta ? Math.floor(frame / 2) * 2 : frame;
  const { k, infCap, gbCap, hiz = 0, don = 0 } = kamera(kayitta ? Math.min(f, P2.A2 - 1) : f);
  const olc = don ? kaplama(don) : 1;
  LW_CARP = olc;
  // parazit yoğunluğu: açılış (siyahtan), kayıt → iç kamera geçişi
  const glitch = frame < 6 ? 1 - frame / 6 : frame >= 86 && frame < 90 ? 0.35 : frame >= 90 && frame < 94 ? 1 : frame >= 94 && frame < 100 ? 0.8 * (1 - (frame - 94) / 6) : 0;
  const kaynat = 1 + (Math.floor(frame / 3) % 4);
  const siyah = frame < 2;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <defs>
          <filter id="kd_kaynat" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={kaynat} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={2.4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="p2_kayma" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`${hiz * 22} ${hiz * 6}`} /></filter>
          <radialGradient id="p2_nabiz"><stop offset="0" stopColor="#ff2030" stopOpacity={0.35} /><stop offset="1" stopColor="#ff2030" stopOpacity={0} /></radialGradient>
          <filter id="p2_cctv" x={0} y={0} width={1080} height={1920} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse">
            <feImage href={BALIKGOZU} x={0} y={0} width={1080} height={1920} preserveAspectRatio="none" result="harita" />
            <feDisplacementMap in="SourceGraphic" in2="harita" scale={BALIKGOZU_OLCEK} xChannelSelector="R" yChannelSelector="G" result="bk" />
            <feColorMatrix in="bk" type="matrix" values="0.358 0.29 0.054 0 0.08  0.164 0.556 0.06 0 0.11  0.141 0.277 0.253 0 0.07  0 0 0 1 0" result="renk" />
            <feGaussianBlur in="renk" stdDeviation={1.3} />
          </filter>
          <filter id="p2_parazit" x={0} y={0} width={1080} height={1920} filterUnits="userSpaceOnUse">
            <feTurbulence type="turbulence" baseFrequency="0.0004 0.06" numOctaves={1} seed={frame} result="t" />
            <feColorMatrix in="t" type="matrix" values="1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1" result="t2" />
            <feDisplacementMap in="SourceGraphic" in2="t2" scale={260 * glitch} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feColorMatrix in="d" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset in="r" dx={18 * glitch} result="r2" />
            <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset in="b" dx={-18 * glitch} result="b2" />
            <feBlend in="r2" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b2" mode="screen" />
          </filter>
        </defs>
        {siyah ? null : (
          <g filter={glitch > 0.02 ? "url(#p2_parazit)" : undefined}>
            <g filter={kayitta && frame < P2.A2 + (glitch > 0.5 ? 4 : 0) ? "url(#p2_cctv)" : undefined}>
              <g filter={hiz > 0.05 ? "url(#p2_kayma)" : undefined} transform={don ? `rotate(${don} 540 960) translate(540 960) scale(${olc}) translate(-540 -960)` : undefined}>
                <Sahne f={f} k={k} infCap={infCap} gbCap={gbCap} />
              </g>
            </g>
          </g>
        )}
        {/* parazit bantları */}
        {glitch > 0.3 ? new Array(Math.round(10 * glitch)).fill(0).map((_, i) => (
          <rect key={i} x={0} y={random(`gy${frame}-${i}`) * 1920} width={1080} height={4 + random(`gh${frame}-${i}`) * 40} fill={random(`gc${frame}-${i}`) > 0.5 ? "#e8f0e8" : "#101410"} opacity={0.25 + 0.5 * random(`go${frame}-${i}`)} />
        )) : null}
        {/* güvenlik kamerası: tarama çizgileri + kenar kararması */}
        {kayitta && frame < P2.A2 ? (
          <g>
            <defs>
              <pattern id="p2_tarama" width={6} height={6} patternUnits="userSpaceOnUse"><rect width={6} height={2} fill="#000" opacity={0.28} /></pattern>
              <radialGradient id="p2_kvin" cx="0.5" cy="0.5" r="0.62"><stop offset="0.6" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.75} /></radialGradient>
            </defs>
            <rect width={1080} height={1920} fill="url(#p2_tarama)" />
            <rect width={1080} height={1920} fill="url(#p2_kvin)" />
            <rect y={((frame * 23) % 2200) - 200} width={1080} height={120} fill="#ffffff" opacity={0.05} />
          </g>
        ) : null}
      </svg>
      {/* gren: her karede kayar */}
      <AbsoluteFill style={{ background: GREN, backgroundPosition: `${Math.floor(random(`gx${frame}`) * 300)}px ${Math.floor(random(`gy${frame}`) * 300)}px`, mixBlendMode: "overlay", opacity: kayitta ? 0.55 : 0.14 }} />
      {kayitta && frame < P2.A2 && !siyah ? <KayitArayuz f={frame} a={kayit} /> : null}
      <Altyazi f={frame} />
    </AbsoluteFill>
  );
};
