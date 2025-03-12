import { Selectable } from "kysely";
import { DeckCardTable } from "../../../main/database/schema/deck";

export type DeckCardDto = Selectable<DeckCardTable>;

export interface UpdateDeckCardQuantityDto {
  deck_card_id: number;
  deck_quantity: number;
  sideboard_quantity: number;
}
