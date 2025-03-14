import { ISyncParamDto } from "./sync-param.dto";

export type ICardSyncParam = Omit<
  ISyncParamDto,
  "catalogTypesToSync" | "syncCardSymbols" | "syncCardSets" | "rulingSyncType" | "oracleId"
>;
export type IRulingSyncParam = Omit<
  ISyncParamDto,
  "catalogTypesToSync" | "syncCardSymbols" | "syncCardSets" | "cardSyncType" | "cardImageStatusToSync" | "syncCardsSyncedBeforeNumber" | "syncCardsSyncedBeforeUnit" | "cardSetCodeToSyncCardsFor" | "changedImageStatusAction" | "bulkSyncUrl"
>;

export type ScryfallBulkDataType =
  "oracle_cards" |
  "unique_artwork" |
  "default_cards" |
  "all_cards" |
  "rulings";
