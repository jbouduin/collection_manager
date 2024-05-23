
import { DtoCardSet } from "../../../../common/dto";

export interface ICardSetRepository {
  getAll(): Promise<Array<DtoCardSet>>;
}
