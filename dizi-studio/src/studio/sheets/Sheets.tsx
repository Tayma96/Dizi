import { AbsoluteFill } from "remotion";
import { CAST, castById } from "../cast";
import { Character } from "../rig/Character";
import { EMOTION_FACE } from "../rig/face";
import { GESTURES } from "../rig/gestures";
import type { Emotion, Gesture, Viseme } from "../rig/types";
import { SANS } from "../../dizi/fonts";

const label = { fontFamily: SANS, fontWeight: 900, fontSize: 26, color: "#2b1d1a", textAlign: "center" as const };

// ids: yalnız bu oyuncular; ekstra: kadroda olmayan deneme görünümleri (ör. saç seçenekleri)
export const CastSheet = ({ ids, ekstra = [] }: { ids?: string[]; ekstra?: typeof CAST }) => (
  <AbsoluteFill style={{ backgroundColor: "#efe3cf", flexDirection: "row", flexWrap: "wrap", padding: 30, gap: 0 }}>
    {[...(ids ? CAST.filter((c) => ids.includes(c.id)) : CAST), ...ekstra].map((c, i) => (
      <div key={c.id} style={{ width: 380, height: 760, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
        <Character look={c} size={640} pose={{ seed: i * 3 + 1, emotion: "notr" }} />
        <div style={label}>{c.name}</div>
        <div style={{ ...label, fontSize: 18, fontWeight: 800, opacity: 0.7 }}>{c.role}</div>
      </div>
    ))}
  </AbsoluteFill>
);

export const EmotionSheet = ({ id = "zeynep" }: { id?: string }) => (
  <AbsoluteFill style={{ backgroundColor: "#e8eef2", flexDirection: "row", flexWrap: "wrap", padding: 20 }}>
    {(Object.keys(EMOTION_FACE) as Emotion[]).map((e, i) => (
      <div key={e} style={{ width: 330, height: 420, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ height: 380, overflow: "hidden" }}>
          <Character look={castById(id)} size={1100} pose={{ seed: 100 + i, emotion: e, eyesClosed: 0 }} />
        </div>
        <div style={label}>{e}</div>
      </div>
    ))}
  </AbsoluteFill>
);

export const GestureSheet = ({ id = "ozan" }: { id?: string }) => (
  <AbsoluteFill style={{ backgroundColor: "#f0e8dc", flexDirection: "row", flexWrap: "wrap", padding: 20 }}>
    {(Object.keys(GESTURES) as Gesture[]).map((g, i) => (
      <div key={g} style={{ width: 380, height: 640, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
        <Character look={castById(id)} size={560} pose={{ seed: 200 + i, gesture: g, prop: g === "telefon" ? "telefon" : g === "tutuyor" ? "fincan" : "none" }} />
        <div style={label}>{g}</div>
      </div>
    ))}
    {(["sit", "walk"] as const).map((b, i) => (
      <div key={b} style={{ width: 380, height: 640, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
        <Character look={castById("selin")} size={560} pose={{ seed: 300 + i, body: b, yaw: i ? 0.6 : -0.5 }} />
        <div style={label}>{b}</div>
      </div>
    ))}
  </AbsoluteFill>
);

export const MouthSheet = () => (
  <AbsoluteFill style={{ backgroundColor: "#f4efe8", flexDirection: "row", flexWrap: "wrap", padding: 20 }}>
    {(["X", "A", "E", "I", "O", "U", "M", "F", "L"] as Viseme[]).map((v, i) => (
      <div key={v} style={{ width: 300, height: 420, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ height: 380, overflow: "hidden" }}>
          <Character look={castById("kaan")} size={1200} pose={{ seed: 400 + i, speech: { cues: [{ t: 0, v }, { t: 99, v }], from: 0 }, eyesClosed: 0 }} />
        </div>
        <div style={label}>{v}</div>
      </div>
    ))}
  </AbsoluteFill>
);

import { SET_INFO, SetLayer, type SetName } from "../sets";
import type { TimeOfDay } from "../sets/props";

const SET_DEMO: [SetName, TimeOfDay, string][] = [
  ["salon", "gece", "zeynep"], ["mutfak", "gunduz", "nermin"], ["yatak_odasi", "aksam", "leyla"], ["cocuk_odasi", "gunduz", "elif"],
  ["ofis", "gece", "kaan"], ["hastane_odasi", "gunduz", "deniz"], ["hastane_koridoru", "gunduz", "ozan"], ["sokak", "gece", "emre"],
  ["kafe", "gunduz", "melek"], ["sinif", "gunduz", "can"], ["mezarlik", "aksam", "kemal"], ["villa", "gunduz", "selin"],
  ["karakol", "gunduz", "burak"], ["park", "gunduz", "riza"], ["apartman_kapisi", "gece", "kemal"], ["koridor", "gece", "nermin"],
];

export const SetSheet = () => (
  <AbsoluteFill style={{ backgroundColor: "#111", flexDirection: "row", flexWrap: "wrap" }}>
    {SET_DEMO.map(([name, time, who]) => {
      const marks = SET_INFO[name].marks;
      const m = marks.orta ?? marks.sol ?? Object.values(marks)[0];
      const c = castById(who);
      return (
        <div key={name} style={{ width: 540, height: 1000, position: "relative", overflow: "hidden" }}>
          <div style={{ width: 1080, height: 1920, scale: "0.5", transformOrigin: "0 0", position: "absolute" }}>
            <SetLayer name={name} layer="bg" time={time} rain={time === "gece"} doorOpen={1}>
              {name === "apartman_kapisi" ? (
                <div style={{ position: "absolute", left: m.x - m.size * 0.2, top: m.y - m.size }}>
                  <Character look={c} size={m.size} />
                </div>
              ) : null}
            </SetLayer>
            {name !== "apartman_kapisi" ? (
              <div style={{ position: "absolute", left: m.x - m.size * 0.2, top: m.y - m.size }}>
                <Character look={c} size={m.size} pose={{ body: m.sit ? "sit" : "stand" }} />
              </div>
            ) : null}
            <SetLayer name={name} layer="fg" time={time} />
          </div>
          <div style={{ ...label, position: "absolute", bottom: 20, left: 0, right: 0, color: "#fff", fontSize: 34 }}>{SET_INFO[name].title} · {time}</div>
        </div>
      );
    })}
  </AbsoluteFill>
);
