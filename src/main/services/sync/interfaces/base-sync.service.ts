import { SyncOptions } from "../../../../common/ipc-params";

export interface IBaseSyncService<O extends SyncOptions> {
  sync(options: O): Promise<void>;
}
