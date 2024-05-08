/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";
import { IBaseMigration, CreateTableOptions, createTable } from "../base.migration";

export class V0_0_1_Catalog_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0001: v.0.0.1.Catalog";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV0_0_1_CatalogItem(db);
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("catalog_item").execute();
  }
}

async function createV0_0_1_CatalogItem(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "catalog_item",
    defaultIdPrimaryKey: true
  };

  await createTable(db, options)
    .addColumn("catalog_name", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("item", "text", (col: ColumnDefinitionBuilder) => col.notNull().notNull())
    .execute();

  await db.schema
    .createIndex("catalog_item_unique_idx")
    .on("catalog_item")
    .column("catalog_name")
    .column("item")
    .unique()
    .execute();
}
