/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { BaseMigration, CreateTableOptions } from "../base.migration";

export class V0_0_1_Card_Migration extends BaseMigration {
  public get keyName(): string {
    return "0007: v.0.0.1.Card";
  }

  public async up(db: Kysely<any>): Promise<void> {
    let options: CreateTableOptions = {
      isSynced: true,
      tableName: "card",
      defaultIdPrimaryKey: true
    };
    await super
      .createTable(db, options)
      .addColumn("oracle_id", "text")
      .addColumn("lang", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
      .addColumn("layout", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
      .addColumn("prints_search_uri", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
      .addColumn("rulings_uri", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
      .addColumn("scryfall_uri", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
      .addColumn("uri", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
      .addColumn("arena_id", "integer")
      .addColumn("mtgo_id", "integer")
      .addColumn("mtgo_foil_id", "integer")
      .addColumn("tcgplayer_id", "integer")
      .addColumn("tcgplayer_etched_id", "integer")
      .addColumn("cardmarket_id", "integer")
      .execute();

    options = {
      isSynced: true,
      tableName: "card_multiverse_id",
      defaultIdPrimaryKey: false,
      primaryKey: [
        { columnName: "card_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull() },
        { columnName: "multiverse_id", dataType: "integer", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
      ]
    };
    await super
      .createTable(db, options)
      .execute();

    options = {
      isSynced: true,
      tableName: "card_color_map",
      defaultIdPrimaryKey: false,
      primaryKey: [
        { columnName: "card_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull() },
        { columnName: "color_type", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() },
        { columnName: "color_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("color.id").onDelete("cascade").notNull() }
      ]
    };
    await super
      .createTable(db, options)
      .execute();
    // TODO later check which other indices we need on card_color_map

    options = {
      isSynced: true,
      tableName: "card_game",
      defaultIdPrimaryKey: false,
      primaryKey: [
        { columnName: "card_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull() },
        { columnName: "game", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
      ]
    };
    await super
      .createTable(db, options)
      .execute();

    await db.schema.createIndex("card_game_game_index").on("card_game").column("game").execute();

    options = {
      isSynced: true,
      tableName: "card_image",
      defaultIdPrimaryKey: false,
      primaryKey: [
        { columnName: "card_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull() },
        { columnName: "image_type", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
      ]
    };
    await super
      .createTable(db, options)
      .addColumn("uri", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .execute();
  }

  public async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("card").execute();
    // TODO add other tables here
  }
}
