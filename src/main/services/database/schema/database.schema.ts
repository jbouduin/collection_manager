import { CatalogItemTable } from "./catalog-item.table";
import { CardSetTable } from "./card-set.table";
import { LanguageTable } from "./language.table";
import { SymbologyTable } from "./symbology.table";
import { ColorTable } from "./color.table";
import { SymbologyColorMapTable } from "./symbology-color.map";
import { SymbologyAlternativeTable } from "./symbology-alternative.table";

export interface DatabaseSchema {
  card_set: CardSetTable;
  catalog_item: CatalogItemTable;
  color: ColorTable,
  language: LanguageTable;
  symbology: SymbologyTable;
  symbology_alternative: SymbologyAlternativeTable;
  symbology_color_map: SymbologyColorMapTable;
}
