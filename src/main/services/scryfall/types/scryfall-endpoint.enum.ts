enum EScryfallEndpoint  {
  card,
  cardSet,
  catalog,
  ruling
}

export type ScryfallEndpoint = keyof typeof EScryfallEndpoint;
