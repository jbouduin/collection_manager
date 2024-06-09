import { DtoSyncParam } from "../../../../..//common/dto";
import { ProgressCallback, SyncOptions } from "../../../../../common/ipc-params";

export interface IUntypedBaseSyncService{
  newSync(syncParam: DtoSyncParam, progressCallback: ProgressCallback): Promise<void>;
}
export interface IBaseSyncService<O extends SyncOptions> extends IUntypedBaseSyncService{
  sync(options: O, progressCallback: ProgressCallback): Promise<void>;
}
