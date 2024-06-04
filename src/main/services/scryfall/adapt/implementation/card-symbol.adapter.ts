import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../database/schema";
import { ICardSymbolAdapter } from "../interface";
import { ScryfallCardSymbol } from "../../types";

export class CardSymbolAdapter implements ICardSymbolAdapter {
  public toInsert(cardSymbol: ScryfallCardSymbol): InsertExpression<DatabaseSchema, "card_symbol"> {
    return {
      id: cardSymbol.symbol,
      is_appears_in_mana_costs: cardSymbol.appears_in_mana_costs ? 1 : 0,
      cmc: cardSymbol.mana_value,
      english: cardSymbol.english,
      is_funny: cardSymbol.funny ? 1 : 0,
      is_hybrid: cardSymbol.hybrid ? 1 : 0,
      loose_variant: cardSymbol.loose_variant,
      mana_value: cardSymbol.mana_value,
      is_phyrexian: cardSymbol.phyrexian ? 1 : 0,
      is_represents_mana: cardSymbol.represents_mana ? 1 : 0,
      svg_uri: cardSymbol.svg_uri,
      is_transposable: cardSymbol.transposable ? 1 : 0
    };
  }

  public toUpdate(cardSymbol: ScryfallCardSymbol): UpdateObjectExpression<DatabaseSchema, "card_symbol"> {
    return {
      is_appears_in_mana_costs: cardSymbol.appears_in_mana_costs ? 1 : 0,
      cmc: cardSymbol.mana_value,
      english: cardSymbol.english,
      is_funny: cardSymbol.funny ? 1 : 0,
      is_hybrid: cardSymbol.hybrid ? 1 : 0,
      last_synced_at: sql`CURRENT_TIMESTAMP`,
      loose_variant: cardSymbol.loose_variant,
      mana_value: cardSymbol.mana_value,
      is_phyrexian: cardSymbol.phyrexian ? 1 : 0,
      is_represents_mana: cardSymbol.represents_mana ? 1 : 0,
      svg_uri: cardSymbol.svg_uri,
      is_transposable: cardSymbol.transposable ? 1 : 0
    };
  }

}
