import { SyncType } from "../../../common/ipc-params";

export interface DtoMainConfiguration {
  rootDataDirectory: string;
  cacheDirectory: string;
  databaseName: string;
  // NOW replace by dtoSyncparam
  syncAtStartup: Array<SyncType>
}
