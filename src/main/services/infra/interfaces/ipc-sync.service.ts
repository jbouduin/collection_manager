import { IQueryOrSyncParam, QueryOrSyncOptions } from "../../../../common/ipc-params";


export interface IIpcSyncService {
  handle(params: IQueryOrSyncParam<QueryOrSyncOptions>): Promise<void>;
}
