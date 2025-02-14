import { inject, injectable } from "tsyringe";
import { LegalityDto, RulingLineDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { logCompilable } from "../../../services/scryfall/sync/implementation/log-compilable";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { IOracleRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class OracleRepository extends BaseRepository implements IOracleRepository {
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(databaseService, logService, resultFactory);
  }

  public async getByCardId(cardId: string): Promise<IResult<Array<RulingLineDto>>> {
    try {
      return this.database
        .selectFrom("card")
        .innerJoin("oracle_ruling", "oracle_ruling.oracle_id", "card.oracle_id")
        .leftJoin("oracle_ruling_line", "oracle_ruling_line.oracle_id", "oracle_ruling.oracle_id")
        .where("card.id", "=", cardId)
        .selectAll("oracle_ruling_line")
        .$call((q) => logCompilable(this.logService, q))
        .$castTo<RulingLineDto>()
        .execute()
        .then((r: Array<RulingLineDto>) =>this.resultFactory.createSuccessResult<Array<RulingLineDto>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<RulingLineDto>>(err);
    }
  }

  public getLegalities(oracleId: string): Promise<IResult<Array<LegalityDto>>> {
    try {
      return this.database
        .selectFrom("oracle_legality")
        .selectAll()
        .where("oracle_legality.oracle_id", "=", oracleId)
        .$castTo<LegalityDto>()
        .execute()
        .then((r: Array<LegalityDto>) => this.resultFactory.createSuccessResult(r))        ;
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<LegalityDto>>(err);
    }
  }
}
