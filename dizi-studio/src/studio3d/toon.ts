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

const toonCache = new Map<string, THREE.MeshToonMaterial>();
export const toon = (color: string) => {
  let m = toonCache.get(color);
  if (!m) {
    m = new THREE.MeshToonMaterial({ color, gradientMap: toonGradient() });
    toonCache.set(color, m);
  }
  return m;
};

const charCache = new Map<string, THREE.MeshToonMaterial>();
/** Karakter malzemesi: karanlık sahnelerde de rengini koruması için hafif öz-ışıma */
export const toonChar = (color: string) => {
  let m = charCache.get(color);
  if (!m) {
    m = new THREE.MeshToonMaterial({ color, gradientMap: toonGradient(), emissive: new THREE.Color(color), emissiveIntensity: 0.22 });
    charCache.set(color, m);
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
export const cached = (key: string, make: () => THREE.BufferGeometry) => {
  let g = geoCache.get(key);
  if (!g) {
    g = make();
    geoCache.set(key, g);
  }
  return g;
};

export const D2R = Math.PI / 180;
