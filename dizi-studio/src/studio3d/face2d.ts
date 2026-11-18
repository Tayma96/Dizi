/* Yüz dokusu: 2D yüz çizimini (göz, kaş, ağız, allık, gözyaşı, bıyık) bir canvas'a çizer.
   Bu canvas 3D kafanın ön yüzeyine "giydirilir"; böylece 2D'deki ifade dili korunur, kafa 360° döner.
   Koordinatlar 2D rig ile aynı (SVG 400x1000 uzayı); canvas bölgesi x 90..310, y 100..340. */
import { EMOTION_FACE, type FaceParams } from "../studio/rig/face";
import type { Emotion, Look, Viseme } from "../studio/rig/types";

export const FACE_X0 = 90;
export const FACE_Y0 = 100;
export const FACE_W = 220;
export const FACE_H = 240;
export const FACE_PX = 4; // canvas piksel / birim → 880x960

const OUT = "#2b1d1a";

export type FaceState = {
  emotion: Emotion;
  viseme: Viseme | null;
  lookX: number;
  lookY: number;
  blink: number; // 0..1 closed
  tears: number;
  pale: number;
  sweat?: boolean;
  frame: number;
  /** 3D göz ve burun kullanılıyorsa dokuya çizilmez (film stili) */
  eyes3d?: boolean;
};

const stroke = (ctx: CanvasRenderingContext2D, d: string, color: string, w: number) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(new Path2D(d));
};
const fill = (ctx: CanvasRenderingContext2D, d: string, color: string) => {
  ctx.fillStyle = color;
  ctx.fill(new Path2D(d));
};

