import { AnyColumnWithTable } from "kysely";
import { DatabaseSchema } from "../database.schema";

export const CARD_SET_TABLE_FIELDS: Array<AnyColumnWithTable<DatabaseSchema, "card_set">> = [
  "card_set.arena_code",
  "card_set.block",
  "card_set.block_code",
  "card_set.card_count",
  "card_set.code",
  "card_set.created_at",
  "card_set.is_digital",
  "card_set.is_foil_only",
  "card_set.icon_svg_uri",
  "card_set.id",
  "card_set.last_full_synchronization_at",
  "card_set.last_synced_at",
  "card_set.mtgo_code",
  "card_set.name",
  "card_set.is_nonfoil_only",
  "card_set.parent_set_code",
  "card_set.printed_size",
  "card_set.released_at",
  "card_set.scryfall_uri",
  "card_set.search_uri",
  "card_set.set_type",
  "card_set.tcgplayer_id",
  "card_set.uri"
];
