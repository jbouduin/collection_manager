
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { IBaseMigration, CreateTableOptions, createTable } from "../base.migration";

export class V0_0_1_Ruling_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0006: v.0.0.1.Ruling";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV0_0_1_Ruling(db)
      .then(() => createV0_0_1_RulingLine(db));
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("catalog_item").execute();
  }
}

async function createV0_0_1_Ruling(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "ruling",
    defaultIdPrimaryKey: false,
    primaryKey: [
      { columnName: "oracle_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
    ]
  };
  return createTable(db, options).execute();
}

async function createV0_0_1_RulingLine(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "ruling_line",
    defaultIdPrimaryKey: false
  };
  return createTable(db, options)
    .addColumn("oracle_id", "text", (col: ColumnDefinitionBuilder) => col.references("ruling.oracle_id").onDelete("cascade").notNull())
    .addColumn("source", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("published_at", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("comments", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .execute()
    .then(() => db.schema
      .createIndex("ruling_line_oracle_id_idx")
      .on("ruling_line")
      .column("oracle_id")
      .execute()
    );
}
