import { ColumnType } from "kysely";
import { CatalogType } from "../../../../common/types";


export interface CatalogItemTable {
  /**
   * The catalog name
   *
   * @example LandTypes
   */
  catalog_name: ColumnType<CatalogType, string, never>;
  /**
   * The catalog Item value
   *
   * @example Island
   */
  item: ColumnType<string, string, never>;
}
