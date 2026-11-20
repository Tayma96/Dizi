import React, { useMemo } from "react";
import * as THREE from "three";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import type { Emotion, Gesture, Look, MouthCue, Prop, Viseme } from "../studio/rig/types";
import { FACE_H, FACE_PX, FACE_W, drawFace } from "./face2d";
import { HEAD, earPos, faceGeometry, faceToHead, hairPieces, headGeometry, headPoint } from "./head";
import { hairStrands } from "./textures";
import { D2R, STIL, cached, flat, gloss, outline, tenRengi, toonChar as toon, toonCharTex } from "./toon";
import type { FaceParams } from "../studio/rig/face";
import { EMOTION_FACE } from "../studio/rig/face";

/* =====================================================================
 * 3D karakter: prosedürel, çizgi film gölgeli, mürekkep çizgili.
 * Yüz ifadeleri 2D yüz çiziminden doku olarak giydirilir (lip-sync dahil).
 * Birim ≈ metre; yetişkin boyu ≈ 1.75. Karakter +Z yönüne (kameraya) bakar.
 * ===================================================================== */

/* Jestler: el hedef noktası (gövde yerel koordinatı; kalça=0, +z ön) + dirsek yönü (pole). 2 kemikli IK ile çözülür.
   Hedefler yer imlerine göre tanımlanır: "head" = baş merkezi yüksekliği. x işareti ekran-sağ kol (R) içindir; L için aynalanır. */
export type HandT = { t: [number, number | string, number]; pole: [number, number, number] };
const REST: HandT = { t: [0.25, -0.02, 0.05], pole: [0.3, 0, -1] };
const CHEEK: HandT = { t: [0.075, "head-0.06", 0.17], pole: [1, -1, 0.1] };
export const GESTURES3D: Record<Gesture | "sarilma" | "kapiAc", { L: HandT; R: HandT }> = {
  rest: { L: REST, R: REST },
  elBelde: { L: { t: [0.18, 0.08, 0.0], pole: [1, 0.2, -0.4] }, R: { t: [0.18, 0.08, 0.0], pole: [1, 0.2, -0.4] } },
  kollarBagli: { L: { t: [-0.09, 0.29, 0.17], pole: [1, -0.6, 0] }, R: { t: [-0.07, 0.25, 0.2], pole: [1, -0.6, 0] } },
  isaret: { L: REST, R: { t: [0.24, 0.5, 0.62], pole: [1, -1, 0] } },
  elSalla: { L: REST, R: { t: [0.42, "head+0.1", 0.05], pole: [1, -1, 0] } },
  eliYuzunde: { L: REST, R: CHEEK },
  yudum: { L: REST, R: CHEEK },
  okuma: { L: { t: [0.18, 0.3, 0.3], pole: [1, -0.6, 0] }, R: { t: [0.18, 0.3, 0.3], pole: [1, -0.6, 0] } },
  basTutma: { L: REST, R: CHEEK },
  krem: { L: REST, R: CHEEK },
  golge: { L: REST, R: CHEEK },
  bastir: { L: REST, R: REST },
  havaImza: { L: CHEEK, R: REST },
  havaImzaSol: { L: REST, R: CHEEK },
  kolTut: { L: REST, R: REST },
  okşa: { L: CHEEK, R: REST },
  direksiyon: { L: REST, R: REST },
  yuzGoster: { L: REST, R: CHEEK },
  kafaKasi: { L: REST, R: CHEEK },
  raf: { L: REST, R: CHEEK },
  uzat: { L: REST, R: CHEEK },
  eliKalbinde: { L: REST, R: { t: [-0.04, 0.33, 0.17], pole: [1, -1, 0] } },
  omuzSilk: { L: { t: [0.34, 0.24, 0.22], pole: [0.5, -1, -0.5] }, R: { t: [0.34, 0.24, 0.22], pole: [0.5, -1, -0.5] } },
  yumruk: { L: { t: [0.2, 0.14, 0.13], pole: [0.5, 0, -1] }, R: { t: [0.2, 0.14, 0.13], pole: [0.5, 0, -1] } },
  dusunme: { L: { t: [-0.07, 0.27, 0.18], pole: [1, -0.6, 0] }, R: { t: [0.02, "head-0.16", 0.17], pole: [1, -1, 0] } },
  telefon: { L: REST, R: { t: [0.15, "head-0.02", 0.05], pole: [1, -1, 0] } },
  tutuyor: { L: REST, R: { t: [0.12, 0.22, 0.34], pole: [0.5, -1, -0.5] } },
  ellerAcik: { L: { t: [0.3, 0.2, 0.32], pole: [1, -1, -0.3] }, R: { t: [0.3, 0.2, 0.32], pole: [1, -1, -0.3] } },
  ellerYuzde: { L: CHEEK, R: CHEEK },
  durDur: { L: REST, R: { t: [0.12, 0.5, 0.48], pole: [1, -1, 0] } },
  sarilma: { L: { t: [0.2, 0.36, 0.45], pole: [1, 0, -0.2] }, R: { t: [0.2, 0.36, 0.45], pole: [1, 0, -0.2] } },
  kapiAc: { L: REST, R: { t: [0.24, 0.26, 0.5], pole: [1, -1, -0.2] } },
};

