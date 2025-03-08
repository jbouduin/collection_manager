import { ColumnType } from "kysely";

type TCreated = {
  /**
   * Timestamp of creation
   */
  created_at: ColumnType<Date, string, never>;
};

type TModified = {
  /**
   * Timestamp of last update
   */
  modified_at?: ColumnType<Date, string | undefined, string | undefined>;
};

type TSynchronized = {
  /**
   * Timestamp of last synchronization
   */
  last_synced_at?: ColumnType<Date, string | undefined, string | undefined>;
};

type TWithStringIdField<T extends string = string> = {
  /**
   * Primary key of the table. The exact contents depend on the type of table
   */
  id: ColumnType<T, T, never>;
};

export type Synchronized = TCreated & TSynchronized;
export type NonSynchronized = TCreated & TModified;
export type SynchronizedWithStringId<T extends string = string> = TCreated & TSynchronized & TWithStringIdField<T>;
export type NonSynchronizedWithStringId<T extends string = string> = TCreated & TModified & TWithStringIdField<T>;
