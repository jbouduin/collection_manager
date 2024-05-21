import { CardLegality, Game, GameFormat } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ScryfallCard } from "../../types";
import { IChildTableAdapter } from "./child-table.adapter";
import { IMapTableAdapter } from "./map-table.adapter";
import { INewTableAdapter, ITableAdapter } from "./table.adapter";


export type ICardCardMapAdapter = IMapTableAdapter<DatabaseSchema, "card_card_map">;
export type ICardColorMapAdapter = IMapTableAdapter<DatabaseSchema, "card_color_map">;
export type ICardImageAdapter = IChildTableAdapter<DatabaseSchema, "card_image">;
export type ICardSetAdapter = ITableAdapter<DatabaseSchema, "card_set">;
export type ICardfaceAdapter = IChildTableAdapter<DatabaseSchema, "cardface">;
export type ICardfaceColorMapAdapter = IMapTableAdapter<DatabaseSchema, "cardface_color_map">;
export type ICardfaceImageAdapter = IChildTableAdapter<DatabaseSchema, "cardface_image">;
export type ICatalogAdapter = ITableAdapter<DatabaseSchema, "catalog_item">;
export type IOracleRulingLineAdapter = IChildTableAdapter<DatabaseSchema, "oracle_ruling_line">;
export type IOracleRulingAdapter = ITableAdapter<DatabaseSchema, "oracle_ruling">;
export type ICardSymbolAlternativeAdapter = IChildTableAdapter<DatabaseSchema, "card_symbol_alternative">;
export type ICardSymbolColorMapAdapter = IMapTableAdapter<DatabaseSchema, "card_symbol_color_map">;
export type ICardSymbolAdapter = ITableAdapter<DatabaseSchema, "card_symbol">;

export type ICardAdapter = INewTableAdapter<"card", ScryfallCard>;
export type IOracleAdapter = INewTableAdapter<"oracle", OracleAdapterParameter>;
export type IOracleKeywordAdapter = INewTableAdapter<"oracle_keyword", OracleKeywordAdapterParameter>;
export type IOracleLegalityAdapter = INewTableAdapter<"oracle_legality", OracleLegalityAdapterParameter>;
export type ICardGameAdapter = INewTableAdapter<"card_game", CardGameAdapterParameter>;
export type ICardMultiverseIdAdapter = INewTableAdapter<"card_multiverse_id", CardMultiversIdAdapterParameter>;


export type CardMultiversIdAdapterParameter = {
  card_id: string;
  multiverseIds: Array<number>
}

export type CardGameAdapterParameter = {
  card_id: string;
  games: Array<Game>;
}

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
  CardImageAdapter: "CardImageAdapter",
  CardSetAdapter: "CardSetAdapter",
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

  CardAdapter: "CardAdapter",
  OracleAdapter: "OracleAdapter",
  OracleKeywordAdapter: "OracleKeywordAdapter",
  OracleLegalityAdapter: "OracleLegalityAdapter",
  CardGameAdapter: "CardGameAdapter",
  CardMultiverseIdAdapter: "CardMultiverseIdAdapter",
});

export default ADAPTTOKENS;
