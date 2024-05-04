import { ColumnType } from "kysely";

export interface BaseMap {
  /***
   * Timestamp of creation
   */
  // TODO check if we could make it <Date, never, never>
  created_at: ColumnType<Date, string | undefined, never>;
}
