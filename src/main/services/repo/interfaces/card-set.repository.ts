import { Set as ScryfallSet } from "scryfall-sdk";

import { CardSetSelectDto } from "../../../../common/dto";

export interface ICardSetRepository {
  getAll(): Promise<Array<CardSetSelectDto>>;
  sync(cardSets: Array<ScryfallSet>): Promise<void>;
}
