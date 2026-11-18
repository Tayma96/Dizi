import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { SERIF } from "./fonts";
import { ANNE, BABA, Character, ZEYNEP } from "./Character";
import { FilmFinish, Rain } from "./Effects";
import { Corridor, FrontDoor, LivingRoom, lightning } from "./Sets";
import { Subtitles, subtitleFont } from "./Subtitles";

const serif = SERIF;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- Sahne 1: Salon, gece, yağmur ---------- */
const SceneSalon: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = lightning(frame, 162);
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "600px 900px",
        scale: interpolate(frame, [0, 225], [1, 1.12], { ...clamp, easing: Easing.bezier(0.33, 0, 0.67, 1) }),
      }}
    >
      <LivingRoom flash={flash} />
      <div style={{ position: "absolute", left: 330, top: 560 }}>
        <Character
          look={ZEYNEP}
          width={560}
          pose={{
            seed: 3,
            lookX: frame > 165 ? 0.2 : 1,
            lookY: -0.2,
            brows: frame > 165 ? "worried" : "sad",
            mouth: "sad",
            armR: 8,
            armL: 6,
            headTilt: frame > 165 ? -2 : 4,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Sahne 2: Kapı zili ---------- */
const SceneZil: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = frame < 18 ? (random(`sh-${frame}`) - 0.5) * 14 : 0;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "610px 860px",
        scale: interpolate(frame, [6, 22, 135], [1.12, 2.05, 2.25], {
          ...clamp,
          easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear],
        }),
        translate: `${shake}px ${shake * 0.6}px`,
      }}
    >
      <LivingRoom />
      <div style={{ position: "absolute", left: 330, top: 560 }}>
        <Character
          look={ZEYNEP}
          width={560}
          pose={{
            seed: 3,
            lookX: interpolate(frame, [8, 14], [0.2, -1], clamp),
            lookY: 0,
            brows: frame > 8 ? "raised" : "worried",
            mouth: frame > 8 ? "open" : "sad",
            headTilt: interpolate(frame, [8, 18], [-2, -9], clamp),
            armR: 8,
            armL: 6,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Sahne 3: Kapıdaki adam ---------- */
const SceneKapi: React.FC = () => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [30, 80], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "550px 760px",
        scale: interpolate(frame, [0, 90, 270], [1, 1, 1.45], { ...clamp, easing: Easing.bezier(0.33, 0, 0.67, 1) }),
      }}
    >
      <AbsoluteFill style={{ backgroundColor: "#0d1411" }} />
      <FrontDoor open={open}>
        <div style={{ position: "absolute", left: 290, top: 470, filter: "brightness(0.85) saturate(0.85)" }}>
          <Character
            look={BABA}
            width={520}
            pose={{
              seed: 7,
              wet: true,
              holdBag: true,
              armR: 4,
              armL: 3,
              brows: "sad",
              mouth: frame > 240 ? "smile" : "sad",
              lookX: 0,
              lookY: 0.1,
              headTilt: interpolate(frame, [150, 200], [0, 5], clamp),
              talk: [
                [182, 200],
                [208, 238],
              ],
            }}
          />
        </div>
      </FrontDoor>
    </AbsoluteFill>
  );
};

