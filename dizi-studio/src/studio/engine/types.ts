import type { Emotion, Gesture, MouthCue, Prop } from "../rig/types";
import type { SetName } from "../sets";
import type { TimeOfDay } from "../sets/props";

/* ======================= SENARYO (bölüm JSON) FORMATI =======================
 * public/episodes/<id>.json — yönetmen ekibinin yazdığı çekim senaryosu.
 * Replik sesleri: tools/seslendir.py public/episodes/<id>.json
 * =========================================================================== */

export type ShotType = "genis" | "orta" | "yakin" | "cok_yakin" | "iki";
export type CameraMove = "sabit" | "yaklas" | "uzaklas" | "sarsinti" | "kaydir";

export type Shot = {
  type: ShotType;
  /** karakter id (iki çekimde ilk kişi) */
  on?: string;
  /** iki çekimde ikinci kişi */
  with?: string;
  move?: CameraMove;
  /** low = alttan (güç), high = üstten (çaresizlik) — dikey kaydırma ile taklit */
  angle?: "duz" | "alt" | "ust";
};

export type CharState = {
  mark?: string;
  emotion?: Emotion;
  gesture?: Gesture;
  prop?: Prop;
  body?: "stand" | "sit" | "walk";
  /** bakılan karakter id ya da "kamera" */
  lookAt?: string;
  tears?: number;
  pale?: number;
  sweat?: boolean;
  wet?: boolean;
  flip?: boolean;
  /** sahneye giriş/çıkış */
  enter?: "sol" | "sag";
  exit?: "sol" | "sag";
  hidden?: boolean;
  eyesClosed?: number;
};

export type Beat =
  | ({ type: "line"; who: string; text: string; emotion?: string; voiceover?: boolean; gapAfter?: number } & BeatCommon)
  | ({ type: "action"; dur: number } & BeatCommon)
  | ({ type: "yazi"; text: string; dur: number; sub?: string } & BeatCommon)
  | ({ type: "mesaj"; from: string; text: string; dur: number; incoming?: boolean } & BeatCommon);

export type BeatCommon = {
  shot?: Shot;
  /** karakter durum değişiklikleri (kalıcıdır, sonraki vuruşlara taşınır) */
  cast?: Record<string, CharState>;
  sfx?: { name: string; at?: number; volume?: number }[];
  lightning?: boolean;
  door?: "ac" | "kapat";
  /** ekran kararması: "giris" bu vuruşun başında açılır, "cikis" sonunda kararır */
  fade?: "giris" | "cikis";
};

export type Scene = {
  id: string;
  set: SetName;
  time?: TimeOfDay;
  rain?: boolean;
  title?: string;
  ambience?: { name: string; volume?: number };
  music?: { name: string; volume?: number; from?: number };
  /** "flashback": sepya/rüya görünümü */
  look?: "normal" | "flashback" | "soguk" | "sicak";
  cast: Record<string, CharState>;
  beats: Beat[];
  transition?: "kesme" | "kararma" | "whoosh" | "flas";
  /** Reels/Shorts için bölüm bu sahneden önce kesilebilir */
  partBreak?: boolean;
};

export type EpisodeScript = {
  series: string;
  seriesTitle: string;
  episode: string;
  episodeNo: number;
  title: string;
  fps?: number;
  scenes: Scene[];
  endCard?: { text?: string; sub?: string };
};

export type VoiceLine = {
  file: string;
  duration: number;
  words: { w: string; start: number; end: number }[];
  mouth: MouthCue[];
  text: string;
};
export type VoiceManifest = Record<string, VoiceLine>;

export type EpisodeProps = {
  episodeId: string;
  /** 0 = tüm bölüm, 1..n = Reels parçası */
  part?: number;
  script?: EpisodeScript | null;
  manifest?: VoiceManifest | null;
};

export const lineId = (sceneId: string, beatIndex: number) => `${sceneId}_${String(beatIndex + 1).padStart(2, "0")}`;
