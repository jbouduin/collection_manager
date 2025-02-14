import { CardSyncParam, RulingSyncParam } from "../../../../../common/dto";
import { CatalogType } from "../../../../../common/types";
import { IBaseSyncService } from "./base-sync.service";

export type ICardSetSyncService = IBaseSyncService<void>;
export type ICardSymbolSyncService = IBaseSyncService<void>;
export type ICardSyncService = IBaseSyncService<CardSyncParam>;
export type ICatalogSyncService = IBaseSyncService<Array<CatalogType>>;
export type IRulingSyncService = IBaseSyncService<RulingSyncParam>;
