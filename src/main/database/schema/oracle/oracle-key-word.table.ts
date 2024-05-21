import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface OracleKeywordTable {
  oracle_id: ColumnType<string, string, never>;
  keyword: ColumnType<string, string, never>;
}

export type OracleKeyword = Selectable<OracleKeywordTable>;
export type InsertOracleKeyword = Insertable<OracleKeywordTable>;
export type UpdateOracleKeyword = Updateable<OracleKeywordTable>;
