import { Set as ScryfallCardSet, Sets } from "scryfall-sdk";
import { ICardSetRepository } from "../database/repositories/card-set.repository";
import { inject, injectable } from "tsyringe";
import TOKENS from "../tokens";
import { IBaseSyncService } from "./base-sync.service";
import { ICardSetSyncOptions } from "../../../common/ipc-params";

export interface ICardSetSyncService extends IBaseSyncService<ICardSetSyncOptions> { }

@injectable()
export class CardSetSyncService implements IBaseSyncService<ICardSetSyncOptions> {

  private readonly cardSetRepository: ICardSetRepository;

  public constructor(
    @inject(TOKENS.CardSetRepository) cardSetRepository: ICardSetRepository
  ) {
    this.cardSetRepository = cardSetRepository;
  }

  public async sync(options: ICardSetSyncOptions): Promise<void> {
    let sets: Array<ScryfallCardSet>;
    if (options.code == null){
      sets = await Sets.all();
    }
    else {
      const set = await Sets.byCode(options.code)
      sets = new Array<ScryfallCardSet>(set);
    }
    await this.cardSetRepository.sync(sets);
  }
}
