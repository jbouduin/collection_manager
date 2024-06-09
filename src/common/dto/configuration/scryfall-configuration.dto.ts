import { CatalogType } from "../../../common/enums";
import { ScryfallEndpoint } from "../../../main/services/scryfall";

export interface DtoScryfallConfiguration {
  readonly scryfallApiRoot: string;
  readonly scryfallEndpoints: Record<ScryfallEndpoint, string>;
  readonly scryfallCatalogPaths: Record<CatalogType, string>;
  // the api requests 50-100 ms between calls, let's give it some slack
  readonly minimumRequestTimeout: number;
  dumpRetrievedData: boolean;
}
