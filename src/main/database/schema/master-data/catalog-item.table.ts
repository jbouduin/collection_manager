import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { CatalogType } from "../../../../common/enums";
import { SynchronizedWithStringId } from "../base.types";

// TODO create a synchronized table catalog and fill it in the migration
// make this one a child of it and non synchronized as we delete them
export interface CatalogItemTable extends SynchronizedWithStringId{
  /***
   * The catalog name
   *
   * @example LandTypes
   */
  catalog_name: ColumnType<CatalogType, string, never>;

  /***
   * The catalog Item value
   *
   * @example Island
   */
  item: ColumnType<string, string, never>;
}

export type CatalogItem = Selectable<CatalogItemTable>;
export type NewCatalogItem = Insertable<CatalogItemTable>;
export type UpdateCatalogItem = Updateable<CatalogItemTable>;
