import { ColumnDefinitionBuilder, InsertResult, Kysely } from "kysely";
import { CreateTableOptions, IBaseMigration, createTable } from "../base-migration";
import { sqliteUTCTimeStamp } from "../../../../common/util";

export class V0_1_0_Collection implements IBaseMigration {
  get keyName(): string {
    return "0008: v.0.1.0.Collection";
  }

  public up(db: Kysely<any>): Promise<void> {
    return createV0_1_0_Collection(db)
      .then(() => populateV0_1_0_Collection(db))
      .then(() => Promise.resolve());
  }
  down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("collection").execute()
  }
}

function createV0_1_0_Collection(db: Kysely<any>) {
  const options: CreateTableOptions = {
    tableName: "collection",
    isSynced: false,
    primaryKeyType: "integer"
  }
  return createTable(db, options)
    .addColumn("parent_id", "integer", (cb: ColumnDefinitionBuilder) => cb.references("collection.id"))
    .addColumn("name", "text", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("description", "text")
    .addColumn("is_system", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("is_folder", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addUniqueConstraint("COLLECTION_PARENT_ID_NAME_UC", ["parent_id", "name"])
    .execute();
}

function populateV0_1_0_Collection(db: Kysely<any>): Promise<InsertResult> {
  return db.insertInto("collection")
    .values({
      parent_id: null,
      name: "All",
      description: null,
      is_system: 1,
      is_folder: 1,
      created_at: sqliteUTCTimeStamp,
      modified_at: sqliteUTCTimeStamp
    })
    .executeTakeFirst();
}
