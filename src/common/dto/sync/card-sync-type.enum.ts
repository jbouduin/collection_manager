enum ECardSyncType {
  none,
  allCards,
  byCardSet,
  byImageStatus,
  byLastSynchronized,
  collection,
  // FEATURE: bulk
}

export type CardSyncType = keyof typeof ECardSyncType;

export const CardSyncTypeDisplayValue = new Map<CardSyncType, string>([
  ["none", "Do not synchronize cards"],
  ["allCards", "All cards which have previously been synchronized"],
  // "byCardSet" => not to be shown in the front end
  ["byImageStatus", "Select by image status"],
  ["byLastSynchronized", "Last synchronized before"],
  // "selectionOfCards" => not to be shown in the front end
]);
