import { ColumnType } from "kysely";
import { NonSynchronized } from "../base.types";

export interface OwnedCardCollectionMapTable extends NonSynchronized {
  owned_card_id: ColumnType<number, never, never>;
  collection_id: ColumnType<number, never, never>;
  quantity: ColumnType<number>;
}
