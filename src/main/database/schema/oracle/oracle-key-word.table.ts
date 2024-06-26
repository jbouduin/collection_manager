import { ColumnType } from "kysely";

export interface OracleKeywordTable {
  oracle_id: ColumnType<string, string, never>;
  keyword: ColumnType<string, string, never>;
}
