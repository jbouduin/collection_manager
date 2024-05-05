import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { CardRelatedCardComponent } from "../../../../common/enums";
import { Synchronized } from "../base.types";

export interface CardCardMapTable extends Synchronized {
  card_id: ColumnType<string, string, never>;
  related_card_id: ColumnType<string, string, never>;
  component: ColumnType<CardRelatedCardComponent, CardRelatedCardComponent, never>;
}

export type CardCardMap = Selectable<CardCardMapTable>;
export type InsertCardCardMap = Insertable<CardCardMapTable>;
export type UpdateCardCardMap = Updateable<CardCardMapTable>;
