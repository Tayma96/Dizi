import React, { useMemo } from "react";
import { AbsoluteFill, CalculateMetadataFunction, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { castById } from "../cast";
import { AGE, Character } from "../rig/Character";
import { Bird, SET_INFO, SetLayer, type Mark } from "../sets";
import { FilmFinish } from "../../dizi/Effects";
import { lightning } from "../../dizi/Sets";
import { CornerLabel, EndCard, InsertShot, KaraokeSubtitle, PhoneMessage, TitleCard } from "./Overlays";
import { buildTimeline, type TScene, type Timeline } from "./timeline";
import type { Gesture } from "../rig/types";
import { GESTURES, type FullArm } from "../rig/gestures";
import type { Beat, CharState, EpisodeProps, EpisodeScript, Shot, VoiceManifest } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SPEAKER_COLORS = ["#ffd166", "#9fd8b8", "#ff9fb2", "#a8c8ff", "#ffb37a", "#d6b8ff", "#c8e88a"];

/* ------------------------------ geometry ------------------------------ */
type Placed = { id: string; x: number; feetY: number; size: number; top: number; headX: number; headY: number; sit: boolean };

const place = (id: string, st: CharState, marks: Record<string, Mark>): Placed | null => {
  const m = marks[st.mark ?? Object.keys(marks)[0]];
  if (!m) return null;
  const look = castById(id);
  const lie = st.body === "yat" || st.body === "dogrul" || st.body === "yatakta";
  const sit = !lie && (st.body === "sit" || Boolean(m.sit && st.body !== "stand"));
  const size = m.size;
  // yatan/doğrulan: işaretin y'si kalça noktasıdır (karakter kalçasından döner)
  const top = lie ? m.y - 0.6 * size : m.y - (sit ? 0.91 : 0.98) * size;
  const a = AGE[look.age];
  const headLocal = 300 - 100 * a.head * a.sy + 680 * (1 - a.sy);
  return { id, x: m.x, feetY: m.y, size, top, headX: m.x, headY: top + (headLocal / 1000) * size, sit };
};

type Cam = { cx: number; cy: number; z: number; ay: number };

/** Hazır elle kadrajlar (mekâna özgü ekleme çekimleri) */
const KADRAJ: Record<string, { cx: number; cy: number; z: number }> = {
  pencere: { cx: 770, cy: 600, z: 2.05 },
  kapi: { cx: 930, cy: 1170, z: 1.7 },
  oda: { cx: 540, cy: 960, z: 1 },
};

const cameraFor = (shot: Shot, placed: Record<string, Placed>): Cam => {
  if (shot.kadraj) {
    const k = typeof shot.kadraj === "string" ? KADRAJ[shot.kadraj] : shot.kadraj;
    if (k) return { cx: k.cx, cy: k.cy, z: k.z, ay: 960 };
  }
  const p = shot.on ? placed[shot.on] : undefined;
  let cam: Cam;
  switch (shot.type) {
    case "orta":
      cam = p ? { cx: p.headX, cy: p.headY, z: 1.7 * (1250 / p.size), ay: 560 } : { cx: 540, cy: 960, z: 1, ay: 960 };
      break;
    case "yakin":
      cam = p ? { cx: p.headX, cy: p.headY, z: 2.3 * (1250 / p.size), ay: 560 } : { cx: 540, cy: 960, z: 1.6, ay: 960 };
      break;
    case "cok_yakin":
      cam = p ? { cx: p.headX, cy: p.headY - 0.01 * p.size, z: 3.2 * (1250 / p.size), ay: 560 } : { cx: 540, cy: 960, z: 2.4, ay: 960 };
      break;
    case "iki": {
      const q = shot.with ? placed[shot.with] : undefined;
      if (p && q) {
        const dx = Math.abs(p.headX - q.headX) + 0.5 * (p.size + q.size) / 2;
        const z = Math.max(1, Math.min(1.9, 1000 / dx));
        cam = { cx: (p.headX + q.headX) / 2, cy: Math.min(p.headY, q.headY) + 120, z, ay: 640 };
      } else cam = { cx: 540, cy: 960, z: 1, ay: 960 };
      break;
    }
    default:
      cam = { cx: 540, cy: 960, z: 1, ay: 960 };
  }
  if (shot.angle === "alt") cam.ay += 140;
  if (shot.angle === "ust") cam.ay -= 120;
  return cam;
};

const clampCam = (c: Cam): Cam => {
  const z = Math.max(1, c.z);
  const cx = Math.min(1080 - 540 / z, Math.max(540 / z, c.cx));
  const cy = Math.min(1920 - (1920 - c.ay) / z, Math.max(c.ay / z, c.cy));
  return { cx, cy, z, ay: c.ay };
};

/* ------------------------------ scene view ------------------------------ */
const SceneView: React.FC<{ ts: TScene; colors: Record<string, string> }> = ({ ts, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { scene } = ts;
  const marks = { ...SET_INFO[scene.set as keyof typeof SET_INFO].marks, ...(scene.isaretler ?? {}) };
  const bi = Math.max(0, ts.beats.findIndex((b) => frame >= b.from && frame < b.from + b.dur));
  const tb = ts.beats[bi] ?? ts.beats[ts.beats.length - 1];
  const bf = frame - tb.from;
  const prev = bi > 0 ? ts.beats[bi - 1] : undefined;

  // placements (with enter/exit walking)
  const placed: Record<string, Placed> = {};
  for (const [id, st] of Object.entries(tb.cast)) {
    if (st.hidden) continue;
    const p = place(id, st, marks);
    if (p) placed[id] = p;
  }
  const prevPlaced: Record<string, Placed> = {};
  if (prev) for (const [id, st] of Object.entries(prev.cast)) if (!st.hidden) { const p = place(id, st, marks); if (p) prevPlaced[id] = p; }

  const walkX: Record<string, { x: number; walking: boolean; end?: number }> = {};
  for (const [id, p] of Object.entries(placed)) {
    const st = tb.cast[id];
    let x = p.x;
    let walking = false;
    const walkDur = Math.min(tb.dur, Math.round(((st as { yuruSure?: number }).yuruSure ?? 1.3) * fps));
    let derin: { feetY: number; size: number; top: number } | null = null;
    if (st.enter) {
      const from = st.enter === "sol" ? -300 : 1380;
      x = interpolate(bf, [0, walkDur], [from, p.x], clamp);
      walking = bf < walkDur;
    } else if (st.exit) {
      const to = st.exit === "sol" ? -300 : 1380;
      x = interpolate(bf, [tb.dur - walkDur, tb.dur], [p.x, to], clamp);
      walking = bf > tb.dur - walkDur;
    } else if (prevPlaced[id] && (prevPlaced[id].x !== p.x || prevPlaced[id].feetY !== p.feetY || prevPlaced[id].size !== p.size)) {
      // işaretten işarete yürüme: yatay konum + derinlik (ayak hizası, boy) birlikte, yumuşak
      const q = interpolate(bf, [0, walkDur], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
      const P = prevPlaced[id];
      x = P.x + (p.x - P.x) * q;
      const feetY = P.feetY + (p.feetY - P.feetY) * q, size = P.size + (p.size - P.size) * q;
      derin = { feetY, size, top: P.top + (p.top - P.top) * q };
      walking = bf < walkDur && prevPlaced[id].x !== p.x;
    }
    if (st.yuru) walking = true;
    if (st.tik === "titre") {
      // korkudan titreme: küçük, düzensiz yatay sarsıntı
      x = p.x + Math.sin(frame * 2.1) * 3.5 + Math.sin(frame * 3.7) * 2;
    }
    if (st.tik === "volta") {
      // bir o yana bir bu yana volta (kendi temposunda)
      x = p.x + Math.sin(frame / 45) * 200;
      walking = true;
    }
    walkX[id] = { x, walking, end: st.enter || (prevPlaced[id] && prevPlaced[id].x !== p.x) ? walkDur : 0 };
    placed[id] = derin ? { ...p, x, headX: x, feetY: derin.feetY, size: derin.size, top: derin.top, headY: p.headY + (derin.top - p.top) } : { ...p, x, headX: x };
  }

  // yatma / doğrulma: kalçadan dönüş açısı; baş konumu kameranın takibi için güncellenir
  const lieAng: Record<string, number> = {};
  for (const [id, p] of Object.entries(placed)) {
    const b = tb.cast[id].body;
    if (b !== "yat" && b !== "dogrul" && b !== "yatakta") continue;
    const st0 = tb.cast[id];
    const kismi = b === "dogrul" && st0.dogrulma !== undefined;
    const already = b === "yatakta" || (b === "dogrul" && !kismi && prev?.cast[id]?.body === "dogrul");
    const ss = (t: number) => t * t * (3 - 2 * t);
    let a = b === "yat" ? -90 : already ? 0 : interpolate(bf, [Math.round(0.15 * fps), Math.round(1.45 * fps)], [-90, 0], { ...clamp, easing: ss });
    if (kismi) {
      // kısmi doğrulma: zorlanarak kalkar (titreme), en fazla dogrulma oranı kadar; geriDus ile acıyla geri düşer
      const hedef = -90 * (1 - (st0.dogrulma ?? 0.5));
      const T = tb.dur;
      // önceki vuruşta zaten yarı doğrulmuşsa (geri düşmeden) oradan devam eder; her replikte baştan kalkmaz
      const ps = prev?.cast[id];
      const bas = ps && ps.body === "dogrul" && ps.dogrulma !== undefined && !ps.geriDus ? -90 * (1 - ps.dogrulma) : -90;
      const up = interpolate(bf, [Math.round(0.1 * fps), Math.round(0.9 * fps)], [bas, hedef], { ...clamp, easing: ss });
      const down = st0.geriDus ? interpolate(bf, [T - Math.round(1.1 * fps), T - Math.round(0.5 * fps)], [0, 1], { ...clamp, easing: (t) => t * t }) : 0;
      a = up + (-90 - up) * down + (bf > 0.9 * fps && down < 0.05 ? Math.sin(frame / 1.6) * 1.6 : 0);
    }
    lieAng[id] = a;
    // baş merkezi: kalça → boyun (gövde ekseni), boyun → baş (baş kameraya doğru -0.72a geri döner)
    const r = (a * Math.PI) / 180;
    const rh = ((a - 0.72 * a) * Math.PI) / 180;
    const nx = p.x + 0.3 * p.size * Math.sin(r);
    const ny = p.feetY - 0.3 * p.size * Math.cos(r);
    placed[id] = { ...p, headX: nx + 0.1 * p.size * Math.sin(rh), headY: ny - 0.1 * p.size * Math.cos(rh) };
  }

  // kuş (pencere dışında): gel = uçup pervaza konar, otur = bekler; hareket her seferinde birebir aynıdır (döngü motifi)
  let kusNode: React.ReactNode = null;
  if (tb.beat.kus) {
    // zaman, sahnedeki ilk "gel" vuruşunun başından sayılır → uçuş vuruşlar arasında kesintisiz sürer ve her seferinde birebir aynıdır
    const anchor = ts.beats.find((b) => b.beat.kus === "gel");
    const t = anchor ? (frame - anchor.from) / fps : 99 + frame / fps;
    const FLY = 1.7;
    const k = Math.min(1, t / FLY);
    const e = 1 - (1 - k) ** 3;
    const fly = t < FLY;
    const bx = 1010 + (800 - 1010) * e;
    const by = 430 + (700 - 430) * e - Math.sin(k * Math.PI) * 50 - (fly ? 0 : Math.max(0, Math.sin((t - FLY) * 14)) * 6 * Math.exp(-(t - FLY) * 5));
    // imza hareketi: konduktan sonra gagasıyla cama iki kez vurur
    const peck = (c: number) => Math.max(0, 1 - Math.abs(t - c) / 0.07);
    const pk = fly ? 0 : Math.max(peck(FLY + 0.45), peck(FLY + 0.8));
    const head = !fly && t > FLY + 1.2 && Math.floor((t - FLY) / 1.4) % 3 === 1 ? 1 : 0;
    kusNode = (
      <g transform={`rotate(${fly ? -12 : -18 * pk} ${bx} ${by})`}>
        <Bird x={bx - 14 * pk} y={by} s={1.7} fly={fly || t < FLY + 0.1} flap={Math.sin(t * 34)} head={head} tail={fly ? 0 : Math.sin(t * 3) * 0.6} />
      </g>
    );
  }

  let tvNow: string | undefined;
  for (let i = 0; i <= bi; i++) if (ts.beats[i].beat.tv) tvNow = ts.beats[i].beat.tv;
  let kemerNow = false;
  for (let i = 0; i <= bi; i++) if (ts.beats[i].beat.kemer !== undefined) kemerNow = Boolean(ts.beats[i].beat.kemer);
  let saatNow = scene.saat;
  for (let i = 0; i <= bi; i++) if (ts.beats[i].beat.saat) saatNow = ts.beats[i].beat.saat;

  // vuruş içi kesme
  let shotNow = tb.shot;
  if (tb.beat.shots) for (const c of tb.beat.shots) if (bf >= Math.round(c.at * fps)) shotNow = c.shot;
  const cutAt = tb.beat.shots ? Math.max(0, ...tb.beat.shots.filter((c) => bf >= Math.round(c.at * fps)).map((c) => Math.round(c.at * fps))) : 0;

  // camera
  let cam = clampCam(cameraFor(shotNow, placed));
  if (tb.shot.move === "kaydir" && prev) {
    const pc = clampCam(cameraFor(prev.shot, placed));
    const k = interpolate(bf, [0, 18], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
    cam = { cx: pc.cx + (cam.cx - pc.cx) * k, cy: pc.cy + (cam.cy - pc.cy) * k, z: pc.z + (cam.z - pc.z) * k, ay: pc.ay + (cam.ay - pc.ay) * k };
  }
  const prog = (bf - cutAt) / Math.max(1, tb.dur - cutAt);
  let z = cam.z;
  if (shotNow.move === "yaklas" || !shotNow.move) z *= 1 + 0.06 * prog;
  if (shotNow.move === "uzaklas") z *= 1.08 - 0.08 * prog;
  cam = clampCam({ ...cam, z });
  const flash = tb.beat.lightning ? lightning(bf, 0) : 0;
  const shakeAmt = (tb.shot.move === "sarsinti" ? 12 : 0) + flash * 16;
  // türbülans: yumuşak, düşük frekanslı sarsıntı (rastgele titreme değil)
  const tu = tb.beat.turb ?? 0;
  const sx = (shakeAmt ? (random(`sx-${frame}`) - 0.5) * shakeAmt : 0) + (tu ? (Math.sin(frame / 2.1) * 0.6 + Math.sin(frame / 3.7) * 0.4) * 14 * tu : 0);
  const sy = (shakeAmt ? (random(`sy-${frame}`) - 0.5) * shakeAmt : 0) + (tu ? (Math.sin(frame / 1.7 + 1) * 0.6 + Math.sin(frame / 4.3) * 0.4) * 18 * tu : 0);

  // door state
  let doorOpen = 0;
  for (let i = 0; i <= bi; i++) {
    const d = ts.beats[i].beat.door;
    if (d === "ac") doorOpen = i === bi ? interpolate(bf, [0, 45], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 }) : 1;
    if (d === "kapat") doorOpen = i === bi ? interpolate(bf, [0, 12], [doorOpen || 1, 0], clamp) : 0;
    if (d === "acik") doorOpen = 1;
    if (d === "aralik") doorOpen = i === bi ? interpolate(bf, [0, 30], [0, 0.14], clamp) : 0.14;
  }
  // 7/24 B4: depo kapısı (sahne tabanı + vuruşta { v, at } ile çarparak açılma; küçük geri tepme)
  let depoNow: number | undefined = scene.depoAcik;
  for (let i = 0; i <= bi; i++) {
    const d = ts.beats[i].beat.depoAcik;
    if (d === undefined) continue;
    if (typeof d === "number") depoNow = d;
    else if (i < bi) depoNow = d.v;
    else {
      const a0 = Math.round(d.at * fps);
      const from = depoNow ?? 0.08;
      depoNow = bf < a0 ? from : bf < a0 + 5 ? from + (d.v - from) * ((bf - a0) / 5) ** 2 : d.v - 0.08 * Math.exp(-(bf - a0 - 5) / 3) * Math.abs(Math.sin((bf - a0 - 5) / 1.6));
    }
  }
  // banko sarsıntısı: sendeleyen karakter bankoya çarptığında
  let sarsNow = 0;
  for (const [cid, cs] of Object.entries(tb.cast)) {
    const pcs = prev?.cast[cid];
    if (cs.body === "sendele" && cs.sendeleAt !== undefined && pcs?.sendeleAt !== cs.sendeleAt) {
      const t = bf / fps - cs.sendeleAt;
      if (t > 0.28 && t < 0.8) sarsNow = Math.max(sarsNow, 1 - (t - 0.28) / 0.52);
    }
  }
  const marketEk = { depoAcik: depoNow, agiz: !!scene.isaretler?.kasa_agzi, sars: sarsNow };
  // ön plan palto omzu (iri adam): sahnede var, "sil" vuruşunda sola kayıp çıkar
  let paltoNow = scene.paltoOmuz ? 1 : 0;
  for (let i = 0; i <= bi; i++) {
    const v = ts.beats[i].beat.paltoOmuz;
    if (v === true) paltoNow = 1;
    if (v === "sil") paltoNow = i < bi ? 0 : 1 - interpolate(bf, [Math.round(0.15 * fps), Math.round(1.05 * fps)], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  }
  // 7/24: ıslak ayak izleri (beat.iz = izlerin belirme süresi, sn; sonraki vuruşlarda kalır)
  let izNow = 0;
  for (let i = 0; i <= bi; i++) {
    const z = ts.beats[i].beat.iz;
    if (z !== undefined) izNow = z <= 0 ? 0 : i === bi ? interpolate(bf, [0, z * fps], [0, 1], clamp) : 1;
  }

  // önceki vuruştaki bakış (baş dönüşünü yumuşatmak için)
  const gazeOf = (b: typeof tb, id: string, pl: Record<string, Placed>) => {
    const st = b.cast[id];
    const p = pl[id];
    if (!st || !p) return undefined;
    if (st.lookAt === "kamera") return { yaw: 0, lookX: 0 };
    // yatan (baygın/uyuyan) karakter başını kimseye çevirmez
    if (st.body === "yat" || st.body === "yatakta") return { yaw: 0, lookX: st.bak ? st.bak.x : 0 };
    if (st.bak) return { yaw: (st.bak as { yaw?: number }).yaw ?? st.bak.x * 0.35, lookX: st.bak.x };
    if (st.tik === "tavan") return { yaw: 0, lookX: 0.1 };
    if (st.tik === "sallan") return { yaw: 0, lookX: 0 };
    if (st.tik === "volta") return { yaw: Math.cos(frame / 45) > 0 ? 0.4 : -0.4, lookX: Math.cos(frame / 45) > 0 ? 0.7 : -0.7 };
    // yürürken önüne bakar (birbirine bakarak yürümezler); ancak açıkça bakılan kişi varsa ona döner
    if (st.yuru && !st.lookAt) return { yaw: 0.3, lookX: 0.55 };
    // dizilerde kameraya bakılmaz: belirtilen kişiye, yoksa konuşana, konuşan da karşısındakine bakar
    const others = Object.keys(pl).filter((k) => k !== id && !b.cast[k]?.hidden);
    const target = st.lookAt && pl[st.lookAt] ? st.lookAt : b.beat.type === "line" && b.beat.who !== id && pl[b.beat.who] ? b.beat.who : others[0];
    if (target && pl[target]) {
      const d = Math.sign(pl[target].x - p.x) || 1;
      return { yaw: 0.5 * d * (st.flip ? -1 : 1), lookX: 1 * d * (st.flip ? -1 : 1) };
    }
    return { yaw: 0, lookX: 0 };
  };
  const prevLook: Record<string, { yaw: number; lookX: number } | undefined> = {};
  if (prev) for (const id of Object.keys(placed)) prevLook[id] = gazeOf(prev, id, { ...prevPlaced, ...Object.fromEntries(Object.entries(placed).filter(([k]) => !prevPlaced[k])) });

  // 7/24 B4 alanları: tek seferlik eylemler yalnız ayarlandıkları vuruşta oynar (kalıcı durum tekrar oynatmaz)
  const yeniB4 = (st: CharState, pst: CharState | undefined, bfr: number, dur: number) => {
    const t = bfr / fps;
    const gv = st.gozSok === true ? 1 : Number(st.gozSok || 0);
    const gp = pst?.gozSok === true ? 1 : Number(pst?.gozSok || 0);
    return {
      gozSok: gv > 0 ? (gp >= gv ? gv : interpolate(bfr, [0, 4], [gp, gv], clamp)) : undefined,
      yutkun: st.yutkun !== undefined && pst?.yutkun !== st.yutkun ? (t - st.yutkun) / 0.7 : undefined,
      onlukCikar: st.onluk === "cikar" && pst?.onluk !== "cikar" ? interpolate(bfr, [Math.round(0.05 * fps), dur - Math.round(0.1 * fps)], [0, 1], clamp) : undefined,
      sacDagin: st.sacDagin,
      yereAt: st.yereAt !== undefined && pst?.yereAt !== st.yereAt ? t - st.yereAt : undefined,
      sendeleK: st.body === "sendele" && st.sendeleAt !== undefined && pst?.sendeleAt !== st.sendeleAt ? (t - st.sendeleAt) / 0.55 : undefined,
    };
  };
  const renderChar = (id: string) => {
    const p = placed[id];
    const st = tb.cast[id];
    const look = castById(id);
    const speaking = tb.beat.type === "line" && tb.beat.who === id && !tb.beat.voiceover && tb.voice;
    const gz = gazeOf(tb, id, placed) ?? { yaw: 0, lookX: 0 };
    let yaw = gz.yaw;
    let lookX = gz.lookX;
    // Jest ve baş dönüşü vuruşlar arasında yumuşak geçer (kol bir karede pozdan poza atlamaz)
    const pst = prev?.cast[id];
    // yürürken kollar önceki pozda kalır (kol bacaktan önce hareket etmez); yürüyüş bitince yumuşak geçiş
    const walkingNow = walkX[id]?.walking && !st.yuru;
    const walkEnd = st.enter || (prevPlaced[id] && prevPlaced[id].x !== p.x) ? Math.min(tb.dur, Math.round(1.3 * fps)) : 0;
    const gk = walkingNow ? 0 : interpolate(bf, [walkEnd, walkEnd + (st.bakSure ? Math.round(st.bakSure * fps) : 10)], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
    const gCur = GESTURES[(st.gesture as Gesture) ?? "rest"] ?? GESTURES.rest;
    const gPrev = pst && !pst.hidden ? GESTURES[(pst.gesture as Gesture) ?? "rest"] ?? GESTURES.rest : gCur;
    const mixArm = (a: FullArm, b: FullArm): FullArm => ({ upper: a.upper + (b.upper - a.upper) * gk, fore: a.fore + (b.fore - a.fore) * gk, ul: (a.ul ?? 1) + ((b.ul ?? 1) - (a.ul ?? 1)) * gk, fl: (a.fl ?? 1) + ((b.fl ?? 1) - (a.fl ?? 1)) * gk });
    const armL = mixArm(gPrev.L, gCur.L);
    const armR = mixArm(gPrev.R, gCur.R);
    const pv = prevLook[id];
    if (pv && !walkX[id]?.walking) {
      yaw = pv.yaw + (yaw - pv.yaw) * gk;
      lookX = pv.lookX + (lookX - pv.lookX) * gk;
    }
    const ang = lieAng[id];
    return (
      <React.Fragment key={id}>
      <div style={{ position: "absolute", left: p.x - p.size * 0.2, top: p.top, transform: ang !== undefined ? `rotate(${ang + (st.egim ?? 0)}deg)` : undefined, transformOrigin: `${p.size * 0.2}px ${p.size * 0.6}px` }}>
        <Character
          look={look}
          size={p.size}
          flip={st.flip}
          pose={{
            emotion: st.emotion,
            gesture: st.gesture as Gesture | undefined,
            armL: st.kol?.L ?? armL,
            armR: st.kol?.R ?? armR,
            legRot: st.bacak,
            prop: st.prop === "onluk_top" && pst?.yereAt !== undefined ? undefined : st.prop,
            body: st.body === "kos" ? "kos" : walkX[id]?.walking ? "walk" : p.sit ? "sit" : "stand",
            hideLegs: ang !== undefined,
            golgesiz: ang !== undefined,
            tilt: ang !== undefined ? -0.72 * ang : st.tik === "sallan" ? Math.sin(frame / 6) * 11 : st.basEgim !== undefined ? (pst?.basEgim === st.basEgim ? st.basEgim : interpolate(bf, [0, Math.round(0.8 * fps)], [pst?.basEgim ?? 0, st.basEgim], { ...clamp, easing: (t) => t * t * (3 - 2 * t) })) : undefined,
            talk: st.tik === "konus" ? new Array(60).fill(0).map((_, k): [number, number] => [k * 70, k * 70 + 42]) : undefined,
            yaw,
            lookX,
            lookY: st.bak ? st.bak.y : st.tik === "tavan" ? -1 : undefined,
            tears: st.tears,
            pale: st.pale,
            sweat: st.sweat,
            krem: st.krem,
            murekkep: st.murekkep,
            yaprak: st.yaprak,
            onluk: st.onluk === "giy" ? interpolate(bf, [Math.round(0.15 * fps), Math.max(Math.round(0.2 * fps), tb.dur - Math.round(0.25 * fps))], [0, 1], clamp) : st.onluk === true ? 1 : undefined,
            diz: (() => {
              const pd = prev?.cast[id]?.diz;
              if (st.diz === true) {
                if (pd === true) return 1;
                const ws = walkX[id]?.end ?? 0;
                return interpolate(bf, [ws, ws + Math.round(0.6 * fps)], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
              }
              if (st.diz === "kalk" && pd === true) return interpolate(bf, [0, Math.round(0.6 * fps)], [1, 0], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
              return 0;
            })(),
            wet: st.wet,
            ...yeniB4(st, pst, bf, tb.dur),
            eyesClosed: st.eyesClosed,
            speech: speaking ? { cues: tb.voice!.mouth, from: tb.from + tb.voice!.from } : undefined,
            seed: look.name.length * 11 + id.length,
          }}
        />
      </div>
      {st.yarimGolge ? (
        <div style={{ position: "absolute", left: p.x - p.size * 0.2, top: p.top, filter: "brightness(0.22) saturate(0.6)", WebkitMaskImage: "linear-gradient(to left, black 0%, black 30%, transparent 58%)", maskImage: "linear-gradient(to left, black 0%, black 30%, transparent 58%)", opacity: typeof st.yarimGolge === "number" ? st.yarimGolge : 0.85 }}>
          <Character look={look} size={p.size} pose={{ emotion: st.emotion, armL: st.kol?.L ?? armL, armR: st.kol?.R ?? armR, prop: st.prop, body: walkX[id]?.walking ? "walk" : "stand", yaw, lookX, lookY: st.bak ? st.bak.y : undefined, tilt: st.basEgim, golgesiz: true, seed: look.name.length * 11 + id.length }} />
        </div>
      ) : null}
      {ang !== undefined && !tb.cast[id]?.zemin ? <Blanket hx={p.x} hy={p.feetY} k={(ang + 90) / 90} /> : null}
      {ang !== undefined && tb.cast[id]?.zemin ? (
        <div style={{ position: "absolute", left: p.x - p.size * 0.2, top: p.top, transform: `rotate(${-90 + (st.egim ?? 0)}deg)`, transformOrigin: `${p.size * 0.2}px ${p.size * 0.6}px`, clipPath: "inset(61% -40% -10% -40%)" }}>
          <Character look={look} size={p.size} pose={{ emotion: st.emotion, body: "stand", golgesiz: true, seed: look.name.length * 11 + id.length, armL: { upper: 4, fore: 0, ul: 0.01, fl: 0.01 }, armR: { upper: 4, fore: 0, ul: 0.01, fl: 0.01 } }} />
        </div>
      ) : null}
      </React.Fragment>
    );
  };

  const kepenkNow = (tb.beat as { kepenk?: string | boolean }).kepenk === "out"
    ? interpolate(bf, [0, Math.round(1.4 * fps)], [1, 0], { ...clamp, easing: (t) => t * t * (3 - 2 * t) })
    : (tb.beat as { kepenk?: string | boolean }).kepenk === "in"
    ? interpolate(bf, [Math.round(0.1 * fps), Math.round(0.55 * fps)], [0, 1], { ...clamp, easing: (t) => t * t })
    : (scene as { kepenk?: boolean }).kepenk || ts.beats.slice(0, bi).some((b) => (b.beat as { kepenk?: unknown }).kepenk === "in") && !ts.beats.slice(0, bi).some((b) => (b.beat as { kepenk?: unknown }).kepenk === "out") ? 1 : 0;
  const ids = Object.keys(placed).sort((a, b) => placed[a].feetY - placed[b].feetY);
  const outsideIds = scene.set === "apartman_kapisi" ? ids.filter((id) => tb.cast[id].mark === "kapi") : [];
  const insideIds = ids.filter((id) => !outsideIds.includes(id));
  const filter =
    scene.look === "flashback" ? "sepia(0.55) contrast(0.92) brightness(1.06) saturate(0.8)" : scene.look === "soguk" ? "saturate(0.7) hue-rotate(-12deg) brightness(0.95)" : scene.look === "sicak" ? "sepia(0.18) saturate(1.15)" : scene.look === "tekinsiz" ? `saturate(0.62) hue-rotate(-12deg) brightness(${frame % 83 < 2 ? 0.8 : 0.88}) contrast(1.16)` : undefined;

  // FPS göz açılması: görüntü bulanıktan netleşir
  const gozBlur = tb.beat.gozAc ? interpolate(bf, [0, tb.beat.gozAc * fps], [12, 0], clamp) : 0;
  const filterAll = [filter, gozBlur > 0.2 ? `blur(${gozBlur.toFixed(1)}px)` : ""].filter(Boolean).join(" ") || undefined;

  // "kaydir" geçişi: yeni sahne sağdan kayarak gelir
  const kayX = scene.transition === "kaydir" ? interpolate(frame, [0, 13], [1080, 0], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 }) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden", transform: kayX ? `translateX(${kayX}px)` : undefined }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0 0",
          transform: `translate(${540 + sx}px, ${cam.ay + sy}px) scale(${cam.z}) translate(${-cam.cx}px, ${-cam.cy}px)`,
          filter: filterAll,
        }}
      >
        {scene.arka ? (
          <>
            {/* resimli arka plan (ElevenLabs görseli); karakterlerin önünde kalan kısım (ör. kasa) aynı resimden maskeyle tekrar çizilir */}
            <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              <image href={staticFile(scene.arka)} x={0} y={0} width={1080} height={1920} preserveAspectRatio="xMidYMid slice" />
            </svg>
            {[...outsideIds, ...insideIds].map(renderChar)}
            {scene.arkaOn ? (
              <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
                <defs><clipPath id={`on-${scene.id}`}><path d={scene.arkaOn} /></clipPath></defs>
                <image href={staticFile(scene.arka)} x={0} y={0} width={1080} height={1920} preserveAspectRatio="xMidYMid slice" clipPath={`url(#on-${scene.id})`} />
              </svg>
            ) : null}
          </>
        ) : (
          <>
            <SetLayer name={scene.set as keyof typeof SET_INFO} layer="bg" time={scene.time} rain={scene.rain} flash={flash} doorOpen={doorOpen} kus={kusNode} saat={saatNow} sallanan={tb.beat.sarsil} kaydir={scene.kaydirma ? (frame / fps) * scene.kaydirma : undefined} tv={tvNow} turb={tb.beat.turb} kemer={kemerNow} iz={izNow} market={marketEk}>
              {outsideIds.map(renderChar)}
            </SetLayer>
            {scene.direk !== undefined ? <Direk x={scene.direk} /> : null}
            {(scene.set as string) === "market_kapi" && kepenkNow > 0 ? <Kepenk k={kepenkNow} /> : null}
            {insideIds.map(renderChar)}
            <SetLayer name={scene.set as keyof typeof SET_INFO} layer="fg" time={scene.time} doorOpen={doorOpen} turb={tb.beat.turb} fincanElde={Object.values(tb.cast).some((c) => c.prop === "fincan")} market={marketEk} />
          </>
        )}
      </AbsoluteFill>
      {scene.look === "flashback" ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(255,240,210,0) 50%, rgba(255,240,210,0.55) 100%)" }} /> : null}
      {paltoNow > 0.001 ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
            <defs><filter id="paltoBl"><feGaussianBlur stdDeviation="22" /></filter></defs>
            <g filter="url(#paltoBl)" transform={`translate(${-560 * (1 - paltoNow)} ${Math.sin(frame / 14) * 6})`}>
              <path d="M -120 520 Q 120 470 250 640 Q 320 760 300 1100 L 330 1920 L -120 1920 Z" fill="#141210" />
              <path d="M 150 560 Q 240 640 262 820" stroke="#3a342c" strokeWidth={26} fill="none" opacity={0.6} />
            </g>
          </svg>
        </AbsoluteFill>
      ) : null}
      {tb.beat.siluet ? (() => {
        const k = bf / Math.max(1, tb.dur);
        const x = tb.beat.siluet === "sol" ? 700 - 820 * k : 380 + 820 * k;
        return (
          <AbsoluteFill style={{ pointerEvents: "none" }}>
            <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
              <defs><filter id="silBl"><feGaussianBlur stdDeviation="7" /></filter><clipPath id="silCam"><rect x={0} y={430} width={1080} height={760} /></clipPath></defs>
              <g clipPath="url(#silCam)" opacity={0.55 * Math.min(1, (1 - k) * 4)} filter="url(#silBl)" transform={`translate(${x} ${Math.abs(Math.sin(frame / 4)) * -6})`}>
                <ellipse cx={0} cy={700} rx={34} ry={42} fill="#05070a" />
                <path d="M -30 736 L 30 736 Q 92 760 96 840 L 88 1200 L -88 1200 L -96 840 Q -92 760 -30 736 Z" fill="#05070a" />
              </g>
            </svg>
          </AbsoluteFill>
        );
      })() : null}
      {/* overlays per beat */}
      {ts.beats.map((b) => (
        <Sequence key={b.index} from={b.from} durationInFrames={b.dur} layout="none">
          {b.beat.siyah ? <AbsoluteFill style={{ backgroundColor: "#000" }} /> : null}
          {(b.beat as { altIsik?: boolean }).altIsik || (scene as { altIsik?: boolean }).altIsik ? (
            <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(255,90,40,0.22) 0%, rgba(120,20,10,0.06) 38%, rgba(0,0,0,0.25) 62%, rgba(0,0,0,0.62) 100%)", mixBlendMode: "multiply" }} />
          ) : null}
          {(b.beat as { karanlik?: number }).karanlik || (scene as { karanlik?: number }).karanlik ? (() => {
            const a = (b.beat as { karanlik?: number }).karanlik ?? (scene as { karanlik?: number }).karanlik ?? 0;
            const isik = (b.beat as { isik?: boolean }).isik;
            return <AbsoluteFill style={{ background: isik ? `radial-gradient(ellipse 60% 38% at 50% 58%, rgba(150,190,255,0.10) 0%, rgba(0,0,10,${a * 0.35}) 40%, rgba(0,0,8,${a}) 85%)` : `rgba(0,0,8,${a})` }} />;
          })() : null}
          {b.beat.type === "line" && b.beat.tasma ? null : b.beat.type === "line" ? (
            <KaraokeSubtitle tb={b} speakerName={b.beat.label !== undefined ? b.beat.label || undefined : castById(b.beat.who).name} speakerColor={colors[b.beat.who]} alt={(b.beat as { altyazi?: string }).altyazi === "alt" || (scene as { altyazi?: string }).altyazi === "alt"} />
          ) : b.beat.type === "yazi" ? (
            <TitleCard text={b.beat.text} sub={b.beat.sub} dur={b.dur} />
          ) : b.beat.type === "mesaj" ? (
            <PhoneMessage from={b.beat.from} text={b.beat.text} dur={b.dur} sohbet={b.beat.sohbet} />
          ) : b.beat.type === "insert" ? (
            <InsertShot kind={b.beat.kind} text={b.beat.text} dur={b.dur} />
          ) : null}
          {b.beat.ekle ? <InsertShot kind={b.beat.ekle.kind as never} text={b.beat.ekle.text} dur={b.dur} /> : null}
          {b.beat.type === "line" && b.beat.ekle ? <KaraokeSubtitle tb={b} speakerName={b.beat.label !== undefined ? b.beat.label || undefined : castById(b.beat.who).name} speakerColor={colors[b.beat.who]} alt={(b.beat as { altyazi?: string }).altyazi === "alt" || (scene as { altyazi?: string }).altyazi === "alt"} /> : null}
          {b.beat.etiket ? <CornerLabel text={b.beat.etiket} /> : null}
          {b.beat.fade ? <FadeOverlay mode={b.beat.fade} dur={b.dur} /> : null}
          {b.beat.gozAc ? <GozAc d={Math.round(b.beat.gozAc * fps)} /> : null}
        </Sequence>
      ))}
      {ts.beats.filter((b) => b.beat.type === "line" && b.beat.tasma).map((b) => {
        const d = b.voice ? Math.max(b.dur, b.voice.from + b.voice.dur + Math.round(0.25 * fps)) : b.dur;
        const lb = b.beat as Extract<Beat, { type: "line" }>;
        return (
          <Sequence key={`tasma${b.index}`} from={b.from} durationInFrames={d} layout="none">
            <KaraokeSubtitle tb={{ ...b, dur: d }} speakerName={lb.label !== undefined ? lb.label || undefined : castById(lb.who).name} speakerColor={colors[lb.who]} alt={(scene as { altyazi?: string }).altyazi === "alt"} />
          </Sequence>
        );
      })}
      <SceneTransition kind={scene.transition} />
    </AbsoluteFill>
  );
};

/** Battaniye: yatanın derinlik sırasında (önünde duranların arkasında) çizilir.
 *  k = 0 yatarken (göğse kadar örter, ayak kabarıklığı), k = 1 otururken (kucağı örter, diz kabarıklığı). */
const BL_LIE: [number, number][] = [[-175, 40], [-175, -30], [-150, -68], [-60, -70], [30, -72], [110, -58], [190, -52], [215, -46], [222, -6], [222, 56], [-175, 56]];
const BL_SIT: [number, number][] = [[-72, 40], [-72, -16], [-62, -44], [6, -44], [70, -46], [120, -66], [190, -44], [215, -40], [222, -4], [222, 56], [-72, 56]];
/** Kulübenin orta direği: kabuklu kalın ağaç gövdesi, lif iple bağlı; yatağın arkasında (alt ucu yatak yüzeyinde kesilir). */
const Direk: React.FC<{ x: number }> = ({ x }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
    <defs>
      <linearGradient id="direkG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a2614" /><stop offset="0.35" stopColor="#7a5634" /><stop offset="0.7" stopColor="#5a3c22" /><stop offset="1" stopColor="#2a1a0c" /></linearGradient>
    </defs>
    <path d={`M ${x - 34} 440 Q ${x - 40} 900 ${x - 30} 1446 L ${x + 32} 1446 Q ${x + 40} 900 ${x + 30} 440 Z`} fill="url(#direkG)" stroke="#1b1412" strokeWidth={6} />
    {new Array(9).fill(0).map((_, i) => <path key={i} d={`M ${x - 18 + (i % 3) * 14} ${520 + i * 100} q 6 30 -2 60`} stroke="#2a1a0c" strokeWidth={4} fill="none" opacity={0.7} />)}
    {[600, 1180].map((y) => (
      <g key={y}>
        {[0, 1, 2].map((k) => <path key={k} d={`M ${x - 38} ${y + k * 16} Q ${x} ${y + 10 + k * 16} ${x + 38} ${y + k * 16}`} stroke="#c8a064" strokeWidth={8} fill="none" />)}
      </g>
    ))}
  </svg>
);

/** Market kepengi: cam vitrinin önüne yukarıdan iner (oluklu metal, kilit dili, toz). k: 0..1 */
const Kepenk: React.FC<{ k: number }> = ({ k }) => {
  const top = 420, bot = 1190, h = (bot - top) * k;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      <defs>
        <linearGradient id="kpG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a9096" /><stop offset="0.5" stopColor="#6a7076" /><stop offset="1" stopColor="#4a5056" /></linearGradient>
        <clipPath id="kpC"><rect x={-20} y={top} width={1120} height={h} /></clipPath>
      </defs>
      <g clipPath="url(#kpC)">
        <rect x={-20} y={top} width={1120} height={bot - top} fill="url(#kpG)" />
        {new Array(Math.ceil((bot - top) / 26)).fill(0).map((_, i) => {
          const y = top + h - (bot - top) + i * 26;
          return <g key={i}><path d={`M -20 ${y} H 1100`} stroke="#3a3e42" strokeWidth={4} /><path d={`M -20 ${y + 6} H 1100`} stroke="#a8aeb4" strokeWidth={3} opacity={0.6} /></g>;
        })}
        <rect x={-20} y={top + h - 40} width={1120} height={40} fill="#3a3e42" />
        <rect x={500} y={top + h - 34} width={80} height={24} rx={4} fill="#c8a03a" stroke="#1b1412" strokeWidth={3} />
      </g>
      <rect x={-20} y={top - 30} width={1120} height={34} fill="#2a2e32" />
    </svg>
  );
};

