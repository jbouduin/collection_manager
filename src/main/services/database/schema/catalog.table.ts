import { Insertable, Selectable, Updateable } from 'kysely';
import { SyncedTable } from './synced.table';

export interface CatalogTable extends SyncedTable{
  name: string;
}

export type Catalog = Selectable<CatalogTable>
export type NewCatalog = Insertable<CatalogTable>
export type UpdateCatalog = Updateable<CatalogTable>
