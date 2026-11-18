import * as THREE from "three";
import type { HairStyle } from "../studio/rig/types";
import { D2R, cached, orientOutward, paramSurface } from "./toon";
import { FACE_H, FACE_W, FACE_X0, FACE_Y0 } from "./face2d";

/* Kafa geometrisi (elipsoid + çene daralması), yüz dokusu yaması ve saç kabukları. */
export const HEAD = { rx: 0.15, ry: 0.19, rz: 0.165 };

/** Saç kabukları: yüz yüzeyinin (kadın profili) ölçeklenmiş hali — az: yatay açı, el: yükseklik açısı */
export const headPoint = (az: number, el: number, scale = 1, _jaw = 0.22, out = new THREE.Vector3()) => {
  const y = 202 - Math.sin(el) * 110;
  headSurf(false, az, Math.max(Y0, Math.min(Y1, y)), scale, out);
  out.y *= scale;
  return out;
};

/* ---- Yüz: 2D tasarımdaki (ilk versiyon) yüz hattı birebir kullanılır ----
   SVG yüz koordinatları: x 116..284, y 92..312 → 3D: k birim/px, merkez (200, 202) */
const K = 0.38 / 220;
const Y0 = 92;
const Y1 = 312;
const FACE_PATHS = {
  m: [[114, 150], [112, 250, 140, 286], [170, 312, 200, 312], [230, 312, 260, 286], [288, 250, 286, 150], [280, 90, 200, 90], [120, 90, 114, 150]],
  f: [[116, 150], [112, 246, 146, 284], [174, 310, 200, 310], [226, 310, 254, 284], [288, 246, 284, 150], [278, 92, 200, 92], [122, 92, 116, 150]],
} as const;

const profileCache = new Map<string, Float32Array>();
/** y (SVG, tamsayı Y0..Y1) → yarım genişlik (SVG px) */
const halfWidth = (male: boolean) => {
  const key = male ? "m" : "f";
  let w = profileCache.get(key);
  if (w) return w;
  w = new Float32Array(Y1 - Y0 + 1);
  const P = FACE_PATHS[key];
  let [px, py] = P[0] as unknown as [number, number];
  for (let i = 1; i < P.length; i++) {
    const [cx, cy, ex, ey] = P[i] as unknown as [number, number, number, number];
    for (let t = 0; t <= 1; t += 0.002) {
      const x = (1 - t) ** 2 * px + 2 * (1 - t) * t * cx + t * t * ex;
      const y = (1 - t) ** 2 * py + 2 * (1 - t) * t * cy + t * t * ey;
      const yi = Math.round(y) - Y0;
      if (yi >= 0 && yi < w.length) w[yi] = Math.max(w[yi], Math.abs(x - 200));
    }
    px = ex;
    py = ey;
  }
  // boşlukları doldur + yumuşat
  for (let i = 1; i < w.length - 1; i++) if (w[i] === 0) w[i] = (w[i - 1] + w[i + 1]) / 2;
  w[0] = Math.max(w[0], 4);
  w[w.length - 1] = Math.max(w[w.length - 1], 4);
  profileCache.set(key, w);
  return w;
};
const wAt = (male: boolean, y: number) => {
  const w = halfWidth(male);
  const f = Math.max(0, Math.min(w.length - 1, y - Y0));
  const i = Math.floor(f);
  const j = Math.min(w.length - 1, i + 1);
  return w[i] + (w[j] - w[i]) * (f - i);
};
/** yan profil derinliği (önden), SVG px */
const dFront = (y: number) => 95 * Math.sqrt(Math.max(0, 1 - ((y - 190) / 124) ** 2)) + 2;
const dBack = (y: number) => 104 * Math.sqrt(Math.max(0, 1 - ((y - 180) / 98) ** 2)) * (y > 278 ? Math.max(0, (312 - y) / 34) : 1) + 2;

/** θ (yatay açı, 0 = ön), ySvg → 3D nokta */
const headSurf = (male: boolean, th: number, y: number, scale = 1, out = new THREE.Vector3()) => {
  const w = wAt(male, y) * (th > Math.PI / 2 || th < -Math.PI / 2 ? Math.max(0.92, 1) : 1);
  const c = Math.cos(th);
  const z = c >= 0 ? dFront(y) * Math.pow(c, 0.65) : -dBack(y) * Math.pow(-c, 0.8);
  return out.set((w * Math.sin(th)) * K * scale, (202 - y) * K, z * K * scale);
};

