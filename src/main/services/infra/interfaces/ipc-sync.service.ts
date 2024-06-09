import { BrowserWindow } from "electron";

import { DtoSyncParam } from "../../../../common/dto";
import { ProgressCallback, SyncOptions, SyncParam } from "../../../../common/ipc-params";


export interface IIpcSyncService {
  handle(params: SyncParam<SyncOptions>): Promise<void>;
  newHandle(syncParam: DtoSyncParam, browserWindow: BrowserWindow): Promise<void>;
}
