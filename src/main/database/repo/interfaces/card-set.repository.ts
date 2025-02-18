
import { MtgCardSetDto, MtgCardSetDetailsDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICardSetRepository {
  getAll(): Promise<IResult<Array<MtgCardSetDto>>>;
  getDetails(cardSetId: string): Promise<IResult<MtgCardSetDetailsDto>>;
}
