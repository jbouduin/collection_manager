import { ProgressCallback, QueryOrSyncOptions } from "../../../../common/ipc-params";


export interface IBaseSyncService<O extends QueryOrSyncOptions> {
  sync(options: O, progressCallback?: ProgressCallback): Promise<void>;
}
