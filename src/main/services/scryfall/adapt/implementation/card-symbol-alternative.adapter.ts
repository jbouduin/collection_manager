import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ICardSymbolAlternativeAdapter } from "../interface";


export class CardSymbolAlternativeAdapter implements ICardSymbolAlternativeAdapter {
  public toInsert(cardSymbolId: string, alternative: string): InsertExpression<DatabaseSchema, "card_symbol_alternative"> {
    return {
      card_symbol_id: cardSymbolId,
      alternative: alternative,
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "card_symbol_alternative"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
