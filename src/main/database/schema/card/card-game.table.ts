import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { Game } from "../../../../common/enums";
import { NonSynchronized, Synchronized } from "../base.types";

export interface CardGameTable extends NonSynchronized {
  card_id: ColumnType<string, string, never>;
  game: ColumnType<Game, Game, never>;
}

export type CardGame = Selectable<CardGameTable>;
export type InsertCardGame = Insertable<CardGameTable>;
export type UpdateCardGame = Updateable<CardGameTable>;
