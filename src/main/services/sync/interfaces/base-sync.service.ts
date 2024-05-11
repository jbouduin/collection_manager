import { QueryOrSyncOptions } from "../../../../common/ipc-params";

export interface IBaseSyncService<O extends QueryOrSyncOptions> {
  sync(options: O, progressCallback?: (label: string) => void): Promise<void>;
}
