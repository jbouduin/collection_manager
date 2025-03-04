
import { CardCardMapTable, CardColorMapTable, CardFaceColorMapTable, CardfaceTable, CardGameTable, CardMultiverseIdTable, CardTable } from "./card";
import { CardSymbolAlternativeTable, CardSymbolColorMapTable, CardSymbolTable } from "./card-symbol";
import { CardConditionTable, CollectionTable, OwnedCardCollectionMapTable, OwnedCardTable } from "./collection";
import { DeckCardTable, DeckTable } from "./deck";
import { CardSetTable, CatalogItemTable, CatalogTypeTable, ColorTable, LanguageTable } from "./master-data";
import { OracleKeywordTable, OracleLegalityTable, OracleRulingLineTable, OracleRulingTable, OracleTable } from "./oracle";


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
  catalog_type: CatalogTypeTable;
  color: ColorTable;
  language: LanguageTable;
  //#endregion

  //#region Card symbol -------------------------------------------------------
  card_symbol: CardSymbolTable;
  card_symbol_alternative: CardSymbolAlternativeTable;
  card_symbol_color_map: CardSymbolColorMapTable;
  //#endregion

  //#region Collection --------------------------------------------------------
  card_condition: CardConditionTable;
  collection: CollectionTable;
  owned_card: OwnedCardTable;
  owned_card_collection_map: OwnedCardCollectionMapTable;
  //#endregion

  //#region Deck --------------------------------------------------------------
  deck: DeckTable;
  deck_card: DeckCardTable;
  //#endregion
}
