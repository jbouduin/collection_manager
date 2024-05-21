/* eslint-disable  @typescript-eslint/no-explicit-any */
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { DatabaseSchema } from "../../../../../main/database/schema";
import { ExtractTableAlias } from "kysely/dist/cjs/parser/table-parser";


// TODO check why using generic for the input parameters of the methods fails
export interface ITableAdapter<DB, TB extends keyof DB> {
  toInsert(scryfall: any): InsertExpression<DB, TB>;
  toUpdate(scryfall: any): UpdateObjectExpression<DB, TB>;
}

export interface INewTableAdapter<TB extends keyof DatabaseSchema, S> {
  toInsert(scryfall: S): InsertExpression<DatabaseSchema, TB>;
  toUpdate(scryfall: S): UpdateObjectExpression<DatabaseSchema, ExtractTableAlias<DatabaseSchema, TB>>;
}
