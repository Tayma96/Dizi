/* 3D bölüm motoru: aynı bölüm JSON'u (public/episodes/<id>.json) → 3D sahne, gerçek kamera, dudak senkronu, altyazı, ses.
   Kurallar: göz çizgisi üst 1/3; altyazı ≤37 karakter/satır; diyalogda müzik ~7 dB kısılır; sahne ortam sesi kesmeden 0.4 sn önce başlar (J-cut). */
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, CalculateMetadataFunction, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { castById } from "../studio/cast";
import { FilmFinish } from "../dizi/Effects";
import { lightning } from "../dizi/Sets";
import { EndCard, KaraokeSubtitle, PhoneMessage, TitleCard } from "../studio/engine/Overlays";
import { buildTimeline, type TBeat, type TScene, type Timeline } from "../studio/engine/timeline";
import type { CharState, EpisodeProps, EpisodeScript, Shot, VoiceManifest } from "../studio/engine/types";
import { Character3D } from "./Character3D";
import { CameraRig } from "./CameraRig";
import { SETS3D, Set3D, type Mark3D } from "./sets3d";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SPEAKER_COLORS = ["#ffd166", "#9fd8b8", "#ff9fb2", "#a8c8ff", "#ffb37a", "#d6b8ff", "#c8e88a"];
const D2R = Math.PI / 180;
type V3 = [number, number, number];

/* ------------------------------ yerleşim ------------------------------ */
type Placed = { id: string; x: number; z: number; facing: number; seat: boolean; headY: number; walking: boolean };

const HEAD_H = { child: 0.99, teen: 1.38, adult: 1.52, old: 1.49 } as const;

const resolveMark = (st: CharState, marks: Record<string, Mark3D>): Mark3D => marks[st.mark ?? Object.keys(marks)[0]] ?? { x: 0, z: 0 };

const placeAll = (tb: TBeat, prev: TBeat | undefined, marks: Record<string, Mark3D>, bf: number, fps: number) => {
  const out: Record<string, Placed> = {};
  const walkDur = Math.min(tb.dur, Math.round(1.4 * fps));
  for (const [id, st] of Object.entries(tb.cast)) {
    if (st.hidden) continue;
    const m = resolveMark(st, marks);
    const look = castById(id);
    const seat = Boolean(m.seat && st.body !== "stand") || st.body === "sit";
    let x = m.x;
    let z = m.z;
    let walking = false;
    let facing = st.turn ?? m.facing ?? 0;
    const pst = prev?.cast[id];
    const pm = pst && !pst.hidden ? resolveMark(pst, marks) : undefined;
    if (st.enter) {
      const fromX = st.enter === "sol" ? -4.5 : 4.5;
      const k = interpolate(bf, [0, walkDur], [0, 1], clamp);
      x = fromX + (m.x - fromX) * k;
      walking = k < 1;
      if (walking) facing = st.enter === "sol" ? 90 : -90;
    } else if (st.exit) {
      const toX = st.exit === "sol" ? -4.5 : 4.5;
      const k = interpolate(bf, [tb.dur - walkDur, tb.dur], [0, 1], clamp);
      x = m.x + (toX - m.x) * k;
      walking = k > 0;
      if (walking) facing = st.exit === "sol" ? -90 : 90;
    } else if (pm && (pm.x !== m.x || pm.z !== m.z)) {
      const k = interpolate(bf, [0, walkDur], [0, 1], clamp);
      x = pm.x + (m.x - pm.x) * k;
      z = pm.z + (m.z - pm.z) * k;
      walking = k < 1;
      if (walking) facing = (Math.atan2(m.x - pm.x, m.z - pm.z) * 180) / Math.PI;
    }
    const headY = HEAD_H[look.age] - (seat ? 0.36 * (look.age === "child" ? 0.6 : 1) : 0);
    out[id] = { id, x, z, facing, seat, headY, walking };
  }
  return out;
};

