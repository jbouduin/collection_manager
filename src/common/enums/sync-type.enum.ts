enum ESyncType {
  CardSets,
  Cards,
  Catalogs
}

export type SyncType = keyof typeof ESyncType;
