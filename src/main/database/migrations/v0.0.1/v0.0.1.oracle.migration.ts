
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { IBaseMigration, CreateTableOptions, createTable } from "../base-migration";

export class V0_0_1_Ruling_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0007: v.0.0.1.Oracle";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV0_0_1_Ruling(db)
      .then(async () => await createV0_0_1_RulingLine(db))
      .then(async () => await createV0_0_1_Oracle(db))
      .then(async () => await createV0_0_1_OracleLegality(db))
      .then(async () => await createV0_0_1_OracleKeyword(db));
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("oracle_ruling_lein").execute()
      .then(async () => await db.schema.dropTable("oracle_ruling").execute());
  }
}

async function createV0_0_1_Ruling(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "oracle_ruling",
    defaultIdPrimaryKey: false,
    primaryKey: [
      { columnName: "oracle_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
    ]
  };
  return createTable(db, options).execute();
}

async function createV0_0_1_RulingLine(db: Kysely<any>): Promise<void> {
  return db.schema.createTable("oracle_ruling_line")
    .addColumn("oracle_id", "text", (col: ColumnDefinitionBuilder) => col.references("oracle_ruling.oracle_id").onDelete("cascade").notNull())
    .addColumn("source", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("published_at", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("comments", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .execute()
    .then(async () => await db.schema
      .createIndex("ruling_line_oracle_id_idx")
      .on("oracle_ruling_line")
      .column("oracle_id")
      .execute()
    );
}

async function createV0_0_1_Oracle(db: Kysely<any>): Promise<void> {
  console.log("oracle");
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "oracle",
    defaultIdPrimaryKey: false,
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

async function createV0_0_1_OracleLegality(db: Kysely<any>): Promise<void> {
  console.log("oracle_legality");
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "oracle_legality",
    defaultIdPrimaryKey: false,
    primaryKey: [
      { columnName: "oracle_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() },
      { columnName: "format", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
    ]
  };

  return createTable(db, options)
    .addColumn("legality", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .execute();
}

async function createV0_0_1_OracleKeyword(db: Kysely<any>): Promise<void> {
  console.log("oracle_keyword");
  return db.schema.createTable("oracle_keyword")
    .addColumn("oracle_id", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addColumn("keyword", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .addPrimaryKeyConstraint("ORACLE_KEYWORD_PK", ["oracle_id", "keyword"])
    .execute();
}
