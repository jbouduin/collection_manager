/* eslint-disable  @typescript-eslint/no-explicit-any */
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

// TODO check why using generic for the input parameters of the methods fails
export interface IMapTableAdapter<DB, TB extends keyof DB> {
  toInsert(leftId: string, rigthId: string, scryfall: any): InsertExpression<DB, TB>;
  toUpdate(scryfall: any): UpdateObjectExpression<DB, TB>;
}
