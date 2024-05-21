import { DatabaseSchema } from "../../../../database/schema";
import { ScryfallCard } from "../../types";
import { IChildTableAdapter } from "./child-table.adapter";
import { IMapTableAdapter } from "./map-table.adapter";
import { INewTableAdapter, ITableAdapter } from "./table.adapter";

export type ICardCardMapAdapter = IMapTableAdapter<DatabaseSchema, "card_card_map">;
export type ICardColorMapAdapter = IMapTableAdapter<DatabaseSchema, "card_color_map">;
export type ICardFormatLegalityAdapter = IChildTableAdapter<DatabaseSchema, "card_format_legality">;
export type ICardGameAdapter = IChildTableAdapter<DatabaseSchema, "card_game">;
export type ICardImageAdapter = IChildTableAdapter<DatabaseSchema, "card_image">;
// export type ICardKeywordAdapter = IChildTableAdapter<DatabaseSchema, "card_keyword">;
export type ICardMultiverseIdAdapter = IChildTableAdapter<DatabaseSchema, "card_multiverse_id">;
export type ICardSetAdapter = ITableAdapter<DatabaseSchema, "card_set">;
export type ICardAdapter = INewTableAdapter<DatabaseSchema, "card", ScryfallCard>;
export type ICardfaceAdapter = IChildTableAdapter<DatabaseSchema, "cardface">;
export type ICardfaceColorMapAdapter = IMapTableAdapter<DatabaseSchema, "cardface_color_map">;
export type ICardfaceImageAdapter = IChildTableAdapter<DatabaseSchema, "cardface_image">;
export type ICatalogAdapter = ITableAdapter<DatabaseSchema, "catalog_item">;
export type IOracleRulingLineAdapter = IChildTableAdapter<DatabaseSchema, "oracle_ruling_line">;
export type IOracleRulingAdapter = ITableAdapter<DatabaseSchema, "oracle_ruling">;
export type ICardSymbolAlternativeAdapter = IChildTableAdapter<DatabaseSchema, "card_symbol_alternative">;
export type ICardSymbolColorMapAdapter = IMapTableAdapter<DatabaseSchema, "card_symbol_color_map">;
export type ICardSymbolAdapter = ITableAdapter<DatabaseSchema, "card_symbol">;

const ADAPTTOKENS = Object.freeze({
  CardCardMapAdapter: "CardCardMapAdapter",
  CardColorMapAdapter: "CardColorMapAdapter",
  CardFormatLegalityAdapter: "CardFormatLegalityAdapter",
  CardGameAdapter: "CardGameAdapter",
  CardImageAdapter: "CardImageAdapter",
  CardKeywordAdapter: "CardKeywordAdapter",
  CardMultiverseIdAdapter: "CardMultiverseIdAdapter",
  CardSetAdapter: "CardSetAdapter",
  CardAdapter: "CardAdapter",
  CardfaceAdapter: "CardfaceAdapter",
  CardfaceColorMapAdapter: "CardfaceColorMapAdapter",
  CardfaceImageAdapter: "CardfaceImageAdapter",
  CatalogAdapter: "CatalogAdapter",
  ColorAdapter: "ColorAdapter",
  LanguageAdapter: "LanguageAdapter",
  OracleRulingLineAdapter: "OracleRulingLineAdapter",
  OracleRulingAdapter: "OracleRulingAdapter",
  CardSymbolAdapter: "CardSymbolAdapter",
  CardSymbolAlternativeAdapter: "CardSymbolAlternativeAdapter",
  CardSymbolColorMapAdapter: "CardSymbolColorMapAdapter"
});

export default ADAPTTOKENS;
