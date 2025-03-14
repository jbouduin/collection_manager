import { ColumnDefinitionBuilder, InsertResult, Kysely } from "kysely";
import { CreateTableOptions, IBaseMigration, createTable } from "../../base-migration";
import { sqliteUTCTimeStamp } from "../../../../../common/util";


/* eslint-disable  @typescript-eslint/no-explicit-any, @stylistic/newline-per-chained-call */
export class V1_0_0_Deck_Migration implements IBaseMigration {
  get keyName(): string {
    return "0030: v.1.0.0.Deck";
  }

  public up(db: Kysely<any>): Promise<void> {
    return createV1_0_0_Deck(db)
      .then(() => populateV1_0_0_Deck(db))
      .then(async () => createV1_0_0_DeckCard(db));
  }

  public down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("deck_card").execute()
      .then(async () => db.schema.dropTable("deck").execute());
  }
}

function createV1_0_0_Deck(db: Kysely<any>) {
  const options: CreateTableOptions = {
    tableName: "deck",
    isSynced: false,
    primaryKeyType: "integer"
  };
  return createTable(db, options)
    .addColumn("parent_id", "integer", (cb: ColumnDefinitionBuilder) => cb.references("deck.id"))
    .addColumn("name", "text", (cb: ColumnDefinitionBuilder) => cb.notNull().unique())
    .addColumn("description", "text")
    .addColumn("target_format", "text")
    .addColumn("is_system", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("is_folder", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addUniqueConstraint("DECK_PARENT_ID_NAME_UC", ["parent_id", "name"])
    .execute();
}

function populateV1_0_0_Deck(db: Kysely<any>): Promise<InsertResult> {
  /*
   * add one single system value, which will be the parent for all folders and decks created in the root.
   * This value will not be retrieved
   */
  return db.insertInto("deck")
    .values({
      parent_id: null,
      name: "System root",
      description: null,
      is_system: 1,
      is_folder: 1,
      created_at: sqliteUTCTimeStamp()
    })
    .executeTakeFirst();
}

function createV1_0_0_DeckCard(db: Kysely<any>) {
  const options: CreateTableOptions = {
    tableName: "deck_card",
    isSynced: false,
    primaryKeyType: "integer"
  };
  return createTable(db, options)
    .addColumn("deck_id", "integer", (col: ColumnDefinitionBuilder) => col.notNull().references("deck.id").onDelete("cascade"))
    .addColumn("card_id", "integer", (col: ColumnDefinitionBuilder) => col.notNull().references("card.id").onDelete("cascade"))
    .addColumn("deck_quantity", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("sideboard_quantity", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addUniqueConstraint("UC_DECK_ID_CARD_ID", ["deck_id", "card_id"])
    .execute()
    .then(async () => await db.schema.createIndex("deck_card_card_id_idx").on("deck_card").column("card_id").execute())
    .then(async () => await db.schema.createIndex("deck_card_deck_id_idx").on("deck_card").column("deck_id").execute());
}
