import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BeyazOda, type Kam, type OdaDurum } from "../sets/beyazoda";
import { yerlestir, lwOlcek, type Yer, type V3 } from "./kukla";
import { OdaGobekli, GOBEK_UYKU } from "./OdaGobekli";
import { OdaInfluencer, INF_UYKU } from "./OdaInfluencer";
const INF_YER: Yer = { tip: "zemin", o: [1.35, 0.16, 2.75], t1: [1, 0, 0], t2: [0, 0, -1] };

const GOBEK_YER: Yer = { tip: "dik", o: [-1.55, 0, 3.0], t1: [1, 0, 0] };

const ciz = (k: Kam, yer: Yer, key: string, el: (lw: number) => React.ReactNode) => {
  const y = yerlestir(k, yer);
  if (!y) return null;
  return { z: y.z, el: <g key={key} filter="url(#kd_kaynat)"><g transform={y.tr}>{el(lwOlcek(y.s))}</g></g> };
};

export const KdP2Acilis: React.FC = () => {
  const frame = useCurrentFrame();
  const k: Kam = { x: -1.6, y: 0.4, z: 1.55, yaw: 0, pitch: -4, f: 700, cy: 900 };
  const durum: OdaDurum = { derz: 0, dalga: -1, anaBas: 0, anaLed: 0, sayac: 1, kirmizi: 0, t: frame / 30, kaide: true };
  const T = frame % 2;
  const k2: Kam = T ? { x: 1.35, y: 1.0, z: 2.95, yaw: 0, pitch: -58, f: 1500, cy: 760 } : { x: 1.35, y: 1.6, z: 1.2, yaw: 0, pitch: -40, f: 600, cy: 900 };
  const c = ciz(k2, INF_YER, "inf", (lw) => <OdaInfluencer p={{ ...INF_UYKU, goz: frame > 160 ? 1 : 0, sik: frame > 150 && frame < 160 ? 1 : 0, kas: frame > 150 && frame < 160 ? -1 : 0, agiz: frame > 170 ? { ac: 1, yuv: 0.1 } : { ac: 0, yuv: 0 } }} lw={lw} />);
  const kaynat = 1 + (Math.floor(frame / 3) % 4);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <defs>
          <filter id="kd_kaynat" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={kaynat} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={2.4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <BeyazOda k={k2} durum={durum} frame={frame} cizimler={c ? [c] : []} />
      </svg>
    </AbsoluteFill>
  );
};
export type { V3 };
