import { CardLegality, GameFormat } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ScryfallCard } from "../../types";
import { IChildTableAdapter } from "./child-table.adapter";
import { IMapTableAdapter } from "./map-table.adapter";
import { INewTableAdapter, ITableAdapter } from "./table.adapter";


export type ICardCardMapAdapter = IMapTableAdapter<DatabaseSchema, "card_card_map">;
export type ICardColorMapAdapter = IMapTableAdapter<DatabaseSchema, "card_color_map">;
export type ICardGameAdapter = IChildTableAdapter<DatabaseSchema, "card_game">;
export type ICardImageAdapter = IChildTableAdapter<DatabaseSchema, "card_image">;
export type ICardMultiverseIdAdapter = IChildTableAdapter<DatabaseSchema, "card_multiverse_id">;
export type ICardSetAdapter = ITableAdapter<DatabaseSchema, "card_set">;
export type ICardAdapter = INewTableAdapter<"card", ScryfallCard>;
export type ICardfaceAdapter = IChildTableAdapter<DatabaseSchema, "cardface">;
export type ICardfaceColorMapAdapter = IMapTableAdapter<DatabaseSchema, "cardface_color_map">;
export type ICardfaceImageAdapter = IChildTableAdapter<DatabaseSchema, "cardface_image">;
export type ICatalogAdapter = ITableAdapter<DatabaseSchema, "catalog_item">;
export type IOracleRulingLineAdapter = IChildTableAdapter<DatabaseSchema, "oracle_ruling_line">;
export type IOracleRulingAdapter = ITableAdapter<DatabaseSchema, "oracle_ruling">;
export type ICardSymbolAlternativeAdapter = IChildTableAdapter<DatabaseSchema, "card_symbol_alternative">;
export type ICardSymbolColorMapAdapter = IMapTableAdapter<DatabaseSchema, "card_symbol_color_map">;
export type ICardSymbolAdapter = ITableAdapter<DatabaseSchema, "card_symbol">;
export type IOracleAdapter = INewTableAdapter<"oracle", OracleAdapterParameter>;
export type IOracleKeywordAdapter = INewTableAdapter<"oracle_keyword", OracleKeywordAdapterParameter>;
export type IOracleLegalityAdapter = INewTableAdapter<"oracle_legality", OracleLegalityAdapterParameter>;

export type OracleAdapterParameter = {
  faceName: string,
  scryfallCard: ScryfallCard
};

export type OracleKeywordAdapterParameter = {
  oracle_id: string,
  keywords: Array<string>
};

export type OracleLegalityAdapterParameter = {
  oracle_id: string,
  gameFormat: GameFormat,
  legality: CardLegality
};

const ADAPTTOKENS = Object.freeze({
  CardCardMapAdapter: "CardCardMapAdapter",
  CardColorMapAdapter: "CardColorMapAdapter",
  CardGameAdapter: "CardGameAdapter",
  CardImageAdapter: "CardImageAdapter",
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
  CardSymbolColorMapAdapter: "CardSymbolColorMapAdapter",
  OracleAdapter: "OracleAdapter",
  OracleKeywordAdapter: "OracleKeywordAdapter",
  OracleLegalityAdapter: "OracleLegalityAdapter",
});

export default ADAPTTOKENS;
