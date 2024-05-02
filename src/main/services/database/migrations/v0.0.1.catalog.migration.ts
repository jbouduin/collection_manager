import { ColumnDefinitionBuilder, Kysely } from 'kysely';
import { BaseMigration } from './base.migration';

export class V0_0_1_Catalog_Migration extends BaseMigration {

  public async up(db: Kysely<any>): Promise<void> {
    let builder = super.createTableWithBasicFields(db, 'catalog')
      .addColumn('name', 'text', (col: ColumnDefinitionBuilder) => col.notNull().unique());
    await super.addLastSynced(builder).execute();

    builder = super.createTableWithBasicFields(db, 'catalog_item')
      .addColumn('name', 'text', (col: ColumnDefinitionBuilder) => col.notNull())
      .addColumn('catalog_id', 'integer', (col: ColumnDefinitionBuilder) =>
        col.references('catalog.id').onDelete('cascade').notNull()
      );

    await super.addLastSynced(builder).execute();

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
