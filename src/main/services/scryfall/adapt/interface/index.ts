import { CardLegality, Game, GameFormat, MTGColor, MTGColorType } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { ScryfallCard } from "../../types";
import { IChildTableAdapter } from "./child-table.adapter";
import { IMapTableAdapter } from "./map-table.adapter";
import { INewTableAdapter, ITableAdapter } from "./table.adapter";


export type ICardCardMapAdapter = IMapTableAdapter<DatabaseSchema, "card_card_map">;
export type ICardSetAdapter = ITableAdapter<DatabaseSchema, "card_set">;
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
export type ICardfaceAdapter = INewTableAdapter<"cardface", CardFaceAdapterParameter>;
export type ICardfaceColorMapAdapter = INewTableAdapter<"cardface_color_map", CardfaceColorMapAdapterParameter>;
export type ICardfaceLocalizationAdapter = INewTableAdapter<"cardface_localization", CardfaceLocalizationAdapterParameter>;
export type ICardfaceLocalizationImageAdapter = INewTableAdapter<"cardface_localization_image", CardfaceLocalizationImageAdapterParameter>;

export type CardfaceLocalizationImageAdapterParameter = {
  cardfaceLocalizationId: string,
  scryfallCard: ScryfallCard
}

export type CardfaceLocalizationAdapterParameter = {
  uuid: string,
  cardfaceId: string,
  scryfallCard: ScryfallCard
}

export type CardfaceColorMapAdapterParameter = {
  cardfaceId: string,
  colorType:  MTGColorType,
  colors: Array<MTGColor>
}
export type CardFaceAdapterParameter = {
  uuid: string,
  faceName: string,
  scryfallCard: ScryfallCard
}

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
  CardSetAdapter: "CardSetAdapter",

  CardAdapter: "CardAdapter",
  CardGameAdapter: "CardGameAdapter",
  CardMultiverseIdAdapter: "CardMultiverseIdAdapter",
  CardfaceAdapter: "CardfaceAdapter",
  CardfaceColorMapAdapter: "CardfaceColorMapAdapter",
  CardfaceLocalizationAdapter: "CardfaceLocalizationAdapter",
  CardfaceLocalizationImageAdapter: "CardfaceLocalizationImageAdapter",
  CardCardMapAdapter: "CardCardMapAdapter",

  OracleAdapter: "OracleAdapter",
  OracleKeywordAdapter: "OracleKeywordAdapter",
  OracleLegalityAdapter: "OracleLegalityAdapter",
  OracleRulingLineAdapter: "OracleRulingLineAdapter",
  OracleRulingAdapter: "OracleRulingAdapter",

  CatalogAdapter: "CatalogAdapter",
  ColorAdapter: "ColorAdapter",
  LanguageAdapter: "LanguageAdapter",
  CardSymbolAdapter: "CardSymbolAdapter",
  CardSymbolAlternativeAdapter: "CardSymbolAlternativeAdapter",
  CardSymbolColorMapAdapter: "CardSymbolColorMapAdapter",

});

export default ADAPTTOKENS;
