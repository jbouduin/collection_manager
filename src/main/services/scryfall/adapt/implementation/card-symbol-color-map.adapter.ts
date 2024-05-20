import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ICardSymbolColorMapAdapter } from "../interface";

export class CardSymbolColorMapAdapter implements ICardSymbolColorMapAdapter {
  public toInsert(leftId: string, rightId: string): InsertExpression<DatabaseSchema, "card_symbol_color_map"> {
    return {
      color_id: rightId,
      card_symbol_id: leftId
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "card_symbol_color_map"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}