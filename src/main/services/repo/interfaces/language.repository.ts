import { DtoLanguage } from "../../../../common/dto";

export interface ILanguageRepository {
  getAll(): Promise<Array<DtoLanguage>>;
}
