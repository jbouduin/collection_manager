import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../../main/database/schema";
import { ExtractTableAlias } from "kysely/dist/cjs/parser/table-parser";

export interface ITableAdapter<TB extends keyof DatabaseSchema, S> {
  toInsert(scryfall: S): InsertExpression<DatabaseSchema, TB>;
  toUpdate(scryfall: S): UpdateObjectExpression<DatabaseSchema, ExtractTableAlias<DatabaseSchema, TB>>;
}
