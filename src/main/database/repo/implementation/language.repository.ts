import { inject, injectable } from "tsyringe";
import { LanguageDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { ILanguageRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";


@injectable()
export class LanguageRepository extends BaseRepository implements ILanguageRepository {
  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(databaseService, logService, resultFactory);
  }
  //#endregion

  //#region ILanguageRepository methods ---------------------------------------
  public getAll(): Promise<IResult<Array<LanguageDto>>> {
    try {
      return this.database
        .selectFrom("language")
        .selectAll()
        .$castTo<LanguageDto>()
        .execute()
        .then((r: Array<LanguageDto>) => this.resultFactory.createSuccessResult<Array<LanguageDto>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<LanguageDto>>(err);
    }
  }
  //#endregion
}
