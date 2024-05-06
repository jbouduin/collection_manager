
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { NewColor } from "../../schema";
import { BaseMigration, CreateTableOptions } from "../base.migration";

export class V0_0_1_Color_Migration extends BaseMigration {
  public get keyName(): string {
    return "0004: v.0.0.1.Color";
  }

  public async up(db: Kysely<any>): Promise<void> {
    const options: CreateTableOptions = {
      isSynced: false,
      tableName: "color",
      defaultIdPrimaryKey: true
    };
    await super
      .createTable(db, options)
      .addColumn("sequence", "integer", (col: ColumnDefinitionBuilder) => col.notNull().unique())
      .addColumn("display_text", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("land_type", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("mana_symbol", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .execute();

    const values: Array<NewColor> = new Array<NewColor>();
    values.push({ id: "W", sequence: 0, display_text: "White", land_type: "Plains", mana_symbol: "{W}" });
    values.push({ id: "U", sequence: 1, display_text: "Blue", land_type: "Plains", mana_symbol: "{U}" });
    values.push({ id: "B", sequence: 2, display_text: "Black", land_type: "Plains", mana_symbol: "{B}" });
    values.push({ id: "R", sequence: 3, display_text: "Red", land_type: "Plains", mana_symbol: "{R}" });
    values.push({ id: "G", sequence: 4, display_text: "Green", land_type: "Plains", mana_symbol: "{G}" });
    // TODO Pyhrexian and colorless as colors ???
    await db
      .insertInto("color")
      .values(values)
      .executeTakeFirstOrThrow();

  }

  public async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("catalog_item").execute();
  }
}
