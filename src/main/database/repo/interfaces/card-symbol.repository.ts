
import { Selectable } from "kysely";
import { MtgCardSymbolDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { CardSymbolTable } from "../../schema";


export interface ICardSymbolRepository {
  getAll(): Promise<IResult<Array<MtgCardSymbolDto>>>;
  getCardSymbols(): Promise<IResult<Array<Selectable<CardSymbolTable>>>>;
}
