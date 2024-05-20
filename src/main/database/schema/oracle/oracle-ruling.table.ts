import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { Synchronized } from "../base.types";

export interface OracleRulingTable extends Synchronized {
  oracle_id: ColumnType<string, string, never>;
}

export type OracleRuling = Selectable<OracleRulingTable>;
export type InsertOracleRuling = Insertable<OracleRulingTable>;
export type UpdateRuling = Updateable<OracleRulingTable>;
