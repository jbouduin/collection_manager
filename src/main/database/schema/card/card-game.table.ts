import { ColumnType } from "kysely";
import { Game } from "../../../../common/types";

export interface CardGameTable {
  card_id: ColumnType<string, string, never>;
  game: ColumnType<Game, Game, never>;
}
