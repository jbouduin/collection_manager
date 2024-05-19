enum ESyncType {
  Card,
  CardSet,
  CardSymbol,
  Catalog,
  Ruling
}

export type SyncType = keyof typeof ESyncType;
