import React, { useMemo } from "react";
import { AbsoluteFill, CalculateMetadataFunction, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { castById } from "../cast";
import { AGE, Character } from "../rig/Character";
import { Bird, SET_INFO, SetLayer, type Mark } from "../sets";
import { FilmFinish } from "../../dizi/Effects";
import { lightning } from "../../dizi/Sets";
import { CornerLabel, EndCard, InsertShot, KaraokeSubtitle, PhoneMessage, TitleCard } from "./Overlays";
import { buildTimeline, type TScene, type Timeline } from "./timeline";
import type { Gesture } from "../rig/types";
import { GESTURES, type FullArm } from "../rig/gestures";
import type { CharState, EpisodeProps, EpisodeScript, Shot, VoiceManifest } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SPEAKER_COLORS = ["#ffd166", "#9fd8b8", "#ff9fb2", "#a8c8ff", "#ffb37a", "#d6b8ff", "#c8e88a"];

/* ------------------------------ geometry ------------------------------ */
type Placed = { id: string; x: number; feetY: number; size: number; top: number; headX: number; headY: number; sit: boolean };

const place = (id: string, st: CharState, marks: Record<string, Mark>): Placed | null => {
  const m = marks[st.mark ?? Object.keys(marks)[0]];
  if (!m) return null;
  const look = castById(id);
  const lie = st.body === "yat" || st.body === "dogrul" || st.body === "yatakta";
  const sit = !lie && (st.body === "sit" || Boolean(m.sit && st.body !== "stand"));
  const size = m.size;
  // yatan/doğrulan: işaretin y'si kalça noktasıdır (karakter kalçasından döner)
  const top = lie ? m.y - 0.6 * size : m.y - (sit ? 0.91 : 0.98) * size;
  const a = AGE[look.age];
  const headLocal = 300 - 100 * a.head * a.sy + 680 * (1 - a.sy);
  return { id, x: m.x, feetY: m.y, size, top, headX: m.x, headY: top + (headLocal / 1000) * size, sit };
};

type Cam = { cx: number; cy: number; z: number; ay: number };

/** Hazır elle kadrajlar (mekâna özgü ekleme çekimleri) */
const KADRAJ: Record<string, { cx: number; cy: number; z: number }> = {
  pencere: { cx: 770, cy: 600, z: 2.05 },
  kapi: { cx: 930, cy: 1170, z: 1.7 },
  oda: { cx: 540, cy: 960, z: 1 },
};

const cameraFor = (shot: Shot, placed: Record<string, Placed>): Cam => {
  if (shot.kadraj) {
    const k = typeof shot.kadraj === "string" ? KADRAJ[shot.kadraj] : shot.kadraj;
    if (k) return { cx: k.cx, cy: k.cy, z: k.z, ay: 960 };
  }
  const p = shot.on ? placed[shot.on] : undefined;
  let cam: Cam;
  switch (shot.type) {
    case "orta":
      cam = p ? { cx: p.headX, cy: p.headY, z: 1.7 * (1250 / p.size), ay: 560 } : { cx: 540, cy: 960, z: 1, ay: 960 };
      break;
    case "yakin":
      cam = p ? { cx: p.headX, cy: p.headY, z: 2.3 * (1250 / p.size), ay: 560 } : { cx: 540, cy: 960, z: 1.6, ay: 960 };
      break;
    case "cok_yakin":
      cam = p ? { cx: p.headX, cy: p.headY - 0.01 * p.size, z: 3.2 * (1250 / p.size), ay: 560 } : { cx: 540, cy: 960, z: 2.4, ay: 960 };
      break;
    case "iki": {
      const q = shot.with ? placed[shot.with] : undefined;
      if (p && q) {
        const dx = Math.abs(p.headX - q.headX) + 0.5 * (p.size + q.size) / 2;
        const z = Math.max(1, Math.min(1.9, 1000 / dx));
        cam = { cx: (p.headX + q.headX) / 2, cy: Math.min(p.headY, q.headY) + 120, z, ay: 640 };
      } else cam = { cx: 540, cy: 960, z: 1, ay: 960 };
      break;
    }
    default:
      cam = { cx: 540, cy: 960, z: 1, ay: 960 };
  }
  if (shot.angle === "alt") cam.ay += 140;
  if (shot.angle === "ust") cam.ay -= 120;
  return cam;
};

const clampCam = (c: Cam): Cam => {
  const z = Math.max(1, c.z);
  const cx = Math.min(1080 - 540 / z, Math.max(540 / z, c.cx));
  const cy = Math.min(1920 - (1920 - c.ay) / z, Math.max(c.ay / z, c.cy));
  return { cx, cy, z, ay: c.ay };
};

/* ------------------------------ scene view ------------------------------ */
const SceneView: React.FC<{ ts: TScene; colors: Record<string, string> }> = ({ ts, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scene } = ts;
  const marks = SET_INFO[scene.set as keyof typeof SET_INFO].marks;
  const bi = Math.max(0, ts.beats.findIndex((b) => frame >= b.from && frame < b.from + b.dur));
  const tb = ts.beats[bi] ?? ts.beats[ts.beats.length - 1];
  const bf = frame - tb.from;
  const prev = bi > 0 ? ts.beats[bi - 1] : undefined;

  // placements (with enter/exit walking)
  const placed: Record<string, Placed> = {};
  for (const [id, st] of Object.entries(tb.cast)) {
    if (st.hidden) continue;
    const p = place(id, st, marks);
    if (p) placed[id] = p;
  }
  const prevPlaced: Record<string, Placed> = {};
  if (prev) for (const [id, st] of Object.entries(prev.cast)) if (!st.hidden) { const p = place(id, st, marks); if (p) prevPlaced[id] = p; }

  const walkX: Record<string, { x: number; walking: boolean }> = {};
  for (const [id, p] of Object.entries(placed)) {
    const st = tb.cast[id];
    let x = p.x;
    let walking = false;
    const walkDur = Math.min(tb.dur, Math.round(1.3 * fps));
    if (st.enter) {
      const from = st.enter === "sol" ? -300 : 1380;
      x = interpolate(bf, [0, walkDur], [from, p.x], clamp);
      walking = bf < walkDur;
    } else if (st.exit) {
      const to = st.exit === "sol" ? -300 : 1380;
      x = interpolate(bf, [tb.dur - walkDur, tb.dur], [p.x, to], clamp);
      walking = bf > tb.dur - walkDur;
    } else if (prevPlaced[id] && prevPlaced[id].x !== p.x) {
      x = interpolate(bf, [0, walkDur], [prevPlaced[id].x, p.x], clamp);
      walking = bf < walkDur;
    }
    if (st.yuru) walking = true;
    if (st.tik === "volta") {
      // bir o yana bir bu yana volta (kendi temposunda)
      x = p.x + Math.sin(frame / 45) * 200;
      walking = true;
    }
    walkX[id] = { x, walking };
    placed[id] = { ...p, x, headX: x };
  }

  // yatma / doğrulma: kalçadan dönüş açısı; baş konumu kameranın takibi için güncellenir
  const lieAng: Record<string, number> = {};
  for (const [id, p] of Object.entries(placed)) {
    const b = tb.cast[id].body;
    if (b !== "yat" && b !== "dogrul" && b !== "yatakta") continue;
    const already = b === "yatakta" || (b === "dogrul" && prev?.cast[id]?.body === "dogrul");
    const a = b === "yat" ? -90 : already ? 0 : interpolate(bf, [Math.round(0.15 * fps), Math.round(1.45 * fps)], [-90, 0], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
    lieAng[id] = a;
    // baş merkezi: kalça → boyun (gövde ekseni), boyun → baş (baş kameraya doğru -0.72a geri döner)
    const r = (a * Math.PI) / 180;
    const rh = ((a - 0.72 * a) * Math.PI) / 180;
    const nx = p.x + 0.3 * p.size * Math.sin(r);
    const ny = p.feetY - 0.3 * p.size * Math.cos(r);
    placed[id] = { ...p, headX: nx + 0.1 * p.size * Math.sin(rh), headY: ny - 0.1 * p.size * Math.cos(rh) };
  }

  // kuş (pencere dışında): gel = uçup pervaza konar, otur = bekler; hareket her seferinde birebir aynıdır (döngü motifi)
  let kusNode: React.ReactNode = null;
  if (tb.beat.kus) {
    // zaman, sahnedeki ilk "gel" vuruşunun başından sayılır → uçuş vuruşlar arasında kesintisiz sürer ve her seferinde birebir aynıdır
    const anchor = ts.beats.find((b) => b.beat.kus === "gel");
    const t = anchor ? (frame - anchor.from) / fps : 99 + frame / fps;
    const FLY = 1.7;
    const k = Math.min(1, t / FLY);
    const e = 1 - (1 - k) ** 3;
    const fly = t < FLY;
    const bx = 1010 + (800 - 1010) * e;
    const by = 430 + (700 - 430) * e - Math.sin(k * Math.PI) * 50 - (fly ? 0 : Math.max(0, Math.sin((t - FLY) * 14)) * 6 * Math.exp(-(t - FLY) * 5));
    // imza hareketi: konduktan sonra gagasıyla cama iki kez vurur
    const peck = (c: number) => Math.max(0, 1 - Math.abs(t - c) / 0.07);
    const pk = fly ? 0 : Math.max(peck(FLY + 0.45), peck(FLY + 0.8));
    const head = !fly && t > FLY + 1.2 && Math.floor((t - FLY) / 1.4) % 3 === 1 ? 1 : 0;
    kusNode = (
      <g transform={`rotate(${fly ? -12 : -18 * pk} ${bx} ${by})`}>
        <Bird x={bx - 14 * pk} y={by} s={1.7} fly={fly || t < FLY + 0.1} flap={Math.sin(t * 34)} head={head} tail={fly ? 0 : Math.sin(t * 3) * 0.6} />
      </g>
    );
  }

  let tvNow: string | undefined;
  for (let i = 0; i <= bi; i++) if (ts.beats[i].beat.tv) tvNow = ts.beats[i].beat.tv;
  let kemerNow = false;
  for (let i = 0; i <= bi; i++) if (ts.beats[i].beat.kemer !== undefined) kemerNow = Boolean(ts.beats[i].beat.kemer);
  let saatNow = scene.saat;
  for (let i = 0; i <= bi; i++) if (ts.beats[i].beat.saat) saatNow = ts.beats[i].beat.saat;

  // vuruş içi kesme
  let shotNow = tb.shot;
  if (tb.beat.shots) for (const c of tb.beat.shots) if (bf >= Math.round(c.at * fps)) shotNow = c.shot;
  const cutAt = tb.beat.shots ? Math.max(0, ...tb.beat.shots.filter((c) => bf >= Math.round(c.at * fps)).map((c) => Math.round(c.at * fps))) : 0;

  // camera
  let cam = clampCam(cameraFor(shotNow, placed));
  if (tb.shot.move === "kaydir" && prev) {
    const pc = clampCam(cameraFor(prev.shot, placed));
    const k = interpolate(bf, [0, 18], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
    cam = { cx: pc.cx + (cam.cx - pc.cx) * k, cy: pc.cy + (cam.cy - pc.cy) * k, z: pc.z + (cam.z - pc.z) * k, ay: pc.ay + (cam.ay - pc.ay) * k };
  }
  const prog = (bf - cutAt) / Math.max(1, tb.dur - cutAt);
  let z = cam.z;
  if (shotNow.move === "yaklas" || !shotNow.move) z *= 1 + 0.06 * prog;
  if (shotNow.move === "uzaklas") z *= 1.08 - 0.08 * prog;
  cam = clampCam({ ...cam, z });
  const flash = tb.beat.lightning ? lightning(bf, 0) : 0;
  const shakeAmt = (tb.shot.move === "sarsinti" ? 12 : 0) + flash * 16;
  // türbülans: yumuşak, düşük frekanslı sarsıntı (rastgele titreme değil)
  const tu = tb.beat.turb ?? 0;
  const sx = (shakeAmt ? (random(`sx-${frame}`) - 0.5) * shakeAmt : 0) + (tu ? (Math.sin(frame / 2.1) * 0.6 + Math.sin(frame / 3.7) * 0.4) * 14 * tu : 0);
  const sy = (shakeAmt ? (random(`sy-${frame}`) - 0.5) * shakeAmt : 0) + (tu ? (Math.sin(frame / 1.7 + 1) * 0.6 + Math.sin(frame / 4.3) * 0.4) * 18 * tu : 0);

  // door state
  let doorOpen = 0;
  for (let i = 0; i <= bi; i++) {
    const d = ts.beats[i].beat.door;
    if (d === "ac") doorOpen = i === bi ? interpolate(bf, [0, 45], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 }) : 1;
    if (d === "kapat") doorOpen = i === bi ? interpolate(bf, [0, 12], [doorOpen || 1, 0], clamp) : 0;
    if (d === "aralik") doorOpen = i === bi ? interpolate(bf, [0, 30], [0, 0.14], clamp) : 0.14;
  }

  // önceki vuruştaki bakış (baş dönüşünü yumuşatmak için)
  const gazeOf = (b: typeof tb, id: string, pl: Record<string, Placed>) => {
    const st = b.cast[id];
    const p = pl[id];
    if (!st || !p) return undefined;
    if (st.lookAt === "kamera") return { yaw: 0, lookX: 0 };
    if (st.bak) return { yaw: st.bak.x * 0.35, lookX: st.bak.x };
    if (st.tik === "tavan") return { yaw: 0, lookX: 0.1 };
    if (st.tik === "sallan") return { yaw: 0, lookX: 0 };
    if (st.tik === "volta") return { yaw: Math.cos(frame / 45) > 0 ? 0.4 : -0.4, lookX: Math.cos(frame / 45) > 0 ? 0.7 : -0.7 };
    // yürürken önüne bakar (birbirine bakarak yürümezler); ancak açıkça bakılan kişi varsa ona döner
    if (st.yuru && !st.lookAt) return { yaw: 0.3, lookX: 0.55 };
    // dizilerde kameraya bakılmaz: belirtilen kişiye, yoksa konuşana, konuşan da karşısındakine bakar
    const others = Object.keys(pl).filter((k) => k !== id && !b.cast[k]?.hidden);
    const target = st.lookAt && pl[st.lookAt] ? st.lookAt : b.beat.type === "line" && b.beat.who !== id && pl[b.beat.who] ? b.beat.who : others[0];
    if (target && pl[target]) {
      const d = Math.sign(pl[target].x - p.x) || 1;
      return { yaw: 0.5 * d * (st.flip ? -1 : 1), lookX: 1 * d * (st.flip ? -1 : 1) };
    }
    return { yaw: 0, lookX: 0 };
  };
  const prevLook: Record<string, { yaw: number; lookX: number } | undefined> = {};
  if (prev) for (const id of Object.keys(placed)) prevLook[id] = gazeOf(prev, id, { ...prevPlaced, ...Object.fromEntries(Object.entries(placed).filter(([k]) => !prevPlaced[k])) });

  const renderChar = (id: string) => {
    const p = placed[id];
    const st = tb.cast[id];
    const look = castById(id);
    const speaking = tb.beat.type === "line" && tb.beat.who === id && !tb.beat.voiceover && tb.voice;
    const gz = gazeOf(tb, id, placed) ?? { yaw: 0, lookX: 0 };
    let yaw = gz.yaw;
    let lookX = gz.lookX;
    // Jest ve baş dönüşü vuruşlar arasında yumuşak geçer (kol bir karede pozdan poza atlamaz)
    const pst = prev?.cast[id];
    // yürürken kollar önceki pozda kalır (kol bacaktan önce hareket etmez); yürüyüş bitince yumuşak geçiş
    const walkingNow = walkX[id]?.walking && !st.yuru;
    const walkEnd = st.enter || (prevPlaced[id] && prevPlaced[id].x !== p.x) ? Math.min(tb.dur, Math.round(1.3 * fps)) : 0;
    const gk = walkingNow ? 0 : interpolate(bf, [walkEnd, walkEnd + 10], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
    const gCur = GESTURES[(st.gesture as Gesture) ?? "rest"] ?? GESTURES.rest;
    const gPrev = pst && !pst.hidden ? GESTURES[(pst.gesture as Gesture) ?? "rest"] ?? GESTURES.rest : gCur;
    const mixArm = (a: FullArm, b: FullArm): FullArm => ({ upper: a.upper + (b.upper - a.upper) * gk, fore: a.fore + (b.fore - a.fore) * gk, ul: (a.ul ?? 1) + ((b.ul ?? 1) - (a.ul ?? 1)) * gk, fl: (a.fl ?? 1) + ((b.fl ?? 1) - (a.fl ?? 1)) * gk });
    const armL = mixArm(gPrev.L, gCur.L);
    const armR = mixArm(gPrev.R, gCur.R);
    const pv = prevLook[id];
    if (pv && !walkX[id]?.walking) {
      yaw = pv.yaw + (yaw - pv.yaw) * gk;
      lookX = pv.lookX + (lookX - pv.lookX) * gk;
    }
    const ang = lieAng[id];
    return (
      <React.Fragment key={id}>
      <div style={{ position: "absolute", left: p.x - p.size * 0.2, top: p.top, transform: ang !== undefined ? `rotate(${ang}deg)` : undefined, transformOrigin: `${p.size * 0.2}px ${p.size * 0.6}px` }}>
        <Character
          look={look}
          size={p.size}
          flip={st.flip}
          pose={{
            emotion: st.emotion,
            gesture: st.gesture as Gesture | undefined,
            armL,
            armR,
            prop: st.prop,
            body: walkX[id]?.walking ? "walk" : p.sit ? "sit" : "stand",
            hideLegs: ang !== undefined,
            tilt: ang !== undefined ? -0.72 * ang : st.tik === "sallan" ? Math.sin(frame / 6) * 11 : undefined,
            talk: st.tik === "konus" ? new Array(60).fill(0).map((_, k): [number, number] => [k * 70, k * 70 + 42]) : undefined,
            yaw,
            lookX,
            lookY: st.bak ? st.bak.y : st.tik === "tavan" ? -1 : undefined,
            tears: st.tears,
            pale: st.pale,
            sweat: st.sweat,
            wet: st.wet,
            eyesClosed: st.eyesClosed,
            speech: speaking ? { cues: tb.voice!.mouth, from: tb.from + tb.voice!.from } : undefined,
            seed: look.name.length * 11 + id.length,
          }}
        />
      </div>
      {ang !== undefined ? <Blanket hx={p.x} hy={p.feetY} k={(ang + 90) / 90} /> : null}
      </React.Fragment>
    );
  };

  const ids = Object.keys(placed).sort((a, b) => placed[a].feetY - placed[b].feetY);
  const outsideIds = scene.set === "apartman_kapisi" ? ids.filter((id) => tb.cast[id].mark === "kapi") : [];
  const insideIds = ids.filter((id) => !outsideIds.includes(id));
  const filter =
    scene.look === "flashback" ? "sepia(0.55) contrast(0.92) brightness(1.06) saturate(0.8)" : scene.look === "soguk" ? "saturate(0.7) hue-rotate(-12deg) brightness(0.95)" : scene.look === "sicak" ? "sepia(0.18) saturate(1.15)" : scene.look === "tekinsiz" ? `saturate(0.62) hue-rotate(-12deg) brightness(${frame % 83 < 2 ? 0.8 : 0.88}) contrast(1.16)` : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0 0",
          transform: `translate(${540 + sx}px, ${cam.ay + sy}px) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`,
          filter,
        }}
      >
        <SetLayer name={scene.set as keyof typeof SET_INFO} layer="bg" time={scene.time} rain={scene.rain} flash={flash} doorOpen={doorOpen} kus={kusNode} saat={saatNow} sallanan={tb.beat.sarsil} kaydir={scene.kaydirma ? (frame / fps) * scene.kaydirma : undefined} tv={tvNow} turb={tb.beat.turb} kemer={kemerNow}>
          {outsideIds.map(renderChar)}
        </SetLayer>
        {insideIds.map(renderChar)}
        <SetLayer name={scene.set as keyof typeof SET_INFO} layer="fg" time={scene.time} turb={tb.beat.turb} fincanElde={Object.values(tb.cast).some((c) => c.prop === "fincan")} />
      </AbsoluteFill>
      {scene.look === "flashback" ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(255,240,210,0) 50%, rgba(255,240,210,0.55) 100%)" }} /> : null}
      {/* overlays per beat */}
      {ts.beats.map((b) => (
        <Sequence key={b.index} from={b.from} durationInFrames={b.dur} layout="none">
          {b.beat.type === "line" ? (
            <KaraokeSubtitle tb={b} speakerName={b.beat.label !== undefined ? b.beat.label || undefined : castById(b.beat.who).name} speakerColor={colors[b.beat.who]} />
          ) : b.beat.type === "yazi" ? (
            <TitleCard text={b.beat.text} sub={b.beat.sub} dur={b.dur} />
          ) : b.beat.type === "mesaj" ? (
            <PhoneMessage from={b.beat.from} text={b.beat.text} dur={b.dur} />
          ) : b.beat.type === "insert" ? (
            <InsertShot kind={b.beat.kind} text={b.beat.text} dur={b.dur} />
          ) : null}
          {b.beat.ekle ? <InsertShot kind={b.beat.ekle.kind as never} text={b.beat.ekle.text} dur={b.dur} /> : null}
          {b.beat.type === "line" && b.beat.ekle ? <KaraokeSubtitle tb={b} speakerName={b.beat.label !== undefined ? b.beat.label || undefined : castById(b.beat.who).name} speakerColor={colors[b.beat.who]} /> : null}
          {b.beat.etiket ? <CornerLabel text={b.beat.etiket} /> : null}
          {b.beat.fade ? <FadeOverlay mode={b.beat.fade} dur={b.dur} /> : null}
        </Sequence>
      ))}
      <SceneTransition kind={scene.transition} />
    </AbsoluteFill>
  );
};

