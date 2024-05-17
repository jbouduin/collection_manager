
import { SymbologyDto } from "../../../../common/dto";

export interface ISymbologyRepository {
  getAll(): Promise<Array<SymbologyDto>>;
  getAllWithCachedSvg(): Promise<Map<string, string>>;
}
