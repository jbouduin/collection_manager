import { Selectable } from "kysely";
import { DeckTable } from "../../../main/database/schema/deck/deck.table";
import { IColorDto } from "../master-data";


export type IDeckDto = Selectable<DeckTable>;
export type IDeckFolderDto = IDeckDto;

export interface IDeckListDto extends IDeckDto {
  deckSize: number;
  sideboardSize: number;
  accumulatedColorIdentity: Array<Pick<IColorDto, "sequence" | "mana_symbol">>;
}

export type IDeckDetailsDto = IDeckListDto;
// export interface DeckDetailsDto extends DeckListDto {

// }