const Blanket: React.FC<{ hx: number; hy: number; k: number }> = ({ hx, hy, k }) => {
  const P = BL_LIE.map(([x, y], i) => [hx + x + (BL_SIT[i][0] - x) * k, hy + y + (BL_SIT[i][1] - y) * k]);
  const d = `M ${P[0][0]} ${P[0][1]} L ${P[1][0]} ${P[1][1]} Q ${P[2][0]} ${P[2][1]} ${P[3][0]} ${P[3][1]} Q ${P[4][0]} ${P[4][1]} ${P[5][0]} ${P[5][1]} Q ${P[6][0]} ${P[6][1]} ${P[7][0]} ${P[7][1]} Q ${P[8][0]} ${P[8][1]} ${P[8][0]} ${P[8][1] + 20} L ${P[9][0]} ${P[9][1]} L ${P[10][0]} ${P[10][1]} Z`;
  const hem = `M ${P[0][0]} ${P[0][1]} L ${P[1][0]} ${P[1][1]} Q ${P[2][0]} ${P[2][1]} ${P[3][0]} ${P[3][1]} L ${P[3][0] + 6} ${P[3][1] + 34} Q ${P[2][0] + 20} ${P[2][1] + 40} ${P[0][0] + 22} ${P[0][1]} Z`;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <path d={d} fill="#8c979a" stroke="#1b1412" strokeWidth={5} strokeLinejoin="round" />
      <path d={hem} fill="#a6b0b2" stroke="#1b1412" strokeWidth={3.5} strokeLinejoin="round" />
      <path d={`M ${P[5][0]} ${P[5][1] + 6} Q ${P[5][0] + 10} ${P[5][1] + 40} ${P[5][0] - 4} ${hy + 50} M ${P[7][0] - 30} ${P[7][1] + 8} Q ${P[7][0] - 20} ${P[7][1] + 40} ${P[7][0] - 26} ${hy + 50}`} stroke="#74808a" strokeWidth={4} fill="none" />
    </svg>
  );
};

