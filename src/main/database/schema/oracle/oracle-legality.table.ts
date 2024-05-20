import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { CardLegality, GameFormat } from "../../../../common/enums";
import { NonSynchronizedWithStringId } from "../base.types";

export interface OracleLegalityTable extends NonSynchronizedWithStringId {
  oracle_id: ColumnType<string, string, never>;
  format: ColumnType<GameFormat, GameFormat, never>;
  legality: ColumnType<CardLegality>;
}

export type OracleLegality = Selectable<OracleLegalityTable>;
export type InsertOracleLegality = Insertable<OracleLegalityTable>;
// Not used export type UpdateOracleLegality = Updateable<OracleLegalityTable>;
