import { SyncParamDto } from "../../../../..//common/dto";
import { ProgressCallback } from "../../../../../common/ipc-params";

export interface IBaseSyncService {
  sync(syncParam: SyncParamDto, progressCallback: ProgressCallback): Promise<void>;
}
