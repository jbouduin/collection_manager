enum ERulingSyncType {
  none,
  update,
  all
}

export type RulingSyncType = keyof typeof ERulingSyncType;

export const RulingSyncTypeDisplayValue = new Map<RulingSyncType, string>([
  ["none", "Do not synchronize rulings"],
  ["update", "Resynchronize previously synchronized rulings only"],
  ["all", "Synchronize rulings for all synchronized cards"]
]);