const drawEye = (ctx: CanvasRenderingContext2D, cx: number, cy: number, look: Look, f: FaceParams, s: FaceState, flip: boolean) => {
  const w = 22;
  const h = 15;
  const sg = flip ? -1 : 1;
  const open = f.eyeOpen * (1 - s.blink);
  if (f.eyeSmile || open <= 0.05) {
    const d = f.eyeSmile ? `M ${cx - w} ${cy + 4} Q ${cx} ${cy - 16} ${cx + w} ${cy + 4}` : `M ${cx - w} ${cy} Q ${cx} ${cy + 9} ${cx + w} ${cy}`;
    stroke(ctx, d, OUT, 5);
    return;
  }
  const top = cy - h * 1.35 * Math.min(1.35, open);
  const bot = cy + h * 1.1 * Math.min(1.2, 0.6 + open * 0.4);
  const shape = `M ${cx - w * sg} ${cy} Q ${cx - w * 0.3 * sg} ${top} ${cx + w * sg} ${cy - 2} Q ${cx + w * 0.2 * sg} ${bot} ${cx - w * sg} ${cy} Z`;
  fill(ctx, shape, "#fdfaf5");
  ctx.save();
  ctx.clip(new Path2D(shape));
  const ix = cx + s.lookX * 7;
  const iy = cy + s.lookY * 5;
  ctx.fillStyle = look.iris;
  ctx.beginPath();
  ctx.arc(ix, iy, 11.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#120c0a";
  ctx.beginPath();
  ctx.arc(ix, iy, 6 * f.pupil, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(ix + 4, iy - 4, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  stroke(ctx, `M ${cx - (w + 2) * sg} ${cy + 1} Q ${cx - w * 0.3 * sg} ${top - 1} ${cx + (w + 2) * sg} ${cy - 2}`, OUT, 4.5);
  if (look.gender === "f" && look.age !== "child") {
    stroke(ctx, `M ${cx - (w + 1) * sg} ${cy} l ${-8 * sg} -5 M ${cx - (w - 5) * sg} ${cy - 8} l ${-7 * sg} -7`, OUT, 3.5);
  }
  if (look.age === "old") {
    ctx.globalAlpha = 0.35;
    stroke(ctx, `M ${cx - w * 0.7} ${cy + h * 1.15} Q ${cx} ${cy + h * 1.6} ${cx + w * 0.7} ${cy + h}`, OUT, 2);
    ctx.globalAlpha = 1;
  }
};

const drawBrow = (ctx: CanvasRenderingContext2D, cx: number, cy: number, f: FaceParams, color: string, flip: boolean, thick: number, arch = 7) => {
  const sg = flip ? -1 : 1;
  const xi = cx + 22 * sg;
  const xo = cx - 22 * sg;
  const yi = cy + 3 + f.browLift - f.browInner;
  const yo = cy + 3 + f.browLift - f.browOuter;
  const ym = Math.min(yi, yo) - arch;
  stroke(ctx, `M ${xo} ${yo} Q ${cx} ${ym} ${xi} ${yi}`, color, thick);
};

/** Film stili kadın dudakları (dinlenme hali): kupid yayı olan üst dudak + dolgun alt dudak */
const drawLips = (ctx: CanvasRenderingContext2D, cx: number, cy: number, rest: FaceParams["mouth"], col: string) => {
  const smile = rest === "smile" || rest === "smirk" ? 4 : rest === "frown" ? -3 : 0;
  const up = `M ${cx - 17} ${cy - smile * 0.5} Q ${cx - 9} ${cy - 8} ${cx - 2} ${cy - 5} Q ${cx} ${cy - 3.5} ${cx + 2} ${cy - 5} Q ${cx + 9} ${cy - 8} ${cx + 17} ${cy - smile * 0.5} Q ${cx} ${cy + 1} ${cx - 17} ${cy - smile * 0.5} Z`;
  const lo = `M ${cx - 16} ${cy - smile * 0.5} Q ${cx} ${cy + 2} ${cx + 16} ${cy - smile * 0.5} Q ${cx + 10} ${cy + 11} ${cx} ${cy + 11} Q ${cx - 10} ${cy + 11} ${cx - 16} ${cy - smile * 0.5} Z`;
  fill(ctx, lo, col);
  fill(ctx, up, col);
  ctx.globalAlpha = 0.35;
  fill(ctx, `M ${cx - 7} ${cy + 5} Q ${cx} ${cy + 3.5} ${cx + 7} ${cy + 5} Q ${cx} ${cy + 8} ${cx - 7} ${cy + 5} Z`, "#ffffff");
  ctx.globalAlpha = 1;
  stroke(ctx, `M ${cx - 16} ${cy - smile * 0.5} Q ${cx} ${cy + 2.5} ${cx + 16} ${cy - smile * 0.5}`, "#6a2a2c", 2.4);
};

/** Film stili kadın ağzı konuşurken: koyu ağız içi + üstte ve altta dolgun dudaklar (dudak senkronu ağız şekilleriyle aynı) */
const drawLipsOpen = (ctx: CanvasRenderingContext2D, cx: number, cy: number, v: Viseme, amp: number, col: string) => {
  const S: Record<string, [number, number]> = { A: [15, 17], E: [17, 10], I: [17, 6], O: [10, 13], U: [7, 8], M: [15, 0], F: [15, 5], L: [13, 7] };
  const [w, h0] = S[v] ?? [14, 6];
  const h = h0 * amp;
  const inside = `M ${cx - w} ${cy} Q ${cx} ${cy - 3} ${cx + w} ${cy} Q ${cx} ${cy + h * 1.3 + 2} ${cx - w} ${cy} Z`;
  fill(ctx, inside, "#4a1a1c");
  if (v === "E" || v === "I" || v === "L" || v === "F") fill(ctx, `M ${cx - w * 0.7} ${cy + 0.5} Q ${cx} ${cy - 1.5} ${cx + w * 0.7} ${cy + 0.5} L ${cx + w * 0.6} ${cy + 4} Q ${cx} ${cy + 2.5} ${cx - w * 0.6} ${cy + 4} Z`, "#fffaf2");
  const ww = w + 3;
  fill(ctx, `M ${cx - ww} ${cy} Q ${cx - 9} ${cy - 9} ${cx - 2} ${cy - 6} Q ${cx} ${cy - 4.5} ${cx + 2} ${cy - 6} Q ${cx + 9} ${cy - 9} ${cx + ww} ${cy} Q ${cx} ${cy - 2.5} ${cx - ww} ${cy} Z`, col);
  const by = cy + h * 1.3 + 1;
  fill(ctx, `M ${cx - ww + 1} ${cy + 1} Q ${cx} ${by + 1} ${cx + ww - 1} ${cy + 1} Q ${cx + 10} ${by + 10} ${cx} ${by + 10} Q ${cx - 10} ${by + 10} ${cx - ww + 1} ${cy + 1} Z`, col);
  ctx.globalAlpha = 0.3;
  fill(ctx, `M ${cx - 6} ${by + 5} Q ${cx} ${by + 3.5} ${cx + 6} ${by + 5} Q ${cx} ${by + 7.5} ${cx - 6} ${by + 5} Z`, "#ffffff");
  ctx.globalAlpha = 1;
};

const drawMouth = (ctx: CanvasRenderingContext2D, v: Viseme | null, rest: FaceParams["mouth"], cx: number, cy: number, amp: number, lc = OUT) => {
  const inside = "#5e2324";
  const tongue = "#d9777a";
  const teeth = "#fffaf2";
  if (v && v !== "X") {
    const S: Record<string, { w: number; h: number; round?: boolean; teeth?: boolean; closed?: boolean; f?: boolean }> = {
      A: { w: 17, h: 20 }, E: { w: 19, h: 12, teeth: true }, I: { w: 18, h: 7, teeth: true }, O: { w: 11, h: 15, round: true },
      U: { w: 8, h: 9, round: true }, M: { w: 15, h: 0, closed: true }, F: { w: 15, h: 6, f: true }, L: { w: 14, h: 8, teeth: true },
    };
    const s = S[v];
    const h = s.h * amp;
    if (s.closed) {
      stroke(ctx, `M ${cx - s.w} ${cy} Q ${cx} ${cy + 3} ${cx + s.w} ${cy}`, lc, 4.5);
      return;
    }
    if (s.round) {
      ctx.fillStyle = inside;
      ctx.strokeStyle = lc;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, cy + h * 0.45, s.w, Math.max(4, h * 0.75), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      return;
    }
    const d = `M ${cx - s.w} ${cy} Q ${cx} ${cy - 5} ${cx + s.w} ${cy} Q ${cx} ${cy + h * 1.5 + 4} ${cx - s.w} ${cy} Z`;
    fill(ctx, d, inside);
    if (s.teeth) fill(ctx, `M ${cx - s.w * 0.75} ${cy + 1} Q ${cx} ${cy - 2} ${cx + s.w * 0.75} ${cy + 1} L ${cx + s.w * 0.6} ${cy + 5} Q ${cx} ${cy + 3} ${cx - s.w * 0.6} ${cy + 5} Z`, teeth);
    if (s.f) fill(ctx, `M ${cx - s.w * 0.7} ${cy + 1} L ${cx + s.w * 0.7} ${cy + 1} L ${cx + s.w * 0.6} ${cy + 6} L ${cx - s.w * 0.6} ${cy + 6} Z`, teeth);
    if (h > 10) fill(ctx, `M ${cx - s.w * 0.5} ${cy + h * 1.2} Q ${cx} ${cy + h * 0.7} ${cx + s.w * 0.5} ${cy + h * 1.2}`, tongue);
    ctx.strokeStyle = lc;
    ctx.lineWidth = 4;
    ctx.stroke(new Path2D(d));
    return;
  }
  switch (rest) {
    case "smile": return stroke(ctx, `M ${cx - 17} ${cy - 3} Q ${cx} ${cy + 12} ${cx + 17} ${cy - 3}`, lc, 4.5);
    case "grin": {
      const d = `M ${cx - 22} ${cy - 4} Q ${cx} ${cy + 30} ${cx + 22} ${cy - 4} Z`;
      fill(ctx, d, inside);
      fill(ctx, `M ${cx - 18} ${cy - 2} L ${cx + 18} ${cy - 2} L ${cx + 14} ${cy + 5} L ${cx - 14} ${cy + 5} Z`, teeth);
      fill(ctx, `M ${cx - 9} ${cy + 17} Q ${cx} ${cy + 10} ${cx + 9} ${cy + 17}`, tongue);
      return stroke(ctx, d, lc, 4);
    }
    case "frown": return stroke(ctx, `M ${cx - 16} ${cy + 6} Q ${cx} ${cy - 6} ${cx + 16} ${cy + 6}`, lc, 4.5);
    case "open": {
      const d = `M ${cx - 12} ${cy} Q ${cx} ${cy - 6} ${cx + 12} ${cy} Q ${cx + 10} ${cy + 22} ${cx} ${cy + 22} Q ${cx - 10} ${cy + 22} ${cx - 12} ${cy} Z`;
      fill(ctx, d, inside);
      return stroke(ctx, d, lc, 4);
    }
    case "o": {
      ctx.fillStyle = inside; ctx.strokeStyle = lc; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(cx, cy + 5, 9, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      return;
    }
    case "smirk": return stroke(ctx, `M ${cx - 14} ${cy + 2} Q ${cx + 4} ${cy + 6} ${cx + 18} ${cy - 6}`, lc, 4.5);
    case "tight": return stroke(ctx, `M ${cx - 12} ${cy + 2} Q ${cx} ${cy - 1} ${cx + 12} ${cy + 2}`, lc, 5.5);
    case "wavy": return stroke(ctx, `M ${cx - 16} ${cy + 4} Q ${cx - 8} ${cy - 3} ${cx} ${cy + 3} Q ${cx + 8} ${cy + 9} ${cx + 16} ${cy + 2}`, lc, 4.5);
    case "flat": return stroke(ctx, `M ${cx - 13} ${cy + 1} L ${cx + 13} ${cy + 1}`, lc, 4.5);
    default: return stroke(ctx, `M ${cx - 14} ${cy} Q ${cx} ${cy + 4} ${cx + 14} ${cy}`, lc, 4.5);
  }
};

export const drawFace = (ctx: CanvasRenderingContext2D, look: Look, s: FaceState) => {
  const f = EMOTION_FACE[s.emotion] ?? EMOTION_FACE.notr;
  const W = FACE_W * FACE_PX;
  const H = FACE_H * FACE_PX;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.setTransform(FACE_PX, 0, 0, FACE_PX, -FACE_X0 * FACE_PX, -FACE_Y0 * FACE_PX);
  const male = look.gender === "m";
  const old = look.age === "old";
  // pale tint
  if (s.pale > 0) {
    ctx.globalAlpha = s.pale * 0.35;
    ctx.fillStyle = "#c9d6e0";
    ctx.fillRect(FACE_X0, FACE_Y0, FACE_W, FACE_H);
    ctx.globalAlpha = 1;
  }
  if (old) {
    ctx.globalAlpha = 0.3;
    for (const d of ["M 160 126 Q 200 118 240 126", "M 170 138 Q 200 132 230 138", "M 150 250 Q 156 268 166 278", "M 250 250 Q 244 268 234 278"]) stroke(ctx, d, OUT, 2.5);
    ctx.globalAlpha = 1;
  }
  if (look.facialHair === "stubble") {
    if (s.eyes3d) {
      // kirli sakal: çene hattı, çene ucu ve üst dudakta yumuşak kenarlı noktacıklar (düz dolgu "maske" gibi durur)
      ctx.save();
      ctx.clip(new Path2D("M 132 252 Q 140 300 200 314 Q 260 300 268 252 Q 252 286 226 290 Q 200 296 174 290 Q 148 286 132 252 Z M 172 256 Q 200 248 228 256 Q 214 262 200 260 Q 186 262 172 256 Z"));
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      ctx.fillStyle = "#3a2a24";
      for (let i = 0; i < 1400; i++) {
        const x = 130 + rnd() * 140;
        const y = 246 + rnd() * 70;
        // üst kenara doğru seyrelir
        const edge = Math.min(1, Math.max(0, (y - 252) / 28));
        ctx.globalAlpha = 0.28 * edge * (0.5 + rnd() * 0.5);
        ctx.beginPath();
        ctx.arc(x, y, 0.9 + rnd() * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = 0.22;
      fill(ctx, "M 128 236 Q 132 300 200 314 Q 268 300 272 236 Q 250 276 200 282 Q 150 276 128 236 Z", "#5a4a44");
      ctx.globalAlpha = 1;
    }
  }
  if (look.facialHair === "beard") {
    fill(ctx, "M 124 230 Q 128 330 200 338 Q 272 330 276 230 Q 252 276 200 284 Q 148 276 124 230 Z", look.hair.color);
    stroke(ctx, "M 124 230 Q 128 330 200 338 Q 272 330 276 230", OUT, 3);
  }
  const blush = (look.blush === false ? 0 : 1) * f.blush * (1 - s.pale);
  if (blush > 0) {
    ctx.globalAlpha = Math.min(1, blush) * 0.85;
    ctx.fillStyle = "#ef8f8a";
    ctx.beginPath(); ctx.ellipse(146, 238, 19, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(254, 238, 19, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
  if (!s.eyes3d) {
    drawEye(ctx, 160, 198, look, f, s, false);
    drawEye(ctx, 240, 198, look, f, s, true);
  }
  const browColor = look.hair.style === "hijab" ? "#4a3428" : old ? "#7d746c" : s.eyes3d ? look.hair.shade : look.hair.color;
  // film stilinde kaşlar gözün biraz üstünde ve daha ince (3D göz daha büyük)
  const by = s.eyes3d ? 150 : 160;
  // film: erkekte kalın-düz kaş (keskin bakış), kadında ince-kavisli
  const bt = s.eyes3d ? (male ? 8.5 : 4.2) : male ? 8 : 6.5;
  const ba = s.eyes3d ? (male ? 3 : 11) : 7;
  drawBrow(ctx, 160, by, f, browColor, false, bt, ba);
  drawBrow(ctx, 240, by, f, browColor, true, bt, ba);
  if (!s.eyes3d) stroke(ctx, "M 202 214 Q 196 236 204 244", OUT, 3.5);
  if (look.scar) {
    stroke(ctx, "M 226 140 L 238 176", "#9a4a40", 4);
    stroke(ctx, "M 224 150 l 8 -2 M 228 160 l 8 -2 M 232 170 l 8 -2", "#9a4a40", 2.5);
  }
  if (look.mole) { ctx.fillStyle = "#5a3a2a"; ctx.beginPath(); ctx.arc(236, 262, 3, 0, Math.PI * 2); ctx.fill(); }
  if (look.facialHair === "mustache" || look.facialHair === "beard") {
    const d = "M 166 262 Q 200 246 234 262 Q 220 270 200 264 Q 180 270 166 262 Z";
    fill(ctx, d, look.hair.color);
    stroke(ctx, d, OUT, 3);
  }
  if (look.facialHair === "goatee") {
    const d = "M 186 292 Q 200 312 214 292 L 210 302 Q 200 306 190 302 Z";
    fill(ctx, d, look.hair.color);
    stroke(ctx, d, OUT, 3);
  }
  const amp = s.emotion === "ofkeli" || s.emotion === "korkmus" || s.emotion === "sok" ? 1.25 : s.emotion === "uzgun" || s.emotion === "yorgun" ? 0.8 : 1;
  if (s.eyes3d) {
    // film stili: ağız biraz yukarıda ve büyük (yüz oranı), çizgi rengi dudak tonunda
    ctx.save();
    ctx.translate(200, 266);
    ctx.scale(1.3, 1.3);
    ctx.translate(-200, -266);
    const fem = look.gender === "f" && look.age !== "child";
    const restLike = !s.viseme || s.viseme === "X" || s.viseme === "M";
    if (fem && restLike && ["line", "flat", "tight", "smile", "smirk", "frown"].includes(f.mouth)) drawLips(ctx, 200, 266, f.mouth, "#c45f66");
    else if (fem && s.viseme && s.viseme !== "X") drawLipsOpen(ctx, 200, 266, s.viseme, amp, "#c45f66");
    else drawMouth(ctx, s.viseme, f.mouth, 200, 266, amp, fem ? "#8a3a3e" : OUT);
    ctx.restore();
  } else drawMouth(ctx, s.viseme, f.mouth, 200, 274, amp);
  const tears = s.tears;
  if (tears > 0) {
    ctx.globalAlpha = Math.min(1, tears * 2);
    for (const [i, x] of [148, 252].entries()) {
      const len = tears * 70 + ((s.frame + i * 9) % 30) * 0.4;
      const d = `M ${x - 3} 214 Q ${x - 6} ${214 + len} ${x} ${220 + len} Q ${x + 5} ${214 + len} ${x + 3} 214 Z`;
      fill(ctx, d, "#bfe3ff");
      stroke(ctx, d, "#7fb6dd", 2);
    }
    stroke(ctx, "M 138 210 Q 160 220 182 210 M 218 210 Q 240 220 262 210", "#bfe3ff", 4);
    ctx.globalAlpha = 1;
  }
  if (s.sweat) {
    const d = "M 282 140 q -7 16 0 22 q 7 -6 0 -22 z";
    fill(ctx, d, "#bfe3ff");
    stroke(ctx, d, "#6fa8cf", 2);
  }
};