/** Battaniye: yatanın derinlik sırasında (önünde duranların arkasında) çizilir.
 *  k = 0 yatarken (göğse kadar örter, ayak kabarıklığı), k = 1 otururken (kucağı örter, diz kabarıklığı). */
const BL_LIE: [number, number][] = [[-175, 40], [-175, -30], [-150, -68], [-60, -70], [30, -72], [110, -58], [190, -52], [215, -46], [222, -6], [222, 56], [-175, 56]];
const BL_SIT: [number, number][] = [[-72, 40], [-72, -16], [-62, -44], [6, -44], [70, -46], [120, -66], [190, -44], [215, -40], [222, -4], [222, 56], [-72, 56]];
const Blanket: React.FC<{ hx: number; hy: number; k: number }> = ({ hx, hy, k }) => {
  const P = BL_LIE.map(([x, y], i) => [hx + x + (BL_SIT[i][0] - x) * k, hy + y + (BL_SIT[i][1] - y) * k]);
  const d = `M ${P[0][0]} ${P[0][1]} L ${P[1][0]} ${P[1][1]} Q ${P[2][0]} ${P[2][1]} ${P[3][0]} ${P[3][1]} Q ${P[4][0]} ${P[4][1]} ${P[5][0]} ${P[5][1]} Q ${P[6][0]} ${P[6][1]} ${P[7][0]} ${P[7][1]} Q ${P[8][0]} ${P[8][1]} ${P[8][0]} ${P[8][1] + 20} L ${P[9][0]} ${P[9][1]} L ${P[10][0]} ${P[10][1]} Z`;
  const hem = `M ${P[0][0]} ${P[0][1]} L ${P[1][0]} ${P[1][1]} Q ${P[2][0]} ${P[2][1]} ${P[3][0]} ${P[3][1]} L ${P[3][0] + 6} ${P[3][1] + 34} Q ${P[2][0] + 20} ${P[2][1] + 40} ${P[0][0] + 22} ${P[0][1]} Z`;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <path d={d} fill="#8c979a" stroke="#1b1412" strokeWidth={5} strokeLinejoin="round" />
      <path d={hem} fill="#a6b0b2" stroke="#1b1412" strokeWidth={3.5} strokeLinejoin="round" />
      <path d={`M ${P[5][0]} ${P[5][1] + 6} Q ${P[5][0] + 10} ${P[5][1] + 40} ${P[5][0] - 4} ${hy + 50} M ${P[7][0] - 30} ${P[7][1] + 8} Q ${P[7][0] - 20} ${P[7][1] + 40} ${P[7][0] - 26} ${hy + 50}`} stroke="#74808a" strokeWidth={4} fill="none" />
    </svg>
  );
};

