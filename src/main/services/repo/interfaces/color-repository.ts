import { ColorDto } from "../../../../common/dto";

export interface IColorRepository {
  getAll(): Promise<Array<ColorDto>>;
}
