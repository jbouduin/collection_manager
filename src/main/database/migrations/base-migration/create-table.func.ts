import { ColumnDefinitionBuilder, CreateTableBuilder, Kysely } from "kysely";

import { CreateTableOptions } from "./create-table.options";
import { PrimaryKeyColumnDefinition } from "./primary-key-column-definition";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function createTable<TB extends string>(db: Kysely<any>, options: CreateTableOptions): CreateTableBuilder<TB> {
  let result = db.schema
    .createTable(options.tableName);

  switch (options.primaryKeyType) {
    case "text":
      result = result.addColumn("id", "text", (col: ColumnDefinitionBuilder) => col.primaryKey().notNull());
      break;
    case "integer":
      result = result.addColumn("id", "integer", (cb: ColumnDefinitionBuilder) => cb.primaryKey().autoIncrement());
      break;
    case "custom":
      if (options.primaryKey?.length > 0) {
        options.primaryKey.forEach((pk: PrimaryKeyColumnDefinition) => result = result.addColumn(pk.columnName, pk.dataType, pk.callback));
        result = result.addPrimaryKeyConstraint(options.tableName.toUpperCase() + "_PK", options.primaryKey.map((pk: PrimaryKeyColumnDefinition) => pk.columnName) as Array<never>);
      }
  }

  result = result.addColumn("created_at", "text", (col: ColumnDefinitionBuilder) => col.notNull());
  if (options.isSynced) {
    result = result.addColumn("last_synced_at", "text");
  } else {
    result = result.addColumn("modified_at", "text");
  }

  return result;
}
