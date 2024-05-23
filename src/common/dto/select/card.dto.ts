import { Selectable } from "kysely";
import { CardTable } from "../../../main/database/schema";
import { DtoCardface, OracleDto } from "..";
import { MTGLanguage } from "../../../common/enums";

export interface DtoCard extends Selectable<CardTable> {
  cardfaces: Array<DtoCardface>;
  oracle: OracleDto;
  collectorNumberSortValue: string;
  languages: Array<{ lang: MTGLanguage }>
}
