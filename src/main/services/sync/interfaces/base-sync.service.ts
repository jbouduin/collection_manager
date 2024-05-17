import { ProgressCallback, QueryOptions } from "../../../../common/ipc-params";


export interface IBaseSyncService<O extends QueryOptions> {
  sync(options: O, progressCallback?: ProgressCallback): Promise<void>;
}
