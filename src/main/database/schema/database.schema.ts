import {
  CardTable, CardCardMapTable, CardColorMapTable, CardFormatLegalityTable, CardGameTable, CardImageTable, CardKeywordTable, CardMultiverseIdTable,
  CardSetTable, CatalogItemTable, ColorTable, LanguageTable, RulingTable,
  CardSymbolAlternativeTable, CardSymbolColorMapTable, CardSymbolTable,
  RulingLineTable,
  CardFaceTable,
  CardFaceImageTable,
  CardFaceColorMapTable
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
  cardface_color_map: CardFaceColorMapTable;
  cardface_image: CardFaceImageTable;
  cardface: CardFaceTable;
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

  //#region Card symbol -------------------------------------------------------
  card_symbol: CardSymbolTable;
  card_symbol_alternative: CardSymbolAlternativeTable;
  card_symbol_color_map: CardSymbolColorMapTable;
  //#endregion


}
