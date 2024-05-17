import { RulingLineDto  } from "../../../../common/dto";

export interface IRulingRepository {
  getByCardId(cardId: string): Promise<Array<RulingLineDto>>;
}
