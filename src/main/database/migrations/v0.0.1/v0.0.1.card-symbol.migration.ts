/* eslint-disable @typescript-eslint/no-explicit-any, @stylistic/newline-per-chained-call */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { IBaseMigration, CreateTableOptions, createTable } from "../base-migration";

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
    primaryKeyType: "text"
  };
  return createTable(db, options)
    .addColumn("svg_uri", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("loose_variant", "text")
    .addColumn("english", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("is_transposable", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("is_represents_mana", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("is_appears_in_mana_costs", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("mana_value", "decimal")
    .addColumn("is_hybrid", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("is_phyrexian", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("cmc", "decimal")
    .addColumn("is_funny", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .execute();
}

async function createV0_0_1_CardSymbolColorMap(db: Kysely<any>): Promise<void> {
  return db.schema.createTable("card_symbol_color_map")
    .addColumn("card_symbol_id", "text", (col: ColumnDefinitionBuilder) => col.references("card_symbol.id").onDelete("cascade").notNull())
    .addColumn("color_id", "text", (col: ColumnDefinitionBuilder) => col.references("color.id").onDelete("cascade").notNull())
    .addPrimaryKeyConstraint("CARD_SYMBOL_COLR_MAP_PK", ["card_symbol_id", "color_id"])
    .execute();
}

async function createV0_0_1_CardSymbolAlternative(db: Kysely<any>): Promise<void> {
  return db.schema.createTable("card_symbol_alternative")
    .addColumn("card_symbol_id", "text", (col: ColumnDefinitionBuilder) => col.references("card_symbol.id").onDelete("cascade").notNull())
    .addColumn("alternative", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addPrimaryKeyConstraint("CARD_SYMBOL_ALTERNATIVE_PK", ["card_symbol_id", "alternative"])
    .execute();
}
