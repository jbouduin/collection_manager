import { ColumnType } from "kysely";
import { BaseTable } from "./base.table";

export interface NonSyncedTable extends BaseTable{
  /***
   * Timestamp of last update
   */
  modified_at: ColumnType<Date, string | undefined, string>;
}
