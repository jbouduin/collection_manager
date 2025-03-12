import { Selectable } from "kysely";
import { CardTable, OwnedCardTable } from "../../../main/database/schema";
import { IMtgCardColorDto, IMtgCardfaceDto, IOracleDto } from "../mtg";


export interface IOwnedCardDto extends Selectable<OwnedCardTable> {
  quantity: number;
}

export interface IOwnedCardListDto extends Selectable<CardTable> {
  ownedCards: Array<IOwnedCardDto>;
  cardColors: Array<IMtgCardColorDto>;
  cardfaces: Array<IMtgCardfaceDto>;
  oracle: Array<IOracleDto>;
}
