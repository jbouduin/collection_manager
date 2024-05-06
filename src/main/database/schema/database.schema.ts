import {
  CardTable, CardCardMapTable, CardColorMapTable, CardFormatLegalityTable, CardGameTable, CardImageTable, CardKeywordTable, CardMultiverseIdTable,
  CardSetTable, CatalogItemTable, ColorTable, LanguageTable, RulingTable,
  SymbologyAlternativeTable, SymbologyColorMapTable, SymbologyTable,
  RulingLineTable
} from ".";
import {  } from "./card/card-key-word.table";


export interface DatabaseSchema {
  //#region card --------------------------------------------------------------
  card: CardTable;
  card_card_map: CardCardMapTable;
  card_color_map: CardColorMapTable;
  card_format_legality: CardFormatLegalityTable;
  card_game: CardGameTable;
  card_image: CardImageTable;
  card_keyword: CardKeywordTable;
  card_multiverse_id: CardMultiverseIdTable;
  //#endregion

  //#region master data -------------------------------------------------------
  card_set: CardSetTable;
  catalog_item: CatalogItemTable;
  color: ColorTable,
  language: LanguageTable;
  //#endregion

  //#region ruling ------------------------------------------------------------
  ruling: RulingTable;
  ruling_line: RulingLineTable;
  //#endregion

  //#region Symbology ---------------------------------------------------------
  symbology: SymbologyTable;
  symbology_alternative: SymbologyAlternativeTable;
  symbology_color_map: SymbologyColorMapTable;
  //#endregion


}
