import { MtgCardListDto, MtgCardImageDataDto, MtgCardDetailDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICardRepository {
  getCardDetails(cardId: string): Promise<IResult<MtgCardDetailDto>>;
  getCardImageData(cardId: string): Promise<IResult<MtgCardImageDataDto>>;
  queryCards(setIds?: Array<string>): Promise<IResult<Array<MtgCardListDto>>>;
}
