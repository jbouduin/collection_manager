import { CatalogTable } from "./catalog.table";
import { CatalogItemTable } from "./catalog-item.table";

export interface DatabaseSchema {
  catalog: CatalogTable;
  catalogItem: CatalogItemTable;
}
