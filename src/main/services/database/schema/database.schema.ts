import { CatalogTable } from "./catalog.table";
import { CatalogItemTable } from "./catalog-item.table";

export interface DatabaseSchema {
  catalog: CatalogTable;
  catalog_item: CatalogItemTable;
}
