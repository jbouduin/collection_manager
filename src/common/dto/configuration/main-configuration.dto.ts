import { SyncType } from "../../../common/ipc-params";
import { DtoScryfallConfiguration } from "./scryfall-configuration.dto";

export interface DtoMainConfiguration {
  rootDataDirectory: string;
  cacheDirectory: string;
  databaseName: string;
  syncAtStartup: Array<SyncType>
  scryfallConfiguration: DtoScryfallConfiguration;
}
