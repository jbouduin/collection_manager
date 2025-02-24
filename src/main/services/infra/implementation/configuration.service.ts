import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { inject, singleton } from "tsyringe";
import { ConfigurationDto, DtoScryfallConfiguration, RendererConfigurationDto, SyncParamDto } from "../../../../common/dto";
import { CatalogType, ScryfallEndpoint } from "../../../../common/types";
import { BaseService, IResult } from "../../base";
import { INFRASTRUCTURE } from "../../service.tokens";
import { IConfigurationService, ILogService, IResultFactory } from "../interfaces";


@singleton()
export class ConfigurationService extends BaseService implements IConfigurationService {
  //#region Private fields ----------------------------------------------------
  private configFilePath: string;
  private appDirectory: string;
  private homeDirectory: string;
  private useDarkTheme: boolean;
  private _configuration: ConfigurationDto;
  private _isFirstUsage: boolean;
  //#endregion

  //#region IConfigurationService properties ----------------------------------
  public get configuration(): ConfigurationDto {
    return this._configuration;
  }

  public get isFirstUsage(): boolean {
    return this._isFirstUsage;
  }

  public get dataBaseFilePath(): string {
    return join(
      this._configuration.dataConfiguration.rootDataDirectory,
      this._configuration.dataConfiguration.databaseName
    );
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
  }
  //#endregion

  //#region ISettingsService methods ------------------------------------------
  public loadSettings(appDirectory: string, homeDirectory: string, useDarkTheme: boolean): void {
    this.appDirectory = appDirectory;
    this.homeDirectory = homeDirectory;
    this.useDarkTheme = useDarkTheme;
    this.configFilePath = join(appDirectory, "collection-manager.config.json");
    if (existsSync(this.configFilePath)) {
      this._configuration = JSON.parse(readFileSync(this.configFilePath, "utf-8")) as ConfigurationDto;
      this._isFirstUsage = false;
    } else {
      this._configuration = this.createFactoryDefault();
      this._isFirstUsage = true;
    }
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  public getSettings(): Promise<IResult<ConfigurationDto>> {
    return this.resultFactory.createSuccessResultPromise(this._configuration);
  }

  public getFactoryDefault(): Promise<IResult<ConfigurationDto>> {
    return this.resultFactory.createSuccessResultPromise(this.createFactoryDefault());
  }

  public putSettings(configuration: ConfigurationDto): Promise<IResult<ConfigurationDto>> {
    // LATER Validation
    this.createDirectoryIfNotExists(dirname(this.configFilePath));
    writeFileSync(this.configFilePath, JSON.stringify(configuration, null, 2));
    this._configuration = configuration;
    this._isFirstUsage = false;
    return this.resultFactory.createSuccessResultPromise<ConfigurationDto>(configuration);
  }

  public setSettings(configuration: ConfigurationDto): Promise<IResult<ConfigurationDto>> {
    writeFileSync(this.configFilePath, JSON.stringify(configuration, null, 2));
    this._configuration = configuration;
    this._isFirstUsage = false;
    return this.resultFactory.createSuccessResultPromise<ConfigurationDto>(configuration);
  }
  //#endregion

  //#region Auxiliary factory default methods ---------------------------------
  private createFactoryDefault(): ConfigurationDto {
    const result: ConfigurationDto = {
      dataConfiguration: {
        rootDataDirectory: join(this.homeDirectory, "collection-manager"),
        cacheDirectory: join(this.appDirectory, ".cache"),
        databaseName: "magic-db.sqlite"
      },
      syncAtStartupConfiguration: this.createSyncAtStartupFactoryDefault(),
      rendererConfiguration: this.createRendererConfigurationFactoryDefault(this.useDarkTheme),
      scryfallConfiguration: this.createScryFallFactoryDefault()
    };
    return result;
  }

  private createScryFallFactoryDefault(): DtoScryfallConfiguration {
    const catalogPaths: Record<CatalogType, string> = {
      AbilityWords: "ability-words",
      ArtifactTypes: "artifact-types",
      ArtistNames: "artist-names",
      CardNames: "card-names",
      CreatureTypes: "creature-types",
      EnchantmentTypes: "enchantment-types",
      KeywordAbilities: "keyword-abilities",
      KeywordActions: "keyword-actions",
      LandTypes: "land-types",
      Loyalties: "loyalties",
      PlaneswalkerTypes: "planeswalker-types",
      Powers: "powers",
      SpellTypes: "spell-types",
      Supertypes: "super-types",
      Toughnesses: "toughnesses",
      Watermarks: "watermarks",
      WordBank: "word-bank"
    };

    const endpoints: Record<ScryfallEndpoint, string> = {
      cards: "card/:id",
      cardSet: "sets",
      cardSymbol: "symbology",
      catalog: "catalog",
      collection: "cards/collection",
      ruling: "cards/:id/rulings",
      search: "cards/search"
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

  private createSyncAtStartupFactoryDefault(): SyncParamDto {
    const result: SyncParamDto = {
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
      changedImageStatusAction: "delete",
      oracleId: undefined
    };
    return result;
  }

  private createRendererConfigurationFactoryDefault(useDarkTheme: boolean): RendererConfigurationDto {
    const result: RendererConfigurationDto = {
      useDarkTheme: useDarkTheme,
      logServerResponses: false,
      databaseViewTreeConfiguration: {
        cardSetSort: "releaseDateDescending",
        cardSetGroupBy: "parent",
        cardSetTypeFilter: [
          "core",
          "expansion",
          "token",
          "starter",
          "duel_deck",
          "promo"
        ]
      }
    };
    return result;
  }
  //#endregion

  //#region Auxiliary validation related methods ------------------------------
  private createDirectoryIfNotExists(directory: string): void {
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
  }
  //#endregion
}
