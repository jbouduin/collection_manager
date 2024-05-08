/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { IBaseMigration, CreateTableOptions, createTable } from "../base.migration";

export class V0_0_1_Symbology_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0005: v.0.0.1.Symbology";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV0_0_1_Symbology(db)
      .then(() => createV0_0_1_SymbologyColorMap(db))
      .then(() => createV0_0_1_SymbologyAlternative(db));
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("Symbology").execute()
      .then(() => db.schema.dropTable("symbology_color_map").execute())
      .then(() => db.schema.dropTable("symbology_alternative").execute());
  }
}

async function createV0_0_1_Symbology(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "symbology",
    defaultIdPrimaryKey: true
  };
  return createTable(db, options)
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
}

async function createV0_0_1_SymbologyColorMap(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "symbology_color_map",
    defaultIdPrimaryKey: false,
    primaryKey: [
      { columnName: "symbology_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("symbology.id").onDelete("cascade").notNull() },
      { columnName: "color_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("color.id").onDelete("cascade").notNull() }
    ]
  };
  await createTable(db, options).execute();

}

async function createV0_0_1_SymbologyAlternative(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "symbology_alternative",
    defaultIdPrimaryKey: false,
    primaryKey: [
      { columnName: "symbology_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("symbology.id").onDelete("cascade").notNull() },
      { columnName: "alternative", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
    ]
  };
  await createTable(db, options).execute();
}
