enum EScryfallEndpoint  {
  card,
  cardSet,
  cardSymbol,
  catalog,
  ruling,
  collection
}

export type ScryfallEndpoint = keyof typeof EScryfallEndpoint;
