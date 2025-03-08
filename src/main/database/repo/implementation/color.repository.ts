import { inject, injectable } from "tsyringe";
import { ColorDto } from "../../../../common/dto";
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
  public getAll(): Promise<IResult<Array<ColorDto>>> {
    try {
      return this.database
        .selectFrom("color")
        .selectAll()
        .$castTo<ColorDto>()
        .execute()
        .then((r: Array<ColorDto>) => this.resultFactory.createSuccessResult<Array<ColorDto>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<ColorDto>>(err);
    }
  }
  //#endregion
}
