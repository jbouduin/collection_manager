import { AnyColumnWithTable } from "kysely";

import { DatabaseSchema } from "../database.schema";

export const DECK_TABLE_FIELDS: Array<AnyColumnWithTable<DatabaseSchema, "deck">> = [
  "deck.id",
  "deck.name",
  "deck.description",
  "deck.target_format",
  "deck.created_at",
  "deck.modified_at",
  "deck.is_folder",
  "deck.is_system",
  "deck.parent_id"
];

export const DECK_CARD_TABLE_FIELDS: Array<AnyColumnWithTable<DatabaseSchema, "deck_card">> = [
  "deck_card.card_id",
  "deck_card.created_at",
  "deck_card.deck_id",
  "deck_card.deck_quantity",
  "deck_card.modified_at",
  "deck_card.sideboard_quantity"
];
