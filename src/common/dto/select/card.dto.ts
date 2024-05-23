import { Selectable } from "kysely";
import { CardTable } from "../../../main/database/schema";
import { DtoCardface, OracleDto } from "..";

export interface DtoCard extends Selectable<CardTable> {
  cardfaces: Array<DtoCardface>;
  oracle: OracleDto;
  collectorNumberSortValue: string;
}