const jawMale = (jaw: number) => jaw < 0.2;
export const headGeometry = (jaw: number) =>
  cached(`head2-${jawMale(jaw)}`, () => orientOutward(paramSurface((u, v) => headSurf(jawMale(jaw), (u - 0.5) * 2 * Math.PI, Y0 + v * (Y1 - Y0)), 64, 48), new THREE.Vector3(0, 0, 0)));

/** Yüz yaması: yüzeyin ön kısmı, dokusu düz (önden) yansıtılır → 2D yüz çizimi bozulmadan görünür */
export const faceGeometry = (jaw: number) =>
  cached(`face2-${jawMale(jaw)}`, () => {
    const male = jawMale(jaw);
    const g = paramSurface(
      (u, v) => headSurf(male, (u - 0.5) * 2 * (82 * D2R), Y0 + (1 - v) * (Y1 - Y0), 1.004),
      48,
      48,
      (u, v) => {
        const th = (u - 0.5) * 2 * (82 * D2R);
        const y = Y0 + (1 - v) * (Y1 - Y0);
        const x = 200 + wAt(male, y) * Math.sin(th);
        return [(x - 90) / 220, 1 - (y - 100) / 240];
      },
    );
    return orientOutward(g, new THREE.Vector3(0, 0, 0));
  });
void FACE_X0; void FACE_Y0; void FACE_W; void FACE_H;

/** SVG yüz noktasının kafa üzerindeki 3D konumu */
export const faceToHead = (x: number, y: number, scale = 1.0, jaw = 0.22) => {
  const male = jawMale(jaw);
  const w = wAt(male, y);
  const th = Math.asin(Math.max(-1, Math.min(1, (x - 200) / Math.max(1, w))));
  return headSurf(male, th, y, scale);
};
/** Kulak konumu (yanak hizası) */
export const earPos = (jaw: number, side: -1 | 1): [number, number, number] => {
  const p = headSurf(jawMale(jaw), (side * Math.PI) / 2, 212, 1);
  return [p.x + side * 0.004, p.y, -0.01];
};

type Line = { F: number; S: number; B: number };
const mixLine = (L: Line, az: number) => {
  const c = Math.cos(az);
  const wf = Math.max(0, c);
  const wb = Math.max(0, -c);
  const ws = 1 - Math.abs(c);
  return (L.F * wf + L.B * wb + L.S * ws) * D2R;
};

/** Saç kabuğu: saç çizgisi (alt sınır) önde/yanda/arkada derece cinsinden. */
const shell = (key: string, low: Line, scale: number, opts: { top?: Line; flare?: number; bump?: number; part?: number } = {}) =>
  cached(`hair-${key}`, () =>
    orientOutward(paramSurface(
      (u, v) => {
        const az = (u - 0.5) * 2 * Math.PI;
        const lo = mixLine(low, az);
        const hi = opts.top ? mixLine(opts.top, az) : Math.PI / 2;
        const el = lo + v * (hi - lo);
        let s = scale + (opts.flare ?? 0) * (1 - v) ** 2;
        if (opts.bump) s += opts.bump * Math.abs(Math.sin(az * 7) * Math.sin(el * 6));
        if (opts.part) s += opts.part * Math.max(0, Math.cos(az)) * v;
        return headPoint(az, el, s, 0.05);
      },
      64,
      18,
    ), new THREE.Vector3(0, 0, 0)),
  );

export type HairPiece = { geo: THREE.BufferGeometry; pos?: [number, number, number]; rot?: [number, number, number]; scale?: [number, number, number]; shade?: boolean };

const sphere = cached("sph", () => new THREE.SphereGeometry(1, 24, 16));

