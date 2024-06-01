enum EQueryType {
  Asset,
  CardSet,
  Card,
  Catalog,
  Color,
  Language,
  Legality,
  Ruling,
  CardSymbol,
  CardSymbolCachedSvg
}

export type QueryType = keyof typeof EQueryType;