/* ------------------------------ kamera ------------------------------ */
type Cam = { pos: V3; target: V3; fov: number };
const FOV = 40;

const camFor = (shot: Shot, placed: Record<string, Placed>, wide: { pos: V3; target: V3 }): Cam => {
  const p = shot.on ? placed[shot.on] : undefined;
  const q = shot.with ? placed[shot.with] : undefined;
  const frontOf = (c: Placed, dist: number, side = 0, frameK = 1 / 6): Cam => {
    // karakterin önü ile ana kamera yönünün karışımı (180° kuralını korur)
    const fx = Math.sin(c.facing * D2R);
    const fz = Math.cos(c.facing * D2R);
    const mx = wide.pos[0] - c.x;
    const mz = wide.pos[2] - c.z;
    const ml = Math.hypot(mx, mz) || 1;
    let dx = fx * 0.65 + (mx / ml) * 0.35;
    let dz = fz * 0.65 + (mz / ml) * 0.35;
    const dl = Math.hypot(dx, dz) || 1;
    dx /= dl;
    dz /= dl;
    const h = c.headY;
    const visH = 2 * dist * Math.tan((FOV / 2) * D2R);
    const ty = h - visH * frameK; // göz çizgisi üst 1/3
    return { pos: [c.x + dx * dist - dz * side, h - 0.05, c.z + dz * dist + dx * side], target: [c.x, ty, c.z], fov: FOV };
  };
  switch (shot.type) {
    case "orta":
      return p ? frontOf(p, 2.7, 0, 1 / 6) : { ...wide, fov: 50 };
    case "yakin":
      return p ? frontOf(p, 1.6, 0, 0.13) : { ...wide, fov: 50 };
    case "cok_yakin":
      return p ? frontOf(p, 1.05, 0, 0.06) : { ...wide, fov: 50 };
    case "iki": {
      if (!p || !q) return { ...wide, fov: 50 };
      const cx = (p.x + q.x) / 2;
      const cz = (p.z + q.z) / 2;
      const sep = Math.hypot(p.x - q.x, p.z - q.z);
      // iki kişiyi birleştiren doğruya dik, ana kamera tarafında
      let nx = -(q.z - p.z);
      let nz = q.x - p.x;
      if (nx * (wide.pos[0] - cx) + nz * (wide.pos[2] - cz) < 0) {
        nx = -nx;
        nz = -nz;
      }
      const nl = Math.hypot(nx, nz) || 1;
      const dist = Math.max(2.6, sep * 2.2);
      const h = Math.max(p.headY, q.headY);
      return { pos: [cx + (nx / nl) * dist, h - 0.1, cz + (nz / nl) * dist], target: [cx, h - 0.35, cz], fov: FOV };
    }
    case "omuz": {
      // `with` kişisinin omzunun arkasından `on` kişisine
      if (!p || !q) return p ? frontOf(p, 1.3) : { ...wide, fov: 50 };
      const vx = p.x - q.x;
      const vz = p.z - q.z;
      const vl = Math.hypot(vx, vz) || 1;
      const ux = vx / vl;
      const uz = vz / vl;
      const side = 0.32;
      return {
        pos: [q.x - ux * 0.55 + uz * side, q.headY + 0.08, q.z - uz * 0.55 - ux * side],
        target: [p.x, p.headY - 0.12, p.z],
        fov: 42,
      };
    }
    case "ust_aci": {
      if (!p) return { ...wide, fov: 50 };
      return { pos: [p.x + 0.4, p.headY + 2.2, p.z + 1.6], target: [p.x, p.headY - 0.6, p.z], fov: FOV };
    }
    default:
      return { ...wide, fov: 50 };
  }
};

const lerpCam = (a: Cam, b: Cam, k: number): Cam => ({
  pos: a.pos.map((v, i) => v + (b.pos[i] - v) * k) as V3,
  target: a.target.map((v, i) => v + (b.target[i] - v) * k) as V3,
  fov: a.fov + (b.fov - a.fov) * k,
});

