/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { CreateTableOptions, IBaseMigration, createTable } from "../base.migration";

export class V0_0_1_Card_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0006: v.0.0.1.Card";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV0_0_1_Card(db)
      .then(async () => await createV0_0_1_CardMultiversId(db))
      .then(async () => await createV0_0_1_CardGame(db))
      .then(async () => await createV0_0_1_Cardface(db))
      .then(async () => await createV0_0_1_CardCardMap(db))
      .then(async () => await createV0_0_1_CardfaceImage(db))
      .then(async () => await createV0_0_1_CardFaceColorMap(db));
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("cardface_color_map").execute()
      .then(async () => await db.schema.dropTable("cardface_image").execute())
      .then(async () => await db.schema.dropTable("cardface").execute())
      .then(async () => await db.schema.dropTable("card_card_map").execute())
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
    defaultIdPrimaryKey: true
  };
  await createTable(db, options)
    .addColumn("lang", "text", (col: ColumnDefinitionBuilder) => col.references("language.id").onDelete("cascade").notNull())
    .addColumn("name", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("oracle_id", "text")
    .addColumn("set_id", "text", (cb: ColumnDefinitionBuilder) => cb.references("set.id").onDelete("cascade").notNull())
    .addColumn("collector_number", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("released_at", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("rarity", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("layout", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("scryfall_uri", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("booster", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("border", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("card_back_id", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("content_warning", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("digital", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("full_art", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("reprint", "boolean", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .execute()
    .then(() => db.schema.createIndex("card_set_id_idx").on("card").column("set_id"));

}

async function createV0_0_1_CardMultiversId(db: Kysely<any>): Promise<void> {
  console.log("cardmultiversid");
  return db.schema.createTable("card_multiverse_id")
    .addColumn("card_id", "text", (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull())
    .addColumn("multiverse_id", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addPrimaryKeyConstraint("CARD_MULTIVERSE_ID_PK", ["card_id", "multiverse_id"])
    .execute();
}

async function createV0_0_1_CardGame(db: Kysely<any>): Promise<void> {
  console.log("cardgame");
  return db.schema.createTable("card_game")
    .addColumn("card_id", "text", (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull())
    .addColumn("game", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addPrimaryKeyConstraint("CARD_GAME_PK", ["card_id", "game"])
    .execute();
}

async function createV0_0_1_Cardface(db: Kysely<any>): Promise<void> {
  console.log("cardface");

  await db.schema.createTable("cardface")
    .addColumn("id", "text", (col: ColumnDefinitionBuilder) => col.primaryKey().notNull())
    .addColumn("card_id", "text", (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull())
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
    .addColumn("frame", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("printed_name", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("printed_text", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("printed_type_line", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("flavor_name", "text")
    .addColumn("flavor_text", "text")
    .execute()
    .then(async () => await db.schema.createIndex("cardface_card_id_face_name_idx")
      .on("cardface")
      .columns(["card_id", "face_name"])
      .unique()
      .execute()
    );
}

async function createV0_0_1_CardfaceImage(db: Kysely<any>): Promise<void> {
  console.log("cardface_image");
  return db.schema.createTable("cardface_image")
    .addColumn("cardface_id", "text", (col: ColumnDefinitionBuilder) => col.references("cardface.id").onDelete("cascade").notNull())
    .addColumn("image_type", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("uri", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addPrimaryKeyConstraint("CARDFACE_LOCALIZATION_IMAGE_PK", ["cardface_id", "image_type"])
    .execute();
}

async function createV0_0_1_CardFaceColorMap(db: Kysely<any>): Promise<void> {
  console.log("cardfacecolormap");
  return db.schema.createTable("cardface_color_map")
    .addColumn("cardface_id", "text", (col: ColumnDefinitionBuilder) => col.references("cardface.id").onDelete("cascade").notNull())
    .addColumn("color_type", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("color_id", "text", (col: ColumnDefinitionBuilder) => col.references("color.id").onDelete("cascade").notNull())
    .addPrimaryKeyConstraint("CARDFACE_COLOR_MAP_PK", ["cardface_id", "color_type", "color_id"])
    .execute()
    .then(() => db.schema.createIndex("cardface_color_map_color_id_idx").on("cardface_color_map").column("color_id").execute());
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
