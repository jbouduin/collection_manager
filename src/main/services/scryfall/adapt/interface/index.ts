import { ScryfallCard, ScryfallCardSet, ScryfallCardSymbol, ScryfallRuling } from "../../types";
import {
  CardCardMapAdapterParameter, CardFaceAdapterParameter, CardGameAdapterParameter, CardMultiversIdAdapterParameter,
  CardSymbolAlternativeAdapterParam, CardSymbolColorMapAdapterParam,
  CardfaceColorMapAdapterParameter, CardfaceImageAdapterParameter, CatalogAdapterParam,
  OracleAdapterParameter, OracleKeywordAdapterParameter, OracleLegalityAdapterParameter
} from "./param";

import { ITableAdapter } from "./table.adapter";


export type ICardSetAdapter = ITableAdapter<"card_set", ScryfallCardSet>;
export type ICatalogAdapter = ITableAdapter<"catalog_item",CatalogAdapterParam>;
export type ICardSymbolAdapter = ITableAdapter<"card_symbol", ScryfallCardSymbol>;
export type ICardSymbolAlternativeAdapter = ITableAdapter<"card_symbol_alternative", CardSymbolAlternativeAdapterParam>;
export type ICardSymbolColorMapAdapter = ITableAdapter<"card_symbol_color_map", CardSymbolColorMapAdapterParam>;

export type ICardAdapter = ITableAdapter<"card", ScryfallCard>;
export type ICardGameAdapter = ITableAdapter<"card_game", CardGameAdapterParameter>;
export type ICardMultiverseIdAdapter = ITableAdapter<"card_multiverse_id", CardMultiversIdAdapterParameter>;
export type ICardfaceAdapter = ITableAdapter<"cardface", CardFaceAdapterParameter>;
export type ICardfaceColorMapAdapter = ITableAdapter<"cardface_color_map", CardfaceColorMapAdapterParameter>;
export type ICardfaceImageAdapter = ITableAdapter<"cardface_image", CardfaceImageAdapterParameter>;
export type ICardCardMapAdapter = ITableAdapter<"card_card_map", CardCardMapAdapterParameter>;

export type IOracleAdapter = ITableAdapter<"oracle", OracleAdapterParameter>;
export type IOracleKeywordAdapter = ITableAdapter<"oracle_keyword", OracleKeywordAdapterParameter>;
export type IOracleLegalityAdapter = ITableAdapter<"oracle_legality", OracleLegalityAdapterParameter>;
export type IOracleRulingAdapter = ITableAdapter<"oracle_ruling", string>;
export type IOracleRulingLineAdapter = ITableAdapter<"oracle_ruling_line", ScryfallRuling>;

const ADAPTTOKENS = Object.freeze({
  CardSetAdapter: "CardSetAdapter",
  CatalogAdapter: "CatalogAdapter",

  CardSymbolAdapter: "CardSymbolAdapter",
  CardSymbolAlternativeAdapter: "CardSymbolAlternativeAdapter",
  CardSymbolColorMapAdapter: "CardSymbolColorMapAdapter",

  CardAdapter: "CardAdapter",
  CardGameAdapter: "CardGameAdapter",
  CardMultiverseIdAdapter: "CardMultiverseIdAdapter",
  CardfaceAdapter: "CardfaceAdapter",
  CardfaceColorMapAdapter: "CardfaceColorMapAdapter",
  CardfaceImageAdapter: "CardfaceImageAdapter",
  CardCardMapAdapter: "CardCardMapAdapter",

  OracleAdapter: "OracleAdapter",
  OracleKeywordAdapter: "OracleKeywordAdapter",
  OracleLegalityAdapter: "OracleLegalityAdapter",
  OracleRulingLineAdapter: "OracleRulingLineAdapter",
  OracleRulingAdapter: "OracleRulingAdapter"
});

export default ADAPTTOKENS;
