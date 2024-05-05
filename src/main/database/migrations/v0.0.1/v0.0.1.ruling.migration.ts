
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";
import { BaseMigration, PrimaryKeyColumnDefinition } from "../base.migration";

export class V0_0_1_Ruling_Migration extends BaseMigration {
  public get keyName(): string {
    return "0006: v.0.0.1.Ruling";
  }

  public async up(db: Kysely<any>): Promise<void> {
    await super
      .createTable(db, "ruling", true, new Array<PrimaryKeyColumnDefinition>())
      .addColumn("oracle_id", "text", (col: ColumnDefinitionBuilder) => col.notNull().primaryKey())
      .addColumn("source", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("published_at", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("comments", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .execute();
  }

  public async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("catalog_item").execute();
  }
}