const _up = new THREE.Vector3(0, -1, 0);
/** 2 kemik IK: omuz S, hedef T, uzunluklar a,b, dirsek yönü P → üst kol ve ön kol yönleri */
const solveArm = (S: THREE.Vector3, T: THREE.Vector3, a: number, b: number, P: THREE.Vector3) => {
  const st = T.clone().sub(S);
  const d = Math.min(a + b - 1e-3, Math.max(Math.abs(a - b) + 1e-3, st.length()));
  const dir = st.normalize();
  const cosA = (a * a + d * d - b * b) / (2 * a * d);
  const alpha = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const perp = P.clone().sub(dir.clone().multiplyScalar(P.dot(dir)));
  if (perp.lengthSq() < 1e-6) perp.set(0, 0, -1);
  perp.normalize();
  const E = S.clone().add(dir.clone().multiplyScalar(Math.cos(alpha) * a)).add(perp.multiplyScalar(Math.sin(alpha) * a));
  const Tc = S.clone().add(dir.multiplyScalar(d));
  const qUpper = new THREE.Quaternion().setFromUnitVectors(_up, E.clone().sub(S).normalize());
  const qFore = new THREE.Quaternion().setFromUnitVectors(_up, Tc.clone().sub(E).normalize());
  const qForeLocal = qUpper.clone().invert().multiply(qFore);
  return { qUpper, qForeLocal };
};

export type Pose3D = {
  emotion?: Emotion;
  gesture?: Gesture | "sarilma" | "kapiAc";
  /** gövdenin dönüşü (derece). 0 = kameraya bakar, 90 = sağa, 180 = arkası dönük */
  turn?: number;
  /** başın gövdeye göre dönüşü / eğimi / bakışı (derece) */
  headYaw?: number;
  headPitch?: number;
  headTilt?: number;
  lookX?: number;
  lookY?: number;
  body?: "stand" | "sit" | "walk";
  /** yürüme adım genliği 0..1 (yumuşak başlayıp durma) */
  walkAmt?: number;
  speech?: { cues: MouthCue[]; from: number };
  talk?: [number, number][];
  tears?: number;
  pale?: number;
  sweat?: boolean;
  prop?: Prop;
  eyesClosed?: number;
  seed?: number;
};

const AGE3 = {
  child: { body: 0.58, head: 0.92, limb: 0.85 },
  teen: { body: 0.86, head: 0.97, limb: 0.95 },
  adult: { body: 1, head: 1, limb: 1 },
  old: { body: 0.97, head: 1, limb: 1 },
} as const;
const BUILD3 = { slim: 0.9, normal: 1, heavy: 1.25 } as const;
const SHORT = new Set(["tshirt", "dress", "police"]);

const currentViseme = (cues: MouthCue[], time: number): Viseme | null => {
  if (!cues.length || time < cues[0].t - 0.02) return null;
  if (time > cues[cues.length - 1].t + 0.15) return null;
  let v: Viseme = "X";
  for (const c of cues) {
    if (c.t <= time + 0.02) v = c.v;
    else break;
  }
  return v;
};

/** Mürekkep çizgili toon mesh */
const M: React.FC<{
  geo: THREE.BufferGeometry;
  color: string;
  pos?: [number, number, number];
  rot?: [number, number, number];
  scale?: [number, number, number] | number;
  line?: number;
  map?: THREE.Texture;
}> = ({ geo, color, pos, rot, scale, line = 0.006, map }) => (
  <group position={pos} rotation={rot} scale={scale}>
    <mesh geometry={geo} material={map ? toonCharTex(color, map, "hair") : toon(color)} />
    {line > 0 ? <mesh geometry={geo} material={outline(line)} /> : null}
  </group>
);

const SPH = cached("sph32", () => new THREE.SphereGeometry(1, 32, 20));
const capsule = (r: number, len: number) => cached(`cap-${r}-${len}`, () => new THREE.CapsuleGeometry(r, len, 6, 16));
const cyl = (r1: number, r2: number, h: number) => cached(`cyl-${r1}-${r2}-${h}`, () => new THREE.CylinderGeometry(r1, r2, h, 20));
const box = (x: number, y: number, z: number) => cached(`box-${x}-${y}-${z}`, () => new THREE.BoxGeometry(x, y, z));

/* ------------------------------ torso profiles ------------------------------ */
const torsoGeo = (kind: "base" | "long" | "dress" | "skirt") =>
  cached(`torso-${kind}`, () => {
    const pts: [number, number][] =
      kind === "long"
        ? [[0.001, -0.36], [0.2, -0.36], [0.18, -0.1], [0.16, 0.05], [0.146, 0.18], [0.166, 0.32], [0.19, 0.42], [0.17, 0.47], [0.07, 0.5]]
        : [[0.001, -0.02], [0.152, -0.02], [0.16, 0.05], [0.145, 0.18], [0.165, 0.32], [0.19, 0.42], [0.17, 0.47], [0.07, 0.5]];
    const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 32);
    g.scale(1, 1, 0.7);
    return g;
  }, true);
