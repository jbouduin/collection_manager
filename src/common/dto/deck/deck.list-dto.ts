import { IColorDto } from "../master-data";
import { IDeckDto } from "./types";


export interface IDeckListDto extends IDeckDto {
  deckSize: number;
  sideboardSize: number;
  accumulatedColorIdentity: Array<Pick<IColorDto, "sequence" | "mana_symbol">>;
}
