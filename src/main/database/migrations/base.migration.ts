/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnBuilderCallback, ColumnDefinitionBuilder, CreateTableBuilder, Kysely, sql } from "kysely";
import { DataTypeExpression } from "kysely/dist/cjs/parser/data-type-parser";

export interface IBaseMigration {
  get keyName(): string;
  up(db: Kysely<any>): Promise<void>;
  down(db: Kysely<any>): Promise<void>
}

export interface PrimaryKeyColumnDefinition {
  columnName: string,
  dataType: DataTypeExpression,
  callback?: ColumnBuilderCallback
}

export interface CreateTableOptions {
  tableName: string;
  isSynced: boolean;
  defaultIdPrimaryKey?: boolean;
  primaryKey?: Array<PrimaryKeyColumnDefinition>;
}

export abstract class BaseMigration implements IBaseMigration {

  public abstract get keyName(): string;
  public abstract up(db: Kysely<any>): Promise<void>;
  public abstract down(db: Kysely<any>): Promise<void>;

  /***
   *
   */
  // TODO check what happens if we say TB extends keyof DatabaseSchema (we probably need a current schema for up and a previous schema for down)
  protected createTable<TB extends string>(db: Kysely<any>, options: CreateTableOptions): CreateTableBuilder<TB> {
    let result = db.schema
      .createTable(options.tableName);

    if (options.defaultIdPrimaryKey) {
      result = result.addColumn("id", "text", (col: ColumnDefinitionBuilder) => col.primaryKey().notNull());
    } else if (options.primaryKey?.length > 0) {
      options.primaryKey.forEach((pk: PrimaryKeyColumnDefinition) => result = result.addColumn(pk.columnName, pk.dataType, pk.callback));
      result = result.addPrimaryKeyConstraint(options.tableName.toUpperCase() + "_PK", options.primaryKey.map((pk: PrimaryKeyColumnDefinition) => pk.columnName) as Array<never>);
    }

    result = result.addColumn("created_at", "text", (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
    if (options.isSynced) {
      result = result.addColumn("last_synced_at", "text", (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
    } else {
      result = result.addColumn("modified_at", "text", (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
    }

    return result;
  }


}
