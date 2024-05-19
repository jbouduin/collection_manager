import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ISymbologyAdapter } from "../interface";
import { ScryfallCardSymbol } from "../../types/card-symbol/scryfall-card-symbol";

export class SymbologyAdapter implements ISymbologyAdapter {
  public toInsert(cardSymbol: ScryfallCardSymbol): InsertExpression<DatabaseSchema, "symbology"> {
    return {
      id: cardSymbol.symbol,
      appears_in_mana_costs: cardSymbol.appears_in_mana_costs ? 1 : 0,
      cmc: cardSymbol.mana_value,
      english: cardSymbol.english,
      funny: cardSymbol.funny ? 1 : 0,
      hybrid: cardSymbol.hybrid ? 1 : 0,
      loose_variant: cardSymbol.loose_variant,
      mana_value: cardSymbol.mana_value,
      phyrexian: cardSymbol.phyrexian ? 1 : 0,
      represents_mana: cardSymbol.represents_mana ? 1 : 0,
      svg_uri: cardSymbol.svg_uri,
      transposable: cardSymbol.transposable ? 1 : 0
    };
  }

  public toUpdate(cardSymbol: ScryfallCardSymbol): UpdateObjectExpression<DatabaseSchema, "symbology"> {
    return {
      appears_in_mana_costs: cardSymbol.appears_in_mana_costs ? 1 : 0,
      cmc: cardSymbol.mana_value,
      english: cardSymbol.english,
      funny: cardSymbol.funny ? 1 : 0,
      hybrid: cardSymbol.hybrid ? 1 : 0,
      last_synced_at: sql`CURRENT_TIMESTAMP`,
      loose_variant: cardSymbol.loose_variant,
      mana_value: cardSymbol.mana_value,
      phyrexian: cardSymbol.phyrexian ? 1 : 0,
      represents_mana: cardSymbol.represents_mana ? 1 : 0,
      svg_uri: cardSymbol.svg_uri,
      transposable: cardSymbol.transposable ? 1 : 0
    };
  }

}
