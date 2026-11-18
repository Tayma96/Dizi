import type { Look } from "./rig/types";
import castJson from "./cast.json";

/** Oyuncu kadrosu — veriler cast.json'da (Python seslendirme aracı da oradan okur).
 *  `voice` = voices/ref_<voice>.wav */
export type CastMember = Look & { id: string; role: string; voice: string };

export const CAST = castJson as CastMember[];

export const castById = (id: string): CastMember => {
  const c = CAST.find((m) => m.id === id);
  if (!c) throw new Error(`Bilinmeyen karakter: ${id}`);
  return c;
};
