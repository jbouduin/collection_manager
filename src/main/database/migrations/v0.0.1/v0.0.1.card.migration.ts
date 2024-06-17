/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { CreateTableOptions, IBaseMigration, createTable } from "../base-migration";

export class V0_0_1_Card_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0006: v.0.0.1.Card";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV0_0_1_Card(db)
      .then(async () => await createV0_0_1_CardMultiversId(db))
      .then(async () => await createV0_0_1_CardGame(db))
      .then(async () => await createV0_0_1_CardColorMap(db))
      .then(async () => await createV0_0_1_Cardface(db))
      .then(async () => await createV0_0_1_CardFaceColorMap(db))
      .then(async () => await createV0_0_1_CardCardMap(db));
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("cardface_color_map").execute()
      .then(async () => await db.schema.dropTable("cardface").execute())
      .then(async () => await db.schema.dropTable("card_card_map").execute())
      .then(async () => await db.schema.dropTable("card_color_map").execute())
      .then(async () => await db.schema.dropTable("card_game").execute())
      .then(async () => await db.schema.dropTable("card_multiverse_id").execute())
      .then(async () => await db.schema.dropTable("card").execute());
  }
}

async function createV0_0_1_Card(db: Kysely<any>): Promise<void> {
  console.log("card");
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "card",
    primaryKeyType: "text"
  };
  await createTable(db, options)
    .addColumn("lang", "text", (col: ColumnDefinitionBuilder) => col.references("language.id").onDelete("cascade").notNull())
    .addColumn("name", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("oracle_id", "text")
    .addColumn("set_id", "text", (cb: ColumnDefinitionBuilder) => cb.references("card_set.id").onDelete("cascade").notNull())
    .addColumn("collector_number", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("released_at", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("rarity", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("layout", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("scryfall_uri", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("is_booster", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("border", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("card_back_id", "text")
    .addColumn("is_content_warning", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("is_digital", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("is_full_art", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("is_reprint", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("frame", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("is_oversized", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("is_reserved", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("is_promo", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("security_stamp", "text")
    .addColumn("image_status", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("is_story_spotlight", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("is_variation", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .execute()
    .then(async () => await db.schema.createIndex("card_set_id_idx").on("card").column("set_id").execute())
    .then(async () => await db.schema.createIndex("card_oracle_id_idx").on("card").column("oracle_id").execute())
    .then(async () => await db.schema.createIndex("card_image_status_idx").on("card").column("image_status").execute())
    .then(async () => await db.schema.createIndex("card_last_synced_at_idx").on("card").column("last_synced_at").execute());
}

async function createV0_0_1_CardMultiversId(db: Kysely<any>): Promise<void> {
  console.log("card_multiverse_id");
  return db.schema.createTable("card_multiverse_id")
    .addColumn("card_id", "text", (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull())
    .addColumn("multiverse_id", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .addPrimaryKeyConstraint("CARD_MULTIVERSE_ID_PK", ["card_id", "multiverse_id"])
    .execute();
}

async function createV0_0_1_CardColorMap(db: Kysely<any>): Promise<void> {
  console.log("card_color_map");
  return db.schema.createTable("card_color_map")
    .addColumn("card_id", "text", (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull())
    .addColumn("color_type", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("color_id", "text", (col: ColumnDefinitionBuilder) => col.references("color.id").onDelete("cascade").notNull())
    .addPrimaryKeyConstraint("CARD_COLOR_MAP_PK", ["card_id", "color_type", "color_id"])
    .execute()
    .then(async () => await db.schema
      .createIndex("card_color_map_color_type_color_id_idx")
      .on("card_color_map")
      .columns(["color_type", "color_id"])
      .execute()
    );
}

async function createV0_0_1_CardGame(db: Kysely<any>): Promise<void> {
  console.log("card_game");
  return db.schema.createTable("card_game")
    .addColumn("card_id", "text", (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull())
    .addColumn("game", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addPrimaryKeyConstraint("CARD_GAME_PK", ["card_id", "game"])
    .execute();
}

async function createV0_0_1_Cardface(db: Kysely<any>): Promise<void> {
  console.log("card_face");

  await db.schema.createTable("cardface")
    .addColumn("card_id", "text", (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull())
    .addColumn("sequence", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("face_name", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("artist", "text")
    .addColumn("cmc", "numeric")
    .addColumn("defense", "text")
    .addColumn("illustration_id", "text")
    .addColumn("layout", "text")
    .addColumn("loyalty", "text")
    .addColumn("mana_cost", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("oracle_id", "text")
    .addColumn("power", "text")
    .addColumn("toughness", "text")
    .addColumn("watermark", "text")
    .addColumn("printed_name", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("printed_text", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("printed_type_line", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("flavor_name", "text")
    .addColumn("flavor_text", "text")
    .addPrimaryKeyConstraint("CARDFACE_ID_PK", ["card_id", "sequence"])
    .execute();
}

async function createV0_0_1_CardFaceColorMap(db: Kysely<any>): Promise<void> {
  console.log("cardface_color_map");
  return db.schema.createTable("cardface_color_map")
    .addColumn("card_id", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("sequence", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("color_type", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("color_id", "text", (col: ColumnDefinitionBuilder) => col.references("color.id").onDelete("cascade").notNull())
    .addForeignKeyConstraint(
      "FK_cardface_color_map_cardface", ["card_id", "sequence"],
      "cardface", ["card_id", "sequence"],
      (cb) => cb.onDelete("cascade"))
    .addPrimaryKeyConstraint("CARDFACE_COLOR_MAP_PK", ["card_id", "sequence", "color_type", "color_id"])
    .execute()
    .then(async () => await db.schema
      .createIndex("cardface_color_map_color_type_color_id_idx")
      .on("cardface_color_map")
      .columns(["color_type", "color_id"])
      .execute()
    );
}

async function createV0_0_1_CardCardMap(db: Kysely<any>): Promise<void> {
  console.log("card_card_map");
  return db.schema.createTable("card_card_map")
    .addColumn("card_id", "text", (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull())
    .addColumn("related_card_id", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("component", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addPrimaryKeyConstraint("CARD_CARD_MAP_PK", ["card_id", "related_card_id", "component"])
    .execute();
}
