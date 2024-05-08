import { Ruling } from "scryfall-sdk";
import { RulingsByCardIdSelectDto } from "../../../../common/dto";

export interface IRulingRepository {
  getByCardId(cardId: string): Promise<RulingsByCardIdSelectDto>;
  sync(rulings: Array<Ruling>): Promise<void>;
}
