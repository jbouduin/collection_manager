import * as fs from "fs";
import * as path from "path";

import { DtoConfiguration, DtoRendererConfiguration, DtoSyncParam } from "../../../../common/dto";
import { DtoScryfallConfiguration } from "../../../../common/dto/configuration/scryfall-configuration.dto";
import { CatalogType } from "../../../../common/enums";
import { ScryfallEndpoint } from "../../scryfall";
import { IConfigurationService } from "../interfaces";

export class ConfigurationService implements IConfigurationService {

  //#region Private fields ----------------------------------------------------
  private configFilePath: string;
  private _configuration: DtoConfiguration;
  private _isFirstUsage: boolean;
  //#endregion

  //#region IConfigurationService properties ----------------------------------
  public get configuration(): DtoConfiguration {
    return this._configuration;
  }

  public get cacheDirectory(): string {
    return this._configuration.mainConfiguration.cacheDirectory;
  }

  public get isFirstUsage(): boolean {
    return this._isFirstUsage;
  }

  public get dataBaseFilePath(): string {
    return path.join(
      this._configuration.mainConfiguration.rootDataDirectory,
      this._configuration.mainConfiguration.databaseName
    );
  }

  public get scryfallApiRoot(): string {
    return this._configuration.scryfallConfiguration.scryfallApiRoot;
  }

  public get syncAtStartup(): DtoSyncParam {
    return this._configuration.mainConfiguration.syncAtStartup;
  }
  //#endregion

  //#region IConfiguration methods --------------------------------------------
  public loadConfiguration(appDirectory: string, homeDirectory: string, useDarkTheme: boolean): void {
    this.configFilePath = path.join(appDirectory, "collection-manager.config.json");
    if (fs.existsSync(this.configFilePath)) {
      this._configuration = JSON.parse(fs.readFileSync(this.configFilePath, "utf-8"));
      this._isFirstUsage = false;
    }
    else {
      this._configuration = this.createFactoryDefault(appDirectory, homeDirectory, useDarkTheme);
      this._isFirstUsage = true;
    }
  }

  public saveConfiguration(configuration: DtoConfiguration): boolean {
    // LATER Validation
    this.createDirectoryIfNotExists(configuration.mainConfiguration.rootDataDirectory);
    this.createDirectoryIfNotExists(configuration.mainConfiguration.cacheDirectory);
    fs.writeFileSync(this.configFilePath, JSON.stringify(configuration, null, 2));
    this._configuration = configuration;
    this._isFirstUsage = false;
    return true;
  }
  //#endregion

  //#region Auxiliary factory default methods ---------------------------------
  private createFactoryDefault(appDirectory: string, homeDirectory: string, useDarkTheme: boolean): DtoConfiguration {
    const result: DtoConfiguration = {
      mainConfiguration: {
        rootDataDirectory: path.join(homeDirectory, "collection-manager"),
        cacheDirectory: path.join(appDirectory, ".cache"),
        databaseName: "magic-db.sqlite",
        syncAtStartup: this.createSyncAtStartupFactoryDefault()
      },
      rendererConfiguration: this.createRendererConfigurationFactoryDefault(useDarkTheme)        ,
      scryfallConfiguration: this.createScryFallFactoryDefault()
    };
    return result;
  }

  private createScryFallFactoryDefault(): DtoScryfallConfiguration {
    const catalogPaths: Record<CatalogType, string> = {
      "AbilityWords": "ability-words",
      "ArtifactTypes": "artifact-types",
      "ArtistNames": "artist-names",
      "CardNames": "card-names",
      "CreatureTypes": "creature-types",
      "EnchantmentTypes": "enchantment-types",
      "KeywordAbilities": "keyword-abilities",
      "KeywordActions": "keyword-actions",
      "LandTypes": "land-types",
      "Loyalties": "loyalties",
      "PlaneswalkerTypes": "planeswalker-types",
      "Powers": "powers",
      "SpellTypes": "spell-types",
      "Supertypes": "super-types",
      "Toughnesses": "toughnesses",
      "Watermarks": "watermarks",
      "WordBank": "word-bank"
    };

    const endpoints: Record<ScryfallEndpoint, string> = {
      "cards": "card/:id",
      "cardSet": "sets",
      "cardSymbol": "symbology",
      "catalog": "catalog",
      "collection": "cards/collection",
      "ruling": "cards/:id/rulings",
      "search": "cards/search"
    };

    const result: DtoScryfallConfiguration = {
      cardBackRoot: "https://backs.scryfall.io",
      scryfallApiRoot: "https://api.scryfall.com",
      scryfallEndpoints: endpoints,
      scryfallCatalogPaths: catalogPaths,
      // Scryfall api requests 50-100 ms between calls, let's give it some slack
      minimumRequestTimeout: 60,
      dumpRetrievedData: false,
      // Scryfall api allows up to 75 per collection
      collectionChunkSize: 50
    };
    return result;
  }

  private createSyncAtStartupFactoryDefault(): DtoSyncParam {
    const result: DtoSyncParam = {
      catalogTypesToSync: [],
      syncCardSymbols: false,
      syncCardSets: false,
      rulingSyncType: "none",
      cardSyncType: "none",
      cardSelectionToSync: [],
      cardImageStatusToSync: [],
      syncCardsSyncedBeforeNumber: 0,
      syncCardsSyncedBeforeUnit: undefined,
      cardSetCodeToSyncCardsFor: undefined,
      changedImageStatusAction: "delete"
    };
    return result;
  }

  private createRendererConfigurationFactoryDefault(useDarkTheme: boolean): DtoRendererConfiguration {
    const result: DtoRendererConfiguration = {
      useDarkTheme: useDarkTheme,
      databaseViewConfiguration: {
        cardSetSort: "releaseDateDescending",
        cardSetGroupBy: "parent",
        cardSetTypeFilter: {
          "core": true,
          "expansion": true,
          "token": true,
          "starter": true,
          "duel_deck": true,
          "promo": false,
          "commander": false,
          "masters": false,
          "alchemy": false,
          "masterpiece": false,
          "arsenal": false,
          "from_the_vault": false,
          "spellbook": false,
          "premium_deck": false,
          "draft_innovation": false,
          "treasure_chest": false,
          "planechase": false,
          "archenemy": false,
          "vanguard": false,
          "funny": false,
          "box": false,
          "memorabilia": false,
          "minigame": false
        }
      }
    };
    return result;
  }
  //#endregion

  //#region Auxiliary validation related methods ------------------------------
  private createDirectoryIfNotExists(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }
  //#endregion
}
