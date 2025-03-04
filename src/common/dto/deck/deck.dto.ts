import { Selectable } from "kysely";
import { DeckTable } from "../../../main/database/schema/deck/deck.table";
import { DeckLegalityDto } from "./deck-legalitydto.";

type DeckDto = Selectable<DeckTable>;

export interface DeckListDto extends DeckDto {
  calculatedFormats: Array<DeckLegalityDto>;
  deckSize: number;
  sideBoardSize: number;
}
