/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDefinitionBuilder, Insertable, InsertResult, Kysely } from "kysely";
import { createTable, CreateTableOptions, IBaseMigration } from "../base-migration";
import { CatalogTypeTable } from "../../schema";
import { sqliteUTCTimeStamp } from "../../../../common/util";

export class V0_0_1_Catalog_Migration implements IBaseMigration {
  public get keyName(): string {
    return "0001: v.0.0.1.Catalog";
  }

  public async up(db: Kysely<any>): Promise<void> {
    return createV0_0_1_CatalogType(db)
      .then(async () => await populateV0_0_1_CatalogType(db))
      .then(async () => await createV0_0_1_CatalogItem(db));
  }

  public async down(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("catalog_item").execute()
      .then(async () => await db.schema.dropTable("catalog_item").execute());
  }
}

async function createV0_0_1_CatalogType(db: Kysely<any>): Promise<void> {
  const options: CreateTableOptions = {
    isSynced: true,
    tableName: "catalog_type",
    primaryKeyType: "custom",
    primaryKey: [{ columnName: "catalog_name", dataType: "text", callback: (col: ColumnDefinitionBuilder) => col.notNull() }]
  };
  await createTable(db, options)
    .addColumn("display_label", "text", (col: ColumnDefinitionBuilder) => col.notNull())
    .execute();
}

async function populateV0_0_1_CatalogType(db: Kysely<any>): Promise<Array<InsertResult>> {
  const values = new Array<Insertable<CatalogTypeTable>>();
  const now = sqliteUTCTimeStamp();
  values.push({ created_at: now, catalog_name: "card-names", display_label: "Non-token English card names" });
  values.push({ created_at: now, catalog_name: "artist-names", display_label: "Artist names" });
  values.push({ created_at: now, catalog_name: "word-bank", display_label: "Words that could appear in a card name" });
  values.push({ created_at: now, catalog_name: "supertypes", display_label: "Super types" });
  values.push({ created_at: now, catalog_name: "card-types", display_label: "Super types" });
  values.push({ created_at: now, catalog_name: "artifact-types", display_label: "Artifact types" });
  values.push({ created_at: now, catalog_name: "battle-types", display_label: "Super types" });
  values.push({ created_at: now, catalog_name: "creature-types", display_label: "Creature types" });
  values.push({ created_at: now, catalog_name: "enchantment-types", display_label: "Enchantment types" });
  values.push({ created_at: now, catalog_name: "land-types", display_label: "land-types" });
  values.push({ created_at: now, catalog_name: "planeswalker-types", display_label: "Planeswalker-types" });
  values.push({ created_at: now, catalog_name: "spell-types", display_label: "Spell types" });
  values.push({ created_at: now, catalog_name: "powers", display_label: "Powers" });
  values.push({ created_at: now, catalog_name: "toughnesses", display_label: "Thoughnesses" });
  values.push({ created_at: now, catalog_name: "loyalties", display_label: "loyalties" });
  values.push({ created_at: now, catalog_name: "keyword-abilities", display_label: "Ability keywords" });
  values.push({ created_at: now, catalog_name: "keyword-actions", display_label: "Action keywords" });
  values.push({ created_at: now, catalog_name: "ability-words", display_label: "Abilities" });
  values.push({ created_at: now, catalog_name: "flavor-words", display_label: "Flavor words" });
  values.push({ created_at: now, catalog_name: "watermarks", display_label: "Watermarks" });

  return db.insertInto("catalog_type")
    .values(values)
    .execute();
}

async function createV0_0_1_CatalogItem(db: Kysely<any>): Promise<void> {
  await db.schema.createTable("catalog_item")
    .addColumn("catalog_name", "text", (col: ColumnDefinitionBuilder) => col.notNull().references("catalog_type.catalog_name"))
    .addColumn("item", "text", (col: ColumnDefinitionBuilder) => col.notNull().notNull())
    .addPrimaryKeyConstraint("CATALOG_ITEM_PK", ["catalog_name", "item"])
    .execute();
}
