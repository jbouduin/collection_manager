import { IBaseSyncParam } from "../../../common/ipc-params";

export interface IBaseSyncService<P extends IBaseSyncParam> {
  sync(params: P): Promise<void>;
}
