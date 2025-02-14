import { Selectable } from "kysely";
import { CardColorDto, DtoCardface as CardfaceDto, DtoOracle as OracleDto } from "..";
import { CardTable } from "../../../main/database/schema";
import { DtoCardLanguageDto as CardLanguageDto } from "./card-language.dto";


export interface CardDto extends Selectable<CardTable> {
  cardfaces: Array<CardfaceDto>;
  oracle: Array<OracleDto>;
  languages: Array<CardLanguageDto>;
  cardColors: Array<CardColorDto>;
}
