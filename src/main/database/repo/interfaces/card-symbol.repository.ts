
import { Selectable } from "kysely";
import { IMtgCardSymbolDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { CardSymbolTable } from "../../schema";


export interface ICardSymbolRepository {
  getAll(): Promise<IResult<Array<IMtgCardSymbolDto>>>;
  getCardSymbols(): Promise<IResult<Array<Selectable<CardSymbolTable>>>>;
}
