import * as THREE from "three";

/* Çizgi film (toon) malzemeleri: 3 tonlu gölgelendirme + normal yönünde şişirilmiş mürekkep çizgisi */
export const INK = "#2b1d1a";

let grad: THREE.DataTexture | null = null;
export const toonGradient = () => {
  if (grad) return grad;
  const d = new Uint8Array([170, 220, 255]);
  grad = new THREE.DataTexture(d, 3, 1, THREE.RedFormat);
  grad.minFilter = THREE.NearestFilter;
  grad.magFilter = THREE.NearestFilter;
  grad.needsUpdate = true;
  return grad;
};

/** Görsel stil: "film" = 3D animasyon filmi (yumuşak gölgelendirme, mürekkep çizgisi yok); "toon" = eski 3 tonlu çizgi film. */
export const STIL: { film: boolean } = { film: true };

type CharMat = THREE.MeshToonMaterial | THREE.MeshStandardMaterial;

const toonCache = new Map<string, CharMat>();
export const toon = (color: string) => {
  let m = toonCache.get(color);
  if (!m) {
    m = STIL.film ? new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0 }) : new THREE.MeshToonMaterial({ color, gradientMap: toonGradient() });
    toonCache.set(color, m);
  }
  return m;
};

const charCache = new Map<string, CharMat>();
/** Karakter malzemesi. Film stilinde: yumuşak gölge + hafif sıcak öz-ışıma (deri altı saçılımı taklidi). */
export const toonChar = (color: string) => {
  let m = charCache.get(color);
  if (!m) {
    m = STIL.film
      ? new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0, emissive: new THREE.Color(color), emissiveIntensity: 0.22 })
      : new THREE.MeshToonMaterial({ color, gradientMap: toonGradient(), emissive: new THREE.Color(color), emissiveIntensity: 0.22 });
    charCache.set(color, m);
  }
  return m;
};

const charTexCache = new Map<string, CharMat>();
export const toonCharTex = (color: string, map: THREE.Texture, key: string) => {
  const k = `${color}-${key}`;
  let m = charTexCache.get(k);
  if (!m) {
    m = STIL.film
      ? new THREE.MeshStandardMaterial({ color, map, roughness: 0.45, metalness: 0, emissive: new THREE.Color(color), emissiveIntensity: 0.18, emissiveMap: map })
      : new THREE.MeshToonMaterial({ color, map, gradientMap: toonGradient(), emissive: new THREE.Color(color), emissiveIntensity: 0.18, emissiveMap: map });
    charTexCache.set(k, m);
  }
  return m;
};

/** Parlak yüzey (göz akı, iris): düşük pürüzlülük */
const glossCache = new Map<string, THREE.MeshStandardMaterial>();
export const gloss = (color: string, emissive = 0.15) => {
  const k = `${color}-${emissive}`;
  let m = glossCache.get(k);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.18, metalness: 0, emissive: new THREE.Color(color), emissiveIntensity: emissive });
    glossCache.set(k, m);
  }
  return m;
};

const outlineCache = new Map<number, THREE.MeshBasicMaterial>();
/** Mürekkep çizgisi: arka yüzleri normal yönünde `thick` kadar şişirip koyu boyar. */
export const outline = (thick = 0.008) => {
  const key = Math.round(thick * 10000);
  let m = outlineCache.get(key);
  if (!m) {
    m = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.thick = { value: thick };
      shader.vertexShader = shader.vertexShader
        .replace("void main() {", "uniform float thick;\nvoid main() {")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed += normalize(normal) * thick;");
    };
    m.customProgramCacheKey = () => `outline-${key}`;
    if (STIL.film) m.visible = false;
    outlineCache.set(key, m);
  }
  return m;
};

const basicCache = new Map<string, THREE.MeshBasicMaterial>();
export const flat = (color: string, opacity = 1) => {
  const k = `${color}-${opacity}`;
  let m = basicCache.get(k);
  if (!m) {
    m = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity >= 1 });
    basicCache.set(k, m);
  }
  return m;
};