/** FPS göz açılması: üst ve alt göz kapağı kırpışarak açılır, görüntü bulanıktan netleşir. */
const GozAc: React.FC<{ d: number }> = ({ d }) => {
  const f = useCurrentFrame();
  if (f > d + 2) return null;
  const o = interpolate(f, [0, d * 0.28, d * 0.42, d * 0.55, d], [0, 0.42, 0.42, 0.12, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const gap = 960 * o * 1.15;
  const top = 960 - gap, bot = 960 + gap;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="gzU" x1="0" y1="0" x2="0" y2="1"><stop offset="0.8" stopColor="#000" /><stop offset="1" stopColor="#000" stopOpacity={0.6} /></linearGradient>
          <linearGradient id="gzD" x1="0" y1="1" x2="0" y2="0"><stop offset="0.8" stopColor="#000" /><stop offset="1" stopColor="#000" stopOpacity={0.6} /></linearGradient>
        </defs>
        <path d={`M -40 -40 L 1120 -40 L 1120 ${top + 120} Q 540 ${top - 260} -40 ${top + 120} Z`} fill="url(#gzU)" />
        <path d={`M -40 1960 L 1120 1960 L 1120 ${bot - 120} Q 540 ${bot + 260} -40 ${bot - 120} Z`} fill="url(#gzD)" />
      </svg>
    </AbsoluteFill>
  );
};

const FadeOverlay: React.FC<{ mode: "giris" | "cikis"; dur: number }> = ({ mode, dur }) => {
  const f = useCurrentFrame();
  const o = mode === "giris" ? interpolate(f, [0, 20], [1, 0], clamp) : interpolate(f, [dur - 20, dur], [0, 1], clamp);
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity: o }} />;
};

