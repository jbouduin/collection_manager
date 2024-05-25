import { Selectable } from "kysely";
import { CardTable } from "../../../main/database/schema";
import { DtoCardface, OracleDto } from "..";
import { DtoCardLanguage } from "./card-language.dto";

export interface DtoCard extends Selectable<CardTable> {
  cardfaces: Array<DtoCardface>;
  oracle: OracleDto;
  languages: Array<DtoCardLanguage>
}
