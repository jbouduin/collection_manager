import { ColumnType } from "kysely";

export interface BaseTable {
  /***
   * Primary key of the table. The exact contents depend on the type of table
   */
  // TODO
  id: ColumnType<string, string, never>;

  /***
   * Timestamp of creation
   */
  // TODO check if we could make it <Date, never, never>
  created_at: ColumnType<Date, string | undefined, never>;
}
