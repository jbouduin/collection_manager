import {
  CardTable, CardCardMapTable, CardGameTable, CardMultiverseIdTable,
  CardfaceTable, CardFaceColorMapTable,
  OracleTable, OracleKeywordTable, OracleLegalityTable, OracleRulingTable, OracleRulingLineTable,
  CardSetTable, CatalogItemTable, ColorTable, LanguageTable,
  CardSymbolAlternativeTable, CardSymbolColorMapTable, CardSymbolTable,
  CardColorMapTable
} from ".";



export interface DatabaseSchema {
  //#region card --------------------------------------------------------------
  card: CardTable;
  card_multiverse_id: CardMultiverseIdTable;
  card_game: CardGameTable;
  card_color_map: CardColorMapTable;
  cardface: CardfaceTable;
  cardface_color_map: CardFaceColorMapTable;
  card_card_map: CardCardMapTable;
  //#endregion

  //#region oracle-------------------------------------------------------------
  oracle: OracleTable;
  oracle_keyword: OracleKeywordTable;
  oracle_legality: OracleLegalityTable;
  oracle_ruling: OracleRulingTable;
  oracle_ruling_line: OracleRulingLineTable;
  //#endregion

  //#region master data -------------------------------------------------------
  card_set: CardSetTable;
  catalog_item: CatalogItemTable;
  color: ColorTable,
  language: LanguageTable;
  //#endregion

  //#region Card symbol -------------------------------------------------------
  card_symbol: CardSymbolTable;
  card_symbol_alternative: CardSymbolAlternativeTable;
  card_symbol_color_map: CardSymbolColorMapTable;
  //#endregion

}
