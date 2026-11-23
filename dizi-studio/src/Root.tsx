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
import { B4Ornek, Donus25DSheet } from "./studio/engine/Inserts10";
import { B5Ornek, BocekSheet } from "./studio/engine/Inserts11";
import { B5P2Kare } from "./studio/engine/Inserts12";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Bolumler">
        <Composition
          id="IMZA-B1"
          component={Episode3D}
          calculateMetadata={calculateEpisode3DMetadata}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ episodeId: "imza-b1", part: 0 }}
        />
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
        <Composition id="Donus25D" component={Donus25DSheet} durationInFrames={30} fps={30} width={2400} height={900} />
        <Composition id="B4OrnekBas" component={B4Ornek} durationInFrames={132} fps={30} width={1080} height={1920} defaultProps={{ kind: "kapi_arka" as const, text: ["1.4", "2.4"] }} />
        <Composition id="B4OrnekKosu" component={B4Ornek} durationInFrames={96} fps={30} width={1080} height={1920} defaultProps={{ kind: "kosu_takip" as const, text: [] as string[] }} />
        <Composition id="Bocek" component={BocekSheet} durationInFrames={60} fps={30} width={3200} height={1500} />
        <Composition id="B5OrnekYuz" component={B5Ornek} durationInFrames={141} fps={30} width={1080} height={1920} defaultProps={{ kind: "donusum_yuz" as const, text: [] as string[] }} />
        <Composition id="B5OrnekGovde" component={B5Ornek} durationInFrames={144} fps={30} width={1080} height={1920} defaultProps={{ kind: "donusum_govde" as const, text: [] as string[] }} />
        <Composition id="B5OrnekOmuz" component={B5Ornek} durationInFrames={84} fps={30} width={1080} height={1920} defaultProps={{ kind: "omuz_el" as const, text: [] as string[] }} />
        <Composition id="B5OrnekDev" component={B5Ornek} durationInFrames={78} fps={30} width={1080} height={1920} defaultProps={{ kind: "bocek_dev" as const, text: [] as string[] }} />
        <Composition id="B5OrnekYakin" component={B5Ornek} durationInFrames={66} fps={30} width={1080} height={1920} defaultProps={{ kind: "bocek_yakin" as const, text: [] as string[] }} />
        <Composition id="B5OrnekKukreme" component={B5Ornek} durationInFrames={45} fps={30} width={1080} height={1920} defaultProps={{ kind: "bocek_kukreme" as const, text: [] as string[] }} />
        <Composition id="B5P2Kare" component={B5P2Kare} durationInFrames={90} fps={30} width={1080} height={1920} defaultProps={{ kind: "p2_kasa" as const, text: [] as string[] }} />
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
