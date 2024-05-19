enum EScryfallUniqueStrategy {
  cards,
  art,
  prints,
}

export type ScryfallUniqueStrategy = keyof typeof EScryfallUniqueStrategy;
