import { CardSymbol } from "scryfall-sdk";
import { SymbologySelectDto } from "../../../../common/dto";
import { ProgressCallback } from "../../infra/implementation";

export interface ISymbologyRepository {
  getAll(): Promise<Array<SymbologySelectDto>>;
  sync(symbols: Array<CardSymbol>, progressCallback: ProgressCallback): Promise<void>
}
