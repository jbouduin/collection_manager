
import { IMtgCardSetDto, IMtgCardSetDetailDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICardSetRepository {
  getAll(): Promise<IResult<Array<IMtgCardSetDto>>>;
  getDetails(cardSetId: string): Promise<IResult<IMtgCardSetDetailDto>>;
}
