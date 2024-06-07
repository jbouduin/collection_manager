import * as fs from "fs";
import * as path from "path";

import { CatalogType } from "../../../../common/enums";
import { ScryfallEndpoint } from "../../scryfall";
import { IConfigurationService } from "../interfaces";
import { SyncType } from "../../../../common/ipc-params";
import { DtoConfiguration } from "../../../../common/dto/configuration/configuration.dto";
import { DtoScryfallConfiguration } from "../../../../common/dto/configuration/scryfall-configuration.dto";


// FEATURE configuration
// cleanup the getters, they should not call fs methods
export class ConfigurationService implements IConfigurationService {

  private configFilePath: string;
  private _configuration: DtoConfiguration;
  private _isFirstUsage: boolean;

  public get configuration(): DtoConfiguration {
    return this._configuration;
  }

  public get dataDirectory(): string {
    const result = "C:/data/new-assistant";
    if (!fs.existsSync(result)) {
      fs.mkdirSync(result, { recursive: true });
    }
    return result;
  }

  public get dataBaseFilePath(): string {
    return path.join(
      this._configuration.mainConfiguration.rootDataDirectory,
      this._configuration.mainConfiguration.databaseName
    );
  }

  public get cacheDirectory(): string {
    const result = path.join(this.dataDirectory, ".cache");
    if (!fs.existsSync(result)) {
      console.log(`creating ${result}`);
      fs.mkdirSync(result, { recursive: true });
    }
    return result;
  }

  public get isFirstUsage(): boolean {
    return this._isFirstUsage;
  }

  public get scryfallApiRoot(): string {
    return "https://api.scryfall.com";
  }

  public get scryfallEndpoints(): Map<ScryfallEndpoint, string> {
    const endpoints = new Map<ScryfallEndpoint, string>();
    endpoints.set("card", "cards/search");
    endpoints.set("cardSet", "sets");
    endpoints.set("cardSymbol", "symbology");
    endpoints.set("catalog", "catalog");
    endpoints.set("ruling", "cards/:id/rulings");
    endpoints.set("collection", "cards/collection");
    return endpoints;
  }

  public get scryfallCatalogPaths(): Map<CatalogType, string> {
    const result = new Map<CatalogType, string>();
    result.set("AbilityWords", "ability-words");
    result.set("ArtifactTypes", "artifact-types");
    result.set("ArtistNames", "artist-names");
    result.set("CardNames", "card-names");
    result.set("CreatureTypes", "creature-types");
    result.set("EnchantmentTypes", "enchantment-types");
    result.set("KeywordAbilities", "keyword-abilities");
    result.set("KeywordActions", "keyword-actions");
    result.set("LandTypes", "land-types");
    result.set("Loyalties", "loyalties");
    result.set("PlaneswalkerTypes", "planeswalker-types");
    result.set("Powers", "powers");
    result.set("SpellTypes", "spell-types");
    result.set("Supertypes", "super-types");
    result.set("Toughnesses", "toughnesses");
    result.set("Watermarks", "watermarks");
    result.set("WordBank", "word-bank");
    return result;
  }

  public get syncAtStartup(): Array<SyncType> {
    return new Array<SyncType>();
  }

  //#region Constructor & C° --------------------------------------------------
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
        scryfallConfiguration: this.createScryFallFactoryDefault(),
        cacheDirectory: path.join(appDirectory, ".cache"),
        databaseName: "magic-db.sqlite",
        syncAtStartup: new Array<SyncType>()
      },
      rendererConfiguration: {
        useDarkTheme: useDarkTheme
      }
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
      "card": "cards/search",
      "cardSet": "sets",
      "cardSymbol": "symbology",
      "catalog": "catalog",
      "ruling": "cards/:id/rulings",
      "collection": "cards/collection"
    };

    const result: DtoScryfallConfiguration = {
      scryfallApiRoot: "https://api.scryfall.com",
      scryfallEndpoints: endpoints,
      scryfallCatalogPaths: catalogPaths
    };
    console.log(JSON.stringify(result, null,2));
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
