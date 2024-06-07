import { SyncType } from "../../../common/ipc-params";

export interface DtoMainConfiguration {
  rootDataDirectory: string;
  cacheDirectory: string;
  databaseName: string;
  syncAtStartup: Array<SyncType>
}
