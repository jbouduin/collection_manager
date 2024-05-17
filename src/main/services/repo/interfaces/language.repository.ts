import { LanguageDto } from "../../../../common/dto";

export interface ILanguageRepository {
  getAll(): Promise<Array<LanguageDto>>;
}
