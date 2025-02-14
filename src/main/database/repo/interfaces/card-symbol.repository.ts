
import { DtoCardSymbol } from "../../../../common/dto";
import { IResult } from "../../../services/base";


export interface ICardSymbolRepository {
  getAll(): Promise<IResult<Array<DtoCardSymbol>>>;
  getCardSymbolSvg(): Promise<IResult<Map<string, string>>>;
}
