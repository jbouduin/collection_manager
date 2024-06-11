import { ColumnType } from "kysely";

import { CardLegality, GameFormat } from "../../../../common/enums";
import { Synchronized } from "../base.types";

export interface OracleLegalityTable extends Synchronized {
  oracle_id: ColumnType<string, string, never>;
  format: ColumnType<GameFormat, GameFormat, never>;
  legality: ColumnType<CardLegality>;
}
