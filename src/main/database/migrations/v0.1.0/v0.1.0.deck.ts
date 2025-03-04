import { ColumnDefinitionBuilder, Kysely } from "kysely";
import { CreateTableOptions, IBaseMigration, createTable } from "../base-migration";

/* eslint-disable  @typescript-eslint/no-explicit-any, @stylistic/newline-per-chained-call */
export class V0_1_0_Deck implements IBaseMigration {
  get keyName(): string {
    return "0010: v.0.1.0.Deck";
  }

  public up(db: Kysely<any>): Promise<void> {
    return createV0_1_0_Deck(db)
      .then(async () => createV0_1_0_DeckCard(db));
  }
  down(db: Kysely<any>): Promise<void> {
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
    .addColumn("name", "text", (cb: ColumnDefinitionBuilder) => cb.notNull().unique())
    .addColumn("description", "text")
    .addColumn("target_format", "text")
    .execute();
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
