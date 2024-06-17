enum EQueryType {
  Asset,
  CardSet,
  CardSetDetails,
  Card,
  Catalog,
  Color,
  Collection,
  Configuration,
  Language,
  Legality,
  Ruling,
  CardSymbol,
  CardSymbolCachedSvg
}

export type QueryType = keyof typeof EQueryType;
