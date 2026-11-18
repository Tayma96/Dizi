import { Composition, Folder, Still } from "remotion";
import { MyComposition } from "./Composition";
import { CharacterSheet } from "./dizi/CharacterSheet";
import { Episode1 } from "./dizi/Episode1";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
      <MyComposition />
    </>
  );
};
