import { Transaction } from "kysely";
import { inject, injectable } from "tsyringe";

import { DtoSyncParam } from "../../../../../common/dto";
import { CatalogType } from "../../../../../common/enums";
import { ProgressCallback } from "../../../../../common/ipc-params";
import { DatabaseSchema } from "../../../../../main/database/schema";
import INFRATOKENS, { IConfigurationService, IDatabaseService } from "../../../../../main/services/infra/interfaces";
import { runSerial } from "../../../../../main/services/infra/util";
import ADAPTTOKENS, { ICatalogAdapter } from "../../adapt/interface";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCatalog } from "../../types";
import { ICatalogSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";

type SyncSingleCatalogParameter = {
  catalogType: CatalogType,
  progressCallback: ProgressCallback
};

@injectable()
export class CatalogSyncService extends BaseSyncService implements ICatalogSyncService {

  //#region private readonly fields -------------------------------------------
  private readonly catalogAdapter: ICatalogAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRATOKENS.ConfigurationService) configurationService: IConfigurationService,
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(ADAPTTOKENS.CatalogAdapter) catalogAdapter: ICatalogAdapter) {
    super(databaseService, configurationService, scryfallclient);
    this.catalogAdapter = catalogAdapter;
  }
  //#endregion

  //#region ICatalogSyncService methods ---------------------------------------
  public override async sync(syncParam: DtoSyncParam, progressCallback: ProgressCallback): Promise<void> {
    const serialExecutionArray = syncParam.catalogTypesToSync.map<SyncSingleCatalogParameter>((catalog: CatalogType) => { return { catalogType: catalog, progressCallback: progressCallback }; });
    await runSerial<SyncSingleCatalogParameter>(serialExecutionArray, this.syncSingleCatalog.bind(this));
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async syncSingleCatalog(parameter: SyncSingleCatalogParameter): Promise<void> {
    parameter.progressCallback(`Synchronizing catalog '${parameter.catalogType}'`);

    let catalog: Promise<ScryfallCatalog>;
    switch (parameter.catalogType) {
      case "AbilityWords":
        catalog = this.scryfallclient.getCatalog("AbilityWords", parameter.progressCallback);
        break;
      case "ArtifactTypes":
        catalog = this.scryfallclient.getCatalog("ArtifactTypes", parameter.progressCallback);
        break;
      case "ArtistNames":
        catalog = this.scryfallclient.getCatalog("ArtistNames", parameter.progressCallback);
        break;
      case "CardNames":
        catalog = this.scryfallclient.getCatalog("CardNames", parameter.progressCallback);
        break;
      case "CreatureTypes":
        catalog = this.scryfallclient.getCatalog("CreatureTypes", parameter.progressCallback);
        break;
      case "EnchantmentTypes":
        catalog = this.scryfallclient.getCatalog("EnchantmentTypes", parameter.progressCallback);
        break;
      case "KeywordAbilities":
        catalog = this.scryfallclient.getCatalog("KeywordAbilities", parameter.progressCallback);
        break;
      case "KeywordActions":
        catalog = this.scryfallclient.getCatalog("KeywordActions", parameter.progressCallback);
        break;
      case "LandTypes":
        catalog = this.scryfallclient.getCatalog("LandTypes", parameter.progressCallback);
        break;
      case "Loyalties":
        catalog = this.scryfallclient.getCatalog("Loyalties", parameter.progressCallback);
        break;
      case "PlaneswalkerTypes":
        catalog = this.scryfallclient.getCatalog("PlaneswalkerTypes", parameter.progressCallback);
        break;
      case "Powers":
        catalog = this.scryfallclient.getCatalog("Powers", parameter.progressCallback);
        break;
      case "SpellTypes":
        catalog = this.scryfallclient.getCatalog("SpellTypes", parameter.progressCallback);
        break;
      case "Supertypes":
        catalog = this.scryfallclient.getCatalog("Supertypes", parameter.progressCallback);
        break;
      case "Toughnesses":
        catalog = this.scryfallclient.getCatalog("Toughnesses", parameter.progressCallback);
        break;
      case "Watermarks":
        catalog = this.scryfallclient.getCatalog("Watermarks", parameter.progressCallback);
        break;
      case "WordBank":
        catalog = this.scryfallclient.getCatalog("WordBank", parameter.progressCallback);
        break;
    }
    return catalog.then((fetched: ScryfallCatalog) => {
      this.dumpScryFallData(`catalog-${parameter}.json`, fetched);
      this.processSync(parameter, fetched);
    });
  }

  private async processSync(parameter: SyncSingleCatalogParameter, catalog: ScryfallCatalog): Promise<void> {
    if (parameter.progressCallback) {
      parameter.progressCallback(`Saving ${catalog.total_values} items for catalog '${parameter.catalogType}'`);
    }
    return await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      await trx.deleteFrom("catalog_item").where("catalog_item.catalog_name", "=", parameter.catalogType).execute();
      await trx.insertInto("catalog_item")
        .values(catalog.data.map((item: string) => this.catalogAdapter.toInsert({ catalogType: parameter.catalogType, item: item })))
        .executeTakeFirstOrThrow();
    });
  }
  //#endregion
}
