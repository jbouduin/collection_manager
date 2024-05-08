import { Set as ScryfallCardSet, Sets } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";
import { CardSetSyncOptions } from "../../../../common/ipc-params";
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

  public async sync(options: CardSetSyncOptions): Promise<void> {
    console.log("start CardSetSyncService.sync");
    let sets: Promise<Array<ScryfallCardSet>>;
    if (options.code == null) {
      sets = Sets.all();
    }
    else {
      sets = Sets.byCode(options.code).then((set: ScryfallCardSet) => new Array<ScryfallCardSet>(set));
    }
    return sets.then((sets: Array<ScryfallCardSet>) => this.cardSetRepository.sync(sets));
  }
}
