import { IQueryOrSyncParam, QueryOrSyncOptions } from "../../../../common/ipc-params";

export interface IIpcQueryService {
  handle(params: IQueryOrSyncParam<QueryOrSyncOptions>): Promise<void>;
}
