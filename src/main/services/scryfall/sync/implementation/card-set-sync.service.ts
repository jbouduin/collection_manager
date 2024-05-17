import { ExpressionOrFactory, SqlBool, Transaction } from "kysely";
import { inject, injectable } from "tsyringe";

import { ProgressCallback } from "../../../../../common/ipc-params";
import { CardSet, DatabaseSchema } from "../../../../database/schema";
import INFRATOKENS, { IDatabaseService, IImageCacheService } from "../../../infra/interfaces";
import ADAPTTOKENS, { ICardSetAdapter } from "../../adapt/interface";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCardSet } from "../../types";
import { ICardSetSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";

@injectable()
export class CardSetSyncService extends BaseSyncService implements ICardSetSyncService {

  //#region private readonly fields -------------------------------------------
  private readonly scryfallclient: IScryfallClient;
  private readonly cardSetAdapter: ICardSetAdapter;
  private readonly imageCacheService: IImageCacheService;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(ADAPTTOKENS.CardSetAdapter) cardSetAdapter: ICardSetAdapter,
    @inject(INFRATOKENS.ImageCacheService) imageCacheService: IImageCacheService) {
    super(databaseService);
    this.scryfallclient = scryfallclient;
    this.cardSetAdapter = cardSetAdapter;
    this.imageCacheService = imageCacheService;
  }
  //#endregion

  //#region ICardSetSyncService methods ---------------------------------------
  public async sync(_options: null, progressCallback?: ProgressCallback): Promise<void> {
    console.log("start CardSetSyncService.sync");
    if (progressCallback) {
      progressCallback("Synchronizing Card sets");
    }

    const sets = this.scryfallclient.getCardSets();

    return await sets
      .then(async (sets: Array<ScryfallCardSet>) => await this.processSync(sets))
      .then(() => this.database.selectFrom("card_set").selectAll().execute())
      .then(async (cardSets: Array<CardSet>) => {
        let result = Promise.resolve();
        cardSets.forEach(async (cardset: CardSet) => {
          result = result.then(async () => await this.imageCacheService.cacheCardSetSvg(cardset));
        });
        return result;
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
