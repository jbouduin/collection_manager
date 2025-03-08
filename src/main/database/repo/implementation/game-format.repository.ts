import { inject, injectable } from "tsyringe";
import { GameFormatDto } from "../../../../common/dto";
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
  public getAll(): Promise<IResult<Array<GameFormatDto>>> {
    try {
      return this.database
        .selectFrom("game_format")
        .selectAll()
        .$castTo<GameFormatDto>()
        .execute()
        .then((r: Array<GameFormatDto>) => this.resultFactory.createSuccessResult<Array<GameFormatDto>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<GameFormatDto>>(err);
    }
  }
  //#endregion
}
