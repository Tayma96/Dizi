/* geçici laboratuvar (B5 parça 2): kapı görünümünde karakter yerleşimi ve kol pozları */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";
import { Market724BG } from "../sets/market724";

export const Lab12: React.FC<{ mode?: string }> = ({ mode = "kapi" }) => {
  const f = useCurrentFrame();
  const ece = castById("ece_sivil");
  const sabri = castById("sabri");
  if (mode === "kollar") {
    const poses: [number, number, number, number][] = [[-16, -166, 0.42, 1], [-30, -150, 0.5, 1], [-40, -140, 0.55, 0.9], [-24, -158, 0.47, 0.85]];
    return (
      <AbsoluteFill style={{ backgroundColor: "#556" }}>
        {poses.map(([u, fo, ul, fl], i) => (
          <div key={i} style={{ position: "absolute", left: (i % 2) * 540 - 120, top: Math.floor(i / 2) * 960 - 100 }}>
            <Character look={ece} size={1500} pose={{ emotion: "dehset", pale: 0.6, sacDagin: true, armL: { upper: u, fore: fo, ul, fl }, armR: { upper: u, fore: fo, ul, fl }, golgesiz: true }} />
            <div style={{ position: "absolute", left: 300, top: 120, color: "#fff", fontSize: 40 }}>{`${u},${fo},${ul},${fl}`}</div>
          </div>
        ))}
      </AbsoluteFill>
    );
  }
  const view = mode === "kasa" ? "kasa" : mode === "genel" ? "genel" : "kapi";
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        <Market724BG view={view} frame={f} doorOpen={0.72} saat="06:03" iz={1} turb={0} depoAcik={1} />
      </svg>
      {view === "kapi" ? (
        <>
          <div style={{ position: "absolute", left: 440 - 1180 * 0.2, top: 1790 - 0.98 * 1180 }}>
            <Character look={sabri} size={1180} pose={{ emotion: "korkmus", yagmur: 1, lookX: 0.45 }} />
          </div>
          <div style={{ position: "absolute", left: 610 - 1560 * 0.2, top: 2330 - 0.98 * 1560 }}>
            <Character look={ece} size={1560} pose={{ emotion: "dehset", pale: 0.7, sacDagin: true, lookX: 0.45 }} />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
