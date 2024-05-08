import { CardSetSyncOptions } from "./card-set-sync.options";
import { CardSyncOptions } from "./card-sync.options";
import { CatalogSyncOptions } from "./catalog-sync.options";
import { RulingQueryOrSyncOptions } from "./ruling-query-or-sync.options";
import { RulingSyncOptions } from "./ruling-sync.options";

export * from "./card-set-sync.options";
export * from "./card-sync.options";
export * from "./catalog-sync.options";
export * from "./darkmode.option";
export * from "./query-or-sync.param";
export * from "./query-or-sync-type.enum";
export * from "./ruling-query-or-sync.options";
export * from "./ruling-sync.options";
export * from "./ipc-channel.enum";

export type QueryOrSyncOptions = CardSetSyncOptions | CardSyncOptions | CatalogSyncOptions | RulingQueryOrSyncOptions | RulingSyncOptions;
