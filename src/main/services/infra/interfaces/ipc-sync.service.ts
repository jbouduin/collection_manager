import { BrowserWindow } from "electron";

import { DtoSyncParam } from "../../../../common/dto";

export interface IIpcSyncService {
  handle(syncParam: DtoSyncParam, browserWindow: BrowserWindow): Promise<void>;
}
