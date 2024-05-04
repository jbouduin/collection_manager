import { Catalog } from "scryfall-sdk";
import { inject, injectable } from "tsyringe";
import { CatalogType } from "../../../../common/enums";
import { ICatalogSyncOptions } from "../../../../common/ipc-params";
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

  public async sync(options: ICatalogSyncOptions): Promise<void> {
    await Promise.all(options.catalogs.map((catalog: CatalogType) => this.syncSingleCatalog(catalog)));
  }

  private async syncSingleCatalog(catalog: CatalogType): Promise<void> {
    let items: Array<string>;
    switch (catalog) {
      case "AbilityWords":
        items = await Catalog.abilityWords();
        break;
      case "ArtifactTypes":
        items = await Catalog.artifactTypes();
        break;
      case "ArtistNames":
        items = await Catalog.artistNames();
        break;
      case "CardNames":
        items = await Catalog.cardNames();
        break;
      case "CreatureTypes":
        items = await Catalog.creatureTypes();
        break;
      case "EnchantmentTypes":
        items = await Catalog.enchantmentTypes();
        break;
      case "KeywordAbilities":
        items = await Catalog.keywordAbilities();
        break;
      case "KeywordActions":
        items = await Catalog.keywordActions();
        break;
      case "LandTypes":
        items = await Catalog.landTypes();
        break;
      case "Loyalties":
        items = await Catalog.loyalties();
        break;
      case "PlaneswalkerTypes":
        items = await Catalog.planeswalkerTypes();
        break;
      case "Powers":
        items = await Catalog.powers();
        break;
      case "SpellTypes":
        items = await Catalog.spellTypes();
        break;
      case "Supertypes":
        items = await Catalog.supertypes();
        break;
      case "Toughnesses":
        items = await Catalog.toughnesses();
        break;
      case "Watermarks":
        items = await Catalog.watermarks();
        break;
      case "WordBank":
        items = await Catalog.wordBank();
        break;
    }

    await this.catalogRepository.sync(catalog, items);
  }

}
