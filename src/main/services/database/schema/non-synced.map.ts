import { ColumnType } from "kysely";
import { BaseMap } from "./base.map";

export interface NonSyncedMap extends BaseMap{
  /***
   * Timestamp of last update
   */
  modified_at: ColumnType<Date, string | undefined, string>;
}
