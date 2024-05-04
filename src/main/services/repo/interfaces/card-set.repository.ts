import { Set as ScryfallSet } from "scryfall-sdk";

export interface ICardSetRepository {
  sync(cardSets: Array<ScryfallSet>): Promise<void>;
}
