import { Transaction } from "kysely";
import { Catalog } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { CatalogType } from "../../../../../common/enums";
import { CatalogSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { DatabaseSchema } from "../../../../../main/database/schema";
import INFRATOKENS, { IDatabaseService } from "../../../../../main/services/infra/interfaces";
import ADAPTTOKENS, { ICatalogAdapter } from "../../adapt/interface";
import { ICatalogSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";

@injectable()
export class CatalogSyncService extends BaseSyncService implements ICatalogSyncService {

  private catalogAdapter: ICatalogAdapter;

  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(ADAPTTOKENS.CatalogAdapter) catalogAdapter: ICatalogAdapter) {
    super(databaseService);
    this.catalogAdapter = catalogAdapter;
  }

  public async sync(options: CatalogSyncOptions, progressCallback?: ProgressCallback): Promise<void> {
    console.log("start CatalogSyncService.sync:");
    if (progressCallback) {
      progressCallback("sync catalogs");
    }
    await Promise.all(options.catalogs.map((catalog: CatalogType) => this.syncSingleCatalog(catalog)));
  }

  private async syncSingleCatalog(catalog: CatalogType, progressCallback?: ProgressCallback): Promise<void> {
    console.log("  -> start CatalogSyncService.syncSingleCatalog", catalog);
    if (progressCallback) {
      progressCallback(`Synchronizing ${catalog}`);
    }
    let items: Promise<Array<string>>;
    switch (catalog) {
      case "AbilityWords":
        items = Catalog.abilityWords();
        break;
      case "ArtifactTypes":
        items = Catalog.artifactTypes();
        break;
      case "ArtistNames":
        items = Catalog.artistNames();
        break;
      case "CardNames":
        items = Catalog.cardNames();
        break;
      case "CreatureTypes":
        items = Catalog.creatureTypes();
        break;
      case "EnchantmentTypes":
        items = Catalog.enchantmentTypes();
        break;
      case "KeywordAbilities":
        items = Catalog.keywordAbilities();
        break;
      case "KeywordActions":
        items = Catalog.keywordActions();
        break;
      case "LandTypes":
        items = Catalog.landTypes();
        break;
      case "Loyalties":
        items = Catalog.loyalties();
        break;
      case "PlaneswalkerTypes":
        items = Catalog.planeswalkerTypes();
        break;
      case "Powers":
        items = Catalog.powers();
        break;
      case "SpellTypes":
        items = Catalog.spellTypes();
        break;
      case "Supertypes":
        items = Catalog.supertypes();
        break;
      case "Toughnesses":
        items = Catalog.toughnesses();
        break;
      case "Watermarks":
        items = Catalog.watermarks();
        break;
      case "WordBank":
        items = Catalog.wordBank();
        break;
    }
    return items.then((items: Array<string>) => this.processSync(catalog, items));
  }

  // TODO remove items that are not on the server anymore or at least mark them
  private async processSync(catalogType: CatalogType, items: Array<string>): Promise<void> {
    return await this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      trx.deleteFrom("catalog_item").where("catalog_item.catalog_name", "=", catalogType).execute();
      trx.insertInto("catalog_item")
        .values(items.map((item:string)=> this.catalogAdapter.toInsert({ catalogType: catalogType, item: item })))
        .executeTakeFirstOrThrow();
    });
  }
}
