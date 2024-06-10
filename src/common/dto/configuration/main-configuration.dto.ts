import { DtoSyncParam } from "../sync/sync-param.dto";

export interface DtoMainConfiguration {
  rootDataDirectory: string;
  cacheDirectory: string;
  databaseName: string;
  // NOW replace by dtoSyncparam
  syncAtStartup: DtoSyncParam
  // FEATURE additional settings
  // boolean: retrieve rulings when retrieving a card
  // boolean: retrieve image when retrieving a card


}
