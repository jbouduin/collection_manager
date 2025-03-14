import { IMtgCardListDto, IMtgCardImageDataDto, IMtgCardDetailDto, ICardQueryDto, IMtgCardOtherPrint } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICardRepository {
  getCardDetails(cardId: string): Promise<IResult<IMtgCardDetailDto>>;
  getCardImageData(cardId: string): Promise<IResult<IMtgCardImageDataDto>>;
  getAllPrints(cardId: string): Promise<IResult<Array<IMtgCardOtherPrint>>>;
  queryCards(params: ICardQueryDto): Promise<IResult<Array<IMtgCardListDto>>>;
}
