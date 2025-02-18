import { AnyColumnWithTable } from "kysely";

import { DatabaseSchema } from "../database.schema";

export const collectionTableFields: Array<AnyColumnWithTable<DatabaseSchema, "collection">> = [
  "collection.id",
  "collection.parent_id",
  "collection.name",
  "collection.description",
  "collection.is_folder",
  "collection.is_system",
  "collection.created_at",
  "collection.modified_at"
];

export const CardConditionTableFields: Array<AnyColumnWithTable<DatabaseSchema, "card_condition">> = [
  "card_condition.id",
  "card_condition.sequence",
  "card_condition.color_code",
  "card_condition.expression",
  "card_condition.condition",
  "card_condition.description",
  "card_condition.us_expression",
  "card_condition.created_at",
  "card_condition.modified_at"
];

export const OwnedCardFields: Array<AnyColumnWithTable<DatabaseSchema, "owned_card">> = [
  "owned_card.card_id",
  "owned_card.comments",
  "owned_card.condition_id",
  "owned_card.is_foil",
  "owned_card.created_at",
  "owned_card.modified_at"
];

export const OwnedCardCollectionMapFields: Array<AnyColumnWithTable<DatabaseSchema, "owned_card_collection_map">> = [
  "owned_card_collection_map.owned_card_id",
  "owned_card_collection_map.collection_id",
  "owned_card_collection_map.quantity",
  "owned_card_collection_map.created_at",
  "owned_card_collection_map.modified_at"
];
