import { inject, injectable } from "tsyringe";

import { RulingsByCardIdSelectDto } from "../../../../common/dto";
import INFRATOKENS, { IDatabaseService } from "../../infra/interfaces";
import { IRulingRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";

@injectable()
export class RulingRepository extends BaseRepository implements IRulingRepository {

  public constructor(@inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService) {
    super(databaseService);
  }

  public async getByCardId(cardId: string): Promise<RulingsByCardIdSelectDto> {
    return this.database
      .selectFrom("card")
      .rightJoin("ruling", "ruling.oracle_id", "card.oracle_id")
      .rightJoin("ruling_line", "ruling_line.oracle_id", "ruling.oracle_id")
      .where("card.id", "=", cardId)
      .selectAll("ruling_line")
      .execute();
  }


}
