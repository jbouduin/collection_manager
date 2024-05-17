import { inject, injectable } from "tsyringe";

import { RulingLineDto } from "../../../../common/dto";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { IRulingRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class RulingRepository extends BaseRepository implements IRulingRepository {

  public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }

  public async getByCardId(cardId: string): Promise<Array<RulingLineDto>> {
    return this.database
      .selectFrom("card")
      .innerJoin("ruling", "ruling.oracle_id", "card.oracle_id")
      .leftJoin("ruling_line", "ruling_line.oracle_id", "ruling.oracle_id")
      .where("card.id", "=", cardId)
      .selectAll("ruling_line")
      // .$call(super.logCompilable)
      .execute();
  }
}
