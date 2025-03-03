import { Selectable } from "kysely";
import { CardTable } from "../../../main/database/schema";
import { MtgCardColorDto } from "./mtg-card-color.dto";
import { MtgCardfaceDto } from "./mtg-card-face.dto";
import { MtgCardLanguageDto } from "./mtg-card-language.dto";
import { OracleDto } from "./types";


interface CardDto extends Selectable<CardTable> {
  cardColors: Array<MtgCardColorDto>;
  cardfaces: Array<MtgCardfaceDto>;
  languages: Array<MtgCardLanguageDto>;
  oracle: Array<OracleDto>;
}
export type MtgCardDto = Selectable<CardTable>;
export type MtgCardListDto = CardDto;
export type MtgCardDetailDto = CardDto;
