import { Selectable, Transaction } from "kysely";
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
import { DtoSyncParam, SyncSource } from "../../../../../common/dto";

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
  public override async newSync(syncParam: DtoSyncParam, progressCallback: ProgressCallback): Promise<void> {
    return await this.shouldSync(syncParam.syncRequestSource)
      .then(async (shouldSync: boolean) => {
        if (shouldSync) {
          console.log("start CardSetSyncService.sync");
          if (progressCallback) {
            progressCallback("Synchronizing Card sets");
          }
          return await this.scryfallclient.getCardSets(progressCallback)
            .then(async (sets: Array<ScryfallCardSet>) => this.processSync(sets))
            .then(async () => await this.database.selectFrom("card_set").selectAll().execute())
            .then(async (cardSets: Array<Selectable<CardSetTable>>) => {
              let result = Promise.resolve();
              console.log((`Saved ${cardSets.length} card sets`));
              cardSets.forEach(async (cardset: Selectable<CardSetTable>) => {
                result = result.then(async () => await this.imageCacheService.cacheCardSetSvg(cardset, progressCallback));
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

  public override async sync(options: CardSetSyncOptions, progressCallback: ProgressCallback): Promise<void> {
    return await this.shouldSync(options.source)
      .then(async (shouldSync: boolean) => {
        if (shouldSync) {
          console.log("start CardSetSyncService.sync");
          if (progressCallback) {
            progressCallback("Synchronizing Card sets");
          }
          return await this.scryfallclient.getCardSets(progressCallback)
            .then(async (sets: Array<ScryfallCardSet>) => this.processSync(sets))
            .then(async () => await this.database.selectFrom("card_set").selectAll().execute())
            .then(async (cardSets: Array<Selectable<CardSetTable>>) => {
              let result = Promise.resolve();
              console.log((`retrieved ${cardSets.length} saved card sets`));
              cardSets.forEach(async (cardset: Selectable<CardSetTable>) => {
                result = result.then(async () => await this.imageCacheService.cacheCardSetSvg(cardset, progressCallback));
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
  public async processSync(cardSets: Array<ScryfallCardSet>): Promise<void> {
    return await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      await runSerial<ScryfallCardSet>(
        cardSets,
        (scryfallCardSet: ScryfallCardSet) => `Processing '${scryfallCardSet.name}'`,
        async (scryfallCardSet: ScryfallCardSet, _idx: number, _total: number) => {
          await this.genericSingleSync(
            trx,
            "card_set",
            (eb) => eb("card_set.id", "=", scryfallCardSet.id),
            this.cardSetAdapter,
            scryfallCardSet
          );
        });
    });
  }

  private async shouldSync(source: SyncSource): Promise<boolean> {
    if (source == "user" || this.configurationService.syncAtStartup.indexOf("CardSet") >= 0) {
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
