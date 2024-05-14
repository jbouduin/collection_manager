enum EQueryOrSyncType {
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

export type QueryOrSyncType = keyof typeof EQueryOrSyncType;
