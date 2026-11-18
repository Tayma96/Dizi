import React, { useMemo } from "react";
import { AbsoluteFill, CalculateMetadataFunction, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { castById } from "../cast";
import { AGE, Character } from "../rig/Character";
import { SET_INFO, SetLayer, type Mark } from "../sets";
import { FilmFinish } from "../../dizi/Effects";
import { lightning } from "../../dizi/Sets";
import { EndCard, KaraokeSubtitle, PhoneMessage, TitleCard } from "./Overlays";
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
  const sit = st.body === "sit" || Boolean(m.sit && st.body !== "stand");
  const size = m.size;
  const top = m.y - (sit ? 0.91 : 0.98) * size;
  const a = AGE[look.age];
  const headLocal = 300 - 100 * a.head * a.sy + 680 * (1 - a.sy);
  return { id, x: m.x, feetY: m.y, size, top, headX: m.x, headY: top + (headLocal / 1000) * size, sit };
};

type Cam = { cx: number; cy: number; z: number; ay: number };

const cameraFor = (shot: Shot, placed: Record<string, Placed>): Cam => {
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
    walkX[id] = { x, walking };
    placed[id] = { ...p, x, headX: x };
  }

  // camera
  let cam = clampCam(cameraFor(tb.shot, placed));
  if (tb.shot.move === "kaydir" && prev) {
    const pc = clampCam(cameraFor(prev.shot, placed));
    const k = interpolate(bf, [0, 18], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
    cam = { cx: pc.cx + (cam.cx - pc.cx) * k, cy: pc.cy + (cam.cy - pc.cy) * k, z: pc.z + (cam.z - pc.z) * k, ay: pc.ay + (cam.ay - pc.ay) * k };
  }
  const prog = bf / Math.max(1, tb.dur);
  let z = cam.z;
  if (tb.shot.move === "yaklas" || !tb.shot.move) z *= 1 + 0.06 * prog;
  if (tb.shot.move === "uzaklas") z *= 1.08 - 0.08 * prog;
  cam = clampCam({ ...cam, z });
  const flash = tb.beat.lightning ? lightning(bf, 0) : 0;
  const shakeAmt = (tb.shot.move === "sarsinti" ? 12 : 0) + flash * 16;
  const sx = shakeAmt ? (random(`sx-${frame}`) - 0.5) * shakeAmt : 0;
  const sy = shakeAmt ? (random(`sy-${frame}`) - 0.5) * shakeAmt : 0;

  // door state
  let doorOpen = 0;
  for (let i = 0; i <= bi; i++) {
    const d = ts.beats[i].beat.door;
    if (d === "ac") doorOpen = i === bi ? interpolate(bf, [0, 45], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 }) : 1;
    if (d === "kapat") doorOpen = i === bi ? interpolate(bf, [0, 12], [1, 0], clamp) : 0;
  }

  // önceki vuruştaki bakış (baş dönüşünü yumuşatmak için)
  const gazeOf = (b: typeof tb, id: string, pl: Record<string, Placed>) => {
    const st = b.cast[id];
    const p = pl[id];
    if (!st || !p) return undefined;
    if (st.lookAt && st.lookAt !== "kamera" && pl[st.lookAt]) {
      const d = Math.sign(pl[st.lookAt].x - p.x);
      return { yaw: 0.35 * d * (st.flip ? -1 : 1), lookX: 0.85 * d * (st.flip ? -1 : 1) };
    }
    if (!st.lookAt && b.beat.type === "line" && b.beat.who !== id && pl[b.beat.who]) {
      const d = Math.sign(pl[b.beat.who].x - p.x);
      return { yaw: 0.3 * d, lookX: 0.8 * d };
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
    let yaw = 0;
    let lookX = 0;
    if (st.lookAt && st.lookAt !== "kamera" && placed[st.lookAt]) {
      const dir = Math.sign(placed[st.lookAt].x - p.x);
      yaw = 0.35 * dir * (st.flip ? -1 : 1);
      lookX = 0.85 * dir * (st.flip ? -1 : 1);
    } else if (!st.lookAt && tb.beat.type === "line" && tb.beat.who !== id && placed[tb.beat.who]) {
      const dir = Math.sign(placed[tb.beat.who].x - p.x);
      yaw = 0.3 * dir;
      lookX = 0.8 * dir;
    }
    // Jest ve baş dönüşü vuruşlar arasında yumuşak geçer (kol bir karede pozdan poza atlamaz)
    const pst = prev?.cast[id];
    const gk = interpolate(bf, [0, 10], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
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
    return (
      <div key={id} style={{ position: "absolute", left: p.x - p.size * 0.2, top: p.top }}>
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
            yaw,
            lookX,
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
    );
  };

  const ids = Object.keys(placed).sort((a, b) => placed[a].feetY - placed[b].feetY);
  const outsideIds = scene.set === "apartman_kapisi" ? ids.filter((id) => tb.cast[id].mark === "kapi") : [];
  const insideIds = ids.filter((id) => !outsideIds.includes(id));
  const filter =
    scene.look === "flashback" ? "sepia(0.55) contrast(0.92) brightness(1.06) saturate(0.8)" : scene.look === "soguk" ? "saturate(0.7) hue-rotate(-12deg) brightness(0.95)" : scene.look === "sicak" ? "sepia(0.18) saturate(1.15)" : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0 0",
          transform: `translate(${540 + sx}px, ${cam.ay + sy}px) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`,
          filter,
        }}
      >
        <SetLayer name={scene.set as keyof typeof SET_INFO} layer="bg" time={scene.time} rain={scene.rain} flash={flash} doorOpen={doorOpen}>
          {outsideIds.map(renderChar)}
        </SetLayer>
        {insideIds.map(renderChar)}
        <SetLayer name={scene.set as keyof typeof SET_INFO} layer="fg" time={scene.time} />
      </AbsoluteFill>
      {scene.look === "flashback" ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(255,240,210,0) 50%, rgba(255,240,210,0.55) 100%)" }} /> : null}
      {/* overlays per beat */}
      {ts.beats.map((b) => (
        <Sequence key={b.index} from={b.from} durationInFrames={b.dur} layout="none">
          {b.beat.type === "line" ? (
            <KaraokeSubtitle tb={b} speakerName={castById(b.beat.who).name} speakerColor={colors[b.beat.who]} />
          ) : b.beat.type === "yazi" ? (
            <TitleCard text={b.beat.text} sub={b.beat.sub} dur={b.dur} />
          ) : b.beat.type === "mesaj" ? (
            <PhoneMessage from={b.beat.from} text={b.beat.text} dur={b.dur} />
          ) : null}
          {b.beat.fade ? <FadeOverlay mode={b.beat.fade} dur={b.dur} /> : null}
        </Sequence>
      ))}
      <SceneTransition kind={scene.transition} />
    </AbsoluteFill>
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
            {ts.scene.transition === "whoosh" ? <Audio src={staticFile("ses/efekt/whoosh.mp3")} volume={0.6} /> : null}
            {ts.beats.map((b) => (
              <Sequence key={b.index} from={b.from} durationInFrames={b.dur + 3 * fps} layout="none">
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
