import { ColumnType } from "kysely";
import { NonSynchronized } from "../base.types";

export interface OwnedCardCollectionMapTable extends NonSynchronized {
  owned_card_id: ColumnType<number, number, never>;
  collection_id: ColumnType<number, number, never>;
  quantity: ColumnType<number>;
}
