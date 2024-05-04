import fs from "fs";
import { Cards, Card as ScryfallCard } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";
import { ICardSyncOptions } from "../../../../common/ipc-params";
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

  public async sync(options: ICardSyncOptions): Promise<void> {
    const cards: Array<ScryfallCard> = new Array<ScryfallCard>();
    const emitter = Cards.search("e=" + options.setCode, { include_extras: true, include_variations: true, unique: "prints" });
    // TODO sdk is not returning total number of results when querying, so we would never be able to show process
    // consider adding required parts of scrfall-sdk to application
    emitter.addListener("data", (card: ScryfallCard) => {
      cards.push(card);
      console.log(card.name);
    });
    const all = await emitter.waitForAll();
    const fileName = "c:/data/new-assistant/json/cards_" + options.setCode + ".json";
    if (!fs.existsSync(fileName)) {
      const json = JSON.stringify(all);
      fs.writeFileSync(fileName, json);
    }
    console.log("Emitted %d cards", cards.length);
    console.log("Found %d cards", all.length);
    // TODO handle split card (e.g. MKM - Cease / Desist)
    // TODO handle double side card (e.g. SOI - Archangel Avacyn)
    // split and double sided cards have two cardfaces:
    // "card_faces": [
    //   {
    //     "object": "card_face"
    //     ...
    //   }
    //   {
    //     "object": "card_face"
    //     ...
    //   }
    // ]
    // others have
    //   {
    //     "object": "card_face"
    //   }
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