const skirtGeo = (len: number, flare: number) =>
  cached(`skirt-${len}-${flare}`, () => {
    const g = new THREE.LatheGeometry([new THREE.Vector2(0.001, -len), new THREE.Vector2(flare, -len), new THREE.Vector2(0.17, -0.05), new THREE.Vector2(0.15, 0.06)], 32);
    g.scale(1, 1, 0.75);
    return g;
  }, true);

/* ------------------------------ props ------------------------------ */
const Prop3D: React.FC<{ prop: Prop }> = ({ prop }) => {
  switch (prop) {
    case "telefon":
      return <M geo={box(0.07, 0.14, 0.012)} color="#222630" pos={[0, 0.06, 0.03]} line={0.003} />;
    case "poset":
      return (
        <group position={[0, -0.16, 0]}>
          <M geo={box(0.2, 0.24, 0.1)} color="#f3f1ea" line={0.004} />
          <M geo={capsule(0.035, 0.18)} color="#d79a4e" pos={[-0.03, 0.16, 0]} rot={[0, 0, 0.2]} line={0.004} />
        </group>
      );
    case "fincan":
      return <M geo={cyl(0.04, 0.032, 0.08)} color="#f4eee4" pos={[0, 0.05, 0.03]} line={0.003} />;
    case "mektup":
      return <M geo={box(0.16, 0.1, 0.006)} color="#f3ead6" pos={[0, 0.04, 0.04]} line={0.003} />;
    case "canta":
      return <M geo={box(0.22, 0.16, 0.08)} color="#8a3b3b" pos={[0, -0.14, 0]} line={0.004} />;
    case "cicek":
      return (
        <group position={[0, 0.1, 0.03]}>
          <M geo={cyl(0.01, 0.01, 0.22)} color="#3f7a3a" line={0} />
          {[[-0.04, 0.12], [0.03, 0.14], [0.0, 0.1]].map(([x, y], i) => (
            <M key={i} geo={SPH} color={i === 1 ? "#f2c14e" : "#e2506a"} pos={[x, y, 0]} scale={0.035} line={0.003} />
          ))}
        </group>
      );
    case "bicak":
      return <M geo={box(0.02, 0.22, 0.004)} color="#d7dde3" pos={[0, 0.12, 0.02]} line={0.003} />;
    case "anahtar":
      return <M geo={box(0.012, 0.07, 0.004)} color="#c9a75a" pos={[0, 0.03, 0.03]} line={0.002} />;
    case "kalem":
      return <M geo={cyl(0.007, 0.006, 0.15)} color="#c9a75a" pos={[0, 0.05, 0.03]} rot={[0.6, 0, 0]} line={0.002} />;
    case "tepsi":
      return (
        <group position={[0, 0.0, 0.12]}>
          <M geo={box(0.32, 0.015, 0.22)} color="#c8ccd2" line={0.003} />
          <M geo={cyl(0.025, 0.02, 0.045)} color="#f4f4f4" pos={[0.06, 0.03, 0]} line={0.002} />
          <M geo={cyl(0.03, 0.025, 0.07)} color="#dff0ff" pos={[-0.07, 0.04, 0]} line={0.002} />
        </group>
      );
    case "ilac":
      return <M geo={cyl(0.022, 0.018, 0.04)} color="#f4f4f4" pos={[0, 0.04, 0.03]} line={0.002} />;
    case "kitap":
      return <M geo={box(0.16, 0.21, 0.035)} color="#3b5d8a" pos={[0, 0.04, 0.04]} line={0.004} />;
    default:
      return null;
  }
};


/* ------------------------------ film stili: göz, burun, el ------------------------------ */
const EYE_R = 0.034;
const capGeo = (r: number, theta: number) => cached(`cap-${r}-${theta}`, () => new THREE.SphereGeometry(r, 40, 16, 0, Math.PI * 2, 0, theta));
const lidGeo = (r: number, upper: boolean) => cached(`lid-${r}-${upper}`, () => new THREE.SphereGeometry(r, 40, 20, 0, Math.PI * 2, upper ? 0 : Math.PI / 2, Math.PI / 2));
const lashGeo = (r: number, t: number) => cached(`lash-${r}-${t}`, () => new THREE.TorusGeometry(r, t, 6, 32, Math.PI));

