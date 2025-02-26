import { CatalogType, ScryfallEndpoint } from "../../types";


export interface DtoScryfallConfiguration {
  readonly scryfallApiRoot: string;
  readonly cardBackRoot: string;
  readonly scryfallEndpoints: Record<ScryfallEndpoint, string>;
  readonly scryfallCatalogPaths: Record<CatalogType, string>;
  readonly minimumRequestTimeout: number;
  readonly collectionChunkSize: number;
  dumpRetrievedData: boolean;
}
