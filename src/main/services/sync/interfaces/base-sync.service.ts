import { QueryOrSyncOptions } from "../../../../common/ipc-params";
import { ProgressCallback } from "../../infra/implementation";

export interface IBaseSyncService<O extends QueryOrSyncOptions> {
  sync(options: O, progressCallback?: ProgressCallback): Promise<void>;
}
