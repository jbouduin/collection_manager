import { ICatalogSyncOptions } from "../../../../common/ipc-params";
import { IBaseSyncService } from "./base-sync.service";

export type ICatalogSyncService = IBaseSyncService<ICatalogSyncOptions>;
