import { AnyColumnWithTable } from "kysely";
import { DatabaseSchema } from "../database.schema";

// TODO when creating tests, build a test that checks if all fields are in the array or find another way to get all field names
export const CARD_TABLE_FIELDS: Array<AnyColumnWithTable<DatabaseSchema, "card">> = [
  "card.is_booster",
  "card.border",
  "card.card_back_id",
  "card.collector_number",
  "card.is_content_warning",
  "card.created_at",
  "card.is_digital",
  "card.frame",
  "card.is_full_art",
  "card.id",
  "card.lang",
  "card.last_synced_at",
  "card.layout",
  "card.name",
  "card.oracle_id",
  "card.rarity",
  "card.released_at",
  "card.is_reprint",
  "card.scryfall_uri",
  "card.set_id",
  "card.is_oversized",
  "card.is_reserved",
  "card.is_promo",
  "card.is_story_spotlight",
  "card.is_variation",
  "card.security_stamp",
  "card.image_status"
];

export const CARDFACE_TABLE_FIELDS: Array<AnyColumnWithTable<DatabaseSchema, "cardface">> = [
  "cardface.artist",
  "cardface.card_id",
  "cardface.cmc",
  "cardface.defense",
  "cardface.face_name",
  "cardface.flavor_name",
  "cardface.flavor_text",
  "cardface.card_id",
  "cardface.sequence",
  "cardface.illustration_id",
  "cardface.layout",
  "cardface.loyalty",
  "cardface.mana_cost",
  "cardface.oracle_id",
  "cardface.power",
  "cardface.printed_name",
  "cardface.printed_text",
  "cardface.printed_type_line",
  "cardface.toughness",
  "cardface.watermark"
];

export const CARD_COLOR_MAP_TABLE_FIELDS: Array<AnyColumnWithTable<DatabaseSchema, "card_color_map">> = [
  "card_color_map.card_id",
  "card_color_map.color_id",
  "card_color_map.color_type"
];

export const CARDFACE_COLOR_MAP_TABLE_FIELDS: Array<AnyColumnWithTable<DatabaseSchema, "cardface_color_map">> = [
  "cardface_color_map.card_id",
  "cardface_color_map.sequence",
  "cardface_color_map.color_id",
  "cardface_color_map.color_type"
];
