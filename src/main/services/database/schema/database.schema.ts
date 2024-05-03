import { CatalogTable } from "./catalog.table";
import { CatalogItemTable } from "./catalog-item.table";
import { CardSetTable } from "./card-set.table";
import { Language } from "./language.table";

export interface DatabaseSchema {
  card_set: CardSetTable;
  catalog: CatalogTable;
  catalog_item: CatalogItemTable;
  language: Language
}
