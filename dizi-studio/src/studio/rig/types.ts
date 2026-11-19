export type HairStyle =
  | "longStraight"
  | "longWavy"
  | "ponytail"
  | "bun"
  | "bob"
  | "curly"
  | "braids"
  | "shortMale"
  | "spiky"
  | "slick"
  | "buzz"
  | "balding"
  | "bald"
  | "hijab";

export type Outfit =
  | "tshirt"
  | "sweater"
  | "shirt"
  | "suit"
  | "dress"
  | "cardigan"
  | "coat"
  | "hoodie"
  | "school"
  | "apron"
  | "labcoat"
  | "police"
  | "tracksuit"
  /** kabin görevlisi üniforması: ceket, bluz, fular, kanat rozeti, kalem etek */
  | "hostes"
  /** doğal lif dokuma tunik (ada halkı), ip kemer, saçaklı etek ucu */
  | "yerli";

export type Emotion =
  | "notr"
  | "mutlu"
  | "gulen"
  | "uzgun"
  | "agliyor"
  | "ofkeli"
  | "korkmus"
  | "saskin"
  | "sok"
  | "supheli"
  | "utangac"
  | "alayci"
  | "dusunceli"
  | "yorgun"
  | "soguk"
  | "kararli"
  | "igrenmis"
  /** baş ağrısı, sersemlik */
  | "aci";

export type Gesture =
  | "rest"
  | "yudum"
  | "okuma"
  | "elBelde"
  | "kollarBagli"
  | "isaret"
  | "elSalla"
  | "eliYuzunde"
  | "eliKalbinde"
  | "omuzSilk"
  | "yumruk"
  | "dusunme"
  | "telefon"
  | "tutuyor"
  | "ellerAcik"
  | "ellerYuzde"
  | "durDur"
  /** ağrıyan başını tutma (sağ el şakakta) */
  | "basTutma";

export type Viseme = "X" | "A" | "E" | "I" | "O" | "U" | "M" | "F" | "L";

export type MouthCue = { t: number; v: Viseme };

export type Prop = "none" | "telefon" | "poset" | "fincan" | "mektup" | "canta" | "cicek" | "bicak" | "anahtar" | "kitap" | "kalem" | "tepsi" | "ilac" | "pano" | "bardak" | "sopa";

export type Look = {
  name: string;
  gender: "f" | "m";
  age: "child" | "teen" | "adult" | "old";
  build: "slim" | "normal" | "heavy";
  skin: string;
  skinShade: string;
  hair: { style: HairStyle; color: string; shade: string };
  iris: string;
  facialHair?: "mustache" | "beard" | "stubble" | "goatee";
  outfit: {
    type: Outfit;
    top: string;
    topShade: string;
    bottom: string;
    shoes: string;
    /** tie / scarf / vest / inner shirt colour */
    accent?: string;
  };
  glasses?: string;
  earrings?: string;
  blush?: boolean;
  mole?: boolean;
  /** kaşta yara izi */
  scar?: boolean;
  /** sağ bilekte hasta bilekliği */
  bileklik?: boolean;
  /** yüzde kan (0-1): alında yarık, yanaktan süzülen kan */
  kan?: number;
  /** yırtık, kirli giysi */
  yirtik?: boolean;
  /** reçineli yaprak sargıları (alın ve kol) */
  sargi?: boolean;
  /** deniz kabuğu kolye rengi */
  kolye?: string;
};

export type ArmPose = { upper: number; fore: number; ul?: number; fl?: number };

export type Pose = {
  emotion?: Emotion;
  gesture?: Gesture;
  /** Override individual arms (degrees). upper: + outward, fore: + outward bend */
  armL?: ArmPose;
  armR?: ArmPose;
  /** gaze -1..1 */
  lookX?: number;
  lookY?: number;
  /** head turn -1 (to screen left) .. 1 (to screen right) */
  yaw?: number;
  /** head tilt degrees */
  tilt?: number;
  body?: "stand" | "sit" | "walk";
  /** bacakları çizme (yatakta, battaniye altında) */
  hideLegs?: boolean;
  /** zemin gölgesini çizme (yerde yatarken) */
  golgesiz?: boolean;
  /** Lip sync: viseme cues (seconds) starting at frame `from` of the current sequence */
  speech?: { cues: MouthCue[]; from: number };
  /** Random mouth flaps when no cues are available */
  talk?: [number, number][];
  tears?: number;
  pale?: number;
  sweat?: boolean;
  wet?: boolean;
  prop?: Prop;
  eyesClosed?: number;
  /** Breathing intensity multiplier (1 normal, 3 panting) */
  breath?: number;
  seed?: number;
};
