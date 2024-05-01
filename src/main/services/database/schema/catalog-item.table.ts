import { Insertable, Selectable, Updateable } from 'kysely';
import { SyncedTable } from './synced.table';

export interface CatalogItemTable extends SyncedTable{
  name: string;
  catalog_id: bigint;
}

export type CatalogItem = Selectable<CatalogItemTable>
export type NewCatalogItem = Insertable<CatalogItemTable>
export type UpdateCatalogItem = Updateable<CatalogItemTable>
