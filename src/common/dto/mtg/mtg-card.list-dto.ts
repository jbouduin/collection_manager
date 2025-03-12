import { Selectable } from "kysely";
import { CardTable } from "../../../main/database/schema";
import { IMtgCardColorDto } from "./mtg-card-color.dto";
import { IMtgCardfaceDto } from "./mtg-card-face.dto";
import { IMtgCardLanguageDto } from "./mtg-card-language.dto";
import { IOracleDto } from "./types";

export interface IMtgCardListDto extends Selectable<CardTable> {
  cardColors: Array<IMtgCardColorDto>;
  cardfaces: Array<IMtgCardfaceDto>;
  languages: Array<IMtgCardLanguageDto>;
  oracle: Array<IOracleDto>;
}
