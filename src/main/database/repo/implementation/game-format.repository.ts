import { inject, injectable } from "tsyringe";
import { IGameFormatDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { IGameFormatRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class GameFormatRepository extends BaseRepository implements IGameFormatRepository {
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
  public getAll(): Promise<IResult<Array<IGameFormatDto>>> {
    try {
      return this.database
        .selectFrom("game_format")
        .selectAll()
        .$castTo<IGameFormatDto>()
        .execute()
        .then((r: Array<IGameFormatDto>) => this.resultFactory.createSuccessResult<Array<IGameFormatDto>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IGameFormatDto>>(err);
    }
  }
  //#endregion
}
