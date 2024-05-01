import { ColumnType, Generated } from "kysely";

export interface BaseTable{
  id: Generated<bigint>;
  created_at: ColumnType<Date, string | undefined, never>;
  modified_at: ColumnType<Date, string | undefined, string | undefined>;
}
