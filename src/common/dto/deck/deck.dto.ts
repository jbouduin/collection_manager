import { Selectable } from "kysely";
import { DeckTable } from "../../../main/database/schema/deck/deck.table";
import { ColorDto } from "../master-data";
import { DeckLegalityDto } from "./deck-legalitydto.";

export type DeckDto = Selectable<DeckTable>;
export type DeckFolderDto = DeckDto;

export interface DeckListDto extends DeckDto {
  calculatedFormats: Array<DeckLegalityDto>;
  deckSize: number;
  sideBoardSize: number;
  accumulatedColorIdentity: Array<Pick<ColorDto, "sequence" | "mana_symbol">>;
}

export type DeckDetailsDto = DeckListDto;
// export interface DeckDetailsDto extends DeckListDto {

// }
