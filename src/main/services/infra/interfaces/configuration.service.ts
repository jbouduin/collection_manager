import { SyncType } from "../../../../common/ipc-params";
import { CatalogType } from "../../../../common/enums";
import { ScryfallEndpoint } from "../../scryfall";

export interface IConfigurationService {
  readonly isFirstUsage: boolean;
  readonly cacheDirectory: string;
  readonly dataBaseName: string;
  readonly dataDirectory: string;
  readonly scryfallApiRoot: string;
  readonly scryfallEndpoints: Map<ScryfallEndpoint, string>;
  readonly scryfallCatalogPaths: Map<CatalogType, string>;
  readonly syncAtStartup: Array<SyncType>;

  loadConfiguration(appDirectory: string, homeDirectory: string, useDarkTheme: boolean): void;
}
