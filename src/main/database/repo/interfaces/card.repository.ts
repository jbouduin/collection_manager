import { CardDto, DtoCardImageData } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICardRepository {
  getCardImageData(cardId: string): Promise<IResult<DtoCardImageData>>;
  getCards(cardId?: string, setIds?: Array<string>): Promise<IResult<Array<CardDto>>>;
}