/** 3D göz: göz akı, iris, göz bebeği, ışık parlaması; üst/alt kapak açıklık, göz kırpma, gülümseme ve duyguya göre döner. */
const Eye3D: React.FC<{ look: Look; f: FaceParams; side: -1 | 1; blink: number; lookX: number; lookY: number; jaw: number }> = ({ look, f, side, blink, lookX, lookY, jaw }) => {
  const female = look.gender === "f" && look.age !== "child";
  // kadında daha büyük göz; erkekte biraz küçük ve hafif düşük kapak (keskin bakış)
  const r = EYE_R * (look.age === "child" ? 1.12 : female ? 1.1 : 0.94);
  const surf = faceToHead(200 + side * 40, 196, 1, jaw);
  const c: [number, number, number] = [surf.x * 0.96, surf.y, surf.z - r * 0.5];
  const open = f.eyeOpen * (1 - blink);
  // üst kapak: açık gözde irisin üst kenarına değer; kapanınca aşağı iner
  const upper = f.eyeSmile ? 0.1 : 0.42 - Math.min(1.35, open) * 1.12 + (female ? 0 : 0.16);
  // alt kapak: dinlenmede gözün altında, gülümsemede yukarı
  const lower = f.eyeSmile ? -0.05 : 0.95 - Math.max(0, open - 1) * 0.3;
  // kapak eğimi: öfke → iç köşe aşağı, üzüntü → dış köşe aşağı
  const tilt = Math.max(-0.35, Math.min(0.35, (f.browOuter - f.browInner) * 0.03)) * side;
  return (
    <group position={c} rotation={[0, side * 0.12, 0]}>
      {/* göz küresi + iris (bakış yönüne döner) */}
      <group rotation={[-lookY * 0.3, lookX * 0.42, 0]}>
        <mesh geometry={SPH} material={gloss("#f5f1ea", 0.25)} scale={r} />
        <mesh geometry={capGeo(r * 1.004, 0.62)} material={gloss(look.iris, 0.12)} rotation={[Math.PI / 2, 0, 0]} />
        <mesh geometry={capGeo(r * 1.008, 0.3 * f.pupil)} material={gloss("#0d0806", 0)} rotation={[Math.PI / 2, 0, 0]} />
      </group>
      {/* ışık parlaması (gözle dönmez) */}
      <mesh geometry={SPH} material={flat("#ffffff")} scale={r * 0.16} position={[r * 0.3, r * 0.38, r * 0.92]} />
      <mesh geometry={SPH} material={flat("#ffffff", 0.7)} scale={r * 0.07} position={[-r * 0.25, -r * 0.2, r * 0.97]} />
      {/* kapaklar */}
      <group rotation={[0, 0, tilt]}>
        <group rotation={[upper, 0, 0]}>
          <mesh geometry={lidGeo(r * 1.035, true)} material={toon(look.skin)} />
          <mesh geometry={lashGeo(r * 1.035, female ? 0.0055 : 0.0032)} material={flat("#1c110c")} rotation={[Math.PI / 2, 0, 0]} />
          {female ? (
            <mesh geometry={capsule(0.0035, 0.012)} material={flat("#1c110c")} position={[side * r * 1.02, r * 0.1, r * 0.1]} rotation={[0, 0, -side * 1.0]} />
          ) : null}
        </group>
        <group rotation={[lower, 0, 0]}>
          <mesh geometry={lidGeo(r * 1.03, false)} material={toon(look.skin)} />
        </group>
      </group>
    </group>
  );
};

const Nose3D: React.FC<{ look: Look; jaw: number }> = ({ look, jaw }) => {
  const male = look.gender === "m";
  const k = (male ? 1.05 : 0.76) * (look.age === "child" ? 0.75 : 1);
  const tip = faceToHead(200, 236, 1, jaw);
  const bridge = faceToHead(200, 214, 1, jaw);
  // tek parça yumuşak burun: ince köprü + küçük yuvarlak uç (yumru yok)
  return (
    <group>
      <mesh geometry={SPH} material={toon(look.skin)} scale={[0.011 * k, 0.034 * k, 0.012 * k]} position={[bridge.x, (bridge.y + tip.y) / 2 + 0.004, (bridge.z + tip.z) / 2 + 0.001]} rotation={[-0.32, 0, 0]} />
      <mesh geometry={SPH} material={toon(look.skin)} scale={[0.016 * k, 0.013 * k, 0.014 * k]} position={[tip.x, tip.y + 0.002, tip.z + 0.006 * k]} />
    </group>
  );
};

/** Parmaklı el: avuç + 4 parmak + başparmak, hafif kıvrık dinlenme hali. */
const Hand3D: React.FC<{ side: -1 | 1; color: string; prop?: Prop }> = ({ side, color, prop }) => (
  <group>
    <mesh geometry={SPH} material={toon(color)} scale={[0.024, 0.045, 0.04]} />
    {[-0.027, -0.009, 0.009, 0.026].map((z, i) => (
      <group key={i} position={[side * -0.004, -0.038, z]} rotation={[0, 0, side * 0.32]}>
        <mesh geometry={capsule(0.0085, i === 0 || i === 3 ? 0.026 : 0.032)} material={toon(color)} position={[0, -0.018, 0]} />
      </group>
    ))}
    <group position={[side * -0.012, -0.004, 0.034]} rotation={[0.5, 0, side * -0.5]}>
      <mesh geometry={capsule(0.0095, 0.026)} material={toon(color)} position={[0, -0.016, 0]} />
    </group>
    {side === 1 && prop && prop !== "none" ? <Prop3D prop={prop} /> : null}
  </group>
);

