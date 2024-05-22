import { ExpressionOrFactory, Selectable, SqlBool, Transaction } from "kysely";
import { inject, injectable } from "tsyringe";

import { CardSetSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { runSerial } from "../../../../../main/services/infra/util";
import { CardSetTable, DatabaseSchema } from "../../../../database/schema";
import INFRATOKENS, { IConfigurationService, IDatabaseService, IImageCacheService } from "../../../infra/interfaces";
import ADAPTTOKENS, { ICardSetAdapter } from "../../adapt/interface";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCardSet } from "../../types";
import { ICardSetSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";

@injectable()
export class CardSetSyncService extends BaseSyncService<CardSetSyncOptions> implements ICardSetSyncService {

  //#region private readonly fields -------------------------------------------
  private readonly scryfallclient: IScryfallClient;
  private readonly configurationService: IConfigurationService;
  private readonly cardSetAdapter: ICardSetAdapter;
  private readonly imageCacheService: IImageCacheService;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(INFRATOKENS.ConfigurationService) configurationService: IConfigurationService,
    @inject(ADAPTTOKENS.CardSetAdapter) cardSetAdapter: ICardSetAdapter,
    @inject(INFRATOKENS.ImageCacheService) imageCacheService: IImageCacheService) {
    super(databaseService);
    this.scryfallclient = scryfallclient;
    this.configurationService = configurationService;
    this.cardSetAdapter = cardSetAdapter;
    this.imageCacheService = imageCacheService;
  }
  //#endregion

  //#region ICardSetSyncService methods ---------------------------------------
  public override async sync(options: CardSetSyncOptions, progressCallback: ProgressCallback): Promise<void> {

    return await this.shouldSync(options)
      .then(async (shouldSync: boolean) => {
        if (shouldSync) {
          console.log("start CardSetSyncService.sync");
          if (progressCallback) {
            progressCallback("Synchronizing Card sets");
          }
          return await this.scryfallclient.getCardSets()
            .then(async (sets: Array<ScryfallCardSet>) => this.processSync(sets))
            .then(async () => await this.database.selectFrom("card_set").selectAll().execute())
            .then(async (cardSets: Array<Selectable<CardSetTable>>) => {
              let result = Promise.resolve();
              console.log((`retrieved ${cardSets.length} saved card sets`));
              cardSets.forEach(async (cardset: Selectable<CardSetTable>) => {
                result = result.then(async () => await this.imageCacheService.cacheCardSetSvg(cardset));
                await result;
              });
              return result;
            });
        } else {
          console.log("skip CardSetSyncService.sync");
          return Promise.resolve();
        }
      });
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  // TODO remove items that are not on the server anymore or at least mark them => how ?
  // then we should prevent synchronizing single sets !
  public async processSync(cardSets: Array<ScryfallCardSet>): Promise<void> {
    return await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      await runSerial<ScryfallCardSet>(cardSets, async (scryfallCardSet: ScryfallCardSet) => {
        // cardSets.forEach(async (cardSet: ScryfallCardSet) => {
        const filter: ExpressionOrFactory<DatabaseSchema, "card_set", SqlBool> = (eb) => eb("card_set.id", "=", scryfallCardSet.id);
        const existingCardSet = await trx
          .selectFrom("card_set")
          .select("card_set.id")
          .where(filter)
          .executeTakeFirst();
        if (existingCardSet) {
          await trx.updateTable("card_set")
            .set(this.cardSetAdapter.toUpdate(scryfallCardSet))
            .where(filter)
            .executeTakeFirstOrThrow();
        } else {
          await trx.insertInto("card_set")
            .values(this.cardSetAdapter.toInsert(scryfallCardSet))
            .executeTakeFirstOrThrow();
        }
      });
    });
  }

  private async shouldSync(options: CardSetSyncOptions): Promise<boolean> {
    if (options.source == "user" || this.configurationService.syncAtStartup.indexOf("CardSet") >= 0) {
      return await Promise.resolve(true);
    } else {
      return await this.database
        .selectFrom("card_set")
        .selectAll()
        .limit(1)
        .executeTakeFirst()
        .then((existing: Selectable<CardSetTable>) => existing ? false : true);
    }
  }
  //#endregion
}
