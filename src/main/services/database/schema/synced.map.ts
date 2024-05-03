import { ColumnType } from "kysely";
import { BaseMap } from "./base.map";

export interface SyncedMap extends BaseMap{
  /***
   * Timestamp of last synchronization
   */
  last_synced_at: ColumnType<Date, string | undefined, string | undefined>;
}
