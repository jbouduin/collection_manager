import { SyncOptions, SyncParam } from "../../../../common/ipc-params";


export interface IIpcSyncService {
  handle(params: SyncParam<SyncOptions>): Promise<void>;
}
