import { ICardSetSyncOptions } from "./card-set-sync.options";
import { ICardSyncOptions } from "./card-sync.options";
import { ICatalogSyncOptions } from "./catalog-sync.options";

export * from "./card-set-sync.options";
export * from "./card-sync.options";
export * from "./catalog-sync.options";
export * from "./sync.param";


export type SyncOptions = ICardSetSyncOptions | ICardSyncOptions| ICatalogSyncOptions ;
