import { Selectable } from "kysely";
import { DeckCardTable } from "../../../main/database/schema/deck";

export type IDeckCardDto = Selectable<DeckCardTable>;

export interface IUpdateDeckCardQuantityDto {
  deck_card_id: number;
  deck_quantity: number;
  sideboard_quantity: number;
}
