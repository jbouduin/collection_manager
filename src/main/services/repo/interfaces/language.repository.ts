import { LanguageSelectDto } from "../../../../common/dto";

export interface ILanguageRepository {
  getAll(): Promise<Array<LanguageSelectDto>>;
}
