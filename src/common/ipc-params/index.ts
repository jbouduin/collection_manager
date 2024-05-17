import { CardQueryOptions } from "./card-query.options";
import { CardSetSyncOptions } from "./card-set-sync.options";
import { CardSyncOptions } from "./card-sync.options";
import { CatalogSyncOptions } from "./catalog-sync.options";
import { RulingQueryOptions } from "./ruling-query.options";
import { RulingSyncOptions } from "./ruling-sync.options";

export * from "./card-query.options";
export * from "./card-set-sync.options";
export * from "./card-sync.options";
export * from "./catalog-sync.options";
export * from "./darkmode.option";
export * from "./query-or-sync.param";
export * from "./query-type.enum";
export * from "./ruling-query.options";
export * from "./ruling-sync.options";
export * from "./ipc-channel.enum";

export type QueryOptions = CardSetSyncOptions | CardSyncOptions | CatalogSyncOptions | RulingQueryOptions | RulingSyncOptions | CardQueryOptions;
export type ProgressCallback = (value: string) => void;
