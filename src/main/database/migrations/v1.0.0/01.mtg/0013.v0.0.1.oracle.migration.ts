
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { IBaseMigration, CreateTableOptions, createTable } from "../../base-migration";

/* eslint-disable  @typescript-eslint/no-explicit-any, @stylistic/newline-per-chained-call */
export class V1_0_0_Oracle_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0013: v.1.0.0.Oracle";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV1_0_0_Ruling(db)
      .then(async () => await createV1_0_0_RulingLine(db))
      .then(async () => await createV1_0_0_Oracle(db))
      .then(async () => await createV1_0_0_OracleLegality(db))
      .then(async () => await createV1_0_0_OracleKeyword(db));
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("oracle_ruling_lein").execute()
      .then(async () => await db.schema.dropTable("oracle_ruling").execute());
  }
}

async function createV1_0_0_Ruling(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "oracle_ruling",
    primaryKeyType: "custom",
    primaryKey: [{ columnName: "oracle_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }]
  };
  return createTable(db, options).execute();
}

async function createV1_0_0_RulingLine(db: Kysely<any>): Promise<void> {
  return db.schema.createTable("oracle_ruling_line")
    .addColumn(
      "oracle_id",
      "text",
      (col: ColumnDefinitionBuilder) => col.references("oracle_ruling.oracle_id").onDelete("cascade").notNull()
    )
    .addColumn("source", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("published_at", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("comments", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .execute()
    .then(async () => await db.schema
      .createIndex("ruling_line_oracle_id_idx")
      .on("oracle_ruling_line")
      .column("oracle_id")
      .execute());
}

async function createV1_0_0_Oracle(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "oracle",
    primaryKeyType: "custom",
    primaryKey: [
      { columnName: "oracle_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() },
      { columnName: "face_sequence", dataType: "integer", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
    ]
  };
  return createTable(db, options)
    .addColumn("oracle_name", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("oracle_text", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("type_line", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .execute();
}

async function createV1_0_0_OracleLegality(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "oracle_legality",
    primaryKeyType: "custom",
    primaryKey: [
      { columnName: "oracle_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() },
      { columnName: "format", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull().references("game_format.id") }
    ]
  };

  return createTable(db, options)
    .addColumn("legality", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .execute()
    .then(async () => await db.schema.createIndex("oracle_legality_format_idx").on("oracle_legality").column("format").execute());
}

async function createV1_0_0_OracleKeyword(db: Kysely<any>): Promise<void> {
  return db.schema.createTable("oracle_keyword")
    .addColumn("oracle_id", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("keyword", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addPrimaryKeyConstraint("ORACLE_KEYWORD_PK", ["oracle_id", "keyword"])
    .execute()
    .then(async () => await db.schema.createIndex("oracle_keyword_keyword_idx").on("oracle_keyword").column("keyword").execute());
}
