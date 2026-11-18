import * as THREE from "three";
import type { HairStyle } from "../studio/rig/types";
import { D2R, cached, orientOutward, paramSurface } from "./toon";
import { FACE_H, FACE_W, FACE_X0, FACE_Y0 } from "./face2d";

/* Kafa geometrisi (elipsoid + çene daralması), yüz dokusu yaması ve saç kabukları. */
export const HEAD = { rx: 0.17, ry: 0.19, rz: 0.165 };

export const headPoint = (az: number, el: number, scale = 1, jaw = 0.22, out = new THREE.Vector3()) => {
  const t = el < 0 ? 1 - jaw * Math.sin(-el) ** 2 : 1 - 0.06 * Math.sin(el) ** 2;
  return out.set(
    HEAD.rx * scale * Math.sin(az) * Math.cos(el) * t,
    HEAD.ry * scale * Math.sin(el),
    HEAD.rz * scale * Math.cos(az) * Math.cos(el) * t,
  );
};

export const headGeometry = (jaw: number) =>
  cached(`head-${jaw}`, () => paramSurface((u, v) => headPoint((u - 0.5) * 2 * Math.PI, (v - 0.5) * Math.PI, 1, jaw), 48, 32));

/* Yüz yaması: SVG yüz koordinatlarını kafa yüzeyine eşler. x 90..310 → az ±75°, y 100..340 → el +60..-60° */
const UMAX = 75 * D2R;
const VMAX = 60 * D2R;
export const faceGeometry = (jaw: number) =>
  cached(`face-${jaw}`, () =>
    paramSurface(
      (u, v) => {
        const az = (u - 0.5) * 2 * UMAX;
        const el = (v - 0.5) * 2 * VMAX;
        return headPoint(az, el, 1.012, jaw);
      },
      40,
      40,
      (u, v) => [u, v],
    ),
  );
// sanity: canvas covers x FACE_X0..+FACE_W → u 0..1, y FACE_Y0..+FACE_H → v 1..0 (flipY)
void FACE_X0; void FACE_Y0; void FACE_W; void FACE_H;

/** Bir yüz noktasının (SVG x,y) kafa üzerindeki 3D konumu */
export const faceToHead = (x: number, y: number, scale = 1.0, jaw = 0.22) => {
  const az = ((x - 200) / 110) * UMAX;
  const el = ((220 - y) / 120) * VMAX;
  return headPoint(az, el, scale, jaw);
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
        { geo: shell("longW", { F: 30, S: -22, B: -40 }, 1.09, { bump: 0.015 }) },
        { geo: cached("longW-back", () => longBack(0.5, 0.025), true) },
      ];
    case "bob":
      return [{ geo: shell("bob", { F: 14, S: -42, B: -55 }, 1.09, { flare: 0.12 }) }];
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
