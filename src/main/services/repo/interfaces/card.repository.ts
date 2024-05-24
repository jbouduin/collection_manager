
import { CardImageDto, DtoCard } from "../../../../common/dto";
import { ImageSize } from "../../../../common/enums";
import { CardQueryOptions } from "../../../../common/ipc-params/query/card-query.options";

export interface ICardRepository {
  getCardImageData(cardId: string, imageType: ImageSize): Promise<CardImageDto>;
  // getCards(options: CardQueryOptions): Promise<Array<CardDto>>;
  getCards(options: CardQueryOptions): Promise<Array<DtoCard>>
}
