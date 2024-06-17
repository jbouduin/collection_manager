import { ColumnType } from "kysely";
import { NonSynchronized } from "../base.types";

export interface OwnedCardTable extends NonSynchronized{
  card_id: ColumnType<string, never, never>;
  collection_id: ColumnType<number, never, never>;
  non_foiled: ColumnType<number>;
  foiled: ColumnType<number>;
  comments?: ColumnType<string>;
}
