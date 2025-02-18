import { AnyColumnWithTable } from "kysely";

import { DatabaseSchema } from "../database.schema";

export const ORACLE_TABLE_FIELDS: Array<AnyColumnWithTable<DatabaseSchema, "oracle">> = [
  "oracle.created_at",
  "oracle.face_sequence",
  "oracle.last_synced_at",
  "oracle.oracle_id",
  "oracle.oracle_name",
  "oracle.oracle_text",
  "oracle.type_line"
];
