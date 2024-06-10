import { CatalogType } from "../../../common/enums";
import { ScryfallEndpoint } from "../../../main/services/scryfall";

export interface DtoScryfallConfiguration {
  readonly scryfallApiRoot: string;
  readonly scryfallEndpoints: Record<ScryfallEndpoint, string>;
  readonly scryfallCatalogPaths: Record<CatalogType, string>;
  readonly minimumRequestTimeout: number;
  readonly collectionChunkSize: number;
  dumpRetrievedData: boolean;
}
