
import { DtoCardSet, DtoCardSetDetails } from "../../../../common/dto";

export interface ICardSetRepository {
  getAll(): Promise<Array<DtoCardSet>>;
  getDetails(cardSetId: string): Promise<DtoCardSetDetails>;
}