const SceneTransition: React.FC<{ kind?: string }> = ({ kind }) => {
  const f = useCurrentFrame();
  if (kind === "kararma") return <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(f, [0, 14], [1, 0], clamp) }} />;
  if (kind === "flas") return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f, [0, 8], [1, 0], clamp) }} />;
  if (kind === "whoosh") return <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(f, [0, 6], [0.6, 0], clamp) }} />;
  return null;
};

/* ------------------------------ audio ------------------------------ */
const ducked = (f: number, speaking: [number, number][], ramp = 8) => {
  let d = 0;
  for (const [a, b] of speaking) {
    if (f >= a - ramp && f <= b + ramp) {
      const k = f < a ? (f - (a - ramp)) / ramp : f > b ? 1 - (f - b) / ramp : 1;
      d = Math.max(d, k);
    }
  }
  return d;
};

const MusicTrack: React.FC<{ src: string; base: number; dur: number; speaking: [number, number][]; offset: number; startSec?: number }> = ({ src, base, dur, speaking, offset, startSec = 0 }) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 30], [0, 1], clamp);
  const fadeOut = interpolate(f, [dur - 30, dur], [1, 0], clamp);
  const d = ducked(f + offset, speaking);
  const { fps } = useVideoConfig();
  return <Audio src={staticFile(src)} loop trimBefore={Math.round(startSec * fps)} volume={base * fadeIn * fadeOut * (1 - 0.55 * d)} />;
};

