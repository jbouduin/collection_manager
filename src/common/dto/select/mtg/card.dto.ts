import { Selectable } from "kysely";
import { CardTable } from "../../../../main/database/schema";
import { CardColorDto } from "./card-color.dto";
import { CardfaceDto } from "./card-face.dto";
import { CardLanguageDto } from "./card-language.dto";
import { OracleDto } from "./types";


export interface CardDto extends Selectable<CardTable> {
  cardfaces: Array<CardfaceDto>;
  oracle: Array<OracleDto>;
  languages: Array<CardLanguageDto>;
  cardColors: Array<CardColorDto>;
}
