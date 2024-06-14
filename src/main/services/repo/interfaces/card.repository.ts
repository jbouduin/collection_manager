import { DtoCard, DtoCardImageData } from "../../../../common/dto";
import { CardQueryOptions } from "../../../../common/ipc-params/query/card-query.options";

export interface ICardRepository {
  getCardImageData(cardId: string): Promise<DtoCardImageData>;
  getCards(options: CardQueryOptions): Promise<Array<DtoCard>>
}
