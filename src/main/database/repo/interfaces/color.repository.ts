import { IColorDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface IColorRepository {
  getAll(): Promise<IResult<Array<IColorDto>>>;
}
