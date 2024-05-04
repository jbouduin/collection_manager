import {
  CardCardMap, CardColorMap, CardFormatLegalityTable, CardGameTable, CardImageTable, CardMultiverseIdTable, CardRulingMap,
  CardSetTable, CatalogItemTable, ColorTable, LanguageTable, RulingTable,
  SymbologyAlternativeTable, SymbologyColorMapTable, SymbologyTable
} from ".";


export interface DatabaseSchema {
  //#region card --------------------------------------------------------------
  card_card_map: CardCardMap;
  card_color_map: CardColorMap;
  card_format_legality: CardFormatLegalityTable;
  card_game: CardGameTable;
  card_image: CardImageTable;
  card_multiverse_id: CardMultiverseIdTable;
  card_ruling_map: CardRulingMap;
  //#endregion

  //#region master data -------------------------------------------------------
  card_set: CardSetTable;
  catalog_item: CatalogItemTable;
  color: ColorTable,
  language: LanguageTable;
  ruling: RulingTable
  //#endregion

  //#region Symbology ---------------------------------------------------------
  symbology: SymbologyTable;
  symbology_alternative: SymbologyAlternativeTable;
  symbology_color_map: SymbologyColorMapTable;
  //#endregion


}
