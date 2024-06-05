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
  private configuration: DtoConfiguration;
  private _isFirstUsage: boolean;

  public get dataDirectory(): string {
    const result = "C:/data/new-assistant";
    if (!fs.existsSync(result)) {
      fs.mkdirSync(result, { recursive: true });
    }
    return result;
  }

  public get dataBaseName(): string {
    return path.join(this.dataDirectory, "database", "magic-db.sqlite");
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
    this.configFilePath = path.join(appDirectory, "config.json");
    if (fs.existsSync(this.configFilePath)) {
      this.configuration = JSON.parse(fs.readFileSync(this.configFilePath, "utf-8"));
      this._isFirstUsage = false;
    }
    else {
      this.configuration = this.createFactoryDefault(appDirectory, homeDirectory, useDarkTheme);
      this._isFirstUsage = true;
    }
  }

  public saveConfiguration(configuration: DtoConfiguration): void {
    fs.writeFileSync(this.configFilePath, JSON.stringify(configuration, null, 2));
    this.configuration = configuration;
  }
  //#endregion

  //#region Auxiliary factory default methods ---------------------------------
  private createFactoryDefault(appDirectory: string, homeDirectory: string, useDarkTheme: boolean): DtoConfiguration {
    const result: DtoConfiguration = {
      mainConfiguration: {
        rootDataDirectory: path.join(homeDirectory, "collection-manager"),
        scryfallConfiguration: this.createScryFallFactoryDefault(),
        cacheDirectory: path.join(appDirectory, ".cache"),
        databasePath: path.join(homeDirectory, "collection-manager", "magic-db.sqlite"),
        syncAtStartup: new Array<SyncType>()
      },
      rendererConfiguration: {
        useDarkTheme: useDarkTheme
      }
    }
    console.log(result);
    return result;
  }

  private createScryFallFactoryDefault(): DtoScryfallConfiguration {
    const catalogPaths = new Map<CatalogType, string>();
    catalogPaths.set("AbilityWords", "ability-words");
    catalogPaths.set("ArtifactTypes", "artifact-types");
    catalogPaths.set("ArtistNames", "artist-names");
    catalogPaths.set("CardNames", "card-names");
    catalogPaths.set("CreatureTypes", "creature-types");
    catalogPaths.set("EnchantmentTypes", "enchantment-types");
    catalogPaths.set("KeywordAbilities", "keyword-abilities");
    catalogPaths.set("KeywordActions", "keyword-actions");
    catalogPaths.set("LandTypes", "land-types");
    catalogPaths.set("Loyalties", "loyalties");
    catalogPaths.set("PlaneswalkerTypes", "planeswalker-types");
    catalogPaths.set("Powers", "powers");
    catalogPaths.set("SpellTypes", "spell-types");
    catalogPaths.set("Supertypes", "super-types");
    catalogPaths.set("Toughnesses", "toughnesses");
    catalogPaths.set("Watermarks", "watermarks");
    catalogPaths.set("WordBank", "word-bank");

    const endpoints = new Map<ScryfallEndpoint, string>();
    endpoints.set("card", "cards/search");
    endpoints.set("cardSet", "sets");
    endpoints.set("cardSymbol", "symbology");
    endpoints.set("catalog", "catalog");
    endpoints.set("ruling", "cards/:id/rulings");
    endpoints.set("collection", "cards/collection");

    const result: DtoScryfallConfiguration = {
      scryfallApiRoot: "https://api.scryfall.com",
      scryfallEndpoints: endpoints,
      scryfallCatalogPaths: catalogPaths
    }
    return result;
  }
  //#endregion
}
