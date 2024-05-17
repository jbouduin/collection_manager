import { CatalogType } from "../../../../common/enums";
import { ScryfallEndpoint } from "../../scryfall";

export interface IConfigurationService {
  readonly isNewInstallation: boolean;
  readonly cacheDirectory: string;
  readonly dataBaseName: string;
  readonly dataDirectory: string;
  readonly scryfallApiRoot: string;
  readonly scryfallEndpoints: Map<ScryfallEndpoint, string>;
  readonly scryfallCatalogPaths: Map<CatalogType, string>;
}
