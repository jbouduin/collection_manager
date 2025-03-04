import { AnyColumnWithTable } from "kysely";

import { DatabaseSchema } from "../database.schema";

export const DECK_TABLE_FIELDS: Array<AnyColumnWithTable<DatabaseSchema, "deck">> = [
  "deck.id",
  "deck.name",
  "deck.description",
  "deck.target_format",
  "deck.created_at",
  "deck.modified_at"
];
