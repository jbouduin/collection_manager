import { Card as ScryfallCard } from "scryfall-sdk";

export interface ICardRepository {
  sync(cardSets: Array<ScryfallCard>): Promise<void>;
}
