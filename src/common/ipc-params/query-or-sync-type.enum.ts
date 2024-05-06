enum EQueryOrSyncType {
  CardSet,
  Card,
  Catalog,
  Color,
  Language,
  Ruling,
  Symbology
}

export type QueryOrSyncType = keyof typeof EQueryOrSyncType;
