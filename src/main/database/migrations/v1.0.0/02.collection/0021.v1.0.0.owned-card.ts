import { ColumnDefinitionBuilder, Kysely } from "kysely";
import { CreateTableOptions, IBaseMigration, createTable } from "../../base-migration";


/* eslint-disable @typescript-eslint/no-explicit-any, @stylistic/object-property-newline, @stylistic/newline-per-chained-call */
export class V1_0_0_OwnedCard_Migration implements IBaseMigration {
  get keyName(): string {
    return "0021: v.1.0.0.OwnedCard";
  }

  up(db: Kysely<any>): Promise<void> {
    return createV1_0_0_OwnedCard(db)
      .then(() => createV1_0_0_OwnedCardCollectionMap(db));
  }

  down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("owned_card_collection_map").execute()
      .then(async () => await db.schema.dropTable("owned_card").execute());
  }
}

function createV1_0_0_OwnedCard(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    tableName: "owned_card",
    isSynced: false,
    primaryKeyType: "integer"
  };
  return createTable(db, options)
    .addColumn("card_id", "text", (cb: ColumnDefinitionBuilder) => cb.references("card.id").onDelete("cascade").notNull())
    .addColumn("condition_id", "text", (cb: ColumnDefinitionBuilder) => cb.references("card_condition.id").onDelete("cascade").notNull())
    .addColumn("is_foil", "integer", (cb: ColumnDefinitionBuilder) => cb.notNull())
    .addColumn("comments", "text")
    .addUniqueConstraint("CARD_ID_CONDITION_ID_IS_FOIL_UC", ["card_id", "condition_id", "is_foil"])
    .execute();
}

function createV1_0_0_OwnedCardCollectionMap(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    tableName: "owned_card_collection_map",
    isSynced: false,
    primaryKeyType: "custom",
    primaryKey: [
      { columnName: "owned_card_id", dataType: "integer", callback: (col: ColumnDefinitionBuilder) => col.references("owned_card.id").onDelete("cascade").notNull() },
      { columnName: "collection_id", dataType: "integer", callback: (col: ColumnDefinitionBuilder) => col.references("collection.id").onDelete("cascade").notNull() }
    ]
  };
  return createTable(db, options)
    .addColumn("quantity", "integer", (col: ColumnDefinitionBuilder) => col.notNull())
    .execute();
}
