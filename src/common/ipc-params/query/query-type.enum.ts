enum EQueryType {
  CardSet,
  CardSetCachedSvg,
  Card,
  Catalog,
  Color,
  Language,
  Ruling,
  Symbology,
  SymbologyCachedSvg
}

export type QueryType = keyof typeof EQueryType;