/* ------------------------------ sahne ------------------------------ */
const Scene3D: React.FC<{ ts: TScene; colors: Record<string, string> }> = ({ ts, colors }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { scene } = ts;
  const info = SETS3D[scene.set];
  const bi = Math.max(0, ts.beats.findIndex((b) => frame >= b.from && frame < b.from + b.dur));
  const tb = ts.beats[bi] ?? ts.beats[ts.beats.length - 1];
  const bf = frame - tb.from;
  const prev = bi > 0 ? ts.beats[bi - 1] : undefined;
  const placed = placeAll(tb, prev, info.marks, bf, fps);

  // kamera
  const wide = info.wide;
  let cam = camFor(tb.shot, placed, wide);
  if (tb.shot.move === "kaydir" && prev) cam = lerpCam(camFor(prev.shot, placed, wide), cam, interpolate(bf, [0, 20], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) }));
  const prog = bf / Math.max(1, tb.dur);
  const dolly = tb.shot.move === "uzaklas" ? -0.12 + 0.12 * (1 - prog) : tb.shot.move === "sabit" || tb.shot.move === "kaydir" ? 0 : 0.09 * prog; // varsayılan: hafif yaklaşma
  const dir = cam.target.map((v, i) => v - cam.pos[i]) as V3;
  let pos = cam.pos.map((v, i) => v + dir[i] * (tb.shot.move === "uzaklas" ? -0.12 * prog : dolly)) as V3;
  if (tb.shot.angle === "alt") pos = [pos[0], pos[1] - 0.45, pos[2]];
  if (tb.shot.angle === "ust") pos = [pos[0], pos[1] + 0.5, pos[2]];
  const flash = tb.beat.lightning ? lightning(bf, 0) : 0;
  const shake = (tb.shot.move === "sarsinti" ? 0.03 : 0) + flash * 0.03;
  if (shake) pos = [pos[0] + (random(`sx${frame}`) - 0.5) * shake, pos[1] + (random(`sy${frame}`) - 0.5) * shake, pos[2]];

  // kapı
  let doorOpen = 0;
  for (let i = 0; i <= bi; i++) {
    const d = ts.beats[i].beat.door;
    if (d === "ac") doorOpen = i === bi ? interpolate(bf, [0, 45], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 }) : 1;
    if (d === "kapat") doorOpen = i === bi ? interpolate(bf, [0, 12], [1, 0], clamp) : 0;
  }

  const speakerId = tb.beat.type === "line" && !tb.beat.voiceover ? tb.beat.who : undefined;
  const chars = Object.values(placed).map((p) => {
    const st = tb.cast[p.id];
    const look = castById(p.id);
    // bakış: belirtilen kişiye, yoksa konuşana (dinleyiciler), yoksa ileri
    const tgtId = st.lookAt && st.lookAt !== "kamera" ? st.lookAt : !st.lookAt && speakerId && speakerId !== p.id ? speakerId : undefined;
    let turn = p.facing;
    let headYaw = 0;
    let lookX = 0;
    if (tgtId && placed[tgtId] && !p.walking) {
      const t = placed[tgtId];
      const ang = (Math.atan2(t.x - p.x, t.z - p.z) * 180) / Math.PI;
      let delta = ((ang - p.facing + 540) % 360) - 180;
      turn = p.facing + delta * 0.45;
      delta = ((ang - turn + 540) % 360) - 180;
      headYaw = Math.max(-55, Math.min(55, delta));
      lookX = Math.max(-1, Math.min(1, (delta - headYaw) / 25));
    }
    if (st.lookAt === "kamera") {
      const ang = (Math.atan2(pos[0] - p.x, pos[2] - p.z) * 180) / Math.PI;
      const delta = ((ang - turn + 540) % 360) - 180;
      headYaw = Math.max(-40, Math.min(40, delta));
    }
    const speaking = speakerId === p.id && tb.voice;
    return (
      <Character3D
        key={p.id}
        look={look}
        position={[p.x, 0, p.z]}
        pose={{
          emotion: st.emotion,
          gesture: st.gesture,
          prop: st.prop,
          body: p.walking ? "walk" : p.seat ? "sit" : "stand",
          turn,
          headYaw,
          lookX,
          tears: st.tears,
          pale: st.pale,
          sweat: st.sweat,
          eyesClosed: st.eyesClosed,
          speech: speaking ? { cues: tb.voice!.mouth, from: tb.from + tb.voice!.from } : undefined,
        }}
      />
    );
  });

  const filter =
    scene.look === "flashback" ? "sepia(0.55) contrast(0.92) brightness(1.06) saturate(0.8)" : scene.look === "soguk" ? "saturate(0.7) hue-rotate(-12deg) brightness(0.95)" : scene.look === "sicak" ? "sepia(0.18) saturate(1.15)" : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ filter }}>
        <ThreeCanvas width={width} height={height} camera={{ fov: cam.fov, position: pos, near: 0.05, far: 80 }}>
          <CameraRig pos={pos} target={cam.target} fov={cam.fov} />
          <Set3D name={scene.set} time={scene.time} rain={scene.rain} flash={flash} doorOpen={doorOpen} />
          {chars}
        </ThreeCanvas>
      </AbsoluteFill>
      {scene.look === "flashback" ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(255,240,210,0) 50%, rgba(255,240,210,0.55) 100%)" }} /> : null}
      {ts.beats.map((b) => (
        <Sequence key={b.index} from={b.from} durationInFrames={b.dur} layout="none">
          {b.beat.type === "line" ? (
            <KaraokeSubtitle tb={b} speakerName={castById(b.beat.who).name} speakerColor={colors[b.beat.who]} />
          ) : b.beat.type === "yazi" ? (
            <TitleCard text={b.beat.text} sub={b.beat.sub} dur={b.dur} />
          ) : b.beat.type === "mesaj" ? (
            <PhoneMessage from={b.beat.from} text={b.beat.text} dur={b.dur} />
          ) : null}
          {b.beat.fade ? <Fade mode={b.beat.fade} dur={b.dur} /> : null}
        </Sequence>
      ))}
      <Transition kind={scene.transition} />
    </AbsoluteFill>
  );
};

