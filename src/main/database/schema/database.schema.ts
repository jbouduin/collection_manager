import {
  CardTable, CardCardMapTable, OracleLegalityTable, CardGameTable, CardMultiverseIdTable,
  CardSetTable, CatalogItemTable, ColorTable, LanguageTable, OracleRulingTable,
  CardSymbolAlternativeTable, CardSymbolColorMapTable, CardSymbolTable,
  OracleRulingLineTable,
  CardFaceTable,
  CardFaceLocalizationImageTable,
  CardFaceColorMapTable,
  CardFaceLocalizationTable
} from ".";
import { OracleKeywordTable } from "./oracle/oracle-key-word.table";
import { OracleTable } from "./oracle/oracle.table";


export interface DatabaseSchema {
  //#region card --------------------------------------------------------------
  card: CardTable;
  card_multiverse_id: CardMultiverseIdTable;
  card_game: CardGameTable;
  cardface: CardFaceTable;
  cardface_color_map: CardFaceColorMapTable;
  cardface_localization: CardFaceLocalizationTable;
  cardface_localization_image: CardFaceLocalizationImageTable;
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
