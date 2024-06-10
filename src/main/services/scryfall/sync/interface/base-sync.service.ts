import { DtoSyncParam } from "../../../../..//common/dto";
import { ProgressCallback } from "../../../../../common/ipc-params";

export interface IBaseSyncService{
  sync(syncParam: DtoSyncParam, progressCallback: ProgressCallback): Promise<void>;
}
