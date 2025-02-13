import { BrowserWindow } from "electron";

import { SyncParamDto } from "../../../../common/dto";

export interface IIpcSyncService {
  handle(syncParam: SyncParamDto, browserWindow: BrowserWindow): Promise<void>;
}
