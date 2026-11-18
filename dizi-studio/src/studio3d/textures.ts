import * as THREE from "three";
import { random } from "remotion";

/* Canvas tabanlı dokular: duvar kâğıdı, parke, pencere manzarası (yağmurlu), saat, tablo, ekran. */
const cache = new Map<string, THREE.CanvasTexture>();

export const canvasTex = (key: string, w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void, repeat?: [number, number]) => {
  let t = cache.get(key);
  if (t) return t;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  draw(cv.getContext("2d")!, w, h);
  t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  cache.set(key, t);
  return t;
};

/** Her karede yeniden çizilen doku (pencere, saat, ekran). Aynı key için tek canvas. */
const dyn = new Map<string, { cv: HTMLCanvasElement; t: THREE.CanvasTexture }>();
export const dynamicTex = (key: string, w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void) => {
  let d = dyn.get(key);
  if (!d) {
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    d = { cv, t };
    dyn.set(key, d);
  }
  draw(d.cv.getContext("2d")!, w, h);
  d.t.needsUpdate = true;
  return d.t;
};

export const wallpaper = (base: string, motif: string, kind: "elmas" | "cizgi" | "nokta" | "yildiz" | "duz") =>
  canvasTex(`wp-${base}-${motif}-${kind}`, 256, 256, (c, w, h) => {
    c.fillStyle = base;
    c.fillRect(0, 0, w, h);
    c.fillStyle = motif;
    if (kind === "elmas") for (const [x, y] of [[64, 64], [192, 192]]) { c.beginPath(); c.moveTo(x, y - 26); c.lineTo(x + 12, y); c.lineTo(x, y + 26); c.lineTo(x - 12, y); c.fill(); }
    if (kind === "cizgi") { c.fillRect(0, 0, 30, h); c.fillRect(128, 0, 30, h); }
    if (kind === "nokta") for (const [x, y] of [[64, 64], [192, 192], [64, 192], [192, 64]]) { c.beginPath(); c.arc(x, y, 9, 0, 7); c.fill(); }
    if (kind === "yildiz") for (const [x, y] of [[64, 64], [192, 192]]) { c.font = "60px serif"; c.fillText("★", x - 25, y + 20); }
  }, [6, 3]);

export const woodFloor = (c1: string, c2: string) =>
  canvasTex(`wood-${c1}-${c2}`, 512, 512, (c, w, h) => {
    c.fillStyle = c1;
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) {
      c.fillStyle = i % 2 ? c1 : c2;
      c.globalAlpha = 0.35;
      c.fillRect(0, i * 64, w, 64);
      c.globalAlpha = 1;
      c.fillStyle = "rgba(0,0,0,0.35)";
      c.fillRect(0, i * 64, w, 3);
      const off = (i % 3) * 170;
      c.fillRect(off, i * 64, 3, 64);
      c.fillRect((off + 256) % w, i * 64, 3, 64);
    }
  }, [4, 4]);

export const tileFloor = (c1: string, line: string) =>
  canvasTex(`tile-${c1}-${line}`, 256, 256, (c, w, h) => {
    c.fillStyle = c1;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = line;
    c.lineWidth = 4;
    c.strokeRect(0, 0, w, h);
    c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, h); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke();
  }, [8, 8]);

export type TimeOfDay = "gunduz" | "aksam" | "gece";
const SKY: Record<TimeOfDay, [string, string]> = { gunduz: ["#9fd0f0", "#e2f2fb"], aksam: ["#f0a26a", "#f6d49a"], gece: ["#0b1626", "#1d3552"] };

/** Pencere manzarası: gökyüzü, şehir, ay/güneş, yağmur, şimşek */
export const windowView = (key: string, time: TimeOfDay, frame: number, rain: boolean, flash: number, city = true) =>
  dynamicTex(`win-${key}`, 512, 640, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, SKY[time][0]);
    g.addColorStop(1, SKY[time][1]);
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    if (time === "gunduz") { c.fillStyle = "#fff6c8"; c.beginPath(); c.arc(w * 0.75, h * 0.2, 46, 0, 7); c.fill(); }
    if (time === "gece") { c.fillStyle = "#f2f0e0"; c.beginPath(); c.arc(w * 0.78, h * 0.16, 30, 0, 7); c.fill(); }
    if (city) {
      for (let i = 0; i < 8; i++) {
        const bw = 60 + random(`${key}-bw-${i}`) * 70;
        const bh = h * (0.25 + random(`${key}-bh-${i}`) * 0.5);
        const bx = i * (w / 7) - 20;
        c.fillStyle = time === "gece" ? "#14202f" : time === "aksam" ? "#7a5a5a" : "#9db4c8";
        c.fillRect(bx, h - bh, bw, bh);
        for (let j = 0; j < 10; j++) {
          if (random(`${key}-l-${i}-${j}`) > (time === "gece" ? 0.6 : 0.85)) {
            const on = random(`${key}-f-${i}-${j}-${Math.floor(frame / 45)}`) > 0.08;
            c.fillStyle = time === "gece" ? (on ? "#ffd27a" : "#3a3a2a") : "#e8f0f8";
            c.fillRect(bx + 10 + (j % 3) * 18, h - bh + 18 + Math.floor(j / 3) * 34, 10, 16);
          }
        }
      }
    }
    if (rain) {
      c.strokeStyle = "rgba(190,215,240,0.6)";
      c.lineWidth = 2;
      for (let i = 0; i < 70; i++) {
        const x = random(`${key}-rx-${i}`) * w;
        const y = (random(`${key}-ry-${i}`) * h + frame * 34) % h;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x - 6, y + 34); c.stroke();
      }
      // drops on glass
      c.fillStyle = "rgba(220,235,250,0.35)";
      for (let i = 0; i < 25; i++) {
        const x = random(`${key}-dx-${i}`) * w;
        const y = (random(`${key}-dy-${i}`) * h + frame * random(`${key}-ds-${i}`) * 3) % h;
        c.beginPath(); c.ellipse(x, y, 4, 6, 0, 0, 7); c.fill();
      }
    }
    if (flash > 0) { c.fillStyle = `rgba(232,240,255,${flash * 0.85})`; c.fillRect(0, 0, w, h); }
  });

