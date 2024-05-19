enum EScryfallEndpoint  {
  card,
  cardSet,
  cardSymbol,
  catalog,
  ruling
}

export type ScryfallEndpoint = keyof typeof EScryfallEndpoint;
