import { Card as ScryfallCard } from "scryfall-sdk";
import { Card } from "../../../../main/database/schema";

export interface ICardRepository {
  sync(cards: Array<ScryfallCard>): Promise<void>;
  getCardById(cardId: string): Promise<Card>;
}
