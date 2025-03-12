import { inject, injectable } from "tsyringe";
import { IColorDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { IColorRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class ColorRepository extends BaseRepository implements IColorRepository {
  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(databaseService, logService, resultFactory);
  }
  //#region

  //#region IColorRepository methods ------------------------------------------
  public getAll(): Promise<IResult<Array<IColorDto>>> {
    try {
      return this.database
        .selectFrom("color")
        .selectAll()
        .$castTo<IColorDto>()
        .execute()
        .then((r: Array<IColorDto>) => this.resultFactory.createSuccessResult<Array<IColorDto>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IColorDto>>(err);
    }
  }
  //#endregion
}
