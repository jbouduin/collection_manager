import { inject, injectable } from "tsyringe";

import { LanguageDto } from "../../../../common/dto";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { ILanguageRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class LanguageRepository extends BaseRepository implements ILanguageRepository {

  public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }

  getAll(): Promise<Array<LanguageDto>> {
    return this.database.selectFrom("language").selectAll().execute();
  }
}
