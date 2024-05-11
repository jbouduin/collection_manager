import { Catalog } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";

import { CatalogType } from "../../../../common/enums";
import { CatalogSyncOptions } from "../../../../common/ipc-params";
import { ProgressCallback } from "../../infra/implementation";
import REPOTOKENS, { ICatalogRepository } from "../../repo/interfaces";
import { ICatalogSyncService } from "../interfaces";

@injectable()
export class CatalogSyncService implements ICatalogSyncService {

  private readonly catalogRepository: ICatalogRepository;

  public constructor(
    @inject(REPOTOKENS.CatalogRepository) catalogRepository: ICatalogRepository
  ) {
    this.catalogRepository = catalogRepository;
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
      progressCallback(`sync ${catalog}`);
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
    return items.then((items: Array<string>) => this.catalogRepository.sync(catalog, items));
  }

}