export const clockFace = (key: string, hour: number, frame: number) =>
  dynamicTex(`clock-${key}`, 256, 256, (c) => {
    c.clearRect(0, 0, 256, 256);
    c.fillStyle = "#efe6d4"; c.strokeStyle = "#2b1d1a"; c.lineWidth = 10;
    c.beginPath(); c.arc(128, 128, 118, 0, 7); c.fill(); c.stroke();
    c.lineWidth = 6;
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; c.beginPath(); c.moveTo(128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); c.lineTo(128 + Math.sin(a) * 108, 128 - Math.cos(a) * 108); c.stroke(); }
    const hand = (a: number, len: number, wdt: number, col: string) => { c.strokeStyle = col; c.lineWidth = wdt; c.lineCap = "round"; c.beginPath(); c.moveTo(128, 128); c.lineTo(128 + Math.sin(a) * len, 128 - Math.cos(a) * len); c.stroke(); };
    hand((hour / 12) * Math.PI * 2, 55, 12, "#2b1d1a");
    hand(0, 85, 8, "#2b1d1a");
    hand((frame / 30) * (Math.PI / 30), 95, 3, "#b33");
  });

export const paintingTex = (art: "manzara" | "aile" | "yirtik" | "portre") =>
  canvasTex(`art-${art}`, 256, 192, (c, w, h) => {
    c.fillStyle = art === "manzara" ? "#bfe0f0" : "#e6d8bc";
    c.fillRect(0, 0, w, h);
    if (art === "manzara") { c.fillStyle = "#6a9a5a"; c.beginPath(); c.moveTo(0, h); c.lineTo(w * 0.35, h * 0.4); c.lineTo(w * 0.55, h * 0.65); c.lineTo(w * 0.75, h * 0.35); c.lineTo(w, h); c.fill(); }
    if (art === "aile" || art === "yirtik") {
      ["#c58d6e", "#e2a982", "#9a958f"].forEach((col, i) => { if (art === "yirtik" && i === 2) return; c.fillStyle = col; c.beginPath(); c.arc(w * (0.3 + i * 0.2), h * 0.42, 20, 0, 7); c.fill(); c.fillRect(w * (0.3 + i * 0.2) - 22, h * 0.55, 44, 60); });
      if (art === "yirtik") { c.fillStyle = "#6b5340"; c.beginPath(); c.moveTo(w * 0.62, 0); c.lineTo(w * 0.68, h * 0.3); c.lineTo(w * 0.6, h * 0.55); c.lineTo(w * 0.7, h); c.lineTo(w, h); c.lineTo(w, 0); c.fill(); }
    }
    if (art === "portre") { c.fillStyle = "#3a3a4a"; c.beginPath(); c.ellipse(w / 2, h, 60, 70, 0, 0, 7); c.fill(); c.fillStyle = "#d9a47c"; c.beginPath(); c.arc(w / 2, h * 0.42, 30, 0, 7); c.fill(); }
  });

export const screenTex = (key: string, kind: "ekg" | "tv" | "laptop" | "menu" | "tahta", frame: number) =>
  dynamicTex(`scr-${key}`, 256, 160, (c, w, h) => {
    if (kind === "ekg") {
      c.fillStyle = "#0e1418"; c.fillRect(0, 0, w, h);
      c.strokeStyle = "#5ef08a"; c.lineWidth = 4; c.beginPath();
      for (let x = 0; x < w; x += 2) { const p = ((x + frame * 6) % 128) / 128; const y = p > 0.45 && p < 0.5 ? h * 0.2 : p > 0.5 && p < 0.55 ? h * 0.8 : h * 0.55; x === 0 ? c.moveTo(x, y) : c.lineTo(x, y); }
      c.stroke();
      c.fillStyle = "#5ef08a"; c.font = "bold 28px sans-serif"; c.fillText("72", w - 54, 34);
    } else if (kind === "tv") {
      c.fillStyle = `hsl(${(frame * 3) % 360} 35% 40%)`; c.fillRect(0, 0, w, h);
    } else if (kind === "laptop") {
      c.fillStyle = "#7aa0d0"; c.fillRect(0, 0, w, h); c.fillStyle = "#e8f0f8"; for (let i = 0; i < 5; i++) c.fillRect(20, 20 + i * 24, 120 + (i * 37) % 80, 10);
    } else if (kind === "menu") {
      c.fillStyle = "#2a2a2a"; c.fillRect(0, 0, w, h); c.fillStyle = "#f2f2e8"; c.font = "bold 22px sans-serif"; ["ÇAY ........ 15", "KAHVE ..... 45", "SİMİT ...... 20", "TOST ....... 60"].forEach((t, i) => c.fillText(t, 18, 34 + i * 34));
    } else {
      c.fillStyle = "#2f4a3a"; c.fillRect(0, 0, w, h); c.strokeStyle = "#e8f0e8"; c.lineWidth = 3; c.beginPath(); c.moveTo(20, 40); c.lineTo(150, 40); c.moveTo(20, 80); c.lineTo(120, 80); c.moveTo(170, 40); c.lineTo(230, 120); c.moveTo(230, 40); c.lineTo(170, 120); c.stroke();
    }
  });
