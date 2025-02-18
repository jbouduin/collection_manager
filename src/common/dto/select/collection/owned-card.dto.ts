import { Selectable } from "kysely";
import { OwnedCardTable } from "../../../../main/database/schema";
import { MtgCardColorDto, MtgCardDto, MtgCardfaceDto, OracleDto } from "../mtg";
import { OwnedCardCollectionMapDto } from "./types";

export interface OwnedCardDto extends Selectable<OwnedCardTable> {
  collectionMap: Array<OwnedCardCollectionMapDto>;
}

export interface OwnedCardListDto extends MtgCardDto {
  ownedCards: Array<OwnedCardDto>;
  cardColors: Array<MtgCardColorDto>;
  cardfaces: Array<MtgCardfaceDto>;
  oracle: Array<OracleDto>;
}
