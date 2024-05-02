import { ColumnDefinitionBuilder, CreateTableBuilder, Kysely, sql } from "kysely";

export interface IBaseMigration {
  up(db: Kysely<any>): Promise<void>;
  down(db: Kysely<any>): Promise<void>
}


export abstract class BaseMigration implements IBaseMigration {
  public abstract up(db: Kysely<any>): Promise<void>;
  public abstract down(db: Kysely<any>): Promise<void>;

  protected createNonSyncedTable<TB extends string>(db: Kysely<any>, tableName: string): CreateTableBuilder<TB> {
    return db.schema
      .createTable(tableName)
      .addColumn('id', 'text', (col: ColumnDefinitionBuilder) => col.primaryKey().notNull())
      .addColumn('created_at', 'text', (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull().primaryKey())
      .addColumn('modified_at', 'text', (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
  }

  protected createSyncedTable<TB extends string>(db: Kysely<any>, tableName: string): CreateTableBuilder<TB> {
    return db.schema
      .createTable(tableName)
      .addColumn('id', 'text', (col: ColumnDefinitionBuilder) => col.primaryKey().notNull())
      .addColumn('created_at', 'text', (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('last_synced_at', 'integer', (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
    // TODO Executing code as below throws: error: TypeError: this.createTableWithBasicFields is not a function
    // return this.createTableWithBasicFields(db, tableName)
    //   .addColumn('last_synced_at', 'integer', (col: ColumnDefinitionBuilder) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
  }
}
