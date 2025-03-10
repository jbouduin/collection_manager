import { expressionBuilder, ExpressionWrapper, sql } from "kysely";
import { DatabaseSchema } from "../../../schema";

export function $whereBoolean(
  booleanFieldReference: ExpressionWrapper<DatabaseSchema, keyof DatabaseSchema, boolean>,
  booleanValue: boolean
) {
  const eb = expressionBuilder<DatabaseSchema, never>();
  return eb(sql`${booleanFieldReference}`, "=", booleanValue ? sql`1` : sql`0`);
}
