enum ESyncType {
  Card,
  CardSet,
  CardSymbol,
  Catalog,
  Ruling
}

export type SyncType = keyof typeof ESyncType;

export const SyncTypeDisplayValue = new Map<SyncType, string>([
  ["Card", "Cards"],
  ["CardSet", "Sets"],
  ["CardSymbol", "Symbols"],
  ["Catalog", "Catalogs"],
  ["Ruling", "Rulings"]
]);
