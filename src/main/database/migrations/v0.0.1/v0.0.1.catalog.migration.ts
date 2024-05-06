/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";
import { BaseMigration, CreateTableOptions } from "../base.migration";

export class V0_0_1_Catalog_Migration extends BaseMigration {
  public get keyName(): string {
    return "0001: v.0.0.1.Catalog";
  }

  public async up(db: Kysely<any>): Promise<void> {
    const options: CreateTableOptions = {
      isSynced: true,
      tableName: "catalog_item",
      defaultIdPrimaryKey: true
    };

    await super
      .createTable(db, options)
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

  public async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("catalog_item").execute();
  }
}
