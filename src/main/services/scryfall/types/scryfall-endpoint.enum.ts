enum EScryfallEndpoint  {
  cards,
  cardSet,
  cardSymbol,
  catalog,
  collection,
  ruling,
  search
}

export type ScryfallEndpoint = keyof typeof EScryfallEndpoint;
