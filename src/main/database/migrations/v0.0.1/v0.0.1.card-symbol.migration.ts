/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { IBaseMigration, CreateTableOptions, createTable } from "../base.migration";

export class V0_0_1_CardSymbol_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0005: v.0.0.1.CardSymbol";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV0_0_1_CardSymbol(db)
      .then(() => createV0_0_1_CardSymbolColorMap(db))
      .then(() => createV0_0_1_CardSymbolAlternative(db));
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("card_symbol_alternative").execute()
      .then(() => db.schema.dropTable("card_symbol_color_map").execute())
      .then(() => db.schema.dropTable("card_symbol").execute());
  }
}

async function createV0_0_1_CardSymbol(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "card_symbol",
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

async function createV0_0_1_CardSymbolColorMap(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "card_symbol_color_map",
    defaultIdPrimaryKey: false,
    primaryKey: [
      { columnName: "card_symbol_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card_symbol.id").onDelete("cascade").notNull() },
      { columnName: "color_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("color.id").onDelete("cascade").notNull() }
    ]
  };
  await createTable(db, options).execute();

}

async function createV0_0_1_CardSymbolAlternative(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "card_symbol_alternative",
    defaultIdPrimaryKey: false,
    primaryKey: [
      { columnName: "card_symbol_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card_symbol.id").onDelete("cascade").notNull() },
      { columnName: "alternative", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
    ]
  };
  await createTable(db, options).execute();
}
