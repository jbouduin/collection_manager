import { IQueryParam, QueryOptions } from "../../../../common/ipc-params";

export interface IIpcQueryService {
  // LATER: implement an interface IpcResult
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  handle(params: IQueryParam<QueryOptions>): Promise<any>;
}
