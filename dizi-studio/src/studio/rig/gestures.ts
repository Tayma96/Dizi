import type { ArmPose, Gesture } from "./types";

export type FullArm = ArmPose & { ul?: number; fl?: number };

/** L = arm on the screen-left side, R = screen-right side. Angles in degrees:
 *  upper > 0 swings the arm outward, fore > 0 bends the forearm outward, < 0 inward.
 *  ul/fl scale the segment length to fake foreshortening (arm coming toward camera). */
export const GESTURES: Record<Gesture, { L: FullArm; R: FullArm }> = {
  rest: { L: { upper: 6, fore: 0 }, R: { upper: 6, fore: 0 } },
  elBelde: { L: { upper: 40, fore: -100 }, R: { upper: 40, fore: -100 } },
  kollarBagli: { L: { upper: 8, fore: -122, ul: 0.85 }, R: { upper: 8, fore: -112, ul: 0.85 } },
  isaret: { L: { upper: 6, fore: 0 }, R: { upper: 92, fore: 4 } },
  elSalla: { L: { upper: 6, fore: 0 }, R: { upper: 145, fore: -20 } },
  eliYuzunde: { L: { upper: 6, fore: 0 }, R: { upper: -14, fore: -166, ul: 0.42 } },
  eliKalbinde: { L: { upper: 6, fore: 0 }, R: { upper: -18, fore: -128, ul: 0.8 } },
  omuzSilk: { L: { upper: 30, fore: 64 }, R: { upper: 30, fore: 64 } },
  yumruk: { L: { upper: 14, fore: -32 }, R: { upper: 14, fore: -32 } },
  dusunme: { L: { upper: 8, fore: -112, ul: 0.85 }, R: { upper: -10, fore: -168, ul: 0.45 } },
  telefon: { L: { upper: 6, fore: 0 }, R: { upper: 18, fore: -172, ul: 0.5 } },
  tutuyor: { L: { upper: 6, fore: 0 }, R: { upper: -4, fore: -78 } },
  ellerAcik: { L: { upper: 22, fore: -70, fl: 0.8 }, R: { upper: 22, fore: -70, fl: 0.8 } },
  ellerYuzde: { L: { upper: -16, fore: -166, ul: 0.42 }, R: { upper: -16, fore: -166, ul: 0.42 } },
  durDur: { L: { upper: 6, fore: 0 }, R: { upper: -6, fore: -150, ul: 0.6 } },
  /** fincanı ağza götürme (sağ el, fincan prop) */
  yudum: { L: { upper: 10, fore: -58, ul: 0.8 }, R: { upper: -12, fore: -158, ul: 0.48 } },
  /** iki el önde, masadaki notların üstünde */
  okuma: { L: { upper: 12, fore: -62, ul: 0.8 }, R: { upper: 12, fore: -62, ul: 0.8 } },
  basTutma: { L: { upper: 6, fore: 0 }, R: { upper: 144, fore: 82, ul: 0.9, fl: 0.9 } },
  /** gözlerini kamaştıran ışığa karşı elini siper eder */
  golge: { L: { upper: 12, fore: -62, ul: 0.8 }, R: { upper: 155, fore: 92 } },
  /** iki el direksiyonda */
  direksiyon: { L: { upper: 14, fore: -66, ul: 0.78 }, R: { upper: 14, fore: -66, ul: 0.78 } },
  /** yanındaki oturan kişinin saçını okşar (sol kol) */
  okşa: { L: { upper: 126, fore: 0, ul: 0.45, fl: 0.35 }, R: { upper: 6, fore: 0 } },
  /** yanındakinin kolundan tutup çeker (sol kol, ekranın soluna uzanır) */
  kolTut: { L: { upper: 64, fore: -30, ul: 0.86, fl: 0.95 }, R: { upper: 10, fore: -20 } },
  krem: { L: { upper: 6, fore: 0 }, R: { upper: 85, fore: 122, ul: 0.41, fl: 1.03 } },
  yuzGoster: { L: { upper: 6, fore: 0 }, R: { upper: 85, fore: 119, ul: 0.41, fl: 0.8 } },
  kafaKasi: { L: { upper: 6, fore: 0 }, R: { upper: 150, fore: 76, ul: 0.9, fl: 0.88 } },
  uzat: { L: { upper: 6, fore: 0 }, R: { upper: 52, fore: -34, ul: 0.72, fl: 0.9 } },
};
