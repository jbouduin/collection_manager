import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { Game } from "../../../../common/enums";
import { DatabaseSchema } from "../../../database/schema";
import { ICardGameAdapter } from "../interfaces";

export class CardGameAdapter implements ICardGameAdapter {
  toInsert(cardId: string, game: string): InsertExpression<DatabaseSchema, "card_game"> {
    return {
      card_id: cardId,
      game: game as Game
    };
  }

  toUpdate(): UpdateObjectExpression<DatabaseSchema, "card_game"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
