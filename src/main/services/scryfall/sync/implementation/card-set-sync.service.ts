import { Selectable, Transaction } from "kysely";
import { inject, injectable } from "tsyringe";
import { ProgressCallback } from "../../../../../common/ipc";
import { runSerial } from "../../../../../main/services/infra/util";
import { CardSetTable, DatabaseSchema } from "../../../../database/schema";
import { IConfigurationService, IDatabaseService, IImageCacheService, ILogService } from "../../../infra/interfaces";
import { INFRASTRUCTURE, SCRYFALL } from "../../../service.tokens";
import { ICardSetAdapter } from "../../adapt/interface";
import { IScryfallClient } from "../../client/interfaces";
import { IScryfallCardSetDto } from "../../dto";
import { ICardSetSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";

@injectable()
export class CardSetSyncService extends BaseSyncService<void> implements ICardSetSyncService {
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
  public override async sync(_syncParam: void, progressCallback: ProgressCallback): Promise<void> {
    progressCallback("Synchronizing Card sets");
    return await this.scryfallclient.getCardSets(progressCallback)
      .then((sets: Array<IScryfallCardSetDto>) => {
        this.dumpScryFallData("card-sets.json", sets);
        return this.processSync(sets);
      })
      .then(async () => await this.database
        .selectFrom("card_set")
        .selectAll()
        .execute())
      .then((cardSets: Array<Selectable<CardSetTable>>) => {
        progressCallback(`Saved ${cardSets.length} card sets`);
        return runSerial(
          cardSets,
          (cardSet: Selectable<CardSetTable>) => this.imageCacheService.cacheCardSetSvg(cardSet, progressCallback)
        );
      });
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  public async processSync(cardSets: Array<IScryfallCardSetDto>): Promise<void> {
    return await this.database
      .transaction()
      .execute(async (trx: Transaction<DatabaseSchema>) => {
        await runSerial<IScryfallCardSetDto>(
          cardSets,
          async (scryfallCardSet: IScryfallCardSetDto, _idx: number, _total: number) => {
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
