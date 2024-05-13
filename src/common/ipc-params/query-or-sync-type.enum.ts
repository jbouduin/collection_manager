enum EQueryOrSyncType {
  CardSet,
  Card,
  Catalog,
  Color,
  Language,
  Ruling,
  Symbology,
  // NOW: type of cached svg should be in the options
  SymbologyCachedSvg
}

export type QueryOrSyncType = keyof typeof EQueryOrSyncType;
