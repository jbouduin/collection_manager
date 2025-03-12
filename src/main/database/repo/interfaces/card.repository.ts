import { IMtgCardListDto, IMtgCardImageDataDto, IMtgCardDetailDto, ICardQueryDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICardRepository {
  getCardDetails(cardId: string): Promise<IResult<IMtgCardDetailDto>>;
  getCardImageData(cardId: string): Promise<IResult<IMtgCardImageDataDto>>;
  queryCards(params: ICardQueryDto): Promise<IResult<Array<IMtgCardListDto>>>;
}
