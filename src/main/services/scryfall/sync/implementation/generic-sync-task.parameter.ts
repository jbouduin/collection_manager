
import { ExpressionOrFactory, SqlBool, Transaction } from "kysely";
import { DatabaseSchema } from "../../../../../main/database/schema";
import { ExtractTableAlias } from "kysely/dist/cjs/parser/table-parser";
import { ITableAdapter } from "../../adapt/interface/table.adapter";

export type GenericSyncTaskParameter<TB extends keyof DatabaseSchema, S> = {
  trx: Transaction<DatabaseSchema>;
  tableName: TB;
  filter: ExpressionOrFactory<DatabaseSchema, ExtractTableAlias<DatabaseSchema, TB>, SqlBool>;
  adapter: ITableAdapter<TB, S>;
  scryfall: S;
};
