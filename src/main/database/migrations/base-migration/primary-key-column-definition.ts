import { ColumnBuilderCallback } from "kysely";
import { DataTypeExpression } from "kysely/dist/cjs/parser/data-type-parser";

export interface PrimaryKeyColumnDefinition {
  columnName: string;
  dataType: DataTypeExpression;
  callback?: ColumnBuilderCallback;
}
