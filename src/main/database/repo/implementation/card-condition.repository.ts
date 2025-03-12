import { inject, injectable } from "tsyringe";
import { ICardConditionDto } from "../../../../common/dto";
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
  public getAll(): Promise<IResult<Array<ICardConditionDto>>> {
    try {
      return this.database
        .selectFrom("card_condition")
        .selectAll()
        .$castTo<ICardConditionDto>()
        .execute()
        .then((r: Array<ICardConditionDto>) => this.resultFactory.createSuccessResult<Array<ICardConditionDto>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<ICardConditionDto>>(err);
    }
  }
  //#endregion
}
