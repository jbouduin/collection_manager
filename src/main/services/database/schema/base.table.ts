import { ColumnType } from "kysely";

export interface BaseTable{
  id: ColumnType<string, string,never>;
  created_at: ColumnType<Date, string | undefined, never>;
}
