/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";
import { BaseMigration } from "../base.migration";

export class V0_0_1_Set_Migration extends BaseMigration {
  public get keyName(): string {
    return "0002: v.0.0.1.Set";
  }

  public async up(db: Kysely<any>): Promise<void> {
    await super.createTable(db, "card_set", true)
      .addColumn("code", "text", (col: ColumnDefinitionBuilder) => col.notNull().unique())
      .addColumn("mtgo_code", "text", (col: ColumnDefinitionBuilder) => col.unique())
      .addColumn("arena_code", "text", (col: ColumnDefinitionBuilder) => col.unique())
      .addColumn("tcgplayer_id", "integer")
      .addColumn("name", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("set_type", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("released_at", "text")
      .addColumn("block_code", "text")
      .addColumn("block", "text")
      .addColumn("parent_set_code", "text")
      .addColumn("card_count", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("printed_size", "integer")
      .addColumn("digital", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("foil_only", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("nonfoil_only", "integer")
      .addColumn("scryfall_uri", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("uri", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("icon_svg_uri", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("search_uri", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .execute();
  }

  public async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("card_set").execute();
  }
}
