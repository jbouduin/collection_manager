import { SyncType } from "../../../../common/ipc-params";
import { CatalogType } from "../../../../common/enums";
import { ScryfallEndpoint } from "../../scryfall";
import { DtoConfiguration } from "../../../../common/dto/configuration/configuration.dto";

export interface IConfigurationService {
  readonly isFirstUsage: boolean;
  readonly cacheDirectory: string;
  readonly dataBaseName: string;
  readonly dataDirectory: string;
  readonly scryfallApiRoot: string;
  readonly scryfallEndpoints: Map<ScryfallEndpoint, string>;
  readonly scryfallCatalogPaths: Map<CatalogType, string>;
  readonly syncAtStartup: Array<SyncType>;

  readonly configuration: DtoConfiguration;
  loadConfiguration(appDirectory: string, homeDirectory: string, useDarkTheme: boolean): void;
}
