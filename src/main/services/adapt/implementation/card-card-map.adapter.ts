import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { RelatedCard } from "scryfall-sdk";

import { DatabaseSchema } from "../../../database/schema";
import { ICardCardMapAdapter } from "../interfaces";

export class CardCardMapAdapter implements ICardCardMapAdapter{
  public toInsert(leftId: string, rigthId: string, scryfall: RelatedCard): InsertExpression<DatabaseSchema, "card_card_map"> {
    return {
      card_id: leftId,
      related_card_id: rigthId,
      component: scryfall.component
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "card_card_map"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }

}
