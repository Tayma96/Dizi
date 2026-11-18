import { AbsoluteFill } from "remotion";
import { ANNE, BABA, Character, ZEYNEP } from "./Character";

export const CharacterSheet = () => (
  <AbsoluteFill style={{ backgroundColor: "#efe3cf", flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end", paddingBottom: 60 }}>
    <Character look={ZEYNEP} pose={{ brows: "sad", mouth: "sad", tears: 0.6, armR: 10, seed: 3 }} width={320} />
    <Character look={BABA} pose={{ brows: "worried", mouth: "neutral", wet: true, holdBag: true, armR: 6, seed: 5 }} width={340} />
    <Character look={ANNE} pose={{ brows: "worried", mouth: "open", pale: 0.8, lookX: -0.8, seed: 9 }} width={320} />
  </AbsoluteFill>
);
