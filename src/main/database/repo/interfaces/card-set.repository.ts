
import { CardSetDto, CardSetDetailsDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICardSetRepository {
  getAll(): Promise<IResult<Array<CardSetDto>>>;
  getDetails(cardSetId: string): Promise<IResult<CardSetDetailsDto>>;
}
