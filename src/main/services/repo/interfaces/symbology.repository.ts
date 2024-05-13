import { CardSymbol } from "scryfall-sdk";

import { SymbologySelectDto } from "../../../../common/dto";
import { ProgressCallback } from "../../../../common/ipc-params";

export interface ISymbologyRepository {
  getAll(): Promise<Array<SymbologySelectDto>>;
  getAllWithCachedSvg(): Promise<Map<string, string>>;
  getByid(id: string): Promise<SymbologySelectDto>;
  sync(symbols: Array<CardSymbol>, progressCallback: ProgressCallback): Promise<void>
}
