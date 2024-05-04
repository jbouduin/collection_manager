import { ColumnType } from "kysely";
import { BaseMap } from "./base.map";


// TODO this is the same as syncedtable ??? but has no id field should be renamed
export interface SyncedMap extends BaseMap{
  /***
   * Timestamp of last synchronization
   */
  last_synced_at: ColumnType<Date, string | undefined, string | undefined>;
}
