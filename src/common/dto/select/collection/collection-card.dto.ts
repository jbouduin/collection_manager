import { Selectable } from "kysely";
import { CardTable } from "../../../../main/database/schema";
import { MtgCardColorDto, MtgCardfaceDto, MtgCardLanguageDto, MtgCardSetDto, OracleDto } from "../mtg";

export interface CollectionCardDto extends Selectable<CardTable> {
  cardColors: Array<MtgCardColorDto>;
  cardfaces: Array<MtgCardfaceDto>;
  language: MtgCardLanguageDto;
  oracle: Array<OracleDto>;
  set: MtgCardSetDto;
}
