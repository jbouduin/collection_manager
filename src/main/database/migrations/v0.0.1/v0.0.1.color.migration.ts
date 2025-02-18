
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, InsertResult, Insertable, Kysely } from "kysely";

import { ColorTable } from "../../schema";
import { IBaseMigration, CreateTableOptions, createTable } from "../base-migration";
import { sqliteUTCTimeStamp } from "../../../../common/util";

export class V0_0_1_Color_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0004: v.0.0.1.Color";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV0_0_1_Color(db)
      .then(() => populateV0_0_1_Color(db))
      .then(() => Promise.resolve());
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("catalog_item").execute();
  }
}

async function createV0_0_1_Color(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: false,
    tableName: "color",
    primaryKeyType: "text"
  };
  return createTable(db, options)
    .addColumn("sequence", "integer", (col: ColumnDefinitionBuilder) => col.notNull().unique())
    .addColumn("display_text", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("land_type", "text")
    .addColumn("mana_symbol", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .execute();
}

async function populateV0_0_1_Color(db: Kysely<any>): Promise<Array<InsertResult>> {
  const values = new Array<Insertable<ColorTable>>();
  const now = sqliteUTCTimeStamp();
  values.push({ created_at: now, modified_at: now, id: "W", sequence: 0, display_text: "White", land_type: "Plains", mana_symbol: "{W}" });
  values.push({ created_at: now, modified_at: now, id: "U", sequence: 1, display_text: "Blue", land_type: "Island", mana_symbol: "{U}" });
  values.push({ created_at: now, modified_at: now, id: "B", sequence: 2, display_text: "Black", land_type: "Swamp", mana_symbol: "{B}" });
  values.push({ created_at: now, modified_at: now, id: "R", sequence: 3, display_text: "Red", land_type: "Mountain", mana_symbol: "{R}" });
  values.push({ created_at: now, modified_at: now, id: "G", sequence: 4, display_text: "Green", land_type: "Forest", mana_symbol: "{G}" });
  values.push({ created_at: now, modified_at: now, id: "C", sequence: 5, display_text: "Colorless", mana_symbol: "{C}" });
  return db
    .insertInto("color")
    .values(values)
    .execute();
}
