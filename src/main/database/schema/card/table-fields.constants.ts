import { AnyColumnWithTable } from "kysely";

import { DatabaseSchema } from "../database.schema";

// TODO: when creating tests, build a test that checks if all fields are in the array
export const cardTableFields: Array<AnyColumnWithTable<DatabaseSchema, "card">> = [
  "card.booster", "card.border", "card.card_back_id", "card.collector_number", "card.content_warning", "card.created_at",
  "card.digital", "card.full_art", "card.id", "card.lang", "card.last_synced_at", "card.layout", "card.name", "card.oracle_id",
  "card.rarity", "card.released_at", "card.reprint", "card.scryfall_uri", "card.set_id"
];

export const cardfaceTableFields: Array<AnyColumnWithTable<DatabaseSchema, "cardface">> = [
  "cardface.artist", "cardface.card_id", "cardface.cmc", "cardface.defense", "cardface.face_name", "cardface.flavor_name", "cardface.flavor_text", "cardface.frame",
  "cardface.id", "cardface.illustration_id", "cardface.layout", "cardface.loyalty", "cardface.mana_cost", "cardface.oracle_id", "cardface.power", "cardface.printed_name",
  "cardface.printed_text", "cardface.printed_type_line", "cardface.toughness", "cardface.watermark"
];