const Fade: React.FC<{ mode: "giris" | "cikis"; dur: number }> = ({ mode, dur }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity: mode === "giris" ? interpolate(f, [0, 20], [1, 0], clamp) : interpolate(f, [dur - 20, dur], [0, 1], clamp) }} />;
};
const Transition: React.FC<{ kind?: string }> = ({ kind }) => {
  const f = useCurrentFrame();
  if (kind === "kararma") return <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(f, [0, 14], [1, 0], clamp) }} />;
  if (kind === "flas") return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f, [0, 8], [1, 0], clamp) }} />;
  if (kind === "whoosh") return <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(f, [0, 6], [0.6, 0], clamp) }} />;
  return null;
};

/* ------------------------------ ses ------------------------------ */
const ducked = (f: number, speaking: [number, number][], ramp = 8) => {
  let d = 0;
  for (const [a, b] of speaking) {
    if (f >= a - ramp && f <= b + ramp) d = Math.max(d, f < a ? (f - (a - ramp)) / ramp : f > b ? 1 - (f - b) / ramp : 1);
  }
  return d;
};
const MusicTrack: React.FC<{ src: string; base: number; dur: number; speaking: [number, number][]; offset: number }> = ({ src, base, dur, speaking, offset }) => {
  const f = useCurrentFrame();
  const v = base * interpolate(f, [0, 30, dur - 60, dur], [0, 1, 1, 0], clamp) * (1 - 0.55 * ducked(f + offset, speaking));
  return <Audio src={staticFile(src)} loop volume={v} />;
};
const AmbTrack: React.FC<{ src: string; base: number; dur: number; lead: number }> = ({ src, base, dur, lead }) => {
  const f = useCurrentFrame();
  return <Audio src={staticFile(src)} loop volume={base * interpolate(f, [0, lead, dur - 8, dur], [0, 1, 1, 0], clamp)} />;
};

