import { ColumnType } from "kysely";
import { NonSynchronized } from "../base.types";

export interface CollectionTable extends NonSynchronized {
  id: ColumnType<never, never, never>;
  parent_id?: ColumnType<number, number | undefined>;
  name: ColumnType<string>;
  description?: ColumnType<string>;
  is_system: ColumnType<number>;
}
