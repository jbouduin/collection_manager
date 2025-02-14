import { WebContents } from "electron";
import { SyncParamDto } from "../../../../common/dto";

export interface IMtgSyncService {
  synchronize(syncParam: SyncParamDto, webContents: WebContents): Promise<void>;
}
