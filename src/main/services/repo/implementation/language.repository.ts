import { inject, injectable } from "tsyringe";

import { DtoLanguage } from "../../../../common/dto";
import { IDatabaseService, ILogService } from "../../infra/interfaces";
import { ILanguageRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { INFRASTRUCTURE } from "../../service.tokens";

@injectable()
export class LanguageRepository extends BaseRepository implements ILanguageRepository {
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService
  ) {
    super(databaseService, logService);
  }

  getAll(): Promise<Array<DtoLanguage>> {
    return this.database
      .selectFrom("language")
      .selectAll()
      .execute();
  }
}
