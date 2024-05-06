import fs from "fs";
import { Cards, Card as ScryfallCard } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";
import { CardSyncOptions } from "../../../../common/ipc-params";
import REPOTOKENS, { ICardRepository } from "../../repo/interfaces";
import { ICardSyncService } from "../interfaces";

@injectable()
export class CardSyncService implements ICardSyncService {

  private readonly cardRepository: ICardRepository;

  public constructor(
    @inject(REPOTOKENS.CardRepository) cardRepository: ICardRepository
  ) {
    this.cardRepository = cardRepository;
  }

  public async sync(options: CardSyncOptions): Promise<void> {
    console.log("start CardSyncService.sync");
    // TODO: check if all required master data is available
    const cards: Array<ScryfallCard> = new Array<ScryfallCard>();
    const emitter = Cards.search("e=" + options.setCode, { include_extras: true, include_variations: true, unique: "prints" });
    // TODO sdk is not returning total number of results when querying, so we would never be able to show process
    // consider adding required parts of scrfall-sdk to application
    // emitter.addListener("data", (card: ScryfallCard) => {
    //   cards.push(card);
    // });
    return emitter.waitForAll().then((all) => {
      const fileName = "c:/data/new-assistant/json/cards_" + options.setCode + ".json";
      if (!fs.existsSync(fileName)) {
        const json = JSON.stringify(all);
        fs.writeFileSync(fileName, json);
      }
      console.log("Emitted %d cards", cards.length);
      console.log("Found %d cards", all.length);
      return this.cardRepository.sync(all);
    });
  }
}