const FadeOverlay: React.FC<{ mode: "giris" | "cikis"; dur: number }> = ({ mode, dur }) => {
  const f = useCurrentFrame();
  const o = mode === "giris" ? interpolate(f, [0, 20], [1, 0], clamp) : interpolate(f, [dur - 20, dur], [0, 1], clamp);
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity: o }} />;
};

const SceneTransition: React.FC<{ kind?: string }> = ({ kind }) => {
  const f = useCurrentFrame();
  if (kind === "kararma") return <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(f, [0, 14], [1, 0], clamp) }} />;
  if (kind === "flas") return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f, [0, 8], [1, 0], clamp) }} />;
  if (kind === "whoosh") return <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(f, [0, 6], [0.6, 0], clamp) }} />;
  return null;
};

/* ------------------------------ audio ------------------------------ */
const ducked = (f: number, speaking: [number, number][], ramp = 8) => {
  let d = 0;
  for (const [a, b] of speaking) {
    if (f >= a - ramp && f <= b + ramp) {
      const k = f < a ? (f - (a - ramp)) / ramp : f > b ? 1 - (f - b) / ramp : 1;
      d = Math.max(d, k);
    }
  }
  return d;
};

const MusicTrack: React.FC<{ src: string; base: number; dur: number; speaking: [number, number][]; offset: number }> = ({ src, base, dur, speaking, offset }) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 30], [0, 1], clamp);
  const fadeOut = interpolate(f, [dur - 30, dur], [1, 0], clamp);
  const d = ducked(f + offset, speaking);
  return <Audio src={staticFile(src)} loop volume={base * fadeIn * fadeOut * (1 - 0.55 * d)} />;
};

