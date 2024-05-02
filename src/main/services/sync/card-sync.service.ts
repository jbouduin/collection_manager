import { Cards, Card as ScryfallCard } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";
import TOKENS from "../tokens";
import { IBaseSyncService } from "./base-sync.service";
import { ICardSyncOptions } from "../../../common/ipc-params";
// TODO create index.ts in services per directory
import { ICardRepository } from "../database/repositories/card.repository";

export type ICardSyncService = IBaseSyncService<ICardSyncOptions>;

@injectable()
export class CardSyncService implements IBaseSyncService<ICardSyncOptions> {

  private readonly cardRepository: ICardRepository;

  public constructor(
    @inject(TOKENS.CardRepository) cardRepository: ICardRepository
  ) {
    this.cardRepository = cardRepository;
  }

  public async sync(options: ICardSyncOptions): Promise<void> {
    const cards: Array<ScryfallCard> = new Array<ScryfallCard>();
    const emitter = Cards.search("e=" + options.setCode, {include_extras: true, include_variations:true, unique:"prints"});
    // TODO sdk is not returning total number of results when querying, so we would never be able to show process
    // consider adding required parts of scrfall-sdk to application
    emitter.addListener("data", (card: ScryfallCard) => {
      cards.push(card);
      console.log(card.name);
    });
    const all = await emitter.waitForAll();
    console.log("Emitted %d cards", cards.length);
    console.log("Found %d cards", all.length);
    // if (options.code == null) {
    //   sets = await Sets.all();
    // }
    // else {
    //   const set = await Sets.byCode(options.code);
    //   sets = new Array<ScryfallCardSet>(set);
    // }
    // await this.cardSetRepository.sync(sets);
  }
}
