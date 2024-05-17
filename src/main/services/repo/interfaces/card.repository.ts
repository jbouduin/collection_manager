import { Card as ScryfallCard } from "scryfall-sdk";

import { CardImageSelectDto, CardSelectDto } from "../../../../common/dto";
import { CardQueryOptions } from "../../../../common/ipc-params/card-query.options";
import { ProgressCallback } from "../../../../common/ipc-params";
import { ImageType } from "../../../../common/enums";

export interface ICardRepository {
  // TODO maybe this method can be removed
  getCardById(cardId: string): Promise<CardSelectDto>;
  getCardImageData(cardId: string, imageType: ImageType): Promise<CardImageSelectDto>;
  getWithOptions(options: CardQueryOptions): Promise<Array<CardSelectDto>>;
}
