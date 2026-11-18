import { Composition, Folder, Still } from "remotion";
import { MyComposition } from "./Composition";
import { CharacterSheet } from "./dizi/CharacterSheet";
import { Episode1 } from "./dizi/Episode1";
import { GLTest } from "./studio3d/GLTest";
import { GestureTest } from "./studio3d/GestureTest";
import { SetSheet3D } from "./studio3d/SetSheet3D";
import { Episode3D, calculateEpisode3DMetadata } from "./studio3d/Episode3D";
import { Cast3D, Emotions3D, Gestures3D, Turnaround3D } from "./studio3d/Sheets3D";
import { Episode, calculateEpisodeMetadata } from "./studio/engine/Episode";
import { CastSheet, EmotionSheet, GestureSheet, MouthSheet, SetSheet } from "./studio/sheets/Sheets";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Bolumler">
        <Composition
          id="GKK-B1-3D"
          component={Episode3D}
          calculateMetadata={calculateEpisode3DMetadata}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ episodeId: "gkk-b1", part: 0 }}
        />
        <Composition
          id="GKK-B1"
          component={Episode}
          calculateMetadata={calculateEpisodeMetadata}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ episodeId: "gkk-b1", part: 0 }}
        />
      </Folder>
      <Folder name="Gec-Kaldim-Kizim">
        <Composition
          id="Bolum1"
          component={Episode1}
          durationInFrames={1050}
          fps={30}
          width={1080}
          height={1920}
        />
        <Still id="Karakterler" component={CharacterSheet} width={1200} height={1000} />
      </Folder>
      <Folder name="Kutuphane">
        <Composition id="Kadro" component={CastSheet} durationInFrames={90} fps={30} width={3860} height={2340} />
        <Composition id="Duygular" component={EmotionSheet} durationInFrames={90} fps={30} width={2030} height={1300} />
        <Composition id="Jestler" component={GestureSheet} durationInFrames={90} fps={30} width={1960} height={2600} />
        <Composition id="Mekanlar" component={SetSheet} durationInFrames={90} fps={30} width={4320} height={4000} />
        <Composition id="Agizlar" component={MouthSheet} durationInFrames={90} fps={30} width={1540} height={880} />
      </Folder>
      <Folder name="Kutuphane-3D">
        <Composition id="Mekanlar3D" component={SetSheet3D} durationInFrames={17} fps={30} width={1080} height={1920} />
        <Composition id="Donus3D" component={Turnaround3D} durationInFrames={60} fps={30} width={2000} height={2600} />
        <Composition id="Kadro3D" component={Cast3D} durationInFrames={60} fps={30} width={3200} height={1500} />
        <Composition id="Duygular3D" component={Emotions3D} durationInFrames={60} fps={30} width={2200} height={1500} />
        <Composition id="Jestler3D" component={Gestures3D} durationInFrames={60} fps={30} width={2000} height={1900} />
      </Folder>
      <Composition id="JestTest" component={GestureTest} durationInFrames={30} fps={30} width={2000} height={1500} />
      <Composition id="GLTest" component={GLTest} durationInFrames={60} fps={30} width={1080} height={1920} />
      <MyComposition />
    </>
  );
};
