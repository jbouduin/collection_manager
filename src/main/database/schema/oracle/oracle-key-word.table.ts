import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { NonSynchronized } from "../base.types";

export interface OracleKeywordTable extends NonSynchronized {
  oracle_id: ColumnType<string, string, never>;
  keyword: ColumnType<string, string, never>;
}

export type OracleKeyword = Selectable<OracleKeywordTable>;
export type InsertOracleKeyword = Insertable<OracleKeywordTable>;
export type UpdateOracleKeyword = Updateable<OracleKeywordTable>;
