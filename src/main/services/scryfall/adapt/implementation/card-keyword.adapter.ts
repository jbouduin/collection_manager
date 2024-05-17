import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ICardKeywordAdapter } from "../interface";

export class CardKeywordAdapter implements ICardKeywordAdapter {
  public toInsert(cardId: string, keyword: string): InsertExpression<DatabaseSchema, "card_keyword"> {
    return {
      card_id: cardId,
      keyword: keyword
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "card_keyword"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
