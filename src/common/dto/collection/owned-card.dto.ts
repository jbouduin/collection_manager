import { Selectable } from "kysely";
import { CardTable, OwnedCardTable } from "../../../main/database/schema";
import { MtgCardColorDto, MtgCardfaceDto, OracleDto } from "../mtg";


export interface OwnedCardDto extends Selectable<OwnedCardTable> {
  quantity: number;
}

export interface OwnedCardListDto extends Selectable<CardTable> {
  ownedCards: Array<OwnedCardDto>;
  cardColors: Array<MtgCardColorDto>;
  cardfaces: Array<MtgCardfaceDto>;
  oracle: Array<OracleDto>;
}
