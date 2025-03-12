import { ILanguageDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ILanguageRepository {
  getAll(): Promise<IResult<Array<ILanguageDto>>>;
}
