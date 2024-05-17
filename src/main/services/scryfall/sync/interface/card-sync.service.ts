import { CardSyncOptions } from "../../../../../common/ipc-params";
import { IBaseSyncService } from "./base-sync.service";

export type ICardSyncService = IBaseSyncService<CardSyncOptions>;
