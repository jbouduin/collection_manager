
import { CardSetDto } from "../../../../common/dto";

export interface ICardSetRepository {
  getAll(): Promise<Array<CardSetDto>>;
}
