import { AnyColumnWithTable } from "kysely";

import { DatabaseSchema } from "../database.schema";

// TODO when creating tests, build a test that checks if all fields are in the array
export const cardTableFields: Array<AnyColumnWithTable<DatabaseSchema, "card">> = [
  "card.booster", "card.border", "card.card_back_id", "card.collector_number", "card.content_warning", "card.created_at",
  "card.digital", "card.frame", "card.full_art", "card.id", "card.lang", "card.last_synced_at", "card.layout", "card.name", "card.oracle_id",
  "card.rarity", "card.released_at", "card.reprint", "card.scryfall_uri", "card.set_id"
];

export const cardfaceTableFields: Array<AnyColumnWithTable<DatabaseSchema, "cardface">> = [
  "cardface.artist", "cardface.card_id", "cardface.cmc", "cardface.defense", "cardface.face_name", "cardface.flavor_name", "cardface.flavor_text",
  "cardface.card_id", "cardface.sequence", "cardface.illustration_id", "cardface.layout", "cardface.loyalty", "cardface.mana_cost", "cardface.oracle_id", "cardface.power", "cardface.printed_name",
  "cardface.printed_text", "cardface.printed_type_line", "cardface.toughness", "cardface.watermark"
];

export const cardColorMapTableFields: Array<AnyColumnWithTable<DatabaseSchema, "card_color_map">> = [
  "card_color_map.card_id", "card_color_map.color_id", "card_color_map.color_type"
];

export const cardfaceColorMapTableFields: Array<AnyColumnWithTable<DatabaseSchema, "cardface_color_map">> = [
  "cardface_color_map.card_id", "cardface_color_map.sequence", "cardface_color_map.color_id", "cardface_color_map.color_type"
];

export const cardSetTableFields: Array<AnyColumnWithTable<DatabaseSchema, "card_set">> = [
  "card_set.arena_code", "card_set.block", "card_set.block_code", "card_set.card_count", "card_set.code", "card_set.created_at", "card_set.digital", "card_set.foil_only", "card_set.icon_svg_uri",
  "card_set.id", "card_set.last_full_synchronization", "card_set.last_synced_at", "card_set.mtgo_code", "card_set.name", "card_set.nonfoil_only", "card_set.parent_set_code", "card_set.printed_size",
  "card_set.released_at", "card_set.scryfall_uri", "card_set.search_uri", "card_set.set_type", "card_set.tcgplayer_id", "card_set.uri"
];
