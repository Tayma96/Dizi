import type { Beat, CharState, EpisodeScript, Scene, Shot, VoiceManifest } from "./types";
import { lineId } from "./types";

export type TBeat = {
  index: number;
  beat: Beat;
  from: number; // frames, relative to scene start
  dur: number; // frames
  voice?: { file: string; from: number; dur: number; mouth: VoiceManifest[string]["mouth"]; words: VoiceManifest[string]["words"] };
  shot: Shot;
  cast: Record<string, CharState>; // resolved state of everyone during this beat
};

export type TScene = {
  scene: Scene;
  from: number; // frames, absolute
  dur: number;
  beats: TBeat[];
  speaking: [number, number][]; // absolute frame intervals with dialogue
};

export type Timeline = { scenes: TScene[]; total: number; parts: [number, number][]; fps: number };

const END_CARD_SEC = 4;

export const buildTimeline = (script: EpisodeScript, manifest: VoiceManifest): Timeline => {
  const fps = script.fps ?? 30;
  let t = 0;
  const scenes: TScene[] = [];
  const partStarts: number[] = [0];
  for (const scene of script.scenes) {
    if (scene.partBreak && t > 0) partStarts.push(t);
    let local = 0;
    let shot: Shot = { type: "genis", move: "yaklas" };
    let cast: Record<string, CharState> = JSON.parse(JSON.stringify(scene.cast));
    const beats: TBeat[] = [];
    const speaking: [number, number][] = [];
    scene.beats.forEach((beat, i) => {
      if (beat.cast) {
        for (const [id, st] of Object.entries(beat.cast)) cast[id] = { ...(cast[id] ?? {}), ...st };
      }
      if (beat.shot) shot = beat.shot;
      else if (beat.type === "line" && !beat.voiceover && !beat.offscreen) shot = { type: "orta", on: beat.who, move: "yaklas" };
      let dur: number;
      let voice: TBeat["voice"];
      if (beat.type === "line") {
        const v = manifest[lineId(scene.id, i)];
        const sec = v ? v.duration : Math.max(1.2, beat.text.split(" ").length * 0.42);
        const gap = beat.gapAfter ?? 0.3;
        dur = Math.round((sec + gap) * fps);
        const vFrom = Math.round(0.08 * fps);
        voice = v ? { file: v.file, from: vFrom, dur: Math.round(sec * fps), mouth: v.mouth, words: v.words } : undefined;
        speaking.push([t + local + vFrom, t + local + vFrom + Math.round(sec * fps)]);
      } else {
        dur = Math.round(beat.dur * fps);
      }
      beats.push({ index: i, beat, from: local, dur, voice, shot, cast: JSON.parse(JSON.stringify(cast)) });
      // one-shot flags shouldn't persist
      for (const id of Object.keys(cast)) {
        delete cast[id].enter;
        if (cast[id].exit) cast[id] = { ...cast[id], hidden: true, exit: undefined };
      }
      local += dur;
    });
    scenes.push({ scene, from: t, dur: local, beats, speaking });
    t += local;
  }
  const total = t + END_CARD_SEC * fps;
  const parts: [number, number][] = partStarts.map((s, i) => [s, i + 1 < partStarts.length ? partStarts[i + 1] : total]);
  return { scenes, total, parts, fps };
};
