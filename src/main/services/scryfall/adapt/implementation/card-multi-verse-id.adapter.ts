import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ICardMultiverseIdAdapter } from "../interface";

export class CardMultiverseIdAdapter implements ICardMultiverseIdAdapter {
  public toInsert(cardId: string, multiversId: number): InsertExpression<DatabaseSchema, "card_multiverse_id"> {
    return {
      card_id: cardId,
      multiverse_id: multiversId
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "card_multiverse_id"> {
    return {
      // last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