/* ---------- Sahne 4: Gözyaşı yakın plan ---------- */
const SceneGozyasi: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = Math.max(0, Math.sin((frame / 25.7) * Math.PI * 2)) ** 8 * 0.012;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ filter: "blur(16px) brightness(0.6)", scale: "1.3" }}>
        <LivingRoom />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transformOrigin: "540px 820px",
          scale: interpolate(frame, [0, 120], [1, 1.1], clamp) + beat,
        }}
      >
        <div style={{ position: "absolute", left: -210, top: 70 }}>
          <Character
            look={ZEYNEP}
            width={1500}
            pose={{
              seed: 11,
              tears: interpolate(frame, [10, 100], [0, 1], clamp),
              brows: "sad",
              mouth: frame > 60 ? "tight" : "sad",
              lookY: 0.15,
              lookX: interpolate(frame, [0, 120], [-0.3, 0.1], clamp),
              headTilt: -3,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Sahne 5: Annenin itirafı ---------- */
const SceneAnne: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = lightning(frame, 130);
  const hit = interpolate(frame, [130, 136, 150], [0, 1, 0.6], clamp);
  const shake = frame >= 130 && frame < 146 ? (random(`as-${frame}`) - 0.5) * 22 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transformOrigin: "540px 700px",
          scale: interpolate(frame, [0, 130], [1, 1.25], clamp) + hit * 0.35,
          translate: `${shake}px ${shake * 0.5}px`,
        }}
      >
        <Corridor flash={flash} />
        <div style={{ position: "absolute", left: 240, top: 420, filter: "saturate(0.7)" }}>
          <Character
            look={ANNE}
            width={600}
            pose={{
              seed: 13,
              pale: 0.9,
              brows: frame > 130 ? "raised" : "worried",
              mouth: "tight",
              lookX: 0,
              lookY: 0.05,
              armL: 3,
              armR: 3,
              talk: [
                [27, 45],
                [54, 115],
              ],
            }}
          />
        </div>
      </AbsoluteFill>
      {/* Zeynep, out of focus in the foreground */}
      <div
        style={{
          position: "absolute",
          left: 600,
          top: 820,
          filter: "blur(12px) brightness(0.3)",
          scale: "1",
        }}
      >
        <Character look={ZEYNEP} width={1100} pose={{ seed: 17, lookX: -1 }} />
      </div>
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: interpolate(frame, [160, 180], [0, 1], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- Sahne 6: Jenerik / cliffhanger ---------- */
const SceneJenerik: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#07090c", justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ opacity: 0.35 }}>
        <Rain width={1080} height={1920} count={160} opacity={0.4} seed="end" />
      </AbsoluteFill>
      <div
        style={{
          fontFamily: serif,
          fontWeight: 900,
          fontSize: 132,
          color: "#f4ead8",
          textAlign: "center",
          lineHeight: 1.05,
          width: 900,
          textShadow: "0 0 40px rgba(255,190,120,0.35)",
        }}
      >
        {["GEÇ KALDIM", "KIZIM"].map((line, li) => (
          <div key={line}>
            {line.split("").map((l, j) => {
              const i = li * 10 + j;
              return (
                <span
                  key={j}
                  style={{
                    display: "inline-block",
                    whiteSpace: "pre",
                    opacity: interpolate(frame, [6 + i * 2, 16 + i * 2], [0, 1], clamp),
                    translate: `0px ${interpolate(frame, [6 + i * 2, 16 + i * 2], [30, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
                  }}
                >
                  {l}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 50,
          fontFamily: subtitleFont,
          fontWeight: 900,
          fontSize: 44,
          letterSpacing: 14,
          color: "#ff6b6b",
          opacity: interpolate(frame, [45, 60], [0, 1], clamp),
        }}
      >
        BÖLÜM 1
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 300,
          fontFamily: subtitleFont,
          fontWeight: 800,
          fontSize: 46,
          color: "#fff",
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "3px solid rgba(255,255,255,0.5)",
          padding: "18px 44px",
          borderRadius: 60,
          opacity: interpolate(frame, [65, 80], [0, 1], clamp),
          scale: interpolate(frame, [65, 80], [0.8, 1], { ...clamp, easing: Easing.spring({ damping: 10 }) }),
        }}
      >
        Devamı yarın · Takip et
      </div>
    </AbsoluteFill>
  );
};

const SeriesChip: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 90,
      left: 60,
      fontFamily: subtitleFont,
      fontWeight: 900,
      fontSize: 30,
      color: "rgba(255,255,255,0.85)",
      backgroundColor: "rgba(0,0,0,0.35)",
      padding: "10px 22px",
      borderRadius: 30,
      letterSpacing: 2,
    }}
  >
    GEÇ KALDIM KIZIM · B1
  </div>
);

export const Episode1: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence name="1 Salon" from={0} durationInFrames={7.5 * fps}>
        <SceneSalon />
      </Sequence>
      <Sequence name="2 Zil" from={7.5 * fps} durationInFrames={4.5 * fps}>
        <SceneZil />
      </Sequence>
      <Sequence name="3 Kapı" from={12 * fps} durationInFrames={9 * fps}>
        <SceneKapi />
      </Sequence>
      <Sequence name="4 Gözyaşı" from={21 * fps} durationInFrames={4 * fps}>
        <SceneGozyasi />
      </Sequence>
      <Sequence name="5 Anne" from={25 * fps} durationInFrames={6 * fps}>
        <SceneAnne />
      </Sequence>
      <Sequence name="6 Jenerik" from={31 * fps} durationInFrames={4 * fps}>
        <SceneJenerik />
      </Sequence>

      <Sequence name="Rozet" from={0} durationInFrames={31 * fps}>
        <SeriesChip />
      </Sequence>
      <Subtitles
        cues={[
          { from: 0.4, to: 3.7, text: "15 yıl önce babam ekmek almaya çıktı.", emphasis: ["ekmek"] },
          { from: 3.9, to: 7.3, text: "Bir daha hiç dönmedi.", emphasis: ["hiç"] },
          { from: 8.0, to: 11.8, text: "Dün gece saat üçte... kapı çaldı.", emphasis: ["üçte", "kapı"] },
          { from: 14.6, to: 17.7, text: "Elinde bir poşet ekmek vardı.", emphasis: ["ekmek"] },
          { from: 18.0, to: 20.9, text: "Geç kaldım, kızım.", speaker: "BABA", speakerColor: "#ffd166" },
          { from: 21.3, to: 24.8, text: "Sarılmak mı, kaçmak mı... bilemedim." },
          {
            from: 25.8,
            to: 30.4,
            text: "Zeynep... babanı on beş yıl önce ben gömdüm.",
            speaker: "ANNE",
            speakerColor: "#9fd8b8",
            whisper: true,
            emphasis: ["gömdüm"],
          },
        ]}
      />
      <FilmFinish />

      {/* ---------- Ses ---------- */}
      <Audio name="Yağmur" src={staticFile("audio/rain.mp3")} volume={0.35} durationInFrames={31 * fps} />
      <Audio name="Müzik" src={staticFile("audio/drone.mp3")} volume={0.6} />
      <Sequence name="Gök gürültüsü" from={5.4 * fps} layout="none">
        <Audio src={staticFile("audio/thunder.mp3")} volume={0.6} />
      </Sequence>
      <Sequence name="Kapı zili" from={7.5 * fps} layout="none">
        <Audio src={staticFile("audio/doorbell.mp3")} volume={0.8} />
      </Sequence>
      <Sequence name="Gıcırtı" from={13 * fps} layout="none">
        <Audio src={staticFile("audio/creak.mp3")} volume={0.7} />
      </Sequence>
      <Sequence name="Kalp atışı" from={21 * fps} durationInFrames={10 * fps} layout="none">
        <Audio src={staticFile("audio/heartbeat.mp3")} volume={0.7} />
      </Sequence>
      <Sequence name="Darbe" from={29.3 * fps} layout="none">
        <Audio src={staticFile("audio/sting.mp3")} volume={0.6} />
      </Sequence>
      <Sequence name="Gök gürültüsü 2" from={29.3 * fps} layout="none">
        <Audio src={staticFile("audio/thunder.mp3")} volume={0.6} />
      </Sequence>
    </AbsoluteFill>
  );
};
