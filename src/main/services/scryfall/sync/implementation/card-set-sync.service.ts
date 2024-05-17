import { ExpressionOrFactory, SqlBool, Transaction } from "kysely";
import { Set as ScryfallCardSet, Sets } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { CardSetSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { CardSet, DatabaseSchema } from "../../../../database/schema";
import ADAPTTOKENS, { ICardSetAdapter } from "../../adapt/interface";
import INFRATOKENS, { IDatabaseService, IImageCacheService } from "../../../infra/interfaces";
import { BaseSyncService } from "./base-sync.service";
import { ICardSetSyncService } from "../interface";

@injectable()
export class CardSetSyncService extends BaseSyncService implements ICardSetSyncService {

  //#region private readonly fields -------------------------------------------
  private readonly cardSetAdapter: ICardSetAdapter;
  private readonly imageCacheService: IImageCacheService;
  //#endregion

  // TODO check where to put this so we can re-use
  // private runSerial<T>(cardSets: Array<T>, task: (t: T) => Promise<void>): Promise<void> {
  //   var result = Promise.resolve();
  //   cardSets.forEach((cardSet: any) => {
  //     result = result.then(() => task(cardSet));
  //   });
  //   return result;
  // }

  //#region Constructor -------------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(ADAPTTOKENS.CardSetAdapter) cardSetAdapter: ICardSetAdapter,
    @inject(INFRATOKENS.ImageCacheService) imageCacheService: IImageCacheService) {
    super(databaseService);
    this.cardSetAdapter = cardSetAdapter;
    this.imageCacheService = imageCacheService;
  }
  //#endregion

  //#region ICardSetSyncService methods ---------------------------------------
  public async sync(options: CardSetSyncOptions, progressCallback?: ProgressCallback): Promise<void> {
    console.log("start CardSetSyncService.sync");
    if (progressCallback) {
      progressCallback("Sync Sets");
    }

    let sets: Promise<Array<ScryfallCardSet>>;
    if (options.code == null) {
      sets = Sets.all();
    }
    else {
      sets = Sets.byCode(options.code).then((set: ScryfallCardSet) => new Array<ScryfallCardSet>(set));
    }
    return sets
      .then((sets: Array<ScryfallCardSet>) => this.processSync(sets))
      .then(() => this.database.selectFrom("card_set").selectAll().execute())
      .then(async (cardsets: Array<CardSet>) => {
        let result = Promise.resolve();
        cardsets.forEach(async (cardset: CardSet) => {
          result = result.then(() => this.imageCacheService.cacheCardSetSvg(cardset));
        });
      });
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  // TODO remove items that are not on the server anymore or at least mark them => how ?
  // then we should prevent synchronizing single sets !
  public async processSync(cardSets: Array<ScryfallCardSet>): Promise<void> {
    return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      cardSets.forEach(async (cardSet: ScryfallCardSet) => {
        const filter: ExpressionOrFactory<DatabaseSchema, "card_set", SqlBool> = (eb) => eb("card_set.id", "=", cardSet.id);
        const existingCardSet = await trx
          .selectFrom("card_set")
          .select("card_set.id")
          .where(filter)
          .executeTakeFirst();
        if (existingCardSet) {
          await trx.updateTable("card_set")
            .set(this.cardSetAdapter.toUpdate(cardSet))
            .where(filter)
            .executeTakeFirstOrThrow();
        } else {
          await trx.insertInto("card_set")
            .values(this.cardSetAdapter.toInsert(cardSet))
            .executeTakeFirstOrThrow();
        }
      });
    });
  }
  //#endregion
}
