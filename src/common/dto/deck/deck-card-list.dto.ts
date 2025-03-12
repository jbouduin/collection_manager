import { Selectable } from "kysely";
import { CardTable } from "../../../main/database/schema";
import { IMtgCardColorDto, IMtgCardfaceDto, IOracleDto } from "../mtg";

export interface IDeckCardListDto extends Selectable<CardTable> {
  cardColors: Array<IMtgCardColorDto>;
  cardfaces: Array<IMtgCardfaceDto>;
  oracle: Array<IOracleDto>;
  deck_card_id: number;
  deck_quantity: number;
  sideboard_quantity: number;
}
