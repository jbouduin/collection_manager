/* eslint-disable @typescript-eslint/no-unused-vars */
enum EScryfallUniqueStrategy {
  cards,
  art,
  prints
}

export type ScryfallUniqueStrategy = keyof typeof EScryfallUniqueStrategy;
