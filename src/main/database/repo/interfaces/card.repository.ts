import { MtgCardListDto, MtgCardImageDataDto, MtgCardDetailDto, CardQueryDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICardRepository {
  getCardDetails(cardId: string): Promise<IResult<MtgCardDetailDto>>;
  getCardImageData(cardId: string): Promise<IResult<MtgCardImageDataDto>>;
  queryCards(params: CardQueryDto): Promise<IResult<Array<MtgCardListDto>>>;
}
