import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ICardSymbolColorMapAdapter } from "../interface";
import { CardSymbolColorMapAdapterParam } from "../interface/param";

export class CardSymbolColorMapAdapter implements ICardSymbolColorMapAdapter {
  public toInsert(scryfall: CardSymbolColorMapAdapterParam): InsertExpression<DatabaseSchema, "card_symbol_color_map"> {
    return scryfall.colorIds.map((colorId: string) => {
      return {
        card_symbol_id: scryfall.cardSymbolId,
        color_id: colorId
      };
    });
  }

  public toUpdate(): UpdateObjectExpression<DatabaseSchema, "card_symbol_color_map"> {
    throw new Error("Method not supported");
  }
}
