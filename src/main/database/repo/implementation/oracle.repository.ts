import { inject, injectable } from "tsyringe";
import { ILegalityDto, IOracleRulingLineDto } from "../../../../common/dto";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { logCompilable } from "../../log-compilable";
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

  public async getByOracleId(oracleId: string): Promise<IResult<Array<IOracleRulingLineDto>>> {
    try {
      return this.database
        .selectFrom("oracle_ruling")
        .leftJoin("oracle_ruling_line", "oracle_ruling_line.oracle_id", "oracle_ruling.oracle_id")
        .where("oracle_ruling.oracle_id", "=", oracleId)
        .selectAll("oracle_ruling_line")
        .$call((q) => logCompilable(this.logService, q))
        .$castTo<IOracleRulingLineDto>()
        .execute()
        .then((r: Array<IOracleRulingLineDto>) => this.resultFactory.createSuccessResult<Array<IOracleRulingLineDto>>(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IOracleRulingLineDto>>(err);
    }
  }

  public getLegalities(oracleId: string): Promise<IResult<Array<ILegalityDto>>> {
    try {
      return this.database
        .selectFrom("oracle_legality")
        .selectAll()
        .where("oracle_legality.oracle_id", "=", oracleId)
        .$castTo<ILegalityDto>()
        .execute()
        .then((r: Array<ILegalityDto>) => this.resultFactory.createSuccessResult(r));
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<ILegalityDto>>(err);
    }
  }
}