export const hairPieces = (style: HairStyle): HairPiece[] => {
  switch (style) {
    case "shortMale":
      return [{ geo: shell("short", { F: 34, S: -8, B: -52 }, 1.08, { part: 0.03 }) }];
    case "spiky":
      return [
        { geo: shell("spiky", { F: 34, S: -8, B: -52 }, 1.07) },
        ...[-0.09, -0.03, 0.03, 0.09, 0, -0.06, 0.06].map((x, i): HairPiece => ({
          geo: cached("cone", () => new THREE.ConeGeometry(0.045, 0.12, 12)),
          pos: [x, 0.19 + (i > 4 ? -0.02 : 0), i > 4 ? -0.06 : 0.02],
          rot: [i > 4 ? -0.5 : 0.2, 0, -x * 4],
        })),
      ];
    case "slick":
      return [{ geo: shell("slick", { F: 40, S: -2, B: -48 }, 1.09, { part: 0.05 }) }];
    case "buzz":
      return [{ geo: shell("buzz", { F: 36, S: -2, B: -50 }, 1.03) }];
    case "balding":
      return [{ geo: shell("balding", { F: 12, S: -12, B: -48 }, 1.05, { top: { F: 12, S: 20, B: 30 } }) }];
    case "bald":
      return [];
    case "longStraight":
      return [
        { geo: shell("longS", { F: 42, S: -22, B: -40 }, 1.08, { part: 0.02 }) },
        { geo: cached("longS-back", () => longBack(0.55, 0), true) },
      ];
    case "longWavy":
      return [
        { geo: shell("longW2", { F: 42, S: -22, B: -40 }, 1.09, { bump: 0.015 }) },
        { geo: cached("longW-back", () => longBack(0.5, 0.025), true) },
      ];
    case "bob":
      return [{ geo: shell("bob2", { F: 30, S: -42, B: -55 }, 1.09, { flare: 0.12 }) }];
    case "ponytail":
      return [
        { geo: shell("pony", { F: 36, S: -6, B: -40 }, 1.07) },
        { geo: cached("pony-tail", () => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.1, -0.17), new THREE.Vector3(0, 0.06, -0.26), new THREE.Vector3(0, -0.12, -0.27), new THREE.Vector3(0, -0.34, -0.2)]), 24, 0.055, 12)) },
        { geo: sphere, pos: [0, 0.1, -0.175], scale: [0.03, 0.03, 0.03], shade: true },
      ];
    case "bun":
      return [
        { geo: shell("bun", { F: 36, S: -6, B: -42 }, 1.07) },
        { geo: sphere, pos: [0, 0.2, -0.07], scale: [0.09, 0.08, 0.09] },
      ];
    case "curly":
      return [
        { geo: shell("curly", { F: 30, S: -35, B: -62 }, 1.2, { bump: 0.06 }) },
        ...[[-0.17, 0.08], [0.17, 0.08], [-0.15, -0.06], [0.15, -0.06], [0, 0.2], [-0.1, 0.17], [0.1, 0.17]].map(([x, y]): HairPiece => ({
          geo: sphere, pos: [x, y, -0.04], scale: [0.09, 0.09, 0.09],
        })),
      ];
    case "braids":
      return [
        { geo: shell("braids", { F: 32, S: -10, B: -45 }, 1.07) },
        ...[-1, 1].flatMap((side) =>
          [0, 1, 2, 3, 4].map((i): HairPiece => ({ geo: sphere, pos: [side * (0.15 + i * 0.004), -0.06 - i * 0.065, -0.05], scale: [0.045 - i * 0.003, 0.05, 0.045 - i * 0.003] })),
        ),
      ];
    case "hijab":
      return [{ geo: cached("hijab", () => orientOutward(hijabGeo(), new THREE.Vector3(0, 0, 0))) }, { geo: cached("hijab-drape", hijabDrape, true) }];
    default:
      return [];
  }
};

/** Uzun saçın sırttan sarkan kısmı */
const longBack = (len: number, wave: number) =>
  paramSurface(
    (u, v) => {
      const az = (70 + u * 220) * D2R; // arka ve yanlar
      const y = -0.02 - v * len;
      const r = 0.18 + 0.03 * v + wave * Math.sin(v * 14 + u * 6);
      return new THREE.Vector3(r * Math.sin(az) * 1.05, y, r * Math.cos(az) * 0.85 - 0.02);
    },
    32,
    16,
  );

const hijabGeo = () =>
  paramSurface(
    (u, v) => {
      const th = (58 + v * 122) * D2R; // yüz ekseninden açı
      const ph = u * 2 * Math.PI;
      const dir = new THREE.Vector3(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph) * 1.1 + 0.02, Math.cos(th));
      const az = Math.atan2(dir.x, dir.z);
      const el = Math.asin(Math.max(-1, Math.min(1, dir.y)));
      return headPoint(az, el, 1.13, 0.05);
    },
    48,
    20,
  );

const hijabDrape = () =>
  new THREE.LatheGeometry(
    [new THREE.Vector2(0.15, -0.12), new THREE.Vector2(0.14, -0.2), new THREE.Vector2(0.16, -0.27), new THREE.Vector2(0.22, -0.35), new THREE.Vector2(0.24, -0.4)],
    32,
  );
