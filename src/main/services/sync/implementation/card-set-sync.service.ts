import { Set as ScryfallCardSet, Sets } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";
import { ICardSetSyncOptions } from "../../../../common/ipc-params";
import REPOTOKENS, { ICardSetRepository } from "../../repo/interfaces";
import { ICardSetSyncService } from "../interfaces";

@injectable()
export class CardSetSyncService implements ICardSetSyncService {

  private readonly cardSetRepository: ICardSetRepository;

  public constructor(
    @inject(REPOTOKENS.CardSetRepository) cardSetRepository: ICardSetRepository
  ) {
    this.cardSetRepository = cardSetRepository;
  }

  public async sync(options: ICardSetSyncOptions): Promise<void> {
    let sets: Array<ScryfallCardSet>;
    if (options.code == null){
      sets = await Sets.all();
    }
    else {
      const set = await Sets.byCode(options.code);
      sets = new Array<ScryfallCardSet>(set);
    }
    await this.cardSetRepository.sync(sets);
  }
}
