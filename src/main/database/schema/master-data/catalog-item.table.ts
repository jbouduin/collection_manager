import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { CatalogType } from "../../../../common/enums";
import { SynchronizedWithStringId } from "../base.types";

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
