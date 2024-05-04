import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { SyncedTable } from "./synced.table";
import { CatalogType } from "../../../common/enums";

export interface CatalogItemTable extends SyncedTable{

  /***
   * The catalog name
   * @example LandTypes
   */
  catalog_name: ColumnType<CatalogType, string, never>;

  /***
   * The catalog Item value
   */
  item: ColumnType<string, string, never>;
}

export type CatalogItem = Selectable<CatalogItemTable>;
export type NewCatalogItem = Insertable<CatalogItemTable>;
export type UpdateCatalogItem = Updateable<CatalogItemTable>;
