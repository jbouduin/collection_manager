
import { CardSetSelectDto } from "../../../../common/dto";

export interface ICardSetRepository {
  getAll(): Promise<Array<CardSetSelectDto>>;
}
