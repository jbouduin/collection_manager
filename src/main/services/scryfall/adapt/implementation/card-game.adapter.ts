import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { Game } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ICardGameAdapter } from "../interface";
import { CardGameAdapterParameter } from "../interface/param";

export class CardGameAdapter implements ICardGameAdapter {
  public toInsert(scryfall: CardGameAdapterParameter): InsertExpression<DatabaseSchema, "card_game"> {
    return scryfall.games.map((game: Game) => {
      return {
        card_id: scryfall.card_id,
        game: game
      };
    });
  }

  public toUpdate(_scryfall: CardGameAdapterParameter): UpdateObjectExpression<DatabaseSchema, "card_game"> {
    throw new Error("Method not supported.");
  }
}
