
import { CardDto, CardImageDto } from "../../../../common/dto";
import { ImageType } from "../../../../common/enums";
import { CardQueryOptions } from "../../../../common/ipc-params/card-query.options";

export interface ICardRepository {
  // TODO maybe this method can be removed
  getCardById(cardId: string): Promise<CardDto>;
  getCardImageData(cardId: string, imageType: ImageType): Promise<CardImageDto>;
  getWithOptions(options: CardQueryOptions): Promise<Array<CardDto>>;
}
