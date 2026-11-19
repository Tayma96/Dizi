import type { Emotion, Gesture, MouthCue, Prop } from "../rig/types";
import type { SetName3D as SetName } from "../../studio3d/sets3d";
import type { TimeOfDay } from "../../studio3d/textures";

/* ======================= SENARYO (bölüm JSON) FORMATI =======================
 * public/episodes/<id>.json — yönetmen ekibinin yazdığı çekim senaryosu.
 * Replik sesleri: tools/seslendir.py public/episodes/<id>.json
 * =========================================================================== */

export type ShotType = "genis" | "orta" | "yakin" | "cok_yakin" | "iki" | "omuz" | "ust_aci";
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
  /** Tasarlanmış kadraj: kamerayı elle kur (ör. dikey kadraja göre establishing). Hareketler (yaklas/uzaklas) yine uygulanır. */
  cam?: { pos: [number, number, number]; target: [number, number, number]; fov?: number };
  /** 2D elle kadraj: hazır ad (ör. "pencere") ya da { cx, cy, z } */
  kadraj?: string | { cx: number; cy: number; z: number };
};

/** Tek ışık kaynağı: p = konum (yönlü ışıkta sahne merkezine doğru), c = renk, i = şiddet */
export type LightSrc = { p: [number, number, number]; c: string; i: number; tip?: "yonlu" | "nokta"; menzil?: number };
/** Sahne ışık tasarımı: anahtar + dolgu + arka (+ isteğe bağlı pratik ışıklar). Verilmezse set/zaman varsayılanı kullanılır. */
export type LightDesign = { /** 0-1: gölge sertliği */ kontrast?: number; ortam?: number; ortamRenk?: string; gok?: number; anahtar?: LightSrc; dolgu?: LightSrc; arka?: LightSrc; ekstra?: LightSrc[] };

export type CharState = {
  mark?: string;
  emotion?: Emotion;
  gesture?: Gesture | "sarilma" | "kapiAc";
  prop?: Prop;
  /** yat: yatakta uzanık (kalçadan 90°); dogrul: yattığı yerden oturur hâle doğrulur (bir kez oynar) */
  body?: "stand" | "sit" | "walk" | "yat" | "dogrul" | "yatakta";
  /** bakılan karakter id ya da "kamera" */
  lookAt?: string;
  tears?: number;
  pale?: number;
  sweat?: boolean;
  wet?: boolean;
  flip?: boolean;
  /** 3D: gövdenin dönüşü (derece). Verilmezse işaretin yönü / bakılan kişi kullanılır */
  turn?: number;
  /** sahneye giriş/çıkış */
  enter?: "sol" | "sag";
  exit?: "sol" | "sag";
  hidden?: boolean;
  eyesClosed?: number;
};

export type Beat =
  | ({
      type: "line";
      who: string;
      text: string;
      emotion?: string;
      voiceover?: boolean;
      gapAfter?: number;
      /** konuşan kadrajda değil (kamera ona dönmez) */
      offscreen?: boolean;
      /** altyazıdaki konuşmacı etiketi ("" = gizle, ör. kimliği saklı ses) */
      label?: string;
      /** ses seviyesi çarpanı (vars. 1) */
      vol?: number;
      /** ses efekti zinciri: kapı arkası / telefon */
      fx?: "kapi_arkasi" | "telefon";
      /** ek ses etiketi (ElevenLabs v3/v4) */
      tags?: string;
      /** altyazıda baştan gizlenecek kelime sayısı (ses başka bir sesle örtülür) */
      gizle?: number;
      /** okuma hızı (ElevenLabs speed) */
      hiz?: number;
    } & BeatCommon)
  | ({ type: "action"; dur: number } & BeatCommon)
  | ({ type: "yazi"; text: string; dur: number; sub?: string } & BeatCommon)
  | ({ type: "mesaj"; from: string; text: string; dur: number; incoming?: boolean } & BeatCommon)
  | ({ type: "belge"; title: string; lines: string[]; imza?: string; dur: number } & BeatCommon)
  /** ekleme (insert) yakın planı: tam ekran çizim */
  | ({ type: "insert"; kind: "bileklik" | "kapi_kolu" | "haplar" | import("./Inserts2").Insert2Kind; dur: number; text?: string[] } & BeatCommon);

export type BeatCommon = {
  shot?: Shot;
  /** karakter durum değişiklikleri (kalıcıdır, sonraki vuruşlara taşınır) */
  cast?: Record<string, CharState>;
  sfx?: { name: string; at?: number; volume?: number }[];
  lightning?: boolean;
  /** aralik: kapı birkaç santim aralanır */
  door?: "ac" | "kapat" | "aralik";
  /** ekran kararması: "giris" bu vuruşun başında açılır, "cikis" sonunda kararır */
  fade?: "giris" | "cikis";
  /** ayna/yansıma görünümü (çerçeve + cam katmanı) */
  ayna?: boolean;
  /** ekran köşesinde okunur küçük yazı (ör. "GÜN 183") */
  etiket?: string;
  /** pencere dışındaki kuş: gel = uçup konar, otur = pervazda bekler */
  kus?: "gel" | "otur";
  /** vuruş içinde kesme: `at` saniyesinden itibaren bu çekim kullanılır */
  shots?: { at: number; shot: Shot }[];
  /** hücre saati bu vuruştan itibaren */
  saat?: string;
  /** bu vuruş boyunca ekranda bir ekleme yakın planı (ör. replik konuşulurken flaş görüntüsü) */
  ekle?: { kind: string; text?: string[] };
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
  look?: "normal" | "flashback" | "soguk" | "sicak" | "tekinsiz";
  /** hücre saati (ör. "07:14"); vuruşta `saat` ile değişebilir */
  saat?: string;
  /** Bilinçli ışık tasarımı (anahtar/dolgu/arka) */
  isik?: LightDesign;
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
  /** false: bitiş kartı yok (örnek/fragman) */
  endCard?: { text?: string; sub?: string } | false;
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
