import { SyncType } from "../../../common/ipc-params";
import { DtoScryfallConfiguration } from "./scryfall-configuration.dto";

export interface DtoMainConfiguration {
  rootDataDirectory: string;
  cacheDirectory: string;
  databasePath: string;
  syncAtStartup: Array<SyncType>
  scryfallConfiguration: DtoScryfallConfiguration;
}
