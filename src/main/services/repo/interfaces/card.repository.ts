import { Card as ScryfallCard } from "scryfall-sdk";

export interface ICardRepository {
  sync(cards: Array<ScryfallCard>): Promise<void>;
}
