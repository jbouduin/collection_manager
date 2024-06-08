enum ERulingTypeSync {
  none,
  update,
  all
}

export type RulingTypeSync = keyof typeof ERulingTypeSync;

export const RulingTypeSyncDisplayValue = new Map<RulingTypeSync, string>([
  ["none", "Do not sync rulings"],
  ["update", "Update previously downloaded rulings"],
  ["all", "Synchronize rulings for all cards"]
]);
