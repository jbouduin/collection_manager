import { AnyColumnWithTable } from "kysely";

import { DatabaseSchema } from "../database.schema";

export const cardSymbolTableFields: Array<AnyColumnWithTable<DatabaseSchema, "card_symbol">> = [
  "card_symbol.is_appears_in_mana_costs",
  "card_symbol.cmc",
  "card_symbol.created_at",
  "card_symbol.english",
  "card_symbol.is_funny",
  "card_symbol.is_hybrid",
  "card_symbol.id",
  "card_symbol.last_synced_at",
  "card_symbol.loose_variant",
  "card_symbol.mana_value",
  "card_symbol.is_phyrexian",
  "card_symbol.is_represents_mana",
  "card_symbol.svg_uri",
  "card_symbol.is_transposable"
];

export const cardSymbolColorMapTableFields: Array<AnyColumnWithTable<DatabaseSchema, "card_symbol_color_map">> = [
  "card_symbol_color_map.card_symbol_id",
  "card_symbol_color_map.color_id"
];

export const cardSymbolAlternativeTableFields: Array<AnyColumnWithTable<DatabaseSchema, "card_symbol_alternative">> = [
  "card_symbol_alternative.alternative",
  "card_symbol_alternative.card_symbol_id"
];
