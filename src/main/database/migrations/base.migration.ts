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

export abstract class BaseMigration implements IBaseMigration {

  public abstract get keyName(): string;
  public abstract up(db: Kysely<any>): Promise<void>;
  public abstract down(db: Kysely<any>): Promise<void>;

  /***
   *
   */
  // TODO check what happens if we say TB extends keyof DatabaseSchema (we probably need a current schema for up and a previous schema for down)
  protected createTable<TB extends string>(db: Kysely<any>, tableName: TB, isSynced: boolean, primaryKey?: Array<PrimaryKeyColumnDefinition>): CreateTableBuilder<TB> {
    let result = db.schema
      .createTable(tableName);
    console.log(tableName, primaryKey);

    if (primaryKey == undefined || primaryKey == null) {
      result = result.addColumn("id", "text", (col: ColumnDefinitionBuilder) => col.primaryKey().notNull());
    } else if (primaryKey.length > 0) {
      primaryKey.forEach((pk: PrimaryKeyColumnDefinition) => result = result.addColumn(pk.columnName, pk.dataType, pk.callback));
      result = result.addPrimaryKeyConstraint(tableName.toUpperCase() + "_PK", primaryKey.map((pk: PrimaryKeyColumnDefinition) => pk.columnName) as Array<never>);
    }

    result = result.addColumn("created_at", "text", (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
    if (isSynced) {
      result = result.addColumn("last_synced_at", "integer", (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
    } else {
      result = result.addColumn("modified_at", "text", (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
    }

    return result;
  }


}
