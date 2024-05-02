import { ICardSetSyncOptions, ICatalogSyncOptions } from "../../../common/ipc-params";

export interface IBaseSyncService<O extends ICardSetSyncOptions | ICatalogSyncOptions> {
  sync(options: O): Promise<void>;
}
