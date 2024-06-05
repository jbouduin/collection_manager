import { CatalogType } from "../../../common/enums";
import { ScryfallEndpoint } from "../../../main/services/scryfall";

export interface DtoScryfallConfiguration {
  readonly scryfallApiRoot: string;
  readonly scryfallEndpoints: Map<ScryfallEndpoint, string>;
  readonly scryfallCatalogPaths: Map<CatalogType, string>;
}
