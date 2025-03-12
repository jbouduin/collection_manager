import { WebContents } from "electron";
import { ISyncParamDto } from "../../../../common/dto";

export interface IMtgSyncService {
  synchronize(syncParam: ISyncParamDto, webContents: WebContents): Promise<void>;
}
