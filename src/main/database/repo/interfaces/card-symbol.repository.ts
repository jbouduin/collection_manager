
import { Selectable } from "kysely";
import { DtoCardSymbol } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { CardSymbolTable } from "../../schema";


export interface ICardSymbolRepository {
  getAll(): Promise<IResult<Array<DtoCardSymbol>>>;
  getCardSymbols(): Promise<IResult<Array<Selectable<CardSymbolTable>>>>;
}
