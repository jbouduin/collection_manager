import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { SyncedTable } from "./synced.table";

export interface CatalogItemTable extends SyncedTable{
  name: ColumnType<string, string, never>;
  catalog_id: ColumnType<string, string, never>;
}

export type CatalogItem = Selectable<CatalogItemTable>;
export type NewCatalogItem = Insertable<CatalogItemTable>;
export type UpdateCatalogItem = Updateable<CatalogItemTable>;