/** Parametrik yüzey: fn(u,v) -> nokta. u,v ∈ [0,1]. */
export const paramSurface = (fn: (u: number, v: number) => THREE.Vector3, us: number, vs: number, uvFn?: (u: number, v: number) => [number, number]) => {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let j = 0; j <= vs; j++) {
    for (let i = 0; i <= us; i++) {
      const u = i / us;
      const v = j / vs;
      const p = fn(u, v);
      pos.push(p.x, p.y, p.z);
      const t = uvFn ? uvFn(u, v) : [u, v];
      uv.push(t[0], t[1]);
    }
  }
  for (let j = 0; j < vs; j++) {
    for (let i = 0; i < us; i++) {
      const a = j * (us + 1) + i;
      const b = a + 1;
      const c = a + (us + 1);
      const d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

const geoCache = new Map<string, THREE.BufferGeometry>();
export const cached = (key: string, make: () => THREE.BufferGeometry, outward = false) => {
  let g = geoCache.get(key);
  if (!g) {
    g = make();
    if (outward) orientOutward(g);
    geoCache.set(key, g);
  }
  return g;
};

export const D2R = Math.PI / 180;

/** Yüzey normallerini dışa çevirir (ters üretilmiş yüzeyler siyah görünmesin diye). */
export const orientOutward = (g: THREE.BufferGeometry, center?: THREE.Vector3) => {
  g.computeBoundingBox();
  const c = center ?? g.boundingBox!.getCenter(new THREE.Vector3());
  if (!g.attributes.normal) g.computeVertexNormals();
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  let sum = 0;
  for (let i = 0; i < pos.count; i++) {
    sum += (pos.getX(i) - c.x) * nor.getX(i) + (pos.getY(i) - c.y) * nor.getY(i) + (pos.getZ(i) - c.z) * nor.getZ(i);
  }
  if (sum < 0) {
    const idx = g.index;
    if (idx) {
      for (let i = 0; i < idx.count; i += 3) {
        const a = idx.getX(i + 1);
        idx.setX(i + 1, idx.getX(i + 2));
        idx.setX(i + 2, a);
      }
      idx.needsUpdate = true;
    }
    g.computeVertexNormals();
  }
  return g;
};

/** Sahne kontrastı: 0 = varsayılan yumuşak 3 ton, 1 = sert gölge (gerilim/gece). Tüm toon malzemeleri aynı gradyanı paylaşır. */
export const setToonContrast = (k = 0) => {
  const g = toonGradient();
  const d = g.image.data as Uint8Array;
  const a = Math.round(170 - 105 * k);
  const b = Math.round(220 - 45 * k);
  if (d[0] !== a || d[1] !== b) {
    d[0] = a;
    d[1] = b;
    g.needsUpdate = true;
  }
  // karakterlerin öz-ışıması kontrastla azalır (gölge tarafı gerçekten kararsın)
  const glow = 1 - 0.75 * k;
  for (const m of charCache.values()) m.emissiveIntensity = (STIL.film ? 0.12 : 0.22) * glow;
  for (const m of charTexCache.values()) m.emissiveIntensity = (STIL.film ? 0.1 : 0.18) * glow;
};


/** 3D ten düzeltmesi: kadro renkleri 2D paletten gelir ve toon ışıkta beyaza kaçar.
 *  Tonu korur, doygunluğu artırır, açıklığı biraz düşürür (ten gerçek ten gibi okunur). */
const tenCache = new Map<string, string>();
export const tenRengi = (hex: string) => {
  let v = tenCache.get(hex);
  if (!v) {
    const c = new THREE.Color(hex);
    const hsl = { h: 0, s: 0, l: 0 };
    c.getHSL(hsl);
    c.setHSL(hsl.h - (STIL.film ? 0.018 : 0), Math.min(0.85, hsl.s * (STIL.film ? 1.0 : 1.12)), hsl.l * (STIL.film ? 0.97 : 0.88));
    v = `#${c.getHexString()}`;
    tenCache.set(hex, v);
  }
  return v;
};
