import { Transaction } from "kysely";
import { inject, injectable } from "tsyringe";

import { CatalogType } from "../../../../../common/enums";
import { CatalogSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { DatabaseSchema } from "../../../../../main/database/schema";
import INFRATOKENS, { IDatabaseService } from "../../../../../main/services/infra/interfaces";
import ADAPTTOKENS, { ICatalogAdapter } from "../../adapt/interface";
import { ICatalogSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCatalog } from "../../types";
import { runSerial } from "../../../../../main/services/infra/util";

type SyncSingleCatalogParameter = {
  catalogType: CatalogType,
  progressCallback?: ProgressCallback
};

@injectable()
export class CatalogSyncService extends BaseSyncService implements ICatalogSyncService {

  //#region private readonly fields -------------------------------------------
  private readonly scryfallclient: IScryfallClient;
  private readonly catalogAdapter: ICatalogAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(ADAPTTOKENS.CatalogAdapter) catalogAdapter: ICatalogAdapter  ) {
    super(databaseService);
    this.scryfallclient = scryfallclient;
    this.catalogAdapter = catalogAdapter;
  }
  //#endregion

  //#region ICatalogSyncService methods ---------------------------------------
  public async sync(options: CatalogSyncOptions, progressCallback?: ProgressCallback): Promise<void> {
    console.log("start CatalogSyncService.sync:");
    const serialExecutionArray = options.catalogs.map<SyncSingleCatalogParameter>((catalog: CatalogType) => { return { catalogType: catalog, progressCallback: progressCallback }; });
    await runSerial<SyncSingleCatalogParameter>(serialExecutionArray, this.syncSingleCatalog.bind(this));
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async syncSingleCatalog(parameter: SyncSingleCatalogParameter): Promise<void> {
    console.log("  -> start CatalogSyncService.syncSingleCatalog", parameter.catalogType);
    if (parameter.progressCallback) {
      parameter.progressCallback(`Synchronizing catalog '${parameter.catalogType}'`);
    }
    let catalog: Promise<ScryfallCatalog>;
    switch (parameter.catalogType) {
      case "AbilityWords":
        catalog = this.scryfallclient.getCatalog("AbilityWords");
        break;
      case "ArtifactTypes":
        catalog = this.scryfallclient.getCatalog("ArtifactTypes");
        break;
      case "ArtistNames":
        catalog = this.scryfallclient.getCatalog("ArtistNames");
        break;
      case "CardNames":
        catalog = this.scryfallclient.getCatalog("CardNames");
        break;
      case "CreatureTypes":
        catalog = this.scryfallclient.getCatalog("CreatureTypes");
        break;
      case "EnchantmentTypes":
        catalog = this.scryfallclient.getCatalog("EnchantmentTypes");
        break;
      case "KeywordAbilities":
        catalog = this.scryfallclient.getCatalog("KeywordAbilities");
        break;
      case "KeywordActions":
        catalog = this.scryfallclient.getCatalog("KeywordActions");
        break;
      case "LandTypes":
        catalog = this.scryfallclient.getCatalog("LandTypes");
        break;
      case "Loyalties":
        catalog = this.scryfallclient.getCatalog("Loyalties");
        break;
      case "PlaneswalkerTypes":
        catalog = this.scryfallclient.getCatalog("PlaneswalkerTypes");
        break;
      case "Powers":
        catalog = this.scryfallclient.getCatalog("Powers");
        break;
      case "SpellTypes":
        catalog = this.scryfallclient.getCatalog("SpellTypes");
        break;
      case "Supertypes":
        catalog = this.scryfallclient.getCatalog("Supertypes");
        break;
      case "Toughnesses":
        catalog = this.scryfallclient.getCatalog("Toughnesses");
        break;
      case "Watermarks":
        catalog = this.scryfallclient.getCatalog("Watermarks");
        break;
      case "WordBank":
        catalog = this.scryfallclient.getCatalog("WordBank");
        break;
    }
    return catalog.then((fetched: ScryfallCatalog) => this.processSync(parameter, fetched));
  }

  // TODO remove items that are not on the server anymore or at least mark them
  private async processSync(parameter: SyncSingleCatalogParameter, catalog: ScryfallCatalog): Promise<void> {
    console.log(`Retrieved ${catalog.total_values} items for catalog '${parameter.catalogType}'`);
    if (parameter.progressCallback) {
      parameter.progressCallback(`Retrieved ${catalog.total_values} items for catalog '${parameter.catalogType}'`);
    }
    return await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      trx.deleteFrom("catalog_item").where("catalog_item.catalog_name", "=", parameter.catalogType).execute();
      trx.insertInto("catalog_item")
        .values(catalog.data.map((item: string) => this.catalogAdapter.toInsert({ catalogType: parameter.catalogType, item: item })))
        .executeTakeFirstOrThrow();
    });
  }
  //#endregion
}
