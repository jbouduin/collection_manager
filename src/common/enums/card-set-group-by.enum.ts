/* eslint-disable @typescript-eslint/no-unused-vars */
enum ECardSetGroupBy {
  none,
  parent,
  block,
  setType
}

export type CardSetGroupBy = keyof typeof ECardSetGroupBy;

export const CardSetGroupByDisplayValue = new Map<CardSetGroupBy, string>([
  ["none", "No grouping"],
  ["parent", "Parent"],
  ["block", "Block"],
  ["setType", "Set type"]
]);
