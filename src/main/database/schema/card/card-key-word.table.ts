import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { Synchronized } from "../base.types";


export interface CardKeywordTable extends Synchronized {
  card_id: ColumnType<string, string, never>;
  keyword: ColumnType<string, string, never>;
}

export type CardKeyword = Selectable<CardKeywordTable>;
export type InsertCardKeyword = Insertable<CardKeywordTable>;
export type UpdateCardKeyword = Updateable<CardKeywordTable>;
