import { IQueryParam, QueryOptions } from "../../../../common/ipc-params";


export interface IIpcSyncService {
  handle(params: IQueryParam<QueryOptions>): Promise<void>;
}