/* ------------------------------ main ------------------------------ */
export const Character3D: React.FC<{ look: Look; pose?: Pose3D; position?: [number, number, number] }> = ({ look: look0, pose = {}, position = [0, 0, 0] }) => {
  const look = useMemo(() => ({ ...look0, skin: tenRengi(look0.skin), skinShade: tenRengi(look0.skinShade) }), [look0]);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seed = pose.seed ?? look.name.length * 7;
  const emo = pose.emotion ?? "notr";
  const age = AGE3[look.age];
  const wx = BUILD3[look.build];
  const male = look.gender === "m";
  const out = look.outfit;
  const jaw = male ? 0.16 : 0.26;

  // ---- motion
  const breathAmt = emo === "korkmus" || emo === "ofkeli" || emo === "agliyor" ? 2 : 1;
  const breathe = Math.sin((frame + seed * 13) / (breathAmt > 1.5 ? 9 : 22)) * 0.012 * breathAmt;
  const sob = emo === "agliyor" ? Math.max(0, Math.sin(frame / 4)) * 0.006 : 0;
  const sway = Math.sin((frame + seed * 7) / 40) * 1.2;
  const walking = pose.body === "walk";
  const sitting = pose.body === "sit";
  const wp = walking ? Math.sin(frame / 5) * (pose.walkAmt ?? 1) : 0;
  const bob = walking ? Math.abs(Math.cos(frame / 5)) * 0.025 * (pose.walkAmt ?? 1) : 0;

  // ---- blink & mouth
  const period = Math.round(fps * (2.8 + random(`b-${seed}`) * 2.4));
  const t = (frame + Math.round(random(`bo-${seed}`) * period)) % period;
  const blink = Math.max(interpolate(t, [0, 2, 4, 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), pose.eyesClosed ?? 0);
  let vis: Viseme | null = pose.speech ? currentViseme(pose.speech.cues, (frame - pose.speech.from) / fps) : null;
  if (!vis && pose.talk?.some(([a, b]) => frame >= a && frame < b)) {
    const opts: Viseme[] = ["A", "E", "L", "O", "M", "I", "L", "A"];
    vis = opts[Math.floor(random(`t-${seed}-${Math.floor(frame / 3)}`) * opts.length)];
  }

  // ---- face texture (redrawn each frame)
  const face = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = FACE_W * FACE_PX;
    canvas.height = FACE_H * FACE_PX;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -8 });
    return { canvas, tex, mat };
  }, []);
  const ctx = face.canvas.getContext("2d")!;
  drawFace(ctx, look, {
    emotion: emo,
    viseme: vis,
    lookX: pose.lookX ?? 0,
    lookY: pose.lookY ?? 0,
    blink,
    tears: pose.tears ?? (emo === "agliyor" ? 0.8 : 0),
    pale: pose.pale ?? (emo === "sok" ? 0.6 : 0),
    sweat: pose.sweat,
    frame,
    eyes3d: STIL.film,
  });
  face.tex.needsUpdate = true;

  // ---- arms (IK)
  const g = GESTURES3D[pose.gesture ?? "rest"] ?? GESTURES3D.rest;
  const sleeve = out.type === "labcoat" ? "#f2f2ee" : out.type === "school" ? "#f6f5f0" : out.top;
  const short = SHORT.has(out.type);
  const limbR = 0.048 * age.limb * (look.build === "heavy" ? 1.2 : 1);
  const upLen = 0.25 * age.limb;
  const foreLen = 0.21 * age.limb;
  const shoulderX = 0.19 * wx;
  const shoulderY = 0.43 * age.body;
  const headYc = 0.56 * age.body - 0.02 + HEAD.ry * age.head;
  const resolveY = (y: number | string) => (typeof y === "number" ? y * age.body : headYc + parseFloat(y.slice(4)));
  const solve = (side: -1 | 1, h: HandT) => {
    const T = new THREE.Vector3(side * h.t[0] * (h.t[0] > 0.12 ? wx : 1), resolveY(h.t[1]), h.t[2] * (age.limb));
    if (walking && h === REST) T.z += side * wp * 0.14;
    if (pose.gesture === "elSalla" && side === 1) T.x += Math.sin(frame / 3) * 0.08;
    const P = new THREE.Vector3(side * h.pole[0], h.pole[1], h.pole[2]);
    return solveArm(new THREE.Vector3(side * shoulderX, shoulderY, 0), T, upLen, foreLen + 0.04, P);
  };
  const ikL = solve(-1, g.L);
  const ikR = solve(1, g.R);

  const Arm = ({ side, ik }: { side: -1 | 1; ik: ReturnType<typeof solveArm> }) => (
    <group position={[side * shoulderX, shoulderY, 0]} quaternion={ik.qUpper}>
      <M geo={capsule(limbR * 1.12, upLen * 0.9)} color={short ? look.skin : sleeve} pos={[0, -upLen / 2, 0]} />
      {short ? <M geo={capsule(limbR * 1.28, upLen * 0.35)} color={out.top} pos={[0, -upLen * 0.22, 0]} /> : null}
      <group position={[0, -upLen, 0]} quaternion={ik.qForeLocal}>
        <M geo={capsule(limbR, foreLen * 0.9)} color={short ? look.skin : sleeve} pos={[0, -foreLen / 2, 0]} />
        {!short ? <M geo={cyl(limbR * 1.15, limbR * 1.15, 0.03)} color={out.topShade} pos={[0, -foreLen + 0.02, 0]} line={0.003} /> : null}
        <group position={[0, -foreLen - 0.04, 0]}>
          {STIL.film ? (
            <Hand3D side={side} color={look.skin} prop={pose.prop} />
          ) : (
            <>
              <M geo={SPH} color={look.skin} scale={[0.052, 0.058, 0.045]} />
              <M geo={SPH} color={look.skin} scale={[0.02, 0.03, 0.02]} pos={[side * -0.04, 0.01, 0.025]} line={0.003} />
              {side === 1 && pose.prop && pose.prop !== "none" ? <Prop3D prop={pose.prop} /> : null}
            </>
          )}
        </group>
      </group>
    </group>
  );

  // ---- legs
  const skirtGirl = out.type === "dress" || (out.type === "school" && !male);
  const legColor = skirtGirl ? look.skin : out.bottom;
  const thigh = 0.4 * age.body;
  const shin = 0.36 * age.body;
  const legR = 0.068 * (look.build === "heavy" ? 1.2 : 1) * age.limb;
  const Leg = ({ side }: { side: -1 | 1 }) => {
    const hipFlex = sitting ? 88 : walking ? side * wp * 24 : 0;
    const knee = sitting ? -88 : walking ? -Math.max(0, -side * wp) * 35 : 0;
    return (
      <group position={[side * 0.085 * wx, 0, 0]} rotation={[-hipFlex * D2R, 0, side * 1.5 * D2R]}>
        <M geo={capsule(legR, thigh * 0.85)} color={legColor} pos={[0, -thigh / 2, 0]} />
        <group position={[0, -thigh, 0]} rotation={[-knee * D2R, 0, 0]}>
          <M geo={capsule(legR * 0.88, shin * 0.85)} color={legColor} pos={[0, -shin / 2, 0]} />
          <M geo={SPH} color={out.shoes} scale={[0.065, 0.05, 0.11]} pos={[0, -shin - 0.035, 0.035]} />
        </group>
      </group>
    );
  };
  const hipY = sitting ? 0.47 : thigh + shin + 0.06;

  // ---- head
  const hp = hairPieces(look.hair.style);
  const headY = 0.56 * age.body - 0.02 + HEAD.ry * age.head;
  const headRot = new THREE.Euler(
    ((pose.headPitch ?? 0) + (emo === "uzgun" || emo === "agliyor" ? 6 : 0)) * D2R,
    (pose.headYaw ?? 0) * D2R,
    ((pose.headTilt ?? 0) + sway * 0.6) * D2R,
    "YXZ",
  );
  const torsoKind = out.type === "coat" || out.type === "labcoat" ? "long" : "base";
  const front = (y: number, r: number) => r * 0.7 + 0.004 + y * 0;

  return (
    <group position={position} rotation={[0, (pose.turn ?? 0) * D2R, 0]}>
      {/* blob shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} material={flat("#000", 0.22)}>
        <circleGeometry args={[0.32 * wx, 24]} />
      </mesh>
      <group position={[0, hipY + bob, 0]}>
        <Leg side={-1} />
        <Leg side={1} />
        {/* torso */}
        <group position={[0, sob, 0]}>
          <group scale={[wx, age.body * (1 + breathe), wx]}>
            <M geo={torsoGeo(torsoKind)} color={out.top} />
            {skirtGirl ? <M geo={skirtGeo(out.type === "dress" ? 0.42 : 0.3, out.type === "dress" ? 0.3 : 0.25)} color={out.type === "dress" ? out.top : out.bottom} /> : null}
            {/* outfit details on the chest front */}
            {out.type === "shirt" || out.type === "school" || out.type === "police" || out.type === "suit" ? (
              <>
                <M geo={box(0.06, 0.035, 0.01)} color={out.type === "suit" || out.type === "school" ? "#f4f2ec" : out.topShade} pos={[-0.035, 0.465, 0.07]} rot={[0.3, 0, 0.5]} line={0.003} />
                <M geo={box(0.06, 0.035, 0.01)} color={out.type === "suit" || out.type === "school" ? "#f4f2ec" : out.topShade} pos={[0.035, 0.465, 0.07]} rot={[0.3, 0, -0.5]} line={0.003} />
              </>
            ) : null}
            {(out.type === "shirt" || out.type === "suit" || out.type === "school") && out.accent ? (
              <M geo={box(0.035, 0.17, 0.008)} color={out.accent} pos={[0, 0.36, front(0.36, 0.165) + 0.004]} rot={[-0.1, 0, 0]} line={0.003} />
            ) : null}
            {out.type === "suit" || out.type === "coat" ? (
              <>
                <M geo={box(0.05, 0.2, 0.006)} color={out.topShade} pos={[-0.05, 0.37, front(0.37, 0.168) + 0.002]} rot={[-0.1, 0, 0.35]} line={0.003} />
                <M geo={box(0.05, 0.2, 0.006)} color={out.topShade} pos={[0.05, 0.37, front(0.37, 0.168) + 0.002]} rot={[-0.1, 0, -0.35]} line={0.003} />
              </>
            ) : null}
            {out.type === "shirt" || out.type === "police" || out.type === "coat" || out.type === "suit" || out.type === "cardigan"
              ? [0.12, 0.2, 0.28].map((y) => <M key={y} geo={SPH} color={out.type === "cardigan" ? out.topShade : "#2b1d1a"} scale={0.009} pos={[out.type === "cardigan" ? -0.035 : 0.012, y, front(y, 0.15) + 0.002]} line={0} />)
              : null}
            {out.type === "cardigan" || out.type === "labcoat" ? <M geo={box(0.06, 0.4, 0.006)} color={out.accent ?? "#eee"} pos={[0, 0.25, front(0.25, 0.155) + 0.002]} line={0.003} /> : null}
            {out.type === "apron" ? <M geo={box(0.22, 0.42, 0.008)} color={out.accent ?? "#f3efe6"} pos={[0, 0.16, front(0.16, 0.16) + 0.004]} line={0.004} /> : null}
            {out.type === "police" ? (
              <>
                <M geo={cyl(0.158, 0.158, 0.035)} color="#1c1c1c" pos={[0, 0.02, 0]} scale={[1, 1, 0.72]} line={0.003} />
                <M geo={box(0.03, 0.035, 0.006)} color="#d9b45a" pos={[0.07, 0.34, front(0.34, 0.165) + 0.004]} line={0.002} />
              </>
            ) : null}
            {out.type === "hoodie" ? <M geo={cached("hood", () => new THREE.TorusGeometry(0.08, 0.035, 12, 24))} color={out.topShade} pos={[0, 0.49, -0.05]} rot={[1.2, 0, 0]} /> : null}
            {out.type === "sweater" ? <M geo={cyl(0.155, 0.155, 0.03)} color={out.topShade} pos={[0, 0.0, 0]} scale={[1, 1, 0.72]} line={0.003} /> : null}
          </group>
          <group>
            {/* arms */}
            <Arm side={-1} ik={ikL} />
            <Arm side={1} ik={ikR} />
            {/* neck + head */}
            {/* boyun: film stilinde çenenin arkasından başlar ve çene gölgesinde kalır (çene boyundan ayrılır) */}
            <M geo={STIL.film ? cyl(0.034, 0.042, 0.085) : cyl(0.038, 0.045, 0.07)} color={look.hair.style === "hijab" ? look.hair.color : STIL.film ? look.skinShade : look.skin} pos={[0, 0.53 * age.body + 0.01, STIL.film ? -0.032 : -0.01]} line={0.004} />
            <group position={[0, headY, 0]} scale={age.head} rotation={headRot}>
              <M geo={headGeometry(jaw)} color={look.skin} line={0.009} />
              <mesh geometry={faceGeometry(jaw)} material={face.mat} renderOrder={2} />
              {STIL.film ? (
                <>
                  <Eye3D look={look} f={EMOTION_FACE[emo] ?? EMOTION_FACE.notr} side={-1} blink={blink} lookX={pose.lookX ?? 0} lookY={pose.lookY ?? 0} jaw={jaw} />
                  <Eye3D look={look} f={EMOTION_FACE[emo] ?? EMOTION_FACE.notr} side={1} blink={blink} lookX={pose.lookX ?? 0} lookY={pose.lookY ?? 0} jaw={jaw} />
                  <Nose3D look={look} jaw={jaw} />
                </>
              ) : null}
              {/* ears */}
              {look.hair.style !== "hijab" ? (
                <>
                  <M geo={SPH} color={look.skin} scale={STIL.film ? [0.02, 0.046, 0.032] : [0.016, 0.04, 0.028]} pos={earPos(jaw, -1)} line={0.005} />
                  <M geo={SPH} color={look.skin} scale={STIL.film ? [0.02, 0.046, 0.032] : [0.016, 0.04, 0.028]} pos={earPos(jaw, 1)} line={0.005} />
                </>
              ) : null}
              {look.earrings && look.hair.style !== "hijab" ? (
                <>
                  <M geo={SPH} color={look.earrings} scale={0.01} pos={[-HEAD.rx * 0.99, -0.055, 0]} line={0.002} />
                  <M geo={SPH} color={look.earrings} scale={0.01} pos={[HEAD.rx * 0.99, -0.055, 0]} line={0.002} />
                </>
              ) : null}
              {hp.map((h, i) => (
                <M key={i} geo={h.geo} color={h.shade ? look.outfit.accent ?? look.hair.shade : look.hair.color} pos={h.pos} rot={h.rot} scale={h.scale} line={0.008} map={h.shade || look.hair.style === "hijab" ? undefined : hairStrands()} />
              ))}
              {STIL.film ? <HairLocks look={look} /> : null}
              {look.glasses ? <Glasses color={look.glasses} jaw={jaw} /> : null}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};


