import { DatabaseSchema } from "../../../database/schema";
import { IChildTableAdapter } from "./child-table.adapter";
import { IMapTableAdapter } from "./map-table.adapter";
import { ITableAdapter } from "./table.adapter";

export type ICardCardMapAdapter = IMapTableAdapter<DatabaseSchema, "card_card_map">;
export type ICardColorMapAdapter = IMapTableAdapter<DatabaseSchema, "card_color_map">;
export type ICardFormatLegalityAdapter = IChildTableAdapter<DatabaseSchema, "card_format_legality">;
export type ICardGameAdapter = IChildTableAdapter<DatabaseSchema, "card_game">;
export type ICardImageAdapter = IChildTableAdapter<DatabaseSchema, "card_image">;
export type ICardKeywordAdapter = IChildTableAdapter<DatabaseSchema, "card_keyword">;
export type ICardMultiverseIdAdapter = IChildTableAdapter<DatabaseSchema, "card_multiverse_id">;
export type ICardSetAdapter = ITableAdapter<DatabaseSchema, "card_set">;
export type ICardAdapter = ITableAdapter<DatabaseSchema, "card">;
export type ICardfaceAdapter = IChildTableAdapter<DatabaseSchema, "cardface">;
export type ICardfaceColorMapAdapter = IMapTableAdapter<DatabaseSchema, "cardface_color_map">;
export type ICardfaceImageAdapter = IChildTableAdapter<DatabaseSchema, "cardface_image">;
export type ICatalogAdapter = ITableAdapter<DatabaseSchema, "catalog_item">;
export type IRulingLineAdapter = IChildTableAdapter<DatabaseSchema, "ruling_line">;
export type IRulingAdapter = ITableAdapter<DatabaseSchema, "ruling">;
export type ISymbologyAlternativeAdapter = IChildTableAdapter<DatabaseSchema, "symbology_alternative">;
export type ISymbologyColorMapAdapter = IMapTableAdapter<DatabaseSchema, "symbology_color_map">;
export type ISymbologyAdapter = ITableAdapter<DatabaseSchema, "symbology">;

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
  RulingLineAdapter: "RulingLineAdapter",
  RulingAdapter: "RulingAdapter",
  SymbologyAdapter: "SymbologyAdapter",
  SymbologyAlternativeAdapter: "SymbologyAlternativeAdapter",
  SymbologyColorMapAdapter: "SymbologyColorMapAdapter"
});

export default ADAPTTOKENS;
