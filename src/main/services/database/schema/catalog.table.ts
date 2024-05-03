import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { SyncedTable } from "./synced.table";
import { CatalogType } from "../../../../common/enums";

export interface CatalogTable extends SyncedTable{
  name: ColumnType<CatalogType, CatalogType, never>;
}

export type Catalog = Selectable<CatalogTable>;
export type NewCatalog = Insertable<CatalogTable>;
export type UpdateCatalog = Updateable<CatalogTable>;
