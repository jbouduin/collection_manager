/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { BaseMigration, CreateTableOptions } from "../base.migration";

export class V0_0_1_Symbology_Migration extends BaseMigration {
  public get keyName(): string {
    return "0005: v.0.0.1.Symbology";
  }

  public async up(db: Kysely<any>): Promise<void> {
    let options: CreateTableOptions = {
      isSynced: true,
      tableName: "symbology",
      defaultIdPrimaryKey: true
    };
    await super
      .createTable(db, options)
      // LATER we need better handling of failing migrations (consider using .ifNotExists())
      .addColumn("svg_uri", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("loose_variant", "text")
      .addColumn("english", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("transposable", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("represents_mana", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("appears_in_mana_costs", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("mana_value", "decimal")
      .addColumn("hybrid", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("phyrexian", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("cmc", "decimal")
      .addColumn("funny", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
      .execute();

    options = {
      isSynced: true,
      tableName: "symbology_color_map",
      defaultIdPrimaryKey: false,
      primaryKey: [
        { columnName: "symbology_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("symbology.id").onDelete("cascade").notNull() },
        { columnName: "color_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("color.id").onDelete("cascade").notNull() }
      ]
    };
    await super
      .createTable(db, options)
      .execute();

    options = {
      isSynced: true,
      tableName: "symbology_alternative",
      defaultIdPrimaryKey: false,
      primaryKey: [
        { columnName: "symbology_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("symbology.id").onDelete("cascade").notNull() },
        { columnName: "alternative", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
      ]
    };
    await super
      .createTable(db, options)
      .execute();
  }

  public async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("Symbology").execute();
    await db.schema.dropTable("symbology_color_map").execute();
    await db.schema.dropTable("symbology_alternative");
  }
}
