import { Selectable, Transaction } from "kysely";
import { inject, injectable } from "tsyringe";

import { CatalogType } from "../../../../../common/enums";
import { CatalogSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { CatalogItemTable, DatabaseSchema } from "../../../../../main/database/schema";
import INFRATOKENS, { IDatabaseService } from "../../../../../main/services/infra/interfaces";
import { runSerial } from "../../../../../main/services/infra/util";
import ADAPTTOKENS, { ICatalogAdapter } from "../../adapt/interface";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCatalog } from "../../types";
import { ICatalogSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";
import { DtoSyncParam } from "../../../../../common/dto";

type SyncSingleCatalogParameter = {
  catalogType: CatalogType,
  progressCallback?: ProgressCallback
};

@injectable()
export class CatalogSyncService extends BaseSyncService<CatalogSyncOptions> implements ICatalogSyncService {

  //#region private readonly fields -------------------------------------------
  private readonly scryfallclient: IScryfallClient;
  private readonly catalogAdapter: ICatalogAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(ADAPTTOKENS.CatalogAdapter) catalogAdapter: ICatalogAdapter) {
    super(databaseService);
    this.scryfallclient = scryfallclient;

    this.catalogAdapter = catalogAdapter;
  }
  //#endregion

  //#region ICatalogSyncService methods ---------------------------------------
  public override async newSync(syncParam: DtoSyncParam, progressCallback: ProgressCallback): Promise<void> {
    throw new Error("not implemented");
  }

  public override async sync(options: CatalogSyncOptions, progressCallback: ProgressCallback): Promise<void> {
    return await this.shouldSync(options)
      .then(async (shouldSync: boolean) => {
        if (shouldSync) {
          console.log("Start CatalogSyncService.sync");
          const serialExecutionArray = options.catalogs.map<SyncSingleCatalogParameter>((catalog: CatalogType) => { return { catalogType: catalog, progressCallback: progressCallback }; });
          await runSerial<SyncSingleCatalogParameter>(
            serialExecutionArray,
            (param: SyncSingleCatalogParameter) => `Processing catalog '${param.catalogType}'`,
            this.syncSingleCatalog.bind(this));
        } else {
          console.log("Skip CatalogSyncService.sync");
        }
      });
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

  private async processSync(parameter: SyncSingleCatalogParameter, catalog: ScryfallCatalog): Promise<void> {
    console.log(`Retrieved ${catalog.total_values} items for catalog '${parameter.catalogType}'`);
    if (parameter.progressCallback) {
      parameter.progressCallback(`Retrieved ${catalog.total_values} items for catalog '${parameter.catalogType}'`);
    }
    return await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      await trx.deleteFrom("catalog_item").where("catalog_item.catalog_name", "=", parameter.catalogType).execute();
      await trx.insertInto("catalog_item")
        .values(catalog.data.map((item: string) => this.catalogAdapter.toInsert({ catalogType: parameter.catalogType, item: item })))
        .executeTakeFirstOrThrow();
    });
  }

  private async shouldSync(options: CatalogSyncOptions): Promise<boolean> {
    if (options.source == "user") {
      return Promise.resolve(true);
    } else {
      return await this.database
        .selectFrom("catalog_item")
        .selectAll()
        .limit(1)
        .executeTakeFirst()
        .then((existing: Selectable<CatalogItemTable>) => existing ? false : true);
    }
  }
  //#endregion
}
