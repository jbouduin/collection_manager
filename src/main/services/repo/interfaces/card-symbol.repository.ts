
import { CardSymbolDto } from "../../../../common/dto";

export interface ICardSymbolRepository {
  getAll(): Promise<Array<CardSymbolDto>>;
  getAllWithCachedSvg(): Promise<Map<string, string>>;
}
