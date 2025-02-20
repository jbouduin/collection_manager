import { ColumnType } from "kysely";
import { NonSynchronized } from "../base.types";
import { CardCondition } from "../../../../common/types";

export interface OwnedCardTable extends NonSynchronized {
  id: ColumnType<number, never, never>;
  card_id: ColumnType<string, never, never>;
  condition_id: ColumnType<CardCondition, never, never>;
  is_foil: ColumnType<boolean, number, never>;
  comments?: ColumnType<string | null>;
}
