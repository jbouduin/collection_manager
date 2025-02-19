import { CardConditionDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICardConditionRepository {
  getAll(): Promise<IResult<Array<CardConditionDto>>>;
}
