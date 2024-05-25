enum EQueryType {
  CardSet,
  CardSetCachedSvg,
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
