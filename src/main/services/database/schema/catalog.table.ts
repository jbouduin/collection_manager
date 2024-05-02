import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { SyncedTable } from "./synced.table";

export interface CatalogTable extends SyncedTable{
  name: ColumnType<string, string, never>;
}

export type Catalog = Selectable<CatalogTable>;
export type NewCatalog = Insertable<CatalogTable>;
export type UpdateCatalog = Updateable<CatalogTable>;
