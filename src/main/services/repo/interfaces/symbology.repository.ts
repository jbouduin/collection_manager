import { CardSymbol } from "scryfall-sdk";
import { SymbologySelectDto } from "../../../../common/dto";

export interface ISymbologyRepository {
  getAll(): Promise<Array<SymbologySelectDto>>;
  sync(symbols: Array<CardSymbol>): Promise<void>
}
