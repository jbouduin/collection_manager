import { ColumnType } from "kysely";
import { BaseTable } from "./base.table";

export interface SyncedTable extends BaseTable{
  last_synced_at: ColumnType<Date, string | undefined, string | undefined>;
}
