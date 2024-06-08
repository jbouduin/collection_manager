import { CatalogType, ImageStatus } from "../../enums";
import { CardSyncType } from "./card-sync-type.enum";
import { RulingTypeSync } from "./ruling-sync-type.enum";
import { SyncSource } from "./sync-source.enum";

export interface DtoSyncParam {
  /**
   * The source requesting the synchronization
   */
  syncRequestSource: SyncSource;
  /**
   * The catalogs to be synced
   */
  catalogTypesToSync: Array<CatalogType>;
  /**
   * Master data to be synced
   */
  syncCardSymbols: boolean;
  syncCardSets: boolean;
  /**
   * Rulings to sync
   */
  syncRulings: RulingTypeSync;
  /**
   * Cards to sync
   */
  cardSyncTypesToSync: Array<CardSyncType>;
  cardSelectionToSync: Array<string>;
  cardImageTypesToSync: Array<ImageStatus>;
  syncCardsLastSyncedBefore: Date;

}
