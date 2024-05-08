import { ColorSelectDto } from "../../../../common/dto";

export interface IColorRepository {
  getAll(): Promise<Array<ColorSelectDto>>;
}
