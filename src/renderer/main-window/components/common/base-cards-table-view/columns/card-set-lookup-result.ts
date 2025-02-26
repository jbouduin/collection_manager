import { CardRarity } from "../../../../../../common/types";
import { BaseLookupResult } from "./base-lookup-result";


export interface CardSetLooupResult extends BaseLookupResult {
  cardSetName: string;
  svg: string;
  rarity: CardRarity;
}
