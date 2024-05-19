import { CardSetSyncOptions } from "./card-set-sync.options";
import { CardSymbolSyncOptions } from "./card-symbol-sync.options";
import { CardSyncOptions } from "./card-sync.options";
import { CatalogSyncOptions } from "./catalog-sync.options";
import { RulingSyncOptions } from "./ruling-sync.options";
import { SyncType } from "./sync-type.enum";

export type SyncOptions = CardSetSyncOptions | CardSymbolSyncOptions | CardSyncOptions | CatalogSyncOptions | RulingSyncOptions;

export interface SyncParam<T extends SyncOptions> {
  type: SyncType;
  options: T
}
