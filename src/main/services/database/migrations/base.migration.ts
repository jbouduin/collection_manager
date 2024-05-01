import { ColumnDefinitionBuilder, CreateTableBuilder, Kysely, sql } from "kysely";

export interface IBaseMigration {
  up(db: Kysely<any>): Promise<void>;
  down(db: Kysely<any>): Promise<void>
}


export abstract class BaseMigration implements IBaseMigration {
  public abstract up(db: Kysely<any>): Promise<void>;
  public abstract down(db: Kysely<any>): Promise<void>;

  protected createTableWithBasicFields<TB extends string>(db: Kysely<any>, tableName: string): CreateTableBuilder<TB> {
    return db.schema
      .createTable(tableName)
      .addColumn('id', 'integer', (col: ColumnDefinitionBuilder) => col.primaryKey())
      .addColumn('created_at', 'text', (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('modified_at', 'text', (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
  }

  protected addLastSynced<TB extends string>(tableBuilder: CreateTableBuilder<TB>): CreateTableBuilder<TB> {
    return tableBuilder
      .addColumn('last_synced_at', 'integer', (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
  }
}
