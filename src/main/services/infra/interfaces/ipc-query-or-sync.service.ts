import { RulingsByCardIdSelectDto } from "../../../../common/dto";
import { IQueryOrSyncParam, QueryOrSyncOptions } from "../../../../common/ipc-params";

export interface IIpcQueryOrSyncService {
  handle(params: IQueryOrSyncParam<QueryOrSyncOptions>): Promise<void | RulingsByCardIdSelectDto>;
}
