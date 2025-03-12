import { ColumnType } from "kysely";
import { NonSynchronized } from "../base.types";

export interface DeckCardTable extends NonSynchronized {
  id: ColumnType<number, never, never>;
  deck_id: ColumnType<number, number, never>;
  card_id: ColumnType<string, string, never>;
  deck_quantity: ColumnType<number>;
  sideboard_quantity: ColumnType<number>;
}
