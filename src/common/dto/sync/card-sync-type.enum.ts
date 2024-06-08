enum ECardSyncType {
  allCards,
  byCardSet,
  byImageStatus,
  byLastSynchronized,
  selectionOfCards,
}

export type CardSyncType = keyof typeof ECardSyncType;

export const CardSyncTypeDisplayValue = new Map<CardSyncType, string>([
  ["allCards", "All cards which have been synchronized before"],
  ["byCardSet", "By cardset"], // should not be shown in the front end
  ["byImageStatus", "With image status"],
  ["byLastSynchronized", "Last synchronized before"],
  ["selectionOfCards", "Selected cards"] // should not be shown in the front end
]);
