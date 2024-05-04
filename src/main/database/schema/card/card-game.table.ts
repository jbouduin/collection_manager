import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { Game } from "../../../../common/enums";
import { SyncedTable } from "../synced.table";

export interface CardGameTable extends SyncedTable {
  card_id: ColumnType<string, string, never>;
  game: ColumnType<Game, Game, never>;
}

export type CardGame = Selectable<CardGameTable>;
export type InsertCardGame = Insertable<CardGameTable>;
export type UpdateCardGame = Updateable<CardGameTable>;
