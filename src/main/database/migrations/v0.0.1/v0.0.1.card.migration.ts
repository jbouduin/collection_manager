/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely, Transaction } from "kysely";

import { BaseMigration } from "../base.migration";

export class V0_0_1_Card_Migration extends BaseMigration {
  public get keyName(): string {
    return "0007: v.0.0.1.Card";
  }

  public async up(db: Kysely<any>): Promise<void> {

    await db.transaction().execute(async (trx: Transaction<any>) => {
      await super
        .createTable(trx, "card", true)
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
        .addColumn("tcg_player_id", "integer")
        .addColumn("tcgplayer_etched_id", "integer")
        .addColumn("cardmarket_id", "integer")
        .execute();

      await super
        .createTable(
          trx,
          "card_multiverse_id",
          true,
          [
            { columnName: "card_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull() },
            { columnName: "multiverse_id", dataType: "integer", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
          ])
        .execute();

      await super
        .createTable(
          trx,
          "card_color_map",
          true,
          [
            { columnName: "card_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull() },
            { columnName: "color_type", dataType: "integer", callback: (col: ColumnDefinitionBuilder) => col.notNull() },
            { columnName: "color_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("color.id").onDelete("cascade").notNull() }
          ])
        .execute();

      // TODO later check which other indices we need on card_color_map

      await super
        .createTable(
          trx,
          "card_game",
          true,
          [
            { columnName: "card_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull() },
            { columnName: "game", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
          ])
        .execute();

      await trx.schema.createIndex("card_game_game_index").on("card_game").column("game").execute();

      await super
        .createTable(
          trx,
          "card_image",
          true,
          [
            { columnName: "card_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull() },
            { columnName: "image_type", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
          ])
        .addColumn("uri", "text", (col: ColumnDefinitionBuilder) => col.notNull())
        .execute();

      await super
        .createTable(
          trx,
          "card_ruling_map",
          true,
          [
            { columnName: "card_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull() },
            { columnName: "ruling_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("ruling.id").onDelete("cascade").notNull() }
          ])
        .execute();
    });

  }

  public async down(db: Kysely<any>): Promise<void> {
  }
}