/* ------------------------------ bölüm ------------------------------ */
export const Episode3D: React.FC<EpisodeProps> = ({ script, manifest, part = 0 }) => {
  const { fps } = useVideoConfig();
  const tl: Timeline | null = useMemo(() => (script && manifest ? buildTimeline(script, manifest) : null), [script, manifest]);
  if (!script || !tl) return <AbsoluteFill style={{ backgroundColor: "#200" }} />;
  const offset = part > 0 ? tl.parts[part - 1][0] : 0;
  const colors: Record<string, string> = {};
  let ci = 0;
  for (const s of script.scenes) for (const id of Object.keys(s.cast)) if (!colors[id]) colors[id] = SPEAKER_COLORS[ci++ % SPEAKER_COLORS.length];
  const allSpeaking = tl.scenes.flatMap((s) => s.speaking);
  const segs: { name: string; from: number; to: number; volume: number }[] = [];
  for (const s of tl.scenes) {
    const m = s.scene.music;
    const last = segs[segs.length - 1];
    if (m && m.name !== "yok" && !(last && last.name === m.name && last.to === s.from)) segs.push({ name: m.name, from: s.from, to: s.from + s.dur, volume: m.volume ?? 0.25 });
    else if (m && m.name === "yok") continue;
    else if (last && last.to === s.from) last.to = s.from + s.dur;
  }
  const LEAD = Math.round(0.4 * fps); // J-cut
  const endFrom = tl.total - 4 * fps;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={-offset} layout="none">
        {tl.scenes.map((ts) => (
          <React.Fragment key={ts.scene.id}>
            <Sequence name={`${ts.scene.id} · ${ts.scene.title ?? ts.scene.set}`} from={ts.from} durationInFrames={ts.dur}>
              <Scene3D ts={ts} colors={colors} />
              {ts.scene.transition === "whoosh" ? <Audio src={staticFile("ses/efekt/whoosh.mp3")} volume={0.5} /> : null}
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
            {ts.scene.ambience ? (
              <Sequence name={`Ortam: ${ts.scene.ambience.name}`} from={Math.max(0, ts.from - LEAD)} durationInFrames={ts.dur + (ts.from > 0 ? LEAD : 0)} layout="none">
                <AmbTrack src={`ses/${ts.scene.ambience.name}.mp3`} base={ts.scene.ambience.volume ?? 0.5} dur={ts.dur + LEAD} lead={LEAD} />
              </Sequence>
            ) : null}
          </React.Fragment>
        ))}
        {segs.map((s, i) => (
          <Sequence key={i} name={`Müzik: ${s.name}`} from={s.from} durationInFrames={s.to - s.from} layout="none">
            <MusicTrack src={`ses/${s.name}.mp3`} base={s.volume} dur={s.to - s.from} speaking={allSpeaking} offset={s.from} />
          </Sequence>
        ))}
        <Sequence name="Bitiş kartı" from={endFrom} durationInFrames={4 * fps}>
          <EndCard series={script.seriesTitle} episodeNo={script.episodeNo} text={script.endCard?.text} sub={script.endCard?.sub} />
          <Audio src={staticFile("ses/muzik/jenerik_tema.mp3")} volume={0.55} />
        </Sequence>
      </Sequence>
      <FilmFinish vignette={0.4} grain={0.05} />
    </AbsoluteFill>
  );
};

export const calculateEpisode3DMetadata: CalculateMetadataFunction<EpisodeProps> = async ({ props }) => {
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