/* ---- film stili saç tutamları: uca doğru incelen kıvrımlı tüpler ---- */
type LockDef = { pts: [number, number, number][]; r0: number; r1: number };
const lockGeo = (key: string, d: LockDef) =>
  cached(`lock-${key}`, () => {
    const curve = new THREE.CatmullRomCurve3(d.pts.map(([az, el, sc]) => headPoint(az, el * D2R, sc, 0.05).clone()));
    const TS = 40;
    const RS = 10;
    const g = new THREE.TubeGeometry(curve, TS, 1, RS, false);
    const pos = g.attributes.position;
    for (let i = 0; i <= TS; i++) {
      const t = i / TS;
      const c = curve.getPointAt(t);
      const r = (d.r0 + (d.r1 - d.r0) * t) * (t < 0.08 ? 0.6 + t * 5 : 1);
      for (let j = 0; j <= RS; j++) {
        const k = i * (RS + 1) + j;
        const v = new THREE.Vector3(pos.getX(k), pos.getY(k), pos.getZ(k)).sub(c);
        v.setLength(r);
        // tutamlar yassı: kafaya dik yönde ince
        const n = c.clone().normalize();
        const along = v.dot(n);
        v.addScaledVector(n, -along * 0.45);
        pos.setXYZ(k, c.x + v.x, c.y + v.y, c.z + v.z);
      }
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  });

const LOCKS: Record<string, LockDef[]> = {
  // kadın: yandan perçem + yüzü çerçeveleyen iki tutam
  kadin: [
    { pts: [[-0.4, 62, 1.1], [0.05, 46, 1.13], [0.5, 32, 1.11], [0.85, 16, 1.07], [1.0, 2, 1.05]], r0: 0.026, r1: 0.008 },
    { pts: [[-0.15, 58, 1.1], [0.25, 44, 1.12], [0.62, 28, 1.1], [0.9, 10, 1.06]], r0: 0.022, r1: 0.007 },
    { pts: [[-0.95, 30, 1.08], [-1.12, 8, 1.07], [-1.2, -18, 1.07], [-1.12, -42, 1.08]], r0: 0.02, r1: 0.007 },
    { pts: [[1.05, 22, 1.08], [1.18, 0, 1.07], [1.22, -24, 1.07], [1.14, -46, 1.08]], r0: 0.02, r1: 0.007 },
  ],
  // erkek: saç çizgisinin üstünden başlayıp yukarı ve yana taranan hacim (quiff), uçlar kafaya yatar
  erkek: [-0.5, -0.22, 0.06, 0.34].map((a, i) => ({
    pts: [[a, 40, 1.07], [a + 0.18, 52, 1.16], [a + 0.42, 64, 1.13], [a + 0.7, 74, 1.07]] as [number, number, number][],
    r0: 0.032 - i * 0.002,
    r1: 0.01,
  })),
};

const HairLocks: React.FC<{ look: Look }> = ({ look }) => {
  const st = look.hair.style;
  const set = look.gender === "f" && ["bun", "ponytail", "longStraight", "longWavy", "bob", "braids"].includes(st) ? "kadin" : look.gender === "m" && (st === "shortMale" || st === "slick") ? "erkek" : null;
  if (!set) return null;
  return (
    <group>
      {LOCKS[set].map((d, i) => (
        <mesh key={i} geometry={lockGeo(`${set}-${i}`, d)} material={toonCharTex(look.hair.color, hairStrands(), "hair")} />
      ))}
    </group>
  );
};

const Glasses: React.FC<{ color: string; jaw: number }> = ({ color, jaw }) => {
  const ring = cached("glass-ring", () => new THREE.TorusGeometry(0.032, 0.0045, 8, 28));
  const l = faceToHead(160, 198, 1.12, jaw);
  const r = faceToHead(240, 198, 1.12, jaw);
  return (
    <group>
      <mesh geometry={ring} material={toon(color)} position={l} rotation={[0, -0.42, 0]} scale={[1, 0.8, 1]} />
      <mesh geometry={ring} material={toon(color)} position={r} rotation={[0, 0.42, 0]} scale={[1, 0.8, 1]} />
      <mesh geometry={box(0.03, 0.005, 0.005)} material={toon(color)} position={[0, l.y + 0.005, l.z + 0.005]} />
      <mesh geometry={box(0.005, 0.005, 0.15)} material={toon(color)} position={[-HEAD.rx * 0.98, l.y, l.z - 0.08]} />
      <mesh geometry={box(0.005, 0.005, 0.15)} material={toon(color)} position={[HEAD.rx * 0.98, l.y, l.z - 0.08]} />
    </group>
  );
};
