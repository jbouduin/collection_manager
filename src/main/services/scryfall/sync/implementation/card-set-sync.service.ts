import { Selectable, Transaction } from "kysely";
import { inject, injectable } from "tsyringe";
import { DtoSyncParam } from "../../../../../common/dto";
import { ProgressCallback } from "../../../../../common/ipc-params";
import { runSerial } from "../../../../../main/services/infra/util";
import { CardSetTable, DatabaseSchema } from "../../../../database/schema";
import { IConfigurationService, IDatabaseService, IImageCacheService, ILogService } from "../../../infra/interfaces";
import { INFRASTRUCTURE, SCRYFALL } from "../../../service.tokens";
import { ICardSetAdapter } from "../../adapt/interface";
import { IScryfallClient } from "../../client/interfaces";
import { ScryfallCardSet } from "../../types";
import { ICardSetSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";

@injectable()
export class CardSetSyncService extends BaseSyncService implements ICardSetSyncService {
  //#region private readonly fields -------------------------------------------
  private readonly cardSetAdapter: ICardSetAdapter;
  private readonly imageCacheService: IImageCacheService;
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.ConfigurationService) configurationService: IConfigurationService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(SCRYFALL.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(SCRYFALL.CardSetAdapter) cardSetAdapter: ICardSetAdapter,
    @inject(INFRASTRUCTURE.ImageCacheService) imageCacheService: IImageCacheService
  ) {
    super(databaseService, configurationService, logService, scryfallclient);
    this.cardSetAdapter = cardSetAdapter;
    this.imageCacheService = imageCacheService;
  }
  //#endregion

  //#region ICardSetSyncService methods ---------------------------------------
  public override async sync(_syncParam: DtoSyncParam, progressCallback: ProgressCallback): Promise<void> {
    progressCallback("Synchronizing Card sets");
    return await this.scryfallclient.getCardSets(progressCallback)
      .then(async (sets: Array<ScryfallCardSet>) => {
        this.dumpScryFallData("card-sets.json", sets);
        this.processSync(sets);
      })
      .then(async () => await this.database
        .selectFrom("card_set")
        .selectAll()
        .execute())
      .then(async (cardSets: Array<Selectable<CardSetTable>>) => {
        let result = Promise.resolve();
        progressCallback(`Saved ${cardSets.length} card sets`);
        cardSets.forEach(async (cardset: Selectable<CardSetTable>) => {
          result = result.then(async () => await this.imageCacheService.cacheCardSetSvg(cardset, progressCallback));
          await result;
        });
        return result;
      });
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  public async processSync(cardSets: Array<ScryfallCardSet>): Promise<void> {
    return await this.database
      .transaction()
      .execute(async (trx: Transaction<DatabaseSchema>) => {
        await runSerial<ScryfallCardSet>(
          cardSets,
          async (scryfallCardSet: ScryfallCardSet, _idx: number, _total: number) => {
            await this.genericSingleSync(
              trx,
              "card_set",
              (eb) => eb("card_set.id", "=", scryfallCardSet.id),
              this.cardSetAdapter,
              scryfallCardSet
            );
          }
        );
      });
  }
  //#endregion
}
