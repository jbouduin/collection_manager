import { CardRarity } from "../../../../common/types";

export function getRarityColorClassname(rarity: CardRarity) {
  switch (rarity) {
    case "uncommon":
      return "rarity-uncommon";
    case "rare":
      return "rarity-rare";
    case "mythic":
      return "rarity-mythic";
    default:
      return "";
  }
}
