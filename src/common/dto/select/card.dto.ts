import { Selectable } from "kysely";
import { CardTable } from "../../../main/database/schema";
import { DtoCardColor, DtoCardface, DtoOracle } from "..";
import { DtoCardLanguage } from "./card-language.dto";

export interface DtoCard extends Selectable<CardTable> {
  cardfaces: Array<DtoCardface>;
  oracle: Array<DtoOracle>;
  languages: Array<DtoCardLanguage>;
  cardColors: Array<DtoCardColor>;
}
