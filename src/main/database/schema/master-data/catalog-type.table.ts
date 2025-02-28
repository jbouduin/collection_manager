import { ColumnType } from "kysely";
import { CatalogType } from "../../../../common/types";
import { Synchronized } from "../base.types";

export interface CatalogTypeTable extends Synchronized {
  catalog_name: ColumnType<CatalogType, CatalogType, never>;
  display_label: ColumnType<string>;
  is_used: ColumnType<boolean, number, number>;
}
