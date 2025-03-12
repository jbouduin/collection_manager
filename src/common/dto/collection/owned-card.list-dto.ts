import { Selectable } from "kysely";
import { CardTable } from "../../../main/database/schema";
import { IMtgCardColorDto, IMtgCardfaceDto, IOracleDto } from "../mtg";
import { IOwnedCardDto } from "./owned-card.dto";

export interface IOwnedCardListDto extends Selectable<CardTable> {
  ownedCards: Array<IOwnedCardDto>;
  cardColors: Array<IMtgCardColorDto>;
  cardfaces: Array<IMtgCardfaceDto>;
  oracle: Array<IOracleDto>;
}
