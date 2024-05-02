import { ICardSetSyncOptions } from "./card-set-sync.options";
import { ICatalogSyncOptions } from "./catalog-sync.options";

export * from "./card-set-sync.options";
export * from "./catalog-sync.options";
export * from "./sync.param";

export type SyncOptions = ICardSetSyncOptions | ICatalogSyncOptions
