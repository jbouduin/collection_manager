import { CatalogType, ImageStatus, ChangedImageStatusAction, CardSyncType, RulingSyncType, TimespanUnit } from "../../types";

export interface DtoSyncParam {
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
  rulingSyncType: RulingSyncType;
  /**
   * Cards to sync
   */
  cardSyncType: CardSyncType;
  cardSelectionToSync: Array<string>;
  cardImageStatusToSync: Array<ImageStatus>;
  syncCardsSyncedBeforeNumber: number;
  syncCardsSyncedBeforeUnit: TimespanUnit;
  cardSetCodeToSyncCardsFor: string;
  changedImageStatusAction: ChangedImageStatusAction;

  /*
   * FEATURE additional settings
   * boolean: automatically retrieve rulings when retrieving a card
   * boolean: automatically retrieve image(s) when retrieving a card
   *  boolean: check for new released spoilers (future sets) (startup only)
   */
}
