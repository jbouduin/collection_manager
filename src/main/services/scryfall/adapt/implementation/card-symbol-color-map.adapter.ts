import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ICardSymbolColorMapAdapter } from "../interface";
import { CardSymbolColorMapAdapterParam } from "../interface/param";

export class CardSymbolColorMapAdapter implements ICardSymbolColorMapAdapter {
  public toInsert(scryfall: CardSymbolColorMapAdapterParam): InsertExpression<DatabaseSchema, "card_symbol_color_map"> {
    return {
      color_id: scryfall.color_id,
      card_symbol_id: scryfall.card_symbol_id
    };
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "card_symbol_color_map"> {
    return {
      last_synced_at: sql`CURRENT_TIMESTAMP`
    };
  }
}
