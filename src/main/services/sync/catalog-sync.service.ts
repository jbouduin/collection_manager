import { Catalog } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";
import { ECatalogType } from "../../../common/enums";
import { ICatalogSyncOptions } from "../../../common/ipc-params";
import { ICatalogRepository } from "../database/repositories/catalog.repository";
import TOKENS from "../tokens";
import { IBaseSyncService } from "./base-sync.service";

export interface ICatalogSyncService extends IBaseSyncService<ICatalogSyncOptions> {

}

@injectable()
export class CatalogSyncService implements ICatalogSyncService {

  private catalogRepository: ICatalogRepository;

  public constructor(
    @inject(TOKENS.CatalogRepository) catalogRepository: ICatalogRepository
  ) {
    this.catalogRepository = catalogRepository;
  }

  public async sync(options: ICatalogSyncOptions): Promise<void> {
    await Promise.all(options.catalogs.map((catalog: ECatalogType) => this.syncSingleCatalog(catalog)));
  }

  private async syncSingleCatalog(catalog: ECatalogType): Promise<void> {
    let items: Array<string>;
    switch (catalog) {
      case ECatalogType.AbilityWords:
        items = await Catalog.abilityWords();
        break;
      case ECatalogType.ArtifactTypes:
        items = await Catalog.artifactTypes();
        break;
      case ECatalogType.ArtistNames:
        items = await Catalog.artistNames();
        break;
      case ECatalogType.CardNames:
        items = await Catalog.cardNames();
        break;
      case ECatalogType.CreatureTypes:
        items = await Catalog.creatureTypes();
        break;
      case ECatalogType.EnchantmentTypes:
        items = await Catalog.enchantmentTypes();
        break;
      case ECatalogType.KeywordAbilities:
        items = await Catalog.keywordAbilities();
        break;
      case ECatalogType.KeywordActions:
        items = await Catalog.keywordActions();
        break;
      case ECatalogType.LandTypes:
        items = await Catalog.landTypes();
        break;
      case ECatalogType.Loyalties:
        items = await Catalog.loyalties();
        break;
      case ECatalogType.PlaneswalkerTypes:
        items = await Catalog.planeswalkerTypes();
        break;
      case ECatalogType.Powers:
        items = await Catalog.powers();
        break;
      case ECatalogType.SpellTypes:
        items = await Catalog.spellTypes();
        break;
      case ECatalogType.Supertypes:
        items = await Catalog.supertypes();
        break;
      case ECatalogType.Toughnesses:
        items = await Catalog.toughnesses();
        break;
      case ECatalogType.Watermarks:
        items = await Catalog.watermarks();
        break;
      case ECatalogType.WordBank:
        items = await Catalog.wordBank();
        break;
    }

    await this.catalogRepository.sync(catalog, items);
  }

}
