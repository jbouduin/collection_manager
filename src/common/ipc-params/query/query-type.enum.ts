enum EQueryType {
  Asset,
  CardSet,
  CardSetDetails,
  Card,
  Catalog,
  Color,
  Configuration,
  Language,
  Legality,
  Ruling,
  CardSymbol,
  CardSymbolCachedSvg
}

export type QueryType = keyof typeof EQueryType;
