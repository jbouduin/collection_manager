import { inject, injectable } from "tsyringe";
import { CardConditionDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { ICardConditionRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class CardConditionRepository extends BaseRepository implements ICardConditionRepository {
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
  public getAll(): Promise<IResult<Array<CardConditionDto>>> {
    try {
      return this.database
        .selectFrom("card_condition")
        .selectAll()
        .$castTo<CardConditionDto>()
        .execute()
        .then((r: Array<CardConditionDto>) => this.resultFactory.createSuccessResult<Array<CardConditionDto>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<CardConditionDto>>(err);
    }
  }
  //#endregion
}
