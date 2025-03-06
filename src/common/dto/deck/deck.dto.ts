import { Selectable } from "kysely";
import { DeckTable } from "../../../main/database/schema/deck/deck.table";
import { DeckLegalityDto } from "./deck-legalitydto.";

export type DeckDto = Selectable<DeckTable>;
export type DeckFolderDto = DeckDto;

export interface DeckListDto extends DeckDto {
  calculatedFormats: Array<DeckLegalityDto>;
  deckSize: number;
  sideBoardSize: number;
}

export type DeckDetailsDto = DeckDto;
// export interface DeckDetailsDto extends DeckListDto {

// }
