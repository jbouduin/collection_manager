/* eslint-disable @typescript-eslint/no-unused-vars */
enum EScryfallEndpoint {
  cards,
  cardSet,
  cardSymbol,
  catalog,
  collection,
  ruling,
  search
}

export type ScryfallEndpoint = keyof typeof EScryfallEndpoint;
