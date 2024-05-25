/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";
import { IBaseMigration } from "../base.migration";

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
  await db.schema.createTable("catalog_item")
    .addColumn("catalog_name", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("item", "text", (col: ColumnDefinitionBuilder) => col.notNull().notNull())
    .addPrimaryKeyConstraint("CATALOG_ITEM_PK", ["catalog_name", "item"])
    .execute();
}
