import { inject, injectable } from "tsyringe";
import { DtoLegality, DtoRulingLine } from "../../../../common/dto";
import { IDatabaseService, ILogService } from "../../infra/interfaces";
import { IOracleRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { INFRASTRUCTURE } from "../../service.tokens";

@injectable()
export class OracleRepository extends BaseRepository implements IOracleRepository {
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService
  ) {
    super(databaseService, logService);
  }

  public async getByCardId(cardId: string): Promise<Array<DtoRulingLine>> {
    return this.database
      .selectFrom("card")
      .innerJoin("oracle_ruling", "oracle_ruling.oracle_id", "card.oracle_id")
      .leftJoin("oracle_ruling_line", "oracle_ruling_line.oracle_id", "oracle_ruling.oracle_id")
      .where("card.id", "=", cardId)
      .selectAll("oracle_ruling_line")
      // .$call(super.logCompilable)
      .execute();
  }

  public getLegalities(oracleId: string): Promise<Array<DtoLegality>> {
    return this.database
      .selectFrom("oracle_legality")
      .selectAll()
      .where("oracle_legality.oracle_id", "=", oracleId)
      .execute();
  }
}
