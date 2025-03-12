import { inject, injectable } from "tsyringe";
import { ILanguageDto } from "../../../../common/dto";
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
  public getAll(): Promise<IResult<Array<ILanguageDto>>> {
    try {
      return this.database
        .selectFrom("language")
        .selectAll()
        .$castTo<ILanguageDto>()
        .execute()
        .then((r: Array<ILanguageDto>) => this.resultFactory.createSuccessResult<Array<ILanguageDto>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<ILanguageDto>>(err);
    }
  }
  //#endregion
}
