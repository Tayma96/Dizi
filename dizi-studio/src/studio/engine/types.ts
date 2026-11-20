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
  /** bakış yönü elle: x -1..1 (sol/sağ), y -1..1 (yukarı/aşağı); ör. duvardaki televizyona bakmak */
  bak?: { x: number; y: number; yaw?: number };
  /** arka plan hastalarının tekrarlayan tuhaf davranışı */
  tik?: "sallan" | "konus" | "selam" | "volta" | "tavan" | "titre";
  /** yerinde yürü (takip çekimi; mekân kayar) */
  yuru?: boolean;
  /** yat: yatakta uzanık (kalçadan 90°); dogrul: yattığı yerden oturur hâle doğrulur (bir kez oynar) */
  body?: "stand" | "sit" | "walk" | "yat" | "dogrul" | "yatakta";
  /** yerde/sedirde yatıyor: battaniye yok, bacaklar görünür */
  zemin?: boolean;
  /** kol duruşu elle (derece): dağınık yatış, kırık kol vb. */
  kol?: { L?: { upper: number; fore: number }; R?: { upper: number; fore: number } };
  /** bacak açıları [sol, sağ] (derece, kalçadan) */
  bacak?: [number, number];
  /** yatarken gövdenin ek eğimi (derece) */
  egim?: number;
  /** bakılan karakter id ya da "kamera" */
  lookAt?: string;
  tears?: number;
  pale?: number;
  sweat?: boolean;
  /** sivilcede krem */
  krem?: boolean;
  /** sağ elde mürekkep */
  murekkep?: boolean;
  /** body "dogrul" ile: en fazla bu oranda doğrulur (0-1) */
  dogrulma?: number;
  /** diz çökme: true = beat başında 0,6 sn'de çöker (yürüyüşten sonra), "kalk" = kalkar */
  diz?: boolean | "kalk";
  /** önlük: "giy" = bu vuruş boyunca giyer (animasyon), true = giyili */
  onluk?: "giy" | true;
  /** kısmi doğrulmadan sonra vuruş sonunda geri düşer */
  geriDus?: boolean;
  /** alnında serin yaprak */
  yaprak?: boolean;
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
      fx?: "kapi_arkasi" | "telefon" | "telefon_uzak";
      /** ek ses etiketi (ElevenLabs v3/v4) */
      tags?: string;
      /** altyazıda baştan gizlenecek kelime sayısı (ses başka bir sesle örtülür) */
      gizle?: number;
      /** okuma hızı (ElevenLabs speed) */
      hiz?: number;
    } & BeatCommon)
  | ({ type: "action"; dur: number } & BeatCommon)
  | ({ type: "yazi"; text: string; dur: number; sub?: string } & BeatCommon)
  | ({ type: "mesaj"; from: string; text: string; dur: number; incoming?: boolean; sohbet?: { ben?: boolean; text: string; at: number }[] } & BeatCommon)
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
  door?: "ac" | "kapat" | "aralik" | "acik";
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
  /** bu vuruşta sarsılan kapı numarası (koğuş koridoru) */
  sarsil?: number;
  /** uçak türbülansı 0-1: kamera sarsıntısı + kabin ışığı titremesi */
  turb?: number;
  /** emniyet kemeri işareti bu vuruştan itibaren yanar/söner */
  kemer?: boolean;
  /** televizyon bu vuruştan itibaren: "acik" | "kapali" */
  tv?: "acik" | "kapali";
  /** tam siyah ekran (dış ses karanlıkta) */
  siyah?: boolean;
  /** FPS göz açılması: göz kapakları bu kadar saniyede kırpışarak açılır */
  gozAc?: number;
  /** 7/24: ıslak ayak izleri bu kadar saniyede belirir (0 = sil); sonraki vuruşlarda kalır */
  iz?: number;
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
  /** ikinci ortam katmanı (ör. kalabalık uğultusu) */
  ambience2?: { name: string; volume?: number };
  music?: { name: string; volume?: number; from?: number };
  /** "flashback": sepya/rüya görünümü */
  look?: "normal" | "flashback" | "soguk" | "sicak" | "tekinsiz";
  /** hücre saati (ör. "07:14"); vuruşta `saat` ile değişebilir */
  saat?: string;
  /** takip çekimi: mekân bu hızla (px/sn) sola akar, karakterler yerinde yürür */
  kaydirma?: number;
  /** resimli arka plan (public altında yol, ör. "arka/724/kapi_bakis.png"); verilirse çizilmiş set yerine kullanılır */
  arka?: string;
  /** kulübe orta direği x konumu (karakterlerin arkasında) */
  direk?: number;
  /** arka plan resminin karakterlerin ÖNÜNDE kalacak kısmı: 1080x1920 koordinatında SVG path (ör. kasa bankosu) */
  arkaOn?: string;
  /** bu sahneye özel işaretler (setin işaretlerini ezer/ekler) */
  isaretler?: Record<string, { x: number; y: number; size: number; sit?: boolean }>;
  /** Bilinçli ışık tasarımı (anahtar/dolgu/arka) */
  isik?: LightDesign;
  cast: Record<string, CharState>;
  beats: Beat[];
  transition?: "kesme" | "kararma" | "whoosh" | "flas" | "kaydir";
  /** altyazı yeri: "alt" = daha aşağıda (yüzler alt bantta olduğunda) */
  altyazi?: "alt" | "ust";
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
