/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { CreateTableOptions, IBaseMigration, createTable } from "../base.migration";

export class V0_0_1_Card_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0006: v.0.0.1.Card";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV0_0_1_Card(db)
      .then(() => createV0_0_1_CardMultiversId(db))
      .then(() => createV0_0_1_CardGame(db))
      .then(() => createV0_0_1_Cardface(db))
      .then(() => createV0_0_1_CardfaceLocalization(db))
      // .then(() => createV0_0_1_CardColorMap(db))
      // .then(() => createV0_0_1_CardImage(db))
      .then(() => createV0_0_1_CardfaceLocalizationImage(db))
      .then(() => createV0_0_1_CardFaceColorMap(db));
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("cardface_color_map").execute()
      .then(() => db.schema.dropTable("cardface_image").execute())
      .then(() => db.schema.dropTable("cardface_localization").execute())
      .then(() => db.schema.dropTable("cardface").execute())
      .then(() => db.schema.dropTable("card_game").execute())
      .then(() => db.schema.dropTable("card_multiverse_id").execute())
      .then(() => db.schema.dropTable("card").execute())
      // .then(() => db.schema.dropTable("card_color_map").execute())
      // .then(() => db.schema.dropTable("card_image").execute())
      // .then(() => db.schema.dropTable("card_keyword").execute())
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
    .addColumn("oracle_id", "text")
    .addColumn("set_id", "text", (cb: ColumnDefinitionBuilder) => cb.notNull()) // LATER references set.id and if required create index on the field
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

    // .addColumn("lang", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("layout", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("prints_search_uri", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("rulings_uri", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("uri", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("arena_id", "integer")
    // .addColumn("mtgo_id", "integer")
    // .addColumn("mtgo_foil_id", "integer")
    // .addColumn("tcgplayer_id", "integer")
    // .addColumn("tcgplayer_etched_id", "integer")
    // .addColumn("cardmarket_id", "integer")
    // .addColumn("cmc", "numeric", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("defense", "text")
    // .addColumn("edhrec_rank", "integer")
    // .addColumn("hand_modifier", "text")
    // .addColumn("life_modifier", "text")
    // .addColumn("loyalty", "text")
    // .addColumn("mana_cost", "text")
    // .addColumn("name", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("oracle_text", "text")
    // .addColumn("penny_rank", "integer")
    // .addColumn("power", "text")
    // .addColumn("reserved", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("thoughness", "text")
    // .addColumn("type_line", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("artist", "text")
    // .addColumn("flavor_name", "text")
    // .addColumn("flavor_text", "text")
    // .addColumn("frame", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("highres_image", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("illustration_id", "text")
    // .addColumn("image_status", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("oversized", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("printed_name", "text")
    // .addColumn("printed_text", "text")
    // .addColumn("printed_type_line", "text")
    // .addColumn("promo", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("story_spotlight", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("textless", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("variation", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    // .addColumn("variation_of", "text")
    // .addColumn("security_stamp", "text")
    // .addColumn("watermark", "text")
    .execute();

}

async function createV0_0_1_CardMultiversId(db: Kysely<any>): Promise<void> {
  console.log("cardmultiverseid");
  const options: CreateTableOptions = {
    isSynced: false,
    tableName: "card_multiverse_id",
    defaultIdPrimaryKey: false,
    primaryKey: [
      { columnName: "card_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("card.id").onDelete("cascade").notNull() },
      { columnName: "multiverse_id", dataType: "integer", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
    ]
  };
  return createTable(db, options).execute();
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
  const options: CreateTableOptions = {
    isSynced: false,
    tableName: "cardface",
    defaultIdPrimaryKey: true
  };

  await createTable(db, options)
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
    .execute()
    .then(async () => await db.schema.createIndex("cardface_card_id_face_name_idx")
      .on("cardface")
      .columns(["card_id", "face_name"])
      .unique()
      .execute()
    );
}

async function createV0_0_1_CardfaceLocalization(db: Kysely<any>): Promise<void> {
  console.log("cardface_localization");
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "cardface_localization",
    defaultIdPrimaryKey: true
  };
  await createTable(db, options)
    .addColumn("cardface_id", "text", (col: ColumnDefinitionBuilder) => col.references("cardface.id").onDelete("cascade").notNull())
    .addColumn("lang", "text", (col: ColumnDefinitionBuilder) => col.references("language.id").onDelete("cascade").notNull() )
    .addColumn("frame", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("printed_name", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("printed_text", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("printed_type_line", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("flavor_name", "text")
    .addColumn("flavor_text", "text")
    .execute()
    .then(async () => db.schema.createIndex("cardface_localization_cardface_id_lang_idx")
      .on("cardface_localization")
      .columns(["cardface_id", "lang"])
      .unique()
      .execute()
    );
}

async function createV0_0_1_CardfaceLocalizationImage(db: Kysely<any>): Promise<void> {
  console.log("cardface_localization_image");
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "cardface_localization_image",
    defaultIdPrimaryKey: false,
    primaryKey: [
      {
        columnName: "cardface_localization_id",
        dataType: "text",
        callback: (col: ColumnDefinitionBuilder) => col.references("cardface_localiation.id").onDelete("cascade").notNull()
      },
      {
        columnName: "image_type",
        dataType: "text",
        callback: (col: ColumnDefinitionBuilder) => col.notNull()
      }
    ]
  };
  return createTable(db, options)
    .addColumn("uri", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .execute();
}

async function createV0_0_1_CardFaceColorMap(db: Kysely<any>): Promise<void> {
  console.log("cardfacecolormap");
  const options: CreateTableOptions = {
    isSynced: false,
    tableName: "cardface_color_map",
    defaultIdPrimaryKey: false,
    primaryKey: [
      { columnName: "cardface_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("cardface.id").onDelete("cascade").notNull() },
      { columnName: "color_type", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() },
      { columnName: "color_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.references("color.id").onDelete("cascade").notNull() }
    ]
  };
  return createTable(db, options).execute()
    .then(() => db.schema.createIndex("cardface_color_map_color_id_idx").on("cardface_color_map").column("color_id").execute());
}
