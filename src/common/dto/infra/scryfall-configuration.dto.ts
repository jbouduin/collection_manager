import { ScryfallEndpoint } from "../../types";

// TODO move this to the databasse
export interface DtoScryfallConfiguration {
  readonly scryfallApiRoot: string;
  readonly cardBackRoot: string;
  readonly scryfallEndpoints: Record<ScryfallEndpoint, string>;
  readonly minimumRequestTimeout: number;
  readonly collectionChunkSize: number;
  dumpRetrievedData: boolean;
}
