import { RulingsByCardIdSelectDto } from "../../../../common/dto";

export interface IRulingRepository {
  getByCardId(cardId: string): Promise<RulingsByCardIdSelectDto>;
}
