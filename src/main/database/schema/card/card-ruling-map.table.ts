import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { Synchronized } from "../base.types";

export interface CardRulingMapTable extends Synchronized {
  card_id: ColumnType<string, string, never>;
  ruling_id: ColumnType<string, string, never>;
}

export type CardRulingMap = Selectable<CardRulingMapTable>;
export type NewCardRulingMap = Insertable<CardRulingMapTable>;
export type UpdateCardRulingMap = Updateable<CardRulingMapTable>;
