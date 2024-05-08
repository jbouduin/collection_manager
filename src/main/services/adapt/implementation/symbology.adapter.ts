import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { CardSymbol } from "scryfall-sdk";

import { DatabaseSchema } from "../../../../main/database/schema";
import { ISymbologyAdapter } from "../interfaces";

export class SymbologyAdapter implements ISymbologyAdapter {
  public toInsert(symbol: CardSymbol): InsertExpression<DatabaseSchema, "symbology"> {
    return {
      id: symbol.symbol,
      appears_in_mana_costs: symbol.appears_in_mana_costs ? 1 : 0,
      cmc: symbol.mana_value,
      english: symbol.english,
      funny: symbol.funny ? 1 : 0,
      hybrid: 0, // // FEATURE replace scryfall-sdk: scryfall-sdk does not return this
      loose_variant: symbol.loose_variant,
      mana_value: symbol.mana_value,
      phyrexian: 0, // // FEATURE replace scryfall-sdk: scryfall-sdk does not return this
      represents_mana: symbol.represents_mana ? 1 : 0,
      svg_uri: symbol.svg_uri,
      transposable: symbol.transposable ? 1 : 0
    };
  }

  public toUpdate(symbol: CardSymbol): UpdateObjectExpression<DatabaseSchema, "symbology"> {
    return {
      appears_in_mana_costs: symbol.appears_in_mana_costs ? 1 : 0,
      cmc: symbol.mana_value,
      english: symbol.english,
      funny: symbol.funny ? 1 : 0,
      hybrid: 0,
      last_synced_at: sql`CURRENT_TIMESTAMP`,
      loose_variant: symbol.loose_variant,
      mana_value: symbol.mana_value,
      phyrexian: 0,
      represents_mana: symbol.represents_mana ? 1 : 0,
      svg_uri: symbol.svg_uri,
      transposable: symbol.transposable ? 1 : 0
    };
  }

}
