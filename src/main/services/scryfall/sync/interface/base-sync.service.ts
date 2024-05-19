import { ProgressCallback, SyncOptions } from "../../../../../common/ipc-params";


export interface IBaseSyncService<O extends SyncOptions> {
  sync(options: O, progressCallback: ProgressCallback): Promise<void>;
}
