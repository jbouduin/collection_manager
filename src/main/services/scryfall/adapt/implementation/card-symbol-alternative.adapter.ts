import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ICardSymbolAlternativeAdapter } from "../interface";
import { CardSymbolAlternativeAdapterParam } from "../interface/param";


export class CardSymbolAlternativeAdapter implements ICardSymbolAlternativeAdapter {
  public toInsert(scryfall: CardSymbolAlternativeAdapterParam): InsertExpression<DatabaseSchema, "card_symbol_alternative"> {
    return scryfall.alternatives.map((alternative: string) => {
      return {
        card_symbol_id: scryfall.cardSymbolId,
        alternative: alternative
      };
    });
  }

  public toUpdate(_scryfall: CardSymbolAlternativeAdapterParam): UpdateObjectExpression<DatabaseSchema, "card_symbol_alternative"> {
    throw new Error("Method not supported");
  }
}
