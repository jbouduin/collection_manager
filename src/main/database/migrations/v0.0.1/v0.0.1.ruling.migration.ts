
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Kysely } from "kysely";

import { BaseMigration, CreateTableOptions } from "../base.migration";

export class V0_0_1_Ruling_Migration extends BaseMigration {
  public get keyName(): string {
    return "0006: v.0.0.1.Ruling";
  }

  public async up(db: Kysely<any>): Promise<void> {
    let options: CreateTableOptions = {
      isSynced: true,
      tableName: "ruling",
      defaultIdPrimaryKey: false,
      primaryKey: [
        { columnName: "oracle_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
      ]
    };
    await super
      .createTable(db, options)
      .execute();

    options = {
      isSynced: true,
      tableName: "ruling_line",
      defaultIdPrimaryKey: false
    };
    await super
      .createTable(db, options)
      .addColumn("oracle_id", "text", (col: ColumnDefinitionBuilder) => col.references("ruling.oracle_id").onDelete("cascade").notNull())
      .addColumn("source", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("published_at", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn("comments", "text", (col: ColumnDefinitionBuilder) => col.notNull())
      .execute();

    await db.schema
      .createIndex("ruling_line_oracle_id_idx")
      .on("ruling_line")
      .column("oracle_id")
      .execute();
  }

  public async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("catalog_item").execute();
  }
}
