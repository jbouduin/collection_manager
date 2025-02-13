import { ColumnDefinitionBuilder, Kysely } from "kysely";
import { CreateTableOptions, IBaseMigration, createTable } from "../base-migration";

export class V0_1_0_OwnedCards implements IBaseMigration {
  get keyName(): string {
    return "0009: v.0.1.0.OwnedCard";
  }

  up(db: Kysely<any>): Promise<void> {
    return createV0_1_0_OwnedCard(db);
  }

  down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("owned_card").execute();
  }
}

function createV0_1_0_OwnedCard(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    tableName: "owned_card",
    isSynced: false,
    primaryKeyType: "custom",
    primaryKey: [
      { columnName: "card_id", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() },
      { columnName: "collection_id", dataType: "integer", callback: (col: ColumnDefinitionBuilder) => col.notNull() }
    ]
  };
  return createTable(db, options)
    .addColumn("foiled", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("non_foiled", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("comments", "text")
    .execute();
}
