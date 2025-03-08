import { ColumnDefinitionBuilder, Insertable, InsertResult, Kysely } from "kysely";
import { sqliteUTCTimeStamp } from "../../../../../common/util";
import { GameFormatTable } from "../../../schema";
import { createTable, CreateTableOptions, IBaseMigration } from "../../base-migration";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export class V1_0_0_GameFormat_Migration implements IBaseMigration {
  get keyName(): string {
    return "0004: v.1.0.0.GameFormat";
  }

  public up(db: Kysely<any>): Promise<void> {
    return createV1_0_0_GameFormat(db)
      .then(() => populateV1_0_0_GameFormat(db))
      .then(() => Promise.resolve());
  }
  down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("game_format").execute();
  }
}

function createV1_0_0_GameFormat(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: false,
    tableName: "game_format",
    primaryKeyType: "text"
  };
  return createTable(db, options)
    .addColumn("sequence", "integer", (col: ColumnDefinitionBuilder) => col.notNull().unique())
    .addColumn("display_text", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("deck_size_quantity", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("deck_size_operator", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("sideboard_size_quantity", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("sideboard_size_operator", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("max_card_quantity", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("max_card_operator", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .execute();
}

function populateV1_0_0_GameFormat(db: Kysely<any>): Promise<Array<InsertResult>> {
  const values = new Array<Insertable<GameFormatTable>>();
  const now = sqliteUTCTimeStamp();
  let seq: number = 0;
  values.push({
    id: "alchemy",
    sequence: seq++,
    display_text: "Alchemy",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "brawl",
    sequence: seq++,
    display_text: "Brawl",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "commander",
    sequence: seq++,
    display_text: "Commander",
    deck_size_quantity: 100,
    deck_size_operator: "==",
    sideboard_size_quantity: 0,
    sideboard_size_operator: "==",
    max_card_quantity: 1,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "duel",
    sequence: seq++,
    display_text: "Duel",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "explorer",
    sequence: seq++,
    display_text: "Explorer",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "future",
    sequence: seq++,
    display_text: "Future",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "gladiator",
    sequence: seq++,
    display_text: "Gladiator",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "historic",
    sequence: seq++,
    display_text: "Historic",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "legacy",
    sequence: seq++,
    display_text: "Legacy",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "modern",
    sequence: seq++,
    display_text: "Modern",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "oathbreaker",
    sequence: seq++,
    display_text: "Oathbreaker",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "oldschool",
    sequence: seq++,
    display_text: "Oldschool",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "pauper",
    sequence: seq++,
    display_text: "Pauper",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "paupercommander",
    sequence: seq++,
    display_text: "Pauper Commander",
    deck_size_quantity: 100,
    deck_size_operator: "==",
    sideboard_size_quantity: 0,
    sideboard_size_operator: "==",
    max_card_quantity: 1,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "penny",
    sequence: seq++,
    display_text: "Penny",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "pioneer",
    sequence: seq++,
    display_text: "Pioneer",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "predh",
    sequence: seq++,
    display_text: "Predh ???",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "premodern",
    sequence: seq++,
    display_text: "Pre-modern",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "standard",
    sequence: seq++,
    display_text: "Standard",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "standardbrawl",
    sequence: seq++,
    display_text: "Standard Brawl",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "timeless",
    sequence: seq++,
    display_text: "Timeless",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });
  values.push({
    id: "vintage",
    sequence: seq++,
    display_text: "Vintage",
    deck_size_quantity: 60,
    deck_size_operator: ">=",
    sideboard_size_quantity: 15,
    sideboard_size_operator: "<=",
    max_card_quantity: 4,
    max_card_operator: "==",
    created_at: now
  });

  return db.insertInto("game_format")
    .values(values)
    .execute();
}
