
import { DtoCardSymbol } from "../../../../common/dto";

export interface ICardSymbolRepository {
  getAll(): Promise<Array<DtoCardSymbol>>;
  getCardSymbolSvg(): Promise<Map<string, string>>;
}
