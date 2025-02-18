import { ColumnType } from "kysely";
import { NonSynchronized } from "../base.types";

export interface OwnedCardTable extends NonSynchronized {
  card_id: ColumnType<string, never, never>;
  condition_id: ColumnType<number, never, never>;
  is_foil: ColumnType<boolean, number, never>;
  comments?: ColumnType<string | null>;
}
