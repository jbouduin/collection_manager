enum EQueryType {
  CardSet,
  CardSetCachedSvg,
  Card,
  Catalog,
  Color,
  Language,
  Ruling,
  CardSymbol,
  CardSymbolCachedSvg
}

export type QueryType = keyof typeof EQueryType;
