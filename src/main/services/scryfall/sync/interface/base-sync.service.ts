import { ProgressCallback } from "../../../../../common/ipc";

export interface IBaseSyncService<T> {
  sync(syncParam: T, progressCallback: ProgressCallback): Promise<void>;
}
