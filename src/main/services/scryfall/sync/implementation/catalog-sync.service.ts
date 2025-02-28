import { DeleteResult, Transaction, UpdateResult } from "kysely";
import { inject, injectable } from "tsyringe";
import { ProgressCallback } from "../../../../../common/ipc";
import { CatalogType } from "../../../../../common/types";
import { sqliteUTCTimeStamp } from "../../../../../common/util";
import { DatabaseSchema } from "../../../../../main/database/schema";
import { IConfigurationService, IDatabaseService, ILogService } from "../../../../../main/services/infra/interfaces";
import { runSerial } from "../../../../../main/services/infra/util";
import { INFRASTRUCTURE, SCRYFALL } from "../../../service.tokens";
import { ICatalogAdapter } from "../../adapt/interface";
import { IScryfallClient } from "../../client/interfaces";
import { ScryfallCatalog } from "../../types";
import { ICatalogSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";


type SyncSingleCatalogParameter = {
  catalogType: CatalogType;
  progressCallback: ProgressCallback;
};

@injectable()
export class CatalogSyncService extends BaseSyncService<Array<CatalogType>> implements ICatalogSyncService {
  //#region private readonly fields -------------------------------------------
  private readonly catalogAdapter: ICatalogAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.ConfigurationService) configurationService: IConfigurationService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(SCRYFALL.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(SCRYFALL.CatalogAdapter) catalogAdapter: ICatalogAdapter
  ) {
    super(databaseService, configurationService, logService, scryfallclient);
    this.catalogAdapter = catalogAdapter;
  }
  //#endregion

  //#region ICatalogSyncService methods ---------------------------------------
  public override async sync(syncParam: Array<CatalogType>, progressCallback: ProgressCallback): Promise<void> {
    const serialExecutionArray = syncParam.map<SyncSingleCatalogParameter>((catalog: CatalogType) => {
      return { catalogType: catalog, progressCallback: progressCallback };
    });
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
    await runSerial<SyncSingleCatalogParameter>(serialExecutionArray, this.syncSingleCatalog.bind(this));
    return Promise.resolve();
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async syncSingleCatalog(parameter: SyncSingleCatalogParameter): Promise<void> {
    parameter.progressCallback(`Synchronizing catalog '${parameter.catalogType}'`);

    const catalog: Promise<ScryfallCatalog> = this.scryfallclient.getCatalog(parameter.catalogType, parameter.progressCallback);
    return catalog.then((fetched: ScryfallCatalog) => {
      this.dumpScryFallData(`catalog-${parameter.catalogType}.json`, fetched);
      return this.processSync(parameter, fetched);
    });
  }

  private async processSync(parameter: SyncSingleCatalogParameter, catalog: ScryfallCatalog): Promise<void> {
    if (parameter.progressCallback) {
      parameter.progressCallback(`Saving ${catalog.total_values} items for catalog '${parameter.catalogType}'`);
    }
    /*
     * huge catalogs have to splitted, otherwise we get an error
     * error during handling sync task SqliteError: too many SQL variables
     */
    const chunks = new Array<Array<string>>();
    const chunkSize = 100;
    for (let i = 0; i < catalog.data.length; i += chunkSize) {
      chunks.push(catalog.data.slice(i, i + chunkSize));
    }
    return await this.database.transaction()
      .execute(async (trx: Transaction<DatabaseSchema>) => {
        await trx
          .deleteFrom("catalog_item").where("catalog_item.catalog_name", "=", parameter.catalogType)
          .execute()
          .then((_r: Array<DeleteResult>) => trx.updateTable("catalog_type")
            .set({ last_synced_at: sqliteUTCTimeStamp() })
            .where("catalog_type.catalog_name", "=", parameter.catalogType)
            .executeTakeFirst())
          .then(async (_r: UpdateResult) => await Promise
            .all(chunks.map((chunk: Array<string>) => trx.insertInto("catalog_item")
              .values(chunk.map((item: string) => this.catalogAdapter.toInsert({ catalogType: parameter.catalogType, item: item })))
              .executeTakeFirstOrThrow())));
      });
  }
  //#endregion
}
