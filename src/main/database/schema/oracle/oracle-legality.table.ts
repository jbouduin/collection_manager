import { ColumnType } from "kysely";
import { CardLegality, MtgGameFormat } from "../../../../common/types";
import { Synchronized } from "../base.types";

export interface OracleLegalityTable extends Synchronized {
  oracle_id: ColumnType<string, string, never>;
  format: ColumnType<MtgGameFormat, MtgGameFormat, never>;
  legality: ColumnType<CardLegality>;
}
