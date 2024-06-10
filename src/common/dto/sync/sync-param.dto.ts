import { ChangedImageStatusAction } from "..";
import { CatalogType, ImageStatus } from "../../enums";
import { CardSyncType } from "./card-sync-type.enum";
import { RulingSyncType } from "./ruling-sync-type.enum";
import { TimespanUnit } from "./time-span-unit.enum";

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
}
