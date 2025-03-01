import { CardRarity } from "../../../../../../common/types";
import { BaseLookupResult } from "./base-lookup-result";


export interface CardSetLookupResult extends BaseLookupResult {
  cardSetName: string;
  svg: string;
  rarity: CardRarity;
}