const AmbTrack: React.FC<{ src: string; base: number; dur: number }> = ({ src, base, dur }) => {
  const f = useCurrentFrame();
  return <Audio src={staticFile(src)} loop volume={base * interpolate(f, [0, 10, dur - 10, dur], [0, 1, 1, 0], clamp)} />;
};

/* ------------------------------ episode ------------------------------ */
export const Episode: React.FC<EpisodeProps> = ({ script, manifest, part = 0 }) => {
  const { fps } = useVideoConfig();
  const tl: Timeline | null = useMemo(() => (script && manifest ? buildTimeline(script, manifest) : null), [script, manifest]);
  if (!script || !tl) return <AbsoluteFill style={{ backgroundColor: "#200" }} />;
  const offset = part > 0 ? tl.parts[part - 1][0] : 0;
  const colors: Record<string, string> = {};
  let ci = 0;
  for (const s of script.scenes) for (const id of Object.keys(s.cast)) if (!colors[id]) colors[id] = SPEAKER_COLORS[ci++ % SPEAKER_COLORS.length];
  const allSpeaking = tl.scenes.flatMap((s) => s.speaking);

  // music segments: a scene without `music` continues the previous one; name "yok" stops it
  const segs: { name: string; from: number; to: number; volume: number }[] = [];
  for (const s of tl.scenes) {
    const m = s.scene.music;
    const last = segs[segs.length - 1];
    if (m && m.name !== "yok" && !(last && last.name === m.name && last.to === s.from)) segs.push({ name: m.name, from: s.from, to: s.from + s.dur, volume: m.volume ?? 0.35 });
    else if (m && m.name === "yok") continue;
    else if (last && last.to === s.from) last.to = s.from + s.dur;
  }
  const endFrom = tl.total - 4 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={-offset} layout="none">
        {tl.scenes.map((ts) => (
          <Sequence key={ts.scene.id} name={`${ts.scene.id} · ${ts.scene.title ?? ts.scene.set}`} from={ts.from} durationInFrames={ts.dur}>
            <SceneView ts={ts} colors={colors} />
            {ts.scene.ambience ? <AmbTrack src={`ses/${ts.scene.ambience.name}.mp3`} base={ts.scene.ambience.volume ?? 0.25} dur={ts.dur} /> : null}
            {ts.scene.ambience2 ? <AmbTrack src={`ses/${ts.scene.ambience2.name}.mp3`} base={ts.scene.ambience2.volume ?? 0.1} dur={ts.dur} /> : null}
            {ts.scene.transition === "whoosh" ? <Audio src={staticFile("ses/efekt/whoosh.mp3")} volume={0.6} /> : null}
            {ts.beats.map((b) => (
              <Sequence key={b.index} from={b.from} durationInFrames={b.dur + 6 * fps} layout="none">
                {b.voice ? (
                  <Sequence from={b.voice.from} layout="none">
                    <Audio src={staticFile(b.voice.file)} volume={1} />
                  </Sequence>
                ) : null}
                {(b.beat.sfx ?? []).map((s, i) => (
                  <Sequence key={i} from={Math.round((s.at ?? 0) * fps)} layout="none">
                    <Audio src={staticFile(`ses/${s.name}.mp3`)} volume={s.volume ?? 0.7} />
                  </Sequence>
                ))}
                {b.beat.lightning ? <Audio src={staticFile("ses/efekt/gok_gurultusu.mp3")} volume={0.55} /> : null}
                {b.beat.type === "mesaj" ? <Audio src={staticFile("ses/efekt/bildirim.mp3")} volume={0.6} /> : null}
              </Sequence>
            ))}
          </Sequence>
        ))}
        {segs.map((s, i) => (
          <Sequence key={i} name={`Müzik: ${s.name}`} from={s.from} durationInFrames={s.to - s.from} layout="none">
            <MusicTrack src={`ses/${s.name}.mp3`} base={s.volume} dur={s.to - s.from} speaking={allSpeaking} offset={s.from} />
          </Sequence>
        ))}
        {script.endCard === false ? null : (
          <Sequence name="Bitiş kartı" from={endFrom} durationInFrames={4 * fps}>
            <EndCard series={script.seriesTitle} episodeNo={script.episodeNo} text={script.endCard ? script.endCard.text : undefined} sub={script.endCard ? script.endCard.sub : undefined} />
            <Audio src={staticFile("ses/muzik/jenerik_tema.mp3")} volume={0.6} />
          </Sequence>
        )}
      </Sequence>
      <FilmFinish vignette={0.45} grain={0.06} />
    </AbsoluteFill>
  );
};

export const calculateEpisodeMetadata: CalculateMetadataFunction<EpisodeProps> = async ({ props }) => {
  const script: EpisodeScript = await fetch(staticFile(`episodes/${props.episodeId}.json`)).then((r) => r.json());
  let manifest: VoiceManifest = {};
  try {
    manifest = await fetch(staticFile(`voice/${props.episodeId}/manifest.json`)).then((r) => (r.ok ? r.json() : {}));
  } catch {
    manifest = {};
  }
  const tl = buildTimeline(script, manifest);
  const part = props.part ?? 0;
  const dur = part > 0 && tl.parts[part - 1] ? tl.parts[part - 1][1] - tl.parts[part - 1][0] : tl.total;
  return { durationInFrames: Math.max(1, dur), fps: tl.fps, props: { ...props, script, manifest } };
};
