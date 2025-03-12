import { Selectable } from "kysely";
import { CardTable } from "../../../main/database/schema";
import { MtgCardColorDto, MtgCardfaceDto, OracleDto } from "../mtg";

export interface DeckCardListDto extends Selectable<CardTable> {
  cardColors: Array<MtgCardColorDto>;
  cardfaces: Array<MtgCardfaceDto>;
  oracle: Array<OracleDto>;
  deck_card_id: number;
  deck_quantity: number;
  sideboard_quantity: number;
}
