import { Card as ScryfallCard } from "scryfall-sdk";

import { CardSelectDto } from "../../../../common/dto";
import { CardQueryOptions } from "../../../../common/ipc-params/card-query.options";
import { ProgressCallback } from "../../infra/implementation";

export interface ICardRepository {
  sync(cards: Array<ScryfallCard>, progressCallback?: ProgressCallback): Promise<void>;
  // TODO maybe this method can be removed
  getCardById(cardId: string): Promise<CardSelectDto>;
  getWithOptions(options: CardQueryOptions): Promise<Array<CardSelectDto>>
}
