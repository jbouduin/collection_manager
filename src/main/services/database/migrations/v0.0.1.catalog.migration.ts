import { ColumnDefinitionBuilder, Kysely } from 'kysely';
import { BaseMigration } from './base.migration';

export class V0_0_1_Catalog_Migration extends BaseMigration {

  public async up(db: Kysely<any>): Promise<void> {
    await super.createSyncedTable(db, 'catalog')
      .addColumn('name', 'text', (col: ColumnDefinitionBuilder) => col.notNull().unique())
      .execute();

    await super.createSyncedTable(db, 'catalog_item')
      .addColumn('catalog_id', 'text', (col: ColumnDefinitionBuilder) => col.references('catalog.id').onDelete('cascade').notNull())
      .addColumn('name', 'text', (col: ColumnDefinitionBuilder) => col.notNull())
      .execute();

    await db.schema
      .createIndex('catalog_item_catalog_id_idx')
      .on('catalog_item')
      .column('catalog_id')
      .execute();

    await db.schema
      .createIndex('catalog_item_catalog_id_name_unique_idx')
      .on('catalog_item')
      .columns(['catalog_id', 'name'])
      .unique()
      .execute();
  }

  public async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('catalogItem').execute();
    await db.schema.dropTable('catalog').execute();
  }
}
