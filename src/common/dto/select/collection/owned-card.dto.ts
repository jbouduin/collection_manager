import { Selectable } from "kysely";
import { OwnedCardTable } from "../../../../main/database/schema";
import { MtgCardColorDto, MtgCardDto, MtgCardfaceDto, OracleDto } from "../mtg";


export interface OwnedCardDto extends Selectable<OwnedCardTable> {
  quantity: number;
}

export interface OwnedCardListDto extends MtgCardDto {
  ownedCards: Array<OwnedCardDto>;
  cardColors: Array<MtgCardColorDto>;
  cardfaces: Array<MtgCardfaceDto>;
  oracle: Array<OracleDto>;
}
