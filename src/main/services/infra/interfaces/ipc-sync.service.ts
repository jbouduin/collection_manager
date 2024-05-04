import { ISyncParam, SyncOptions } from "../../../../common/ipc-params";


export interface IIpcSyncService {
  handle(params: ISyncParam<SyncOptions>): void;
}
