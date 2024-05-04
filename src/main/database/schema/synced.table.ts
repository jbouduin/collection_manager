import { ColumnType } from "kysely";
import { BaseTable } from "./base.table";

export interface SyncedTable extends BaseTable{
  /***
   * Timestamp of last synchronization
   */
  last_synced_at: ColumnType<Date, string | undefined, string | undefined>;
}