const AmbTrack: React.FC<{ src: string; base: number; dur: number; fadeIn?: boolean; fadeOut?: boolean; speaking?: [number, number][]; offset?: number }> = ({ src, base, dur, fadeIn = true, fadeOut = true, speaking = [], offset = 0 }) => {
  const f = useCurrentFrame();
  // replik sırasında ortam sesi geri çekilir (diyalog her zaman önde)
  const d = ducked(f + offset, speaking, 10);
  // aynı ortam bir sonraki sahnede sürüyorsa kesmede "delik" açılmasın diye sönme yapılmaz
  const a = fadeIn ? interpolate(f, [0, 10], [0, 1], clamp) : 1;
  const b = fadeOut ? interpolate(f, [dur - 10, dur], [1, 0], clamp) : 1;
  return <Audio src={staticFile(src)} loop volume={base * a * b * (1 - 0.6 * d)} />;
};

/* ------------------------------ episode ------------------------------ */
export const Episode: React.FC<EpisodeProps> = ({ script, manifest, part = 0 }) => {
  const { fps } = useVideoConfig();
  const tl: Timeline | null = useMemo(() => (script && manifest ? buildTimeline(script, manifest) : null), [script, manifest]);
  if (!script || !tl) return <AbsoluteFill style={{ backgroundColor: "#200" }} />;
  const offset = part > 0 ? tl.parts[part - 1][0] : 0;
  const colors: Record<string, string> = {};
  let ci = 0;
  for (const s of script.scenes) for (const id of Object.keys(s.cast)) if (!colors[id]) colors[id] = SPEAKER_COLORS[ci++ % SPEAKER_COLORS.length];
  const allSpeaking = tl.scenes.flatMap((s) => s.speaking);

  // music segments: a scene without `music` continues the previous one; name "yok" stops it
  const segs: { name: string; from: number; to: number; volume: number; startSec?: number }[] = [];
  for (const s of tl.scenes) {
    const m = s.scene.music;
    const last = segs[segs.length - 1];
    if (m && m.name !== "yok" && !(last && last.name === m.name && last.to === s.from)) segs.push({ name: m.name, from: s.from, to: s.from + s.dur, volume: m.volume ?? 0.35, startSec: m.from ?? 0 });
    else if (m && m.name === "yok") continue;
    else if (last && last.to === s.from) last.to = s.from + s.dur;
  }
  const endFrom = tl.total - 4 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={-offset} layout="none">
        {tl.scenes.map((ts, si) => (
          <Sequence key={ts.scene.id} name={`${ts.scene.id} · ${ts.scene.title ?? ts.scene.set}`} from={ts.from} durationInFrames={ts.dur}>
            <SceneView ts={ts} colors={colors} />
            {ts.scene.ambience ? <AmbTrack src={`ses/${ts.scene.ambience.name}.mp3`} base={ts.scene.ambience.volume ?? 0.25} dur={ts.dur} fadeIn={tl.scenes[si - 1]?.scene.ambience?.name !== ts.scene.ambience.name} fadeOut={tl.scenes[si + 1]?.scene.ambience?.name !== ts.scene.ambience.name} speaking={allSpeaking} offset={ts.from} /> : null}
            {ts.scene.ambience2 ? <AmbTrack src={`ses/${ts.scene.ambience2.name}.mp3`} base={ts.scene.ambience2.volume ?? 0.1} dur={ts.dur} speaking={allSpeaking} offset={ts.from} /> : null}
            {ts.scene.transition === "whoosh" ? <Audio src={staticFile("ses/efekt/whoosh.mp3")} volume={0.6} /> : null}
            {ts.beats.map((b) => (
              <Sequence key={b.index} from={b.from} durationInFrames={b.dur + 6 * fps} layout="none">
                {b.voice ? (
                  <Sequence from={b.voice.from} layout="none">
                    <Audio src={staticFile(b.voice.file)} volume={(b.beat as { vol?: number }).vol ?? 1} />
                  </Sequence>
                ) : null}
                {(b.beat.sfx ?? []).map((s, i) => (
                  <Sequence key={i} from={Math.round((s.at ?? 0) * fps)} layout="none">
                    <Audio src={staticFile(`ses/${s.name}.mp3`)} volume={s.volume ?? 0.7} />
                  </Sequence>
                ))}
                {b.beat.lightning ? <Audio src={staticFile("ses/efekt/gok_gurultusu.mp3")} volume={0.55} /> : null}
                {b.beat.type === "mesaj" ? <Audio src={staticFile("ses/efekt/bildirim.mp3")} volume={0.6} /> : null}
              </Sequence>
            ))}
          </Sequence>
        ))}
        {segs.map((s, i) => (
          <Sequence key={i} name={`Müzik: ${s.name}`} from={s.from} durationInFrames={s.to - s.from} layout="none">
            <MusicTrack src={`ses/${s.name}.mp3`} base={s.volume} dur={s.to - s.from} speaking={allSpeaking} offset={s.from} startSec={s.startSec} />
          </Sequence>
        ))}
        {script.endCard === false ? null : (
          <Sequence name="Bitiş kartı" from={endFrom} durationInFrames={4 * fps}>
            <EndCard series={script.seriesTitle} episodeNo={script.episodeNo} text={script.endCard ? script.endCard.text : undefined} sub={script.endCard ? script.endCard.sub : undefined} />
            <Audio src={staticFile("ses/muzik/jenerik_tema.mp3")} volume={0.6} />
          </Sequence>
        )}
      </Sequence>
      <FilmFinish vignette={0.45} grain={0.06} />
    </AbsoluteFill>
  );
};

export const calculateEpisodeMetadata: CalculateMetadataFunction<EpisodeProps> = async ({ props }) => {
  const script: EpisodeScript = await fetch(staticFile(`episodes/${props.episodeId}.json`)).then((r) => r.json());
  let manifest: VoiceManifest = {};
  try {
    manifest = await fetch(staticFile(`voice/${props.episodeId}/manifest.json`)).then((r) => (r.ok ? r.json() : {}));
  } catch {
    manifest = {};
  }
  const tl = buildTimeline(script, manifest);
  const part = props.part ?? 0;
  const dur = part > 0 && tl.parts[part - 1] ? tl.parts[part - 1][1] - tl.parts[part - 1][0] : tl.total;
  return { durationInFrames: Math.max(1, dur), fps: tl.fps, props: { ...props, script, manifest } };
};
