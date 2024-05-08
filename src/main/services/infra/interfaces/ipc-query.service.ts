import { IQueryOrSyncParam, QueryOrSyncOptions } from "../../../../common/ipc-params";

export interface IIpcQueryService {
  // LATER: implement an interface IpcResult
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  handle(params: IQueryOrSyncParam<QueryOrSyncOptions>): Promise<any>;
}
