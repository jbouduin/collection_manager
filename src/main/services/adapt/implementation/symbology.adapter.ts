import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { CardSymbol } from "scryfall-sdk";

import { DatabaseSchema } from "../../../../main/database/schema";
import { ISymbologyAdapter } from "../interfaces";
import { BaseAdapter } from "./base.adapter";

export class SymbologyAdapter extends BaseAdapter implements ISymbologyAdapter {
  public toInsert(symbol: CardSymbol): InsertExpression<DatabaseSchema, "symbology"> {
    return {
      id: symbol.symbol,
      appears_in_mana_costs: super.booleanToNumber(symbol.appears_in_mana_costs),
      cmc: symbol.mana_value,
      english: symbol.english,
      funny: super.booleanToNumber(symbol.funny),
      hybrid: 0, // TODO scrfall-sdk is not returning this
      loose_variant: symbol.loose_variant,
      mana_value: symbol.mana_value,
      phyrexian: 0, // TODO scrfall-sdk is not returning this
      represents_mana: super.booleanToNumber(symbol.represents_mana),
      svg_uri: symbol.svg_uri,
      transposable: super.booleanToNumber(symbol.transposable)
    };
  }

  public toUpdate(symbol: CardSymbol): UpdateObjectExpression<DatabaseSchema, "symbology"> {
    return {
      appears_in_mana_costs: super.booleanToNumber(symbol.appears_in_mana_costs),
      cmc: symbol.mana_value,
      english: symbol.english,
      funny: super.booleanToNumber(symbol.funny),
      hybrid: 0, // TODO scrfall-sdk is not returning this
      last_synced_at: sql`CURRENT_TIMESTAMP`,
      loose_variant: symbol.loose_variant,
      mana_value: symbol.mana_value,
      phyrexian: 0, // TODO scrfall-sdk is not returning this
      represents_mana: super.booleanToNumber(symbol.represents_mana),
      svg_uri: symbol.svg_uri,
      transposable: super.booleanToNumber(symbol.transposable)
    };
  }

}
