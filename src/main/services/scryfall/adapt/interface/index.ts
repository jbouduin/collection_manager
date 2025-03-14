import { IScryfallCardDto, IScryfallCardSetDto, IScryfallCardSymbolDto, IScryfallRulingDto } from "../../dto";
import {
  CardCardMapAdapterParameter, CardFaceAdapterParameter, CardGameAdapterParameter, CardMultiversIdAdapterParameter,
  CardSymbolAlternativeAdapterParam, CardSymbolColorMapAdapterParam,
  CardfaceColorMapAdapterParameter, CatalogAdapterParam,
  OracleAdapterParameter, OracleKeywordAdapterParameter, OracleLegalityAdapterParameter
} from "./param";
import { CardColorMapAdapterParameter } from "./param/card-color-map-adapter.param";

import { ITableAdapter } from "./table.adapter";


export type ICardSetAdapter = ITableAdapter<"card_set", IScryfallCardSetDto>;
export type ICatalogAdapter = ITableAdapter<"catalog_item", CatalogAdapterParam>;
export type ICardSymbolAdapter = ITableAdapter<"card_symbol", IScryfallCardSymbolDto>;
export type ICardSymbolAlternativeAdapter = ITableAdapter<"card_symbol_alternative", CardSymbolAlternativeAdapterParam>;
export type ICardSymbolColorMapAdapter = ITableAdapter<"card_symbol_color_map", CardSymbolColorMapAdapterParam>;

export type ICardAdapter = ITableAdapter<"card", IScryfallCardDto>;
export type ICardColorMapAdapter = ITableAdapter<"card_color_map", CardColorMapAdapterParameter>;
export type ICardGameAdapter = ITableAdapter<"card_game", CardGameAdapterParameter>;
export type ICardMultiverseIdAdapter = ITableAdapter<"card_multiverse_id", CardMultiversIdAdapterParameter>;
export type ICardfaceAdapter = ITableAdapter<"cardface", CardFaceAdapterParameter>;
export type ICardfaceColorMapAdapter = ITableAdapter<"cardface_color_map", CardfaceColorMapAdapterParameter>;

export type ICardCardMapAdapter = ITableAdapter<"card_card_map", CardCardMapAdapterParameter>;

export type IOracleAdapter = ITableAdapter<"oracle", OracleAdapterParameter>;
export type IOracleKeywordAdapter = ITableAdapter<"oracle_keyword", OracleKeywordAdapterParameter>;
export type IOracleLegalityAdapter = ITableAdapter<"oracle_legality", OracleLegalityAdapterParameter>;
export type IOracleRulingAdapter = ITableAdapter<"oracle_ruling", string>;
export type IOracleRulingLineAdapter = ITableAdapter<"oracle_ruling_line", IScryfallRulingDto>;
