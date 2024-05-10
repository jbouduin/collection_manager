import { Card as ScryfallCard } from "scryfall-sdk";

import { CardSelectDto } from "../../../../common/dto";
import { CardQueryOptions } from "../../../../common/ipc-params/card-query.options";

export interface ICardRepository {
  sync(cards: Array<ScryfallCard>): Promise<void>;
  // TODO remove this method
  getCardById(cardId: string): Promise<CardSelectDto>;
  getWithOptions(options: CardQueryOptions): Promise<Array<CardSelectDto>>
}
