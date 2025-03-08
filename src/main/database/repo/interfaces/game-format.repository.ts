import { GameFormatDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface IGameFormatRepository {
  getAll(): Promise<IResult<Array<GameFormatDto>>>;
}
