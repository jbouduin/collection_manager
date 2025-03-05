import { ColumnDefinitionBuilder, InsertResult, Kysely } from "kysely";
import { CreateTableOptions, IBaseMigration, createTable } from "../base-migration";
import { sqliteUTCTimeStamp } from "../../../../common/util";

/* eslint-disable  @typescript-eslint/no-explicit-any, @stylistic/newline-per-chained-call */
export class V0_1_0_Deck implements IBaseMigration {
  get keyName(): string {
    return "0010: v.0.1.0.Deck";
  }

  public up(db: Kysely<any>): Promise<void> {
    return createV0_1_0_Deck(db)
      .then(() => populateV0_1_0_Deck(db))
      .then(async () => createV0_1_0_DeckCard(db));
  }

  public down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("deck_card").execute()
      .then(async () => db.schema.dropTable("deck").execute());
  }
}

function createV0_1_0_Deck(db: Kysely<any>) {
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

function populateV0_1_0_Deck(db: Kysely<any>): Promise<InsertResult> {
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

function createV0_1_0_DeckCard(db: Kysely<any>) {
  const options: CreateTableOptions = {
    tableName: "deck_card",
    isSynced: false,
    primaryKeyType: "custom",
    primaryKey: [
      { columnName: "deck_id", dataType: "integer", callback: (col: ColumnDefinitionBuilder) => col.notNull().references("deck.id").onDelete("cascade") },
      { columnName: "card_id", dataType: "integer", callback: (col: ColumnDefinitionBuilder) => col.notNull().references("card.id").onDelete("cascade") }
    ]
  };
  return createTable(db, options)
    .addColumn("deck_quantity", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("side_board_quantity", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .execute();
}
