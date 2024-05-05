import { ColumnType } from "kysely";

type TCreated = {
  /***
     * Timestamp of creation
     */
  created_at: ColumnType<Date, never, never>;
};

type TModified = {
  /***
   * Timestamp of last update
   */
  modified_at: ColumnType<Date, string | undefined, string>;
};

type TSynchronized = {
  /***
   * Timestamp of last synchronization
   */
  last_synced_at: ColumnType<Date, never, string | undefined>;
};

type TWithStringIdField = {
  /***
   * Primary key of the table. The exact contents depend on the type of table
   */
  // TODO
  id: ColumnType<string, string, never>;
};

export type Synchronized = TCreated & TSynchronized;
export type NonSynchronized = TCreated & TModified;
export type SynchronizedWithStringId = TCreated & TSynchronized & TWithStringIdField;
export type NonSynchronizedWithStringId = TCreated & TModified & TWithStringIdField;
