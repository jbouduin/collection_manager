enum ESyncType {
  CardSets,
  Cards,
  Catalogs,
  Symbology
}

export type SyncType = keyof typeof ESyncType;
